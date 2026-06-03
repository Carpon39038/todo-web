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

  return (
    <div className="apple-card p-3 mb-4 flex items-center gap-3 animate-apple-up flex-wrap">
      <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
        {selectedIds.size} selected
      </span>
      <div className="flex-1" />
      <button onClick={() => onMarkSelected('done')} className="apple-btn-primary px-3 py-1.5 text-[13px]">Complete</button>
      <button onClick={() => onMarkSelected('todo')} className="apple-btn-secondary px-3 py-1.5 text-[13px]">Reopen</button>
      <button onClick={onDeleteSelected} className="px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-95"
        style={{ background: 'rgba(255,59,48,0.12)', color: 'var(--color-apple-red,#FF3B30)' }}>Delete</button>
      <button onClick={onClearSelection} className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
        style={{ background: 'var(--fill-tertiary)', color: 'var(--text-secondary)' }}>✕</button>
    </div>
  );
}
