# -*- coding: utf-8 -*-
"""
PC-DMIS 自动化测量演示脚本
============================
功能：自动创建测量程序 → 测量特征 → 添加尺寸 → 执行
适用：离线/在线模式，接触式测头

使用方法：
  1. 确保 PC-DMIS 已打开
  2. 运行: python pc_dmis_demo.py
"""

import sys
import io
import time

# Windows 终端 UTF-8 支持
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

try:
    import win32com.client
except ImportError:
    print("❌ 需要安装 pywin32: pip install pywin32")
    sys.exit(1)

# ============================================================
# 常量定义
# ============================================================

# OBTYPE - 命令类型
START_ALIGN = 1
END_ALIGN = 2
MOVE_POINT = 150
MOVE_CLEARPOINT = 163
MODE_CHANGE = 5        # Manual/DCC Mode
DIM_FORMAT = 6         # Dimension Format
LOAD_PROBE = 3         # Load Probe
SET_TIP = 4            # Set Active Tip
AUTO_PLANE = 68        # Auto Plane
AUTO_LINE = 69         # Auto Line
AUTO_CIRCLE = 70       # Auto Circle
AUTO_CYLINDER = 71     # Auto Cylinder
AUTO_POINT = 65        # Auto Point
CONST_PLANE = 57       # Constructed Plane
CONST_LINE = 56        # Constructed Line
CONST_CIRCLE = 55      # Constructed Circle
DIM_LOCATION = 85      # Location Dimension
DIM_POSITION = 86      # True Position Dimension

# ENUM_FIELD_TYPES
THEO_X, THEO_Y, THEO_Z = 7, 8, 9
THEO_I, THEO_J, THEO_K = 16, 17, 18
MODE_TYPE = 58
MEAS_X, MEAS_Y, MEAS_Z = 22, 23, 24
MEAS_I, MEAS_J, MEAS_K = 25, 26, 27


def connect_pcdmis():
    """连接到 PC-DMIS 应用程序"""
    print("🔄 正在连接 PC-DMIS...")
    try:
        pcdmis = win32com.client.Dispatch("PCDLRN.Application")
        pcdmis.Visible = True  # 显示主窗口
        print("✅ 连接成功！")
        return pcdmis
    except Exception as e:
        print(f"❌ 连接失败: {e}")
        print("   请确保 PC-DMIS 已安装并运行")
        sys.exit(1)


def create_program(pcdmis, name="DEMO_测量演示"):
    """创建新的测量程序"""
    print(f"📄 创建程序: {name}")
    progs = pcdmis.PartPrograms
    try:
        # Add(Name, Units, Machine, ProbeFile)
        # Units: 1=MM, 0=INCH; Machine: "Offline" / "CMM1"; ProbeFile: 探针文件
        part = progs.Add(name, 1, "Offline", "VISION.PRB")
        time.sleep(1)
        print("✅ 程序创建成功")
        return part
    except Exception as e:
        print(f"❌ 创建程序失败: {e}")
        # 尝试获取已打开的程序
        part = pcdmis.ActivePartProgram
        if part:
            print(f"✅ 使用已打开的程序: {part.Name}")
            return part
        raise


def switch_to_dcc(part):
    """切换为 DCC 模式"""
    cmds = part.Commands
    for idx in range(1, cmds.Count + 1):
        cmd = cmds(idx)
        if cmd and "Manual/DCC" in cmd.TypeDescription:
            cmd.PutText("DCC", MODE_TYPE, 0)
            cmd.ReDraw()
            print("✅ 已切换为 DCC 模式")
            break


def add_move_point(part, x, y, z):
    """添加移动点"""
    cmds = part.Commands
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(MOVE_POINT, True)
    cmd.ID = f"MOVE_{x}_{y}_{z}"
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.ReDraw()
    part.RefreshPart()
    print(f"  ➡️  移动点: ({x}, {y}, {z})")


def add_auto_plane(part, name, x, y, z, i, j, k, size=20):
    """添加自动平面"""
    cmds = part.Commands
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(AUTO_PLANE, True)
    cmd.ID = name
    # 设置理论值
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.PutText(str(i), THEO_I, 0)
    cmd.PutText(str(j), THEO_J, 0)
    cmd.PutText(str(k), THEO_K, 0)
    # 设置测量范围（平面边长）
    # FeatCmd 属性
    feat = cmd.FeatureCommand
    if feat:
        feat.BoxLength = size
        feat.BoxWidth = size
        feat.NumHits = 4  # 4个测量点
    cmd.ReDraw()
    part.RefreshPart()
    print(f"  📐 平面 '{name}': 中心({x},{y},{z}) 法向({i},{j},{k})")


def add_auto_circle(part, name, x, y, z, i, j, k, diam=10):
    """添加自动圆"""
    cmds = part.Commands
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(AUTO_CIRCLE, True)
    cmd.ID = name
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.PutText(str(i), THEO_I, 0)
    cmd.PutText(str(j), THEO_J, 0)
    cmd.PutText(str(k), THEO_K, 0)
    # 设置直径和测点数
    feat = cmd.FeatureCommand
    if feat:
        feat.TheoDiam = diam
        feat.NumHits = 4  # 4个点
    cmd.ReDraw()
    part.RefreshPart()
    print(f"  ⭕ 圆 '{name}': 中心({x},{y},{z}) 直径{diam}")


def add_auto_line(part, name, x, y, z, i, j, k, length=20):
    """添加自动直线"""
    cmds = part.Commands
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(AUTO_LINE, True)
    cmd.ID = name
    cmd.PutText(str(x), THEO_X, 0)
    cmd.PutText(str(y), THEO_Y, 0)
    cmd.PutText(str(z), THEO_Z, 0)
    cmd.PutText(str(i), THEO_I, 0)
    cmd.PutText(str(j), THEO_J, 0)
    cmd.PutText(str(k), THEO_K, 0)
    feat = cmd.FeatureCommand
    if feat:
        feat.TheoLength = length
        feat.NumHits = 4
    cmd.ReDraw()
    part.RefreshPart()
    print(f"  📏 直线 '{name}': ({x},{y},{z}) 方向({i},{j},{k})")


def add_location_dimension(part, name, feat_name, tol_plus=0.1, tol_minus=0.1):
    """添加位置尺寸（测量X/Y/Z坐标偏差）"""
    cmds = part.Commands
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(DIM_LOCATION, True)
    dim = cmd.DimensionCommand
    if dim:
        dim.ID = name
        dim.Feat1 = feat_name  # 关联特征
        dim.Plus = tol_plus    # 上公差
        dim.Minus = tol_minus  # 下公差
    cmd.ReDraw()
    part.RefreshPart()
    print(f"  📊 尺寸 '{name}': 关联 '{feat_name}' 公差 +{tol_plus}/-{tol_minus}")


def add_position_dimension(part, name, feat_name, tol=0.2):
    """添加位置度尺寸"""
    cmds = part.Commands
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(DIM_POSITION, True)
    dim = cmd.DimensionCommand
    if dim:
        dim.ID = name
        dim.Feat1 = feat_name
        dim.Plus = tol
        dim.Minus = 0  # 位置度只有正公差
    cmd.ReDraw()
    part.RefreshPart()
    print(f"  🎯 位置度 '{name}': 关联 '{feat_name}' 公差 Ø{tol}")


def list_commands(part):
    """列出程序中的所有命令"""
    cmds = part.Commands
    print(f"\n📋 程序命令列表 ({cmds.Count} 条):")
    print("-" * 60)
    for idx in range(1, cmds.Count + 1):
        cmd = cmds(idx)
        if cmd:
            print(f"  {idx:3d}. [{cmd.TypeDescription:25s}] {cmd.ID.strip()}")
    print("-" * 60)


def save_and_execute(part):
    """保存并执行程序"""
    # 保存
    try:
        part.Save()
        print(f"\n💾 程序已保存: {part.FullName}")
    except Exception as e:
        print(f"⚠️  保存失败: {e}")

    # 执行
    print("\n▶️  开始执行测量程序...")
    try:
        part._FlagAsMethod("AsyncExecute")
        part.AsyncExecute()
        print("✅ 程序已启动执行！")
        print("📌 请切换到 PC-DMIS 窗口查看执行进度")
    except Exception as e:
        print(f"❌ 执行失败: {e}")


def main():
    """主函数：创建完整的测量演示程序"""
    print("=" * 60)
    print("  PC-DMIS 自动测量演示脚本")
    print("=" * 60)

    # 1. 连接 PC-DMIS
    pcdmis = connect_pcdmis()

    # 2. 创建程序
    part = create_program(pcdmis, "DEMO_测量演示")
    cmds = part.Commands

    # 3. 切换到 DCC 模式
    switch_to_dcc(part)

    # ============================================================
    # 4. 创建工件特征
    # 模拟一个简单工件：
    #
    #    ┌──────────────┐  ← 顶面 PLANE_TOP (Z=0)
    #    │     ⭕       │
    #    │   CIRCLE1    │  圆心(50, 50, 0), 直径20mm
    #    │   (孔径)     │
    #    │              │
    #    │   ───────    │  ← LINE1 (X方向)
    #    │              │
    #    └──────────────┘
    #    ↑
    #  侧面 PLANE_SIDE (X=0)
    #
    # ============================================================

    print("\n🔧 创建测量特征...")

    # 4.1 顶部平面 (Z=0 平面)
    add_auto_plane(part, "PLANE_TOP", 50, 50, 0, 0, 0, 1, size=40)

    # 4.2 侧面平面 (X=0 平面)
    add_auto_plane(part, "PLANE_SIDE", 0, 50, 0, 1, 0, 0, size=40)

    # 4.3 前侧平面 (Y=0 平面)
    add_auto_plane(part, "PLANE_FRONT", 50, 0, 0, 0, 1, 0, size=40)

    # 4.4 移动到圆位置
    add_move_point(part, 50, 50, 10)

    # 4.5 圆孔 (在顶面上，直径20mm)
    add_auto_circle(part, "CIRCLE_HOLE", 50, 50, 0, 0, 0, 1, diam=20)

    # 4.6 另一个圆孔
    add_move_point(part, 20, 30, 10)
    add_auto_circle(part, "CIRCLE_SMALL", 20, 30, 0, 0, 0, 1, diam=10)

    # 4.7 在顶面上加一条直线
    add_move_point(part, 10, 50, 5)
    add_auto_line(part, "LINE_TOP", 50, 50, 0, 1, 0, 0, length=40)

    # ============================================================
    # 5. 添加尺寸
    # ============================================================
    print("\n📊 添加尺寸公差...")

    # 5.1 圆孔位置尺寸（测量实际位置与理论位置的偏差）
    add_location_dimension(part, "DIM_HOLE_POS", "CIRCLE_HOLE", tol_plus=0.1, tol_minus=0.1)

    # 5.2 小圆位置尺寸
    add_location_dimension(part, "DIM_SMALL_POS", "CIRCLE_SMALL", tol_plus=0.05, tol_minus=0.05)

    # 5.3 圆孔位置度
    add_position_dimension(part, "DIM_HOLE_TP", "CIRCLE_HOLE", tol=0.2)

    # ============================================================
    # 6. 列出所有命令
    # ============================================================
    list_commands(part)

    # ============================================================
    # 7. 执行
    # ============================================================
    save_and_execute(part)

    print("\n🎉 演示完成！")
    print("=" * 60)


if __name__ == "__main__":
    main()
