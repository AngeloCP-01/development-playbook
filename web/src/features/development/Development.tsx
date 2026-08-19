import { Stepper, type Step } from '@/components/Stepper'
import { Prose, Section } from '@/components/ui'
import { type StepId } from './steps'

/**
 * Stage 05's thirteen panels.
 *
 * The stage goes `ready: true` before any of this has content, deliberately:
 * every content task's exit condition is a panel measurement at 1024×768, and
 * there is nothing to measure until the route renders.
 */
// No `as` cast here, deliberately. A cast is a place you told the compiler to
// stop helping, and this stage's own `## Definition of done` requires a comment
// on every one. Writing the array out means `StepId` is checked rather than
// asserted, which is the whole reason the tuple exists.
function placeholder(label: string, hint: string) {
  return (
    <Section eyebrow="Not yet drawn" title={label}>
      <Prose>
        <p>{hint}</p>
      </Prose>
    </Section>
  )
}

// Annotated on the source array, not asserted on the result: `id` has to be a
// `StepId` where it is written, so a typo fails here rather than being cast
// away downstream.
const RAIL: { id: StepId; label: string; hint: string }[] = [
  { id: 'loop', label: 'The loop', hint: 'How to cut two days of work' },
  {
    id: 'server',
    label: 'Server first',
    hint: 'Where the client boundary goes',
  },
  { id: 'thin', label: 'Thin routes', hint: 'What belongs one directory away' },
  { id: 'action', label: 'Actions', hint: 'Authenticate, validate, authorize' },
  {
    id: 'callers',
    label: 'Callers',
    hint: 'A form, and a button with nothing to type',
  },
  { id: 'reads', label: 'Reads', hint: 'The rule says nothing about the verb' },
  { id: 'drill', label: 'Safe or not', hint: 'Six snippets, scored' },
  {
    id: 'boundaries',
    label: 'Boundaries',
    hint: 'What gets parsed, and the one exception',
  },
  { id: 'states', label: 'Loading, error', hint: 'Where the waiting went' },
  {
    id: 'commits',
    label: 'Habits',
    hint: 'Commits, getting stuck, fast feedback',
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where it earns its place, and where it does not',
  },
  { id: 'checklist', label: 'Done', hint: 'What one slice owes before the PR' },
  { id: 'traps', label: 'Traps', hint: 'Failure modes worth naming' },
]

const STEPS: (Step & { id: StepId })[] = RAIL.map(({ id, label, hint }) => ({
  id,
  label,
  hint,
  content: placeholder(label, hint),
}))

export function Development() {
  return <Stepper steps={STEPS} />
}
