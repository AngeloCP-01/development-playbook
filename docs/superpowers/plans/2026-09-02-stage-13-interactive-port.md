# Stage 13 (Production Deployment) Interactive Port

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `docs/13-production-deployment.md` into six interactive Stepper panels with doc-pinned data, annotated artifact, and persisted checklist.

**Architecture:** Same three-layer pattern as stages 04–07 and 12: data modules extracted from the doc and tested against it, React components rendering the data, and an assembly step that registers the stage atomically. All new files go in `web/src/features/production-deployment/`.

**Tech Stack:** React 19, Next.js App Router (static export), Vitest, Testing Library

**Spec:** N/A — bounded task following established stage-porting pattern (`web/PATTERNS.md`, `docs/learnings/stage-implementation-101.md`)

## Global Constraints

- Tailwind v4 token names: check `@theme` block in `globals.css`, not CSS custom property names. `border-line` not `border-rule`, `bg-sunken` not `bg-surface-sunken`.
- Three-file registration (`stages.ts`, `stage-content.ts`, `step-ids.ts`) is one atomic operation — Task 4 only.
- `{' '}` spacers collapse under Prettier — restructure sentences so only punctuation follows `</Term>`.
- Tests use `flat()` from `doc-source` to compare against hard-wrapped doc text.
- Every `RevealList` needs a unique `idPrefix`. Every row needs a unique `id`.
- `Artifact.language` union currently lacks `'sql'` — extend it in Task 3.
- Stage slug: `'13-production-deployment'`.
- Figure numbering runs across the whole stage, not per step.
- Run all commands from `web/`.

## Six-Step Mapping

| Step ID | Doc sections | Pattern |
|---|---|---|
| `deploys` | Entry criteria, Small and frequent, The asymmetry | Prose + `Card` contrast (code vs. data rollback) |
| `migrations` | Migrations: expand/migrate/contract, Migrations run separately | `AnnotatedArtifact` (three-deploy SQL) + `Callout` (batch backfills) |
| `safety` | Skew protection, Feature flags | `RevealList` (two mechanisms) |
| `rollback` | Rollback | Prose + CLI commands + `Callout` (contract caveat) |
| `ai` | AI in production deployment | `AIPlays` component (`RevealList` + warning) |
| `traps` | Traps, Artifacts, Definition of done, Scaling | `Callout kind="trap"` × 8 + `DeploymentChecklist` + `References` |

---

### Task 1: Data scaffolding — doc source, steps, traps, prose pins

**Files:**
- Create: `web/src/features/production-deployment/doc-source.ts`
- Create: `web/src/features/production-deployment/steps.ts`
- Create: `web/src/features/production-deployment/steps.test.ts`
- Create: `web/src/features/production-deployment/traps.ts`
- Create: `web/src/features/production-deployment/traps.test.ts`
- Create: `web/src/features/production-deployment/prose.test.ts`

**Interfaces:**
- Consumes: `docSource()` from `@/test/doc-source`
- Produces: `STEP_IDS` (6-tuple), `StepId`, `Trap`, `TRAPS` (8 items), `DOC`/`section`/`h2`/`flat`/`fences` from `doc-source`

- [ ] **Step 1: Write `doc-source.ts`**

```ts
// web/src/features/production-deployment/doc-source.ts
import { docSource } from '@/test/doc-source'

export const { DOC, section, h2, flat, fences } =
  docSource('docs/13-production-deployment.md')
```

- [ ] **Step 2: Write the failing `steps.test.ts`**

```ts
// web/src/features/production-deployment/steps.test.ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('production deployment steps', () => {
  test('six steps in order', () => {
    expect(STEP_IDS).toEqual([
      'deploys',
      'migrations',
      'safety',
      'rollback',
      'ai',
      'traps',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
```

- [ ] **Step 3: Run test — expect FAIL (module not found)**

Run: `pnpm test -- --run src/features/production-deployment/steps.test.ts`
Expected: FAIL — cannot find `./steps`

- [ ] **Step 4: Write `steps.ts`**

```ts
// web/src/features/production-deployment/steps.ts
export const STEP_IDS = [
  'deploys',
  'migrations',
  'safety',
  'rollback',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 5: Run test — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/steps.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Write the failing `traps.test.ts`**

```ts
// web/src/features/production-deployment/traps.test.ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('production deployment traps data', () => {
  const src = h2('Traps')

  test('eight traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(8)
    expect(TRAPS).toHaveLength(8)
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

  test('body pin: schema-code-together', () => {
    expect(flat(src)).toContain(
      flat('The single most common way to make a rollback impossible'),
    )
  })

  test('body pin: untested-rollback', () => {
    expect(flat(src)).toContain(
      flat('A procedure you have never run is a hypothesis'),
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

- [ ] **Step 7: Run test — expect FAIL (module not found)**

Run: `pnpm test -- --run src/features/production-deployment/traps.test.ts`
Expected: FAIL — cannot find `./traps`

- [ ] **Step 8: Write `traps.ts`**

```ts
// web/src/features/production-deployment/traps.ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'schema-code-together',
    title: 'Changing schema and code in one deploy.',
    body: 'The single most common way to make a rollback impossible. Expand, migrate, contract — every time, even when it feels excessive for a small change.',
  },
  {
    id: 'migration-in-build',
    title: 'Running migrations in the build step.',
    body: 'Builds retry and run concurrently. Migrations must not.',
  },
  {
    id: 'diagnose-before-rollback',
    title: 'Diagnosing before rolling back.',
    body: 'Reverse the order. Users first, curiosity second.',
  },
  {
    id: 'skip-skew',
    title: 'Skipping skew protection.',
    body: 'The bug you cannot reproduce and users keep reporting.',
  },
  {
    id: 'batch-to-reduce-risk',
    title: 'Batching changes to reduce deploy risk.',
    body: 'Backwards: larger deploys are riskier and harder to diagnose. Frequency is what makes deploys safe.',
  },
  {
    id: 'untested-rollback',
    title: 'Untested rollback.',
    body: 'A procedure you have never run is a hypothesis. Run it once deliberately, on a quiet afternoon, before you need it at 3am.',
  },
  {
    id: 'unbatched-backfills',
    title: 'Unbatched backfills.',
    body: 'A long `UPDATE` holding a lock will take the site down as effectively as any bug.',
  },
  {
    id: 'stale-flags',
    title: 'Flags that never get deleted.',
    body: 'Every stale flag doubles the state space of your application. Removing them is part of finishing a feature.',
  },
]
```

- [ ] **Step 9: Run test — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/traps.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 10: Write `prose.test.ts`**

```ts
// web/src/features/production-deployment/prose.test.ts
import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('production deployment prose pins', () => {
  test('small and frequent — one suspect', () => {
    const src = section('Small and frequent beats large and scheduled')
    expect(flat(src)).toContain(
      flat('A deploy containing one change has one suspect when something breaks'),
    )
  })

  test('asymmetry — code vs data', () => {
    const src = section('The asymmetry that governs everything')
    expect(flat(src)).toContain(
      flat('Code rolls back in seconds. Data does not roll back at all'),
    )
  })

  test('expand migrate contract — never in one deploy', () => {
    const src = section('Migrations: expand, migrate, contract')
    expect(flat(src)).toContain(
      flat('Never change schema and code in one deploy'),
    )
  })

  test('expand migrate contract — three deploys', () => {
    const src = section('Migrations: expand, migrate, contract')
    expect(flat(src)).toContain(flat('Three deploys instead of one'))
  })

  test('migrations separately — not in build step', () => {
    const src = section('Migrations run separately from the build')
    expect(flat(src)).toContain(
      flat('Builds run multiple times, in parallel, and get retried'),
    )
  })

  test('skew protection — invisible to you', () => {
    const src = section('Skew protection')
    expect(flat(src)).toContain(flat('invisible to you'))
  })

  test('feature flags — ship disabled', () => {
    const src = section('Feature flags decouple deploy from release')
    expect(flat(src)).toContain(
      flat('ship the code disabled and turn it on separately'),
    )
  })

  test('rollback — diagnose second', () => {
    const src = section('Rollback')
    expect(flat(src)).toContain(flat('Roll back first, diagnose second'))
  })

  test('scaling — deploy your own changes', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('Deploy your own changes'))
  })
})
```

- [ ] **Step 11: Run prose tests — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/prose.test.ts`
Expected: PASS (9 tests)

- [ ] **Step 12: Run all Task 1 tests together**

Run: `pnpm test -- --run src/features/production-deployment/`
Expected: PASS (all 17 tests across 3 files)

- [ ] **Step 13: Commit**

```bash
git add web/src/features/production-deployment/
git commit -m 'feat(production-deployment): data scaffolding — steps, traps, prose pins

Six step IDs, eight traps pinned against the doc, nine prose pins covering
every major section. doc-source utility wired to 13-production-deployment.md.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>'
```

---

### Task 2: AI plays data + component

**Files:**
- Create: `web/src/features/production-deployment/ai-plays.ts`
- Create: `web/src/features/production-deployment/ai-plays.test.ts`
- Create: `web/src/features/production-deployment/AIPlays.tsx`

**Interfaces:**
- Consumes: `section()`, `flat()` from `./doc-source`; `RevealList` from `@/components/RevealList`; `InlineCode` from `@/components/InlineCode`
- Produces: `AI_PREMISE` (string), `AI_LIMIT` (string), `Play` type, `PLAYS` (4 items), `AIPlays` component

- [ ] **Step 1: Write the failing `ai-plays.test.ts`**

```ts
// web/src/features/production-deployment/ai-plays.test.ts
import { describe, expect, test } from 'vitest'
import { AI_PREMISE, AI_LIMIT, PLAYS } from './ai-plays'
import { flat, section } from './doc-source'

describe('production deployment AI plays data', () => {
  const src = section('AI in production deployment')

  test('premise pins against doc', () => {
    expect(flat(src)).toContain(
      flat('the rules are explicit and the inputs are structured'),
    )
  })

  test('limit pins against doc', () => {
    expect(flat(src)).toContain(
      flat('data does not roll back'),
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
})
```

- [ ] **Step 2: Run test — expect FAIL (module not found)**

Run: `pnpm test -- --run src/features/production-deployment/ai-plays.test.ts`
Expected: FAIL — cannot find `./ai-plays`

- [ ] **Step 3: Write `ai-plays.ts`**

```ts
// web/src/features/production-deployment/ai-plays.ts
/**
 * Source: `docs/13-production-deployment.md`, "### AI in production deployment".
 *
 * `AI_PREMISE` is the opening paragraph: what an agent handles well (migration
 * mechanics) and what it handles poorly (judgment calls). `AI_LIMIT` is the
 * closing paragraph: the tools available and the fundamental gap — data does
 * not roll back. Both are pinned against the doc in `ai-plays.test.ts`.
 *
 * `PLAYS` covers the four bulleted plays, each with a `kind` matching the
 * parenthetical in the doc: prompt, CLI command, saved command.
 */
export const AI_PREMISE =
  'An agent handles migration mechanics well — generating SQL, checking schema compatibility, verifying that expand/migrate/contract steps are in order — because the rules are explicit and the inputs are structured. It handles the judgment calls poorly: whether this change needs a feature flag, whether a backfill is large enough to batch, whether a deploy window matters. Those stay yours.'

export const AI_LIMIT =
  'The tools are the Vercel CLI, `curl`, and whichever editor the agent runs in. The gap is the same one the rest of this stage names: data does not roll back. An agent that runs a contract migration against production because the expand step passed is doing exactly what it was told, and the data is gone.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'generate-migrations',
    title: 'Generate expand/migrate/contract SQL from a schema diff',
    kind: 'prompt',
    body: 'Describe the change you want — "rename `users.name` to `users.full_name`" — and the agent writes the three migration files, each deployable alone. Review the SQL; do not run it unread.',
  },
  {
    id: 'dry-run-migration',
    title: 'Dry-run a migration against the preview database',
    kind: 'cli',
    body: 'Run the migration against a Neon branch database before touching production, so schema errors surface where they cost nothing.',
  },
  {
    id: 'verify-skew',
    title: 'Verify skew protection after a deploy',
    kind: 'cli',
    body: 'Check that the deployment-ID header is present on a production response — `curl -sI https://your-app.vercel.app | grep -i x-deployment-id` — confirming the deploy is pinned.',
  },
  {
    id: 'rehearse-rollback',
    title: 'Rehearse rollback on a preview deployment',
    kind: 'command',
    body: 'Run `vercel promote <previous-url>` against a non-production deployment to confirm the command works and you know the output before you need it under pressure.',
  },
]
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/ai-plays.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 5: Write `AIPlays.tsx`**

Follow the staging `AIPlays.tsx` pattern exactly: `RevealList` over `PLAYS`, `AI_PREMISE` as header, `kind` badge per row, `AI_LIMIT` as a warning box below.

```tsx
// web/src/features/production-deployment/AIPlays.tsx
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
        idPrefix="deployment-ai"
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

- [ ] **Step 6: Run all Task 2 tests**

Run: `pnpm test -- --run src/features/production-deployment/ai-plays.test.ts`
Expected: PASS (7 tests)

- [ ] **Step 7: Commit**

```bash
git add web/src/features/production-deployment/ai-plays.ts \
        web/src/features/production-deployment/ai-plays.test.ts \
        web/src/features/production-deployment/AIPlays.tsx
git commit -m 'feat(production-deployment): AI plays data and component

Four plays pinned against the doc (generate migrations, dry-run, verify
skew, rehearse rollback). RevealList with kind badges and warning box,
same pattern as staging AIPlays.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>'
```

---

### Task 3: Migration artifact, checklist, and `'sql'` language extension

**Files:**
- Modify: `web/src/components/artifact.ts` (add `'sql'` to language union)
- Create: `web/src/features/production-deployment/migration-artifact.ts`
- Create: `web/src/features/production-deployment/migration-artifact.test.ts`
- Create: `web/src/features/production-deployment/checklist.ts`
- Create: `web/src/features/production-deployment/checklist.test.ts`
- Create: `web/src/features/production-deployment/DeploymentChecklist.tsx`

**Interfaces:**
- Consumes: `Artifact` type from `@/components/artifact`; `fences()`, `flat()`, `h2()` from `./doc-source`; `useLocalStorage` from `@/lib/useLocalStorage`; `Card`, `InlineCode`, `TeamNotes`
- Produces: `MIGRATION_ARTIFACT` (Artifact), `DONE` (DoneItem[]), `ARTIFACT_LIST` (string[]), `TEAM` (TeamNote[]), `DeploymentChecklist` component

- [ ] **Step 1: Extend `Artifact.language` — add `'sql'`**

In `web/src/components/artifact.ts`, change the `language` field from:
```ts
language: 'json' | 'jsonc' | 'yaml' | 'ts' | 'tsx' | 'bash'
```
to:
```ts
language: 'json' | 'jsonc' | 'yaml' | 'ts' | 'tsx' | 'bash' | 'sql'
```

This is additive — no existing code breaks.

- [ ] **Step 2: Write the failing `migration-artifact.test.ts`**

```ts
// web/src/features/production-deployment/migration-artifact.test.ts
import { describe, expect, test } from 'vitest'
import { MIGRATION_ARTIFACT } from './migration-artifact'
import { fences } from './doc-source'

describe('migration artifact data', () => {
  test('expand SQL matches doc fence', () => {
    const blocks = fences()
    expect(blocks).toContain('ALTER TABLE users ADD COLUMN full_name text;')
  })

  test('migrate SQL matches doc fence', () => {
    const blocks = fences()
    expect(blocks).toContain(
      'UPDATE users SET full_name = name WHERE full_name IS NULL;',
    )
  })

  test('contract SQL matches doc fence', () => {
    const blocks = fences()
    expect(blocks).toContain('ALTER TABLE users DROP COLUMN name;')
  })

  test('exactly one pivot line (the irreversible step)', () => {
    const pivots = MIGRATION_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
    expect(pivots[0].text).toContain('DROP COLUMN')
  })

  test('language is sql', () => {
    expect(MIGRATION_ARTIFACT.language).toBe('sql')
  })

  test('has id and filename', () => {
    expect(MIGRATION_ARTIFACT.id).toBeTruthy()
    expect(MIGRATION_ARTIFACT.filename).toBeTruthy()
  })
})
```

- [ ] **Step 3: Run test — expect FAIL (module not found)**

Run: `pnpm test -- --run src/features/production-deployment/migration-artifact.test.ts`
Expected: FAIL — cannot find `./migration-artifact`

- [ ] **Step 4: Write `migration-artifact.ts`**

```ts
// web/src/features/production-deployment/migration-artifact.ts
import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/13-production-deployment.md`, "### Migrations: expand, migrate, contract".
 *
 * The three SQL statements are pinned character-for-character against the doc's
 * fenced blocks via `fences()` in `migration-artifact.test.ts`. The pivot marks
 * the contract step — the only irreversible one.
 */
export const MIGRATION_ARTIFACT: Artifact = {
  id: 'expand-migrate-contract',
  filename: 'migrations/rename-name-to-full-name.sql',
  language: 'sql',
  lines: [
    { text: '-- Deploy 1 — Expand' },
    {
      text: 'ALTER TABLE users ADD COLUMN full_name text;',
      note: 'Add the new column. Write to both, read from `name`. Safe to roll back.',
    },
    { text: '' },
    { text: '-- Deploy 2 — Migrate' },
    {
      text: 'UPDATE users SET full_name = name WHERE full_name IS NULL;',
      note: 'Backfill. Switch reads to `full_name`, still write both. Still safe to roll back.',
    },
    { text: '' },
    { text: '-- Deploy 3 — Contract' },
    {
      text: 'ALTER TABLE users DROP COLUMN name;',
      note: 'Irreversible — the column and its data are gone.',
      pivot: true,
    },
  ],
}
```

- [ ] **Step 5: Run test — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/migration-artifact.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 6: Write the failing `checklist.test.ts`**

```ts
// web/src/features/production-deployment/checklist.test.ts
import { describe, expect, test } from 'vitest'
import { DONE, ARTIFACT_LIST, TEAM } from './checklist'
import { flat, h2 } from './doc-source'

describe('deployment checklist data', () => {
  test('five done items from definition of done', () => {
    const src = h2('Definition of done')
    const checks = src.split('\n').filter((l) => /^- \[/.test(l))
    expect(checks).toHaveLength(5)
    expect(DONE).toHaveLength(5)
  })

  test('unique done item IDs', () => {
    const ids = DONE.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('five artifacts from doc', () => {
    const src = h2('Artifacts')
    const items = src.split('\n').filter((l) => /^- /.test(l))
    expect(items).toHaveLength(5)
    expect(ARTIFACT_LIST).toHaveLength(5)
  })

  test('done pin: deploy succeeded', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(
      flat('Deploy succeeded and the commit is identifiable'),
    )
  })

  test('done pin: skew protection', () => {
    const src = h2('Definition of done')
    expect(flat(src)).toContain(flat('Skew protection is on'))
  })

  test('four team notes from scaling section', () => {
    const src = h2('Scaling to a team')
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(4)
    expect(TEAM).toHaveLength(4)
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

- [ ] **Step 7: Run test — expect FAIL (module not found)**

Run: `pnpm test -- --run src/features/production-deployment/checklist.test.ts`
Expected: FAIL — cannot find `./checklist`

- [ ] **Step 8: Write `checklist.ts`**

```ts
// web/src/features/production-deployment/checklist.ts
/**
 * Source: `docs/13-production-deployment.md`, "## Artifacts", "## Definition
 * of done", and "## Scaling to a team".
 *
 * Same shape as staging's `checklist.ts`: `DONE` items keyed on stable IDs
 * (position-independent), `ARTIFACT_LIST`, and `TEAM` notes for the
 * `DeploymentChecklist` disclosure. All four scaling bullets fit.
 */

export type DoneItem = {
  id: string
  label: string
}

export const DONE: DoneItem[] = [
  {
    id: 'deploy-succeeded',
    label: 'Deploy succeeded and the commit is identifiable',
  },
  {
    id: 'migrations-clean',
    label:
      'Migrations applied cleanly, with expand/migrate/contract respected',
  },
  {
    id: 'skew-on',
    label: 'Skew protection is on',
  },
  {
    id: 'rollback-known',
    label: 'Rollback command is known without looking it up',
  },
  {
    id: 'pdv-next',
    label: 'Post-Deployment Verification is next, not optional',
  },
]

export type TeamNote = {
  id: string
  title: string
  body: string
}

export const TEAM: TeamNote[] = [
  {
    id: 'deploy-own',
    title: 'Deploy your own changes',
    body: 'The person who wrote it knows what to check and what "wrong" looks like.',
  },
  {
    id: 'announce-risky',
    title: 'Announce risky deploys',
    body: 'Not every deploy — that becomes noise — but migrations and anything touching auth or payments.',
  },
  {
    id: 'multiple-rollback',
    title: 'More than one person can roll back',
    body: "A rollback gated on one person's availability is not a rollback.",
  },
  {
    id: 'deploy-freeze',
    title: 'Deploy freezes are rare',
    body: 'Only for genuinely high-stakes windows. Permanent freezes just batch changes into larger, riskier deploys.',
  },
]

export const ARTIFACT_LIST: string[] = [
  'Production deployment traceable to a specific commit',
  'Migrations applied as versioned, committed SQL files',
  'Skew protection enabled',
  'Feature flags for anything risky',
  'A rollback procedure you have actually executed at least once',
]
```

- [ ] **Step 9: Run test — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/checklist.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 10: Write `DeploymentChecklist.tsx`**

Follow the `StagingChecklist.tsx` pattern: `Card` with artifacts list, persisted done checklist, `TeamNotes` disclosure, `useLocalStorage` for state.

```tsx
// web/src/features/production-deployment/DeploymentChecklist.tsx
'use client'

import { useId } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'

export const DEPLOYMENT_CHECKLIST_KEY = 'deployment-checklist'

const NOTHING_TICKED: string[] = []

export function DeploymentChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(DEPLOYMENT_CHECKLIST_KEY, NOTHING_TICKED)
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

- [ ] **Step 11: Run all Task 3 tests**

Run: `pnpm test -- --run src/features/production-deployment/migration-artifact.test.ts src/features/production-deployment/checklist.test.ts`
Expected: PASS (14 tests across 2 files)

- [ ] **Step 12: Commit**

```bash
git add web/src/components/artifact.ts \
        web/src/features/production-deployment/migration-artifact.ts \
        web/src/features/production-deployment/migration-artifact.test.ts \
        web/src/features/production-deployment/checklist.ts \
        web/src/features/production-deployment/checklist.test.ts \
        web/src/features/production-deployment/DeploymentChecklist.tsx
git commit -m "feat(production-deployment): migration artifact, checklist, DeploymentChecklist

Expand/migrate/contract SQL pinned against doc fences, pivot on the
irreversible DROP COLUMN. Five done items, five artifacts, four team notes.
DeploymentChecklist follows StagingChecklist pattern. Added 'sql' to the
Artifact language union.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Stage component, references, and assembly

**Files:**
- Create: `web/src/features/production-deployment/ProductionDeployment.tsx`
- Create: `web/src/features/production-deployment/ProductionDeployment.test.tsx`
- Modify: `web/src/lib/references.ts` — add `'13-production-deployment'` entry (4 references)
- Modify: `web/src/lib/stages.ts` — set `ready: true`
- Modify: `web/src/features/stage-content.ts` — import and register `ProductionDeployment`
- Modify: `web/src/features/step-ids.ts` — import and register `STEP_IDS`

**Interfaces:**
- Consumes: All data from Tasks 1–3; `Stepper`/`Step` from `@/components/Stepper`; `Section`/`Prose`/`Callout`/`Card` from `@/components/ui`; `Term` from `@/components/Term`; `InlineCode` from `@/components/InlineCode`; `Figure` from `@/components/Figure`; `References` from `@/components/References`; `AnnotatedArtifact` from `@/components/AnnotatedArtifact`; `RevealList` from `@/components/RevealList`; `getStage` from `@/lib/stages`
- Produces: `ProductionDeployment` component (the stage entry point)

- [ ] **Step 1: Add references to `web/src/lib/references.ts`**

Add before the closing `}` of `REFERENCES`, after the `'12-staging'` entry:

```ts
  '13-production-deployment': [
    {
      title: 'Instant Rollback',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/instant-rollback',
      adds: 'The rollback mechanics this stage teaches — UI and CLI flows, eligible deployments, the auto-assignment caveat, and the undo flow.',
    },
    {
      title: 'Skew Protection',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/skew-protection',
      adds: "The version-skew problem in depth: how deployment-ID-based cookie pinning works, maximum age, monitoring, and why mid-session users break without it.",
    },
    {
      title: 'Expand and Contract Pattern',
      source: 'Prisma Data Guide',
      url: 'https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern',
      adds: "The seven-step breakdown with diagrams and a worked example — stack-agnostic despite the Prisma framing, and deeper than this stage's three-deploy summary.",
    },
    {
      title: 'Deployment Strategies',
      source: 'AWS Whitepapers',
      url: 'https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/deployment-strategies.html',
      adds: 'Five strategies (in-place, blue/green, canary, linear, all-at-once) this stage does not cover — the broader landscape for a reader from an AWS background.',
    },
  ],
```

- [ ] **Step 2: Write the failing `ProductionDeployment.test.tsx`**

```tsx
// web/src/features/production-deployment/ProductionDeployment.test.tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductionDeployment } from './ProductionDeployment'

describe('ProductionDeployment page', () => {
  test('renders six steps in the rail', () => {
    render(<ProductionDeployment />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(6)
  })

  test('first step label contains "Small"', () => {
    render(<ProductionDeployment />)
    expect(
      screen.getByRole('tab', { name: /small/i }),
    ).toBeTruthy()
  })

  test('last step label is "Traps"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })
})
```

- [ ] **Step 3: Run test — expect FAIL (module not found)**

Run: `pnpm test -- --run src/features/production-deployment/ProductionDeployment.test.tsx`
Expected: FAIL — cannot find `./ProductionDeployment`

- [ ] **Step 4: Write `ProductionDeployment.tsx`**

This is the main component composing all six steps. Read `docs/13-production-deployment.md` side-by-side while writing to lift prose accurately (lesson 11: "the second sentence carries the qualifier").

```tsx
// web/src/features/production-deployment/ProductionDeployment.tsx
import Link from 'next/link'
import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Card, Prose, Section } from '@/components/ui'
import { Term } from '@/components/Term'
import { InlineCode } from '@/components/InlineCode'
import { RevealList, type RevealRow } from '@/components/RevealList'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { getStage } from '@/lib/stages'
import { AIPlays } from './AIPlays'
import { MIGRATION_ARTIFACT } from './migration-artifact'
import { DeploymentChecklist } from './DeploymentChecklist'
import { TRAPS } from './traps'
import type { StepId } from './steps'

const stageLinkClass = 'underline hover:text-brand'

function stageTitle(slug: string) {
  return getStage(slug)?.title ?? slug
}

/* ------------------------------------------------------------------ */
/*  Step 3 (safety) data — two rows, inline because it is only two    */
/* ------------------------------------------------------------------ */

const SAFETY_ROWS: RevealRow[] = [
  {
    id: 'skew-protection',
    title: 'Skew protection',
    summary:
      'Browsers mid-session are still running the previous build’s JavaScript.',
    body: (
      <div className="space-y-3 text-sm leading-6 text-muted">
        <p>
          When you deploy, browsers mid-session are still running the previous
          build&rsquo;s JavaScript. They will request assets and call server
          actions from a version that no longer exists.
        </p>
        <p>
          Enable{' '}
          <Term id="skew-protection">skew protection</Term> in
          Vercel. Without it, every deploy hands an error to every active
          user &mdash; a class of bug that is invisible to you (your browser is
          always freshly loaded) and consistently reported by users as
          &ldquo;it randomly broke.&rdquo;
        </p>
      </div>
    ),
  },
  {
    id: 'feature-flags',
    title: 'Feature flags decouple deploy from release',
    summary: 'Ship the code disabled, toggle on separately.',
    body: (
      <div className="space-y-3 text-sm leading-6 text-muted">
        <p>
          For anything large or risky, ship the code disabled and turn it on
          separately. Edge Config reads are fast enough to call per request.
          Now &ldquo;release&rdquo; is a config toggle, turning off takes
          seconds and needs no deploy, and you can enable for yourself first.
        </p>
        <p>
          Delete <Term id="feature-flag">flags</Term> once a feature is fully
          rolled out. Stale flags are dead branches that accumulate until nobody
          knows which combinations are still real.
        </p>
      </div>
    ),
  },
]

/* ------------------------------------------------------------------ */
/*  Steps                                                             */
/* ------------------------------------------------------------------ */

const CONTENT_STEPS: (Step & { id: StepId })[] = [
  /* ---- Panel 1: deploys ---- */
  {
    id: 'deploys',
    label: 'Small & frequent',
    hint: 'One change, one suspect',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Before you begin" title="Entry criteria">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              CI is green (
              <Link href="/stages/11-ci-cd" className={stageLinkClass}>
                {stageTitle('11-ci-cd')}
              </Link>
              )
            </li>
            <li>
              Preview verified (
              <Link href="/stages/12-staging" className={stageLinkClass}>
                {stageTitle('12-staging')}
              </Link>
              )
            </li>
            <li>
              Code reviewed (
              <Link href="/stages/07-code-review" className={stageLinkClass}>
                {stageTitle('07-code-review')}
              </Link>
              )
            </li>
            <li>
              Any migration is backward compatible (see the next step &mdash;
              this is the one that bites)
            </li>
            <li>
              You know how to <Term id="rollback">roll back</Term>, specifically,
              without looking it up
            </li>
          </ul>
        </Section>

        <Section title="Small and frequent beats large and scheduled">
          <Prose>
            <p>
              A deploy containing one change has one suspect when something
              breaks. A deploy containing thirty changes has thirty, and you
              will bisect under pressure while users are affected.
            </p>
            <p>
              Merge to <InlineCode text="`main`" />, Vercel builds and promotes.
              The whole ceremony is a squash merge.
            </p>
          </Prose>
        </Section>

        <Section title="The asymmetry that governs everything">
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <p className="t-label text-go">Code</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Rolls back in seconds. Promoting a previous Vercel deployment
                is near-instant.
              </p>
            </Card>
            <Card>
              <p className="t-label text-danger">Data</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Does not roll back at all. A dropped column means the data is
                gone &mdash; rolling back the code leaves new-schema data and
                old-schema expectations.
              </p>
            </Card>
          </div>
          <Prose>
            <p>
              This asymmetry is why migrations get their own careful process
              and code deploys do not.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 2: migrations ---- */
  {
    id: 'migrations',
    label: 'Migrations',
    hint: 'Expand, migrate, contract',
    content: (
      <div className="space-y-16">
        <Section title="Expand, migrate, contract">
          <Prose>
            <p>
              Never change schema and code in one deploy. Split every
              destructive change into three deploys, each independently safe.
            </p>
            <p>
              <strong>
                Renaming{' '}
                <InlineCode text="`users.name`" /> to{' '}
                <InlineCode text="`users.full_name`" />:
              </strong>
            </p>
          </Prose>
          <Figure
            n={1}
            caption="Three deploys to rename a column. At no point can a rollback corrupt anything. Wait at least a day between them."
          >
            <AnnotatedArtifact artifact={MIGRATION_ARTIFACT} />
          </Figure>
          <Prose>
            <p>
              The same{' '}
              <Term id="expand-contract">pattern</Term> covers:
              dropping columns, renaming tables, tightening constraints,
              changing types. Anything where old code and new schema must
              coexist &mdash; which, during any deploy, they always do.
            </p>
          </Prose>
          <Callout kind="warn" title="Batch large backfills">
            <p>
              A single <InlineCode text="`UPDATE`" /> over ten million rows
              takes a lock and stalls the application. Chunk it: update 1,000
              rows, sleep 100ms, repeat. Slower in wall-clock, invisible to
              users.
            </p>
          </Callout>
        </Section>

        <Section title="Migrations run separately from the build">
          <Prose>
            <p>
              Do not run migrations in the Next.js build step. Builds run
              multiple times, in parallel, and get retried &mdash; none of
              which you want for schema changes.
            </p>
            <p>
              Run them as a deliberate step before promoting. Because of
              expand/migrate/contract, running the migration <em>before</em>{' '}
              the code deploy is safe: the schema change is always backward
              compatible with the code currently running.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 3: safety ---- */
  {
    id: 'safety',
    label: 'Safety nets',
    hint: 'Skew protection + feature flags',
    content: (
      <div className="space-y-16">
        <Section title="Two mechanisms that make deploys routine">
          <Prose>
            <p>
              Deploying several times a day is safe only if two things are
              true: active users survive the switch, and risky features can be
              turned off without a deploy.
            </p>
          </Prose>
          <RevealList idPrefix="deployment-safety" rows={SAFETY_ROWS} />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 4: rollback ---- */
  {
    id: 'rollback',
    label: 'Rollback',
    hint: 'Roll back first, diagnose second',
    content: (
      <div className="space-y-16">
        <Section title="Know this cold">
          <Prose>
            <p>
              Know these commands before you need them. Practise on a preview
              deployment, not in production for the first time at 3am.
            </p>
          </Prose>
          <Card className="overflow-x-auto">
            <pre className="text-sm leading-7">
              <code>
                <span className="text-muted">
                  {'# to the previous production deployment\n'}
                </span>
                {'vercel rollback\n\n'}
                <span className="text-muted">{'# list deployments\n'}</span>
                {'vercel ls\n\n'}
                <span className="text-muted">
                  {'# promote a specific one\n'}
                </span>
                {'vercel promote <deployment-url>'}
              </code>
            </pre>
          </Card>
        </Section>

        <Section title="Roll back first, diagnose second">
          <Prose>
            <p>
              The instinct to find the bug before reverting is the wrong
              order &mdash; every minute spent diagnosing is a minute users
              stay broken. Revert, then investigate calmly on a branch.
            </p>
          </Prose>
          <Callout kind="warn" title="Contract migrations block rollback">
            <p>
              If the deploy included a contract-phase migration,{' '}
              <Term id="rollback">rollback</Term> is not safe. That is exactly
              why contract deploys are separated and small: when the risky
              deploy contains only a{' '}
              <InlineCode text="`DROP COLUMN`" /> and nothing else, you know
              precisely what you are dealing with.
            </p>
          </Callout>
        </Section>
      </div>
    ),
  },

  /* ---- Panel 5: ai ---- */
  {
    id: 'ai',
    label: 'AI in Deployment',
    hint: 'Mechanical coverage, not judgment',
    content: (
      <div className="space-y-16">
        <Section title="AI in production deployment">
          <AIPlays />
        </Section>
      </div>
    ),
  },

  /* ---- Panel 6: traps ---- */
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The mistakes that look like normal work',
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
          <DeploymentChecklist />
        </Section>

        <References slug="13-production-deployment" />
      </div>
    ),
  },
]

export function ProductionDeployment() {
  return <Stepper steps={CONTENT_STEPS} />
}
```

- [ ] **Step 5: Run render test — expect PASS**

Run: `pnpm test -- --run src/features/production-deployment/ProductionDeployment.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 6: Three-file registration (atomic)**

**`web/src/lib/stages.ts`** — change `ready: false` to `ready: true` for stage 13:
```ts
ready: true,
```

**`web/src/features/stage-content.ts`** — add import and registration:
```ts
import { ProductionDeployment } from './production-deployment/ProductionDeployment'
```
Add to `STAGE_CONTENT`:
```ts
'13-production-deployment': ProductionDeployment,
```

**`web/src/features/step-ids.ts`** — add import and registration:
```ts
import { STEP_IDS as PRODUCTION_DEPLOYMENT } from './production-deployment/steps'
```
Add to `STEP_IDS_BY_SLUG`:
```ts
'13-production-deployment': PRODUCTION_DEPLOYMENT,
```

- [ ] **Step 7: Run the full test suite**

Run: `pnpm test -- --run`
Expected: All tests pass. Count should be ~960+ (925 baseline + ~38 new).

- [ ] **Step 8: Run the full gate**

Run (in sequence, each must pass before the next):
```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test -- --run
pnpm build
pnpm test:e2e
```

Expected: All pass. Build prerenders `stages/13-production-deployment`. E2E audit includes the new page.

- [ ] **Step 9: Commit**

```bash
git add web/src/features/production-deployment/ProductionDeployment.tsx \
        web/src/features/production-deployment/ProductionDeployment.test.tsx \
        web/src/lib/references.ts \
        web/src/lib/stages.ts \
        web/src/features/stage-content.ts \
        web/src/features/step-ids.ts
git commit -m "feat(production-deployment): stage component, references, and assembly

Six panels: small & frequent, migrations (annotated expand/migrate/contract),
safety nets (skew + flags RevealList), rollback, AI plays, and traps with
DeploymentChecklist. Four references (Vercel Rollback, Skew Protection,
Prisma Expand/Contract, AWS Deployment Strategies). Three-file registration
(stages.ts ready:true, stage-content.ts, step-ids.ts).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Verification (after all tasks)

- [ ] All gates pass: `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test -- --run && pnpm build && pnpm test:e2e`
- [ ] `pnpm test:dev-console` — run once against `next dev` to catch React dev-mode warnings (missing keys, invalid DOM nesting, hydration issues)
- [ ] Stage 13 renders at `/stages/13-production-deployment` with six functional tabs
- [ ] Both themes (light + dark) render correctly
- [ ] Responsive: 320px → 2560px, no horizontal overflow
- [ ] All `Term` popovers open and display definitions
- [ ] Annotated artifact scrolls horizontally on narrow viewports
- [ ] DeploymentChecklist persists state across page reloads
- [ ] References section shows 4 outward links with working URLs
- [ ] Back button walks the step history
