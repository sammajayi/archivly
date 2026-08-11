// Design tokens from the Archivly PRD (section 6.2/6.3).
// Kept as plain JS values (not just Tailwind classes) so they can be used
// directly in places NativeWind classes can't reach, e.g. status bar style,
// native Date picker theming, chart libraries.

export const colors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  primary: '#5B21B6',
  win: '#16A34A',
  loss: '#DC2626',
  neutral: '#9CA3AF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
} as const;

export const radius = {
  card: 12,
} as const;

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  italic: 'Inter_400Regular_Italic',
} as const;
