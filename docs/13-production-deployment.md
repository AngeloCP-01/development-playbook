# 13. Production Deployment

> Shipping should be routine, reversible, and boring. If deploying makes you nervous, the
> problem is the process, not your nerve.

**When this actually happens:** On every merge to `main`, ideally several times a day.
Not on a release schedule. Not on Friday afternoon only because someone told you not to —
if Friday deploys are dangerous, your rollback story is broken and that is the thing to
fix.

---

## Entry criteria

- [ ] CI is green ([11 — CI/CD](11-ci-cd.md))
- [ ] Preview verified ([12 — Staging](12-staging.md))
- [ ] Code reviewed ([07 — Code Review](07-code-review.md))
- [ ] Any migration is backward compatible (see below — this is the one that bites)
- [ ] You know how to roll back, specifically, without looking it up

---

## The work

### Small and frequent beats large and scheduled

A deploy containing one change has one suspect when something breaks. A deploy containing
thirty changes has thirty, and you will bisect under pressure while users are affected.

Merge to `main`, the CI/CD pipeline builds and promotes. The whole ceremony is a squash
merge.

### The asymmetry that governs everything

**Code rolls back in seconds. Data does not roll back at all.**

Promoting a previous Vercel deployment is near-instant. But if the deploy dropped a
column, rolling back the code leaves you with new-schema data and old-schema
expectations — and the data is gone.

This asymmetry is why migrations get their own careful process and code deploys do not.

### Migrations: expand, migrate, contract

Never change schema and code in one deploy. Split every destructive change into three
deploys, each independently safe.

**Renaming `users.name` to `users.full_name`:**

**Deploy 1 — Expand.** Add `full_name`. Write to both columns, read from `name`. The old
code still works, because nothing it depends on changed. Safe to roll back.

```sql
ALTER TABLE users ADD COLUMN full_name text;
```

**Deploy 2 — Migrate.** Backfill, then switch reads to `full_name` while still writing
both. Old code still works. Still safe to roll back.

```sql
UPDATE users SET full_name = name WHERE full_name IS NULL;
```

**Deploy 3 — Contract.** Stop writing `name`, drop it. Only now is the change
irreversible — and by now the new column has been serving reads in production for days.

```sql
ALTER TABLE users DROP COLUMN name;
```

Three deploys instead of one, and at no point can a rollback corrupt anything. Wait at
least a day between them; the point is to have production confirm each step before the
next.

The same pattern covers: dropping columns, renaming tables, tightening constraints,
changing types. Anything where old code and new schema must coexist — which, during any
deploy, they always do.

**Backfills on large tables get batched.** A single `UPDATE` over ten million rows takes
a lock and stalls the application. Chunk it:

```ts
// Batch, sleep, repeat. Slower in wall-clock, invisible to users.
while (true) {
  const updated = await db.execute(sql`
    UPDATE users SET full_name = name
    WHERE id IN (
      SELECT id FROM users WHERE full_name IS NULL LIMIT 1000
    )
  `)
  if (updated.rowCount === 0) break
  await sleep(100)
}
```

### Migrations run separately from the build

Do not run migrations in the Next.js build step. Builds run multiple times, in parallel,
and get retried — none of which you want for schema changes.

Run them as a deliberate step before promoting:

```bash
pnpm drizzle-kit migrate   # against production, then deploy
```

Because of expand/migrate/contract, running the migration *before* the code deploy is
safe: the schema change is always backward compatible with the code currently running.

### Vercel deployment mechanics

On Vercel, two mechanisms make deploys routine: skew protection keeps
active sessions alive across deploys, and instant rollback reverts to
a previous deployment in seconds.

When you deploy, browsers mid-session are still running the previous build's JavaScript.
It will request assets and call server actions from a version that no longer exists.

Enable skew protection in Vercel. Without it, every deploy hands an error to every active
user — a class of bug that is invisible to you (your browser is always freshly loaded)
and consistently reported by users as "it randomly broke."

Know this cold, before you need it:

```bash
vercel rollback                    # to the previous production deployment
vercel ls                          # list deployments
vercel promote <deployment-url>    # promote a specific one
```

**Roll back first, diagnose second.** The instinct to find the bug before reverting is
the wrong order — every minute spent diagnosing is a minute users stay broken. Revert,
then investigate calmly on a branch.

If the deploy included a contract-phase migration, rollback is not safe. That is exactly
why contract deploys are separated and small: when the risky deploy contains only a
`DROP COLUMN` and nothing else, you know precisely what you are dealing with.

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

### Feature flags decouple deploy from release

For anything large or risky, ship the code disabled and turn it on separately.

```ts
// src/lib/flags.ts
export async function isEnabled(flag: string, userId?: string) {
  const config = await getEdgeConfig()
  const rule = config.flags[flag]
  if (!rule) return false
  if (rule.enabled === true) return true
  return rule.allowlist?.includes(userId ?? '') ?? false
}
```

Edge Config reads are fast enough to call per request. Now "release" is a config toggle,
turning off takes seconds and needs no deploy, and you can enable for yourself first.

Delete flags once a feature is fully rolled out. Stale flags are dead branches that
accumulate until nobody knows which combinations are still real.

### AI in production deployment

An agent handles migration mechanics well — generating SQL, checking schema compatibility,
verifying that expand/migrate/contract steps are in order — because the rules are explicit
and the inputs are structured. It handles the judgment calls poorly: whether this change
needs a feature flag, whether a backfill is large enough to batch, whether a deploy window
matters. Those stay yours.

Where it earns its place:

- **Generate expand/migrate/contract SQL from a schema diff.** Describe the change you
  want — "rename `users.name` to `users.full_name`" — and the agent writes the three
  migration files, each deployable alone. Review the SQL; do not run it unread. (A prompt.)
- **Dry-run a migration against the preview database.** Run the migration against a Neon
  branch database before touching production, so schema errors surface where they cost
  nothing. (A CLI command.)
- **Verify skew protection after a deploy.** Check that the deployment-ID header is present
  on a production response — `curl -sI https://your-app.vercel.app | grep -i
  x-deployment-id` — confirming the deploy is pinned. (A CLI command.)
- **Rehearse rollback on a preview deployment.** Run `vercel promote <previous-url>` against
  a non-production deployment to confirm the command works and you know the output before
  you need it under pressure. (A saved command.)

The tools are the Vercel CLI, `curl`, and whichever editor the agent runs in. The gap is
the same one the rest of this stage names: data does not roll back. An agent that runs a
contract migration against production because the expand step passed is doing exactly what
it was told, and the data is gone.

---

## Artifacts

- Production deployment traceable to a specific commit
- Migrations applied as versioned, committed SQL files
- Skew protection enabled
- Feature flags for anything risky
- A rollback procedure you have actually executed at least once

---

## Definition of done

- [ ] Deploy succeeded and the commit is identifiable
- [ ] Migrations applied cleanly, with expand/migrate/contract respected
- [ ] Skew protection is on
- [ ] Rollback command is known without looking it up
- [ ] [14 — Post-Deployment Verification](14-post-deployment-verification.md) is next,
      not optional

---

## Scaling to a team

- **Deploy your own changes.** The person who wrote it knows what to check and what
  "wrong" looks like.
- **Announce risky deploys** in a shared channel. Not every deploy — that becomes noise —
  but migrations and anything touching auth or payments.
- **Write down who can roll back** and make sure more than one person can. A rollback
  gated on one person's availability is not a rollback.
- **Consider a deploy freeze** only for genuinely high-stakes windows (a launch, Black
  Friday). Permanent freezes just batch changes into larger, riskier deploys.

---

## Traps

**Changing schema and code in one deploy.** The single most common way to make a rollback
impossible. Expand, migrate, contract — every time, even when it feels excessive for a
small change.

**Running migrations in the build step.** Builds retry and run concurrently. Migrations
must not.

**Diagnosing before rolling back.** Reverse the order. Users first, curiosity second.

**Skipping skew protection.** The bug you cannot reproduce and users keep reporting.

**Batching changes to reduce deploy risk.** Backwards: larger deploys are riskier and
harder to diagnose. Frequency is what makes deploys safe.

**Untested rollback.** A procedure you have never run is a hypothesis. Run it once
deliberately, on a quiet afternoon, before you need it at 3am.

**Unbatched backfills.** A long `UPDATE` holding a lock will take the site down as
effectively as any bug.

**Flags that never get deleted.** Every stale flag doubles the state space of your
application. Removing them is part of finishing a feature.
