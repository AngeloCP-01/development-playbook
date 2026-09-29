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
