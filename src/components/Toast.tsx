'use client';

import { useState, useCallback, useRef } from 'react';

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const icons: Record<string, string> = { success: '✅', error: '❌', info: 'ℹ️' };

export function useToastManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, 2500);
  }, []);

  return { toasts, addToast };
}

export default function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.exiting ? 'toast-exit' : ''}`}>
          {icons[t.type]} {t.message}
        </div>
      ))}
    </div>
  );
}
