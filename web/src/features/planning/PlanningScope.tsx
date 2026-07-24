/**
 * Where this stage sits inside the wider industry phrase "product planning."
 *
 * The standard treatment runs seven steps — ideate, research the market, set
 * vision and goals, write specifications, build a roadmap, prototype, launch
 * — which spans most of this playbook rather than one document of it. This
 * stage owns only the middle three. The point the figure draws: the stage
 * number is a filing code for who owns a piece of work, not a position in
 * this sequence.
 */

type Step = {
  label: string
  owner: string
  thisStage: boolean
}

const SEVEN_STEPS: Step[] = [
  { label: 'Ideate', owner: '01', thisStage: false },
  { label: 'Market research', owner: '01', thisStage: false },
  { label: 'Vision & goals', owner: 'This stage', thisStage: true },
  { label: 'Specification', owner: 'This stage', thisStage: true },
  { label: 'Roadmap', owner: 'This stage', thisStage: true },
  { label: 'Prototype', owner: '01', thisStage: false },
  { label: 'Launch', owner: '13', thisStage: false },
]

export function PlanningScope() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-7 sm:gap-1.5">
        {SEVEN_STEPS.map((step) => (
          <div
            key={step.label}
            className={[
              'flex min-w-0 flex-col items-center gap-1.5 border px-2.5 py-3 text-center',
              step.thisStage
                ? 'border-brand bg-brand-tint'
                : 'border-line bg-sunken',
            ].join(' ')}
          >
            <p className="break-words text-sm font-medium text-fg">
              {step.label}
            </p>
            <span
              className={[
                't-label px-1.5 py-0.5',
                step.thisStage
                  ? 'bg-brand text-brand-fg'
                  : 'bg-raised text-subtle',
              ].join(' ')}
            >
              {step.thisStage ? 'This stage' : step.owner}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-subtle">
        The band stops at launch because the phrase does — but the playbook does
        not. What happens to the product afterwards is stages 17 and 18, running
        on their own weekly and quarterly cadence, not an ending.
      </p>
    </div>
  )
}
