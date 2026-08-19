/**
 * Source: `docs/05-development.md`, "## Traps".
 *
 * Titles carry the doc's trailing full stop because the doc bolds the whole
 * sentence, and `traps.test.ts` compares against exactly that.
 */

export type Trap = { id: string; title: string; body: string }

export const TRAPS: Trap[] = [
  {
    id: 'long-branches',
    title: 'Long-lived branches.',
    body: 'Two days is the rule; two weeks is what it looks like when nobody enforces it. By then it conflicts, nobody can hold three thousand lines in their head, and it gets merged with a rubber stamp because reviewing it properly would take a day.',
  },
  {
    id: 'client-at-top',
    title: "`'use client'` at the top of a page.",
    body: 'Everything below it ships to the browser and gives up server-only data access. It is still prerendered, so the symptom is a heavy bundle and a slow hydration rather than a blank page, which is why this one is easy to miss.',
  },
  {
    id: 'no-authorization',
    title: 'Server Actions without authorization.',
    body: 'Authentication proves who they are. It does not prove the record is theirs, and neither does a check you forgot to put in the where clause of the update itself.',
  },
  {
    id: 'logic-in-routes',
    title: 'Business logic in route files.',
    body: 'Move it one directory over and it becomes an ordinary function a test can call with an id and check what comes back, no framework, no request, no mocking. Left in the route, testing it means booting Next.js.',
  },
  {
    id: 'as-cast',
    title: '`as` to silence the compiler.',
    body: 'The compiler was right. Each cast should carry a comment saying what you know that it does not, and if you cannot write that comment, the cast is covering a real bug you have postponed.',
  },
  {
    id: 'clean-later',
    title: '"I\'ll clean it up later."',
    body: 'Later has an empty calendar. Clean before the pull request, not in a follow-up ticket that never gets picked up once the slice already shipped.',
  },
  {
    id: 'random-mutation',
    title: 'Debugging by random mutation.',
    body: 'Change one thing, predict the result, verify. If you cannot predict it, you do not understand the system yet, and any fix that follows will be coincidental rather than actually correct.',
  },
  {
    id: 'diff-messages',
    title: 'Commit messages that describe the diff.',
    body: 'Git log should tell you why, because the diff already tells you what. Six months from now the log is the only record of your reasoning, and a message restating the change leaves future you nothing to work with.',
  },
]
