# PC-DMIS Python 脚本模板库

本文档包含经过实际验证的 Python 脚本模板，可直接复用或稍作修改使用。
所有脚本均基于 `win32com.client.Dispatch("PCDLRN.Application")` 连接 PC-DMIS。

---

## 通用连接模板

所有脚本的标准开头，包含 UTF-8 输出和错误处理：

```python
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import win32com.client

pcdmis = win32com.client.Dispatch("PCDLRN.Application")
part = pcdmis.ActivePartProgram
if not part:
    print("没有打开的测量程序"); sys.exit(1)
cmds = part.Commands
```

> **注意**: `sys.stdout` 的 UTF-8 包装是为了在 Windows 终端正确显示中文。

---

## 1. 查询类

### 1.1 获取程序信息和命令数

```python
cmds = part.Commands
print(f"程序: {part.Name}")
print(f"路径: {part.FullName}")
print(f"命令数: {cmds.Count}")
```

### 1.2 查看当前执行位置

```python
# 已执行命令集合
ec = part.ExecutedCommands
exec_count = ec.Count if ec else 0

# 当前命令（下一条待执行）
cur = cmds.CurrentCommand
if cur:
    print(f"当前命令: {cur.ID.strip()} ({cur.TypeDescription})")

# 列出所有命令及执行状态
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    status = "✅" if idx <= exec_count else "⬜"
    if idx == exec_count:
        status = "▶️"
    print(f"  {status} {idx:3d}. {cmd.ID.strip():20s} ({cmd.TypeDescription})")
```

### 1.3 区分 Vision 特征的 Manual/Auto Hit Target

```python
TARGET_TYPE = 564  # ENUM_FIELD_TYPES.TARGET_TYPE

for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if not cmd or not cmd.IsFeature:
        continue
    if not cmd.HasField(TARGET_TYPE, 0):
        continue
    target = cmd.GetText(TARGET_TYPE, 0)
    # "MANUAL HIT TARGET" / "AUTOMATIC HIT TARGET"
    print(f"{cmd.ID.strip()}: {target}")
```

---

## 2. 修改类

### 2.1 修改特征理论值

通过 `PutText` 修改任意字段值：

```python
# ENUM_FIELD_TYPES 常量
THEO_X, THEO_Y, THEO_Z = 7, 8, 9
THEO_I, THEO_J, THEO_K = 16, 17, 18

# 查找目标特征并修改
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd and cmd.IsFeature and cmd.ID.strip() == "目标特征名":
        old_x = float(cmd.GetText(THEO_X, 0))
        cmd.PutText(str(old_x + 1), THEO_X, 0)
        cmd.ReDraw()
        break
```

### 2.2 切换 DCC/Manual 模式

```python
MODE_TYPE = 58  # ENUM_FIELD_TYPES.MODE_TYPE

for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd and cmd.IsModal and "Manual/DCC" in cmd.TypeDescription:
        # 切换为 DCC 或 MANUAL
        cmd.PutText("DCC", MODE_TYPE, 0)  # 或 "MANUAL"
        cmd.ReDraw()
        break
```

> **注意**: `SetToggleString` 和直接赋值 `ManDCCMode` 对此字段无效，必须用 `PutText`。

---

## 3. 创建类

### 3.1 创建新测量程序

```python
import time

progs = pcdmis.PartPrograms
# Add(Name, Units, Machine, ProbeFile)
# UNITTYPE: MM=1, INCH=0
new_part = progs.Add("程序名", 1, "CMM1", "VISION.PRB")
time.sleep(2)

# 设置 DCC 模式
cmds = new_part.Commands
MODE_TYPE = 58
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd and "Manual/DCC" in cmd.TypeDescription:
        cmd.PutText("DCC", MODE_TYPE, 0)
        cmd.ReDraw()
        break
new_part.RefreshPart()
```

### 3.2 添加 Move Point

```python
MOVE_POINT = 150  # OBTYPE
THEO_X, THEO_Y, THEO_Z = 7, 8, 9

cmds.InsertionPointAfter(cmds.LastCommand)
cmd = cmds.Add(MOVE_POINT, True)
cmd.PutText("2", THEO_X, 0)
cmd.PutText("4", THEO_Y, 0)
cmd.PutText("-127", THEO_Z, 0)
cmd.ReDraw()
part.RefreshPart()
```

### 3.3 创建 Vision Edge Point（两阶段方案）

在同一 COM session 中 `cmds.Add()` 后，MEAS/TARG 的 `PutText` 不生效。
必须用 subprocess 调用独立脚本来设置 MEAS/TARG。

```python
import subprocess, os

# ── 常量 ──
THEO_X, THEO_Y, THEO_Z = 7, 8, 9
THEO_I, THEO_J, THEO_K = 16, 17, 18
TARGET_TYPE = 564
EDGE_POINT_VISION = 242  # OBTYPE

# ── Phase 1: 创建 + 设置 THEO ──
cmds.InsertionPointAfter(cmds.LastCommand)
cmd = cmds.Add(EDGE_POINT_VISION, True)
cmd.ID = "特征名"
for fid, val in [(THEO_X, x), (THEO_Y, y), (THEO_Z, z),
                 (THEO_I, i), (THEO_J, j), (THEO_K, k)]:
    cmd.PutText(str(val), fid, 0)
if cmd.HasField(TARGET_TYPE, 0):
    cmd.PutText("MANUAL HIT TARGET", TARGET_TYPE, 0)  # 或 "AUTOMATIC HIT TARGET"
cmd.ReDraw()
part.RefreshPart()

# 释放 COM 引用
del cmds, part

# ── Phase 2: subprocess 设置 MEAS/TARG ──
# fix_meas_targ.py 中使用以下字段 ID:
#   MEAS: XYZ=(22,23,24), IJK=(25,26,27)
#   TARG: XYZ=(19,20,21), IJK=(31,32,33)
subprocess.run([sys.executable, "fix_meas_targ.py"], capture_output=True, text=True)
```

### 3.4 删除命令

```python
# 从后往前删，避免索引偏移
for idx in range(cmds.Count, 0, -1):
    cmd = cmds(idx)
    if cmd and cmd.ID.strip() == "要删除的特征名":
        cmd.Remove()  # 注意: 是 cmd.Remove() 不是 cmds.Remove(idx)
part.RefreshPart()
```

---

## 4. 执行类

### 4.1 执行整个程序

```python
# AsyncExecute 是无参方法，但 win32com late-binding 会误认为属性
# 必须用 _FlagAsMethod 标记
part._FlagAsMethod("AsyncExecute")
part.AsyncExecute()
```

### 4.2 执行指定范围的命令

通过 `Marked` 属性标记命令范围，然后 `AsyncExecute` 只执行被标记的命令：

```python
# 取消所有标记
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd and cmd.Marked:
        cmd.Marked = False

# 标记目标范围（按特征名查找起止索引）
start_name, end_name = "点1", "圆3"
start_idx = end_idx = None
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if not cmd: continue
    name = cmd.ID.strip()
    if name == start_name and start_idx is None:
        start_idx = idx
    if name == end_name:
        end_idx = idx

for idx in range(start_idx, end_idx + 1):
    cmd = cmds(idx)
    if cmd:
        cmd.Marked = True

# 执行标记的命令
part._FlagAsMethod("AsyncExecute")
part.AsyncExecute()
```

---

## 5. 监控类

### 5.1 监控 Execution 窗口 Continue 按钮状态

使用 `win32gui` 检测 PC-DMIS Execution 窗口中 Continue 按钮是否可点击：

```python
import win32gui, win32process, win32con, psutil

def find_pcdmis_pids():
    pids = set()
    for p in psutil.process_iter(['pid', 'name']):
        n = p.info['name'].lower()
        if 'pcdlrn' in n or 'pcdmis' in n:
            pids.add(p.info['pid'])
    return pids

def find_execution_window(pids):
    result = []
    def cb(hwnd, _):
        if not win32gui.IsWindowVisible(hwnd): return
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        if pid in pids and 'execution' in win32gui.GetWindowText(hwnd).strip().lower():
            result.append(hwnd)
    win32gui.EnumWindows(cb, None)
    return result[0] if result else None

def get_continue_button(exec_hwnd):
    buttons = []
    def cb(hwnd, _):
        if win32gui.GetClassName(hwnd).lower() == 'button':
            text = win32gui.GetWindowText(hwnd)
            if 'continue' in text.replace('&', '').lower():
                buttons.append({
                    'hwnd': hwnd,
                    'enabled': win32gui.IsWindowEnabled(hwnd)
                })
    win32gui.EnumChildWindows(exec_hwnd, cb, None)
    return buttons[0] if buttons else None

# 自动点击 Continue
def auto_click_continue(btn):
    if btn and btn['enabled']:
        win32gui.PostMessage(btn['hwnd'], win32con.BM_CLICK, 0, 0)
```

### 5.2 监控弹窗对话框

检测 PC-DMIS 进程中新出现的对话框（过滤常驻窗口）：

```python
KNOWN_WINDOWS = {"execution", "multi-sensor simulator", "graphic display window", "pc-dmis"}

def scan_popups(pids):
    popups = []
    def cb(hwnd, _):
        if not win32gui.IsWindowVisible(hwnd): return
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        if pid not in pids: return
        title = win32gui.GetWindowText(hwnd)
        cls = win32gui.GetClassName(hwnd)
        if cls != '#32770': return
        if any(kw in title.strip().lower() for kw in KNOWN_WINDOWS): return
        popups.append({'hwnd': hwnd, 'title': title})
    win32gui.EnumWindows(cb, None)
    return popups
```

---

## 常用 OBTYPE 值

| 常量 | 值 | 说明 |
|------|-----|------|
| `MOVE_POINT` | 150 | Move Point 命令 |
| `MOVE_CLEARPOINT` | 163 | Move Clear Point |
| `MOVE_INCREMENT` | 154 | Move Increment |
| `EDGE_POINT_VISION` | 242 | Edge Point (Vision) |
| `LINE_VISION` | 243 | Line (Vision) |
| `CIRCLE_VISION` | 245 | Circle (Vision) |
| `START_ALIGN` | 1 | Start Alignment |
| `END_ALIGN` | 2 | End Alignment |

## 常用 ENUM_FIELD_TYPES 值

| 常量 | 值 | 说明 |
|------|-----|------|
| `THEO_X/Y/Z` | 7/8/9 | 理论坐标 |
| `THEO_SX/SY/SZ` | 10/11/12 | 表面向量 |
| `THEO_I/J/K` | 16/17/18 | 理论向量 |
| `TARG_X/Y/Z` | 19/20/21 | 目标坐标 |
| `MEAS_X/Y/Z` | 22/23/24 | 实测坐标 |
| `MEAS_I/J/K` | 25/26/27 | 实测向量 |
| `TARG_I/J/K` | 31/32/33 | 目标向量 |
| `MODE_TYPE` | 58 | DCC/Manual 模式 |
| `TARGET_TYPE` | 564 | Vision Target 类型 |
