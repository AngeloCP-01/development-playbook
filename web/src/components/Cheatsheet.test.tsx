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

const undrawnWithImage: Cheatsheet = {
  slug: 'undrawn-with-image',
  title: 'Undrawn With Image',
  group: 'Architecture',
  blurb: 'Gathered but not transcribed.',
  source: {
    title: 'Some Graphic',
    author: 'A. Person',
    image: {
      src: '/reference/some-graphic.webp',
      width: 1080,
      height: 1350,
      alt: 'A fifteen-step roadmap for API design.',
    },
  },
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

// The source graphic is shown alongside the transcription rather than instead of
// it (D-63). Dimensions are rendered because a plate that reserves no space
// reflows the page as the image arrives.
test('renders the source graphic with explicit dimensions when the sheet has one', () => {
  render(<CheatsheetView sheet={undrawnWithImage} />)
  const img = screen.getByRole('img', { name: /fifteen-step roadmap/i })

  // next/image routes the file through the optimiser, so the src is a query
  // rather than the path. Decoding it still catches the failure that matters —
  // a sheet pointing at the wrong file — without asserting the loader's format.
  expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain(
    '/reference/some-graphic.webp',
  )
  expect(img.getAttribute('width')).toBe('1080')
  expect(img.getAttribute('height')).toBe('1350')
})

// The alt decision is derived from whether a text equivalent exists, which makes
// it exactly the conditional TD-17 requires a render test for. Getting this
// backwards is an accessibility defect that no data test would catch: a
// screen reader either hears a duplicate of the page it just read, or hears
// nothing at all where the only content is.
test('leaves the graphic decorative on a drawn sheet, since the transcription below it is a complete equivalent', () => {
  const drawnWithImage = {
    ...drawn,
    source: { ...drawn.source!, image: undrawnWithImage.source!.image },
  }
  render(<CheatsheetView sheet={drawnWithImage} />)
  expect(screen.queryByRole('img')).toBeNull()
  const img = document.querySelector('img')
  expect(img?.getAttribute('alt')).toBe('')
})

test('gives the graphic real alt text on an undrawn sheet, where it is the only content', () => {
  render(<CheatsheetView sheet={undrawnWithImage} />)
  expect(
    screen.getByRole('img', { name: 'A fifteen-step roadmap for API design.' }),
  ).toBeTruthy()
})

test('renders no graphic for a sheet whose source is text-only', () => {
  render(<CheatsheetView sheet={drawn} />)
  expect(document.querySelector('img')).toBeNull()
})
