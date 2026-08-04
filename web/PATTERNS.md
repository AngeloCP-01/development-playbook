# Interaction Patterns

How a stage is built to be used, not just read. `DESIGN.md` covers how it looks;
this covers how it behaves and which pattern fits which content. Stage 01
(`src/features/discovery/`) is the reference implementation for everything here.

Ground rule: token values and component APIs in this file document the code. If they
disagree, the code wins and this file is the bug.

---

## The principle: interact to learn

A stage doc is reference material someone reaches for under pressure. A wall of prose is
read once and skimmed forever. So the default is not "explain it in a paragraph" but
"give the reader something to do that teaches the point."

Three moves carry most of the value, and every stage should use them:

1. **Progressive disclosure.** Detail is hidden behind a click. The reader sees the shape
   first (a list of steps, a set of options, a diagram) and opens only what they want.
   This is what keeps a long stage from reading as dull — you act on it instead of
   scrolling it.
2. **Inline definitions.** Any term a reader might not know is underlined and, on click,
   explains itself in place. Unfamiliar jargon is never a dead end, because the stage
   doubles as a primer for ground the reader has not worked in.
3. **Judgment exercises.** Where the stage teaches a decision (is this severe enough to
   build? is this a good interview question?), the reader commits to an answer _before_
   the reasoning is revealed. Guessing is the lesson.

The anti-pattern to avoid: a stage that is only `<Prose>` blocks. If a step has no
figure, no expandable detail, and nothing to click, it is a doc, not this.

---

## Building blocks

Shared components. Reuse these; do not re-invent them per stage.

### `Stepper` — `src/components/Stepper.tsx`

Splits a stage into steps, one panel visible at a time. The active step lives in the
URL hash, so a step is deep-linkable and the browser back button walks between them.
Arrow keys move between steps; visited steps get a check. Pass a `Step[]`
(`{ id, label, hint, content }`).

Use it for every stage. Group the doc's sections into steps by phase, not by length.

**How many steps: the rule is about the panel, not the count (D-52).** A step holds **one
judgment**, and its panel does not exceed **four screens at 1024×768**. The count follows
from that. Four to six content steps is the typical result and a useful sanity check, but it
is not a ceiling — a stage whose doc is genuinely fourteen sections will exceed it and should.

This replaces D-38, which capped the count at five content steps. That capped the wrong
quantity: the reason given was that a step should not be a scroll, and fewer steps for the
same content makes panels heavier. `web/e2e/audit.spec.ts` measures every panel and fails
anything over the threshold, so this is checked rather than remembered.

When a panel is over: **split it** at a seam where it holds two judgments, or **compress it**
by moving elaboration behind an expand-to-reveal. Never by teaching less.

Every stage carries one further **"AI plays"** step beyond the content steps — the "where
agents help and where they mislead" pattern from stage 01, tuned to that stage's work. The
AI step is standard, not drift (D-35). It also appears in the doc as an `### AI in <stage>`
subsection inside "The work".

### `Figure` — `src/components/Figure.tsx`

Wraps a diagram with a number and a caption (`{ n, caption }`). Numbers run across the
whole stage, not per step, and are passed explicitly, so "Fig 4" means one thing
wherever the reader entered. The caption states what the figure _claims_, which is the
line between a picture and an explanation.

Wrap every diagram. A diagram without a caption is decoration.

### `Term` — `src/components/Term.tsx` + `src/lib/terms.ts`

Inline, click-to-expand definition. `<Term id="...">visible text</Term>` renders the
text with a dashed underline; clicking opens a small panel with the full definition and a
**"Why it matters"** line. Escape or an outside click closes it. Definitions live in
`src/lib/terms.ts` as `{ name, short, full, soWhat?, see? }`; an unknown `id` degrades to
plain text so it can never break a sentence.

`terms.ts` is the **single glossary source**: `reference/glossary.md` is generated from it
(`renderGlossary()` + a `toMatchFileSnapshot` test), so the inline definitions and the
reference glossary cannot drift. Edit the term here and run `pnpm gen:glossary` to
regenerate the markdown; never hand-edit `glossary.md`. `name` is the glossary heading and
`see` (a stage slug) its cross-link.

Wrap the first appearance of any term a reader new to the stage might not know. Write the
definition for a first encounter: plain language, no forward references, and the
`soWhat` line is the part a glossary would omit.

A term may also carry a **mini-diagram**: register a component against its id in
`src/components/term-visuals.tsx` (the `STAGE_CONTENT` registry pattern again) and the
popover renders it between the definition and the why-it-matters line. Everything in a
visual must be `<span>`, never `<div>` — a Term sits inside `<p>`, and invalid nesting
breaks hydration. An invariant test fails any visual whose id has no definition. See
`npm`/`pnpm` for the house examples.

Two JSX cautions, both real bugs that shipped once.

**Spacing.** Put an explicit `{' '}` between a `<Term>` and the text beside it. JSX keeps
whitespace that sits on the same line as the tag and strips whitespace that contains a
newline, so `<Term>adr</Term> is the answer` compiles with its space, while the same
markup rewrapped to put `is the answer` on the following line compiles without one — and
rewrapping is Prettier's job, not a decision you make. Where the term sits in the
paragraph has nothing to do with it: a `<Term>` opening a `<p>` is safe when the text
follows on the same line and unsafe when it does not, exactly like one in mid-sentence.
`{' '}` is the fix because it is a real child that survives a rewrap. This is the
"solution treeis" bug.

**Quotes.** Straight quotes inside definitions are fine — they render as text. The hazard
is in `Figure` captions, where a straight double quote closes the JSX attribute early; use
typographic quotes there.

### `References` — `src/components/References.tsx` + `src/lib/references.ts`

Closes a stage with 3–5 outward links (a test enforces the cap — a link dump is not a
reading list). Each entry states **what it adds beyond the stage**, not just its title,
so the reader can judge the click before making it. Renders nothing when a stage has no
references, so it is safe to mount everywhere.

Pick sources that extend rather than repeat: the origin of an artifact the stage
borrows, a second lens on the same decision, the team-shaped version of a solo
practice. Verify each URL resolves in a real browser — some publishers 403 command-line
requests while serving fine to people.

### Content primitives — `src/components/ui.tsx`

- **`Section`** (`eyebrow`, `title`) — a titled block with the label-plus-rule header.
- **`Prose`** — a readable-measure text column. The connective tissue between interactive
  pieces, not the main event.
- **`Callout`** (`kind: info | warn | trap`) — a bordered aside. `trap` is the recurring
  "failure modes worth naming" block every stage closes on.
- **`Contrast`** (`bad`, `good`) — a side-by-side weak/strong pair. Each side is labelled,
  so colour is never the only signal.
- **`Card`** — the plain bordered surface most interactive components sit in.

---

## Interaction patterns

The reusable UX moves. Each names its canonical example in stage 01 so the next stage can
copy a working version rather than start from scratch.

| Pattern                  | What it teaches                                                    | Reach for it when                                                | Canonical example                                 |
| ------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------- |
| **Expand to reveal**     | A list of things, each with detail worth hiding until wanted       | You have 3+ items that each need a paragraph                     | `ValidationLadder`, `AIWorkflow`, `WorkedExample` |
| **Tabs**                 | Parallel categories the reader picks between                       | Content splits into 3–5 peer groups                              | `Toolkit`                                         |
| **Single-select scorer** | A judgment call along a scale, with the consequence of each choice | The stage turns on one decision (severity, risk, priority)       | `SeverityScorer`                                  |
| **Guess then reveal**    | Right-vs-wrong judgment, scored                                    | You can show good and bad examples of the same skill             | `QuestionLab`                                     |
| **Click-node inspector** | A structure whose parts each mean something                        | You have a diagram, tree, or pipeline with explainable nodes     | `OpportunityTree`, `DiscoveryFlow`                |
| **Annotated artifact**   | Which parts of a real artifact carry a decision                    | You are quoting something verbatim — schema, config, workflow file | `SchemaInspector`                                 |
| **Copy artifact**        | A prompt, command, or template the reader will actually use        | You are handing over something to paste elsewhere                | `AIWorkflow` prompts                              |
| **Persisted worksheet**  | The stage's output, filled in and kept                             | The stage produces a document (a one-pager, a checklist, an ADR) | `Worksheet`                                       |

Notes that make each land:

- **Expand to reveal** is the workhorse. Show the item's title and a one-line summary
  collapsed; put the reasoning, the example, or the trade-off inside. The reader scans the
  list, opens what they need.
- **Guess then reveal** must lock the answer before showing the verdict, and should score
  across the set ("3/6 right"). A revealed answer the reader did not commit to teaches
  nothing.
- **Click-node inspector** pairs a diagram with a detail panel that updates on selection.
  Colour-code levels but always add a second signal (a dot, a label) so the coding is not
  the only cue.
- **Annotated artifact** is the click-node inspector applied to text you did not draw.
  Quote the artifact verbatim, so the reader can lift it; then annotate only the lines
  that carry a decision, and leave the structural lines inert and unclickable — which
  parts are worth explaining is itself the lesson. Give the block its own
  `overflow-x-auto` container with `tabIndex={0}` rather than shrinking the type or
  letting the page scroll sideways: code does not reflow, and a keyboard user without a
  trackpad still has to reach the scroll. Use no semantic colour unless a line is
  genuinely wrong — in a schema, none of them is.
- **Persisted worksheet** uses `useLocalStorage` and exports to markdown, so the reader
  leaves with the artifact. It is the bridge from reading the stage to doing the work.
  Where the stage also has a scored exercise, ask the worksheet the *same questions* the
  exercise asked: the reader answers them against the worked example first, then against
  their own project (`ModelInterrogation` → `DomainWorksheet`). That pairing is a
  composition of two patterns already in this table, not a third one.

---

## The baseline every interactive piece meets

Non-negotiable, and the reason the stage feels consistent rather than a pile of widgets:

- **Real semantics.** Tabs use `role="tab"`, single-select uses `role="radio"`, expandable
  controls set `aria-expanded`, definition panels use `role="note"`. Not `<div>` with an
  onclick.
- **Keyboard and touch first.** Everything works without a mouse. No hover-only reveal — a
  definition you cannot open on a phone is not a definition, which is why `Term` is
  click, not hover.
- **Touch targets ≥44px** below `lg`; may tighten to 36px on the desktop rail.
- **`aria-live`** on anything that swaps content in place (a scorer verdict, a running
  count) so screen readers hear the change.
- **Collapsed by default.** A reader who already knows the material is never slowed by it.
- The three passes from `DESIGN.md` — contrast in both themes, no overflow 320–2560px,
  zero console errors — run against the finished stage.

---

## Building a new stage

The mechanics (see `CLAUDE.md` for the file-by-file trace):

1. Read the stage's markdown doc. Its sections and its "Traps" block are the raw material.
2. Group sections into `Step`s by phase — one judgment per step, each panel under four
   screens (D-52). Four to six is the usual answer, not a limit.
3. For each section, pick a pattern from the table above. Prose is the fallback, not the
   default — if a section is only prose, ask what the reader could _do_ with it instead.
4. Wrap every diagram in `Figure`; number them across the stage.
5. Add `terms.ts` entries for jargon the stage introduces, and wrap first appearances.
6. Close on a `Callout kind="trap"` set, the way stage 01 does.
7. Add a `*.test.tsx` render test for any component that derives what it displays from
   data rather than displaying it directly — see "When a component gets a render test"
   below, which exists because a data test and a component that ignores the data are both
   green and together wrong.
8. Run the three verification passes and the `humanizer:humanizer` prose pass.

A stage is done when a reader could learn the topic from it cold — clicking, guessing,
and reading definitions — without already knowing the vocabulary.

---

## When a component gets a render test

Vitest runs two projects: `unit` (node, `*.test.ts`) and `dom` (jsdom, `*.test.tsx`). The
file extension picks the environment, so a render test is `Component.test.tsx` beside
`Component.tsx` and needs no configuration.

**The rule: a component that derives what it displays from data, rather than displaying
the data directly, gets a render test.**

Written against the failure it prevents. A data test proves the function returns the right
answer; it says nothing about whether the component shows it. Both green, and the reader
still sees nothing — which is how a passing suite ships a broken lesson.

Three shapes that qualify:

- **A conditional render of something a data test guarantees.** The interrogation's
  reasoning is returned on both branches and asserted in `scoring.test.ts`. Gating it on
  `correct` in the component passes every data test and hides it from the readers who most
  need it.
- **A module-private helper.** `fieldName()` in `SchemaInspector` is not exported, so the
  render is its only surface.
- **An accessible name assembled in the component.** `BoundaryMap` once hardcoded
  "allowed" into a name while only the visible badge derived from the data, so flipping the
  data would have told a sighted reader and a screen-reader user opposite things, with
  nothing failing. A per-task review caught that one; a render test is what catches the next.

What does not need one: a component that renders a prop as text, a layout wrapper, a
component whose whole behaviour is already covered by the audit suite driving the real
page.
