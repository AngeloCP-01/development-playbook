# Kickoff: W-6.4 glossary/stack design proposed

Updated 2026-11-04. Follow [AGENTS.md](AGENTS.md), D-99 and D-100.

## Current state

- Branch `docs/2026-11-04-reference-hub-assessment`, from local develop
  **097fdd0f6aea2c4f18ffb7dcd712607915c64590**. Source/design checkpoint **8f722f7**;
  use `git log -1 --oneline` for the closing records tip.
- The user authorized assessment here. Native glossary/stack pages, stack source
  migration and the runtime prerequisite below are proposed, not yet selected.
- [One source/design record](reference/w6-4-source-research.md) holds primary
  findings, local inspection, alternatives, compact design and five-step plan.
  [W-6.4](docs/task.md) tracks scope and acceptance.
- The gap remains: native reference routes and discovery cover sheets, not a
  whole glossary or the stack. Recommend `/reference/glossary` and
  `/reference/stack`, linked from the hub and existing Reference navigation.
- Glossary stays single-sourced in `terms.ts`; no inline-popover change. Proposed
  stack authority moves to `web/src/lib/stack.ts`, with `reference/stack.md`
  generated at its existing path. This source-authoring change needs selection.
- **TD-47:** local Node **22.19.0** is below installed jsdom **30.0.1**'s declared
  Node 22 floor **22.22.2**. `.nvmrc` **22** and package **22.x** permit that patch.
  CI consumes the nvmrc; its actual resolved runtime was not checked. No runtime
  failure is claimed. Use a supported runtime and repair the contract first.
- No app code, source authority, runtime/configuration or generated output changed.
  Local develop remains **25/30** sheets and **18/18** stages. No merge/push/deploy.

## Verification

Primary-source research and self-review/humanizer pass completed. TypeScript 7
is released; its API/toolchain caveats matter, while this app resolves TS 5.9.3.
Other recorded qualifications cover version policy, pnpm, Vitest, jsdom, analytics
and retention. This is not a full provider audit or dependency upgrade plan.

Source checkpoint **8f722f7**: local links **4/4**, whitespace clean, exit 0.
Fresh closing-record checks: node-only tracker ledger **2/2** via
`pnpm test src/lib/tracker-ledger.test.ts --maxWorkers=1`,
`python3 /private/tmp/w64-check-links.py` **125 local targets / 4 Markdown
files**, and `git diff --check`, all exit 0. Only source/records changed; no app
suite, DOM tests or build was needed for this assessment. No supported-runtime
compatibility or future page-layout result is claimed. Earlier application
verification stays in the W-6.3t page/merge tracker rows and KICKOFF at **097fdd0**.

## Next task and session

**Next:** select or revise the proposed source strategy, native-page scope and
TD-47 prerequisite. Recommended coordination **GPT-6 Astra / Low**, this session.

**If selected:** fresh user-selected **GPT-6.1 Sol / High** implementation session,
from this assessment branch's committed tip. Record the exact SHA and create
`feat/reference-glossary-stack`. This recommendation does not confirm an active
model setting. This session stays open for coordination/review under D-100.

Reader tasks, interfaces, exclusions and acceptance are in the
[source/design/compact plan](reference/w6-4-source-research.md#w-64-assessment-and-proposed-compact-design).
Use D-99's consequential path for routing, shared navigation, SEO/audit coverage
and the new stack generator. Five dependent steps: runtime support (TD-47),
stack single-sourcing/source corrections, static pages, discovery/coverage,
final verification. Static copy/data retains its TDD exception; changed generator
and navigation/coverage behavior requires meaningful red-to-green checks.

Preserve all four stack groups/22 choices/deviation/upkeep content except the
recorded source corrections. Align only affected Stage 04 guidance. Keep starter
defaults distinct from this app's installed packages and unknown infrastructure.
Do not add a Markdown parser, generic CMS or provider/runtime major upgrades.
Read installed Next routing/link/sitemap guides before using those APIs.

Run the final web gate once on the supported runtime and a dev-console sweep for
shared React/navigation changes. Manually check new pages/hub and representative
existing stage/sheet navigation in both themes at narrow/middle/wide widths,
keyboard, fragment/Back/reload, overflow, contrast, touch targets and console.
Obtain one independent final content/page/branch review. Do not inflate the
cheatsheet count to include the two native resources.

**Return to coordinator:** `01a18acc-3b54-7202-92f3-404cc94fd0ad`, with branch/commit,
actual runtime/checks, limits/unresolved issues and implementation session ID.
Coordinator reads that thread and the actual diff. Separate approval is required
before any no-ff merge into develop; main promotion belongs to the user.

Deferred: five language sheets, search/filter state, stage-to-sheet backlinks,
inline term-popover work, dependency upgrades, artwork, live infrastructure,
push and promotion. No implementation has started.
