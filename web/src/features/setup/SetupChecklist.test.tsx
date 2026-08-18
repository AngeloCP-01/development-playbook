import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { SETUP_CHECKLIST_KEY, SetupChecklist } from './SetupChecklist'
import { DONE, TEAM_MOVES } from './checklist'

/**
 * jsdom hands every test in this file the same `localStorage`, and
 * `useLocalStorage` additionally memoises parsed values in a module-level
 * `Map`. Without the reset below, the second test would start already ticked
 * from the first — and a persistence test that passes because of leftover state
 * is a check that cannot fail.
 *
 * Clearing storage is enough on its own: `read()` calls `getItem` first and
 * only trusts its cache entry when the raw string still matches, so a stale
 * cache cannot outlive the value it was parsed from. The third test below is
 * what proves that claim rather than asserting it.
 */
beforeEach(() => {
  window.localStorage.clear()
})

/**
 * Labels are matched on a backtick-free fragment rather than on the whole
 * `DoneItem.label`. The labels render through `InlineCode`, so `` `pnpm dev` ``
 * in the data becomes a `<code>` element and the accessible name no longer
 * carries the backticks. Rebuilding the stripped string in the test would just
 * be the component's own transformation asserted against itself.
 */
const FIRST = /A fresh clone reaches a running app/
const LAST = /The deployed commit SHA exists in your repository/

test('renders one checkbox per done item, so an item added to the data appears without touching this file', () => {
  render(<SetupChecklist />)
  expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
})

test('checking an item survives a remount, since a worksheet that forgets is a worksheet nobody fills in', () => {
  const { unmount } = render(<SetupChecklist />)
  fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))

  // The tick has to reach storage, not just React state: without this the
  // assertion after the remount could be satisfied by any value that happened
  // to survive the unmount.
  expect(window.localStorage.getItem(SETUP_CHECKLIST_KEY)).toContain(DONE[0].id)

  unmount()
  render(<SetupChecklist />)
  const box = screen.getByRole('checkbox', { name: FIRST })
  expect((box as HTMLInputElement).checked).toBe(true)
})

// The counter-example for the test above. If the second mount were reading
// `useLocalStorage`'s module cache rather than storage, a tick would survive a
// cleared browser — and the remount test would be green for a reason that has
// nothing to do with persistence.
test('forgets a tick once storage is cleared, since a value that outlives storage is coming from a cache and not from persistence', () => {
  const { unmount } = render(<SetupChecklist />)
  fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))
  unmount()

  window.localStorage.clear()
  render(<SetupChecklist />)
  const box = screen.getByRole('checkbox', { name: FIRST })
  expect((box as HTMLInputElement).checked).toBe(false)
})

test('keys progress on the item id rather than its position, so reordering the data does not reset a reader’s ticks', () => {
  window.localStorage.setItem(
    SETUP_CHECKLIST_KEY,
    JSON.stringify([DONE[DONE.length - 1].id]),
  )
  render(<SetupChecklist />)
  expect(
    (screen.getByRole('checkbox', { name: LAST }) as HTMLInputElement).checked,
  ).toBe(true)
  expect(
    (screen.getByRole('checkbox', { name: FIRST }) as HTMLInputElement).checked,
  ).toBe(false)
})

// Stage 04 is the first stage whose data carries markdown: `checklist.ts` keeps
// the doc's checkboxes verbatim, backticks and all, because `checklist.test.ts`
// counts them out of `docs/04-project-setup.md`. Rendered raw, six of the eight
// labels would show literal backticks on the page.
test('renders the data’s backticked spans as code rather than printing the backticks', () => {
  const { container } = render(<SetupChecklist />)
  fireEvent.click(screen.getByRole('button', { name: /If you are not solo/ }))
  expect(container.querySelectorAll('code').length).toBeGreaterThan(0)
  expect(container.textContent).not.toContain('`')
})

test('renders every scaling-to-a-team move behind the disclosure, so a move added to the data is not silently dropped', () => {
  render(<SetupChecklist />)
  fireEvent.click(screen.getByRole('button', { name: /If you are not solo/ }))
  for (const move of TEAM_MOVES) {
    expect(screen.getByText(move.title), move.id).not.toBeNull()
  }
})
