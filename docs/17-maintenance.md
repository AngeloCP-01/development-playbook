# 17. Maintenance

> Keep the software healthy so that changing it stays cheap. Neglect compounds quietly,
> and then all at once.

**When this actually happens:** Continuously, in small amounts. A regular hour beats an
emergency week, and the emergency week is what you get if you skip the hour.

---

## Entry criteria

- [ ] The application is in production with real users
- [ ] You intend to keep working on it

---

## The work

### Why this stage exists

Software rots even when untouched. Dependencies accumulate vulnerabilities, certificates
expire, APIs get deprecated, data grows past what queries were designed for, and the
assumptions you built on stop being true.

The cost of neglect is not linear. Skip updates for a year and you are not behind by a
year of small changes — you are facing several major version jumps at once, each with
breaking changes, with no way to isolate which one broke things.

### A weekly rhythm

Thirty minutes, one regular slot:

**Dependency updates.** Dependabot has grouped them ([11](11-ci-cd.md)). Dev dependencies
with green CI merge without much thought. Production minors get a changelog skim. Majors
get their own session.

**Error triage.** Open Sentry. New issues since last week get one of three dispositions:
fix, ignore deliberately, or file for later. Errors that sit unread for months train you
to stop looking, and then you stop noticing real ones.

**Metric glance.** Error rate, p95 latency, traffic ([15](15-observability.md)). You are
looking for slow drift, not spikes — spikes alert; drift does not. Latency creeping from
200ms to 600ms over three months never triggers an alert and is a real degradation.

**Database health.** Table growth, slow query log, index usage. A table growing faster
than expected is worth understanding before it becomes a problem.

### Major version upgrades

One at a time, in their own PR, never bundled.

```bash
pnpm add next@latest react@latest react-dom@latest
```

Read the migration guide properly, run codemods where provided, and expect to spend real
time. Bundling two majors means that when something breaks you cannot tell which one did
it.

Frameworks in particular reward staying reasonably current. Falling three majors behind
turns a routine upgrade into a project, and unsupported versions stop receiving security
patches.

### Certificate and credential expiry

The classic 3am outage with no deploy to blame.

Keep a list of everything that expires — API keys with rotation policies, OAuth client
secrets, signing certificates, domain registrations, third-party subscriptions — with
calendar reminders two weeks ahead.

Vercel handles TLS automatically. Everything else is on you, and none of it warns you
except by breaking.

### Data growth

What is fast on 10,000 rows may not be on 10 million.

Watch for tables growing faster than expected, queries whose plans have changed as data
grew, and unbounded tables like logs, sessions, and events that nothing ever deletes from.

Decide retention deliberately:

```sql
-- Runs nightly. Sessions past 90 days serve no purpose.
DELETE FROM sessions WHERE expires_at < now() - interval '90 days';
```

Unbounded growth is a slow-motion outage. It costs money for years and then one day the
query that scans that table times out.

### Paying down debt

Technical debt is not sloppy code — it is deliberate shortcuts taken for speed, and taking
them is often correct. The failure is never paying them back.

Fix debt **when you are already in the code**. The refactor you do while implementing a
nearby feature is nearly free; the standalone refactoring project is expensive, risky, and
gets deprioritized forever.

Signals worth acting on:

- A file you dread opening
- A change requiring edits in four unrelated places
- A bug fixed three times in the same area
- A comment saying "don't touch this"

That third one is the strongest. A recurring bug means the fix is treating symptoms and
the design is wrong.

**Do not refactor without tests.** Refactoring means changing structure without changing
behavior, and without tests you cannot know whether behavior changed
([06](06-testing.md)).

### Deleting things

The most underrated maintenance activity. Every line you delete is a line that cannot
break, cannot be misunderstood, and does not need updating.

Delete: unused features, dead code paths, stale feature flags
([13](13-production-deployment.md)), unused dependencies, obsolete documentation
([10](10-documentation.md)), tests for deleted features.

Check usage before assuming a feature is used. Analytics frequently reveal that a feature
you have been maintaining for two years has three users, none of whom would notice its
removal.

Version control means deletion is not destruction. Delete confidently.

### Backups you have actually restored

An untested backup is a hypothesis about a backup.

Neon does automated backups and point-in-time recovery. That is not the question. The
question is whether you have ever restored one.

Once, deliberately: restore to a scratch branch, verify the data is intact and current
enough. Note how long it took — that number is your actual recovery time, and it is
usually longer than assumed.

Do this before you need it, not during
[16 — Incident Management](16-incident-management.md).

---

## Artifacts

- A weekly maintenance slot that actually happens
- An expiry calendar for certificates, keys, and subscriptions
- Retention policies on growing tables
- A verified restore, with the timing recorded
- A debt list, addressed opportunistically

---

## Definition of done

Ongoing. Monthly, confirm:

- [ ] Dependencies updated; no unaddressed high-severity vulnerabilities
- [ ] Sentry triaged to zero unreviewed issues
- [ ] No unexplained drift in error rate or latency
- [ ] No table growing without a retention policy
- [ ] Nothing expiring in the next 30 days without a reminder
- [ ] Backup restore verified within the last quarter
- [ ] Dead code and stale flags removed

---

## Scaling to a team

- **Assign ownership.** Unowned maintenance is nobody's maintenance — everyone assumes it
  is handled.
- **Rotate the maintenance slot** so it is shared rather than absorbed by whoever cares
  most.
- **Budget time explicitly.** Roughly 20% of capacity. Maintenance that competes with
  feature work loses every sprint, until it stops competing and starts causing incidents.
- **Track debt visibly** so it is a shared cost rather than one person's frustration.
- **Document tribal knowledge.** Solo, "I know why that is weird" is fine. With a team it
  is a bottleneck.

---

## Traps

**Batching updates.** A year of deferred updates is not one large task; it is several
simultaneous breaking changes with no way to bisect.

**Refactoring without tests.** You cannot verify behavior is unchanged, so you are not
refactoring — you are rewriting and hoping.

**Standalone refactoring projects.** Expensive, risky, and perpetually deprioritized. Fix
code you are already touching.

**Ignoring Sentry.** Unread errors accumulate until you stop looking entirely, and then a
real one arrives unnoticed.

**Unbounded tables.** Sessions, logs, and events grow forever unless something deletes
them. Slow-motion outage.

**Untested backups.** Discovering your restore is broken during an incident is the worst
possible time to discover it.

**Keeping features nobody uses.** Every one costs maintenance, constrains changes, and
adds surface area. Check the analytics, then delete.

**Treating maintenance as optional.** It is not deferred — it is accrued, with interest,
and paid eventually as an incident rather than an hour.
