'use client';

import { useState } from 'react';

interface Props {
  onSave: (key: string) => void;
}

export default function ApiKeyPrompt({ onSave }: Props) {
  const [key, setKey] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm p-6 rounded-[20px] animate-apple-scale" style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-elevated)' }}>
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🔑</div>
          <h2 className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>API Key Required</h2>
          <p className="text-[15px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            Enter your API key to use this app. It will be stored locally in your browser.
          </p>
        </div>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && key.trim()) onSave(key); }}
          placeholder="Enter API key..."
          className="apple-input text-center mb-4"
          autoFocus
        />
        <button
          onClick={() => key.trim() && onSave(key)}
          className="apple-btn-primary w-full py-3 text-[17px]"
          disabled={!key.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
