# Stage 10 port plan: controller self-review

Date: 2026-10-20. The user approved the written port design with “proceed”; commit
`3165b62` records that decision. This report reviews the
[implementation plan](../plans/2026-10-20-stage-10-interactive-port.md).
Plan approval and the execution-method decision remain pending.

## Scope and method

The writing-plans skill requires controller self-review, not another subagent
dispatch. No implementer or implementation reviewer was dispatched in this round.
The plan has nine tasks with complete inline tests and implementation sources,
as required by AGENTS.md. None of the proposed application files was written.
The application tree still has fifteen ready stages; Stage 10 remains a placeholder.

The sources were extracted into an in-memory compiler file map, including the
five existing-file registry/audit overlays. TypeScript checked their imports and
types against the installed app dependencies. ESLint inspected the virtual text
with this repository's configuration. These checks do not run the proposed
Vitest tests, render the port or replace actual RED/GREEN/teeth during execution.

## Coverage and corrections

| Approved requirement | Owning tasks / evidence planned |
| --- | --- |
| Eight fields, ten checks, safe normalization and whole Markdown export | 1, 7; literal IDs, unknown input and checklist-only render/export tests |
| Mounted drafts, read/write/clear failures, hydration and notifications | 2; same-tab and cross-tab tests, failed-write draft precedence and failed-clear retry |
| Copy fallback, current text and out-of-order promises | 3; denial/missing API and request-race tests |
| README and historical/current ADR specimens | 4; copy checks and notice assertions scoped to ADR 004, actual counterpart traversal |
| Four document forms, exact reference facts and six change chains | 5; independent values/IDs, selected-row and injected-data render assertions |
| Comments, AI evidence, wrong-answer rationale and session-only practice | 6; every authored case, reset, panel remount and grounded-review teaching |
| Personal forms, cadence groups and all team notes | 7; literal input, complete clear scope, periodic-only export and disclosure tests |
| Atomic readiness/content/rail registration and five curated sources | 8; rendered rails, exact metadata, source destinations and negative placeholder fixture |
| Canonical coverage, live build, both console modes, same-case readers and final review | 8, 9; fence-aware heading/checklist guard, browser flows, expanded-state matrix and whole-branch range |

Self-review corrected a stray character and an untyped callback in the proposed
sources. It also put counterpart controls inside their named ADR region, moved
AI teaching assertions before implementation, added same-tab notification and
canonical-coverage guards, and made counterpart navigation move keyboard focus.
The old negative browser fixture moves from Stage 10 to the confirmed unready
`17-maintenance`; the negative guard remains.

The first lint pass found sixteen draft-source errors: internal anchors needed
Next Link and literal JSX apostrophes needed escaping. Both were corrected in
the embedded plan sources. One compiler attempt ran outside `web/` and could not
find the app's Node typings; running from the documented app directory resolved
that validation-harness error without changing project configuration. A quoted
shell payload was also rejected by a local hook parser; the helper was written
through apply_patch instead. No approval request or application change was needed.

The five Review Focus conditions each have a concrete test in their owning task.
The long source blocks follow the repository's full-source plan format; no
placeholder algorithm or unexplained consumed export is left to the implementer.
The humanizer pass kept the technical tables/code and removed redundant follow-up
instructions where the test source already expressed the requirement.

## Static validation

The final validation output and helper scripts are preserved in the
[planning evidence](evidence/2026-10-20-stage-10-port-plan/README.md).
The manifest hashes the plan and extracted sources. This is planning evidence,
not a completed task's runtime evidence; the old chapter results are not claimed
for the unbuilt port.

The existing records guard was run separately on this documentation-only tree:

```text
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

The local destination and plan-structure checks returned:

```text
106 local destinations checked across 7 Markdown files; 0 failures
Nine task interfaces, required plan structure, whitespace and archived plan hash pass.
```

## Handoff

Recommend subagent-driven execution: nine reviewable tasks separate storage,
copying, teaching and registration, where a plausible display can still teach the
wrong fact. Run writers sequentially at interface gates. Inline execution is
available and retains the repository's independent per-task reviews.

Deferred: plan approval, execution-method selection, implementation and its
RED/GREEN/teeth, live UI matrices, cold readers, whole-branch review, registration,
W-6 publication, integration and deployment. No merge, push or deployment occurred.
