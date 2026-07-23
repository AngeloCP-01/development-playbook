'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { getTerm } from '@/lib/terms'
import { TERM_VISUALS } from './term-visuals'

/**
 * An inline term you can expand without leaving the sentence.
 *
 * Deliberately a button with an expanding panel rather than a hover tooltip:
 * hover excludes touch and keyboard users, and a definition you cannot reach on
 * a phone is not a definition. Collapsed by default so a reader who already
 * knows the word is never slowed down by it.
 */
export function Term({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const term = getTerm(id)
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const panelRef = useRef<HTMLSpanElement>(null)

  // Keep the panel inside the viewport. A term near the right edge would
  // otherwise push its left-anchored panel off screen. Direct DOM mutation,
  // not state: this is synchronising with layout, and it avoids the
  // set-state-in-effect rule by never re-rendering.
  useEffect(() => {
    const panel = panelRef.current
    if (!open || !panel) return
    panel.style.marginLeft = '0px'
    const rect = panel.getBoundingClientRect()
    const overhang = rect.right - (window.innerWidth - 16)
    if (overhang > 0) panel.style.marginLeft = `-${Math.ceil(overhang)}px`
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [open])

  // An undefined key should never break the sentence it sits in.
  if (!term) return <>{children}</>

  const Visual = TERM_VISUALS[id]

  return (
    <span ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="cursor-help border-b border-dashed border-brand text-fg transition-colors duration-150 hover:border-solid hover:text-brand"
      >
        {children}
      </button>

      {open && (
        <span
          ref={panelRef}
          id={panelId}
          role="note"
          className={[
            'absolute left-0 top-[calc(100%+0.5rem)] z-40 block border border-line-strong bg-raised p-4 text-left',
            Visual
              ? 'w-[min(24rem,calc(100vw-3rem))]'
              : 'w-[min(22rem,calc(100vw-3rem))]',
          ].join(' ')}
        >
          <span className="t-label block text-brand">{children}</span>
          <span className="mt-2 block text-[0.9375rem] leading-relaxed text-fg">
            {term.full}
          </span>
          {Visual && (
            <span className="mt-3 block border-t border-line pt-3">
              <Visual />
            </span>
          )}
          {term.soWhat && (
            <span className="mt-2.5 block border-t border-line pt-2.5 text-[0.875rem] leading-relaxed text-muted">
              <span className="font-semibold text-fg">Why it matters. </span>
              {term.soWhat}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
