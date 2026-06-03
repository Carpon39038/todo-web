import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const API_KEY = process.env.TODO_API_KEY;

function checkAuth(req: NextRequest): boolean {
  if (!API_KEY) return true; // No key configured = open
  return req.headers.get('x-api-key') === API_KEY;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { content, source, category, priority, due_date, tags } = await req.json();
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

  const { data, error } = await supabase
    .from('tasks')
    .insert({ content, source: source || 'openclaw', category: category || 'general', priority: priority || 'medium', due_date: due_date || null, tags: tags || [] })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const status = req.nextUrl.searchParams.get('status') || 'all';
  const category = req.nextUrl.searchParams.get('category');
  const priority = req.nextUrl.searchParams.get('priority');
  const search = req.nextUrl.searchParams.get('search');

  let query = supabase.from('tasks').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (status !== 'all') query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  if (priority) query = query.eq('priority', priority);
  if (search) query = query.ilike('content', `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
