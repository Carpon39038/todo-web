'use client';

import { useState, useEffect } from 'react';

const API_KEY_STORAGE = 'todo-api-key';

export function getApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function useApiKeyGuard() {
  const [apiKey, setLocalApiKey] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (!stored) {
      setShowPrompt(true);
    } else {
      setLocalApiKey(stored);
    }
  }, []);

  const save = (key: string) => {
    if (!key.trim()) return;
    localStorage.setItem(API_KEY_STORAGE, key.trim());
    setLocalApiKey(key.trim());
    setShowPrompt(false);
  };

  return { apiKey, showPrompt, save };
}
