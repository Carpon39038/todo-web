# Todo Web

A modern, full-featured todo app built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Task CRUD** — Add, edit (double-click), delete, and toggle tasks
- **Categories** — Organize tasks by category with custom category creation
- **Priority levels** — Low, Medium, High with color-coded badges
- **Due dates** — Date picker with overdue highlighting
- **Tags** — Comma-separated tags per task
- **Search** — Real-time debounced search across tasks
- **Filters** — Filter by status, category, and priority
- **Batch actions** — Select multiple tasks, bulk delete/mark done/todo
- **Drag & drop** — Sortable task list (dnd-kit)
- **Dark mode** — System preference detection + manual toggle, persisted to localStorage
- **Realtime** — Supabase realtime subscription for live updates
- **PWA** — Installable with offline caching via service worker
- **Responsive** — Clean mobile-friendly UI

## Setup

```bash
pnpm install
pnpm dev
```

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Migration

Run this SQL in your Supabase SQL editor:

```sql
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category text DEFAULT 'general';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium' CHECK (priority IN ('low','medium','high'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date timestamptz;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
```

## Tech Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Supabase (database + realtime)
- @dnd-kit (drag and drop)
- PWA with service worker
