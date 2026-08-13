# RevealList Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace **eleven** byte-identical expand-to-reveal accordions in `src/features/architecture/` with one shared `RevealList`, before stage 04 copies the pattern again.

*This line said "five" until after Task 7, when a check for remaining callers found six more. See "Scope extension — Tasks 9–14" at the foot of this plan for how the count was wrong and why it mattered.*

**Architecture:** Two new components in `src/components/`. `RevealList` owns the open-set state, the card and row markup, the chevron, and the `aria-expanded` / `aria-controls` pairing; callers supply rows and optional header and footer slots. `RevealFacet` owns the labelled paragraph that appears thirteen times across the five bodies. Each caller migrates in its own task so a reviewer can reject one migration while approving its neighbour.

**Tech Stack:** React 19, Next 16, TypeScript, Tailwind 4, vitest (`dom` project, jsdom), `@testing-library/react`, Playwright for the equivalence audit.

## Global Constraints

- **Branch:** `refactor/reveal-list`, cut from `develop`. Never merge to `main`. Ask before any merge, including into `develop`.
- **Commit trailer**, every commit: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
- **Conventional Commits.** Scopes here: `web`, `a11y`, `tracker`, `patterns`.
- **The iron law.** No production code without a failing test first. Both new components get a `.test.tsx` before they exist.
- **Tailwind cannot see dynamically built class names.** `text-${tone}` is purged and renders unstyled. Every colour class must appear as a complete literal string in the source. This is why `RevealFacet` carries a static tone map. **It is not why the render test exists** — corrected during Task 1: the map and the interpolation emit byte-identical `className` strings, so no jsdom assertion can tell them apart, and the defect lives only in compiled CSS. `RevealFacet.source.test.ts` is what catches it, plus lint's `no-unused-vars` for the shallow case.
- **React 19 forbids setState in an effect body.** `RevealList` holds state in `useState` only; no effect reads or writes it.
- **File extension picks the test environment.** `*.test.tsx` runs in `dom` (jsdom), `*.test.ts` in `unit` (node). No per-file configuration.
- **`fireEvent`, not `element.click()`.** RTL wraps the dispatch in `act()`; a bare `.click()` does not, and the assertion runs before React commits.
- **One deliberate visual change, declared rather than smuggled:** `DeferredList`'s "fails the test" badge moves from below the row title to beside it, matching `DeploymentStyles`. See Task 6.
- **Kill `:3100` before every `pnpm test:e2e`** (TD-27). A reused server measures the previous build and reports it as green.

## File Structure

| File | Responsibility |
|---|---|
| `src/components/RevealList.tsx` | The shell: open-set state, card, rows, chevron, ARIA pairing, header/footer slots |
| `src/components/RevealList.test.tsx` | Render tests for the conditional panel and the ARIA pairing |
| `src/components/RevealFacet.tsx` | One labelled paragraph inside a row body, with a static tone map |
| `src/components/RevealFacet.test.tsx` | Render test proving the tone map emits literal classes |
| `src/features/architecture/{EvolutionNotes,ResiliencePatterns,DeploymentStyles,DeferredList,ScalingMoves}.tsx` | Become row builders; lose their state, markup and chevron |
| `src/components/TeamNotes.tsx` | Moved from `features/architecture/`; TD-13 made it every stage's convention |
| `web/PATTERNS.md` | Gains both components under "Building blocks" |

---

### Task 1: `RevealFacet`

**Files:**
- Create: `web/src/components/RevealFacet.tsx`
- Test: `web/src/components/RevealFacet.test.tsx`

**Interfaces:**
- Produces: `RevealFacet({ label, tone?, children })`. `tone` is `'blueprint' | 'warn' | 'go' | 'danger' | 'subtle'`, defaulting to `'subtle'`. Tasks 3–7 all consume it.

Thirteen instances of the same two-element block across four components. It goes first because `RevealList`'s callers need it and because its tone map is the one piece of this refactor that can fail silently.

- [ ] **Step 1: Write the failing test**

```tsx
// web/src/components/RevealFacet.test.tsx
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RevealFacet } from './RevealFacet'

// Tailwind scans source for complete class strings. A tone rendered as
// `text-${tone}` compiles, type-checks, passes any data test, and ships
// unstyled — the failure this component exists to make impossible. So the
// assertion is on the emitted class attribute, not on the prop.
test('emits a literal tone class, since a template-built one is purged and renders unstyled', () => {
  render(
    <RevealFacet label="The catch" tone="danger">
      body text
    </RevealFacet>,
  )
  const label = screen.getByText('The catch')
  expect(label.className).toContain('text-danger')
})

test('falls back to subtle rather than to no colour, so an unspecified tone is still legible', () => {
  render(<RevealFacet label="What it is">body text</RevealFacet>)
  expect(screen.getByText('What it is').className).toContain('text-subtle')
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/components/RevealFacet.test.tsx
```

Expected: FAIL, unable to resolve `./RevealFacet`. Paste the raw output.

- [ ] **Step 3: Write the implementation**

```tsx
// web/src/components/RevealFacet.tsx
import type { ReactNode } from 'react'

/**
 * One labelled paragraph inside a `RevealList` row body. Thirteen of these
 * were written out longhand across five components in the architecture
 * feature before this existed.
 *
 * The tone map is not ceremony. Tailwind scans source for complete class
 * strings, so `text-${tone}` survives typecheck and lint and renders with no
 * colour at all — a defect no data test can see, which is why this component
 * carries a render test asserting the emitted class.
 */

type Tone = 'blueprint' | 'warn' | 'go' | 'danger' | 'subtle'

const TONE_CLASS: Record<Tone, string> = {
  blueprint: 'text-blueprint',
  warn: 'text-warn',
  go: 'text-go',
  danger: 'text-danger',
  subtle: 'text-subtle',
}

export function RevealFacet({
  label,
  tone = 'subtle',
  children,
}: {
  label: string
  tone?: Tone
  children: ReactNode
}) {
  return (
    <div>
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${TONE_CLASS[tone]}`}
      >
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-muted">{children}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
cd web && pnpm vitest run src/components/RevealFacet.test.tsx
```

Expected: PASS, 2 tests. Paste the raw output.

- [ ] **Step 5: Teeth check**

Replace `${TONE_CLASS[tone]}` with `text-${tone}` and re-run the **full** suite. Expected: the first test fails, and only it. Revert. Paste both runs. This proves the test is watching the emitted class rather than the prop.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/RevealFacet.tsx web/src/components/RevealFacet.test.tsx
git commit -m "feat(web): add RevealFacet, the labelled paragraph written out thirteen times

Static tone map rather than an interpolated class, because Tailwind scans for
complete strings and text-\${tone} typechecks, lints, and ships unstyled. The
render test asserts the emitted class for that reason.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: `RevealList`

**Files:**
- Create: `web/src/components/RevealList.tsx`
- Test: `web/src/components/RevealList.test.tsx`

**Interfaces:**
- Consumes: `Card` from `@/components/ui`, `ChevronDown` from `lucide-react`.
- Produces:

```ts
export type RevealRow = {
  id: string
  title: string
  badge?: ReactNode
  summary: string
  body: ReactNode
}

export function RevealList(props: {
  rows: RevealRow[]
  idPrefix: string
  header?: ReactNode
  footer?: ReactNode
}): ReactNode
```

Tasks 3–7 all consume exactly this. `idPrefix` keeps each caller's panel ids distinct, preserving the `deferred-`, `style-`, `resilience-`, `evolution-` and `scaling-` prefixes the audit suite already sees.

- [ ] **Step 1: Write the failing test**

```tsx
// web/src/components/RevealList.test.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RevealList } from './RevealList'

const rows = [
  { id: 'one', title: 'First', summary: 'first summary', body: <p>first body</p> },
  { id: 'two', title: 'Second', summary: 'second summary', body: <p>second body</p> },
]

// The panel is a conditional render. A component that always mounted the body
// would satisfy every data test about `rows` while destroying the pattern —
// collapsed by default is what keeps a long stage from reading as a wall.
test('keeps every row collapsed until it is opened, since collapsed-by-default is the pattern', () => {
  render(<RevealList rows={rows} idPrefix="t" />)
  expect(screen.queryByText('first body')).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(2)
})

// aria-controls is assembled in the component from idPrefix and row id. If it
// names an element that does not exist, a screen reader user is told there is
// a panel and cannot reach it, and nothing visual is wrong.
test('points aria-controls at the panel that actually mounts, since a dangling id is silent for sighted readers', () => {
  render(<RevealList rows={rows} idPrefix="t" />)
  fireEvent.click(screen.getByRole('button', { name: /First/ }))

  const control = screen.getByRole('button', { name: /First/ })
  expect(control.getAttribute('aria-expanded')).toBe('true')

  const panelId = control.getAttribute('aria-controls')
  expect(panelId).toBe('t-one')
  expect(document.getElementById(panelId!)).not.toBeNull()
  expect(screen.getByText('first body')).toBeDefined()
})

// Rows open independently rather than as a single-open accordion: a reader
// comparing two items has to be able to hold both open. This was a deliberate
// choice in DeferredList and is easy to lose in a rewrite.
test('lets two rows be open at once, since comparing items is why the list is not an accordion', () => {
  render(<RevealList rows={rows} idPrefix="t" />)
  fireEvent.click(screen.getByRole('button', { name: /First/ }))
  fireEvent.click(screen.getByRole('button', { name: /Second/ }))
  expect(screen.getByText('first body')).toBeDefined()
  expect(screen.getByText('second body')).toBeDefined()
})

test('renders header and footer slots outside the row list, since three callers close on a summarising paragraph', () => {
  render(
    <RevealList
      rows={rows}
      idPrefix="t"
      header={<p>the precondition</p>}
      footer={<p>the closing claim</p>}
    />,
  )
  expect(screen.getByText('the precondition')).toBeDefined()
  expect(screen.getByText('the closing claim')).toBeDefined()
})
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/components/RevealList.test.tsx
```

Expected: FAIL, unable to resolve `./RevealList`. Paste the raw output.

- [ ] **Step 3: Write the implementation**

Markup is lifted verbatim from the five existing components so the rendered output is unchanged. `space-y-3` is applied to every panel: four callers already have it, and the fifth renders a single child, where it has no effect.

```tsx
// web/src/components/RevealList.tsx
'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'

/**
 * The expand-to-reveal list, extracted from five byte-identical copies in
 * `features/architecture/` (`DeferredList`, `DeploymentStyles`,
 * `ResiliencePatterns`, `EvolutionNotes`, `ScalingMoves`). Two of those files
 * named the duplication in their own headers and deferred the fix as "a change
 * of its own"; this is that change, made before stage 04 produced copies six
 * through eight.
 *
 * Rows open independently, tracked as a `Set` of ids, rather than as an
 * accordion with one panel open at a time. There is no ordering here for a
 * single-open panel to defend, and a reader comparing two items should be able
 * to hold both open. That was `DeferredList`'s reasoning and it carries over.
 */

export type RevealRow = {
  id: string
  title: string
  /** Rendered beside the title, not below it. See `DeferredList`'s migration note. */
  badge?: ReactNode
  summary: string
  body: ReactNode
}

export function RevealList({
  rows,
  idPrefix,
  header,
  footer,
}: {
  rows: RevealRow[]
  idPrefix: string
  header?: ReactNode
  footer?: ReactNode
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  return (
    <Card className="p-0">
      {header}

      <ul className="divide-y divide-line">
        {rows.map((row) => {
          const open = openIds.has(row.id)
          const panelId = `${idPrefix}-${row.id}`
          return (
            <li key={row.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(row.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{row.title}</span>
                      {row.badge}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {row.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              </h3>

              {open && (
                <div
                  id={panelId}
                  className="space-y-3 border-t border-line bg-sunken px-5 py-4"
                >
                  {row.body}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {footer}
    </Card>
  )
}
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
cd web && pnpm vitest run src/components/RevealList.test.tsx
```

Expected: PASS, 4 tests. Paste the raw output.

- [ ] **Step 5: Teeth check, twice**

Two separate breaks, each run alone against the full suite, each reverted:

1. Change `{open && (...)}` to always render the panel. Expected: the collapsed-by-default test fails, and only it.
2. Change `aria-controls={panelId}` to `aria-controls={row.id}`. Expected: the ARIA pairing test fails, and only it.

Paste all four runs. A single break that fails three tests means the tests are not independent and should be tightened.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/RevealList.tsx web/src/components/RevealList.test.tsx
git commit -m "feat(web): add RevealList, extracted from five identical accordions

Markup lifted verbatim so the rendered output is unchanged; the migrations
that follow are checked against the audit's expandable count rather than
against the suite going green.

Two of the five callers named this duplication in their own headers and
deferred it. Doing it now rather than after stage 04 means writing three new
callers instead of rewriting three just-reviewed components.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Migrate `EvolutionNotes`

**Files:**
- Modify: `web/src/features/architecture/EvolutionNotes.tsx`

**Interfaces:**
- Consumes: `RevealList`, `RevealRow` from Task 2.

The simplest caller: one body paragraph, no badge, no header, no footer. It goes first because it proves the shell in isolation.

- [ ] **Step 1: Rewrite the component**

```tsx
// web/src/features/architecture/EvolutionNotes.tsx
import { RevealList } from '@/components/RevealList'
import { EVOLUTION_NOTES } from './evolve'

/**
 * Source: docs/03-architecture.md, "Evolve the schema safely".
 *
 * The four things the six-step sequence does not carry on its own, behind an
 * expand-to-reveal so the panel stays under D-52's four screens with the
 * teaching intact rather than trimmed.
 *
 * State, markup and semantics now live in `RevealList`; this file is the data
 * mapping and nothing else.
 */

export function EvolutionNotes() {
  return (
    <RevealList
      idPrefix="evolution"
      rows={EVOLUTION_NOTES.map((note) => ({
        id: note.id,
        title: note.title,
        summary: note.summary,
        body: <p className="text-sm leading-6 text-muted">{note.body}</p>,
      }))}
    />
  )
}
```

Note the dropped `'use client'`: this file no longer holds state, and `RevealList` carries the directive. Confirm the page still renders; if the build complains, restore it and record why.

- [ ] **Step 2: Run the suite**

```bash
cd web && pnpm vitest run && pnpm lint && pnpm typecheck
```

Expected: PASS, clean. Paste the counts.

- [ ] **Step 3: Verify the panel ids are unchanged**

```bash
cd web && lsof -ti:3100 | xargs kill -9
pnpm build && pnpm start -p 3100 &
AUDIT_IDS=1 node e2e/count-expandables.mjs | tail -40
```

Expected: **140 expandables, 107 ids**, and this caller's ids unchanged.

**Do not grep the built HTML for these ids — that check cannot fail.** These accordions live in non-default `Stepper` panels, so the static HTML carries only the RSC flight payload for them and never the rendered ids. Verified on 2026-08-13: `grep` for `evolution-`, `deferred-`, `style-`, `resilience-` and `scaling-` returns **zero** in the built HTML, before and after any migration. `count-expandables.mjs` drives a real browser, which is why it sees them.

- [ ] **Step 4: Commit**

```bash
git add web/src/features/architecture/EvolutionNotes.tsx
git commit -m "refactor(web): EvolutionNotes builds rows instead of owning an accordion

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Migrate `ResiliencePatterns`

**Files:**
- Modify: `web/src/features/architecture/ResiliencePatterns.tsx`

**Interfaces:**
- Consumes: `RevealList` (Task 2), `RevealFacet` (Task 1).

Four facets, the fourth conditional, plus a closing paragraph that becomes `footer`.

- [ ] **Step 1: Rewrite the component body**

Keep the existing file header comment verbatim. Replace the component with:

```tsx
export function ResiliencePatterns() {
  return (
    <RevealList
      idPrefix="resilience"
      rows={RESILIENCE_PATTERNS.map((p) => ({
        id: p.id,
        title: p.name,
        summary: p.summary,
        body: (
          <>
            <RevealFacet label="The failure it answers" tone="warn">
              {p.failure}
            </RevealFacet>
            <RevealFacet label="What it is" tone="blueprint">
              {p.what}
            </RevealFacet>
            <RevealFacet label="What earns it its place" tone="go">
              {p.earnsItsPlace}
            </RevealFacet>
            {p.catch && (
              <RevealFacet label="The catch" tone="danger">
                {p.catch}
              </RevealFacet>
            )}
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          One more name, worth knowing and not building:{' '}
          <strong className="font-medium text-fg">bulkhead</strong>, isolating
          resource pools so one saturated dependency cannot consume every
          thread. Real, and rarely earning its keep inside a single application.
          Building a timeout, retries, a breaker and a bulkhead around three
          third-party calls on day one is the same instinct as reaching for
          microservices, wearing different clothes — which is a claim about the
          machinery, not about the last row above. Deciding what still works
          without each dependency costs nothing and is the point of having drawn
          the diagram.
        </p>
      }
    />
  )
}
```

**The footer text is copied character for character.** A reworded footer is a content change hiding inside a refactor, and the equivalence audit will not catch it.

- [ ] **Step 2: Confirm the `{' '}` survived**

```bash
cd web && grep -n "{' '}" src/features/architecture/ResiliencePatterns.tsx
```

Expected: one hit, before `<strong>`. Prettier rewraps, and a lost `{' '}` produces "knowing and not building:bulkhead". This is the "solution treeis" bug in `PATTERNS.md`.

- [ ] **Step 3: Run the suite and commit**

```bash
cd web && pnpm vitest run && pnpm lint && pnpm typecheck
git add web/src/features/architecture/ResiliencePatterns.tsx
git commit -m "refactor(web): ResiliencePatterns builds rows and a footer slot

Footer text copied character for character; a reworded footer is a content
change hiding inside a refactor.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Migrate `DeploymentStyles`

**Files:**
- Modify: `web/src/features/architecture/DeploymentStyles.tsx`

**Interfaces:**
- Consumes: `RevealList`, `RevealFacet`.

The first caller with a badge. Its badge already sits beside the title, so this migration has **no** visual change and establishes the shape Task 6 adopts.

- [ ] **Step 1: Rewrite the component body**

Keep the file header comment verbatim, including its note that the chosen row is marked with `brand` rather than `go` because it means "you are here" and not "this one is correct".

```tsx
export function DeploymentStyles() {
  return (
    <RevealList
      idPrefix="style"
      rows={DEPLOYMENT_STYLES.map((style) => ({
        id: style.id,
        title: style.name,
        badge:
          style.id === CHOSEN_STYLE_ID ? (
            <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
              what this stage teaches
            </span>
          ) : undefined,
        summary: style.summary,
        body: (
          <>
            <RevealFacet label="What it buys" tone="blueprint">
              {style.buys}
            </RevealFacet>
            <RevealFacet label="What it costs" tone="warn">
              {style.costs}
            </RevealFacet>
            <RevealFacet label="What would have to be true" tone="subtle">
              {style.trueWhen}
            </RevealFacet>
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          The microservices row is the one people adopt for the wrong reason.
          What it buys is organisational; what it costs is technical and arrives
          on day one. Alone you pay the full price for none of the return.
        </p>
      }
    />
  )
}
```

- [ ] **Step 2: Confirm the badge is still in the accessible name**

The badge sits inside the button, so it is part of the control's accessible name. Check the built page:

```bash
cd web && lsof -ti:3100 | xargs kill -9
pnpm build && pnpm start -p 3100 &
node -e "import('@playwright/test').then(async ({chromium})=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:3100/stages/03-architecture#shape',{waitUntil:'networkidle'});console.log('badge occurrences:',await p.locator('text=what this stage teaches').count());await b.close()})"
```

Expected: 1. **Do not grep the built HTML** — this accordion is in a non-default `Stepper` panel, so its rendered markup is not in the static file and the grep returns zero either way. Zero from the browser check means the badge stopped rendering, which no data test would catch.

- [ ] **Step 3: Run the suite and commit**

```bash
cd web && pnpm vitest run && pnpm lint && pnpm typecheck
git add web/src/features/architecture/DeploymentStyles.tsx
git commit -m "refactor(web): DeploymentStyles builds rows, badge slot unchanged

Its badge already sat beside the title, so this migration is visually
identical and sets the shape DeferredList adopts next.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Migrate `DeferredList` — the one visual change

**Files:**
- Modify: `web/src/features/architecture/DeferredList.tsx`

**Interfaces:**
- Consumes: `RevealList`, `RevealFacet`.

**This task changes what a reader sees.** `DeferredList`'s "fails the test" badge currently renders *below* the row title (`mt-1 inline-block`); `DeploymentStyles`' renders *beside* it. `RevealList` has one badge slot, beside the title.

The alternative was a `badgePlacement` prop, rejected: a prop whose only purpose is preserving an inconsistency between two components nobody intended to differ. Recorded here so a reviewer sees the decision rather than discovering the diff.

- [ ] **Step 1: Rewrite the component body**

Keep the file header comment verbatim, including its note about the seventh doc item closing the list as prose rather than joining it. Append a line recording the badge move.

```tsx
export function DeferredList() {
  return (
    <RevealList
      idPrefix="deferred"
      rows={DEFERRED_ITEMS.map((item) => ({
        id: item.id,
        title: item.name,
        badge: item.failsTest ? (
          <span className="border border-warn px-1.5 py-0.5 text-[11px] font-medium text-warn">
            fails the test
          </span>
        ) : undefined,
        summary: item.summary,
        body: (
          <>
            <RevealFacet label="The real problem it solves" tone="blueprint">
              {item.problem}
            </RevealFacet>
            <RevealFacet label="Why it is not yours yet" tone="subtle">
              {item.notYet}
            </RevealFacet>
            <RevealFacet label="What it costs you today" tone="warn">
              {item.costsToday}
            </RevealFacet>
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          The test: defer anything whose reversal does not require migrating
          stored data. Adding a cache later touches code. Adding a queue later
          touches code. Those are afternoons, and you will make the decision
          with information you do not have today. One item above fails that
          test, which is why it is split into the part you decide now and the
          part you defer.
        </p>
      }
    />
  )
}
```

Note the dropped `mt-1 inline-block` from the badge span: those classes positioned it below the title and are wrong beside it.

- [ ] **Step 2: Check the badge against contrast and touch targets**

The badge changed position, so re-check the surfaces it now sits on:

```bash
cd web && lsof -ti:3100 | xargs kill -9 2>/dev/null; pnpm test:e2e
```

Expected: 14/14. The `:3100` kill is not optional (TD-27); a reused server measures the pre-refactor build and reports it green.

- [ ] **Step 3: Look at it**

Load `/stages/03-architecture#record` in both themes and confirm the badge sits beside the title, the row still reads as one item, and the title does not wrap awkwardly at 320px. This is the one step in the plan a test cannot do.

**The hash is `#record`, not `#defer`.** This plan said `#defer` until Task 6's verification tried it: there is no `defer` step id — `steps.ts` renders `DeferredList` inside `record`. A dead hash falls back to step 1 silently, which is the exact failure `audit.spec.ts`'s "every listed step hash lands on the step it names" test exists to catch, and it is why that test is worth having. Anyone reading a step name in prose should check it against `STEP_IDS` rather than trusting it.

- [ ] **Step 4: Commit, naming the change in the subject**

```bash
git add web/src/features/architecture/DeferredList.tsx
git commit -m "refactor(web): DeferredList builds rows, and its badge moves beside the title

The one visual change on this branch, declared rather than smuggled. The badge
sat below the row title here and beside it in DeploymentStyles; RevealList has
one badge slot. A badgePlacement prop was rejected as a prop existing only to
preserve an inconsistency nobody intended.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Migrate `ScalingMoves`

**Files:**
- Modify: `web/src/features/architecture/ScalingMoves.tsx`

**Interfaces:**
- Consumes: `RevealList`, `RevealFacet`.

The only caller using `header`. Its precondition block is deliberately lifted out of the list rather than sitting in it as the first row, and that reasoning must survive the migration.

- [ ] **Step 1: Rewrite the component body**

Keep the file header comment verbatim — especially the paragraph explaining that a list renders every entry as a peer, and that a reader scanning five collapsed rows would read "statelessness" as one option among five, which is the exact misreading the section exists to prevent.

```tsx
export function ScalingMoves() {
  const precondition = SCALING_MOVES.find((m) => m.precondition)
  const moves = SCALING_MOVES.filter((m) => !m.precondition)

  return (
    <RevealList
      idPrefix="scaling"
      header={
        precondition ? (
          <div className="border-b border-line bg-raised px-5 py-4">
            <h3 className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{precondition.name}</span>
              <span className="border border-brand px-1.5 py-0.5 text-[11px] font-medium text-brand">
                the precondition
              </span>
            </h3>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              {precondition.what}
            </p>
            {precondition.catch && (
              <p className="mt-2 text-sm leading-6 text-muted">
                {precondition.catch}
              </p>
            )}
          </div>
        ) : undefined
      }
      rows={moves.map((move) => ({
        id: move.id,
        title: move.name,
        summary: move.summary,
        body: (
          <>
            <p className="text-sm leading-6 text-muted">{move.what}</p>
            {move.catch && (
              <RevealFacet label="The part not in the name" tone="warn">
                {move.catch}
              </RevealFacet>
            )}
          </>
        ),
      }))}
    />
  )
}
```

Note: `move.what` stays a bare paragraph rather than becoming a `RevealFacet`, because it has no label in the original. Adding one would be new content.

- [ ] **Step 2: Confirm the precondition is not a row**

```bash
cd web && lsof -ti:3100 | xargs kill -9
pnpm build && pnpm start -p 3100 &
node -e "import('@playwright/test').then(async ({chromium})=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('http://localhost:3100/stages/03-architecture#shape',{waitUntil:'networkidle'});console.log('precondition count:',await p.locator('text=the precondition').count());console.log('inside a button:',await p.locator('button:has-text(\"the precondition\")').count());await b.close()})"
```

Expected: **1 occurrence, and 0 inside a button.** **Do not grep the built HTML** — non-default `Stepper` panel, so the grep returns zero either way. If the precondition became a row, the section now teaches the misreading its header comment says it exists to prevent. If the precondition became a row, the section now teaches the misreading its header comment says it exists to prevent.

- [ ] **Step 3: Run the suite and commit**

```bash
cd web && pnpm vitest run && pnpm lint && pnpm typecheck
git add web/src/features/architecture/ScalingMoves.tsx
git commit -m "refactor(web): ScalingMoves builds rows, precondition into the header slot

The precondition stays out of the list. Its header comment explains why: a
list renders every entry as a peer, and statelessness read as one option among
five is the exact misreading the section exists to prevent.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Move `TeamNotes`, document both components, record the round

**Files:**
- Move: `web/src/features/architecture/TeamNotes.tsx` → `web/src/components/TeamNotes.tsx`
- Modify: `web/src/features/architecture/Architecture.tsx` (import path)
- Modify: `web/PATTERNS.md`, "Building blocks"
- Modify: `docs/tracker.md`

**Interfaces:**
- Consumes: everything above.

TD-13 made a team-notes disclosure the convention for every stage. Leaving it in a feature folder means stage 04 copies it, which is the mistake this whole branch exists to stop repeating.

- [ ] **Step 1: Move the file and fix the import**

```bash
cd web && git mv src/features/architecture/TeamNotes.tsx src/components/TeamNotes.tsx
grep -rn "TeamNotes" src/ --include=*.tsx
```

Update every import to `@/components/TeamNotes`. If `TeamNotes` reads architecture-specific data, leave the data in the feature and pass it as props; do not move data into `components/`.

- [ ] **Step 2: Document both components in `PATTERNS.md`**

Under "Building blocks", after the `Term` entry, add `RevealList` and `RevealFacet`: the props, the independent-open behaviour and why it is not an accordion, the `idPrefix` contract with the audit list, and the Tailwind literal-class constraint on tones. `PATTERNS.md` documents the code and is the bug when they disagree, so this is not optional.

Also update the "Expand to reveal" row in the patterns table: its canonical example becomes `RevealList` itself.

- [ ] **Step 3: The equivalence audit — the check this whole branch turns on**

```bash
cd web && lsof -ti:3100 | xargs kill -9 2>/dev/null; pnpm test:e2e
```

Expected: **14/14.** Then the count that is the actual proof:

```bash
node e2e/count-expandables.mjs
```

Expected: **140 across 36 URLs**, unchanged. The count is what distinguishes "all five migrated" from "one silently renders nothing"; a green suite cannot.

**Two corrections to this step, both found before the branch started.** The number was written here as 108, which was TD-26's figure from 2026-08-03 — measured on 2026-08-13 the tree gives **140**, with no defect in between, because stage content grew. And `audit.spec.ts` opens disclosures per page and never aggregates, so nothing printed a total and the check as originally written could not be run at all. `e2e/count-expandables.mjs` exists so the number is derived rather than quoted. **Re-measure the "before" on your own tree rather than trusting 140** — if it disagrees, the tree moved again and your figure is the right one.

If the count moved at all, **the refactor is wrong, not the checker.** Find the missing rows before proceeding.

- [ ] **Step 4: Record the branch in `docs/tracker.md`**

A Completed row citing: the commit range, the test count (baseline **332 across 33 files** as of `dd44b30`, plus the new `RevealList` and `RevealFacet` tests), the expandable count before and after, and the teeth checks from Tasks 1 and 2. Include a `Deferred:` list naming at minimum: the `DeferredList` badge move as a deliberate visual change, TD-27 and TD-12 still open, and any caller that turned out not to fit.

Add a decision entry from **D-53** onward: shared interaction components live in `src/components/`, and a pattern's second consumer is when it gets extracted rather than its fifth.

- [ ] **Step 5: Dispatch a whole-branch review**

Read-only, fresh context, cannot be this session. Brief it specifically on: whether any footer or header text drifted from the original by a character; whether any `RevealFacet` tone changed meaning (`brand` means "you are here" and `go` means "this is good"; using `brand` for "this is good" has been a real bug in this repo and was fixed once already); whether the `{' '}` in `ResiliencePatterns` survived; and whether `PATTERNS.md` now matches the code.

- [ ] **Step 6: Fix blocking findings, report branch state, and stop**

Report: commits off `develop`, test counts across files, e2e result, expandable count, tree status, and explicitly `NOT merged, NOT deployed`.

```bash
git add web/PATTERNS.md docs/tracker.md web/src/components/TeamNotes.tsx web/src/features/architecture/
git commit -m "refactor(web): TeamNotes becomes shared, and PATTERNS.md documents RevealList

TD-13 made a team-notes disclosure every stage's convention, so it stops
living in one feature's folder before stage 04 copies it.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

**Do not merge.** Ask.

---

## Verification (after all tasks)

- [ ] `cd web && pnpm vitest run` — green; count is baseline **332** plus 6 new tests across 2 new files
- [ ] `pnpm lint && pnpm typecheck && pnpm format:check` — clean
- [ ] `lsof -ti:3100 | xargs kill -9; pnpm build && pnpm start -p 3100 &` then `pnpm test:e2e` — 14/14
- [ ] `node e2e/count-expandables.mjs` — **140 across 36 URLs**, matching the before-figure measured on this same tree
- [ ] `grep -rn "useState<Set<string>>" src/features/architecture/` returns nothing — all five callers migrated
- [ ] Every footer and header string diffed character for character against `git show HEAD~N` originals
- [ ] `/stages/03-architecture` loaded in both themes at 320px and 1440px, zero console errors
- [ ] The `DeferredList` badge move is named in a commit subject, the tracker's `Deferred:` list, and the review brief
- [ ] Whole-branch review complete, blocking findings fixed
- [ ] Branch state reported; `NOT merged, NOT deployed`

---

## Scope extension — Tasks 9–14, the six the plan missed

**Added 2026-08-13, on the user's call, after Task 7.** This plan opened by describing "five
byte-identical accordions". That was wrong: there are **eleven**. The five were found because
exactly two of them — `EvolutionNotes` and `ScalingMoves` — carried header comments admitting
they were duplicates. The other six never said so, so nobody counted them.

`ADRAnatomy`, `AIArchitecturePlays`, `ContractCost`, `Normalisation`, `SoftDelete` and
`TraceForward` each carry the identical signature: `Card className="p-0"`,
`divide-y divide-line`, `ChevronDown`, `aria-expanded`, and the exact button className
`flex min-h-11 w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-sunken lg:min-h-9`.

Leaving them would have undercut this branch's own reason to exist — the plan's goal line
says "before stage 04 copies the pattern a sixth, seventh and eighth time", and six
copyable originals would have remained.

### Shared requirements for Tasks 9–14

Every one follows the pattern the five completed migrations established. Read
`ResiliencePatterns.tsx` (facets + footer) and `DeploymentStyles.tsx` (badge) as the
approved templates rather than re-deriving.

- **Rendered output identical.** These are relocations. The proof is that the sweep does not move.
- **`idPrefix` is load-bearing**, not cosmetic — it reproduces the component's existing panel
  ids, and a silent rename is invisible to both the count and the audit.
- **Footer and header text copied character for character**, diffed against the pre-task commit
  rather than retyped. Three reviewers have now caught this class by comparing actual strings.
- **Keep each header comment**, updating only what is now false. Several record why a section is
  shaped the way it is; that is teaching material and losing it to a refactor is a real loss.
- **Semantic tones are not interchangeable.** `go` means "this is good", `brand` means "you are
  here", `warn` and `danger` carry their own meaning. Match the original exactly.
- **Drop `'use client'`** where the file no longer holds state — `RevealList` carries it.
- **Verify in a real browser, never by grepping built HTML.** These ids are computed inside a
  client component in non-default `Stepper` panels, so a grep returns zero on a working
  migration and a broken one alike.
- **Baselines that must not move:** vitest **341 across 36 files**, **140** expandables,
  **107** distinct panel ids, audit **14/14**.

### The six, simplest first

| Task | Component | Lines | `idPrefix` | Footer | Badge | Facets | Data |
|---|---|---|---|---|---|---|---|
| 9  | `ContractCost` | 90 | `contract` | yes | — | — | `./contracts` |
| 10 | `Normalisation` | 98 | `normal-form` | yes | — | — | `./normal-forms` |
| 11 | `TraceForward` | 100 | `trace` | yes | — | — | `./characteristics` |
| 12 | `SoftDelete` | 111 | `soft-delete` | yes | 1 | — | `./soft-delete` |
| 13 | `AIArchitecturePlays` | 200 | `ai-arch` | — | — | — | `./ai-plays` |
| 14 | `ADRAnatomy` | 207 | `adr` | yes | — | 2 | inline |

Ordered by size, the same reasoning that put `EvolutionNotes` first: prove the shape on the
smallest caller before the ones with more to lose. **Tasks 13 and 14 are twice the size of the
rest** and may carry structure beyond a plain accordion — read each in full before editing, and
if a component turns out not to fit `RevealList`, say so rather than forcing it. A caller that
does not fit is a finding about the component, not a failure of the task.

### Verification after Task 14

- [ ] `grep -c 'useState<Set<string>>' src/features/architecture/*.tsx` returns nothing — all
      eleven migrated, no caller retains its own accordion state
- [ ] vitest 341/36, lint, typecheck clean
- [ ] audit 14/14, and the sweep still **140 expandables / 107 ids**
- [ ] every `idPrefix` in the table above still produces its original panel ids
