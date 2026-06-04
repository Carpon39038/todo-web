'use client';

import { useState, useMemo } from 'react';
import { Task, DEFAULT_CATEGORIES } from '@/lib/types';
import { useTasks } from '@/hooks/useTasks';
import TaskList from '@/components/TaskList';
import TaskDetailPanel from '@/components/TaskDetailPanel';
import CalendarView from '@/components/CalendarView';
import ApiKeyPrompt from '@/components/ApiKeyPrompt';
import ToastContainer, { useToastManager } from '@/components/Toast';
import { useApiKeyGuard } from '@/lib/apiKey';

type Tab = 'list' | 'calendar';

function SidebarButton({ active, color, label, icon, onClick }: { active: boolean; color: string; label: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active ? 'bg-white shadow-sm font-medium text-[var(--color-apple-text)] dark:bg-white/10' : 'text-[var(--color-apple-text-secondary)] hover:bg-gray-200/50 dark:hover:bg-white/5 font-medium'
      }`}
    >
      <div className="p-1.5 rounded-md text-white mr-1 text-[13px] leading-none" style={{ background: active ? color : '#9CA3AF' }}>
        {icon}
      </div>
      {label}
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const { toasts, addToast } = useToastManager();
  const { showPrompt, save: saveApiKey } = useApiKeyGuard();

  const { tasks, loading, addTask, updateTask, deleteTask, reorderTasks } = useTasks('all');

  const pendingTasks = useMemo(
    () => tasks.filter(t => t.status !== 'done').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter(t => t.status === 'done').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [tasks]
  );

  const toggleTask = (id: string, s: string) => updateTask(id, { status: s === 'todo' ? 'done' : 'todo' });

  const handleAddClick = () => {
    const temp: Task = {
      id: `new-${Date.now()}`,
      content: '',
      status: 'todo',
      source: 'openclaw',
      category: DEFAULT_CATEGORIES[0],
      priority: 'medium',
      due_date: null,
      tags: [],
      sort_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDetailTask(temp);
  };

  const handleSaveDetail = (id: string, fields: Partial<Task>) => {
    if (id.startsWith('new-')) {
      if (fields.content?.trim()) {
        addTask({
          content: fields.content.trim(),
          priority: fields.priority || 'medium',
          due_date: fields.due_date || null,
          category: fields.category || DEFAULT_CATEGORIES[0],
          tags: fields.tags || [],
        });
        addToast('Task added');
      }
    } else {
      updateTask(id, fields);
      addToast('Task updated');
    }
  };

  const handleDelete = (id: string) => {
    if (id.startsWith('new-')) return;
    deleteTask(id);
    addToast('Task deleted', 'info');
  };

  return (
    <main className="flex h-screen w-full bg-apple-bg overflow-hidden text-apple-text font-sans selection:bg-apple-blue/30 selection:text-apple-blue">
      {showPrompt && <ApiKeyPrompt onSave={saveApiKey} />}

      <aside className="hidden md:flex flex-col w-60 border-r border-[var(--color-apple-separator)]/50 bg-[#F6F6F6]/80 dark:bg-[#111]/80 backdrop-blur-md">
        <div className="p-6 space-y-8">
          <h2 className="text-xl font-semibold text-apple-text px-2 mb-6 tracking-tight">iOS Tasks</h2>
          <nav className="space-y-1">
            <SidebarButton active={activeTab === 'list'} color="var(--color-apple-blue)" label="All Tasks" icon="☰" onClick={() => setActiveTab('list')} />
            <SidebarButton active={activeTab === 'calendar'} color="var(--color-apple-red)" label="Calendar" icon="📅" onClick={() => setActiveTab('calendar')} />
          </nav>
        </div>
      </aside>

      <section className="flex-1 flex relative bg-apple-card shadow-inner">
        <div className="flex-1 flex flex-col h-full bg-apple-card shadow-inner rounded-l-lg border-l border-[var(--color-apple-separator)]">
          <div className="md:hidden flex items-center justify-between p-4 bg-apple-bg/80 backdrop-blur-md sticky top-0 z-10 border-b border-[var(--color-apple-separator)]/30">
            <button className="text-apple-blue font-medium">☰</button>
            <div className="font-semibold">{activeTab === 'list' ? 'Tasks' : 'Calendar'}</div>
            <button className="text-apple-blue" onClick={handleAddClick}>＋</button>
          </div>

          {activeTab === 'list' ? (
            <div className="flex-1 flex flex-col h-full bg-apple-card">
              <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-gray-100 dark:border-white/[.06] shrink-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Tasks</h1>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddClick}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-apple-blue font-medium active:bg-gray-200 dark:active:bg-white/15 transition-colors"
                  >
                    <span className="text-lg leading-none">＋</span>
                  </button>
                </div>
              </header>

              <div className="flex-1 px-4 md:px-8 py-4 overflow-y-auto pb-24">
                {loading ? (
                  <div className="space-y-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="group flex items-center p-3 rounded-xl bg-white dark:bg-white/[.02] border-b border-gray-50 dark:border-white/[.04]">
                        <div className="skeleton w-[18px] h-[18px] rounded-full mr-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="skeleton h-4 w-2/3 mb-2" />
                          <div className="skeleton h-3 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center text-[var(--color-apple-text-secondary)] mt-20">
                    <p className="text-lg">No Reminders</p>
                    <button onClick={handleAddClick} className="mt-2 text-apple-blue font-medium">Add one now</button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {pendingTasks.length > 0 && (
                      <div className="space-y-1">
                        <TaskList
                          tasks={pendingTasks}
                          onToggle={toggleTask}
                          onDelete={handleDelete}
                          onUpdate={updateTask}
                          onReorder={reorderTasks}
                          selectedIds={new Set()}
                          onOpenDetail={setDetailTask}
                        />
                      </div>
                    )}

                    {completedTasks.length > 0 && (
                      <div className="mt-8">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Completed</h2>
                        <div className="space-y-1">
                          <TaskList
                            tasks={completedTasks}
                            onToggle={toggleTask}
                            onDelete={handleDelete}
                            onUpdate={updateTask}
                            onReorder={reorderTasks}
                            selectedIds={new Set()}
                            onOpenDetail={setDetailTask}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <CalendarView
              tasks={tasks}
              onToggle={toggleTask}
              onOpenDetail={setDetailTask}
            />
          )}
        </div>

        {detailTask && (
          <div className="absolute inset-0 z-50 bg-apple-card md:relative md:w-80 lg:w-96 md:border-l border-[var(--color-apple-separator)]/50 anim-slide">
            <TaskDetailPanel
              task={detailTask}
              onClose={() => setDetailTask(null)}
              onUpdate={handleSaveDetail}
              onDelete={handleDelete}
            />
          </div>
        )}
      </section>

      <div className="md:hidden fixed bottom-0 inset-x-0 bg-apple-bg/80 backdrop-blur-xl border-t border-[var(--color-apple-separator)]/30 px-6 py-2 flex justify-around items-center z-40 pb-safe">
        <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center gap-1 ${activeTab === 'list' ? 'text-apple-blue' : 'text-[var(--color-apple-text-secondary)]'}`}>
          <span className="text-lg">☰</span>
          <span className="text-[10px] font-medium">Tasks</span>
        </button>
        <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-apple-blue' : 'text-[var(--color-apple-text-secondary)]'}`}>
          <span className="text-lg">📅</span>
          <span className="text-[10px] font-medium">Calendar</span>
        </button>
      </div>

      <ToastContainer toasts={toasts} />
    </main>
  );
}
