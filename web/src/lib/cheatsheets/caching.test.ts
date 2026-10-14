import { expect, test } from 'vitest'
import { caching } from './caching'
import { sheetSources } from './sheet-sources'
const rows = caching.sections.flatMap((section) => section.rows)
const text = rows
  .map((row) => `${row.code ?? row.term}: ${row.what} ${row.when ?? ''}`)
  .join('\n')
const api = (code: string) => rows.find((row) => row.code === code)!

test('the caching lookup belongs to stage 09 and covers the five agreed decisions', () => {
  expect(caching.stage).toBe('09-performance-optimization')
  expect(caching.sections.map((section) => section.title)).toEqual([
    'Choose the boundary',
    'Set lifetime and tags',
    'Invalidate after a write',
    'Read CDN evidence',
    'Verify the change',
  ])
})
test('read-your-own-write advice distinguishes caller boundaries from tolerated stale reads', () => {
  expect(api('updateTag(tag)').what).toMatch(/Server Actions only/)
  expect(api('updateTag(tag)').when).toMatch(/not available in Route Handlers/)
  expect(api("revalidateTag(tag, 'max')").what).toMatch(
    /stale data.*background/,
  )
  expect(api('revalidateTag(tag, { expire: 0 })').what).toMatch(
    /Route Handler.*block for fresh data/,
  )
})
test('cached descriptions never replace authoritative business checks or grant tenant access', () => {
  expect(text).toMatch(/stock, charge status and authorization.*authoritative/)
  expect(text).toMatch(/tenant-specific cache key does not grant access/)
  expect(text).toMatch(/two users or tenants/)
})
test('CDN evidence names its provider and does not claim a hit proves current application data', () => {
  expect(
    caching.sections.find((section) => section.title === 'Read CDN evidence')!
      .note,
  ).toMatch(/Cloudflare.*not Next.js/)
  expect(rows.find((row) => row.term === 'HIT')!.when).toMatch(
    /does not prove.*latest write/,
  )
  expect(rows.find((row) => row.term === 'MISS')!.when).toMatch(
    /without a fault/,
  )
  expect(rows.find((row) => row.term === 'BYPASS')!.what).toMatch(
    /response.*prevented/,
  )
  expect(rows.find((row) => row.term === 'DYNAMIC')!.what).toMatch(
    /ineligible.*request time/,
  )
})
test('the retest keeps comparable scope, failures and freshness rather than only a hit rate', () => {
  expect(text).toMatch(/cold\/warm cache state/)
  expect(text).toMatch(/timeout\/failure rule, errors and correctness/)
  expect(text).toMatch(/single lab run is not a field p95/)
  expect(text).toMatch(/other user or tenant/)
})
test('every publisher used in caching is credited and example syntax is literal data', () => {
  expect(sheetSources(caching).map((citation) => citation.author)).toEqual([
    'Next.js',
    'Next.js',
    'Next.js',
    'Next.js',
    'Next.js',
    'Cloudflare',
    'Cloudflare',
  ])
  expect(api("'use cache'").example![0].code).toContain("cacheLife('minutes')")
  expect(api("'use cache'").example![0].code).toContain(
    'cacheTag(`catalog:${productId}`)',
  )
  expect(text).toMatch(/instance-local and ephemeral/)
})
