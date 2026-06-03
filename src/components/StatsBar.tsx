'use client';

import { Task } from '@/lib/types';

export default function StatsBar({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => t.due_date && t.status === 'todo' && new Date(t.due_date) < new Date()).length;
  const urgent = tasks.filter(t => t.priority === 'high' && t.status === 'todo').length;

  const items = [
    { label: 'Total', value: total, color: 'var(--text)' },
    { label: 'Done', value: done, color: 'var(--color-apple-green)' },
    { label: 'Overdue', value: overdue, color: overdue ? 'var(--color-apple-red)' : 'var(--text3)' },
    { label: 'Urgent', value: urgent, color: urgent ? 'var(--color-apple-orange)' : 'var(--text3)' },
  ];

  return (
    <div className="flex gap-3 mb-6 overflow-x-auto -mx-1 px-1">
      {items.map(it => (
        <div key={it.label} className="flex-1 text-center py-3 rounded-xl min-w-0"
          style={{ background: 'var(--fill3)' }}>
          <div className="text-[22px] font-bold tracking-tight" style={{ color: it.color }}>{it.value}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text2)' }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
}
