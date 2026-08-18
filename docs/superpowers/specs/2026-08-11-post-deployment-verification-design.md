# Post-deployment verification — design

**Status:** approved 2026-08-11
**Closes:** the last open item under `W-5` (`docs/task.md`, "Post-deployment verification per
`docs/14`")
**Live site:** https://acp-dev-playbook.vercel.app

---

## Problem

The site went live on 2026-08-11 and nothing checks it. Every gate this repo has runs against a
build produced on the machine doing the checking: `pnpm test:e2e` starts its own server on
`:3100` (`web/playwright.config.ts`), and CI does the same on a runner. Both prove things about
*a* build. Neither proves anything about the one serving users.

That gap is not theoretical here. Two failures this week lived entirely inside it:

- `NEXT_PUBLIC_SITE_URL` exists only in Vercel. The local and CI builds use the fallback in
  `web/src/lib/site.ts`, so `robots.txt` and `sitemap.xml` are built from a *different origin*
  in CI than in production. A wrong or missing env var cannot fail any current gate.
- Three green production builds ran against the wrong repository entirely, and looked exactly
  like success in the dashboard.

`docs/14-post-deployment-verification.md` already prescribes the answer, and the playbook should
practise what it documents. Its "ten-minute check" opens with *"Load the production URL. Not the
deploy dashboard — the actual site"*, and its Automate-what-you-repeat section says the manual
list is the specification for the automated one. It even gives the invocation:

```bash
pnpm exec playwright test --grep @smoke --config=playwright.prod.ts
```

and the constraint: smoke tests against production must be **read-mostly and idempotent**.

## Goals

1. A command that checks the deployed site, runnable immediately after a promotion.
2. Every check earns its place by testing something a local or CI build structurally cannot.
3. The default `pnpm test:e2e` keeps working unchanged and never reaches for production.

## Non-goals

Each considered and dropped, with the reason.

- **Re-running the 14-test audit against production.** Overflow, contrast and panel weight are
  properties of the built HTML and CSS. The bytes CI checked are the bytes Vercel serves, so
  running them again against a remote host buys nothing and costs 36 pages × 5 widths × 2 themes
  of remote latency and flake.
- **Verifying the deployed commit.** Tempting — it would catch "the deploy did not actually
  rebuild" — but it needs a build-stamp surface in the app plus Vercel's system environment
  variables exposed, which is a new public artifact and another dashboard dependency. The
  sitemap-URLs-return-200 check covers most of the same risk for nothing. Recorded here so the
  omission is visible; revisit if a stale deploy ever actually happens.
- **Automating it in CI on push to `main`.** A push and a live deployment are not simultaneous,
  so this needs a wait-for-deployment step, which is the usual source of flake in exactly this
  kind of job. The command comes first; automating it is a follow-up once it has proved itself.
- **Sentry, error rates, latency baselines** — `docs/14` calls for all three, and this repo has
  none of them. They belong to `15 — Observability`, which is unbuilt.
- **A dedicated test account, auth flows, a money path.** The site is static, public and has no
  accounts. `docs/14`'s critical-path guidance has nothing to bite on here, and inventing one
  would be ceremony.

## Constraints

- **Read-only.** Every request is a `GET` or `HEAD`. The suite must remain safe to run against
  production at any time, by construction rather than by discipline — there is nothing to write
  to, and nothing in the suite may introduce one.
- **The default config must not pick up the smoke tests.** `playwright.config.ts` has
  `testDir: './e2e'`, so a new file there is collected automatically and would be run against
  `localhost:3100` by `pnpm test:e2e`. The `@smoke` tag is the discriminator, per `docs/14`.
- **`SITE_URL` differs between environments by design.** Local and CI resolve the fallback in
  `web/src/lib/site.ts`; production resolves `NEXT_PUBLIC_SITE_URL`. The smoke suite must assert
  against the origin it is actually pointed at, not against the imported constant, or it would
  re-create the blind spot it exists to close.
- **19 public URLs** — the index plus one per entry in `STAGES`.

## Architecture

### `web/playwright.prod.ts`

A second Playwright config, not a flag on the first. It differs in three ways that matter:

```ts
export default defineConfig({
  testDir: './e2e',
  grep: /@smoke/,
  timeout: 60_000,
  retries: 2,
  use: { baseURL: process.env.PROD_URL ?? 'https://acp-dev-playbook.vercel.app' },
})
```

- **No `webServer`.** There is nothing to start; the site is already running.
- **`grep: /@smoke/`** so it runs only the smoke file, matching `docs/14`'s own invocation.
- **`retries: 2` unconditionally**, where the local config retries only in CI. A remote host has
  network flake that a localhost server does not, and a smoke test that cries wolf gets ignored.

`PROD_URL` makes the target overridable, which is what lets the suite be teeth-checked by
pointing it at a host that is wrong.

**Rejected: one config with a `--base-url` flag.** Fewer files, but the two runs differ in more
than a URL — one starts a server and one must not — and encoding that in flags makes both harder
to read. `docs/14` prescribes a separate config, and here that is also the better design.

### `web/e2e/smoke.spec.ts`

Five tests, each tagged `@smoke` in its title. They assert against `baseURL` rather than
importing `SITE_URL`, because the point is to check the deployed origin, not to agree with the
repo's idea of it.

| Check | What only production can tell us |
|---|---|
| `robots.txt` allows indexing and names the live origin | Built from `NEXT_PUBLIC_SITE_URL`, which exists only in Vercel |
| `sitemap.xml` lists 19 URLs, all on the live origin | Same, and the count catches a stage lost in the build |
| Every sitemap URL returns 200 | A sitemap that lies is a real defect; this asks the edge, not the route handler |
| The home page and a stage page render, title template applied | `docs/14`'s minute 0–1, automated |
| Zero console errors across those pages | Real fonts, real CDN, real edge — not a localhost server |

### `package.json`

```json
"test:prod": "playwright test --config=playwright.prod.ts"
```

### The default config

Gains `grepInvert: /@smoke/`, so `pnpm test:e2e` continues to run exactly the 14 tests it runs
today and never attempts production.

## Testing

The suite *is* the test, so the question is whether each check can fail. Each gets a teeth check
run against a deliberately wrong target or a deliberately wrong expectation:

- Point `PROD_URL` at the old wrong hostname (`acp-development-playbook.vercel.app`, which 404s)
  and confirm the suite **fails** rather than skipping or erroring ambiguously.
- Assert 20 sitemap entries instead of 19 and confirm that test alone fails.
- Point the origin assertion at a different host and confirm it fails.

The third is the important one: it proves the suite is checking the *deployed* origin rather than
quietly agreeing with a constant imported from the repo.

## Verification

1. `pnpm test:prod` against the live site — all five pass.
2. `pnpm test:e2e` — still exactly 14 tests, unchanged, no attempt to reach production.
3. `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test` — clean.
4. Teeth checks above, each executed with output recorded.

## Documentation updates

- `docs/task.md` — tick W-5's last checklist item.
- `docs/tracker.md` — a Completed row, with the deferred commit-stamp and CI automation.
- `CLAUDE.md` — `pnpm test:prod` in the commands block.
- `KICKOFF.md` — the command exists and what it covers.

## Risks

- **A red smoke run means "production is wrong", which is a heavier claim than a red unit test.**
  If it fails for an infrastructure reason — the host is briefly unreachable, a DNS blip — that
  is a false alarm, and false alarms are how a gate gets ignored. `retries: 2` is the mitigation;
  if flake persists, the answer is to narrow what is asserted, not to lower the bar.
- **It tests the site, not this checkout.** A green run says nothing about the working tree, and
  a red one may be nothing to do with local changes. Worth stating in the docs so nobody reads
  `test:prod` as part of the pre-merge gate.
- **The fallback origin is duplicated** — `playwright.prod.ts` hard-codes the same host as
  `site.ts`. That is a second copy of the value this repo just finished consolidating. Accepted
  because a Playwright config cannot import from `src/` without pulling the app's module
  resolution into the test runner, and `PROD_URL` overrides it either way — but it is a real
  seam, and if the domain changes both must move.
