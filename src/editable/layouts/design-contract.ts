import type { CSSProperties } from 'react'

export const editableRootStyle = {
  // Dark-premium system: charcoal canvas, forest + olive greens, soft cream
  // hairlines and pale-cream text. Cinematic, editorial, organic, expensive.
  '--slot4-page-bg': '#141413',
  '--slot4-page-text': '#f6fcdf',
  '--slot4-panel-bg': '#1f1f1c',
  '--slot4-surface-bg': '#1a1a19',
  '--slot4-muted-text': '#c2caa3',
  '--slot4-soft-muted-text': '#8b9270',
  '--slot4-accent': '#a3c054',
  '--slot4-accent-fill': '#31511e',
  '--slot4-accent-soft': 'rgba(133,159,61,0.16)',
  '--slot4-on-accent': '#f6fcdf',
  '--slot4-gold': '#a3c054',
  '--slot4-gold-soft': 'rgba(133,159,61,0.22)',
  '--slot4-maroon': '#31511e',
  '--slot4-maroon-deep': '#1f3314',
  '--slot4-dark-bg': '#0f0f0e',
  '--slot4-dark-text': '#f6fcdf',
  '--slot4-media-bg': '#23231f',
  '--slot4-cream': '#1a1a19',
  '--slot4-warm': '#191a14',
  '--slot4-lavender': '#1a1a19',
  '--slot4-gray': '#191a14',
  '--slot4-body-gradient':
    'radial-gradient(130% 90% at 50% -15%, rgba(49,81,30,0.55), transparent 58%), radial-gradient(90% 70% at 100% 0%, rgba(133,159,61,0.18), transparent 55%)',
  '--editable-page-bg': '#141413',
  '--editable-page-text': '#f6fcdf',
  '--editable-container': '1480px',
  '--editable-border': 'rgba(246,252,223,0.13)',
  '--editable-nav-bg': '#121211',
  '--editable-nav-text': '#f6fcdf',
  '--editable-nav-active': '#a3c054',
  '--editable-nav-active-text': '#141413',
  '--editable-cta-bg': '#31511e',
  '--editable-cta-text': '#f6fcdf',
  '--editable-search-bg': '#1f1f1c',
  '--editable-footer-bg': '#0f0f0e',
  '--editable-footer-text': '#f6fcdf',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-gold)]',
  goldText: 'text-[var(--slot4-gold)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_2px_18px_rgba(0,0,0,0.45)]',
  shadowStrong: 'shadow-[0_18px_60px_rgba(0,0,0,0.55)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(15,15,14,0.05),rgba(15,15,14,0.88))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[150px] shrink-0 snap-start sm:w-[170px]',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]',
    heroTitle:
      'editable-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] sm:text-5xl lg:text-[3.6rem]',
    sectionTitle: 'editable-display text-3xl font-semibold tracking-[-0.02em] sm:text-[2.6rem]',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold tracking-[0.02em] text-[var(--slot4-on-accent)] shadow-[0_10px_30px_rgba(49,81,30,0.5)] transition duration-300 hover:brightness-125 hover:-translate-y-0.5 active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-transparent px-7 py-3.5 text-sm font-semibold tracking-[0.02em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-gold)] hover:text-[var(--slot4-gold)] active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-gold)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-maroon-deep)] transition duration-300 hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(0,0,0,0.6)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
