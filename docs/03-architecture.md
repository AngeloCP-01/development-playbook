# 03. Architecture

> Make the decisions that are expensive to reverse. Defer everything else.

**When this actually happens:** After [02 — Planning](02-planning.md), before
[04 — Project Setup](04-project-setup.md). Revisited whenever a change strains the current
structure — which is a signal, not a failure.

---

## What is in here

This is the longest stage in the playbook, deliberately. It is built to be consulted rather
than read straight through. The work runs requirements → high-level design → low-level
design; the numbering is the reading order, not a schedule.

**If you came looking for "system design", it is here under another name.** The middle of this
stage — from *What this system has to be* through *Authentication and authorization* — is that
activity: choose the qualities, model the data, pick a shape, draw the dependencies, settle the
interfaces and the access rules. The sections around it are the judgment about doing it at all:
which decisions deserve the effort (1) and which to refuse (13), how one survives you (12), how
to change one that is already running (9), and where an agent helps (14). That surrounding half
is the part a textbook usually leaves out.

| | Section | Answers |
|---|---|---|
| | [Sort decisions by reversibility](#sort-decisions-by-reversibility) | Which decisions deserve the thinking |
| **HLD** | [What this system has to be](#what-this-system-has-to-be) | Which qualities you are designing for, and how you would know if one stopped holding |
| | [Model the domain first](#model-the-domain-first) | Entities, relationships, and the questions that find design errors |
| | [The shapes a system can take](#the-shapes-a-system-can-take) | Monolith · modular monolith · microservices · serverless, and scaling |
| | [Start with one application](#start-with-one-application) | The recommendation, derived — and its one sharp edge |
| | [Boundaries inside the monolith](#boundaries-inside-the-monolith) | Where to draw a line, and how to keep it |
| | [Sketch the system](#sketch-the-system) | What you depend on · **timeouts, retries, webhooks, idempotency** · what happens when it is down |
| **LLD** | [Design the database](#design-the-database) | Schema · indexes · constraints · tenancy · **locking, two people editing one row** |
| | [Evolve the schema safely](#evolve-the-schema-safely) | **Adding or renaming a column** on a live table, without downtime |
| | [Design the API contracts](#design-the-api-contracts) | Route shape · request/response · versioning · receiving a webhook |
| | [Authentication and authorization](#authentication-and-authorization) | Who the caller is, and what they may do |
| | [Write the ADRs](#write-the-adrs) | Recording a decision so it survives you |
| | [Defer aggressively](#defer-aggressively) | What not to build, and the test for it |
| | [AI in architecture](#ai-in-architecture) | Where an agent helps, and where it misleads |

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

The part that makes this section load-bearing rather than a vocabulary exercise. This is a
reference for whichever three or four you chose, **not a checklist to complete** — the
pick-three rule above still stands:

| Characteristic | What it forces later in this stage |
|---|---|
| Auditability | Soft delete over hard delete; an immutable record of what was sent |
| Correctness | Constraints in the database rather than the application; money as integer cents; a locking strategy where two people can edit one row |
| Cheap to run | One application, one database, no queue until something demands one |
| Availability | A timeout on every external call; retries only where they are safe; a decision about what still works when each dependency is down |
| Scalability | Statelessness, so more instances are an option at all; a pooler between serverless and Postgres |
| Evolvability | Expand-contract for anything stored; boundaries that make a later split mechanical rather than archaeological |
| Security | An authorization rule written per entity — often two patterns joined by *and*, not one chosen for the system |
| Deployability | Migrations that are safe to run before the code that needs them |
| Latency | Indexes traced to real queries; synchronous work kept off the request path |
| Observability | Asynchronous work you can see the failures of, rather than only the successes |

Every row is a decision this stage makes anyway. Choosing the characteristic first is what
turns that decision from a preference into something with a reason attached.

Which gives you the test: **a characteristic that traces to no decision was not chosen, it
was listed.** If "secure" appears on your list and nothing downstream changed because of it,
delete it — it is doing no work, and it is crowding out one that would.

**Then one step further, because a trace is a claim and claims rot.** A characteristic that
nothing checks is a characteristic you are hoping for. The name for the check is a **fitness
function**: an automated test of a *property of the system*, rather than of what a function
returns.

**Not now, though.** You have no code yet, and standing up an import-graph linter before your
first table is exactly the kind of infrastructure this stage spends a section refusing. What
belongs in this stage is one line per characteristic in your notes: *how would I know if this
stopped being true?* Writing the check is [06 — Testing](06-testing.md)'s, once there is
something to check.

The answers are more ordinary than the term suggests. The cheapest useful one is usually a
plain test that asserts a fact about your own schema — that the constraint carrying your
correctness rule still exists, for instance, which is three lines and catches a migration that
quietly dropped it. Beyond that: a test that fails when one feature imports another's internals,
which is the boundary rule in
[Boundaries inside the monolith](#boundaries-inside-the-monolith) enforced instead of agreed; a
build-size budget, defending a performance characteristic against the dependency somebody adds
in eight months; a query-count assertion, which is how an N+1 gets caught before a user finds
it. Each of those is a small amount of tooling research, and none is worth doing before the
characteristic it defends is real.

So the section is a sequence, not a list: **choose a characteristic, trace it to a decision, and
write down how you would know if the decision stopped holding.** The first two happen here. The
third gets built when there is code under it.

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

**Is this a thing, or something that happened to a thing?** The strike test above removes
nouns that are properties. This removes the opposite mistake: a verb that is really an entity.
Ask whether you will later want to know **who did it and when**. If yes, it is a thing — an
approval with an actor and a timestamp — and modelling it as a status flip throws that away
irreversibly, because a column holds the current value and not the act. If no, it is a status.
"Approved" is the usual case that goes both ways, and the answer is almost always that you
will want to know.

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

**Choose between them on one question: how much of your logic is worth testing without the
database running?** If the answer is "most of it" — pricing rules, eligibility, anything with
branches you care about — hexagonal pays for its indirection. If your logic is mostly
validate, write, read back, layered is honest and hexagonal is ceremony around a thin middle.
Start layered and extract ports where a piece of logic gets hard to test; going the other way
is a rewrite.

**One property decides whether the deployment table above is even available to you:
statelessness.** An
application is stateless when it keeps no request state in its own memory — sessions live in a
cookie, a table or a shared store, never a local variable. Any instance can then serve any
request, which is what lets you run several copies, and what makes the serverless row possible
at all, since the platform starts and stops instances whenever it likes. An in-memory session
cache works perfectly on one machine and breaks the moment there are two.

That is also what the table means by scaling independently, so it is worth saying how. **Vertical
scaling** is a bigger machine: simpler, needs no statelessness, and eventually runs out of
machine. **Horizontal scaling** is more machines behind a **load balancer**, needs statelessness
first, and has effectively no ceiling. **Read replicas** spread read load, and do nothing for
writes, because writes still go to one place. Their catch is lag — a replica is behind by some
amount, which is where the eventual consistency from
[Design the database](#design-the-database) turns up in your own product rather than in theory.

Vertical first is almost always right. The point of knowing the difference is that horizontal
scaling is not something you bolt on: it needs a property you either have or do not, decided
now.

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

**The one sharp edge in this recommendation, named because you will meet it.** A Postgres
instance accepts a limited number of simultaneous connections — often a couple of hundred, fewer
on small plans. Serverless functions scale by starting more instances, and each instance wants
its own connection. So traffic that looks entirely moderate exhausts the limit, and new requests
fail *on connect* rather than on anything you wrote, which makes it a confusing first
encounter: the application is fine, the database is fine, and the join between them is not.

The fix is a **pooler** between the two, holding a small number of real connections and
multiplexing everyone onto them. Managed Postgres providers ship one, and reaching for it is usually a
connection-string change rather than an architecture change. One caveat, because the pooler is
the thing you will reach for first and the mode is a setting nobody reads: a pooler in
*transaction* mode hands your connection to someone else between transactions, which breaks
anything relying on session state — prepared statements, session variables, advisory locks.
What you take inside a transaction is safe, including the `SELECT … FOR UPDATE` this stage
teaches further down; what you expected to outlive one is not. Most clients have a flag for it.
Read your provider's note on the mode before assuming it is invisible.

This does not weaken the recommendation. One application and one database is still right. It is
the difference between a default that works and a default you understand — and this is the part
a reader following this playbook is most likely to hit first.

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

#### Which diagrams to draw

**C4** is the usual answer to "what kind of diagram". Four levels: **context** (your system
and the world around it), **container** (the deployable things inside it), **component**
(the pieces inside one container), **code**. For one person, context and container earn
their keep. Component is worth drawing for the one subsystem complicated enough that you keep
re-deriving how it fits together.
Code is what your editor already draws. Draw two diagrams, not four.

In practice one drawing often covers both: the container view below carries the user and the
external systems, which is the context view's whole content. Draw them separately when the
outside world gets busy enough that mixing the two makes either unreadable.

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
  │ Scheduled job    │───► emails a reminder for sent invoices past due_date
  └──────────────────┘     (runs daily; see 11 — CI/CD for where it lives)
                           it sends; it does not write a status. "Overdue" is
                           computed, per the interrogation above.
```

The deployment view, for this system, is close enough to the same picture that drawing it
separately would be padding: one application on one platform, one managed database, three
third-party services reached over HTTPS. Say that rather than producing a second diagram out
of obligation. It stops being true the moment anything runs on its own schedule or its own
hardware, and then the view earns its place.

Record that as a decision rather than leaving it as an absence: *no deployment view — one
application on one platform, and the container view already carries it.* A view you decided
not to draw and a view you forgot look identical on the page and mean opposite things about
your thinking.

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

#### Synchronous or asynchronous, and idempotency

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

Making something idempotent is a schema decision, which is why it belongs in this stage
rather than in implementation. Two mechanisms cover almost everything:

- **Record what you have already processed.** The sender gives every event an id. You store
  it with a unique constraint and ignore anything you have seen before. This is the general
  answer, and it is the one to use when handling the event twice would do visible damage.

  ```sql
  CREATE TABLE processed_events (
    provider   text NOT NULL,
    event_id   text NOT NULL,
    handled_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (provider, event_id)
  );
  ```

  **Insert the row first, then do the work, both in one transaction.** Order matters as soon
  as "the work" reaches outside the database, which is the case being taught here. The second
  delivery fails the primary key, the transaction rolls back, and nothing happens twice.

  Then answer the sender **success**. This is the half that gets missed: a duplicate is not
  an error, it is the system working. Returning a failure means the provider retries, fails
  again, and keeps going — you have built a loop out of the mechanism meant to prevent one.

- **Make the write itself repeatable.** Setting `status = 'paid'` is already safe to run
  twice; adding to a balance is not. Where you can phrase the change as "set this to that"
  rather than "adjust this by that", you need no bookkeeping at all.

Reach for the second where it works and the first where it does not.

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

**If you take the second option, decide the cadence with it.** "Record the intent and send
later" is not a design until you say how much later, and the answer comes from the promise
the feature made rather than from a default. A daily sweep is right for an invoice reminder
and wrong for a shift confirmed at 9pm for 6am — same mechanism, same code, and one of the
two is a broken feature. Where that job runs, how it is scheduled and what happens when a run
fails belong to [11 — CI/CD](11-ci-cd.md) and
[13 — Production Deployment](13-production-deployment.md); choosing the cadence the promise
requires is this stage's, because it is a property of the design rather than of the pipeline.

#### Timeouts, retries and failing well

Those three answers have a name: **graceful degradation**, deciding per feature what still
works when a dependency does not. And there is a small standard vocabulary for producing them,
worth having because these four cover almost everything:

- **A timeout on every network call.** Most HTTP clients and database drivers wait
  indefinitely by default, which converts somebody else's slow afternoon into your outage —
  requests pile up holding connections until nothing works. The specific number matters much
  less than having one.
- **Retry with exponential backoff and jitter.** Backoff because the service that just failed
  is usually recovering, and retrying hard is how you keep it down. Jitter because without a
  random offset every client that failed at the same moment retries at the same moment, which
  is a thundering herd you built yourself. And the precondition this section has already
  taught: **you may only retry what is safe to retry.** Retrying a charge without idempotency
  is how you bill someone twice.
- **A circuit breaker.** After a few consecutive failures — five is a common starting point —
  stop calling and fail immediately for a cooldown of a minute or so, then let one request
  through to test the water. This is the pattern you reach for once your retries have made you
  part of the outage rather than a victim of it.

  It also has a catch that the [statelessness](#the-shapes-a-system-can-take) rule above makes
  visible: **a breaker is failure-count state, and an in-memory one is per instance.** Across
  ten instances you get ten independent breakers, each needing its own five failures, so the
  thing trips ten times later than you designed it to. On one instance that is fine and you
  should not care. When it stops being fine the count has to move somewhere shared, and at that
  point you are running infrastructure to protect a call — which is the moment to ask whether
  the call needed protecting.
- **Bulkhead**, named and not taught: isolating resource pools so one saturated dependency
  cannot consume every thread. Real, and rarely earning its keep inside a single application.

**For most calls the right answer is a timeout and nothing else.** Retries earn their place
where the call is idempotent and the failure is plausibly transient. A breaker earns its place
after you have watched something fail repeatedly. Building all four around three third-party
calls on day one is the same instinct as reaching for microservices, wearing different clothes.

**What is deliberately not here.** Full high-level design practice comes with a system
specification document, a review board, and a sign-off before implementation starts. None of
that is in this stage, on purpose. The thinking survives — what the pieces are, how they
talk, what happens when one fails — and the paperwork does not, because its actual purpose is
coordinating people you do not have. If you later have them, the artifact to add first is the
one above, written down rather than in your head.

### Design the database

Now the model becomes a schema. If your product has organisations or teams, read
[Defer aggressively](#defer-aggressively) before you write the first table: the tenant key is
the one item on the deferral list that cannot be deferred, and it belongs on the tables you
are about to create.

The nouns from earlier, with their cardinality made explicit
— this is the same picture the domain model described in words, which is why it is worth
drawing once:

```
  users ──1──< clients ──1──< invoices ──1──< line_items
    │                            │
    └────────────1──────────────<┘
         (owner_id: an invoice belongs to a user directly,
          so a client can be reassigned without orphaning it)

  reading it:  A ──1──< B   means one A has many B
```

That last relationship is worth arguing about before it is typed. Hanging `invoices` off
`users` as well as
`clients` is what lets a client be merged or reassigned later without the invoices following
it, and it is the kind of thing an ER view makes visible and a list of tables does not.

#### Normalisation

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

Below is the invoices table as **DDL** — data definition language, the `CREATE` statements
that define shape rather than move data. The word turns up in migration tooling and in
anything you read about schemas, so it is worth having.

Each block from here on shows only the tables under discussion, and assumes the others the
domain model named — `users` and `clients` here — already exist. They are excerpts, not a
migration file:

```sql
CREATE TABLE invoices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  client_id    uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  number       text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  due_date     date NOT NULL,
  status       text NOT NULL CHECK (status IN ('draft','sent','paid')),
  version      integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz,
  UNIQUE (owner_id, number)
);
```

Two of those columns are there because the characteristics chose them, and it is worth naming
which. `deleted_at` is **auditability** — the soft delete this stage argued for, where a null
means live and a timestamp means gone-but-answerable. `version` is **correctness** — the
optimistic-locking column from further down this section. Neither is a default; both trace back
to [What this system has to be](#what-this-system-has-to-be), and a schema that skipped them
would be one that agreed with the trace table in prose and disagreed with it in SQL.

The cost of `deleted_at` is the one already named: **every query must remember to filter.**
That is a real tax, paid on every read forever, and it is why the decision is per entity rather
than a habit.

**Auditability wants one more thing, and it is the other half of that trace row.** A status of
`sent` records that an invoice was sent; it does not record *when*, *to which address*, or that
it was sent twice. Those are facts about moments, which the interrogation above says to store —
so they belong in a table of their own, appended to and never updated:

```sql
CREATE TABLE invoice_sends (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  sent_to    text NOT NULL,          -- the address at the time, not a join to the client
  sent_at    timestamptz NOT NULL DEFAULT now()
);
```

Append-only is the whole point: rows go in, nothing edits them, and "we sent it on the 3rd to
the old address" stops being a reconstruction. Note that this is **not** event sourcing — the
invoice's current state still lives on `invoices`, and this table is a record beside it rather
than the source it is derived from. That distinction is in
[Defer aggressively](#defer-aggressively), and it is the one people talk themselves out of.

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

  **There is a third case, and it catches anyone building a schedule.** A shift that starts at
  09:00 on Tuesday starts at 09:00 whatever the clocks do — it is a *wall-clock* fact attached
  to a place, not an instant. Store it as an instant and it moves by an hour twice a year: the shift you scheduled for 09:00
  starts arriving at 08:00 or 10:00, and nobody changed anything. Store it as `timestamp` without a
  zone plus the location's timezone (`Europe/London`, not an offset, because offsets change and
  zone names do not) and you can compute the instant whenever you need it while keeping the fact
  the business actually stated. The three-way question, then: **is this an instant, a calendar
  day, or a wall-clock time somewhere?** Most products only have the first two and never notice
  the third exists until a scheduling feature arrives.

#### Indexes

**First, one number: how much data will exist in a year, and how fast does it arrive?** Not a
model — a number you can say out loud. Ten thousand invoices is a table where every query is
fast and no index is load-bearing; ten million is a table where the missing one is an outage.
You cannot judge an index without saying which of the two you are indexing for, and the
honest answer is usually one sentence about your own product.

This is the light version on purpose. Sizing a cache, projecting to ten million users, or
building a spreadsheet of requests per second is the imagined scale this stage spends a
section refusing. One number, revisited when it turns out to be wrong.

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

#### Constraints for conditional rules

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

#### Actors, roles and the tenant key

**Actors and tenancy are stored data too, and they are the two this stage most often leaves
implicit.** The invoicing schema above has neither, because one freelancer owning their own
rows needs neither. Most products are not that. If your answer to "does every actor have the
same rights?" was no, or your tenant is an organisation rather than a person, the shape is
this:

```sql
CREATE TABLE companies (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL
);

-- The tenant key, carried on every table that holds tenant data. Decided now:
-- see "Defer aggressively" for why this is the one item there that cannot wait.
CREATE TABLE teams (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  name       text NOT NULL,
  UNIQUE (company_id, name)
);

-- Roles live on the relationship, not on the user. A person can be a manager
-- of one team and an ordinary member of another, and a `users.role` column
-- cannot say that.
CREATE TABLE memberships (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  role    text NOT NULL CHECK (role IN ('member','manager')),
  PRIMARY KEY (user_id, team_id)
);
```

`company_id` on `teams` is what the tenant-key decision actually looks like once
written down, and the `UNIQUE (company_id, name)` beside it is the scoped-uniqueness
rule from the domain model applied to a tenant: two companies may both have a team
called Kitchen.

That is the answer to the actor-rights interrogation question, and it is why the question is asked
before the schema exists. A `role` column on `users` is the shape you regret: it is a single
global answer to a question that is asked per team.

**Nested tenancy — when the axis is not one level.** A company that contains teams gives you
two candidate keys, and picking wrong costs the migration the deferral section warns about.
The rule: **the tenant key is the level at which data stops being shared.** If a worker
moving between teams should keep their history, the company is the tenant and the team is an
ordinary foreign key. If teams are genuinely separate customers who must never see each
other's rows, the team is the tenant. Answer it now; everything built on top of it can wait.

#### Transactions, isolation and locking

**Some invariants span rows, and no constraint can express them at all.** Moving an amount
from one row to another, or writing a record and marking its source consumed, has to happen
as one unit or not at all. That is a **transaction**: the work commits together or none of it
does. This is the point where a rule stops being the database's job to guarantee and starts
being yours to demarcate — the database will hold the line, but only around the boundary you
draw.

**How much a transaction sees of another is its isolation level**, and the default is not the
strictest. Postgres runs **read committed**: you never see uncommitted rows, and you *do* see
rows other transactions commit while yours is still running. That is enough for almost
everything. **Serializable** is stricter: it behaves as though transactions ran one at a time and
aborts one when it cannot guarantee that, which costs you a retry path your code did not
previously need.

**Neither of them solves the problem below, and this is the part that catches people.** An
isolation level can only relate a read and a write that are inside *the same transaction*. When
a person sits between them — page loads, reads a claim, thinks for a minute, clicks approve —
those are two separate transactions with a human in the gap, and no isolation level in any
database can see a relationship between them. Setting `SERIALIZABLE` and believing the next
problem is handled is a specific and comfortable way to ship it anyway.

**The lost update, which no constraint catches.** Two managers open the same claim. Both read
it as pending. Both approve. The second write silently overwrites the first, no constraint was
violated, and nothing anywhere records that a decision was discarded. Two standard fixes, and
both work by carrying something *across* the two transactions rather than tightening either one:

- **Optimistic locking.** Put a version on the row and carry it into the write:

  ```sql
  UPDATE claims SET status = 'approved', version = version + 1
   WHERE id = $1 AND version = $2;
  ```

  (`claims` carries the same `version integer NOT NULL DEFAULT 0` shown on `invoices` above.)
  Zero rows updated means somebody got there first, so you tell the user instead of losing
  their work — as does an update against a row somebody deleted, which is worth distinguishing
  if the message differs. Note what this is: **`version` is stored data**, so by the test at the top of
  this stage it is decide-now, and adding it later is an expand-contract sequence rather than
  an afternoon.

- **Pessimistic locking.** `SELECT … FOR UPDATE` inside the transaction, and the second reader
  waits. Correct when conflict is likely and the work between read and write is short. Wrong
  when the work waits on a person, because you are holding a lock while somebody reads their
  email, and two transactions taking rows in different orders will deadlock.

The rule: **optimistic when conflict is rare, pessimistic when it is expected.** For anything
with a human deciding in the middle, that is almost always optimistic.

**Neither of them, applied to the rows being written, protects a rule that spans rows — and
this is the trap.** Both lock a row against concurrent writes *to that row*. Two managers approving the same claim is the case above
and optimistic locking catches it. Two managers approving **two different claims on the same
shift** is a different case: different rows, both versions match, both writes succeed, and you
now have two approved claims for one shift. The version column is silent because nothing about
either row changed underneath it.

The tool for that is the partial unique index from earlier in this section — a **cross-row
invariant needs a constraint, not a lock.** Locks and constraints answer different questions,
and any rule phrased "at most one X per Y" is the second kind.

Which means you have to handle its failure. A constraint violation arrives as a database error,
not as zero-rows-updated, so catch it by constraint name and turn it into the same message the
optimistic path produces — *somebody approved a claim on this shift first*. Left uncaught it is
a 500 served to a manager who did nothing wrong.

**Two terms you will meet everywhere, worth having and not worth overselling.** **CAP** says
that when the network between your nodes splits, you choose between refusing requests to stay
consistent and serving them while copies disagree. With one database there is no partition to
survive, so it is theory — it becomes a real decision the moment you add a replica or a second
service that owns data. **Eventual consistency** is what you get at that moment: copies agree
in the end, not immediately. Its everyday face is the read-after-write anomaly, where a user
saves, gets redirected, reads from a replica and does not see their own change. That is why a
read which must reflect a just-finished write goes to the primary, and it is a design decision
rather than a bug to fix later.

### Evolve the schema safely

This stage has now said four times that stored data is the expensive kind. What it has not said
is what you do when you have to change it anyway, which you will, because the schema above was
designed with the understanding you had on the first day.

That is not an argument for getting it right first time. It is an argument for knowing the
technique, because the technique turns an expensive change into a tedious one.

**First, the honest precondition, because this stage spends a whole section refusing imagined
scale and would be hypocritical to skip it.** If nobody is using the system yet — pre-launch,
four test users, one instance — renaming a column *is* one statement. Write the migration, run
it, move on. Everything below is protection against traffic, and you cannot lose data that
nobody has entered.

Adopt it the day you have users whose data you would be sorry to lose. That is a real
threshold, and it usually arrives before people notice.

**Expand-contract**, also called parallel change. Once there is traffic, renaming a column looks
like one statement and is actually six deploys, each of which is safe on its own:

```
1. Expand    add the new column, nullable. Nothing reads it yet.
2. Write     write both old and new. Deploy. Every new row is now correct.
3. Backfill  fill the old rows, in batches, skipping any the new code already wrote.
4. Move      switch reads to the new column. Deploy. Watch it.
5. Stop      stop writing the old one. Deploy.
6. Contract  drop it.
```

**Why "Deploy" is doing more work than it looks.** A deploy is not a moment, it is a rollover:
for a while the old code and the new code are both serving traffic. That is the entire reason
steps 2 and 5 exist. During step 2's rollover, instances that have not updated yet are still
writing only the old column, so the new one cannot be trusted until the rollover finishes — and
during step 4's, instances still reading the old column need it to still be correct, which is
why you stop writing it in a *later* deploy rather than the same one. A reader who takes
"Deploy." as atomic will follow all six steps without knowing why, and will skip 2 and 5 on the
next change.

**And the backfill has to be safe to run twice**, which is idempotency from
[Sketch the system](#sketch-the-system) arriving where it bites hardest.

Take a concrete change: `users.name` is being split into `first_name` and `last_name`. Step 2's
code is already writing all three for anyone who saves, and some of those people have since
corrected a name the split would have got wrong. So the backfill must skip rows that already
have a value, and it has to run in batches so it never holds a long lock:

```sql
-- Repeat until it reports zero rows. Safe to re-run at any point.
UPDATE users
   SET first_name = split_part(name, ' ', 1),
       last_name  = CASE WHEN strpos(name, ' ') = 0 THEN NULL
                         ELSE substr(name, strpos(name, ' ') + 1) END
 WHERE id IN (
   SELECT id FROM users
    WHERE first_name IS NULL          -- never overwrite what step 2 wrote
      AND name IS NOT NULL            -- or the loop never reaches zero rows
    LIMIT 1000                        -- one batch
 );
```

**Both guards in that inner select are there because the naive version is broken, and neither
failure announces itself.** Without `name IS NOT NULL`, a row with a null name matches the guard
forever — `split_part(NULL, …)` is null, so `first_name` stays null, the row re-matches, and the
statement keeps reporting one row updated. "Repeat until zero" never terminates. And without the
`CASE`, a mononym breaks: `strpos` returns 0 for a name with no space, `substr(name, 1)` returns
the whole string, and every single-word name ends up with `last_name` equal to `first_name`.

Which is worth sitting with, because it is the lesson rather than a footnote: **the data you are
migrating contains cases your splitting rule was not written for.** Mononyms, null names, four
words, a trailing space. Run the `SELECT` half first and look at what comes back before you let
the `UPDATE` touch anything.

An unguarded backfill does not error when re-run. It reverts corrections, which is the worst
class of migration bug: silent, plausible, and invisible until somebody notices their edit did
not stick.

The batch size is a judgement rather than a constant — large enough to finish, small enough that
one statement is not holding rows for long. A thousand is a reasonable place to start and the
number only matters on tables big enough that you would notice.

The rule that makes this worth the ceremony: **never ship a destructive migration in the same
deploy as the code that needs it.** If a deploy goes wrong you want the fix to be a code
rollback, and a dropped column is not something you can roll back. Steps 2 and 5 are the ones
people skip because they feel redundant, and skipping them is exactly what turns a rename into
an outage — between deploying code that reads the new column and running the migration that
fills it, there is a window, and in production that window has traffic in it.

The same shape covers more than renames. Splitting one column into two, tightening a nullable
column to `NOT NULL`, changing a type, extracting a table: all of them are expand, migrate,
contract, with reads moving in the middle.

**One thing to know about the statements themselves, because it is neither shape nor
scheduling and so falls between this stage and the next.** Some `ALTER TABLE` statements take a
lock that blocks reads and writes for as long as they run, and on a large table that is an
outage rather than a migration. Adding a nullable column is instant. A bare `SET NOT NULL` is
not — it scans the whole table under that lock. The safe route is a `NOT VALID` check
constraint, then `VALIDATE CONSTRAINT` (which does not block writes), then `SET NOT NULL`.
Check your database's documentation for which operations are instant before running one against
a table with rows in it; the answer changes between versions and it is the difference between a
deploy and an incident.

**Where this stops being this stage's job:** deciding the *shape* of a safe change is
architecture and belongs here. Running it — where migrations live, how they are ordered against
a deploy, what happens when one fails halfway — is
[13 — Production Deployment](13-production-deployment.md)'s. Same split this stage already uses
for authentication and for contracts.

**Strangler fig**, for the other kind of evolution. "Start with one application" told you to
split something out only when a concrete trigger fires, which is only credible advice if
splitting later is actually possible. This is how: put something in front of the existing code,
route one path at a time to the replacement, run both until nothing reaches the old one, then
delete it. The system is never rewritten and never off.

Naming it matters because the alternative people reach for is a rewrite that has to reach
feature parity before anyone can use it, and that project has a well-documented ending. A
deferral with a technique attached is a plan. Without one it is a hope.

### Design the API contracts

A contract is a promise about shape, and its real cost is **who you can force to move when
you break it.** That is the same reversibility axis the stage opens on, which is why the
decision belongs here rather than in implementation.

| Contract | Cost to change | Why |
|---|---|---|
| An internal server action or function | Cheap | One codebase, and the compiler finds every caller |
| A public API someone else calls | Expensive | You do not know who depends on it and cannot make them move |
| A webhook you receive | Not yours to change | Somebody else owns the shape; you adapt |

A webhook is the row worth pausing on, because you inherit its delivery behaviour along with
its shape: **it will arrive twice eventually, and handling it has to be safe when it does.**
That is idempotency, and it is worked through in
[Sketch the system](#sketch-the-system) above, where the payment flow makes it concrete.

**A contract here means one callable surface with a shape somebody depends on** — a route, or
an exported function another feature calls. Not every internal helper. If it crosses a
feature boundary or leaves your process, it is a contract; if it is private to one module, it
is code.

Most solo projects live almost entirely in the first row, which is the argument for not
building a public API until something actually needs one. If your whole list lands in that
row, the sort is still worth thirty seconds: **the value is noticing you have nothing in rows
two and three yet, and knowing which item would move there first.** The mistake is not noticing the
moment you have moved into the second — a mobile client, a partner integration, a public
endpoint someone found — because from then on the shape is a commitment.

Three decisions worth making before the first row exists:

- **Route shape.** Resource-oriented (`/invoices/:id`) is the default because it is
  predictable, and predictable is most of what a contract is worth.

  It stops being obvious the moment your operations are verbs rather than documents.
  Approving a claim, withdrawing one, cancelling a shift: none of those is a create, read,
  update or delete on a noun. Two workable answers, and picking either consistently beats
  agonising. **Treat the verb as a sub-resource** (`POST /claims/:id/approve`), which keeps
  the noun in the path and reads naturally. Or **make the verb a noun** — an approval *is* a
  thing that happened, with an actor and a timestamp, and `POST /approvals` may be closer to
  your real model than a status flip. The second is worth a moment's thought rather than a
  reflex: if you would want to know later who approved what and when, the verb was an entity
  all along, and the thing-or-something-that-happened question in
  [Model the domain first](#model-the-domain-first) is where that gets caught.
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

So the decision is not which pattern to use. It is **which rule applies to which entity**,
written down per entity — and a rule may need two of these patterns joined by *and*, which is
the next paragraph. A system with a shared workspace will use all three across its entities, and
more than one on some of them. Getting this wrong is not an error you find later; it is a system that works
correctly for the person who built it and leaks for everyone else.

**And the patterns compose — one entity often needs two of them joined by *and*.** This is the
part that is easy to miss, because "one pattern per entity" invites you to pick the closest fit
and move on. Take the manager approving a shift swap. Role alone says "this caller is a
manager," and that is true of every manager in the company, including one who manages a
different team. What you actually need is:

```
Claim → Role ∧ Membership
        the caller holds 'manager' on the team that owns the shift
```

Write the conjunction down, because the version with one pattern missing does not fail — it
approves. A Kitchen manager signing off a Front-of-House shift is a working feature and a
privilege escalation at the same time, and nothing downstream flags it.

The general form: **ownership and membership answer "which rows", role answers "which
actions".** An entity where both questions have non-trivial answers needs both patterns, and
listing one per entity is how that gets missed.

Enforcement — where the check physically goes, and what happens when a route forgets — is
stage 05's, in
[05 — Development](05-development.md#server-actions-need-validation-and-authorization).

### Write the ADRs

For each expensive decision: context, choice, reasoning, consequences, alternatives.
Format and rationale in [10 — Documentation](10-documentation.md#document-decisions-not-descriptions).

Write them now, while the alternatives are fresh. Reconstructing why you chose something
eight months later produces a plausible story rather than the actual reasons.

"Every expensive decision has an ADR" is uncheckable until you say what counts as one
decision. The rule: **one ADR per thing that could be reversed independently.** "Next.js,
Postgres and Vercel" is three, because you could move the database without touching the
framework. "Auth.js with a Postgres adapter" is one, because unpicking either half means
redoing both.

What an ADR looks like — length, status field, naming, where the files live — belongs to
[10 — Documentation](10-documentation.md#document-decisions-not-descriptions), deliberately.
This stage decides *that* a decision needs recording and *what counts as one*; the format is
owned in one place so it stays consistent across all eighteen stages.

### Defer aggressively

"Aggressively" needs a test, or it is just a mood. Here is the one, and it is the stage's own
axis pointed at infrastructure:

> **Defer anything whose reversal does not require migrating stored data.**

Adding a cache later touches code. Adding a queue later touches code. Those are afternoons,
or at worst weeks, and you will make the decision with information you do not have today.

Things that pass the test — do not build them on day one:

- **Caching layer.** Postgres is fast. Add caching when you have a measured problem
  ([09](09-performance-optimization.md)).
- **A queue.** Until something genuinely exceeds request time.
- **Event sourcing** — storing every change as the source of truth and deriving current
  state by replaying it, rather than storing the current state directly. Almost certainly
  not. Worth knowing the boundary, because people talk themselves into thinking they are
  already doing it: **an audit table alongside normal rows is not event sourcing.** It is
  event sourcing only when the log is the truth and the tables you query are derived from it.
  A history of who approved what is an ordinary table and you should keep it.
- **CQRS** — separate models for writing and for reading. It travels with event sourcing and
  gets deferred for the same reason: two models to keep aligned, in exchange for read
  performance you have not yet been unable to get from one query.
- **A design system.** Component library plus consistency is enough for a long time.
- **Feature flags infrastructure.** A config object is fine until it is not
  ([13](13-production-deployment.md)).

Each of these solves a real problem. None of them solves a problem you have yet, and each
one makes every subsequent change more expensive.

**One item fails the test, and it used to be on the list above.** Multi-tenancy beyond a
`user_id` column looks like deferrable infrastructure and is not, because a tenant key is
stored data on every table — which the top of this stage classifies as decide-now. The two
rules pointed opposite ways, and the tie-breaker is the one you just read.

So split it. **Decide the axis now; defer everything built on top of it.** The axis is a
single question: is the tenant a *person* or an *organisation*? Everything else — invitations,
roles, per-tenant settings, billing — can wait, and should.

That question matters more than it looks. Where data is genuinely shared across a team,
`user_id` is not a lighter version of the right answer, it is the **wrong axis**: rows belong
to the organisation and the person is merely who touched them. Retrofitting `org_id` in place
of `user_id` is a migration of every table plus every query that ever touched one, which is
the most expensive shape of change this stage has a name for.

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
- **Pressure-test a reversibility claim.** "This is cheap to undo" has a falsifiable answer,
  and the test is at the top of this stage. Hand it the decision and the test, and make it
  argue the expensive case. A model is good at enumerating consequences and bad at deciding
  they are acceptable.
- **Argue down a characteristics list.** Ask for the ten things this system could need to
  be, then make it defend cutting six. The generating half is where it helps; the cutting
  half is where you find out whether your three were actually chosen.
- **Find the box you left out of the sketch.** Paste the container view and ask what a
  system like this usually talks to that is missing. It is good at this because it is
  pattern-matching against every similar system it has read, which is the one situation where
  that habit works for you.
- **Read a schema for the index you need.** Paste the DDL *and the queries your screens
  actually make*. Without the queries it will suggest indexes for imagined access patterns,
  which is worse than none.
- **Enumerate the failure modes of a dependency.** "What are all the ways a payment provider
  call can fail?" is list generation, which is the shape of work it is reliably good at. You
  still decide which ones are worth handling.
- **Order an expand-contract sequence for a specific change.** Give it the column and the
  current readers and have it produce the six steps. Then check the order yourself, because the
  step it tends to drop is the one that stops writing the old value.
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
- **Asked which style to use, it answers with the one it has read most about.** Not the one
  your characteristics select. It will produce a comparison table that looks like the one in
  "The shapes a system can take" and then recommend against your own constraints, with
  citations. This is the exact failure that section exists to prevent, so use it the same
  way: give it your three characteristics and make it derive the answer, rather than asking
  what to pick.
- **It invents scale.** Ask it to design for growth and it will design for growth you
  cannot describe, then justify the complexity with the number it made up.
- **Asked to make something resilient, it builds a resilience layer.** Retries, a breaker, a
  dead-letter queue and a health-check dashboard, for three third-party calls. This is the
  reach-for-distribution failure above in different clothes, and it is harder to spot because
  every individual pattern it names is real. Ask instead which single call is most likely to
  fail and what a timeout alone would do.
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
- The architecture style you chose, and the alternatives you rejected with a reason each
- The tenant axis, if the product has organisations or teams
- For each characteristic, one line on how you would know if it stopped holding
- The authorization rule per entity, including any that need two patterns joined by *and*
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
- [ ] A timeout on every external call, and a stated answer for each dependency being down
- [ ] Concurrent-edit strategy decided where two people can act on one row
- [ ] Each chosen characteristic has one line on how you would know it stopped holding
- [ ] Domain modeled in nouns and relationships, not tables
- [ ] Derived values computed; facts about a moment stored, and the difference stated per value
- [ ] Deletion behavior decided per entity
- [ ] Uniqueness constraints scoped correctly
- [ ] Constraints live in the database, not only in application code
- [ ] Tenant axis decided — person or organisation — and the key present on every table
      that holds tenant data
- [ ] Conditional rules expressed as partial unique indexes, not as check-then-insert
- [ ] Any change to stored data **on a system with users** planned as an expand-contract
      sequence, with no destructive step sharing a deploy with the code that needs it
- [ ] Indexes added for the queries you actually run, and no others
- [ ] API contracts decided, sorted by how expensive each is to change
- [ ] Auth strategy chosen, with an ADR
- [ ] Authorization rule written down per entity, including where two patterns must both hold
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

**Choosing a style before choosing characteristics.** The answer sounds identical either
way — "a modular monolith" — and only one of them is a decision. The other is a preference
you will not be able to defend the first time it is questioned, including by yourself.

**Retrying a write that is not idempotent.** The retry is the bug, not the failure it was
answering. Two charges, one purchase, and a customer who is right to be annoyed.

**A destructive migration in the same deploy as the code that needs it.** When the deploy goes
wrong the fix you want is a code rollback, and a dropped column is not one.

**Reading your own write from a replica.** The user saves, gets redirected, and their change is
missing. It is not a race you can retry your way out of — reads that must reflect a
just-finished write go to the primary.

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
