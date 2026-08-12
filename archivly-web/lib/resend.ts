import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'Archivly <sam@archivly.xyz>';

export async function sendWaitlistConfirmation(email: string): Promise<void> {
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not set -- skipping waitlist confirmation email.');
    return;
  }

  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "You're on the Archivly waitlist",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
        <h1 style="font-size: 20px;">You're on the list</h1>
        <p style="color: #6B7280; line-height: 1.6;">
          Thanks for signing up for Archivly -- log your wins, losses, and milestones,
          then get AI-generated recaps of your week and month. We'll email you the
          moment we launch.
        </p>
      </div>
    `,
  });
}
