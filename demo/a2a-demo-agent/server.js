/**
 * A2A Demo Agent — 天气查询演示
 *
 * 实现 A2A 协议的最小子集：
 * 1. GET /.well-known/agent-card.json — Agent Card（能力发现）
 * 2. POST /a2a/jsonrpc — JSON-RPC message/send（任务委派）
 *
 * 启动方式：
 *   cd demo/a2a-demo-agent
 *   npm install
 *   npm start
 *
 * 默认监听端口 4000
 */

import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------------------------------------------------------------------------
// Agent Card — A2A 能力发现
// ---------------------------------------------------------------------------

const AGENT_CARD = {
  name: "Weather Agent",
  description: "查询全球城市的天气信息，返回温度、天气状况和建议。",
  url: `http://localhost:${PORT}`,
  version: "1.0.0",
  capabilities: {
    streaming: false,
    pushNotifications: false,
  },
  skills: [
    {
      id: "weather-query",
      name: "天气查询",
      description: "根据城市名称查询当前天气状况",
    },
    {
      id: "weather-forecast",
      name: "天气预报",
      description: "获取未来几天的天气预报概要",
    },
  ],
};

// Agent Card 端点
app.get('/.well-known/agent-card.json', (req, res) => {
  console.log(`[${timestamp()}] Agent Card requested`);
  res.json(AGENT_CARD);
});

// 也支持旧路径（兼容）
app.get('/agent-card.json', (req, res) => {
  res.json(AGENT_CARD);
});

// ---------------------------------------------------------------------------
// 模拟天气数据
// ---------------------------------------------------------------------------

const WEATHER_DATA = {
  "东京": { temp: 25, condition: "晴天", humidity: 55, suggestion: "适合户外活动" },
  "tokyo": { temp: 25, condition: "Sunny", humidity: 55, suggestion: "Great for outdoor activities" },
  "北京": { temp: 30, condition: "多云", humidity: 65, suggestion: "注意防晒" },
  "beijing": { temp: 30, condition: "Cloudy", humidity: 65, suggestion: "Wear sunscreen" },
  "上海": { temp: 28, condition: "阴天", humidity: 80, suggestion: "建议带伞" },
  "shanghai": { temp: 28, condition: "Overcast", humidity: 80, suggestion: "Bring an umbrella" },
  "纽约": { temp: 22, condition: "小雨", humidity: 70, suggestion: "需要雨具" },
  "new york": { temp: 22, condition: "Light Rain", humidity: 70, suggestion: "Bring rain gear" },
  "伦敦": { temp: 18, condition: "多云", humidity: 75, suggestion: "穿件外套" },
  "london": { temp: 18, condition: "Cloudy", humidity: 75, suggestion: "Wear a jacket" },
  "巴黎": { temp: 20, condition: "晴天", humidity: 60, suggestion: "适合散步" },
  "paris": { temp: 20, condition: "Sunny", humidity: 60, suggestion: "Perfect for a walk" },
  "深圳": { temp: 32, condition: "晴热", humidity: 70, suggestion: "注意防暑降温" },
  "shenzhen": { temp: 32, condition: "Hot & Sunny", humidity: 70, suggestion: "Stay hydrated" },
};

function queryWeather(taskText) {
  const text = taskText.toLowerCase();

  // 搜索匹配的城市
  for (const [city, data] of Object.entries(WEATHER_DATA)) {
    if (text.includes(city.toLowerCase())) {
      return {
        city,
        ...data,
        queriedAt: new Date().toISOString(),
        source: "A2A Demo Weather Agent",
      };
    }
  }

  // 未找到城市 — 返回默认数据
  return {
    city: "未知城市",
    temp: Math.floor(Math.random() * 20) + 10,
    condition: ["晴天", "多云", "小雨", "阴天"][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 40) + 40,
    suggestion: "以上为模拟数据，请确认城市名称",
    queriedAt: new Date().toISOString(),
    source: "A2A Demo Weather Agent (simulated)",
  };
}

// ---------------------------------------------------------------------------
// JSON-RPC 端点 — A2A message/send
// ---------------------------------------------------------------------------

app.post('/a2a/jsonrpc', (req, res) => {
  const { jsonrpc, method, id, params } = req.body;

  console.log(`[${timestamp()}] JSON-RPC request: method=${method}, id=${id}`);

  // 验证 JSON-RPC 格式
  if (jsonrpc !== '2.0') {
    return res.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' },
    });
  }

  if (method !== 'message/send') {
    return res.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  }

  // 提取任务文本
  const taskText = params?.message?.parts
    ?.filter(p => p.type === 'text' || p.kind === 'text')
    ?.map(p => p.text)
    ?.join('') || '';

  if (!taskText) {
    return res.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32602, message: 'Invalid params: message.parts must contain text' },
    });
  }

  console.log(`[${timestamp()}] Task: "${taskText}"`);

  // 模拟任务执行
  const taskId = uuidv4();
  const weather = queryWeather(taskText);
  const resultText = `🌤 ${weather.city}天气\n` +
    `温度: ${weather.temp}°C\n` +
    `状况: ${weather.condition}\n` +
    `湿度: ${weather.humidity}%\n` +
    `建议: ${weather.suggestion}\n` +
    `查询时间: ${weather.queriedAt}`;

  console.log(`[${timestamp()}] Result for task ${taskId}: ${weather.city} ${weather.temp}°C`);

  // 返回 A2A 任务完成响应
  res.json({
    jsonrpc: '2.0',
    id,
    result: {
      kind: 'task',
      id: taskId,
      status: { state: 'completed' },
      artifacts: [
        {
          name: 'weather-result',
          parts: [{ kind: 'text', text: resultText }],
        },
      ],
    },
  });
});

// ---------------------------------------------------------------------------
// 健康检查
// ---------------------------------------------------------------------------

app.get('/health', (req, res) => {
  res.json({ status: 'ok', agent: AGENT_CARD.name, uptime: process.uptime() });
});

// ---------------------------------------------------------------------------
// 启动
// ---------------------------------------------------------------------------

function timestamp() {
  return new Date().toISOString().slice(11, 19);
}

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║         A2A Demo Agent — Weather Service          ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(`║  端口: ${PORT}                                       ║`);
  console.log(`║  Agent Card: http://localhost:${PORT}/.well-known/agent-card.json`);
  console.log(`║  JSON-RPC:   http://localhost:${PORT}/a2a/jsonrpc`);
  console.log('║                                                    ║');
  console.log('║  支持城市: 东京/北京/上海/纽约/伦敦/巴黎/深圳     ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
});
