'use client';

import { useState } from 'react';
import { Priority } from '@/lib/types';

interface Props {
  onAdd: (fields: { content: string; priority?: Priority; due_date?: string | null; category?: string; tags?: string[] }) => void;
  categories: string[];
}

export default function TaskInput({ onAdd, categories }: Props) {
  const [content, setContent] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(categories[0] || 'general');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAdd = () => {
    if (!content.trim()) return;
    onAdd({ content: content.trim(), priority, due_date: dueDate || null, category, tags });
    setContent(''); setDueDate(''); setTags([]); setTagInput('');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  return (
    <div className="apple-card p-4 mb-5">
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="New task..."
          className="apple-input flex-1 text-base"
        />
        <button
          onClick={() => setShowAdvanced(s => !s)}
          className="w-11 h-11 rounded-full flex items-center justify-center text-base transition-all active:scale-90"
          style={{ background: showAdvanced ? 'var(--color-apple-blue, #007AFF)' : 'var(--fill-secondary)', color: showAdvanced ? '#fff' : 'var(--text-secondary)' }}
        >
          ⚙️
        </button>
        <button onClick={handleAdd} className="apple-btn-primary px-5 text-base">
          Add
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-3 pt-3 space-y-3 animate-apple-up" style={{ borderTop: '0.5px solid var(--separator)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="section-header">Priority</label>
              <div className="flex gap-2 mt-1">
                {(['low', 'medium', 'high'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className="flex-1 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: priority === p ? 'var(--color-apple-blue, #007AFF)' : 'var(--fill-tertiary)',
                      color: priority === p ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {{ low: '🟢 Low', medium: '🟡 Med', high: '🔴 High' }[p]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="section-header">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="apple-input text-sm mt-1" />
            </div>
            <div>
              <label className="section-header">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="apple-input text-sm mt-1">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="section-header">Tags</label>
            <div className="flex gap-2 mt-1">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag..." className="apple-input text-sm flex-1" />
              <button onClick={addTag} className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ background: 'var(--fill-secondary)', color: 'var(--color-apple-blue, #007AFF)' }}>+</button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(0,122,255,0.12)', color: 'var(--color-apple-blue, #007AFF)' }}>
                    #{t}
                    <button onClick={() => setTags(tags.filter(x => x !== t))} className="ml-1 opacity-60 hover:opacity-100">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
