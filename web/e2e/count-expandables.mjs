/**
 * Counts how many expandables the audit's sweep actually opens, across every
 * URL in `audit.spec.ts`'s `PAGES`.
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
 * The selector and the one-at-a-time loop mirror `openExpandables()` in
 * `audit.spec.ts`. If that changes, change this with it, or the two stop
 * measuring the same thing.
 */
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:3100'

const spec = readFileSync(new URL('./audit.spec.ts', import.meta.url), 'utf8')
const block = spec.match(/const PAGES[^=]*=\s*\[([\s\S]*?)\n\]/)
if (!block) throw new Error('could not find PAGES in audit.spec.ts')
const urls = [...block[1].matchAll(/'([^']*\/[^']*)'/g)].map((m) => m[1])

const browser = await chromium.launch()
const page = await browser.newPage()
const perPage = []
const allIds = new Set()
let total = 0

for (const url of urls) {
  await page.goto(BASE + url, { waitUntil: 'networkidle' })

  let opened = 0
  for (;;) {
    const didOpen = await page.evaluate(() => {
      const button = document.querySelector(
        '[role=tabpanel] button[aria-expanded="false"]:not([data-audit-opened])',
      )
      if (!button) return false
      button.setAttribute('data-audit-opened', '')
      button.click()
      return true
    })
    if (!didOpen) break
    opened += 1
    if (opened > 200) throw new Error(`runaway open loop on ${url}`)
  }

  // The panel ids these disclosures control. A migration that renames one is
  // invisible to the count — the same number of rows still renders — and
  // invisible to the audit, which hand-lists step hashes and never sees a
  // disclosure's own id. Collected here so one run catches both.
  for (const id of await page.evaluate(() =>
    [...document.querySelectorAll('[role=tabpanel] button[aria-controls]')].map(
      (b) => b.getAttribute('aria-controls'),
    ),
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
