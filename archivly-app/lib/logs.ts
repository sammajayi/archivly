import { supabase } from './supabase';
import type { LogRow, Outcome } from '../types/database';

export interface NewLogInput {
  title: string;
  outcome: Outcome;
  date: string; // YYYY-MM-DD
  note?: string | null;
  category?: string | null;
}

export async function fetchRecentLogs(limit = 20): Promise<LogRow[]> {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function createLog(input: NewLogInput): Promise<LogRow> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  const { data, error } = await supabase
    .from('logs')
    .insert({
      user_id: user.id,
      title: input.title,
      outcome: input.outcome,
      date: input.date,
      note: input.note?.trim() ? input.note.trim() : null,
      category: input.category?.trim() ? input.category.trim() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
