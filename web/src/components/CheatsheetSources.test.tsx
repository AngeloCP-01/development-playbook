import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { Cheatsheet } from '@/lib/cheatsheets'
import { security } from '@/lib/cheatsheets/security'
import { CheatsheetView } from './Cheatsheet'

const base: Cheatsheet = {
  slug: 'credits',
  title: 'Credits',
  group: 'Architecture',
  blurb: 'Fixture.',
  sections: [],
}

test('an additional-only undrawn sheet credits its source alongside the placeholder', () => {
  render(
    <CheatsheetView
      sheet={{
        ...base,
        additionalSources: [
          {
            title: 'Supporting guide',
            author: 'Editor',
            url: 'https://example.com/guide',
          },
        ],
      }}
    />,
  )
  expect(screen.getByText('Sheet not drawn')).toBeTruthy()
  expect(screen.getByText('Source', { exact: true })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Supporting guide' }).getAttribute('href'),
  ).toBe('https://example.com/guide')
  expect(screen.getByText(/Editor/)).toBeTruthy()
})
test('multiple citations retain their order, URL-less credit, and plural label', () => {
  render(
    <CheatsheetView
      sheet={{
        ...base,
        source: {
          title: 'Primary',
          author: 'One',
          url: 'https://example.com/one',
        },
        additionalSources: [
          { title: 'Printed guide', author: 'Two' },
          {
            title: 'Supporting',
            author: 'Three',
            url: 'https://example.com/three',
          },
        ],
      }}
    />,
  )
  const footer = document.querySelector('footer')!
  expect(within(footer).getByText('Sources', { exact: true })).toBeTruthy()
  const text = footer.textContent ?? ''
  expect(text.indexOf('Primary')).toBeLessThan(text.indexOf('Printed guide'))
  expect(text.indexOf('Printed guide')).toBeLessThan(text.indexOf('Supporting'))
  expect(
    within(footer).queryByRole('link', { name: 'Printed guide' }),
  ).toBeNull()
  expect(within(footer).getByText(/Two/)).toBeTruthy()
  expect(within(footer).getAllByRole('link')).toHaveLength(2)
})
test('empty supporting arrays do not create an empty attribution footer', () => {
  render(<CheatsheetView sheet={{ ...base, additionalSources: [] }} />)
  expect(document.querySelector('footer')).toBeNull()
})
test('markup-looking citation text is displayed as text rather than an image element', () => {
  render(
    <CheatsheetView
      sheet={{
        ...base,
        additionalSources: [
          {
            title: '<img src=x onerror=alert(1)>',
            author: '<script>alert(1)</script>',
          },
        ],
      }}
    />,
  )
  expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
  expect(document.querySelector('img, script')).toBeNull()
})
test('supporting citations do not replace the existing primary security diagram', () => {
  render(
    <CheatsheetView
      sheet={{
        ...security,
        additionalSources: [{ title: 'Supporting policy', author: 'Editor' }],
      }}
    />,
  )
  const img = document.querySelector('img')!
  expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain(
    '/reference/security-invoice-audit.svg',
  )
  expect(img.getAttribute('alt')).toBe('')
  expect(img.getAttribute('width')).toBe('640')
  expect(img.getAttribute('height')).toBe('780')
  expect(screen.getByText('Original diagram')).toBeTruthy()
  expect(screen.getByText('Supporting policy')).toBeTruthy()
})
