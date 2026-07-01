import React from 'react';

export interface AgentDef {
  agent_id: string;
  name: string;
  description?: string;
}

interface AgentSelectorProps {
  agents: AgentDef[];
  activeAgentId: string | null | undefined;
  onSelect: (id: string | null) => void;
  onCreateClick?: () => void;
}

export function AgentSelector({ agents, activeAgentId, onSelect, onCreateClick }: AgentSelectorProps) {
  return (
    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
      {/* Default (no agent) option */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
          !activeAgentId
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        Default (no agent)
      </button>

      {agents.map((agent) => (
        <button
          key={agent.agent_id}
          onClick={() => onSelect(agent.agent_id)}
          className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
            activeAgentId === agent.agent_id
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <div className="font-medium">{agent.name}</div>
          {agent.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{agent.description}</div>
          )}
        </button>
      ))}

      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="w-full text-left px-2 py-1.5 rounded text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-t border-gray-100 dark:border-gray-700 mt-1 pt-1.5"
        >
          + 新建 Agent
        </button>
      )}
    </div>
  );
}
