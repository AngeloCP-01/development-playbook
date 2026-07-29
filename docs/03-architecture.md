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

The test, which you apply to your own decisions rather than looking them up: **ask what
would have to change, how many call sites touch it, and whether any of it is stored data.**
The last one dominates. Code is refactorable and data has to be migrated, and a migration
runs against rows that already exist, written by a version of the system you no longer have.

The two lists below are that test already applied, to a typical web application. They are
worked examples, not the answer for your system.

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

### What this system has to be

The stage has been sorting decisions by what they cost. This asks what they are *for*.

Stage 02 settled what the system **does** — the outcome, the cut, the vertical slices. See
[02 — Product Planning](02-planning.md#cut-to-the-core). This stage does not restate any of
it. What it needs is the other half: what the system has to **be** while doing those things.
Those are its **architecture characteristics** — the same thing most job descriptions and
specifications call **non-functional requirements**.

Candidates, to choose from rather than to complete:

availability · correctness · auditability · latency · scalability · security · cost to run ·
deployability · evolvability · observability

**Pick three or four.** Not because a longer list is hard to write, but because they trade
against each other and a system that is meant to be everything has been told nothing. High
availability costs money. Strong auditability costs write throughput. Cheap-to-run costs
both. Twenty characteristics is a system with no priorities, which is a system whose next
hard call gets made by whoever is closest to it.

The invoicing example picks three:

- **Auditability.** Financial records get asked about years later, by people who were not
  there.
- **Correctness.** Money that disagrees with itself is worse than money that arrives slowly.
- **Cheap to run.** One person is paying for this.

And declines, out loud, because a characteristic you never considered is not the same as one
you rejected: **high availability** — a few hours down is survivable when nobody sends
invoices at 3am; **low latency** — nobody is in a hurry to look at an invoice; **scale** —
there is no evidence of it and inventing some is the trap below.

The part that makes this section load-bearing rather than a vocabulary exercise:

| Characteristic | What it forces later in this stage |
|---|---|
| Auditability | Soft delete over hard delete; an immutable record of what was sent |
| Correctness | Constraints in the database rather than the application; money as integer cents |
| Cheap to run | One application, one database, no queue until something demands one |

Every row is a decision this stage makes anyway. Choosing the characteristic first is what
turns that decision from a preference into something with a reason attached.

Which gives you the test: **a characteristic that traces to no decision was not chosen, it
was listed.** If "secure" appears on your list and nothing downstream changed because of it,
delete it — it is doing no work, and it is crowding out one that would.

### Model the domain first

The data model is the highest-stakes decision you will make. It outlives every framework
choice, because migrating data is hard and migrating code is not.

Getting to the nouns is mechanical, and worth doing rather than guessing. Take the vertical
slices from [02 — Product Planning](02-planning.md#sequence-in-vertical-slices) and underline
every noun in them. Strike the ones that are a property of another noun — an invoice's
*total* is not an entity, it is a column, and possibly not even that. What survives is the
candidate list.

It will be wrong on the first pass. The interrogation below is what corrects it, which is
why the questions matter more than the sketch.

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
it but every query must remember to filter. The heuristic is wider than money: **keep
anything somebody will later ask "where did that go?" about.** Financial records obviously,
but also cancelled bookings, withdrawn requests, and users who left — each of those is a row
whose absence is itself a question someone will eventually need answered. Pay the filtering
cost where that is true, and hard delete where it genuinely is not.

**Can a client belong to two users?** If yes now or plausibly later, the join is a table,
not a foreign key. Retrofitting many-to-many onto a one-to-many is a migration plus every
query that touched it.

**What must be unique, and in what scope?** Invoice numbers unique per user, not globally.
Getting this wrong surfaces as a confusing constraint violation months later.

**Does every actor have the same rights over this entity?** If a manager can approve a swap
that the person who requested it cannot, then roles are part of the model rather than a
column added later. This is the question that decides whether "Manager" is an entity, a
column, or a role, and it feeds straight into
[the authorization pattern](#authentication-and-authorization) further down.

The first question above has a general form worth stating, because "computed, here" is an
answer rather than a rule. **Compute it when it is a pure function of data you already
hold** — `overdue` is `due_date` and `status`, so storing it only creates a second version
that can disagree. **Store it when it is a fact about a moment**: the tax rate applied when
the invoice was sent, the price at the time of purchase, the address it shipped to. Those
look derivable and are not, because the thing they would derive from has since changed.
Getting this backwards in either direction is a data bug you find years later.

These answers are the model. They are not yet a schema — that comes later in this stage,
once the system around the data has a shape.

### The shapes a system can take

Before choosing, know what you are choosing between — otherwise the next section is advice
you take on faith.

Start by separating two questions that usually get collapsed into one. **How does it
deploy** — one unit or many? And **how is it organised inside** — what depends on what? A
hexagonal monolith is an ordinary, sensible thing. "Monolith or microservices" is a bad
question because it treats one answer as covering both.

**Deployment shape.** What runs, and how many things you deploy:

| Style | What it buys | What it costs | What would have to be true |
|---|---|---|---|
| **Monolith** | One process, one deploy; refactoring across the system is a rename | Everything scales together; one bad deploy takes all of it down | Almost anything, starting out |
| **Modular monolith** | The above, plus seams that make a later split mechanical | The boundaries hold by discipline — nothing enforces them | You expect the system to outlive your first guess at its shape |
| **Microservices** | Independent deploys, independent scaling, team autonomy | Network failure modes, distributed debugging, consistency across stores | Separate teams need to ship without coordinating with each other |
| **Serverless** | No servers to keep alive, scales to zero, pay per invocation | Cold starts, execution limits, work that does not fit request-response | Load is spiky or near zero, and the work fits inside the limits |

The microservices row is worth reading twice, because it is the one people adopt for the
wrong reason. What it buys is **organisational**. Independent deploys matter when the
alternative is four teams negotiating a release; alone, you are negotiating with yourself,
and you will win. The costs, by contrast, are technical and arrive on day one.

**Internal organisation.** How the code is arranged, independent of the row above:

- **Layered** — routes call services call repositories. Familiar, easy to explain, and prone
  to a bottom layer that everything reaches through.
- **Hexagonal (ports and adapters)** — the domain logic defines interfaces and the database,
  HTTP and third parties plug into them. More indirection; the payoff is that the core is
  testable without any of them running.

Both are compatible with every deployment shape. This is the axis the stage's own advice
lives on, and it is why the next two sections are about structure *inside* one application.

**Communication style**, a third axis: **event-driven** means components announce that
something happened rather than calling the next step directly. It is not a deployment shape
— a single application can be event-driven internally. The decision that leads here is posed
in "Sketch the system" below, where it is concrete.

**What this stage teaches is a modular monolith**, and it is worth having the name. The
boundaries in the next section are its defining feature, and a reader who has been building
one for years without the term cannot look up whether they are doing it well.

That choice follows from the characteristics, not from taste: **cheap to run** rules out
microservices, whose costs are paid per service regardless of load, and makes serverless a
deployment detail rather than an architecture. **Correctness** favours one database with
real constraints over consistency maintained by hand across several. **Auditability** is
easier where every write goes through one place.

Run the same trace against your own three. If it produces a different answer than the next
section, the next section is wrong for your system, and you should be able to say why.

### Start with one application

So: **a single Next.js application with a Postgres database**, organised as a modular
monolith. Not microservices, not a separate API, not a queue, not an event bus.

That is a conclusion, not a starting position. It comes out of three characteristics and a
table of four alternatives, and it would come out differently for a system that had to be
something else. Hold it that way — the reasoning is what tells you when it stops applying.

It is also not a compromise, because:

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

Each of those is a **bounded context** — the domain-driven design term for a boundary inside
which a word means exactly one thing. It is worth the jargon here, because it tells you
*where* to draw a line instead of leaving it to whatever the folders grew into. The line
belongs where the vocabulary changes. If "invoice" means an unpaid obligation to billing and
a support ticket attachment to somebody else, those are two contexts, and forcing one model
across both costs more than keeping them apart.

That is also what **ubiquitous language** buys: the table is called `claims` because the
people who use the system say "claim". Where the words in the code and the words in the room
drift apart, bugs live in the gap — someone says "cancelled" meaning withdrawn by the user
and the code means rejected by a manager.

**Choosing** a boundary and **enforcing** one are different problems, and the second is
useless without the first. The test for choosing:

> **A feature owns the tables it alone writes.** If two features both write a table, they are
> one feature that has not admitted it yet.

The test for enforcing: **features talk through exported functions, never by reaching into
each other's internals.** If `clients` needs invoice data, it calls
`billing.getInvoicesForClient()`. It does not query the `invoices` table directly.

That applies to writes as much as reads, which is the half that gets forgotten. Approving a
shift swap changes rows the approval flow does not own; it goes through the owning feature's
function rather than reaching for the table, or the boundary exists only in the folder names.

That single rule is what keeps a monolith from becoming a big ball of mud, and it is
what makes extracting a service later a mechanical job rather than an archaeology
project.

### Sketch the system

There is an obvious objection to drawing anything at this point: if the answer is one
application and one database, the diagram is two boxes and a line, and drawing it teaches
nobody anything.

The objection is right about the application and wrong about the system. **Your application
is one box. Your system is not.** The invoicing example takes payments, sends email, renders
and stores PDFs, and needs something to notice when an invoice has gone past its due date.
None of those is code you wrote, all of them fail on their own schedule, and every one is a
decision you have already made without writing it down.

**C4** is the usual answer to "what kind of diagram". Four levels: **context** (your system
and the world around it), **container** (the deployable things inside it), **component**
(the pieces inside one container), **code**. For one person, context and container earn
their keep. Component is worth drawing for the one subsystem that is genuinely intricate.
Code is what your editor already draws. Draw two diagrams, not four.

The container view of the invoicing app, which is the one that pays for itself:

```
                        ┌──────────────────┐
              ┌────────►│  Payment provider │  (Stripe)
              │         └────────┬─────────┘
              │  charge          │ webhook: payment succeeded
              │                  ▼
  ┌───────┐   │         ┌──────────────────┐        ┌────────────┐
  │ User  ├───┼────────►│  Next.js app      │───────►│  Postgres  │
  └───────┘   │         └────┬────────┬────┘        └────────────┘
              │              │        │
              │      send    │        │  render + store
              │              ▼        ▼
              │      ┌────────────┐  ┌────────────┐
              └──────┤   Email    │  │Blob storage│
                     └────────────┘  └────────────┘

  ┌──────────────────┐
  │ Scheduled job    │───► marks sent invoices past due_date as overdue
  └──────────────────┘     (runs daily; see 11 — CI/CD for where it lives)
```

The deployment view, for this system, is close enough to the same picture that drawing it
separately would be padding: one application on one platform, one managed database, three
third-party services reached over HTTPS. Say that rather than producing a second diagram out
of obligation. It stops being true the moment anything runs on its own schedule or its own
hardware, and then the view earns its place.

**One data flow, drawn end to end.** Pick the flow that crosses the most boundaries, because
that is where the design decisions hide:

```
1. User clicks "send"          →  app writes status = 'sent', calls the email provider
2. Email provider accepts      →  synchronous; if it fails, the user finds out now
3. Client pays, days later     →  payment provider fires a webhook at your app
4. App receives the webhook    →  asynchronous; nobody is waiting, and it may arrive twice
5. App writes status = 'paid'  →  must be safe to run twice (see below)
```

Steps 2 and 4 are different in kind, and that difference is a decision the stage has not yet
posed.

**Synchronous or asynchronous.** This is the fork that leads to event-driven architecture,
and it has real consequences on each branch:

| | Synchronous | Asynchronous |
|---|---|---|
| You learn about failure | Immediately, inside the request | Later, or never, unless you go looking |
| The caller waits | Yes | No |
| Fails by | The callee being down or slow | The message being lost, delayed, or delivered twice |
| Needs | A timeout and a retry policy | **Idempotency**, and somewhere to put what failed |

The rule that catches people: **for anything you receive, you do not get to choose.** A
payment webhook is asynchronous because somebody else decided it is, it will be delivered
twice eventually, and step 5 above has to be safe when that happens. That is what idempotency
means, and it is not optional on a payment flow.

Choose synchronous by default for work you initiate. Reach for asynchronous when the caller
genuinely should not wait, and accept that you have bought a failure mode you now have to
watch — which is [15 — Observability](15-observability.md)'s problem, and it starts here.

**Then ask the question that makes the whole sketch worth drawing:** for each box that is not
yours, what happens when it is down?

- **Payment provider down** — invoices still send; payment reconciles late. Survivable, and
  it needs no code.
- **Email provider down** — the invoice must not be lost because the send failed. Either
  retry, or record the intent and send later. This one is a decision, and the diagram is what
  forced it.
- **Blob storage down** — PDFs are regenerable from the invoice row, so this is an
  inconvenience rather than data loss. That is only true because the row is the source of
  truth, which is a design property worth having noticed.

Three questions, three answers, one of which is a genuine piece of work you would otherwise
have discovered in production. That is the return on a diagram.

**What is deliberately not here.** Full high-level design practice comes with a system
specification document, a review board, and a sign-off before implementation starts. None of
that is in this stage, on purpose. The thinking survives — what the pieces are, how they
talk, what happens when one fails — and the paperwork does not, because its actual purpose is
coordinating people you do not have. If you later have them, the artifact to add first is the
one above, written down rather than in your head.

### Design the database

Now the model becomes a schema. The nouns from earlier, with their cardinality made explicit
— this is the same picture the domain model described in words, which is why it is worth
drawing once:

```
  users ──1──< clients ──1──< invoices ──1──< line_items
    │                            │
    └────────────1──────────────<┘
         (owner_id: an invoice belongs to a user directly,
          so a client can be reassigned without orphaning it)
```

That last relationship is a decision, not a detail. Hanging `invoices` off `users` as well as
`clients` is what lets a client be merged or reassigned later without the invoices following
it, and it is the kind of thing an ER view makes visible and a list of tables does not.

**Normalisation** is the vocabulary for how far you have gone in removing duplicated facts —
first, second and third normal form, of which third is the one worth aiming at. The theory is
longer than the working rule, which is: **if changing one fact means updating two rows, the
model is wrong.** A client's address stored on every invoice is not a shortcut, it is four
hundred rows that will disagree the first time someone moves.

Denormalise deliberately, later, when you have measured a query that needs it — and
[09 — Performance Optimization](09-performance-optimization.md) is where that measurement
belongs. Denormalising because it seemed easier at the time is how data rots.

Encode the answers from the domain model as **database constraints**, not application checks.
Application code has bugs, gets bypassed by scripts, and races with itself. The database is
the last line that actually holds.

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

Two lines in there are choices rather than defaults, and both are stored data, so both are
on the expensive list from the top of this stage:

- **`uuid` for the primary key.** Chosen because ids appear in URLs and can be generated
  without a round trip to the database. The alternative, `bigserial`, is smaller and faster
  to join on, but it publishes how many rows you have and how fast they arrive — visible to
  anyone who can see two of your ids.
- **`date` for `due_date`, `timestamptz` for `created_at`.** A due date is a calendar day and
  means the same thing to a reader in any timezone. A creation time is an instant and does
  not. Getting these backwards produces off-by-one-day bugs that appear only for users in
  other timezones, which is to say not on your machine.

**Indexes answer queries you actually run**, so write the queries first and add the index the
query needs. Two, for this schema:

```sql
-- The dashboard lists one user's invoices filtered by status. Without this,
-- every page load scans the whole table.
CREATE INDEX invoices_owner_status_idx ON invoices (owner_id, status);

-- The scheduled job from the sketch above looks for sent invoices past due.
-- Partial, because it never asks about drafts or paid invoices, and a smaller
-- index is a faster one.
CREATE INDEX invoices_overdue_idx ON invoices (due_date) WHERE status = 'sent';
```

Both come from the system sketch rather than from intuition: one from a screen, one from the
scheduled job. Indexes cost write time and disk, which is why "index everything" is not the
answer and "index nothing until it hurts" is not either.

**Some rules are conditional, and `UNIQUE` cannot express them.** The stage names races as
the reason constraints belong in the database, then supplies only primary keys, foreign keys,
`CHECK` and `UNIQUE` — none of which can say "at most one *approved* claim per shift". A
plain `UNIQUE (shift_id)` would also forbid the second rejected claim, which is wrong. The
tool is a **partial unique index**:

```sql
CREATE UNIQUE INDEX one_approved_claim_per_shift
  ON claims (shift_id) WHERE status = 'approved';
```

Without it, the usual approach is to check for an existing approval and then insert — which
two concurrent requests both pass, both believing they were first.

**Some invariants span rows, and no constraint can express them at all.** Moving an amount
from one row to another, or writing a record and marking its source consumed, has to happen
as one unit or not at all. That is a **transaction**: the work commits together or none of it
does. This is the point where a rule stops being the database's job to guarantee and starts
being yours to demarcate — the database will hold the line, but only around the boundary you
draw.

### Design the API contracts

A contract is a promise about shape, and its real cost is **who you can force to move when
you break it.** That is the same reversibility axis the stage opens on, which is why the
decision belongs here rather than in implementation.

| Contract | Cost to change | Why |
|---|---|---|
| An internal server action or function | Cheap | One codebase, and the compiler finds every caller |
| A public API someone else calls | Expensive | You do not know who depends on it and cannot make them move |
| A webhook you receive | Not yours to change | Somebody else owns the shape; you adapt |

Most solo projects live almost entirely in the first row, which is the argument for not
building a public API until something actually needs one. The mistake is not noticing the
moment you have moved into the second — a mobile client, a partner integration, a public
endpoint someone found — because from then on the shape is a commitment.

Three decisions worth making before the first row exists:

- **Route shape.** Resource-oriented (`/invoices/:id`) is the default because it is
  predictable, and predictable is most of what a contract is worth. The specific convention
  matters far less than applying one consistently.
- **Request and response shape.** Validate at the boundary — anything crossing into your
  system is untrusted, including data from your own frontend. What you return is a promise:
  adding a field is safe, removing or renaming one is not.
- **Versioning.** Needed only for the expensive row, and the cheapest strategy is to avoid
  needing it: add fields, never remove them, and never change the meaning of one that exists.
  When that stops being enough, version the route rather than the payload.

How these are implemented — where validation physically goes, how errors are shaped, what a
route file should and should not contain — is
[05 — Development](05-development.md#server-actions-need-validation-and-authorization)'s. As
with authentication, this stage decides and 05 carries it out.

### Authentication and authorization

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

- Three or four architecture characteristics, each traced to a decision it forced
- A domain model: entities, relationships, and the constraints that hold them together
- Initial database schema with constraints, keys, and indexes, each index traced to a query
- The API contracts you are committing to, sorted by how expensive each is to change
- ADRs for each expensive decision
- A system sketch: the containers, the external systems they depend on, and one data flow
  drawn end to end

---

## Definition of done

- [ ] Characteristics chosen, and each one traced to a decision it forced
- [ ] Architecture style named, with the alternatives rejected and the reason for each
- [ ] System sketched, with what happens when each external dependency is down
- [ ] Integration style decided per external call, and anything received is idempotent
- [ ] Domain modeled in nouns and relationships, not tables
- [ ] Derived values computed, not stored
- [ ] Deletion behavior decided per entity
- [ ] Uniqueness constraints scoped correctly
- [ ] Constraints live in the database, not only in application code
- [ ] Conditional rules expressed as partial unique indexes, not as check-then-insert
- [ ] Indexes added for the queries you actually run, and no others
- [ ] API contracts decided, sorted by how expensive each is to change
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
