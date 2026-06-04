'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, fields: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskDetailPanel({ task, onClose, onUpdate, onDelete }: Props) {
  const [content, setContent] = useState(task?.content ?? '');
  const [notes, setNotes] = useState(task?.tags?.join(' ') ?? '');
  const [date, setDate] = useState(task?.due_date ?? '');

  if (!task) return null;

  const handleSave = () => {
    if (!content.trim()) return onClose();
    onUpdate(task.id, {
      content: content.trim(),
      due_date: date || null,
      tags: notes.trim() ? notes.trim().split(/\s+/).map(t => t.replace(/^#/, '')) : [],
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-apple-card absolute inset-0 z-50 md:relative overflow-hidden pt-4 md:pt-0">
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-apple-card">
        <button onClick={handleSave} className="text-gray-500 p-2">✕</button>
      </div>

      <div className="flex-1 p-6 md:p-8 flex flex-col h-full overflow-y-auto">
        <div className="flex items-start mb-8">
          <div className="w-[18px] h-[18px] border-[1.5px] border-[#c7c7cc] dark:border-[#48484A] rounded-full mr-4 mt-1.5 flex-shrink-0"></div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What needs to be done?"
            rows={2}
            className="flex-1 text-xl font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-none bg-transparent"
            autoFocus
          />
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center"><span className="mr-2">📅</span> Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-medium text-apple-blue bg-transparent focus:outline-none text-right"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full h-32 p-3 bg-gray-50 dark:bg-white/[.04] rounded-xl text-sm border-none focus:outline-none resize-none text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        <div className="pt-6 mt-auto border-t border-gray-100 dark:border-white/[.06] flex justify-between items-center shrink-0">
          <button className="text-xs text-gray-400">Last updated recently</button>
          {!task.id.startsWith('new-') ? (
            <button
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="text-red-500 text-sm font-medium p-2 -mr-2"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="text-apple-blue font-medium p-2 -mr-2 text-sm"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
