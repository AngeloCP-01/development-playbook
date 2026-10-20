# Stage 10 documentation: chapter review and correction

Date: 2026-10-20. Status: proposed; awaiting the user's written-spec review.
This document describes the chapter round. It does not approve implementation
or the later interactive port. The user authorized proceeding from the gathered
research to chapter review, specification and planning.

## Problem

The chapter has a usable README outline and a worked ADR, but its broad rules
conflict with their purpose. **The rule** and **Traps** reject factual descriptions
that **The README** requires. **Documentation that maintains itself** treats
types, tests and a configuration example as guarantees of accuracy. The research
appendix identifies problems, but the active teaching still gives the old advice.

The [initial cold-reader assessment](../reports/2026-10-20-stage-10-cold-reader.md)
found a second contradiction: accepted decision records must be preserved, while
the periodic checklist rejects any documentation about things that no longer
exist. Its five lookup questions returned three partial answers and two missing
answers. The reader could create artifact skeletons, but could not establish
how supersession becomes discoverable or how changed contracts stay documented.

Other corrections are source-backed: Stripe's metadata guide does not support
silent truncation, an attempt count is not a universal delivery diagnosis, and
the sample ORM decision needs evaluated-version context. The ADR glossary repeats
the immutability wording at `web/src/lib/terms.ts:226`. Stage 10 remains
`ready: false` at `web/src/lib/stages.ts:122`.

## Goals

- Teach the reader to choose the smallest useful document for a real task:
  learning, completing a procedure, looking up facts or understanding reasons.
- Keep a new maintainer's setup and operational entry points usable, with a
  fresh-clone check and observable success rather than headings alone.
- Provide a compact ADR specimen and lifecycle that preserve historical reasons
  while making the current decision and its replacement links discoverable.
- Teach a change-to-document check for configuration, response contracts,
  defaults, current architecture, operational instructions and release material.
- Replace absolute drift guarantees with named sources, checks, ownership and
  review triggers. Include safe examples and no private credentials or user data.
- Add a stage-specific AI section that distinguishes a source-grounded draft
  from evidence that instructions, defaults or a claimed fix are correct.
- Correct the chapter and ADR glossary together, then recheck the same held-out
  scenario before specifying the interactive port.

## Non-goals

- **The interactive port.** Panel structure, exercises, persistence and stage
  registration depend on settled teaching. They get a separate design; the
  existing placeholder stays in place during this round.
- **W-6 implementation or a nine-document mandate.** Sources and candidate
  formats are gathered. A lookup companion earns its scope after the chapter;
  neither the Diátaxis map nor the user's graphic requires a new sheet now.
- **A project-management document library.** The user's Mushtaq article supplies
  useful maintenance prompts. Charters, procurement, financial reporting and
  steering committees belong to a broader audience than the solo developer.
- **Redesigning architecture, deployment or incident response.** Stages 03, 04,
  06, 08 and 11–16 own their implementation. This chapter documents and verifies
  their outcomes, with direct cross-references where needed.
- **A universal runnable application template.** Project-specific setup commands,
  credentials and deployment facts cannot be invented from a documentation guide.
  Examples that are incomplete must say so.
- **A new documentation platform, API generator or dependency.** Demonstrate the
  checks a project needs; do not introduce tooling simply to explain it.

## Constraints

Stage 10 is continuous work. Keep the H1 title and the house top-level sections:
Entry criteria, The work, Artifacts, Definition of done, Scaling to a team and
Traps. Do not imply that it follows optimization as a project phase.

The audience remains a solo production-grade developer who may add an occasional
maintainer (D-37). Teach decisions and consequences, not only document names.
Retain the Artifacts and Traps sections and give every required artifact a
teaching home (D-95). Existing ADR format/naming/location are present; D-39's
Stage 03 boundary is not evidence that they are absent here.

Follow TDD for teaching corrections and code changes: a failing guard first,
minimum correction, green run and a teeth check. Keep RED/GREEN terminal output
in the eventual execution report. D-47 applies to the ADR glossary. Its `see`
link remains `03-architecture` because that ready stage already teaches ADRs;
do not point the term at Stage 10's placeholder before the port is ready.

All examples are either explicitly illustrative or checked against an identified
source/project version. No invented incident dates, provider guarantees or
validation results. Documentation excerpts cited in reports use headings (D-42);
code references may use file and line. Preserve the source ledger and generated
glossary convention.

Work is isolated on `docs/2026-10-20-stage-10-chapter`, created from develop
`79f9e31`. Research is preserved separately as `e30c9a4`. The parent checkout's
uncommitted research, `AGENTS.md` changes, `image.png` and dev-server state remain
untouched. No merge of the handoff branch is needed to write this specification.
Every later merge still requires the user's approval; pushes and promotion remain
the user's actions.

## Architecture

### Reader tasks and chapter organization

Within **The work**, use the following teaching order. These are Markdown
sections, not a commitment to a number of future stepper panels:

1. **Choose the document for the reader's task.** A short Diátaxis-based table
   separates tutorial, how-to, reference and explanation. Follow it with an
   artifact menu: README/onboarding, architectural overview, ADR, conventions,
   troubleshooting, changelog and release notes. Several artifacts may serve
   more than one need; nine template names are not nine framework quadrants.
2. **Keep the README usable.** Retain purpose, run, architecture and deploy as
   a compact starting structure. Add prerequisites/access, safe configuration,
   expected result, help/owner and links to detailed procedures when necessary.
   Put the fresh-clone check beside this guidance so it is findable without
   consulting Scaling to a team. Missing project facts are explicit gaps to
   fill, never fabricated commands.
3. **Record decisions and supersede them visibly.** Teach the minimum specimen,
   when a decision deserves a record, review status and discoverable replacement.
   A one-page starting point is a guide, not a length gate. Keep
   `docs/adr/NNN-title.md` as the playbook's convention, clearly labeled as such.
4. **Keep architecture and contract references current.** Show a small current
   view with scope, named boundaries, labeled relationships, owner and review
   trigger. Link reasons to ADRs. For a field/option reference, show name, type,
   allowed values/default or absence behavior, version and source; exact fields
   depend on the contract. Generation is an option, not permission to omit
   behavior the reader needs.
5. **Write comments for non-obvious reasons.** Keep the four existing categories:
   outside constraints, deliberate deviations, tricky logic and known limits.
   Narrow the why heuristic to implementation comments. Replace the unsupported
   Stripe incident/delivery examples with comments grounded in documented limits
   or a clearly stated local policy. Do not teach an alerting strategy here.
6. **Update and verify documentation with the change.** A compact matrix maps
   change → authoritative fact → affected document → check → owner/review trigger.
   Include configuration, defaults/response fields, boundaries, setup/deploy,
   troubleshooting and release communication. The developer owns this work when
   working alone; team ownership is an extension, not a prerequisite.
7. **Choose what to omit or archive.** Keep the warning against restating code,
   duplicating reference material and maintaining an exhaustive architecture
   inventory. Preserve historical ADRs and old release records as history;
   correct, redirect or retire misleading current instructions. Explain the
   distinction before the completion checklist repeats it.
8. **Commit messages preserve change context.** Retain the Stage 05 handoff.
   The subject can be sufficient for a small self-explanatory change; use a body
   when the reason, constraint or rejected alternative needs to survive.
9. **AI in documentation.** Put the source/evidence review under a directly
   discoverable heading. Define bounded uses, the facts an agent may not invent,
   and the review that makes a draft publishable.

The section labels above are the proposed consultability design. The implementation
plan may adjust wording if it preserves the lookup intent and records that choice.
It may not silently drop a teaching section or turn optional artifacts into gates.

### Worked example and held-out assessment

My proposed worked case is **Workshop**, a fictional small workshop-booking app.
A change introduces a configurable booking window and an optional waitlist
position in its response. The team decides to generate the factual field
reference from its contract instead of maintaining a second field list by hand.
The exact configuration names and field schemas are illustrative teaching inputs;
the chapter must not claim they exist in this repository.

Carry this one change through a documentation-impact matrix, a small configuration
reference, an ADR and a completion check. Show how an expected contract change
differs from an unverified claim that generation or validation succeeded. Do not
make generated text the source of its own correctness assertion.

For the ADR lifecycle, show a short prior decision and its replacement. Preserve
the old decision's historical context, date and reasoning; append a dated
supersession notice with a link to the new ADR, and link back from the replacement.
An existing decision index should reflect the current record. This append-only
notice follows the repository's preservation rule without pretending accepted
decision prose can never acquire a supersession pointer. Do not rewrite history
to make an earlier choice look better. Proposed records can change during review;
show rejected/accepted/superseded states without requiring a committee.

Keep the Toolshare scenario and five questions in the findings report held out
from authored examples. The correction rerun must use them verbatim. This tests
transfer to a different domain and a different kind of architectural change.

### AI and evidence

Use stable capabilities rather than a list of services or install counts. Useful
tasks include mapping a diff to affected documents, drafting from supplied code
and contract facts, detecting conflicting examples, proposing lookup headings,
and checking a changed procedure in a disposable environment.

Require the input's source/version and a named human reviewer. A draft must flag
missing facts. Reading a command, passing a type check and executing the full
procedure answer different questions. Report which was done, the environment
and observed result. Do not claim a fix was tested because an agent wrote a
sentence saying it was. Never fabricate credentials, access rights, defaults,
API behavior, incident outcomes or roadmap promises. Sanitize examples before
publication. Link operational/security specifics to their owning stages.

The [Docuwiz article](https://www.docuwiz.io/blog/blog-technical-documentation-templates)
supports source-grounded drafting and human verification. Its starter kit is a
structure reference, not authoritative facts about the worked application.

### Files and interfaces

| File | Change in the implementation round |
| --- | --- |
| `docs/10-documentation.md` | Correct active teaching and closing checklists; integrate accepted research and add the AI section. Remove the pending-research notice/appendix after its accepted material has teaching homes and the rest is retained in source notes. |
| `web/src/lib/stage-10-structure.test.ts` | New targeted guards for active teaching, lifecycle, update/check mapping, provider examples and evidence review. |
| `web/src/lib/stage-metadata.test.ts:50` | Add `10-documentation` to the explicit AI-section list before authoring the AI section, producing a real RED. Do not derive that list from `ready`. |
| `web/src/lib/terms.ts:226` | Clarify historical reasoning versus supersession pointers in `adr.full`; retain the Stage 03 link. |
| `web/src/lib/terms.test.ts` | Guard the ADR meaning so the old absolute definition cannot silently return. |
| `reference/glossary.md` | Regenerate through `pnpm gen:glossary`, never edit by hand. |
| `reference/stage-10-source-research.md`, `reference/cheatsheet-sources.md` | Preserve provenance, record checked sources and distinguish chapter use from W-6 candidates. |
| `docs/task.md`, `docs/tracker.md`, `KICKOFF.md` | Record evidence, remaining work, branch state and the separate port checkpoint. |

The port registries, `stages.ts` readiness, components, global tokens, installed
dependencies, existing Stage 03 panels and `references.ts` are outside this
implementation. Correcting the shared glossary does affect existing popover and
glossary text; account for that in verification rather than calling it invisible.

### Sources and rejected approaches

- [Diátaxis primer](https://diataxis.fr/start-here/) supplies the reader-need
  distinction. Reject forcing its categories into four empty folders: the
  chapter should help choose an answer, not prescribe a documentation platform.
- [Nygard's ADR guidance](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
  and the [MADR template](https://github.com/adr/madr/blob/4.0.0/template/adr-template.md)
  support small records and discoverable supersession. Reject both deleting
  earlier decisions and freezing their current-status discovery forever.
- [Google's review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
  and [Write the Docs](https://www.writethedocs.org/guide/docs-as-code/) support
  why-focused comments, associated-document review and explicit checks. The
  proposed impact matrix is this playbook's application of that advice.
- [GitHub's README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
  and [C4's review checklist](https://c4model.com/diagrams/checklist) support
  usable entry points and maintained views. Reject the claim that any structure
  description is inherently wasteful.
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
  [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)
  inform a brief artifact distinction; release mechanics remain in shipping stages.
- Keep the user's [Mushtaq article](https://www.linkedin.com/pulse/project-management-documentation-library-practical-guide-mushtaq-pwuaf/)
  as supporting ownership/review context. Reject importing its entire governance
  library or treating advice as a required standard.
- Preserve the [source research](../../../reference/stage-10-source-research.md)
  on Stripe and Prisma. Replacing the ORM comparison avoids an unrelated review
  of current database tooling without declaring a contextual preference wrong.
- Do not embed the user's template graphic in the app. Its original image URL
  and reuse terms remain unverified; the official Diátaxis/C4 captures also need
  a separate layout and accessibility decision before website publication.

## Testing

The plan must specify tests before each corresponding teaching correction.
Tests read the canonical file, not a copy of the research report. Extract active
sections with a fence-aware scanner: an ADR's `## Context` or a README's
`## Deploying` inside a code fence is not a chapter boundary.

The pending research appendix already contains several desired phrases. Tests
that search the whole file could pass before the correction. Exclude that
appendix when testing active teaching, and guard its eventual removal separately.
Likewise, positive wording about supersession is insufficient while the old
contradictory rule survives in Traps or Definition of done.

Minimum guard families:

- Reader needs and a concrete smallest-set decision, with optional artifacts
  staying optional and a maintained factual reference staying legitimate.
- README setup evidence under its own teaching heading.
- ADR anatomy, old/new links, preserved reasoning and the current/history
  distinction across both teaching and completion checks.
- A change matrix covering configuration and contract fields, with actual
  checks and ownership; no claim that an example file validates itself.
- Scoped provider examples that no longer assert silent truncation or diagnose
  a handler from a universal attempt threshold.
- AI guidance that requires traceable facts, sanitized examples and observed
  evidence for a validation claim; metadata-list RED before adding the section.
- ADR glossary wording, generated glossary sync and its retained ready-stage link.

Use existing Vitest/node conventions and literal semantic expectations. Do not
test a copied label against itself or pin entire paragraphs for formatting alone.
Add a parser fixture with fenced example headings if introducing an extractor.

Teeth checks must target the real failure modes: leave a desired phrase only in
the appendix, restore the old configuration-enforcement claim, remove the old
record's replacement pointer, or restore the glossary's absolute wording. Show
which guard fails for each and restore the committed implementation afterward.
An existing snapshot-sync failure may accompany a glossary mutation; report it
honestly and isolate the semantic-guard run when demonstrating that guard's teeth.

## Verification

Before calling the chapter corrected:

1. Trace every accepted completeness/consultability finding and source correction
   to its teaching, checklist and guard. Record rejected findings as boundaries.
2. Re-run fresh readers against the corrected chapter with the identical Toolshare
   scenario and five questions. Budget a fix wave and recheck its own additions.
   Aim for five sufficient, directly discoverable answers; do not relabel a
   partial as a hit to meet that target.
3. Classify all executable fences. Compile and exercise genuinely runnable examples
   in isolation; mark commentary/pseudocode/incomplete templates clearly. Follow
   D-68's literal-versus-completed distinction when missing symbols are intentional.
   A Markdown specimen does not establish a runtime result for Workshop.
4. Run the repository gate from `web/`: `pnpm format:check`, `pnpm lint`,
   `pnpm typecheck`, `pnpm test`, `pnpm build`, and `pnpm test:e2e`. The shared
   glossary is rendered by existing UI, so cover the production audit and its
   responsive/contrast checks. Run `pnpm test:dev-console` once for the round
   and state which server/build was checked; preserve user-owned servers.
5. Check all new/changed local links and relevant external destinations, generator
   sync and source attribution. Apply the humanizer review to the corrected prose.
6. Obtain per-task review and a final whole-branch review of the implementation,
   including its source-collection commit. That review is later work; a builder
   check of this spec does not replace it.

`pnpm test:prod` checks the deployed site and is not evidence about this branch.
No promotion or deployed validation is part of this round.

## Documentation updates

Record cold-reader baseline, repeatable instruments, accepted/rejected findings,
source corrections, RED/GREEN logs, teeth-check results and the correction rerun.
The implementation report must distinguish illustration from executed evidence.

Keep source gathering separate from implementation history. Do not silently
rewrite the research record to say it was always corrected. Resolve the temporary
research appendix by integrating teaching and linking the preserved source notes.
Update scope and handoff records without marking W-3.17 complete: this round
prepares its port. W-3 remains 15/18 and W-6 22/27 unless separately delivered work
actually changes those registries.

Before executing, write the detailed plan from this approved design. Recommend
inline or subagent-driven execution from that plan's actual dependencies and
review risks, not a preference copied from an older stage.

## Risks

- Too much documentation about documentation can obscure the minimum useful set.
  Keep one worked change, short specimens and explicit optionality.
- ADR examples can appear current when they are historical. Show reciprocal
  replacement links and separate preservation from current instructions.
- Tests can pass on the research appendix or on headings inside sample fences.
  Scope assertions to active teaching and prove them with realistic mutations.
- Generation can make an incorrect source look authoritative. Demonstrate what
  the check establishes and what still needs a responsible reader.
- A scenario without real project commands cannot prove onboarding works. Test
  the chapter's completeness separately from a real application's setup.
- The shared ADR definition is visible outside this chapter. Regenerate and test
  that surface rather than silently leaving the conflicting definition in place.
- The parent checkout has unrelated and uncommitted changes. Keep this worktree
  isolated and do not merge or clean up those files as part of this round.
