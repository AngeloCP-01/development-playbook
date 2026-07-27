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
        Ask an LLM to plan and it hands you a thorough one: phases,
        sub-features, a rollout, contingencies. That thoroughness is the trap.{' '}
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
                            <Check
                              className="size-3.5 text-brand"
                              aria-hidden
                            />
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
              <span className="font-medium text-fg">
                Deciding what is core.
              </span>{' '}
              The outcome test is a judgment about your users; the model can
              argue either way and has no stake in being wrong.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-warn"
              aria-hidden
            />
            <span>
              <span className="font-medium text-fg">
                Knowing the real pain.
              </span>{' '}
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
