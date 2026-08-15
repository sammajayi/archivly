// Supabase Edge Function: generates an AI narrative recap of a user's logs
// for a week or month. Runs server-side so the Groq API key never ships
// in the mobile bundle -- only EXPO_PUBLIC_* vars are safe there, and this
// key is not one of them.
//
// Free tier: 1 AI summary per calendar month. Not enforced here yet -- this
// is a Phase 2 paywall concern. When it's wired up, check usage (e.g. a
// summaries table keyed by user_id + month) before calling Groq and
// return a 402-style response if the caller is over quota.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
// Groq's free-tier "instant" model -- cheap/fast, good enough for a short recap.
const GROQ_MODEL = 'llama-3.1-8b-instant';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

interface SummaryRequestBody {
  period: 'week' | 'month';
  periodLabel: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

interface LogForSummary {
  title: string;
  outcome: 'win' | 'loss' | 'neutral';
  date: string;
  note: string | null;
  category: string | null;
}

function buildPrompt(body: SummaryRequestBody, logs: LogForSummary[]): string {
  const wins = logs.filter((l) => l.outcome === 'win').length;
  const losses = logs.filter((l) => l.outcome === 'loss').length;
  const neutrals = logs.filter((l) => l.outcome === 'neutral').length;

  const categoryCounts = new Map<string, number>();
  for (const log of logs) {
    if (log.category) categoryCounts.set(log.category, (categoryCounts.get(log.category) ?? 0) + 1);
  }
  const topCategories = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  const logLines = logs
    .map((l) => `- ${l.date} [${l.outcome.toUpperCase()}]${l.category ? ` (${l.category})` : ''}: ${l.title}${l.note ? ` -- ${l.note}` : ''}`)
    .join('\n');

  return `You are writing a short recap of someone's ${body.period} of logged activities for the Archivly app. Tone: plain and direct, like a friend giving a quick factual rundown -- not motivational, no hype or coach-speak, no generic encouragement. State what was actually logged, by name (e.g. "you submitted the assignment and hit a new PR"). Only call out a gap or pattern (a stretch of losses, a category going quiet) if it's genuinely notable -- don't force one in. 1-3 sentences, second person ("you"), plain narrative paragraph, no headers or bullet points.

Period: ${body.periodLabel}
Totals: ${logs.length} activities logged -- ${wins} wins, ${losses} losses, ${neutrals} neutral.
Top categories: ${topCategories.length > 0 ? topCategories.map(([c, n]) => `${c} (${n})`).join(', ') : 'none logged'}.

Raw entries:
${logLines}

Write the recap now.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GROQ_API_KEY) {
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Missing Authorization header' }, 401);
  }

  // Scoped to the caller's own JWT -- RLS on public.logs restricts every
  // query below to auth.uid(), so this function can never read another
  // user's logs even though it never touches a service-role key.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return jsonResponse({ error: 'Invalid or expired session' }, 401);
  }

  let body: SummaryRequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (body.period !== 'week' && body.period !== 'month') {
    return jsonResponse({ error: 'period must be "week" or "month"' }, 400);
  }
  if (!body.start || !body.end || !body.periodLabel) {
    return jsonResponse({ error: 'start, end, and periodLabel are required' }, 400);
  }

  const { data: logs, error: logsError } = await supabase
    .from('logs')
    .select('title, outcome, date, note, category')
    .gte('date', body.start)
    .lte('date', body.end)
    .order('date', { ascending: true });

  if (logsError) {
    return jsonResponse({ error: logsError.message }, 500);
  }

  if (!logs || logs.length === 0) {
    return jsonResponse(
      { summary: `Nothing logged for ${body.periodLabel} yet. Log a few activities and generate your recap once you have some to look back on.` },
      200
    );
  }

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 200,
      // Lower temperature keeps the recap literal (what was logged) instead
      // of drifting into flowery, motivational phrasing.
      temperature: 0.3,
      messages: [{ role: 'user', content: buildPrompt(body, logs) }],
    }),
  });

  if (!groqRes.ok) {
    console.error('Groq API error', groqRes.status, await groqRes.text());
    return jsonResponse({ error: 'Failed to generate summary' }, 502);
  }

  const groqData = await groqRes.json();
  const summary = groqData.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    return jsonResponse({ error: 'Empty response from Groq' }, 502);
  }

  return jsonResponse({ summary }, 200);
});
