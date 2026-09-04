'use client'

import { useId } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { ARTIFACT_LIST, DONE, TEAM } from './checklist'

/**
 * Source: `docs/14-post-deployment-verification.md`, "## Artifacts" and "##
 * Definition of done", plus a four-note `TEAM` disclosure drawn from "##
 * Scaling to a team".
 *
 * Same shape as stage 13's `DeploymentChecklist`: one `Card` holding an
 * artifacts list, a persisted done checklist keyed on `DoneItem.id`
 * (position-independent, so reordering the doc's checkboxes cannot silently
 * reset a reader's ticks), and a `TeamNotes` disclosure below it. State goes
 * through `useLocalStorage`, which reads via `useSyncExternalStore` rather
 * than `useEffect` + `setState` — `react-hooks/set-state-in-effect` is an
 * error here, not a warning.
 *
 * Checked means *done*, so the control is tinted `go`, not `brand` — `brand`
 * is attention, not approval.
 */

export const VERIFICATION_CHECKLIST_KEY = 'pdv-checklist'

/** Stable reference: `useLocalStorage` uses it as the server snapshot. */
const NOTHING_TICKED: string[] = []

export function VerificationChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(VERIFICATION_CHECKLIST_KEY, NOTHING_TICKED)
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
        <div className="border-b border-line px-5 py-3.5">
          <p className="text-sm font-medium">Artifacts</p>
          <ul className="mt-2 space-y-1.5">
            {ARTIFACT_LIST.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-6 text-muted"
              >
                <span className="mt-0.5 shrink-0 text-subtle" aria-hidden>
                  &rsaquo;
                </span>
                <span className="min-w-0 break-words">
                  <InlineCode text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>

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
              count > 0 && <Save className="size-3.5" aria-hidden />
            )}
            {count > 0 && `${count} of ${DONE.length}`}
          </span>
        </div>

        <ul className="divide-y divide-line">
          {DONE.map((item) => {
            const on = ticked.includes(item.id)
            const id = `${idBase}-${item.id}`
            return (
              <li key={item.id}>
                <label
                  className="flex min-h-11 cursor-pointer items-start gap-3.5 px-5 py-3 transition-colors duration-150 hover:bg-sunken lg:min-h-9"
                  htmlFor={id}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(item.id)}
                    className="mt-1 size-4 shrink-0 accent-go"
                  />
                  <span
                    className={`min-w-0 break-words text-sm leading-6 ${on ? 'text-subtle' : 'text-muted'}`}
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
              ? 'Every box ticked — the deploy is verified.'
              : 'Tick a box only once you have actually done it.'}
          </p>
        </div>
      </Card>

      <TeamNotes>
        <ul className="space-y-3">
          {TEAM.map((note) => (
            <li key={note.id}>
              <p className="text-sm font-medium text-fg">{note.title}</p>
              <p className="mt-0.5">
                <InlineCode text={note.body} />
              </p>
            </li>
          ))}
        </ul>
      </TeamNotes>
    </div>
  )
}
