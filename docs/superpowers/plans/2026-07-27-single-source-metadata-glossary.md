# Single Source of Truth: Metadata (TD-2) + Glossary (TD-3) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Make `terms.ts` the single source for the glossary (generating `reference/glossary.md` as a vitest file snapshot), and guard stage-title/blurb duplication with a metadata sync test.

**Architecture:** TD-3 — `Term` gains `name` + optional `see`; the 16 doc-only glossary terms migrate into `terms.ts`; a pure `renderGlossary()` produces the markdown, asserted against the committed file via `toMatchFileSnapshot`. TD-2 — a test parses each stage doc's H1 and blurb and asserts they equal `stages.ts`. No new tooling or dependencies.

**Tech Stack:** TypeScript, vitest 4 (`toMatchFileSnapshot`), Node 22 / pnpm 10.

**Spec:** `docs/superpowers/specs/2026-07-27-single-source-metadata-glossary-design.md`

## Global Constraints

- No new dependencies. All commands run from `web/`. Tests are vitest; typecheck via `pnpm typecheck`.
- Style: single quotes, no semicolons, 2-space indent; lint at `--max-warnings 0`.
- `reference/glossary.md` is at the repo root; from a test in `web/src/lib/` its path is `../../../reference/glossary.md`.
- The existing `terms.test.ts` invariant (every term has non-empty `short` and `full`) stays green.
- TDD: failing test first, for the right reason; paste RED and GREEN; a teeth check per task.
- Branch `fix/single-source-metadata-glossary`. Conventional Commits, lowercase after colon, trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Glossary generation includes **every** term in `terms.ts` (the 18→35 growth is intended; see Task 4).

---

### Task 1: Metadata sync test (closes TD-2)

**Files:**
- Create: `web/src/lib/stage-metadata.test.ts`

**Interfaces:**
- Consumes: `STAGES` from `./stages` (each `{ num, slug, title, blurb, ... }`).

Fully independent of the glossary work — a self-contained closure of TD-2.

- [ ] **Step 1: Write the test**

Create `web/src/lib/stage-metadata.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { STAGES } from './stages'

// The stage title and blurb live in two places — the doc's H1 + blurb line, and
// stages.ts. Nothing else kept them equal (TD-2). This asserts they match for
// every stage, so a future edit to one side fails here instead of drifting
// silently. The doc's longer "When this actually happens" line is deliberately a
// different form of `timing` and is not checked.

const docPath = (slug: string) =>
  fileURLToPath(new URL(`../../../docs/${slug}.md`, import.meta.url))

/** First H1 in the doc, with the "NN. " number prefix stripped. */
function docTitle(md: string): string {
  const h1 = md.match(/^#\s+(.+)$/m)?.[1] ?? ''
  return h1.replace(/^\d+\.\s*/, '').trim()
}

/** First blockquote line, with the leading "> " stripped. */
function docBlurb(md: string): string {
  const line = md.match(/^>\s+(.+)$/m)?.[1] ?? ''
  return line.trim()
}

test.each(STAGES.map((s) => [s.slug, s] as const))(
  '%s: doc H1 title and blurb match stages.ts',
  (slug, stage) => {
    const md = readFileSync(docPath(slug), 'utf8')
    expect(docTitle(md), `${slug} H1 title`).toBe(stage.title)
    expect(docBlurb(md), `${slug} blurb`).toBe(stage.blurb)
  },
)
```

- [ ] **Step 2: Run it — confirm it passes (they currently agree)**

Run: `cd web && pnpm test -- stage-metadata`
Expected: PASS for all 18. (The two copies are currently in sync; this test now keeps them so.)

- [ ] **Step 3: Teeth check — prove it can fail on each side**

Temporarily change stage 01's `blurb` in `stages.ts` (add a word). Run `pnpm test -- stage-metadata`. Expected: exactly the `01-product-discovery: doc H1 title and blurb match stages.ts` case FAILS on the blurb assertion. Restore. Then temporarily edit the H1 in `docs/02-planning.md` (change "Product Planning" to "Planning"); confirm only stage 02 fails on the title assertion; restore. Paste both.

- [ ] **Step 4: Commit**

```bash
git add web/src/lib/stage-metadata.test.ts
git commit -m "$(cat <<'MSG'
test(web): assert stage title and blurb match between docs and stages.ts (TD-2)

Closes the metadata duplication with detection rather than generation: the docs
stay hand-written, and a drift between a doc's H1/blurb and stages.ts now fails a
test instead of going unnoticed.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 2: Add `name` (and optional `see`) to the Term type and all existing terms

**Files:**
- Modify: `web/src/lib/terms.ts` (type + `name`/`see` on the 19 existing terms)
- Modify: `web/src/lib/terms.test.ts` (require `name`; validate `see`)

**Interfaces:**
- Produces: `Term` now `{ name: string; short: string; full: string; soWhat?: string; see?: string }`.

- [ ] **Step 1: Write the failing test additions**

Append to `web/src/lib/terms.test.ts`:

```ts
test('every term has a non-empty display name, since the glossary is generated from it', () => {
  for (const [id, t] of Object.entries(TERMS)) {
    expect(t.name?.trim().length, `${id} has no name`).toBeGreaterThan(0)
  }
})

test('every term’s see (when present) is a real stage slug', () => {
  for (const [id, t] of Object.entries(TERMS)) {
    if (t.see) expect(getStage(t.see), `${id} see=${t.see}`).toBeDefined()
  }
})
```

Add `getStage` to the existing `./stages`/imports line in the test if not already imported.

- [ ] **Step 2: Run — verify it fails**

Run: `cd web && pnpm test -- terms`
Expected: FAIL — `<id> has no name` (the `name` field does not exist yet).

- [ ] **Step 3: Update the type**

In `web/src/lib/terms.ts`, change the `Term` type to:

```ts
export type Term = {
  /** Display heading for the generated glossary, e.g. 'ADR (Architecture Decision Record)'. */
  name: string
  short: string
  full: string
  /** Why a practitioner should care — the part a dictionary would omit. */
  soWhat?: string
  /** A stage slug this term is most associated with, for the glossary's "See" link. */
  see?: string
}
```

- [ ] **Step 4: Add `name` and `see` to every existing term**

Add a `name:` line (and `see:` where given) to each of the 19 existing terms per this map. Do not change any existing `short`/`full`/`soWhat`.

| slug | `name` | `see` |
|---|---|---|
| product-discovery | Product discovery | 01-product-discovery |
| opportunity-solution-tree | Opportunity solution tree | 01-product-discovery |
| jobs-to-be-done | Jobs to be done (JTBD) | — |
| concierge-test | Concierge test | — |
| fake-door-test | Fake-door test | — |
| survivorship-bias | Survivorship bias | — |
| leading-question | Leading question | — |
| tam | TAM (Total Addressable Market) | — |
| npm | npm | 04-project-setup |
| pnpm | pnpm | 04-project-setup |
| problem-interview | Problem interview | 01-product-discovery |
| switching-cost | Switching cost | — |
| mvp | MVP (Minimum Viable Product) | 02-planning |
| product-roadmap | Product roadmap | 02-planning |
| product-vision | Product vision | 02-planning |
| appetite | Appetite | 02-planning |
| vertical-slice | Vertical slice | 02-planning |
| spike | Spike | 02-planning |
| feasibility-risk | Feasibility risk | 02-planning |

(19 rows for the 19 existing terms — the table is complete. Verify against the file's keys before editing; there is no 20th.)

- [ ] **Step 5: Run — verify pass**

Run: `cd web && pnpm test -- terms`
Expected: PASS (all name/see invariants green; existing short/full invariant still green).

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/terms.ts web/src/lib/terms.test.ts
git commit -m "$(cat <<'MSG'
feat(web): add a display name and optional see-link to every glossary term

Prepares terms.ts to be the single glossary source: a `name` heading the markdown
cannot derive from a slug, and a `see` stage-link for the glossary's cross-refs.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 3: Migrate the 16 doc-only glossary terms into `terms.ts`

**Files:**
- Modify: `web/src/lib/terms.ts` (append 16 terms)

**Interfaces:**
- Produces: `terms.ts` now holds all glossary terms (35 total). Task 4 renders them.

The `full` values are ported from `reference/glossary.md`; `short` and `soWhat` are authored to the house shape. Add these entries to `TERMS`:

```ts
  adr: {
    name: 'ADR (Architecture Decision Record)',
    short: 'A short document capturing one decision: context, choice, consequences.',
    full: 'A short record of a single architecture decision — the context, the choice, and the consequences — written when the decision is made and never edited afterward. Superseded by a new ADR rather than revised.',
    soWhat:
      'The value is the record of what was believed at the time. Months later, “why did we do it this way?” has an answer instead of a reconstruction.',
    see: '03-architecture',
  },
  'blast-radius': {
    name: 'Blast radius',
    short: 'How much breaks when this breaks.',
    full: 'The reach of a change or a failure: how much of the system is affected when this one piece goes wrong.',
    soWhat:
      'It sets how carefully you ship. A small blast radius can go out casually; a large one needs a gate, a canary, and a rollback plan.',
    see: '03-architecture',
  },
  canary: {
    name: 'Canary',
    short: 'Releasing to a small fraction of traffic before everyone.',
    full: 'Releasing a change to a small slice of traffic first, watching it, then widening. On Vercel it is approximated with skew protection and staged rollouts rather than true traffic splitting.',
    soWhat:
      'It turns a deploy into an experiment with an escape hatch: a failure shows up on 1% of users, not 100%.',
    see: '13-production-deployment',
  },
  'definition-of-done': {
    name: 'Definition of done',
    short: 'The checkable state that separates “works on my machine” from “this stage is complete.”',
    full: 'A specific, checkable statement of what “done” means for a piece of work — a state you can hold the running product up against and confirm, yes or no. Every stage doc has one.',
    soWhat:
      'Without it, “done” is an opinion and scope stays arguable forever. With it, a feature request has a boundary to be judged against.',
  },
  'error-budget': {
    name: 'Error budget',
    short: 'The amount of failure you have decided is acceptable in a period.',
    full: 'The failure you have decided is acceptable over a window. A 99.9% uptime target is roughly a 43-minute monthly budget. Spending it is allowed — that is what a budget is for; exceeding it means stop shipping features and fix reliability.',
    soWhat:
      'It turns “is it reliable enough?” from an argument into arithmetic, and gives the feature-versus-reliability call a rule instead of a mood.',
    see: '15-observability',
  },
  'golden-signals': {
    name: 'Golden signals',
    short: 'Latency, traffic, errors, saturation — the four things to instrument first.',
    full: 'The four measurements to instrument before any others: latency, traffic, errors, and saturation. If you watch only four things, watch these.',
    soWhat:
      'They cover most of what actually pages you, so you get the bulk of observability value for a small, fixed amount of instrumentation.',
    see: '15-observability',
  },
  'merge-gate': {
    name: 'Merge gate',
    short: 'The automated checks that must pass before code reaches main.',
    full: 'The set of automated checks that must pass before code merges to the main branch. Distinct from deployment: the gate protects the branch, the deploy ships it.',
    soWhat:
      'It is where “works on my machine” stops being anyone’s problem. Added late it is a fight; wired on day one it is invisible.',
    see: '11-ci-cd',
  },
  'phantom-dependency': {
    name: 'Phantom dependency',
    short: 'A package you import but never declared, working only by accident.',
    full: 'A package your code imports but never listed in package.json. It resolves only because some other dependency happened to pull it into a flat node_modules, and it breaks mysteriously when that package updates or drops it.',
    soWhat:
      'It is why this playbook picks pnpm: the strict layout makes a phantom import fail on your machine today instead of in CI next month.',
    see: '04-project-setup',
  },
  'preview-deployment': {
    name: 'Preview deployment',
    short: 'A full, isolated deployment of a branch, with its own URL.',
    full: 'A complete, isolated deployment of a single branch at its own URL — automatic per pull request on Vercel. Not the same as staging.',
    soWhat:
      'It lets anyone see the change running as a real build before it merges, which catches what a local dev server cannot.',
    see: '12-staging',
  },
  'production-grade': {
    name: 'Production-grade',
    short: 'Someone other than you depends on it working.',
    full: 'The state where someone other than you depends on the software working. It is about consequences, not scale: ten paying users make software production-grade; ten thousand on a toy do not.',
    soWhat:
      'It is the baseline assumption of the whole playbook — solo, but with something real depending on the result — and it is what separates rigor from ceremony.',
  },
  rollback: {
    name: 'Rollback',
    short: 'Returning production to the previous known-good state.',
    full: 'Returning production to the last known-good state. On Vercel it is promoting a prior deployment, which takes seconds — but it is not automatic for database migrations, which is why migrations get careful, separate treatment.',
    soWhat:
      'A deploy you can undo in seconds is a deploy you can make casually. The asymmetry with database changes is the whole reason migrations are handled apart.',
    see: '13-production-deployment',
  },
  'skew-protection': {
    name: 'Skew protection',
    short: 'Letting a browser on old client JS still talk to the server after a deploy.',
    full: 'Ensuring a browser still running the previous client JavaScript can talk to the server after a new deploy. Without it, users mid-session hit errors every time you ship.',
    soWhat:
      'It is the difference between deploying whenever you like and only deploying when nobody is using the app.',
    see: '13-production-deployment',
  },
  'smoke-test': {
    name: 'Smoke test',
    short: 'A small set of checks confirming the critical paths work after a deploy.',
    full: 'A small set of checks confirming the critical paths still work after a deploy. Not comprehensive by design; it answers “is this catastrophically broken?” in under a minute.',
    soWhat:
      'It is the cheapest insurance in shipping: a minute of checks between “deployed” and “walked away” catches the failures that otherwise page you at night.',
    see: '14-post-deployment-verification',
  },
  slo: {
    name: 'SLO (Service Level Objective)',
    short: 'The reliability target you commit to, e.g. “99.9% of requests succeed.”',
    full: 'The reliability target you commit to — for example, “99.9% of requests succeed.” Meaningful only if you have decided in advance what happens when you miss it.',
    soWhat:
      'An SLO without a consequence is a wish. Paired with an error budget, it becomes the rule that governs when you ship and when you stop.',
    see: '15-observability',
  },
  traps: {
    name: 'Traps',
    short: 'The last section of every stage doc: failure modes worth naming.',
    full: 'The closing section of every stage doc — the failure modes worth naming. They accumulate from real experience and become the most valuable part of the playbook over time.',
    soWhat:
      'Generic advice ages; the specific traps you actually hit do not. Adding to them is what turns a borrowed playbook into your own.',
  },
  yagni: {
    name: 'YAGNI (You Aren’t Gonna Need It)',
    short: 'Do not build for requirements you have imagined rather than encountered.',
    full: 'You Aren’t Gonna Need It: do not build for requirements you have imagined rather than met. The most common cause of accidental complexity.',
    soWhat:
      'Half the advice in this playbook is a specific application of it — the “not now” list, the MVP cut, deferring architecture. When in doubt, do less.',
  },
```

- [ ] **Step 1: Add the 16 terms above to `TERMS`.**

- [ ] **Step 2: Run the term invariants**

Run: `cd web && pnpm test -- terms`
Expected: PASS — all 35 terms have non-empty `name`/`short`/`full`; every `see` resolves to a real stage.

- [ ] **Step 3: Humanizer the new prose**

Invoke `humanizer:humanizer` over the 16 new terms' `short`/`full`/`soWhat` only. Keep em-dashes (house voice); use `-ize` spelling. Apply clarity fixes; skip voice-flatteners.

- [ ] **Step 4: Commit**

```bash
git add web/src/lib/terms.ts
git commit -m "$(cat <<'MSG'
feat(web): migrate the 16 doc-only glossary terms into terms.ts

Ports ADR, blast radius, canary, error budget, golden signals, and the rest from
reference/glossary.md into the richer {name, short, full, soWhat, see} shape, so
terms.ts is now the single glossary source. Several are used inline by stage 03+.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 4: The generator and the glossary snapshot (closes TD-3)

**Files:**
- Create: `web/src/lib/glossary.ts` (`renderGlossary()`)
- Create: `web/src/lib/glossary.test.ts` (snapshot against `reference/glossary.md`)
- Regenerate: `reference/glossary.md`

**Interfaces:**
- Consumes: `TERMS`, `Term` from `./terms`; `getStage` from `./stages`.
- Produces: `renderGlossary(): string`.

Every term in `TERMS` renders — the glossary grows from 18 to 35, now including the discovery/planning/setup terms (npm, pnpm, MVP, etc.) that previously lived only as inline definitions. This is intended: one source, complete coverage.

- [ ] **Step 1: Write the generator**

Create `web/src/lib/glossary.ts`:

```ts
import { TERMS } from './terms'
import { getStage } from './stages'

/**
 * Renders reference/glossary.md from TERMS. terms.ts is the single source; the
 * markdown is a generated snapshot, kept in sync by glossary.test.ts and
 * regenerated with `pnpm test -u`. Do not hand-edit the markdown.
 */
export function renderGlossary(): string {
  const intro = [
    '# Glossary',
    '',
    '<!-- Generated from web/src/lib/terms.ts. Do not edit by hand.',
    '     Edit the term there and run `pnpm test -u` (from web/) to regenerate. -->',
    '',
    'Terms used across the stage docs, defined once. Authored in `terms.ts` and',
    'generated here, so the inline definitions in the app and this reference cannot',
    'drift apart.',
    '',
    '---',
    '',
  ].join('\n')

  const entries = Object.values(TERMS)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((t) => {
      const stage = t.see ? getStage(t.see) : undefined
      const link = stage
        ? ` See [${stage.num} — ${stage.title}](../docs/${stage.slug}.md).`
        : ''
      return `**${t.name}** — ${t.full}${link}`
    })

  return `${intro}${entries.join('\n\n')}\n`
}
```

- [ ] **Step 2: Write the snapshot test**

Create `web/src/lib/glossary.test.ts`:

```ts
import { expect, test } from 'vitest'
import { renderGlossary } from './glossary'

// reference/glossary.md is a generated snapshot of terms.ts. This fails if a term
// changed without regenerating (`pnpm test -u` from web/). The file lives at the
// repo root, three levels up from here.
test('reference/glossary.md is in sync with terms.ts', async () => {
  await expect(renderGlossary()).toMatchFileSnapshot(
    '../../../reference/glossary.md',
  )
})
```

- [ ] **Step 3: Run — verify it FAILS against the current hand-written glossary**

Run: `cd web && pnpm test -- glossary`
Expected: FAIL — the committed `reference/glossary.md` (18 hand-written terms) differs from `renderGlossary()` (35 generated). This is the RED that proves the drift the round exists to kill.

- [ ] **Step 4: Regenerate the snapshot**

Run: `cd web && pnpm test -- glossary -u`
Expected: PASS — `reference/glossary.md` is rewritten from `terms.ts`.

- [ ] **Step 5: Eyeball the generated glossary**

Open `reference/glossary.md`. Confirm: the generated header/intro is present, terms are alphabetical by `name`, each `See [NN — Title]` link points at `../docs/<slug>.md` and resolves, and the register reads like a glossary. Fix the template in `glossary.ts` (not the markdown) if anything is off, then re-run `-u`.

- [ ] **Step 6: Teeth check**

Change one term's `full` in `terms.ts` (add a word). Run `pnpm test -- glossary` (no `-u`). Expected: FAIL (snapshot mismatch). Revert; re-run; PASS.

- [ ] **Step 7: Full suite + build**

Run: `cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
Expected: all green; 22 routes prerender.

- [ ] **Step 8: Commit**

```bash
git add web/src/lib/glossary.ts web/src/lib/glossary.test.ts reference/glossary.md
git commit -m "$(cat <<'MSG'
feat(web): generate reference/glossary.md from terms.ts (closes TD-3)

renderGlossary() renders every term; a toMatchFileSnapshot test keeps the
committed markdown in sync (regenerate with `pnpm test -u`). The glossary grows
from 18 hand-written to 35 generated terms — one source, no drift.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 5: Records and doc pointers

**Files:**
- Modify: `README.md`, `CLAUDE.md`, `web/PATTERNS.md`, `docs/task.md`, `docs/tracker.md`

- [ ] **Step 1: Doc pointers**

- `README.md`: keep the "What does that word mean? → reference/glossary.md" line; add that the glossary is generated from `web/src/lib/terms.ts`.
- `CLAUDE.md` and `web/PATTERNS.md`: note that glossary terms are authored in `terms.ts` and the markdown is generated (`pnpm test -u` regenerates); the `<Term>` component and the reference glossary share one source now.

- [ ] **Step 2: tracker**

Close TD-2 and TD-3 (strike-through with the date, cite the tests and `renderGlossary`). Add **D-36**: terms.ts is the single glossary source with snapshot generation, and stage metadata is guarded by detection not generation; record why doc-header generation was rejected. Note the glossary grew 18→35 by design.

- [ ] **Step 3: task.md**

Mark the "Settle before stage 03: TD-2 and TD-3" note resolved; stage 03 is now unblocked.

- [ ] **Step 4: Commit**

```bash
git add README.md CLAUDE.md web/PATTERNS.md docs/task.md docs/tracker.md
git commit -m "$(cat <<'MSG'
docs(tracker): close TD-2 and TD-3; single source for metadata and glossary (D-36)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Verification (after all tasks)

1. `cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build` — all green.
2. `pnpm test -- glossary` passes; changing a term without `-u` fails it (drift caught).
3. `pnpm test -- stage-metadata` passes; editing a doc H1 or a `stages.ts` blurb makes exactly that stage fail.
4. `reference/glossary.md` reads as a real glossary on GitHub: alphabetical, links resolve, generated-header present.
5. A stage-01 `<Term>` popover still opens in the browser (the migrated schema did not break inline rendering).
6. Records updated: TD-2/TD-3 struck through, D-36 added, task.md unblocked.
