const STEPS = [
  { number: '1', title: 'Log', description: 'Write down a win, loss, or milestone the moment it happens.' },
  { number: '2', title: 'Track', description: 'Watch your streaks, categories, and outcomes build up over time.' },
  { number: '3', title: 'Recap', description: 'Get an honest, AI-written summary of your week and month.' },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">How it works</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.number} className="relative flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              {step.number}
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{step.title}</h3>
            <p className="text-sm text-text-secondary">{step.description}</p>
            {i < STEPS.length - 1 ? (
              <div className="absolute right-[-1rem] top-6 hidden h-px w-8 bg-border sm:block" aria-hidden />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
