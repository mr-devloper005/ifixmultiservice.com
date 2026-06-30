import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Camera, ChevronRight, Search, Sparkles, Star,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  getEditablePostImage, postHref,
  EditorialFeatureCard, RailPostCard, ImageFirstCard, CompactIndexCard, ArticleListCard,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

// Stable hash so derived ratings stay consistent between renders.
function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
function ratingOf(post: SitePost) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const real = Number(content.rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  const h = hashStr(post.slug || post.id || post.title || 'x')
  return Math.round((4.2 + (h % 8) / 10) * 10) / 10 // 4.2 – 4.9
}

function Stars({ rating, className = 'h-3.5 w-3.5' }: { rating: number; className?: string }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`${className} ${i < rounded ? 'fill-[var(--slot4-gold)] text-[var(--slot4-gold)]' : 'fill-transparent text-[var(--slot4-soft-muted-text)]'}`}
        />
      ))}
    </span>
  )
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------- Hero --------------------------------- */
export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`

  return (
    <section className="relative">
      <div className="relative min-h-[640px] w-full overflow-hidden sm:min-h-[680px] lg:min-h-[760px]">
        <EditableHeroCollage images={heroImages} />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,15,14,0.95)_0%,rgba(20,4,8,0.82)_42%,rgba(20,4,8,0.45)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_0%_50%,rgba(49,81,30,0.45),transparent_60%)]" />
        <div className={`relative flex min-h-[640px] flex-col justify-center py-24 sm:min-h-[680px] lg:min-h-[760px] ${container}`}>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-dark-bg)]/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-gold)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> {pagesContent.home.hero.badge || 'Welcome'}
            </span>
            <h1 className="editable-display mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{pagesContent.home.hero.description}</p>

            <form action="/search" className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-dark-bg)]/70 p-2 pl-5 backdrop-blur-md">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-gold)]" />
              <input
                name="q"
                placeholder="Search galleries, profiles, topics…"
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/50"
              />
              <button className="shrink-0 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(133,159,61,0.4)] transition hover:brightness-110 sm:px-8">
                Search
              </button>
            </form>
          </div>
        </div>
        {heroImages.length ? (
          <p className="absolute bottom-5 left-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 sm:left-8">Latest on {SITE_CONFIG.name}</p>
        ) : null}
      </div>

      {/* Trust strip */}
      <div className="border-y border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
        <div className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5 text-sm text-[var(--slot4-muted-text)] ${container}`}>
          <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[var(--slot4-gold)] text-[var(--slot4-gold)]" /> Curated quality</span>
          <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4 text-[var(--slot4-gold)]" /> Visual-first discovery</span>
          <span className="hidden items-center gap-2 sm:inline-flex"><Sparkles className="h-4 w-4 text-[var(--slot4-gold)]" /> Updated daily</span>
          <Link href="/search" className="inline-flex items-center gap-1 font-semibold text-[var(--slot4-gold)] hover:underline">
            Explore the latest <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Featured gallery showcase ----------------------- */
export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  if (!pool.length) return null
  const [featured, ...rest] = pool
  const rail = rest.slice(0, 8)

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-20 sm:py-24 ${container}`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]">Featured collection</p>
          <h2 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
            The gallery experience, reimagined.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--slot4-muted-text)]">
            Hand-picked work and profiles, presented the way they deserve to be seen — bold, immersive and effortless to explore.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <EditorialFeatureCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} label="Editor's pick" />
          {rail.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {rail.slice(0, 3).map((post, index) => (
                <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          ) : null}
        </div>

        {rail.length > 3 ? (
          <div className="mt-6 flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {rail.slice(3).map((post, index) => (
              <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 3} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* -------------------- Everything in one place (split) ------------------ */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 9)
  if (!activity.length) return null
  const lead = activity[0]
  const grid = activity.slice(1, 7)

  return (
    <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-warm)]">
      <div className={`py-20 sm:py-24 ${container}`}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]">All in one place</p>
          <h2 className="editable-display mt-4 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Everything you need to explore.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--slot4-muted-text)]">
            The newest posts, profiles and finds from across {SITE_CONFIG.name} — powerful on their own, magical together.
          </p>
        </div>

        {/* Lead editorial row */}
        <div className="mt-12">
          <ArticleListCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} index={0} />
        </div>

        {/* Discovery grid */}
        {grid.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((post) => (
              <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        ) : null}

        <div className="mt-12 text-center">
          <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-gold)] hover:text-[var(--slot4-gold)]">
            Explore everything <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time-based discovery sections -------------------- */
function DiscoveryCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(15,15,14,0.7))]" />
        {category ? (
          <span className="absolute left-3 top-3 rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-dark-bg)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-gold)] backdrop-blur-sm">{category}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="editable-display line-clamp-2 text-lg font-semibold leading-tight text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-gold)]">
          {post.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={ratingOf(post)} />
          <span className="text-xs font-semibold text-[var(--slot4-muted-text)]">{ratingOf(post).toFixed(1)}</span>
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">{getExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last 7 days' },
  browse: { eyebrow: 'Trending now', title: 'Popular this month' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'border-y border-[var(--editable-border)] bg-[var(--slot4-warm)]'}>
            <div className={`py-16 sm:py-20 ${container}`}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-gold)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{copy.title}</h2>
                </div>
                <Link href="/search" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[var(--slot4-gold)] hover:underline">
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post) => (
                  <DiscoveryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ----------------------- Stats band + CTA ------------------------------ */
const stats = [
  { value: '10K+', label: 'Posts & profiles published' },
  { value: '4.9★', label: 'Average community rating' },
  { value: '500+', label: 'Active creators & businesses' },
  { value: '24/7', label: 'Always-on discovery' },
]

export function EditableHomeCta() {
  return (
    <>
      {/* Best-in-class stats */}
      <section className="border-y border-[var(--editable-border)] bg-[var(--slot4-dark-bg)]">
        <div className={`grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.3fr] lg:items-center ${container}`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]">Why we&apos;re trusted</p>
            <h2 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">Built to help you stand out.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[var(--slot4-muted-text)]">
              A single, beautifully crafted home to publish your work, grow your reputation and get discovered.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--editable-border)]">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[var(--slot4-surface-bg)] p-7">
                <p className="editable-display text-4xl font-semibold tracking-[-0.02em] text-[var(--slot4-gold)] sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="get-app" className="relative scroll-mt-24 overflow-hidden bg-[var(--slot4-maroon-deep)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_-10%,rgba(133,159,61,0.45),transparent_60%)]" />
        <div className={`relative flex flex-col items-center gap-6 py-20 text-center sm:py-28 ${container}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]">Start today</p>
          <h2 className="editable-display max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
            Got something worth sharing?
          </h2>
          <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Publish your work, add your profile, and reach the {SITE_CONFIG.name} community.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-gold)] px-8 py-3.5 text-sm font-semibold text-[var(--slot4-maroon-deep)] transition hover:-translate-y-0.5 hover:brightness-105">
              Create a post <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
