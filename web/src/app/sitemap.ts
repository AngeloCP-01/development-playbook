import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { STAGES } from '@/lib/stages'
import { CHEATSHEETS } from '@/lib/cheatsheets'

/**
 * Derived from STAGES rather than hand-listed, so a nineteenth stage cannot be
 * added without appearing here. `seo.test.ts` holds both directions.
 *
 * `priority` is deliberately flat apart from the index. The eighteen stages are
 * filing codes rather than a sequence (CLAUDE.md), so ranking 01 above 15 would
 * encode exactly the linear-waterfall reading the playbook argues against.
 *
 * The reference sheets sit below the stages at 0.5. That is a ranking of kind
 * rather than of sequence — lookup material derived from the playbook, not the
 * playbook's substance — so it does not reintroduce the ordering the paragraph
 * above rules out. Within the sheets the priority is flat, for the same reason
 * it is flat within the stages.
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
    {
      url: `${SITE_URL}/reference`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...CHEATSHEETS.map((sheet) => ({
      url: `${SITE_URL}/reference/${sheet.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
