import type { RevealRow } from '@/components/RevealList'

/**
 * Source: `docs/12-staging.md`, "### The preview checklist" — the four
 * bolded questions the section opens each bullet with. Titles are pinned to
 * the doc via `checklist-items.test.ts`; bodies are paraphrased prose, not
 * pinned, the same split `ScalingMoves` and `AIArchitecturePlays` make
 * between a matched title and free-form body copy.
 *
 * `.tsx` rather than `.ts`: `RevealRow.body` is `ReactNode`, and these rows
 * carry JSX (a `<ul>` for the second category's five checks).
 */
export const CHECKLIST_CATEGORIES: RevealRow[] = [
  {
    id: 'works',
    title: 'Does it actually work?',
    body: (
      <p className="text-sm leading-6 text-muted">
        Walk the primary flow the change touches, as a user, in a browser. Not
        the code path — the flow.
      </p>
    ),
  },
  {
    id: 'unhappy',
    title: 'Does it work when you are not the happy path?',
    body: (
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted">
        <li>Signed out, then signed in</li>
        <li>
          A slow network — throttle it in devtools, since the loading state you
          never see locally shows up here
        </li>
        <li>A narrow viewport, and one wide one</li>
        <li>Empty state: no data, first-run experience</li>
        <li>
          Error state: kill the network mid-action and watch what the user sees
        </li>
      </ul>
    ),
  },
  {
    id: 'regressions',
    title: 'Did anything else break?',
    body: (
      <p className="text-sm leading-6 text-muted">
        The change was in billing, but check that the dashboard still renders.
        Preview deploys make this cheap; regressions are usually adjacent, not
        distant.
      </p>
    ),
  },
  {
    id: 'looks-right',
    title: 'Does it look right?',
    body: (
      <p className="text-sm leading-6 text-muted">
        Not &ldquo;does it match the mockup&rdquo; pixel for pixel, but: is text
        readable, does nothing overlap, is the tab order sane, does the focus
        ring exist.
      </p>
    ),
  },
]
