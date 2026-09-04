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

### Vercel: where to look

The ten-minute check above is platform-agnostic. On Vercel, the specific tools are:

- **Vercel Analytics** — p75 latency and traffic volume, filterable by route. A deploy
  that doubles p75 on one route is a bad deploy even with zero errors.
- **Deployment URL** — `https://<project>-<hash>.vercel.app` is the immutable deployment
  URL. Load it directly to confirm the right build is live, not a cached older version.
- **Sentry, filtered by release** — tag releases with the deployment ID
  (`VERCEL_DEPLOYMENT_ID` is available at build time). Filter by release to isolate
  errors from this deploy versus background noise.
- **`pnpm test:prod`** — the `@smoke` suite pointed at the live URL. The same critical
  path you would walk manually, automated so it runs the same way every time.

### AWS: where to look

On ECS/Fargate, "is it up" requires checking three layers — the ECS service, the load
balancer, and the application logs. The commands, in order:

**1. Wait for the service to stabilize.**

```bash
aws ecs wait services-stable --cluster <cluster> --services <service>
```

Polls every 15 seconds, times out after ~10 minutes. A timeout means tasks are
failing to start or failing health checks — check the events next.

**2. Verify the deployment completed.**

```bash
aws ecs describe-services --cluster <cluster> --services <service> \
  --query 'services[0].deployments[*].[status,rolloutState,runningCount,desiredCount,failedTasks]' \
  --output table
```

You want exactly one `PRIMARY` deployment with `rolloutState: COMPLETED`,
`runningCount` matching `desiredCount`, and `failedTasks: 0`. Two `PRIMARY` entries
means an older deployment is still draining.

**3. Check ALB target health.**

```bash
aws elbv2 describe-target-health --target-group-arn <tg-arn>
```

Every registered target should report `State: healthy`. This is the check
`wait services-stable` does not do reliably for new service
creations — always run it separately.

**4. Read the recent service events.**

```bash
aws ecs describe-services --cluster <cluster> --services <service> \
  --query 'services[0].events[0:5].[createdAt,message]' --output table
```

Look for the steady-state message: `"has reached a steady state."` Repeated
task-stop-and-restart events mean something is crashing on startup.

**5. Check container health.**

```bash
aws ecs describe-tasks --cluster <cluster> --tasks <task-id> \
  --query 'tasks[0].containers[*].[name,lastStatus,healthStatus,reason]'
```

`healthStatus: HEALTHY` on every container. This is the Docker-level health check,
distinct from ALB target health — both must pass.

**6. Inspect logs for error bursts.**

```bash
aws logs tail /ecs/<log-group> --since 15m --follow
aws logs filter-log-events --log-group-name /ecs/<log-group> --filter-pattern "ERROR"
```

If you have deployment alarms configured (see
[13 — Production Deployment](13-production-deployment.md)), ECS watches these
CloudWatch metrics during a bake period after the new tasks go healthy. The key
metrics: `HTTPCode_ELB_5XX_Count`, `TargetResponseTime`, `CPUUtilization`,
`MemoryUtilization`. If an alarm fires during the bake window, ECS marks the
deployment `FAILED` and can auto-rollback to the previous task definition. An alarm
already in `ALARM` state before the deploy starts is ignored for that deployment, so a
pre-existing incident does not block a fix.

### When something is wrong

**Roll back first.** See [13](13-production-deployment.md). Do not diagnose a live
incident on production time. Revert, confirm the site recovers, then investigate on a
branch.

Four failure patterns that look like code bugs but are not:

- **Environment variable misconfiguration.** A variable set in staging but missing in
  production, or set to the wrong value. The deploy succeeds, the build compiled, but a
  third-party integration silently fails because the key is blank.
- **Partial migration state.** The expand step ran, the migrate step did not. New code
  reads from the new column; old data is still in the old one. Everything works for new
  records and breaks for existing ones.
- **Cold caches.** The new deployment starts with empty caches. A query that was instant
  against warm caches now hits the database for every request until the cache fills. The
  spike is real, but it is transient — wait before rolling back if latency is elevated
  but error rates are flat.
- **Wrong feature flag defaults.** A flag defaults to `true` in development and `false`
  in production, or vice versa. The feature works in preview and is invisible in
  production. Check flag values in the production environment, not just flag existence.

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

### AI in post-deployment verification

An agent is good at the mechanical parts of verification — running commands, parsing
output, comparing numbers to a baseline — because the rules are explicit. It is bad at
the judgment that sits on top: whether a metric that changed is a problem or expected,
whether the absence of an error is itself suspicious, whether production traffic patterns
expose a bug class that never appeared in preview.

Where it earns its place:

- **Generate a smoke test suite from a manual checklist.** Describe the critical path you
  walk after every deploy — load homepage, sign in, create a record, check the dashboard
  — and the agent writes a Playwright `@smoke` suite that does it. Review the assertions;
  a smoke test with no assertions is a page-load test. (A prompt.)
- **Parse Sentry or CloudWatch for anomaly patterns.** Paste the post-deploy error list
  and ask the agent to group by type, flag anything first-seen-after-this-deploy, and
  compare error volume to the baseline you give it. Faster than scanning a dashboard when
  the list is long. (A prompt.)
- **Run the ten-minute check against a deployed URL.** `claude-in-chrome` or `playwright`
  can load the production URL, walk the critical path, and screenshot each step. The
  agent catches a broken page, a missing element, a console error. It does not catch
  "this feels slower" or "that number looks wrong." (A CLI + MCP command.)
- **Compare CloudWatch metrics to a stored baseline.** Give the agent the baseline
  numbers (p75 latency, error rate, request count) and the current numbers from
  `aws cloudwatch get-metric-statistics`. It flags anything outside the threshold you
  define. The threshold is yours; the arithmetic is the agent's. (A prompt.)

An agent that reports "no new errors" cannot see the error that *should* be there but is
not — a silent failure, a dropped webhook, traffic that stopped arriving. The half-hour
follow-up exists because some problems need a human who notices what is absent.

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
- [ ] On AWS: ECS `rolloutState: COMPLETED`, `runningCount` matches `desiredCount`
- [ ] On AWS: all ALB targets report `State: healthy`
- [ ] On AWS: CloudWatch deployment alarms stayed in OK through the bake period
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

**Trusting `services-stable` alone on AWS.** `aws ecs wait services-stable` checks that
`runningCount` matches `desiredCount`. It does not verify that ALB targets are healthy —
a service can be "stable" with all tasks running and all of them failing health checks.
Always run `describe-target-health` separately.

**No deployment alarms configured.** ECS reports the deployment succeeded. Meanwhile,
CloudWatch shows a 5XX spike that nobody is watching because no alarm was wired to the
deployment. The deployment circuit breaker only fires if you give it alarms to check.

**Bake time too short.** The deployment alarm bake period ends before slow-onset problems
surface — a memory leak that takes fifteen minutes, a cache that expires after ten. If
the bake window is shorter than the problem's onset time, the alarm never fires and the
deployment is marked `COMPLETED` with a live defect.

---

## References

1. [Smoke Testing — AltexSoft](https://www.altexsoft.com/blog/smoke-testing/) — smoke
   vs. sanity vs. regression testing; what makes a good smoke suite (5–10 critical-path
   scenarios, unambiguous pass/fail)
2. [Post-Deployment Monitoring Checklist — PingSLA](https://pingsla.com/blog/post-deployment-monitoring-checklist/)
   — monitoring timeline (first 15–20 minutes at highest risk), alerting thresholds,
   common failure patterns by frequency
3. [How CloudWatch Alarms Detect ECS Deployment Failures — AWS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-alarm-failure.html)
   — deployment alarm integration, bake time, auto-rollback on alarm
4. [ECS Describe Services — AWS CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/ecs/describe-services.html)
   — `rolloutState`, deployment status, service events
5. [Troubleshoot ECS Tasks Failing ALB Health Checks — AWS re:Post](https://repost.aws/knowledge-center/troubleshoot-unhealthy-checks-ecs)
   — when ALB health checks fail post-deploy, diagnostic steps
