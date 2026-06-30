import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Filter, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Ads } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /listing/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 7 === 0

  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-gold-soft)] hover:shadow-[0_30px_72px_rgba(0,0,0,0.6)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,15,14,0.85))]" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-dark-bg)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-gold)] backdrop-blur-sm">{taskLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {!image ? <span className="w-fit rounded-full border border-[var(--slot4-gold-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-gold)]">{taskLabel}</span> : null}
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-gold)]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-gold)]">Open result <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  )
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Search hero */}
        <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(49,81,30,0.5),transparent_70%)]" />
          <div className={`relative py-16 sm:py-20 ${container}`}>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-gold)]">
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.search.hero.badge}
              </span>
              <h1 className="editable-display mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
                {pagesContent.search.hero.title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
            </div>

            <form action="/search" className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.5)] sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3.5 transition focus-within:border-[var(--slot4-gold)]">
                <Search className="h-5 w-5 shrink-0 text-[var(--slot4-gold)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 transition focus-within:border-[var(--slot4-gold)]">
                  <Filter className="h-4 w-4 text-[var(--slot4-gold)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition focus:border-[var(--slot4-gold)]">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(49,81,30,0.5)] transition hover:brightness-125" type="submit">
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Ad #1 — leaderboard */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Ads slot="header" showLabel eager className="mx-auto w-full" />
        </div>

        <section className={`pb-16 sm:pb-20 ${container}`}>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--editable-border)] pb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-gold)]">{results.length} results</p>
              <h2 className="editable-display mt-2 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{query ? `Results for “${query}”` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-gold)] hover:text-[var(--slot4-gold)]">Back to home <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--slot4-gold)]" />
              <p className="editable-display mt-5 text-2xl font-semibold tracking-[-0.02em]">No matching posts found.</p>
              <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">Try a different keyword, content type, or category.</p>
            </div>
          )}

          {/* Ad #2 — medium rectangle */}
          <div className="mx-auto mt-12 max-w-6xl px-4 py-6">
            <Ads slot="sidebar" showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
