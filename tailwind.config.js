/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // Archivly ships one calm light theme (PRD 6.2) -- no dark mode. 'class'
  // (vs. the default 'media') keeps NativeWind from auto-syncing to the
  // system color scheme on web, which otherwise throws on load.
  darkMode: 'class',
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
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
