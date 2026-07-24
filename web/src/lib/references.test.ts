import { expect, test } from 'vitest'
import { REFERENCES } from './references'

test('every stage with references has between 3 and 5, so the list stays curated', () => {
  for (const [slug, refs] of Object.entries(REFERENCES)) {
    expect(refs.length, `${slug} has ${refs.length}`).toBeGreaterThanOrEqual(3)
    expect(refs.length, `${slug} has ${refs.length}`).toBeLessThanOrEqual(5)
  }
})

test('every reference has an https url, a source, and says what it adds', () => {
  for (const [slug, refs] of Object.entries(REFERENCES)) {
    for (const r of refs) {
      expect(r.url.startsWith('https://'), `${slug}: ${r.title}`).toBe(true)
      expect(
        r.source.trim().length,
        `${slug}: ${r.title} source`,
      ).toBeGreaterThan(0)
      expect(r.adds.trim().length, `${slug}: ${r.title} adds`).toBeGreaterThan(
        0,
      )
    }
  }
})

test('reference urls are unique within a stage', () => {
  for (const [slug, refs] of Object.entries(REFERENCES)) {
    const urls = refs.map((r) => r.url)
    expect(new Set(urls).size, `${slug} has a duplicate url`).toBe(urls.length)
  }
})
