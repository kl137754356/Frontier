Frontier MCP Servers
====================

此目录存放 MCP (Model Context Protocol) 服务器的可执行文件。
Frontier 启动时会根据 .claw/settings/mcp.json 配置自动连接这些 MCP 服务器。

如何替换 MCP 服务器：
1. 将新的 .exe 文件复制到此目录
2. 确保文件名与 mcp.json 中配置的一致
3. 重启 Frontier 即可生效

当前已配置的 MCP 服务器：
- metrology-mcp.exe  — Hexagon Metrology AI 计量软件控制
- pcdmis-mcp.exe     — PC-DMIS 三坐标测量自动化

注意事项：
- MCP 服务器必须支持 stdio 传输方式
- 替换后请确认 exe 的命令行参数兼容
- 如需修改参数，请编辑 .claw/settings/mcp.json
