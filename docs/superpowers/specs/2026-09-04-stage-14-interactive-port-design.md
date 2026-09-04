# Stage 14 (Post-Deployment Verification) Interactive Port — Design

**Date:** 2026-09-04
**Stage:** 14 — Post-Deployment Verification
**Source doc:** `docs/14-post-deployment-verification.md` (343 lines after doc-correction)
**Pattern:** Same doc-correction-then-port used for stages 12 and 13

---

## Problem

Stage 14's doc is corrected and committed (platform-aware, AI plays, AWS content,
references). It still renders the "sheet not drawn" placeholder in the web app. This
spec covers porting it into an interactive stage component.

## Goals

- Port all 343 lines of the corrected doc into `web/src/features/post-deployment-verification/`
- Follow the established stage port pattern (stages 12 and 13 are the reference)
- Register with the three-file system (stages.ts, stage-content.ts, step-ids.ts)
- Pin all data against the source doc via `doc-source.ts` tests
- Add glossary terms for stage 14's domain
- Add stage 14 to `AI_SECTION_STAGES` (D-35 enforcement)

## Non-goals

- No scored exercise (the content is instructional, not decision-based; unlike stage 12's
  PreviewOrStaging). If a judgment exercise surfaces during implementation, it would be a
  scope upgrade, not a surprise.
- No new shared components. Everything needed exists: Stepper, RevealList, AnnotatedArtifact,
  AIPlays pattern, checklist pattern, Term, Prose, Section, Callout.
- No second annotated artifact. The ten-minute check is prose organized by time blocks,
  not a code sequence. RevealList fits better.

## Constraints

- Three-file registration is one atomic operation (stages.ts + stage-content.ts +
  step-ids.ts in the same task), per `CLAUDE.md`.
- Every data file is pinned against the source doc via `doc-source.ts` helpers. Data
  tests precede render tests (TDD: red → green).
- The `done` step bundles traps + checklist + references, matching stages 12 and 13.
- AWS traps (3) render inside a `<details>` disclosure, matching stage 13's pattern.
- Terms are added to `web/src/lib/terms.ts` and `pnpm gen:glossary` is run.

---

## Architecture

### Step grouping — 6 steps

```
STEP_IDS = ['verify', 'vercel', 'aws', 'recovery', 'ai', 'done'] as const
```

| Step ID | Label | Hint | Content source |
|---|---|---|---|
| `verify` | The ten-minute check | Five phases, one flow | Doc: "The ten-minute check" (minutes 0–10) + "Verify with production data volumes". Five time blocks as a RevealList. |
| `vercel` | Vercel | Where to look | Doc: "Vercel: where to look". Four tools as a RevealList. |
| `aws` | AWS | Where to look | Doc: "AWS: where to look". Six-command sequence as an AnnotatedArtifact (bash). CloudWatch deployment alarm paragraph below. |
| `recovery` | Recovery | When something goes wrong | Doc: "When something is wrong" (rollback-first + four failure patterns as RevealList) + "The half-hour follow-up" + "Automate what you repeat". |
| `ai` | AI plays | Where agents help | Standard AIPlays: premise, 4 plays, limit. |
| `done` | Traps & checklist | The last step | 11 traps (8 general + 3 AWS in details disclosure) + VerificationChecklist (11 DoD, 3 artifacts, 4 team notes) + References. |

### Stage-specific artifact: AWS verification sequence

```ts
// aws-verification.ts
export const AWS_VERIFICATION: Artifact = {
  id: 'aws-ecs-verification',
  filename: 'verify-ecs-deploy.sh',
  language: 'bash',
  lines: [
    // ~24 lines: 6 commands with blank-line separators
    // 6 annotated lines (one per command)
    // pivot on describe-target-health (the check services-stable misses)
  ],
}
```

The six commands, in order:
1. `aws ecs wait services-stable` — wait for task count to match
2. `aws ecs describe-services` (deployments query) — verify rolloutState COMPLETED
3. `aws elbv2 describe-target-health` — **pivot**: the check `services-stable` skips
4. `aws ecs describe-services` (events query) — read recent service events
5. `aws ecs describe-tasks` — check container healthStatus
6. `aws logs tail` / `filter-log-events` — inspect logs for error bursts

### Component architecture

```
PostDeploymentVerification.tsx
├── Stepper (6 steps)
│   ├── verify: Section + RevealList (5 time-block rows) + Prose (data volumes)
│   ├── vercel: Section + RevealList (4 tool rows)
│   ├── aws: Section + Figure(AnnotatedArtifact) + Prose (deployment alarms)
│   ├── recovery: Section + Prose (rollback-first) + RevealList (4 failure patterns)
│   │            + Prose (half-hour follow-up) + Prose (automate)
│   ├── ai: AIPlays (standard pattern)
│   └── done: Traps (10, with AWS details disclosure)
│            + VerificationChecklist (11 DoD, 3 artifacts, 4 team notes)
│            + References
```

### Data files

| File | Exports | Shape |
|---|---|---|
| `steps.ts` | `STEP_IDS`, `StepId` | `['verify','vercel','aws','recovery','ai','done'] as const` |
| `ai-plays.ts` | `AI_PREMISE`, `AI_LIMIT`, `PLAYS` | `Play[]` (4 plays, kinds: prompt ×3, cli+mcp ×1) |
| `traps.ts` | `TRAPS` | `Trap[]` (11 traps: 8 general + 3 AWS) |
| `checklist.ts` | `DONE`, `ARTIFACT_LIST`, `TEAM` | `DoneItem[]` (11), `string[]` (3), `TeamNote[]` (4) |
| `aws-verification.ts` | `AWS_VERIFICATION` | `Artifact` (bash, ~24 lines, 6 annotated, 1 pivot) |
| `doc-source.ts` | `DOC`, `section`, `h2`, `flat`, `fences` | `docSource('docs/14-post-deployment-verification.md')` |

### Glossary terms to add

Candidates (verify existence first in `terms.ts`):

| Term ID | Name | Associated stage |
|---|---|---|
| `smoke-test` | Smoke test | `14-post-deployment-verification` |
| `baseline` | Baseline | `14-post-deployment-verification` |
| `bake-time` | Bake time | `14-post-deployment-verification` |
| `deployment-alarm` | Deployment alarm | `14-post-deployment-verification` |

Each needs: `name`, `short`, `full`, `soWhat`, `see`.

### Registration (atomic, one task)

1. `web/src/lib/stages.ts` — flip `ready: true` on the stage 14 entry
2. `web/src/features/stage-content.ts` — import `PostDeploymentVerification`, register under slug
3. `web/src/features/step-ids.ts` — import `STEP_IDS`, register under slug
4. `web/src/test/stage-metadata.test.ts` — add `'14-post-deployment-verification'` to `AI_SECTION_STAGES`

---

## Testing

### Data tests (pin against doc)

| Test file | What it pins |
|---|---|
| `steps.test.ts` | 6 steps in exact order; unique IDs |
| `ai-plays.test.ts` | Premise/limit phrases in doc; 4 plays with unique IDs and valid kinds; title text matches doc bold leads |
| `traps.test.ts` | 11 traps matching 11 bold leads in doc; unique IDs; title pins; body phrase pins |
| `checklist.test.ts` | 11 DoD items matching doc checkboxes; 3 artifacts matching doc list; 4 team notes matching doc bullets |
| `aws-verification.test.ts` | 6 commands match doc fenced code blocks; 6 annotated lines; 1 pivot on describe-target-health; language is bash |
| `prose.test.ts` | ~8–10 key phrases across all major doc sections |

### Render tests

| Test file | What it renders |
|---|---|
| `PostDeploymentVerification.test.tsx` | 6 tabs render with correct labels |
| `AIPlays.test.tsx` | Every play title renders; premise/limit key phrases reach the page |
| `VerificationChecklist.test.tsx` | Correct checkbox count (11); ticking persists; artifact items render; team notes disclosure exists |

---

## Verification

After all tasks:
- `pnpm lint` clean
- `pnpm typecheck` clean
- `pnpm test` — all tests pass, new test count recorded
- `pnpm build` — stage 14 prerenders
- `pnpm test:e2e` — stage 14 included in audit sweep (18 stages, `/14-post-deployment-verification` route)
- `pnpm test:dev-console` — no React dev-mode warnings
- Humanizer pass on any prose-heavy component content

---

## Documentation updates

- `docs/tracker.md` — new W-3 entry for stage 14 interactive port
- `docs/task.md` — mark stage 14 as interactive
- `KICKOFF.md` — update project state (W-3 count, stage 14 status, next candidate)

---

## Risks

- **Term collisions.** Some glossary term candidates (`smoke-test`, `baseline`) may
  already exist in `terms.ts`. Verify before adding; update `see` field if the term
  exists but points to a different stage.
- **AWS artifact line count.** The six-command sequence includes long `--query` strings.
  If lines exceed comfortable reading width, split the query onto continuation lines
  with `\`. Test the artifact renders without horizontal overflow at 320px.
- **Trap count.** The doc has 10 traps. If any trap is too thin to stand alone (title
  restates the body), merge it with a related trap during implementation rather than
  padding it. The count is derived from the doc, not imposed on it.
