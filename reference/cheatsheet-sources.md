# Cheatsheet gathering list

What to search for on LinkedIn, in the order worth gathering. Design for the hub
that consumes these is parked in
`docs/superpowers/specs/2026-08-14-reference-hub-design.md`.

Each planned sheet lists its future slug and the stage it tethers to, so captures
can be filed against a target rather than piling up unsorted.

## How to search

LinkedIn's post search is weak on keywords and strong on format filters. Two
settings do most of the work:

- **Posts → Content type → Documents.** Carousel PDFs are multi-page, higher
  resolution, and readable directly — a ten-page carousel converts far better than a
  compressed GIF. Run every query below under Documents before Images.
- **Sort by Top match**, not Latest. These graphics recirculate for years; the
  best version of a topic is rarely the newest.

Hashtag search often beats keyword search for this format: `#systemdesign`
`#softwarearchitecture` `#cheatsheet` `#softwareengineering` `#coding`.

Following two or three people who publish this style surfaces more than searching
does. Reliable in this format: ByteByteGo / Alex Xu, Brij Kishore Pandey,
Nikki Siapno, Sahn Lam, Arslan Ahmad, Milan Jovanović (.NET-leaning).

## What makes a capture worth keeping

Good: discrete labelled boxes, directional arrows, eight or fewer concepts, text
legible at 100% zoom. That converts cleanly into rows and figures.

Bad: screenshots of code, dense syntax tables rendered as pixels, paragraphs set in
an image. For those the transcription is worse than writing the sheet from scratch —
capture them as prompts for your own sheet, not as things to reproduce.

**Record the post URL and author at capture time.** The `source` field needs
`{ title, author, url }`, and a GIF with no provenance cannot be published on a live
site. Log it in the ledger at the bottom of this file as you go.

---

## Priority 1 — the ones that pay off immediately

### ~~Git commands~~ · `git-commands` · stage 04 ✓ transcribed 2026-08-24

```
"git commands" cheat sheet
"git cheat sheet" visual
"git undo" mistakes
"git merge vs rebase"
"git reset" soft hard mixed
```

Most of this you can write from your own conventions without a source at all. Gather
for structure and for the commands you have forgotten exist, not for wording.

### ~~Git branching and conventions~~ · `git-branching` · stage 04 ✓ transcribed 2026-08-24

```
"git branching strategy"
"gitflow vs trunk based development"
"trunk based development" explained
"conventional commits"
"semantic versioning" cheat sheet
"pull request" checklist
```

CLAUDE.md already documents this project's own branching policy and commit format,
so this sheet is largely a restatement of decisions already made. Gather comparisons
of the alternatives, not the convention itself.

### ~~Coding standards~~ · `coding-standards` · stage 05 ◐ one of four original topics remains here

```
"clean code" principles           ✓ CLEAN-CODE-principle.webp — moved to its own sheet, `clean-code` (D-90)
"SOLID principles" explained      ✓ SOLID-PRINCIPLES-cheatsheet.jpeg — moved to its own sheet, `solid-principles` (D-90)
"code review checklist"
"naming conventions" cheat sheet  ✗ only found a Godot/GDScript-specific one — wrong domain, keep searching
"code smells" list                ✓ CodeSmell.jpeg — stayed here
"refactoring techniques"
```

SOLID and Clean Code turned out to be design principles, not style rules specific to
this codebase — pulled into a new `Design Principles` group, each with its own sheet
and its own before/after code examples (D-90). `coding-standards` is now just code
smells, plus room for naming conventions, a code review checklist and refactoring
techniques, none of which are claimed yet.

## Priority 2 — the diagram-heavy pair

### Software architecture patterns · `architecture-patterns` · stage 03

Already captured and transcribed to `software-architecture-patterns.md`. Gather
alternates only if one covers patterns the current sheet misses — pipe-and-filter,
hexagonal / ports and adapters, CQRS, serverless.

```
"software architecture patterns"
"architecture patterns" comparison
"hexagonal architecture" explained
"CQRS" event sourcing explained
"monolith vs microservices"
```

### ~~Design patterns~~ · `design-patterns` · stage 03 ✓ transcribed 2026-08-24, all 23 patterns

```
"design patterns" cheat sheet
"gang of four" patterns visual
"creational structural behavioural" patterns
"singleton factory observer" explained
"design patterns" in one picture
```

Twenty-three patterns will not fit one readable sheet. Look for graphics that split
by category, or plan to split it into three sheets at authoring time. Ended up as one
sheet with three sections instead of three sheets — a lookup sheet isn't bound by the
stage panels' four-screen rule, so nothing forced the split.

## Priority 3 — supporting sheets worth having

```
"HTTP status codes" cheat sheet          → api-reference   · stage 03
"REST API" design best practices         → api-reference   · stage 03
"SQL joins" visual                       → sql-reference   · stage 03
"database indexing" explained            → sql-reference   · stage 03
"caching strategies" explained           → caching         · stage 09
"load balancing" algorithms              → scaling         · stage 09
"OWASP top 10" visual                    → security        · stage 08
"docker commands" cheat sheet            → containers      · stage 11
"kubernetes" cheat sheet                 → containers      · stage 11
```

### ~~Testing~~ · `testing` + `playwright` · stage 06 ✓ transcribed 2026-08-28

Gathering started believing stage 06 was chosen but not yet built — a real departure
from the "finished or ongoing stage" reading `containers` above was held back on,
justified at the time because the gathering list already carried a stage-06 entry
before the stage was even chosen. **The port actually shipped and merged the day
before** (2026-08-27, `cad21c1`, `feat/stage-06-testing` deleted) — this round's own
kickoff was working from a status that had gone stale overnight, and did not notice
until after this content was already written. The "ahead of the port" framing below
and in this round's commit is accordingly wrong about its own timing, kept rather than
rewritten, since fixing the record silently would repeat the exact mistake it names.

```
"testing pyramid" explained              ✓ Levels-of-testing-1.jpeg (concept only, not displayed)
"5 types of testing"                     ✓ 5types-of-testing.webp + matching dev.to article, both Prateek Agrawal
"playwright cheat sheet"                 ✓ playwright1/2/3.jpeg (3-page series, page 1 displayed)
```

`testing` and `playwright` are two sheets, not one — the same split `git-commands` and
`git-branching` already use, since a tool-specific quick reference (locators,
fixtures, debugging) is a different shape of content than general testing concepts.

`api-reference` and `sql-reference` already have hand-written draft notes —
`reference/rest-api-best-practices.md` and `reference/10-sql-concepts.md` — gathered
without an image, same as `git-branching` was. Not yet registered or transcribed into
the `Cheatsheet` shape; a later round, not this one.

`containers` (Docker/Kubernetes) is deliberately not gathered yet — it tethers to
stage 11, which has no interactive port. D-62's registered-but-empty pattern would
allow it, but content work is scoped to stages already built (01–05) for now.

> **Correction appended 2026-09-07, not rewritten.** The clause above about stage 11
> having no interactive port stopped being true on 2026-09-07, when stage 11 shipped
> (W-3.11). `containers` is still ungathered, but the reason is now simply that no
> Docker/Kubernetes source has been captured — not the stage's status. The three CI/CD
> graphics gathered for the entry below all *touch* containers and none is about them.

### ~~CI/CD pipeline~~ · `ci-cd` + `github-actions` · stage 11 ✓ transcribed 2026-09-07

```
"CI/CD pipeline" visual guide            ✓ 0141-ci-cd-workflow.png — ByteByteGo, displayed
"CI/CD cheat sheet"                      ✓ cicd-cheatsheet2.jpeg (12-section) — consulted
"devops cheat sheet"                     ✓ cicd-cheatsheet.jpeg (Jenkins/Maven/Terraform/Ansible) — consulted
```

Two sheets again, the `git-commands`/`git-branching` and `testing`/`playwright` split
for the third time: `ci-cd` carries the platform-agnostic pipeline and `github-actions`
the syntax for one runner. `github-actions` was written first, in the stage 11 round,
with no source at all; these three graphics arrived afterwards and are all
tool-agnostic, so they built the concept sheet rather than being forced onto the tool
one.

**Displayed plate shows Jenkins, not GitHub Actions.** Accepted deliberately: on a
concept sheet the flow shape is the content, and the "who plays each role" section is
where the substitution to this project's own runner and platform is made explicit.

Deliberately left out of `ci-cd`: the DevOps sheet's Linux basics, Maven and AWS CLI
command tables, and its interview-questions block. The same call `playwright` made on
its own source — study-guide material, not lookup material — plus a domain question,
since none of it is what stage 11 teaches.

### Observability · `observability` · stage 15

Not yet transcribed. Five text sources, all read 2026-09-08 for the doc round
(`docs/superpowers/plans/2026-09-08-stage-15-doc-round.md`, Task 13b), registered here
per that task's own instruction since they are this stage's W-6 gathering as well as
input to the prose:

1. *Best practices for logging in Node.js* — Atatus → fed `### Structured logs`:
   levels, redaction
2. *Observability vs monitoring: key differences and similarities* — Sujeeth H R → fed
   the opening distinction in `### Three things, in order of value`
3. *The three pillars of observability* — Priya Dharshini → corroborated, changed
   nothing (its three pillars are this stage's three things with a different ordering
   rationale)
4. *Observability with OpenTelemetry: why do we need it* — Tenil Sridhar → fed
   `## Scaling to a team`
5. *Building an observability platform with Prometheus, Grafana and Jenkins* — Kumar →
   fed the one-pane dashboard-reconciliation paragraph; otherwise sheet-only material,
   since it is a self-hosted stack and this playbook's platforms are managed

None of the five is a graphic, so none has a plate to register — text articles, no
`File` column entry below. Author is what each source states; **URL not recorded** for
any of the five, the same gap most of this ledger already carries.

Separately, **ten images are already committed** (`450190c`) for this sheet —
`3-pillars-of-observavilty.jpeg`, `4-Golden-Signals-SRE.jpeg`,
`Microservices-Observavility&Tracing.jpeg`, `SLA-SLI-SLO&ERRORBUDGET.jpeg`,
`latency-metrics.jpeg`, `logging.jpeg`, `mertrics-vs-logs-vs-traces.png`,
`observavility&opentelemetry.png`, `sprinboot-logging-cheatsheet.jpeg`,
`system-design-tradeoffs.jpeg` — but **none is registered and none has provenance**,
unlike the five sources above. This entry does not register them: an author and a URL
are required at capture time by this file's own rule, and asking for those after the
fact is exactly the gap `ci-cd`'s row above shows how to avoid. Ask for the sources
before registering any of them; the `observability` sheet stays untranscribed until
that happens.

Still worth searching — none of the five sources above covers these, and each fills
something the doc asserts without teaching a term for it: `"SLI SLO SLA" explained`,
`"error budget" explained`, `"four golden signals" SRE`,
`"RED method" "USE method" monitoring`, `"p50 p95 p99" percentiles explained`. Two
notes for whoever runs these searches: they will surface stage 16 material (MTTR,
on-call, postmortems), which files against `16-incident-management` and not here; and
a Prometheus/Grafana result is the one with drawable architecture — the same
vendor mismatch `ci-cd` accepted deliberately when it shipped a Jenkins plate on a
GitHub Actions project, acceptable here for the same reason, since on a concept sheet
the flow shape is the content.

## Untethered

### Software Development Life Cycle · `sdlc` · no stage

Not originally in this list — added 2026-08-24 as a guide to the whole rather than
lookup material for one stage, the same way the `Languages` group carries no stage.
Transcribed from `sdlc.png`.

## Priority 4 — language and framework sheets

These have the weakest tie to the playbook and go stale fastest. Official docs beat
any infographic for syntax. Gather these only where the graphic teaches a *mental
model* rather than listing syntax — the event loop, the collections hierarchy, the
annotation lifecycle.

```
"JavaScript array methods"               → javascript · no stage tether
"ES6 features" cheat sheet
"async await vs promises" visual
"JavaScript event loop" explained

"Python cheat sheet"                     → python · no stage tether
"python list comprehension" explained
"python data structures" comparison

"Java collections framework"             → java · no stage tether
"java streams" cheat sheet
"JVM memory model" explained

"Spring Boot annotations" cheat sheet    → spring-boot · no stage tether
"spring boot" architecture layers
"spring bean lifecycle"

"Express middleware" explained           → express · no stage tether
"Node.js event loop" explained
"nodejs architecture" diagram
```

---

## Filing

Captures land in `reference/` as gathered, and **they are committed** — commit the
original alongside the converted WebP rather than leaving it on your disk.

> This paragraph said the opposite until 2026-09-08, and was wrong for as long as it
> existed. Resolved as **TD-44** in favour of what the repo already did. The reasoning is
> worth keeping, because the original rule was not merely unenforced — it was arguing
> from a cost that does not apply here:
>
> - **The fear was "the originals run 1–4MB each and git keeps every version forever".**
>   True in general, empty for these. A gathered capture is written once and never
>   edited: every image under `reference/` has exactly one commit touching it. There is
>   no "every version" to accumulate.
> - **Ignoring them now would reclaim nothing.** ~18MB of originals are already in
>   history and stay there whether or not the index still points at them. `.git` is 64MB
>   before and after. Only a history rewrite would recover it, over commits already
>   pushed to `origin/develop`.
> - **A ledger row must resolve in a fresh clone.** The table at the bottom of this file
>   names source files by filename. If those files are not in the repo, the ledger names
>   things that, for anyone but the original gatherer, do not exist.

**Because this directory is committed, do not park unrelated files in it.** Anything
dropped into `reference/` is one `git add -A` away from being published — the site is
public. Personal documents in particular belong somewhere outside the repo.

What is committed is the converted copy in `web/public/reference/`, which is what the
site serves. Convert with `sharp` before wiring a sheet to it:

```js
sharp(src, { animated: false }).webp({ quality: 82, effort: 6 }).toFile(out)
```

Quality 82 is where these flat-colour infographics stop losing the small labels;
verify by reading the output before committing rather than trusting the number.
Measured on this batch:

| Original | Was | Now | Saved |
|---|---|---|---|
| `MasterPlan-Api-Design.gif` | 3817K | 196K | 94.9% |
| `Software-Architecture-Patterns.gif` | 1024K | 121K | 88.2% |
| `git-commands.jpeg` | 210K | 138K | 34.2% |
| `software_design_patterns.jpeg` | 262K | 182K | 30.6% |
| `0141-ci-cd-workflow.png` | 1997K | 211K | 89.4% |

The two GIFs are static images that were stored as GIF, which is why they collapse
so far. The PNG collapses further still, for a related reason: a flat-colour
infographic stored losslessly is close to the worst case for PNG and close to the best
case for lossy WebP. Reading the output back mattered here — at 1344×1846 the small
labels ("Security Scanning", "Integration Tests") are what quality 82 is being judged
on, not the large hand-lettered title. Name the output `<target-slug>.webp`, all lowercase and hyphenated — a test
asserts every registered `src` exists on disk, so a mismatch fails the suite rather
than shipping a broken-image box.

## Ledger

Two states below: **displayed** (registered as the sheet's `source.image`, shown
on the page) and **consulted** (read to inform the transcription, or to
cross-check a displayed one's coverage, but not itself registered — a second
and third plate would repeat what the first already shows). Author/URL still
unrecorded on most of these; fix before promoting past `develop` (D-63).

| Target sheet | Source title | Author | URL | File | Captured | State |
|---|---|---|---|---|---|---|
| `architecture-patterns` | Software Architecture Patterns | Sathish Kumar Subramani | *not recorded* | `Software-Architecture-Patterns.gif` | 2026-08-14 | displayed |
| `design-patterns` | Software Design Patterns | *not recorded* | *not recorded* | `software_design_patterns.jpeg` | 2026-08-14 | displayed |
| `design-patterns` | GoF Design Patterns — 23 Timeless Solutions | *not recorded* | *not recorded* | `GoF Design Patterns.jpeg` | 2026-08-24 | consulted |
| `design-patterns` | When to Use Which Design Pattern | GeeksforGeeks | *not recorded* | `Creatational-Structural-Behavioral-DP.jpeg` | 2026-08-24 | consulted |
| `design-patterns` | Behavioral Design Patterns | *not recorded* | *not recorded* | `behavioral-design-pattern.png` | 2026-08-24 | consulted |
| `design-patterns` | 15 Design Patterns in Simple Words | Keivan Damirchi | *not recorded* | `15-DesignPatterns.jpeg` | 2026-08-24 | dropped — subset of the above, no category split |
| `api-design` | Master Plan for API Design | Shalini Goyal | *not recorded* | `MasterPlan-Api-Design.gif` | 2026-08-14 | displayed |
| `ci-cd` | CI/CD Workflow — Simplified Visual Guide | ByteByteGo | https://blog.bytebytego.com | `0141-ci-cd-workflow.png` | 2026-09-07 | displayed — the URL is printed on the plate itself, so this is only the second entry here gathered with real provenance rather than *not recorded* |
| `ci-cd` | CI/CD Complete Cheat Sheet (12 sections) | *not recorded* | *not recorded* | `cicd-cheatsheet2.jpeg` | 2026-09-07 | consulted — its pipeline-stage and best-practice sections became rows; its deployment-strategy and environment-flow sections were skipped as already covered by `aws-deployment` and `deployment-environments`. Not converted to webp |
| `ci-cd` | CI/CD Cheat Sheet (DevOps tooling) | *not recorded* | *not recorded* | `cicd-cheatsheet.jpeg` | 2026-09-07 | consulted — source for the "who plays each role" section only. Its Linux, Maven and AWS CLI command tables were left out as outside stage 11's domain. Not converted to webp |
| `git-commands` | Git Beyond Commit and Push | *not recorded* | *not recorded* | `git-commands.jpeg` | 2026-08-14 | displayed |
| `git-commands` | Git Cheat Sheet — Essential Commands | *not recorded* | *not recorded* | `git-cheatsheet.jpeg` | 2026-08-24 | consulted |
| `git-commands` | What is Git? | *not recorded* | *not recorded* | `Git.jpeg` | 2026-08-24 | dropped — redundant with the two above |
| `git-branching` | Git Branching Strategies | Nikki Siapno (Level Up Coding) | *not recorded* | `git-branching.jpeg` | 2026-08-24 | displayed |
| `solid-principles` | SOLID Principles — Cheat Sheet | Raja Kumar | *not recorded* | `SOLID-PRINCIPLES-cheatsheet.jpeg` | 2026-08-24 | displayed — moved here from `coding-standards` (D-90) |
| `coding-standards` | Code Smell | Refactoring.Guru (via AIAI LAB) | https://refactoring.guru/refactoring/smells | `CodeSmell.jpeg` | 2026-08-24 | displayed (text-only `source`, no image plate) |
| `clean-code` | Clean Code Principles Every Junior Developer Should Know | Unrecorded | *tried, 403 blocked* | `CLEAN-CODE-principle.webp` | 2026-08-24 | displayed — moved here from `coding-standards` (D-90). A specific follow-up URL (`medium.com/@ewniakithma/...`) was requested for this sheet and returned 403 on fetch; the gathered graphic plus original before/after code examples were used instead |
| `clean-code` | 6 Golden Rules to Write Clean Code | Neo Kim | *not recorded* | `6-GoldenRulesCleanCode.jpeg` | 2026-08-28 | consulted — content credited in the second section's own note, no second plate (D-89). Not converted to webp: never displayed, so nothing for `public-assets.test.ts` to catch as orphaned |
| `coding-standards` (naming conventions) | Godot Naming Conventions | *not recorded* | *not recorded* | `NamingConventions.png` | 2026-08-24 | wrong domain — Godot/GDScript-specific, not general or JS/TS. Section held empty; still searching |
| `sdlc` | Software Development Life Cycle (SDLC) | *not recorded* | *not recorded* | `sdlc.png` | 2026-08-24 | displayed |
| `testing` | The 5 Pillars of Testing | Prateek Agrawal | https://dev.to/prateekbka/the-5-pillars-of-testing-a-senior-developers-cheat-sheet-1ckj | `5types-of-testing.webp` | 2026-08-28 | displayed — article and graphic corroborate each other, same author |
| `testing` | Levels of Testing (pyramid) | *not recorded* | *not recorded* | `Levels-of-testing-1.jpeg` | 2026-08-28 | consulted — concept transcribed into the second section's rows, no second plate |
| `playwright` | Playwright Quick Revision Cheat Sheet, page 1/3 | *not recorded* | *not recorded* | `playwright1.jpeg` | 2026-08-28 | displayed |
| `playwright` | Playwright Quick Revision Cheat Sheet, pages 2–3/3 | *not recorded* | *not recorded* | `playwright2.jpeg`, `playwright3.jpeg` | 2026-08-28 | consulted — content transcribed into rows, converted webp deleted rather than left as an unreferenced asset (`public-assets.test.ts` caught it) |
| `observability` | Best practices for logging in Node.js | Atatus | *not recorded* | *no image — text article* | 2026-09-08 | consulted — fed `### Structured logs` |
| `observability` | Observability vs monitoring: key differences and similarities | Sujeeth H R | *not recorded* | *no image — text article* | 2026-09-08 | consulted — fed the opening distinction |
| `observability` | The three pillars of observability | Priya Dharshini | *not recorded* | *no image — text article* | 2026-09-08 | consulted — corroborated, changed nothing |
| `observability` | Observability with OpenTelemetry: why do we need it | Tenil Sridhar | *not recorded* | *no image — text article* | 2026-09-08 | consulted — fed `## Scaling to a team` |
| `observability` | Building an observability platform with Prometheus, Grafana and Jenkins | Kumar | *not recorded* | *no image — text article* | 2026-09-08 | consulted — fed the one-pane dashboard reconciliation; otherwise sheet-only |
