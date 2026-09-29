# Stage 16 document repair — Task 1 evidence

Date: 2026-09-29
Task: Make first response conditional and safe
Status: Implemented; awaiting controller's independent review.

## Scope

Changed the opening response guidance in `docs/16-incident-management.md`: first response now confirms customer impact and provisional severity; mitigation choices state preconditions, harms, stop conditions and checks; rollback requires relevance and schema compatibility; suspected compromise has a containment and escalation path. The opening quote and stage 16 blurb now read “Limit harm first. Verify recovery. Learn from what happened.” Stage title, cadence, group, timing and `ready: false` remain unchanged.

Added `web/src/lib/stage-16-structure.test.ts` to guard these prose contracts using the specified fence-aware section helper. Added the summary blurb contract in `web/src/lib/stages.test.ts`.

## Test evidence

RED, prose contracts, before document edit: `pnpm test --project unit src/lib/stage-16-structure.test.ts` failed with 4 failed / 1 passed. The missing first response, mitigation and compromise sections failed by assertion; the existing order section lacked the safe-mitigation instruction. The section helper test passed, so this was a content failure rather than syntax/import trouble.

RED, summary metadata, before changing `stages.ts`: `pnpm test --project unit src/lib/stages.test.ts` failed only the new stage 16 blurb test (1 failed / 13 passed), with the expected old blurb received.

GREEN after prose edit: `pnpm test --project unit src/lib/stage-16-structure.test.ts` — 1 file passed, 5 tests passed.

GREEN after metadata edit: `pnpm test --project unit src/lib/stages.test.ts` — 1 file passed, 14 tests passed.

Final restored verification repeated both focused commands: 5/5 and 14/14 passed. Full suite intentionally not run; baseline was 1351/179 passes and the controller requested focused suites only for this task.

## Teeth checks

- Mutated the rollback row from `schema compatibility checked` to `schema unexamined`. The structure test file reported exactly 1 failed / 4 passed, and only I6 failed because `schema compatibility` was absent. Restored immediately.
- Removed the urgent-containment clause from the compromise section. The structure test file reported exactly 1 failed / 4 passed, and only I1 failed because `without delaying urgent containment` was absent. Restored immediately.
- Restored the old stage 16 blurb. The stages test file reported exactly 1 failed / 13 passed, only the newly added blurb contract. Restored immediately.

Full terminal output and the raw failure excerpts are in `.superpowers/sdd/2026-09-29-stage-16-doc-round/task-1-report.md`.

## Review and deferred work

The user-directed controller will perform the independent read-only review after this immutable task commit. The later existing document sections remain for their owning tasks; in particular, the old Traps section still calls rollback the correct first move. That contradiction is outside Task 1's replacement boundary and must be reconciled by its owner before the document round is complete.

Deferred: escalation contacts and communication examples; diagnosis guidance; recovery and delayed-work criteria; runbook, worked incident and postmortem; AI section; remaining finding IDs and whole-document assessment. No interactive port, generated imagery, or stage readiness change.

## Original captured test output excerpts

The blocks below preserve exact relevant lines from the original tool-captured terminal results. They are excerpts from those outputs: Vitest's long source lines are omitted, and any `…` shown inside Vitest's own `expected` display is Vitest's literal truncation marker. No failed test was rerun to recreate its RED or mutation result.

### RED: prose contracts

Command: `pnpm test --project unit src/lib/stage-16-structure.test.ts`

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-16-structure.test.ts (5 tests | 4 failed) 9ms
   × I2: mitigation permits the investigation needed to choose an action 5ms
   × I3/M2: impact follows the customer operation even with green web health 1ms
   × I6: rollback suitability includes relevance and compatibility 0ms
   × I1: suspected compromise has a containment path 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-16-structure.test.ts > I2: mitigation permits the investigation needed to choose an action
AssertionError: expected '### The order that matters **Mitigate…' to contain 'Investigate enough to choose a safe m…'

Expected: "Investigate enough to choose a safe mitigation"
Received: "### The order that matters **Mitigate → Diagnose → Fix → Prevent.** The instinct is to find the cause first, because understanding feels like progress and reverting feels like giving up. Resist it. Every minute spent diagnosing is a minute users stay broken, and diagnosis is far easier once the pressure is off. "

 FAIL  |unit| src/lib/stage-16-structure.test.ts > I3/M2: impact follows the customer operation even with green web health
Error: Missing section: First response: confirm impact and severity

 FAIL  |unit| src/lib/stage-16-structure.test.ts > I6: rollback suitability includes relevance and compatibility
Error: Missing section: Choose a mitigation

 FAIL  |unit| src/lib/stage-16-structure.test.ts > I1: suspected compromise has a containment path
Error: Missing section: When access may be compromised

 Test Files  1 failed (1)
      Tests  4 failed | 1 passed (5)
   Start at  14:14:21
   Duration  138ms (transform 20ms, setup 0ms, import 28ms, tests 9ms, environment 0ms)
```

This is the expected RED: the helper test passed, and the four content contracts failed because the old teaching lacked the requested sections/instruction.

### RED: stage summary

Command: `pnpm test --project unit src/lib/stages.test.ts`

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stages.test.ts (14 tests | 1 failed) 190ms
   × stage 16 leads with limiting harm because restoration can preserve a compromise 144ms

 FAIL  |unit| src/lib/stages.test.ts > stage 16 leads with limiting harm because restoration can preserve a compromise
AssertionError: expected 'Restore service first. Understand it …' to be 'Limit harm first. Verify recovery. Le…' // Object.is equality

Expected: "Limit harm first. Verify recovery. Learn from what happened."
Received: "Restore service first. Understand it second. Prevent it third."

 Test Files  1 failed (1)
      Tests  1 failed | 13 passed (14)
   Start at  14:14:25
   Duration  1.23s (transform 683ms, setup 0ms, import 927ms, tests 190ms, environment 0ms)
```

### GREEN: prose and metadata

Prose command: `pnpm test --project unit src/lib/stage-16-structure.test.ts`

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  14:15:20
   Duration  119ms (transform 20ms, setup 0ms, import 28ms, tests 3ms, environment 0ms)
```

Metadata command: `pnpm test --project unit src/lib/stages.test.ts`

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  14:15:25
   Duration  853ms (transform 567ms, setup 0ms, import 766ms, tests 4ms, environment 0ms)
```

### Teeth: rollback schema mutation

Mutation changed only the rollback row from `schema compatibility checked` to `schema unexamined`. Command: `pnpm test --project unit src/lib/stage-16-structure.test.ts`.

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-16-structure.test.ts (5 tests | 1 failed) 9ms
   × I6: rollback suitability includes relevance and compatibility 6ms

 FAIL  |unit| src/lib/stage-16-structure.test.ts > I6: rollback suitability includes relevance and compatibility
AssertionError: expected '### Choose a mitigation\n\nChoose by …' to contain 'schema compatibility'

- Expected
+ Received

- schema compatibility
+ ### Choose a mitigation
+
+ Choose by evidence and likely harm, not a fixed list of commands. Record the action,
+ operator, time and observed effect. Stop or reverse a harmful action where safe.
+
+ | Option | Preconditions | Possible harm / Stop condition | Check effect |
+ |---|---|---|---|
+ | Rollback | Relevant recent change; known-good target; schema unexamined | Old code may not read current data; stop if incompatible or impact grows | Affected operation succeeds and errors fall |

      Tests  1 failed | 4 passed (5)
   Start at  14:15:44
   Duration  122ms (transform 14ms, setup 0ms, import 21ms, tests 9ms, environment 0ms)
```

### Teeth: urgent containment mutation

The mutation removed the required `without delaying urgent containment` meaning. Command: `pnpm test --project unit src/lib/stage-16-structure.test.ts`.

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-16-structure.test.ts (5 tests | 1 failed) 7ms
   × I1: suspected compromise has a containment path 4ms

 FAIL  |unit| src/lib/stage-16-structure.test.ts > I1: suspected compromise has a containment path
AssertionError: expected '### When access may be compromised Co…' to contain 'without delaying urgent containment'

Expected: "without delaying urgent containment"
Received: "### When access may be compromised Contain unauthorized access using the service's security response procedure and trusted administrative access. Capture available logs and action timestamps, but not urgent containment. Restrict access to evidence; do not paste credentials or customer data into public incident channels. Escalate to the security contact or provider support with the affected resource, observed behavior and actions taken. For example, a leaked deployment credential needs access containment and review of what it could change. Rolling the app back alone does not revoke that credential. Availability alone does not establish safety. Reopen access only after the responsible responder has checked containment and recovery; involve specialist help when the scope cannot be established. Detailed forensic work and notification obligations belong to the security response process, not a generic availability checklist. "

      Tests  1 failed | 4 passed (5)
   Start at  14:15:51
   Duration  106ms (transform 13ms, setup 0ms, import 19ms, tests 7ms, environment 0ms)
```

### Teeth: metadata blurb mutation

The old stage 16 blurb was restored temporarily. Command: `pnpm test --project unit src/lib/stages.test.ts`.

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stages.test.ts (14 tests | 1 failed) 7ms
   × stage 16 leads with limiting harm because restoration can preserve a compromise 3ms

 FAIL  |unit| src/lib/stages.test.ts > stage 16 leads with limiting harm because restoration can preserve a compromise
AssertionError: expected 'Restore service first. Understand it …' to be 'Limit harm first. Verify recovery. Le…' // Object.is equality

Expected: "Limit harm first. Verify recovery. Learn from what happened."
Received: "Restore service first. Understand it second. Prevent it third."

 Test Files  1 failed (1)
      Tests  1 failed | 13 passed (14)
   Start at  14:15:59
   Duration  907ms (transform 613ms, setup 0ms, import 815ms, tests 7ms, environment 0ms)
```

### Final focused rerun after restoring mutations

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  14:16:11
   Duration  119ms (transform 26ms, setup 0ms, import 34ms, tests 3ms, environment 0ms)
```

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  14:16:12
   Duration  1.02s (transform 701ms, setup 0ms, import 929ms, tests 5ms, environment 0ms)
```

## Corrections to initial report

- Task 1 commit is `0f32ffa`.
- The gathered reference images were already committed before this task and were left untouched; no image files were untracked by Task 1.
- `.superpowers/sdd/.../task-1-report.md` is ignored scratch reporting by repository policy; this durable evidence file is the committed record.

## Task 2: escalation, communication, diagnosis and recovery
Date: 2026-09-29. The new tests were written before the document edit. The original diagnosis text delayed all investigation until service restoration, identified the first logged error as closest to cause, and omitted escalation, timed updates and delayed-work reconciliation. Four new guards failed for the right reason: their sections were absent; five prior guards passed.
The approved replacement adds a backup-unavailable escalation route, four Nudge updates, falsifiable diagnosis, and service-specific recovery with reconciliation before replay. The fictional provider lookup and stable operation IDs are stated as example-specific capabilities. The humanizer pass found the concrete operational prose suitable as written. The old Traps contradiction remains assigned to Task 3.
Focused command for every run: `pnpm test --project unit src/lib/stage-16-structure.test.ts` from `web/`. The raw captured output is preserved verbatim in `.superpowers/sdd/2026-09-29-stage-16-doc-round/task-2-report.md`. Exact result lines from those files follow:

### RED

```text
 ❯ |unit| src/lib/stage-16-structure.test.ts (9 tests | 4 failed) 6ms
   × I5: escalation continues when the backup is unreachable 2ms
   × updates promise a next update without guessing a recovery time 0ms
   × I4: provider recovery does not authorize replay or incident resolution 0ms
   × diagnosis treats early errors as evidence rather than proof 1ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I5: escalation continues when the backup is unreachable
Error: Missing section: Escalate when help is unavailable
 FAIL  |unit| src/lib/stage-16-structure.test.ts > updates promise a next update without guessing a recovery time
Error: Missing section: Communicate while the incident is open
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I4: provider recovery does not authorize replay or incident resolution
Error: Missing section: Verify recovery and account for delayed work
 FAIL  |unit| src/lib/stage-16-structure.test.ts > diagnosis treats early errors as evidence rather than proof
Error: Missing section: Diagnose with evidence
 Test Files  1 failed (1)
      Tests  4 failed | 5 passed (9)
```

### GREEN

```text
 Test Files  1 passed (1)
      Tests  9 passed (9)
```

### Teeth I4

```text
 ❯ |unit| src/lib/stage-16-structure.test.ts (9 tests | 1 failed) 9ms
   × I4: provider recovery does not authorize replay or incident resolution 5ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I4: provider recovery does not authorize replay or incident resolution
AssertionError: expected '### Verify recovery and account for d…' to contain 'Reconcile uncertain outcomes before r…'
 Test Files  1 failed (1)
      Tests  1 failed | 8 passed (9)
```

### Teeth I5

```text
 ❯ |unit| src/lib/stage-16-structure.test.ts (9 tests | 1 failed) 9ms
   × I5: escalation continues when the backup is unreachable 5ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I5: escalation continues when the backup is unreachable
AssertionError: expected '### Escalate when help is unavailable…' to contain 'backup is unavailable'
 Test Files  1 failed (1)
      Tests  1 failed | 8 passed (9)
```

### Final restored

```text
 Test Files  1 passed (1)
      Tests  9 passed (9)
```

The I4 mutation replaced only `Reconcile uncertain outcomes before replay` with `Replay uncertain outcomes`; only I4 failed. The I5 mutation changed only `backup is unavailable` to `backup cannot respond`; only I5 failed. Both were restored and the focused file passed 9/9. Independent read-only per-task review follows this commit under the controller. Full gates remain for the completed document round.

## Task 3: worked postmortem, rehearsed runbook and closure criteria

Date: 2026-09-29. Confirmed M1 and M3 against the old document: the copied postmortem had no accountable action table, the runbook offered unverified commands and a contact list, and the done checklist required root cause and permanent repair before incident closure. The old Traps section also declared rollback the correct first move for an unclear problem, contradicting the repaired mitigation table. The section from “Writing it down” to document end was replaced with the approved Nudge artifacts and criteria. No executable operational command remains in this section.

The three new guards failed for the expected content reasons while nine prior guards passed. The postmortem now uses the same 10:00–10:40 UTC incident interval as the customer updates, records service recovered with follow-up open, and supplies three owned, dated actions with completion evidence. The runbook names safe action, stop conditions, escalation fallback, independent storage and recovery checks, then supplies a reusable skeleton. Service recovery and follow-up closure have separate checklists; customer communication can use an existing channel. Humanizer review found the worked details, explicit unknowns and operational language concrete; no change to the approved wording was warranted.

Focused command for every run: `pnpm test --project unit src/lib/stage-16-structure.test.ts` from `web/`. The blocks below are exact raw terminal output captured at each run. Teeth mutations were restored immediately. Independent per-task review will be performed by the controller after this task commit. Full gates belong to the completed round.

### RED before document edit

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (12 tests | 3 failed) 12ms
   × M1: copied postmortem actions include accountable completion details 3ms
   × runbook teaches a tested path and a reusable skeleton 1ms
   × I4/M3: recovery and follow-up closure are separate and a status site is optional 3ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > M1: copied postmortem actions include accountable completion details
Error: Missing section: Write the postmortem and track follow-up
 FAIL  |unit| src/lib/stage-16-structure.test.ts > runbook teaches a tested path and a reusable skeleton
Error: Missing section: Prepare and rehearse the runbook
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I4/M3: recovery and follow-up closure are separate and a status site is optional
AssertionError: expected '## Definition of done\n\nPer incident…' to contain 'Service recovery'
 Test Files  1 failed (1)
      Tests  3 failed | 9 passed (12)
```

### GREEN after replacement

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  12 passed (12)
```

### Teeth M1: blank A2 owner

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (12 tests | 1 failed) 9ms
   × M1: copied postmortem actions include accountable completion details 3ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > M1: copied postmortem actions include accountable completion details
AssertionError: expected '' to match /^(Ana|Bo)$/
 Test Files  1 failed (1)
      Tests  1 failed | 11 passed (12)
```

### Teeth I4/M3: removed closure label

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (12 tests | 1 failed) 9ms
   × I4/M3: recovery and follow-up closure are separate and a status site is optional 4ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I4/M3: recovery and follow-up closure are separate and a status site is optional
AssertionError: expected '## Definition of done\n\n**Service re…' to contain 'Follow-up closure'
 Test Files  1 failed (1)
      Tests  1 failed | 11 passed (12)
```

### Final restored run

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  12 passed (12)
```

Deferred: AI guidance, cold-reader reruns, whole-branch review, full gate and interactive port remain in later tasks.

## Task 3 round-1 review fix: operational disposition versus aggregate reporting

I1 (blocking, PLAN-AUTHORED ERROR): The copied postmortem said the exact affected count remained “under reconciliation” even though its timeline and customer update said all affected records were accounted for at 10:30 UTC. The fix states that per-record dispositions were complete by 10:30 and the aggregate count awaits attachment, with no invented number. The unknowns paragraph and Task 3 plan source now make the same distinction. The humanizer pass found these concrete terms clearer than the old ambiguous sentence.

The scoped fenced-postmortem test failed for the expected impact-line mismatch; all twelve prior tests passed. GREEN passed 13/13. Changing only the new impact line back to ongoing reconciliation caused only I1 to fail, and the line was restored. The focused command for every run was `pnpm test --project unit src/lib/stage-16-structure.test.ts` from `web/`.

### RED before correction

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (13 tests | 1 failed) 16ms
   × I1: postmortem distinguishes completed dispositions from pending aggregate impact totals 10ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I1: postmortem distinguishes completed dispositions from pending aggregate impact totals
AssertionError: expected '# Nudge incident — delayed appointmen…' to contain 'Impact: reminders delayed. Affected r…'
 Test Files  1 failed (1)
      Tests  1 failed | 12 passed (13)
```

### GREEN after correction

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  13 passed (13)
```

### Teeth: restored contradiction

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (13 tests | 1 failed) 17ms
   × I1: postmortem distinguishes completed dispositions from pending aggregate impact totals 8ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > I1: postmortem distinguishes completed dispositions from pending aggregate impact totals
AssertionError: expected '# Nudge incident — delayed appointmen…' to contain 'Impact: reminders delayed. Affected r…'
 Test Files  1 failed (1)
      Tests  1 failed | 12 passed (13)
```

### Final restored

Exact relevant lines from original captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  13 passed (13)
```

## Task 4: AI boundaries, incident vocabulary and structure guard

Date: 2026-09-29. Structure and metadata tests failed for the missing AI section (13 prior structure checks and 30 prior metadata checks passed). Vocabulary failed for the missing Incident commander entry. The approved AI guidance and three Stage 16 terms made the focused suite green. AI and glossary teeth mutations were restored immediately. The generated glossary diff adds only Incident commander, Postmortem and Runbook. The eleven outer work headings were read outside fenced templates in the spec order. Humanizer pass found the concrete approved wording suitable without revision. No operational command was added. Per-task review follows under the controller. Full round gates remain later.

### Structure RED

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (15 tests | 2 failed) 9ms
   × AI assistance preserves evidence and human operational judgment 2ms
   × lookup headings remain available outside fenced artifact templates 2ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > AI assistance preserves evidence and human operational judgment
Error: Missing section: AI in incident management
 FAIL  |unit| src/lib/stage-16-structure.test.ts > lookup headings remain available outside fenced artifact templates
Error: Missing section: AI in incident management
 Test Files  1 failed (1)
      Tests  2 failed | 13 passed (15)
```

### AI metadata RED

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-metadata.test.ts (31 tests | 1 failed) 15ms
   × 16-incident-management: the doc carries an AI plays section 3ms
 FAIL  |unit| src/lib/stage-metadata.test.ts > 16-incident-management: the doc carries an AI plays section
AssertionError: 16-incident-management has no "### AI in ..." subsection: expected '# 16. Incident Management\n\n> Limit …' to match /^### AI in .+$/m
 Test Files  1 failed (1)
      Tests  1 failed | 30 passed (31)
```

### Vocabulary RED

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/terms.test.ts (15 tests | 1 failed | 14 skipped) 4ms
   × incident vocabulary resolves to the stage that teaches each artifact 3ms
 FAIL  |unit| src/lib/terms.test.ts > incident vocabulary resolves to the stage that teaches each artifact
AssertionError: expected undefined to be 'Incident commander' // Object.is equality
 Test Files  1 failed (1)
      Tests  1 failed | 14 skipped (15)
```

### Structure GREEN

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  15 passed (15)
```

### AI metadata GREEN

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  31 passed (31)
```

### Vocabulary GREEN

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  1 passed (1)
      Tests  1 passed | 14 skipped (15)
```

### Focused suite GREEN

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  5 passed (5)
      Tests  64 passed (64)
```

### AI guidance teeth

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/stage-16-structure.test.ts (15 tests | 1 failed) 12ms
   × AI assistance preserves evidence and human operational judgment 4ms
 FAIL  |unit| src/lib/stage-16-structure.test.ts > AI assistance preserves evidence and human operational judgment
AssertionError: expected '### AI in incident management Use `su…' to contain 'untrusted evidence'
Expected: "untrusted evidence"
 Test Files  1 failed (1)
      Tests  1 failed | 14 passed (15)
```

### Vocabulary teeth

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 ❯ |unit| src/lib/terms.test.ts (15 tests | 1 failed | 14 skipped) 6ms
   × incident vocabulary resolves to the stage that teaches each artifact 5ms
 FAIL  |unit| src/lib/terms.test.ts > incident vocabulary resolves to the stage that teaches each artifact
AssertionError: expected undefined to be 'Runbook' // Object.is equality
 Test Files  1 failed (1)
      Tests  1 failed | 14 skipped (15)
```

### Final restored focused suite

Exact relevant lines from captured output:

```text
 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web
 Test Files  5 passed (5)
      Tests  64 passed (64)
```
