import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { SchemaInspector } from './SchemaInspector'
import { SCHEMA_LINES } from './scoring'

// `fieldName()` is module-private, so the render is the only surface it has —
// which is the case for the harness in miniature. A data test cannot reach
// this function at all, and the badge reading the whole SQL fragment instead of
// the column name is a defect nothing else in the repo could see.
test('labels the detail panel with the column name rather than the whole line, since the badge is what the reader scans for', () => {
  const line = SCHEMA_LINES.find((l) => l.id === 'owner-fk')
  expect(line, 'the owner_id line is no longer in SCHEMA_LINES').toBeDefined()
  expect(line!.note, 'a line with no note is not selectable').toBeDefined()

  render(<SchemaInspector lines={SCHEMA_LINES} title="invoices" />)

  // The accessible name is the line's own SQL: the ▸ marker is aria-hidden,
  // and name computation collapses the alignment whitespace. Derived from the
  // data rather than written out, because a pattern like /owner_id/ matches two
  // rows — the column and the UNIQUE (owner_id, number) below it.
  //
  // fireEvent, not element.click() — RTL wraps the dispatch in act().
  const rowName = line!.sql.replace(/\s+/g, ' ').trim()
  fireEvent.click(screen.getByRole('radio', { name: rowName }))

  // Exact text match: the badge's whole content is the identifier. The row
  // above and the SQL echoed in the panel both CONTAIN "owner_id" inside a
  // longer string, so only the badge matches exactly.
  expect(screen.getByText('owner_id')).toBeDefined()
})
