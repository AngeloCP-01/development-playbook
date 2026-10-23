import { References } from '@/components/References'
import { Stepper } from '@/components/Stepper'
import { DocumentationSession } from './DocumentationSession'
import { STEPS } from './steps'
export function Documentation() {
  return (
    <>
      <DocumentationSession>
        <Stepper steps={STEPS} />
      </DocumentationSession>
      <div className="mt-12">
        <References slug="10-documentation" />
      </div>
    </>
  )
}
