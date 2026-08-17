import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { InlineCode } from './InlineCode'

test('leaves a string with no backticks exactly as it was', () => {
  const { container } = render(<InlineCode text="no code here at all" />)
  expect(container.textContent).toBe('no code here at all')
  expect(container.querySelector('code')).toBeNull()
})

// The reason this component exists. Stage 04's data modules quote filenames and
// commands the way the doc does, and several of those strings are asserted to
// appear in `docs/04-project-setup.md` character-for-character — so the
// backticks cannot be stripped from the data, and without this they render as
// literal backticks on the page.
test('renders a backticked span as code while keeping the text around it', () => {
  const { container } = render(<InlineCode text="run `pnpm install` first" />)
  expect(container.textContent).toBe('run pnpm install first')
  const code = container.querySelectorAll('code')
  expect(code).toHaveLength(1)
  expect(code[0].textContent).toBe('pnpm install')
})

test('handles several spans in one string, since most of these strings have more than one', () => {
  const { container } = render(
    <InlineCode text="`.nvmrc` locally and `engines.node` on the host" />,
  )
  expect(
    [...container.querySelectorAll('code')].map((c) => c.textContent),
  ).toEqual(['.nvmrc', 'engines.node'])
  expect(container.textContent).toBe(
    '.nvmrc locally and engines.node on the host',
  )
})

// An odd number of backticks is a typo in the data, and the failure mode that
// matters is the silent one: a split that treats the tail as code would hide
// the rest of the sentence in a monospace span rather than showing the typo.
test('renders an unpaired backtick literally rather than swallowing the rest of the sentence', () => {
  const { container } = render(
    <InlineCode text="a `stray tick and more text" />,
  )
  expect(container.textContent).toBe('a `stray tick and more text')
  expect(container.querySelector('code')).toBeNull()
})

test('gives every code span the t-data type role, not a Tailwind font size', () => {
  const { container } = render(<InlineCode text="the `engines.node` field" />)
  expect(container.querySelector('code')?.className).toContain('t-data')
})

// A long identifier is one word to the line-breaker, and this stage is made of
// them. `process.env.NEXT_PUBLIC_APP_URL` measured 321px inside a 320px
// viewport and pushed the document 25px sideways — caught by the audit's
// overflow sweep, which is the check that exists for exactly this.
test('lets a long identifier break, since one unbreakable token scrolls the page sideways', () => {
  const { container } = render(
    <InlineCode text="read `process.env.NEXT_PUBLIC_APP_URL` directly" />,
  )
  expect(container.querySelector('code')?.className).toContain('break-words')
})
