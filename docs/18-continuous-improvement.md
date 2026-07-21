# 18. Continuous Improvement

> Decide what to build next using evidence rather than enthusiasm, and get better at
> building it.

**When this actually happens:** Continuously, with a deliberate look every few weeks. This
is where the loop closes and returns to
[01 — Product Discovery](01-product-discovery.md).

---

## Entry criteria

- [ ] Shipped and in use by real people
- [ ] Some way of observing what they do ([15 — Observability](15-observability.md))

---

## The work

### Two questions, kept separate

**Is the product getting better?** — are users better off?
**Is the process getting better?** — are you building more effectively?

Both matter. The second is invisible unless you look at it deliberately, which is why it
tends to go unexamined for years.

### What the data says

**Usage.** Which features are actually used? The answer is reliably surprising — the
feature you spent three weeks on has eleven users, and the one you built in an afternoon
is used daily.

Look for: features with almost no usage (candidates for deletion,
[17](17-maintenance.md)), flows people abandon partway, and paths people take that you did
not design for. That last one is the most valuable — people routing around your intended
design are telling you the design is wrong, in the most concrete way available.

**Errors as product signal.** Sentry is usually read as an engineering tool, but a
validation error firing constantly means the form is confusing, not that users are careless.
Repeated failed searches for the same term mean missing content or a broken search.

**Support conversations.** Every question is a documentation or design failure. The same
question three times is a design problem, not a documentation problem — nobody reads the
docs for something that should have been obvious.

Keep a running list of what people ask. It is a prioritized list of friction, written by
users, for free.

### Feature requests are solutions

When someone asks for a feature, they have already done the translation from problem to
solution, and they did it without knowing your system.

Push back to the problem, exactly as in [01](01-product-discovery.md):

> **Request:** "Can you add invoice templates?"
> **Question:** "What are you doing today that templates would replace?"
> **Answer:** "I copy last month's invoice and change the date and amount."
> **Real problem:** Recurring invoices, not templates.

Templates would have been the wrong feature — more work, and it would still require
manual editing every month. The problem was recurrence.

Count requests, but weight them. Ten users asking for the same thing is a signal. One
user asking loudly is one user.

### Deciding what is next

Rough ordering, most to least valuable:

1. **Things actively broken or painful for existing users.** Fixing friction beats adding
   features, almost always, and is consistently underrated because fixes feel less like
   progress than features do.
2. **Requests from multiple users** that trace back to a real problem.
3. **Things that unlock other things.**
4. **Your own ideas** — legitimate, especially when you are your own user, but weight them
   below evidence.
5. **Everything else** — the list that quietly never gets built, which is correct.

Apply [02 — Planning](02-planning.md) discipline: the default answer is still no. A
product that does three things well beats one doing twelve things adequately, and the
second is much more expensive to maintain.

### Improving the process

Every few weeks, honestly:

**What took longer than expected, and why?** Look for the recurring answer. "The deploy
was scary" three times is a process problem with a fixable cause.

**What broke, and what would have caught it?** Post-mortems already answer this
([16](16-incident-management.md)) — the value is in reading them together, where the
pattern shows up. Three incidents from migrations means the migration process needs work,
which is invisible when reading them one at a time.

**What did you do manually more than three times?** That is a script, a test, or a
runbook entry.

**What did you avoid because it was unpleasant?** Avoidance is a reliable signal of a real
friction point. A test suite you skip is too slow. A deploy you postpone is too risky.

Pick **one** improvement per cycle and actually do it. A list of fifteen process
improvements is a list nobody executes.

### Update the playbook

This document is the mechanism by which this playbook stays useful rather than becoming a
snapshot of what you believed in 2026.

When something bites you, add it to the relevant **Traps** section. When a practice
consistently helps, write it into **The work**. When advice has been skipped three times
running, delete it — it is not advice you follow, it is clutter you scroll past.

The Traps sections are the highest-value part of this playbook precisely because they
accumulate from your actual experience rather than general principle.

### Knowing when to stop

Not every product should keep growing. Legitimate reasons to stop adding features:

- It solves the problem it set out to solve
- The remaining requests are from people it was never for
- Maintenance cost exceeds the value of new features

A finished product that works is a good outcome, not a failure of ambition. The
alternative — adding features to justify continued work — makes it worse for the people
already using it.

---

## Artifacts

- A prioritized list of next work, tied to evidence
- A running record of user friction from support and errors
- One process improvement per cycle, completed
- An updated playbook

---

## Definition of done

Never done — it is a loop. Per cycle:

- [ ] Reviewed usage data for what is actually used
- [ ] Reviewed errors as product signal, not just engineering signal
- [ ] Feature requests traced back to problems
- [ ] Next work chosen from evidence, with the reasoning written down
- [ ] One process improvement identified and completed
- [ ] Playbook updated with anything learned

---

## Scaling to a team

- **Run retrospectives**, and make the output one or two committed actions rather than a
  long list of observations.
- **Share user feedback widely.** Engineers who never hear from users build for imagined
  ones.
- **Make prioritization reasoning visible**, or it reads as arbitrary and people
  disengage.
- **Watch for feature factory dynamics.** Measuring output rather than outcomes produces a
  lot of shipping and not much improvement.
- **Rotate who runs the retrospective** so it does not become one person's ritual.

---

## Traps

**Building what is loudest rather than what is common.** One vocal user is not a trend.

**Taking feature requests literally.** They are solutions. Find the problem underneath;
the right feature is often different and usually smaller.

**Adding features to feel productive.** Shipping feels like progress. Removing friction
usually creates more value and feels like less.

**Never deleting.** Every unused feature is permanent cost. Check usage, then delete.

**Retrospectives with no actions.** Discussion without change is a meeting.

**More than one process improvement at a time.** Fifteen improvements is zero
improvements.

**Ignoring your own avoidance.** The thing you keep postponing is the thing that most
needs fixing, and the postponement itself is the diagnostic.

**Letting the playbook go stale.** Advice you no longer follow makes the rest less
trustworthy. Prune it.
