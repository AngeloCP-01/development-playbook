# 10. Documentation

> Write down what code cannot say: why. Everything else rots.

**When this actually happens:** Continuously. A little with every change, not as a phase
before launch. Documentation written in a dedicated push at the end is documentation
written when you have forgotten the reasons.

---

## Entry criteria

None. This runs alongside everything else.

---

## The work

### The rule

**Code says what. Documentation says why.**

A comment restating the code is worse than no comment, because it adds a second thing
that can drift out of date — and it will, silently.

```ts
// Bad: says what the code already says
// Increment the retry count
retries += 1

// Good: says what the code cannot
// Stripe's webhook delivery retries for up to 3 days, so we can be
// patient here. Anything past 5 attempts means our handler is broken,
// not that Stripe is being slow.
if (retries > 5) await alertOncall()
```

The second comment survives refactoring because it documents a constraint from outside
the codebase. The first one is deleted the moment the line changes.

### Document decisions, not descriptions

Descriptions of how the system works rot on contact with the next refactor. Records of
*why you chose something* stay true forever, because the decision was made at a fixed
point in time under fixed constraints.

That is what an ADR captures:

```markdown
# ADR 004: Drizzle over Prisma

**Date:** 2026-03-14
**Status:** Accepted

## Context
We need typed database access with migrations. Prisma is the default
choice; Drizzle is the main alternative.

## Decision
Drizzle.

## Reasoning
- Migrations are SQL files we read and commit. When something breaks in
  production we debug SQL, not the ORM's intentions.
- No separate schema language or generation step in the build.
- Closer to SQL, so query optimization is direct ([09](09-performance-optimization.md)).

## Consequences
- More verbose for simple queries than Prisma.
- Smaller ecosystem; fewer answers when stuck.
- Team members who know Prisma need a short ramp-up.

## Alternatives considered
- **Prisma** — better DX, but the generation step and query engine add
  opacity we did not want at this size.
- **Raw SQL + Zod** — maximum control, too much boilerplate.
```

Write it when the decision is made, while the alternatives are still fresh. Never edit an
accepted ADR — supersede it with a new one. The record of what you believed at the time
is the value; editing it destroys exactly that.

Number them sequentially in `docs/adr/`. Write one for anything expensive to reverse:
database choice, auth strategy, hosting, major dependencies, architectural boundaries.

### The README

The most-read and most-neglected document. Four sections:

```markdown
# Project Name

One paragraph: what this is and who it is for. Understandable by
someone with no context, including you at 2am in eight months.

## Running locally
Exact commands. Prerequisites. Env vars — point at `.env.example`.
Someone should get from clone to running app without asking anyone.

## Architecture
A short paragraph and, if useful, one diagram. Not exhaustive — enough
to orient. Link to ADRs for the reasoning.

## Deploying
How code reaches production. How to roll back. Where the logs are.
Who to contact when it is on fire.
```

That last section is what you will want at 3am, when you are least capable of working it
out from first principles.

### Comments worth writing

**Non-obvious constraints.**
```ts
// Stripe caps metadata values at 500 characters. Longer values are
// silently truncated, which caused a silent data-loss bug in Feb.
```

**Deliberate deviations from the obvious approach.**
```ts
// Deliberately not using a transaction. The webhook can be delivered
// twice, and the upsert is idempotent; a transaction here caused lock
// contention under load.
```

**Genuinely tricky logic**, where the reader will otherwise assume it is a mistake.
```ts
// Off-by-one is intentional: the API's date ranges are inclusive on
// both ends, unlike ours.
```

**Known limitations.**
```ts
// Only handles the first 1000 results. Fine today (max observed: 40);
// revisit if that changes.
```

### Documentation that maintains itself

The best documentation cannot drift, because it is executable or enforced:

- **Types.** A well-named type documents shape better than prose, and the compiler keeps
  it honest.
- **Tests.** They describe intended behavior and fail when the description stops matching
  ([06](06-testing.md)).
- **`.env.example`.** Documents required configuration, and the app stops booting when it
  drifts ([04](04-project-setup.md)).
- **Good names.** `retryUntilStripeConfirms` needs no comment. Renaming is often the
  correct alternative to explaining.

Prefer these over prose wherever the choice exists.

### What not to write

- **Comments restating code.** Noise that rots.
- **Documentation of obvious functions.** A JSDoc block on `getUserById` explaining that
  it gets a user by ID is pure cost.
- **Exhaustive API docs by hand.** Generate them, or skip them.
- **Long architecture documents** describing current structure in detail. They are wrong
  within a month. Describe boundaries and reasoning; leave details to the code.
- **Anything you will not maintain.** Wrong documentation is worse than none — people
  trust it and act on it.

### Commit messages are documentation

`git log` is the highest-density record of why the codebase looks like this. Treat the
body as documentation with a permanent home that cannot drift from the change it
describes. See [05 — Development](05-development.md#commits-and-branches).

---

## Artifacts

- `README.md` — what, run, architecture, deploy
- `docs/adr/NNN-title.md` — one per significant decision
- `.env.example` — every key, no values
- Comments explaining constraints and reasoning, not mechanics

---

## Definition of done

Ongoing, but for each change:

- [ ] Non-obvious decisions have an ADR or a comment explaining why
- [ ] New env vars are in `.env.example`
- [ ] README still accurate if setup or deploy changed
- [ ] No comments that merely restate code
- [ ] Commit body explains why

Periodically:

- [ ] A fresh clone can be run using only the README
- [ ] No documentation describes things that no longer exist

---

## Scaling to a team

- **The README becomes onboarding.** Have the next person set up from it and note every
  point they got stuck. Those notes are the fix list.
- **ADRs get much more valuable** — they stop the same debate recurring every six months
  with a new participant.
- **Add `CONTRIBUTING.md`** for conventions, branch naming, review expectations.
- **Assign ownership per area.** Unowned documentation rots fastest.
- **Document the on-call runbook** before you need it ([16](16-incident-management.md)).

---

## Traps

**Writing docs as a phase before launch.** By then you have forgotten the reasoning, which
was the only part worth capturing.

**Documenting what instead of why.** The what is in the code, is more accurate there, and
cannot drift.

**Editing accepted ADRs.** Supersede instead. The historical record is the point.

**Architecture documents that describe structure.** Obsolete in a month. Document
boundaries and reasoning.

**Trusting stale documentation.** Wrong docs cause worse outcomes than missing docs,
because people act on them confidently. Delete aggressively.

**Skipping the rollback section in the README.** The single line you will most want at
3am and be least able to reconstruct.

**Writing prose where a type or a rename would do.** Prose rots; types do not.
