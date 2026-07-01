import { useState, useEffect, useCallback } from 'react';

interface A2AAgent {
  id: string;
  type: string;
  url: string;
  enabled: boolean;
}

interface A2AConfig {
  agents: A2AAgent[];
  options?: { connectTimeoutMs?: number; failFast?: boolean };
}

export function A2AAgentManager({ onClose }: { onClose: () => void }) {
  const [agents, setAgents] = useState<A2AAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newId, setNewId] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAgents = useCallback(async () => {
    try {
      const res = await fetch('/a2a-agents');
      if (res.ok) {
        const data: A2AConfig = await res.json();
        setAgents(data.agents || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAgents(); }, [loadAgents]);

  const handleAdd = async () => {
    if (!newId.trim() || !newUrl.trim()) {
      setError('请填写 Agent ID 和 URL');
      return;
    }
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/a2a-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId.trim(), url: newUrl.trim(), type: 'native' }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Agent "${newId}" 注册成功${data.agentCard ? `（${data.agentCard.name}）` : ''}，claw 已重启`);
        setNewId('');
        setNewUrl('');
        await loadAgents();
      } else {
        setError(data.error || '注册失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`确定删除 Agent "${id}"？`)) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/a2a-agents?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Agent "${id}" 已删除，claw 已重启`);
        await loadAgents();
      } else {
        const data = await res.json();
        setError(data.error || '删除失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">A2A Agent 管理</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Status messages */}
          {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-3 py-2">{error}</div>}
          {success && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg px-3 py-2">{success}</div>}

          {/* Agent list */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">已注册的 Agent</h3>
            {loading ? (
              <p className="text-gray-400 text-sm">加载中...</p>
            ) : agents.length === 0 ? (
              <p className="text-gray-400 text-sm">暂无已注册的 A2A Agent</p>
            ) : (
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${agent.enabled ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{agent.id}</span>
                        <span className="text-xs text-gray-400">{agent.type}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{agent.url}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="ml-2 text-red-400 hover:text-red-600 text-sm shrink-0"
                      title="删除"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add new agent */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">添加新 Agent</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="Agent ID（如: weather）"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Agent URL（如: http://localhost:4000）"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <button
                onClick={handleAdd}
                disabled={adding}
                className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white transition-colors"
              >
                {adding ? '注册中（验证 Agent Card + 重启 claw）...' : '➕ 注册 Agent'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              注册后会自动验证 Agent Card 并重启 AI 引擎，新 Agent 立即可用。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
