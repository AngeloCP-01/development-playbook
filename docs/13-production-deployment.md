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

Merge to `main`, Vercel builds and promotes. The whole ceremony is a squash merge.

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

### Skew protection

When you deploy, browsers mid-session are still running the previous build's JavaScript.
It will request assets and call server actions from a version that no longer exists.

Enable skew protection in Vercel. Without it, every deploy hands an error to every active
user — a class of bug that is invisible to you (your browser is always freshly loaded)
and consistently reported by users as "it randomly broke."

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

### Rollback

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
