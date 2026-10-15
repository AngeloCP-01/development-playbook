import { References } from '@/components/References'
import { Stepper } from '@/components/Stepper'
import { STEPS } from './steps'

export function PerformanceOptimization() {
  return (
    <>
      <Stepper steps={STEPS} />
      <div className="mt-12">
        <References slug="09-performance-optimization" />
      </div>
    </>
  )
}
