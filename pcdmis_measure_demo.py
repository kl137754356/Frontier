'''
PC-DMIS 测量程序示例
零件：法兰盘 (Flange)
测量内容：端面、止口、螺栓孔阵列

使用说明：
1. 在 PC-DMIS 中打开此程序（或复制粘贴到 PC-DMIS 脚本编辑器）
2. 根据实际零件调整坐标系和测量路径
3. 运行程序前先进行探针校准
'''

import win32com.client
import pythoncom
import time

class PCDMISMeasurement:
    """PC-DMIS 测量程序封装类"""
    
    def __init__(self):
        pythoncom.CoInitialize()
        self.pcdmis = None
        self.part = None
        self.app = None
        
    def connect(self):
        """连接到运行中的 PC-DMIS"""
        try:
            self.pcdmis = win32com.client.Dispatch("PCDLRN.Application")
            self.app = self.pcdmis
            self.part = self.pcdmis.ActivePartProgram
            print("✓ 已连接到 PC-DMIS")
            return True
        except Exception as e:
            print(f"✗ 连接失败: {e}")
            return False
    
    def create_new_program(self, program_name="测量程序"):
        """创建新测量程序"""
        try:
            # 创建新零件程序
            self.pcdmis.CreatePartProgram()
            self.part = self.pcdmis.ActivePartProgram
            self.part.Comment = program_name
            print(f"✓ 已创建新程序: {program_name}")
            return True
        except Exception as e:
            print(f"✗ 创建程序失败: {e}")
            return False
    
    def set_alignment(self):
        """设置坐标系（3-2-1 法）"""
        try:
            cmds = self.part.Commands
            cmd = cmds.Add()
            
            # ===== 第一步：找正 Z 轴（测量平面） =====
            align_cmd = cmd.AlignmentCommand
            align_cmd.CommandName = "ALIGN"
            
            # 测量平面作为 Z 轴基准
            feat_cmd = cmds.Add()
            feat_cmd.FeatCmd.CommandName = "PLANE"
            feat_cmd.FeatCmd.SetText(1, 1, "基准平面")  # 特征名称
            
            # ===== 第二步：旋转 X 轴（测量线） =====
            line_cmd = cmds.Add()
            line_cmd.FeatCmd.CommandName = "LINE"
            line_cmd.FeatCmd.SetText(1, 1, "基准线")
            
            # ===== 第三步：找原点（测量点） =====
            point_cmd = cmds.Add()
            point_cmd.FeatCmd.CommandName = "POINT"
            point_cmd.FeatCmd.SetText(1, 1, "原点")
            
            print("✓ 坐标系设置完成")
            return True
        except Exception as e:
            print(f"✗ 坐标系设置失败: {e}")
            return False
    
    def measure_circle(self, name, x, y, z, radius=10, hits=4):
        """
        测量圆孔/圆
        
        参数:
            name: 特征名称
            x, y, z: 理论位置
            radius: 圆半径 (mm)
            hits: 采点数量
        """
        try:
            cmds = self.part.Commands
            cmd = cmds.Add()
            
            feat_cmd = cmd.FeatCmd
            feat_cmd.CommandName = "CIRCLE"
            feat_cmd.SetText(1, 1, name)          # 特征名称
            feat_cmd.SetText(1, 3, "NOM/XYZ")     # 理论值类型
            feat_cmd.SetReal(1, 4, x)            # X 理论值
            feat_cmd.SetReal(1, 5, y)            # Y 理论值
            feat_cmd.SetReal(1, 6, z)            # Z 理论值
            feat_cmd.SetReal(1, 7, radius)       # 直径（不是半径！）
            feat_cmd.SetInteger(1, 8, hits)       # 采点数
            
            print(f"✓ 已添加圆特征: {name}")
            return True
        except Exception as e:
            print(f"✗ 测量圆失败 {name}: {e}")
            return False
    
    def measure_plane(self, name, points=3):
        """测量平面特征"""
        try:
            cmds = self.part.Commands
            cmd = cmds.Add()
            
            feat_cmd = cmd.FeatCmd
            feat_cmd.CommandName = "PLANE"
            feat_cmd.SetText(1, 1, name)
            feat_cmd.SetInteger(1, 2, points)
            
            print(f"✓ 已添加平面特征: {name}")
            return True
        except Exception as e:
            print(f"✗ 测量平面失败: {e}")
            return False
    
    def measure_depth_hole(self, name, x, y, z, diameter, depth):
        """
        测量盲孔（带深度）
        """
        try:
            cmds = self.part.Commands
            cmd = cmds.Add()
            
            feat_cmd = cmd.FeatCmd
            feat_cmd.CommandName = "HOLE"  # 盲孔
            feat_cmd.SetText(1, 1, name)
            feat_cmd.SetText(1, 3, "NOM/XYZ")
            feat_cmd.SetReal(1, 4, x)
            feat_cmd.SetReal(1, 5, y)
            feat_cmd.SetReal(1, 6, z)
            feat_cmd.SetReal(1, 7, diameter)
            feat_cmd.SetReal(1, 8, depth)  # 深度
            
            print(f"✓ 已添加盲孔特征: {name}")
            return True
        except Exception as e:
            print(f"✗ 测量盲孔失败: {e}")
            return False
    
    def add_dimension(self, feat1, feat2, dim_type="DIST", tol=0.05):
        """
        添加尺寸评价
        
        参数:
            feat1: 特征1名称
            feat2: 特征2名称（或特征1本身）
            dim_type: 尺寸类型 (DIST=距离, DIA=直径, DEP=深度, 等)
            tol: 公差 (mm)
        """
        try:
            cmds = self.part.Commands
            cmd = cmds.Add()
            
            dim_cmd = cmd.DimensionCommand
            dim_cmd.CommandName = "DIM"
            dim_cmd.SetText(1, 1, f"{feat1}-{feat2}")
            dim_cmd.SetText(1, 2, dim_type)
            dim_cmd.SetReal(2, 1, tol)   # 上公差
            dim_cmd.SetReal(2, 2, tol)   # 下公差
            
            print(f"✓ 已添加尺寸: {feat1}-{feat2}")
            return True
        except Exception as e:
            print(f"✗ 添加尺寸失败: {e}")
            return False
    
    def execute_program(self):
        """执行测量程序"""
        try:
            print("▶ 开始执行测量程序...")
            self.part.Execute()
            print("✓ 测量完成")
            return True
        except Exception as e:
            print(f"✗ 执行失败: {e}")
            return False
    
    def save_program(self, path):
        """保存测量程序"""
        try:
            self.part.SaveAs(path)
            print(f"✓ 程序已保存: {path}")
            return True
        except Exception as e:
            print(f"✗ 保存失败: {e}")
            return False
    
    def disconnect(self):
        """断开连接"""
        if self.app:
            self.app = None
            self.part = None
        pythoncom.CoUninitialize()
        print("✓ 已断开连接")


def example_flange():
    """
    示例：测量法兰盘
    零件描述：
    - 直径 100mm 的法兰
    - 4个 M8 螺栓孔（分布在 PCD=80 的圆上）
    - 中心止口直径 40mm
    - 厚度 20mm
    """
    meas = PCDMISMeasurement()
    
    if not meas.connect():
        return
    
    # 创建新程序
    meas.create_new_program("法兰盘测量程序")
    
    # 设置坐标系
    meas.set_alignment()
    
    # 测量端面（基准）
    meas.measure_plane("TOP_SURFACE", points=5)
    
    # 测量中心止口（圆孔）
    meas.measure_circle("BORE_CENTER", x=0, y=0, z=0, radius=20, hits=8)
    
    # 测量螺栓孔阵列（4个孔，90°分布）
    import math
    pcd = 80  # Pitch Circle Diameter
    for i in range(4):
        angle = i * 90  # 角度
        x = pcd/2 * math.cos(math.radians(angle))
        y = pcd/2 * math.sin(math.radians(angle))
        meas.measure_circle(f"BOLT_HOLE_{i+1}", x=x, y=y, z=0, radius=4.25, hits=4)
    
    # 添加尺寸评价
    meas.add_dimension("BORE_CENTER", "BORE_CENTER", "DIA", tol=0.05)
    
    # 执行程序
    meas.execute_program()
    
    # 保存程序
    meas.save_program(r"C:\PCDMIS\Programs\Flange_Measure.prg")
    
    meas.disconnect()


if __name__ == "__main__":
    print("=" * 50)
    print("PC-DMIS 测量程序生成器")
    print("=" * 50)
    
    example_flange()
    
    print("\n" + "=" * 50)
    print("程序生成完成！")
    print("=" * 50)
