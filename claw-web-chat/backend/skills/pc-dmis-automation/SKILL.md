---
name: pc-dmis-automation
description: PC-DMIS自动化编程助手，帮助用户编写Python脚本控制PC-DMIS三坐标测量机。
---

# PC-DMIS Automation Skill

当用户询问PC-DMIS编程、自动化、COM对象、测量程序、对齐命令、零件程序，或需要编写通过win32com与PC-DMIS交互的Python脚本时，使用此skill。
也适用于用户提到PCDLRN、三坐标测量机(CMM)、尺寸检测、GD&T自动化等场景。

## 使用方法

当需要回答PC-DMIS相关问题时，按需读取 `references/` 目录下的参考文件：

**优先查阅：**
- `tips_and_patterns.md` — 已验证的实用技巧和常见陷阱
- `script_templates.md` — 可直接复用的完整脚本模板

**按需查阅（根据用户问题选择相关文件）：**
- `object_hierarchy.md` — 对象层次结构
- `core_application.md` — Application对象
- `core_partprogram.md` — PartProgram对象
- `core_command.md` — Command对象
- `core_commands_collection.md` — Commands集合
- `alignment.md` — 对齐操作
- `features_featcmd.md` — 特征测量
- `dimensions.md` — 尺寸公差
- `scanning.md` — 扫描操作
- `probes.md` — 探针管理
- `enums.md` — 枚举常量
- `samples.md` — 示例脚本
- 其他：`guides.md`, `features_other.md`, `windows.md`, `reporting.md`, `cad.md`, `flow_control.md`, `events.md`, `machine.md`, `dialogs.md`, `misc.md`

## 快速参考

连接PC-DMIS：
```python
import win32com.client
pcdmis = win32com.client.Dispatch("PCDLRN.Application")
part = pcdmis.ActivePartProgram
cmds = part.Commands
```

关键注意事项：
- Commands集合索引从1开始，用 `cmds(idx)` 而非 `cmds.Item(idx)`
- Vision特征判断Manual/Auto用 `cmd.GetText(564, 0)` 而非 `IsDCCFeature`
