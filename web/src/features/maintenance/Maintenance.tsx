import { Stepper } from '@/components/Stepper'
import { References } from '@/components/References'
import { STEPS } from './steps'

export function Maintenance() {
  return (
    <>
      <Stepper steps={STEPS} />
      <div className="mt-12">
        <References slug="17-maintenance" />
      </div>
    </>
  )
}
