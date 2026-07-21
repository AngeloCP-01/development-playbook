'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui'

type Example = {
  id: string
  name: string
  pitch: string
  outcome: 'built' | 'killed'
  outcomeLine: string
  steps: { q: string; a: string; note: string }[]
  lesson: string
}

const EXAMPLES: Example[] = [
  {
    id: 'invoices',
    name: 'Invoice chaser',
    pitch: '"An app that tracks unpaid invoices for freelancers."',
    outcome: 'built',
    outcomeLine: 'Built it. Painful-tier problem with evidence behind it.',
    steps: [
      {
        q: 'Whose problem is this?',
        a: 'Solo freelancers with 5–20 active clients, invoicing monthly, currently using a spreadsheet plus manual email.',
        note: 'Specific enough to design for. "Small businesses" would have been too broad — a bookkeeper with 200 clients needs different software entirely.',
      },
      {
        q: 'What do they do today?',
        a: 'A spreadsheet with a "paid?" column, checked whenever they happen to remember. Two of the six people interviewed had built their own reminder formulas.',
        note: 'The competitor is a spreadsheet, and spreadsheets are formidable — free, flexible, familiar. Beating one means being much better at a single specific job, not marginally better in general.',
      },
      {
        q: 'How much does it hurt?',
        a: 'Painful. Four of six named chasing payments as their worst admin task. One had written off roughly $3,000 the previous year purely from never following up.',
        note: 'The $3,000 is the number that settled it. Not because it is large, but because it is specific — a real consequence someone could name without prompting.',
      },
      {
        q: 'What happens if you do nothing?',
        a: 'They keep losing money slowly and keep blaming themselves for being disorganised.',
        note: 'Self-blame is a useful signal. People who think a problem is their own fault do not search for tools — which explains why the market looked emptier than the pain justified.',
      },
    ],
    lesson:
      'The evidence that mattered was not enthusiasm about the idea. It was two people who had already built worse versions themselves, and one specific dollar figure.',
  },
  {
    id: 'standup',
    name: 'Standup summariser',
    pitch: '"A tool that turns daily standup notes into a weekly summary."',
    outcome: 'killed',
    outcomeLine:
      'Killed it at question three. Cost: two days instead of two months.',
    steps: [
      {
        q: 'Whose problem is this?',
        a: 'Engineering managers running 4–8 person teams who write weekly updates for their own manager.',
        note: 'Reasonably specific, and a real audience. This question did not kill it.',
      },
      {
        q: 'What do they do today?',
        a: 'Skim Slack for ten minutes on Friday and write four bullets from memory.',
        note: 'First warning sign. Ten minutes a week is not a wound. But "it is quick" alone is not disqualifying — plenty of good products replace quick-but-irritating tasks.',
      },
      {
        q: 'How much does it hurt?',
        a: 'Annoying. Every manager asked said some version of "it is fine, honestly." Nobody had looked for a tool. Nobody had built a workaround.',
        note: 'This killed it. Annoying-tier means people will not switch — the effort of adopting anything exceeds the pain removed. No workarounds existed because nobody cared enough to build one.',
      },
      {
        q: 'What happens if you do nothing?',
        a: 'Managers keep spending ten minutes on Friday, as they have for years, without complaint.',
        note: 'Nothing happens. That is a complete and legitimate answer, and the correct response is to stop.',
      },
    ],
    lesson:
      'The idea was genuinely good — well-scoped, technically interesting, clearly buildable. It was also solving a problem nobody had. Those are not the same question, and enthusiasm cannot tell them apart.',
  },
]

export function WorkedExample() {
  const [openId, setOpenId] = useState<string>('invoices')

  return (
    <div className="space-y-3">
      {EXAMPLES.map((ex) => {
        const open = openId === ex.id
        const killed = ex.outcome === 'killed'
        return (
          <Card key={ex.id} className="p-0">
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(open ? '' : ex.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-sunken"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{ex.name}</span>
                    <span
                      className={[
                        'border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                        killed
                          ? 'border-danger text-danger'
                          : 'border-go text-go',
                      ].join(' ')}
                    >
                      {killed ? 'Not built' : 'Built'}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-subtle">
                    {ex.pitch}
                  </span>
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-subtle transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
            </h3>

            {open && (
              <div className="border-t border-line px-5 py-4">
                <ol className="space-y-4">
                  {ex.steps.map((step, i) => (
                    <li key={step.q} className="flex gap-3.5">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-sunken font-mono text-[11px] tabular-nums text-subtle">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-fg">{step.q}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">
                          {step.a}
                        </p>
                        <p className="mt-1.5 border-l-2 border-line pl-3 text-sm leading-6 text-subtle">
                          {step.note}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div
                  className={[
                    'mt-5 border-l-3 px-4 py-3',
                    killed
                      ? 'border-danger bg-danger-tint'
                      : 'border-go bg-go-tint',
                  ].join(' ')}
                >
                  <p
                    className={`text-sm font-semibold ${killed ? 'text-danger' : 'text-go'}`}
                  >
                    {ex.outcomeLine}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {ex.lesson}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
