import { NextRequest, NextResponse } from 'next/server';
import { supabase, API_KEY } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { content, source } = await req.json();
  if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

  const { data, error } = await supabase
    .from('tasks')
    .insert({ content, source: source || 'openclaw' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') || 'all';
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
