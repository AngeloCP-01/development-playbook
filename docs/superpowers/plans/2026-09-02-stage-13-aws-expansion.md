# Stage 13 AWS Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure stage 13 (Production Deployment) from 6 Vercel-only steps to 7 platform-aware steps and add deep AWS deployment content.

**Architecture:** Two-phase doc-correction-then-port. Phase 1 expands `docs/13-production-deployment.md` to match the new 7-section layout. Phase 2 restructures the existing interactive implementation — updating step IDs, moving content between steps, adding new AWS data modules and components. Both phases share a single branch.

**Tech Stack:** Next.js 16 static site, React 19, Tailwind v4, Vitest (node + jsdom), Playwright (e2e audit)

**Spec:** `docs/superpowers/specs/2026-09-02-stage-13-aws-expansion-design.md`

## Global Constraints

- Tests use `@testing-library/react` + plain DOM assertions (`el.getAttribute`, `(el as HTMLInputElement).checked`), never `jest-dom` or `user-event`.
- Doc-pinned assertions use `flat()` from `doc-source.ts` to handle hard line-wraps.
- `InlineCode` renders backtick-wrapped segments — use `InlineCode text={string}` for any prose containing backticks.
- Committed files only for teeth checks — commit the file, mutate, `git diff`, `git checkout --` to restore.
- The `Artifact.language` union type already includes `'yaml'` — no addition needed for the GitHub Actions workflow artifact.
- References are capped at 3–5 per stage (enforced by `references.test.ts`). Stage 13 currently has 4; maximum 1 addition allowed.
- Terms already exist for: `rollback`, `canary`, `skew-protection`, `expand-contract`, `feature-flag`. Check `terms.ts` before adding new ones.
- The `AnnotatedArtifact` component renders `Artifact` from `@/components/artifact` — reuse the existing type.
- Step IDs live in the local `production-deployment/steps.ts` and are imported by `web/src/features/step-ids.ts` automatically.
- Run all commands from `web/`.

---

## Phase 1: Doc Expansion

### Task 1: Restructure doc headings and expand Vercel + flags sections

This task restructures the document's `## The work` section from 7 `###` headings to match the new 7-step layout, consolidates Vercel-specific content, and extracts feature flags into its own section. No AWS content yet — that comes in Task 2.

**Files:**
- Modify: `docs/13-production-deployment.md`

**Interfaces:**
- Produces: restructured doc headings that all subsequent tasks' `section()` and `h2()` calls will reference

- [ ] **Step 1: Read the current doc**

Read `docs/13-production-deployment.md` in full. The current structure is:
```
### Small and frequent beats large and scheduled
### The asymmetry that governs everything
### Migrations: expand, migrate, contract
### Migrations run separately from the build
### Skew protection
### Feature flags decouple deploy from release
### Rollback
### AI in production deployment
```

- [ ] **Step 2: Restructure headings**

Reorganise the `## The work` body into these sections. The first two stay unchanged. The next five are new or restructured:

```markdown
### Small and frequent beats large and scheduled
(unchanged)

### The asymmetry that governs everything
(unchanged)

### Migrations: expand, migrate, contract
(unchanged — keep the three SQL blocks and the backfill warning)

### Migrations run separately from the build
(unchanged)

### Vercel deployment mechanics

Consolidate the existing `### Skew protection` and `### Rollback` content under this one heading. Add a brief framing sentence:

> On Vercel, two mechanisms make deploys routine: skew protection keeps
> active sessions alive across deploys, and instant rollback reverts to
> a previous deployment in seconds.

Then reproduce the skew protection content and the rollback content (CLI commands, diagnose-second rule, contract-migration warning) verbatim — these are already correct. Remove "Vercel builds and promotes" from the "Small and frequent" section (replace with a platform-agnostic phrasing: "Merge to `main`, the CI/CD pipeline builds and promotes").

### AWS deployment strategies

(Blank placeholder — Task 2 fills this)

### Feature flags decouple deploy from release

Move this out of its old position (between skew protection and rollback) to its own standalone section after the AWS section. The content is already platform-agnostic and complete. No edits needed to the body.

### AI in production deployment
(unchanged for now — Task 3 updates it)
```

- [ ] **Step 3: Update the entry criteria**

In the entry criteria, change:
- "Any migration is backward compatible (see below — this is the one that bites)" — keep
- "You know how to roll back, specifically, without looking it up" — keep

No platform-specific changes needed here — it already works for both.

- [ ] **Step 4: Run the existing prose pin tests**

```bash
cd web && pnpm vitest run --project unit src/features/production-deployment/prose.test.ts
```

Some tests will now fail because section headings moved. **Do not fix yet** — record which tests fail and why. The test updates happen in the interactive phase (Task 5) after the doc is stable.

- [ ] **Step 5: Commit the restructured doc**

```bash
git add docs/13-production-deployment.md
git commit -m "docs(deployment): restructure headings for platform-aware layout

Split Vercel-specific content (skew protection, rollback CLI) into its
own ### Vercel deployment mechanics section. Extract feature flags into
a standalone section. Placeholder for ### AWS deployment strategies.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

### Task 2: Write the AWS deployment strategies section

The largest content task. Writes the `### AWS deployment strategies` section in the doc with six subsections.

**Files:**
- Modify: `docs/13-production-deployment.md` (the `### AWS deployment strategies` placeholder from Task 1)

**Interfaces:**
- Consumes: restructured doc from Task 1
- Produces: doc content that Task 4's data modules and Task 5's prose.test.ts will pin against

- [ ] **Step 1: Write the pipeline subsection**

Under `### AWS deployment strategies`, add:

```markdown
### AWS deployment strategies

Where Vercel is a single command, AWS gives you the machinery — and asks you
to understand it. The payoff is control: you pick the deployment strategy, set
the rollback threshold, and decide how much traffic the canary sees. The cost
is that every piece has a price tag Vercel never showed you.

#### The pipeline

A production deploy on AWS starts with a CI/CD workflow. GitHub Actions with
OIDC — no long-lived AWS credentials stored anywhere.

The workflow chain:

1. **Checkout** — `actions/checkout@v4`.
2. **Configure AWS credentials** — `aws-actions/configure-aws-credentials@v4`
   with `role-to-assume`. GitHub mints a short-lived OIDC token; AWS STS
   exchanges it for temporary credentials.
3. **Login to ECR** — `aws-actions/amazon-ecr-login@v2`. Authenticates Docker
   to your Elastic Container Registry.
4. **Build and push** — `docker build`, `docker push` with
   `${{ github.sha }}` as the image tag. Every image is traceable to a commit.
5. **Render task definition** — `aws-actions/amazon-ecs-render-task-definition@v1`.
   Takes your task definition JSON and swaps the image field to the new tag.
6. **Deploy** — `aws-actions/amazon-ecs-deploy-task-definition@v2`. Registers
   the new task definition revision and calls `UpdateService`.

Set `wait-for-service-stability: true` or the workflow reports success while
the deployment circuit breaker silently rolls back. Set
`wait-max-delay-seconds: 30` or the SDK's exponential backoff grows pauses
to ten minutes between polls.
```

- [ ] **Step 2: Write the rolling updates subsection**

```markdown
#### Rolling updates

The ECS default. New tasks start before old tasks stop.

Two numbers govern it:

- **`minimumHealthyPercent`** (default 100) — the floor. With four tasks and
  100%, all four stay running while new ones start. No capacity dip.
- **`maximumPercent`** (default 200) — the ceiling. With four tasks and 200%,
  up to eight can run simultaneously. The new four start, pass their health
  checks, then the old four drain.

The combination requires enough cluster capacity to run both sets. If
capacity is tight, `minimumHealthyPercent: 50` allows killing half the old
tasks before starting new ones — faster, but half your users see reduced
capacity during the roll.

**The deadlock trap:** `minimumHealthyPercent: 100` with `maximumPercent: 100`
and `desiredCount: 1`. The scheduler cannot start the new task (would exceed
max) and cannot stop the old one (would violate min). The deployment hangs
forever.

**Deployment circuit breaker.** Add it to every service:

```json
{
  "deploymentCircuitBreaker": {
    "enable": true,
    "rollback": true
  }
}
```

If new tasks repeatedly fail health checks, ECS stops the deployment and
rolls back to the last successful revision. Without it, a bad image loops
through start-crash-restart indefinitely while you watch.
```

- [ ] **Step 3: Write the blue/green subsection**

```markdown
#### Blue/green deployments

A full parallel environment, verified before traffic moves.

The setup: an Application Load Balancer with two target groups (blue and
green). Blue serves production. When you deploy, ECS launches a complete
replacement task set behind green. Both run simultaneously. When green's
health checks pass, the ALB listener switches from blue to green. Blue drains
and terminates.

**ECS-native blue/green** (the simpler path):

```json
{
  "deploymentConfiguration": {
    "strategy": "BLUE_GREEN",
    "bakeTimeInMinutes": 10
  }
}
```

The bake time is the window after traffic shifts where both task sets run.
Roll back during the bake and traffic reverts to blue instantly — no new
deployment needed.

**CodeDeploy blue/green** (the established path): a separate CodeDeploy
application, deployment group, and appspec file. More infrastructure to
maintain, but adds lifecycle hooks — Lambda functions that run at each stage
of the deployment (before install, after test traffic, before production
traffic). Use it when you need automated validation between stages.

Both approaches swap ALB target groups. The difference is who orchestrates
the swap: ECS natively, or CodeDeploy as a coordinator.
```

- [ ] **Step 4: Write the canary and linear subsection**

```markdown
#### Canary and linear traffic shifting

Not all-or-nothing. Send a fraction of traffic to the new version first.

**Canary:** 10% of traffic goes to the new version. Watch error rates and
latency for five minutes. If the metrics hold, shift the remaining 90%.
A failure at 10% means 90% of users never saw it.

**Linear:** traffic shifts in equal steps — 10% every minute, or 10% every
three minutes. Slower than canary, but gives you ten data points instead of
one before full rollout.

Both integrate with CloudWatch alarms. Attach up to ten alarms to the
deployment — error rate, latency p99, custom business metrics. If any alarm
fires during the shift, the deployment stops and traffic reverts. This is the
closest thing to an automatic "undo" that exists in deployment.

The predefined configurations:

| Configuration | Pattern |
|---|---|
| `ECSCanary10Percent5Minutes` | 10% first, rest after 5 min |
| `ECSCanary10Percent15Minutes` | 10% first, rest after 15 min |
| `ECSLinear10PercentEvery1Minutes` | 10% every 1 min (~10 min total) |
| `ECSLinear10PercentEvery3Minutes` | 10% every 3 min (~30 min total) |
| `ECSAllAtOnce` | Immediate full cutover |
```

- [ ] **Step 5: Write the rollback subsection**

```markdown
#### Rollback on AWS

Three paths, depending on what you deployed with.

**Rolling update:** the deployment circuit breaker handles it automatically if
enabled. Manual rollback:

```bash
aws ecs update-service \
  --cluster my-cluster \
  --service my-service \
  --task-definition my-task:PREVIOUS_REVISION
```

ECS starts a new rolling deployment to the previous task definition revision.

**Blue/green (ECS-native):** during the bake time, rollback reverts the ALB to
the blue target group. After bake time ends and blue terminates, rollback is a
new deployment — same as rolling.

**CodeDeploy:** stop the deployment or let a CloudWatch alarm stop it. Traffic
reverts to the original task set.

```bash
aws deploy stop-deployment --deployment-id d-XXXXXXXXX
```

The same rule from the Vercel section applies, universally: roll back first,
diagnose second. The AWS-specific nuance is that "roll back" might mean
waiting for a rolling update to complete, which takes minutes rather than
seconds. Blue/green reverts are instant during the bake window.
```

- [ ] **Step 6: Write the costs subsection**

```markdown
#### Costs Vercel hides

On Vercel, you pay per seat. On AWS, you pay per component. A small
application on ECS/Fargate behind an ALB:

| Service | Monthly | What Vercel includes |
|---|---|---|
| Application Load Balancer | $22–27 | Routing, TLS, load balancing |
| NAT Gateway | $35–100 | Outbound internet from private subnets |
| Fargate (one task) | $18–40 | Compute |
| Data transfer | $5–20 | Inter-AZ, egress, NAT processing |
| CloudWatch | $5–15 | Logs, metrics, alarms |
| ECR | $1–2 | Container registry |
| **Total** | **$85–204** | **Vercel Pro: $20/seat** |

NAT Gateway is the classic surprise. Private subnets — standard security
practice — cannot reach the internet directly. A NAT Gateway costs $0.045 per
hour ($32/month) just to exist, plus $0.045 per GB processed. Every container
image pull, every AWS API call from your task, every outbound request flows
through it unless you set up VPC endpoints.

The point is not that AWS costs more. It is that Vercel bundles these costs
invisibly, and a team moving from Vercel to AWS encounters them one invoice
line at a time, with no single document listing them all. This table is that
document.
```

- [ ] **Step 7: Commit the AWS section**

```bash
git add docs/13-production-deployment.md
git commit -m "docs(deployment): add AWS deployment strategies section

Pipeline (GitHub Actions OIDC → ECR → ECS), rolling updates (min/max
percent, circuit breaker), blue/green (ECS-native and CodeDeploy),
canary/linear (CloudWatch alarm gates), rollback (three paths), and
costs Vercel hides ($85–204/month reality check).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

### Task 3: Update the AI and Traps sections in the doc

Add AWS-specific AI plays and AWS-specific traps to the doc.

**Files:**
- Modify: `docs/13-production-deployment.md`

**Interfaces:**
- Consumes: restructured doc from Tasks 1–2
- Produces: updated AI and Traps sections that Task 6 and Task 7 data modules will pin against

- [ ] **Step 1: Update the AI section**

The existing `### AI in production deployment` opening paragraph stays. After the existing four bullet plays (generate SQL, dry-run migration, verify skew, rehearse rollback), add a divider and four new AWS plays:

```markdown
Where it earns its place on AWS:

- **Generate an ECS task definition from a Dockerfile.** Describe the
  container requirements — port, memory, CPU, environment variables — and the
  agent writes the task definition JSON. Review the resource limits; do not
  deploy unread. (A prompt.)
- **Validate deployment configuration.** Paste your `deploymentConfiguration`
  JSON and ask whether `minimumHealthyPercent` and `maximumPercent` can
  deadlock at your `desiredCount`. The agent checks the arithmetic. (A
  prompt.)
- **Generate a GitHub Actions ECS deploy workflow.** Describe the pipeline —
  ECR repo, cluster name, service name — and the agent writes the workflow
  YAML with OIDC, no long-lived secrets. (A prompt.)
- **Audit CloudWatch alarm coverage for a deployment.** List the alarms
  attached to your CodeDeploy deployment group and ask whether error rate,
  latency, and availability are covered. The gap is always the alarm you
  did not write. (A prompt.)
```

Update the closing paragraph. Change:

> The tools are the Vercel CLI, `curl`, and whichever editor the agent runs in.

to:

> The tools are the Vercel CLI, the AWS CLI, `curl`, and whichever editor the
> agent runs in.

The rest of the closing paragraph stays unchanged.

- [ ] **Step 2: Update the Traps section**

After the existing eight traps, add four AWS-specific traps:

```markdown
**Health check grace period too short.** ECS kills tasks before they finish
starting. The default grace period is zero seconds — a container that takes
thirty seconds to boot fails its first health check and restarts in a loop.
Set `healthCheckGracePeriodSeconds` to longer than your startup time.

**NAT Gateway without VPC endpoints.** Every AWS API call from a private
subnet goes through the NAT Gateway at $0.045/GB. ECR image pulls, CloudWatch
log writes, SSM parameter reads — all NAT traffic unless you create VPC
endpoints for those services. The endpoints cost $7/month each; the NAT
traffic they replace costs more.

**minimumHealthyPercent and maximumPercent deadlock.** Both at 100% with
`desiredCount: 1`. The scheduler cannot start the new task (exceeds max) or
stop the old one (violates min). The deployment hangs with no error.

**Deploying without `wait-for-service-stability`.** The GitHub Actions
workflow reports success after calling `UpdateService`. Meanwhile, the
deployment circuit breaker detects failing health checks and rolls back. Your
pipeline is green; your production is on the old version.
```

- [ ] **Step 3: Update Definition of Done**

Add one item to the Definition of Done:

```markdown
- [ ] Deployment strategy matches the service risk profile (rolling for routine, blue/green or canary for critical)
```

This takes the total from 5 to 6 checklist items.

- [ ] **Step 4: Commit**

```bash
git add docs/13-production-deployment.md
git commit -m "docs(deployment): add AWS AI plays and traps

Four AWS-specific AI plays (generate task def, validate config, generate
workflow, audit alarms). Four AWS-specific traps (health check grace
period, NAT Gateway costs, min/max deadlock, wait-for-service-stability).
One new Definition of Done item.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

## Phase 2: Interactive Restructure

### Task 4: Update step IDs and doc-pinned tests

Update the step tuple, step tests, and prose pin tests to match the restructured doc. This is the foundation all subsequent tasks build on.

**Files:**
- Modify: `web/src/features/production-deployment/steps.ts`
- Modify: `web/src/features/production-deployment/steps.test.ts`
- Modify: `web/src/features/production-deployment/prose.test.ts`

**Interfaces:**
- Produces: `STEP_IDS` tuple with `['deploys', 'migrations', 'vercel', 'aws', 'flags', 'ai', 'traps']`
- Produces: `StepId` union type used by all subsequent tasks

- [ ] **Step 1: Write the failing step test**

Update `steps.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { STEP_IDS } from './steps'

describe('production deployment steps', () => {
  test('seven steps in order', () => {
    expect(STEP_IDS).toEqual([
      'deploys',
      'migrations',
      'vercel',
      'aws',
      'flags',
      'ai',
      'traps',
    ])
  })

  test('unique IDs', () => {
    expect(new Set(STEP_IDS).size).toBe(STEP_IDS.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm vitest run --project unit src/features/production-deployment/steps.test.ts
```

Expected: FAIL — `['deploys', 'migrations', 'safety', 'rollback', 'ai', 'traps']` does not match the new tuple.

- [ ] **Step 3: Update steps.ts**

```ts
export const STEP_IDS = [
  'deploys',
  'migrations',
  'vercel',
  'aws',
  'flags',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm vitest run --project unit src/features/production-deployment/steps.test.ts
```

Expected: PASS

- [ ] **Step 5: Update prose.test.ts**

The prose pins need to match the restructured doc headings. The key changes:
- `section('Skew protection')` → `section('Vercel deployment mechanics')` (skew content moved under this heading)
- `section('Rollback')` → removed (content merged into `Vercel deployment mechanics`)
- `section('Feature flags decouple deploy from release')` stays (it is still a `###`)
- Add new pins for AWS content

```ts
import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('production deployment prose pins', () => {
  test('small and frequent — one suspect', () => {
    const src = section('Small and frequent beats large and scheduled')
    expect(flat(src)).toContain(
      flat(
        'A deploy containing one change has one suspect when something breaks',
      ),
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

  test('vercel — skew protection invisible to you', () => {
    const src = section('Vercel deployment mechanics')
    expect(flat(src)).toContain(flat('invisible to you'))
  })

  test('vercel — rollback diagnose second', () => {
    const src = section('Vercel deployment mechanics')
    expect(flat(src)).toContain(flat('Roll back first, diagnose second'))
  })

  test('aws — wait-for-service-stability', () => {
    const src = section('AWS deployment strategies')
    expect(flat(src)).toContain(flat('wait-for-service-stability'))
  })

  test('aws — minimumHealthyPercent', () => {
    const src = section('AWS deployment strategies')
    expect(flat(src)).toContain(flat('minimumHealthyPercent'))
  })

  test('aws — costs Vercel hides', () => {
    const src = section('AWS deployment strategies')
    expect(flat(src)).toContain(flat('Costs Vercel hides'))
  })

  test('feature flags — ship disabled', () => {
    const src = section('Feature flags decouple deploy from release')
    expect(flat(src)).toContain(
      flat('ship the code disabled and turn it on separately'),
    )
  })

  test('scaling — deploy your own changes', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('Deploy your own changes'))
  })
})
```

- [ ] **Step 6: Run prose tests**

```bash
pnpm vitest run --project unit src/features/production-deployment/prose.test.ts
```

Expected: PASS — all twelve pins hit.

- [ ] **Step 7: Commit**

```bash
git add web/src/features/production-deployment/steps.ts \
        web/src/features/production-deployment/steps.test.ts \
        web/src/features/production-deployment/prose.test.ts
git commit -m "refactor(deployment): update step IDs and prose pins for 7-step layout

Steps: deploys, migrations, vercel, aws, flags, ai, traps.
Prose pins updated for restructured doc headings.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

### Task 5: AWS pipeline artifact data module

Create the data module for the GitHub Actions workflow YAML annotated artifact — the same pattern as the migration SQL artifact.

**Files:**
- Create: `web/src/features/production-deployment/pipeline-artifact.ts`
- Create: `web/src/features/production-deployment/pipeline-artifact.test.ts`

**Interfaces:**
- Produces: `PIPELINE_ARTIFACT: Artifact` — consumed by Task 8 (assembly)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'vitest'
import { PIPELINE_ARTIFACT } from './pipeline-artifact'

describe('pipeline artifact data', () => {
  test('language is yaml', () => {
    expect(PIPELINE_ARTIFACT.language).toBe('yaml')
  })

  test('has id and filename', () => {
    expect(PIPELINE_ARTIFACT.id).toBeTruthy()
    expect(PIPELINE_ARTIFACT.filename).toBeTruthy()
  })

  test('contains OIDC credential step', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('role-to-assume')
  })

  test('contains ECR login step', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('amazon-ecr-login')
  })

  test('contains deploy step', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('deploy-task-definition')
  })

  test('contains wait-for-service-stability', () => {
    const text = PIPELINE_ARTIFACT.lines.map((l) => l.text).join('\n')
    expect(text).toContain('wait-for-service-stability')
  })

  test('at least three annotated lines', () => {
    const annotated = PIPELINE_ARTIFACT.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(3)
  })

  test('exactly one pivot line', () => {
    const pivots = PIPELINE_ARTIFACT.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm vitest run --project unit src/features/production-deployment/pipeline-artifact.test.ts
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```ts
import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/13-production-deployment.md`, "#### The pipeline".
 *
 * A condensed GitHub Actions workflow for deploying to ECS via OIDC.
 * Six steps from the doc's workflow chain, each annotated where it
 * carries a decision. The pivot is `wait-for-service-stability` —
 * the line that separates "deploy" from "deploy and know it worked."
 */
export const PIPELINE_ARTIFACT: Artifact = {
  id: 'ecs-deploy-pipeline',
  filename: '.github/workflows/deploy.yml',
  language: 'yaml',
  lines: [
    { text: 'name: Deploy to ECS' },
    { text: 'on: { push: { branches: [main] } }' },
    { text: '' },
    { text: 'permissions:' },
    {
      text: '  id-token: write',
      note: 'Required — requests the OIDC token from GitHub. Without it, the token request fails silently.',
    },
    { text: '  contents: read' },
    { text: '' },
    { text: 'steps:' },
    { text: '  - uses: actions/checkout@v4' },
    { text: '' },
    {
      text: '  - uses: aws-actions/configure-aws-credentials@v4',
      note: 'No long-lived secrets. GitHub mints a short-lived JWT; AWS STS exchanges it for temporary credentials.',
    },
    { text: '    with: { role-to-assume: $ROLE_ARN, aws-region: us-east-1 }' },
    { text: '' },
    { text: '  - uses: aws-actions/amazon-ecr-login@v2' },
    { text: '' },
    { text: '  - run: docker build -t $REGISTRY/$REPO:${{ github.sha }} . && docker push ...' },
    { text: '' },
    {
      text: '  - uses: aws-actions/amazon-ecs-render-task-definition@v1',
      note: 'Swaps the image field in your task definition JSON to the new tag. Every image traceable to a commit.',
    },
    { text: '' },
    { text: '  - uses: aws-actions/amazon-ecs-deploy-task-definition@v2' },
    {
      text: '    with: { wait-for-service-stability: true, wait-max-delay-seconds: 30 }',
      note: 'Without this, the workflow reports success while the circuit breaker silently rolls back.',
      pivot: true,
    },
  ],
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm vitest run --project unit src/features/production-deployment/pipeline-artifact.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/features/production-deployment/pipeline-artifact.ts \
        web/src/features/production-deployment/pipeline-artifact.test.ts
git commit -m "feat(deployment): add AWS pipeline annotated artifact data

GitHub Actions OIDC → ECR → ECS workflow YAML with annotations on the
three decision points: id-token permission, OIDC credentials, and
wait-for-service-stability pivot.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

### Task 6: AWS deployment strategies data module

Create data modules for the AWS costs table and deployment strategy descriptions.

**Files:**
- Create: `web/src/features/production-deployment/aws-data.ts`
- Create: `web/src/features/production-deployment/aws-data.test.ts`

**Interfaces:**
- Produces: `AWS_COSTS: CostRow[]`, `ROLLING_CONFIG`, `CIRCUIT_BREAKER_CONFIG`, `STRATEGIES: Strategy[]` — consumed by Task 8 (assembly)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'vitest'
import { AWS_COSTS, STRATEGIES, ROLLING_CONFIG, CIRCUIT_BREAKER_CONFIG } from './aws-data'
import { flat, section } from './doc-source'

describe('AWS deployment data', () => {
  const src = section('AWS deployment strategies')

  test('six cost rows', () => {
    expect(AWS_COSTS).toHaveLength(6)
  })

  test('unique cost IDs', () => {
    const ids = AWS_COSTS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every cost row has a range', () => {
    for (const row of AWS_COSTS) {
      expect(row.low, `${row.id} low`).toBeGreaterThan(0)
      expect(row.high, `${row.id} high`).toBeGreaterThan(row.low)
    }
  })

  test('costs pin: NAT Gateway in doc', () => {
    expect(flat(src)).toContain(flat('NAT Gateway'))
  })

  test('costs pin: $85 total in doc', () => {
    expect(flat(src)).toContain(flat('$85'))
  })

  test('five deployment strategies', () => {
    expect(STRATEGIES).toHaveLength(5)
  })

  test('unique strategy IDs', () => {
    const ids = STRATEGIES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('rolling config pins against doc', () => {
    expect(flat(src)).toContain(flat('minimumHealthyPercent'))
    expect(ROLLING_CONFIG.minimumHealthyPercent).toBe(100)
    expect(ROLLING_CONFIG.maximumPercent).toBe(200)
  })

  test('circuit breaker config', () => {
    expect(CIRCUIT_BREAKER_CONFIG.enable).toBe(true)
    expect(CIRCUIT_BREAKER_CONFIG.rollback).toBe(true)
  })

  test('strategies have sufficient text', () => {
    for (const s of STRATEGIES) {
      expect(s.name.length, `${s.id} name`).toBeGreaterThan(3)
      expect(s.pattern.length, `${s.id} pattern`).toBeGreaterThan(10)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm vitest run --project unit src/features/production-deployment/aws-data.test.ts
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Write the implementation**

```ts
/**
 * Source: `docs/13-production-deployment.md`, "### AWS deployment strategies".
 *
 * Cost ranges are order-of-magnitude, US East. They match the doc's table
 * and are designed to stay useful across pricing updates.
 */

export type CostRow = {
  id: string
  service: string
  low: number
  high: number
  vercelIncludes: string
}

export const AWS_COSTS: CostRow[] = [
  {
    id: 'alb',
    service: 'Application Load Balancer',
    low: 22,
    high: 27,
    vercelIncludes: 'Routing, TLS, load balancing',
  },
  {
    id: 'nat',
    service: 'NAT Gateway',
    low: 35,
    high: 100,
    vercelIncludes: 'Outbound internet from private subnets',
  },
  {
    id: 'fargate',
    service: 'Fargate (one task)',
    low: 18,
    high: 40,
    vercelIncludes: 'Compute',
  },
  {
    id: 'data-transfer',
    service: 'Data transfer',
    low: 5,
    high: 20,
    vercelIncludes: 'Inter-AZ, egress, NAT processing',
  },
  {
    id: 'cloudwatch',
    service: 'CloudWatch',
    low: 5,
    high: 15,
    vercelIncludes: 'Logs, metrics, alarms',
  },
  {
    id: 'ecr',
    service: 'ECR',
    low: 1,
    high: 2,
    vercelIncludes: 'Container registry',
  },
]

export type Strategy = {
  id: string
  name: string
  pattern: string
}

export const STRATEGIES: Strategy[] = [
  {
    id: 'canary-5',
    name: 'ECSCanary10Percent5Minutes',
    pattern: '10% first, rest after 5 min',
  },
  {
    id: 'canary-15',
    name: 'ECSCanary10Percent15Minutes',
    pattern: '10% first, rest after 15 min',
  },
  {
    id: 'linear-1',
    name: 'ECSLinear10PercentEvery1Minutes',
    pattern: '10% every 1 min (~10 min total)',
  },
  {
    id: 'linear-3',
    name: 'ECSLinear10PercentEvery3Minutes',
    pattern: '10% every 3 min (~30 min total)',
  },
  {
    id: 'all-at-once',
    name: 'ECSAllAtOnce',
    pattern: 'Immediate full cutover',
  },
]

export const ROLLING_CONFIG = {
  minimumHealthyPercent: 100,
  maximumPercent: 200,
} as const

export const CIRCUIT_BREAKER_CONFIG = {
  enable: true,
  rollback: true,
} as const
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm vitest run --project unit src/features/production-deployment/aws-data.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/features/production-deployment/aws-data.ts \
        web/src/features/production-deployment/aws-data.test.ts
git commit -m "feat(deployment): add AWS costs and strategies data modules

Six cost rows ($85–204/month total), five deployment strategy configs,
rolling update defaults, circuit breaker config. All pinned against doc.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

### Task 7: Update AI plays and traps data modules

Update existing data modules to include AWS-specific content.

**Files:**
- Modify: `web/src/features/production-deployment/ai-plays.ts`
- Modify: `web/src/features/production-deployment/ai-plays.test.ts`
- Modify: `web/src/features/production-deployment/traps.ts`
- Modify: `web/src/features/production-deployment/traps.test.ts`
- Modify: `web/src/features/production-deployment/checklist.ts`
- Modify: `web/src/features/production-deployment/checklist.test.ts`

**Interfaces:**
- Consumes: updated doc from Tasks 1–3
- Produces: `PLAYS` (8 items, up from 4), `TRAPS` (12 items, up from 8), `DONE` (6 items, up from 5) — consumed by Task 8 (assembly)

- [ ] **Step 1: Write failing AI plays test**

Update `ai-plays.test.ts`. Change the count and add new pins:

```ts
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

  test('limit pins against doc — includes AWS CLI', () => {
    expect(flat(src)).toContain(flat('the AWS CLI'))
  })

  test('eight plays', () => {
    expect(PLAYS).toHaveLength(8)
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

  test('has an AWS task definition play', () => {
    expect(PLAYS.some((p) => p.id === 'generate-task-def')).toBe(true)
  })

  test('has an AWS workflow play', () => {
    expect(PLAYS.some((p) => p.id === 'generate-workflow')).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify RED**

```bash
pnpm vitest run --project unit src/features/production-deployment/ai-plays.test.ts
```

Expected: FAIL — count is 4, not 8; `AI_LIMIT` does not contain "the AWS CLI".

- [ ] **Step 3: Update ai-plays.ts**

Update `AI_LIMIT` to include AWS CLI. Add four new plays after the existing four:

```ts
export const AI_LIMIT =
  'The tools are the Vercel CLI, the AWS CLI, `curl`, and whichever editor the agent runs in. The gap is the same one the rest of this stage names: data does not roll back. An agent that runs a contract migration against production because the expand step passed is doing exactly what it was told, and the data is gone.'

// After existing four plays, add:
  {
    id: 'generate-task-def',
    title: 'Generate an ECS task definition from a Dockerfile',
    kind: 'prompt',
    body: 'Describe the container requirements — port, memory, CPU, environment variables — and the agent writes the task definition JSON. Review the resource limits; do not deploy unread.',
  },
  {
    id: 'validate-config',
    title: 'Validate deployment configuration',
    kind: 'prompt',
    body: 'Paste your `deploymentConfiguration` JSON and ask whether `minimumHealthyPercent` and `maximumPercent` can deadlock at your `desiredCount`. The agent checks the arithmetic.',
  },
  {
    id: 'generate-workflow',
    title: 'Generate a GitHub Actions ECS deploy workflow',
    kind: 'prompt',
    body: 'Describe the pipeline — ECR repo, cluster name, service name — and the agent writes the workflow YAML with OIDC, no long-lived secrets.',
  },
  {
    id: 'audit-alarms',
    title: 'Audit CloudWatch alarm coverage for a deployment',
    kind: 'prompt',
    body: 'List the alarms attached to your CodeDeploy deployment group and ask whether error rate, latency, and availability are covered. The gap is always the alarm you did not write.',
  },
```

- [ ] **Step 4: Run to verify GREEN**

```bash
pnpm vitest run --project unit src/features/production-deployment/ai-plays.test.ts
```

Expected: PASS

- [ ] **Step 5: Write failing traps test**

Update `traps.test.ts`. Change the count to 12:

```ts
import { describe, expect, test } from 'vitest'
import { TRAPS } from './traps'
import { flat, h2 } from './doc-source'

describe('production deployment traps data', () => {
  const src = h2('Traps')

  test('twelve traps from doc', () => {
    const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
    expect(boldLeads).toHaveLength(12)
    expect(TRAPS).toHaveLength(12)
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

  test('body pin: health-check-grace', () => {
    expect(flat(src)).toContain(
      flat('ECS kills tasks before they finish starting'),
    )
  })

  test('body pin: min-max-deadlock', () => {
    expect(flat(src)).toContain(
      flat('The scheduler cannot start the new task'),
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

- [ ] **Step 6: Run to verify RED**

```bash
pnpm vitest run --project unit src/features/production-deployment/traps.test.ts
```

Expected: FAIL — count is 8, not 12.

- [ ] **Step 7: Update traps.ts**

Add four new traps after the existing eight:

```ts
  {
    id: 'health-check-grace',
    title: 'Health check grace period too short.',
    body: 'ECS kills tasks before they finish starting. The default grace period is zero seconds — a container that takes thirty seconds to boot fails its first health check and restarts in a loop. Set `healthCheckGracePeriodSeconds` to longer than your startup time.',
  },
  {
    id: 'nat-without-endpoints',
    title: 'NAT Gateway without VPC endpoints.',
    body: 'Every AWS API call from a private subnet goes through the NAT Gateway at $0.045/GB. ECR image pulls, CloudWatch log writes, SSM parameter reads — all NAT traffic unless you create VPC endpoints for those services.',
  },
  {
    id: 'min-max-deadlock',
    title: 'minimumHealthyPercent and maximumPercent deadlock.',
    body: 'Both at 100% with `desiredCount: 1`. The scheduler cannot start the new task (exceeds max) or stop the old one (violates min). The deployment hangs with no error.',
  },
  {
    id: 'no-wait-for-stability',
    title: 'Deploying without wait-for-service-stability.',
    body: 'The GitHub Actions workflow reports success after calling `UpdateService`. Meanwhile, the deployment circuit breaker detects failing health checks and rolls back. Your pipeline is green; your production is on the old version.',
  },
```

- [ ] **Step 8: Run to verify GREEN**

```bash
pnpm vitest run --project unit src/features/production-deployment/traps.test.ts
```

Expected: PASS

- [ ] **Step 9: Update checklist — add one DoD item**

Update `checklist.ts` to add the sixth item. Update `checklist.test.ts` to expect 6 items:

In `checklist.ts`, add after the existing five `DONE` items:
```ts
  {
    id: 'strategy-matches',
    label: 'Deployment strategy matches the service risk profile',
  },
```

In `checklist.test.ts`, change `toHaveLength(5)` to `toHaveLength(6)` for the done-items test, and update the checkbox-line count to match.

- [ ] **Step 10: Run all data tests**

```bash
pnpm vitest run --project unit src/features/production-deployment/
```

Expected: ALL PASS

- [ ] **Step 11: Commit**

```bash
git add web/src/features/production-deployment/ai-plays.ts \
        web/src/features/production-deployment/ai-plays.test.ts \
        web/src/features/production-deployment/traps.ts \
        web/src/features/production-deployment/traps.test.ts \
        web/src/features/production-deployment/checklist.ts \
        web/src/features/production-deployment/checklist.test.ts
git commit -m "feat(deployment): add AWS plays, traps, and DoD item

AI plays: 4 → 8 (generate task def, validate config, generate workflow,
audit alarms). Traps: 8 → 12 (health check grace, NAT endpoints, min/max
deadlock, wait-for-stability). DoD: 5 → 6 (strategy matches risk).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

### Task 8: Assemble the restructured ProductionDeployment component

The assembly task. Restructures `ProductionDeployment.tsx` from 6 steps to 7, moving content between steps and adding the new AWS panel. Also adds new glossary terms and updates the References.

**Files:**
- Modify: `web/src/features/production-deployment/ProductionDeployment.tsx`
- Modify: `web/src/features/production-deployment/ProductionDeployment.test.tsx`
- Modify: `web/src/lib/terms.ts` (new terms)
- Modify: `web/src/lib/references.ts` (add one AWS reference)
- Modify: `web/src/features/production-deployment/AIPlays.tsx` (minor — no structural change)

**Interfaces:**
- Consumes: `STEP_IDS` (7 items from Task 4), `PIPELINE_ARTIFACT` (Task 5), `AWS_COSTS`, `STRATEGIES`, `ROLLING_CONFIG`, `CIRCUIT_BREAKER_CONFIG` (Task 6), `PLAYS` (8, Task 7), `TRAPS` (12, Task 7), `DONE` (6, Task 7)
- Produces: the assembled page — the final deliverable

- [ ] **Step 1: Write the failing component test**

Update `ProductionDeployment.test.tsx`:

```tsx
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductionDeployment } from './ProductionDeployment'

describe('ProductionDeployment page', () => {
  test('renders seven steps in the rail', () => {
    render(<ProductionDeployment />)
    const steps = screen.getAllByRole('tab')
    expect(steps).toHaveLength(7)
  })

  test('first step label contains "Small"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /small/i })).toBeTruthy()
  })

  test('has a Vercel step', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /vercel/i })).toBeTruthy()
  })

  test('has an AWS step', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /aws/i })).toBeTruthy()
  })

  test('has a Feature flags step', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /flag/i })).toBeTruthy()
  })

  test('last step label is "Traps"', () => {
    render(<ProductionDeployment />)
    expect(screen.getByRole('tab', { name: /traps/i })).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run to verify RED**

```bash
pnpm vitest run --project dom src/features/production-deployment/ProductionDeployment.test.tsx
```

Expected: FAIL — 6 steps, not 7; no Vercel/AWS/flags tabs.

- [ ] **Step 3: Restructure ProductionDeployment.tsx**

This is the core assembly. The `CONTENT_STEPS` array changes from 6 entries to 7. Key changes:

**Panel 1 (deploys):** Remove "Vercel builds and promotes" from the small-and-frequent Section. Replace with "Merge to `main`, the CI/CD pipeline builds and promotes."

**Panel 2 (migrations):** Unchanged.

**Panel 3 (vercel) — NEW, consolidates old safety + rollback:**
- Move `SAFETY_ROWS[0]` (skew protection) into this panel, but inline rather than RevealList — it is the only Vercel-specific item now.
- Move the Vercel CLI code block from old `rollback` panel.
- Move the "Roll back first, diagnose second" section.
- Move the contract-migration Callout.
- Add a framing sentence at top: "On Vercel, two mechanisms make deploys routine."

**Panel 4 (aws) — NEW:**
- Import `PIPELINE_ARTIFACT` from `./pipeline-artifact`.
- Import `AWS_COSTS`, `STRATEGIES` from `./aws-data`.
- Render the pipeline artifact in a `Figure` (Figure 2).
- Render rolling update explanation with `Card` showing the config JSON.
- Render the strategies table.
- Render the costs table.
- Add `Callout kind="warn"` for NAT Gateway.

**Panel 5 (flags) — NEW, extracted from old safety:**
- Move `SAFETY_ROWS[1]` (feature flags) content into a full Section.
- Add the Edge Config code block from the doc.
- "Delete flags once rolled out" stays.

**Panel 6 (ai):** Unchanged structurally — `AIPlays` component handles the updated data.

**Panel 7 (traps):** Unchanged structurally — the `TRAPS` array now has 12 items, `DeploymentChecklist` handles 6 DoD items.

Delete the `SAFETY_ROWS` constant (no longer needed — its content is distributed between `vercel` and `flags` panels).

Update figure numbering: Figure 1 stays (migration artifact), Figure 2 is the pipeline artifact.

- [ ] **Step 4: Add glossary terms**

In `web/src/lib/terms.ts`, add after existing entries (check alphabetical order by key):

```ts
  'blue-green-deployment': {
    name: 'Blue/green deployment',
    short: 'Running two identical environments and switching traffic between them.',
    full: 'A deployment strategy where two complete environments (blue and green) run in parallel. The new version deploys to the idle environment, gets verified, then traffic switches from the active to the idle. Rollback is switching back.',
    teaches:
      'The trade-off is infrastructure cost — you need capacity for both environments during the switch — in exchange for instant, zero-downtime rollback during the bake window.',
    see: '13-production-deployment',
  },
  'rolling-deployment': {
    name: 'Rolling deployment',
    short: 'Replacing instances of the old version one at a time.',
    full: 'A deployment strategy where new tasks start alongside old tasks, pass health checks, and then old tasks drain. On ECS, governed by minimumHealthyPercent and maximumPercent.',
    teaches:
      'The simplest strategy and the ECS default. No extra infrastructure, but rollback means deploying the previous version forward — there is no instant switch back.',
    see: '13-production-deployment',
  },
  'deployment-circuit-breaker': {
    name: 'Deployment circuit breaker',
    short: 'Auto-rollback when new tasks repeatedly fail health checks.',
    full: 'An ECS feature that monitors new tasks during a rolling deployment. If they repeatedly fail to reach a healthy state, ECS stops the deployment and rolls back to the last successful revision. Without it, a bad image loops through start-crash-restart indefinitely.',
    teaches:
      'A safety net that turns a silent failure into an automatic recovery. Enable it on every ECS service with rollback: true.',
    see: '13-production-deployment',
  },
```

- [ ] **Step 5: Add one AWS reference**

In `web/src/lib/references.ts`, add one entry to the `'13-production-deployment'` array (bringing total to 5, the maximum):

```ts
    {
      title: 'Amazon ECS Deployment Strategies',
      source: 'AWS Docs',
      url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html',
      adds: 'The rolling-update mechanics in full — minimumHealthyPercent/maximumPercent arithmetic, deployment circuit breaker thresholds, and unhealthy-task handling during deployments.',
    },
```

Update the existing AWS Whitepapers reference's `adds` field since the stage now covers these strategies directly:

```ts
    {
      title: 'Deployment Strategies',
      source: 'AWS Whitepapers',
      url: 'https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/deployment-strategies.html',
      adds: 'The broader strategic landscape — in-place, immutable, and traffic-shifting categories — for a reader comparing AWS approaches beyond what ECS offers natively.',
    },
```

- [ ] **Step 6: Regenerate glossary**

```bash
pnpm gen:glossary
```

Confirm `reference/glossary.md` has the new terms. Diff should show additions only.

- [ ] **Step 7: Run to verify GREEN**

```bash
pnpm vitest run --project dom src/features/production-deployment/ProductionDeployment.test.tsx
```

Expected: PASS — 7 steps, all tab names found.

- [ ] **Step 8: Run the full test suite**

```bash
pnpm test
```

Expected: ALL PASS. Watch for:
- `rails.test.tsx` — reads `STEP_IDS_BY_SLUG['13-production-deployment']` and checks it against the rendered rail. Should pass since `steps.ts` was updated in Task 4.
- `references.test.ts` — cap of 5 per stage. Now at exactly 5.
- `term-usage.test.ts` — new `<Term>` usages must reference existing term IDs.

- [ ] **Step 9: Build**

```bash
pnpm build
```

Expected: clean build, stage 13 prerendered.

- [ ] **Step 10: Commit**

```bash
git add web/src/features/production-deployment/ProductionDeployment.tsx \
        web/src/features/production-deployment/ProductionDeployment.test.tsx \
        web/src/lib/terms.ts \
        web/src/lib/references.ts \
        reference/glossary.md
git commit -m "feat(deployment): assemble 7-step platform-aware layout

Steps: deploys, migrations, vercel, aws, flags, ai, traps.
Vercel consolidates old safety+rollback. AWS panel with pipeline
artifact, strategy comparison, and costs table. Feature flags
extracted to own step. Three new glossary terms, one new reference.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Rf3eqsneoworuvgHkBfoTR"
```

---

## Verification (after all tasks)

Run all gates in order. Every command from `web/`.

```bash
pnpm lint                   # 0 warnings
pnpm typecheck              # next typegen && tsc --noEmit
pnpm test                   # vitest — both projects
pnpm build                  # clean prerender
pnpm test:e2e               # 17/18 (pre-existing failure on /reference/deployment-environments at 320px is unrelated)
pnpm test:dev-console       # 1/1 — React dev-mode warnings
```

### Panel measurement

Measure every step at 1024×768. Every panel must be under 4.0 screens (3072px). If the `aws` panel exceeds the ceiling, split it per D-65: `aws-strategies` (pipeline + rolling + blue/green + canary) and `aws-ops` (rollback + costs). Update `steps.ts` and the component accordingly.

### Post-gate checklist

- [ ] Coverage walk — first run on stage 13. Dispatch a fresh subagent with only `docs/13-production-deployment.md` and `web/src/features/production-deployment/`. No plan, no spec, no reports.
- [ ] Humanizer — run `humanizer:humanizer` over the panel prose. First run for stage 13.
- [ ] Fix wave — close findings from the coverage walk and humanizer.
- [ ] Final whole-branch review — before merge request.

---

## Execution approach recommendation

**Subagent-Driven Development is recommended for this plan.** Eight tasks, high independence between Phase 1 (doc, Tasks 1–3) and Phase 2 (interactive, Tasks 4–8). Within Phase 2, Tasks 4–7 (data modules) are independent; Task 8 (assembly) depends on all of them. The plan has clear task boundaries with per-task review gates — exactly the shape SDD handles well.

Phase dependency: Tasks 1–3 must complete sequentially (each edits the same doc file). Tasks 4–7 can run in parallel once the doc is stable. Task 8 depends on Tasks 4–7.
