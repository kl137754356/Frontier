# Implementation Plan: Claw Web Chat

## Overview

基于三层架构（React SPA → Node.js WebSocket 后端 → claw-code TCP Bridge）实现 Claw Web Chat。采用增量开发策略：先搭建项目基础和共享类型，再实现后端 TCP/WebSocket 桥接，最后构建前端 UI 组件和交互逻辑。

## Tasks

- [x] 1. 项目初始化与共享类型定义
  - [x] 1.1 初始化 monorepo 项目结构
    - 创建 `frontend/` 和 `backend/` 目录
    - 初始化前端 Vite + React + TypeScript 项目
    - 初始化后端 Node.js + TypeScript 项目
    - 配置 Tailwind CSS
    - 安装核心依赖：zustand, react-markdown, rehype-highlight, ws, fast-check, vitest
    - _Requirements: 9.1_

  - [x] 1.2 定义共享类型和接口
    - 创建 `shared/types.ts`：Session, Message, MessageContent, AppConfig, ConfigProfile, TokenUsage, ToolCall, SlashCommand 接口
    - 创建 `shared/protocol.ts`：WsClientMessage, WsServerMessage, TcpClientMessage, TcpServerMessage 类型
    - 定义 SLASH_COMMANDS 常量数组
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 8.2_

  - [ ]* 1.3 编写共享类型的属性测试
    - **Property 4: Session persistence round-trip**
    - **Validates: Requirements 1.4**

- [x] 2. 后端 TCP Bridge 实现
  - [x] 2.1 实现 TCP Bridge 模块
    - 创建 `backend/src/tcp-bridge.ts`
    - 实现 JSON Lines 消息解析（`\n` 分隔）
    - 实现 connect/disconnect/sendPrompt/sendReset/sendInject 方法
    - 处理 TCP 连接错误和重连逻辑（最多3次，间隔2s）
    - _Requirements: 7.1, 10.3_

  - [x] 2.2 实现消息解析器
    - 创建 `backend/src/message-parser.ts`
    - 解析 ready/chunk/done/error/usage/tool_start/reset_done/inject_done/history 消息类型
    - 处理不完整 JSON 行的缓冲拼接
    - _Requirements: 3.2, 3.3, 3.4, 4.1_

  - [ ]* 2.3 编写 TCP Bridge 属性测试
    - **Property 10: Chunk accumulation equals concatenation**
    - **Validates: Requirements 3.2**

- [x] 3. 后端 WebSocket 服务器实现
  - [x] 3.1 实现 WebSocket 服务器和连接管理
    - 创建 `backend/src/index.ts`：HTTP + WebSocket 服务器入口
    - 创建 `backend/src/ws-handler.ts`：WebSocket 连接管理
    - 实现前端 WebSocket 消息到 TCP 消息的转发
    - 实现 TCP 响应到 WebSocket 消息的转发
    - 实现心跳检测 (30s ping/pong)
    - _Requirements: 3.1, 10.1_

  - [x] 3.2 实现健康检查端点
    - 创建 `backend/src/health.ts`
    - 实现 `GET /health` 端点，验证 HTTP 服务和 TCP 连接状态
    - _Requirements: 10.5_

  - [x] 3.3 实现技能解析逻辑
    - 在 ws-handler 中检测 bare-word 技能名称
    - 匹配已知技能名时转换为技能调用并转发到 claw-code
    - _Requirements: 5.1, 5.2_

- [x] 4. Checkpoint - 后端核心功能验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. 前端状态管理 (Zustand Store)
  - [x] 5.1 实现会话管理 Store
    - 创建 `frontend/src/store/chat-store.ts`
    - 实现 sessions/activeSessionId/messages 状态
    - 实现 createSession/switchSession/deleteSession/renameSession 方法
    - 实现 unread 标记逻辑：非活跃会话收到消息时标记 unread=true，切换到会话时标记 unread=false
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 1.7_

  - [ ]* 5.2 编写会话管理属性测试
    - **Property 1: Session creation grows session list**
    - **Property 2: Session deletion shrinks list and selects most recent**
    - **Property 3: Session switching displays correct history**
    - **Property 5: Unread indicator on inactive sessions**
    - **Validates: Requirements 1.2, 1.3, 1.6, 1.7**

  - [x] 5.3 实现流式消息 Store
    - 实现 addMessage/appendChunk 方法
    - 实现 isStreaming 状态管理
    - 实现状态机转换：prompt→streaming→done/error
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ]* 5.4 编写流式状态属性测试
    - **Property 9: Streaming state machine transitions**
    - **Property 10: Chunk accumulation equals concatenation**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

  - [x] 5.5 实现配置管理 Store
    - 实现 config/updateConfig 状态
    - 实现 profiles 管理（增删改查、切换）
    - 实现 LocalStorage 持久化（sessions, messages, config）
    - _Requirements: 2.1, 2.2, 2.4, 2.7_

  - [ ]* 5.6 编写配置管理属性测试
    - **Property 6: Configuration persistence round-trip**
    - **Property 7: URL validation correctness**
    - **Property 8: Profile switching updates active configuration**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.7**

- [x] 6. 前端 WebSocket 通信层
  - [x] 6.1 实现 WebSocket 客户端
    - 创建 `frontend/src/services/ws-client.ts`
    - 实现连接/断开/重连逻辑（5s间隔，退避倍数1.5，最大30s）
    - 实现消息发送和接收
    - 将接收到的消息分发到 Zustand Store
    - _Requirements: 10.1, 10.2_

  - [ ]* 6.2 编写重连属性测试
    - **Property 24: Reconnection preserves session state**
    - **Validates: Requirements 10.1, 10.2**

- [x] 7. Checkpoint - 前端状态层验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. 前端 UI 组件 - 布局与主题
  - [x] 8.1 实现 App 根组件和布局
    - 创建 `frontend/src/App.tsx`：响应式布局容器
    - 实现 sidebar (250px) + main chat area 布局
    - 实现 768px 以下自动折叠 sidebar + hamburger menu
    - 配置 8px 基础间距系统
    - _Requirements: 9.1, 9.5, 9.7, 9.8_

  - [x] 8.2 实现 Header 组件
    - 创建 Header：ModelBadge + ConnectionStatus + ThemeToggle + SettingsButton
    - 实现 light/dark 主题切换和持久化
    - 实现连接状态指示器（Connected/Disconnected/Reconnecting）
    - _Requirements: 9.3, 9.4, 10.1_

  - [ ]* 8.3 编写主题切换属性测试
    - **Property 22: Theme toggle persistence**
    - **Validates: Requirements 9.3**

- [x] 9. 前端 UI 组件 - 会话侧边栏
  - [x] 9.1 实现 SessionSidebar 组件
    - 创建 SessionSidebar：SessionList + NewSessionButton
    - 实现会话列表渲染（创建时间、最后消息预览）
    - 实现新建会话按钮
    - 实现会话点击切换
    - 实现右键上下文菜单（重命名、删除、导出）
    - 实现 unread 指示器样式
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.7_

  - [ ]* 9.2 编写会话侧边栏单元测试
    - 测试新建会话交互
    - 测试会话切换
    - 测试右键菜单操作
    - _Requirements: 1.2, 1.3, 1.5_

- [x] 10. 前端 UI 组件 - 聊天区域
  - [x] 10.1 实现 MessageList 组件
    - 创建 MessageList：渲染 UserMessage/AssistantMessage/SystemNotice
    - 实现自动滚动到底部（流式期间）
    - 实现用户手动上滚时暂停自动滚动 + "scroll to bottom" 按钮
    - _Requirements: 3.7, 3.8_

  - [x] 10.2 实现 AssistantMessage 组件与 Markdown 渲染
    - 使用 react-markdown + rehype-highlight 渲染 Markdown
    - 支持代码块语法高亮
    - 实现流式打字效果（逐 chunk 追加）
    - 设置 14px 消息字体、monospace 代码字体
    - _Requirements: 3.2, 3.5, 9.2_

  - [ ]* 10.3 编写 Markdown 渲染属性测试
    - **Property 11: Markdown rendering preserves semantic content**
    - **Validates: Requirements 3.5**

  - [x] 10.4 实现 ToolCallPanel 组件
    - 创建可折叠的工具调用面板：ToolHeader + ToolInput + ToolOutput
    - 显示工具名称、输入参数、输出结果
    - 错误状态显示红色指示器
    - 文件内容输出使用语法高亮
    - MCP/Plugin 工具显示命名空间前缀
    - 按时间顺序排列多个工具调用
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.2, 6.5_

  - [ ]* 10.5 编写工具调用渲染属性测试
    - **Property 12: Tool call rendering completeness**
    - **Property 13: Tool calls maintain chronological order**
    - **Property 14: File content syntax highlighting by extension**
    - **Property 16: Prefixed tool rendering for MCP and plugins**
    - **Validates: Requirements 4.1, 4.2, 4.5, 4.6, 6.2, 6.5**

- [x] 11. 前端 UI 组件 - 输入区域与斜杠命令
  - [x] 11.1 实现 InputArea 组件
    - 创建 TextInput + SendButton + TokenCounter
    - 实现 Enter 发送 / Shift+Enter 换行
    - 实现输入框自动扩展（60px~200px）
    - 流式期间禁用输入
    - 显示当前 token 使用量
    - _Requirements: 3.1, 3.6, 7.5, 9.6_

  - [x] 11.2 实现 SlashCommandMenu 组件
    - 输入 "/" 时显示自动补全下拉菜单
    - 根据输入前缀过滤命令列表
    - 实现本地命令处理：/help, /status, /clear, /cost, /export
    - 实现远程命令转发：/compact, /skills, /plugins, /mcp, /version
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 11.3 编写斜杠命令属性测试
    - **Property 19: Slash command autocomplete filtering**
    - **Property 20: Clear command resets session messages**
    - **Property 21: Export produces valid JSON with all messages**
    - **Validates: Requirements 8.1, 8.3, 8.6**

- [x] 12. Checkpoint - UI 组件集成验证
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. 前端 UI 组件 - 配置面板
  - [x] 13.1 实现 ConfigPanel 组件
    - 创建配置面板：baseURL/model/apiKey 输入字段
    - 实现 URL 格式验证（红色边框 + 错误提示）
    - 实现模型下拉选择（claude-opus-4-6, claude-sonnet-4-20250514, deepseek-v4-flash）+ 自定义输入
    - 实现多 profile 管理（创建、切换、删除）
    - 保存时持久化到 LocalStorage
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.7_

- [x] 14. 连接管理与错误处理
  - [x] 14.1 实现连接状态管理和错误展示
    - 实现 WebSocket 断开时状态栏显示 "Disconnected"
    - 实现自动重连动画和 "Reconnected" 通知
    - 实现 120s 流式超时检测 + 重试按钮
    - 实现 TCP 连接失败时显示启动 claw-code --serve 的提示
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 14.2 编写连接错误属性测试
    - **Property 23: Connection error contains failure reason**
    - **Validates: Requirements 2.6, 10.3**

- [x] 15. 会话记忆与 Token 管理
  - [x] 15.1 实现 token 使用量追踪和显示
    - 累计每条消息的 usage 数据到 session.tokenUsage
    - 在状态栏显示当前 token 使用量和估算费用
    - 实现 /cost 命令显示详细费用信息
    - _Requirements: 7.5, 8.4_

  - [ ]* 15.2 编写 token 使用量属性测试
    - **Property 17: Token usage display accuracy**
    - **Validates: Requirements 7.5**

  - [x] 15.3 实现会话压缩和新建会话逻辑
    - 新建会话时发送 reset 到 TCP Bridge
    - 实现 /compact 命令转发到后端
    - 显示压缩通知
    - _Requirements: 7.3, 7.4, 7.6_

  - [ ]* 15.4 编写新建会话属性测试
    - **Property 18: New session starts with clean context**
    - **Validates: Requirements 7.6**

- [x] 16. MCP、插件与技能 UI 集成
  - [x] 16.1 实现 /skills、/mcp、/plugins 命令展示
    - /skills 命令显示可用技能列表
    - /mcp 命令显示 MCP 服务器连接状态
    - /plugins 命令显示已安装插件列表
    - 实现 bare-word 技能调用的前端支持
    - _Requirements: 5.3, 6.1, 6.3, 6.4_

  - [ ]* 16.2 编写技能解析属性测试
    - **Property 15: Bare-word skill resolution**
    - **Validates: Requirements 5.1, 5.2**

- [x] 17. Final Checkpoint - 全功能集成验证
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- 标记 `*` 的子任务为可选测试任务，可跳过以加速 MVP 开发
- 每个任务引用具体需求编号以确保可追溯性
- Checkpoint 任务用于阶段性验证，确保增量开发的正确性
- 属性测试使用 fast-check 库，每个属性至少运行 100 次迭代
- 所有代码使用 TypeScript，前端 React + Zustand + Tailwind，后端 Node.js + ws
