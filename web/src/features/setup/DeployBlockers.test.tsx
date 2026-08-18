import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { DeployBlockers } from './DeployBlockers'
import { BLOCKERS } from './blockers'

// Every blocker offers the same four causes (`blockers.ts` shares one `CAUSES`
// array), so an unscoped `getByRole('radio', { name })` matches four elements
// and throws on ambiguity. Each card is reached by the one thing that differs
// between them — its symptom, which is also the radiogroup's accessible name.
//
// Matched on the symptom's first six words rather than the whole string.
//
// The reason written here first was that a full-name assertion would re-apply
// the component's own transformation and check it against itself. A review
// pointed out that is not true: the helper re-applies exactly that
// transformation, just to a prefix, so truncating reduces circularity by zero
// and only weakens what is asserted. The real reason is duller — testing
// library's string `name` matcher is exact, and these names are long and
// punctuated, so a regex is the practical way to reach them. Six words is
// unique across four blockers.
const cardFor = (symptom: string) =>
  screen.getByRole('radiogroup', {
    name: new RegExp(
      symptom
        .replace(/`/g, '')
        .split(' ')
        .slice(0, 6)
        .join(' ')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ),
  })

// `InlineCode` splits a string across a <p> and its <code> children, so
// `getByText(wholeString)` finds nothing — the text is real on the page and no
// single node holds it. These match on the element's own textContent with the
// backticks removed, which is what a reader actually sees.
const seen = (text: string) => {
  const want = text.replace(/`/g, '')
  return (_content: string, el: Element | null) =>
    el?.textContent?.trim() === want &&
    !Array.from(el.children).some((c) => c.textContent?.trim() === want)
}

test('renders one card per blocker, derived from the data rather than hardcoded', () => {
  render(<DeployBlockers />)
  expect(screen.getAllByRole('radiogroup')).toHaveLength(BLOCKERS.length)
  for (const b of BLOCKERS) {
    expect(screen.getByText(seen(b.symptom))).toBeDefined()
  }
})

// The lesson is the guess. A verdict visible before a choice is made turns the
// exercise into a table with extra clicks.
test('hides every verdict until that blocker has been answered', () => {
  render(<DeployBlockers />)
  for (const b of BLOCKERS) {
    expect(screen.queryByText(seen(b.explanation))).toBeNull()
  }
})

test('reveals only the answered blocker’s verdict, not the whole set', () => {
  render(<DeployBlockers />)
  const first = BLOCKERS[0]
  fireEvent.click(
    within(cardFor(first.symptom)).getByRole('radio', {
      name: first.options[0].label,
    }),
  )
  expect(screen.getByText(seen(first.explanation))).toBeDefined()
  expect(screen.queryByText(seen(BLOCKERS[1].explanation))).toBeNull()
})

test('a locked answer cannot be changed, since scoring a second guess scores hindsight', () => {
  render(<DeployBlockers />)
  const first = BLOCKERS[0]
  const card = cardFor(first.symptom)
  fireEvent.click(
    within(card).getByRole('radio', { name: first.options[0].label }),
  )
  const other = within(card).getByRole('radio', {
    name: first.options[1].label,
  })
  expect((other as HTMLButtonElement).disabled).toBe(true)

  // `disabled` is the half this level can actually see: jsdom suppresses the
  // click on a disabled button, so the recorded answer survives a second one.
  // Checked rather than assumed — deleting the component's `id in prev` state
  // guard leaves this file green, and only flipping `disabled` off fails it.
  // The state guard stays as a backstop for the paths a render test cannot
  // dispatch, untested here on purpose rather than by oversight.
  fireEvent.click(other)
  const picked = within(card).getByRole('radio', {
    name: first.options[0].label,
  })
  expect(picked.getAttribute('aria-checked')).toBe('true')
  expect(other.getAttribute('aria-checked')).toBe('false')
})

// The set is scored, not the card: a reader who reaches `wrong-repo` by
// elimination still had to commit to the other three first, and the running
// count is what makes that visible.
test('scores across the whole set of four rather than per blocker', () => {
  render(<DeployBlockers />)

  const answer = (b: (typeof BLOCKERS)[number], optionId: string) =>
    fireEvent.click(
      within(cardFor(b.symptom)).getByRole('radio', {
        name: b.options.find((o) => o.id === optionId)!.label,
      }),
    )

  answer(BLOCKERS[0], BLOCKERS[0].answer)
  expect(screen.getByText('1/1 right')).toBeDefined()

  const wrong = BLOCKERS[1].options.find((o) => o.id !== BLOCKERS[1].answer)!
  answer(BLOCKERS[1], wrong.id)
  expect(screen.getByText('1/2 right')).toBeDefined()
})

// Symptoms and explanations are quoted from the doc and carry its inline code
// markers — `pnpm install`, `.git`, `git cat-file -t <sha>`. Written before
// `InlineCode` existed, this printed them as backticks.
//
// Named for the symptoms only, because that is all this renders: explanations
// sit behind `{done && …}` and no answer has been given here. The explanation
// path is covered by `seen()` in the two reveal tests above, which is where a
// regression there would surface. The name said "the data's" and reached one
// half of it.
test('renders the symptoms’ backticked spans as code rather than printing the backticks', () => {
  const { container } = render(<DeployBlockers />)

  expect(container.textContent).not.toContain('`')
  expect(container.querySelectorAll('code').length).toBeGreaterThan(0)
})

// The other half, asserted where it is actually reachable.
test('renders a revealed explanation’s backticked spans as code too', () => {
  const { container } = render(<DeployBlockers />)
  const b = BLOCKERS.find((x) => x.explanation.includes('`'))!

  fireEvent.click(
    within(cardFor(b.symptom)).getByRole('radio', { name: b.options[0].label }),
  )

  expect(container.textContent).not.toContain('`')
  expect(
    cardFor(b.symptom).parentElement?.querySelectorAll('code').length ?? 0,
  ).toBeGreaterThan(0)
})
