'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Copy } from 'lucide-react'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { Term } from '@/components/Term'

/**
 * Source: docs/03-architecture.md, "Write the ADRs" — context, choice,
 * reasoning, consequences, alternatives.
 *
 * Collapsed-row shape modelled on `DeferredList`: items open independently as
 * a `Set` of ids, not an accordion, because a reader comparing two parts of
 * one ADR should be able to hold both open. The copy affordance is
 * `PlanWorksheet`'s — a labelled button, a 2s confirmation swap, an
 * `aria-live="polite"` announcement — applied to a five-heading blank
 * template rather than a form.
 *
 * Deliberately paired with `AuthPaths` in the same step: an ADR with no
 * decision behind it reads as bureaucracy, so every part's worked example
 * below fills in the same hypothetical call — choosing Auth.js over rolling
 * a session store or paying a managed provider — so the two pieces read as
 * one exercise instead of two unrelated widgets.
 *
 * Built on `RevealList`; state, markup and the chevron now live there. Of
 * each row's two label+paragraph blocks, only "What it is for" becomes a
 * `RevealFacet` — its label and body classes match `RevealFacet` byte for
 * byte. "Filled in, for the auth decision above" keeps its own markup:
 * its body paragraph is `text-fg`, but `RevealFacet` hardcodes `text-muted`
 * for every tone's body text with no override, and `--color-fg`/
 * `--color-muted` are different tokens — converting it would dim the worked
 * example from ink to graphite, a real color change, not a wash.
 */

type Part = {
  id: string
  heading: string
  purpose: string
  worked: string
}

const PARTS: Part[] = [
  {
    id: 'context',
    heading: 'Context',
    purpose:
      'The situation that forces the decision — constraints, not opinions.',
    worked:
      'User accounts are needed before the first vertical slice ships. Budget is tight this early, and there is no compliance requirement yet forcing a particular vendor. Three paths were compared: rolling our own session auth, a managed provider (Clerk, Auth0), and a library (Auth.js).',
  },
  {
    id: 'decision',
    heading: 'Decision',
    purpose: 'The choice itself, in one sentence, with no hedging.',
    worked: 'Use Auth.js against our own Postgres database.',
  },
  {
    id: 'reasoning',
    heading: 'Reasoning',
    purpose:
      'Why this over the alternatives — the part that gets lost first when someone reconstructs it later.',
    worked:
      'Rolling our own carries real risk on a feature nobody on this team has time to get right the first time. A managed provider is the safest option operationally, but adds a recurring per-user cost before there is revenue, and puts identity in a system we do not control. Auth.js is a standard, reviewed implementation that keeps user records in our own schema, at the cost of configuring it ourselves.',
  },
  {
    id: 'consequences',
    heading: 'Consequences',
    purpose:
      'What this decision costs or forecloses, named up front rather than discovered later.',
    worked:
      'User records live in our own database from day one, so nothing has to migrate if the app ever leaves free-tier hosting. In exchange, we own keeping the library patched and correctly configured — there is no vendor support line to call when something is wrong.',
  },
  {
    id: 'alternatives',
    heading: 'Alternatives considered',
    purpose:
      "What else was on the table, and why it lost — so it doesn't get relitigated as if no one thought of it.",
    worked:
      'Rolling our own — rejected: the risk of a subtle session or reset-flow bug outweighs the time it would save. A managed provider (Clerk or Auth0) — rejected for now: fastest to get right, but the recurring cost and outsourced identity are not worth it at zero revenue; revisit if a compliance requirement arrives.',
  },
]

function blankTemplate(): string {
  return [
    '# ADR: [decision title]',
    '',
    '## Context',
    '',
    '## Decision',
    '',
    '## Reasoning',
    '',
    '## Consequences',
    '',
    '## Alternatives considered',
    '',
  ].join('\n')
}

export function ADRAnatomy() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(blankTemplate())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (insecure context or denied permission). The
      // headings above are still readable to copy by hand.
    }
  }

  return (
    <RevealList
      idPrefix="adr"
      header={
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <p className="text-sm leading-6 text-muted">
            Five parts to an <Term id="adr">ADR</Term>. Each one below expands
            to what it is for, and how it reads once filled in for the auth
            decision compared above.
          </p>
          <button
            type="button"
            onClick={copy}
            className="flex min-h-11 shrink-0 items-center gap-2 border border-line px-3.5 text-sm text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
          >
            {copied ? (
              <Check className="size-4 text-brand" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copied ? 'Copied' : 'Copy blank template'}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? 'Blank ADR template copied to clipboard' : ''}
          </span>
        </div>
      }
      rows={PARTS.map((part) => ({
        id: part.id,
        title: part.heading,
        body: (
          <>
            <RevealFacet label="What it is for">{part.purpose}</RevealFacet>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blueprint">
                Filled in, for the auth decision above
              </p>
              <p className="mt-1 text-sm leading-6 text-fg">{part.worked}</p>
            </div>
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          The format above is one reasonable shape. The rationale for it, and
          where ADRs live once you have more than a few, is covered in{' '}
          <Link href="/stages/10-documentation" className="text-brand">
            10 — Documentation
          </Link>
          .
        </p>
      }
    />
  )
}
