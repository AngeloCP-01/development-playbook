# Glossary

Terms used across the stage docs, defined once. Only terms that are genuinely ambiguous
or that this playbook uses in a specific way — not a dictionary of web development.

---

**ADR (Architecture Decision Record)** — A short document capturing one decision: the
context, the choice, and the consequences. Written when the decision is made, never
edited afterward. Superseded by a new ADR rather than revised. See
[03 — Architecture](../docs/03-architecture.md).

**Blast radius** — How much breaks when this breaks. A change with a small blast radius
can be shipped casually; a large one cannot.

**Canary** — Releasing to a small fraction of traffic before everyone. On Vercel this is
approximated with skew protection and staged rollouts rather than true traffic splitting.

**Definition of done** — The checklist that separates "the code works on my machine" from
"this stage is complete." Every stage doc has one. It is not optional and not a
suggestion.

**Error budget** — The amount of failure you have decided is acceptable in a period. If
your target is 99.9% uptime, your monthly budget is roughly 43 minutes. Spending it is
allowed; that is what a budget is. Exceeding it means stop shipping features and fix
reliability.

**Golden signals** — Latency, traffic, errors, saturation. If you instrument only four
things, instrument these. See [15 — Observability](../docs/15-observability.md).

**Merge gate** — The set of automated checks that must pass before code reaches the main
branch. Distinct from deployment: the gate protects the branch, the deploy ships it.

**Phantom dependency** — A package your code imports but never declared in
`package.json`. It works only because some *other* dependency happened to pull it into a
flat `node_modules` — and it breaks, mysteriously, when that other package updates or
drops it. The reason [reference/stack.md](stack.md) picks pnpm: its strict layout makes
phantom imports fail on your machine today instead of in CI next month.

**Preview deployment** — A full, isolated deployment of a branch, with its own URL. On
Vercel these are automatic per pull request. Not the same as staging — see
[12 — Staging](../docs/12-staging.md).

**Production-grade** — Someone other than you depends on it working. This is the baseline
assumption of the whole playbook, and it is about consequences, not scale. Ten users who
are paying makes software production-grade; ten thousand users on a toy does not.

**Rollback** — Returning production to the previous known-good state. On Vercel this is
promoting a prior deployment, which takes seconds. Rollback is *not* automatic for
database migrations — that asymmetry is why migrations get their own careful treatment in
[13 — Production Deployment](../docs/13-production-deployment.md).

**Skew protection** — Ensuring a browser running old client JavaScript can still talk to
the server after a new deploy. Without it, users mid-session get errors every time you
ship.

**Smoke test** — A small set of checks confirming the critical paths work after a deploy.
Not comprehensive by design; it answers "is this catastrophically broken?" in under a
minute.

**SLO (Service Level Objective)** — The reliability target you commit to, e.g. "99.9% of
requests succeed." Meaningful only if you have decided what happens when you miss it.

**Spike** — A timeboxed investigation to answer a specific question, thrown away
afterward. The output is knowledge, not code. If you are keeping the code, it was not a
spike.

**Traps** — The last section of every stage doc: failure modes worth naming. These
accumulate from real experience and are the most valuable part of the playbook over time.

**Vertical slice** — A feature built through every layer — schema, server, UI — rather
than one layer built completely across all features. The default way to sequence work in
[02 — Planning](../docs/02-planning.md), because it produces something demonstrable early.

**YAGNI (You Aren't Gonna Need It)** — Do not build for requirements you have imagined
rather than encountered. The most common cause of accidental complexity, and the reason
half the advice in this playbook is about *not* doing things.
