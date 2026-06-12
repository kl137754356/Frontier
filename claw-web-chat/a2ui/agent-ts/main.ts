import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";

import { presentChoices } from "./choice-ui";

export const SYSTEM_PROMPT = `
You are a concise business decision assistant.

When the user needs to state preferences, decide what should be done, or choose
the next step, call present_choices. Do not ask the user to re-type choices.

Use mode="multiple" for preferences or "what should be done?" questions. Use
mode="single" for "what is the next step?" questions. Keep option labels short
and avoid detailed descriptions.

When you receive an A2UI click event or log_a2ui_event result for
business_choices_confirmed, acknowledge the selected choices in one short
sentence and continue with the next business step.
`;

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
  systemPrompt: SYSTEM_PROMPT,
});

export const agent = graph;
