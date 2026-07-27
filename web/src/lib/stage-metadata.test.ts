import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { STAGES } from './stages'

// The stage title lives in two places — the doc's H1 (`# NN. Title`) and
// stages.ts's `title` — and nothing kept them equal (TD-2). This asserts they
// match for every stage, so renaming one side without the other fails here
// instead of drifting silently.
//
// The blurb is deliberately NOT checked: the doc's `>` line is a prose subtitle
// and stages.ts's `blurb` is a UI tooltip/header string (see its own comment).
// They are two purpose-built strings for two surfaces, like `timing` vs
// `cadence`, and diverge on purpose for most stages — not duplication.

const docPath = (slug: string) =>
  fileURLToPath(new URL(`../../../docs/${slug}.md`, import.meta.url))

/** First H1 in the doc, with the "NN. " number prefix stripped. */
function docTitle(md: string): string {
  const h1 = md.match(/^#\s+(.+)$/m)?.[1] ?? ''
  return h1.replace(/^\d+\.\s*/, '').trim()
}

test.each(STAGES.map((s) => [s.slug, s.title] as const))(
  '%s: doc H1 title matches stages.ts',
  (slug, title) => {
    const md = readFileSync(docPath(slug), 'utf8')
    expect(docTitle(md), `${slug} H1 title`).toBe(title)
  },
)
