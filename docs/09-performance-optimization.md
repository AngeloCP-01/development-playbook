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

### Map the order journey

First name the outcome that feels slow. “Ordering is slow” can mean a delayed
response after Place order, a long wait for Paid, or a late notification. Those
are different clocks. Here is a hypothetical order flow; your application may
keep the same responsibilities in one process.

```text
Order request → validate → authenticate → check inventory
              → create order → initiate payment → response

Payment webhook → mark order paid → publish OrderPaid
                                ├→ inventory consumer
                                ├→ logistics consumer
                                └→ notification consumer
```

The response ends the checkout request. Provider waiting and the later webhook
are outside that request. The three consumers branch from OrderPaid; their
dependencies are a product decision, not an assumed serial chain. Choose one
outcome to improve, then measure the other boundaries only where they help
explain it. Correlate the records with an opaque order or event ID and trace
context where available. Keep payment secrets and customer details out of
telemetry.

### Measure the first baseline

Write a baseline record before naming a fix:

| Record | What to write |
|---|---|
| Outcome | The user-visible event and its start and end, such as Place order → response or webhook receipt → Paid |
| Metric | Duration and percentile for that outcome; include failures and timeouts rather than measuring only successes |
| Scope | Route or event name, deployment version, device or other relevant segment, and whether the cache was cold or warm |
| Window and sample | Collection dates, number of observations, and the traffic or test-data shape |
| Evidence | Field dashboard or request log for the user outcome; one trace or controlled run for diagnosis |

For page loading and interactions, start with real-user Web Vitals in
[Speed Insights](https://vercel.com/docs/speed-insights/metrics) or
[PageSpeed Insights](https://web.dev/articles/vitals-measurement-getting-started)
and compare mobile and desktop. For a server route, inspect its duration by
route in your available monitoring; feature detail and retention vary by
plan. For webhook-to-paid or OrderPaid-to-consumer lag, record timestamps at
those boundaries and join them by an opaque identifier. A trace can explain
instrumented work across services when [context is
propagated](https://opentelemetry.io/docs/concepts/context-propagation/),
but it does not automatically include time spent waiting at an external
payment provider.

Reproduce the same action in a controlled environment with stated device,
network, cart size, data volume, and cache state. A controlled run helps
diagnose a cause; it is not a production p95. If field traffic is too sparse
for a stable percentile, say so and keep the controlled baseline until enough
real observations accumulate. Never invent a field number to fill the gap.

### Decide what fast enough means

Choose a target for the outcome you recorded. [Google's good Core Web Vitals
thresholds](https://web.dev/articles/vitals) are LCP ≤2.5 s, INP ≤200 ms,
and CLS ≤0.1 at p75, assessed
separately for mobile and desktop. An API p95 or database-query target belongs
to your product and workload; 300 ms and 50 ms are example budgets, not web
standards. Percentiles expose the slow tail that an average alone can hide.
Record the target and why users need it before optimizing.

### Find the real bottleneck

Start at the slow outcome, then move inward. A checkout-response problem calls
for request latency by route, a few representative slow traces, and only then
database or external-call timings. A slow Paid status calls for webhook and
status-update timestamps. A late notification calls for event-publish and
consumer-completion timestamps. Traces show instrumented spans; an absent
database span is not proof the database did no work.

**Illustrative example, not a measured application:** a 20-item cart makes
the Place order response feel slow. Record a seven-day production baseline for
that route, a clearly named deployment, traffic sample, failures, and a
controlled 20-item cart reproduction. Slow request traces show 21 inventory
queries: one list query and one availability query per item. The repeated
database round trips, not a large checkout image, account for most of the
request's time in this example. Batch the availability lookup for the cart's
SKUs, preserving the same stock decision and order result. The image is the
rejected alternative because it cannot explain the observed server time.

| Comparison field | Before | After |
|---|---|---|
| Outcome | Place order → response | Same outcome |
| Scope | Same route, segment, cart shape, cache state and length of observation window | Same scope after deployment |
| Diagnostic evidence | 21 inventory queries for a 20-item cart in the controlled reproduction | One batched availability query in the same reproduction |
| Production verdict | Record route p95, sample count, error rate and timeouts | Compare those same measures; do not claim a win from query count alone |

The before/after cells are an example record to fill, not invented p95
measurements. If the user-facing p95 misses its target, failures rise, or
correctness changes in stock checks or order creation, investigate or revert.
A faster internal span proves only that span improved.

If one query is still slow, inspect its actual plan on representative data:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');
```

That output is the execution of a single query, not a production p95. Compare
actual and estimated rows, rows filtered, buffers, and time. PostgreSQL
[documents](https://www.postgresql.org/docs/current/using-explain.html) that a
sequential scan can be cheaper than an index for a small or low-selectivity table; its
presence alone does not diagnose a missing index. Investigate the plan,
statistics, and workload before choosing one.

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
