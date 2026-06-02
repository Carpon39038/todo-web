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

export default function Home() {
  const { dark, toggle: toggleDark } = useDarkMode();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('todo');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchMode, setBatchMode] = useState(false);
  const { query, debounced: search, setQuery } = useSearch();

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
      result = result.filter(t => t.content.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)));
    }
    return result;
  }, [tasks, categoryFilter, statusFilter, priorityFilter, search]);

  const toggleTask = (id: string, status: string) => {
    updateTask(id, { status: status === 'todo' ? 'done' : 'todo' });
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
  };

  const handleMarkSelected = (newStatus: 'todo' | 'done') => {
    selectedIds.forEach(id => updateTask(id, { status: newStatus }));
    setSelectedIds(new Set());
  };

  const allCategories = ['general', 'work', 'personal', 'shopping', 'health'];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">✓ Todo</h1>
          <div className="flex gap-2">
            <button onClick={() => setBatchMode(b => !b)} className={`px-3 py-2 rounded-lg text-sm transition-colors ${batchMode ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              ☑️ Select
            </button>
            <DarkModeToggle dark={dark} toggle={toggleDark} />
          </div>
        </div>

        <div className="mb-4">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <TaskInput onAdd={addTask} categories={allCategories} />

        <FilterBar
          status={statusFilter}
          onStatusChange={setStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categories={allCategories}
        />

        {batchMode && (
          <BatchActions
            selectedIds={selectedIds}
            tasks={filteredTasks}
            onClearSelection={() => setSelectedIds(new Set())}
            onDeleteSelected={handleDeleteSelected}
            onMarkSelected={handleMarkSelected}
          />
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onReorder={reorderTasks}
            selectedIds={selectedIds}
            onSelect={batchMode ? handleSelect : undefined}
          />
        )}
      </div>
    </main>
  );
}
