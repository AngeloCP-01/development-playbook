// web/src/features/observability/drill-types.ts
/**
 * The shape every drill in this stage shares. Four datasets, one component
 * (`Drill.tsx`). `prompt` and `why` go through `InlineCode`, so they carry
 * backticks where the doc does.
 */
export type DrillOption = { id: string; label: string }

export type DrillRow = {
  id: string
  /** The situation, described — never the doc's own verdict on it. */
  prompt: string
  /** A `DrillOption.id`. */
  answer: string
  /** A sentence from the doc, pinned in the dataset's test. */
  why: string
}
