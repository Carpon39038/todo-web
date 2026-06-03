'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

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

const priorityMark: Record<Priority, { text: string; color: string }> = {
  low: { text: '!', color: 'var(--color-apple-green)' },
  medium: { text: '!!', color: 'var(--color-apple-orange)' },
  high: { text: '!!!', color: 'var(--color-apple-red)' },
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
  const [editVal, setEditVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const done = task.status === 'done';
  const overdue = isOverdue(task.due_date);
  const pm = priorityMark[task.priority];

  return (
    <div
      className={`group flex items-center p-3 transition-colors cursor-pointer ${
        done ? 'bg-gray-50 dark:bg-white/[.03]' : 'hover:bg-gray-50 dark:hover:bg-white/[.03]'
      } ${selected ? 'ring-2 ring-apple-blue/40 rounded-xl' : ''}`}
      style={{ borderBottom: '1px solid var(--color-apple-sep)' }}
      onClick={() => onOpenDetail(task)}
    >
      {/* Checkbox - Apple style 18px circle */}
      <button
        onClick={e => { e.stopPropagation(); onToggle(task.id, task.status); }}
        className={`w-[18px] h-[18px] border-[1.5px] rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          done ? 'bg-apple-blue border-apple-blue' : 'border-[#c7c7cc] dark:border-[#48484A]'
        }`}
      >
        {done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4l2.5 2.5L9 1" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input ref={ref} type="text" value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && editVal.trim()) { onUpdate(task.id, { content: editVal.trim() }); setEditing(false); }
              if (e.key === 'Escape') setEditing(false);
            }}
            onBlur={() => { if (editVal.trim()) onUpdate(task.id, { content: editVal.trim() }); setEditing(false); }}
            className="text-sm font-medium bg-transparent outline-none w-full"
            style={{ boxShadow: '0 0 0 1px var(--color-apple-blue)' }}
          />
        ) : (
          <h3
            onDoubleClick={() => { setEditVal(task.content); setEditing(true); }}
            className={`text-sm font-medium transition-all duration-200 ${
              done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {task.content}
          </h3>
        )}

        <p className={`text-xs truncate mt-0.5 ${done ? 'text-gray-400' : 'text-gray-500'}`}>
          <span>{task.category}</span>
          {task.due_date && (
            <span className={`ml-2 ${overdue ? 'text-apple-red font-medium' : ''}`}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          {task.tags.length > 0 && (
            <span className="ml-2">
              {task.tags.slice(0, 2).map(t => `#${t}`).join(' ')}
            </span>
          )}
          <span className="ml-2">{timeAgo(task.created_at)}</span>
        </p>
      </div>

      {/* Priority indicator */}
      {!done && task.priority !== 'medium' && (
        <div className="text-xs font-bold ml-2" style={{ color: pm.color }}>{pm.text}</div>
      )}

      {/* Delete */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(task.id); }}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all ml-2 p-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  );
}
