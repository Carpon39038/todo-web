'use client';

import { useState, useMemo } from 'react';
import { Task } from '@/lib/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isToday(year: number, month: number, day: number) {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() === month && now.getDate() === day;
}

interface Props {
  tasks: Task[];
  onToggle: (id: string, status: string) => void;
  onOpenDetail: (task: Task) => void;
}

export default function CalendarView({ tasks, onToggle, onOpenDetail }: Props) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (!task.due_date) continue;
      const key = task.due_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(task);
    }
    return map;
  }, [tasks]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const prevOffset = Array.from({ length: firstDay }, () => null);
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col h-full bg-apple-card">
      {/* Header */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 dark:border-white/[.06] shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Calendar</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-3 py-1 rounded-full text-xs font-medium bg-apple-blue/10 text-apple-blue"
          >
            Today
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 md:px-8 py-4 overflow-y-auto">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2L4 6L8 10" /></svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 min-w-[180px] text-center">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 2L8 6L4 10" /></svg>
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-white/[.04] rounded-xl overflow-hidden border border-gray-100 dark:border-white/[.04]">
          {/* Empty cells before month starts */}
          {prevOffset.map((_, i) => (
            <div key={`e${i}`} className="bg-gray-50/50 dark:bg-white/[.02] min-h-[80px] md:min-h-[100px]" />
          ))}

          {/* Day cells */}
          {dayCells.map(day => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const todayFlag = isToday(currentYear, currentMonth, day);

            return (
              <div
                key={day}
                className={`bg-apple-card min-h-[80px] md:min-h-[100px] p-1.5 flex flex-col transition-colors ${
                  todayFlag ? 'ring-2 ring-inset ring-apple-blue/30' : ''
                }`}
              >
                <span className={`text-xs font-medium mb-0.5 ml-0.5 ${
                  todayFlag
                    ? 'w-5 h-5 rounded-full bg-apple-blue text-white flex items-center justify-center'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {day}
                </span>
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      onClick={() => onOpenDetail(task)}
                      className="w-full flex items-center gap-1 px-1 py-0.5 rounded text-left text-[11px] leading-tight truncate hover:bg-gray-50 dark:hover:bg-white/[.04] transition-colors cursor-pointer"
                    >
                      <button
                        onClick={e => { e.stopPropagation(); onToggle(task.id, task.status); }}
                        className={`w-3 h-3 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                          task.status === 'done'
                            ? 'bg-apple-blue border-apple-blue'
                            : 'border-[#c7c7cc] dark:border-[#48484A]'
                        }`}
                      >
                        {task.status === 'done' && (
                          <svg width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M1 3L2.5 4.5L5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </button>
                      <span className={`truncate ${
                        task.status === 'done'
                          ? 'line-through text-gray-300 dark:text-gray-600'
                          : task.priority === 'high'
                            ? 'text-apple-red'
                            : task.priority === 'low'
                              ? 'text-apple-green'
                              : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {task.content}
                      </span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 pl-4">
                      +{dayTasks.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Fill remaining cells to complete last row */}
          {(() => {
            const totalCells = prevOffset.length + dayCells.length;
            const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
            return Array.from({ length: remaining }, (_, i) => (
              <div key={`f${i}`} className="bg-gray-50/50 dark:bg-white/[.02] min-h-[80px] md:min-h-[100px]" />
            ));
          })()}
        </div>

        {/* Selected date tasks list */}
        {/* We show tasks for today below the calendar for quick access */}
      </div>
    </div>
  );
}
