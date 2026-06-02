export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  content: string;
  status: TaskStatus;
  source: string;
  category: string;
  priority: Priority;
  due_date: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_CATEGORIES = ['general', 'work', 'personal', 'shopping', 'health'];
