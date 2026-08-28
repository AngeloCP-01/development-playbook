# Stage 07 — Code Review: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `docs/07-code-review.md` into six interactive panels at `/stages/07-code-review`, with two scored exercises (ReviewDrill, SeverityDrill) as the stage's signature interactions.

**Architecture:** Six-panel Stepper layout. Two new drill components (ReviewDrill for code-issue classification, SeverityDrill for review-comment severity). Standard patterns from stages 01–06 for AIPlays, checklist, traps. Doc gains two sections (AI in code review, Comment with severity) before any data module reads it.

**Tech Stack:** Next.js 16 (App Router, server components), React 19, TypeScript, Tailwind 4, Vitest, `@testing-library/react` with `fireEvent` + plain DOM assertions.

**Spec:** `docs/superpowers/specs/2026-08-28-stage-07-code-review-design.md`

## Global Constraints

- **`fireEvent` + plain DOM assertions only.** No `jest-dom`, no `user-event`. Use `el.getAttribute(...)`, `(el as HTMLInputElement).checked`, `container.innerHTML`. Reference: `src/features/testing/TriageDrill.test.tsx`.
- **No `setState` in an effect body.** `react-hooks/set-state-in-effect` is an error. Use `useSyncExternalStore` for storage reads (`src/lib/useLocalStorage.ts`).
- **Cite doc by heading, not line number.** Use `section('heading')`, `h2('heading')`, `flat()` from `doc-source.ts`. Never use dotAll flag (`s`), never match single-space against hard-wrapped doc.
- **Pin a phrase from each sentence.** Where a passage is two sentences, the pin from the second is mandatory. This is the guard against silent drops.
- **Lift code blocks, do not retype.** `sed -n 'START,ENDp' docs/07-code-review.md` → paste into data module. Use `fences()` to test against the doc's own fenced blocks.
- **Assert literals in render tests, never values derived from the data being tested.** `expect(screen.getByText('1/1 right'))` — not `expect(score).toBe(String(correct))`.
- **All files in `web/src/features/code-review/`.** Flat directory, no subdirectories. Same layout as `src/features/testing/`.
- **`InlineCode` for doc-sourced strings.** Any string rendered from a data module that may contain backticks goes through `<InlineCode text={...} />`.
- **Teeth-check traps.** Confirm a mutation actually landed in the file before trusting the run. Never write `expect(rendered).toBe(String(row.field))`.
- **Branch: `feat/stage-07-code-review`.** Merges to `develop` only when the user says so.
- **Run all commands from `web/`.** `cd /Users/angelito/personal/Development-Playbook/web` first.

---

### Task 1: Doc Corrections

**Files:**
- Modify: `docs/07-code-review.md`

**Interfaces:**
- Consumes: nothing
- Produces: `### AI in code review` section (anchored by heading for `section()` in later tests), `### Comment with severity` section under `## Scaling to a team`

This task modifies the canonical markdown doc only. No app code. Committed separately before any data module reads the doc, so that tests in later tasks can anchor to headings that exist.

- [ ] **Step 1: Create the feature branch**

```bash
cd /Users/angelito/personal/Development-Playbook
git checkout develop
git pull
git checkout -b feat/stage-07-code-review
```

- [ ] **Step 2: Add `### AI in code review` section to the doc**

Insert after the `### Automated review has a place` section (after line 132), before the `---` that precedes `## Artifacts`:

```markdown

### AI in code review

AI review tools — GitHub Copilot, CodeRabbit, or a custom static-analysis pass — catch a
real class of issue: null-reference paths, missing error handling, unhandled promise
rejections, simple logic inversions. They do not get tired, and they do not assume they
already know what the code does.

What they miss is everything that requires judgment. Whether the authorization model is
right. Whether the abstraction fits the domain. Whether the change should have been made at
all. Whether a test is vacuous — passing for the wrong reason. AI-generated code produces
roughly 1.7× more issues per PR than human-written code, and the natural instinct is to
review it *less* carefully, because it looks clean.

Use AI review as a first pass: let it run before you request human review. Fix the
mechanical issues it surfaces — the leftover `console.log`, the missing null check — so the
human reviewer gets a cleaner diff and spends their attention on the parts machines cannot
judge. That split is the point: AI handles the checklist items, humans handle the judgment
calls.

The anti-pattern is treating AI review as the review. Agent-authored PRs get reviewed less
often, merged faster, and discussed less — which is exactly the erosion that turns review
from a quality gate into ceremony.
```

- [ ] **Step 3: Add `### Comment with severity` section under `## Scaling to a team`**

Insert after the existing six bullet points in `## Scaling to a team` (after line 169), before the `---` that precedes `## Traps`:

```markdown

### Comment with severity

Label every review comment so the author knows what blocks the merge and what does not.
Without labels, every comment reads as a same-weight demand and reviews turn adversarial.

Three blocking tiers and one non-blocking:

- **Critical** — data loss, security breach, or production outage if merged. The migration
  that drops a column before backfilling the new one. The query filtered by a client-supplied
  ID with no ownership check.
- **Important** — a correctness or UX bug the user will hit. The empty catch block that
  leaves a loading spinner stuck. A test that passes without the change.
- **Minor** — a real issue, not blocking. Duplicated logic across three handlers. A name
  that is vague but not misleading.
- **Nit** — polish. A rename suggestion. A formatting preference the linter does not
  enforce.

Tag each finding with an ID (`C1`, `I1`, `M1`, `N1`) so follow-ups can reference it
without quoting the whole comment. Where provenance matters — and it does — mark whether the
finding is new in this PR, pre-existing (`PRE-EXISTING`), or introduced by the plan rather
than the implementer (`PLAN-AUTHORED ERROR`). The distinction changes who fixes it and
whether it blocks this merge.

A reviewer is expected to disprove as well as confirm. If you wrote "this is a security
issue" and then discover it is not, say so and retract the finding — a retracted finding is
more useful than a wrong one left standing.
```

- [ ] **Step 4: Verify cross-stage anchors are intact**

```bash
cd /Users/angelito/personal/Development-Playbook/web
pnpm test -- --run src/test/source-citations.test.ts
```

Expected: PASS. No existing headings were renamed; only new headings were added.

- [ ] **Step 5: Run `humanizer:humanizer` over the two new sections**

Apply only the fixes that make the writing clearer. Skip any that would flatten the doc's direct voice.

- [ ] **Step 6: Commit**

```bash
git add docs/07-code-review.md
git commit -m "docs(code-review): add AI-in-review and comment-with-severity sections

D-35 mandate: every stage carries an AI section.
P-6 convention: review severity (Critical/Important/Minor/Nit),
finding IDs, provenance tags, disprove-as-well-as-confirm.
Both sections committed before any data module reads the doc.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Scaffold, Glossary, References

**Files:**
- Create: `web/src/features/code-review/steps.ts`
- Create: `web/src/features/code-review/steps.test.ts`
- Create: `web/src/features/code-review/doc-source.ts`
- Create: `web/src/features/code-review/prose.test.ts`
- Modify: `web/src/lib/terms.ts`
- Modify: `web/src/lib/references.ts`
- Modify: `web/src/components/References.test.tsx`
- Modify: `web/src/features/step-ids.ts`

**Interfaces:**
- Consumes: `docSource` from `@/test/doc-source`, `TERMS` type from `@/lib/terms`, `REFERENCES` / `Reference` type from `@/lib/references`
- Produces: `STEP_IDS` tuple and `StepId` type (used by Task 8), `doc-source.ts` exports `DOC`, `section`, `h2`, `flat`, `fences` (used by Tasks 3–7), `prose.test.ts` auto-discovers siblings (no later edits needed)

- [ ] **Step 1: Write the failing steps test**

Create `web/src/features/code-review/steps.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('code-review step IDs', () => {
  test('six steps in order', () => {
    expect([...STEP_IDS]).toEqual([
      'self-review',
      'what-to-find',
      'pr-discipline',
      'team',
      'ai',
      'traps',
    ])
  })

  test('all IDs are unique', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/angelito/personal/Development-Playbook/web
pnpm test -- --run src/features/code-review/steps.test.ts
```

Expected: FAIL — `./steps` module not found.

- [ ] **Step 3: Write steps.ts**

Create `web/src/features/code-review/steps.ts`:

```ts
export const STEP_IDS = [
  'self-review',
  'what-to-find',
  'pr-discipline',
  'team',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- --run src/features/code-review/steps.test.ts
```

Expected: PASS.

- [ ] **Step 5: Create doc-source.ts**

Create `web/src/features/code-review/doc-source.ts`:

```ts
import { docSource } from '@/test/doc-source'

export const { DOC, section, h2, flat, fences } = docSource(
  'docs/07-code-review.md',
)
```

- [ ] **Step 6: Create prose.test.ts**

Create `web/src/features/code-review/prose.test.ts`. This is structurally identical to `src/features/testing/prose.test.ts` — it auto-discovers sibling `.ts` and `.tsx` files and fails if any authored prose string carries markdown link syntax (`[text](url)`), since `InlineCode` does not render it. Copy the file from `src/features/testing/prose.test.ts` verbatim — it is self-contained and discovers its own siblings via `import.meta.url`.

- [ ] **Step 7: Run prose test to verify it passes (no siblings yet)**

```bash
pnpm test -- --run src/features/code-review/prose.test.ts
```

Expected: PASS (no data modules to scan yet).

- [ ] **Step 8: Add four glossary terms to terms.ts**

Add to `web/src/lib/terms.ts` inside the `TERMS` record:

```ts
  'rubber-stamping': {
    name: 'Rubber-stamping',
    short: 'Approving a change without genuine review.',
    full: 'Approving code changes without reading them carefully — clicking "approve" based on green CI, a clean-looking diff, or trust in the author rather than on what the code actually does.',
    soWhat: 'The merge gate exists to catch what the author missed. Bypassing it means defects reach production with two names on them.',
    see: '07-code-review',
  },
  'provenance': {
    name: 'Provenance (review)',
    short: 'Tracking whether a finding was introduced, pre-existing, or plan-authored.',
    full: 'A tag on a review finding that says where the defect came from: new in this PR, already present in the codebase (PRE-EXISTING), or introduced by the plan itself (PLAN-AUTHORED ERROR). The distinction changes who fixes it and whether it blocks this merge.',
    see: '07-code-review',
  },
  'finding-severity': {
    name: 'Finding severity',
    short: 'Critical / Important / Minor / Nit classification for review comments.',
    full: 'A label on every review comment that tells the author what blocks the merge and what does not. Critical means data loss or security breach. Important means a bug the user will hit. Minor is real but non-blocking. Nit is polish.',
    soWhat: 'Without labels, every comment reads as a same-weight demand and reviews turn adversarial.',
    see: '07-code-review',
  },
  'self-review': {
    name: 'Self-review',
    short: 'Reviewing your own code with techniques to defeat cognitive bias.',
    full: 'Deliberately breaking the state that makes reviewing your own code useless — you are still holding the intent, so you read what you meant rather than what you wrote. Three techniques: create distance, read the diff not the code, and explain it out loud.',
    see: '07-code-review',
  },
```

Also update the existing `teeth-check` term if it does not already have `see: '07-code-review'` — the doc links back to 06's teeth check:

```ts
  // If teeth-check already exists, ensure see includes both stages.
  // The term's see field is a single slug; leave it pointing to 06-testing
  // since that's where the concept is taught. Stage 07 cross-links to it.
```

- [ ] **Step 9: Add four references for stage 07**

Add to `web/src/lib/references.ts` inside the `REFERENCES` record:

```ts
  '07-code-review': [
    {
      title: 'Best Practices for Code Review',
      source: 'SmartBear / Cisco Systems',
      url: 'https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/',
      adds: 'The canonical study: 2,500 reviews across 50 developers over 10 months. Source for the 200–400 LOC ceiling and the 60-minute session limit.',
    },
    {
      title: 'How to do a code review',
      source: 'Google Engineering Practices',
      url: 'https://google.github.io/eng-practices/review/',
      adds: 'Google’s minimalist severity system (Nit / Optional / FYI / unmarked) and the principle that every CL should leave the codebase better than it found it.',
    },
    {
      title: 'Conventional Comments',
      source: 'conventionalcomments.org',
      url: 'https://conventionalcomments.org/',
      adds: 'The label-decorated review comment format adopted by GitLab. Nine labels with blocking/non-blocking decorations.',
    },
    {
      title: 'Expectations, Outcomes, and Challenges of Modern Code Review',
      source: 'Bacchelli & Bird, ICSE 2013',
      url: 'https://dl.acm.org/doi/10.5555/2486788.2486882',
      adds: 'The Microsoft study showing knowledge transfer — not defect detection — is the primary actual outcome of review.',
    },
  ],
```

- [ ] **Step 10: Update References.test.tsx fixture**

In `web/src/components/References.test.tsx`, find the test:

```ts
test('renders nothing for a stage with no references, since it ships in all eighteen', () => {
  const { container } = render(<References slug="07-code-review" />)
  expect(container.innerHTML).toBe('')
})
```

Change `"07-code-review"` to `"08-refactoring"`:

```ts
test('renders nothing for a stage with no references, since it ships in all eighteen', () => {
  const { container } = render(<References slug="08-refactoring" />)
  expect(container.innerHTML).toBe('')
})
```

- [ ] **Step 11: Register step IDs in step-ids.ts**

In `web/src/features/step-ids.ts`, add the import and entry:

```ts
import { STEP_IDS as CODE_REVIEW } from './code-review/steps'

// Inside STEP_IDS_BY_SLUG:
  '07-code-review': CODE_REVIEW,
```

- [ ] **Step 12: Run all tests to verify nothing is broken**

```bash
pnpm test -- --run
```

Expected: PASS. The References fixture now points at 08, which has no references. Terms compile. Step IDs registered.

- [ ] **Step 13: Regenerate glossary**

```bash
pnpm gen:glossary
```

Verify `reference/glossary.md` includes the four new terms.

- [ ] **Step 14: Commit**

```bash
git add web/src/features/code-review/ web/src/lib/terms.ts web/src/lib/references.ts \
  web/src/components/References.test.tsx web/src/features/step-ids.ts reference/glossary.md
git commit -m "feat(code-review): scaffold step IDs, doc-source, glossary, references

Six-step tuple, four new terms (rubber-stamping, provenance,
finding-severity, self-review), four outward references (SmartBear,
Google, Conventional Comments, Bacchelli & Bird).
References.test.tsx fixture repointed to 08-refactoring.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Panel 1 — Self-Review (data + SelfReviewMatch)

**Files:**
- Create: `web/src/features/code-review/self-review.ts`
- Create: `web/src/features/code-review/self-review.test.ts`
- Create: `web/src/features/code-review/SelfReviewMatch.tsx`
- Create: `web/src/features/code-review/SelfReviewMatch.test.tsx`

**Interfaces:**
- Consumes: `section`, `flat` from `./doc-source`; `Card`, `InlineCode` from shared components; `Check`, `X` from `lucide-react`
- Produces: `TECHNIQUES` array and `BIASES` array (used by Task 8 main component), `SelfReviewMatch` component (used by Task 8)

- [ ] **Step 1: Write the failing data test**

Create `web/src/features/code-review/self-review.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { BIASES, TECHNIQUES } from './self-review'
import { flat, section } from './doc-source'

describe('self-review data', () => {
  const src = section('Reviewing your own code')

  test('three techniques', () => {
    expect(TECHNIQUES).toHaveLength(3)
  })

  test('three biases', () => {
    expect(BIASES).toHaveLength(3)
  })

  test('unique technique IDs', () => {
    const ids = TECHNIQUES.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('unique bias IDs', () => {
    const ids = BIASES.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every technique maps to a valid bias', () => {
    const biasIds = new Set(BIASES.map((b) => b.id))
    for (const t of TECHNIQUES) {
      expect(biasIds.has(t.bias), `${t.id} → ${t.bias}`).toBe(true)
    }
  })

  test('each bias is the answer for exactly one technique', () => {
    const tally: Record<string, number> = {}
    for (const t of TECHNIQUES) tally[t.bias] = (tally[t.bias] ?? 0) + 1
    for (const b of BIASES) {
      expect(tally[b.id], b.id).toBe(1)
    }
  })

  test('distance technique pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Bugs that are invisible while you are inside the problem become obvious once you are not'),
    )
  })

  test('diff technique pins against doc', () => {
    expect(flat(src)).toContain(
      flat('the diff view strips the surrounding code you have been staring at and shows only what changed'),
    )
  })

  test('explain technique pins against doc', () => {
    expect(flat(src)).toContain(
      flat('If you cannot explain why a piece is necessary, that is a finding'),
    )
  })

  test('every technique has an explanation of at least one sentence', () => {
    for (const t of TECHNIQUES) {
      expect(t.explanation.length, t.id).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --run src/features/code-review/self-review.test.ts
```

Expected: FAIL — `./self-review` module not found.

- [ ] **Step 3: Write self-review.ts**

Create `web/src/features/code-review/self-review.ts`:

```ts
export type BiasId = 'confirmation' | 'tunnel-vision' | 'curse-of-knowledge'

export type Bias = {
  id: BiasId
  label: string
}

export const BIASES: Bias[] = [
  { id: 'confirmation', label: 'Confirmation bias' },
  { id: 'tunnel-vision', label: 'Tunnel vision' },
  { id: 'curse-of-knowledge', label: 'Curse of knowledge' },
]

export type Technique = {
  id: string
  title: string
  detail: string
  bias: BiasId
  explanation: string
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'distance',
    title: 'Create distance',
    detail:
      'Minimum ten minutes, ideally overnight. Bugs that are invisible while you are inside the problem become obvious once you are not.',
    bias: 'confirmation',
    explanation:
      'You are still holding the intent in your head, so you read what you meant rather than what you wrote. Time breaks the mental model so you see what is actually there.',
  },
  {
    id: 'diff',
    title: 'Read the diff, not the code',
    detail:
      'In the GitHub PR view, not your editor. Different presentation, different context, different things noticed. The diff view strips the surrounding code you have been staring at and shows only what changed.',
    bias: 'tunnel-vision',
    explanation:
      'The same context that produced the bugs hides them. A different presentation — the PR diff instead of the editor — breaks the visual familiarity and surfaces what you stopped seeing.',
  },
  {
    id: 'explain',
    title: 'Explain it out loud',
    detail:
      'Write the PR description as though someone else will read it. If you cannot explain why a piece is necessary, that is a finding.',
    bias: 'curse-of-knowledge',
    explanation:
      'You cannot unknow what you know about the code’s intent. Explaining forces you to make the implicit explicit, which reveals assumptions and gaps a reader without your context would hit.',
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- --run src/features/code-review/self-review.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write the failing render test**

Create `web/src/features/code-review/SelfReviewMatch.test.tsx`:

```tsx
import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { SelfReviewMatch } from './SelfReviewMatch'
import { TECHNIQUES, BIASES } from './self-review'

function rowFor(technique: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(technique.slice(0, 30)),
  })
}

function pick(technique: string, biasLabel: string) {
  const row = rowFor(technique)
  fireEvent.click(within(row).getByRole('radio', { name: biasLabel }))
}

describe('SelfReviewMatch', () => {
  test('renders one radiogroup per technique', () => {
    render(<SelfReviewMatch />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(TECHNIQUES.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const bias = BIASES.find((b) => b.id === t.bias)!
    pick(t.title, bias.label)
    // Score uses a literal
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const wrongBias = BIASES.find((b) => b.id !== t.bias)!
    pick(t.title, wrongBias.label)
    const row = rowFor(t.title)
    // Verdict contains the correct answer
    const correctBias = BIASES.find((b) => b.id === t.bias)!
    expect(within(row).getByText(new RegExp(correctBias.label))).toBeTruthy()
  })

  test('answer locks on first selection — second click does not change it', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const correctBias = BIASES.find((b) => b.id === t.bias)!
    const wrongBias = BIASES.find((b) => b.id !== t.bias)!
    pick(t.title, correctBias.label)
    // Try picking wrong after correct
    pick(t.title, wrongBias.label)
    // Score should still be 1/1
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios in a committed row are disabled', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const bias = BIASES.find((b) => b.id === t.bias)!
    pick(t.title, bias.label)
    const row = rowFor(t.title)
    const radios = within(row).getAllByRole('radio')
    for (const r of radios) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score element has aria-live polite', () => {
    render(<SelfReviewMatch />)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('explanation is hidden before selection', () => {
    render(<SelfReviewMatch />)
    const t = TECHNIQUES[0]
    const row = rowFor(t.title)
    expect(
      within(row).queryByText(new RegExp(t.explanation.slice(0, 40))),
    ).toBeNull()
  })

  test('full score after all correct answers', () => {
    render(<SelfReviewMatch />)
    for (const t of TECHNIQUES) {
      const bias = BIASES.find((b) => b.id === t.bias)!
      pick(t.title, bias.label)
    }
    expect(screen.getByText('3/3 right')).toBeTruthy()
  })
})
```

- [ ] **Step 6: Run render test to verify it fails**

```bash
pnpm test -- --run src/features/code-review/SelfReviewMatch.test.tsx
```

Expected: FAIL — `./SelfReviewMatch` module not found.

- [ ] **Step 7: Write SelfReviewMatch.tsx**

Create `web/src/features/code-review/SelfReviewMatch.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TECHNIQUES, BIASES, type BiasId } from './self-review'

export function SelfReviewMatch() {
  const [choices, setChoices] = useState<Record<string, BiasId>>({})

  function commit(techniqueId: string, biasId: BiasId) {
    setChoices((prev) =>
      techniqueId in prev ? prev : { ...prev, [techniqueId]: biasId },
    )
  }

  const answered = Object.keys(choices).length
  const correct = TECHNIQUES.filter(
    (t) => choices[t.id] === t.bias,
  ).length

  return (
    <Card>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            Match each technique to the cognitive bias it defeats
          </p>
          <p className="t-label shrink-0" aria-live="polite">
            {answered > 0 && `${correct}/${answered} right`}
          </p>
        </div>

        <ul className="space-y-8">
          {TECHNIQUES.map((t) => {
            const done = t.id in choices
            const picked = choices[t.id]
            const right = picked === t.bias

            return (
              <li key={t.id} className="space-y-3">
                <p className="font-semibold">
                  <InlineCode text={t.title} />
                </p>
                <p className="text-subtle text-sm">
                  <InlineCode text={t.detail} />
                </p>

                <div
                  role="radiogroup"
                  aria-label={t.title}
                  className="flex flex-wrap gap-2"
                >
                  {BIASES.map((b) => {
                    const selected = picked === b.id
                    return (
                      <button
                        key={b.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(t.id, b.id)}
                        className={[
                          'rounded-md border px-3 py-1.5 text-sm transition-colors',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          selected
                            ? right
                              ? 'border-go bg-go/10 text-go'
                              : 'border-danger bg-danger/10 text-danger'
                            : done
                              ? 'cursor-default border-rule/40 text-faint opacity-60'
                              : 'border-rule hover:border-brand hover:text-brand',
                        ].join(' ')}
                      >
                        {b.label}
                      </button>
                    )
                  })}
                </div>

                {done && (
                  <div aria-live="polite" className="flex items-start gap-2 text-sm">
                    {right ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-go" aria-hidden />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                    )}
                    <p>
                      {!right && (
                        <span className="font-medium text-go">
                          {BIASES.find((b) => b.id === t.bias)!.label}.{' '}
                        </span>
                      )}
                      <InlineCode text={t.explanation} />
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
```

- [ ] **Step 8: Run render test to verify it passes**

```bash
pnpm test -- --run src/features/code-review/SelfReviewMatch.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Run lint**

```bash
pnpm lint
```

Expected: PASS with zero warnings.

- [ ] **Step 10: Commit**

```bash
git add web/src/features/code-review/self-review.ts web/src/features/code-review/self-review.test.ts \
  web/src/features/code-review/SelfReviewMatch.tsx web/src/features/code-review/SelfReviewMatch.test.tsx
git commit -m "feat(code-review): panel 1 self-review data + SelfReviewMatch exercise

Three techniques matched to three cognitive biases (confirmation,
tunnel vision, curse of knowledge). Lock-on-commit, scored, with
doc-pinned data tests and a render test.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Panel 2 — ReviewDrill (the signature interaction)

**Files:**
- Create: `web/src/features/code-review/review-areas.ts`
- Create: `web/src/features/code-review/review-areas.test.ts`
- Create: `web/src/features/code-review/checklist-items.ts`
- Create: `web/src/features/code-review/checklist-items.test.ts`
- Create: `web/src/features/code-review/review-drill.ts`
- Create: `web/src/features/code-review/review-drill.test.ts`
- Create: `web/src/features/code-review/ReviewDrill.tsx`
- Create: `web/src/features/code-review/ReviewDrill.test.tsx`

**Interfaces:**
- Consumes: `section`, `h2`, `flat` from `./doc-source`; `Card`, `Callout`, `InlineCode` from shared components; `Check`, `X` from `lucide-react`
- Produces: `AREAS` array (used by Task 8 for the RevealList), `CHECKLIST` array (used by Task 8 for the checklist display), `SNIPPETS`, `CATEGORIES` (used by ReviewDrill), `ReviewDrill` component (used by Task 8)

- [ ] **Step 1: Write the failing review-areas data test**

Create `web/src/features/code-review/review-areas.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { AREAS } from './review-areas'
import { flat, section } from './doc-source'

describe('review areas data', () => {
  const src = section('What to actually look for')

  test('seven areas', () => {
    expect(AREAS).toHaveLength(7)
  })

  test('unique IDs', () => {
    const ids = AREAS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('authorization area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Any query filtered only by an ID from the client is a finding'),
    )
  })

  test('error handling area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('A caught error with an empty block is a bug hidden on purpose'),
    )
  })

  test('names area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Renaming is cheap now and expensive after it spreads across thirty call sites'),
    )
  })

  test('scope area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('An unrelated refactor bundled into a feature PR makes both harder to review and harder to revert'),
    )
  })

  test('deletion area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Commented-out code is what version control is for'),
    )
  })

  test('reversibility area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('A migration deserves more scrutiny than a copy change'),
    )
  })

  test('correctness area pins against doc', () => {
    expect(flat(src)).toContain(
      flat('What happens with zero items, a null, a duplicate submit'),
    )
  })

  test('every area has a title and body', () => {
    for (const a of AREAS) {
      expect(a.title.length, `${a.id} title`).toBeGreaterThan(0)
      expect(a.body.length, `${a.id} body`).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- --run src/features/code-review/review-areas.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write review-areas.ts**

Create `web/src/features/code-review/review-areas.ts`:

```ts
export type Area = {
  id: string
  title: string
  body: string
}

export const AREAS: Area[] = [
  {
    id: 'correctness',
    title: 'Correctness at the edges',
    body: 'What happens with zero items, a null, a duplicate submit, a very large input, a concurrent request? The happy path was tested during development.',
  },
  {
    id: 'authorization',
    title: 'Authorization',
    body: 'For every data access: can a user reach someone else’s record? Any query filtered only by an ID from the client is a finding. See `05 — Development`.',
  },
  {
    id: 'error-handling',
    title: 'Error handling',
    body: 'What does the user see when this fails? A caught error with an empty block is a bug hidden on purpose. A raw error message reaching the UI may leak internals.',
  },
  {
    id: 'names',
    title: 'Names',
    body: 'Does the name say what the thing does? Renaming is cheap now and expensive after it spreads across thirty call sites.',
  },
  {
    id: 'scope',
    title: 'Scope',
    body: 'Does the diff do what the description says, and nothing else? An unrelated refactor bundled into a feature PR makes both harder to review and harder to revert.',
  },
  {
    id: 'deletion',
    title: 'Deletion',
    body: 'Did the change leave anything behind — a now-unused function, a stale flag, a commented-out block? Commented-out code is what version control is for. Delete it.',
  },
  {
    id: 'reversibility',
    title: 'Reversibility',
    body: 'If this is wrong, how bad is it and how fast can you undo it? A migration deserves more scrutiny than a copy change, and should get proportionally more.',
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- --run src/features/code-review/review-areas.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write the failing checklist-items data test**

Create `web/src/features/code-review/checklist-items.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { CHECKLIST } from './checklist-items'
import { flat, section } from './doc-source'

describe('checklist items data', () => {
  const src = section('The checklist')

  test('eleven items', () => {
    expect(CHECKLIST).toHaveLength(11)
  })

  test('unique IDs', () => {
    const ids = CHECKLIST.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('first item pins against doc', () => {
    expect(flat(src)).toContain(flat('Does the diff match the description'))
  })

  test('secrets item pins against doc', () => {
    expect(flat(src)).toContain(flat('No secrets, keys, or tokens in the diff'))
  })

  test('tests item pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Tests exist and would actually fail without the change'),
    )
  })
})
```

- [ ] **Step 6: Run test to verify it fails, write checklist-items.ts**

Create `web/src/features/code-review/checklist-items.ts`:

```ts
export type CheckItem = {
  id: string
  label: string
}

export const CHECKLIST: CheckItem[] = [
  { id: 'match', label: 'Does the diff match the description?' },
  { id: 'edges', label: 'Edge cases: empty, null, zero, duplicate, very large' },
  { id: 'authz', label: 'Every data access authorized, not just authenticated' },
  { id: 'failures', label: 'Failures produce a sensible user-visible state' },
  { id: 'secrets', label: 'No secrets, keys, or tokens in the diff' },
  { id: 'console', label: 'No `console.log` left behind' },
  { id: 'commented', label: 'No commented-out code' },
  { id: 'tests', label: 'Tests exist and would actually fail without the change' },
  { id: 'names', label: 'Names are accurate' },
  { id: 'scope', label: 'Nothing unrelated is bundled in' },
  { id: 'migrations', label: 'Migrations are backward compatible (`13`)' },
]
```

- [ ] **Step 7: Run checklist-items test to verify it passes**

```bash
pnpm test -- --run src/features/code-review/checklist-items.test.ts
```

Expected: PASS.

- [ ] **Step 8: Write the failing review-drill data test**

Create `web/src/features/code-review/review-drill.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { SNIPPETS, CATEGORIES } from './review-drill'

describe('review drill data', () => {
  test('six snippets', () => {
    expect(SNIPPETS).toHaveLength(6)
  })

  test('seven categories', () => {
    expect(CATEGORIES).toHaveLength(7)
  })

  test('unique snippet IDs', () => {
    const ids = SNIPPETS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('unique category IDs', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every snippet answer is a valid category', () => {
    const catIds = new Set(CATEGORIES.map((c) => c.id))
    for (const s of SNIPPETS) {
      expect(catIds.has(s.answer), `${s.id} → ${s.answer}`).toBe(true)
    }
  })

  test('six distinct categories used across snippets', () => {
    const used = new Set(SNIPPETS.map((s) => s.answer))
    expect(used.size).toBe(6)
  })

  test('every snippet has code and an explanation', () => {
    for (const s of SNIPPETS) {
      expect(s.code.length, `${s.id} code`).toBeGreaterThan(20)
      expect(s.explanation.length, `${s.id} explanation`).toBeGreaterThan(20)
    }
  })

  test('category labels are distinct from IDs', () => {
    for (const c of CATEGORIES) {
      expect(c.label).not.toBe(c.id)
    }
  })
})
```

- [ ] **Step 9: Write review-drill.ts**

Create `web/src/features/code-review/review-drill.ts`:

```ts
export type Category =
  | 'authorization'
  | 'edge-case'
  | 'cleanup'
  | 'naming'
  | 'scope'
  | 'test-quality'
  | 'error-handling'

export type CategoryOption = {
  id: Category
  label: string
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'authorization', label: 'Authorization' },
  { id: 'edge-case', label: 'Edge case' },
  { id: 'cleanup', label: 'Cleanup' },
  { id: 'naming', label: 'Naming' },
  { id: 'scope', label: 'Scope' },
  { id: 'test-quality', label: 'Test quality' },
  { id: 'error-handling', label: 'Error handling' },
]

export type Snippet = {
  id: string
  label: string
  code: string
  language: 'ts' | 'tsx'
  answer: Category
  explanation: string
}

export const SNIPPETS: Snippet[] = [
  {
    id: 'invoice-fetch',
    label: 'Server action: fetch invoice',
    code: `export async function getInvoice(id: string) {
  const invoice = await db.invoice.findUnique({
    where: { id },
  })
  return invoice
}`,
    language: 'ts',
    answer: 'authorization',
    explanation:
      'The query is filtered only by the client-supplied ID. Any authenticated user can fetch any invoice. The fix is to add `userId: session.userId` to the `where` clause — authorization, not just authentication.',
  },
  {
    id: 'order-list',
    label: 'Component: order list',
    code: `export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="divide-y">
      {orders.map((o) => (
        <li key={o.id}>{o.name} — \${o.total}</li>
      ))}
    </ul>
  )
}`,
    language: 'tsx',
    answer: 'edge-case',
    explanation:
      'Zero orders renders an empty `<ul>` with nothing visible. The user sees a blank area with no indication that there are no orders. Add an empty-state message when `orders.length === 0`.',
  },
  {
    id: 'form-submit',
    label: 'Server action: contact form',
    code: `export async function submitContact(formData: FormData) {
  console.log(formData)
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  await db.contact.create({ data: { name, email } })
  redirect('/contacts')
}`,
    language: 'ts',
    answer: 'cleanup',
    explanation:
      'A `console.log(formData)` is left in production code. It logs every form submission to the server console — including the user’s email. Debug logging does not belong in production.',
  },
  {
    id: 'process-data',
    label: 'Utility: order processing',
    code: `export async function processData(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
  })
  if (!order) throw new Error('Order not found')
  await sendEmail({
    to: order.customerEmail,
    subject: \`Order \${order.id} confirmed\`,
    body: renderConfirmation(order),
  })
}`,
    language: 'ts',
    answer: 'naming',
    explanation:
      'The function is called `processData` but it sends a confirmation email. The name hides the side effect. A reader calling `processData` does not expect an email to go out. Name it `sendOrderConfirmation`.',
  },
  {
    id: 'bundled-rename',
    label: 'PR: add currency selector',
    code: `// PriceTag.tsx — adds currency selector (the stated PR goal)
export function PriceTag({ amount, currency = 'USD' }: Props) {
  return <span>{formatCurrency(amount, currency)}</span>
}

// Also in this PR: renamed helpers.ts → format.ts,
// reformatted all imports in 12 files to use the new path.`,
    language: 'tsx',
    answer: 'scope',
    explanation:
      'The PR bundles a feature (currency selector) with an unrelated rename and a 12-file import reformat. The feature is one review; the rename is another. Split them so each can be reviewed and reverted independently.',
  },
  {
    id: 'vacuous-test',
    label: 'Test: create user',
    code: `test('createUser returns the new user', async () => {
  const user = await createUser({
    name: 'Ada',
    email: 'ada@test.com',
  })
  expect(user).not.toBeNull()
})`,
    language: 'ts',
    answer: 'test-quality',
    explanation:
      'The function’s return type is `User`, never `null`. This test passes with or without the change — it would pass even if `createUser` threw, as long as the thrown error is caught elsewhere. Assert something the change actually affects.',
  },
]
```

- [ ] **Step 10: Run review-drill data test**

```bash
pnpm test -- --run src/features/code-review/review-drill.test.ts
```

Expected: PASS.

- [ ] **Step 11: Write the failing ReviewDrill render test**

Create `web/src/features/code-review/ReviewDrill.test.tsx`:

```tsx
import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ReviewDrill } from './ReviewDrill'
import { SNIPPETS, CATEGORIES } from './review-drill'

function rowFor(snippet: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(snippet.slice(0, 30)),
  })
}

function pick(snippetLabel: string, categoryLabel: string) {
  const row = rowFor(snippetLabel)
  fireEvent.click(within(row).getByRole('radio', { name: categoryLabel }))
}

describe('ReviewDrill', () => {
  test('renders one radiogroup per snippet', () => {
    render(<ReviewDrill />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SNIPPETS.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const cat = CATEGORIES.find((c) => c.id === s.answer)!
    pick(s.label, cat.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict with the correct category', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const wrong = CATEGORIES.find((c) => c.id !== s.answer)!
    pick(s.label, wrong.label)
    const correct = CATEGORIES.find((c) => c.id === s.answer)!
    const row = rowFor(s.label)
    expect(within(row).getByText(new RegExp(correct.label))).toBeTruthy()
  })

  test('answer locks — second click does not change result', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const correct = CATEGORIES.find((c) => c.id === s.answer)!
    const wrong = CATEGORIES.find((c) => c.id !== s.answer)!
    pick(s.label, correct.label)
    pick(s.label, wrong.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios disabled after commit', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const cat = CATEGORIES.find((c) => c.id === s.answer)!
    pick(s.label, cat.label)
    const row = rowFor(s.label)
    const radios = within(row).getAllByRole('radio')
    for (const r of radios) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score has aria-live polite', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const cat = CATEGORIES.find((c) => c.id === s.answer)!
    pick(s.label, cat.label)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('explanation hidden before selection', () => {
    render(<ReviewDrill />)
    const s = SNIPPETS[0]
    const row = rowFor(s.label)
    expect(
      within(row).queryByText(new RegExp(s.explanation.slice(0, 40))),
    ).toBeNull()
  })

  test('code block rendered for each snippet', () => {
    render(<ReviewDrill />)
    for (const s of SNIPPETS) {
      expect(
        screen.getByText(new RegExp(s.code.split('\n')[0].slice(0, 30))),
      ).toBeTruthy()
    }
  })

  test('full score after all correct answers', () => {
    render(<ReviewDrill />)
    for (const s of SNIPPETS) {
      const cat = CATEGORIES.find((c) => c.id === s.answer)!
      pick(s.label, cat.label)
    }
    expect(screen.getByText('6/6 right')).toBeTruthy()
  })
})
```

- [ ] **Step 12: Write ReviewDrill.tsx**

Create `web/src/features/code-review/ReviewDrill.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { SNIPPETS, CATEGORIES, type Category } from './review-drill'

export function ReviewDrill() {
  const [choices, setChoices] = useState<Record<string, Category>>({})

  function commit(snippetId: string, categoryId: Category) {
    setChoices((prev) =>
      snippetId in prev ? prev : { ...prev, [snippetId]: categoryId },
    )
  }

  const answered = Object.keys(choices).length
  const correct = SNIPPETS.filter(
    (s) => choices[s.id] === s.answer,
  ).length

  return (
    <Card>
      <div className="space-y-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            What is the issue in each snippet?
          </p>
          <p className="t-label shrink-0" aria-live="polite">
            {answered > 0 && `${correct}/${answered} right`}
          </p>
        </div>

        <ol className="space-y-10">
          {SNIPPETS.map((s) => {
            const done = s.id in choices
            const picked = choices[s.id]
            const right = picked === s.answer

            return (
              <li key={s.id} className="space-y-3">
                <p className="font-semibold">{s.label}</p>
                <pre className="overflow-x-auto rounded-md border border-rule bg-surface-sunken p-4 text-sm">
                  <code>{s.code}</code>
                </pre>

                <div
                  role="radiogroup"
                  aria-label={s.label}
                  className="flex flex-wrap gap-2"
                >
                  {CATEGORIES.map((c) => {
                    const selected = picked === c.id
                    return (
                      <button
                        key={c.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(s.id, c.id)}
                        className={[
                          'rounded-md border px-3 py-1.5 text-sm transition-colors',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          selected
                            ? right
                              ? 'border-go bg-go/10 text-go'
                              : 'border-danger bg-danger/10 text-danger'
                            : done
                              ? 'cursor-default border-rule/40 text-faint opacity-60'
                              : 'border-rule hover:border-brand hover:text-brand',
                        ].join(' ')}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>

                {done && (
                  <div aria-live="polite" className="flex items-start gap-2 text-sm">
                    {right ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-go" aria-hidden />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                    )}
                    <p>
                      {!right && (
                        <span className="font-medium text-go">
                          {CATEGORIES.find((c) => c.id === s.answer)!.label}.{' '}
                        </span>
                      )}
                      <InlineCode text={s.explanation} />
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </Card>
  )
}
```

- [ ] **Step 13: Run all tests for this task**

```bash
pnpm test -- --run src/features/code-review/review-areas.test.ts src/features/code-review/checklist-items.test.ts src/features/code-review/review-drill.test.ts src/features/code-review/ReviewDrill.test.tsx
```

Expected: PASS.

- [ ] **Step 14: Run lint**

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 15: Commit**

```bash
git add web/src/features/code-review/review-areas.ts web/src/features/code-review/review-areas.test.ts \
  web/src/features/code-review/checklist-items.ts web/src/features/code-review/checklist-items.test.ts \
  web/src/features/code-review/review-drill.ts web/src/features/code-review/review-drill.test.ts \
  web/src/features/code-review/ReviewDrill.tsx web/src/features/code-review/ReviewDrill.test.tsx
git commit -m "feat(code-review): panel 2 review areas, checklist, and ReviewDrill exercise

Seven review areas and eleven checklist items pinned against the doc.
Six code snippets with planted issues across six categories —
the stage's signature interaction. Lock-on-commit, scored.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Panel 4 — SeverityDrill

**Files:**
- Create: `web/src/features/code-review/team.ts`
- Create: `web/src/features/code-review/team.test.ts`
- Create: `web/src/features/code-review/severity-drill.ts`
- Create: `web/src/features/code-review/severity-drill.test.ts`
- Create: `web/src/features/code-review/SeverityDrill.tsx`
- Create: `web/src/features/code-review/SeverityDrill.test.tsx`

**Interfaces:**
- Consumes: `section`, `h2`, `flat` from `./doc-source`; `Card`, `InlineCode` from shared components; `Check`, `X` from `lucide-react`
- Produces: `PRACTICES` array (used by Task 8 for the RevealList), `COMMENTS`, `SEVERITIES` (used by SeverityDrill), `SeverityDrill` component (used by Task 8)

- [ ] **Step 1: Write the failing team data test**

Create `web/src/features/code-review/team.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { PRACTICES } from './team'
import { flat, h2 } from './doc-source'

describe('team practices data', () => {
  const src = h2('Scaling to a team')

  test('six practices from the bullet list', () => {
    expect(PRACTICES).toHaveLength(6)
  })

  test('unique IDs', () => {
    const ids = PRACTICES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('distance practice pins against doc', () => {
    expect(flat(src)).toContain(
      flat('they have the distance you have to manufacture'),
    )
  })

  test('severity practice pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Without labels, every comment reads as a demand and reviews turn adversarial'),
    )
  })

  test('receiving review practice pins against doc', () => {
    expect(flat(src)).toContain(
      flat('agreeing with a wrong suggestion to be agreeable puts a bug in the codebase with two names on it'),
    )
  })
})
```

- [ ] **Step 2: Run test, write team.ts**

Create `web/src/features/code-review/team.ts`:

```ts
export type Practice = {
  id: string
  title: string
  body: string
}

export const PRACTICES: Practice[] = [
  {
    id: 'distance',
    title: 'Review is now someone else’s job',
    body: 'Which is strictly better — they have the distance you have to manufacture.',
  },
  {
    id: 'severity',
    title: 'Comment with severity',
    body: 'Distinguish “blocking” from “suggestion” from “nit.” Without labels, every comment reads as a demand and reviews turn adversarial.',
  },
  {
    id: 'questions',
    title: 'Ask questions rather than issue instructions',
    body: '“What happens if this is empty?” gets a better outcome than “add a null check” — sometimes the answer is that it cannot be empty, and you have learned something.',
  },
  {
    id: 'turnaround',
    title: 'Review within a day',
    body: 'A PR waiting three days is a branch diverging for three days.',
  },
  {
    id: 'approve-with-nits',
    title: 'Approve with minor comments',
    body: 'Rather than blocking on nits. Trust people to address them.',
  },
  {
    id: 'receiving',
    title: 'On receiving review: verify, do not comply reflexively',
    body: 'A reviewer can be wrong, and agreeing with a wrong suggestion to be agreeable puts a bug in the codebase with two names on it. Check, then agree or explain.',
  },
]
```

- [ ] **Step 3: Run team data test**

```bash
pnpm test -- --run src/features/code-review/team.test.ts
```

Expected: PASS.

- [ ] **Step 4: Write the failing severity-drill data test**

Create `web/src/features/code-review/severity-drill.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { COMMENTS, SEVERITIES } from './severity-drill'

describe('severity drill data', () => {
  test('five comments', () => {
    expect(COMMENTS).toHaveLength(5)
  })

  test('four severity levels', () => {
    expect(SEVERITIES).toHaveLength(4)
    expect(SEVERITIES.map((s) => s.id)).toEqual([
      'critical',
      'important',
      'minor',
      'nit',
    ])
  })

  test('unique comment IDs', () => {
    const ids = COMMENTS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every comment maps to a valid severity', () => {
    const sevIds = new Set(SEVERITIES.map((s) => s.id))
    for (const c of COMMENTS) {
      expect(sevIds.has(c.severity), `${c.id} → ${c.severity}`).toBe(true)
    }
  })

  test('severity distribution: 2 critical, 1 important, 1 minor, 1 nit', () => {
    const tally: Record<string, number> = {}
    for (const c of COMMENTS) tally[c.severity] = (tally[c.severity] ?? 0) + 1
    expect(tally).toEqual({ critical: 2, important: 1, minor: 1, nit: 1 })
  })

  test('every comment has text and an explanation', () => {
    for (const c of COMMENTS) {
      expect(c.comment.length, `${c.id} comment`).toBeGreaterThan(20)
      expect(c.explanation.length, `${c.id} explanation`).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Step 5: Write severity-drill.ts**

Create `web/src/features/code-review/severity-drill.ts`:

```ts
export type Severity = 'critical' | 'important' | 'minor' | 'nit'

export type SeverityOption = {
  id: Severity
  label: string
}

export const SEVERITIES: SeverityOption[] = [
  { id: 'critical', label: 'Critical' },
  { id: 'important', label: 'Important' },
  { id: 'minor', label: 'Minor' },
  { id: 'nit', label: 'Nit' },
]

export type SeverityComment = {
  id: string
  comment: string
  severity: Severity
  explanation: string
}

export const COMMENTS: SeverityComment[] = [
  {
    id: 'authz-bypass',
    comment:
      'This query is filtered by `userId` from the request body, not the session. Any user can read any other user’s invoices.',
    severity: 'critical',
    explanation:
      'Authorization bypass — this is a data leak, not a styling issue. Any authenticated user can enumerate every invoice in the system by changing the request body. This blocks the merge.',
  },
  {
    id: 'data-loss',
    comment:
      'The migration drops the column before backfilling the new one. Existing rows lose their data and there is no rollback path.',
    severity: 'critical',
    explanation:
      'Irreversible data loss. Once the column is dropped, the data is gone. The fix is to add the new column first, backfill, then drop the old one in a separate migration.',
  },
  {
    id: 'silent-failure',
    comment:
      'The catch block is empty — the user sees nothing when this fails. The loading spinner just keeps spinning.',
    severity: 'important',
    explanation:
      'Silent failure the user will hit. It is not a security breach or data loss, but the user experience is broken — a stuck spinner with no recovery path. Show an error state.',
  },
  {
    id: 'duplication',
    comment:
      'This validation logic is duplicated in three handlers. Consider extracting a shared helper.',
    severity: 'minor',
    explanation:
      'A real issue — the duplication means a bug fix must land in three places — but it is not blocking. The feature works correctly as-is. File a follow-up or fix it in the next PR.',
  },
  {
    id: 'rename',
    comment:
      '`getData` is vague. `fetchInvoices` says what it actually does.',
    severity: 'nit',
    explanation:
      'Naming polish. The current name is not wrong, just less specific than it could be. This is a suggestion, not a demand — approve the PR and trust the author to take it or leave it.',
  },
]
```

- [ ] **Step 6: Run severity-drill data test**

```bash
pnpm test -- --run src/features/code-review/severity-drill.test.ts
```

Expected: PASS.

- [ ] **Step 7: Write the failing SeverityDrill render test**

Create `web/src/features/code-review/SeverityDrill.test.tsx`:

```tsx
import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { SeverityDrill } from './SeverityDrill'
import { COMMENTS, SEVERITIES } from './severity-drill'

function rowFor(comment: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(comment.slice(0, 30)),
  })
}

function pick(commentText: string, severityLabel: string) {
  const row = rowFor(commentText)
  fireEvent.click(within(row).getByRole('radio', { name: severityLabel }))
}

describe('SeverityDrill', () => {
  test('renders one radiogroup per comment', () => {
    render(<SeverityDrill />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(COMMENTS.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const sev = SEVERITIES.find((s) => s.id === c.severity)!
    pick(c.comment, sev.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict with the correct severity', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const wrong = SEVERITIES.find((s) => s.id !== c.severity)!
    pick(c.comment, wrong.label)
    const correct = SEVERITIES.find((s) => s.id === c.severity)!
    const row = rowFor(c.comment)
    expect(within(row).getByText(new RegExp(correct.label))).toBeTruthy()
  })

  test('answer locks on first selection', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const correct = SEVERITIES.find((s) => s.id === c.severity)!
    const wrong = SEVERITIES.find((s) => s.id !== c.severity)!
    pick(c.comment, correct.label)
    pick(c.comment, wrong.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios disabled after commit', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const sev = SEVERITIES.find((s) => s.id === c.severity)!
    pick(c.comment, sev.label)
    const row = rowFor(c.comment)
    for (const r of within(row).getAllByRole('radio')) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score has aria-live polite', () => {
    render(<SeverityDrill />)
    const c = COMMENTS[0]
    const sev = SEVERITIES.find((s) => s.id === c.severity)!
    pick(c.comment, sev.label)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('full score after all correct', () => {
    render(<SeverityDrill />)
    for (const c of COMMENTS) {
      const sev = SEVERITIES.find((s) => s.id === c.severity)!
      pick(c.comment, sev.label)
    }
    expect(screen.getByText('5/5 right')).toBeTruthy()
  })
})
```

- [ ] **Step 8: Write SeverityDrill.tsx**

Create `web/src/features/code-review/SeverityDrill.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { COMMENTS, SEVERITIES, type Severity } from './severity-drill'

export function SeverityDrill() {
  const [choices, setChoices] = useState<Record<string, Severity>>({})

  function commit(commentId: string, severity: Severity) {
    setChoices((prev) =>
      commentId in prev ? prev : { ...prev, [commentId]: severity },
    )
  }

  const answered = Object.keys(choices).length
  const correct = COMMENTS.filter(
    (c) => choices[c.id] === c.severity,
  ).length

  return (
    <Card>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            Classify each review comment by severity
          </p>
          <p className="t-label shrink-0" aria-live="polite">
            {answered > 0 && `${correct}/${answered} right`}
          </p>
        </div>

        <ul className="space-y-8">
          {COMMENTS.map((c) => {
            const done = c.id in choices
            const picked = choices[c.id]
            const right = picked === c.severity

            return (
              <li key={c.id} className="space-y-3">
                <p className="italic text-subtle">
                  <InlineCode text={`“${c.comment}”`} />
                </p>

                <div
                  role="radiogroup"
                  aria-label={c.comment}
                  className="flex flex-wrap gap-2"
                >
                  {SEVERITIES.map((s) => {
                    const selected = picked === s.id
                    return (
                      <button
                        key={s.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(c.id, s.id)}
                        className={[
                          'rounded-md border px-3 py-1.5 text-sm transition-colors',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          selected
                            ? right
                              ? 'border-go bg-go/10 text-go'
                              : 'border-danger bg-danger/10 text-danger'
                            : done
                              ? 'cursor-default border-rule/40 text-faint opacity-60'
                              : 'border-rule hover:border-brand hover:text-brand',
                        ].join(' ')}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>

                {done && (
                  <div aria-live="polite" className="flex items-start gap-2 text-sm">
                    {right ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-go" aria-hidden />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                    )}
                    <p>
                      {!right && (
                        <span className="font-medium text-go">
                          {SEVERITIES.find((s) => s.id === c.severity)!.label}.{' '}
                        </span>
                      )}
                      <InlineCode text={c.explanation} />
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
```

- [ ] **Step 9: Run all tests for this task**

```bash
pnpm test -- --run src/features/code-review/team.test.ts src/features/code-review/severity-drill.test.ts src/features/code-review/SeverityDrill.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Run lint**

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add web/src/features/code-review/team.ts web/src/features/code-review/team.test.ts \
  web/src/features/code-review/severity-drill.ts web/src/features/code-review/severity-drill.test.ts \
  web/src/features/code-review/SeverityDrill.tsx web/src/features/code-review/SeverityDrill.test.tsx
git commit -m "feat(code-review): panel 4 team practices + SeverityDrill exercise

Six team practices pinned against doc. Five review comments across
four severity levels (Critical/Important/Minor/Nit) — the P-6
convention payoff. Lock-on-commit, scored.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Panel 5 — AI Plays

**Files:**
- Create: `web/src/features/code-review/ai-plays.ts`
- Create: `web/src/features/code-review/ai-plays.test.ts`
- Create: `web/src/features/code-review/AIPlays.tsx`
- Create: `web/src/features/code-review/AIPlays.test.tsx`

**Interfaces:**
- Consumes: `section`, `flat` from `./doc-source`; `RevealList` from `@/components/RevealList`; `InlineCode` from `@/components/InlineCode`; `Callout` from `@/components/ui`; `TriangleAlert` from `lucide-react`
- Produces: `AIPlays` component (used by Task 8)

- [ ] **Step 1: Write the failing AI plays data test**

Create `web/src/features/code-review/ai-plays.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { AI_LIMIT, AI_PREMISE, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('AI plays data', () => {
  const src = section('AI in code review')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(
      flat('They do not get tired, and they do not assume they already know what the code does'),
    )
  })

  test('limit pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Agent-authored PRs get reviewed less often, merged faster, and discussed less'),
    )
  })

  test('five plays', () => {
    expect(PLAYS).toHaveLength(5)
  })

  test('unique play IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all kinds are valid', () => {
    const validKinds = new Set(['skill', 'command', 'mcp', 'memory'])
    for (const p of PLAYS) {
      expect(validKinds.has(p.kind), `${p.id}: ${p.kind}`).toBe(true)
    }
  })

  test('AI_PREMISE is non-empty', () => {
    expect(AI_PREMISE.length).toBeGreaterThan(20)
  })

  test('AI_LIMIT is non-empty', () => {
    expect(AI_LIMIT.length).toBeGreaterThan(20)
  })
})
```

- [ ] **Step 2: Run test to verify it fails, write ai-plays.ts**

Create `web/src/features/code-review/ai-plays.ts`:

```ts
export const AI_PREMISE =
  'AI review tools catch a real class of issue — null-reference paths, missing error handling, unhandled promise rejections, simple logic inversions. They do not get tired, and they do not assume they already know what the code does.'

export const AI_LIMIT =
  'The anti-pattern is treating AI review as the review. Agent-authored PRs get reviewed less often, merged faster, and discussed less — which is exactly the erosion that turns review from a quality gate into ceremony.'

export type Play = {
  id: string
  title: string
  kind: 'skill' | 'command' | 'mcp' | 'memory'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'first-pass',
    title: 'AI as first-pass reviewer',
    kind: 'skill',
    body: 'Run AI review before requesting human review. Fix the mechanical issues it surfaces — the leftover `console.log`, the missing null check — so the human reviewer gets a cleaner diff.',
  },
  {
    id: 'checklist-items',
    title: 'AI for checklist items',
    kind: 'command',
    body: 'Automate the mechanical checks: secrets in the diff, debug logging, formatting violations, missing error handling. These are the items a machine catches reliably.',
  },
  {
    id: 'human-judgment',
    title: 'Human for judgment calls',
    kind: 'skill',
    body: 'Architecture, authorization, naming, scope, and whether the change should have been made at all stay with the human reviewer. AI cannot judge these — it has no model of the domain.',
  },
  {
    id: 'heightened-scrutiny',
    title: 'Heightened scrutiny for AI-authored code',
    kind: 'skill',
    body: 'AI-generated code produces roughly 1.7× more issues per PR than human-written code. The instinct is to review it less carefully because it looks clean. Do the opposite.',
  },
  {
    id: 'self-review-distance',
    title: 'AI review for self-review distance',
    kind: 'command',
    body: 'An AI review of your own PR creates the second perspective that self-review struggles to manufacture. It is not the same as a human reviewer, but it is better than none.',
  },
]
```

- [ ] **Step 3: Run AI plays data test**

```bash
pnpm test -- --run src/features/code-review/ai-plays.test.ts
```

Expected: PASS.

- [ ] **Step 4: Write the failing AIPlays render test**

Create `web/src/features/code-review/AIPlays.test.tsx`:

```tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIPlays } from './AIPlays'
import { AI_LIMIT, AI_PREMISE, PLAYS } from './ai-plays'

describe('AIPlays', () => {
  test('renders every play title', () => {
    render(<AIPlays />)
    for (const p of PLAYS) {
      expect(screen.getByText(p.title)).toBeTruthy()
    }
  })

  test('premise key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(
      screen.getByText(/They do not get tired/i),
    ).toBeTruthy()
  })

  test('limit key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(
      screen.getByText(/treating AI review as the review/i),
    ).toBeTruthy()
  })
})
```

- [ ] **Step 5: Write AIPlays.tsx**

Create `web/src/features/code-review/AIPlays.tsx`:

```tsx
import { TriangleAlert } from 'lucide-react'
import { Callout } from '@/components/ui'
import { RevealList } from '@/components/RevealList'
import { InlineCode } from '@/components/InlineCode'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

const KIND_LABEL: Record<Play['kind'], string> = {
  skill: 'Skill',
  command: 'Command',
  mcp: 'MCP',
  memory: 'Memory',
}

export function AIPlays() {
  return (
    <div className="space-y-8">
      <RevealList
        idPrefix="code-review-ai"
        header={
          <p>
            <InlineCode text={AI_PREMISE} />
          </p>
        }
        rows={PLAYS.map((play) => ({
          id: play.id,
          title: (
            <span>
              <InlineCode text={play.title} />
            </span>
          ),
          badge: (
            <span className="t-label rounded bg-surface-sunken px-1.5 py-0.5 text-faint">
              {KIND_LABEL[play.kind]}
            </span>
          ),
          body: (
            <p>
              <InlineCode text={play.body} />
            </p>
          ),
        }))}
      />

      <div className="flex items-start gap-3 rounded-md border border-warn/30 bg-warn/5 p-4 text-sm">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
        <p>
          <InlineCode text={AI_LIMIT} />
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Run all tests for this task**

```bash
pnpm test -- --run src/features/code-review/ai-plays.test.ts src/features/code-review/AIPlays.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/code-review/ai-plays.ts web/src/features/code-review/ai-plays.test.ts \
  web/src/features/code-review/AIPlays.tsx web/src/features/code-review/AIPlays.test.tsx
git commit -m "feat(code-review): panel 5 AI plays data and component

Five AI plays (first-pass, checklist items, human judgment,
heightened scrutiny, self-review distance). Premise and limit
pinned against docs/07-code-review.md.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Panel 6 — Traps + Done Checklist

**Files:**
- Create: `web/src/features/code-review/traps.ts`
- Create: `web/src/features/code-review/traps.test.ts`
- Create: `web/src/features/code-review/done.ts`
- Create: `web/src/features/code-review/done.test.ts`
- Create: `web/src/features/code-review/CodeReviewChecklist.tsx`
- Create: `web/src/features/code-review/CodeReviewChecklist.test.tsx`

**Interfaces:**
- Consumes: `h2`, `flat` from `./doc-source`; `useLocalStorage` from `@/lib/useLocalStorage`; `InlineCode` from `@/components/InlineCode`; `TeamNotes` from `@/components/TeamNotes`; `getStage` from `@/lib/stages`; `Link` from `next/link`
- Produces: `TRAPS` array (used by Task 8 for trap callouts), `DONE`, `ARTIFACT_LIST` (used by CodeReviewChecklist), `CodeReviewChecklist` component (used by Task 8)

- [ ] **Step 1: Write the failing traps data test**

Create `web/src/features/code-review/traps.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('traps data', () => {
  const src = h2('Traps')

  test('eight traps', () => {
    const boldLeads = src.split('\n').filter((l) => /^\*\*.+\*\*/.test(l))
    expect(boldLeads).toHaveLength(8)
    expect(TRAPS).toHaveLength(8)
  })

  test('unique IDs', () => {
    const ids = TRAPS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('titles match bold leads in doc', () => {
    const boldLeads = src
      .split('\n')
      .filter((l) => /^\*\*.+\*\*/.test(l))
      .map((l) => l.match(/^\*\*(.+?)\*\*/)?.[1] ?? '')
    for (let i = 0; i < TRAPS.length; i++) {
      expect(TRAPS[i].title, `trap ${i}`).toBe(boldLeads[i])
    }
  })

  test('reviewing immediately trap pins body against doc', () => {
    expect(flat(src)).toContain(
      flat('You will read your intent, not your code'),
    )
  })

  test('reviewing in editor trap pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Same context that produced the bugs'),
    )
  })

  test('performative agreement trap pins against doc', () => {
    expect(flat(src)).toContain(
      flat('confident-sounding wrong advice enters a codebase'),
    )
  })
})
```

- [ ] **Step 2: Run test, write traps.ts**

Create `web/src/features/code-review/traps.ts`:

```ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'immediately',
    title: 'Reviewing immediately after writing.',
    body: 'You will read your intent, not your code. The break is what makes review work.',
  },
  {
    id: 'editor',
    title: 'Reviewing in your editor.',
    body: 'Same context that produced the bugs. The diff view is a different lens.',
  },
  {
    id: 'formatting',
    title: 'Spending review on formatting.',
    body: 'Prettier handles it. Every comment about spacing is attention not spent on the authorization bug.',
  },
  {
    id: 'large-prs',
    title: 'Approving large PRs anyway.',
    body: 'If it is too big to review properly, saying so is the review.',
  },
  {
    id: 'assume-tests',
    title: 'Assuming tests pass for the right reason.',
    body: 'Verify they fail without the change.',
  },
  {
    id: 'bundling',
    title: 'Bundling refactors with features.',
    body: 'Both become harder to review and harder to revert.',
  },
  {
    id: 'ceremony',
    title: 'Treating your own review as ceremony.',
    body: 'It is the only review the code will get. The techniques above exist because self-review is genuinely harder than reviewing someone else’s work — not because it is less important.',
  },
  {
    id: 'performative',
    title: 'Performative agreement with reviewers.',
    body: '“Good catch, fixed!” on a suggestion you have not verified is how confident-sounding wrong advice enters a codebase.',
  },
]
```

- [ ] **Step 3: Run traps test**

```bash
pnpm test -- --run src/features/code-review/traps.test.ts
```

Expected: PASS.

- [ ] **Step 4: Write the failing done data test**

Create `web/src/features/code-review/done.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { ARTIFACT_LIST, DONE } from './done'
import { flat, h2 } from './doc-source'

describe('done data', () => {
  test('six done items from definition of done', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(checks).toHaveLength(6)
    expect(DONE).toHaveLength(6)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('three artifacts', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(3)
    expect(ARTIFACT_LIST).toHaveLength(3)
  })

  test('first done item pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Diff read in the PR view, not the editor, after a real break'),
    )
  })

  test('tests verified pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Tests verified to fail without the change'),
    )
  })
})
```

- [ ] **Step 5: Write done.ts**

Create `web/src/features/code-review/done.ts`:

```ts
export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  { id: 'diff-read', label: 'Diff read in the PR view, not the editor, after a real break' },
  { id: 'checklist', label: 'Checklist above completed' },
  { id: 'tests-verified', label: 'Tests verified to fail without the change' },
  { id: 'description', label: 'Description covers what, why, how, verification' },
  { id: 'under-400', label: 'Under 400 lines, or deliberately split' },
  { id: 'preview', label: 'Preview URL checked (`12`)' },
]

export type TeamNote = {
  id: string
  title: string
  body: string
  stage?: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'reviewer-assignment',
    title: 'Assign reviewers deliberately',
    body: 'Rotate so knowledge spreads. Include someone unfamiliar with the area — their confusion is a signal, not a cost.',
  },
  {
    id: 'severity-system',
    title: 'Adopt the severity system',
    body: 'Critical / Important / Minor / Nit, with finding IDs and provenance tags. See the severity exercise above.',
    stage: '07-code-review',
  },
]

export const ARTIFACT_LIST: string[] = [
  'PR descriptions explaining what, why, how, and how it was verified',
  'Review comments recorded on the PR, including your own self-review notes',
  'Merged commits with clean, linear history',
]
```

- [ ] **Step 6: Run done test**

```bash
pnpm test -- --run src/features/code-review/done.test.ts
```

Expected: PASS.

- [ ] **Step 7: Write the failing CodeReviewChecklist render test**

Create `web/src/features/code-review/CodeReviewChecklist.test.tsx`:

```tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CodeReviewChecklist } from './CodeReviewChecklist'
import { DONE, ARTIFACT_LIST } from './done'

beforeEach(() => {
  window.localStorage.clear()
})

describe('CodeReviewChecklist', () => {
  test('renders all done checkboxes', () => {
    render(<CodeReviewChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
  })

  test('ticking a checkbox persists and shows count', () => {
    render(<CodeReviewChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of \d/)).toBeTruthy()
  })

  test('artifact list renders all items', () => {
    render(<CodeReviewChecklist />)
    for (const a of ARTIFACT_LIST) {
      expect(screen.getByText(new RegExp(a.slice(0, 30)))).toBeTruthy()
    }
  })

  test('team notes disclosure exists', () => {
    render(<CodeReviewChecklist />)
    expect(
      screen.getByRole('button', { name: /if you are not solo/i }),
    ).toBeTruthy()
  })
})
```

- [ ] **Step 8: Write CodeReviewChecklist.tsx**

Create `web/src/features/code-review/CodeReviewChecklist.tsx`:

```tsx
'use client'

import { useId } from 'react'
import Link from 'next/link'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { getStage } from '@/lib/stages'
import { ARTIFACT_LIST, DONE, TEAM } from './done'

const NOTHING_TICKED: string[] = []
const CHECKLIST_KEY = 'code-review-checklist'

export function CodeReviewChecklist() {
  const { value: ticked, setValue, reset } = useLocalStorage<string[]>(
    CHECKLIST_KEY,
    NOTHING_TICKED,
  )
  const prefix = useId()

  const progress = DONE.filter((item) => ticked.includes(item.id)).length

  function toggle(id: string) {
    setValue((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-8">
      {/* Artifacts */}
      <div>
        <h3 className="t-label mb-3 text-faint">Artifacts</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {ARTIFACT_LIST.map((a, i) => (
            <li key={i}>
              <InlineCode text={a} />
            </li>
          ))}
        </ul>
      </div>

      {/* Definition of done */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="t-label text-faint">Definition of done</h3>
          <p className="t-label text-sm" aria-live="polite">
            {progress > 0 && `${progress} of ${DONE.length}`}
          </p>
        </div>
        <ul className="space-y-2">
          {DONE.map((item) => {
            const id = `${prefix}-${item.id}`
            const on = ticked.includes(item.id)
            return (
              <li key={item.id} className="flex items-start gap-2">
                <input
                  id={id}
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(item.id)}
                  className="mt-1 accent-go"
                />
                <label htmlFor={id} className="text-sm">
                  <InlineCode text={item.label} />
                </label>
              </li>
            )
          })}
        </ul>
        {progress > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Clear all checkboxes?')) reset()
            }}
            className="mt-3 text-xs text-subtle underline hover:text-brand"
          >
            Clear
          </button>
        )}
      </div>

      {/* Team notes */}
      <TeamNotes>
        <ul className="space-y-4">
          {TEAM.map((note) => {
            const stage = note.stage ? getStage(note.stage) : null
            return (
              <li key={note.id}>
                <p className="font-semibold text-sm">{note.title}</p>
                <p className="text-sm text-subtle">
                  <InlineCode text={note.body} />
                  {stage && (
                    <>
                      {' '}
                      <Link
                        href={`/stages/${stage.slug}`}
                        className="underline hover:text-brand"
                      >
                        {stage.title}
                      </Link>
                    </>
                  )}
                </p>
              </li>
            )
          })}
        </ul>
      </TeamNotes>
    </div>
  )
}
```

- [ ] **Step 9: Run all tests for this task**

```bash
pnpm test -- --run src/features/code-review/traps.test.ts src/features/code-review/done.test.ts src/features/code-review/CodeReviewChecklist.test.tsx
```

Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add web/src/features/code-review/traps.ts web/src/features/code-review/traps.test.ts \
  web/src/features/code-review/done.ts web/src/features/code-review/done.test.ts \
  web/src/features/code-review/CodeReviewChecklist.tsx web/src/features/code-review/CodeReviewChecklist.test.tsx
git commit -m "feat(code-review): panel 6 traps, done checklist, team notes

Eight traps pinned against doc bold leads. Six done items with
persisted checkboxes. Three artifacts. Two team notes with
cross-stage link to severity exercise.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Assembly — Main Component + PR Template + Registration

**Files:**
- Create: `web/src/features/code-review/pr-template.ts`
- Create: `web/src/features/code-review/pr-template.test.ts`
- Create: `web/src/features/code-review/CodeReview.tsx`
- Modify: `web/src/features/stage-content.ts` (add `'07-code-review': CodeReview`)
- Modify: `web/src/lib/stages.ts` (flip `ready: true`)

**Interfaces:**
- Consumes: ALL data modules and components from Tasks 2–7. `Stepper`, `Step` from `@/components/Stepper`. All shared components (`Section`, `Prose`, `Callout`, `Contrast`, `Figure`, `Term`, `InlineCode`, `RevealList`, `RevealFacet`, `AnnotatedArtifact`, `References`). `getStage` from `@/lib/stages`. `type Artifact` from `@/components/artifact`.
- Produces: The fully assembled stage page at `/stages/07-code-review`.

- [ ] **Step 1: Write the failing PR template data test**

Create `web/src/features/code-review/pr-template.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { PR_TEMPLATE } from './pr-template'
import { fences } from './doc-source'

describe('PR template data', () => {
  test('template lines match the doc fenced code block', () => {
    const blocks = fences()
    const templateText = PR_TEMPLATE.lines.map((l) => l.text).join('\n')
    expect(blocks).toContain(templateText)
  })

  test('exactly one pivot line', () => {
    const pivots = PR_TEMPLATE.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
  })

  test('pivot is on the Why section', () => {
    const pivot = PR_TEMPLATE.lines.find((l) => l.pivot)!
    expect(pivot.text).toContain('Why')
  })
})
```

- [ ] **Step 2: Write pr-template.ts**

Lift the fenced code block from `docs/07-code-review.md` lines 95–111 verbatim:

```bash
cd /Users/angelito/personal/Development-Playbook
sed -n '96,110p' docs/07-code-review.md
```

Create `web/src/features/code-review/pr-template.ts`:

```ts
import { type Artifact } from '@/components/artifact'

export const PR_TEMPLATE: Artifact = {
  id: 'pr-template',
  filename: 'pull_request.md',
  language: 'yaml',
  lines: [
    { text: '## What' },
    { text: 'Adds a status filter to the invoice list.' },
    { text: '' },
    { text: '## Why', pivot: true, note: 'This is where you notice the approach is wrong.' },
    { text: 'Users with 100+ invoices could not find unpaid ones without scrolling.' },
    { text: 'Reported three times this month.' },
    { text: '' },
    { text: '## How' },
    { text: 'New `status` query param, defaulting to `all`. Filtering happens in the' },
    { text: 'database query, not client-side, so it works past the pagination boundary.' },
    { text: '' },
    { text: '## Verification' },
    { text: '- Preview: <url>' },
    { text: '- Checked: filter combinations, empty result state, browser back button' },
    { text: '- Migration: none' },
  ],
}
```

- [ ] **Step 3: Run PR template test**

```bash
pnpm test -- --run src/features/code-review/pr-template.test.ts
```

Expected: PASS. The `fences()` helper extracts all fenced code blocks, and the template text matches.

- [ ] **Step 4: Write the main component CodeReview.tsx**

Create `web/src/features/code-review/CodeReview.tsx`:

```tsx
import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { References } from '@/components/References'
import { getStage } from '@/lib/stages'
import { SelfReviewMatch } from './SelfReviewMatch'
import { AREAS } from './review-areas'
import { CHECKLIST } from './checklist-items'
import { ReviewDrill } from './ReviewDrill'
import { PR_TEMPLATE } from './pr-template'
import { PRACTICES } from './team'
import { SeverityDrill } from './SeverityDrill'
import { AIPlays } from './AIPlays'
import { TRAPS } from './traps'
import { CodeReviewChecklist } from './CodeReviewChecklist'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: self-review ---- */
  {
    id: 'self-review',
    label: 'Creating Distance',
    hint: 'The discipline that makes self-review real',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Before you begin" title="Entry criteria">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>CI is green (<Link href="/stages/11-ci-cd" className={stageLinkClass}>{stageTitle('11-ci-cd')}</Link>)</li>
            <li>The branch is rebased and history is clean</li>
            <li>The PR description explains why, not just what</li>
            <li>You have stepped away from the code for at least a few minutes</li>
          </ul>
        </Section>

        <Section title="Three techniques that change what you see">
          <Prose>
            <p>
              Solo, &ldquo;review&rdquo; sounds like theater. It is not &mdash; but it only
              works if you deliberately break the state that makes{' '}
              <Term id="self-review">self-review</Term> useless: you are still holding the
              intent in your head, so you read what you <em>meant</em> rather than what you{' '}
              <em>wrote</em>.
            </p>
          </Prose>
          <SelfReviewMatch />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: what-to-find ---- */
  {
    id: 'what-to-find',
    label: 'What to Look For',
    hint: 'The seven areas machines cannot judge',
    content: (
      <div className="space-y-16">
        <Section title="What to actually look for">
          <Prose>
            <p>
              Automation handles formatting, types, and lint. Do not spend attention there.
              Look at what machines cannot judge:
            </p>
          </Prose>
          <RevealList
            idPrefix="review-areas"
            rows={AREAS.map((a) => ({
              id: a.id,
              title: <span className="font-semibold">{a.title}</span>,
              body: (
                <p>
                  <InlineCode text={a.body} />
                </p>
              ),
            }))}
          />
        </Section>

        <Section title="The checklist">
          <Prose>
            <p>Fast pass, in this order:</p>
          </Prose>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {CHECKLIST.map((item) => (
              <li key={item.id}>
                <InlineCode text={item.label} />
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Practice: find the issue">
          <Prose>
            <p>
              Each snippet below hides one issue from the checklist. Pick the category before
              seeing the answer.
            </p>
          </Prose>
          <ReviewDrill />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: pr-discipline ---- */
  {
    id: 'pr-discipline',
    label: 'PR Discipline',
    hint: 'Descriptions, size, and testing the tests',
    content: (
      <div className="space-y-16">
        <Section title="PR descriptions">
          <Prose>
            <p>
              Write this before the review, not after. Articulating &ldquo;why&rdquo; is
              often when you notice the approach is wrong &mdash; and that is exactly the
              moment you want to notice.
            </p>
          </Prose>
          <AnnotatedArtifact artifact={PR_TEMPLATE} />
        </Section>

        <Section title="Size">
          <Prose>
            <p>
              <strong>Under 400 lines.</strong> Past that, review quality falls off a cliff
              &mdash; reviewers (including you) start skimming and approving on vibes.
            </p>
            <p>
              If a PR is genuinely large, split it: schema in one, backend in another, UI in
              a third. Each merges independently behind a flag.
            </p>
          </Prose>
          <Contrast
            bad={
              <div className="space-y-1 text-sm">
                <p className="font-semibold">1,200-line PR</p>
                <p>Feature + refactor + migration + test updates</p>
                <p className="text-subtle">Reviewer skims and approves</p>
              </div>
            }
            good={
              <div className="space-y-1 text-sm">
                <p className="font-semibold">Three PRs, ~400 lines each</p>
                <p>Schema migration → backend logic → UI component</p>
                <p className="text-subtle">Each reviewed and reverted independently</p>
              </div>
            }
            badLabel="Bundled"
            goodLabel="Split"
          />
        </Section>

        <Section title="Test the tests">
          <Prose>
            <p>
              The most commonly skipped review step: confirm the test would fail without the
              fix. This is the{' '}
              <Term id="teeth-check">teeth check</Term> (
              <Link href="/stages/06-testing" className={stageLinkClass}>
                {stageTitle('06-testing')}
              </Link>
              ): break the implementation, run the test, watch it &mdash; and only it &mdash;
              fail, restore.
            </p>
            <p>
              If it still passes broken, it is not testing what you think. This takes twenty
              seconds and catches a surprising number of tests that assert nothing meaningful.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: team ---- */
  {
    id: 'team',
    label: 'Scaling to a Team',
    hint: 'Severity, provenance, and team review culture',
    content: (
      <div className="space-y-16">
        <Section title="When review is someone else's job">
          <RevealList
            idPrefix="team-practices"
            rows={PRACTICES.map((p) => ({
              id: p.id,
              title: <span className="font-semibold">{p.title}</span>,
              body: (
                <p>
                  <InlineCode text={p.body} />
                </p>
              ),
            }))}
          />
        </Section>

        <Section title="Classify by severity">
          <Prose>
            <p>
              Label every review comment so the author knows what blocks the merge and what
              does not. Classify each comment below:
            </p>
          </Prose>
          <SeverityDrill />
        </Section>

        <Section title="Provenance and the duty to retract">
          <Prose>
            <p>
              Tag each finding with an ID (<code>C1</code>, <code>I1</code>,{' '}
              <code>M1</code>, <code>N1</code>) so follow-ups can reference it. Where{' '}
              <Term id="provenance">provenance</Term> matters, mark whether the finding is
              new, pre-existing (<code>PRE-EXISTING</code>), or introduced by the plan (
              <code>PLAN-AUTHORED ERROR</code>). The distinction changes who fixes it.
            </p>
            <p>
              A reviewer is expected to disprove as well as confirm. If you wrote
              &ldquo;this is a security issue&rdquo; and then discover it is not, say so and
              retract the finding &mdash; a retracted finding is more useful than a wrong one
              left standing.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: ai ---- */
  {
    id: 'ai',
    label: 'AI in Code Review',
    hint: 'What AI catches, what it misses, and the human+AI split',
    content: (
      <div className="space-y-16">
        <Section title="AI in code review">
          <AIPlays />
        </Section>

        <Section title="Automated review has a place">
          <Prose>
            <p>
              Static analysis and AI review tools catch a real class of issue &mdash; missing
              null checks, unhandled promise rejections, subtle logic inversions &mdash; and
              they never get tired or assume they already know what the code does.
            </p>
            <p>
              Use them as an <em>additional</em> pass, not a replacement. They are poor at
              judging whether the change was worth making, whether the abstraction fits the
              domain, or whether the authorization model is right. Those are the parts that
              matter most.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 6: traps ---- */
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The review mistakes that look like normal work',
    content: (
      <div className="space-y-16">
        <Section title="Traps">
          <div className="space-y-4">
            {TRAPS.map((trap) => (
              <Callout key={trap.id} kind="trap" title={trap.title}>
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
        </Section>

        <Section title="Done">
          <CodeReviewChecklist />
        </Section>

        <References slug="07-code-review" />
      </div>
    ),
  },
]

export function CodeReview() {
  return <Stepper steps={CONTENT_STEPS} />
}
```

- [ ] **Step 5: Register the stage in stage-content.ts**

In `web/src/features/stage-content.ts`, add the import and entry:

```ts
import { CodeReview } from './code-review/CodeReview'

// In STAGE_CONTENT:
  '07-code-review': CodeReview,
```

- [ ] **Step 6: Flip `ready: true` in stages.ts**

In `web/src/lib/stages.ts`, find the stage 07 entry and change `ready: false` to `ready: true`.

- [ ] **Step 7: Run typecheck**

```bash
pnpm typecheck
```

Expected: PASS.

- [ ] **Step 8: Run all tests**

```bash
pnpm test -- --run
```

Expected: PASS across both vitest projects.

- [ ] **Step 9: Run lint**

```bash
pnpm lint
```

Expected: PASS with zero warnings.

- [ ] **Step 10: Build and run the audit suite**

```bash
pnpm build
pnpm test:e2e
```

Expected: Build succeeds with all pages prerendered. Audit suite passes — contrast, responsive, console errors.

- [ ] **Step 11: Commit**

```bash
git add web/src/features/code-review/pr-template.ts web/src/features/code-review/pr-template.test.ts \
  web/src/features/code-review/CodeReview.tsx web/src/features/stage-content.ts \
  web/src/lib/stages.ts
git commit -m "feat(code-review): assemble six panels and register stage 07

PR template as AnnotatedArtifact with pivot on Why section.
Main component wires all six panels through Stepper.
stages.ts flipped to ready: true, stage-content.ts registered.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

Run the full gate cheapest-first:

```bash
cd /Users/angelito/personal/Development-Playbook/web
pnpm lint
pnpm typecheck
pnpm test -- --run
pnpm build
pnpm test:e2e
pnpm test:dev-console  # once for the round — the only thing that sees React dev validation
```

Then the three live passes from `DESIGN.md`:

1. **Contrast** — every text/background pair, both themes, all six panels, every expanded Term and RevealList facet. WCAG AA.
2. **Responsive** — 320→2560px, no horizontal overflow, no sub-44px touch target below `lg`. The code blocks in ReviewDrill are the stress case.
3. **Console** — zero errors in a clean browser context (not hot-reloaded).

Then `humanizer:humanizer` over the panel prose.

**Coverage walk** — dispatch mid-round, given only `docs/07-code-review.md` and `src/features/code-review/`, with this plan, the spec, all task briefs and reports withheld. Budget a fix wave.

**Panel weight** — measure and compare against stage 06's 2.74 median. Expect lower; verify not suspiciously low.
