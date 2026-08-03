import { expect, test } from 'vitest'
import { NORMAL_FORMS } from './normal-forms'

test('all three forms are carried, since naming them and defining none is the gap this closes', () => {
  expect(NORMAL_FORMS.map((f) => f.id)).toEqual(['1nf', '2nf', '3nf'])
})

test('every form states its rule and the mistake it forbids, because a definition without a violation is a label', () => {
  for (const f of NORMAL_FORMS) {
    expect(f.rule.trim().length, `${f.id} rule`).toBeGreaterThan(20)
    expect(f.violation.trim().length, `${f.id} violation`).toBeGreaterThan(20)
  }
})

// The doc leads with the working rule and says third normal form is the one
// worth aiming at. Teaching all three as equals would be the theory the doc
// deliberately does not teach.
test('third normal form is marked as the one to aim at, rather than the three arriving as equals', () => {
  const third = NORMAL_FORMS.find((f) => f.id === '3nf')
  expect(third?.rule).toMatch(/aim|target|far enough|worth/i)
})

// Each violation has to be in this stage's own worked example, or the reader
// is matching a definition against a schema they have never seen.
test('every violation is stated against the invoicing example rather than in the abstract', () => {
  const invoicing = /invoice|client|tag|line/i
  for (const f of NORMAL_FORMS) {
    expect(f.violation, `${f.id} violation is abstract`).toMatch(invoicing)
  }
})

// Cold-reader run 4 found the doc giving opposite verdicts on the same column
// of the same example: "store it when it is a fact about a moment — the address
// it shipped to" against 3NF's "storing client_id and the client's address on
// an invoice is the violation". The resolution was latent in invoice_sends and
// never stated. A form that this stage deliberately breaks has to say so where
// the reader meets the rule, or the reader has two sanctioned rules and no
// tie-break.
test('third normal form carries the exceptions this stage deliberately makes, since a reader who meets only the rule cannot resolve them', () => {
  const third = NORMAL_FORMS.find((f) => f.id === '3nf')
  expect(third?.exception, 'no exception stated').toBeDefined()
  expect(third?.exception, 'the moment-fact rule').toMatch(
    /moment|invoice_sends|sent_to/i,
  )
  expect(third?.exception, 'the tenant key').toMatch(/tenant key/i)
})
