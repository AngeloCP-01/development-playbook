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
