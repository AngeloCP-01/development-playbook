/**
 * Source: `docs/07-code-review.md`, "### AI in code review".
 *
 * `AI_PREMISE` is the section's opening two sentences, verbatim: what AI
 * review tools catch, and why they catch it (no fatigue, no assumption they
 * already know the code). `AI_LIMIT` is the closing paragraph, verbatim: the
 * anti-pattern of treating AI review as *the* review, and the erosion that
 * follows from it. Both are pinned against the doc in `ai-plays.test.ts`.
 *
 * `PLAYS` covers the section's middle two paragraphs: what AI review misses
 * (judgment calls), and the first-pass workflow the doc recommends. Five
 * plays, one per doc move rather than one per bullet — this section has no
 * bulleted list, unlike stage 04's and 06's `AIPlays` data.
 */
export const AI_PREMISE =
  'AI review tools catch a real class of issue — null-reference paths, missing error handling, unhandled promise rejections, simple logic inversions. They do not get tired, and they do not assume they already know what the code does.'

export const AI_LIMIT =
  'The anti-pattern is treating AI review as the review. Agent-authored PRs get reviewed less often, merged faster, and discussed less — which is exactly the erosion that turns review from a quality gate into ceremony.'

export type Play = {
  id: string
  title: string
  kind: 'skill' | 'command' | 'mcp' | 'memory'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'first-pass',
    title: 'AI as first-pass reviewer',
    kind: 'skill',
    body: 'Run AI review before requesting human review. Fix the mechanical issues it surfaces — the leftover `console.log`, the missing null check — so the human reviewer gets a cleaner diff.',
  },
  {
    id: 'checklist-items',
    title: 'AI for checklist items',
    kind: 'command',
    body: 'Automate the mechanical checks: secrets in the diff, debug logging, formatting violations, missing error handling. These are the items a machine catches reliably.',
  },
  {
    id: 'human-judgment',
    title: 'Human for judgment calls',
    kind: 'skill',
    body: 'Architecture, authorization, naming, scope, and whether the change should have been made at all stay with the human reviewer. AI cannot judge these — it has no model of the domain.',
  },
  {
    id: 'heightened-scrutiny',
    title: 'Heightened scrutiny for AI-authored code',
    kind: 'skill',
    body: 'AI-generated code produces roughly 1.7× more issues per PR than human-written code. The instinct is to review it less carefully because it looks clean. Do the opposite.',
  },
  {
    id: 'self-review-distance',
    title: 'AI review for self-review distance',
    kind: 'command',
    body: 'An AI review of your own PR creates the second perspective that self-review struggles to manufacture. It is not the same as a human reviewer, but it is better than none.',
  },
]
