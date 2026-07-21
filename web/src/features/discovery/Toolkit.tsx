'use client'

import { useState } from 'react'
import { MessagesSquare, Search, BarChart3, Layers } from 'lucide-react'
import { Card } from '@/components/ui'

type Activity = {
  name: string
  what: string
  tools: { name: string; note: string; free?: boolean }[]
  timebox: string
}

type Group = {
  id: string
  label: string
  Icon: typeof Search
  blurb: string
  activities: Activity[]
}

const GROUPS: Group[] = [
  {
    id: 'desk',
    label: 'Desk research',
    Icon: Search,
    blurb:
      'Free, fast, and where most ideas should die. Do this before you ask anyone for their time.',
    activities: [
      {
        name: 'Demand check',
        what: 'Is anyone searching for this, and in what words? Their vocabulary is rarely yours.',
        timebox: '30 min',
        tools: [
          { name: 'Google Trends', note: 'direction over time', free: true },
          { name: 'Ahrefs / Semrush', note: 'volume and difficulty' },
          {
            name: 'Answer The Public',
            note: 'the questions people phrase it as',
            free: true,
          },
        ],
      },
      {
        name: 'Complaint mining',
        what: 'Unsolicited, specific, and free. One-star reviews of the nearest competitor are the highest-signal research available.',
        timebox: '1–2 hrs',
        tools: [
          { name: 'Reddit search', note: 'sort by top, past year', free: true },
          {
            name: 'G2 / Capterra reviews',
            note: 'filter to 1–2 stars',
            free: true,
          },
          { name: 'App Store reviews', note: 'the "recent" tab', free: true },
          { name: 'Hacker News Algolia', note: 'past discussions', free: true },
        ],
      },
      {
        name: 'Competitive teardown',
        what: 'What exists, what it costs, and — most usefully — what it deliberately refuses to do.',
        timebox: '2 hrs',
        tools: [
          {
            name: 'Competitor pricing pages',
            note: 'reveals their segment',
            free: true,
          },
          {
            name: 'Changelogs',
            note: 'shows what they are betting on',
            free: true,
          },
          {
            name: 'Wayback Machine',
            note: 'how the pitch changed',
            free: true,
          },
        ],
      },
    ],
  },
  {
    id: 'talk',
    label: 'Interviews',
    Icon: MessagesSquare,
    blurb:
      'Five conversations beat zero by a wide margin. The goal is facts about the past, not opinions about the future.',
    activities: [
      {
        name: 'Problem interviews',
        what: '20–30 minutes. Ask what happened last time, never whether they would use a thing.',
        timebox: '5 × 30 min',
        tools: [
          { name: 'Zoom / Meet', note: 'record with permission', free: true },
          { name: 'Granola / Otter', note: 'transcripts you can search' },
          {
            name: 'A plain doc',
            note: 'genuinely sufficient at this scale',
            free: true,
          },
        ],
      },
      {
        name: 'Finding people',
        what: 'Harder than the interview itself. Go where they already complain.',
        timebox: 'ongoing',
        tools: [
          {
            name: 'Niche subreddits & Discords',
            note: 'ask, do not pitch',
            free: true,
          },
          { name: 'LinkedIn search', note: 'by role and company size' },
          {
            name: 'Your own network',
            note: 'weak ties beat close friends',
            free: true,
          },
        ],
      },
      {
        name: 'Synthesis',
        what: 'Group what you heard into patterns. Three people describing the same workaround is a finding.',
        timebox: '1–2 hrs',
        tools: [
          { name: 'Dovetail', note: 'tag and cluster transcripts' },
          { name: 'FigJam / Miro', note: 'affinity mapping on stickies' },
          {
            name: 'A markdown file',
            note: 'fine for under ~10 interviews',
            free: true,
          },
        ],
      },
    ],
  },
  {
    id: 'test',
    label: 'Cheap tests',
    Icon: BarChart3,
    blurb:
      'Buy evidence with an afternoon instead of a quarter. Each of these measures behaviour rather than politeness.',
    activities: [
      {
        name: 'Fake front door',
        what: 'A landing page describing the product, with a real signup form. Measures interest that costs something.',
        timebox: '1 afternoon',
        tools: [
          {
            name: 'Vercel + a static page',
            note: 'you already know the stack',
            free: true,
          },
          { name: 'Carrd / Framer', note: 'faster if you will not reuse it' },
          {
            name: 'Plausible / Vercel Analytics',
            note: 'conversion, not vanity',
          },
        ],
      },
      {
        name: 'Concierge test',
        what: 'Deliver the outcome manually for a handful of people. You learn where the real difficulty is — never where you assumed.',
        timebox: '1–4 weeks',
        tools: [
          {
            name: 'A spreadsheet and your hands',
            note: 'that is the tool',
            free: true,
          },
        ],
      },
      {
        name: 'Sizing the market',
        what: 'Rough, defensible arithmetic. Enough to know if it is a hobby or a business.',
        timebox: '1 hr',
        tools: [
          {
            name: 'Census / industry reports',
            note: 'for population counts',
            free: true,
          },
          {
            name: 'Back-of-envelope maths',
            note: 'reach × conversion × price',
            free: true,
          },
        ],
      },
    ],
  },
  {
    id: 'record',
    label: 'Recording',
    Icon: Layers,
    blurb:
      'The output of discovery is a decision plus its reasoning — not a backlog.',
    activities: [
      {
        name: 'The one-pager',
        what: 'Problem, who, evidence, severity, success, and what this is NOT. One page, committed to the repo.',
        timebox: '45 min',
        tools: [
          {
            name: 'Markdown in the repo',
            note: 'versioned with the code',
            free: true,
          },
          {
            name: 'The worksheet below',
            note: 'exports straight to markdown',
            free: true,
          },
        ],
      },
      {
        name: 'Opportunity solution tree',
        what: 'Keeps solutions attached to evidence. Revisit it whenever a feature request arrives.',
        timebox: '1 hr',
        tools: [
          { name: 'FigJam / Miro', note: 'easiest to rearrange' },
          {
            name: 'Mermaid in markdown',
            note: 'diffable, lives with the code',
            free: true,
          },
        ],
      },
    ],
  },
]

export function Toolkit() {
  const [active, setActive] = useState(GROUPS[0].id)
  const group = GROUPS.find((g) => g.id === active)!

  return (
    <Card className="p-0">
      <div
        role="tablist"
        aria-label="Discovery activity categories"
        className="flex overflow-x-auto border-b border-line"
      >
        {GROUPS.map((g) => {
          const on = g.id === active
          return (
            <button
              key={g.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(g.id)}
              className={[
                'flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm transition-colors duration-150',
                on
                  ? 'border-brand font-medium text-fg'
                  : 'border-transparent text-muted hover:text-fg',
              ].join(' ')}
            >
              <g.Icon className="size-4" aria-hidden />
              {g.label}
            </button>
          )
        })}
      </div>

      <div className="p-4 sm:p-5">
        <p className="mb-4 text-sm leading-6 text-muted">{group.blurb}</p>

        <div className="space-y-3">
          {group.activities.map((a) => (
            <div key={a.name} className="border border-line bg-sunken p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-fg">{a.name}</h3>
                <span className="border border-line px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-subtle">
                  {a.timebox}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted">{a.what}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {a.tools.map((t) => (
                  <li
                    key={t.name}
                    className="group flex items-center gap-1.5 border border-line bg-raised px-2 py-1"
                  >
                    <span className="text-xs font-medium text-fg">
                      {t.name}
                    </span>
                    {t.free && (
                      <span className="bg-brand-tint px-1 text-[10px] font-semibold text-brand">
                        free
                      </span>
                    )}
                    <span className="text-[11px] text-subtle">{t.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
