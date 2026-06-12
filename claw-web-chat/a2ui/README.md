# A2UI Decision Prototype

Minimal CopilotKit + LangGraph.js prototype for rendering radio/checkbox
business choices from a TypeScript agent.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

Set these values in `.env`:

```env
AGENT_URL=http://localhost:8123
OPENAI_API_KEY=your-key
OPENAI_BASE_URL=your-openai-compatible-endpoint
OPENAI_MODEL=your-model-alias
```

## Files To Study

- `src/app/declarative-generative-ui/definitions.ts` defines the A2UI catalog schema.
- `src/app/declarative-generative-ui/renderers.tsx` maps catalog components to React.
- `agent-ts/choice-ui.ts` emits A2UI operations from the `present_choices` tool.
- `agent-ts/main.ts` tells the TypeScript agent when to render choice UI.
- `langgraph.json` exposes `agent-ts/main.ts:graph` as `sample_agent`.
- `src/app/api/copilotkit/[[...slug]]/route.ts` connects React to the LangGraph agent.

## Prototype Flow

1. The user asks for a choice or approval.
2. The agent calls `present_choices`.
3. The tool returns A2UI operations for a `ChoicePrompt`.
4. React renders radio buttons for single choice or checkboxes for multiple choice.
5. The user selects options and submits.
6. A structured `business_choices_confirmed` event is sent back to the agent.
