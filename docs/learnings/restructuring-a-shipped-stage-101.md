# Restructuring a shipped stage 101

What the stage 13 AWS expansion taught, written down so the next stage revision does
not relearn it. Stage 13 was the first stage restructured after shipping — not a fresh
port, but a rewrite of an existing interactive stage's step layout, data modules, and
component while keeping the working parts intact.

---

## The step ID rename is the critical path, not the content

Changing `safety` → `vercel` and `rollback` → removed touched:
- `steps.ts` (the tuple and the type)
- `steps.test.ts` (the assertion)
- `prose.test.ts` (section headings moved)
- `ProductionDeployment.tsx` (the `CONTENT_STEPS` array — TypeScript rejects the old IDs)
- `ProductionDeployment.test.tsx` (tab count and names)
- `step-ids.ts` (picks up the import automatically, but `rails.test.tsx` validates it)
- The e2e audit suite (derives URLs from step IDs via hashes)

The step ID change created a window where TypeScript, the unit tests, and the e2e suite
all failed simultaneously. New data modules (`aws-data.ts`, `pipeline-artifact.ts`) were
independent and could have run in parallel, but the assembly task that wired them into
`ProductionDeployment.tsx` could not start until every data module existed. The critical
path was: step IDs → data modules → assembly, and the step IDs had to land first because
everything else imports the `StepId` type.

**For the next restructure:** update step IDs and prose pins in one task before touching
any data or component code. The brief should say "this task will break TypeScript on
`ProductionDeployment.tsx` — that is expected and resolved in the assembly task."

---

## A research pass before the spec, not during it

The kickoff said "this needs a research pass first" and meant it. Four parallel research
agents verified current AWS service specifics before the spec was written:

1. ECS deployment strategies (rolling, blue/green, circuit breaker)
2. CodeDeploy and AppSpec (lifecycle hooks, traffic shifting configs)
3. AWS costs (ALB, NAT Gateway, Fargate, data transfer, CloudWatch)
4. GitHub Actions → ECS (OIDC, the four `aws-actions`, `wait-for-service-stability`)

The research surfaced a fact the spec would have gotten wrong without it: **ECS now has
native blue/green, canary, and linear strategies** without CodeDeploy. AWS recommends
migrating from CodeDeploy to the native approach. A spec written from training data
alone would have taught only CodeDeploy, which the final review caught anyway (I1) when
the assembly task's prose said "through CodeDeploy" and omitted the native path.

**The pattern:** research agents run in brainstorming, before the spec. The spec cites
verified facts, not recalled ones. The plan inherits correct data. When the research
runs during implementation instead, every task that touches the researched content
carries the risk of the training data being stale.

---

## Restructuring deletes old constants, and the deletion is the dangerous part

The `SAFETY_ROWS` constant in `ProductionDeployment.tsx` (two `RevealRow` objects with
JSX in their `body` fields — skew protection and feature flags) was deleted entirely. Its
content split between two new panels: skew protection moved to `vercel`, feature flags
moved to `flags`.

The deletion was safe only because both destination panels were written in the same
commit. A plan that deleted `SAFETY_ROWS` in one task and wrote the replacement panels
in a later task would have left the stage broken between commits. The assembly task
handled this correctly by doing both in one commit, but only because the plan prescribed
it that way — the natural decomposition (one task per panel) would have broken it.

**Rule:** when restructuring moves content between steps, the deletion and the
replacement land in the same commit. Do not split "remove from old location" and "add to
new location" across tasks.

---

## Data module counts are the bridge between doc and interactive phases

The doc phase (Tasks 1–3) changed the counts: 8 AI plays, 12 traps, 6 DoD items. The
interactive phase (Task 7) updated the data modules to match. The tests that bridged
them were count assertions pinned against both the doc and the data:

```ts
test('twelve traps from doc', () => {
  const boldLeads = src.match(/^\*\*.+?\*\*/gm) ?? []
  expect(boldLeads).toHaveLength(12)  // ← counts the doc
  expect(TRAPS).toHaveLength(12)      // ← counts the data
})
```

Between Tasks 3 and 7, these tests failed — the doc had 12 traps but the data module
still had 8. That failure was expected and documented in the plan ("pre-existing failures
from Phase 1 doc expansion"). But the window where the tests fail is a coordination
hazard: if an implementer runs the full suite during that window, they see failures that
are not their problem and might try to "fix" them.

**For the next restructure:** the plan should explicitly state which tests will fail
between phases and why, and the task briefs should name the specific test files to run
(not "run the full suite") to avoid confusion.

---

## The cost table earns more attention than the deployment mechanics

The "costs Vercel hides" section is the one a reader from a Vercel background will
not find elsewhere in a deployment guide. Every deployment tutorial teaches blue/green
and canary. Almost none list the monthly cost of an ALB ($22–27/month just to exist), a
NAT Gateway ($35–100/month, the classic bill shock), or the total infrastructure cost
($85–204/month) that Vercel Pro includes for $20/seat.

The order-of-magnitude ranges (`$22–27`, not `$22.43`) are deliberate — AWS pricing
changes, and a precise number becomes stale faster than a range. The total (`$85–204`)
is the headline, and it is the one sentence a reader should be able to quote from memory
after reading the stage.
