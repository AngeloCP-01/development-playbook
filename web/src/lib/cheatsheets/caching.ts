import type { Cheatsheet } from './types'

export const caching: Cheatsheet = {
  slug: 'caching',
  title: 'Caching',
  group: 'Architecture',
  stage: '09-performance-optimization',
  blurb:
    'Choose reusable work, set a freshness rule, invalidate after writes, and verify the same user outcome.',
  source: {
    title: 'use cache',
    author: 'Next.js',
    url: 'https://nextjs.org/docs/app/api-reference/directives/use-cache',
  },
  additionalSources: [
    {
      title: 'cacheLife',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/cacheLife',
    },
    {
      title: 'cacheTag',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/cacheTag',
    },
    {
      title: 'updateTag',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/updateTag',
    },
    {
      title: 'revalidateTag',
      author: 'Next.js',
      url: 'https://nextjs.org/docs/app/api-reference/functions/revalidateTag',
    },
    {
      title: 'Cloudflare cache responses',
      author: 'Cloudflare',
      url: 'https://developers.cloudflare.com/cache/concepts/cache-responses/',
    },
    {
      title: 'Retention vs Freshness (TTL)',
      author: 'Cloudflare',
      url: 'https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/',
    },
  ],
  sections: [
    {
      title: 'Choose the boundary',
      note: 'Cache a result only when its ownership scope and tolerated staleness are defined. These are application decisions, not a command to add a cache everywhere.',
      rows: [
        {
          term: 'Reusable result',
          what: 'A public catalog description can be a candidate for reuse. A faster response is useful only if it still answers the intended user operation.',
          when: 'Use evidence that the repeated work contributes to the measured slow path.',
        },
        {
          term: 'Current business decision',
          what: 'Validate stock, charge status and authorization against the appropriate authoritative state. A cached description is not permission to sell, charge or disclose.',
          when: 'Before accepting an order, confirming payment or returning protected data.',
        },
        {
          term: 'Key and ownership',
          what: 'Include every input that changes the result, such as product, locale or tenant. A tenant-specific cache key does not grant access; authorization still belongs at the data boundary.',
          when: 'Test the same identifier as two users or tenants before sharing a cached result.',
        },
      ],
    },
    {
      title: 'Set lifetime and tags',
      note: 'TTL means time to live: a freshness or expiry interval under the chosen cache policy. Retention is how long an entry remains stored; neither term promises persistence on every host.',
      rows: [
        {
          code: 'cacheComponents: true',
          what: 'Enable Cache Components in the example application before using the Next.js use cache directive. This playbook is teaching the API; it does not enable runtime caching here.',
          when: 'Check the installed framework version and hosting behavior.',
        },
        {
          code: "'use cache'",
          what: 'Mark an async function, component or module scope for caching. Read cookies, headers and other request-specific values outside that scope, then pass the needed inputs.',
          when: 'Reuse an eligible result, with its input and ownership boundaries already defined.',
          example: [
            {
              label:
                'Illustrative public-description read; example domain, not this app',
              code: "import { cacheLife, cacheTag } from 'next/cache'\n\nexport async function readDescription(productId: string) {\n  'use cache'\n  cacheLife('minutes')\n  cacheTag(`catalog:${productId}`)\n  const response = await fetch(\n    `https://catalog.example/products/${encodeURIComponent(productId)}`,\n  )\n  if (!response.ok) throw new Error('Catalog read failed')\n  const { id, description } = await response.json()\n  return { id, description }\n}",
            },
          ],
        },
        {
          code: 'cacheLife / cacheTag',
          what: 'Choose a lifetime consistent with tolerated staleness and tag the reads a successful write will invalidate. Tags label entries; they are not authorization checks.',
          when: 'Describe the expected read after a write, not only how long the entry might be retained.',
        },
        {
          term: 'Hosting and retention',
          what: 'Default runtime memory can be instance-local and ephemeral, especially on serverless hosts. Check the configured cache handler before assuming reuse across requests or deployments.',
          when: 'A published lifetime is not evidence that a particular instance still holds the entry.',
        },
      ],
    },
    {
      title: 'Invalidate after a write',
      note: 'The write must succeed before invalidating affected reads. Invalidation changes the next matching data read; it does not automatically refresh every open browser view.',
      rows: [
        {
          code: 'updateTag(tag)',
          what: 'Server Actions only: expire matching entries immediately so the next matching read waits for fresh data.',
          when: 'Use after a successful write when the actor must read their own change. It is not available in Route Handlers.',
        },
        {
          code: "revalidateTag(tag, 'max')",
          what: 'Server Actions or Route Handlers: mark tagged data stale; the next visit can receive stale data while revalidation runs in the background.',
          when: 'Use when stale-while-revalidate behavior is acceptable. The call itself does not eagerly refresh every tagged page.',
        },
        {
          code: 'revalidateTag(tag, { expire: 0 })',
          what: 'From a Route Handler that requires immediate expiry, make the next matching read block for fresh data.',
          when: 'Use when stale content is unacceptable and updateTag is unavailable. Avoid the deprecated single-argument revalidateTag form.',
        },
      ],
    },
    {
      title: 'Read CDN evidence',
      note: 'CDN means content delivery network. CF-Cache-Status describes Cloudflare response caching, not Next.js application-cache entries. These examples do not imply this site uses Cloudflare.',
      rows: [
        {
          term: 'HIT',
          what: 'Cloudflare found the response in its cache.',
          when: 'A hit does not prove the application data reflects the latest write.',
        },
        {
          term: 'MISS',
          what: 'The request was eligible for Cloudflare caching but the response was absent, so the origin served it.',
          when: 'A first or cold request can miss without a fault.',
        },
        {
          term: 'BYPASS',
          what: 'Cloudflare considered the request eligible, but the response or policy prevented storing the response.',
          when: 'Inspect the relevant response headers and cache rules before changing the policy.',
        },
        {
          term: 'DYNAMIC',
          what: 'Cloudflare considered the request ineligible for cache at request time.',
          when: 'Check eligibility rules; do not treat this as a missing Next.js tag.',
        },
        {
          term: 'Freshness and retention',
          what: 'A freshness interval controls when origin validation is required. An expired entry may still be retained; stale serving depends on the applicable revalidation policy.',
          when: 'Keep CDN headers and application-cache tags as separate controls.',
        },
        {
          code: 'curl -sS -D - -o /dev/null https://catalog.example/products/demo',
          what: 'Read response headers for an explicitly illustrative URL. Inspect CF-Cache-Status and the applicable Cache-Control headers on a real test endpoint.',
          when: 'Use a safe read endpoint; do not infer application-cache behavior from a CDN header.',
        },
      ],
    },
    {
      title: 'Verify the change',
      note: 'A cache hit is diagnostic evidence, not proof of a better or correct user outcome.',
      rows: [
        {
          term: 'Comparable outcome',
          what: 'Compare the same observer, start/end events, segment, workload, observation window and cold/warm cache state. A p95 is the duration at the 95th percentile of the stated population.',
          when: 'Record the sample, timeout/failure rule, errors and correctness as well as latency; a single lab run is not a field p95.',
        },
        {
          term: 'Freshness and isolation',
          what: 'After the write, confirm the intended reader sees the expected state. Repeat as another user or tenant and confirm protected data is not disclosed.',
          when: 'Keep the cache change only when the freshness rule, authorization and user target still hold.',
        },
      ],
    },
  ],
}
