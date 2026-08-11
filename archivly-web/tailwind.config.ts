import type { Config } from 'tailwindcss';

// Same design tokens as archivly-app/tailwind.config.js (PRD 6.2/6.3) --
// keep both in sync if these change.
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#FFFFFF',
        primary: '#5B21B6',
        win: '#16A34A',
        loss: '#DC2626',
        neutral: '#9CA3AF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
      },
      borderRadius: {
        card: '12px',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};

export default config;
