# 14. Post-Deployment Verification

> The deploy is not finished when it succeeds. It is finished when you have confirmed
> production is actually healthy.

**When this actually happens:** In the ten minutes after every production deploy. This is
the stage almost everyone skips, and skipping it is why so many bugs are discovered by
users rather than by the person who shipped them.

---

## Entry criteria

- [ ] The deploy succeeded ([13 — Production Deployment](13-production-deployment.md))
- [ ] You have access to logs, error tracking, and analytics
- [ ] You know what "normal" looks like — a baseline error rate and latency
      ([15 — Observability](15-observability.md))

That last one is the prerequisite people lack. Without a baseline, "12 errors in the last
hour" is unreadable. It could be a catastrophe or a Tuesday.

---

## The work

### Why this stage exists

"Deployment succeeded" means the build compiled and the files uploaded. It says nothing
about whether the application works. A successful deploy can still produce a page that
throws on load, an action that fails for logged-in users only, a query that times out at
production data volumes, or a missing environment variable that breaks one route.

None of that shows up in a deploy log. All of it shows up in the ten minutes after.

### The ten-minute check

**Minute 0–1: Is it up?**

Load the production URL. Not the deploy dashboard — the actual site, in a real browser.
Hard refresh to bypass your cache.

**Minute 1–3: Walk the critical path.**

Whatever the money path is — sign up, log in, checkout, create the core object. Do it as
a user. If you have a smoke test, run it now:

```bash
pnpm exec playwright test --grep @smoke --config=playwright.prod.ts
```

Smoke tests against production must be **read-mostly and idempotent**. They confirm pages
render, auth works, and key queries return. They must not create records that pollute
real data, and they must not be destructive. Use a dedicated test account.

**Minute 3–5: Check error rates.**

Open Sentry. You are looking for:

- Any *new* issue type first seen after this deploy — the strongest signal there is
- A rise in overall error volume against your baseline
- Errors mentioning files you just changed

A new error type appearing within minutes of a deploy is your change until proven
otherwise. Do not talk yourself out of that.

**Minute 5–7: Check latency and traffic.**

In Vercel analytics:

- Did p75 latency change? A deploy that doubles response time is a bad deploy even with
  zero errors.
- Is traffic still flowing? A sudden drop to zero means something is broken upstream of
  your error tracking — DNS, routing, a redirect loop.
- Any spike in 4xx or 5xx?

**Minute 7–10: Check the specific thing you shipped.**

Everything above was general health. Now verify the actual change did what it was
supposed to do, in production, with production data. If you shipped a new report, open
it and confirm the numbers are right. If you changed a payment flow, run a real
transaction if you can safely do so.

### Verify with production data volumes

The bug class previews cannot catch: a query that is instant against 50 seeded rows and
takes eight seconds against 5 million.

After deploying anything touching data access, check actual query timing in production.
Neon's dashboard shows slow queries; Sentry performance traces show the request-level
picture. A query that got slower is worth investigating *before* it becomes a timeout on
a busy Monday.

### When something is wrong

**Roll back first.** See [13](13-production-deployment.md). Do not diagnose a live
incident on production time. Revert, confirm the site recovers, then investigate on a
branch.

If it is genuinely broken rather than merely suspicious, you are now in
[16 — Incident Management](16-incident-management.md).

### The half-hour follow-up

Some problems are not immediate. Cache-related bugs surface as caches expire, cron-driven
failures surface on the next run, and memory leaks surface as instances stay warm.

Check back once at around thirty minutes. If error rates and latency are still at
baseline, the deploy is genuinely done.

### Automate what you repeat

Anything you check manually after every deploy should become a smoke test. The manual
list is the specification for the automated one.

But keep doing the manual walk-through for the specific change you shipped. Automation
covers what you already knew to check; your eyes catch what you did not.

---

## Artifacts

- A smoke test suite runnable against production
- A short verification checklist, adapted per change type
- Documented baselines for error rate and p75 latency

---

## Definition of done

- [ ] Production URL loads in a real browser
- [ ] Critical path walked manually or via smoke tests
- [ ] No new error types in Sentry since the deploy
- [ ] Error volume at baseline
- [ ] p75 latency at baseline
- [ ] Traffic still flowing normally
- [ ] The specific shipped change verified with production data
- [ ] Re-checked at ~30 minutes and still healthy

---

## Scaling to a team

- **The deployer verifies.** Ownership must not diffuse — "someone will check the
  dashboard" means nobody does.
- **Post results in a shared channel.** A short "deployed X, error rates normal, checked
  Y" builds a searchable history that is invaluable during later incidents.
- **Automated post-deploy checks with auto-rollback** become worthwhile once deploy
  frequency exceeds what humans can babysit. Vercel can gate promotion on checks passing.
- **Rotate who watches after hours** so one person is not permanently on the hook.

---

## Traps

**Treating "deploy succeeded" as done.** The build compiled. That is all you know.

**Verifying with a cached browser.** You load the page, it works, and you are looking at
the old build from your own cache. Hard refresh, or use a private window.

**Checking too early.** Vercel reports success before the CDN has fully propagated and
before enough traffic exists to be meaningful. Give it a minute or two.

**Having no baseline.** Without knowing normal, every number is unreadable, and you will
either panic at nothing or ignore something real.

**Destructive smoke tests.** A production smoke test that creates and deletes records
will eventually delete the wrong one. Read-mostly, idempotent, dedicated test account.

**Only checking the happy path.** The deploy broke the signed-out view, and you have been
logged in for six months.

**Skipping it because the change was trivial.** Trivial changes are the ones that ship
unverified, which is precisely why they show up disproportionately in incident
post-mortems.

**Checking once and walking away.** Cache and cron bugs need the thirty-minute follow-up.
