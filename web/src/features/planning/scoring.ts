/**
 * The judgment logic for stage 02, kept out of the components.
 *
 * These are the decisions the stage teaches — what survives the cut, what order
 * slices go in, which horizon an item belongs to. Keeping them as pure functions
 * means they can be tested without a component harness, which this project does
 * not have.
 */

export type CutFeature = {
  id: string
  label: string
  core: boolean
  why: string
}

/** Source: docs/02-planning.md:39-48. "Does the definition of done fail without this?" */
export const CUT_FEATURES: CutFeature[] = [
  {
    id: 'create-invoice',
    label: 'Create an invoice',
    core: true,
    why: 'The definition of done says a freelancer can issue an invoice. Without this there is no product, only a database.',
  },
  {
    id: 'mark-paid',
    label: 'Mark it paid',
    core: true,
    why: 'Without it every invoice stays open forever and the overdue list — the actual value — is noise within a week.',
  },
  {
    id: 'overdue-list',
    label: 'See overdue invoices',
    core: true,
    why: 'This is the outcome the whole thing exists for. Cut it and you have built a worse spreadsheet.',
  },
  {
    id: 'email-reminders',
    label: 'Email reminders',
    core: false,
    why: 'The user can send the email. Automating it adds a sending domain, deliverability, bounce handling and an unsubscribe path — a lot of surface for a step that currently takes thirty seconds.',
  },
  {
    id: 'pdf-export',
    label: 'PDF export',
    core: false,
    why: 'Version two. It feels essential because invoices are paper-shaped, but nothing in the definition of done requires a file.',
  },
  {
    id: 'multi-currency',
    label: 'Multi-currency',
    core: false,
    why: 'Until someone asks. Currency touches every stored amount, every total and every rounding decision, so adding it later is genuinely expensive — which is an argument for knowing you need it, not for guessing.',
  },
  {
    id: 'team-accounts',
    label: 'Team accounts',
    core: false,
    why: 'The audience is solo freelancers. Building for a team you do not have means designing permissions around imaginary people.',
  },
  {
    id: 'dark-mode',
    label: 'Dark mode',
    core: false,
    why: 'The clearest no on the list, and the one most likely to get built anyway because it is enjoyable to build.',
  },
]

const BY_ID = new Map(CUT_FEATURES.map((f) => [f.id, f]))

/** `answers[id] === true` means the reader judged it core. Unknown ids are ignored. */
export function scoreCut(answers: Record<string, boolean>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, guess] of Object.entries(answers)) {
    const feature = BY_ID.get(id)
    if (!feature) continue
    answered += 1
    if (feature.core === guess) correct += 1
  }
  return { answered, correct }
}
