'use client'
import { useId, useState, type ReactNode, type KeyboardEvent } from 'react'
export type SelectionItem = { id: string; label: string; content: ReactNode }
export function SelectionTabs({
  label,
  items,
}: {
  label: string
  items: readonly SelectionItem[]
}) {
  const root = useId()
  const [selected, setSelected] = useState(0)
  const index = selected < items.length ? selected : 0
  if (items.length === 0) return <p>No examples are available.</p>
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % items.length
        : event.key === 'ArrowLeft'
          ? (index + items.length - 1) % items.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? items.length - 1
              : null
    if (next === null) return
    event.preventDefault()
    setSelected(next)
    event.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role=tab]')
      [next]?.focus()
  }
  return (
    <div className="min-w-0">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={keys}
        className="mb-4 flex flex-wrap gap-2"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            data-selection-id={item.id}
            type="button"
            role="tab"
            id={`${root}-tab-${item.id}`}
            aria-controls={`${root}-panel-${item.id}`}
            aria-selected={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setSelected(i)}
            className={`t-ui min-h-11 min-w-0 break-words border border-line px-3 py-2 text-left text-sm ${i === index ? 'border-brand bg-brand-tint text-fg' : 'bg-raised text-muted'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${root}-panel-${items[index].id}`}
        aria-labelledby={`${root}-tab-${items[index].id}`}
        tabIndex={0}
        className="min-w-0 focus-visible:outline-2 focus-visible:outline-brand"
      >
        {items[index].content}
      </div>
    </div>
  )
}
