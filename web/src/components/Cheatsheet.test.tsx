import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { Cheatsheet } from '@/lib/cheatsheets'
import { CheatsheetView } from './Cheatsheet'

const drawn: Cheatsheet = {
  slug: 'fixture',
  title: 'Fixture Sheet',
  group: 'Git',
  stage: '04-project-setup',
  blurb: 'A fixture.',
  source: { title: 'Some Graphic', author: 'A. Person' },
  sections: [
    {
      title: 'Undoing things',
      note: 'The section note.',
      rows: [
        {
          code: 'git restore <file>',
          what: 'Discard unstaged changes',
          when: 'Typo in a file, not staged yet',
        },
        { term: 'Detached HEAD', what: 'You are on a commit, not a branch' },
      ],
    },
  ],
}

const empty: Cheatsheet = {
  slug: 'blank',
  title: 'Blank Sheet',
  group: 'Languages',
  blurb: 'Not written yet.',
  sections: [],
}

test('renders every row of every section, since a dropped row is invisible in a lookup table', () => {
  render(<CheatsheetView sheet={drawn} />)
  expect(screen.getByText('Undoing things')).toBeTruthy()
  expect(screen.getByText('The section note.')).toBeTruthy()
  expect(screen.getByText('git restore <file>')).toBeTruthy()
  expect(screen.getByText('Discard unstaged changes')).toBeTruthy()
  expect(screen.getByText('Typo in a file, not staged yet')).toBeTruthy()
  expect(screen.getByText('Detached HEAD')).toBeTruthy()
})

// The placeholder is the entire point of registering empty sheets. A renderer
// that returned null here would pass every data test and destroy the feature.
test('shows a not-drawn placeholder instead of an empty page when the sheet has no sections', () => {
  render(<CheatsheetView sheet={empty} />)
  expect(screen.getByText(/not drawn/i)).toBeTruthy()
})

test('does not show the placeholder once a sheet has content', () => {
  render(<CheatsheetView sheet={drawn} />)
  expect(screen.queryByText(/not drawn/i)).toBeNull()
})

// Attribution is a conditional render, which is exactly the combination TD-17
// was opened for: a data test alone would pass against a component that never
// renders the field.
test('credits the source when a sheet has one', () => {
  render(<CheatsheetView sheet={drawn} />)
  expect(screen.getByText(/A\. Person/)).toBeTruthy()
  expect(screen.getByText(/Some Graphic/)).toBeTruthy()
})

test('renders no attribution block for a sheet written from scratch', () => {
  render(<CheatsheetView sheet={empty} />)
  expect(screen.queryByText(/A\. Person/)).toBeNull()
})

test('links back to the tethered stage, which is what makes this a section beside the stages rather than apart from them', () => {
  render(<CheatsheetView sheet={drawn} />)
  const link = screen.getByRole('link', { name: /project setup/i })
  expect(link.getAttribute('href')).toBe('/stages/04-project-setup')
})

test('renders no stage link for a language sheet, which is tethered to nothing', () => {
  render(<CheatsheetView sheet={empty} />)
  expect(screen.queryByRole('link')).toBeNull()
})

test('gives each section a level-2 heading so the sheet is navigable by structure', () => {
  render(<CheatsheetView sheet={drawn} />)
  expect(
    screen.getByRole('heading', { name: 'Undoing things', level: 2 }),
  ).toBeTruthy()
})
