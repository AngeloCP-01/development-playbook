# Stage 12 (Staging) Interactive Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `docs/12-staging.md` into an interactive stepper at `web/src/features/staging/`, flip `ready: true`, and advance W-3 to 8/18.

**Architecture:** Six steps (`preview → database → checklist → env → ai → traps`), one scored binary exercise (PreviewOrStaging), an annotated artifact for the hostile seed block, a RevealList for the preview checklist, and the standard AI plays / checklist / traps closing. All shared components already exist; no new abstractions.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, Vitest, `@testing-library/react`

**Spec:** `docs/superpowers/specs/2026-09-01-stage-12-staging-port-design.md`

## Global Constraints

- D-52: one judgment per step, panel under four screens at 1024×768.
- D-35: AI plays step is mandatory.
- D-47: grep `terms.ts` before writing any prose that introduces a term.
- D-67: doc-pinned assertions use literal phrases from the doc, collapsed via `flat()`.
- Tests use `@testing-library/react` + plain DOM assertions (`el.getAttribute(...)`, `(el as HTMLInputElement).checked`). Never `jest-dom` or `user-event`.
- `doc-source.ts` helpers (`section`, `flat`, `fences`, `h2`) handle hard line-wraps.
- The three-file registration (`stages.ts`, `stage-content.ts`, `step-ids.ts`) is one atomic operation — do it in the assembly task, not the scaffold.
- The `aria-live` score region renders only after the first pick, not on initial load (M2 lesson from stage 07).
- Tailwind v4 token naming: check `globals.css`'s `@theme` block for class names. `border-line` not `border-rule`, `bg-sunken` not `bg-surface-sunken`.
- `InlineCode` for any data string that carries backticks from the doc. Never render raw backticks.
- Commit after each task. Message format: `feat(staging): <what>`.

---

### Task 1: Steps, doc-source, and terms

**Files:**
- Create: `web/src/features/staging/steps.ts`
- Create: `web/src/features/staging/steps.test.ts`
- Create: `web/src/features/staging/doc-source.ts`
- Modify: `web/src/lib/terms.ts`
- Modify: `web/src/lib/terms.ts` (gen:glossary after)

**Interfaces:**
- Produces: `STEP_IDS` (readonly tuple), `StepId` (union type) — used by Tasks 7 and 8
- Produces: `DOC`, `section`, `h2`, `flat`, `fences` — used by every `.test.ts` in Tasks 2–5

- [ ] **Step 1: Create `steps.ts`**

```ts
// web/src/features/staging/steps.ts
export const STEP_IDS = [
  'preview',
  'database',
  'checklist',
  'env',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 2: Create `doc-source.ts`**

```ts
// web/src/features/staging/doc-source.ts
import { docSource } from '@/test/doc-source'

export const { DOC, section, h2, flat, fences } = docSource(
  'docs/12-staging.md',
)
```

- [ ] **Step 3: Write `steps.test.ts`**

```ts
// web/src/features/staging/steps.test.ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('staging steps', () => {
  test('six steps in order', () => {
    expect(STEP_IDS).toEqual([
      'preview',
      'database',
      'checklist',
      'env',
      'ai',
      'traps',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/steps.test.ts
```

Expected: PASS — 2 tests.

- [ ] **Step 5: Add three terms to `terms.ts`**

Grep first to confirm they don't exist, then add after the `preview-deployment` entry:

```ts
  'staging-environment': {
    name: 'Staging environment',
    short: 'A single long-lived deployment tracking a shared branch.',
    full: 'A persistent deployment at a stable URL, usually tracking a shared branch like staging or develop. Unlike a preview deployment, it is not per-branch or ephemeral.',
    soWhat:
      'Solo, you usually do not need one. Preview deployments cover the need. Add staging only when something concrete demands a stable URL — a third-party integration, a stakeholder demo, or a sandbox account with an external provider.',
    see: '12-staging',
  },
  'database-branching': {
    name: 'Database branching',
    short: 'A copy-on-write database clone created per preview deployment.',
    full: 'An isolated database branch (e.g. via Neon) that starts as a copy of the production schema and data. Changes in the branch do not touch the parent. Created automatically per preview deployment and cleaned up when the Git branch is deleted.',
    soWhat:
      'It lets you run destructive migrations, seed hostile data, and delete everything with a production-shaped dataset and no risk to production. The single highest-value technique in the staging stage.',
    see: '12-staging',
  },
  'deployment-protection': {
    name: 'Deployment protection',
    short: 'Authentication on preview URLs so they are not publicly accessible.',
    full: 'A setting (e.g. Vercel Deployment Protection) that requires authentication before a preview URL loads. Preview URLs are unlisted, not secret — they end up in Slack, issue trackers, and occasionally search indexes.',
    soWhat:
      'If the product is not public yet or previews touch anything sensitive, protection keeps casual visitors out. For CI, a bypass secret lets Playwright reach the page without a login.',
    see: '12-staging',
  },
```

- [ ] **Step 6: Regenerate glossary**

```bash
cd web && pnpm gen:glossary
```

Verify `reference/glossary.md` gained three new entries.

- [ ] **Step 7: Run full test suite**

```bash
cd web && pnpm test
```

Expected: all pass (the glossary snapshot test should pass after regeneration).

- [ ] **Step 8: Commit**

```bash
git add web/src/features/staging/steps.ts web/src/features/staging/steps.test.ts \
  web/src/features/staging/doc-source.ts web/src/lib/terms.ts reference/glossary.md
git commit -m "feat(staging): steps, doc-source, and three new terms

STEP_IDS tuple (6 steps), StepId type, doc-source helper.
Terms: staging-environment, database-branching, deployment-protection.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Traps data

**Files:**
- Create: `web/src/features/staging/traps.ts`
- Create: `web/src/features/staging/traps.test.ts`

**Interfaces:**
- Consumes: `h2`, `flat` from `./doc-source` (Task 1)
- Produces: `TRAPS: Trap[]` (5 items) — used by Task 7

- [ ] **Step 1: Write `traps.test.ts`**

```ts
// web/src/features/staging/traps.test.ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('staging traps data', () => {
  const src = h2('Traps')

  test('five traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(5)
    expect(TRAPS).toHaveLength(5)
  })

  test('unique IDs', () => {
    const ids = TRAPS.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every title matches a bold lead in the doc', () => {
    const boldLeads = (src.match(/^\*\*(.+?)\*\*/gm) ?? []).map((b) =>
      flat(b.replace(/\*\*/g, '')),
    )
    for (const t of TRAPS) {
      expect(
        boldLeads.some((b) => b.includes(flat(t.title))),
        `"${t.title}" not found in doc bold leads`,
      ).toBe(true)
    }
  })

  test('body pin: preview-as-proof trap', () => {
    expect(flat(src)).toContain(
      flat('this query is fine on 50 rows and times out on 5 million'),
    )
  })

  test('body pin: sterile seed data trap', () => {
    expect(flat(src)).toContain(
      flat('Clean seeds produce clean-looking UIs that shatter on contact'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(10)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/traps.test.ts
```

Expected: FAIL — `Cannot find module './traps'`.

- [ ] **Step 3: Write `traps.ts`**

```ts
// web/src/features/staging/traps.ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'preview-as-proof',
    title: 'Treating a preview as proof it works in production.',
    body: 'Previews differ in data volume, traffic, cache state, and often environment variables. They catch a great deal. They do not catch “this query is fine on 50 rows and times out on 5 million.” That is what Post-Deployment Verification is for.',
  },
  {
    id: 'production-database',
    title: 'Pointing previews at the production database.',
    body: 'It works, right up until the day it deletes something. The convenience is not worth the tail risk.',
  },
  {
    id: 'sterile-seeds',
    title: 'Sterile seed data.',
    body: 'Clean seeds produce clean-looking UIs that shatter on contact with real records. Seed hostile.',
  },
  {
    id: 'staging-habit',
    title: 'Maintaining staging out of habit.',
    body: 'A long-lived staging environment that nobody looks at still costs money, still drifts from production, and still generates alerts. If it has no clear purpose, delete it.',
  },
  {
    id: 'only-changed',
    title: 'Only checking the thing you changed.',
    body: 'The bug is usually next door.',
  },
  {
    id: 'too-small',
    title: 'Skipping the preview when the change is “too small.”',
    body: 'Small changes ship unreviewed precisely because they seem safe, which is why they cause a disproportionate share of incidents. Loading the URL takes fifteen seconds.',
  },
]
```

Note: the doc has **six** bold-led traps (I miscounted in the spec as 5 — recount now: "Treating a preview…", "Pointing previews…", "Sterile seed data.", "Maintaining staging…", "Only checking…", "Skipping the preview…"). Update the test count to 6 and the array accordingly.

**Correction:** Re-read the doc. Lines 212–231 have six `**bold**` paragraphs. Update `traps.test.ts` Step 1's count expectation from 5 to 6, and the array above already has 6 entries.

- [ ] **Step 4: Fix the test — update count from 5 to 6**

In `traps.test.ts`, change:
```ts
    expect(boldLeads).toHaveLength(6)
    expect(TRAPS).toHaveLength(6)
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/traps.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/staging/traps.ts web/src/features/staging/traps.test.ts
git commit -m "feat(staging): traps data module — six traps pinned to doc

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: AI plays data and component

**Files:**
- Create: `web/src/features/staging/ai-plays.ts`
- Create: `web/src/features/staging/ai-plays.test.ts`
- Create: `web/src/features/staging/AIPlays.tsx`
- Create: `web/src/features/staging/AIPlays.test.tsx`

**Interfaces:**
- Consumes: `section`, `flat` from `./doc-source` (Task 1)
- Produces: `AI_PREMISE`, `AI_LIMIT`, `PLAYS: Play[]` — used by `AIPlays.tsx`
- Produces: `AIPlays` component — used by Task 7

- [ ] **Step 1: Write `ai-plays.test.ts`**

```ts
// web/src/features/staging/ai-plays.test.ts
import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('staging AI plays data', () => {
  const src = section('AI in staging')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(
      flat('Mechanical coverage is the strength'),
    )
  })

  test('limit pins against doc', () => {
    expect(flat(src)).toContain(
      flat('noticing what is absent, which is the one thing a mechanical pass cannot do'),
    )
  })

  test('four plays', () => {
    expect(PLAYS).toHaveLength(4)
  })

  test('unique IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all kinds are valid', () => {
    const valid = new Set(['skill', 'command', 'mcp', 'memory', 'prompt', 'cli'])
    for (const p of PLAYS) {
      expect(valid.has(p.kind), `${p.id} kind "${p.kind}"`).toBe(true)
    }
  })

  test('every play has sufficient text', () => {
    for (const p of PLAYS) {
      expect(p.title.length, `${p.id} title`).toBeGreaterThan(10)
      expect(p.body.length, `${p.id} body`).toBeGreaterThan(20)
    }
  })

  test('premise and limit are non-trivial', () => {
    expect(AI_PREMISE.length).toBeGreaterThan(20)
    expect(AI_LIMIT.length).toBeGreaterThan(20)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/ai-plays.test.ts
```

Expected: FAIL — `Cannot find module './ai-plays'`.

- [ ] **Step 3: Write `ai-plays.ts`**

```ts
// web/src/features/staging/ai-plays.ts
export const AI_PREMISE =
  'An agent can walk a preview URL methodically — every viewport, every state, every checklist item — without getting bored and without skipping the signed-out check because it “probably still works.” What it cannot do is notice that the empty state feels confusing, that the loading skeleton implies a layout the page does not deliver, or that the error message makes sense only to someone who has read the codebase. Mechanical coverage is the strength; judgment about what a user actually experiences is the gap.'

export const AI_LIMIT =
  'None of this replaces opening the preview yourself and asking “does this feel right.” The two hardest checklist items — “does it actually work” and “did anything else break” — require noticing what is absent, which is the one thing a mechanical pass cannot do.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'preview-walk',
    title: 'Drive the preview checklist',
    kind: 'mcp',
    body: 'Open the preview URL, walk the primary flow, then walk it signed out, throttled, at 320px and at 2560px. A browser MCP does this faster and more consistently than a human, and it does not skip the narrow viewport because the feature “is not mobile.”',
  },
  {
    id: 'smoke-suite',
    title: 'Run the smoke suite against the preview URL',
    kind: 'command',
    body: '`BASE_URL=<url> pnpm test:e2e` — the same suite CI runs locally, pointed at the live preview. Catches regressions the preview checklist’s manual walk would miss.',
  },
  {
    id: 'hostile-seeds',
    title: 'Generate hostile seed data',
    kind: 'prompt',
    body: 'Describe the schema; ask for seed records that break layouts — long names, empty fields, Unicode, null avatars, extreme counts. Faster than inventing them by hand, and it produces combinations you would not think to try.',
  },
  {
    id: 'env-diff',
    title: 'Diff environment variables across scopes',
    kind: 'cli',
    body: '`vercel env ls` shows what is set for Production, Preview, and Development. A missing Preview variable is invisible until the preview fails; listing them side by side surfaces the gap.',
  },
]
```

- [ ] **Step 4: Run data test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/ai-plays.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write `AIPlays.test.tsx`**

```tsx
// web/src/features/staging/AIPlays.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AIPlays } from './AIPlays'
import { PLAYS } from './ai-plays'

describe('AIPlays', () => {
  test('renders every play title', () => {
    render(<AIPlays />)
    for (const p of PLAYS) {
      expect(screen.getByText(new RegExp(p.title.slice(0, 25)))).toBeTruthy()
    }
  })

  test('premise key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/Mechanical coverage is the strength/i)).toBeTruthy()
  })

  test('limit key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(
      screen.getByText(/noticing what is absent/i),
    ).toBeTruthy()
  })
})
```

- [ ] **Step 6: Run render test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/AIPlays.test.tsx
```

Expected: FAIL — `Cannot find module './AIPlays'`.

- [ ] **Step 7: Write `AIPlays.tsx`**

```tsx
// web/src/features/staging/AIPlays.tsx
import { TriangleAlert } from 'lucide-react'
import { RevealList } from '@/components/RevealList'
import { InlineCode } from '@/components/InlineCode'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import type { RevealRow } from '@/components/RevealList'

const KIND_LABEL: Record<string, string> = {
  mcp: 'Browser tool',
  command: 'Saved command',
  prompt: 'Prompt',
  cli: 'CLI command',
}

export function AIPlays() {
  const rows: RevealRow[] = PLAYS.map((p) => ({
    id: p.id,
    title: <InlineCode text={p.title} />,
    badge: (
      <span className="t-label text-subtle">{KIND_LABEL[p.kind]}</span>
    ),
    body: (
      <p className="text-sm text-muted">
        <InlineCode text={p.body} />
      </p>
    ),
  }))

  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="staging-ai"
        rows={rows}
        header={
          <p className="text-sm text-muted">
            <InlineCode text={AI_PREMISE} />
          </p>
        }
      />

      <div className="flex gap-3 rounded-md border border-warn/30 bg-warn/5 px-4 py-3">
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-warn"
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">
            What none of this replaces
          </p>
          <p className="text-sm text-muted">
            <InlineCode text={AI_LIMIT} />
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Run render test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/AIPlays.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/staging/ai-plays.ts web/src/features/staging/ai-plays.test.ts \
  web/src/features/staging/AIPlays.tsx web/src/features/staging/AIPlays.test.tsx
git commit -m "feat(staging): AI plays data and component — four tool plays

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Checklist data and checklist component

**Files:**
- Create: `web/src/features/staging/checklist.ts`
- Create: `web/src/features/staging/checklist.test.ts`
- Create: `web/src/features/staging/StagingChecklist.tsx`
- Create: `web/src/features/staging/StagingChecklist.test.tsx`

**Interfaces:**
- Consumes: `h2`, `flat` from `./doc-source` (Task 1)
- Produces: `DONE: DoneItem[]`, `ARTIFACT_LIST: string[]`, `TEAM: TeamNote[]` — used by `StagingChecklist.tsx`
- Produces: `StagingChecklist` component, `STAGING_CHECKLIST_KEY` — used by Task 7

- [ ] **Step 1: Write `checklist.test.ts`**

```ts
// web/src/features/staging/checklist.test.ts
import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('staging checklist data', () => {
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

  test('four artifacts', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(4)
    expect(ARTIFACT_LIST).toHaveLength(4)
  })

  test('first done item pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('The preview URL loads and the changed flow works end to end'),
    )
  })

  test('migration done item pins against doc', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Any migration ran cleanly against a branched database, not production'),
    )
  })

  test('team notes exist', () => {
    expect(TEAM.length).toBeGreaterThanOrEqual(2)
    for (const n of TEAM) {
      expect(n.title.length).toBeGreaterThan(5)
      expect(n.body.length).toBeGreaterThan(10)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/checklist.test.ts
```

Expected: FAIL — `Cannot find module './checklist'`.

- [ ] **Step 3: Write `checklist.ts`**

```ts
// web/src/features/staging/checklist.ts
export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'flow-works',
    label: 'The preview URL loads and the changed flow works end to end',
  },
  {
    id: 'edge-states',
    label: 'Checked signed-out, empty, and error states',
  },
  {
    id: 'viewports',
    label: 'Checked one narrow viewport and one wide one',
  },
  {
    id: 'regressions',
    label: 'Checked one adjacent feature for regressions',
  },
  {
    id: 'migration',
    label: 'Any migration ran cleanly against a branched database, not production',
  },
  {
    id: 'e2e',
    label: 'E2E passed against this preview URL',
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'review-artifact',
    title: 'Previews become the review artifact',
    body: '“Looks good” on a diff means less than “I clicked through the preview.” Link the URL in the PR description; make it the norm.',
  },
  {
    id: 'data-hygiene',
    title: 'Establish preview data hygiene',
    body: 'With several engineers, someone will paste real customer data into a preview to reproduce a bug. Decide the rule before it happens.',
  },
  {
    id: 'staging-place',
    title: 'Now staging may earn its place',
    body: 'For cross-team integration testing, or for a QA process that needs a stable target.',
  },
  {
    id: 'visual-regression',
    title: 'Automate visual regression',
    body: 'If UI churn gets high enough that eyeballing every preview stops scaling.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'A preview URL attached to every pull request',
  'An isolated database branch per preview',
  'A seed script with deliberately awkward data',
  'Deployment protection enabled where the product is not yet public',
]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/checklist.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write `StagingChecklist.test.tsx`**

```tsx
// web/src/features/staging/StagingChecklist.test.tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StagingChecklist } from './StagingChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

describe('StagingChecklist', () => {
  test('renders all done checkboxes', () => {
    render(<StagingChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
  })

  test('ticking a checkbox persists and shows count', () => {
    render(<StagingChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of \d/)).toBeTruthy()
  })

  test('artifact list renders all items', () => {
    render(<StagingChecklist />)
    for (const a of ARTIFACT_LIST) {
      expect(screen.getByText(new RegExp(a.slice(0, 30)))).toBeTruthy()
    }
  })

  test('team notes disclosure exists', () => {
    render(<StagingChecklist />)
    expect(
      screen.getByRole('button', { name: /if you are not solo/i }),
    ).toBeTruthy()
  })
})
```

- [ ] **Step 6: Run render test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/StagingChecklist.test.tsx
```

Expected: FAIL — `Cannot find module './StagingChecklist'`.

- [ ] **Step 7: Write `StagingChecklist.tsx`**

Follow the `CodeReviewChecklist.tsx` pattern exactly:
- `'use client'` directive
- `useLocalStorage<string[]>(STAGING_CHECKLIST_KEY, NOTHING_TICKED)` with `{ value, setValue, reset }`
- `useId()` for checkbox IDs
- Artifacts section at the top, DoD checkboxes below, clear button at the bottom
- `TeamNotes` disclosure with the four team notes
- Export `STAGING_CHECKLIST_KEY = 'staging-checklist'`

```tsx
// web/src/features/staging/StagingChecklist.tsx
'use client'

import { useId } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'

export const STAGING_CHECKLIST_KEY = 'staging-checklist'

const NOTHING_TICKED: string[] = []

export function StagingChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(STAGING_CHECKLIST_KEY, NOTHING_TICKED)
  const idBase = useId()

  const count = DONE.filter((item) => ticked.includes(item.id)).length
  const complete = count === DONE.length

  const toggle = (id: string) =>
    setValue((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  return (
    <div className="space-y-4">
      <Card className="p-0">
        <div className="border-b border-line px-5 py-3.5">
          <p className="text-sm font-medium">Artifacts</p>
          <ul className="mt-2 space-y-1.5">
            {ARTIFACT_LIST.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-6 text-muted"
              >
                <span className="mt-0.5 shrink-0 text-subtle" aria-hidden>
                  &rsaquo;
                </span>
                <span className="min-w-0 break-words">
                  <InlineCode text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium">Definition of done</p>
            <p className="mt-0.5 text-sm text-subtle">
              Saved in this browser as you tick. Nothing leaves your machine.
            </p>
          </div>
          <span
            className="t-data flex items-center gap-1.5 text-subtle"
            aria-live="polite"
          >
            {complete ? (
              <Check className="size-3.5 text-go" aria-hidden />
            ) : (
              count > 0 && <Save className="size-3.5" aria-hidden />
            )}
            {count > 0 && `${count} of ${DONE.length}`}
          </span>
        </div>

        <ul className="divide-y divide-line">
          {DONE.map((item) => {
            const on = ticked.includes(item.id)
            const id = `${idBase}-${item.id}`
            return (
              <li key={item.id}>
                <label
                  className="flex min-h-11 cursor-pointer items-start gap-3.5 px-5 py-3 transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                  htmlFor={id}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(item.id)}
                    className="mt-1 size-4 shrink-0 accent-go"
                  />
                  <span
                    className={`min-w-0 break-words text-sm leading-6 ${on ? 'text-subtle' : 'text-muted'}`}
                  >
                    <InlineCode text={item.label} />
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear every tick? This cannot be undone.')) {
                reset()
              }
            }}
            disabled={count === 0}
            className="flex min-h-11 items-center gap-2 border border-line px-3.5 text-sm text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 lg:min-h-9"
          >
            <RotateCcw className="size-4" aria-hidden />
            Clear
          </button>
          <p className="text-sm text-subtle" aria-live="polite">
            {complete
              ? 'Every box ticked — the preview is verified.'
              : 'Tick a box only once you have actually done it.'}
          </p>
        </div>
      </Card>

      <TeamNotes>
        <ul className="space-y-3">
          {TEAM.map((note) => (
            <li key={note.id}>
              <p className="text-sm font-medium text-fg">{note.title}</p>
              <p className="mt-0.5">
                <InlineCode text={note.body} />
              </p>
            </li>
          ))}
        </ul>
      </TeamNotes>
    </div>
  )
}
```

- [ ] **Step 8: Run render test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/StagingChecklist.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/staging/checklist.ts web/src/features/staging/checklist.test.ts \
  web/src/features/staging/StagingChecklist.tsx web/src/features/staging/StagingChecklist.test.tsx
git commit -m "feat(staging): checklist data and StagingChecklist component

Six DoD items, four artifacts, four team notes. Persisted via
useLocalStorage, same pattern as CodeReviewChecklist.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: PreviewOrStaging exercise data and component

**Files:**
- Create: `web/src/features/staging/scenarios.ts`
- Create: `web/src/features/staging/scenarios.test.ts`
- Create: `web/src/features/staging/PreviewOrStaging.tsx`
- Create: `web/src/features/staging/PreviewOrStaging.test.tsx`

**Interfaces:**
- Consumes: `flat`, `h2` from `./doc-source` (Task 1)
- Produces: `SCENARIOS: Scenario[]`, `CHOICES: Choice[]` — used by `PreviewOrStaging.tsx`
- Produces: `PreviewOrStaging` component — used by Task 7

- [ ] **Step 1: Write `scenarios.test.ts`**

```ts
// web/src/features/staging/scenarios.test.ts
import { describe, expect, test } from 'vitest'
import { SCENARIOS, CHOICES } from './scenarios'

describe('preview-or-staging scenario data', () => {
  test('five scenarios', () => {
    expect(SCENARIOS).toHaveLength(5)
  })

  test('two choices', () => {
    expect(CHOICES).toHaveLength(2)
    expect(CHOICES.map((c) => c.id)).toEqual(['preview', 'staging'])
  })

  test('unique scenario IDs', () => {
    const ids = SCENARIOS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every answer is a valid choice', () => {
    const choiceIds = new Set(CHOICES.map((c) => c.id))
    for (const s of SCENARIOS) {
      expect(choiceIds.has(s.answer), `${s.id} → ${s.answer}`).toBe(true)
    }
  })

  test('distribution: at least 2 preview, at least 2 staging', () => {
    const tally: Record<string, number> = {}
    for (const s of SCENARIOS) tally[s.answer] = (tally[s.answer] ?? 0) + 1
    expect(tally['preview']).toBeGreaterThanOrEqual(2)
    expect(tally['staging']).toBeGreaterThanOrEqual(2)
  })

  test('every scenario has sufficient text', () => {
    for (const s of SCENARIOS) {
      expect(s.situation.length, `${s.id} situation`).toBeGreaterThan(20)
      expect(s.reasoning.length, `${s.id} reasoning`).toBeGreaterThan(20)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/scenarios.test.ts
```

Expected: FAIL — `Cannot find module './scenarios'`.

- [ ] **Step 3: Write `scenarios.ts`**

Each scenario's answer traces to the doc's own advice. Reasoning quotes or paraphrases the relevant passage.

```ts
// web/src/features/staging/scenarios.ts
export type Answer = 'preview' | 'staging'

export type Choice = {
  id: Answer
  label: string
}

export const CHOICES: Choice[] = [
  { id: 'preview', label: 'Preview deployment' },
  { id: 'staging', label: 'Staging environment' },
]

export type Scenario = {
  id: string
  situation: string
  answer: Answer
  reasoning: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'stripe-webhook',
    situation:
      'You need to test a Stripe webhook integration with a sandbox account that requires a fixed callback URL.',
    answer: 'staging',
    reasoning:
      'A sandbox account with a fixed callback URL needs one stable URL to point at. The doc says staging matters when “you need one stable URL to point at — a third party integrating against you.”',
  },
  {
    id: 'pr-review',
    situation:
      'A teammate wants to see your pull request running in a real browser before approving it.',
    answer: 'preview',
    reasoning:
      'Every pull request gets a preview deployment automatically. The teammate clicks the link in the PR — no staging needed.',
  },
  {
    id: 'migration-test',
    situation:
      'You want to test a database migration that adds a column, against production-shaped data.',
    answer: 'preview',
    reasoning:
      'With Neon database branching, the preview gets its own copy-on-write branch from production. You can run destructive migrations with no risk to production.',
  },
  {
    id: 'client-demo',
    situation:
      'A client demo next week needs a URL that stays the same regardless of new commits to the branch.',
    answer: 'staging',
    reasoning:
      'The doc says staging matters for “a stakeholder who cannot handle a new link each time.” A client demo needs a stable URL that does not change when you push.',
  },
  {
    id: 'responsive-check',
    situation:
      'You want to check a UI change at 320px on a throttled network connection.',
    answer: 'preview',
    reasoning:
      'The preview checklist says to check “a narrow viewport, and one wide one” and “a slow network.” This is exactly what a preview URL is for.',
  },
]
```

- [ ] **Step 4: Run data test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/scenarios.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write `PreviewOrStaging.test.tsx`**

```tsx
// web/src/features/staging/PreviewOrStaging.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { PreviewOrStaging } from './PreviewOrStaging'
import { SCENARIOS, CHOICES } from './scenarios'

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function rowFor(situation: string) {
  return screen.getByRole('radiogroup', {
    name: new RegExp(escapeRegExp(situation.slice(0, 30))),
  })
}

function pick(situation: string, choiceLabel: string) {
  const row = rowFor(situation)
  fireEvent.click(within(row).getByRole('radio', { name: choiceLabel }))
}

describe('PreviewOrStaging', () => {
  test('renders one radiogroup per scenario', () => {
    render(<PreviewOrStaging />)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SCENARIOS.length)
  })

  test('correct answer shows green verdict and increments score', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const choice = CHOICES.find((c) => c.id === s.answer)!
    pick(s.situation, choice.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('wrong answer shows red verdict with the correct choice', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const wrong = CHOICES.find((c) => c.id !== s.answer)!
    pick(s.situation, wrong.label)
    const correct = CHOICES.find((c) => c.id === s.answer)!
    const row = rowFor(s.situation)
    expect(
      within(row).getByText(new RegExp(escapeRegExp(correct.label))),
    ).toBeTruthy()
  })

  test('answer locks on first selection', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const correct = CHOICES.find((c) => c.id === s.answer)!
    const wrong = CHOICES.find((c) => c.id !== s.answer)!
    pick(s.situation, correct.label)
    pick(s.situation, wrong.label)
    expect(screen.getByText('1/1 right')).toBeTruthy()
  })

  test('all radios disabled after commit', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const choice = CHOICES.find((c) => c.id === s.answer)!
    pick(s.situation, choice.label)
    const row = rowFor(s.situation)
    for (const r of within(row).getAllByRole('radio')) {
      expect((r as HTMLButtonElement).disabled).toBe(true)
    }
  })

  test('score has aria-live polite after first pick', () => {
    render(<PreviewOrStaging />)
    const s = SCENARIOS[0]
    const choice = CHOICES.find((c) => c.id === s.answer)!
    pick(s.situation, choice.label)
    const score = screen.getByText(/\d+\/\d+ right/)
    expect(score.closest('[aria-live]')?.getAttribute('aria-live')).toBe(
      'polite',
    )
  })

  test('full score after all correct', () => {
    render(<PreviewOrStaging />)
    for (const s of SCENARIOS) {
      const choice = CHOICES.find((c) => c.id === s.answer)!
      pick(s.situation, choice.label)
    }
    expect(screen.getByText('5/5 right')).toBeTruthy()
  })
})
```

- [ ] **Step 6: Run render test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/PreviewOrStaging.test.tsx
```

Expected: FAIL — `Cannot find module './PreviewOrStaging'`.

- [ ] **Step 7: Write `PreviewOrStaging.tsx`**

Follow the `SeverityDrill.tsx` pattern exactly — binary radio choice per row, scored, locked on first pick:

```tsx
// web/src/features/staging/PreviewOrStaging.tsx
'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { SCENARIOS, CHOICES, type Answer } from './scenarios'

export function PreviewOrStaging() {
  const [picks, setPicks] = useState<Record<string, Answer>>({})

  function commit(scenarioId: string, answer: Answer) {
    setPicks((prev) =>
      scenarioId in prev ? prev : { ...prev, [scenarioId]: answer },
    )
  }

  const answered = Object.keys(picks).length
  const correct = SCENARIOS.filter((s) => picks[s.id] === s.answer).length

  return (
    <Card>
      <div className="space-y-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="t-label text-faint">
            Preview deployment or staging environment?
          </p>
          {answered > 0 && (
            <p className="t-label shrink-0" aria-live="polite">
              {`${correct}/${answered} right`}
            </p>
          )}
        </div>

        <ul className="space-y-8">
          {SCENARIOS.map((s) => {
            const done = s.id in picks
            const picked = picks[s.id]
            const right = picked === s.answer

            return (
              <li key={s.id} className="space-y-3">
                <p className="text-sm font-medium">{s.situation}</p>

                <div
                  role="radiogroup"
                  aria-label={s.situation}
                  className="flex flex-wrap gap-2"
                >
                  {CHOICES.map((c) => {
                    const selected = picked === c.id
                    return (
                      <button
                        key={c.id}
                        role="radio"
                        aria-checked={selected}
                        disabled={done}
                        onClick={() => commit(s.id, c.id)}
                        className={[
                          'inline-flex min-h-11 items-center rounded-md border px-3 py-1.5 text-sm transition-colors lg:min-h-9',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                          selected
                            ? right
                              ? 'border-go bg-go/10 text-go'
                              : 'border-danger bg-danger/10 text-danger'
                            : done
                              ? 'cursor-default border-line/40 text-faint opacity-60'
                              : 'border-line hover:border-brand hover:text-brand',
                        ].join(' ')}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>

                {done && (
                  <div
                    aria-live="polite"
                    className="flex items-start gap-2 text-sm"
                  >
                    {right ? (
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-go"
                        aria-hidden
                      />
                    ) : (
                      <X
                        className="mt-0.5 size-4 shrink-0 text-danger"
                        aria-hidden
                      />
                    )}
                    <p>
                      {!right && (
                        <span className="font-medium text-go">
                          {CHOICES.find((c) => c.id === s.answer)!.label}.{' '}
                        </span>
                      )}
                      {s.reasoning}
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

Note the M2 fix: the score line renders only when `answered > 0` — no "0/0 right" on initial load.

- [ ] **Step 8: Run render test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/PreviewOrStaging.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/staging/scenarios.ts web/src/features/staging/scenarios.test.ts \
  web/src/features/staging/PreviewOrStaging.tsx web/src/features/staging/PreviewOrStaging.test.tsx
git commit -m "feat(staging): PreviewOrStaging exercise — five scored scenarios

Binary choice (preview/staging), locked on first pick, scored 0-5.
Score region renders only after first pick (M2 lesson).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Seed data annotated artifact and checklist-items data

**Files:**
- Create: `web/src/features/staging/seed-data.ts`
- Create: `web/src/features/staging/seed-data.test.ts`
- Create: `web/src/features/staging/checklist-items.ts`
- Create: `web/src/features/staging/checklist-items.test.ts`

**Interfaces:**
- Consumes: `fences`, `flat`, `section` from `./doc-source` (Task 1)
- Produces: `SEED_ARTIFACT: Artifact` — used by Task 7 (inline `AnnotatedArtifact`)
- Produces: `CHECKLIST_CATEGORIES: RevealRow[]` — used by Task 7 (inline `RevealList`)

- [ ] **Step 1: Write `seed-data.test.ts`**

```ts
// web/src/features/staging/seed-data.test.ts
import { describe, expect, test } from 'vitest'
import { SEED_ARTIFACT } from './seed-data'
import { fences } from './doc-source'

describe('seed data artifact', () => {
  test('language is ts', () => {
    expect(SEED_ARTIFACT.language).toBe('ts')
  })

  test('filename is src/db/seed.ts', () => {
    expect(SEED_ARTIFACT.filename).toBe('src/db/seed.ts')
  })

  test('lines match the fenced code block in the doc', () => {
    const docFences = fences()
    const tsBlock = docFences.find((f) => f.startsWith('// src/db/seed.ts'))
    expect(tsBlock, 'ts fenced block not found in doc').toBeTruthy()
    const docLines = tsBlock!.split('\n')
    const artifactLines = SEED_ARTIFACT.lines.map((l) => l.text)
    expect(artifactLines).toEqual(docLines)
  })

  test('at least 3 lines carry a note', () => {
    const annotated = SEED_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(3)
  })

  test('at most one pivot line', () => {
    const pivots = SEED_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots.length).toBeLessThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/seed-data.test.ts
```

Expected: FAIL — `Cannot find module './seed-data'`.

- [ ] **Step 3: Write `seed-data.ts`**

```ts
// web/src/features/staging/seed-data.ts
import type { Artifact } from '@/components/artifact'

export const SEED_ARTIFACT: Artifact = {
  id: 'hostile-seed',
  filename: 'src/db/seed.ts',
  language: 'ts',
  lines: [
    { text: '// src/db/seed.ts — deliberately awkward' },
    { text: 'const users = [' },
    {
      text: "  { name: \"O'Brien\", email: 'test+tag@example.com' },",
      note: 'Apostrophe in the name breaks unescaped SQL and naive string splitting.',
    },
    {
      text: "  { name: '李明', email: 'unicode@example.com' },",
      note: 'Non-Latin characters expose encoding assumptions and truncation bugs.',
    },
    {
      text: "  { name: 'A'.repeat(200), email: 'long@example.com' },",
      note: 'A 200-character name overflows fixed-width table columns and PDF exports.',
      pivot: true,
    },
    {
      text: "  { name: '', email: 'empty-name@example.com' },",
      note: 'An empty name tests fallback displays and greeting templates.',
    },
    { text: ']' },
  ],
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/seed-data.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write `checklist-items.test.ts`**

```ts
// web/src/features/staging/checklist-items.test.ts
import { describe, expect, test } from 'vitest'
import { CHECKLIST_CATEGORIES } from './checklist-items'
import { flat, section } from './doc-source'

describe('preview checklist categories', () => {
  const src = section('The preview checklist')

  test('four categories', () => {
    expect(CHECKLIST_CATEGORIES).toHaveLength(4)
  })

  test('unique IDs', () => {
    const ids = CHECKLIST_CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('first category title pins: Does it actually work?', () => {
    expect(flat(src)).toContain(flat('Does it actually work?'))
  })

  test('second category title pins: happy path', () => {
    expect(flat(src)).toContain(
      flat('Does it work when you are not the happy path?'),
    )
  })

  test('third category title pins: anything else break', () => {
    expect(flat(src)).toContain(flat('Did anything else break?'))
  })

  test('fourth category title pins: look right', () => {
    expect(flat(src)).toContain(flat('Does it look right?'))
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/checklist-items.test.ts
```

Expected: FAIL — `Cannot find module './checklist-items'`.

- [ ] **Step 7: Write `checklist-items.ts`**

```ts
// web/src/features/staging/checklist-items.ts
import type { RevealRow } from '@/components/RevealList'

export const CHECKLIST_CATEGORIES: RevealRow[] = [
  {
    id: 'works',
    title: 'Does it actually work?',
    body: (
      <p className="text-sm text-muted">
        Walk the primary flow the change touches, as a user, in a browser. Not
        the code path — the flow.
      </p>
    ),
  },
  {
    id: 'unhappy',
    title: 'Does it work when you are not the happy path?',
    body: (
      <ul className="space-y-1 text-sm text-muted">
        <li>Signed out, then signed in</li>
        <li>
          A slow network (throttle in devtools — the loading state you never
          see locally shows up here)
        </li>
        <li>A narrow viewport, and one wide one</li>
        <li>Empty state: no data, first-run experience</li>
        <li>
          Error state: kill the network mid-action and watch what the user sees
        </li>
      </ul>
    ),
  },
  {
    id: 'regressions',
    title: 'Did anything else break?',
    body: (
      <p className="text-sm text-muted">
        The change was in billing, but check that the dashboard still renders.
        Preview deploys make this cheap; regressions are usually adjacent, not
        distant.
      </p>
    ),
  },
  {
    id: 'looks-right',
    title: 'Does it look right?',
    body: (
      <p className="text-sm text-muted">
        Not “does it match the mockup” pixel for pixel, but: is text
        readable, does nothing overlap, is the tab order sane, does the focus
        ring exist.
      </p>
    ),
  },
]
```

Note: this file contains JSX and should be named `.tsx`. **Rename to `checklist-items.tsx`** and update the test import and all references accordingly. The test file stays `.test.ts` because it only validates the data shape, not the rendered JSX — but the import path changes to `./checklist-items` which resolves to `.tsx`.

Actually, since `RevealRow.body` is `ReactNode`, the data file needs JSX. Rename:
- `checklist-items.ts` → `checklist-items.tsx`
- Test import stays `'./checklist-items'` (TS resolves `.tsx`)

- [ ] **Step 8: Run test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/checklist-items.test.ts
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/staging/seed-data.ts web/src/features/staging/seed-data.test.ts \
  web/src/features/staging/checklist-items.tsx web/src/features/staging/checklist-items.test.ts
git commit -m "feat(staging): seed-data artifact and checklist categories

Annotated artifact for the hostile seed block (7 lines, 4 annotated).
Four RevealList categories for the preview checklist, pinned to the doc.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Assembly — Staging.tsx, prose test, references, and registration

**Files:**
- Create: `web/src/features/staging/Staging.tsx`
- Create: `web/src/features/staging/Staging.test.tsx`
- Create: `web/src/features/staging/prose.test.ts`
- Modify: `web/src/lib/references.ts` — add `'12-staging'` entries
- Modify: `web/src/lib/stages.ts` — flip `ready: true`
- Modify: `web/src/features/stage-content.ts` — register `Staging`
- Modify: `web/src/features/step-ids.ts` — register `STEP_IDS`

**Interfaces:**
- Consumes: Everything from Tasks 1–6
- Produces: The complete stage, registered and ready

- [ ] **Step 1: Add references to `references.ts`**

Verify each URL resolves in a real browser before adding. Add after the `'07-code-review'` entry:

```ts
  '12-staging': [
    {
      title: 'Preview Deployments',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/deployments/preview-deployments',
      adds: 'The mechanics this stage teaches: how preview URLs are generated, what environment variables they inherit, and the deployment lifecycle.',
    },
    {
      title: 'Database Branching',
      source: 'Neon Docs',
      url: 'https://neon.tech/docs/introduction/branching',
      adds: 'The highest-value technique in this stage. Goes deeper on copy-on-write semantics, parent-child relationships, and the cost model.',
    },
    {
      title: 'Deployment Protection',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/security/deployment-protection',
      adds: 'Authentication options for preview URLs, including the automation bypass secret that lets Playwright reach protected pages in CI.',
    },
  ],
```

- [ ] **Step 2: Write `prose.test.ts`**

Pin at least one phrase per doc section, including a second-sentence pin:

```ts
// web/src/features/staging/prose.test.ts
import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('staging prose pins', () => {
  test('preview vs staging distinction (first section)', () => {
    const src = section('Preview deployments are not staging')
    expect(flat(src)).toContain(
      flat('per-branch, ephemeral, and automatic'),
    )
  })

  test('staging definition — second sentence', () => {
    const src = section('Preview deployments are not staging')
    expect(flat(src)).toContain(
      flat('a third party integrating against you'),
    )
  })

  test('solo advice', () => {
    const src = section('Preview deployments are not staging')
    expect(flat(src)).toContain(
      flat('Solo, you usually do not need staging'),
    )
  })

  test('database section — never production', () => {
    const src = section('Databases for previews')
    expect(flat(src)).toContain(
      flat('A migration tested against production data is a migration that can destroy production data'),
    )
  })

  test('neon branching — second sentence', () => {
    const src = section('Databases for previews')
    expect(flat(src)).toContain(
      flat('Neon creates an isolated branch'),
    )
  })

  test('seed data — hostile advice', () => {
    const src = section('Seed data that is not sterile')
    expect(flat(src)).toContain(
      flat('Seeding Alice, Bob, and Carol tests nothing'),
    )
  })

  test('checklist — machines are bad at', () => {
    const src = section('The preview checklist')
    expect(flat(src)).toContain(
      flat('Check what machines are bad at'),
    )
  })

  test('env vars — most common cause', () => {
    const src = section('Environment variables for previews')
    expect(flat(src)).toContain(
      flat('works locally, broken in preview'),
    )
  })

  test('deployment protection — unlisted not secret', () => {
    const src = section('Password-protect previews')
    expect(flat(src)).toContain(
      flat('Preview URLs are unlisted, not secret'),
    )
  })

  test('scaling — previews become the review artifact', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(
      flat('Looks good'),
    )
  })
})
```

- [ ] **Step 3: Run prose test**

```bash
cd web && pnpm test -- --run src/features/staging/prose.test.ts
```

Expected: PASS.

- [ ] **Step 4: Write `Staging.test.tsx`**

```tsx
// web/src/features/staging/Staging.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Staging } from './Staging'

describe('Staging page', () => {
  test('renders six steps in the rail', () => {
    render(<Staging />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(6)
  })

  test('first step label is "Preview or staging?"', () => {
    render(<Staging />)
    expect(screen.getByRole('tab', { name: /preview or staging/i })).toBeTruthy()
  })

  test('last step label is "Traps"', () => {
    render(<Staging />)
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })
})
```

- [ ] **Step 5: Run render test to verify it fails**

```bash
cd web && pnpm test -- --run src/features/staging/Staging.test.tsx
```

Expected: FAIL — `Cannot find module './Staging'`.

- [ ] **Step 6: Write `Staging.tsx`**

Build all six panels. This is the main content component. Follow the `CodeReview.tsx` pattern:
- Import `Stepper`, `Step`, UI primitives, `Term`, `InlineCode`, `RevealList`, `AnnotatedArtifact`, `Figure`, `References`, `Callout`, `Prose`, `Section`, `getStage`
- Import feature-local: `PreviewOrStaging`, `CHECKLIST_CATEGORIES`, `SEED_ARTIFACT`, `AIPlays`, `TRAPS`, `StagingChecklist`, `StepId`
- Define `CONTENT_STEPS: (Step & { id: StepId })[]` with 6 entries
- Return `<Stepper steps={CONTENT_STEPS} />`

Each panel's content uses the patterns specified in the spec:
- `preview`: prose with `Term` for preview-deployment and staging-environment, then `PreviewOrStaging` exercise
- `database`: prose, `Figure` for Neon lifecycle, `AnnotatedArtifact` with `SEED_ARTIFACT`
- `checklist`: prose, `RevealList` with `CHECKLIST_CATEGORIES`
- `env`: prose with `Callout kind="info"` for the two habits, deployment protection paragraph with `Term`
- `ai`: `AIPlays` component
- `traps`: `TRAPS` mapped to `Callout kind="trap"`, then `StagingChecklist`, then `References slug="12-staging"`

The full component body is too large for this plan to inline without becoming the implementation itself. The implementer should build each panel following the doc's sections and the patterns above, with the doc open side by side.

Key construction notes:
- `Figure n={1}` for the Neon branching diagram — keep it to 5–6 nodes as an inline SVG or descriptive diagram
- Cross-stage links: `getStage('11-ci-cd')` for CI reference, `getStage('04-project-setup')` for setup reference, `getStage('14-post-deployment-verification')` for the trap that says "that is what 14 is for"
- Wrap first appearances of `preview-deployment`, `staging-environment`, `database-branching`, `deployment-protection` in `<Term>`

- [ ] **Step 7: Run render test to verify it passes**

```bash
cd web && pnpm test -- --run src/features/staging/Staging.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Atomic registration (three files at once)**

In `web/src/lib/stages.ts`, change stage 12's `ready: false` to `ready: true`.

In `web/src/features/stage-content.ts`, add:
```ts
import { Staging } from './staging/Staging'
// ...in STAGE_CONTENT:
  '12-staging': Staging,
```

In `web/src/features/step-ids.ts`, add:
```ts
import { STEP_IDS as STAGING } from './staging/steps'
// ...in STEP_IDS_BY_SLUG:
  '12-staging': STAGING,
```

- [ ] **Step 9: Run full gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Expected: all pass. Report test count. The build should prerender stage 12's routes.

- [ ] **Step 10: Commit**

```bash
git add web/src/features/staging/Staging.tsx web/src/features/staging/Staging.test.tsx \
  web/src/features/staging/prose.test.ts web/src/lib/references.ts \
  web/src/lib/stages.ts web/src/features/stage-content.ts web/src/features/step-ids.ts
git commit -m "feat(staging): assemble six panels, register stage, flip ready

Six steps: preview, database, checklist, env, ai, traps.
Three references (Vercel preview, Neon branching, Vercel protection).
Stage 12 is now ready: true. W-3 at 8/18.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Verification — e2e, contrast, responsive, humanizer

**Files:**
- No new files

**Interfaces:**
- Consumes: the complete stage from Tasks 1–7

- [ ] **Step 1: Run e2e audit**

```bash
cd web && pnpm build && pnpm test:e2e
```

Expected: the audit includes stage 12's pages automatically (TD-12 derivation). All pass.

- [ ] **Step 2: Panel measurement**

Measure every panel at 1024×768. All must be under 4.0 screens. Report the panel table with measurements.

- [ ] **Step 3: Contrast sweep**

Both themes, all steps. WCAG AA on every text/background pair.

- [ ] **Step 4: Responsive sweep**

320–2560px, no horizontal overflow, no sub-44px touch targets below `lg`.

- [ ] **Step 5: Console check**

Zero console errors in a clean browser context.

- [ ] **Step 6: Run `humanizer:humanizer` over the panel prose**

Focus on the new prose written for the panels. Apply fixes that make the writing clearer; keep em dashes (house voice).

- [ ] **Step 7: Run `test:dev-console` (once per stage round)**

```bash
cd web && pnpm test:dev-console
```

Expected: no React dev-mode warnings for the new stage.

- [ ] **Step 8: Commit any fixes from the verification passes**

If the humanizer or any sweep required changes:

```bash
git add -A
git commit -m "fix(staging): verification pass fixes

[describe what was fixed]

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

- `pnpm lint` — zero warnings
- `pnpm typecheck` — clean
- `pnpm test` — all pass, count reported (expect ~880+ across ~125 files)
- `pnpm build` — clean, stage 12 prerendered
- `pnpm test:e2e` — all pass with stage 12's new pages
- Panel measurement: every panel under 4.0 screens
- Contrast: both themes, WCAG AA
- Responsive: 320–2560px
- Console: zero errors
- Coverage walk: doc vs app, context-starved
- `humanizer:humanizer` over panel prose
