'use client'

import { useId, useState } from 'react'

export function CopyText({
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
  const root = useId()
  const [message, setMessage] = useState('')
  const [manual, setManual] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Copied to clipboard.')
      setManual(false)
    } catch {
      setMessage(
        'Copy is unavailable. Select the Markdown below and copy it manually.',
      )
      setManual(true)
    }
  }
  return (
    <div className="mt-4 min-w-0">
      <button
        type="button"
        disabled={disabled}
        onClick={() => void copy()}
        className="min-h-11 border border-line px-4 text-sm disabled:cursor-default disabled:text-subtle"
      >
        {label}
      </button>
      <p
        role="status"
        aria-label="Copy status"
        className="mt-2 text-sm text-muted"
      >
        {message}
      </p>
      {manual && (
        <div className="mt-3">
          <label
            htmlFor={`${root}-manual`}
            className="mb-2 block text-sm font-medium"
          >
            {manualLabel}
          </label>
          <textarea
            id={`${root}-manual`}
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
