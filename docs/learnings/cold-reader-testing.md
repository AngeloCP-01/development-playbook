# Cold-reader testing

How to find out whether a teaching document actually works, without shipping it and waiting
to be told. Learned while finishing stage 02, where it caught two real content defects and
then settled a scope question that opinion alone could not.

The problem it solves: **the author always knows too much.** Once you have written a stage,
you cannot read it as a beginner would, because you fill every gap from your own head
without noticing. "It reads clearly to me" is worthless evidence — you are not the reader
the doc is for.

## The method

Dispatch an agent that is allowed to read **only the one document**, and forbid it from
using its own domain knowledge to fill gaps. The instruction that makes it work:

> You may use your expertise to *judge* the document, but you may NOT quietly fill its gaps
> with your own knowledge and then call it complete. Every time the document does not give
> you something you need, STOP and log it as a gap, rated by how blocking it is.

Then give it a **concrete task the doc is meant to enable** — not "review this," but
"produce the real artifact using only this." Where it stalls is where a real reader stalls.
Pick a scenario that is *not* the doc's own worked example, so it cannot copy — a different
product, a different domain.

## Two modes, both worth running

**Completeness (beginner persona).** The agent knows nothing about the subject except the
doc, and tries to do the work. This finds missing prerequisites, undefined terms, and
logical contradictions. On stage 02 it caught two genuine defects a human review had
missed: the cut-to-core test contradicted the doc's own MVP warning when read literally, and
"Risks" vs "Open questions" were undefined even in the doc's own example. Both were fixed;
a re-run confirmed all gaps closed.

**Audience fit (target-role personas).** The agent is an expert in a role you hope the doc
serves, and tries to do *that role's* work from the doc. This tells you who the doc is
actually for. On stage 02, a PM persona and a solutions-architect persona each confirmed the
doc is a developer's planning discipline: it *feeds* the architect (hands decisions to a
later stage, by design) and is a *primer* for the PM (deliberately skips dates, stakeholders,
resourcing — the "solo, production-grade" scope showing its edge). Neither finding was a
defect; both were the scope boundary, made visible.

## Reading the results

The distinction that matters: **a gap is not automatically a defect.** Separate them.

- A gap where the doc *contradicts itself* or leaves a beginner unable to proceed within its
  own scope → a real defect, fix it.
- A gap that is *another stage's job* or *outside the stated scope* → a boundary, not a bug.
  The architect's "no decomposition method" is stage 03's content; the PM's "no timeline
  method" is the solo-developer scope. Patching these into the doc would blur what it is.

The audience-fit run is really a scope test wearing a persona. When the personas stall in
exactly the places the doc says it defers, that is confirmation the scope is coherent, not
a to-do list.

## What the second run taught (stage 03, W-3.1)

The stage 02 run above found gaps that **pre-dated** the round. That framing turned out to be
incomplete, and the difference changes how you budget the work.

**It finds gaps the round itself introduced, not only old ones.** Stage 03's doc round closed
14 known gaps and the re-run scored 9 closed, 3 partial, 1 correctly deferred. It also found
**five defects the round had just created** — including a Definition-of-done checkbox gating
on a concept the body never taught, and a contradiction between a checklist line and prose
written the same day. A doc that grows by 500 lines acquires new internal inconsistencies
faster than a human author notices, because the author is checking each addition against
intent rather than against the other 500 lines.

**So the report is not the end of the round. Budget a fix wave after it.** The instinct is to
treat a passing-ish re-run as a closing ceremony. It is the middle.

**And the fix wave needs its own verification** — this is the expensive half, recorded as
**D-48**. The wave exists *because* the pass found something, so by construction it lands
after the pass ran, and nothing checks it. Stage 03's fix wave shipped the document's only
unrunnable SQL: a `REFERENCES teams(id)` with no `teams` table, inside a block whose comment
claimed to demonstrate a tenant key that appeared on zero tables. It was the round's headline
fix and it did not survive being read as SQL. A later whole-branch review caught it.

The cheap mitigation: **re-run the skim over the fix wave's own additions**, and for anything
containing code, read it as code rather than as prose. "Verified" attaches to a commit range,
not to a round.

**Ask for a consultability rating separately.** A cold reader reads linearly, so it
structurally cannot tell you whether a long document is still something you *look things up
in* — which for this playbook is the whole point. Run it as its own check: pick three
questions and try to answer them from headings alone, without reading through. On stage 03
that scored 4/5 and found two misfilings, one of which would have sent a reader with a webhook
problem to a section about diagrams.

## When to run it

- Before calling any stage doc "done" — the completeness run, always.
- **Again after any round that substantially rewrites a doc**, with the same scenario as the
  first run so the results compare. A different scenario produces a fresh unrelated list and
  tells you nothing about whether you fixed anything.
- When someone asks "is this ready for audience X?" — the audience-fit run answers it with a
  concrete list instead of an opinion.
- It is cheap (one agent, minutes) and it reliably finds things the author cannot see. There
  is no reason to skip it for a document meant to teach.

What it will not catch: voice drift across sections, whether the document is navigable,
anything in the fix wave that answers it, and **whether the code in the document actually
runs.** Those need separate passes.

## The third run, and the limit of reading

Run 3 on stage 03 found what the two before it had missed and what a careful re-read would
not have: it started a PostgreSQL container and executed the SQL.

Two defects came out of that, both in a section whose surrounding prose lectures the reader
about *silent, plausible* migration bugs. A `substr(name, strpos(name, ' ') + 1)` backfill
turned every single-word name into `last_name = first_name`, because `strpos` returns 0 for a
mononym and `substr(name, 1)` returns the whole string. And the same statement's own comment —
"repeat until it reports zero rows" — was false, because one null name re-matched the guard
forever while still counting as updated.

Neither is a syntax error. Both produce a wrong *result* from correct-looking code, which is
the class of defect reading cannot find, because reading checks whether the code says what you
meant and running checks whether what you meant is true.

**So: "read the SQL as SQL" is not the same instruction as "run the SQL".** The first was in
the plan and was followed. It was not enough. That became **D-50** — executable content in a
document gets executed — and the cost of applying it is one `docker run` and about four
minutes for a whole round's DDL.

Worth noting this project already had the standard and dropped it: an earlier stage-03 review
reassembled the doc's DDL and executed it against a real database. The lesson is less "adopt
this" than "notice when a standard quietly stops being applied."
