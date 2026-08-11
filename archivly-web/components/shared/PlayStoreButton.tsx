const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? 'https://play.google.com/store/apps/details?id=com.archivly.app';

export function PlayStoreButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-card bg-primary px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 ${className}`}
    >
      Download on Android
    </a>
  );
}
