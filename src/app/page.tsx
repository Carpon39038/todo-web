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
import ToastContainer, { useToastManager } from '@/components/Toast';

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

  const { tasks, loading, addTask, updateTask, deleteTask, reorderTasks } = useTasks(
    categoryFilter ? 'all' : statusFilter,
    categoryFilter || undefined
  );

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (categoryFilter && statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.content.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, categoryFilter, statusFilter, priorityFilter, search]);

  const toggleTask = (id: string, status: string) => {
    updateTask(id, { status: status === 'todo' ? 'done' : 'todo' });
    addToast(status === 'todo' ? 'Task completed ✓' : 'Task reopened', 'success');
  };

  const handleAdd = (fields: Partial<Task>) => {
    addTask(fields);
    addToast('Task added', 'success');
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    addToast('Task deleted', 'info');
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach(id => deleteTask(id));
    setSelectedIds(new Set());
    addToast(`${selectedIds.size} tasks deleted`, 'info');
    setBatchMode(false);
  };

  const handleMarkSelected = (newStatus: 'todo' | 'done') => {
    selectedIds.forEach(id => updateTask(id, { status: newStatus }));
    setSelectedIds(new Set());
    addToast(`${selectedIds.size} tasks marked as ${newStatus}`, 'success');
  };

  const allCategories = ['general', 'work', 'personal', 'shopping', 'health'];

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>✓ Todo</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Stay organized, get things done</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setBatchMode(b => !b)}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: batchMode ? 'var(--text-primary)' : 'var(--bg-input)',
                color: batchMode ? 'var(--bg-primary)' : 'var(--text-secondary)',
              }}
            >
              ☑️ Select
            </button>
            <DarkModeToggle dark={dark} toggle={toggleDark} />
          </div>
        </div>

        {/* Stats */}
        <StatsBar tasks={tasks} />

        {/* Search */}
        <div className="mb-4">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        {/* Add Task */}
        <TaskInput onAdd={handleAdd} categories={allCategories} />

        {/* Filters */}
        <FilterBar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categories={allCategories}
        />

        {/* Batch Actions */}
        {batchMode && (
          <BatchActions
            selectedIds={selectedIds}
            tasks={filteredTasks}
            onClearSelection={() => setSelectedIds(new Set())}
            onDeleteSelected={handleDeleteSelected}
            onMarkSelected={handleMarkSelected}
          />
        )}

        {/* Task List */}
        {loading ? (
          <SkeletonList />
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {search ? 'No matching tasks' : 'No tasks yet — add one above'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={handleDelete}
              onUpdate={(id, fields) => { updateTask(id, fields); }}
              onReorder={reorderTasks}
              selectedIds={selectedIds}
              onSelect={batchMode ? handleSelect : undefined}
              onOpenDetail={setDetailTask}
            />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {detailTask && (
        <TaskDetailPanel
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onUpdate={updateTask}
          onDelete={handleDelete}
        />
      )}

      {/* Toast */}
      <ToastContainer toasts={toasts} />
    </main>
  );
}
