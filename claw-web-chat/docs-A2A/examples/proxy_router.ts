/**
 * 外部 Agent 安全代理路由（Express）。
 *
 * 职责：
 * 1. 从安全存储获取 agent 配置（含 API Key）
 * 2. 将内部 payload 转换为 OpenAI 格式
 * 3. 服务端转发请求，密钥永不暴露给前端/claw
 * 4. 校验请求用户是否拥有该 agent（防 IDOR）
 */

import { Router, type Request, type Response, type NextFunction } from "express";

/** 数据库中的外部 Agent 配置 */
export interface ExternalAgentConfig {
  id: string;
  user_id: string;
  name: string;
  description: string;
  base_url: string;
  api_key: string;
}

/** 客户端 → 代理 的内部 payload */
export interface InternalChatPayload {
  message: string;
  history?: Array<{ role: string; content: string }>;
  stream?: boolean;
}

/** 代理 → 客户端 的内部响应 */
export interface InternalChatResponse {
  reply: string;
  status: "success" | "error";
}

/**
 * Agent 存储接口 — 生产环境替换为数据库实现。
 * 必须实现 ownership 校验，防止 IDOR。
 */
export interface ExternalAgentStore {
  getAgentByIdAndUser(
    agentId: string,
    userId: string,
  ): Promise<ExternalAgentConfig | null>;
}

/** 从 JSON 文件加载的本地开发存储 */
export class JsonFileAgentStore implements ExternalAgentStore {
  private agents: ExternalAgentConfig[];

  constructor(agents: ExternalAgentConfig[]) {
    this.agents = agents;
  }

  async getAgentByIdAndUser(
    agentId: string,
    userId: string,
  ): Promise<ExternalAgentConfig | null> {
    return (
      this.agents.find((a) => a.id === agentId && a.user_id === userId) ?? null
    );
  }
}

/**
 * 从请求中提取当前用户 ID。
 * 生产环境应替换为 JWT / Session 解析。
 */
export function extractUserId(req: Request): string {
  const headerUserId = req.headers["x-user-id"];
  if (typeof headerUserId === "string" && headerUserId.length > 0) {
    return headerUserId;
  }
  // 本地开发默认用户
  return "dev-user-001";
}

/** 将内部 payload 转换为 OpenAI chat/completions 格式 */
export function toOpenAIPayload(payload: InternalChatPayload): {
  model: string;
  messages: Array<{ role: string; content: string }>;
  stream: boolean;
} {
  const messages: Array<{ role: string; content: string }> = [];

  for (const hist of payload.history ?? []) {
    messages.push({ role: hist.role, content: hist.content });
  }
  messages.push({ role: "user", content: payload.message });

  return {
    model: "agent",
    messages,
    stream: payload.stream ?? false,
  };
}

/** 从 OpenAI 响应中提取回复文本 */
export function fromOpenAIResponse(data: unknown): string {
  const resp = data as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }

  const content = resp.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("外部平台响应格式异常：缺少 choices[0].message.content");
  }
  return content;
}

export interface ProxyRouterOptions {
  store: ExternalAgentStore;
}

/**
 * 创建代理路由，挂载路径：/api/v1/proxy/agent/:agentId/chat
 */
export function createProxyRouter(options: ProxyRouterOptions): Router {
  const router = Router();
  const { store } = options;

  router.post(
    "/:agentId/chat",
    async (req: Request, res: Response, next: NextFunction) => {
      const { agentId } = req.params;
      const userId = extractUserId(req);
      const payload = req.body as InternalChatPayload;

      if (!payload?.message) {
        res.status(400).json({ error: "缺少 message 字段" });
        return;
      }

      try {
        // 安全：校验用户是否拥有该 agent
        const agentConfig = await store.getAgentByIdAndUser(agentId, userId);
        if (!agentConfig) {
          res.status(404).json({ error: "Agent 配置不存在或无权访问" });
          return;
        }

        const openaiPayload = toOpenAIPayload(payload);

        const response = await fetch(agentConfig.base_url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${agentConfig.api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(openaiPayload),
          signal: AbortSignal.timeout(60_000),
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => response.statusText);
          res.status(response.status).json({
            error: `外部平台错误: ${detail}`,
          });
          return;
        }

        const externalData = await response.json();
        const reply = fromOpenAIResponse(externalData);

        const result: InternalChatResponse = {
          reply,
          status: "success",
        };
        res.json(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (error instanceof Error && error.name === "TimeoutError") {
          res.status(504).json({ error: "外部 Agent 请求超时" });
          return;
        }
        res.status(502).json({ error: `无法连接外部 Agent: ${message}` });
      }
    },
  );

  return router;
}
