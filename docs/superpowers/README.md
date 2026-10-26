# Designs and plans

Use the [shared development workflow](../../AGENTS.md#development-workflow) to
decide whether these artifacts are needed. Research and routine page edits can
work from a short checklist. Consequential or unclear choices need a written
design; multiple dependent steps need a compact plan.

```text
specs/YYYY-MM-DD-<slug>-design.md    intent, choices and constraints
plans/YYYY-MM-DD-<slug>.md           files, steps and acceptance checks
```

A design records the reader/user goal, scope, constraints, important choices,
risks and verification. Record rejected alternatives when they explain a decision.
A plan names affected files/interfaces, short steps and tests or acceptance
criteria. Reference existing code rather than copying full implementation/test
source into each task. Retain a recovery checklist for multi-session work.

When needed, commit the design/plan before the implementation it governs, with
`docs(spec)` or `docs(plan)` scopes. Small changes do not need separate design,
plan or review artifacts.

Older files remain records of earlier rounds and may contain full-source tasks,
mandatory task reviews or other superseded process. Their historical content is
preserved; current work follows D-99 in AGENTS.md.
