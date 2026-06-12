---
name: disk-cleanup
description: Windows磁盘清理助手，帮助分析磁盘空间占用情况，提供安全清理建议，特别针对C盘空间不足问题。
---

# 磁盘清理助手 Skill

当用户反映电脑磁盘空间不足、C盘飘红、需要清理垃圾文件时，使用此 skill。

## 清理流程（按安全风险从低到高推荐）

### 第一梯队：安全无风险（推荐首选）

1. **运行 Windows 自带磁盘清理**
   ```powershell
   cleanmgr /sageset:1
   cleanmgr /sagerun:1
   ```

2. **清理临时文件**
   ```powershell
   # 用户临时文件
   del /q /f /s "%TEMP%\*.*" 2>nul
   # 系统临时文件
   del /q /f /s "%WINDIR%\Temp\*.*" 2>nul
   ```

3. **清理 Windows 更新缓存**
   ```powershell
   Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase
   ```

### 第二梯队：较安全（不会影响系统运行）

4. **清理回收站**
   ```powershell
   Clear-RecycleBin -Force
   ```

5. **清理浏览器缓存**
   - Edge/Chrome 缓存目录：`%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache`
   - 可建议用户通过浏览器设置清理

6. **查看大文件分布**
   ```powershell
   # 扫描C盘大文件夹（前20个）
   Get-ChildItem "C:\" -Directory -ErrorAction SilentlyContinue | 
     ForEach-Object { 
       $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | 
         Measure-Object Length -Sum).Sum
       [PSCustomObject]@{
         Folder = $_.Name
         SizeGB = [math]::Round($size/1GB, 2)
       }
     } | Sort-Object SizeGB -Descending | Select-Object -First 20 | Format-Table -AutoSize
   ```

### 第三梯队：需用户确认后操作

7. **关闭休眠（如不需要）**
   ```powershell
   powercfg -h off
   ```
   （可释放数GB到十几GB，但会禁用快速启动）

8. **移动个人文件到D盘**
   - 桌面、文档、下载、图片等文件夹可以右键属性→位置→移动到D盘

## 安全和提醒

- 在执行任何删除操作前，先分析空间占用并展示给用户
- 标记每项操作的风险等级 ⚠️
- 不擅自执行具有破坏性的操作（如删除系统文件、强制卸载应用等）
- 操作前建议用户关闭正在运行的程序
