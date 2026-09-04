# Coverage Walk: Stage 13 — Production Deployment

**Date:** 2026-09-03
**Inputs:** `docs/13-production-deployment.md` and every file under `web/src/features/production-deployment/`
**Method:** Cold read, section by section. No plan, spec, or prior reports consulted.

---

## Coverage table

| Doc section (heading) | Panel / component that teaches it | What specifically is taught | What is missing or drifted |
|---|---|---|---|
| `## Entry criteria` | Panel 1 (`deploys`), Section "Entry criteria" | All 5 checklist items rendered as `<li>` with stage links for CI, staging, code review. Migration and rollback items present. | None. |
| `## The work` | (grouping header) | No own content — subsections below cover it. | N/A |
| `### Small and frequent beats large and scheduled` | Panel 1 (`deploys`), Section "Small and frequent beats large and scheduled" | "One change, one suspect" paragraph verbatim. "Merge to `main`" paragraph verbatim. Pinned in `prose.test.ts`. | None. |
| `### The asymmetry that governs everything` | Panel 1 (`deploys`), Section "The asymmetry that governs everything" | Code-vs-data asymmetry rendered as two Cards (Code/go, Data/danger). "This asymmetry is why migrations get their own careful process" in prose. Pinned in `prose.test.ts`. | None. |
| `### Migrations: expand, migrate, contract` | Panel 2 (`migrations`), Section "Expand, migrate, contract" + `MIGRATION_ARTIFACT` | "Never change schema and code in one deploy." All three SQL statements (`ALTER TABLE ADD`, `UPDATE SET`, `ALTER TABLE DROP`) pinned character-for-character via `fences()` in `migration-artifact.test.ts`. Pivot on the irreversible `DROP COLUMN`. "Same pattern covers dropping columns, renaming tables..." present. Backfill warning as Callout ("Chunk it: update 1,000 rows, sleep 100ms, repeat"). | **TypeScript backfill code block** (while/sleep/LIMIT 1000 loop from doc lines 82-94) summarized but not reproduced. |
| `### Migrations run separately from the build` | Panel 2 (`migrations`), Section "Migrations run separately from the build" | "Builds run multiple times, in parallel, and get retried" pinned. "Running the migration before the code deploy is safe" present. | **`pnpm drizzle-kit migrate` command** not shown. |
| `### Vercel deployment mechanics` | Panel 3 (`vercel`), Sections "On Vercel, two mechanisms...", "Know this cold", "Roll back first, diagnose second" | Skew protection explained with "invisible to you" pinned. Three Vercel CLI commands (`rollback`, `ls`, `promote`) shown in Card. "Roll back first, diagnose second" pinned. Contract migration caveat in Callout. | None. |
| `### AWS deployment strategies` | Panel 4 (`aws`) intro prose | Pipeline summary rendered. Six-step workflow chain taught via `PIPELINE_ARTIFACT`. | **Doc intro paragraph** (control-vs-cost tradeoff framing, lines 139-144) not reproduced. |
| `#### The pipeline` | Panel 4 (`aws`), Section "The pipeline" + `PIPELINE_ARTIFACT` | All 6 numbered steps from the doc present as annotated YAML lines. OIDC credential flow annotated. `wait-for-service-stability: true` and `wait-max-delay-seconds: 30` present. Pivot on wait-for-stability. Pinned in `pipeline-artifact.test.ts`. | None. |
| `#### Rolling updates` | Panel 4 (`aws`), Section "Rolling updates" | `minimumHealthyPercent` and `maximumPercent` explained. ROLLING_CONFIG (100/200) rendered as JSON. Circuit breaker JSON rendered from `CIRCUIT_BREAKER_CONFIG`. "Add it to every service" instruction present. | `minimumHealthyPercent: 50` capacity-tight scenario omitted. Deadlock trap taught in Traps panel, not here. |
| `#### Blue/green deployments` | Panel 4 (`aws`), Section "Blue/green and traffic shifting" | ECS-native blue/green named with `bakeTimeInMinutes`. CodeDeploy alternative named with lifecycle hooks. Target group swap concept mentioned. | **ECS-native blue/green JSON config** (`strategy: "BLUE_GREEN"`, `bakeTimeInMinutes: 10`) not reproduced. ALB target group setup not explained. Bake time mechanics (window, rollback during vs after) not taught. CodeDeploy infrastructure (deployment group, appspec) not detailed. |
| `#### Canary and linear traffic shifting` | Panel 4 (`aws`), Section "Blue/green and traffic shifting" (merged) | All 5 predefined configurations in STRATEGIES table match doc exactly. Canary vs linear distinction explained in prose. | **CloudWatch alarms integration** (up to 10 alarms, error rate/latency p99/custom metrics, automatic stop-and-revert) omitted entirely. Specific "10% / 90%" framing and "ten data points" not stated. |
| `#### Rollback on AWS` | **NOT PRESENT** | Nothing. | **Entire section omitted.** Three rollback paths (rolling update manual, blue/green bake-time, CodeDeploy), two CLI commands (`aws ecs update-service`, `aws deploy stop-deployment`), and the AWS-specific "roll back first, diagnose second" restatement are all absent from the interactive app. |
| `#### Costs Vercel hides` | Panel 4 (`aws`), Section "Costs Vercel hides" + `AWS_COSTS` | All 6 cost rows match doc (service, low, high, vercelIncludes). NAT Gateway callout with $0.045/GB. Prose mentions $85-200 range. | **Total row** ($85-204 total vs $20/seat Vercel Pro) not in table; covered in prose as "$85-200". |
| `### Feature flags decouple deploy from release` | Panel 5 (`flags`), Section "Feature flags decouple deploy from release" | "Ship the code disabled and turn it on separately" present. "Delete flags once fully rolled out" present. Edge Config speed mentioned. | **Code block drifted.** Doc shows `isEnabled()` with allowlist-based per-user flagging; app shows simpler `get('new-dashboard')` from `@vercel/edge-config`. Different capability demonstrated. "Enable for yourself first" concept unsupported by simpler code. |
| `### AI in production deployment` | Panel 6 (`ai`), `AIPlays` component | `AI_PREMISE` matches doc opening paragraph verbatim. `AI_LIMIT` matches doc closing paragraph verbatim. All 8 plays (4 Vercel, 4 AWS) present with matching titles, bodies, and kinds (`prompt`/`cli`/`command`). Pinned in `ai-plays.test.ts`. | None. |
| `## Artifacts` | Panel 7 (`traps`), `DeploymentChecklist` → `ARTIFACT_LIST` | All 5 artifact bullets match doc exactly. Pinned in `checklist.test.ts`. | None. |
| `## Definition of done` | Panel 7 (`traps`), `DeploymentChecklist` → `DONE` | All 6 checklist items present. Interactive checkboxes with localStorage persistence. Pinned in `checklist.test.ts`. | Item 5 omits parenthetical "(rolling for routine, blue/green or canary for critical)". Item 6 drops stage number "14 ---" and doc cross-link. |
| `## Scaling to a team` | Panel 7 (`traps`), `DeploymentChecklist` → `TEAM` via `TeamNotes` disclosure | All 4 team bullets present with titles and bodies. Pinned in `checklist.test.ts`. | Two titles rephrased: "Write down who can roll back" -> "More than one person can roll back"; "Consider a deploy freeze" -> "Deploy freezes are rare". |
| `## Traps` | Panel 7 (`traps`), `TRAPS` array via Callout list | All 12 bold-lead traps present with matching titles and bodies. Count and bold-lead match pinned in `traps.test.ts`. Four body pins verify specific sentences. | None. |

---

## Findings

### BLOCKING

**B-1. Rollback on AWS section entirely omitted.**
The doc's `#### Rollback on AWS` (lines 269-299) teaches three distinct rollback paths (rolling update manual, blue/green bake-time, CodeDeploy stop), two CLI commands (`aws ecs update-service --task-definition my-task:PREVIOUS_REVISION` and `aws deploy stop-deployment --deployment-id d-XXXXXXXXX`), and the AWS-specific restatement of "roll back first, diagnose second." None of this appears anywhere in the interactive app. Given that rollback is the stage's central concern ("Code rolls back in seconds. Data does not roll back at all."), omitting the AWS rollback paths is a significant teaching gap.

**B-2. CloudWatch alarms integration omitted.**
The doc's canary/linear section (lines 254-257) teaches that up to ten CloudWatch alarms can be attached per deployment --- error rate, latency p99, custom business metrics --- and that any alarm firing stops the deployment and reverts traffic automatically. The doc calls this "the closest thing to an automatic 'undo' that exists in deployment." The app's AWS panel shows the strategies table but does not mention the alarm integration at all. This is the safety mechanism that makes canary/linear strategies useful rather than manual.

**B-3. Feature flags code block drifted.**
The doc (lines 332-339) shows an `isEnabled(flag, userId?)` function that reads from Edge Config, checks an `enabled` boolean, and falls back to an `allowlist` array --- teaching per-user feature targeting. The app replaces this with `import { get } from '@vercel/edge-config'` / `await get('new-dashboard')` --- a simpler key-value lookup that does not teach allowlists or per-user rollout. The doc's surrounding prose ("you can enable for yourself first") relies on the allowlist capability the app's code does not demonstrate.

### NON-BLOCKING

**N-1. TypeScript backfill batch loop code not reproduced.**
Doc lines 82-94 show a `while (true)` loop with `LIMIT 1000` and `await sleep(100)`. The app summarizes the concept as a Callout ("update 1,000 rows, sleep 100ms, repeat") without showing the code. The concept is taught; the implementation is not.

**N-2. `pnpm drizzle-kit migrate` command not shown.**
Doc line 104. The prose "run them as a deliberate step before promoting" teaches the concept, but the concrete command is absent.

**N-3. ECS-native blue/green JSON config not reproduced.**
Doc lines 222-227 show `{ "deploymentConfiguration": { "strategy": "BLUE_GREEN", "bakeTimeInMinutes": 10 } }`. The app names `bakeTimeInMinutes` in prose but does not show the config structure.

**N-4. Blue/green deployment detail compressed.**
ALB target group setup, bake time mechanics (rollback during vs after), and CodeDeploy infrastructure (deployment group, appspec file, lifecycle hooks) are compressed to a single sentence. Concepts are named but not explained.

**N-5. Canary/linear specific detail compressed.**
"10% of traffic goes to the new version", "90% of users never saw it", and "ten data points instead of one" are not stated. The strategies table provides the numerical patterns.

**N-6. AWS intro paragraph omitted.**
Doc lines 139-144 frame the control-vs-cost tradeoff ("AWS gives you the machinery --- and asks you to understand it"). Framing, not instruction.

**N-7. Definition of done item 5 omits parenthetical guidance.**
"(rolling for routine, blue/green or canary for critical)" --- the strategy-matching guidance is dropped. The item still says "matches the service risk profile."

**N-8. Definition of done item 6 drops stage number and link.**
"14 --- Post-Deployment Verification" becomes just "Post-Deployment Verification is next, not optional." No cross-link to stage 14.

**N-9. Costs table total row omitted from table.**
"$85-204" total vs "$20/seat Vercel Pro" not in the rendered table. The range is covered in the section's intro prose ("roughly $85-200 per month").

**N-10. Team note titles rephrased from doc bold-leads.**
"Write down who can roll back" retitled to "More than one person can roll back." "Consider a deploy freeze" retitled to "Deploy freezes are rare." Same advice, different framing.

**N-11. Rolling updates `minimumHealthyPercent: 50` scenario omitted.**
The capacity-tight alternative (killing half the old tasks first) is not mentioned. The deadlock trap (min=100, max=100, desired=1) is covered in the Traps panel.

**N-12. `enable for yourself first` concept unsupported by code.**
A consequence of B-3. The doc's prose says you can "enable for yourself first," which the `isEnabled` allowlist supports. The app's simpler `get()` code does not demonstrate this capability, leaving the prose claim ungrounded.

---

## Summary

| Metric | Count |
|---|---|
| Doc sections walked | 20 |
| Fully covered | 12 |
| Partially covered | 7 |
| Not covered | 1 (`#### Rollback on AWS`) |
| **Total findings** | **15** |
| BLOCKING | **3** |
| NON-BLOCKING | **12** |

The interactive app covers the doc's structure faithfully across 7 Stepper panels and teaches the majority of the doc's content with strong data-pinning (11 test files, including prose pins, fence pins, bold-lead matching, and count assertions). The three blocking findings cluster around AWS operational content: rollback paths (B-1), the CloudWatch alarm safety net (B-2), and a code drift in feature flags that changes what capability is demonstrated (B-3). The non-blocking findings are detail compressions that preserve the concept while omitting specific code blocks, numerical examples, or parenthetical guidance.
