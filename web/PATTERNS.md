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

### `RevealList` — `src/components/RevealList.tsx`

A titled row, optionally a one-line summary under the title and a badge beside it, with the
detail behind the click. Eleven components in stage 03 use it, twelve instances in all
(`AIArchitecturePlays` renders two). Do not write another one.

```tsx
<RevealList
  idPrefix="resilience"
  rows={rows} // RevealRow[]
  header={<div>…</div>} // optional, above the rows, inside the Card
  footer={<p>…</p>} // optional, below them
/>
```

`RevealRow` is `{ id, title, badge?, summary?, body }`.

- **`title`** takes a `string` **or** a `ReactNode`, and the two branches are not the same.
  A string is wrapped in the component's own `font-medium` span and renders at ambient body
  size — 17px. A `ReactNode` renders unwrapped, so **the caller owns its own sizing and
  weight**. That is what `AIArchitecturePlays` needs: its claim rows are `text-sm`, and
  before the slot was widened a migration would have grown every claim from 14px to 17px.
  If your title is a plain phrase, pass the string and inherit the house style.
- **`badge`** is a `ReactNode` rendered **beside** the title, not below it. Two components
  used to render their badge below (`DeferredList`, `ContractCost`); adopting the slot moved
  both, and that was accepted as a deliberate visual change rather than worked around.
- **`summary`** is optional. Omit it and no element is emitted; passing `''` renders an
  empty span. One caller, `ContractCost`, was actually doing that; two more
  (`AIArchitecturePlays`, `ADRAnatomy`) have no summary either, so the same workaround
  would have recurred three times had the prop stayed required. Which is why it did not.
- **`body`** is whatever the panel holds. `RevealFacet` is the usual filling.

**Rows open independently. This is not an accordion, and that is deliberate.** A reader
comparing two options has to be able to hold both open, and there is no ordering here for a
single-open panel to defend. `RevealList` tracks open rows as a `Set` of ids.

**`idPrefix` is load-bearing.** Each panel's DOM id is `` `${idPrefix}-${row.id}` `` and it
is what `aria-controls` points at. Changing a prefix renames every panel id in that list,
and **nothing in the gate notices**: the audit sweeps *step* hashes, derived from each
stage's rail since TD-12 closed, and never a disclosure's own id — so the same number of
rows still renders either way and every sweep stays green.
When you migrate a component onto `RevealList`, pick the prefix that reproduces the ids it
already emitted, and check with `AUDIT_IDS=1 node e2e/count-expandables.mjs` against a
freshly started server — it prints the total, the id count, and the ids themselves.

Two constraints, neither fixed, both of which will bite the next caller:

**Row headings are hardcoded `<h3>`.** A caller whose own section heading is also `<h3>`
gets a flat outline instead of a nested one, and `RevealList` gives it no say. `ScalingMoves`
already had this shape before the extraction; `AIArchitecturePlays` acquired it, its rows
having been `<h4>`. Nothing renders differently — `globals.css` sets no global `h3`/`h4`
rule — so this costs assistive-technology users and nobody else. Tracked as **TD-34**.

**The panel always applies `space-y-3`.** Tailwind v4 compiles that to
`:where(.space-y-3 > :not(:last-child))` setting `margin-block-end: 0.75rem`, so a panel with
**more than one direct child** gets 12px between them whether it wants it or not. Five of
the eleven original panels did not have `space-y-3` (`EvolutionNotes`, `ContractCost`,
`Normalisation`, `TraceForward`, `AIArchitecturePlays`), and two of them changed when they
adopted it: `Normalisation` went 4px → 12px, and `TraceForward` 12px → 24px, the second because its
trailing `<a>` is `inline-flex` and an inline box's margin does not collapse with a block
sibling's. **The fix in both cases is to wrap the affected children in a `<div>`**, which
makes them one child again and restores the original spacing. A panel whose body is a single
element is safe by construction, since the only child is also the last child.

None of this is visible to any check the project runs. The expandable count does not move
(same disclosures), the ids do not move (nothing renamed), the audit stays green (8px is not
a contrast or touch-target failure) and jsdom renders no CSS at all. **Measure the computed
gap in a real browser, before and after, on a server you started fresh** (TD-27 — a reused
tab serves a stale build and reads as "no change").

### `RevealFacet` — `src/components/RevealFacet.tsx`

One labelled paragraph inside a row body: a tracked-caps label over a small paragraph. It
was written out longhand thirteen times across five components before it existed.

```tsx
<RevealFacet label="the catch" tone="warn">
  …
</RevealFacet>
```

- **`label`** is a plain string, rendered uppercase.
- **`tone`** colours the label: `blueprint | warn | go | danger | subtle`, default `subtle`.
  Semantic colour means what `DESIGN.md` says it means. `go` is "this is good", `warn` and
  `danger` carry their own weight, and `brand` is not on the list because it means "you are
  here" and using it for approval has already been a bug in this repo.
- **`bodyTone`** colours the paragraph: `muted | fg`, default `muted`. `fg` exists for
  `ADRAnatomy`'s worked example, whose body is full ink rather than graphite — genuinely
  different tokens in both themes.

**Both tones resolve through a static `Record` map, and neither may ever become a template
literal.** `text-${tone}` typechecks, lints clean, and ships a class Tailwind never generated
a rule for, because Tailwind's scanner only keeps classes it can read whole in the source.
The paragraph then renders with no colour at all.

**No render test can catch that**, which is why it gets a paragraph. Each tone's class
is its own name with a prefix, so the map and the interpolation produce byte-identical
`className` strings, and the difference exists only in compiled CSS, which jsdom does not
produce. The guard is `RevealFacet.source.test.ts`, which reads the component's own text —
the same thing Tailwind reads — and fails when a tone's class stops appearing as a complete
literal. Deleting the map and interpolating leaves both render tests green; only the source
test goes red. Lint closes the remaining hole, failing the dead-but-declared map on
`no-unused-vars` at `--max-warnings 0`.

Any future map of the same shape, a size or a variant or a border colour, needs its own
source test for the same reason.

### `InlineCode` — `src/components/InlineCode.tsx`

Renders a data string's backticked spans as `<code>`, and knows one construct.

**Use it whenever a component renders a string that came out of a doc.** Stage 04 is the
first stage whose *data* carries markup: stages 01–03 hold concepts and write their code
spans as JSX by hand, while stage 04 holds filenames, flags and commands, so its seven
data modules quote them the way `docs/04-project-setup.md` does — about two hundred
backticks across the wave.

Stripping them from the data is not available, which is what makes this a component rather
than a cleanup. `CLIENT_FAILURE`, `PIN_RULE` and nineteen artifact blocks are asserted to
appear in the doc character-for-character, and the doc has the backticks (**D-67**).

Three things worth knowing before reaching for it:

- **It is deliberately not a markdown renderer.** Asterisks, links and underscores pass
  through as written. A half-markdown renderer invites data that assumes the other half.
- **An unpaired backtick renders literally**, rather than turning the tail of the sentence
  into a monospace span. A typo in the data should look like a typo.
- **An accessible name cannot hold elements.** A data string used as an `aria-label` needs
  its markers stripped instead — `plain()` in `DeployBlockers.tsx` is the one case so far.

Nothing tests that no backtick reaches the page. The eleven that shipped raw were found by
grepping the built HTML, twice, and that is still the only method that finds them.

### `AnnotatedArtifact` — `src/components/AnnotatedArtifact.tsx`

One config file quoted verbatim and annotated line by line. `{ id, filename, language,
lines }` (each line `{ text, note?, pivot? }`) is typed in `src/components/artifact.ts`;
the artifacts themselves stay per stage — `src/features/setup/artifacts.ts`,
`src/features/development/artifacts.ts` — since they are data, not something to share.
Extracted to `src/components/` when stage 05 became the second caller (`language` gained
`'tsx'` there, for application code rather than config). Five of stage 04's steps render
one — `format`, `strict`, `env`, `hooks` and `ci` — plus nine of stage 05's, which is why
the artifact is a prop rather than picked inside the component. It is a server component;
nothing in it is interactive.

`AnnotatedArtifact.test.tsx` stays in `src/features/setup/`, not beside the component it
tests. It renders stage-04 data (`ARTIFACTS.lefthook`) and pins a blank line in
`lefthook.yml`, so it lives with the data it exercises rather than with the shared
component — moving it would have meant either a synthetic fixture (losing the guarantee
that the test pins content copied from the doc) or a `src/components/` module reaching
back into `src/features/setup/`, which inverts the layering this extraction exists to
avoid.

**Per-line elements with `t-data whitespace-pre`, not a `<pre>`, and that is a
measurement rather than a preference.** A rendered line costs **20px** here
(`text-[13px]`/`leading-5`, `sm:text-sm` holding the same 20px) against a `<pre>`'s
**24px a line plus 24px of block padding** it does not give back. Five panels carry one
of these, so the difference is whether they clear the round's 3.2-screen ceiling. The
shape is `SchemaInspector`'s per-line render (`src/features/architecture/SchemaInspector.tsx:54`)
minus its click-to-select detail panel.

The note sits **beside** its line at `sm` and up and **below** it under that. That
placement is what makes the horizontal scroller per line rather than one container
around the whole block: the widest line in `artifacts.ts` is 92 characters, so a shared
`min-w-max` block would push a right-hand note column past 700px and out of the 1024px
panel the audit measures, leaving the reader to scroll sideways to reach the annotation
that is the point. Each code cell therefore scrolls on its own and carries
`tabIndex={0}` — the cost is one tab stop per line, paid so no note is ever off-screen.

The **pivot** line (at most one per artifact) takes the `brand` accent, because a pivot
is the line the step's judgment turns on: attention, not approval. Colour is not the only
signal for it — the row also carries a `PIVOT` label its neighbours do not. No semantic
colour applies to any line, since none of them is wrong.

`data-artifact-line`, `data-artifact-note` and `data-artifact-pivot` exist for
`AnnotatedArtifact.test.tsx`, which holds the rendered lines against
`lines.map(l => l.text)` as a sequence. A line element must therefore contain its line
text and nothing else — no line numbers, no note text inside it.

### `TeamNotes` — `src/components/TeamNotes.tsx`

The collapsed "If you are not solo" disclosure, carrying a stage's team-scoped material
without making it part of the main read. `{ title?, children }`; the title defaults.

Every stage ships one (TD-13). **Mount it inside the stage's checklist component**, not as
its own step — both stage 04 (`SetupChecklist.tsx`) and stage 05 (`DevChecklist.tsx`) do
this, and the code is the ground rule here: this section used to say "near the end of the
stage's closing step," and that was the bug, not the two stages. It lives in
`src/components/`, not in a feature folder, precisely so the next stage imports it instead
of writing a third version by hand.

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
| **Expand to reveal**     | A list of things, each with detail worth hiding until wanted       | You have 3+ items that each need a paragraph                     | `RevealList` (+ `RevealFacet` for row bodies)     |
| **Tabs**                 | Parallel categories the reader picks between                       | Content splits into 3–5 peer groups                              | `Toolkit`                                         |
| **Single-select scorer** | A judgment call along a scale, with the consequence of each choice | The stage turns on one decision (severity, risk, priority)       | `SeverityScorer`                                  |
| **Guess then reveal**    | Right-vs-wrong judgment, scored                                    | You can show good and bad examples of the same skill             | `QuestionLab`, `AuthorizationDrill`               |
| **Click-node inspector** | A structure whose parts each mean something                        | You have a diagram, tree, or pipeline with explainable nodes     | `OpportunityTree`, `DiscoveryFlow`                |
| **Annotated artifact**   | Which parts of a real artifact carry a decision                    | You are quoting something verbatim — schema, config, workflow file | `SchemaInspector`                                 |
| **Copy artifact**        | A prompt, command, or template the reader will actually use        | You are handing over something to paste elsewhere                | `AIWorkflow` prompts                              |
| **Persisted worksheet**  | The stage's output, filled in and kept                             | The stage produces a document (a one-pager, a checklist, an ADR) | `Worksheet`                                       |

Notes that make each land:

- **Expand to reveal** is the workhorse. Show the item's title and a one-line summary
  collapsed; put the reasoning, the example, or the trade-off inside. The reader scans the
  list, opens what they need. Build it with `RevealList` and pass rows. Stages 01 and 02
  hold four hand-rolled disclosures that were this row's canonical examples before the
  component existed (`ValidationLadder`, `AIWorkflow`, `WorkedExample`, `AIPlanningPlays`).
  They are not simply un-migrated: each keeps a single row open (`useState(PLAYS[0].id)`)
  where `RevealList` lets any number be open at once, so converting one is a behaviour
  change and needs its own decision. Do not copy their markup into a new stage.

  Stage 03 holds three more hand-rolled disclosures, and these are **not** candidates at
  all: `ERView`, `InternalOrganisation` and `RouteShape`. Each is a grid of selected tiles
  with one open at a time (`useState<string | null>`) — no chevron, no `Card p-0`, no
  `divide-y` row list. They are the click-node inspector wearing a disclosure, not this
  pattern, and `RevealList` would render something else entirely. Named here because the
  folder is otherwise accordion-free, and "no accordions left in stage 03" is easy to read
  as "nothing here is hand-rolled".
- **Guess then reveal** must lock the answer before showing the verdict, and should score
  across the set ("3/6 right"). A revealed answer the reader did not commit to teaches
  nothing. Stage 05's `AuthorizationDrill` is a second instance, not a new pattern: six
  safe/unsafe code snippets, one binary judgment per row, locked before the verdict shows,
  scored across the set — the same shape as `QuestionLab` with code where the quiz had
  text. Named here rather than given its own row because the row it already fits was
  written for exactly this generalisation. Stage 06 adds two more instances, not two more
  rows: `TriageDrill` (six changes, a four-option radiogroup per row rather than binary,
  because the doc's own distribution has four tiers) and `TeethCheck` (three teeth-check
  transcripts, proven/not-proven, structurally `AuthorizationDrill`'s binary radiogroup
  again with a different question). Four instances now share this one row.
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
