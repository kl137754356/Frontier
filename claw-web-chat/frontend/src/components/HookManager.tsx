import { useState, useEffect, useCallback } from 'react';

interface HookDefinition {
  id: string;
  name: string;
  description?: string;
  event: string;
  eventConfig: { pattern?: string };
  action: string;
  actionConfig: { prompt?: string; command?: string };
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

interface HookInput {
  name: string;
  description?: string;
  event: string;
  eventConfig?: { pattern?: string };
  action: string;
  actionConfig: { prompt?: string; command?: string };
}

const EVENT_OPTIONS = [
  { value: 'prompt-submit', label: '发送消息前' },
  { value: 'run-complete', label: 'AI 回复完成' },
  { value: 'run-error', label: 'AI 回复出错' },
  { value: 'tool-error', label: '工具调用出错' },
  { value: 'app-start', label: '应用启动' },
];

const ACTION_OPTIONS = [
  { value: 'send-prompt', label: '发送 Prompt' },
  { value: 'run-command', label: '执行命令' },
];

export function HookManager({ onClose }: { onClose: () => void }) {
  const [hooks, setHooks] = useState<HookDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedHook, setSelectedHook] = useState<HookDefinition | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state (used for both create and edit)
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formEvent, setFormEvent] = useState('run-complete');
  const [formPattern, setFormPattern] = useState('');
  const [formAction, setFormAction] = useState('send-prompt');
  const [formPrompt, setFormPrompt] = useState('');
  const [formCommand, setFormCommand] = useState('');

  const loadHooks = useCallback(async () => {
    try {
      const res = await fetch('/hooks');
      if (res.ok) {
        const data = await res.json();
        setHooks(data.hooks || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHooks(); }, [loadHooks]);

  // When a hook is selected, populate form with its data for inline editing
  useEffect(() => {
    if (selectedHook) {
      setFormName(selectedHook.name);
      setFormDescription(selectedHook.description || '');
      setFormEvent(selectedHook.event);
      setFormPattern(selectedHook.eventConfig?.pattern || '');
      setFormAction(selectedHook.action);
      setFormPrompt(selectedHook.actionConfig?.prompt || '');
      setFormCommand(selectedHook.actionConfig?.command || '');
    }
  }, [selectedHook]);

  const resetForm = () => {
    setFormName(''); setFormDescription(''); setFormEvent('run-complete');
    setFormPattern(''); setFormAction('send-prompt'); setFormPrompt(''); setFormCommand('');
  };

  const openCreateForm = () => {
    setSelectedHook(null);
    resetForm();
    setShowCreateForm(true);
  };

  const handleCreate = async () => {
    setError(''); setSuccess('');
    const input: HookInput = {
      name: formName,
      description: formDescription || undefined,
      event: formEvent,
      eventConfig: formPattern ? { pattern: formPattern } : {},
      action: formAction,
      actionConfig: formAction === 'send-prompt' ? { prompt: formPrompt } : { command: formCommand },
    };
    try {
      const res = await fetch('/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Hook "${formName}" 已创建`);
        setShowCreateForm(false);
        resetForm();
        await loadHooks();
      } else {
        setError(data.error?.message || '创建失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const handleUpdate = async () => {
    if (!selectedHook) return;
    setError(''); setSuccess('');
    const input: HookInput = {
      name: formName,
      description: formDescription || undefined,
      event: formEvent,
      eventConfig: formPattern ? { pattern: formPattern } : {},
      action: formAction,
      actionConfig: formAction === 'send-prompt' ? { prompt: formPrompt } : { command: formCommand },
    };
    try {
      const res = await fetch(`/hooks/${selectedHook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Hook "${formName}" 已更新，立即生效`);
        setSelectedHook(data.hook);
        await loadHooks();
      } else {
        setError(data.error?.message || '更新失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const handleToggle = async (hook: HookDefinition, e?: any) => {
    e?.stopPropagation();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`/hooks/${hook.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !hook.enabled }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(`Hook "${hook.name}" 已${hook.enabled ? '禁用' : '启用'}`);
        if (selectedHook?.id === hook.id) setSelectedHook(data.hook);
        await loadHooks();
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const handleTrigger = async (hook: HookDefinition, e?: any) => {
    e?.stopPropagation();
    setError(''); setSuccess('');
    try {
      const res = await fetch(`/hooks/${hook.id}/trigger`, { method: 'POST' });
      if (res.ok) {
        setSuccess(`Hook "${hook.name}" 已手动触发`);
      } else {
        setError('触发失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const handleDelete = async () => {
    if (!selectedHook) return;
    if (!confirm(`确定删除 Hook "${selectedHook.name}"？此操作无法撤销。`)) return;
    setError(''); setSuccess('');
    try {
      const res = await fetch(`/hooks/${selectedHook.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess(`Hook "${selectedHook.name}" 已删除`);
        setSelectedHook(null);
        await loadHooks();
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    }
  };

  const getEventLabel = (event: string) => EVENT_OPTIONS.find(o => o.value === event)?.label || event;
  const getActionLabel = (action: string) => ACTION_OPTIONS.find(o => o.value === action)?.label || action;

  // --- Render: Form fields (shared between create and edit) ---
  const renderFormFields = () => (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">名称</label>
        <input type="text" placeholder="Hook 名称（必填）" value={formName}
          onChange={e => setFormName(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">描述</label>
        <input type="text" placeholder="描述（可选）" value={formDescription}
          onChange={e => setFormDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">触发事件</label>
          <select value={formEvent} onChange={e => setFormEvent(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            {EVENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">动作类型</label>
          <select value={formAction} onChange={e => setFormAction(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      {formEvent === 'prompt-submit' && (
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">文件/关键词模式（正则）</label>
          <input type="text" placeholder="如 .*部署.* 或 .*\.tsx$" value={formPattern}
            onChange={e => setFormPattern(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
      )}
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
          {formAction === 'send-prompt' ? '指令 / Prompt' : 'Shell 命令'}
        </label>
        {formAction === 'send-prompt' ? (
          <textarea placeholder="要发送给 AI 的指令" value={formPrompt}
            onChange={e => setFormPrompt(e.target.value)} rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
        ) : (
          <input type="text" placeholder="如 npm run lint" value={formCommand}
            onChange={e => setFormCommand(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🪝 Agent Hooks</h2>
          <div className="flex items-center gap-2">
            <button onClick={openCreateForm}
              className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              + 新建 Hook
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">&times;</button>
          </div>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div className="px-5 pt-3">
            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg px-3 py-2">{error}</div>}
            {success && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-lg px-3 py-2">{success}</div>}
          </div>
        )}

        {/* Two-pane layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left pane: Hook list */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            {loading ? (
              <p className="text-gray-400 text-sm p-4">加载中...</p>
            ) : hooks.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-gray-400 text-sm">暂无 Hook</p>
                <p className="text-gray-400 text-xs mt-1">点击上方"新建"创建</p>
              </div>
            ) : (
              <div className="py-1">
                {hooks.map(hook => (
                  <div key={hook.id}
                    onClick={() => { setSelectedHook(hook); setShowCreateForm(false); }}
                    className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors ${
                      selectedHook?.id === hook.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent'
                    }`}>
                    {/* Eye icon toggle */}
                    <button onClick={(e) => handleToggle(hook, e)}
                      title={hook.enabled ? '已启用 — 点击禁用' : '已禁用 — 点击启用'}
                      className={`shrink-0 transition-colors ${hook.enabled ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                      {hook.enabled ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                    {/* Name */}
                    <span className={`text-sm flex-1 truncate ${hook.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                      {hook.name}
                    </span>
                    {/* Play button for manual trigger */}
                    <button onClick={(e) => handleTrigger(hook, e)}
                      title="手动运行此 Hook"
                      className="shrink-0 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right pane: Detail / Edit / Create */}
          <div className="flex-1 overflow-y-auto p-4">
            {showCreateForm ? (
              /* Create new hook form */
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">创建新 Hook</h3>
                {renderFormFields()}
                <div className="flex gap-2 mt-4">
                  <button onClick={handleCreate}
                    className="flex-1 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    创建
                  </button>
                  <button onClick={() => { setShowCreateForm(false); resetForm(); }}
                    className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    取消
                  </button>
                </div>
              </div>
            ) : selectedHook ? (
              /* Selected hook detail + inline edit */
              <div>
                {/* Top bar: enabled switch + trigger button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Hook Enabled</span>
                      <button onClick={() => handleToggle(selectedHook)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${selectedHook.enabled ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-500'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${selectedHook.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </label>
                  </div>
                  <button onClick={() => handleTrigger(selectedHook)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Start Hook
                  </button>
                </div>

                {/* Edit form fields */}
                {renderFormFields()}

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={handleDelete}
                    className="px-3 py-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                    Delete Hook
                  </button>
                  <button onClick={handleUpdate}
                    className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    保存修改
                  </button>
                </div>
              </div>
            ) : (
              /* No selection placeholder */
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                <div className="text-center">
                  <p>选择左侧的 Hook 查看详情并编辑</p>
                  <p className="text-xs mt-2">或点击"新建 Hook"创建自动化触发器</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            💡 眼睛图标：快速启用/禁用 · ▷ 播放按钮：手动触发 · 更新立即生效
          </p>
        </div>
      </div>
    </div>
  );
}
