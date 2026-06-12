$/ PC-DMIS 测量程序
$/ 零件名称: 传动轴 (长轴)
$/ 测量项目: 直径、圆柱度、圆度、直线度、同轴度、跳动
$/ 直径范围: φ20~φ80mm
$/ 长度范围: 500~1000mm
$/ 精度等级: IT7 标准级
$/ 创建日期: 2026-06-05
$/ 单位: mm
$/
PART NAME   = "TRANSMISSION_SHAFT_LONG"
UNITS       = MM
ANGLE UNITS = DEG
MEASUREMENT OPTIONS / METRIC
$/
$/ ============================================================
$/ 坐标系建立 (Alignment)
$/ ============================================================
$/
$/ 第一步：测量基准平面（端面）
PLN_FACE    = FEAT/PLANE,CARTESIAN,IN
THEO        / 0,0,0,0,0,1
ACTL        / 0,0,0,0,0,1
TARG        / 0,0,0,0,0,1
MEAS/PLANE,4
HIT/BASIC,NORMAL,AUTO,  0, 0,0, 0,0,1, <,>,AUTO
HIT/BASIC,NORMAL,AUTO, 30, 0,0, 0,0,1, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,30,0, 0,0,1, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30, 0,0, 0,0,1, <,>,AUTO
ENDMEAS/
$/
$/ 第二步：测量基准轴线（前端圆）
CIR_FRONT   = FEAT/CIRCLE,CARTESIAN,IN
THEO        / 0,0,0, 0,0,1, 30
ACTL        / 0,0,0, 0,0,1, 30
TARG        / 0,0,0, 0,0,1, 30
MEAS/CIRCLE,4
HIT/BASIC,NORMAL,AUTO, 30,  0, 0, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 30, 0, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,  0, 0,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-30, 0, 0,-1,0, <,>,AUTO
ENDMEAS/
$/
$/ 第三步：测量后端圆（确定轴线方向）
CIR_REAR    = FEAT/CIRCLE,CARTESIAN,IN
THEO        / 0,0,700, 0,0,1, 30
ACTL        / 0,0,700, 0,0,1, 30
TARG        / 0,0,700, 0,0,1, 30
MEAS/CIRCLE,4
HIT/BASIC,NORMAL,AUTO, 30,  0,700, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 30,700, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,  0,700,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-30,700, 0,-1,0, <,>,AUTO
ENDMEAS/
$/
$/ 坐标系定义
DCC_ALIGN   = ALIGNMENT/START
             RECALL_LEVEL 3
             LEVEL PLN_FACE, ZAXIS
             ORIGIN PLN_FACE, ZAXIS
             TRANS CIR_FRONT, XAXIS, YAXIS
ALIGNMENT/END
$/
$/ ============================================================
$/ 测量段 1: 前端轴颈 (Z=50mm)
$/ 公称直径: φ50mm, 公差: ±0.025mm (IT7/φ50)
$/ ============================================================
$/
COMMENT/REPT, 前端轴颈 φ50mm 测量 (Z=50)
$/
CYL_J1      = FEAT/CYLINDER,CARTESIAN,IN
THEO        / 0,0,50, 0,0,1, 50, 80
ACTL        / 0,0,50, 0,0,1, 50, 80
TARG        / 0,0,50, 0,0,1, 50, 80
MEAS/CYLINDER,16
$/ 截面 1 (Z=30mm) - 4点
HIT/BASIC,NORMAL,AUTO, 25,  0,30, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,30, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,30,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,30, 0,-1,0, <,>,AUTO
$/ 截面 2 (Z=50mm) - 4点
HIT/BASIC,NORMAL,AUTO, 25,  0,50, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,50, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,50,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,50, 0,-1,0, <,>,AUTO
$/ 截面 3 (Z=70mm) - 4点
HIT/BASIC,NORMAL,AUTO, 25,  0,70, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,70, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,70,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,70, 0,-1,0, <,>,AUTO
$/ 截面 4 (Z=90mm) - 4点
HIT/BASIC,NORMAL,AUTO, 25,  0,90, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,90, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,90,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,90, 0,-1,0, <,>,AUTO
ENDMEAS/
$/
$/ 前端轴颈 - 直径尺寸
DIM DIA_J1  = SIZE OF CYL_J1
GRAPH   = OFF
TEXT    = ON
MULT    = 1.000000
OUTPUT  = BOTH
NOMINAL / 50
PLUS    / 0.025
MINUS   / -0.025
END_DIM/
$/
$/ 前端轴颈 - 圆柱度
DIM CYL_J1_FORM = CYLINDRICITY OF CYL_J1
GRAPH   = OFF
TEXT    = ON
MULT    = 1.000000
OUTPUT  = BOTH
NOMINAL / 0
PLUS    / 0.012
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 测量段 2: 中间轴颈 (Z=250mm)
$/ 公称直径: φ60mm, 公差: ±0.030mm (IT7/φ60)
$/ ============================================================
$/
COMMENT/REPT, 中间轴颈 φ60mm 测量 (Z=250)
$/
CYL_J2      = FEAT/CYLINDER,CARTESIAN,IN
THEO        / 0,0,250, 0,0,1, 60, 100
ACTL        / 0,0,250, 0,0,1, 60, 100
TARG        / 0,0,250, 0,0,1, 60, 100
MEAS/CYLINDER,16
$/ 截面 1 (Z=210mm)
HIT/BASIC,NORMAL,AUTO, 30,  0,210, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 30,210, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,  0,210,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-30,210, 0,-1,0, <,>,AUTO
$/ 截面 2 (Z=230mm)
HIT/BASIC,NORMAL,AUTO, 30,  0,230, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 30,230, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,  0,230,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-30,230, 0,-1,0, <,>,AUTO
$/ 截面 3 (Z=260mm)
HIT/BASIC,NORMAL,AUTO, 30,  0,260, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 30,260, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,  0,260,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-30,260, 0,-1,0, <,>,AUTO
$/ 截面 4 (Z=290mm)
HIT/BASIC,NORMAL,AUTO, 30,  0,290, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 30,290, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,  0,290,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-30,290, 0,-1,0, <,>,AUTO
ENDMEAS/
$/
DIM DIA_J2  = SIZE OF CYL_J2
NOMINAL / 60
PLUS    / 0.030
MINUS   / -0.030
END_DIM/
$/
DIM CYL_J2_FORM = CYLINDRICITY OF CYL_J2
NOMINAL / 0
PLUS    / 0.015
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 测量段 3: 后端轴颈 (Z=650mm)
$/ 公称直径: φ50mm, 公差: ±0.025mm (IT7/φ50)
$/ ============================================================
$/
COMMENT/REPT, 后端轴颈 φ50mm 测量 (Z=650)
$/
CYL_J3      = FEAT/CYLINDER,CARTESIAN,IN
THEO        / 0,0,650, 0,0,1, 50, 80
ACTL        / 0,0,650, 0,0,1, 50, 80
TARG        / 0,0,650, 0,0,1, 50, 80
MEAS/CYLINDER,16
$/ 截面 1 (Z=610mm)
HIT/BASIC,NORMAL,AUTO, 25,  0,610, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,610, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,610,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,610, 0,-1,0, <,>,AUTO
$/ 截面 2 (Z=635mm)
HIT/BASIC,NORMAL,AUTO, 25,  0,635, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,635, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,635,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,635, 0,-1,0, <,>,AUTO
$/ 截面 3 (Z=665mm)
HIT/BASIC,NORMAL,AUTO, 25,  0,665, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,665, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,665,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,665, 0,-1,0, <,>,AUTO
$/ 截面 4 (Z=690mm)
HIT/BASIC,NORMAL,AUTO, 25,  0,690, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, 25,690, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,  0,690,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,-25,690, 0,-1,0, <,>,AUTO
ENDMEAS/
$/
DIM DIA_J3  = SIZE OF CYL_J3
NOMINAL / 50
PLUS    / 0.025
MINUS   / -0.025
END_DIM/
$/
DIM CYL_J3_FORM = CYLINDRICITY OF CYL_J3
NOMINAL / 0
PLUS    / 0.012
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 圆度测量 (各截面)
$/ IT7: φ50→圆度≤0.012, φ60→圆度≤0.015
$/ ============================================================
$/
COMMENT/REPT, 各截面圆度测量
$/
$/ 前端轴颈中截面圆度 (Z=50mm)
CIR_J1_MID  = FEAT/CIRCLE,CARTESIAN,IN
THEO        / 0,0,50, 0,0,1, 50
ACTL        / 0,0,50, 0,0,1, 50
TARG        / 0,0,50, 0,0,1, 50
MEAS/CIRCLE,8
HIT/BASIC,NORMAL,AUTO, 25,   0,50, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO, 18,  18,50, .707,0.707,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,  25,50, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-18,  18,50,-.707,0.707,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-25,   0,50,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-18, -18,50,-.707,-.707,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, -25,50, 0,-1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO, 18, -18,50, .707,-.707,0, <,>,AUTO
ENDMEAS/
$/
DIM RND_J1  = ROUNDNESS OF CIR_J1_MID
NOMINAL / 0
PLUS    / 0.008
MINUS   / 0
END_DIM/
$/
$/ 中间轴颈中截面圆度 (Z=250mm)
CIR_J2_MID  = FEAT/CIRCLE,CARTESIAN,IN
THEO        / 0,0,250, 0,0,1, 60
ACTL        / 0,0,250, 0,0,1, 60
TARG        / 0,0,250, 0,0,1, 60
MEAS/CIRCLE,8
HIT/BASIC,NORMAL,AUTO, 30,   0,250, 1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO, 21,  21,250, .707,0.707,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0,  30,250, 0,1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-21,  21,250,-.707,0.707,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-30,   0,250,-1,0,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,-21, -21,250,-.707,-.707,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO,  0, -30,250, 0,-1,0, <,>,AUTO
HIT/BASIC,NORMAL,AUTO, 21, -21,250, .707,-.707,0, <,>,AUTO
ENDMEAS/
$/
DIM RND_J2  = ROUNDNESS OF CIR_J2_MID
NOMINAL / 0
PLUS    / 0.010
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 直线度测量 (轴线直线度)
$/ IT7/L=700: 直线度≤0.020mm
$/ ============================================================
$/
COMMENT/REPT, 轴线直线度测量
$/
$/ 构建轴线（从前端到后端圆心连线）
LINE_AXIS   = FEAT/LINE,CARTESIAN,IN
THEO        / 0,0,0, 0,0,1
ACTL        / 0,0,0, 0,0,1
TARG        / 0,0,0, 0,0,1
CONSTR/LINE,CIR_FRONT,CIR_J1_MID,CIR_J2_MID,CIR_REAR
$/
DIM STR_AXIS = STRAIGHTNESS OF LINE_AXIS
NOMINAL / 0
PLUS    / 0.020
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 同轴度测量
$/ 以前端轴颈(CYL_J1)为基准，检查中间和后端轴颈同轴度
$/ IT7: 同轴度φ0.025mm
$/ ============================================================
$/
COMMENT/REPT, 同轴度测量 (基准: 前端轴颈)
$/
$/ 构建基准轴线
DATUM_A     = FEAT/LINE,CARTESIAN,IN
THEO        / 0,0,0, 0,0,1
ACTL        / 0,0,0, 0,0,1
TARG        / 0,0,0, 0,0,1
CONSTR/LINE,CYL_J1
$/
$/ 中间轴颈相对前端的同轴度
DIM COAX_J2 = CONCENTRICITY OF CYL_J2, DAT_AXIS:DATUM_A
FCF         / CONCENTRICITY, 0.025,, A
NOMINAL / 0
PLUS    / 0.025
MINUS   / 0
END_DIM/
$/
$/ 后端轴颈相对前端的同轴度
DIM COAX_J3 = CONCENTRICITY OF CYL_J3, DAT_AXIS:DATUM_A
FCF         / CONCENTRICITY, 0.025,, A
NOMINAL / 0
PLUS    / 0.025
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 跳动测量 (圆跳动 & 全跳动)
$/ IT7: 圆跳动≤0.020mm, 全跳动≤0.030mm
$/ ============================================================
$/
COMMENT/REPT, 跳动测量 (基准: 前端+后端轴颈公共轴线)
$/
$/ 公共基准轴线
DATUM_AB    = FEAT/LINE,CARTESIAN,IN
THEO        / 0,0,350, 0,0,1
ACTL        / 0,0,350, 0,0,1
TARG        / 0,0,350, 0,0,1
CONSTR/LINE,CYL_J1,CYL_J3
$/
$/ 中间轴颈圆跳动
DIM RUN_J2  = CIRCULAR_RUN OF CIR_J2_MID, DAT_AXIS:DATUM_AB
FCF         / CIRCULAR_RUNOUT, 0.020,, A-B
NOMINAL / 0
PLUS    / 0.020
MINUS   / 0
END_DIM/
$/
$/ 中间轴段全跳动
DIM TRUN_J2 = TOTAL_RUN OF CYL_J2, DAT_AXIS:DATUM_AB
FCF         / TOTAL_RUNOUT, 0.030,, A-B
NOMINAL / 0
PLUS    / 0.030
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 端面跳动测量 (端面相对轴线垂直度)
$/ IT7: 端面跳动≤0.020mm
$/ ============================================================
$/
COMMENT/REPT, 端面跳动测量
$/
DIM FACE_RUN = CIRCULAR_RUN OF PLN_FACE, DAT_AXIS:DATUM_AB
FCF         / CIRCULAR_RUNOUT, 0.020,, A-B
NOMINAL / 0
PLUS    / 0.020
MINUS   / 0
END_DIM/
$/
$/ ============================================================
$/ 生成测量报告
$/ ============================================================
$/
COMMENT/REPT, ===== 生成测量报告 =====
$/
OUTPUT/REPORT, ON
PRINT/REPORT,
ENDROUTINE/
