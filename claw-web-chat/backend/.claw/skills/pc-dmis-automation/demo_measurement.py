#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PC-DMIS 自动化测量 Demo
========================
功能：自动创建测量程序 → 建立对齐 → 创建特征 → 评价尺寸 → 执行测量

适用场景：演示 PC-DMIS COM 自动化完整流程
设备类型：Vision 视觉测量系统
单位：毫米 (MM)

使用方法：
    python demo_measurement.py

前置条件：
    1. PC-DMIS 已启动（在线模式或离线模式均可查看程序结构）
    2. pip install pywin32 psutil
"""

import sys, io, os, time, traceback

# ============================================================
# 0. 环境准备 — 确保中文正确输出
# ============================================================
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

try:
    import win32com.client
except ImportError:
    print("❌ 缺少 pywin32 库，请执行: pip install pywin32")
    sys.exit(1)

# ============================================================
# 1. 常量定义
# ============================================================
# -- 单位 --
UNITS_MM   = 1   # 毫米
UNITS_INCH = 0   # 英寸

# -- 命令类型 OBTYPE --
MOVE_POINT        = 150   # 移动点
EDGE_POINT_VISION  = 242   # Edge Point (Vision)
LINE_VISION        = 243   # 直线 (Vision)
CIRCLE_VISION      = 245   # 圆 (Vision)
START_ALIGN        = 1     # 开始对齐
END_ALIGN          = 2     # 结束对齐
MANUAL_DCC_MODE    = 29    # Manual/DCC Mode

# -- 字段类型 ENUM_FIELD_TYPES --
THEO_X, THEO_Y, THEO_Z = 7, 8, 9
THEO_I, THEO_J, THEO_K = 16, 17, 18
TARG_X, TARG_Y, TARG_Z = 19, 20, 21
MEAS_X, MEAS_Y, MEAS_Z = 22, 23, 24
MEAS_I, MEAS_J, MEAS_K = 25, 26, 27
TARG_I, TARG_J, TARG_K = 31, 32, 33
MODE_TYPE    = 58    # DCC/Manual 模式
TARGET_TYPE  = 564   # Vision Target 类型
FEAT_TYPE    = 303   # 特征类型
ID_FIELD     = 2     # 命令 ID
FIND_NOMS   = 233    # Find Nominals

# ============================================================
# 2. 连接 PC-DMIS
# ============================================================
print("=" * 60)
print("  PC-DMIS 自动化测量 Demo")
print("=" * 60)
print()

try:
    pcdmis = win32com.client.Dispatch("PCDLRN.Application")
    print("✅ 已连接 PC-DMIS")
except Exception as e:
    print(f"❌ 无法连接 PC-DMIS: {e}")
    print("   请确保 PC-DMIS 已经启动")
    sys.exit(1)

# ============================================================
# 3. 创建新测量程序
# ============================================================
print("\n📁 创建测量程序...")

progs = pcdmis.PartPrograms
new_name = f"DEMO_零件测量_{time.strftime('%Y%m%d_%H%M%S')}"

# Add(Name, Units_Int, Machine, ProbeFile)
# Units 必须传整数: MM=1, INCH=0（传字符串会报错）
part = progs.Add(new_name, UNITS_MM, "CMM1", "VISION.PRB")
time.sleep(2)

print(f"  程序名称: {part.Name}")
print(f"  保存路径: {part.FullName}")

cmds = part.Commands
print(f"  初始命令数: {cmds.Count}")

# ============================================================
# 4. 切换为 DCC 模式
# ============================================================
print("\n⚙️  设置 DCC 自动模式...")

for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd and cmd.IsModal and "Manual/DCC" in cmd.TypeDescription:
        # 注意：必须用 PutText，SetToggleString 对此字段无效！
        cmd.PutText("DCC", MODE_TYPE, 0)
        cmd.ReDraw()
        print(f"  ✅ 已切换为 DCC 模式 (命令 #{idx})")
        break

part.RefreshPart()
time.sleep(0.5)

# ============================================================
# 5. 添加测量特征（模拟一个简单零件）
# ============================================================
print("\n📐 创建测量特征...")

def setup_insertion_point(cmds):
    """将插入位置设为最后一条命令之后"""
    cmds.InsertionPointAfter(cmds.LastCommand)

def create_move_point(cmds, x, y, z):
    """创建移动点"""
    setup_insertion_point(cmds)
    cmd = cmds.Add(MOVE_POINT, True)
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.ReDraw()
    return cmd

def create_vision_edge_point(cmds, name, x, y, z, i, j, k, target_type="MANUAL HIT TARGET"):
    """创建 Vision Edge Point"""
    setup_insertion_point(cmds)
    cmd = cmds.Add(EDGE_POINT_VISION, True)
    cmd.ID = name
    # 设置理论值 (THEO) — 同一 session 中可以生效
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.PutText(str(i), THEO_I, 0)
    cmd.PutText(str(j), THEO_J, 0)
    cmd.PutText(str(k), THEO_K, 0)
    # 设置 Target 类型
    if cmd.HasField(TARGET_TYPE, 0):
        cmd.PutText(target_type, TARGET_TYPE, 0)
    cmd.ReDraw()
    return cmd

def create_vision_line(cmds, name, x, y, z, i, j, k, target_type="MANUAL HIT TARGET"):
    """创建 Vision Line"""
    setup_insertion_point(cmds)
    cmd = cmds.Add(LINE_VISION, True)
    cmd.ID = name
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.PutText(str(i), THEO_I, 0)
    cmd.PutText(str(j), THEO_J, 0)
    cmd.PutText(str(k), THEO_K, 0)
    if cmd.HasField(TARGET_TYPE, 0):
        cmd.PutText(target_type, TARGET_TYPE, 0)
    cmd.ReDraw()
    return cmd

def create_vision_circle(cmds, name, x, y, z, i, j, k, diameter, target_type="MANUAL HIT TARGET"):
    """创建 Vision Circle"""
    setup_insertion_point(cmds)
    cmd = cmds.Add(CIRCLE_VISION, True)
    cmd.ID = name
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.PutText(str(i), THEO_I, 0)
    cmd.PutText(str(j), THEO_J, 0)
    cmd.PutText(str(k), THEO_K, 0)
    # 设置直径（THEO_SX 字段 ID=10，在圆类型中代表特征尺寸/直径）
    cmd.PutText(str(diameter), 10, 0)
    if cmd.HasField(TARGET_TYPE, 0):
        cmd.PutText(target_type, TARGET_TYPE, 0)
    cmd.ReDraw()
    return cmd

def create_alignment_command(cmds, align_type):
    """创建对齐命令 (START_ALIGN=1 或 END_ALIGN=2)"""
    setup_insertion_point(cmds)
    cmd = cmds.Add(align_type, True)
    cmd.ReDraw()
    return cmd

def create_dimension_location(cmds, feat_name, dim_id, upper_tol, lower_tol):
    """创建位置度评价（通过 PartProgram 内置方法）
    
    注意：PC-DMIS COM 的尺寸创建比较复杂，不同版本 OBTYPE 可能不同。
    这里使用 With 语句块尝试通过 PartProgram 对象直接添加。
    如果此方法不适用，请通过 PC-DMIS GUI 添加尺寸评价。
    """
    # 尝试方式：通过 cmds.Add 添加 LOCATION 尺寸
    # LOCATION 的 OBTYPE 约为 77（可能因版本而异）
    LOCATION = 77
    setup_insertion_point(cmds)
    try:
        dim_cmd = cmds.Add(LOCATION, True)
        dim_cmd.ID = dim_id
        # 关联特征
        dim_cmd.PutText(feat_name, ID_FIELD, 0)
        dim_cmd.PutText(f"正公差:{upper_tol} 负公差:{lower_tol}", 122, 0)
        dim_cmd.ReDraw()
        return dim_cmd
    except Exception:
        return None

def create_dimension_distance(cmds, feat1, feat2, dim_id, upper_tol, lower_tol):
    """创建距离评价（两特征间距）"""
    DISTANCE = 81
    setup_insertion_point(cmds)
    try:
        dim_cmd = cmds.Add(DISTANCE, True)
        dim_cmd.ID = dim_id
        dim_cmd.PutText(feat1, ID_FIELD, 0)   # 特征1
        dim_cmd.PutText(feat2, 202, 0)          # 特征2（REF_ID 字段）
        dim_cmd.PutText(f"±{upper_tol}", 122, 0)
        dim_cmd.ReDraw()
        return dim_cmd
    except Exception:
        return None


# ─── 5a. 安全移动点 ───
create_move_point(cmds, 0, 0, -130)
print("  📍 添加移动点: (0, 0, -130)")

# ─── 5b. 对齐块（START_ALIGN ... 对齐特征 ... END_ALIGN） ───
print("\n  🔹 创建对齐 (A1)...")
create_alignment_command(cmds, START_ALIGN)
print("    ├─ START_ALIGN")

# 原点圆：上表面中心孔（Manual: 操作员手动采点）
create_vision_circle(cmds, "ORG_CIRCLE", 50, 50, 0, 0, 0, 1, 20,
                     target_type="MANUAL HIT TARGET")
print("    ├─ 原点圆 ORG_CIRCLE @ (50, 50, 0) D=20")

# 方向线：工件前边
create_vision_line(cmds, "ALIGN_LINE", 0, 10, 0, 0, 1, 0,
                   target_type="MANUAL HIT TARGET")
print("    ├─ 对齐线 ALIGN_LINE @ (0, 10, 0)")

# 参考点
create_vision_edge_point(cmds, "REF_PT", 100, 10, 0, 0, 0, 1,
                         target_type="MANUAL HIT TARGET")
print("    ├─ 参考点 REF_PT @ (100, 10, 0)")

create_alignment_command(cmds, END_ALIGN)
print("    └─ END_ALIGN")
print("  ✅ 对齐块 A1 创建完成")

# ─── 5c. 测量特征 + 转移移动点（Automatic Hit Target） ───
print("\n  🔹 创建自动测量特征 + 安全转移点...")

# 定义测量特征的转移路径（从对齐区移动到各测量孔）
measurement_targets = [
    ("HOLE_1",  30, 30, -5, 0, 0, 1, 10, "AUTOMATIC HIT TARGET"),
    ("HOLE_2",  70, 30, -5, 0, 0, 1, 10, "AUTOMATIC HIT TARGET"),
    ("HOLE_3",  30, 70, -5, 0, 0, 1,  8, "AUTOMATIC HIT TARGET"),
    ("HOLE_4",  70, 70, -5, 0, 0, 1,  8, "AUTOMATIC HIT TARGET"),
]

for i, (name, x, y, z, i_vec, j_vec, k_vec, dia, ttype) in enumerate(measurement_targets, 1):
    # 安全高度转移 (Z=-130)
    create_move_point(cmds, x, y, -130)
    print(f"    ├─ 转移至 {name} 安全高度: ({x}, {y}, -130)")
    create_vision_circle(cmds, name, x, y, z, i_vec, j_vec, k_vec, dia, target_type=ttype)
    print(f"    ├─ 测量孔 {name} @ ({x}, {y}, {z}) D={dia}")

# 安全退出点
create_move_point(cmds, 0, 0, -130)
print("    └─ 退出移动点: (0, 0, -130)")

# ─── 5d. 尺寸评价 ───
print("\n  🔹 创建尺寸评价...")
dim_count = 0

# 各孔位置度评价 (±0.05mm)
for name, x, y, z, *rest in measurement_targets:
    result = create_dimension_location(cmds, name, f"LOC_{name}", 0.05, -0.05)
    if result:
        dim_count += 1
        print(f"    ✅ LOC_{name}: 位置度 ±0.050")

# 孔间距评价
hole_pairs = [("HOLE_1", "HOLE_2"), ("HOLE_3", "HOLE_4"),
              ("HOLE_1", "HOLE_3"), ("HOLE_2", "HOLE_4")]
for f1, f2 in hole_pairs:
    result = create_dimension_distance(cmds, f1, f2, f"DIST_{f1}_{f2}", 0.1, 0.0)
    if result:
        dim_count += 1
        print(f"    ✅ DIST_{f1}_{f2}: 间距 ±0.100")

print(f"  共创建 {dim_count} 个尺寸评价")

part.RefreshPart()
print(f"\n  程序总命令数: {cmds.Count}")

# ============================================================
# 6. 列出所有命令（概要）
# ============================================================
print("\n" + "=" * 60)
print("  命令清单")
print("=" * 60)

for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd is None:
        print(f"  [{idx:3d}] None")
        continue
    name = cmd.ID.strip() if cmd.ID else "(无名)"
    tdesc = cmd.TypeDescription if cmd.TypeDescription else "(未知)"

    # 判断特征类型
    tags = []
    if cmd.IsFeature:
        tags.append("特征")
    if cmd.IsModal:
        tags.append("Modal")
    if cmd.HasField(TARGET_TYPE, 0):
        target = cmd.GetText(TARGET_TYPE, 0)
        tags.append(target)
    tag_str = f" [{', '.join(tags)}]" if tags else ""

    print(f"  [{idx:3d}] {name:20s} {tdesc}{tag_str}")

# ============================================================
# 7. 保存程序
# ============================================================
print("\n💾 保存程序...")
try:
    part.Save()
    print(f"  ✅ 程序已保存到: {part.FullName}")
except Exception as e:
    print(f"  ⚠️  保存失败: {e}")

# ============================================================
# 8. 检查执行状态
# ============================================================
print("\n" + "=" * 60)
print("  📊 程序摘要")
print("=" * 60)

# 统计各类命令
feature_count = 0
vision_count = 0
move_count = 0
for idx in range(1, cmds.Count + 1):
    cmd = cmds(idx)
    if cmd is None:
        continue
    if cmd.IsFeature:
        feature_count += 1
    if "(VISION)" in (cmd.TypeDescription or ""):
        vision_count += 1
    if "MOVE" in (cmd.TypeDescription or "").upper() and "POINT" in (cmd.TypeDescription or "").upper():
        move_count += 1

print(f"  总命令数:      {cmds.Count}")
print(f"  Vision 特征:   {vision_count}")
print(f"  测量特征数:    {feature_count}")
print(f"  移动点:        {move_count}")
print(f"  程序名称:      {part.Name}")

# ============================================================
# 9. 可选：执行程序（需要在线模式 + 实际工件）
# ============================================================
print("\n" + "=" * 60)
print("  ⚙️  执行说明")
print("=" * 60)
print("""
  如要在实际设备上运行此程序：

  1. 确保 PC-DMIS 连接了测量设备（在线模式）
  2. 将工件放入测量区域
  3. 手动对齐：在 Execution 窗口中依次采点
     - ORG_CIRCLE (原点圆)
     - ALIGN_LINE (对齐线)
     - REF_PT (参考点)
  4. DCC 自动测量其余特征

  Python 控制执行:
    part._FlagAsMethod("AsyncExecute")
    part.AsyncExecute()

  仅执行指定范围:
    for idx in range(start, end + 1):
        cmds(idx).Marked = True
    part._FlagAsMethod("AsyncExecute")
    part.AsyncExecute()
""")

print("✅ Demo 程序创建完成！")
print(f"   可以在 PC-DMIS 中打开: {part.FullName}")
