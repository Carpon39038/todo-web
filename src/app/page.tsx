'use client';

import { useState, useMemo } from 'react';
import { Task, TaskStatus, Priority } from '@/lib/types';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTasks } from '@/hooks/useTasks';
import { useSearch } from '@/hooks/useSearch';
import DarkModeToggle from '@/components/DarkModeToggle';
import SearchBar from '@/components/SearchBar';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import FilterBar from '@/components/FilterBar';
import BatchActions from '@/components/BatchActions';
import StatsBar from '@/components/StatsBar';
import SkeletonList from '@/components/SkeletonList';
import TaskDetailPanel from '@/components/TaskDetailPanel';
import ApiKeyPrompt from '@/components/ApiKeyPrompt';
import ToastContainer, { useToastManager } from '@/components/Toast';
import { useApiKeyGuard } from '@/lib/apiKey';

export default function Home() {
  const { dark, toggle: toggleDark } = useDarkMode();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('todo');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchMode, setBatchMode] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const { query, debounced: search, setQuery } = useSearch();
  const { toasts, addToast } = useToastManager();
  const { apiKey, showPrompt, save: saveApiKey } = useApiKeyGuard();

  const { tasks, loading, addTask, updateTask, deleteTask, reorderTasks } = useTasks(
    categoryFilter ? 'all' : statusFilter, categoryFilter || undefined
  );

  const filteredTasks = useMemo(() => {
    let r = tasks;
    if (categoryFilter && statusFilter !== 'all') r = r.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') r = r.filter(t => t.priority === priorityFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(t => t.content.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }
    return r;
  }, [tasks, categoryFilter, statusFilter, priorityFilter, search]);

  const toggleTask = (id: string, s: string) => updateTask(id, { status: s === 'todo' ? 'done' : 'todo' });
  const handleAdd = (f: Partial<Task>) => { addTask(f); addToast('Task added'); };
  const handleDelete = (id: string) => { deleteTask(id); addToast('Task deleted', 'info'); };
  const handleSelect = (id: string) => {
    setSelectedIds(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const handleDeleteSelected = () => { selectedIds.forEach(id => deleteTask(id)); addToast(`${selectedIds.size} deleted`, 'info'); setSelectedIds(new Set()); setBatchMode(false); };
  const handleMarkSelected = (s: 'todo' | 'done') => { selectedIds.forEach(id => updateTask(id, { status: s })); addToast(`${selectedIds.size} updated`); setSelectedIds(new Set()); };

  const allCategories = ['general', 'work', 'personal', 'shopping', 'health'];

  return (
    <main className="min-h-screen selection:bg-apple-blue/30 selection:text-apple-blue" style={{ background: 'var(--color-apple-bg)' }}>
      {showPrompt && <ApiKeyPrompt onSave={saveApiKey} />}

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Reminders</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBatchMode(b => !b)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                batchMode ? 'bg-apple-blue text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500'
              }`}>
              ☑
            </button>
            <DarkModeToggle dark={dark} toggle={toggleDark} />
          </div>
        </div>

        <StatsBar tasks={tasks} />
        <SearchBar value={query} onChange={setQuery} />
        <TaskInput onAdd={handleAdd} categories={allCategories} />
        <FilterBar status={statusFilter} onStatusChange={setStatusFilter} category={categoryFilter}
          onCategoryChange={setCategoryFilter} priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter} categories={allCategories} />

        {batchMode && (
          <BatchActions selectedIds={selectedIds} tasks={filteredTasks}
            onClearSelection={() => setSelectedIds(new Set())}
            onDeleteSelected={handleDeleteSelected} onMarkSelected={handleMarkSelected} />
        )}

        {loading ? (
          <SkeletonList />
        ) : filteredTasks.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-lg text-gray-400 dark:text-gray-500">No Reminders</p>
            <p className="text-sm text-apple-blue font-medium mt-1">Add one now</p>
          </div>
        ) : (
          <div className="bg-apple-card dark:bg-apple-card rounded-xl overflow-hidden shadow-sm">
            <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={handleDelete}
              onUpdate={updateTask} onReorder={reorderTasks}
              selectedIds={selectedIds} onSelect={batchMode ? handleSelect : undefined}
              onOpenDetail={setDetailTask} />
          </div>
        )}
      </div>

      {detailTask && <TaskDetailPanel task={detailTask} onClose={() => setDetailTask(null)} onUpdate={updateTask} onDelete={handleDelete} />}
      <ToastContainer toasts={toasts} />
    </main>
  );
}
