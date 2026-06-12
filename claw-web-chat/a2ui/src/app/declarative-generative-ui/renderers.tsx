"use client";

import { useMemo, useState } from "react";
import { createCatalog } from "@copilotkit/a2ui-renderer";
import type { CatalogRenderers } from "@copilotkit/a2ui-renderer";
import {
  decisionCatalogDefinitions,
  type DecisionCatalogDefinitions,
} from "./definitions";

type A2UIAction = {
  event?: {
    name?: string;
    context?: Record<string, unknown>;
  };
};

const decisionCatalogRenderers: CatalogRenderers<DecisionCatalogDefinitions> = {
  ChoicePrompt: ({ props, dispatch }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const isSingle = props.mode === "single";

    const selectedOptions = useMemo(
      () => props.options.filter((option) => selectedIds.includes(option.id)),
      [props.options, selectedIds],
    );

    const toggleOption = (optionId: string) => {
      if (submitted) return;

      setSubmitted(false);
      if (isSingle) {
        setSelectedIds([optionId]);
        return;
      }
      setSelectedIds((current) =>
        current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      );
    };

    const submit = async () => {
      if (selectedOptions.length === 0 || !dispatch) return;

      const action = props.action as A2UIAction | undefined;
      await dispatch({
        event: {
          name: action?.event?.name ?? "business_choices_confirmed",
          context: {
            ...(action?.event?.context ?? {}),
            mode: props.mode,
            selectedIds,
            selectedOptions,
          },
        },
      });
      setSubmitted(true);
    };

    return (
      <section className="w-full max-w-2xl rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[var(--card-foreground)]">
            {props.question}
          </h2>
          {props.description ? (
            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
              {props.description}
            </p>
          ) : null}
        </div>

        <fieldset
          className={[
            "grid gap-2",
            submitted ? "pointer-events-none opacity-70" : "",
          ].join(" ")}
          disabled={submitted}
          aria-disabled={submitted}
        >
          <legend className="sr-only">{props.question}</legend>
          {props.options.map((option) => {
            const checked = selectedIds.includes(option.id);
            return (
              <label
                key={option.id}
                className={[
                  "flex gap-3 rounded-md border p-3 transition",
                  submitted ? "cursor-not-allowed" : "cursor-pointer",
                  checked
                    ? "border-[var(--ring)] bg-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--background)]",
                ].join(" ")}
              >
                <input
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                  type={isSingle ? "radio" : "checkbox"}
                  name={`choice-${props.question}`}
                  checked={checked}
                  disabled={submitted}
                  onChange={() => toggleOption(option.id)}
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--foreground)]">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-1 block text-sm leading-5 text-[var(--muted-foreground)]">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="mt-4 flex items-center gap-3">
          <button
            className="h-10 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={selectedOptions.length === 0 || submitted}
            onClick={submit}
          >
            {submitted ? "Sent" : (props.submitLabel ?? "Submit")}
          </button>
          {submitted ? (
            <span className="text-sm text-[var(--muted-foreground)]">
              Choice sent.
            </span>
          ) : null}
        </div>
      </section>
    );
  },
};

export const decisionCatalog = createCatalog(
  decisionCatalogDefinitions,
  decisionCatalogRenderers,
  {
    catalogId: "copilotkit://decision-catalog",
  },
);
