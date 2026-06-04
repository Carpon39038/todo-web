'use client';

import { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '@/lib/types';

function formatMeta(task: Task) {
  const parts: string[] = [];
  if (task.due_date) parts.push(new Date(task.due_date).toLocaleDateString());
  if (task.tags.length > 0) parts.push(task.tags.slice(0, 2).join(' '));
  return parts.join(' ');
}

const priorityMark: Record<Priority, { text: string; color: string }> = {
  low: { text: '!', color: 'var(--color-apple-green)' },
  medium: { text: '!!', color: 'var(--color-apple-orange)' },
  high: { text: '!!!', color: 'var(--color-apple-red)' },
};

interface Props {
  task: Task;
  onToggle: (id: string, status: string) => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  onOpenDetail: (task: Task) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export default function TaskItem({ task, onToggle, onUpdate, onOpenDetail, selected }: Props) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const done = task.status === 'done';
  const meta = formatMeta(task);
  const pm = priorityMark[task.priority];

  return (
    <div
      className={`group flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[.03] transition-colors cursor-pointer border-b border-gray-50 dark:border-white/[.04] ${
        done ? 'bg-gray-50 dark:bg-white/[.03]' : ''
      } ${selected ? 'ring-2 ring-apple-blue/40' : ''}`}
      onClick={() => onOpenDetail(task)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id, task.status);
        }}
        className={`w-[18px] h-[18px] border-[1.5px] border-[#c7c7cc] dark:border-[#48484A] rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          done ? 'bg-apple-blue border-apple-blue' : ''
        }`}
      >
        {done && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
            <path d="M2.5 6.2L4.9 8.6L9.5 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={ref}
            type="text"
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && editVal.trim()) {
                onUpdate(task.id, { content: editVal.trim() });
                setEditing(false);
              }
              if (e.key === 'Escape') setEditing(false);
            }}
            onBlur={() => {
              if (editVal.trim()) onUpdate(task.id, { content: editVal.trim() });
              setEditing(false);
            }}
            className="text-sm font-medium bg-transparent outline-none w-full"
          />
        ) : (
          <h3
            onDoubleClick={() => {
              setEditVal(task.content);
              setEditing(true);
            }}
            className={`text-sm font-medium transition-all duration-200 ${
              done ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {task.content}
          </h3>
        )}

        {meta && (
          <p className={`text-xs truncate mt-0.5 ${done ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {meta}
          </p>
        )}
      </div>

      {!done && <div className="text-xs font-bold ml-2" style={{ color: pm.color }}>{pm.text}</div>}
    </div>
  );
}
