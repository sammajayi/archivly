const TESTIMONIALS = [
  { quote: '[Placeholder testimonial -- swap in a real quote before launch.]', name: 'Name, Title' },
  { quote: '[Placeholder testimonial -- swap in a real quote before launch.]', name: 'Name, Title' },
  { quote: '[Placeholder testimonial -- swap in a real quote before launch.]', name: 'Name, Title' },
];

export function SocialProof() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">What people are saying</h2>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="rounded-card border border-border bg-surface p-5">
            <p className="text-sm italic text-text-secondary">{t.quote}</p>
            <p className="mt-4 text-sm font-medium text-text-primary">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
