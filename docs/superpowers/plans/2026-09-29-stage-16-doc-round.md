# Stage 16 Document Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair Stage 16 so a solo or small-team responder can choose a safe response, verify recovery and complete useful follow-up.

**Architecture:** Revise the canonical markdown in four reviewable content slices, with section-scoped regression tests written first. Correct the visible stage summary and add glossary definitions without registering an interactive port. A final task reruns the original cold-reader instruments and reserves a fix wave.

**Tech Stack:** Existing TypeScript/Vitest tests, markdown, generated glossary; existing Next.js site for the summary verification. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-29-stage-16-doc-round-design.md` (approved by the user's “continue” after written-spec review request).

## Global Constraints

- Keep the house top-level sections, stage title and cadence. Stage numbers remain filing codes.
- Retain the stage's Critical/Major/Minor vocabulary as local policy, not a universal standard.
- Use TDD for the document's regression guards, metadata change and glossary changes.
- No interactive port, component registration, image publication or W-6 implementation; `ready` remains false.
- No new persistence, infrastructure or dependencies. Never execute incident commands against real services.
- Preserve Parcel as the held-out scenario. Teach with the fictional appointment-reminder service **Nudge**.
- Run tasks sequentially: all content tasks edit the same document/test file. Independent readers may work concurrently.
- Run commands from `web/` unless stated otherwise. Use `pnpm typecheck`, never bare tsc.
- Record raw RED/GREEN output and a targeted teeth check for each fix. Do not claim a keyword test proves sound operational judgment.
- Apply humanizer to prose. Independent per-task review remains required for either execution method, followed by final whole-branch review.
- Work on `docs/2026-09-29-stage-16-preparation` or a work branch from its tip; never edit develop/main directly. Ask before merge; target develop only.

## Review Focus

- Healthy homepage with broken background work: Task 1 guards the customer-operation check; cold reader must transfer it to Parcel.
- Rollback available but irrelevant or incompatible: Task 1 guards a conditional decision table and stop conditions.
- Provider green with ambiguous side effects: Task 2 guards reconciliation before replay and separate recovery/closure criteria.
- Only responder available with no recovery estimate: Task 2 guards fallback ownership and a promised next update, not an invented ETA.
- Copyable examples contradicting policy: Task 3 parses fenced action tables and checks owners/dates/evidence; Task 5 independently checks the story.

## File map and execution evidence

`docs/16-incident-management.md` owns teaching; `web/src/lib/stage-16-structure.test.ts`
owns the new document guards. Existing `stages.test.ts` guards the summary,
`stage-metadata.test.ts` the AI section, `terms.test.ts` vocabulary, and
`glossary.test.ts` the generated snapshot. Do not change renderer interfaces.

Each task report goes into `docs/superpowers/plans/2026-09-29-stage-16-doc-round-evidence.md`
with commands, raw output, why RED failed, mutation/reversion evidence, reviewer
verdict, and deliberate deferrals. Create this evidence file during execution, not
as fabricated test output now. Do not promise a test count before measuring it.

---
### Task 1: Make first response conditional and safe

**Files:** Create `web/src/lib/stage-16-structure.test.ts`; modify `docs/16-incident-management.md`, `web/src/lib/stages.ts`, `web/src/lib/stages.test.ts`.

**Interfaces:** Produces the fence-aware `section` and whitespace-normalized `text` test helpers. Preserves the stage title/cadence/readiness. Owns I1, I2, I3, I6 and M2.

- [ ] Read this task, the approved spec and the current affected sections. Invoke systematic-debugging before proposing changes: the finding IDs below are hypotheses to confirm against the actual text.
- [ ] Add these tests before editing the teaching. Create the file with this helper first:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const path = fileURLToPath(new URL('../../../docs/16-incident-management.md', import.meta.url))
const doc = () => readFileSync(path, 'utf8')

// Ignore headings inside fences, but retain fenced content in returned sections.
function section(heading: string, source = doc()): string {
  const lines = source.split('\n')
  let fence: string | undefined
  let start = -1
  let level = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const marker = line.match(/^\s*(`{3,}|~{3,})/)
    if (marker) {
      if (!fence) fence = marker[1]
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = undefined
      continue
    }
    if (fence) continue
    const match = line.match(/^(#{1,6}) (.+)$/)
    if (!match) continue
    if (start >= 0 && match[1].length <= level) return lines.slice(start, i).join('\n')
    if (match[2] === heading) { start = i; level = match[1].length }
  }
  if (start < 0) throw new Error(`Missing section: ${heading}`)
  return lines.slice(start).join('\n')
}

const text = (heading: string) => section(heading).replace(/\s+/g, ' ')

test('fenced template headings do not hide the artifact being checked', () => {
  const sample = '### Outer\n```markdown\n## Inner\nowner: Ana\n```\n### Next\nstop'
  expect(section('Outer', sample)).toContain('owner: Ana')
  expect(section('Outer', sample)).not.toContain('stop')
  expect(() => section('Absent', sample)).toThrow('Missing section: Absent')
})
```

```ts
test('I2: mitigation permits the investigation needed to choose an action', () => {
  expect(text('The order that matters')).toContain('Investigate enough to choose a safe mitigation')
})
test('I3/M2: impact follows the customer operation even with green web health', () => {
  const s = text('First response: confirm impact and severity')
  expect(s).toContain('A healthy homepage does not prove that a worker completed its job')
  expect(s).toContain('provisional severity')
})
test('I6: rollback suitability includes relevance and compatibility', () => {
  const s = section('Choose a mitigation')
  for (const phrase of ['Relevant recent change', 'schema compatibility', 'irrelevant', 'Stop condition', 'Check effect']) expect(s).toContain(phrase)
})
test('I1: suspected compromise has a containment path', () => {
  const s = text('When access may be compromised')
  expect(s).toContain('Contain unauthorized access')
  expect(s).toContain('without delaying urgent containment')
  expect(s).toContain('Availability alone does not establish safety')
})
```

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture RED. Missing new sections or missing required guidance must cause the failure, not a syntax/import error. Earlier tasks must still pass.
- [ ] Replace the opening quote with `> Limit harm first. Verify recovery. Learn from what happened.` Replace from `### The order that matters` up to (excluding) `### Diagnosing` with the content below. Keep the later old sections until their owning tasks replace them. Use the complete replacement content below; adjust only if source verification or a reviewer disproves a claim, and record that correction.

````markdown
### The order that matters

**Limit harm, verify recovery, then finish the investigation and prevention work.**
Investigate enough to choose a safe mitigation; do not wait for a complete causal
explanation while users remain affected. Keep a timeline and communicate throughout.
If access may be compromised, use the containment path below. Restoring availability
is not always the first safe action.

### First response: confirm impact and severity

Confirm the affected customer operation using a safe check and existing evidence.
A healthy homepage does not prove that a worker completed its job. For background
work, inspect completion records, oldest pending work and customer reports. Avoid
creating duplicate side effects just to reproduce a failure. Record what you know,
what remains unknown, when impact began, and who is responding.

Declare an incident when impact or credible risk needs coordinated attention. Do
not wait for the exact cause or complete user counts. Check recent changes and
provider status early; a provider incident is a hypothesis, not proof of your cause.

These are local policy examples, not universal SEV numbers or response deadlines:

| Severity | Example impact | Response |
|---|---|---|
| Critical | Widespread outage, credible compromise, data loss or blocked payments | Respond immediately and seek help |
| Major | Important customer work blocked or significantly degraded | Start response promptly; escalate as impact grows |
| Minor | Limited impact with a safe workaround | Name an owner and an agreed response time |

Use provisional severity when impact is uncertain. Explain the evidence and unknowns,
choose the more urgent plausible response if harm may be serious, and reassess after
each new observation. A small user count does not make data loss minor.

### Choose a mitigation

Choose by evidence and likely harm, not a fixed list of commands. Record the action,
operator, time and observed effect. Stop or reverse a harmful action where safe.

| Option | Preconditions | Possible harm / Stop condition | Check effect |
|---|---|---|---|
| Rollback | Relevant recent change; known-good target; schema compatibility checked | Old code may not read current data; stop if incompatible or impact grows | Affected operation succeeds and errors fall |
| Disable a feature | Tested flag and understood effect on accepted work | May strand work; stop if unrelated paths fail | Failed operation is safely unavailable and accepted work is accounted for |
| Add capacity | Saturation confirmed and downstream capacity permits it | More workers can overload a dependency; stop if dependency errors rise | Queue age and latency improve without new failures |
| Degrade around a dependency | Known safe fallback, admission control or bounded queue | Lost work, stale results or repeated side effects; stop if outcomes are uncertain | Customer-visible behavior matches the advertised degraded service |
| Fix forward | Bounded change supported by evidence; rollback unsafe or irrelevant | Rushed change may widen impact; stop on failed checks | Verify the affected operation and monitor recurrence |

A rollback may be available but irrelevant to a provider outage. Do not restart,
scale or replay blindly. Keep uncertain outcomes for reconciliation and use the
service runbook. If no action is known safe, limit further harm, escalate and explain
the current limitation rather than inventing a repair.

For Vercel and AWS rollback procedures, use [13 — Production Deployment](13-production-deployment.md),
especially its platform-specific rollback sections. Those procedures still require
the relevance and compatibility checks above. Application rollback does not undo a
database migration. Validate customer recovery using [14 — Post-Deployment Verification](14-post-deployment-verification.md)
and the recovery criteria in this stage.

### When access may be compromised

Contain unauthorized access using the service's security response procedure and
trusted administrative access. Capture available logs and action timestamps without
delaying urgent containment. Restrict access to evidence; do not paste credentials
or customer data into public incident channels. Escalate to the security contact or
provider support with the affected resource, observed behavior and actions taken.

For example, a leaked deployment credential needs access containment and review of
what it could change. Rolling the app back alone does not revoke that credential.
Availability alone does not establish safety. Reopen access only after the responsible
responder has checked containment and recovery; involve specialist help when the
scope cannot be established. Detailed forensic work and notification obligations
belong to the security response process, not a generic availability checklist.

````

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture GREEN. Format changed TypeScript with `pnpm exec prettier --write src/lib/stage-16-structure.test.ts`.
- [ ] Teeth check: Change `schema compatibility` to `schema unexamined` in the rollback row only; only I6 must fail. Separately remove `without delaying urgent containment`; only I1 must fail. Revert each mutation before the next. Run the whole new test file, confirm only the corresponding regression test fails, restore immediately, and run it again. Record both outputs.
- [ ] Obtain a fresh read-only per-task review. Require finding IDs, severity and provenance; resolve blockers before continuing. Tests pin prose contracts; the reviewer must challenge whether the instructions actually work.
- [ ] Commit the task and its evidence with `fix(docs): make incident mitigation depend on impact and safety` plus the required Co-Authored-By trailer. Stage explicit paths only; leave gathered images untracked.

Before Task 1's commit, add this test to `web/src/lib/stages.test.ts`, run it RED,
then replace only stage 16's blurb with the literal below and run GREEN:

```ts
test('stage 16 leads with limiting harm because restoration can preserve a compromise', () => {
  expect(getStage('16-incident-management')?.blurb).toBe(
    'Limit harm first. Verify recovery. Learn from what happened.',
  )
})
```

Implementation in `stages.ts`:

```ts
blurb: 'Limit harm first. Verify recovery. Learn from what happened.',
```

Run `pnpm test --project unit src/lib/stages.test.ts`. Teeth: restore the old blurb,
confirm only the added test fails, then restore the new one. This is the same task's
second TDD cycle, not permission to change metadata before observing RED. A reviewer
must verify that title, cadence and `ready: false` are unchanged.

### Task 2: Teach escalation, updates, diagnosis and recovery

**Files:** Modify `docs/16-incident-management.md` and `web/src/lib/stage-16-structure.test.ts`.

**Interfaces:** Consumes Task 1 section/text helpers. Owns I4/I5 and completes I2. Establishes Nudge story facts consumed by Task 3.

- [ ] Read this task, the approved spec and the current affected sections. Invoke systematic-debugging before proposing changes: the finding IDs below are hypotheses to confirm against the actual text.
- [ ] Add these tests before editing the teaching. Append to `web/src/lib/stage-16-structure.test.ts`; it consumes `section(heading: string, source?: string): string` and `text(heading: string): string` from Task 1.

```ts
test('I5: escalation continues when the backup is unreachable', () => {
  const s = text('Escalate when help is unavailable')
  for (const phrase of ['acknowledgment deadline', 'backup is unavailable', 'explicitly accepts']) expect(s).toContain(phrase)
})
test('updates promise a next update without guessing a recovery time', () => {
  const s = section('Communicate while the incident is open')
  const updates = [...s.matchAll(/^> (.+)$/gm)].map(m => m[1])
  expect(updates).toHaveLength(4)
  for (const update of updates.slice(0, 3)) expect(update).toMatch(/Next update: \d{2}:\d{2} UTC/)
  expect(updates[0]).toContain('Cause and recovery time are unknown')
  expect(updates[1]).toContain('not yet confirmed')
  expect(updates[3]).toContain('10:40 UTC')
})
test('I4: provider recovery does not authorize replay or incident resolution', () => {
  const s = text('Verify recovery and account for delayed work')
  for (const phrase of ['Reconcile uncertain outcomes before replay', 'new requests alone', 'service-specific observation window']) expect(s).toContain(phrase)
})
test('diagnosis treats early errors as evidence rather than proof', () => {
  expect(text('Diagnose with evidence')).toContain('earliest observed error is not necessarily the cause')
})
```

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture RED. Missing new sections or missing required guidance must cause the failure, not a syntax/import error. Earlier tasks must still pass.
- [ ] Replace the old `### Diagnosing` section with the five sections below, stopping before the old `### Writing it down` heading. Use the complete replacement content below; adjust only if source verification or a reviewer disproves a claim, and record that correction.

````markdown
### Escalate when help is unavailable

Write the escalation path before an incident: primary contact, backup, acknowledgment
deadline, next contact or provider support route, and the conditions for immediate
escalation. Set deadlines appropriate to your service and coverage; a team of two
cannot promise continuous staffed coverage without making arrangements for it.

If the primary does not acknowledge by the agreed deadline, contact the backup. If
the backup is unavailable, use the recorded provider or specialist route and keep
ownership with the current responder. Do not wait through deadlines if harm is
increasing or specialist help is needed now. Send impact, severity, incident link,
actions already taken, observed results and the specific help required. Never include
credentials in the escalation message.

An **Incident commander** owns coordination and decisions during the incident; on a
small incident that may be the sole developer. Keep one timeline and set a reminder
for brief customer updates while you investigate. A handoff is complete when the
receiving responder explicitly accepts ownership, current impact, unknowns and the
next action. Until then, the original responder still owns it.

### Communicate while the incident is open

State observed impact, what you are doing, what is unknown and the next update time.
Use an existing customer channel that stays reachable during the outage. A public
status page is useful, but a support notice or agreed customer channel can meet the
minimum. Keep sensitive investigative details in the restricted incident record.
Update at the promised time even if nothing changed. A next-update time is not a
recovery estimate. Communicate throughout mitigation and investigation.

**Worked example: Nudge**, a fictional appointment-reminder service, uses a worker
and a messaging provider. On 2026-09-29, send timeouts start at 10:00 UTC while the
web UI stays healthy. Ana owns response; backup Bo is unavailable. The pre-agreed
fallback is provider support. Nudge has a tested dispatch pause that preserves
queued jobs. Each reminder has a stable operation ID; the fictional provider exposes
an authoritative result lookup by that ID. These are example-specific capabilities,
not promises made by every provider. Disable retries for uncertain outcomes until
that lookup establishes whether sending already succeeded.

> 10:05 UTC — Investigating: appointment reminders are delayed. We are checking delivery records and the messaging provider. Cause and recovery time are unknown. Next update: 10:15 UTC.

> 10:15 UTC — Update: the provider reports degradation. We have paused dispatch while checking uncertain send results; the provider's role is not yet confirmed. Recovery time remains unknown. Next update: 10:25 UTC.

> 10:25 UTC — Monitoring: the provider reports recovery. Dispatch is resuming only for reconciled eligible reminders; delayed work remains. Recovery time remains unknown. Next update: 10:40 UTC.

> 10:40 UTC — Resolved: checks from 10:30 to 10:40 UTC confirm normal dispatch. The affected reminder set is accounted for: confirmed sends were not repeated, remaining eligible reminders were sent, and expired reminders were marked expired with affected customers notified. Our follow-up review remains open.

The times above are commitments in this fictional incident, not a required cadence.
Internal updates also include the responder, evidence links and help needed. Do not
claim a cause simply because a provider reports a problem at the same time.

### Diagnose with evidence

Before acting, investigate enough to select and check a mitigation. After limiting
impact, continue the deeper investigation. Start with the affected operation,
recent changes, dependency health and the first relevant timestamps in
[15 — Observability](15-observability.md)'s logs and error reports. The earliest observed error is not necessarily the cause;
missing telemetry and clock differences can hide earlier events.

Write a falsifiable hypothesis: “The provider accepted reminders but timed out before
returning acknowledgments.” Compare provider operation results with local reminder
states. A provider result showing accepted delivery supports that hypothesis; an
explicit rejection points elsewhere. Preserve competing explanations until the
evidence separates them. A status page can lag or describe an unrelated region.

Do not change several things at once without recording them. For each change, write
what result would support your hypothesis, what would refute it and when you will
stop. Provider downtime may leave nothing to repair at the provider, but you still
own your application's retries, queued work and customer communication.

### Verify recovery and account for delayed work

Recovery means the affected customer operation meets its agreed criteria, not merely
that a provider turned green. Check error rate, latency and real operation outcomes
against your baseline. For background work, check oldest pending age, completion
rate, failures and the disposition of affected records; new requests alone do not
prove recovery. Use a service-specific observation window long enough to see normal
work complete, and record why that window fits. See
[14 — Post-Deployment Verification](14-post-deployment-verification.md) for checking the actual operation.

Reconcile uncertain outcomes before replay. A timeout does not prove an operation
failed: it might have completed before its acknowledgment was lost. Check the
provider's authoritative result or another reliable record. If the outcome cannot
be established, hold the item for reviewed reconciliation; do not send, charge or
create again merely to test it. Document any remaining limitation to customers.

In Nudge, stable IDs and authoritative lookup allow confirmed sends to be excluded
from replay. The responder resumes only eligible unsent work, marks expired
reminders expired, notifies affected customers and accounts for the whole affected
set. The worked incident observes normal dispatch for ten minutes after that work
is accounted for. Another service must choose its own criteria and observation window.

Record service recovery separately from follow-up closure. Diagnosis, prevention
and provider questions can remain open after impact ends. Keep owners and dates on
that work; never invent a root cause to tick a checkbox.

````

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture GREEN. Format changed TypeScript with `pnpm exec prettier --write src/lib/stage-16-structure.test.ts`.
- [ ] Teeth check: Replace `Reconcile uncertain outcomes before replay` with `Replay uncertain outcomes` only in the recovery section: only I4 must fail. Separately delete `backup is unavailable` from escalation: only I5 must fail. Run the whole new test file, confirm only the corresponding regression test fails, restore immediately, and run it again. Record both outputs.
- [ ] Obtain a fresh read-only per-task review. Require finding IDs, severity and provenance; resolve blockers before continuing. Tests pin prose contracts; the reviewer must challenge whether the instructions actually work.
- [ ] Commit the task and its evidence with `fix(docs): teach incident escalation communication and recovery` plus the required Co-Authored-By trailer. Stage explicit paths only; leave gathered images untracked.

### Task 3: Replace the runbook and postmortem with consistent worked artifacts

**Round-1 review correction (2026-09-29):** The original example below conflated
per-record reconciliation with aggregate impact reporting. The affected records had
dispositions by 10:30 UTC; only the aggregate count awaits attachment. The corrected
source below is authoritative for this task.

**Files:** Modify `docs/16-incident-management.md` and `web/src/lib/stage-16-structure.test.ts`.

**Interfaces:** Consumes Task 2 Nudge timeline (10:00 start, 10:25 monitoring, 10:40 recovered; Ana responding, Bo backup unavailable). Owns M1/M3 and closure consistency.

- [ ] Read this task, the approved spec and the current affected sections. Invoke systematic-debugging before proposing changes: the finding IDs below are hypotheses to confirm against the actual text.
- [ ] Add these tests before editing the teaching. Append to `web/src/lib/stage-16-structure.test.ts`; it consumes `section(heading: string, source?: string): string` and `text(heading: string): string` from Task 1.

```ts
test('M1: copied postmortem actions include accountable completion details', () => {
  const s = section('Write the postmortem and track follow-up')
  const block = s.match(/```markdown\n([\s\S]*?)```/)?.[1]
  expect(block).toBeDefined()
  const actions = [...block!.matchAll(/^\| A\d+ \|(.+)\|$/gm)]
  expect(actions).toHaveLength(3)
  for (const row of actions) {
    const cells = row[1].split('|').map(c => c.trim())
    expect(cells).toHaveLength(4)
    expect(cells[1]).toMatch(/^(Ana|Bo)$/)
    expect(cells[2]).toMatch(/^2026-\d{2}-\d{2}$/)
    expect(cells[3].length).toBeGreaterThan(15)
  }
  expect(block).toContain('10:00–10:40 UTC')
  expect(block).toContain('40 minutes')
})
test('runbook teaches a tested path and a reusable skeleton', () => {
  const s = section('Prepare and rehearse the runbook')
  for (const phrase of ['Last rehearsed', 'Stop conditions', 'Recovery checks', 'SERVICE-SPECIFIC', 'outside the affected application']) expect(s).toContain(phrase)
})
test('I4/M3: recovery and follow-up closure are separate and a status site is optional', () => {
  const s = section('Definition of done')
  expect(s).toContain('Service recovery')
  expect(s).toContain('Follow-up closure')
  expect(section('Artifacts')).toContain('customer communication channel')
  expect(section('Artifacts')).not.toContain('A status page, if')
})
```

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture RED. Missing new sections or missing required guidance must cause the failure, not a syntax/import error. Earlier tasks must still pass.
- [ ] Replace from the old `### Writing it down` through end of document with the content below. This removes the old contradictory traps and unchecked operational commands as part of the same repair. Use the complete replacement content below; adjust only if source verification or a reviewer disproves a claim, and record that correction.

````markdown
### Write the postmortem and track follow-up

A **Postmortem** records impact, response, contributing conditions and changes that
reduce recurrence. Write about the system rather than blaming the responder. Start
while evidence is fresh, ideally the next working day for major or critical incidents.
Keep unanswered questions visible. Separate service recovery from the completion of
investigation and corrective work. Give actions an owner, date and completion check.

This fictional record carries the same Nudge incident as the customer updates:

```markdown
# Nudge incident — delayed appointment reminders, 2026-09-29

Severity: Major
Customer-impact interval: 10:00–10:40 UTC (40 minutes)
Impact: reminders delayed. Affected records reconciled and dispositions complete by 10:30 UTC.
Aggregate affected count: pending attachment from the reconciliation report.
Service: recovered. Follow-up: open.

## Timeline
- 10:00 — Provider send timeouts begin; web UI remains healthy.
- 10:05 — Ana declares the incident and publishes the first update.
- 10:15 — Provider reports degradation; dispatch paused; uncertain results held.
- 10:25 — Provider reports recovery; only reconciled eligible work resumes.
- 10:30 — Affected records accounted for; expired reminders marked and customers notified.
- 10:40 — Ten-minute observation confirms normal dispatch; customer resolution update sent.

## Contributing conditions and unknowns
Provider request timeouts coincided with degradation. Local timeouts could not tell
whether a reminder was accepted. Authoritative operation lookup was required to
avoid duplicate sends. The provider's internal cause remains unknown; Ana owns the
support follow-up. The aggregate count from the completed per-record reconciliation
will be attached to this report.

## Why detection and response were harder
Web uptime stayed green while reminders stalled. The existing monitor did not check
reminder completion age. Bo was unavailable; Ana used the agreed provider escalation
route and kept customer updates on a timer.

## Actions
| ID | Change | Owner | Due | Completion evidence |
|---|---|---|---|---|
| A1 | Alert on reminder completion age | Ana | 2026-10-01 | Withheld test completion triggers an actionable alert |
| A2 | Rehearse timeout reconciliation | Bo | 2026-10-02 | Accepted-but-timed-out fixture is not resent |
| A3 | Close impact totals and provider follow-up | Ana | 2026-10-03 | Reconciliation counts attached; provider answer or documented uncertainty recorded |
```

An unknown provider cause need not keep service marked down. It does keep an
investigation item open until its owner records the evidence and disposition.
Review overdue actions; do not count a ticket's existence as risk reduction.

### Prepare and rehearse the runbook

A **Runbook** is a service-specific procedure tested before it is needed. Keep it
outside the affected application with access available during an outage. Validate
links, permissions and recovery checks during rehearsal and after relevant changes.
A provider dashboard URL is not a complete escalation procedure.

Worked Nudge runbook, with fictional operational facts:

```markdown
# Nudge reminder dispatch
Owner: Ana. Backup: Bo. Last rehearsed: 2026-09-22.
Access: trusted operator account; dispatch pause and read-only delivery lookup.
Location: restricted team operations workspace independent of Nudge.
Evidence: worker completion-age dashboard, delivery ledger and provider status page.

## Trigger and checks
Delayed reminder alert or customer report: inspect completion age and affected IDs.
Web uptime is supporting evidence only. Never send another reminder to test a timeout.

## Safe action
Use the rehearsed dispatch-pause control; it retains accepted queued records.
Look up uncertain operations by stable ID. Exclude accepted sends from resubmission.
Resume only confirmed-unsent, still-eligible records; mark expired ones and notify customers.

## Stop conditions
Lookup unavailable or inconclusive, unexpected new side effects, or rising provider errors:
keep affected records held, retain evidence, contact provider support and update customers.

## Escalation and updates
Primary Ana; backup Bo after the agreed five-minute acknowledgment deadline.
If Bo is unavailable, Ana opens the provider support case and retains ownership.
Escalate immediately for suspected compromise or increasing harm.
Publish impact, unknowns and next-update time; use a timer while responding alone.

## Recovery checks
Account for the affected record set; inspect completion age, errors and delivery results.
Observe normal dispatch for the example's ten-minute window and publish the outcome.
Handoff only after the receiving owner accepts the state and next action.
```

The five-minute acknowledgment and ten-minute observation windows are Nudge policy,
not service-independent targets. Store actual access links and contact details in
its restricted operations workspace. Here is the reusable skeleton for a different service:

```markdown
# SERVICE-SPECIFIC runbook
Service and customer operation:
Owner / backup / acknowledgment deadline / fallback support route:
Last rehearsed / next review:
Independent document location and required trusted access:
Evidence locations and safe impact check:
Action prerequisites and operator procedure:
Stop conditions and reversal limits:
Handling for queued work and uncertain external side effects:
Recovery checks and observation window with rationale:
Customer channel, next-update commitment and incident record:
Receiving owner and handoff acceptance:
```

Fill each field for the real service and rehearse it. For deploy-related incidents,
attach the tested Vercel or AWS procedure from [13](13-production-deployment.md)
and its schema constraints. This chapter supplies the decision framework; it does
not invent a universal database restart, query-kill or queue-replay command.

---

## Artifacts

- A rehearsed runbook with safe action conditions, evidence links and escalation
- An incident record and customer communication channel reachable during the outage
- A postmortem for major and critical incidents
- Follow-up actions with owners, dates and completion evidence

---

## Definition of done

**Service recovery**

- [ ] The affected customer operation meets the service's recovery criteria
- [ ] Delayed work and uncertain side effects are accounted for; limitations disclosed
- [ ] Stability was observed for the documented service-specific window
- [ ] Affected users received the recovery update

**Follow-up closure**

- [ ] Evidence supports the explanation; unresolved questions have owners and dispositions
- [ ] Permanent corrections are verified, or remaining risk has an explicit owner and decision
- [ ] Major/critical postmortem includes detection gaps and a consistent impact timeline
- [ ] Actions have owners, dates and completion evidence; overdue work is reviewed
- [ ] Runbook and rehearsal reflect what the incident taught

---

## Scaling to a team

Assign coordination, technical work and communication explicitly; one responder can
hold several roles until help arrives. Keep one incident channel and record. A handoff
requires acceptance, not merely a message sent. Agree coverage and escalation with
backups before promising on-call availability. Review actions and repeat incidents
regularly; compare recovery intervals defined consistently rather than mixing time
to restore service with time to finish every follow-up.

---

## Traps

**Waiting for a full explanation before limiting harm.** Investigate enough to choose
and validate mitigation; deeper analysis continues after impact falls.

**Rolling back an unrelated change.** Check relevance and schema compatibility first.

**Calling the provider green while your customers remain blocked.** Verify your own
operation and account for queued or uncertain work.

**Treating the first observed error as proof.** Test the hypothesis against other evidence.

**Replaying timeouts blindly.** An operation may have succeeded before its reply was lost.

**Restoring availability during ongoing compromise.** Contain access and involve the
responsible security responder; uptime alone does not establish safety.

**Letting updates stop when you are alone.** Name the next-update time and set a reminder.

**Copying contacts without an escalation procedure.** Include deadlines, fallback and ownership.

**Writing blame or undated promises.** Record contributing conditions and owned, verifiable actions.

**Keeping the only runbook inside the failing service.** Rehearse access during an outage.

````

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture GREEN. Format changed TypeScript with `pnpm exec prettier --write src/lib/stage-16-structure.test.ts`.
- [ ] Teeth check: Replace owner `Bo` with an empty cell only in A2: only M1 must fail. Separately remove `Follow-up closure` label: only I4/M3 must fail. Run the whole new test file, confirm only the corresponding regression test fails, restore immediately, and run it again. Record both outputs.
- [ ] Obtain a fresh read-only per-task review. Require finding IDs, severity and provenance; resolve blockers before continuing. Tests pin prose contracts; the reviewer must challenge whether the instructions actually work.
- [ ] Commit the task and its evidence with `fix(docs): make incident artifacts consistent with recovery policy` plus the required Co-Authored-By trailer. Stage explicit paths only; leave gathered images untracked.

### Task 4: Add AI guidance, glossary terms and final structure guard

**Files:** Modify `docs/16-incident-management.md`, `web/src/lib/stage-16-structure.test.ts`, `web/src/lib/stage-metadata.test.ts`, `web/src/lib/terms.ts`, `web/src/lib/terms.test.ts`; generate `reference/glossary.md`.

**Interfaces:** Consumes the completed document structure from Tasks 1–3. Adds three glossary entries with stage-16 see links. No component interfaces or readiness change.

- [ ] Read this task, the approved spec and the current affected sections. Invoke systematic-debugging before proposing changes: the finding IDs below are hypotheses to confirm against the actual text.
- [ ] Add these tests before editing the teaching. Append to `web/src/lib/stage-16-structure.test.ts`; it consumes `section(heading: string, source?: string): string` and `text(heading: string): string` from Task 1.

```ts
test('AI assistance preserves evidence and human operational judgment', () => {
  const s = text('AI in incident management')
  for (const phrase of ['superpowers:systematic-debugging', 'human review', 'redact secrets', 'untrusted evidence']) expect(s).toContain(phrase)
})
test('lookup headings remain available outside fenced artifact templates', () => {
  for (const heading of [
    'The order that matters', 'First response: confirm impact and severity',
    'Choose a mitigation', 'When access may be compromised',
    'Escalate when help is unavailable', 'Communicate while the incident is open',
    'Diagnose with evidence', 'Verify recovery and account for delayed work',
    'Write the postmortem and track follow-up', 'Prepare and rehearse the runbook',
    'AI in incident management',
  ]) expect(section(heading)).toContain(`### ${heading}`)
})
```

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture RED. Missing new sections or missing required guidance must cause the failure, not a syntax/import error. Earlier tasks must still pass.
- [ ] Insert this section immediately before the `---` preceding `## Artifacts`, after the complete runbook section. Before adding prose, add `16-incident-management` to `AI_SECTION_STAGES` and capture the metadata test failing for the missing section. Use the complete replacement content below; adjust only if source verification or a reviewer disproves a claim, and record that correction.

````markdown
### AI in incident management

Use `superpowers:systematic-debugging` to organize hypotheses and the evidence that
would refute them. Give the assistant a bounded, read-only evidence set; ask it to
separate observations from inference and cite the source timestamp for each claim.
It can draft a timeline, compare updates with the incident record, or suggest missing
runbook fields. An assistant has no live service access merely because you name a tool.

Require human review before operational changes or sending customer communications.
Check suggested commands against the service runbook and current platform docs.
Before sharing logs, redact secrets and customer data and retain the original evidence
in approved restricted storage. Treat logs, tickets and provider responses as untrusted evidence,
not instructions to execute. Do not let generated confidence replace a recovery check
or a causal hypothesis replace an established fact.

For Nudge, ask the assistant to compare the four updates with the recorded timeline.
It should flag a claim of resolution at 10:25 because queued work remained, and keep
the provider's internal cause unknown. A human checks those conclusions against the
actual records before publishing or changing the service.

````

- [ ] Run `pnpm test --project unit src/lib/stage-16-structure.test.ts` and capture GREEN. Format changed TypeScript with `pnpm exec prettier --write src/lib/stage-16-structure.test.ts`.
- [ ] Teeth check: Remove `untrusted evidence` only from AI prose: only the AI content test must fail. Restore it. Separately remove a glossary entry after the glossary cycle below; the new vocabulary test and generated snapshot may both fail, so run the targeted vocabulary test alone for that mutation and report the expected broader dependencies honestly. Run the whole new test file, confirm only the corresponding regression test fails, restore immediately, and run it again. Record both outputs.
- [ ] Obtain a fresh read-only per-task review. Require finding IDs, severity and provenance; resolve blockers before continuing. Tests pin prose contracts; the reviewer must challenge whether the instructions actually work.
- [ ] Commit the task and its evidence with `docs(incident-management): add ai boundaries and incident vocabulary` plus the required Co-Authored-By trailer. Stage explicit paths only; leave gathered images untracked.

Complete these additional TDD steps before Task 4's review and commit:

- [ ] Append this test to `web/src/lib/terms.test.ts`, run it RED with
  `pnpm test --project unit src/lib/terms.test.ts -t 'incident vocabulary'`:

```ts
test('incident vocabulary resolves to the stage that teaches each artifact', () => {
  for (const [id, name] of [
    ['incident-commander', 'Incident commander'],
    ['postmortem', 'Postmortem'],
    ['runbook', 'Runbook'],
  ]) {
    expect(TERMS[id]?.name).toBe(name)
    expect(TERMS[id]?.see).toBe('16-incident-management')
  }
})
```

- [ ] Add these entries inside `TERMS` in `web/src/lib/terms.ts`:

```ts
'incident-commander': {
  name: 'Incident commander',
  short: 'The person accountable for coordinating an incident response.',
  full: 'Keeps ownership, decisions, communication and handoffs clear while responders limit impact. A solo developer can hold this role alongside technical work.',
  soWhat: 'Someone still owns the response when a backup does not answer.',
  see: '16-incident-management',
},
postmortem: {
  name: 'Postmortem',
  short: 'An evidence-based record of an incident and what changes afterward.',
  full: 'Records customer impact, the response timeline, contributing conditions, detection gaps and follow-up actions with owners and dates. Unknowns remain explicit rather than becoming blame or invented certainty.',
  soWhat: 'Recovery ends the immediate impact; tracked actions address recurrence.',
  see: '16-incident-management',
},
runbook: {
  name: 'Runbook',
  short: 'A rehearsed procedure for operating or recovering a specific service.',
  full: 'Names the required access, evidence, safe actions, stop conditions, escalation path and recovery checks. It stays accessible when the affected application is down.',
  soWhat: 'A contact list or untested command is not enough during an incident.',
  see: '16-incident-management',
},
```

- [ ] Run `pnpm gen:glossary`, inspect the generated diff, and run
  `pnpm test --project unit src/lib/stage-16-structure.test.ts src/lib/stage-metadata.test.ts src/lib/terms.test.ts src/lib/term-usage.test.ts src/lib/glossary.test.ts`.
  The doc already spells the three display names in Tasks 2–3; add no known-orphan exemption.
- [ ] Record the missing-AI RED run using
  `pnpm test --project unit src/lib/stage-metadata.test.ts` before prose addition and
  its GREEN after. The AI slug is added exactly once. Do not derive this list from readiness.
- [ ] Check the eleven work headings occur in the spec's order by reading outside
  fenced blocks; the presence guard above is intentionally not claimed to prove order.

### Task 5: Reassess, fix new findings, verify and record the round

**Files:** `docs/superpowers/specs/2026-09-29-stage-16-cold-reader-findings.md`,
`docs/superpowers/plans/2026-09-29-stage-16-doc-round-evidence.md`, `docs/task.md`,
`docs/tracker.md`, `KICKOFF.md`, `reference/cheatsheet-sources.md`; any targeted correction
must name its affected doc/test files in the evidence before editing.

**Interfaces:** Consumes the completed document and all regression guards. Produces
an audited findings disposition and fresh verification evidence. Does not register the port.

- [ ] Apply humanizer to the finished prose without erasing deliberate technical distinctions.
- [ ] Use two fresh read-only agents with no conversation history. Both may read only
  `docs/16-incident-management.md`, no web, linked stages or plan. Dispatch the following
  complete prompts; preserve their raw returned findings in the evidence file.

Completeness prompt:

> Read only docs/16-incident-management.md. Use expertise to judge, never silently fill
> gaps. Scenario: Parcel, a two-developer Node/Express parcel-label API on AWS ECS with
> Postgres and a background worker calling a carrier API. At 09:00 label jobs stall and
> customers retry; web health stays green. No deploy today. At 09:08 carrier status shows
> degradation; one developer is unreachable. At 09:20 the carrier recovers but the backlog
> remains and duplicate-label outcomes are uncertain. Produce first-response actions,
> severity and escalation decisions, incident updates, a service-specific runbook skeleton,
> recovery criteria and postmortem actions using only the document. Mark unknown facts
> unknown. Report blockers, contradictions and boundaries with severity and exact headings.

Consultability prompt:

> Read only docs/16-incident-management.md. First extract real headings outside code
> fences and predict where the following answers belong before reading the body:
> 1. The worker is failing but the homepage is healthy; how do I confirm customer impact?
> 2. My only teammate is unavailable; when and how do I escalate?
> 3. A provider recovered but queued jobs remain; when can I declare recovery?
> 4. What do I tell customers when I do not know the cause or recovery time?
> 5. A credential may be compromised; should I restore service or contain access first?
> Then read the body and score HIT/MISFILED/MISS separately from answer completeness.
> Assess junior-developer and small-team fit, contradictions and untaught artifact/DoD
> requirements. Do not infer linked stages. Report evidence by heading and separate
> scope boundaries from defects.

- [ ] Compare results against baseline I1–I6/M1–M3. Append a dated table to the findings
  with columns ID, closed/partial/open/boundary, evidence heading, reviewer rationale.
  Do not mark a finding closed solely because its structural test passed.
- [ ] Reserve a fix wave for new or partial findings. Before editing, invoke systematic-debugging,
  reproduce the defect, write the failing regression, and record the smallest corrected
  content and test as Task 5a, 5b, etc. in this plan. Do not invent future findings now.
  Run RED/GREEN/teeth and independent review, then repeat the same cold-reader instruments
  on the corrected document. A failing rerun does not mean the round is finished.
- [ ] Read one additional primary source after the plan, as an external check on its
  assumptions: [PagerDuty incident command](https://response.pagerduty.com/during/incident_command/).
  Verify applicability to a solo team; list adopted corrections or reasons no change is
  needed. If unavailable, use Google's linked incident-response chapter and record the
  limitation rather than pretending it is a new source.
- [ ] Run verification below. Capture raw results and distinguish full gate from targeted
  checks. Do not execute rollback, query termination, credential revocation or replay on
  real infrastructure. The new document removes executable incident command blocks and
  links platform procedures instead; state that operational behavior was not executed.
- [ ] Request a fresh whole-branch review from baseline `91a6838` through branch tip,
  including spec, plan, prose, tests and generated glossary. Supply finding IDs and gate
  evidence, but require the reviewer to disprove claims as well as confirm them. Resolve
  Important/Critical findings with the same regression/review loop.
- [ ] Update task/tracker/KICKOFF with actual SHAs and results, stating document round
  complete only after the above succeeds. W-3 remains 12/18 and stage 16 unready.
  Record Deferred: interactive port, W-6, images lacking provenance, production promotion,
  and the cross-stage rollback wording described below. Commit records separately with
  `docs(tracker): record stage 16 document repair evidence` and the required trailer.
- [ ] Invoke finishing-a-development-branch. Ask before any merge; no main push or merge.

## Verification (after all tasks)

From `web/`, run each separately and stop to investigate failures:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:dev-console
```

The production audit and dev-console check require their own configured servers;
read `playwright.config.ts` and `playwright.dev.ts` before starting them. Do not stop
user-owned servers. Use fresh browser contexts and report which build each result covers.
Inspect stage 16's visible blurb at 320px and a desktop width in both themes, and any
new glossary presentation; ensure no overflow. The existing audit covers the wider
responsive/contrast sweep. No component change is planned, so no new render test is
needed unless implementation introduces conditional rendering or assembled labels.

From repository root:

```bash
git diff --check
git status --short --branch
git diff --stat 91a6838..HEAD
```

Check all new local links and confirm no component/step registration or `ready` flip.
Stage glossary changes only after `pnpm gen:glossary`; never edit its generated file.
No production smoke test: nothing has been promoted to main.

## Requirement trace and self-review

| Requirement | Task |
|---|---|
| I1 security exception | 1 |
| I2 bounded investigation | 1, 2 |
| I3 customer-operation impact / M2 uncertain severity | 1 |
| I4 recovery, delayed outcomes and closure | 2, 3 |
| I5 escalation and handoff | 2 |
| I6 irrelevant/incompatible rollback and summary | 1 |
| M1 action ownership / M3 channel requirement | 3 |
| Worked incident, runbook and held-out assessment | 2, 3, 5 |
| AI section, glossary, generation | 4 |
| Primary sources, reruns, fix wave, evidence, final review | 5 |

Self-review must confirm the task code compiles, fixtures contain the intended words,
all section dependencies are defined, timeline arithmetic is consistent, and table
parsing reads the fenced example. Planning validation is not execution evidence.

**Cross-stage finding:** Stage 13's Vercel section still says rollback first, diagnosis
second. This round limits its cross-reference with explicit suitability checks; changing
stage 13 and its interactive counterpart needs a separate reviewed slice. Record this
follow-up rather than silently claiming the entire playbook now uses the same wording.

Planning checks completed on 2026-09-29: five tasks and four complete prose blocks
were counted mechanically. The proposed document test code transpiled without syntax
diagnostics; fourteen assertions passed against assembled proposed prose in a scratch
Node assertion harness. This was not Vitest, typechecking, a repository test run, or
RED/GREEN evidence. Metadata and glossary cycles remain for execution. The humanizer
pass kept the examples concrete and removed unnecessary process language.

The post-plan PagerDuty source fetch was attempted and was inaccessible through the
web tool. Its content was not used to justify the plan. The previously checked Google
chapter supplies the coordination baseline; Task 5 retains the external-check step.

**Execution recommendation:** Subagent-driven, sequential tasks with independent per-task
reviews. The shared document prevents parallel implementation; fresh reviewers are useful
because an apparently harmless prose change can contradict a later recovery example.
Inline execution is also possible, preserving this repository's per-task review rule.
