import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-sm text-text-secondary sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Archivly. All rights reserved.</p>
        <nav className="flex gap-6">
          <Link href="/privacy" className="hover:text-text-primary">
            Privacy
          </Link>
          <a href="mailto:sam@archivly.xyz" className="hover:text-text-primary">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
