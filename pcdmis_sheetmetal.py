# -*- coding: utf-8 -*-
"""
PC-DMIS 通用钣金件测量程序生成器
===================================
适用于：平板类钣金件、安装支架、盖板、底板等
测量内容：
  1. 基准平面 (顶面) — Z轴找正 + Z原点
  2. 基准边线 (长边) — XY旋转找正
  3. 基准边线 (短边) — X/Y原点
  4. 安装孔 / 定位孔 — 位置度、直径
  5. 平面度评价
  6. 关键尺寸评价

使用方式：先在 PC-DMIS 中打开，然后运行此脚本
===================================
"""

import win32com.client
import pythoncom
import math
import time
import sys

# ============================================================
# 配置区 — 请根据实际零件修改以下参数
# ============================================================

# --- 零件基本信息 ---
PART_NAME = "钣金件测量程序"
UNITS = 1                      # 1=MM, 0=INCH
MACHINE = "CMM1"               # 在线="CMM1"，离线="Offline"
PROBE_FILE = "PROBE.PRB"       # 探针文件

# --- 工件坐标系原点 ---
# 通常原点在零件一角，Z=0在顶面
ORIGIN_X = 0
ORIGIN_Y = 0
ORIGIN_Z = 0

# --- 测量参数 ---
CLEAR_PLANE_DIST = 5.0         # 安全平面距离 (mm)
SURFACE_INDENT = 2.0           # 表面逼近距离 (mm)
DEPTH = 3.0                    # 测量深度 (mm)
APPROACH_DIST = 3.0            # 趋近距离 (mm)
RETRACT_DIST = 3.0             # 回退距离 (mm)
MOVE_DIST = 5.0                # 移动距离 (mm)

# --- 顶面 (基准A) ---
# 假设零件为长方形，在顶面测4~5个点
PLANE_TOP = {
    "id": "基准A",
    "hits": 5,                 # 采点数 (4~5)
    "nominal": {
        "x": 50, "y": 30, "z": 0,
        "i": 0, "j": 0, "k": 1  # Z+ 方向
    }
}

# --- 长边线 (基准B) ---
LINE_LONG = {
    "id": "基准B",
    "hits": 4,
    "nominal": {
        "x1": 0, "y1": 0, "z1": 0,
        "x2": 100, "y2": 0, "z2": 0,
        "i": 0, "j": 1, "k": 0  # 法向 Y+
    }
}

# --- 短边线或点 (基准C) ---
LINE_SHORT = {
    "id": "基准C",
    "hits": 4,
    "nominal": {
        "x1": 0, "y1": 0, "z1": 0,
        "x2": 0, "y2": 60, "z2": 0,
        "i": 1, "j": 0, "k": 0  # 法向 X+
    }
}

# --- 孔特征 (安装孔/定位孔) ---
# 格式: [id, x, y, z, 直径(理论), 采点数, 公差+, 公差-]
HOLES = [
    ("孔1",  20,  15,  0,  6.5,  6,  0.1,  0.1),
    ("孔2",  80,  15,  0,  6.5,  6,  0.1,  0.1),
    ("孔3",  80,  45,  0,  6.5,  6,  0.1,  0.1),
    ("孔4",  20,  45,  0,  6.5,  6,  0.1,  0.1),
]

# 如果有大的中心孔，额外添加
CENTER_HOLES = [
    # ("中心孔",  50,  30,  0, 20.0,  8,  0.05,  0.05),
]

# --- 轮廓/外形尺寸 ---
# 采样点的位置
EDGE_POINTS = [
    ("外形_X长", 100, "X"),   # X方向长度
    ("外形_Y宽", 60,  "Y"),   # Y方向宽度
]

# --- 公差设置 ---
FLATNESS_TOLERANCE = 0.1       # 平面度公差 (mm)
POSITION_TOLERANCE = 0.2       # 位置度公差 (mm)
DIM_TOLERANCE_PLUS = 0.2      # 尺寸上公差 (mm)
DIM_TOLERANCE_MINUS = 0.2     # 尺寸下公差 (mm)


# ============================================================
# 脚本开始 — 无需修改以下内容
# ============================================================

pythoncom.CoInitialize()

# ---- COM 常量定义 ----
# 命令类型 (OBTYPE)
CMD_COMMENT = 170
CMD_PLANE = 207
CMD_LINE = 204
CMD_CIRCLE = 202
CMD_POINT = 200
CMD_DIMENSION = 218
CMD_START_ALIGN = 1
CMD_LEVEL_ALIGN = 2
CMD_ROTATE_ALIGN = 3
CMD_TRANSLATE_ALIGN = 11
CMD_END_ALIGN = 19
CMD_SET_PROBE = 120
CMD_MODE = 100
CMD_LOAD_PROBE = 122
CMD_DIM_FORMAT = 217
CMD_MOVE_POINT = 150

# 字段类型
FIELD_THEO_X = 7
FIELD_THEO_Y = 8
FIELD_THEO_Z = 9
FIELD_THEO_I = 16
FIELD_THEO_J = 17
FIELD_THEO_K = 18
FIELD_TARG_X = 19
FIELD_TARG_Y = 20
FIELD_TARG_Z = 21
FIELD_MEAS_X = 22
FIELD_MEAS_Y = 23
FIELD_MEAS_Z = 24
FIELD_DIAM = 34
FIELD_NUM_HITS = 70
FIELD_START_ANG = 283
FIELD_END_ANG = 284
FIELD_ID = 189
FIELD_COMMENT_TYPE = 190
FIELD_INNER = 40


def add_comment(cmds, text, ctype=3):
    """插入注释命令"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_COMMENT, True)
    cmd.PutText(str(ctype), FIELD_COMMENT_TYPE, 0)
    cmd.PutText(text, FIELD_ID, 1)
    cmd.ReDraw()
    return cmd


def add_plane_auto(cmds, feat_id):
    """添加自动平面特征"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_PLANE, True)
    cmd.ID = feat_id
    feat_cmd = cmd.FeatCmd
    # 理论值
    feat_cmd.TheoX = PLANE_TOP["nominal"]["x"]
    feat_cmd.TheoY = PLANE_TOP["nominal"]["y"]
    feat_cmd.TheoZ = PLANE_TOP["nominal"]["z"]
    feat_cmd.TheoI = PLANE_TOP["nominal"]["i"]
    feat_cmd.TheoJ = PLANE_TOP["nominal"]["j"]
    feat_cmd.TheoK = PLANE_TOP["nominal"]["k"]
    # 测量参数
    feat_cmd.AutoMove = True
    feat_cmd.AutoMoveDistance = APPROACH_DIST
    feat_cmd.Indent = SURFACE_INDENT
    feat_cmd.Depth = DEPTH
    feat_cmd.NumHits = PLANE_TOP["hits"]
    feat_cmd.BoxLength = EDGE_POINTS[0][1] * 0.8
    feat_cmd.BoxWidth = EDGE_POINTS[1][1] * 0.8
    # 清除平面
    feat_cmd.AutoClearPlane = True
    cmd.ReDraw()
    return cmd


def add_line_auto(cmds, feat_id, line_data, is_long=True):
    """添加自动直线特征 (测边)"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_LINE, True)
    cmd.ID = feat_id
    feat_cmd = cmd.FeatCmd

    if is_long:
        # 长边: 沿X方向
        feat_cmd.TheoX = line_data["nominal"]["x1"] + 50
        feat_cmd.TheoY = line_data["nominal"]["y1"]
        feat_cmd.TheoZ = line_data["nominal"]["z1"]
        feat_cmd.TheoI = line_data["nominal"]["i"]
        feat_cmd.TheoJ = line_data["nominal"]["j"]
        feat_cmd.TheoK = line_data["nominal"]["k"]
        feat_cmd.BoxLength = 80
        feat_cmd.BoxWidth = 4
    else:
        # 短边: 沿Y方向
        feat_cmd.TheoX = line_data["nominal"]["x1"]
        feat_cmd.TheoY = line_data["nominal"]["y1"] + 30
        feat_cmd.TheoZ = line_data["nominal"]["z1"]
        feat_cmd.TheoI = line_data["nominal"]["i"]
        feat_cmd.TheoJ = line_data["nominal"]["j"]
        feat_cmd.TheoK = line_data["nominal"]["k"]
        feat_cmd.BoxLength = 40
        feat_cmd.BoxWidth = 4

    feat_cmd.AutoMove = True
    feat_cmd.AutoMoveDistance = APPROACH_DIST
    feat_cmd.Indent = SURFACE_INDENT
    feat_cmd.Depth = DEPTH
    feat_cmd.NumHits = line_data["hits"]
    feat_cmd.Line3D = False
    cmd.ReDraw()
    return cmd


def add_circle_auto(cmds, feat_id, x, y, z, diam, hits, start_ang=0, end_ang=360, is_inner=True):
    """添加自动圆特征 (测孔)"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_CIRCLE, True)
    cmd.ID = feat_id
    feat_cmd = cmd.FeatCmd
    feat_cmd.TheoX = x
    feat_cmd.TheoY = y
    feat_cmd.TheoZ = z
    feat_cmd.TheoI = 0
    feat_cmd.TheoJ = 0
    feat_cmd.TheoK = 1
    feat_cmd.TheoDiam = diam
    feat_cmd.NumHits = hits
    feat_cmd.StartAngle = start_ang
    feat_cmd.EndAngle = end_ang
    feat_cmd.Inner = is_inner
    feat_cmd.AutoMove = True
    feat_cmd.AutoMoveDistance = APPROACH_DIST
    feat_cmd.Indent = SURFACE_INDENT
    feat_cmd.Depth = DEPTH
    feat_cmd.AutoClearPlane = True
    feat_cmd.FindHole = True
    cmd.ReDraw()
    return cmd


def add_dimension(cmds, dim_id, dim_type, feat1, feat2="", axis=""):
    """添加尺寸评价"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_DIMENSION, True)
    cmd.ID = dim_id
    dim_cmd = cmd.DimensionCommand

    # dim_type: 0=位置度, 1=位置, 2=距离, 3=角度, ...
    # 这个需要使用 PutText 设置具体类型
    cmd.PutText("0", 303, 0)  # DIMENSION_TYPE
    cmd.ReDraw()
    return cmd


def add_flatness(cmds, feat_id, feat_name, tolerance):
    """添加平面度评价"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_DIMENSION, True)
    cmd.ID = feat_id

    # 设置维度类型为平面度 (FLATNESS)
    # 使用 DimensionCommand 对象
    dim_cmd = cmd.DimensionCommand
    # 平面度的类型编号可能需要通过 PutText 设置
    # DIMENSION_TYPE = 303
    # 平面度对应的枚举值通常为 5 或 6
    cmd.PutText("5", 303, 0)   # 平面度类型
    cmd.PutText(feat_name, 424, 0)  # Feat1
    cmd.PutText(str(tolerance), 436, 0)  # Plus tolerance

    # 设置输出模式为 BOTH
    cmd.PutText("2", 430, 0)   # DIM_OUTPUT_MODE

    cmd.ReDraw()
    return cmd


def add_position_tp(cmds, dim_id, feat_name, tol, datum_a, datum_b, datum_c):
    """添加位置度评价"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_DIMENSION, True)
    cmd.ID = dim_id

    # 位置度类型
    cmd.PutText("0", 303, 0)   # DIMENSION_TYPE = True Position

    dim_cmd = cmd.DimensionCommand
    dim_cmd.Feat1 = feat_name
    dim_cmd.Datum1 = datum_a
    dim_cmd.Datum2 = datum_b
    dim_cmd.Datum3 = datum_c
    dim_cmd.Plus = tol

    # 输出模式 BOTH
    cmd.PutText("2", 430, 0)

    cmd.ReDraw()
    return cmd


def add_location_dim(cmds, dim_id, feat1, feat2, axis, nom, tol_plus, tol_minus):
    """添加位置尺寸 (距离)"""
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(CMD_DIMENSION, True)
    cmd.ID = dim_id

    # 距离/位置尺寸类型
    cmd.PutText("1", 303, 0)   # DIMENSION_TYPE = Location

    dim_cmd = cmd.DimensionCommand
    dim_cmd.Feat1 = feat1
    if feat2:
        dim_cmd.Feat2 = feat2

    # 设置轴
    # AXIS: 0=X, 1=Y, 2=Z, 3=角度等
    axis_map = {"X": 0, "Y": 1, "Z": 2}
    cmd.PutText(str(axis_map.get(axis, 0)), 435, 0)  # DIM_AXIS

    cmd.PutText(str(nom), 437, 0)  # NOMINAL
    cmd.PutText(str(tol_plus), 436, 0)  # PLUS
    cmd.PutText(str(tol_minus), 438, 0)  # MINUS

    # 输出模式
    cmd.PutText("2", 430, 0)

    cmd.ReDraw()
    return cmd


# ============================================================
# 主流程
# ============================================================

try:
    print("=" * 60)
    print("  通用钣金件测量程序生成器")
    print("=" * 60)
    print()

    # ---- Step 1: 连接 PC-DMIS ----
    print("[1/8] 连接 PC-DMIS...")
    pcdmis = win32com.client.Dispatch("PCDLRN.Application")
    part = pcdmis.ActivePartProgram
    if not part:
        print("     创建新零件程序...")
        progs = pcdmis.PartPrograms
        part = progs.Add(PART_NAME, UNITS, MACHINE, PROBE_FILE)
    cmds = part.Commands
    print("     零件程序: %s" % part.Name)
    print("     原始命令数: %d" % cmds.Count)

    # ---- 清除默认命令（保留测头加载命令）----
    # 通常新程序有: START_ALIGN, MODE, DIM_FORMAT, LOAD_PROBE, SET_PROBE, END_ALIGN
    # 我们保留测头相关，移除对齐相关，重新构建
    print("\n[2/8] 准备重建程序...")

    # ---- 添加程序注释头 ----
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    add_comment(cmds, "================================================")
    add_comment(cmds, "  钣金件测量程序 (自动生成)")
    add_comment(cmds, "  基准: A-顶面, B-长边, C-短边")
    add_comment(cmds, "  生成时间: %s" % ts)
    add_comment(cmds, "================================================")
    print("     程序头注释已添加")

    # ---- 设置 DCC 模式 ----
    print("\n[3/8] 设置 DCC 模式...")
    cmds.InsertionPointAfter(cmds.LastCommand)
    mode_cmd = cmds.Add(CMD_MODE, True)
    MODE_TYPE = 58
    mode_cmd.PutText("DCC", MODE_TYPE, 0)
    mode_cmd.ReDraw()
    print("     DCC 模式已设置")

    # ---- 设置安全平面 ----
    cmds.InsertionPointAfter(cmds.LastCommand)
    clear_cmd = cmds.Add(CMD_MOVE_POINT, True)
    clear_cmd.PutText(str(ORIGIN_X), FIELD_THEO_X, 0)
    clear_cmd.PutText(str(ORIGIN_Y), FIELD_THEO_Y, 0)
    clear_cmd.PutText(str(CLEAR_PLANE_DIST), FIELD_THEO_Z, 0)
    clear_cmd.ReDraw()

    # ---- Step 4: 测量基准特征 ----
    print("\n[4/8] 创建基准特征...")

    # 4a. 测量顶面 (基准A)
    print("     - 测量顶面: %s" % PLANE_TOP["id"])
    plane_cmd = add_plane_auto(cmds, PLANE_TOP["id"])
    print("       已添加 (5点)")

    # 4b. 测量长边 (基准B)
    print("     - 测量长边: %s" % LINE_LONG["id"])
    line_long_cmd = add_line_auto(cmds, LINE_LONG["id"], LINE_LONG, is_long=True)
    print("       已添加 (4点)")

    # 4c. 测量短边 (基准C)
    print("     - 测量短边: %s" % LINE_SHORT["id"])
    line_short_cmd = add_line_auto(cmds, LINE_SHORT["id"], LINE_SHORT, is_long=False)
    print("       已添加 (4点)")

    # ---- Step 5: 建立坐标系 ----
    print("\n[5/8] 建立坐标系...")

    # LEVEL: 顶面找Z
    cmds.InsertionPointAfter(cmds.LastCommand)
    level_cmd = cmds.Add(CMD_LEVEL_ALIGN, True)
    level_cmd.ID = "ALG_LEVEL"
    level_cmd.AlignmentCommand.Workplane = 0  # Z+
    level_cmd.AlignmentCommand.FeatID = PLANE_TOP["id"]
    level_cmd.ReDraw()
    print("     LEVEL (Z+): 基准A")

    # ROTATE: 长边旋转XY
    cmds.InsertionPointAfter(cmds.LastCommand)
    rot_cmd = cmds.Add(CMD_ROTATE_ALIGN, True)
    rot_cmd.ID = "ALG_ROTATE"
    rot_cmd.AlignmentCommand.AXIS = 0  # Z+
    rot_cmd.AlignmentCommand.FeatID = LINE_LONG["id"]
    rot_cmd.AlignmentCommand.To = "X"  # 旋转到X轴
    rot_cmd.ReDraw()
    print("     ROTATE (Z+→X): 基准B")

    # TRANSLATE: 短边定X原点，长边定Y原点，顶面定Z原点
    cmds.InsertionPointAfter(cmds.LastCommand)
    trans_x = cmds.Add(CMD_TRANSLATE_ALIGN, True)
    trans_x.ID = "ALG_TRANS_X"
    trans_x.AlignmentCommand.AXIS = 0  # X
    trans_x.AlignmentCommand.FeatID = LINE_SHORT["id"]
    trans_x.ReDraw()
    print("     TRANSLATE (X): 基准C")

    cmds.InsertionPointAfter(cmds.LastCommand)
    trans_y = cmds.Add(CMD_TRANSLATE_ALIGN, True)
    trans_y.ID = "ALG_TRANS_Y"
    trans_y.AlignmentCommand.AXIS = 1  # Y
    trans_y.AlignmentCommand.FeatID = LINE_LONG["id"]
    trans_y.ReDraw()
    print("     TRANSLATE (Y): 基准B")

    cmds.InsertionPointAfter(cmds.LastCommand)
    trans_z = cmds.Add(CMD_TRANSLATE_ALIGN, True)
    trans_z.ID = "ALG_TRANS_Z"
    trans_z.AlignmentCommand.AXIS = 2  # Z
    trans_z.AlignmentCommand.FeatID = PLANE_TOP["id"]
    trans_z.ReDraw()
    print("     TRANSLATE (Z): 基准A")

    # END_ALIGN
    cmds.InsertionPointAfter(cmds.LastCommand)
    end_alg = cmds.Add(CMD_END_ALIGN, True)
    end_alg.ID = "ALG_DONE"
    end_alg.ReDraw()
    print("     坐标系建立完成")

    # ---- Step 6: 测量孔特征 ----
    print("\n[6/8] 测量孔特征...")

    all_holes = list(HOLES)
    for ch in CENTER_HOLES:
        all_holes.append(ch)

    for hole in all_holes:
        hid, hx, hy, hz, hdiam, h_hits, _, _ = hole
        print("     - 测量 %s (Φ%.1f, %d点)" % (hid, hdiam, h_hits))
        add_circle_auto(cmds, hid, hx, hy, hz, hdiam, h_hits)
        print("       已添加")

    # ---- Step 7: 尺寸评价 ----
    print("\n[7/8] 添加尺寸评价...")

    # 7a. 平面度
    print("     - 平面度 (基准A): 公差%.3f" % FLATNESS_TOLERANCE)
    add_flatness(cmds, "DIM_FLATNESS", PLANE_TOP["id"], FLATNESS_TOLERANCE)
    print("       已添加")

    # 7b. 孔位置度
    for hole in all_holes:
        hid, hx, hy, hz, hdiam, h_hits, _, _ = hole
        print("     - 位置度 (%s): MMC Φ%.3f |A|B|C" % (hid, POSITION_TOLERANCE))
        add_position_tp(cmds, "POS_" + hid, hid, POSITION_TOLERANCE,
                        PLANE_TOP["id"], LINE_LONG["id"], LINE_SHORT["id"])
        print("       已添加")

    # 7c. 孔直径评价
    for hole in all_holes:
        hid, hx, hy, hz, hdiam, h_hits, tol_plus, tol_minus = hole
        print("     - 直径 (%s): Φ%.3f %+.3f/%.3f" % (hid, hdiam, tol_plus, -tol_minus))

        cmds.InsertionPointAfter(cmds.LastCommand)
        dim_cmd = cmds.Add(CMD_DIMENSION, True)
        dim_cmd.ID = "DIM_DIA_%s" % hid
        # 直径类型尺寸
        dim_cmd.PutText("6", 303, 0)  # DIMENSION_TYPE = Diameter
        dim_cmd.PutText(hid, 424, 0)  # Feat1
        dim_cmd.PutText(str(hdiam), 437, 0)  # NOMINAL
        dim_cmd.PutText(str(tol_plus), 436, 0)  # PLUS
        dim_cmd.PutText(str(tol_minus), 438, 0)  # MINUS
        dim_cmd.PutText("2", 430, 0)  # Output = BOTH
        dim_cmd.ReDraw()
        print("       已添加")

    # ---- Step 8: 程序结束注释 ----
    print("\n[8/8] 添加结束注释...")
    add_comment(cmds, "================================================")
    add_comment(cmds, "  测量程序创建完成")
    add_comment(cmds, "  请检查所有理论值和公差后执行")
    add_comment(cmds, "================================================")

    # 刷新
    part.RefreshPart()

    # ---- 输出摘要 ----
    print()
    print("=" * 60)
    print("  ✅ 测量程序创建完成!")
    print("=" * 60)
    print()
    print("📋 程序摘要:")
    print("  命令总数: %d" % cmds.Count)
    print()
    print("📌 特征列表:")
    print("  ■ 基准A (顶面)     — 5点, Z轴找正+Z原点")
    print("  ■ 基准B (长边)     — 4点, XY旋转找正+Y原点")
    print("  ■ 基准C (短边)     — 4点, X原点")
    print("  ■ 孔 × %d 个" % len(all_holes))
    print()
    print("📐 尺寸评价:")
    print("  ■ 平面度: 基准A   - 公差 %.3f" % FLATNESS_TOLERANCE)
    for hole in all_holes:
        print("  ■ 位置度: %s - A|B|C - Φ%.3f" % (hole[0], POSITION_TOLERANCE))
    for hole in all_holes:
        print("  ■ 直径:   %s - Φ%.1f %+.3f/%.3f" % (hole[0], hole[4], hole[6], hole[7]))
    print()
    print("📝 操作步骤:")
    print("  1. 检查程序中的理论值是否与图纸一致")
    print("  2. 如有CAD模型，可转为自动特征")
    print("  3. 手动模式执行一次，观察测头路径")
    print("  4. 确认无误后切换到DCC模式自动运行")
    print()
    print("⚙️  当前配置的参数:")
    print("  探针趋近: %s mm" % str(APPROACH_DIST))
    print("  表面逼近: %s mm" % str(SURFACE_INDENT))
    print("  测量深度: %s mm" % str(DEPTH))
    print("  安全距离: %s mm" % str(CLEAR_PLANE_DIST))
    print()

except Exception as e:
    print()
    print("=" * 60)
    print("  ❌ 错误: %s" % str(e))
    print("=" * 60)
    import traceback
    traceback.print_exc()

pythoncom.CoUninitialize()
