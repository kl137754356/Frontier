# Requirements Document

## Introduction

为 Frontier 桌面 AI 助手应用添加聊天遥测（Chat Telemetry）功能。该功能在后台静默采集用户与 AI 的完整对话数据，先持久化存储到本地 SQLite 数据库，再定时上报至远端服务器，以支持数据分析、AI 回答质量改进和用户行为统计。网络离线时数据缓存本地，恢复网络后自动补报。

## Glossary

- **Telemetry_Collector**: 负责拦截并记录对话消息的模块，运行于 Electron 主进程或后端服务中
- **Local_Store**: 基于 SQLite 的本地数据库，用于持久化存储待上报的聊天记录
- **Uploader**: 负责将本地缓存数据定时上报至远端服务器的模块
- **Chat_Record**: 一条完整的对话事件，包含会话 ID、时间戳、发送方（用户/AI）、消息内容
- **Session**: 一次连续的聊天会话，具有唯一的 session_id
- **Remote_API**: 接收聊天遥测数据的远端服务端点（地址待定，沿用 frontier.hexai.top 域名规范）
- **Upload_Status**: Chat_Record 的上报状态，枚举值为 pending / uploaded / failed

## Requirements

### Requirement 1: 消息采集

**User Story:** 作为 Frontier 平台运营方，我希望系统能自动采集所有用户与 AI 的对话消息，以便进行数据分析和质量改进。

#### Acceptance Criteria

1. WHEN 用户发送一条消息，THE Telemetry_Collector SHALL 将该消息连同 session_id、时间戳、发送方标识（user）记录为一条 Chat_Record
2. WHEN AI 返回一条回复消息，THE Telemetry_Collector SHALL 将该消息连同 session_id、时间戳、发送方标识（assistant）记录为一条 Chat_Record
3. THE Telemetry_Collector SHALL 为每条 Chat_Record 分配全局唯一的 record_id
4. WHEN 流式（streaming）AI 回复完成，THE Telemetry_Collector SHALL 将完整的拼接内容作为一条 Chat_Record 记录，而非分片记录

### Requirement 2: 本地持久化存储

**User Story:** 作为 Frontier 平台运营方，我希望采集到的数据先保存在本地，以防数据在上报前丢失。

#### Acceptance Criteria

1. THE Local_Store SHALL 使用 SQLite 数据库存储所有 Chat_Record
2. WHEN 一条 Chat_Record 被创建，THE Local_Store SHALL 以 Upload_Status = pending 写入数据库
3. THE Local_Store SHALL 保存每条记录的以下字段：record_id、session_id、timestamp、role（user/assistant）、content、upload_status
4. IF 写入 SQLite 失败，THEN THE Local_Store SHALL 将错误写入应用日志并丢弃该条记录，不影响主聊天流程
5. THE Local_Store SHALL 在数据库文件不存在时自动创建数据库文件及表结构

### Requirement 3: 定时上报

**User Story:** 作为 Frontier 平台运营方，我希望本地缓存的数据能定期自动上报到服务器，以便及时获取数据。

#### Acceptance Criteria

1. THE Uploader SHALL 按固定时间间隔（默认 60 秒）扫描 Local_Store 中 Upload_Status = pending 的 Chat_Record
2. WHEN 存在 pending 记录，THE Uploader SHALL 将记录批量序列化为 JSON 后通过 HTTP POST 请求发送至 Remote_API
3. WHEN Remote_API 返回成功响应（HTTP 2xx），THE Uploader SHALL 将对应记录的 Upload_Status 更新为 uploaded
4. IF Remote_API 返回非 2xx 响应或请求超时，THEN THE Uploader SHALL 将对应记录的 Upload_Status 保持为 pending，并在下一个定时周期重试
5. THE Uploader SHALL 在单次上报任务中最多处理 200 条记录，避免请求体过大
6. THE Uploader SHALL 在应用启动时自动启动定时任务，在应用退出时停止定时任务

### Requirement 4: 离线缓存与断网重试

**User Story:** 作为 Frontier 平台运营方，我希望在网络不可用时数据不丢失，恢复网络后能自动补报。

#### Acceptance Criteria

1. WHILE 网络不可用，THE Uploader SHALL 跳过本次上报任务，保持 pending 记录不变
2. WHEN 网络恢复后的下一个定时周期到达，THE Uploader SHALL 自动尝试上报所有 pending 记录
3. THE Local_Store SHALL 对 Upload_Status = pending 的记录无限期保留，直到上报成功
4. IF 单条记录连续失败超过 10 次，THEN THE Uploader SHALL 将该记录标记为 failed 并写入应用日志，不再重试

### Requirement 5: 数据上报格式

**User Story:** 作为 Frontier 平台运营方，我希望上报数据格式规范一致，便于服务端解析和存储。

#### Acceptance Criteria

1. THE Uploader SHALL 以 JSON 数组格式上报 Chat_Record 批次，每个元素包含 record_id、session_id、timestamp、role、content 字段
2. THE Uploader SHALL 在 HTTP 请求头中携带已登录用户的认证 token（与现有登录模块保持一致）
3. THE Uploader SHALL 在 HTTP 请求头中携带 Content-Type: application/json
4. WHEN 上报请求体超过 1 MB，THE Uploader SHALL 将批次拆分为多个子批次分别发送

### Requirement 6: 隐私与安全

**User Story:** 作为 Frontier 平台运营方，我希望遥测数据传输和存储是安全的。

#### Acceptance Criteria

1. THE Uploader SHALL 仅通过 HTTPS 协议向 Remote_API 上报数据
2. THE Local_Store SHALL 将 SQLite 数据库文件存储在应用专属的用户数据目录下（如 Electron 的 app.getPath('userData')）
3. WHEN 用户退出登录，THE Telemetry_Collector SHALL 停止采集新消息，THE Uploader SHALL 尝试将当前 pending 记录上报一次后停止定时任务
