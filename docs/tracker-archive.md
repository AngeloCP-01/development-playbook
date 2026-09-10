# Tracker archive

Closed technical debt and completed rows older than the current round, moved here
verbatim from `docs/tracker.md` (D-96). IDs are never renumbered, so a citation such as
`TD-44` or `D-22` in a spec, a plan or a code comment resolves to exactly one file —
`web/src/lib/tracker-ledger.test.ts` enforces that. Decisions do not move: the live
tracker keeps the whole decisions ledger, superseded entries included.

Grep this file by ID. Do not read it whole; it exists so that nobody has to.

## Completed (archived)

Rows dated before 2026-08-01. Same columns as the live table.

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
