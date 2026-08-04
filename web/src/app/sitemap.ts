import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { STAGES } from '@/lib/stages'

/**
 * Derived from STAGES rather than hand-listed, so a nineteenth stage cannot be
 * added without appearing here. `seo.test.ts` holds both directions.
 *
 * `priority` is deliberately flat apart from the index. The eighteen stages are
 * filing codes rather than a sequence (CLAUDE.md), so ranking 01 above 15 would
 * encode exactly the linear-waterfall reading the playbook argues against.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...STAGES.map((stage) => ({
      url: `${SITE_URL}/stages/${stage.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
