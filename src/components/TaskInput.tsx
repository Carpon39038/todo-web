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
          placeholder="New Reminder..." className="a-input flex-1" />
        <button onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[15px] transition-transform active:scale-90"
          style={{ background: open ? 'var(--color-apple-blue)' : 'var(--fill3)', color: open ? '#fff' : 'var(--text2)' }}>⋯</button>
        <button onClick={handleAdd} className="a-btn-blue">Add</button>
      </div>

      {open && (
        <div className="mt-3 p-4 rounded-xl space-y-3 anim-fade" style={{ background: 'var(--bg-card)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="a-label !p-0 mb-1.5">Priority</div>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className="flex-1 py-1.5 rounded-lg text-[13px] font-semibold transition-all"
                    style={{
                      background: priority === p ? 'var(--color-apple-blue)' : 'var(--fill3)',
                      color: priority === p ? '#fff' : 'var(--text2)',
                    }}>
                    {{ low: '🟢', medium: '🟡', high: '🔴' }[p]} {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="a-label !p-0 mb-1.5">Due Date</div>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="a-input !py-2 !text-[15px]" />
            </div>
            <div>
              <div className="a-label !p-0 mb-1.5">Category</div>
              <select value={category} onChange={e => setCategory(e.target.value)} className="a-input !py-2 !text-[15px]">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="a-label !p-0 mb-1.5">Tags</div>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag..." className="a-input !py-2 !text-[15px] flex-1" />
              <button onClick={addTag} className="a-btn-gray !px-3 !h-[36px] text-[15px]">+</button>
            </div>
            {tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[13px] font-medium"
                    style={{ background: 'rgba(0,122,255,0.1)', color: 'var(--color-apple-blue)' }}>
                    #{t}
                    <button onClick={() => setTags(tags.filter(x => x !== t))} className="opacity-50 hover:opacity-100">×</button>
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
