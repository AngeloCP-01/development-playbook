import { STEP_IDS as DISCOVERY } from './discovery/steps'
import { STEP_IDS as PLANNING } from './planning/steps'
import { STEP_IDS as ARCHITECTURE } from './architecture/steps'
import { STEP_IDS as SETUP } from './setup/steps'
import { STEP_IDS as DEVELOPMENT } from './development/steps'
import { STEP_IDS as TESTING } from './testing/steps'
import { STEP_IDS as CODE_REVIEW } from './code-review/steps'
import { STEP_IDS as STAGING } from './staging/steps'
import { STEP_IDS as PRODUCTION_DEPLOYMENT } from './production-deployment/steps'
import { STEP_IDS as POST_DEPLOYMENT_VERIFICATION } from './post-deployment-verification/steps'

/**
 * Every built stage's rail, keyed by slug — the *declaration* of what each
 * stage contains.
 *
 * It exists because two very different checks need the same list, and both had
 * started keeping their own copy. `features/rails.test.tsx` renders each stage
 * in jsdom and compares the rail it draws to this; `e2e/audit-pages.spec.ts`
 * compares the URLs the audit sweeps off the real built app to this. A third
 * copy is how the pair would drift into agreeing with each other rather than
 * with the stages.
 *
 * The distinction that makes those checks worth anything: this file is a
 * declaration and both consumers are observations. A test that compares the
 * sweep to `STAGES.filter(s => s.ready)` compares the deriver to its own input
 * and cannot fail — the audit spec had exactly that test for one commit, which
 * is what this replaced.
 */
export const STEP_IDS_BY_SLUG: Record<string, readonly string[]> = {
  '01-product-discovery': DISCOVERY,
  '02-planning': PLANNING,
  '03-architecture': ARCHITECTURE,
  '04-project-setup': SETUP,
  '05-development': DEVELOPMENT,
  '06-testing': TESTING,
  '07-code-review': CODE_REVIEW,
  '12-staging': STAGING,
  '13-production-deployment': PRODUCTION_DEPLOYMENT,
  '14-post-deployment-verification': POST_DEPLOYMENT_VERIFICATION,
}
