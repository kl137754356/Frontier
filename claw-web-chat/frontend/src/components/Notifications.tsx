import { useState, useEffect, useCallback } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // ms, default 4000
}

// Global notification state (simple pub/sub)
type Listener = (toasts: Toast[]) => void;
let toasts: Toast[] = [];
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

/**
 * Show a toast notification.
 */
export function showToast(message: string, type: Toast['type'] = 'info', duration = 4000): void {
  const toast: Toast = { id: crypto.randomUUID(), message, type, duration };
  toasts = [...toasts, toast];
  notify();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast.id);
    }, duration);
  }
}

/**
 * Dismiss a toast by ID.
 */
export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

/**
 * Notifications container component. Renders toast messages.
 * Place this once at the app root level.
 */
export function Notifications() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => setActiveToasts(t);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const handleDismiss = useCallback((id: string) => {
    dismissToast(id);
  }, []);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" aria-live="polite">
      {activeToasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-2 px-4 py-3 rounded-lg shadow-lg text-ui animate-slide-in
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-500 text-gray-900' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
          `}
          role="alert"
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => handleDismiss(toast.id)}
            className="shrink-0 opacity-70 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
