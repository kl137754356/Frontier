' ============================================================
' 测量程序骨架: measurement_program.bas
' 适用:    PROBE-EXT-A100-M3R4 加长杆探针
' 入口:    MAIN_MEASUREMENT
' 包含子例程:
'   1) MEASURE_DEEP_BORE       深孔（多层圆）
'   2) MEASURE_INNER_PROFILE   内壁轮廓
'   3) MEASURE_PLANARITY       平面度（网格）
'   4) MEASURE_HOLE_POSITION   孔位度
'   5) GENERATE_REPORT         报告输出
' ============================================================

IMPORT/PROBE_SETUP.PRB         ' 探针文件
IMPORT/CALIBRATION.RESULTS     ' 上次标定结果（外部文件）

MODE/AUTO                       ' 自动测量模式
MODESET/MCS

' ============================================================
' 子例程 1: 深孔测量（Multi-Section Bore）
' 输入: BORE_DIA, BORE_DEPTH, NUM_LAYERS
' 输出: 每层圆心 + 直径；最终特征：圆柱度、孔径
' ============================================================
SUBROUTINE/MEASURE_DEEP_BORE

  INPUT/BORE_DIA, "请输入标称孔径 (mm)", 30.0
  INPUT/BORE_DEPTH, "请输入孔深 (mm)", 80.0
  INPUT/NUM_LAYERS, "请输入测量层数 (3~10)", 5
  INPUT/POINTS_PER_LAYER, "请输入每层点数 (8~24)", 12

  ' 装载加长杆探针
  CALL_MACRO/USE_PROBE_EXT_A100_M3R4

  ' 计算每层 Z 高度（沿孔深均匀分布）
  ASSIGN/Z_START = 0
  ASSIGN/Z_STEP  = BORE_DEPTH / (NUM_LAYERS - 1)

  ' 清空到安全平面
  CLEARP/ZPLUS, 100.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始深孔测量: D=" + BORE_DIA + " mm, H=" + BORE_DEPTH + " mm, " + NUM_LAYERS + " 层"

  ' --- 逐层测量 ---
  ASSIGN/LAYER_IDX = 0
  WHILE/LAYER_IDX < NUM_LAYERS
    ASSIGN/Z_CUR = Z_START + LAYER_IDX * Z_STEP

    ' 移动到当前层 Z
    CLEARP/ZPLUS, 100.0
    MOVE/POINT, 0, 0, Z_CUR + 20.0

    ' 圆周测量（POINTS_PER_LAYER 个点）
    ASSIGN/PT_IDX = 0
    WHILE/PT_IDX < POINTS_PER_LAYER
      ASSIGN/ANGLE = 360.0 * PT_IDX / POINTS_PER_LAYER
      ASSIGN/X_TGT = (BORE_DIA / 2 - 2.0) * COS(ANGLE * 3.14159 / 180)  ' 预触发 2mm
      ASSIGN/Y_TGT = (BORE_DIA / 2 - 2.0) * SIN(ANGLE * 3.14159 / 180)

      ' 自动触发测量
      ASSIGN/PT_NAME = "BORE_PT_L" + (LAYER_IDX + 1) + "_P" + (PT_IDX + 1)
      FEAT/POINT, CART, X_TGT, Y_TGT, Z_CUR
      MEAS/POINT, F(name) = PT_NAME, \
                PROBE = PROBE_EXT_A100_M3R4, \
                TRIGFORCE = LOW, \
                NUM_TRIGGERS = 1

      ASSIGN/PT_IDX = PT_IDX + 1
    ENDWHILE

    ' 创建当前层圆特征
    ASSIGN/CIRC_NAME = "BORE_CIRC_L" + (LAYER_IDX + 1)
    FEAT/CIRCLE, CART, INNER, BORE_DIA, \
         CIRC_NAME, \
         NUM_PTS = POINTS_PER_LAYER

    ' 输出层圆心与直径
    DIM/LOC1 = LOCATION OF CIRCLE CIRC_NAME
    ASSIGN/LAYER_CX[LAYER_IDX] = LOC1.X
    ASSIGN/LAYER_CY[LAYER_IDX] = LOC1.Y
    ASSIGN/LAYER_CZ[LAYER_IDX] = LOC1.Z
    ASSIGN/LAYER_DIA[LAYER_IDX] = LOC1.DIAM

    ASSIGN/LAYER_IDX = LAYER_IDX + 1
  ENDWHILE

  ' --- 创建拟合圆柱 ---
  FEAT/CYLINDER, CART, INNER, BORE_DIA, "BORE_CYL"
  DIM/CYL1 = CYLINDER BORE_CYL
  ASSIGN/BORE_DIAM_MEAS = CYL1.DIAM
  ASSIGN/BORE_CYL_TRUE  = CYL1.TRU                    ' 圆柱度
  ASSIGN/BORE_CX        = CYL1.LOC.X
  ASSIGN/BORE_CY        = CYL1.LOC.Y

  ' --- GD&T 评定 ---
  DIM/DIAM_OUT = LOCATION OF CYLINDER BORE_CYL
  DIM/CYL_FORM = FORM/CYLINDER BORE_CYL

  COMMENT/REPT, "  深孔测量结果"
  COMMENT/REPT, "  标称直径:  " + BORE_DIA + " mm"
  COMMENT/REPT, "  测量直径:  " + BORE_DIAM_MEAS + " mm"
  COMMENT/REPT, "  圆柱度:    " + BORE_CYL_TRUE + " mm"
  COMMENT/REPT, "  圆心 X:    " + BORE_CX + " mm"
  COMMENT/REPT, "  圆心 Y:    " + BORE_CY + " mm"

ENDSUB

' ============================================================
' 子例程 2: 内壁轮廓（沿轴向）
' 输入: INNER_DIA, AXIAL_START, AXIAL_END, NUM_LAYERS, POINTS_PER_LAYER
' 输出: 拟合圆柱 + 每层圆
' ============================================================
SUBROUTINE/MEASURE_INNER_PROFILE

  INPUT/INNER_DIA, "标称内径 (mm)", 50.0
  INPUT/AXIAL_START, "起始 Z (mm)", 0.0
  INPUT/AXIAL_END, "终止 Z (mm)", 60.0
  INPUT/NUM_LAYERS, "测量层数 (5~30)", 10
  INPUT/POINTS_PER_LAYER, "每层点数 (4~8)", 6

  CALL_MACRO/USE_PROBE_EXT_A100_M3R4

  ASSIGN/Z_STEP = (AXIAL_END - AXIAL_START) / (NUM_LAYERS - 1)

  CLEARP/ZPLUS, 100.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始内壁轮廓测量: D=" + INNER_DIA + " mm, Z: " + AXIAL_START + " → " + AXIAL_END

  ASSIGN/LAYER_IDX = 0
  WHILE/LAYER_IDX < NUM_LAYERS
    ASSIGN/Z_CUR = AXIAL_START + LAYER_IDX * Z_STEP

    CLEARP/ZPLUS, 50.0
    MOVE/POINT, 0, 0, Z_CUR + 5.0

    ASSIGN/PT_IDX = 0
    WHILE/PT_IDX < POINTS_PER_LAYER
      ASSIGN/ANGLE = 360.0 * PT_IDX / POINTS_PER_LAYER
      ASSIGN/X_TGT = (INNER_DIA / 2 - 2.0) * COS(ANGLE * 3.14159 / 180)
      ASSIGN/Y_TGT = (INNER_DIA / 2 - 2.0) * SIN(ANGLE * 3.14159 / 180)

      ASSIGN/PT_NAME = "PROF_PT_L" + (LAYER_IDX + 1) + "_P" + (PT_IDX + 1)
      FEAT/POINT, CART, X_TGT, Y_TGT, Z_CUR
      MEAS/POINT, F(name) = PT_NAME, \
                PROBE = PROBE_EXT_A100_M3R4, \
                TRIGFORCE = LOW

      ASSIGN/PT_IDX = PT_IDX + 1
    ENDWHILE

    ' 创建当前层圆
    ASSIGN/CIRC_NAME = "PROF_CIRC_L" + (LAYER_IDX + 1)
    FEAT/CIRCLE, CART, INNER, INNER_DIA, CIRC_NAME

    ASSIGN/LAYER_IDX = LAYER_IDX + 1
  ENDWHILE

  ' 创建拟合圆柱
  FEAT/CYLINDER, CART, INNER, INNER_DIA, "PROFILE_CYL"
  DIM/CYL2 = CYLINDER PROFILE_CYL
  ASSIGN/PROFILE_CYL_TRUE = CYL2.TRU
  ASSIGN/PROFILE_DIA_MEAS = CYL2.DIAM

  COMMENT/REPT, "  内壁轮廓测量结果"
  COMMENT/REPT, "  测量直径:  " + PROFILE_DIA_MEAS + " mm"
  COMMENT/REPT, "  圆柱度:    " + PROFILE_CYL_TRUE + " mm"

ENDSUB

' ============================================================
' 子例程 3: 平面度（Planarity Grid）
' 输入: GRID_ROWS, GRID_COLS, X_RANGE, Y_RANGE
' 输出: 拟合平面 + 平面度
' ============================================================
SUBROUTINE/MEASURE_PLANARITY

  INPUT/GRID_ROWS, "行数 (5~10)", 7
  INPUT/GRID_COLS, "列数 (5~10)", 7
  INPUT/X_MIN, "X 起始 (mm)", -25.0
  INPUT/X_MAX, "X 终止 (mm)",  25.0
  INPUT/Y_MIN, "Y 起始 (mm)", -25.0
  INPUT/Y_MAX, "Y 终止 (mm)",  25.0

  CALL_MACRO/USE_PROBE_EXT_A100_M3R4

  ASSIGN/X_STEP = (X_MAX - X_MIN) / (GRID_COLS - 1)
  ASSIGN/Y_STEP = (Y_MAX - Y_MIN) / (GRID_ROWS - 1)

  CLEARP/ZPLUS, 100.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始平面度测量: " + GRID_ROWS + "x" + GRID_COLS + " 网格"

  ASSIGN/I = 0
  WHILE/I < GRID_ROWS
    ASSIGN/Y_CUR = Y_MIN + I * Y_STEP
    ASSIGN/J = 0
    WHILE/J < GRID_COLS
      ASSIGN/X_CUR = X_MIN + J * X_STEP

      CLEARP/ZPLUS, 50.0
      MOVE/POINT, X_CUR, Y_CUR, 50.0

      ASSIGN/PT_NAME = "PLN_PT_R" + (I + 1) + "_C" + (J + 1)
      FEAT/POINT, CART, X_CUR, Y_CUR, 0
      MEAS/POINT, F(name) = PT_NAME, \
                PROBE = PROBE_EXT_A100_M3R4, \
                TRIGFORCE = LOW

      ASSIGN/J = J + 1
    ENDWHILE
    ASSIGN/I = I + 1
  ENDWHILE

  ' 拟合平面
  FEAT/PLANE, CART, "PLN_FIT"
  DIM/PLN1 = PLANE PLN_FIT
  ASSIGN/PLN_TRUE = PLN1.TRU

  COMMENT/REPT, "  平面度测量结果"
  COMMENT/REPT, "  平面度:    " + PLN_TRUE + " mm"

ENDSUB

' ============================================================
' 子例程 4: 孔位度（Hole Position with TP200 加长杆）
' ============================================================
SUBROUTINE/MEASURE_HOLE_POSITION

  INPUT/NOMINAL_DIA, "标称直径 (mm)", 20.0
  INPUT/NUM_PTS, "测量点数 (8~24)", 12

  CALL_MACRO/USE_PROBE_EXT_A100_M3R4

  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始孔位度测量: D=" + NOMINAL_DIA + " mm"

  ASSIGN/PT_IDX = 0
  WHILE/PT_IDX < NUM_PTS
    ASSIGN/ANGLE = 360.0 * PT_IDX / NUM_PTS
    ASSIGN/X_TGT = (NOMINAL_DIA / 2 - 2.0) * COS(ANGLE * 3.14159 / 180)
    ASSIGN/Y_TGT = (NOMINAL_DIA / 2 - 2.0) * SIN(ANGLE * 3.14159 / 180)

    ASSIGN/PT_NAME = "HOLE_PT_P" + (PT_IDX + 1)
    FEAT/POINT, CART, X_TGT, Y_TGT, 0
    MEAS/POINT, F(name) = PT_NAME, \
              PROBE = PROBE_EXT_A100_M3R4, \
              TRIGFORCE = LOW

    ASSIGN/PT_IDX = PT_IDX + 1
  ENDWHILE

  FEAT/CIRCLE, CART, INNER, NOMINAL_DIA, "HOLE_CIRC"
  DIM/CIR1 = CIRCLE HOLE_CIRC
  DIM/POS1 = POSITION OF CIRCLE HOLE_CIRC

  COMMENT/REPT, "  孔位度:    " + POS1.MAG + " mm"

ENDSUB

' ============================================================
' 子例程 5: 报告生成
' ============================================================
SUBROUTINE/GENERATE_REPORT

  COMMENT/REPT, "==========================================="
  COMMENT/REPT, "  测量报告 — PROBE-EXT-A100-M3R4"
  COMMENT/REPT, "  日期:    " + SYSTEM_DATE()
  COMMENT/REPT, "  时间:    " + SYSTEM_TIME()
  COMMENT/REPT, "  操作员:  " + OPERATOR_ID()
  COMMENT/REPT, "  工件号:  " + PART_NUMBER()
  COMMENT/REPT, "  序列号:  " + SERIAL_NUMBER()
  COMMENT/REPT, "==========================================="

  ' 汇总：各子例程写入的 COMMENT/REPT 已自动汇总

  ' 探针状态
  COMMENT/REPT, "  --- 探针状态 ---"
  COMMENT/REPT, "  探针:    " + CURRENT_PROBE()
  COMMENT/REPT, "  测针:    " + CURRENT_TIP()
  COMMENT/REPT, "  触发力:  " + CURRENT_TRIGFORCE()
  COMMENT/REPT, "  标定 K:  " + DEFLECTION_K_AVG + " µm/N"

  ' 环境
  COMMENT/REPT, "  --- 环境 ---"
  COMMENT/REPT, "  温度:    " + ENVIRONMENT_TEMP() + " °C"
  COMMENT/REPT, "  湿度:    " + ENVIRONMENT_HUMIDITY() + " %"

  ' 导出
  EXPORT_REPORT/CSV, FILENAME = "ext_probe_meas_" + SYSTEM_DATE() + ".csv"
  EXPORT_REPORT/HTML, FILENAME = "ext_probe_meas_" + SYSTEM_DATE() + ".html"

  COMMENT/OPER, "报告已生成: ext_probe_meas_" + SYSTEM_DATE()

ENDSUB

' ============================================================
' 主入口
' ============================================================
SUBROUTINE/MAIN_MEASUREMENT

  COMMENT/OPER, "=== 测量程序 — PROBE-EXT-A100-M3R4 ==="

  ' 检查上次标定时效性
  IF/CALIBRATION_AGE_HOURS() > 4
    COMMENT/OPER, "WARNING: 上次标定已超过 4 小时，建议重标"
  ENDIF

  ' 默认全流程
  CALL_SUB/MEASURE_DEEP_BORE
  CALL_SUB/MEASURE_INNER_PROFILE
  CALL_SUB/MEASURE_PLANARITY
  CALL_SUB/MEASURE_HOLE_POSITION
  CALL_SUB/GENERATE_REPORT

  COMMENT/OPER, "=== 测量完成 ==="

ENDSUB

' --- 立即执行 ---
CALL_SUB/MAIN_MEASUREMENT
