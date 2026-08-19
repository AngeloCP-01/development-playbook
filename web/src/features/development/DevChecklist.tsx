'use client'

import { useId } from 'react'
import Link from 'next/link'
import { Check, RotateCcw, Save } from 'lucide-react'
import { InlineCode } from '@/components/InlineCode'
import { TeamNotes } from '@/components/TeamNotes'
import { Card } from '@/components/ui'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { getStage } from '@/lib/stages'
import { ARTIFACT_ITEMS, DONE, TEAM_MOVES } from './checklist'

/**
 * Source: `docs/05-development.md`, "## Artifacts", "## Definition of done",
 * and "## Scaling to a team".
 *
 * Modelled on stage 04's `SetupChecklist` — same persisted-worksheet shape,
 * same storage mechanism, its own key. Progress is keyed on `DoneItem.id`
 * rather than position, which is the reason `checklist.ts` gives its items
 * slugs: reordering the doc's checkboxes must not silently reset a reader's
 * ticks.
 *
 * State comes from `useLocalStorage`, reading through `useSyncExternalStore`
 * rather than `useEffect` + `setState` — `react-hooks/set-state-in-effect`
 * is an error in this codebase, not a warning.
 *
 * **Controller ruling A.** The doc's `## Artifacts` list ships here too, as
 * a short plain list above the checklist — not a second exercise, so its
 * four items are not tickable. They are what the eleven checkboxes below are
 * checking, not a parallel worksheet.
 *
 * **Controller ruling I.** Four done items carry `DoneItem.stage`, a slug
 * like `06-testing`, precisely so this component can render a real
 * cross-reference instead of the dead bare number the label text still
 * contains (e.g. "Tests written and passing (06)"). Each such item gets a
 * `next/link` to `/stages/<slug>`, sitting beside the label rather than
 * inside it — nesting it inside the `<label>` would fold its text into the
 * checkbox's own accessible name, which is a second, unrelated field.
 * Accessible name comes from `getStage(item.stage).title`: a link named "06"
 * tells a screen-reader user nothing, the same reasoning `CarryForward` and
 * `ArchCarryForward` already apply to their own stage links.
 *
 * Checked means *done*, so the control is tinted `go`, not `brand` — `brand`
 * is attention, not approval.
 *
 * Labels go through `InlineCode`, since `checklist.ts` keeps the doc's
 * checkboxes verbatim, backticks included.
 */

export const DEV_CHECKLIST_KEY = 'dev-checklist'

/** Stable reference: `useLocalStorage` uses it as the server snapshot. */
const NOTHING_TICKED: string[] = []

export function DevChecklist() {
  const {
    value: ticked,
    setValue,
    reset,
  } = useLocalStorage<string[]>(DEV_CHECKLIST_KEY, NOTHING_TICKED)
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
            {ARTIFACT_ITEMS.map((item) => (
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
              <Save className="size-3.5" aria-hidden />
            )}
            {count}/{DONE.length}
          </span>
        </div>

        <ul className="divide-y divide-line">
          {DONE.map((item) => {
            const on = ticked.includes(item.id)
            const stage = item.stage ? getStage(item.stage) : undefined
            return (
              <li key={item.id}>
                <div className="flex min-h-11 items-start gap-2 px-5 py-3 transition-colors duration-150 hover:bg-sunken lg:min-h-9">
                  <label
                    className="flex min-w-0 flex-1 cursor-pointer items-start gap-3.5"
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
                      className={`min-w-0 break-words text-sm leading-6 ${on ? 'text-subtle' : 'text-muted'}`}
                    >
                      <InlineCode text={item.label} />
                    </span>
                  </label>
                  {stage && (
                    <Link
                      href={`/stages/${stage.slug}`}
                      className="t-label mt-0.5 shrink-0 border border-line px-1.5 py-0.5 text-brand transition-colors duration-150 hover:border-brand"
                    >
                      {stage.title}
                    </Link>
                  )}
                </div>
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
              ? 'Every box ticked — the slice is done, and you proved it rather than assumed it.'
              : 'Tick a box only once you have watched it work.'}
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
