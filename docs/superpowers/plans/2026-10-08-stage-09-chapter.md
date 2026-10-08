# Stage 09 Chapter Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teach a reader to measure a slow order journey before choosing and verifying a performance fix, while correcting the chapter's unsupported advice.

**Architecture:** Revise the canonical Markdown chapter in three independently reviewable slices: first measurement, worked diagnosis, then correction of the fix catalog and completion criteria. Keep the static site unready for Stage 09 until the corrected chapter has been reviewed; the interactive port gets a later plan.

**Tech Stack:** Markdown, TypeScript, Vitest 4, Next.js 16.2.10 documentation, PostgreSQL documentation.

**Spec:** `docs/superpowers/specs/2026-10-08-stage-09-performance-design.md`

## Global Constraints

- Stage 09's cadence is “On measured slowness only”; the number is a filing code.
- The order flow is a hypothetical teaching case, not a required service architecture or a benchmark of this static site.
- Separate checkout-request time, payment-confirmation lag, and each `OrderPaid` consumer's lag. The consumers branch unless a real business rule orders them.
- Label every example value illustrative. A lab run, trace span, or query plan is not a production percentile.
- For Web Vitals, use LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at p75, separately for mobile and desktop.
- Follow the installed Next.js 16.2.10 docs before changing framework advice. `updateTag` is Server Action only; `next build` does not report JS bundle sizes.
- Use the primary links in `reference/stage-09-performance-sources.md`. No third-party image is cleared for display.
- Write a failing guard before each chapter change, preserve raw RED/GREEN output, and run a teeth check on each new guard group.
- Keep the earlier uncommitted Stage 08 count correction in `docs/task.md` separate from Stage 09 commits.

## Review Focus

- **A fast checkout response with slow payment:** Task 1's test requires distinct response and paid-status clocks; the chapter cannot count provider waiting as request latency.
- **Three event consumers:** Task 1's test requires a fan-out and separate consumer lag; a linear inventory → logistics → notification chain would assert an unchosen business dependency.
- **Too few field samples:** Task 1's test requires a controlled baseline and an explicit limit on percentile claims.
- **A faster internal span with unchanged user outcome:** Task 2's test requires a like-for-like production retest of the chosen outcome, not a query-time victory claim.
- **Sequential scan or missing index:** Task 3's test forbids the old automatic diagnosis and blanket index rule; the query plan and write cost decide.

---

### Task 1: Teach the first measurement

**Files:**
- Create: `web/src/lib/stage-09-structure.test.ts`
- Modify: `docs/09-performance-optimization.md:19–49`

**Interfaces:**
- Consumes: the approved order-flow spec and the first-measurement sources in `reference/stage-09-performance-sources.md`.
- Produces: `### Map the order journey`, `### Measure the first baseline`, and `### Decide what fast enough means` within `## The work`. Task 2 keeps the same named outcome and baseline fields.

- [ ] **Step 1: Write the failing test.** Create `web/src/lib/stage-09-structure.test.ts` with this source:

```ts
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const path = fileURLToPath(
  new URL('../../../docs/09-performance-optimization.md', import.meta.url),
)
const doc = () => readFileSync(path, 'utf8')

function section(md: string, heading: string): string {
  const start = md.indexOf('### ' + heading + '\n')
  expect(start, 'missing ' + heading).not.toBe(-1)
  const rest = md.slice(start)
  const next = rest.indexOf('\n### ', 1)
  const top = rest.indexOf('\n## ', 1)
  const end = [next, top].filter((n) => n !== -1).sort((a, b) => a - b)[0]
  return end === undefined ? rest : rest.slice(0, end)
}

test('the first optimization step defines a comparable order-flow baseline', () => {
  const md = doc()
  const map = md.indexOf('### Map the order journey')
  const baseline = md.indexOf('### Measure the first baseline')
  const fixes = md.indexOf('### The fixes that usually matter')
  expect(map).toBeGreaterThan(-1)
  expect(baseline).toBeGreaterThan(map)
  expect(fixes).toBeGreaterThan(baseline)
  const first = section(md, 'Measure the first baseline')
  for (const field of [
    'outcome',
    'metric',
    'window',
    'sample',
    'segment',
    'deployment',
    'cache',
  ]) {
    expect(first.toLowerCase()).toContain(field)
  }
  expect(first).toMatch(/too few|insufficient|too sparse/i)
  expect(first).toMatch(/controlled/i)
})

test('order response, payment, and consumers have separate clocks', () => {
  const map = section(doc(), 'Map the order journey')
  expect(map).toMatch(/request.+response/s)
  expect(map).toMatch(/webhook.+paid/s)
  expect(map).toContain('OrderPaid')
  for (const consumer of ['inventory', 'logistics', 'notification']) {
    expect(map.toLowerCase()).toContain(consumer)
  }
  expect(map).toMatch(/branch|fan.out/i)
  expect(map).toMatch(/provider.+wait|payment.+wait/i)
})
```

- [ ] **Step 2: Run RED.** From `web/` run `pnpm exec vitest run src/lib/stage-09-structure.test.ts`. Both tests must fail because the two new headings are absent. Paste the raw output into the task report and state that this is the expected reason.

- [ ] **Step 3: Replace the first two subsections of `## The work`.** Replace `### Measure, then fix, then measure` and `### Decide what fast enough means` with the three subsections below. Keep the current `### Find the real bottleneck` in place for Task 2 and the later fix catalog for Task 3. Adapt only line wrapping and existing cross-links:

````markdown
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
````

- [ ] **Step 4: Run GREEN and a teeth check.** Run the focused test. Then temporarily remove the sentence saying the consumers branch and confirm only the second new test fails. Restore the sentence and rerun both tests. Preserve all three outputs.
- [ ] **Step 5: Commit.** Stage only `web/src/lib/stage-09-structure.test.ts` and `docs/09-performance-optimization.md`. Commit as `docs(performance): teach first measurement of order flow` with the repository's Co-Authored-By trailer.

### Task 2: Diagnose one outcome and compare like for like

**Files:**
- Modify: `docs/09-performance-optimization.md:49–114`
- Modify: `web/src/lib/stage-09-structure.test.ts`

**Interfaces:**
- Consumes: Task 1's outcome, scope, and baseline fields.
- Produces: `### Find the real bottleneck` and a clearly illustrative before/after order-response example. Task 3 keeps the general fix catalog conditional.

- [ ] **Step 1: Append this failing test.**

```ts
test('the worked order fix is chosen from evidence and retested at the user boundary', () => {
  const md = doc()
  const diagnosis = section(md, 'Find the real bottleneck')
  expect(diagnosis).toContain('Illustrative example')
  expect(diagnosis).toContain('20-item cart')
  expect(diagnosis).toMatch(/21.+quer(y|ies)/s)
  expect(diagnosis).toMatch(/batch/i)
  expect(diagnosis).toMatch(/alternative|instead/i)
  expect(diagnosis).toMatch(/before.+after/is)
  expect(diagnosis).toContain('| Outcome | Place order → response | Same outcome |')
  expect(diagnosis).toMatch(/production/i)
  expect(diagnosis).toMatch(/correctness/i)
  expect(diagnosis).not.toContain('The database is usually the answer.')
})

test('a query plan is a diagnosis of one query, not the order-flow result', () => {
  const diagnosis = section(doc(), 'Find the real bottleneck')
  expect(diagnosis).toContain('EXPLAIN (ANALYZE, BUFFERS)')
  expect(diagnosis).toMatch(/single query|one query/i)
  expect(diagnosis).toMatch(/not.+p95/i)
  expect(diagnosis).toMatch(/sequential scan.+cheaper/is)
  expect(diagnosis).not.toContain('Seq Scan` on a large table means a missing index.')
})
```

- [ ] **Step 2: Run RED.** Run `pnpm exec vitest run src/lib/stage-09-structure.test.ts`. Confirm the new tests fail on missing worked evidence and plan scope; retain raw output.
- [ ] **Step 3: Replace `### Find the real bottleneck` with this prose.** The numbers are teaching data, not observations of a live app:

````markdown
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
````

- [ ] **Step 4: Run GREEN and a teeth check.** Run focused tests. Temporarily replace “Same outcome” with “Different outcome” and confirm only the new worked-case test fails; restore and rerun. Preserve outputs.
- [ ] **Step 5: Commit.** Stage only the chapter and its guard. Commit as `docs(performance): diagnose and retest order latency` with the required trailer.

### Task 3: Correct the fix catalog and completion standard

**Files:**
- Modify: `docs/09-performance-optimization.md:68–233`
- Modify: `web/src/lib/stage-09-structure.test.ts`
- Modify: `web/src/lib/stage-metadata.test.ts:45–65`

**Interfaces:**
- Consumes: the user outcome and diagnosis produced by Tasks 1–2.
- Produces: conditional fix guidance, `### AI in performance optimization`, and a Definition of done aligned with the measured outcome. No `stages.ts` readiness flip.

- [ ] **Step 1: Append these guards and add `'09-performance-optimization'` to `AI_SECTION_STAGES` in `stage-metadata.test.ts`.**

```ts
test('fixes remain hypotheses and indexing advice respects plan and write cost', () => {
  const md = doc()
  expect(md).toContain('### AI in performance optimization')
  expect(md).toMatch(/index.+write cost/is)
  expect(md).toMatch(/CONCURRENTLY.+transaction/is)
  expect(md).toMatch(/invalid index/i)
  expect(md).toMatch(/updateTag.+Server Action/is)
  expect(md).toMatch(/bundle analyzer/i)
  expect(md).toMatch(/LCP.+eager/is)
  expect(md).not.toContain('Every column you filter or sort by')
  expect(md).not.toContain('Indexes exist for every filtered and sorted column')
  expect(md).not.toContain('Anything at low traffic.')
  expect(md).not.toContain('pnpm build   # review the route-level output')
})

test('completion is tied to the selected outcome and includes correctness', () => {
  const md = doc()
  const done = md.split('## Definition of done')[1]?.split('\n## ')[0] ?? ''
  expect(done).toMatch(/same outcome/i)
  expect(done).toMatch(/before and after/i)
  expect(done).toMatch(/sample/i)
  expect(done).toMatch(/production|field/i)
  expect(done).toMatch(/correctness|tests/i)
})
```

- [ ] **Step 2: Run RED.** Run both `pnpm exec vitest run src/lib/stage-09-structure.test.ts src/lib/stage-metadata.test.ts`. The new guards must fail on existing absolutes and missing AI section; preserve raw output.
- [ ] **Step 3: Revise the catalog and finish the chapter.** Replace everything from `### The fixes that usually matter` through the end of the current `### Do not optimize these` section with the text below. Task 2's `### Find the real bottleneck` and SQL example stay in place. Remove the old schematic TypeScript fences in this replaced span; the prose names the exact API and its limits without pretending this repo has an order database. Keep the existing top-level section order.

```markdown
### The fixes that usually matter

These are candidates, not a ranking. Start with the evidence from the
affected outcome.

**Index or query shape.** A candidate index for an observed filter-and-sort
query can be `(owner_id, created_at DESC)`, but its value depends on the plan,
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
```

Replace `## Artifacts` and `## Definition of done` with these checkable records:

```markdown
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
```

In `## Traps`, replace the blanket low-traffic and index warnings with the measured-impact rule: low traffic can still carry a critical user journey, and an index is justified by a query plan and workload rather than its mere absence. Keep the original cache and memo cautions, but tie them to evidence. In `## Scaling to a team`, explain that a CI budget needs a named metric, threshold and representative run; a raw build result alone is not a bundle budget. Check the existing code fences against installed Next.js docs and label any remaining schematic fragment.

- [ ] **Step 4: Run GREEN and a teeth check.** Run the focused tests and the full `pnpm test` suite. Temporarily restore the old blanket index checkbox, confirm only the new fix-guard test fails, then remove it and rerun the focused suite. Preserve raw output.
- [ ] **Step 5: Commit.** Stage only the chapter and two test files. Commit as `docs(performance): correct optimization guidance and completion checks` with the required trailer.

## Verification (after all tasks)

1. Compare the chapter against every claim-audit row in `reference/stage-09-performance-sources.md` and the approved spec. Confirm that request, webhook and consumer clocks are never conflated, examples are marked illustrative, and the first measurement appears before any fix.
2. Give a cold reader only `docs/09-performance-optimization.md` and ask them to record a baseline for a different order scenario before choosing a fix. Resolve any blocking gap test-first.
3. Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` from `web/`. Run `pnpm test:e2e` only if rendered app content changes; the chapter-only round does not change the app. Record actual output and any environmental failure.
4. Run the `humanizer:humanizer` review over the chapter and this plan; accept edits that clarify the prose without flattening the playbook's voice.
5. Run a whole-branch read-only review. Fix Important findings test-first, rerun affected gates, and record the verdict. Update `docs/task.md` and `docs/tracker.md` with evidence, deferrals, Stage 09 still unready, and branch state. Commit records separately. Do not merge without the user's separate approval; do not push or merge to `main`.

The later interactive-port plan starts from the reviewed chapter. This plan does not change `ready` or W-3's 14/18 count.
