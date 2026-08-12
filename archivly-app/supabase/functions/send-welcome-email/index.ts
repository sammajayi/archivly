// Supabase Edge Function: sends a welcome email to a newly confirmed user.
//
// Triggered server-side by a Postgres trigger on auth.users (see schema.sql),
// so it fires for every sign-up method (email + Google) without the mobile
// client doing anything. Runs on an anonymous HTTP call carrying the new
// user's email and name, guarded by a shared secret so only our own trigger
// (and developers) can invoke it.
//
// The Resend API key lives only in the function's env vars -- never in the
// EXPO_PUBLIC_* mobile bundle.

import { Resend } from 'npm:resend@4';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Archivly <sam@archivly.xyz>';
// Shared secret set alongside RESEND_API_KEY. The DB trigger sends it in the
// x-welcome-secret header so the function can't be abused as a spam relay.
const WELCOME_SECRET = Deno.env.get('WELCOME_SECRET');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-welcome-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

interface WelcomeRequestBody {
  email: string;
  name?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not set');
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }
  if (!WELCOME_SECRET || req.headers.get('x-welcome-secret') !== WELCOME_SECRET) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  let body: WelcomeRequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return jsonResponse({ error: 'email is required' }, 400);
  }

  const name = body.name?.trim();
  const firstName = name ? name.split(/\s+/)[0] : 'there';

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Archivly",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #111827; line-height: 1.7;">
        <p>Hey ${firstName},</p>
        <p>I'm Samuel, the guy behind Archivly.</p>
        <p>
          The name comes from "archive": a collection of records kept for the
          long haul. Fitting, because that's exactly why I built this. I always
          struggled to journal, and I kept forgetting what I'd actually done
          with my time. Wins, setbacks, small milestones... all of it just
          slipped away.
        </p>
        <p>
          Your account is live, so here's the only thing that matters right now:
          log something. A win from today, a loss you're still shaking off,
          anything at all. It takes under 30 seconds, and a year from now you'll
          be glad you did.
        </p>
        <p>
          If you ever want to say hi, ask a question, or tell me what's missing,
          I read everything. Reply to this email, or write me directly at
          <a href="mailto:sam@archivly.xyz" style="color: #2563EB; text-decoration: none;">sam@archivly.xyz</a>.
        </p>
        <p>Talk soon,<br/>Samuel<br/>Creator, Archivly<br/><a href="https://x.com/sammajayi" style="color: #2563EB; text-decoration: none;">x.com/sammajayi</a></p>
      </div>
    `,
  });

  if (error) {
    console.error('Welcome email send failed', error);
    return jsonResponse({ error: 'Failed to send welcome email' }, 502);
  }

  return jsonResponse({ ok: true }, 200);
});
