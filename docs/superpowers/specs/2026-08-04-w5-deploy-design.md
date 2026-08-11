# W-5 — Deploy: design

**Status:** approved 2026-08-04
**Milestone:** `W-5` (`docs/task.md:453`), the last open `W-` item.
**Vercel project:** `acp-development-playbook` (already created by the user).

---

## Problem

The app has never been deployed. `W-4` gated this deliberately — `docs/task.md:75` reads *"W-4
gates W-5: do not deploy without a merge gate"* — and that gate has been live and proven since
2026-07-24. Three stages are now finished, so the earlier reasoning that deploy mattered less
with one finished stage has expired.

The repository is not currently in a state where a Vercel build produces a correct public site:

- **No `engines.node`.** `reference/stack.md:19` names version drift between local, CI and the
  host as *"a recurring source of 'works locally' bugs"*, and the repo guards two of those three:
  `web/.nvmrc` covers local, and `.github/workflows/ci.yml:27` and `:49` read that same file. Vercel reads
  neither — its Node version comes from the project setting, overridden by `engines.node` in
  `package.json`. The one host that actually serves users is the one nothing pins.
- **No `metadataBase`.** `web/src/app/layout.tsx:25-31` sets `title` and `description` and stops
  there. Without a base URL, Next cannot resolve absolute URLs for canonical links or social
  cards, and warns at build time.
- **No `robots.ts` or `sitemap.ts`.** A 19-URL static site with no sitemap and no robots policy.
- **Five scaffolding assets still shipping.** `web/public/` holds `next.svg`, `vercel.svg`,
  `file.svg`, `globe.svg` and `window.svg` from `create-next-app`. Verified unreferenced: a grep
  across `web/src` and `web/e2e` returns zero hits for each.

## Goals

1. A Vercel production build that succeeds and serves the site correctly.
2. The Node version pinned where Vercel will actually read it.
3. All 19 public URLs discoverable, derived from `STAGES` rather than hand-listed.
4. The deploy recorded, including what was deliberately not done.

## Non-goals

Each considered and dropped, with the reason.

- **A Content-Security-Policy.** `layout.tsx:54` injects the theme script through
  `dangerouslySetInnerHTML` — it has to run before first paint to avoid a flash of the wrong
  theme. A real CSP therefore needs a nonce or a hash, and a wrong one ships a blank page to
  every visitor. It deserves its own change with its own verification pass, not a line smuggled
  into a deploy round.
- **Open Graph metadata and a generated OG image.** Scoped out by the user. It is a design
  surface that wants `web/DESIGN.md` judgment, not a config edit.
- **A custom domain and DNS.** Not decided yet. The design makes it a one-line change.
- **Running the audit suite against the deployed URL.** `docs/task.md:458` lists post-deployment
  verification per `docs/14`, and it is real work — the suite currently assumes a local server on
  `:3100` (`playwright.config.ts`). Retargeting it is its own slice, and it cannot be written
  until a deployment exists to point at.
- **Anything in the Vercel dashboard.** Out of reach from here; enumerated below as a handoff.

## Constraints

- **The app is not at the repository root.** `web/` holds the app; the root holds `docs/`,
  `reference/` and the eighteen stage documents. Vercel's **Root Directory must be `web`**. This
  is a project setting with no in-repo equivalent — `vercel.json` cannot express it.
- **The site is fully static.** No backend, no database, no env vars at runtime (`CLAUDE.md`).
  Any environment variable must therefore be build-time and `NEXT_PUBLIC_`-prefixed, or it will
  not exist in the shipped bundle.
- **19 URLs, not 22.** `pnpm build` reports 22 routes; that count includes Next's internals. The
  public set is `/` plus `/stages/<slug>` for the 18 entries in `STAGES`.
- **`web/pnpm-workspace.yaml`** exists solely to carry `ignoredBuiltDependencies` (`sharp`,
  `unrs-resolver`). It is not a monorepo definition and must not be treated as one.
- **jsdom's declared Node floor is `^22.22.2`** (recorded as a deferral on the TD-17 round). Any
  `engines.node` value chosen here has to stay compatible with `.nvmrc`'s floating `22` rather
  than quietly resolving that open question.

## Architecture

### `web/src/lib/site.ts` — one source for the origin

```ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acp-development-playbook.vercel.app'
```

Three files need the origin — `layout.tsx`, `sitemap.ts`, `robots.ts` — and a deploy round that
writes the same string into three files has built the drift it is supposed to prevent.

**Rejected: hard-coding the URL in each file.** Fewer moving parts, and wrong the moment a
domain arrives — the failure would be a stale canonical URL, which is silent.

**Rejected: requiring the env var with no fallback.** More correct in principle, but it makes the
first build fail unless the variable is set in the dashboard first, which converts a deploy into
a two-step dance for no benefit on a site whose URL is already known.

The fallback is the current `.vercel.app` origin. Setting `NEXT_PUBLIC_SITE_URL` in Vercel
overrides it without a code change.

### `engines.node`

`"engines": { "node": "22.x" }` in `web/package.json`. Matches `.nvmrc`'s floating `22`, so the
three environments agree, and it does not pre-empt the open jsdom-floor question.

### `robots.ts` and `sitemap.ts`

Both are Next file-convention routes under `web/src/app/`, generated at build time into the
static output. `sitemap.ts` maps `STAGES`, so the sitemap cannot fall behind the stage list.

### Deletions

`web/public/{next,vercel,file,globe,window}.svg`. Unreferenced, verified by grep before removal
rather than after.

## Testing

New tests, all data-layer under the `unit` project:

- **The sitemap covers every stage, and every stage URL in it is real.** Bidirectional, the shape
  `sketch.test.ts` and `ddl-sync.test.ts` already use: a guard that only catches drift one way is
  half a guard.
- **The sitemap includes the home page**, which is not in `STAGES` and is therefore the entry
  most likely to be forgotten.
- **`SITE_URL` is absolute and carries no trailing slash.** A trailing slash produces
  `https://host//stages/...` in every generated URL — valid, ugly, and silently wrong for
  canonicalisation.
- **`robots.ts` allows indexing and points at the sitemap.** A deploy round that ships
  `Disallow: /` is a real and quiet failure mode.
- **`public/` contains no file that nothing references.** This is what makes the deletion a rule
  rather than a one-off tidy, and it fails if a future scaffolding asset reappears.

## Verification

1. `pnpm build` — succeeds. **CORRECTED AFTER REVIEW: "no `metadataBase` warning" is not a
   signal.** Next emits that warning only from `resolveAndValidateImage`, gated on a relative
   image URL needing resolution — and Open Graph is a non-goal here, so there are no images and
   the warning cannot fire either way. A build with `metadataBase` deleted is equally quiet.
   `deploy-config.test.ts` asserts the field directly instead, and teeth-checks by deleting it.
2. `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check` — clean.
3. `pnpm test:e2e` — 14/14, with `:3100` killed first (TD-27).
4. The built output contains `sitemap.xml` and `robots.txt`, and the sitemap lists 19 URLs. Read
   the generated files rather than trusting the route handlers.
5. Every new test teeth-checked.

## Documentation updates

- `docs/task.md` — tick W-5's checklist items that this round completes; leave post-deployment
  verification open and say why.
- `docs/tracker.md` — the Completed row, with what was deferred.
- `KICKOFF.md` — the deploy state, replacing "**Not deployed** (`W-5` open)".
- `reference/stack.md` — Hosting says Vercel already; no version to add.

## Handoff — what only the user can do

1. **Set Root Directory to `web`** in the Vercel project. **The build fails without this**, and
   it is the single most likely cause of a first-deploy failure.
2. Optionally set `NEXT_PUBLIC_SITE_URL`; the fallback covers the `.vercel.app` origin.
3. Confirm the project's Node version is 22.x, or let `engines.node` drive it.
4. Push. Nothing here reaches Vercel until `main` is pushed.

## Risks

- **Root Directory unset** — the build fails with an unhelpful "no Next.js version detected".
  Named first in the handoff for that reason.
- **CORRECTED AFTER REVIEW.** This section originally named Root Directory as the single most
  likely cause of a first-deploy failure. It was not even the first: `package.json`'s
  `prepare` script ran `lefthook install`, which exits 1 outside a git repository, and Vercel's
  build environment excludes `.git`. `pnpm install` runs `prepare`, so the deploy failed at the
  install step — before Root Directory was consulted at all. Fixed with `|| true`, and guarded
  by a test. The lesson is the one this spec's own Verification section got wrong: enumerating
  deploy blockers from reading is not the same as enumerating them from running.
- **The `.vercel.app` origin is a guess.** It follows Vercel's default naming from the project
  name the user gave, but the real URL is visible only after the first deploy. If it differs, the
  fix is one env var, and the sitemap test will not catch it — no test can, since the correct
  value is external knowledge.

  **MATERIALISED 2026-08-11.** The assigned origin is `acp-dev-playbook.vercel.app`, not
  `acp-development-playbook.vercel.app` — Vercel did not derive the hostname from the project
  name the way this section assumed. `NEXT_PUBLIC_SITE_URL` corrected production before any
  user saw it, which is the mitigation working as designed; the fallback has since been set to
  the verified value. The risk was correctly identified and correctly mitigated, and the
  guess was still wrong — which is the argument for the env var having existed at all.
- **Deleting `public/` assets is irreversible in effect if something references them at runtime
  by string.** The grep covers `web/src` and `web/e2e`; a reference built by string concatenation
  would evade it. Reviewed as low: the files are `create-next-app` scaffolding and this app has
  never had a page that used them.
