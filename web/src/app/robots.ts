import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * The whole site is public and there is nothing to hide: no backend, no
 * accounts, no private routes. So this allows everything and points at the
 * sitemap, and the test asserts that rather than trusting it — a deploy that
 * ships `Disallow: /` looks perfect and is never indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
