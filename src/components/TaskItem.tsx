'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
}

const priorityDot: Record<Priority, string> = {
  low: 'bg-green-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400',
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
  const [checkedAnim, setCheckedAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleDoubleClick = () => {
    setEditContent(task.content);
    setEditing(true);
  };

  const saveEdit = () => {
    if (editContent.trim()) onUpdate(task.id, { content: editContent.trim() });
    setEditing(false);
  };

  const handleCheck = () => {
    setCheckedAnim(true);
    onToggle(task.id, task.status);
    setTimeout(() => setCheckedAnim(false), 300);
  };

  const overdue = isOverdue(task.due_date);

  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3.5 rounded-2xl border transition-all animate-fadeIn cursor-default ${
        selected ? 'ring-2 ring-primary-500' : ''
      } ${overdue ? 'border-red-200 dark:border-red-800/50' : ''}`}
      style={{ background: 'var(--bg-card)', borderColor: overdue ? undefined : 'var(--border-light)', boxShadow: 'var(--shadow-sm)' }}
      onClick={() => onOpenDetail(task)}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={e => { e.stopPropagation(); onSelect(task.id); }}
          className="w-4 h-4 rounded mt-1 flex-shrink-0 accent-blue-500"
          onClick={e => e.stopPropagation()}
        />
      )}

      <button
        onClick={e => { e.stopPropagation(); handleCheck(); }}
        className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
          task.status === 'done'
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-500 hover:border-green-400'
        } ${checkedAnim ? 'animate-check' : ''}`}
      >
        {task.status === 'done' && <span className="text-[10px]">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <span {...dragHandleProps} className="cursor-grab opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity flex-shrink-0">⠿</span>
          )}
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
              onBlur={saveEdit}
              className="flex-1 px-2 py-0.5 rounded-lg text-sm border border-primary-300 dark:border-primary-700"
              style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span onDoubleClick={e => { e.stopPropagation(); handleDoubleClick(); }} className={`text-sm leading-snug ${task.status === 'done' ? 'line-through text-gray-400 dark:text-gray-500' : ''}`} style={!task.status ? {} : {}}  >
              {task.content}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} title={task.priority} />
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>{task.category}</span>
          {task.due_date && (
            <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : ''}`} style={!overdue ? { color: 'var(--text-muted)' } : {}}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          {task.tags.slice(0, 3).map(t => (
            <span key={t} className="text-xs" style={{ color: 'var(--text-muted)' }}>#{t}</span>
          ))}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{relativeTime(task.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
