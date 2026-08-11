import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { sendWaitlistConfirmation } from '../../../lib/resend';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const { error } = await supabase.from('waitlist').insert({ email });

  if (error) {
    // Unique violation -- already on the list, treat as a success from the caller's POV.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, alreadyJoined: true });
    }
    console.error('Waitlist insert failed', error);
    return NextResponse.json({ error: 'Could not join the waitlist. Try again shortly.' }, { status: 500 });
  }

  try {
    await sendWaitlistConfirmation(email);
  } catch (err) {
    // Signup itself succeeded -- don't fail the request over a flaky email send.
    console.error('Waitlist confirmation email failed', err);
  }

  return NextResponse.json({ ok: true });
}
