/**
 * The doc's six edge-case questions, applied to the running example.
 *
 * Source: `docs/06-testing.md`, "### Unit tests" — "For each function ask:
 * empty input, zero, negative, very large, null, duplicates." That sentence is
 * the second half of a two-sentence passage, and it is the half that makes the
 * first ("edge cases are where bugs live") into something a reader can do.
 *
 * `catches` is written against `calculateTotal` specifically rather than in
 * general, because "check for null" is advice and "a null discountPercent
 * makes the multiplication NaN and the invoice reads NaN" is a bug.
 */
export type Probe = { id: string; input: string; catches: string }

export const PROBES: Probe[] = [
  {
    id: 'empty',
    input: 'items: []',
    catches:
      'A total of zero, or a crash on reducing an empty array — and a checkout that lets someone pay for nothing.',
  },
  {
    id: 'zero',
    input: 'quantity: 0',
    catches:
      'A line item that contributes nothing but still appears on the invoice, which is a support ticket rather than an error.',
  },
  {
    id: 'negative',
    input: 'discountPercent: 200',
    catches:
      'A negative total, here from a discount over 100% — or from a negative price nothing else rejects. This is the doc’s own second test, and it is the one that found the missing branch.',
  },
  {
    id: 'large',
    input: 'price: Number.MAX_SAFE_INTEGER',
    catches:
      'Integer overflow in the cents arithmetic, where the total silently stops being exact.',
  },
  {
    id: 'null',
    input: 'discountPercent: null',
    catches:
      'A NaN that propagates through tax and prints on the invoice as NaN, because nothing in the chain rejects it.',
  },
  {
    id: 'duplicates',
    input: 'the same item twice',
    catches:
      'Whether two lines of one item are summed or the second overwrites the first — a question the type signature does not answer.',
  },
]
