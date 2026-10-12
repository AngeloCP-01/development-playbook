import { RevealList } from '@/components/RevealList'
import { Callout, Prose, Section } from '@/components/ui'
import { AI_PLAYS, AI_PROMPT, TRAPS, type TrapRow } from './content'
import { CopyText } from './CopyText'
import { PerformanceChecklist } from './PerformanceChecklist'
import { PerformanceWorksheet } from './PerformanceWorksheet'

export function RecordPanel() {
  return (
    <Section title="Record your own baseline">
      <PerformanceWorksheet view="baseline" />
    </Section>
  )
}

export function FollowupPanel() {
  return (
    <Section title="Record the change and comparison">
      <PerformanceWorksheet view="followup" />
    </Section>
  )
}

export function AIPanel() {
  return (
    <Section title="AI in performance optimization">
      <Prose>
        <p>
          Give an assistant redacted evidence, not a request to invent a p95.
          Verify its arithmetic, query-plan interpretation and causal claims
          against raw measurements. Keep customer and payment data out of
          prompts.
        </p>
      </Prose>
      <div className="mt-6">
        <RevealList
          idPrefix="performance-ai"
          rows={AI_PLAYS.map((row) => ({
            id: row.id,
            title: row.title,
            body: <p>{row.detail}</p>,
          }))}
        />
      </div>
      <div className="mt-5 border border-line bg-sunken p-4">
        <h3 className="t-head mb-3 text-lg">Evidence review prompt</h3>
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-fg">
          {AI_PROMPT}
        </pre>
        <CopyText
          text={AI_PROMPT}
          label="Copy evidence prompt"
          manualLabel="Evidence prompt"
        />
      </div>
    </Section>
  )
}

export function DonePanel() {
  return (
    <Section title="Close the pass with evidence">
      <PerformanceChecklist />
    </Section>
  )
}

export function TrapsPanel({ traps = TRAPS }: { traps?: readonly TrapRow[] }) {
  return (
    <Section title="Ways an optimization overclaims">
      <RevealList
        idPrefix="performance-traps"
        rows={traps.map((row) => ({
          id: row.id,
          title: row.title,
          body: <p>{row.detail}</p>,
        }))}
      />
      <div className="mt-5">
        <Callout kind="trap" title="Keep the user clock visible">
          <p>
            A faster internal span is a clue. Close the pass with the same user
            outcome, failures, timeouts and correctness evidence, or record the
            remaining gap and owner.
          </p>
        </Callout>
      </div>
    </Section>
  )
}
