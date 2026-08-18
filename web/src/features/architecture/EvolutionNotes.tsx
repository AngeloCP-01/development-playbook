import { RevealList } from '@/components/RevealList'
import { EVOLUTION_NOTES } from './evolve'

/**
 * Source: docs/03-architecture.md, "Evolve the schema safely".
 *
 * The four things the six-step sequence does not carry on its own, behind an
 * expand-to-reveal so the panel stays under D-52's four screens with the
 * teaching intact rather than trimmed.
 *
 * State, markup and semantics now live in `RevealList`; this file is the data
 * mapping and nothing else.
 */

export function EvolutionNotes() {
  return (
    <RevealList
      idPrefix="evolution"
      rows={EVOLUTION_NOTES.map((note) => ({
        id: note.id,
        title: note.title,
        summary: note.summary,
        body: <p className="text-sm leading-6 text-muted">{note.body}</p>,
      }))}
    />
  )
}
