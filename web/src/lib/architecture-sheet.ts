/**
 * Stage 03's worksheet shape, owned in one place.
 *
 * The four content fields are the doc's four interrogation questions
 * (docs/03-architecture.md, "Model the domain first") in the order it asks them. The fifth
 * accumulates the decisions that need an ADR, which is where stage 02's risks
 * land when the reader carries them forward.
 *
 * Reading is deliberately total: every failure mode returns the empty sheet
 * rather than throwing, because this runs during render.
 */

export type DomainSheet = {
  /** Nouns and relationships, before tables. */
  entities: string
  /** Values computed rather than stored. */
  derived: string
  /** What happens on delete, per entity. */
  deletion: string
  /** What must be unique, and in what scope. */
  uniqueness: string
  /** Expensive decisions that need an ADR. */
  decisions: string
}

export const ARCHITECTURE_KEY = 'playbook:architecture-worksheet'

export const EMPTY_DOMAIN: DomainSheet = {
  entities: '',
  derived: '',
  deletion: '',
  uniqueness: '',
  decisions: '',
}

const FIELDS = Object.keys(EMPTY_DOMAIN) as (keyof DomainSheet)[]

export function readDomainSheet(): DomainSheet {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(ARCHITECTURE_KEY)
  } catch {
    return EMPTY_DOMAIN
  }
  if (raw === null) return EMPTY_DOMAIN

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return EMPTY_DOMAIN
  }
  if (typeof parsed !== 'object' || parsed === null) return EMPTY_DOMAIN

  const source = parsed as Record<string, unknown>
  const sheet = { ...EMPTY_DOMAIN }
  for (const field of FIELDS) {
    const v = source[field]
    if (typeof v === 'string') sheet[field] = v
  }
  return sheet
}
