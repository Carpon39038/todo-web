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
    <div className="mb-5">
      {/* Segmented control */}
      <div className="a-seg mb-3">
        {tabs.map(t => (
          <button key={t.key} onClick={() => onStatusChange(t.key)}
            className={status === t.key ? 'active' : ''}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 flex-wrap">
        <select value={category} onChange={e => onCategoryChange(e.target.value)}
          className="a-input !w-auto !py-2 !text-[13px] !font-medium !rounded-lg">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex gap-1">
          {([['all', 'All'], ['high', '🔴 High'], ['medium', '🟡 Med'], ['low', '🟢 Low']] as const).map(([k, label]) => (
            <button key={k} onClick={() => onPriorityChange(k === 'all' ? 'all' : k)}
              className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all"
              style={{
                background: priorityFilter === k ? 'var(--color-apple-blue)' : 'var(--fill3)',
                color: priorityFilter === k ? '#fff' : 'var(--text2)',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
