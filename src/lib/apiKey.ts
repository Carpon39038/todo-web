'use client';

import { useState } from 'react';

const API_KEY_STORAGE = 'todo-api-key';

export function getApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function useApiKeyGuard() {
  const [apiKey, setLocalApiKey] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(API_KEY_STORAGE) || '';
  });
  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem(API_KEY_STORAGE);
  });

  const save = (key: string) => {
    if (!key.trim()) return;
    localStorage.setItem(API_KEY_STORAGE, key.trim());
    setLocalApiKey(key.trim());
    setShowPrompt(false);
  };

  return { apiKey, showPrompt, save };
}
