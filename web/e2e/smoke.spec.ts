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

/**
 * The scheme-and-host under test. `new URL().origin` rather than trimming a
 * trailing slash: the trimming version claimed to return an origin and did not,
 * so `PROD_URL=https://host/base` produced assertion messages describing a URL
 * the request never went to.
 */
function origin(baseURL: string | undefined): string {
  if (!baseURL) throw new Error('no baseURL configured')
  return new URL(baseURL).origin
}

test(
  'robots.txt allows indexing and names this deployment’s own origin, which is the one artifact no local build can get right',
  { tag: '@smoke' },
  async ({ request, baseURL }) => {
    const res = await request.get('/robots.txt')
    expect(res.status(), 'robots.txt did not return 200').toBe(200)

    const body = await res.text()
    // Anchored, and deliberately so. `/Allow:\s*\//i` was satisfied by the
    // substring inside `Disallow: /admin`, so this check passed against a
    // robots.txt carrying no Allow directive at all — decorative, in a suite
    // whose whole rule is that each check earns its place.
    expect(body, 'no site-wide Allow: / directive').toMatch(
      /^Allow:\s*\/\s*$/im,
    )
    expect(body, 'the site is disallowed wholesale').not.toMatch(
      /^Disallow:\s*\/\s*$/im,
    )
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
      const u = new URL(loc)
      // Exact, not `toContain`. A substring match admits a longer hostname
      // (`…vercel.app.example.com`), and — worse — it admits the doubled slash
      // that NEXT_PUBLIC_SITE_URL with a trailing slash produces, which is
      // precisely the env-var mistake this suite exists to catch.
      expect(u.origin, `${loc} is not on ${origin(baseURL)}`).toBe(
        origin(baseURL),
      )
      expect(u.pathname, `${loc} has a doubled slash`).not.toMatch(/\/\//)
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
      // maxRedirects: 0 because "resolves" has to mean "is served at the URL
      // the sitemap advertises" — a 308 to somewhere else is a defect the
      // default redirect-following would hide.
      const r = await request.get(loc, { maxRedirects: 0 })
      if (r.status() !== 200) broken.push(`${r.status()} ${loc}`)
    }
    expect(broken, broken.join('\n')).toEqual([])
  },
)

test(
  'the home page and a stage page render through the real layout, which is docs/14’s minute-zero check automated',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page).toHaveTitle(/Development Playbook/)

    await page.goto('/stages/03-architecture', { waitUntil: 'networkidle' })
    // The title template lives in the root layout, so this failing means the
    // page returned something other than a fully rendered document.
    await expect(page).toHaveTitle('03. Architecture · Development Playbook')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  },
)

test(
  'the deployed site logs no console errors, where fonts and assets come from the real network rather than a local server',
  { tag: '@smoke' },
  async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 120))
    })

    for (const path of ['/', '/stages/03-architecture']) {
      await page.goto(path, { waitUntil: 'networkidle' })
    }
    expect(errors, errors.join('\n')).toEqual([])
  },
)
