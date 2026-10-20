# Stage 10 Documentation Chapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct Stage 10 so a reader can choose, write and verify a small useful documentation set, including discoverable ADR supersession.

**Architecture:** Replace the canonical chapter through one cohesive, tested teaching correction, then reconcile the shared ADR glossary in a second task. Preserve research separately, prove guard sensitivity, rerun the original held-out assessment, and verify the shared glossary's existing UI surfaces before whole-branch review.

**Tech Stack:** Markdown, TypeScript, existing Vitest 4 projects, generated glossary, existing Next.js 16.2.10/Playwright gates. No new dependency or documentation platform.

**Spec:** [Approved chapter design](../specs/2026-10-20-stage-10-documentation-design.md).

## Global Constraints

- Stage 10 is continuous work. Keep the H1 title and the house top-level sections: Entry criteria, The work, Artifacts, Definition of done, Scaling to a team and Traps.
- The audience remains a solo production-grade developer who may add an occasional maintainer (D-37).
- Follow TDD for teaching corrections and code changes: a failing guard first, minimum correction, green run and a teeth check.
- Keep RED/GREEN terminal output in the eventual execution report. D-47 applies to the ADR glossary.
- Its `see` link remains `03-architecture` because that ready stage already teaches ADRs; do not point the term at Stage 10's placeholder before the port is ready.
- All examples are either explicitly illustrative or checked against an identified source/project version. No invented incident dates, provider guarantees or validation results.
- Preserve the source ledger and generated glossary convention. Run `pnpm gen:glossary`; never hand-edit `reference/glossary.md`.
- Keep the Toolshare scenario and five questions in the findings report held out from authored examples. The correction rerun must use them verbatim.
- The port registries, `stages.ts` readiness, components, global tokens, installed dependencies, existing Stage 03 panels and `references.ts` are outside this implementation.
- Every later merge still requires the user's approval; pushes and promotion remain the user's actions.
- Work in `/Users/angelito/personal/Development-Playbook/.worktrees/stage10-chapter`, on `docs/2026-10-20-stage-10-chapter`. The pre-execution tip is `ac30cf7`; source collection is `e30c9a4`; develop baseline is `79f9e31`. Planning/records commits may follow. Do not alter the parent checkout's files or dev server.
- Every task includes independent read-only review. Inline execution retains that repository requirement; it does not replace per-task review with only a final review.

## Review Focus

- **Desired teaching appears only in research:** Task 1 scopes assertions to active teaching and tests a research-only decoy; Task 3 performs a real appendix mutation.
- **Example Markdown contains chapter-like headings:** Task 1's fixture includes a same-named heading inside a four-backtick specimen containing three-backtick text; only outside-fence headings delimit sections.
- **A replaced ADR still looks accepted, or history is deleted as stale:** Task 1 requires a dated current-status notice and reciprocal links, plus historical/current distinctions in the completion and trap sections; Task 3 removes only the old-to-new link.
- **A configuration value or optional response is absent:** Task 1 checks the illustrative default, startup validation prerequisite and omitted-field behavior in the actual reference section, not in the appendix.
- **A draft claims tests passed or carries private examples:** Task 1 requires evidence levels, a named reviewer, missing facts and synthetic examples; source/code assertions alone cannot establish those claims.

---

### File map and dependency order

| File | Responsibility | Owner task |
| --- | --- | --- |
| `docs/10-documentation.md` | Canonical teaching and its completion criteria | 1; targeted findings in 4 |
| `web/src/lib/stage-10-structure.test.ts` | Local fence-aware extraction and chapter regression guards | 1; new findings in 4 |
| `web/src/lib/stage-metadata.test.ts` | Explicit Stage 10 AI-section requirement | 1 |
| `web/src/lib/terms.ts`, `web/src/lib/terms.test.ts` | ADR definition and its semantic guard | 2 |
| `reference/glossary.md` | Generator output from the term source | 2 |
| `docs/superpowers/reports/2026-10-20-stage-10-execution.md` | Raw RED/GREEN, mutation, fence and gate evidence | all tasks |
| `docs/superpowers/reports/2026-10-20-stage-10-correction-rerun.md` | Repeatable reader reports and fix dispositions | 4 |
| `reference/stage-10-source-research.md`, `reference/cheatsheet-sources.md` | Provenance and accepted/deferred source use | 5 |
| `docs/task.md`, `docs/tracker.md`, `KICKOFF.md` | Verified delivery state and separate port checkpoint | 5 |

Tasks 1 → 2 → 3 → 4 → 5 run sequentially. The two cold readers in Task 4 may
run concurrently because both are read-only. No task creates a backend,
`docs/adr/` records for this repository, or actual Workshop configuration.

The concrete Workshop names, dates and values below are plan choices offered
for review: `BOOKING_WINDOW_DAYS`, integer 1–365, illustrative default 30;
`waitlistPosition`, a positive integer omitted when not waitlisted; ADRs 004/005.
They are not facts about this static playbook or the held-out Toolshare case.

### Task 1: Correct the chapter and guard its active teaching

**Files:**
- Create: `web/src/lib/stage-10-structure.test.ts`.
- Modify: `web/src/lib/stage-metadata.test.ts`, `AI_SECTION_STAGES`.
- Modify: `docs/10-documentation.md`.
- Create/append: `docs/superpowers/reports/2026-10-20-stage-10-execution.md`.

**Interfaces:**
- Consumes: approved spec, existing source notes and unchanged chapter teaching at `ac30cf7`.
- Produces: nine teaching headings below; the existing six top-level chapter sections; a required `### AI in documentation` subsection; no research appendix.
- Test-only, module-private signatures: `headings(md: string): Heading[]`, `activeTeaching(md: string): string`, `section(md: string, title: string): string`, `doc(): string`; `Heading = { title: string; depth: number; line: number }`. They are not application exports or a general Markdown parser.
- Task 3 refers to these tests by name. Task 2 changes only the separate glossary source/guard and generated output.

- [x] **Step 1: Write the failing chapter guards.** Create the following complete test source. The helpers are test code; fixture tests prove their boundaries before relying on chapter assertions.

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

type Heading = { title: string; depth: number; line: number }

function headings(md: string): Heading[] {
  const result: Heading[] = []
  let fence: { marker: string; size: number } | undefined
  md.split('\n').forEach((line, index) => {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (delimiter) {
      const marker = delimiter[1][0]
      const size = delimiter[1].length
      if (!fence) fence = { marker, size }
      else if (
        marker === fence.marker &&
        size >= fence.size &&
        delimiter[2].trim() === ''
      ) fence = undefined
      return
    }
    if (fence) return
    const match = line.match(/^(#{1,6}) (.+)$/)
    if (match) result.push({ title: match[2], depth: match[1].length, line: index })
  })
  return result
}

function activeTeaching(md: string): string {
  const appendix = headings(md).find(
    (heading) => heading.depth === 2 && heading.title === 'Research findings for chapter review',
  )
  return appendix ? md.split('\n').slice(0, appendix.line).join('\n') : md
}

function section(md: string, title: string): string {
  const active = activeTeaching(md)
  const list = headings(active)
  const index = list.findIndex((heading) => heading.title === title)
  expect(index, 'missing active teaching heading: ' + title).toBeGreaterThan(-1)
  const start = list[index]
  const next = list.slice(index + 1).find((heading) => heading.depth <= start.depth)
  return active.split('\n').slice(start.line + 1, next?.line).join('\n')
}

const path = fileURLToPath(new URL('../../../docs/10-documentation.md', import.meta.url))
const raw = () => readFileSync(path, 'utf8')
const doc = () => activeTeaching(raw())
const flat = (text: string) => text.replace(/\s+/g, ' ')

test('fenced specimen headings do not end active chapter sections', () => {
  const fixture = [
    '### Keep the README usable',
    '````markdown',
    '## Deploying',
    '```text',
    '## Research findings for chapter review',
    '```',
    '````',
    'fresh clone check belongs here',
    '### Next teaching section',
    'outside',
  ].join('\n')
  expect(headings(fixture).map((heading) => heading.title)).toEqual([
    'Keep the README usable', 'Next teaching section',
  ])
  expect(section(fixture, 'Keep the README usable')).toContain('fresh clone check belongs here')
  expect(section(fixture, 'Keep the README usable')).not.toContain('outside')
})

test('planned answers in the research appendix cannot satisfy active teaching', () => {
  const fixture = [
    '## The work', '### Current advice', 'old wording',
    '## Research findings for chapter review',
    '### Choose the document for the reader’s task', 'desired answer',
  ].join('\n')
  expect(activeTeaching(fixture)).toContain('old wording')
  expect(activeTeaching(fixture)).not.toContain('desired answer')
  expect(headings(activeTeaching(fixture)).map((heading) => heading.title))
    .not.toContain('Choose the document for the reader’s task')
})

test('documentation keeps its continuous cadence and all house sections', () => {
  expect(doc()).toMatch(/^# 10\. Documentation\n/)
  expect(doc()).toContain('Continuously')
  expect(headings(doc()).filter((heading) => heading.depth === 2).map((heading) => heading.title))
    .toEqual(['Entry criteria', 'The work', 'Artifacts', 'Definition of done', 'Scaling to a team', 'Traps'])
})

test('the teaching order exposes document selection and verification as lookup tasks', () => {
  expect(headings(section(doc(), 'The work')).filter((heading) => heading.depth === 3).map((heading) => heading.title))
    .toEqual([
      'Choose the document for the reader’s task',
      'Keep the README usable',
      'Record decisions and supersede them visibly',
      'Keep architecture and contract references current',
      'Write comments for non-obvious reasons',
      'Update and verify documentation with the change',
      'Choose what to omit or archive',
      'Commit messages preserve change context',
      'AI in documentation',
    ])
})

test('reader needs choose a small useful set without making every template mandatory', () => {
  const text = section(doc(), 'Choose the document for the reader’s task')
  for (const kind of ['Tutorial', 'How-to guide', 'Reference', 'Explanation']) expect(text).toContain(kind)
  expect(text).toMatch(/optional/i)
  expect(text).toContain('README')
  expect(text).toContain('ADR')
  expect(text).toContain('Changelog')
  expect(text).toContain('Release notes')
  expect(doc()).not.toContain('Everything else rots.')
  expect(doc()).not.toContain('Code says what. Documentation says why.')
})

test('README verification is taught where a new maintainer looks for setup guidance', () => {
  const text = flat(section(doc(), 'Keep the README usable'))
  for (const phrase of ['prerequisites', 'configuration', 'expected result', 'fresh clone', 'revision', 'first point']) {
    expect(text.toLowerCase()).toContain(phrase)
  }
})

test('replaced ADRs expose current status while preserving their historical reasoning', () => {
  const text = flat(section(doc(), 'Record decisions and supersede them visibly'))
  for (const phrase of ['Context', 'Decision', 'Consequences', 'Alternatives', 'Proposed', 'Rejected', 'Accepted', 'Superseded']) {
    expect(text).toContain(phrase)
  }
  expect(text).toContain('[ADR 005](005-generated-contract-reference.md)')
  expect(text).toContain('[ADR 004](004-manual-field-reference.md)')
  expect(text).toContain('2026-10-20')
  expect(text).toMatch(/append[\s\S]+supersession/i)
  expect(text).toMatch(/preserve[\s\S]+historical/i)
  expect(text).toContain('docs/adr/NNN-title.md')
  expect(doc()).not.toMatch(/Never edit an accepted ADR/i)
})

test('a current contract reference states defaults and optional-field absence explicitly', () => {
  const text = section(doc(), 'Keep architecture and contract references current')
  for (const phrase of ['scope', 'relationships', 'owner', 'BOOKING_WINDOW_DAYS', 'waitlistPosition', '1–365', '30', 'omitted when not waitlisted']) {
    expect(text).toContain(phrase)
  }
  expect(text).toMatch(/source|contract|schema/i)
})

test('documentation checks include configuration and response contracts with an owner', () => {
  const text = flat(section(doc(), 'Update and verify documentation with the change'))
  for (const phrase of ['Authoritative fact', 'Affected document', 'Check', 'Owner', '.env.example', 'response', 'validator', 'generation', 'review trigger']) {
    expect(text).toContain(phrase)
  }
  expect(text).toMatch(/alone[\s\S]+owner/i)
  expect(doc()).not.toContain('the app stops booting when it drifts')
  expect(doc()).not.toContain('The best documentation cannot drift')
})

test('provider comments teach a documented limit without inventing truncation or diagnosis', () => {
  const text = section(doc(), 'Write comments for non-obvious reasons')
  expect(text).toContain('500')
  expect(text).toMatch(/external[\s\S]+ID/)
  expect(doc()).not.toMatch(/silently truncated|past 5 attempts|means our handler is broken/i)
  expect(text).toContain('Known limitations')
})

test('current instructions can be retired while historical decisions remain discoverable', () => {
  const archive = section(doc(), 'Choose what to omit or archive')
  const done = section(doc(), 'Definition of done')
  const traps = section(doc(), 'Traps')
  for (const text of [archive, done, traps]) {
    expect(text).toMatch(/historical/i)
    expect(text).toMatch(/current/i)
  }
  expect(doc()).not.toContain('No documentation describes things that no longer exist')
})

test('AI validation claims require observed evidence and a responsible reviewer', () => {
  const text = flat(section(doc(), 'AI in documentation'))
  for (const phrase of ['source and version', 'named reviewer', 'missing facts', 'synthetic', 'command', 'environment', 'observed result']) {
    expect(text).toContain(phrase)
  }
  for (const evidence of ['Read', 'Compile', 'Execute']) expect(text).toContain(evidence)
})

test('the example is illustrative and the assessment case stays held out', () => {
  expect(doc()).toContain('Workshop')
  expect(doc()).toMatch(/Illustrative/i)
  expect(doc()).not.toContain('Toolshare')
})

test('review notes are removed after their accepted findings enter active teaching', () => {
  expect(headings(raw()).map((heading) => heading.title)).not.toContain('Research findings for chapter review')
  expect(raw()).not.toContain('Research status, 2026-10-15')
  expect(raw()).toContain('../reference/stage-10-source-research.md')
})
```

- [x] **Step 2: Require the missing AI section.** Insert `'10-documentation',` immediately after `'09-performance-optimization',` in `AI_SECTION_STAGES`, preserving the explicit-list design.
- [x] **Step 3: Run RED.** From `web/`, run `pnpm exec vitest run src/lib/stage-10-structure.test.ts src/lib/stage-metadata.test.ts`. Save raw terminal output. Expected: new active-section/content guards fail because the teaching is unchanged; the Stage 10 metadata case fails because the AI heading is absent. Fixture cases must pass. A syntax/import failure is not valid RED evidence.
- [x] **Step 4: Replace `docs/10-documentation.md` with this complete source.** The exact source is inline because the repository requires implementers to work from a task slice. These illustrative templates are chapter content, not files to create in the application.

````markdown
# 10. Documentation

> Help the next person use the system, and preserve the reasons behind it.

**When this actually happens:** Continuously. Update the relevant document with
the change, while the reason and the evidence are available.

---

## Entry criteria

None. Documentation runs alongside the other work. Start with a reader and a
question they need answered.

---

## The work

### Choose the document for the reader’s task

Documentation can teach a skill, give instructions, supply exact facts or explain
a choice. The useful distinction is what the reader needs now.

| Reader needs to… | Form | Example |
| --- | --- | --- |
| Learn through a guided exercise | Tutorial | Make a first booking in a safe sample environment |
| Complete a known task | How-to guide | Roll back a deployment |
| Look up precise facts | Reference | Find a field’s type, default and allowed values |
| Understand a concept or choice | Explanation | Understand why a contract is generated |

This distinction comes from [Diátaxis](https://diataxis.fr/start-here/). It does
not require four folders. A README can orient a reader and link to the right page.

Start with a README, significant decision records and the configuration facts
the application actually needs. Other artifacts are optional until a reader has
a use for them:

| Artifact | Reach for it when… |
| --- | --- |
| README / getting started | Someone needs a first working setup and a route to more detail |
| Architecture overview | A reader needs boundaries, responsibilities and relationships |
| ADR | A significant choice and its alternatives need a lasting explanation |
| Conventions / contributing guide | Contributors need consistent rules and a way to handle exceptions |
| Troubleshooting | A known symptom needs checks, likely causes and a safe next action |
| Changelog | Readers need notable changes organized by version |
| Release notes | A release needs an audience-focused account of impact and required actions |

A changelog is curated version history, not a raw commit dump. Release notes can
select and explain those changes for a particular audience. A small patch may
need only one entry. See [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

The user-gathered nine-template graphic and its verified starter kit are useful
menus, not a requirement to produce nine documents. Sources and provenance are
preserved in the [research notes](../reference/stage-10-source-research.md).

### Keep the README usable

The README is the entry point. Give it a purpose statement and direct routes to
running locally, architecture and deployment. Link detailed procedures where a
short section would hide important conditions.

Illustrative outline; the bracketed project facts must be supplied and checked:

```markdown
# Project name
What this does, who uses it, and the smallest useful outcome.

## Running locally
Supported prerequisites and tool versions: [actual prerequisites].
Access and safe configuration source: [how a maintainer obtains them].
Clone, install and startup commands: [commands tested for this revision].
Expected result and first useful check: [observable result].

## Architecture
Scope, main boundaries and external dependencies: [current view].
Decision records: [link to the decision log or relevant ADRs].

## Deploying
Release and rollback procedures: [links, permissions and compatibility limits].
Logs and health checks: [where to look].
Help or responsible maintainer: [contact role or support route].
```

Verify it from a **fresh clone** without private instructions. Record the
revision, prerequisites, configuration source, commands and expected result.
The first point where the reader must ask someone becomes a concrete fix.
A listed command is not proof that anyone ran it. Stage [04](04-project-setup.md)
owns project setup; stages [13](13-production-deployment.md),
[14](14-post-deployment-verification.md) and [16](16-incident-management.md)
own release, recovery checks and incident response.

### Record decisions and supersede them visibly

Write an ADR for a significant decision whose context, alternatives or reversal
cost matters: a boundary, dependency, interface or deployment choice. One page
is a useful starting size, not a completeness limit. In this playbook the naming
convention is `docs/adr/NNN-title.md`, numbered sequentially without reuse.

Use Context, Decision, Reasoning, Consequences and Alternatives. Include a date
and enough status information for the reader to distinguish a proposal from an
adopted choice. Proposed records can change during review.

| Status | Meaning |
| --- | --- |
| Proposed | A choice is being considered |
| Rejected | The proposal was declined; preserve the reason |
| Accepted | The choice was reviewed and adopted |
| Superseded | A later decision replaced it; link to that record |

**Illustrative worked case: Workshop**, a fictional workshop-booking app. The
team previously maintained a field list by hand. A change adds a booking-window
setting and an optional waitlist position. They choose to generate the field
reference from their contract to avoid a second independently edited list.
These are teaching inputs, not measured facts about this static playbook.

Earlier record, `docs/adr/004-manual-field-reference.md`:

```markdown
# ADR 004: maintain the initial field reference by hand
Date: 2026-09-01
Status: Accepted

## Context
The initial contract is small. The team has no reference generator.
## Decision
Maintain the initial field reference beside the contract.
## Consequences
Every contract change requires a separate reference edit and review.

## Supersession notice (appended)
2026-10-20 — Current status: Superseded.
[ADR 005](005-generated-contract-reference.md) replaces this decision.
The original context, date and reasoning above are preserved.
```

Replacement, `docs/adr/005-generated-contract-reference.md`:

```markdown
# ADR 005: generate the factual contract reference
Date: 2026-10-20
Status: Accepted
Supersedes: [ADR 004](004-manual-field-reference.md)

## Context
New settings and response fields make two edited field lists easy to disagree.
## Decision
Generate the factual reference from the versioned contract.
## Reasoning
Keep names, types and defaults tied to one source.
## Consequences
We must run generation and inspect its result when the contract changes.
Explanations and examples still need human review.
## Alternatives
Keep editing the field list by hand, accepting the duplicate review work.
```

Preserve the historical decision text. Append a dated supersession notice to the
old record, link it to the replacement, and link back from the new one. The old
acceptance status is historical; the later notice makes its current status clear.
Update an existing decision index too. A new decision must not rewrite an earlier
choice to make the team look prescient. This extends the small-record approach in
[Nygard’s ADR guidance](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
with an explicit append-only notice for this playbook’s preservation convention.

### Keep architecture and contract references current

A small maintained view helps a new reader orient. State its scope, name the
components and external systems, label relationships, and identify an owner and
review trigger. Link decisions for the reasons behind a boundary. C4’s
[review checklist](https://c4model.com/diagrams/checklist) helps check readability.

Illustrative Workshop scope: one application and its booking store. No payment
or email service is implied by this view:

```text
Attendee -- books or cancels --> Workshop app -- reads/writes --> Booking store
```

The maintainer reviews this view when a boundary or dependency changes. Stage
[03](03-architecture.md) teaches how to design the architecture itself.

Reference describes exact facts a reader needs without inspecting every caller.
Show names, types, allowed values, defaults or absence behavior, the applicable
version and the authoritative source. A small table can be enough.

Illustrative Workshop reference for the same change:

| Name | Shape | Default or absence | Authoritative source |
| --- | --- | --- | --- |
| BOOKING_WINDOW_DAYS | integer 1–365 | 30 when unset | Versioned startup configuration validator |
| waitlistPosition | positive integer | omitted when not waitlisted | Versioned response contract |

These example values do not configure this playbook. For a real application,
check the actual validator and response behavior. Document whether omission,
null and an empty value mean different things; do not assume them equivalent.

Generation can keep the factual table aligned with its source. It does not
prove that the source is correct or that the explanations cover important
conditions. Generated API reference and a short explanation can complement
each other; a reader still needs the contract even when exhaustive hand-written
API documentation would add duplication.

### Write comments for non-obvious reasons

Implementation comments should explain constraints or intent that the reader
cannot recover from the code. A function or module’s documentation may also
describe purpose, use and behavior. Rename unclear code when a good name carries
the meaning. Google’s [review guidance](https://google.github.io/eng-practices/review/reviewer/looking-for.html#comments)
makes this distinction.

**Outside constraints.** Stripe documents a 500-character metadata value limit
and recommends storing larger data externally with an ID in metadata:

```ts
// Keep the larger record in our external store and put only its ID in
// metadata, whose value limit is 500 characters.
```

The [provider source](https://docs.stripe.com/metadata#data) supports that limit.
An application's retry alert threshold needs its own evidence and rationale;
an attempt count alone cannot establish the cause of a delivery failure.

The following are illustrative comment patterns, not runnable implementations:

**Deliberate deviations.**
```ts
// Preserve the entered title for display. Apply normalization only
// to the separate lookup key.
```

**Tricky logic.**
```ts
// This example's date interval includes both endpoints; account for
// that when converting it to a half-open range.
```

**Known limitations.**
```ts
// This illustrative export handles at most 1000 rows. Expose that cap
// to callers and revisit it before accepting larger exports.
```

### Update and verify documentation with the change

For each change, trace the authoritative fact to the documents that describe it.
When working alone, you are the owner; adding a team does not create ownership
for the first time. Give each living document a review trigger, such as a
changed command, configuration schema, contract or boundary.

| Change | Authoritative fact | Affected document | Check | Owner / review trigger |
| --- | --- | --- | --- | --- |
| Workshop adds BOOKING_WINDOW_DAYS | Startup validator and its unset/invalid behavior | Configuration reference, `.env.example`, setup guide | Compare the documented 1–365 range and default 30 with validation; test missing/invalid values | Maintainer / validator change |
| Workshop adds a response field | Response schema and serializer behavior | Generated reference and example response | Run generation; inspect the expected diff and verify optional-field omission | Contract owner / response change |
| A default or allowed value changes | Implementation and behavioral test | Existing reference and relevant how-to | Find old values and check the new behavior, not only matching strings | Maintainer / option change |
| A boundary or dependency changes | Current system and decision record | Architecture view, ADR and affected runbook | Trace the affected relationships and replacement links | Area owner / boundary change |
| Setup or release steps change | Actual commands, access and environment | README and linked procedures | Follow the documented path in a safe environment and record the result | Maintainer / procedure change |
| A known failure or release changes | Diagnosed behavior and release record | Troubleshooting, changelog or release notes as needed | Verify the check/workaround and publish only supported impact claims | Maintainer / confirmed fix or release |

`.env.example` lists configuration; a validator enforces accepted values only
if the application actually invokes it. Safe placeholders and harmless defaults
are useful examples. Real credentials are not. This static playbook requires no
environment variables; configuration artifacts here illustrate applications
that do need them.

Types check some shapes. Tests check the behavior their assertions cover.
Generated reference follows its input. Choose an explicit check for the claim
you need to trust. [Docs as code](https://www.writethedocs.org/guide/docs-as-code/)
puts documentation through version control, review and automation; it does not
make accuracy automatic. Stage [06](06-testing.md) owns test design.

### Choose what to omit or archive

Skip comments that restate obvious code and duplicated inventories nobody will
maintain. A short current architecture view and an exact field reference can
still earn their maintenance cost by answering a real question.

Preserve historical ADRs and release records as history, with discoverable
replacement or version context. Review current instructions separately: correct
them, redirect readers to their replacement, or retire obsolete procedures.
Archiving history is different from leaving a stale setup guide looking current.

### Commit messages preserve change context

A commit records the context of a particular change. Use a body when its reason,
constraint or rejected alternative will matter later; a clear subject can be
enough for a small self-explanatory change. Stage
[05](05-development.md#commits-and-branches) teaches the convention.

History preserves what was written, including mistakes and superseded intent.
Keep current instructions where readers expect to find them.

### AI in documentation

Give an assistant the source and version in scope: the relevant diff, contract,
code, verified procedure or approved notes. Use it to map affected documents,
draft a structure, expose contradictions, suggest lookup headings, or compare
examples with a schema. Ask it to label missing facts instead of completing them
from a plausible guess.

Have a named reviewer compare the draft with those sources. Use synthetic
identifiers and examples; remove real credentials, contact details and private
payloads before publication. Permissions, limits, defaults, provider behavior,
incident outcomes and release promises need a traceable source.

Distinguish the evidence levels:

| Action | What the evidence establishes |
| --- | --- |
| Read | Someone compared the instructions with an identified source |
| Compile | A specified example passed the stated compiler/type checks |
| Execute | A command or procedure ran in an identified environment with an observed result |

For an execution claim, record the command, revision, environment and observed
result. A successful isolated example does not establish production recovery;
state its limits. An assistant's claim that a fix was validated needs the same
evidence as anyone else's. Stage [14](14-post-deployment-verification.md) owns
production verification.

Docuwiz’s [template guidance](https://www.docuwiz.io/blog/blog-technical-documentation-templates)
also asks for grounded inputs and human review. Treat template text as structure:
check its sample infrastructure choices and validation claims before adopting it.

---

## Artifacts

- `README.md`: purpose, a working setup path and links to architecture/deployment/help.
- `docs/adr/NNN-title.md`: significant decisions, with discoverable replacement links.
- Configuration reference and `.env.example` when the application needs configuration.
- Current architecture or contract reference where the reader needs it.
- Comments for non-obvious constraints, reasoning and limits.
- Optional troubleshooting, conventions and release material justified by reader needs.

---

## Definition of done

For each change:

- [ ] Affected documentation is identified from the authoritative facts, including changed options and response contracts.
- [ ] Significant decisions have a record; historical decisions retain their reasoning and link to replacements.
- [ ] Current instructions, references and generated outputs match the intended revision and reviewed behavior.
- [ ] Required configuration is documented; any claimed enforcement is verified against actual validation.
- [ ] Examples use safe synthetic data and contain no real credentials or private customer details.
- [ ] Claimed validation names its command/check, revision, environment and observed result.
- [ ] The change owner reviewed the material; commit context explains a reason when one needs preserving.

Periodically:

- [ ] A fresh maintainer reaches the expected result from a fresh clone using the README.
- [ ] Each current document has an owner and a review trigger.
- [ ] Historical records are labeled and linked; obsolete current procedures are corrected, redirected or retired.

---

## Scaling to a team

- Let a new maintainer try setup without coaching; their first unresolved step becomes the fix list.
- Give each area an owner and a review trigger; review docs in the change that affects them.
- Add contributor conventions when contributors need them, including exceptions and review expectations.
- Keep decisions accessible to people who did not attend the discussion.
- Link operational runbooks and handover routes; stage [16](16-incident-management.md) owns incident response.

---

## Traps

**Writing documentation at the end.** Record the reason and evidence with the change.

**Applying a why-only rule to every document.** Setup instructions and exact reference facts answer legitimate reader needs.

**Making every template mandatory.** Choose artifacts for real readers and tasks; maintain the smallest set that works.

**Deleting historical decisions while cleaning current instructions.** Preserve the record and expose its replacement. Retire misleading current procedures separately.

**Treating generation as proof.** Inspect the source and the expected output diff; check behavior where the claim depends on behavior.

**Copying a template’s infrastructure or test claims.** Replace sample assertions with project facts and observed evidence.

**Publishing realistic private examples.** Use synthetic data and review the result before publication.

**Trusting a successful-looking draft.** Find the evidence behind each operational claim; record what remains unknown.
````

- [x] **Step 5: Run GREEN.** Repeat the Step 3 command, then run `pnpm lint` and `pnpm format:check`. Format the changed TypeScript tests with existing Prettier if needed, then rerun the targeted tests. Record raw output and the actual counts; do not predict a cumulative count in the report.
- [x] **Step 6: Review and commit.** Request an independent read-only review of the new chapter against the approved spec and this task. It must check all nine teaching sections, closing criteria, sources and the two review-focus fixtures. Resolve confirmed issues through RED/GREEN before committing. Commit only the chapter, two changed test files and execution report with `docs(documentation): teach document selection and evidence checks`.

### Task 2: Reconcile the shared ADR definition and generated glossary

**Files:**
- Modify: `web/src/lib/terms.test.ts`, `web/src/lib/terms.ts`, `reference/glossary.md`.
- Append: `docs/superpowers/reports/2026-10-20-stage-10-execution.md`.

**Interfaces:**
- Consumes: Task 1's historical decision text plus appended supersession notice.
- Produces: `getTerm('adr').full` accurately describes that meaning; `getTerm('adr').see` stays `03-architecture`; glossary stays generated by `renderGlossary()`.
- Existing imports in `terms.test.ts` already include `getTerm` and `expect`/`test`; add no new runtime dependency.

- [x] **Step 1: Append this failing semantic test to `web/src/lib/terms.test.ts`.**

```ts
test('ADR history stays intact while a linked supersession notice reveals the current decision', () => {
  const term = getTerm('adr')
  expect(term?.full).toContain('historical reasoning')
  expect(term?.full).toContain('new ADR')
  expect(term?.full).toContain('dated supersession notice')
  expect(term?.full).not.toContain('never edited afterward')
  expect(term?.see).toBe('03-architecture')
})
```

- [x] **Step 2: Run RED.** `pnpm exec vitest run src/lib/terms.test.ts -t 'ADR history stays intact'`. Expected: the old full definition fails the new semantic expectations, not an import failure. Record the raw output.
- [x] **Step 3: Change only `TERMS.adr.full` to this exact string.**

```ts
    full: 'A short record of one architecture decision, including context, choice and consequences. Preserve the historical reasoning; a changed decision gets a new ADR, with a dated supersession notice linking the old and new records.',
```

- [x] **Step 4: Regenerate and run GREEN.** Run `pnpm gen:glossary`, then `pnpm exec vitest run src/lib/terms.test.ts src/lib/glossary.test.ts src/lib/stage-10-structure.test.ts src/lib/stage-metadata.test.ts`. Inspect the generated diff: it should reflect only the ADR definition; never repair an unexpected diff by hand.
- [x] **Step 5: Review and commit.** Ask a fresh reviewer to compare the chapter's lifecycle, term definition, retained Stage 03 link and generator output. Record raw results and verdict. Commit these files plus the execution report as `fix(docs): distinguish ADR history from supersession metadata`.

### Task 3: Prove the guards and classify the example fences

**Files:**
- Append: `docs/superpowers/reports/2026-10-20-stage-10-execution.md`.
- Temporary mutations only: `docs/10-documentation.md`, `web/src/lib/terms.ts`.

**Interfaces:**
- Consumes: committed GREEN Tasks 1 and 2. Test names are the exact strings above.
- Produces: actual mutation diffs, raw failing output and restoration verification; a fence inventory with evidence type for every code block. No surviving mutation or new application file.

- [x] **Step 1: Check the baseline.** Record `git status --porcelain`; chapter, term and regression-test files must match committed HEAD. Enumerate any authorized evidence/checklist edits separately. Save the committed chapter/term bytes to task-specific temporary files. Run the targeted group from Task 2 Step 4 once. If it fails, resolve that before any mutation; do not mistake a baseline failure for teeth.
- [x] **Step 2: Test the research-only false pass.** In a temporary mutation, cut the whole `### Choose the document for the reader’s task` section out of `## The work` and append it after a new outside-fence `## Research findings for chapter review`. Leave its text intact. Confirm the diff. Run only `pnpm exec vitest run src/lib/stage-10-structure.test.ts -t '^reader needs choose a small useful set'`. Expected: that test fails for a missing active heading despite the original words still existing in the file. Restore saved chapter bytes and verify the diff disappears.
- [x] **Step 3: Reintroduce false enforcement.** Add the exact sentence `A configuration example means the app stops booting when it drifts.` within the update/verify section. Confirm the diff. Run only `pnpm exec vitest run src/lib/stage-10-structure.test.ts -t '^documentation checks include configuration'`. Expected: the negative assertion fails. Restore and verify the diff disappears.
- [x] **Step 4: Break only old-to-new discovery.** In the earlier ADR specimen, replace `[ADR 005](005-generated-contract-reference.md)` with plain `ADR 005`. Leave the new-to-old link intact. Confirm the diff. Run only `pnpm exec vitest run src/lib/stage-10-structure.test.ts -t '^replaced ADRs expose current status'`. Expected: that test fails on the missing replacement link. Restore and verify the diff disappears.
- [x] **Step 5: Reintroduce the old term.** Temporarily restore the old ADR full definition from `ac30cf7` in the term source only. Confirm the diff. Run only `pnpm exec vitest run src/lib/terms.test.ts -t '^ADR history stays intact'`. Expected: that semantic test fails. Do not regenerate the glossary during this mutation. The separate sync test would also fail if included; report the selected test boundary honestly. Restore and verify no term diff remains.
- [x] **Step 6: Inventory and check fences.** Record language and purpose for every fenced block in the corrected chapter. Markdown outlines/specimens and the text relationship view are illustrative, not executable instructions. Each TypeScript block is comment-only. From `web/`, use this check and preserve its output:

```bash
stage10_fence_dir=$(mktemp -d "${TMPDIR:-/tmp}/stage10-fences.XXXXXX")
export STAGE10_FENCE_DIR="$stage10_fence_dir"
python3 - <<'PY'
from pathlib import Path
import os, re
text = Path('../docs/10-documentation.md').read_text()
blocks = re.findall(r'^```ts\n(.*?)^```\s*$', text, re.M | re.S)
assert blocks, 'No TypeScript comment examples found'
for block in blocks:
    assert all(not line.strip() or line.lstrip().startswith('//')
               for line in block.splitlines()), 'Executable content needs a runtime check'
out = Path(os.environ['STAGE10_FENCE_DIR']) / 'comments.ts'
out.write_text('\n\n'.join(blocks))
print(f'Extracted {len(blocks)} comment-only TypeScript fences to {out}')
PY
pnpm exec tsc --noEmit --skipLibCheck --target ES2022 --types node "$stage10_fence_dir/comments.ts"
```

Expected: extraction reports only comment blocks and `tsc` exits 0. There is no
executable runtime path in these blocks; do not claim a runtime behavior test.
Any later fix that adds executable TypeScript must add literal and, where
appropriate, explicitly completed compilation plus an actual behavior check
under D-68.
- [x] **Step 7: Restore GREEN and review.** Rerun the targeted group. Verify chapter/term bytes match the saved committed bytes; only authorized evidence/checklist edits may remain. A read-only reviewer checks the mutation diffs, selected failures, restorations and fence claims. The appendix mutation can also trigger order/appendix-removal guards in a full-file run; record that scope rather than claiming only one full-suite test would fail. For the narrower enforcement/link mutations, run the full structure file too and record any additional failures. Commit the report as `docs(test): record stage 10 guard sensitivity and fence checks`; commit any checklist progress separately from source changes.

### Task 4: Rerun the held-out readers and close verified findings

**Files:**
- Create: `docs/superpowers/reports/2026-10-20-stage-10-correction-rerun.md`.
- Conditional: `docs/10-documentation.md`, `web/src/lib/stage-10-structure.test.ts`, or the glossary files if a verified finding concerns them.
- Append: `docs/superpowers/reports/2026-10-20-stage-10-execution.md`.

**Interfaces:**
- Consumes: GREEN chapter and exact baseline instruments in `docs/superpowers/reports/2026-10-20-stage-10-cold-reader.md`.
- Produces: same-scenario artifact attempt; frozen heading choices and classifications for the same five questions; accepted/rejected findings; independent recheck of any substantive correction wave.

- [x] **Step 1: Freeze the corrected input.** Record its commit/SHA-256. Create a temporary snapshot and a headings-only file using fence-aware heading extraction. The snapshot contains active teaching only; there should be no research appendix after Task 1. Do not include reports, plan, spec or source notes in either reader's inputs.
- [x] **Step 2: Dispatch the completeness reader.** Give a fresh reader the exact Toolshare scenario below and only the corrected snapshot. Require README, replacement ADR/old-record handling, configuration reference/comment and change-checklist attempts. The reader may judge with expertise but must label missing project facts, never silently fill them. Return gaps with severity, ID, heading evidence and successes. No browsing or file edits.

> Toolshare is a neighborhood tool-lending web app. Members reserve tools and volunteers record pickup and return. One maintainer built it; a second volunteer should be able to run it locally, understand the system boundary, and support a release without private instructions. A change replaces direct reminder-email sending with a durable queue after provider timeouts caused uncertain delivery. The old architectural decision to send directly remains in the repository. The same change adds REMINDER_QUEUE_URL, changes a documented retry option from 3 attempts to 5, and adds a new reminder-status response field. Toolshare wants the smallest useful documentation set and must not publish member contact details or real credentials. No framework, actual commands, URL, credentials, tests, deployment platform or measured incident outcomes are supplied.

- [x] **Step 3: Dispatch the consultability reader.** Give a fresh reader only the extracted headings first. Require it to report frozen selections before opening the snapshot; keep those selections after reading the body. Give these exact questions and classify HIT, PARTIAL, MISFILED or MISS, with observed heading evidence:

1. A second maintainer cannot run the app from a fresh clone. Where do I find what the setup guide must include and how to verify it?
2. We replaced an earlier architecture decision. What should I write now, and how does a reader discover that the old decision no longer applies?
3. A user needs the exact allowed values and defaults for a retry option. Should that live in a tutorial, reference page or explanation?
4. This change adds configuration and a response field. Which documents need updates, who owns them, and what checks detect drift?
5. An AI assistant drafted documentation claiming a fix was validated. What evidence must I check before publishing it?

- [x] **Step 4: Disprove as well as confirm findings.** Compare claims with the actual chapter. Distinguish missing scenario facts and other-stage boundaries from omissions/contradictions. Map accepted C1/C2/C3/X1/X2 and S1–S5 baseline findings to their corrected teaching. Keep C4's full commit-writing lesson deferred to Stage 05. Do not demand invented Toolshare commands or queue guarantees as a completion condition.
- [x] **Step 5: Fix confirmed defects through a new RED/GREEN slice.** A future finding cannot have prewritten prose now. For each accepted defect, record the requirement and a literal failing assertion scoped to its real teaching home before editing. Run and preserve RED, make the minimum correction, run GREEN and a mutation for the new guard. Request per-fix read-only review. If a finding changes approved scope, bring that decision to the user rather than calling it a small fix.
- [x] **Step 6: Recheck the fix wave.** Fresh readers reuse the same scenario/questions against the changed snapshot, still blind to intent documents. Report new findings separately and review the wave's own additions under D-48. Target five sufficient, directly discoverable answers; preserve actual partial/miss results until addressed or explicitly deferred by the user.
- [x] **Step 7: Commit evidence.** Save reader reports, per-finding dispositions and raw verification references. Verify all new guards pass and no mutation survives. Commit the report and any reviewed corrections as `docs(documentation): record the stage 10 correction recheck`, separating implementation fixes into their own conventional commits where they carry a distinct reason.

### Task 5: Verify the shared surfaces and prepare whole-branch review

**Files:**
- Append: `docs/superpowers/reports/2026-10-20-stage-10-execution.md`.
- Modify: `reference/stage-10-source-research.md`, `reference/cheatsheet-sources.md`, `docs/task.md`, `docs/tracker.md`, `KICKOFF.md`.
- Create: `docs/superpowers/reports/2026-10-20-stage-10-whole-branch-review.md`.

**Interfaces:**
- Consumes: reviewed Tasks 1–4, test/mutation evidence and source provenance.
- Produces: actual gate results and limitations, whole-branch verdict, current handoff and explicit deferred port/W-6 work. This task does not merge, push or deploy.

- [x] **Step 1: Run the checks in the verification section below.** Capture raw results in the execution report and actual counts, not planned numbers. Check the current worktree/server identity before trusting an existing process.
- [x] **Step 2: Update source use and records.** Retain source authors, original URLs, licenses and uncertainty. Mark which findings entered the chapter; preserve earlier dated research statements as history. Point task/tracker/handoff to the corrected chapter and evidence, with the interactive port still pending. W-3.17 stays open, W-3 remains 15/18 and W-6 remains 22/27 because their registries did not change.
- [x] **Step 3: Review the prose.** Apply `humanizer:humanizer` to the corrected chapter and new prose reports; keep precise technical conditions and literal terminal output. Use `writing-for-agents` when refreshing the handoff. Verify new/changed local destinations and source links; ignore example paths inside fenced specimen text as real files.
- [ ] **Step 4: Obtain final whole-branch review.** Commit the source-use and records updates from Steps 2–3 before review, so the reviewer gets a fixed, clean tip. Use an independent reviewer with develop `79f9e31` as the fixed base and that actual tip. Include research/source capture commit `e30c9a4`, not just implementation commits. Require checked acceptance criteria, evidence for findings, severity/ID/provenance and a Ready to merge / Ready with fixes verdict. The spec builder check does not cover this implementation.
- [ ] **Step 5: Address confirmed review findings.** Reproduce a real defect with RED before correcting it, rerun affected checks, and get the fix diff independently reviewed. Broaden gates only when the fix's scope or new evidence warrants it. Record deferred findings as the user's decision, never a silent author waiver.
- [ ] **Step 6: Close the records commit.** Record actual reviewed commit range, test/build/browser outcomes and remaining work. Commit final evidence separately as `docs(tracker): record stage 10 chapter verification`. Verify the chapter, `web/` and `reference/` match the reviewed implementation tip; if they changed, review/reverify that diff. Have the reviewer check the final records diff without calling it a new implementation. Follow `superpowers:finishing-a-development-branch`; ask before every merge and preserve the user's ownership of push/main promotion.

## Verification (after all tasks)

Run commands from `web/`, sequentially and with exit codes recorded:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:dev-console
```

Expected: each exits 0, tests report no failures, and browser audits show no
console, accessibility or responsive failures for their covered pages. The
production e2e config performs its own build on startup; that repetition is the
existing freshness gate, not a reason to silently skip it. Do not run production
and development checks concurrently against the same worktree's `.next` state.

Before browser checks, inspect listeners and identify the workspace behind any
server on 3100/3101/3200. Keep user-owned servers running. Prefer the isolated
worktree's fresh 3100 production and 3101 development processes. The current dev
config has `reuseExistingServer: false`. If its lock/port is busy, diagnose it;
do not silently change config, kill a user's process or substitute the production
console check. A temporary, explicitly documented alternate config is acceptable
only when it preserves the test suite and targets a verified server for this
worktree. Record exact command, URL, revision and limitation.

The ADR glossary text is rendered on existing pages. In addition to the normal
audit, inspect the ADR term popover on Stage 03 and its glossary entry at 320px
and a desktop width, in both themes. Confirm replacement wording is readable
and the Stage 03 link resolves. Identify the actual route/hash from the running
app or existing tests rather than assuming a glossary URL.

Also require:

- All accepted findings traced to teaching and targeted guards; no unsupported provider/validation claim remains in closing sections.
- Same Toolshare scenario and exact five questions rerun with fresh readers; any fix wave independently rechecked.
- Real mutation diffs, selected failing outputs and restored GREEN; no temporary changes in the committed tree.
- Generated glossary sync; stage readiness and reference counts unchanged; source captures retained with accurate provenance.
- New local links/anchors resolve, fenced specimens are not counted as navigation headings, and the parent checkout's original file hashes/state are preserved.
- Raw RED/GREEN and gate output is stored or linked by the execution report. A prose statement that a check passed is not its evidence.
- The final review covers the complete branch and reports the actual commit range. No main/develop integration happens without a fresh user approval.

`pnpm test:prod` checks the deployed site and is deliberately outside this
branch's evidence. A successful build/audit here makes no deployment claim.

## Plan coverage and self-review

| Approved requirement / finding | Owning task and evidence |
| --- | --- |
| Reader needs, minimum set, README lookup; X2/S1/S3 | 1: scoped selection/README tests and full chapter source; 4: same lookup questions |
| ADR lifecycle and history/current conflict; X1/S2 | 1: old/new specimens, reciprocal-link guard, closing historical/current guard; 3: link mutation; 4: artifact attempt |
| Contracts, defaults, configuration, ownership; C1/C2/S4 | 1: real reference table, update matrix and enforcement negative assertion; 3: false-enforcement mutation |
| Safe examples; C3 | 1: synthetic-data guidance and AI guard; 4: held-out publication constraints |
| Source-grounded AI evidence; S5/D-35 | 1: metadata RED, evidence-level table and scoped guard; 4: exact validation-claim question |
| Stripe claims and contextual ORM example | 1: verified metadata limit, removal of invented truncation/diagnosis and replacement of the ORM specimen; 5: source checks |
| Shared ADR glossary; D-47 | 2: semantic RED/GREEN, generator output and ready-stage link; 3: semantic mutation; 5: visible surface checks |
| Appendix/fenced-heading false positives | 1: two parser fixtures and active-only helper; 3: appendix mutation |
| Executable content and fix wave; D-68/D-48 | 3: printed-fence inventory/check; 4: new behavior checks if corrections introduce executable content |
| Independent reviews, evidence and deferred port | Each task's review; 5: full branch review, gate and records |

Self-review must recount task references and actual test declarations, check
fixture/extraction types and all source blocks, and compare the plan with the
approved spec. Source bodies are included to honor this repository's explicit
task-slice requirement; generated glossary output remains the generator's job.
Read an authoritative source after drafting as a separate check of the plan's
assumptions; record any correction without inventing a green implementation run.

## Execution handoff

Original handoff: this plan awaited user review and execution-method selection. The user subsequently authorized “proceed up to implementation”; execution is inline with independent reviews. Tasks 1–4 are complete; Task 5 verification passed; its final whole-branch review remains pending. See the [execution report](../reports/2026-10-20-stage-10-execution.md) for observed evidence and plan corrections.

- **Subagent-driven:** fresh implementer and reviewer per task, plus the whole-branch review.
- **Inline:** the main agent executes the sequential tasks, retaining independent per-task reviews, fresh cold readers and the final whole-branch review required here.

Recommended: **Inline**. There are two substantive editing tasks, their meaning
is tightly coupled, and the remaining three tasks verify that same teaching.
Independent reviews and cold readers still provide separate judgment without
handing the shared chapter between multiple implementers.
