import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { caching } from '@/lib/cheatsheets/caching'
import { CheatsheetView } from './Cheatsheet'

test('the real caching sheet renders caller and freshness limits so data tests cannot hide dropped advice', () => {
  render(<CheatsheetView sheet={caching} />)
  const rows = Array.from(document.querySelectorAll('dl > div'))
  const action = rows.find(
    (row) => row.querySelector('dt')?.textContent === 'updateTag(tag)',
  ) as HTMLElement
  expect(within(action).getByText(/Server Actions only/)).toBeTruthy()
  expect(
    within(action).getByText(/not available in Route Handlers/),
  ).toBeTruthy()
  expect(
    screen.getByText(/From a Route Handler.*block for fresh data/),
  ).toBeTruthy()
  expect(screen.getByText(/does not prove.*latest write/)).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: /Performance Optimization/ })
      .getAttribute('href'),
  ).toBe('/stages/09-performance-optimization')
})
test('the real caching sheet credits Next.js and Cloudflare with exact targets and renders the literal example', () => {
  render(<CheatsheetView sheet={caching} />)
  const footer = document.querySelector('footer')!
  expect(within(footer).getAllByRole('link')).toHaveLength(7)
  expect(
    within(footer)
      .getByRole('link', { name: 'updateTag' })
      .getAttribute('href'),
  ).toBe('https://nextjs.org/docs/app/api-reference/functions/updateTag')
  expect(
    within(footer)
      .getByRole('link', { name: 'Cloudflare cache responses' })
      .getAttribute('href'),
  ).toBe('https://developers.cloudflare.com/cache/concepts/cache-responses/')
  expect(screen.getByText(/cacheTag\(`catalog:/)).toBeTruthy()
  expect(document.querySelector('pre code')?.textContent).toContain(
    'https://catalog.example/products/',
  )
  expect(document.querySelector('pre code')?.textContent).toContain(
    "'use cache'",
  )
})
