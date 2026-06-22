/**
 * 统一客户端工厂：按 agent 类型路由到 Native A2A 或 OpenAI 代理适配器。
 *
 * claw.exe Rust 实现时，在工具注册阶段调用此工厂逻辑的对等实现。
 */

import { ClientFactory } from "@a2a-js/sdk/client";
import type { AgentCard } from "@a2a-js/sdk";
import {
  OpenAIProxyAdapter,
  type ExternalAgentMetadata,
  type MockAgentCard,
} from "./OpenAIProxyAdapter.ts";

/** Native A2A Agent 配置 */
export interface NativeAgentRecord {
  type: "native";
  url: string;
  id?: string;
}

/** OpenAI 兼容外部 Agent 配置（无密钥，仅元数据） */
export interface OpenAICompatibleAgentRecord {
  type: "openai_compatible";
  id: string;
  name: string;
  description: string;
  skills?: ExternalAgentMetadata["skills"];
}

export type AgentRecord = NativeAgentRecord | OpenAICompatibleAgentRecord;

/** 统一客户端接口（Native 与 External 均实现） */
export interface UnifiedAgentClient {
  getAgentCard(): Promise<AgentCard | MockAgentCard>;
  sendTask(taskText: string): Promise<string>;
}

/** Native A2A 客户端包装 */
class NativeClientWrapper implements UnifiedAgentClient {
  constructor(
    private readonly client: Awaited<ReturnType<ClientFactory["createFromUrl"]>>,
    private readonly delegateFn: (
      client: Awaited<ReturnType<ClientFactory["createFromUrl"]>>,
      cardName: string,
      agentId: string,
      task: string,
    ) => Promise<string>,
    private readonly agentId: string,
  ) {}

  async getAgentCard(): Promise<AgentCard> {
    return this.client.getAgentCard();
  }

  async sendTask(taskText: string): Promise<string> {
    const card = await this.getAgentCard();
    return this.delegateFn(this.client, card.name, this.agentId, taskText);
  }
}

/** External 客户端包装 */
class ExternalClientWrapper implements UnifiedAgentClient {
  constructor(private readonly adapter: OpenAIProxyAdapter) {}

  async getAgentCard(): Promise<MockAgentCard> {
    return this.adapter.getAgentCard();
  }

  async sendTask(taskText: string): Promise<string> {
    return this.adapter.sendTask(taskText);
  }
}

const nativeFactory = new ClientFactory();

export const clientFactory = {
  /**
   * 根据 agent 记录类型创建统一客户端。
   * @param record Agent 配置
   * @param proxyBaseUrl openai_compatible 类型必填
   * @param delegateFn native 类型的委派函数（来自 a2a-config-loader.delegateTask）
   */
  async create(
    record: AgentRecord,
    proxyBaseUrl?: string,
    delegateFn?: (
      client: Awaited<ReturnType<ClientFactory["createFromUrl"]>>,
      cardName: string,
      agentId: string,
      task: string,
    ) => Promise<string>,
  ): Promise<UnifiedAgentClient> {
    if (record.type === "native") {
      if (!record.url) {
        throw new Error("Native agent 缺少 url 字段");
      }
      const client = await nativeFactory.createFromUrl(record.url);
      const agentId = record.id ?? record.url;
      const delegate = delegateFn ?? (async () => {
        throw new Error("Native agent 需要提供 delegateFn");
      });
      return new NativeClientWrapper(client, delegate, agentId);
    }

    if (record.type === "openai_compatible") {
      if (!proxyBaseUrl) {
        throw new Error("openai_compatible agent 需要提供 proxyBaseUrl");
      }
      const metadata: ExternalAgentMetadata = {
        id: record.id,
        name: record.name,
        description: record.description,
        skills: record.skills,
      };
      const adapter = new OpenAIProxyAdapter(record.id, proxyBaseUrl, metadata);
      return new ExternalClientWrapper(adapter);
    }

    throw new Error(`不支持的 agent 类型: ${(record as AgentRecord).type}`);
  },
};
