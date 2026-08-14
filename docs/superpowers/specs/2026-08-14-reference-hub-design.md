# Reference hub — parked design note

**Status: ACTIVE 2026-08-14.** Parked earlier the same day, then resumed when the
slice was redefined (see D5). Stage 04's port remains in flight in another session,
so this work touches no stage content and no `features/` directory.

Plan: `docs/superpowers/plans/2026-08-14-reference-hub-skeleton.md`.

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

**D5 — Register every planned sheet up front; empty is a valid state.** This
supersedes the "one lead sheet" question the parked version left open. All eleven
sheets exist in the registry from the first commit; a sheet with `sections: []`
renders a "sheet not drawn" placeholder and is marked on the index. The reason is
diagnostic rather than cosmetic: an empty sheet advertises a gap, so the index
doubles as a worklist of what still needs gathering. It mirrors how a slug absent
from `STAGE_CONTENT` already renders a placeholder rather than 404ing.

Consequence: the figure registry is not needed in this slice. The only sheet with
content is `architecture-patterns`, and it lands as rows now, with its six diagrams
deferred to the slice that introduces figures.

## The eleven sheets

| Slug | Group | Stage | Content at ship | Source held |
|---|---|---|---|---|
| `architecture-patterns` | Architecture | 03 | rows | `Software-Architecture-Patterns.gif` |
| `design-patterns` | Architecture | 03 | empty | `software_design_patterns.jpeg` |
| `api-design` | Architecture | 03 | empty | `MasterPlan-Api-Design.gif` |
| `git-commands` | Git | 04 | empty | `git-commands.jpeg` |
| `git-branching` | Git | 04 | empty | — |
| `coding-standards` | Standards | 05 | empty | — |
| `javascript` | Languages | — | empty | — |
| `python` | Languages | — | empty | — |
| `java` | Languages | — | empty | — |
| `spring-boot` | Languages | — | empty | — |
| `express` | Languages | — | empty | — |

Scoped out deliberately: the SQL, caching, scaling, testing, security and container
sheets sketched in `reference/cheatsheet-sources.md` under priority 3. They were not
asked for. They are recorded there so adding them later is a content change, not a
rethink.

## Housekeeping

A byte-identical duplicate of the architecture GIF was found while gathering —
`Software-Architecture-Patterns.gif` and `Software_Architecture_Patterns.gif`, same
SHA-256, 1MB each. The user deleted the underscored copy the same day; the citation
in `reference/software-architecture-patterns.md` was repointed to the hyphenated
name that survives.

## Deferred

- Search across the hub. Already sitting unscheduled in `docs/task.md:541` for
  stages; a cheatsheet section makes it matter more, but it is not slice 1.
- Print stylesheet. Also already in the backlog, and a cheatsheet is the single most
  print-worthy page type in the app.
- Renaming `References.tsx` to something unambiguous.
