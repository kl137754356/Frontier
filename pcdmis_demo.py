# -*- coding: utf-8 -*-
"""
PC-DMIS Demo 测量程序 - 直接在 PC-DMIS 中创建测量程序
测量对象：法兰盘
  - 中心止口 Φ40
  - 4个 M10 螺栓孔（PCD=80）
  - 基准平面和基准线
"""

import win32com.client
import pythoncom
import math
import time

pythoncom.CoInitialize()

try:
    print('=' * 60)
    print('  PC-DMIS Demo 测量程序生成器')
    print('=' * 60)
    print()
    
    # 连接 PC-DMIS
    print('[1/5] 连接 PC-DMIS...')
    pcdmis = win32com.client.Dispatch('PCDLRN.Application')
    part = pcdmis.ActivePartProgram
    
    if not part:
        print('    创建新零件程序...')
        pcdmis.CreatePartProgram()
        part = pcdmis.ActivePartProgram
    
    cmds = part.Commands
    print('    已连接: %s' % part.Name)
    print('    当前命令数: %d' % cmds.Count)
    
    # ============================================================
    # 辅助函数
    # ============================================================
    def add_comment(text, ctype=3):
        """插入注释"""
        cmds.InsertionPointAfter(cmds.LastCommand)
        cmd = cmds.Add(170, True)
        cmd.PutText(str(ctype), 190, 0)
        cmd.PutText(text, 189, 1)
        cmd.ReDraw()
        return cmd
    
    def add_plane(name, hits=5):
        """添加平面特征"""
        cmds.InsertionPointAfter(cmds.LastCommand)
        cmd = cmds.Add(207, True)
        cmd.ID = name
        cmd.PutText(name, 189, 1)
        cmd.PutText(str(hits), 70, 0)
        cmd.ReDraw()
        return cmd
    
    def add_line(name, x=0, y=0, z=0, i=1, j=0, k=0, hits=4):
        """添加直线特征"""
        cmds.InsertionPointAfter(cmds.LastCommand)
        cmd = cmds.Add(204, True)
        cmd.ID = name
        cmd.PutText(name, 189, 1)
        cmd.PutText(str(x), 7, 0)
        cmd.PutText(str(y), 8, 0)
        cmd.PutText(str(z), 9, 0)
        cmd.PutText(str(i), 16, 0)
        cmd.PutText(str(j), 17, 0)
        cmd.PutText(str(k), 18, 0)
        cmd.PutText(str(hits), 70, 0)
        cmd.ReDraw()
        return cmd
    
    def add_circle(name, x, y, z, diameter, hits=8, start_ang=0, end_ang=360):
        """添加圆特征"""
        cmds.InsertionPointAfter(cmds.LastCommand)
        cmd = cmds.Add(202, True)
        cmd.ID = name
        cmd.PutText(name, 189, 1)
        cmd.PutText('NOM/XYZ', 3, 0)
        cmd.PutText(str(x), 7, 0)
        cmd.PutText(str(y), 8, 0)
        cmd.PutText(str(z), 9, 0)
        cmd.PutText('0', 16, 0)
        cmd.PutText('0', 17, 0)
        cmd.PutText('1', 18, 0)
        cmd.PutText(str(diameter), 34, 0)
        cmd.PutText(str(hits), 70, 0)
        cmd.PutText(str(start_ang), 283, 0)
        cmd.PutText(str(end_ang), 284, 0)
        cmd.ReDraw()
        return cmd
    
    # ============================================================
    # 程序头注释
    # ============================================================
    print()
    print('[2/5] 添加程序头注释...')
    
    add_comment('==================================================')
    add_comment('  Demo 测量程序 - 法兰盘测量')
    add_comment('  测量内容: 中心止口 + 螺栓孔阵列')
    ts = time.strftime('%Y-%m-%d %H:%M:%S')
    add_comment('  创建时间: ' + ts)
    add_comment('==================================================')
    print('    程序头注释已添加')
    
    # ============================================================
    # 坐标系对齐
    # ============================================================
    print()
    print('[3/5] 创建坐标系对齐...')
    
    # START_ALIGN
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(1, True)
    cmd.ID = 'A1'
    cmd.ReDraw()
    print('    A1 START_ALIGN 已添加')
    
    # LEVEL_ALIGN - 基准平面找 Z
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(2, True)
    cmd.ID = 'A2'
    cmd.AlignmentCommand.Workplane = 0  # Z+
    cmd.AlignmentCommand.FeatID = '基准平面'
    cmd.ReDraw()
    print('    A2 LEVEL_ALIGN 已添加 (基准平面 -> Z 轴)')
    
    # ROTATE_ALIGN - 基准线旋转 XY
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(3, True)
    cmd.ID = 'A3'
    cmd.AlignmentCommand.AXIS = 0  # Z+
    cmd.AlignmentCommand.FeatID = '基准线'
    cmd.ReDraw()
    print('    A3 ROTATE_ALIGN 已添加 (基准线 -> XY 旋转)')
    
    # END_ALIGN
    cmds.InsertionPointAfter(cmds.LastCommand)
    cmd = cmds.Add(19, True)
    cmd.ID = 'A5'
    cmd.ReDraw()
    print('    A5 END_ALIGN 已添加')
    
    # ============================================================
    # 测量基准特征
    # ============================================================
    print()
    print('[4/5] 测量基准特征...')
    
    add_plane('基准平面', hits=5)
    print('    基准平面 已添加 (5 点测量)')
    
    add_line('基准线', 0, 0, 0, 1, 0, 0, hits=4)
    print('    基准线 已添加 (4 点测量)')
    
    # ============================================================
    # 测量圆孔
    # ============================================================
    print()
    print('[5/5] 测量圆孔特征...')
    
    # 中心止口 Φ40
    add_circle('止口', 0, 0, 0, 40, hits=8)
    print('    止口 (Φ40, 8点) 已添加')
    
    # 4个螺栓孔 (M10, PCD=80)
    pcd = 80
    for i in range(4):
        angle = i * 90
        x = pcd / 2 * math.cos(math.radians(angle))
        y = pcd / 2 * math.sin(math.radians(angle))
        add_circle('螺栓孔_' + str(i + 1), x, y, 0, 11, hits=4)
        print('    螺栓孔_%d (X=%.2f, Y=%.2f, Φ11, 4点) 已添加' % (i + 1, x, y))
    
    # ============================================================
    # 程序结束
    # ============================================================
    print()
    add_comment('==================================================')
    add_comment('  测量程序创建完成')
    add_comment('==================================================')
    
    part.RefreshPart()
    
    # ============================================================
    # 输出摘要
    # ============================================================
    print()
    print('=' * 60)
    print('  测量程序创建完成!')
    print('=' * 60)
    print()
    print('程序摘要:')
    print('  总命令数: %d' % cmds.Count)
    print()
    print('测量的特征:')
    print('  1. 基准平面 - 用于 Z 轴找正')
    print('  2. 基准线   - 用于 XY 旋转找正')
    print('  3. 止口     - Φ40, 8点')
    print('  4. 螺栓孔_1 - Φ11, 4点 (0deg)')
    print('  5. 螺栓孔_2 - Φ11, 4点 (90deg)')
    print('  6. 螺栓孔_3 - Φ11, 4点 (180deg)')
    print('  7. 螺栓孔_4 - Φ11, 4点 (270deg)')
    print()
    print('=' * 60)
    print('  下一步:')
    print('  1. 在 PC-DMIS 中打开 Execution 窗口')
    print('  2. 点击 [执行] 按钮运行测量')
    print('  3. 测量完成后查看结果')
    print('=' * 60)
    print()
    
except Exception as e:
    print()
    print('=' * 60)
    print('  错误: %s' % str(e))
    print('=' * 60)
    import traceback
    traceback.print_exc()

pythoncom.CoUninitialize()