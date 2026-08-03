# When a rule measures the wrong thing

Written after D-38 was superseded, 2026-07-31.

A rule can be right about what it cares about and wrong about what it counts. When that
happens the rule does not merely fail to help — it pushes toward the failure it was written
to prevent, and it does so while looking like it is working.

This is what happened to D-38, and it took two stages and a measurement to notice.

## The rule

D-38 said a dense stage may run to five content steps plus the AI step. Its stated reason:

> the guideline exists because a stepper stops being navigable when a step is a scroll

That reason is about **how much one panel holds**. The rule enforces **how many panels there
are**. Those are not the same quantity, and for a fixed amount of content they move in
opposite directions: capping the count forces content into fewer panels, which makes each
panel heavier, which is the thing the reason was worried about.

So the rule was not neutral-but-imprecise. It was actively pointed the wrong way.

## How it stayed invisible

Two things hid it.

**It was never checked.** D-38 lived in a tracker table. Nothing measured anything, so the
only way to notice the rule was being broken was for a person to count steps and remember the
number. Which brings us to:

**It was already being broken, silently.** Stage 02 shipped six content steps plus AI. That
satisfies `PATTERNS.md`'s four-to-six and breaks D-38's five, and no deviation was recorded
anywhere. So the rule had been narrower than the documented guideline since the stage *after*
the one it was written for, and the project carried both numbers without noticing they
disagreed.

The lesson from `decisions-need-tests-101.md` applies here and is worth restating in this
shape: an unchecked decision does not stay true, and it does not fail loudly either. It just
quietly stops describing the code while continuing to look authoritative to the next reader.

## What the measurement showed

Every step panel in the app, measured at 1024×768, in screens:

```
                      median   max    heaviest panel
stage 01   6 steps      2.4     6.7   record
stage 02   7 steps      2.5     5.6   horizon
stage 03   9 steps      5.3     8.4   schema
```

Stage 03's *typical* panel was heavier than stages 01 and 02's worst non-outlier panels. The
stage that broke the count ceiling was also the stage that most badly broke the thing the
ceiling was protecting — and the ceiling could not see it, because it was counting a
different noun.

Note the shape of that table. If the count had been the right proxy, more steps would mean
lighter panels. Stage 03 has the most steps *and* the heaviest panels, because the content
grew faster than the step count was allowed to.

## The replacement

D-52: **a step holds one judgment, and its panel does not exceed four screens at 1024×768.**
Count follows content.

Two properties worth copying to any rule of this kind:

**The threshold came from the data, not from taste.** Stages 01 and 02 both have a
next-heaviest panel at 3.2 screens, so four clears everything either stage has except one
panel each, with headroom. It was also not tuned to be lenient — six of stage 03's nine
panels failed it on day one. A threshold that passes everything you already have is a
description, not a rule.

**It fails a build.** `web/e2e/audit.spec.ts` measures every panel on every built stage. The
exceptions are a baselined list, each with a reason, and — this is the part that matters — a
baselined panel that *improves* past its number fails too, asking for the number to be
lowered. Otherwise the allowlist rots upward and becomes exactly what D-38 was: a recorded
number with nothing enforcing it.

## The half-mitigation, found by review

The first version of that test bounded exceptions from below and not from above. The
over-threshold check ran only for paths with no baseline, so a baselined panel could grow
from six screens to twelve and stay green. Exempt from the limit had quietly become exempt
from measurement.

A review caught it. Demonstrating it took one line — baseline a panel at 1.0 while it measures
6.0, watch the suite pass — and that demonstration is worth doing before writing the fix,
because "I think this branch is unreachable" and "I watched this branch not fire" are
different states of knowledge.

The general form: **an allowlist entry is a claim, and claims need both bounds.** If the entry
says 6.7 and the reality can be anything at all, the entry is decoration.

## How to tell if a rule you are writing has this defect

Ask what the rule's *stated reason* is worried about, then ask whether the thing the rule
measures is that quantity or a proxy for it. If it is a proxy, ask which direction the proxy
moves when the underlying quantity gets worse. D-38's proxy moved the wrong way, which is the
worst case and the hardest to spot, because the rule keeps passing while the situation
degrades.

Then ask the cheaper question: **can this rule fail?** If nothing runs it, it will be wrong
within two rounds and nobody will find out from the rule.

## Related

- `decisions-need-tests-101.md` — the general case: a recorded convention with no mechanical
  check decays at the speed of the next round. D-38 is a second worked example, and a worse
  one, because it decayed *and* pointed the wrong way.
- `quality-gates-101.md` — teeth checks as the method. Both halves of D-52's test were
  teeth-checked, in both directions, and the upper bound only exists because a reviewer
  disbelieved the design.
- `stage-implementation-101.md` — the layout traps and the verification checklist for building
  a stage. Panel weight is now part of that checklist.
