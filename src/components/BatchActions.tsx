'use client';

import { Task } from '@/lib/types';

interface Props { selectedIds: Set<string>; tasks: Task[]; onClearSelection: () => void; onDeleteSelected: () => void; onMarkSelected: (status: 'todo' | 'done') => void; }

export default function BatchActions({ selectedIds, onClearSelection, onDeleteSelected, onMarkSelected }: Props) {
  if (selectedIds.size === 0) return null;
  return (
    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl anim-fade" style={{ background: 'var(--bg-card)' }}>
      <span className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>{selectedIds.size} selected</span>
      <div className="flex-1" />
      <button onClick={() => onMarkSelected('done')} className="a-btn-blue !text-[13px] !h-8 !px-3">Complete</button>
      <button onClick={() => onMarkSelected('todo')} className="a-btn-gray !text-[13px] !h-8 !px-3">Reopen</button>
      <button onClick={onDeleteSelected} className="px-3 h-8 rounded-lg text-[13px] font-semibold"
        style={{ background: 'rgba(255,59,48,0.1)', color: 'var(--color-apple-red)' }}>Delete</button>
      <button onClick={onClearSelection} className="w-7 h-7 rounded-full flex items-center justify-center text-[13px]"
        style={{ background: 'var(--fill3)', color: 'var(--text3)' }}>✕</button>
    </div>
  );
}
