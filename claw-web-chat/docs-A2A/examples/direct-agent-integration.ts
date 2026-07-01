/**
 * 直接 Agent 集成示例 — 非 MCP、非硬编码 URL。
 *
 * 演示 claw.exe 应在 agent 初始化阶段执行的逻辑：
 * 1. 加载可选配置
 * 2. 若 agents 非空，创建客户端并注册 handoff 工具
 * 3. 否则保持原有行为
 *
 * 本脚本使用 streamMode: "updates" 与 onProgress 回调，在终端实时输出进度。
 *
 * 运行前：
 *   npx tsx weather_agent.ts          # 终端 1
 *   npx tsx file_write_agent.ts       # 终端 2（可选）
 *   $env:A2A_CONFIG_PATH = ".\docs\frontier-a2a-integration\a2a-agents.example.json"
 *   npx tsx docs/examples/direct-agent-integration.ts "查询东京天气"
 */

import "../../load-env.ts";
import { createAgent } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { ToolMessage } from "@langchain/core/messages";
import {
  loadA2AConfig,
  isA2AEnabled,
  createA2AClients,
  buildHandoffTools,
  buildA2ASystemPromptSupplement,
  getAllTaskProgress,
  createConsoleProgressLogger,
} from "./a2a-config-loader.ts";

const BASE_SYSTEM_PROMPT = `你是 Frontier 编排助手。根据用户需求选择合适的工具完成任务。`;

function logOrchestrator(message: string): void {
  const ts = new Date().toISOString().slice(11, 19);
  process.stdout.write(`[编排] [${ts}] ${message}\n`);
}

async function createFrontierAgent() {
  const llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL!,
    apiKey: process.env.OPENAI_API_KEY!,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL!,
    },
    temperature: 0,
  });

  const baseTools: ReturnType<typeof buildHandoffTools> = [];
  let systemPrompt = BASE_SYSTEM_PROMPT;

  const a2aConfig = loadA2AConfig();
  const onProgress = createConsoleProgressLogger("[A2A]");

  if (isA2AEnabled(a2aConfig)) {
    const entries = await createA2AClients(a2aConfig!);

    if (entries.length > 0) {
      const handoffTools = buildHandoffTools(entries, {
        webhook: a2aConfig!.webhook,
        onProgress,
        onToolStart: (agentName, toolName, task) => {
          const preview = task.length > 80 ? `${task.slice(0, 80)}...` : task;
          logOrchestrator(`调用工具 ${toolName}（${agentName}）: ${preview}`);
        },
        onToolEnd: (agentName, toolName) => {
          logOrchestrator(`工具 ${toolName}（${agentName}）执行完成`);
        },
      });
      baseTools.push(...handoffTools);
      systemPrompt += "\n\n" + buildA2ASystemPromptSupplement(entries);

      console.info(
        `[集成] 已注册 ${entries.length} 个 A2A 委派工具:`,
        entries.map((e) => e.card.name).join(", "),
      );
    } else {
      console.info("[集成] 无可用 A2A Agent，保持原有行为");
    }
  } else {
    console.info("[集成] A2A 未启用（配置缺失或 agents 为空），保持原有行为");
  }

  return createAgent({
    model: llm,
    tools: baseTools,
    systemPrompt,
  });
}

const userMessage = process.argv[2] ?? "查询东京天气";
const agent = await createFrontierAgent();

logOrchestrator(`收到用户请求，开始编排: ${userMessage}`);

let finalContent = "";

// 使用 stream + updates 模式，工具节点完成时立即输出（而非等 invoke 结束）
const stream = await agent.stream(
  { messages: [{ role: "user", content: userMessage }] },
  { streamMode: "updates" },
);

for await (const update of stream) {
  // update 形如 { tools: { messages: [ToolMessage, ...] } } 或 { agent: { messages: [...] } }
  for (const [node, nodeUpdate] of Object.entries(update)) {
    const messages = (nodeUpdate as { messages?: unknown[] })?.messages;
    if (!Array.isArray(messages)) continue;

    for (const msg of messages) {
      if (ToolMessage.isInstance(msg)) {
        const preview =
          typeof msg.content === "string"
            ? msg.content.slice(0, 120).replace(/\n/g, " ")
            : String(msg.content);
        logOrchestrator(`[${node}] 工具返回: ${preview}${preview.length >= 120 ? "..." : ""}`);
      } else if (
        msg &&
        typeof msg === "object" &&
        "content" in msg &&
        typeof (msg as { content: unknown }).content === "string"
      ) {
        const content = (msg as { content: string }).content;
        if (content) finalContent = content;
      }
    }
  }
}

console.log("\n=== 任务进度记录（汇总） ===");
const progress = getAllTaskProgress();
if (progress.length === 0) {
  console.log("无 A2A 任务记录。");
} else {
  for (const p of progress) {
    console.log(`- ${p.taskId}: ${p.states.join(" → ")}`);
  }
}

console.log("\n=== 编排器回复 ===");
console.log(finalContent || "(无文本回复)");
