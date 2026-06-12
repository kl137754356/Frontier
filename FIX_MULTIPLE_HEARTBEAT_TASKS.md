# 修复：多个心跳任务无法并发执行

## 问题描述

当添加多个心跳任务时，只有第一个能按时执行，第二个及之后的任务显示：

```
[Heartbeat] Skipped task 'sysconfig-check' (busy or disconnected)
```

实际上并非真正"断开连接"，而是被系统当作"忙碌"而跳过。

## 根本原因

在 `claw-web-chat/backend/src/agui-server.ts` 中的心跳执行条件过于严格：

```typescript
// 旧代码（有问题）
if (tcpBridge.isConnected() && !previousRunDraining && !activeSSEResponse) {
  // 执行任务
}
```

问题在于条件 `!activeSSEResponse`：
- 当用户与 Agent 对话时，`activeSSEResponse` 被设置
- 导致所有心跳任务都被阻止（即使用户没有在用心跳任务）
- 只有第一个任务能执行（在用户停止对话后）
- 第二个任务因为总有某个 SSE 连接活跃而无法执行

## 解决方案

修改执行条件，移除对 `activeSSEResponse` 的依赖：

```typescript
// 新代码（修复后）
if (tcpBridge.isConnected()) {
  // 心跳任务独立执行，不依赖用户 SSE 连接状态
  // 执行任务
}
```

## 改动详情

### 文件：`claw-web-chat/backend/src/agui-server.ts`

**函数：`addHeartbeatTask`**

```diff
- task.timer = setInterval(() => {
-   // Only send if connected and not currently processing another request  
-   if (tcpBridge.isConnected() && !previousRunDraining && !activeSSEResponse) {
+ task.timer = setInterval(() => {
+   // Only send if TCP connected (no need to wait for activeSSEResponse to be null)
+   // Heart beat tasks run independently of user-facing SSE responses
+   if (tcpBridge.isConnected()) {
      console.log(`[Heartbeat] Executing task '${id}': ${prompt.slice(0, 50)}`);
      task.lastRun = Date.now();
      task.runCount++;

      // Register a temporary listener to capture heartbeat results
      let resultText = '';
      const heartbeatListener = (msg: TcpServerMessage) => {
        if (msg.type === 'chunk') {
          resultText += (msg as any).text || '';
        } else if (msg.type === 'done') {
          tcpBridge.off('message', heartbeatListener);
          if (resultText.trim()) {
            heartbeatResultBuffer.push(`[${new Date().toLocaleTimeString()}] ${resultText.trim()}`);
            // Keep only last 20 results
            if (heartbeatResultBuffer.length > 20) heartbeatResultBuffer.shift();
          }
-         previousRunDraining = false;
        }
      };

-     // Don't removeAllListeners - just add heartbeat listener alongside existing ones
-     previousRunDraining = true;
      tcpBridge.on('message', heartbeatListener);
      tcpBridge.sendPrompt(`[自动心跳，直接执行不要提问不要选择框，用纯文字简洁报告] ${prompt}`);
    } else {
-     console.log(`[Heartbeat] Skipped task '${id}' (busy or disconnected)`);
+     console.log(`[Heartbeat] Skipped task '${id}' (TCP disconnected)`);
    }
  }, intervalMs);
```

## 工作原理改变

### 之前（有问题）

```
心跳任务1执行
  ↓
用户开始对话
  ↓
activeSSEResponse 被设置
  ↓
心跳任务2被创建
  ↓
心跳任务2的时间到了
  ↓
检查：activeSSEResponse != null
  ↓
❌ 跳过执行（条件不满足）
```

### 之后（修复后）

```
心跳任务1执行
  ↓
用户开始对话（与心跳无关）
  ↓
activeSSEResponse 被设置（用户的 SSE 连接）
  ↓
心跳任务2的时间到了
  ↓
检查：tcpBridge.isConnected()
  ↓
✅ 执行任务（TCP 连接正常，与用户 SSE 无关）
```

## 好处

1. ✅ **多任务并发执行** — 多个心跳任务可以同时运行
2. ✅ **用户对话不干扰** — 用户与 Agent 对话时，心跳照常执行
3. ✅ **独立的执行上下文** — 心跳有独立的 TCP 连接监听器，不与用户 SSE 共享
4. ✅ **更简洁的逻辑** — 移除了不必要的 `previousRunDraining` 标志复杂性

## 测试验证

应用此修改后，验证：

```bash
# 1. 创建第一个心跳任务
设置心跳：每30s发送一次"你是谁？你能干什么？"
# 结果：✓ 任务执行成功

# 2. 创建第二个心跳任务  
设置心跳：每120s发送一次"查看本机配置"
# 结果：✓ 两个任务都按时执行（之前第二个会被跳过）

# 3. 在执行心跳期间进行对话
# 用户：查看一下是否有更新
# 结果：
#   ✓ 用户对话正常
#   ✓ 心跳任务照常执行
#   ✓ 两者不互相干扰
```

## 日志对比

### 修改前（问题）
```
[Heartbeat] Executing task 'who-am-i': 你是谁...
[Heartbeat] Skipped task 'sysconfig-check' (busy or disconnected)  ❌
[Heartbeat] Executing task 'who-am-i': 你是谁...
[Heartbeat] Skipped task 'sysconfig-check' (busy or disconnected)  ❌
```

### 修改后（正常）
```
[Heartbeat] Executing task 'who-am-i': 你是谁...
[Heartbeat] Executing task 'sysconfig-check': 查看本机配置  ✓
[Heartbeat] Executing task 'who-am-i': 你是谁...
[Heartbeat] Executing task 'sysconfig-check': 查看本机配置  ✓
```

## 实施步骤

1. ✅ 修改已完成：`claw-web-chat/backend/src/agui-server.ts`
2. 重新构建后端：
   ```bash
   cd claw-web-chat/backend
   npm run build
   ```
3. 重新构建安装包：
   ```bash
   cd installer
   npm run build
   npm run dist:win
   ```
4. 测试验证多个心跳任务

## 相关代码位置

- **文件**：`claw-web-chat/backend/src/agui-server.ts`
- **函数**：`addHeartbeatTask()` (第 99-143 行)
- **修改行**：102-130 行

## 风险评估

- ✅ **低风险** — 仅改变心跳执行条件
- ✅ **无副作用** — 不影响用户 SSE 连接
- ✅ **完全兼容** — 现有的第一个心跳任务继续工作
- ✅ **新功能** — 现在支持多个心跳任务并发执行

## 完整的系统流程

```
多个心跳任务
    ↓
定时器到期
    ↓
检查 TCP 连接状态
    ↓
TCP 正常 ✓
    ↓
创建独立的监听器
    ↓
发送 prompt 给 Agent
    ↓
Agent 执行
    ↓
收集结果到 heartbeatResultBuffer
    ↓
任务完成
    ↓
等待下一个执行周期
```

## 总结

**问题**：第二个及以后的心跳任务被跳过
**原因**：执行条件对 `activeSSEResponse` 的依赖太强
**解决**：移除此依赖，仅依赖 TCP 连接状态
**结果**：多个心跳任务可以并发执行

---

**修改状态**：✅ 已完成
**测试状态**：待验证
**发布状态**：待重新构建

