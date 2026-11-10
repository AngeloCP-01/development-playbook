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

## Stage 16 gathering round · 2026-09-29

Target: `incident-management`, tethered to stage 16. The user chose stage 16 for
the next W-3 round; its W-6 companion follows the stage. These are gathered sources,
not published sheet content. No plate has been selected.

| Source | Author / organization | URL | Local image | Intended use / verification |
|---|---|---|---|---|
| 2025 SRE Incident Management Best Practices Checklist | Rootly | https://rootly.com/sre/2025-sre-incident-management-best-practices-checklist | None matched | Read; preparation, roles, handoffs and follow-up. Adapt team size and severity conventions. |
| The 15-Minute Rule: Incident Response Checklist for Cybersecurity Leaders | PKWARE | https://www.pkware.com/blog/the-15-minute-rule-incident-response-checklist-for-cybersecurity-leaders | None matched | Read; security containment and evidence preservation. Its timing is source guidance, not a universal deadline. |
| Incident Management Handbook | Atlassian | https://www.atlassian.com/incident-management/handbook#tooling-requirements | None matched | Read; incident record, coordination, alerting, documentation and status communication. |
| Incident Communication Templates: 8 Copy-Paste Examples | Runframe | https://runframe.io/blog/incident-stakeholder-communication-templates | None matched | Read; audience-specific updates, known impact, unknowns and next-update time. |
| Incident response runbook presentation templates | SlideTeam | https://www.slideteam.net/top-10-incident-response-runbook-powerpoint-presentation-templates | `process_of_creating_runbook_for_incident_action_plan_slide01.jpg` | User-supplied attribution; page blocked by bot verification. Image inspected; contains placeholder text, not a completed operational runbook. |
| SRE Playbook: Step-by-Step Guide to Incident Response & Reliability | Vaibhav Umarvaishya / NovelVista | https://www.novelvista.com/blogs/devops/sre-playbook-step-by-step-incident-response-reliability | `sre-internal-1.webp` | Article read, clearer image inspected; replaces the earlier low-resolution capture. Candidate workflow plate, subject to the caveats below. |

The NovelVista graphic is readable at 1704 × 923. Its sequence places communication
after diagnosis; our adaptation must make updates ongoing. Its timeline labels an
incident resolved while validation is still in progress. Its health panel also says
all systems are operational while showing a degraded payment service. The article
has a separate recovery-validation step, which the graphic's top row omits. Use these
as review findings, not instructions to reproduce.

Primary references added during specification (2026-09-29):

- Google SRE, *Incident Response*, Jennifer Mace, Jelena Oertel, Stephen Thorne
  and Arup Chakrabarti, with Jian Ma and Jessie Yang:
  https://sre.google/workbook/incident-response/ — consulted for coordination,
  incident ownership and maintaining a working record.
- Google SRE, *Postmortem Culture: Learning from Failure*:
  https://sre.google/workbook/postmortem-culture/ — consulted for postmortem
  practice and follow-up. No local image for either reference.

Post-plan external check (2026-09-29):

- PagerDuty, *Incident Command*:
  https://response.pagerduty.com/during/incident_command/ — the page was
  inaccessible on retry, so no claim or instruction was taken from it.
- The Google SRE *Incident Response* chapter above was reread as the fallback.
  Its commander may hold undelegated roles, which fits a solo responder; its
  ownership, incident-record and communication guidance was already reflected
  in the approved teaching. This was not a new independent source. No
  operational procedure was executed.

Other captures inspected, with provenance still incomplete:

| File | Visible attribution | Assessment |
|---|---|---|
| `Major-Incident-----First-15-Minutes-Checklist-Why-control-matters-before-speed.png` | ITILIGENCE; URL missing | Coordination and fact/assumption separation; candidate supporting source. |
| `incident-severity-levels-og.webp` | Runframe; exact page URL missing | Five-level model; reconcile with the stage's three-level model before use. |
| `incident-escation-matrix.webp` | Not recorded | Support hierarchy; adapt for small teams, do not equate management rank with incident severity. |
| `post-mortem-vs-retrospective-vs-indecident-review.webp` | Not recorded | Terminology comparison; verify the distinctions before teaching them. |
| `9-escalation-matrix.png` | Not recorded | Reject as the operational model: repeated Levels 2/3 and days-long support escalation. |
| `SRE incident-management Checklist.jpeg` | Not recorded | Filename is misleading: image is a cybersecurity infection-response checklist. Security-specific supporting material only. |

The W-6 `incident-management` sheet was drawn on 2026-10-01 without an image
plate. Its lookup rows follow the repaired Stage 16 chapter. The NovelVista
sequence errors above and the other captures' provenance or content gaps made
none suitable for display in this round.

Deferred: publication and conversion of graphics, remaining image provenance,
and a worked runbook and completed postmortem. The gathering round itself did
not change stage readiness.

## Stage 08 gathering round · 2026-10-02

Target: a future `security` sheet tethered to `08-security-audit`. Three OWASP
images were downloaded as **source captures**, not selected as a publication
plate. The chapter's central audit is object ownership; none of these images
shows the two-user, same-object test, so the sheet must teach that in its own
rows or an original figure.

| Local capture | Creator / source page | Original image | Size | License and assessment |
|---|---|---|---|---|
| `stage08-authorization-matrix.png` | OWASP Cheat Sheet Series, [Authorization Testing Automation](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html#rendering-the-authorization-matrix-for-an-audit-review) | [OWASP asset](https://cheatsheetseries.owasp.org/assets/Authorization_Testing_Automation_AutomationRendering.png) | 1480 × 971 | CC BY-SA 4.0, stated on the page. Clear role/endpoint mapping, but its example allows anonymous reads and has no record-ownership dimension. Consult; do not display as Stage 08's complete authorization audit. |
| `stage08-threat-data-flow-overview.jpg` | OWASP Foundation, [Threat Modeling Process (Historical)](https://community.owasp.org/Threat_Modeling_Process) | [OWASP asset](https://community.owasp.org/assets/images/Data_flow1.jpg) | 749 × 412 | Site footer states CC BY-SA 4.0 unless specified otherwise. College-library users, librarians, web app, database and trust boundaries. Legible at native size; historical example, not current framework guidance. |
| `stage08-threat-login-flow.jpg` | OWASP Foundation, [Threat Modeling Process (Historical)](https://community.owasp.org/Threat_Modeling_Process) | [OWASP asset](https://community.owasp.org/assets/images/Data_flow2.jpg) | 760 × 469 | Same site license. Drill-down of the library login flow and its trust boundaries. Useful alongside the overview, but too specific to stand alone as the sheet's plate. |

No first-party downloadable two-user IDOR or complete audit-finding infographic
was found in this pass. [OWASP's IDOR testing procedure](https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/05-Authorization/04-Insecure_Direct_Object_References/)
and [WSTG reporting guidance](https://wstg.owasp.org/stable/5-Reporting/README/)
are text sources for those parts. The existing `"OWASP top 10" visual` search
target above remains useful for orientation, not as the main audit workflow.
No image was copied into `web/public/reference/` or registered in the live
cheatsheet. W-6's drawn-sheet count is unchanged.

### Stage 08 sheet follow-up · 2026-10-05

`web/public/reference/security-invoice-audit.svg` is an **original Development
Playbook diagram**, 640 × 780. It shows User B's known invoice ID crossing the
browser/server boundary, the server deriving B from the session, the lookup
scoped to both invoice ID and owner, the denied result, and User A's positive
control. It was drawn for the `security` sheet; no OWASP image was traced or
republished. The three captures above remain consulted sources, not display
plates.

The sheet's test method follows [OWASP WSTG IDOR testing](https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/05-Authorization/04-Insecure_Direct_Object_References/): map object references and try another test user's known object. The permission matrix draws on the [OWASP Authorization Testing Automation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html), with object ownership added for this invoice case. The finding fields follow [OWASP WSTG reporting guidance](https://wstg.owasp.org/stable/5-Reporting/README/). The Stage 08 chapter supplies the application policy and the surrounding control checks. The diagram is illustrative: no authenticated backend was audited to produce it.

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

### Stage 09 lookup companions · W-6.3q

The caching/scaling sheets are original practical lookups, not transcriptions of a gathered graphic. Their TypeScript modules are the source of the generated reference Markdown. The source list is displayed on each sheet through the primary citation and supporting citations. No image plate is selected in this round.

| Sheet / sections | First-party reference | What it supports |
|---|---|---|
| caching / boundary, lifetime | [Next.js use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache) | Cache Components prerequisite, async scopes, request-value boundaries and hosting caveats |
| caching / lifetime | [Next.js cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag) | Lifetime profiles and tagged reads |
| caching / invalidation | [Next.js updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag), [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) | Caller scope, immediate expiry, stale-while-revalidate and non-deprecated signatures |
| caching / CDN evidence | [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/), [retention versus freshness](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/) | Provider-specific response status, retention and freshness |
| scaling / routing, failure | [AWS ALB attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html), [target-group health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) | Algorithm conditions, incompatible features, draining and fail-open behavior |
| scaling / capacity, overload | [Google SRE Handling Overload](https://sre.google/sre-book/handling-overload/) | Workload-dependent capacity, admission, degradation and overload limits |

The comparable-outcome, authorization and uncertain-side-effect checks are this playbook's application discipline, carried from the reviewed Stage 09 chapter and incident guidance. They are not a universal checklist attributed to one provider. Read-only commands use illustrative domains or a caller-supplied permitted target-group ARN. No backend or infrastructure was measured to author these rows.

Deferred: diagrams, image republication, runtime configuration, Stage 09 chapter/port edits, glossary/stack surfacing and the five language sheets. The source date and actual execution/verification evidence are recorded in the round's execution report.

## Stage 10 gathering round · 2026-10-15

Topic: Documentation, tethered to stage 10. The user requested research before
the chapter review, with images where useful and text sources where a graphic
adds little. This is a gathering round; `documentation` is a candidate slug,
not a registered sheet. W-6 remains 22 drawn / 27 registered.

Findings are in [Stage 10 source research](stage-10-source-research.md) and
the original chapter appendix preserved in source-collection commit `e30c9a4`.

### Original images

All three PNGs were downloaded from their creators' sites on 2026-10-15 and
visually inspected. They are unmodified originals, not screenshots or generated
replacements. The C4 key belongs with the context diagram rather than counting
as a separate concept plate.

| Local file | Creator / original page | Direct image URL | Dimensions | License / intended use |
| --- | --- | --- | --- | --- |
| [stage10-diataxis-map.png](stage10-diataxis-map.png) | Daniele Procida, [Diátaxis](https://diataxis.fr/) | [Original PNG](https://diataxis.fr/_images/diataxis.png) | 1920 × 1080 | CC BY-SA 4.0 in the [source repository license](https://github.com/evildmp/diataxis-documentation-framework/blob/main/LICENSE.rst). Strongest overview candidate: four reader needs across action/cognition and acquisition/application. Embedded in the Markdown chapter with attribution and a text equivalent. Retain attribution and license; identify any later adaptation. |
| [stage10-c4-system-context.png](stage10-c4-system-context.png) | Simon Brown, [C4 system-context diagram](https://c4model.com/diagrams/system-context) | [Original PNG](https://c4model.com/images/examples/SystemContext.png) | 1710 × 1415 | CC BY 4.0 stated on the creator page and image. Shows a fictional banking system, customer and external systems. Supports scope and relationship labeling; it is not a diagram of this app or a proposed banking stack. Linked from the chapter. |
| [stage10-c4-system-context-key.png](stage10-c4-system-context-key.png) | Simon Brown, [same C4 page](https://c4model.com/diagrams/system-context) | [Original PNG](https://c4model.com/images/examples/SystemContext-key.png) | 2500 × 500 | CC BY 4.0 on the creator page. Companion legend; retain with the diagram when displaying it. Named labels explain the colors and shapes. |

The Diátaxis map is readable at native size. Its orange labels and the C4
example's small labels still need contrast and mobile-layout decisions before
any web publication. Source graphics do not establish this site's WCAG AA
compliance. The chapter provides the four documentation types in text too.

### Primary text sources

| Source | Author / organization | What it supports |
| --- | --- | --- |
| [Diátaxis primer](https://diataxis.fr/start-here/), [compass](https://diataxis.fr/compass/) | Daniele Procida | Choose tutorial, how-to, reference or explanation for the reader's need. |
| [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) | Michael Nygard / Cognitect | Small decision records; status and links preserve supersession history. |
| [MADR 4.0.0 template](https://github.com/adr/madr/blob/4.0.0/template/adr-template.md), [status-field decision](https://adr.github.io/madr/decisions/0008-add-status-field.html) | MADR contributors | Optional metadata, options, consequences and confirmation; an editable specimen is more useful than a screenshot. |
| [About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) | GitHub | Project purpose, getting started, help and maintainers. The playbook's four headings remain its own template. |
| [Docs as Code](https://www.writethedocs.org/guide/docs-as-code/) | Write the Docs | Version control, review and automated checks for documentation. |
| [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html#documentation) | Google Engineering Practices | Why-focused implementation comments differ from API documentation; associated docs need review when behavior changes. |
| [C4 diagram review checklist](https://c4model.com/diagrams/checklist) | Simon Brown | Scope, key, named elements and labeled relationships. |
| [Metadata](https://docs.stripe.com/metadata#data), [webhook retries](https://docs.stripe.com/webhooks#automatic-retries) | Stripe | Check the existing comment examples: value limit, live/sandbox retry distinctions; no documented silent truncation or five-attempt diagnosis. |
| [Prisma ORM v6.16.0 release](https://www.prisma.io/changelog/2025-09-10) | Prisma | Rust-free engine and driver adapters were generally available before the sample ADR's date; evaluate a named configuration. |

The AWS [ADR process diagrams](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)
were also located. They are optional reading, not downloaded plates; the gathered
Diátaxis and C4 originals already cover the strongest visual needs. An ADR
lifecycle lookup can use editable text grounded in Nygard and MADR.

Deferred: choosing or registering a W-6 sheet, copying images into `web/public`,
an interactive redraw, chapter corrections and cold-reader checks, the Stage 10
port, and publishing or deployment. No provenance-free social captures were added.

### User-supplied follow-up · 2026-10-15

Two further sources were supplied after the initial gathering:

| Source | Attribution / access | Assessment |
| --- | --- | --- |
| [Project Management Documentation Library: A Practical Guide](https://www.linkedin.com/pulse/project-management-documentation-library-practical-guide-mushtaq-pwuaf/) | Kirran Mushtaq, published 2026-10-03. Read through the search-indexed article text; direct page retrieval failed. No local article image was supplied. | Supporting context for ownership, versions, access, review and decision history. Its broader governance library spans other stages; do not turn it into Stage 10's mandatory document list. |
| [9 Free Doc Templates Every Dev Team Needs](doc-templates-dev-team.jpeg) | User-supplied JPEG, 1225 × 1536, visually inspected. The footer says `docuwiz.io`; that is visible branding, not independently verified image authorship. Original post/image URL and graphic reuse license are unconfirmed. | Good W-6 candidate for choosing an artifact by reader task. Nine descriptions are visible; the actual templates were found separately in Docuwiz's repository below. No ADR appears in the nine; retain Stage 10's ADR teaching. Keep the JPEG as a gathering asset, without selecting it for web display. |

The image is independent of the LinkedIn article; do not attribute it to Mushtaq
without evidence. The missing attachment-path error was transient: the local
JPEG could be opened during this check. Its existence does not establish a
reuse license.

Docuwiz's [official article](https://www.docuwiz.io/blog/blog-technical-documentation-templates)
links its [Documentation Starter Kit](https://github.com/docuwiz-io/documentation-starter-kit),
where the nine Markdown files were inspected. The repository root and README
contain no explicit license grant found in this check. The template source is
verified; permission for image republication remains unconfirmed. Architecture
and release-note samples contain project-specific claims that need replacing
with verified facts before use.

A [Docuwiz LinkedIn post](https://www.linkedin.com/posts/docuwiz_docsascode-developerdocumentation-apidocs-activity-7449463623888068608-QZDl)
corroborates the starter kit. Its linked image was downloaded to temporary
storage and visually compared: it shows a product UI, not the user's nine-card
graphic. Do not record that post as the original source of this JPEG.

Use [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
[GitHub's release guidance](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
to distinguish version history from release communication. The nine-card image
is a menu of possible artifacts, not a replacement for Diátaxis's reader needs.

### Stage 10 accepted use · 2026-10-20

The gathering/follow-up sections above describe their dated research state. The chapter correction now uses Diátaxis for reader-task selection, Nygard/MADR for visible supersession, GitHub for the README entry point, C4 for labeled boundaries, and Docs as Code/Google for explicit review checks. Stripe’s unsupported truncation/incident/attempt claims were removed; the ORM specimen was replaced with a labeled documentation decision. User references inform the optional artifact menu, ownership and grounded AI review.

See [accepted source use](stage-10-source-research.md#accepted-chapter-use--2026-10-20), [the corrected chapter](../docs/10-documentation.md) and [execution evidence](../docs/superpowers/reports/2026-10-20-stage-10-execution.md). Original source pages/images, licenses and attribution uncertainty remain recorded above. The chapter’s research appendix is gone; original plates and the user JPEG remain gathering assets only. Earlier “embedded”/“linked” image descriptions record the appendix at the gathering checkpoint, not the corrected chapter or a web publication. No `documentation` sheet is registered; W-6 stays 22/27 and W-3 stays 15/18.

### Stage 10 W-6 companion · 2026-10-27

`documentation` is a text-only Documentation Change Check sheet tethered to
Stage 10. Its four sections put form choice, record prompts, changed-fact checks
and publication cautions in one view. The stage retains examples, practice and
the saved change plan. These compact summaries are intentionally hand-authored;
`reference/cheatsheets.md` is generated from the sheet module.

Primary pages were rechecked on 2026-10-27: Diátaxis (Daniele Procida), Nygard's
ADR article, MADR 4.0.0, GitHub README guidance and Google documentation review.
See the [dated source assessment](stage-10-source-research.md#w6-source-verification-and-assessment--2026-10-27)
for URLs and supported claims. Checks/owners and the fresh-clone exercise are
playbook recommendations; MADR metadata and confirmation remain optional.

The sheet publishes no source image or copied template. The four-form text
lookup is sufficient here; C4's banking example adds no check-card information,
and the supplied template JPEG's original authorship/reuse permission remains
unconfirmed. Existing plates stay gathering assets. No private project facts or
provider execution results were measured. Approved local merge `8eb294c` brings develop to 23 drawn / 28 registered.
Earlier dated counts above describe their research checkpoints.

### Stage 17 gathering · 2026-10-29

The [Maintenance source record](stage-17-source-research.md) captures primary
sources, versioned package-manager meanings, provider limits and possible lookup
rows for a later W-6 round. The [chapter](../docs/17-maintenance.md) uses the
unchanged [original debt quadrant](stage-17-tech-debt-quadrant.png), credited to
Martin Fowler with its original article and his illustration reuse permission.
This is author permission with attribution, not a named standard license.

Candidate lookup needs: update triage, tool-operation distinctions, debt evidence,
retirement checks and recurring review prompts. Recovery/expiry/retention rows
need to earn their space during the later companion assessment. No sheet or
public web asset is registered in this gathering round; W-6 stays **23/28** and
W-3 **16/18**. Research does not establish production health or an executed upgrade,
cleanup, rotation or restore.


### Stage 17 W-6 assessment · 2026-10-29

The [bounded assessment](stage-17-source-research.md#w-6-assessment-technical-debt-review-2026-10-29)
recommends one **Technical Debt Review** sheet, using the original Fowler quadrant
with attribution, original link and an unchanged-image statement. Selected primary
pages and illustration permission were reopened on 2026-10-29. Source authors,
dates, supported claims and asset dimensions remain in the single research record.

The proposed four-section/fourteen-row sheet combines category lookup with
response and retirement checks. It is an intentional summary of chapter content;
the stage retains its examples, drills and AI Plays. The broad Maintenance card
and dependency-command card are deferred. No source image is copied into public
assets and no sheet is registered by this assessment. W-6 remains **23/28**.
