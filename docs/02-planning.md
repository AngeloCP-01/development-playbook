# 02. Product Planning

> Decide what to build first, what you are deliberately not building at all, and where it
> goes after that.

**When this actually happens:** After [01 — Product Discovery](01-product-discovery.md),
before [03 — Architecture](03-architecture.md). Revisited every time scope shifts, which
is often.

---

## Entry criteria

This stage plans what to build. It assumes you already know the thing is worth building —
which is the job of [01 — Product Discovery](01-product-discovery.md). If you have not
been through discovery, do that first. Planning what to build before you know whether it
should be built is planning in the dark, and no amount of good planning fixes a problem
nobody has.

You are ready to plan when you have discovery's output:

- [ ] A written problem statement with a real audience ([01](01-product-discovery.md))
- [ ] An honest severity assessment — how much the problem actually hurts ([01](01-product-discovery.md))
- [ ] A decision to actually build this

---

## The work

### What "planning" means here

*Product planning* covers more ground elsewhere than it does in this stage. The standard
treatment runs seven steps — ideate, research the market, set vision and goals, write
specifications, build a roadmap, prototype, launch — which spans most of this playbook
rather than one document of it.

This stage is the middle of that band:

| Elsewhere in the phrase | Here |
|---|---|
| Ideation, market research, prototyping | [01 — Product Discovery](01-product-discovery.md) |
| **Vision and goals, specification, roadmap** | **This stage** |
| Launch | [13 — Production Deployment](13-production-deployment.md) |
| Lifecycle, sunsetting | [17](17-maintenance.md), [18](18-continuous-improvement.md) |

So the question is not whether to build. You settled that in discovery. What is left is
deciding what "built" means, what is in v1, in what order it gets made, and where it goes
afterwards.

### Define done before defining work

Not "the app is finished" — a specific, checkable state:

> A freelancer can add a client, issue an invoice, and see at a glance which invoices are
> overdue.

That is a scope boundary you can hold a feature request against. Everything else is
version two, and saying so now is much easier than saying it in six weeks under
enthusiasm.

### Cut to the core

List every feature you can imagine. Then, for each one, ask: **does the outcome fail
without this?**

Read that as the outcome, not the sentence. The definition of done is a short line, and
plenty of necessary features are not spelled out in it — "edit an invoice" is nowhere in
the example above, but an invoice you cannot correct makes "see which are overdue" wrong
the moment a client's details change, so it fails the outcome even though it fails no
word of the sentence. The test is about the state you are trying to reach, not the wording
you happened to use. When in doubt, ask whether a real user could get the result they came
for without it.

Most features fail that test. For an invoice tracker:

| Feature | Core? |
|---|---|
| Create an invoice | Yes |
| Mark it paid | Yes |
| See overdue invoices | Yes |
| Email reminders | No — the user can send the email |
| PDF export | No — v2 |
| Multi-currency | No — until someone asks |
| Team accounts | No — the audience is solo freelancers |
| Dark mode | No |

What survives that test is your **minimum viable product** — the smallest thing that
delivers the outcome you just defined. The name is worth knowing because you will meet it
everywhere. It is also worth distrusting, because most people use it to mean "version one
with the hard parts removed," which is a different and worse thing. If what you have left
cannot deliver the outcome, it is not minimum. It is unfinished.

The rejected items are not gone. They go on a list, in priority order, and get built when
real usage justifies them — not when you imagine it might.

**The default answer to any feature is no.** Every feature is permanent: it needs
maintenance, tests, documentation, and it constrains every future change. Features are
easy to add and genuinely hard to remove.

### Sequence in vertical slices

Order work so each step produces something demonstrable.

**Wrong (layer-first):**
```
1. Design the full schema
2. Build all the queries
3. Build all the UI
```
Nothing works until step 3, you learn nothing until step 3, and the schema was designed
before you understood the problem.

**Right (vertical slices):**
```
1. Create and view one invoice          → something works end to end
2. Mark it paid                          → the core loop closes
3. List invoices with overdue highlight  → the actual value appears
4. Clients as first-class records        → the model deepens
5. Auth and multi-user                   → it becomes usable by others
```

Each slice touches schema, server, and UI. Each is independently shippable. Crucially,
each teaches you something before you commit to the next.

Put the **riskiest slice early**. If a third-party integration might not work, find out in
week one, not week eight.

### Estimate for sequencing, not for promises

Estimates are unreliable, and that unreliability is not a discipline problem you can fix
by trying harder. Use them comparatively:

- **Small** — a day or less
- **Medium** — a few days
- **Large** — a week or more; almost always means "not yet decomposed"

Anything Large should be broken down until it is not. A task you cannot decompose is a task
you do not yet understand well enough to start.

There is a sharper version of this idea. Rather than estimating how long something will
take, decide how much time it is **worth** — its appetite — and then design something that
fits. An estimate starts with a design and ends with a number; an appetite starts with a
number and ends with a design. Solo, appetite is usually the more useful of the two, because
you control the scope and nobody is holding you to the figure.

Solo, skip time estimates entirely. You are not reporting to anyone, and a self-imposed
deadline mostly generates guilt and shortcuts.

### Timebox the unknowns

Some unknowns are not scope questions but **feasibility** questions: can this be built at
all, with the tools, data and budget available? Discovery tested whether anyone wants the
thing. This tests whether you can make it. Both can sink a project, but they sink it at
different prices: wanting turns out to be cheap to check, and buildability is not.

When something is unknown enough to make estimation meaningless, spike it: a timeboxed
investigation with a specific question and a hard stop.

> **Spike:** Can Stripe Connect handle the payout model we need?
> **Timebox:** 4 hours.
> **Output:** A decision, written down. The code is discarded.

The output is knowledge, not code. If you are keeping the code, it was not a spike — it
was untested, unreviewed work that has now entered your codebase through the side door.

That written decision is the handoff. [03 — Architecture](03-architecture.md) consumes it
directly: a spike settling "can this provider do what we need" is what turns an
architecture decision from a guess into a choice you can defend later.

### Write the plan

Short. A plan longer than a page will not be read, including by you.

```markdown
# Invoice Tracker — v1

## Done means
A freelancer can add a client, issue an invoice, and see which are overdue.

## Slices
1. Create + view an invoice          [M]
2. Mark paid                         [S]
3. Overdue list                      [S]
4. Clients as records                [M]
5. Auth + multi-user                 [M]

## Not in v1
Email reminders, PDF export, multi-currency, teams, dark mode,
recurring invoices, expenses.

## Risks
- Auth choice affects the data model → decide in [03](03-architecture.md)
  before slice 4
- "Overdue" spans timezones, so a naive date comparison can mark an invoice
  overdue a day early → confirm with a test before slice 3 ships

## Open questions
- Do overdue calculations use the client's timezone or the user's?
```

**Risks and open questions are not the same list**, and the difference decides what you do
about each. A **risk** is something that could go wrong — you name it so you can plan a
mitigation or a decision-point before it bites. An **open question** is a choice you have
not made yet but will have to — you name it so it is decided on purpose rather than by
accident. A rough test: a risk is a sentence about *danger* ("this could break"); an open
question is a sentence with a *fork* in it ("do we do A or B?"). The timezone example is
both, because most real unknowns have a danger side and a decision side — file the danger
under Risks and the decision under Open questions, as above.

Resolving an open question has exactly two moves. If it is a *feasibility* question — can
this be built at all — spike it (next section). If it is a *choice* — which of two
workable options — just make the decision and write it down, or set the trigger that will
make it for you ("decide once a paying user actually needs multi-currency"). What you do
not do is leave it to be discovered in the code.

The "Not in v1" list is the part that does actual work over the following weeks.

### Set the horizon

The plan covers v1. It says nothing about where the product goes after that, and without
that, the MVP reads as a list of things you cut instead of a first step toward something.

Three horizons, and no dates.

**Now** is the MVP: whatever the cut left standing.

**Next** is what earns its way in, in priority order. "Priority order" needs a method, or
it collapses into whatever you feel like building. The lightweight one, and the right one
for a small product, is **value against effort**: for each item, weigh how much it is
worth against how much it costs.

- **Value** is how much pain it removes times how often that pain is felt. A thing that
  badly blocks even one core user beats a mild convenience a dozen people mention in
  passing. Count the hurt, not the votes — "three people asked" is a weak signal on its
  own, because the loudest request is rarely the most painful problem.
- **Effort** is the size you already gave it — the S / M / L from the sizing step.

Order by the best value for the least effort: the cheap, high-value items go first, the
expensive low-value ones may never get built at all. This is the *impact-effort matrix*,
the plainest of a family of prioritization methods you will meet by name — RICE, ICE and
MoSCoW are the heavier, more formal versions, useful once you have real usage data and
more items than you can hold in your head. Solo, at this size, value against effort is
enough.

Each item still waits on *evidence* rather than a date: you move it up when real usage
shows the pain is real, not when the calendar says so.

**Later** is the product you are actually building toward, written as a paragraph rather
than a feature list. Without it, nothing in "Next" has anything to be judged against.

```markdown
## Now
Create an invoice, mark it paid, see what is overdue.

## Next
Recurring invoices — when a user has billed the same client three months running.
PDF export — when someone asks twice.

## Later
The thing a freelancer opens on Monday to see exactly who owes them money and who
to chase, and then does not open again that week.
```

The dates are what turn a roadmap into a promise, and a promise makes replanning expensive.
That is the plan-as-contract failure named below, and it is worth avoiding by construction
rather than by discipline. Horizons carry the sequence without the commitment.

"Next" is what [18 — Continuous Improvement](18-continuous-improvement.md) consumes once
real usage starts producing evidence. Until then it is a hypothesis in priority order.

### Replan without guilt

The plan is a current best guess, not a commitment. Slices will turn out harder than
expected, and building slice 1 will teach you that slice 3 was wrong.

Update the plan. That is not failure — it is the plan doing its job. What *is* failure is
following a plan you know is wrong because you wrote it down.

---

## Artifacts

- A one-page plan: done, slices, exclusions, risks, open questions
- A horizon: now, next, later — with "later" written as a paragraph
- A "not now" list, prioritized
- Spike results, recorded as decisions

---

## Definition of done

- [ ] "Done" is specific and checkable
- [ ] Every feature justified against that definition, or cut
- [ ] Work sequenced as vertical slices, each independently shippable
- [ ] Riskiest slice scheduled early
- [ ] Exclusions written down explicitly
- [ ] A "later" written down, so the MVP reads as a first step rather than only as a cut
- [ ] Nothing left estimated as Large
- [ ] Open questions listed, with a plan to resolve them

---

## Scaling to a team

- **The plan becomes a coordination tool**, not just a memory aid. It needs to be
  discoverable and current.
- **Slices must be genuinely independent** or people block each other. Dependencies
  between parallel work are a planning bug.
- **Make the "not now" list visible** so it is not relitigated in every conversation.
- **Beware plan-as-contract.** The moment a plan becomes a promise to stakeholders,
  replanning becomes politically expensive and people follow plans they know are wrong.
- **Do estimate now** — others need to coordinate around your work — but in ranges, and
  revise openly.

---

## Traps

**Planning the whole product.** Detail beyond a few weeks is fiction. Plan v1 properly and
sketch the rest.

**Layer-first sequencing.** Nothing works until everything works, and you learn nothing
until the end.

**No explicit exclusions.** Without a written "not in v1," every good idea gets absorbed
and v1 never ships.

**Estimating in hours.** False precision. The number becomes a commitment, and the
commitment produces shortcuts.

**Leaving Large tasks undecomposed.** Large means "not understood." Decompose until the
work is visible.

**Spikes that become production code.** Untested, unreviewed exploration entering the
codebase because it happened to work.

**Treating the plan as immutable.** The plan serves the work.

**Planning to avoid starting.** Past a point, planning is procrastination in a
respectable outfit. One page, then build slice one.
