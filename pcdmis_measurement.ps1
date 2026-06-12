# PC-DMIS 测量程序 - PowerShell 安装 pywin32 并运行 Python 脚本

Write-Host "===== 步骤 1: 安装 pywin32 =====" -ForegroundColor Cyan

$env:PATH = "D:\ProgramData\miniforge3\envs\py311;D:\ProgramData\miniforge3\envs\py311\Scripts;$env:PATH"
$pythonExe = "D:\ProgramData\miniforge3\envs\py311\python.exe"

& $pythonExe -m pip install pywin32 --quiet 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "pip install failed, trying upgrade..." -ForegroundColor Yellow
    & $pythonExe -m pip install --upgrade pywin32 2>&1
}

Write-Host "===== 步骤 2: 注册 pywin32 COM 服务器 =====" -ForegroundColor Cyan
& $pythonExe "D:\ProgramData\miniforge3\envs\py311\Scripts\pywin32_postinstall.py" -install 2>&1

Write-Host "===== 步骤 3: 检查 PC-DMIS 是否在运行 =====" -ForegroundColor Cyan

$pythonScript = @"
import sys
import win32com.client
import pythoncom

print("Python version:", sys.version)
print("Python executable:", sys.executable)

# 尝试连接 PCDLRN
try:
    pcdmis = win32com.client.Dispatch('PCDLRN.Application')
    print('[OK] PC-DMIS COM 连接成功!')
    print('PC-DMIS 版本:', pcdmis.Version)
    print('PC-DMIS 路径:', pcdmis.GetRegistryValue('ProgramPath', ''))
    
    # 获取活动程序
    part = pcdmis.ActivePartProgram
    if part is not None:
        print('[OK] 有活动测量程序:', part.Name)
    else:
        print('[INFO] 当前没有打开的测量程序')
    
    # 创建一个新程序
    print('')
    print('===== 创建新测量程序 =====')
    
    # 新建程序
    newProg = pcdmis.PartPrograms.Add()
    print('[OK] 新建测量程序成功')
    
    # 设置程序名称
    newProg.Name = 'SquarePlateWithHoles'
    print('[OK] 程序名称设置为:', newProg.Name)
    
    # 获取命令集合
    cmds = newProg.Commands
    
    # ===== 1. 添加对齐命令 =====
    print('')
    print('===== 添加坐标系对齐 =====')
    
    # 添加平面找正 (Level Z)
    alignLevelZ = cmds.Add('ALIGN LEVEL Z')
    print('[OK] 添加 LEVEL Z 对齐')
    
    # 添加 X 轴旋转 (Rotate X)
    alignRotateX = cmds.Add('ALIGN ROTATE X')
    print('[OK] 添加 ROTATE X 对齐')
    
    # 添加原点设置 (Origin Z)
    alignOriginZ = cmds.Add('ALIGN ORIGIN Z')
    print('[OK] 添加 ORIGIN Z 对齐')
    
    # ===== 2. 测量特征 =====
    print('')
    print('===== 测量特征 =====')
    
    # 测量平面1 (顶面)
    featPlane = cmds.Add('PLANE HIT')
    if featPlane is not None:
        featPlane.Name = 'TOP_PLANE'
        featPlane.Comment = '零件顶面'
        print('[OK] 添加 PLANE 特征: TOP_PLANE')
    
    # 测量圆孔1
    featCircle1 = cmds.Add('CIRCLE AUTO')
    if featCircle1 is not None:
        featCircle1.Name = 'HOLE_1'
        featCircle1.Comment = '零件左侧圆孔'
        print('[OK] 添加 CIRCLE 特征: HOLE_1')
    
    # 测量圆孔2
    featCircle2 = cmds.Add('CIRCLE AUTO')
    if featCircle2 is not None:
        featCircle2.Name = 'HOLE_2'
        featCircle2.Comment = '零件右侧圆孔'
        print('[OK] 添加 CIRCLE 特征: HOLE_2')
    
    # 测量点1
    featPoint1 = cmds.Add('POINT HIT')
    if featPoint1 is not None:
        featPoint1.Name = 'CORNER_PT1'
        featPoint1.Comment = '角点1'
        print('[OK] 添加 POINT 特征: CORNER_PT1')
    
    # ===== 3. 添加尺寸标注 =====
    print('')
    print('===== 添加尺寸标注 =====')
    
    # 孔1直径
    dim1 = cmds.Add('DIM')
    if dim1 is not None:
        dim1.Name = 'HOLE1_DIA'
        dim1.Feature = featCircle1
        dim1.NominalValue = 10.0
        dim1.UpperTolerance = 0.05
        dim1.LowerTolerance = -0.05
        print('[OK] 添加直径尺寸: HOLE1_DIA (10.000 +/- 0.050)')
    
    # 孔2直径
    dim2 = cmds.Add('DIM')
    if dim2 is not None:
        dim2.Name = 'HOLE2_DIA'
        dim2.Feature = featCircle2
        dim2.NominalValue = 10.0
        dim2.UpperTolerance = 0.05
        dim2.LowerTolerance = -0.05
        print('[OK] 添加直径尺寸: HOLE2_DIA (10.000 +/- 0.050)')
    
    # ===== 4. 执行程序 =====
    print('')
    print('===== 执行测量程序 =====')
    newProg.Execute(1)
    print('[OK] 程序执行完成')
    
    # ===== 5. 读取测量结果 =====
    print('')
    print('===== 读取测量结果 =====')
    
    for cmd in cmds:
        if hasattr(cmd, 'GetText') and cmd.Name in ['TOP_PLANE', 'HOLE_1', 'HOLE_2', 'CORNER_PT1']:
            try:
                actual = cmd.GetText(3, 0)  # 实际值
                nom = cmd.GetText(1, 0)     # 名义值
                print(f'  特征 {cmd.Name}: 名义={nom}, 实际={actual}')
            except:
                print(f'  特征 {cmd.Name}: (无法读取详细数据)')
    
    # 读取尺寸结果
    dims = newProg.Dimensions
    print('')
    print('尺寸结果:')
    for dim in dims:
        try:
            dev = dim.GetText(30, 0)  # Deviation
            print(f'  {dim.Name}: Deviation = {dev}')
        except:
            print(f'  {dim.Name}: (无法读取)')
    
    print('')
    print('===== 测量程序创建完成 =====')
    
    # 保存程序
    savePath = r'D:\PCDMIS_PROGRAMS\SquarePlateWithHoles.prg'
    try:
        import os
        os.makedirs(os.path.dirname(savePath), exist_ok=True)
        newProg.SaveAs(savePath)
        print(f'[OK] 程序已保存: {savePath}')
    except Exception as e:
        print(f'[INFO] 保存失败(可能无活动程序): {e}')
    
    pcdmis.Quit()
    print('[OK] PC-DMIS 已关闭')
    
except Exception as e:
    print('[ERROR] 连接 PC-DMIS 失败:', str(e))
    import traceback
    traceback.print_exc()
"@

# 写临时 Python 脚本
$scriptPath = "$env:TEMP\pcdmis_measurement.py"
$pythonScript | Out-File -FilePath $scriptPath -Encoding UTF8

Write-Host "===== 步骤 4: 执行 PC-DMIS 测量脚本 =====" -ForegroundColor Cyan
Write-Host "脚本路径: $scriptPath" -ForegroundColor Gray

# 执行 Python 脚本
& $pythonExe $scriptPath 2>&1

Write-Host ""
Write-Host "===== 执行完成 =====" -ForegroundColor Green