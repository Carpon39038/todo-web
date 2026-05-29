# todo-web

A minimal todo list web app built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## Setup

1. Clone and install:
   ```bash
   git clone https://github.com/Carpon39038/todo-web.git
   cd todo-web
   npm install
   ```

2. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lknkmqfvigqsqqtutkhf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   TODO_API_KEY=your_api_key
   ```

3. Create the Supabase table (SQL Editor):
   ```sql
   create table tasks (
     id uuid primary key default gen_random_uuid(),
     content text not null,
     status text not null default 'todo' check (status in ('todo','done')),
     source text not null default 'openclaw',
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );
   create index idx_tasks_status_created_at on tasks(status, created_at desc);
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```

## Deploy

Push to `main` branch — auto-deploys to Vercel. Set environment variables in Vercel dashboard.

## API

All endpoints require `x-api-key` header.

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/tasks | Create task |
| GET | /api/tasks?status=todo\|done\|all | List tasks |
| PATCH | /api/tasks/[id] | Update task status |
| DELETE | /api/tasks/[id] | Delete task |
