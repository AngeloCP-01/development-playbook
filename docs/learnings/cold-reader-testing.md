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

## When to run it

- Before calling any stage doc "done" — the completeness run, always.
- When someone asks "is this ready for audience X?" — the audience-fit run answers it with a
  concrete list instead of an opinion.
- It is cheap (one agent, minutes) and it reliably finds things the author cannot see. There
  is no reason to skip it for a document meant to teach.
