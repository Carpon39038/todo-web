'use client';

import { Task } from '@/lib/types';

export default function StatsBar({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const active = total - done;

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {[
        { label: 'Total', value: total, color: 'var(--color-apple-text)' },
        { label: 'Active', value: active, color: 'var(--color-apple-blue)' },
        { label: 'Done', value: done, color: 'var(--color-apple-green)' },
      ].map(s => (
        <div key={s.label} className="bg-apple-card dark:bg-apple-card rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
