/**
 * A2A-to-MCP Bridge
 *
 * This MCP server bridges A2A agents into claw's MCP tool system.
 * It reads .claw/a2a-agents.json, fetches Agent Cards, and exposes
 * each A2A agent as an MCP tool that claw can call natively.
 *
 * Protocol: Content-Length framed JSON-RPC over stdio (standard MCP)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

function loadA2AConfig() {
  const configPath = process.env.A2A_CONFIG_PATH ||
    join(process.cwd(), '.claw', 'a2a-agents.json');
  
  if (!existsSync(configPath)) return null;
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch { return null; }
}

// ---------------------------------------------------------------------------
// Agent Card fetching
// ---------------------------------------------------------------------------

async function fetchAgentCard(url) {
  try {
    const cardUrl = `${url.replace(/\/$/, '')}/.well-known/agent-card.json`;
    const res = await fetch(cardUrl, { signal: AbortSignal.timeout(5000) });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

// ---------------------------------------------------------------------------
// A2A JSON-RPC delegation
// ---------------------------------------------------------------------------

async function delegateTask(baseUrl, taskText) {
  const url = `${baseUrl.replace(/\/$/, '')}/a2a/jsonrpc`;
  const body = {
    jsonrpc: '2.0',
    method: 'message/send',
    id: `mcp-${Date.now()}`,
    params: {
      message: {
        role: 'user',
        parts: [{ kind: 'text', text: taskText }],
      },
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });
    
    if (!res.ok) {
      return `[A2A Error] HTTP ${res.status}`;
    }
    
    const data = await res.json();
    
    // Extract result text from A2A response
    if (data.result) {
      const result = data.result;
      // Try artifacts first
      if (result.artifacts?.length > 0) {
        const texts = result.artifacts
          .flatMap(a => a.parts || [])
          .filter(p => p.kind === 'text')
          .map(p => p.text);
        if (texts.length > 0) {
          const states = result.status?.state ? `${result.status.state}` : 'completed';
          return `[${result.id || 'task'}] ${states}\n${texts.join('\n')}`;
        }
      }
      // Try status message
      if (result.status?.message?.parts) {
        const text = result.status.message.parts
          .filter(p => p.kind === 'text')
          .map(p => p.text)
          .join('');
        if (text) return text;
      }
      // Fallback
      return JSON.stringify(result);
    }
    
    if (data.error) {
      return `[A2A Error] ${data.error.message || JSON.stringify(data.error)}`;
    }
    
    return JSON.stringify(data);
  } catch (err) {
    return `[A2A Error] ${err.message}`;
  }
}

// ---------------------------------------------------------------------------
// MCP Protocol (Content-Length framed stdio)
// ---------------------------------------------------------------------------

let inputBuffer = Buffer.alloc(0);
const tools = []; // { name, description, agentUrl }

function sendResponse(msg) {
  const payload = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(payload, 'utf8')}\r\n\r\n`;
  process.stdout.write(header + payload);
}

function handleRequest(req) {
  if (req.method === 'initialize') {
    sendResponse({
      jsonrpc: '2.0',
      id: req.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'a2a-mcp-bridge', version: '1.0.0' },
      },
    });
  } else if (req.method === 'notifications/initialized') {
    // No response needed
  } else if (req.method === 'tools/list') {
    sendResponse({
      jsonrpc: '2.0',
      id: req.id,
      result: {
        tools: tools.map(t => ({
          name: t.name,
          description: t.description,
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: `委派给远程专家的完整自然语言任务` },
            },
            required: ['task'],
          },
        })),
      },
    });
  } else if (req.method === 'tools/call') {
    const toolName = req.params?.name;
    const taskText = req.params?.arguments?.task || '';
    const tool = tools.find(t => t.name === toolName);
    
    if (!tool) {
      sendResponse({
        jsonrpc: '2.0',
        id: req.id,
        result: { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true },
      });
      return;
    }
    
    // Async delegation
    delegateTask(tool.agentUrl, taskText).then(result => {
      sendResponse({
        jsonrpc: '2.0',
        id: req.id,
        result: { content: [{ type: 'text', text: result }] },
      });
    }).catch(err => {
      sendResponse({
        jsonrpc: '2.0',
        id: req.id,
        result: { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true },
      });
    });
  } else {
    sendResponse({
      jsonrpc: '2.0',
      id: req.id,
      error: { code: -32601, message: `Method not found: ${req.method}` },
    });
  }
}

function drainInput() {
  while (true) {
    const headerEnd = inputBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) break;
    
    const headerStr = inputBuffer.slice(0, headerEnd).toString('utf8');
    const match = headerStr.match(/Content-Length:\s*(\d+)/i);
    if (!match) { inputBuffer = inputBuffer.slice(headerEnd + 4); continue; }
    
    const contentLength = parseInt(match[1], 10);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + contentLength;
    
    if (inputBuffer.length < messageEnd) break; // Wait for more data
    
    const payload = inputBuffer.slice(messageStart, messageEnd).toString('utf8');
    inputBuffer = inputBuffer.slice(messageEnd);
    
    try {
      const req = JSON.parse(payload);
      handleRequest(req);
    } catch (e) {
      process.stderr.write(`[a2a-mcp-bridge] JSON parse error: ${e.message}\n`);
    }
  }
}

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

async function main() {
  const config = loadA2AConfig();
  
  if (config?.agents) {
    for (const agent of config.agents) {
      if (!agent.enabled || agent.type !== 'native' || !agent.url) continue;
      
      const card = await fetchAgentCard(agent.url);
      if (card) {
        const name = card.name.toLowerCase().replace(/\s+/g, '_');
        const skillDesc = card.skills?.map(s => `${s.name}: ${s.description}`).join('; ') || '';
        tools.push({
          name,
          description: `${card.description}${skillDesc ? ` Skills: ${skillDesc}` : ''}`,
          agentUrl: agent.url,
        });
        process.stderr.write(`[a2a-mcp-bridge] Registered: ${name} (${agent.url})\n`);
      } else {
        process.stderr.write(`[a2a-mcp-bridge] Failed to fetch card: ${agent.url}\n`);
      }
    }
  }
  
  if (tools.length === 0) {
    process.stderr.write(`[a2a-mcp-bridge] No agents available, tools/list will be empty\n`);
  }
  
  // Listen on stdin
  process.stdin.on('data', (chunk) => {
    inputBuffer = Buffer.concat([inputBuffer, chunk]);
    drainInput();
  });
}

main();
