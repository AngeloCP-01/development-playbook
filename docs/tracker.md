# Development Playbook — Tracker

**Purpose:** the log. What actually shipped, what was decided and why, and what
debt was taken on. Scope and planning live in [task.md](task.md).

**Last updated:** 2026-07-24
**Current phase:** W-4 merged to `main` (`e7b3afd`, `--no-ff`, branch deleted) and
pushed, followed by stage 01's references section (`cc5b4b0`). Quality gates are live
locally: prettier, eslint at `--max-warnings 0`, 13 vitest invariants, the 9-test audit
suite, lefthook hooks, and a two-job CI workflow. P-5 resolved in ESLint's favour
(D-22). The round fed itself back into stage docs 05/06/07/11 — the
build-notice-drift-amend loop working as intended.

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

### TD-2 — Stage metadata duplicated · **High**

Titles, blurbs, groups and cadence exist in both `docs/NN-*.md` and
`web/src/lib/stages.ts`. Editing one does not update the other, and nothing
detects the drift.

**Closes with:** either parse frontmatter from the markdown at build time, or
declare `stages.ts` canonical and generate doc headers from it. Decide before
W-3 multiplies the problem by seventeen.

### TD-3 — Glossary duplicated · **High**

`reference/glossary.md` holds 17 terms; `web/src/lib/terms.ts` holds 10 with a
richer shape (`short` / `full` / `soWhat`). They already disagree.

This scales badly: eighteen stages will need a few hundred entries.
**Closes with:** pick one source. The richer shape is the better one, so the
likely answer is to generate the markdown glossary from `terms.ts`.

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

**Closes with:** a lint rule, or a build-time check that numbers are contiguous.

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

**Two false alarms worth remembering.** A link checker once reported 124 broken
links — the checker was broken, not the links. A contrast audit reported 1.34:1
— the parser could not read `oklab()`. Both were investigated rather than
"fixed", and the second one still led somewhere useful: it exposed a frosted
alpha background that had no business in a print-derived design.

---

## Next up

**First, and small: finish TD-10.** Turn on branch protection (require `verify` and
`audit`). The deliberate-break step is no longer needed — CI already went red on a real
bug — so this is one settings page away from done.

Then two candidates:

**W-3 starting with stage 03 (Architecture)** — the richest teaching content, and the
first stage to land on a safety net. It will exercise the newer capabilities (term
visuals, references) hardest, and it multiplies TD-2 and TD-3 by every stage added, so
deciding those first is defensible.

**W-5 (deploy)** — unblocked now. Doing it early lets stage work ship continuously per
`docs/13`, and turns the audit suite into a real post-deployment check rather than a
local one.

**Recommendation:** TD-10, then W-3. Deploy matters less while the app has one finished
stage; the safety net matters more with seventeen to go.
