# 02. Planning

> Decide what to build first, and what you are deliberately not building at all.

**When this actually happens:** After [01 — Product Discovery](01-product-discovery.md),
before [03 — Architecture](03-architecture.md). Revisited every time scope shifts, which
is often.

---

## Entry criteria

- [ ] A written problem statement with a real audience ([01](01-product-discovery.md))
- [ ] An honest severity assessment
- [ ] A decision to actually build this

---

## The work

### Define done before defining work

Not "the app is finished" — a specific, checkable state:

> A freelancer can add a client, issue an invoice, and see at a glance which invoices are
> overdue.

That is a scope boundary you can hold a feature request against. Everything else is
version two, and saying so now is much easier than saying it in six weeks under
enthusiasm.

### Cut to the core

List every feature you can imagine. Then, for each one, ask: **does the definition of
done fail without this?**

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

Solo, skip time estimates entirely. You are not reporting to anyone, and a self-imposed
deadline mostly generates guilt and shortcuts.

### Timebox the unknowns

When something is unknown enough to make estimation meaningless, spike it: a timeboxed
investigation with a specific question and a hard stop.

> **Spike:** Can Stripe Connect handle the payout model we need?
> **Timebox:** 4 hours.
> **Output:** A decision, written down. The code is discarded.

The output is knowledge, not code. If you are keeping the code, it was not a spike — it
was untested, unreviewed work that has now entered your codebase through the side door.

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
- Date/timezone handling for "overdue" is fiddlier than it looks

## Open questions
- Do overdue calculations use the client's timezone or the user's?
```

The "Not in v1" list is the part that does actual work over the following weeks.

### Replan without guilt

The plan is a current best guess, not a commitment. Slices will turn out harder than
expected, and building slice 1 will teach you that slice 3 was wrong.

Update the plan. That is not failure — it is the plan doing its job. What *is* failure is
following a plan you know is wrong because you wrote it down.

---

## Artifacts

- A one-page plan: done, slices, exclusions, risks, open questions
- A "not now" list, prioritized
- Spike results, recorded as decisions

---

## Definition of done

- [ ] "Done" is specific and checkable
- [ ] Every feature justified against that definition, or cut
- [ ] Work sequenced as vertical slices, each independently shippable
- [ ] Riskiest slice scheduled early
- [ ] Exclusions written down explicitly
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
