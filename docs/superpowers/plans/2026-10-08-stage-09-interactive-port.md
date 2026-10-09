# Stage 09 interactive port implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach readers to define a user-visible performance baseline, diagnose the hypothetical order case, judge a comparable retest, and export a saved record for their own app.

**Architecture:** Server-rendered panels assemble twelve hash-addressable judgments through the shared Stepper. Client leaves handle the journey inspector, baseline practice, native-radio decision sets, worksheet and checklist. The worksheet model owns normalization and export; its two views share one storage key, with a local fallback for denied storage.

**Tech Stack:** Installed Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind CSS 4, Vitest unit/jsdom projects, React Testing Library and Playwright. Add no dependencies.

**Spec:** [Approved Stage 09 interactive port design](../specs/2026-10-08-stage-09-interactive-port-design.md).

## Global Constraints

- The app uses Next.js 16.2.10 and React 19.2.4, as installed in `web/package.json`.
- The site's current configuration is `web/next.config.ts`; this round leaves its build and hosting configuration alone.
- Runtime cache APIs are teaching content, not features to activate in this app.
- Follow `web/DESIGN.md` and `web/PATTERNS.md`.
- Each panel holds one judgment and fits the four-screen budget at 1024×768.
- The step rail remains freely navigable and deep-linkable.
- Stage numbers remain filing codes.
- Glossary definitions continue to live only in `web/src/lib/terms.ts`.
- Do not change the shared hook in this round.
- Do not seed the reader's saved record with hypothetical answers.
- Count correct choices, rather than turning filled fields into a claim that the record is valid.
- A trace or controlled reproduction supports diagnosis; it cannot fill the field p95 cell.
- Consumer dependencies require an explicit product rule before drawing a serial edge.
- Stage assembly is atomic: registry, declared ids and `ready` change in Task 8 together.
- The reviewed chapter remains canonical. Record and test any factual correction in both deliverables.
- W-6 sheets, real ordering telemetry, shared-drill extraction, merge, push and deployment remain deferred.
- All commands below run from `web/` unless a step explicitly says repository root. Run typechecking through `pnpm typecheck`, never bare `tsc` for the application.
- Every task records raw RED/GREEN output and its teeth check in `docs/superpowers/reports/2026-10-08-stage-09-interactive-port.md`. Do not claim a RED whose only cause is a broken test environment.
- Every commit carries `Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>`.

## Review Focus

1. Malformed saved JSON, partial objects and cross-tab edits must preserve valid known fields without crashing or overwriting the other worksheet view. Tasks 1 and 5 test these inputs.
2. Denied storage and clipboard permission must leave the mounted worksheet editable and manually exportable, with accurate status. Task 5 tests both failed reads and failed writes.
3. Wrong answers, double commits and independent drill instances must preserve reasoning, lock the first answer and keep native radio names independent. Tasks 3 and 4 test these conditions.
4. Missing user-outcome evidence, changed scope and regressions must never count as a production win. Task 4 tests each verdict and Task 8 observes the worked comparison in a browser.
5. Direct hash entry, browser Back, long saved text and markup-like input must remain usable across worksheet views without executing input or overflowing the page. Task 8 tests these in the live build.

## File map and dependencies

| Task | Ownership | Dependencies |
|---|---|---|
| 1 | `src/lib/performance-sheet.ts` and its unit tests | None |
| 2 | `features/performance/journey.ts`, `OrderJourney.tsx` and render tests | None |
| 3 | `features/performance/baseline.ts`, `BaselineLab.tsx` and render tests | None |
| 4 | `features/performance/decisions.ts`, `DecisionDrill.tsx`, `artifacts.ts`, unit/render tests | None |
| 5 | `features/performance/CopyText.tsx`, `PerformanceWorksheet.tsx` and render tests | Task 1 |
| 6 | `features/performance/checklist.ts`, `PerformanceChecklist.tsx`, unit/render tests | None |
| 7 | Teaching disclosures, three panel modules, missing terms and references, panel/source tests | Tasks 2 through 6 |
| 8 | `steps.ts`, `PerformanceOptimization.tsx`, atomic registration, stage render tests and browser behavior spec | Task 7 |

Task 1 can be reviewed independently of the journey and exercises. Tasks 2, 3, 4 and 6 own separate files. Task 5 depends on the sheet model; Task 7 consumes all component contracts; Task 8 is the only task that exposes the new stage to routing and audit discovery.

At execution start, read AGENTS/CLAUDE, the approved spec, relevant installed Next.js docs and `docs/learnings/plans-are-unverified-101.md`. Recheck the branch and clean tree. Start a `feat/stage-09-performance-port` branch containing the approved spec and plan, rooted in this design branch's `develop` ancestry; never start from `main`. Preserve the separate handoff branch. Do not merge it as setup.

For each task, write the listed tests first, run their focused command and save the RED output. Then write the implementation, run the same tests, apply the documented teeth mutation, confirm only the named new regression test fails in that task's suite, restore the file and rerun GREEN. Formatting and lint run before the task commit. Reviews must cite checked criteria and tests, not just a verdict. Use the chosen execution skill for review dispatch; do not dispatch agents while merely writing or self-reviewing this plan.

---

### Task 1: Normalize and export the performance record

**Files:**
- Create: `web/src/lib/performance-sheet.ts`
- Test: `web/src/lib/performance-sheet.test.ts`

**Interfaces:**
- Consumes: unknown JSON-compatible values; no browser APIs.
- Produces: `PerformanceSheet`, `SheetField`, `PERFORMANCE_KEY`, `EMPTY_PERFORMANCE_SHEET`, `BASELINE_FIELDS`, `FOLLOWUP_FIELDS`, `SHEET_FIELDS`, `normalizePerformanceSheet(value: unknown): PerformanceSheet`, `performanceMarkdown(sheet: PerformanceSheet): string`.
- Both worksheet views must write all eleven fields through this model.

- [x] **Step 1: Write the unit tests.**

#### Test source: `web/src/lib/performance-sheet.test.ts`

```ts
import { expect, test } from 'vitest'
import {
  BASELINE_FIELDS, EMPTY_PERFORMANCE_SHEET, FOLLOWUP_FIELDS,
  normalizePerformanceSheet, performanceMarkdown, SHEET_FIELDS,
} from './performance-sheet'

test('partial or malformed records keep known strings and supply empty fields, since browser JSON is untrusted', () => {
  for (const input of [null, undefined, [], 42, 'record']) {
    expect(normalizePerformanceSheet(input)).toEqual(EMPTY_PERFORMANCE_SHEET)
  }
  expect(normalizePerformanceSheet({
    outcome: 'click to browser response', metric: 95, scope: null,
    window: ['week'], unknown: 'discard', verdict: 'observe longer',
  })).toEqual({
    ...EMPTY_PERFORMANCE_SHEET,
    outcome: 'click to browser response', verdict: 'observe longer',
  })
})

test('Markdown exports the entire record with explicit blanks, so either view can hand over the same artifact', () => {
  const sheet = { ...EMPTY_PERFORMANCE_SHEET, outcome: 'Click → response', verdict: 'No field comparison yet' }
  const output = performanceMarkdown(sheet)
  expect(output).toBe('# Performance measurement record\n\n## Outcome and observer\n\nClick → response\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nnot recorded\n\n## Window and sample\n\nnot recorded\n\n## Baseline evidence\n\nnot recorded\n\n## Target and rationale\n\nnot recorded\n\n## Hypothesis and alternative\n\nnot recorded\n\n## Change and version\n\nnot recorded\n\n## After evidence\n\nnot recorded\n\n## Correctness and rollback\n\nnot recorded\n\n## Verdict and open gap\n\nNo field comparison yet\n')
  expect(output).toContain('No field comparison yet')
  expect(output).toContain('not recorded')
  expect(output).not.toContain('Hypothetical exercise')
})

test('the baseline and follow-up views partition the record without losing a field', () => {
  expect(BASELINE_FIELDS.map((f) => f.key)).toEqual(['outcome', 'metric', 'scope', 'window', 'evidence', 'target'])
  expect(FOLLOWUP_FIELDS.map((f) => f.key)).toEqual(['hypothesis', 'change', 'after', 'correctness', 'verdict'])
  expect(new Set(SHEET_FIELDS.map((f) => f.key)).size).toBe(11)
})
```

- [x] **Step 2: Capture RED.** Run `pnpm exec vitest run src/lib/performance-sheet.test.ts`. The missing module is the expected initial failure. If a stub is used to isolate assertions, rerun until the malformed-value/export assertions fail for the intended reason.
- [x] **Step 3: Write the model.**

#### Implementation source: `web/src/lib/performance-sheet.ts`

```ts
export type PerformanceSheet = {
  outcome: string
  metric: string
  scope: string
  window: string
  evidence: string
  target: string
  hypothesis: string
  change: string
  after: string
  correctness: string
  verdict: string
}

export type SheetField = {
  key: keyof PerformanceSheet
  label: string
  hint: string
}

export const PERFORMANCE_KEY = 'playbook:performance-worksheet:v1'
export const EMPTY_PERFORMANCE_SHEET: PerformanceSheet = {
  outcome: '', metric: '', scope: '', window: '', evidence: '', target: '',
  hypothesis: '', change: '', after: '', correctness: '', verdict: '',
}

export const BASELINE_FIELDS: readonly SheetField[] = [
  { key: 'outcome', label: 'Outcome and observer', hint: 'Who observes the delay? Name the start event and the visible stop event.' },
  { key: 'metric', label: 'Metric and population', hint: 'Name the duration percentile and completed-outcome population. Record total attempts, failures and timeouts separately; categories can overlap.' },
  { key: 'scope', label: 'Scope', hint: 'Route or event, version, device/network segment, cart/data shape, and cold or warm cache.' },
  { key: 'window', label: 'Window and sample', hint: 'Collection dates, completed sample count and traffic shape. State when field data is insufficient and when you will observe again.' },
  { key: 'evidence', label: 'Baseline evidence', hint: 'Reference the user-outcome record separately from the diagnostic trace or controlled run.' },
  { key: 'target', label: 'Target and rationale', hint: 'What outcome target do users need, and why? Product budgets need a reason.' },
]

export const FOLLOWUP_FIELDS: readonly SheetField[] = [
  { key: 'hypothesis', label: 'Hypothesis and alternative', hint: 'What evidence points to the cause? Record a plausible alternative and why you rejected it.' },
  { key: 'change', label: 'Change and version', hint: 'What changed, on which deployment, and which stock, order or payment behavior must stay correct?' },
  { key: 'after', label: 'After evidence', hint: 'Same observer, outcome, population, segment, data and cache state. Record the new dates, version, sample, failures and timeouts.' },
  { key: 'correctness', label: 'Correctness and rollback', hint: 'Test the behavior, freshness and authorization. Name when to revert or investigate a harmful change.' },
  { key: 'verdict', label: 'Verdict and open gap', hint: 'Does the user outcome meet its target? Record remaining evidence, unresolved gap, owner and follow-up window.' },
]

export const SHEET_FIELDS = [...BASELINE_FIELDS, ...FOLLOWUP_FIELDS]

export function normalizePerformanceSheet(value: unknown): PerformanceSheet {
  const result = { ...EMPTY_PERFORMANCE_SHEET }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return result
  const source = value as Record<string, unknown>
  for (const { key } of SHEET_FIELDS) {
    if (typeof source[key] === 'string') result[key] = source[key]
  }
  return result
}

export function performanceMarkdown(sheet: PerformanceSheet): string {
  return [
    '# Performance measurement record', '',
    ...SHEET_FIELDS.map(({ key, label }) =>
      `## ${label}\n\n${sheet[key].trim() || 'not recorded'}\n`),
  ].join('\n')
}
```

- [x] **Step 4: Run GREEN.** Run the same unit command; save the raw output.
- [x] **Step 5: Teeth check.** Save `src/lib/performance-sheet.ts` to a task-specific temporary file. Change only the implementation's `'not recorded'` fallback to `'missing'`; run the complete Task 1 test file. Only `Markdown exports the entire record...` should fail. Restore the saved source and run GREEN again. The test compares the complete exported artifact with an independent literal expectation.
- [x] **Step 6: Format, lint, review and commit.** Run `pnpm exec prettier --write src/lib/performance-sheet{,.test}.ts` and `pnpm lint`. Commit `feat(performance): define comparable measurement records`, including the required co-author trailer. Record the test names, RED reason and teeth result in the report.


```bash
pnpm exec prettier --write src/lib/performance-sheet.ts src/lib/performance-sheet.test.ts
pnpm lint
git add src/lib/performance-sheet.ts src/lib/performance-sheet.test.ts
git commit -m 'feat(performance): define comparable measurement records' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 2: Inspect the order journey's separate clocks

**Files:**
- Create: `web/src/features/performance/journey.ts`
- Create: `web/src/features/performance/OrderJourney.tsx`
- Test: `web/src/features/performance/OrderJourney.test.tsx`

**Interfaces:**
- Consumes: shared `Card`; React state and ids.
- Produces: `Outcome`, `OUTCOMES`, `ORDER_REQUEST`, `OrderJourney({ outcomes?: readonly Outcome[] })`.
- The baseline exercise later uses a fixed checkout scenario. This inspector does not mutate the saved worksheet or relabel the other exercises.

- [x] **Step 1: Write the render tests.**

#### Test source: `web/src/features/performance/OrderJourney.test.tsx`

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { OrderJourney } from './OrderJourney'
import { OUTCOMES } from './journey'

test('each selected clock renders its real observer and boundaries, since a fast route cannot prove a fast user outcome', () => {
  render(<OrderJourney />)
  expect(screen.getByText('Hypothetical exercise')).toBeTruthy()
  for (const outcome of OUTCOMES) {
    fireEvent.click(screen.getByRole('button', { name: outcome.label }))
    const detail = screen.getByRole('region', { name: 'Selected measurement' })
    expect(detail.textContent).toContain(outcome.observer)
    expect(detail.textContent).toContain(outcome.start)
    expect(detail.textContent).toContain(outcome.stop)
    expect(detail.textContent).toContain(outcome.limits)
  }
})

test('OrderPaid has three independent consumer branches and never promises notification delivery', () => {
  render(<OrderJourney />)
  const branches = screen.getByRole('list', { name: 'Independent OrderPaid consumers' })
  expect(within(branches).getAllByRole('listitem')).toHaveLength(3)
  expect(branches.textContent).toMatch(/Inventory[\s\S]*Logistics[\s\S]*Notification/)
  fireEvent.click(screen.getByRole('button', { name: 'Notification consumer' }))
  expect(screen.getByRole('region', { name: 'Selected measurement' }).textContent).toMatch(/not prove.*received or saw/i)
})

test('the detail follows changed input data rather than an outcome-id lookup hidden in the component', () => {
  const custom = { ...OUTCOMES[0], observer: 'Test browser observer', stop: 'Test visible stop' }
  render(<OrderJourney outcomes={[custom]} />)
  const detail = screen.getByRole('region', { name: 'Selected measurement' })
  expect(detail.textContent).toContain('Test browser observer')
  expect(detail.textContent).toContain('Test visible stop')
})
```

The journey test uses an ES2017-compatible multiline expression. Keep that target when adding later plan guards.

- [x] **Step 2: Capture RED.** Run `pnpm exec vitest run src/features/performance/OrderJourney.test.tsx`. Expected initial failure: missing component. The observer and independent-branch assertions must run after implementation, not merely test imports.
- [x] **Step 3: Write the journey data and inspector.**

#### Implementation source: `web/src/features/performance/journey.ts`

```ts
export type Outcome = {
  id: string
  label: string
  observer: string
  start: string
  stop: string
  evidence: string
  diagnostic: string
  limits: string
}

export const ORDER_REQUEST = [
  'Validate', 'Authenticate', 'Check inventory', 'Create order',
  'Initiate payment', 'Response',
] as const

export const OUTCOMES: readonly Outcome[] = [
  {
    id: 'checkout', label: 'Browser checkout', observer: 'Browser',
    start: 'Place order click', stop: 'Response receipt in the browser',
    evidence: 'Browser-observed click-to-response durations for the selected segment.',
    diagnostic: 'Server route duration and instrumented database or external-call spans explain part of this clock.',
    limits: 'A faster route does not prove the entire browser outcome improved. Provider waiting and the later payment webhook are outside the checkout request.',
  },
  {
    id: 'payment', label: 'Visible payment status', observer: 'User-visible payment display',
    start: 'Payment submitted', stop: 'Paid visible to the user',
    evidence: 'Payment submission and visible Paid timestamps for the same order.',
    diagnostic: 'Separate payment initiation to webhook receipt, webhook receipt to persisted Paid, and persisted Paid to visible status.',
    limits: 'A fast webhook handler does not establish how long the provider waited or the user waited for the status display.',
  },
  {
    id: 'inventory', label: 'Inventory consumer', observer: 'Inventory consumer completion record',
    start: 'OrderPaid published', stop: 'Inventory consumer completed',
    evidence: 'Publish and completion timestamps joined by an opaque event or order ID.',
    diagnostic: 'Queue waiting and instrumented consumer processing intervals.',
    limits: 'This processing lag does not prove logistics or notification completed. Dependencies require a product rule.',
  },
  {
    id: 'logistics', label: 'Logistics consumer', observer: 'Logistics consumer completion record',
    start: 'OrderPaid published', stop: 'Logistics consumer completed',
    evidence: 'Publish and completion timestamps joined by an opaque event or order ID.',
    diagnostic: 'Queue waiting and instrumented consumer processing intervals.',
    limits: 'This processing lag does not prove inventory or notification completed. Consumers are branches, not a serial chain.',
  },
  {
    id: 'notification', label: 'Notification consumer', observer: 'Notification consumer completion record',
    start: 'OrderPaid published', stop: 'Notification consumer completed',
    evidence: 'Publish and completion timestamps joined by an opaque event or order ID.',
    diagnostic: 'Queue waiting and instrumented consumer processing intervals.',
    limits: 'Completion does not prove the customer received or saw a message. A delivery promise needs its own observer and stop event.',
  },
]
```

#### Implementation source: `web/src/features/performance/OrderJourney.tsx`

```tsx
'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import { ORDER_REQUEST, OUTCOMES, type Outcome } from './journey'

export function OrderJourney({ outcomes = OUTCOMES }: { outcomes?: readonly Outcome[] }) {
  const [selected, setSelected] = useState(outcomes[0]?.id ?? '')
  const root = useId()
  const outcome = outcomes.find((row) => row.id === selected) ?? outcomes[0]
  if (!outcome) return <p>No measurement outcomes are available.</p>

  return (
    <Card>
      <p className="t-label mb-4 text-brand">Hypothetical exercise</p>
      <ol aria-label="Checkout request responsibilities" className="grid gap-2 sm:grid-cols-3">
        {ORDER_REQUEST.map((name, i) => (
          <li key={name} className="measure-full border border-line bg-sunken p-3 text-sm">
            <span className="t-data mr-2 text-subtle">{i + 1}</span>{name}
          </li>
        ))}
      </ol>
      <div className="my-4 border-l-2 border-blueprint pl-4">
        <p className="text-sm">Separate payment webhook → mark order paid → publish OrderPaid</p>
        <ul aria-label="Independent OrderPaid consumers" className="mt-3 grid gap-2 sm:grid-cols-3">
          {['Inventory', 'Logistics', 'Notification'].map((name) => (
            <li key={name} className="measure-full border border-line p-3 text-sm">
              <span className="t-label block text-subtle">OrderPaid branch</span>{name}
            </li>
          ))}
        </ul>
      </div>
      <p className="mb-3 text-sm text-muted">Choose the clock to inspect:</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {outcomes.map((row) => (
          <button key={row.id} type="button" aria-pressed={row.id === outcome.id}
            aria-controls={`${root}-detail`} onClick={() => setSelected(row.id)}
            className={`min-h-11 border px-3 py-2 text-left text-sm lg:min-h-9 ${row.id === outcome.id ? 'border-brand bg-brand-tint text-fg' : 'border-line text-muted hover:border-line-strong'}`}>
            {row.label}
          </button>
        ))}
      </div>
      <section id={`${root}-detail`} aria-label="Selected measurement" aria-live="polite" className="mt-5 border-t border-line pt-4">
        <h3 className="t-head mb-3 text-lg">{outcome.label}</h3>
        <dl className="space-y-3 text-sm">
          {[
            ['Observer', outcome.observer], ['Start', outcome.start], ['Stop', outcome.stop],
            ['Evidence', outcome.evidence], ['Diagnostic intervals', outcome.diagnostic], ['Limit', outcome.limits],
          ].map(([label, detail]) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="t-label text-subtle">{label}</dt><dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Card>
  )
}
```

- [x] **Step 4: Run GREEN.** Run the focused render file and `pnpm typecheck`. Confirm five outcome selections render their own boundaries and the three branches remain siblings.
- [x] **Step 5: Teeth check.** Temporarily replace the rendered stop cell's `outcome.stop` with `outcome.id === 'payment' ? 'Paid persisted on the server' : outcome.stop`. Only the all-clocks boundary test should fail. Restore and rerun the entire render file.
- [x] **Step 6: Format, lint, review and commit.** Format the three files, run `pnpm lint`, and commit `feat(performance): inspect user and consumer clocks` with the required trailer. Save evidence in the report.


```bash
pnpm exec prettier --write src/features/performance/journey.ts src/features/performance/OrderJourney.tsx src/features/performance/OrderJourney.test.tsx
pnpm lint
git add src/features/performance/journey.ts src/features/performance/OrderJourney.tsx src/features/performance/OrderJourney.test.tsx
git commit -m 'feat(performance): inspect user and consumer clocks' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 3: Build a baseline before suggesting a fix

**Files:**
- Create: `web/src/features/performance/baseline.ts`
- Create: `web/src/features/performance/BaselineLab.tsx`
- Test: `web/src/features/performance/BaselineLab.test.tsx`

**Interfaces:**
- Produces: `BaselineField`, `BASELINE_PRACTICE`, `BaselineLab({ fields?: readonly BaselineField[] })`.
- The practice record uses five fields; the reader's own worksheet adds a separate target field. Practice answers stay component-local and never write to localStorage.

- [x] **Step 1: Write the render tests.**

#### Test source: `web/src/features/performance/BaselineLab.test.tsx`

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { BaselineLab } from './BaselineLab'
import { BASELINE_PRACTICE } from './baseline'

function finish(wrongFirst = false) {
  for (const [index, field] of BASELINE_PRACTICE.entries()) {
    const option = field.options.find((row) =>
      wrongFirst && index === 0 ? row.id !== field.answer : row.id === field.answer)!
    fireEvent.click(screen.getByRole('radio', { name: option.label }))
    fireEvent.click(screen.getByRole('button', { name: 'Commit measurement' }))
    fireEvent.click(screen.getByRole('button', {
      name: index === BASELINE_PRACTICE.length - 1 ? 'Inspect record' : 'Next field',
    }))
  }
}

test('a wrong observer remains visible in the assembled record, since a completed form is not a valid baseline', () => {
  render(<BaselineLab />)
  finish(true)
  const record = screen.getByRole('region', { name: 'Practice baseline record' })
  expect(record.textContent).toContain('Server handler entry to server response')
  expect(record.textContent).toContain('Needs correction')
  expect(record.textContent).toContain('completed outcomes')
  expect(record.textContent).toContain('failures and timeouts separately')
  expect(screen.getByText('4 of 5 choices correct')).toBeTruthy()
  expect(window.localStorage.getItem('playbook:performance-worksheet:v1')).toBeNull()
})

test('reasoning appears only after commit and reset clears committed hindsight', () => {
  render(<BaselineLab />)
  const first = BASELINE_PRACTICE[0]
  expect(screen.queryByText(first.why)).toBeNull()
  const commit = screen.getByRole('button', { name: 'Commit measurement' }) as HTMLButtonElement
  expect(commit.disabled).toBe(true)
  fireEvent.click(screen.getByRole('radio', { name: first.options[1].label }))
  fireEvent.click(commit)
  expect(screen.getByText(first.why)).toBeTruthy()
  for (const radio of screen.getAllByRole('radio')) expect((radio as HTMLInputElement).disabled).toBe(true)
  fireEvent.click(commit)
  expect(screen.getByText('0 of 1 choices correct')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Reset practice' }))
  expect(screen.queryByText(first.why)).toBeNull()
  expect((screen.getByRole('button', { name: 'Commit measurement' }) as HTMLButtonElement).disabled).toBe(true)
})

test('a completed practice preserves field evidence and the correct clock without inventing a field p95', () => {
  render(<BaselineLab />)
  finish()
  const text = screen.getByRole('region', { name: 'Practice baseline record' }).textContent ?? ''
  for (const field of BASELINE_PRACTICE) expect(text).toContain(field.options.find((row) => row.id === field.answer)!.label)
  expect(text).toContain('Place order click to response receipt in the browser')
  expect(text).toContain('p95 not yet recorded')
  expect(screen.getByText('5 of 5 choices correct')).toBeTruthy()
})
```

- [x] **Step 2: Capture RED.** Run `pnpm exec vitest run src/features/performance/BaselineLab.test.tsx`. Expected: the missing builder fails initially; then the wrong-observer and answer-lock assertions protect behavior.
- [x] **Step 3: Write the baseline dataset and builder.**

#### Implementation source: `web/src/features/performance/baseline.ts`

```ts
export type BaselineField = {
  id: string
  label: string
  prompt: string
  options: readonly { id: string; label: string }[]
  answer: string
  why: string
}

export const BASELINE_PRACTICE: readonly BaselineField[] = [
  {
    id: 'outcome', label: 'Outcome', prompt: 'The customer waits after clicking Place order. Which clock belongs in the baseline?',
    options: [
      { id: 'browser', label: 'Place order click to response receipt in the browser' },
      { id: 'server', label: 'Server handler entry to server response' },
    ], answer: 'browser',
    why: 'The browser observes the selected user outcome. Server route duration is diagnostic and excludes part of the user wait.',
  },
  {
    id: 'metric', label: 'Metric and population', prompt: 'Some attempts time out. How should the duration percentile be defined?',
    options: [
      { id: 'completed', label: 'Duration p95 from completed outcomes; report total attempts, completed samples, failures and timeouts separately' },
      { id: 'success', label: 'Duration p95 from successes only; omit failures and timeouts' },
    ], answer: 'completed',
    why: 'State the completed-outcome denominator and keep the same rule after the change. Failure counts can overlap completed outcomes; they are not a partition to sum.',
  },
  {
    id: 'scope', label: 'Scope', prompt: 'Which scope lets a later observation be compared with this one?',
    options: [
      { id: 'specified', label: 'POST /orders; version order-before; mobile Chrome; network profile mobile-4g-v1; 20-item cart; hypothetical inventory of 10000 SKUs; warm cache' },
      { id: 'mixed', label: 'All orders from every device; cache state and cart size unknown' },
    ], answer: 'specified',
    why: 'Name the route, deployment, segment, cart/data shape and cache state. Change the version deliberately and keep the workload comparable.',
  },
  {
    id: 'window', label: 'Window and sample', prompt: 'Field observations have not been gathered yet. What belongs in the example record?',
    options: [
      { id: 'unknown', label: 'Planned field window 2026-10-01 to 2026-10-07; completed sample and attempt counts not yet recorded; p95 not yet recorded' },
      { id: 'guess', label: 'Call one controlled 20-item cart run the production p95' },
    ], answer: 'unknown',
    why: 'Leave unknown field values unfilled. Record sparse samples as insufficient, retain a controlled baseline and name the next observation window.',
  },
  {
    id: 'evidence', label: 'Evidence', prompt: 'What can establish the user baseline and explain a possible cause?',
    options: [
      { id: 'separate', label: 'Browser outcome record when collected; route trace and controlled cart reproduction as separate diagnostic evidence' },
      { id: 'substitute', label: 'A database query plan proves the entire browser p95' },
    ], answer: 'separate',
    why: 'A trace explains instrumented work. A controlled run or one query plan cannot fill the user-outcome field percentile.',
  },
]
```

#### Implementation source: `web/src/features/performance/BaselineLab.tsx`

```tsx
'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import { BASELINE_PRACTICE, type BaselineField } from './baseline'

export function BaselineLab({ fields = BASELINE_PRACTICE }: { fields?: readonly BaselineField[] }) {
  const root = useId()
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string | null>(null)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const field = fields[index]
  const committed = field ? field.id in choices : false
  const correct = fields.filter((row) => choices[row.id] === row.answer).length
  const answered = Object.keys(choices).length
  const reset = () => { setIndex(0); setDraft(null); setChoices({}) }

  return (
    <Card>
      <p className="t-label mb-3 text-brand">Hypothetical exercise</p>
      <p className="mb-4 text-sm text-muted">This practice uses browser checkout for a 20-item cart. It does not change the clock you inspected earlier or measure your application.</p>
      <p aria-live="polite" className="t-data mb-3 text-sm text-muted">
        {answered > 0 ? `${correct} of ${answered} choices correct` : ''}
      </p>
      {field ? (
        <>
          <fieldset disabled={committed} className="min-w-0 space-y-2">
            <legend className="mb-3 text-sm font-medium">{field.prompt}</legend>
            {field.options.map((option) => (
              <label key={option.id} className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand">
                <input type="radio" name={`${root}-${field.id}`} value={option.id} disabled={committed}
                  checked={(committed ? choices[field.id] : draft) === option.id}
                  onChange={() => setDraft(option.id)}
                  className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default" />
                <span aria-hidden className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand" />
                <span className="min-w-0 break-words">{option.label}</span>
              </label>
            ))}
          </fieldset>
          <button type="button" disabled={draft === null || committed}
            onClick={() => {
              if (draft === null || committed) return
              setChoices((previous) => ({ ...previous, [field.id]: draft }))
            }} className="mt-4 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle">
            Commit measurement
          </button>
          <div aria-live="polite" className="mt-4">
            {committed && <p className="text-sm leading-relaxed">
              <span className={choices[field.id] === field.answer ? 'font-medium text-go' : 'font-medium text-danger'}>
                {choices[field.id] === field.answer ? 'Correct. ' : 'Needs correction. '}
              </span>{field.why}
            </p>}
          </div>
          {committed && <button type="button" onClick={() => { setIndex(index + 1); setDraft(null) }}
            className="mt-4 min-h-11 border border-line px-4 text-sm">
            {index === fields.length - 1 ? 'Inspect record' : 'Next field'}
          </button>}
        </>
      ) : (
        <section aria-label="Practice baseline record">
          <h3 className="t-head mb-3 text-lg">Practice baseline record</h3>
          <dl className="space-y-4">
            {fields.map((row) => {
              const selected = row.options.find((option) => option.id === choices[row.id])
              const right = choices[row.id] === row.answer
              return <div key={row.id} className="border-t border-line pt-3 text-sm">
                <dt className="t-label mb-1 text-subtle">{row.label}</dt>
                <dd>
                  <p>{selected?.label ?? 'not recorded'}</p>
                  <p className="mt-1 text-sm text-muted"><span className={right ? 'text-go' : 'text-danger'}>{right ? 'Correct. ' : 'Needs correction. '}</span>{row.why}</p>
                </dd>
              </div>
            })}
          </dl>
        </section>
      )}
      <button type="button" onClick={reset} className="mt-5 min-h-11 border border-line px-4 text-sm">Reset practice</button>
    </Card>
  )
}
```

- [x] **Step 4: Capture GREEN.** Run the focused test file and `pnpm typecheck`. Confirm native radio inputs, empty-before-update live messages, answer locking and an assembled record that shows selected wrong values.
- [x] **Step 5: Teeth check.** In the assembled record only, replace `selected?.label` with `row.options.find((option) => option.id === row.answer)?.label`. Only the wrong-observer assembled-record test should fail; the all-correct practice still passes. Restore and rerun GREEN.
- [x] **Step 6: Format, lint, review and commit.** Commit `feat(performance): practice defining the first baseline` with the required trailer and report evidence.


```bash
pnpm exec prettier --write src/features/performance/baseline.ts src/features/performance/BaselineLab.tsx src/features/performance/BaselineLab.test.tsx
pnpm lint
git add src/features/performance/baseline.ts src/features/performance/BaselineLab.tsx src/features/performance/BaselineLab.test.tsx
git commit -m 'feat(performance): practice defining the first baseline' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 4: Judge diagnosis and before/after evidence

Execution correction (2026-10-09, PLAN-AUTHORED ERROR): the missing-browser case inherited recorded attempts, an adequate sample and no failure increase. Its after cells now explicitly leave those observations unrecorded. An independent literal regression failed before the data correction; removing the completed-sample override failed only that regression.

**Files:**
- Create: `web/src/features/performance/decisions.ts`
- Create: `web/src/features/performance/DecisionDrill.tsx`
- Create: `web/src/features/performance/artifacts.ts`
- Test: `web/src/features/performance/decisions.test.ts`
- Test: `web/src/features/performance/DecisionDrill.test.tsx`

**Interfaces:**
- Produces: `DecisionCase`, `ComparisonRow`, `BOTTLENECK_CASES`, `QUERY_CASES`, `COMPARISON_CASES`, `DecisionDrill({ title: string; cases: readonly DecisionCase[] })`, `INVENTORY_PLAN: Artifact`.
- A case supplies its own options, correct id and explanation. Comparison cases additionally supply before/after fields displayed before the answer is committed.

- [x] **Step 1: Write data and render tests.**

#### Test source: `web/src/features/performance/decisions.test.ts`

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './decisions'
import { INVENTORY_PLAN } from './artifacts'

test('the quoted SQL is the chapter artifact rather than a query the site claims to execute', () => {
  const chapter = readFileSync(
    resolve(process.cwd(), '../docs/09-performance-optimization.md'),
    'utf8',
  )
  const sql = chapter.match(/```sql\n([\s\S]*?)\n```/)?.[1]
  expect(INVENTORY_PLAN.lines.map((line) => line.text).join('\n')).toBe(sql)
})

test('every case has a selectable answer and distinct option ids, since a missing answer makes a drill unfinishable', () => {
  for (const set of [BOTTLENECK_CASES, QUERY_CASES, COMPARISON_CASES]) {
    expect(new Set(set.map((row) => row.id)).size).toBe(set.length)
    for (const row of set) {
      expect(row.options.some((option) => option.id === row.answer)).toBe(true)
      expect(new Set(row.options.map((option) => option.id)).size).toBe(
        row.options.length,
      )
    }
  }
})

test('the comparison distinguishes missing evidence, changed scope, an acceptable outcome and harmful behavior', () => {
  expect(COMPARISON_CASES.map((row) => row.answer)).toEqual([
    'observe',
    'repeat',
    'stop',
    'revert',
  ])
  for (const row of COMPARISON_CASES) {
    expect(row.comparison?.map((field) => field.field)).toEqual([
      'Outcome and observer',
      'Population',
      'Scope',
      'Window and version',
      'Completed sample',
      'Failures and timeouts',
      'User outcome and target',
      'Correctness',
    ])
  }
})

test('missing browser evidence cannot inherit an adequate completed sample or recorded attempt rates', () => {
  const item = COMPARISON_CASES.find((row) => row.id === 'internal')!
  expect(
    item.comparison?.find((row) => row.field === 'Completed sample')?.after,
  ).toBe('Browser completed count and sample limitations are not yet recorded')
  expect(
    item.comparison?.find((row) => row.field === 'Population')?.after,
  ).toBe(
    'Same planned completed-outcome duration rule; total attempts are not yet recorded',
  )
  expect(
    item.comparison?.find((row) => row.field === 'Failures and timeouts')
      ?.after,
  ).toBe(
    'Browser failure and timeout rates and attempt counts are not yet recorded',
  )
})
```

#### Test source: `web/src/features/performance/DecisionDrill.test.tsx`

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { DecisionDrill } from './DecisionDrill'
import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './decisions'

function answer(id: string, cases = COMPARISON_CASES) {
  const item = cases.find((row) => row.id === id)!
  fireEvent.click(screen.getByRole('radio', { name: item.options.find((row) => row.id === item.answer)!.label }))
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  return item
}

test('wrong and right answers both reveal the rationale and the first commit stays locked', () => {
  const item = BOTTLENECK_CASES[0]
  render(<DecisionDrill title="Cart diagnosis" cases={BOTTLENECK_CASES} />)
  expect(screen.queryByText(item.why)).toBeNull()
  const wrong = item.options.find((row) => row.id !== item.answer)!
  fireEvent.click(screen.getByRole('radio', { name: wrong.label }))
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText(item.why)).toBeTruthy()
  expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
  for (const radio of screen.getAllByRole('radio')) expect((radio as HTMLInputElement).disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText('0 of 1 decisions correct')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Reset decisions' }))
  expect(screen.queryByText(item.why)).toBeNull()
  fireEvent.click(screen.getByRole('radio', { name: item.options.find((row) => row.id === item.answer)!.label }))
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText(item.why)).toBeTruthy()
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
})

test('comparison verdicts follow user evidence instead of the internal query improvement', () => {
  render(<DecisionDrill title="Compare outcomes" cases={COMPARISON_CASES} />)
  for (const [index, item] of COMPARISON_CASES.entries()) {
    const table = screen.getByRole('table', { name: 'Before and after evidence' })
    for (const row of item.comparison ?? []) {
      expect(table.textContent).toContain(row.before)
      expect(table.textContent).toContain(row.after)
    }
    answer(item.id)
    expect(screen.getByText(item.why)).toBeTruthy()
    if (index < COMPARISON_CASES.length - 1) fireEvent.click(screen.getByRole('button', { name: 'Next case' }))
  }
  expect(screen.getByText('4 of 4 decisions correct')).toBeTruthy()
})

test('changed answer data changes the rendered verdict, rather than a hidden id-based answer map', () => {
  const source = QUERY_CASES[0]
  const custom = { ...source, answer: source.options[1].id, why: 'Changed evidence requires a different experiment.' }
  render(<DecisionDrill title="Changed case" cases={[custom]} />)
  fireEvent.click(screen.getByRole('radio', { name: custom.options[1].label }))
  fireEvent.click(screen.getByRole('button', { name: 'Commit decision' }))
  expect(screen.getByText('1 of 1 decisions correct')).toBeTruthy()
  expect(screen.getByText(custom.why)).toBeTruthy()
})

test('two drills use independent native radio names so choosing one cannot uncheck the other', () => {
  render(<><DecisionDrill title="First" cases={QUERY_CASES} /><DecisionDrill title="Second" cases={QUERY_CASES} /></>)
  const groups = screen.getAllByRole('group', { name: QUERY_CASES[0].prompt })
  const first = within(groups[0]).getAllByRole('radio')[0] as HTMLInputElement
  const second = within(groups[1]).getAllByRole('radio')[1] as HTMLInputElement
  expect(first.type).toBe('radio')
  expect(first.name).not.toBe(second.name)
  fireEvent.click(first)
  fireEvent.click(second)
  expect(first.checked).toBe(true)
  expect(second.checked).toBe(true)
})
```

- [x] **Step 2: Capture RED.** Run `pnpm exec vitest run src/features/performance/decisions.test.ts src/features/performance/DecisionDrill.test.tsx`. Save the expected missing-file failures.
- [x] **Step 3: Write datasets, SQL artifact and one native-radio drill.**

#### Implementation source: `web/src/features/performance/decisions.ts`

```ts
export type ComparisonRow = { field: string; before: string; after: string }
export type DecisionCase = {
  id: string
  prompt: string
  options: readonly { id: string; label: string }[]
  answer: string
  why: string
  comparison?: readonly ComparisonRow[]
}

export const BOTTLENECK_CASES: readonly DecisionCase[] = [
  {
    id: 'cart',
    prompt:
      'A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?',
    options: [
      {
        id: 'batch',
        label: 'Batch the availability lookup and preserve the stock decision',
      },
      {
        id: 'image',
        label: 'Resize the checkout image to fix server inventory time',
      },
      { id: 'observe', label: 'Declare a production win from the query count' },
    ],
    answer: 'batch',
    why: 'The repeated calls support a batching experiment. The image cannot explain the observed server time. Retest the browser outcome and preserve stock and order behavior.',
  },
  {
    id: 'unknown',
    prompt:
      'Customers report slow checkout, but you have only one uninstrumented local run and no browser baseline. What comes first?',
    options: [
      {
        id: 'batch',
        label: 'Batch inventory without evidence of repeated calls',
      },
      { id: 'image', label: 'Resize the image because the page has one' },
      {
        id: 'observe',
        label:
          'Define the user clock and collect baseline and diagnostic evidence',
      },
    ],
    answer: 'observe',
    why: 'Record the chosen browser outcome before naming a cause. An absent database span does not prove no database work occurred. Instrument the relevant path and state when field samples are insufficient.',
  },
]

const QUERY_OPTIONS = [
  {
    id: 'keep',
    label: 'Keep the plan if the measured outcome meets its target',
  },
  {
    id: 'investigate',
    label:
      'Investigate statistics, data and the actual plan before choosing a change',
  },
  {
    id: 'index',
    label: 'Test the owner and creation index against the same workload',
  },
] as const

export const QUERY_CASES: readonly DecisionCase[] = [
  {
    id: 'small',
    prompt:
      'A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?',
    options: QUERY_OPTIONS,
    answer: 'keep',
    why: 'A sequential scan can be cheaper for a small or low-selectivity table. The scan name alone does not diagnose a missing index or justify added write cost.',
  },
  {
    id: 'estimates',
    prompt:
      'Actual rows differ greatly from estimated rows on a slow query. Is the plan enough to name a missing index?',
    options: QUERY_OPTIONS,
    answer: 'investigate',
    why: 'Inspect actual versus estimated rows, rows filtered, buffers and time. Statistics and workload are hypotheses to investigate. Planner cost is not milliseconds; one executed plan is not a production p95.',
  },
  {
    id: 'history',
    prompt:
      'A measured slow order-history query filters by owner and sorts by creation. The representative plan supports testing that access path. What experiment fits?',
    options: QUERY_OPTIONS,
    answer: 'index',
    why: 'Test (owner_id, created_at DESC) as a candidate for this filter and sort. Compare the same workload and write cost; plan locking, transaction handling and failed-index cleanup.',
  },
]

const COMPARE_OPTIONS = [
  { id: 'observe', label: 'Collect the missing user-outcome evidence' },
  { id: 'repeat', label: 'Repeat with a comparable scope and population' },
  { id: 'stop', label: 'Stop this optimization pass and observe the outcome' },
  { id: 'revert', label: 'Investigate or revert the harmful change' },
] as const

const COMPARABLE: readonly ComparisonRow[] = [
  {
    field: 'Outcome and observer',
    before: 'Browser: Place order click to response receipt',
    after: 'Same browser observer and start/stop events',
  },
  {
    field: 'Population',
    before: 'Completed-outcome duration p95; failures/timeouts separate',
    after: 'Same population rule; total attempts also recorded',
  },
  {
    field: 'Scope',
    before:
      'POST /orders; mobile Chrome; mobile-4g-v1 network; 10000-SKU fixture; 20-item cart; warm cache',
    after:
      'Same route, mobile Chrome segment, mobile-4g-v1 network, 10000-SKU fixture, cart and warm cache',
  },
  {
    field: 'Window and version',
    before: 'Seven-day baseline; order-before',
    after: 'Different seven-day post-deploy window; order-after',
  },
  {
    field: 'Completed sample',
    before: 'Completed count and sample limitations documented',
    after:
      'New completed count documented; adequate for this hypothetical comparison',
  },
  {
    field: 'Failures and timeouts',
    before: 'Both rates and attempts recorded separately',
    after: 'Same definitions; no observed increase in this case',
  },
  {
    field: 'User outcome and target',
    before: 'Observed browser outcome misses the stated user target',
    after: 'Comparable browser outcome meets that same target',
  },
  {
    field: 'Correctness',
    before: 'Stock, payment and order behavior tested',
    after: 'Same behavior passes correctness checks',
  },
]

function compared(
  changes: Partial<Record<string, string>>,
): readonly ComparisonRow[] {
  return COMPARABLE.map((row) => ({
    ...row,
    after: changes[row.field] ?? row.after,
  }))
}

export const COMPARISON_CASES: readonly DecisionCase[] = [
  {
    id: 'internal',
    prompt:
      'Batching reduced the controlled inventory round trips. The after browser record is missing. Has production checkout improved?',
    options: COMPARE_OPTIONS,
    answer: 'observe',
    comparison: compared({
      'User outcome and target':
        'Browser p95 and its sample are not recorded; only query count improved',
      'Completed sample':
        'Browser completed count and sample limitations are not yet recorded',
      Population:
        'Same planned completed-outcome duration rule; total attempts are not yet recorded',
      'Failures and timeouts':
        'Browser failure and timeout rates and attempt counts are not yet recorded',
    }),
    why: 'The faster internal work is diagnostic. Collect the same browser outcome, sample, failures and timeouts before claiming a production win.',
  },
  {
    id: 'scope',
    prompt:
      'The after result looks faster, but changes the device segment, cache state and duration population. What can be concluded?',
    options: COMPARE_OPTIONS,
    answer: 'repeat',
    comparison: compared({
      Scope: 'Desktop, cold cache and a different cart/data shape',
      Population: 'Success-only percentile; timeout population omitted',
    }),
    why: 'The comparison changed segment, workload, cache and population. Repeat the same outcome under a comparable scope, keeping failures and timeouts visible.',
  },
  {
    id: 'meets',
    prompt:
      'The comparable user outcome meets its target, failures and timeouts did not rise, and correctness is preserved. What next?',
    options: COMPARE_OPTIONS,
    answer: 'stop',
    comparison: COMPARABLE,
    why: 'Stop this optimization pass and observe the documented field window. Low or high traffic alone does not justify another change when the user target is met.',
  },
  {
    id: 'harm',
    prompt:
      'The browser outcome looks faster, but a stock check now accepts an unavailable item and failed orders increased. Is that a win?',
    options: COMPARE_OPTIONS,
    answer: 'revert',
    comparison: compared({
      'Failures and timeouts': 'Failed order rate increased',
      Correctness: 'Stock correctness check fails on an unavailable item',
    }),
    why: 'The change harms stock correctness and failures. Investigate or revert, then record the unresolved outcome gap. Faster duration does not close this pass.',
  },
]
```

The comparison cells describe hypothetical evidence without supplying invented p95s or traffic counts. The acceptable-outcome case stipulates an adequate documented sample. Missing browser evidence is marked explicitly in its own case; it cannot inherit a win from the shared comparison fields.

#### Implementation source: `web/src/features/performance/artifacts.ts`

```ts
import type { Artifact } from '@/components/artifact'

export const INVENTORY_PLAN: Artifact = {
  id: 'inventory-plan', filename: 'inventory-plan.sql', language: 'sql',
  lines: [
    { text: 'EXPLAIN (ANALYZE, BUFFERS)', note: 'Runs this query and reports its actual plan and buffers. This is one diagnosis, not a field percentile.', pivot: true },
    { text: "SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');", note: 'Use representative data. Inspect estimates, actual rows, filtering and time before deciding on an index.' },
  ],
}
```

#### Implementation source: `web/src/features/performance/DecisionDrill.tsx`

```tsx
'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import type { DecisionCase } from './decisions'

export function DecisionDrill({ title, cases }: { title: string; cases: readonly DecisionCase[] }) {
  const root = useId()
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string | null>(null)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const item = cases[index]
  const answered = Object.keys(choices).length
  const correct = cases.filter((row) => choices[row.id] === row.answer).length
  const committed = item ? item.id in choices : false
  if (!item) return <p>No decision cases are available.</p>

  return (
    <Card>
      <p className="t-label mb-2 text-brand">Hypothetical exercise</p>
      <h3 className="t-head mb-3 text-lg">{title}</h3>
      <p aria-live="polite" className="t-data mb-4 text-sm text-muted">
        {answered > 0 ? `${correct} of ${answered} decisions correct` : ''}
      </p>
      {item.comparison && <table className="mb-5 w-full table-fixed border-collapse text-left text-sm">
        <caption className="mb-2 text-left text-sm font-medium">Before and after evidence</caption>
        <thead><tr><th scope="col" className="w-1/4 p-2">Field</th><th scope="col" className="p-2">Before</th><th scope="col" className="p-2">After</th></tr></thead>
        <tbody>{item.comparison.map((row) => <tr key={row.field} className="border-t border-line">
          <th scope="row" className="break-words p-2 align-top font-medium">{row.field}</th>
          <td className="break-words p-2 align-top text-muted">{row.before}</td>
          <td className="break-words p-2 align-top text-muted">{row.after}</td>
        </tr>)}</tbody>
      </table>}
      <fieldset disabled={committed} className="min-w-0 space-y-2">
        <legend className="mb-3 text-sm font-medium">{item.prompt}</legend>
        {item.options.map((option) => <label key={option.id}
          className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand">
          <input type="radio" name={`${root}-${item.id}`} value={option.id} disabled={committed}
            checked={(committed ? choices[item.id] : draft) === option.id}
            onChange={() => setDraft(option.id)}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default" />
          <span aria-hidden className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand" />
          <span className="min-w-0 break-words">{option.label}</span>
        </label>)}
      </fieldset>
      <button type="button" disabled={draft === null || committed} onClick={() => {
        if (draft === null || committed) return
        setChoices((previous) => ({ ...previous, [item.id]: draft }))
      }} className="mt-4 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle">Commit decision</button>
      <div aria-live="polite" className="mt-4">
        {committed && <>
          <p className={choices[item.id] === item.answer ? 'text-sm font-medium text-go' : 'text-sm font-medium text-danger'}>
            {choices[item.id] === item.answer ? 'Correct' : 'Needs correction'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.why}</p>
        </>}
      </div>
      {committed && index < cases.length - 1 && <button type="button"
        onClick={() => { setIndex(index + 1); setDraft(null) }} className="mt-4 min-h-11 border border-line px-4 text-sm">Next case</button>}
      <button type="button" onClick={() => { setIndex(0); setDraft(null); setChoices({}) }}
        className="mt-4 ml-2 min-h-11 border border-line px-4 text-sm">Reset decisions</button>
    </Card>
  )
}
```

- [x] **Step 4: Capture GREEN.** Run both files and `pnpm typecheck`. Native arrow-key behavior needs Task 8's browser test; a jsdom `keydown` does not prove browser default actions.
- [x] **Step 5: Teeth check.** In the verdict paragraph only, replace `{item.why}` with `{choices[item.id] === item.answer ? item.why : null}`. Only `wrong and right answers both reveal...` should fail in the Task 4 suite. Restore the unconditional reasoning and rerun GREEN.
- [x] **Step 6: Format, lint, review and commit.** Commit `feat(performance): judge diagnostic and outcome evidence` with the required trailer. Keep diagnosis, comparison and SQL assertions in the report.


```bash
pnpm exec prettier --write src/features/performance/decisions.ts src/features/performance/DecisionDrill.tsx src/features/performance/artifacts.ts src/features/performance/decisions.test.ts src/features/performance/DecisionDrill.test.tsx
pnpm lint
git add src/features/performance/decisions.ts src/features/performance/DecisionDrill.tsx src/features/performance/artifacts.ts src/features/performance/decisions.test.ts src/features/performance/DecisionDrill.test.tsx
git commit -m 'feat(performance): judge diagnostic and outcome evidence' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 5: Save both worksheet views and export without losing edits

**Files:**
- Create: `web/src/features/performance/CopyText.tsx`
- Create: `web/src/features/performance/PerformanceWorksheet.tsx`
- Test: `web/src/features/performance/PerformanceWorksheet.test.tsx`

**Interfaces:**
- Consumes: all sheet exports from Task 1; existing `useLocalStorage<unknown>`.
- Produces: `PerformanceWorksheet({ view: 'baseline' | 'followup' })`, `CopyText({ text: string; label?: string; manualLabel?: string; disabled?: boolean })`.
- `CopyText` is also the AI prompt's safe clipboard control in Task 7. No shared artifact-control change is included.
- Ordinary saved values survive remount/reload and storage events. When storage is unavailable, retain the mounted component's draft and disclose that it will not survive reload; do not promise persistence for unavailable storage.

- [ ] **Step 1: Write the render tests.**

#### Test source: `web/src/features/performance/PerformanceWorksheet.test.tsx`

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { PerformanceWorksheet } from './PerformanceWorksheet'
import {
  EMPTY_PERFORMANCE_SHEET, PERFORMANCE_KEY, performanceMarkdown, SHEET_FIELDS,
} from '@/lib/performance-sheet'

let writeText = vi.fn<(text: string) => Promise<void>>()
beforeEach(() => {
  window.localStorage.clear()
  writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined)
  vi.stubGlobal('navigator', { clipboard: { writeText } })
})
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

function edit(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

test('baseline and follow-up edits survive panel remounts and export the whole record from either view', async () => {
  let view = render(<PerformanceWorksheet view="baseline" />)
  edit('Outcome and observer', 'Browser click to response')
  edit('Metric and population', 'Completed p95; failures/timeouts separate')
  view.unmount()
  view = render(<PerformanceWorksheet view="followup" />)
  edit('Verdict and open gap', 'More field observations needed')
  const expected = {
    ...EMPTY_PERFORMANCE_SHEET, outcome: 'Browser click to response',
    metric: 'Completed p95; failures/timeouts separate', verdict: 'More field observations needed',
  }
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' })) })
  expect(writeText).toHaveBeenLastCalledWith(performanceMarkdown(expected))
  expect(screen.getByRole('status', { name: 'Copy status' }).textContent).toBe('Copied to clipboard.')
  expect(JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!)).toEqual(expected)
  view.unmount()
  render(<PerformanceWorksheet view="baseline" />)
  expect((screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement).value).toBe(expected.outcome)
  expect(screen.getByText('3 of 11 fields recorded')).toBeTruthy()
})

test('malformed or partial stored values never crash and a later edit keeps valid fields from the other view', () => {
  for (const raw of ['{broken', 'null', '[]', '{"outcome":"Keep me","verdict":"Observe","metric":95}']) {
    window.localStorage.setItem(PERFORMANCE_KEY, raw)
    const view = render(<PerformanceWorksheet view="baseline" />)
    edit('Scope', 'Mobile; warm cache')
    const saved = JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!)
    expect(saved.scope).toBe('Mobile; warm cache')
    expect(typeof saved.metric).toBe('string')
    if (raw.includes('Keep me')) {
      expect(saved.outcome).toBe('Keep me')
      expect(saved.verdict).toBe('Observe')
    }
    view.unmount()
  }
})

test('denied reads or writes retain a mounted editable draft and export it instead of claiming it was saved', async () => {
  for (const method of ['getItem', 'setItem'] as const) {
    window.localStorage.clear()
    const denied = vi.spyOn(Storage.prototype, method).mockImplementation(() => { throw new Error('Storage denied') })
    const view = render(<PerformanceWorksheet view="baseline" />)
    edit('Outcome and observer', 'Unsaved browser outcome')
    edit('Scope', 'Unsaved scope')
    expect((screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement).value).toBe('Unsaved browser outcome')
    expect(screen.getByText(/Saving is unavailable/)).toBeTruthy()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' })) })
    expect(writeText).toHaveBeenLastCalledWith(performanceMarkdown({
      ...EMPTY_PERFORMANCE_SHEET, outcome: 'Unsaved browser outcome', scope: 'Unsaved scope',
    }))
    view.unmount()
    denied.mockRestore()
  }
})

test('a rejected clipboard operation offers exact manual Markdown without losing the worksheet', async () => {
  writeText.mockRejectedValue(new Error('Clipboard denied'))
  render(<PerformanceWorksheet view="followup" />)
  edit('Hypothesis and alternative', 'Repeated queries explain the controlled run')
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy as Markdown' })) })
  const manual = screen.getByLabelText('Markdown record') as HTMLTextAreaElement
  expect(manual.readOnly).toBe(true)
  expect(manual.value).toBe(performanceMarkdown({
    ...EMPTY_PERFORMANCE_SHEET, hypothesis: 'Repeated queries explain the controlled run',
  }))
  expect(screen.getByRole('status', { name: 'Copy status' }).textContent).toMatch(/Copy is unavailable/)
  expect((screen.getByLabelText('Hypothesis and alternative') as HTMLTextAreaElement).value).toContain('Repeated queries')
})

test('clearing requires confirmation and resets fields from both views rather than just the visible form', () => {
  window.localStorage.setItem(PERFORMANCE_KEY, JSON.stringify({
    ...EMPTY_PERFORMANCE_SHEET, outcome: 'Saved outcome', verdict: 'Saved verdict',
  }))
  render(<PerformanceWorksheet view="baseline" />)
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
  fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
  expect(window.localStorage.getItem(PERFORMANCE_KEY)).not.toBeNull()
  confirm.mockReturnValue(true)
  fireEvent.click(screen.getByRole('button', { name: 'Clear whole record' }))
  expect(window.localStorage.getItem(PERFORMANCE_KEY)).toBeNull()
  expect((screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement).value).toBe('')
  expect(screen.getByText('0 of 11 fields recorded')).toBeTruthy()
})

test('a storage event refreshes the other view and the next edit preserves that unseen field', () => {
  render(<PerformanceWorksheet view="baseline" />)
  act(() => {
    window.localStorage.setItem(PERFORMANCE_KEY, JSON.stringify({
      ...EMPTY_PERFORMANCE_SHEET, outcome: 'Changed in another tab', verdict: 'Keep follow-up',
    }))
    window.dispatchEvent(new StorageEvent('storage', { key: PERFORMANCE_KEY }))
  })
  expect((screen.getByLabelText('Outcome and observer') as HTMLTextAreaElement).value).toBe('Changed in another tab')
  edit('Scope', 'Same scope')
  expect(JSON.parse(window.localStorage.getItem(PERFORMANCE_KEY)!).verdict).toBe('Keep follow-up')
  expect(SHEET_FIELDS).toHaveLength(11)
})
```

- [ ] **Step 2: Capture RED.** Run `pnpm exec vitest run src/features/performance/PerformanceWorksheet.test.tsx`. Missing component is the expected initial failure. Later failures must concern retaining input, normalization or clipboard behavior, not a missing DOM setup.
- [ ] **Step 3: Write the safe copy control and worksheet.**

#### Implementation source: `web/src/features/performance/CopyText.tsx`

```tsx
'use client'

import { useId, useState } from 'react'

export function CopyText({ text, label = 'Copy as Markdown', manualLabel = 'Markdown record', disabled = false }: {
  text: string
  label?: string
  manualLabel?: string
  disabled?: boolean
}) {
  const root = useId()
  const [message, setMessage] = useState('')
  const [manual, setManual] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Copied to clipboard.')
      setManual(false)
    } catch {
      setMessage('Copy is unavailable. Select the Markdown below and copy it manually.')
      setManual(true)
    }
  }
  return (
    <div className="mt-4 min-w-0">
      <button type="button" disabled={disabled} onClick={() => void copy()}
        className="min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle">{label}</button>
      <p role="status" aria-label="Copy status" className="mt-2 text-sm text-muted">{message}</p>
      {manual && <div className="mt-3">
        <label htmlFor={`${root}-manual`} className="mb-2 block text-sm font-medium">{manualLabel}</label>
        <textarea id={`${root}-manual`} readOnly value={text} rows={6}
          className="w-full border border-line bg-sunken px-3 py-2 text-sm leading-relaxed text-fg focus-visible:outline-2 focus-visible:outline-brand" />
      </div>}
    </div>
  )
}
```

#### Implementation source: `web/src/features/performance/PerformanceWorksheet.tsx`

```tsx
'use client'

import { useId, useState } from 'react'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import {
  BASELINE_FIELDS, EMPTY_PERFORMANCE_SHEET, FOLLOWUP_FIELDS, normalizePerformanceSheet,
  PERFORMANCE_KEY, performanceMarkdown, SHEET_FIELDS, type PerformanceSheet,
} from '@/lib/performance-sheet'
import { CopyText } from './CopyText'

export function PerformanceWorksheet({ view }: { view: 'baseline' | 'followup' }) {
  const root = useId()
  const { value, setValue, reset } = useLocalStorage<unknown>(PERFORMANCE_KEY, EMPTY_PERFORMANCE_SHEET)
  const [draft, setDraft] = useState<PerformanceSheet | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const sheet = draft ?? normalizePerformanceSheet(value)
  const fields = view === 'baseline' ? BASELINE_FIELDS : FOLLOWUP_FIELDS
  const filled = SHEET_FIELDS.filter(({ key }) => sheet[key].trim().length > 0).length

  const update = (key: keyof PerformanceSheet, text: string) => {
    let next = { ...sheet, [key]: text }
    setValue((previous: unknown) => {
      next = { ...normalizePerformanceSheet(previous), ...(draft ?? {}), [key]: text }
      return next
    })
    let saved = false
    try { saved = window.localStorage.getItem(PERFORMANCE_KEY) === JSON.stringify(next) } catch { /* retain the mounted draft */ }
    setDraft(saved ? null : next)
    setUnavailable(!saved)
  }

  const clear = () => {
    if (!window.confirm('Clear the whole performance record, including both views?')) return
    reset()
    let cleared = false
    try { cleared = window.localStorage.getItem(PERFORMANCE_KEY) === null } catch { /* show unavailable storage */ }
    setDraft(cleared ? null : { ...EMPTY_PERFORMANCE_SHEET })
    setUnavailable(!cleared)
  }

  return (
    <Card>
      <h3 className="t-head text-lg">{view === 'baseline' ? 'Your baseline record' : 'Your follow-up record'}</h3>
      <p className="mt-2 text-sm text-muted">Your application only. Example answers are never copied into these fields. Saved in this browser when storage is available.</p>
      <p aria-live="polite" className="t-data mt-3 text-sm text-subtle">{filled} of {SHEET_FIELDS.length} fields recorded</p>
      <p className="mt-2 text-sm text-muted">Recording fields does not verify performance or correctness.</p>
      <p aria-live="polite" className="mt-2 text-sm text-warn">
        {unavailable ? 'Saving is unavailable. This draft remains editable here; export it before leaving or reloading.' : ''}
      </p>
      <div className="mt-5 space-y-5">
        {fields.map((field) => <div key={field.key}>
          <label htmlFor={`${root}-${field.key}`} className="block text-sm font-medium">{field.label}</label>
          <p id={`${root}-${field.key}-hint`} className="my-2 text-sm text-muted">{field.hint}</p>
          <textarea id={`${root}-${field.key}`} aria-describedby={`${root}-${field.key}-hint`}
            value={sheet[field.key]} rows={2} onChange={(event) => update(field.key, event.target.value)}
            className="w-full resize-y border border-line bg-sunken px-3 py-2 text-[15px] leading-6 text-fg focus-visible:outline-2 focus-visible:outline-brand" />
        </div>)}
      </div>
      <CopyText text={performanceMarkdown(sheet)} disabled={filled === 0} />
      <button type="button" disabled={filled === 0} onClick={clear}
        className="mt-3 min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle">Clear whole record</button>
    </Card>
  )
}
```

The shared hook's updater executes synchronously, so the handler can verify the exact resolved record after the write. The stage-local `draft` retains the next record when that verification is impossible. This is not an effect-driven storage read and introduces no `setState` in an effect. A denied-storage draft is explicitly limited to the mounted instance; ordinary stored records survive both panels and reloads.

- [ ] **Step 4: Capture GREEN.** Run the focused render suite, Task 1's unit suite and `pnpm typecheck`. Verify the clipboard Promise is awaited through `act` in tests; a green synchronous click alone does not prove export.
- [ ] **Step 5: Teeth check.** Replace only `setDraft(saved ? null : next)` with `setDraft(null)` in `PerformanceWorksheet.tsx`. Only `denied reads or writes retain...` should fail in this task's suite. Restore and rerun GREEN, including the normal persistence test.
- [ ] **Step 6: Format, lint, review and commit.** Commit `feat(performance): save and export the measurement worksheet` with the required trailer. Include permission-failure evidence in the report; do not change `useLocalStorage.ts`.


```bash
pnpm exec prettier --write src/features/performance/CopyText.tsx src/features/performance/PerformanceWorksheet.tsx src/features/performance/PerformanceWorksheet.test.tsx
pnpm lint
git add src/features/performance/CopyText.tsx src/features/performance/PerformanceWorksheet.tsx src/features/performance/PerformanceWorksheet.test.tsx
git commit -m 'feat(performance): save and export the measurement worksheet' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 6: Close the pass with evidence and team ownership

**Files:**
- Create: `web/src/features/performance/checklist.ts`
- Create: `web/src/features/performance/PerformanceChecklist.tsx`
- Test: `web/src/features/performance/checklist.test.ts`
- Test: `web/src/features/performance/PerformanceChecklist.test.tsx`

**Interfaces:**
- Produces: `DONE`, `TEAM`, `ARTIFACTS`, `CHECKLIST_KEY`, `PerformanceChecklist()`.
- Consumes: `useLocalStorage<unknown>` and shared `TeamNotes`. The checklist key differs from the worksheet key; only valid known ids affect its count.

- [ ] **Step 1: Write canonical-data and render tests.**

#### Test source: `web/src/features/performance/checklist.test.ts`

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { DONE, TEAM, ARTIFACTS } from './checklist'

test('completion checks are the canonical chapter checks rather than an index-by-reflex list', () => {
  const chapter = readFileSync(resolve(process.cwd(), '../docs/09-performance-optimization.md'), 'utf8')
  const done = chapter.split('## Definition of done')[1].split('---')[0]
  expect(DONE.map((row) => row.text)).toEqual([...done.matchAll(/^- \[ \] (.+)$/gm)].map((match) => match[1]))
  expect(ARTIFACTS).toHaveLength(4)
  expect(TEAM.map((row) => row.id)).toEqual(['targets', 'budget', 'plans', 'owner'])
})
```

#### Test source: `web/src/features/performance/PerformanceChecklist.test.tsx`

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { PerformanceChecklist } from './PerformanceChecklist'
import { CHECKLIST_KEY, DONE, TEAM } from './checklist'

beforeEach(() => { window.localStorage.clear() })

test('ticked evidence persists on remount and reset removes the checklist without touching the worksheet', () => {
  window.localStorage.setItem('playbook:performance-worksheet:v1', '{"outcome":"Keep worksheet"}')
  const view = render(<PerformanceChecklist />)
  fireEvent.click(screen.getByRole('checkbox', { name: DONE[0].text }))
  expect(screen.getByText('1 of 5 checks recorded')).toBeTruthy()
  view.unmount()
  render(<PerformanceChecklist />)
  expect((screen.getByRole('checkbox', { name: DONE[0].text }) as HTMLInputElement).checked).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Reset completion checks' }))
  expect(screen.getByText('0 of 5 checks recorded')).toBeTruthy()
  expect(window.localStorage.getItem('playbook:performance-worksheet:v1')).toContain('Keep worksheet')
})

test('unknown, duplicate or malformed saved ids do not create a false completion count', () => {
  for (const raw of ['null', '{}', '42', JSON.stringify([DONE[0].id, DONE[0].id, 'obsolete', 9])]) {
    window.localStorage.setItem(CHECKLIST_KEY, raw)
    const view = render(<PerformanceChecklist />)
    expect(screen.getByText(raw.includes('obsolete') ? '1 of 5 checks recorded' : '0 of 5 checks recorded')).toBeTruthy()
    view.unmount()
  }
})

test('team notes include a named budget, query-plan review and ownership of the after window', () => {
  render(<PerformanceChecklist />)
  const open = screen.getByRole('button', { name: /If you are not solo/i })
  fireEvent.click(open)
  for (const row of TEAM) expect(screen.getByText(row.detail)).toBeTruthy()
  expect(open.getAttribute('aria-expanded')).toBe('true')
})
```

- [ ] **Step 2: Capture RED.** Run `pnpm exec vitest run src/features/performance/checklist.test.ts src/features/performance/PerformanceChecklist.test.tsx`.
- [ ] **Step 3: Write the canonical checklist and component.**

#### Implementation source: `web/src/features/performance/checklist.ts`

```ts
export const CHECKLIST_KEY = 'playbook:performance-checklist:v1'
export const EMPTY_CHECKS: readonly string[] = []
export const DONE = [
  { id: 'comparable', text: 'The same outcome is measured before and after, with comparable segment, data and cache state' },
  { id: 'field', text: 'The production or field comparison records the window, sample, percentile, failures and timeouts' },
  { id: 'target', text: 'The measured outcome meets its stated target, or the unresolved gap is recorded' },
  { id: 'correctness', text: 'Correctness tests pass and the order, payment and inventory behavior remains intact' },
  { id: 'disposition', text: 'A failed or harmful change is reverted or explicitly carried as an open problem' },
] as const

export const ARTIFACTS = [
  'A baseline record naming the outcome, metric, scope, window, sample and target',
  'The trace, query plan or controlled run that supports the chosen hypothesis',
  'The change and its correctness/rollback checks',
  'A comparable before and after record, including unsuccessful attempts',
] as const

export const TEAM = [
  { id: 'targets', title: 'Publish the targets', detail: 'Publish the outcome, target and scope so everyone measures the same thing.' },
  { id: 'budget', title: 'Name the CI budget', detail: 'State the CI metric, threshold and representative run. A passing build alone is not a bundle-size budget.' },
  { id: 'plans', title: 'Review query plans', detail: 'Review relevant query plans when data access changes on a measured slow path.' },
  { id: 'owner', title: 'Own the observation window', detail: 'Assign who observes the outcome after deployment and decides whether the change helped.' },
] as const
```

#### Implementation source: `web/src/features/performance/PerformanceChecklist.tsx`

```tsx
'use client'

import { useId } from 'react'
import { Card } from '@/components/ui'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACTS, CHECKLIST_KEY, DONE, EMPTY_CHECKS, TEAM } from './checklist'

export function PerformanceChecklist() {
  const root = useId()
  const { value, setValue, reset } = useLocalStorage<unknown>(CHECKLIST_KEY, EMPTY_CHECKS)
  const valid = new Set<string>(DONE.map((row) => row.id))
  const checked = new Set<string>(Array.isArray(value)
    ? value.filter((id): id is string => typeof id === 'string' && valid.has(id)) : [])
  return (
    <Card>
      <p aria-live="polite" className="t-data mb-4 text-sm text-muted">{checked.size} of {DONE.length} checks recorded</p>
      <ul className="space-y-2">
        {DONE.map((row) => <li key={row.id} className="measure-full">
          <label htmlFor={`${root}-${row.id}`} className="relative flex min-h-11 cursor-pointer items-start gap-3 border border-line p-3 text-sm focus-within:outline-2 focus-within:outline-brand">
            <input id={`${root}-${row.id}`} type="checkbox" checked={checked.has(row.id)}
              onChange={() => {
                const next = new Set(checked)
                if (next.has(row.id)) next.delete(row.id); else next.add(row.id)
                setValue([...next])
              }} className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
            <span aria-hidden className="mt-1 size-4 shrink-0 border border-line peer-checked:border-brand peer-checked:bg-brand" />
            <span className="min-w-0 break-words">{row.text}</span>
          </label>
        </li>)}
      </ul>
      <button type="button" onClick={reset} className="mt-4 min-h-11 border border-line px-4 text-sm">Reset completion checks</button>
      <h3 className="t-head mt-6 text-lg">Keep these artifacts</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">{ARTIFACTS.map((text) => <li key={text}>{text}</li>)}</ul>
      <div className="mt-6"><TeamNotes>
        <ul className="space-y-4">{TEAM.map((row) => <li key={row.id}>
          <h4 className="text-sm font-medium">{row.title}</h4><p className="mt-1 text-sm text-muted">{row.detail}</p>
        </li>)}</ul>
      </TeamNotes></div>
    </Card>
  )
}
```

- [ ] **Step 4: Capture GREEN.** Run both files and `pnpm typecheck`. Count only unique known ids and verify the worksheet key remains untouched.
- [ ] **Step 5: Teeth check.** In the TeamNotes rendering only, change `TEAM.map` to `TEAM.filter((row) => row.id !== 'owner').map`. Only the team-notes render test should fail. Restore and rerun GREEN; the data test must remain green during the mutation, demonstrating why rendering needs its own test.
- [ ] **Step 6: Format, lint, review and commit.** Commit `feat(performance): record completion and team ownership` with the required trailer and evidence report.


```bash
pnpm exec prettier --write src/features/performance/checklist.ts src/features/performance/PerformanceChecklist.tsx src/features/performance/checklist.test.ts src/features/performance/PerformanceChecklist.test.tsx
pnpm lint
git add src/features/performance/checklist.ts src/features/performance/PerformanceChecklist.tsx src/features/performance/checklist.test.ts src/features/performance/PerformanceChecklist.test.tsx
git commit -m 'feat(performance): record completion and team ownership' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 7: Assemble the teaching panels, vocabulary and source list

**Files:**
- Create: `web/src/features/performance/content.ts`
- Create: `web/src/features/performance/panels-measure.tsx`
- Create: `web/src/features/performance/panels-diagnose.tsx`
- Create: `web/src/features/performance/panels-close.tsx`
- Test: `web/src/features/performance/content.test.ts`
- Test: `web/src/features/performance/panels.test.tsx`
- Modify: `web/src/lib/terms.ts` (six missing entries inside `TERMS`)
- Modify: `web/src/lib/references.ts` (one five-reference Stage 09 entry)
- Generate: `reference/glossary.md` via `pnpm gen:glossary`

**Interfaces:**
- Consumes: Tasks 2 through 6 components and datasets; `Figure`, `Term`, `RevealList`, `RevealFacet`, `AnnotatedArtifact`, and UI primitives.
- Produces: `FIXES`, `TRAPS`, `AI_PLAYS`, `AI_PROMPT`, `COVERAGE`, `FixRow`, `TrapRow` and all twelve named panel functions below.
- The stage is still unregistered. Task 8 alone changes its exposure to routing.

- [ ] **Step 1: Write source and panel render tests.**

#### Test source: `web/src/features/performance/content.test.ts`

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { getTerm } from '@/lib/terms'
import { getReferences } from '@/lib/references'
import { AI_PROMPT, COVERAGE, FIXES, TRAPS } from './content'

const chapter = () => readFileSync(resolve(process.cwd(), '../docs/09-performance-optimization.md'), 'utf8')

test('coverage names every canonical section including bold fix and trap items', () => {
  const md = chapter()
  const headings = [...md.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1]).filter((name) => name !== 'The work')
  expect(Object.keys(COVERAGE)).toEqual(headings)
  const fixes = md.split('### The fixes that usually matter')[1].split('### When not to optimize')[0]
  const titles = (text: string) => [...text.matchAll(/^\*\*([^*]+)\.\*\*/gm)].map((m) => m[1].replace(/`/g, ''))
  expect(FIXES.map((row) => row.title)).toEqual(titles(fixes))
  expect(TRAPS.map((row) => row.title)).toEqual(titles(md.split('## Traps')[1]))
})

test('new first-encounter terms and five extending references exist in their single sources', () => {
  for (const id of ['lcp', 'inp', 'cls', 'n-plus-one', 'query-plan', 'cache-invalidation']) {
    expect(getTerm(id)?.see).toBe('09-performance-optimization')
  }
  expect(getReferences('09-performance-optimization').map((row) => row.url)).toEqual([
    'https://web.dev/articles/vitals',
    'https://web.dev/articles/lab-and-field-data-differences',
    'https://www.postgresql.org/docs/18/using-explain.html',
    'https://nextjs.org/docs/app/api-reference/directives/use-cache',
    'https://opentelemetry.io/docs/concepts/context-propagation/',
  ])
  expect(AI_PROMPT).toContain('raw evidence')
  expect(AI_PROMPT).toContain('Do not invent measurements')
})
```

#### Test source: `web/src/features/performance/panels.test.tsx`

```tsx
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { AIPanel, TrapsPanel } from './panels-close'
import { FixesPanel, QueryPanel } from './panels-diagnose'
import { TargetsPanel } from './panels-measure'
import { AI_PROMPT, FIXES, TRAPS } from './content'
import { INVENTORY_PLAN } from './artifacts'

afterEach(() => { vi.unstubAllGlobals() })

test('every candidate reveals evidence, correctness risk and comparable retest instead of a blanket recommendation', () => {
  render(<FixesPanel />)
  for (const row of FIXES) {
    const toggle = screen.getByRole('button', { name: row.title })
    fireEvent.click(toggle)
    const detail = document.getElementById(toggle.getAttribute('aria-controls')!)!
    expect(detail.textContent).toContain(row.evidence.replace(/`/g, ''))
    expect(detail.textContent).toContain(row.retest)
  }
  const body = document.body.textContent ?? ''
  expect(body).toContain('CONCURRENTLY')
  expect(body).toContain('transaction block')
  expect(body).toContain('invalid index')
  expect(body).toContain('freshness and authorization')
  expect(body).toContain('Server Actions only')
  expect(body).toContain('300 ms to 150 ms')
  expect(body).toContain('no longer prints route-level JS bundle sizes')
  expect(body).toContain('LCP image')
  expect(body).toContain('compatible loader')
})

test('changed candidate data changes what the reader sees rather than only passing a data invariant', () => {
  render(<FixesPanel fixes={[{ ...FIXES[0], retest: 'Measure the changed user boundary.' }]} />)
  fireEvent.click(screen.getByRole('button', { name: /Index or query shape/ }))
  expect(screen.getByText('Measure the changed user boundary.')).toBeTruthy()
})

test('every canonical trap is consultable by its own label', () => {
  render(<TrapsPanel />)
  for (const row of TRAPS) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(row.title) }))
    expect(screen.getByText(row.detail)).toBeTruthy()
  }
})

test('targets distinguish inclusive published thresholds from local product budgets', () => {
  render(<TargetsPanel />)
  expect(document.body.textContent).toContain('LCP ≤2.5 s')
  expect(document.body.textContent).toContain('INP ≤200 ms')
  expect(document.body.textContent).toContain('CLS ≤0.1')
  expect(document.body.textContent).toContain('p75, separately for mobile and desktop')
  expect(document.body.textContent).toContain('example budgets')
})

test('the SQL artifact renders its exact copyable lines separately from notes', () => {
  const { container } = render(<QueryPanel />)
  const lines = [...container.querySelectorAll('[data-artifact-line]')].map((node) => node.textContent)
  expect(lines).toEqual(INVENTORY_PLAN.lines.map((line) => line.text))
})

test('the AI prompt requires real evidence and handles rejected copying without an unhandled promise', async () => {
  const writeText = vi.fn().mockRejectedValue(new Error('Clipboard denied'))
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  render(<AIPanel />)
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copy evidence prompt' })) })
  expect(writeText).toHaveBeenCalledWith(AI_PROMPT)
  expect((screen.getByLabelText('Evidence prompt') as HTMLTextAreaElement).value).toBe(AI_PROMPT)
  expect(screen.getByRole('status', { name: 'Copy status' }).textContent).toMatch(/Copy is unavailable/)
})
```

The candidate test observes each controlled panel's text, including strings split into code spans by `InlineCode`.

- [ ] **Step 2: Capture RED.** Run `pnpm exec vitest run src/features/performance/content.test.ts src/features/performance/panels.test.tsx`. The terms/reference assertion also fails until their canonical registries are updated.
- [ ] **Step 3: Write teaching data and panels.**

#### Implementation source: `web/src/features/performance/content.ts`

```ts
export type FixRow = { id: string; title: string; evidence: string; risk: string; retest: string }
export type TrapRow = { id: string; title: string; detail: string }

export const FIXES: readonly FixRow[] = [
  {
    id: 'index', title: 'Index or query shape',
    evidence: 'A representative slow order-history plan can justify testing `(owner_id, created_at DESC)` for the owner filter and creation sort. Consider table size, selectivity and write cost.',
    risk: 'Normal CREATE INDEX blocks writes while building. CONCURRENTLY takes longer, cannot run inside a transaction block, and failure can leave an invalid index. Check the migration runner and cleanup.',
    retest: 'Compare the same query and workload, then measure the selected user outcome. Keep correctness and write cost visible.',
  },
  {
    id: 'n-plus-one', title: 'N+1 queries',
    evidence: 'The controlled 20-item cart shows 21 inventory queries: one list query and one availability query per item. Confirm repeated calls in the trace or query log.',
    risk: 'Batching or joining must preserve the same stock decision and order result. A query-count reduction alone does not establish a user improvement.',
    retest: 'Repeat the cart reproduction and compare the same browser outcome, completed sample, failures and timeouts after deployment.',
  },
  {
    id: 'awaits', title: 'Serial awaits',
    evidence: 'Independent operations may overlap with Promise.all. Two independent 150 ms calls explain the arithmetic example of 300 ms to 150 ms.',
    risk: 'The arithmetic is not a promised measurement. A dependent payment or inventory step must keep its dependency.',
    retest: 'Measure the same outcome with comparable load, and verify dependency and failure behavior.',
  },
  {
    id: 'cache', title: 'Caching',
    evidence: 'Repeated reads of data safe to share may justify Cache Components with `use cache`, `cacheLife` and `cacheTag`.',
    risk: '`updateTag` is Server Actions only; the next read waits for fresh data. TTL and other invalidation paths differ. Test freshness and authorization, especially for stock or pricing.',
    retest: 'Measure the same cold or warm cache condition and test the read after a write, user scope and stale-data recovery.',
  },
  {
    id: 'bundles', title: 'Client bundles',
    evidence: 'Use a version-appropriate analyzer to identify what an affected client route ships. Next.js 16 no longer prints route-level JS bundle sizes in next build.',
    risk: 'A production build checks build correctness. It is not a bundle-size budget or proof an import change helped users.',
    retest: 'Measure the affected page experience after the import change, in the same device and network segment.',
  },
  {
    id: 'images', title: 'Images',
    evidence: 'A measured image-loading bottleneck can justify responsive sizes and modern formats. A large image cannot explain the cart example’s repeated server queries.',
    risk: 'next/image is lazy by default; an LCP image may need eager loading or fetch priority. Static export needs a compatible loader for the default Image Optimization API.',
    retest: 'Measure the same page LCP and device segment, preserving image dimensions and visual stability.',
  },
  {
    id: 'server-components', title: 'Server Components',
    evidence: 'Eligible server fetching and rendering can reduce client JavaScript and a client-side fetch waterfall.',
    risk: 'This does not remove every loading state or make a slow server query fast. Keep sensitive data and server-only dependencies off the client.',
    retest: 'Measure shipped client code and the affected user outcome, and verify fetching and loading behavior.',
  },
]

export const TRAPS: readonly TrapRow[] = [
  { id: 'measure', title: 'Optimizing without measuring', detail: 'Record the observer, outcome and baseline first, so a later change has a comparable measurement.' },
  { id: 'averages', title: 'Averages instead of percentiles', detail: 'An average can hide the slow tail. Keep sample count and the percentile population beside the result.' },
  { id: 'field', title: 'Treating a local run as field evidence', detail: 'Controlled hardware, network and data support diagnosis. They may not represent the people using the application.' },
  { id: 'index', title: 'Adding an index by reflex', detail: 'Check the plan, selectivity, workload and write cost. Plan migration locking before choosing an index.' },
  { id: 'freshness', title: 'Caching without a freshness rule', detail: 'Test the read after a write. Faster stale stock or pricing is a correctness problem.' },
  { id: 'memo', title: 'memo and useMemo everywhere', detail: 'Profile the user outcome and render work before adding memo comparison cost and complexity.' },
  { id: 'traffic', title: 'Dismissing low traffic', detail: 'A rare workflow can still be critical. Decide from user impact and the target rather than request count alone.' },
  { id: 'span', title: 'Stopping at a faster internal span', detail: 'Retest the same user outcome in field or production observations, with failures, timeouts and correctness visible.' },
]

export const AI_PLAYS = [
  { id: 'record', title: 'Organize the record', detail: 'Ask an assistant to separate the user clock, scope, population and evidence. Verify each field against the raw source.' },
  { id: 'hypotheses', title: 'Compare hypotheses', detail: 'Use superpowers:systematic-debugging to state competing causes and the measurement that could disprove each. A trace only contains instrumented work.' },
  { id: 'reproduce', title: 'Draft a controlled reproduction', detail: 'Supply the device, network, data shape and cache state. Check the reproduction and arithmetic yourself; a lab run does not establish field p95.' },
] as const

export const AI_PROMPT = [
  'Review this redacted performance evidence.',
  'Outcome, observer and start/stop events:',
  'Metric, population, total attempts, completed samples, failures and timeouts:',
  'Route/event, deployment version, segment, data shape and cache state:',
  'Window, target and raw evidence:',
  'Separate field outcome evidence from traces, query plans and controlled runs.',
  'Suggest competing hypotheses and a controlled test that could disprove each.',
  'Cite source references and verify arithmetic against the raw evidence.',
  'Require a comparable after observation and correctness/rollback checks.',
  'Do not invent measurements or declare a production win from a local run.',
  'Exclude customer details, payment data and secrets.',
].join('\n')

export const COVERAGE: Record<string, readonly string[]> = {
  'Entry criteria': ['clock'],
  'Map the order journey': ['clock'],
  'Measure the first baseline': ['baseline', 'record'],
  'Decide what fast enough means': ['target'],
  'Find the real bottleneck': ['bottleneck', 'query', 'compare'],
  'The fixes that usually matter': ['fixes'],
  'When not to optimize': ['target', 'compare'],
  'AI in performance optimization': ['ai'],
  Artifacts: ['record', 'followup', 'done'],
  'Definition of done': ['done'],
  'Scaling to a team': ['done'],
  Traps: ['traps'],
}
```

#### Implementation source: `web/src/features/performance/panels-measure.tsx`

```tsx
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Card, Callout, Prose, Section } from '@/components/ui'
import { BaselineLab } from './BaselineLab'
import { OrderJourney } from './OrderJourney'

export function ClockPanel() {
  return <Section eyebrow="Start with the user" title="Which outcome is slow?">
    <Prose><p>Begin when a working feature is measurably slow, or when a launch will change its traffic shape. Correctness comes first. Choose the observer and start/stop events before recording a{' '}<Term id="baseline">baseline</Term>.</p></Prose>
    <div className="mt-6"><Figure n={1} caption="The checkout request, visible payment status and three OrderPaid consumers have separate measurement boundaries."><OrderJourney /></Figure></div>
    <div className="mt-5"><Callout title="Join the evidence carefully"><p>Correlate records with an opaque order or event ID and propagated trace context. Keep customer details and payment secrets out of telemetry. Traces show instrumented work; absent spans do not prove an operation or provider wait was absent.</p></Callout></div>
  </Section>
}

export function BaselinePanel() {
  return <Section title="Record the first measurement">
    <Prose><p>This practice now uses browser checkout for the 20-item cart. Keep the duration{' '}<Term id="percentile">percentile</Term>{' '}population separate from failures and timeouts. A controlled run diagnoses one case; field observations establish what users experienced.</p>
      <p>Start page experience in real-user Web Vitals such as Speed Insights or PageSpeed Insights field data, segmented by mobile and desktop. For routes, use available route duration monitoring, noting plan-specific detail and retention. Payment intervals and consumer lag need timestamps joined by an opaque identifier.</p>
      <p>Reproduce the same action with stated device, network, cart size, data volume and cache state. If field traffic is too sparse, record that limitation, keep the controlled baseline and name the next observation window.</p></Prose>
    <div className="mt-6"><BaselineLab /></div>
  </Section>
}

export function TargetsPanel() {
  return <Section title="Choose a target users need">
    <Prose><p>Record the target and its reason before optimizing. Google&apos;s good Core Web Vitals thresholds use p75, separately for mobile and desktop. These concern page experience; they do not replace the checkout or payment clock.</p></Prose>
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <Card><p className="t-data mb-2">LCP ≤2.5 s</p><p className="text-sm text-muted"><Term id="lcp">Largest Contentful Paint</Term>{' '}measures loading.</p></Card>
      <Card><p className="t-data mb-2">INP ≤200 ms</p><p className="text-sm text-muted"><Term id="inp">Interaction to Next Paint</Term>{' '}measures response to interaction.</p></Card>
      <Card><p className="t-data mb-2">CLS ≤0.1</p><p className="text-sm text-muted"><Term id="cls">Cumulative Layout Shift</Term>{' '}measures visual stability.</p></Card>
    </div>
    <div className="mt-5"><Callout title="Product budgets need a reason"><p>API p95 of 300 ms and query time of 50 ms are example budgets, not web standards. A mean can help describe work but hides tails on its own. Do not add caching, memoization or indexes merely because a profiler lists a path. A 200 ms query may still block a critical low-traffic workflow; an already satisfactory high-traffic operation may need no change.</p></Callout></div>
    <a href="https://web.dev/articles/vitals" className="mt-4 inline-flex min-h-11 items-center text-sm underline">Google Web Vitals thresholds</a>
  </Section>
}
```

#### Implementation source: `web/src/features/performance/panels-diagnose.tsx`

```tsx
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { InlineCode } from '@/components/InlineCode'
import { RevealFacet } from '@/components/RevealFacet'
import { RevealList } from '@/components/RevealList'
import { Term } from '@/components/Term'
import { Card, Prose, Section } from '@/components/ui'
import { INVENTORY_PLAN } from './artifacts'
import { FIXES, type FixRow } from './content'
import { BOTTLENECK_CASES, COMPARISON_CASES, QUERY_CASES } from './decisions'
import { DecisionDrill } from './DecisionDrill'

export function BottleneckPanel() {
  return <Section title="Move inward from the slow outcome">
    <Prose><p>For checkout, begin with browser latency, route duration and representative slow traces. A Paid-status problem needs provider, webhook and display timestamps. A late downstream action needs publish and completion timestamps. The worked cart shows{' '}<Term id="n-plus-one">N+1 queries</Term>{' '}in a controlled reproduction, not a measured production win.</p></Prose>
    <div className="mt-6"><Figure n={2} caption="The hypothetical 20-item cart exposes repeated inventory calls; batching remains an experiment until stock correctness and the same user outcome are retested.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card><p className="t-label mb-2 text-brand">Hypothetical before</p><p className="text-sm">21 inventory queries: one list lookup and one availability query per item.</p></Card>
        <Card><p className="t-label mb-2 text-brand">Hypothetical after candidate</p><p className="text-sm">One batched availability lookup for the cart&apos;s SKUs. Preserve the same stock decision and order result.</p></Card>
      </div>
    </Figure></div>
    <div className="mt-6"><DecisionDrill title="What does the evidence support?" cases={BOTTLENECK_CASES} /></div>
  </Section>
}

export function QueryPanel() {
  return <Section title="Read the plan before adding an index">
    <Prose><p>If a query remains slow, inspect its actual{' '}<Term id="query-plan">query plan</Term>{' '}on representative data. This SQL executes a single SELECT when you run it in your database. The playbook does not execute it or treat it as a production p95. Inspect actual and estimated rows, filtered rows, buffers and time; planner costs are not milliseconds.</p></Prose>
    <div className="mt-6"><Figure n={3} caption="The chapter's EXPLAIN statement diagnoses one inventory query; it does not measure browser checkout or a field percentile."><AnnotatedArtifact artifact={INVENTORY_PLAN} /></Figure></div>
    <div className="mt-6"><DecisionDrill title="What does this plan establish?" cases={QUERY_CASES} /></div>
  </Section>
}

export function FixesPanel({ fixes = FIXES }: { fixes?: readonly FixRow[] }) {
  return <Section title="Choose a fix only when evidence supports it">
    <Prose><p>These candidates are not a ranking. Cache work also needs a{' '}<Term id="cache-invalidation">cache invalidation</Term>{' '}rule and correctness checks.</p></Prose>
    <div className="mt-6"><RevealList idPrefix="performance-fixes" rows={fixes.map((row) => ({
      id: row.id, title: row.title,
      body: <div className="space-y-3">
        <RevealFacet label="Evidence"><InlineCode text={row.evidence} /></RevealFacet>
        <RevealFacet label="Correctness and cost" tone="warn"><InlineCode text={row.risk} /></RevealFacet>
        <RevealFacet label="Comparable retest"><InlineCode text={row.retest} /></RevealFacet>
      </div>,
    }))} /></div>
  </Section>
}

export function ComparePanel() {
  return <Section title="Did the user's outcome improve?">
    <Prose><p>The cases below describe hypothetical evidence; they supply no measured production p95s. Compare the same observer, outcome, population, segment, data and cache state. Versions and collection dates deliberately differ; window lengths and conditions stay comparable. Record new sample counts rather than assuming they match.</p></Prose>
    <div className="mt-6"><DecisionDrill title="Compare outcomes" cases={COMPARISON_CASES} /></div>
  </Section>
}
```

#### Implementation source: `web/src/features/performance/panels-close.tsx`

```tsx
import { RevealList } from '@/components/RevealList'
import { Callout, Prose, Section } from '@/components/ui'
import { AI_PLAYS, AI_PROMPT, TRAPS, type TrapRow } from './content'
import { CopyText } from './CopyText'
import { PerformanceChecklist } from './PerformanceChecklist'
import { PerformanceWorksheet } from './PerformanceWorksheet'

export function RecordPanel() {
  return <Section title="Record your own baseline"><PerformanceWorksheet view="baseline" /></Section>
}

export function FollowupPanel() {
  return <Section title="Record the change and comparison"><PerformanceWorksheet view="followup" /></Section>
}

export function AIPanel() {
  return <Section title="AI in performance optimization">
    <Prose><p>Give an assistant redacted evidence, not a request to invent a p95. Verify its arithmetic, query-plan interpretation and causal claims against raw measurements. Keep customer and payment data out of prompts.</p></Prose>
    <div className="mt-6"><RevealList idPrefix="performance-ai" rows={AI_PLAYS.map((row) => ({
      id: row.id, title: row.title, body: <p>{row.detail}</p>,
    }))} /></div>
    <div className="mt-5 border border-line bg-sunken p-4">
      <h3 className="t-head mb-3 text-lg">Evidence review prompt</h3>
      <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-fg">{AI_PROMPT}</pre>
      <CopyText text={AI_PROMPT} label="Copy evidence prompt" manualLabel="Evidence prompt" />
    </div>
  </Section>
}

export function DonePanel() {
  return <Section title="Close the pass with evidence"><PerformanceChecklist /></Section>
}

export function TrapsPanel({ traps = TRAPS }: { traps?: readonly TrapRow[] }) {
  return <Section title="Ways an optimization overclaims">
    <RevealList idPrefix="performance-traps" rows={traps.map((row) => ({
      id: row.id, title: row.title, body: <p>{row.detail}</p>,
    }))} />
    <div className="mt-5"><Callout kind="trap" title="Keep the user clock visible"><p>A faster internal span is a clue. Close the pass with the same user outcome, failures, timeouts and correctness evidence, or record the remaining gap and owner.</p></Callout></div>
  </Section>
}
```

- [ ] **Step 4: Add the six canonical glossary entries below inside `TERMS`.** Reuse existing `baseline` and `percentile`; do not change their definitions or generate a second glossary source.

#### Insertion source: `web/src/lib/terms.ts`, inside `TERMS`

```ts
  lcp: {
    name: 'LCP (Largest Contentful Paint)', see: '09-performance-optimization',
    short: 'The time until the largest visible content element is painted.',
    full: 'A Core Web Vital for loading experience. It records when the largest eligible content element in the viewport is painted. The good threshold is 2.5 seconds or less at p75, assessed separately for mobile and desktop.',
    soWhat: 'A slow hero image or delayed server response can affect LCP. It does not measure the whole checkout or payment operation.',
  },
  inp: {
    name: 'INP (Interaction to Next Paint)', see: '09-performance-optimization',
    short: 'A measure of how promptly a page paints after user interaction.',
    full: 'A Core Web Vital for responsiveness across qualifying interactions during a page visit. It includes time waiting for handlers, their processing, and the next paint. The good threshold is 200 milliseconds or less at p75, assessed separately for mobile and desktop.',
    soWhat: 'A button can feel unresponsive even when its network request is fast. Measure interaction response separately from the entire business operation.',
  },
  cls: {
    name: 'CLS (Cumulative Layout Shift)', see: '09-performance-optimization',
    short: 'A score describing unexpected movement of visible page content.',
    full: 'A Core Web Vital for visual stability, based on qualifying unexpected layout shifts. It is a score, not a duration. The good threshold is 0.1 or less at p75, assessed separately for mobile and desktop.',
    soWhat: 'Faster loading should not make controls jump while a reader tries to use them. Reserve space for content such as images.',
  },
  'n-plus-one': {
    name: 'N+1 queries', see: '09-performance-optimization',
    short: 'One initial query followed by another query for each returned item.',
    full: 'A data-access pattern in which a list lookup triggers repeated per-item queries. A 20-item list can then require 21 queries. Trace or query-log evidence establishes whether those round trips matter for the selected outcome.',
    soWhat: 'Batching or joining may reduce round trips, but the stock or authorization decision and the user-visible result must stay correct.',
  },
  'query-plan': {
    name: 'Query plan', see: '09-performance-optimization',
    short: 'The database operations chosen to execute a query.',
    full: 'A plan describes scans, joins, filters and other operations. PostgreSQL EXPLAIN shows estimates; ANALYZE executes the query and adds actual observations. Compare estimates, actual rows, filtering, buffers and time. Planner cost is not milliseconds.',
    soWhat: 'A sequential scan can be an appropriate choice. Read the plan and workload before assuming an index will help.',
  },
  'cache-invalidation': {
    name: 'Cache invalidation', see: '09-performance-optimization',
    short: 'A rule for expiring or refreshing cached data when it stops being valid.',
    full: 'A cached read needs a freshness rule, such as a lifetime or an update-triggered invalidation. APIs differ: Next.js updateTag is limited to Server Actions and makes the next read wait for fresh tagged data.',
    soWhat: 'A fast response containing stale stock or pricing can harm correctness. Test freshness and authorization alongside latency.',
  },
```

- [ ] **Step 5: Add the curated reference entry inside `REFERENCES`.**

#### Insertion source: `web/src/lib/references.ts`, inside `REFERENCES`

```ts
  '09-performance-optimization': [
    { title: 'Web Vitals', source: 'Google · web.dev', url: 'https://web.dev/articles/vitals', adds: 'Definitions, inclusive good thresholds and the mobile/desktop p75 assessment behind the page-experience targets.' },
    { title: 'Why lab and field data can differ', source: 'Google · web.dev', url: 'https://web.dev/articles/lab-and-field-data-differences', adds: 'Explains how controlled diagnosis and real-user observation answer different questions, and why a lab gain may not match field results.' },
    { title: 'Using EXPLAIN', source: 'PostgreSQL 18 documentation', url: 'https://www.postgresql.org/docs/18/using-explain.html', adds: 'Worked scan and plan examples, estimated versus actual execution details, and caveats for interpreting planner cost.' },
    { title: 'Next.js use cache', source: 'Next.js documentation', url: 'https://nextjs.org/docs/app/api-reference/directives/use-cache', adds: 'The version-specific Cache Components boundary, cache lifetime and tagging APIs to verify before choosing application caching.' },
    { title: 'Context propagation', source: 'OpenTelemetry documentation', url: 'https://opentelemetry.io/docs/concepts/context-propagation/', adds: 'How trace context correlates work across boundaries; a propagated trace still depends on which operations were instrumented.' },
  ],
```

- [ ] **Step 6: Generate the glossary and capture GREEN.** Run `pnpm gen:glossary`, then `pnpm exec vitest run src/features/performance/content.test.ts src/features/performance/panels.test.tsx src/lib/terms.test.ts src/lib/references.test.ts src/lib/glossary.test.ts` and `pnpm typecheck`. Save the rendered assertions and generator results.
- [ ] **Step 7: Teeth check.** In `FixesPanel`, temporarily omit the entire `RevealFacet` containing `row.risk`. Only `every candidate reveals evidence, correctness risk...` should fail in the Task 7 suite; the title/data coverage guards still pass. Restore and run GREEN again. Verify the six new terms are actually opened in the stage-level Task 8 checks, not only present in `TERMS`.
- [ ] **Step 8: Format, lint, review and commit.** Commit `feat(performance): teach evidence-based optimization candidates` with the required trailer. Include the generated glossary in the implementation commit; do not hand-edit it. Review the panels' prose with `humanizer:humanizer`, preserving all technical caveats.


```bash
pnpm exec prettier --write src/features/performance/content.ts src/features/performance/panels-measure.tsx src/features/performance/panels-diagnose.tsx src/features/performance/panels-close.tsx src/features/performance/content.test.ts src/features/performance/panels.test.tsx src/lib/terms.ts src/lib/references.ts
pnpm lint
git add src/features/performance/content.ts src/features/performance/panels-measure.tsx src/features/performance/panels-diagnose.tsx src/features/performance/panels-close.tsx src/features/performance/content.test.ts src/features/performance/panels.test.tsx src/lib/terms.ts src/lib/references.ts ../reference/glossary.md
git commit -m 'feat(performance): teach evidence-based optimization candidates' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

### Task 8: Register the complete stage and prove the browser flow

**Files:**
- Create: `web/src/features/performance/steps.ts`
- Create: `web/src/features/performance/PerformanceOptimization.tsx`
- Test: `web/src/features/performance/PerformanceOptimization.test.tsx`
- Test: `web/e2e/performance.spec.ts`
- Modify atomically: `web/src/features/stage-content.ts`, `web/src/features/step-ids.ts`, `web/src/lib/stages.ts`

**Interfaces:**
- Consumes: the twelve named panel functions from Task 7, shared Stepper and References.
- Produces: ordered `STEP_IDS`, typed `STEPS`, exported `PerformanceOptimization()` and a fully registered Stage 09.
- `COVERAGE` names canonical headings; this task observes that the actual stage renders their assigned panels and controls.

- [ ] **Step 1: Write the stage-level render tests and browser spec before registration.**

#### Test source: `web/src/features/performance/PerformanceOptimization.test.tsx`

```tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { getStage } from '@/lib/stages'
import { STAGE_CONTENT } from '@/features/stage-content'
import { STEP_IDS_BY_SLUG } from '@/features/step-ids'
import { PerformanceOptimization } from './PerformanceOptimization'
import { COVERAGE } from './content'

const IDS = ['clock', 'baseline', 'target', 'bottleneck', 'query', 'fixes', 'compare', 'record', 'followup', 'ai', 'done', 'traps']
const LABELS = ['Choose a clock', 'First baseline', 'User target', 'Find the bottleneck', 'Read the plan', 'Candidate fixes', 'Compare outcomes', 'Your baseline', 'Your follow-up', 'AI plays', 'Done', 'Traps']

beforeEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, '', '/stages/09-performance-optimization')
})

function go(id: string) {
  fireEvent.click(document.getElementById(`tab-${id}`)!)
  return screen.getByRole('tabpanel')
}

test('the rail names the outcome judgments in order rather than treating internal progress as the verdict', () => {
  render(<PerformanceOptimization />)
  const tabs = screen.getAllByRole('tab')
  expect(tabs.map((node) => node.id)).toEqual(IDS.map((id) => `tab-${id}`))
  LABELS.forEach((label, index) => expect(tabs[index].textContent).toContain(label))
})

test('ready, registration and declared ids expose the same stage', () => {
  expect(getStage('09-performance-optimization')?.ready).toBe(true)
  expect(STAGE_CONTENT['09-performance-optimization']).toBe(PerformanceOptimization)
  expect(STEP_IDS_BY_SLUG['09-performance-optimization']).toEqual(IDS)
})

test('the stage actually renders the mapped judgments and their interactive evidence', () => {
  render(<PerformanceOptimization />)
  const assigned = new Set(Object.values(COVERAGE).flat())
  expect([...assigned].filter((id) => !IDS.includes(id))).toEqual([])
  expect(within(go('clock')).getByRole('region', { name: 'Selected measurement' })).toBeTruthy()
  expect(within(go('baseline')).getByRole('button', { name: 'Commit measurement' })).toBeTruthy()
  expect(go('target').textContent).toContain('p75, separately for mobile and desktop')
  expect(within(go('bottleneck')).getAllByRole('radio')).toHaveLength(3)
  expect(go('query').querySelectorAll('[data-artifact-line]')).toHaveLength(2)
  expect(within(go('fixes')).getByRole('button', { name: 'Caching' })).toBeTruthy()
  expect(within(go('compare')).getByRole('table', { name: 'Before and after evidence' })).toBeTruthy()
  expect(within(go('record')).getAllByRole('textbox')).toHaveLength(6)
  expect(within(go('followup')).getAllByRole('textbox')).toHaveLength(5)
  expect(within(go('ai')).getByRole('button', { name: 'Copy evidence prompt' })).toBeTruthy()
  expect(within(go('done')).getAllByRole('checkbox')).toHaveLength(5)
  expect(within(go('traps')).getByRole('button', { name: 'Stopping at a faster internal span' })).toBeTruthy()
  expect(screen.getAllByRole('link')).toHaveLength(5)
})

test('first appearances open all six new terms where the reader encounters them', () => {
  render(<PerformanceOptimization />)
  const cases = [
    ['target', 'Largest Contentful Paint'], ['target', 'Interaction to Next Paint'],
    ['target', 'Cumulative Layout Shift'], ['bottleneck', 'N+1 queries'],
    ['query', 'query plan'], ['fixes', 'cache invalidation'],
  ] as const
  for (const [id, name] of cases) {
    const panel = go(id)
    fireEvent.click(within(panel).getByRole('button', { name }))
    expect(within(panel).getByRole('note').textContent).toContain('Why it matters.')
    fireEvent.keyDown(window, { key: 'Escape' })
  }
})

test('saved baseline and follow-up fields remain one record after the actual stepper switches panels', () => {
  render(<PerformanceOptimization />)
  fireEvent.change(within(go('record')).getByLabelText('Outcome and observer'), { target: { value: 'Browser start to visible stop' } })
  fireEvent.change(within(go('followup')).getByLabelText('Verdict and open gap'), { target: { value: 'Observe again next week' } })
  expect((within(go('record')).getByLabelText('Outcome and observer') as HTMLTextAreaElement).value).toBe('Browser start to visible stop')
  expect((within(go('followup')).getByLabelText('Verdict and open gap') as HTMLTextAreaElement).value).toBe('Observe again next week')
})
```

#### Test source: `web/e2e/performance.spec.ts`

```ts
import { expect, test } from '@playwright/test'
import { PERFORMANCE_KEY } from '../src/lib/performance-sheet'

const STAGE = '/stages/09-performance-optimization'

test('performance choices use native radio keys and keep the first committed answer', async ({ page }) => {
  await page.goto(`${STAGE}#baseline`, { waitUntil: 'networkidle' })
  const panel = page.locator('#panel-baseline')
  const radios = panel.getByRole('radio')
  await expect(radios).toHaveCount(2)
  await radios.nth(0).focus()
  await radios.nth(0).press('Space')
  await expect(radios.nth(0)).toBeChecked()
  await radios.nth(0).press('ArrowDown')
  await expect(radios.nth(1)).toBeChecked()
  const box = await radios.nth(1).boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(44)
  await panel.getByRole('button', { name: 'Commit measurement' }).click()
  await expect(radios.nth(0)).toBeDisabled()
  await expect(radios.nth(1)).toBeDisabled()
  await expect(panel.getByText(/Server route duration is diagnostic/)).toBeVisible()
  await expect(panel.getByText('0 of 1 choices correct')).toBeVisible()
})

test('performance worksheets support direct links, Back and reload with long literal input in both themes', async ({ page }) => {
  const literal = '<script>window.__performanceExecuted = true</script>' + 'x'.repeat(600)
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`${STAGE}#record`, { waitUntil: 'networkidle' })
    await page.evaluate(({ key, themeName }) => {
      localStorage.removeItem(key)
      localStorage.setItem('playbook:theme', JSON.stringify(themeName))
    }, { key: PERFORMANCE_KEY, themeName: theme })
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await page.getByLabel('Outcome and observer', { exact: true }).fill(literal)
    await page.locator('#tab-followup').click()
    await expect(page.locator('#panel-followup')).toBeVisible()
    await page.getByLabel('Verdict and open gap', { exact: true }).fill('More field evidence required')
    await page.goBack({ waitUntil: 'networkidle' })
    await expect(page.locator('#panel-record')).toBeVisible()
    await expect(page.getByLabel('Outcome and observer', { exact: true })).toHaveValue(literal)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.getByLabel('Outcome and observer', { exact: true })).toHaveValue(literal)
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    }
    expect(await page.evaluate(() => Reflect.get(window, '__performanceExecuted'))).toBeUndefined()
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), PERFORMANCE_KEY)
    expect(saved.outcome).toBe(literal)
    expect(saved.verdict).toBe('More field evidence required')
  }
})

test('permission failures retain the worksheet and offer manual export with zero page errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript((key) => {
    const originalRead = Storage.prototype.getItem
    const originalWrite = Storage.prototype.setItem
    Storage.prototype.getItem = function (name) {
      if (name === key) throw new DOMException('Storage denied', 'SecurityError')
      return originalRead.call(this, name)
    }
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Storage denied', 'QuotaExceededError')
      return originalWrite.call(this, name, value)
    }
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new DOMException('Clipboard denied', 'NotAllowedError')) },
    })
  }, PERFORMANCE_KEY)
  await page.goto(`${STAGE}#record`, { waitUntil: 'networkidle' })
  await page.getByLabel('Outcome and observer', { exact: true }).fill('Unsaved observer and outcome')
  await page.getByLabel('Scope', { exact: true }).fill('Unsaved scope')
  await expect(page.getByLabel('Outcome and observer', { exact: true })).toHaveValue('Unsaved observer and outcome')
  await expect(page.getByText(/Saving is unavailable/)).toBeVisible()
  await page.getByRole('button', { name: 'Copy as Markdown' }).click()
  await expect(page.getByLabel('Markdown record', { exact: true })).toHaveValue(/Unsaved observer and outcome[\s\S]*Unsaved scope/)
  await expect(page.getByRole('status', { name: 'Copy status' })).toContainText('Copy is unavailable')
  expect(errors).toEqual([])
})

test('an internal improvement requires more observation rather than a production win', async ({ page }) => {
  await page.goto(`${STAGE}#compare`, { waitUntil: 'networkidle' })
  const panel = page.locator('#panel-compare')
  await expect(panel.getByRole('table', { name: 'Before and after evidence' })).toContainText('Browser p95 and its sample are not recorded')
  await panel.getByRole('radio', { name: 'Stop this optimization pass and observe the outcome' }).check()
  await panel.getByRole('button', { name: 'Commit decision' }).click()
  await expect(panel.getByText('Needs correction')).toBeVisible()
  await expect(panel.getByText(/before claiming a production win/)).toBeVisible()
})
```

- [ ] **Step 2: Capture integration RED.** Run `pnpm exec vitest run src/features/performance/PerformanceOptimization.test.tsx`. Run `pnpm exec playwright test e2e/performance.spec.ts` before registering the stage. The current route is a placeholder, so missing baseline radios/worksheet/comparison table are the expected browser RED. Preserve actual output rather than an asserted prediction. If the build cannot start because of fonts, port conflicts or environment setup, resolve that setup and rerun; those failures do not count as RED for the feature.
- [ ] **Step 3: Write typed step declarations and the stage wrapper.**

#### Implementation source: `web/src/features/performance/steps.ts`

```ts
import type { Step } from '@/components/Stepper'
import { BaselinePanel, ClockPanel, TargetsPanel } from './panels-measure'
import { BottleneckPanel, ComparePanel, FixesPanel, QueryPanel } from './panels-diagnose'
import { AIPanel, DonePanel, FollowupPanel, RecordPanel, TrapsPanel } from './panels-close'
import { createElement } from 'react'

export const STEP_IDS = ['clock', 'baseline', 'target', 'bottleneck', 'query', 'fixes', 'compare', 'record', 'followup', 'ai', 'done', 'traps'] as const
export type StepId = (typeof STEP_IDS)[number]

export const STEPS: (Step & { id: StepId })[] = [
  { id: 'clock', label: 'Choose a clock', hint: 'Name the observer and start/stop events', content: createElement(ClockPanel) },
  { id: 'baseline', label: 'First baseline', hint: 'Record a comparable measurement before considering a fix', content: createElement(BaselinePanel) },
  { id: 'target', label: 'User target', hint: 'Choose a target with a reason', content: createElement(TargetsPanel) },
  { id: 'bottleneck', label: 'Find the bottleneck', hint: 'Read the controlled evidence without inventing a field result', content: createElement(BottleneckPanel) },
  { id: 'query', label: 'Read the plan', hint: 'Investigate the query and workload before adding an index', content: createElement(QueryPanel) },
  { id: 'fixes', label: 'Candidate fixes', hint: 'Open the evidence, cost and retest for a candidate', content: createElement(FixesPanel) },
  { id: 'compare', label: 'Compare outcomes', hint: 'Retest the same user clock and correctness', content: createElement(ComparePanel) },
  { id: 'record', label: 'Your baseline', hint: 'Save your own measurement definition and evidence', content: createElement(RecordPanel) },
  { id: 'followup', label: 'Your follow-up', hint: 'Record the change, comparison and remaining gap', content: createElement(FollowupPanel) },
  { id: 'ai', label: 'AI plays', hint: 'Draft hypotheses and verify them against raw evidence', content: createElement(AIPanel) },
  { id: 'done', label: 'Done', hint: 'Close with evidence or record the unresolved gap', content: createElement(DonePanel) },
  { id: 'traps', label: 'Traps', hint: 'Recognize claims the measurements cannot support', content: createElement(TrapsPanel) },
]
```

#### Implementation source: `web/src/features/performance/PerformanceOptimization.tsx`

```tsx
import { References } from '@/components/References'
import { Stepper } from '@/components/Stepper'
import { STEPS } from './steps'

export function PerformanceOptimization() {
  return <><Stepper steps={STEPS} /><div className="mt-12"><References slug="09-performance-optimization" /></div></>
}
```

- [ ] **Step 4: Update the three existing registries in one working-tree operation.** Add these exact imports and entries; change only Stage 09's `ready` field.

```ts
// src/features/stage-content.ts: imports and STAGE_CONTENT entry
import { PerformanceOptimization } from './performance/PerformanceOptimization'
// inside STAGE_CONTENT, between 08 and 11:
'09-performance-optimization': PerformanceOptimization,

// src/features/step-ids.ts: imports and STEP_IDS_BY_SLUG entry
import { STEP_IDS as PERFORMANCE } from './performance/steps'
// inside STEP_IDS_BY_SLUG, between 08 and 11:
'09-performance-optimization': PERFORMANCE,

// src/lib/stages.ts: existing Stage 09 object only
ready: true,
```

These are insertion fragments, not a new module. Do not apply the standalone `ready` line to another stage or commit a partial registration.

- [ ] **Step 5: Capture GREEN and inspect actual coverage.** Run `pnpm exec vitest run src/features/performance src/lib/performance-sheet.test.ts src/lib/stages.test.ts src/features/rails.test.tsx`, `pnpm typecheck` and `pnpm exec playwright test e2e/performance.spec.ts`. The browser command owns a fresh production build; ensure its server is current before accepting GREEN.
- [ ] **Step 6: Teeth check.** Change only the `compare` step's label from `'Compare outcomes'` to `'Internal progress'`. Run the entire stage render file; only `the rail names the outcome judgments...` should fail. Restore and rerun GREEN. The existing rail-id guard remains green during this mutation, showing why semantic labels have their own assertion.
- [ ] **Step 7: Format, lint, review and commit.** Commit `feat(performance): register the interactive stage` with the required trailer. This commit includes the three registries together, the wrapper, steps and browser spec. Registration is now locally ready; final gates and whole-branch review still determine readiness for integration.


```bash
pnpm exec prettier --write src/features/performance/steps.ts src/features/performance/PerformanceOptimization.tsx src/features/performance/PerformanceOptimization.test.tsx e2e/performance.spec.ts src/features/stage-content.ts src/features/step-ids.ts src/lib/stages.ts
pnpm lint
git add src/features/performance/steps.ts src/features/performance/PerformanceOptimization.tsx src/features/performance/PerformanceOptimization.test.tsx e2e/performance.spec.ts src/features/stage-content.ts src/features/step-ids.ts src/lib/stages.ts
git commit -m 'feat(performance): register the interactive stage' -m 'Co-Authored-By: Codex Opus 4.8 (1M context) <noreply@anthropic.com>'
```

## Verification (after all tasks)

- [ ] **Run a coverage walk starting from the canonical chapter.** Read `docs/09-performance-optimization.md` without using the plan's coverage table as a substitute for the chapter. Visit each actual panel and open all candidate fixes, traps, team notes and definitions. Trace every artifact and done check to visible teaching. Record missing content as review findings with severity, id and provenance. Fix Important findings test-first and repeat the relevant checks.
- [ ] **Run the full gate in order.** From `web/`, execute each command separately and capture its actual output:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:dev-console
```

Do not run production and development servers against the same `.next` output concurrently. `playwright.config.ts` may reuse a server; prove freshness through the existing global setup and start a new server if it reports stale output. Identify and stop only a server started for this round, not an unrelated process. A Google Fonts network failure or browser startup failure is environment evidence, not a product RED/GREEN. Record it and rerun the blocked check with the available authorized tooling. `pnpm test:prod` checks the deployed site and is not due before promotion.

- [ ] **Measure interacted states in both themes.** At 320, 390, 768, 1024, 1440, 1920 and 2560 px, inspect all baseline fields after commit, the assembled wrong record, every diagnostic case after commit, all disclosures open, first glossary definitions, long worksheet text and failed copy/save status. Check focus and contrast, native arrow keys, targets and horizontal overflow. The existing audit covers collapsed panel weight; measure revealed states separately rather than claiming it covers them.
- [ ] **Measure each revealed panel at 1024×768.** The judgment must remain consultable within the four-screen budget. If a panel exceeds it, measure its actual seams and split or disclose elaboration while retaining teaching. Update the stage tuple, assembly tests and any affected coverage mapping together; record the actual count instead of preserving twelve as a promise.
- [ ] **Verify outward URLs in a real browser.** Use the available browser connector and its skill to open all five curated references and source claims. This is read-only verification. Do not substitute a successful `curl` or a prior source-audit entry for the project's browser requirement. Check the SQL and field/lab interpretation against one primary source after the plan has been written, following `plans-are-unverified-101.md`.
- [ ] **Run a final independent whole-branch review.** The reviewer reads the entire diff against the execution branch's base, the approved spec, raw RED/GREEN and teeth records, gate results and canonical chapter. Require evidence per criterion. Resolve Critical/Important findings and rerun affected checks; user-deferred Minor findings retain their provenance. Report `Ready to merge` or `Ready with fixes` with freshly measured branch/tree/test/build state. This review is distinct from the task-level passes.
- [ ] **Record delivered evidence and deliberate deferrals.** Update `docs/task.md` with W-3.16's actual state and `docs/tracker.md` with commit SHAs, measured test count, review findings and gate results. Do not count W-3 as 15/18 before an approved merge. W-6 stays 20/25. Keep Deferred: W-6 caching/scaling sheets, third-party images, real order benchmarks, shared-drill repairs, shared storage-hook repairs, push and production promotion.
- [ ] **Reconcile the pending handoff content without an unauthorized merge.** Read `git show docs/2026-10-08-stage-09-port-handoff:docs/task.md`, its tracker row and KICKOFF text before editing records. Carry forward the still-accurate W-3.16 scope and historical handoff evidence, superseding only current status. Preserve older decision/history entries. The branch's contents are not adopted by merging it during execution.
- [ ] **Refresh the handoff with live state.** Query branch refs/counts, check the stale-merge phrase and tracked `reference/` file types as KICKOFF requires. Record the current branch and local-only state explicitly. Commit task/tracker/KICKOFF/report updates separately under their `docs(...)` scopes; apply `humanizer:humanizer` to prose-heavy artifacts.
- [ ] **Use `superpowers:finishing-a-development-branch` for the integration handoff.** Present the concrete reviewed branch and evidence. Ask before any merge into `develop`, quoting the AGENTS instruction that requires the separate decision. Never merge or push to `main`. After an approved merge, rerun the appropriate merged-tree checks and update the records with that merge's SHA. This plan grants no merge or push approval.

## Plan self-review and execution handoff

Before committing this plan, compare every approved-spec requirement with its owning task. Validate each complete TypeScript/TSX source block against the installed compiler using an in-memory documentation overlay, without writing the proposed files into `web/`. Validate insertion fragments in their actual registry objects. Scan for unfinished directions, missing interfaces and tests that duplicate the implementation's output instead of observing behavior. Record the validation results here only after running them.

Implementation starts after the user reviews this written plan and chooses its execution method. Present Subagent-Driven and Inline (native) options with a recommendation specific to the eight tasks. Subagent-Driven is recommended because the sheet, journey, baseline builder, diagnostic renderer and checklist can receive independent task reviews before their contracts meet in assembly. It costs additional contexts; Inline keeps the implementation in this session, with the same TDD and repository-required review evidence.


Self-review, 2026-10-08:

- Spec coverage maps to Tasks 1 through 8: user and diagnostic clocks (2), baseline and denominator (3), targets and all seven candidate fixes/eight traps (7), diagnosis/SQL/comparison (4), saved record and permission failures (1 and 5), completion/team ownership (6), AI/terms/references (7), and registration/live flow (8). The final verification steps own independent coverage, interacted-state audits, review and records.
- Thirty complete source blocks and five registry overlays passed the installed TypeScript compiler in memory. The compiler used 523 roots from the current tree plus planned files; that is validation evidence, not an expected future test count.
- The same thirty source blocks and five complete registry overlays passed ESLint with zero errors and zero warnings. The first lint pass caught two unescaped JSX apostrophes; both source blocks now use the repository's entity form.
- Self-review corrected an ES2018 regex flag before compiler validation, added explicit disabled attributes for native input assertions, used controlled-panel text for InlineCode content, replaced the serializer test's duplicated formatting logic with a literal artifact, and made theme selection persist through reload.
- The after-evidence cases stipulate sample adequacy only when it is actually part of that hypothetical case. The missing-evidence case remains unverified. No p95 or traffic count was invented to fill a record.
- Task references resolve to the eight declared tasks; the source blocks have no unfinished implementation directions. The humanizer pass found no em/en dashes or promotional filler in the plan prose. Technical source and terminal evidence were preserved.
- No proposed source files were written into web/, and no implementation tests or browser audits were executed during plan validation. Every implementation checkbox remains open.

Validation output:

```text
PASS: 30 complete planned sources and five registry edits typecheck through an in-memory overlay (523 compiler roots).
No proposed source files were written into web/. No implementation tests were executed.
PASS: 35 in-memory planned source/registry files lint with zero warnings.
```

The after-writing source check re-opened [Google's field/lab explanation](https://web.dev/articles/lab-and-field-data-differences), [PostgreSQL 18 EXPLAIN](https://www.postgresql.org/docs/18/using-explain.html) and [Next.js updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag). The planned text retains the field/lab distinction, query-plan limitations and Server Action scope. These read-only source checks are separate from the real-browser URL verification due during execution.
