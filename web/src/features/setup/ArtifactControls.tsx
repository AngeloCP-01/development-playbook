'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * The two client leaves `AnnotatedArtifact` needs, kept small on purpose.
 *
 * The component around them stays a server component. Making the whole of it
 * client would serialise nineteen artifacts — every line and every note — into
 * the RSC payload for two affordances, so what crosses the boundary here is one
 * string for the button and one already-rendered subtree for the scrollers.
 */

/**
 * Makes an overflowing code line focusable and leaves the rest alone (TD-40).
 *
 * Every line used to carry `tabIndex={0}`, which is the correct WCAG 2.1.1
 * treatment for a scrollable region and the wrong one for a region that does
 * not scroll: `ci.yml` alone put twenty tab stops in a panel, each taking the
 * global focus ring, and at 1024px perhaps two of them scrolled anything.
 *
 * **A ref callback rather than an effect**, and that is not a style choice.
 * `react-hooks/set-state-in-effect` is an error in this codebase, so measuring
 * on mount and storing the result in state would fail lint and cause the
 * cascading render `useLocalStorage` exists to avoid. A ref callback runs after
 * the node is attached, needs no state, and React 19 takes a cleanup from it —
 * so the `ResizeObserver` that keeps the answer true across a resize unhooks
 * itself.
 *
 * It sets `tabindex` imperatively on nodes React owns, which is safe only
 * because the children are static markup that never re-renders. If a line ever
 * becomes dynamic, this has to become real state.
 */
export function OverflowFocus({ children }: { children: ReactNode }) {
  const attach = useCallback((root: HTMLDivElement | null) => {
    if (!root) return

    const sync = () => {
      for (const cell of root.querySelectorAll<HTMLElement>(
        '[data-artifact-scroller]',
      )) {
        cell.tabIndex = cell.scrollWidth > cell.clientWidth ? 0 : -1
      }
    }

    sync()

    // Width is the only thing that changes the answer, and it changes on a
    // viewport resize and on the rail collapsing at `lg`.
    const observer = new ResizeObserver(sync)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return <div ref={attach}>{children}</div>
}

/**
 * Copies the artifact's lines, and nothing else (TD-39).
 *
 * `select-none` on the note column already stops a manual selection returning
 * code, annotation, code, annotation. It does not tell the reader that copying
 * is the intended move, and it still asks them to drag-select twenty lines
 * inside a scrolling container. The text handed over is exactly
 * `lines.map(l => l.text).join('\n')` — the same string `artifacts.test.ts`
 * builds to hold the block against the doc, so what the reader pastes is what
 * the test verifies.
 */
export function CopyArtifact({
  filename,
  text,
}: {
  filename: string
  text: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      // No confirmation at all reads exactly like a silent failure. It reverts
      // rather than latching, so a second copy is legible as a second copy.
      window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${filename}`}
      className="t-label ml-auto flex min-h-11 items-center gap-1.5 px-2 text-subtle transition-colors duration-150 hover:text-fg lg:min-h-9"
    >
      {copied ? (
        <Check className="size-3.5 shrink-0 text-go" aria-hidden />
      ) : (
        <Copy className="size-3.5 shrink-0" aria-hidden />
      )}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
