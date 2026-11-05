# Kickoff: language/framework sheet brief; JavaScript assessment next

Updated 2026-11-05. Follow [AGENTS.md](AGENTS.md), D-99 and D-100.

## Current state

- Records branch `docs/2026-11-05-language-sheet-brief`, from develop
  **ede8e1f98f979c57f3327d89a15623c60b245afc**. User's language/framework
  content direction is recorded as D-101; no application inputs changed.

- Local `develop`: user-approved no-ff merge **b8515a0**, parents
  **097fdd0 / 14ca2da**. Merge tree equals reviewed feature tip **14ca2da**;
  application inputs equal verified **9231dc9**. Use `git log -1 --oneline`
  for the closing records tip. Approved implementation handoff was **131c303**.
- Native `/reference/glossary` and `/reference/stack` appear in the hub,
  Reference navigation, sitemap and production audit. Glossary consumes unchanged
  `terms.ts`; stack page and generated `reference/stack.md` consume canonical
  `web/src/lib/stack.ts` (`pnpm gen:stack`).
- Stack preserves four groups/22 choices/five deviation cases and upkeep guidance,
  with researched corrections, narrow Stage 04 alignment and the original Testing
  chapter link. Counts stay **25/30** sheets and **18/18** stages.
- **TD-47 closed on local develop:** `.nvmrc` **22.23.4**, package Node
  **^22.22.2**, support/alignment guard. [Archived assessment and closure](docs/tracker-archive.md).
- W-6.4 is complete on local develop. Five language placeholders remain.
  No push or deployment; main is unchanged.

[One source/design record](reference/w6-4-source-research.md) preserves findings,
the approved plan and source limits. User selected "Implement here; override
D-100 for this task". Implementation thread:
**01a1a51d-8cb1-7983-8e51-1c3e48ecf142**; active model/effort unconfirmed.
Standing D-100 policy remains unchanged.

## Verification and review

The reported verification commands used installed Node **22.23.4**.
[The W-6.4 completion row](docs/tracker.md) holds commands, results, failure
reasons and deferred scope. Raw logs:
`/private/tmp/w64-*.log`.

- **Fresh on 9231dc9:** production build **57 routes**, production audit **29/29**;
  affected-file format/lint and glossary render **3/3** for the final `min-w-11`
  touch-target correction. npm/Zod now measure **44×44px** at 320px.
- **Retained from 1ee672e:** full format/lint/generated-route typecheck and
  **1,609 tests / 228 files**, all exit 0. The sole later app change is that class.
- **Development console 1/1**, exit 0, on an isolated **1ee672e** source copy on
  port 3101. Only glossary minimum width differs from final source; React
  behavior/structure and audit tests are identical. Temporary Turbopack root
  resolves linked dependencies; original config/port-3200 server untouched.
- Focused **30 states**: both themes at **320/768/1440px**, hub/both resources and
  representative stage/sheet, no overflow or console errors; native links meet
  **44×44px**. Keyboard, fragment focus/reload/Back, Stage 06 link/Back, drawer
  closing/current navigation and collapsed desktop resource access pass.
- One independent **Astra Low** content/page/branch review covers **9231dc9** and
  six rendered captures: no blockers. Both findings fixed; humanizer pass done.

CI execution, hosted patches, a full provider audit and reader benefit remain
unverified. Undated choices retain their source-review limits.

Implementation closing-record checks: ledger **2/2**, local links/anchors **141 targets
across 8 files**, and whitespace check, all exit 0. App inputs remain unchanged
from **9231dc9**; the identified app verification is retained.

## Review and integration

Coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad** reviewed implementation
thread **01a1a51d-8cb1-7983-8e51-1c3e48ecf142** and actual
**131c303...9231dc9** diff. [W-6.4](docs/task.md)
records the completed integration. Coordinator read the thread and reviewed actual
**131c303...52e703e**, including the final records changes. No actionable standards
or scope findings. Independent read-only checks of these two axes also returned
no findings; they did not rerun suites/browser verification. Coordinator checked
raw test/type/build/audit/dev-console logs and the meaningful runtime/generator
RED evidence, plus retained light-hub-768 and dark-stack-1440 captures.

Application inputs, generated stack Markdown, Stage 04 guidance and source policy
still match **9231dc9**. Retain the application verification above; there was no
full coordinator rerun or new browser matrix. Node **22.23.4** binary is installed
and was checked directly for the closing-record command environment.

Pre-merge coordinator closing-record checks on Node **22.23.4**: tracker ledger
**2/2**, `python3 /private/tmp/w64-coordinator-links.py` **141 local targets /
8 Markdown files**, and `git diff --check`, all exit 0. These records-only changes
retain the identified application verification for **9231dc9** inputs. Every
no-ff merge into develop needs separate user approval. The user subsequently
approved integration as **b8515a0**; its tree equals **14ca2da**. Main promotion
belongs to the user.

Deferred: unusual source-URL delimiter hardening (minor, current URLs unaffected),
five language sheets, search, stage-to-sheet backlinks, term popovers, dependency
upgrades, artwork, live infrastructure, push and main promotion.


## Merge closing checks and cleanup

Merge/tree equality and unchanged application-input checks pass. Fresh closing
records checks on Node **22.23.4**: tracker ledger **2/2**,
`python3 /private/tmp/w64-coordinator-links.py` **142 local targets / 8 Markdown
files**, and `git diff --check`, all exit 0. The full application gate is retained
for the identical merge tree; no full suite/build/browser matrix was repeated.

The merged feature and assessment branches were deleted after ancestor/worktree
checks. Their commits remain in develop. No server was stopped, no push or
deployment occurred, and main is unchanged.

## Language/framework sheet direction

The user wants the five pending sheets (JavaScript, Python, Java, Spring Boot,
Express & Node) to cover fundamentals, important concepts and interview-relevant
material, with activities inside each. Keep the result selective and shorter
than a general tutorial site. [W-6.3u](docs/task.md) and D-101 in the
[tracker](docs/tracker.md) hold the brief and scope.

A proposed starting budget is 6–10 selected topics and 3–4 short activities per
sheet. Blend concise explanation/examples with representative explain/predict/
debug/choose prompts and small coding tasks; let readers attempt before revealing
a solution and its reasoning. These counts/formats are coordinator recommendations,
not user-prescribed limits. No activity widget or exact topic list is selected.

Current sheet data and renderer handle static rows/examples. Activities extend
that contract; assess a small optional representation, web interaction and useful
generated-Markdown prompts/solutions. Use existing patterns when they fit and
D-99's design/compact plan, TDD for behavior and independent final branch review.
Do not redesign completed sheets or the native Default Stack page.

## Next task and session

**Task:** JavaScript study-sheet source and scope assessment under D-101.
**Recommended model:** `gpt-6-astra`, **reasoning:** `low`, research session or the
existing coordinator. This recommendation does not confirm an active setting.

Start the JavaScript research branch from this brief branch's committed tip so
D-101 and the task brief remain in its history; record the exact SHA. Inspect the
JavaScript entry in [planned sheets](web/src/lib/cheatsheets/planned.ts), existing
reference content, [W-6.3u](docs/task.md) and gathered-source provenance. Choose a
bounded fundamental/interview topic list and activities rather than a whole
language course. Verify primary language/platform sources; treat interview prompts
as representative unless frequency claims have evidence. State version/context
and check runnable examples, including browser/Node differences when relevant.
Record provenance and license limits for any useful graphic.

Keep findings in one research record with the topic/activity selection, examples,
source limitations and proposed shared activity contract. This assessment may
recommend the smallest reusable support needed for JavaScript; the other four
sheets remain separate delivery slices. No sheet implementation, browser code
runner, persistent score or runtime provisioning is preselected.

Use D-99 content/link checks for research-only work. After scope/design selection,
implementation uses a fresh user-selected **GPT-6.1 Sol / High** session with an
explicit acceptance handoff. The W-6.4 inline override does not carry forward.
Coordinator remains **01a18acc-3b54-7202-92f3-404cc94fd0ad**; future no-ff merges
require separate approval, and main promotion belongs to the user.

## Brief closing checks

Fresh checks on Node **22.23.4**: tracker ledger **2/2** via
`pnpm test src/lib/tracker-ledger.test.ts --maxWorkers=1`,
`python3 /private/tmp/language-sheet-brief-links.py` **125 local targets /
3 Markdown files**, and `git diff --check`, all exit 0. Self-review and the
humanizer editing pass applied to the new prose. This branch changes records
only; application checks remain attached to the W-6.4 application/merge trees
above. No app suite, build or browser rerun was needed.
