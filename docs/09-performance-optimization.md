# 09. Performance Optimization

> Make it fast enough for the people using it, using measurements rather than instinct.

**When this actually happens:** When something is measurably slow, or before a launch
that will change traffic shape. Not continuously, and emphatically not preemptively —
premature optimization buys complexity with no return.

---

## Entry criteria

- [ ] Something is actually slow, and you can point at it
- [ ] You have a measurement, not a feeling
- [ ] The feature works correctly — never optimize code whose correctness is unsettled

---

## The work

### Measure, then fix, then measure

The loop:

1. **Measure.** Establish the current number.
2. **Find the bottleneck.** Profile. Do not guess — intuition about performance is
   reliably wrong, including yours.
3. **Fix the biggest one.**
4. **Measure again.** Confirm it helped. Sometimes it does not, and then you revert.
5. **Stop when it is fast enough.** There is always another 5%. It is rarely worth it.

Skipping step 4 is how codebases accumulate "optimizations" that made things slower and
nobody noticed.

### Decide what fast enough means

Without a target, optimization has no stopping condition:

- **LCP under 2.5s** at p75, on real user data
- **INP under 200ms** at p75
- **API responses under 300ms** at p95
- **Database queries under 50ms** at p95

Measure at percentiles, never averages. An average hides the tail, and the tail is where
the angry users are. If p50 is 100ms and p99 is 8 seconds, one percent of requests are
unusable — and that one percent is disproportionately your heaviest, most valuable users,
because they have the most data.

### Find the real bottleneck

**Real user data first** — Vercel Speed Insights gives field data, which is what actually
matters. Lab tools run on fast hardware on good networks; your users do not.

**Sentry performance traces** show where request time goes: which query, which external
call, which render.

**The database is usually the answer.** For a typical Next.js app, most slow requests are
slow queries, and most slow queries are N+1s or missing indexes.

```sql
EXPLAIN ANALYZE
SELECT * FROM invoices WHERE owner_id = '...' ORDER BY created_at DESC LIMIT 20;
```

`Seq Scan` on a large table means a missing index. Look at actual row counts versus
estimates — a large gap means stale statistics.

### The fixes that usually matter

In rough order of how often they are the answer:

**1. Missing indexes.** Every column you filter or sort by, at production data volume.

```sql
CREATE INDEX CONCURRENTLY idx_invoices_owner_created
  ON invoices (owner_id, created_at DESC);
```

`CONCURRENTLY` avoids taking a write lock. On a production table, omitting it can take the
site down. Composite column order should match your query's filter-then-sort shape.

**2. N+1 queries.** Fetching a list, then querying per item. Twenty invoices become
twenty-one queries.

```ts
// Bad: one query per invoice
const invoices = await db.query.invoices.findMany({ where: ... })
for (const inv of invoices) {
  inv.customer = await db.query.customers.findFirst({ where: eq(customers.id, inv.customerId) })
}

// Good: one query
const invoices = await db.query.invoices.findMany({
  where: ...,
  with: { customer: true },
})
```

This is the most common serious performance bug in application code, and it is invisible
locally — with 5 seeded rows, 6 queries is fast. With 5,000 rows it is not.

**3. Serial awaits that could be parallel.**

```ts
// Bad: 300ms
const user = await getUser(id)
const invoices = await getInvoices(id)

// Good: 150ms
const [user, invoices] = await Promise.all([getUser(id), getInvoices(id)])
```

Only when they are genuinely independent.

**4. Missing caching.** For data that does not change per request, Next.js 16's
`use cache` directive:

```ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getPricingPlans() {
  'use cache'
  cacheLife('hours')
  cacheTag('pricing')
  return db.query.plans.findMany()
}
```

Then invalidate precisely when the data changes, from the server action that changed it:

```ts
'use server'
import { updateTag } from 'next/cache'

export async function updatePlan(/* ... */) {
  await db.update(plans)/* ... */
  updateTag('pricing')
}
```

Tag-based invalidation beats guessing at a TTL: the cache is correct immediately after a
write rather than eventually. Requires Cache Components enabled in `next.config.ts`.

Cache deliberately. A cache is a second source of truth, and a stale-data bug is far more
confusing to debug than a slow query.

**5. Oversized client bundles.**

```bash
pnpm build   # review the route-level output
```

Common causes: a date library imported whole for one function, an icon set imported
entirely for three icons, or a heavy component that could be dynamically imported.

**6. Unoptimized images.** Use `next/image`. It handles format negotiation, sizing, and
lazy loading. An unoptimized hero image routinely outweighs all the JavaScript on the
page.

### Server Components are a performance feature

Moving data fetching to the server removes a whole class of problem: no client-side
waterfall, no loading spinners, no shipping data-fetching code to the browser. Before
optimizing a client component, check whether it needs to be a client component at all.

### Do not optimize these

- **React re-renders**, unless profiling shows a real problem. `memo` everywhere adds
  comparison cost and complexity for no measured benefit.
- **Micro-benchmarks** of code that runs once per request. Saving 2ms in a 300ms request
  is not a win.
- **Anything at low traffic.** A query taking 200ms with 50 daily users is fine. Optimize
  when it matters.

---

## Artifacts

- Before-and-after measurements for each change
- Indexes added via committed migrations
- Documented performance targets
- Notes on what you tried that did *not* help — genuinely valuable, and never written
  down

---

## Definition of done

- [ ] The original slow thing is measurably faster, with numbers
- [ ] Improvement confirmed in production, not just locally ([14](14-post-deployment-verification.md))
- [ ] Core Web Vitals within target at p75
- [ ] No N+1 queries on primary paths
- [ ] Indexes exist for every filtered and sorted column
- [ ] Nothing broke — tests still green ([06](06-testing.md))

---

## Scaling to a team

- **Publish the targets** so performance is a shared standard rather than one person's
  crusade.
- **Add performance budgets to CI** — fail the build if a bundle exceeds a threshold. Slow
  accretion is invisible per-PR and enormous over a year.
- **Review query plans in PRs** for anything touching data access.
- **Watch for the "someone else's problem" effect.** Everyone assumes performance is
  owned by whoever cares most. Assign it explicitly.

---

## Traps

**Optimizing without measuring.** You will optimize the wrong thing, add complexity, and
have no way to know it did not help.

**Averages instead of percentiles.** The average is fine. The p99 is on fire.

**Testing performance locally.** Local has 50 rows, no network latency, and a fast
machine. The N+1 is invisible until production.

**`CREATE INDEX` without `CONCURRENTLY`.** Takes a write lock on the table. On a busy
production table, this is an outage.

**Caching to avoid fixing a slow query.** Now you have a slow query *and* a cache
invalidation problem.

**`memo` and `useMemo` everywhere.** Real cost, imaginary benefit, more complex code.
Profile first.

**Optimizing before it matters.** Speed you cannot measure has no value, and the
complexity you added to get it is permanent.

**Stopping before verifying in production.** Local improvements sometimes fail to
materialize under real conditions. Confirm with field data.
