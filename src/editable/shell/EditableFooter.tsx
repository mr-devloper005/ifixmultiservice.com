'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(49,81,30,0.4),transparent_70%)]" />

      {/* CTA strip */}
      <div className="relative border-b border-[var(--editable-border)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-gold)]">Get started</p>
            <h2 className="editable-display mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
              Showcase your work. Grow your reputation.
            </h2>
          </div>
          <Link
            href={session ? '/create' : '/signup'}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-gold)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-maroon-deep)] transition hover:-translate-y-0.5 hover:brightness-105"
          >
            {session ? 'Create a post' : 'Get started'} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--slot4-gold-soft)] bg-[var(--slot4-surface-bg)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="editable-display text-2xl font-semibold tracking-[0.03em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-gold)]">Discover</h3>
          <div className="mt-5 grid gap-3">
            {[
              ['Home', '/'],
              ['Search', '/search'],
              ...(session ? [['Create a post', '/create']] : [['Get Started', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">
                {label} <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-gold)]">Company</h3>
          <div className="mt-5 grid gap-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Get Started', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="text-left text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]">Logout</button> : null}
          </div>
        </div>
      </div>

      <div className="relative border-t border-[var(--editable-border)] px-4 py-6 text-center text-xs font-medium tracking-[0.1em] text-[var(--slot4-soft-muted-text)]">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
