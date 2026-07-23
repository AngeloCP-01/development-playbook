# Development Playbook — Design System

The visual direction, in one place, so seventeen more stages can be built without
re-deriving it. Token values here are the source of truth's *documentation* —
`src/app/globals.css` is the source of truth itself. If they disagree, the CSS wins and
this file is the bug.

---

## Direction

A technical drawing. Light mode is a **whiteprint** — dark linework on drafting paper,
the way a modern diazo print reads. Dark mode is a **cyanotype** — pale linework on
Prussian blue, the way the original blueprints did.

Both are real artifacts. Dark mode is a second drawing, not an inverted filter, and gets
designed as such.

**Deliberately avoided:** cream + serif display + terracotta; near-black + acid green;
broadsheet hairlines with zero radius. These are the defaults that appear regardless of
subject.

---

## Colour

Two rules govern everything:

1. **Accent means attention, never approval.** `brand` (annotation orange, the colour of
   redline markup) marks active states, eyebrows, "you are here". Using it to mean
   "this is good" is a bug — it was one, and it was fixed.
2. **Semantic colours carry meaning and nothing else.** `go` / `danger` / `warn` are
   never used for emphasis or decoration.

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#efeee8` | `#0a1a2c` | Page |
| `surface` | `#faf9f5` | `#102640` | Raised panels, cards |
| `sunk` | `#e6e4dc` | `#071322` | Recessed fills, code blocks |
| `ink` | `#10243e` | `#e9eff6` | Primary text |
| `graphite` | `#46586e` | `#adc0d4` | Body text |
| `faint` | `#556377` | `#98abc0` | Secondary labels |
| `rule` | `#cbc7bc` | `#23405f` | Hairlines |
| `rule-strong` | `#ada79a` | `#37587c` | Emphasised rules |
| `blueprint` | `#23508f` | `#86b4ee` | Structure, diagram linework |
| `signal` (accent) | `#a54407` | `#f2954a` | Attention only |
| `go` | `#1a6b4f` | `#4fc296` | Semantic yes |
| `stop` | `#a52218` | `#f2776d` | Semantic no |
| `warn` | `#8a5a06` | `#e3ab4d` | Caution |

Each semantic colour has a `-wash` companion for fills.

**Both `faint` and `signal` were darkened to clear WCAG AA** — `faint` was 2.99:1 on the
darkest light surface, `signal` was 4.11:1 at small sizes. Solve numerically against the
*worst-case* surface before changing either: for dark text that is `sunk`, for light text
it is `surface`.

---

## Type

| Face | Role |
|---|---|
| **Archivo** (variable `wdth`) | Display and UI. Pushed wide for plate lettering. |
| **Newsreader** | Body. A serif, on purpose — this is read at length. |
| **JetBrains Mono** | Data and labels. |

Body is **17px / 1.75**. Roles are utility classes, not Tailwind sizes:

| Class | Spec | Use |
|---|---|---|
| `t-display` | Archivo, `wdth 118`, 700, uppercase, `-0.005em` | Stage titles, hero. Sparingly. |
| `t-head` | Archivo, `wdth 108`, 600, `-0.008em` | Section headings |
| `t-ui` | Archivo, `wdth 100` | Buttons, nav, controls |
| `t-label` | JetBrains Mono, 500, 11px, `0.1em`, uppercase | Stamped labels, eyebrows |
| `t-data` | JetBrains Mono, 500, tabular | Sheet numbers, counts, timings |

**Display type is sized with `clamp()`**, never fixed steps. Expanded caps are wide by
nature — "DEVELOPMENT" overflowed a 320px viewport at a fixed size. Check the longest
real string, which is currently "Post-Deployment Verification".

---

## Layout

- Container `max-w-[1400px]`, gutters `px-6` rising to `px-10` at `sm`
- **`main :is(p, li)` caps at 68ch by default.** The container is wide so diagrams get
  room; prose stays readable with no per-component effort. Opt out with `.measure-full`.
- Sidebar rail appears at `lg` (1024px). Below that it is a drawer — at 768px a 288px
  rail leaves the prose column too narrow to read.
- Sticky elements below `lg` must clear the 61px mobile top bar.

## Surfaces

Drawn, not floated. **Hairline rules and flat fills, no shadows, no rounded corners, no
blur.** A drawing has linework and paper; nothing hovers above the sheet, and frosted
glass belongs to a different design language.

The one exception is the **title block** on each stage, which keeps a 2px border and a
solid fill. It is the signature element and carries the weight alone.

---

## Motion

One orchestrated moment: the hero rule draws itself like an ink line
(`.rule-draw`, 550ms). Everything else is a 150ms colour transition.

`prefers-reduced-motion` is respected globally.

---

## Quality bar

Non-negotiable for any UI change. These are checked against a live build, not asserted:

- **Contrast** — every distinct text/background pair passes WCAG AA in *both* themes
- **Responsive** — 320→2560px, no horizontal overflow
- **Touch targets** — ≥44px below `lg`; may tighten to 36px at `lg` where the pointer is
  a mouse
- **Focus** — visible ring, never removed
- **Colour is never the only signal** — pair it with a label, icon, or position
- **Console** — zero errors

Two cautions learned the hard way: a checker reporting mass failures is usually the
checker, and colour parsers must handle `oklab()` — Tailwind emits it for alpha
backgrounds.
