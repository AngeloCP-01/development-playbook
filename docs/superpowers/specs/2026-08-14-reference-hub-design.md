# Reference hub — parked design note

**Status: PARKED 2026-08-14.** Not a spec. Brainstormed to the point of a design,
then held because `refactor/reveal-list` and stage 04's port are still in flight in
another session. Resume by re-reading this, confirming the open question at the
bottom, then writing the real spec.

## Problem

Quick-reference material has nowhere to live. `reference/glossary.md` and
`reference/stack.md` exist in the docs deliverable but are unreachable from the web
app — no route renders either. Separately, the intent is to collect cheatsheets
(architecture patterns, design patterns, git, coding conventions, and per-language
sheets) as fast lookup for things that get forgotten.

## Decisions taken

**D1 — A Reference hub, not a 19th stage.** `/reference` mirrors the root
`reference/` folder 1:1. It absorbs glossary and stack alongside cheatsheets.
A 19th stage was rejected: `stages.test.ts:9-37` asserts exactly 18 in four places,
`Sidebar.tsx:48` renders a hard-coded `18`, and the filing-code claim in CLAUDE.md
depends on the count being fixed.

**D2 — Sheets tether to stages by slug.** Each cheatsheet carries an optional
`stage` field holding a real `STAGES` slug, so architecture patterns points at 03,
git at 04, conventions at 05. A test asserts every tether resolves, which is what
keeps the link honest as stages get retitled.

**D3 — Structured TS data plus one renderer.** Follows the `terms.ts` precedent
(D-36): TS is the source, markdown is generated. One `<Cheatsheet>` component
renders every sheet, so sheet number ten costs no new UI. Rejected: a React
component per sheet (nine components, no generated markdown, search needs separate
work), and MDX read at build time (reverses D-36, adds a pipeline).

**D4 — First slice is a walking skeleton with one sheet.** Type, registry, index
route, sheet route, renderer, sidebar block, markdown generation, one real sheet.
Deferred to slice 2: glossary and stack surfaced in the hub, stage backlinks,
search, sheets 2–9.

## Shape

```ts
type Row     = { code?: string; term?: string; what: string; when?: string }
type Section = { title: string; note?: string; rows: Row[] }

type Cheatsheet = {
  slug: string
  title: string
  group: 'Architecture' | 'Git' | 'Standards' | 'Languages'
  stage?: string
  blurb: string
  source?: { title: string; author: string; url?: string }
  sections: Section[]
}
```

`source` exists so attribution is a visible empty field rather than something
forgotten. The site is publicly deployed, so sheets derived from someone else's
graphic need credit, and sheets are better written from scratch with a sources line
than reproduced panel-for-panel.

Sections render as a CSS grid rather than a `<table>` — tables overflow at 320px and
`audit.spec.ts` forbids horizontal scroll. Diagrams stay out of the data modules so
they remain serializable; a `features/cheatsheet-figures.tsx` registry maps slug to
figures, the same shape `features/stage-content.ts` already uses.

## Known hazards

- `lib/references.ts` and `components/References.tsx` already exist and mean
  *outward links per stage*. Same word, different concept. Not renaming them as part
  of this work; recorded so the ambiguity is not rediscovered.
- `Sidebar.tsx` currently maps `STAGE_GROUPS` at top level. A second nav block is a
  small restructure of a file with no render test covering the stage index today.
- New routes must be appended to the audit route list (`audit.spec.ts:11-30`) or they
  skip the contrast and responsive gates.

## Open question at resume

Which sheet leads slice 1. The walking skeleton assumed **architecture patterns**
because `reference/software-architecture-patterns.md` is already transcribed, but
that sheet is six diagrams and exercises the figure registry — the unusual path.
Seven of the nine planned sheets are tabular, so **git commands** proves the path
that makes the rest cheap, and tethers to stage 04, which is in flight anyway.

Not resolved. Decide at resume.

## Deferred

- Search across the hub. Already sitting unscheduled in `docs/task.md:541` for
  stages; a cheatsheet section makes it matter more, but it is not slice 1.
- Print stylesheet. Also already in the backlog, and a cheatsheet is the single most
  print-worthy page type in the app.
- Renaming `References.tsx` to something unambiguous.
