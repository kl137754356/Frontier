/**
 * A2A 配置加载、客户端创建、委派工具与任务进度追踪。
 *
 * 本模块是 claw.exe（Rust）移植的逻辑规范参考。
 * TypeScript 版本可直接运行验证；Rust 实现请对照 docs/frontier-a2a-integration/claw-rust-integration.md。
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { tool } from "langchain";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import type { AgentCard, MessageSendParams, Part, Task } from "@a2a-js/sdk";
import { Client, ClientFactory } from "@a2a-js/sdk/client";

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 单个 Agent 配置项 */
export interface A2AAgentRecord {
  id: string;
  type: "native" | "openai_compatible";
  url?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
}

/** Webhook 推送配置 */
export interface A2AWebhookConfig {
  enabled: boolean;
  url?: string;
  token?: string;
}

/** 加载选项 */
export interface A2AOptions {
  connectTimeoutMs?: number;
  failFast?: boolean;
}

/** 完整 A2A 配置文件结构 */
export interface A2AConfig {
  agents: A2AAgentRecord[];
  webhook?: A2AWebhookConfig;
  options?: A2AOptions;
}

/** 已连接的 A2A 客户端条目 */
export interface A2AClientEntry {
  id: string;
  client: Client;
  card: AgentCard;
}

/** 任务进度记录（内存表，供查询 API 使用） */
export interface TaskProgress {
  taskId: string;
  agentName: string;
  agentId: string;
  states: string[];
  artifacts: string[];
  startedAt: string;
  updatedAt: string;
  result?: string;
  error?: string;
}

/** 实时进度事件（委派过程中触发） */
export type TaskProgressEvent =
  | {
      kind: "task_created";
      taskId: string;
      agentName: string;
      agentId: string;
      state: string;
    }
  | {
      kind: "state";
      taskId: string;
      agentName: string;
      agentId: string;
      state: string;
      message?: string;
      final?: boolean;
    }
  | {
      kind: "artifact";
      taskId: string;
      agentName: string;
      agentId: string;
      artifact: string;
    }
  | {
      kind: "completed";
      taskId: string;
      agentName: string;
      agentId: string;
      states: string[];
      result: string;
    };

/** 进度回调 — claw.exe 可对接为 TCP tool 增量输出 */
export type ProgressCallback = (event: TaskProgressEvent) => void;

/** 委派选项 */
export interface DelegateOptions {
  webhook?: A2AWebhookConfig;
  /** 流式事件回调，用于实时进度展示 */
  onProgress?: ProgressCallback;
}

/** Handoff 工具构建选项 */
export interface HandoffToolOptions extends DelegateOptions {
  /** 是否在工具返回值中包含进度链 */
  includeProgressInOutput?: boolean;
  /** 工具开始执行时回调（编排器级别） */
  onToolStart?: (agentName: string, toolName: string, task: string) => void;
  /** 工具执行完成时回调（编排器级别） */
  onToolEnd?: (agentName: string, toolName: string, output: string) => void;
}

// ---------------------------------------------------------------------------
// 内存任务进度表
// ---------------------------------------------------------------------------

const taskProgressStore = new Map<string, TaskProgress>();

/** 获取指定任务的进度 */
export function getTaskProgress(taskId: string): TaskProgress | undefined {
  return taskProgressStore.get(taskId);
}

/** 获取所有任务进度 */
export function getAllTaskProgress(): TaskProgress[] {
  return Array.from(taskProgressStore.values());
}

/** 默认控制台进度输出（立即 flush，适合 CLI 演示） */
export function createConsoleProgressLogger(prefix = "[A2A]"): ProgressCallback {
  const formatTime = () => new Date().toISOString().slice(11, 19);

  return (event) => {
    const ts = formatTime();
    switch (event.kind) {
      case "task_created":
        process.stdout.write(
          `\n${prefix} [${ts}] ${event.agentName} 任务已创建 ${event.taskId} → ${event.state}\n`,
        );
        break;
      case "state": {
        const detail = event.message ? ` (${event.message})` : "";
        const finalMark = event.final ? " [final]" : "";
        process.stdout.write(
          `${prefix} [${ts}] ${event.agentName} ${event.taskId} → ${event.state}${detail}${finalMark}\n`,
        );
        break;
      }
      case "artifact":
        process.stdout.write(
          `${prefix} [${ts}] ${event.agentName} ${event.taskId} artifact: ${event.artifact}\n`,
        );
        break;
      case "completed":
        process.stdout.write(
          `${prefix} [${ts}] ${event.agentName} ${event.taskId} 完成: ${event.states.join(" → ")}\n`,
        );
        break;
    }
  };
}

function emitProgress(
  options: DelegateOptions | undefined,
  event: TaskProgressEvent,
): void {
  options?.onProgress?.(event);
}

function upsertTaskProgress(
  taskId: string,
  agentName: string,
  agentId: string,
  patch: Partial<TaskProgress>,
): TaskProgress {
  const existing = taskProgressStore.get(taskId);
  const now = new Date().toISOString();

  const record: TaskProgress = {
    taskId,
    agentName,
    agentId,
    states: existing?.states ?? [],
    artifacts: existing?.artifacts ?? [],
    startedAt: existing?.startedAt ?? now,
    updatedAt: now,
    ...existing,
    ...patch,
  };

  taskProgressStore.set(taskId, record);
  return record;
}

// ---------------------------------------------------------------------------
// 配置加载
// ---------------------------------------------------------------------------

/** 解析默认配置文件路径：{CLAW_WORKSPACE}/.claw/a2a-agents.json */
export function resolveDefaultConfigPath(): string {
  const workspace =
    process.env.CLAW_WORKSPACE ||
    path.join(process.env.APPDATA || process.env.HOME || ".", "frontier-desktop");
  return path.join(workspace, ".claw", "a2a-agents.json");
}

/**
 * 加载 A2A 配置文件。
 * 路径优先级：参数 > 环境变量 A2A_CONFIG_PATH > 默认路径。
 * 文件缺失时返回 null（不抛错，保证零副作用）。
 */
export function loadA2AConfig(configPath?: string): A2AConfig | null {
  const resolved =
    configPath ||
    process.env.A2A_CONFIG_PATH ||
    resolveDefaultConfigPath();

  if (!fs.existsSync(resolved)) {
    console.info(`[A2A] 配置文件不存在，跳过 A2A 集成: ${resolved}`);
    return null;
  }

  try {
    const raw = fs.readFileSync(resolved, "utf8");
    const parsed = JSON.parse(raw) as A2AConfig;
    if (!Array.isArray(parsed.agents)) {
      console.warn(`[A2A] 配置文件格式无效（缺少 agents 数组）: ${resolved}`);
      return null;
    }
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[A2A] 读取配置文件失败: ${resolved} — ${message}`);
    return null;
  }
}

/** 判断 A2A 是否应启用（配置存在且至少有一个 enabled 的 agent） */
export function isA2AEnabled(config: A2AConfig | null): boolean {
  if (!config) return false;
  return config.agents.some((a) => a.enabled !== false && a.type === "native" && a.url);
}

/** 过滤出应连接的 native agent 记录 */
function enabledNativeAgents(config: A2AConfig): A2AAgentRecord[] {
  return config.agents.filter(
    (a) => a.type === "native" && a.url && a.enabled !== false,
  );
}

// ---------------------------------------------------------------------------
// 客户端创建
// ---------------------------------------------------------------------------

const defaultClientFactory = new ClientFactory();

/**
 * 根据配置创建 A2A 客户端列表。
 * 单个 URL 失败时：failFast=true 则抛错；failFast=false 则跳过并继续。
 */
export async function createA2AClients(
  config: A2AConfig,
  factory: ClientFactory = defaultClientFactory,
): Promise<A2AClientEntry[]> {
  const agents = enabledNativeAgents(config);
  if (agents.length === 0) {
    console.info("[A2A] agents 为空或全部禁用，不创建客户端");
    return [];
  }

  const failFast = config.options?.failFast ?? false;
  const entries: A2AClientEntry[] = [];

  for (const agent of agents) {
    try {
      const client = await factory.createFromUrl(agent.url!);
      const card = await client.getAgentCard();
      entries.push({ id: agent.id, client, card });
      console.info(`[A2A] 已连接: ${card.name} (${agent.url})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[A2A] 连接失败 ${agent.id} (${agent.url}): ${message}`);
      if (failFast) {
        throw new Error(`A2A failFast: 无法连接 ${agent.id}: ${message}`);
      }
    }
  }

  return entries;
}

// ---------------------------------------------------------------------------
// 文本与任务结果提取
// ---------------------------------------------------------------------------

function textPartText(parts?: Part[]): string {
  return (
    parts
      ?.filter((part) => part.kind === "text")
      .map((part) => part.text)
      .join("") ?? ""
  );
}

function taskResultText(task: Task): string {
  const statusText = textPartText(task.status.message?.parts);
  if (statusText) return statusText;

  const artifactText = task.artifacts
    ?.flatMap((artifact) =>
      artifact.parts
        .filter((part) => part.kind === "text")
        .map((part) => part.text),
    )
    .join("\n");

  return artifactText ?? `Task ${task.id} finished with state ${task.status.state}`;
}

/** Agent Card 名称转工具名（snake_case） */
export function cardNameToToolName(cardName: string): string {
  return cardName.toLowerCase().replace(/\s+/g, "_");
}

function buildSkillDescription(card: AgentCard): string {
  const skillSummary = card.skills
    ?.map((skill) => `${skill.name}: ${skill.description}`)
    .join("; ");
  return skillSummary
    ? `${card.description} Skills: ${skillSummary}`
    : card.description;
}

// ---------------------------------------------------------------------------
// 任务委派与流式进度
// ---------------------------------------------------------------------------

/**
 * 向远程 A2A Agent 委派任务，监听流式事件并更新进度表。
 * 返回格式化的工具输出字符串（含进度链与最终结果）。
 */
export async function delegateTask(
  client: Client,
  cardName: string,
  agentId: string,
  taskText: string,
  options?: DelegateOptions,
): Promise<string> {
  const params: MessageSendParams = {
    message: {
      kind: "message",
      messageId: uuidv4(),
      role: "user",
      parts: [{ kind: "text", text: taskText }],
    },
  };

  if (options?.webhook?.enabled && options.webhook.url && options.webhook.token) {
    params.configuration = {
      pushNotificationConfig: {
        url: options.webhook.url,
        token: options.webhook.token,
      },
    };
  }

  let taskId: string | undefined;
  const states: string[] = [];

  for await (const event of client.sendMessageStream(params)) {
    if (event.kind === "message") {
      const reply = textPartText(event.parts);
      if (taskId) {
        emitProgress(options, {
          kind: "completed",
          taskId,
          agentName: cardName,
          agentId,
          states,
          result: reply,
        });
      }
      return formatToolOutput(cardName, taskId, states, reply);
    }

    if (event.kind === "task") {
      taskId = event.id;
      states.push(event.status.state);
      upsertTaskProgress(taskId, cardName, agentId, { states: [...states] });
      emitProgress(options, {
        kind: "task_created",
        taskId,
        agentName: cardName,
        agentId,
        state: event.status.state,
      });
      continue;
    }

    taskId = event.taskId;

    if (event.kind === "status-update") {
      if (!states.includes(event.status.state)) {
        states.push(event.status.state);
      }
      upsertTaskProgress(taskId, cardName, agentId, { states: [...states] });

      const messageText = textPartText(event.status.message?.parts);
      emitProgress(options, {
        kind: "state",
        taskId,
        agentName: cardName,
        agentId,
        state: event.status.state,
        message: messageText || undefined,
        final: event.final,
      });

      if (event.final) {
        const finalTask = await client.getTask({ id: event.taskId });
        const result = taskResultText(finalTask);
        upsertTaskProgress(taskId, cardName, agentId, {
          states: [...states],
          result,
        });
        emitProgress(options, {
          kind: "completed",
          taskId,
          agentName: cardName,
          agentId,
          states: [...states],
          result,
        });
        return formatToolOutput(cardName, taskId, states, result);
      }
    } else if (event.kind === "artifact-update") {
      const artifactName =
        event.artifact.name ?? event.artifact.artifactId ?? "artifact";
      const progress = taskProgressStore.get(taskId);
      const artifacts = [...(progress?.artifacts ?? []), artifactName];
      upsertTaskProgress(taskId, cardName, agentId, { artifacts });
      emitProgress(options, {
        kind: "artifact",
        taskId,
        agentName: cardName,
        agentId,
        artifact: artifactName,
      });
    }
  }

  if (taskId) {
    const finalTask = await client.getTask({ id: taskId });
    const result = taskResultText(finalTask);
    upsertTaskProgress(taskId, cardName, agentId, { states, result });
    emitProgress(options, {
      kind: "completed",
      taskId,
      agentName: cardName,
      agentId,
      states: [...states],
      result,
    });
    return formatToolOutput(cardName, taskId, states, result);
  }

  throw new Error(`${cardName} 流结束但未返回任务或消息`);
}

/** 格式化工具返回值（Frontier UI 通过 tool_end 展示此文本） */
export function formatToolOutput(
  cardName: string,
  taskId: string | undefined,
  states: string[],
  result: string,
): string {
  const progressLine =
    taskId && states.length > 0
      ? `[${cardName}] Task ${taskId}: ${states.join(" → ")}\n`
      : `[${cardName}] `;
  return `${progressLine}Result: ${result}`;
}

// ---------------------------------------------------------------------------
// Handoff 工具构建（LangChain 参考实现，Rust 对照用）
// ---------------------------------------------------------------------------

/**
 * 为每个已连接的 A2A Agent 构建一个 function calling 工具。
 * 工具 schema 仅含单个参数 task（完整自然语言任务描述）。
 */
export function buildHandoffTools(
  entries: A2AClientEntry[],
  options?: HandoffToolOptions,
) {
  return entries.map(({ id, client, card }) => {
    const toolName = cardNameToToolName(card.name);
    const description = buildSkillDescription(card);

    return tool(
      async ({ task }: { task: string }) => {
        options?.onToolStart?.(card.name, toolName, task);
        try {
          const output = await delegateTask(client, card.name, id, task, {
            webhook: options?.webhook,
            onProgress: options?.onProgress,
          });
          options?.onToolEnd?.(card.name, toolName, output);
          return output;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const errOutput = `${card.name} error: ${message}`;
          options?.onToolEnd?.(card.name, toolName, errOutput);
          return errOutput;
        }
      },
      {
        name: toolName,
        description,
        schema: z.object({
          task: z
            .string()
            .describe(`委派给 ${card.name} 的完整自然语言任务`),
        }),
      },
    );
  });
}

/**
 * 生成追加到 system prompt 的 A2A 委派说明。
 * 引导 LLM 在合适场景调用远程专家工具。
 */
export function buildA2ASystemPromptSupplement(entries: A2AClientEntry[]): string {
  if (entries.length === 0) return "";

  const toolLines = entries.map(({ card }) => {
    const toolName = cardNameToToolName(card.name);
    return `- 使用 ${toolName} 处理与「${card.description}」相关的任务`;
  });

  return [
    "你可以将专业任务委派给以下远程专家 Agent：",
    ...toolLines,
    "对于多步任务，按顺序调用工具，并将上一步结果传递给下一步。",
    "在回复中说明每个结果来自哪个专家 Agent。",
  ].join("\n");
}
