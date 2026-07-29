import { Pin } from 'lucide-react'

/**
 * Figure 8. Source: docs/02-planning.md, "Write the plan".
 *
 * The one-page plan, annotated: each heading paired with what that section is
 * *for*, not just what it holds. "Not in v1" carries the load-bearing
 * annotation — the doc calls it the part that does actual work over the
 * following weeks — so it is the one row marked for attention (`brand`, the
 * same "look here" use `PlanningScope` makes of it, not a claim that the
 * others are wrong).
 *
 * Static: no state, nothing to click. Built from `div`s rather than `p`/`li`
 * for the section frame and example blocks — `main :is(p, li)` caps prose at
 * 68ch, which would silently pinch this artifact's two-column rows at wide
 * viewports. Only the short annotation sentences use `p`, same as `RiskOrder`
 * and `CutFunnel` in this folder.
 */

type Section = {
  heading: string
  example: string
  annotation: string
  emphasize?: boolean
}

const SECTIONS: Section[] = [
  {
    heading: 'Done means',
    example:
      'A freelancer can add a client, issue an invoice, and see which are overdue.',
    annotation:
      'One checkable sentence — the same idea stage 01 wrote as "what success looks like," restated as a state you can hold the running product up against.',
  },
  {
    heading: 'Slices',
    example:
      '1. Create + view an invoice — M\n2. Mark paid — S\n3. Overdue list — S\n4. Clients as records — M\n5. Auth + multi-user — M',
    annotation:
      'The build order from the step above, pasted in as the record of the decision — end to end first, riskiest scheduled early.',
  },
  {
    heading: 'Not in v1',
    example:
      'Email reminders, PDF export, multi-currency, teams, dark mode, recurring invoices, expenses.',
    annotation:
      'The line that does actual work over the following weeks. Written down while you can still think clearly, so a feature request in week six loses to a decision made in week one — not to whoever asks loudest.',
    emphasize: true,
  },
  {
    heading: 'Risks',
    example:
      'Auth choice affects the data model — decide before slice 4.\nDate/timezone handling for "overdue" is fiddlier than it looks.',
    annotation:
      'Named while still cheap to name. A risk left unwritten does not stop existing — it just stops being visible until it costs something.',
  },
  {
    heading: 'Open questions',
    example: 'Do overdue calculations use the client’s timezone or the user’s?',
    annotation:
      'Listed with a plan to resolve them, not a promise to remember them. An open question with no owner is a plan with a hole in it.',
  },
]

export function PlanAnatomy() {
  return (
    <div>
      <div className="divide-y divide-line border border-line bg-raised">
        {SECTIONS.map((s) => (
          <div
            key={s.heading}
            className={`p-4 sm:p-5 ${s.emphasize ? 'bg-brand-tint' : ''}`}
          >
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
              <div className="min-w-0">
                <p className="t-label mb-1.5 text-subtle">{s.heading}</p>
                <div className="min-w-0 whitespace-pre-line break-words border border-line bg-sunken px-3 py-2.5 font-mono text-xs leading-5 text-fg">
                  {s.example}
                </div>
              </div>
              <div className="min-w-0">
                <p
                  className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${
                    s.emphasize ? 'text-brand' : 'text-subtle'
                  }`}
                >
                  {s.emphasize && (
                    <Pin className="size-3 shrink-0" aria-hidden />
                  )}
                  What it&rsquo;s for
                </p>
                <p className="min-w-0 break-words text-sm leading-6 text-muted">
                  {s.annotation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-subtle">
        Short, on purpose — a plan longer than a page will not be read,
        including by you.
      </p>
    </div>
  )
}
