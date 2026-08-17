import { Stepper, type Step } from '@/components/Stepper'
import { Prose, Section } from '@/components/ui'
import { References } from '@/components/References'
import { type StepId } from './steps'

/**
 * Stage 04's fifteen panels.
 *
 * **This file is a skeleton for the length of Wave 1 and Wave 2.** Every panel
 * below carries its real id, label and hint and a placeholder body; the content
 * lands in Tasks 12 and 13. The stage is flipped `ready: true` anyway, and that
 * is deliberate rather than sloppy: the exit condition of every content task is
 * a panel measurement at 1024×768, and there is nothing to measure until the
 * route renders.
 *
 * Four of the fifteen are provisional — `structure`, `client`, `enforce` and
 * `verify` — and merge into the step above them if the combined panel measures
 * under 3.2 screens. They are authored split because a merge undoes with a
 * delete, while a split costs new ids and every reference to them. See
 * `steps.ts`.
 */
const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'scaffold',
    label: 'Scaffold',
    hint: 'Which file does each environment actually read',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Day one" title="Scaffold, and pin what runs it">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'structure',
    label: 'Structure',
    hint: 'Feature-first, or layer-first',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Day one" title="Where a new file goes">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'format',
    label: 'Format',
    hint: 'One tool lints, one formats — and where the flag lives',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The toolchain" title="Lint and format are two jobs">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'strict',
    label: 'Strict',
    hint: "Which flags earn the first week's friction",
    content: (
      <div className="space-y-16">
        <Section eyebrow="The toolchain" title="Strictness you turn on once">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'env',
    label: 'Env',
    hint: 'Validate at boot, or read process.env',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Configuration" title="Fail at boot, not at 3am">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'client',
    label: 'Client',
    hint: 'The failure every gate on this page stays green for',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Configuration" title="The gap the gates do not cover">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'hooks',
    label: 'Hooks',
    hint: 'What belongs on commit, and what belongs on push',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Enforcement" title="Two hooks, two budgets">
          <Prose>
            <p>Content lands in Task 12.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'ci',
    label: 'CI',
    hint: 'The minimum pipeline, and which name to require',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Enforcement" title="The pipeline, cheapest first">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'enforce',
    label: 'Enforce',
    hint: 'Enforcement is not verification',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Enforcement" title="A green check is not a guarantee">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'deploy',
    label: 'Deploy',
    hint: 'Which failures your repository cannot express',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Deployment" title="Four ways the first deploy fails">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'verify',
    label: 'Verify',
    hint: 'Check what it built, not whether it built',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Deployment" title="Check the SHA, not the status">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'proof',
    label: 'Proof',
    hint: 'What counts as evidence that error tracking works',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Deployment" title="Prove the alarm is wired">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where an agent reaches, and where it cannot',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="AI in the loop"
          title="Where an agent reaches, and where it cannot"
        >
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'checklist',
    label: 'Checklist',
    hint: 'Done, and what changes on a team',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Closing" title="What you should have, and when">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The seven that cost the most',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Closing" title="Seven traps">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
]

export function Setup() {
  return (
    <>
      <Stepper steps={STEPS} />
      <References slug="04-project-setup" />
    </>
  )
}
