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

/** Source: docs/02-planning.md:76-85, judged by the test at :63-64 ("does the outcome fail without this?"). */
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

export type Slice = {
  id: string
  label: string
  size: 'S' | 'M' | 'L'
  endToEnd: boolean
  risky: boolean
  why: string
}

/** Source: docs/02-planning.md:114-120. */
export const SLICES: Slice[] = [
  {
    id: 'create-view',
    label: 'Create and view one invoice',
    size: 'M',
    endToEnd: true,
    risky: false,
    why: 'Touches schema, server and UI, so something works end to end on day one. Every later slice is a change to a running thing rather than a step toward a first one.',
  },
  {
    id: 'mark-paid',
    label: 'Mark it paid',
    size: 'S',
    endToEnd: false,
    risky: false,
    why: 'Closes the core loop. Small, because the hard part — the invoice existing — is already done.',
  },
  {
    id: 'overdue',
    label: 'List invoices with overdue highlight',
    size: 'S',
    endToEnd: false,
    risky: false,
    why: 'The actual value appears here. Worth reaching early, because it is the first slice a user would notice missing.',
  },
  {
    id: 'clients',
    label: 'Clients as first-class records',
    size: 'M',
    endToEnd: false,
    risky: false,
    why: 'The model deepens. Deferring it means invoices carry a client name as text for a while, which is survivable and teaches you what a client record actually needs.',
  },
  {
    id: 'payments',
    label: 'Accept card payments (third-party integration)',
    size: 'M',
    endToEnd: false,
    risky: true,
    why: 'The risky one, and the only slice here that can fail for reasons outside your control. If the payout model the provider supports does not match what you need, you want that news in week one — not week eight, with four slices built on the assumption. Early is not the same as first, though: putting it first costs you the end-to-end slice that makes everything after it demonstrable.',
  },
  {
    id: 'auth',
    label: 'Auth and multi-user',
    size: 'M',
    endToEnd: false,
    risky: false,
    why: 'Last in the doc’s own order, and not the risky slice — but note it appears in the plan’s Risks list, because the auth choice constrains the data model. That is a decision to make early in stage 03, not a slice to build early here. Deciding early and building late is a perfectly good answer.',
  },
]

export type OrderVerdict = {
  endToEndFirst: boolean
  riskEarly: boolean
  notes: string[]
}

/** Early means the first half of the plan, rounded down: index < ceil(n / 2). */
const RISK_EARLY_BEFORE = Math.ceil(SLICES.length / 2)

/**
 * Two independent rules, deliberately not collapsed into one score.
 *
 * A reader who opens with the risky slice satisfies the second and fails the
 * first — the right instinct applied in the wrong place. Collapsing them into
 * "3/6 correct" would hide exactly the mistake worth naming.
 */
export function scoreOrder(order: string[]): OrderVerdict {
  const notes: string[] = []
  const starter = SLICES.find((s) => s.endToEnd)
  const risky = SLICES.find((s) => s.risky)

  const endToEndFirst = order.length > 0 && order[0] === starter?.id
  if (!endToEndFirst) {
    notes.push(
      order.length === 0
        ? 'Nothing ordered yet. The first slice should be the one that makes something work end to end.'
        : `Your first slice does not work end to end. Start with “${starter?.label}” — until one slice touches schema, server and UI, nothing is demonstrable and nothing has taught you anything.`,
    )
  }

  const riskIndex = risky ? order.indexOf(risky.id) : -1
  const riskEarly = riskIndex !== -1 && riskIndex < RISK_EARLY_BEFORE

  if (!riskEarly) {
    notes.push(
      riskIndex === -1
        ? `“${risky?.label}” is unplaced. It is the slice most likely to invalidate the others, so it needs a position.`
        : `“${risky?.label}” carries the risk and you left it late. If the integration cannot do what you need, you want that in week one — not week eight, with everything before it built on the assumption.`,
    )
  }

  if (endToEndFirst && riskEarly && notes.length === 0) {
    notes.push(
      'Both rules satisfied: something demonstrable first, and the slice that could invalidate the plan scheduled while changing course is still cheap.',
    )
  }

  return { endToEndFirst, riskEarly, notes }
}

export type Horizon = 'now' | 'next' | 'later'

export type HorizonItem = {
  id: string
  label: string
  best: Horizon
  /** A second placement a thoughtful reader could defend. Judgment, not a quiz. */
  alsoDefensible?: Horizon
  why: string
}

export const HORIZON_ITEMS: HorizonItem[] = [
  {
    id: 'overdue-highlight',
    label: 'Highlight which invoices are overdue',
    best: 'now',
    why: 'It is the definition of done. Anything the done statement names is Now by construction — that is what makes the statement useful.',
  },
  {
    id: 'recurring',
    label: 'Recurring invoices',
    best: 'next',
    why: 'Waiting on evidence: a user billing the same client three months running. That is a trigger you can actually observe, which is what makes it Next rather than Later.',
  },
  {
    id: 'pdf-export',
    label: 'PDF export',
    best: 'next',
    alsoDefensible: 'later',
    why: 'Next if you expect the request quickly — the trigger is "someone asks twice". Later is defensible if nothing about your audience suggests they need a file at all; the honest answer depends on what discovery told you.',
  },
  {
    id: 'accountant-handoff',
    label: 'A year-end export your accountant can use',
    best: 'later',
    alsoDefensible: 'next',
    why: 'Later, because it points at the product this becomes rather than at v1. Defensible as Next if your audience is close enough to a tax deadline that the first January decides whether they keep using it.',
  },
  {
    id: 'become-accounting-tool',
    label: 'Full expense tracking and bookkeeping',
    best: 'later',
    why: 'This is the one to be careful with. Stage 01 wrote “not an accounting tool” under what this is NOT — so putting it anywhere but Later contradicts a decision made when you were thinking clearly. Later is where you record that you know the pull exists.',
  },
  {
    id: 'dark-mode',
    label: 'Dark mode',
    best: 'later',
    why: 'Nothing triggers it and nothing depends on it, which is the definition of Later. It gets built anyway, usually on a Friday.',
  },
]

const HORIZON_BY_ID = new Map(HORIZON_ITEMS.map((i) => [i.id, i]))

const HORIZON_LABEL: Record<Horizon, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
}

export function judgeHorizon(
  id: string,
  choice: Horizon,
): { verdict: 'best' | 'defensible' | 'off'; why: string } {
  const item = HORIZON_BY_ID.get(id)
  if (!item) {
    return { verdict: 'off', why: 'That item is no longer on the board.' }
  }
  if (choice === item.best) return { verdict: 'best', why: item.why }
  if (choice === item.alsoDefensible) {
    return { verdict: 'defensible', why: item.why }
  }
  return {
    verdict: 'off',
    why: `${HORIZON_LABEL[item.best]} fits better here. ${item.why}`,
  }
}
