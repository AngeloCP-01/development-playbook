# 01. Product Discovery

> Find out whether the thing is worth building, before you spend three months building it.

**When this actually happens:** Before any code, and again before any significant new
feature. Revisited constantly — you are never permanently done with discovery.

---

## Entry criteria

- [ ] You have an idea, a complaint, or an observation about something being painful

That is genuinely all. Discovery is the stage that turns that into something worth
acting on.

---

## The work

### Start with the problem, not the solution

Ideas usually arrive as solutions: "an app that does X." Push back to the problem
underneath.

- **Solution:** "A dashboard showing project status."
- **Problem:** "I spend twenty minutes every Monday asking four people for updates."

The problem framing is more useful because it admits other solutions — some far cheaper.
Maybe the answer is a scheduled message, not a dashboard. You cannot see that while you
are attached to the solution.

Ask "why does that matter?" until you reach something about time, money, or risk. If you
cannot get there, the problem may not be real.

### The four questions

Answer these before writing code. Honestly, which is harder than it sounds when you are
excited about the idea.

**1. Whose problem is this?**

Specific people, not a category. "Freelance designers who invoice more than five clients
a month" is a real answer. "Small businesses" is not — it is too broad to design for, and
a product for everyone tends to fit nobody.

If the honest answer is "me," that is a legitimate and often excellent answer. Just be
clear about it, because the design changes: you can skip onboarding, skip settings, and
build exactly for one workflow. What you cannot do is assume others share it.

**2. What do they do today?**

Everyone already solves their problems somehow — a spreadsheet, a manual process, a
competitor, or tolerating it. That existing solution is what you are competing with, and
it has a large advantage: it already exists and people know it.

"They use a spreadsheet" is not a weak competitor. Spreadsheets are flexible, familiar,
and free. Beating one requires being substantially better at something specific, not
marginally better in general.

**3. How much does it hurt?**

The honest scale:

- **Annoying** — they will not switch. Do not build it.
- **Costly** — they might, if switching is easy.
- **Painful** — they will actively look for a solution.
- **Blocking** — they will pay today and tolerate rough edges.

Most ideas are annoying-tier, which is why most ideas should not be built. Aim for painful
or blocking.

**4. What happens if you do nothing?**

If the answer is "nothing much," that is a real finding. Not every problem needs solving,
and the cheapest project is the one you correctly decline.

### Talk to people, badly but at all

Even five conversations dramatically outperform zero. The failure mode is asking questions
that generate agreement rather than information.

**Bad:** "Would you use a tool that tracks invoices?" — people say yes to be nice. This
tells you nothing.

**Good:** "Walk me through what happened the last time you chased a late payment." —
produces facts about actual behavior.

Ask about the past, not the future. What people say they will do is unreliable; what they
did last Tuesday is data.

The strongest signal is what they already tried. Someone who built a spreadsheet, hacked
together a Zapier flow, or paid for a tool they abandoned has demonstrated real pain.
Someone who says "yeah that sounds useful" has demonstrated politeness.

### Validate before building

Cheapest to most expensive:

**Search for it.** If nobody is searching, either the problem is not felt or you are using
the wrong vocabulary. Both worth knowing.

**Find where they complain.** Reddit, forums, support threads, review sites for
competitors. Complaints about existing tools are the most useful research available —
free, specific, and unsolicited.

**Do it manually.** Before automating something, do it by hand for a few people. You learn
where the real difficulty is, which is usually not where you assumed. Many products are
worth running manually for a month before writing a line of code.

**Fake the front door.** A landing page describing the product with a signup form. Costs
an afternoon. Measures actual interest instead of politeness.

### Write it down

One page, no more:

```markdown
# Problem
Freelancers with 5+ clients lose track of unpaid invoices and chase
them late, or not at all.

# Who
Solo freelancers, 5-20 active clients, currently using a spreadsheet
plus manual emails.

# Evidence
- 6 conversations; 4 described chasing payments as their worst admin task
- 2 had built spreadsheet reminder systems themselves
- Existing tools are accounting suites — too heavy and too expensive
  for this one job

# Severity
Painful. One person reported ~$3k written off last year purely from
not following up.

# What success looks like
A user knows, without thinking about it, which invoices are overdue
and who to chase.

# What this is not
Not an accounting tool. Not tax filing. Not expense tracking.
```

The "what this is not" section is the most valuable and the most often skipped. Scope
creep is much easier to resist against something you wrote down while thinking clearly.

### Deciding not to build

A legitimate and underrated outcome. Reasons to stop here:

- The problem is annoying-tier
- The existing solution is good enough
- You cannot reach the people who have the problem
- The effort massively exceeds the pain

Stopping at this stage costs a few days. Stopping after three months of building costs
three months.

---

## Artifacts

- A one-page problem statement, including what it is not
- Notes from conversations, quoted rather than paraphrased
- Evidence: search data, complaint threads, competitor gaps
- An explicit go / no-go decision

---

## Definition of done

- [ ] The problem is stated without naming a solution
- [ ] The audience is specific enough to design for
- [ ] You know what they do today
- [ ] Severity is honestly assessed
- [ ] You have talked to at least a few real people, or deliberately chosen not to and
      accepted the risk
- [ ] You wrote down what this is *not*
- [ ] You made a real decision to proceed

---

## Scaling to a team

- **Write it down properly**, because now discovery has to transfer to people who were not
  in the conversations.
- **Share raw notes, not summaries.** Summaries lose the specific quotes that change
  minds.
- **Include an engineer in customer conversations.** Requirements passed through a game of
  telephone lose exactly the details that determine implementation.
- **Keep a decision log of what you declined and why**, or the same rejected idea returns
  quarterly.

---

## Traps

**Falling in love with the solution.** The idea arrives fully formed and exciting, and
discovery becomes a search for justification. Stay attached to the problem instead.

**Asking leading questions.** "Would this be useful?" always gets yes. Ask about the past.

**Talking only to people like you.** Your friends share your context and will validate
almost anything.

**Building for "small businesses."** Too broad to design for. Narrow until it feels
uncomfortably specific.

**Skipping discovery because the problem is yours.** Legitimate — but be explicit that you
are building for one user, and do not later assume you built for a market.

**Confusing interest with commitment.** "That sounds great" costs nothing. A signup, a
pre-order, or an existing hacked-together workaround costs something.

**Treating discovery as a one-time gate.** Every significant feature needs its own small
version of this. Feature requests are solutions too, and deserve the same push back to
the problem.
