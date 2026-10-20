# Stage 10 chapter execution

The user authorized implementation with “proceed up to implementation” after the plan handoff. Execution is inline in `docs/2026-10-20-stage-10-chapter`, based on develop `79f9e31`. No merge, push or deployment is authorized by this report.

## Process rulings

- Retain independent per-task reviews required by AGENTS.md and the approved plan, despite the inline skill’s default omission. Cost: additional review context and time.
- Retain the approved chapter semantic guards despite generic guidance against prose tests. Pair them with cold-reader artifact and lookup checks: matching strings does not prove teaching quality. Cost: maintenance when intentional wording changes.

## Task 1: chapter correction

The new guards were written and executed before replacing the chapter. RED failed for the expected reasons: active teaching still lacked the proposed document-choice, verification and AI sections; research-only content could not satisfy those assertions. The extraction fixtures passed. Full raw outputs are preserved in [the evidence directory](evidence/2026-10-20-stage-10/task-1-red.log) and [GREEN log](evidence/2026-10-20-stage-10/task-1-green.log).

```text
RED — pnpm exec vitest run src/lib/stage-10-structure.test.ts src/lib/stage-metadata.test.ts
 Test Files  2 failed (2)
      Tests  12 failed | 36 passed (48)

GREEN — same command after chapter replacement
 Test Files  2 passed (2)
      Tests  48 passed (48)
```

Lint and Prettier passed. Independent Task 1 review: **review clean**, no Critical, Important or Minor findings. The reviewer checked all nine ordered teaching sections; six house sections; task-based document selection; README prerequisites and fresh-clone verification; ADR anatomy, dated supersession and reciprocal links; current architecture ownership and contract defaults/absence; all four comment categories and provider claims; the six-row change/check matrix and solo ownership; retained history versus retired current instructions; commit context; AI evidence; closing artifacts and traps; provenance links; cadence and unchanged readiness. All ten active local destinations exist. Fixture tests distinguish fenced headings and research-only matches.

Disproved: the old ADR’s Accepted line is historical, with current status established by the appended notice; specimen ADR links are illustrative; absent Workshop commands are labeled missing example facts, not an execution claim. Task 2 glossary and later verification were explicitly outside that review.

Humanizer review retained the chapter’s direct instructional voice and removed no deliberate technical distinctions. The chapter uses named owners, concrete checks and labeled examples; no invented execution results or provider incidents remain.

Deferred: interactive Stage 10 port, W-6 implementation, new documentation tools and broader project-management templates.

### Task 1 integration correction

The first full suite found a **PLAN-AUTHORED ERROR**: two Stage 03 links still used the renamed ADR heading. Raw result: `1 failed | 1510 passed (1511)`. The existing source-citation test reproduced the failure before editing either link. Both now point at **Record decisions and supersede them visibly**; surrounding Stage 03 teaching is unchanged. This extends the plan by two link targets. The correction is covered by the existing non-empty corpus anchor test.

```text
Anchor RED: Test Files 1 failed (1); Tests 1 failed | 2 passed (3)
Integration GREEN: Test Files 3 passed (3); Tests 51 passed (51)
Full-suite GREEN: Test Files 208 passed (208); Tests 1511 passed (1511)
```

[Anchor RED](evidence/2026-10-20-stage-10/task-1-anchor-red.log), [integration GREEN](evidence/2026-10-20-stage-10/task-1-integration-green.log), [first full run](evidence/2026-10-20-stage-10/task-1-full-test.log) and [full-suite GREEN](evidence/2026-10-20-stage-10/task-1-full-green.log) preserve the raw output. Independent addendum: **review clean after 1 fix**; I1 resolved by the two correct replacement anchors, with the promised format/rationale still at the destination.

## Task 2: shared ADR definition

The new semantic assertion failed for the expected reason before changing the term: the definition still said “never edited afterward” and lacked “historical reasoning”. Only `TERMS.adr.full` changed. `pnpm gen:glossary` regenerated exactly the ADR paragraph. Name, short definition and ready Stage 03 destination remain unchanged.

```text
RED — pnpm exec vitest run src/lib/terms.test.ts -t 'ADR history stays intact'
AssertionError: expected 'A short record of a single architectu…' to contain 'historical reasoning'
 Test Files  1 failed (1)
      Tests  1 failed | 15 skipped (16)

GREEN — pnpm exec vitest run src/lib/terms.test.ts src/lib/glossary.test.ts src/lib/stage-10-structure.test.ts src/lib/stage-metadata.test.ts
 Test Files  4 passed (4)
      Tests  65 passed (65)
```

Full [RED](evidence/2026-10-20-stage-10/task-2-red.log), [generation](evidence/2026-10-20-stage-10/task-2-generate.log) and [GREEN](evidence/2026-10-20-stage-10/task-2-green.log) output is retained. Deferred: term visual redesign and moving the destination to the unready Stage 10 placeholder.

Independent Task 2 verdict: **review clean**, no findings. The reviewer checked the exact definition, chapter lifecycle, unchanged short/name/Stage 03 destination, generator provenance and one-paragraph output diff; independently reran the four files (65 passed). It disproved a conflict between historical Accepted status and the dated current-status notice.

## Task 3: guard sensitivity and printed examples

Baseline source bytes matched committed `d2a5e4f`; status was clean following Task 2. The baseline group passed 65 tests. Each deliberate mutation was applied separately, its actual diff saved, its selected assertion observed failing for the intended reason, and the exact saved bytes restored in `finally`. Each restoration also checked an empty source diff. No mutation survives.

| Mutation / test boundary | Raw test count |
| --- | --- |
| appendix | 1 failed \| 13 skipped (14) |
| enforcement | 1 failed \| 13 skipped (14) |
| enforcement-full | 1 failed \| 13 passed (14) |
| link | 1 failed \| 13 skipped (14) |
| link-full | 1 failed \| 13 passed (14) |
| term | 1 failed \| 15 skipped (16) |
| anchor | 1 failed \| 2 skipped (3) |

The appendix mutation retained all original document-choice words but moved the whole section outside active teaching: the guard failed on a missing active heading. The enforcement mutation failed the forbidden startup-guarantee assertion. The link mutation removed only old→new discovery, leaving the backlink intact; the reciprocal-link assertion failed. The term mutation restored only the old definition, not generated output, and failed “historical reasoning”. The additional anchor teeth check reinstated the two old Stage 03 targets and failed the existing anchor resolver.

The enforcement and link full-file runs each failed **only their target test**, with the other 13 passing. The appendix demonstration selected one test; a whole-file run would also reject order and retained research content. The term demonstration selected one semantic test; glossary synchronization would also reject that intentionally inconsistent state. These are selected boundaries, not claims that only one test in the whole suite could fail.

All actual [mutation diffs and raw output](evidence/2026-10-20-stage-10/) are retained by `task-3-` filename. The mutation runner itself is preserved as `task-3-mutations.py` for reproducing the sequence.

```text
Baseline: Test Files 4 passed (4); Tests 65 passed (65)
Restored GREEN: Test Files 4 passed (4); Tests 65 passed (65)
All mutation source bytes restored and targeted group GREEN
```

### Fence inventory

The eight fences are: one Markdown README outline; two Markdown ADR specimens; one text architecture relationship view; four TypeScript comment examples. Markdown/text specimens are illustrative, not executable setup instructions. TypeScript contains comments only; literal extraction checked every nonblank line and `tsc --noEmit --skipLibCheck --target ES2022 --types node` checked the combined printed blocks. This supplies syntax evidence, no runtime validation claim.

```text
Fence 1: line 65, markdown: # Project name
Fence 2: line 119, markdown: # ADR 004: maintain the initial field reference by hand
Fence 3: line 139, markdown: # ADR 005: generate the factual contract reference
Fence 4: line 176, text: Attendee -- books or cancels --> Workshop app -- reads/writes --> Booking store
Fence 5: line 215, ts: // Keep the larger record in our external store and put only its ID in
Fence 6: line 227, ts: // Preserve the entered title for display. Apply normalization only
Fence 7: line 233, ts: // This example's date interval includes both endpoints; account for
Fence 8: line 239, ts: // This illustrative export handles at most 1000 rows. Expose that cap
Extracted 4 comment-only TypeScript fences to /var/folders/6p/sl8n2nd96kzfxc82ll0plsvh0000gn/T/stage10-fences.sswcq3lk/comments.ts
tsc exit: 0
Comment-only compile check; no executable runtime behavior claimed.
```

Deferred: runtime checks for an application that these illustrative specimens do not provide. No application code or dependency was introduced.

Independent Task 3 verdict: **review clean after 1 fix**. Minor M1 (introduced report table separators) was verified and corrected; all seven count separators now render inside their intended cells. The reviewer checked every mutation diff, intended failure, honest selection boundary, restoration hashes/empty source diffs, all eight fences and literal compiler result. No Critical or Important finding remains.
