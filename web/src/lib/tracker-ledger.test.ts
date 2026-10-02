import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// The tracker is split in two (D-96): `docs/tracker.md` holds the live ledger,
// `docs/tracker-archive.md` holds closed debt and completed rows older than the
// current round. Entries move verbatim and keep their IDs, so a citation such as
// "TD-44" or "D-22" in a spec, a plan or a code comment keeps resolving to
// exactly one place. This is what makes the move safe to repeat at every KICKOFF
// refresh, on whichever model is doing the refreshing: an entry that lands in
// both files, or in neither, fails here instead of surfacing months later as a
// dangling reference.

const ledgerPath = (name: string) =>
  fileURLToPath(new URL(`../../../docs/${name}.md`, import.meta.url))

/**
 * Debt headings (`### TD-12 — …`, `### ~~TD-45~~ — …`) and decision rows (`| **D-95** |`).
 * A `(original entry)` heading is the superseded first draft kept under the same id
 * (TD-25 has one); it travels with its entry and is not a second occurrence.
 */
function ledgerIds(md: string): string[] {
  const debt = [
    ...md.matchAll(/^###\s+~{0,2}(TD-\d+)\b(?! \(original entry\))/gm),
  ].map((m) => m[1])
  const decisions = [...md.matchAll(/^\|\s+\*\*(D-\d+)\*\*\s+\|/gm)].map(
    (m) => m[1],
  )
  return [...debt, ...decisions]
}

function countIds(ids: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1)
  return counts
}

test('every TD and D id appears exactly once across the live tracker and the archive', () => {
  const live = readFileSync(ledgerPath('tracker'), 'utf8')
  const archive = readFileSync(ledgerPath('tracker-archive'), 'utf8')

  const counts = countIds([...ledgerIds(live), ...ledgerIds(archive)])
  const duplicated = [...counts]
    .filter(([, n]) => n > 1)
    .map(([id, n]) => `${id}×${n}`)

  expect(
    counts.size,
    'the ledgers parse to zero ids — the heading shape changed',
  ).toBeGreaterThan(50)
  expect(duplicated, 'an id is in both files, or twice in one').toEqual([])
})

test('the archive holds only closed debt, so an open item cannot be filed away by mistake', () => {
  const archive = readFileSync(ledgerPath('tracker-archive'), 'utf8')
  const openInArchive = [...archive.matchAll(/^###\s+(TD-\d+)[^\n]*$/gm)]
    .filter((m) => !/closed/i.test(m[0]) && !m[0].includes('(original entry)'))
    .map((m) => m[1])
  expect(openInArchive).toEqual([])
})
