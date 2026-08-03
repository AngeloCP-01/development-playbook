/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * G6, partially closed once and open across three cold-reader runs. The DDL
 * shows `deleted_at` and the trace row names its cost; what was missing is the
 * choice between the three mechanics, and the half that bites — a filter every
 * query must remember is one some query will forget.
 */

export type SoftDeleteMechanic = {
  id: 'column' | 'status' | 'archive-table'
  name: string
  /** One line, read collapsed. Names the trade, not the mechanism. */
  summary: string
  what: string
  useWhen: string
  /** Every one of the three has a case where it is the wrong reach. */
  wrongWhen: string
  isDefault?: boolean
}

export const SOFT_DELETE_MECHANICS: SoftDeleteMechanic[] = [
  {
    id: 'column',
    name: 'A nullable timestamp',
    summary: 'Records when, not just that. The one to reach for.',
    isDefault: true,
    what: 'A deleted_at column: null means live, a timestamp means gone-but-answerable. It records when, which is what auditability actually asked for, and it stays out of the way of every other column.',
    useWhen:
      'Almost always. It is the default because it answers the audit question without taking anything else away, and because adding it costs one nullable column.',
    wrongWhen:
      'The table is large enough that carrying dead rows is the problem you actually have. At that point you are managing volume, not history, and an archive table is the honest answer.',
  },
  {
    id: 'status',
    name: 'A status enum with a deleted member',
    summary: 'One column, two questions — and the row can only answer one.',
    what: 'The lifecycle column the row already has — draft, sent, paid — gains a deleted value, so one column answers both questions.',
    useWhen:
      'Where deletion genuinely is a lifecycle state and nothing else about the row survives it. Rare, and worth being suspicious of when it seems to apply.',
    wrongWhen:
      'Almost always, and for a reason worth stating: it conflates a lifecycle the row already has with whether the row exists at all. A row can only be one thing at a time, so “deleted, and previously paid” stops being expressible — and that is exactly the sentence an audit asks you for.',
  },
  {
    id: 'archive-table',
    name: 'An archive table',
    summary: 'For volume, not for history. It relocates the filter.',
    what: 'Deleted rows move to a table of their own, so the live table holds only live rows.',
    useWhen:
      'Volume is the problem rather than history: the live table is big enough that dead rows cost you on every scan, and you still have to keep them.',
    wrongWhen:
      'You reached for it to solve the filtering problem. It does not — it relocates it, and it costs you every query that wants both live and deleted rows, which is most of the audit queries you added it for.',
  },
]

/**
 * The half the doc skipped: a filter everyone must remember is one someone
 * forgets. The answer is structural rather than cultural, which is why the
 * rule names discipline and rejects it.
 */
export const FILTER_RULE =
  'Every read now needs WHERE deleted_at IS NULL, and a filter that every query has to remember is one that some query will forget — usually a report, months later, quietly counting rows nobody deleted on purpose. Discipline is not the mechanism. Put the filter somewhere structural: a view the application reads instead of the table, or a single accessor every query goes through. Which of those is a codebase decision and belongs in 05 — Development; that the filter cannot be optional is this stage’s, because it follows from the column.'
