import { expect, test } from 'vitest'
import { SITE_URL } from '@/lib/site'
import { STAGES } from '@/lib/stages'
import robots from './robots'
import sitemap from './sitemap'

// Bidirectional, the shape ddl-sync.test.ts and sketch.test.ts already use: a
// guard that only catches drift one way is half a guard. Forwards catches a
// nineteenth stage that never reaches the sitemap; backwards catches a sitemap
// entry pointing at a stage that no longer exists, which is a soft 404 for a
// crawler and invisible to everyone else.
test('every stage appears in the sitemap, and every stage URL in the sitemap is a real stage', () => {
  const urls = sitemap().map((entry) => entry.url)
  const stageUrls = urls.filter((u) => u.includes('/stages/'))

  expect(stageUrls.sort()).toEqual(
    STAGES.map((s) => `${SITE_URL}/stages/${s.slug}`).sort(),
  )
})

// The home page is not in STAGES, which makes it the one entry a derived
// sitemap forgets.
test('the sitemap includes the home page, which is the entry a stage-derived list drops', () => {
  expect(sitemap().map((e) => e.url)).toContain(SITE_URL)
})

test('every sitemap entry is an absolute URL under this origin, since a relative one is dropped by crawlers without complaint', () => {
  for (const entry of sitemap()) {
    expect(entry.url, `${entry.url} is not under ${SITE_URL}`).toMatch(
      new RegExp(`^${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/|$)`),
    )
  }
})

// A deploy that ships `Disallow: /` is a real and quiet failure: the site is
// live, looks perfect, and is never indexed.
test('robots allows indexing rather than forbidding it, which is the failure nobody notices for a month', () => {
  const rules = robots().rules
  const rule = Array.isArray(rules) ? rules[0] : rules
  expect(rule.allow).toBe('/')
  expect(rule.disallow ?? '').not.toBe('/')
})

test('robots points crawlers at the sitemap, since an unlinked sitemap is one nothing fetches', () => {
  expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`)
})
