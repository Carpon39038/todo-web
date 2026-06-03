'use client';

import { useState } from 'react';
import { Priority } from '@/lib/types';

interface Props {
  onAdd: (fields: { content: string; priority?: Priority; due_date?: string | null; category?: string; tags?: string[] }) => void;
  categories: string[];
}

export default function TaskInput({ onAdd, categories }: Props) {
  const [content, setContent] = useState('');
  const [open, setOpen] = useState(false);
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
    <div className="mb-5">
      <div className="flex gap-2">
        <input type="text" value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="New Reminder..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-sm font-medium border-none outline-none focus:ring-2 focus:ring-apple-blue/30 transition-shadow" />
        <button onClick={() => setOpen(!open)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-colors ${
            open ? 'bg-apple-blue text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'
          }`}>
          ⋯
        </button>
        <button onClick={handleAdd}
          className="px-5 py-2 rounded-xl bg-apple-blue text-white text-sm font-semibold hover:opacity-85 active:opacity-70 transition-opacity">
          Add
        </button>
      </div>

      {open && (
        <div className="mt-3 p-4 rounded-xl bg-apple-card dark:bg-apple-card shadow-sm space-y-3 anim-fade">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Priority</p>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                      priority === p ? 'bg-apple-blue text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Due Date</p>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-sm border-none outline-none" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Category</p>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-sm border-none outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Tags</p>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag..." className="flex-1 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-sm border-none outline-none" />
              <button onClick={addTag} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-sm text-apple-blue font-medium">+</button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-md text-xs text-apple-blue bg-blue-50 dark:bg-blue-500/10">
                    #{t}
                    <button onClick={() => setTags(tags.filter(x => x !== t))} className="ml-1 opacity-50 hover:opacity-100">×</button>
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
