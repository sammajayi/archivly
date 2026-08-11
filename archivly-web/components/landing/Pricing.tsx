import { PlayStoreButton } from '../shared/PlayStoreButton';

const FREE_FEATURES = ['Unlimited activity logging', 'Full stats dashboard', '1 AI summary per month'];
const PRO_FEATURES = ['Everything in Free', 'Unlimited AI summaries', 'Priority support'];

export function Pricing() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">Pricing</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-text-primary">Free</h3>
          <p className="text-3xl font-bold text-text-primary">$0</p>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            {FREE_FEATURES.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-card border border-primary bg-surface p-6">
          <h3 className="text-lg font-semibold text-text-primary">Archivly Pro</h3>
          <p className="text-3xl font-bold text-text-primary">
            $[price]<span className="text-base font-normal text-text-secondary">/mo</span>
          </p>
          <ul className="flex flex-col gap-2 text-sm text-text-secondary">
            {PRO_FEATURES.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
          <PlayStoreButton className="mt-2" />
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-text-secondary">Pro pricing not finalized -- Phase 2.</p>
    </section>
  );
}
