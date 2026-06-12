---
name: sysinfo
description: 查询本机电脑硬件和系统配置信息，包括CPU、显卡、内存、网卡、硬盘、操作系统、各磁盘容量及剩余空间。当用户询问电脑配置、硬件信息、磁盘空间时自动调用。
---

# 系统信息查询 Skill

当用户询问本机电脑配置、硬件信息、磁盘空间等问题时，执行以下 PowerShell 命令收集信息并以清晰格式返回。

## 执行步骤

运行以下 PowerShell 脚本获取系统信息：

```powershell
Write-Host "===== 操作系统 =====" 
Get-CimInstance Win32_OperatingSystem | Format-List Caption, Version, BuildNumber, OSArchitecture, InstallDate, LastBootUpTime

Write-Host "===== CPU =====" 
Get-CimInstance Win32_Processor | Format-List Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed, CurrentClockSpeed

Write-Host "===== 内存 =====" 
$os = Get-CimInstance Win32_OperatingSystem
Write-Host ("总物理内存: {0:N2} GB" -f ($os.TotalVisibleMemorySize / 1MB))
Write-Host ("可用内存: {0:N2} GB" -f ($os.FreePhysicalMemory / 1MB))
Write-Host ("内存使用率: {0:N1}%" -f ((1 - $os.FreePhysicalMemory / $os.TotalVisibleMemorySize) * 100))
Get-CimInstance Win32_PhysicalMemory | Format-Table Manufacturer, Capacity, Speed, MemoryType, FormFactor -AutoSize

Write-Host "===== 显卡 =====" 
Get-CimInstance Win32_VideoController | Format-List Name, AdapterRAM, DriverVersion, VideoProcessor, CurrentHorizontalResolution, CurrentVerticalResolution

Write-Host "===== 硬盘 =====" 
Get-CimInstance Win32_DiskDrive | Format-List Model, Size, InterfaceType, MediaType
Write-Host "--- 磁盘分区容量 ---"
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Format-Table DeviceID, @{N="总容量(GB)";E={[math]::Round($_.Size/1GB,2)}}, @{N="剩余容量(GB)";E={[math]::Round($_.FreeSpace/1GB,2)}}, @{N="使用率(%)";E={[math]::Round((1-$_.FreeSpace/$_.Size)*100,1)}} -AutoSize

Write-Host "===== 网卡 =====" 
Get-CimInstance Win32_NetworkAdapter -Filter "NetConnectionStatus=2" | Format-List Name, MACAddress, Speed

Write-Host "===== 主板 =====" 
Get-CimInstance Win32_BaseBoard | Format-List Manufacturer, Product, SerialNumber
```

## 输出格式要求

将收集到的信息整理为结构化的中文报告，按以下分类展示：

1. **操作系统** - 系统名称、版本号、架构、安装日期
2. **CPU** - 型号、核心数、线程数、主频
3. **内存** - 总容量、可用容量、使用率、各内存条规格
4. **显卡** - 型号、显存、驱动版本、当前分辨率
5. **硬盘** - 型号、容量、接口类型；各分区总容量/剩余容量/使用率
6. **网卡** - 名称、MAC地址、速率
7. **主板** - 制造商、型号

如果某项信息获取失败，标注"获取失败"而非跳过。
