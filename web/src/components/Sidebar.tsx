'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PanelLeftClose, PanelLeftOpen, Menu, X } from 'lucide-react'
import { STAGE_GROUPS, stagesByGroup } from '@/lib/stages'
import {
  CHEATSHEET_GROUPS,
  cheatsheetsByGroup,
  isDrawn,
} from '@/lib/cheatsheets'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ThemeToggle } from './ThemeToggle'

/**
 * A drawing index rather than a nav list. Sheet numbers are set in mono and
 * read as filing codes, because that is what they are — the cadence in each
 * stage's title block is the thing that actually orders the work.
 *
 * The persistent rail appears at lg. Between 768 and 1024 a 288px rail would
 * squeeze the prose column, so tablets get the drawer too.
 */
export function Sidebar() {
  const pathname = usePathname()
  const { value: collapsed, setValue: setCollapsed } = useLocalStorage(
    'playbook:sidebar-collapsed',
    false,
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [drawerOpen])

  const wordmark = (
    <span className="flex min-w-0 items-baseline gap-1.5">
      <span className="t-display text-[0.9375rem] leading-none">Playbook</span>
      <span className="t-data text-[10px] leading-none text-brand">18</span>
    </span>
  )

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-line bg-bg px-3 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          className="grid size-11 place-items-center border border-line text-muted transition-colors duration-150 hover:border-fg hover:text-fg"
        >
          <Menu className="size-4" aria-hidden />
        </button>
        <Link href="/" className="flex min-h-11 min-w-0 items-center px-1">
          {wordmark}
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-fg/60 lg:hidden"
        />
      )}

      <aside
        className={[
          'z-50 flex shrink-0 flex-col border-r border-line bg-bg',
          'fixed inset-y-0 left-0 w-[min(20rem,85vw)] transition-transform duration-150',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 lg:transition-none',
          collapsed ? 'lg:w-14' : 'lg:w-72',
        ].join(' ')}
      >
        <div
          className={[
            'flex items-center gap-1 border-b border-line px-3 py-2.5',
            collapsed ? 'lg:flex-col lg:px-2' : '',
          ].join(' ')}
        >
          {!collapsed && (
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex min-h-11 min-w-0 items-center px-1 lg:min-h-0"
            >
              {wordmark}
            </Link>
          )}
          <div
            className={[
              'ml-auto flex items-center gap-1',
              collapsed ? 'lg:ml-0 lg:flex-col' : '',
            ].join(' ')}
          >
            <span className="hidden lg:block">
              <ThemeToggle />
            </span>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand index' : 'Collapse index'}
              className="hidden size-9 place-items-center text-subtle transition-colors duration-150 hover:text-brand lg:grid"
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" aria-hidden />
              ) : (
                <PanelLeftClose className="size-4" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="grid size-11 place-items-center text-subtle transition-colors duration-150 hover:text-fg lg:hidden"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* One scroll container around both indexes. Scrolling them separately
            would give the rail two scrollbars on a short viewport, and pinning
            the reference block outside the scroll would clip it. */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          <nav aria-label="Stage index" className="shrink-0 overflow-x-hidden">
            {STAGE_GROUPS.map((group) => {
              const labelId = `idx-${group.replace(/\s+/g, '-').toLowerCase()}`
              return (
                <div
                  key={group}
                  className="border-b border-line last:border-b-0"
                >
                  {/* Not a heading: these precede the page h1 in DOM order, so
                    using one would break the document outline. */}
                  <div
                    id={labelId}
                    className={[
                      't-label px-3 pb-1 pt-4 text-subtle',
                      collapsed ? 'lg:px-0 lg:text-center' : '',
                    ].join(' ')}
                  >
                    <span className={collapsed ? 'lg:hidden' : ''}>
                      {group}
                    </span>
                    <span
                      className={collapsed ? 'hidden lg:inline' : 'hidden'}
                      aria-hidden
                    >
                      ·
                    </span>
                  </div>

                  <ul aria-labelledby={labelId}>
                    {stagesByGroup(group).map((stage) => {
                      const href = `/stages/${stage.slug}`
                      const active = pathname === href
                      return (
                        <li key={stage.slug}>
                          <Link
                            href={href}
                            onClick={() => setDrawerOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            title={
                              collapsed
                                ? `${stage.num} — ${stage.title}`
                                : undefined
                            }
                            className={[
                              'group flex min-h-11 items-center gap-3 px-3 text-sm transition-colors duration-150 lg:min-h-0 lg:py-1.5',
                              collapsed ? 'lg:justify-center lg:px-0' : '',
                              active
                                ? 'border-l-2 border-brand bg-sunken pl-[10px] font-medium text-fg'
                                : 'border-l-2 border-transparent text-muted hover:bg-sunken hover:text-fg',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                't-data shrink-0 text-[11px]',
                                active ? 'text-brand' : 'text-subtle',
                              ].join(' ')}
                            >
                              {stage.num}
                            </span>
                            <span
                              className={[
                                't-ui flex min-w-0 flex-1 items-center gap-2',
                                collapsed ? 'lg:hidden' : '',
                              ].join(' ')}
                            >
                              <span className="truncate">{stage.title}</span>
                              {!stage.ready && (
                                <span
                                  className="t-label ml-auto shrink-0 text-[9px] text-subtle"
                                  title="Not written yet"
                                >
                                  WIP
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>

          <nav
            aria-label="Reference index"
            className="shrink-0 overflow-x-hidden border-t border-line-strong"
          >
            {CHEATSHEET_GROUPS.map((group) => {
              const labelId = `ref-${group.toLowerCase()}`
              return (
                <div
                  key={group}
                  className="border-b border-line last:border-b-0"
                >
                  <div
                    id={labelId}
                    className={[
                      't-label px-3 pb-1 pt-4 text-subtle',
                      collapsed ? 'lg:px-0 lg:text-center' : '',
                    ].join(' ')}
                  >
                    <span className={collapsed ? 'lg:hidden' : ''}>
                      {group}
                    </span>
                    <span
                      className={collapsed ? 'hidden lg:inline' : 'hidden'}
                      aria-hidden
                    >
                      ·
                    </span>
                  </div>

                  <ul aria-labelledby={labelId}>
                    {cheatsheetsByGroup(group).map((sheet) => {
                      const href = `/reference/${sheet.slug}`
                      const active = pathname === href
                      return (
                        <li key={sheet.slug}>
                          <Link
                            href={href}
                            onClick={() => setDrawerOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            title={collapsed ? sheet.title : undefined}
                            className={[
                              'group flex min-h-11 items-center gap-3 px-3 text-sm transition-colors duration-150 lg:min-h-0 lg:py-1.5',
                              collapsed ? 'lg:justify-center lg:px-0' : '',
                              active
                                ? 'border-l-2 border-brand bg-sunken pl-[10px] font-medium text-fg'
                                : 'border-l-2 border-transparent text-muted hover:bg-sunken hover:text-fg',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                't-ui flex min-w-0 flex-1 items-center gap-2',
                                collapsed ? 'lg:hidden' : '',
                              ].join(' ')}
                            >
                              <span className="truncate">{sheet.title}</span>
                              {!isDrawn(sheet) && (
                                <span
                                  className="t-label ml-auto shrink-0 text-[9px] text-subtle"
                                  title="Not gathered yet"
                                >
                                  WIP
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>
        </div>

        {/* The Next.js dev overlay parks bottom-left; leave it clearance. */}
        <div className="hidden h-12 shrink-0 lg:block" />
      </aside>
    </>
  )
}
