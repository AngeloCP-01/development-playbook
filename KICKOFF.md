# Kickoff: read the Promises mini-lesson teaching prototype

Updated 2026-11-06. Follow [AGENTS.md](AGENTS.md), D-99–D-104.

## Current outcome

The user selected one complete mini-lesson as a prototype after the expanded
reference still felt lacking. The [learner draft](docs/superpowers/specs/2026-11-06-javascript-promises-mini-lesson.md)
is ready for feedback on teaching depth. It follows one simulated profile lookup
through callbacks, a Promise adapter, chaining and async/await, including both
outcomes, cleanup, batch reports, model interview answers and transfer practice.

**Next task: read the prototype with the user and decide whether it is the
intended teaching standard. Recommended: GPT-6 Astra / Low**, coordinator
**01a18acc-3b54-7202-92f3-404cc94fd0ad**. The document is a readable lesson,
not another topic list or an approved page-wide migration plan.

## Branch and authority

- Branch `docs/2026-11-06-promises-mini-lesson`, starting at exact
  **e991ab52cd61aec3362cbc3e0e3b22708c554bd7**. Record the final committed tip
  with `git rev-parse HEAD` before continuing.
- App **4ff8f8e50cd86943a046a0fef241a38a5ddd5305** is unchanged and remains
  accepted against its earlier selected scope. Feature counts remain eight
  sections, 25 subsections, 14 activities, **26/30** sheets and **18/18** stages;
  local develop **25/30**. No merge, push or promotion.
- The lesson is a frozen editorial prototype, not a second maintained published
  content source. Future page content still belongs in TypeScript and generated
  Markdown. Its length is not a quota for every topic.
- [Source findings and example evidence](reference/javascript-source-research.md#promise-mini-lesson-source-check-2026-11-06)
  remain in the existing research record; the [task checklist](docs/task.md#overview)
  tracks W-6.3u.1d and [tracker](docs/tracker.md) records completion/limits.

## Actual evidence and limits

Nine MDN primary sources were checked. An independent Astra Low editorial reader
found three material gaps: executor argument ownership, rejection propagation,
and transfer assessed before aggregation/test setup was taught. All were revised
and confirmed resolved; the optional allSettled completion clarification was
applied. This is editorial review, not a learner study or user acceptance of depth.

`node --unhandled-rejections=strict reference/examples/javascript-promises-lesson-checks.cjs`
passes on Node **22.23.4**: **9 literal examples / 51 assertions**. It reads the
actual draft blocks and existing transfer code, checking exact output, pending
return, derived values, failure/cleanup paths, partial reporting and the broken/
repaired save fixture. No network/browser/published-page claim. A completion
guard prevents silent success from an unfinished Promise check.

Fresh closing checks on the prototype tree descended from **e991ab5**:
tracker-ledger **2/2**, local links/anchors **188 targets / 8 files** and
`git diff --check`, all exit 0. Self-review/humanizer pass complete.
No app/generated inputs changed, so no app suite/build/browser rerun. Retain
identified **4ff8f8e** application evidence in the tracker; it does not validate
an unimplemented page port.

## After reader feedback

If the draft fits, select a bounded async-section page pilot and design the
smallest structured teaching/presentation extension. Show useful opening
explanation/outcomes before collapsed detail, while retaining #async, original
activities, accessibility and single-source output. The current paragraph-only
Row body cannot faithfully represent the entire narrative sequence.

Shared behavior then needs a compact plan and a fresh user-selected
**GPT-6.1 Sol / High** implementation session under D-99/D-100. No page port,
whole-page rewrite, new topics, runner/scoring/persistence or merge is selected
by completing this prototype. Integration still needs separate user approval.
