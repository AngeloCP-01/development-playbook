import { apiDesign } from './api-design'
import { awsDeployment } from './aws-deployment'
import { caching } from './caching'
import { scaling } from './scaling'
import { codeReview } from './code-review'
import { architecturePatterns } from './architecture-patterns'
import { ciCd } from './ci-cd'
import { cleanCode } from './clean-code'
import { codingStandards } from './coding-standards'
import { deploymentEnvironments } from './deployment-environments'
import { documentation } from './documentation'
import { designPatterns } from './design-patterns'
import { gitBranching } from './git-branching'
import { gitCheatsheet } from './git-cheatsheet'
import { gitCommands } from './git-commands'
import { githubActions } from './github-actions'
import { incidentManagement } from './incident-management'
import { PLANNED } from './planned'
import { postDeployVerification } from './post-deploy-verification'
import { playwright } from './playwright'
import { sdlc } from './sdlc'
import { security } from './security'
import { solidPrinciples } from './solid-principles'
import { testing } from './testing'
import type { Cheatsheet, CheatsheetGroup } from './types'

export type {
  Cheatsheet,
  CheatsheetGroup,
  Row,
  RowExample,
  Section,
  Source,
  SourceCitation,
  SourceImage,
} from './types'
export { CHEATSHEET_GROUPS, isDrawn } from './types'

export const CHEATSHEETS: Cheatsheet[] = [
  architecturePatterns,
  designPatterns,
  apiDesign,
  solidPrinciples,
  cleanCode,
  gitCheatsheet,
  gitCommands,
  gitBranching,
  codingStandards,
  documentation,
  sdlc,
  testing,
  playwright,
  codeReview,
  deploymentEnvironments,
  awsDeployment,
  postDeployVerification,
  ciCd,
  githubActions,
  incidentManagement,
  security,
  caching,
  scaling,
  ...PLANNED,
]

export function cheatsheetBySlug(slug: string): Cheatsheet | undefined {
  return CHEATSHEETS.find((sheet) => sheet.slug === slug)
}

export function cheatsheetsByGroup(group: CheatsheetGroup): Cheatsheet[] {
  return CHEATSHEETS.filter((sheet) => sheet.group === group)
}

export function cheatsheetsForStage(stageSlug: string): Cheatsheet[] {
  return CHEATSHEETS.filter((sheet) => sheet.stage === stageSlug)
}
