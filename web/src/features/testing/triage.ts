/**
 * The stage's spine: six changes, sorted by the doc's own question.
 *
 * "Not what is my coverage, but: if this breaks, how will I find out?" The four
 * options are the four tiers of the doc's distribution, so a reader learns the
 * shape by placing changes into it rather than by reading it listed.
 *
 * Every change offers the same four options. That is `blockers.ts`'s device
 * (`src/features/setup/blockers.ts`) and it is taken deliberately: a shared
 * option set means a reader who has learned the tiers still has to read the
 * change rather than recognise the shape of the list.
 *
 * Two of the six answer "nothing", for two different reasons — the typechecker
 * already proves it, and the framework's own behaviour is not yours to test.
 * A single "nothing" row would teach the exception; two teach that it has
 * grounds.
 */
export type TriageAnswer = 'unit' | 'integration' | 'e2e' | 'none'
export type TriageOption = { id: TriageAnswer; label: string }

export const OPTIONS: TriageOption[] = [
  { id: 'unit', label: 'A unit test over a pure function' },
  { id: 'integration', label: 'An integration test against a real database' },
  { id: 'e2e', label: 'An E2E test on the critical path' },
  { id: 'none', label: 'Nothing — that coverage is already free' },
]

export type Change = {
  id: string
  change: string
  options: TriageOption[]
  answer: TriageAnswer
  explanation: string
}

export const CHANGES: Change[] = [
  {
    id: 'discount',
    change: 'A new discount rule: a percentage off, applied before tax.',
    options: OPTIONS,
    answer: 'unit',
    explanation:
      'The calculation is a pure function of its inputs, so the cheapest place to catch it is also the most precise about what broke. If this is wrong a customer is overcharged and tells you before you notice, which is the doc’s own trigger for writing a test. Reaching for an E2E test here buys something slower and flakier that reports a wrong total without saying which branch produced it.',
  },
  {
    id: 'refusal',
    change:
      '`updateInvoice` gains an `amount` field. The `where` clause already scopes by owner.',
    options: OPTIONS,
    answer: 'integration',
    explanation:
      'The bug you are looking for is not inside the function, it is between the layers — an ORM that drops an unknown column, a constraint the schema has and the type does not. A unit test with a mocked database would test the mock and stay green through all of it. This is also the action that needs the refusal test: prove an attacker is turned away, because authorization is the most damaging omission on this page.',
  },
  {
    id: 'badge',
    change:
      "A presentational `<Badge>` gains a `tone` prop typed `'go' | 'warn' | 'danger'`.",
    options: OPTIONS,
    answer: 'none',
    explanation:
      'The typechecker already rejects every misuse this prop has, and a test that repeats a type-level guarantee is redundant the day it is written. What makes it tempting is that it is easy — which is exactly the property a coverage target rewards and risk does not.',
  },
  {
    id: 'provider',
    change:
      'Card payment moves to a different provider. The checkout page’s markup is unchanged.',
    options: OPTIONS,
    answer: 'e2e',
    explanation:
      'This is the money path, and its failure mode is that every layer passes its own tests while the purchase still does not complete. A unit test and an integration test would both be green against the new provider’s happy path; only a run through the real page catches a redirect that never comes back. Five good E2E tests beat fifty mediocre ones, and this is one of the five.',
  },
  {
    id: 'cents',
    change: 'Prices move from floats to integer cents across billing.',
    options: OPTIONS,
    answer: 'unit',
    explanation:
      'A refactor that is meant to change nothing is precisely what a unit test protects, because "nothing changed" is a claim and not an observation. Assert the edges rather than the happy path: `0.1 + 0.2 !== 0.3` reaches real invoices, and rounding surfaces on totals nobody thought to check.',
  },
  {
    id: 'route',
    change: 'A route moves from `/invoices` to `/billing/invoices`.',
    options: OPTIONS,
    answer: 'none',
    explanation:
      'Next.js routing works, and proving it is not your responsibility. What is worth a moment is whether anything still links to the old path — and that is a grep, not a test.',
  },
]
