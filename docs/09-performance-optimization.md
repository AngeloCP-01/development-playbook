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

For the order examples here, calculate the duration percentile from completed
outcomes and report failures and timeouts separately. State that rule in the
baseline so the after measurement uses the same denominator.

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

These are candidates, not a ranking. Start with the evidence from the
affected outcome.

**Index or query shape.** For an order-history query filtered by owner and
sorted by creation, a candidate index is `(owner_id, created_at DESC)`.
Its value depends on the plan,
table size, selectivity and write cost. Compare the same query and workload
before and after. A normal `CREATE INDEX` blocks writes while building;
`CONCURRENTLY` permits writes but takes longer, cannot run inside a
transaction block, and a failed build can leave an invalid index. Check what
your migration runner wraps in a transaction before using it.

**N+1 queries.** Repeated per-item lookups can dominate an order request.
The 20-item cart above makes the count visible; batch or join only after
confirming the repeated calls in a trace or query log. Preserve the same stock
decision and verify the request result.

**Serial awaits.** Independent operations can overlap with `Promise.all`.
The often-quoted 300 ms → 150 ms result assumes two independent 150 ms calls;
it is arithmetic, not a promised measurement. Do not parallelize a dependent
payment or inventory step.

**Caching.** For data safe to share across requests, [Next.js Cache
Components](https://nextjs.org/docs/app/api-reference/directives/use-cache)
supports `'use cache'`, `cacheLife` and `cacheTag`. A Server Action that writes
the tagged data can call `updateTag` so the next read waits for fresh data.
That API is limited to Server Actions; TTL and other invalidation paths have
different semantics. Test freshness and authorization as well as speed.

**Client bundles.** A production build checks that the app builds; [Next.js 16
no longer prints route-level JS bundle sizes
there](https://nextjs.org/docs/app/api-reference/cli/next). Use a bundle analyzer to
inspect what a client route ships, then measure whether changing an import
improves the affected page.

**Images.** `next/image` can serve responsive sizes and modern formats with
the default optimization loader. It lazy-loads by default, so an LCP image may
need eager loading or fetch priority. Static export cannot use the default
Image Optimization API without a compatible loader.

**Server Components.** Moving eligible fetching and rendering to the server
can reduce client JavaScript and a client-side fetch waterfall. It does not
remove every loading state or make a slow server query fast.

### When not to optimize

Do not add memoization, caching or an index merely because a profiler lists
that code path. A 200 ms query with few users can still block a consequential
workflow; a high-traffic operation can already meet its user target. Use the
recorded outcome and cost of the proposed change to decide whether to stop.

### AI in performance optimization

An assistant can organize a measurement record, suggest competing bottleneck
hypotheses, and draft a controlled reproduction. Give it the metric definition,
scope, sample count and trace or plan evidence. Check its arithmetic and every
claimed cause against the raw measurements. Do not ask it to invent a p95,
assume a sequential scan is bad, or declare a production win from a lab run.
Keep customer and payment data out of prompts.

---

## Artifacts

- A baseline record naming the outcome, metric, scope, window, sample and target
- The trace, query plan or controlled run that supports the chosen hypothesis
- The change and its correctness/rollback checks
- A comparable before and after record, including unsuccessful attempts

---

## Definition of done

- [ ] The same outcome is measured before and after, with comparable segment, data and cache state
- [ ] The production or field comparison records the window, sample, percentile, failures and timeouts
- [ ] The measured outcome meets its stated target, or the unresolved gap is recorded
- [ ] Correctness tests pass and the order, payment and inventory behavior remains intact
- [ ] A failed or harmful change is reverted or explicitly carried as an open problem

---

## Scaling to a team

- **Publish the targets** with the outcome and scope so the team measures the same thing.
- **Use a named CI budget.** State its metric, threshold and representative run. A passing
  build alone is not a bundle-size budget.
- **Review relevant query plans** when changing data access on a measured slow path.
- **Assign ownership** for observing the outcome after deployment and deciding whether
  the change helped.

---

## Traps

**Optimizing without measuring.** Record the outcome and baseline first, or there is no
way to tell whether a change helped.

**Averages instead of percentiles.** An average can hide a slow tail. Keep the sample
count beside the percentile.

**Treating a local run as field evidence.** A controlled run can reveal an N+1, but its
hardware, data and network may not represent users.

**Adding an index by reflex.** A missing index is not itself a diagnosis. Check the query
plan, selectivity, workload and write cost. Plan the migration's locking behavior.

**Caching without a freshness rule.** A cache may shorten one path while serving stale
stock or pricing data. Test the read after a write.

**`memo` and `useMemo` everywhere.** Profile the user outcome and render work before
adding comparison cost and complexity.

**Dismissing low traffic.** A rare workflow may still be critical to its users. Decide
from impact and the target, not request volume alone.

**Stopping at a faster internal span.** Retest the same user outcome in production or
field data. Record failures and correctness as well as duration.
