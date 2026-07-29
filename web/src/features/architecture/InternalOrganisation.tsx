'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { ORGANISATION_QUESTION, ORGANISATION_STYLES } from './styles'

/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * Deliberately a reveal and not a scorer. Two reasons, and the second matters
 * more: D-49 gives a step at most one committed exercise and step 04's is
 * `SplitTrigger`; and the doc presents these two as a landscape to know
 * rather than a judgment with a defensible answer, so scoring them would
 * invent a right answer the source does not have.
 *
 * The question is shown before either option, because the question is the
 * content. A reader who takes away only "decide it on how much logic is worth
 * testing without the database" has taken away the section.
 */

export function InternalOrganisation() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Card>
      <p className="text-sm font-medium">Choose between them on one question</p>
      <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
        {ORGANISATION_QUESTION}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        If the answer is &ldquo;most of it&rdquo; — pricing rules, eligibility,
        anything with branches you care about — hexagonal pays for its
        indirection. If it is mostly validate, write, read back, layered is
        honest.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ORGANISATION_STYLES.map((style) => {
          const open = openId === style.id
          const panelId = `org-${style.id}`
          return (
            <div key={style.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : style.id)}
                aria-expanded={open}
                aria-controls={panelId}
                className={[
                  'flex min-h-11 w-full flex-col items-start justify-center border px-3.5 py-2.5 text-left transition-colors duration-150 lg:min-h-9',
                  open
                    ? 'border-brand bg-brand-tint'
                    : 'border-line bg-raised hover:border-line-strong',
                ].join(' ')}
              >
                <span className="text-sm font-medium text-fg">
                  {style.name}
                </span>
                <span className="mt-0.5 text-sm leading-6 text-muted">
                  {style.summary}
                </span>
              </button>
              {open && (
                <p
                  id={panelId}
                  className="mt-2 border border-line bg-sunken p-3.5 text-sm leading-6 text-muted"
                >
                  {style.body}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 border-t border-line pt-4 text-sm leading-6 text-muted">
        Both are compatible with every deployment shape above. Start layered and
        extract ports where a piece of logic gets hard to test — that direction
        is an extraction, and the other one is a rewrite.
      </p>
    </Card>
  )
}
