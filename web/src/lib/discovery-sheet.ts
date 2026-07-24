/**
 * Stage 01's worksheet shape, owned in one place.
 *
 * Stage 02 reads this sheet to carry a reader's discovery answers forward. That
 * makes the shape a contract between two stages rather than a component detail,
 * so it lives here and both import it — the alternative is a second copy that
 * drifts, which is the failure this project already tracks as TD-2 and TD-3.
 *
 * Reading is deliberately total: every failure mode returns the empty sheet
 * rather than throwing, because this runs during render.
 */

export type DiscoverySheet = {
  problem: string
  who: string
  today: string
  evidence: string
  severity: string
  success: string
  notThis: string
}

export const DISCOVERY_KEY = 'playbook:discovery-worksheet'

export const EMPTY_SHEET: DiscoverySheet = {
  problem: '',
  who: '',
  today: '',
  evidence: '',
  severity: '',
  success: '',
  notThis: '',
}

const FIELDS = Object.keys(EMPTY_SHEET) as (keyof DiscoverySheet)[]

/** Read-only. Stage 02 must never write to stage 01's key. */
export function readDiscoverySheet(): DiscoverySheet {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(DISCOVERY_KEY)
  } catch {
    return EMPTY_SHEET
  }
  if (raw === null) return EMPTY_SHEET

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return EMPTY_SHEET
  }
  if (typeof parsed !== 'object' || parsed === null) return EMPTY_SHEET

  const source = parsed as Record<string, unknown>
  const sheet = { ...EMPTY_SHEET }
  for (const field of FIELDS) {
    const v = source[field]
    if (typeof v === 'string') sheet[field] = v
  }
  return sheet
}
