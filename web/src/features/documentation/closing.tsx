import { RevealList } from '@/components/RevealList'
import { Section } from '@/components/ui'
export const TRAPS = [
  {
    id: 'late',
    title: 'Documentation waits until the end',
    detail: 'Record the reason and evidence with the change.',
  },
  {
    id: 'why-only',
    title: 'The why-only rule hides usable instructions',
    detail:
      'Setup instructions and exact reference facts answer legitimate reader needs. Keep comment advice scoped to comments.',
  },
  {
    id: 'templates',
    title: 'Every template becomes mandatory',
    detail:
      'Choose artifacts for real readers and tasks; maintain the smallest set that works.',
  },
  {
    id: 'history',
    title: 'Cleaning instructions deletes decision history',
    detail:
      'Preserve the record and expose its replacement. Retire misleading current procedures separately.',
  },
  {
    id: 'generation',
    title: 'Generated output looks automatically correct',
    detail:
      'Inspect the source and expected output diff; check behavior where the claim depends on behavior.',
  },
  {
    id: 'claims',
    title: 'Template infrastructure and test claims survive copying',
    detail:
      'Replace sample assertions with project facts and observed evidence.',
  },
  {
    id: 'privacy',
    title: 'Realistic examples disclose private data',
    detail: 'Use synthetic data and review the result before publication.',
  },
  {
    id: 'evidence',
    title: 'A successful-looking draft stands in for validation',
    detail:
      'Find the evidence behind each operational claim; record what remains unknown.',
  },
] as const
export function TrapsPanel() {
  return (
    <Section title="Spot documentation traps">
      <RevealList
        idPrefix="documentation-traps"
        rows={TRAPS.map((trap) => ({
          id: trap.id,
          title: <span className="t-ui font-medium">{trap.title}</span>,
          body: <p>{trap.detail}</p>,
        }))}
      />
    </Section>
  )
}
