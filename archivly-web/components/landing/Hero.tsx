import { PlayStoreButton } from '../shared/PlayStoreButton';

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
      <h1 className="max-w-2xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
        Log your wins, losses, and milestones.
      </h1>
      <p className="max-w-xl text-lg text-text-secondary">
        Archivly turns free-form notes into a real record of your progress -- then hands you an honest, AI-written
        recap of your week and month.
      </p>
      <PlayStoreButton />
    </section>
  );
}
