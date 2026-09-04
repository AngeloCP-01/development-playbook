import type { ComponentType } from 'react'
import { ProductDiscovery } from './discovery/ProductDiscovery'
import { Planning } from './planning/Planning'
import { Architecture } from './architecture/Architecture'
import { Setup } from './setup/Setup'
import { Development } from './development/Development'
import { Testing } from './testing/Testing'
import { CodeReview } from './code-review/CodeReview'
import { Staging } from './staging/Staging'
import { ProductionDeployment } from './production-deployment/ProductionDeployment'
import { PostDeploymentVerification } from './post-deployment-verification/PostDeploymentVerification'

/**
 * Stage slug → interactive page body. A stage missing from this map renders the
 * "not written yet" placeholder, so adding a stage is a one-line change here.
 */
export const STAGE_CONTENT: Record<string, ComponentType> = {
  '01-product-discovery': ProductDiscovery,
  '02-planning': Planning,
  '03-architecture': Architecture,
  '04-project-setup': Setup,
  '05-development': Development,
  '06-testing': Testing,
  '07-code-review': CodeReview,
  '12-staging': Staging,
  '13-production-deployment': ProductionDeployment,
  '14-post-deployment-verification': PostDeploymentVerification,
}
