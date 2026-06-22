/**
 * OpenAI 兼容外部 Agent 的客户端适配器。
 *
 * 不直接持有 API Key，所有请求通过后端安全代理转发。
 * 实现与 Native A2A Client 相同的 sendTask / getAgentCard 接口，供 client-factory 统一路由。
 */

/** 代理返回的内部格式 */
export interface ProxyChatResponse {
  reply: string;
  status: "success" | "error";
}

/** 用于 mock Agent Card 的元数据 */
export interface ExternalAgentMetadata {
  id: string;
  name: string;
  description: string;
  skills?: Array<{ id: string; name: string; description: string }>;
}

/** 统一的 Agent Card 结构（简化版，供工具注册使用） */
export interface MockAgentCard {
  name: string;
  description: string;
  skills?: Array<{ id: string; name: string; description: string }>;
}

/**
 * OpenAI 兼容外部 Agent 适配器。
 * 调用后端代理端点 `/api/v1/proxy/agent/{agentId}/chat`，不暴露原始凭证。
 */
export class OpenAIProxyAdapter {
  private readonly agentId: string;
  private readonly proxyEndpoint: string;
  private metadata: ExternalAgentMetadata;
  private cachedCard: MockAgentCard | null = null;

  constructor(
    agentId: string,
    proxyBaseUrl: string,
    metadata: ExternalAgentMetadata,
  ) {
    this.agentId = agentId;
    this.proxyEndpoint = `${proxyBaseUrl.replace(/\/$/, "")}/${agentId}/chat`;
    this.metadata = metadata;
  }

  /**
   * 返回本地 mock 的 Agent Card（使用数据库/配置文件中的元数据）。
   * 远程平台通常不提供 A2A Agent Card，因此在客户端构造。
   */
  async getAgentCard(): Promise<MockAgentCard> {
    if (!this.cachedCard) {
      this.cachedCard = {
        name: this.metadata.name,
        description: this.metadata.description,
        skills: this.metadata.skills,
      };
    }
    return this.cachedCard;
  }

  /**
   * 发送任务消息（非流式）。
   * @param text 当前用户消息
   * @param history 历史对话（OpenAI messages 格式）
   */
  async sendMessage(
    text: string,
    history: Array<{ role: string; content: string }> = [],
  ): Promise<ProxyChatResponse> {
    const payload = {
      message: text,
      history,
      stream: false,
    };

    const response = await fetch(this.proxyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => response.statusText);
      throw new Error(`代理 Agent 错误 (${response.status}): ${detail}`);
    }

    return (await response.json()) as ProxyChatResponse;
  }

  /**
   * 与 Native A2A Client 对齐的统一任务发送接口。
   * 外部 Agent 无 A2A 任务流，返回带进度前缀的字符串。
   */
  async sendTask(taskText: string): Promise<string> {
    const result = await this.sendMessage(taskText);
    if (result.status !== "success") {
      throw new Error(result.reply || "外部 Agent 返回错误");
    }
    return `[${this.metadata.name}] processing → success\nResult: ${result.reply}`;
  }
}
