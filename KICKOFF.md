# Kickoff: implement the runtime-neutral Promises pilot

Updated 2026-11-06. Follow [AGENTS.md](AGENTS.md), D-99–D-105.

## Selected outcome

The user requested implementation of the [Promises prototype](docs/superpowers/specs/2026-11-06-javascript-promises-mini-lesson.md)
so it can be evaluated on the page, and asked for JavaScript teaching without
Node-version coupling. The [compact pilot plan](docs/superpowers/plans/2026-11-06-javascript-promises-pilot.md)
is the implementation handoff; [source notes](reference/javascript-source-research.md#runtime-neutral-promise-pilot-selected-2026-11-06)
record the selected scope and runtime distinction.

Port the connected story at `/reference/javascript#async` with a visible opening,
ordered prose/code/tables/interview answers and existing transfer exercises.
Use a narrow typed teaching-block renderer/generator extension. The draft is a
proposal; live TypeScript data and generated Markdown remain authoritative.

Clean Node-version/CommonJS/.cjs setup wording across the JavaScript sheet.
Use modern JavaScript, retaining strict-script/module context and truthful host
scheduling boundaries. Module examples use totals.js/main.js as ECMAScript
modules. Actual runtime/version evidence stays in developer checks and records.

## Implementation session choice

A D-100 workflow clarification is pending: fresh implementation session or an
explicit one-task exception to continue here. No exception is inferred from
elapsed time, and application code has not been edited. The default remains a
fresh user-selected **GPT-6.1 Sol / High** session. The pending question does not
change the approved implementation scope.

- Plan branch: `docs/2026-11-06-promises-pilot-plan`, from **8b6156f**.
  Record its exact committed tip before implementation and create
  `feat/javascript-promises-lesson`.
- Existing accepted app: **4ff8f8e**. Counts remain eight main sections,
  25 subsections, 14 activities, **26/30** sheets and **18/18** stages.
- Keep all main hashes, activity IDs and original four exercise implementations.
  Other seven sections receive context cleanup, not a teaching rewrite; the
  other 29 generated sheet bodies stay unchanged.
- Return to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad**, recommended
  **GPT-6 Astra / Low**. No merge, push or promotion is authorized.

## Acceptance and recovery checklist

- [ ] Resolve the D-100 session choice and record the actual starting SHA/session.
- [ ] Observe missing rich-render/Markdown behavior failures, then implement
  ordered blocks, semantic tables, literal code and interview structure.
- [ ] Publish the prototype as runtime-neutral live data, with an optional
  standard-JavaScript fixture explained after its contract.
- [ ] Extend checks against actual published code and real module files; prove
  the Promise examples in an actual browser as well as the recorded test runtime.
- [ ] Verify the visible opening, every new topic, nested answers/history reset,
  table/code keyboard scrolling, headings/focus and four-screen panel limits in
  both themes at representative 320/768/1440px widths.
- [ ] Run final web gate/dev-console and one independent final content/branch/page
  review focused on teaching quality. Leave a running preview/link for the user.

If interrupted, record completed tasks, branch/commit, failing command and
remaining checks here. The [task ledger](docs/task.md#overview) tracks W-6.3u.1e;
[tracker](docs/tracker.md) holds historical accepted-app evidence. No new app
checks are claimed by this documentation-only plan.

Closing plan-tree checks descended from **8b6156f**: tracker-ledger **2/2**,
local links/anchors **195 targets / 9 files** and `git diff --check`, all exit 0.
No app/generated/example inputs changed; no app suite/build/browser rerun.
