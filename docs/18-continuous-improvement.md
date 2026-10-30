# 18. Continuous Improvement

> Choose the next improvement from evidence, then check whether it helped users or
> made delivery safer and more effective.

**When this actually happens:** Continuously, with a deliberate review every few
weeks and after important findings or incidents. Stage numbers are filing codes,
not a sequence. This work feeds [Product Discovery](01-product-discovery.md),
[Planning](02-planning.md) and whichever practice needs attention.

---

## Entry criteria

- [ ] A product, prototype or delivery practice with a question worth investigating
- [ ] Evidence you can inspect, or a named gap and a way to gather it
- [ ] Someone who can choose an action and return to review its result

A live product adds usage and support evidence. Before launch, use observed task
attempts and delivery experience; label what remains untested with real users.
This repository's traffic, support volume and product outcomes are unknown here.
The examples below are fictional, not reports about the playbook application.

---

## The work

### Two questions, kept separate

**Is the product getting better?** Can intended users accomplish something they
value, with acceptable effort and risk?

**Is delivery getting better?** Can the people maintaining it make useful changes
safely, without avoidable delays or unsustainable work?

Shipping more changes does not establish that users are better off. Keep product
outcomes, delivery measures and people's experience visible separately.

| Question | Useful evidence | What it cannot establish alone |
| --- | --- | --- |
| Can users finish the task? | Completed attempts out of eligible attempts, observed failures, user feedback | Why someone abandoned a task |
| Does the product help the intended audience? | Task results and relevant follow-up, segmented by audience | Value from clicks or time spent alone |
| Can changes reach production safely? | Delivery times, deployment failures and recovery records | Whether the changes solved a useful problem |
| Is the work sustainable? | Team feedback, interruptions, waiting and rework | Individual performance from commit counts |

Start with a goal, identify observable signals, then define a metric. This
Goals-Signals-Metrics approach comes from the
[HEART work by Rodden, Hutchinson and Fu](https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/).
Choose measures that fit the task. More time spent can mean engagement in a
reading product and difficulty in an invoice form.

### What the data says

Treat usage, errors and support conversations as evidence to investigate.
[GOV.UK's research analysis guidance](https://www.gov.uk/service-manual/user-research/analyse-a-research-session)
separates what someone did or said from the finding and the action it suggests.
Keep that distinction in your notes.

| Observation | Possible explanation | Check before acting |
| --- | --- | --- |
| Few recorded uses of an export | Low demand, seasonal use, poor discovery or missing events | Who needs it, when, and whether successful uses are recorded |
| Repeated validation errors | Unclear instructions, a defect, incompatible input or automated traffic | Affected tasks, input rules and a reproduction |
| Several support questions about one step | Confusing design, missing guidance or a policy users need explained | Original conversations and an observed task attempt |
| A funnel drops sharply after a release | A regression, a changed audience or broken instrumentation | Event definitions, release timing and comparable cohorts |

For each measure, record the population, date window, numerator and denominator,
and what the events mean. Distinguish users from sessions and repeated attempts.
Check whether retries, missing events or a changed definition distort the result.
A support queue represents people who contacted you; it is not a survey of all
users. Include people whose access needs or low usage make them easy to miss.

Low usage is a reason to investigate retirement, not enough evidence to delete.
Check critical workflows, seasonal needs, accessibility, commitments and migration
options using [Maintenance](17-maintenance.md). One report of serious harm can
outweigh many requests for convenience.

### Feature requests are solutions

Ask about the task before committing to the requested implementation, as in
[Product Discovery](01-product-discovery.md).

**Fictional conversation:**

> **Request:** "Can you add invoice templates?"
> **Question:** "What are you doing today that templates would replace?"
> **Answer:** "I copy last month's invoice and change the date and amount."

Recurring invoices are one hypothesis. Templates might still fit if the items,
recipients or amounts vary. Observe the workflow and check which details change,
who approves the result and whether automatic sending would be safe. That answer
narrows the investigation; it does not prove a feature choice.

Record independent users and affected tasks rather than counting repeated messages
as separate demand. Look at severity, reach and the intended audience as well as
frequency. Keep contradictory evidence alongside supporting examples.

### Deciding what is next

First route active incidents through [Incident Management](16-incident-management.md)
and urgent security issues through [Security Audit](08-security-audit.md). Do not
wait for a routine improvement review to contain harm.

For ordinary work, use this playbook's suggested decision checklist:

1. Name the user or delivery problem and link the observations behind it.
2. Describe the harm, reach, urgency and uncertainty. Include minority needs.
3. Compare a small repair, a new capability, further research and doing nothing.
4. Estimate effort, ongoing maintenance and how easily you can reverse the change.
5. Choose the smallest useful action and record why the alternatives can wait.

Fixing evidenced friction is a useful default, but it is not a universal ranking
above new work. An uncertain opportunity may deserve research; a low-frequency
failure may deserve immediate repair. Use [Planning](02-planning.md) to make the
tradeoff explicit. A score can organize the discussion without deciding it for you.

### Run an improvement cycle

The Deming Institute describes
[Plan-Do-Study-Act (PDSA)](https://deming.org/explore/pdsa/) as a learning cycle:
make a prediction, try a change, study what happened and adjust the approach.
The following record is this playbook's practical adaptation.

| Field | Write down before the change |
| --- | --- |
| Problem and evidence | Affected task, observations, links and known gaps |
| Hypothesis | Why this change might improve that task or delivery practice |
| Baseline and outcome | Comparable population, window, counts and desired change |
| Guardrails | What must remain acceptable, with a stop or rollback condition |
| Action and owner | Small change, responsible person and effort limit |
| Review | Date, measurement method and who decides what follows |

At the review, add the actual evidence, its limits and a decision: keep, adapt,
revert or investigate further. Completing an action closes the task; studying its
result closes the learning cycle. An inconclusive result is a valid outcome.

**Fictional worked example:** Over two weeks, 18 of 30 eligible first-time invoice
attempts reached a saved draft. Three observed participants overlooked a required
date field. The hypothesis is that clearer date guidance will help people save a
draft. Jo owns a small copy change, with a review after another two-week window.
The illustrative target is 24 of 30 attempts; it is a decision aid, not a
statistical significance threshold. Stop and investigate if a saved draft accepts
an invalid date. Check keyboard completion before release.

At review, 20 of 28 attempts reached a draft, but a campaign changed the audience.
That is not proof the copy caused an improvement. Jo records the result as
inconclusive, checks event quality and observes more task attempts before deciding
whether to keep or revise the guidance. The target was not met; the comparison is
also weaker than planned.

A before/after chart can reflect seasonality, audience changes or other releases.
If a randomized experiment is appropriate, plan its population, measures, sample
needs and stopping method first. Check assignment and telemetry quality and use
methods that account for repeated looks at the results. Monitor harm throughout;
do not declare a winner from a convenient early movement. Microsoft's
[experimentation guidance](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/)
explains data-quality checks, guardrails and early-peeking risks. With sparse
traffic, a bounded usability study may be more useful; label what it cannot tell
you about population-wide impact.

### Improving the process

Review the work people actually did: where it waited, what needed rework, what
felt risky and which manual tasks recurred. Ask why someone avoided a test or
release. Slowness, uncertainty, competing work and a missing permission suggest
different fixes. A repeated workaround is a clue, not a diagnosis.

Use [incident follow-ups](16-incident-management.md) to look for recurring system
conditions. Keep the discussion blameless and assign an owner to the selected
change. A solo developer can use the same questions in a short written review.

For delivery, [DORA's current guide](https://dora.dev/guides/dora-metrics/) names
five measures: change lead time, deployment frequency, failed deployment recovery
time, change fail rate and deployment rework rate. Recovery here concerns failed
deployments requiring intervention, not every incident. Interpret the measures
together for one application or service over time; avoid quotas and comparisons
between unlike services.

Pair delivery data with people's experience. The
[SPACE research](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/)
explains why activity alone cannot measure developer productivity. Commit counts,
lines of code and AI-generated output are not individual performance scores.

Start with one manageable process improvement when capacity is tight. Give it an
owner, a review date and a way to see whether it helped. This is a work-in-progress
heuristic, not a rule that prevents urgent parallel repairs. The
[2020 Scrum Guide](https://scrumguides.org/scrum-guide.html#sprint-retrospective)
calls for useful changes to improve quality and effectiveness; it does not require
exactly one action per retrospective. Check the previous action before adding
another list of promises.

### Update the playbook

When experience changes the advice, update the relevant chapter and its
hand-ported interactive page together. Record what happened, the conditions and
the check that would catch a recurrence. Keep source findings in the research
record and completion evidence in the tracker.

If a practice keeps being skipped, ask whether it is unnecessary, too costly or
poorly explained. Revise or retire it with a reason. Skipping a safeguard does not
establish that its risk disappeared. Preserve decision history when advice changes.

### Knowing when to stop

A useful decision can be to maintain the product without adding features. Check
whether it still solves the intended problem, whether remaining requests fit its
audience, and whether added value justifies ongoing cost. Assign maintenance and
support responsibilities even when feature work pauses.

If the evidence changes, return to discovery. If the product should be retired,
follow the migration and recovery checks in [Maintenance](17-maintenance.md).
Improvement is recurring work; Stage 18 is not a finish line for the other stages.

### AI in continuous improvement

These are proposed assistance workflows. Their output needs review against the
supplied evidence; they do not establish demand, causality or product success.
Use only material permitted for the selected tool and remove unnecessary personal
or confidential detail before supplying support or research records.

| Play | Supply and ask | Verify before using the result |
| --- | --- | --- |
| Group feedback | De-identified observations with stable IDs; ask for themes, exceptions and links to each item | Compare themes with originals, keep minority needs visible and separate distinct users from repeat messages |
| Critique a measure | Goal, event definitions, population and counts; ask for missing denominators and alternative explanations | Check instrumentation and calculations; reject invented baselines or claims of causality |
| Draft a small experiment | Evidence, hypothesis, capacity and constraints; ask for an action, guardrails and review method | A person approves exposure, stopping conditions and the decision; do not let the model choose a winner |
| Review process friction | Redacted delivery records and prior actions; ask for recurring waits and testable changes | Confirm cited events, seek team context and assess AI assistance by useful outcomes and rework, not output volume |

A useful prompt constraint is: "Separate observation, interpretation and proposal.
Cite the supplied IDs. List missing evidence and contradictory cases. Do not invent
users, quotes, counts or results." Check that it followed those instructions.
Synthetic feedback can help rehearse analysis but must stay labelled as synthetic;
it cannot replace observations from intended users.

---

## Artifacts

- An evidence list that separates observations, interpretations and unknowns
- A short decision record for chosen and deferred work
- An improvement record with owner, baseline, guardrails, review and result
- Updated guidance when the evidence supports changing it

---

## Definition of done

Continuous improvement recurs. For each review:

- [ ] Product outcomes and delivery/process signals considered separately
- [ ] Evidence checked for population, measurement gaps and contrary cases
- [ ] Requests traced to tasks; serious minority needs considered
- [ ] Action or deliberate deferral chosen with its reasoning
- [ ] Owner, baseline, guardrails and review method recorded for selected work
- [ ] Previous action reviewed, including an inconclusive result where appropriate
- [ ] Relevant chapter and interactive content updated when guidance changes

---

## Scaling to a team

- Review product findings with the people who build and support the service.
- Use retrospectives to inspect working conditions and choose practical changes.
- Make owners, tradeoffs and follow-up visible; rotate facilitation when useful.
- Look across incidents for recurring conditions without ranking or blaming people.
- Keep outcome measures alongside delivery data so shipping volume does not become
  the purpose of the work.

---

## Traps

**Treating a signal as a diagnosis.** A failed search needs investigation; it does
not prove missing content.

**Counting only the loudest or most common requests.** Frequency can hide serious
harm affecting a few users.

**Deleting from usage counts alone.** Verify instrumentation and rare but important
workflows before proposing retirement.

**Calling a before/after change causal.** Record competing explanations and the
limits of the comparison.

**Optimizing the metric.** More deployments or clicks can coexist with worse user
outcomes. Check quality and guardrails.

**Closing the action without reviewing its result.** Record what changed and what
you learned, including uncertainty.

**Using a retrospective to assign blame.** Inspect system conditions and agree on
an owned change.

**Letting AI summaries become evidence.** Check the source observations and keep
unsupported conclusions out of the decision record.

**Pruning a safeguard because it was skipped.** Inspect the risk and cost before
changing the advice.

---

## Sources and research

Primary-source findings, original visual references and reuse limits are in the
[Stage 18 research record](../reference/stage-18-source-research.md). The cycle
record, worked example, prioritization checklist and AI plays are this playbook's
teaching adaptations, not prescribed standards or measured project results.
