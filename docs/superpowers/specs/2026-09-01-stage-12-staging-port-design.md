# Stage 12 (Staging) — Interactive Port Design

**Date:** 2026-09-01
**Branch:** `feat/stage-12-staging` (off `develop`)
**Source doc:** `docs/12-staging.md` (232 lines, 7 content sections + Artifacts/DoD/Scaling/Traps)
**Predecessor:** Doc correction phase merged to `develop` as `cdfba51` — AI plays section,
env vars section, Neon integration details, E2E command pattern. The doc is stable.

---

## Problem

Stage 12 is `ready: false` and absent from `STAGE_CONTENT`. The route renders "sheet
not drawn." The doc is corrected and complete (232 lines); the interactive port is what
remains. This is the eighth W-3 stage (7/18 → 8/18).

## Goals

- A stepper with six steps teaching the reader when previews suffice, how to isolate
  data, what to check by hand, and how to configure the preview environment.
- One scored exercise (PreviewOrStaging) and two interactive patterns (RevealList for
  the checklist, annotated artifact for the seed data).
- One figure (the Neon branching lifecycle).
- Terms, references, and the standard AI plays / checklist / traps steps.
- `ready: true` and W-3 at 8/18.

## Non-goals

- **No worksheet.** The stage does not produce a persistent artifact the reader fills
  in (unlike stages 01–03). The preview checklist is a pattern to follow each time,
  not a document to keep.
- **No new shared component.** Every pattern needed (`RevealList`, `AnnotatedArtifact`,
  `Callout`, `Figure`, `References`, `TeamNotes`) already exists. If something does
  not fit, the stage is too small to justify a new abstraction.
- **No doc changes.** The doc is stable after the correction phase. Content only flows
  from the doc into the app, not the other way.

## Constraints

- D-52: one judgment per step, panel under four screens at 1024×768.
- D-35: AI plays step is mandatory (already in the doc).
- D-47: grep `terms.ts` before writing prose.
- D-67: doc-pinned assertions use literal phrases from the doc.
- The three-file registration (`stages.ts`, `stage-content.ts`, `step-ids.ts`) is one
  atomic operation in the assembly task (per `stage-implementation-101.md`).
- Tests use `@testing-library/react` + plain DOM assertions, never `jest-dom` or
  `user-event` (per `stage-implementation-101.md`).
- `doc-source.ts` helpers (`section`, `flat`, `fences`) handle hard line-wraps in the
  doc (per `stage-implementation-101.md`).

---

## Architecture

### Step structure (6 steps)

```
preview → database → checklist → env → ai → traps
```

| Step | Label | Hint | Doc sections |
|---|---|---|---|
| `preview` | Preview or staging? | When each one earns its place | Preview deployments are not staging |
| `database` | Data isolation | Never point at production | Databases for previews + Seed data that is not sterile |
| `checklist` | The preview checklist | What machines are bad at | The preview checklist |
| `env` | Environment and protection | Variables, secrets, and access | Environment variables for previews + Password-protect previews |
| `ai` | AI in staging | Mechanical coverage, not judgment | AI in staging |
| `traps` | Traps | Five ways a preview misleads | Traps + Definition of done + Scaling to a team |

**Rationale for six.** The doc has seven content sections, but "Seed data" is the
second half of the data-isolation judgment (the hostile-seed argument only makes sense
after the "never production" decision), and "Password-protect" is one paragraph that
fits naturally with environment variables (both are about configuring the preview
beyond the code). Six is the same count as stage 07 (Code Review), whose doc was a
comparable weight.

### Interactive patterns per step

| Step | Pattern | Component | Detail |
|---|---|---|---|
| `preview` | **Guess-then-reveal, scored** | `PreviewOrStaging.tsx` | 5 scenarios; reader picks "preview" or "staging" per scenario; scored 0–5. The stage's signature exercise. |
| `database` | **Annotated artifact** | Inline `AnnotatedArtifact` | The `src/db/seed.ts` hostile-seed code block from the doc, with per-line annotations explaining what each record breaks. |
| `database` | **Figure** | Inline SVG or diagram | Fig 1: Neon branching lifecycle (PR → branch created → migrations → serve → delete → cleanup). |
| `checklist` | **Expand-to-reveal** | `RevealList` | 4 categories ("Does it actually work?", "Off the happy path?", "Did anything else break?", "Does it look right?"), each expanding with the specific checks underneath. |
| `env` | **Prose + Callout** | Inline | Short section; the two habits as a `Callout kind="info"`, deployment protection as prose. |
| `ai` | **Expand-to-reveal** | `AIPlays.tsx` | 4 tool plays as `RevealList` rows (browser walk, smoke suite, hostile seeds, env diff). |
| `traps` | **Callout kind="trap"** | Inline from `traps.ts` | 5 traps matching the doc verbatim. Plus `TeamNotes`, `StagingChecklist`, `References`. |

### Data modules

| File | Exports | Tested against |
|---|---|---|
| `scenarios.ts` | `SCENARIOS: Scenario[]` — 5 items, each `{ id, situation, answer: 'preview' \| 'staging', reasoning }` | Situations are authored exercise prompts (not transcribed prose); each `answer` must trace to a specific passage in the doc's own advice. `reasoning` quotes or paraphrases that passage. |
| `seed-data.ts` | `SEED_LINES: ArtifactLine[]` — the seed block annotated line by line | Lines pinned character-for-character to the doc's fenced code block via `fences()` |
| `checklist-items.ts` | `CHECKLIST_CATEGORIES: RevealRow[]` — 4 categories with their checks | Category titles pinned to the doc's bold headings |
| `ai-plays.ts` | `AI_PLAYS: RevealRow[]` — 4 tool plays | Each play's title pinned to the doc |
| `traps.ts` | `TRAPS: Trap[]` — 5 traps | Each trap's opening bold phrase pinned to the doc |
| `checklist.ts` | `DONE_ITEMS: ChecklistItem[]` — 6 DoD items | Pinned to the doc's `## Definition of done` |

### Terms

`preview-deployment` already exists in `terms.ts`. New candidates:

| Term | Stage |
|---|---|
| `staging-environment` | `12-staging` |
| `database-branching` | `12-staging` |
| `deployment-protection` | `12-staging` |

Grep `terms.ts` during implementation to confirm none were added between now and then.

### References (for `references.ts`)

3–4 entries, each verified in a real browser:

| Candidate | Source | What it adds |
|---|---|---|
| Vercel Preview Deployments | Vercel Docs | The mechanics: how preview URLs are generated, environment variable scoping, the deployment lifecycle |
| Neon Database Branching | Neon Docs | The highest-value technique in this stage: copy-on-write branches, automatic cleanup, the Vercel integration |
| Vercel Deployment Protection | Vercel Docs | Authentication options for preview URLs, the automation bypass secret for CI |
| Vercel Environment Variables | Vercel Docs | Per-scope configuration (Production/Preview/Development), which the stage's new env section teaches |

---

## Testing

### Data tests (`.test.ts`, vitest `unit` project)

- Every scenario's `situation` text appears in the doc (doc-pinned).
- Every seed line matches the doc's fenced block character-for-character.
- Every checklist category title matches a bold heading in the doc.
- Every trap's opening phrase matches the doc.
- Every DoD item matches the doc.
- `SCENARIOS` has exactly 5 items with valid `answer` values.
- `TRAPS` has exactly 5 items.
- References count is 3–5 (enforced by the existing references test).

### Render tests (`.test.tsx`, vitest `dom` project)

- `PreviewOrStaging` renders all scenarios, locks answers on pick, shows score after
  all answered, and the `aria-live` region updates after the first pick (not before,
  per the M2 lesson from stage 07).
- `AIPlays` renders all 4 plays as expandable rows.
- `StagingChecklist` renders all DoD items.
- `Staging.tsx` renders 6 steps in the rail.

### Prose test (`prose.test.ts`)

- Pin at least one phrase per doc section to catch silent drops during transcription.
- Pin a phrase from the *second* sentence of key passages (per the
  "transcribing prose loses the second sentence" lesson).

### E2E (existing audit suite)

- The audit derives pages from `STAGES.filter(s => s.ready)` + `STEP_IDS_BY_SLUG`,
  so flipping `ready: true` and registering the step IDs automatically adds stage 12's
  pages to the sweep. No manual URL additions needed (TD-12 closed).

---

## Verification

- `pnpm lint` — zero warnings
- `pnpm typecheck` — clean after typegen
- `pnpm test` — all tests pass, count reported
- `pnpm build` — clean, stage 12 prerendered
- `pnpm test:e2e` — audit passes with stage 12's new pages included
- Panel measurement: every panel under 4.0 screens at 1024×768
- Contrast: both themes, all steps, WCAG AA
- Responsive: 320–2560px, no horizontal overflow, no sub-44px touch targets below `lg`
- Console: zero errors in a clean browser context
- `humanizer:humanizer` over panel prose
- Coverage walk (doc vs app, context-starved) after all panels built

---

## Documentation updates

- `docs/task.md` — W-3 status updated to 8/18, stage 12 entry added
- `docs/tracker.md` — W-3.8 row with evidence
- `KICKOFF.md` — project state refreshed

---

## Risks

- **Panel weight too light.** At 232 lines, this is the shortest doc. If panels measure
  under 1.5 screens median, that is a signal to check for missing content (per the
  `stage-implementation-101.md` lesson), not a compliment. The coverage walk is the
  check.
- **Exercise scenarios not grounded.** The PreviewOrStaging scenarios need to be
  obviously right or wrong from the doc's own advice, not from general knowledge. Each
  scenario's answer must trace to a specific passage in the doc.
- **Neon branching figure complexity.** Keep the diagram to 5–6 nodes max. A lifecycle
  diagram that tries to show every edge case stops teaching the flow.
