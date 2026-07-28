/**
 * The judgment logic for stage 03, kept out of the components.
 *
 * These are the decisions the stage teaches — what is expensive to undo, what
 * the domain model must answer, and when splitting a service out is justified.
 * Keeping them as pure functions means they can be tested without a component
 * harness, which this project does not have.
 */

export type Decision = {
  id: string
  label: string
  /** True when the decision is expensive to reverse. */
  expensive: boolean
  /** What undoing it actually costs. The axis the exercise is about. */
  undo: string
  /** Marks a row a thoughtful reader could get wrong for good reasons. */
  arguable?: boolean
  why: string
}

/** Source: docs/03-architecture.md:22-42. "How expensive is this to undo?" */
export const DECISIONS: Decision[] = [
  {
    id: 'component-library',
    label: 'Which component library the UI uses',
    expensive: false,
    undo: 'An afternoon, plus whatever you had customised.',
    why: 'Components are leaves. Nothing else in the system knows which one you picked, so replacing them touches only the files that render.',
  },
  {
    id: 'folder-names',
    label: 'What the folders are called',
    expensive: false,
    undo: 'A rename. The editor does it.',
    why: 'The clearest cheap decision on the list, and the one most likely to absorb an afternoon of deliberation anyway. That is the failure the stage names: agonising over folder structure while the data model gets ten minutes.',
  },
  {
    id: 'logging-library',
    label: 'Which logging library you call',
    expensive: false,
    undo: 'A find-and-replace, or an afternoon if you never wrapped it.',
    arguable: true,
    why: 'This one feels expensive because the calls are everywhere, and “everywhere” is a real signal for most decisions. It is the exception: log calls are write-only and nothing reads them back, so swapping the library behind a thin wrapper is mechanical. Compare it to the data model, where “everywhere” means every query depends on the shape.',
  },
  {
    id: 'auth-strategy',
    label: 'Where user identity lives',
    expensive: true,
    undo: 'A migration of every user record, plus a rewrite of every access check.',
    why: 'It touches the data model, every route and every query. This is the decision the stage tells you to make deliberately and write an ADR for, because retrofitting it means touching everything.',
  },
  {
    id: 'invoice-delete',
    label: 'Whether deleting an invoice is soft or hard',
    expensive: true,
    undo: 'You cannot undo a hard delete. The records are gone.',
    why: 'The only decision here whose reversal is not merely expensive but impossible. Choosing hard delete and changing your mind leaves nothing to migrate — which is why financial records want soft delete or an immutable ledger.',
  },
  {
    id: 'money-cents',
    label: 'Storing money as integer cents rather than a decimal',
    expensive: true,
    arguable: true,
    undo: 'A migration of every stored amount, every total, and every rounding decision that depended on the old type.',
    why: 'This reads like a formatting detail, which is exactly why it is on the list. It is stored data other things read, so it fits the stage’s own test for expensive. Getting it wrong surfaces as totals that are off by a cent, months later, in a way nobody can reproduce.',
  },
]

const BY_ID = new Map(DECISIONS.map((d) => [d.id, d]))

/** `answers[id] === true` means the reader judged it expensive. Unknown ids are ignored. */
export function scoreReversibility(answers: Record<string, boolean>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, guess] of Object.entries(answers)) {
    const decision = BY_ID.get(id)
    if (!decision) continue
    answered += 1
    if (decision.expensive === guess) correct += 1
  }
  return { answered, correct }
}
