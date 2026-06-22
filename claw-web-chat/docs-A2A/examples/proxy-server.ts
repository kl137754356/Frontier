/**
 * 外部 Agent 代理 — 本地开发独立服务器。
 *
 * 运行：
 *   $env:EXTERNAL_AGENTS_JSON = ".\docs\examples\external-agents-registry.example.json"
 *   npx tsx docs/examples/proxy-server.ts
 *
 * 测试：
 *   curl -X POST http://localhost:8081/api/v1/proxy/agent/fastgpt-assistant/chat \
 *     -H "Content-Type: application/json" \
 *     -H "x-user-id: dev-user-001" \
 *     -d '{"message":"你好","history":[],"stream":false}'
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import {
  createProxyRouter,
  JsonFileAgentStore,
  type ExternalAgentConfig,
} from "./proxy_router.ts";

const PORT = parseInt(process.env.PROXY_PORT || "8081", 10);
const defaultRegistry = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "external-agents-registry.example.json",
);
const registryPath = process.env.EXTERNAL_AGENTS_JSON || defaultRegistry;

function loadRegistry(): ExternalAgentConfig[] {
  if (!fs.existsSync(registryPath)) {
    console.warn(`[Proxy] 注册表不存在: ${registryPath}`);
    return [];
  }
  const raw = fs.readFileSync(registryPath, "utf8");
  const parsed = JSON.parse(raw) as { agents: ExternalAgentConfig[] };
  return parsed.agents ?? [];
}

const app = express();
app.use(express.json());

const store = new JsonFileAgentStore(loadRegistry());
app.use("/api/v1/proxy/agent", createProxyRouter({ store }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`[Proxy] 外部 Agent 代理运行于 http://localhost:${PORT}`);
  console.log(`[Proxy] 注册表: ${registryPath}`);
  console.log(`[Proxy] 已加载 ${loadRegistry().length} 个 Agent 配置`);
});
