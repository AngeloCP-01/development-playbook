# Tracker archive

Closed technical debt and completed rows older than the current round, moved here
verbatim from `docs/tracker.md` (D-96). IDs are never renumbered, so a citation such as
`TD-44` or `D-22` in a spec, a plan or a code comment resolves to exactly one file —
`web/src/lib/tracker-ledger.test.ts` enforces that. Decisions do not move: the live
tracker keeps the whole decisions ledger, superseded entries included.

Grep this file by ID. Do not read it whole; it exists so that nobody has to.

## Completed (archived)

Rows dated 2026-09-07 or earlier. Same columns as the live table.

| Date | ID | What shipped | Evidence | Deferred |
|---|---|---|---|---|
| 2026-07-21 | P-0 | README index, `reference/stack.md`, `reference/glossary.md` | 17 terms; versions checked against `npm view` that day | Search; per-stage frontmatter |
| 2026-07-21 | P-1 | Stages 04, 11, 12, 13, 14 | Template held under real config content — the reason this group went first | — |
| 2026-07-21 | P-2 | Stages 05, 06, 07, 09, 10 | — | — |
| 2026-07-21 | P-3 | Stages 01, 02, 03, 08 | — | — |
| 2026-07-21 | P-4 | Stages 15, 16, 17, 18 | 18/18 pass the seven-section template check; 124/124 internal links resolve | — |
| 2026-07-21 | W-0 | Next 16 scaffold, sidebar, 18 static stage routes | `pnpm build` prerenders 22 routes | Tests, CI, deploy (W-4/W-5) |
| 2026-07-21 | W-1 | Design system: whiteprint/cyanotype, Archivo/Newsreader/JetBrains Mono | Contrast audited across every distinct text/background pair, both themes | Print stylesheet; motion beyond the hero rule |
| 2026-07-21 | P-7 | `KICKOFF.md`, `web/DESIGN.md`, `docs/superpowers/{specs,plans}/`, `docs/learnings/` | Design tokens in DESIGN.md verified against `globals.css`; `218815a` | Per-round kickoff siblings |
| 2026-07-21 | W-2 | Stage 01: 6-step stepper, 9 numbered figures, 5 exercises, worksheet, 10 terms defined (5 used inline so far) | AA in both themes with all term panels expanded; 320–2560px clean; no console errors; `edb315b` | Stages 02–18; committed test suite |
| 2026-07-24 | W-2+ | Stage 01 references section: 5 curated outward links with what-it-adds notes; reusable `References` component | 3 invariants (cap 3–5, https + non-empty fields, unique urls) teeth-checked; all 5 urls verified live in a browser | References for stages 02–18 |
| 2026-07-23 | W-2+ | Stage 01 polish: three sentences humanized; index reworked to full-width per-group sections | Copy pass `11ce4f2`; index `e87286d`→`fd112c9`, no overflow 320–2560px | Broader humanizer sweep of the docs |
| 2026-07-23 | W-4 | Quality gates: prettier + eslint-config-prettier, 13 vitest invariants, 9-test playwright audit suite, lefthook hooks, 2-job CI | Teeth: slug corruption failed exactly 4 tests; --faint regression failed contrast with named pairs; a bad commit was rejected on the third probe after two real gate weaknesses were found and fixed. Final whole-branch review: Ready to merge, 0 blocking, 2 minors (prepare-in-CI noise; audit PAGES hard-codes step hashes) | Component/E2E behaviour tests (arrive with W-3); visual regression; branch protection (GitHub-side, after push) |
| 2026-07-23 | P-5 | Stack drift resolved: ESLint kept, Prettier added, Biome demoted to documented alternative; docs 04/stack.md/CLAUDE/KICKOFF amended | Every biome reference in doc 04 sections 3/6/7 replaced; `web/` and docs now agree | — |
| 2026-07-23 | — | First learning guide: `docs/learnings/stage-implementation-101.md` | Every claim drawn from a real bug this session | More guides as rounds teach them |
| 2026-07-23 | P-8 | Working standards documented: git + delivery-loop + review + TDD conventions, skills-as-process, humanizer pass, `web/PATTERNS.md` | Every convention verified against `SmartJobSearchCRM` git or the code; `218815a`, `5082e43`, `17b344e`, `a5901af` | Folding the same into the stage docs (P-6) |
| 2026-07-30 | W-3.1b | Stage 03 **standard-practice completeness**: 902 → **1,281 lines**, 13 → **14 subsections**, glossary 56 → **72 terms**. Closes **TD-25**'s doc half — resilience patterns (timeout · backoff+jitter · circuit breaker · degradation), consistency and concurrency (isolation levels · optimistic and pessimistic locking · CAP · eventual consistency), a new "Evolve the schema safely" section (expand-contract · strangler fig), statelessness and scaling (+ the serverless/Postgres pooling edge), and fitness functions. The **trace table went 3 rows → 10 of 10 candidates**, which was the round's actual deliverable — it could not be widened until the material existed | 9 commits `1db6344`…`3cd19c4`. **Third cold-reader run**, same product as runs 1 and 2: 2 clusters ACTIONABLE first pass, 3 PARTIAL and fixed, verdict PARTIALLY and "more than the last run". **G5 CLOSED** ("a clean close"). It also found a **security defect open across all three runs** — G3's edge, where "one pattern per entity" followed literally produces cross-team privilege escalation — plus **three contradictions this round introduced**, including two trace rows the worked DDL did not satisfy, and **three valid over-reach findings**, chiefly expand-contract stated unconditionally to a pre-launch solo reader. D-48 applied to the fix wave caught a dangling `full_name` column referenced once with nothing introducing it — the same class as last round's `REFERENCES teams(id)`. 136/136 across 11 files, lint and typecheck clean, **38/38 links resolving**, structure test teeth-checked on misplacement. Humanizer needed **no changes** (0 AI-vocab hits; em-dash density 0.096 against 02-planning's 0.124) | **The app port** — blocked on `feat/stage-03-app-port`; G1's property-vs-entity test; G6's general soft-delete mechanic; the auth box missing from the container diagram; outbox cadence's seam with stage 11 — all in `docs/verification/cold-reader-stage-03-run3.md` |
| 2026-07-29 | W-3.1 | Stage 03's **doc round**: `docs/03-architecture.md` 8 subsections → **13**, 300 → **902 lines**, running requirements → HLD → LLD. Closes **TD-22** (no high-level design: adds architecture characteristics with a trace-forward table, a system sketch with C4 and three views, database design past the DDL, API contract design), **TD-21** (styles landscape: monolith · modular monolith · microservices · serverless, plus bounded context and ubiquitous language — the stage had been teaching the modular monolith unnamed), and **TD-18** (14 cold-reader gaps). The TD-22 inversion was fixed by *splitting* "Model the domain first" — conceptual model stays, the `CREATE TABLE` moves below the sketch that justifies it | 14 commits `4afaec4`…`2e4162c`, the last three from the whole-branch review. **Cold-reader re-run** under identical constraints and the same shift-swap product as the baseline: **9 CLOSED · 3 PARTIAL · G9 correctly deferred · G5 thin**, 13 of 17 DoD boxes tickable on a first read against a previously unsatisfiable exit condition. It also found **five gaps this round introduced** — the headline being that the stage cites the shift-swap product three times and showed zero DDL for roles or tenancy, and that idempotency was a DoD gate taught nowhere — all fixed in `7a5108f`. Glossary 42 → 56 terms. **136/136 across 11 files** from a cleaned `.next`, lint and typecheck clean, **16/16 internal links verified resolving** by script. Two new tests, both teeth-checked: `stage-03-structure.test.ts` pins the thirteen headings in order, and `source-citations.test.ts` bans line-number citations outright and resolves every heading citation against the doc it names — closing D-42's own recorded follow-up | **The app port (W-3.2 / TD-23)** — the larger half, taken deliberately (D-46); **G9** still stage 10's (D-39); G1's strike test, G8's wall-clock/DST case, G5's isolation level, G6's soft-delete mechanic, and the characteristics trace table's three rows against ten candidates — all recorded in `docs/verification/cold-reader-stage-03-run2.md`, none silently dropped |
| 2026-07-28 | W-3 (03) | Stage 03 **Architecture** interactive: six steps (reverse · model · constrain · shape · decide · AI plays), nine figures, four judgment exercises, an annotated-DDL inspector, a domain worksheet carrying stage 02's answers forward, 7 new terms, 4 references. `docs/03-architecture.md` gained the `### AI in architecture` section it never had | 24 commits `21f555b`…`9758cef`. Gate from a deleted `.next`: lint 0 warnings, typecheck clean, **133/133 unit across 9 files**, **22 routes prerendered**, **10/10 e2e over 20 URLs**. Review caught two blocking defects: (1) `DomainSketch` rendered the status enum as `draft \| sent \| paid`, which **pre-answered the interrogation exercise rendered in the same stepper panel** — the doc's arc is naive sketch → interrogate → schema drops it, so `overdue` was restored (`83b6cba`); (2) `BoundaryMap`'s `EDGE_NAME` hardcoded "allowed"/"not allowed" into each accessible name while only the visible badge derived from `edge.legal`, so flipping the data would have told a sighted reader and a screen-reader user opposite things with nothing failing — the suffix now derives from the data, teeth-checked by flipping `legal` and proving the name followed (`7893272`). Two reviewers reproduced measurements independently rather than accepting reports: the 320px overflow numbers (page 305/305, container 621/213) and the reassembled DDL executed against a real PostgreSQL 17 instance | **TD-18** (14 cold-reader doc gaps, 3 blocking) — recorded, not fixed; TD-11 and TD-14 stay open; **TD-16** (placeholder contrast) and **TD-17** (no component-test harness) opened; no ADR worksheet (D-39); no schema validation — the worksheet records, it does not grade; no component-test harness — vitest is `environment: 'node'` and matches only `*.test.ts` |
| 2026-07-28 | W-3 (02) | Stage 02 **declared complete** for its scope, after an audience-readiness check | Two cold-reader persona tests (PM, solutions architect) reading only the doc: PM = primer not a tool (5 blocking-for-PM gaps, all scope-boundary), SA = feeder that defers architecture to stage 03 (6 gaps, all stage-03 content). Developer-completeness already confirmed by the earlier cold reader. Scope confirmed (D-37); method written up in `docs/learnings/cold-reader-testing.md` | PM support (whole-playbook scope expansion); SA support (build stage 03) |
| 2026-07-28 | — | Build: Prettier no longer checks markdown (`*.md` in `web/.prettierignore`); pre-commit format glob reverted to code extensions | Fixed a CI `format:check` failure on `web/PATTERNS.md` at the source. Markdown is documentation, not code, and the generated `reference/glossary.md` must not be reformatted out of sync with `renderGlossary()`. Teeth-checked: a bad-emphasis `.md` no longer trips the gate | — |
| 2026-07-27 | W-3 (02+) | Stage 02 "AI plays" section: a 7th step + `### AI in planning` doc subsection, mirroring stage 01. Six plays (exhaust, red-team MVP, spike, draft plan, value-vs-effort sort, memory), copyable prompts, opening on planning's inflate-don't-cut failure mode. Names real tools: Superpowers writing-plans/dispatching, claude-mem, context7, Vercel Sandbox; find-skills → deanpeters/product-manager-skills, phuryn/pm-skills as the ecosystem pointer | 57/57; audit 9-of-9 on a production build now sweeping `#ai` (contrast both themes, no overflow, zero console); live pass: 6 plays + 4 badges render, accordion single-open, copy present, `<pre>` scrolls internally; `47c6a64`…`a15d648` | Stage 01's doc still lacks AI content (TD-15); no copyable prompts in the doc (web-stage's job) |
| 2026-07-27 | W-3 (02+) | Stage 02 beginner-completeness fixes: cut-to-core reframed to "does the outcome fail" (was contradicting its own MVP warning); Risk vs Open-question defined + example de-duplicated; entry criteria made to point at stage 01 explicitly; Next-list ordering given a method (value-vs-effort, reusing S/M/L), 5th reference added. Doc + app kept in sync | A cold-reader agent (only the doc, own PM knowledge forbidden) planned a *different* product, stalled at 4 points; all 4 ruled FIXED on a re-run of the same test. lint/typecheck/57 tests/build/audit 9-of-9 clean; `6b8dbe0` | The stage-01-dependency in entry criteria (by design, not a bug); deeper prioritization frameworks (linked, not taught) |
| 2026-07-24 | W-3 (02) | Stage 02 **Product Planning**: doc reframed + retitled, six-step stepper, nine figures, five exercises, plan worksheet with 01→02 carry-forward, 7 terms, 4 references. `docs/02-planning.md` amended (MVP/roadmap/appetite/feasibility-risk named; now/next/later horizon added — "vision" was absent from all 18 docs) | 56 vitest (31 new); 9/9 audit suite on a production build (overflow 320–2560, touch ≥44px, WCAG AA both themes, zero console); full 01→02 chain verified live (seed fills + disables, reader's Not-in-v1 → horizon triage); every component reviewed clean by a fresh subagent; `2bd421b`…`1d7f327` | TD-2/TD-3 (due before 03); stage 01 team-section retrofit; deploy (W-5); edits to `docs/03` |
| 2026-08-03 | W-3.2 | Stage 03's **app port**, closing TD-23's content gap and TD-25's app half. `web/src/features/architecture/` went from the **six** steps `W-3` shipped — `W-3.1` was doc-only (D-46) and left the app untouched — to **22**, mirroring all 14 doc subsections across **24** numbered figures. Ships **D-52** in place of D-38 (struck through, not edited): a step holds one judgment and its panel stays under four screens at 1024×768, enforced by `web/e2e/audit.spec.ts` rather than recorded, with `PANEL_EXCEPTIONS` back down to its two permanent baselines (`01#record` 6.7, `02#horizon` 5.6) | **90 commits** counted against the tree as this record landed, `c1a03b4`…`c080be1`; the branch finished at 106 and merged as `790b3e4`. **286/286** vitest across **24** files; **14/14** playwright audit over **36** URLs, including the panel-weight test — no panel over threshold. Lint, typecheck and `format:check` clean. Four per-task reviewer subagents (tasks 5–9 and 11) returned **fourteen blocking findings**, all verified real, including two factual errors about Postgres in teaching material — a `FOR UPDATE` described doing what `SKIP LOCKED` does (`4bc60aa`), and an overclaim that transaction-mode pooling breaks a transactional lock (`687a042`).  **Then the whole-branch review**, whose three headline findings no per-task review could have seen: the contrast gate (below), the `access` step teaching the singular authorization framing 100px above the exercise that corrects it (`97554b7`), and the *doc* still describing transaction pooling incorrectly after the app had been fixed, so the merge would have shipped a source of truth less accurate than its port (`70ddefe`). Fixed one commit per finding, `57a44d9`…`c080be1`, then `2734fb4`. **Scoped re-review: all nine addressed, 0 open, ready to merge** — it reproduced every measurement from an independent harness and teeth-checked with different injections than the fix used. Task 11's review caught a third: a trace row that named a timeout "graceful degradation", contradicting the definition the stage's own resilience step gives (`dcfe1ae`). The **whole-branch review then produced seven blocking findings of its own**, so the defect rate did not fall off: the last task reviewed produced three and the whole-branch pass produced seven. Its headline was that the branch's own verification claim was hollow — the contrast and touch-target gates walked the step rail instead of the panel and opened five expandables across 36 pages, so every page was checked on its stage's last step with nothing revealed (`e058333`; corrected, 108 expandables and 867 colour pairs against 717, zero failures in either theme) | Sixteen minors from the whole-branch review, deferred with the reviewer's provenance rather than fixed. **TD-26** carries the three further ways the audit can be green about a surface it never evaluates, all found while fixing the first. Also open: a `RevealList` component to de-duplicate five accordions sharing one markup; the step rail's own fit past ~12 entries at 1440px, which is the half of D-38 that D-52 dropped without saying so; and nine glossary terms defined and never wrapped, because the names live in data strings where JSX cannot go — a pattern decision, not a patch |
| 2026-08-03 | W-3.3 | Stage 03's **eight recorded doc gaps**, cold-reader **run 4**, and the whole-branch **re-review**. The gaps were the residue of three rounds: normal forms named and never defined, soft delete shown as one mechanic with no choice posed, the filter half of soft delete missing entirely, the tenancy tables, the partial unique index that is the only way to express "at most one approved claim per shift", the third-party-call cadence, the pull-import contract row, and the container diagram's auth box. Doc **1,346 → 1,507 lines**, app 22 steps unchanged — every gap landed inside an existing panel under D-52's four-screen rule, three of them behind expand-to-reveal (D-49) | 15 commits `c080be1`…`5afbe09`. **Cold-reader run 4: COMPLETE**, 4 stalls / 8 guesses, against run 3's "PARTIALLY" — `docs/verification/cold-reader-stage-03-run4.md`. Its fix wave got a **D-48 verification pass on a live Postgres 17 cluster**, which confirmed the partial-index and soft-delete claims. The **whole-branch re-review then found five Important**: the headline (**I1**) was a backfill instruction telling the reader to paginate a `WHERE col IS NULL` loop by remembering the highest id touched — the guard shrinks the candidate set every pass, so a keyset cursor skips exactly the rows the previous pass rewrote. Proved by running it: **5000 of 5000 rows silently unmigrated**, reported as success; the corrected instruction reports zero after six iterations. **I4** was three separate sentences hand-counting "six boxes" against a diagram of eight, one of them calling all six "not yours" in the same breath as explaining that one is skipped *because* it is yours. All five plus six minors fixed in `5afbe09`; **313/313** vitest across **26** files, **14/14** audit over 36 URLs, lint and typecheck clean, every new test teeth-checked by breaking its claim and confirming only that test fails | **M5** — 2NF is unviolatable under the `uuid` primary keys every DDL in this stage uses, so the worked 2NF example keys on `(invoice_id, line_no)` and nothing else does. Run 4 filed the same thing under "genuinely unusable". Fixing it means either changing the example's key or teaching why surrogate keys make 2NF vacuous, and both are content decisions, not patches. **M6** — the archive table's "when volume is the problem" gives no threshold. Also still open: the sixteen minors from the previous whole-branch review; **TD-26** (the audit green about surfaces it never evaluates) and **TD-27** (the second `test:e2e` of a session measures a stale build), both opened during this round |
| 2026-08-04 | — | **Component test harness (TD-17).** `vitest.config.ts` split into two projects — `unit` (node, `*.test.ts`) and `dom` (jsdom, `*.test.tsx`) — so the extension picks the environment rather than a per-file docblock somebody has to remember; `extends: true` is what carries the `@/*` alias into both. Three dev dependencies (`jsdom`, `@testing-library/react`, `@testing-library/dom`); `jest-dom` and `@vitejs/plugin-react` deliberately not added. A written convention in `web/PATTERNS.md` and `CLAUDE.md` says which components get one | 4 commits `83ed997`…`3d5b147`, merged as `99f60cd`. **320 tests across 29 files** (was 313/26), lint, typecheck and `format:check` clean, `pnpm gen:glossary` re-run with `reference/glossary.md` byte-identical, e2e still 14/14. Both render tests **teeth-checked by injecting the defect they exist to catch** — gating the interrogation's reasoning on `correct`, and making `fieldName` return its argument unchanged — each failing alone out of the full suite and reverted. RED for the harness itself was real: the `.tsx` file matched no `include` glob until the config changed. **A whole-branch review then found the harness's first real customer on the same branch**: `ModelInterrogation` told readers “Five questions” while rendering six, having gained one when the doc did — a data test asserts the length and is perfectly happy, and the audit suite never reads the sentence. Fixed test-first. The review also raised two blocking record defects (the tracker header contradicting the row below it; three dependencies landing with no `reference/stack.md` entry) and eight minors, all closed here except two recorded deferrals | No backfill across stage 03's remaining components; the three Playwright stand-ins in `audit.spec.ts` stay, since deleting a real-browser check on the strength of an hour-old jsdom one has no evidence behind it. `matchMedia` is still unstubbed — jsdom does not implement it, and the first component that needs one adds it to `src/test/setup.ts`. **Two findings deferred rather than fixed:** `jsdom@30` declares `engines: node ^22.22.2`, and this machine runs 22.19.0 while `.nvmrc` pins the floating major `22` — nothing enforces it and all 320 tests pass, but the repo now carries a dependency whose floor its own dev Node misses, and bumping `.nvmrc` changes an environment rather than a file, so it is the user's call. And the six render-testable components stage 03 already ships are still uncovered — the backfill non-goal stands |
| 2026-08-04 | W-5 (repo side) | **Deploy preparation.** `engines.node` pins the version Vercel actually reads — `.nvmrc` reaches local and CI only, so the one host that serves users was unpinned. One `SITE_URL` feeds `metadataBase`, `sitemap.ts` and `robots.ts`, because a deploy round that writes an origin into three files has built the drift it exists to prevent. Sitemap derives its 19 URLs from `STAGES`. Five `create-next-app` SVGs deleted from `public/`, unreferenced since W-0 — the directory itself is now gone | 3 commits `b9088c4`…`d15c1dd`. **331 tests across 33 files**, lint, typecheck, `format:check` clean, `pnpm build` with **no `metadataBase` warning** and `/robots.txt` + `/sitemap.xml` in the route table. Generated output read rather than inferred: `.next/server/app/sitemap.xml.body` carries exactly **19** `<loc>` entries, `robots.txt.body` reads `Allow: /` and names the sitemap. **audit 14/14** against a fresh build with `:3100` killed first (TD-27). Nine teeth checks in total, each failing alone — a trailing slash on the origin, a stage dropped from the sitemap, `Disallow: /` in both its string and array spellings, a probe file in `public/`, a `favicon.ico` in `public/`, an unguarded `prepare`, a wrong `engines.node`, and `metadataBase` deleted | **Deployed 2026-08-11** at `https://acp-dev-playbook.vercel.app` — see the W-5 (live) row above for what the deploy itself cost. Root Directory `web` was the blocker this round predicted. **A whole-branch review found the round had missed an earlier blocker entirely**: `prepare: lefthook install` exits 1 without a `.git`, Vercel's build environment has none, and pnpm runs `prepare` on every install — so the deploy would have failed at the install step, before Root Directory mattered. Fixed with `|| true` and guarded. The same review found the recorded `metadataBase` evidence vacuous: the build warning it cited fires only for relative Open Graph images, which this app deliberately has none of, so it could not fail either way. **No CSP**: the theme script runs via `dangerouslySetInnerHTML` before first paint, so a policy needs a nonce or hash and a wrong one ships a blank page — its own change, with its own verification. **No Open Graph or OG image**, scoped out. **No post-deployment verification**: the audit suite assumes `:3100` and cannot be retargeted until a deployment exists |
| 2026-08-11 | W-5 (live) | **Deployed.** `https://acp-dev-playbook.vercel.app`. The repo side was done on 2026-08-04; getting a live site took three dashboard problems the repository could not express and this round did not predict — the project was connected to a placeholder repository, its Framework Preset was *Other*, and Root Directory was unset | Verified against the running site rather than the dashboard: `/robots.txt` returns `Allow: /` and names the sitemap; `/sitemap.xml` carries **19** `<loc>` entries on the real origin; `/stages/03-architecture` renders with the `%s · Development Playbook` title template applied. CI green on `main`. **The guessed origin was wrong** — `acp-dev-playbook`, not `acp-development-playbook` — which `NEXT_PUBLIC_SITE_URL` corrected in production before it reached anyone; the fallback in `site.ts` is now the verified value | **Post-deployment verification per `docs/14` still open**, and now unblocked for the first time: the audit suite assumes a local server on `:3100`, so pointing it at a deployed URL is its own slice. No CSP, no Open Graph, no custom domain |
| 2026-08-11 | — | **TD-16 closed: worksheet placeholders reach AA, and the audit can see them.** The `/70` opacity dropped from all three worksheets — `--faint` was already tuned to 4.80:1 light / 7.93:1 dark, and the call site was discarding it. The audit's colour handling switched from parsing to **rasterising**, which fixes two blind spots at once: `oklab()` values were being skipped rather than checked (Tailwind emits oklab for every alpha modifier), and placeholders were never sampled at all because the sweep keyed off `el.textContent` and an empty field has none | The suite now reproduces the hand-measured numbers independently — **2.77:1 light, 4.44:1 dark** on all three worksheets — and nothing else fails on 36 pages in either theme. RED before the fix, GREEN after, teeth-checked by restoring `/70` on one worksheet and confirming only that page failed. 331/331 unit, 14/14 audit, lint, typecheck, format clean | Alpha-colour *backgrounds* are still resolved by the old parser, so an `oklab()` background still walks up to an opaque ancestor rather than being composited. No failure depends on it today; recorded rather than fixed. `docs/14` post-deployment verification still open |
| 2026-08-11 | W-5 (verify) | **Post-deployment verification**, closing W-5's last open item. `pnpm test:prod` and `playwright.prod.ts` — no `webServer`, remote `baseURL`, `@smoke` tag, `retries: 2` because a remote host flakes where a localhost server does not. Five checks, each chosen by one rule: it must test something a local or CI build structurally cannot. That excluded contrast, overflow and panel weight, since the bytes CI checked are the bytes Vercel serves | 4 commits `5e348ca`…`c231501`, merged as `a977e17`. **5 passed** against the live site; **331/331 unit across 33 files**, lint, typecheck and `format:check` clean; `pnpm test:e2e` still **14 passed** and never reaches production, via `grepInvert` — which was verified by running it, since whether `grepInvert` matches the `tag` option rather than only the title was the one thing the plan could not settle by reading. Every check teeth-checked: `PROD_URL` at the old wrong hostname, an asserted origin of `example.com`, a 20-entry sitemap, an inverted status condition proving all 19 requests happen, a wrong stage title, and an injected `console.error` | **Not automated in CI** — a push to `main` and a live deployment are not simultaneous, so it needs a wait-for-deployment step, which is the usual source of flake. **No deployed-commit check**: it needs a build-stamp surface and Vercel's system env vars exposed, and the sitemap-resolves check covers most of the risk for free. **No Sentry, error rates or latency baselines** — `docs/14` asks for all three and they belong to `15 — Observability`, which is unbuilt. **The origin is now in two files** (`site.ts` and `playwright.prod.ts`); a Playwright config cannot import from `src/`, and `PROD_URL` overrides it, but if the domain changes both move. **A stage title is hard-coded** in the render check while titles are single-sourced in `stages.ts` (D-36) — accepted rather than fixed, because `audit.spec.ts` imports nothing from `src/` either and the no-import rule was written for `SITE_URL`, which varies by environment as a title does not | **A whole-branch review found one of the five checks decorative.** `/Allow:\s*\//i` was unanchored, so `Disallow: /admin` contains `allow: /` and the check passed against a `robots.txt` with no `Allow` directive at all — in a suite whose entire rule is that each check earns its place, and the missing teeth check is why it survived. Both robots assertions are now anchored, and the origin assertion moved off `toContain`, which admitted a longer hostname and, worse, the doubled slash a trailing-slash env var produces. Both closed with controlled-origin teeth checks serving deliberately wrong artefacts |
| 2026-08-13 | W-3 (04 doc) | **Stage 04's doc-correction phase.** `docs/04-project-setup.md` 323 → **711 lines at `38765e7`**, and **TD-28 closed as a subset of itself**: it named four defects, all in §8, and the round closed **31** across every numbered section, plus `## Artifacts` and `## Definition of done`. Three instruments ran in sequence and each found what the one before it structurally could not — reading the doc (8), executing every runnable block in a scratch directory (5 more), and a cold reader handed the corrected doc and a task to finish (14 more, 10 boundaries classified out and untouched); per-task reviews found the last four. `reference/stack.md`'s Node row now names the file each environment reads instead of the environment, which is the generalisation the whole defect rests on. `### AI in project setup` exists, so `stage-metadata.test.ts` covers 04. **The port has not happened**: `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT` | **37 commits `859a1b8`…`1418c77`**, 9 files, +3307/−40, counted against the tree as this record was written, so the range ends where the work ended and excludes the record commits that carry it — `git rev-list --count develop..HEAD` is the branch total, and it moves every time this row is edited. **332/332 vitest across 33 files** (331/33 before; the +1 is `AI_SECTION_STAGES` gaining `04-project-setup`), lint clean at `--max-warnings 0`, typecheck clean after typegen, `pnpm gen:glossary` re-run with `reference/glossary.md` byte-identical, and a fixed-string grep for the old *matches .nvmrc* sentence returning nothing doc-wide. **`format:check` passes and is not evidence about any prose here**: `web/.prettierignore` excludes `*.md` and prettier reports success on an empty match set, confirmed by feeding it a deliberately malformed markdown file and watching it pass, so on this branch it covers exactly one `.ts` file. **Task 1 ran the doc rather than reading it** — `docs/verification/stage-04-doc-execution.md`, 15 rows scored `6 CURRENT · 2 STALE · 3 WRONG · 4 not executed`, the score extracted by a pasted re-runnable command and recounted independently by the controller on a different `awk` field. Raw exit codes: an impossible `engines` range gives `WARN Unsupported engine` and **exit 0**, so "makes pnpm refuse to install" was never true without the `engine-strict=true` the doc never sets; `lefthook run pre-push` **exit 1** with two `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL … not found`, because stage 04 wires a gate onto scripts it never creates; the `prepare` guard reproduced at **exit 1 / exit 1 / exit 0** across a bare invocation, `CI=1 VERCEL=1`, and the `\|\| true` form. **Task 3's teeth check ran three times with no invented test file in the scaffold for any of them:** BEFORE exit 1 (`not found` ×2) → INTERMEDIATE exit 1 (`No test files found, exiting with code 1`, the same defect one link further down the chain) → AFTER **exit 0** with zero test files. **Task 4 proved the `engines` format instead of adopting it**: `22.x` with Node v22.19.0 → exit 0, `23.x` with the same Node → `ERR_PNPM_UNSUPPORTED_ENGINE`, exit 1, so the local guard survives the change to Vercel's documented form. **Task 6 had a real RED** — `AssertionError: 04-project-setup has no "### AI in ..." subsection`, `1 failed \| 21 passed` with the title-sync test still green, teeth-checked by renaming the heading to `### AI for project setup` (one failure, same assertion) and reverting to `22 passed`. **Cold-reader run 1 ran before the port** (`docs/verification/cold-reader-stage-04-run1.md`): completeness `3 BLOCKING · 20 NON-BLOCKING · 8 BOUNDARY`, reclassified to **14 defects, 10 boundaries, 12 prioritised entries**, four of the nine drops disproven by this branch's own execution file; consultability **3/5** against stage 03's 4/5, and its MISS was verified as **this round's own doing** via `git show develop:` rather than assumed. Its review found a dropped row **by arithmetic** — 11 claimed entries against 10 actual — which no amount of re-reading a 218-line record produces. **All twelve entries closed**, three not as specified: entry 4 refused to add `.next/` to `.prettierignore` because Prettier reads `.gitignore` too and the instruction would have taught something false; entry 10 closed by verification with no edit; entry 11's cited source was checked and does not contain the material (`grep` for rollback, roll back, promote and previous deployment across `deploying-101.md`'s 139 lines returns nothing), so §10 now points at `docs/13-production-deployment.md`. **The fix wave executed rather than reasoned.** `SESSION_SECRET` blanked → HTTP 500 carrying the Zod `too_small` thrown from `env.ts` at module evaluation, restored → 200. A `'use client'` component importing `env` **builds clean, serves correct HTML, and dies in the browser** on a three-issue `ZodError`, with the secret's value in none of the 10 client chunks — so the cold reader's "secret leak" premise is wrong and the real cost is that every gate this stage wires stays green. With §6's globs as printed, `lefthook` reported `format (skip) no files for inspection`, exited green, and left three files `prettier --check .` then rejected; widened, all three were rewritten and re-staged at exit 0. **The `engines.node` overrides-the-dashboard claim rests on Vercel's own documentation, and this row had the ranking backwards until the whole-branch review** — it read "evidenced from W-5… corroborated against Vercel's own documentation", and the reverse is true. `docs/superpowers/specs/2026-08-04-w5-deploy-design.md:21` *asserts* the override in prose, `docs/learnings/deploying-101.md` asserts it again, and neither records a deploy where the dashboard held one major and `engines.node` won, so W-5 corroborates. The primary source is https://vercel.com/docs/functions/runtimes/node-js/node-js-versions, which defines `engines#node` as the way "to override the one you have selected in the Project Settings" and states the case outright: Project Settings on **20.x** with `24.x` in `package.json` deploys **24.x**. This branch's own execution file evidences none of it — `stage-04-doc-execution.md` §8 is marked *not executed*, there being no Vercel account on this machine — and citing it would have recorded a check that never ran as evidence, which is the exact failure this round spent itself finding. **The round reversed itself once, on the record**: entry 12 escalated N2 to live (pnpm 11 shipped mid-round, so `corepack use pnpm@latest` writes `pnpm@11.21.0` against `stack.md`'s `10.x`) and pinned `corepack use pnpm@10`; the whole-branch review reversed both, because `stack.md` calls its versions "floors, not pins" and calls a version number in a stage doc a bug in the stage doc, so `@latest` was compliant and the pin was the deviation. `@latest` restored, and the sentence above it — which had promised something the command never did — is what was actually wrong. **Whole-branch review of the fix wave: eight findings** (3 Important, 5 Minor, 2 record-only), all addressed in 6 commits `b77a21e`…`1418c77`, two sources re-fetched rather than taken on trust and the review right both times. **A second whole-branch review, over the finished branch, returned seven more** (4 blocking, 3 recommended) and made the same observation each time: not one is a defect in what the branch *asserts*, since every claim checked out, but a consequence of the branch's own corrections that nothing on the branch followed through on. All seven closed in 7 commits `d056b9e`…`4cca648`, report at `.superpowers/sdd/2026-08-12-stage-04-doc-corrections/final-fix-report.md`. Its two mechanical checks both held: `git cat-file -t 79ef7a7` still answers `Not a valid object name` (exit 128), and the GitHub API still returns `v7.0.1` / `v6.0.10` / `v7.0.0` for the three actions §7 pins | **The port itself.** `04-project-setup` stays `ready: false`; `RevealList` is not extracted; W-3 is not advanced. **TD-27** (stale e2e server) and **TD-12** (hand-written audit `PAGES`) were declined as non-goals up front and are still open. **TD-29** and **TD-30** were opened during the fix wave rather than closed — the Vercel rollback commands now live in two stage docs, and §5 still installs Vitest under an environment-variables heading, which needs a new numbered section. **`docs/11-ci-cd.md` was not edited and now disagrees with §7**, which pins the three actions at v7/v6/v7 while 11 still pins all three at `@v4` and sends its reader nowhere useful — §7's own opening line links there. Editing 11 was a non-goal at spec time and stayed one; the divergence is **TD-31**, opened by the whole-branch review, which found it on no deferred list at all. An unnoticed deferral is not a deliberate one, and this list only means anything if the difference is kept. **The ten boundary items stand untouched**: the completeness run's eight (test content → 06, `--passWithNoTests` removal → 06, full CI/CD → 11, documentation depth → 10, observability past first-pass error tracking → 15, repo naming → 01, structural decisions → 03, CODEOWNERS and `CONTRIBUTING.md` → "Scaling to a team") plus N9 and N13. **Nine NON-BLOCKING items dropped**, four of them disproven by this branch's own execution run. **One addition dropped for lack of evidence**: that GitHub offers a status-check name only once it has reported, true in memory and unsupported by two passes over GitHub's own branch-protection docs, with no runnable check available here. **Not executed, and labelled as such rather than implied**: `vercel link` and every dashboard setting (no account), the Sentry wizard (no org login), `gh repo create … --push` end to end (it would create a real repository under the user's account), and an actual `vercel rollback`. **Two hazards found and not fixed, now numbered**: Turbopack does not re-evaluate `env.ts` when `.env.local` changes, so **a reader testing their own env validation without restarting gets a false pass** — a check that cannot fail, placed in the reader's hands, and §5 says nothing about it (**TD-32**, rated High alongside TD-26 and TD-27, which are the same defect on our side of the line); and §9 may install Sentry twice, once directly and once via the wizard, which needs a wizard run against a real org to prove (**TD-33**, Low). Both were carried in this cell alone until the whole-branch review, which is the objection: debt is ranked by cost and revisited, and a hazard in a table cell is neither. **Per-task minors carried rather than fixed**: Task 1's `docs(setup)` scope against the stage-slug convention and its "on any pnpm version" cross-version claim tested only at 10.33.0; Task 2's citation of a dispatch-time resolution a reviewer could not find; Task 3's M1 and M4–M7, plus `2db28ce`'s commit message overclaiming what had been verified at the time, left uncorrected because history is appended to rather than rewritten; Task 4's five, including `79ef7a7` sitting on the line annotated `→ "commit"` when in the real incident it returned the opposite; Task 5's M1 and M2; Task 6's dropped ", so this is actionable" clause; and the fix wave's M5 (entry 3's trio-order provenance overclaimed, membership right and order wrong) and M8. **Cosmetic, all pre-existing**: `## Entry criteria`'s first two bullets at 97 and 99 columns, and the doc citing its own sections two ways (`§1` in three places, `### 1. Scaffold` in one). **This repository's own `lefthook.yml` still carries the narrow globs the doc just widened** — defensible for markdown, since `web/.prettierignore` excludes it from CI too, with a genuine one-file residue in `pnpm-workspace.yaml`, currently clean. **The humanizer ran over entries 1–6's prose (`93d881f`), was declined for 8b's and the fix wave's, and the whole-branch review reversed that** — the argument had been that the text already cleared a review, which is circular, since the pass is part of *done* under CLAUDE.md and its own output is what a review reads. Run over the whole document afterwards, it came back near-empty, which was the predicted and the correct outcome: em-dash density 5.9 per 100 lines on `develop` against 6.4 here, so the additions match the original's habit rather than inflating it; zero hits across the AI-vocabulary list; no superficial `-ing` tails, no copula avoidance, no filler or hedging, no signposting, and every `now` outside one line reading as the reader's own sequence rather than as narration of a diff. Three edits landed and all three were in prose written that same session: one genuinely diff-anchored sentence in §7 that told the reader what the branch had changed, one manufactured closer in the same paragraph, and one overclaim in §8 that no value could be copied from `.env.local` when only the URL cannot. **The skill's blanket "cut every em dash" was declined on the record**, as the skill itself allows: this is the house voice across all eighteen stage docs and CLAUDE.md, and stripping 48 of them from one document would leave it matching none of the others. **Not merged, not pushed** |
| 2026-08-14 | W-3.4 (`RevealList`) | **`RevealList` and `RevealFacet`, extracted from stage 03's duplicated accordions.** The branch was scoped to replace **five** and replaced **eleven**. The five were exactly the ones whose own header comments admitted the duplication (`EvolutionNotes` and `ScalingMoves` said so in prose and deferred the fix as "a change of its own"); the other six never announced themselves, so the scope came from what was documented rather than from what was there. A grep for the shared button className, run while confirming Task 7 had finished the five, found `ADRAnatomy`, `AIArchitecturePlays`, `ContractCost`, `Normalisation`, `SoftDelete` and `TraceForward` carrying the identical signature down to `Card className="p-0"`, `divide-y divide-line` and the button's full class string. **The user extended the branch rather than deferring them**, on the reasoning that finishing at five would leave six copyable originals in front of stage 04 — which is the thing this branch existed to prevent. Eleven components now call `RevealList` (**twelve instances**; `AIArchitecturePlays` renders its internal `PlayList` twice), and `src/features/architecture/` holds no bespoke **accordion** — no copy of the collapsed-row, chevron, `Card p-0`/`divide-y` shape this branch existed to unify. It does still hold three hand-rolled **disclosures** (`ERView`, `InternalOrganisation`, `RouteShape`), which are a different pattern and were never in scope: single-open selected tiles in a grid, no chevron, no divider list. Not missed migrations, and named in `PATTERNS.md` so a stage-04 author does not read the folder as accordion-free and copy one. **Two shared components were widened** for two callers that genuinely did not fit, and both were **reported rather than forced** on first contact: `RevealRow.title` went `string` → `ReactNode`, because `AIArchitecturePlays`' claim rows are `text-sm` (14px measured) and `RevealList`'s fixed title slot renders at 17px, so migrating as-was would have grown every claim; and `RevealFacet` gained a `bodyTone` override, because one block per `ADRAnatomy` row is `text-fg` where the component hardcoded `text-muted` — different tokens in both themes, not a near-match. **Two visual changes, both deliberate, both declared in a commit subject before they landed**: `DeferredList`'s and `ContractCost`'s badges moved from below the title to beside it, because that is where the shared slot puts them. `TeamNotes` moved to `src/components/` (TD-13 made it every stage's convention), and `PATTERNS.md` now documents all three components including both of `RevealList`'s known hazards | **37 commits `437e945`…`23ecb10`** off `dd44b30`, 26 files, **+1675/−979** — 31 to the last migration, then **six from the whole-branch review** (below). The direction is the point: `src/features/architecture/` is **439 added against 1015 removed** across 13 files, `src/components/` **629 added** across six (`RevealList` 143 lines, `RevealFacet` 73, three test files, plus `TeamNotes` relocated). **vitest 332/33 → 350/37**, the four new files being `RevealList.test.tsx`, `RevealFacet.test.tsx`, `RevealFacet.source.test.ts` and `ScalingMoves.test.tsx`; test-file count verified against the tree at both ends with `git ls-tree`. **The equivalence proof is the sweep, not the suite**: `e2e/count-expandables.mjs` reports **140 expandables across 36 URLs and 107 distinct panel ids**, identical before the first migration and after the last, which is what distinguishes "eleven migrated" from "one silently renders nothing". Audit **14/14**, lint clean at `--max-warnings 0`, typecheck and `format:check` clean, build exit 0. **Every task was reviewed read-only in a fresh context and the reviews did the load-bearing work**: Task 10's returned **spec ❌** on a rendering regression no check on this branch could see, and reviewers reproduced findings independently rather than trusting reports — byte-identity across all twelve call sites by sha256 and djb2, badge coordinates to six decimal places, React's own source read to confirm the key-validation mechanism, and one throwaway unwrapped build stood up on a spare port purely to reproduce a 24px gap. **Seven checks that could not fail** were found and are recorded in Process observations, because that is the transferable half of this branch | **Not fixed, opened as debt:** `RevealList` hardcodes `<h3>` for row headings, flattening the outline for any caller whose section heading is also `<h3>` (**TD-34**); the audit's zero-console-errors test runs a production build and is structurally blind to dev-only React warnings (**TD-35**). **Not converted, and not debt:** the four hand-rolled disclosures in stages 01 and 02 (`ValidationLadder`, `AIWorkflow`, `WorkedExample`, `AIPlanningPlays`) each keep a single row open, so converting one is a behaviour change needing its own decision, now stated in `PATTERNS.md` rather than left implicit. **Left open:** TD-12 (the audit's hand-maintained `PAGES`), deliberately sequenced *after* this branch by user decision because it rewrites the file Tasks 5–8 verify against and would have moved the 140/107 baselines for an unrelated reason; TD-27 (a reused server serves a stale build), which bit an implementer mid-branch and cost one wrong measurement; and Task 15's minor, that `typeof row.title === 'string'` also drops the `font-medium` wrapper for a bare number or array, which no caller exposes. **Not advanced:** the stage 04 port. `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT`. **Whole-branch review run, and it earned its place**: seventeen per-task reviews had passed, and it still found two blocking defects neither could see. **I1** — the React key warning Task 16b was believed to have fixed was still live on `#tenancy`, `#trace` and `#indexes`; Task 16b keyed the row header's two sibling children and left `Card`'s three (`{header}`, `<ul>`, `{footer}`) unkeyed, and the test could not see it because its `jsxDEV` mock was scoped to the row-header span by className. Every live check on record had loaded `#ai` only, which passes neither slot. **I2** — a *third* visual change, undeclared: Task 5 moved `ScalingMoves`' four catch labels from `t-label` to a `RevealFacet` label (JetBrains Mono 11px/500 → Newsreader 12px/600, each label 448.78px → 498.24px), the exact swap `Normalisation` and `SoftDelete` had both written header comments refusing. Reverted, so "two visual changes" stays true rather than being amended into three. Four minors also fixed, all records-accuracy: a hypothetical stated as history in `PATTERNS.md`, a stale "the one visual change" comment, this row's own accordion claim, and TD-35's stated minimum comment. **The fix round drew the wrong lesson and the final re-review corrected it**, which is worth keeping in both halves. The fix round reported that the live dev probe only has teeth on a *cold* server, since Fast Refresh supposedly rebuilds without re-running React's creation-time key validation. **Disproved across three cold-server runs**: reverting the keys under a running server and reloading *does* warn, every time, once the rebuild settles. The real blind spot is narrower — Fast Refresh patching an already-open tab with no reload, and a reload that races an in-flight rebuild. The duller explanation is the true one: **every manual check loaded a single page**, and `#ai` exercises neither `header` nor `footer`. Corrected in `audit.spec.ts` and in TD-35 rather than rewritten away, because a wrong mechanism inside a comment written to explain a blind spot points the next reader at the wrong variable. Post-fix: vitest **350/37**, audit **14/14**, sweep still **140/107 across 36 URLs**, lint and typecheck clean. **NOT merged, NOT pushed** |
| 2026-08-14 | TD-12 | **The audit's page list is derived, not listed.** `e2e/audit.spec.ts` held thirty-six hand-written URLs; stage 02 added six by hand and stage 03 thirteen more during its reshape. The failure ran in the direction nobody checks — a dead hash fails loudly, a **missing** one audits nothing while the suite reports green, which is how a stage could ship unaudited. `e2e/audit-pages.ts` now takes stages from `STAGES.filter(s => s.ready)`, the same flag the router reads, and step ids from the rail each stage renders, since `Stepper` emits one tab per step as `id="tab-<stepId>"`. Neither source can fall behind the app. **A ready stage that renders no rail throws** rather than contributing nothing, because live and broken should fail rather than disappear | **4 commits** `03f08a9`…`33bc2f6` and one more carrying this row, 9 files, **+448/−77** through `33bc2f6` — two to the close, one from the review (below), one to the records. Four of the nine are the working files, all under `web/e2e/`; the rest are records, plus one parked spec that rode in on the fix commit and belongs to no part of this work. **RED was real**: `Cannot find module './audit-pages'` before the module existed, an unresolved import rather than a failed assertion. **The equivalence test spells out all thirty-six URLs rather than recomputing them** from the source the implementation reads — an expectation derived the same way as the thing it checks asserts nothing, the defect class recorded seven times in Process observations. **Teeth-checked** by flipping `02-planning` to `ready: false`: the assertion failed with seven URLs missing, and the guard test stayed green, so exactly the intended one broke. Measured at the close: audit **14/14 → 16/16** over the same 36 URLs; sweep unchanged at **140 expandables / 107 ids**; vitest 350/37, lint, typecheck and `format:check` clean. **The review then found two blocking items, both this branch's own.** `2eb3c97` corrected `KICKOFF.md`'s stale audit figures and in the same commit left the identical numbers standing one file over in `docs/tracker.md`; `PATTERNS.md` and `count-expandables.mjs` both still described the `PAGES` array this branch had just deleted, the second inside a comment the branch itself rewrote. Three fresh instances of the trusted-but-false claim TD-12's own entry names, about the mechanism TD-12 is about. The second is the better finding: `count-expandables.mjs` paired `slug:` with `ready:` by a greedy match, correct today only because `slug` happens to precede `ready` in all eighteen entries — which TypeScript does not require, prettier does not enforce and no test covers. Swap two fields and it reads one stage's flag off its neighbour, drops the stage after it, and prints a plausible count over the wrong set; the comment above it claimed it would fail loudly, and the guard caught parsing *nothing*, not parsing *wrong*. Writing the completeness check that closes it **found its own bug** — counting bare `slug:` picks up the field on the `Stage` type, so it threw on every run until it counted `slug: '` — which is the third defect on this branch found by running something rather than reading it. **Post-fix, the whole gate re-run over the finished branch on 2026-08-14**: `format:check`, `lint --max-warnings 0` and `typecheck` (after typegen) all **exit 0**; vitest **350/350 across 37 files**; audit **16/16 in 1.1m**; and the sweep, stood up on a cold server per TD-27, still reports **140 expandables / 107 ids across 36 URLs** — the same three numbers the `RevealList` round measured, so the derivation covers exactly what the hand-written list did | **It broke a tool, which is the more useful half.** `e2e/count-expandables.mjs` — added during the `RevealList` round to make the 140/107 baseline obtainable — derived its URLs by scraping `const PAGES = [` out of `audit.spec.ts`. Deleting that array broke it on startup, and **nothing in the gate noticed**: `pnpm test:e2e` reported 16/16 while the script threw, because it is a tool no suite runs. Found by running it. Repaired to derive the same way, duplicated rather than imported because it is plain `.mjs`. **Not closed: the other direction.** The sweep follows what the app renders, so a step deleted by accident leaves it silently. Stage 03 is covered by construction — its `Step[]` is typed against `STEP_IDS` — and stages 01 and 02 have no equivalent, now **TD-36**, closing most cheaply as part of building the next stage rather than as its own round. **One file on this branch is not this branch's work**: `docs/superpowers/specs/2026-08-14-reference-hub-design.md`, a Reference-hub design brainstormed to four decisions and then **parked**, riding in on `33bc2f6` because it was written in the same session. It is marked parked in its own first line and ends on an unresolved question — which cheatsheet leads slice 1 — so it decides nothing and blocks nothing; recorded here because a spec appearing in a branch it has no relation to is the sort of thing a later reader treats as context for the branch. Its three source files under `reference/` are still untracked. **Merged to `develop` `--no-ff` on 2026-08-14**, the commit straight after this row (`a07a9b6`), taking `develop` to **112 ahead of `main`**. **Not pushed** — `main` is untouched at `8d5045c`, and both the push and the promotion are the user's |
| 2026-08-14 | W-6.1 | **A reference section beside the eighteen stages.** Lookup material had nowhere to live, and `reference/glossary.md` and `reference/stack.md` had been unreachable from the app since they were written — no route rendered either. `/reference` now holds cheatsheets as structured TS data behind one `CheatsheetView`, following the `terms.ts` precedent (D-36): TS is the source, `reference/cheatsheets.md` generates from it by snapshot test via `pnpm gen:cheatsheets`. **Eleven sheets are registered and ten are deliberately empty** — an empty sheet renders "Sheet not drawn" and is chipped WIP in the rail, so the index doubles as a worklist of what still needs gathering (D-62). Sheets tether to stages by slug, guarded by a test that every tether resolves. Rows are a CSS grid, not a `<table>`, because a table sets its own min-width from content and pushes the page into horizontal scroll at 320px | **11 commits** `1778bea`…`2114346`, merged `--no-ff` as `0207fd6`, 23 files, **+3175/−86**. **376/376 tests across 41 files** (26 new: 11 registry, 8 renderer, 4 sidebar, 2 sitemap, 1 snapshot), **17/17 playwright**, format/lint/typecheck/build clean — all re-run on the merged result, not just the branch. **Every RED was real and every teeth check bit**: breaking a stage tether failed exactly one test naming `git-commands → 04-project-setups`; replacing the placeholder branch with `null` failed only the placeholder test; renaming the nav landmark failed three and left the stage-index guard green. **The suite caught a real integration miss** — `audit-pages.spec.ts` asserts the derived sweep equals the frozen thirty-six-URL fixture, and twelve new reference URLs broke it. Padding the fixture would have converted a migration guard into a restatement of whatever the deriver returns, which its own docblock forbids, so the assertion was split: stage paths still compared against the fixture, reference tail asserted separately. **Measured at 320px**: document 312px against a 320 viewport, zero offending elements | Source graphics displayed on the sheets (**D-63**, needs an asset pipeline — files sit outside `web/public/`, and 5.1MB of static infographic is stored as GIF). The figure registry and the six architecture diagrams; the sheet carries rows only. Glossary and stack surfaced in the hub — the reason `/reference` beat `/cheatsheets` as a name, but not needed for the skeleton to stand. Stage→sheet backlinks; the tether is one-directional today. Search, already unscheduled at `docs/task.md`. Copy-to-clipboard on code rows, since nothing registered has code rows yet and a control with nothing to act on is untestable. Transcribing the three gathered sources into `design-patterns`, `api-design` and `git-commands` |
| 2026-08-14 | W-6.2 | **The gathered original is shown on each sheet, and converted off GIF first.** Closes the **D-63** amendment: the transcription stays primary and the graphic sits below it, framed on a plate because every one of these has a light background and would punch a hole in the cyanotype unframed. **Not dimmed at rest** — the obvious dark-mode trick is to drop opacity until hover, but the reason the graphic is there is to be read, and dimming content to make it blend is the worse trade. **The two GIFs were static images stored as GIF**, which is why they collapse so far. Originals stay untracked and gitignored; git keeps every version of a binary forever, and the converted copy is what the site serves | **1 commit** `6b62634`, merged `--no-ff` as `4727dc3`, 12 files. **5.2MB → 644K**: `MasterPlan-Api-Design.gif` 3817K→196K (−94.9%), `Software-Architecture-Patterns.gif` 1024K→121K (−88.2%), the two JPEGs −34.2% and −30.6%. **Legibility verified by reading the converted file**, not by trusting the quality number — every label in the fifteen-step roadmap survives at 196K. **382/382 tests** (6 new), **17/17 playwright** including WCAG AA both themes over the sheets carrying images, lint/typecheck/format/build clean on the merged result. **Teeth-checked** the on-disk guard by typoing a src: failed with `ENOENT … git-commandz.webp`, naming the exact path. **A correction is on the record**: the first pass used a plain `<img>` reasoning that already-WebP files gain nothing from re-optimising, which missed `srcset`. `@next/next/no-img-element` caught it; the rule was right and suppressing it would have been wrong. Dark mode confirmed by driving the real theme toggle rather than asserting — the first two attempts wrapped the system→light→dark cycle back to system and were caught by reading the computed `body` background | Transcribing the three gathered sources into `design-patterns`, `api-design` and `git-commands` — content work now that the frame exists. Two of the three still have no post URL or author recorded, which has to happen before anything derived from them ships publicly. The figure registry and the six architecture diagrams as drawn figures rather than a photographed original |
| 2026-08-14 | W-3.4 (port planning) | **The stage 04 port's seam, measured rather than inherited.** The round opened with planning because the spec's Phase 5 table cut the doc nine ways when it was 323 lines and the correction phase took it to **711**. The tracker's own framing — four steps at roughly a hundred lines each — was the thing that needed checking, and checking it required knowing what a doc line costs on screen. **It costs nothing predictable.** Fitting stage 03's fourteen doc sections against their measured panels, with step count, code lines, prose lines and table lines as predictors, returns `screens = 3.068*steps + 0.0016*code - 0.0032*prose - 0.0531*table`: every content coefficient is noise and two are negative. §14 renders 145 prose lines in 2.29 screens; §1 renders 21 in 3.17. **Panel weight tracks step count and nothing else**, because an author fills a panel to about three screens whatever the step covers, by choosing what to collapse and what to cut. So the gate can falsify a seam afterwards and cannot choose one, which is **D-64**. What the measurements do carry is a **floor**, and the floor settles the question: `scaffold` (§1+§2) reaches **3.74** on chrome plus artifacts before a word of teaching, past stage 03's heaviest authored panel, and `gates` (§6+§7) reaches 3.00 while owing **seven** judgments. All four heavy pairings fail, and they fail on D-52's *first* clause rather than its threshold. Nine steps become **fifteen**, eleven firm and four provisional, and the provisional four are authored **split** and merged only on measurement — **D-65**, inverting stage 03, which authored merged and split on failure in five of six tasks | **2 commits** `dc47580`…`126b3c8` on `feat/stage-04-app-port`, cut off `develop` at `49122f5`. **The measurement is the evidence**: all **35 panels** across stages 01–03 measured at 1024×768 with the audit's own method (`#panel-<id>` height ÷ 768), giving stage 03 a median of **3.02** and a max of **3.88** over 22 panels, against 2.36 and 2.47 medians for stages 01 and 02. Per-unit costs taken off the same build: minimal panel chrome **1.70 screens** (`03#require` 1.68, `02#done` 1.69), a rendered code line **20px = 0.026 screens** (`t-data`, 14px/20px, as `SchemaInspector` renders it), a `<pre>` line **0.033** (12px/24px plus 24px padding), a figure **0.87 median** and 3.29 at worst. The first pass at the code number found four code units in three stages and was **wrong** — stage 03 renders DDL as per-line elements with `whitespace-pre`, not `<pre>`, so the classifier missed them; corrected by measuring the computed line-height rather than counting tags. The fit's data is **censored and is recorded as censored**: every stage-03 panel is post-reshape, so none can exceed 4.0, and the counterfactual comes from the pre-reshape record instead (`require` at **4.7** before `trace` split out, six of nine original panels failing). Spec amended in place with the original nine-step table kept and marked superseded; plan is **1,610 lines, sixteen tasks in four waves**, every data module carrying a test that reads `docs/04-project-setup.md` rather than a count copied into a brief. **NOT merged, NOT pushed.** | **The port itself.** `04-project-setup` is still `ready: false` and absent from `STAGE_CONTENT`; W-3 stays at 3/18. The execution approach was recommended and not chosen — subagent-driven for the eleven independent data and component tasks, inline for the two assembly tasks where the merge-or-split calls need the whole panel table in one context. **Two findings filed rather than fixed**: `count-expandables.mjs` sweeps 36 URLs where `audit-pages.ts` now sweeps 48, because W-6 appended `/reference` and eleven sheets to the audit's derivation and not to the `.mjs` copy that mirrors it (**TD-37**); and lefthook's pre-commit reported `format (skip) no files for inspection` on a commit touching two markdown files under `docs/`, so the format hook does not reach them (**TD-38**) — the same shape as the glob trap stage 04's own §6 teaches. **Two corrections rode along**: the spec's Verification cited a sweep baseline three moves stale (108 expandables / 36 URLs against a re-measured **140 / 107 ids**), and `docs/stage-03-status.md:3` held a stray committed line reading `test`. **Not decided**: which of the four provisional pairs merge. That is Wave 3's measurement and it cannot be answered before the panels exist |
| 2026-08-17 | W-3.4 | **Stage 04 is interactive, and the seam it shipped is the one that was measured.** `docs/04-project-setup.md` ported to `web/src/features/setup/` as **fifteen steps**, taking W-3 to **4/18**. Content is extracted as data first — eight modules, seven of them asserted against the doc at run time rather than against a count copied into a brief — then rendered by eight components, then assembled. The four provisional pairs from **D-65** (`scaffold`/`structure`, `env`/`client`, `ci`/`enforce`, `deploy`/`verify`) **all stayed split**, decided by arithmetic: combined they measure 4.80, 5.40, 3.54 and 4.23 against a 3.2 ceiling. That makes this the first seam in this repo to survive measurement unchanged — stage 03 re-cut five of six. **TD-36 closed** on three guards, not one (see its entry: the tuple alone closes half). `e2e/audit-pages.spec.ts`'s thirty-six-URL literal was **deleted rather than updated**, on the instruction in its own header | **23 commits** `394e515`…HEAD, **60 files, +5402/−191**. Tests **382/41 → 521/63**. Audit **17/17** against a fresh build each time, including contrast in both themes, no overflow 320→2560, zero console errors. Sweep re-derived rather than quoted: **157 expandables / 119 ids over 51 URLs**, from 140/107 over 36. Stage 04 prerenders to 228KB of static HTML; the derived sweep covers **63 URLs**. `gen:glossary` re-run and `reference/glossary.md` **byte-identical** — no term was invented. **Final panel table, all fifteen under 3.2, median 2.28 max 2.99**: scaffold 2.99, structure 1.81, format 2.67, strict 1.58, env 2.90, client 2.50, hooks 2.83, ci 2.35, enforce 1.19, deploy 2.94, verify 1.29, proof 2.28, ai 1.28, checklist 2.25, traps 1.57. **Six reviews ran and found 26 blocking items**, none of which the gate would have caught. The one that mattered: a coverage walk found **five doc sections telling the reader to run a script or set a value the app never showed them how to create** — `.nvmrc`/`engines.node`/`.npmrc`, the `test` script, `format:check`, Vercel's environment variables, and `SENTRY_AUTH_TOKEN` — all five assigned to a panel by the plan's own line ranges. That, not lean writing, is why the median was 1.74 before the fix wave and 2.28 after. Fixing it took `scaffold` to **4.25**, past the ceiling and past the audit's own 4.0 gate; it came down 4.25 → 3.47 → 3.34 → 2.99 in three measured steps rather than one guess. **Nine plan defects found by executing rather than reading**, including a test that could never pass (`PIN_RULE` asserted against a hard-wrapped doc), a regex that counted nine traps where the doc has seven (`DOC.indexOf('## Traps')` matches §7's prose about `## Traps`), material sourced to a section that does not contain it (only three of four blockers are §8's), and every `.tsx` test in Wave 2 written against `jest-dom` and `user-event`, neither of which this project installs | **Deferred:** the `## Artifacts` inventory was initially dropped and is now ported, but `Entry criteria` is still surfaced nowhere — consistent with stages 01–03, and recorded because stage 04's entry criteria carry the database decision that `tree.ts` and the `env` artifact both depend on. §1's no-`gh`-CLI fallback (create an *empty* repo in the web UI, then `git remote add`), §8's `/robots.txt` canonical-origin check, and the AI section's closing named-tools line are not ported. `AnnotatedArtifact` shipped without a copy affordance and with a tab stop on every line (**TD-39**, **TD-40**); both were closed the following day on their own branches, along with **TD-41**, so no debt from this round is still open. Two components hand-roll type roles the design system already names. **The whole-branch review then found five more blocking items, all fixed here**: three literal backticks rendering on the live page from the reference cards, which D-67 exists to prevent and which nobody re-grepped for after the commit that added them; a locked-option contrast pair at 2.62:1 and 3.21:1 (**TD-41** files stage 03's seven instances of the same idiom, unfixed because they are merged UI this branch does not own); an `artifacts.ts` docblock still describing the pre-fix state and instructing a reader to delete three of the fix; two record files still saying the port had not started; and a sweep figure of 151/113 measured two content commits early and written into four files under the words *re-derived rather than quoted*. `pnpm test:prod` **not run** — it measures the deployed site and says nothing about this tree |
| 2026-08-18 | W-3.5 (doc round, verification and planning) | **Stage 05 measured before it is corrected, and the measurement is the deliverable.** `docs/05-development.md` is 249 lines and next to be ported, so **D-54** put the cold-reader pass before the port rather than after. Three instruments ran, two of them dispatched read-only and unable to see each other: a completeness reader given the doc and a houseplant-watering app to ship, a consultability reader given only the heading list, and a compiler. They returned **nineteen distinct defects**, and a twentieth was added when the user assigned read-path authorization to this stage (**D-69**). **Three were found twice by inputs blind to each other** — the Server Action importing two of its five symbols, `InvoiceTable` being named three times and produced never, and the bare `tsc --noEmit`. The doc's failure has one shape: its judgement is good and it scored **4/5** on consultability, but **its code blocks are excerpts with their imports and their callers removed**, and its checklist has drifted from its own body. The completeness reader could not produce a single compiling file for its first slice and could not finish the second at all. Scope set to full close by the user: the doc goes to roughly 600 lines and gains `### Authorize reads, not just writes`, `### Loading and error states` and `### AI in development`. **No correction has landed** — this row covers the verification and the planning only | **4 commits** `e1f1c86`…`042737e` on `fix/stage-05-doc-corrections`, cut from `develop` at `07c7045`. Records: `docs/verification/stage-05-doc-execution.md`, `docs/verification/cold-reader-stage-05-run1.md`, and the spec/plan pair. **The execution pass compiled the doc's three TypeScript blocks against the versions `reference/stack.md` prescribes** (TS **7.0.2**, Zod **4.4.3**, Drizzle **0.45.2**, React **19.2.8**) in a scratch project, because `web/` installs neither Zod nor Drizzle — assuming it did is the trap that put a whole stage-04 test wave on `jest-dom` and `user-event`. Two passes (**D-68**): literal returned **7 errors in the Server Action alone**, charitable returned **exit 0**, teeth-checked with two reverted mutations (`TS2322` feeding a uuid string into an integer column, `TS2339` on a non-existent field) and a restore back to 0. **Two suspicions were checked and dropped rather than shipped**: `tsc` still exists on TypeScript 7 (`Version 7.0.2`), and `z.string().uuid()` is not deprecated in Zod 4 — the schema was run against four inputs and rejected a bad UUID, a negative and a non-integer, so all three constraints it advertises are real. **One factual error confirmed against the shipped framework docs rather than argued**: `### Server Components by default` and `## Traps` both say `'use client'` opts a tree out of server rendering, and `01-app/01-getting-started/05-server-and-client-components.md` says Client Components and the RSC payload "are used to **prerender** HTML", rendering entirely on the client only on *subsequent* navigations. **The bare `tsc --noEmit` finding grew twice.** The cold reader rated it **low confidence** (it could see one document); the execution pass had already confirmed it from stage 04 and `CLAUDE.md`; and writing this row found it **violates D-25** — *"Typechecking goes through a `typecheck` script, never bare `tsc`"* — while `docs/11-ci-cd.md` teaches the same trap under `## Traps`, citing this playbook's own CI catching it. **Four places address the question and stage 05 is the only one that gets it wrong**, which no instrument on this branch could have found: it came from grepping the other docs. Consultability's single MISS was branch lifetime, stated in **three sections in three numbers** (two days, two weeks, a day or two) with "branch" appearing in no heading | **Deferred:** every correction. `docs/05-development.md` is **untouched** — no defect is closed, the doc is still 249 lines, and `05-development` stays `ready: false` and absent from `STAGE_CONTENT`, so **W-3 stays at 4/18**. The twelve-task plan is written and not started. **Two agent claims were corrected rather than transcribed**, which is the half of this round worth keeping: the completeness reader justified the throw-to-return finding by asserting Next masks Server Action messages with a digest in production, and that mechanism **could not be confirmed in the shipped docs and is not carried** (D-70 stands on the doc's own prose/code mismatch instead); and its low-confidence `tsc` guess was **promoted to confirmed** on evidence it could not see. **One rename refused on evidence**: `### Server Actions need validation and authorization` keeps its name because three anchor citations in `docs/03-architecture.md` and `docs/07-code-review.md` resolve against it, so the change would have cost three edits in shipped documents and bought nothing once read authorization got its own section. **Scope creep declared rather than hidden**: extending `source-citations.test.ts` to markdown anchors (**D-71**) is not a stage 05 defect, it is a gate hole this round exposed, and it was flagged to the user as separable before the spec was approved. **Plan self-review caught the round reproducing its own defect** — the `loading.tsx` block imported a skeleton component it never showed, which is exactly the `InvoiceTable` failure being closed — plus a `getInvoice` no task defined, which forced a stated rule into Global Constraints about which symbols a block must produce and which may stay scenery. **`KICKOFF.md`'s own count was wrong**: it called the doc "four `##` sections and nine `###` ones"; nine is right and there are **six** `##`. **Not run:** `pnpm build`, the audit suite and `pnpm test:prod` — nothing on this branch touches app rendering, and `pnpm test` is Task 1's business. **Not merged, NOT pushed.** |
| 2026-08-18 | W-3.5 (doc round, correction) | **`docs/05-development.md` is corrected, closed the twenty defects the prior row measured, and passed a whole-branch review that found four more it had not.** Twelve tasks plus a five-item fix wave took the doc from **249 lines / six `##` / nine `###`** to **587 lines / six `##` / twelve `###`**, adding `### Authorize reads, not just writes` (**D-69**), `### Loading and error states` and `### AI in development`, and correcting `'use client'`'s framing, the check-then-act authorization example, the throw-vs-return contradiction (**D-70**), the branch-lifetime number stated three ways, and a checklist line prescribing a bare `tsc --noEmit` in violation of **D-25**. **Re-verification found the twentieth defect had recurred**: `InvoiceTable` named three times and produced nowhere, the same convergence run 1 found independently by two blind instruments, closed in the fix wave with a five-line component. **A whole-branch review — fresh context, no sight of the eleven per-task reviews — then found four blocking defects the per-task process structurally could not catch**, all fixed here: `docs/06-testing.md`'s `getInvoice` readback, left inconsistent by an earlier per-task fix that only corrected the assertion beside it; a Server Action form input with no accessible name; that three records — this tracker, `docs/task.md` and `KICKOFF.md` — still said the round had not happened, closed by this row itself; and, the one worth naming plainly, **a false claim introduced by a per-task review's own controller-directed fix** — the doc twice said a copy still calling `reset` "gets `undefined` and a Try-again button that throws," which is false: `next@16.2.10` passes both `reset` and `unstable_retry` to `error.tsx` (`error-boundary.js:107-111`), and the shipped docs give `reset` its own heading. The controller had checked one document's silence (`10-error-handling.md`) and generalised it to the framework — exactly the un-checked-framework-claim failure mode this whole round exists to close, reproduced by the round itself. `unstable_retry` was and remains the right prop to teach; only the claim about `reset` being absent was wrong, and both instances now say what is true | **22 commits** `53b0d19`…`8c4ea60` on `fix/stage-05-doc-corrections` (27 total off `develop`, merge base `07c7045`; this row's own commit is not among them). **All three instruments re-ran on the identical `sprout` scenario** (`docs/verification/stage-05-doc-execution-run2.md`, `docs/verification/cold-reader-stage-05-run2.md`): completeness **8 BLOCKING → 0**, and the reader finished both scenario slices where run 1 could not finish one; consultability **4/5 → 5/5**, closing the sole miss (branch lifetime, now stated once and findable from `### Commits and branches`); execution's silent import gaps **7 → 0** across a corpus that tripled (six fenced blocks to twelve, three executable to nine), with the check-then-act authorization example now folding the owner into the `where` in one statement. **Eleven per-task reviews gated the twelve tasks and found real, distinct defects of their own**, fixed inside their owning tasks rather than carried forward: a fabricated `requireUser` cross-reference into `docs/04-project-setup.md` (zero relevant hits for `requireUser`, `authentication` or `sign-in`), a validation rationale the section's own opening sentence exists to demolish, a discarded Server Action return value on the one caller that drops it, an `as`-cast rule the page's own three `as const` uses broke, and the false "`reset` will not compile" claim Task 6's review first caught (before the controller's own replacement introduced the different false claim the whole-branch review then caught). **The whole-branch review's four blocking findings and thirteen deferred minors are `final-branch-review.md`** in this round's `.superpowers/sdd/` directory; the anchor guard it re-ran independently (`pnpm vitest run --project unit src/lib/source-citations.test.ts src/lib/stage-metadata.test.ts`) passed **26/26**, all ten cross-document anchor links resolving, including the one the final commit added | **Deferred:** thirteen minors the whole-branch review recorded and left — an execution record whose block counts drifted after the fix wave landed two more (M1), `error: Error` short of Next's `& { digest?: string }` (M8), `## Artifacts` not extended for the three gated concepts this round added (M5), and nine more of the same shape, all one line each, catalogued in `final-branch-review.md` rather than repeated here. `docs/08-security-audit.md`'s `getInvoice(invoiceId)`, which derives the owner internally via `requireUser()` rather than taking it as a parameter, is **deliberately not harmonised** with 05's `getInvoice(id, ownerId)` — a second correct design of the same rule, recorded as a cross-document divergence (**D-72**) rather than an error, and outside a stage 05 branch's business to fix in stage 08's document. `05-development` stays `ready: false` and absent from `STAGE_CONTENT` — the port is **W-3.5b**, a separate round, and has not started. The full gate ran and passed, `pnpm build` included: `pnpm lint` exit 0, `pnpm typecheck` exit 0, `pnpm test` **64 files / 529 tests** passed, `pnpm build` exit 0 with a clean prerender log. The audit suite (`pnpm test:e2e`) and `pnpm test:prod` were **not run** — nothing on this branch touches app rendering, and `test:prod` checks the deployed site. **The provenance of the `reset` finding is recorded as D-73**: a controller-directed fix is not exempt from the check that catches an agent's unchecked claim, and this round is the proof, having produced the failure it was built to close. **Merged to `develop` as `9ef3763`, `--no-ff`, 2026-08-18** — "Merge fix/stage-05-doc-corrections: stage 05's twenty documentation defects closed", carrying **29 branch commits plus the merge (30 on `develop` since `07c7045`)**; `fix/stage-05-doc-corrections` is **deleted**, per this project's branch convention. **The merged result was gated first-hand, on `develop`, after the merge**, not inferred from the pre-merge branch gate above: `pnpm lint` exit 0, `pnpm typecheck` exit 0, `pnpm test` exit 0 — **64 test files, 529 tests passed** — `pnpm build` exit 0, clean, no errors in the log. **`develop` is not pushed; `main` is untouched.** |
| 2026-08-19 | W-3.5b (port) | **Stage 05 is interactive.** `docs/05-development.md` (587 lines, six `##`, twelve `###`) is ported to `web/src/features/development/` as **thirteen steps**, taking **W-3 to 5/18**. Sixteen tasks against `docs/superpowers/plans/2026-08-19-stage-05-app-port.md`, run in four waves — two extractions before any stage-05 file existed, content-as-data, components, then assembly, each assembly task ending in a panel measurement rather than an edit. **Both provisional splits in `steps.ts` survived measurement unchanged**: `drill` did not merge into `reads` (combined **6.24** against the round's 3.2 target, nearly double it) and `boundaries` did not merge into `action` (which measured **3.16** before `boundaries` had any content, leaving no room). This is the **second** time in this repo a provisional seam has survived measurement intact — stage 04's four were the first, stage 03 had to re-cut five of its six. Wave 0 touched shipped stage-04 code before stage 05 had a line of its own: `AnnotatedArtifact` moved to `src/components/` (its test stayed with stage-04's data on review — **D-75**) and `docSource(relPath)` became a shared factory stage 05 pulled out of stage 04's version rather than writing a third copy. **A read-only coverage walk (Task 14), given only the doc and the code and none of this branch's plan or reports, found ten sections a fully green gate and eleven clean per-task reviews had let past** — the second time in this repo that check has earned its place rather than come back empty (stage 04's found five). Nine are closed in a nine-item fix wave: the RetryButton's truncation now stated rather than implied (N1), the schema-narrowing paragraph in vertical slices restored (N2), the four-item `'use client'` decision test restored with "effects" no longer missing (N3), a dead `(04)` cross-reference replaced with a real link (N4), the definition-of-done's two-part split restored (N5), the Superpowers-plugin attribution on two AI plays restored (N6), the three session-strategy options behind a `requireUser` note restored (N7), a cross-section stitch sentence restored (N8), and the entry-criteria links to stages 04 and 02 added (N10). The tenth, N9 — the doc's front-matter framing, absent from every stage's app, not only this one's — is deferred as a cross-stage question rather than fixed piecemeal (**D-80**). A mid-wave e2e run caught a real touch-target regression the N10 fix introduced, fixed with the same `min-h-11` treatment `DevChecklist` already uses — the second time this round the audit caught a defect created by a fix rather than by the original content. Coverage map: `docs/stage-05-status.md` | **30 branch commits** `4bf5edb`…`aab9584` on `feat/stage-05-app-port`, cut from `develop` at the stage-05 doc round's merge (`9ef3763`); 49 files, **+6686/−138**. Tests **529/64 → 645/80**. Audit **17/17** against a fresh build, over **76 derived URLs** (63 carried from stage 04 and earlier, +13 stage 05's own). Lint, typecheck, `format:check` and `pnpm build` all exit 0; `reference/glossary.md` regenerated with **zero diff** — seven new terms (`server-component`, `client-component`, `server-action`, `feature-flag`, `zod`, `error-boundary`, `rebase`). **Final panel table, all thirteen under the enforced 4.0 ceiling, twelve of thirteen under the round's 3.2 aspiration, median 2.42, max 3.82**: `loop` 2.14, `server` 2.66, `thin` 2.71, `action` 3.16, `callers` 2.35, `reads` 2.42, `drill` 3.82 (accepted, no `PANEL_EXCEPTIONS` entry — **D-79**), `boundaries` 0.96, `states` 3.06, `commits` 2.42, `ai` 1.35, `checklist` 1.79, `traps` 2.92. **Every content task carried a per-task review; four of thirteen needed a scoped re-review after their first review found a blocking issue**, two of them (Task 5's drill snippets, on opus; the batched Task 6+7) needing two re-review rounds each — every one returned *ADDRESSED* with no new breakage on an independent re-check, none needed a third round. Task 5's snippets were reviewed on opus rather than sonnet — the one module with no doc anchor, where four of six snippets are wrong on purpose and the review is the only check — and its two blocking findings were both on content the controller itself had authored in the plan: `action-check-then-write`'s verdict rested on a disprovable atomicity argument and was rewritten to argue from the two-statements-nothing-keeps-agreeing shape instead, and `button-caller` scored a correct reading of its own code as wrong — fixed by making the code genuinely unsafe rather than softening the question (**D-77**). Task 9's teeth check found its own committed test blind to the mutation it was meant to catch — mirroring `data-prerendered` onto `data-ships` passed because the test only sampled the all-shipping state — fixed by extending the assertion to the default `ships=false` state, where it reddens. Task 11's fix for a 1px overflow in `ClientBoundary.tsx` (first exercised once the route rendered for real) unmasked a second, larger 24px overflow in `AnnotatedArtifact` at `#reads` behind it — vindicating the decision to fix the audit-breaking bug immediately rather than defer it, since deferring would have left the second bug invisible behind the first; the fix reaches stage 04 as well as stage 05, and the reviewer judged it safe on evidence rather than assertion — the widening change can only reduce overflow, and the 17/17 audit run exercises all fifteen stage-04 panels with expandables opened. `term-usage.test.ts`, written in Task 13, is not scoped to this stage — it scans every `.tsx` under `src/` for `<Term id>` against `TERMS` and holds all eighteen stages to it going forward. `pnpm test:e2e` and `pnpm test:prod` beyond the audit above were **not run** — `test:prod` checks the deployed site and this branch is not deployed | **Deferred:** `features/setup/pins.test.ts` still hand-rolls `readFileSync` instead of the extracted `docSource` factory, flagged during the Task 2 extraction and correctly left alone there — **TD-42**. `features/setup/artifacts.ts`'s re-exported `Artifact`/`ArtifactLine` types have no external consumers today; the brief mandated the re-export as forward compatibility and lint is clean at `--max-warnings 0`, so left as written rather than opened as debt. `billingPage`'s sole artifact note explains the doc's presentation convention rather than a code decision — defensible, not fixed. In the authorization drill, `list-scoped`'s safety depends on an unseen caller passing `user.id`, and `detail-unscoped`'s code also throws on a nonexistent id — both true and both unmentioned in their verdicts, left as scope the drill's six rows do not have room for. `retryInvoice` in the `button-caller` snippet drops `requireUser()`'s return value — harmless while the snippet is deliberately unsafe, worth a look only if it is ever repurposed as a corrected example. N9 (the doc's front-matter framing) — see **D-80**. **The whole-branch review then ran on opus and returned Ready to merge with no Critical and no Important findings** — it read all six drill verdicts cold before opening the ledger and confirmed each, verified every framework claim against `node_modules/next/dist/docs/` by exact line (`reset` "re-renders without re-fetching" at `catchError.md:80-81`; the prerender and `children` claims verbatim in `05-server-and-client-components.md`), and **disproved two of its own suspected fourth dropped-sentence instances** by walking all seventeen doc sections rather than reporting them. It also gave the harder answer on the shared extractions: a green unit suite is *not* sufficient evidence there, because the responsive fix is a layout change jsdom cannot see and stage 04 renders `AnnotatedArtifact` nineteen times — the 17/17 audit over every built stage at 320–2560px is the check that actually covers it, and it ran. **Its four minors were fixed rather than merged with** (`af1c8d0`), because two of them were the sixth and seventh instances of the round's own recurring class: `aria-checked` asserted only in the unanswered state, and the `children` exception's `data-ships` badge never asserted nor re-checked after the boundary moves. A scoped re-review reproduced all four by mutation. **Merged to `develop` as `425381b`, `--no-ff`, 2026-08-20** — "Merge feat/stage-05-app-port: stage 05 renders interactively (W-3.5b)", carrying **36 branch commits `4bf5edb`…`af1c8d0` plus the merge**; `feat/stage-05-app-port` is **deleted**. Final tests **648/80**, not the 645/80 above, which predates the final fix wave. **The merged result was gated first-hand on `develop` after the merge**, not inferred from the branch: `pnpm lint`, `pnpm typecheck`, `pnpm test` (**80 files / 648 tests**) and `pnpm build` all exit 0. **`develop` is not pushed; `main` is untouched at `8d5045c`** |
| 2026-08-20 | TD-42 · D-81 | **A debt closed and a decision corrected, and the correction is the larger half.** `pins.test.ts` was the last file in stage 04 reading its doc by hand; it now takes `DOC` **and** `flat` from `doc-source`, the second of which the TD entry had missed when it described the duplication as "only the read". **D-80 is superseded.** It claimed no stage's app carries its doc's front-matter blockquote, from checking one stage — stage 04, the single one that paraphrases. Three carry it verbatim, and **D-36 had already closed the question in July on the identical evidence**, finding the blurb to be "two purpose-built strings that diverge for 15/18 by design". Fifteen of eighteen is the figure this round measured before proposing to reverse it, and the design to do so was approved and under way before D-36 surfaced. So the stage 05 coverage walk's N9 is **not a defect** — it is the convention working | **2 commits** `3b1e545`…`a146f6a` on `fix/td-42-and-d-80-correction`, cut from `develop` at `0f57954`. Gate green throughout: **648/648 across 80 files**, `pnpm typecheck`, `pnpm lint` and `pnpm build` all exit 0. TD-42 teeth-checked — prefixing `PIN_RULE` reddens exactly the doc-comparison test, proving the import resolves to the real document rather than silently to an empty string; `grep -rn readFileSync src/features/setup/` now returns nothing. **One line of production code changed**: `stage-metadata.test.ts` argued why the blurb is unchecked and cited no decision, and that argument stopped nobody — the comment sat directly above where the sync test was about to be written. It now cites **D-36** and says to supersede it deliberately if you mean to | **Deferred:** nothing new opened. The `blurb`/`timing` fields stay editorial, which is D-36 unchanged rather than a decision taken here. `docs/stage-05-status.md`'s not-ported row now reads not-a-defect rather than deferred, and D-80 is kept struck through per the D-38 precedent. Two learnings extended — `decisions-need-tests-101` with the case where the check and the reasoning both exist and only the decision number is missing, plus the sampling rule that a negative confirmed once is a sample of one. **`docs/task.md`'s backlog was a third source of the confusion** and is corrected here: it still listed "single source of truth for stage metadata (TD-2)" and its glossary twin as unscheduled wants, thirteen months after D-36 closed both — so a reader checking whether single-sourcing was wanted found a live-looking backlog entry saying yes. **Second time this project has generalised from one silence**; D-73 is the first, and both times a written record already held the answer. **Not merged, NOT pushed** |
| 2026-08-20 | TD-32 · TD-27 · TD-26 · TD-35 | **Four checks that reported success without evaluating the thing they name, closed in one round — and three of the four turned out to be recorded wrongly.** **TD-32**: §5's promise is that a missing variable stops the app, and the check a reader reaches for returns 200. The paragraph that closes it teaches the mechanism this round *measured*, not the one the entry recorded: Turbopack re-evaluates `env.ts` in place, with no restart, and what misleads is a window one request wide. **TD-27**: `reuseExistingServer` stays; a `globalSetup` freshness gate fails the run when the served build is not the one on disk, or when the build predates the source. **TD-26**: the one-shot expand becomes a sequence of DOM states, so single-open groups and `aria-selected` tabs each get a turn, and the guard is a property rather than the count the entry asked for. **TD-35**: `pnpm test:dev-console` gives React's development warnings somewhere to be caught, and found a real one on its first honest run. | **Merged to `develop` as `e5c411b`, `--no-ff`, 2026-08-24**, branch deleted — 14 commits `49e09b0`…`9c2acff` plus the merge, and the merged result re-gated first-hand on `develop`. **Merged without a whole-branch review**, on the user's call; every previous branch's review found something, so treat anything this round shipped as less checked than usual. `develop` is unpushed; `main` untouched. Tests **648/80 → 660/82**, audit **17 → 18**, `pnpm test:dev-console` 1/1 in **42s** over 76 URLs. Expandables opened **191 → 198** over the same 64 URLs; the +7 is exactly the `aria-selected` controls the old selector could not match — `AuthPaths`' three on `#access` and `Toolkit`'s four on `#research`, and **TD-26 named AuthPaths and not Toolkit**. Every assertion teeth-checked and the output kept: TD-32's two halves at 1 failed of 131 each; TD-27's freshness and identity halves separately, the second naming both build ids (`R-IC6NrDTAsq6Q0bcXl6E` served against `NNfAfQftR2zBA2t1Le1bL` on disk); TD-26's guard three ways, one of which reproduced the pre-TD-26 sweep and listed `auth-panel-managed` and `auth-panel-library` — the two of three panels the entry said were never checked; TD-26's container fix against a planted 1.11:1 pair; TD-35's three. TD-32's reproduction is `docs/verification/td-32-env-restart.md`, run on Next 16.2.10 and 16.3.1. Neither TD-26 widening surfaced a real contrast or touch-target failure in either theme, so those claims were true and unearned rather than false. | **Deferred:** TD-43, the missing-key warning TD-35's spec found at `/stages/03-architecture#traps` — real, deterministic, pre-existing, and pinned so the command ships green. TD-31's stale `@v4` action pins in `docs/11-ci-cd.md`, which belong to 11's own correction round. TD-33, still unproven without a Sentry org. Fixing the LCP `loading` hints the dev spec prints as unmatched noise on three `/reference` sheets. W-6 stays parked: its status was corrected, not resumed |
| 2026-08-24 | TD-43 | **The missing key that was never missing.** React validates keys twice and unwraps lazy nodes to different depths: `validateChildKeys` stamps the static-children exemption one level down, `warnOnInvalidKey` checks all the way down. `Architecture` is a server component, so every step's `content` crosses the RSC boundary as a lazy chunk, and the last one the server flushes arrives wrapped twice — never stamped, then reported as an unkeyed list child. The panel now renders `<Fragment key="content">{step.content}</Fragment>`, keyed to match `RevealList`'s existing precedent and keeping the streamed node out of a multi-child array so the single-child path runs. **The previous session's two recorded discriminators are replaced, not refined**: it follows the last content *flushed* rather than the last *index*, and the id `traps` was never the discriminator | **On `fix/td-43-lazy-content-key-warning`, cut from `develop` at `33b782f`, starting at `4fab2cc`; the tip moves with each records edit — including this one — so derive the count with `git log --oneline develop..fix/td-43-lazy-content-key-warning` rather than trusting a number here. ~~NOT merged, NOT pushed, NOT deployed~~ — false, and corrected 2026-09-07. Merged as `ee98d52` (`Merge fix/td-43-lazy-content-key-warning`); `<Fragment key="content">` is live at `Stepper.tsx:195`. Found by grepping this file for the phrase while updating a third row that had just become stale — three at once, two of them long-standing.** Two lines of production code changed across the branch's life — `<>{step.content}</>` in `Stepper.tsx`, keyed to `<Fragment key="content">{step.content}</Fragment>` on review — plus a cross-referencing comment added to `RevealList.tsx`; the comments above both are the larger share of the diff and the part a later reader will act on. **RED** with the pin removed (1 failed at `/stages/03-architecture#traps`), **GREEN** with the fragment (1 passed, ~42s over 76 URLs), **teeth check** reverting *only* the unkeyed `<>{step.content}</>` form and leaving the comment (1 failed, same URL, same message), then restored — not independently re-run against the keyed form that shipped, though the full gate below reconfirms it clean. Prerendered HTML for the stage is **byte-identical** before and after — 284,405 bytes both, empty diff once the build id and one chunk hash are normalised — so the fragment changes no DOM. Gate: lint 0, typecheck 0, **660/82**, build clean, audit **18/18**, `test:dev-console` **1/1 unpinned**. Reproduction: `docs/verification/td-43-lazy-key-warning.md`. **D-86's pin retired itself as designed** — removing it is what produced the failing test. One new decision, **D-87** | **Two whole-branch reviewers ran, on different lenses, and the record needed more fixing than the code did.** The code reviewer confirmed all four framework claims against the shipped source, reproduced the RED, the teeth check and the byte-identical build first-hand, and **disproved its own suspicion that the wrapper might mask genuine missing keys**. It raised nothing Critical and nothing blocking against the production line. The records auditor raised **three blocking findings, all against the records, and all correct**: the reproduction doc's only wire-level evidence did not reproduce, because it had been captured with a probe still installed that shifted the payload; the doc certified as correct the one old probe its own mechanism predicts to be false; and the replacement discriminator was contradicted by its own control. All three are fixed, and re-measured first-hand rather than transcribed. The fix was also changed on review, from a bare fragment to a keyed one, matching `RevealList`'s existing precedent for the same warning. **Deferred:** the upstream asymmetry in React, unreported — `validateChildKeys` unwrapping one level while `warnOnInvalidKey` unwraps recursively makes RSC-streamed static children warn falsely for any app passing server-built nodes to a client component, and the reproduction is written. The size threshold that decides whether a content is outlined is unmeasured. `TeamNotes`, `Term` and `ArtifactControls.OverflowFocus` take `ReactNode` slots from server components and are structurally exposed to the same false positive; nothing fires today and `pnpm test:dev-console` is the detector. The three LCP `loading="eager"` hints on `/reference` sheets. TD-31 and TD-33, untouched |
| 2026-08-24 | W-6.3a | **Nine cheatsheets are drawn — six of the original ten, plus three not in that count — and W-6 resumed on purpose (D-88).** `design-patterns` (all 23 GoF patterns, three sections), `api-design` (the fifteen-step roadmap condensed to six themed sections, dropping two exercise-only steps), `git-commands` (two sections, basics plus "beyond commit and push"), `git-branching` (five strategies plus this repo's own convention, read from `CLAUDE.md` rather than a graphic), `sdlc` (untethered, not in the original ten). **A fifth `CheatsheetGroup`, Design Principles, was added partway through (D-90)**: SOLID and Clean Code were first drafted as two of `coding-standards`'s four sections, then split into their own sheets, `solid-principles` and `clean-code`, on the reasoning that both are principles carried across a codebase rather than project-specific style rules — the same distinction that already separates `design-patterns` (concrete solutions) from `coding-standards` (local hygiene). `coding-standards` keeps one section, code smells; naming conventions stays empty, the one gathered source (Godot/GDScript-specific) was the wrong domain and dropped rather than transcribed | **A new `Row.example` field**, TDD'd (RED: `renders a labelled code example` failed on `screen.getByText('Violation')` with nothing rendering it; GREEN: a labelled `<pre>` grid in `Cheatsheet.tsx`) — `solid-principles` and `clean-code` are the first sheets with real violation/correct and before/after code, adapted from the gathered Java graphic into this repo's own TypeScript rather than transcribed verbatim, plus five original before/after pairs for Clean Code (the gathered graphic states habits without code). **Two real defects, both caught by the existing audit and neither introduced before this round**: the example grid overflowed at 320px — a grid item's `min-width: auto` default overriding its own `overflow-x-auto`, fixed with `min-w-0` on the item, not just the scroller; and `coding-standards`'s new `source.url` (Refactoring.Guru) is the first ever set on any sheet, which exercised a footer link with no touch-target sizing for the first time — fixed with the `inline-flex min-h-11` treatment already used on the stage-back-link above it. Four images newly converted to WebP via `npx sharp-cli -q 82` (git-branching.jpeg → 168K, SOLID-PRINCIPLES-cheatsheet.jpeg → 258K, sdlc.png → 83K, CLEAN-CODE-principle.webp re-encoded at consistent quality → 123K); `design-patterns` and `api-design` reused images already converted in W-6.2. A requested follow-up source for Clean Code (`medium.com/@ewniakithma/...`) returned 403 on fetch and a web search found no mirror; the user confirmed the already-gathered graphic was sufficient rather than blocking on it. `.gitignore`'s gathered-originals rule covered `.gif`/`.jpeg`/`.jpg` but not the `.png`/`.webp` this round's captures came in as — extended. Gate re-run first-hand on the final shape: lint 0, typecheck 0, **662/82** (two new render tests for `Row.example`; the `isDrawn` and stage-03 pins in `index.test.ts` updated to match; `reference/cheatsheets.md` regenerated), build clean, audit **18/18** including WCAG AA both themes, zero console errors and no overflow at 320px, over the fourteen now-registered `/reference/*` routes. Six images dropped as redundant or consulted-without-display, logged in `reference/cheatsheet-sources.md`'s ledger either way | **Deferred:** naming conventions inside `coding-standards`, still searching. `sql-reference` and `api-reference` — hand-written drafts already exist (`reference/10-sql-concepts.md`, `reference/rest-api-best-practices.md`) but are not yet registered. The five language sheets and `containers` (tethers to stage 11, no interactive port yet). **Attribution is unrecorded on most of this round's sources** — real per D-63, not new: two of W-6.2's four originals already carried the same gap. Fix before promoting past `develop`. **This round was committed directly to `develop` by controller error before being moved to `feat/reference-w6-round1`** — see the branch-hygiene note below the decisions table |
| 2026-08-25 | W-6.3b | **Real syntax highlighting on `solid-principles` and `clean-code`'s code examples, matching this app's own whiteprint/cyanotype system rather than a canned theme.** Shiki, TypeScript grammar only, with a custom four-role palette designed through `/impeccable`: keywords and type-annotation punctuation reuse `--blueprint` ("structure, diagram linework" — the existing token's own stated meaning already fit), type/class names reuse `--ink` at bold weight rather than a fifth colour, comments reuse `--faint` italicised, and one genuinely new token, `--syntax-string` (`#5d5a14` light / `#beb937` dark, same ~58° hue both themes, only lightness and saturation move — the pattern every existing token pair already uses). `--signal`/`--go`/`--stop`/`--warn` are untouched — plain syntax colour is neither attention nor status, and this app's own rule (`DESIGN.md`) says those four are never reused for either | All four roles measured against `--sunk` specifically — the code panel's actual background, not the general "worst-case surface" DESIGN.md's other tokens were solved against — light 12.27/6.31/4.80:1 (ink/blueprint/faint), dark 16.12/8.69/7.93:1, the new token 5.61:1 light / 9.05:1 dark, all clearing the 4.5:1 body-text floor with margin. Shiki wired through its dual-theme CSS-variable mode (`defaultColor: false`), toggled by the identical `:root[data-theme]`/`prefers-color-scheme` cascade every other token in `globals.css` already uses — not Shiki's own `.dark`-class convention. **D-91**: highlighting runs at generate time via a new `pnpm gen:highlighted`, not import time (a top-level-await attempt passed `pnpm test` and `next build` but broke `pnpm test:e2e` outright) and not render time (keeps `Cheatsheet.tsx` and every existing test on it synchronous). New dependency: `shiki`, fine-grained to the TypeScript grammar. Verified against a live build, not asserted: lint 0, typecheck 0, **667/84** (`highlight.test.ts` new, `Cheatsheet.test.tsx` gained a pre-highlighted-markup case), build clean, audit **18/18** including WCAG AA both themes on the real rendered tokens, `test:dev-console` **1/1** — checked specifically given `dangerouslySetInnerHTML`'s history in this codebase (TD-43) and confirmed clean | **Deferred:** the four other roles a fuller theme could add (function calls, numeric literals, object keys) — restrained to four on purpose, matching this app's "rarity gives an accent force" design principle rather than a copy of a general-purpose editor theme. Highlighting is TypeScript-only; a future non-TS example ships as plain text until its grammar is added to `highlight.ts`. Author/URL still unrecorded on this round's sources, unchanged from W-6.3a |
| 2026-08-25 | W-6.3c | **`sdlc` expanded from a bare seven-row list into a two-section guide, at the user's explicit request for "detailed but not too much."** Each phase now names a concrete deliverable alongside its definition (`Requirements analysis` → user stories, acceptance criteria; `Design` → architecture diagram, ER diagram, wireframes; and so on through all seven), using the existing `Row.when` field rather than a new one. A second section, "How different methodologies run the loop," compares Waterfall, Agile/Scrum and DevOps/Continuous against the identical seven phases — sequential once, a repeating slice, or continuous — with the DevOps row naming this playbook's own stage 11 (CI/CD) as the example | No code examples added, and that was a deliberate scope call rather than an oversight: asked whether "examples" meant deliverables, a methodology comparison, or both, the user picked both — neither reading asked for code, and SDLC is a process framework rather than a coding concept, so forcing a snippet in would have answered a question nobody asked. Ten rows across two sections, checked against the sheet's own restraint bar by reading it rendered at both scroll positions on a live build rather than by row-count alone — proportionate against the other ten drawn sheets in this registry, not the largest of them. Gate: lint 0, typecheck 0, **667/84**, build clean, audit **18/18**, `reference/cheatsheets.md` regenerated | **Deferred:** nothing new — the same open items W-6.3a left (naming conventions, `sql-reference`/`api-reference`, five language sheets) are unchanged by this round, which touched one already-drawn sheet rather than drawing a new one |
| 2026-08-25 | W-6.3d | **`sdlc`'s seven phases carry one running example — adding password reset to a small app — rather than seven separate "typical output" lists, at the user's explicit request to teach the phase rather than name what it produces.** The prior round's deliverable lists (W-6.3c) named artifact *types*; this round shows their actual content for one scenario and threads it forward, so each phase's output is visibly the next phase's input — Planning's risk (an attacker probing which emails exist) becomes Requirements' checkable non-functional requirement, which forces Design's schema decision, which Development builds in four reviewable PRs, which Testing has a named case for, which Deployment ships behind a flag, which Maintenance is still fixing three months later as a DNS record, not a code change | No structural change — same `Row.when` field, longer content. Gate: lint 0, typecheck 0, **667/84**, build clean, audit **18/18**, `reference/cheatsheets.md` regenerated. Read on a live build: the longer prose still clears 320px, no overflow | **Deferred:** unchanged from W-6.3a — naming conventions, `sql-reference`/`api-reference`, five language sheets |
| 2026-08-27 | W-3.6 | **Stage 06 is interactive.** `docs/06-testing.md` (316 lines, six `##`, eleven `###`, no doc-correction phase needed this round) is ported to `web/src/features/testing/` as **eight steps**, taking **W-3 to 6/18**. Sixteen tasks against `docs/superpowers/plans/2026-08-27-stage-06-app-port.md`: two waves of content/component tasks (seven data modules plus a real red-green cycle for the `AI in testing` section, since `stage-metadata.test.ts`'s `AI_SECTION_STAGES` list made the doc amendment itself the failing test), then assembly, then a context-starved coverage walk, then verification. **A read-only coverage walk (Task 14), given only the doc and the code and none of this branch's plan or reports, found ten problems against a green gate of 739 tests and thirteen closed per-task reviews** — the third time this exact check has earned its place in this repo (stage 04 found five, stage 05 found ten). Eight were missing or drifted content (numbered 1–8 in the fix wave), closed in a six-commit fix wave: the component-test carve-out restored after it had shipped reading as "never write component tests" (contradicting this repo's own render-test rule), the Coverage section's one CI-scoping instruction, the "push logic into pure functions" and "best value-per-test" ranking clauses, the AI section's closing paragraph (restored as a new `AI_LIMIT` export), a real link to 07-code-review replacing a bare `(07)`, the Superpowers-plugin attribution, and three drift items (a scope caption, the 80% number, a second negative-price probe). **Finding 0, structural, is the one worth naming plainly: three tests — `triage.test.ts`, `layers.test.ts`, `ai-plays.test.ts` — asserted only against `docs/06-testing.md` and never touched an app export, so each was green while the app was missing the exact phrase it was named for (two of them were), and by this stage's own definition none had ever been red for the reason it existed. Shipped inside the stage that teaches against exactly this.** All three now pin an app literal too, teeth-checked by mutating the export directly; a new `Testing.test.tsx` closes the sub-case no data-module test could reach at all, since `DISTRIBUTION` and `RESTRAINT_ROWS` are hand-authored inside `Testing.tsx` rather than in a module — it renders each of the six restored findings against `#panel-<id>` textContent, panel by panel. **A tenth issue, Finding 9**, was a hazard the doc does not even have: `ARTIFACTS.actions` calls `asUser`/`getInvoice` behind a one-click copy button with neither imported, defined or annotated, so a reader who pastes the block gets a `ReferenceError` before any assertion runs — fixed by annotation only, the quoted fence itself untouched per the whole-fence D-66 rule. Tests **739/99 → 753/100**. Panel table: triage 3.55, restraint 1.46, unit 3.93 (unchanged, exactly as required — it had 0.07 screens of headroom and the fix wave routed both its candidate restorations into `triage`'s Figure 1 instead), integration 2.97, e2e 2.22, teeth 3.52, done 2.51, traps 2.41 — median **2.74**, max **3.93**, both against a 4.0 ceiling, no `PANEL_EXCEPTIONS` entry added. Coverage map: `docs/stage-06-status.md`. **The panel split is `D-92`**: `done` measured **4.69** once `<References>` was wired in (Task 13's own required scope), which traced back to three doc closing sections compressed into one panel at plan time before anything existed to measure against; splitting rather than compressing produced eight panels instead of seven, `traps` closing last with the eight trap callouts plus `<References>` — matching the doc's own order and `PATTERNS.md`'s convention of ending a stage on a `Callout kind="trap"` set. Eight new glossary terms (`mock`, `test-fixture`, `regression-test`, `invariant-test`, `teeth-check`, `code-coverage`, `flaky-test`, `accessible-name`); `reference/glossary.md` regenerated with a 16-line diff. Three infrastructure stalls this round (a machine sleeping mid-response, a second agent stalling on the identical backgrounded-`test:e2e` wait, a third stalling on exploration) — all handled per the retry-once-then-change-something rule: two resumed cleanly with verified on-disk state, one was re-dispatched fresh after the controller did its stalled exploration by hand and handed the results over | **28 commits** `dd26472`…`9dcff8b` on `feat/stage-06-testing`, cut from `develop` at `6d934aa`; 45 files, **+6234/−9**. Tests **739/99 → 753/100** after the coverage-walk fix wave (671/85 after Task 1, climbing task by task through three waves). Seventeen plan defects found by executing rather than reading, three of them the same hard-wrap-regex family in three different files (`flat(section(...))` is the fix throughout, generalised into a Global Constraint after the second instance rather than the third), one a stale `Step`/`Section` prop shape the plan drafted before Task 1's implementer read the real components, one a `Callout kind="danger"` that does not exist (substituted `warn`, with precedent), and one — the biggest of the round — the `done` panel overage that produced **D-92**. Every content task carried a per-task review; three of thirteen (Tasks 7, 9, 13) needed a fix round after their first review found a blocking issue, each closing on re-review with **zero** new breakage. Task 9's review caught **two Important findings, both plan-authored**: a visibility test deriving its needle from the row it renders (fixed for the reason that matters — `TeethCheck` is this codebase's canonical "don't read both sides off one source" example, and resemblance alone teaches the wrong habit), and the controller's own `git add -N` teeth-check advice, which stages an empty blob for a new file so pre- and post-mutation states diff against the same baseline — now a Global Constraint: teeth-check the **committed** file (commit first, mutate, `git diff`, `git checkout --`). Full gate re-run in the foreground after three more agents stalled on the same backgrounded `test:e2e` wait: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **753/100**, `pnpm build` clean, `pnpm test:e2e` **18/18** (one transient `networkidle` timeout on the first run, resource contention under parallel workers, reproduced clean in isolation and on a full rerun — not masking a regression), `pnpm test:dev-console` **1/1**, run for the first time this round and the only thing that can see React's dev-mode validation — clean over two new drills and eight new `Term` popovers. A standalone committed-state contrast sweep (`TriageDrill`/`TeethCheck` locked rows, both themes, all eight panels) found **0 failures, 16/16** — closing the concern that the audit's shared `aria-expanded`/`aria-selected` disclosure walker cannot commit a `role="radio"`+`disabled` row and so never samples it; the audit itself still cannot reach it (**D-93** covers the test-design half of this round; the audit's own blind spot is unresolved, flagged for stage 07 to budget for). Responsive: 18 widths (320–2560px) × 10 pages, 0 overflow, 0 sub-44px. Humanizer: 0 accepted, 1 declined (blanket em-dash, established house voice, unchanged from every prior round's call). `git branch --show-current` confirmed `feat/stage-06-testing` throughout. **Merged to `develop` as `cad21c1`, `--no-ff`, 2026-08-27, branch deleted — this row read "Not merged, NOT pushed, NOT deployed" until 2026-08-28, contradicted by `cad21c1` sitting in `develop`'s own history the entire time. `develop` is not pushed; `main` is untouched** | **The `testing` reference cheatsheet** — the bounded W-6 round D-88 puts after a W-3 stage ships, not inside it. **`sql-reference`/`api-reference`**, still parked and untracked (`reference/10-sql-concepts.md`, `reference/rest-api-best-practices.md`) — gathered in the prior session, not yet registered. **Attribution unrecorded** on those same gathered sources, real per D-63, not new. **`CLAUDE.md`'s stage-port trace is stale**: it describes three files (`stages.ts`, the feature component, `stage-content.ts`) and this round needed a fourth, `src/features/step-ids.ts` — TD-36's `STEP_IDS_BY_SLUG`, which `rails.test.tsx` enforces for every `ready` stage and which the plan had not touched until its own gate caught it. **`CLAUDE.md` still prescribes a `Claude Opus 4.8` commit trailer**; this round's practice, like every recent one, names the model that actually did the work instead. **`Testing.test.tsx` stubs `Element.prototype.scrollIntoView` globally with no teardown** — low risk, since vitest isolates per file, logged rather than fixed. **The `07-code-review` `References.test.tsx` fixture now asserts against `07-code-review`**, moved there this round because it genuinely has no references yet; it will need repointing again once that stage gets some, the same way this round moved it off `06-testing` |
| 2026-08-28 | W-6.3e | **Two new sheets, `testing` and `playwright`, both tethered to stage 06 — the bounded W-6 round D-88 puts after a `W-3` stage ships.** `testing` covers the five types (unit/integration/e2e/performance/security) from Prateek Agrawal's "5 Types of Testing" graphic plus the matching dev.to article by the same author — the first cheatsheet source in this registry to carry a real URL from the moment it was gathered, rather than "not recorded". A second section transcribes the testing-pyramid concept from a separate, unattributed graphic (D-89's convention: one plate, the rest consulted) grounded in this repo's own test split — by proportion, not a hardcoded count, after a first draft cited `667/84` and `76 derived URLs`, both already wrong by the time the commit landed. `playwright` is a tool-specific companion, the same split `git-commands`/`git-branching` already use: four sections condensed from a three-page gathered cheat sheet, its "Interview Questions" block left out as study-guide material rather than lookup material (the same call `api-design` made on its own doc), and one section quoting a real test name out of `e2e/audit.spec.ts` to ground the sheet in this codebase's own practice | Two converted assets deleted rather than shipped: pages 2–3 of the Playwright source and the pyramid graphic were consulted but never displayed, and `public-assets.test.ts` correctly caught both as orphaned `.webp` files nothing referenced — the same check catching exactly the class of bug it exists for, on the first sheets in this registry to trip it. Gate re-run first-hand on the merged result: lint 0, typecheck 0, **754/100**, build clean, audit **18/18**. Sixteen `/reference/*` routes now registered, eleven drawn | **Found and fixed mid-round, not deferred:** `docs/task.md` and this file's own W-3.6 row both still said stage 06 was "not yet merged" / "~~NOT merged, NOT pushed, NOT deployed~~ **— false, and corrected 2026-09-07. Merged as `a2029d8` (`Merge feat/testing-reference-sheets`); `testing.ts` and `playwright.ts` have been on `develop` ever since. The claim stood unchallenged for ten days, which is the same failure `docs/learnings/decisions-need-tests-101.md` was written about, in the same file that documents it**" — contradicted by `cad21c1` sitting in `develop`'s own history since the day before this round started. This round's own opening framing ("gathered ahead of the port") was written from that same stale status and is wrong for the same reason; left in `reference/cheatsheet-sources.md` with a correction appended rather than rewritten, since fixing a stale record silently repeats the mistake being named. **Still unclaimed:** naming conventions in `coding-standards`, `sql-reference`/`api-reference`, the five language sheets, `containers`. Three gathered images sit unclaimed too, for other sheets entirely — `6-GoldenRulesCleanCode.jpeg` (likely `clean-code`), `JWT.png` and `reverse-proxy.jpg` (neither testing-related) |
| 2026-08-28 | W-6.3f | **`clean-code` gains a second section, four more principles (SOC, DYC, TDD, YAGNI) from a second gathered source — "6 Golden Rules to Write Clean Code" by Neo Kim, at the user's direction.** Consulted, not displayed as a second plate (D-89): the sheet keeps its original image, and Neo Kim's is credited in the new section's own note. Its other two rules, DRY and KISS, are the same ideas as the sheet's existing "Avoid duplicates" and "Keep it simple" rows and were not re-added. Two cross-references tie the new rows to sheets already in the registry instead of repeating them: SOC points at `solid-principles`' Single Responsibility Principle, and TDD quotes this repo's own iron law verbatim from `CLAUDE.md` and points at the new `testing` sheet | No image conversion needed — the source is consulted-only, so nothing is displayed and nothing sits unreferenced for `public-assets.test.ts` to catch, the exact class of bug W-6.3e tripped twice. Gate: lint 0, typecheck 0, **754/100** (unchanged — no new field, no new test needed), build clean, audit **18/18**, `reference/cheatsheets.md` regenerated | **Deferred:** unchanged from W-6.3a/e — naming conventions, `sql-reference`/`api-reference`, the five language sheets, `containers`, and the two remaining unclaimed images (`JWT.png`, `reverse-proxy.jpg`) |
| 2026-08-28 | W-3.7 | **Stage 07 is interactive.** `docs/07-code-review.md` (196 lines, expanded to 251 after doc corrections) is ported to `web/src/features/code-review/` as **six steps**, taking **W-3 to 7/18**. Eight tasks against `docs/superpowers/plans/2026-08-28-stage-07-code-review.md`: a doc-correction task writing `### AI in code review` (D-35 mandate) and `### Comment with severity` (P-6 review conventions), then a scaffold task (step IDs, doc-source, four glossary terms, four outward references), then five independent panel tasks, then assembly. **Three scored exercises**: SelfReviewMatch (three self-review techniques matched to the cognitive biases they defeat — confirmation, tunnel vision, curse of knowledge), **ReviewDrill** (the stage's signature — six code snippets with planted issues, the reader classifies each by checklist category: authorization, edge case, cleanup, naming, scope, test quality), and **SeverityDrill** (five review comments classified by Critical/Important/Minor/Nit, teaching the P-6 severity conventions interactively). Standard patterns: AIPlays (**nine plays** — five workflow plays covering AI as first pass, checklist items, human judgment, heightened scrutiny, self-review distance; plus four concrete tool plays added post-merge: `/code-review` with five effort levels, `/security-review`, `/code-review ultra` for multi-agent deep review, and PR review bots — CodeRabbit, Copilot, Greptile), CodeReviewChecklist (six definition-of-done items with persisted checkboxes, three artifacts, two team notes), eight trap callouts. Four glossary terms: rubber-stamping, provenance, finding-severity, self-review. Four outward references: SmartBear/Cisco "Best Practices for Code Review", Google Engineering Practices "How to do a code review", Conventional Comments, Bacchelli & Bird "Expectations, Outcomes, and Challenges of Modern Code Review" (ICSE 2013). **The final whole-branch review (opus) caught one Important finding**: dead CSS classes `border-rule` and `bg-surface-sunken` do not exist in the Tailwind v4 theme — the correct tokens are `border-line` and `bg-sunken`. Eight instances across three drill components, none caught by any per-task review or the e2e audit (the audit checks contrast and overflow, not token validity). Fixed in commit `9894833`. **The assembly task's own e2e run caught three defects before the final review**: sub-44px touch targets on radio buttons in all three drills (fixed with `min-h-11 lg:min-h-9`), the `what-to-find` panel at 4.5 screens against the D-52 4.0 cap (the 11-item checklist moved behind a `details`/`summary` disclosure, bringing it to 4.0), and the TD-12 placeholder test repointed from `07-code-review` to `08-security-audit` | **9 commits** `582d0b4`…`9894833` on `feat/stage-07-code-review`, cut from `develop` at `72fafb6`; 46 files, **+2956/−9**. Tests **754/100 → 854/117** (100 new tests across 17 new test files). One plan-authored ordering error surfaced and ruled on during execution: the plan's Task 2 prescribed registering `STEP_IDS_BY_SLUG` before the `STAGE_CONTENT` entry existed, which breaks `rails.test.tsx` — deferred to Task 8's assembly, where both registrations landed together. Full gate: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **854/117**, `pnpm build` clean (41 pages prerendered), `pnpm test:e2e` **18/18**. **Merged to `develop`, `--no-ff`, 2026-08-28, branch deleted** | **Coverage walk** — the mid-round context-starved walk prescribed by the spec has not run yet. **`humanizer:humanizer`** over panel prose. **`test:dev-console`** — one run for the round, the only thing that sees React's dev-mode validation. **Live contrast/responsive/console verification passes.** **`code-review` reference cheatsheet** — the bounded W-6 round D-88 puts after a W-3 stage ships. **M1 (deferred):** `pr-template.ts` sets `language: 'yaml'` on a markdown PR description template in `AnnotatedArtifact` — the `Artifact` type's `language` union does not include `'markdown'`; add it or pick a less misleading existing value. **M2 (deferred):** three drill components render "0/0 right" before any selection, inconsistent with `TriageDrill`'s `answered > 0` guard from stage 06 — three implementers independently took the same shortcut to satisfy an aria-live render test, creating a visible UX inconsistency |
| 2026-09-01 | W-6.3g | **`code-review` cheatsheet shipped** — twelfth drawn sheet, tethered to stage 07. Four sections: review process (five steps), five review axes, severity labels (Critical→FYI), change sizing. Source plate: Addy Osmani's "Code Review and Quality". Twelve of seventeen registered sheets now drawn; five language sheets remain | Committed to `develop` as part of the pre-stage-12 round | **Five language sheets remain** (`javascript`, `python`, `java`, `spring-boot`, `express`). **`sdlc` is untethered.** |
| 2026-09-01 | Coverage walk | **Stage 12 coverage walk returned six drops, three fixed.** Context-starved opus walker given only `docs/12-staging.md` and `web/src/features/staging/` (no plan, spec, or reports). Thirteen of seventeen doc sections fully covered, four partially covered, zero missing entirely. **Fixed:** (1) migration-during-build directive and Vercel settings path restored, (2) build command placement ("Settings → General → Build & Development"), (3) CI wiring for E2E against preview URLs — `repository_dispatch` event, `client_payload.url`, `x-vercel-protection-bypass` header, `VERCEL_AUTOMATION_BYPASS_SECRET` — added as a Callout below the checklist in the Done section. **Skipped:** Marketplace install path (one-time setup, covered by Neon reference link), "seed hostile" bridging imperative (redundant with annotated artifact context). **Deferred:** "Named tools, so this is actionable" summary sentence (tools distributed across plays, consistent with stage 07) | `fix/stage-12-coverage-walk` merged to `develop` `--no-ff`, branch deleted. Gate: 924/129, lint/typecheck clean | **`humanizer:humanizer`** over panel prose not yet run separately |
| 2026-09-01 | W-6.3h | **`deployment-environments` cheatsheet shipped** — thirteenth drawn sheet, tethered to stage 12. Two sections: six environments (local, preview, QA, test, staging, production) each with `what` and `when`; a seven-dimension preview-vs-staging comparison (isolation, lifecycle, who tests, feedback speed, cost model, confidence, what breaks when it fails). No source plate image — the structured table is the reference. Primary source: Northflank's environment comparison; preview-vs-staging dimensions drawn from Autonoma's staging-vs-preview analysis. Filed under the Standards cheatsheet group alongside `testing`, `playwright`, `sdlc`, and `code-review` | Committed to `develop` as `ddf645b`, merged `--no-ff`. Gate: 924/129, lint/typecheck/build clean. `reference/cheatsheets.md` regenerated. Thirteen of eighteen registered sheets now drawn | **Five language sheets remain** (`javascript`, `python`, `java`, `spring-boot`, `express`). **`sdlc` is untethered.** No source image — if a strong deployment-pipeline infographic surfaces later, it can be added without changing the sheet's content |
| 2026-09-01 | W-3.8 | **Stage 12 is interactive.** `docs/12-staging.md` (232 lines after a doc-correction phase that took it from 169) is ported to `web/src/features/staging/` as **six steps**, taking **W-3 to 8/18**. Eight tasks against `docs/superpowers/plans/2026-09-01-stage-12-staging-port.md`: six data/component tasks, then assembly, then verification. **The doc correction phase preceded the port**: `### AI in staging` (D-35 mandate, four concrete tool plays), `### Environment variables for previews` (Vercel per-environment scoping), Neon integration details replacing a comment-only code block, and an expanded E2E Definition of Done item with the `BASE_URL` command pattern and `repository_dispatch` CI wiring. Also fixed `07-code-review` missing from `AI_SECTION_STAGES` (pre-existing oversight from the stage 07 round). **One scored exercise**: PreviewOrStaging (five scenarios, binary preview/staging choice, scored 0–5, M2 guard: score renders only after first pick). **One annotated artifact**: the hostile seed data block from the doc, seven lines, four annotated, one pivot. **One figure**: Neon branching lifecycle (five nodes: push → branch → migrate → serve → cleanup). **RevealList for the preview checklist** (four categories matching the doc's bold headings). Standard patterns: AIPlays (four tool plays — browser-driven preview walk, smoke suite via `BASE_URL`, hostile seed generation, env var diff), StagingChecklist (six DoD items with persisted checkboxes, four artifacts, four team notes from "Scaling to a team"), six trap callouts. Three glossary terms: staging-environment, database-branching, deployment-protection (`preview-deployment` already existed). Three outward references: Vercel Preview Deployments, Neon Database Branching, Vercel Deployment Protection (all URLs verified live — the three brief-supplied URLs had redirected since the spec was written; implementer caught this and used resolved canonical URLs). **The final whole-branch review (opus) returned Ready to merge with no Critical and no Important findings.** Two deferred minors addressed before merge: M1 (InlineCode wrapping backtick-free trap bodies — a JSX comment added explaining the passthrough), M2 (e2e DoD label expanded to include the `BASE_URL` command pattern, matching the doc). **The implementer found and fixed a real JSX whitespace bug** during assembly: `<Term>…</Term> is` rendered with a missing space under the project's Prettier+SWC combination — restructured both sentences so only punctuation follows `</Term>`, confirmed stable via prerendered HTML inspection. **One plan correction surfaced during execution**: the spec said 5 traps, the doc has 6 — corrected in Task 2. Three reference URLs redirected since the spec was written — all caught by the implementer via live verification (per the pre-flight ruling) and updated to canonical locations | **8 commits** `ee2e54d`…`b29087b` on `feat/stage-12-staging`, cut from `develop` at `93b3c50`; 30 files, **+1627/−1**. Tests **857/117 → 924/129** (67 new tests across 12 new test files). Full gate: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **924/129**, `pnpm build` clean (stage 12 prerendered), `pnpm test:e2e` **18/18** (first run: 8 failed on stale server `ERR_CONNECTION_REFUSED`, re-run: 18/18 clean), `pnpm test:dev-console` **1/1**. Panel measurement: all six under 4.0 screens (max 2245px traps panel against 3072px ceiling). **Merged to `develop`, `--no-ff`, branch deleted** | ~~**Coverage walk**~~ ✓ run 2026-09-01: six drops found, three fixed (migration directive, build command placement, CI wiring for E2E), two skipped (Marketplace install path — redundant; "seed hostile" imperative — redundant with annotated artifact), one deferred ("Named tools" summary — tools distributed across plays, consistent with stage 07). **`humanizer:humanizer`** over panel prose — the doc correction's new sections passed humanizer (em dashes kept as house voice); the panel prose itself has not been separately run. **Next W-3 stage not yet chosen.** |
| 2026-09-02 | W-3.9 | **Stage 13 is interactive.** `docs/13-production-deployment.md` (245 lines after a doc-correction phase that added `### AI in production deployment`) is ported to `web/src/features/production-deployment/` as **six steps**, taking **W-3 to 9/18**. Four tasks against `docs/superpowers/plans/2026-09-02-stage-13-interactive-port.md`: data scaffolding, AI plays, migration artifact + checklist, then assembly. **The doc correction phase preceded the port**: `### AI in production deployment` (D-35 mandate, four concrete tool plays — generate expand/migrate/contract SQL, dry-run migration against preview database, verify skew protection headers, rehearse rollback on a preview deployment). Stage added to `AI_SECTION_STAGES` in `stage-metadata.test.ts`. **One annotated artifact**: the expand/migrate/contract SQL sequence (three deploys to rename a column), eight lines, three annotated, one pivot on the irreversible `DROP COLUMN`. `'sql'` added to the `Artifact.language` union type (additive, no breakage). **RevealList for safety nets** (two rows: skew protection, feature flags). Standard patterns: AIPlays (four tool plays — generate migrations, dry-run, verify skew, rehearse rollback), DeploymentChecklist (five DoD items with persisted checkboxes, five artifacts, four team notes from "Scaling to a team"), eight trap callouts. Four outward references: Vercel Instant Rollback, Vercel Skew Protection, Prisma Expand and Contract Pattern, AWS Deployment Strategies (all URLs verified during the reference research phase). **The final whole-branch review (opus) returned Ready with fixes — two blocking, two minor.** I1: missing `DeploymentChecklist.test.tsx` render test (every sibling stage's checklist has one). I2: missing `AIPlays.test.tsx` render test; the ledger's deferral justification ("consistent with staging pattern") was factually wrong — staging DOES have `AIPlays.test.tsx`. Both fixed in one fix round (`b554ea6`), scoped re-review confirmed both ADDRESSED with no new breakage. M1 (deferred): TEAM note titles paraphrase rather than match doc bold leads — reasonable UI labels, non-blocking. M2 (deferred): `'mcp'` kind defined in KIND_LABEL but unused — forward-compatible. **One plan defect caught by TDD**: the brief's regex `^\*\*.+?\*\*` for matching team-note bold leads doesn't match the doc's actual `- **Lead.** ...` format — implementer fixed to `^- \*\*.+?\*\*`, verified against raw doc bytes; plan-authored error, not implementer error. **User feedback after merge**: stage is too Vercel-focused, wants deeper AWS coverage (blue/green, canary, CodeDeploy, ECS). Design approved for a follow-up round restructuring into platform-agnostic + platform-specific steps (Vercel / AWS). Not blocking this merge | **7 commits** `b6bf797`…`b554ea6` on `docs/2026-09-02-stage-13-doc-correction`, cut from `develop` at `7784b13`; 26 files, **+2690/−2**. Tests **925/130 → 974/138** (49 new tests across 21 new files). Full gate: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **974/138**, `pnpm build` clean (stage 13 prerendered), `pnpm test:e2e` **17/18** (1 pre-existing failure on `/reference/deployment-environments` at 320px — 2px overflow, unrelated to stage 13), `pnpm test:dev-console` **1/1**. **Merged to `develop`, `--no-ff`, branch deleted** | ~~**AWS deployment content expansion**~~ ✓ done 2026-09-03 as W-3.9b (8 steps, coverage walk ran, all verification green). ~~**Coverage walk**~~ ✓ ran as part of W-3.9b verification. ~~**Humanizer**~~ ✓ clean. **M1**: TEAM note titles paraphrase doc bold leads — unchanged, non-blocking. **Pre-existing e2e failure**: `/reference/deployment-environments` overflows by 2px at 320px — unrelated |
| 2026-09-03 | W-6.3i | **`aws-deployment` cheatsheet shipped** — fourteenth drawn sheet, tethered to stage 13. Three sections: ECS deployment strategies (five predefined configs with when-to-use guidance), GitHub Actions → ECS pipeline (six steps with action versions and OIDC), costs Vercel hides (six rows with monthly ranges and what Vercel includes). No source plate image — content original to this playbook's stage 13 AWS expansion. Filed under the Standards cheatsheet group alongside `deployment-environments`, `code-review`, `testing`, `playwright`, and `sdlc` | Committed to `develop` as `f6c89f9`, merged `--no-ff`. Gate: 1004/140, lint/typecheck/build clean. `reference/cheatsheets.md` regenerated. Fourteen of eighteen registered sheets now drawn | **Four language sheets remain** (`javascript`, `python`, `java`, `spring-boot`, `express` — `express` not `containers`). **`sdlc` is untethered** |
| 2026-09-03 | Coverage fixes | **Stage 13 coverage walk fix wave.** Three blocking findings from the first-ever coverage walk on stage 13, plus two panel-height failures from the e2e audit. **B-1: AWS rollback section added.** `#### Rollback on AWS` was entirely missing from the interactive app. Three rollback paths (rolling update manual + circuit breaker, blue/green bake-time revert, CodeDeploy stop-deployment), two CLI command blocks, and a cross-platform "roll back first" callout. Added in a new `aws-ops` panel, splitting the old `aws` panel into `aws` (pipeline + rolling + blue/green) and `aws-ops` (rollback + costs). Steps 7→8. **B-2: CloudWatch alarm integration added.** The canary/linear section now teaches that up to ten CloudWatch alarms gate the traffic shift, with automatic revert on alarm. **B-3: Feature flags code block fixed.** The app showed `get('new-dashboard')` (simple key-value lookup); the doc shows `isEnabled(flag, userId?)` with allowlist-based per-user targeting. Fixed to match. **Panel heights fixed:** `aws` split resolves 4.0-screen overage; traps compressed with AWS-specific traps behind a `<details>` disclosure resolves 4.2-screen overage | **1 commit** `5644ab5` on `fix/stage-13-coverage-fixes`, cut from `develop`; 4 files, **+110/−13**. Tests **1002/140 → 1003/140**. Full gate: `pnpm test` **1003/140**, `pnpm build` clean, `pnpm lint` clean, `pnpm test:e2e` **17/18** (pre-existing only), `pnpm test:dev-console` **1/1**. Humanizer: clean. **Merged to `develop`, `--no-ff`, branch deleted** | **12 non-blocking coverage findings** recorded in `.superpowers/sdd/2026-09-02-stage-13-aws-expansion/coverage-walk.md`. Mostly detail compressions: TypeScript backfill loop summarized not reproduced (N-1), `pnpm drizzle-kit migrate` command omitted (N-2), ECS-native blue/green JSON config not shown (N-3), blue/green and canary/linear detail compressed (N-4, N-5), AWS intro paragraph omitted (N-6), DoD parenthetical guidance dropped (N-7), stage 14 cross-link dropped (N-8), costs total row in prose not table (N-9), team note titles rephrased (N-10, pre-existing M1 from W-3.9), rolling 50% scenario omitted (N-11), "enable for yourself first" now grounded by isEnabled code (N-12, closed by B-3 fix). **Pre-existing e2e**: `/reference/deployment-environments` 320px |
| 2026-09-03 | W-3.9b | **Stage 13 AWS expansion.** Restructured from 6 Vercel-only steps to **7 platform-aware steps** (deploys, migrations, vercel, aws, flags, ai, traps). Doc expanded from 245 to ~430 lines with six AWS subsections: pipeline (GitHub Actions OIDC → ECR → ECS), rolling updates (`minimumHealthyPercent`/`maximumPercent`, deployment circuit breaker), blue/green (ECS-native recommended, CodeDeploy alternative), canary/linear (CloudWatch alarm gates, five predefined configs), rollback (three paths by deployment type), and costs Vercel hides ($85–204/month for a small app — ALB, NAT Gateway, Fargate, data transfer, CloudWatch, ECR). **Interactive port restructure**: old `safety` (skew protection + feature flags) split into `vercel` (skew + rollback CLI) and `flags` (platform-agnostic). New `aws` panel with **pipeline annotated artifact** (GitHub Actions OIDC → ECR → ECS workflow YAML, four annotated lines, one pivot on `wait-for-service-stability`), AWS costs comparison table (six rows), deployment strategies table (five configs), rolling update config JSON card, and NAT Gateway warning callout. AI plays 4→8 (four AWS plays: generate task def, validate config, generate workflow, audit alarms — all `kind: 'prompt'`). Traps 8→12 (four AWS traps: health check grace period, NAT Gateway without VPC endpoints, min/max deadlock, deploying without `wait-for-service-stability`). DoD 5→6 (deployment strategy matches service risk profile). Three new glossary terms (`blue-green-deployment`, `rolling-deployment`, `deployment-circuit-breaker`). One new reference (Amazon ECS Deployment Strategies, total now 5 at cap). **Research pass preceded the implementation**: four parallel agents verified current AWS docs — ECS deployment strategies, CodeDeploy/AppSpec, AWS pricing, GitHub Actions workflow. Key finding: ECS now has native blue/green/canary/linear strategies without CodeDeploy — recommended over the older approach. **Final whole-branch review (opus) returned Ready with fixes — one Important blocking, three Minor.** I1: blue/green prose said "through CodeDeploy" but doc teaches two paths with ECS-native recommended — fixed in `6f68c05`. M1 (deferred): AWS rollback commands from doc not in interactive component — plan-authored gap, doc teaches it, principle in Vercel panel. M2 (resolved): terms.ts ordering is topic-grouped not alphabetical — file convention. M3 (pre-existing): RevealList import in AIPlays.tsx correct and in use. **One plan defect caught during execution**: brief's trap title lacked backticks present in doc bold-lead — implementer corrected it, reviewer confirmed | **9 commits** `7ca0db7`…`6f68c05` on `docs/2026-09-02-stage-13-aws-expansion`, cut from `develop` at `ade29c4`; 19 files, **+906/−126**. Tests **974/138 → 1002/140** (28 new tests across 2 new test files, updates across 5 existing test files). Full gate on merged result: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **1002/140**, `pnpm build` clean (stage 13 prerendered). **Merged to `develop`, `--no-ff`** | ~~**Coverage walk**~~ ✓ run 2026-09-03: 15 findings (3 blocking, 12 non-blocking), all 3 blocking fixed in `fix/stage-13-coverage-fixes`. ~~**Panel measurement**~~ ✓ `aws` at 4.0, `traps` at 4.2 — both fixed (aws split into aws+aws-ops, traps compressed with details disclosure). ~~**`pnpm test:e2e`**~~ ✓ 17/18 (1 pre-existing on `/reference/deployment-environments`). ~~**`pnpm test:dev-console`**~~ ✓ 1/1. ~~**Humanizer**~~ ✓ clean, no changes (em dashes are house voice). **Pre-existing e2e failure**: `/reference/deployment-environments` overflows by 2px at 320px — unrelated |
| 2026-09-04 | W-3.10 | **Stage 14 is interactive.** `docs/14-post-deployment-verification.md` (343 lines after a doc-correction phase that expanded it from 176) is ported to `web/src/features/post-deployment-verification/` as **six steps**, taking **W-3 to 10/18**. **The doc correction phase preceded the port**: expanded from 176 to 343 lines with AWS ECS verification content (six-command verification sequence, CloudWatch deployment alarms, bake time), `### AI in post-deployment verification` (D-35 mandate, four tool plays: generate smoke suite from manual checklist, parse Sentry/CloudWatch for anomaly patterns, run ten-minute check via MCP, compare CloudWatch metrics to baseline), platform-aware structure (Vercel + AWS sections), four common failure patterns (env var misconfiguration, partial migrations, cold caches, wrong feature flag defaults), three AWS-specific traps, three AWS DoD items, and five verified references. **Interactive port**: six steps — verify (ten-minute check as RevealList with five time blocks), vercel (four tools as RevealList), aws (six-command annotated bash artifact, pivot on `describe-target-health`), recovery (rollback-first + four failure patterns as RevealList + half-hour follow-up), ai (four plays), done (11 traps with 8+3 details disclosure + 11-item DoD checklist + 5 references). Standard patterns: AIPlays (four tool plays), VerificationChecklist (11 DoD items with persisted checkboxes, 3 artifacts, 4 team notes), 11 trap callouts (8 general + 3 AWS in details disclosure). Three glossary terms (`baseline`, `bake-time`, `deployment-alarm`; `smoke-test` already existed). Five references (AltexSoft smoke testing, PingSLA monitoring checklist, AWS CloudWatch deployment alarms, AWS ECS describe-services CLI, AWS re:Post health check troubleshooting). **Four per-task reviews returned Approved with no blocking findings.** Final whole-branch review (opus) returned **Ready to merge** with three Minor findings (all deferred): missing stage 16 cross-link in recovery step (stage 16 not interactive), "Why this stage exists" paragraph not rendered (editorial, blurb covers it), spec tree diagram said 10 traps but code correctly implements 11 (spec typo). **No rulings needed** — all four task reviews came back clean | **7 commits** `accffeb`…`7fc17fd` on `docs/2026-09-04-stage-14-doc-correction`, cut from `develop` at `44ceca5`; 28 files, **+3068/−1**. Tests **1004/140 → 1064/149** (60 new tests across 10 new test files). Full gate on merged result: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **1064/149**, `pnpm build` clean (stage 14 prerendered). `pnpm test:e2e` **17/18** (1 pre-existing on `/reference/deployment-environments`). `pnpm test:dev-console` **1/1**. Humanizer: clean (one aphorism fix applied in doc correction, em dashes house voice). **Merged to `develop`, `--no-ff`, branch deleted** | ~~**Coverage walk**~~ not yet run. **Pre-existing e2e failure**: `/reference/deployment-environments` overflows by 2px at 320px — unrelated. **Final review M1**: missing stage 16 cross-link — stage 16 not interactive yet. **Final review M2**: "Why this stage exists" motivational paragraph not rendered — editorial choice |
| 2026-09-04 | W-6.3j | **`post-deploy-verification` cheatsheet shipped** — fifteenth drawn sheet, tethered to stage 14. Three sections: the ten-minute checklist (five time blocks with what-to-check and when-to-worry guidance), Vercel verification (four tools: `pnpm test:prod`, Vercel Analytics, `VERCEL_DEPLOYMENT_ID` for Sentry filtering, deployment URL), AWS ECS verification (six commands in order: `wait services-stable`, `describe-services` deployments, `describe-target-health`, `describe-services` events, `describe-tasks` containers, `aws logs tail`). Source plate: AltexSoft smoke vs. sanity vs. regression testing comparison table. Filed under Standards alongside `aws-deployment`, `deployment-environments`, `code-review`, `testing`, `playwright`, and `sdlc` | Committed to `develop`, merged `--no-ff`. Gate: 1064/149, lint/typecheck/build clean. `reference/cheatsheets.md` regenerated. Fifteen of twenty registered sheets now drawn | **Five language sheets remain** (`javascript`, `python`, `java`, `spring-boot`, `express`). **`sdlc` is untethered** |
| 2026-09-04 | W-6.3k | **`git-cheatsheet` foundations sheet shipped** — sixteenth drawn sheet, tethered to stage 04. Nine sections transcribed from a gathered infographic: start a repo (init, clone), check changes (status, diff), stage and commit (add, commit, log), branches (branch, switch, switch -c, branch -d), sync with remote (fetch, pull, push, push -u), merge and rebase (with this-project-uses-merge note), undo changes (restore, restore --staged, revert, reset --soft, --hard warning), tags (tag, tag v1.0.0, push origin), and the four-area Git model (working directory, staging area, local repo, remote repo). Placed before `git-commands` so the Git group reads foundations first. Source plate: "Git Cheat Sheet — Essential Commands Every Developer Should Know" (author unrecorded). Filed under Git alongside `git-commands` and `git-branching` | Committed to `develop` as `5e46cf7`, merged `--no-ff`. Gate: 1064/149, lint/typecheck/build clean. `reference/cheatsheets.md` regenerated. Sixteen of twenty registered sheets now drawn | **Four language sheets remain** (`javascript`, `python`, `java`, `spring-boot`, `express`) |
| 2026-09-07 | W-6.3l | **`github-actions` cheatsheet shipped** — seventeenth drawn sheet, tethered to stage 11. Three sections: workflow syntax (seven triggers: push, pull_request, deployment_status, schedule, workflow_dispatch, jobs/steps, uses/run), common patterns (concurrency + cancel-in-progress, matrix strategy, conditional steps, artifact upload/download, cache, reusable workflows), secrets and permissions (secrets.* context, OIDC token exchange, permissions block, environment protection rules). No source plate image — content original to this playbook. Filed under Standards alongside `code-review`, `testing`, `playwright`, `deployment-environments`, `aws-deployment`, `post-deploy-verification`, and `sdlc` | Committed to `develop` as part of `feat/stage-11-ci-cd`, merged `--no-ff`. Gate: 1143/160, lint/typecheck/build clean. `reference/cheatsheets.md` regenerated. `web/src/lib/cheatsheets/index.test.ts` updated (isDrawn slug list + stage-tethering case). Seventeen of twenty-two registered sheets now drawn | **Five language sheets remain** (`javascript`, `python`, `java`, `spring-boot`, `express`). **`containers`** (Docker/Kubernetes, originally planned for stage 11) remains undrawn — `github-actions` shipped instead as a closer match to what stage 11 actually teaches |
| 2026-09-07 | W-3.11 | **Stage 11 is interactive.** `docs/11-ci-cd.md` (306 lines after doc correction that updated action versions @v4→@v7/@v6/@v7 and added `### AI in CI/CD`) is ported to `web/src/features/ci-cd/` as **eight steps**, taking **W-3 to 11/18**. Six tasks against `docs/superpowers/plans/2026-09-04-stage-11-ci-cd.md`: doc correction, scaffold + data modules, ordering exercise, AI plays, main component + assembly + terms + references, github-actions cheatsheet. **The doc correction phase preceded the port**: bumped `actions/checkout` @v4→@v7, `pnpm/action-setup` @v4→@v6, `actions/setup-node` @v4→@v7 across both CI and E2E workflow YAML blocks (aligning with stage 04's web app), and added `### AI in CI/CD` (D-35 mandate — trigger conditions, secrets boundaries, concurrency, Copilot Autofix, flakiness detection). **Signature piece: OrderingExercise** — a click-to-place guess-then-reveal where the reader arranges five CI steps (format, lint, typecheck, test, build) cheapest-failure-first, locks, and sees cost reasoning per step with a Contrast ("Build first: 2 min for a semicolon" vs "Format first: 3 seconds"). New interaction pattern — no prior stage has ranking. **Three annotated YAML artifacts**: ci.yml (concurrency, frozen-lockfile, timeout-minutes, node-version-file, cache — pivot on frozen-lockfile), e2e.yml (deployment_status trigger, Playwright install, BASE_URL, upload-artifact on failure — pivot on deployment_status), dependabot.yml (groups, open-pull-requests-limit — pivot on groups). **RevealList for branch protection** (four rows: status checks, up-to-date branches, linear history + auto-merge, secrets + OIDC, each with RevealFacet "what it prevents" / "the catch"). Callout warn for GitHub Free/private repo caveat. **RevealList for scaling** (five moves: approvals, split jobs, merge queue, remote cache, flakiness data — each with "trigger" and "why not sooner" facets). **AIPlays** (four plays: Copilot workflow draft, Copilot Autofix, `/code-review` on workflow changes, flakiness detection). **Nine traps** as individual Callouts (plan said 7, doc has 9 — two additional: unenforced branch protection, ungrouped Dependabot). TeamNotes in scaling step. References (GitHub Actions syntax, Vercel Git integration, Playwright CI, Dependabot grouping). Six glossary terms: branch-protection, concurrency-group, deployment-status, frozen-lockfile, merge-queue, oidc. **Final whole-branch review (opus) returned Ready to merge**: 0 Critical, 0 Important, 2 Minor. M1 (fixed): duplicate Contrast in ordering step spoiled the exercise — removed outer, kept inner post-lock version. M2 (deferred): concurrency-group and frozen-lockfile terms not wrappable as `<Term>` — they appear in data strings, not JSX. **Touch target fix**: ordering exercise buttons were ~36px, added `min-h-11` below lg — confirmed by e2e. **Coverage walk (opus)**: 14 sections checked, 0 gaps — all teaching content ported. Seven rulings made during execution (all documented in SDD ledger): traps count 7→9, reversed-order score fix, regex collision fix, backtick removal from play title, render test selector fix, Callout title prop addition, trap title rendering convention | **19 commits** `f5bdf95`…`2d45305` on `feat/stage-11-ci-cd`, cut from `develop` at `a898068`; 36 files, **+4383/−8**. Tests **1064/149 → 1143/160** (79 new tests across 11 new test files). Full gate on merged result: `pnpm lint` clean, `pnpm typecheck` clean, `pnpm test` **1143/160**, `pnpm build` clean (stage 11 prerendered). `pnpm test:e2e` **17/18** (1 pre-existing on `/reference/deployment-environments` at 320px). Coverage walk: 14/14 sections, 0 gaps. `reference/glossary.md` regenerated (+6 terms). `reference/cheatsheets.md` regenerated (+1 sheet). **Merged to `develop`, `--no-ff`, branch deleted** | ~~**Coverage walk**~~ ✓ 14 sections, 0 gaps. ~~**Touch targets**~~ ✓ fixed and verified. **`pnpm test:dev-console`** — not yet run this round. **Humanizer** — not yet run on panel prose. **Pre-existing e2e failure**: `/reference/deployment-environments` overflows by 2px at 320px — unrelated |
| 2026-09-07 | W-6.3m | **`ci-cd` cheatsheet shipped** — eighteenth drawn sheet, tethered to stage 11, and the **third concept/tool split** in the registry after `git-commands`/`git-branching` and `testing`/`playwright`. Four sections: integration vs continuous delivery vs continuous deployment (what each automates, and the human gate that separates the last two); the seven pipeline stages ordered cheapest-failure-first, each row carrying *what fails here* rather than only what runs; who plays each role (runner, build tool, quality gate, artifact registry, runtime target, provisioning, configuration management); and six practices. Built from **three** gathered graphics, one displayed and two consulted — the D-89 convention that D-90 superseded in premise but deliberately kept on file "for the next sheet that does draw on more than one graphic". This is that sheet, and the first to use it since D-90 was written. **Scope corrected before implementation**: the round opened intending to add two sections to `github-actions` instead, which would have filed Maven/Terraform/Ansible material under a tool-specific title and hung a Jenkins plate on a sheet named for GitHub Actions. `github-actions` gained two cross-references and no new sections. **Provenance**: `blog.bytebytego.com` is printed on the displayed plate, making this only the second sheet in the registry gathered with a real author and URL rather than *not recorded* (D-63) | RED-first: `index.test.ts`'s `isDrawn` slug list and its stage-11 tethering case were edited before the module existed and failed for the right reason (`- "ci-cd"` absent from both). **Teeth check ran twice** — removing `stage: '11-ci-cd'` failed the tethering test and only it (1 failed / 17 passed); typoing the plate `src` failed the on-disk test and only it (1 failed / 17 passed). Gate: lint 0, typecheck 0, **1152/160**, build clean (23 `/reference/*` routes, up from 22), audit **17/18**. **The one audit failure is the documented pre-existing `/reference/deployment-environments` 320px overflow — but that test throws at its first bad path, and `deployment-environments` sits *before* `ci-cd` in the registry, so the 320px sweep never reached the new page.** Verified independently with a throwaway spec: overflow 0 at all five widths, console clean, plate loads. The other four widths and the touch-target, contrast and console sweeps did cover it in the full run. Plate 1997K → 211K (89.4%, the largest saving in the ledger), read back at full size to confirm the small labels survive quality 82 | **Corrected a stale number rather than copying it**: W-6.3l's row cites `1143/160`, and `develop` measures `1152/160` on a clean worktree with nothing of this branch in it. The 1143 was already wrong when it was written; this branch adds no tests. **Deliberately left out of the sheet**: the DevOps source's Linux, Maven and AWS CLI command tables and its interview-questions block (study-guide material, and outside stage 11's domain), and the second source's deployment-strategy and environment-flow sections (already covered by `aws-deployment` and `deployment-environments`). **Not converted to webp**: both consulted graphics, so `public-assets.test.ts` has no orphan to catch — the trap W-6.3e tripped twice. **Still undrawn**: the five language sheets and `containers`. **Merged to `develop` as `6f52212`, `--no-ff`, 2026-09-07**, branch deleted, and the merged result re-gated first-hand: lint 0, typecheck 0, 1152/160, build clean, audit 18/18. **Merged without a whole-branch review, on the user's call** — every previous branch's review found something, so treat this round as less checked than usual. Not pushed; `main` untouched. `pnpm test:dev-console` did not run: a `next dev` server was already up on :3200, and Next refuses a second one for the same directory |
| 2026-09-07 | TD-45 | **The audit stopped reporting one failure and started reporting all of them — and the first fully green audit run followed.** Three sweeps asserted inside their path loop (overflow ×5 widths, touch targets, step-hash resolution: seven of eighteen tests), so the first bad path threw and the rest of the list was never loaded. `/reference/deployment-environments` overflows at 320px and sits at index 13 of `CHEATSHEETS`, so **the nine sheets behind it had never been measured at 320px** — including two added the same day, while the suite reported a steady "1 failed". All three now collect into `failures[]` and assert once, matching what contrast, console, disclosure and panel-height already did. Then the one real failure it was hiding was fixed: `<h1 class="t-display">` on `/reference/[slug]` measured 298px against a 272px box, because ENVIRONMENTS is one unbreakable word in Archivo at `wdth` 118 and `px-6` leaves 272px at 320px — `24 + 298 = 322`, exactly the reported 2px. `hyphens-auto break-words`, on that h1 only, since it renders `sheet.title` (data of unknown length) while `/reference`'s h1 is the literal "Cheatsheets" | **RED by planting**, the method TD-26 established: two synthetic overflows on `/reference/ci-cd` and `/reference/github-actions`, both behind `deployment-environments` in registry order. Fail-fast loop with three failures present reported **one**; accumulating loop reported **all three, by name**. Plant removed before the fix wave. The layout fix was diagnosed rather than guessed — the first probe looked for elements past the right edge and found **zero**, because the overflow was internal (`scrollWidth` 298 vs `clientWidth` 272 on the h1). **Teeth check**: reverting only the className and leaving the comment returned the identical `@ 320px by 2px`, on the 320px test alone, other four widths green; restored. Gate: lint 0, typecheck 0, **1152/160**, build clean, **audit 18/18 — the first fully green run**, where it had read 17/18 since the overflow appeared | **The entry's own prediction was wrong, and that is the result worth keeping.** TD-45 said fixing it "will likely surface more than the one failure visible today, which is the point." It surfaced nothing new: across five widths, 23 sheets and every stage step, that 2px was the only real overflow, and the nine never-measured sheets are all clean. The fix bought known-good rather than merely unreported, plus the guarantee a future one cannot hide. **TD-45's first draft was also wrong twice about the code it described** — it claimed the touch-target sweep already asserted after its loop (it did not; `expect(small, ...)` was inside it at `audit.spec.ts:132`) and miscounted "four sweeps" for three. Both corrected in the closed entry rather than left standing. **Deferred:** TD-44 (the untracked-originals contradiction) is untouched and still needs the user's call |
| 2026-09-07 | W-6.3n | **`ci-cd` expanded from four sections to seven, after the user pointed out the sheet did not use its two densest sources.** The round that drew it displayed one plate and consulted two others, then harvested the consulted pair for tool *names* and little else. **The sharpest miss was against the registry's own stated purpose**: `types.ts` says a sheet "answers 'what was that command again' in one screen", and `ci-cd` named Maven, Terraform, Ansible and kubectl across its roles section while giving the reader nothing to type. Three new sections, 24 rows → 49: **Commands worth knowing** (eleven rows in `code`, the field that renders mono and that `render.ts` backticks — `pnpm install --frozen-lockfile`, `mvn sonar:sonar`, `docker build -t app:$GIT_SHA`, `kubectl rollout status` and `undo`, `terraform plan -out` then `apply tfplan`, `ansible-playbook`), **Docker in the pipeline** (six rows: SHA tags over `latest`, multi-stage, layer order as cache strategy, `.dockerignore`, scanning the base image and not only the lockfile, and registry retention as a rollback constraint), and **Traps** (six rows, the convention every interactive stage already carries and this sheet lacked). Two "why" rows folded into the opening section, including what CI does *not* buy. Plate unchanged — `cheatsheet-sources.md`'s own capture rule calls dense small-type graphics "prompts for your own sheet, not things to reproduce", which is exactly what the 16-section source is | Two new tests, both teeth-checked. **`ci-cd teaches commands, and sets them in `code` rather than `term`` — RED first** with the honest message "ci-cd has no commands section: expected undefined to be defined"; teeth-checked by flipping one row's `code` to `term`, which failed that test alone and named the row ("Blocks until the rollout completes or times o…" has no code). **`every row names itself with a term or a code`** guards all 23 sheets against a blank left column, since both fields are optional on the type; it passed on arrival, so it was teeth-checked by deleting a row's `term`, which failed that test alone. Gate: lint 0, typecheck 0, **1154/160** (+2, both new), build clean, **audit 18/18** — the check that mattered, since eleven new mono command strings at 320px is exactly the overflow shape TD-45 had been hiding, and they are clean | **Kept as deliberate exclusions, unchanged from W-6.3m**: interview questions (study-guide material, the call `playwright` and `api-design` both made), the DevOps source's Linux and AWS CLI tables (outside stage 11), blue/green, canary and rolling (`aws-deployment`), dev→staging→prod (`deployment-environments`), and secrets handling (`github-actions`). **Deferred:** `containers` is still ungathered — all three CI/CD graphics touch Docker and Kubernetes, none is about them, so the new Docker section covers the pipeline's use of images and not the technology. TD-44 untouched. **Merged to `develop` as `4fdb9bd`, `--no-ff`, 2026-09-07**, branch deleted, merged result re-gated first-hand: lint 0, typecheck 0, 1154/160, build clean, audit 18/18. **Merged without a whole-branch review, on the user's call**, the third this session. Not pushed by this session; `main` untouched |
| 2026-09-07 | Coverage walk | **Stage 14's coverage walk finally ran — the one shipped stage that never had one — and returned seven findings, of which five survived triage as stated.** The walk was starved of context per the documented method: given only `docs/14-post-deployment-verification.md` and `web/src/features/post-deployment-verification/`, with the tracker, task.md, KICKOFF, `docs/superpowers/` and `docs/learnings/` forbidden by name. Coverage came back **12 of 16 doc sections fully represented**. **Fixed:** the escalation boundary to stage 16 (the doc draws a line — *suspicious* keeps you in 14, *broken* moves you to 16 — and the app dropped it, so a reader whose site was down learned to roll back and never learned an incident process exists); `--output table` missing from AWS command 2 while its note told the reader to read a table, so a pasted command printed JSON; the "two `PRIMARY` entries means an older deployment is still draining" failure reading; command 1's "check the events next" branch; the stage 13 cross-reference in the CloudWatch alarm section; the AI play tagged `mcp` and rendered "Browser tool" when the doc calls it "(A CLI + MCP command.)", now a new `cli-mcp` kind; and the four concrete examples from "Why this stage exists" | **Two findings were rejected or downgraded on verification rather than implemented, which is the point of checking review feedback.** Finding 1 was filed **Important** claiming the "Why this stage exists" content was absent and that grepping for "compiled" returned zero hits — **both false**: `traps.ts:11` is literally "The build compiled. That is all you know.", so the app carried the argument and was missing only its evidence. Downgraded to Minor and fixed at that size. Finding 7 wanted the epigraph's second half in `stage.blurb`; **premise rejected** — every blurb across the eighteen stages is one short sentence ("The loop you run dozens of times a day."), so that fix would have broken a system-wide convention to close a Minor gap. The content point folded into finding 1's fix instead. **Seven new tests, each RED before its fix.** One of them was **vacuous on arrival and caught before it shipped**: a check that command 1's timeout note points at the events searched every note and passed on command 4, which is *about* the events — rescoped to command 1's own note, at which point it failed correctly. Teeth-checked: removing the stage-16 link failed that test and only it (1 of 64); removing `--output table` likewise. Gate: lint 0, typecheck 0, **1161/160** (+7), build clean, audit **18/18** | **`Element.prototype.scrollIntoView` added to `src/test/setup.ts`** — jsdom implements no layout, and `Stepper` calls it on every step change, so *any* test that activates a panel other than the first threw from inside an effect. That is why `PostDeploymentVerification.test.tsx` had six tests and all six only inspected the rail. The file's own comment already states the rule this follows: a stub every panel test would otherwise repeat belongs there. It is the third arrival after `cleanup` and `ResizeObserver`. **Deferred:** nothing from this walk. **Still open:** TD-44, and stages 08–10 and 15–18 have no `### AI in <stage>` section, so every remaining port includes writing one. **Merged to `develop` as `a8f56de`, `--no-ff`, 2026-09-07**, branch deleted, merged result re-gated first-hand: lint 0, typecheck 0, 1161/160, build clean, audit 18/18. **Merged without a whole-branch review, on the user's call**, the fourth this session. Not pushed by this session; `main` untouched |

## Technical debt (closed)

Each entry is exactly as it stood when it was closed, including any correction of its
own first draft. Newest closure first, as in the live file.

### ~~TD-45~~ — The audit's sweeps fail fast, so one known failure blinds every path behind it · **CLOSED 2026-09-07**

`e2e/audit.spec.ts`'s overflow, touch-target and step-hash sweeps looped over
`auditPages(page)` and asserted **inside** the loop. The first failing path threw, and
every path after it was never loaded. The suite reported `1 failed`, which reads as one
broken page and was actually one broken page plus an unmeasured tail.

Three sweeps, seven of the eighteen tests: overflow (five, one per width), touch targets
(one), step-hash resolution (one). All three now collect into a `failures[]` and assert
once after the loop, which is what the contrast, console, disclosure and panel-height
sweeps already did.

**Two corrections to this entry's own first draft, which was wrong twice.** It said "the
touch-target sweep already accumulates into a `small[]` array and asserts after the loop"
— it does not; `small` was per-path and `expect(small, ...)` sat inside the loop at
`audit.spec.ts:132`, so it failed fast like the others. The sweep that actually modelled
the right pattern was **contrast**. It also said "the four sweeps that do not", which
miscounted: three sweeps, seven tests.

**RED/GREEN.** Two synthetic overflows were planted on `/reference/ci-cd` and
`/reference/github-actions`, both behind `/reference/deployment-environments` in registry
order. Fail-fast loop, three failures present: **one reported**. Accumulating loop, same
three present: **all three reported, by name**. Plant removed before the fix wave.

**The prediction in this entry's first draft was wrong, and the honest result is the more
useful one.** It said "fixing it will likely surface more than the one failure visible
today, which is the point." It surfaced nothing new. Across all five widths, all 23
sheets and every stage step, `/reference/deployment-environments @ 320px` was the only
real overflow — the nine sheets the 320px sweep had never reached are all clean. What the
fix bought is not a list of new bugs; it is that a future one cannot hide, and that the
nine unmeasured sheets are now known-good rather than merely unreported.

**The one real failure, diagnosed rather than guessed.** No element exceeded the right
edge, so the first probe found nothing; the overflow was internal. `<h1 class="t-display
mt-3 text-3xl">` measured `scrollWidth` 298 against `clientWidth` 272 — the title wraps,
but ENVIRONMENTS is a single unbreakable word 298px wide in Archivo at `wdth` 118, and
272px is all that `px-6` leaves at 320px. The title therefore reached `24 + 298 = 322`,
which is exactly the page's `scrollWidth` and exactly the 2px reported. Fixed with
`hyphens-auto break-words` on that h1 only: it renders `sheet.title`, which is data of
unknown length, while `/reference`'s h1 is the literal "Cheatsheets" and needs neither.
Hyphenation splits at a syllable (the document is `lang="en"`) rather than mid-word, and
neither utility fires unless a word genuinely cannot fit, so every other title is
visually untouched. Teeth-checked by reverting only the className and leaving the
comment: the same `@ 320px by 2px` failure returned, on the 320px test alone, and the
other four widths stayed green.

**Gate on the fixed suite: audit 18/18** — the first fully green audit run; it had read
17/18 since the deployment-environments overflow appeared. Plus lint 0, typecheck 0,
1152/160, build clean.

### ~~TD-44~~ — Two records said gathered originals are untracked; all of them are tracked · **CLOSED 2026-09-08**

`reference/cheatsheet-sources.md`'s **Filing** section said captures "are **not
committed** — the originals run 1–4MB each and git keeps every version forever", and
`docs/task.md`'s **W-6.2** entry said "Originals stay untracked and gitignored". Neither
was ever true. `git ls-files reference/` returns **65** entries including every gathered
original the ledger names, and `.gitignore` is six lines covering `.DS_Store` and
`.playwright-mcp/`.

**Closed in favour of the practice, not the record** — the user's call, offered as two
options with the trade-offs measured. Both paragraphs now describe tracking. What decided
it was that the rule's own justification does not apply here:

- **"Git keeps every version forever" is true in general and empty for these files.** A
  gathered capture is written once and never edited; every image under `reference/` has
  exactly one commit touching it. There is no accumulation to fear.
- **Ignoring them now reclaims nothing.** ~18MB of originals are already in history and
  stay there regardless of the index. `.git` measures 64MB before and after. Only a
  history rewrite recovers it, over commits already pushed to `origin/develop` — a
  destructive operation on shared history to recover disk already spent.
- **A ledger row has to resolve in a fresh clone.** The source table names files by
  filename; untracked, it names things that exist only on the gatherer's disk.

**A hazard the decision creates, and the fix for it, are recorded in the same paragraph.**
If `reference/` is committed by policy, anything parked there is one `git add -A` from a
public repository. Three unrelated files were sitting in it while this was decided — a
résumé PDF, a cover letter, and one ungathered capture — so the Filing section now says
plainly not to park unrelated files there. None of the three was committed.

### TD-1 — The playbook prescribes tooling the app does not use · **Closed 2026-07-23**

Resolved in ESLint's favour (D-22): Prettier added, Lefthook added, `stack.md` and
doc 04 amended, Biome documented as the non-Next alternative.

### TD-2 — Stage metadata duplicated · **Closed 2026-07-27**

~~Titles, blurbs, groups and cadence exist in both `docs/NN-*.md` and
`web/src/lib/stages.ts`, with nothing detecting the drift.~~ Closed, and narrowed on
inspection (D-36). Only the **title** is genuine duplication (identical across all 18);
`group`/`cadence`/`ready` are app-only, and the **blurb** turned out to be two
purpose-built strings — the doc's `>` subtitle vs `stages.ts`'s UI-tooltip `blurb` (its own
comment says so) — which diverge for 15 of 18 stages by design, like `timing` vs `cadence`.
`stage-metadata.test.ts` asserts each doc's H1 title equals `stages.ts` for all 18;
renaming one side without the other now fails a test. Detection, not generation — the docs
stay hand-written.

### TD-3 — Glossary duplicated · **Closed 2026-07-27**

~~`reference/glossary.md` and `web/src/lib/terms.ts` held two glossaries with different
coverage, shape, and audience, and could silently diverge.~~ Closed (D-36):
`terms.ts` is now canonical (the richer `{name, short, full, soWhat, see}` shape), the 16
doc-only architecture/ops terms migrated in, and `reference/glossary.md` is generated from
it as a vitest file snapshot (`renderGlossary()` + `toMatchFileSnapshot`, regenerated with
`pnpm gen:glossary`). The glossary grew 18→35 by design; a term now lives in exactly one
place, and drift fails a test.

### TD-4 — No tests · **Closed 2026-07-23**

13 vitest invariant tests over `stages.ts`/`terms.ts` (`e6dd51e`), teeth-checked.

### TD-5 — Verification is manual and uncommitted · **Closed 2026-07-23**

The audits are `web/e2e/audit.spec.ts` (`53fdfaf`), 9 tests run by CI against a
production build. On its first run the committed suite caught a case the ad-hoc
sweeps had masked (inline Term touch targets).

### TD-6 — No CI · **Closed 2026-07-23**

`.github/workflows/ci.yml` (`6c26784`): verify (format→lint→types→unit→build) then
audit. Branch protection remains a GitHub-side switch after push.

### TD-7 — `web/` is uncommitted · **Closed 2026-07-23**

~~The entire application is untracked, so none of the above is recoverable if the
working tree is lost.~~ Committed in `edb315b`; the app and all docs are now tracked on
`feat/playbook-web-app`.

### TD-8 — Playwright is a dependency with no committed usage · **Closed 2026-07-23**

Now `@playwright/test` with a committed suite; the dependency earns its place.

### TD-10 — CI is not yet enforced · **Closed 2026-07-24**

~~CI has never been observed running or failing.~~ **Half closed 2026-07-24.** CI ran on
push and went red on its first real run, catching a genuine bug no local check could see
(generated route types missing on a clean checkout — see the bug ledger). That is
stronger evidence than the planned deliberate break: the gate caught something real,
unprompted, on day one.

~~Remaining gap: branch protection is not on.~~ **Closed.** Enabling it surfaced a plan
constraint worth knowing: **GitHub Free enforces rulesets on public repositories only.**
On a private repo the ruleset saves but never fires, with only a banner to say so. The
repo was made public — it is a playbook with no secrets, and public repositories also get
unlimited Actions minutes, which matters because the audit job drives a browser.

Evidence, from the Actions history:

| Run | Commit | Result |
|---|---|---|
| CI #1 | `e7b3afd` | ❌ 35s — failed at typecheck |
| CI #2 | `cc5b4b0` | ❌ 35s — same failure |
| CI #3 | `e1fbdaa` | ✅ 2m12s — the typegen fix |
| CI #4 | `710cf49` | ✅ 1m54s |

The red runs failed in 35 seconds because the gate is ordered cheapest-first, so
typecheck fails long before the browser suite ever starts. That ordering paid for itself
on the first run.

### ~~TD-12~~ — The audit `PAGES` list is hand-maintained · **CLOSED 2026-08-14**

`web/e2e/audit.spec.ts` hard-codes each step hash to sweep (`#done`, `#cut`, …). Every new
`ready` stage must add its hashes by hand, and nothing fails if they drift from the stages
actually live — a stage could ship unaudited and the suite would still pass green. First
flagged as a W-4 minor; stage 02 added six hashes by hand, and **stage 03 added thirteen more
by hand** as its reshape ran, taking its own entries from nine to twenty-two (36 URLs now). Raised to Medium because it has now cost a manual step in every stage
build, and `KICKOFF.md` asserted the opposite — that the suite "sweeps every ready stage's
step hashes" — which is exactly the kind of trusted-but-false claim that lets a stage ship
unaudited. That line is corrected.

**Closes with:** derive `PAGES` from `STAGES.filter(s => s.ready)` crossed with each
stage's step ids, so the sweep tracks the ready set automatically.

**Closed 2026-08-14** by `fix/derive-audit-pages`. `e2e/audit-pages.ts` takes stages from
`STAGES.filter(s => s.ready)` — the same flag the router reads to decide whether a stage
renders content at all — and step ids from the rail each one renders, since `Stepper` emits
one tab per step as `id="tab-<stepId>"`. Neither source can fall behind the app.

Two things about the closure are worth keeping. **A ready stage that renders no rail throws
rather than contributing nothing**, because "live and broken" should fail rather than
disappear, which is the shape of the bug this debt described. And **the equivalence test
spells out all thirty-six URLs rather than recomputing them** from the source the
implementation reads — an expectation derived the same way as the thing it checks asserts
nothing, which is the defect class recorded seven times in Process observations.

**It also broke a tool and that is the more useful half.** `e2e/count-expandables.mjs`, added
during the `RevealList` round to make the 140/107 baseline obtainable, derived its URL list by
scraping `const PAGES = [` out of `audit.spec.ts`. Deleting that array broke it, and nothing
in the gate noticed: `pnpm test:e2e` went 16/16 with the script throwing on startup, because
the script is a tool nobody's suite runs. Found by running it. It now derives the same way,
duplicated rather than imported because it is plain `.mjs` and `audit-pages.ts` is TypeScript.

**What this does not close**, stated because the debt's own wording only covered one
direction: the sweep now follows what the app renders, so a step deleted by accident leaves
the sweep silently instead of failing it. Stage 03 guards that direction for itself — its
`Step[]` is typed against `STEP_IDS`, so an id that exists nowhere is a compile error — and
stages 01 and 02 have no equivalent. **TD-36**.

### ~~TD-28~~ — Stage 04's deploy section is wrong, and this repo proved it · **CLOSED 2026-08-13**

`docs/04-project-setup.md`'s **§8 Connect Vercel** reads:

> *"In project settings, confirm the Node version matches `.nvmrc`."*

Vercel does not read `.nvmrc`. Its Node version comes from the project setting, overridden by
`engines.node` in `package.json`. A reader following that sentence pins local and CI, believes
they have pinned the host, and has not — which is the exact drift `reference/stack.md:19` calls
"a recurring source of 'works locally' bugs".

Three more omissions in the same section, all of which broke this project's own first deploy
on 2026-08-11 before any of the advice in §8 became relevant:

- **`prepare` scripts fail on a build host.** pnpm runs `prepare` on every install,
  `lefthook install` exits 1 outside a git repository, and Vercel's build environment has no
  `.git`. The install step dies first. Husky has the identical failure for the identical
  reason, so this is not a lefthook footnote.
- **Root Directory** is unmentioned, and an app in a subdirectory does not build without it.
- **Framework Preset** is unmentioned. A project created against an empty repository guesses,
  and `Other`'s output directory is `public` — which produces an error naming a symptom two
  steps from its cause.

**Why it is High rather than Medium.** The stage docs are the product, this section is
advice a reader acts on, and acting on it costs a day. It is also the one stage this
repository can check against itself: `docs/learnings/deploying-101.md` is the corrected
version, written from what actually happened.

**Closes with:** the stage 04 round, which is scoped as a doc-correction phase *before* the
port rather than a port alone — see the Next up section.

---

**Closed 2026-08-13** by `fix/stage-04-doc-corrections`, 37 commits `859a1b8`…`1418c77`,
`docs/04-project-setup.md` 323 → 690 lines. All four defects above are fixed. So are
twenty-seven others.

**TD-28 named four, and all four sit in §8** — the Node sentence, `prepare` failing on a
build host, Root Directory, Framework Preset. Reading the same document to write the spec
found eight, and three of the extra four are outside that section: the Definition of done
restated the Node error as a checkbox, so correcting §8 alone left the page arguing with
itself; §1 framed `engines.node` as a pnpm guard and never said it is the file the host
reads; and there was no `### AI in …` subsection at all, which `stage-metadata.test.ts`
treats as a build blocker. The fourth is §6 never adding a `prepare` script, which TD-28
touched only by assuming one existed — its own bullet describes what happens to a script
the document never tells anybody to write.

Eight was not the end of it either. Each later instrument found defects the previous one
could not see:

| Instrument | Defects it found | Running total |
|---|---|---|
| Reading the doc, for the spec (`docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md`) | 8, TD-28's four among them | 8 |
| **Running** it — every executable block, in a scratch directory (`docs/verification/stage-04-doc-execution.md`) | 5 | 13 |
| A **cold reader** given the corrected doc and a task to finish (`docs/verification/cold-reader-stage-04-run1.md`) | 14, with 10 boundaries classified out and left alone | 27 |
| **Per-task reviews**, on things no inventory had named | 4 | **31** |

The four the reviews found are the ones worth naming, because nothing in the first three
passes was looking for them: §5 tells the reader to import `zod` and no section installs
it (a reader hits `TS2307` before the test gate is reached, and it stayed hidden because
Task 1's verifier had run `pnpm add zod` unprompted, so the scaffold was more complete than
the document all along); §4 prints a copy-pasteable `tsc --noEmit` that its own next
sentence disowns for Next.js readers; §3's `lint` script omits `--max-warnings 0` while
§3's prose says a warning "sails through both hooks and CI" without it; and §1 instructed
`"engines": { "node": ">=22 <23" }`, a range format Vercel does not document, in the single
field whose job is pinning the host — while this repository's own `web/package.json`, the
one that actually deploys, uses `"22.x"`.

Two more findings came out of the consultability run and are navigation rather than fact:
`### 8. Connect Vercel` stopped answering "which file controls my host's Node version"
once the true answer moved to §1, and §7 never pointed at the teeth check that proves a CI
gate can fail. The first was **caused by this round**, traced to `79460eb` against
`git show develop:`, and is recorded that way rather than filed as inherited.

The defects reach every numbered section, §1 through §10, with §4 the only one that needed
a reviewer to find its own. They also reach `## Artifacts` and `## Definition of done`, and
a subsection that did not exist until this round wrote it. `## Traps` gained an entry
rather than losing a defect, and `## Entry criteria` was read repeatedly and came out
unedited.

**Why the debt was scoped wrong, since that generalises.** TD-28 was raised by reading one
section, days after a deploy, by someone who knew exactly what to look for and found it.
That is the best case for reading, and it still came in at four of thirty-one. Reading
catches claims that are wrong. It does not catch a claim that was never true (the
`engines` warning), a gate wired to scripts nobody creates (§6, §7), or a step that is
simply absent, because absence has no sentence to read. Only running the document catches
the second, and only making somebody finish the task catches the third.

### ~~TD-27~~ — The second `pnpm test:e2e` of a session measures a stale build · **CLOSED 2026-08-20**

**Closed at `54111fd`** with the freshness assertion this entry preferred over the flag,
because the assertion also catches the `pnpm start` left running by hand that no flag can
see (**D-83**). `e2e/global-setup.ts` fails the run when the served page does not carry
`.next/BUILD_ID`, or when that build predates the newest app-source file.

Two things were established by running rather than reasoning, and both would have been
wrong the other way. Playwright starts `webServer` **before** `globalSetup`, probed with a
throwaway setup that only logged a status — had it run the other way, the fetch would fail
with a connection error indistinguishable from a stale server. And `import.meta.url` is
unavailable there: Playwright loads the file as CJS and the first version died on *Cannot
use 'import.meta' outside a module*. `config.configFile` is the shipped way in.

Both halves teeth-checked separately against genuinely stale servers. The identity half
named both ids: `R-IC6NrDTAsq6Q0bcXl6E` served against `NNfAfQftR2zBA2t1Le1bL` on disk.
It then fired unprompted, minutes later, on a real edit to `audit.spec.ts` — which
exposed a false positive, since a spec runs from source and needs no rebuild. Roots
narrowed to app source; a gate that cries wolf is one people learn to re-run past.

Opened 2026-08-03, during the doc-gaps round, and it invalidated that round's own verification
until it was found.

`web/playwright.config.ts` sets `reuseExistingServer: !process.env.CI` against a
`pnpm build && pnpm start -p 3100` command. The first run of a session builds and starts a
server; **every subsequent run reuses that server without rebuilding**. A session that runs the
suite after each of eight tasks measures the first task's build eight times.

This is not a bug in Playwright — it is the documented behaviour of that flag, and reusing a
server is what makes local iteration fast. The defect is that nothing says so at the point of
use, and the failure is silent and green: the suite passes, the numbers look plausible, and
they describe a tree that no longer exists.

**What it cost, measured.** A server had been up for 97 minutes. Panel weights read through it
against the true values once it was killed:

| Panel | Through the stale server | Actual |
|---|---|---|
| `model` | 3.7 | **4.0 — over threshold** |
| `schema` | 3.6 | **4.3 — over threshold** |
| `sketch` | 2.3 | 2.5 |
| `evolve` | 3.4 | 3.6 |
| `indexes` | 1.9 | 2.2 |

Two panels had been over D-52's limit for five tasks while the gate reported them passing. Both
were fixed once the numbers were real.

**How it was found**, which is the part worth keeping: not by the suite, but by probing whether
the built page actually contained the component that had just been added
(`"First normal form"` → `false`) while the panel test was green. The same move that found
TD-26 — check what the tool loaded, not what it reported.

**Closes with:** either `reuseExistingServer: false` locally, accepting a rebuild per run, or a
freshness assertion in the suite itself — read a build id or a known-new string and fail if the
served tree predates the working tree. The second is better, because it also catches the case
where someone left `pnpm start` running by hand.

**Related:** TD-26 is the same family — a gate green about something it never evaluated — and
between them they cost this branch two false verification claims. Neither was caught by a test;
both were caught by asking what the tool actually did.

### ~~TD-26~~ — The audit suite is green about surfaces it never evaluates · **CLOSED 2026-08-20**

**Closed at `874cd33` and `d78043e`**, across all four open items rather than the one the
`Closes with:` line names.

`openExpandables` opened everything it could in one pass and the checks measured the
result once. Two of the three remaining holes follow from that shape rather than from any
selector: a single-open group cannot be exhausted, because clicking one closes the last,
and `AuthPaths`' tabs are the same problem wearing `aria-selected`. `e2e/panel-states.ts`
yields one state per member instead, and contrast and touch targets run over each. The
container hole closed separately: the collector's `el.children.length` skip became "has a
direct non-empty text node", so a container with its own text is measured on its own
colour while one whose children all override theirs is still correctly skipped.

**The guard is a property, not the pinned count this entry asked for** (**D-82**), and the
plan's teeth check for it was wrong in this round's own subject: nulling the selector
empties the candidate set, so nothing is missing and the gap check passes having observed
nothing. A floor on what the sweep observed is what notices.

Numbers: expandables opened **191 → 198** over the same 64 URLs, and the +7 is exactly the
`aria-selected` controls the old `aria-expanded="false"` selector could not match —
`AuthPaths`' three on `#access` and **`Toolkit`'s four on `#research`, which this entry
never named**. Reproducing the pre-TD-26 sweep as a teeth check listed
`auth-panel-managed` and `auth-panel-library`, the two of three panels the entry said had
never been contrast-checked. The container fix was proved against a planted 1.11:1 pair
that passed before it and failed after, reported against the container's own text.
**Neither widening surfaced a real failure in either theme**, so both claims were true and
unearned rather than false — the same outcome the original `e058333` fix had.

Opened 2026-08-03 by the whole-branch review of `feat/stage-03-app-port`, which found the
contrast gate had been measuring **one surface per stage** since it was written. It opened
expandables by clicking every `button[aria-controls]`; `Stepper` puts `aria-controls` on all
22 rail tabs, so the loop walked the rail and unmounted the panel it was about to measure.
Measured on `#trace`: before, tab `03 Trace` with 11 expandables; after, tab `22 Traps` with
**0 expandables and 0 open**. Every one of the 36 audited URLs was checked on its stage's last
step with nothing expanded.

Fixed in `e058333` — the sweep went from **5 expandables and 717 colour pairs to 108 and 867**
across the 36 URLs, and surfaced no real failures in either theme, so the claim was true and
simply unearned. `2734fb4` then narrowed the touch-target exemption that fix had widened: it
had gone from `p` to `p, li`, exempting 880 elements to excuse one, including 74 accordion
controls and 67 exercise radios. Role could not separate them — `Term` is itself a disclosure —
so the check now asks whether the target sits among running text. Exempt went 152 → 14 over
five representative pages, re-gating 138, all of which pass.

**What is still open, and why this is an entry rather than a closed line.** Three further ways
the same suite can be green about something it never looked at, all found while fixing the
first:

- The contrast collector **skips any element that has element children**, so a colour set on a
  container is only ever measured through its leaves. A container-level failure with
  correctly-coloured children is invisible.
- `openExpandables` **cannot exhaust a single-open accordion group** — clicking one closes the
  last — leaving ~28 buttons closed across 36 pages, almost all in stages 01 and 02.
- `AuthPaths`' inner tabs use `aria-selected` rather than `aria-expanded`, so **two of its three
  auth panels are never contrast-checked**. Same class, different attribute.

**Why High.** "Contrast AA across every distinct pair, both themes, all steps" is this repo's
headline verification claim (`CLAUDE.md`), quoted in the tracker, in `KICKOFF.md` and in every
stage's completion evidence. A gate that lies is worse than no gate, because the claim gets
made on its behalf. The first instance shipped for three stages before anything caught it, and
what caught it was a reviewer reading the selector rather than the results.

**Closes with:** a test of the test — assert the sweep opens a known count of expandables on a
known page, so the next selector change that silently stops opening things fails rather than
passes quietly. Related: ~~**TD-17**~~ (closed 2026-08-04) was the reason this class had to
be caught in e2e at all.

### ~~TD-16~~ — Worksheet placeholder text fails AA, and the audit suite cannot see it · **CLOSED 2026-08-11**

All three worksheets — `discovery/Worksheet.tsx:161`, `planning/PlanWorksheet.tsx:179`,
`architecture/DomainWorksheet.tsx:165` — carry the identical class
`placeholder:text-subtle/70`. Measured against a production build by rasterizing the
composited colour rather than parsing it:

| Theme | Effective placeholder | Field background | Ratio | AA (4.5:1) |
|---|---|---|---|---|
| Light | `rgb(129,137,150)` | `rgb(230,228,220)` | **2.77:1** | fails |
| Dark | `rgb(109,125,145)` | `rgb(7,19,34)` | **4.44:1** | fails, narrowly |

17 fields, both themes, 34 samples, all below AA. Stage 03 copied the existing class
string, which was the right call for consistency — this is repo-wide and pre-dates the
branch, not drift introduced by it.

It matters more than typical placeholder text because **these placeholders carry the
worked example**: they show the reader what a good answer looks like. That is
instructional content sitting below the contrast floor.

**The more valuable half of this finding is why the gate never caught it.**
`audit.spec.ts:155` samples `el.textContent` and skips anything shorter than three
characters. A `placeholder` has no text node, so no placeholder in the app has ever been
checked. The suite is green and correct about what it looked at.

**Closes with:** raise the placeholder token to meet AA in both themes (light needs a real
change; dark is one nudge away), **and** extend the audit suite to sample
`getComputedStyle(el, '::placeholder')`. Fixing the colour without closing the blind spot
leaves the next one undetected. Note that `text-subtle/70` resolves to `oklab()`, which the
suite's parser deliberately skips — see `docs/learnings/contrast-checkers-lie.md` before
writing that assertion.

**Raised Medium → High during the stage 03 whole-branch review**, not because the failure
got worse but because its cost compounds: every stage that copies the worksheet's class
string — and all built so far have — inherits the same failing pixels, and the gate will
not object. Worth stating plainly rather than leaving it implied: **by the letter of
`CLAUDE.md`'s verification standard ("Contrast — every distinct text/background pair, both
themes, all steps, WCAG AA"), `feat/stage-03-architecture` does not clear its own gate.**
CI is green on this branch *because* `audit.spec.ts` samples `el.textContent` and a
`<textarea>` placeholder has no text node to sample — not because the contrast passes.
Shipping anyway was the right call (stages 01 and 02 already ship under the same blind
spot, so holding stage 03 alone to the letter of the standard would be arbitrary rather
than principled), but "CI is green" should not be read as "the gate cleared" for this class
of failure until the blind spot itself closes.

**CLOSED 2026-08-11.** Both halves, as this entry required. The class string dropped its
`/70`, and that alone clears AA — `--faint` had already been tuned to exactly **4.80:1** on
`--sunk` in light and sits at **7.93:1** in dark, so the token was never the problem; the
opacity at the call site was throwing away contrast that had been deliberately bought.

The blind spot was two bugs, not one. `audit.spec.ts` keyed off `el.textContent`, and an
empty `<textarea>` has none — so placeholders were never sampled. And its colour parser
*rejected* every `oklab()` value while a comment above it claimed to resolve oklab "via the
browser itself", so any alpha colour went unchecked rather than checked. Tailwind emits
oklab for every alpha modifier, which made the effective rule: add an opacity and leave the
audit.

Both are fixed by rasterising — paint the background, paint the colour over it, read the
pixel — which resolves any colour space and composites alpha in one step, and refuses to
guess when the browser rejects a colour rather than reporting the background as the
foreground. `docs/learnings/contrast-checkers-lie.md` had described this exact technique a
round earlier, including the snippet; the suite stayed blind anyway, which is worth
remembering about written-down knowledge.

The audit now reproduces this entry's hand-measured numbers independently: **2.77:1 light**
and **4.44:1 dark**, on all three worksheets, and nothing else on 36 pages fails in either
theme. **The verification standard's letter is now met** — the caveat above about
`feat/stage-03-architecture` not clearing its own gate no longer applies to any branch.

### ~~TD-17~~ — No component-test harness, so a class of regression is ungated · **CLOSED 2026-08-04**

vitest runs `environment: 'node'` and its include glob matches only `*.test.ts`, so nothing
in this repo can render a component and assert on the output. Every test is module-level.

What that leaves unguarded, using the case that surfaced it: `judgeInterrogation` returns
`why` on both correct and incorrect answers, and `scoring.test.ts` holds it to that. But
nothing held `ModelInterrogation` to actually *rendering* it. Gating that paragraph on
`correct` would have passed lint, typecheck, all 133 unit tests and the audit suite — while
hiding the reasoning from exactly the readers who got it wrong, which is the stage's whole
teaching claim. The same shape covers `fieldName()` in `SchemaInspector` (token parsing
with no unit test) and any future "the data is right but the component ignores it" defect.

An interim gate landed instead: `audit.spec.ts:234-260` drives the real page, commits a
knowingly wrong answer, confirms the wrongness via `getByText('Not quite')` *before*
asserting, then checks the reasoning paragraph is present, is not the headline, and is over
80 characters. That is one assertion covering one component. It does not generalize.

**Closes with:** jsdom or happy-dom plus `@testing-library/react`, a `*.test.tsx` include,
and the vitest environment split per-file. A config and dependency change, correctly out of
scope for a stage build — but it is now the cheapest remaining way to raise the floor,
because every stage from here adds components nothing can render-test.

**CLOSED 2026-08-04.** `vitest.config.ts` runs two projects — `unit` (node, `*.test.ts`) and
`dom` (jsdom, `*.test.tsx`) — so the file extension picks the environment and no per-file
docblock has to be remembered. That is the one correction to the sentence above: it predicted a
per-file split, and vitest 4 has since removed `environmentMatchGlobs`, which made `projects`
the mechanism and structure the better answer anyway. jsdom, `@testing-library/react` 16 and
`@testing-library/dom` 10 are dev dependencies; `jest-dom` and `@vitejs/plugin-react` were both
deliberately not added, and the spec records why.

Two render tests prove it, both aimed at this entry's own examples: the interrogation's
reasoning surviving a wrong answer, and `fieldName()` — which is module-private, so the render
is the only surface it has. Each was teeth-checked by injecting exactly the defect it exists to
catch, and each failed alone.

**The convention is the half that makes this closed rather than possible.** `web/PATTERNS.md`
now states which components get a render test, and `CLAUDE.md` carries it into the verification
expectations. A capability with no rule attached is what D-38 was, and D-52 had to replace it.

**Deferred:** no backfill across stage 03's other components, and the three Playwright
stand-ins at `e2e/audit.spec.ts:323`, `:360`, `:391` stay — deleting a real-browser check
because a jsdom one now exists is a trade with no evidence behind it yet.

### TD-15 — Stage 01's doc has no AI content; stage 02's now does · **Closed 2026-07-27**

~~Stage 02's markdown doc gained an `### AI in planning` subsection (D-34), but stage 01's
"AI plays" still lived only in the web app.~~ Closed: `docs/01-product-discovery.md` now
carries a `### AI in discovery` subsection porting its `AIWorkflow` plays to prose, so both
built stages carry AI in the doc as well as the app. Consistent with D-35 (AI plays is a
standard per-stage section).

### ~~TD-18~~ — `docs/03-architecture.md` has 14 beginner-completeness gaps, 3 blocking · **CLOSED 2026-07-29**

> **Closed by W-3.1** (`4afaec4`…`2e4162c`, 14 commits). Verified by a cold-reader re-run under
> the same constraints and the same shift-swap product as the original pass, so the numbers
> compare: **9 CLOSED · 3 PARTIAL (G1, G2, G8) · G9 open and correctly deferred · G5 closed but
> thin.** G2 was then closed by the fix wave. The reader ticked 13 of 17 Definition-of-done
> boxes on a first read, against an exit condition that was previously unsatisfiable.
>
> **G3 first, as TD-18 asked.** The three-pattern split shipped in commit one, and the re-run
> confirmed it with the doc's own example: "a manager approving a shift swap between two other
> people owns none of the three rows involved." The same defect turned out to live in
> `terms.ts` — `Authorization` was defined as ownership — which no entry had recorded and which
> a doc-only fix would have left authoritative in the glossary and the app's inline terms.
>
> **What the re-run found that this round had introduced**, all fixed in `7a5108f`: roles and
> tenancy had no DDL anywhere despite the stage citing the shift-swap product three times;
> idempotency was a DoD gate taught nowhere; the DoD's "Derived values computed, not stored"
> contradicted the new prose; layered-vs-hexagonal had no criterion; API contracts broke on
> verb-shaped operations.
>
> **Still open, recorded not dropped:** G1's strike test needs a rule rather than one example;
> G8 has no wall-clock/DST case, which is where shift scheduling lives; G5 says use a
> transaction and nothing about isolation; G6 omits the soft-delete mechanic; the
> characteristics trace table has three rows against a ten-item candidate list. Full report:
> `docs/verification/cold-reader-stage-03-run2.md`.
>
> **Deferred:** the app port (**W-3.2** / **TD-23**); G9, still stage 10's by design (D-39).

Found by a cold-reader pass (D-32) run at the end of the stage 03 build: an agent allowed
to read only that one doc, forbidden from filling gaps with its own knowledge, taking a
shift-swap product through the stage's four artifacts (schema, reversibility sort, an ADR,
feature boundaries).

**These are pre-existing gaps in the doc, not defects the stage 03 branch introduced.** The
branch's one owned doc change — the AI section — is done. Ranked High anyway: they are
blocking for a reader using the stage as intended, and every fix is a two-file change
because the app mirrors the doc, so the cost grows as more stages copy the pattern.

**G3 is not like the other thirteen and should be fixed first.** The other gaps stall a
reader — they notice something is missing and have to guess or go elsewhere. G3 does not
stall anyone. The Definition of Done says "authorization pattern decided and written
down," not "using the pattern above," so a reader on a shared-workspace product can decide
ownership, tick the box, and believe they followed the playbook — while the doc's only
authorization concept ("proving the record belongs to the caller") is wrong for their
product. **A confident wrong answer is worse than a dead end**, because nothing downstream
flags it: no error, no stall, no reason to double back. The next round should prioritise
G3 above G4 (indexes) and G5 (conditional uniqueness), which are the quieter kind of gap a
reader notices and routes around.

**Blocking — the stage cannot be completed from the doc alone:**

| ID | Where the reader stalled | What is missing | The line that closes it |
|---|---|---|---|
| **G3** | Tasks (b)/(c). The DoD requires "authorization pattern decided and written down" | Ownership ("proving the record belongs to the caller") is the *only* authorization concept in the document. On a shared-workspace product almost nothing important is owned by its caller — a manager approves a swap between two other people. No second pattern is offered, so the exit condition is unsatisfiable from the doc | Name the ownership / role / membership split, keeping enforcement in stage 05 |
| **G4** | Task (a), the schema. Artifacts requires "constraints, keys, and indexes" | "indexes" appears **once**, in that Artifacts line, and nowhere else in the document. The annotated DDL has none | Add two indexes to the DDL with reasoning, or drop indexes from Artifacts |
| **G5** | Task (a), expressing "at most one approved claim per shift" | Races are named as *the* reason to push constraints into the database, then only PK / FK / CHECK / UNIQUE are supplied — none of which expresses a conditional uniqueness rule. Partial unique indexes are unmentioned; **transactions are unmentioned in the entire document** | A conditional-uniqueness annotation, plus one sentence that row-spanning invariants need a transaction |

**Friction — the reader proceeded, but had to guess:**

| ID | Where | Missing | Closes with |
|---|---|---|---|
| G1 | Deriving the entity list | No procedure from product description to nouns; it shows the finished invoicing block, and entry criteria assume the answer | 2–3 sentences deriving candidate nouns from stage 02's vertical slices |
| G2 | Is Manager an entity, a column, or a table | No treatment of role-bearing actors; the worked example has one actor type that owns everything it touches | A fifth interrogation question: "does every actor have the same rights over this entity?" |
| G6 | Deletion for cancelled shifts, withdrawn claims, departed workers | Only the financial-record heuristic; the sole audit-trail signal is "event sourcing, almost certainly not" | Generalize: keep what someone will later ask "where did that go?" about |
| G7 | Whether an approved swap rewrites a column or is recomputed | No criterion separating derived from stored (`overdue` computed, `paid` stored, difference unstated); normalization never appears | State the test — is it a pure function of other columns in the same row — and name the point-in-time exception |
| G8 | Typing `starts_at` / `ends_at` | `date` and `timestamptz` both appear in the DDL with no note of the difference; no timezone or midnight-crossing guidance | One annotation line on `date` vs `timestamptz` |
| G10 | Is "Next.js + Postgres" one ADR or three | No statement of what constitutes a single decision, so "every expensive decision has an ADR" is uncheckable | One ADR per thing reversible independently |
| G11 | Are `scheduling` and `swapping` one feature or two | The rule for *enforcing* boundaries is given, not for *choosing* them — and it is stated only for reads, while swap approval writes across the seam | Define a feature by the tables it alone writes; cross-feature writes go through the owner's exported function |
| G12 | The deferral list, which the DoD requires be explicit | No format, no location, no test separating a safe deferral from a dangerous one — "Defer aggressively" is six fixed infrastructure items, not a criterion | Defer anything whose reversal does not require migrating stored data |
| G13 | The first `CREATE TABLE` | `uuid PRIMARY KEY DEFAULT gen_random_uuid()` is unannotated while `amount_cents` and `ON DELETE RESTRICT` beside it are explained, though a PK type is stored data touching every row and every FK | One clause naming the alternative |
| G14 | Placing notification channel / hosting / real-time updates | The reversibility section gives two example lists but no test. The actual test — "what would have to change, how many call sites touch it, whether any of it is stored data" — is **buried in the AI section, framed as a prompt for a model** | Promote that sentence into the reversibility section as the rule the two lists exemplify |

**G9 (BOUNDARY, not blocking — do not rank it with the three above):** the ADR section
gives five section nouns, no example, no length, no status field, no naming or location,
yet an ADR is a stage-03 artifact required twice in the DoD. This is deliberate — the doc
defers ADR *format* to stage 10 (see D-39, which is why stage 03's worksheet records the
domain model instead). Closing it means inlining one short real ADR here and leaving the
rationale in 10.

**Self-contradictions:**

- **C1** (sharpest) — "Multi-tenancy beyond a `user_id` column" is on the defer list, but a
  tenant key is stored data on every table, which the reversibility section classifies as
  decide-now. The two rules point opposite ways with no tie-breaker.
- **C2** — that same line presumes the invoicing app's shape, where each user owns a private
  slice. Where the tenant is an organization and its data is shared, `user_id` is the wrong
  axis rather than a weaker version of the right one.
- **C3** — entry criteria require "you know roughly what data the system holds"; the stage's
  first work section is how to determine what data the system holds.
- **C4** — a single Next.js app on Postgres is prescribed as "the correct choice", yet the
  data store is stored data (expensive list) and every expensive decision needs an ADR.
  Next.js gets four supporting bullets; Postgres is asserted.

**Undefined or late-defined terms:** ~~ADR~~ and ~~DDL~~ ✓ expanded on first use
2026-07-28 (one clause each, the only fix taken in this round) · `immutable ledger` ·
`event sourcing` (dismissed without being defined) · `big ball of mud` (carries the
justification for the boundary rule) · `trigger` · `function execution limits` (presumes
serverless knowledge not established). `vertical slices` is stage 02's term — a boundary,
not a defect. Conway's law is named and glossed in the same line: the model the rest should
follow.

**What the same pass validated** — recorded because an entry listing only faults would
misrepresent the result, and evidence cuts both ways:

- **The four interrogation questions are the strongest thing in the document.** All four
  fired productively on a product they were not written for. "Can a client belong to two
  users?" transposed directly into "can a posted shift have two claimants?" — which told the
  reader that Claim is a table with a row per worker, not a nullable `claimed_by` column.
  That is the most consequential decision in their schema, and the doc handed it to them.
- **The reversibility sort held** — two concrete lists, an explicit instruction on where to
  spend thinking, a named failure mode.
- **The annotated DDL teaches by its annotations, not its SQL.** Money as integer cents,
  `CHECK` for fixed value sets and `ON DELETE RESTRICT` all transferred to a different
  domain unmodified.
- **"Constraints live in the database" is argued, not asserted** — three specific reasons,
  and it changed what the reader wrote.
- **"Defer aggressively" did real work** — no queue, cache or feature-flag service in the
  reader's design, and the doc is the reason.
- **Traps functions as a self-audit** — it caught a real cascade bug in the reader's draft.

**Closes with:** its own round, with a spec. Full findings at
`.superpowers/sdd/2026-07-28-stage-03-architecture/cold-reader-findings.md`. Expect matching
app changes for anything touching the DDL annotations, the interrogation set or the
reversibility lists, since those are ported into `scoring.ts` — G2 and G14 in particular are
two-file changes.

### ~~TD-21~~ — Stage 03 never names the architecture styles landscape · **CLOSED 2026-07-29**

> **Closed by W-3.1** (`fdb2abd`, `bf97a7b`). Section 4, "The shapes a system can take",
> compares monolith · modular monolith · microservices · serverless, each with what it buys,
> what it costs, and what would have to be true to choose it — and names the stage's own
> approach as a **modular monolith**, which it had been teaching unnamed. Section 6 names
> **bounded context** and **ubiquitous language** for what "Boundaries inside the monolith" was
> groping at. Layered and hexagonal are separated onto the internal-organisation axis, which is
> the distinction that makes "monolith or microservices" a bad question.
>
> **D-44 held.** The recommendation did not change. The section was read in isolation as the
> plan required, and the microservices row's "what would have to be true" is *separate teams
> need to ship without coordinating* — a condition a solo reader plainly fails. Section 5 now
> states the single application as a conclusion drawn from characteristics and alternatives,
> with an explicit invitation to disagree if the same trace comes out differently.
>
> Event sourcing and CQRS got definitions before their verdicts, with the boundary the cold
> reader needed: an audit table alongside normal rows is not event sourcing, and you should
> keep it. Glossary 42 → 56 terms.
>
> **Deferred:** the app port (**W-3.2**); the internal-organisation axis got a selection
> criterion only after the cold reader found it missing.

Raised by the project owner after walking the built stage. Distinct from TD-18, which is
about gaps a cold reader hits while *doing* the stage's four artifacts. This one is about
vocabulary: a reader finishes stage 03 having made good decisions and still cannot place
them among the words they will meet in every job description, conference talk and code
review.

**What the doc does today.** It prescribes a single Next.js application on Postgres, gives
four concrete triggers for splitting a service out, and teaches feature modules that talk
through exported functions. That advice is correct and matches current industry consensus.
The problem is that it is delivered as a prescription a reader has to take on faith.

**What is missing, in rough order of cost:**

| Gap | What is absent | Why it matters here |
|---|---|---|
| **Architecture characteristics** *(owned by **TD-22**, listed here because it is the input this entry depends on — build it once)* | The stage never asks what the system needs to *be* — available, auditable, low-latency, cheap to run, secure. It goes straight to structure | This is the input that makes style selection a decision rather than a preference. Richards & Ford put it as "architecture is mainly about quality attributes, not features"; arc42 makes quality goals section 1.2 because every later decision is supposed to trace back to one. Most readers will meet it as **non-functional requirements** — same activity, different name. Its absence is the root cause of the next row |
| **The styles taxonomy** | **Modular monolith**, layered, hexagonal / ports-and-adapters, event-driven, microkernel, serverless, SOA — none named. Microservices appear only as the thing not to do | The sharpest instance: the stage *already teaches* the modular monolith in "Boundaries inside the monolith" and never uses the term. The reader is doing the industry-standard thing without the word for it |
| **DDD vocabulary** | Bounded context, ubiquitous language, aggregates, context mapping | "Boundaries inside the monolith" is groping toward bounded context unnamed. Fowler's reasoning — "total unification of the domain model for a large system will not be feasible or cost-effective", boundaries follow human language — is the missing justification for the stage's own rule |
| **Integration style** | Synchronous REST/RPC versus asynchronous messaging is never posed as a decision | It is the fork that leads to event-driven architecture, and it has different failure modes on each branch. Ties directly to TD-18's G5, where the doc names races and supplies no tool for them |
| **Diagramming standard** | Artifacts asks for "a diagram only if it clarifies" without saying what kind | **C4**'s context → container → component levels are the widely-used answer and would give the stage's boundary map a home |
| **Terms dismissed undefined** | Event sourcing gets "almost certainly not" with no definition; CQRS is absent entirely | The cold reader could not tell whether its own approval-history table counted as event sourcing. Overlaps TD-18's undefined-terms list |

**The scope call is D-44: teach the trade-off, do not change the recommendation.** Solo-first,
defer aggressively, monolith default all stay. The round adds the landscape *around* that
advice so the reader can see it derived rather than asserted.

**Closes with:** one round, shared with TD-18 since both live in the same doc and both force
matching app changes. Expect a new step before the monolith advice — what does this system
need to be — and a styles comparison that states honestly what would have to be true to pick
each one.

### ~~TD-22~~ — Stage 03 produces low-level design without ever doing high-level design · **CLOSED 2026-07-29**

> **Closed by W-3.1** (`6e24fff`, `eaafe0a`, `08975f2`, `3a6ed8c`). The stage now runs
> requirements → HLD → LLD across thirteen subsections.
>
> **The inversion was fixed by splitting a section, not only by adding them.** "Model the
> domain first" had fused the conceptual model (HLD) with the `CREATE TABLE` (LLD). The DDL
> moved into its own "Design the database" section, positioned after the system sketch that
> justifies its shape, and the domain section kept its name and its claim.
>
> All five missing pieces shipped: architecture characteristics with a trace-forward table,
> the system sketch with container/deployment/data-flow views and C4 named, database design
> past the DDL (ER view, normalisation, indexes), and API contract design.
>
> **Both open questions answered rather than assumed.** Functional requirements stay stage
> 02's — verified against its headings, and the doc now states it consumes them. Ceremony:
> the full HLD/LLD *thinking*, none of the paperwork, and the doc says so in text so an
> enterprise-background reader reads the omission as a decision.
>
> **The failure mode this could have had, avoided deliberately:** if the answer is one
> application and one database, the component view is two boxes and the section proves HLD is
> pointless. The worked example scaled instead — an invoicing app really does take payments,
> send email, store PDFs and need something scheduled — which also gave TD-18's
> integration-style gap concrete material to close on.
>
> **Deferred:** the app port (**W-3.2** / **TD-23**), which is the larger half; the doc grew
> 300 → 902 lines and the app is still six steps.

Raised by the project owner alongside TD-21, and structurally the more serious of the two.
TD-21 is about vocabulary the reader never learns. This is about an **activity the stage
never runs**.

**The inversion.** The industry sequence is requirements → HLD → LLD. HLD settles what the
components are, how they talk, what the deployment shape is, and which non-functional
requirements the design has to satisfy; LLD then produces schemas, API contracts and error
handling. Stage 03 goes from "sort decisions by reversibility" **directly to a concrete
`CREATE TABLE` statement** — which is LLD — with no HLD in between. The schema is the most
detailed artifact in the stage and it arrives with nothing above it to justify its shape.

**What is missing:**

| Missing | Where it should sit | Note |
|---|---|---|
| **Non-functional requirements** | A step before the structural advice | Same thing as TD-21's "architecture characteristics" under the name most readers will meet. **Owned here**, referenced from TD-21 — do not build it twice |
| **A high-level design artifact** | Between the domain model and the schema | Components, how they interact, external systems, data flow, deployment shape. The doc's Artifacts asks only for "a one-paragraph description of the system, plus a diagram only if it clarifies", which is the HLD in one sentence and no structure |
| **Component / deployment / data-flow views** | The HLD artifact | Ties to TD-21's C4 row — its context → container → component levels are exactly these views |
| **Database design beyond the DDL** | The existing schema section | Has domain model and constraints. Missing: indexes (**TD-18 G4**), an ER view, normalisation vocabulary, and any sizing or access-pattern thinking that would justify the index choices |
| **API / contract design** | LLD, alongside the schema | Never posed. Route shape, request/response contracts and versioning are architecture decisions with different reversibility costs |

**Functional requirements are deliberately NOT on that list.** Stage 02 owns them — "define
done before defining work", the cut, the vertical slices. Stage 03 should **state that it
consumes them** rather than restate them, the same way it consumes stage 02's spike decision.
Getting this boundary wrong would duplicate stage 02 and break the filing-code claim the whole
playbook rests on. Worth deciding explicitly during the brainstorm rather than by default.

**The ceremony question, which the round has to answer.** Full HLD/LLD practice comes with
system specification documents, governance and sign-off — all wrong for a solo developer, and
exactly the kind of thing this playbook's "defer aggressively" section exists to refuse. But
the *thinking* is not ceremony: what are the pieces, how do they talk, what does this need to
be, what happens when a piece fails. The round should take the thinking and leave the
paperwork, and say so in the doc so a reader coming from an enterprise background knows the
omission is deliberate.

**Closes with:** the same round as TD-18 and TD-21. This one probably drives the stage's step
structure, so brainstorm it first — if a new HLD step lands between Model and Constrain, the
app's six steps and nine figures both change shape.

### ~~TD-24~~ — The `.agents/` skill library arrived unrecorded · **CLOSED 2026-07-29**

> **Resolved by the project owner: the library is deliberate and stays.** That was the open
> question, and it is now answered — the entry below stands as the record of what arrived and
> when, not as an outstanding decision.
>
> The two remaining observations are noted and explicitly **not** being acted on: the root
> `.agents/` tree is a byte-identical subset of `web/.agents/` (verified by `md5`), and
> `8063587`'s commit message does not follow the repo's Conventional Commits rule. Neither is
> worth rewriting history for. Left here so a future reader finds the explanation rather than
> re-deriving it.

`8063587` added ~8,500 lines of vendored agent skills plus `skills-lock.json`, on this branch,
outside the delivery loop. Flagged by the whole-branch review as I6. Not deleted or rewritten
here, because it is the project owner's commit and the content may well be wanted — recorded
so it stops being invisible.

**Two trees, one redundant.** `.agents/skills/` holds `brandkit`, `design-taste-frontend` and
`minimalist-ui`. `web/.agents/skills/` holds those three plus six more. Verified by `md5`: all
three root files are **byte-identical** to their `web/` counterparts, so the root tree is a
strict subset with nothing of its own. `web/.agents/` additionally carries both
`design-taste-frontend/` and `design-taste-frontend-v1/`. Whichever tree is authoritative, one
copy of each skill is enough.

**Nothing records what these are for.** No tracker entry, no decision, no mention in
`CLAUDE.md`'s Tooling section, which otherwise names every tool in regular use. A future
reader finds 8,500 lines of skill markdown with no statement of whether they are load-bearing,
experimental, or left over.

**The commit itself does not follow this repo's conventions**: no scope, a subject describing
two unrelated changes (`feat: establish agentic skill library and update local development
server configuration`), a `feat` type for a change that ships no product code, and **no
`Co-Authored-By` trailer** — the only commit on the branch without one. Three unrelated
dev-server port edits rode along inside it; `c8ac043` finished that change properly.

**DISPROVED, and worth stating because the review claimed otherwise:** I6 asserted that
`CLAUDE.md`'s *"`frontend-design` … (the only project-enabled plugin)"* is now false.
It is **true**. `.claude/settings.local.json` lists exactly one entry under `enabledPlugins`,
and these skills are a separate mechanism (`skills-lock.json`), not plugins. The line stands
unedited.

**Closes with:** the owner deciding whether the library stays. If it does — a decision entry
saying what it is for, one tree rather than two, and a line in `CLAUDE.md`'s Tooling section.
If it does not, it comes out on its own branch.

### ~~TD-25~~ — Stage 03 is missing five clusters of standard architecture practice · **CLOSED (doc) 2026-07-30**

> **Doc closed by W-3.1b** (`1db6344`…`3cd19c4`, 9 commits). `docs/03-architecture.md` 902 →
> 1,281 lines, 13 → 14 subsections, glossary 56 → 72 terms. **The app port remains open** and is
> tracked as the last item of W-3.1b, blocked until `feat/stage-03-app-port` merges.
>
> **All five clusters landed, and the third cold-reader run rated two ACTIONABLE on the first
> pass** — consistency/concurrency ("the only cluster that fully closes") and
> statelessness/scaling ("best-scoped cluster in the amendment", with the connection-pooling
> passage called the strongest writing in the document because it gives the failure *signature*).
> The other three came back PARTIAL and were fixed in the wave: the breaker had no numbers to
> code against, the six-step migration could be recited but not executed, and fitness functions
> were close to vocabulary with all three examples drawn from this repository's infrastructure
> rather than the reader's.
>
> **The trace table now covers 10 of 10 candidates**, verified by script rather than counted.
> That was the round's actual deliverable: it could not be widened until the material existed.
>
> **The round's most serious finding was a security defect it had inherited, not created.** G3's
> edge had been open across all three runs — the doc said to record "which pattern applies to
> which entity", singular, and a reader following that literally produced cross-team privilege
> escalation. Patterns compose, and the doc now says so with the conjunction written out.
>
> **And three contradictions the round introduced itself**, all caught by the re-run: widening
> the trace table made Auditability force soft delete and Correctness force a locking strategy
> while the worked DDL had neither column; a circuit breaker's in-memory failure count collides
> with the statelessness rule added in the same round; and the over-reach check found
> expand-contract stated unconditionally, which told a pre-launch solo developer to spend six
> deploys renaming a column — ceremony against imagined traffic, in a document that refuses
> imagined scale.
>
> **Deferred:** the app port; G1's property-vs-entity strike test; G6's general soft-delete
> mechanic; the missing auth box in the container diagram; outbox cadence's seam with stage 11.
> Full report: `docs/verification/cold-reader-stage-03-run3.md`.

### ~~TD-25 (original entry)~~ — the audit that raised it

Raised by the project owner asking a direct question after W-3.1 merged: is the stage complete
against standard, widely-used software architecture practice? Audited by grepping all eighteen
docs for the vocabulary a reader would meet in Richards & Ford, Kleppmann or Newman. The answer
was no, and the gaps are **absent from the whole playbook** rather than deferred to a later
stage — which is the distinction that makes this debt rather than scope.

| Missing | Grep result | Why it belongs in stage 03 |
|---|---|---|
| **Resilience patterns** — timeout, retry with backoff, circuit breaker, graceful degradation | `circuit break` 0 · `backoff` 0, across all 18 docs | "Sketch the system" asks *"what happens when each dependency is down?"* — the right question — and answers with no patterns. It sets the question up and drops it |
| **Consistency and concurrency** — CAP, eventual consistency, isolation levels, optimistic/pessimistic locking | `CAP theorem` 0 · `optimistic lock` 0 · `eventual consistency` 0 · `isolation level` only in this tracker | The doc says "use a transaction" and stops. The cold reader already flagged the hole. A version column is stored data, so it is decide-now by the stage's own reversibility axis |
| **Safe schema evolution** — expand-contract / parallel change, strangler fig | `expand-contract` 0 · `strangler` 0 | The sharpest one. The stage's thesis is that stored data is expensive to reverse, and it teaches the *cost* without the *technique* |
| **Statelessness and scaling mechanics** — statelessness, horizontal/vertical, load balancing, read replicas, connection pooling | `stateless` 0 · `load balanc` 0 · `read replica` 0 | Statelessness is what makes the serverless style the stage teaches work. Pooling is the best-known failure mode of serverless-plus-Postgres, which is the prescribed stack |
| **Fitness functions** | `fitness function` 0 | Closes the characteristics section's loop. This repo already practises it in two tests without naming it |

**The unifying tell.** "What this system has to be" offers a **ten-item candidate list** and a
**three-row trace table** — the cold reader flagged that a reader choosing availability,
security or evolvability gets the trace test with nothing to pass it. The missing seven map
onto exactly the clusters above. It is one gap wearing several hats: the stage teaches you to
choose characteristics it cannot then help you satisfy.

**Worth stating plainly, because it is the uncomfortable part:** for a stage whose entire
thesis is the cost of reversing decisions, it is thinnest on what happens when things fail or
change.

**Not gaps, and not to be closed here:** caching *patterns* belong to stage 09 (already
linked), observability to 15, threat modelling and secrets to 08. Those are boundaries doing
their job.

**Closes with:** **W-3.1b**, scheduled **after** the app port. It was first scoped to run
before, to avoid porting twice — sound reasoning on a wrong premise, since `W-3.2` was already
31 commits and a built nine-step stage in a parallel session when this was written. The
double-port cost is accepted and folded into W-3.1b rather than deferred to a third round.

### ~~TD-23~~ — Stage 03's doc and app now disagree about what the stage contains · **CLOSED 2026-08-03**

> **Coverage is now tracked in `docs/stage-03-status.md`** — section by section, doc against
> app, with the remaining port tasks listed. This entry stays open until that file shows no
> partial or unported rows. Written because the divergence was twice *discovered* by a review
> rather than tracked (D-51).

Opened deliberately by W-3.1 on 2026-07-29, which was scoped doc-only. This is a debt the
round chose, not one it discovered, and it is recorded so the choice is visible rather than
silent — `CLAUDE.md` permits the doc/app duplication but not widening it unnoted.

`docs/03-architecture.md` is fourteen subsections and 1,507 lines. Live coverage:
`docs/stage-03-status.md`.

**Status 2026-08-03, content done and the review run.** `web/src/features/architecture/` is
**22 steps**, up from the six built in W-3 and the nine it carried when this round opened. All
five clusters are ported — resilience, consistency and concurrency, safe schema evolution,
statelessness and scaling, and (closing in `9798286`) fitness functions with the widened
ten-row trace and the event-sourcing / CQRS definitions — plus the AI section's two missing
plays and sixth mislead, and section 9, which had no app step at all. `docs/stage-03-status.md`
now shows no partial or unported rows, and both whole-branch passes have run with every
finding fixed.

**CLOSED 2026-08-03 by the merge.** `feat/stage-03-app-port` landed on `main` as `790b3e4`
(`--no-ff`, 106 commits, branch deleted), doc and port as one unit per D-51 — which is what
makes the two halves agree on `main` rather than on a branch. The gate was re-run on the merged
result before the branch was deleted: 313/313 across 26 files, 14/14 audit over 36 URLs, lint,
typecheck and format clean. Not pushed.

**Why the round took the debt rather than avoiding it.** Stage 03's app already sat at D-38's
ceiling of five content steps plus the AI step, and the round added five sections. The port
therefore needs a step structure that did not exist until the prose settled, and porting
against a moving target means doing it twice. The reasoning is in the spec's Non-goals.

**It is not only additions.** `scoring.ts` holds the DDL annotations, the interrogation set
and the reversibility lists, and all three changed: the actor-rights interrogation question —
recorded here as "a fifth" and now the sixth, since W-3.1b inserted one before it — indexes
and a partial unique index in the DDL, and the reversibility test promoted out of the AI
section. A port that only adds components would leave the app stating things the doc has
corrected.

**Closes with:** **W-3.2**, which supersedes D-38 with the shape the doc proved. The 14 new
terms `terms.ts` already carried from the doc round are wired in as each concept was ported
(`fitness-function` inline in `trace`, for one); CQRS and event sourcing stay named rather
than taught, which is D-49's call and not debt.

### ~~TD-41~~ — Stage 03's locked exercise options fail AA · **CLOSED 2026-08-18**

Seven of stage 03's exercises style a committed-but-unpicked option
`text-subtle opacity-60` on `bg-raised`: `AuthzPatterns` (twice), `ExpandContract` (twice),
`LockingChoice`, `ModelInterrogation`, `ReversibilityTable` and `SplitTrigger`.

Composited, that measures **2.62:1 in light and 3.21:1 in dark** on 13–14px text, against
the 4.5:1 this repo's verification standard requires of "every distinct text/background
pair, both themes, all steps". Those options are content the reader is meant to re-read
beside the verdict, not unavailable controls, so the greying is doing the wrong job as well
as failing the number.

**The audit cannot see it**, which is why it survived three stages. `audit.spec.ts` visits
each panel in its default state; this pair only exists after a reader commits an answer.
That is TD-26's shape (the audit is green about surfaces it never evaluates) narrowed to a
specific, measured instance.

Found by the whole-branch review of the stage 04 port, which measured it after that
branch's own `DeployBlockers` was flagged for copying the idiom. **Stage 04 is already
fixed** — it drops the opacity and keeps `text-subtle`, matching `ClientTrap` and
`PinExercise`, which never adopted it and measure 5.19–12.71. The one-word fix is the same
in all seven.

**Fixed 2026-08-18** on `fix/stage-04-debt` (`6cd5869`), once that became its own branch
rather than a widening of the port.

Measured after the change: **6.92–7.09 in light and 8.20 in dark** on `ModelInterrogation`,
`AuthzPatterns`, `SplitTrigger` and `ReversibilityTable`. The first probe missed
`ExpandContract` (it is `role="checkbox"`, not `radio`) and `LockingChoice`, and rather than
keep rewriting throwaway probe code the gap was closed the conclusive way: all **ten**
locked-state sites across the eight components now carry the identical class string
`cursor-not-allowed border-line bg-raised text-subtle`, and contrast is a pure function of
the two colours, so the four measured ratios are the ratios. `grep opacity-60` over both
feature directories returns only a comment.

### ~~TD-39~~ — The annotated config blocks cannot be copied · **CLOSED 2026-08-18**

`artifacts.ts` says in its own header that the reader is meant to paste these, and
nineteen of them render across five panels. They cannot be pasted.

`AnnotatedArtifact` lays each line out as `<div>[code cell][note]</div>`, so the notes are
interleaved into the DOM *between* the code lines. Selecting a block and copying it yields
code line 1, annotation 1, code line 2, annotation 2, and so on. There is no copy button
either.

`SchemaInspector`, the component this one was copied from, does not have the problem — it
puts the note in a separate click-to-select panel rather than beside each line. The
interleaving came with the side-by-side layout, which was itself chosen for a measured
reason (see `PATTERNS.md`): a single wide scroller would push every note past 700px at the
1024px the panels are measured at.

**Closed 2026-08-18** (`40a9403`, `fc915bb`), in two parts, because the two halves fix
different paths.

`select-none` on the note column fixes the manual path: a drag-selection now returns only
the config. `CopyArtifact` is the direct one, and it hands over exactly
`lines.map(l => l.text).join('\n')` — the same string `artifacts.test.ts` builds to hold the
block against the doc, so what a reader pastes is what the test verifies. It confirms the
copy and reverts after two seconds, since a click that silently succeeds reads the same as
one that silently failed.

The `select-none` test asserts a class rather than behaviour and says so in place: jsdom
computes no selection, so that half was confirmed in a browser and the class is what a
test can hold.

Original entry follows.

**Closed with** either a copy button that reads `lines.map(l => l.text).join('\n')` — the
same string the doc-fidelity test already builds — or a `user-select: none` on the note
column, which fixes copy without adding a control. The first is better and neither is
large. Found by the Wave 3 review, not by any test; nothing in the gate can see it.

### ~~TD-40~~ — Eighteen tab stops on one config block · **CLOSED 2026-08-18**

Each line of an `AnnotatedArtifact` is its own `overflow-x: auto` region with
`tabIndex={0}`. That is the correct WCAG 2.1.1 treatment for a scrollable region — a
keyboard user must be able to reach and scroll it — and it is applied to every line rather
than to the lines that actually overflow.

`ci.yml` is 20 lines, `lefthook.yml` 18, and the `hooks` panel carries two artifacts, so a
keyboard reader tabs roughly twenty stops through one panel. Each takes the global
`:focus-visible` outline, so it looks like a control and is not, and perhaps two of them
scroll anything at 1024px.

Not a WCAG failure — the mechanism is right and the alternative (no focusable scroller) is
worse. Recorded because the cost is real, it is paid on six panels, and the component's
header currently reads as though the question were settled.

**Closed 2026-08-18** (`fc915bb`) with exactly that, and the measurement is the evidence.
`OverflowFocus` sets `tabIndex` from `scrollWidth > clientWidth` per cell, re-running on
resize through a `ResizeObserver`.

Measured against a real build on `strict`'s eleven lines: **5 focusable at 320px, 2 at 768
and 1024, 1 at 1440** — matching the overflow count exactly at each width, against eleven
at every width before. `ci.yml`'s twenty lines contribute **none** at 1024px, which also
corrects the component docblock: the 92-character line that justified per-line scrollers is
the exception, not the rule.

The second measurement is the one that matters. Checking only 1024px would have shown zero
stops and looked identical to a mechanism that always answered "not focusable".

Implemented with a ref callback rather than an effect, because
`react-hooks/set-state-in-effect` is an error here and measuring into state would fail lint
and cascade a render. It sets `tabindex` imperatively on nodes React owns, which is safe
only while the lines are static markup — recorded in the component, since it stops being
safe the moment a line becomes dynamic.

### TD-13 — Stage 02 has a "Scaling to a team" block; stage 01 does not · **Closed 2026-07-28**

~~Stage 02's interactive build includes a collapsed "If you are not solo" disclosure porting
the doc's team section; stage 01 silently dropped its equivalent.~~ Closed in `cf1aada` by
retrofitting stage 01 rather than by removing stage 02's — 32 insertions, 0 deletions, one
file, every added line either the import or inside the `TeamNotes` block. Content matched
line-for-line against `docs/01-product-discovery.md:221-230`.

**The rule, which is the actual deliverable:** every stage ships its doc's "Scaling to a
team" section as a **collapsed disclosure**, in the final content step, after the content
and before the traps. Collapsed because the solo reader is the baseline (D-3) and must never
be slowed by team material; present because the doc has it and the app is not allowed to
quietly hold less than the doc. `TeamNotes` is the shared component — do not re-invent it
per stage. Stages 04–18 now copy a convention instead of choosing a precedent.

### ~~TD-32~~ — Stage 04's §5 hands the reader a check that cannot fail · **CLOSED 2026-08-20**

**Closed at `e615727`, and the entry below is wrong about why.** The finding stands: the
check a reader reaches for does report success while proving nothing. The mechanism does
not. Turbopack **does** re-evaluate `env.ts` on `Reload env: .env.local`, in the same
process, with one `Ready in` for the whole session. What misleads is a window one request
wide — the request that arrives before the reload lands is answered by the evaluation
already in memory and returns 200; every request after it returns 500 with the Zod
`too_small`. Deterministic across four trials, on Next **16.2.10** (the version `web/`
pins) and again on **16.3.1**, so it is not version drift. Reproduction:
`docs/verification/td-32-env-restart.md`. Recorded as **D-85**.

§5 now carries the measured mechanism and the reason that outlives the bundler, and the
`env` artifact's parse line carries the same in the app, since a correction landing in one
and not the other is how the two drift. Five tests in
`web/src/features/setup/env-restart.test.ts`, one of which pins the correction itself —
§5 must say the module *is* re-evaluated, because the simpler wrong mechanism is what this
entry carried and is what a future editor tightening the paragraph would reach for.
Teeth-checked both halves separately: 1 failed of 131 each time.

`### 5. Environment variables, validated at boot` is the section whose entire promise is
that a missing variable stops the app. The obvious way to confirm that promise is the one
a reader will take: leave `pnpm dev` running, blank `SESSION_SECRET` in `.env.local`, and
reload the page. **Turbopack does not re-evaluate `env.ts` when `.env.local` changes.** The
fix wave on `fix/stage-04-doc-corrections` watched it log `Reload env: .env.local` and go
on serving **200** off the cached module; the same edit followed by a restart gave **HTTP
500** carrying the Zod `too_small` thrown from `env.ts` at module evaluation. Observed
there and not re-run for this entry, which is why the restart is stated as the fix rather
than as the only fix.

That is worse than an undocumented quirk. The reader who verifies without restarting sees
the app keep working and concludes the validation is wired when the only thing proved is
that a module was cached — a green result that a broken implementation produces too. Rated
alongside **TD-26** and **TD-27** because it is the same defect, in the reader's hands
rather than ours: a check whose passing outcome carries no information. §5 says nothing
about it.

Closes with one sentence in §5 saying to restart the dev server, and the reason. It is
deliberately not a one-line drive-by: the cheap phrasing ("restart after editing
`.env.local`") teaches the ritual and not the reason, and the reason is the transferable
half — a validation that runs once at module evaluation can only be re-tested by causing
another module evaluation.

### ~~TD-35~~ — The audit's console check cannot see a dev-only warning · **CLOSED 2026-08-20**

**Closed at `404b6d5`.** `pnpm test:dev-console` runs `e2e/dev-console.spec.ts` against
`playwright.dev.ts` — `next dev` on port 3101, `reuseExistingServer: false`, the same
`auditPages` set the audit sweeps, failing on React's own development warning prefixes.
Outside `test:e2e` and outside CI by decision (**D-84**), documented in `CLAUDE.md` as a
stage-round step. 42s over 76 URLs.

**It found a real pre-existing bug on its first honest run** — see **TD-43** — which is
the strongest evidence the check is not decorative. Teeth-checked three ways: removing
`RevealList`'s `key` before the TD-43 pin existed; pointing the pin at a clean URL, which
trips its retire assertion; and removing the key again with the pin in place, which
surfaced three pages the pin does not cover.

**One unexplained failure, recorded rather than rounded off.** `pnpm test:dev-console`
failed once during final verification, immediately after `pnpm test:e2e`, and the batch
discarded its output. It then passed three times in isolation and once more in that exact
back-to-back sequence, so it is not reproducible and the cause is unknown. Kept here
because a 1-in-9 failure nobody wrote down is how a command earns a reputation for being
flaky without anyone ever having a log. It is outside the gate (**D-84**), so the cost of a
bad run is a re-run rather than a blocked merge.

One defect in the spec was mine and is worth keeping. A single console listener writing
against a mutable "current path" **mislabelled the warning as
`/stages/04-project-setup#scaffold`** — the page *after* the one that emitted it, because
console events arrive asynchronously. I read `Setup.tsx` looking for a bug that was not
there. Listeners are now attached and detached per page with a settle, and the corrected
attribution agrees with an independent fresh-context scan. **A wrong path is worse than no
path, because it is believed.**

`e2e/audit.spec.ts`'s "zero console errors across every page and step" runs against a
production build, deliberately: the dev overlay pollutes the console and the dev server
renders differently, which is why `playwright.config.ts` builds and serves rather than
reusing `pnpm dev`. **React strips its development-mode validation from a production
build.** Everything in that family is therefore invisible to the gate: missing-key
warnings, invalid DOM nesting, `act()` warnings, hydration-mismatch detail, prop-type
complaints.

This is not hypothetical here. `RevealList` logged *Each child in a list should have a
unique "key" prop* on **every** `pnpm dev` page load of `/stages/03-architecture#ai` from
`1772555` until `f1a23e7` fixed it, while the audit reported 14/14 throughout. It was found
by an implementer opening the dev server for an unrelated visual measurement, which is
luck rather than process. **It then happened a second time on the same branch**: the fix
keyed the row header and left `Card`'s three children, so `#tenancy`, `#trace` and
`#indexes` warned on every dev load until the whole-branch review caught it, with the audit
reporting 14/14 the entire time. Two notes now recorded in `audit.spec.ts` for anyone
checking by hand: React attributes the warning to the *rendering* component (`Card`), not
the defective one; and the blind spot is narrow — Fast Refresh patching an already-open tab
does not fire it, and a reload within a second or two of saving can race the rebuild, but a
settled reload fires reliably. **An earlier version of this entry said the warning only
fires on a cold server and that any edit-and-reload reads clean. That was wrong**, disproved
across three cold-server runs by the final scoped re-review, and it is corrected here rather
than rewritten away: what actually let both instances survive is that every manual check
loaded a single page, and `#ai` exercises neither `header` nor `footer`.

CLAUDE.md states the standard as "**zero console errors in a clean browser context**". The
production-only check does not meet its own wording, and nothing says so at the point where
someone reads the result. Same defect class as **TD-26** (a sweep green about surfaces it
never evaluated), **TD-27** and **TD-32**: a check whose passing outcome carries less
information than a reader will assume. Rated alongside them.

Closing it is not simply "also run it in dev". The dev overlay is a real source of noise
and the reason for the current shape, so the fix has to distinguish React's own warnings
from the overlay's — plausibly a second, narrow spec that loads a small set of pages
against `pnpm dev` and fails on `console.error` matching React's warning prefixes only.
Until then, `audit.spec.ts` should at minimum say in a comment what its console check
cannot see, so the next person reading 14/14 knows what it excludes.

### ~~TD-36~~ — Nothing catches a step that disappears from stages 01 and 02 · **CLOSED 2026-08-17**

TD-12 closed by deriving the audit's sweep from the rail each ready stage renders, which
means a step that ships is always swept. The reverse is now unguarded: a step deleted or
renamed by accident simply leaves the sweep, and nothing fails.

Stage 03 is covered by construction. `features/architecture/steps.ts` exports `STEP_IDS`,
`Architecture.tsx` types its `Step[]` against it, and `TRACE_ROWS[].stepId` resolves against
the same list — so an id that exists nowhere is a compile error. Stages 01 and 02 declare
their ids inline in the component and have no equivalent.

The asymmetry is deliberate rather than an oversight: a declared list is a specification and
the rendered rail is an observation, and TD-12's recorded failure was the sweep falling behind
the app, not the app falling behind the sweep. Both are real; only one was costing anything.

**Closes with** a `steps.ts` per stage on the stage-03 pattern, most cheaply as part of
building the next stage rather than as its own round — the stage-04 port will write one
anyway if it follows stage 03's shape.

**One thing to do at the same time, because it comes due on the same commit.**
`e2e/audit-pages.spec.ts` pins today's thirty-six URLs as a literal. That was a one-shot
migration proof, and it is the only check that would catch `auditPages` covering stage 01
and then stopping — an early `break`, a stray `.slice`, a `continue` that swallows a stage.
It goes red the moment stage 04 ships, for a correct reason, and the obvious fix is to paste
in whatever the derivation now emits. That would make the expectation generated by the thing
it checks, which is the defect this project has recorded seven times. **Delete the test and
its array; do not edit them.** If the coverage is wanted, assert stage coverage instead —
the set of stage paths in the derived list equals `STAGES.filter(s => s.ready)` mapped to
`/stages/<slug>`, which checks the filter rather than checking step ids against themselves.
The file says this too, at the point someone will be looking.


---

**Closed 2026-08-17**, on the stage 04 port (`394e515`, `08131ac`, `0b18150`).

**Read the "Closes with" clause and the title together, because they are not the same
thing, and the first commit satisfied one while claiming the other.** A `steps.ts` per
stage on the stage-03 pattern makes an id *renamed* in one place and not the other a
compile error. It says nothing about a step *deleted*, which is what the title names — a
review proved it by removing a whole step object from `ProductDiscovery.tsx`: typecheck
clean, 385 tests green, and the sweep one URL shorter in silence.

So this closes on three guards rather than one, and it is worth knowing which does what:

- **`steps.ts` per stage** (`394e515`) — an id that exists nowhere is a compile error.
  Stages 01 and 02 gained one; stage 03 already had it.
- **`features/rails.test.tsx`** (`08131ac`) — renders every ready stage and compares the
  rail it draws to that stage's tuple, in jsdom, in the unit gate. This is the direction
  the type cannot reach. It also fails when a stage goes ready with no entry, which is how
  stage 04 was caught before it had one.
- **`e2e/audit-pages.spec.ts`** (`0b18150`) — the same comparison against the *built* app,
  so a `readStepIds` selector that returns half a rail fails rather than shrinking the
  sweep. Teeth-checked by making it drop the last tab.

**This entry's own premise was partly wrong** and is left standing above rather than
edited: it says stage 03 "is covered by construction" for the deletion direction. It was
not — stage 03 had the identical one-directional guard, and gained the second one here
along with 01 and 02.

**What is still not covered**, stated so the strike-through does not overstate: a step
deleted from *both* the tuple and the component compiles and renders consistently. Only
that stage's own `steps.test.ts` ordered literal fails, which is why each stage has one.
### TD-42 — `features/setup/pins.test.ts` hand-rolls `readFileSync` instead of `docSource` · **Closed 2026-08-20**

Stage 05's port extracted `docSource(relPath)` to `src/test/doc-source.ts` (Task 2) because
stage 05 would otherwise have been the third generation of the same helper. `pins.test.ts`
is a leftover second generation: it reads `docs/04-project-setup.md` with its own
`readFileSync` call rather than the shared factory, found and flagged during that
extraction (**not** fixed there — touching a shipped stage's test was out of that task's
scope).

Low because the file works and is not duplicating logic, only the read — `docSource`'s
value is the three bug-fixes baked into its section-slicing, and `pins.test.ts` does not
slice sections, it reads the whole file. Closes by swapping the `readFileSync` call for
`docSource('docs/04-project-setup.md').DOC` whenever `features/setup/` is next open for an
unrelated reason.

**Closed `3b1e545`**, and it took the `flat` helper too, not only `DOC` — the file was also
hand-rolling the hard-wrap collapse that `flat` exists for, which the entry above missed
when it called this "only the read". No assertion changed. Teeth-checked rather than
assumed: prefixing `PIN_RULE` reddens exactly the doc-comparison test and nothing else,
which is what proves the import resolves to the real document instead of silently to
something empty. `grep -rn readFileSync src/features/setup/` now returns nothing.

---

### ~~TD-43~~ — ~~A missing key~~ at `/stages/03-architecture#traps` · **CLOSED 2026-08-24** (there was never a missing key)

**Closed by a keyed fragment in `Stepper`, and there was never a missing key.** The full
reproduction is `docs/verification/td-43-lazy-key-warning.md`; the short version is that
React validates keys in two places that unwrap lazy nodes to different depths.
`validateChildKeys`, which stamps the static-children exemption at element creation,
unwraps **one** level. `warnOnInvalidKey`, which checks at reconciliation, unwraps until it
reaches an element. `Architecture` is a *server* component, so every step's `content`
crosses the RSC boundary. When the payload is large enough that the last step's content is
still unresolved as the steps array is flushed, that content is outlined into its own
streamed row and arrives wrapped **twice**, its own children still pending when it resolves.
Fulfilled but holding another lazy, it satisfies neither branch of the first function and is
never stamped; the second walks all the way down to an element with `key === null` and
reports it. The panel now renders `<Fragment key="content">{step.content}</Fragment>`, keyed for the
reason `RevealList` already keys its slots — the reconciler warns only when the exemption is
unset *and* `key == null`, so a key closes the gap without depending on the exemption
surviving the boundary. It also keeps the streamed node out of the panel's children array.

**The previous investigation's conclusions are replaced, and so is one of this entry's
own first attempts at replacing them.** The discriminator is **conjunctive** and is not fully
characterised: the last-rendered step's content must be deferred into its own streamed row,
*and* that row must still be blocked on its own children when revived. Both depend on payload
volume and flush timing. Measured: as shipped, `#traps` warns; with `traps` moved to index 0,
`#ai` warns; with `traps` removed entirely, the sweep is **clean**, which "it follows the last
content flushed" alone does not explain. So it is not the id, and it is not the last index
either.

**The original entry's first probe is disproved, not confirmed.** It stubbed every step's
content at module scope and recorded "still warns". Re-run, that comes back clean — with the
content stubbed, all 22 contents are inline, no lazy exists anywhere, and there is nothing to
warn about. Content volume is what causes the last content to be outlined at all. A first
version of this closure called that probe correct on the entry's own say-so, inside a
document whose subject is a record that could not be trusted, and a review caught it.

Eighteen probes could not close it because they were all searching for an array with a
missing key, and no such array exists.

The "`warnOnInvalidKey` recursing, which suggests a nested array" note in the original entry
was the one real clue and it was read one word wrong. That function's only recursion is its
`REACT_LAZY_TYPE` case. It was a nested lazy, not a nested array.

Evidence: RED with the pin removed (1 failed, `/stages/03-architecture#traps`), GREEN with
the fragment (1 passed, 42.4s over 76 URLs), and a teeth check that reverted **only**
`<>{step.content}</>` and left the comment, which failed with the same message at the same
URL — run against the original unkeyed form, before review upgraded it to
`<Fragment key="content">`; not independently re-run against the form that shipped, though
the full gate below reconfirms it clean. The prerendered HTML for the stage is 284,405 bytes
at both revisions and diffs empty once
the build id and the chunk filenames are normalised, so the fragment changes no DOM. Two
reviewers reproduced that build independently, and one verified that the wrapper does **not**
swallow genuine missing keys: an array `content` still reaches `reconcileChildrenArray` and
still warns. Gate on the branch: lint 0, typecheck 0, **660/82**, build clean, audit
**18/18**, `test:dev-console` **1/1 unpinned**.

**The pin retired itself exactly as D-86 designed.** Removing it is what produced the failing
test; the `KNOWN` entry and its `toBeGreaterThan(0)` assertion are gone from
`e2e/dev-console.spec.ts`, and the sweep now asserts an empty `warnings` array outright.

Kept below: what the entry recorded while it was open.


Found by `pnpm test:dev-console` on its first honest run, which is what TD-35 was opened
for. React logs *Each child in a list should have a unique "key" prop*, attributed to
`Stepper`'s render — and TD-35's own entry records that React names the **rendering**
component, not the defective one, which is why grepping for the named component finds
nothing.

What is established, all of it measured:

- Deterministic. Five fresh-context runs, five warnings.
- Stage 03 only. `/stages/04-project-setup#traps` and `/stages/05-development#traps` are
  clean across the same runs, so it is not "the last step of a stage".
- That step only. The other 21 stage-03 step URLs are clean in fresh contexts.
- It fires during a React **update**, not the initial paint. The stack bottoms out in
  `performWorkOnRootViaSchedulerTask` → `reconcileChildrenArray` → `warnOnInvalidKey`,
  with `warnOnInvalidKey` recursing, which suggests a nested array. The hash-driven
  `setActive`/`setSeen` is the update in question: `/stages/03-architecture` with no hash
  never warns.
- **It is not the traps panel's markup.** Replacing that panel's entire content with a
  stub — marker verified live in the same page the console was captured from — still
  warns. Removing `<References>` alone also still warns.

Ranked High because it is a real defect in shipped UI on the project's largest stage, and
because it went unseen for the entire life of the app: the production audit cannot see
this family at all, which is the whole of TD-35.

**Pinned, not hidden.** `e2e/dev-console.spec.ts` carries one `KNOWN` entry for exactly
this URL and message so the command ships green, and the pin asserts the warning **still
fires** (**D-86**). Fix this and that test goes red telling you to delete the entry.

**Investigated 2026-08-24, root cause not found, and the characterisation changed
completely.** Eighteen probes against a live dev server, each in a fresh browser context so
React's per-session dedup could not hide a result. What that established, and it contradicts
the paragraph above:

- **It is not the content of any step.** With *every* step's `content` replaced by
  `<p>{s.id}</p>` at module scope, `#traps` still warns and `#ai` is clean. An earlier
  version of this test built the stub array inside `Architecture()`, which changes the
  `steps` identity on every render and churns `Stepper`'s effect deps — it reported clean
  and was unsound. The module-scope version is the one to believe.
- **It follows the last index, not the step.** Move `traps` to index 0 and `#traps` goes
  clean while `#ai`, now last, starts warning.
- **It is not step count.** Twenty-two steps whose last entry is a synthetic clone of
  `record` is clean. Truncating to 21 is clean. Stage 04 (15 steps) and stage 05 (13) are
  clean at their own last steps.
- **The discriminator is the presence of the step whose `id` is `traps`, anywhere in the
  array** — with it present, the last step warns wherever `traps` sits; with it absent, the
  last step is clean.

**That last point is not yet explicable and the next session should treat it as suspect
rather than as a finding.** Its presence can only reach the render through the tablist,
which renders every step — and stubbing the tablist out entirely still warns. Either one of
those two results is unsound, or the mechanism is something neither accounts for.

Also resolved: an earlier note said stubbing the traps panel content "still warns", filed as
a puzzle. It is not a puzzle. Content is irrelevant, so that result was correct and its
interpretation was wrong.

**Closes with:** re-running the tablist-stub probe first, because it is the single result
that makes the rest incoherent, and a false negative there sent this session down a long
branch. `Stepper`'s own JSX is otherwise exhausted — nav, tablist, panel header and content
were each removed individually and each still warned, while removing the whole return went
clean.
