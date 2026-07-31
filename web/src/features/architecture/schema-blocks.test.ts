import { expect, test } from 'vitest'
import {
  ER_EDGES,
  ER_ENTITIES,
  INDEX_LINES,
  INVOICE_SENDS_LINES,
  PARTIAL_UNIQUE_LINES,
  TENANCY_LINES,
} from './schema-blocks'

test('two indexes are shown, one from a screen and one from the scheduled job, because both come from the sketch and not from intuition', () => {
  const created = INDEX_LINES.filter((l) => l.sql.startsWith('CREATE INDEX'))
  expect(created).toHaveLength(2)
})

test('the partial index is partial, since a plain UNIQUE would forbid the second rejected claim and that is the whole point', () => {
  const sql = PARTIAL_UNIQUE_LINES.map((l) => l.sql).join(' ')
  expect(sql).toMatch(/WHERE/)
  expect(sql).toMatch(/UNIQUE INDEX/)
})

test('the tenancy block carries the memberships table, which is the answer to the actor-rights interrogation question', () => {
  const sql = TENANCY_LINES.map((l) => l.sql).join(' ')
  expect(sql).toMatch(/CREATE TABLE memberships/)
})

test('the tenancy block puts the role on the membership and not on users, which is the mistake it exists to prevent', () => {
  const open = TENANCY_LINES.findIndex((l) => l.id === 'memberships-open')
  const close = TENANCY_LINES.findIndex((l) => l.id === 'memberships-close')
  expect(open, 'memberships-open is missing').toBeGreaterThan(-1)
  expect(close, 'memberships-close is missing').toBeGreaterThan(open)

  // Scoped to the memberships table on purpose. Asserting against the whole
  // block passes with the role sitting on `teams` or `companies`, which is the
  // exact misplacement this test is named for.
  const memberships = TENANCY_LINES.slice(open, close + 1)
    .map((l) => l.sql)
    .join(' ')
  expect(memberships).toMatch(/role\s+text NOT NULL CHECK/)

  // And nowhere else in the block, which catches the misplacement directly
  // rather than by guessing at how it would be phrased.
  const elsewhere = TENANCY_LINES.filter((_, i) => i < open || i > close)
    .map((l) => l.sql)
    .join(' ')
  expect(elsewhere).not.toMatch(/\brole\b/)
})

test('the sends table is append-only in shape, since a row that can be updated is not the record the auditability trace row asked for', () => {
  const sql = INVOICE_SENDS_LINES.map((l) => l.sql).join(' ')
  expect(sql).toMatch(/CREATE TABLE invoice_sends/)
  // The address is stored, not joined. Joining to the client would report where
  // the invoice *would* go today, which is the opposite of what a send record is for.
  expect(sql).toMatch(/sent_to\s+text NOT NULL/)
  expect(sql).toMatch(/sent_at\s+timestamptz NOT NULL/)
})

test('the sends block says it is not event sourcing, because that is the conclusion a reader draws unprompted', () => {
  const notes = INVOICE_SENDS_LINES.map((l) => l.note ?? '').join(' ')
  expect(notes).toMatch(/event sourc/i)
})

test('every block annotates at least one line, or it is a code dump rather than an annotated artifact', () => {
  for (const [name, lines] of [
    ['indexes', INDEX_LINES],
    ['partial unique', PARTIAL_UNIQUE_LINES],
    ['tenancy', TENANCY_LINES],
    ['invoice sends', INVOICE_SENDS_LINES],
  ] as const) {
    expect(
      lines.some((l) => l.note),
      `${name} has no annotated line`,
    ).toBe(true)
  }
})

test('line ids are unique within each block, because selection is keyed by id', () => {
  for (const [name, lines] of [
    ['indexes', INDEX_LINES],
    ['partial unique', PARTIAL_UNIQUE_LINES],
    ['tenancy', TENANCY_LINES],
    ['invoice sends', INVOICE_SENDS_LINES],
  ] as const) {
    expect(new Set(lines.map((l) => l.id)).size, name).toBe(lines.length)
  }
})

test('the ER view carries four entities and the fourth edge, which is the one worth arguing about before it is typed', () => {
  expect(ER_ENTITIES).toHaveLength(4)
  const owner = ER_EDGES.find((e) => e.id === 'users-invoices')
  expect(owner).toBeDefined()
  expect(owner?.note?.trim().length ?? 0).toBeGreaterThan(0)
})

test('every ER edge joins entities the view actually draws', () => {
  for (const e of ER_EDGES) {
    expect(ER_ENTITIES, `${e.id} from`).toContain(e.from)
    expect(ER_ENTITIES, `${e.id} to`).toContain(e.to)
  }
})
