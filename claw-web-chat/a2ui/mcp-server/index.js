#!/usr/bin/env node
"use strict";
/**
 * A2UI MCP Server — provides the `present_choices` tool for claw-code.
 * Uses Content-Length framed JSON-RPC over stdio (LSP-style transport).
 * CommonJS format for fastest Node.js startup.
 */

const crypto = require("crypto");

const CATALOG_ID = "copilotkit://decision-catalog";
const SERVER_INFO = { name: "a2ui-mcp-server", version: "1.0.0" };

const PRESENT_CHOICES_TOOL = {
  name: "present_choices",
  description:
    "Ask the user to choose one or more options with A2UI. Use single mode for next-step decisions and multiple mode for preferences or action checklists.",
  inputSchema: {
    type: "object",
    properties: {
      question: { type: "string", description: "Question shown to the user." },
      options: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "Stable business id." },
            label: { type: "string", description: "Short visible label." },
            description: { type: "string", description: "Optional helper text." },
          },
          required: ["id", "label"],
        },
        minItems: 1,
        description: "Selectable options.",
      },
      mode: {
        type: "string",
        enum: ["single", "multiple"],
        default: "single",
        description: "single = radio buttons; multiple = checkboxes.",
      },
      description: { type: "string", description: "Optional helper text below question." },
      submitLabel: { type: "string", description: "Optional submit button label." },
    },
    required: ["question", "options"],
  },
};

// --- Content-Length framed stdio transport ---

function sendMessage(msg) {
  const payload = JSON.stringify(msg);
  const byteLength = Buffer.byteLength(payload, "utf8");
  const header = `Content-Length: ${byteLength}\r\n\r\n`;
  process.stdout.write(header + payload);
}

function sendResponse(id, result) {
  sendMessage({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  sendMessage({ jsonrpc: "2.0", id, error: { code, message } });
}

// --- Request handlers ---

function handleRequest(req) {
  const { id, method, params } = req;

  switch (method) {
    case "initialize":
      sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
      break;

    case "notifications/initialized":
      break;

    case "tools/list":
      sendResponse(id, { tools: [PRESENT_CHOICES_TOOL] });
      break;

    case "tools/call":
      handleToolCall(id, params);
      break;

    default:
      if (id !== undefined) {
        sendError(id, -32601, `Method not found: ${method}`);
      }
  }
}

function handleToolCall(id, params) {
  if (params.name !== "present_choices") {
    sendResponse(id, {
      content: [{ type: "text", text: `Unknown tool: ${params.name}` }],
      isError: true,
    });
    return;
  }

  const args = params.arguments || {};
  const question = args.question;
  const options = args.options;
  const mode = args.mode || "single";
  const description = args.description || "";
  const submitLabel = args.submitLabel || "Submit";

  const surfaceId = "decision-" + crypto.randomUUID().replace(/-/g, "").slice(0, 8);

  const components = [
    {
      id: "root",
      component: "ChoicePrompt",
      question: question,
      description: description,
      mode: mode,
      options: options,
      submitLabel: submitLabel,
      action: {
        event: {
          name: "business_choices_confirmed",
          context: { surfaceId: surfaceId },
        },
      },
    },
  ];

  const a2uiResult = JSON.stringify({
    a2ui_operations: [
      { version: "v0.9", createSurface: { surfaceId: surfaceId, catalogId: CATALOG_ID } },
      { version: "v0.9", updateComponents: { surfaceId: surfaceId, components: components } },
    ],
  });

  sendResponse(id, {
    content: [{ type: "text", text: a2uiResult }],
  });
}

// --- Read Content-Length framed messages from stdin ---

let inputBuffer = Buffer.alloc(0);

process.stdin.on("data", function (chunk) {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  processBuffer();
});

function processBuffer() {
  while (true) {
    const headerEnd = inputBuffer.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;

    const headerStr = inputBuffer.slice(0, headerEnd).toString("utf8");
    const match = headerStr.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      inputBuffer = inputBuffer.slice(headerEnd + 4);
      continue;
    }

    const contentLength = parseInt(match[1], 10);
    const messageStart = headerEnd + 4;
    const messageEnd = messageStart + contentLength;

    if (inputBuffer.length < messageEnd) break;

    const payload = inputBuffer.slice(messageStart, messageEnd).toString("utf8");
    inputBuffer = inputBuffer.slice(messageEnd);

    try {
      const req = JSON.parse(payload);
      handleRequest(req);
    } catch (e) {
      // Ignore malformed JSON
    }
  }
}

process.stdin.resume();
