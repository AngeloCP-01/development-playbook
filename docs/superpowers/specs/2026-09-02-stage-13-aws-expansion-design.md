# Stage 13 (Production Deployment) — AWS Expansion Design

**Date:** 2026-09-02
**Branch:** `docs/2026-09-02-stage-13-aws-expansion` (off `develop`)
**Source doc:** `docs/13-production-deployment.md` (245 lines, Vercel-focused)
**Existing interactive:** 6 steps in `web/src/features/production-deployment/` (18 files,
974 tests across 138 files at baseline)
**Prior session:** Design approved in S277 (2026-09-02). Research pass verified AWS
specifics across four parallel agents this session.

---

## Problem

Stage 13 is interactive and merged but entirely Vercel-focused. The user uses Vercel for
personal projects and AWS at work. The stage teaches deployment mechanics that do not
transfer: `vercel rollback`, `vercel promote`, Vercel skew protection. A reader deploying
to ECS, CodeDeploy, or any non-Vercel host gets nothing actionable from four of the six
steps.

The existing step structure conflates platform-specific mechanics (skew protection,
`vercel rollback`) with platform-agnostic principles (feature flags, small deploys,
expand/migrate/contract) in ways that make it impossible to add AWS content without
duplicating the agnostic parts or interleaving the platforms inside a single step.

## Goals

- Restructure from 6 steps to 7 (or 8 if measurement requires a split), separating
  platform-agnostic content from platform-specific deployment mechanics.
- Add deep AWS deployment content: the CI/CD pipeline (GitHub Actions OIDC → ECR → ECS),
  rolling updates with circuit breaker, blue/green (ECS-native and CodeDeploy), canary
  and linear traffic shifting with CloudWatch alarm gates, rollback mechanics, and a
  "costs Vercel hides" reality check.
- Expand `docs/13-production-deployment.md` to match the new structure before touching
  the interactive port (same doc-correction-then-port pattern as stages 04–07 and 12–13).
- Update AI plays for both platforms and add AWS-specific traps.
- Run the coverage walk that has never been run on stage 13.
- Run the humanizer that has never been run on stage 13.

## Non-goals

- **No Lambda deployment coverage.** Lambda has its own deployment model (SAM, CDK, SST)
  that does not share ECS's deployment-strategy vocabulary. It is a different stage
  section, not an extension of this one. Dropped because the stage's central claim —
  code rolls back in seconds, data does not — applies identically to Lambda and does not
  need repeating, while Lambda's mechanics (versioning, aliases, provisioned concurrency)
  are a different topic.
- **No Kubernetes/EKS coverage.** EKS deployments add an orchestration layer (Helm,
  ArgoCD, Flux) that doubles the scope. The ECS coverage already teaches the underlying
  strategies (rolling, blue/green, canary) that Kubernetes uses the same vocabulary for.
- **No Terraform/CDK/CloudFormation IaC.** The stage teaches deployment strategies, not
  infrastructure provisioning. Config snippets show the deployment-relevant fields
  (task definition, deployment configuration, ALB target groups) in AWS CLI/API JSON,
  not in a specific IaC tool.
- **No cost calculator or interactive pricing widget.** The costs section is a static
  reference table showing order-of-magnitude monthly costs, not a dynamic tool.
- **No new shared component.** Every pattern needed already exists. The annotated GitHub
  Actions workflow YAML uses `AnnotatedArtifact` (same as the migration SQL).

## Constraints

- D-52: one judgment per step, panel under four screens at 1024×768.
- D-35: AI plays step is mandatory (already exists, needs AWS plays added).
- D-47: grep `terms.ts` before writing prose.
- D-65: author split, merge on measurement — the `aws` step may need splitting.
- D-67: doc-pinned assertions use literal phrases from the doc.
- The three-file registration (`stages.ts`, `stage-content.ts`, `step-ids.ts`) does not
  apply here — the stage is already registered. The local
  `production-deployment/steps.ts` needs its IDs updated (6 → 7+); the global
  `web/src/features/step-ids.ts` already imports from it and picks up the change
  automatically.
- Tests use `@testing-library/react` + plain DOM assertions, never `jest-dom` or
  `user-event`.
- `doc-source.ts` helpers (`section`, `flat`, `fences`) handle hard line-wraps in the
  doc.
- Existing tests must not break. The restructure changes step IDs (`safety` → `vercel`,
  `rollback` removed as separate step), which affects `steps.test.ts`, `prose.test.ts`,
  and the e2e audit suite's URL hashes.

---

## Architecture

### Step structure (6 → 7 steps)

```
deploys → migrations → vercel → aws → flags → ai → traps
```

| Step | Label | Hint | Source |
|---|---|---|---|
| `deploys` | Small & frequent | One change, one suspect | Keep, remove Vercel mention |
| `migrations` | Migrations | Expand, migrate, contract | Keep as-is |
| `vercel` | Vercel | Skew protection + instant rollback | Consolidate old `safety` skew row + old `rollback` |
| `aws` | AWS | Strategies, pipelines, and costs | **New** — six subsections |
| `flags` | Feature flags | Decouple deploy from release | Extract from old `safety` flag row |
| `ai` | AI in deployment | Mechanical coverage, not judgment | Update for both platforms |
| `traps` | Traps | The mistakes that look like normal work | Update with AWS traps |

The `aws` step is authored as one panel. If it measures over 4.0 screens at 1024×768,
split into `aws-strategies` (pipeline + rolling + blue/green + canary) and `aws-ops`
(rollback + costs), taking the total to 8 steps. Decision recorded with measurement
per D-65.

### What moves where

| Old step | Old content | New location |
|---|---|---|
| `safety` | Skew protection row | → `vercel` step |
| `safety` | Feature flags row | → `flags` step |
| `rollback` | Vercel CLI commands | → `vercel` step |
| `rollback` | Diagnose-second rule | → `vercel` step |
| `rollback` | Contract-migration warning | → `vercel` step (also referenced in `aws` rollback) |

### AWS step subsections (the new content)

**4a. The pipeline.** GitHub Actions OIDC → ECR → ECS. No long-lived AWS credentials.
The workflow YAML is an annotated artifact (same pattern as the migration SQL). Six
steps: checkout, configure-aws-credentials (OIDC), ecr-login, build+push, render-task-def,
deploy-task-def. The `wait-for-service-stability` flag and the SDK backoff gotcha.

**4b. Rolling updates.** The ECS default: `minimumHealthyPercent: 100`,
`maximumPercent: 200`. What the numbers mean (minimum running tasks during deploy,
maximum simultaneous tasks). The deployment circuit breaker (`enable: true,
rollback: true`) — auto-rollback on consecutive task failures. The deadlock trap:
both at 100% with `desiredCount: 1`.

**4c. Blue/green.** ALB with two target groups. Two approaches:
- **ECS-native** (recommended): `strategy: "BLUE_GREEN"`, `bakeTimeInMinutes`. Simpler,
  no CodeDeploy infrastructure.
- **CodeDeploy** (established): appspec file, deployment group, lifecycle hooks (Lambda).
  More ecosystem tooling, more existing tutorials.

Both swap the ALB listener from the blue target group to the green one. The bake time
(ECS-native) or termination wait (CodeDeploy) is the window where both task sets run
and you can roll back instantly.

**4d. Canary and linear.** Traffic shifting strategies:
- **Canary**: small percentage first (10%), then all remaining after a wait (5 or 15 min).
- **Linear**: equal increments at regular intervals (10% every 1 or 3 min).
- CloudWatch alarm integration: up to 10 alarms per deployment group, auto-rollback on
  `ALARM` state during the shift.

**4e. Rollback.** Three mechanisms:
- Rolling update: circuit breaker auto-rollback, or manual
  `aws ecs update-service --task-definition <previous-revision>`.
- Blue/green (ECS-native): rollback during bake time reverts to blue task set.
- CodeDeploy: `aws deploy stop-deployment`, alarm-triggered auto-rollback.

**4f. Costs Vercel hides.** A reference table:

| Service | Monthly (small app) | What it does |
|---|---|---|
| ALB | $22–27 | Load balancer (Vercel: included) |
| NAT Gateway | $35–100 | Outbound internet from private subnet (Vercel: no VPC) |
| Fargate | $18–40 | Compute per task (Vercel: serverless, pay per invocation) |
| Data transfer | $5–20 | Inter-AZ, egress, NAT processing (Vercel: included) |
| CloudWatch | $5–15 | Logs, metrics, alarms (Vercel: included) |
| ECR | $0.50–2 | Container registry (Vercel: build system) |
| **Total** | **$85–204** | vs. Vercel Pro $20/seat |

The point is not that AWS is expensive — it is that these costs are invisible on Vercel
and a surprise on AWS. NAT Gateway is the classic bill shock.

### Interactive patterns per step

| Step | Pattern | Component | Detail |
|---|---|---|---|
| `deploys` | Cards | `Card` × 2 | Code vs. data asymmetry (unchanged) |
| `deploys` | Cross-links | `Link` | Stages 07, 11, 12 (unchanged) |
| `migrations` | Annotated artifact | `AnnotatedArtifact` | SQL migration (unchanged) |
| `vercel` | RevealList | `RevealList` | Skew protection (moved from `safety`) |
| `vercel` | Code block | `Card` + `pre` | CLI commands (moved from `rollback`) |
| `vercel` | Callout | `Callout kind="warn"` | Contract migration warning (moved) |
| `aws` | Annotated artifact | `AnnotatedArtifact` | GitHub Actions workflow YAML (**new**) |
| `aws` | Cards | `Card` × 4 | Deployment strategies comparison (**new**) |
| `aws` | Table | `<table>` or grid | Costs comparison (**new**) |
| `aws` | Callout | `Callout kind="warn"` | NAT Gateway bill shock (**new**) |
| `flags` | Prose + code | `Prose` + `InlineCode` | Flag implementation (moved from `safety`) |
| `ai` | RevealList | `RevealList` + `AIPlays` | Plays with badges (updated) |
| `traps` | Callout × N | `Callout kind="trap"` | 8 existing + 4 new AWS traps |
| `traps` | Checklist | `DeploymentChecklist` | Updated with AWS items |

### New glossary terms

Candidates (verify against `terms.ts` before adding):
- `blue-green-deployment`
- `canary-deployment`
- `rolling-deployment`
- `deployment-circuit-breaker`
- `oidc` (OpenID Connect)
- `target-group` (ALB)
- `nat-gateway`

### New references

- AWS ECS Deployment Strategies (native blue/green, rolling, canary, linear)
- GitHub Actions for Amazon ECS (the `aws-actions` collection)
- AWS Fargate Pricing

The four existing references stay: Vercel Instant Rollback, Vercel Skew Protection,
Prisma Expand and Contract Pattern, AWS Deployment Strategies (this last one may need
its URL updated to point at the native ECS docs rather than the older CodeDeploy docs).

---

## Testing

### Doc phase

- Doc-pinned assertions (`prose.test.ts`) update to match the restructured sections.
  New phrases pin AWS-specific content (e.g., `minimumHealthyPercent`,
  `wait-for-service-stability`, "costs Vercel hides").
- `stage-metadata.test.ts` already has stage 13 in `AI_SECTION_STAGES` — no change.

### Interactive phase

- `steps.test.ts` — updated step IDs (`safety` → `vercel`, `rollback` removed, `aws`
  and `flags` added).
- New data modules for AWS content:
  - `aws-strategies.ts` + `aws-strategies.test.ts` — deployment strategy data
  - `aws-costs.ts` + `aws-costs.test.ts` — cost table data
  - `aws-pipeline.ts` + `aws-pipeline.test.ts` — GitHub Actions workflow artifact
- Updated data modules:
  - `traps.ts` — add 4 AWS-specific traps (12 total)
  - `checklist.ts` — add AWS-relevant DoD items
  - `ai-plays.ts` — add AWS plays (8 total, up from 4)
- Component tests:
  - `ProductionDeployment.test.tsx` — updated for new step structure
  - Existing `DeploymentChecklist.test.tsx` and `AIPlays.test.tsx` — may need updates
    for new data

### Audit

- `test:e2e` — the audit hashes change (old `#safety` and `#rollback` become `#vercel`,
  `#aws`, `#flags`). The audit derives URLs from step IDs, so no manual update needed
  as long as `STEP_IDS_BY_SLUG` is correct.
- `test:dev-console` — run once after the port to catch React dev-mode warnings.

---

## Verification

1. All quality gates pass: lint, typecheck, test, build, e2e (17/18 — the pre-existing
   `/reference/deployment-environments` 320px overflow is unrelated).
2. Panel measurement: every step under 4.0 screens at 1024×768. If `aws` exceeds,
   split per D-65.
3. Coverage walk: run for the first time on stage 13, context-starved (no plan, no
   reports), against the expanded doc and the restructured panels.
4. Humanizer: run over panel prose (first time for stage 13).
5. Contrast: both themes, all steps, WCAG AA.
6. Responsive: 320→2560px, no horizontal overflow, no sub-44px touch target.
7. Console: zero errors in a clean browser context.

---

## Documentation updates

- `docs/13-production-deployment.md` — expanded from ~245 to ~500+ lines with AWS
  sections, restructured headings matching the 7-step layout.
- `docs/tracker.md` — new row for W-3.9b (AWS expansion).
- `KICKOFF.md` — refresh project state after completion.
- `reference/glossary.md` — regenerated via `pnpm gen:glossary` if new terms added.
- No change to `docs/task.md` scope — this is already inside W-3's "nine stages remain"
  mandate, as a revision of an existing stage rather than a new one.

---

## Risks

1. **The `aws` step is too heavy for one panel.** Mitigated by D-65: author as one,
   measure, split if over ceiling. The split boundary (strategies vs. operations) is
   clean.
2. **Research findings go stale.** AWS pricing and service configurations change. The
   cost table uses order-of-magnitude ranges ($22–27, not $22.43) to stay useful longer.
   CLI commands and config syntax are pinned to current docs, not memory.
3. **ECS-native deployment strategies are new.** The native `BLUE_GREEN`/`CANARY`/`LINEAR`
   strategies may have less ecosystem tooling and fewer tutorials than CodeDeploy. The
   spec teaches both and recommends native, with CodeDeploy as the established alternative.
4. **Existing test breakage from step ID changes.** `safety` and `rollback` disappear as
   step IDs. Every test touching those IDs must update atomically with the step rename.
   The `prose.test.ts` doc-pin tests and `steps.test.ts` are the primary risk.
5. **Doc expansion scope.** The doc could grow unboundedly. The constraint is the same
   one `stage-implementation-101.md` names: the doc teaches, it does not replace AWS
   documentation. Each subsection links to the AWS source and teaches the decision
   ("when rolling vs. blue/green"), not the full configuration reference.

---

## Execution order

1. **Doc expansion** (`docs/13-production-deployment.md`) — restructure headings, add
   AWS sections, update Vercel sections. Commit separately with `docs(deployment):`.
2. **Interactive restructure** — update step IDs, move content between steps, add AWS
   data modules and components. TDD per task.
3. **Coverage walk** — first run on stage 13. Context-starved.
4. **Fix wave** — close coverage-walk findings.
5. **Humanizer** — first run on stage 13 prose.
6. **Final whole-branch review** — before merge.
