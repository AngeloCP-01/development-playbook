import type { ComponentType } from 'react'

/**
 * Optional mini-diagrams for term popovers, keyed by term id — the same
 * registry pattern as STAGE_CONTENT, and guarded by the same kind of invariant
 * test (a visual with no matching definition fails the suite).
 *
 * Everything renders as <span>, never <div>: a Term sits inside <p> in prose,
 * and a div inside p is invalid HTML that React will warn about on hydration.
 */

function Box({
  label,
  children,
  tone = 'plain',
}: {
  label: string
  children?: React.ReactNode
  tone?: 'plain' | 'store'
}) {
  return (
    <span
      className={[
        'flex min-w-0 flex-col items-center gap-1 border px-2 py-1.5',
        tone === 'store'
          ? 'border-brand bg-brand-tint'
          : 'border-line bg-raised',
      ].join(' ')}
    >
      <span className="t-label text-[9px] text-subtle">{label}</span>
      {children}
    </span>
  )
}

function Pkg() {
  return (
    <span className="t-data block bg-fg px-1.5 py-0.5 text-[9px] leading-none text-bg">
      react
    </span>
  )
}

function NpmVisual() {
  return (
    <span className="block">
      <span className="flex items-stretch gap-2">
        <Box label="project a">
          <Pkg />
        </Box>
        <Box label="project b">
          <Pkg />
        </Box>
        <Box label="project c">
          <Pkg />
        </Box>
      </span>
      <span className="t-label mt-2 block text-[9px] text-subtle">
        3 projects → 3 full copies on disk
      </span>
    </span>
  )
}

function PnpmVisual() {
  return (
    <span className="block">
      <span className="flex justify-center">
        <Box label="store · one per machine" tone="store">
          <Pkg />
        </Box>
      </span>
      <span
        className="mx-auto mt-1 flex w-4/5 justify-between text-subtle"
        aria-hidden
      >
        <span>↑</span>
        <span>↑</span>
        <span>↑</span>
      </span>
      <span className="mt-1 flex items-stretch gap-2">
        <Box label="project a">
          <span className="t-data text-[9px] text-brand">link</span>
        </Box>
        <Box label="project b">
          <span className="t-data text-[9px] text-brand">link</span>
        </Box>
        <Box label="project c">
          <span className="t-data text-[9px] text-brand">link</span>
        </Box>
      </span>
      <span className="t-label mt-2 block text-[9px] text-subtle">
        one copy on disk → linked into every project
      </span>
    </span>
  )
}

export const TERM_VISUALS: Record<string, ComponentType> = {
  npm: NpmVisual,
  pnpm: PnpmVisual,
}
