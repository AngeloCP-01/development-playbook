# Fix Wave Report — Stage 13 Coverage Fixes

**Branch:** `fix/stage-13-coverage-fixes`
**Commit:** `5644ab5`
**Date:** 2026-09-03

## Verification

| Check | Result |
|---|---|
| `pnpm test` | 1003 passed / 140 files |
| `pnpm build` | 43/43 pages, TypeScript clean |
| `pnpm lint` | 0 warnings |
| Lefthook pre-commit | format + lint passed |

## Changes (4 files)

### Fix 1: Split `aws` panel into `aws` + `aws-ops`

**Files:** `steps.ts`, `steps.test.ts`, `ProductionDeployment.tsx`, `ProductionDeployment.test.tsx`

- Added `'aws-ops'` after `'aws'` in `STEP_IDS` (7 → 8 steps)
- `aws` panel keeps: "The pipeline" (Figure 2), "Rolling updates", "Blue/green and traffic shifting"
- `aws` hint updated from "Pipeline, strategies, costs" to "Pipeline, rolling, blue/green"
- New `aws-ops` panel (label "AWS Ops", hint "Rollback and costs") gets:
  - NEW "Rollback on AWS" section — three paths (rolling update, blue/green ECS-native, CodeDeploy) with CLI code blocks and a warn callout about roll-back-first rule
  - "Costs Vercel hides" section moved from aws panel (costs table + NAT callout)
- Tests updated: 7 → 8 tab assertions, added `aws-ops` tab check, fixed `/aws/i` regex to `/aws \/ ecs/i` to avoid matching both tabs

### Fix 2: CloudWatch alarm content (B-2)

**File:** `ProductionDeployment.tsx`

- Added a Prose paragraph about CloudWatch alarm integration (up to 10 alarms, automatic traffic revert) in the `aws` panel's "Blue/green and traffic shifting" section, between the strategies table and the canary/linear description

### Fix 3: Feature flags code block (B-3)

**File:** `ProductionDeployment.tsx`

- Replaced the simple `get('new-dashboard')` Edge Config snippet with the doc's `isEnabled()` function showing flag lookup with enabled check and allowlist matching

### Fix 4: Compress `traps` panel

**File:** `ProductionDeployment.tsx`

- Split TRAPS rendering: first 8 (original) traps rendered directly, last 4 (AWS-specific) grouped behind a `<details>` disclosure element with "AWS-specific traps (4)" summary

## Files touched

| File | Lines changed |
|---|---|
| `src/features/production-deployment/steps.ts` | +1 |
| `src/features/production-deployment/steps.test.ts` | +2 / -1 |
| `src/features/production-deployment/ProductionDeployment.tsx` | +97 / -10 |
| `src/features/production-deployment/ProductionDeployment.test.tsx` | +10 / -2 |

## Not touched (per instructions)

- No data modules (traps.ts, ai-plays.ts, aws-data.ts)
- No doc files
- No subagents dispatched
