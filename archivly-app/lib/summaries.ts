import { supabase } from './supabase';
import type { PeriodRange } from './stats';

export type SummaryPeriod = 'week' | 'month';

interface GenerateSummaryResponse {
  summary: string;
}

// Calls the generate-summary Edge Function -- the Groq API key lives
// only server-side there, never in this bundle. supabase.functions.invoke
// attaches the current session's access token automatically, which the
// function uses to scope its log query to this user via RLS.
export async function generateSummary(period: SummaryPeriod, range: PeriodRange): Promise<string> {
  const { data, error } = await supabase.functions.invoke<GenerateSummaryResponse>('generate-summary', {
    body: { period, periodLabel: range.label, start: range.start, end: range.end },
  });

  if (error) throw error;
  if (!data?.summary) throw new Error('No summary returned.');
  return data.summary;
}
