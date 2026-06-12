# PC-DMIS Automation: 实用技巧与模式

本文档记录了在实际使用 PC-DMIS COM 自动化接口时发现的重要技巧、陷阱和最佳实践。
这些内容来自真实调试经验，是官方文档中不容易直接找到的关键知识。

---

## 1. Vision 特征区分 Manual Hit Target 与 Automatic Hit Target

### 问题

Vision 特征（如 `LINE (VISION)`, `CIRCLE (VISION)`, `EDGE POINT (VISION)`）的 Manual/Auto 模式
**无法**通过以下常规方法判断：

- `Command.IsDCCFeature` → 始终返回 `False`
- `Command.IsMeasuredFeature` → 始终返回 `False`
- `Command.GetToggleString(MODE_TYPE, 0)` → 返回空字符串
- `Command.GetText(MODE_TYPE, 0)` → 返回空字符串
- `FeatCmd.AutoMove` → 始终返回 `False`
- `FeatCmd.AutoReadPos` → 始终返回 `False`

### 解决方案

使用 `Command.GetText(TARGET_TYPE, 0)` 读取 Vision 特征的 Target 类型：

```python
TARGET_TYPE = 564  # ENUM_FIELD_TYPES.TARGET_TYPE

for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd is None or not cmd.IsFeature:
        continue

    # 检查是否有 TARGET_TYPE 字段（Vision 特征才有）
    if not cmd.HasField(TARGET_TYPE, 0):
        continue

    target_text = cmd.GetText(TARGET_TYPE, 0)
    # 返回值:
    #   "MANUAL HIT TARGET"
    #   "AUTOMATIC HIT TARGET"
    #   "OPTICAL COMPARATOR HIT TARGET"
    #   "GAGE HIT TARGET"

    if "MANUAL" in target_text:
        print(f"{cmd.ID} 是 Manual Hit Target")
    elif "AUTOMATIC" in target_text:
        print(f"{cmd.ID} 是 Automatic Hit Target")
```

### 补充说明

- `TARGET_TYPE = 564` 是 `ENUM_FIELD_TYPES` 枚举中的常量
- 使用前先调用 `cmd.HasField(TARGET_TYPE, 0)` 检查字段是否存在，非 Vision 特征没有此字段
- `GetToggleString(TARGET_TYPE, 0)` 返回所有可选值（用 `|` 分隔），如：
  `"OPTICAL COMPARATOR HIT TARGET|GAGE HIT TARGET|MANUAL HIT TARGET|AUTOMATIC HIT TARGET"`
- `GetToggleValue(TARGET_TYPE, 0)` 返回当前选中的 toggle 索引（从 1 开始）
- `FeatCmd.VisionTargetType` 也可以获取数值形式的 target 类型：
  - `1` = Edge target（对应 AUTOMATIC HIT TARGET，用于 EDGE POINT）
  - `2` = Manual target（对应 MANUAL HIT TARGET）
  - `3` = Automatic target（对应 AUTOMATIC HIT TARGET，用于 LINE/CIRCLE 等）

---

## 2. Commands 集合的索引方式

### 问题

`Commands` 集合的索引从 **1** 开始（不是 0），且必须使用 `cmds(idx)` 语法。

### 正确用法

```python
cmds = part.Commands
total = cmds.Count

for idx in range(1, total + 1):
    cmd = cmds(idx)  # ✅ 正确：直接调用
    # cmd = cmds.Item(idx)  # ❌ 错误：返回 None
```

### 说明

- `cmds.Item(idx)` 在 Python COM 中返回 `None`，不要使用
- 索引范围是 `1` 到 `cmds.Count`（包含两端）

---

## 3. 使用 GetText / GetToggleString / GetFieldValue 读取命令字段

### 模式

`Command` 对象提供了通用的字段读取方法，可以读取任何命令类型的任何字段：

```python
# 先检查字段是否存在
if cmd.HasField(field_type, type_index):
    # 读取文本值
    text = cmd.GetText(field_type, type_index)

    # 读取 toggle 字段的当前文本
    toggle_text = cmd.GetToggleString(field_type, type_index)
    # 返回所有选项，用 | 分隔，如 "DCC|MANUAL"

    # 读取 toggle 字段的当前索引（从 1 开始）
    toggle_idx = cmd.GetToggleValue(field_type, type_index)

    # 读取字段值
    field_val = cmd.GetFieldValue(field_type, type_index)
```

### 常用 ENUM_FIELD_TYPES 常量

| 常量名 | 值 | 用途 |
|--------|-----|------|
| `ID` | 2 | 命令 ID |
| `FEAT_TYPE` | 303 | 特征类型 |
| `MODE_TYPE` | 58 | DCC/Manual 模式（非 Vision 特征） |
| `TARGET_TYPE` | 564 | Vision Target 类型（Vision 特征专用） |
| `FIND_NOMS_TYPE` | 233 | Find Nominals 模式 |
| `MANUAL_PREPOSITION` | 534 | Manual Pre-Position 开关 |
| `PROBING_MODE` | 299 | 探测模式 |
| `INOUT_TYPE` | 40 | 内/外（Inner/Outer） |

---

## 4. ModalCmd 与测量模式上下文

### 说明

程序中的 `Manual/DCC Mode` 命令是一个 Modal 命令，它设置后续特征的默认测量模式。
但对于 Vision 特征，这个模式不直接决定 Manual/Auto —— Vision 特征的模式由 `TARGET_TYPE` 字段独立控制。

### 读取当前模式

```python
MODE_TYPE = 58  # ENUM_FIELD_TYPES.MODE_TYPE

if cmd.IsModal and "Manual/DCC" in cmd.TypeDescription:
    current = cmd.GetText(MODE_TYPE, 0)  # 返回 "DCC" 或 "MANUAL"
    modal = cmd.ModalCommand
    man_dcc = modal.ManDCCMode
    # ManDCCMode 值：100 = DCC, 101 = MANUAL
```

### 修改 DCC/Manual 模式

**使用 `PutText` 修改**（已验证有效）：

```python
MODE_TYPE = 58

# 切换为 MANUAL
cmd.PutText("MANUAL", MODE_TYPE, 0)
cmd.ReDraw()

# 切换为 DCC
cmd.PutText("DCC", MODE_TYPE, 0)
cmd.ReDraw()
```

**注意**：
- `SetToggleString` 对此字段无效，必须用 `PutText`
- 修改后调用 `cmd.ReDraw()` 刷新编辑窗口显示
- `ManDCCMode` 属性虽然标记为 Read/Write，但直接赋值无效，需通过 `PutText` 修改

---

## 5. 创建 Vision 特征后 MEAS/TARG PutText 不生效的解决方案

### 问题

在同一个 COM session 中，使用 `cmds.Add(etype, True)` 创建 Vision 特征后，
对新创建的 Command 调用 `PutText` 设置 MEAS 和 TARG 字段**不会生效**（值保持为默认 0,0,0）。
但 THEO 和 TARGET_TYPE 的 `PutText` 在同一 session 中可以正常工作。

### 原因

推测是 PC-DMIS 内部在 `Add()` 后对 MEAS/TARG 字段有延迟初始化机制，
同一 COM session 中的 `PutText` 被内部状态覆盖。

### 解决方案：两阶段 subprocess 方案

```python
import subprocess, sys, os

# Phase 1: 创建特征 + 设置 THEO + TARGET_TYPE（同一 session）
cmd = cmds.Add(etype, True)
cmd.ID = "点名"
cmd.PutText(str(x), 7, 0)  # THEO_X
# ... 设置其他 THEO 和 TARGET_TYPE ...
part.RefreshPart()

# 释放 COM 引用
del cmds, part

# Phase 2: 通过 subprocess 调用独立脚本设置 MEAS/TARG
fix_script = os.path.join(os.path.dirname(__file__), "fix_meas_targ.py")
subprocess.run([sys.executable, fix_script], capture_output=True, text=True)
```

### MEAS/TARG 字段 ID

| 字段 | X | Y | Z | I | J | K |
|------|---|---|---|---|---|---|
| MEAS | 22 | 23 | 24 | 25 | 26 | 27 |
| TARG | 19 | 20 | 21 | 31 | 32 | 33 |

### 其他注意事项

- 删除命令使用 `cmd.Remove()`（不是 `cmds.Remove(idx)`）
- 删除时必须从后往前遍历，避免索引偏移
- 创建特征前用 `cmds.InsertionPointAfter(cmds.LastCommand)` 设置插入位置
- 创建后调用 `part.RefreshPart()` 刷新

---

## 6. Command.Type 与 TypeDescription

### 说明

每个 `Command` 对象都有 `Type`（枚举值）和 `TypeDescription`（可读字符串）：

```python
cmd_type = cmd.Type           # 整数枚举值
type_desc = cmd.TypeDescription  # 如 "LINE (VISION)", "CIRCLE (VISION)"
```

Vision 特征的常见 Type 值：
- `242` = EDGE POINT (VISION)
- `243` = LINE (VISION)
- `245` = CIRCLE (VISION)

可以通过 `TypeDescription` 中是否包含 `"(VISION)"` 来判断是否为 Vision 特征。


---

## 7. 创建新测量程序 (PartPrograms.Add)

### 方法

```python
# PartPrograms.Add(Name, Units, Machine, ProbeFile)
# Units 必须传整数枚举值: MM=1, INCH=0（传字符串会报 "类型不匹配"）
progs = pcdmis.PartPrograms
new_part = progs.Add("程序名", 1, "CMM1", "VISION.PRB")
```

### 注意事项

- `Units` 参数必须传整数（`1` 表示 MM），不能传字符串 `"MM"`
- `Machine` 参数：在线模式用 `"CMM1"`，离线模式用 `"Offline"`
- `ProbeFile` 是探针文件名（如 `"VISION.PRB"`），文件位于 PC-DMIS 程序目录
- 如果同名程序已存在，`Add` 会加载已有程序（忽略 Units 参数）
- 新程序默认包含 6 条命令：Start Alignment, End Alignment, Manual/DCC Mode, Dimension Format, Load Probe, Set Active Tip
- 新程序默认模式为 MANUAL，需要手动切换为 DCC

---

## 8. AsyncExecute 在 Python 中的调用方式

### 问题

`PartProgram.AsyncExecute()` 是无参方法，但 `win32com` 的 late-binding 模式
会将其误识别为属性（返回 `bool`），导致 `TypeError: 'bool' object is not callable`。

### 解决方案

```python
part._FlagAsMethod("AsyncExecute")
part.AsyncExecute()
```

### 说明

- `_FlagAsMethod()` 是 `win32com` 的内部方法，强制将指定名称标记为方法而非属性
- 同样的问题可能出现在其他无参方法上（如 `Execute`），都可以用此方式解决
- 另一种方式是使用 `EnsureDispatch` 进行 early-binding，但需要类型库支持

---

## 9. 部分执行程序（执行指定范围的命令）

### 方法

通过 `Command.Marked` 属性标记要执行的命令，然后调用 `AsyncExecute`。
PC-DMIS 会只执行被标记的命令。

```python
# 1. 取消所有标记
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd and cmd.Marked:
        cmd.Marked = False

# 2. 标记目标范围
for idx in range(start_idx, end_idx + 1):
    cmds(idx).Marked = True

# 3. 执行
part._FlagAsMethod("AsyncExecute")
part.AsyncExecute()
```

### 注意事项

- `Marked` 是 Read/Write `Boolean` 属性
- `Mark()` 方法会标记当前命令及其所有依赖项（如构造特征的源特征）
- 标记后 `AsyncExecute` 只执行被标记的命令

---

## 10. 添加 Move Point 命令

### 方法

```python
MOVE_POINT = 150  # OBTYPE
cmds.InsertionPointAfter(cmds.LastCommand)
cmd = cmds.Add(MOVE_POINT, True)
cmd.PutText(str(x), 7, 0)  # THEO_X
cmd.PutText(str(y), 8, 0)  # THEO_Y
cmd.PutText(str(z), 9, 0)  # THEO_Z
cmd.ReDraw()
part.RefreshPart()
```

---

## 11. 使用 win32gui 监控 PC-DMIS 窗口状态

### 查找 PC-DMIS 进程

```python
import psutil
pids = set()
for p in psutil.process_iter(['pid', 'name']):
    if 'pcdlrn' in p.info['name'].lower():
        pids.add(p.info['pid'])
```

### 检测 Execution 窗口按钮状态

- PC-DMIS 的 Execution 窗口类名为 `#32770`（标准 Windows 对话框）
- 按钮文本带 `&` 前缀表示快捷键（如 `&Continue`），匹配时需去除
- `win32gui.IsWindowEnabled(hwnd)` 检测按钮是否可点击
- `win32gui.PostMessage(hwnd, BM_CLICK, 0, 0)` 模拟点击

### 常驻窗口过滤

以下窗口是 PC-DMIS 的常驻功能窗口，不应视为弹窗：
- `Execution` — 执行对话框
- `Multi-Sensor Simulator` — 多传感器模拟器
- `Graphic Display Window` — 图形显示窗口

### 依赖

需要安装 `psutil`：`pip install psutil`
