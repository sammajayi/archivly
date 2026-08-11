function LogMock() {
  return (
    <div className="w-full max-w-[220px] rounded-card border border-border bg-background p-3 text-left">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">Hit a new deadlift PR</span>
        <span className="rounded-full bg-win px-2 py-0.5 text-[10px] font-semibold text-white">WIN</span>
      </div>
      <p className="mt-1 text-xs text-text-secondary">Today · Fitness</p>
    </div>
  );
}

function StatsMock() {
  const bars = [40, 70, 55, 90, 65];
  return (
    <div className="flex w-full max-w-[220px] items-end gap-1.5 rounded-card border border-border bg-background p-3">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-sm bg-primary" style={{ height: `${h}px`, opacity: 0.5 + i * 0.1 }} />
      ))}
    </div>
  );
}

function SummaryMock() {
  return (
    <div className="w-full max-w-[220px] rounded-card border-l-4 border-l-primary border-y border-r border-border bg-background p-3 text-left">
      <p className="text-xs italic leading-relaxed text-text-primary">
        "You logged 14 activities this month -- your most active yet. Fitness dominated your wins..."
      </p>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Log in plain English',
    description: 'Write what happened in a sentence -- pick win, loss, or neutral, tag a category if you want.',
    mock: <LogMock />,
  },
  {
    title: 'See your patterns',
    description: 'A stats dashboard with streaks, win-loss ratios, and a heatmap of everything you have logged.',
    mock: <StatsMock />,
  },
  {
    title: 'AI-written recaps',
    description: 'Weekly and monthly summaries that call out real patterns -- not just a pat on the back.',
    mock: <SummaryMock />,
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">Everything you need to track, nothing you don't</h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col items-center gap-4 text-center">
            {f.mock}
            <h3 className="text-lg font-semibold text-text-primary">{f.title}</h3>
            <p className="text-sm text-text-secondary">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
