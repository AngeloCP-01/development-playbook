'use client'

import { useId } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { DONE, TEAM_MOVES } from './checklist'

/**
 * Source: `docs/04-project-setup.md`, "## Definition of done" and
 * "## Scaling to a team".
 *
 * The stage's persisted output, in the shape `PATTERNS.md` calls the persisted
 * worksheet — except that stage 04's output is a checklist rather than a set of
 * prose fields, so this stores a set of ticked ids instead of `Worksheet`'s
 * record of strings. Same storage mechanism, same "saved in this browser"
 * promise, its own key.
 *
 * Progress is keyed on `DoneItem.id`, not on position, which is the reason
 * `checklist.ts` gives its items slugs: reordering the doc's checkboxes must not
 * silently reset a reader's ticks.
 *
 * State comes from `useLocalStorage`, which reads storage through
 * `useSyncExternalStore`. Not `useEffect` + `setState`: that is
 * `react-hooks/set-state-in-effect`, an error rather than a warning in this
 * codebase, and it causes a cascading render on every mount.
 *
 * Checked means *done*, so the control is tinted `go` rather than `brand`.
 * `brand` is attention — active states, "you are here" — and using it to mean
 * "this is good" is the bug this project has already fixed once.
 *
 * The boxes are native `<input type="checkbox">` rather than the
 * `role="checkbox"` buttons stage 03 uses in `ExpandContract` and
 * `AuthzPatterns`. Those are scored exercises with a committed state and a
 * disabled pass; this is an actual checklist a reader works through, where the
 * native control brings the right keyboard behaviour for free. Each box is
 * wrapped in its own `<label>`, so the whole row — not the 16px box — is the
 * touch target.
 *
 * No heading is emitted here. `TeamNotes` renders its own `<h3>` trigger, and
 * the panel this sits in opens with `Section`'s `<h2>`, so the outline reads
 * h2 → h3 (see TD-34, and the same note in `AIPlays`).
 *
 * Labels go through `InlineCode`. `checklist.ts` keeps the doc's checkboxes
 * verbatim — `checklist.test.ts` counts them out of `docs/04-project-setup.md`
 * — so six of the eight carry backticks the data cannot drop and this panel
 * would otherwise print.
 */

export const SETUP_CHECKLIST_KEY = 'playbook:setup-checklist'

/** Stable reference: `useLocalStorage` uses it as the server snapshot. */
const NOTHING_TICKED: string[] = []

export function SetupChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(SETUP_CHECKLIST_KEY, NOTHING_TICKED)
  const idBase = useId()

  const count = DONE.filter((item) => ticked.includes(item.id)).length
  const complete = count === DONE.length

  const toggle = (id: string) =>
    setValue((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  return (
    <div className="space-y-4">
      <Card className="p-0">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium">Definition of done</p>
            <p className="mt-0.5 text-sm text-subtle">
              Saved in this browser as you tick. Nothing leaves your machine.
            </p>
          </div>
          <span
            className="t-data flex items-center gap-1.5 text-subtle"
            aria-live="polite"
          >
            {complete ? (
              <Check className="size-3.5 text-go" aria-hidden />
            ) : (
              <Save className="size-3.5" aria-hidden />
            )}
            {count}/{DONE.length}
          </span>
        </div>

        <ul className="divide-y divide-line">
          {DONE.map((item) => {
            const on = ticked.includes(item.id)
            return (
              <li key={item.id}>
                <label
                  className="flex min-h-11 cursor-pointer items-start gap-3.5 px-5 py-3 transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                  htmlFor={`${idBase}-${item.id}`}
                >
                  <input
                    id={`${idBase}-${item.id}`}
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(item.id)}
                    className="mt-1 size-4 shrink-0 accent-go"
                  />
                  <span
                    className={`text-sm leading-6 ${on ? 'text-subtle' : 'text-muted'}`}
                  >
                    <InlineCode text={item.label} />
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear every tick? This cannot be undone.')) {
                reset()
              }
            }}
            disabled={count === 0}
            className="flex min-h-11 items-center gap-2 border border-line px-3.5 text-sm text-muted transition-colors duration-150 hover:bg-sunken hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 lg:min-h-9"
          >
            <RotateCcw className="size-4" aria-hidden />
            Clear
          </button>
          <p className="text-sm text-subtle" aria-live="polite">
            {complete
              ? 'Every box ticked — the setup is done, and you proved it rather than assumed it.'
              : 'Tick a box only once you have watched it work. Three of these are checks people skip.'}
          </p>
        </div>
      </Card>

      <TeamNotes>
        <ul className="space-y-3">
          {TEAM_MOVES.map((move) => (
            <li key={move.id}>
              <p className="text-sm font-medium text-fg">{move.title}</p>
              <p className="mt-0.5">
                <InlineCode text={move.body} />
              </p>
            </li>
          ))}
        </ul>
      </TeamNotes>
    </div>
  )
}
