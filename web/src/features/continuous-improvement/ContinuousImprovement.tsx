import { References } from '@/components/References'
import { Stepper } from '@/components/Stepper'
import { STEPS } from './steps'

export function ContinuousImprovement() {
  return (
    <>
      <Stepper steps={STEPS} />
      <div className="mt-12">
        <References slug="18-continuous-improvement" />
      </div>
    </>
  )
}
