'use client'

import { useState } from 'react'
import { Check, Copy, TriangleAlert } from 'lucide-react'
import { Card, Callout } from '@/components/ui'

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
    id: 'teardown',
    name: 'Parallel competitive teardown',
    mechanism: 'Subagents',
    when: 'You have 4–8 competitors and want them all characterised in one pass rather than serially.',
    how: 'Fan out one agent per competitor. Each returns a fixed shape — pricing, segment, what it refuses to do — so the results are comparable rather than a pile of prose. Serial reading of eight sites is an afternoon; this is minutes.',
    prompt: `Research these competitors, one agent each, in parallel:
[list]

For each, return exactly:
- Target segment (be specific about size and role)
- Pricing tiers and what gates each tier
- The job it does best
- What it deliberately does NOT do (from docs, changelog, or
  explicit "not for you" copy)
- Top 3 complaints from G2/Reddit/App Store, quoted verbatim

Do not summarise across competitors. I want the raw comparison.`,
  },
  {
    id: 'complaints',
    name: 'Complaint mining at scale',
    mechanism: 'Subagents',
    when: 'Before you talk to anyone. Unsolicited public complaints are the cheapest high-signal research there is.',
    how: 'Send agents at different sources — Reddit, review sites, HN, app stores — because each surfaces a different population. Ask for verbatim quotes; the moment it paraphrases, you lose the vocabulary you need for interviews and landing-page copy.',
    prompt: `Find real complaints about [problem area]. One agent per source:
Reddit, G2/Capterra, App Store reviews, Hacker News.

Rules:
- Quote verbatim. Never paraphrase.
- Include a link and a date for each.
- Prefer specific incidents ("last month I lost...") over
  general grumbling ("it's clunky").
- Report frequency: how many independent people said each thing.
- Explicitly flag anything you could NOT find evidence for.`,
  },
  {
    id: 'synthesis',
    name: 'Interview synthesis',
    mechanism: 'Skill',
    when: 'After 5+ conversations, when patterns are there but you cannot hold them all at once.',
    how: 'A project skill that encodes your synthesis rules — cluster by problem not by person, keep verbatim quotes, separate what was observed from what was inferred. Encoding it as a skill means every synthesis is done the same way instead of however you happened to prompt that day.',
    prompt: `Read the transcripts in research/interviews/.

Cluster by PROBLEM, not by person. For each cluster:
- The problem in the users' own words (verbatim quote)
- How many of N people raised it, unprompted vs prompted
- What they currently do about it
- Evidence of cost: time, money, or a workaround they built

Then list, separately:
- Things exactly one person said (do not promote these)
- Things I seemed to be fishing for (check my questions for
  leading phrasing and call it out)`,
  },
  {
    id: 'memory',
    name: 'Check what you already decided',
    mechanism: 'MCP',
    when: 'Before researching anything. Feature requests recur, and so do the reasons you declined them.',
    how: 'claude-mem indexes prior sessions, so "did I already look at this?" is answerable. The most expensive discovery is the kind you do twice — and the second pass rarely remembers why the first one said no.',
    prompt: `Search memory for prior work on [problem area].

I want:
- Anything I already researched or decided about this
- Reasons I previously rejected a similar idea
- Related features I shipped and how they landed

If I have been here before, say so plainly before I
spend another day on it.`,
  },
  {
    id: 'usage',
    name: 'Pull real usage data',
    mechanism: 'MCP',
    when: 'Discovery for a feature in an existing product, where behaviour beats opinion.',
    how: 'An MCP server on your database, analytics, or support inbox turns "I think people struggle here" into a number. For a brand-new product you have no data — which is precisely why the cheaper rungs exist.',
    prompt: `Using the database/analytics MCP server:

1. Funnel completion for [flow], last 90 days, by week
2. The step with the largest drop-off
3. Segment that drop — new vs returning users
4. Cross-reference with support tickets mentioning that step

State the numbers before any interpretation.`,
  },
  {
    id: 'redteam',
    name: 'Red-team your own idea',
    mechanism: 'Slash command',
    when: 'Right before you commit. The single highest-value play on this page.',
    how: 'A saved command that attacks the one-pager instead of improving it. Default framing gets you a collaborator; this framing gets you an opponent. Run it before you write a line of code.',
    prompt: `Read docs/discovery.md and argue AGAINST building this.

Specifically:
- Which claims rest on what people SAID rather than what
  they DID?
- Where have I confused interest with commitment?
- What is the cheapest existing substitute, and why would
  someone genuinely prefer it?
- Which evidence came from people like me rather than the
  stated audience?
- If this fails in 6 months, what is the most likely reason?

Do not offer fixes. Do not balance this with positives.
Your job is the strongest honest case for NOT building it.`,
  },
]

const MECH_STYLE = {
  Subagents: 'bg-info-tint text-info',
  Skill: 'bg-brand-tint text-brand',
  MCP: 'bg-warn-tint text-warn',
  'Slash command': 'bg-sunken text-muted',
} as const

export function AIWorkflow() {
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
        An LLM will help you justify almost anything. Ask &ldquo;is this a good
        idea?&rdquo; and you will get a balanced-sounding yes — which is the
        exact failure mode discovery exists to prevent, in a new costume. It is
        the leading-question problem from your interviews, except this witness
        never gets tired of agreeing with you.
        <span className="mt-2 block font-medium text-fg">
          So point it at evidence and at refutation, never at validation.
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
                    <p className="measure text-sm leading-6 text-muted">{p.how}</p>

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
              <span className="font-medium text-fg">Talking to people.</span> An
              agent can find complaints; it cannot notice the pause before
              someone answers, or hear the thing they mention as an aside and
              then repeat twice.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-warn"
              aria-hidden
            />
            <span>
              <span className="font-medium text-fg">
                Judging severity honestly.
              </span>{' '}
              That call is yours, and it is the one the whole stage turns on. An
              agent has no stake in being wrong.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span
              className="mt-2 size-1 shrink-0 rounded-full bg-warn"
              aria-hidden
            />
            <span>
              <span className="font-medium text-fg">Deciding to stop.</span>{' '}
              Models are built to be helpful, and stopping never reads as
              helpful. You have to want the negative answer.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
