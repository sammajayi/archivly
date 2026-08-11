import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy -- Archivly',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 rounded-card border border-loss bg-surface p-4 text-sm text-loss">
        Placeholder content -- needs real legal copy from counsel before launch. Not yet reviewed.
      </div>

      <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
      <p className="mt-2 text-sm text-text-secondary">Last updated: [date]</p>

      <div className="mt-8 flex flex-col gap-6 text-base leading-relaxed text-text-primary">
        <section>
          <h2 className="text-lg font-semibold">What we collect</h2>
          <p className="mt-2 text-text-secondary">
            [Placeholder] Account information (email), the activity logs you create, and basic usage analytics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">How we use it</h2>
          <p className="mt-2 text-text-secondary">
            [Placeholder] To operate the app, generate AI summaries of your own logs, and improve the product.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">AI summaries</h2>
          <p className="mt-2 text-text-secondary">
            [Placeholder] Your log entries are sent to a third-party AI provider to generate weekly/monthly recaps.
            [Name provider, retention policy, and opt-out details here.]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Data retention & deletion</h2>
          <p className="mt-2 text-text-secondary">
            [Placeholder] How long we keep data, and how to request deletion of your account and logs.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-2 text-text-secondary">[Placeholder] privacy@archivly.app</p>
        </section>
      </div>
    </main>
  );
}
