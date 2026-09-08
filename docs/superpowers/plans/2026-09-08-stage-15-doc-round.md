# Stage 15 Observability Doc Round Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every confirmed defect in `docs/15-observability.md`, teach the four things its own Definition of done already demands, add the nine things it never mentions, and write the `### AI in observability` section — so the W-3.12 port works from a document that neither argues with itself nor describes a single hosting account.

**Architecture:** Sixteen tasks on `fix/stage-15-doc-round`. Task 1 builds both guards first, because eleven later tasks add or move a subsection and nothing else in the suite can see a dropped heading. Tasks 2–4 are the contradictions, which need no new teaching and are therefore the cheapest thing a reviewer can reject independently. Tasks 5–6 teach the artifacts the stage already requires. Tasks 7–9 add the missing sections. Task 10 is the AI section, whose RED is a real one — adding the slug to `AI_SECTION_STAGES` is how this repository has always opened a stage round. Tasks 11–13 are structural, glossary and cross-references. Tasks 14–16 re-run the instruments, absorb what they find, and close the records. **No app content code changes on this branch; `ready` stays `false`.**

**Tech Stack:** Markdown. `pnpm`, `vitest`, `node`, `git`, and a scratch TypeScript project for the D-50 execution passes. Doc content spans Vercel/Sentry and AWS/CloudWatch, matching `docs/13-production-deployment.md`.

**Spec:** `docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md` — the evidence every task cites, by ID. Read it before Task 2.

## Global Constraints

- **Branch:** `fix/stage-15-doc-round`, cut from `develop`. Never merge to `main`. **Ask before any merge, including into `develop`.**
- **Commit trailer**, every commit, both lines:
  ```
  Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01WxBUTDY6r5TURmDJRerjwB
  ```
- **Conventional Commits**, `type(scope): subject`, lowercase after the colon. Scopes here: `docs`, `observability`, `test`, `tracker`, `plan`.
- **D-42:** cite doc sections by heading, never by line number. This plan quotes headings for the same reason.
- **D-47:** a correction that changes a concept in `web/src/lib/terms.ts` is made there, then `pnpm gen:glossary`. **Never hand-edit `reference/glossary.md`.**
- **D-50:** executable content gets executed. Every TypeScript block this plan adds or edits is typechecked in the scratch harness before its task commits. Reading a block as code is **not** the same instruction as running it — that distinction cost this project two silent SQL defects.
- **D-54:** the cold reader validates a doc before the port. It ran on 2026-09-08 and produced the findings file. Task 14 re-runs it **with the same Loaf scenario**, because a fresh scenario produces an unrelated list and says nothing about whether anything was fixed.
- **Platform coverage is Vercel *and* AWS**, matching `docs/13-production-deployment.md` (`### AWS deployment strategies`, and its cost table) and stage 14's CloudWatch content. Every mechanism this round adds states the general principle first, then names the tool on each platform. The stage-transfer failure the cold reader found is exactly what this prevents: latency and traffic got a product name, saturation got a category, and only the category survived contact with a different stack.
- **`ready` stays `false`** for `15-observability` in `web/src/lib/stages.ts`. This branch does not port. Do not touch `stage-content.ts` or `step-ids.ts`.
- **Prettier skips markdown by design.** `pnpm format:check` is not a check on `docs/*.md`. Do not read a green format run as a check on anything this round writes.
- **THE FILE WINS.** Where this plan's quoted "current text" and the actual document disagree, **the document is right**. Say so in the task report rather than forcing the plan's version. Five of six tasks on two previous rounds found a brief that did not match the tree.
- **Sentry is not a dependency of this repository.** `web/package.json` has no `@sentry/*` package; the stage teaches Sentry, the site does not use it. So D-50's harness for this round is the scratch project in Task 0, not `web/`. Any claim about SDK behaviour — notably scope isolation, see the HELD finding in the findings file — is checked against the installed version there and cited in the task report, or it is not written.
- **AWS claims are checked, not remembered.** Use `context7` or the official docs for anything named (CloudWatch alarm behaviour on missing data, log group retention defaults, EventBridge Scheduler, Route 53 health checks). Cite what you checked in the task report. The same rule `web/AGENTS.md` applies to Next.js applies here for the same reason.
- **Prose latitude, stated deliberately.** This plan gives every **code block** and every **load-bearing sentence** verbatim, and states the **claims each task's test asserts**. Connective prose is the implementer's, within house voice. This is a considered deviation from "full implementation source inline": the deliverable here *is* prose, and a plan that contained all of it would be a second copy of the document that could drift from the first. What is pinned is what a test or a reviewer checks.
- **House voice.** Em dashes are house voice and are **not** stripped — fifteen existing specs run a median of 0.13 per line. `humanizer:humanizer` runs over new prose in Task 13; skip it for code blocks, tables and terminal output.
- **The stage's cadence is "Day one, then continuous."** Nothing this round writes may imply observability is a checkpoint that completes. That framing fights the playbook's central claim, and `stages.ts` already carries the cadence field that contradicts it.

---

## File structure

| File | Responsibility this round |
|---|---|
| `docs/15-observability.md` | The deliverable. Every task from 2 to 13 edits it. |
| `web/src/lib/stage-15-structure.test.ts` | **New.** Pins `## The work`'s subsection list in order, and the specific claims this round adds. The only thing that can see a dropped or silently reordered section. |
| `web/src/lib/stage-metadata.test.ts` | Two one-line edits: `11-ci-cd` (Task 1, closes a guard hole) and `15-observability` (Task 10, the AI section's RED). |
| `web/src/lib/terms.ts` | Task 12: a `percentile` entry, and whatever `error-budget` needs to be true of the doc it points at. |
| `reference/glossary.md` | **Generated.** `pnpm gen:glossary` only. |
| `docs/tracker.md`, `docs/task.md`, `KICKOFF.md` | Task 16. |

---

### Task 0: The D-50 harness

**Files:**
- Create: `<scratchpad>/doc-exec-15/` — not committed, nothing in scratch is.

**Interfaces:**
- Produces: a TypeScript project where every block this round writes can be typechecked. Tasks 5, 6, 7, 8 and 9 all depend on it.

The scratchpad for this session is
`/private/tmp/claude-501/-Users-angelito-personal-Development-Playbook/9a83b852-6f6f-43a9-97e6-3b590d05d0b7/scratchpad`.

- [ ] **Step 1: Create the harness**

```bash
mkdir -p "$SCRATCH/doc-exec-15" && cd "$SCRATCH/doc-exec-15"
pnpm init
pnpm add -D typescript @types/node
pnpm add @sentry/node pino
npx tsc --init --strict --module nodenext --moduleResolution nodenext --target es2022
```

- [ ] **Step 2: Record the resolved versions**

Run: `pnpm ls --depth 0`

Paste the output into the task report. Every later task that makes a claim about SDK behaviour cites this version. The findings file HELDs a claim about `Sentry.setUser` scope isolation precisely because it cannot be settled without one.

- [ ] **Step 3: Confirm a known-good block typechecks**

Copy the document's existing `src/lib/observability.ts` block into `doc-exec-15/observability.ts`, change the import to `@sentry/node`, and run `npx tsc --noEmit`.

Expected: PASS. If it fails, the harness is wrong, not the document — fix the harness before proceeding.

- [ ] **Step 4: No commit**

Nothing in scratch is committed. Record the path in the task report so later tasks reuse it.

---

### Task 1: The guards, written first

**Files:**
- Create: `web/src/lib/stage-15-structure.test.ts`
- Modify: `web/src/lib/stage-metadata.test.ts` (one line)
- Read first: `web/src/lib/stage-03-structure.test.ts` — this task's model

**Interfaces:**
- Produces: `stage-15-structure.test.ts` with an `EXPECTED` array of `## The work` subsection headings, in order. Tasks 7, 8, 9, 10 and 11 each add or move a heading and **must update `EXPECTED` in the same commit** — that is the mechanism that makes a reorder deliberate rather than silent.

Two guards, both written before the round edits a word of the document.

The second one closes a hole found while reading the test: `AI_SECTION_STAGES` lists ten slugs and **`11-ci-cd` is not among them**, although stage 11 shipped with an `### AI in CI/CD` section on 2026-09-07. The guard has been blind to a shipped stage. That addition passes on its first run, so it gets a teeth check rather than a RED.

- [ ] **Step 1: Read the model**

Run: `cat web/src/lib/stage-03-structure.test.ts`

Reuse its shape: the `theWork()` helper that slices `## The work` so an `###` added under `## Traps` fails its own check rather than this one with a misleading message.

- [ ] **Step 2: Write the structure test**

Create `web/src/lib/stage-15-structure.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// The stage 15 doc round (W-3.12) rewrites `## The work` from eight
// subsections to thirteen, and moves two pieces of content out of
// `## Definition of done` and `## Scaling to a team` into the body.
//
// Both moves are load-bearing. A cold reader asked five symptom-shaped
// lookup questions of the pre-round document and scored 2/5; two of the
// three failures were content filed where the audience will not look —
// baselines existed only as a DoD checkbox and a trap, and the verb for a
// noisy alert lived under a heading that tells a solo reader it is not for
// them.
//
// Nothing else in the suite can see a dropped or reordered section. The
// metadata tests check the H1 and the AI heading; the glossary test checks
// terms. Neither reads `## The work`.
const DOC = fileURLToPath(
  new URL('../../../docs/15-observability.md', import.meta.url),
)

const EXPECTED = [
  'Three things, in order of value',
  'Errors that are actually useful',
  'Structured logs',
  'The four signals',
  'Health checks',
  'Alerts you will not learn to ignore',
  'Uptime monitoring from outside',
  'Dashboards',
]

/**
 * Just the body of `## The work`, so an `###` added under `## Traps` fails
 * its own check rather than this one with a misleading message.
 */
function theWork(md: string): string {
  const start = md.indexOf('\n## The work')
  expect(start, 'docs/15-observability.md has no "## The work" section').not.toBe(-1)
  const rest = md.slice(start + 1)
  const next = rest.indexOf('\n## ', 1)
  return next === -1 ? rest : rest.slice(0, next)
}

test('stage 15 "The work" carries its subsections in order', () => {
  const md = readFileSync(DOC, 'utf8')
  const headings = [...theWork(md).matchAll(/^### (.+)$/gm)].map((m) => m[1].trim())
  expect(headings).toEqual(EXPECTED)
})
```

- [ ] **Step 3: Run it — it passes, which proves nothing yet**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS (1 test).

- [ ] **Step 4: Teeth check — fabricate the break**

Temporarily reorder two `###` headings in `docs/15-observability.md` (swap `### Health checks` and `### Dashboards`), re-run.

Expected: FAIL, naming both the expected and received arrays.

**Revert the document immediately.** Paste both runs into the task report. A guard whose teeth were never checked is one of the seven this repository has already shipped green and worthless.

- [ ] **Step 5: Close the `11-ci-cd` guard hole**

In `web/src/lib/stage-metadata.test.ts`, add `'11-ci-cd',` to `AI_SECTION_STAGES`, after `'07-code-review',` and before `'12-staging',` so the list stays in stage order.

Do **not** add `'15-observability'` here. That is Task 10's RED.

- [ ] **Step 6: Run, then teeth-check it too**

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts`
Expected: PASS, now with eleven cases instead of ten.

Then temporarily change `### AI in CI/CD` to `### Using AI in CI/CD` in `docs/11-ci-cd.md`, re-run, and confirm **only** the `11-ci-cd` case fails. Revert.

- [ ] **Step 7: Commit**

```bash
git add web/src/lib/stage-15-structure.test.ts web/src/lib/stage-metadata.test.ts
git commit -m "test(observability): guard stage 15's section order, and close the AI-section hole

The AI_SECTION_STAGES list is explicit rather than derived from \`ready\`,
deliberately — the comment says it is so the section lands with the doc
amendment at the start of a round. But 11-ci-cd was never added when stage
11 shipped, so the guard has been blind to a stage that has had an AI
section since 2026-09-07.

The structure test is the anchor for the rest of this round: eleven tasks
add or move a subsection, and nothing else in the suite reads \`## The
work\`. Teeth checked both ways — a fabricated reorder fails it, and
renaming stage 11's AI heading fails that case and only that case."
```

---

### Task 2: C1 — stop the reference implementation shipping the PII the checklist forbids

**Files:**
- Modify: `docs/15-observability.md` — `### Errors that are actually useful`, `### Structured logs`, `## Definition of done`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: the `theWork()` helper and `DOC` constant from Task 1.
- Produces: a `claims` test block in `stage-15-structure.test.ts` that later tasks append to. Use `test('...')` per claim, not one test with many assertions — a reviewer needs to see which claim broke.

Both cold readers found this independently. The document's own helper sends customer email to a third-party processor, and six sections later a checkbox forbids exactly that. A reader who follows the code cannot tick the box, and the reader who notices has no way to tell which half is wrong.

Resolve it in the code's favour being **wrong**, not the checklist's: an opaque user id resolves to a person in your own database, which you control and can delete. That is the teaching, and it is what makes the rule survivable rather than an instruction to log less.

- [ ] **Step 1: Write the failing tests**

Append to `web/src/lib/stage-15-structure.test.ts`:

```ts
/** The whole document, for claims that are not scoped to `## The work`. */
function doc(): string {
  return readFileSync(DOC, 'utf8')
}

// C1. The pre-round document defined `identifyUser` as
// `Sentry.setUser({ id: user.id, email: user.email })` and then required, in
// `## Definition of done`, "No secrets or personal data in error reports or
// logs". Customer email is personal data. Following the code made the
// checkbox unsatisfiable, and the document never said which half was wrong.
test('C1: the error-context example sends no email address', () => {
  const md = doc()
  const block = md.slice(md.indexOf('### Errors that are actually useful'))
  const example = block.slice(0, block.indexOf('### Structured logs'))
  expect(example, 'the Sentry user-context example still sends an email address').not.toMatch(
    /email/i,
  )
})

test('C1: the document says why an opaque id is enough', () => {
  expect(doc()).toMatch(/resolves? to a person in your own database/i)
})

// The two body rules were qualified — "full payment details", "full card
// numbers" — which permitted the partial payment data the DoD forbids
// outright. The qualifier is the defect: last four plus expiry is still
// personal data on someone else's infrastructure.
test('C1: the scrubbing rules are not qualified by "full"', () => {
  const md = doc()
  expect(md).not.toMatch(/full payment details/i)
  expect(md).not.toMatch(/full card numbers/i)
})
```

- [ ] **Step 2: Run them and watch all three fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`

Expected: three FAIL. The first for `email` matching inside the code block, the second because the phrase does not exist, the third on both `full payment details` and `full card numbers`.

Paste the raw output into the task report. "Failed for the right reason" here means the failure names the document's actual text, not a missing helper.

- [ ] **Step 3: Replace the code block**

In `### Errors that are actually useful`, replace the `identifyUser` function with:

```ts
// src/lib/observability.ts
import * as Sentry from '@sentry/nextjs'

export function identifyUser(user: { id: string }) {
  Sentry.setUser({ id: user.id })
}

export function addContext(key: string, data: Record<string, unknown>) {
  Sentry.setContext(key, data)
}
```

- [ ] **Step 4: Write the paragraph that makes the id enough**

Immediately after the block, before the existing "Attach the user to every authenticated request" paragraph, the document must carry the load-bearing sentence verbatim:

> An opaque id is enough, because it **resolves to a person in your own database** — which you control, can query, and can delete. An email address in an error report is the same fact stored a second time, on infrastructure you do not control, under a retention policy you did not set.

Then keep the existing "This error hit 400 users" contrast, which is the section's best sentence and is unaffected.

- [ ] **Step 5: Drop the qualifiers**

In `### Errors that are actually useful`, "Do not send secrets, passwords, tokens, or full payment details" becomes "Do not send secrets, passwords, tokens, or payment details."

In `### Structured logs`, "Never log: passwords, tokens, session IDs, full card numbers, or the contents of user documents" becomes "Never log: passwords, tokens, session IDs, card numbers, or the contents of user documents."

Add one sentence after the second, since deleting a word is not teaching:

> The last four digits and an expiry date are still personal data, and "it is only partial" is not a retention policy.

- [ ] **Step 6: Cross-reference stage 08 for what happens next**

Add to `## Definition of done`, directly under the existing "No secrets or personal data" checkbox:

```markdown
- [ ] You know how to delete a person's data from your error tracker and your
      logs, and have checked the retention window on both
      ([08](08-security-audit.md))
```

This is the BOUNDARY call recorded in the findings file: retention and deletion belong to stage 08, and a cross-reference is the fix, not a section.

- [ ] **Step 7: Run the tests**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 4 tests (the structure test plus the three claims).

- [ ] **Step 8: Typecheck the changed block (D-50)**

Copy the new `identifyUser`/`addContext` block into the Task 0 harness, change the import to `@sentry/node`, and run `npx tsc --noEmit`.
Expected: PASS. Record the Sentry version in the report.

- [ ] **Step 9: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): stop the reference implementation shipping PII

The doc's own identifyUser sent customer email to Sentry, and its Definition
of done required no personal data in error reports. Following the code made
the checkbox unsatisfiable. Both cold readers found this independently.

Resolved in the checklist's favour: an opaque id resolves to a person in a
database you control and can delete. Also drops the 'full' qualifier from
both scrubbing rules, which had permitted the partial payment data the DoD
forbids outright, and points at stage 08 for the deletion question."
```

---

### Task 3: C2 and C3 — the alerting section stops contradicting itself

**Files:**
- Modify: `docs/15-observability.md` — `### Alerts you will not learn to ignore`, `## Traps`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `doc()` from Task 2.

Two contradictions inside the section the document says matters most, both in adjacent lists.

**C2:** "Worth alerting on: a **new** error type in production" against "Not worth alerting on: any single error". A new error type on first occurrence *is* a single error.

**C3:** the section bolds "Alert on symptoms, not causes" and argues CPU at 80% is not actionable, then lists "Database connections near the limit" — the same species of number. The fix is the distinction the document is missing, **not** deleting the bullet. A connection pool has a hard ceiling and does not recover on its own; a CPU percentage has neither property. That is a real difference and it is teachable in two sentences.

- [ ] **Step 1: Write the failing tests**

Append to `web/src/lib/stage-15-structure.test.ts`:

```ts
/** The body of one `###` subsection, by heading. */
function section(heading: string): string {
  const md = doc()
  const start = md.indexOf(`### ${heading}`)
  expect(start, `docs/15-observability.md has no "### ${heading}"`).not.toBe(-1)
  const rest = md.slice(start)
  const next = rest.indexOf('\n### ', 1)
  const capped = next === -1 ? rest : rest.slice(0, next)
  const upper = capped.indexOf('\n## ', 1)
  return upper === -1 ? capped : capped.slice(0, upper)
}

// C2. "A new error type in production" sat in the worth-alerting list and
// "Any single error" in the not-worth list, two bullets apart. A new error
// type on first occurrence is a single error, so the reader was told both to
// page and not to page on the same event.
test('C2: the not-worth-alerting list no longer forbids what the list above requires', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).not.toMatch(/^- Any single error$/m)
  expect(alerts).toMatch(/signature you have never seen/i)
})

// C3. The section bolds "Alert on symptoms, not causes" and then alerts on a
// database connection count. The distinction it was missing: a resource with
// a hard ceiling that does not recover on its own is worth alerting on before
// it becomes a symptom, because crossing it is a cliff rather than a slope.
test('C3: the symptoms-not-causes rule states its exception', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/hard ceiling/i)
  expect(alerts).toMatch(/does not recover on its own/i)
})
```

- [ ] **Step 2: Run and watch both fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'C2\|C3'`
Expected: two FAIL — C2 on the `signature` match, C3 on `hard ceiling`.

- [ ] **Step 3: Fix C2**

In the worth-alerting list, replace "A *new* error type in production" with:

```markdown
- A **new** error signature — an exception you have never seen before. This is
  the one exception to the rule below, and it earns it: a novel error after a
  deploy is the highest-information event your system produces.
```

In the not-worth list, replace "Any single error" with:

```markdown
- A single occurrence of an error signature you have seen before
```

- [ ] **Step 4: Fix C3**

After the bolded "**Alert on symptoms, not causes.**" paragraph, add:

> One exception, and it is the reason "database connections near the limit" is
> in the list above: a resource with a **hard ceiling** that **does not recover
> on its own** — a connection pool, a disk, an API quota — is worth alerting on
> *before* it becomes a symptom, because crossing it is a cliff rather than a
> slope. By the time users feel a full connection pool, every request is
> failing. CPU has neither property: it is elastic, it self-resolves, and 80%
> with everything working is fine.

- [ ] **Step 5: Keep Traps honest**

`## Traps` states "**Alerting on causes, not symptoms.** High CPU is not a problem." That remains true and stays. Do **not** duplicate the new exception into Traps — S2 in the findings file records that Traps already repeats the body nine times out of ten, and this round does not widen that.

- [ ] **Step 6: Run**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 7: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): resolve both contradictions in the alerting section

'A new error type' was in the worth-alerting list and 'any single error' in
the not-worth list, two bullets apart. And the section bolded 'alert on
symptoms, not causes' while listing a database connection count.

The second fix is the missing distinction rather than a deletion: a resource
with a hard ceiling that does not recover on its own is worth alerting on
before it becomes a symptom, because crossing it is a cliff. CPU is neither."
```

---

### Task 4: C4, C5 and C6 — the four signals stop being three, and get sources that can produce them

**Files:**
- Modify: `docs/15-observability.md` — `### The four signals`, `### Dashboards`, `### Alerts you will not learn to ignore`, `## Artifacts`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `section()` and `doc()` from Tasks 2–3.

Three findings, one root cause: the signal-to-tool mapping was written for one hosting account and never re-read against its own requirements.

**C4:** `## Artifacts` requires "one dashboard with the four signals and deploy markers"; `### Dashboards` lists rpm, error rate, p95 and deploys. Saturation was silently replaced by the markers.

**C5:** errors are defined as a *ratio* and sourced from Sentry, which is sampled, `beforeSend`-filtered, and has no request denominator. The metric the document insists on is the one its own toolchain cannot produce.

**C6:** traffic drop is called "one of the clearest possible signals that something is badly broken" and then omitted from the alert list.

This task also fixes the transfer failure underneath all three. The cold reader's sharpest observation: latency and traffic got a product name, saturation got a category, **and only the category survived contact with a different stack.** So every signal here states the category first and the products second.

- [ ] **Step 1: Verify the Vercel surface before writing it**

The current text says "Vercel Analytics covers latency and traffic." Vercel Analytics is a page-analytics product; a headless API has no pages. Check the current product names and what each actually measures — client-side RUM versus server function duration are different numbers, and a reader alerting on "p95 latency doubling" needs to know which one they are watching.

Use `context7` or Vercel's own docs. **Cite what you checked in the task report.** Do not write a product name from memory.

- [ ] **Step 2: Write the failing tests**

```ts
// C4. `## Artifacts` required "the four signals" on one dashboard; the
// Dashboards section listed three of them plus deploy markers. Saturation —
// the signal most likely to be the actual incident on a small deployment —
// was the one dropped.
test('C4: the dashboard carries all four signals', () => {
  const dash = section('Dashboards')
  expect(dash).toMatch(/saturation/i)
})

// C5. Errors were defined as a rate ("fifty errors means nothing without a
// denominator") and sourced from Sentry, which is sampled, beforeSend-filtered
// and has no request denominator. The numerator and the denominator lived in
// different products and the doc never said how to divide them.
test('C5: the error-rate source can produce a denominator', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/denominator/i)
  expect(signals).toMatch(/counts every request/i)
})

// C6. The doc calls a traffic drop "one of the clearest possible signals that
// something is badly broken" and then left it out of the alert list.
test('C6: a traffic collapse is in the alert list', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/traffic (dropping|collapsing|falling)|requests? (per minute )?(dropping|falling) to/i)
})

// The transfer failure underneath all three: every signal states its category
// before it names a product, so a reader on neither platform still knows what
// to look for.
test('the four signals each name a category before a product', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/CloudWatch/i)
  expect(signals).not.toMatch(/Vercel Analytics covers latency and traffic/)
})
```

- [ ] **Step 3: Run and watch four fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'C4\|C5\|C6\|category'`
Expected: four FAIL.

- [ ] **Step 4: Rewrite the signal-to-source mapping**

Replace the "Vercel Analytics covers latency and traffic. Sentry covers errors. Your database dashboard covers saturation. You do not need a unified platform to start." paragraph with a table. Keep the last sentence — it is right, and Task 11 will reconcile it with the one-dashboard requirement.

The table's job is that every row is a *category* first:

```markdown
| Signal | Where it comes from | Vercel | AWS |
|---|---|---|---|
| Latency | The HTTP layer in front of your app, which already times every request | Function logs and observability | ALB or API Gateway CloudWatch metrics |
| Traffic | The same layer — it counts every request, which is also your denominator | Function logs and observability | The same CloudWatch metrics |
| Errors | Two different questions: *what broke* and *how often*. Sentry answers the first; the request-counting layer answers the second | Sentry, over function logs | Sentry, over ALB 5XX and request count |
| Saturation | Whatever owns the resource with the ceiling | Your database dashboard, function concurrency | CloudWatch per-service metrics, RDS connections |
```

Then the load-bearing sentence for C5, verbatim:

> Error *rate* does not come from your error tracker. Sentry tells you what
> broke and how many times it was reported; it is sampled, it is filtered by
> `beforeSend`, and it never sees a request that succeeded. The denominator
> comes from the layer that **counts every request**. Take the numerator from
> one and the denominator from the other, or you are computing a percentage of
> a number you do not have.

- [ ] **Step 5: Add saturation to the dashboard**

`### Dashboards` gains a fifth bullet, and its intro keeps the one-screen rule:

```markdown
- Requests per minute
- Error rate
- p95 latency
- Saturation of whatever is closest to its ceiling — usually database connections
- Recent deploys, marked on the timeline
```

Add one sentence, because a fifth widget on a one-screen dashboard needs a defence:

> Saturation is the one people drop, and it is the one most likely to be the
> actual incident on a small deployment: a connection pool exhausted by a batch
> job running alongside daytime traffic.

- [ ] **Step 6: Add the traffic alert**

To the worth-alerting list:

```markdown
- Traffic falling to near zero outside a pattern you recognise — the fastest
  signal that something upstream of your application is broken
```

- [ ] **Step 7: Run**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 10 tests.

- [ ] **Step 8: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): give the four signals sources that can produce them

Three findings with one root cause. Artifacts demanded a four-signal
dashboard and the Dashboards section listed three, having replaced
saturation with deploy markers. Errors were defined as a ratio and sourced
from Sentry, which has no request denominator. And a traffic drop was called
the clearest possible signal, then left out of the alert list.

The mapping is now a table where every row names a category before a
product, on both platforms. The cold reader's finding was that latency and
traffic got a product name, saturation got a category, and only the category
survived contact with a different stack."
```

---

### Task 5: A1 and A2 — teach `beforeSend`, and define `logger`

**Files:**
- Modify: `docs/15-observability.md` — `### Errors that are actually useful`, `### Structured logs`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `section()`, `doc()`.
- Produces: the `logger` construction block. **Task 8 extends this same block** with the correlation-id field; do not add `requestId` here, or Task 8's RED disappears.

The two most-cited omissions in the findings file, and both are of the same kind: named in `## Artifacts`, named in `## Definition of done`, never shown. `beforeSend` is the document's only defence against the risk it raises in bold, and it is a bare API name. `logger` is the identifier the document's best teaching device depends on, and it has no import, no library, no transport.

A2 is the one to fix first if this task is ever split: a reader who copies the good example gets `logger is not defined` and goes back to `console.log`, which is precisely what the block argues against.

- [ ] **Step 1: Write the failing tests**

```ts
// A1. "Configure beforeSend to scrub aggressively" was the doc's only defence
// against the risk it raises in bold, and it was a bare API name — no field
// list, no note that Sentry captures request headers and bodies by default.
test('A1: beforeSend is shown, not just named', () => {
  const errors = section('Errors that are actually useful')
  expect(errors).toMatch(/beforeSend\s*\(/)
  expect(errors).toMatch(/authorization/i)
  expect(errors).toMatch(/connection string/i)
})

// A2. `logger` appeared exactly once, in the "Good" half of the document's
// strongest teaching device, with no import and no library named. It is the
// only code in the document that could not be fixed by adding a plausible
// import, because the reader was not told which package.
test('A2: logger is constructed before it is used', () => {
  const logs = section('Structured logs')
  const construction = logs.indexOf('src/lib/logger.ts')
  const use = logs.indexOf('logger.error(')
  expect(construction, 'no logger construction block').toBeGreaterThan(-1)
  expect(construction).toBeLessThan(use)
})

// The doc logged a declined card at `error`, which inflates the error rate it
// tells you to alert on. It showed no other level anywhere.
test('A2: the document states a level policy', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/\bwarn\b/)
  expect(logs).toMatch(/expected outcome|routine business|not a fault/i)
})
```

- [ ] **Step 2: Run and watch all three fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'A1\|A2'`
Expected: three FAIL.

- [ ] **Step 3: Write the `beforeSend` block**

Add to `### Errors that are actually useful`, replacing the bare "Configure `beforeSend` to scrub aggressively" sentence with the sentence plus this block:

```ts
// src/lib/observability.ts
const SECRETS = [
  /postgres(?:ql)?:\/\/\S+/gi, // connection strings carry the password inline
  /\bsk_live_[A-Za-z0-9]+/g, // provider secret keys
  /\bBearer\s+[A-Za-z0-9._-]+/gi,
]

function redact(text: string): string {
  return SECRETS.reduce((acc, pattern) => acc.replace(pattern, '[redacted]'), text)
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  beforeSend(event) {
    // Sentry captures request headers by default, and that is where
    // credentials live.
    for (const header of ['authorization', 'cookie', 'x-api-key']) {
      delete event.request?.headers?.[header]
    }

    // It captures bodies too. A form post carries whatever the form carried.
    if (event.request) delete event.request.data

    // And an exception message is free text: a failed query prints the
    // connection string, password included.
    for (const value of event.exception?.values ?? []) {
      if (value.value) value.value = redact(value.value)
    }

    return event
  },
})
```

Then the sentence that makes it a rule rather than a snippet:

> Scrubbing is a deny-list, and a deny-list is only as current as the last time
> you read it. The thing that actually protects you is sending less: an id
> instead of an email, a reason code instead of a payload.

- [ ] **Step 4: Write the logger block**

At the top of `### Structured logs`, **before** the bad/good contrast, so the identifier exists before it is used:

```ts
// src/lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: process.env.SERVICE_NAME ?? 'web',
    env: process.env.NODE_ENV,
  },
})
```

Followed by:

> `pino` writes one JSON object per line to stdout, which is what every
> platform in this playbook already collects. Any library that does that will
> do; what matters is that the output is a line of JSON and not a sentence.

Keep the bad/good contrast exactly as it is otherwise — it is the strongest
teaching device in the stage and this round does not rewrite it.

One exception, and it is small: the example event is `invoice.payment_failed`,
which is `noun.noun_verb` and does not follow the `noun.verb_past_tense` rule
the document states eight lines below it. The rule is the more useful half, and
the section's own argument is that "consistency is what makes the log
searchable a year later" — so the example is the thing to change, not the rule.
Use `invoice.payment_declined`, and keep every other field as it is.

Two consequences to carry: the event name appears again in the M2 section
written in Task 7, and in the `payment or auth failures spiking` alert. Grep
for `payment_failed` across the document before committing.

- [ ] **Step 5: Fix the level, and state the policy**

The good example logs a declined card at `error`. A declined card is an
expected outcome of taking payments, and logging it at `error` inflates the
error rate the stage tells you to alert on. Change the call to `logger.warn`
and add:

> **Levels are a filter, not a mood.** `error` means *a fault you would
> investigate* — it is the level your alerting reads, so anything routine that
> lands there is a false page waiting to happen. A declined card is a routine
> business outcome and not a fault: it is `warn`. Reserve `error` for the
> things that should not have happened, and `info` for the events you want to
> count later.

- [ ] **Step 6: Typecheck both blocks (D-50)**

Copy both into the Task 0 harness. The `beforeSend` block needs the `Sentry.init` call and the two helpers; the logger block needs `pino`.

Run: `npx tsc --noEmit`
Expected: PASS.

**If `delete event.request?.headers?.[header]` does not typecheck on the installed version, the document is wrong, not the harness** — rewrite the block until it compiles, and report what changed. This is the step that exists because reading a block as code and running it are different instructions.

- [ ] **Step 7: Run the tests**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 13 tests.

- [ ] **Step 8: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): show beforeSend, and define the logger

Both were named in Artifacts and in the Definition of done and never shown.
beforeSend was the doc's only defence against the risk it raises in bold, as
a bare API name. And \`logger\` appeared once, in the good half of the best
teaching device in the stage, with no import — the one block a reader could
not fix by guessing a package.

Also drops the declined-card log from error to warn and states the level
policy. Logging an expected business outcome at error inflates the error
rate the stage tells you to alert on."
```

---

### Task 6: A3 and A4 — deploy markers get a mechanism, and uptime monitoring gets a target it can hit

**Files:**
- Modify: `docs/15-observability.md` — `### Dashboards`, `### Uptime monitoring from outside`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `section()`.

**A3:** "Dashboard shows deploy markers" is a DoD checkbox and the document never says how a marker gets onto a graph, on any stack. It is free and automatic on Vercel and deliberate work everywhere else, so the document reads as though it costs nothing — because on the stack it was written for, it does.

**A4:** "Monitor a real user path too" assumes a homepage. An authenticated API has none, and its real user paths mutate data and charge cards. This is an `## Artifacts` entry and a DoD checkbox whose only worked example does not apply to a large share of readers.

- [ ] **Step 1: Write the failing tests**

```ts
// A3. "Dashboard shows deploy markers" was a DoD checkbox with no mechanism
// given for any stack — free and automatic on Vercel, deliberate work
// everywhere else, and the doc read as though it cost nothing.
test('A3: deploy markers have a mechanism', () => {
  const dash = section('Dashboards')
  expect(dash).toMatch(/release|annotation/i)
  expect(dash).toMatch(/deploy step|CI|workflow/i)
})

// A4. The only worked example for "monitor a real user path" was a homepage.
// An authenticated API has none, and its real paths mutate data and charge
// cards — a monitor hitting one every sixty seconds is a load test against
// your own payment provider.
test('A4: monitoring an authenticated API is covered', () => {
  const uptime = section('Uptime monitoring from outside')
  expect(uptime).toMatch(/canary/i)
  expect(uptime).toMatch(/writes nothing|read-only|without writing/i)
})

test('A4: certificate expiry has a countermeasure, not just a trap', () => {
  const uptime = section('Uptime monitoring from outside')
  expect(uptime).toMatch(/certificate/i)
})
```

The third assertion closes M7: `## Traps` names certificate expiry as something internal monitoring will not catch, and no section ever says to switch the check on.

- [ ] **Step 2: Run and watch three fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'A3\|A4'`
Expected: three FAIL.

- [ ] **Step 3: Give deploy markers a mechanism**

After the existing "That last item is disproportionately useful" paragraph — which is right and stays — add the general principle and then both platforms:

> A deploy marker is not a feature of your dashboard. It is an **event with a
> timestamp**, emitted by whatever performs the deploy, that the dashboard
> knows how to draw. Which means the work is in your deploy step, not your
> dashboard.

```bash
# In the deploy job, after the deploy succeeds.
# Sentry: create the release and associate the commits.
sentry-cli releases new "$GITHUB_SHA"
sentry-cli releases set-commits "$GITHUB_SHA" --auto
sentry-cli releases finalize "$GITHUB_SHA"
```

Then the platform note:

> On **Vercel**, the Sentry integration creates releases for you, which is why
> this looks free — it is being done on your behalf. On **AWS**, nothing emits
> the event unless you do: add the step above to the deploy workflow, and for a
> CloudWatch dashboard, `aws cloudwatch put-dashboard` with an annotation, or a
> Grafana annotation if you are drawing the graphs there. Check the current
> flags before copying: `sentry-cli` and the CloudWatch dashboard schema both
> move.

- [ ] **Step 4: Rewrite the uptime target**

Keep "do not point uptime monitoring only at `/api/health`" — it is correct and it is the sentence that hands off from `### Health checks`. Replace the homepage assumption with:

> "A real user path" means a request that exercises the same machinery a user's
> would. If you have a page, monitor the page. If you are an API behind
> authentication, you need a **canary endpoint**: one route, authenticated with
> a token issued to the monitor and nothing else, that reads far enough down
> the real path to prove it works and **writes nothing**.
>
> The temptation is to have the monitor place an order every minute, because
> that is the real path. Do not: you will charge cards, fill tables, and page
> yourself when your payment provider is fine and your test data is not.
> Read the last order back instead of creating one.

```ts
// src/app/api/canary/route.ts — reads the real path, writes nothing
export async function GET(request: Request) {
  if (request.headers.get('x-monitor-token') !== process.env.MONITOR_TOKEN) {
    return new Response('not found', { status: 404 })
  }

  const latest = await db.query.orders.findFirst({
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  })

  return Response.json({ ok: latest !== undefined })
}
```

> Returning `404` rather than `401` for a bad token keeps the endpoint out of
> anyone's crawl results.

- [ ] **Step 5: Close M7 in the same section**

Add, after the "Better Stack or similar" sentence:

> Turn on **certificate expiry** checking while you are there. It is a separate
> toggle from the HTTP check on every service that offers it, it is the one
> failure in this section that arrives on a schedule you could have read months
> in advance, and the default notice period is usually shorter than the time
> you will need.

- [ ] **Step 6: Typecheck the canary route (D-50)**

The route imports `db`, which the document does not define — that is deliberate and consistent with `### Health checks`, where `db` and `sql` are also scenery (Global Constraints: a block produces the symbol its section teaches and may import scenery). In the harness, stub `db` with a typed local and confirm the handler compiles.

Expected: PASS.

- [ ] **Step 7: Run the tests**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 16 tests.

- [ ] **Step 8: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): give deploy markers a mechanism and uptime a real target

Both were Definition-of-done checkboxes with no method. A deploy marker is
an event emitted by the deploy step, not a dashboard feature — it only
looked free because the Vercel integration was doing it on the reader's
behalf. And 'monitor a real user path' assumed a homepage, which an
authenticated API does not have; the answer is a read-only canary, not a
monitor that places an order every sixty seconds.

Also switches on certificate expiry checking, which Traps named as a failure
mode with no countermeasure anywhere in the document."
```

---

### Task 7: M2 and M1 — the two sections about silence

**Files:**
- Modify: `docs/15-observability.md` — two new `###` subsections in `## The work`, after `### Uptime monitoring from outside`
- Modify: `web/src/lib/stage-15-structure.test.ts` — `EXPECTED` grows by two
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `section()`, `EXPECTED` from Task 1.
- Produces: two headings later tasks must not reorder — `When nothing is reporting` and `Jobs that nobody watches`, in that order. The general case precedes its sharpest instance.

The headline finding, and the one the whole round is worth doing for. **Every mechanism in this stage fires when something happens; none of them fires when something stops.** M2 was the only one of five lookup questions with no answer anywhere in the document, and M1 is the case where the gap is most expensive.

The material for M2 is on the page twice already and never named: `### Health checks` contains `catch { /* stays false */ }`, an exception deliberately discarded, in a document about not missing exceptions. And `### Structured logs` logs `invoice.payment_failed`, a business failure that throws nothing.

- [ ] **Step 1: Write the failing tests**

```ts
// M2. The only lookup question with no answer anywhere: "a user reports
// checkout failed but the error tracker shows nothing". The material was on
// the page twice — a swallowed catch in the health-check example and a
// business failure in the logging example — and the lesson was never drawn.
test('M2: the document names the failures that raise no exception', () => {
  const silence = section('When nothing is reporting')
  expect(silence).toMatch(/swallow|caught and discarded/i)
  expect(silence).toMatch(/200/)
  expect(silence).toMatch(/absence/i)
})

// M1. A scheduled job that never runs produces no errors, no logs and no
// requests, so every mechanism in this stage reports healthy. The doc
// mentioned background jobs twice, both times assuming the job ran and failed.
test('M1: a job that never ran is detectable', () => {
  const jobs = section('Jobs that nobody watches')
  expect(jobs).toMatch(/heartbeat|dead man/i)
  expect(jobs).toMatch(/finally/)
  expect(jobs).toMatch(/CloudWatch/)
})

test('the two silence sections sit after uptime monitoring', () => {
  const md = doc()
  expect(md.indexOf('### Uptime monitoring from outside')).toBeLessThan(
    md.indexOf('### When nothing is reporting'),
  )
  expect(md.indexOf('### When nothing is reporting')).toBeLessThan(
    md.indexOf('### Jobs that nobody watches'),
  )
})
```

- [ ] **Step 2: Update `EXPECTED` and run**

Insert `'When nothing is reporting'` and `'Jobs that nobody watches'` into `EXPECTED` after `'Uptime monitoring from outside'`.

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`

Expected: FAIL — four failures. The structure test now expects two headings the document does not have, and the three new claim tests fail on `section()` not finding their headings. **This is the right failure**: the guard from Task 1 is doing its job, and the claims fail for absence rather than for a broken helper.

- [ ] **Step 3: Write `### When nothing is reporting`**

The load-bearing opening, verbatim:

> Everything above fires when something happens. Nothing above fires when
> something **stops**, and a system that has gone quiet looks exactly like a
> system that is fine.

Then the list of ways a real failure produces no error, each with the mechanism:

```markdown
- **An exception that was caught and discarded.** The health check earlier in
  this stage does it deliberately: `catch { /* stays false */ }`. The
  dependency is down, the endpoint knows, and the reason is gone forever.
- **A failure that is a normal response.** `invoice.payment_declined` — the
  logging example above, renamed in Task 5 to follow the document's own event
  naming rule — is a business failure that throws nothing. So is every handled
  `4xx`.
- **A third party returning `200` with a failure inside it.** Your HTTP client
  is satisfied. Your integration is not.
- **A failure on the client.** It never reached your server, so your server has
  nothing to say about it.
- **An event your own configuration dropped** — sampling, a quota, or the
  `beforeSend` you just wrote.
```

Then the move that fixes it, which is the section's actual teaching:

> The fix is not more error tracking. It is to **count the outcomes you care
> about, not just the exceptions** — you already are, if you took the
> structured-logging section seriously. Once `order.created` is a counted
> event, its *absence* is measurable, and "no orders in ninety minutes on a
> Tuesday afternoon" is an alert you can actually write. An exception count
> falling to zero tells you nothing; a business event falling to zero tells you
> almost everything.

Close with the rule, which is also the answer to the lookup question:

> **Absence of a signal is not evidence of health.** When someone reports a
> failure your tools did not see, that gap is the finding — not the report.

- [ ] **Step 4: Write `### Jobs that nobody watches`**

> A scheduled job that fails is easy: it throws, and everything above catches
> it. A scheduled job that **never ran** produces no exception, no log line and
> no request. Every mechanism in this stage reports that the system is healthy,
> and it is — the job is simply not part of it any more.

The mechanism, inverted from everything else in the stage:

> The instrument is a **heartbeat**, sometimes called a dead man's switch, and
> it is the only monitor here that alerts on silence: the job calls a URL when
> it finishes successfully, and the monitor pages you when the call does not
> arrive inside the window you set.

```ts
// At the end of the job — after the work, on the success path only.
await fetch(process.env.HEARTBEAT_URL!, { method: 'POST' })
```

And the sentence that is the whole point of showing the code:

> Not in a `finally`. A ping in a `finally` block reports success for a run
> that threw, which converts your only detector of silence into a source of
> false confidence.

Platforms, and the general principle first:

> Any monitor that can page you on a *missing* check will do — Better Stack,
> Healthchecks.io and Cronitor all offer this as a heartbeat URL. On **AWS**,
> the equivalent is a CloudWatch alarm over a custom metric the job emits, with
> missing data treated as breaching rather than the default; check the current
> behaviour of `TreatMissingData` before relying on it, because the default is
> the opposite of what you want here.

Two more failure modes in the same family, since the section is open:

```markdown
- **A job that is slower every night.** Alert on duration as well as absence; a
  reconciliation that has gone from four minutes to forty is on its way to
  overrunning its window.
- **A job that overlaps itself.** Two copies of a reconciliation running
  concurrently is a different bug from either of them failing, and neither an
  error rate nor a heartbeat will show it.
```

- [ ] **Step 5: Typecheck the heartbeat block (D-50)**

Copy into the harness. `process.env.HEARTBEAT_URL!` needs `@types/node`; confirm `--strict` accepts the non-null assertion, or change the block to a checked read and report the change.

Expected: PASS.

- [ ] **Step 6: Run**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 19 tests.

- [ ] **Step 7: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): add the two sections about silence

Every mechanism in the stage fired when something happened and none fired
when something stopped. 'Checkout failed but Sentry shows nothing' was the
one lookup question with no answer anywhere in the document, and the
material was already on the page twice — the health check swallows an
exception deliberately, and the logging example is a business failure that
throws nothing.

The second section is the case where the gap costs most: a job that never
ran produces no error, no log and no request. The heartbeat is the only
monitor here that alerts on silence, and the code carries the reason it must
not sit in a finally block."
```

---

### Task 8: M3 and M4 — a join key, and somewhere for logs to live

**Files:**
- Modify: `docs/15-observability.md` — `### Structured logs`, plus one new `###` subsection after it
- Modify: `web/src/lib/stage-15-structure.test.ts` — `EXPECTED` grows by one
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: the `logger` block from Task 5. This task **extends** it with `requestId`; if Task 5 already added one, the plan was not followed and this task's RED will not appear — report it rather than inventing a different RED.
- Produces: heading `Where logs go, and what they cost`, immediately after `Structured logs`.

**M3:** the exemplar log object has no `requestId`, no `traceId`, no timestamp, no level, no service. At 2am the question is "what else happened during *that* request", and the schema cannot answer it. Distributed tracing is deferred to `## Scaling to a team` legitimately — but a per-request id is not distributed tracing. It costs one field and it is what makes the stage's own promise possible.

**M4:** "Log volume costs money and buries signal" is the entire treatment, and it implies a paid destination the document never tells you to acquire. A reader does everything the stage says, has an incident on Thursday, and finds Monday's logs are gone.

- [ ] **Step 1: Write the failing tests**

```ts
// M3. The exemplar log object was event/userId/invoiceId/reason/amountCents —
// no join key. Distributed tracing is deferred to Scaling to a team, which is
// fair, but a per-request id is not distributed tracing: it is one field, and
// without it "work out why" fails at two log lines.
test('M3: log lines carry a request id', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/requestId/)
  expect(logs).toMatch(/AsyncLocalStorage|x-request-id/i)
})

test('M3: the request id joins logs to the error tracker', () => {
  const logs = section('Structured logs')
  expect(logs).toMatch(/setTag/)
})

// M4. "Log volume costs money" was the whole treatment, and it implied a paid
// destination the doc never told you to acquire. stdout on a container
// platform is a stream, not storage.
test('M4: the document says where logs go and how long they live', () => {
  const where = section('Where logs go, and what they cost')
  expect(where).toMatch(/retention/i)
  expect(where).toMatch(/stream, not storage|not storage/i)
  expect(where).toMatch(/never expire/i)
})
```

The `never expire` assertion is deliberate: a CloudWatch log group's default retention is unlimited, which is the single most common way an AWS logging bill grows without anyone choosing it. Verify the current default before writing the sentence — Global Constraints, AWS claims are checked.

- [ ] **Step 2: Update `EXPECTED`, run, watch four fail**

Insert `'Where logs go, and what they cost'` after `'Structured logs'`.

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: four FAIL — three claims plus the structure test, which now expects a heading the document does not have.

- [ ] **Step 3: Add the base fields and the request id**

Extend the Task 5 logger block:

```ts
// src/lib/logger.ts
import { AsyncLocalStorage } from 'node:async_hooks'
import pino from 'pino'

export const requestContext = new AsyncLocalStorage<{ requestId: string }>()

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: process.env.SERVICE_NAME ?? 'web',
    env: process.env.NODE_ENV,
  },
  mixin: () => ({ requestId: requestContext.getStore()?.requestId }),
})
```

> `mixin` runs on every log call, so the id attaches itself and no call site has
> to remember it. Open the store once per request — in middleware, or the first
> line of the handler — with the incoming `x-request-id` if there is one, or a
> fresh `crypto.randomUUID()` if there is not. Platforms usually supply one
> already; use theirs when it exists, so your line and their line agree.

The sentence that says why this earns a field:

> One id is the difference between "here is an error" and "here is everything
> that happened during the request that produced it". It is also the cheapest
> thing in this stage: one field, no new vendor, no sampling decisions.

And the join to the error tracker:

```ts
Sentry.setTag('requestId', requestId)
```

> Now the error tracker and the logs are searchable by the same key, which is
> the whole of what tracing buys you until requests start crossing service
> boundaries ([Scaling to a team](#scaling-to-a-team)).

- [ ] **Step 4: Write `### Where logs go, and what they cost`**

> `pino` writes to stdout. On every platform in this playbook, **stdout is a
> stream, not storage** — something collects it, keeps it for a while, and
> then does not. Deciding what that something is, and for how long, is part of
> this stage; discovering it during an incident is not.

```markdown
| | Collector | Retention default | What to set |
|---|---|---|---|
| **Vercel** | Runtime logs | Short, and shorter on lower plans | A drain to a log store if you need more than the built-in window |
| **AWS** | CloudWatch Logs | **Never expire** | A retention policy per log group, explicitly |
```

> The AWS default is the one that bites. A log group with no retention policy
> keeps everything forever and bills for it forever, and nobody chose that —
> it is what happens when nobody chooses.

Then cost, in the shape stage 13 already uses for its own cost table:

> Order of magnitude for a small production service, so you can tell whether
> this stage is an afternoon or a commitment: error tracking free to ~$30/month
> at low volume, uptime monitoring free to ~$10, logs the variable one —
> single-digit dollars if you keep a week and log events rather than
> everything, and unbounded if you keep everything forever. Check current
> pricing rather than trusting this paragraph; it is here to set expectations,
> not to quote.

Close with the retention link to Task 2's boundary call:

> Retention is also a privacy decision, not only a cost one — whatever you kept
> is what you have to be able to delete ([08](08-security-audit.md)).

- [ ] **Step 5: Typecheck the logger block (D-50)**

The `mixin` signature and `AsyncLocalStorage` generic both need checking against the installed `pino` types.

Run: `npx tsc --noEmit`
Expected: PASS. If `mixin` does not accept that return shape on the installed version, fix the block and report it.

- [ ] **Step 6: Run**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 22 tests.

- [ ] **Step 7: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): add a join key, and say where logs live

The exemplar log object had no request id, so the stage's own promise — work
out why without redeploying — failed at two log lines. A per-request id is
not distributed tracing; it is one field, attached by a pino mixin so no call
site has to remember it, and tagged onto Sentry so both are searchable by the
same key.

The new section says the thing the doc implied and never stated: stdout is a
stream, not storage. CloudWatch log groups default to never expiring, which
is how an AWS logging bill grows without anyone choosing it."
```

---

### Task 9: M5, M6, M8 and M9 — four additions inside existing sections

**Files:**
- Modify: `docs/15-observability.md` — `### Health checks`, `### Alerts you will not learn to ignore`, `### Errors that are actually useful`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `section()`.
- Produces: no new headings. `EXPECTED` is unchanged — if this task needs to change it, the content went in the wrong place.

Four findings that each belong inside a section that already exists.

- [ ] **Step 1: Write the failing tests**

```ts
// M8. "Check real dependencies" is right for an uptime prober and wrong for a
// platform health check that restarts on failure, where a 30-second database
// blip becomes a rolling restart of every instance.
test('M8: liveness and readiness are distinguished', () => {
  const health = section('Health checks')
  expect(health).toMatch(/liveness/i)
  expect(health).toMatch(/readiness/i)
  expect(health).toMatch(/restart/i)
})

// M5. "Rate as a percentage of requests" is correct at scale and inverts below
// it: at four requests a minute, one 500 is a 25% error rate.
test('M5: the alerting section handles low traffic', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/minimum|at least \d+ requests/i)
})

// M6. The DoD asked whether every alert is one you would act on at 2am and
// never asked whether any of them arrives.
test('M6: the document says to test that an alert arrives', () => {
  const md = doc()
  expect(md).toMatch(/fire (a|one) test alert|trigger it on purpose/i)
})

// M9. One error loop in a batch job burns a month of quota in minutes, after
// which you are blind and do not know it.
test('M9: quota exhaustion is covered', () => {
  const errors = section('Errors that are actually useful')
  expect(errors).toMatch(/quota|spike protection/i)
})
```

- [ ] **Step 2: Run and watch four fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'M5\|M6\|M8\|M9'`
Expected: four FAIL.

- [ ] **Step 3: M8 — split the two questions in `### Health checks`**

After the existing "Check real dependencies" paragraph, which stays:

> Two different things ask whether you are up, and they want different answers.
> **Liveness** is "is this process wedged, should the platform restart it" —
> and the honest answer depends on nothing but the process, because a restart
> cannot fix a database. **Readiness**, which is what this endpoint does, is
> "should traffic come here, is everything it depends on reachable".
>
> Point your uptime monitor at the dependency-checking one. Point your
> *platform* — Fly, ECS, Cloud Run, Kubernetes, anything that restarts or
> deregisters on a failed check — at a liveness endpoint that returns `200`
> whenever the process is running. Wire the platform to the dependency check
> and a thirty-second database blip restarts every instance you have,
> simultaneously, turning a recoverable hiccup into an outage with a restart
> storm on top.

Two smaller repairs to the same code block, both recorded in the findings file
under "Also noted, smaller", both real:

> While you are here: that `catch` discards the reason. Log it — at `warn`,
> since a failing readiness check is not itself a fault — or the endpoint tells
> you the database is unhappy and destroys the only evidence of how.

And give the dependency check a timeout, because the block as written cannot
detect the failure it exists for:

```ts
await Promise.race([
  db.execute(sql`SELECT 1`),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
])
```

> The realistic failure is not *refused*, it is *hung* — an exhausted pool, a
> network partition. Without a timeout the health check hangs with it and never
> returns the `degraded` state it exists to report, which means the endpoint
> fails in exactly the case it was written for.

Typecheck this block in the harness with the rest (D-50): `Promise.race` over a
mixed tuple is where `--strict` tends to object.

- [ ] **Step 4: M5 — the arithmetic at low traffic**

In `### Alerts you will not learn to ignore`, after the worth/not-worth lists:

> **A ratio needs a floor.** "Error rate above 5%" is a sensible rule at a
> thousand requests a minute and nonsense at four: one failed request overnight
> is a 25% error rate, and it will page you. Gate every ratio alert on a
> minimum volume — *above 5% **and** at least twenty requests in the window* —
> and add a plain count alongside it for the traffic levels where the ratio is
> noise. The threshold that is right at lunchtime is wrong at 3am, and the
> volume gate is what keeps one rule usable across both.

- [ ] **Step 5: M6 — verify the alert arrives**

At the end of the same section:

> **Fire a test alert on purpose, and confirm it reaches you on the device you
> expect to be woken by.** An alert routed to a dead phone number, an expired
> webhook, or an app whose notifications you silenced in a meeting is
> indistinguishable from a healthy system, forever, and the only thing that
> tells you is the incident. Do it when you set the alert up, and again when
> you change how you are reachable.

Add the matching DoD checkbox:

```markdown
- [ ] At least one alert has been fired deliberately and confirmed to arrive
```

This is the repository's own standard applied to its monitoring: evidence
before assertion, and "configured" is not evidence.

- [ ] **Step 6: M9 — quota**

At the end of `### Errors that are actually useful`:

> One loop can spend everything. A batch job that throws once per row, over
> five thousand rows, sends five thousand events in a minute or two and empties
> a month's quota — after which you are blind, and nothing tells you so,
> because the thing that would have told you is the thing that ran out. Turn on
> spike protection, sample the noisy and expected, and set one alert on quota
> consumption itself. It is the only alert in this stage about your monitoring
> rather than your system, which is exactly why it gets forgotten.

- [ ] **Step 7: Run**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 26 tests. `EXPECTED` unchanged.

- [ ] **Step 8: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): liveness vs readiness, low-traffic maths, alert proof, quota

Four gaps that each belong in a section that already existed. The health
check advice was right for an uptime prober and dangerous for a platform
that restarts on a failed check. A ratio alert with no volume floor pages on
one failed request at 4rpm. Nothing in the stage checked that an alert
actually arrives, in a repository whose standard is evidence over assertion.
And one throwing loop can empty an error-tracking quota, after which you are
blind and nothing says so."
```

---

### Task 10: `### AI in observability`

**Files:**
- Modify: `docs/15-observability.md` — new final subsection of `## The work`
- Modify: `web/src/lib/stage-metadata.test.ts` — add `'15-observability'` to `AI_SECTION_STAGES`
- Modify: `web/src/lib/stage-15-structure.test.ts` — `EXPECTED` grows by one
- Read first: `docs/14-post-deployment-verification.md`, `### AI in post-deployment verification` — the pattern to match

**Interfaces:**
- Consumes: `EXPECTED`.
- Produces: heading `AI in observability`, last in `## The work`, matching where every other stage puts it.

D-35 requires this section, and `AI_SECTION_STAGES` is how it is enforced. The list is explicit rather than derived from `ready` **deliberately** — its own comment says so — precisely so the section lands with the doc amendment at the start of a round rather than when `ready` flips. Adding the slug here is therefore a real RED, not a manufactured one.

Match stage 14's shape: an opening that says what an agent is good and bad at *in this stage's terms*, a list of plays each labelled with its kind — `(A prompt.)`, `(A CLI + MCP command.)` — and a closing paragraph naming what the agent cannot do.

- [ ] **Step 1: Add the slug and watch it fail**

In `web/src/lib/stage-metadata.test.ts`, add `'15-observability',` after `'14-post-deployment-verification',`.

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts`
Expected: FAIL — `15-observability has no "### AI in ..." subsection`.

Paste the raw output into the task report. This is the RED the whole round has been waiting to satisfy.

- [ ] **Step 2: Write the section**

Open with the shape of the judgment, not a list:

> An agent is good at the parts of observability that are pattern-matching over
> text you already have — grouping errors, spotting what changed, writing a
> query in a language you do not know. It is bad at the part that decides
> whether you are actually covered, because that requires noticing what is
> *not* in the data, and the data is all it has.

Then the plays. Six, each labelled:

```markdown
- **Draft the alert set from your own event names.** Give it your structured
  log events, your four signals and your traffic shape, and ask for alert rules
  with thresholds, durations and a minimum-volume gate. The rules come back
  reasonable and the *numbers* come back invented — they are the part you
  replace with your own baselines. (A prompt.)
- **Ask which events stopped.** Paste a day of log events and yesterday's, and
  ask what appears in one and not the other. This is the one analysis that
  addresses the failure mode nothing else in this stage sees, and it is
  mechanical enough to hand over. (A prompt.)
- **Write the scrubbing deny-list from your own schema.** Point it at your
  schema and your environment variable names and ask which values would end up
  in an error payload. It finds the connection string you forgot; you verify by
  sending a test event and reading what arrived. (A prompt.)
- **Query logs in a language you do not know.** Describe the question in
  English and let it write the CloudWatch Logs Insights query or the PromQL.
  Reading a query you did not write is much easier than writing it, which
  reverses the usual argument against generated code here. (A CLI + MCP
  command.)
- **Turn an incident into the alert you were missing.** Paste the timeline of
  something you found out about late, and ask what signal would have fired
  first. It reliably names one you do not have. (A prompt.)
- **Generate the dashboard as configuration.** Grafana and CloudWatch both take
  JSON. Describe the four signals and the deploy markers and edit what comes
  back, rather than clicking twelve panels into existence. (A prompt.)
```

Close by naming the limit, in this stage's own terms:

> What it cannot do is tell you what you failed to instrument. Every one of
> those plays reads the signals that exist, and the failure this stage is most
> concerned with — the job that never ran, the business failure that threw
> nothing, the alert routed to a dead phone number — produces no signal at all.
> An agent will summarise a dashboard confidently while the thing that mattered
> is not on it.

- [ ] **Step 3: Update `EXPECTED`**

Append `'AI in observability'` to the end of `EXPECTED`.

- [ ] **Step 4: Run both tests**

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts src/lib/stage-15-structure.test.ts`
Expected: PASS. The metadata suite now covers twelve slugs.

- [ ] **Step 5: Teeth check**

Rename the new heading to `### Using AI in observability`, re-run `stage-metadata.test.ts`, and confirm the `15-observability` case fails while the other eleven pass. Revert.

The regex is `/^### AI in .+$/m`, so this also proves the guard is anchored rather than matching anywhere in the file.

- [ ] **Step 6: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-metadata.test.ts web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): write the AI plays section

D-35's guard is an explicit list rather than a derivation from \`ready\`,
deliberately, so the section lands with the doc amendment at the start of a
round. Adding the slug was the failing test; this is what satisfies it.

The closing limit is this stage's own: every play reads signals that exist,
and the failures this stage cares most about — the job that never ran, the
business failure that threw nothing — produce no signal at all."
```

---

### Task 11: S1 and S3 — move what is filed where nobody looks, and settle the abandoned taxonomy

**Files:**
- Modify: `docs/15-observability.md` — `### Three things, in order of value`, `### The four signals`, `### Alerts you will not learn to ignore`, `## Scaling to a team`, `## Definition of done`
- Test: `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `section()`, `doc()`.

Two of the five lookup failures were content filed where the audience will not look. Baselines existed only as a DoD checkbox and a trap — the only *actionable* statement in a closing checklist and the only *explanation* in a list of mistakes. And the verb for a noisy alert, "delete alerts that never led to action", sat under `## Scaling to a team`, a heading that tells a solo reader it is not for them.

**S3** is a judgment call and this task makes it: `### Three things, in order of value` announces an errors / metrics / traces taxonomy that the rest of the document never uses again, and gives traces a third of the framing and one sentence. **Keep the section and make it honest** rather than deleting it — the ordering claim ("errors first, they deliver value immediately") is real and load-bearing for a stage whose cadence is "day one, then continuous". What changes is that traces stop being announced and never delivered.

- [ ] **Step 1: Write the failing tests**

```ts
// S1. "Baselines documented for error rate and p95 latency" was a DoD
// checkbox and "No baseline" was a trap, so the only actionable statement
// lived in a closing checklist and the only explanation in a list of
// mistakes. A cold reader looking for "what does normal look like" found
// neither.
test('S1: baselines are taught in the body, not only in the checklist', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/baseline/i)
  expect(signals).toMatch(/write (them|the numbers) down|record/i)
})

// S1. The disposal instruction for the commonest solo alerting failure was
// under a heading that tells solo readers it is not for them.
test('S1: deleting a noisy alert is in the alerting section', () => {
  const alerts = section('Alerts you will not learn to ignore')
  expect(alerts).toMatch(/delete/i)
  expect(alerts).toMatch(/raise the threshold|lengthen the window|tune/i)
})

// S3. The taxonomy promised three things and delivered two.
test('S3: traces get more than an announcement', () => {
  const three = section('Three things, in order of value')
  expect(three).toMatch(/you will know when you need|until then/i)
})
```

The second test also closes the reader's secondary complaint: the only options offered were keep or delete, and four fires a week is usually a threshold problem.

- [ ] **Step 2: Run and watch three fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'S1\|S3'`
Expected: three FAIL.

- [ ] **Step 3: Teach baselines where they are looked for**

Add to the end of `### The four signals`:

> Instrumenting these gives you numbers. It does not give you *normal*, and
> without normal none of them is readable: 12 errors in the last hour is a
> catastrophe or a Tuesday, and during an incident is the worst possible moment
> to find out which. **Write the numbers down** once you have a week of
> ordinary traffic — error rate, p95 latency, requests per minute at your busy
> hour and your quiet one — somewhere you will find them at 3am, which means
> the repository and not your memory. Stage 14 uses the same baselines to judge
> a deploy ([14](14-post-deployment-verification.md)); this is where they come
> from.

Note the ordering problem the findings file records: the DoD here cites 14 for
baselines while 14 consumes what this stage produces. State the direction
explicitly, as above, rather than leaving the two documents pointing at each
other.

- [ ] **Step 4: Move the alert-disposal verb into the alerting section**

Add to `### Alerts you will not learn to ignore`, after the M6 paragraph:

> An alert that has woken you four times without once needing action is not a
> discipline problem, it is a broken alert, and you have three moves: **raise
> the threshold**, **lengthen the window** it has to hold for, or **delete
> it**. Reach for the first two before the third — four fires a week is usually
> a threshold set from a guess rather than from a baseline. Delete without
> hesitation when it has never once led to action; an alert nobody acts on is
> training you to ignore the one that matters.

In `## Scaling to a team`, the existing "Review alert noise monthly" bullet
stays — at team size the *ritual* is the point, and it is a different claim
from the solo one. Trim it to the part that is about the team:

```markdown
- **Review alert noise monthly, as a team.** Unowned alerts are ignored by
  everyone, each assuming someone else has it, and the monthly review is where
  ownership gets assigned or the alert gets deleted.
```

- [ ] **Step 5: Settle the taxonomy**

Rewrite the traces entry in `### Three things, in order of value` so it stops
announcing something the stage does not deliver:

> **3. Traces** — where request time went, across every hop of one request.
> This stage does not set them up, and that is not an oversight: with one
> application and one database, a trace tells you what a slow query log already
> told you. **You will know when you need them** — the symptom is a slowness
> you cannot locate after checking the obvious two places, and it usually
> arrives with the second service ([09](09-performance-optimization.md),
> [Scaling to a team](#scaling-to-a-team)). Until then the request id from
> `### Structured logs` does the job traces would.

That last clause is what makes the taxonomy honest: the reader is told what
plays the role instead, rather than being left with a third of a framing
device pointing at nothing.

- [ ] **Step 6: Run**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts`
Expected: PASS, 29 tests.

- [ ] **Step 7: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): move baselines and alert disposal into the body

Two of five cold-reader lookup failures were content filed where the
audience will not look. The only actionable statement about baselines was a
DoD checkbox and the only explanation was a trap. The verb for a noisy alert
sat under 'Scaling to a team', which tells a solo reader it is not for them
— and offered only keep or delete, when four fires a week is usually a
threshold problem.

Traces stop being announced and never delivered: the section now says what
plays their role until the second service arrives."
```

---

### Task 12: P1 and P2 — the glossary stops pointing at things the stage does not say

**Files:**
- Modify: `web/src/lib/terms.ts`
- Modify: `docs/15-observability.md` — `### The four signals`, `## Scaling to a team`
- Generated: `reference/glossary.md` via `pnpm gen:glossary` — **never hand-edited**
- Test: `web/src/lib/terms.test.ts`, `web/src/lib/term-usage.test.ts`, `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: `doc()`.
- Produces: a `percentile` entry in `terms.ts` with the same shape as its neighbours — `name`, `short`, `full`, `soWhat`, `see`.

**P1:** `p50`/`p95`/`p99` is used four times in this stage, cross-referenced to stage 09 — **which does not define it either**, it only uses it ("API responses under 300ms at p95") — and there is no `percentile` entry in `terms.ts`. The most repeated concept in the stage is undefined in all three places a reader would look.

**P2:** `terms.ts` tethers `error-budget` to `15-observability` and the phrase never appears in the document.

- [ ] **Step 1: Read the neighbours before writing**

Run: `grep -n -B2 -A8 "'golden-signals'" web/src/lib/terms.ts`

Match the field shape and the voice exactly. `soWhat` is the field that earns its keep — it says why the reader should care, not what the word means.

- [ ] **Step 2: Write the failing tests**

```ts
// P1. p50/p95/p99 was used four times here, cross-referenced to stage 09,
// which uses it too and never defines it. There was no glossary entry either.
test('P1: percentiles are defined where they are used', () => {
  const signals = section('The four signals')
  expect(signals).toMatch(/95% of requests|slower than 95%|out of every hundred/i)
})

// P2. `error-budget` is tethered to this stage in terms.ts and the phrase
// never appeared in the document it points at.
test('P2: the stage uses the term its glossary entry points here for', () => {
  expect(doc()).toMatch(/error budget/i)
})
```

**First, read `web/src/lib/term-usage.test.ts`.** Its name suggests it may already guard this. If it does, then `error-budget` slipped past an existing guard, which is a different and more interesting report than a missing one — say so in the task report and skip the rest of this step.

If it does not, add the guard for the *class* of defect rather than only for P2:

```ts
// P2 was an instance of a class: a glossary term whose `see` points at a
// stage that never uses the term. The entry promises the reader a definition
// in context and the stage does not deliver one.
test('a term pointing at a stage names something that stage actually says', () => {
  const offenders: string[] = []

  for (const [slug, term] of Object.entries(TERMS)) {
    if (!term.see) continue
    const md = readFileSync(docPath(term.see), 'utf8').toLowerCase()
    if (!md.includes(term.name.toLowerCase())) {
      offenders.push(`${slug} -> ${term.see} (never says "${term.name}")`)
    }
  }

  expect(offenders).toEqual(KNOWN_ORPHANS)
})
```

**Expect this to fail for stages other than 15, and do not fix those here.**
Seed `KNOWN_ORPHANS` with exactly what the first run reports, minus anything
pointing at `15-observability`, and record each remaining entry in the task
report as `(PRE-EXISTING, not introduced here; defer)`. A round that quietly
expands to fix six other stages is a round whose review nobody can scope.

- [ ] **Step 3: Run and watch them fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'P1\|P2'`
Expected: two FAIL.

- [ ] **Step 4: Define percentiles in the latency signal**

Replace the latency bullet in `### The four signals`:

```markdown
**Latency** — how long requests take, at p50, p95 and p99. A p95 of 400ms means
95 requests out of every hundred finished faster than that and five did not;
p99 is the worst one in a hundred. Watch the tail, not the middle: the average
is dragged down by everything that went fine, so it stays comfortable while a
growing minority of users wait ([09](09-performance-optimization.md)).
```

One caution worth a sentence, since the SRE reader flagged it and it is cheap:

> Percentiles do not average. A p95 across three instances is not the mean of
> their three p95s, and a dashboard that computes one is showing a number that
> does not correspond to anything.

- [ ] **Step 5: Make the error budget appear where it belongs**

In `## Scaling to a team`, expand the SLO bullet:

```markdown
- **Define SLOs, and the error budget that follows from one.** "99.9% of
  requests succeed" is a target; the useful half is the arithmetic underneath
  it — 99.9% over a month is about 43 minutes of failure you have *decided is
  acceptable*. That is the error budget. Spending it is allowed, which is what
  makes it a budget; exceeding it is the rule that says stop shipping features
  and fix reliability. Without the budget, an SLO is a number in a document
  that nobody has to act on.
```

This is P2's fix and it is also what `terms.ts` already claims the stage says —
the glossary entry for `error-budget` reads "Spending it is allowed — that is
what a budget is for; exceeding it means stop shipping features and fix
reliability." Match it rather than inventing a second phrasing.

- [ ] **Step 6: Add the `percentile` term**

```ts
percentile: {
  name: 'Percentile',
  short: 'The value below which a given share of measurements fall — p95, p99.',
  full: 'A ranking rather than an average. A p95 latency of 400ms means 95 of every hundred requests finished faster than 400ms and five did not. Percentiles do not average: the p95 across three servers is not the mean of their three p95s.',
  soWhat:
    'An average is dragged down by everything that went fine, so it stays comfortable while a growing minority of users wait. The tail is where the experience people complain about lives.',
  see: '15-observability',
},
```

Place it in the file's existing order — check whether entries are alphabetical or grouped before inserting.

- [ ] **Step 7: Regenerate the glossary**

Run: `cd web && pnpm gen:glossary`
Then: `git diff --stat reference/glossary.md`

Expected: one entry added. **If the diff shows anything you did not cause, stop** — `reference/glossary.md` is generated and a surprising diff means someone hand-edited it, which is D-47's exact failure mode.

- [ ] **Step 8: Run the full unit suite**

Run: `cd web && pnpm test`
Expected: PASS. `terms.test.ts` and `term-usage.test.ts` both read `terms.ts` and either could object to a new entry.

- [ ] **Step 9: Commit**

```bash
git add web/src/lib/terms.ts reference/glossary.md docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): define percentiles, and make the error budget appear

p50/p95/p99 was the most repeated concept in the stage and was defined in
none of the three places a reader would look — not here, not in stage 09,
which uses it without defining it either, and not in the glossary.

error-budget was already a glossary term tethered to this stage, and the
phrase appeared nowhere in it. The Scaling to a team bullet now carries the
arithmetic the glossary entry already promised."
```

---

### Task 13: Cross-references, the new traps, and two findings this round rejects

**Files:**
- Modify: `docs/15-observability.md` — `## Traps`, `## Artifacts`, `## Definition of done`, plus link additions throughout
- Test: `web/src/lib/source-citations.test.ts` (existing), `web/src/lib/stage-15-structure.test.ts`

**Interfaces:**
- Consumes: everything above.

Three jobs. Add the cross-references that turn two cold-reader findings from
defects into boundaries. Add traps for the content this round introduced.
And record, in the task report, the two recommendations this round **rejects**
— a reviewer is expected to disprove as well as confirm, and a plan that
silently drops a finding is indistinguishable from one that missed it.

**REJECTED — "trim `## Traps`, 9 of its 10 entries duplicate the body."** The
observation is correct and the conclusion does not follow. Every one of the
eighteen stage documents carries a Traps section that restates its body in
sharper language; it is the house mnemonic layer, not an accident of this
document. The finding's real content is that Traps was the *only* home for
"No baseline", and Task 11 fixed that by teaching baselines in the body.
Deleting the duplicates would make this stage inconsistent with seventeen
others to solve a problem that is already solved. **Add the missing traps
instead of removing the present ones.**

**REJECTED — "`## Artifacts` is filler that restates `## The work`."** Same
reasoning: it is the stage template, present in all eighteen. A round that
deletes a template section in one document creates drift rather than removing
it. If Artifacts should go, that is a decision about the playbook and it
belongs in `docs/tracker.md` as a numbered decision, not in a stage round.

- [ ] **Step 1: Write the failing tests**

```ts
// The round added five mechanisms and Traps knew about none of them.
test('Traps covers what this round added', () => {
  const md = doc()
  const traps = md.slice(md.indexOf('## Traps'))
  expect(traps).toMatch(/never ran|silence/i)
  expect(traps).toMatch(/retention|forever/i)
})

// The boundary calls from the findings file: triage is stage 16's, deletion
// is stage 08's. A boundary is only a boundary if the reader is told where to
// go.
test('the stage points at 16 for what to do when an alert fires', () => {
  expect(doc()).toMatch(/16-incident-management\.md/)
})
```

- [ ] **Step 2: Run and watch both fail**

Run: `cd web && pnpm vitest run src/lib/stage-15-structure.test.ts -t 'Traps\|16'`
Expected: two FAIL.

- [ ] **Step 3: Add the stage 16 hand-off**

At the end of `### Alerts you will not learn to ignore`:

> This stage stops at the alert arriving. What you do in the five minutes after
> it — where to look first, what to roll back, what to write down — is
> [16 — Incident Management](16-incident-management.md), and it is worth having
> read *before* the alert rather than after.

This is the DISPROVED finding from the findings file: run 1 rated the missing
triage procedure a defect and explicitly noted no other stage was cited for it,
because it could not see other files. Stage 16 has *First five minutes*,
*Diagnosing*, *The runbook* and *Escalation*. The fix is one link.

- [ ] **Step 4: Add the new traps**

Append to `## Traps`, in the section's existing voice — a bold name, then one
or two sentences that sting:

```markdown
**Monitoring that only fires on events.** Everything you built reports when
something happens. The job that stopped running, the orders that stopped
arriving, and the alert that stopped being delivered all produce silence, and
silence looks exactly like health.

**A heartbeat in a `finally` block.** It reports success for a run that threw,
which is worse than no heartbeat: you now have a monitor that actively tells
you the wrong thing.

**Logs with no retention policy.** On AWS that is the default, and the bill
grows forever because nobody chose anything. On a container platform the
opposite bites — stdout is a stream, and the incident you are investigating on
Thursday happened on Monday.

**An alert nobody has ever seen arrive.** Configured is not delivered. A dead
phone number is indistinguishable from a quiet system until the night it
matters.

**Health checks wired to the thing that restarts you.** Point a platform's
liveness probe at a check that fails when the database blinks and one blip
restarts every instance you have, at once.
```

- [ ] **Step 5: Update `## Artifacts` and `## Definition of done` for the round**

Both sections keep every existing entry. This is an addition, not a rewrite.

Append to `## Artifacts`:

```markdown
- A heartbeat monitor on every scheduled job, alerting on a missing ping
- A read-only canary endpoint, if the service is behind authentication
- A retention policy on every log group or drain, chosen rather than defaulted
- A request id on every log line, and on the matching error-tracker event
```

Append to `## Definition of done`:

```markdown
- [ ] Every scheduled job pings a heartbeat on success, and you have watched
      the monitor page you by not running one
- [ ] A single request id joins a log line to its error report
- [ ] Log retention is a number you chose, and you know what it costs
- [ ] Liveness and readiness are separate endpoints, and the platform's
      restart trigger points at the one that does not check dependencies
```

Keep every checkbox phrased as something you can *check*. "Every configured
alert is one you would act on at 2am" is the best line in the existing
checklist because it is a test, not an aspiration — match it. Note that the
first one above is deliberately phrased as *watched it fire*, which is the
same standard Task 9 applied to alerts.

- [ ] **Step 6: Verify every new link resolves**

Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts`
Expected: PASS.

This round adds links to 08, 09, 14 and 16 and an in-document anchor to
`#scaling-to-a-team`. A broken markdown link is invisible to lint, typecheck
and the audit suite.

- [ ] **Step 7: Run `humanizer` over the round's new prose**

Invoke `humanizer:humanizer` on the sections this round added or substantially
rewrote. **Skip code blocks, tables and terminal output** — the flagged
patterns are not the problem there.

Apply the fixes that make the writing clearer; skip the ones that would flatten
deliberate voice. **Em dashes stay** — house voice, and fifteen existing specs
run a median of 0.13 per line. Record in the task report what was applied and
what was declined, with a reason for each declined item.

- [ ] **Step 8: Run the whole unit suite**

Run: `cd web && pnpm test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add docs/15-observability.md web/src/lib/stage-15-structure.test.ts
git commit -m "docs(observability): cross-references, the new traps, and a humanizer pass

Two cold-reader findings become boundaries rather than defects once the link
exists: triage is stage 16's job and it has the sections for it, deletion is
stage 08's. Traps gains entries for the five mechanisms this round added,
including the heartbeat-in-a-finally trap, which is worse than no heartbeat.

Deliberately not done: trimming Traps' duplication and deleting Artifacts.
Both were raised, both are the house template across eighteen documents, and
changing one document's shape to fix a playbook-wide question would create
drift rather than remove it."
```

---

### Task 14: Re-run the instruments

**Files:**
- Create: `docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md` — **append** a re-run section, do not overwrite
- Read only: everything this round changed

**Interfaces:**
- Produces: the finding list Task 15 fixes.

This is the middle of the round, not the end. `docs/learnings/cold-reader-testing.md` is explicit: a re-run finds defects **the round itself introduced**, not only old ones. Stage 03's re-run found five newly created defects, including a Definition-of-done checkbox gating on a concept the body never taught — the same class of defect this round is fixing, created by the round that was fixing it. A document that grows by two hundred lines acquires new internal inconsistencies faster than its author notices, because the author checks each addition against intent rather than against the other two hundred lines.

- [ ] **Step 1: Re-run the completeness reader with the same scenario**

Dispatch a fresh agent, allowed to read **only** `docs/15-observability.md`.
Use the **Loaf scenario verbatim** from the findings file — a different scenario
produces a fresh unrelated list and tells you nothing about whether anything was
fixed.

Ask it explicitly to report against the previous gap IDs where it can: closed,
partially closed, still open, or newly introduced.

- [ ] **Step 2: Re-run the consultability reader with the same five questions**

Same five symptom-shaped lookup questions, same headings-only method. The
pre-round score was **2/5**. Anything below 4/5 means the structural fixes in
Task 11 did not land and the finding is real.

- [ ] **Step 3: Read the round's own code as code, then run it**

D-50. Every TypeScript block added by Tasks 2, 5, 6, 7 and 8 goes through the
harness one final time **as a single file**, not block by block — the failure
this catches is two blocks that each compile and disagree with each other, for
example a `logger` construction in one section and a call signature in another.

Run: `npx tsc --noEmit`
Expected: PASS. Paste the output.

- [ ] **Step 4: Append the results to the findings file**

Under a new `## Re-run, after the fix waves` heading. Keep the original
sections intact — the record of what was believed at the time is the value,
and this repository appends and supersedes rather than editing.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-09-08-stage-15-cold-reader-findings.md
git commit -m "docs(observability): re-run the cold readers against the corrected doc

Same Loaf scenario and the same five lookup questions, because a fresh
scenario produces an unrelated list and says nothing about whether anything
was fixed. Appended rather than rewritten."
```

---

### Task 15: The fix wave

**Files:**
- Modify: whatever Task 14 found

**Interfaces:**
- Consumes: the re-run findings.

**Budget for this task; do not treat Task 14's report as a closing ceremony.**
The learning guide's most expensive lesson is D-48: the fix wave lands *after*
the pass that justified it, so nothing checks it. Stage 03's fix wave shipped
the document's only unrunnable SQL — a foreign key to a table that did not
exist, inside a block whose comment claimed to demonstrate a tenant key that
appeared on zero tables. It was that round's headline fix and it did not
survive being read as SQL.

- [ ] **Step 1: Triage every finding into defect or boundary**

Same rule as the first pass: a contradiction or a reader unable to proceed
within the stage's own scope is a defect. Another stage's job is a boundary.
**Say which, for each, in the task report.** Agreeing with a wrong finding is
worse than missing one.

- [ ] **Step 2: Fix the defects, test-first where a claim is assertable**

Every fix that can be pinned as a claim gets a test in
`stage-15-structure.test.ts` first. Fixes that are purely prose quality do not.

- [ ] **Step 3: Re-skim the fix wave's own additions**

The cheap mitigation the guide names, because this is the wave nothing else
checks. Read anything containing code **as code**, then run it in the harness.

- [ ] **Step 4: Run everything**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test
```
Expected: all PASS. Paste raw output.

- [ ] **Step 5: Commit**

```bash
git commit -m "docs(observability): fix wave from the cold-reader re-run"
```

---

### Task 16: Close the records

**Files:**
- Modify: `docs/tracker.md`, `docs/task.md`, `KICKOFF.md`

**Interfaces:**
- Consumes: the whole branch.

- [ ] **Step 1: Grep for stale merge claims before writing anything**

Run: `grep -n "NOT merged, NOT pushed, NOT deployed" docs/tracker.md`

Doing this once in a previous session found three rows carrying the phrase: one
merely out of date and two false for weeks. It costs one command, and a
"merged"/"not merged" claim is a query to re-run, not a fact to reuse.

- [ ] **Step 2: Write the tracker row**

Evidence, not adjectives: the commit range, the test count re-derived rather
than quoted, what the cold readers found on each pass, and what the round
deliberately did **not** do. The `Deferred:` list is not optional — it is what
stops scope creep being invisible.

Deferred, at minimum: the interactive port (W-3.12 proper), the `observability`
reference sheet (W-6, ungathered — search terms are in
`reference/cheatsheet-sources.md` once Task 16 adds them), trimming Traps and
deleting Artifacts (both rejected in Task 13, with reasons), on-call
arrangements for exactly two people (a boundary, but two developers is the
playbook's own target case, so it is worth revisiting), the pre-existing
glossary orphans Task 12 turns up in other stages, and **S4** — the finding
that the document's most consultable claims are bold lead-ins invisible to a
table of contents. S4 is deliberately left for the port: a stepper surfaces
lead-ins as panel structure, so fixing it in markdown would solve it twice and
possibly in two different ways.

- [ ] **Step 3: Add the W-6 gathering entry**

Add an `### Observability · \`observability\` · stage 15` entry to
`reference/cheatsheet-sources.md` under Priority 3, with the search queries.
The five that pay are the ones that fill something the doc asserts without
teaching: `"SLI SLO SLA" explained`, `"error budget" explained`,
`"four golden signals" SRE`, `"RED method" "USE method" monitoring`,
`"p50 p95 p99" percentiles explained`, `"logging levels" cheat sheet`.

Note two things in the entry: that these searches will surface stage 16
material (MTTR, on-call, postmortems) which files against
`16-incident-management` and not here, and that no tool sheet is proposed yet
because the project's own tools have little gatherable material while the
available graphics are Prometheus/Grafana — the same vendor mismatch `ci-cd`
accepted deliberately.

- [ ] **Step 4: Correct `KICKOFF.md`**

Two claims in it were wrong and were believed going into this round:

- "6 `##` sections and **9** `###` subsections" — it was 8 before this round.
  Replace with the count as of this branch, and note it will go stale.
- "`stage-metadata.test.ts` fails any `ready: true` stage whose doc lacks that
  heading" — it does not. `AI_SECTION_STAGES` is an explicit list, and the
  test's own comment says the explicitness is deliberate.

That makes six wrong claims found in that file. Add the correction rather than
silently fixing it, in the style the file already uses for its own corrections.

- [ ] **Step 5: Update `docs/task.md`**

W-3.12's doc phase is complete; the port is not. `ready` is still `false`. Do
not tick anything that implies the stage is interactive.

- [ ] **Step 6: Commit**

```bash
git add docs/tracker.md docs/task.md KICKOFF.md reference/cheatsheet-sources.md
git commit -m "docs(tracker): record the stage 15 doc round"
```

---

## Verification (after all tasks)

Run on the branch, and again on the merge result if the user approves a merge.

- [ ] `cd web && pnpm lint` — 0 warnings, `--max-warnings 0`
- [ ] `cd web && pnpm typecheck` — runs `next typegen` first; a bare `tsc` passes only because a previous build left `.next` behind
- [ ] `cd web && pnpm test` — both projects, `unit` and `dom`
- [ ] `cd web && pnpm build` — clean
- [ ] `cd web && pnpm test:e2e` — 18/18. **Required this round**: `terms.ts` changed, so the glossary page's rendered content changed
- [ ] `cd web && pnpm test:dev-console` — **unrun since 2026-09-07**. It needs its own dev server and refuses to start while another `next dev` holds the directory. Ask the user to stop theirs rather than killing their process. It is the only thing that sees React's development warnings
- [ ] `git diff --stat main...HEAD` — every changed file expected
- [ ] `reference/glossary.md` diff contains only the generated `percentile` entry
- [ ] `grep -c '^### ' docs/15-observability.md` — matches `EXPECTED.length` in the structure test
- [ ] **Do not claim a count you did not re-derive.** Four numbers in `KICKOFF.md` and three in the records have been wrong when written. Run the command, then write the number

**Not run, and why:** `pnpm test:prod` checks the deployed site. A green run says nothing about this branch and a red one may have nothing to do with it. It belongs after a promotion to `main`, which is the user's.

**The merge is the user's call, every time.** Having this plan approved is not approval to merge the branch that comes out of it. Ask.
