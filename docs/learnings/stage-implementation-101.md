# Stage implementation 101

What building stage 01 taught, written down so stages 02–18 do not relearn it. These are
the things that cost real time and are not obvious from reading the code afterward.

The one habit underneath all of it: **verify against a live build, do not assert.** Every
bug below was found by checking — a screenshot, a measured edge, a contrast script — not
by reading the code and believing it. Eleven real defects in one stage came out that way.

---

## The 68ch measure cap bites layout, not just prose

`globals.css` caps running text at a readable width:

```css
main :is(p, li) { max-width: 68ch; }
```

This is right for paragraphs and wrong for anything structural that happens to be a `<p>`
or `<li>`. It caught me twice on the index:

- A navigation `<li>` row stayed capped at ~680px, so the row's content stopped
  mid-page and the right third sat empty.
- I "fixed" it by putting `.measure-full` on the `<ul>`. That did nothing, because the
  cap lands on the `<li>`, not its parent. The opt-out has to go on the same element the
  rule targets.

**Rule of thumb:** if you build a full-width row, table, or grid out of `<li>`/`<p>`, put
`.measure-full` on that element. And confirm it worked by measuring the element's right
edge against the content edge, not by looking — the difference was invisible until
measured.

---

## Expanded caps overflow narrow columns

The display face is Archivo pushed wide (`t-display`, `wdth` up to 118) and set in caps.
That lettering is much wider than it looks, and viewport-based `clamp()` sizing does not
know how narrow its column is.

Two overflows came from this:

- "DEVELOPMENT" needed 333px inside a 280px body at 320px wide.
- The hero, placed in a two-column grid, overflowed 137px at exactly 1024px — the point
  where the sidebar rail appears and steals 288px, so the hero's half-column is suddenly
  too small for the caps.

**Rule of thumb:** size display type with `clamp()`, then check the *longest real string*
at the *narrowest viewport where that layout applies*. For stage titles the stress case
is "Post-Deployment Verification". Keep big expanded caps full-width; do not put them in a
column whose width you cannot predict.

---

## Solve contrast numerically, against the worst-case surface

A new palette will have failures. `--faint` shipped at 2.99:1 on the darkest light
surface; the accent was 4.11:1 at small sizes. Both are below AA and neither was obvious
by eye.

Do not nudge hex values and re-screenshot. Compute the ratio against the *worst-case*
surface a colour ever sits on — for dark text that is the sunken fill, for light text the
raised surface — and pick the first value that clears the target. That turns three rounds
of guessing into one calculation.

The audit that finds these must resolve colours in the browser. Tailwind emits `oklab()`
for alpha backgrounds, and a naive parser reads that as black and reports a false 1.34:1.
Resolve computed colours through a throwaway DOM element so you always get rgb.

---

## Distrust a checker that reports mass failures

Two "disasters" this session were the checker, not the code:

- A link audit reported 124 broken links. The script was broken; every link resolved.
- A contrast audit reported 1.34:1 on visible white text. The parser could not read
  `oklab()`.

When a check reports that almost everything is broken, suspect the check first. Both were
investigated rather than "fixed" — and the second still paid off, because chasing it
surfaced a frosted-glass background that had no business in a print-derived design.

---

## JSX eats whitespace around inline components

`<Term>` renders inline, and JSX trims the whitespace between an element and adjacent
text on its own line. The result rendered as "solution treeis". Two fixes, both now
standard for any inline component:

- Put an explicit `{' '}` where a space must survive next to `<Term>`.
- Definitions are plain strings, so a straight double-quote inside one breaks the JSX
  attribute. Use typographic quotes in `terms.ts` copy.

**Added after stage 12 (2026-09-01): `{' '}` is not always stable.** Prettier can
silently collapse an explicit `{' '}` back into a plain text node when reformatting,
which means the space disappears in the committed file even though it was present when
you wrote it. The shape that triggers it: a verb immediately following `</Term>`, as in
`<Term id="staging-environment">staging environment</Term> is a single…`. The fix that
survives Prettier is to restructure the sentence so only punctuation (a colon, a comma,
a period) follows the closing tag, not a word. Check by running `pnpm format` and
confirming the file comes back unchanged, then inspecting the prerendered HTML for
glued words.

---

## React 19 forbids setState in an effect

`react-hooks/set-state-in-effect` is an error, not a warning. Reading `localStorage` in a
`useEffect` and calling `setState` fails lint and causes a cascading render. Storage is an
external store: use `useSyncExternalStore` (see `src/lib/useLocalStorage.ts`), which also
gives correct hydration for free.

Related: anything persisted as JSON must be read back as JSON everywhere. The theme
inline-script silently stopped applying because it read a raw string while the hook wrote
`"dark"` with quotes.

---

## The verification passes, as a checklist

Run these against the finished stage before calling it done. They are currently ad hoc
scripts (TD-5); until they are committed, keep re-writing them.

- **Contrast** — every distinct text/background pair, both themes, all steps, WCAG AA.
  Expand every `Term` panel first, or you miss the popover surfaces.
- **Responsive** — no horizontal overflow and no sub-44px touch target, 320→2560px.
  Include the longest stage title as a stress case.
- **Console** — zero errors in a clean browser context (not a hot-reloaded one, which
  carries stale errors from mid-edit).

For anything visual, a screenshot review catches what scripts do not: invisible tokens, a
legend that promises colour coding the elements do not show, a layout that technically
passes but reads as dead space.

---

## Ask what the doc teaches that the app does not, section by section

Added after stage 04, where it was the single most valuable check of the round and nothing
in the gate could have replaced it.

The port was green on everything: 518 tests, a 17-test audit over 63 URLs, every panel
under the weight ceiling, five per-task reviews already closed. A reviewer then walked
`docs/04-project-setup.md` heading by heading against the panels and found **five sections
whose material the app never taught** — and they shared one shape:

> the app tells the reader to run a script, or set a value, that it never shows them how to
> create.

Both the CI artifact and the lefthook artifact invoked `pnpm test` while nothing said to
write that script. `format:check` the same. The three files that pin a Node version were
described in prose and never shown. Sentry's missing-token problem was diagnosed with no
fix given. Vercel's environment variables were absent entirely.

**Every one had been assigned to a panel by the plan's own line ranges.** They were silent
drops, not curations, and no test can see the difference: a data module asserted against
the doc proves the data it *has* matches, and says nothing about data it never got.

**The symptom is visible in the panel measurements, if you look for it.** Stage 04's median
panel was **1.74 screens** against stage 03's authored **3.02**. I read that as "either the
seam is finer than the content needs, or the panels are thin" and could not tell which. It
was neither. It was content that had gone missing, and the median moved to 2.28 once the
five sections landed. A stage measuring well under its comparable's median is a signal to
go looking, not a compliment.

**The method, which is cheap:** open the doc and the panel file side by side, walk every
heading including the closing sections, and write a row per section saying which panel
carries it and what specifically. Anything you cannot name lands in a "not ported"
list with a reason. That table is now `docs/stage-04-status.md`'s coverage section, and
writing it is what forces the question.

Do it **before** believing a port is complete, and do it with fresh eyes — the session that
wrote the panels is the worst reader of them, because it remembers intending to cover
things.

---

## A teeth check can lie, in two ways that both look like a pass

Stage 04 hit both, and one of them caught the controller rather than an implementer.

**The mutation did not land.** `perl -0pi -e 's/className="t-data"/.../'` without `/g`
replaces the *first* occurrence in the slurped file — which was a mention inside a docblock,
not the JSX. The test "survived" a mutation that never touched the code, and read as
toothless. Confirm the mutation is actually in the file before trusting what the run says.

The same shape bit twice more in a different guise: a Python edit script that `assert`s
several anchors and writes at the end will abort on the first miss and write **nothing**,
while its earlier substitutions look applied. Two rounds of "I already fixed that" turned
out to be that. Write unconditionally and report the misses.

**Both sides of the assertion came from the same source.** A render test read
`getAttribute('data-catches')` and compared it to `String(gate.catchesIt)` — both off the
same row. Flipping the data moves the expectation along with the render, so the plan's
prescribed mutation proved nothing at all. The fix is a literal: *exactly one gate catches,
and it is the browser*. Any assertion shaped `expect(rendered).toBe(String(row.flag))` has
this hole.

**A third way, added after stage 06 (2026-08-27): the file being mutated was never really
diffed, because it was never really committed.** `git add -N <file>` stages a new file with
an empty blob, meant to let `git diff` show the file as newly added. It does that, but it
also means the "before" state a teeth check diffs against is empty — so a mutation and the
original both diff against nothing, and the diff cannot isolate what changed. It looked
like proof twice before the cause was understood: a hand-annotated snippet standing in for
a real diff, in each case backed by a genuine test failure so the substantive claim held,
but the "mutation is isolated" evidence was never real. **The fix is to commit the file
first.** Commit, mutate, `git diff` (a real diff against a real baseline), `git checkout --`
to restore. Two instances of the wrong advice being followed is what surfaced that the
advice itself, not the implementers applying it, was the defect — see "A doc-pin regex has
to survive a hard line-wrap, and two instances means stop and sweep," further down this
file, for the general shape.

---

## Check which testing libraries the project actually installs

Stage 04's plan wrote every `.tsx` test against `@testing-library/jest-dom` and
`@testing-library/user-event`. This project installs neither. About twenty tests would have
failed on `Invalid Chai property: toBeInTheDocument` rather than on anything real, and the
first one to hit it read like a broken component.

The house convention is `fireEvent` from `@testing-library/react` plus plain DOM assertions
(`el.getAttribute(...)`, `(el as HTMLInputElement).checked`). `src/components/RevealList.test.tsx`
is the example. `src/test/setup.ts` argues in writing against growing a second
responsibility, which is the case against adding jest-dom now.

---

## Transcribing prose loses the second sentence

Added after the stage 05 port (W-3.5b, 2026-08-20), where this happened three times, the
third of them inside the fix wave built to close the first two.

Porting a doc into panels means moving prose by hand. What goes missing is not random. In
every instance here it was **the second sentence of a two-sentence passage**:

- The AI section's opening kept "the mistakes that survive are the ones that read as correct
  on the way past" and dropped the list that makes it usable — an authorization predicate, a
  migration's backfill, a cache key, a regex over unsampled data.
- The `'use client'` guidance kept "only when you need interactivity" and dropped the
  four-item test that follows it. The reader got a feeling where the doc gave a checklist,
  and "effects" appeared nowhere in the stage.
- A restored cross-section stitch kept "query, then component" and dropped "the test is
  06's".

The shape is consistent because of how the sentences divide labour: the first carries the
claim, the second carries the qualifier, the example, or the pointer. Moving the claim feels
like moving the content, and the second sentence reads as elaboration you can compress. It
is usually the half that makes the first half actionable.

**A paraphrase is more dangerous than an unanchored quote**, because nothing marks it as
lossy. A missing sentence and a deliberate edit look identical in a diff, and no test can
tell them apart — the data module asserted against the doc proves the text it *has* matches,
and says nothing about text it never received.

Three things that work:

- **Lift, do not retype.** `sed -n 'START,ENDp' docs/NN-*.md` and paste. Retyping is where
  clauses go.
- **Where a constant holds doc prose, pin a phrase from each sentence**, not one phrase from
  the passage. The pin that would have caught all three is a phrase from the *second*
  sentence.
- **Count sentences at the boundary.** When you move a paragraph, note how many sentences
  went in and how many came out. It is a two-second check that catches the whole class.

---

## The coverage walk still earns its place, and it has to be starved of context

Same round. Two coverage walks had already run inside per-task reviews and returned nothing.
A third, given only `docs/NN-*.md` and the feature directory — with the plan, the spec, every
task brief, every report and the controller's ledger explicitly withheld — found **ten**
pieces of content the app did not teach, against a green gate of 645 tests, a 17-test browser
audit, and fourteen closed per-task reviews.

The difference was not model or effort. The earlier reviewers had been told what the panels
were *for*. Intentions are exactly what makes a reader of the panels a poor auditor of them,
and by the end of a round every artifact in the workspace is a record of intentions.

The costliest gap was the inverse of stage 04's famous one. There, the app told readers to
run a script it never showed them how to create. Here, it **handed them a snippet the doc
explicitly calls half-written, without saying so** — one panel after four reveal facets
established that actions return their failures precisely so callers can render them. A
reader who pasted it would ship a Retry button that silently does nothing on failure.

So: when you dispatch the walk, forbid the planning documents by name. And expect a fix wave
after it, not a signature — nine of the ten were real, and the wave itself then dropped a
sentence, which is the section above.

**The tenth is worth its own warning.** It was recorded as a deferred cross-stage question,
on the strength of one check: the auditor said two sentences were missing, the controller
looked at one other stage, found the same silence, and generalised it into a convention. All
three claims in that deferral were wrong. Three stages carry the content verbatim, and the
question had already been decided months earlier by a numbered decision that had measured
the identical evidence and reached the opposite conclusion. See `decisions-need-tests-101.md`
— the decision was findable, and what made it invisible was that the code enforcing it
explained its reasoning without citing its number.

---

## One running example teaches a list of abstract steps better than one example per step

Building the `sdlc` reference sheet (2026-08-25). The first pass gave each of the seven
SDLC phases its own definition plus its own "typical output" — a list of artifact *types*
per phase (a requirements doc, an architecture diagram, a test plan). Accurate, and still
something a reader with no domain background has to already half-know in order to fill in:
naming that Design produces "an architecture diagram" does not show what decision that
diagram actually settles.

The fix was not more detail per phase — it was **one small scenario carried through all
seven**, so each phase's abstract definition became something concrete, and so a reader
could see one phase's output become the next phase's input rather than seven disconnected
facts: a Planning-phase risk (could the reset flow itself leak which emails exist)
becomes a Requirements-phase non-functional requirement (a reset request must look
identical either way), which forces a specific Design-phase schema decision (store a
hashed token, never the token), which Development builds as reviewable pieces, which
Testing has a named case for, which Deployment ships behind a flag, and which Maintenance
is still fixing months later as a DNS record rather than a code change.

**The continuity is the teaching, not the individual facts.** Seven independent examples
would each be accurate in isolation and would not show a reader *why* the phases are
phases of one thing rather than seven unrelated checklists — which is the entire claim
this playbook's stage numbering rests on (`CLAUDE.md`: "stage numbers are filing codes,
not a sequence"). Reach for one thread run start to finish before reaching for one example
per bullet, anywhere a list of steps is claiming to be a single process rather than seven
separate ones.

---

## A panel split breaks the median comparison, not the completeness guard underneath it

Added after the stage 06 port (W-3.6, 2026-08-27). The "Ask what the doc teaches" section
above treats a stage's median panel weight as a signal: measuring well under a comparable
stage's median meant content had gone missing, at stage 04. Stage 06 is the case where
that same signal points the wrong way.

Late in the round, one panel (`done`) measured 4.69 screens against the 4.0 ceiling and was
split into two. Splitting does not delete a sentence — it moves some of them into a second
panel — so the stage's *median* panel weight dropped, from 3.48 before the split to 2.74
after, purely from the split, with every clause of content still present. A stage reading
light on this measure after hitting the ceiling and splitting will always look lighter than
an equally deep stage that never needed to.

**The metric has decoupled from what it was built to measure.** It answers "how much has
this stage been chopped to fit a panel," not "how much content is here" — the two only
agree when nothing has ever needed splitting. Trust panel weight as a shape-and-pacing
smell, worth a look when it is unusually low *and* nothing has split. The coverage walk
described earlier in this file is the check that still answers the completeness question
directly, and it is now the only one that does once a stage has any split panels in it.

---

## A doc-pin regex has to survive a hard line-wrap, and two instances means stop and sweep

Added after the stage 06 port. `docs/NN-*.md` hard-wraps prose at roughly 80 columns, so a
sentence a test wants to pin often crosses a line break the source file has and the reader
never sees. A regex built from the sentence as written fails against the file as stored.

It hit three times, each slightly different:

- A dotAll (`s`) flag on a doc-anchored regex — this project targets ES2017, and `tsc`
  rejects the flag outright (`TS1501`), so the first instance failed typecheck rather than
  the test. The fix already existed for this: `flat(section(...))`, a helper that collapses
  a section's whitespace before matching, built for exactly this problem.
- A single-space regex matching "between the layers / rather than inside them" — no flag
  to reject, so this one failed silently as a test, not loudly as a type error, on the same
  doc's own hard wrap two files later.
- The identical shape a third time, on a different sentence, found **by sweeping the
  remaining tasks after the second instance** rather than by an implementer hitting it.

**Two instances of one defect family is the signal to sweep the remaining work, not to
patch the instance in front of you.** The first fix closed one file. The second fix closed
a Global Constraint and every task still ahead — which is what caught the third instance
before anyone wrote the test that would have failed on it. Waiting for a third occurrence
to justify the sweep means paying for the sweep and the instance both.

---

## Tailwind v4 token naming is not what you expect

Added after the stage 07 port (W-3.7, 2026-08-28). The plan specified `border-rule` and
`bg-surface-sunken` across eight instances in three drill components. Neither class exists.

The project's Tailwind v4 theme (`@theme inline` in `globals.css`) maps
`--color-line: var(--rule)` and `--color-sunken: var(--sunk)`. The generated utility
classes are `border-line` and `bg-sunken` — the names come from the `@theme` keys, not
from the CSS custom property names they reference. `--rule` is a custom property value;
`line` is the token name Tailwind sees. Writing `border-rule` is guessing at the indirection
rather than reading the theme.

None of the eight per-task reviews caught it. The e2e audit checks contrast and overflow,
not token validity — a class that produces no styling simply falls through to the browser's
default, which happens to be `currentColor` for borders (close enough to look right in light
mode) and transparent for backgrounds (invisible on the code blocks). Only the final
whole-branch review, reading the diff against `globals.css`, found it.

**Check the generated utility class name against `globals.css`'s `@theme` block before
writing it into a plan.** A plan that specifies wrong tokens infects every task that
transcribes it, and the per-task review's scope is too narrow to notice the theme is never
consulted.

---

## The three-file registration trace is one atomic operation

Added after the stage 07 port. The plan's Task 2 (scaffold) prescribed adding
`'07-code-review'` to `STEP_IDS_BY_SLUG` in `step-ids.ts`, six tasks before the content
component existed. `rails.test.tsx` iterates every entry in `STEP_IDS_BY_SLUG` and requires
a matching `STAGE_CONTENT[slug]` — so the test broke immediately.

The three-file registration trace described in `CLAUDE.md` — `stages.ts` (`ready: true`),
`stage-content.ts` (the component), `step-ids.ts` (the step IDs) — is really one atomic
operation. Splitting it across tasks means one of the intermediate states fails a test that
guards the invariant the trace exists to maintain.

**Register all three in the assembly task, not the scaffold.** The scaffold creates
`steps.ts` (the tuple and the type), which is an internal export later tasks import
directly. `STEP_IDS_BY_SLUG` is the cross-stage registry, and it should move in lockstep
with the component it references.

---

## An always-rendered score region breaks consistency, and the test should change instead

Added after the stage 07 port. The plan's drill components guarded the score display behind
`{answered > 0 && (...)}`, matching `TriageDrill` from stage 06. Three independent
implementers changed it to always render `0/0 right` because their render tests needed to
find the `aria-live` region before any picks.

The tests were looking for the score element on initial render. `TriageDrill`'s test does
not do this — it checks `aria-live` after the first pick, when the element exists. The
implementers took the path of least resistance: change the component to satisfy the test
rather than change the test to match the established pattern. The result is three exercises
showing "0/0 right" on first load while every other exercise in the app shows nothing.

**When a test forces a component change that creates a UX inconsistency, change the test.**
The aria-live assertion should fire after a pick, not before — that is when the score
element has something to announce. The established pattern (`TriageDrill`) already does this
correctly, and the whole point of having a pattern is that the instances match it.

---

## An AI plays section with only workflow philosophy feels incomplete

Added after the stage 07 port (W-3.7, 2026-09-01). The initial AI plays section had five
plays — all about the human+AI workflow (AI as first pass, human for judgment, heightened
scrutiny). On manual review the section felt thin: a reader who agreed with the philosophy
still did not know which button to press.

The fix was four concrete tool plays: `/code-review` (five effort levels, `--fix`
auto-applies), `/security-review` (dedicated security pass), `/code-review ultra`
(multi-agent deep review), and PR review bots (CodeRabbit, Copilot, Greptile). The
section went from five abstract plays to nine mixing philosophy with actionable
commands.

**Every AI plays section needs at least one "run this command" play.** The philosophy
plays tell the reader how to think about AI review; the tool plays tell them what to
type. Without the second kind, the section reads as an opinion piece rather than a
reference a working developer consults between PRs.
