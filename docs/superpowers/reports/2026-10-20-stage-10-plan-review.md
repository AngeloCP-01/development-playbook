# Stage 10 chapter plan: author self-review

Date: 2026-10-20. The user approved the written spec with “proceed.” The
[implementation plan](../plans/2026-10-20-stage-10-documentation.md) is written;
its review and execution-method selection remain pending.

## Coverage and size

The plan has five sequential tasks: the canonical chapter, shared ADR glossary,
guard sensitivity/fence checks, held-out reader reruns and final verification.
The plan's coverage table maps each accepted baseline finding and spec requirement
to a task. The review-focus section names five failure conditions and points
to their tests/checks.

Full proposed chapter and test source are included because the repository
requires task slices to contain them. The glossary remains generated. The two
editing tasks share one concept model; the other tasks test that same result.
Inline execution is recommended, retaining independent per-task review, fresh
cold readers and final whole-branch review.

## In-memory validation of the plan

A temporary Node/TypeScript probe extracted the plan's outer fenced blocks.
It parsed the proposed TypeScript test sources and term-property fragment,
then checked their assertions against the embedded chapter and the existing
chapter in memory. No future source file or corrected chapter was written to
the application tree. This was plan validation, not a Vitest execution run,
production typecheck or implementation RED/GREEN evidence.

Raw output:

```text
Plan-only syntax validation: 3 TypeScript blocks parsed.
Plan-only chapter expectations: 14/14 pass against embedded draft.
Existing teaching probe: 3 pass, 11 fail (not execution RED evidence).
Plan-only glossary expectations: PASS
Existing glossary probe: contain historical reasoning
PASS: held-out scenario and all five questions match the baseline verbatim.
```

The checked assertions include the two extraction fixtures. The actual executor
must still write the tests first and watch Vitest fail on the unchanged teaching
for the right reasons. This probe's output must never be substituted for that.

The four existing regression files were also run with Vitest after updating
the planning records. They passed **51/51**: stage metadata, tracker ledger,
terms and generated-glossary sync. These are existing checks; the new guards
remain source inside the plan, ready to be written test-first during execution.

One ambiguity was corrected during self-review: the false-enforcement mutation
now specifies one exact sentence containing the lower-case regression target.
The plan also gives an explicit extraction/TypeScript command for comment-only
fences rather than leaving its execution procedure to inference. Mutation
baselines distinguish committed source from authorized evidence edits; the
appendix mutation's possible additional guard failures are disclosed. The final
review receives a committed tip, and the later records-only diff gets a separate
check against that reviewed implementation tree.

## External check after drafting

After the plan was written, the author read Google's
[code-sample guidance](https://developers.google.com/style/code-samples) and
[Write the Docs' docs-as-code guidance](https://www.writethedocs.org/guide/docs-as-code/)
as a separate check of its assumptions. The sample guidance supports introducing
and clearly marking incomplete samples. The plan labels project-fact outlines
and comment patterns; it does not claim they implement a running Workshop app.
The docs-as-code workflow supports version control, review and tests rather than
an accuracy guarantee from generation alone.

The final self-review checked task references, helper signatures, the exact
Toolshare scenario/questions and the generated-glossary boundary. No further
spec scope change was needed. Humanizer guidance was applied to the new prose;
literal source/terminal blocks retain their technical form.

## Remaining work

User reviews the plan and selects inline or subagent-driven execution. Then run
the plan, including real RED/GREEN, mutation evidence, same-scenario reruns and
the final gate/review. The canonical teaching, application tests and glossary
remain unchanged in this planning round. No merge, push or deployment occurred.
