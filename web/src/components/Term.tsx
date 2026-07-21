'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { getTerm } from '@/lib/terms'

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
          id={panelId}
          role="note"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-40 block w-[min(22rem,calc(100vw-3rem))] border border-line-strong bg-raised p-4 text-left"
        >
          <span className="t-label block text-brand">{children}</span>
          <span className="mt-2 block text-[0.9375rem] leading-relaxed text-fg">
            {term.full}
          </span>
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
