/**
 * F2: one feature — a discounted checkout — carried at three altitudes.
 *
 * `blind` is what makes this a chain rather than a table. Each layer's blind
 * spot is the next layer's reason to exist, which is the claim the three
 * panels after this one are built on: they are one feature at three heights,
 * not three snippets that happen to share a domain.
 */
export type Layer = {
  id: 'unit' | 'integration' | 'e2e'
  label: string
  target: string
  volume: string
  speed: string
  proves: string
  blind: string
}

export const LAYERS: Layer[] = [
  {
    id: 'unit',
    label: 'Unit',
    target: 'calculateTotal()',
    volume: 'Many',
    speed: 'Milliseconds',
    proves:
      'That the arithmetic is right, including the inputs nobody expects — a 200% discount, an empty basket, a quantity of zero.',
    blind:
      'It never touches the database, so it cannot see a column the schema has and the type does not, or a write that silently updates nothing.',
  },
  {
    id: 'integration',
    label: 'Integration',
    target: 'updateInvoice()',
    volume: 'Some',
    speed: 'Seconds',
    proves:
      'That the action works end to end against a real Postgres — the query runs, the constraint holds, and an invoice belonging to someone else is refused.',
    blind:
      'It calls the action directly, so it cannot see a form that never submits, a button wired to the wrong handler, or a redirect that does not come back.',
  },
  {
    id: 'e2e',
    label: 'E2E',
    target: 'e2e/checkout.spec.ts',
    volume: 'Few',
    speed: 'Tens of seconds',
    proves:
      'That a person can actually buy the thing: the page renders, the form submits, the payment clears, the confirmation appears.',
    blind:
      'It is slow and inherently flakier, and when it fails it tells you the purchase broke without telling you which of the three layers below it did.',
  },
]
