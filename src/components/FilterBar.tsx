'use client';

import { Task, TaskStatus, Priority } from '@/lib/types';

interface Props {
  status: TaskStatus | 'all';
  onStatusChange: (s: TaskStatus | 'all') => void;
  category: string;
  onCategoryChange: (c: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (p: Priority | 'all') => void;
  categories: string[];
}

const tabs: { key: TaskStatus | 'all'; label: string }[] = [
  { key: 'todo', label: 'Active' },
  { key: 'done', label: 'Completed' },
  { key: 'all', label: 'All' },
];

export default function FilterBar({ status, onStatusChange, category, onCategoryChange, priorityFilter, onPriorityChange, categories }: Props) {
  return (
    <div className="space-y-3 mb-5">
      {/* Tab bar - iOS segmented control style */}
      <div className="flex rounded-full p-[3px]" style={{ background: 'var(--fill-tertiary)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onStatusChange(t.key)}
            className="flex-1 py-2 rounded-full text-[15px] font-semibold transition-all"
            style={{
              background: status === t.key ? 'var(--bg-elevated)' : 'transparent',
              color: status === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: status === t.key ? 'var(--shadow-card)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <select
          value={category} onChange={e => onCategoryChange(e.target.value)}
          className="rounded-full text-[13px] font-medium px-3 py-1.5 border-none outline-none cursor-pointer"
          style={{ background: 'var(--fill-tertiary)', color: 'var(--text-secondary)' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1.5">
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => onPriorityChange(p === 'all' ? 'all' : p)}
              className="rounded-full text-[13px] font-medium px-3 py-1.5 transition-all whitespace-nowrap"
              style={{
                background: priorityFilter === p ? 'var(--color-apple-blue, #007AFF)' : 'var(--fill-tertiary)',
                color: priorityFilter === p ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {p === 'all' ? 'All' : p === 'high' ? '🔴 High' : p === 'medium' ? '🟡 Med' : '🟢 Low'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
