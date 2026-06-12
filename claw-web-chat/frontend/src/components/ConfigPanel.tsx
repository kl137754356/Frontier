import { useState, useCallback, useMemo } from 'react';
import { useChatStore } from '../store/chat-store';
import { sendConnectConfig } from '../services/ws-client';
import type { ConfigProfile } from '@shared/types';

const PRESET_MODELS = [
  'sonnet',
  'opus',
  'haiku',
  'anthropic/claude-sonnet-4-20250514',
  'anthropic/claude-opus-4-6',
  'anthropic/claude-opus-4-7',
  'openai/deepseek-chat',
  'openai/deepseek-v4-flash',
];

interface ConfigPanelProps {
  onClose: () => void;
}

export function ConfigPanel({ onClose }: ConfigPanelProps) {
  const config = useChatStore((s) => s.config);
  const updateConfig = useChatStore((s) => s.updateConfig);
  const addProfile = useChatStore((s) => s.addProfile);
  const connectionStatus = useChatStore((s) => s.connectionStatus);
  const currentModel = useChatStore((s) => s.currentModel);

  const activeProfile = useMemo(
    () => config.profiles.find((p) => p.id === config.activeProfile) ?? config.profiles[0],
    [config.profiles, config.activeProfile]
  );

  const [apiKey, setApiKey] = useState(activeProfile?.apiKey ?? '');
  const [baseUrl, setBaseUrl] = useState(activeProfile?.baseUrl ?? '');
  const [model, setModel] = useState(activeProfile?.model ?? PRESET_MODELS[0]);
  const [customModel, setCustomModel] = useState(
    activeProfile && !PRESET_MODELS.includes(activeProfile.model) ? activeProfile.model : ''
  );
  const [useCustomModel, setUseCustomModel] = useState(
    activeProfile ? !PRESET_MODELS.includes(activeProfile.model) : false
  );
  const [showAdvanced, setShowAdvanced] = useState(!!activeProfile?.baseUrl);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveModel = useCustomModel ? customModel : model;

  // Load a saved profile into the form
  const loadProfile = (profile: ConfigProfile) => {
    setApiKey(profile.apiKey ?? '');
    setBaseUrl(profile.baseUrl ?? '');
    const isCustom = !PRESET_MODELS.includes(profile.model);
    setUseCustomModel(isCustom);
    if (isCustom) {
      setCustomModel(profile.model);
    } else {
      setModel(profile.model);
    }
    setShowAdvanced(!!profile.baseUrl);
    updateConfig({ activeProfile: profile.id });
  };

  const handleConnect = useCallback(() => {
    if (!apiKey.trim() || !effectiveModel.trim()) return;

    setStatus('connecting');
    setErrorMsg('');

    // Save or update profile
    const existingIdx = config.profiles.findIndex(
      (p) => p.model === effectiveModel && p.baseUrl === (baseUrl || '')
    );
    if (existingIdx >= 0) {
      // Update existing profile
      const updatedProfiles = config.profiles.map((p, i) =>
        i === existingIdx ? { ...p, apiKey, baseUrl: baseUrl || '', model: effectiveModel } : p
      );
      updateConfig({ profiles: updatedProfiles, activeProfile: updatedProfiles[existingIdx].id });
    } else {
      // Create new profile
      const newProfile: ConfigProfile = {
        id: crypto.randomUUID(),
        name: effectiveModel,
        baseUrl: baseUrl || '',
        clawHost: '127.0.0.1',
        clawPort: 9527,
        model: effectiveModel,
        apiKey,
      };
      addProfile(newProfile);
      updateConfig({ activeProfile: newProfile.id });
    }

    // Send connect_config to backend
    sendConnectConfig({
      baseUrl: baseUrl || '',
      clawHost: '127.0.0.1',
      clawPort: 9527,
      model: effectiveModel,
      apiKey,
    });

    const checkInterval = setInterval(() => {
      if (useChatStore.getState().connectionStatus === 'connected') {
        clearInterval(checkInterval);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 500);
    setTimeout(() => {
      clearInterval(checkInterval);
      if (useChatStore.getState().connectionStatus !== 'connected') {
        setStatus('error');
        setErrorMsg('Connection timeout. Check API key and base URL.');
      }
    }, 10000);
  }, [apiKey, baseUrl, effectiveModel, config, updateConfig, addProfile]);

  // Delete a saved profile
  const deleteProfile = useCallback((id: string) => {
    const remaining = config.profiles.filter((p) => p.id !== id);
    if (remaining.length === 0) return;
    updateConfig({ profiles: remaining, activeProfile: remaining[0].id });
  }, [config.profiles, updateConfig]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Current status */}
        {connectionStatus === 'connected' && currentModel && (
          <div className="mb-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-xs text-green-700 dark:text-green-300">
            Connected - Model: {currentModel}
          </div>
        )}

        {/* Saved profiles - dropdown */}
        {config.profiles.length > 1 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Saved Configurations</label>
            <select
              value={config.activeProfile}
              onChange={(e) => {
                const p = config.profiles.find((pr) => pr.id === e.target.value);
                if (p) loadProfile(p);
              }}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 outline-none focus:border-blue-500"
            >
              {config.profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.model}{p.baseUrl ? ` - ${new URL(p.baseUrl).host}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* API Key */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key <span className="text-red-500">*</span></label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>

        {/* Model */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model <span className="text-red-500">*</span></label>
          {!useCustomModel ? (
            <div className="flex items-center gap-2">
              <select value={model} onChange={(e) => setModel(e.target.value)} className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 outline-none focus:border-blue-500">
                {PRESET_MODELS.map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
              <button onClick={() => setUseCustomModel(true)} className="text-xs text-blue-500 hover:text-blue-600 whitespace-nowrap">Custom</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input type="text" value={customModel} onChange={(e) => setCustomModel(e.target.value)} placeholder="e.g. openai/gpt-4o" className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 outline-none focus:border-blue-500" />
              <button onClick={() => { setUseCustomModel(false); setCustomModel(''); }} className="text-xs text-blue-500 hover:text-blue-600 whitespace-nowrap">Preset</button>
            </div>
          )}
        </div>

        {/* Base URL */}
        <div className="mb-4">
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2">
            {showAdvanced ? '\u25BC' : '\u25B6'} Base URL
          </button>
          {showAdvanced && (
            <input type="text" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.anthropic.com (leave empty for official)" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 outline-none focus:border-blue-500" />
          )}
        </div>

        {/* Error */}
        {status === 'error' && (
          <div className="mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400">{errorMsg}</div>
        )}

        {/* Connect button */}
        <button onClick={handleConnect} disabled={!apiKey.trim() || !effectiveModel.trim() || status === 'connecting'}
          className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors disabled:cursor-not-allowed ${status === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white'}`}>
          {status === 'connecting' ? 'Connecting...' : status === 'success' ? 'Connected!' : connectionStatus === 'connected' ? 'Reconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
}