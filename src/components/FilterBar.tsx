'use client';

import { TaskStatus, Priority } from '@/lib/types';

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
      {/* Segmented control */}
      <div className="inline-flex rounded-lg p-[3px] bg-gray-200/70 dark:bg-white/10">
        {tabs.map(t => (
          <button key={t.key} onClick={() => onStatusChange(t.key)}
            className={`px-4 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
              status === t.key
                ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select value={category} onChange={e => onCategoryChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-gray-100 dark:bg-white/10 border-none outline-none cursor-pointer text-gray-600 dark:text-gray-300">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(['all', 'high', 'medium', 'low'] as const).map(p => (
          <button key={p} onClick={() => onPriorityChange(p === 'all' ? 'all' : p)}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
              priorityFilter === p
                ? 'bg-apple-blue text-white'
                : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
            }`}>
            {p === 'all' ? 'All' : p}
          </button>
        ))}
      </div>
    </div>
  );
}
