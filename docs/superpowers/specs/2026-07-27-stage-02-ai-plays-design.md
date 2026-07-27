# Stage 02 — "AI plays" section — Design

**Date:** 2026-07-27
**Scope:** `docs/02-planning.md`, `web/src/features/planning/`, `web/PATTERNS.md`, records
**Status:** Approved (brainstorming) → pending implementation plan
**Round:** follow-up to W-3 stage 02, on branch `fix/stage-02-planning-gaps`

## Problem

Stage 01 (Product Discovery) has an "AI plays" step — where agents help and where they
mislead — and stage 02 does not. The user asked for the planning equivalent: where AI
helps in planning, where it lies, and which real skills and MCPs to reach for, named.

Planning's AI failure mode is the opposite of discovery's. Discovery's is "an LLM will
justify anything." Planning's is that **asked to plan, an LLM produces a *comprehensive*
plan — phases, features, ceremony — the exact opposite of "the default answer is no." It
never volunteers to cut.** The section has to design around that.

## Goals

1. A stage-02 "AI plays" section covering the planning-specific plays, opening on the
   inflate-don't-cut failure mode and closing on what AI cannot do.
2. Name real, reachable tools — the mechanism (Subagents / Skill / MCP / Slash command)
   plus specific stable ones — so a reader can act, not just nod.
3. It appears in **both** `docs/02-planning.md` and the interactive stage (the user's
   scope call), unlike stage 01 which is web-only.

## Non-goals

- **Baking install counts or unvetted third-party skill *contents* into the canonical
  doc.** Counts date within weeks and third-party skills vanish; the doc names the
  mechanism and a few stable tools, and points at `find-skills` / skills.sh for the
  rest. Repos are named; endorsement of contents is not implied.
- **Retrofitting stage 01's doc with AI content now.** Choosing doc+web for stage 02
  creates an asymmetry with stage 01 (whose AI content is web-only). Logged as debt, not
  fixed here — same discipline as the team-section asymmetry (TD-13).
- **New unit tests.** The section is presentational, exactly like stage 01's
  `AIWorkflow`, which has none. Verification is the live audit + build.
- **New references.** Stage 02 is already at the 5-reference cap.

## Constraints

- The doc keeps its seven-section template. "AI plays" is a `###` subsection *inside*
  "The work", like the other work subsections — never a new `##`.
- The stage goes to **7 stepper steps**, the first to exceed the documented 4–6
  (`PATTERNS.md`). `PATTERNS.md` is updated to record the AI step as a recognized
  per-stage addition: content steps stay 4–6, plus an optional "AI plays" step.
- Component mirrors `web/src/features/discovery/AIWorkflow.tsx`: an expand-to-reveal list
  of plays, each with a mechanism badge and a copyable prompt; an opening `Callout`
  (the failure mode); a closing "what none of this replaces" block. `brand` = attention,
  semantic colours carry meaning, touch targets ≥44px, `aria-live` on the copy
  confirmation, the `<pre>` scrolls in its own container.
- Copyable prompts wrap `navigator.clipboard.writeText` in try/catch (insecure-context
  safe), same as the existing components.

## Architecture

### The component — `web/src/features/planning/AIPlanningPlays.tsx`

Structurally a copy of `AIWorkflow.tsx` (same `Play` shape, same expand/badge/copy
mechanics, same open/close framing), with planning content. Opening callout states the
inflate-don't-cut failure mode. Closing block: what AI does not replace.

### The plays

| # | Play | Mechanism | The point |
|---|---|---|---|
| 1 | Exhaust the feature list before you cut | Subagents / Skill | You can only cut from a complete set. Let AI over-generate; then *you* apply the outcome test. Its padding tendency is an asset here. |
| 2 | Red-team your MVP | Slash command | The highest-value play. "For each feature I marked core, argue it could be cut and the outcome still holds." Mirrors discovery's red-team. |
| 3 | Run the spike | MCP / Sandbox / Subagents | The stage-02-native play. A spike *is* a timeboxed feasibility question → written decision. Point an agent at a provider's docs (`context7`) or an isolated sandbox (Vercel Sandbox), timebox it, return a decision, keep no code. |
| 4 | Draft the one-page plan | Skill | From discovery + your cut, draft the artifact. Guard: it pads; force it to one page, since the value is compression. |
| 5 | Sort value against effort | Skill | Propose a value/effort score per not-now item to order the Next list (ties to the value-vs-effort content). Heavy caveat: it has no data on *your* users' pain — a starting sort, not truth. |
| 6 | Check what you already planned | MCP | `claude-mem`: "did I already scope or reject this?" Same as discovery's memory play. |

### Named tools (stable set, load-bearing in the doc)

- **`superpowers:writing-plans`** (Superpowers plugin) — turns a spec into a checkbox
  implementation plan. The engineering-planning counterpart to this stage.
- **`superpowers:dispatching-parallel-agents`**, **`using-git-worktrees`** — fan out
  slices; isolate a spike's throwaway code so it never touches the tree.
- **`claude-mem`** (MCP; `make-plan`, `mem-search`) — prior-decision memory, phased plans.
- **`context7`** (MCP) — library/API docs, for feasibility spikes.
- **Vercel Sandbox** (`vercel:vercel-sandbox`) — ephemeral microVM to run a spike safely.
- **Ecosystem pointer:** `find-skills` / skills.sh for PM-specific skills — e.g.
  `deanpeters/product-manager-skills` (roadmap-planning, prioritization-advisor),
  `phuryn/pm-skills@prioritization-frameworks` (RICE/MoSCoW). Named as findable, not
  vetted or endorsed.

### The doc subsection

A `### AI in planning` subsection inside "The work" in `docs/02-planning.md`, carrying the
same failure-mode framing, the plays as prose, and the tool names — the durable half. The
copyable prompts are the web stage's job.

### Wiring

A 7th step `{ id: 'ai', label: 'AI plays', hint: 'Where agents cut, and where they pad' }`
in `Planning.tsx`, rendering `<AIPlanningPlays />`. Placed after "size" (the spike lives
there) and before "write" — so the reader meets the AI plays right after the spike concept
that anchors them. Add the `#ai` hash to the audit `PAGES` list.

## Testing

None new (presentational, per stage 01's precedent). The existing 57 stay green.

## Verification

`pnpm lint && pnpm typecheck && pnpm test && pnpm build`, then the audit suite against a
production build (now sweeping the 7th step's `#ai` hash) — contrast both themes, no
overflow 320–2560, zero console. A live browser pass on the new step: expand/collapse a
play, copy a prompt, confirm the copy confirmation is announced. `humanizer` over the new
prose. All named skill/MCP identifiers verified to exist (in-environment ones by the skill
list; ecosystem repos by the `find-skills` search already run).

## Documentation updates

- `docs/02-planning.md` — the `### AI in planning` subsection
- `web/PATTERNS.md` — the AI step recorded as a recognized per-stage addition (4–6 content
  steps + optional AI step)
- `docs/tracker.md` — the slice with evidence; a decision for the doc+web scope and the
  7-step exception; debt for the stage-01 doc lacking AI content (parallel to TD-13)
- `docs/task.md` — note the AI section on stage 02's W-3 line

## Risks

- **The 7-step precedent.** Recorded in `PATTERNS.md` so it is a decision, not a drift.
- **Naming tools that move.** Mitigated by leaning on mechanism + stable in-env tools and
  treating the ecosystem as a pointer, not a dependency.
- **Doc/app asymmetry with stage 01.** Logged as debt; the fix is to give stage 01's doc
  an AI section too, later.
