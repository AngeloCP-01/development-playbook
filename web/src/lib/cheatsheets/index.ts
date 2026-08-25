import { apiDesign } from './api-design'
import { architecturePatterns } from './architecture-patterns'
import { cleanCode } from './clean-code'
import { codingStandards } from './coding-standards'
import { designPatterns } from './design-patterns'
import { gitBranching } from './git-branching'
import { gitCommands } from './git-commands'
import { PLANNED } from './planned'
import { sdlc } from './sdlc'
import { solidPrinciples } from './solid-principles'
import type { Cheatsheet, CheatsheetGroup } from './types'

export type {
  Cheatsheet,
  CheatsheetGroup,
  Row,
  RowExample,
  Section,
  Source,
  SourceImage,
} from './types'
export { CHEATSHEET_GROUPS, isDrawn } from './types'

export const CHEATSHEETS: Cheatsheet[] = [
  architecturePatterns,
  designPatterns,
  apiDesign,
  solidPrinciples,
  cleanCode,
  gitCommands,
  gitBranching,
  codingStandards,
  sdlc,
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
