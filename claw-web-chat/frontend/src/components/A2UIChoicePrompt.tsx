import { useMemo, useState } from 'react';

interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
}

interface ChoicePromptProps {
  question: string;
  description?: string;
  mode: 'single' | 'multiple';
  options: ChoiceOption[];
  submitLabel?: string;
  action?: {
    event?: {
      name?: string;
      context?: Record<string, unknown>;
    };
  };
}

export function A2UIChoicePrompt({ question, description, mode, options, submitLabel, action }: ChoicePromptProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const isSingle = mode === 'single';

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedIds.includes(option.id)),
    [options, selectedIds],
  );

  const toggleOption = (optionId: string) => {
    if (submitted) return;
    if (isSingle) {
      setSelectedIds([optionId]);
      return;
    }
    setSelectedIds((current: string[]) =>
      current.includes(optionId)
        ? current.filter((id: string) => id !== optionId)
        : [...current, optionId],
    );
  };

  const submit = async () => {
    if (selectedOptions.length === 0) return;

    const eventName = action?.event?.name ?? 'business_choices_confirmed';
    const eventContext = {
      ...(action?.event?.context ?? {}),
      mode,
      selectedIds,
      selectedOptions,
    };

    setSubmitted(true);

    // Determine if this is a [Question] response (opt_N ids) or a generic choice
    const isQuestionResponse = selectedIds.some((id: string) => /^opt_\d+$/.test(id));

    if (isQuestionResponse) {
      // Question response — send via /a2ui-event (routes to stdin)
      const { sendA2UIEvent } = await import('../services/agui-client');
      await sendA2UIEvent({ event: { name: eventName, context: eventContext } });
    } else {
      // Generic choice (fallback A2UI) — send as new prompt via /agent to get SSE response
      const { useChatStore } = await import('../store/chat-store');
      const { sendPrompt } = await import('../services/agui-client');
      const store = useChatStore.getState();
      const sessionId = store.activeSessionId;
      if (sessionId) {
        store.startStreaming(sessionId);
        sendPrompt(`[A2UI Event] ${eventName}: ${JSON.stringify(eventContext)}`, sessionId);
      }
    }
  };

  return (
    <section className="w-full max-w-2xl rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {question}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      <fieldset
        className={`grid gap-2 ${submitted ? 'pointer-events-none opacity-70' : ''}`}
        disabled={submitted}
        aria-disabled={submitted}
      >
        <legend className="sr-only">{question}</legend>
        {options.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <label
              key={option.id}
              className={`flex gap-3 rounded-md border p-3 transition cursor-pointer
                ${submitted ? 'cursor-not-allowed' : ''}
                ${checked
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <input
                className="mt-1 h-4 w-4 shrink-0 accent-blue-500"
                type={isSingle ? 'radio' : 'checkbox'}
                name={`choice-${question}`}
                checked={checked}
                disabled={submitted}
                onChange={() => toggleOption(option.id)}
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {option.label}
                </span>
                {option.description && (
                  <span className="mt-1 block text-sm leading-5 text-gray-500 dark:text-gray-400">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-4 flex items-center gap-3">
        <button
          className="h-10 rounded-md bg-blue-500 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-600 transition-colors"
          disabled={selectedOptions.length === 0 || submitted}
          onClick={submit}
        >
          {submitted ? 'Sent' : (submitLabel ?? 'Submit')}
        </button>
        {submitted && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Choice sent.
          </span>
        )}
      </div>
    </section>
  );
}
