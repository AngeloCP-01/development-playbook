'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { SRC_TREE, type TreeNode } from './tree'

/**
 * Source: docs/04-project-setup.md, §2 "Set the folder structure" — the fenced
 * `src/` block and the prose under it.
 *
 * Structural reference: `BoundaryMap` (architecture) for the click-node shape —
 * a list of controls on one side, the selected one's explanation on the other,
 * with the panel holding its own empty state. Not a disclosure: the doc explains
 * the tree *after* printing it, so the reader needs the shape whole and the
 * explanation attached to whichever node they asked about. Seventeen collapsible
 * rows would hide the structure, which is the one thing this section is for.
 *
 * `src/db/` is marked in the tree itself, not only in its note. §2's claim is
 * that it is the one conditional folder and that a reader who is unsure should
 * not create it — a claim that has to survive a reader who never clicks it.
 * `data-conditional` is emitted for every node from `node.conditional`, so a
 * second conditional folder would show up here without anything else changing.
 *
 * Indentation is an inline `paddingInlineStart`, deliberately not a Tailwind
 * class. `pl-${depth}` is the interpolation hazard `PATTERNS.md` documents for
 * `RevealFacet`: it typechecks, lints clean, and ships a class Tailwind never
 * generated a rule for. Depth is data here, so there is no static class to
 * write, and a style attribute is the honest answer.
 */

type FlatNode = { node: TreeNode; depth: number }

function flatten(node: TreeNode, depth = 0): FlatNode[] {
  return [
    { node, depth },
    ...(node.children ?? []).flatMap((child) => flatten(child, depth + 1)),
  ]
}

/** `src/features/billing/queries.ts` → `queries.ts`; `src/app/` → `app/`. */
function segment(path: string): string {
  const trimmed = path.replace(/\/$/, '')
  const last = trimmed.slice(trimmed.lastIndexOf('/') + 1)
  return path.endsWith('/') ? `${last}/` : last
}

const FLAT = flatten(SRC_TREE)

export function TreeInspector() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const selected = FLAT.find((f) => f.node.path === selectedPath)?.node ?? null

  return (
    <Card>
      <p className="mb-4 text-sm text-muted">
        Feature-first, not layer-first. Select any folder or file for what it is
        doing there.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border border-line bg-sunken p-2">
          {FLAT.map(({ node, depth }) => {
            const active = node.path === selectedPath
            return (
              <button
                key={node.path}
                type="button"
                aria-pressed={active}
                aria-label={node.path}
                data-conditional={String(Boolean(node.conditional))}
                onClick={() => setSelectedPath(node.path)}
                style={{ paddingInlineStart: `${0.5 + depth * 0.85}rem` }}
                className={[
                  'flex min-h-11 w-full flex-wrap items-center gap-2 border py-1.5 pr-2 text-left transition-colors duration-150 lg:min-h-9',
                  active
                    ? 'border-brand bg-brand-tint text-fg'
                    : 'border-transparent text-muted hover:border-line hover:bg-raised',
                ].join(' ')}
              >
                <span className="t-data min-w-0 break-words text-[13px]">
                  {segment(node.path)}
                </span>
                {node.conditional && (
                  <span className="t-label shrink-0 border border-warn px-1.5 py-0.5 text-warn">
                    Conditional
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div
          data-testid="tree-note"
          aria-live="polite"
          className="min-h-40 border border-line bg-raised p-4"
        >
          {selected ? (
            <>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="t-label text-subtle">
                  {selected.kind === 'dir' ? 'Folder' : 'File'}
                </span>
                {selected.conditional && (
                  <span className="t-label border border-warn px-1.5 py-0.5 text-warn">
                    Conditional
                  </span>
                )}
              </div>
              <p className="t-data mb-2 min-w-0 break-words text-[13px] text-fg">
                {selected.path}
              </p>
              <p className="min-w-0 break-words text-sm leading-6 text-muted">
                <InlineCode text={selected.note} />
              </p>
            </>
          ) : (
            <p className="text-sm text-subtle">
              Select a folder or file to see why it is there — and, for one of
              them, why it should not be.
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
