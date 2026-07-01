import { useState, useEffect } from 'react';

interface A2AAgent {
  id: string;
  type: string;
  url: string;
  enabled: boolean;
}

interface Props {
  selectedId: string | null;
  onSelect: (id: string, name: string) => void;
}

export function A2AAgentList({ selectedId, onSelect }: Props) {
  const [agents, setAgents] = useState<A2AAgent[]>([]);

  useEffect(() => {
    fetch('/a2a-agents')
      .then(r => r.ok ? r.json() : { agents: [] })
      .then(data => setAgents(data.agents || []))
      .catch(() => {});
  }, []);

  if (agents.length === 0) return null;

  return (
    <div className="mt-1">
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 px-2">A2A 远程 Agent（直连）</div>
      {agents.filter(a => a.enabled).map(agent => (
        <button
          key={agent.id}
          onClick={() => onSelect(agent.id, agent.id)}
          className={`w-full text-left px-2 py-1.5 rounded text-xs mb-0.5 flex items-center justify-between ${
            selectedId === agent.id
              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-purple-400">⚡</span>
            {agent.id}
          </span>
          {selectedId === agent.id && <span className="text-purple-400">✓</span>}
        </button>
      ))}
    </div>
  );
}
