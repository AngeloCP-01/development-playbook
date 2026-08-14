# Stage 04 — Project Setup, app port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `docs/04-project-setup.md` into `web/src/features/setup/` as fifteen interactive steps, taking W-3 to 4/18.

**Architecture:** Content is extracted **as data first** — a typed `.ts` module per cluster, with a test asserting it against `docs/04-project-setup.md` itself — then rendered by components, then assembled into `Stepper`. This is stage 03's order and it exists because two of its ports were specified against counts that were already stale when they were read. Panels are authored **split** and merged only on measurement, which inverts stage 03's direction for the reason in the spec.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind v4, Vitest (projects `unit` + `dom`), Playwright.

**Spec:** `docs/superpowers/specs/2026-08-12-stage-04-project-setup-design.md` — specifically `### Phase 5 re-cut — the port-planning pass (2026-08-14)`. Read it before Task 1; the seam is argued there, not here.

## Global Constraints

- **Panel weight: 3.2 screens at 1024×768**, not 4.0. Measured with the audit's method (`#panel-<id>` bounding height ÷ 768). The gate in `web/e2e/audit.spec.ts` still fails at 4.0; 3.2 is this round's working ceiling, because stage 03's authored median is 3.02 and its max 3.88, so a panel arriving at 3.9 has no headroom for the corrections every stage has needed.
- **Kill `:3100` before every `pnpm test:e2e` or measurement run.** TD-27 is open by choice. `lsof -ti:3100 | xargs kill -9`, then `pnpm build && pnpm start -p 3100`. A reused server serves the previous task's build and hid two over-threshold panels for five tasks on stage 03.
- **No production code without a failing test first.** Write the test, run it, confirm it fails *for the right reason*, then implement. Paste raw RED and GREEN terminal output in the task report.
- **Teeth-check every new test.** Break the implementation again and confirm that test, and only that test, fails.
- **Test names are claims.** Verify a name by running its regex or assertion against a counter-example, not by reading it. Stage 03's branch wrote eight stale ones.
- **Figure numbers run across the whole stage, not per step**, and are passed explicitly as `n={…}`.
- **Accent and semantic colour are separate.** `brand` means attention. `go` / `danger` / `warn` carry meaning. Using `brand` for "this is good" is a bug.
- **Type roles are utility classes**: `t-display`, `t-head`, `t-ui`, `t-label`, `t-data`. Not Tailwind font sizes.
- **Every component that derives what it displays from data gets a `*.test.tsx` render test** (`web/PATTERNS.md`). A passing data test plus a component that ignores the data is green and wrong.
- **Commit convention:** `type(scope): subject`, lowercase after the colon, scope `web` / `setup` / `a11y` / `test`. Every commit carries `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- **Do not merge anything.** Branch is `feat/stage-04-app-port`, already cut off `develop`. The merge is the user's decision, asked for separately.

## File Structure

Created under `web/src/features/setup/`:

| File | Responsibility |
|---|---|
| `steps.ts` | `STEP_IDS` tuple + `StepId` type. The single source the rail, the audit and any cross-links resolve against. |
| `Setup.tsx` | The `STEPS` array and all panel JSX. Typed `(Step & { id: StepId })[]`. |
| `pins.ts` | §1's environment/file pairs, as data. |
| `PinExercise.tsx` | Scored exercise over `pins.ts`. |
| `tree.ts` | §2's `src/` tree, as data. |
| `TreeInspector.tsx` | Click-node inspector over `tree.ts`. |
| `artifacts.ts` | The annotated config artifacts (§3, §4, §5, §6, §7) as line arrays with per-line notes. |
| `AnnotatedArtifact.tsx` | Renders one artifact from `artifacts.ts`. |
| `client-trap.ts` | §5b's four gates and their verdicts, as data. |
| `ClientTrap.tsx` | Guess-then-reveal over `client-trap.ts`. |
| `blockers.ts` | §8's four deploy failures, as data. |
| `DeployBlockers.tsx` | Guess-then-reveal over `blockers.ts`. Headline component. |
| `ai-plays.ts` | The AI section's five plays, as data. |
| `AIPlays.tsx` | `RevealList` over `ai-plays.ts`. |
| `checklist.ts` | Artifacts + Definition of done + Scaling to a team, as data. |
| `SetupChecklist.tsx` | Persisted worksheet over `checklist.ts`. |
| `traps.ts` | The seven traps, as data. |

Modified:

| File | Change |
|---|---|
| `web/src/lib/stages.ts:61` | `ready: false` → `true` |
| `web/src/features/stage-content.ts` | Register `Setup` against `04-project-setup` |
| `web/src/features/architecture/steps.ts` | Unchanged; read as the reference |
| `web/src/features/discovery/`, `planning/` | TD-36: add `STEP_IDS` guards |
| `web/e2e/audit-pages.spec.ts` | **Deleted**, replaced per its own header |

---

## Wave 0 — foundation

The three tasks that make the route render at all, plus the tripwire the round is required to disarm correctly.

### Task 1: `steps.ts`, and TD-36 across all four stages

**Files:**

- Create: `web/src/features/setup/steps.ts`
- Create: `web/src/features/setup/steps.test.ts`
- Create: `web/src/features/discovery/steps.ts`
- Create: `web/src/features/planning/steps.ts`
- Modify: `web/src/features/discovery/ProductDiscovery.tsx` (type the `STEPS` array)
- Modify: `web/src/features/planning/Planning.tsx` (type the `STEPS` array)

**Interfaces:**

- Consumes: nothing.
- Produces: `STEP_IDS` (readonly tuple of 15 strings) and `type StepId` from `@/features/setup/steps`. Every later task's panel `id` must be a member. Also `STEP_IDS` / `StepId` from `discovery/steps` and `planning/steps`.

- [ ] **Step 1: Write the failing test**

`web/src/features/setup/steps.test.ts`:

```ts
import { expect, test } from 'vitest'
import { STEP_IDS } from './steps'

// The seam is the spec's, and it is the thing most likely to drift as panels
// are authored. Holding the count here means a step quietly dropped during
// assembly fails a test rather than shrinking the rail.
test('the rail is the fifteen steps the Phase 5 re-cut settled on', () => {
  expect(STEP_IDS).toHaveLength(15)
})

test('ids are unique, because two steps sharing one id makes the second unreachable by hash', () => {
  expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
})

// The four provisional pairs may merge on measurement (spec, Phase 5 re-cut).
// A merge deletes an id; it must never silently rename one, because the hash is
// the deep link and `docs/` cites them.
test('the eleven firm ids are present, since only the provisional four may leave', () => {
  for (const id of [
    'scaffold',
    'format',
    'strict',
    'env',
    'hooks',
    'ci',
    'deploy',
    'proof',
    'ai',
    'checklist',
    'traps',
  ]) {
    expect(STEP_IDS).toContain(id)
  }
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/steps.test.ts
```

Expected: FAIL — `Failed to resolve import "./steps"`. That is the right reason: the module does not exist. A failure naming anything else means the test is wrong, not the code.

- [ ] **Step 3: Write `steps.ts`**

```ts
/**
 * The rail order for stage 04, in one place.
 *
 * Mirrors `features/architecture/steps.ts`, and exists for the same reason: an
 * id that exists nowhere becomes a compile error, and the audit's derived sweep
 * resolves against one source rather than a copy.
 *
 * Fifteen came out of the port-planning pass, not from a target. The spec's
 * original table cut the doc nine ways when it was 323 lines; the correction
 * phase took it to 711, and all four of that table's heavy pairings failed the
 * floor arithmetic. Four of these fifteen are provisional and may merge back on
 * measurement — `scaffold`/`structure`, `env`/`client`, `ci`/`enforce`, and
 * `deploy`/`verify`. They are authored split because a merge undoes with a
 * delete while a split costs new ids and every reference to them.
 */
export const STEP_IDS = [
  'scaffold',
  'structure',
  'format',
  'strict',
  'env',
  'client',
  'hooks',
  'ci',
  'enforce',
  'deploy',
  'verify',
  'proof',
  'ai',
  'checklist',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 4: Run it and watch it pass**

```bash
cd web && pnpm vitest run src/features/setup/steps.test.ts
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Teeth-check**

Delete `'traps'` from the tuple, re-run, confirm the length test fails and only it. Restore.

- [ ] **Step 6: Close TD-36 for stages 01 and 02**

Read the ids each stage actually renders out of its own `STEPS` array — do not invent them:

```bash
cd web && grep -n "id: '" src/features/discovery/ProductDiscovery.tsx src/features/planning/Planning.tsx
```

Create `web/src/features/discovery/steps.ts` and `web/src/features/planning/steps.ts` in the shape above, with each stage's real ids in rail order and a header explaining that the guard is TD-36's, not a new convention. Then in each stage's component, change the array's type annotation:

```ts
// before
const STEPS: Step[] = [
// after
import { type StepId } from './steps'
const STEPS: (Step & { id: StepId })[] = [
```

- [ ] **Step 7: Typecheck, then teeth-check the guard**

```bash
cd web && pnpm typecheck
```

Expected: clean. Then change one `id:` in `Planning.tsx` to `'nope'`, re-run `pnpm typecheck`, and confirm it fails naming that line. That is the guard doing its job. Restore.

- [ ] **Step 8: Commit**

```bash
git add web/src/features/setup/steps.ts web/src/features/setup/steps.test.ts \
        web/src/features/discovery/steps.ts web/src/features/planning/steps.ts \
        web/src/features/discovery/ProductDiscovery.tsx web/src/features/planning/Planning.tsx
git commit -m "$(cat <<'EOF'
feat(setup): add the stage 04 rail, and type every stage against its ids

Fifteen ids from the Phase 5 re-cut. Four are provisional and may merge on
measurement, which is why the test holds the eleven firm ones by name and the
count separately.

TD-36 closes here rather than in its own round: stages 01 and 02 had no guard
at all, so an id that existed nowhere was silently unswept, and adding the
same `STEP_IDS` tuple to both is a few lines while this round is already in
those files.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The audit tripwire, disarmed by deletion

`web/e2e/audit-pages.spec.ts` goes red the moment `ready: true` lands in Task 3. Its header states the required fix in writing: delete the test and its thirty-six-URL array, and replace the coverage it held with a stage-set assertion. **Read that header before touching the file** (`web/e2e/audit-pages.spec.ts:1-40`). Pasting in what the derivation now emits is the defect class this repository has found seven times.

**Files:**

- Modify: `web/e2e/audit-pages.spec.ts` (delete the equivalence test and its array; add the replacement)

**Interfaces:**

- Consumes: `auditPages`, `readStepIds` from `./audit-pages`; `STAGES` from `../src/lib/stages`.
- Produces: nothing later tasks import.

- [ ] **Step 1: Read the file's own instruction**

```bash
cd web && sed -n '1,60p' e2e/audit-pages.spec.ts
```

The replacement it prescribes: *the set of stage paths in the derived list should equal `STAGES.filter(s => s.ready)` mapped to `/stages/<slug>`*. That re-reads `STAGES`, but it checks the **filter** did its job rather than checking step ids against themselves, so it is not circular in the way the note warns about, and it catches a dropped stage.

- [ ] **Step 2: Write the replacement test first, alongside the old one**

```ts
test('the sweep covers exactly the stages marked ready, so a live stage cannot go unswept', async ({
  page,
}) => {
  const paths = await auditPages(page)

  const sweptStages = new Set(
    paths
      .filter((p) => p.startsWith('/stages/'))
      .map((p) => `/stages/${p.split('/')[2].split('#')[0]}`),
  )
  const expected = new Set(
    STAGES.filter((s) => s.ready).map((s) => `/stages/${s.slug}`),
  )

  expect([...sweptStages].sort()).toEqual([...expected].sort())
})
```

- [ ] **Step 3: Run both, and expect a split result**

```bash
cd web && lsof -ti:3100 | xargs kill -9; pnpm build && (pnpm start -p 3100 &) && sleep 3 && pnpm test:e2e -g "sweep covers|derivation"
```

Expected at this point in the branch: the new test **passes** (three ready stages, three swept) and the old equivalence test **passes** (still 36 URLs, because `ready: true` has not landed). Both green is correct here. The old one goes red in Task 3, which is when it gets deleted.

- [ ] **Step 4: Delete the equivalence test and its array**

Remove the `test(...)` block asserting the thirty-six URLs and the literal array itself. Keep the file's header, rewritten to describe what now lives there: the derivation is no longer on trial, and what remains is the stage-coverage guard. Do not keep the array "for reference" — an unused 36-URL literal is the thing that invites a paste.

- [ ] **Step 5: Confirm the suite still runs and the count dropped by one**

```bash
cd web && lsof -ti:3100 | xargs kill -9; pnpm build && (pnpm start -p 3100 &) && sleep 3 && pnpm test:e2e
```

Expected: the suite passes with one fewer test than before this task.

- [ ] **Step 6: Teeth-check the replacement**

Flip `05-development` to `ready: true` in `src/lib/stages.ts` without registering any content, re-run the new test, and confirm it fails naming the extra stage. This proves the guard catches a stage the sweep does not reach. Restore `ready: false`.

- [ ] **Step 7: Commit**

```bash
git add web/e2e/audit-pages.spec.ts
git commit -m "$(cat <<'EOF'
test(web): retire the 36-URL equivalence literal for a stage-coverage guard

The literal proved the TD-12 migration and nothing after it, and stage 04
going ready is exactly the event its own header predicted would turn it red
for a correct reason. Deleted rather than updated: pasting in what the
derivation emits makes the expectation generated by the thing it checks.

What replaces it is the assertion that header prescribes — the swept stage set
equals `STAGES.filter(s => s.ready)`. That re-reads STAGES, but it checks the
filter did its job rather than checking step ids against themselves, and it
catches a dropped stage, which nothing else here would notice.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: The route renders — skeleton `Setup.tsx`, registered and ready

Fifteen panels with real headings and placeholder bodies, so the rail, the hashes and the audit sweep all work before any content lands. This is deliberately a skeleton: it makes every later task's measurement possible, and it is the only point where the stage is knowingly incomplete.

**Files:**

- Create: `web/src/features/setup/Setup.tsx`
- Modify: `web/src/features/stage-content.ts`
- Modify: `web/src/lib/stages.ts:61`

**Interfaces:**

- Consumes: `STEP_IDS`, `StepId` from `./steps`; `Stepper`, `type Step` from `@/components/Stepper`; `Section`, `Prose` from `@/components/ui`.
- Produces: `export function Setup()` — the component `STAGE_CONTENT['04-project-setup']` resolves to. Later tasks replace panel bodies in place; none of them change this signature.

- [ ] **Step 1: Write the failing render test**

`web/src/features/setup/Setup.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Setup } from './Setup'
import { STEP_IDS } from './steps'

test('renders one rail tab per step id, because the audit derives its sweep from the rail', () => {
  render(<Setup />)
  for (const id of STEP_IDS) {
    expect(document.getElementById(`tab-${id}`), `tab-${id}`).not.toBeNull()
  }
})

test('the first panel is the scaffold step, since the rail order is the reading order', () => {
  render(<Setup />)
  expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'panel-scaffold')
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/Setup.test.tsx
```

Expected: FAIL — `Failed to resolve import "./Setup"`.

- [ ] **Step 3: Write the skeleton**

Each of the fifteen entries takes this shape. `label` is what the rail shows; `hint` is the one-line "what this step decides", taken from the spec's re-cut table:

```tsx
import { Stepper, type Step } from '@/components/Stepper'
import { Prose, Section } from '@/components/ui'
import { References } from '@/components/References'
import { type StepId } from './steps'

const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'scaffold',
    label: 'Scaffold',
    hint: 'Which file does each environment actually read',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Day one" title="Scaffold, and pin what runs it">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  // …fourteen more, ids in STEP_IDS order
]

export function Setup() {
  return (
    <>
      <Stepper steps={STEPS} />
      <References slug="04-project-setup" />
    </>
  )
}
```

Labels and hints, in rail order:

| id | label | hint |
|---|---|---|
| `scaffold` | Scaffold | Which file does each environment actually read |
| `structure` | Structure | Feature-first, or layer-first |
| `format` | Format | One tool lints, one formats — and where the flag lives |
| `strict` | Strict | Which flags earn the first week's friction |
| `env` | Env | Validate at boot, or read `process.env` |
| `client` | Client | The failure every gate on this page stays green for |
| `hooks` | Hooks | What belongs on commit, and what belongs on push |
| `ci` | CI | The minimum pipeline, and which name to require |
| `enforce` | Enforce | Enforcement is not verification |
| `deploy` | Deploy | Which failures your repository cannot express |
| `verify` | Verify | Check what it built, not whether it built |
| `proof` | Proof | What counts as evidence that error tracking works |
| `ai` | AI plays | Where an agent reaches, and where it cannot |
| `checklist` | Checklist | Done, and what changes on a team |
| `traps` | Traps | The seven that cost the most |

- [ ] **Step 4: Register it and flip `ready`**

`web/src/features/stage-content.ts`:

```ts
import { Setup } from './setup/Setup'
// …
export const STAGE_CONTENT: Record<string, ComponentType> = {
  '01-product-discovery': ProductDiscovery,
  '02-planning': Planning,
  '03-architecture': Architecture,
  '04-project-setup': Setup,
}
```

`web/src/lib/stages.ts:61`: `ready: false` → `ready: true`.

- [ ] **Step 5: Run the tests**

```bash
cd web && pnpm vitest run src/features/setup/ && pnpm typecheck
```

Expected: PASS, and typecheck clean.

- [ ] **Step 6: Confirm the sweep picked the stage up**

```bash
cd web && lsof -ti:3100 | xargs kill -9; pnpm build && (pnpm start -p 3100 &) && sleep 3 && pnpm test:e2e
```

Expected: green, and the sweep now covers **63 URLs** (48 + 15 new step hashes). If the stage-coverage test from Task 2 fails here, the registration is wrong — that is the test doing its job.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/setup/Setup.tsx web/src/features/setup/Setup.test.tsx \
        web/src/features/stage-content.ts web/src/lib/stages.ts
git commit -m "$(cat <<'EOF'
feat(setup): render stage 04's fifteen-step rail, content to follow

Skeleton panels with real labels, hints and ids. The stage is knowingly
incomplete for the length of this wave, and it is flipped ready anyway,
because every later task's exit condition is a panel measurement and there is
nothing to measure until the route renders.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Wave 1 — content as data

Every module here ships with a test that reads `docs/04-project-setup.md` and asserts against the doc rather than against a count copied into a brief. Two of stage 03's ports were specified against numbers that were already stale when they were read; one said "eleven plays and four new" where the doc had nine and six.

Each test file uses this helper, repeated per file rather than shared, because a task's implementer sees only their own task:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

/** The body of one `### ` section, up to the next heading of any level. */
function section(heading: string): string {
  const start = DOC.indexOf(`### ${heading}`)
  if (start === -1) throw new Error(`no section "${heading}" in the doc`)
  const rest = DOC.slice(start + heading.length + 4)
  const end = rest.search(/^#{2,3} /m)
  return end === -1 ? rest : rest.slice(0, end)
}
```

### Task 4: `pins.ts` — the environment/file pairs

§1's headline generalisation, and the one TD-28 rests on: *for each environment that runs your code, find the file that environment reads.* The exercise asks the reader to pair three environments with the file each reads, before the verdict shows.

**Files:**

- Create: `web/src/features/setup/pins.ts`
- Create: `web/src/features/setup/pins.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:

```ts
export type PinTarget = {
  id: string
  environment: string
  reads: string
  /** The wrong answer a reader most often gives. */
  mistake: string
  why: string
}
export const PIN_TARGETS: PinTarget[]
export const PIN_RULE: string
```

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { PIN_RULE, PIN_TARGETS } from './pins'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

test('three environments, because the doc names three and the whole lesson is that they differ', () => {
  expect(PIN_TARGETS).toHaveLength(3)
})

test('the host reads engines.node, which is the correction TD-28 was opened for', () => {
  const host = PIN_TARGETS.find((t) => t.id === 'host')
  expect(host?.reads).toBe('package.json → engines.node')
})

test('no target claims the host reads .nvmrc, since that sentence is the defect this stage exists to fix', () => {
  const host = PIN_TARGETS.find((t) => t.id === 'host')
  expect(host?.reads).not.toMatch(/nvmrc/i)
  expect(host?.mistake).toMatch(/nvmrc/i)
})

test('every target explains itself past sixty characters, because a pairing with no reason is a flashcard', () => {
  for (const t of PIN_TARGETS) {
    expect(t.why.trim().length, `${t.id} why`).toBeGreaterThan(60)
  }
})

// The generalisation is the transferable half of §1. If the app states it
// differently from the doc, the two deliverables teach two rules.
test("the rule is the doc's own sentence, not a paraphrase of it", () => {
  expect(DOC).toContain(PIN_RULE)
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/pins.test.ts
```

Expected: FAIL — `Failed to resolve import "./pins"`.

- [ ] **Step 3: Write `pins.ts`**

```ts
/**
 * §1's three environments and the file each one reads.
 *
 * This is the pairing TD-28 was opened for. The doc used to tell the reader to
 * confirm the host's Node version "matches `.nvmrc`", and the host reads
 * neither `.nvmrc` nor the CI workflow, so a reader who followed it pinned
 * local and CI, believed they had pinned production, and had not.
 *
 * The exercise is a pairing rather than a paragraph because the defect is a
 * mis-pairing. A reader who gets `host` wrong has made the exact mistake the
 * doc used to instruct.
 */

export type PinTarget = {
  id: string
  environment: string
  reads: string
  mistake: string
  why: string
}

export const PIN_TARGETS: PinTarget[] = [
  {
    id: 'local',
    environment: 'Your shell, and anyone else who clones this',
    reads: '.nvmrc',
    mistake: 'package.json → engines.node',
    why: '`nvm` and `fnm` read `.nvmrc` and switch on `cd`. `engines.node` is a constraint, not a switch: nothing in your shell changes version because you wrote it, and pnpm only complains about it if you asked for `engine-strict=true`.',
  },
  {
    id: 'ci',
    environment: 'GitHub Actions',
    reads: '.nvmrc, through node-version-file',
    mistake: 'Whatever the runner defaults to',
    why: '`actions/setup-node` reads the file you name in `node-version-file`, which is how CI ends up on the same major as your shell. Omit it and the runner picks its own default, which drifts under you without a commit.',
  },
  {
    id: 'host',
    environment: 'Vercel, the one serving your users',
    reads: 'package.json → engines.node',
    mistake: '.nvmrc',
    why: 'The host reads neither `.nvmrc` nor your workflow. Its Node version comes from a project setting, overridden by `engines.node`, which is the one field in that dashboard your repository can reach. Pinned in neither place there is no error to read at all: the build succeeds on Vercel’s default major, which is not necessarily yours.',
  },
]

/**
 * Quoted, not paraphrased. A test holds it to the doc character-for-character,
 * because the generalisation is worth more than any of the three pairings and a
 * drifted copy would have the app teaching a second rule.
 */
export const PIN_RULE =
  'for each environment that runs your code, find the file that environment reads'
```

- [ ] **Step 4: Run it and watch it pass**

```bash
cd web && pnpm vitest run src/features/setup/pins.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Teeth-check**

Change `host.reads` to `'.nvmrc'`. Re-run. Confirm **two** tests fail (the `engines.node` assertion and the not-`.nvmrc` one) and nothing else does. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/pins.ts web/src/features/setup/pins.test.ts
git commit -m "$(cat <<'EOF'
feat(setup): the three environments and the file each one reads, as data

The pairing TD-28 was opened for. A test holds the generalisation to the doc
character-for-character, because that sentence is worth more than the three
pairings and a paraphrase in the app would teach a second rule.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: `artifacts.ts` — the annotated config files

Five steps (`format`, `strict`, `env`, `hooks`, `ci`) render the same shape: a config file, line by line, with notes on the lines that are decisions rather than boilerplate. One data module and one component serve all five, which applies the `RevealList` lesson before the copies exist rather than after.

**Files:**

- Create: `web/src/features/setup/artifacts.ts`
- Create: `web/src/features/setup/artifacts.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:

```ts
export type ArtifactLine = {
  text: string
  /** Present only on lines that are a decision. Boilerplate carries no note. */
  note?: string
  /** The line the step's judgment turns on. At most one per artifact. */
  pivot?: boolean
}
export type Artifact = {
  id: string
  filename: string
  language: 'json' | 'jsonc' | 'yaml' | 'ts' | 'bash'
  lines: ArtifactLine[]
}
export const ARTIFACTS: Record<string, Artifact>
```

Keys required: `prettierrc`, `lint`, `tsconfig`, `typecheck`, `env`, `envExample`, `lefthook`, `prepare`, `ci`.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'

const DOC = readFileSync(
  fileURLToPath(
    new URL('../../../../docs/04-project-setup.md', import.meta.url),
  ),
  'utf8',
)

// Held character-for-character, the way `ddl-sync.test.ts` holds stage 03's
// CREATE TABLE blocks. A config block that drifts from the doc is worse than a
// drifted diagram, because the reader is meant to paste this one.
test.each(Object.values(ARTIFACTS))(
  '$filename appears in the doc exactly as the app renders it',
  (artifact) => {
    const rendered = artifact.lines.map((l) => l.text).join('\n')
    expect(DOC).toContain(rendered)
  },
)

test('every artifact marks at most one pivot line, because a step holds one judgment', () => {
  for (const a of Object.values(ARTIFACTS)) {
    expect(a.lines.filter((l) => l.pivot).length, a.id).toBeLessThanOrEqual(1)
  }
})

test('lefthook.yml keeps the wide format glob, since the narrow one is the trap the doc names', () => {
  const glob = ARTIFACTS.lefthook.lines.find((l) => l.text.includes('glob:'))
  expect(glob?.text).toContain('md')
  expect(glob?.note).toMatch(/README|wider|CI/i)
})

test('the lint script carries --max-warnings 0, which is what that step is about', () => {
  const rendered = ARTIFACTS.lint.lines.map((l) => l.text).join('\n')
  expect(rendered).toContain('--max-warnings 0')
})

test('the CI workflow runs cheapest-first, because the ordering is the teaching', () => {
  const runs = ARTIFACTS.ci.lines
    .map((l) => l.text.match(/- run: pnpm (\S+)/)?.[1])
    .filter(Boolean)
  expect(runs).toEqual([
    'install',
    'format:check',
    'lint',
    'typecheck',
    'test',
    'build',
  ])
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/artifacts.test.ts
```

Expected: FAIL — `Failed to resolve import "./artifacts"`.

- [ ] **Step 3: Write `artifacts.ts`**

Copy each block **out of the doc**, do not retype it:

```bash
cd /Users/angelito/personal/Development-Playbook
sed -n '372,391p' docs/04-project-setup.md   # lefthook.yml
sed -n '425,446p' docs/04-project-setup.md   # ci.yml
sed -n '232,241p' docs/04-project-setup.md   # tsconfig
sed -n '269,284p' docs/04-project-setup.md   # env.ts
```

The workflow's install line is `- run: pnpm install --frozen-lockfile`, which is why the test's regex captures `install`. Notes go **only** on lines that are a decision. One pivot per artifact:

| Artifact | Pivot line | Why it is the pivot |
|---|---|---|
| `lint` | `"lint": "eslint --max-warnings 0"` | ESLint exits 0 on warnings, so without the flag an unused variable sails through both hooks and CI. This playbook's own gate let one through on its first teeth check. |
| `tsconfig` | `"noUncheckedIndexedAccess": true` | The highest-value flag and the most irritating for the first week. |
| `env` | `SESSION_SECRET: z.string().min(32),` | Every key in the schema needs a value before anything boots, which is why the schema lists only keys you can supply today. |
| `lefthook` | the `glob:` line under `format` | The narrow glob is the one most people write, and it reports success on a commit CI then rejects. |
| `ci` | `- run: pnpm build` | It runs your own modules, so §5's schema parses inside the build, and the workflow needs a value for every required key. |
| `prepare` | `"prepare": "lefthook install \|\| true"` | pnpm runs `prepare` on every install, `lefthook install` exits 1 outside a git repository, and build hosts check out without a `.git`. |

- [ ] **Step 4: Run it and watch it pass**

```bash
cd web && pnpm vitest run src/features/setup/artifacts.test.ts
```

If a `toContain(rendered)` case fails, the artifact was retyped rather than copied. Fix the data, never the test.

- [ ] **Step 5: Teeth-check**

Change one character inside `ARTIFACTS.ci` — a single space of indentation is enough. Confirm only that artifact's doc-match case fails. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/artifacts.ts web/src/features/setup/artifacts.test.ts
git commit -m "$(cat <<'EOF'
feat(setup): the config artifacts, as data, held to the doc

Nine config blocks with per-line notes, one shape for the five steps that
render one. Each is asserted to appear in `docs/04-project-setup.md`
character-for-character, the way ddl-sync.test.ts holds stage 03's DDL.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: `blockers.ts` — the four deploy failures

The stage's headline exercise. Four real failures from this playbook's own first deploy, and the fourth one's symptom is **success**, which is why §8 earns an exercise rather than a paragraph.

**Files:**

- Create: `web/src/features/setup/blockers.ts`
- Create: `web/src/features/setup/blockers.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:

```ts
export type Blocker = {
  id: string
  /** What the reader sees. One of these is a green build. */
  symptom: string
  options: { id: string; label: string }[]
  answer: string
  /** Why the wrong readings are tempting. Shown after the guess, never before. */
  explanation: string
}
export const BLOCKERS: Blocker[]
```

- [ ] **Step 1: Write the failing test**

```ts
import { expect, test } from 'vitest'
import { BLOCKERS } from './blockers'

test('four blockers, which is what the doc’s table holds', () => {
  expect(BLOCKERS).toHaveLength(4)
})

test('every answer is one of that blocker’s own options, or the exercise cannot be scored', () => {
  for (const b of BLOCKERS) {
    expect(b.options.map((o) => o.id), b.id).toContain(b.answer)
  }
})

test('every blocker offers at least three options, since a coin flip teaches nothing', () => {
  for (const b of BLOCKERS) {
    expect(b.options.length, b.id).toBeGreaterThanOrEqual(3)
  }
})

// The fourth row is the reason this section is an exercise at all. If every
// symptom reads as a failure, the set has lost what makes it worth guessing.
test('one symptom is a successful build, because that is the case a reader cannot reason their way to', () => {
  const green = BLOCKERS.filter((b) => /green|succee|success/i.test(b.symptom))
  expect(green).toHaveLength(1)
  expect(green[0].answer).toBe('wrong-repo')
})

test('no symptom names its own answer, or the guess is free', () => {
  for (const b of BLOCKERS) {
    const correct = b.options.find((o) => o.id === b.answer)!
    expect(b.symptom.toLowerCase(), b.id).not.toContain(
      correct.label.toLowerCase(),
    )
  }
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/blockers.test.ts
```

Expected: FAIL — `Failed to resolve import "./blockers"`.

- [ ] **Step 3: Write `blockers.ts`**

| id | Symptom the reader sees | Answer |
|---|---|---|
| `root-dir` | `No Next.js version detected` | Root Directory unset |
| `preset` | `No Output Directory named "public" found after the Build completed` | Framework Preset is `Other` |
| `prepare` | `pnpm install` exits 1 before the build starts | `prepare` script on a host with no `.git` |
| `wrong-repo` | Three green production builds | Connected to the wrong repository |

Each `options` list carries the other three causes plus the correct one, so a reader who has learned the set still has to read the symptom. `preset`'s explanation must say what the doc says: the error reads as "you deleted something you needed" and it means the preset is `Other`, whose default output directory is `public`. `wrong-repo`'s must reach the check — take the SHA off the deployment and run `git cat-file -t <sha>` against your own repository.

- [ ] **Step 4: Run it and watch it pass**

```bash
cd web && pnpm vitest run src/features/setup/blockers.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Teeth-check**

Change `wrong-repo`'s symptom to `Build failed`. Confirm the green-build test fails and only it. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/blockers.ts web/src/features/setup/blockers.test.ts
git commit -m "$(cat <<'EOF'
feat(setup): the four deploy blockers, as data

All four blocked this playbook's own first deploy. The fourth's symptom is
three green production builds, and a test holds that property, because it is
why this section earns a guess-then-reveal instead of a paragraph.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: the remaining five data modules

Small, and none is consumed by anything but its own component, so they travel together. Split only if a reviewer could reject one while approving its neighbour.

**Files:**

- Create: `web/src/features/setup/client-trap.ts` + `client-trap.test.ts`
- Create: `web/src/features/setup/tree.ts` + `tree.test.ts`
- Create: `web/src/features/setup/ai-plays.ts` + `ai-plays.test.ts`
- Create: `web/src/features/setup/traps.ts` + `traps.test.ts`
- Create: `web/src/features/setup/checklist.ts` + `checklist.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:

```ts
// client-trap.ts
export type Gate = {
  id: string
  label: string
  catchesIt: boolean
  why: string
}
export const GATES: Gate[] // build, format/lint/typecheck, the test suite, CI, loading the page
export const CLIENT_FAILURE: string // build succeeds, SSR HTML correct, dies on hydration

// tree.ts
export type TreeNode = {
  path: string
  kind: 'dir' | 'file'
  note: string
  conditional?: boolean
  children?: TreeNode[]
}
export const SRC_TREE: TreeNode

// ai-plays.ts
export type Play = {
  id: string
  title: string
  kind: 'skill' | 'command' | 'memory' | 'mcp'
  body: string
}
export const PLAYS: Play[]
export const AI_LIMIT: string // what none of it replaces: the dashboard

// traps.ts
export type Trap = { id: string; title: string; body: string }
export const TRAPS: Trap[]

// checklist.ts
export type DoneItem = { id: string; label: string }
export type TeamMove = { id: string; title: string; body: string }
export const DONE: DoneItem[]
export const TEAM_MOVES: TeamMove[]
```

- [ ] **Step 1: Write the failing tests, one file per module**

The load-bearing assertions, each reading the doc rather than trusting this plan. Every count comes from the file at run time, so **do not** copy expected numbers out of this plan:

```ts
// client-trap.test.ts — the whole point is that only the last gate catches it
test('exactly one gate catches the client-component failure, and it is loading the page', () => {
  const catching = GATES.filter((g) => g.catchesIt)
  expect(catching).toHaveLength(1)
  expect(catching[0].id).toBe('browser')
})

// tree.test.ts — src/db/ is the one conditional folder, per the entry criteria
test('db is the only conditional folder, because an empty db/ is a placeholder that looks like a decision', () => {
  const conditional = flatten(SRC_TREE).filter((n) => n.conditional)
  expect(conditional.map((n) => n.path)).toEqual(['src/db/'])
})

// ai-plays.test.ts — count the doc's own bullets rather than trusting a brief
test('the app renders exactly the plays the doc lists', () => {
  const bullets = section('AI in project setup').match(/^- \*\*/gm) ?? []
  expect(PLAYS).toHaveLength(bullets.length)
})

// traps.test.ts — same method
test('the app renders exactly the traps the doc lists', () => {
  const bold = DOC.slice(DOC.indexOf('## Traps')).match(/^\*\*.+?\.\*\*/gm) ?? []
  expect(TRAPS).toHaveLength(bold.length)
})

// checklist.test.ts
test('every Definition of done checkbox in the doc has an item in the app', () => {
  const boxes =
    DOC.slice(DOC.indexOf('## Definition of done')).match(/^- \[ \]/gm) ?? []
  expect(DONE).toHaveLength(boxes.length)
})
```

`section()` is the helper at the head of this wave. `flatten()` is a three-line local walker in `tree.test.ts`; write it there rather than exporting it, since nothing else needs it.

- [ ] **Step 2: Run them and watch each fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/
```

Expected: five FAILs, each an unresolved import.

- [ ] **Step 3: Write the five modules**

Content comes from the doc sections named in each type comment above. `AI_LIMIT` carries the doc's closing point: Root Directory, Framework Preset and the connected repository live in a web UI no agent reads, and this playbook's own first deploy was blocked by all three while every local check stayed green.

- [ ] **Step 4: Run them and watch them pass**

```bash
cd web && pnpm vitest run src/features/setup/
```

- [ ] **Step 5: Teeth-check every doc-counting test**

Drop one play from `PLAYS` and confirm only that count test fails. Repeat for `TRAPS` and `DONE`. This is the check stage 03's AI section did not have: its brief said eleven plays and four misleads where the doc had nine and six, and both numbers were wrong.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/
git commit -m "$(cat <<'EOF'
feat(setup): the remaining five data modules, each counted against the doc

client-trap, tree, ai-plays, traps and checklist. Every count is read out of
`docs/04-project-setup.md` by the test rather than copied into it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Wave 2 — components

Every component here derives what it displays from a Wave 1 module, so every one gets a `*.test.tsx` render test. `web/PATTERNS.md` states the rule and TD-17 is why: a passing data test plus a component that ignores the data is green and wrong.

### Task 8: `AnnotatedArtifact` — the shape five steps share

**Files:**

- Create: `web/src/features/setup/AnnotatedArtifact.tsx`
- Create: `web/src/features/setup/AnnotatedArtifact.test.tsx`
- Modify: `web/PATTERNS.md` (add it to the building blocks)

**Interfaces:**

- Consumes: `Artifact`, `ArtifactLine` from `./artifacts`; `Card` from `@/components/ui`.
- Produces: `export function AnnotatedArtifact({ artifact }: { artifact: Artifact })`.

Render each line as its own element with `t-data whitespace-pre`, the way `SchemaInspector` does (`src/features/architecture/SchemaInspector.tsx:54`). **Not a `<pre>`** — measured on this build, a per-line render costs 20px against a `<pre>`'s 24px plus 24px of block padding, and five steps carry one of these. A note renders beside its line on `sm` and up, below it under that; the pivot line carries the `brand` accent, because pivot means *attention*, not *good*.

- [ ] **Step 1: Write the failing render test**

```tsx
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AnnotatedArtifact } from './AnnotatedArtifact'
import { ARTIFACTS } from './artifacts'

test('renders every line of the artifact, because a dropped line is a config the reader cannot paste', () => {
  const { container } = render(
    <AnnotatedArtifact artifact={ARTIFACTS.lefthook} />,
  )
  const rendered = [...container.querySelectorAll('[data-artifact-line]')].map(
    (el) => el.textContent,
  )
  expect(rendered).toEqual(ARTIFACTS.lefthook.lines.map((l) => l.text))
})

test('shows a note only on the lines that carry one, so annotation stays a signal', () => {
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.ci} />)
  const noted = container.querySelectorAll('[data-artifact-note]')
  expect(noted).toHaveLength(
    ARTIFACTS.ci.lines.filter((l) => l.note).length,
  )
})

test('names the file, since five steps render one of these and they differ only by filename', () => {
  render(<AnnotatedArtifact artifact={ARTIFACTS.tsconfig} />)
  expect(screen.getByText(ARTIFACTS.tsconfig.filename)).toBeInTheDocument()
})

// The pivot is the line the step's judgment turns on. If it renders identically
// to its neighbours, the component has thrown away the only thing the data says
// about relative importance.
test('marks the pivot line distinctly from the lines around it', () => {
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)
  expect(container.querySelectorAll('[data-artifact-pivot]')).toHaveLength(1)
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/AnnotatedArtifact.test.tsx
```

Expected: FAIL — unresolved import.

- [ ] **Step 3: Implement, minimally**

Server component; no `'use client'` unless something here becomes interactive, and nothing in this task does.

- [ ] **Step 4: Run it and watch it pass**

- [ ] **Step 5: Teeth-check**

Hardcode the filename instead of reading `artifact.filename`. Confirm the filename test fails and only it. Then make the line map drop the last entry and confirm the first test fails. Restore both.

- [ ] **Step 6: Document it in `PATTERNS.md`**

One entry under the building blocks: what it is, which five steps use it, and the per-line-versus-`<pre>` measurement that decided the markup. `PATTERNS.md` documents the code and is the bug when the two disagree.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/setup/AnnotatedArtifact.tsx \
        web/src/features/setup/AnnotatedArtifact.test.tsx web/PATTERNS.md
git commit -m "$(cat <<'EOF'
feat(setup): AnnotatedArtifact, the shape five setup steps share

Per-line elements rather than a <pre>, which is a measured choice and not a
style preference: on this build a rendered code line costs 20px against a
<pre>'s 24px plus 24px of block padding, and five of fifteen panels carry one.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: `DeployBlockers` — the headline exercise

Guess-then-reveal over `BLOCKERS`. The answer locks before the verdict shows, and the set is scored across all four, so a reader who guesses `wrong-repo` by elimination still had to commit to it.

**Files:**

- Create: `web/src/features/setup/DeployBlockers.tsx`
- Create: `web/src/features/setup/DeployBlockers.test.tsx`

**Interfaces:**

- Consumes: `BLOCKERS` from `./blockers`; `Card`, `Callout` from `@/components/ui`.
- Produces: `export function DeployBlockers()`. No props — it owns the whole set, like `ReversibilityTable`.

Read `src/features/architecture/ExpandContract.tsx` first: it is this repo's reference guess-then-reveal and its contract is already covered by an audit test. Match the contract, do not invent a second one.

- [ ] **Step 1: Write the failing render test**

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { DeployBlockers } from './DeployBlockers'
import { BLOCKERS } from './blockers'

test('renders one card per blocker, derived from the data rather than hardcoded', () => {
  render(<DeployBlockers />)
  expect(screen.getAllByRole('group')).toHaveLength(BLOCKERS.length)
})

// The lesson is the guess. A verdict visible before a choice is made turns the
// exercise into a table with extra clicks.
test('hides every verdict until that blocker has been answered', () => {
  render(<DeployBlockers />)
  for (const b of BLOCKERS) {
    expect(screen.queryByText(b.explanation)).not.toBeInTheDocument()
  }
})

test('reveals only the answered blocker’s verdict, not the whole set', async () => {
  const user = userEvent.setup()
  render(<DeployBlockers />)
  const first = BLOCKERS[0]
  await user.click(screen.getByRole('radio', { name: first.options[0].label }))
  expect(screen.getByText(first.explanation)).toBeInTheDocument()
  expect(screen.queryByText(BLOCKERS[1].explanation)).not.toBeInTheDocument()
})

test('a locked answer cannot be changed, since scoring a second guess scores hindsight', async () => {
  const user = userEvent.setup()
  render(<DeployBlockers />)
  const first = BLOCKERS[0]
  await user.click(screen.getByRole('radio', { name: first.options[0].label }))
  const other = screen.getByRole('radio', { name: first.options[1].label })
  expect(other).toBeDisabled()
})
```

- [ ] **Step 2: Run it and watch it fail for the right reason**

- [ ] **Step 3: Implement**

`'use client'`. State is a `Record<blockerId, optionId>`; there is no persistence here, and no `useEffect` reading storage — `react-hooks/set-state-in-effect` is an error in this codebase, not a warning.

- [ ] **Step 4: Run it and watch it pass**

- [ ] **Step 5: Teeth-check**

Render the explanation unconditionally. Confirm the hidden-verdict test fails and only it. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/DeployBlockers.tsx web/src/features/setup/DeployBlockers.test.tsx
git commit -m "$(cat <<'EOF'
feat(setup): DeployBlockers, four real failures with the answer locked first

Contract matched to ExpandContract rather than reinvented, so the audit's
guess-then-reveal check covers this one too.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: `PinExercise`, `TreeInspector`, `ClientTrap`

Three interactive components over Wave 1 data. Each gets a render test asserting it reads its module rather than a copy.

**Files:**

- Create: `web/src/features/setup/PinExercise.tsx` + `.test.tsx`
- Create: `web/src/features/setup/TreeInspector.tsx` + `.test.tsx`
- Create: `web/src/features/setup/ClientTrap.tsx` + `.test.tsx`

**Interfaces:**

- Consumes: `PIN_TARGETS`, `PIN_RULE`; `SRC_TREE`; `GATES`, `CLIENT_FAILURE`.
- Produces: `PinExercise()`, `TreeInspector()`, `ClientTrap()`. All no-prop.

`TreeInspector` follows `BoundaryMap`'s click-node pattern (`src/features/architecture/BoundaryMap.tsx`) — a node list on one side, the selected node's note on the other. Do not build a third disclosure variant; `PATTERNS.md` already names the four hand-rolled ones as a known hazard.

- [ ] **Step 1: Write the three failing render tests**

The assertions that matter, one per component:

```tsx
// PinExercise: the scored pairing. Wrong answers have to be reachable.
test('offers every file as a choice for every environment, so the mis-pairing is available to make', () => {
  render(<PinExercise />)
  for (const t of PIN_TARGETS) {
    expect(screen.getAllByRole('radio', { name: t.reads }).length).toBe(
      PIN_TARGETS.length,
    )
  }
})

// TreeInspector: the conditional folder is the teaching, not decoration.
test('marks src/db/ as conditional in the rendered tree, not only in the data', () => {
  const { container } = render(<TreeInspector />)
  expect(container.querySelector('[data-conditional="true"]')).toHaveTextContent(
    'db',
  )
})

// ClientTrap: four green gates and one that catches it.
test('shows every gate as passing except the browser, which is the whole shape of the failure', () => {
  render(<ClientTrap />)
  for (const g of GATES) {
    expect(
      screen.getByTestId(`gate-${g.id}`),
    ).toHaveAttribute('data-catches', String(g.catchesIt))
  }
})
```

- [ ] **Step 2: Run them and watch each fail for the right reason**

- [ ] **Step 3: Implement the three**

- [ ] **Step 4: Run them and watch them pass**

- [ ] **Step 5: Teeth-check each**

For `ClientTrap`, flip `catchesIt` on `build` in the data and confirm the component's test fails — that proves the component reads the data rather than hardcoding four greens. Restore.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/PinExercise.tsx web/src/features/setup/PinExercise.test.tsx \
        web/src/features/setup/TreeInspector.tsx web/src/features/setup/TreeInspector.test.tsx \
        web/src/features/setup/ClientTrap.tsx web/src/features/setup/ClientTrap.test.tsx
git commit -m "$(cat <<'EOF'
feat(setup): the pairing exercise, the tree inspector and the client trap

TreeInspector follows BoundaryMap's click-node pattern rather than adding a
fourth hand-rolled disclosure variant, which PATTERNS.md already names as a
hazard for exactly this stage.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: `AIPlays`, `SetupChecklist`

**Files:**

- Create: `web/src/features/setup/AIPlays.tsx` + `.test.tsx`
- Create: `web/src/features/setup/SetupChecklist.tsx` + `.test.tsx`

**Interfaces:**

- Consumes: `PLAYS`, `AI_LIMIT`; `DONE`, `TEAM_MOVES`; `RevealList`, `type RevealRow` from `@/components/RevealList`; `TeamNotes` from `@/components/TeamNotes`; `useLocalStorage` from `@/lib/useLocalStorage`.
- Produces: `AIPlays()`, `SetupChecklist()`.

`AIPlays` maps `PLAYS` to `RevealRow[]` and renders one `RevealList` with `idPrefix="setup-ai"`. Do not hand-roll an accordion: eleven components were converted onto `RevealList` on the previous branch precisely so stage 04 would not produce copy twelve.

**`RevealList` hazard, TD-34:** it hardcodes `<h3>` for row headings. If the surrounding `Section` heading is also `<h3>`, the outline flattens. Check the rendered heading levels on this panel and say what you found in the task report.

`SetupChecklist` persists through `useLocalStorage`. It reads storage through `useSyncExternalStore`, so do not reach for `useEffect` + `setState` — that is a lint error here and causes a cascading render.

- [ ] **Step 1: Write the failing render tests**

```tsx
test('renders one reveal row per play, so a play added to the data appears without touching this file', () => {
  render(<AIPlays />)
  expect(screen.getAllByRole('button', { expanded: false })).toHaveLength(
    PLAYS.length,
  )
})

test('states the limit outside the collapsed rows, because the dashboard is the point the reader must not miss', () => {
  render(<AIPlays />)
  expect(screen.getByText(AI_LIMIT)).toBeVisible()
})

test('checking an item survives a remount, since a worksheet that forgets is a worksheet nobody fills in', async () => {
  const user = userEvent.setup()
  const { unmount } = render(<SetupChecklist />)
  await user.click(screen.getByRole('checkbox', { name: DONE[0].label }))
  unmount()
  render(<SetupChecklist />)
  expect(screen.getByRole('checkbox', { name: DONE[0].label })).toBeChecked()
})
```

- [ ] **Step 2: Run them and watch each fail for the right reason**

```bash
cd web && pnpm vitest run src/features/setup/AIPlays.test.tsx src/features/setup/SetupChecklist.test.tsx
```

Expected: FAIL — unresolved imports.

- [ ] **Step 3: Implement both**

- [ ] **Step 4: Run them and watch them pass**

- [ ] **Step 5: Teeth-check**

Drop the last entry from the `PLAYS.map(...)` in `AIPlays` and confirm only the row-count test fails. For `SetupChecklist`, replace `useLocalStorage` with `useState` and confirm only the remount test fails — that is the assertion that the persistence is real rather than incidental. Restore both.

- [ ] **Step 6: Commit**

```bash
git add web/src/features/setup/AIPlays.tsx web/src/features/setup/AIPlays.test.tsx \
        web/src/features/setup/SetupChecklist.tsx web/src/features/setup/SetupChecklist.test.tsx
git commit -m "$(cat <<'EOF'
feat(setup): the AI plays and the persisted done-checklist

AIPlays calls RevealList rather than hand-rolling a twelfth accordion, which is
what the previous branch converted eleven components to prevent. TD-34's
hardcoded <h3> is checked against this panel's own heading level and the result
is in the task report.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Wave 3 — assembly, and the measurements that settle the seam

### Task 12: Assemble steps 1–8

Replace the skeleton bodies for `scaffold`, `structure`, `format`, `strict`, `env`, `client`, `hooks`, `ci` with real content, using the Wave 2 components and `Section` / `Prose` / `Callout` / `Contrast` / `Figure`.

Panel sources, so this task is workable from its own slice. Line numbers are `docs/04-project-setup.md` as of `dd44b30`; re-check them rather than trusting them if the doc has moved:

| Panel | Doc source | Lines | Components |
|---|---|---|---|
| `scaffold` | §1 Scaffold | 26–113 | `PinExercise`, `AnnotatedArtifact` (`prepare` is §6's, not here) |
| `structure` | §2 Set the folder structure | 114–154 | `TreeInspector` |
| `format` | §3 Linting and formatting | 155–227 | `AnnotatedArtifact` × `prettierrc`, `lint` |
| `strict` | §4 TypeScript settings | 228–259 | `AnnotatedArtifact` × `tsconfig`, `typecheck` |
| `env` | §5, first half | 260–320 | `AnnotatedArtifact` × `env`, `envExample`; `Contrast` |
| `client` | §5, the `'use client'` limit | 321–361 | `ClientTrap` |
| `hooks` | §6 Git hooks | 363–420 | `AnnotatedArtifact` × `lefthook`, `prepare` |
| `ci` | §7, the workflow | 421–461 | `AnnotatedArtifact` × `ci` |

**Files:**

- Modify: `web/src/features/setup/Setup.tsx`

**Interfaces:**

- Consumes: every Wave 2 component.
- Produces: nothing new. Figure numbers **1 through N** are allocated here and Task 13 continues the sequence — figure numbering runs across the whole stage, not per step.

- [ ] **Step 1: Write the content, panel by panel**

- [ ] **Step 2: Typecheck and run the unit suite**

```bash
cd web && pnpm typecheck && pnpm test
```

- [ ] **Step 3: Measure all eight panels**

```bash
cd web && lsof -ti:3100 | xargs kill -9; pnpm build && (pnpm start -p 3100 &) && sleep 3
```

Then measure each panel's height at 1024×768 the way `audit.spec.ts` does. **Record the number for every panel in the task report**, not only the ones over.

- [ ] **Step 4: Act on the measurement**

Any panel over **3.2** is re-cut in this task, not deferred. Move elaboration behind an expand-to-reveal, or split the panel and add the id to `steps.ts`. Any of the provisional pairs (`scaffold`/`structure`, `env`/`client`, `ci`/`enforce`) whose **combined** height is under 3.2 is a candidate to merge — merging deletes an id from `steps.ts`, deletes its entry here, and requires the `steps.test.ts` count to change with a note saying which pair merged and what it measured.

- [ ] **Step 5: Commit, with the measurements in the body**

---

### Task 13: Assemble steps 9–15

Same shape for `enforce`, `deploy`, `verify`, `proof`, `ai`, `checklist`, `traps`.

| Panel | Doc source | Lines | Components |
|---|---|---|---|
| `enforce` | §7, branch protection onward | 457–471 | `Callout kind="warn"` on the GitHub Free limit |
| `deploy` | §8, through the settings table | 472–515 | `DeployBlockers` |
| `verify` | §8, "check what it built" onward | 516–541 | `AnnotatedArtifact` × the `git cat-file` block |
| `proof` | §9 Error tracking + §10 README | 542–597 | `RevealList` for the token/rollback detail |
| `ai` | AI in project setup | 598–632 | `AIPlays` |
| `checklist` | Artifacts, Definition of done, Scaling to a team | 636–680 | `SetupChecklist`, `TeamNotes` |
| `traps` | Traps | 683–711 | `Callout kind="trap"` set over `TRAPS` |

- [ ] **Step 1: Write the content**
- [ ] **Step 2: Typecheck and run the unit suite**
- [ ] **Step 3: Measure all seven panels, killing `:3100` first**
- [ ] **Step 4: Act on the measurement**, including the `deploy`/`verify` merge decision
- [ ] **Step 5: Commit, with the measurements in the body**

---

### Task 14: Terms, references, and the figure audit

**Files:**

- Modify: `web/src/lib/terms.ts` (any new term this stage defines)
- Modify: `web/src/lib/references.ts` (stage 04's outward links)
- Modify: `web/src/features/setup/Setup.tsx` (wrap first uses in `<Term>`)
- Run: `pnpm gen:glossary`

- [ ] **Step 1: List every term stage 04 uses and check it against `terms.ts`**

Nine of stage 03's terms were defined and never wrapped, because the names lived in data strings where JSX cannot go. Where that happens here, say so in the report rather than leaving it silent.

- [ ] **Step 2: Add references for `04-project-setup`**, each noting what it adds rather than its title alone.

- [ ] **Step 3: Regenerate the glossary and confirm the diff is only what changed**

```bash
cd web && pnpm gen:glossary && git diff --stat ../reference/glossary.md
```

`reference/glossary.md` is generated. Never hand-edit it.

- [ ] **Step 4: Confirm figure numbers are contiguous across the stage**

```bash
cd web && grep -o 'n={[0-9]*}' src/features/setup/Setup.tsx | sort -t'{' -k2 -n
```

Expected: 1..N with no gaps and no repeats. A repeat means two panels both think they are figure 3.

- [ ] **Step 5: Commit**

---

## Wave 4 — gates and records

### Task 15: The full verification pass

- [ ] **Step 1: Kill `:3100`, rebuild, run the whole audit**

```bash
cd web && lsof -ti:3100 | xargs kill -9
pnpm build && (pnpm start -p 3100 &) && sleep 3
pnpm test:e2e
```

Expected: contrast in both themes at every step, no overflow 320→2560px, no sub-44px touch target below `lg`, zero console errors, every panel under the 4.0 gate, hash resolution, and the stage-coverage guard from Task 2.

- [ ] **Step 2: Re-derive the sweep baseline rather than quoting it**

```bash
cd web && node e2e/count-expandables.mjs
```

Record URLs, total expandables and distinct panel ids. Measured on `develop` at `49122f5`, the baseline is **140 expandables / 107 distinct ids over 36 URLs**. This branch adds stage 04's, so the number moves; the point is to state what it moved to, not to match a constant.

**Known drift, found while writing this plan, and it is not this round's to fix.** That 36 is not the audit's 48. `e2e/audit-pages.ts` gained `/reference` and eleven cheatsheet URLs during W-6; `e2e/count-expandables.mjs` duplicates that derivation in plain `.mjs` and was not updated with it, so the equivalence instrument now sweeps the stages and none of the reference sheets. Its own header says the two must change together or they stop measuring the same thing. The number is still a valid before-and-after for **stage** panels, which is all this round moves, so use it and say which set it covers. File the divergence as debt in Task 16 rather than widening this branch.

- [ ] **Step 3: Run the cheap gates**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm format:check && pnpm test
```

- [ ] **Step 4: Record the final panel table**

Every one of the fifteen (or fewer, after merges) with its measured screens. This table is the evidence that the seam was measured rather than asserted, and it belongs in the tracker row.

---

### Task 16: Record the round

**Files:**

- Modify: `docs/tracker.md` — a shipped-with-evidence row, the decisions this round produced (next free number is **D-64**), TD-36 closed, and a `Deferred:` list
- Modify: `docs/task.md` — W-3.4's remaining boxes ticked, W-3 advanced to 4/18
- Modify: `KICKOFF.md` — *Project state* refreshed
- Modify: `web/PATTERNS.md` — any pattern this stage established
- Create: `docs/stage-04-status.md` — the coverage map, doc against app, in `docs/stage-03-status.md`'s shape

- [ ] **Step 1: Write the tracker row with evidence, not adjectives** — commit range, test counts before and after, audit result, the panel table, and what each review caught.

- [ ] **Step 2: Record the decisions.** At minimum the seam itself (fifteen steps from a measured re-cut, and which of the provisional four merged) and anything the measurements settled. Appended and superseded, never edited.

- [ ] **Step 3: Close TD-36** and note what its guard does not cover.

- [ ] **Step 4: State what was deliberately not done**, per the `Deferred:` convention.

- [ ] **Step 5: Commit** with `docs(tracker):` and `docs(task):` scopes, separately from the implementation.

---

## Verification (after all tasks)

Run from `web/` unless noted. Kill `:3100` before anything that builds.

1. `pnpm lint` — clean at `--max-warnings 0`
2. `pnpm typecheck` — clean (runs `next typegen` first; a bare `tsc` passes off a stale `.next`)
3. `pnpm format:check` — clean
4. `pnpm test` — every suite, with the count stated against the pre-branch **350 across 37 files**
5. `pnpm build` — exit 0, and stage 04 prerenders
6. `pnpm test:e2e` — the audit suite green against a **fresh** build
7. `node e2e/count-expandables.mjs` — record URLs, expandables, distinct ids
8. Every panel measured at 1024×768 and tabulated, under 3.2
9. `pnpm gen:glossary` re-run, `reference/glossary.md` byte-identical unless a term genuinely changed
10. A per-task read-only review in a fresh context, then a **whole-branch review** before the merge is proposed. The session that wrote the code cannot review it: the reading that produced the claim produces the check.

**Not part of this:** `pnpm test:prod`. It measures the deployed site and says nothing about the working tree. It runs after a promotion to `main`, which is the user's.

**The branch does not merge itself.** `finishing-a-development-branch` decides what happens next, and the merge into `develop` is a separate decision the user makes each time.
