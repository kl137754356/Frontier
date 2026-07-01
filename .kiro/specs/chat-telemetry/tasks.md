# 实现计划：Chat Telemetry

## 概览

在 `claw-web-chat/backend` 的 adapter 层实现聊天遥测功能。采集逻辑位于 `src/telemetry/` 目录，集成点在 `src/agui-server.ts`。使用 `better-sqlite3` 同步写库、`setInterval` 定时上报、`fast-check` + `vitest` 做属性测试。

## 任务

- [ ] 1. 安装依赖
  - 在 `claw-web-chat/backend/package.json` 中添加 `better-sqlite3` 和 `@types/better-sqlite3`
  - 运行 `npm install`（或 yarn）确认依赖安装成功
  - _需求：2.1_

- [ ] 2. 定义公共类型
  - 创建 `src/telemetry/types.ts`
  - 定义 `ToolCallRecord`、`UsageRecord`、`UploadStatus`、`ChatRecord`、`UploaderConfig` 接口/类型
  - 与 design.md 中的数据模型保持一致
  - _需求：1.3, 2.3, 5.1_

- [ ] 3. 实现 LocalStore
  - [ ] 3.1 创建 `src/telemetry/local-store.ts`，实现 `LocalStore` 类
    - 构造函数接收 `dbPath: string`（支持 `':memory:'` 用于测试）
    - `init()`：使用 `better-sqlite3` 创建数据库文件，执行建表 SQL 和索引（`chat_records` 表，含 `idx_upload_status`、`idx_session_id`）
    - `insert(record: ChatRecord)`：插入一条记录，`upload_status` 固定为 `'pending'`，`fail_count` 固定为 0
    - `getPending(limit: number)`：查询 `upload_status = 'pending'` 的记录，按 `created_at` 升序，最多 `limit` 条
    - `updateStatus(recordIds: string[], status: UploadStatus)`：批量更新状态
    - `incrementFailCount(recordIds: string[])`：`fail_count += 1`，若达到阈值（10）则更新为 `'failed'`
    - `close()`：关闭数据库连接
    - _需求：2.1, 2.2, 2.3, 2.5, 4.3, 4.4_

  - [ ]* 3.2 为 LocalStore 编写属性测试（fast-check）
    - **属性 4：新记录初始状态为 pending**，验证需求 2.2
    - **属性 5：记录字段完整性**，验证需求 2.3
    - **属性 2：record_id 全局唯一性**，验证需求 1.3
    - **属性 6：Uploader 只处理 pending 记录（getPending 不返回 uploaded/failed）**，验证需求 3.1, 4.2
    - **属性 8：批次大小上限（getPending(200) 返回 ≤ 200 条）**，验证需求 3.5
    - 每个属性独立测试函数，注释标注 `// Feature: chat-telemetry, Property N: <描述>`，`numRuns: 100`
    - 测试文件：`src/telemetry/__tests__/local-store.property.test.ts`

- [ ] 4. 实现 TelemetryCollector
  - [ ] 4.1 创建 `src/telemetry/collector.ts`，实现 `TelemetryCollector` 类
    - 构造函数接收 `LocalStore` 实例和可选 `collectEnabled` 参数（默认读 `process.env.COLLECT_ENABLED !== 'false'`）
    - `sanitize(content: string): string`：正则替换 PII（手机号→`[PHONE]`、邮箱→`[EMAIL]`、API Key→`[API_KEY]`、身份证→`[ID_CARD]`）
    - `recordUser(params)`：组装 `ChatRecord`（role='user'），sanitize content，fire-and-forget 调 `localStore.insert()`
    - `recordAssistant(params)`：组装 `ChatRecord`（role='assistant'），sanitize content，fire-and-forget 插入
    - `recordError(params)`：组装 `ChatRecord`（role='error'），fire-and-forget 插入
    - 所有 `record*` 方法在 `collectEnabled === false` 时立即返回
    - 所有写库操作包裹 `try/catch`，失败只 `console.error`，不向上抛出
    - `stop()`：将 `collectEnabled` 设为 false
    - _需求：1.1, 1.2, 1.3, 2.2, 2.4, 6.1, 6.3_

  - [ ]* 4.2 为 TelemetryCollector 编写属性测试
    - **属性 1：消息角色采集完整性**，验证需求 1.1, 1.2
    - **属性 3：流式内容完整拼接**（模拟多 chunk 累加后调 recordAssistant，验证 content 等于 join）验证需求 1.4
    - 测试文件：`src/telemetry/__tests__/collector.property.test.ts`

- [ ] 5. 实现 Uploader
  - [ ] 5.1 创建 `src/telemetry/uploader.ts`，实现 `Uploader` 类
    - 构造函数接收 `LocalStore` 实例
    - `start(config: UploaderConfig)`：用 `setInterval` 按 `intervalMs` 定时调 `flush()`
    - `flush()`：
      1. 调 `localStore.getPending(batchSize)`
      2. 若无记录则跳过
      3. 按 `maxBatchBytes`（1MB）将批次拆分为多个子批次（`splitBatches` 私有方法）
      4. 每个子批次通过 `fetch` HTTP POST 到 `remoteApiUrl`，带 `Authorization: Bearer <token>` 和 `Content-Type: application/json`
      5. 成功（2xx）→ `updateStatus(ids, 'uploaded')`；失败/超时 → `incrementFailCount(ids)`
      6. 网络错误捕获后不抛出
    - `stop(flushBeforeStop?: boolean)`：清除定时器；若 `flushBeforeStop` 则加 5s 超时保护后执行一次 `flush()`
    - `splitBatches(records: ChatRecord[], maxBytes: number): ChatRecord[][]`：将 records 拆分，保证每段序列化 ≤ maxBytes
    - _需求：3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1_

  - [ ]* 5.2 为 Uploader 编写属性测试
    - **属性 7：上报成功/失败状态转换**（mock fetch，随机 2xx/5xx，验证状态转换），验证需求 3.3, 3.4, 4.1
    - **属性 9：1MB 自动拆分**（生成随机大批次，验证每子批次 ≤ 1MB，合并后记录集合等价），验证需求 5.4
    - **属性 10：上报格式规范**（验证 body 为合法 JSON 数组，含 5 个必填字段，Content-Type 头存在），验证需求 5.1, 5.3
    - 测试文件：`src/telemetry/__tests__/uploader.property.test.ts`

- [ ] 6. 检查点：运行所有测试
  - 执行 `vitest run`，确保所有属性测试和单元测试通过，有问题先解决再继续

- [ ] 7. 创建 telemetry 模块入口
  - 创建 `src/telemetry/index.ts`，导出 `LocalStore`、`TelemetryCollector`、`Uploader` 及公共类型
  - _需求：全部_

- [ ] 8. 集成到 agui-server.ts
  - [ ] 8.1 在 `src/agui-server.ts` 顶层初始化 telemetry 模块
    - 导入 `LocalStore`、`TelemetryCollector`、`Uploader`
    - 模块加载时调 `localStore.init()`，失败则禁用采集
    - 创建 `sessionTurnCounters: Map<string, number>`（turn 计数器）
    - 创建 `telemetryCollector` 和 `uploader` 实例
    - 调 `uploader.start(config)`（从环境变量读 `TELEMETRY_API_URL`、`TELEMETRY_AUTH_TOKEN`，默认 intervalMs=60000）
    - _需求：3.6, 6.2_

  - [ ] 8.2 在 `handleAgentRun` 中插入采集点 A（用户消息）
    - 在 `tcpBridge.sendPrompt()` 调用前，读取并递增 `sessionTurnCounters` 中 `threadId` 对应值
    - 调 `telemetryCollector.recordUser({ sessionId: threadId, turnId: runId, turnIndex, content: lastUserMsg })`
    - _需求：1.1_

  - [ ] 8.3 在 `handleAgentRun` 的 `done` 分支插入采集点 B（assistant 完整回复）
    - 在 `done` 事件处理末尾调 `telemetryCollector.recordAssistant({...})`，传入 accumulatedText、toolCalls、usage、latencyMs、firstChunkMs
    - _需求：1.2, 1.4_

  - [ ] 8.4 在 `handleAgentRun` 的 `error` 分支插入采集点 C（错误事件）
    - 在错误处理分支调 `telemetryCollector.recordError({ sessionId, turnId, errorText })`
    - _需求：1.2_

  - [ ] 8.5 添加退出登录时的停止逻辑
    - 在用户退出登录的处理路径中调 `telemetryCollector.stop()` 和 `uploader.stop(true)`
    - _需求：6.3_

- [ ] 9. 集成验证
  - [ ] 9.1 编写端到端集成测试
    - 使用内存 SQLite（`:memory:`）实例化 `LocalStore`
    - 调用 `telemetryCollector.recordUser(...)` 和 `telemetryCollector.recordAssistant(...)`
    - 查询 `localStore.getPending(10)`，断言记录数量、role 和 content 符合预期
    - 测试文件：`src/telemetry/__tests__/integration.test.ts`
    - _需求：1.1, 1.2, 2.2, 2.3_

- [ ] 10. 最终检查点：确保所有测试通过
  - 执行 `vitest run`，全部绿灯后工作完成，如有问题请告知

## 备注

- 标 `*` 的子任务为可选测试任务，可跳过以加速 MVP
- `LocalStore` 构造函数支持 `':memory:'`，所有测试均使用内存数据库，无需清理文件
- 属性测试每个属性各为独立测试函数，注释须标注 `// Feature: chat-telemetry, Property N`
- 环境变量：`COLLECT_ENABLED`（默认 `'true'`）、`TELEMETRY_API_URL`、`TELEMETRY_AUTH_TOKEN`
