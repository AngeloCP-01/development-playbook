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
 * does not expose. Modelled on `DeferredList`'s per-row disclosure for that
 * shape, collapsed to a single row.
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
