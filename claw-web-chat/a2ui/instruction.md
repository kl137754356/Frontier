# A2UI 决策 UI 集成说明

这份说明给编码 Agent 使用，目标是把本项目里的 A2UI “选择并确认”能力集成到一个已有的 React + Agent 项目中。

## 目标

当业务 Agent 需要询问用户偏好、让用户勾选应该执行的事项，或让用户选择下一步时，不再让用户复制粘贴或重新输入，而是让 Agent 渲染一个选择表单。单选用 radio，多选用 checkbox，用户提交后前端会把结构化事件发回 Agent。

## 需要迁移的文件

从本项目复制这些文件或等价逻辑：

- `src/app/declarative-generative-ui/definitions.ts`
- `src/app/declarative-generative-ui/renderers.tsx`
- `agent-ts/choice-ui.ts`
- `agent-ts/main.ts` 中的 prompt、model 配置和 `presentChoices` 工具注册方式

本原型只保留 TypeScript Agent，不再包含 Python Agent。

## 前端集成步骤

### 1. 安装依赖

目标 React 项目需要有：

```bash
npm install @copilotkit/react-core @copilotkit/a2ui-renderer zod
```

如果目标项目已经使用 CopilotKit，只确认版本支持 `a2ui={{ catalog }}` 即可。

### 2. 复制 A2UI Catalog

把下面两个文件复制到目标项目中，例如：

```text
src/a2ui/decision/definitions.ts
src/a2ui/decision/renderers.tsx
```

这两个文件定义了业务组件契约：

- `ChoicePrompt`：一个紧凑的选择表单，`mode="single"` 时渲染 radio，`mode="multiple"` 时渲染 checkbox

重要：Agent 只能生成 catalog 中定义过的组件。不要让 Agent 直接生成任意 React 组件。

### 3. 在 CopilotKit Provider 注册 Catalog

在目标项目的 CopilotKit Provider 位置注册：

```tsx
import { CopilotKit } from "@copilotkit/react-core/v2";
import { decisionCatalog } from "@/a2ui/decision/renderers";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      a2ui={{ catalog: decisionCatalog }}
      useSingleEndpoint={false}
    >
      {children}
    </CopilotKit>
  );
}
```

如果目标项目不是 Next.js，也一样在 React 根 Provider 处注册 `a2ui={{ catalog: decisionCatalog }}`。

### 4. 隐藏内部 A2UI 工具卡片

如果目标项目使用 CopilotKit 默认工具渲染，建议隐藏这些内部工具：

```tsx
import { useDefaultRenderTool } from "@copilotkit/react-core/v2";

const hiddenA2UITools = new Set([
  "present_choices",
  "log_a2ui_event",
  "render_a2ui",
]);

export function useHideA2UITools() {
  useDefaultRenderTool({
    render: ({ name }) => {
      if (hiddenA2UITools.has(name)) return <></>;
      return <></>;
    },
  });
}
```

## TypeScript Agent 集成步骤

### 1. 安装依赖

目标 Agent 项目需要：

```bash
npm install langchain @langchain/core @langchain/openai zod
```

如果使用 OpenAI-compatible 网关，例如 Bedrock 网关或自建分发服务，需要配置：

```env
OPENAI_API_KEY=你的 key
OPENAI_BASE_URL=你的 OpenAI-compatible endpoint
OPENAI_MODEL=你的模型别名
```

### 2. 复制 `presentChoices` 工具

复制 `agent-ts/choice-ui.ts` 到目标 Agent，例如：

```text
agent/tools/choice-ui.ts
```

这个工具会返回：

```json
{
  "a2ui_operations": [
    {
      "version": "v0.9",
      "createSurface": {
        "surfaceId": "decision-xxxx",
        "catalogId": "copilotkit://decision-catalog"
      }
    },
    {
      "version": "v0.9",
      "updateComponents": {
        "surfaceId": "decision-xxxx",
        "components": []
      }
    }
  ]
}
```

CopilotKit/A2UI middleware 会识别 `a2ui_operations` 并在前端渲染对应 surface。

### 3. 注册工具到 Agent

参考 `agent-ts/main.ts`：

```ts
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { presentChoices } from "./tools/choice-ui";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL ?? "claude-sonnet-4-6",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: process.env.OPENAI_BASE_URL
    ? { baseURL: process.env.OPENAI_BASE_URL }
    : undefined,
});

export const graph = createAgent({
  model,
  tools: [presentChoices],
  systemPrompt: `
You are a concise business decision assistant.

When the user needs to state preferences, decide what should be done, or choose
the next step, call present_choices. Do not ask the user to re-type choices.

Use mode="multiple" for preferences or "what should be done?" questions. Use
mode="single" for "what is the next step?" questions.

When you receive an A2UI click event or log_a2ui_event result for
business_choices_confirmed, acknowledge the selected choices in one short
sentence and continue with the next business step.
`,
});
```

如果目标项目已有 Agent，不需要替换整个 Agent，只需要：

1. 导入 `presentChoices`
2. 加入现有 tools 列表
3. 在 system prompt 中加入“需要用户选择时调用 `present_choices`”的规则
4. 在事件回传后处理 `business_choices_confirmed`

## Runtime / API Route 集成

目标项目需要让 CopilotKit runtime 能连接到 Agent，并开启 A2UI 处理。

Next.js 示例：

```ts
import {
  CopilotRuntime,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { createCopilotHonoHandler } from "@copilotkit/runtime/v2/hono";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";
import { handle } from "hono/vercel";

const defaultAgent = new LangGraphAgent({
  deploymentUrl: process.env.AGENT_URL ?? "http://localhost:8123",
  graphId: "sample_agent",
});

const runtime = new CopilotRuntime({
  agents: { default: defaultAgent },
  runner: new InMemoryAgentRunner(),
  a2ui: {
    injectA2UITool: false,
  },
});

const app = createCopilotHonoHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handle(app);
export const POST = handle(app);
```

说明：

- `injectA2UITool: false` 表示 A2UI 由你自己的 `present_choices` 工具返回。
- 如果你希望 CopilotKit 自动给 Agent 注入通用 A2UI 工具，可以改成自动注入模式，但业务选择场景更建议使用固定业务工具。

## 用户点击后的事件流

`ChoicePrompt` 提交后会发送：

```json
{
  "name": "business_choices_confirmed",
  "context": {
    "surfaceId": "decision-xxxx",
    "mode": "multiple",
    "selectedIds": ["fast_response", "low_cost"],
    "selectedOptions": [
      { "id": "fast_response", "label": "Fast response" },
      { "id": "low_cost", "label": "Low cost" }
    ]
  }
}
```

Agent 会在后续消息中看到 `log_a2ui_event` 相关结果。处理规则：

1. 识别事件名 `business_choices_confirmed`
2. 读取 `selectedIds` 和 `selectedOptions`
3. 回复用户已选择的选项
4. 执行业务下一步，例如调用订单、审批、报价、CRM 或工单 API

重要：不要只相信前端事件。后端必须校验：

- `selectedIds` 是否属于本次对话生成过的候选项
- 当前用户是否有权限选择该选项
- 该选项在当前业务状态下是否仍然有效

## 什么时候用固定 UI，什么时候用动态 UI

业务选择、审批、确认：优先使用固定 catalog，例如 `ChoicePrompt`。

临时数据分析、仪表盘、探索型展示：可以让 Agent 生成更动态的 A2UI schema。

核心原则：业务关键操作不要让模型自由发明 UI。让模型只决定“展示哪些业务选项”，不要决定“用什么前端组件实现业务动作”。

## 测试清单

集成后至少验证：

- 用户要求“询问我的偏好”时，Agent 会用 `mode="multiple"` 调用 `present_choices`
- 用户要求“选择下一步”时，Agent 会用 `mode="single"` 调用 `present_choices`
- 前端渲染出 `ChoicePrompt`
- 单选模式显示 radio，多选模式显示 checkbox
- 点击 Submit 后按钮变成 `Sent`
- 点击 Submit 后选项区进入 disabled 状态，不能继续修改
- Agent 收到 `business_choices_confirmed` 事件并继续回复
- 刷新页面或多轮对话时不会复用错误的 `surfaceId`
- 后端会校验 `selectedIds`

## 最小迁移顺序

建议按这个顺序做：

1. 先复制前端 catalog，并在 Provider 中注册
2. 再复制 `presentChoices` 工具
3. 把工具加入现有 Agent
4. 修改 system prompt
5. 跑一次“选择服务方案”的端到端测试
6. 再把真实业务 API 接到 `business_choices_confirmed` 后续流程里
