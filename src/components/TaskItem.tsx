'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

interface Props {
  task: Task;
  onToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate, selected, onSelect, dragHandleProps }: Props) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);
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

  const overdue = isOverdue(task.due_date);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border ${
        overdue ? 'border-red-300 dark:border-red-700' : 'border-gray-100 dark:border-gray-700'
      } hover:border-gray-200 dark:hover:border-gray-600 transition-all group animate-fadeIn ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={!!selected}
          onChange={() => onSelect(task.id)}
          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 flex-shrink-0"
        />
      )}
      <button onClick={() => onToggle(task.id, task.status)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-500 hover:border-green-400'}`}>
        {task.status === 'done' && <span className="text-xs">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {dragHandleProps && (
            <span {...dragHandleProps} className="cursor-grab text-gray-300 hover:text-gray-500 flex-shrink-0 hidden sm:block">⠿</span>
          )}
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
              onBlur={saveEdit}
              className="flex-1 px-2 py-0.5 rounded border border-blue-400 text-gray-700 dark:text-gray-200 text-sm focus:outline-none"
            />
          ) : (
            <span onDoubleClick={handleDoubleClick} className={`flex-1 cursor-default ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'} truncate`}>
              {task.content}
            </span>
          )}
          <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
          {task.due_date && (
            <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{task.category}</span>
          {task.tags.map(t => (
            <span key={t} className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">#{t}</span>
          ))}
          <span className="text-xs text-gray-400">{relativeTime(task.created_at)}</span>
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 p-1">✕</button>
    </div>
  );
}
