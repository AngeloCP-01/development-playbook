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

// Notes are prose copied from the doc, so they carry the doc's inline code
// markers. This component predates `InlineCode` by two commits and printed the
// backticks literally — eleven of them on the scaffold panel alone, found by
// grepping the built page rather than by reading the component.
test('renders a note’s backticked spans as code rather than printing the backticks', () => {
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)
  const note = container.querySelector('[data-artifact-note]')

  expect(note?.textContent).not.toContain('`')
  expect(note?.querySelectorAll('code').length).toBeGreaterThan(0)
})

// TD-39, first half. The rows lay out as [code][note], so the notes sit between
// the code lines in the DOM and selecting a block yields code, annotation, code,
// annotation — over data whose own header says the reader is meant to paste it.
// `SchemaInspector`, the component this copied, avoided it by putting the note
// in a separate panel.
//
// `select-none` on the note column makes a manual selection return only code.
// Asserted as a class rather than as behaviour because jsdom computes no
// selection; the behaviour was confirmed in a browser.
test('excludes the notes from a text selection, so the block can be copied', () => {
  const { container } = render(
    <AnnotatedArtifact artifact={ARTIFACTS.lefthook} />,
  )
  const notes = [...container.querySelectorAll('[data-artifact-note]')]

  expect(notes.length).toBeGreaterThan(0)
  for (const note of notes) {
    expect(note.className, note.textContent?.slice(0, 30)).toContain(
      'select-none',
    )
  }
})
