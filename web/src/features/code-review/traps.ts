/**
 * Source: `docs/07-code-review.md`, "## Traps".
 *
 * Titles carry the doc's trailing full stop because the doc bolds the whole
 * sentence, and `traps.test.ts` compares against exactly that — same
 * convention as stage 06's `traps.ts`.
 */

export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'immediately',
    title: 'Reviewing immediately after writing.',
    body: 'You will read your intent, not your code. The break is what makes review work.',
  },
  {
    id: 'editor',
    title: 'Reviewing in your editor.',
    body: 'Same context that produced the bugs. The diff view is a different lens.',
  },
  {
    id: 'formatting',
    title: 'Spending review on formatting.',
    body: 'Prettier handles it. Every comment about spacing is attention not spent on the authorization bug.',
  },
  {
    id: 'large-prs',
    title: 'Approving large PRs anyway.',
    body: 'If it is too big to review properly, saying so is the review.',
  },
  {
    id: 'assume-tests',
    title: 'Assuming tests pass for the right reason.',
    body: 'Verify they fail without the change.',
  },
  {
    id: 'bundling',
    title: 'Bundling refactors with features.',
    body: 'Both become harder to review and harder to revert.',
  },
  {
    id: 'ceremony',
    title: 'Treating your own review as ceremony.',
    body: 'It is the only review the code will get. The techniques above exist because self-review is genuinely harder than reviewing someone else’s work — not because it is less important.',
  },
  {
    id: 'performative',
    title: 'Performative agreement with reviewers.',
    body: '“Good catch, fixed!” on a suggestion you have not verified is how confident-sounding wrong advice enters a codebase.',
  },
]
