'use client';

import { useState, useEffect, useCallback } from 'react';

type Task = { id: string; content: string; status: string; created_at: string; source: string };

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

type Filter = 'all' | 'todo' | 'done';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('todo');
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`/api/tasks?status=${filter}`);
    if (res.ok) setTasks(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async () => {
    if (!newTask.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': '' },
      body: JSON.stringify({ content: newTask.trim() }),
    });
    setNewTask('');
    fetchTasks();
  };

  const toggleTask = async (id: string, status: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-api-key': '' },
      body: JSON.stringify({ status: status === 'todo' ? 'done' : 'todo' }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: { 'x-api-key': '' } });
    fetchTasks();
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'todo', label: 'Todo' }, { key: 'done', label: 'Done' }, { key: 'all', label: 'All' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">✓ Todo</h1>

        {/* Add task */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={addTask}
            className="px-5 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-1 mb-6 bg-gray-200 rounded-xl p-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-center text-gray-400 py-12">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No tasks yet</div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all group"
              >
                <button
                  onClick={() => toggleTask(task.id, task.status)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    task.status === 'done'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.status === 'done' && <span className="text-xs">✓</span>}
                </button>
                <span className={`flex-1 ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.content}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">{relativeTime(task.created_at)}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
