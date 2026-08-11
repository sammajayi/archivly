import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Archivly -- log your wins, losses, and milestones',
  description:
    'Archivly is a mobile-first activity log. Log wins, losses, and milestones in free-form text and get AI-generated recaps of your week and month.',
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Plausible Analytics -- chosen over PostHog for a one-line, no-cookie-banner
            script tag with no client SDK to wire up (see README). */}
        {plausibleDomain ? (
          <script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        ) : null}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
