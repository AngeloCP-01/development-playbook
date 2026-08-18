import { architecturePatterns } from './architecture-patterns'
import { PLANNED } from './planned'
import type { Cheatsheet, CheatsheetGroup } from './types'

export type {
  Cheatsheet,
  CheatsheetGroup,
  Row,
  Section,
  Source,
  SourceImage,
} from './types'
export { CHEATSHEET_GROUPS, isDrawn } from './types'

export const CHEATSHEETS: Cheatsheet[] = [architecturePatterns, ...PLANNED]

export function cheatsheetBySlug(slug: string): Cheatsheet | undefined {
  return CHEATSHEETS.find((sheet) => sheet.slug === slug)
}

export function cheatsheetsByGroup(group: CheatsheetGroup): Cheatsheet[] {
  return CHEATSHEETS.filter((sheet) => sheet.group === group)
}

export function cheatsheetsForStage(stageSlug: string): Cheatsheet[] {
  return CHEATSHEETS.filter((sheet) => sheet.stage === stageSlug)
}
