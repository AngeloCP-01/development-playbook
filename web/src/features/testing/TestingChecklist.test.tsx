import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { STAGES } from '@/lib/stages'
import { TestingChecklist } from './TestingChecklist'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'

function stageTitle(slug: string): string {
  return STAGES.find((s) => s.slug === slug)!.title
}

/**
 * jsdom hands every test in this file the same `localStorage`, and
 * `useLocalStorage` additionally memoises parsed values in a module-level
 * `Map`. Mirrors `SetupChecklist.test.tsx` / `DevChecklist.test.tsx`.
 */
beforeEach(() => {
  window.localStorage.clear()
})

test('renders every done item as a real checkbox, derived from the data', () => {
  render(<TestingChecklist />)
  expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
})

test('ticking one item does not tick the rest', () => {
  render(<TestingChecklist />)
  const boxes = screen.getAllByRole('checkbox')
  fireEvent.click(boxes[0])
  expect((boxes[0] as HTMLInputElement).checked).toBe(true)
  expect((boxes[1] as HTMLInputElement).checked).toBe(false)
})

/**
 * The brief's literal assertion here builds `new RegExp` from
 * `a.replace(/\`/g, '').slice(0, 20)`. Two problems, both plan defects, not
 * mismatches:
 *
 * 1. `ARTIFACT_LIST[0]` is `` `*.test.ts` alongside source in
 *    `src/features/` `` — stripped of backticks, its first 20 characters
 *    open with a bare `*`, an invalid regex ("Nothing to repeat").
 * 2. Even escaped, a fragment built by *stripping* backticks can straddle a
 *    boundary `InlineCode` actually renders as two DOM nodes (a `<code>`
 *    and its surrounding text), and `getByText`'s default text getter reads
 *    only a node's own direct text children — `getNodeText` in
 *    `@testing-library/dom` — so a fragment split across that boundary
 *    matches nothing.
 *
 * `DevChecklist.test.tsx` hit both classes of problem (parens in a label,
 * text split across `InlineCode`'s code/non-code boundary) and solved them
 * with `escapeForRegExp` and `textFragment` helpers. Applying that same
 * precedent here rather than inventing a second idiom.
 */
function escapeForRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function textFragment(label: string): string {
  const candidate = label.split('`').find((part) => part.trim().length >= 8)
  return (candidate ?? label).trim()
}

test('the four artifacts are listed, since the panel claims to name the outputs', () => {
  render(<TestingChecklist />)
  for (const a of ARTIFACT_LIST) {
    expect(
      screen.getByText(new RegExp(escapeForRegExp(textFragment(a)))),
      a,
    ).toBeDefined()
  }
})

/**
 * Finding 6 of Task 14's coverage walk: the review-requirement note's `(07)`
 * rendered as a bare number while 04, 05 and 14 render as real links
 * elsewhere in this stage. Mirrors `DevChecklist.test.tsx`'s stage-link test.
 */
test("links the review-requirement note to stage 07, named for the stage's real title", () => {
  render(<TestingChecklist />)
  // The team notes live inside `TeamNotes`, a disclosure collapsed by
  // default — its children are not in the DOM until it opens.
  fireEvent.click(screen.getByRole('button', { name: /if you are not solo/i }))
  const withStage = TEAM.find((t) => t.id === 'require-tests')!
  const link = screen.getByRole('link', { name: stageTitle(withStage.stage!) })
  expect(link.getAttribute('href')).toBe(`/stages/${withStage.stage}`)
})
