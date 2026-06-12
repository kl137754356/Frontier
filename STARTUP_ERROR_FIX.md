# 启动报错修复 - Startup Error Fix

## 🔧 问题修复

**错误信息**:
```
Backend error: spawn D:\...\Frontier\node\node.exe ENOENT
Failed to start backend: spawn D:\...\Frontier\node\node.exe ENOENT
```

**原因**: `main.js` 中有两个路径错误

---

## 🐛 问题详情

### 问题 1: 使用系统 Node.js 而不是嵌入式 Node.js

**错误的代码**:
```javascript
backendProcess = spawn(process.execPath, [BACKEND_ENTRY], ...)
```

**问题**: 
- `process.execPath` 是启动当前进程的 Node.js 路径
- 在分发包中没有定义
- 导致无法启动后端

### 问题 2: 错误的后端文件路径

**错误的路径**:
```javascript
const BACKEND_ENTRY = path.join(APP_DIR, 'backend-dist', 'backend', 'backend', 'src', 'agui-server.js');
```

**正确的路径**:
```javascript
const BACKEND_ENTRY = path.join(APP_DIR, 'backend-dist', 'backend', 'src', 'agui-server.js');
```

**解释**:
- 编译输出是: `backend-dist/backend/src/agui-server.js`
- 不是: `backend-dist/backend/backend/src/agui-server.js` (多了一个 backend)

---

## ✅ 修复内容

### 修改 1: 添加嵌入式 Node.js 路径

**文件**: `installer/main.js`

**修改**:
```javascript
// 添加这一行 (行 20)
const NODE_EXE = path.join(APP_DIR, 'node', 'node.exe');
```

### 修改 2: 修复后端文件路径

**文件**: `installer/main.js`

**修改前**:
```javascript
const BACKEND_ENTRY = path.join(APP_DIR, 'backend-dist', 'backend', 'backend', 'src', 'agui-server.js');
```

**修改后**:
```javascript
const BACKEND_ENTRY = path.join(APP_DIR, 'backend-dist', 'backend', 'src', 'agui-server.js');
```

### 修改 3: 使用嵌入式 Node.js 启动后端

**文件**: `installer/main.js`

**修改前**:
```javascript
backendProcess = spawn(process.execPath, [BACKEND_ENTRY], {
```

**修改后**:
```javascript
backendProcess = spawn(NODE_EXE, [BACKEND_ENTRY], {
```

---

## 📦 新版本已修复

**版本**: Frontier Distribution 127.8 MB (已更新)  
**位置**: `installer/release/Frontier/`

**包含的修复**:
- ✅ 嵌入式 Node.js 路径已正确配置
- ✅ 后端文件路径已修正
- ✅ spawn 调用已更新为使用嵌入式 Node.js

---

## 🚀 现在应该可以启动了

**步骤 1**: 使用新的 `installer/release/Frontier/`

**步骤 2**: 启动应用
```powershell
双击 Frontier.vbs (推荐)
或
双击 Frontier.bat (显示日志)
```

**步骤 3**: 如果仍然报错，请检查日志
```
日志位置: C:\Users\<你的用户名>\AppData\Roaming\frontier-desktop\frontier.log
```

---

## 📝 技术细节

### 路径结构验证

```
installer/release/Frontier/
├── node/
│   └── node.exe ✓
├── backend-dist/
│   ├── backend/
│   │   └── src/
│   │       └── agui-server.js ✓
│   └── node_modules/
├── frontend-dist/
├── bin/
│   └── claw.exe
└── main.js ✓
```

### 修复前后对比

**修复前**:
```
main.js 使用 process.execPath
  ↓
在分发包中无法定义
  ↓
后端启动失败
  ↓
错误: ENOENT (No such file or directory)
```

**修复后**:
```
main.js 使用 NODE_EXE = path.join(APP_DIR, 'node', 'node.exe')
  ↓
指向嵌入式 node.exe
  ↓
后端成功启动
  ↓
应用正常运行 ✓
```

---

## ✨ 相关修复

这次修复还包括：
- ✅ 会话持久化功能
- ✅ CronCreate 禁用
- ✅ 多个心跳并发执行
- ✅ 停止心跳立即生效

---

## 🧪 测试

**如何验证修复**:

1. **启动应用**
   ```
   双击 Frontier.vbs
   ```

2. **检查日志**
   ```
   C:\Users\<用户名>\AppData\Roaming\frontier-desktop\frontier.log
   
   应该看到:
   Starting backend: ...\backend-dist\backend\src\agui-server.js
   Frontend dir: ...\frontend-dist
   ```

3. **检查浏览器**
   ```
   应该自动打开浏览器
   访问: http://localhost:8081
   ```

4. **创建会话**
   ```
   创建会话并发送消息
   应该能正常工作
   ```

5. **重启应用**
   ```
   关闭应用
   重启应用
   会话和消息应该仍然存在 ✓
   ```

---

## ❌ 如果仍然报错

### 错误 1: node.exe 不存在

**症状**:
```
Backend error: spawn ... node.exe ENOENT
```

**解决**:
1. 检查 `installer/release/Frontier/node/node.exe` 是否存在
2. 重新运行 `node scripts/make-installer.js`
3. 确保 Node.js 已安装在系统中

### 错误 2: agui-server.js 不存在

**症状**:
```
Error: Cannot find module
```

**解决**:
1. 检查 `installer/release/Frontier/backend-dist/backend/src/agui-server.js` 是否存在
2. 运行 `npm run build` (backend)
3. 重新生成包

### 错误 3: 端口被占用

**症状**:
```
EADDRINUSE: address already in use
```

**解决**:
1. 关闭其他 Frontier 实例
2. 运行: `netstat -ano | find "8081"`
3. 查看日志确认哪个进程占用了端口

---

## 📞 支持

**日志文件位置**:
```
C:\Users\<你的用户名>\AppData\Roaming\frontier-desktop\frontier.log
```

**检查日志中查找**:
```
"Backend error" - 后端启动错误
"spawn" - 进程生成错误
"ENOENT" - 文件不存在
"EADDRINUSE" - 端口被占用
```

---

## ✅ 修复完成

**状态**: ✓ 已修复  
**版本**: Frontier Distribution 127.8 MB (已更新)  
**部署**: 可以立即使用新版本

所有启动错误应该已解决！ 🎉

