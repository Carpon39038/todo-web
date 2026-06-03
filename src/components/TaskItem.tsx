'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function isOverdue(dateStr: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
}

const priorityColor: Record<Priority, string> = {
  low: '#34C759', medium: '#FF9500', high: '#FF3B30',
};

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
  const [editContent, setEditContent] = useState(task.content);
  const [checked, setChecked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const handleCheck = () => {
    setChecked(true);
    onToggle(task.id, task.status);
    setTimeout(() => setChecked(false), 350);
  };

  const overdue = isOverdue(task.due_date);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-all animate-apple-fade group ${selected ? 'ring-2 ring-[var(--color-apple-blue,#007AFF)]' : ''}`}
      style={{ background: 'var(--bg-elevated)' }}
      onClick={() => onOpenDetail(task)}
    >
      {onSelect && (
        <input
          type="checkbox" checked={!!selected}
          onChange={() => onSelect(task.id)}
          className="w-[22px] h-[22px] rounded-full mt-0.5 flex-shrink-0 accent-[#007AFF]"
          onClick={e => e.stopPropagation()}
        />
      )}

      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); handleCheck(); }}
        className={`w-[24px] h-[24px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
          checked ? 'animate-apple-check' : ''
        } ${task.status === 'done'
          ? 'bg-[var(--color-apple-green,#34C759)]'
          : ''
        }`}
        style={task.status !== 'done'
          ? { border: '2px solid var(--separator)', borderRadius: '50%' }
          : { border: '2px solid var(--color-apple-green,#34C759)', borderRadius: '50%' }
        }
      >
        {task.status === 'done' && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
        {editing ? (
          <input
            ref={inputRef} type="text" value={editContent}
            onChange={e => setEditContent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { if (editContent.trim()) onUpdate(task.id, { content: editContent.trim() }); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
            onBlur={() => { if (editContent.trim()) onUpdate(task.id, { content: editContent.trim() }); setEditing(false); }}
            className="text-base font-normal rounded-lg px-2 py-0.5 outline-none"
            style={{ background: 'var(--fill-tertiary)', color: 'var(--text-primary)', boxShadow: '0 0 0 3px rgba(0,122,255,0.3)', width: '100%' }}
          />
        ) : (
          <p
            onDoubleClick={() => { setEditContent(task.content); setEditing(true); }}
            className={`text-[17px] leading-snug -tracking-[0.01em] ${task.status === 'done' ? 'line-through' : ''}`}
            style={{ color: task.status === 'done' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}
          >
            {task.content}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: priorityColor[task.priority] }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{task.category}</span>
          {task.due_date && (
            <span className="text-[13px]" style={{ color: overdue ? 'var(--color-apple-red,#FF3B30)' : 'var(--text-secondary)', fontWeight: overdue ? 600 : 400 }}>
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          {task.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>#{t}</span>
          ))}
          <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{relativeTime(task.created_at)}</span>
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(task.id); }}
        className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm flex-shrink-0"
        style={{ color: 'var(--text-tertiary)' }}
      >
        🗑
      </button>
    </div>
  );
}
