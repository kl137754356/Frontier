/**
 * A2A Demo Agent — 系统信息监控
 *
 * 检查本机电脑配置：CPU、内存、显存（GPU）、磁盘占用。
 * 实现 A2A 协议最小子集，可直连或通过 MCP Bridge 使用。
 *
 * 启动: cd demo/a2a-sysinfo-agent && npm install && npm start
 * 端口: 4001
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { execSync } from 'child_process';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4001;

// ---------------------------------------------------------------------------
// Agent Card
// ---------------------------------------------------------------------------

const AGENT_CARD = {
  name: "System Monitor",
  description: "检查本机电脑硬件配置和实时资源使用情况：CPU、内存、GPU显存、磁盘占用。",
  url: `http://localhost:${PORT}`,
  version: "1.0.0",
  capabilities: { streaming: false, pushNotifications: false },
  skills: [
    { id: "hw-config", name: "硬件配置", description: "查看 CPU 型号、核心数、总内存、GPU 信息" },
    { id: "mem-usage", name: "内存监控", description: "实时内存使用率和可用内存" },
    { id: "disk-usage", name: "磁盘监控", description: "各磁盘分区的容量和使用率" },
    { id: "gpu-usage", name: "显存监控", description: "GPU 显存使用情况（需要 NVIDIA GPU）" },
  ],
};

app.get('/.well-known/agent-card.json', (req, res) => {
  console.log(`[${ts()}] Agent Card requested`);
  res.json(AGENT_CARD);
});

// ---------------------------------------------------------------------------
// System info collection
// ---------------------------------------------------------------------------

function getCpuInfo() {
  const cpus = os.cpus();
  return {
    model: cpus[0]?.model || 'Unknown',
    cores: cpus.length,
    speed: `${cpus[0]?.speed || 0} MHz`,
    arch: os.arch(),
  };
}

function getMemoryInfo() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return {
    total: formatBytes(total),
    used: formatBytes(used),
    free: formatBytes(free),
    usagePercent: ((used / total) * 100).toFixed(1) + '%',
  };
}

function getDiskInfo() {
  try {
    // Windows: use wmic
    const output = execSync(
      'wmic logicaldisk get caption,size,freespace /format:csv',
      { encoding: 'utf8', timeout: 5000 }
    );
    const lines = output.trim().split('\n').filter(l => l.trim() && !l.startsWith('Node'));
    const disks = [];
    for (const line of lines) {
      const parts = line.trim().split(',');
      if (parts.length >= 4) {
        const drive = parts[1];
        const free = parseInt(parts[2]) || 0;
        const total = parseInt(parts[3]) || 0;
        if (total > 0) {
          const used = total - free;
          disks.push({
            drive,
            total: formatBytes(total),
            used: formatBytes(used),
            free: formatBytes(free),
            usagePercent: ((used / total) * 100).toFixed(1) + '%',
          });
        }
      }
    }
    return disks.length > 0 ? disks : [{ error: '无法获取磁盘信息' }];
  } catch (e) {
    return [{ error: `获取磁盘信息失败: ${e.message}` }];
  }
}

function getGpuInfo() {
  try {
    // Try nvidia-smi for NVIDIA GPUs
    const output = execSync(
      'nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free,utilization.gpu,temperature.gpu --format=csv,noheader,nounits',
      { encoding: 'utf8', timeout: 5000 }
    );
    const lines = output.trim().split('\n');
    return lines.map(line => {
      const [name, memTotal, memUsed, memFree, utilization, temp] = line.split(',').map(s => s.trim());
      return {
        name,
        memoryTotal: `${memTotal} MB`,
        memoryUsed: `${memUsed} MB`,
        memoryFree: `${memFree} MB`,
        memoryUsagePercent: ((parseInt(memUsed) / parseInt(memTotal)) * 100).toFixed(1) + '%',
        gpuUtilization: `${utilization}%`,
        temperature: `${temp}°C`,
      };
    });
  } catch {
    // Try Intel/AMD via wmic
    try {
      const output = execSync(
        'wmic path win32_VideoController get Name,AdapterRAM /format:csv',
        { encoding: 'utf8', timeout: 5000 }
      );
      const lines = output.trim().split('\n').filter(l => l.trim() && !l.startsWith('Node'));
      return lines.map(line => {
        const parts = line.trim().split(',');
        const ram = parseInt(parts[1]) || 0;
        return {
          name: parts[2] || 'Unknown GPU',
          memoryTotal: formatBytes(ram),
          note: '非 NVIDIA GPU，无法获取实时显存使用率',
        };
      });
    } catch {
      return [{ error: '无法获取 GPU 信息（未检测到 nvidia-smi 或 wmic）' }];
    }
  }
}

function getSystemOverview() {
  return {
    hostname: os.hostname(),
    platform: `${os.type()} ${os.release()}`,
    uptime: formatUptime(os.uptime()),
    cpu: getCpuInfo(),
    memory: getMemoryInfo(),
    gpu: getGpuInfo(),
    disks: getDiskInfo(),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}天 ${h}小时 ${m}分钟`;
}

function ts() { return new Date().toISOString().slice(11, 19); }

// ---------------------------------------------------------------------------
// JSON-RPC endpoint
// ---------------------------------------------------------------------------

app.post('/a2a/jsonrpc', (req, res) => {
  const { jsonrpc, method, id, params } = req.body;
  console.log(`[${ts()}] JSON-RPC: method=${method}, id=${id}`);

  if (jsonrpc !== '2.0') {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request' } });
  }
  if (method !== 'message/send') {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
  }

  const taskText = params?.message?.parts
    ?.filter(p => p.type === 'text' || p.kind === 'text')
    ?.map(p => p.text)?.join('') || '';

  console.log(`[${ts()}] Task: "${taskText}"`);

  // Determine what to report based on task text
  const text = taskText.toLowerCase();
  let result;

  if (text.includes('gpu') || text.includes('显存') || text.includes('显卡')) {
    const gpu = getGpuInfo();
    result = '🖥 GPU / 显存信息\n' + gpu.map(g =>
      Object.entries(g).map(([k, v]) => `  ${k}: ${v}`).join('\n')
    ).join('\n---\n');
  } else if (text.includes('内存') || text.includes('memory') || text.includes('ram')) {
    const mem = getMemoryInfo();
    result = `💾 内存使用情况\n  总量: ${mem.total}\n  已用: ${mem.used}\n  可用: ${mem.free}\n  使用率: ${mem.usagePercent}`;
  } else if (text.includes('磁盘') || text.includes('disk') || text.includes('硬盘') || text.includes('存储')) {
    const disks = getDiskInfo();
    result = '💿 磁盘使用情况\n' + disks.map(d =>
      d.error ? `  ${d.error}` : `  ${d.drive} — 总量: ${d.total}, 已用: ${d.used} (${d.usagePercent}), 可用: ${d.free}`
    ).join('\n');
  } else if (text.includes('cpu') || text.includes('处理器')) {
    const cpu = getCpuInfo();
    result = `🔧 CPU 信息\n  型号: ${cpu.model}\n  核心数: ${cpu.cores}\n  频率: ${cpu.speed}\n  架构: ${cpu.arch}`;
  } else {
    // Full overview
    const info = getSystemOverview();
    result = `🖥 系统总览 — ${info.hostname}\n` +
      `平台: ${info.platform}\n运行时间: ${info.uptime}\n\n` +
      `🔧 CPU: ${info.cpu.model} (${info.cpu.cores} 核, ${info.cpu.speed})\n\n` +
      `💾 内存: ${info.memory.used} / ${info.memory.total} (${info.memory.usagePercent})\n\n` +
      `🖥 GPU:\n${info.gpu.map(g => '  ' + (g.name || g.error || 'Unknown')).join('\n')}\n\n` +
      `💿 磁盘:\n${info.disks.map(d => d.error ? `  ${d.error}` : `  ${d.drive} ${d.used}/${d.total} (${d.usagePercent})`).join('\n')}`;
  }

  const taskId = uuidv4();
  console.log(`[${ts()}] Completed task ${taskId}`);

  res.json({
    jsonrpc: '2.0',
    id,
    result: {
      kind: 'task',
      id: taskId,
      status: { state: 'completed' },
      artifacts: [{ name: 'sysinfo-result', parts: [{ kind: 'text', text: result }] }],
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', agent: AGENT_CARD.name, uptime: process.uptime() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║       A2A Demo Agent — System Monitor             ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(`║  端口: ${PORT}                                       ║`);
  console.log(`║  Agent Card: http://localhost:${PORT}/.well-known/agent-card.json`);
  console.log(`║  JSON-RPC:   http://localhost:${PORT}/a2a/jsonrpc`);
  console.log('║                                                    ║');
  console.log('║  支持查询: CPU / 内存 / 磁盘 / GPU显存 / 全部概览 ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
});
