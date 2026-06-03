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
    let result = tasks;
    if (categoryFilter && statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(t => t.priority === priorityFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.content.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }
    return result;
  }, [tasks, categoryFilter, statusFilter, priorityFilter, search]);

  const toggleTask = (id: string, status: string) => {
    updateTask(id, { status: status === 'todo' ? 'done' : 'todo' });
  };

  const handleAdd = (fields: Partial<Task>) => { addTask(fields); addToast('Task added'); };
  const handleDelete = (id: string) => { deleteTask(id); addToast('Task deleted', 'info'); };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const handleDeleteSelected = () => { selectedIds.forEach(id => deleteTask(id)); addToast(`${selectedIds.size} deleted`, 'info'); setSelectedIds(new Set()); setBatchMode(false); };
  const handleMarkSelected = (s: 'todo' | 'done') => { selectedIds.forEach(id => updateTask(id, { status: s })); addToast(`${selectedIds.size} updated`); setSelectedIds(new Set()); };

  const allCategories = ['general', 'work', 'personal', 'shopping', 'health'];

  return (
    <main style={{ background: 'var(--bg-primary)' }}>
      {showPrompt && <ApiKeyPrompt onSave={saveApiKey} />}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[34px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Reminders</h1>
            <p className="text-[15px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBatchMode(b => !b)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-base transition-all active:scale-90"
              style={{ background: batchMode ? 'var(--color-apple-blue, #007AFF)' : 'var(--fill-secondary)', color: batchMode ? '#fff' : 'var(--text-secondary)' }}
            >☑</button>
            <DarkModeToggle dark={dark} toggle={toggleDark} />
          </div>
        </div>

        <StatsBar tasks={tasks} />

        <div className="mb-4"><SearchBar value={query} onChange={setQuery} /></div>
        <TaskInput onAdd={handleAdd} categories={allCategories} />
        <FilterBar status={statusFilter} onStatusChange={setStatusFilter} category={categoryFilter} onCategoryChange={setCategoryFilter} priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter} categories={allCategories} />

        {batchMode && (
          <BatchActions selectedIds={selectedIds} tasks={filteredTasks} onClearSelection={() => setSelectedIds(new Set())} onDeleteSelected={handleDeleteSelected} onMarkSelected={handleMarkSelected} />
        )}

        {loading ? (
          <SkeletonList />
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3 opacity-60">✓</div>
            <p className="text-[17px] font-medium" style={{ color: 'var(--text-secondary)' }}>
              {search ? 'No results' : 'No tasks yet'}
            </p>
          </div>
        ) : (
          <div className="apple-list stagger">
            <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={handleDelete} onUpdate={updateTask} onReorder={reorderTasks} selectedIds={selectedIds} onSelect={batchMode ? handleSelect : undefined} onOpenDetail={setDetailTask} />
          </div>
        )}
      </div>

      {detailTask && <TaskDetailPanel task={detailTask} onClose={() => setDetailTask(null)} onUpdate={updateTask} onDelete={handleDelete} />}
      <ToastContainer toasts={toasts} />
    </main>
  );
}
