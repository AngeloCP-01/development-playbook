import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'
import { fences } from './doc-source'

const BLOCKS = fences()

test('the doc still has the fourteen blocks this module was cut from', () => {
  expect(BLOCKS).toHaveLength(14)
})

test('the key list is pinned, so a new doc block does not surface here on its own', () => {
  expect(Object.keys(ARTIFACTS)).toEqual([
    'invoicesPage',
    'billingPage',
    'getInvoices',
    'invoiceTable',
    'updateInvoice',
    'amountForm',
    'retryButton',
    'getInvoice',
    'invoiceDetailPage',
    'loadingFile',
    'errorFile',
    'feedbackLoop',
  ])
})

/**
 * `toBe` against a whole block, never `toContain` (D-66). A substring of a
 * block is still contained, so containment cannot see an artifact that has lost
 * its last line — and the last line is where `revalidatePath` and the closing
 * brace live. The reader is meant to paste these.
 *
 * This is also the guard against the defect the doc round just closed: its
 * blocks used to be excerpts with imports and callers stripped, and a cold
 * reader could not produce one compiling file. Transcribing rather than lifting
 * would reintroduce it.
 */
test.each(Object.entries(ARTIFACTS))(
  '%s equals a whole fenced block from the doc, not a substring of one',
  (key, artifact) => {
    const text = artifact.lines.map((l) => l.text).join('\n')
    expect(BLOCKS, key).toContain(text)
  },
)

test('every artifact carries at most one pivot, since a pivot is the line the step turns on', () => {
  for (const [key, artifact] of Object.entries(ARTIFACTS)) {
    expect(
      artifact.lines.filter((l) => l.pivot === true).length,
      key,
    ).toBeLessThanOrEqual(1)
  }
})

/**
 * The two lines the whole stage turns on. Pinned as literals rather than read
 * off the data, so flipping a pivot flag cannot move the expectation with it.
 */
test('the action pivots on the owner in the where clause', () => {
  const pivot = ARTIFACTS.updateInvoice.lines.find((l) => l.pivot)
  expect(pivot?.text).toContain('eq(invoices.ownerId, user.id)')
})

test('the error file pivots on unstable_retry, not the reset an older release remembers', () => {
  const pivot = ARTIFACTS.errorFile.lines.find((l) => l.pivot)
  expect(pivot?.text).toContain('unstable_retry')
})

test('every note explains a decision rather than restating its line', () => {
  for (const [key, artifact] of Object.entries(ARTIFACTS)) {
    const noted = artifact.lines.filter((l) => l.note)
    expect(noted.length, `${key} annotates nothing`).toBeGreaterThan(0)
    for (const line of noted) {
      expect(line.note!.trim().length, `${key}: ${line.text}`).toBeGreaterThan(
        30,
      )
      expect(line.note!.trim()).not.toBe(line.text.trim())
    }
  }
})

test('filenames match the path comment the doc opens each block with', () => {
  for (const [key, artifact] of Object.entries(ARTIFACTS)) {
    if (key === 'feedbackLoop') continue // a command list, not a file
    expect(artifact.lines[0].text, key).toContain(artifact.filename)
  }
})
