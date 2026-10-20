# Stage 10 whole-branch review

Independent reviewer: gpt-6-astra. Fixed range: `79f9e31..9fd17d2afba98c484daaceb02ae25aa6f8820927`, eight commits, including source capture `e30c9a4`. Initial verdict: **Ready with fixes**. No current chapter/glossary correctness defect, Critical or Important implementation defect was confirmed. The reviewer found two **Minor, PLAN-AUTHORED verification gaps**, retained below without changing its grades.

The first review turn stopped at a usage limit without a verdict. After the stated reset passed, the original reviewer resumed and completed this pass. A briefly started fallback was interrupted and supplied no verdict. Neither incomplete turn counts as approval.

## Findings and controller disposition

**M1 — Minor, PLAN-AUTHORED ERROR:** `web/src/lib/stage-10-structure.test.ts:209` does not protect the invoked-validator prerequisite promised in the plan’s fourth Review Focus item. It checks matrix vocabulary and forbidden historical sentences, while deleting the actual invocation condition remains undetected. The chapter’s **Update and verify documentation with the change** correctly teaches the condition.

**M2 — Minor, PLAN-AUTHORED ERROR:** the ADR guard at `web/src/lib/stage-10-structure.test.ts:164` finds status names and the date anywhere in the lifecycle section. The status table and replacement record can satisfy those checks after the old record’s dated current-status notice is removed. The actual chapter’s **Record decisions and supersede them visibly** contains the correct notice and both links.

The reviewer evaluated the actual 14 test callbacks in memory with a small `node:assert` adapter. It explicitly identified these as **read-only assertion probes, not Vitest execution**:

```text
Unmodified chapter: {"passed":14,"failed":[]}
Invoked-validator condition removed in memory: {"passed":14,"failed":[]}
Remove old ADR dated current-status line: {"passed":14,"failures":[]}
```

Controller disposition: both are **Important (blocking) acceptance corrections** for closing this plan, while the original reviewer grades remain Minor. The effect is false verification assurance: the approved Review Focus promises guards for two central corrections that the green suite does not protect. This regrading does not claim a current user-facing teaching defect. Add scoped positive guards and prove both with real Vitest mutations before claiming the verification contract is complete. Cost: added wording-guard maintenance. The correct chapter needs no rewrite.

## Acceptance coverage retained from the independent review

| Requirement | Evidence and initial review result |
| --- | --- |
| Continuous cadence, six house sections, nine teaching sections | Canonical chapter plus cadence/order guards; pass |
| Smallest useful set, four reader needs, optional artifacts | Selection table, scoped guard, Toolshare artifact attempt and S3 HIT; pass |
| README content and colocated verification | Prerequisites/access/configuration/commands/result/help and fresh-clone evidence; guard and S1 HIT; pass |
| ADR anatomy, reasoning and reciprocal links | Old/new specimens, lifecycle table, preservation instructions and Toolshare attempt; pass |
| Old record’s dated current-status discovery | Correct teaching and S2 HIT; positive automated coverage incomplete under M2 |
| Historical records versus current instructions | Archive section, Definition of done and Traps agree; closing guard; pass |
| Architecture scope, relationships, owner and trigger | Current-view specimen plus manual review; pass |
| Contract defaults, range and optional-field absence | BOOKING_WINDOW_DAYS 1–365/default 30, waitlistPosition omission; scoped guard; pass |
| Change/fact/document/check/owner mapping | Six matrix rows and S4 HIT; pass |
| Configuration documentation versus enforcement | Correct teaching, C1 disposition and old false-enforcement teeth; positive invocation coverage incomplete under M1 |
| Comments/provider claims | Four categories; unsupported truncation, incident and universal-attempt claims removed; guard/source inspection; pass |
| AI evidence and privacy | Named reviewer, sources/version, synthetic examples, Read/Compile/Execute and S5 HIT; pass |
| Research-only desired text cannot pass | Fixture and actual appendix mutation fail on missing active heading; pass |
| Fenced headings cannot delimit sections | Four-backtick/shorter-fence fixture and actual corpus; pass |
| Shared glossary single source | ADR full definition only; generated sync, semantic RED/GREEN/teeth and ready Stage 03 destination; pass |
| Printed examples honestly classified | Eight fences, four comment-only TypeScript; literal compile without runtime claim; pass |
| Same held-out instruments | Exact scenario/questions, frozen pre-body choices, matching snapshot hash, supported five HIT answers; pass |
| Sources/images/historical framing | Preserved authors/URLs/dimensions/licenses/uncertainty and gathering-only images; pass within recorded limits |
| Scope/authorization | Readiness, registrations, dependencies and lockfile unchanged; no port, W-6 implementation or integration authority implied; pass |

The reviewer inspected raw RED/GREEN, actual mutation diffs and restoration hashes, not just count summaries. It confirmed 1512/208 tests, 52 pages, production 24/24, development 1/1, formatting/lint/typecheck, and all four ADR screenshots. It independently reopened Diátaxis, Nygard, Stripe metadata and Docuwiz guidance; relevant attributions agree. Raw logs/diff context contain literal whitespace; authored files pass whitespace checks when raw evidence is excluded.

## Suspected defects disproved

Historical Accepted status is explicitly superseded by the dated notice. Missing fictional application commands/results are labeled unknown facts. There is no omitted standalone web glossary route. Both known Stage 03 anchors target the corrected heading. Earlier embedded-image descriptions are explicitly dated research history. The separate development sweep supplies the React validation that production strips.

## Behaviors declined and controller rulings

Deployment/remote health and integration stay outside this implementation. Fictional application execution and recovery remain unproved. Future port/W-6 accessibility needs its own checks. Graphic authorship/reuse permission remains unknown. The private heading scanner is tested for this corpus, not offered as a general parser. Semantic guards are supplemented by reader assessment. The read-only reviewer relies on retained suite logs rather than claiming fresh execution. Historical preservation observations rely on their contemporaneous logs, with current hashes/listeners rechecked. Each disposition and its cost is recorded in the execution ledger; none silently expands the scope or grants integration authority.

Initial reviewed state: eight commits after develop baseline; clean tree at `9fd17d2`. Not merged, pushed or deployed. Bounded fix review and final records addendum remain required.

## Independent bounded fix review

The gpt-6-astra follow-up returned a capacity error. The available gpt-6.1-sol reviewer independently checked `9fd17d2..4226dec0f026ea0d5a4f28da193f1d652d354bc3`; it did not replace or repeat the completed whole-branch pass.

Verdict: **Ready to merge. M1 and M2 addressed; no new findings.** M1 now requires the invoked-validator condition inside its actual section. M2 extracts ADR 004’s fenced specimen and requires the appended notice and dated current Superseded status; a sibling record or status table cannot supply it.

The reviewer inspected actual mutation diffs, complete RED/teeth logs, the restoration runner and final checks: each real mutation initially passed its earlier guard, each strengthened guard then failed for the right reason (1 failed / 13 passed), separate teeth confirmed both, restored coverage passed 68/68 across five files and the full suite passed 1512/1512 across 208 files. Format/lint/generated-route typecheck exit 0. Saved chapter bytes are restored in `finally`; committed chapter, glossary, assets and runtime files remain unchanged.

It declined a second full branch pass, new browser/build runs, deployment, fictional execution and future port behavior because the bounded correction changes only guards. Controller disposition: the completed original full pass and retained runtime evidence cover unchanged implementation; no new runtime/deployment/port claim follows. The private ADR extractor is suitable for this identified specimen, not a general Markdown parser. Those limits remain recorded.

Reviewed implementation state: **nine commits after `79f9e31`, clean at `4226dec`**. The full review plus bounded fix review are **Ready to merge**. Final records-only changes still receive their scoped addendum. No merge, push or deployment is authorized by the verdict.

## Closing records addendum

Independent records-only check of the working delta from `4226dec`: **review clean; Ready to merge unchanged**. Review ranges, original grades/controller disposition, closure, observed counts and unchanged-runtime evidence are accurate. No chapter, web or reference change is present; authored whitespace checks pass. W-3 remains 15/18 and W-6 22/27, with the port separately pending and integration requiring user approval. No new finding. The closing plan step may be committed; this is not a new suite run or integration authorization. The later 334-target scratch link log will be retained with the execution archive, separately from the earlier 332-target log.
