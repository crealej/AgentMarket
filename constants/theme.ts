// Aarhus Engine Design System
// Industrial Digital aesthetic

export const colors = {
  // Surface hierarchy
  surface: '#0b1326',
  surfaceContainer: '#131b2e',
  surfaceContainerLow: '#171f33',
  surfaceContainerHigh: '#222a3d',
  surfaceContainerHighest: '#2a3449',

  // Primary
  primary: '#abc7ff',
  primaryContainer: '#277be7',
  onPrimary: '#002f65',

  // Secondary
  secondary: '#6b7280',
  secondaryContainer: '#45474b',

  // Tertiary (Verified/Accent)
  tertiary: '#00e1ab',
  tertiaryFixed: '#00b894',

  // Error
  error: '#ffb4ab',
  errorContainer: '#ff6b6b',

  // Text
  onSurface: '#dae2fd',
  onSurfaceVariant: '#8f9095',
  outline: '#45474b',
  outlineVariant: '#222a3d',
}

export const typography = {
  display: {
    fontFamily: 'Space Grotesk',
    fontWeight: '700' as const,
  },
  headline: {
    fontFamily: 'Space Grotesk',
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'Inter',
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: 'Space Grotesk',
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 2,
  },
  mono: {
    fontFamily: 'monospace',
    fontWeight: '400' as const,
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
}

export const borderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
}

export const shadows = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  glow: {
    shadowColor: colors.tertiary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
}

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
}
