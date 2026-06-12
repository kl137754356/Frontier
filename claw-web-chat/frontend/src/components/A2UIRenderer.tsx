import { A2UIChoicePrompt } from './A2UIChoicePrompt';
import type { MessageContent } from '@shared/types';

interface A2UIRendererProps {
  content: MessageContent[];
}

/**
 * Renders A2UI content blocks from a message.
 * Parses a2ui_operations and renders the appropriate component (ChoicePrompt).
 */
export function A2UIRenderer({ content }: A2UIRendererProps) {
  const a2uiBlocks = content.filter((c) => c.type === 'a2ui') as Array<{ type: 'a2ui'; operations: any[] }>;

  if (a2uiBlocks.length === 0) return null;

  const allComponents: Array<{ key: string; comp: any }> = [];
  a2uiBlocks.forEach((block, blockIdx) => {
    const components = extractComponents(block.operations);
    components.forEach((comp, compIdx) => {
      allComponents.push({ key: `${blockIdx}-${compIdx}`, comp });
    });
  });

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-3">
        {allComponents.map(({ key, comp }) => renderA2UIComponent(key, comp))}
      </div>
    </div>
  );
}

function extractComponents(operations: any[]): any[] {
  const components: any[] = [];
  for (const op of operations) {
    if (op.updateComponents && Array.isArray(op.updateComponents.components)) {
      components.push(...op.updateComponents.components);
    }
  }
  return components;
}

function renderA2UIComponent(key: string, component: any) {
  switch (component.component) {
    case 'ChoicePrompt':
      return (
        <A2UIChoicePrompt
          key={key}
          question={component.question}
          description={component.description}
          mode={component.mode}
          options={component.options}
          submitLabel={component.submitLabel}
          action={component.action}
        />
      );
    default:
      return (
        <div key={key} className="text-sm text-gray-500 dark:text-gray-400 italic">
          Unknown A2UI component: {component.component}
        </div>
      );
  }
}
