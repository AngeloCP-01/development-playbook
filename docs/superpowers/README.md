# Specs and plans

The delivery loop's artifacts. See `CLAUDE.md` for the full loop and section order.

```
specs/YYYY-MM-DD-<slug>-design.md    what we are building and why
plans/YYYY-MM-DD-<slug>.md           how, as checkbox tasks
```

**Specs** run: Problem · Goals · Non-goals · Constraints · Architecture · Testing ·
Verification · Documentation updates · Risks. Non-goals state *why* each was dropped.
Cite real code by `file:line`, and record rejected options inline rather than deleting
them — the alternative you rejected is the most useful thing in the document six months
later.

**Plans** open with the agentic-worker preamble, then Global Constraints, then
`### Task N` blocks (Files / Interfaces / checkbox steps), then a final Verification
section. Tasks carry full test and implementation source inline so an implementer can
work from one task slice without the whole plan.

Both are committed with `docs(spec):` / `docs(plan):` scopes, before or alongside the
implementation — so the decision exists in history at the point it was made.

Empty for now. Nothing has run through the full loop in this repo yet.
