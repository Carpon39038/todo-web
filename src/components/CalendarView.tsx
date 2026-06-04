'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
  onToggle: (id: string, status: string) => void;
  onOpenDetail: (task: Task) => void;
}

export default function CalendarView({ tasks, onToggle, onOpenDetail }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDay, { weekStartsOn: 0 });
  const endDate = endOfWeek(lastDay, { weekStartsOn: 0 });

  const days = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);

  const tasksForSelectedDate = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return tasks.filter(t => t.due_date && t.due_date.slice(0, 10) === dateStr);
  }, [tasks, selectedDate]);

  const hasTasksMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const task of tasks) {
      if (!task.due_date) continue;
      const key = task.due_date.slice(0, 10);
      if (task.status !== 'done') map[key] = true;
    }
    return map;
  }, [tasks]);

  return (
    <div className="flex-1 flex flex-col h-full bg-apple-card">
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 dark:border-white/[.06] shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Calendar</h1>
      </header>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 md:p-8 shrink-0">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-[var(--color-apple-text-secondary)] uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-2">
            {days.map((day, idx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const hasTodos = hasTasksMap[dateStr];
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayFlag = isSameDay(day, new Date());

              return (
                <div key={idx} className="flex justify-center flex-col items-center py-2 h-16">
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors relative ${
                      !isCurrentMonth && 'text-gray-300 dark:text-gray-600',
                      isCurrentMonth && !isSelected && 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10',
                      isSelected && 'bg-apple-blue text-white font-semibold',
                      isTodayFlag && !isSelected && 'text-apple-blue font-bold'
                    }`}
                  >
                    {format(day, 'd')}
                    {hasTodos && (
                      <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-apple-blue'
                      }`} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="flex-1 px-4 md:px-8 pt-4 pb-24 border-t border-gray-100 dark:border-white/[.06] bg-apple-card">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Tasks for {format(selectedDate, 'MMM d')}
          </h2>

          {tasksForSelectedDate.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm px-1">No tasks for this date.</p>
          ) : (
            <div className="space-y-1">
              {tasksForSelectedDate.map(task => (
                <div
                  key={task.id}
                  onClick={() => onOpenDetail(task)}
                  className={`group flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[.03] transition-colors cursor-pointer border-b border-gray-50 dark:border-white/[.04] ${
                    task.status === 'done' ? 'bg-gray-50 dark:bg-white/[.02]' : ''
                  }`}
                >
                  <button
                    onClick={e => { e.stopPropagation(); onToggle(task.id, task.status); }}
                    className={`w-[18px] h-[18px] border-[1.5px] border-[#c7c7cc] dark:border-[#48484A] rounded-full mr-4 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                      task.status === 'done' ? 'bg-apple-blue border-apple-blue' : ''
                    }`}
                  >
                    {task.status === 'done' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium transition-all duration-200 ${
                      task.status === 'done' ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {task.content}
                    </p>
                  </div>
                  {!task.completed && task.priority !== 'medium' && (
                    <div className={`text-xs font-bold ml-2 ${
                      task.priority === 'high' ? 'text-apple-red' : task.priority === 'low' ? 'text-apple-green' : ''
                    }`}>
                      {task.priority === 'high' ? '!!!' : '!'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
