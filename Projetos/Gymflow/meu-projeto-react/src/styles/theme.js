/**
 * Central design tokens for GymFlow.
 * Import these wherever you need inline styles instead of hardcoding values.
 *
 * Usage:
 *   import { colors, radius, font } from '../styles/theme'
 *   <div style={{ background: colors.bg, borderRadius: radius.md }}>
 */

export const colors = {
  // Backgrounds
  bg:        '#050505',
  bgCard:    '#0A0A0A',
  bgInput:   '#181818',
  bgOverlay: 'rgba(0,0,0,0.9)',
  bgModal:   '#0E0E0E',
  bgHeader:  '#070707',
  bgDone:    '#071207',
  bgNext:    '#0D0D0D',
  bgWorkout: '#0E0C00',

  // Borders
  border:       '#1E1E1E',
  borderSubtle: '#141414',
  borderDone:   '#1A2E1A',
  borderNext:   '#3A2E00',
  borderAccent: '#262626',

  // Text
  textPrimary:   '#F0F0F0',
  textSecondary: '#9CA3AF',
  textMuted:     '#555',
  textDimmed:    '#444',
  textDark:      '#333',

  // Accent
  yellow:      '#FFD600',
  yellowDark:  '#261D00',
  green:       '#16A34A',
  greenText:   '#4ADE80',
  greenBg:     'rgba(22,163,74,0.07)',
  greenBorder: 'rgba(22,163,74,0.15)',
  red:         '#EF4444',
  redBg:       '#1A0808',
  redBorder:   '#4A1010',
};

export const radius = {
  sm:   4,
  md:   8,
  lg:   10,
  xl:   12,
  xxl:  14,
  pill: 999,
};

export const font = {
  family: "'Rajdhani', sans-serif",
  size: {
    xs:  9,
    sm:  10,
    md:  11,
    base: 13,
    lg:  14,
    xl:  16,
    h2:  17,
    h1:  20,
  },
};

/** Base style for all text inputs and selects */
export const inputStyle = {
  width:        '100%',
  background:   colors.bgInput,
  border:       `1px solid ${colors.borderAccent}`,
  borderRadius: radius.md,
  padding:      '10px 12px',
  color:        colors.textPrimary,
  fontSize:     font.size.lg,
  fontFamily:   font.family,
  outline:      'none',
  marginBottom: 12,
};

/** Primary action button (yellow) */
export const btnPrimary = {
  background:   colors.yellow,
  border:       'none',
  color:        '#000',
  padding:      '12px',
  borderRadius: radius.md,
  cursor:       'pointer',
  fontSize:     font.size.lg,
  fontWeight:   700,
  letterSpacing: 1,
  fontFamily:   font.family,
};

/** Danger button (red outline) */
export const btnDanger = {
  background:   colors.redBg,
  border:       `1px solid ${colors.redBorder}`,
  color:        colors.red,
  padding:      '10px 14px',
  borderRadius: radius.md,
  cursor:       'pointer',
  fontSize:     font.size.base,
};