'use client';

import { Priority, TaskStatus } from '@/lib/types';

interface Props {
  status: TaskStatus | 'all';
  onStatusChange: (s: TaskStatus | 'all') => void;
  category: string;
  onCategoryChange: (c: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityChange: (p: Priority | 'all') => void;
  categories: string[];
}

const statusFilters: { key: TaskStatus | 'all'; label: string }[] = [
  { key: 'todo', label: '📋 Todo' },
  { key: 'done', label: '✅ Done' },
  { key: 'all', label: '📊 All' },
];

export default function FilterBar({ status, onStatusChange, category, onCategoryChange, priorityFilter, onPriorityChange, categories }: Props) {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-xl p-1">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => onStatusChange(f.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${status === f.key ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <select
          value={category}
          onChange={e => onCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={priorityFilter}
          onChange={e => onPriorityChange(e.target.value as Priority | 'all')}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm"
        >
          <option value="all">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>
    </div>
  );
}
