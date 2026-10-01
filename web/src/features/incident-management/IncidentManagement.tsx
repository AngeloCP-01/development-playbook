import { Stepper } from '@/components/Stepper'
import { RESPONSE_STEPS } from './panels-response'
import { FOLLOWUP_STEPS } from './panels-followup'

export function IncidentManagement() {
  return <Stepper steps={[...RESPONSE_STEPS, ...FOLLOWUP_STEPS]} />
}
