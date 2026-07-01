import { useState, useEffect, useCallback } from 'react';

interface HeartbeatTask {
  id: string;
  prompt: string;
  intervalMs: number;
  lastRun: number | null;
  runCount: number;
  paused: boolean;
}

export function HeartbeatManager({ onClose }: { onClose: () => void }) {
  const [tasks, setTasks] = useState<HeartbeatTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch('/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list' }),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  // Auto-refresh every 5s
  useEffect(() => {
    const t = setInterval(loadTasks, 5000);
    return () => clearInterval(t);
  }, [loadTasks]);

  const handleToggle = async (id: string, paused: boolean) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch('/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: paused ? 'resume' : 'pause', id }),
      });
      if (res.ok) {
        setSuccess(`任务 "${id}" 已${paused ? '恢复' : '暂停'}`);
        await loadTasks();
      } else {
        setError('操作失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`确定删除心跳任务 "${id}"？`)) return;
    setError(''); setSuccess('');
    try {
      const res = await fetch('/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', id }),
      });
      if (res.ok) {
        setSuccess(`任务 "${id}" 已删除`);
        await loadTasks();
      } else {
        setError('删除失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('确定清除所有心跳任务？')) return;
    setError(''); setSuccess('');
    try {
      const res = await fetch('/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(`已清除 ${data.removed} 个任务`);
        await loadTasks();
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const formatInterval = (ms: number) => {
    const s = ms / 1000;
    if (s < 60) return `${s}秒`;
    if (s < 3600) return `${Math.round(s / 60)}分钟`;
    return `${(s / 3600).toFixed(1)}小时`;
  };

  const formatTime = (ts: number | null) => {
    if (!ts) return '未执行';
    return new Date(ts).toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">💓 心跳任务管理</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-3 py-2">{error}</div>}
          {success && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg px-3 py-2">{success}</div>}

          {/* Task list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">当前任务</h3>
              {tasks.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >清除全部</button>
              )}
            </div>
            {loading ? (
              <p className="text-gray-400 text-sm">加载中...</p>
            ) : tasks.length === 0 ? (
              <p className="text-gray-400 text-sm">暂无心跳任务。通过聊天发送自然语言即可添加，例如："每30秒检查一下系统状态"</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${task.paused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`}></span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {/* Toggle pause/resume */}
                        <button
                          onClick={() => handleToggle(task.id, task.paused)}
                          className={`px-2 py-1 text-xs rounded ${task.paused
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200'
                          } transition-colors`}
                          title={task.paused ? '恢复' : '暂停'}
                        >
                          {task.paused ? '▶ 恢复' : '⏸ 暂停'}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:text-red-400 transition-colors"
                          title="删除"
                        >✕</button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{task.prompt}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>间隔: {formatInterval(task.intervalMs)}</span>
                      <span>执行: {task.runCount}次</span>
                      <span>最近: {formatTime(task.lastRun)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage hint */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <p className="text-xs text-gray-400">
              💡 添加心跳任务：在聊天中用自然语言描述，例如 "每60秒检查一下 xxx 服务是否正常"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
