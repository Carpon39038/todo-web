'use client';

import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
}

function StatCard({ label, value, icon, accent }: { label: string; value: number | string; icon: string; accent: string }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${accent}`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  );
}

export default function StatsBar({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => {
    if (!t.due_date || t.status === 'done') return false;
    return new Date(t.due_date) < new Date();
  }).length;
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status === 'todo').length;

  const cards = [
    { label: 'Total', value: total, icon: '📋', accent: 'bg-primary-50 dark:bg-primary-950/30 border-primary-100 dark:border-primary-900' },
    { label: 'Done', value: done, icon: '✅', accent: 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900' },
    { label: 'Overdue', value: overdue, icon: '⚠️', accent: overdue > 0 ? 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900' : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800' },
    { label: 'Urgent', value: highPriority, icon: '🔥', accent: highPriority > 0 ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900' : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {cards.map(c => <StatCard key={c.label} {...c} />)}
    </div>
  );
}
