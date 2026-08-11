import { expect, test } from '@playwright/test'

/**
 * Smoke tests against the deployed site. Read-only by construction: the site is
 * static and public, there is nothing to write to, and nothing here may
 * introduce a write. Run with `pnpm test:prod` after a promotion to `main`.
 *
 * The rule for what belongs here: a check earns its place only if a local or CI
 * build structurally cannot perform it. Contrast, overflow and panel weight are
 * properties of the built HTML and CSS — the bytes CI checked are the bytes
 * Vercel serves — so they stay in `audit.spec.ts` and are not repeated here.
 *
 * Everything asserts against `baseURL`, never against `SITE_URL` from `src/`.
 * Those two differ by design: production resolves NEXT_PUBLIC_SITE_URL and
 * everywhere else resolves a fallback. Importing the constant would make this
 * suite agree with the repo instead of checking the deployment.
 */

/** The origin under test, without a trailing slash. */
function origin(baseURL: string | undefined): string {
  if (!baseURL) throw new Error('no baseURL configured')
  return baseURL.replace(/\/$/, '')
}

test(
  'robots.txt allows indexing and names this deployment’s own origin, which is the one artifact no local build can get right',
  { tag: '@smoke' },
  async ({ request, baseURL }) => {
    const res = await request.get('/robots.txt')
    expect(res.status(), 'robots.txt did not return 200').toBe(200)

    const body = await res.text()
    expect(body).toMatch(/Allow:\s*\//i)
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/im)
    expect(
      body,
      `robots.txt does not name ${origin(baseURL)} — NEXT_PUBLIC_SITE_URL is probably wrong or unset`,
    ).toContain(`${origin(baseURL)}/sitemap.xml`)
  },
)

test(
  'the sitemap lists all 19 public URLs on this deployment’s origin, since a sitemap built from the wrong origin is invisible to every local gate',
  { tag: '@smoke' },
  async ({ request, baseURL }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status(), 'sitemap.xml did not return 200').toBe(200)

    const locs = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1],
    )

    // 19 = the index plus one page per stage. A drop means a stage stopped
    // being generated; a rise means something is being advertised twice.
    expect(locs, `sitemap lists ${locs.length} URLs`).toHaveLength(19)
    for (const loc of locs) {
      expect(loc, `${loc} is not on ${origin(baseURL)}`).toContain(
        origin(baseURL),
      )
    }
  },
)

// The unit test for the sitemap reads the same STAGES array the sitemap is
// generated from, so it can only ever agree with itself. Whether the URLs
// actually resolve is a question for the edge.
test(
  'every URL the sitemap advertises actually resolves, because a sitemap that lies is a defect only production can reveal',
  { tag: '@smoke' },
  async ({ request }) => {
    const locs = [
      ...(await (await request.get('/sitemap.xml')).text()).matchAll(
        /<loc>([^<]+)<\/loc>/g,
      ),
    ].map((m) => m[1])
    expect(locs.length, 'no URLs to check').toBeGreaterThan(0)

    const broken: string[] = []
    for (const loc of locs) {
      // GET rather than HEAD: a host that answers 405 to HEAD would fail this
      // for a reason that has nothing to do with the page existing.
      const r = await request.get(loc)
      if (r.status() !== 200) broken.push(`${r.status()} ${loc}`)
    }
    expect(broken, broken.join('\n')).toEqual([])
  },
)
