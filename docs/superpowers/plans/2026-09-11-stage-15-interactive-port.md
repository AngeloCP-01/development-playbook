# Stage 15 (Observability) Interactive Port

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the 853-line doc (`docs/15-observability.md`) into an interactive stage at `web/src/features/observability/` with 10 steps, four scored drills through one shared `Drill` component, five annotated artifacts, 6 AI plays, 15 traps, and a 15-item persisted checklist.

**Architecture:** Ten-step Stepper. Panels are split across two files by phase — `panels-collect.tsx` (three, errors, logs, where, signals: what to collect) and `panels-act.tsx` (health, alerts, silence, ai, done: what to do with it) — assembled in `Observability.tsx`. Every drill is `<Drill>` with a dataset; every artifact is `<AnnotatedArtifact>` inside a numbered `<Figure>`; everything else is `RevealList`, `Prose`, `Callout`. The stage follows the exact pattern established by stages 12–14.

**Tech Stack:** Next.js 16, React 19, TypeScript, vitest, @testing-library/react, Tailwind v4

**Spec:** `docs/superpowers/specs/2026-09-11-stage-15-interactive-port-design.md`

## Global Constraints

- TDD: every data file gets a failing test before the data is written; every component gets a render test. Paste the RED and GREEN output in the task report and say why RED failed.
- All data is pinned against `docs/15-observability.md` via the `doc-source.ts` helpers (`section`, `h2`, `flat`, `fences`). `fences()` indexes, measured 2026-09-11: `[2]` scrubber, `[3]` logger, `[6]` health, `[8]` canary, `[9]` heartbeat. An artifact test compares `lines.map(l => l.text).join('\n')` to the whole fence with `toBe`, never `toContain`.
- Three-file registration (`stages.ts` + `stage-content.ts` + `step-ids.ts`) is one atomic commit, in Task 10 only. Nothing before it flips `ready`.
- `InlineCode` renders backtick spans in data strings; use backticks in data wherever the doc uses code formatting.
- Drill verdicts use `go`/`danger`; `brand` is attention only. No template-literal Tailwind classes — every class is a complete literal.
- Every `<Term>` gets an explicit `{' '}` on the side that touches prose text.
- **One deviation from the spec, decided here:** the five artifacts are wrapped in numbered `Figure`s (1–5) the way stage 14 wraps its artifact, and the restart-vs-routing grid is Figure 6. The spec said one figure; `PATTERNS.md` says wrap every diagram, and stage 14 is the precedent.
- Run all commands from `web/`. Commit after each task with a conventional-commit message and the trailer:
  ```
  Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_015NS5kdCoqBTn5h7WvyesLg
  ```
- Branch: `feat/stage-15-observability-port`, cut from `develop` before Task 1. `git branch --show-current` before every edit.

---

### Task 1: Data scaffolding — doc-source, steps, traps, checklist, prose pins

**Files:**
- Create: `web/src/features/observability/doc-source.ts`
- Create: `web/src/features/observability/steps.ts`, `steps.test.ts`
- Create: `web/src/features/observability/traps.ts`, `traps.test.ts`
- Create: `web/src/features/observability/checklist.ts`, `checklist.test.ts`
- Create: `web/src/features/observability/prose.test.ts`

**Interfaces:**
- Produces: `STEP_IDS` (10-element `as const` tuple), `StepId`; `TRAPS: Trap[]` (15); `DONE: DoneItem[]` (15), `ARTIFACT_LIST: string[]` (10), `TEAM: TeamNote[]` (6); `DOC`, `section`, `h2`, `flat`, `fences` from `doc-source.ts`.

- [ ] **Step 1: Create `doc-source.ts`**

```ts
// web/src/features/observability/doc-source.ts
import { docSource } from '@/test/doc-source'

export const { DOC, section, h2, flat, fences } = docSource(
  'docs/15-observability.md',
)
```

- [ ] **Step 2: Write the failing steps test**

```ts
// web/src/features/observability/steps.test.ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('observability steps', () => {
  test('ten steps in exact order', () => {
    expect(STEP_IDS).toEqual([
      'three', 'errors', 'logs', 'where', 'signals',
      'health', 'alerts', 'silence', 'ai', 'done',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
```

- [ ] **Step 3: Run it — expect FAIL** (`Cannot find module './steps'`)

Run: `pnpm vitest run src/features/observability/steps.test.ts`

- [ ] **Step 4: Create `steps.ts`**

```ts
// web/src/features/observability/steps.ts
export const STEP_IDS = [
  'three',
  'errors',
  'logs',
  'where',
  'signals',
  'health',
  'alerts',
  'silence',
  'ai',
  'done',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 5: Run it — expect PASS (2 tests)**

- [ ] **Step 6: Write the failing traps test**

```ts
// web/src/features/observability/traps.test.ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('observability traps data', () => {
  const src = h2('Traps')

  test('fifteen traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(15)
    expect(TRAPS).toHaveLength(15)
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

  test('body pin: heartbeat in a finally block', () => {
    expect(flat(src)).toContain(
      flat('It reports success for a run that threw'),
    )
  })

  test('body pin: health checks wired to the thing that restarts you', () => {
    expect(flat(src)).toContain(
      flat('restart healthy instances during a database outage'),
    )
  })

  test('body pin: monitoring that only fires on events', () => {
    expect(flat(src)).toContain(
      flat('Check for missing expected events as well as failures'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(8)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(15)
    }
  })
})
```

- [ ] **Step 7: Run it — expect FAIL** (`Cannot find module './traps'`)

- [ ] **Step 8: Create `traps.ts`** — titles are the doc's bold leads with the trailing period removed; bodies are the sentences that follow, verbatim.

```ts
// web/src/features/observability/traps.ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'alerting-on-everything',
    title: 'Alerting on everything',
    body: 'Guarantees you will ignore alerts, including the important one. Fewer, sharper alerts beat comprehensive coverage.',
  },
  {
    id: 'causes-not-symptoms',
    title: 'Alerting on causes, not symptoms',
    body: 'High CPU is not a problem. Users unable to check out is.',
  },
  {
    id: 'health-checks-that-check-nothing',
    title: 'Health checks that check nothing',
    body: 'A hardcoded `200 OK` tells you the process is running.',
  },
  {
    id: 'only-monitoring-from-inside',
    title: 'Only monitoring from inside',
    body: 'You will not detect DNS failures, regional outages, or certificate expiry.',
  },
  {
    id: 'unstructured-logs',
    title: 'Unstructured logs',
    body: 'Fine at ten lines a day, useless at ten thousand.',
  },
  {
    id: 'logging-secrets',
    title: 'Logging secrets',
    body: 'Retained for a long time, visible to everyone with account access, and shipped to a third party.',
  },
  {
    id: 'averages-instead-of-percentiles',
    title: 'Averages instead of percentiles',
    body: 'The average is always fine.',
  },
  {
    id: 'no-baseline',
    title: 'No baseline',
    body: 'Without knowing normal, every number is unreadable during an incident, which is exactly when you need to read it fastest.',
  },
  {
    id: 'dashboards-nobody-looks-at',
    title: 'Dashboards nobody looks at',
    body: 'If it is not glanceable in one screen, it will not be glanced at.',
  },
  {
    id: 'email-alerts',
    title: 'Email alerts for urgent problems',
    body: 'Read tomorrow morning. The outage was tonight.',
  },
  {
    id: 'only-fires-on-events',
    title: 'Monitoring that only fires on events',
    body: 'The job that stopped running, the orders that stopped arriving, and the alert that stopped being delivered all produce silence. Check for missing expected events as well as failures.',
  },
  {
    id: 'heartbeat-in-finally',
    title: 'A heartbeat in a `finally` block',
    body: 'It reports success for a run that threw, so your monitor tells you the job worked when it did not.',
  },
  {
    id: 'no-retention-policy',
    title: 'Logs with no retention policy',
    body: 'CloudWatch Logs retains them indefinitely by default. On a container platform, stdout may disappear before you need it. Choose how long the destination keeps the data.',
  },
  {
    id: 'alert-never-seen-arrive',
    title: 'An alert nobody has ever seen arrive',
    body: 'A configured alert can still route to a dead phone number. Fire it deliberately and confirm delivery.',
  },
  {
    id: 'health-checks-wired-to-restart',
    title: 'Health checks wired to the thing that restarts you',
    body: "Point a platform's liveness probe at a check that fails when the database blinks and the platform can restart healthy instances during a database outage.",
  },
]
```

- [ ] **Step 9: Run it — expect PASS (7 tests)**

- [ ] **Step 10: Write the failing checklist test**

```ts
// web/src/features/observability/checklist.test.ts
import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('observability checklist data', () => {
  test('done items match doc checkboxes', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(checks).toHaveLength(15)
    expect(DONE).toHaveLength(checks.length)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('artifacts match doc list', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(10)
    expect(ARTIFACT_LIST).toHaveLength(items.length)
  })

  test('done pin: withholding a test ping', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('watched the monitor page you by withholding a test ping'),
    )
  })

  test('done pin: liveness and readiness are separate endpoints', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Liveness and readiness are separate endpoints'),
    )
  })

  // I3 from the fix wave: the blanket ban was narrowed. The checklist must
  // carry the narrowed wording, not the old one.
  test('done pin: personal-data rule is the narrowed one', () => {
    const item = DONE.find((d) => d.id === 'no-secrets-or-personal-data')
    expect(item?.label).toMatch(/opaque identifiers/)
    expect(item?.label).not.toMatch(/^No secrets or personal data in/)
  })

  test('team notes match doc scaling bullets', () => {
    const src = h2('Scaling to a team')
    const boldLeads = src.match(/^- \*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(6)
    expect(TEAM).toHaveLength(boldLeads.length)
  })

  test('unique team IDs', () => {
    const ids = TEAM.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('team notes have content', () => {
    for (const n of TEAM) {
      expect(n.title.length, `${n.id} title`).toBeGreaterThan(5)
      expect(n.body.length, `${n.id} body`).toBeGreaterThan(10)
    }
  })
})
```

- [ ] **Step 11: Run it — expect FAIL** (`Cannot find module './checklist'`)

- [ ] **Step 12: Create `checklist.ts`**

```ts
// web/src/features/observability/checklist.ts
/**
 * Source: `docs/15-observability.md`, "## Artifacts", "## Definition of
 * done", and "## Scaling to a team". Same shape as stage 14's `checklist.ts`:
 * `DONE` keyed on stable ids (position-independent), `ARTIFACT_LIST`, and
 * `TEAM` notes for the checklist's disclosure.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'errors-reach-sentry',
    label: 'Errors reach Sentry with readable stack traces and user context',
  },
  {
    id: 'no-secrets-or-personal-data',
    label:
      'No secrets, and no personal data beyond the opaque identifiers this stage allows — each one minimized to what a fix needs',
  },
  {
    id: 'know-how-to-delete',
    label:
      "You know how to delete a person's data from your error tracker and your logs, and have checked the retention window on both",
  },
  {
    id: 'key-events-structured',
    label: 'Key events logged as structured objects',
  },
  {
    id: 'health-check-verifies-db',
    label: 'Health check verifies the database, not just the process',
  },
  {
    id: 'external-uptime-active',
    label: 'External uptime monitoring is active',
  },
  {
    id: 'every-alert-actionable',
    label: 'Every configured alert is one you would act on at 2am',
  },
  {
    id: 'alerts-interrupt',
    label: 'Alerts route somewhere that interrupts you',
  },
  {
    id: 'test-alert-fired',
    label:
      'At least one alert has been fired deliberately and confirmed to arrive',
  },
  {
    id: 'baselines-documented',
    label: 'Baselines documented for error rate and p95 latency',
  },
  {
    id: 'deploy-markers',
    label: 'Dashboard shows deploy markers',
  },
  {
    id: 'heartbeat-on-every-job',
    label:
      'Every scheduled job pings a heartbeat on success, and you have watched the monitor page you by withholding a test ping',
  },
  {
    id: 'request-id-joins',
    label: "A single request id joins a request's log line to its error report",
  },
  {
    id: 'retention-chosen',
    label: 'Log retention is a number you chose, and you know what it costs',
  },
  {
    id: 'liveness-readiness-separate',
    label:
      "Liveness and readiness are separate endpoints, and the platform's restart trigger uses the one that does not check dependencies",
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'define-slo',
    title: 'Define an SLO, and the error budget that follows from it',
    body: 'For a request-based SLO, "99.9% of requests succeed" allows 0.1% of requests to fail during the measurement window. For a time-based uptime SLO, 99.9% allows 43.2 minutes of unavailability in 30 days. Both are error budgets, but their units are different. Exceeding it is the rule that says to stop shipping features and fix reliability.',
  },
  {
    id: 'consider-opentelemetry',
    title: 'Consider OpenTelemetry when instrumentation needs to work across backends',
    body: 'It provides vendor-neutral APIs, SDKs and tools for generating, collecting and exporting telemetry. Your backend still stores the data and supplies dashboards. A solo service can start with its platform integration; revisit this when multiple services or a provider change make that integration a constraint.',
  },
  {
    id: 'on-call-rotation',
    title: 'Set up on-call rotation',
    body: 'With a real escalation path, once the team can sustain it.',
  },
  {
    id: 'alerts-need-an-owner',
    title: 'Alerts need an owner',
    body: 'Unowned alerts are ignored by everyone, each assuming someone else has it.',
  },
  {
    id: 'review-alert-noise-monthly',
    title: 'Review alert noise monthly, as a team',
    body: 'The monthly review is where ownership gets assigned or the alert gets deleted.',
  },
  {
    id: 'add-distributed-tracing',
    title: 'Add distributed tracing',
    body: 'Once requests cross service boundaries and you cannot follow them in one place.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'Sentry with user context, breadcrumbs, and scrubbing configured',
  'Structured logging with consistent event names',
  '`/api/health` checking real dependencies, and a separate liveness endpoint that does not',
  'External uptime monitoring on a real user path',
  'A small set of actionable alerts routed to a channel that interrupts you',
  'One dashboard with the four signals and deploy markers',
  'A heartbeat monitor on every scheduled job, alerting on a missing ping',
  'A read-only canary endpoint for an authenticated service',
  'A retention policy on every log group or drain, chosen rather than defaulted',
  'A request id on request-scoped log lines and matching error-tracker events',
]
```

- [ ] **Step 13: Run it — expect PASS (9 tests)**

- [ ] **Step 14: Write `prose.test.ts`** — one pin per step's key claim, so a panel that quotes it has a doc anchor. These pass immediately (they pin the doc, not the app — `quality-gates-101.md` says why that is fine for a *prose* pin and why the render tests in Tasks 5, 6 and 10 are the ones that prove the app).

```ts
// web/src/features/observability/prose.test.ts
import { describe, expect, test } from 'vitest'
import { flat, section } from './doc-source'

describe('observability prose pins', () => {
  test('three — traces: you will know when you need them', () => {
    expect(flat(section('Three things, in order of value'))).toContain(
      flat('You will know when you need them'),
    )
  })

  test('errors — an opaque id resolves to a person in your own database', () => {
    expect(flat(section('Errors that are actually useful'))).toContain(
      flat('resolves to a person in your own database'),
    )
  })

  test('errors — addContext is a separate door', () => {
    expect(flat(section('Errors that are actually useful'))).toContain(
      flat('`addContext` is a separate door'),
    )
  })

  test('logs — levels are a filter, not a mood', () => {
    expect(flat(section('Structured logs'))).toContain(
      flat('Levels are a filter, not a mood'),
    )
  })

  test('where — stdout is a stream, not storage', () => {
    expect(flat(section('Where logs go, and what they cost'))).toContain(
      flat('stdout is a stream, not storage'),
    )
  })

  test('signals — error rate does not come from your error tracker', () => {
    expect(flat(section('The four signals'))).toContain(
      flat('Error *rate* does not come from your error tracker'),
    )
  })

  test('health — a restart cannot fix a database', () => {
    expect(flat(section('Health checks'))).toContain(
      flat('a restart cannot fix a database'),
    )
  })

  test('alerts — every alert must be actionable', () => {
    expect(flat(section('Alerts you will not learn to ignore'))).toContain(
      flat('every alert must be actionable'),
    )
  })

  test('silence — absence of a signal is not evidence of health', () => {
    expect(flat(section('When nothing is reporting'))).toContain(
      flat('Absence of a signal is not evidence of health'),
    )
  })

  test('jobs — withhold a ping on purpose', () => {
    expect(flat(section('Jobs that nobody watches'))).toContain(
      flat('Withhold a ping on purpose and confirm the page arrives'),
    )
  })

  test('dashboards — a deploy marker is an event with a timestamp', () => {
    expect(flat(section('Dashboards'))).toContain(
      flat('It is an **event with a timestamp**'),
    )
  })
})
```

- [ ] **Step 15: Run the whole folder — expect PASS**

Run: `pnpm vitest run src/features/observability`
Expected: 4 files, 29 tests passing.

- [ ] **Step 16: Commit**

```bash
git add src/features/observability/
git commit -m "feat(observability): scaffold stage 15 data — steps, traps, checklist, prose pins"
```

---

### Task 2: Drill datasets — alert triage, log levels, silence, scrubber

**Files:**
- Create: `web/src/features/observability/drill-types.ts`
- Create: `web/src/features/observability/alert-triage.ts`, `alert-triage.test.ts`
- Create: `web/src/features/observability/log-levels.ts`, `log-levels.test.ts`
- Create: `web/src/features/observability/silence.ts`, `silence.test.ts`
- Create: `web/src/features/observability/scrubber.ts`, `scrubber.test.ts`

**Interfaces:**
- Consumes: `flat`, `section` from Task 1's `doc-source.ts`.
- Produces: `DrillOption`, `DrillRow` types; four modules each exporting `QUESTION: string`, `SUBTITLE: string`, `OPTIONS: DrillOption[]`, `ROWS: DrillRow[]`. Task 5's `Drill` takes exactly these four as props.

- [ ] **Step 1: Create `drill-types.ts`**

```ts
// web/src/features/observability/drill-types.ts
/**
 * The shape every drill in this stage shares. Four datasets, one component
 * (`Drill.tsx`). `prompt` and `why` go through `InlineCode`, so they carry
 * backticks where the doc does.
 */
export type DrillOption = { id: string; label: string }

export type DrillRow = {
  id: string
  /** The situation, described — never the doc's own verdict on it. */
  prompt: string
  /** A `DrillOption.id`. */
  answer: string
  /** A sentence from the doc, pinned in the dataset's test. */
  why: string
}
```

- [ ] **Step 2: Write the failing alert-triage test**

```ts
// web/src/features/observability/alert-triage.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS, QUESTION } from './alert-triage'
import { flat, section } from './doc-source'

describe('alert triage drill data', () => {
  // Emphasis stripped: the doc bolds "hard ceiling" and italicises "before",
  // and a `why` rendered through InlineCode would show the asterisks.
  const src = flat(section('Alerts you will not learn to ignore')).replace(
    /\*/g,
    '',
  )

  test('two options: page or do not', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual(['page', 'no-page'])
  })

  test('eleven rows: eight worth alerting on, three not', () => {
    expect(ROWS).toHaveLength(11)
    expect(ROWS.filter((r) => r.answer === 'page')).toHaveLength(8)
    expect(ROWS.filter((r) => r.answer === 'no-page')).toHaveLength(3)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every why is a sentence from the doc', () => {
    for (const r of ROWS) {
      expect(src, `${r.id} why`).toContain(flat(r.why))
    }
  })

  // The two rows the section's argument turns on.
  test('the new-signature row pages, and its why is the stated exception', () => {
    const row = ROWS.find((r) => r.id === 'new-signature')
    expect(row?.answer).toBe('page')
    expect(row?.why).toMatch(/one exception/)
  })

  test('the connection-pool row pages on the hard-ceiling rule', () => {
    const row = ROWS.find((r) => r.id === 'connections-near-limit')
    expect(row?.answer).toBe('page')
    expect(row?.why).toMatch(/hard ceiling/)
  })

  test('the question is a question', () => {
    expect(QUESTION).toMatch(/\?$/)
  })
})
```

- [ ] **Step 3: Run it — expect FAIL** (`Cannot find module './alert-triage'`)

- [ ] **Step 4: Create `alert-triage.ts`** — prompts describe the situation without quoting the doc's verdict; `why` quotes the doc.

```ts
// web/src/features/observability/alert-triage.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### Alerts you will not learn to
 * ignore" — the "Worth alerting on" (8) and "Not worth alerting on" (3)
 * lists. The stage's central exercise: is this alert one you would act on?
 */
export const QUESTION = 'Would you page on this?'
export const SUBTITLE =
  'Eleven candidates. Commit before the verdict shows — the only rule that matters is whether you would act on it at 2am.'

export const OPTIONS: DrillOption[] = [
  { id: 'page', label: 'Page me' },
  { id: 'no-page', label: 'Do not page' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'error-rate-above-baseline',
    prompt: 'The error rate has been above your written-down baseline for six minutes.',
    answer: 'page',
    why: 'Error rate above baseline for 5+ minutes',
  },
  {
    id: 'new-signature',
    prompt: 'One error, seen once, with a stack trace you have never seen before — ten minutes after a deploy.',
    answer: 'page',
    why: 'This is the one exception to the rule below, and it earns it: a novel error after a deploy is the highest-information event your system produces.',
  },
  {
    id: 'unreachable-from-outside',
    prompt: 'Your external monitor cannot reach the site. Internal dashboards look normal.',
    answer: 'page',
    why: 'The site being unreachable from outside',
  },
  {
    id: 'p95-doubled',
    prompt: 'p95 latency doubled twenty minutes ago and has stayed there.',
    answer: 'page',
    why: 'p95 latency doubling and staying there',
  },
  {
    id: 'payment-failures-spiking',
    prompt: 'Payment failures are running at five times their usual rate.',
    answer: 'page',
    why: 'Payment or auth failures spiking',
  },
  {
    id: 'connections-near-limit',
    prompt: 'Database connections are at 92 of a 100-connection pool. Every request is still succeeding.',
    answer: 'page',
    why: 'a resource with a hard ceiling that does not recover on its own — a connection pool, a disk, an API quota — is worth alerting on before it becomes a symptom, because crossing it is a cliff rather than a slope.',
  },
  {
    id: 'job-failing-repeatedly',
    prompt: 'The nightly reconciliation job has thrown on each of its last four runs.',
    answer: 'page',
    why: 'A background job failing repeatedly',
  },
  {
    id: 'traffic-near-zero',
    prompt: 'Requests per minute dropped to almost nothing at 2pm on a weekday. Nothing is erroring.',
    answer: 'page',
    why: 'Traffic falling to near zero outside a pattern you recognise — the fastest signal that something upstream of your application is broken',
  },
  {
    id: 'single-known-error',
    prompt: 'One occurrence of an error you have seen forty times this month.',
    answer: 'no-page',
    why: 'A single occurrence of an error signature you have seen before',
  },
  {
    id: 'cpu-spike-self-resolved',
    prompt: 'CPU hit 85% for ninety seconds and came back down. Latency never moved.',
    answer: 'no-page',
    why: 'CPU spikes that self-resolve',
  },
  {
    id: 'resolves-itself-for-months',
    prompt: 'A warning that has fired and cleared on its own every Sunday night for four months.',
    answer: 'no-page',
    why: 'Anything that has resolved itself every time for months',
  },
]
```

- [ ] **Step 5: Run it — expect PASS (7 tests)**

- [ ] **Step 6: Write the failing log-levels test**

```ts
// web/src/features/observability/log-levels.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS } from './log-levels'
import { flat, section } from './doc-source'

describe('log level drill data', () => {
  const src = flat(section('Structured logs'))

  test('five options in the ladder order', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual([
      'debug', 'info', 'warn', 'error', 'fatal',
    ])
  })

  test('six rows, every level used at least once', () => {
    expect(ROWS).toHaveLength(6)
    const used = new Set(ROWS.map((r) => r.answer))
    for (const o of OPTIONS) expect(used.has(o.id), o.id).toBe(true)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every why is a sentence from the doc', () => {
    for (const r of ROWS) {
      expect(src, `${r.id} why`).toContain(flat(r.why))
    }
  })

  // The two cases the doc works through by name.
  test('a card decline is info, not error', () => {
    expect(ROWS.find((r) => r.id === 'card-declined')?.answer).toBe('info')
  })

  test('the health check dependency failure is warn', () => {
    expect(ROWS.find((r) => r.id === 'health-dependency')?.answer).toBe('warn')
  })
})
```

- [ ] **Step 7: Run it — expect FAIL** (`Cannot find module './log-levels'`)

- [ ] **Step 8: Create `log-levels.ts`**

```ts
// web/src/features/observability/log-levels.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### Structured logs" — the level
 * ladder table and "Levels are a filter, not a mood." Six events, one level
 * each. The `why` for each is the ladder row or the doc's own worked case.
 */
export const QUESTION = 'Which level does this line get?'
export const SUBTITLE =
  'Choose the level by the action it warrants, not by how it feels. `error` is the level your alerting reads.'

export const OPTIONS: DrillOption[] = [
  { id: 'debug', label: 'debug' },
  { id: 'info', label: 'info' },
  { id: 'warn', label: 'warn' },
  { id: 'error', label: 'error' },
  { id: 'fatal', label: 'fatal' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'card-declined',
    prompt: 'A customer\'s card was declined by the payment provider. The app showed them the retry screen.',
    answer: 'info',
    why: 'A declined card is a routine business outcome and not a fault: it is `info`.',
  },
  {
    id: 'health-dependency',
    prompt: 'The health check\'s `SELECT 1` timed out. The endpoint returned `503` as designed.',
    answer: 'warn',
    why: 'Not a fault, so not `error` — but the reason is the only evidence of how, and a bare `catch {}` destroys it.',
  },
  {
    id: 'provider-threw',
    prompt: 'The call to the payment provider threw an unexpected exception and the request failed.',
    answer: 'error',
    why: 'A fault you would investigate; a common input to alerts',
  },
  {
    id: 'port-in-use',
    prompt: 'On startup, the process could not bind its port and is about to exit.',
    answer: 'fatal',
    why: 'A fault that prevents the process continuing',
  },
  {
    id: 'query-timing',
    prompt: 'Per-query timing for every SQL statement, useful while tuning an index locally.',
    answer: 'debug',
    why: 'Diagnostic detail, normally disabled in production',
  },
  {
    id: 'upstream-200-with-failure',
    prompt: 'An external API returned `200` with `{"success": false}` in the body. The app handled it and moved on.',
    answer: 'warn',
    why: 'An unexpected condition the application handled',
  },
]
```

- [ ] **Step 9: Run it — expect PASS (6 tests)**

- [ ] **Step 10: Write the failing silence test**

```ts
// web/src/features/observability/silence.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS } from './silence'
import { flat, section } from './doc-source'

describe('silence drill data', () => {
  const src = flat(section('When nothing is reporting'))

  test('two options', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual(['seen', 'unseen'])
  })

  test('six rows, exactly one the tracker sees', () => {
    expect(ROWS).toHaveLength(6)
    expect(ROWS.filter((r) => r.answer === 'seen')).toHaveLength(1)
  })

  // Not last: a reader who has answered "unseen" five times in a row is not
  // exercising judgment on the sixth. The control sits early.
  test('the control row is in the first three', () => {
    const idx = ROWS.findIndex((r) => r.answer === 'seen')
    expect(idx).toBeGreaterThanOrEqual(0)
    expect(idx).toBeLessThan(3)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every unseen why is a sentence from the silence section', () => {
    for (const r of ROWS.filter((r) => r.answer === 'unseen')) {
      expect(src, `${r.id} why`).toContain(flat(r.why))
    }
  })
})
```

- [ ] **Step 11: Run it — expect FAIL** (`Cannot find module './silence'`)

- [ ] **Step 12: Create `silence.ts`**

```ts
// web/src/features/observability/silence.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### When nothing is reporting" — the
 * five bulleted failures that raise no exception, plus one control the
 * tracker does see, so the answer is not always the same and the reader
 * has to read. The control sits second, not last.
 */
export const QUESTION = 'Does your error tracker see this?'
export const SUBTITLE =
  'Six failures. Some reach Sentry; some produce nothing at all. The answers are not all the same.'

export const OPTIONS: DrillOption[] = [
  { id: 'seen', label: 'Sentry sees it' },
  { id: 'unseen', label: 'Nothing is reported' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'swallowed-catch',
    prompt: 'The database is down. The code that calls it has `catch {}` with nothing inside.',
    answer: 'unseen',
    why: 'A bare `catch {}` swallows the reason: the dependency is down, the code knows, and why is gone forever.',
  },
  {
    id: 'unhandled-throw',
    prompt: 'A route handler throws a `TypeError` that nothing catches. The user gets a 500.',
    answer: 'seen',
    why: 'Out of the box, Sentry tells you an exception occurred — this is the case it was built for, and the one the rest of this list is not.',
  },
  {
    id: 'declined-card',
    prompt: 'A card is declined. The app logs `invoice.payment_declined` and shows the retry screen.',
    answer: 'unseen',
    why: 'is a business failure that throws nothing. So is every handled `4xx`.',
  },
  {
    id: 'third-party-200',
    prompt: 'A third-party API returns `200` with `{"status": "failed"}` in the body.',
    answer: 'unseen',
    why: 'Your HTTP client is satisfied. Your integration is not.',
  },
  {
    id: 'client-side',
    prompt: 'A JavaScript error in the browser stops the checkout button working. No request is ever made.',
    answer: 'unseen',
    why: 'It never reached your server, so your server has nothing to say about it.',
  },
  {
    id: 'dropped-by-config',
    prompt: 'An error fires inside a batch loop after the month\'s Sentry quota ran out.',
    answer: 'unseen',
    why: 'sampling, a quota, or the `beforeSend` you just wrote.',
  },
]
```

- [ ] **Step 13: Run it — expect PASS (5 tests)**

- [ ] **Step 14: Write the failing scrubber test**

```ts
// web/src/features/observability/scrubber.test.ts
import { describe, expect, test } from 'vitest'
import { OPTIONS, ROWS } from './scrubber'
import { flat, section } from './doc-source'

describe('scrubber drill data', () => {
  const errors = flat(section('Errors that are actually useful'))
  const logs = flat(section('Structured logs'))

  test('two options', () => {
    expect(OPTIONS.map((o) => o.id)).toEqual(['scrubbed', 'reaches'])
  })

  test('six rows, three scrubbed, three that get through', () => {
    expect(ROWS).toHaveLength(6)
    expect(ROWS.filter((r) => r.answer === 'scrubbed')).toHaveLength(3)
    expect(ROWS.filter((r) => r.answer === 'reaches')).toHaveLength(3)
  })

  test('unique ids, every answer is an option', () => {
    const ids = ROWS.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    const optionIds = new Set(OPTIONS.map((o) => o.id))
    for (const r of ROWS) expect(optionIds.has(r.answer), r.id).toBe(true)
  })

  test('every why is a sentence from the doc', () => {
    for (const r of ROWS) {
      expect(errors + ' ' + logs, `${r.id} why`).toContain(flat(r.why))
    }
  })

  // The row that carries the lesson the whole-branch review found: beforeSend
  // never sees a log line, and the logger needs its own redaction.
  test('the log-line row gets through beforeSend, and says why', () => {
    const row = ROWS.find((r) => r.id === 'pino-log-line')
    expect(row?.answer).toBe('reaches')
    expect(row?.why).toMatch(/does nothing to log output/)
  })
})
```

- [ ] **Step 15: Run it — expect FAIL** (`Cannot find module './scrubber'`)

- [ ] **Step 16: Create `scrubber.ts`**

```ts
// web/src/features/observability/scrubber.ts
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Source: `docs/15-observability.md`, "### Errors that are actually useful"
 * (the `beforeSend` fence and the "separate door" paragraph) and "###
 * Structured logs" ("`beforeSend` protects error reports; it does nothing
 * to log output"). Six values; does the scrubber shown in this step catch
 * each one?
 */
export const QUESTION = 'Does `beforeSend` scrub this before it leaves?'
export const SUBTITLE =
  'The scrubber above covers three surfaces. Six values are on their way out — which ones does it reach?'

export const OPTIONS: DrillOption[] = [
  { id: 'scrubbed', label: 'Scrubbed' },
  { id: 'reaches', label: 'Reaches Sentry' },
]

export const ROWS: DrillRow[] = [
  {
    id: 'authorization-header',
    prompt: 'The request\'s `Authorization: Bearer …` header.',
    answer: 'scrubbed',
    why: 'Sentry captures request headers by default, and that is where credentials live.',
  },
  {
    id: 'form-body',
    prompt: 'The body of the form post that was in flight when the error threw.',
    answer: 'scrubbed',
    why: 'It captures bodies too. A form post carries whatever the form carried.',
  },
  {
    id: 'exception-message',
    prompt: 'An exception whose message contains `postgresql://app:hunter2@db/app`.',
    answer: 'scrubbed',
    why: 'an exception message is free text: a failed query prints the connection string, password included.',
  },
  {
    id: 'add-context-card',
    prompt: '`Sentry.setContext("checkout", { card: "4242…" })`, called from your own code.',
    answer: 'reaches',
    why: '`addContext` is a separate door: `Sentry.setContext` accepts whatever you hand it, and the deny-list above never runs over it.',
  },
  {
    id: 'breadcrumb-token',
    prompt: 'A breadcrumb your code added that includes a session token in its message.',
    answer: 'reaches',
    why: 'Verify with a synthetic secret sent through every surface you actually use — context, breadcrumbs, tags — not only the request and exception fields `beforeSend` covers.',
  },
  {
    id: 'pino-log-line',
    prompt: 'A `logger.warn` line whose message includes the same connection string.',
    answer: 'reaches',
    why: '`beforeSend` protects error reports; it does nothing to log output.',
  },
]
```

- [ ] **Step 17: Run the four drill tests — expect PASS (23 tests)**

Run: `pnpm vitest run src/features/observability/alert-triage.test.ts src/features/observability/log-levels.test.ts src/features/observability/silence.test.ts src/features/observability/scrubber.test.ts`

- [ ] **Step 18: Commit**

```bash
git add src/features/observability/
git commit -m "feat(observability): four drill datasets pinned against the doc"
```

---

### Task 3: Artifacts — five annotated fences

**Files:**
- Create: `web/src/features/observability/artifacts.ts`, `artifacts.test.ts`

**Interfaces:**
- Consumes: `Artifact` from `@/components/artifact`; `fences` from Task 1.
- Produces: `SCRUBBER`, `LOGGER`, `HEALTH`, `CANARY`, `HEARTBEAT: Artifact`.

- [ ] **Step 1: Write the failing test**

```ts
// web/src/features/observability/artifacts.test.ts
import { describe, expect, test } from 'vitest'
import type { Artifact } from '@/components/artifact'
import { CANARY, HEALTH, HEARTBEAT, LOGGER, SCRUBBER } from './artifacts'
import { fences } from './doc-source'

const text = (a: Artifact) => a.lines.map((l) => l.text).join('\n')

// Indexes measured against the doc on 2026-09-11. A fence added above one
// of these shifts the index and fails the whole-block comparison, which is
// the point: `toBe` against the whole fence, never `toContain`, so a dropped
// last line fails too.
const CASES: [string, Artifact, number, RegExp][] = [
  ['scrubber', SCRUBBER, 2, /value\.value = redact\(value\.value\)/],
  ['logger', LOGGER, 3, /error: \(err: Error\) => \(\{/],
  ['health', HEALTH, 6, /await Promise\.race\(\[/],
  ['canary', CANARY, 8, /\{ ok: false \}, \{ status: 503 \}/],
  ['heartbeat', HEARTBEAT, 9, /await fetch\(process\.env\.HEARTBEAT_URL!/],
]

describe('observability artifacts', () => {
  const all = fences()

  for (const [name, artifact, index, pivotRe] of CASES) {
    describe(name, () => {
      test('quotes its fence line for line', () => {
        expect(text(artifact)).toBe(all[index])
      })

      test('is TypeScript', () => {
        expect(artifact.language).toBe('ts')
      })

      test('has exactly one pivot, on the decision line', () => {
        const pivots = artifact.lines.filter((l) => l.pivot)
        expect(pivots).toHaveLength(1)
        expect(pivots[0].text).toMatch(pivotRe)
      })

      test('every note is non-empty and sits on a non-blank line', () => {
        for (const l of artifact.lines) {
          if (l.note !== undefined) {
            expect(l.note.length, l.text).toBeGreaterThan(20)
            expect(l.text.trim().length, 'note on a blank line').toBeGreaterThan(0)
          }
        }
      })

      test('at least three annotated lines', () => {
        expect(artifact.lines.filter((l) => l.note).length).toBeGreaterThanOrEqual(3)
      })
    })
  }

  // The health check's `finally` is resource cleanup; the heartbeat's rule is
  // "not in a finally". The note on that line has to draw the distinction or
  // a reader reads one against the other two steps later.
  test("health's clearTimeout note distinguishes it from the heartbeat rule", () => {
    const line = HEALTH.lines.find((l) => l.text.includes('clearTimeout'))
    expect(line?.note).toMatch(/heartbeat/i)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module './artifacts'`)

- [ ] **Step 3: Create `artifacts.ts`** — `text` values are the fences verbatim, including indentation and blank lines. Copy from the doc, not from here, then diff against the test.

```ts
// web/src/features/observability/artifacts.ts
import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/15-observability.md`. Five fences quoted verbatim, one pivot
 * each, annotations only on lines that carry a decision. `artifacts.test.ts`
 * holds every `text` against `fences()` line for line.
 */

export const SCRUBBER: Artifact = {
  id: 'sentry-before-send',
  filename: 'sentry.server.config.ts',
  language: 'ts',
  lines: [
    {
      text: "// sentry.server.config.ts — edit the wizard's Sentry.init, do not add another",
      note: 'The stage 04 wizard already created this file and called `Sentry.init` in it. `Sentry.init` must not run twice, so `beforeSend` is added by editing, not by a new file — and the same edit goes in `instrumentation-client.ts` and `sentry.edge.config.ts`.',
    },
    {
      text: "import { redact } from './lib/redact'",
      note: 'One deny-list, shared with the logger, so a pattern added once covers both destinations.',
    },
    { text: '' },
    { text: 'Sentry.init({' },
    { text: '  dsn: process.env.SENTRY_DSN,' },
    { text: '  beforeSend(event) {' },
    { text: '    // Sentry captures request headers by default, and that is where' },
    { text: '    // credentials live.' },
    {
      text: "    for (const header of ['authorization', 'cookie', 'x-api-key']) {",
      note: 'Surface one: headers. Sentry captures them by default; credentials live here.',
    },
    { text: '      delete event.request?.headers?.[header]' },
    { text: '    }' },
    { text: '' },
    { text: '    // It captures bodies too. A form post carries whatever the form carried.' },
    {
      text: '    if (event.request) delete event.request.data',
      note: 'Surface two: the request body. A form post carries whatever the form carried, so the whole body goes.',
    },
    { text: '' },
    { text: '    // And an exception message is free text: a failed query prints the' },
    { text: '    // connection string, password included.' },
    { text: '    for (const value of event.exception?.values ?? []) {' },
    {
      text: '      if (value.value) value.value = redact(value.value)',
      note: 'Surface three: exception text. A failed query prints its connection string, password included; `redact` runs the three patterns over it. These three surfaces are all `beforeSend` sees — nothing here touches context, breadcrumbs or tags.',
      pivot: true,
    },
    { text: '    }' },
    { text: '' },
    { text: '    return event' },
    { text: '  },' },
    { text: '})' },
  ],
}

export const LOGGER: Artifact = {
  id: 'pino-logger',
  filename: 'src/lib/logger.ts',
  language: 'ts',
  lines: [
    { text: '// src/lib/logger.ts' },
    { text: "import { AsyncLocalStorage } from 'node:async_hooks'" },
    { text: "import pino from 'pino'" },
    {
      text: "import { redact } from './redact'",
      note: 'The same deny-list `beforeSend` uses. `beforeSend` protects error reports and does nothing to log output, so the logger needs its own call.',
    },
    { text: '' },
    { text: 'export const requestContext = new AsyncLocalStorage<{ requestId: string }>()' },
    { text: '' },
    { text: 'export const logger = pino({' },
    { text: "  level: process.env.LOG_LEVEL ?? 'info'," },
    { text: '  base: {' },
    { text: "    service: process.env.SERVICE_NAME ?? 'web'," },
    { text: '    env: process.env.NODE_ENV,' },
    { text: '  },' },
    {
      text: '  mixin: () => ({ requestId: requestContext.getStore()?.requestId }),',
      note: 'Runs on every log call, so the request id attaches itself and no call site has to remember it. Open the store once per request, in middleware.',
    },
    {
      text: '  redact: {',
      note: 'Pino redaction paths are case-sensitive and match specific object shapes. `*.token` covers one level of nesting, not arbitrary depth. They do not scrub free-text messages or stack traces — the serializer below does that.',
    },
    { text: '    paths: [' },
    { text: "      'req.headers.authorization', 'req.headers.cookie'," },
    { text: "      'req.headers[\"x-api-key\"]'," },
    { text: "      'password', 'token', '*.password', '*.token'," },
    { text: '    ],' },
    { text: "    censor: '[redacted]'," },
    { text: '  },' },
    { text: '  serializers: {' },
    {
      text: '    error: (err: Error) => ({',
      note: 'An `Error` has no enumerable own properties, so `JSON.stringify` on one gives `{}`. Pino serializes a field only if a serializer is registered for its exact key — this one is `error`, because that is what the health check logs. A stock serializer would keep the message verbatim, connection string and all; this one redacts it.',
      pivot: true,
    },
    { text: '      type: err.name,' },
    { text: '      message: redact(err.message),' },
    { text: '      stack: err.stack ? redact(err.stack) : undefined,' },
    { text: '    }),' },
    { text: '  },' },
    { text: '})' },
  ],
}

export const HEALTH: Artifact = {
  id: 'health-route',
  filename: 'src/app/api/health/route.ts',
  language: 'ts',
  lines: [
    { text: '// src/app/api/health/route.ts' },
    {
      text: "import { logger } from '@/lib/logger'",
      note: 'The logger defined in the previous step. Shown so this is not mistaken for a standalone module.',
    },
    { text: "import { db } from '@/lib/db'" },
    { text: "import { sql } from 'drizzle-orm'" },
    { text: '' },
    { text: 'export async function GET() {' },
    { text: '  const checks = { database: false }' },
    { text: '  let timer: ReturnType<typeof setTimeout>' },
    { text: '' },
    { text: '  try {' },
    {
      text: '    await Promise.race([',
      note: 'The realistic failure is not refused, it is hung — an exhausted pool, a network partition. Without the race the health check hangs with it and never returns the `degraded` state it exists to report.',
      pivot: true,
    },
    { text: '      db.execute(sql`SELECT 1`),' },
    { text: '      new Promise((_, reject) => {' },
    { text: "        timer = setTimeout(() => reject(new Error('timeout')), 2000)" },
    { text: '      }),' },
    { text: '    ])' },
    { text: '    checks.database = true' },
    { text: '  } catch (error) {' },
    { text: '    // Not a fault, so not `error` — but the reason is the only evidence of' },
    { text: '    // how, and a bare `catch {}` destroys it.' },
    {
      text: "    logger.warn({ event: 'health.dependency_unreachable', error })",
      note: '`warn`, not `error`: a dependency being unreachable is not a fault in this code. But the reason is the only evidence of how, and a bare `catch {}` would destroy it.',
    },
    { text: '  } finally {' },
    { text: '    // The realistic failure is a hang, not a rejection — a pending timer on' },
    { text: '    // an invocation that already succeeded is exactly that shape.' },
    {
      text: '    clearTimeout(timer!)',
      note: 'Resource cleanup, not a success signal. This `finally` is fine; the heartbeat two steps later must not be in one, because there a `finally` reports success for a run that threw.',
    },
    { text: '  }' },
    { text: '' },
    { text: '  const healthy = Object.values(checks).every(Boolean)' },
    { text: '  return Response.json(' },
    { text: "    { status: healthy ? 'ok' : 'degraded', checks }," },
    {
      text: '    { status: healthy ? 200 : 503 },',
      note: 'The status code is what a platform reads. This is the readiness endpoint: point routing at it, never a restart trigger.',
    },
    { text: '  )' },
    { text: '}' },
  ],
}

export const CANARY: Artifact = {
  id: 'canary-route',
  filename: 'src/app/api/canary/route.ts',
  language: 'ts',
  lines: [
    { text: '// src/app/api/canary/route.ts — reads the real path, writes nothing' },
    { text: "import { db } from '@/lib/db'" },
    { text: '' },
    { text: 'export async function GET(request: Request) {' },
    {
      text: "  if (request.headers.get('x-monitor-token') !== process.env.MONITOR_TOKEN) {",
      note: 'One route, authenticated with a token issued to the monitor and nothing else.',
    },
    {
      text: "    return new Response('not found', { status: 404 })",
      note: '`404` rather than `401` for a bad token keeps the endpoint out of anyone\'s crawl results.',
    },
    { text: '  }' },
    { text: '' },
    {
      text: '  const latest = await db.query.orders.findFirst({',
      note: 'Read the last order back instead of creating one. A monitor that places an order every minute charges cards, fills tables, and pages you when your test data is wrong.',
    },
    { text: '    orderBy: (orders, { desc }) => [desc(orders.createdAt)],' },
    { text: '  })' },
    { text: '' },
    { text: '  // A service taking orders continuously should always have one: no row at' },
    { text: '  // all is the read path (or the write path behind it) failing silently, not' },
    { text: '  // a legitimately empty table. A status-only monitor only sees this if the' },
    { text: '  // assertion failing changes the HTTP status, not just the JSON body.' },
    { text: '  if (latest === undefined) {' },
    {
      text: '    return Response.json({ ok: false }, { status: 503 })',
      note: 'The assertion failing changes the HTTP status, not just the body. A status-only monitor cannot see `{"ok":false}` inside a `200`. A brand-new deployment with no orders yet is the one case this mistakenly fails — seed one known row rather than special-casing "no orders" as healthy.',
      pivot: true,
    },
    { text: '  }' },
    { text: '' },
    { text: '  return Response.json({ ok: true })' },
    { text: '}' },
  ],
}

export const HEARTBEAT: Artifact = {
  id: 'job-heartbeat',
  filename: 'the scheduled job',
  language: 'ts',
  lines: [
    {
      text: '// At the start and end of the job — after the work, on the success path only.',
      note: 'On the success path only. Not in a `finally`: a ping in a `finally` block reports success for a run that threw, which converts your only detector of silence into a source of false confidence.',
    },
    { text: 'const start = Date.now()' },
    { text: "// ...the job's work happens here..." },
    {
      text: 'await fetch(process.env.HEARTBEAT_URL!, {',
      note: 'The monitor pages you when this call does not arrive inside the window you set. Better Stack, Healthchecks.io and Cronitor all offer it; on AWS it is a CloudWatch alarm with `TreatMissingData` set to `breaching` explicitly.',
      pivot: true,
    },
    { text: "  method: 'POST'," },
    {
      text: '  body: JSON.stringify({ durationMs: Date.now() - start }),',
      note: 'Duration rides along with the ping, so a job that is slower every night is a threshold you can set rather than a trend you notice too late.',
    },
    { text: '})' },
  ],
}
```

- [ ] **Step 4: Run it — expect PASS (26 tests)**

If any `quotes its fence line for line` test fails, the diff is the line to fix — do not loosen the assertion.

- [ ] **Step 5: Commit**

```bash
git add src/features/observability/artifacts.ts src/features/observability/artifacts.test.ts
git commit -m "feat(observability): five annotated artifacts quoted from the doc's fences"
```

---

### Task 4: Signals and AI plays data

**Files:**
- Create: `web/src/features/observability/signals.ts`, `signals.test.ts`
- Create: `web/src/features/observability/ai-plays.ts`, `ai-plays.test.ts`

**Interfaces:**
- Consumes: `flat`, `section` from Task 1.
- Produces: `SIGNALS: Signal[]` (4, `{ id, name, source, vercel, aws }`); `AI_PREMISE`, `AI_LIMIT: string`, `PLAYS: Play[]` (6).

- [ ] **Step 1: Write the failing signals test**

```ts
// web/src/features/observability/signals.test.ts
import { describe, expect, test } from 'vitest'
import { SIGNALS } from './signals'
import { flat, section } from './doc-source'

describe('four signals data', () => {
  // The table rows, in doc order. Emphasis stripped for the same reason as
  // the drills: the doc italicises "what broke" and "how often".
  const src = flat(section('The four signals')).replace(/\*/g, '')

  test('four signals in the golden-signals order', () => {
    expect(SIGNALS.map((s) => s.name)).toEqual([
      'Latency', 'Traffic', 'Errors', 'Saturation',
    ])
  })

  test('every cell is a phrase from the doc table', () => {
    for (const s of SIGNALS) {
      expect(src, `${s.id} source`).toContain(flat(s.source))
      expect(src, `${s.id} vercel`).toContain(flat(s.vercel))
      expect(src, `${s.id} aws`).toContain(flat(s.aws))
    }
  })

  test('errors names both questions', () => {
    const errors = SIGNALS.find((s) => s.id === 'errors')
    expect(errors?.source).toMatch(/what broke/)
    expect(errors?.source).toMatch(/how often/)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module './signals'`)

- [ ] **Step 3: Create `signals.ts`**

```ts
// web/src/features/observability/signals.ts
/**
 * Source: `docs/15-observability.md`, "### The four signals" — the table.
 * Each row states its category before it names a product, which is the
 * stage-transfer point the doc round was opened to fix (C5).
 */
export type Signal = {
  id: string
  name: string
  /** Where it comes from — the category, before any product. */
  source: string
  vercel: string
  aws: string
}

export const SIGNALS: Signal[] = [
  {
    id: 'latency',
    name: 'Latency',
    source: 'The HTTP layer in front of your app, which already times every request',
    vercel: 'Vercel Observability, per route',
    aws: 'ALB or API Gateway CloudWatch metrics',
  },
  {
    id: 'traffic',
    name: 'Traffic',
    source: 'The same layer — it counts every request, which is also your denominator',
    vercel: 'The same place',
    aws: 'The same CloudWatch metrics',
  },
  {
    id: 'errors',
    name: 'Errors',
    source: 'Two questions, not one: what broke and how often. Sentry answers the first; the request-counting layer answers the second',
    vercel: 'Edge Requests by status code; Sentry for what broke',
    aws: 'ALB 5XX over request count; Sentry for what broke',
  },
  {
    id: 'saturation',
    name: 'Saturation',
    source: 'Whatever owns the resource with the ceiling',
    vercel: 'Your database dashboard, function concurrency',
    aws: 'CloudWatch per-service metrics, RDS connections',
  },
]
```

- [ ] **Step 4: Run it — expect PASS (3 tests)**

- [ ] **Step 5: Write the failing AI plays test**

```ts
// web/src/features/observability/ai-plays.test.ts
import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('observability AI plays data', () => {
  const src = flat(section('AI in observability')).replace(/\*/g, '')

  test('premise pins against doc', () => {
    expect(src).toContain(flat('pattern-matching over text you already have'))
    expect(flat(AI_PREMISE)).toContain('pattern-matching over text you already have')
  })

  test('limit pins against doc', () => {
    expect(src).toContain(flat('tell you what you failed to instrument'))
    expect(flat(AI_LIMIT)).toContain('tell you what you failed to instrument')
  })

  test('six plays, matching the six bold leads', () => {
    const leads = section('AI in observability').match(/^- \*\*.+?\*\*/gm) ?? []
    expect(leads).toHaveLength(6)
    expect(PLAYS).toHaveLength(6)
  })

  test('unique IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every title is a bold lead', () => {
    const leads = (section('AI in observability').match(/^- \*\*(.+?)\*\*/gm) ?? []).map(
      (b) => flat(b.replace(/^- /, '').replace(/\*\*/g, '')),
    )
    for (const p of PLAYS) {
      expect(leads.some((l) => l.includes(flat(p.title))), p.id).toBe(true)
    }
  })

  test('all kinds are valid', () => {
    const valid = new Set(['mcp', 'command', 'prompt', 'cli', 'cli-mcp'])
    for (const p of PLAYS) expect(valid.has(p.kind), `${p.id} kind`).toBe(true)
  })

  // The doc labels one play "(A CLI + MCP command.)" and the other five
  // "(A prompt.)".
  test('the query-logs play is cli-mcp and the rest are prompts', () => {
    const query = PLAYS.find((p) => p.id === 'query-logs')
    expect(query?.kind).toBe('cli-mcp')
    expect(PLAYS.filter((p) => p.kind === 'prompt')).toHaveLength(5)
  })

  test('every play body is a phrase from the doc', () => {
    for (const p of PLAYS) {
      expect(src, `${p.id} body`).toContain(flat(p.body).slice(0, 60))
    }
  })
})
```

- [ ] **Step 6: Run it — expect FAIL** (`Cannot find module './ai-plays'`)

- [ ] **Step 7: Create `ai-plays.ts`**

```ts
// web/src/features/observability/ai-plays.ts
/**
 * Source: `docs/15-observability.md`, "### AI in observability".
 *
 * `AI_PREMISE` is the opening paragraph; `AI_LIMIT` the closing one. `PLAYS`
 * covers the six bulleted plays, each with a `kind` matching the doc's
 * parenthetical — five prompts and one CLI + MCP command.
 */
export const AI_PREMISE =
  'An agent is good at the parts of observability that are pattern-matching over text you already have — grouping errors, spotting what changed, writing a query in a language you do not know. It is bad at the part that decides whether you are actually covered, because that requires noticing what is not in the data, and the data is all it has.'

export const AI_LIMIT =
  'What it cannot do is tell you what you failed to instrument. Every one of those plays reads the signals that exist, and the failure this stage is most concerned with — the job that never ran, the business failure that threw nothing, the alert routed to a dead phone number — produces no signal at all. An agent will summarise a dashboard confidently while the thing that mattered is not on it.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli' | 'cli-mcp'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'draft-alert-set',
    title: 'Draft the alert set from your own event names',
    kind: 'prompt',
    body: 'Give it your structured log events, your four signals and your traffic shape, and ask for alert rules with thresholds, durations and a minimum-volume gate. The rules come back reasonable and the numbers come back invented — they are the part you replace with your own baselines.',
  },
  {
    id: 'which-events-stopped',
    title: 'Ask which events stopped',
    kind: 'prompt',
    body: "Paste a day of log events and yesterday's, and ask what appears in one and not the other. This is the one analysis that addresses the failure mode nothing else in this stage sees, and it is mechanical enough to hand over.",
  },
  {
    id: 'scrubbing-deny-list',
    title: 'Write the scrubbing deny-list from your own schema',
    kind: 'prompt',
    body: 'Point it at your schema and your environment variable names and ask which values would end up in an error payload. It finds the connection string you forgot; you verify by sending a test event and reading what arrived.',
  },
  {
    id: 'query-logs',
    title: 'Query logs in a language you do not know',
    kind: 'cli-mcp',
    body: 'Describe the question in English and let it write the CloudWatch Logs Insights query or the PromQL. Reading a query you did not write is much easier than writing it, which reverses the usual argument against generated code here.',
  },
  {
    id: 'incident-to-alert',
    title: 'Turn an incident into the alert you were missing',
    kind: 'prompt',
    body: 'Paste the timeline of something you found out about late, and ask what signal would have fired first. It reliably names one you do not have.',
  },
  {
    id: 'dashboard-as-config',
    title: 'Generate the dashboard as configuration',
    kind: 'prompt',
    body: 'Grafana and CloudWatch both take JSON. Describe the four signals and the deploy markers and edit what comes back, rather than clicking twelve panels into existence.',
  },
]
```

- [ ] **Step 8: Run it — expect PASS (8 tests)**

- [ ] **Step 9: Commit**

```bash
git add src/features/observability/signals.ts src/features/observability/signals.test.ts src/features/observability/ai-plays.ts src/features/observability/ai-plays.test.ts
git commit -m "feat(observability): four-signals table and six AI plays as data"
```

---

### Task 5: The `Drill` component

**Files:**
- Create: `web/src/features/observability/Drill.tsx`, `Drill.test.tsx`

**Interfaces:**
- Consumes: `DrillOption`, `DrillRow` from Task 2; `scrubber.ts` (as the test's dataset).
- Produces: `Drill({ idPrefix, question, subtitle, options, rows })`. Tasks 8 and 9 mount it four times.

- [ ] **Step 1: Write the failing render test**

```tsx
// web/src/features/observability/Drill.test.tsx
import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Drill } from './Drill'
import { OPTIONS, QUESTION, ROWS, SUBTITLE } from './scrubber'

const mount = () =>
  render(
    <Drill
      idPrefix="test-scrubber"
      question={QUESTION}
      subtitle={SUBTITLE}
      options={OPTIONS}
      rows={ROWS}
    />,
  )

// Every row offers the same options, so an unscoped getByRole('radio')
// matches many. Each row is reached by its prompt, which is the radiogroup's
// accessible name (backticks stripped).
const rowFor = (prompt: string) =>
  screen.getByRole('radiogroup', {
    name: new RegExp(
      prompt
        .replace(/`/g, '')
        .split(' ')
        .slice(0, 5)
        .join(' ')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    ),
  })

const pick = (prompt: string, label: string) =>
  fireEvent.click(within(rowFor(prompt)).getByRole('radio', { name: label }))

const AUTH = "The request's `Authorization: Bearer …` header."
const LOG = 'A `logger.warn` line whose message includes the same connection string.'

test('renders one radiogroup per row, from the data', () => {
  mount()
  expect(screen.getAllByRole('radiogroup')).toHaveLength(ROWS.length)
})

test('every row offers every option', () => {
  mount()
  for (const r of ROWS) {
    expect(within(rowFor(r.prompt)).getAllByRole('radio')).toHaveLength(
      OPTIONS.length,
    )
  }
})

test('the question and subtitle render', () => {
  mount()
  expect(screen.getByText(/scrub this before it leaves/)).toBeDefined()
  expect(screen.getByText(/covers three surfaces/)).toBeDefined()
})

// Literals on both sides, never `ROWS[i].answer` — a test that reads the
// answer off the row it scores cannot see a component scoring the wrong field.
test('the authorization header scored as scrubbed is right', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  expect(screen.getByText('1/1 right')).toBeDefined()
})

test('the log line scored as scrubbed is wrong', () => {
  mount()
  pick(LOG, 'Scrubbed')
  expect(screen.getByText('0/1 right')).toBeDefined()
})

test('the why is hidden until the reader commits', () => {
  mount()
  const row = rowFor(LOG).closest('li') as HTMLElement
  const why = /does nothing to log output/
  expect(within(row).queryByText(why)).toBeNull()
  pick(LOG, 'Reaches Sentry')
  expect(within(row).getByText(why)).toBeDefined()
})

test('a committed row locks, so a second guess cannot score hindsight', () => {
  mount()
  pick(AUTH, 'Reaches Sentry')
  expect(screen.getByText('0/1 right')).toBeDefined()
  pick(AUTH, 'Scrubbed')
  expect(screen.getByText('0/1 right')).toBeDefined()
  const radios = within(rowFor(AUTH)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
})

test('the running score is announced', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  expect(screen.getByText('1/1 right').getAttribute('aria-live')).toBe('polite')
})

test('a verdict is coloured go or danger, never brand', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  const row = rowFor(AUTH).closest('li') as HTMLElement
  const verdict = within(row).getByText('Correct')
  expect(verdict.className).toMatch(/text-go/)
  expect(verdict.className).not.toMatch(/brand/)
})

test('reset clears every answer and the score', () => {
  mount()
  pick(AUTH, 'Scrubbed')
  fireEvent.click(screen.getByRole('button', { name: /reset/i }))
  expect(screen.queryByText(/right$/)).toBeNull()
  const radios = within(rowFor(AUTH)).getAllByRole('radio')
  expect(radios.every((r) => (r as HTMLButtonElement).disabled)).toBe(false)
})

test('panel ids derive from idPrefix, so two drills on one page cannot collide', () => {
  const { container } = mount()
  expect(container.querySelector('#test-scrubber-pino-log-line')).not.toBeNull()
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module './Drill'`)

Run: `pnpm vitest run src/features/observability/Drill.test.tsx`

- [ ] **Step 3: Create `Drill.tsx`** — `TriageDrill.tsx` (stage 06) with the constants lifted to props. The two-lock guard and its comment come across unchanged.

```tsx
// web/src/features/observability/Drill.tsx
'use client'

import { useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import type { DrillOption, DrillRow } from './drill-types'

/**
 * Guess-then-reveal, parameterised. Stage 06's `TriageDrill` with the
 * question, options and rows lifted to props, because this stage carries
 * four of them (alert triage, log level, silence, scrubber) and one
 * component with four datasets beats four copies of one component.
 *
 * Per `PATTERNS.md`: the answer locks before the verdict shows, and the set
 * is scored, because a revealed answer the reader did not commit to teaches
 * nothing. The options grid is two columns up to five options, so the
 * five-level log drill and the two-option drills share one layout.
 *
 * `brand` is never a verdict here. It means attention; `go` and `danger`
 * carry the meaning.
 */
function plain(text: string): string {
  return text.replace(/`/g, '')
}

export function Drill({
  idPrefix,
  question,
  subtitle,
  options,
  rows,
}: {
  idPrefix: string
  question: string
  subtitle: string
  options: DrillOption[]
  rows: DrillRow[]
}) {
  const [choices, setChoices] = useState<Record<string, string>>({})

  // Two locks, and `disabled` on the buttons is the one that holds in
  // practice — stage 06's teeth check confirmed the render test stays green
  // with this guard alone. `commit`'s guard is here for the paths that do not
  // go through a pointer press on an enabled button, since scoring a second
  // guess scores hindsight.
  const commit = (id: string, optionId: string) =>
    setChoices((prev) => (id in prev ? prev : { ...prev, [id]: optionId }))

  const answered = Object.keys(choices).length
  const correct = rows.filter((r) => choices[r.id] === r.answer).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            <InlineCode text={question} />
          </p>
          <p className="text-sm text-subtle">
            <InlineCode text={subtitle} />
          </p>
        </div>
        {answered > 0 && (
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className="font-mono text-sm tabular-nums text-muted"
            >
              {correct}/{answered} right
            </span>
            <button
              type="button"
              onClick={() => setChoices({})}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-2.5">
        {rows.map((r) => {
          const choice = choices[r.id]
          const done = r.id in choices
          const right = done && choice === r.answer
          const expected = options.find((o) => o.id === r.answer)

          return (
            <li
              key={r.id}
              id={`${idPrefix}-${r.id}`}
              className="border border-line bg-sunken p-4"
            >
              <p className="mb-3 min-w-0 break-words text-[15px] font-medium leading-6 text-fg">
                <InlineCode text={r.prompt} />
              </p>

              <div
                role="radiogroup"
                aria-label={plain(r.prompt)}
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {options.map((opt) => {
                  const checked = done && choice === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      disabled={done}
                      onClick={() => commit(r.id, opt.id)}
                      className={[
                        'min-h-11 min-w-0 break-words border px-3 py-2 text-left text-sm font-medium transition-colors duration-150',
                        checked
                          ? 'border-brand bg-brand-tint text-fg'
                          : done
                            ? 'cursor-not-allowed border-line bg-raised text-subtle'
                            : 'border-line bg-raised text-muted hover:border-line-strong',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>

              <div aria-live="polite">
                {done && (
                  <div className="mt-3 border-t border-line pt-3">
                    <p
                      className={[
                        'mb-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                        right ? 'text-go' : 'text-danger',
                      ].join(' ')}
                    >
                      {right ? (
                        <Check className="size-3.5 shrink-0" aria-hidden />
                      ) : (
                        <X className="size-3.5 shrink-0" aria-hidden />
                      )}
                      {right ? 'Correct' : 'Not quite'}
                      {!right && expected && (
                        <span className="font-normal normal-case tracking-normal text-subtle">
                          — it is &ldquo;{expected.label}&rdquo;
                        </span>
                      )}
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      <InlineCode text={r.why} />
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
```

- [ ] **Step 4: Run it — expect PASS (11 tests)**

- [ ] **Step 5: Teeth check — revert the lock, watch one test go red, restore**

Change `disabled={done}` to `disabled={false}` and remove the `id in prev ? prev :` guard from `commit`. Run the file. Expected: `a committed row locks…` FAILS (score moves to `1/1`), nothing else. Restore both. Paste the red output in the task report.

- [ ] **Step 6: Commit**

```bash
git add src/features/observability/Drill.tsx src/features/observability/Drill.test.tsx
git commit -m "feat(observability): parameterised guess-then-reveal Drill component"
```

---

### Task 6: `AIPlays` and `ObservabilityChecklist` components

**Files:**
- Create: `web/src/features/observability/AIPlays.tsx`, `AIPlays.test.tsx`
- Create: `web/src/features/observability/ObservabilityChecklist.tsx`, `ObservabilityChecklist.test.tsx`

**Interfaces:**
- Consumes: `AI_PREMISE`, `AI_LIMIT`, `PLAYS` (Task 4); `DONE`, `ARTIFACT_LIST`, `TEAM` (Task 1); `RevealList`, `TeamNotes`, `useLocalStorage`.
- Produces: `AIPlays()`, `ObservabilityChecklist()`, `OBSERVABILITY_CHECKLIST_KEY = 'obs-checklist'`.

- [ ] **Step 1: Write the failing AIPlays test**

```tsx
// web/src/features/observability/AIPlays.test.tsx
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

  test('the premise and limit reach the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/pattern-matching over text/)).toBeTruthy()
    expect(screen.getByText(/failed to instrument/)).toBeTruthy()
  })

  test('the CLI + MCP play carries the combined badge', () => {
    render(<AIPlays />)
    expect(screen.getByText('CLI + browser tool')).toBeTruthy()
    expect(screen.getAllByText('Prompt')).toHaveLength(5)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module './AIPlays'`)

- [ ] **Step 3: Create `AIPlays.tsx`** — stage 14's, with the id prefix and imports changed.

```tsx
// web/src/features/observability/AIPlays.tsx
import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

const KIND_LABEL: Record<Play['kind'], string> = {
  mcp: 'Browser tool',
  command: 'Saved command',
  prompt: 'Prompt',
  cli: 'CLI command',
  'cli-mcp': 'CLI + browser tool',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="obs-ai"
        header={
          <p className="border-b border-line px-5 py-3.5 text-sm leading-6 text-muted">
            <InlineCode text={AI_PREMISE} />
          </p>
        }
        rows={PLAYS.map((play) => ({
          id: play.id,
          title: (
            <span className="font-medium">
              <InlineCode text={play.title} />
            </span>
          ),
          badge: (
            <span className="t-label shrink-0 border border-line px-1.5 py-0.5 text-subtle">
              {KIND_LABEL[play.kind]}
            </span>
          ),
          body: (
            <p className="measure text-sm leading-6 text-muted">
              <InlineCode text={play.body} />
            </p>
          ),
        }))}
      />

      <div className="flex gap-3 rounded-md border border-warn/30 bg-warn/5 px-4 py-3">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium">What none of this replaces</p>
          <p className="text-sm text-muted">
            <InlineCode text={AI_LIMIT} />
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run it — expect PASS (3 tests)**

- [ ] **Step 5: Write the failing checklist render test**

```tsx
// web/src/features/observability/ObservabilityChecklist.test.tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ObservabilityChecklist } from './ObservabilityChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

describe('ObservabilityChecklist', () => {
  test('renders all fifteen done checkboxes', () => {
    render(<ObservabilityChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
    expect(DONE).toHaveLength(15)
  })

  test('ticking a checkbox persists and shows the count', () => {
    render(<ObservabilityChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of 15/)).toBeTruthy()
  })

  test('the ten artifacts render', () => {
    render(<ObservabilityChecklist />)
    for (const a of ARTIFACT_LIST) {
      expect(
        screen.getByText(new RegExp(a.replace(/`/g, '').slice(0, 28))),
      ).toBeTruthy()
    }
  })

  test('team notes disclosure exists and is collapsed', () => {
    render(<ObservabilityChecklist />)
    const button = screen.getByRole('button', { name: /if you are not solo/i })
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
})
```

- [ ] **Step 6: Run it — expect FAIL** (`Cannot find module './ObservabilityChecklist'`)

- [ ] **Step 7: Create `ObservabilityChecklist.tsx`** — stage 14's `VerificationChecklist` with the key, copy and imports changed.

```tsx
// web/src/features/observability/ObservabilityChecklist.tsx
'use client'

import { useId } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'

/**
 * Source: `docs/15-observability.md`, "## Artifacts", "## Definition of done"
 * and "## Scaling to a team". Same shape as stage 14's `VerificationChecklist`:
 * one `Card` with the artifacts list, a persisted done checklist keyed on
 * `DoneItem.id`, and a `TeamNotes` disclosure below. State goes through
 * `useLocalStorage` (`useSyncExternalStore`, not `useEffect` + `setState`).
 *
 * Checked means *done*, so the control is tinted `go`, not `brand`.
 */

export const OBSERVABILITY_CHECKLIST_KEY = 'obs-checklist'

/** Stable reference: `useLocalStorage` uses it as the server snapshot. */
const NOTHING_TICKED: string[] = []

export function ObservabilityChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(OBSERVABILITY_CHECKLIST_KEY, NOTHING_TICKED)
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
              <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
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
          <span className="t-data flex items-center gap-1.5 text-subtle" aria-live="polite">
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
              ? 'Every box ticked — you will know before your users do.'
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

- [ ] **Step 8: Run both — expect PASS (7 tests)**

If `team notes disclosure … aria-expanded` fails because `TeamNotes` renders a `<details>` rather than a button with `aria-expanded`, check `src/components/TeamNotes.tsx` and match the assertion to what it actually renders (stage 14's test asserts only the button's existence). Do not change `TeamNotes`.

- [ ] **Step 9: Commit**

```bash
git add src/features/observability/AIPlays.tsx src/features/observability/AIPlays.test.tsx src/features/observability/ObservabilityChecklist.tsx src/features/observability/ObservabilityChecklist.test.tsx
git commit -m "feat(observability): AI plays and persisted checklist components"
```

---

### Task 7: Glossary terms and references

**Files:**
- Modify: `web/src/lib/terms.ts` (append eight entries)
- Modify: `web/src/lib/references.ts` (add a `'15-observability'` key)
- Regenerate: `reference/glossary.md` via `pnpm gen:glossary`

**Interfaces:**
- Produces: term ids `heartbeat`, `liveness`, `readiness`, `saturation`, `cardinality`, `structured-logging`, `request-id`, `alert-fatigue`, used by Tasks 8–9's `<Term>`s; `REFERENCES['15-observability']` (4 entries), rendered by `<References slug="15-observability" />` in Task 9.

- [ ] **Step 1: Check for collisions**

Run: `grep -n "^  \(heartbeat\|liveness\|readiness\|saturation\|cardinality\|structured-logging\|request-id\|alert-fatigue\|correlation-id\|log-level\)" src/lib/terms.ts`
Expected: no output. If any id exists, do not add a duplicate: read the existing entry, update its `see` to `'15-observability'` only if its current stage is not more central to the term, and drop that id from the list below.

- [ ] **Step 2: Add the terms** — append inside `TERMS`, before the closing `}`. The existing `term-usage.test.ts` requires each `see` stage's doc to mention the term; all eight words appear in `docs/15-observability.md`.

```ts
  heartbeat: {
    name: 'Heartbeat (dead man\'s switch)',
    short: 'A ping a job sends on success; the monitor pages when the ping stops arriving.',
    full: 'A scheduled job calls a URL when it finishes successfully, and a monitor pages you when the call does not arrive inside the window you set. It is the only monitor that alerts on silence rather than on an event, which is why it goes on the success path and never in a `finally`.',
    soWhat: 'A job that never ran produces no exception, no log line and no request — every other mechanism reports healthy. This is the one that does not.',
    see: '15-observability',
  },
  liveness: {
    name: 'Liveness check',
    short: 'Is this process wedged? — the check a platform uses to decide whether to restart it.',
    full: 'An endpoint that returns 200 whenever the process is running and checks nothing else. Platforms that restart on a failed check (Fly, ECS, Cloud Run, a Kubernetes liveness probe) read this one.',
    soWhat: 'A restart cannot fix a database. Wire the restart trigger to a check that depends on one and a thirty-second blip restarts every instance you have, at once.',
    see: '15-observability',
  },
  readiness: {
    name: 'Readiness check',
    short: 'Should traffic come here right now? — the check a load balancer uses to route around an instance.',
    full: 'An endpoint that verifies real dependencies (the database, with a timeout) and returns 503 when one is unreachable. Routing decisions — a load balancer\'s health check, a Kubernetes readiness probe — read this one and pull the instance out of rotation without restarting it.',
    soWhat: 'It is what your uptime monitor should point at. It is not what your restart trigger should point at; that is the liveness check.',
    see: '15-observability',
  },
  saturation: {
    name: 'Saturation',
    short: 'How close a resource is to its ceiling — connections, concurrency, disk.',
    full: 'The fourth golden signal: how full the resource with a hard limit is. Database connections, function concurrency, storage. Unlike CPU, a saturated resource with a hard ceiling does not recover on its own, so it is worth alerting on before it becomes a symptom.',
    soWhat: 'On a small deployment it is the signal most likely to be the actual incident — a connection pool exhausted by a batch job running alongside daytime traffic — and the one most often left off the dashboard.',
    see: '15-observability',
  },
  cardinality: {
    name: 'Cardinality',
    short: 'How many distinct values a field takes. Fine in logs, expensive as a metric label.',
    full: 'A high-cardinality field — a user id, an invoice id, a request id — has as many distinct values as there are users, invoices or requests. In logs, that is what makes a particular event findable. As a metric label, every combination of label values creates another time series.',
    soWhat: 'Keep identifiers in log lines and out of metric labels. A bounded event name is a fine label; a unique id is not.',
    see: '15-observability',
  },
  'structured-logging': {
    name: 'Structured logging',
    short: 'Logging objects — one JSON line per event — instead of sentences.',
    full: 'Each log call emits a JSON object with named fields (`event`, `userId`, `requestId`, `reason`) rather than a formatted sentence. `pino` writes one object per line to stdout, which every platform collects; the shape is what matters, not the library.',
    soWhat: 'Sentences are unsearchable at volume. "How many card_declined events this week, by amount?" is a query against objects and impossible against prose.',
    see: '15-observability',
  },
  'request-id': {
    name: 'Request id',
    short: 'One id shared by every log line and error report from the same request.',
    full: 'A per-request identifier — the incoming `x-request-id` if there is one, else a fresh UUID — stored in `AsyncLocalStorage` and attached to every log line by the logger\'s `mixin`, and to the error report with `Sentry.setTag`. Not distributed tracing: it is one field, and it costs nothing.',
    soWhat: 'Without it, "work out why" fails at two log lines: you can see the error and the logs and cannot connect them.',
    see: '15-observability',
  },
  'alert-fatigue': {
    name: 'Alert fatigue',
    short: 'The state where you dismiss alerts without reading them, because most have not needed action.',
    full: 'Not a discipline failure; the predictable result of noisy alerts. An alert that has woken you four times without once needing action has taught you to ignore it, and the fifth time is the real one.',
    soWhat: 'Every alert must be actionable. The cure for a noisy alert is to raise its threshold, lengthen its window, or delete it — not to try harder to read it.',
    see: '15-observability',
  },
```

- [ ] **Step 3: Regenerate the glossary and run the glossary tests**

Run: `pnpm gen:glossary && pnpm vitest run src/lib/terms.test.ts src/lib/term-usage.test.ts src/lib/glossary.test.ts`
Expected: PASS. `git diff --stat reference/glossary.md` shows only additions.

- [ ] **Step 4: Add the references** — four, verified to resolve in a browser before committing (some publishers 403 `curl`). Add to `REFERENCES` in `src/lib/references.ts`:

```ts
  '15-observability': [
    {
      title: 'Monitoring Distributed Systems (The Four Golden Signals)',
      source: 'Google SRE Book',
      url: 'https://sre.google/sre-book/monitoring-distributed-systems/',
      adds: 'The origin of latency, traffic, errors and saturation as the four things to instrument first, and the symptoms-versus-causes argument this stage borrows.',
    },
    {
      title: 'Configure Liveness, Readiness and Startup Probes',
      source: 'Kubernetes documentation',
      url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
      adds: 'The platform-side definition of the restart-versus-routing split: what each probe does on failure, which is the mapping the health-checks step teaches.',
    },
    {
      title: 'Redaction',
      source: 'pino documentation',
      url: 'https://github.com/pinojs/pino/blob/main/docs/redaction.md',
      adds: 'Exactly what a redaction path can and cannot match — case sensitivity, wildcard depth — which is the boundary the logger step draws before it adds its own serializer.',
    },
    {
      title: 'Filtering Events with beforeSend',
      source: 'Sentry documentation',
      url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/filtering/',
      adds: 'The event shape `beforeSend` receives and which fields Sentry populates by default, so the scrubber step\'s three surfaces can be checked against the real payload.',
    },
  ],
```

- [ ] **Step 5: Run the references test — expect PASS**

Run: `pnpm vitest run src/lib/references.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/lib/terms.ts src/lib/references.ts ../reference/glossary.md
git commit -m "feat(observability): eight glossary terms and four references for stage 15"
```

---

### Task 8: Panels — three, errors, logs, where, signals

**Files:**
- Create: `web/src/features/observability/panels-collect.tsx`, `panels-collect.test.tsx`

**Interfaces:**
- Consumes: `Drill` (Task 5); `SCRUBBER`, `LOGGER` (Task 3); the `scrubber` and `log-levels` datasets (Task 2); `SIGNALS` (Task 4); terms from Task 7; `Step` from `@/components/Stepper`; `StepId` from Task 1.
- Produces: `COLLECT_STEPS: (Step & { id: StepId })[]` — five steps, `three` … `signals`, consumed by Task 10.

- [ ] **Step 1: Write the failing render test**

```tsx
// web/src/features/observability/panels-collect.test.tsx
import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Stepper } from '@/components/Stepper'
import { COLLECT_STEPS } from './panels-collect'
import { ROWS as SCRUBBER_ROWS } from './scrubber'
import { ROWS as LEVEL_ROWS } from './log-levels'
import { SIGNALS } from './signals'

const go = (label: RegExp) =>
  fireEvent.click(screen.getByRole('tab', { name: label }))

describe('collect panels', () => {
  test('five steps, in order', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    expect(COLLECT_STEPS.map((s) => s.id)).toEqual([
      'three', 'errors', 'logs', 'where', 'signals',
    ])
    expect(screen.getAllByRole('tab')).toHaveLength(5)
  })

  test('three: the traces row says you will know when you need them', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/Monitoring checks the failures you anticipated/)
    fireEvent.click(screen.getByRole('button', { name: /Traces/ }))
    expect(panel.textContent).toMatch(/You will know when you need them/)
  })

  test('errors: the scrubber artifact and the scrubber drill both mount', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Errors/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/sentry\.server\.config\.ts/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SCRUBBER_ROWS.length)
    expect(panel.textContent).toMatch(/One loop can spend everything/)
  })

  test('logs: the logger artifact, the ladder and the level drill mount', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Structured logs/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/src\/lib\/logger\.ts/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(LEVEL_ROWS.length)
    // Five options per row — the only drill that is not binary.
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(LEVEL_ROWS.length * 5)
    expect(panel.textContent).toMatch(/Levels are a filter, not a mood/)
  })

  test('where: both platforms and the stream-not-storage claim', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/Where logs go/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/stream, not storage/)
    expect(screen.getByRole('button', { name: /Vercel/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /AWS/ })).toBeTruthy()
  })

  test('signals: four rows from the data, and the error-rate warning', () => {
    render(<Stepper steps={COLLECT_STEPS} />)
    go(/four signals/)
    for (const s of SIGNALS) {
      expect(screen.getByRole('button', { name: new RegExp(`^${s.name}`) })).toBeTruthy()
    }
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/does not come from your error tracker/)
    expect(panel.textContent).toMatch(/Write the numbers down/)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module './panels-collect'`)

Run: `pnpm vitest run src/features/observability/panels-collect.test.tsx`

- [ ] **Step 3: Create `panels-collect.tsx`**

Prose is the doc's, condensed where a paragraph became a row title. Every `<Term>` has `{' '}` on the side that meets text.

```tsx
// web/src/features/observability/panels-collect.tsx
import Link from 'next/link'
import type { Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { getStage } from '@/lib/stages'
import { Drill } from './Drill'
import { LOGGER, SCRUBBER } from './artifacts'
import * as scrubber from './scrubber'
import * as levels from './log-levels'
import { SIGNALS } from './signals'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

const LEVEL_LADDER: [string, string][] = [
  ['debug', 'Diagnostic detail, normally disabled in production'],
  ['info', 'Routine events and business outcomes you want to count'],
  ['warn', 'An unexpected condition the application handled'],
  ['error', 'A fault you would investigate; a common input to alerts'],
  ['fatal', 'A fault that prevents the process continuing'],
]

export const COLLECT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: three ---- */
  {
    id: 'three',
    label: 'Three things',
    hint: 'In order of value',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Why this stage exists" title="Monitoring, and then observability">
          <Prose>
            <p>
              Monitoring checks the failures you anticipated: an error-rate
              threshold, a missing{' '}
              <Term id="heartbeat">heartbeat</Term>, a slow response.
              Observability is the ability to investigate questions you did
              not anticipate, using the evidence the system emits. Both
              matter: predefined checks tell you to look, and contextual
              evidence helps you work out what happened.
            </p>
            <p>
              Solo, errors plus a handful of metrics covers the large majority
              of real need.
            </p>
          </Prose>
        </Section>

        <Section eyebrow="Before you begin" title="Entry criteria">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>The application is deployed and receiving real traffic</li>
            <li>
              Sentry is installed with verified source maps (
              <Link href="/stages/04-project-setup" className={stageLinkClass}>
                {stageTitle('04-project-setup')}
              </Link>
              )
            </li>
          </ul>
        </Section>

        <Section title="Three things, in order of value">
          <RevealList
            idPrefix="obs-three"
            rows={[
              {
                id: 'errors',
                title: '1. Errors',
                summary: 'Something broke. Install this first; it delivers value immediately.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Out of the box, Sentry tells you an exception occurred.
                    The next step is about turning that into a fix.
                  </p>
                ),
              },
              {
                id: 'metrics',
                title: '2. Metrics',
                summary: 'Aggregate health over time.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    This is what tells you &ldquo;normal&rdquo; so that
                    &ldquo;abnormal&rdquo; is legible. The four signals, and
                    the{' '}
                    <Term id="baseline">baseline</Term> you write down after a
                    week of ordinary traffic.
                  </p>
                ),
              },
              {
                id: 'traces',
                title: '3. Traces',
                summary: 'Where request time went, across every hop. Not set up in this stage — and that is not an oversight.',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      With one application and one database, a trace tells you
                      what a slow query log already told you.{' '}
                      <strong className="text-fg">You will know when you need them</strong>
                      {' '}&mdash; the symptom is a slowness you cannot locate after
                      checking the obvious two places, and it usually arrives
                      with the second service (
                      <Link href="/stages/09-performance-optimization" className={stageLinkClass}>
                        {stageTitle('09-performance-optimization')}
                      </Link>
                      ).
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      Until then the{' '}
                      <Term id="request-id">request id</Term> from the
                      structured-logs step does the job traces would.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: errors ---- */
  {
    id: 'errors',
    label: 'Errors that are useful',
    hint: 'Context, then scrubbing',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Errors" title="Context is what turns an exception into a fix">
          <Prose>
            <p>
              Attach the user to every authenticated request &mdash;{' '}
              <code>Sentry.setUser(&#123; id: user.id &#125;)</code>. &ldquo;This
              error hit 400 users&rdquo; and &ldquo;this error hit one user
              with unusual data&rdquo; are entirely different problems with
              entirely different urgency, and you cannot tell them apart
              without it.
            </p>
            <p>
              An opaque id is enough, because it{' '}
              <strong>resolves to a person in your own database</strong>{' '}
              &mdash; which you control, can query, and can delete. An email
              address in an error report is the same fact stored a second
              time, on infrastructure you do not control, under a retention
              policy you did not set. Sentry&rsquo;s retention window is a
              project setting, not something you configure in code &mdash;
              check it once.
            </p>
            <p>
              Add breadcrumbs for meaningful actions &mdash; what the user was
              doing before it broke is often the whole answer.
            </p>
          </Prose>
        </Section>

        <Section title="Do not send secrets, passwords, tokens, or payment details">
          <Prose>
            <p>
              Sentry data is retained, is accessible to anyone with account
              access, and lives on someone else&rsquo;s infrastructure. The
              stage 04 wizard already created three runtime config files and
              called <code>Sentry.init</code> in each &mdash;{' '}
              <code>instrumentation-client.ts</code>,{' '}
              <code>sentry.server.config.ts</code>,{' '}
              <code>sentry.edge.config.ts</code>. <code>beforeSend</code> is
              added by editing those, not by adding a new one, and the same
              edit goes in all three.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="beforeSend reaches three surfaces &mdash; headers, the body, exception text. The pivot is the redact call: a failed query prints its connection string, password included."
          >
            <AnnotatedArtifact artifact={SCRUBBER} />
          </Figure>
          <Prose>
            <p>
              Scrubbing is a deny-list, and a deny-list is only as current as
              the last time you read it. Reduce what you send in the first
              place: an id instead of an email, a reason code instead of a
              payload.
            </p>
          </Prose>
        </Section>

        <Section title="Which of these does the scrubber reach?">
          <Prose>
            <p>
              <code>beforeSend</code> only sees what Sentry&rsquo;s own capture
              puts on the event. <code>addContext</code> is a separate door:{' '}
              <code>Sentry.setContext</code> accepts whatever you hand it, and
              the deny-list never runs over it &mdash; which is why the helper
              constrains its argument to a flat record of primitives
              (<code>SafeContext</code>) rather than <code>Record&lt;string, unknown&gt;</code>.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-scrubber"
            question={scrubber.QUESTION}
            subtitle={scrubber.SUBTITLE}
            options={scrubber.OPTIONS}
            rows={scrubber.ROWS}
          />
        </Section>

        <Callout kind="warn" title="One loop can spend everything">
          A batch job that throws once per row, over five thousand rows, sends
          five thousand events in a minute or two and empties a month&rsquo;s
          quota &mdash; after which you are blind, and nothing tells you so,
          because the thing that would have told you is the thing that ran
          out. Turn on spike protection, sample the noisy and expected, and set
          one alert on quota consumption itself. It is the only alert in this
          stage about your monitoring rather than your system, which is
          exactly why it gets forgotten.
        </Callout>
      </div>
    ),
  },

  /* ---- Panel 3: logs ---- */
  {
    id: 'logs',
    label: 'Structured logs',
    hint: 'Objects, not sentences',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Logs" title="Log objects, not sentences">
          <Prose>
            <p>
              Sentences are unsearchable at volume.{' '}
              <Term id="structured-logging">Structured logging</Term> means one
              JSON object per line to stdout, which is what every platform in
              this playbook already collects. Any library that does that will
              do; <code>pino</code> is the one shown.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="The logger, configured once so every call shares the same policy. The pivot is the error serializer: a bare Error stringifies to {}, and a stock serializer would keep the message verbatim, connection string and all."
          >
            <AnnotatedArtifact artifact={LOGGER} />
          </Figure>
        </Section>

        <Section title="Levels are a filter, not a mood">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-2 pr-4 text-left font-medium">Level</th>
                  <th className="py-2 text-left font-medium">For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {LEVEL_LADDER.map(([level, use]) => (
                  <tr key={level}>
                    <td className="py-2 pr-4 font-mono text-xs">{level}</td>
                    <td className="py-2 text-muted">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Prose>
            <p>
              <code>error</code> means <em>a fault you would investigate</em>{' '}
              &mdash; it is the level your alerting reads, so anything routine
              that lands there is a false page waiting to happen. A declined
              card is a routine business outcome and not a fault: it is{' '}
              <code>info</code>.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-levels"
            question={levels.QUESTION}
            subtitle={levels.SUBTITLE}
            options={levels.OPTIONS}
            rows={levels.ROWS}
          />
        </Section>

        <Section title="What goes on the line">
          <RevealList
            idPrefix="obs-logline"
            rows={[
              {
                id: 'request-id',
                title: 'A request id on every line',
                summary: 'One field, not distributed tracing, and it is what makes "work out why" possible at two log lines.',
                body: (
                  <div className="space-y-3">
                    <p className="measure text-sm leading-6 text-muted">
                      <code>mixin</code> runs on every log call, so the{' '}
                      <Term id="request-id">request id</Term> attaches itself
                      and no call site has to remember it. Open the store once
                      per request &mdash; in middleware, or the first line of
                      the handler &mdash; with the incoming{' '}
                      <code>x-request-id</code> if there is one, or a fresh{' '}
                      <code>crypto.randomUUID()</code> if there is not.
                    </p>
                    <p className="measure text-sm leading-6 text-muted">
                      Then tag the error report with the same key:{' '}
                      <code>Sentry.setTag(&apos;requestId&apos;, requestId)</code>.
                      Now the error tracker and the logs are searchable by the
                      same id, which is the whole of what tracing buys you until
                      requests start crossing service boundaries.
                    </p>
                  </div>
                ),
              },
              {
                id: 'naming',
                title: 'Name events noun.verb_past_tense, consistently',
                summary: 'invoice.payment_declined, order.created. Consistency is what makes the log searchable a year later.',
                body: (
                  <Card className="overflow-x-auto">
                    <pre className="text-sm leading-6">
                      <code>{`logger.info({
  event: 'invoice.payment_declined',
  userId,
  invoiceId,
  reason: 'card_declined',
  amountCents: 4500,
})`}</code>
                    </pre>
                  </Card>
                ),
              },
              {
                id: 'what-to-log',
                title: 'Log the events that matter, not everything',
                summary: 'Authentication events, payments, permission denials, external API failures, job outcomes, anything irreversible.',
                body: (
                  <RevealFacet label="never log" tone="danger">
                    Passwords, tokens, session IDs, card numbers, or the
                    contents of user documents. The last four digits and an
                    expiry date are still personal data, and &ldquo;it is only
                    partial&rdquo; is not a retention policy.
                  </RevealFacet>
                ),
              },
              {
                id: 'cardinality',
                title: 'Identifiers in logs, never as metric labels',
                summary: 'userId, invoiceId and requestId help you find an event. As labels, each combination is another time series.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    <Term id="cardinality">Cardinality</Term> that is useful
                    for log lookup can make metrics expensive. A bounded event
                    name such as <code>invoice.payment_declined</code> is a
                    fine label; a unique invoice id is not.
                  </p>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: where ---- */
  {
    id: 'where',
    label: 'Where logs go',
    hint: 'Stream, not storage',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Retention" title="stdout is a stream, not storage">
          <Prose>
            <p>
              <code>pino</code> writes to stdout. On every platform in this
              playbook, something collects it, keeps it for a while, and then
              does not. Deciding what that something is, and for how long, is
              part of this stage; discovering it during an incident is not.
            </p>
          </Prose>
          <RevealList
            idPrefix="obs-where"
            rows={[
              {
                id: 'vercel',
                title: 'Vercel',
                summary: 'Runtime logs. Retention is short, and shorter on lower plans.',
                body: (
                  <RevealFacet label="what to set">
                    A drain to a log store if you need more than the built-in
                    window.
                  </RevealFacet>
                ),
              },
              {
                id: 'aws',
                title: 'AWS',
                summary: 'CloudWatch Logs. Retention default: never expire.',
                body: (
                  <div className="space-y-3">
                    <RevealFacet label="what to set" tone="warn">
                      A retention policy per log group, explicitly.
                    </RevealFacet>
                    <p className="measure text-sm leading-6 text-muted">
                      The AWS default is the one that bites. A log group with
                      no retention policy keeps everything forever and bills
                      for it forever, and nobody chose that &mdash; it is what
                      happens when nobody chooses.
                    </p>
                  </div>
                ),
              },
            ]}
          />
          <Prose>
            <p>
              Order of magnitude for a small production service: error
              tracking free to ~$30/month at low volume, uptime monitoring
              free to ~$10, logs the variable one &mdash; single-digit dollars
              if you keep a week and log events rather than everything, and
              unbounded if you keep everything forever. Check current pricing
              rather than trusting this paragraph.
            </p>
          </Prose>
        </Section>

        <Callout kind="info" title="Retention is a privacy decision, not only a cost one">
          Whatever you kept is what you have to be able to delete (
          <Link href="/stages/08-security-audit" className={stageLinkClass}>
            {stageTitle('08-security-audit')}
          </Link>
          ).
        </Callout>
      </div>
    ),
  },

  /* ---- Panel 5: signals ---- */
  {
    id: 'signals',
    label: 'The four signals',
    hint: 'And what normal looks like',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Metrics" title="If you instrument only four things">
          <Prose>
            <p>
              These are the{' '}
              <Term id="golden-signals">golden signals</Term>. Every row states
              its category before it names a product, so a reader on neither
              platform still knows what to look for.
            </p>
          </Prose>
          <RevealList
            idPrefix="obs-signals"
            rows={SIGNALS.map((s) => ({
              id: s.id,
              title: s.name,
              summary: s.source,
              body: (
                <div className="space-y-3">
                  <RevealFacet label="Vercel">
                    <InlineCode text={s.vercel} />
                  </RevealFacet>
                  <RevealFacet label="AWS">
                    <InlineCode text={s.aws} />
                  </RevealFacet>
                </div>
              ),
            }))}
          />
        </Section>

        <Callout kind="warn" title="Error rate does not come from your error tracker">
          Sentry tells you what broke and how many times it was reported; it is
          sampled, it is filtered by <code>beforeSend</code>, and it never sees
          a request that succeeded &mdash; so it can give you neither half of
          the fraction. Both halves come from the layer that counts every
          request: failed responses over total responses, same source, same
          window. Divide a sampled numerator by an unsampled denominator and
          the percentage you get is not a percentage of anything.
        </Callout>

        <Section title="Reading the numbers">
          <Prose>
            <p>
              <strong>Latency</strong> at p50, p95 and p99. A p95 of 400ms
              means at least 95 requests out of every hundred finished at or
              below 400ms. A p99 is the threshold at or below which at least
              99% finished, not a maximum; the slowest request can take much
              longer. Watch the tail.{' '}
              <Term id="percentile">Percentiles</Term> do not average: the p95
              across three instances is not the mean of their three p95s.
            </p>
            <p>
              <strong>Traffic</strong> &mdash; requests per minute. Its main
              value is that a sudden drop is one of the clearest possible
              signals that something is badly broken.{' '}
              <strong>Errors</strong> &mdash; rate as a percentage of requests,
              not an absolute count. Fifty errors means nothing without a
              denominator.{' '}
              <strong><Term id="saturation">Saturation</Term></strong> &mdash;
              how close resources are to their limit. Database connections,
              function concurrency, storage.
            </p>
            <p>
              Check which number you are reading. Every platform sells you two
              different latencies &mdash; the user&rsquo;s experience in the
              browser and the time your server spent &mdash; and the table
              above means the second. On Vercel the per-route latency breakdown
              is an Observability Plus feature; below it you get invocation
              counts and error rate but not the latency split.
            </p>
          </Prose>
        </Section>

        <Callout kind="info" title="Write the numbers down">
          Instrumenting these gives you numbers. It does not give you{' '}
          <em>normal</em>, and without normal none of them is readable: 12
          errors in the last hour is a catastrophe or a Tuesday. Once you have
          a week of ordinary traffic, record the{' '}
          <Term id="baseline">baseline</Term> &mdash; error rate, p95 latency,
          requests per minute at your busy hour and your quiet one &mdash;
          somewhere you will find it at 2am, which means the repository and not
          your memory. Stage 14 uses the same baselines to judge a deploy.
        </Callout>
      </div>
    ),
  },
]
```

- [ ] **Step 4: Run it — expect PASS (6 tests)**

If `three: the traces row` fails on the button name, the `RevealList` row button's accessible name is its title text — `3. Traces` — and the regex `/Traces/` matches it. If `signals` fails on `^Latency`, check whether the row title renders a leading element; adjust the regex to `/Latency/`, not the data.

- [ ] **Step 5: Lint and typecheck the file**

Run: `pnpm lint && pnpm typecheck`
Expected: clean. The most likely lint failure is a missing `{' '}` next to a `<Term>` — the fix is the space, never removing the term.

- [ ] **Step 6: Commit**

```bash
git add src/features/observability/panels-collect.tsx src/features/observability/panels-collect.test.tsx
git commit -m "feat(observability): first five panels — three things through the four signals"
```

---

### Task 9: Panels — health, alerts, silence, ai, done

**Files:**
- Create: `web/src/features/observability/panels-act.tsx`, `panels-act.test.tsx`

**Interfaces:**
- Consumes: `Drill` (Task 5); `HEALTH`, `CANARY`, `HEARTBEAT` (Task 3); the `alert-triage` and `silence` datasets (Task 2); `AIPlays`, `ObservabilityChecklist` (Task 6); `TRAPS` (Task 1); terms and references (Task 7).
- Produces: `ACT_STEPS: (Step & { id: StepId })[]` — five steps, `health` … `done`, consumed by Task 10.

- [ ] **Step 1: Write the failing render test**

```tsx
// web/src/features/observability/panels-act.test.tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Stepper } from '@/components/Stepper'
import { ACT_STEPS } from './panels-act'
import { ROWS as TRIAGE_ROWS } from './alert-triage'
import { ROWS as SILENCE_ROWS } from './silence'
import { TRAPS } from './traps'
import { DONE } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

const go = (label: RegExp) =>
  fireEvent.click(screen.getByRole('tab', { name: label }))

describe('act panels', () => {
  test('five steps, in order', () => {
    render(<Stepper steps={ACT_STEPS} />)
    expect(ACT_STEPS.map((s) => s.id)).toEqual([
      'health', 'alerts', 'silence', 'ai', 'done',
    ])
    expect(screen.getAllByRole('tab')).toHaveLength(5)
  })

  test('health: the readiness artifact, the liveness route, and the figure', () => {
    render(<Stepper steps={ACT_STEPS} />)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/src\/app\/api\/health\/route\.ts/)
    expect(panel.textContent).toMatch(/return new Response\('ok'\)/)
    expect(panel.textContent).toMatch(/Restart decision/)
    expect(panel.textContent).toMatch(/Routing decision/)
    expect(panel.textContent).toMatch(/need not fail every route/)
  })

  test('alerts: the triage drill mounts with eleven rows', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/Alerts/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(TRIAGE_ROWS.length)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/A ratio needs a floor/)
    expect(panel.textContent).toMatch(/Incident Management/)
  })

  test('silence: canary and heartbeat artifacts, and the silence drill', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/nothing reports/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/src\/app\/api\/canary\/route\.ts/)
    expect(panel.textContent).toMatch(/HEARTBEAT_URL/)
    expect(screen.getAllByRole('radiogroup')).toHaveLength(SILENCE_ROWS.length)
    expect(panel.textContent).toMatch(/Absence of a signal is not evidence of health/)
    expect(panel.textContent).toMatch(/Withhold a ping/)
  })

  test('ai: six plays', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/AI plays/)
    expect(screen.getAllByText('Prompt')).toHaveLength(5)
    expect(screen.getByText('CLI + browser tool')).toBeTruthy()
  })

  test('done: dashboards, every trap, the checklist, and references', () => {
    render(<Stepper steps={ACT_STEPS} />)
    go(/Traps/)
    const panel = screen.getByRole('tabpanel')
    expect(panel.textContent).toMatch(/is the application healthy right now/)
    expect(panel.textContent).toMatch(/sentry-cli releases new/)
    for (const t of TRAPS) {
      expect(panel.textContent, t.id).toContain(t.title.replace(/`/g, ''))
    }
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
    expect(panel.textContent).toMatch(/Four Golden Signals/)
  })
})
```

- [ ] **Step 2: Run it — expect FAIL** (`Cannot find module './panels-act'`)

Run: `pnpm vitest run src/features/observability/panels-act.test.tsx`

- [ ] **Step 3: Create `panels-act.tsx`**

```tsx
// web/src/features/observability/panels-act.tsx
import Link from 'next/link'
import type { Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { RevealList } from '@/components/RevealList'
import { RevealFacet } from '@/components/RevealFacet'
import { getStage } from '@/lib/stages'
import { Drill } from './Drill'
import { AIPlays } from './AIPlays'
import { ObservabilityChecklist } from './ObservabilityChecklist'
import { CANARY, HEALTH, HEARTBEAT } from './artifacts'
import * as triage from './alert-triage'
import * as silence from './silence'
import { TRAPS } from './traps'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

/**
 * Figure 6: which platform mechanism reads which endpoint. Static — two
 * columns, no interaction — because the lesson is the mapping itself.
 */
function RestartVsRouting() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <p className="t-label mb-2 text-brand">Restart decision</p>
        <p className="text-sm text-muted">
          Fly, ECS, Cloud Run, a Kubernetes liveness probe. Asks &ldquo;is
          this process wedged?&rdquo;
        </p>
        <p className="mt-3 border-t border-line pt-3 text-sm">
          Reads the <Term id="liveness">liveness</Term> endpoint &mdash;{' '}
          <code>/api/health/live</code>, <code>200</code> whenever the process
          is running.
        </p>
      </Card>
      <Card>
        <p className="t-label mb-2 text-brand">Routing decision</p>
        <p className="text-sm text-muted">
          A load balancer&rsquo;s health check, a Kubernetes readiness probe.
          Asks &ldquo;should traffic come here right now?&rdquo;
        </p>
        <p className="mt-3 border-t border-line pt-3 text-sm">
          Reads the <Term id="readiness">readiness</Term> endpoint &mdash;{' '}
          <code>/api/health</code>, which checks the database and returns{' '}
          <code>503</code> when it cannot.
        </p>
      </Card>
    </div>
  )
}

export const ACT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 6: health ---- */
  {
    id: 'health',
    label: 'Health checks',
    hint: 'Liveness vs readiness',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Health" title="Check real dependencies">
          <Prose>
            <p>
              An endpoint returning <code>200 OK</code> unconditionally tells
              you the process is running, which you already knew. The
              realistic failure is not <em>refused</em>, it is <em>hung</em>{' '}
              &mdash; an exhausted pool, a network partition &mdash; and
              without the <Term id="timeout">timeout</Term> the health check
              hangs with it and never returns the <code>degraded</code> state
              it exists to report.
            </p>
          </Prose>
          <Figure
            n={3}
            caption="The readiness endpoint. The pivot is the race: without it the check fails in exactly the case it was written for."
          >
            <AnnotatedArtifact artifact={HEALTH} />
          </Figure>
        </Section>

        <Section title="Two different things ask whether you are up">
          <Prose>
            <p>
              <strong><Term id="liveness">Liveness</Term></strong> is &ldquo;is
              this process wedged, should the platform restart it&rdquo;
              &mdash; and the honest answer depends on nothing but the
              process, because a restart cannot fix a database.{' '}
              <strong><Term id="readiness">Readiness</Term></strong>, which is
              what the endpoint above does, is &ldquo;should traffic come
              here, is everything it depends on reachable&rdquo;.
            </p>
          </Prose>
          <Figure
            n={6}
            caption="A restart decision and a routing decision read different endpoints. Wire the restart trigger to the dependency check and a thirty-second database blip restarts every instance you have, simultaneously."
          >
            <RestartVsRouting />
          </Figure>
          <Prose>
            <p>The liveness endpoint is the trivial one, deliberately &mdash; it has nothing to check:</p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-6">
              <code>{`// src/app/api/health/live/route.ts — wire the platform's restart trigger here
export async function GET() {
  return new Response('ok')
}`}</code>
            </pre>
          </Card>
          <Prose>
            <p>
              If this ever grows a dependency check, it has stopped being a
              liveness endpoint.
            </p>
            <p>
              Readiness does not have to be all-or-nothing, either. If a
              service depends on several things a request might not all need,
              one dependency being down does not have to fail every route:
              treat each dependency&rsquo;s health as a fact a handler can
              read, and let the handler decide whether its own dependency is
              required. A payment provider outage need not fail every route.
            </p>
            <p>
              Point your uptime monitor at the dependency-checking one &mdash;
              but not only at <code>/api/health</code>. Monitor a real user
              path too; the health check can pass while the page a user
              actually loads throws.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 7: alerts ---- */
  {
    id: 'alerts',
    label: 'Alerts you will act on',
    hint: 'Actionable, or deleted',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Alerts" title="The only rule that matters: every alert must be actionable">
          <Prose>
            <p>
              An alert you cannot act on trains you to dismiss alerts, and
              after a few weeks of that you will dismiss the real one without
              reading it.{' '}
              <Term id="alert-fatigue">Alert fatigue</Term> is not a
              discipline failure; it is the predictable result of noisy
              alerts.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-triage"
            question={triage.QUESTION}
            subtitle={triage.SUBTITLE}
            options={triage.OPTIONS}
            rows={triage.ROWS}
          />
        </Section>

        <Section title="The rules behind the verdicts">
          <RevealList
            idPrefix="obs-alert-rules"
            rows={[
              {
                id: 'symptoms',
                title: 'Alert on symptoms, not causes — with one exception',
                summary: '"Users cannot check out" is actionable. "CPU is at 80%" is not.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The exception is the reason &ldquo;database connections
                    near the limit&rdquo; pages: a resource with a{' '}
                    <strong>hard ceiling</strong> that{' '}
                    <strong>does not recover on its own</strong> &mdash; a
                    connection pool, a disk, an API quota &mdash; is worth
                    alerting on <em>before</em> it becomes a symptom, because
                    crossing it is a cliff rather than a slope. CPU has the
                    ceiling but not the second half: it is elastic, it comes
                    back on its own, and crossing 80% degrades rather than
                    fails.
                  </p>
                ),
              },
              {
                id: 'floor',
                title: 'A ratio needs a floor',
                summary: '"Error rate above 5%" is sensible at a thousand requests a minute and nonsense at four.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    One failed request overnight is a 25% error rate, and it
                    will page you. Gate every ratio alert on a minimum volume
                    &mdash; <em>above 5% and at least twenty requests in the
                    window</em> &mdash; and add a plain count alongside it for
                    the traffic levels where the ratio is noise.
                  </p>
                ),
              },
              {
                id: 'three-moves',
                title: 'Three moves for an alert that woke you four times without needing action',
                summary: 'Raise the threshold, lengthen the window, or delete it. Reach for the first two before the third.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Four fires a week is usually a threshold set from a guess
                    rather than from a baseline. Delete without hesitation when
                    it has never once led to action; an alert nobody acts on
                    is training you to ignore the one that matters.
                  </p>
                ),
              },
            ]}
          />
        </Section>

        <Callout kind="warn" title="Fire a test alert on purpose">
          Route to somewhere that will actually interrupt you &mdash; push
          notification or SMS; email is read the next morning. Then confirm it
          reaches you on the device you expect to be woken by. An alert routed
          to a dead phone number, an expired webhook, or an app whose
          notifications you silenced in a meeting is indistinguishable from a
          healthy system, forever. Do it when you set the alert up, and again
          when you change how you are reachable.
        </Callout>

        <Prose>
          <p>
            This stage stops at the alert arriving. What you do in the five
            minutes after it is{' '}
            <Link href="/stages/16-incident-management" className={stageLinkClass}>
              {stageTitle('16-incident-management')}
            </Link>
            . Read it before the alert.
          </p>
        </Prose>
      </div>
    ),
  },

  /* ---- Panel 8: silence ---- */
  {
    id: 'silence',
    label: 'When nothing reports',
    hint: 'And jobs nobody watches',
    content: (
      <div className="space-y-16">
        <Section eyebrow="From outside" title="Monitor a real user path from outside">
          <Prose>
            <p>
              If Vercel has a regional problem or your DNS breaks, internal
              monitoring reports that everything is fine because nothing is
              reaching it. An external check every minute against a real page
              is the cheapest meaningful monitoring you can buy. Turn on
              certificate-expiry checking while you are there &mdash; it is
              the one failure here that arrives on a schedule you could have
              read months in advance.
            </p>
            <p>
              If you are an API behind authentication, you need a{' '}
              <Term id="canary">canary</Term> endpoint: one route, authenticated
              with a token issued to the monitor and nothing else, that reads
              far enough down the real path to prove it works and{' '}
              <strong>writes nothing</strong>.
            </p>
          </Prose>
          <Figure
            n={4}
            caption="Reads the last order back instead of creating one. The pivot is the empty-result branch: a status-only monitor cannot see a failure inside a 200."
          >
            <AnnotatedArtifact artifact={CANARY} />
          </Figure>
        </Section>

        <Section title="Absence of a signal is not evidence of health">
          <Prose>
            <p>
              Everything above fires when something happens. Nothing above
              fires when something <strong>stops</strong>, and a system that
              has gone quiet looks exactly like a system that is fine.
            </p>
          </Prose>
          <Drill
            idPrefix="obs-silence"
            question={silence.QUESTION}
            subtitle={silence.SUBTITLE}
            options={silence.OPTIONS}
            rows={silence.ROWS}
          />
          <Prose>
            <p>
              The fix is not more error tracking. It is to{' '}
              <strong>count the outcomes you care about, not just the
              exceptions</strong>. Once <code>order.created</code> is a counted
              event, its <em>absence</em> is measurable, and &ldquo;no orders
              in ninety minutes on a Tuesday afternoon&rdquo; is an alert you
              can actually write. When someone reports a failure your tools
              did not see, that gap is the finding &mdash; not the report.
            </p>
          </Prose>
        </Section>

        <Section title="Jobs that nobody watches">
          <Prose>
            <p>
              A scheduled job that <strong>never ran</strong> produces no
              exception, no log line and no request. Every mechanism in this
              stage reports that the system is healthy, and it is &mdash; the
              job is simply not part of it any more. The instrument is a{' '}
              <Term id="heartbeat">heartbeat</Term>, and it is the only
              monitor here that alerts on silence.
            </p>
          </Prose>
          <Figure
            n={5}
            caption="On the success path only. The pivot is the ping itself; the duration rides along with it."
          >
            <AnnotatedArtifact artifact={HEARTBEAT} />
          </Figure>
          <RevealList
            idPrefix="obs-jobs"
            rows={[
              {
                id: 'not-in-finally',
                title: 'Not in a finally',
                summary: 'A ping in a finally block reports success for a run that threw.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Which converts your only detector of silence into a source
                    of false confidence. The health check&rsquo;s{' '}
                    <code>finally</code> two steps back is resource cleanup;
                    this one would be a false success signal.
                  </p>
                ),
              },
              {
                id: 'aws',
                title: 'On AWS: TreatMissingData, set explicitly',
                summary: 'A CloudWatch alarm over a custom metric the job emits, with TreatMissingData set to breaching.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    The default is <code>missing</code>, which tells the alarm
                    to disregard absent data points when deciding its state
                    &mdash; which is precisely the condition you are trying to
                    catch. Better Stack, Healthchecks.io and Cronitor all offer
                    the heartbeat URL directly.
                  </p>
                ),
              },
              {
                id: 'withhold',
                title: 'Withhold a ping on purpose and confirm the page arrives',
                summary: 'A heartbeat you have only ever seen succeed has never actually been tested.',
                body: (
                  <p className="measure text-sm leading-6 text-muted">
                    Disable the job, or comment out the fetch call, for one
                    window on a non-production schedule, and watch the monitor
                    treat the silence as a failure &mdash; the same way you
                    tested alert delivery. The day it needs to catch silence is
                    the wrong day to find out its threshold was set from a
                    guess.
                  </p>
                ),
              },
              {
                id: 'duration-overlap',
                title: 'Slower every night, or overlapping itself',
                summary: 'Two failure shapes neither an error rate nor a heartbeat will show.',
                body: (
                  <div className="space-y-3">
                    <RevealFacet label="duration">
                      A reconciliation that has gone from four minutes to forty
                      is on its way to overrunning its window. The heartbeat
                      already sends <code>durationMs</code> &mdash; set a
                      threshold on it if your monitor supports one.
                    </RevealFacet>
                    <RevealFacet label="overlap">
                      Two copies running concurrently is a different bug from
                      either of them failing. Take an advisory lock (or check a
                      &ldquo;job running&rdquo; flag) before starting, so a
                      second invocation logs the conflict and exits.
                    </RevealFacet>
                  </div>
                ),
              },
            ]}
          />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 9: ai ---- */
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where agents help',
    content: (
      <div className="space-y-16">
        <Section title="AI in observability">
          <AIPlays />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 10: done ---- */
  {
    id: 'done',
    label: 'Traps & checklist',
    hint: 'The last step',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Dashboards" title="One screen: is the application healthy right now?">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Requests per minute</li>
            <li>Error rate</li>
            <li>p95 latency</li>
            <li>Saturation of whatever is closest to its ceiling &mdash; usually database connections</li>
            <li>Recent deploys, marked on the timeline</li>
          </ul>
          <Prose>
            <p>
              Saturation is the one most likely to be the actual incident on a
              small deployment, and the one that gets dropped first. Deploy
              markers are disproportionately useful: most problems correlate
              with a deploy. A deploy marker is not a feature of your
              dashboard. It is an <strong>event with a timestamp</strong>,
              emitted by whatever performs the deploy &mdash; so the work is
              in your deploy step.
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-6">
              <code>{`# In the deploy job, after the deploy succeeds.
sentry-cli releases new "$GITHUB_SHA"
sentry-cli releases set-commits "$GITHUB_SHA" --auto
sentry-cli releases finalize "$GITHUB_SHA"`}</code>
            </pre>
          </Card>
          <Prose>
            <p>
              On Vercel, the Sentry integration creates releases for you. On
              AWS, nothing emits the event unless you do: add the step above
              to the deploy workflow, and a CloudWatch or Grafana annotation
              for the dashboard. Resist adding more &mdash; a dashboard with
              forty charts is not read. You can keep separate collection tools
              and still see all four signals together: a visualization layer
              such as Grafana can query several data sources in one dashboard.
            </p>
          </Prose>
        </Section>

        <Section title="Traps">
          <div className="space-y-4">
            {TRAPS.map((trap) => (
              <Callout key={trap.id} kind="trap" title={trap.title.replace(/`/g, '')}>
                <p>
                  <InlineCode text={trap.body} />
                </p>
              </Callout>
            ))}
          </div>
        </Section>

        <Section title="Done">
          <ObservabilityChecklist />
        </Section>

        <References slug="15-observability" />
      </div>
    ),
  },
]
```

- [ ] **Step 4: Run it — expect PASS (6 tests)**

The `done` test's `Four Golden Signals` assertion depends on Task 7's references having landed; if it fails there, that is the dependency, not the panel.

- [ ] **Step 5: Lint and typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/features/observability/panels-act.tsx src/features/observability/panels-act.test.tsx
git commit -m "feat(observability): last five panels — health checks through traps and checklist"
```

---
