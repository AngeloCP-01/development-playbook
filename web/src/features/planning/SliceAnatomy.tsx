import { Contrast } from '@/components/ui'

/**
 * Figure 4. Source: docs/02-planning.md:104-121.
 *
 * Same three bands — storage, logic, interface — drawn two ways. Layer-first
 * fills one band at a time and nothing works until the last step; a vertical
 * slice cuts through all three at once and ships on day one. Static: the
 * decision this teaches is made in `SliceSequencer` below, this just draws the
 * shape of it. Colour is never the only signal — each side already carries
 * the `Contrast` component's Weak/Strong label.
 */

const BANDS = ['Interface', 'Logic', 'Storage']

function LayerFirst() {
  return (
    <div className="space-y-2">
      {BANDS.map((band, i) => (
        <div key={band} className="flex items-center gap-2.5">
          <span className="t-data w-5 shrink-0 text-right text-subtle">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 border border-line bg-sunken px-3 py-2.5">
            <span className="break-words text-xs text-muted">{band}</span>
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs leading-5 text-subtle">
        Nothing runs until step 3 — and the schema was designed before anyone
        understood the problem.
      </p>
    </div>
  )
}

function VerticalSlice() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {BANDS.map((band) => (
          <div key={band} className="space-y-1.5">
            <div className="border border-line bg-sunken px-2 py-2.5 text-center">
              <span className="break-words text-xs text-muted">{band}</span>
            </div>
            <div className="border border-blueprint bg-blueprint px-2 py-2.5 text-center">
              <span className="t-data text-xs text-bg">slice</span>
            </div>
          </div>
        ))}
      </div>
      <p className="pt-2.5 text-xs leading-5 text-subtle">
        One column, all three bands — it ships and teaches something before the
        next slice starts.
      </p>
    </div>
  )
}

export function SliceAnatomy() {
  return (
    <Contrast
      badLabel="Layer-first"
      goodLabel="Vertical slice"
      bad={<LayerFirst />}
      good={<VerticalSlice />}
    />
  )
}
