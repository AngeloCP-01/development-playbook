/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * Architecture characteristics — what most job descriptions call
 * non-functional requirements. Stage 02 settled what the system does; this is
 * the other half, what it has to be while doing it.
 *
 * The list is deliberately ten and the cap is deliberately four. They trade
 * against each other, and a system that is meant to be everything has been told
 * nothing, which is a system whose next hard call gets made by whoever is
 * closest to it.
 */

export type Characteristic = {
  id: string
  name: string
  /** What choosing it commits you to, rather than what the word means. */
  meaning: string
}

export const CHARACTERISTICS: Characteristic[] = [
  {
    id: 'availability',
    name: 'Availability',
    meaning:
      'The system is up when somebody reaches for it. Measured in nines, and each further nine costs roughly an order of magnitude more than the last.',
  },
  {
    id: 'correctness',
    name: 'Correctness',
    meaning:
      'The answer is the right one, and no two parts of the system disagree about the same fact.',
  },
  {
    id: 'auditability',
    name: 'Auditability',
    meaning:
      'You can reconstruct what happened, who did it and when — years later, for somebody who was not there.',
  },
  {
    id: 'latency',
    name: 'Latency',
    meaning:
      'The system answers fast enough that nobody notices waiting. Distinct from throughput, which is how much it answers at once.',
  },
  {
    id: 'scalability',
    name: 'Scalability',
    meaning:
      'Load can grow a long way before the design has to change shape. The one most often chosen on no evidence.',
  },
  {
    id: 'security',
    name: 'Security',
    meaning:
      'Only the people who should reach a thing can reach it, and you can demonstrate that rather than assert it.',
  },
  {
    id: 'cheap-to-run',
    name: 'Cheap to run',
    meaning:
      'The monthly bill stays proportionate to what the system is worth. For one person paying for it, this is a real constraint and not a preference.',
  },
  {
    id: 'deployability',
    name: 'Deployability',
    meaning:
      'A change reaches production quickly and safely, so shipping is routine rather than an event.',
  },
  {
    id: 'evolvability',
    name: 'Evolvability',
    meaning:
      'The next feature costs about what the last one did. This is the one that decays quietly, because nothing alerts when it does.',
  },
  {
    id: 'observability',
    name: 'Observability',
    meaning:
      'When something is wrong you can find out what, from outside, without shipping code to find out.',
  },
]

/** Why the cap exists. Every line here pulls against the others. */
export const TRADES: string[] = [
  'High availability costs money, and each further nine costs much more than the last.',
  'Strong auditability costs write throughput, because every change has to be recorded as well as made.',
  'Cheap to run costs both, which is why it is a characteristic and not a wish.',
]

export const MAX_PICKS = 4

/** The invoicing example's three. */
export const EXAMPLE_PICK: string[] = [
  'auditability',
  'correctness',
  'cheap-to-run',
]

export type Declined = {
  id: string
  because: string
}

/**
 * Declined out loud, because a characteristic you never considered is not the
 * same as one you rejected — and only the second is a decision.
 */
export const EXAMPLE_DECLINED: Declined[] = [
  {
    id: 'availability',
    because:
      'A few hours down is survivable. Nobody sends invoices at three in the morning, and the cost of the next nine buys nothing anybody would notice.',
  },
  {
    id: 'latency',
    because:
      'Nobody is in a hurry to look at an invoice. A page that answers in a second is indistinguishable, here, from one that answers in eighty milliseconds.',
  },
  {
    id: 'scalability',
    because:
      'There is no evidence of it. Inventing some is the trap this stage names twice, and designing for a number you made up is how the complexity arrives.',
  },
]

export type TraceRow = {
  characteristicId: string
  /** The decision this characteristic forces later in the stage. */
  forces: string
  /** The stepper step where that decision actually gets made. */
  stepId: string
  stepLabel: string
}

/**
 * The part that makes the section load-bearing rather than a vocabulary
 * exercise. Every row is a decision the stage makes anyway; choosing the
 * characteristic first is what turns it from a preference into something with a
 * reason attached.
 */
export const TRACE_ROWS: TraceRow[] = [
  {
    characteristicId: 'auditability',
    forces:
      'Soft delete over hard delete, and an immutable record of what was sent. Every query afterwards pays a filtering cost, which is the trade being bought here.',
    stepId: 'schema',
    stepLabel: 'Schema',
  },
  {
    characteristicId: 'correctness',
    forces:
      'Constraints in the database rather than the application, and money as integer cents rather than a float that cannot hold 0.10.',
    stepId: 'schema',
    stepLabel: 'Schema',
  },
  {
    characteristicId: 'cheap-to-run',
    forces:
      'One application and one database, with no queue until something demands one. It also rules out microservices, whose cost is paid per service regardless of load.',
    stepId: 'oneapp',
    stepLabel: 'One app',
  },
]
