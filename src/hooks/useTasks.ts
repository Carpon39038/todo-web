'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { supabase } from '@/lib/supabase-client';

const headers: Record<string, string> = { 'Content-Type': 'application/json' };
const apiKey = process.env.NEXT_PUBLIC_TODO_API_KEY;
if (apiKey) headers['x-api-key'] = apiKey;

export function useTasks(status: TaskStatus | 'all', category?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchTasks = useCallback(async () => {
    const params = new URLSearchParams({ status: category ? 'all' : status });
    if (category) params.set('category', category);
    const res = await fetch(`/api/tasks?${params}`, { headers: headers });
    if (res.ok) {
      const data = await res.json();
      let filtered = data;
      if (category && status !== 'all') filtered = data.filter((t: Task) => t.status === status);
      setTasks(filtered);
    }
    setLoading(false);
  }, [status, category]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('tasks-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        fetchTasks();
      })
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [fetchTasks]);

  const addTask = useCallback(async (fields: Partial<Task>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers,
      body: JSON.stringify(fields),
    });
    if (res.ok) fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, fields: Partial<Task>) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(fields),
    });
    fetchTasks();
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: headers });
    fetchTasks();
  }, [fetchTasks]);

  const reorderTasks = useCallback(async (reordered: Task[]) => {
    await Promise.all(reordered.map((t, i) =>
      fetch(`/api/tasks/${t.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sort_order: i }),
      })
    ));
    setTasks(reordered.map((t, i) => ({ ...t, sort_order: i })));
  }, []);

  return { tasks, loading, addTask, updateTask, deleteTask, reorderTasks, refetch: fetchTasks };
}
