import { expect, test } from 'vitest'
import { SITE_URL } from './site'

// Three files build URLs on this string. A trailing slash makes every one of
// them `https://host//stages/...` — valid, ugly, and wrong for canonical URLs,
// which is the sort of defect that ships and is never noticed.
test('the site origin has no trailing slash, since every caller concatenates a path onto it', () => {
  expect(SITE_URL.endsWith('/'), `SITE_URL is "${SITE_URL}"`).toBe(false)
})

test('the site origin is absolute, because metadataBase and the sitemap both reject a relative one', () => {
  expect(() => new URL(SITE_URL)).not.toThrow()
  expect(SITE_URL).toMatch(/^https:\/\//)
})
