# 03. Architecture

> Make the decisions that are expensive to reverse. Defer everything else.

**When this actually happens:** After [02 — Planning](02-planning.md), before
[04 — Project Setup](04-project-setup.md). Revisited whenever a change strains the current
structure — which is a signal, not a failure.

---

## Entry criteria

- [ ] A plan with defined scope and vertical slices ([02](02-planning.md))
- [ ] You know roughly what data the system holds
- [ ] You know the non-negotiable constraints (compliance, latency, budget, existing
      systems)

---

## The work

### Sort decisions by reversibility

The only architecture question that matters up front: **how expensive is this to undo?**

**Expensive — decide carefully now:**
- The data model
- Authentication and authorization strategy
- Whether state lives in one service or several
- Anything writing to a persistent store that other things read

**Cheap — decide later, casually:**
- Component library, styling approach
- Folder naming
- Which logging library
- Almost every UI decision

Spend your thinking on the first list. The second list is reversible in an afternoon, and
deliberating over it is a comfortable way to avoid the hard part.

The failure mode: agonizing over folder structure while the data model — which will still
be shaping the codebase in three years — gets chosen in ten minutes.

### Model the domain first

The data model is the highest-stakes decision you will make. It outlives every framework
choice, because migrating data is hard and migrating code is not.

Work in nouns and relationships, before tables:

```
A User has many Clients.
A Client has many Invoices.
An Invoice has many LineItems.
An Invoice has a status: draft | sent | paid | overdue.
```

Then interrogate it with the questions that reveal design errors early:

**Is "overdue" a status or a computed value?** If it is stored, something must update it —
a cron job, a trigger, a write on read. If it is computed from `due_date < now() AND
status = 'sent'`, it is always correct and cannot drift. **Computed, here.** Storing
derived state is one of the most common sources of data that disagrees with itself.

**What happens when an invoice is deleted?** Hard delete loses history. Soft delete keeps
it but every query must remember to filter. For financial records, you almost certainly
want soft delete or an immutable ledger — because "where did that invoice go" is a much
worse conversation than a slightly more complex query.

**Can a client belong to two users?** If yes now or plausibly later, the join is a table,
not a foreign key. Retrofitting many-to-many onto a one-to-many is a migration plus every
query that touched it.

**What must be unique, and in what scope?** Invoice numbers unique per user, not globally.
Getting this wrong surfaces as a confusing constraint violation months later.

Encode these as **database constraints**, not application checks. Application code has
bugs, gets bypassed by scripts, and races with itself. The database is the last line that
actually holds.

```sql
CREATE TABLE invoices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  client_id    uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  number       text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  due_date     date NOT NULL,
  status       text NOT NULL CHECK (status IN ('draft','sent','paid')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, number)
);
```

Money as integer cents. `CHECK` constraints for anything with a fixed set of values.
`ON DELETE RESTRICT` so deleting a user with invoices fails loudly instead of quietly
cascading away financial history.

### Start with one application

For a solo project, the default architecture is **a single Next.js application with a
Postgres database.** Not microservices, not a separate API, not a queue, not an event bus.

This is not a compromise. It is the correct choice, because:

- Everything runs in one process locally
- One deployment, one place to look when it breaks
- No network boundary between your own code
- Refactoring across the whole system is a rename

Distributed systems solve problems you do not have: independent team scaling, independent
deployment cadence, per-service resource scaling. Adopting them early means paying every
cost — network failure modes, distributed debugging, deployment coordination, data
consistency — for benefits you cannot use.

**Split something out when there is a concrete reason:**

- Work exceeding function execution limits → a queue and a worker
- A genuinely different runtime requirement (Python for ML) → a service behind HTTP
- A component whose load profile is wildly different and provably expensive
- A real compliance boundary requiring isolation

"It will scale better" is not a reason. It is a prediction, and usually a wrong one.

### Boundaries inside the monolith

Structure inside one application is what makes splitting possible *later*, cheaply. Draw
boundaries between features and keep them honest:

```
src/features/billing/     # owns invoices, line items, payment state
src/features/clients/     # owns client records
src/features/auth/        # owns sessions, users
```

The rule: **features talk through exported functions, never by reaching into each other's
internals.** If `clients` needs invoice data, it calls `billing.getInvoicesForClient()`.
It does not query the `invoices` table directly.

That single rule is what keeps a monolith from becoming a big ball of mud, and it is
what makes extracting a service later a mechanical job rather than an archaeology
project.

### Authentication: decide early, deliberately

Auth touches the data model, every route, and every query. Changing it later is a
migration of user records plus a rewrite of every access check.

- **Rolling your own session auth** — viable for simple email/password, genuinely risky
  if you get it wrong, and you probably will in at least one place.
- **A managed provider (Clerk, Auth0)** — fastest to correct, costs money, and puts user
  identity in someone else's system.
- **A library (Auth.js)** — middle ground: your database, standard implementations.

Whatever you choose, write the ADR — the architecture decision record, covered below. This
is exactly the decision that gets relitigated in six months by someone who has forgotten
the constraints.

The part people get wrong is not authentication but **authorization**: deciding whether this
caller may do this thing to this record. It comes in three patterns, and the mistake is
assuming there is only one.

| Pattern | The question it asks | Where it holds |
|---|---|---|
| **Ownership** | Does this row carry the caller's id? | A user's own invoices, drafts, notes |
| **Role** | Does this caller hold a role that grants the action? | A manager approving someone else's request |
| **Membership** | Do the caller and the row belong to the same group? | Anything with a shared workspace or team |

Ownership is the one everybody reaches for, and it is the one that fails quietly. It is
correct for a product where each person works on their own things, which makes it feel
general — until the first feature where somebody acts on a record they do not own. A manager
approving a shift swap between two other people owns none of the three rows involved.

So the decision is not which pattern to use. It is **which pattern applies to which
entity**, written down per entity, because a system with a shared workspace will use all
three. Getting this wrong is not an error you find later; it is a system that works
correctly for the person who built it and leaks for everyone else.

Enforcement — where the check physically goes, and what happens when a route forgets — is
stage 05's, in
[05 — Development](05-development.md#server-actions-need-validation-and-authorization).

### Write the ADRs

For each expensive decision: context, choice, reasoning, consequences, alternatives.
Format and rationale in [10 — Documentation](10-documentation.md#document-decisions-not-descriptions).

Write them now, while the alternatives are fresh. Reconstructing why you chose something
eight months later produces a plausible story rather than the actual reasons.

### Defer aggressively

Things you do not need on day one and should not build:

- **Caching layer.** Postgres is fast. Add caching when you have a measured problem
  ([09](09-performance-optimization.md)).
- **A queue.** Until something genuinely exceeds request time.
- **Multi-tenancy** beyond a `user_id` column.
- **Event sourcing.** Almost certainly not.
- **A design system.** Component library plus consistency is enough for a long time.
- **Feature flags infrastructure.** A config object is fine until it is not
  ([13](13-production-deployment.md)).

Each of these solves a real problem. None of them solves a problem you have yet, and each
one makes every subsequent change more expensive.

### AI in architecture

An agent asked to design a system will give you one: services, a queue, a cache, an event
bus, a diagram with twelve boxes. Every one of those is on the list you just read as
something not to build. The problem is not that the model is careless — it is that most
architecture writing on the internet is about systems at a scale you do not have, and that
is what it learned from. So point it at options and at checking, never at "design my
system."

Where it earns its place:

- **Generate the option set, then throw most of it away.** The expensive failure is
  choosing without knowing the alternatives existed. Over-generation is the one habit that
  helps here — ask for six ways to model this, then argue them down yourself.
- **Pressure-test a reversibility claim.** "This is cheap to undo" has a falsifiable
  answer. Ask what would have to change, how many call sites touch it, and whether any of
  it is stored data. A model is good at enumerating consequences and bad at deciding they
  are acceptable.
- **Read a schema for what is missing.** Uniqueness scope, delete behaviour, and
  nullability are mechanical to check and easy for a person to skim past. Paste the DDL —
  the `CREATE TABLE` statements themselves — and ask what a hostile script could write
  into it.
- **Draft the ADR's first pass** from your own notes, while the alternatives are still
  fresh. You supply the reasons; it supplies the structure.

Where it misleads, which is the half worth reading twice:

- **It reaches for distribution by default.** Microservices, queues and caching layers turn
  up unprompted, because that is what the training material is about. Each one is a real
  solution to a problem you do not yet have.
- **It invents scale.** Ask it to design for growth and it will design for growth you
  cannot describe, then justify the complexity with the number it made up.
- **Schema advice arrives confident and context-free.** It does not know your compliance
  boundary, your budget, or that this table is financial and legally has to survive a
  deletion.
- **An unsupervised ADR is worse than no ADR.** It reads plausibly while recording reasons
  you never had. That is exactly the reconstruction this stage warns about, except it
  arrives eight months early, in writing, and you will believe it.

The tools worth naming: `context7` for the provider's own documentation rather than the
model's memory of it, which matters most for anything touching auth; `claude-mem` for "did
I already decide this and write it down"; a git worktree or a sandbox for the throwaway
spike that answers a feasibility question without polluting the repo.

What none of this replaces: knowing which decisions are expensive, and being willing to
build less than the model offers. It has no stake in maintaining what it proposes.

---

## Artifacts

- A domain model: entities, relationships, and the constraints that hold them together
- Initial database schema with constraints, keys, and indexes
- ADRs for each expensive decision
- A one-paragraph description of the system, plus a diagram only if it clarifies

---

## Definition of done

- [ ] Domain modeled in nouns and relationships, not tables
- [ ] Derived values computed, not stored
- [ ] Deletion behavior decided per entity
- [ ] Uniqueness constraints scoped correctly
- [ ] Constraints live in the database, not only in application code
- [ ] Auth strategy chosen, with an ADR
- [ ] Authorization pattern decided and written down
- [ ] Feature boundaries defined, with the no-cross-querying rule stated
- [ ] Every expensive decision has an ADR
- [ ] Deferred decisions listed explicitly, so deferral is visible rather than forgotten

---

## Scaling to a team

- **Boundaries become social.** Team ownership tends to follow module boundaries, so
  drawing them badly creates permanent coordination overhead.
- **ADRs become essential**, not optional. They are how a decision survives the person who
  made it.
- **Now splitting services can be justified** — by independent deploy cadence and team
  autonomy, which are real benefits that do not exist solo.
- **Review architectural changes more heavily** than feature changes. The blast radius is
  larger and the reversal cost is higher.
- **Watch for Conway's law.** Your architecture will come to mirror your communication
  structure whether you intend it or not.

---

## Traps

**Designing for imagined scale.** Building for a million users you do not have costs
complexity today for benefits that will probably never arrive — and if they do, you will
have learned enough to design it properly then.

**Microservices for a solo project.** Every cost, no benefits. The benefits are
organizational, and you are one person.

**Storing derived state.** `is_overdue` as a column will eventually disagree with
`due_date`. Compute it.

**Constraints only in application code.** Scripts, migrations, and concurrent writes
bypass application logic. The database does not get bypassed.

**Deferring the auth decision.** It touches everything, so retrofitting it means touching
everything.

**Cascading deletes on financial data.** `ON DELETE CASCADE` on an invoice foreign key is
one careless statement away from silently deleting records you legally need to keep.

**Agonizing over reversible decisions.** Folder structure and component libraries are
afternoon-sized changes. Spend the thinking on the data model.

**No ADRs.** The decision survives; the reasoning does not; and in eight months you
relitigate it from scratch with worse information.
