# Stage 14 (Post-Deployment Verification) Interactive Port

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the 343-line corrected doc (`docs/14-post-deployment-verification.md`) into an interactive stage at `web/src/features/post-deployment-verification/` with 6 steps, 4 AI plays, 11 traps, an AWS verification artifact, and an 11-item DoD checklist.

**Architecture:** Six-step Stepper: verify (ten-minute check as RevealList), vercel (four tools as RevealList), aws (six-command annotated artifact), recovery (rollback-first + four failure patterns), ai (standard AIPlays), done (traps + checklist + references). The stage follows the exact pattern established by stages 12 and 13.

**Tech Stack:** Next.js 16, React 19, TypeScript, vitest, @testing-library/react, Tailwind v4

**Spec:** `docs/superpowers/specs/2026-09-04-stage-14-interactive-port-design.md`

## Global Constraints

- TDD: every data file gets a failing test before the data is written; every component gets a render test.
- All data is pinned against `docs/14-post-deployment-verification.md` via the `doc-source.ts` helpers (`section`, `h2`, `flat`, `fences`).
- Three-file registration (stages.ts + stage-content.ts + step-ids.ts) is one atomic commit in the assembly task.
- `InlineCode` renders backtick-delimited spans in data strings; use backticks in data where the doc uses code formatting.
- The `Artifact` type's `language` union is defined in `web/src/components/artifact.ts`. If `'bash'` is not already a member, add it (additive, no breakage).
- Run all commands from `web/`.
- Commit after each task with a conventional-commit message and the co-authored-by trailer.

---

### Task 1: Data scaffolding — steps, doc-source, traps, checklist

**Files:**
- Create: `web/src/features/post-deployment-verification/doc-source.ts`
- Create: `web/src/features/post-deployment-verification/steps.ts`
- Create: `web/src/features/post-deployment-verification/steps.test.ts`
- Create: `web/src/features/post-deployment-verification/traps.ts`
- Create: `web/src/features/post-deployment-verification/traps.test.ts`
- Create: `web/src/features/post-deployment-verification/checklist.ts`
- Create: `web/src/features/post-deployment-verification/checklist.test.ts`
- Create: `web/src/features/post-deployment-verification/prose.test.ts`

**Interfaces:**
- Produces: `STEP_IDS` (6-element `as const` tuple), `StepId` type, `TRAPS: Trap[]` (11 items), `DONE: DoneItem[]` (11 items), `ARTIFACT_LIST: string[]` (3 items), `TEAM: TeamNote[]` (4 items), `DOC`, `section`, `h2`, `flat`, `fences` from `doc-source.ts`

- [ ] **Step 1: Create `doc-source.ts`**

```ts
// web/src/features/post-deployment-verification/doc-source.ts
import { docSource } from '@/test/doc-source'

export const { DOC, section, h2, flat, fences } = docSource(
  'docs/14-post-deployment-verification.md',
)
```

- [ ] **Step 2: Write the failing steps test**

```ts
// web/src/features/post-deployment-verification/steps.test.ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('post-deployment verification steps', () => {
  test('six steps in exact order', () => {
    expect(STEP_IDS).toEqual([
      'verify',
      'vercel',
      'aws',
      'recovery',
      'ai',
      'done',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/steps.test.ts`
Expected: FAIL — module not found

- [ ] **Step 4: Write `steps.ts`**

```ts
// web/src/features/post-deployment-verification/steps.ts
export const STEP_IDS = [
  'verify',
  'vercel',
  'aws',
  'recovery',
  'ai',
  'done',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run src/features/post-deployment-verification/steps.test.ts`
Expected: PASS

- [ ] **Step 6: Write the failing traps test**

```ts
// web/src/features/post-deployment-verification/traps.test.ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('post-deployment verification traps data', () => {
  const src = h2('Traps')

  test('eleven traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(11)
    expect(TRAPS).toHaveLength(11)
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

  test('body pin: deploy-succeeded-as-done', () => {
    expect(flat(src)).toContain(flat('The build compiled. That is all you know'))
  })

  test('body pin: cached-browser', () => {
    expect(flat(src)).toContain(
      flat('you are looking at the old build from your own cache'),
    )
  })

  test('body pin: services-stable-alone (AWS)', () => {
    expect(flat(src)).toContain(
      flat('does not verify that ALB targets are healthy'),
    )
  })

  test('every trap has text content', () => {
    for (const t of TRAPS) {
      expect(t.title.length, `${t.id} title`).toBeGreaterThan(10)
      expect(t.body.length, `${t.id} body`).toBeGreaterThan(15)
    }
  })
})
```

- [ ] **Step 7: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/traps.test.ts`
Expected: FAIL — module not found

- [ ] **Step 8: Write `traps.ts`**

Read `docs/14-post-deployment-verification.md` section `## Traps` and extract all 10 bold-lead trap entries. Each trap gets a kebab-case `id`, the bold text as `title` (without the trailing period), and the body text as `body`.

```ts
// web/src/features/post-deployment-verification/traps.ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  // 8 general traps from the doc's "## Traps" section, in order:
  // deploy-succeeded-as-done, cached-browser, checking-too-early,
  // no-baseline, destructive-smoke-tests, happy-path-only,
  // skipping-trivial, checking-once
  // Then 3 AWS-specific traps:
  // services-stable-alone, no-deployment-alarms, bake-time-too-short
  // Total: 11
  //
  // Populate each { id, title, body } from the doc's bold leads and
  // their following paragraph, verbatim. The test pins titles against
  // the doc's bold leads.
]
```

**Important:** There are 11 bold leads in the doc's `## Traps` section — 8 general traps followed by 3 AWS-specific traps. Count them and match your array length to 11.

- [ ] **Step 9: Run traps test to verify it passes**

Run: `pnpm vitest run src/features/post-deployment-verification/traps.test.ts`
Expected: PASS (all pins match)

- [ ] **Step 10: Write the failing checklist test**

```ts
// web/src/features/post-deployment-verification/checklist.test.ts
import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('post-deployment verification checklist data', () => {
  test('done items match doc checkboxes', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(DONE).toHaveLength(checks.length)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('artifacts match doc list', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(ARTIFACT_LIST).toHaveLength(items.length)
  })

  test('done pin: production URL loads', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Production URL loads in a real browser'),
    )
  })

  test('done pin: re-checked at 30 minutes', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(flat('Re-checked at ~30 minutes'))
  })

  test('team notes match doc scaling bullets', () => {
    const src = h2('Scaling to a team')
    const boldLeads = src.match(/^- \*\*.+?\*\*/gm) ?? []
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

- [ ] **Step 11: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/checklist.test.ts`
Expected: FAIL — module not found

- [ ] **Step 12: Write `checklist.ts`**

Read `docs/14-post-deployment-verification.md` sections `## Definition of done` (11 checkbox items), `## Artifacts` (3 bullet items), and `## Scaling to a team` (4 bullet items). Use the same `DoneItem`, `TeamNote` types as stage 13.

```ts
// web/src/features/post-deployment-verification/checklist.ts
export type DoneItem = {
  id: string
  label: string
}

export type TeamNote = {
  id: string
  title: string
  body: string
}

// DONE: 11 items from the doc's "## Definition of done" checkboxes
export const DONE: DoneItem[] = [
  // { id: 'url-loads', label: 'Production URL loads in a real browser' },
  // ... 10 more from the doc, in order
]

// TEAM: 4 notes from "## Scaling to a team" bullets
export const TEAM: TeamNote[] = [
  // { id: 'deployer-verifies', title: 'The deployer verifies', body: '...' },
  // ... 3 more
]

// ARTIFACT_LIST: 3 strings from "## Artifacts" bullets
export const ARTIFACT_LIST: string[] = [
  // 'A smoke test suite runnable against production',
  // ... 2 more
]
```

- [ ] **Step 13: Run checklist test to verify it passes**

Run: `pnpm vitest run src/features/post-deployment-verification/checklist.test.ts`
Expected: PASS

- [ ] **Step 14: Write the prose pin test**

```ts
// web/src/features/post-deployment-verification/prose.test.ts
import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('post-deployment verification prose pins', () => {
  test('ten-minute check — is it up', () => {
    const src = section('The ten-minute check')
    expect(flat(src)).toContain(
      flat('Load the production URL'),
    )
  })

  test('ten-minute check — new issue type strongest signal', () => {
    const src = section('The ten-minute check')
    expect(flat(src)).toContain(
      flat('the strongest signal there is'),
    )
  })

  test('verify with production data volumes', () => {
    const src = section('Verify with production data volumes')
    expect(flat(src)).toContain(
      flat('instant against 50 seeded rows and takes eight seconds'),
    )
  })

  test('vercel — Vercel Analytics', () => {
    const src = section('Vercel: where to look')
    expect(flat(src)).toContain(flat('Vercel Analytics'))
  })

  test('aws — wait services-stable', () => {
    const src = section('AWS: where to look')
    expect(flat(src)).toContain(flat('aws ecs wait services-stable'))
  })

  test('aws — describe-target-health', () => {
    const src = section('AWS: where to look')
    expect(flat(src)).toContain(flat('describe-target-health'))
  })

  test('recovery — roll back first', () => {
    const src = section('When something is wrong')
    expect(flat(src)).toContain(flat('Roll back first'))
  })

  test('recovery — env var misconfiguration', () => {
    const src = section('When something is wrong')
    expect(flat(src)).toContain(flat('Environment variable misconfiguration'))
  })

  test('half-hour follow-up', () => {
    const src = section('The half-hour follow-up')
    expect(flat(src)).toContain(flat('Check back once at around thirty minutes'))
  })

  test('scaling — the deployer verifies', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('The deployer verifies'))
  })
})
```

- [ ] **Step 15: Run prose test to verify it passes**

Run: `pnpm vitest run src/features/post-deployment-verification/prose.test.ts`
Expected: PASS (these pin against the already-committed doc)

- [ ] **Step 16: Run full test suite for the new directory**

Run: `pnpm vitest run src/features/post-deployment-verification/`
Expected: All tests pass

- [ ] **Step 17: Commit**

```bash
git add web/src/features/post-deployment-verification/
git commit -m 'feat(post-deployment-verification): scaffold data layer — steps, traps, checklist, prose pins

Six step IDs, 11 traps (8 general + 3 AWS), 11 DoD items, 3 artifacts,
4 team notes. All pinned against docs/14-post-deployment-verification.md.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014k7DKLBHJCf8h1MmZsYssJ'
```

---

### Task 2: AI plays + AWS verification artifact

**Files:**
- Create: `web/src/features/post-deployment-verification/ai-plays.ts`
- Create: `web/src/features/post-deployment-verification/ai-plays.test.ts`
- Create: `web/src/features/post-deployment-verification/aws-verification.ts`
- Create: `web/src/features/post-deployment-verification/aws-verification.test.ts`
- Possibly modify: `web/src/components/artifact.ts` (add `'bash'` to `language` union if missing)

**Interfaces:**
- Consumes: `doc-source.ts` (`section`, `flat`)
- Produces: `AI_PREMISE: string`, `AI_LIMIT: string`, `PLAYS: Play[]` (4 items), `AWS_VERIFICATION: Artifact`

- [ ] **Step 1: Check whether `'bash'` is in the `Artifact.language` union**

Run: `grep -n "language:" web/src/components/artifact.ts`

If `'bash'` is not listed, add it to the union. This is additive and breaks nothing.

- [ ] **Step 2: Write the failing AI plays test**

```ts
// web/src/features/post-deployment-verification/ai-plays.test.ts
import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('post-deployment verification AI plays data', () => {
  const src = section('AI in post-deployment verification')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(
      flat('the rules are explicit'),
    )
  })

  test('limit pins against doc — silent failure', () => {
    expect(flat(src)).toContain(flat('a silent failure, a dropped webhook'))
  })

  test('four plays', () => {
    expect(PLAYS).toHaveLength(4)
  })

  test('unique IDs', () => {
    const ids = PLAYS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all kinds are valid', () => {
    const valid = new Set(['mcp', 'command', 'prompt', 'cli'])
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

  test('has a smoke test play', () => {
    expect(PLAYS.some((p) => p.id === 'generate-smoke-suite')).toBe(true)
  })

  test('has a CloudWatch baseline play', () => {
    expect(PLAYS.some((p) => p.id === 'compare-baseline')).toBe(true)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/ai-plays.test.ts`
Expected: FAIL — module not found

- [ ] **Step 4: Write `ai-plays.ts`**

Read `docs/14-post-deployment-verification.md` section `### AI in post-deployment verification`. Extract:
- `AI_PREMISE`: the opening paragraph ("An agent is good at the mechanical parts...")
- `AI_LIMIT`: the closing paragraph ("An agent that reports 'no new errors'...")
- `PLAYS`: 4 plays from the bulleted list, each with `id`, `title` (the bold lead), `kind` (from the parenthetical: prompt, cli, command, or mcp — see the doc's parenthetical labels), `body` (the explanation text).

```ts
// web/src/features/post-deployment-verification/ai-plays.ts
export const AI_PREMISE = '...' // from doc

export const AI_LIMIT = '...' // from doc

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'generate-smoke-suite',
    title: 'Generate a smoke test suite from a manual checklist',
    kind: 'prompt',
    body: '...',
  },
  {
    id: 'parse-anomalies',
    title: 'Parse Sentry or CloudWatch for anomaly patterns',
    kind: 'prompt',
    body: '...',
  },
  {
    id: 'run-ten-minute-check',
    title: 'Run the ten-minute check against a deployed URL',
    kind: 'mcp', // doc says "A CLI + MCP command"
    body: '...',
  },
  {
    id: 'compare-baseline',
    title: 'Compare CloudWatch metrics to a stored baseline',
    kind: 'prompt',
    body: '...',
  },
]
```

- [ ] **Step 5: Run AI plays test to verify it passes**

Run: `pnpm vitest run src/features/post-deployment-verification/ai-plays.test.ts`
Expected: PASS

- [ ] **Step 6: Write the failing AWS verification artifact test**

```ts
// web/src/features/post-deployment-verification/aws-verification.test.ts
import { describe, expect, test } from 'vitest'
import { AWS_VERIFICATION } from './aws-verification'

describe('AWS verification artifact data', () => {
  test('language is bash', () => {
    expect(AWS_VERIFICATION.language).toBe('bash')
  })

  test('has id and filename', () => {
    expect(AWS_VERIFICATION.id).toBeTruthy()
    expect(AWS_VERIFICATION.filename).toBeTruthy()
  })

  test('contains wait services-stable command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws ecs wait services-stable')
  })

  test('contains describe-services command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws ecs describe-services')
  })

  test('contains describe-target-health command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('describe-target-health')
  })

  test('contains logs tail command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws logs tail')
  })

  test('at least six annotated lines', () => {
    const annotated = AWS_VERIFICATION.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(6)
  })

  test('exactly one pivot line on describe-target-health', () => {
    const pivots = AWS_VERIFICATION.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
    expect(pivots[0].text).toContain('describe-target-health')
  })
})
```

- [ ] **Step 7: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/aws-verification.test.ts`
Expected: FAIL — module not found

- [ ] **Step 8: Write `aws-verification.ts`**

Build the artifact from `docs/14-post-deployment-verification.md` section `### AWS: where to look`. Six commands, each annotated with what it checks. Pivot on `describe-target-health`.

```ts
// web/src/features/post-deployment-verification/aws-verification.ts
import type { Artifact } from '@/components/artifact'

export const AWS_VERIFICATION: Artifact = {
  id: 'aws-ecs-verification',
  filename: 'verify-ecs-deploy.sh',
  language: 'bash',
  lines: [
    // Command 1: wait services-stable
    { text: '# 1. Wait for the service to stabilize', note: 'Polls every 15s, times out after ~10 minutes.' },
    { text: 'aws ecs wait services-stable \\' },
    { text: '  --cluster $CLUSTER --services $SERVICE' },
    { text: '' },
    // Command 2: describe-services (deployments)
    { text: '# 2. Verify the deployment completed', note: 'One PRIMARY deployment, rolloutState COMPLETED, failedTasks 0.' },
    { text: 'aws ecs describe-services --cluster $CLUSTER \\' },
    { text: "  --services $SERVICE --query 'services[0].deployments[*].\\" },
    { text: "  [status,rolloutState,runningCount,desiredCount,failedTasks]'" },
    { text: '' },
    // Command 3: describe-target-health (PIVOT)
    { text: '# 3. Check ALB target health', note: 'The check services-stable does not do. Always run separately.', pivot: true },
    { text: 'aws elbv2 describe-target-health \\' },
    { text: '  --target-group-arn $TG_ARN' },
    { text: '' },
    // Command 4: describe-services (events)
    { text: '# 4. Read recent service events', note: 'Look for "has reached a steady state." Repeated restarts = crash loop.' },
    { text: 'aws ecs describe-services --cluster $CLUSTER \\' },
    { text: "  --services $SERVICE --query 'services[0].events[0:5].\\" },
    { text: "  [createdAt,message]' --output table" },
    { text: '' },
    // Command 5: describe-tasks (container health)
    { text: '# 5. Check container health', note: 'Docker-level health check, distinct from ALB target health.' },
    { text: 'aws ecs describe-tasks --cluster $CLUSTER \\' },
    { text: "  --tasks $TASK_ID --query 'tasks[0].containers[*].\\" },
    { text: "  [name,lastStatus,healthStatus,reason]'" },
    { text: '' },
    // Command 6: logs
    { text: '# 6. Inspect logs for error bursts', note: 'Filter for ERROR; tail with --follow for live watching.' },
    { text: 'aws logs tail /ecs/$LOG_GROUP --since 15m' },
  ],
}
```

**Note:** Adjust the exact line breaks so that no single line overflows at 320px. Use `\\` continuation where `--query` strings are long. The exact line structure must satisfy the test assertions above.

- [ ] **Step 9: Run AWS verification test to verify it passes**

Run: `pnpm vitest run src/features/post-deployment-verification/aws-verification.test.ts`
Expected: PASS

- [ ] **Step 10: Run full test suite for the directory**

Run: `pnpm vitest run src/features/post-deployment-verification/`
Expected: All tests pass

- [ ] **Step 11: Commit**

```bash
git add web/src/features/post-deployment-verification/ web/src/components/artifact.ts
git commit -m 'feat(post-deployment-verification): add AI plays data and AWS verification artifact

Four plays (generate smoke suite, parse anomalies, run ten-minute check,
compare baseline). AWS verification artifact: six-command bash sequence,
pivot on describe-target-health.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014k7DKLBHJCf8h1MmZsYssJ'
```

---

### Task 3: Components — AIPlays, VerificationChecklist, render tests

**Files:**
- Create: `web/src/features/post-deployment-verification/AIPlays.tsx`
- Create: `web/src/features/post-deployment-verification/AIPlays.test.tsx`
- Create: `web/src/features/post-deployment-verification/VerificationChecklist.tsx`
- Create: `web/src/features/post-deployment-verification/VerificationChecklist.test.tsx`

**Interfaces:**
- Consumes: `ai-plays.ts` (`AI_PREMISE`, `AI_LIMIT`, `PLAYS`, `Play`), `checklist.ts` (`DONE`, `ARTIFACT_LIST`, `TEAM`)
- Produces: `AIPlays` component, `VerificationChecklist` component

- [ ] **Step 1: Write the failing AIPlays render test**

```tsx
// web/src/features/post-deployment-verification/AIPlays.test.tsx
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
    expect(
      screen.getByText(/mechanical parts of verification/i),
    ).toBeTruthy()
  })

  test('limit key phrase reaches the page', () => {
    render(<AIPlays />)
    expect(screen.getByText(/no new errors/i)).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/AIPlays.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write `AIPlays.tsx`**

Follow the exact pattern from `web/src/features/production-deployment/AIPlays.tsx`:

```tsx
// web/src/features/post-deployment-verification/AIPlays.tsx
import { TriangleAlert } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { RevealList } from '@/components/RevealList'
import { AI_LIMIT, AI_PREMISE, PLAYS, type Play } from './ai-plays'

const KIND_LABEL: Record<Play['kind'], string> = {
  mcp: 'Browser tool',
  command: 'Saved command',
  prompt: 'Prompt',
  cli: 'CLI command',
}

export function AIPlays() {
  return (
    <div className="space-y-4">
      <RevealList
        idPrefix="pdv-ai"
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
        <TriangleAlert
          className="mt-0.5 size-4 shrink-0 text-warn"
          aria-hidden
        />
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

- [ ] **Step 4: Run AIPlays render test**

Run: `pnpm vitest run src/features/post-deployment-verification/AIPlays.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing VerificationChecklist render test**

```tsx
// web/src/features/post-deployment-verification/VerificationChecklist.test.tsx
import { describe, expect, test, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VerificationChecklist } from './VerificationChecklist'
import { DONE, ARTIFACT_LIST } from './checklist'

beforeEach(() => {
  window.localStorage.clear()
})

describe('VerificationChecklist', () => {
  test('renders all done checkboxes', () => {
    render(<VerificationChecklist />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(DONE.length)
  })

  test('ticking a checkbox persists and shows count', () => {
    render(<VerificationChecklist />)
    const boxes = screen.getAllByRole('checkbox')
    fireEvent.click(boxes[0])
    expect((boxes[0] as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/1 of \d/)).toBeTruthy()
  })

  test('artifact list renders all items', () => {
    render(<VerificationChecklist />)
    for (const a of ARTIFACT_LIST) {
      expect(screen.getByText(new RegExp(a.slice(0, 30)))).toBeTruthy()
    }
  })

  test('team notes disclosure exists', () => {
    render(<VerificationChecklist />)
    expect(
      screen.getByRole('button', { name: /if you are not solo/i }),
    ).toBeTruthy()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/VerificationChecklist.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 7: Write `VerificationChecklist.tsx`**

Follow the exact pattern from `web/src/features/production-deployment/DeploymentChecklist.tsx`, changing:
- Import from `./checklist` (same shape)
- `VERIFICATION_CHECKLIST_KEY = 'pdv-checklist'` (unique localStorage key)
- Complete message: `'Every box ticked — the deploy is verified.'`

```tsx
// web/src/features/post-deployment-verification/VerificationChecklist.tsx
'use client'

import { useId } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'

export const VERIFICATION_CHECKLIST_KEY = 'pdv-checklist'

const NOTHING_TICKED: string[] = []

export function VerificationChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(VERIFICATION_CHECKLIST_KEY, NOTHING_TICKED)
  const idBase = useId()

  const count = DONE.filter((item) => ticked.includes(item.id)).length
  const complete = count === DONE.length

  const toggle = (id: string) =>
    setValue((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  // Render exactly as DeploymentChecklist: artifacts section, DoD checkboxes,
  // clear button, TeamNotes disclosure. Copy the JSX structure from
  // web/src/features/production-deployment/DeploymentChecklist.tsx verbatim,
  // swapping only the import paths and the localStorage key.
  return (
    <div className="space-y-4">
      <Card className="p-0">
        {/* Artifacts section */}
        <div className="border-b border-line px-5 py-3.5">
          <p className="text-sm font-medium">Artifacts</p>
          <ul className="mt-2 space-y-1.5">
            {ARTIFACT_LIST.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
                <span className="mt-0.5 shrink-0 text-subtle" aria-hidden>&rsaquo;</span>
                <span className="min-w-0 break-words"><InlineCode text={item} /></span>
              </li>
            ))}
          </ul>
        </div>

        {/* DoD header */}
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

        {/* Checkboxes */}
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
                  <span className={`min-w-0 break-words text-sm leading-6 ${on ? 'text-subtle' : 'text-muted'}`}>
                    <InlineCode text={item.label} />
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        {/* Clear button */}
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear every tick? This cannot be undone.')) reset()
            }}
            disabled={count === 0}
            className="flex min-h-11 items-center gap-2 border border-line px-3.5 text-sm text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 lg:min-h-9"
          >
            <RotateCcw className="size-4" aria-hidden />
            Clear
          </button>
          <p className="text-sm text-subtle" aria-live="polite">
            {complete
              ? 'Every box ticked — the deploy is verified.'
              : 'Tick a box only once you have actually done it.'}
          </p>
        </div>
      </Card>

      <TeamNotes>
        <ul className="space-y-3">
          {TEAM.map((note) => (
            <li key={note.id}>
              <p className="text-sm font-medium text-fg">{note.title}</p>
              <p className="mt-0.5"><InlineCode text={note.body} /></p>
            </li>
          ))}
        </ul>
      </TeamNotes>
    </div>
  )
}
```

- [ ] **Step 8: Run VerificationChecklist render test**

Run: `pnpm vitest run src/features/post-deployment-verification/VerificationChecklist.test.tsx`
Expected: PASS

- [ ] **Step 9: Run full test suite for the directory**

Run: `pnpm vitest run src/features/post-deployment-verification/`
Expected: All tests pass

- [ ] **Step 10: Commit**

```bash
git add web/src/features/post-deployment-verification/
git commit -m 'feat(post-deployment-verification): add AIPlays and VerificationChecklist components

AIPlays: four plays via RevealList with kind badges and limit warning.
VerificationChecklist: 11 persistent DoD checkboxes, 3 artifacts,
4 team notes. Both follow the stage 13 component pattern.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014k7DKLBHJCf8h1MmZsYssJ'
```

---

### Task 4: Assembly — main component, registration, glossary, D-35

**Files:**
- Create: `web/src/features/post-deployment-verification/PostDeploymentVerification.tsx`
- Create: `web/src/features/post-deployment-verification/PostDeploymentVerification.test.tsx`
- Modify: `web/src/lib/stages.ts` (line ~163: `ready: false` → `ready: true`)
- Modify: `web/src/features/stage-content.ts` (add import + registry entry)
- Modify: `web/src/features/step-ids.ts` (add import + registry entry)
- Modify: `web/src/lib/stage-metadata.test.ts` (add to `AI_SECTION_STAGES`)
- Modify: `web/src/lib/references.ts` (add 5 references for stage 14)
- Modify: `web/src/lib/terms.ts` (add new glossary terms)

**Interfaces:**
- Consumes: All data and component files from Tasks 1–3
- Produces: `PostDeploymentVerification` component (the page body)

- [ ] **Step 1: Write the failing main component render test**

```tsx
// web/src/features/post-deployment-verification/PostDeploymentVerification.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostDeploymentVerification } from './PostDeploymentVerification'

describe('PostDeploymentVerification page', () => {
  test('renders six steps in the rail', () => {
    render(<PostDeploymentVerification />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(6)
  })

  test('first step label contains "ten-minute"', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /ten-minute/i })).toBeTruthy()
  })

  test('has a Vercel step', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /vercel/i })).toBeTruthy()
  })

  test('has an AWS step', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /aws/i })).toBeTruthy()
  })

  test('has a Recovery step', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /recovery/i })).toBeTruthy()
  })

  test('last step label contains "Traps" or "checklist"', () => {
    render(<PostDeploymentVerification />)
    expect(screen.getByRole('tab', { name: /traps|checklist/i })).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/features/post-deployment-verification/PostDeploymentVerification.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write `PostDeploymentVerification.tsx`**

Build the main component following the stage 13 pattern. Six steps, each a `(Step & { id: StepId })` object with `id`, `label`, `hint`, and `content` JSX.

The component uses these shared components: `Stepper`, `Section`, `Prose`, `Callout`, `Card`, `Term`, `InlineCode`, `AnnotatedArtifact`, `Figure`, `References`, `RevealList`, plus the stage-specific `AIPlays`, `VerificationChecklist`, `TRAPS`, `AWS_VERIFICATION`.

**Step content summary:**

- **`verify`**: label "The ten-minute check", hint "Five phases, one flow". Entry criteria list (linking stages 13, 15). Then a `RevealList` with 5 rows — one per time block (0–1: Is it up, 1–3: Critical path, 3–5: Error rates, 5–7: Latency and traffic, 7–10: The specific change). Below it, a Section for "Verify with production data volumes" with prose.

- **`vercel`**: label "Vercel", hint "Where to look". A `RevealList` with 4 rows — Vercel Analytics, Deployment URL, Sentry filtered by release, `pnpm test:prod`.

- **`aws`**: label "AWS", hint "Where to look". A `Figure` wrapping `AnnotatedArtifact` for the six-command sequence. Below it, prose about CloudWatch deployment alarms and bake time.

- **`recovery`**: label "Recovery", hint "When something goes wrong". Prose: "Roll back first." with a link to stage 13. Then a `RevealList` with 4 rows — the four failure patterns (env vars, partial migrations, cold caches, feature flag defaults). Then prose for "The half-hour follow-up" and "Automate what you repeat."

- **`ai`**: label "AI plays", hint "Where agents help". Wraps `<AIPlays />` in a Section.

- **`done`**: label "Traps & checklist", hint "The last step". General traps (8) as Callout cards, AWS traps (3) in a `<details>` disclosure. Then `<VerificationChecklist />` in a Section. Then `<References slug="14-post-deployment-verification" />`.

```tsx
// web/src/features/post-deployment-verification/PostDeploymentVerification.tsx
import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { RevealList } from '@/components/RevealList'
import { getStage } from '@/lib/stages'
import { AIPlays } from './AIPlays'
import { AWS_VERIFICATION } from './aws-verification'
import { VerificationChecklist } from './VerificationChecklist'
import { TRAPS } from './traps'
import type { StepId } from './steps'

// ... build the CONTENT_STEPS array and export the component.
// Follow the same inline pattern as ProductionDeployment.tsx.
// The JSX for each step comes from the doc's sections.
```

**The implementer builds each step's JSX from the doc section it maps to.** Use `Term` for glossary terms (e.g., `<Term id="smoke-test">smoke test</Term>`), `InlineCode` for code spans, `Link` for cross-stage links.

- [ ] **Step 4: Run the main component render test**

Run: `pnpm vitest run src/features/post-deployment-verification/PostDeploymentVerification.test.tsx`
Expected: PASS (6 tabs with correct labels)

- [ ] **Step 5: Add references to `references.ts`**

Add a `'14-post-deployment-verification'` key to the `REFERENCES` record in `web/src/lib/references.ts` with 5 entries:

```ts
'14-post-deployment-verification': [
  {
    title: 'Smoke Testing',
    source: 'AltexSoft',
    url: 'https://www.altexsoft.com/blog/smoke-testing/',
    adds: 'The smoke vs. sanity vs. regression distinction, and how to size a smoke suite (5–10 critical-path scenarios, unambiguous pass/fail).',
  },
  {
    title: 'Post-Deployment Monitoring Checklist',
    source: 'PingSLA',
    url: 'https://pingsla.com/blog/post-deployment-monitoring-checklist/',
    adds: 'A monitoring timeline (first 15–20 minutes at highest risk), alerting thresholds, and common failure patterns by frequency.',
  },
  {
    title: 'How CloudWatch Alarms Detect ECS Deployment Failures',
    source: 'AWS',
    url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-alarm-failure.html',
    adds: 'How ECS watches CloudWatch alarms during the bake period and auto-rolls back when one fires.',
  },
  {
    title: 'ECS Describe Services',
    source: 'AWS CLI Reference',
    url: 'https://docs.aws.amazon.com/cli/latest/reference/ecs/describe-services.html',
    adds: 'The primary CLI command for checking rolloutState, deployment status, and service events after a deploy.',
  },
  {
    title: 'Troubleshoot ECS Tasks Failing ALB Health Checks',
    source: 'AWS re:Post',
    url: 'https://repost.aws/knowledge-center/troubleshoot-unhealthy-checks-ecs',
    adds: 'Diagnostic steps when ALB health checks fail post-deploy — the most common AWS-side verification failure.',
  },
],
```

- [ ] **Step 6: Add glossary terms to `terms.ts`**

Check which of these already exist: `smoke-test`, `baseline`, `bake-time`, `deployment-alarm`. The `smoke-test` term exists (found in grep). Add the missing ones. For each new term, provide `name`, `short`, `full`, `soWhat`, `see: '14-post-deployment-verification'`.

Candidates to add (verify each is missing before adding):

```ts
'baseline': {
  name: 'Baseline',
  short: 'The normal error rate and latency before a deploy, used to judge whether a change made things worse.',
  full: 'The normal error rate, latency, and traffic volume before a deploy. Without one, post-deploy numbers are unreadable — 12 errors in the last hour could be a catastrophe or a Tuesday.',
  soWhat: 'A deploy without a baseline is a deploy you cannot verify. You will either panic at nothing or ignore something real.',
  see: '14-post-deployment-verification',
},

'bake-time': {
  name: 'Bake time',
  short: 'A waiting period after deployment during which CloudWatch alarms are monitored before the deploy is marked complete.',
  full: 'A period after new ECS tasks go healthy during which CloudWatch alarms are monitored. If an alarm fires during the bake window, the deployment is marked FAILED and can auto-rollback. If no alarm fires, the deployment is marked COMPLETED.',
  soWhat: 'Too short a bake time means slow-onset problems — memory leaks, cache expiration bugs — slip through and the deployment is marked healthy with a live defect.',
  see: '14-post-deployment-verification',
},

'deployment-alarm': {
  name: 'Deployment alarm',
  short: 'A CloudWatch alarm wired to an ECS deployment that can trigger automatic rollback.',
  full: 'A CloudWatch alarm attached to an ECS deployment configuration. ECS polls these alarms during the bake period after new tasks go healthy. Key metrics: HTTPCode_ELB_5XX_Count, TargetResponseTime, CPUUtilization, MemoryUtilization.',
  soWhat: 'Without deployment alarms, ECS reports success based on task health checks alone. A service can be healthy (tasks running, health checks passing) while throwing 5XX errors to users.',
  see: '14-post-deployment-verification',
},
```

After adding terms, run: `pnpm gen:glossary` from `web/`.

- [ ] **Step 7: Three-file registration (atomic)**

All three changes in one edit session:

**`web/src/lib/stages.ts`** — line ~163, change `ready: false` to `ready: true`:
```ts
  ready: true,
```

**`web/src/features/stage-content.ts`** — add import and registry entry:
```ts
import { PostDeploymentVerification } from './post-deployment-verification/PostDeploymentVerification'
// In the STAGE_CONTENT record:
'14-post-deployment-verification': PostDeploymentVerification,
```

**`web/src/features/step-ids.ts`** — add import and registry entry:
```ts
import { STEP_IDS as POST_DEPLOYMENT_VERIFICATION } from './post-deployment-verification/steps'
// In the STEP_IDS_BY_SLUG record:
'14-post-deployment-verification': POST_DEPLOYMENT_VERIFICATION,
```

- [ ] **Step 8: Add stage 14 to `AI_SECTION_STAGES`**

In `web/src/lib/stage-metadata.test.ts`, add `'14-post-deployment-verification'` to the `AI_SECTION_STAGES` array (after `'13-production-deployment'`).

- [ ] **Step 9: Run `pnpm gen:glossary`**

Run: `pnpm gen:glossary`
Expected: `reference/glossary.md` regenerated without errors

- [ ] **Step 10: Run the full test suite**

Run: `pnpm test`
Expected: All tests pass. Note the new count.

- [ ] **Step 11: Run lint and typecheck**

Run: `pnpm lint && pnpm typecheck`
Expected: Both clean

- [ ] **Step 12: Run build**

Run: `pnpm build`
Expected: Clean build, stage 14 prerendered (look for `/14-post-deployment-verification` in the output)

- [ ] **Step 13: Run e2e audit**

Run: `pnpm test:e2e`
Expected: Stage 14 route is now included in the audit sweep. All pass (or note pre-existing failures).

- [ ] **Step 14: Run dev-console check**

Run: `pnpm test:dev-console`
Expected: 1/1, no React dev-mode warnings

- [ ] **Step 15: Commit**

```bash
git add .
git commit -m 'feat(post-deployment-verification): assemble stage 14 — six steps, registration, glossary, references

PostDeploymentVerification component with six steps: verify (ten-minute
check as RevealList), vercel (four tools), aws (six-command artifact),
recovery (rollback-first + four failure patterns), ai (four plays),
done (10 traps + 11-item DoD checklist + 5 references).

Three-file registration: stages.ts ready:true, stage-content.ts,
step-ids.ts. D-35: added to AI_SECTION_STAGES. Three glossary terms
(baseline, bake-time, deployment-alarm). Five references.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_014k7DKLBHJCf8h1MmZsYssJ'
```

---

## Verification (after all tasks)

- [ ] `pnpm lint` — clean
- [ ] `pnpm typecheck` — clean
- [ ] `pnpm test` — all pass, record new count (expect ~1020+ across 150+ files)
- [ ] `pnpm build` — clean, stage 14 prerendered
- [ ] `pnpm test:e2e` — stage 14 in audit sweep, all pass (note pre-existing failures)
- [ ] `pnpm test:dev-console` — 1/1
- [ ] Humanizer: run over any prose-heavy JSX content in the main component
- [ ] Panel heights: no step panel exceeds ~4.5 screen heights at 768px (visual check)
