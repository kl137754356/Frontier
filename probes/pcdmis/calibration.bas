' ============================================================
' 标定程序: calibration.bas
' 适用:    PROBE-EXT-A100-M3R4 加长杆探针
' 流程:    1) 装载探针  2) 测头原位标定  3) 测针直径标定  4) 测针位置标定
'          5) 长杆挠度标定  6) 探针验证  7) 报告
' 入口:    CALIBRATE_EXT_PROBE
' ============================================================

' --- 加载通用与探针文件 ---
IMPORT/PROBE_SETUP.PRB         ' probe_setup.prb

' --- 模式设置 ---
MODE/MANUAL                   ' 标定需人工介入
MODESET/MCS                   ' 机器坐标系

' ============================================================
' 步骤 0: 装载加长杆探针
' ============================================================
SUBROUTINE/USE_PROBE_EXT_A100_M3R4

  CALL_MACRO/USE_PROBE_EXT_A100_M3R4
  COMMENT/OPER, "加长杆探针已装载: TP200 + 100mm Ceramic + M3-Ruby Ø4"

ENDSUB

' ============================================================
' 步骤 1: 测头原位标定（Head Calibration）
' 工具: 标准标定球 Ø25 mm（KEYID=10）
' 输出: TP200 位置、直径、I/J/K
' ============================================================
SUBROUTINE/CALIBRATE_TP200_HEAD

  LOADPROBE/PROBE_EXT_A100_M3R4

  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始测头原位标定，使用标准球 Ø25 mm"
  COMMENT/OPER, "请确认标准球已清洁并固定在表面对应位置"

  ' 自动标定（10 次触发）
  AUTOCALIBRATE/HEAD, 10, \
                 TARGET = SPHERE_25, \
                 PROBE  = PROBE_EXT_A100_M3R4, \
                 TRIGFORCE = LOW

  IF/GET_PROBE_CALIBRATION_STATUS() != 0
    COMMENT/OPER, "ERROR: 测头原位标定失败，请检查标准球位置或探针"
    GOTO/CALIBRATION_FAILED
  ENDIF

  ' 记录标定结果
  ASSIGN/CALIB_HEAD_DIAM = GET_PROBE_DIAM()
  ASSIGN/CALIB_HEAD_I     = GET_PROBE_I()
  ASSIGN/CALIB_HEAD_J     = GET_PROBE_J()
  ASSIGN/CALIB_HEAD_K     = GET_PROBE_K()

  COMMENT/OPER, "测头原位标定完成"
  COMMENT/OPER, "标定直径 = " + CALIB_HEAD_DIAM + " mm"
  COMMENT/OPER, "I/J/K = " + CALIB_HEAD_I + ", " + CALIB_HEAD_J + ", " + CALIB_HEAD_K

ENDSUB

' ============================================================
' 步骤 2: 测针直径标定（Tip Diameter Calibration）
' ============================================================
SUBROUTINE/CALIBRATE_TIP_DIAM

  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始测针直径标定"

  AUTOCALIBRATE/TIP_DIAM, 10, \
                 PROBE  = PROBE_EXT_A100_M3R4, \
                 TIP    = TIP_M3R4_L30, \
                 TARGET = SPHERE_25

  IF/GET_TIP_CALIBRATION_STATUS() != 0
    COMMENT/OPER, "ERROR: 测针直径标定失败"
    GOTO/CALIBRATION_FAILED
  ENDIF

  ASSIGN/CALIB_TIP_DIAM = GET_TIP_DIAM()

  ' 预期球径 4.000 ± 0.001 mm，超出需重标
  IF/ABS(CALIB_TIP_DIAM - 4.000) > 0.001
    COMMENT/OPER, "WARNING: 标定球径偏差超限: " + CALIB_TIP_DIAM
  ENDIF

  COMMENT/OPER, "测针直径标定完成 = " + CALIB_TIP_DIAM + " mm"

ENDSUB

' ============================================================
' 步骤 3: 测针位置标定（Tip Position / IJK Calibration）
' ============================================================
SUBROUTINE/CALIBRATE_TIP_IJK

  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始测针位置标定"

  AUTOCALIBRATE/TIP_IJK, 10, \
                 PROBE  = PROBE_EXT_A100_M3R4, \
                 TIP    = TIP_M3R4_L30, \
                 TARGET = SPHERE_25, \
                 MODE   = FULL

  IF/GET_TIP_CALIBRATION_STATUS() != 0
    COMMENT/OPER, "ERROR: 测针位置标定失败"
    GOTO/CALIBRATION_FAILED
  ENDIF

  ASSIGN/CALIB_TIP_I = GET_TIP_I()
  ASSIGN/CALIB_TIP_J = GET_TIP_J()
  ASSIGN/CALIB_TIP_K = GET_TIP_K()

  COMMENT/OPER, "测针 I/J/K = " + CALIB_TIP_I + ", " + CALIB_TIP_J + ", " + CALIB_TIP_K

ENDSUB

' ============================================================
' 步骤 4: 长杆挠度标定（Extension Deflection Calibration）★必做★
' 工具: 标定环规 Ø30 mm（KEYID=11）
' 方法: 在 3 个角度（A=0°/90°/180°）测量环规，记录 K-factor
' ============================================================
SUBROUTINE/CALIBRATE_EXTENSION_DEFLECTION

  ASSIGN/DEFLECTION_K_TOTAL = 0
  ASSIGN/DEFLECTION_SAMPLES = 0

  ' --- 角度 0° ---
  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE
  ROTATE_A/0
  COMMENT/OPER, "挠度标定 - 角度 A=0°"
  CALIBRATE_DEFLECTION/PROBE_EXT_A100_M3R4, \
                       RING_30, \
                       NUM_TRIGGERS = 5, \
                       OUTPUT = K_FACTOR_0
  ASSIGN/DEFLECTION_K_TOTAL = DEFLECTION_K_TOTAL + K_FACTOR_0
  ASSIGN/DEFLECTION_SAMPLES = DEFLECTION_SAMPLES + 1

  ' --- 角度 90° ---
  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE
  ROTATE_A/90
  COMMENT/OPER, "挠度标定 - 角度 A=90°"
  CALIBRATE_DEFLECTION/PROBE_EXT_A100_M3R4, \
                       RING_30, \
                       NUM_TRIGGERS = 5, \
                       OUTPUT = K_FACTOR_90
  ASSIGN/DEFLECTION_K_TOTAL = DEFLECTION_K_TOTAL + K_FACTOR_90
  ASSIGN/DEFLECTION_SAMPLES = DEFLECTION_SAMPLES + 1

  ' --- 角度 180° ---
  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE
  ROTATE_A/180
  COMMENT/OPER, "挠度标定 - 角度 A=180°"
  CALIBRATE_DEFLECTION/PROBE_EXT_A100_M3R4, \
                       RING_30, \
                       NUM_TRIGGERS = 5, \
                       OUTPUT = K_FACTOR_180
  ASSIGN/DEFLECTION_K_TOTAL = DEFLECTION_K_TOTAL + K_FACTOR_180
  ASSIGN/DEFLECTION_SAMPLES = DEFLECTION_SAMPLES + 1

  ' 计算平均 K
  ASSIGN/DEFLECTION_K_AVG = DEFLECTION_K_TOTAL / DEFLECTION_SAMPLES

  ' 应用 K 到当前探针
  PROBE_FLEX_K/PROBE_EXT_A100_M3R4 = DEFLECTION_K_AVG

  ' 阈值检查：K_avg 应在 0.1~1.0 µm/N 之间
  IF/DEFLECTION_K_AVG < 0.1 OR DEFLECTION_K_AVG > 1.0
    COMMENT/OPER, "WARNING: 挠度系数异常 (" + DEFLECTION_K_AVG + " µm/N)，建议检查装配"
  ENDIF

  COMMENT/OPER, "挠度标定完成，平均 K = " + DEFLECTION_K_AVG + " µm/N"

  ' 恢复 A=0
  ROTATE_A/0

ENDSUB

' ============================================================
' 步骤 5: 探针验证（Probe Verification）
' 在标准球上打 25 个点，检查 1σ 重复性
' ============================================================
SUBROUTINE/VERIFY_PROBE

  CLEARP/ZPLUS, 50.0
  MOVE/CLEARPLANE

  COMMENT/OPER, "开始探针验证，采集 25 个触发点..."

  ASSIGN/VERIFICATION_PASS = 0
  ASSIGN/VERIFICATION_1SIG = 0

  ' 采集 25 个点
  PT_01 = FEAT/POINT, CART, -25, 0, 0
  PT_02 = FEAT/POINT, CART, -20, 0, 0
  PT_03 = FEAT/POINT, CART, -15, 0, 0
  PT_04 = FEAT/POINT, CART, -10, 0, 0
  PT_05 = FEAT/POINT, CART,  -5, 0, 0
  PT_06 = FEAT/POINT, CART,   0, 0, 0
  PT_07 = FEAT/POINT, CART,   5, 0, 0
  PT_08 = FEAT/POINT, CART,  10, 0, 0
  PT_09 = FEAT/POINT, CART,  15, 0, 0
  PT_10 = FEAT/POINT, CART,  20, 0, 0
  PT_11 = FEAT/POINT, CART,  25, 0, 0
  PT_12 = FEAT/POINT, CART,  25, 5, 0
  PT_13 = FEAT/POINT, CART,  20, 5, 0
  PT_14 = FEAT/POINT, CART,  15, 5, 0
  PT_15 = FEAT/POINT, CART,  10, 5, 0
  PT_16 = FEAT/POINT, CART,   5, 5, 0
  PT_17 = FEAT/POINT, CART,   0, 5, 0
  PT_18 = FEAT/POINT, CART,  -5, 5, 0
  PT_19 = FEAT/POINT, CART, -10, 5, 0
  PT_20 = FEAT/POINT, CART, -15, 5, 0
  PT_21 = FEAT/POINT, CART, -20, 5, 0
  PT_22 = FEAT/POINT, CART, -25, 5, 0
  PT_23 = FEAT/POINT, CART, -25,10, 0
  PT_24 = FEAT/POINT, CART,   0,10, 0
  PT_25 = FEAT/POINT, CART,  25,10, 0

  ' ... 实际生产中此处接 MEAS/POINT 指令 ...

  ' 阈值：1σ ≤ 0.5 µm 通过
  ASSIGN/VERIFICATION_1SIG = COMPUTE_STD_DEV(VERIFICATION_POINTS)
  IF/VERIFICATION_1SIG <= 0.5
    ASSIGN/VERIFICATION_PASS = 1
    COMMENT/OPER, "探针验证通过: 1σ = " + VERIFICATION_1SIG + " µm"
  ELSE
    COMMENT/OPER, "ERROR: 探针验证失败: 1σ = " + VERIFICATION_1SIG + " µm (>0.5)"
    GOTO/CALIBRATION_FAILED
  ENDIF

ENDSUB

' ============================================================
' 步骤 6: 输出标定报告
' ============================================================
SUBROUTINE/REPORT_CALIBRATION

  COMMENT/REPT, "==========================================="
  COMMENT/REPT, "  标定报告 — PROBE-EXT-A100-M3R4"
  COMMENT/REPT, "  日期: " + SYSTEM_DATE()
  COMMENT/REPT, "  时间: " + SYSTEM_TIME()
  COMMENT/REPT, "==========================================="
  COMMENT/REPT, "测头直径:    " + CALIB_HEAD_DIAM + " mm"
  COMMENT/REPT, "测头 I/J/K:  " + CALIB_HEAD_I + ", " + CALIB_HEAD_J + ", " + CALIB_HEAD_K
  COMMENT/REPT, "测针直径:    " + CALIB_TIP_DIAM + " mm"
  COMMENT/REPT, "测针 I/J/K:  " + CALIB_TIP_I + ", " + CALIB_TIP_J + ", " + CALIB_TIP_K
  COMMENT/REPT, "挠度 K:      " + DEFLECTION_K_AVG + " µm/N"
  COMMENT/REPT, "验证 1σ:     " + VERIFICATION_1SIG + " µm"
  COMMENT/REPT, "==========================================="
  COMMENT/REPT, "结论: " + IIF(VERIFICATION_PASS == 1, "PASS", "FAIL")
  COMMENT/REPT, "==========================================="

ENDSUB

' ============================================================
' 失败处理
' ============================================================
SUBROUTINE/CALIBRATION_FAILED

  COMMENT/OPER, "==========================================="
  COMMENT/OPER, "  标定失败 — 请检查以下项目："
  COMMENT/OPER, "  1. 探针装配是否正确（扭矩、对齐）"
  COMMENT/OPER, "  2. 标定球/环规是否清洁、固定"
  COMMENT/OPER, "  3. 机器是否预热（建议 ≥4h）"
  COMMENT/OPER, "  4. 测针球面是否有损伤/污染"
  COMMENT/OPER, "  5. 加长杆连接是否牢固"
  COMMENT/OPER, "==========================================="
  PROGRAM/END

ENDSUB

' ============================================================
' 主入口
' ============================================================
SUBROUTINE/CALIBRATE_EXT_PROBE

  COMMENT/OPER, "=== 开始标定: PROBE-EXT-A100-M3R4 ==="

  CALL_MACRO/USE_PROBE_EXT_A100_M3R4
  CALL_SUB/CALIBRATE_TP200_HEAD
  CALL_SUB/CALIBRATE_TIP_DIAM
  CALL_SUB/CALIBRATE_TIP_IJK
  CALL_SUB/CALIBRATE_EXTENSION_DEFLECTION
  CALL_SUB/VERIFY_PROBE
  CALL_SUB/REPORT_CALIBRATION

  COMMENT/OPER, "=== 标定完成 ==="

ENDSUB

' --- 立即执行 ---
CALL_SUB/CALIBRATE_EXT_PROBE
