import { randomUUID } from "crypto";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const CATALOG_ID = "copilotkit://decision-catalog";
const A2UI_OPERATIONS_KEY = "a2ui_operations";

type ChoiceOption = {
  id: string;
  label: string;
  description?: string;
};

type A2UIComponent = {
  id: string;
  component: string;
  [key: string]: unknown;
};

type A2UIOperation =
  | {
      version: "v0.9";
      createSurface: {
        surfaceId: string;
        catalogId: string;
      };
    }
  | {
      version: "v0.9";
      updateComponents: {
        surfaceId: string;
        components: A2UIComponent[];
      };
    };

function createSurface(surfaceId: string, catalogId: string): A2UIOperation {
  return {
    version: "v0.9",
    createSurface: {
      surfaceId,
      catalogId,
    },
  };
}

function updateComponents(
  surfaceId: string,
  components: A2UIComponent[],
): A2UIOperation {
  return {
    version: "v0.9",
    updateComponents: {
      surfaceId,
      components,
    },
  };
}

function renderA2UI(operations: A2UIOperation[]) {
  return JSON.stringify({
    [A2UI_OPERATIONS_KEY]: operations,
  });
}

const optionSchema = z.object({
  id: z.string().describe("Stable business id for this option."),
  label: z.string().describe("Short visible label."),
  description: z.string().optional().describe("Optional one-sentence helper text."),
});

export const presentChoices = tool(
  ({ question, options, mode, description, submitLabel }) => {
    const surfaceId = `decision-${randomUUID().replace(/-/g, "").slice(0, 8)}`;
    const components: A2UIComponent[] = [
      {
        id: "root",
        component: "ChoicePrompt",
        question,
        description: description ?? "",
        mode,
        options: options as ChoiceOption[],
        submitLabel: submitLabel ?? "Submit",
        action: {
          event: {
            name: "business_choices_confirmed",
            context: {
              surfaceId,
            },
          },
        },
      },
    ];

    return renderA2UI([
      createSurface(surfaceId, CATALOG_ID),
      updateComponents(surfaceId, components),
    ]);
  },
  {
    name: "present_choices",
    description:
      "Ask the user to choose one or more options with A2UI. Use single mode for next-step decisions and multiple mode for preferences or action checklists.",
    schema: z.object({
      question: z.string().describe("Question shown to the user."),
      options: z.array(optionSchema).min(1).describe("Selectable options."),
      mode: z
        .enum(["single", "multiple"])
        .default("single")
        .describe("single renders radio buttons; multiple renders checkboxes."),
      description: z.string().optional().describe("Optional helper text."),
      submitLabel: z.string().optional().describe("Optional submit button label."),
    }),
  },
);
