'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { SCHEMA_LINES, type SchemaLine } from './scoring'

/**
 * The doc's CREATE TABLE block, rendered from data rather than pasted as a
 * blob of text, so each constraint can explain what it buys rather than what
 * it says. Modelled on `OpportunityTree` (discovery) for the
 * click-node-plus-detail-panel shape, with the radio semantics borrowed from
 * this feature's own `ModelInterrogation` / `ReversibilityTable` for
 * consistency within stage 03: `role="radio"` inside `role="radiogroup"`,
 * one selection at a time, nothing checked on load.
 *
 * The longest line is 66 characters and does not fit 320px at a readable
 * monospace size, so the block gets its own horizontally-scrolling container
 * rather than shrinking the type or letting the page scroll sideways. That
 * container carries `tabIndex={0}` so a keyboard user without a trackpad can
 * still reach the scroll.
 *
 * Structural lines (`CREATE TABLE invoices (`, `);`) carry no note and render
 * as inert text — no marker, no hover, not part of the radiogroup. Annotated
 * lines get a gutter marker as a second, non-colour signal that they are
 * clickable, because brand is reserved for the selected line and nothing
 * else: none of these constraints is right or wrong, so no semantic colour
 * applies to any of them.
 */

function fieldName(sql: string) {
  const first = sql.trim().split(/\s+/)[0] ?? sql
  return first.replace(/[(),]/g, '')
}

function SchemaRow({
  line,
  selected,
  onSelect,
}: {
  line: SchemaLine
  selected: boolean
  onSelect: () => void
}) {
  const indent = line.indent === 1 ? 'pl-6' : ''

  if (!line.note) {
    return (
      <div className="flex min-h-11 items-center gap-2.5 px-3 lg:min-h-8">
        <span className="w-3.5 shrink-0" aria-hidden />
        <span
          className={`t-data whitespace-pre text-[13px] text-muted sm:text-sm ${indent}`}
        >
          {line.sql}
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={[
        'flex min-h-11 w-full items-center gap-2.5 border-l-2 px-3 text-left transition-colors duration-150 lg:min-h-8',
        selected
          ? 'border-brand bg-brand-tint'
          : 'border-transparent hover:bg-sunken',
      ].join(' ')}
    >
      <span
        className={`w-3.5 shrink-0 text-sm ${selected ? 'text-brand' : 'text-subtle'}`}
        aria-hidden
      >
        ▸
      </span>
      <span
        className={`t-data whitespace-pre text-[13px] text-fg sm:text-sm ${indent}`}
      >
        {line.sql}
      </span>
    </button>
  )
}

export function SchemaInspector() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedLine = SCHEMA_LINES.find((l) => l.id === selectedId) ?? null

  return (
    <Card>
      <div
        tabIndex={0}
        aria-label="CREATE TABLE invoices statement, scrolls horizontally"
        className="overflow-x-auto border border-line bg-sunken py-2"
      >
        <div
          role="radiogroup"
          aria-label="Annotated lines of the invoices table"
          className="min-w-max"
        >
          {SCHEMA_LINES.map((line) => (
            <SchemaRow
              key={line.id}
              line={line}
              selected={selectedId === line.id}
              onSelect={() => setSelectedId(line.id)}
            />
          ))}
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-4 min-h-24 border border-line bg-raised p-4"
      >
        {selectedLine?.note ? (
          <>
            <span className="inline-block bg-brand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-fg">
              {fieldName(selectedLine.sql)}
            </span>
            <p className="t-data mt-2.5 whitespace-pre-wrap text-[13px] text-fg">
              {selectedLine.sql}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              {selectedLine.note}
            </p>
          </>
        ) : (
          <p className="text-sm text-subtle">
            Select a line to see what it buys.
          </p>
        )}
      </div>
    </Card>
  )
}
