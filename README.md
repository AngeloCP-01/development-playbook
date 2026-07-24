# Development Playbook

My reference for building software. Eighteen stages, from "I have an idea" to "this has
been running in production for two years and still works."

This is a **reference, not a curriculum**. You do not read it front to back. You open the
stage you are standing in, read it, and get back to work.

---

## Start here

**"I don't know which doc I need."** Find your situation:

| Your situation | Go to |
|---|---|
| I have an idea and no code yet | [01 — Product Discovery](docs/01-product-discovery.md) |
| I know what to build, need to decide how | [03 — Architecture](docs/03-architecture.md) |
| Empty repo, ready to start | [04 — Project Setup](docs/04-project-setup.md) |
| Writing features day to day | [05 — Development](docs/05-development.md) |
| About to deploy for the first time | [12 — Staging](docs/12-staging.md) → [13 — Production Deployment](docs/13-production-deployment.md) |
| Just deployed, is it actually fine? | [14 — Post-Deployment Verification](docs/14-post-deployment-verification.md) |
| Something is broken in production **right now** | [16 — Incident Management](docs/16-incident-management.md) |
| It works but it's slow | [09 — Performance Optimization](docs/09-performance-optimization.md) |
| Inherited a project, want to assess it | [08 — Security Audit](docs/08-security-audit.md) + [17 — Maintenance](docs/17-maintenance.md) |
| Shipped, deciding what's next | [18 — Continuous Improvement](docs/18-continuous-improvement.md) |

**"What tools does this assume?"** → [reference/stack.md](reference/stack.md)
**"What does that word mean?"** → [reference/glossary.md](reference/glossary.md)

---

## The numbering is for lookup, not sequence

Read this once. It is the most important thing on this page.

The stages are numbered so you can find them, **not so you can execute them in order**.
Treating the list as a sequence produces waterfall, which is not how any of this works.
Specifically:

- **CI/CD (11)** is wired during **Project Setup (04)**, on day one. A merge gate you add
  in month six is a merge gate you will spend month six fighting.
- **Documentation (10)** and **Observability (15)** are continuous. They are numbered
  as stages because they need dedicated treatment, not because they happen once.
- **Testing (06)** happens *before* the code in most cases, not after. It is numbered
  after Development because that is where people look for it.
- **Stages 01–03** are revisited every time you add a significant feature. You are not
  done with Architecture just because you shipped once.
- **Stages 13–18** form a loop, not a line. Deploy → verify → observe → improve → deploy.

Each doc opens with a **"When this actually happens"** line stating its real timing.
Trust that line over the number.

---

## All stages

### Before code
1. [Product Discovery](docs/01-product-discovery.md) — what problem, for whom, and is it worth solving
2. [Planning](docs/02-planning.md) — scope, sequence, and what you are deliberately not doing
3. [Architecture](docs/03-architecture.md) — the decisions that are expensive to reverse

### Building
4. [Project Setup](docs/04-project-setup.md) — repo, tooling, CI, and the first deploy
5. [Development](docs/05-development.md) — the daily loop
6. [Testing](docs/06-testing.md) — what to test, at which level, and what to skip
7. [Code Review](docs/07-code-review.md) — including how to review your own work
8. [Security Audit](docs/08-security-audit.md) — the threats that actually apply
9. [Performance Optimization](docs/09-performance-optimization.md) — measure, then fix
10. [Documentation](docs/10-documentation.md) — what to write and what rots

### Shipping
11. [CI/CD](docs/11-ci-cd.md) — the automated gate
12. [Staging](docs/12-staging.md) — preview deploys and what they can't tell you
13. [Production Deployment](docs/13-production-deployment.md) — shipping safely
14. [Post-Deployment Verification](docs/14-post-deployment-verification.md) — the stage most people skip

### Running
15. [Observability](docs/15-observability.md) — knowing what production is doing
16. [Incident Management](docs/16-incident-management.md) — when it breaks
17. [Maintenance](docs/17-maintenance.md) — keeping it healthy
18. [Continuous Improvement](docs/18-continuous-improvement.md) — deciding what's next

---

## How each doc is structured

Every stage doc has the same seven sections, so you can jump straight to what you need:

| Section | What's in it |
|---|---|
| **When this actually happens** | Real timing, which is often not the stage number |
| **Entry criteria** | What must be true before starting |
| **The work** | The opinionated core — real commands, real config |
| **Artifacts** | What exists when you're done |
| **Definition of done** | A checklist you can actually tick |
| **Scaling to a team** | What changes at 2–5 engineers |
| **Traps** | Failure modes worth naming |

The baseline assumption is **solo but production-grade**: you are the only engineer, but
something real depends on the software. Team ceremony is skipped; rigor is not.

---

## On Post-Deployment Verification

Worth calling out because it is the stage almost everyone omits. Most people stop at
"deployed." But the deploy is not finished until you have checked logs, error rates,
health endpoints, and at least one critical user flow **in production**. Until then you
have not shipped a feature — you have started an experiment and walked away from it.

That is what [stage 14](docs/14-post-deployment-verification.md) is for.

---

## This repository

The playbook ships in two forms from one body of content:

- **`docs/NN-*.md`** — the eighteen stage documents. Canonical prose, readable here.
- **`web/`** — an interactive version: a stepper per stage, exercises, numbered
  figures, and inline definitions for unfamiliar terms. Stage 01 is built; the rest
  render a placeholder until their turn.

The project practises what the documents preach, and records itself doing it:

| File | Holds |
|---|---|
| [`docs/task.md`](docs/task.md) | Scope, milestones, dependency map |
| [`docs/tracker.md`](docs/tracker.md) | What shipped with evidence, decisions, technical debt, bug ledger |
| [`docs/superpowers/`](docs/superpowers/README.md) | Specs and plans from the delivery loop |
| [`docs/learnings/`](docs/learnings/README.md) | Guides written when a round taught something expensive |
| [`web/DESIGN.md`](web/DESIGN.md) · [`web/PATTERNS.md`](web/PATTERNS.md) | The design system and the interaction-pattern library |
| [`CLAUDE.md`](CLAUDE.md) | The working conventions: git, delivery loop, review, TDD |

When the project and a stage doc disagree, one of them is wrong and the tracker gets a
debt entry until they agree again. That loop — build, notice the drift, amend the doc —
is the point.

## Maintaining this playbook

- **Versions live in [reference/stack.md](reference/stack.md), nowhere else.** A version
  number in a stage doc is a bug.
- **The Traps sections are the point.** Every time something bites you in a real project,
  add it to the relevant Traps section. That is what turns this from generic advice into
  *your* playbook.
- **Delete what you don't use.** Advice you have skipped three times in a row is not
  advice, it is clutter.
