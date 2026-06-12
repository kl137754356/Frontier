import { z } from "zod";

const A2UIAction = z
  .object({
    event: z.object({
      name: z.string(),
      context: z.record(z.any()).optional(),
    }),
  })
  .optional();

const ChoiceOption = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export const decisionCatalogDefinitions = {
  ChoicePrompt: {
    description:
      "A compact question UI. Use radio buttons for single choice and checkboxes for multiple choice.",
    props: z.object({
      question: z.string(),
      description: z.string().optional(),
      mode: z.enum(["single", "multiple"]),
      options: z.array(ChoiceOption).min(1),
      submitLabel: z.string().optional(),
      action: A2UIAction,
    }),
  },
};

export type DecisionCatalogDefinitions = typeof decisionCatalogDefinitions;
