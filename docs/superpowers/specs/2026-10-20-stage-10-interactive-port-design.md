# Stage 10 documentation: interactive port

Date: 2026-10-20. Status: approved. The user's “proceed” followed the full written
design handoff and approves implementation planning. The earlier “continue”
started this separate port design after the chapter round. Integration remains
a separate decision. This feature branch starts at chapter tip `c092ac7`;
the completed chapter branch is preserved.

## Problem

The corrected [chapter](../../10-documentation.md) teaches documentation as work
that accompanies a change. The site still shows a placeholder: Stage 10 is absent
from `web/src/features/stage-content.ts:22` and remains `ready: false` at
`web/src/lib/stages.ts:122`. Its blurb at `stages.ts:119` still reduces all
documentation to explaining why, contradicting the chapter's practical guidance.

Readers need to choose an artifact, inspect a usable example and record how their
own change affects documentation. Porting the chapter as paragraphs would leave
those judgments unpractised. The existing stage system already provides hash
navigation (`web/src/components/Stepper.tsx:13`), expandable teaching and local
records. The port should use those patterns and the existing design system.

The [chapter correction rerun](../reports/2026-10-20-stage-10-correction-rerun.md)
returned five lookup HITs with no remaining teaching defect in its held-out case.
The chapter is the settled teaching input for this design, not a rewrite target.

## Goals

- Help readers choose the smallest document set for a specific reader and task.
- Make the README's missing project facts and fresh-clone evidence explicit.
- Teach ADR format, statuses and visible supersession through the chapter's
  linked Workshop records, preserving the historical reasons.
- Let readers trace a changed setting, response, boundary or procedure to its
  authoritative source, affected documents, check, owner and review trigger.
- Give readers a reusable documentation-change plan, saved in their browser
  when available and exportable as Markdown. Recording fields establishes no
  validation claim; documentation remains continuous work.
- Cover every chapter section through an interaction, worked artifact or concise
  reference, with source-to-panel coverage recorded below.
- Register the verified port and its step declaration together, retaining
  continuous cadence and the distinction between stage codes and a sequence.

## Non-goals

- **Generating a full document pack.** Inventing setup commands, deployment
  details or observed checks would undermine the lesson. Provide copyable
  specimens with explicit placeholders; the personal record plans a real change.
- **A document editor or repository integration.** This static site has no
  backend, credentials, file access or publishing service. Readers transfer the
  Markdown to their own workflow.
- **Publishing gathered images or a W-6 sheet.** The source collection remains
  available for a separate companion round. A template menu is not a requirement
  to create nine documents, and a port does not advance W-6 counts.
- **An app-wide form or quiz framework.** Shared primitives remain in use;
  stage-specific state and data stay local. Generalizing private feature helpers
  would add unrelated migration and review work.
- **Repairing other stages or rewriting the chapter.** Their teaching and storage
  behavior are separate concerns. A newly discovered dependency that blocks this
  port must be identified and scoped before any repair.
- **Integration or deployment.** Every merge needs the user's separate approval;
  pushes and promotion to main remain the user's.

## Constraints

The app remains Next.js 16, React 19 and TypeScript with existing dependencies.
Read the installed Next.js guides required by `web/AGENTS.md` before code.
Use `web/DESIGN.md` tokens and type roles in both whiteprint and cyanotype themes.
Brand indicates attention; semantic colors indicate a verdict. Text or icons
must also carry that verdict.

`web/PATTERNS.md:49` and D-52 govern panel weight: one judgment per panel and at
most four screens at 1024×768. Step count follows the teaching. The proposed
twelve panels are an approved initial design, not a fixed cap.
If measurement requires a split, record the seam and update the step declaration,
tests, coverage and records together; retain the teaching and deep links.

The canonical Markdown and hand-authored React content remain separate by the
repository's established design. The coverage matrix and focused content guards
bound this duplication; this round does not add a Markdown runtime parser.
Workshop remains the illustrative case. Toolshare stays held out of authored
examples, fixtures and drills so the port can be assessed with the same scenario.

TDD applies to product code and behavior: actual RED for the expected reason,
GREEN, then deliberately broken implementation proving the new test has teeth.
Derived displays require render tests. Production browser checks and the separate
development-console sweep are both required before a completion claim.

## Architecture

### Decisions and ownership

The user selected Stage 10, supplied research and authorized the chapter round
through implementation. The follow-on port now has its own design checkpoint.
The stack, design system, continuous cadence and delivery process are established
repository constraints.

**Design calls made here:** a reusable change plan rather than a full document
pack; twelve initial panels; Workshop examples; session-only exercise answers;
one browser-local plan with eight free-text fields and ten checklist selections.
An optional preference question about the deliverable was sent during exploration;
no reply was available when this draft was written. The subsequent written-design
approval adopts these calls; the bounded D-52 measurement rule still applies.

The builder may choose component/file boundaries, accessible control wording,
spacing within existing tokens and concise exercise distractors. They may not
change the record's meaning, chapter facts, coverage or evidence requirements.
Stable IDs below are the initial contract; a justified D-52 split is the bounded
exception described above.

### Stage composition and registration

Add `web/src/features/documentation/` with a stage entry, ordered step tuple,
authored content data, focused interaction leaves and tests. Use the shared
`Stepper`, `Figure`, `RevealList`, `Term`, `TeamNotes`, `References` and UI
primitives. Diagram numbers are explicit and unique across the whole stage.

Register the entry under `10-documentation` in `stage-content.ts`, declare its
tuple in `web/src/features/step-ids.ts:34`, and flip `ready` only as part of the
tested port. The rail contract at `web/src/features/rails.test.tsx:31` observes
the registered component, not a duplicate test-only mapping. Update the blurb
to: “Help the next person use the system, and preserve the reasons behind it.”
Keep the title, continuous cadence and timing. No navigation implies that Stage
10 must finish before Stage 11 begins.

### Panels and coverage

| ID / label | Reader judgment and interaction | Chapter home / required detail |
| --- | --- | --- |
| `choose` / Choose a document | Select one of four reader needs; inspect the matching form and Workshop example. Independently expand artifact choices and when they earn their cost. | Choose the document for the reader's task; Entry criteria; Artifacts. Distinguish tutorial, how-to, reference and explanation. Include README, architecture, ADR, conventions, troubleshooting, changelog and release notes. Explain curated history versus audience-specific release impact. |
| `readme` / Verify the README | Inspect the chapter's copyable outline and reveal the fresh-clone check: prerequisites, access/config source, actual commands, revision and observable result. | Keep the README usable. Placeholders remain visible; copying is not running. Link setup, release, verification and incident stages by purpose. |
| `decisions` / Replace a decision | Select the historical or replacement ADR, inspect its complete specimen and follow in-panel links to its counterpart. Expand status meanings and format guidance. | Record decisions and supersede them visibly. Preserve ADR 004's original Accepted text and dated Current status: Superseded notice; ADR 005 is Accepted, with reciprocal links. Include Context, Decision, Reasoning, Consequences, Alternatives, dates, naming/location convention and existing-index update. |
| `reference` / State exact facts | Inspect the scoped Workshop relationship drawing, then select a setting or response field to inspect shape, default/absence, source and review trigger. | Keep architecture and contract references current. Attendee → Workshop app → Booking store with labeled relationships. BOOKING_WINDOW_DAYS is integer 1–365, default 30 when unset; waitlistPosition is positive integer, omitted when not waitlisted. Show version/source requirements and preserve absent/null/empty distinctions without inventing their behavior. |
| `comments` / Explain the exception | Commit an answer for each of four short comment cases before revealing the authored explanation. Cases exercise external constraints, deliberate deviations, tricky logic and known limits. | Write comments for non-obvious reasons. Keep code-comment advice scoped to comments; purpose/use/behavior can belong in module docs. Include rename-versus-comment guidance. Preserve the four chapter examples as illustrative comments, with the Stripe source qualification and no invented retry diagnosis. |
| `changes` / Trace the change | Select each of six change types to inspect its source → affected documents → explicit check → owner/trigger chain. | Update and verify documentation with the change. Cover configuration, response, default/allowed value, boundary/dependency, setup/release and known failure/release material. Explicitly distinguish .env.example from an invoked validator and generation from source/behavior validation. Solo maintainers are owners too. |
| `history` / Keep history usable | Choose between a historical decision/release record and current instructions; reveal preserve-and-link versus correct/redirect/retire. Open a commit-context comparison. | Choose what to omit or archive; Commit messages preserve change context. Preserve historical reasons and current-status/version context. Omit obvious comments/unmaintained inventories. Commit bodies preserve useful reasons; a clear subject can suffice. Link Stage 05's commit guidance. |
| `ai` / Check the evidence | Classify Read, Compile and Execute evidence before revealing its limits; expand grounded drafting and human-review checks. | AI in documentation. A source/version, named reviewer and synthetic data are required. Missing facts remain unknown. Execution claims name command, revision, environment and observed result; an isolated example does not prove production recovery. Link Stage 14. |
| `your-change` / Plan your change | Fill four labeled fields for the reader's own application; inspect/export the whole record or clear it with confirmation. | Applied synthesis: change/scope, reader/task, affected documents/action, authoritative source/revision. No example answer is inserted into the personal record. |
| `your-evidence` / Plan the check | Fill the other four fields of the same record; export or clear the whole record from this view too. | Applied synthesis: check/expected result, observed evidence/limits, owner/reviewer, review trigger/follow-up. Planning a check is distinct from recording its observed result. |
| `checklist` / Review this change | Check seven per-change and three periodic items; distinguish the groups and persist the selections. Expand team notes inside this panel. | Definition of done; Scaling to a team. Preserve all ten checks and all five team points. Mark selections as self-recorded, not validated or stage completion. Periodic work has its own cadence. |
| `traps` / Spot the trap | Expand eight symptom-shaped rows, each with the failed assumption and the chapter's corrective action. | All eight Traps, without adding new teaching found only here. |

The document chooser and fact/change inspectors are direct lookup controls, not
scored quizzes. ADR counterpart controls change the specimen inside `#decisions`;
they do not navigate to nonexistent repository files. Display the chapter's
filenames as examples. Offer a generic blank ADR outline alongside the worked
records, labeled “template”; it uses the same taught fields and explicit empty
project facts. Do not offer Workshop's historical record as the user's decision.

Keep the initial panel concise. Expanded content remains available for comparison;
use native disclosure or `RevealList`, not hover-only explanations. The README
outline and ADR cards use semantic headings/text with a separately copyable
Markdown representation. Guard that copied content includes the displayed facts
and excludes annotations or exercise verdicts. Use short source-linked excerpts
or authored paraphrases rather than republishing gathered source images.

### Exercises

Use one stage-local, parameterized decision control for the comments and AI sets.
Each case has a stable ID, prompt, options, correct choice and rationale. Native
radio groups have distinct accessible names. Selecting an option is a draft;
an explicit Check commits it, locks that case and reveals the rationale for both
correct and incorrect choices. Show committed correct / committed total for that
set. Reset clears draft and committed choices, feedback and score together.

Show one case at a time with explicit navigation and position. Keep committed
answers when revisiting cases or changing stage panels during the mounted stage
session; a reload starts the exercises afresh. Answer keys are intentionally in
the client bundle because this is practice, not a secure assessment. Exercise
scores never update the personal plan or checklist.

### Personal record and storage

Use one versioned key, `playbook:documentation-change:v1`, containing the eight
strings named above and an array of the ten known checklist IDs. The builder
defines stable field and checklist IDs in data and pins them with independent
literal tests. Normalize unknown JSON: accept known string fields and known
unique checklist IDs only; arrays/null/wrong shapes, malformed JSON and missing
values yield safe empty values. Drop unknown keys on the next local edit.

One stage-level provider stays mounted around the Stepper. It owns the record
and exercise session so switching panels preserves both, including a draft whose
storage write failed. Reuse `useLocalStorage` as the subscription mechanism
(`web/src/lib/useLocalStorage.ts:59`); use a stable server-empty snapshot and
normalize its unknown data. Do not introduce effect-body setState for hydration.

The performance worksheet (`web/src/features/performance/PerformanceWorksheet.tsx:24`)
provides the existing save/readback/fallback precedent. This record must verify a
write by readback. A failed read or write keeps the current stage-session draft
editable, announces that saving is unavailable and tells the reader to export
before leaving/reloading. It must survive movement between these panels; it
cannot promise durability beyond the mounted stage. While an unsaved draft
exists, preserve it ahead of external storage updates. Otherwise follow the
shared hook's same-tab updates and cross-tab storage events. Concurrent tabs
use last successful whole-record write; collaborative merging is out of scope.

“Clear whole record” confirms that both views and all ten selections will clear.
Cancel changes nothing. Success removes the key and resets fields/selections in
both views. Failure resets the current draft visibly but explicitly warns that
the saved copy could return after reload; it does not claim persistent deletion.
Exercise reset and record clear are separate controls. Export/clear are enabled
if any trimmed field or valid checklist selection is present.

Export the whole record in stable field/checklist order as Markdown, including
unrecorded fields as “not recorded” and unchecked checks as unchecked. Include a
short note that these are reader-entered claims and selections. Count filled
fields as “recorded”; never label the form verified, compliant or complete.
User input stays literal text, including Markdown/HTML-like strings; do not
render it as HTML or create executable links from it.

### Copy behavior and boundaries

Every new copy action handles missing/denied clipboard access. On failure, reveal
a labeled read-only textarea containing the exact current Markdown and announce
the manual-copy route. Success has a polite status. A stale success message must
not misrepresent a later changed record; clear or contextualize it on edits.

The private `web/src/features/performance/CopyText.tsx:5` demonstrates this
fallback. A small stage-local equivalent is an explicit, bounded duplication;
do not import from another feature or silently turn this into an app-wide helper
migration. The shared `CopyArtifact` at `ArtifactControls.tsx:70` lacks that
fallback, so the new port's semantic document cards use its own copy leaf rather
than inheriting or repairing unrelated copy behavior. Shared visual primitives
still provide the document containers and text treatments.

### References and terms

Reuse the chapter's accepted sources. Add five curated Stage 10 entries to
`web/src/lib/references.ts:17`: Diátaxis's primer, GitHub's README guidance,
Nygard's ADR article, C4's review checklist and Write the Docs' docs-as-code guide.
Each entry states what it adds beyond the port. Cite these sources beside the
relevant teaching too; retain the Stripe source beside its comment example and
the chapter's changelog/release links where those distinctions appear. Verify
destinations during implementation; add no new unsupported external claim.

Use existing inline terms, especially ADR, when they help a novice. The chapter
round already corrected that term and the generated glossary. Any necessary new
term goes in `terms.ts` with its generated Markdown and tests, never by hand in
`reference/glossary.md`; new glossary entries are not assumed necessary here.

## Testing

The implementation plan must supply task-level full test/source slices and raw
RED/GREEN/teeth evidence. Tests cover behavior and teaching boundaries:

- Ordered literal step IDs, registered rail and ready-stage metadata; the new
  blurb teaches usable documentation and continuous cadence remains intact.
- Authored data and rendered selection agree for all four needs, every artifact
  choice, both contract facts and all six change rows. Alter a rendered field
  independently of its data to prove render guards detect it.
- README and ADR copy match their displayed content; placeholders remain. The
  old ADR's dated current supersession notice and reciprocal replacement are
  asserted in the old/new rendered specimens, not satisfied by a status legend.
- All comment/AI cases: no premature rationale, wrong-answer explanation,
  committed score, panel revisit and full reset. Test interaction with an
  authored wrong choice as well as correct choices, not just array lengths.
- Exact eight-field and ten-ID normalization, corruption, wrong types, unknown
  keys, stable export order, empty values, literal user input and checklist-only
  export. Serialize the normalized model, not raw unknown storage.
- Mounted form/checklist behavior: hydration, reload persistence, panel changes,
  same-tab/cross-tab notifications, failed reads/writes, retained unsaved drafts,
  successful and failed clear, confirmation cancellation and whole-record scope.
- Clipboard success, denial/missing API, manual-copy text and status after edits
  for the personal record and specimens. Asynchronous rejection produces no
  unhandled error. Checklists distinguish periodic and per-change selections.

Keep the completed chapter/glossary guards passing. Test content claims through
specific meaning and displayed behavior; a broad source-string snapshot alone
does not prove the reader sees the right fact.

## Verification

Run the repository gate from this worktree's `web/`: format check, lint,
`pnpm typecheck`, full tests, production build and `pnpm test:e2e`. Run
`pnpm test:dev-console` once for the stage round against its separate development
build. Record actual counts and environments rather than copying chapter totals.
The production smoke check of the deployed site is not evidence about this tree.

Exercise every Stage 10 panel and material state in both themes: open disclosures,
all inspector selections, wrong/right exercise feedback, filled fields, storage
warnings and manual copy. Check distinct text/background contrast pairs, focus,
keyboard operation, touch targets below lg and 320→2560px overflow. Measure D-52
at 1024×768 using the shared audit; inspect opened long content separately.
Verify deep-link loads and browser back/forward, rendered source links and all
cross-stage destinations. Preserve the parent checkout's port-3200 server.

Give fresh completeness and lookup reviewers the same held-out Toolshare case
and five questions retained in the correction report, now against the port.
They may inspect all panels and controls but receive no private coaching. Record
exact navigation and artifacts, missing facts and any teaching/findability defect.
Check findings against both the port and chapter before assigning provenance.
An implementation final fix wave receives its own tests and browser checks.

Per-task independent reviews precede the final whole-branch review. The final
review covers the chapter-plus-port branch relative to develop as one unit,
while retaining the completed chapter review as evidence. A Ready to merge
verdict and passing checks still do not authorize a merge.

## Documentation updates

- Commit this spec separately with `docs(spec)`, recording its proposed status
  and builder-check outcome. Approval updates the status before planning.
- Keep `docs/task.md` W-3.17, tracker Current phase/Next up and `KICKOFF.md`
  current at each handoff. Reference the existing chapter evidence, not another
  execution of completed chapter tasks.
- During implementation, keep a chapter-heading → panel/interaction coverage
  table and execution evidence, including deferrals and review dispositions.
- After verification, record Stage 10's delivered branch state separately from
  integration. W-3 counts describe their stated branch: develop remains 15/18
  until an approved merge; a delivered feature tree would have 16/18. W-6 stays
  22 drawn / 27 registered. No reference sheet is delivered by this round.
- Keep source provenance in the existing research notes/ledger. Apply the
  humanizer review to authored prose and the written spec/plan, preserving the
  project's concrete teaching and technical facts.

## Risks

The ADR specimens and personal record are the likely panel-weight pressure
points. Separate plan/evidence views and one visible ADR at a time reduce the
initial weight; measured splits remain available without dropping content.

Storage can fail and clipboard access can be denied. Session-held drafts,
readback checks, honest clear warnings and manual-copy text are acceptance
requirements, not promises made by a generic persistence hook.

Hand-porting can lose qualifications while retaining the headline fact. The
coverage matrix, targeted rendered guards and same-case readers must preserve
the invoked-validator prerequisite, absence semantics, historical/current ADR
distinction and limits of claimed execution evidence.

This branch includes unmerged chapter commits. Keep its base and review range
explicit; do not silently merge the chapter separately or alter develop during
design. Integration remains a user decision after the whole unit is reviewable.
