'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  // Top-level nav intentionally excludes task landing pages (no direct links).
  const links = [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/85 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[78px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-surface-bg)] transition group-hover:border-[var(--slot4-gold)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-7 w-7 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[220px] truncate text-[1.35rem] font-semibold leading-none tracking-[0.04em]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1.5 block max-w-[220px] truncate text-[9px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        {/* Center links */}
        <div className="mx-auto hidden items-center gap-1 lg:flex">
          {links.slice(0, 6).map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] transition ${
                  active ? 'text-[var(--slot4-gold)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-4 -bottom-0.5 h-px bg-[var(--slot4-gold)]" /> : null}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setSearch((value) => !value)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-gold)] hover:text-[var(--slot4-gold)] md:inline-flex"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--editable-cta-text)] shadow-[0_8px_24px_rgba(133,159,61,0.35)] transition hover:brightness-110 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-gold)] sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--editable-cta-text)] shadow-[0_8px_24px_rgba(133,159,61,0.35)] transition hover:brightness-110 sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Get Started
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Slide-down search (desktop) */}
      {search ? (
        <div className="hidden border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] md:block">
          <form action="/search" className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <Search className="h-5 w-5 shrink-0 text-[var(--slot4-gold)]" />
            <input
              name="q"
              type="search"
              autoFocus
              placeholder="Search galleries, profiles, topics…"
              className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button className="rounded-full bg-[var(--slot4-accent-fill)] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">Search</button>
          </form>
        </div>
      ) : null}

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-5 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2.5">
            <Search className="h-4 w-4 text-[var(--slot4-gold)]" />
            <input name="q" type="search" placeholder="Search…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]" />
          </form>
          <div className="grid gap-1">
            {[...links, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Get Started', href: '/signup' }])].map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] ${
                    active
                      ? 'border-[var(--slot4-gold)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-gold)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
