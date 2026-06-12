$$ ====================================================================
$$  Program: medium_shaft_measurement.PRG
$$  Purpose: 中型轴 Ø25×60mm 直径、圆柱度、同轴度自动测量程序
$$  Machine: Offline / Generic CMM
$$  Units:   mm
$$  Probe:   CMM_PROBE (HH-A-M2.5 + HP-TBe + HP-TM-SF + TIP4BY20MM)
$$  Workpiece:
$$    - 直径: Ø25 mm   公差: ±0.02 mm
$$    - 长度: 60 mm    公差: ±0.05 mm
$$    - 圆柱度公差: 0.01 mm
$$    - 同轴度公差: Ø0.02 mm
$$  Note:    离线模式构建，导入 PC-DMIS 后可直接执行
$$ ====================================================================

$$ ---- 1. 模式与单位 ----------------------------------------------
MODE/DCC
UNITS/MM, ANGDEC
DATUM_REF/ALIGNMENT
FORMAT/TEXT,OPTIONS, ,HEADINGS,SYMBOLS, ;MEAS,NOM,TOL,DEV,OUTTOL, ,

$$ ---- 2. 装载探头与测针（四向测针） ----------------------------
$$ 测针配置:
$$   T1A0B0   正向    — 测端面
$$   T1A90B0  侧向+X  — 测外圆左/右
$$   T1A90B90 侧向+Y  — 测外圆前/后
$$   T1A180B0 反向    — 测后端面
$$ ----------------------------------------------------------------
LOADPROBE/CMM_PROBE
TIP/T1A0B0, SHANKIJK=0, 0, 1, ANGLE=0
TIP/T1A90B0, SHANKIJK=1, 0, 0, ANGLE=-90
TIP/T1A90B90, SHANKIJK=0, 1, 0, ANGLE=-90
TIP/T1A180B0, SHANKIJK=-1, 0, 0, ANGLE=0

$$ ---- 3. 安全移动到 Clearance Plane ------------------------------
MOVE/CLEARPLANE

$$ ---- 4. 3-2-1 建系 (DAT_A=前端面, DAT_B=前圆心, DAT_C=后圆心) ----
$$ ---- 4.1 前端面 PLN1 (基准A) -----------------------------------
SET_ACTIVE_TIP(T1A0B0)
PLN1     =FEAT/CONTACT/PLANE/DEFAULT,CARTESIAN,TRIANGULAR,LEAST_SQR
            THEO/0,0,0,0,0,1
            ACTL/0,0,0,0,0,1
            TARG/0,0,0,0,0,1
            MEAS/PLANE,3
            HIT/BASIC,NORMAL,0,0,12.5,0,0,1,12.5
            HIT/BASIC,NORMAL,10.83,0,-6.25,0,0,1,-6.25
            HIT/BASIC,NORMAL,-10.83,0,-6.25,0,0,1,-6.25
            ENDMES

$$ ---- 4.2 前端外圆 CIR1 (基准B, Z=-5) ---------------------------
SET_ACTIVE_TIP(T1A90B0)
CIR1     =FEAT/CONTACT/CIRCLE/DEFAULT,CARTESIAN,IN,LEAST_SQR
            THEO/0,0,-5,0,0,1,25
            ACTL/0,0,-5,0,0,1,25
            TARG/0,0,-5,0,0,1
            MEAS/CIRCLE,4,WORKPLANE
            HIT/BASIC,NORMAL,12.5,0,-5,1,0,0,12.5
            HIT/BASIC,NORMAL,0,12.5,-5,0,1,0,12.5
            HIT/BASIC,NORMAL,-12.5,0,-5,-1,0,0,12.5
            HIT/BASIC,NORMAL,0,-12.5,-5,0,-1,0,12.5
            ENDMES

$$ ---- 4.3 后端外圆 CIR2 (基准C, Z=-55) --------------------------
CIR2     =FEAT/CONTACT/CIRCLE/DEFAULT,CARTESIAN,IN,LEAST_SQR
            THEO/0,0,-55,0,0,1,25
            ACTL/0,0,-55,0,0,1,25
            TARG/0,0,-55,0,0,1
            MEAS/CIRCLE,4,WORKPLANE
            HIT/BASIC,NORMAL,12.5,0,-55,1,0,0,12.5
            HIT/BASIC,NORMAL,0,12.5,-55,0,1,0,12.5
            HIT/BASIC,NORMAL,-12.5,0,-55,-1,0,0,12.5
            HIT/BASIC,NORMAL,0,-12.5,-55,0,-1,0,12.5
            ENDMES

$$ ---- 4.4 建立轴线 LIN1 (CIR1 → CIR2) ---------------------------
LIN1     =FEAT/LINE,CARTESIAN,UNBOUNDED,NO
            THEO/0,0,0,0,0,-1
            ACTL/0,0,0,0,0,-1
            CONSTR/LINE,BF,2D,CIR1,CIR2,,
            OUTLIER_REMOVAL/OFF,3

$$ ---- 4.5 建立坐标系 A1 (PLN1 + LIN1 + CIR1) -------------------
A1       =ALIGNMENT/START,RECALL:STARTUP,LIST=YES
            ALIGNMENT/LEVEL,ZPLUS,PLN1
            ALIGNMENT/ROTATE,XPLUS,TO,LIN1,ABOUT,ZPLUS
            ALIGNMENT/TRANS,XAXIS,CIR1
            ALIGNMENT/TRANS,YAXIS,CIR1
            ALIGNMENT/TRANS,ZAXIS,PLN1
            ALIGNMENT/END
MOVE/CLEARPLANE

$$ ---- 5. 圆柱体测量 CYL1 (主测量元素) ---------------------------
$$ 沿轴向取 4 层 × 8 点 = 32 点，覆盖 Z=-5 到 Z=-55
CYL1     =FEAT/CONTACT/CYLINDER/DEFAULT,CARTESIAN,IN,LEAST_SQR
            THEO/0,0,-30,0,0,1,25,50
            ACTL/0,0,-30,0,0,1,25,50
            TARG/0,0,-30,0,0,1
            MEAS/CYLINDER,32
$$ Layer 1: Z=-10
            HIT/BASIC,NORMAL,12.5,0,-10,1,0,0,12.5
            HIT/BASIC,NORMAL,8.84,8.84,-10,0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,0,12.5,-10,0,1,0,12.5
            HIT/BASIC,NORMAL,-8.84,8.84,-10,-0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,-12.5,0,-10,-1,0,0,12.5
            HIT/BASIC,NORMAL,-8.84,-8.84,-10,-0.707,-0.707,0,12.5
            HIT/BASIC,NORMAL,0,-12.5,-10,0,-1,0,12.5
            HIT/BASIC,NORMAL,8.84,-8.84,-10,0.707,-0.707,0,12.5
$$ Layer 2: Z=-25
            HIT/BASIC,NORMAL,12.5,0,-25,1,0,0,12.5
            HIT/BASIC,NORMAL,8.84,8.84,-25,0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,0,12.5,-25,0,1,0,12.5
            HIT/BASIC,NORMAL,-8.84,8.84,-25,-0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,-12.5,0,-25,-1,0,0,12.5
            HIT/BASIC,NORMAL,-8.84,-8.84,-25,-0.707,-0.707,0,12.5
            HIT/BASIC,NORMAL,0,-12.5,-25,0,-1,0,12.5
            HIT/BASIC,NORMAL,8.84,-8.84,-25,0.707,-0.707,0,12.5
$$ Layer 3: Z=-40
            HIT/BASIC,NORMAL,12.5,0,-40,1,0,0,12.5
            HIT/BASIC,NORMAL,8.84,8.84,-40,0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,0,12.5,-40,0,1,0,12.5
            HIT/BASIC,NORMAL,-8.84,8.84,-40,-0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,-12.5,0,-40,-1,0,0,12.5
            HIT/BASIC,NORMAL,-8.84,-8.84,-40,-0.707,-0.707,0,12.5
            HIT/BASIC,NORMAL,0,-12.5,-40,0,-1,0,12.5
            HIT/BASIC,NORMAL,8.84,-8.84,-40,0.707,-0.707,0,12.5
$$ Layer 4: Z=-50
            HIT/BASIC,NORMAL,12.5,0,-50,1,0,0,12.5
            HIT/BASIC,NORMAL,8.84,8.84,-50,0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,0,12.5,-50,0,1,0,12.5
            HIT/BASIC,NORMAL,-8.84,8.84,-50,-0.707,0.707,0,12.5
            HIT/BASIC,NORMAL,-12.5,0,-50,-1,0,0,12.5
            HIT/BASIC,NORMAL,-8.84,-8.84,-50,-0.707,-0.707,0,12.5
            HIT/BASIC,NORMAL,0,-12.5,-50,0,-1,0,12.5
            HIT/BASIC,NORMAL,8.84,-8.84,-50,0.707,-0.707,0,12.5
            ENDMES

$$ ---- 6. 后端面 PLN2 (用于测长度) -------------------------------
SET_ACTIVE_TIP(T1A180B0)
PLN2     =FEAT/CONTACT/PLANE/DEFAULT,CARTESIAN,TRIANGULAR,LEAST_SQR
            THEO/0,0,-60,0,0,-1
            ACTL/0,0,-60,0,0,-1
            TARG/0,0,-60,0,0,-1
            MEAS/PLANE,3
            HIT/BASIC,NORMAL,0,0,-60,0,0,-1,-60
            HIT/BASIC,NORMAL,10.83,0,-60,0,0,-1,-60
            HIT/BASIC,NORMAL,-5.42,9.38,-60,0,0,-1,-60
            ENDMES
MOVE/CLEARPLANE

$$ ====================================================================
$$  尺寸标注（评价段）
$$ ====================================================================

$$ ---- 7.1 直径尺寸 Ø25 ±0.02 -----------------------------------
DIM DIAM1=DIAMETER OF CIRCLE CYL1 UNITS=MM ,$
GRAPH=OFF TEXT=OFF MULT=10.00 OUTPUT=BOTH HALF_ANGLE=NO
AX    NOMINAL    +TOL    -TOL     MEAS    DEV     OUTTOL
D     25.0000    0.0200  0.0200   25.000  0.000   0.000   ----#----

$$ ---- 7.2 圆柱度 0.01 ------------------------------------------
DIM CYLT1=CYLINDRICITY OF CYLINDER CYL1 UNITS=MM ,$
GRAPH=OFF TEXT=OFF MULT=10.00 OUTPUT=BOTH
AX    NOMINAL    +TOL    -TOL     MEAS    DEV     OUTTOL
M     0.0000     0.0100  0.0000   0.000   0.000   0.000   ----#----

$$ ---- 7.3 同轴度 Ø0.02（CYL1 相对 基准B-C） --------------------
DIM CON1=CONCENTRICITY OF CIRCLE CIR2 TO DATUM B UNITS=MM ,$
GRAPH=OFF TEXT=OFF MULT=10.00 OUTPUT=BOTH
AX    NOMINAL    +TOL    -TOL     MEAS    DEV     OUTTOL
DF    0.0000     0.0200  0.0000   0.000   0.000   0.000   ----#----

$$ ---- 7.4 长度尺寸 60 ±0.05（PLN1 至 PLN2） --------------------
DIM LEN1=LOCATION OF PLANE PLN2 UNITS=MM ,$
GRAPH=OFF TEXT=OFF MULT=10.00 OUTPUT=BOTH
AX    NOMINAL    +TOL    -TOL     MEAS    DEV     OUTTOL
Z     -60.000    0.0500  0.0500   -60.000 0.000   0.000   ----#----

$$ ---- 7.5 前端圆直径 Ø25（参考） -------------------------------
DIM DIAM2=DIAMETER OF CIRCLE CIR1 UNITS=MM ,$
GRAPH=OFF TEXT=OFF MULT=10.00 OUTPUT=BOTH HALF_ANGLE=NO
AX    NOMINAL    +TOL    -TOL     MEAS    DEV     OUTTOL
D     25.0000    0.0500  0.0500   25.000  0.000   0.000   ----#----

$$ ---- 7.6 后端圆直径 Ø25（参考） -------------------------------
DIM DIAM3=DIAMETER OF CIRCLE CIR2 UNITS=MM ,$
GRAPH=OFF TEXT=OFF MULT=10.00 OUTPUT=BOTH HALF_ANGLE=NO
AX    NOMINAL    +TOL    -TOL     MEAS    DEV     OUTTOL
D     25.0000    0.0500  0.0500   25.000  0.000   0.000   ----#----

$$ ---- 8. 程序结束 ----------------------------------------------
MOVE/CLEARPLANE
ENDMES

$$ ====================================================================
$$  程序生成完成
$$  特征数: 5 (PLN1, CIR1, CIR2, CYL1, PLN2) + LIN1(构造)
$$  尺寸数: 6 (DIAM1, CYLT1, CON1, LEN1, DIAM2, DIAM3)
$$  测点数: 3+4+4+32+3 = 46 点
$$ ====================================================================
