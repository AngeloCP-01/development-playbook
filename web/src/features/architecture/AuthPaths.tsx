'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui'
import { Term } from '@/components/Term'

/**
 * Source: docs/03-architecture.md, "Authentication and authorization" — the
 * three auth paths, and the paragraph that hands off to the authorization
 * patterns below. (The citation used to end in a line range, which D-42 bans;
 * it had drifted by seven hundred lines.)
 *
 * Tab shape structurally follows `discovery/Toolkit.tsx` (`role="tablist"` /
 * `role="tab"` / `role="tabpanel"`), but Toolkit has no keyboard handling to
 * copy — its tabs are click-only. The roving-focus behaviour here instead
 * matches `Stepper.tsx`: `tabIndex` 0 on the active tab and -1 on the rest,
 * arrow keys move and refocus, Home/End jump to the ends, and the index
 * clamps rather than wraps, for consistency with that component.
 *
 * Deliberately no `go`/`danger`/`warn` on any option — the doc does not rank
 * these three, and colouring one green would be a recommendation it declines
 * to make. Each panel answers the same three questions in the same order so
 * the tabs compare rather than each arguing its own case; the third
 * question (data model) is the one that ties this section to the rest of
 * the stage rather than to security in isolation.
 */

type AuthOption = {
  id: string
  label: string
  costs: string
  risk: string
  dataModel: string
}

const OPTIONS: AuthOption[] = [
  {
    id: 'diy',
    label: 'Roll your own',
    costs:
      'No vendor fee. The cost is your own time — password hashing, session storage, and the reset-flow edge cases, all of which take longer than they look.',
    risk: 'Viable for simple email/password, and genuinely risky if you get it wrong — session fixation, a leaking reset token, a timing attack. You probably will get one of them wrong at least once.',
    dataModel:
      'Everything lives in your own tables — users, sessions, tokens. You own every migration, and nothing outside your database has to change when the schema does.',
  },
  {
    id: 'managed',
    label: 'Managed provider',
    costs:
      'Clerk or Auth0: a per-user or per-MAU fee that scales with the product, in exchange for not building any of it yourself.',
    risk: 'Fastest to correct — you are not maintaining the auth logic. But user identity now lives in someone else’s system, and their outage is your outage.',
    dataModel:
      'Your database holds a foreign reference to their user id, not the user record itself. Every query that needs identity is a join against data you do not own.',
  },
  {
    id: 'library',
    label: 'A library',
    costs:
      'Auth.js is free to adopt, but you host it and stay responsible for configuring, patching, and keeping it current — the cost moves from money to attention.',
    risk: 'The middle ground: standard, reviewed implementations lower the chance of the diy failure mode, but you are still the one wiring it up and can still wire it up wrong.',
    dataModel:
      'Your database, in a standard adapter schema. You keep the data and the migrations, without writing the session and token logic from scratch.',
  },
]

export function AuthPaths() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)
  const option = OPTIONS[active]

  const go = (i: number) => {
    const next = Math.max(0, Math.min(OPTIONS.length - 1, i))
    setActive(next)
    tabsRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [next]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: OPTIONS.length - 1,
    }
    if (e.key in map) {
      e.preventDefault()
      go(map[e.key])
    }
  }

  return (
    <Card className="p-0">
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Authentication strategies"
        onKeyDown={onKeyDown}
        className="flex flex-wrap border-b border-line sm:flex-nowrap sm:overflow-x-auto"
      >
        {OPTIONS.map((o, i) => {
          const on = i === active
          return (
            <button
              key={o.id}
              role="tab"
              id={`auth-tab-${o.id}`}
              aria-selected={on}
              aria-controls={`auth-panel-${o.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => go(i)}
              className={[
                'flex min-h-11 flex-1 shrink-0 items-center justify-center border-b-2 px-3 text-center text-sm transition-colors duration-150 sm:flex-none lg:min-h-9',
                on
                  ? 'border-brand font-medium text-fg'
                  : 'border-transparent text-muted hover:text-fg',
              ].join(' ')}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`auth-panel-${option.id}`}
        aria-labelledby={`auth-tab-${option.id}`}
        tabIndex={-1}
        className="p-4 sm:p-5"
      >
        <dl className="space-y-4">
          <div>
            <dt className="t-label text-subtle">What it costs</dt>
            <dd className="mt-1 text-sm leading-6 text-fg">{option.costs}</dd>
          </div>
          <div>
            <dt className="t-label text-subtle">What the risk is</dt>
            <dd className="mt-1 text-sm leading-6 text-fg">{option.risk}</dd>
          </div>
          <div>
            <dt className="t-label text-subtle">
              What it does to your data model
            </dt>
            <dd className="mt-1 text-sm leading-6 text-fg">
              {option.dataModel}
            </dd>
          </div>
        </dl>
      </div>

      <p className="border-t border-line bg-sunken px-4 py-3.5 text-sm leading-6 text-muted sm:px-5">
        Whichever path you pick, the part people get wrong is not authentication
        but <Term id="authorization">authorization</Term>: deciding whether this
        caller may do this thing to this record. None of these three tabs
        settles it — that is the question below. Where the check physically goes
        is{' '}
        <Link href="/stages/05-development" className="text-brand">
          05 — Development
        </Link>
        .
      </p>
    </Card>
  )
}
