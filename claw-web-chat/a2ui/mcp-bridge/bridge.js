#!/usr/bin/env node
"use strict";
/**
 * MCP Protocol Bridge
 * 
 * Converts between claw-code's Content-Length framed protocol and
 * FastMCP's bare JSON lines protocol.
 * 
 * claw-code (Content-Length frames) <---> bridge <---> FastMCP exe (JSON lines)
 * 
 * Usage: node bridge.js <path-to-fastmcp-exe> [args...]
 */

const { spawn } = require("child_process");
const path = require("path");

const exePath = process.argv[2];
if (!exePath) {
  process.stderr.write("Usage: node bridge.js <path-to-mcp-exe> [args...]\n");
  process.exit(1);
}

const exeArgs = process.argv.slice(3);

// Spawn the FastMCP process
const child = spawn(exePath, exeArgs, {
  stdio: ["pipe", "pipe", "pipe"],
  shell: false,
});

child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

child.on("error", (err) => {
  process.stderr.write(`[bridge] Failed to start child: ${err.message}\n`);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code || 0);
});

// --- claw-code stdin (Content-Length frames) -> child stdin (JSON lines) ---

let inputBuffer = Buffer.alloc(0);

process.stdin.on("data", (chunk) => {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  drainInput();
});

process.stdin.on("end", () => {
  child.stdin.end();
});

function drainInput() {
  while (true) {
    const headerEnd = inputBuffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;

    const headerStr = inputBuffer.slice(0, headerEnd).toString("utf8");
    const match = headerStr.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      // Skip malformed header
      inputBuffer = inputBuffer.slice(headerEnd + 4);
      continue;
    }

    const contentLength = parseInt(match[1], 10);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + contentLength;

    if (inputBuffer.length < messageEnd) break;

    const payload = inputBuffer.slice(messageStart, messageEnd);
    inputBuffer = inputBuffer.slice(messageEnd);

    // Forward as JSON line to child
    child.stdin.write(payload);
    child.stdin.write("\n");
  }
}

// --- child stdout (JSON lines) -> claw-code stdout (Content-Length frames) ---

let childBuffer = "";

child.stdout.on("data", (chunk) => {
  childBuffer += chunk.toString("utf8");
  drainChildOutput();
});

function drainChildOutput() {
  const lines = childBuffer.split("\n");
  childBuffer = lines.pop() || "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Validate it's JSON before framing
    try {
      JSON.parse(trimmed);
    } catch {
      // Not JSON, skip (could be log output)
      continue;
    }

    // Send as Content-Length frame
    const payload = Buffer.from(trimmed, "utf8");
    const header = `Content-Length: ${payload.length}\r\n\r\n`;
    process.stdout.write(header);
    process.stdout.write(payload);
  }
}

process.stdin.resume();
