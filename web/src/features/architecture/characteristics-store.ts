/**
 * The reader's own characteristics, kept in one place.
 *
 * A separate key from the domain worksheet (`lib/architecture-sheet.ts`) rather
 * than a sixth field on it: the worksheet is a document the reader exports, and
 * this is a selection two steps of the stage read. Widening the worksheet's
 * shape for it would change what "the artifact" means.
 */

export const CHARACTERISTICS_KEY = 'playbook:architecture-characteristics'

/** Stable reference: this is the server snapshot for useSyncExternalStore. */
export const NO_PICKS: string[] = []

/**
 * Toggle one id, refusing to exceed `max`.
 *
 * Refusing rather than evicting the oldest pick is deliberate. An eviction
 * would let the reader keep clicking and never meet the cap, which is the one
 * thing this exercise is trying to teach: they trade against each other.
 */
export function togglePick(picks: string[], id: string, max: number): string[] {
  if (picks.includes(id)) return picks.filter((p) => p !== id)
  if (picks.length >= max) return picks
  return [...picks, id]
}
