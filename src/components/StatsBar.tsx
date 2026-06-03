'use client';

import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all" style={{ background: 'var(--fill-tertiary)' }}>
      <span className="text-[28px] font-bold tracking-tight" style={{ color }}>{value}</span>
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

export default function StatsBar({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => t.due_date && t.status !== 'todo' && new Date(t.due_date) < new Date()).length || tasks.filter(t => t.due_date && t.status === 'todo' && new Date(t.due_date) < new Date()).length;
  const urgent = tasks.filter(t => t.priority === 'high' && t.status === 'todo').length;

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <StatPill label="Total" value={total} color="var(--text-primary)" />
      <StatPill label="Done" value={done} color="var(--color-apple-green,#34C759)" />
      <StatPill label="Overdue" value={overdue} color={overdue > 0 ? 'var(--color-apple-red,#FF3B30)' : 'var(--text-secondary)'} />
      <StatPill label="Urgent" value={urgent} color={urgent > 0 ? 'var(--color-apple-orange,#FF9500)' : 'var(--text-secondary)'} />
    </div>
  );
}
