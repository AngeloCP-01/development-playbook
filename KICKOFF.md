# Kickoff: W-6.4 approved for implementation

Updated 2026-11-04. Follow [AGENTS.md](AGENTS.md), D-99 and D-100.

## Current state

- The user approved the recommended W-6.4 scope with "proceed", following
  handoff **a0f40f5**. Native glossary/stack pages, stack source migration and
  TD-47's Node 22 prerequisite are authorized. Scope selection is complete.
- Branch `docs/2026-11-04-reference-hub-assessment`, from local develop
  **097fdd0f6aea2c4f18ffb7dcd712607915c64590**. Assessment **8f722f7** holds the
  source/design checkpoint. Use `git log -1 --oneline` for the closing handoff tip.
- [One source/design record](reference/w6-4-source-research.md) holds primary
  findings, alternatives, the approved five-step compact plan and the appended
  scope selection. [W-6.4](docs/task.md) tracks acceptance and remaining work.
- Application, runtime/configuration and generated outputs are unchanged.
  Local develop remains **25/30** sheets and **18/18** stages. No merge/push/deploy.

## Approved outcome and boundaries

Readers can look up a full glossary definition and its optional stage, or find
the default tool, rationale, support caveats and deviation guidance for a concern.
Add `/reference/glossary` and `/reference/stack`, linked from the hub and existing
Reference navigation, sitemap and production audit.

Glossary consumes canonical `terms.ts`; preserve its generated Markdown and inline
popover. Move stack authority to `web/src/lib/stack.ts`; its native page and a pure
Markdown generator consume that source. Keep `reference/stack.md` at its current
path as generated output. Preserve four groups, 22 choices, deviation/upkeep
guidance and links, with the recorded factual corrections and narrow Stage 04
alignment. Distinguish starter defaults from this app's installed packages and
unknown infrastructure. These two resources do not increase the sheet count.

**TD-47 first:** the assessment observed local Node **22.19.0**, below installed
jsdom **30.0.1**'s Node 22 floor **22.22.2**. Use a supported Node 22 patch and make
the floor explicit across local/CI/package contracts. CI's actual resolved runtime
was not checked; no runtime failure is claimed. Preserve the major and packages.

Deferred: five language sheets, search/filter state, stage-to-sheet backlinks,
inline term-popover work, dependency upgrades, artwork, live infrastructure,
push and main promotion. Add neither a Markdown parser nor a generic CMS.

## Implementation session

Recommended **GPT-6.1 Sol / High**, in a fresh user-selected session under D-100.
This is a recommendation, not confirmation of an active model setting. Start from
this assessment branch's committed handoff tip, record `git rev-parse HEAD`, and
create `feat/reference-glossary-stack`. Keep the coordinator session open.

Use the [approved design and compact plan](reference/w6-4-source-research.md#w-64-assessment-and-proposed-compact-design):
runtime support, stack single-sourcing/source corrections, static pages,
discovery/coverage, final verification. Follow D-99's consequential path for the
generator, routing, shared navigation and SEO/audit coverage. Use meaningful
red-to-green checks for changed behavior; static copy/data retains its exception.
Read `web/AGENTS.md`, `web/PATTERNS.md`, `web/DESIGN.md` and relevant installed
Next routing/link/sitemap guides before implementation.

Acceptance includes actual data/render tests, unique stable fragments, full
definitions/rationales, optional links, generator synchronization, preserved
navigation/WIP behavior, slug-collision guards and real built/audited routes.
Run the final web gate once on the supported runtime and the dev-console sweep.
Check both pages/hub and representative existing stage/sheet navigation in both
themes at narrow/middle/wide widths, with keyboard, fragment/Back/reload,
overflow, contrast, touch targets and console. Obtain one independent final
content/page/branch review.

**Return to coordinator:** `01a18acc-3b54-7202-92f3-404cc94fd0ad`, with implementation
session ID, branch/commit, actual runtime/commands/results and unresolved issues.
The coordinator reads that thread and the actual diff. Separate approval is
required before any no-ff merge into develop; main promotion belongs to the user.

## Verification

Approval handoff changes only KICKOFF, task, tracker and the source record.
Fresh checks on this records tree: `pnpm test src/lib/tracker-ledger.test.ts
--maxWorkers=1` **2/2**, `python3 /private/tmp/w64-check-links.py` **125 local
targets / 4 files**, and `git diff --check`, all exit 0. Self-review and the
humanizer editing pass are complete. Application inputs are unchanged from
**a0f40f5**, so no app suite/build is needed for this records handoff.

Runtime repair, app verification and layout results remain pending. Earlier
source assessment evidence is preserved at **a0f40f5**; earlier application
checks remain in the W-6.3t tracker rows and KICKOFF at **097fdd0**. Those results
do not validate the future W-6.4 implementation.
