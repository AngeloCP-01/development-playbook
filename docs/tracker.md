# Development Playbook — Tracker

**Purpose:** the log. What actually shipped, what was decided and why, and what
debt was taken on. Scope and planning live in [task.md](task.md).

**Last updated:** 2026-07-29
**Current phase:** W-3 — stages 01, 02 and **03 (Architecture)** are interactive. Stage 03 is
the densest stage and the **solutions architect's home** — the audience stage 02 feeds but
does not serve (D-37).

**The position has inverted: stage 03's doc is now done, and the app lags it.** `W-3.1` closed
**TD-18**, **TD-21** and **TD-22**, taking `docs/03-architecture.md` from 8 subsections and
300 lines to **13 and 902**, running requirements → HLD → LLD. The round was scoped doc-only
by decision (**D-46**), so `web/src/features/architecture/` still mirrors the eight-subsection
doc. That divergence is **TD-23** and `W-3.2` closes it.

**W-3.1b's doc half is done** (`1db6344`…`3cd19c4`); its app port is the open remainder.

**How it was raised.** An architecture-completeness audit against standard
practice found five clusters of widely-taught material missing from all eighteen docs
(**TD-25**): resilience patterns, consistency and concurrency, safe schema evolution,
statelessness and scaling, and fitness functions. Scope call is **D-49** — completeness beats
length for this stage, standard practice only.

**`W-3.2` is in flight, not queued.** The app port is being built on
`feat/stage-03-app-port` — 31 commits, spec plus a 24-task plan, a nine-step stage, +9,446
lines — so it lands first and `W-3.1b` follows it.

**Merged.** `feat/stage-03-architecture` landed on `main` as `249bd9d` (`--no-ff`, 47 commits,
branch deleted) after a whole-branch review that returned *Ready with fixes* — six blocking
items and five minor, all resolved, including SQL that would not run and a checklist item
ticked for work deliberately deferred. **Pushed** — `origin/main` is at `249bd9d`, so the
long-standing local-only backlog is cleared and CI has a real branch to run against.

Quality gates remain live: prettier (skipping markdown, see the build note below), eslint at
`--max-warnings 0`, **136 vitest tests across 11 files**, a **10-test audit suite sweeping 20
URLs** (stage 03's six step hashes added by hand — TD-12), lefthook, and CI. Everything
since `82a980b` was local until 2026-07-29, when `main` was pushed and CI ran green on the
stage 03 merge (`30426083363`). `main` and `origin/main` are in sync at `249bd9d`; the user
handles pushes.

**The gate proved itself.** CI's first real run went red on a genuine bug — `PageProps`
is generated into `.next/types/`, so typechecking before building fails on a clean
checkout while passing locally forever. Fixed at the source with a `typecheck` script
both CI and the hook call. This is the exact class of bug CI exists to catch, and it
arrived unprompted on day one.

**The gate is now enforced.** Branch protection required making the repository public —
GitHub Free enforces rulesets on public repos only (D-26). CI history reads red, red,
green, green across the typegen fix. TD-10 closed; W-4 is fully done.

Next round is W-3 (stage 03) or W-5 (deploy).

---

## Completed

Conventions ported from `SmartJobSearchCRM`: evidence cites a SHA, a count, or what a
review caught — never just "done". Every entry records what it deliberately deferred,
because scope creep is invisible otherwise.

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

### Verification standard used

Every W milestone was checked with the same three passes, run against a live
build rather than asserted:

1. **Contrast** — every distinct text/background pair, both themes, all steps
2. **Responsive** — 320→2560px, horizontal overflow and sub-44px touch targets
3. **Console** — zero errors in a clean browser context

These scripts were written ad hoc and thrown away each time. Committing them is
**TD-5**, and it is the single highest-value item in W-4.

---

## Decisions

Recorded when made. Superseded by a new entry rather than edited — the record
of what was believed at the time is the point.

| # | Decision | Reasoning | Consequence |
|---|---|---|---|
| **D-50** | **Executable content in a doc gets executed, not read.** Any SQL, shell or config a stage document tells a reader to run is run against the real thing before the round closes | W-3.1b's plan said "read any SQL as SQL" (D-48) and the round did exactly that — and reading missed two defects a whole-branch reviewer then found in four minutes by starting a `postgres:17` container. The backfill example corrupted every single-word name (`strpos` returns 0, so `substr(name, 1)` returns the whole string, giving `last_name = first_name`) and its own "repeat until zero rows" comment was false, because one null name made the loop never terminate. Both were in the paragraph lecturing the reader about *silent, plausible* migration bugs. "Read code as code" and "run code" are different instructions, and only the second one catches a wrong result from correct-looking syntax | The W-3 review already executed the reassembled DDL against a live PostgreSQL, so this is a return to a standard this project had and dropped rather than a new one. Cheap: one `docker run`, and the whole round's DDL plus the backfill loop plus the partial-unique-index behaviour were verified in three commands. Applies to any stage doc that ships a runnable snippet — 04, 05, 11, 12 and 13 all will |
| **D-49** | For stage 03, **completeness beats length**, and the content stays to **standard, widely-used practice**. The doc may grow past 902 lines; it may not grow by reaching for the exotic | The project owner's call, made in response to the TD-25 audit and explicitly overriding the length caution recorded in D-45: *"03 may seem bloated now but I'll prefer that completeness instead of worrying about it having too many, let's just make sure we do the standard / widely used practices."* The reasoning holds up — the playbook's stated job is to teach ground the reader has not worked in, and a reader who meets resilience or consistency vocabulary for the first time in a job interview was failed by the stage, not by the length budget. The second half of the decision is the real constraint: **standard** is the filter. Circuit breaker and expand-contract are in every architecture curriculum; bulkhead, sharding and CQRS-with-event-sourcing are not things a solo developer needs taught, only named | D-45's "argue against this precedent" note is **superseded for stage 03 specifically** and still stands for stages 04–18, which have no comparable teaching load. Length stops being the check, which means something else has to be: the consultability pass (look three questions up from headings alone) becomes the gate that matters, and a table of contents moves from nice-to-have to likely necessary. Scope discipline moves from "how long is it" to "is this standard" |
| **D-48** | A round's **final fix wave gets its own verification pass**. The wave that answers a cold-reader or review report is not covered by the report that prompted it | W-3.1's last fix wave (`7a5108f`) shipped after the cold-reader pass, so nothing checked it — and it contained the doc's only unrunnable SQL (a `REFERENCES teams(id)` with no `teams` table) plus a tenant-key comment demonstrating the opposite of its own claim. Both were caught by the whole-branch review as I2. The pattern is structural, not carelessness: the wave exists *because* verification found something, so by construction it lands after verification ran | Re-run the cheap checks over the fix wave's own additions — the skim/consultability pass, and for anything with code in it, read it as code rather than as prose. A full cold-reader re-run is too expensive per wave; the point is that "verified" attaches to a commit range, not to a round |
| **D-47** | The glossary is a **source of doc defects, not only a convenience**. `terms.ts` gets audited when a doc gap is fixed, before the prose is called done | `Authorization` was defined as "the check that this particular record belongs to this particular caller" — TD-18's G3 defect verbatim, sitting in the single source (D-36) that generates `reference/glossary.md` and the app's inline definitions. Three tracker entries and a cold-reader pass had all missed it, because every one of them was reading prose. A doc-only fix would have shipped the corrected paragraph and left the wrong definition authoritative in two other surfaces | Cheap and mechanical: when a round fixes a concept in a stage doc, grep `terms.ts` for that concept first. The failure mode is specific to single-sourced content, so it will recur as more of the app moves that way |
| **D-46** | W-3.1 ships **doc-only**; the app port is its own round (**W-3.2**), and the divergence is recorded as **TD-23** rather than left implicit | Stage 03's app was already at D-38's ceiling of five content steps plus AI, and the round adds five sections — so the port needs a step structure that does not exist until the prose settles. Porting against moving prose means doing it twice, and the app mirrors more than the additions: `scoring.ts` carries the DDL annotations, the interrogation set and the reversibility lists, all three of which this round corrected. The alternative considered was one round covering both, rejected as a review surface the size of the original 24-commit stage build | `CLAUDE.md` permits the doc/app duplication but not widening it silently, so the debt is filed with its reasoning. W-3.2 supersedes D-38 with the shape the doc proved, and must state a new ceiling rather than "stage 03 is special" |
| **D-45** | Stage 03 takes the **full HLD/LLD treatment**, accepting a ~900-line doc — 2.4× the next longest stage *(recorded as 898 when written; the doc was 902. Corrected 2026-07-30 — the figure was propagated four more times before a review caught it)* | The project owner chose this over a lighter ~450-line option that would have taught the HLD questions without adding a named artifact. The brainstorm recommended the lighter one; the fuller one is defensible because stage 03 is the densest stage and the solutions architect's home (D-37), and because the lighter version leaves TD-22's core complaint standing — Artifacts asking only for "a one-paragraph description plus a diagram only if it clarifies". D-44's move applies a second time: teach the full apparatus, keep the stage's own answer, and name what is deliberately not adopted | The doc is now far out of family on length, and consultability becomes a real risk rather than a theoretical one. Mitigated by a check the cold-reader pass structurally cannot run (a cold reader reads linearly): three questions looked up from headings alone, scoring 4/5 with two misfilings found and fixed. If a future stage proposes the same treatment, this decision is the precedent to argue against, not for |
| **D-44** | Stage 03 will **teach the architecture styles trade-off, including microservices** — without changing its recommendation. Monolith-first, modular boundaries and defer-aggressively all stand | The playbook's stated job is that it "doubles as a learning tool — it will cover ground I have not worked in, so stages need to teach, not just remind." A reader who has never seen microservices cannot evaluate why monolith-first is right *for them*; they can only take it on faith, which is the same failure mode as G3 in TD-18 — a confident answer arrived at without understanding. Research confirmed the current recommendation is well-supported ("the days of building microservices-first as a default are over"), so the gap is not that the advice is wrong but that a reader cannot place it. The initial recommendation from research was to leave microservices out as off-stance for a solo developer; the project owner overrode it, correctly — knowing what you are not doing, and why, is the thing that makes the choice a decision | The round adds an architecture-characteristics step and a styles comparison covering monolith, modular monolith, microservices, event-driven and serverless, each stating what would have to be true to choose it. The stage's own answer stays where it is, but arrives as a conclusion. Recorded here because a future reader will otherwise read the microservices content as drift from the solo-first stance |
| **D-43** | `DeferredList` ships in the **decide** step, not `reverse` as the spec and plan both specified | The spec's argument for `reverse` — "the defer list is the reversibility test applied to infrastructure" — is real, but shipping it there would pull "Defer aggressively" from its own eighth position in the doc to first, breaking the 1:1 mapping the app's six steps otherwise hold against the doc's section order (reversibility → model → schema → one app → boundaries → auth → ADRs → defer aggressively). `decide` already closes on the defer list as the cheap end of the axis the stage opens on, which the whole-branch review found to be the tighter seam. `reverse` was also already an axis figure plus a six-row scored exercise before adding a fourth component | A deliberate deviation from the spec and plan, recorded at the level that authored it — the same convention D-40 established for `SplitTrigger`'s candidate count. Caught unrecorded by the whole-branch review (M2); no component moved to produce this entry, it only fills the gap in the record |
| **D-42** | Source citations in code comments and plans name a **heading**, not a line number. A range is used only where the exact lines are the point, and then it names the heading too | Line numbers are coordinates in a document that moves, and nothing in lint, typecheck, the unit suite or the audit suite can tell that one has drifted. The evidence is not theoretical: a single audit of `web/src/` found **14 of 33 citations wrong** — four staled by this round's own doc edits, ten inherited from the stage 02 round, the worst off by ~86 lines. Every one of them looked perfectly well-formed. Headings drift only when someone renames a section, which is a deliberate act that shows up in a diff, rather than a side effect of inserting a paragraph three sections earlier | Cite `docs/02-planning.md, "Cut to the core"` rather than `:63-64`. Six such citations already existed (`ReversibilityAxis`, `AIArchitecturePlays`, `CutTable`, `DoneStatement`, `HorizonBands`, `HorizonTriage`) and all were still correct after two rounds of doc edits, which is the argument in miniature. Where a range is genuinely needed — a transcribed DDL block, a quoted template — keep it and pair it with the heading, so a stale number is self-evidently repairable. A future check could assert that each cited heading exists |
| **D-41** | The pattern library gains **annotated artifact** (`SchemaInspector`); the taught-then-recorded pairing does **not** get a row | Two candidates were judged rather than assumed. The annotated artifact earns one because the authoring job is different from the click-node inspector it resembles: you *quote something real verbatim* and then choose which lines teach, rather than authoring a structure where every node is selectable. It carries constraints the existing row does not — leave structural lines inert, give the block its own `overflow-x-auto` container with `tabIndex={0}`, no semantic colour. The deciding argument is recurrence: setup has config files, CI/CD has workflow YAML, deployment has migration steps, and none of those is a "diagram, tree, or pipeline", so the existing row would not send an implementer here. The taught-then-recorded pairing (`ModelInterrogation` → `DomainWorksheet`) is a **composition of two rows that already exist** — no new component, no new constraint, no new a11y requirement — so it became a clause on the `Persisted worksheet` note instead | `PATTERNS.md` gains one row and two sharpened notes rather than two rows. The non-obvious half of the rejected candidate (reuse the *same questions* across exercise and worksheet) is recorded where an implementer will actually meet it |
| **D-40** | `SplitTrigger` ships **six** candidates, not the four-plus-one the spec proposed — and this is recorded as a **plan-authored refinement**, not implementer drift | A set where five of six answers are "yes" can be scored without reading it; the reader learns the pattern of the exercise instead of the judgment it teaches. Four-and-two forces every row to be read. The sixth entry (`codebase-tidier` — "the codebase is getting large and a service would be tidier") was confirmed by review as genuinely sourced from the doc's Traps and "Boundaries inside the monolith" sections rather than invented to pad the count | Deliberate deviations from a spec are recorded at the level that authored them. This one was the plan's, so a reviewer comparing component to spec finds the reasoning here rather than filing it as drift |
| **D-39** | Stage 03's worksheet records the **domain model**, not an ADR | The stage's five questions about your own domain are the thing the reader cannot get anywhere else, and they chain: the four interrogation questions are asked first against the doc's worked example, then again as free text against the reader's own product. An ADR worksheet was rejected on two grounds — `docs/03-architecture.md:165` defers ADR *format* to stage 10 by design, so stage 03 would have been inventing a template it does not own; and the cold-reader pass then confirmed the doc gives no example, length, status field, naming or location for an ADR (G9), so a worksheet would have had nothing to scaffold from | `architecture-sheet.ts` holds five keys; the ADR stays taught (`ADRAnatomy`) rather than filled in. If stage 10 later fixes a format, an ADR worksheet becomes cheap and belongs there or here by then, not before |
| **D-38** | A dense stage may run to **five content steps plus the AI step**. This is a **ceiling for dense stages, not the new default** | `PATTERNS.md` says 4–6 content steps and stage 03 is the densest of the eighteen — nine figures, four exercises, an inspector and a worksheet. Grouping it into four would have put the schema inspector and the boundary map in the same panel, which is two unrelated judgments competing for one screen. Five is the honest grouping for this content. It is explicitly not a licence: the guideline exists because a stepper stops being navigable when a step is a scroll, and stages 04–18 should still aim at 4–6 | The 4–6 guideline stands and governs *content* steps; the AI step remains standard beyond it (D-35). A stage proposing more than five content steps needs the same argument this one made, in its spec |
| **D-37** | The playbook's audience stays "solo but production-grade developer"; PM and solutions-architect readiness are deliberate boundaries, not gaps to close in stage 02 | Two cold-reader persona tests confirmed it empirically. A PM persona found the doc a *primer, not a tool* (it skips dates, stakeholder roadmaps, resourcing — the solo scope showing its edge, 5 blocking-for-PM gaps). An SA persona found it a *feeder* that scopes work and hands architecture off *by design* (6 blocking-for-SA gaps, all stage-03 content). Both sets of gaps are the scope boundary doing its job, not defects — patching them into stage 02 would blur the structure both tests confirmed works | Stage 02 is complete for its scope; SAs are served by building **stage 03** (their home), PMs would need a playbook-wide scope expansion (deferred, not planned). Reports in `.superpowers/sdd/cold-reader-{pm,sa}.md` |
| **D-36** | `terms.ts` is the single glossary source (markdown generated as a snapshot); stage metadata is guarded by detection, not generation | Exploration narrowed both debts. TD-3's richer shape belongs in code, and generation with `toMatchFileSnapshot` closes it with zero new tooling (regenerate via `pnpm gen:glossary`); the 16 arch/ops terms migrated in are used inline by stage 03+. TD-2's only real duplication is the title — the blurb is two purpose-built strings (doc subtitle vs UI tooltip) that diverge for 15/18 by design, so a title-only sync test is right and doc-header generation was rejected (it would inject generated lines into hand-authored prose for a two-field payoff) | `glossary.md` grew 18→35 and carries a "generated, do not edit" header; a term or a stage title now lives in one place; stage 03 is unblocked |
| **D-35** | Every stage carries its own "AI plays" section, in both the doc and the app, tuned to that stage's work | Stages 01 and 02 both earned real value from naming where agents help and where they mislead, and the failure modes are stage-specific (discovery: don't seek validation; planning: don't accept a padded plan; architecture, testing, incidents will each differ). Making it a standard per-stage section rather than a one-off means the guidance propagates instead of being reinvented. Generalizes D-34 | Added to the W-3 per-stage checklist and PATTERNS; a per-stage AI-plays tracker lives in `task.md`; the 7-step shape is now the norm for a built stage, not an exception |
| **D-34** | Stage 02's AI section goes in both the doc and the app, and the stage runs to 7 steps; the doc names stable in-environment tools, not install counts | The user asked for AI content "just like discovery," but chose doc+web where stage 01 is app-only — more complete, at the cost of an asymmetry (TD-15). The 7th "AI plays" step is the first past the 4–6 guideline, so `PATTERNS.md` records it as a recognized addition rather than drift. Install counts and unvetted third-party skill *contents* stay out of canonical prose — they date and I have not audited them — so the doc leans on the mechanism (Subagents/Skill/MCP/Slash command) plus stable tools, with find-skills/skills.sh as the pointer | New per-stage pattern (optional AI step) recorded in PATTERNS; stage 01 doc now lags (TD-15) |
| **D-33** | Stage 02 teaches value-vs-effort for backlog ordering, named as such, with RICE/ICE/MoSCoW as the heavier alternatives | A cold-reader test showed the stage had no method for ordering the "Next" list, only an anecdote. The user asked specifically for standard, widely-used practice. Research confirmed the impact-effort matrix is the named lightweight standard for small products, and it reuses the stage's own S/M/L sizing rather than inventing a scale. An earlier draft's "pain × frequency" was a homegrown coinage; it survives as the *value* half of value-vs-effort | The Risk/Open-question split is likewise grounded in the RAID vocabulary rather than invented; a 5th reference (Atlassian prioritization) points readers to the fuller frameworks |
| **D-32** | Doc completeness is tested with a "cold-reader" agent: it may read only the one stage doc, is forbidden its own domain knowledge, and must flag every gap rather than fill it | Opinion cannot tell whether a teaching doc works for a beginner; the author always knows too much. Running an agent that plans a *different* product from the doc alone turns "is this complete?" into an empirical list of exactly where a beginner stalls. It found two real content defects in stage 02 that four rounds of human-style review had missed | A reusable QA pass for every stage doc; stage 02's re-run confirmed all four fixes landed. Worth a `docs/learnings/` guide once a second stage uses it |
| **D-30** | The horizon roadmap lives inside stage 02, not as a 19th stage | Asking where a roadmap belongs surfaced that "vision" appears in none of the 18 docs. A separate Roadmap stage was considered at two placements and rejected at both: *after* architecture inverts a stated dependency (`docs/03`'s entry criteria already require 02's scope), and *before* it splits one activity in two — every source treats roadmapping as a step of product planning. Either placement renames 15 docs across 20 files and breaks the `exactly 18 stages` invariant | Stage 02 gains a dateless now/next/later section; the eighteen-stage count stays load-bearing and test-enforced (`stages.test.ts:9`) |
| **D-29** | Stage 02 is *product* planning, and the doc is amended to say so | The stage taught product planning (its "cut to the core" is Atlassian's roadmap step almost verbatim) but never named it; MVP and roadmap were absent from all 18 docs. Moving slicing/estimation into stage 03 was rejected — 02 attacks layer-first sequencing by name, so scheduling slices after architecture reintroduces the waterfall it exists to kill | `docs/02-planning.md` retitled and reframed; the doc/app agree per the README's own rule (`2bd421b`) |
| **D-28** | Stage 01→02 chain via a read-only shared sheet, not a shared store | The carry-forward makes the two stages a real chain. A shared `playbook:project` store was rejected as premature — it would make stage 01 a migration target and fix a schema before stages 03–18 have said what they need. Read-only carry-forward gets the chain with none of the coupling | `src/lib/discovery-sheet.ts` owns the shape both stages import; stage 02 reads, never writes, stage 01's key; the extraction also pays down one instance of the TD-2/TD-3 duplication |
| **D-1** | 18 flat stage docs, not 7 phases or 21 steps | Granular enough to look things up; flat enough to navigate | More files to maintain |
| **D-2** | Opinionated and stack-specific over stack-agnostic | Advice you can act on immediately beats advice you must translate | Docs age with the stack; **TD-1** is the first instance |
| **D-3** | Baseline is solo but production-grade, with team callouts | Matches how the author actually works | Every doc carries a "Scaling to a team" section |
| **D-4** | Reference docs only — no templates, no skills | Templates derive from good docs cheaply; the reverse does not | Deliberately narrower scope |
| **D-5** | Numbering is for lookup, not sequence | CI/CD (11) is wired during Setup (04); 13–18 loop. A numbered list implies waterfall, which the playbook rejects | Every stage states its real cadence in the title block |
| **D-6** | Web app in `web/`, markdown left intact | Keeps the playbook readable in a plain editor and on GitHub | Content now lives in two places — **TD-2** |
| **D-7** | `useSyncExternalStore` for localStorage, not `useEffect` | React 19's `set-state-in-effect` rule flagged the effect version as a real error; the effect also caused a cascading render | Slightly more code; correct hydration for free |
| **D-8** | Stepper state in the URL hash | Makes a step linkable and the back button work | Hash is taken; anchor links inside a step would need another scheme |
| **D-9** | Visual direction: whiteprint (light) / cyanotype (dark) | Both are real drawing artifacts, so dark mode is a second drawing rather than an inverted filter | Light mode is the primary designed mode, which is unusual for dev docs |
| **D-10** | Accent colour ≠ semantic colour | Orange means *attention*; green means *go*. They were the same token before, so "worth building" rendered in the brand colour | Components must pick the right one deliberately |
| **D-11** | Sidebar rail appears at `lg` (1024px), not `md` | At 768px a 288px rail left the prose column too narrow to read | Tablets get the drawer, same as phones |
| **D-12** | Terms expand on click, not hover | Hover excludes touch and keyboard; a definition unreachable on a phone is not a definition | Slightly more markup per term |
| **D-13** | Display type sized with `clamp()` | Expanded caps are wide by nature; "DEVELOPMENT" overflowed a 320px viewport at a fixed size | No per-breakpoint type steps to maintain |
| **D-14** | Removed the drafting grid background | Flagged as disruptive; softening was not enough. The sheet reads as technical from the title block and linework without it | Lost some texture; gained legibility |
| **D-15** | Wide container (1400px) + per-element measure cap | Wide screens wasted space, but unconstrained prose is unreadable. `main :is(p, li)` caps at 68ch by default | New text elements inherit the cap automatically; opt out with `.measure-full` |
| **D-17** | Adopt `SmartJobSearchCRM` working conventions wholesale | They are established across ~500 commits and already suit how the author works; inventing a second set would fragment two active projects | `CLAUDE.md` now carries git, review and TDD conventions verbatim. P-6 folds them into the stage docs |
| **D-27** | Stage 02 is built before stage 03, reversing the original order | The first ordering ranked by teaching value alone. It missed that stage 01 explicitly hands off to planning and currently lands on a placeholder, and that proving `PATTERNS.md` transfers is safer on a 211-line stage than on the densest one | `docs/task.md`'s W-3 order revised; `KICKOFF.md` scope updated |
| **D-26** | The repository is public | Branch protection is unenforceable on a private repo under GitHub Free, and this is a playbook with no secrets. Public also means unlimited Actions minutes, which the browser audit job consumes quickly | The gate is real rather than advisory; commit history and author emails are public |
| **D-25** | Typechecking goes through a `typecheck` script, never bare `tsc` | Route types are generated into `.next/types/`; a bare `tsc` passes locally off a stale build and fails on a clean checkout. Putting typegen inside one script means CI and the hooks cannot drift apart | `pnpm typecheck` = `next typegen && tsc --noEmit`, used by CI and pre-push |
| **D-24** | Stages close with 3–5 curated outward references, capped by a test | A reference list that grows unbounded stops being read; the cap forces the question "does this add something the stage does not". Each entry states what it adds so the click is judgeable | `src/lib/references.ts` + `References`; stage 01 cites Torres, Cagan, Scrum.org, Maze, Atlassian |
| **D-23** | The audit suite runs in CI against a production build, not as a local convenience | The dev server differs in rendering and console noise, and a check that only runs when remembered is TD-5 all over again | `test:e2e` uses playwright's webServer on :3100; CI's audit job needs verify first |
| **D-22** | ESLint kept over Biome; Prettier added; lint gated at `--max-warnings 0` | Biome is ~80% of the ESLint ecosystem, but this repo's best lint catch (`set-state-in-effect` on `useLocalStorage`) is ESLint-only and Next ships the config. The warnings gate exists because eslint exits 0 on warnings — proven by a teeth check that let an unused variable through twice | Closes TD-1; Biome documented in `stack.md` as the non-Next alternative |
| **D-21** | Stage 01's interaction patterns are documented as a reusable library, not left implicit | The reader praised the progressive disclosure, inline term popovers, and guess-then-reveal exercises specifically; those need to reach stages 02–18 rather than being reinvented or watered down | `web/PATTERNS.md`: the principle (interact to learn), the shared components, a pattern-per-content table, and the a11y baseline |
| **D-20** | Documentation gets a `humanizer:humanizer` pass before it is done | The stage docs are the product, not scaffolding, so they cannot read as generated filler; this project's prose leans on em-dashes and the rule of three | A documentation-pass convention in `CLAUDE.md`; P-6 and every W-3 stage carry the step |
| **D-19** | Superpowers skills are the process, not an optional aid | Every substantive change in `SmartJobSearchCRM` ran through them (`executing-plans` and `subagent-driven-development` alone appear 70+ times); TDD is the iron law the whole verification standard rests on | `CLAUDE.md` has a skills-as-process section with a phase→skill table; P-6 folds the same into stages 05/06/07 |
| **D-18** | Coordination docs are committed here, unlike the source project | There, `TASKS.md`/`TRACKER.md` sit untracked at a repo-pair root. This is a single repo and the tracker is part of the deliverable — a playbook that hides its own record would be odd | They appear in history and in review diffs |
| **D-16** | Figures numbered across the whole stage, not per step | "Figure 4" should mean one thing regardless of which step you entered on | Numbers are passed explicitly, so inserting a figure renumbers by hand |

---

## Technical debt

Ordered by cost of leaving it. Each names where it lives and what closes it.

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

### TD-9 — Figure numbers are manual · **Low**

`<Figure n={4}>` is passed explicitly (**D-16**). Inserting a figure mid-stage
means renumbering the rest by hand, and nothing catches a duplicate or a gap.

Now a confirmed instance, not a hypothetical: stage 02 numbers its figures
**1, 2, 3, 4, 6, 7, 8, 9** — `Planning.tsx` has no Figure 5. Found by stage 03's Task 15
review while checking its own numbering (which is correct: 1–9 ascending in DOM order,
verified by grepping all 17 sibling files for competing `<Figure>` numbering). A reader
who notices the gap has to wonder what they missed.

**Closes with:** a lint rule, or a build-time check that numbers are contiguous. The
stage-02 gap is a one-character fix once something detects it — but fixing it blind, with
nothing to catch the next one, is how it happened the first time.

### TD-11 — `DESIGN.md` names tokens the code does not expose · **Medium**

`web/DESIGN.md` documents the accent and semantic tokens as `signal` / `stop`, but every
shipped component and the CSS use `brand` / `danger` (with `-tint` / `-fg`). Found while
briefing stage 02's component agents — the doc nearly sent an implementer at a class name
that does not exist. Same class of drift as the resolved TD-1, one layer down.

**Closes with:** pick one naming and make the other match. The code is canonical (a
rename there is a wide diff for no behaviour change), so `DESIGN.md` should adopt
`brand`/`danger`, or note both names explicitly.

### TD-12 — The audit `PAGES` list is hand-maintained · **Medium** *(was Low)*

`web/e2e/audit.spec.ts` hard-codes each step hash to sweep (`#done`, `#cut`, …). Every new
`ready` stage must add its hashes by hand, and nothing fails if they drift from the stages
actually live — a stage could ship unaudited and the suite would still pass green. First
flagged as a W-4 minor; stage 02 added six hashes by hand, and **stage 03 added six more by
hand** (20 URLs now). Raised to Medium because it has now cost a manual step in every stage
build, and `KICKOFF.md` asserted the opposite — that the suite "sweeps every ready stage's
step hashes" — which is exactly the kind of trusted-but-false claim that lets a stage ship
unaudited. That line is corrected.

**Closes with:** derive `PAGES` from `STAGES.filter(s => s.ready)` crossed with each
stage's step ids, so the sweep tracks the ready set automatically.

### TD-16 — Worksheet placeholder text fails AA, and the audit suite cannot see it · **High** *(was Medium)*

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

### TD-17 — No component-test harness, so a class of regression is ungated · **Medium**

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

### TD-23 — Stage 03's doc and app now disagree about what the stage contains · **High**

Opened deliberately by W-3.1 on 2026-07-29, which was scoped doc-only. This is a debt the
round chose, not one it discovered, and it is recorded so the choice is visible rather than
silent — `CLAUDE.md` permits the doc/app duplication but not widening it unnoted.

`docs/03-architecture.md` is thirteen subsections and 902 lines.
`web/src/features/architecture/` is the six steps built in W-3 (reverse · model · constrain ·
shape · decide · ai) against the eight-subsection doc that no longer exists.

**Why the round took the debt rather than avoiding it.** Stage 03's app already sat at D-38's
ceiling of five content steps plus the AI step, and the round added five sections. The port
therefore needs a step structure that did not exist until the prose settled, and porting
against a moving target means doing it twice. The reasoning is in the spec's Non-goals.

**It is not only additions.** `scoring.ts` holds the DDL annotations, the interrogation set
and the reversibility lists, and all three changed: a fifth interrogation question, indexes
and a partial unique index in the DDL, and the reversibility test promoted out of the AI
section. A port that only adds components would leave the app stating things the doc has
corrected.

**Closes with:** **W-3.2**, which supersedes D-38 with the shape the doc proved. The 14 new
terms already in `terms.ts` are defined but not yet used inline, which is the wiring that
round does.

### TD-19 — Scored radiogroups have no roving tabindex · **Medium**

`SeverityScorer` and `Toolkit` (discovery), `SizeScorer`, `HorizonTriage` and
`DoneStatement` (planning), `ReversibilityTable`, `ModelInterrogation` and `SplitTrigger`
(architecture) — every scored or tabbed exercise across the three built stages — departs
from the WAI-ARIA APG's radiogroup pattern: each `role="radio"` is its own tab stop rather
than the group being a single stop with arrow keys moving focus inside it.

Raised and ruled on four separate times during three stage builds (T9/M2, T10/M4, T10/M5,
T11/M1), correctly each time — matching the existing convention beat inventing a
one-stage fix — but no ruling landed anywhere durable, so the same finding kept
resurfacing with nothing to point at. Recorded here so the fifth stage to raise it finds a
tracker entry instead of reopening the question.

**Closes with:** one shared roving-tabindex behaviour (`tabIndex` 0 on the checked or
first option, -1 on the rest, arrow keys move and check, Home/End jump to the ends) that
every scored radiogroup adopts, so the fix lands once rather than per component.

### TD-20 — Score live regions mount already populated, so the first exercise commit is announced silently · **Medium**

`ReversibilityTable.tsx:51-58`, `ModelInterrogation.tsx:49-56` and `SplitTrigger.tsx:44-51`
(stage 03), and their stage 01/02 equivalents, wrap the running score as
`{answered > 0 && (<span aria-live="polite">…)}`. The live region does not exist in the DOM
until the reader's first answer, so it arrives already holding content — a screen reader
has nothing to have been watching, and content that appears pre-populated is not reliably
announced. The first scored commit of every exercise in the app is silent for that reader.

The correct pattern already exists three lines below the incorrect one in the same files:
each row's verdict region is `<div aria-live="polite">`, always mounted, with only its
contents conditional on whether that row has been answered. Nobody had to invent a fix,
only apply the one already sitting in the file.

Same provenance as TD-19: raised and correctly deferred to existing convention four times
(T9/M2, T10/M4, T10/M5, T11/M1) with no tracker entry until now. Worth recording precisely
because this stage's own Definition of Done says "Deferred decisions listed explicitly, so
deferral is visible rather than forgotten" — four deferrals of the same finding, recorded
nowhere a future reader would look, is the playbook not taking its own advice.

**Closes with:** always mount the score header's `aria-live` region and make only its
contents conditional, matching the per-row verdict pattern already in each file. A single
shared score-header component (paired with TD-19's roving-tabindex fix) would close both
at once.

### TD-14 — Stage 02 exercise cards render at two different widths · **Low**

`HorizonTriage` builds its item cards from `role="list"` divs (full container
width), while `CutTable`, `DoneStatement` and `SliceSequencer` use real `<li>`
cards that hit the 68ch measure cap. On a wide screen the horizon cards are about
twice the width of the others on the same stage. Found by the final whole-branch
review (M2). Cosmetic, not wrong — the `<li>` cap is the established stage-01
pattern (`QuestionLab`), and the horizon divs were a deliberate escape for their
own reason — but the two now sit in one stage at visibly different widths.

**Closes with:** pick one width for exercise cards stage-wide — either cap the
horizon cards to the measure, or lift the others. A polish-pass call, not a bug.

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

---

## Bugs found and fixed

Kept because the pattern is more useful than the individual fixes: nearly all of
these were found by checking rather than by reading.

| Where | Bug | How it surfaced |
|---|---|---|
| `useLocalStorage` | setState inside an effect caused a cascading render | React 19 lint rule, treated as a real error rather than suppressed |
| `layout.tsx` | Theme script read a raw string, but the hook writes JSON — theme silently stopped applying | Checked the stored value rather than trusting the toggle looked right |
| `Worksheet` | Referenced `hydrated` after the hook stopped returning it | Build failure |
| `DiscoveryFlow` | `bg-fg-subtle` is not a real token; three status dots rendered invisible | Screenshot review, then a sweep of every colour class |
| `OpportunityTree` | Legend promised colour coding the nodes did not show | Screenshot review |
| `DiscoveryFlow` | Component defined inside render — state reset every render | Lint |
| Sidebar | Group labels were `<h2>` before the page `<h1>`, breaking the heading outline | Accessibility structure check |
| Palette | `--faint` at 2.99:1, accent at 4.11:1 — both below AA | Exhaustive contrast audit |
| Home hero | "DEVELOPMENT" needed 333px in a 280px box at 320px wide | Responsive sweep |
| `ProductDiscovery` | JSX dropped the space around inline `<Term>`, rendering "solution treeis" | DOM inspection after spotting it in a screenshot |
| Home index | Hero placed in a 2-col grid overflowed 137px at 1024px — expanded caps do not fit a half column once the sidebar appears | Responsive sweep at the exact breakpoint |
| Home index | `.measure-full` sat on the `<ul>`, but the global 68ch cap lands on the `<li>`; rows stayed capped and cadence stopped mid-page | Measured the row's right edge against the content edge |
| Lint gate | eslint exits 0 on warnings, so an unused variable passed both the hook and the script — twice | Hook teeth check; fixed with `--max-warnings 0` in both places |
| Ad-hoc audits | The old touch-target sweep excluded `aria-controls` elements wholesale, silently masking inline Term buttons | The committed suite's first run; resolved per WCAG 2.5.8's inline exemption |
| CI typecheck | `PageProps` is generated into `.next/types/` by the build, so `tsc --noEmit` before `build` fails on a clean checkout. Local passed only because `.next` lingered | **CI's first real run.** Reproduced locally by deleting `.next`; fixed with a `typecheck` script running `next typegen` first, used by both CI and the pre-push hook |
| `DomainSketch` | The naive-sketch figure rendered `draft \| sent \| paid`, **pre-answering the interrogation exercise in the same stepper panel** — which asks whether "overdue" is a status or computed | Controller review holding cross-task context. The task reviewer had passed it as faithful to its brief, correctly on its own terms: the brief said three, and the brief was wrong |
| `BoundaryMap` | `EDGE_NAME` hardcoded "allowed"/"not allowed" into each accessible name while only the visible badge derived from `edge.legal`. Correct output today, but flipping the data would tell a sighted reader and a screen-reader user opposite things with nothing failing | Task review. Fixed by appending the suffix from `edge.legal`, teeth-checked by flipping `legal` and proving the name followed — then proving the revert with an empty `git diff` |
| Worksheet placeholders | All three worksheets ship instructional placeholder text at 2.77:1 in light mode | Sampling `::placeholder` by hand after noticing the audit suite keys on `el.textContent`, which a placeholder does not have. **TD-16** |

**Four false alarms worth remembering.** A link checker once reported 124 broken
links — the checker was broken, not the links. A contrast audit reported 1.34:1
— the parser could not read `oklab()`. Both were investigated rather than
"fixed", and the second one still led somewhere useful: it exposed a frosted
alpha background that had no business in a print-derived design.

Stage 03 added two more, both colour, both disproved rather than "fixed":

- A **phantom AA failure** from flipping `data-theme` and calling `getComputedStyle` in the
  same evaluate call. The elements carry `transition-colors duration-150` and
  `getComputedStyle` returns the *used* value, so the read sampled a colour mid-interpolation
  that belongs to neither theme. Decisive evidence: the offending `rgb(173,192,212)` is dark
  mode's `--graphite`, and on a clean reload it exists nowhere in a light render.
- A placeholder probe reporting **7.64:1 light / 1.09:1 dark** for the same colour. It
  resolved colours by assigning to `canvas.fillStyle` and reading the string back; Chromium
  echoes `oklab()` unchanged, so the regex read oklab's lightness/a/b channels as R/G/B. The
  giveaway was physical impossibility — `oklab(0.7334 …)` is pale and cannot composite to
  `rgb(3,6,10)`. Rasterizing instead of parsing gave the real numbers (2.77:1 / 4.44:1), which
  is TD-16.

That is three oklab-parsing incidents. Both traps, and the "the gate is green because it never
looked" case, are written up in `docs/learnings/contrast-checkers-lie.md`.

---

## Process observations

Kept separate from the bug ledger because these are about how the work was run, not
about the code.

### Most of stage 03's defects were plan-authored, not implementer error

Three of the findings on `feat/stage-03-architecture` originated in the **plan**, and the
implementers followed it correctly:

| Finding | What the plan got wrong |
|---|---|
| Task 2 | The task's test block omitted `import '@/test/localstorage-polyfill'`, without which the suite cannot run under `environment: 'node'` |
| Task 5 | Every `docs/03-architecture.md:NNN` citation was written before Task 1 inserted ~48 lines at line 186, so all citations into later sections were stale on arrival |
| Task 8 | `DomainSketch`'s status enum was specified as `draft \| sent \| paid`, which pre-answers the interrogation exercise Task 10 renders in the same panel |

**The pattern worth carrying:** a per-task review sees one diff and judges it against one
brief. All three of these were invisible at that altitude — the Task 8 reviewer explicitly
passed the figure as faithful to its brief, which it was. They surfaced at controller level,
where the cross-task context lives. Two consequences for the next stage build:

1. **Budget for controller-level review of task *interactions*,** not only per-task review of
   task *outputs*. The question "does this task's output undermine another task's output?"
   has no owner otherwise.
2. **Line-number citations go stale the moment anything edits the doc above them**, and
   nothing in the toolchain detects it. See D-42 — the convention is now to cite by heading.
   This round hit it four times: the plan's briefs, the committed `scoring.ts` comment, the
   five citations shifted by Task 17's own two-clause doc fix, and finally `AuthPaths`.
   Auditing the class then found **ten more in stage 02**, stale since that stage's own AI
   section was inserted, one of them off by ~86 lines. Fourteen wrong citations in total.

3. **A grep confirms the shape of a citation; only opening the file confirms it is true.**
   The sweep that missed `AuthPaths` matched `docs/03-architecture\.md:[0-9]*-[0-9]*`, so it
   could only see citations on a line repeating the filename. Invisible to it: bare `:NNN`
   continuations on their own line (the miss), single-line citations with no range
   (`SpikeCard`'s `:285`), and every citation to a different doc (all eleven stage 02
   ones). Two citations were caught **by luck**, sharing a line with their primary. The audit
   that worked opened all 33 cited ranges and checked each against what the comment claimed —
   which also caught two comments that were *misquoting* the doc, a kind of wrong that
   renumbering would never have surfaced.

A fourth finding is the mirror image and worth recording as such: an implementer proposed
adding a rule to `PATTERNS.md` (that a `<Term>` must never be the first child of a `<p>`)
and **review disproved it** by transpiling with the repo's own TypeScript. Position in the
paragraph is irrelevant; the real variable is whether the whitespace between the tag and the
adjacent text contains a newline. The rule would have forbidden a safe shape and still
permitted the unsafe one. It was not added. `PATTERNS.md`'s existing note was sharpened to
state the mechanic instead, so the same false rule is not proposed a third time.

### Long-running agents lose work; persistence has to be incremental

Four agents on this round were terminated mid-flight — a watchdog stall, an account session
limit, and two connection drops. What survived in every case was whatever had already been
written to a file. The instruction that worked was "write the report first, then do the
work, saving after each step": one agent's report persisted at 286 lines with its evidence
intact and the remaining sections explicitly marked OUTSTANDING, which made resumption cheap
rather than a redo. This is now standard for reviewers as well as implementers.

---

## Next up

**Recommendation: one round on stage 03's doc — TD-18, TD-21 and TD-22 together — before
building stage 04.**

Three entries, raised separately, one round. They are three views of the same document:

- **TD-18** is what a cold reader **could not finish** — 14 gaps, 3 blocking.
- **TD-21** is what a reader finishes **without ever learning the vocabulary for** — the
  styles landscape, DDD, the modular monolith taught unnamed.
- **TD-22** is an **activity the stage never runs** — it produces a schema (low-level design)
  with no high-level design above it to justify the shape.

They converge on one point. TD-22's non-functional-requirements step is the same artifact as
TD-21's architecture characteristics, and it is also where TD-18's **G14** belongs — the
reversibility test currently stranded in the AI section, framed as a prompt for a model rather
than the rule the stage turns on. One step resolves a piece of all three. Splitting the work
means opening the same document and the same components three times.

**Sequence them TD-22 → TD-21 → TD-18.** TD-22 probably changes the stage's step structure,
so it has to be settled before the other two are designed against it: if an HLD step lands
between Model and Constrain, the app's six steps and nine figures both change shape, and any
work done on the assumption of the current structure gets redone.



The reasoning, rather than the assertion. Stage 03's app is finished and verified; the doc
underneath it is not. Three of the fourteen gaps are blocking for a reader using the stage as
intended — the DoD makes "authorization pattern decided" an exit condition and the doc offers
only one pattern; "indexes" is a required artifact that appears nowhere else in the document;
races are named as the reason to push constraints into the database and no tool is given that
expresses a conditional uniqueness rule. A reader who follows the stage honestly cannot
finish it.

Three things make this more urgent than another stage:

1. **The app mirrors the doc**, so several fixes are two-file changes (G2 adds an
   interrogation question, G14 moves a sentence that is currently in the AI section into the
   reversibility section — both are ported into `scoring.ts`). That coupling gets more
   expensive, not less, as stages accumulate.
2. **The cold-reader pass is cheap and it works.** It found in one run what four rounds of
   review on stage 02 did not (D-32). Acting on the first stage where it produced blocking
   findings sets the precedent that it is a gate rather than a formality.
3. **Stage 03 is the solutions architect's home** (D-37) — the audience the playbook
   currently serves worst. Shipping it with an unsatisfiable exit condition undercuts the
   claim that stage 02 legitimately defers architecture to it.

Against that: the gaps are pre-existing, the stage is genuinely usable, and building stage 04
would keep W-3's momentum. That is a real argument, and it loses mainly on point 1 — the
coupling.

**Also open, in rough order:**

- **`W-5` (deploy)** — unblocked, and would turn the audit suite into a real post-deployment
  check rather than a local one. Stronger now than it was: three stages are finished, so the
  "deploy matters less while the app has one finished stage" reasoning has expired.
- **`TD-17`** (no component-test harness) — the cheapest remaining way to raise the floor,
  and it gets more valuable with every stage that adds components nothing can render-test.
- **`TD-16`** (placeholder contrast) — a real AA failure on instructional text, plus the
  audit blind spot that hid it. Fix both halves together.
- **`TD-12`** (audit `PAGES` hand-maintained) — now cost a manual step in two consecutive
  stage builds.
- **`P-6`** — the remaining conventions to fold into the stage docs.

Carry into whichever round is next:

- **`TeamNotes` is the convention now** (TD-13 closed): every stage ships its doc's team
  section as a collapsed disclosure, using the shared component.
- **The AI-plays section is enforced, not remembered** — `stage-metadata.test.ts` fails any
  stage whose doc lacks the `### AI in <stage>` heading. Stage 03's doc did not have one.
- **`PATTERNS.md` gained "annotated artifact"** (D-41) — reach for it for config files,
  workflow YAML and migrations, not just schemas.
