# Quality gates 101

What the W-4 round taught while wiring tests, hooks, and CI into this repo. Written for
the next project's day one, when all of this gets set up again from scratch.

The round's headline: **a gate you have never watched fail is a decoration.** Every
useful discovery below came from deliberately trying to break the thing just built.

---

## ESLint waves warnings through, and most rules are warnings

`eslint` exits 0 when there are only warnings, and most of `eslint-config-next`'s rules —
unused variables included — are warnings. So a bare `eslint` step in a hook or CI is a
gate that passes almost everything.

It took three probes to get a bad commit rejected here:

1. First probe sailed through — the hook ran `eslint` bare.
2. Hardened the `lint` *script* with `--max-warnings 0`. Second probe **still** sailed
   through, because the hook called `eslint` directly and never used the script.
3. Hardened the hook's own command. Third probe rejected.

Two lessons in one: gate at `--max-warnings 0`, and when a check exists in two places,
fixing one of them proves nothing about the other.

## The teeth check is the method, not a nicety

Tests written after the code (regression tests, invariants over existing data) are green
from birth, which proves nothing. Every suite in this round was teeth-checked:

- Corrupting one stage slug failed exactly the four tests that depend on it — and
  nothing else. Precision matters: a break that fails half the suite tells you the tests
  overlap, not that they work.
- Regressing `--faint` to its old value failed the contrast test with named pairs.
- The bad-commit probe, above, three times.

Budget for the teeth check finding real problems. Here it found two.

## One mutation is not a teeth check — stage 02 proved it three times

Building stage 02, three separate test sets shipped green while passing against a
*broken* implementation. Each had a teeth check that reported success. Each was caught
later — twice by a reviewer, once by an implementer warned in advance — never by the
author.

- **A fixture symmetric under negation.** `scoreCut`'s partial-run test used
  `{ 'create-invoice': true, 'dark-mode': true }` → `correct: 1`. One core feature
  guessed core, one non-core guessed core: a match and a mismatch. Flip the comparison
  `===` to `!==` and it is still `correct: 1`. The whole suite passed with the scorer
  inverted. Fix: an asymmetric fixture (two matches, one miss → 2 under `===`, 1 under
  `!==`) plus an all-core fixture (3 vs 5 vs 8 — three distinguishable outcomes).
- **Keyword-regex assertions on user-facing prose.** `scoreOrder` returns `notes[]`
  explaining which rule failed. The tests asserted `notes.join(' ').toMatch(/end to end/i)`
  — satisfied by *any* string containing the phrase. Replacing all note-building with one
  hardcoded string containing the right keywords passed 44/44. The notes are the teaching
  (the whole reason the two rules report separately), and they were unpinned. Fix:
  positive **and** negative assertions — the failing branch's message present, the other
  branch's message absent.
- **A constant mutated by value while tests reference it by symbol.** The plan's teeth
  check for `discovery-sheet` said "change `DISCOVERY_KEY`'s value and watch tests fail."
  The tests import `DISCOVERY_KEY`, so both sides of every assertion move together and
  nothing fails. Fix: mutate the *logic*, not a symbol both sides share.

The pattern under all three: **the teeth check confirmed the code ran, not that it was
right.** A coarse mutation (delete the branch, blank the field) only proves the line is
reached. The mutations that matter are the plausible near-misses — an inverted comparison,
an off-by-one boundary, a swapped operand, a human-readable string replaced by a
plausible constant.

Two rules of thumb that would have caught all three:

1. **Run more than one mutation, and make them adversarial.** After the obvious "delete
   it" mutation, ask: what is the *subtlest* wrong version that would still look right? Try
   that one. If it survives, the test is the bug.
2. **Keyword-regex on prose is almost always vacuous.** `toMatch(/word/i)` passes for any
   string mentioning the word. Pin user-facing strings with a negative assertion too, or
   pin them to `.toBe(item.why)` exact.

The cheap structural fix that worked: have a *different* agent hunt for a mutation the
author did not try. It caught two of the three. The author's own teeth check is
necessary but not sufficient — an adversarial second pass is where the vacuous ones die.

First real run of the committed audit suite flagged inline `<Term>` buttons as sub-44px
touch targets. The ad-hoc sweeps had never flagged them, because one iteration had
excluded everything with `aria-controls` — an accidental, overbroad exemption that
silently masked a whole class of element.

The resolution was neither "inflate inline buttons to 44px" nor "restore the blanket
exclusion": WCAG 2.5.8 explicitly exempts targets that sit inline in a sentence, so the
suite now exempts `el.closest('p')` and documents why. When a stricter checker
contradicts an older looser one, the difference is information — chase it to a
principled rule rather than porting the old checker's blind spots.

## Hooks when the app is a subdirectory

Git hooks install at the git root; the app lives in `web/`. What works:

- `lefthook.yml` at the **repo root**, each command carrying `root: 'web/'` — staged
  files filter to the app and commands run there.
- `lefthook` as a devDependency of `web/`, with `"prepare": "lefthook install"` so
  hooks reinstall after every `pnpm install`, from `web/`, and lefthook finds the git
  dir by walking up.
- Staged-file work only in pre-commit (prettier + eslint); the full typecheck + unit
  suite in pre-push. A slow pre-commit is a hook people bypass with `--no-verify`.

## Browser audits run against a production build, on an offset port

`@playwright/test`'s `webServer` handles the whole lifecycle:

```ts
webServer: {
  command: 'pnpm build && pnpm start -p 3100',
  url: 'http://localhost:3100',
  reuseExistingServer: !process.env.CI,
}
```

Port 3100 keeps clear of the dev server; the production build keeps the dev overlay's
console noise out of the console-error check. Locally, `reuseExistingServer` skips the
rebuild when a server is already up.

## Generated types make local typechecks lie

CI's first real run failed with `Cannot find name 'PageProps'` — a type used in a route
file that had typechecked cleanly on the machine for weeks.

`PageProps` is not written anywhere. Next.js generates it into `.next/types/` during
`next build` (or `next typegen`), and `tsconfig.json` includes that directory. Locally
`.next` survives from the last build, so `tsc --noEmit` always finds it. CI checks out
clean, and the verify job ran typecheck *before* build, so the types did not exist yet.

The fix is not to reorder CI. It is to make the typecheck self-sufficient:

```json
"typecheck": "next typegen && tsc --noEmit"
```

and have CI *and* the git hook both call that one script. The pre-push hook had the same
latent bug — a fresh clone would have failed it — and fixing only CI would have left
that in place.

**The general lesson:** any check that depends on generated artifacts passes locally for
the wrong reason. To find these before CI does, delete the build directory and run the
check. That single command reproduced this exactly.

**And the meta-lesson:** this is what CI is for. No amount of local discipline finds a
bug whose entire nature is "the local machine has state the clean machine does not."

## When the browser suite "fails mysteriously", check who owns the port

Four screenshot attempts failed in a row while building a term popover. The clicks did
nothing, no panel ever appeared, and the feature looked broken. It was not: a **stale
`next start` process** from an earlier run still held port 3100 and was serving old HTML
whose chunks 500'd, so the page never hydrated and every click was inert.

Two things made it slow to spot:

- `pkill -f 'next start'` missed the process, because its actual command line did not
  contain that literal string. `kill $(lsof -t -iTCP:3100 -sTCP:LISTEN)` is the reliable
  form — target the port, not a guessed process name.
- The symptom (buttons do nothing) points at your code, not your environment.

The diagnostic that ended it was listening for console errors and failed requests during
the run, which showed 500s on `_next/static/chunks/*`. Before rebuilding, kill the
server; a rebuild while the old server is serving the same `.next` directory produces
exactly this half-written state.

## Some publishers 403 command-line requests

A link check over the stage's outward references reported one dead link. It was not: the
publisher serves fine to a browser and blocks `curl`. Verify external links with a real
browser before deleting or "fixing" them — this is the
"a checker reporting mass failures is usually the checker" rule again, one link at a
time.

## Cheapest-first ordering paid for itself on the first run

The gate runs format → lint → typecheck → test → build, then the browser audit as a
separate job. When the first two runs failed, they failed in **35 seconds**, at
typecheck, long before anything launched a browser. The green runs take about two
minutes because they do the whole thing.

That is the entire argument for ordering the gate by cost rather than by importance. A
build-first pipeline would have burned two minutes to tell you the same thing.

## "Enable branch protection" has a plan asterisk

Standard advice everywhere, and on GitHub Free it does not apply to private
repositories: the ruleset saves, displays a banner, and never enforces anything. The
setting looks identical to a working one.

Options are to go public, pay for Pro, or accept an advisory gate. For a solo project
with no secrets, public also brings unlimited Actions minutes, which matters as soon as
CI drives a browser.

Check that the gate you configured is one your plan actually runs.

## What was deliberately left out

- Component/behaviour tests for the stage exercises — deferred to W-3, where each stage
  brings its tests with it, so the gate did not freeze APIs mid-evolution.
- Visual regression — the audit checks properties (contrast, overflow, size), which do
  not rot the way screenshots do.
- The final proof, still owed after push: a deliberately broken commit pushed with
  `--no-verify` on a scratch branch, to watch CI itself go red once. Hooks were proven
  locally; CI is proven the same way or not at all.

---

## A fix that drives a number to zero needs a case where it should not be zero

TD-40 in the stage 04 round. Every code line in an annotated config block carried
`tabIndex={0}`, so `ci.yml` alone put twenty tab stops in a panel and most reached nothing:
a focus ring on a region that does not scroll. The fix measures each line and makes only
the overflowing ones focusable.

The first verification looked conclusive and proved nothing:

```
W1024  total=20  focusable=0  overflowing=0
```

Twenty stops down to zero, exactly as intended. But **a mechanism that always answered
"not focusable" produces the identical reading.** So does one whose measurement throws and
falls through to a default. Nothing in that line distinguishes the fix from a hardcoded
`-1`.

The check that means something is the width where the answer should be non-zero:

```
W320   total=11  focusable=5  overflowing=5
W768   total=11  focusable=2  overflowing=2
W1024  total=11  focusable=2  overflowing=2
W1440  total=11  focusable=1  overflowing=1
```

Now the number tracks the condition, in both directions, across four viewports. That is
the mechanism engaging rather than a constant that happens to be right once.

**The general shape.** Any change whose success looks like *fewer* — fewer warnings, fewer
queries, fewer re-renders, fewer elements — has a trivial passing implementation: do
nothing at all, or break the thing that produces them. Verifying only in the condition
where the count should drop cannot tell the fix from the sabotage. Pair every
"it went to zero" with a case where it must not be zero, and assert against the *condition*
(`focusable === overflowing`) rather than against the number, so the assertion survives the
next content change.

This is the same argument as the teeth check one section up, pointed at a different failure:
a teeth check asks whether the test can fail, and this asks whether the *fix* can be
distinguished from doing nothing.

---

## A constant stales; a property does not

TD-26 asked to be closed by asserting "the sweep opens a known count of expandables on a
known page". The count would have been 108 when the entry was written. It was 140 ten days
later, and 191 by the time anyone came to close it, with no defect anywhere in between.

That is the whole problem with a pinned count. It does not fail when the thing it guards
breaks. It fails when the content grows, which is constantly, and each time somebody
updates the number and learns to update the number. After the third update it is a
formality, and the one time it fires for a real reason it gets the same treatment.

The guard that replaced it names a property instead:

> every disclosure inside the panel was observed open in at least one state, on every
> audited page

There is no number in it. Add a stage, add fifty accordions, and the assertion still means
exactly what it meant before. It fails when the sweep stops opening things, which is the
thing TD-26 existed to catch.

**The test is whether the assertion has to be edited when nothing is wrong.** If growing
the content forces you to change the expected value, you have written a maintenance
schedule rather than a check.

### The property alone was still vacuous, which is the part worth remembering

The plan for this said: teeth-check it by nulling the sweep's selector, and watch the
property fail.

It passes. Null the selector and the set of disclosures the page is known to have becomes
empty, so nothing is missing from the set of disclosures observed open, so the gap check is
satisfied having looked at nothing. **The regression test reproduced the bug it was written
to catch, inside itself.**

The fix is a floor on how much the sweep observed. Not a count, a floor, set far enough
below the measured figure that it never needs touching:

```ts
expect(observedTotal).toBeGreaterThan(50)   // measured 144 the day this landed
expect(gaps, gaps.join('\n')).toEqual([])
```

Both teeth checks then fire, and they fire on different things. A nulled selector trips the
floor. Neutering only the click loop, which reproduces the pre-fix sweep exactly, trips the
gap check and names `auth-panel-managed` and `auth-panel-library`, the two panels the debt
entry said had never been checked.

**A property can be vacuous the same way a constant can be wrong.** Ask what the assertion
does when the mechanism produces *nothing*, not only when it produces something incorrect.
Emptiness satisfies most set comparisons, and "no gaps" over an empty set is the quietest
pass there is.

## Seven tests that could not fail, in one round

Added after the stage 05 port (W-3.5b, 2026-08-20), which found seven of them: five during
the round, two more at the whole-branch review after fourteen tasks had already been
reviewed clean. Four were written by the controller, into the plan, before any implementer
touched them.

The sections above name three vacuous-test *patterns*. This round says the patterns share a
cause, and the cause is more useful than the list:

> **The assertion samples the state in which the property cannot be violated.**

Not "the test asserts nothing". Each of these asserted something real, in a state that was
convenient to construct, and the mutation that mattered was invisible from there.

The four it took here:

- **A doc-slicing test** proved a section bound worked, against a document that did not
  contain the hazard. The buggy and correct regexes returned byte-identical output. The
  fix was to run it against the other document, where a fenced `# comment` sits inside the
  section and the bound actually bites.
- **A prerendering test** asserted every node stays prerendered — after clicking the
  control that makes every node ship. In that state `prerendered` and `ships` are both
  true everywhere, so mirroring one onto the other changed nothing observable. The whole
  claim was that the two are independent, and the test sampled the one state where they
  agree.
- **A conditional guard**, `if (row.stage) expect(...)`, caught a typo'd value and could
  not catch a deleted one. Removing the field left the suite green and the page rendering
  a dead reference.
- **An `aria-checked` assertion** ran only before the reader answers, where the value is
  `false` for both buttons. A regression to a hardcoded `false` would have left the control
  never announcing its selection, with every test green.

**The habit that would have prevented all four:** before writing an assertion, name the
mutation it must catch, and check that the state you are asserting in is one where that
mutation changes the answer. If the property is *X is independent of Y*, the assertion has
to run where X and Y disagree. If the property is *this field is present*, asserting its
value cannot see it removed.

**A teeth check that does not redden is a result, not an inconvenience.** The most valuable
report of that round came from an implementer whose required mutation produced no failure.
It did not adjust the test until the check passed, and did not report success. It built a
throwaway probe to prove the mutation was a genuine defect, restored, and said the guard was
hollow. That is what the teeth check is for, and the temptation in that moment is to treat
the non-failure as a formality already satisfied.

**Corollary for prose-shaped assertions.** One fix in that round rewrote a paragraph so its
load-bearing argument led, and left the test pinning the clause that had just been demoted.
Deleting the entire new argument would have kept the suite green. When you move what a
string *means*, move the assertion that guards it in the same commit, and pin a short
distinctive phrase from the part that carries the meaning rather than from whatever sentence
happens to be quotable.
