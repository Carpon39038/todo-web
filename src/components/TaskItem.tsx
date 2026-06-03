'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

const priorityDot: Record<Priority, string> = { low: '#34C759', medium: '#FF9500', high: '#FF3B30' };

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function isOverdue(d: string | null) {
  if (!d) return false;
  return new Date(d) < new Date() && new Date(d).toDateString() !== new Date().toDateString();
}

interface Props {
  task: Task;
  onToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  onOpenDetail: (task: Task) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate, onOpenDetail, selected, onSelect, dragHandleProps }: Props) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const [animCheck, setAnimCheck] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimCheck(true);
    setTimeout(() => setAnimCheck(false), 300);
    onToggle(task.id, task.status);
  };

  const overdue = isOverdue(task.due_date);
  const done = task.status === 'done';

  return (
    <div className={`a-list-item ${selected ? 'ring-2 ring-blue-500/40' : ''} ${animCheck ? 'anim-pop' : ''}`}
      onClick={() => onOpenDetail(task)} style={dragHandleProps}>
      {/* checkbox */}
      <button className={`a-check ${done ? 'done' : ''}`} onClick={handleToggle}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4l2.5 2.5L9 1" />
        </svg>
      </button>

      {/* content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input ref={ref} type="text" value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && editVal.trim()) { onUpdate(task.id, { content: editVal.trim() }); setEditing(false); }
              if (e.key === 'Escape') setEditing(false);
            }}
            onBlur={() => { if (editVal.trim()) onUpdate(task.id, { content: editVal.trim() }); setEditing(false); }}
            className="a-input !py-1 !text-[17px] !px-2" style={{ boxShadow: '0 0 0 3px rgba(0,122,255,0.25)' }} />
        ) : (
          <p onDoubleClick={() => { setEditVal(task.content); setEditing(true); }}
            className={`text-[17px] leading-tight ${done ? 'line-through' : ''}`}
            style={{ color: done ? 'var(--text3)' : 'var(--text)' }}>
            {task.content}
          </p>
        )}

        {/* meta */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: priorityDot[task.priority] }} />
          <span className="text-[13px]" style={{ color: 'var(--text3)' }}>{task.category}</span>
          {task.due_date && (
            <span className="text-[13px] font-medium" style={{ color: overdue ? 'var(--color-apple-red)' : 'var(--text3)' }}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          <span className="text-[13px]" style={{ color: 'var(--text3)' }}>{timeAgo(task.created_at)}</span>
          {task.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[13px]" style={{ color: 'var(--text3)' }}>#{t}</span>
          ))}
        </div>
      </div>

      {/* delete */}
      <button onClick={e => { e.stopPropagation(); onDelete(task.id); }}
        className="opacity-0 group-hover:opacity-100 text-[13px] mt-1 transition-opacity flex-shrink-0"
        style={{ color: 'var(--text3)' }}>
        🗑
      </button>
    </div>
  );
}
