# Requirements Document

## Introduction

Claw Web Chat 是一个基于浏览器的 Web 聊天界面，用于与 Frontier AI 编程助手进行交互。该界面通过 TCP 连接与 Frontier 的 `--serve` 模式通信，实现完整的 REPL 交互体验，包括多会话管理、工具调用、技能执行、MCP 集成和插件支持。界面设计追求简洁美观，布局合理，字体大小适中。

## Glossary

- **Web_Chat_Interface**: 基于浏览器的聊天 Web 应用程序前端
- **Backend_Server**: 连接 Web 前端与 claw-code TCP 服务的中间层 HTTP/WebSocket 服务器
- **Session_Manager**: 管理多个独立对话会话的组件，负责会话创建、切换、持久化和恢复
- **Claw_TCP_Bridge**: 与 claw-code `--serve` 模式建立 TCP 连接并转发消息的桥接层
- **Tool_Renderer**: 在界面中展示工具调用过程和结果的渲染组件
- **Config_Panel**: 用于配置 API baseURL、模型选择等参数的设置面板
- **Message_Stream**: 从 claw-code 接收的 JSON 流式消息（chunk/done/error 类型）
- **Conversation_Memory**: claw-code 内置的多层会话记忆机制，包括上下文保持和自动压缩
- **REPL_Mode**: Read-Eval-Print-Loop 交互模式，用户输入→模型处理→流式输出→等待下一次输入
- **Skill**: claw-code 的技能系统，存储在 `.claw/skills/` 目录中的可复用提示模板
- **MCP_Server**: Model Context Protocol 服务器，提供额外的工具和资源
- **Plugin**: claw-code 的插件系统，提供扩展工具、命令和生命周期钩子
- **Slash_Command**: 以 `/` 开头的特殊命令，如 `/compact`、`/clear`、`/status` 等

## Requirements

### Requirement 1: 多会话管理

**User Story:** As a developer, I want to manage multiple independent chat sessions, so that I can work on different tasks simultaneously without losing context.

#### Acceptance Criteria

1. THE Session_Manager SHALL display a session list sidebar showing all active sessions with their creation time and last message preview
2. WHEN the user clicks the "New Session" button, THE Session_Manager SHALL create a new independent session with a unique identifier and switch to it
3. WHEN the user selects a different session from the sidebar, THE Session_Manager SHALL switch the active view to display that session's conversation history
4. THE Session_Manager SHALL persist all session data to local storage so that sessions survive page refreshes
5. WHEN the user right-clicks a session in the sidebar, THE Session_Manager SHALL display a context menu with options to rename, delete, or export the session
6. WHEN a session is deleted, THE Session_Manager SHALL remove the session data from local storage and switch to the most recent remaining session
7. THE Session_Manager SHALL display an unread indicator on sessions that received new messages while not actively viewed

### Requirement 2: API 配置管理

**User Story:** As a developer, I want to configure the API baseURL and model, so that I can connect to different claw-code instances and use different AI models.

#### Acceptance Criteria

1. THE Config_Panel SHALL provide input fields for API baseURL, model name, and API key
2. WHEN the user modifies configuration values and clicks "Save", THE Config_Panel SHALL persist the configuration to local storage
3. THE Config_Panel SHALL validate that the baseURL follows a valid URL format before saving
4. WHEN the application starts, THE Config_Panel SHALL load previously saved configuration from local storage
5. THE Config_Panel SHALL provide a model selection dropdown with common model options (claude-opus-4-6, claude-sonnet-4-20250514, deepseek-v4-flash) and allow custom model input
6. IF the API connection fails due to invalid configuration, THEN THE Backend_Server SHALL display a clear error message indicating the connection failure reason
7. THE Config_Panel SHALL support configuring multiple provider profiles and switching between them

### Requirement 3: REPL 流式对话

**User Story:** As a developer, I want a REPL-style streaming chat experience, so that I can interact with claw-code naturally with real-time response rendering.

#### Acceptance Criteria

1. WHEN the user submits a message, THE Web_Chat_Interface SHALL send the message to the Backend_Server and display a loading indicator
2. WHILE the Backend_Server is receiving streaming chunks from claw-code, THE Web_Chat_Interface SHALL render each text chunk incrementally in real-time (typewriter effect)
3. WHEN a "done" message is received from the Message_Stream, THE Web_Chat_Interface SHALL finalize the response display and re-enable the input field
4. IF an "error" message is received from the Message_Stream, THEN THE Web_Chat_Interface SHALL display the error message in a distinct error style and re-enable the input field
5. THE Web_Chat_Interface SHALL support Markdown rendering in assistant responses including code blocks with syntax highlighting
6. WHEN the user presses Enter in the input field, THE Web_Chat_Interface SHALL submit the message (Shift+Enter for newline)
7. THE Web_Chat_Interface SHALL maintain scroll position at the bottom during streaming unless the user has manually scrolled up
8. WHEN the user scrolls up during streaming, THE Web_Chat_Interface SHALL display a "scroll to bottom" button

### Requirement 4: 工具调用展示

**User Story:** As a developer, I want to see tool calls and their results clearly, so that I can understand what actions the AI is performing on my behalf.

#### Acceptance Criteria

1. WHEN the assistant invokes a tool, THE Tool_Renderer SHALL display the tool name and input parameters in a collapsible panel
2. WHEN a tool execution completes, THE Tool_Renderer SHALL display the tool output within the collapsible panel
3. IF a tool execution returns an error, THEN THE Tool_Renderer SHALL display the error with a distinct error indicator
4. THE Tool_Renderer SHALL support rendering output from all claw-code built-in tools: bash, read_file, write_file, edit_file, glob_search, grep_search, WebFetch, WebSearch, PowerShell, and others
5. WHEN multiple tools are called in sequence, THE Tool_Renderer SHALL display each tool call in chronological order with clear visual separation
6. THE Tool_Renderer SHALL render file content tool results with syntax highlighting based on file extension

### Requirement 5: 技能系统集成

**User Story:** As a developer, I want to invoke claw-code skills from the web interface, so that I can use predefined automation workflows.

#### Acceptance Criteria

1. THE Web_Chat_Interface SHALL support bare-word skill invocation by typing the skill name directly (e.g., typing "sysinfo" triggers the sysinfo skill)
2. WHEN the user types a message that matches a known skill name, THE Backend_Server SHALL resolve it as a skill invocation and forward the expanded prompt to claw-code
3. THE Web_Chat_Interface SHALL provide a `/skills` slash command to list available skills
4. WHEN a skill execution involves tool calls, THE Tool_Renderer SHALL display the tool calls and results as part of the skill execution flow

### Requirement 6: MCP 和插件支持

**User Story:** As a developer, I want the web interface to support MCP servers and plugins, so that I can use extended tools and capabilities.

#### Acceptance Criteria

1. THE Backend_Server SHALL forward all MCP tool calls from claw-code responses to the appropriate MCP server and return results
2. THE Web_Chat_Interface SHALL display MCP tool calls with the same visual treatment as built-in tool calls, prefixed with the MCP server name
3. THE Web_Chat_Interface SHALL provide a `/mcp` slash command to display connected MCP server status
4. THE Web_Chat_Interface SHALL provide a `/plugins` slash command to list installed plugins and their status
5. WHEN a plugin provides additional tools, THE Tool_Renderer SHALL render plugin tool calls with the plugin name as a prefix

### Requirement 7: 多层会话记忆

**User Story:** As a developer, I want the conversation to maintain context across multiple turns with automatic memory management, so that I can have long productive sessions without losing important context.

#### Acceptance Criteria

1. THE Claw_TCP_Bridge SHALL maintain a persistent TCP connection to claw-code's serve mode, preserving the full session state including conversation history
2. WHEN the conversation context exceeds the auto-compaction threshold, THE Conversation_Memory SHALL automatically compact older messages into a summary while preserving recent messages
3. THE Web_Chat_Interface SHALL provide a `/compact` slash command to manually trigger session compaction
4. WHEN a session is compacted, THE Web_Chat_Interface SHALL display a notification indicating the compaction occurred and how many messages were summarized
5. THE Web_Chat_Interface SHALL display the current token usage and estimated context size in the session status bar
6. WHEN the user starts a new session, THE Conversation_Memory SHALL begin with a clean context without any prior conversation history

### Requirement 8: 斜杠命令支持

**User Story:** As a developer, I want to use slash commands in the web interface, so that I can access claw-code's utility functions directly.

#### Acceptance Criteria

1. WHEN the user types "/" in the input field, THE Web_Chat_Interface SHALL display an autocomplete dropdown showing available slash commands
2. THE Web_Chat_Interface SHALL support the following slash commands: /help, /status, /compact, /clear, /cost, /skills, /plugins, /mcp, /version, /export
3. WHEN the user executes `/clear`, THE Session_Manager SHALL start a new conversation within the current session, clearing the display
4. WHEN the user executes `/cost`, THE Web_Chat_Interface SHALL display the cumulative token usage and estimated cost for the current session
5. WHEN the user executes `/status`, THE Web_Chat_Interface SHALL display the current model, permission mode, and connection status
6. WHEN the user executes `/export`, THE Web_Chat_Interface SHALL download the current session transcript as a JSON file

### Requirement 9: 界面设计与布局

**User Story:** As a developer, I want a clean, beautiful, and well-organized interface, so that I can focus on my work without visual distractions.

#### Acceptance Criteria

1. THE Web_Chat_Interface SHALL use a responsive layout with a collapsible session sidebar (250px default width) and a main chat area
2. THE Web_Chat_Interface SHALL use a base font size of 14px for message content and 13px for UI controls, with monospace font for code blocks
3. THE Web_Chat_Interface SHALL support both light and dark themes with a toggle button in the header
4. THE Web_Chat_Interface SHALL display a header bar containing the current model name, connection status indicator, theme toggle, and settings button
5. THE Web_Chat_Interface SHALL use consistent spacing (8px base unit) between UI elements for visual harmony
6. THE Web_Chat_Interface SHALL render the input area at the bottom of the chat with a minimum height of 60px and auto-expand up to 200px based on content
7. THE Web_Chat_Interface SHALL be fully functional on screen widths from 768px to 2560px
8. WHEN the screen width is below 768px, THE Web_Chat_Interface SHALL collapse the sidebar and provide a hamburger menu to access it

### Requirement 10: 连接管理与错误处理

**User Story:** As a developer, I want robust connection management, so that I can rely on the interface even when network conditions are imperfect.

#### Acceptance Criteria

1. WHEN the WebSocket connection to the Backend_Server is lost, THE Web_Chat_Interface SHALL display a connection status indicator showing "Disconnected" and attempt automatic reconnection every 5 seconds
2. WHEN automatic reconnection succeeds, THE Web_Chat_Interface SHALL restore the session state and display a "Reconnected" notification
3. IF the Backend_Server cannot establish a TCP connection to claw-code, THEN THE Backend_Server SHALL return a clear error message and the Web_Chat_Interface SHALL display instructions for starting claw-code in serve mode
4. WHEN a request times out after 120 seconds without receiving any streaming data, THE Web_Chat_Interface SHALL display a timeout error and allow the user to retry
5. THE Backend_Server SHALL implement a health check endpoint that verifies both the HTTP server and the claw-code TCP connection are operational
