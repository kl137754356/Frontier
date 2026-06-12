import {
  useConfigureSuggestions,
  useDefaultRenderTool,
} from "@copilotkit/react-core/v2";

const hiddenA2UITools = new Set([
  "present_choices",
  "log_a2ui_event",
  "render_a2ui",
]);

export function useA2UIPrototype() {
  useConfigureSuggestions({
    suggestions: [
      {
        title: "Ask preferences",
        message:
          "Ask me which support workflow preferences matter most. Let me select multiple options.",
      },
      {
        title: "Pick next step",
        message:
          "Ask me what the next step should be for a customer renewal. Let me select one option.",
      },
    ],
    available: "always",
  });

  useDefaultRenderTool({
    render: ({ name }) => {
      if (hiddenA2UITools.has(name)) return <></>;
      return <></>;
    },
  });
}
