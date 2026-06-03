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

  const filtered = useMemo(() => {
    let r = tasks;
    if (categoryFilter && statusFilter !== 'all') r = r.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') r = r.filter(t => t.priority === priorityFilter);
    if (search) { const q = search.toLowerCase(); r = r.filter(t => t.content.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q))); }
    return r;
  }, [tasks, categoryFilter, statusFilter, priorityFilter, search]);

  const toggleTask = (id: string, status: string) => updateTask(id, { status: status === 'todo' ? 'done' : 'todo' });
  const handleAdd = (f: Partial<Task>) => { addTask(f); addToast('Reminder added'); };
  const handleDelete = (id: string) => { deleteTask(id); addToast('Deleted', 'info'); };
  const handleSelect = (id: string) => setSelectedIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const handleDeleteSelected = () => { selectedIds.forEach(id => deleteTask(id)); addToast(`${selectedIds.size} deleted`, 'info'); setSelectedIds(new Set()); setBatchMode(false); };
  const handleMarkSelected = (s: 'todo' | 'done') => { selectedIds.forEach(id => updateTask(id, { status: s })); addToast(`Updated`); setSelectedIds(new Set()); };

  const cats = ['general', 'work', 'personal', 'shopping', 'health'];

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {showPrompt && <ApiKeyPrompt onSave={saveApiKey} />}

      <div className="max-w-[680px] mx-auto px-5 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[34px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>Reminders</h1>
            <p className="text-[15px] mt-0.5" style={{ color: 'var(--text2)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBatchMode(b => !b)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[15px] active:scale-90 transition-transform"
              style={{ background: batchMode ? 'var(--color-apple-blue)' : 'var(--fill3)', color: batchMode ? '#fff' : 'var(--text2)' }}>
              ☑
            </button>
            <DarkModeToggle dark={dark} toggle={toggleDark} />
          </div>
        </div>

        <StatsBar tasks={tasks} />
        <SearchBar value={query} onChange={setQuery} />
        <TaskInput onAdd={handleAdd} categories={cats} />
        <FilterBar status={statusFilter} onStatusChange={setStatusFilter} category={categoryFilter} onCategoryChange={setCategoryFilter} priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter} categories={cats} />

        {batchMode && <BatchActions selectedIds={selectedIds} tasks={filtered} onClearSelection={() => setSelectedIds(new Set())} onDeleteSelected={handleDeleteSelected} onMarkSelected={handleMarkSelected} />}

        {loading ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[17px] font-medium" style={{ color: 'var(--text3)' }}>
              {search ? 'No results found' : 'No reminders'}
            </p>
          </div>
        ) : (
          <div className="a-list">
            <TaskList tasks={filtered} onToggle={toggleTask} onDelete={handleDelete} onUpdate={updateTask} onReorder={reorderTasks} selectedIds={selectedIds} onSelect={batchMode ? handleSelect : undefined} onOpenDetail={setDetailTask} />
          </div>
        )}
      </div>

      {detailTask && <TaskDetailPanel task={detailTask} onClose={() => setDetailTask(null)} onUpdate={updateTask} onDelete={handleDelete} />}
      <ToastContainer toasts={toasts} />
    </main>
  );
}
