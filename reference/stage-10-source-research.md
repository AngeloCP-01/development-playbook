# Stage 10 documentation source research (2026-10-15)

Research for the canonical [Stage 10 chapter](../docs/10-documentation.md) and a
possible W-6 lookup companion. Stage 10 remains continuous work. These findings
do not begin the interactive port or change W-6's drawn-sheet count.

## Findings to carry into the chapter

### Match the document to the reader's task

The chapter's advice about recording reasons is useful for implementation
comments and decision records, but it is too broad for documentation as a whole.
[Google's code-review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html#comments)
distinguishes comments explaining reasoning from class, module and function
documentation explaining purpose, use and behavior. It also allows comments
explaining complex algorithms. Keep the warning about narrating obvious code;
qualify the claim that documentation only says why.

[Diátaxis's primer](https://diataxis.fr/start-here/) identifies four reader needs:

| Reader need | Document type | Example for a small app |
| --- | --- | --- |
| Learn by doing with guidance | Tutorial | Build a first invoice in a safe sample project |
| Complete a real task | How-to guide | Run locally or roll back a deployment |
| Look up precise facts | Reference | Environment-variable names, API fields, error codes |
| Understand the reasons and context | Explanation | Why the app uses an external auth provider |

These examples are proposed applications of the framework, not examples copied
from Diátaxis. Its [application advice](https://diataxis.fr/how-to-use-diataxis/)
explicitly discourages creating four empty sections just to impose a structure.
Use the distinction to fix a document that mixes incompatible reader needs.

Suggested chapter update: open with the reader's need, then narrow the existing
why rule to implementation comments. A rollback procedure and an environment
reference are useful documentation even when they contain few reasons.

### Keep decision history and show its current status

[Michael Nygard's original ADR article (2011)](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
proposes one short record per architecturally significant decision, with context,
decision, status and consequences. Reversed records remain, marked superseded
with a replacement link.

The [MADR 4.0.0 template](https://github.com/adr/madr/blob/4.0.0/template/adr-template.md)
includes optional status metadata such as proposed, rejected, accepted,
deprecated and superseded, plus options, outcome, consequences and confirmation.
Its [status-field decision](https://adr.github.io/madr/decisions/0008-add-status-field.html)
is itself a useful worked example of choosing an ADR format.

Suggested chapter update: preserve the accepted decision's historical reasoning;
record a changed decision in a new ADR and update status or replacement links on
the old one. For a repository that treats decision entries as strictly append-only,
record supersession in its index or a new entry instead. Label that stricter rule
as repository policy. The playbook's `docs/adr/` location and sequential filenames
are also conventions, not requirements imposed by every ADR format.

For the optional confirmation section, identify evidence a reviewer can inspect,
such as a migration review or a boundary test.

### Make the README an entry point people can use

[GitHub's README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
covers what the project does, why it is useful, getting started, help and
maintainers. It does not prescribe this chapter's four headings. Retain those
headings as a compact playbook template, and add help or ownership links when the
reader needs them. Detailed deployment and incident procedures can live in linked
runbooks if the README still gives a direct route to them.

Suggested chapter update: make fresh-clone setup the verification exercise. Have
someone follow the documented commands without private instructions, record the
first missing prerequisite and fix the guide. Mark this exercise as the
playbook's recommendation rather than an official GitHub requirement.

### Architecture diagrams can document current structure

[C4's diagram guidance](https://c4model.com/diagrams) explicitly uses static
structure views to explain a system at different levels. It says context and
container views suffice for most teams; all four levels are optional. This
contradicts the chapter's blanket rejection of architecture documents describing
structure. A small, maintained view can orient a reader without duplicating every
implementation detail.

Suggested chapter update: document the boundaries and current relationships a
reader needs; link ADRs for the reasons. Choose diagram detail for the audience.
Review it when its boundaries or dependencies change. The
[C4 review checklist](https://c4model.com/diagrams/checklist) supplies concrete
checks: title, scope, legend, named elements and labeled relationships with a clear
direction. The website and example diagrams state a CC BY 4.0 license.

### Automation reduces specific kinds of drift

[Write the Docs](https://www.writethedocs.org/guide/docs-as-code/) describes docs as
code through issue tracking, version control, plain text, reviews and automated
tests. [Google's review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html#documentation)
asks reviewers to update associated documentation when a change affects building,
testing, interacting with or releasing code, including generated reference docs.

The resulting recommendation is an inference from that workflow: automation only
protects the facts it checks. A passing test can describe the wrong behavior; a
type can name the wrong concept; generation can publish stale inputs or run against
the wrong version. `.env.example` does not enforce itself without an explicit
validation path. The chapter should replace its claims that these artifacts cannot
drift with a description of what keeps each one in sync.

| Artifact | Proposed evidence | Remaining manual check |
| --- | --- | --- |
| Generated reference | Generate from the intended source and fail CI on an unexpected diff | Are the source descriptions accurate and useful? |
| Setup guide | Run the documented setup from a clean checkout | Does the guide omit any human prerequisite? |
| Configuration reference | Compare documented keys with the validation schema | Are safe examples and secret-handling instructions clear? |
| Code example | Execute or compile the example where practical | Does it teach the right behavior for its audience? |
| Architecture view | Review changes to the depicted boundaries and services | Does it still help someone understand the system? |

These checks are proposed playbook practices, not guarantees from the cited tools.
Git history preserves the reasoning attached to a particular change, but a commit
message can still contain a factual error or describe an intention that later work
reversed. Link commits for history; maintain current instructions where readers
expect to find them.

## Corrections to illustrative examples

| Chapter claim | Primary-source evidence | Recommended treatment |
| --- | --- | --- |
| Stripe metadata values longer than 500 characters are silently truncated | [Stripe metadata](https://docs.stripe.com/metadata#data) documents 50 pairs, 40-character keys and 500-character values, and recommends storing larger data externally with an object ID in metadata. It does not document silent truncation. | Remove the truncation claim and the unsourced February incident. Show a comment explaining the external-ID choice. Do not invent a rejection response without separate evidence. |
| More than five webhook attempts means the handler is broken | [Stripe webhook delivery](https://docs.stripe.com/webhooks#automatic-retries) documents exponential backoff for up to three days in live mode, and three retries over several hours in a sandbox. It gives no five-attempt diagnosis. | Keep the live-mode qualification if using the retry window; identify any alert threshold as local operational policy. A simpler example can explain duplicate-event handling without teaching alerting thresholds. |
| Prisma's query engine is a reason to choose Drizzle in a March 2026 sample ADR | [Prisma's September 2025 announcement](https://www.prisma.io/changelog/2025-09-10) made its Rust-free engine and driver adapters generally available in 6.16.0. Its generated client still exists. | A query engine is not inherently false wording, but avoid implying a separate Rust engine is unavoidable. Keep the decision explicitly hypothetical, name the evaluated version/configuration or use a less version-sensitive example. |

The chapter's claims about a larger ecosystem, better developer experience and
relative verbosity are contextual judgments. They need the hypothetical team's
requirements or measurements, rather than presentation as universal ORM rankings.

## W-6 candidate structure

No registered `documentation` sheet is implied by this gathering. Before adding
one, check whether the future stage's interactions already cover these lookups.

| Priority | Lookup | Useful format | Source |
| --- | --- | --- | --- |
| 1 | Which document should I write? | Diátaxis map with a concrete app example for each reader need | [Diátaxis primer](https://diataxis.fr/start-here/) |
| 2 | What belongs in a decision record? | Compact context, options, decision, consequences and confirmation specimen; linked supersession example | [Nygard ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), [MADR template](https://github.com/adr/madr/blob/4.0.0/template/adr-template.md) |
| 3 | Will a new reader get the app running? | README review checklist with setup evidence and help/owner links | [GitHub READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) |
| 4 | What needs updating with this change? | Change-to-document matrix paired with checks and an owner | [Google review](https://google.github.io/eng-practices/review/reviewer/looking-for.html#documentation), [Write the Docs](https://www.writethedocs.org/guide/docs-as-code/) |
| 5 | Is this architecture diagram readable? | Context/container example with title, scope and labeled arrows | [C4 diagrams](https://c4model.com/diagrams), [review checklist](https://c4model.com/diagrams/checklist) |

The first two lookups are the strongest candidates for a visual companion. An
original README specimen or maintenance matrix may be more useful than an existing
infographic. Treat any interactive artifact router or drift exercise as future
design work, rather than implementing it in this research pass.

## Visual gathering

Three unmodified source PNGs were downloaded and inspected on 2026-10-15:

| File | Creator | Dimensions | Use |
| --- | --- | --- | --- |
| [Diátaxis map](stage10-diataxis-map.png) | Daniele Procida | 1920 × 1080 | Main documentation-type overview; CC BY-SA 4.0. |
| [C4 context diagram](stage10-c4-system-context.png) | Simon Brown | 1710 × 1415 | A maintained view of users, system and dependencies; CC BY 4.0. |
| [C4 diagram key](stage10-c4-system-context-key.png) | Simon Brown | 2500 × 500 | Companion legend for that diagram; CC BY 4.0. |

The [Stage 10 source ledger](cheatsheet-sources.md#stage-10-gathering-round--2026-10-15)
records creator pages, original image URLs, license evidence and adaptation
caveats. The Markdown chapter embeds the map with a text equivalent and links
the C4 pair. No plate has been selected for the website.

A source image illustrates a framework; it does not prove that this repository
follows it. Website use still needs a readable layout and contrast checks.

Deferred: Stage 10's interactive port, a new W-6 registration, reference-sheet
implementation, application code, and unrelated changes to the repository's ADR
or documentation process.

## User-supplied references checked (2026-10-15)

The supplied [nine-template image](doc-templates-dev-team.jpeg) has Docuwiz
branding. Its categories match the official
[Documentation Starter Kit](https://github.com/docuwiz-io/documentation-starter-kit/tree/b98a9373f6e6337651c516c793214d5301e4c8d1),
linked directly from [Docuwiz's template article](https://www.docuwiz.io/blog/blog-technical-documentation-templates).
The article recommends adapting templates to audience and task, which supports
using the image as a selection menu rather than requiring nine documents from
every team. Its October 8 publication date is later than the kit's inspected
commit, `b98a937`, dated April 13, 2026.

The article also recommends grounding AI drafts in supplied specifications or
approved notes and having a reviewer check examples and version-specific facts.
That is a candidate for a later chapter section on assisted writing.

I inspected the nine Markdown files, not only the promotional list:

| Templates | Useful prompts | Caution for Stage 10 |
| --- | --- | --- |
| Getting started; task-based how-to | Audience, prerequisites, expected results and validation | Replace generic UI actions with the app's tested instructions. |
| Conceptual guide; technical reference | Mental model versus field and parameter lookup | Keep factual reference separate from conceptual discussion. |
| Architecture overview | Components, flow, security boundaries and request journey | The specimen assumes microservices, an API gateway and Kubernetes. These are sample assumptions, not requirements for this static site. |
| Best practices; troubleshooting | Conventions, issue-to-resolution matrix and escalation details | Confirm policy and actual failure behavior; remove generic advice that lacks product evidence. |
| Changelog; release notes | Chronological version record versus audience-focused release communication | Keep only sections the release needs. Replace claims that fixes were verified or future fixes promised with release evidence. |

The kit contains no ADR template. A conceptual guide or architecture overview
does not replace this chapter's decision record. Retain Nygard/MADR as its source.
For later W-6 work, the strongest additions are a document-selection menu,
symptom-to-check table and a small changelog/release-note comparison.

The repository root contains nine templates and a README, with no license file
or reuse terms found in that README at the inspected commit. Template reuse
permission is therefore unverified. The separate graphic's license is also
unknown. An [official Docuwiz LinkedIn post](https://www.linkedin.com/posts/docuwiz_docsascode-developerdocumentation-apidocs-activity-7449463623888068608-QZDl)
links the starter kit, but its inspected image is a product screenshot, not the
supplied nine-card graphic. It corroborates kit provenance only. The supplied
graphic's original URL remains unverified; do not attribute it to the author of
the separate project-management article.

[Kirran Mushtaq's article](https://www.linkedin.com/pulse/project-management-documentation-library-practical-guide-mushtaq-pwuaf),
published October 3, 2026, supports document ownership, version control, access
permissions, review and traceable decisions. Its larger inventory concerns
project governance. For Stage 10, use those maintenance prompts without requiring
its charter, procurement, financial and closure documents for every software
project. The article supplies an author's practical advice, not a mandatory
documentation standard.

## Accepted chapter use · 2026-10-20

The dated findings above record the gathering assessment. The [corrected chapter](../docs/10-documentation.md) now applies them; [execution evidence](../docs/superpowers/reports/2026-10-20-stage-10-execution.md) and the [same-case reader rerun](../docs/superpowers/reports/2026-10-20-stage-10-correction-rerun.md) record the checks.

| Gathered finding | Accepted use |
| --- | --- |
| Diátaxis reader needs; nine-template menu | Task-to-document table and optional artifact menu; no nine-document mandate |
| Nygard / MADR history and status | Preserved old decision, dated current-status notice, replacement ADR and reciprocal links |
| GitHub README guidance | Entry outline plus colocated fresh-clone evidence; actual project facts remain required |
| C4 scope and relationships | Original compact Workshop relationship view, owner and review trigger; no copied banking architecture |
| Docs as Code / Google review | Change→fact→document→check→owner matrix; why heuristic scoped to implementation comments |
| Stripe metadata and retry evidence | Documented external-ID rationale; invented truncation/incident/attempt diagnosis removed |
| Version-sensitive ORM example | Replaced with an explicitly illustrative documentation decision; no universal ORM recommendation |
| User article, graphic and Docuwiz starter kit | Ownership/maintenance prompts, optional artifact menu and source-grounded AI review; template claims require project evidence |

Primary pages for Diátaxis, Nygard, Stripe metadata and Docuwiz template guidance were reopened on 2026-10-20. They support the attributed distinctions; no live Toolshare/Workshop application or provider incident was measured. The recorded source URLs, authors, image dimensions, licenses and unconfirmed graphic authorship/reuse terms remain as gathered above.

The chapter now teaches the distinctions in text. The research appendix and its embedded plates have been removed from active teaching; all four gathered images remain in `reference/` for later selection. None was copied into `web/public` or selected for web display. W-6 remains 22 drawn / 27 registered; a companion still needs its own design and publication decision. The Stage 10 interactive port is also separate.

## W6 source verification and assessment · 2026-10-27

All pages below were reopened on 2026-10-27. Undated living guidance is identified
by organization and access date; MADR is pinned to version 4.0.0.

| Primary source | Verified compact lookup |
| --- | --- |
| Daniele Procida, [Diátaxis primer](https://diataxis.fr/start-here/) and [compass](https://diataxis.fr/compass/) | Tutorial supports learning through guided action; how-to supports completing work; reference supplies technical facts; explanation supplies understanding. The compass distinguishes action/cognition and study/work. These classify reader needs, rather than prescribe four files. |
| Michael Nygard, [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), 2011-11-15 | A short record covers a significant decision with title, context, decision, status and consequences. Retain a reversed record, mark supersession and reference its replacement. Include unfavorable and neutral consequences. |
| MADR project, [template 4.0.0](https://github.com/adr/madr/blob/4.0.0/template/adr-template.md) | Context, considered options and chosen outcome provide compact decision prompts. Metadata, decision drivers, consequences, confirmation and detailed option comparisons are explicitly optional in this template. Confirmation asks how implementation/compliance can be checked. Do not present the full template as a mandatory checklist. |
| GitHub, [About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) | Typical entry information: purpose, usefulness, getting started, help and maintainers/contributors. These are content prompts, not required headings or proof that setup works. |
| Google Engineering Practices, [documentation review](https://google.github.io/eng-practices/review/reviewer/looking-for.html#documentation) | Changes affecting building, testing, interaction or releases should update associated documentation, including generated reference. Removal/deprecation can require deleting documentation. The comments section separately distinguishes reasoning comments from API purpose/use/behavior documentation. |

A W6 card could put these reminders beside a small
change → affected fact/document → check → owner lookup. That matrix, fresh-clone
verification, filenames, review triggers and evidence fields are playbook
recommendations. Fill them with actual project facts or mark examples as
illustrative. The sources do not establish this repository's commands, owners,
architecture or successful checks.

These reminders already overlap the interactive stage's teaching. Aggregation
would support quick recall; it adds no source-backed requirement for more
documents. The duplication/publication decision remains separate. No extra
release taxonomy or image is needed for this compact scope. Existing Diátaxis/C4
license findings remain above; Docuwiz graphic/template reuse remains unverified.
No gathered image was published by this assessment. The appended prose received
the humanizer editing pass.

### Companion decision · 2026-10-27

Build one text-only Documentation change-check card. Its value is retrieval: all
form choices, record prompts, change checks and publication cautions are visible
on one reference page, while the stage remains the place for worked examples,
practice and a saved change plan. The compact summaries deliberately overlap the
chapter and need review when its teaching changes. Existing Diátaxis/C4 images
add no missing lookup here; the uncertain-license template JPEG is not published.
