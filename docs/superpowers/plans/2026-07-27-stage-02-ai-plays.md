# Stage 02 "AI plays" Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add an "AI plays" step to stage 02, mirroring stage 01's, covering where AI helps in planning and where it pads, with real named tools — in both the doc and the interactive stage.

**Architecture:** A presentational `AIPlanningPlays.tsx` (a copy of the shape of `discovery/AIWorkflow.tsx`) rendered as a new 7th stepper step; a `### AI in planning` subsection in the markdown doc; a `PATTERNS.md` note recording the AI step as a recognized per-stage addition.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4.

**Spec:** `docs/superpowers/specs/2026-07-27-stage-02-ai-plays-design.md`

## Global Constraints

- `'use client'` on the component (it uses `useState`). Style: single quotes, no semicolons, 2-space indent. Lint at `--max-warnings 0`. Typecheck via `pnpm typecheck` (runs `next typegen`).
- No new dependencies. Icons from `lucide-react`. No new unit tests — this is presentational, exactly like `AIWorkflow.tsx`; do NOT invent a render-does-not-crash snapshot.
- `brand` = attention only; `go`/`warn`/`danger`/`info` carry meaning. Mechanism badges reuse `AIWorkflow`'s four: Subagents (`bg-info-tint text-info`), Skill (`bg-brand-tint text-brand`), MCP (`bg-warn-tint text-warn`), Slash command (`bg-sunken text-muted`).
- Copyable prompts wrap `navigator.clipboard.writeText` in try/catch. Touch targets ≥44px (`min-h-11`, may tighten to `lg:min-h-9` on a dense control). `aria-live="polite"` is NOT needed on the copy button (stage 01's `AIWorkflow` puts none there); match stage 01 exactly.
- The `<pre>` for each prompt scrolls in its own `overflow-x-auto` container.
- The doc keeps its seven-section template: "AI in planning" is a `###` subsection inside "The work", never a new `##`.
- Spelling: `prioritization` (-iza-), matching the doc's existing "prioritized".
- Branch `fix/stage-02-planning-gaps`. Conventional Commits, lowercase after colon, trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: The `AIPlanningPlays` component

**Files:**
- Create: `web/src/features/planning/AIPlanningPlays.tsx`

**Interfaces:**
- Produces: `<AIPlanningPlays />`, consumed by Task 3's `Planning.tsx`.

- [ ] **Step 1: Create the component**

Create `web/src/features/planning/AIPlanningPlays.tsx` with the full content below. It mirrors `web/src/features/discovery/AIWorkflow.tsx` (read that first for the exact idiom), with planning content.

```tsx
'use client'

import { useState } from 'react'
import { Check, Copy, TriangleAlert } from 'lucide-react'
import { Card, Callout } from '@/components/ui'

/**
 * Where agents help in planning, and where they pad. The counterpart to stage
 * 01's AIWorkflow. Planning's AI failure mode is the inverse of discovery's:
 * asked to plan, a model inflates — phases, sub-features, ceremony — because
 * more always reads as more helpful, and "the default answer is no" is a
 * discipline it does not share. So every play here points it at cutting or at
 * feasibility, never at "write me a good plan".
 */

type Play = {
  id: string
  name: string
  mechanism: 'Subagents' | 'Skill' | 'MCP' | 'Slash command'
  when: string
  how: string
  prompt: string
}

const PLAYS: Play[] = [
  {
    id: 'exhaust',
    name: 'Exhaust the feature list before you cut',
    mechanism: 'Subagents',
    when: 'Before you cut, so you cut from the whole set rather than only what you happened to think of.',
    how: 'A model over-generates, and here that is the asset. The instinct that ruins its plans — comprehensiveness — is exactly what you want when building the pile you will cut from. Ask for the maximal list, then apply the outcome test yourself.',
    prompt: `Brainstorm every feature [product] could plausibly have.
Be exhaustive, not tasteful — I want the maximal list: the
obvious, the nice-to-have, and the things competitors ship.

For each, one line: the feature, who it is for, the job it does.

Do NOT prioritise, group, or recommend, and do not tell me what
to cut. I will cut this list myself against a definition of done.
Your only job is to make sure nothing is missing from it.`,
  },
  {
    id: 'redteam',
    name: 'Red-team your MVP',
    mechanism: 'Slash command',
    when: 'Right after you cut, before you commit. The highest-value play on this page.',
    how: 'A saved command that argues every feature you marked core could be dropped and the outcome would still hold. Default framing gives you a collaborator who agrees; this framing gives you the opponent who keeps v1 small.',
    prompt: `Here is my definition of done and the features I marked CORE:
[paste]

For each core feature, make the strongest honest case that it
could be CUT from v1 and the definition of done would still hold,
perhaps with a manual workaround.

Rules:
- Attack every one. Assume I over-scoped.
- Name the cheapest manual workaround for each.
- Flag any feature whose only defence is "it feels necessary"
  rather than the outcome failing without it.

Do not defend my choices. Your job is the smallest v1 that still
delivers the outcome.`,
  },
  {
    id: 'spike',
    name: 'Run the spike',
    mechanism: 'MCP',
    when: 'For a feasibility unknown — can this be built at all — where a written decision beats a guess.',
    how: 'A spike is a timeboxed question whose output is a decision, not code. Point an agent at the provider’s own docs (an MCP like context7), or have it run a throwaway experiment in an isolated sandbox (Vercel Sandbox, or a git worktree), and take the written decision. The code is discarded; the decision is what stage 03 consumes.',
    prompt: `Spike, timeboxed. Question: can [provider/library] do
[specific thing] the way I need?

Using its official docs (context7) and, if needed, a throwaway
experiment in an isolated sandbox:
- Answer yes / no / yes-but, with the specific constraint.
- Quote the doc line or the error that settles it.
- If yes-but, state the exact limitation and what it forces.

Return a written decision I can paste into my plan's Risks.
Do NOT keep the experiment code — the decision is the output.`,
  },
  {
    id: 'draft',
    name: 'Draft the one-page plan',
    mechanism: 'Skill',
    when: 'Once done, cut, slices and risks exist and you want them in the standard shape.',
    how: 'A skill assembles the artifact from your inputs — told, hard, to keep it to one page, because a model asked to plan will pad. superpowers:writing-plans is the engineering-planning version of this: it turns a spec into a checkbox build plan.',
    prompt: `Assemble a one-page plan from these inputs:
- Definition of done: [paste]
- Core features (the MVP): [paste]
- Slices, ordered: [paste]
- Known risks and open questions: [paste]

Sections: Done means / Slices / Not in v1 / Risks / Open questions.
One page maximum — if it runs longer, cut words, not sections.
Do not add features, phases, or ceremony I did not give you.`,
  },
  {
    id: 'prioritise',
    name: 'Sort value against effort',
    mechanism: 'Skill',
    when: 'To order the "not now" list once you have more items than you can rank by eye.',
    how: 'Ask for a value-and-effort score per item, as a starting sort. The caveat is load-bearing: the model has no data on your users’ real pain, so treat its value column as a hypothesis to correct, not a verdict. Community skills exist for this — find-skills surfaces prioritisation-framework skills.',
    prompt: `Here is my "not in v1" list, one per line:
[paste]

For each, propose:
- Value (1-5): how much pain it removes × how often that pain is
  felt. State what evidence you are assuming.
- Effort (S/M/L): rough build size.
- Suggested horizon: Next or Later.

Sort by value-for-effort. Then flag the value scores you are
LEAST sure about — those are the ones I need real usage data for
before trusting this order.`,
  },
  {
    id: 'memory',
    name: 'Check what you already planned',
    mechanism: 'MCP',
    when: 'Before scoping anything. Feature requests recur, and so do the reasons you shelved them.',
    how: 'claude-mem indexes past sessions, so "did I already plan or reject this?" is answerable. The cheapest planning is the kind you do not repeat — and the second pass rarely remembers why the first one deferred it.',
    prompt: `Search memory for prior planning on [feature/area].

I want:
- Anything I already scoped, sliced, or put on a roadmap
- Reasons I previously deferred or rejected it
- What I decided about its priority last time

If I have been here before, say so before I re-plan it.`,
  },
]

const MECH_STYLE = {
  Subagents: 'bg-info-tint text-info',
  Skill: 'bg-brand-tint text-brand',
  MCP: 'bg-warn-tint text-warn',
  'Slash command': 'bg-sunken text-muted',
} as const

export function AIPlanningPlays() {
  const [openId, setOpenId] = useState(PLAYS[0].id)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (p: Play) => {
    try {
      await navigator.clipboard.writeText(p.prompt)
      setCopied(p.id)
      window.setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard unavailable — the prompt is on screen to copy by hand.
    }
  }

  return (
    <div className="space-y-4">
      <Callout kind="warn" title="The failure mode to design around">
        Ask an LLM to plan and it hands you a thorough one: phases, sub-features,
        a rollout, contingencies. That thoroughness is the trap.{' '}
        &ldquo;The default answer to a feature is no&rdquo; is a discipline the
        model does not share — it is built to be helpful, and more always reads
        as more helpful.
        <span className="mt-2 block font-medium text-fg">
          So point it at cutting and at feasibility, never at &ldquo;write me a
          good plan.&rdquo;
        </span>
      </Callout>

      <Card className="p-0">
        <ul className="divide-y divide-line">
          {PLAYS.map((p) => {
            const open = openId === p.id
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? '' : p.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-sunken sm:px-5"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">
                      {p.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-subtle">
                      {p.when}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${MECH_STYLE[p.mechanism]}`}
                  >
                    {p.mechanism}
                  </span>
                </button>

                {open && (
                  <div className="border-t border-line bg-sunken px-4 py-4 sm:px-5">
                    <p className="measure text-sm leading-6 text-muted">
                      {p.how}
                    </p>

                    <div className="mt-3.5 overflow-hidden border border-line bg-bg">
                      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1.5">
                        <span className="font-mono text-[11px] uppercase tracking-wide text-subtle">
                          prompt
                        </span>
                        <button
                          type="button"
                          onClick={() => copy(p)}
                          className="flex min-h-11 items-center gap-1.5 px-2 text-xs text-muted transition-colors duration-150 hover:text-fg lg:min-h-9"
                        >
                          {copied === p.id ? (
                            <Check className="size-3.5 text-brand" aria-hidden />
                          ) : (
                            <Copy className="size-3.5" aria-hidden />
                          )}
                          {copied === p.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12px] leading-6 text-fg">
                        {p.prompt}
                      </pre>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </Card>

      <div className="border border-line bg-raised p-4 sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
          <TriangleAlert className="size-4 shrink-0 text-warn" aria-hidden />
          What none of this replaces
        </p>
        <ul className="space-y-2 text-sm leading-6 text-muted">
          <li className="flex gap-2.5">
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-warn"
              aria-hidden
            />
            <span>
              <span className="font-medium text-fg">Deciding what is core.</span>{' '}
              The outcome test is a judgment about your users; the model can argue
              either way and has no stake in being wrong.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-warn"
              aria-hidden
            />
            <span>
              <span className="font-medium text-fg">Knowing the real pain.</span>{' '}
              A value score without your usage data is a guess in a confident
              voice. The ranking is yours to correct.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-warn"
              aria-hidden
            />
            <span>
              <span className="font-medium text-fg">Keeping v1 small.</span>{' '}
              Cutting is the whole skill, and it is the one move a
              help-maximising assistant will never volunteer.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd web && pnpm lint && pnpm typecheck && pnpm build`
Expected: all clean. The component is not routed yet (Task 3), but must lint, typecheck, and build.

- [ ] **Step 3: Commit**

```bash
git add web/src/features/planning/AIPlanningPlays.tsx
git commit -m "$(cat <<'MSG'
feat(planning): add the AI-plays component for stage 02

Six planning plays as expand-to-reveal cards with copyable prompts, mirroring
stage 01's AIWorkflow. Opens on planning's own AI failure mode — asked to plan,
a model inflates rather than cuts — and closes on what it cannot do.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 2: The doc subsection and the PATTERNS note

**Files:**
- Modify: `docs/02-planning.md` (new `### AI in planning` inside "The work", after "Timebox the unknowns", before "Write the plan")
- Modify: `web/PATTERNS.md` (the 4–6 step guideline note)

- [ ] **Step 1: Add the doc subsection**

In `docs/02-planning.md`, immediately after the "Timebox the unknowns" subsection ends (after the paragraph that ends "...turns an architecture decision from a guess into a choice you can defend later.") and before `### Write the plan`, insert:

```markdown
### AI in planning

An agent asked to plan will hand you a thorough one: phases, sub-features, a rollout,
contingencies. That thoroughness is the trap. "The default answer to a feature is no" is a
discipline the model does not share — it is built to be helpful, and more always reads as
more helpful. So point it at cutting and at feasibility, never at "write me a good plan."

Where it earns its place:

- **Exhaust the feature list before you cut** (subagents). You can only cut from a
  complete set, and a model's instinct to over-generate is exactly what you want when
  building the pile. Ask for the maximal list; apply the outcome test yourself.
- **Red-team your MVP** (a saved command). Have it argue every feature you marked core
  could be cut and the outcome still holds. Default framing gives you a yes-man; this one
  keeps v1 small.
- **Run the spike** (an MCP, or a sandbox). A spike is a timeboxed feasibility question
  whose output is a decision. Point an agent at the provider's own docs (context7) or a
  throwaway experiment in an isolated sandbox (Vercel Sandbox, or a git worktree), timebox
  it, and take the written decision — the code is discarded.
- **Draft the one-page plan, then sort the roadmap** (skills). It assembles the artifact
  from your inputs, if you force it to one page. `writing-plans` (the Superpowers plugin)
  is the engineering-planning version: a spec becomes a checkbox build plan. For ordering
  the "not now" list, a value-against-effort score is a starting sort, never the verdict —
  the model has no data on your users' real pain.
- **Check what you already planned** (memory). `claude-mem` answers "did I already scope or
  reject this?" The cheapest planning is the kind you do not repeat.

Named tools, so this is actionable: `writing-plans` and `dispatching-parallel-agents` from
the Superpowers plugin; `claude-mem` and `context7` as MCP servers; Vercel Sandbox for a
throwaway experiment. For product-specific skills — prioritization frameworks, roadmap
templates — `find-skills` (skills.sh) is the catalogue; `deanpeters/product-manager-skills`
and `phuryn/pm-skills` are two worth a look.

What none of this replaces: deciding what is core, knowing the real pain behind a priority,
and the nerve to keep v1 small. The model has no stake in being wrong, and cutting is the
one move a help-maximising assistant will never volunteer.
```

- [ ] **Step 2: Verify the seven-section template still holds**

Run: `awk '/^```/{fence=!fence; next} !fence && /^## /{print}' docs/02-planning.md`
Expected: exactly the six `##` sections (Entry criteria, The work, Artifacts, Definition of done, Scaling to a team, Traps) — unchanged. The new content is a `###`, so it must not appear.

- [ ] **Step 3: Update the PATTERNS guideline**

In `web/PATTERNS.md`, find the `Stepper` description line "Splits a stage into 4–6 steps, one panel visible at a time." and append, right after that sentence:

```markdown
(A stage may add one further **"AI plays"** step beyond the 4–6 — the "where agents help
and where they mislead" pattern from stage 01 — so a stage that carries it, like stage 02,
runs to 7. The 4–6 governs *content* steps; the AI step is a recognized addition, not
drift.)
```

- [ ] **Step 4: Humanizer pass**

Invoke `humanizer:humanizer` on the new doc subsection only. Keep em-dashes (house voice); reduce only 3+ stacks. Apply clarity fixes, skip voice-flattening ones.

- [ ] **Step 5: Commit**

```bash
git add docs/02-planning.md web/PATTERNS.md
git commit -m "$(cat <<'MSG'
docs(planning): add the "AI in planning" subsection and the 7-step note

The doc half of stage 02's AI plays: the inflate-don't-cut failure mode, the six
plays as prose, and the named tools. PATTERNS.md records the AI step as a
recognized addition beyond the 4–6 content-step guideline.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 3: Wire the 7th step and audit route

**Files:**
- Modify: `web/src/features/planning/Planning.tsx` (import + new step object after `size`)
- Modify: `web/e2e/audit.spec.ts` (add `#ai` hash)

**Interfaces:**
- Consumes: `<AIPlanningPlays />` from Task 1.

- [ ] **Step 1: Import the component**

In `web/src/features/planning/Planning.tsx`, add to the imports (near the other planning-feature imports):

```tsx
import { AIPlanningPlays } from './AIPlanningPlays'
```

- [ ] **Step 2: Insert the step**

In the `STEPS` array, insert this object **between** the `size` step (ends around line 240) and the `write` step (`id: 'write'`). The whole step:

```tsx
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where agents cut, and where they pad',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Leverage" title="AI in planning">
          <Prose>
            <p>
              An agent is genuinely useful in planning, but not in the way it
              first offers to be. Asked to plan, it inflates; the plays below
              turn that instinct around and point it at cutting and at
              feasibility instead. Each is a prompt you can copy.
            </p>
          </Prose>
          <div className="mt-5">
            <AIPlanningPlays />
          </div>
        </Section>
      </div>
    ),
  },
```

- [ ] **Step 3: Add the audit route**

In `web/e2e/audit.spec.ts`, add to the `PAGES` array, after `'/stages/02-planning#size'`:

```ts
  '/stages/02-planning#ai',
```

- [ ] **Step 4: Build and confirm the route**

Run: `cd web && pnpm lint && pnpm typecheck && pnpm build`
Expected: clean; `/stages/02-planning` still prerenders.

- [ ] **Step 5: Commit**

```bash
git add web/src/features/planning/Planning.tsx web/e2e/audit.spec.ts
git commit -m "$(cat <<'MSG'
feat(planning): add the AI-plays step to stage 02 (now seven steps)

Wires AIPlanningPlays in as a 7th step between Size and Write — right after the
spike concept that anchors its strongest play — and adds the #ai hash to the
audit sweep.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

### Task 4: Verification and records

**Files:**
- Modify: `docs/task.md`, `docs/tracker.md`

- [ ] **Step 1: Full gate + live audit**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build
(pnpm start -p 3100 &) ; sleep 5 ; pnpm exec playwright test e2e/audit.spec.ts --reporter=line ; lsof -ti:3100 | xargs kill
```
Expected: 57/57 tests; audit 9/9 (now sweeping `#ai`) — contrast both themes, no overflow, zero console.

- [ ] **Step 2: Live browser pass on the new step**

With the dev or prod server up, open `/stages/02-planning#ai`: expand and collapse a play, click Copy on one, confirm the prompt copies and the "Copied" state shows and reverts. Confirm no horizontal overflow at 320px on the `<pre>` blocks (they must scroll inside their own container, not push the page).

- [ ] **Step 3: Update records**

`docs/task.md` — on stage 02's W-3 line or notes, record that stage 02 now carries an AI-plays step (7 steps).

`docs/tracker.md`:
- Add a completed-slice row (date 2026-07-27, the AI section, evidence: the commits, audit 9/9, live copy check).
- Add decision **D-34**: the AI section is doc+web and stage 02 runs to 7 steps (PATTERNS updated); the stable-tools-over-install-counts naming rule.
- Add debt **TD-15**: stage 01's doc lacks the AI content stage 02's doc now has — an asymmetry to close by giving stage 01's doc an AI subsection later (parallel to TD-13).

- [ ] **Step 4: Commit**

```bash
git add docs/task.md docs/tracker.md
git commit -m "$(cat <<'MSG'
docs(tracker): record the stage-02 AI-plays section

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
MSG
)"
```

---

## Verification (after all tasks)

1. `cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build` — all green, 57/57.
2. Audit suite 9/9 against a production build, now sweeping `/stages/02-planning#ai`.
3. `/stages/02-planning` renders seven steps; `#ai` deep-links; a prompt copies; the `<pre>` scrolls rather than overflowing at 320px.
4. `docs/02-planning.md` still has exactly seven template sections; the AI content is a `###` inside "The work".
5. Records updated: tracker slice + decision + debt, task.md note.
