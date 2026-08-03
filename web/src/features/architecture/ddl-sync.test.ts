import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { SCHEMA_LINES } from './scoring'
import { INVOICE_SENDS_LINES, PARTIAL_UNIQUE_LINES } from './schema-blocks'

// The app's stage content is hand-ported (CLAUDE.md), and TD-23 is what that
// costs: the doc moved twice and the port kept asserting the superseded
// version, including one security-relevant defect. Prose has to be re-read to
// catch that. SQL does not — a CREATE TABLE block is a string, so the port of
// one can be checked rather than reviewed.
//
// Scoped to the two CREATE TABLE blocks on purpose. The index and partial-index
// blocks carry `--` comments that the app deliberately rewords, and the tenancy
// block is three tables with the doc's comments between them; asserting
// character equality there would be asserting a formatting choice rather than
// the content. These two are the blocks the reader inspects line by line, and
// they are the ones W-3.1b changed underneath the port.
const DOC = fileURLToPath(
  new URL('../../../../docs/03-architecture.md', import.meta.url),
)

/** The app stores indentation as a depth so the component does not parse whitespace. */
function render(lines: { sql: string; indent: 0 | 1 }[]): string {
  return lines.map((l) => (l.indent === 1 ? `  ${l.sql}` : l.sql)).join('\n')
}

/** The fenced ```sql block whose first line opens the named table. */
function ddlBlock(md: string, table: string): string {
  const blocks = [...md.matchAll(/```sql\n([\s\S]*?)```/g)].map((m) =>
    m[1].trimEnd(),
  )
  const block = blocks.find((b) => b.startsWith(`CREATE TABLE ${table} (`))
  expect(
    block,
    `docs/03-architecture.md has no sql block opening "CREATE TABLE ${table} ("`,
  ).toBeDefined()
  return block!
}

test('the invoices block in the app is the invoices block in the doc, character for character', () => {
  const md = readFileSync(DOC, 'utf8')
  expect(render(SCHEMA_LINES)).toBe(ddlBlock(md, 'invoices'))
})

test('the invoice_sends block in the app is the invoice_sends block in the doc, character for character', () => {
  const md = readFileSync(DOC, 'utf8')
  expect(render(INVOICE_SENDS_LINES)).toBe(ddlBlock(md, 'invoice_sends'))
})

// The partial-index block is out of the character-for-character scope above,
// for a real reason: the app rewords its `--` comments. But that left the one
// clause a fix wave called "would have cost somebody a production incident"
// with no guard at all — reverting `AND deleted_at IS NULL` on either side kept
// the suite green, and the two could drift apart silently.
//
// So this asserts the predicate rather than the block: both sides carry both
// halves of the condition. Wording stays free; the rule does not.
test('the partial unique index carries both halves of its predicate in the doc and the app, since dropping the second one locks a shift forever', () => {
  const md = readFileSync(DOC, 'utf8')
  const docBlock = [...md.matchAll(/```sql\n([\s\S]*?)```/g)]
    .map((m) => m[1])
    .find((b) => b.includes('one_approved_claim_per_shift'))
  expect(docBlock, 'the doc has no partial unique index block').toBeDefined()

  const appBlock = PARTIAL_UNIQUE_LINES.map((l) => l.sql).join('\n')

  for (const [where, sql] of [
    ['doc', docBlock!],
    ['app', appBlock],
  ] as const) {
    expect(sql, `${where}: the conditional half is missing`).toMatch(
      /WHERE status = 'approved'/,
    )
    expect(
      sql,
      `${where}: a soft-deleted approved row still holds the slot without this`,
    ).toMatch(/deleted_at IS NULL/)
  }
})
