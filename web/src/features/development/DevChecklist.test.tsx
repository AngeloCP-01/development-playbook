import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { DEV_CHECKLIST_KEY, DevChecklist } from './DevChecklist'
import { ARTIFACT_ITEMS, DONE } from './checklist'
import { STAGES } from '@/lib/stages'

/**
 * jsdom hands every test in this file the same `localStorage`, and
 * `useLocalStorage` additionally memoises parsed values in a module-level
 * `Map`. Without the reset below, the second test would start already ticked
 * from the first. Mirrors `SetupChecklist.test.tsx`.
 */
beforeEach(() => {
  window.localStorage.clear()
})

function stageTitle(slug: string): string {
  return STAGES.find((s) => s.slug === slug)!.title
}

/**
 * A backtick-free run of a label long enough to identify its row uniquely.
 * Labels render through `InlineCode`, which strips the delimiter characters
 * but keeps the enclosed text as a `<code>` element's own text content — so
 * a run that never touched a backtick is exactly what survives into the
 * accessible name, whether it sits before, between, or is the whole label.
 */
function textFragment(label: string): string {
  const candidate = label.split('`').find((part) => part.trim().length >= 8)
  return (candidate ?? label).trim()
}

/** Escapes a plain-text fragment for use inside `new RegExp(...)` — several
 * labels carry parentheses around a stage number, which are regex metachars. */
function escapeForRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Labels render through `InlineCode`, so a label carrying backticks becomes a
// `<code>` element in the accessible name rather than literal backtick
// characters. A short, backtick-free fragment is enough to identify the row
// without rebuilding the component's own transformation in the test.
const FIRST = /Tests written and passing/
const REBASED = /Rebased, so history reads in order/

test('renders one checkbox per done item, so an item added to the data appears without touching this file', () => {
  render(<DevChecklist />)
  expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
})

// Ruling A: the doc's `## Artifacts` list is rendered too, above the
// checklist, and it is not a second exercise — no checkbox for it.
test('renders the four artifacts as a plain list, not as tickable items', () => {
  render(<DevChecklist />)
  for (const artifact of ARTIFACT_ITEMS) {
    // Artifacts render through `InlineCode` too, so a backtick-carrying item
    // (`src/features/<feature>/`) splits across a `<code>` element and its
    // surrounding text — a fragment on one side of the backtick is what
    // survives as a single text node, not the full string.
    expect(
      screen.getByText(new RegExp(escapeForRegExp(textFragment(artifact)))),
      artifact,
    ).toBeDefined()
  }
  expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
})

// The accessible-name bug SetupChecklist's sibling review found: a label
// assembled in the component while only the visible text derives from data.
test('names each checkbox for its own done item’s label, not a hardcoded string', () => {
  render(<DevChecklist />)
  expect(screen.getByRole('checkbox', { name: FIRST })).toBeDefined()
  expect(screen.getByRole('checkbox', { name: REBASED })).toBeDefined()
})

test('checking an item survives a remount, since a worksheet that forgets is a worksheet nobody fills in', () => {
  const { unmount } = render(<DevChecklist />)
  fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))

  expect(window.localStorage.getItem(DEV_CHECKLIST_KEY)).toContain(DONE[0].id)

  unmount()
  render(<DevChecklist />)
  const box = screen.getByRole('checkbox', { name: FIRST })
  expect((box as HTMLInputElement).checked).toBe(true)
})

test('the count updates as items are ticked', () => {
  render(<DevChecklist />)
  expect(screen.getByText(`0/${DONE.length}`)).toBeDefined()
  fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))
  expect(screen.getByText(`1/${DONE.length}`)).toBeDefined()
})

test('reset clears every tick', () => {
  render(<DevChecklist />)
  fireEvent.click(screen.getByRole('checkbox', { name: FIRST }))
  fireEvent.click(screen.getByRole('checkbox', { name: REBASED }))
  expect(screen.getByText(`2/${DONE.length}`)).toBeDefined()

  const originalConfirm = window.confirm
  window.confirm = () => true
  fireEvent.click(screen.getByRole('button', { name: /Clear/ }))
  window.confirm = originalConfirm

  expect(screen.getByText(`0/${DONE.length}`)).toBeDefined()
  expect(
    (screen.getByRole('checkbox', { name: FIRST }) as HTMLInputElement).checked,
  ).toBe(false)
})

// Ids are slugs, not positions, so reordering `DONE` must not reset a
// reader's ticks. This is the teeth check the task brief asks for: storage
// pre-seeded with the *last* item's id must tick that item regardless of
// where it sits in the rendered list.
test('keys progress on the item id rather than its position, so reordering the data does not reset a reader’s ticks', () => {
  window.localStorage.setItem(
    DEV_CHECKLIST_KEY,
    JSON.stringify([DONE[DONE.length - 1].id]),
  )
  render(<DevChecklist />)
  const lastFragment = textFragment(DONE[DONE.length - 1].label)
  expect(
    (
      screen.getByRole('checkbox', {
        name: new RegExp(escapeForRegExp(lastFragment)),
      }) as HTMLInputElement
    ).checked,
  ).toBe(true)
  expect(
    (screen.getByRole('checkbox', { name: FIRST }) as HTMLInputElement).checked,
  ).toBe(false)
})

// Ruling I: four done items carry `stage`, and the component owes a real
// cross-reference to it rather than the bare number the label text contains.
test('links a done item that carries a stage to that stage, named for the stage’s real title', () => {
  render(<DevChecklist />)
  const withStage = DONE.find((d) => d.id === 'tests-passing')!
  const link = screen.getByRole('link', { name: stageTitle(withStage.stage!) })
  expect(link.getAttribute('href')).toBe(`/stages/${withStage.stage}`)
})

test('renders no stage link for a done item that does not carry one', () => {
  render(<DevChecklist />)
  const noStage = DONE.find((d) => !d.stage)!
  const noStageFragment = textFragment(noStage.label)
  const row = screen
    .getByRole('checkbox', {
      name: new RegExp(escapeForRegExp(noStageFragment)),
    })
    .closest('li')!
  expect(row.querySelector('a')).toBeNull()
})

test('links every done item that carries a stage, one per item', () => {
  render(<DevChecklist />)
  const withStage = DONE.filter((d) => d.stage)
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(withStage.length)
})
