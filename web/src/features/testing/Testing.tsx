import { Stepper, type Step } from '@/components/Stepper'
import { Prose, Section } from '@/components/ui'
import { type StepId } from './steps'

/**
 * Stage 06's seven panels.
 *
 * Placeholders here on purpose — the point of this task is a route that
 * renders, so later tasks can measure panel weight as they fill each one in.
 */
const CONTENT_STEPS: (Step & { id: StepId })[] = [
  {
    id: 'triage',
    label: 'If this breaks, how will I find out?',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'restraint',
    label: 'The tests not to write',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'unit',
    label: 'Underneath: the pure function',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'integration',
    label: 'One layer up: the action',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'e2e',
    label: 'On top: the money path',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'teeth',
    label: 'Proving a test bites',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
  {
    id: 'done',
    label: 'Done, and done on a team',
    hint: 'Placeholder',
    content: (
      <Section title="Placeholder">
        <Prose>
          <p>Panel under construction.</p>
        </Prose>
      </Section>
    ),
  },
]

export function Testing() {
  return <Stepper steps={CONTENT_STEPS} />
}
