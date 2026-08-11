import { CountdownTimer } from './CountdownTimer';
import { WaitlistForm } from './WaitlistForm';

const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? '2026-10-01T00:00:00Z';

export function ComingSoon() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary">Coming soon</span>
        <h1 className="max-w-2xl text-4xl font-bold text-text-primary sm:text-5xl">
          Log your wins, losses, and milestones.
        </h1>
        <p className="max-w-xl text-lg text-text-secondary">
          Archivly is a mobile-first activity log. Write it down in plain English, track your patterns, and get
          AI-generated recaps of your week and month.
        </p>
      </div>

      <CountdownTimer launchDate={LAUNCH_DATE} />

      <WaitlistForm />

      <p className="text-xs text-text-secondary">No spam -- just one email when we launch.</p>
    </main>
  );
}
