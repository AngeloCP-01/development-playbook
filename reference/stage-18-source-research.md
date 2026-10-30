# Stage 18 continuous improvement source research (2026-10-30)

Research for [Continuous Improvement](../docs/18-continuous-improvement.md)
and a possible later W-6 companion. This record assesses the original chapter;
its correction recommendations are not claims about measured project outcomes.
No interactive stage or reference sheet is implemented here.

## Scope and method

Read the chapter, check categorical claims, distinguish product outcomes from
delivery measures, and identify a small learning loop with an explicit review.
All sources below were accessed **2026-10-30**. Live guidance has no fixed version
unless stated. Examples and proposed record fields are editorial applications,
not source-prescribed templates. No production analytics, support conversations,
incident records or experiment results were examined.

## Primary sources and supported findings

### 1. Retrospectives should lead to changes

**Source:** [The Scrum Guide](https://scrumguides.org/scrum-guide.html), Ken Schwaber
and Jeff Sutherland, **November 2020**.

The Sprint Retrospective examines how the Sprint went across people,
interactions, processes, tools and the Definition of Done. It identifies helpful
changes and addresses the most consequential improvements promptly. Selected
improvements may enter the next Sprint Backlog.

**Application:** Keep the action-oriented retrospective, but label a fortnightly
review and one small improvement as suggested starting habits. The guide does
not require exactly one action or prescribe rotating facilitators. A solo
review can borrow the questions without claiming to implement Scrum. Completion
of an action should be followed by a check of its effects.

### 2. Deming's learning cycle uses Study

**Source:** [PDSA Cycle](https://deming.org/explore/pdsa/), The W. Edwards Deming
Institute, live explanatory page.

The Institute distinguishes **Plan-Do-Study-Act** from PDCA. Study compares
observed results with a prediction and can revise the underlying theory. Act
uses that learning to change the goal, method or next experiment. The page
credits Walter Shewhart's influence on Deming.

**Application:** If the chapter names Deming's cycle, use PDSA and explain the
comparison with the prediction. Do not describe Deming as simply the inventor
of PDCA. A small change record can name the problem, hypothesis, baseline,
expected outcome, owner, review date and decision. These fields are this
playbook's proposed application, not a quotation of a required PDSA template.

### 3. DORA now describes five delivery measures

**Source:** [DORA's software delivery performance metrics](https://dora.dev/guides/dora-metrics/),
Nathen Harvey, DORA/Google, live guide.

The current five are change lead time, deployment frequency, failed deployment
recovery time, change fail rate and deployment rework rate. The first three
form throughput; the latter two describe instability. Recovery concerns a
failed deployment needing intervention, not every operational incident.
Rework concerns unplanned deployments caused by production incidents.

The guide recommends application/service context and improvement over time.
Blending unlike services, competition, siloed ownership and measurement without
improvement can mislead.

**Application:** Preserve the distinction between product value and delivery
performance. If adding DORA, name all five correctly and date the reference.
Use them to discuss the delivery system, not rank individuals. Pair measures
with explanations and local bottlenecks. Do not imply that faster shipping
establishes better user outcomes or that this repository already collects them.

### 4. Productivity needs several perspectives

**Source:** [The SPACE of Developer Productivity: There's more to it than you think](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/),
Nicole Forsgren, Margaret-Anne Storey, Chandra Maddila, Tom Zimmermann,
Brian Houck and Jenna Butler; **ACM Queue 19(1), February 2021**.

The authors reject measuring productivity with a single metric or dimension.
Activity counts and engineering-system efficiency alone do not capture it.

**Application:** Combine observed workflow costs with the team's experience
and delivered outcomes. Do not turn commits, lines of code, tickets closed or
AI output volume into a productivity score. The publisher article returned
HTTP 403 during this pass; the Microsoft author publication page supports the
bounded finding above. No detailed SPACE scoring recipe is claimed here.

### 5. Start user metrics from goals

**Sources:** [Measuring the User Experience on a Large Scale](https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/),
Kerry Rodden, Hilary Hutchinson and Xin Fu, Google, **ACM CHI 2010**;
[the author's HEART introduction](https://kerryrodden.com/heart), Kerry Rodden,
live resource page.

HEART covers Happiness, Engagement, Adoption, Retention and Task success.
Goals-Signals-Metrics connects measurement choices to product goals. The
framework concerns the quality of user experience, not just aggregate traffic.

**Application:** Name the reader/user task before selecting a metric. Specify
which users, time window and eligible opportunities a rate covers. Increased
activity can reflect confusion; fewer visits can reflect quicker task
completion. Those are illustrative interpretations requiring investigation,
not findings about this site. The Google abstract and author introduction support these findings. The
original PDF's reuse notice is recorded below; no artwork is reproduced.

### 6. Experiments need trustworthy comparisons

**Source:** [Controlled experiments on the web: survey and practical guide](https://link.springer.com/article/10.1007/s10618-008-0114-1),
Ron Kohavi, Roger Longbotham, Dan Sommerfield and Randal M. Henne, Microsoft;
published online **30 July 2008**, journal volume **18 (2009), pp. 140-181**,
DOI **10.1007/s10618-008-0114-1**.

Randomized controlled experiments can establish causal relationships between a
change and observed behavior. The paper discusses technical and organizational
limits, including statistical power, sample size and randomization.

**Application:** A before/after change is evidence to inspect, not causal proof.
If traffic cannot support a useful controlled experiment, use interviews,
usability observations and a bounded change with a follow-up; state the weaker
inference. Do not manufacture confidence from small counts or treat a result
that fails to establish a benefit as proof of no effect.

**Additional source:** [Patterns of Trustworthy Experimentation: During-Experiment Stage](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/),
Microsoft Experimentation Platform, **25 January 2021**.

The guidance separates data quality, overall evaluation, diagnostic and guardrail
metrics. It discusses telemetry consistency, unexpected regressions,
segmentation and the risks of drawing conclusions from early results.

**Application:** Before testing, define success, harm checks and the intended
analysis/review. Check instrumentation and allocation before interpreting an
apparent win. Monitor harm throughout; do not repeatedly peek and stop at the
first attractive significance result without an appropriate analysis method.

### 7. Incident learning needs owned follow-up

**Source:** [Postmortem Culture: Learning from Failure](https://sre.google/workbook/postmortem-culture/),
Daniel Rogers, Murali Suriar, Sue Lueder, Pranjal Deo and Divya Sudhakar, with
Gary O'Connor and Dave Rensin; Google, **The Site Reliability Workbook, 2018**.

Google emphasizes system conditions rather than blame. Useful actions have
owners, priorities, tracking and verifiable end states. Repeated incidents
warrant examining both the selected remedies and whether follow-up work was
completed. A large incident may justify multiple actions.

**Application:** Review incident patterns with Stage 16. Do not infer that three
migration incidents prove one root cause. Investigate shared conditions,
repeated mitigation and unfinished actions. A suggested one-improvement limit
must not delay urgent incident, security or accessibility work.

### 8. AI summaries require source checks

**Source:** [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence),
Chloe Autio, Reva Schwartz, Jesse Dunietz, Shomik Jain, Martin Stanley,
Elham Tabassi, Patrick Hall and Kamie Roberts; NIST, **AI 600-1, 26 July 2024**.
[Full report](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf).

The profile describes confabulation, including summaries that introduce false
information and citations that appear to support unsupported claims.

**Application:** AI may propose clusters of supplied feedback, draft a hypothesis
or compare an action record with follow-up evidence. Require source identifiers,
check representative and contradictory records, and verify counts against the
original dataset. Keep quoted user words separate from generated paraphrases.
A generated theme is not measured prevalence, and a generated persona is not a
user interview. Use only data approved for the tool and remove unnecessary
personal details. These are proposed safeguards, not claims that a provider
can guarantee accurate summaries, confidentiality or prioritization.

### 9. Separate observations, findings and actions

**Source:** [Analyse a research session](https://www.gov.uk/service-manual/user-research/analyse-a-research-session),
GOV.UK Service Manual, User research community, live guidance.

The guidance asks researchers to record what they saw or heard, group those
observations, then write findings and decide actions separately. It supports
returning to the original records rather than treating an interpretation as a
verbatim user observation.

**Application:** The chapter's observation/explanation/check table is an original
teaching example. Error counts and support questions suggest investigations;
they do not establish why a user struggled. Check underrepresented audiences,
deduplicate repeat contacts and preserve contrary evidence.

## Original chapter claim assessment

| Original claim or section | Assessment and proposed correction |
| --- | --- |
| Entry requires shipping and real users | Suitable for the post-release focus, but process learning can begin earlier. Avoid suggesting the improvement loop starts only at Stage 18. |
| Separate product and process questions | Retain. HEART and DORA support different measurement tasks; neither substitutes for the other. |
| Usage is reliably surprising; specific tiny usage counts | Label as an illustrative example or remove the invented counts. No project analytics were supplied. |
| Unexpected paths prove the design is wrong | They suggest a hypothesis. Investigate user goals, intended shortcuts and instrumentation. |
| Repeated validation errors mean confusing forms | Possible explanation, not a diagnosis. Rule out invalid upstream data, bots, changed rules, defects and telemetry duplication. |
| Failed searches prove missing content or broken search | Inspect intent, spelling, filtering, indexing and whether the request is in scope. |
| Every support question is a design/documentation failure | Unsupported universal. Questions may concern policy, exceptional tasks, access or learning. Repetition signals a research opportunity. |
| Support list is already prioritized | Frequency is one input. Include severity, affected people, exposure and confidence; quiet or excluded users may be absent. |
| Invoice request proves recurrence and templates are wrong | Fictional interview suggests a hypothesis. Ask about frequency, variation and desired control before deciding. |
| Ten requests outrank one loud request | Deduplicate and inspect who is affected. A single report can expose severe harm or an accessibility barrier. |
| Fix-first ordering is almost always most valuable | Replace with a contextual decision using impact, risk, reach, confidence, effort and product goal. Avoid pretending these yield an objective score. |
| Three manual repetitions means automate | Investigate repeat cost and risk; compare automation and maintenance cost with savings. A runbook or deliberate manual action may fit. |
| Avoidance proves slowness/risk and identifies highest priority | Treat as a prompt. Competing work, unclear ownership and unfamiliarity are alternatives. |
| Exactly one improvement; fifteen equals zero | Useful work-in-progress heuristic, not universal evidence. Give changes an owner and review; allow urgent work and larger incident follow-up. |
| Delete advice skipped three times | Review why it was skipped, its purpose and current obligations. Revise, automate or retire with a reason; skipping alone is not evidence that a protection is obsolete. |
| Unused features should be deleted | Link to Stage 17's telemetry coverage, dependents, migration and recovery checks. Low use is insufficient. |
| Finished product is legitimate | Retain as editorial judgment. Feature restraint does not end maintenance, support or review of changing user needs. |
| Per-cycle done means one improvement completed | Add outcome review and an explicit keep/change/revert/inconclusive decision. Completed work may have failed to improve the outcome. |
| Rotate retrospectives and share feedback widely | Label facilitation rotation as optional; share feedback with appropriate privacy/access limits. |

## Visual provenance and later use

These are **link-only source references**. No external image was downloaded,
embedded or licensed for this project. Permission uncertainty is explicit.
A future W-6 assessment must recheck rights and practical readability before
selecting an image; these candidates do not authorize a sheet.

| Original visual reference | Creator and rights status | Intended chapter or later W-6 use |
| --- | --- | --- |
| [DORA metrics illustration in the guide](https://dora.dev/guides/dora-metrics/) | DORA/Google. The guide names Nathen Harvey as author; illustrator is not identified. Image-specific reuse terms not verified. | Link beside product/process distinction; possible later delivery-metrics lookup reference. Do not copy an older four-metric diagram. |
| [HEART paper and framework resources](https://kerryrodden.com/heart), [original PDF](https://research.google.com/pubs/archive/36299.pdf) | Rodden, Hutchinson and Fu, Google/ACM CHI 2010. The original PDF notice specifies personal use, not redistribution. No permission for reproducing its visual was established. | Link as source for goals/signals/metrics. A later sheet could use an independently written example table, with attribution, rather than copying its artwork. |
| [During-experiment trustworthiness patterns figure and metric taxonomy](https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/) | Microsoft Experimentation Platform. Individual illustrator and image-specific reuse permission not established. | Link near experiment validity and guardrails; possible W-6 evidence-review reference. Keep link-only unless permission is confirmed. |

## Suggested later lookup boundary

A small **Improvement Review** companion could expose the decision fields:
user/process problem; observation and source; hypothesis and alternatives;
baseline and target; harm checks; owner and review date; observed result;
keep/change/revert/inconclusive decision. This would be an original editorial
record based on the sources above, not a new branded framework. Assess its
lookup value after the chapter and interactive stage; no sheet is selected here.

## Verification and limits

Opened the primary-source pages above and read the original chapter. The SPACE
publisher page returned 403; the Microsoft author page remained available.
The HEART PDF was available in the coordinator search extraction, including
its rights notice; a separate fetch failed. Author/Google pages support the
content claims.
No app suite is relevant to this research-only file. A humanizer editing pass
removed overstatement and kept uncertain attribution visible. The record does
not establish this project's user population, telemetry quality, delivery
performance or whether a proposed improvement works.
