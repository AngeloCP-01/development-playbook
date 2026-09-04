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

---

## The coverage walk caught three things the final review did not

Added after the verification round. The final whole-branch review (opus) found one
blocking issue (blue/green prose omitted ECS-native). The coverage walk, running
afterwards with only the doc and the code, found three more:

1. **The entire `#### Rollback on AWS` section was missing.** Three rollback paths, two
   CLI commands, and the AWS-specific restatement of "roll back first, diagnose second."
   The final review had noted this as M1 (minor, deferred). The coverage walk escalated
   it to blocking, correctly: rollback is the stage's central concern.

2. **CloudWatch alarm integration was missing.** The safety mechanism that makes
   canary/linear strategies useful. The strategies table was present; the alarm gates
   that make them automatic were not.

3. **The feature flags code block drifted.** The app showed `get('new-dashboard')` (a
   simple key-value lookup); the doc shows `isEnabled(flag, userId?)` with an allowlist.
   The surrounding prose says "you can enable for yourself first," which requires the
   allowlist the app's code did not demonstrate.

The final review saw all three pieces of content in the doc and in the diff. It marked
B-1 as a minor (the principle was already in the Vercel panel), did not notice B-2 at
all, and did not catch B-3's semantic drift (code that compiles and looks related is the
hardest thing for a diff-scoped review to evaluate against a doc).

The coverage walk found all three because it does not read the diff. It reads the doc
heading by heading and asks "does the interactive app teach this specific claim?" A
diff-scoped review asks a different question: "is the diff correct?" Both questions
are needed, and they find different things.

**The panel-height failures were the bonus.** The e2e audit caught `aws` at 4.0 screens
and `traps` at 4.2. Splitting `aws` into `aws` + `aws-ops` both fixed the height and
created a natural home for the rollback content (B-1). The coverage walk and the panel
measurement reinforced each other: one said "content is missing" and the other said
"the panel is too tall," and the fix for both was the same split.

---

## Run verification in the same session, not a later one

The original plan deferred verification passes (e2e, dev-console, coverage walk,
humanizer, panel measurement) to "the next round." Running them in the same session
was the right call because it caught three blocking issues while the context was fresh.
A later session would have re-read the component from scratch, without knowing which
content was moved from where, and would have been slower to trace each finding back to
its cause.

The cost of deferral is not the round itself but the context rebuild. A coverage walk
finding like "the feature flags code does not match the doc" is immediate when you just
wrote the code. It is an investigation when you are reading it for the first time.
