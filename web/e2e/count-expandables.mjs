/**
 * Counts how many expandables the audit's sweep actually opens, across the
 * same URLs the audit sweeps — ready stages from `src/lib/stages.ts`, their
 * steps from the rail each one renders.
 *
 * Why this exists. TD-26 found the contrast sweep was opening five expandables
 * across 36 URLs while reporting a clean pass, and its fix took that to 108.
 * That 108 then lived only in a comment: `audit.spec.ts` opens disclosures per
 * page and never aggregates, so nothing prints a total and nothing re-derives
 * it. A refactor that replaces several disclosure components needs the count
 * before and after — "the suite is still green" cannot tell you whether one of
 * them silently stopped rendering its rows.
 *
 * The number is not a constant to assert against. It moves whenever a stage
 * gains content, which is exactly why it has to be measured on the tree in
 * front of you rather than quoted: it was 108 on 2026-08-03 and 140 on
 * 2026-08-13, with no defect in between.
 *
 * Usage, against a server the audit is not already sharing (TD-27):
 *
 *   lsof -ti:3100 | xargs kill -9
 *   pnpm build && pnpm start -p 3100 &
 *   node e2e/count-expandables.mjs
 *
 * The selector and the loop mirror `forEachPanelState()` in `panel-states.ts`.
 * If that changes, change this with it, or the two stop measuring the same
 * thing. It counted `aria-expanded` alone until TD-26 closed, which is why the
 * figures it printed before then are not comparable with the ones it prints
 * now: `AuthPaths`' `aria-selected` tabs and the members of every single-open
 * group were invisible to both this script and the audit. The URL derivation mirrors `audit-pages.ts` for
 * the same reason; it is duplicated rather than imported because this file is
 * plain `.mjs` and that one is TypeScript.
 */
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3100'

// Kept identical to `panel-states.ts`. Duplicated rather than imported because
// this file is plain `.mjs` and that one is TypeScript, which is the same trade
// the stage derivation below already makes.
const DISCLOSURE_PARTS = [
  '[role=tabpanel] button[aria-expanded]',
  '[role=tabpanel] [role=tab][aria-selected]',
]
const DISCLOSURE = DISCLOSURE_PARTS.join(', ')
// A `:not()` has to be appended to *each* part, not to the joined string, or it
// only ever qualifies the last one. Built here rather than string-patched at the
// call site, where getting it wrong would silently re-click the same control.
const UNOPENED = DISCLOSURE_PARTS.map(
  (part) => `${part}:not([data-audit-opened])`,
).join(', ')

// Ready stage slugs, from the same flag the router and `audit-pages.ts` use.
// This file is plain `.mjs` and cannot import the TypeScript module, so it
// reads the declaration instead.
//
// The inner group refuses to cross a `slug:`, so each match is one stage entry
// rather than a `slug` from one paired with a `ready` from a later one. That
// matters because the pairing otherwise rests on `slug` always preceding
// `ready` inside every object — which TypeScript does not require, prettier
// does not enforce, and no test covers. Swap two fields in one entry and a
// greedy pattern silently reads that stage's flag off its neighbour and drops
// the stage after it, then prints a plausible URL count measured over the
// wrong set.
//
// The completeness check below is what makes that loud: every `slug:` in the
// file must have been paired, so a shape change fails here instead of
// producing a believable wrong number. An earlier version guarded only against
// parsing *nothing*, which catches zero and not wrong.
const stagesSrc = readFileSync(
  new URL('../src/lib/stages.ts', import.meta.url),
  'utf8',
)
const parsed = [
  ...stagesSrc.matchAll(
    /slug:\s*'([^']+)'((?:(?!slug:)[\s\S])*?)ready:\s*(true|false)/g,
  ),
]
// Only entries, not the `slug: string` field on the `Stage` type — counting
// bare `slug:` makes this throw on every run, which is how this line was
// written first.
const declaredSlugs = [...stagesSrc.matchAll(/^\s*slug: '/gm)].length

if (parsed.length !== declaredSlugs) {
  throw new Error(
    `paired ${parsed.length} stages against ${declaredSlugs} slug declarations ` +
      `in src/lib/stages.ts — the file's shape changed, and sweeping the ` +
      `stages this did pair would report a plausible number over the wrong set.`,
  )
}

const readySlugs = parsed
  .filter(([, , , ready]) => ready === 'true')
  .map(([, slug]) => slug)

if (readySlugs.length === 0) {
  throw new Error('parsed no ready stages from src/lib/stages.ts')
}

const browser = await chromium.launch()
const page = await browser.newPage()

// Step ids come from the rail each stage renders, matching `audit-pages.ts`.
// This used to scrape `const PAGES` out of `audit.spec.ts`; that array was
// removed when TD-12 closed, which broke this script — found by running it.
const urls = ['/']
for (const slug of readySlugs) {
  await page.goto(`${BASE}/stages/${slug}`, { waitUntil: 'networkidle' })
  const ids = await page.$$eval(
    '[role="tablist"][aria-label="Stage steps"] [role="tab"][id^="tab-"]',
    (tabs) => tabs.map((tab) => tab.id.slice('tab-'.length)),
  )
  if (ids.length === 0) {
    throw new Error(`${slug} is ready but rendered no steps`)
  }
  urls.push(...ids.map((id) => `/stages/${slug}#${id}`))
}

const perPage = []
const allIds = new Set()
let total = 0

for (const url of urls) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' })

  let opened = 0
  for (;;) {
    const didOpen = await page.evaluate((sel) => {
      const button = document.querySelector(sel)
      if (!button) return false
      button.setAttribute('data-audit-opened', '')
      button.click()
      return true
    }, UNOPENED)
    if (!didOpen) break
    opened += 1
    if (opened > 400) throw new Error(`runaway open loop on ${url}`)
  }

  // The panel ids these disclosures control. A migration that renames one is
  // invisible to the count — the same number of rows still renders — and
  // invisible to the audit, which sweeps *step* hashes and never reads a
  // disclosure's own id. Collected here so one run catches both.
  for (const id of await page.evaluate(
    (sel) =>
      [...document.querySelectorAll(sel)].map((b) =>
        b.getAttribute('aria-controls'),
      ),
    DISCLOSURE,
  )) {
    if (id) allIds.add(id)
  }

  perPage.push(`${String(opened).padStart(3)}  ${url}`)
  total += opened
}

console.log(perPage.join('\n'))
console.log('-'.repeat(48))
console.log(`URLs:  ${urls.length}`)
console.log(`Total: ${total}`)
console.log(`Ids:   ${allIds.size}`)

if (process.env.AUDIT_IDS) {
  console.log('-'.repeat(48))
  console.log([...allIds].sort().join('\n'))
}

await browser.close()
