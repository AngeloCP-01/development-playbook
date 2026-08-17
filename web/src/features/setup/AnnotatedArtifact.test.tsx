import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AnnotatedArtifact } from './AnnotatedArtifact'
import { ARTIFACTS } from './artifacts'

// The reader is meant to paste these files, so the block has to be the file.
// Comparing the rendered lines to `lines.map(l => l.text)` as a sequence — not
// as a count — also pins the order and the blank line in `lefthook.yml`, which
// a `.filter(Boolean)` somewhere in the component would silently swallow.
test('renders every line of the artifact, because a dropped line is a config the reader cannot paste', () => {
  const { container } = render(
    <AnnotatedArtifact artifact={ARTIFACTS.lefthook} />,
  )
  const rendered = [...container.querySelectorAll('[data-artifact-line]')].map(
    (el) => el.textContent,
  )
  expect(rendered).toEqual(ARTIFACTS.lefthook.lines.map((l) => l.text))
})

test('shows a note only on the lines that carry one, so annotation stays a signal', () => {
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.ci} />)
  const noted = container.querySelectorAll('[data-artifact-note]')
  expect(noted).toHaveLength(ARTIFACTS.ci.lines.filter((l) => l.note).length)
})

test('names the file, since five steps render one of these and they differ only by filename', () => {
  render(<AnnotatedArtifact artifact={ARTIFACTS.tsconfig} />)
  expect(screen.getByText(ARTIFACTS.tsconfig.filename)).not.toBeNull()
})

// The pivot is the line the step's judgment turns on. If it renders identically
// to its neighbours, the component has thrown away the only thing the data says
// about relative importance.
test('marks the pivot line distinctly from the lines around it', () => {
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)
  expect(container.querySelectorAll('[data-artifact-pivot]')).toHaveLength(1)
})
