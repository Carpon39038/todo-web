'use client';

import { Task } from '@/lib/types';

interface Props {
  selectedIds: Set<string>;
  tasks: Task[];
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onMarkSelected: (status: 'todo' | 'done') => void;
}

export default function BatchActions({ selectedIds, tasks, onClearSelection, onDeleteSelected, onMarkSelected }: Props) {
  if (selectedIds.size === 0) return null;

  const allSelected = tasks.length > 0 && tasks.every(t => selectedIds.has(t.id));

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-3 animate-fadeIn flex-wrap">
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
        <input type="checkbox" checked={allSelected} onChange={e => { if (!allSelected) tasks.forEach(t => selectedIds.add(t.id)); else selectedIds.clear(); onClearSelection(); }} className="w-4 h-4 rounded" />
        Select all
      </label>
      <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
      <div className="flex-1" />
      <button onClick={() => onMarkSelected('done')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">✓ Done</button>
      <button onClick={() => onMarkSelected('todo')} className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors">↩ Todo</button>
      <button onClick={onDeleteSelected} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors">🗑 Delete</button>
      <button onClick={onClearSelection} className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm">✕</button>
    </div>
  );
}
