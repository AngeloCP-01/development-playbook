'use client'

import { useState } from 'react'
import { Check, X, RotateCcw } from 'lucide-react'
import { Card } from '@/components/ui'

type Item = {
  q: string
  good: boolean
  why: string
  fix?: string
}

const ITEMS: Item[] = [
  {
    q: 'Would you use a tool that tracks your invoices?',
    good: false,
    why: 'Hypothetical and leading. People say yes to be polite, and a yes here costs them nothing. You learn only that they are agreeable.',
    fix: 'Walk me through the last invoice you sent. What happened after that?',
  },
  {
    q: 'Walk me through what happened the last time a client paid late.',
    good: true,
    why: 'Asks about a specific past event. You get facts — what they actually did, how long it took, what they felt — rather than a prediction about a product that does not exist.',
  },
  {
    q: 'How much would you pay for something like this?',
    good: false,
    why: 'People are famously bad at pricing hypotheticals, and the number is meaningless without a product in front of them. It also signals you are selling, which makes the rest of the conversation less honest.',
    fix: 'What do you currently pay for tools that handle this? What made you pick that one?',
  },
  {
    q: 'What have you already tried to fix this?',
    good: true,
    why: 'The strongest question on this page. Someone who built a spreadsheet, wired up a Zapier flow, or paid for a tool they abandoned has demonstrated real pain with their own time and money.',
  },
  {
    q: 'Do you find your current process frustrating?',
    good: false,
    why: 'A yes/no question that invites agreement, and it names the emotion for them. You learn nothing about what specifically is hard or how often it happens.',
    fix: 'What part of that process takes the longest?',
  },
  {
    q: 'How often does this come up?',
    good: true,
    why: 'Turns a vague complaint into a frequency. A problem that happens daily is a different product from one that happens twice a year, even when the complaint sounds identical.',
  },
]

export function QuestionLab() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({})

  const answer = (i: number, guess: boolean) =>
    setAnswers((prev) => (i in prev ? prev : { ...prev, [i]: guess }))

  const answered = Object.keys(answers).length
  const correct = Object.entries(answers).filter(
    ([i, guess]) => ITEMS[Number(i)].good === guess,
  ).length

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Judge the question</p>
          <p className="text-sm text-subtle">
            Decide before you reveal. Guessing is the exercise.
          </p>
        </div>
        {answered > 0 && (
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className="font-mono text-sm tabular-nums text-muted"
            >
              {correct}/{answered} right
            </span>
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="flex min-h-11 items-center gap-1.5 border border-line px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg lg:min-h-9"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-2.5">
        {ITEMS.map((item, i) => {
          const guess = answers[i]
          const done = i in answers
          const right = done && guess === item.good

          return (
            <li key={item.q} className="border border-line bg-sunken p-4">
              <p className="mb-3 text-[15px] leading-6 text-fg">
                &ldquo;{item.q}&rdquo;
              </p>

              {!done ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => answer(i, false)}
                    className="min-h-11 border border-line bg-raised px-3.5 text-sm font-medium transition-colors duration-150 hover:border-danger hover:text-danger"
                  >
                    Weak question
                  </button>
                  <button
                    type="button"
                    onClick={() => answer(i, true)}
                    className="min-h-11 border border-line bg-raised px-3.5 text-sm font-medium transition-colors duration-150 hover:border-go hover:text-go"
                  >
                    Strong question
                  </button>
                </div>
              ) : (
                <div>
                  <p
                    className={[
                      'mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide',
                      item.good ? 'text-go' : 'text-danger',
                    ].join(' ')}
                  >
                    {item.good ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      <X className="size-3.5" aria-hidden />
                    )}
                    {item.good ? 'Strong' : 'Weak'}
                    <span className="font-normal normal-case tracking-normal text-subtle">
                      — you said {guess ? 'strong' : 'weak'}
                      {right ? ', correct' : ''}
                    </span>
                  </p>
                  <p className="measure text-sm leading-6 text-muted">
                    {item.why}
                  </p>
                  {item.fix && (
                    <p className="mt-2.5 border-l-2 border-go pl-3 text-sm leading-6 text-muted">
                      <span className="font-medium text-fg">Ask instead: </span>
                      &ldquo;{item.fix}&rdquo;
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
