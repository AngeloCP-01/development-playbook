# Stage 09 chapter execution report

**Date:** 2026-10-08. **Branch:** `docs/2026-10-08-stage-09-research`.
**Scope:** canonical Stage 09 chapter, research for later W-6 sheets, and structural guards.
Stage 09 stays `ready: false`; W-3 remains 14/18 and W-6 remains 20/25 on `develop`.

The first measurement precedes any fix. The worked case is hypothetical: a
20-item cart with 21 inventory queries. It distinguishes the browser-observed
checkout outcome, payment visible to the user, and the three `OrderPaid`
consumers from route, provider, webhook and query diagnostic intervals.

## TDD evidence

Each RED run failed for the expected reason. Task 1 lacked the journey map and
baseline headings. Task 2 lacked worked order evidence and a bounded query-plan
interpretation. Task 3 still had blanket index/build advice and no AI section.
The review fix initially lacked user-outcome endpoints beyond diagnostic spans.
The teeth checks deliberately broke one requirement at a time; only the named
new guard failed, then the restored focused suite passed. Output below is the
raw Vitest output retained from those runs.

### Task 1 RED

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (2 tests | 2 failed) 6ms
   × the first optimization step defines a comparable order-flow baseline 4ms
   × order response, payment, and consumers have separate clocks 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > the first optimization step defines a comparable order-flow baseline
AssertionError: expected -1 to be greater than -1
 ❯ src/lib/stage-09-structure.test.ts:25:15
     23|   const baseline = md.indexOf('### Measure the first baseline')
     24|   const fixes = md.indexOf('### The fixes that usually matter')
     25|   expect(map).toBeGreaterThan(-1)
       |               ^
     26|   expect(baseline).toBeGreaterThan(map)
     27|   expect(fixes).toBeGreaterThan(baseline)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > order response, payment, and consumers have separate clocks
AssertionError: missing Map the order journey: expected -1 not to be -1 // Object.is equality
 ❯ section src/lib/stage-09-structure.test.ts:12:43
     10| function section(md: string, heading: string): string {
     11|   const start = md.indexOf('### ' + heading + '\n')
     12|   expect(start, 'missing ' + heading).not.toBe(-1)
       |                                           ^
     13|   const rest = md.slice(start)
     14|   const next = rest.indexOf('\n### ', 1)
 ❯ src/lib/stage-09-structure.test.ts:45:15

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed (2)
   Start at  13:32:33
   Duration  272ms (transform 42ms, setup 0ms, import 54ms, tests 6ms, environment 0ms)
~~~~

### Task 1 GREEN

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  13:32:51
   Duration  142ms (transform 17ms, setup 0ms, import 25ms, tests 6ms, environment 0ms)
~~~~

### Task 1 teeth

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (2 tests | 1 failed) 7ms
   × order response, payment, and consumers have separate clocks 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > order response, payment, and consumers have separate clocks
AssertionError: expected '### Map the order journey\n\nFirst na…' to match /branch|fan.out/i

- Expected:
/branch|fan.out/i

+ Received:
"### Map the order journey

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
are outside that request. Choose one
outcome to improve, then measure the other boundaries only where they help
explain it. Correlate the records with an opaque order or event ID and trace
context where available. Keep payment secrets and customer details out of
telemetry.
"

 ❯ src/lib/stage-09-structure.test.ts:52:15
     50|     expect(map.toLowerCase()).toContain(consumer)
     51|   }
     52|   expect(map).toMatch(/branch|fan.out/i)
       |               ^
     53|   expect(map).toMatch(/provider.+wait|payment.+wait/i)
     54| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  13:32:58
   Duration  150ms (transform 19ms, setup 0ms, import 31ms, tests 7ms, environment 0ms)
~~~~

### Task 1 restored

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  13:33:06
   Duration  177ms (transform 26ms, setup 0ms, import 55ms, tests 8ms, environment 0ms)
~~~~

### Task 2 RED

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (4 tests | 2 failed) 10ms
   × the worked order fix is chosen from evidence and retested at the user boundary 4ms
   × a query plan is a diagnosis of one query, not the order-flow result 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > the worked order fix is chosen from evidence and retested at the user boundary
AssertionError: expected '### Find the real bottleneck\n\n**Rea…' to contain 'Illustrative example'

- Expected
+ Received

- Illustrative example
+ ### Find the real bottleneck
+
+ **Real user data first** — Vercel Speed Insights gives field data, which is what actually
+ matters. Lab tools run on fast hardware on good networks; your users do not.
+
+ **Sentry performance traces** show where request time goes: which query, which external
+ call, which render.
+
+ **The database is usually the answer.** For a typical Next.js app, most slow requests are
+ slow queries, and most slow queries are N+1s or missing indexes.
+
+ ```sql
+ EXPLAIN ANALYZE
+ SELECT * FROM invoices WHERE owner_id = '...' ORDER BY created_at DESC LIMIT 20;
+ ```
+
+ `Seq Scan` on a large table means a missing index. Look at actual row counts versus
+ estimates — a large gap means stale statistics.
+

 ❯ src/lib/stage-09-structure.test.ts:59:21
     57|   const md = doc()
     58|   const diagnosis = section(md, 'Find the real bottleneck')
     59|   expect(diagnosis).toContain('Illustrative example')
       |                     ^
     60|   expect(diagnosis).toContain('20-item cart')
     61|   expect(diagnosis).toMatch(/21.+quer(y|ies)/s)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > a query plan is a diagnosis of one query, not the order-flow result
AssertionError: expected '### Find the real bottleneck\n\n**Rea…' to contain 'EXPLAIN (ANALYZE, BUFFERS)'

- Expected
+ Received

- EXPLAIN (ANALYZE, BUFFERS)
+ ### Find the real bottleneck
+
+ **Real user data first** — Vercel Speed Insights gives field data, which is what actually
+ matters. Lab tools run on fast hardware on good networks; your users do not.
+
+ **Sentry performance traces** show where request time goes: which query, which external
+ call, which render.
+
+ **The database is usually the answer.** For a typical Next.js app, most slow requests are
+ slow queries, and most slow queries are N+1s or missing indexes.
+
+ ```sql
+ EXPLAIN ANALYZE
+ SELECT * FROM invoices WHERE owner_id = '...' ORDER BY created_at DESC LIMIT 20;
+ ```
+
+ `Seq Scan` on a large table means a missing index. Look at actual row counts versus
+ estimates — a large gap means stale statistics.
+

 ❯ src/lib/stage-09-structure.test.ts:73:21
     71| test('a query plan is a diagnosis of one query, not the order-flow res…
     72|   const diagnosis = section(doc(), 'Find the real bottleneck')
     73|   expect(diagnosis).toContain('EXPLAIN (ANALYZE, BUFFERS)')
       |                     ^
     74|   expect(diagnosis).toMatch(/single query|one query/i)
     75|   expect(diagnosis).toMatch(/not.+p95/i)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 2 passed (4)
   Start at  13:47:05
   Duration  186ms (transform 38ms, setup 0ms, import 49ms, tests 10ms, environment 0ms)
~~~~

### Task 2 GREEN

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  13:47:21
   Duration  122ms (transform 16ms, setup 0ms, import 22ms, tests 4ms, environment 0ms)
~~~~

### Task 2 teeth

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (4 tests | 1 failed) 12ms
   × the worked order fix is chosen from evidence and retested at the user boundary 9ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > the worked order fix is chosen from evidence and retested at the user boundary
AssertionError: expected '### Find the real bottleneck\n\nStart…' to contain '| Outcome | Place order → response | …'

- Expected
+ Received

- | Outcome | Place order → response | Same outcome |
+ ### Find the real bottleneck
+
+ Start at the slow outcome, then move inward. A checkout-response problem calls
+ for request latency by route, a few representative slow traces, and only then
+ database or external-call timings. A slow Paid status calls for webhook and
+ status-update timestamps. A late notification calls for event-publish and
+ consumer-completion timestamps. Traces show instrumented spans; an absent
+ database span is not proof the database did no work.
+
+ **Illustrative example, not a measured application:** a 20-item cart makes
+ the Place order response feel slow. Record a seven-day production baseline for
+ that route, a clearly named deployment, traffic sample, failures, and a
+ controlled 20-item cart reproduction. Slow request traces show 21 inventory
+ queries: one list query and one availability query per item. The repeated
+ database round trips, not a large checkout image, account for most of the
+ request's time in this example. Batch the availability lookup for the cart's
+ SKUs, preserving the same stock decision and order result. The image is the
+ rejected alternative because it cannot explain the observed server time.
+
+ | Comparison field | Before | After |
+ |---|---|---|
+ | Outcome | Place order → response | Different outcome |
+ | Scope | Same route, segment, cart shape, cache state and length of observation window | Same scope after deployment |
+ | Diagnostic evidence | 21 inventory queries for a 20-item cart in the controlled reproduction | One batched availability query in the same reproduction |
+ | Production verdict | Record route p95, sample count, error rate and timeouts | Compare those same measures; do not claim a win from query count alone |
+
+ The before/after cells are an example record to fill, not invented p95
+ measurements. If the user-facing p95 misses its target, failures rise, or
+ correctness changes in stock checks or order creation, investigate or revert.
+ A faster internal span proves only that span improved.
+
+ If one query is still slow, inspect its actual plan on representative data:
+
+ ```sql
+ EXPLAIN (ANALYZE, BUFFERS)
+ SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');
+ ```
+
+ That output is the execution of a single query, not a production p95. Compare
+ actual and estimated rows, rows filtered, buffers, and time. PostgreSQL
+ [documents](https://www.postgresql.org/docs/current/using-explain.html) that a
+ sequential scan can be cheaper than an index for a small or low-selectivity table; its
+ presence alone does not diagnose a missing index. Investigate the plan,
+ statistics, and workload before choosing one.
+

 ❯ src/lib/stage-09-structure.test.ts:65:21
     63|   expect(diagnosis).toMatch(/alternative|instead/i)
     64|   expect(diagnosis).toMatch(/before.+after/is)
     65|   expect(diagnosis).toContain('| Outcome | Place order → response | Sa…
       |                     ^
     66|   expect(diagnosis).toMatch(/production/i)
     67|   expect(diagnosis).toMatch(/correctness/i)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  13:47:31
   Duration  151ms (transform 18ms, setup 0ms, import 28ms, tests 12ms, environment 0ms)
~~~~

### Task 2 restored

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  13:47:40
   Duration  110ms (transform 15ms, setup 0ms, import 21ms, tests 3ms, environment 0ms)
~~~~

### Task 3 RED

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (6 tests | 2 failed) 18ms
   × fixes remain hypotheses and indexing advice respects plan and write cost 9ms
   × completion is tied to the selected outcome and includes correctness 1ms
 ❯ |unit| src/lib/stage-metadata.test.ts (33 tests | 1 failed) 18ms
   × 09-performance-optimization: the doc carries an AI plays section 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > fixes remain hypotheses and indexing advice respects plan and write cost
AssertionError: expected '# 09. Performance Optimization\n\n> M…' to contain '### AI in performance optimization'

- Expected
+ Received

- ### AI in performance optimization
+ # 09. Performance Optimization
+
+ > Make it fast enough for the people using it, using measurements rather than instinct.
+
+ **When this actually happens:** When something is measurably slow, or before a launch
+ that will change traffic shape. Not continuously, and emphatically not preemptively —
+ premature optimization buys complexity with no return.
+
+ ---
+
+ ## Entry criteria
+
+ - [ ] Something is actually slow, and you can point at it
+ - [ ] You have a measurement, not a feeling
+ - [ ] The feature works correctly — never optimize code whose correctness is unsettled
+
+ ---
+
+ ## The work
+
+ ### Map the order journey
+
+ First name the outcome that feels slow. “Ordering is slow” can mean a delayed
+ response after Place order, a long wait for Paid, or a late notification. Those
+ are different clocks. Here is a hypothetical order flow; your application may
+ keep the same responsibilities in one process.
+
+ ```text
+ Order request → validate → authenticate → check inventory
+               → create order → initiate payment → response
+
+ Payment webhook → mark order paid → publish OrderPaid
+                                 ├→ inventory consumer
+                                 ├→ logistics consumer
+                                 └→ notification consumer
+ ```
+
+ The response ends the checkout request. Provider waiting and the later webhook
+ are outside that request. The three consumers branch from OrderPaid; their
+ dependencies are a product decision, not an assumed serial chain. Choose one
+ outcome to improve, then measure the other boundaries only where they help
+ explain it. Correlate the records with an opaque order or event ID and trace
+ context where available. Keep payment secrets and customer details out of
+ telemetry.
+
+ ### Measure the first baseline
+
+ Write a baseline record before naming a fix:
+
+ | Record | What to write |
+ |---|---|
+ | Outcome | The user-visible event and its start and end, such as Place order → response or webhook receipt → Paid |
+ | Metric | Duration and percentile for that outcome; include failures and timeouts rather than measuring only successes |
+ | Scope | Route or event name, deployment version, device or other relevant segment, and whether the cache was cold or warm |
+ | Window and sample | Collection dates, number of observations, and the traffic or test-data shape |
+ | Evidence | Field dashboard or request log for the user outcome; one trace or controlled run for diagnosis |
+
+ For page loading and interactions, start with real-user Web Vitals in
+ [Speed Insights](https://vercel.com/docs/speed-insights/metrics) or
+ [PageSpeed Insights](https://web.dev/articles/vitals-measurement-getting-started)
+ and compare mobile and desktop. For a server route, inspect its duration by
+ route in your available monitoring; feature detail and retention vary by
+ plan. For webhook-to-paid or OrderPaid-to-consumer lag, record timestamps at
+ those boundaries and join them by an opaque identifier. A trace can explain
+ instrumented work across services when [context is
+ propagated](https://opentelemetry.io/docs/concepts/context-propagation/),
+ but it does not automatically include time spent waiting at an external
+ payment provider.
+
+ Reproduce the same action in a controlled environment with stated device,
+ network, cart size, data volume, and cache state. A controlled run helps
+ diagnose a cause; it is not a production p95. If field traffic is too sparse
+ for a stable percentile, say so and keep the controlled baseline until enough
+ real observations accumulate. Never invent a field number to fill the gap.
+
+ ### Decide what fast enough means
+
+ Choose a target for the outcome you recorded. [Google's good Core Web Vitals
+ thresholds](https://web.dev/articles/vitals) are LCP ≤2.5 s, INP ≤200 ms,
+ and CLS ≤0.1 at p75, assessed
+ separately for mobile and desktop. An API p95 or database-query target belongs
+ to your product and workload; 300 ms and 50 ms are example budgets, not web
+ standards. Percentiles expose the slow tail that an average alone can hide.
+ Record the target and why users need it before optimizing.
+
+ ### Find the real bottleneck
+
+ Start at the slow outcome, then move inward. A checkout-response problem calls
+ for request latency by route, a few representative slow traces, and only then
+ database or external-call timings. A slow Paid status calls for webhook and
+ status-update timestamps. A late notification calls for event-publish and
+ consumer-completion timestamps. Traces show instrumented spans; an absent
+ database span is not proof the database did no work.
+
+ **Illustrative example, not a measured application:** a 20-item cart makes
+ the Place order response feel slow. Record a seven-day production baseline for
+ that route, a clearly named deployment, traffic sample, failures, and a
+ controlled 20-item cart reproduction. Slow request traces show 21 inventory
+ queries: one list query and one availability query per item. The repeated
+ database round trips, not a large checkout image, account for most of the
+ request's time in this example. Batch the availability lookup for the cart's
+ SKUs, preserving the same stock decision and order result. The image is the
+ rejected alternative because it cannot explain the observed server time.
+
+ | Comparison field | Before | After |
+ |---|---|---|
+ | Outcome | Place order → response | Same outcome |
+ | Scope | Same route, segment, cart shape, cache state and length of observation window | Same scope after deployment |
+ | Diagnostic evidence | 21 inventory queries for a 20-item cart in the controlled reproduction | One batched availability query in the same reproduction |
+ | Production verdict | Record route p95, sample count, error rate and timeouts | Compare those same measures; do not claim a win from query count alone |
+
+ The before/after cells are an example record to fill, not invented p95
+ measurements. If the user-facing p95 misses its target, failures rise, or
+ correctness changes in stock checks or order creation, investigate or revert.
+ A faster internal span proves only that span improved.
+
+ If one query is still slow, inspect its actual plan on representative data:
+
+ ```sql
+ EXPLAIN (ANALYZE, BUFFERS)
+ SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');
+ ```
+
+ That output is the execution of a single query, not a production p95. Compare
+ actual and estimated rows, rows filtered, buffers, and time. PostgreSQL
+ [documents](https://www.postgresql.org/docs/current/using-explain.html) that a
+ sequential scan can be cheaper than an index for a small or low-selectivity table; its
+ presence alone does not diagnose a missing index. Investigate the plan,
+ statistics, and workload before choosing one.
+
+ ### The fixes that usually matter
+
+ In rough order of how often they are the answer:
+
+ **1. Missing indexes.** Every column you filter or sort by, at production data volume.
+
+ ```sql
+ CREATE INDEX CONCURRENTLY idx_invoices_owner_created
+   ON invoices (owner_id, created_at DESC);
+ ```
+
+ `CONCURRENTLY` avoids taking a write lock. On a production table, omitting it can take the
+ site down. Composite column order should match your query's filter-then-sort shape.
+
+ **2. N+1 queries.** Fetching a list, then querying per item. Twenty invoices become
+ twenty-one queries.
+
+ ```ts
+ // Bad: one query per invoice
+ const invoices = await db.query.invoices.findMany({ where: ... })
+ for (const inv of invoices) {
+   inv.customer = await db.query.customers.findFirst({ where: eq(customers.id, inv.customerId) })
+ }
+
+ // Good: one query
+ const invoices = await db.query.invoices.findMany({
+   where: ...,
+   with: { customer: true },
+ })
+ ```
+
+ This is the most common serious performance bug in application code, and it is invisible
+ locally — with 5 seeded rows, 6 queries is fast. With 5,000 rows it is not.
+
+ **3. Serial awaits that could be parallel.**
+
+ ```ts
+ // Bad: 300ms
+ const user = await getUser(id)
+ const invoices = await getInvoices(id)
+
+ // Good: 150ms
+ const [user, invoices] = await Promise.all([getUser(id), getInvoices(id)])
+ ```
+
+ Only when they are genuinely independent.
+
+ **4. Missing caching.** For data that does not change per request, Next.js 16's
+ `use cache` directive:
+
+ ```ts
+ import { cacheLife, cacheTag } from 'next/cache'
+
+ export async function getPricingPlans() {
+   'use cache'
+   cacheLife('hours')
+   cacheTag('pricing')
+   return db.query.plans.findMany()
+ }
+ ```
+
+ Then invalidate precisely when the data changes, from the server action that changed it:
+
+ ```ts
+ 'use server'
+ import { updateTag } from 'next/cache'
+
+ export async function updatePlan(/* ... */) {
+   await db.update(plans)/* ... */
+   updateTag('pricing')
+ }
+ ```
+
+ Tag-based invalidation beats guessing at a TTL: the cache is correct immediately after a
+ write rather than eventually. Requires Cache Components enabled in `next.config.ts`.
+
+ Cache deliberately. A cache is a second source of truth, and a stale-data bug is far more
+ confusing to debug than a slow query.
+
+ **5. Oversized client bundles.**
+
+ ```bash
+ pnpm build   # review the route-level output
+ ```
+
+ Common causes: a date library imported whole for one function, an icon set imported
+ entirely for three icons, or a heavy component that could be dynamically imported.
+
+ **6. Unoptimized images.** Use `next/image`. It handles format negotiation, sizing, and
+ lazy loading. An unoptimized hero image routinely outweighs all the JavaScript on the
+ page.
+
+ ### Server Components are a performance feature
+
+ Moving data fetching to the server removes a whole class of problem: no client-side
+ waterfall, no loading spinners, no shipping data-fetching code to the browser. Before
+ optimizing a client component, check whether it needs to be a client component at all.
+
+ ### Do not optimize these
+
+ - **React re-renders**, unless profiling shows a real problem. `memo` everywhere adds
+   comparison cost and complexity for no measured benefit.
+ - **Micro-benchmarks** of code that runs once per request. Saving 2ms in a 300ms request
+   is not a win.
+ - **Anything at low traffic.** A query taking 200ms with 50 daily users is fine. Optimize
+   when it matters.
+
+ ---
+
+ ## Artifacts
+
+ - Before-and-after measurements for each change
+ - Indexes added via committed migrations
+ - Documented performance targets
+ - Notes on what you tried that did *not* help — genuinely valuable, and never written
+   down
+
+ ---
+
+ ## Definition of done
+
+ - [ ] The original slow thing is measurably faster, with numbers
+ - [ ] Improvement confirmed in production, not just locally ([14](14-post-deployment-verification.md))
+ - [ ] Core Web Vitals within target at p75
+ - [ ] No N+1 queries on primary paths
+ - [ ] Indexes exist for every filtered and sorted column
+ - [ ] Nothing broke — tests still green ([06](06-testing.md))
+
+ ---
+
+ ## Scaling to a team
+
+ - **Publish the targets** so performance is a shared standard rather than one person's
+   crusade.
+ - **Add performance budgets to CI** — fail the build if a bundle exceeds a threshold. Slow
+   accretion is invisible per-PR and enormous over a year.
+ - **Review query plans in PRs** for anything touching data access.
+ - **Watch for the "someone else's problem" effect.** Everyone assumes performance is
+   owned by whoever cares most. Assign it explicitly.
+
+ ---
+
+ ## Traps
+
+ **Optimizing without measuring.** You will optimize the wrong thing, add complexity, and
+ have no way to know it did not help.
+
+ **Averages instead of percentiles.** The average is fine. The p99 is on fire.
+
+ **Testing performance locally.** Local has 50 rows, no network latency, and a fast
+ machine. The N+1 is invisible until production.
+
+ **`CREATE INDEX` without `CONCURRENTLY`.** Takes a write lock on the table. On a busy
+ production table, this is an outage.
+
+ **Caching to avoid fixing a slow query.** Now you have a slow query *and* a cache
+ invalidation problem.
+
+ **`memo` and `useMemo` everywhere.** Real cost, imaginary benefit, more complex code.
+ Profile first.
+
+ **Optimizing before it matters.** Speed you cannot measure has no value, and the
+ complexity you added to get it is permanent.
+
+ **Stopping before verifying in production.** Local improvements sometimes fail to
+ materialize under real conditions. Confirm with field data.
+

 ❯ src/lib/stage-09-structure.test.ts:86:14
     84| test('fixes remain hypotheses and indexing advice respects plan and wr…
     85|   const md = doc()
     86|   expect(md).toContain('### AI in performance optimization')
       |              ^
     87|   expect(md).toMatch(/index.+write cost/is)
     88|   expect(md).toMatch(/CONCURRENTLY.+transaction/is)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > completion is tied to the selected outcome and includes correctness
AssertionError: expected '\n\n- [ ] The original slow thing is …' to match /same outcome/i

- Expected:
/same outcome/i

+ Received:
"

- [ ] The original slow thing is measurably faster, with numbers
- [ ] Improvement confirmed in production, not just locally ([14](14-post-deployment-verification.md))
- [ ] Core Web Vitals within target at p75
- [ ] No N+1 queries on primary paths
- [ ] Indexes exist for every filtered and sorted column
- [ ] Nothing broke — tests still green ([06](06-testing.md))

---
"

 ❯ src/lib/stage-09-structure.test.ts:102:16
    100|   const md = doc()
    101|   const done = md.split('## Definition of done')[1]?.split('\n## ')[0]…
    102|   expect(done).toMatch(/same outcome/i)
       |                ^
    103|   expect(done).toMatch(/before and after/i)
    104|   expect(done).toMatch(/sample/i)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  |unit| src/lib/stage-metadata.test.ts > 09-performance-optimization: the doc carries an AI plays section
AssertionError: 09-performance-optimization has no "### AI in ..." subsection: expected '# 09. Performance Optimization\n\n> M…' to match /^### AI in .+$/m

- Expected:
/^### AI in .+$/m

+ Received:
"# 09. Performance Optimization

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
- **Watch for the \"someone else's problem\" effect.** Everyone assumes performance is
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
"

 ❯ src/lib/stage-metadata.test.ts:72:61
     70|   (slug) => {
     71|     const md = readFileSync(docPath(slug), 'utf8')
     72|     expect(md, `${slug} has no "### AI in ..." subsection`).toMatch(
       |                                                             ^
     73|       /^### AI in .+$/m,
     74|     )

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  2 failed (2)
      Tests  3 failed | 36 passed (39)
   Start at  13:48:27
   Duration  170ms (transform 57ms, setup 0ms, import 73ms, tests 37ms, environment 0ms)
~~~~

### Task 3 GREEN

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  39 passed (39)
   Start at  13:49:07
   Duration  185ms (transform 78ms, setup 0ms, import 99ms, tests 17ms, environment 0ms)
~~~~

### Task 3 teeth

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (6 tests | 1 failed) 15ms
   × fixes remain hypotheses and indexing advice respects plan and write cost 10ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > fixes remain hypotheses and indexing advice respects plan and write cost
AssertionError: expected '# 09. Performance Optimization\n\n> M…' not to contain 'Indexes exist for every filtered and …'

- Expected
+ Received

- Indexes exist for every filtered and sorted column
+ # 09. Performance Optimization
+
+ > Make it fast enough for the people using it, using measurements rather than instinct.
+
+ **When this actually happens:** When something is measurably slow, or before a launch
+ that will change traffic shape. Not continuously, and emphatically not preemptively —
+ premature optimization buys complexity with no return.
+
+ ---
+
+ ## Entry criteria
+
+ - [ ] Something is actually slow, and you can point at it
+ - [ ] You have a measurement, not a feeling
+ - [ ] The feature works correctly — never optimize code whose correctness is unsettled
+
+ ---
+
+ ## The work
+
+ ### Map the order journey
+
+ First name the outcome that feels slow. “Ordering is slow” can mean a delayed
+ response after Place order, a long wait for Paid, or a late notification. Those
+ are different clocks. Here is a hypothetical order flow; your application may
+ keep the same responsibilities in one process.
+
+ ```text
+ Order request → validate → authenticate → check inventory
+               → create order → initiate payment → response
+
+ Payment webhook → mark order paid → publish OrderPaid
+                                 ├→ inventory consumer
+                                 ├→ logistics consumer
+                                 └→ notification consumer
+ ```
+
+ The response ends the checkout request. Provider waiting and the later webhook
+ are outside that request. The three consumers branch from OrderPaid; their
+ dependencies are a product decision, not an assumed serial chain. Choose one
+ outcome to improve, then measure the other boundaries only where they help
+ explain it. Correlate the records with an opaque order or event ID and trace
+ context where available. Keep payment secrets and customer details out of
+ telemetry.
+
+ ### Measure the first baseline
+
+ Write a baseline record before naming a fix:
+
+ | Record | What to write |
+ |---|---|
+ | Outcome | The user-visible event and its start and end, such as Place order → response or webhook receipt → Paid |
+ | Metric | Duration and percentile for that outcome; include failures and timeouts rather than measuring only successes |
+ | Scope | Route or event name, deployment version, device or other relevant segment, and whether the cache was cold or warm |
+ | Window and sample | Collection dates, number of observations, and the traffic or test-data shape |
+ | Evidence | Field dashboard or request log for the user outcome; one trace or controlled run for diagnosis |
+
+ For page loading and interactions, start with real-user Web Vitals in
+ [Speed Insights](https://vercel.com/docs/speed-insights/metrics) or
+ [PageSpeed Insights](https://web.dev/articles/vitals-measurement-getting-started)
+ and compare mobile and desktop. For a server route, inspect its duration by
+ route in your available monitoring; feature detail and retention vary by
+ plan. For webhook-to-paid or OrderPaid-to-consumer lag, record timestamps at
+ those boundaries and join them by an opaque identifier. A trace can explain
+ instrumented work across services when [context is
+ propagated](https://opentelemetry.io/docs/concepts/context-propagation/),
+ but it does not automatically include time spent waiting at an external
+ payment provider.
+
+ Reproduce the same action in a controlled environment with stated device,
+ network, cart size, data volume, and cache state. A controlled run helps
+ diagnose a cause; it is not a production p95. If field traffic is too sparse
+ for a stable percentile, say so and keep the controlled baseline until enough
+ real observations accumulate. Never invent a field number to fill the gap.
+
+ ### Decide what fast enough means
+
+ Choose a target for the outcome you recorded. [Google's good Core Web Vitals
+ thresholds](https://web.dev/articles/vitals) are LCP ≤2.5 s, INP ≤200 ms,
+ and CLS ≤0.1 at p75, assessed
+ separately for mobile and desktop. An API p95 or database-query target belongs
+ to your product and workload; 300 ms and 50 ms are example budgets, not web
+ standards. Percentiles expose the slow tail that an average alone can hide.
+ Record the target and why users need it before optimizing.
+
+ ### Find the real bottleneck
+
+ Start at the slow outcome, then move inward. A checkout-response problem calls
+ for request latency by route, a few representative slow traces, and only then
+ database or external-call timings. A slow Paid status calls for webhook and
+ status-update timestamps. A late notification calls for event-publish and
+ consumer-completion timestamps. Traces show instrumented spans; an absent
+ database span is not proof the database did no work.
+
+ **Illustrative example, not a measured application:** a 20-item cart makes
+ the Place order response feel slow. Record a seven-day production baseline for
+ that route, a clearly named deployment, traffic sample, failures, and a
+ controlled 20-item cart reproduction. Slow request traces show 21 inventory
+ queries: one list query and one availability query per item. The repeated
+ database round trips, not a large checkout image, account for most of the
+ request's time in this example. Batch the availability lookup for the cart's
+ SKUs, preserving the same stock decision and order result. The image is the
+ rejected alternative because it cannot explain the observed server time.
+
+ | Comparison field | Before | After |
+ |---|---|---|
+ | Outcome | Place order → response | Same outcome |
+ | Scope | Same route, segment, cart shape, cache state and length of observation window | Same scope after deployment |
+ | Diagnostic evidence | 21 inventory queries for a 20-item cart in the controlled reproduction | One batched availability query in the same reproduction |
+ | Production verdict | Record route p95, sample count, error rate and timeouts | Compare those same measures; do not claim a win from query count alone |
+
+ The before/after cells are an example record to fill, not invented p95
+ measurements. If the user-facing p95 misses its target, failures rise, or
+ correctness changes in stock checks or order creation, investigate or revert.
+ A faster internal span proves only that span improved.
+
+ If one query is still slow, inspect its actual plan on representative data:
+
+ ```sql
+ EXPLAIN (ANALYZE, BUFFERS)
+ SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');
+ ```
+
+ That output is the execution of a single query, not a production p95. Compare
+ actual and estimated rows, rows filtered, buffers, and time. PostgreSQL
+ [documents](https://www.postgresql.org/docs/current/using-explain.html) that a
+ sequential scan can be cheaper than an index for a small or low-selectivity table; its
+ presence alone does not diagnose a missing index. Investigate the plan,
+ statistics, and workload before choosing one.
+
+ ### The fixes that usually matter
+
+ These are candidates, not a ranking. Start with the evidence from the
+ affected outcome.
+
+ **Index or query shape.** A candidate index for an observed filter-and-sort
+ query can be `(owner_id, created_at DESC)`, but its value depends on the plan,
+ table size, selectivity and write cost. Compare the same query and workload
+ before and after. A normal `CREATE INDEX` blocks writes while building;
+ `CONCURRENTLY` permits writes but takes longer, cannot run inside a
+ transaction block, and a failed build can leave an invalid index. Check what
+ your migration runner wraps in a transaction before using it.
+
+ **N+1 queries.** Repeated per-item lookups can dominate an order request.
+ The 20-item cart above makes the count visible; batch or join only after
+ confirming the repeated calls in a trace or query log. Preserve the same stock
+ decision and verify the request result.
+
+ **Serial awaits.** Independent operations can overlap with `Promise.all`.
+ The often-quoted 300 ms → 150 ms result assumes two independent 150 ms calls;
+ it is arithmetic, not a promised measurement. Do not parallelize a dependent
+ payment or inventory step.
+
+ **Caching.** For data safe to share across requests, [Next.js Cache
+ Components](https://nextjs.org/docs/app/api-reference/directives/use-cache)
+ supports `'use cache'`, `cacheLife` and `cacheTag`. A Server Action that writes
+ the tagged data can call `updateTag` so the next read waits for fresh data.
+ That API is limited to Server Actions; TTL and other invalidation paths have
+ different semantics. Test freshness and authorization as well as speed.
+
+ **Client bundles.** A production build checks that the app builds; [Next.js 16
+ no longer prints route-level JS bundle sizes
+ there](https://nextjs.org/docs/app/api-reference/cli/next). Use a bundle analyzer to
+ inspect what a client route ships, then measure whether changing an import
+ improves the affected page.
+
+ **Images.** `next/image` can serve responsive sizes and modern formats with
+ the default optimization loader. It lazy-loads by default, so an LCP image may
+ need eager loading or fetch priority. Static export cannot use the default
+ Image Optimization API without a compatible loader.
+
+ **Server Components.** Moving eligible fetching and rendering to the server
+ can reduce client JavaScript and a client-side fetch waterfall. It does not
+ remove every loading state or make a slow server query fast.
+
+ ### When not to optimize
+
+ Do not add memoization, caching or an index merely because a profiler lists
+ that code path. A 200 ms query with few users can still block a consequential
+ workflow; a high-traffic operation can already meet its user target. Use the
+ recorded outcome and cost of the proposed change to decide whether to stop.
+
+ ### AI in performance optimization
+
+ An assistant can organize a measurement record, suggest competing bottleneck
+ hypotheses, and draft a controlled reproduction. Give it the metric definition,
+ scope, sample count and trace or plan evidence. Check its arithmetic and every
+ claimed cause against the raw measurements. Do not ask it to invent a p95,
+ assume a sequential scan is bad, or declare a production win from a lab run.
+ Keep customer and payment data out of prompts.
+
+ ---
+
+ ## Artifacts
+
+ - A baseline record naming the outcome, metric, scope, window, sample and target
+ - The trace, query plan or controlled run that supports the chosen hypothesis
+ - The change and its correctness/rollback checks
+ - A comparable before and after record, including unsuccessful attempts
+
+ ---
+
+ ## Definition of done
+
+ - [ ] The same outcome is measured before and after, with comparable segment, data and cache state
+ - [ ] The production or field comparison records the window, sample, percentile, failures and timeouts
+ - [ ] The measured outcome meets its stated target, or the unresolved gap is recorded
+ - [ ] Indexes exist for every filtered and sorted column
+ - [ ] Correctness tests pass and the order, payment and inventory behavior remains intact
+ - [ ] A failed or harmful change is reverted or explicitly carried as an open problem
+
+ ---
+
+ ## Scaling to a team
+
+ - **Publish the targets** with the outcome and scope so the team measures the same thing.
+ - **Use a named CI budget.** State its metric, threshold and representative run. A passing
+   build alone is not a bundle-size budget.
+ - **Review relevant query plans** when changing data access on a measured slow path.
+ - **Assign ownership** for observing the outcome after deployment and deciding whether
+   the change helped.
+
+ ---
+
+ ## Traps
+
+ **Optimizing without measuring.** Record the outcome and baseline first, or there is no
+ way to tell whether a change helped.
+
+ **Averages instead of percentiles.** An average can hide a slow tail. Keep the sample
+ count beside the percentile.
+
+ **Treating a local run as field evidence.** A controlled run can reveal an N+1, but its
+ hardware, data and network may not represent users.
+
+ **Adding an index by reflex.** A missing index is not itself a diagnosis. Check the query
+ plan, selectivity, workload and write cost. Plan the migration's locking behavior.
+
+ **Caching without a freshness rule.** A cache may shorten one path while serving stale
+ stock or pricing data. Test the read after a write.
+
+ **`memo` and `useMemo` everywhere.** Profile the user outcome and render work before
+ adding comparison cost and complexity.
+
+ **Dismissing low traffic.** A rare workflow may still be critical to its users. Decide
+ from impact and the target, not request volume alone.
+
+ **Stopping at a faster internal span.** Retest the same user outcome in production or
+ field data. Record failures and correctness as well as duration.
+

 ❯ src/lib/stage-09-structure.test.ts:94:18
     92|   expect(md).toMatch(/LCP.+eager/is)
     93|   expect(md).not.toContain('Every column you filter or sort by')
     94|   expect(md).not.toContain('Indexes exist for every filtered and sorte…
       |                  ^
     95|   expect(md).not.toContain('Anything at low traffic.')
     96|   expect(md).not.toContain('pnpm build   # review the route-level outp…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 38 passed (39)
   Start at  13:49:48
   Duration  139ms (transform 41ms, setup 0ms, import 58ms, tests 26ms, environment 0ms)
~~~~

### Task 3 restored

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  2 passed (2)
      Tests  39 passed (39)
   Start at  13:49:57
   Duration  126ms (transform 43ms, setup 0ms, import 59ms, tests 10ms, environment 0ms)
~~~~

### Review I1 RED

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web

 ❯ |unit| src/lib/stage-09-structure.test.ts (9 tests | 1 failed) 8ms
   × user outcome clocks include browser and provider time beyond diagnostic intervals 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/stage-09-structure.test.ts > user outcome clocks include browser and provider time beyond diagnostic intervals
AssertionError: expected '### Map the order journey\n\nFirst na…' to match /click[\s\S]+response receipt/i

- Expected:
/click[\s\S]+response receipt/i

+ Received:
"### Map the order journey

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
"

 ❯ src/lib/stage-09-structure.test.ts:125:15
    123|   const baseline = section(md, 'Measure the first baseline')
    124|   const diagnosis = section(md, 'Find the real bottleneck')
    125|   expect(map).toMatch(/click[\s\S]+response receipt/i)
       |               ^
    126|   expect(map).toMatch(/payment submitted[\s\S]+Paid visible/i)
    127|   expect(baseline).toMatch(/route duration[\s\S]+diagnostic/i)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 8 passed (9)
   Start at  13:55:44
   Duration  124ms (transform 17ms, setup 0ms, import 24ms, tests 8ms, environment 0ms)
~~~~

### Review I1 GREEN

~~~~text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/web


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  13:56:47
   Duration  131ms (transform 18ms, setup 0ms, import 26ms, tests 6ms, environment 0ms)
~~~~

## Cold reader and review

The cold reader could draft a payment baseline but found the timeout
percentile's denominator unstated. Commit `a5ccc35` defines the example's
completed-outcome percentile and separate failure/timeout counts. A fresh
whole-branch reviewer found **I1 (Important, plan-authored error)**: server
route and webhook subintervals stood in for browser checkout and visible Paid
outcomes. Commit `758c2cc` added explicit user clocks and the RED/GREEN guard
above. The reviewer assessed the pre-fix branch as **Ready with fixes**; I1 is
fixed and the full suite was rerun. No Critical or Minor findings were reported.

The `humanizer:humanizer` pass over the chapter and plan kept their technical
voice; no broad prose rewrite was needed. The source audit remains dated to its
pre-revision chapter lines and lists the W-6 `caching`/`scaling` references.

## Final gates

- `pnpm format:check`: passed.
- `pnpm lint`: passed with zero warnings.
- `pnpm typecheck`: passed; the initial run caught plan-authored `/s` regex
  flags incompatible with the repo's ES2017 target, fixed in `a5ccc35`.
- `pnpm test`: **1,416/1,416 across 185 files** on the records commit.
- `pnpm build`: passed, prerendering 50 static pages. The sandboxed attempt
  could not fetch Google Fonts; a run with network access passed.
- `git diff --check develop...HEAD`: passed. No UI changed, so the production
  and development browser audits belong to the later interactive port.

**Deferred:** Stage 09 React port and browser audits, W-6 `caching` and
`scaling` sheets, third-party image publication, a real order-system benchmark,
merge, push and deployment. No third-party image was selected or published.
