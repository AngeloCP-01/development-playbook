'use client'
import { useId, useRef, useState } from 'react'
export function CopyMarkdown({
  text,
  label = 'Copy as Markdown',
  manualLabel = 'Markdown record',
  disabled = false,
}: {
  text: string
  label?: string
  manualLabel?: string
  disabled?: boolean
}) {
  const id = useId()
  const attempt = useRef(0)
  const [result, setResult] = useState<{
    text: string
    manual: boolean
  } | null>(null)
  async function copy() {
    const sequence = ++attempt.current
    try {
      await navigator.clipboard.writeText(text)
      if (sequence === attempt.current) setResult({ text, manual: false })
    } catch {
      if (sequence === attempt.current) setResult({ text, manual: true })
    }
  }
  const message = result?.manual
    ? 'Copy is unavailable. Select the current Markdown below and copy it manually.'
    : result?.text === text
      ? 'Copied this version to clipboard.'
      : ''
  return (
    <div className="mt-4 min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void copy()}
        className="t-ui min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle"
      >
        {label}
      </button>
      <p
        role="status"
        aria-label={`Copy status: ${label}`}
        className="mt-2 text-sm text-muted"
      >
        {message}
      </p>
      {result?.manual && (
        <div className="mt-3">
          <label htmlFor={id} className="mb-2 block text-sm font-medium">
            {manualLabel}
          </label>
          <textarea
            id={id}
            readOnly
            value={text}
            rows={6}
            className="w-full border border-line bg-sunken px-3 py-2 text-sm leading-relaxed text-fg focus-visible:outline-2 focus-visible:outline-brand"
          />
        </div>
      )}
    </div>
  )
}
