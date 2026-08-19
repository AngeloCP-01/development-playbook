/**
 * Source: `docs/05-development.md`, "## Definition of done", "## Artifacts",
 * and "## Scaling to a team".
 *
 * `checklist.test.ts` counts all three lists out of the doc. `DONE` labels
 * are the doc's checkboxes verbatim, because the worksheet is a checklist a
 * reader works through against their own repository, and a paraphrase there
 * is a different bar than the one the stage set — the one exception is that
 * four boxes carry a markdown link to another stage
 * (`([06](06-testing.md))`), and this directory's `prose.test.ts` forbids
 * link syntax in an authored string (`InlineCode` does not render it). Those
 * four are stripped to the bare stage number, e.g. `(06)`; the test applies
 * the identical strip to the doc side before comparing, so "verbatim" still
 * holds for everything but that one piece of markup.
 *
 * Ids are slugs rather than positions: a persisted worksheet keys progress
 * against them, so reordering the list must not reset a reader's ticks.
 *
 * `stage` mirrors `loop.ts`'s `LoopStage.stage`: a slug held separately from
 * the display text, populated for the four items whose doc checkbox carried
 * a link. It exists so a later component can render a real link instead of
 * scraping the bare `(06)` back into a slug, or shipping a dead number where
 * the doc had a working one. `checklist.test.ts` checks every populated
 * value against `STAGES`, the same way `loop.test.ts` already does.
 */

export type DoneItem = { id: string; label: string; stage?: string }
export type TeamMove = { id: string; title: string; body: string }

export const DONE: DoneItem[] = [
  {
    id: 'tests-passing',
    label: 'Tests written and passing (06)',
    stage: '06-testing',
  },
  {
    id: 'typecheck',
    label:
      '`pnpm typecheck` clean — the script from 04, not a bare `tsc --noEmit`, which passes off a stale build and fails on a clean checkout',
    stage: '04-project-setup',
  },
  {
    id: 'lint-format',
    label: '`pnpm lint` (at `--max-warnings 0`) and `pnpm format:check` clean',
  },
  {
    id: 'no-any',
    label:
      'No `any`. Every `as` cast has a comment saying what the compiler could not know',
  },
  {
    id: 'authorize-reads',
    label: 'Server Actions authorize, not just authenticate — and so do reads',
  },
  {
    id: 'loading-error',
    label: '`loading.tsx` and `error.tsx` exist for any segment that fetches',
  },
  {
    id: 'expected-failures',
    label: 'Expected failures are returned and rendered, not thrown',
  },
  {
    id: 'branch-age',
    label: 'Branch is under two days old, or the rest is behind a flag',
  },
  { id: 'rebased', label: 'Rebased, so history reads in order' },
  {
    id: 'self-reviewed',
    label: 'Self-reviewed the diff (07)',
    stage: '07-code-review',
  },
  {
    id: 'preview-verified',
    label: 'Verified on the preview URL (12)',
    stage: '12-staging',
  },
]

export const ARTIFACT_ITEMS: string[] = [
  'Small, focused commits with explanatory bodies',
  'Feature code in `src/features/<feature>/`, components included, route files thin',
  'Server Actions that authenticate, validate, and authorize',
  'Zod schemas at every external boundary',
]

export const TEAM_MOVES: TeamMove[] = [
  {
    id: 'branch-naming',
    title: 'Branch naming conventions',
    body: 'Start to matter once branches are not all yours — a shared convention is what lets someone else tell what a branch is for before opening it.',
  },
  {
    id: 'draft-prs',
    title: 'Draft PRs early',
    body: 'So others see direction before you have built two days in the wrong one. Catching a wrong turn on day one is cheap; catching it on day three is a rewrite.',
  },
  {
    id: 'shared-files',
    title: 'Communicate about shared files.',
    body: 'Two people refactoring the same module produces a merge conflict neither can resolve confidently, because each only understands their own half of the change.',
  },
  {
    id: 'write-conventions',
    title: 'Write down conventions you have been holding in your head.',
    body: 'Solo, consistency is automatic. With others, it needs to be explicit — a short CONVENTIONS.md beats re-litigating the same review comments on every pull request.',
  },
]
