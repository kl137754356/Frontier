# Frontier — MCP 服务器与 Skills 配置指南

## 目录结构

```
Frontier/
├── mcp-servers/              ← MCP 可执行文件目录
│   ├── metrology-mcp.exe
│   ├── pcdmis-mcp.exe
│   └── README.txt
├── skills/                   ← 内置 Skills 目录
│   ├── my-skill/
│   │   ├── SKILL.md
│   │   └── references/
│   └── README.txt
├── mcp-config-template.json  ← MCP 配置模板
└── ...

用户数据目录（自动创建）：
%APPDATA%/frontier-desktop/
└── .claw/
    ├── settings/
    │   └── mcp.json          ← 实际使用的 MCP 配置
    └── skills/               ← 实际使用的 Skills
        ├── my-skill/
        └── ...
```

---

## 一、MCP 服务器

### 什么是 MCP？

MCP（Model Context Protocol）让 AI 能够调用外部工具和服务。每个 MCP 服务器是一个可执行程序，通过 stdio 与 Frontier 通信。

### 内置 MCP 服务器

安装包中预设了以下 MCP 服务器（位于 `mcp-servers/` 目录）：

| 文件名 | 用途 |
|--------|------|
| metrology-mcp.exe | Hexagon Metrology AI 计量软件控制 |
| pcdmis-mcp.exe | PC-DMIS 三坐标测量自动化 |

### 添加新的 MCP 服务器

1. **放置可执行文件**：将 MCP 服务器的 exe 复制到 `Frontier/mcp-servers/` 目录

2. **编辑配置文件**：修改 `%APPDATA%/frontier-desktop/.claw/settings/mcp.json`，添加新条目：

```json
{
  "mcpServers": {
    "existing-server": { ... },
    "my-new-server": {
      "command": "C:/path/to/Frontier/mcp-servers/my-new-server.exe",
      "args": ["--port", "8080"],
      "env": {
        "MY_ENV_VAR": "value"
      },
      "disabled": false
    }
  }
}
```

3. **重启 Frontier**

### 替换 MCP 服务器

1. 将新版本的 exe 覆盖 `mcp-servers/` 中的同名文件
2. 重启 Frontier

### 禁用 MCP 服务器

编辑 `mcp.json`，将对应服务器的 `disabled` 设为 `true`：

```json
"my-server": {
  "command": "...",
  "disabled": true
}
```

### MCP 配置字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| command | string | 可执行文件的绝对路径 |
| args | string[] | 命令行参数（可选） |
| env | object | 环境变量（可选） |
| disabled | boolean | 是否禁用（可选，默认 false） |

### 注意事项

- MCP 服务器必须支持 **stdio 传输方式**（通过标准输入/输出通信）
- 首次启动时 `mcp.json` 从模板自动生成，之后不会被覆盖
- 如需重置为默认配置，删除 `%APPDATA%/frontier-desktop/.claw/settings/mcp.json` 后重启

---

## 二、Skills（技能）

### 什么是 Skill？

Skill 是一组预设的提示词和参考文档，帮助 AI 更好地回答特定领域的问题。当用户的问题匹配某个 skill 时，AI 会先读取 skill 的指引再回答。

### 内置 Skills

安装包中预设的 skills 位于 `Frontier/skills/` 目录。首次启动时自动复制到用户工作区。

### Skill 目录结构

```
skills/
└── my-skill/
    ├── SKILL.md              ← 技能定义文件（必需）
    └── references/           ← 参考文档目录（可选）
        ├── api-docs.md
        ├── examples.md
        └── workflow.md
```

### SKILL.md 格式

```markdown
---
name: my-skill
description: 简要描述这个技能做什么
---

# 技能名称

## 使用场景
当用户问到 XXX 相关的问题时使用此技能。

## 操作步骤
1. 第一步...
2. 第二步...

## 参考文件
如需更多信息，读取 references/ 目录下的相关文件。
```

### 添加新 Skill

**方法一：直接在用户工作区添加**

1. 进入 `%APPDATA%/frontier-desktop/.claw/skills/`
2. 创建新文件夹（如 `my-custom-skill/`）
3. 在文件夹内创建 `SKILL.md`
4. （可选）创建 `references/` 子目录放参考文档
5. 重启 Frontier

**方法二：通过安装包内置**（适合分发给其他用户）

1. 在 `Frontier/skills/` 目录下创建 skill 文件夹
2. 首次启动时会自动复制到用户工作区

### 修改 Skill

直接编辑 `%APPDATA%/frontier-desktop/.claw/skills/<skill-name>/SKILL.md`。
修改后立即生效（下次对话时 AI 会读取新内容）。

### 删除 Skill

删除 `%APPDATA%/frontier-desktop/.claw/skills/<skill-name>/` 整个文件夹。

### 恢复内置 Skill

如果你修改了内置 skill 想恢复原版：
1. 删除 `%APPDATA%/frontier-desktop/.claw/skills/<skill-name>/`
2. 重启 Frontier（会从安装包重新复制）

### 注意事项

- Skill 名称（文件夹名）不能包含空格，建议用 `-` 连接
- SKILL.md 必须存在，否则不会被识别
- references/ 中的文件由 AI 按需读取，不会全部加载到上下文
- 已存在的 skill 不会被安装包覆盖（保护用户自定义内容）

---

## 三、常见问题

### Q: 修改了 mcp.json 或 skill 后需要重启吗？

- **MCP 配置变更**：需要重启 Frontier（MCP 服务器在启动时连接）
- **Skill 内容变更**：不需要重启（AI 每次调用时实时读取）

### Q: 如何查看当前连接的 MCP 服务器？

在对话框中输入 `/mcp`，AI 会列出所有已连接和未连接的 MCP 服务器。

### Q: MCP 服务器连接失败怎么办？

1. 确认 exe 文件存在且路径正确
2. 确认 exe 支持 stdio 模式
3. 查看日志：`%APPDATA%/frontier-desktop/frontier.log`
4. 尝试在命令行手动运行 exe 看是否有报错

### Q: 如何开发自定义 MCP 服务器？

MCP 服务器需要实现 Model Context Protocol 的 stdio 传输：
- 从 stdin 读取 JSON-RPC 请求
- 向 stdout 写入 JSON-RPC 响应
- 支持 `tools/list` 和 `tools/call` 方法

推荐使用 `@modelcontextprotocol/sdk` (TypeScript) 或 `mcp` (Python) 库开发。

### Q: 用户数据存在哪里？

所有用户数据存储在：`%APPDATA%/frontier-desktop/`

包含：
- `.claw/settings/mcp.json` — MCP 配置
- `.claw/skills/` — Skills
- `frontier.log` — 运行日志
- `.claw/sessions/` — 会话历史
