import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Dark-premium task surfaces.

  Every task (archive + detail) shares one cohesive identity: deep maroon-black
  canvas, ember-orange accent, soft gold hairlines and a modern serif display
  face paired with a clean sans body. Per-task copy (kicker / note) still varies
  so each section keeps a little voice, but the visual language is unified.
  Tokens are delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Fraunces', Georgia, 'Times New Roman', serif"
const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared dark-premium palette — every task inherits this; only kicker/note differ.
const base = {
  dark: true,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#141413',
  surface: '#1a1a19',
  raised: '#23231f',
  text: '#f6fcdf',
  muted: '#c2caa3',
  line: 'rgba(246,252,223,0.13)',
  accent: '#a3c054',
  accentSoft: 'rgba(133,159,61,0.16)',
  onAccent: '#141413',
  glow: 'rgba(49,81,30,0.55)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Stories', note: 'In-depth reads, guides and stories worth your time.' },
  listing: { ...base, kicker: 'Directory', note: 'Find, compare and connect with trusted businesses.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and listings, ready to act on.' },
  image: { ...base, kicker: 'Gallery', note: 'A curated visual feed of standout work and galleries.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Curated resources and links worth saving.' },
  pdf: { ...base, kicker: 'Library', note: 'Downloadable guides, reports and references.' },
  profile: { ...base, kicker: 'People', note: 'Discover the makers, businesses and profiles behind the work.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-gold': '#a3c054',
    '--tk-gold-soft': 'rgba(133,159,61,0.22)',
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
