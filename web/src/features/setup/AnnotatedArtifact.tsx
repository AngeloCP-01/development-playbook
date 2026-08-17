import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { type Artifact, type ArtifactLine } from './artifacts'

/**
 * One config file from `artifacts.ts`, quoted verbatim and annotated line by
 * line. Five of stage 04's fifteen steps render one of these — `format`,
 * `strict`, `env`, `hooks` and `ci` — which is why the artifact arrives as a
 * prop rather than being picked here.
 *
 * **Per-line elements, not a `<pre>`, and that is a measurement rather than a
 * preference.** On this build a rendered line costs 20px (`text-[13px]` at
 * `leading-5`, `sm:text-sm` keeping the same 20px) where a `<pre>` costs 24px a
 * line plus 24px of block padding it will not give back. Across five panels
 * that is the difference between clearing the 3.2-screen ceiling and not. The
 * per-line shape is `SchemaInspector`'s (`src/features/architecture/
 * SchemaInspector.tsx:54`); what is dropped here is its click-to-select
 * detail panel, because nothing in this component is interactive.
 *
 * **The note sits beside its line at `sm` and up, below it under that.** That
 * placement is what forces the scroll container to be per line rather than one
 * container around the whole block: the widest line here is 92 characters, so a
 * shared `min-w-max` block would push a right-hand note column past 700px and
 * out of the 1024px panel the audit measures, and the reader would have to
 * scroll sideways to reach the annotation that is the whole point. Each code
 * cell therefore scrolls on its own and carries `tabIndex={0}`, so a keyboard
 * user without a trackpad can reach the overflow — the cost is one tab stop per
 * line, paid so that no note is ever off-screen.
 *
 * **The pivot line takes the `brand` accent**, because a pivot is the line the
 * step's judgment turns on — attention, not approval. No semantic colour
 * applies to any line here: none of them is right or wrong. Colour is not the
 * only signal for it either; the row carries a `PIVOT` label its neighbours
 * do not.
 */

function ArtifactRow({ line }: { line: ArtifactLine }) {
  const pivot = line.pivot === true

  return (
    <div
      data-artifact-pivot={pivot ? '' : undefined}
      className={[
        'flex flex-col gap-1 border-l-2 py-0.5 pr-3 pl-2.5 sm:flex-row sm:items-start sm:gap-5',
        pivot ? 'border-brand bg-brand-tint' : 'border-transparent',
      ].join(' ')}
    >
      <div tabIndex={0} className="min-w-0 overflow-x-auto sm:flex-1">
        <span
          data-artifact-line
          className={`t-data inline-block min-h-5 whitespace-pre text-[13px] leading-5 sm:text-sm ${
            line.note ? 'text-fg' : 'text-muted'
          }`}
        >
          {line.text}
        </span>
      </div>

      {line.note ? (
        <p
          data-artifact-note
          className="text-sm leading-6 text-muted sm:w-64 sm:shrink-0 lg:w-72"
        >
          {pivot ? (
            <span className="t-label mr-2 text-brand">Pivot</span>
          ) : null}
          <InlineCode text={line.note} />
        </p>
      ) : null}
    </div>
  )
}

export function AnnotatedArtifact({ artifact }: { artifact: Artifact }) {
  return (
    <Card>
      <div className="mb-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="t-data text-sm text-fg">{artifact.filename}</span>
        <span className="t-label text-subtle">{artifact.language}</span>
      </div>

      <div className="border border-line bg-sunken py-2">
        {artifact.lines.map((line, i) => (
          <ArtifactRow key={`${i}-${line.text}`} line={line} />
        ))}
      </div>
    </Card>
  )
}
