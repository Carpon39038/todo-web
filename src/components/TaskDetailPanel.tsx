'use client';

import { useState, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const priorities: { value: Priority; label: string; icon: string }[] = [
  { value: 'low', label: 'Low', icon: '🟢' },
  { value: 'medium', label: 'Medium', icon: '🟡' },
  { value: 'high', label: 'High', icon: '🔴' },
];

export default function TaskDetailPanel({ task, onClose, onUpdate, onDelete }: Props) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('general');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (task) {
      setContent(task.content);
      setPriority(task.priority);
      setDueDate(task.due_date?.split('T')[0] || '');
      setCategory(task.category);
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    onUpdate(task.id, { content, priority, due_date: dueDate || null, category });
    onClose();
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !task.tags.includes(t)) {
      onUpdate(task.id, { tags: [...task.tags, t] });
    }
    setTagInput('');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md p-6 animate-slideDown" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Task Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500">✕</button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border resize-none text-sm" rows={3}
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Priority</label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${priority === p.value ? 'border-current shadow-sm' : ''}`}
                  style={{
                    background: priority === p.value ? 'var(--bg-input)' : 'transparent',
                    borderColor: priority === p.value ? 'var(--border)' : 'var(--border-light)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-sm"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {task.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs flex items-center gap-1.5">
                  #{t}
                  <button onClick={() => onUpdate(task.id, { tags: task.tags.filter(x => x !== t) })} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 rounded-lg border text-sm"
                style={{ background: 'var(--bg-input)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button onClick={handleAddTag} className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>+</button>
            </div>
          </div>

          <div className="pt-3 border-t flex gap-3" style={{ borderColor: 'var(--border)' }}>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors">Save</button>
            <button onClick={() => { onDelete(task.id); onClose(); }} className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Delete</button>
          </div>

          <div className="pt-3 text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
            <p>Created: {new Date(task.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
            <p>Source: {task.source}</p>
          </div>
        </div>
      </div>
    </>
  );
}
