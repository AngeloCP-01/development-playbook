import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { type Artifact, type ArtifactLine } from './artifact'
import { CopyArtifact, OverflowFocus } from './ArtifactControls'

// Render test: `src/features/setup/AnnotatedArtifact.test.tsx`, not a sibling
// `*.test.tsx` here — it needs real artifact data, and that data (`ARTIFACTS`)
// is stage-04-local.

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
 * user without a trackpad can reach the overflow. **That tab stop is now
 * conditional** (TD-40): `OverflowFocus` measures each cell and makes only the
 * ones that actually overflow focusable. Measured on `strict`'s eleven lines,
 * that is 5 stops at 320px, 2 at 768 and 1024, and 1 at 1440 — against eleven
 * before, at every width. `ci.yml`'s twenty lines contribute none at 1024px,
 * which is also the honest correction to the paragraph above: the 92-character
 * line is the exception rather than the rule.
 *
 * **The note column is `select-none`** (TD-39). Laying rows out as [code][note]
 * puts the notes between the code lines in the DOM, so selecting the block
 * returned code, annotation, code, annotation — over data whose header says the
 * reader is meant to paste it. Excluding the notes from selection fixes the
 * manual path; `CopyArtifact` is the direct one, and it hands over exactly the
 * string `artifacts.test.ts` builds to hold the block against the doc, so what
 * a reader pastes is what the test verifies.
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
      <div
        data-artifact-scroller
        tabIndex={-1}
        className="min-w-0 overflow-x-auto sm:flex-1"
      >
        {/* <code>, not <span>: dropping <pre> is the measured choice (20px a
            line against 24px plus 24px of block padding), and it costs nothing
            to keep the element that says this is code. Thirteen config files
            were being announced as running prose. */}
        <code
          data-artifact-line
          className={`t-data inline-block min-h-5 whitespace-pre text-[13px] leading-5 sm:text-sm ${
            line.note ? 'text-fg' : 'text-muted'
          }`}
        >
          {line.text}
        </code>
      </div>

      {line.note ? (
        <p
          data-artifact-note
          className="select-none text-sm leading-6 text-muted sm:w-64 sm:shrink-0 lg:w-72"
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
        <CopyArtifact
          filename={artifact.filename}
          text={artifact.lines.map((l) => l.text).join('\n')}
        />
      </div>

      <OverflowFocus>
        <div className="border border-line bg-sunken py-2">
          {artifact.lines.map((line, i) => (
            <ArtifactRow key={`${i}-${line.text}`} line={line} />
          ))}
        </div>
      </OverflowFocus>
    </Card>
  )
}
