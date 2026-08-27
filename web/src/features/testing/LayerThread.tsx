import { ArrowDown, Globe, Link2, TestTube2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { LAYERS, type Layer } from './layers'

/**
 * F2: one feature — a discounted checkout — carried at three altitudes.
 *
 * `blind` is the design decision this component exists to render, not just
 * store. Three rows with a table's four fields each would be three
 * definitions; the point of the figure is that they are a chain — each
 * layer's blind spot is the *next* layer's reason to exist. So the blind
 * line for unit and integration ends with an explicit lead-in naming the
 * layer below, and the connector between rows is a literal arrow, not
 * whitespace. E2E's blind line has no lead-in, because there is no fourth
 * layer to hand it to — that absence is itself part of the teaching, so it
 * is stated rather than left silent.
 *
 * The icon per row is decorative and identical across themes, not a colour
 * code — `label` and a leading ordinal are what actually distinguish a row,
 * so nothing here relies on colour alone to say which layer is which.
 */
const ICON: Record<Layer['id'], ReactNode> = {
  unit: <TestTube2 className="size-4 shrink-0 text-subtle" aria-hidden />,
  integration: <Link2 className="size-4 shrink-0 text-subtle" aria-hidden />,
  e2e: <Globe className="size-4 shrink-0 text-subtle" aria-hidden />,
}

export function LayerThread() {
  return (
    <div className="border border-line">
      {LAYERS.map((layer, i) => {
        const next = LAYERS[i + 1]
        return (
          <div
            key={layer.id}
            className={i > 0 ? 'border-t border-line' : undefined}
          >
            <div className="flex flex-wrap items-start gap-4 p-5">
              <div className="flex min-w-28 shrink-0 items-center gap-2">
                <span className="t-data text-subtle" aria-hidden>
                  {i + 1}
                </span>
                {ICON[layer.id]}
                <span className="t-label text-fg">{layer.label}</span>
              </div>

              <dl className="grid flex-1 grid-cols-3 gap-x-4 gap-y-1 text-sm">
                <div>
                  <dt className="t-label text-subtle">Target</dt>
                  <dd className="t-data break-words text-fg">{layer.target}</dd>
                </div>
                <div>
                  <dt className="t-label text-subtle">Volume</dt>
                  <dd className="t-data text-fg">{layer.volume}</dd>
                </div>
                <div>
                  <dt className="t-label text-subtle">Speed</dt>
                  <dd className="t-data text-fg">{layer.speed}</dd>
                </div>
              </dl>
            </div>

            <p className="measure px-5 pb-4 text-sm leading-6 text-muted">
              {layer.proves}
            </p>

            <div className="flex gap-3 border-t border-line bg-sunken px-5 py-4">
              <ArrowDown
                className="mt-0.5 size-4 shrink-0 text-subtle"
                aria-hidden
              />
              <p className="measure text-sm leading-6 text-muted">
                <span className="font-medium text-fg">Blind spot — </span>
                {layer.blind}{' '}
                {next ? (
                  <span className="font-medium text-fg">
                    Which is why {next.label.toLowerCase()} tests exist.
                  </span>
                ) : (
                  <span className="italic text-subtle">
                    There is no fourth layer to catch what this one misses — the
                    chain ends here.
                  </span>
                )}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
