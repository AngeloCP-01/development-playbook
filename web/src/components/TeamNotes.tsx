'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * A collapsed disclosure titled "If you are not solo", carrying whatever
 * team-scoped material a stage wants to append without making it part of
 * the main read.
 *
 * Shared rather than stage-03-specific: stage 02 shipped an equivalent
 * disclosure by hand (`Planning.tsx`, the "What changes on a team" section,
 * built on a native `<details>`), stage 01 silently dropped its own
 * version, and every stage since has had no precedent to follow. This
 * settles it — one component, `title` and `children` as props, so a later
 * stage passes its own content rather than this one hard-coding stage 03's.
 *
 * Built as a controlled button + `aria-controls` panel rather than
 * `<details>`/`<summary>`: a shared component needs `aria-expanded` on the
 * control for a caller (or a test) to assert against, which `<details>`
 * does not expose. The shape was copied from `DeferredList`'s per-row
 * disclosure, collapsed to a single row; that markup now lives in
 * `RevealList`, which `DeferredList` calls.
 *
 * Lives here rather than in `features/architecture/` because TD-13 made a
 * team-notes disclosure every stage's convention, and a shared component in
 * one feature's folder is a component the next stage copies. Stage 01
 * already imported it across the feature boundary.
 *
 * Not folded into `RevealList`, which is the one-row question a reader will
 * ask. Two things differ and both are visible: the title renders at
 * `text-sm` where `RevealList`'s string branch takes ambient body size, and
 * the panel is `space-y-2.5` / `text-[0.9375rem] text-muted` where
 * `RevealList`'s is `space-y-3` and inherits its colour. Converting it would
 * be a restyle, not a relocation.
 */
export function TeamNotes({
  title = 'If you are not solo',
  children,
}: {
  title?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <Card className="p-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-11 w-full items-center justify-between gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
        >
          <span className="text-sm font-medium text-fg">{title}</span>
          <ChevronDown
            className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </h3>

      {open && (
        <div
          id={panelId}
          className="space-y-2.5 border-t border-line bg-sunken px-5 py-4 text-[0.9375rem] leading-relaxed text-muted"
        >
          {children}
        </div>
      )}
    </Card>
  )
}
