import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Camera } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ---- Featured: cinematic full-bleed cover with gold eyebrow ---- */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-7 sm:p-10 lg:min-h-[640px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,15,14,0.15),rgba(15,15,14,0.55)_55%,rgba(15,15,14,0.94))]" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[var(--slot4-gold-soft)]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[580px]">
          <span className={`${dc.type.eyebrow}`}>{label}</span>
          <h3 className="editable-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{getEditableExcerpt(post, 180)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-gold)] px-6 py-3 text-sm font-semibold text-[var(--slot4-maroon-deep)]">
            View story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ---- Compact rail: portrait tile for horizontal scrolls ---- */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(15,15,14,0.85))]" />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--slot4-gold)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slot4-maroon-deep)]">No. {String(index + 1).padStart(2, '0')}</span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${pal.goldText}`}>{getEditableCategory(post)}</p>
          <h3 className="editable-display mt-1.5 line-clamp-2 text-lg font-semibold leading-tight text-white">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}

/* ---- Editorial list: numbered index row ---- */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="editable-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-dark-bg)] text-base font-semibold text-[var(--slot4-gold)]">{String(index + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${pal.goldText}`}>{getEditableCategory(post)}</p>
          <h3 className="editable-display mt-1.5 line-clamp-2 text-xl font-semibold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:text-[var(--slot4-gold)]" />
      </div>
    </Link>
  )
}

/* ---- Horizontal: media + body split ---- */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-2 sm:py-5 sm:pr-5">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)} · No. {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-tight text-[var(--slot4-page-text)] sm:text-3xl">{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.softMutedText}`}>{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-gold)]">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  )
}

/* ---- Image-first: standard cover card with hover caption ---- */
export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(15,15,14,0.78))] opacity-90" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-dark-bg)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-gold)] backdrop-blur-sm">
          <Camera className="h-3 w-3" /> {getEditableCategory(post)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="editable-display line-clamp-2 text-xl font-semibold leading-tight text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-gold)]">{post.title}</h3>
        <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}
