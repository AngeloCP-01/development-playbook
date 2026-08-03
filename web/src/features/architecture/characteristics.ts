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
  {
    characteristicId: 'availability',
    forces:
      'A timeout on every external call, retries only where they are safe, and a decision about what still works when each dependency is down. That last one is graceful degradation, decided per feature; the first two are the vocabulary for producing it.',
    stepId: 'resilience',
    stepLabel: 'Resilience',
  },
  {
    characteristicId: 'scalability',
    forces:
      'Statelessness, so that more instances are an option at all, and a pooler between serverless functions and Postgres. The first is a property you have or do not; the second fails on connect rather than in anything you wrote.',
    stepId: 'shape',
    stepLabel: 'Shape',
  },
  {
    characteristicId: 'evolvability',
    forces:
      'Expand-contract for anything stored, and boundaries that make a later split mechanical rather than archaeological. Both are cheap to adopt now and expensive to retrofit under traffic.',
    stepId: 'evolve',
    stepLabel: 'Evolve',
  },
  {
    characteristicId: 'security',
    forces:
      'An authorization rule written per entity — often two patterns joined by an “and”, not one pattern chosen for the whole system. The singular framing is the one that produces cross-team privilege escalation.',
    stepId: 'access',
    stepLabel: 'Access',
  },
  {
    characteristicId: 'deployability',
    forces:
      'Migrations that are safe to run before the code that needs them, which is what makes a bad deploy a code rollback rather than a data loss.',
    stepId: 'evolve',
    stepLabel: 'Evolve',
  },
  {
    characteristicId: 'latency',
    forces:
      'Indexes traced to real queries rather than to intuition, and synchronous work kept off the request path. The first is written in the schema; the second is the sync/async fork.',
    stepId: 'indexes',
    stepLabel: 'Indexes',
  },
  {
    characteristicId: 'observability',
    forces:
      'Asynchronous work you can see the failures of, rather than only the successes. Choosing asynchronous buys a failure mode nobody is waiting on, and noticing it is 15 — Observability’s problem that starts here.',
    stepId: 'flow',
    stepLabel: 'Flow',
  },
]

/**
 * Source: docs/03-architecture.md, "What this system has to be".
 *
 * The doc's own framing, kept intact: a trace is a claim and claims rot, so the
 * sequence is choose → trace → write down how you would know it stopped being
 * true. The third step is a note in this stage and a test in 06, and the doc is
 * explicit about why — standing up an import-graph linter before the first
 * table is the infrastructure this stage spends a section refusing.
 *
 * Two exports because the framing renders in two places: the claim opens the
 * section in `Architecture.tsx`, the refusal closes `FitnessExamples`. It was
 * one constant rendered nowhere and hand-copied into both, which left the test
 * on it asserting a string no reader saw.
 *
 * The claim is split at its term rather than kept as one string: "fitness
 * function" renders as an inline `<Term>`, and splitting there is what lets the
 * sentence be single-sourced and still reach the glossary.
 */
export const FITNESS_FUNCTION_CLAIM = {
  lead: 'A characteristic that nothing checks is a characteristic you are hoping for. The name for the check is a',
  term: 'fitness function',
  rest: ': an automated test of a property of the system, rather than of what a function returns. The answers are more ordinary than the term suggests.',
} as const

export const FITNESS_FUNCTION_NOT_NOW =
  'Not now, though. You have no code yet, and standing up an import-graph linter before your first table is exactly the kind of infrastructure this stage spends a section refusing. What belongs in this stage is one line per characteristic in your notes: how would I know if this stopped being true? Writing the check is 06 — Testing’s, once there is something to check.'

export type FitnessExample = {
  id: string
  /** The characteristic it defends. Must be one the picker offers. */
  characteristicId: string
  what: string
  defends: string
}

/** Ordered cheapest first, which is the doc's own ordering and its point. */
export const FITNESS_EXAMPLES: FitnessExample[] = [
  {
    id: 'schema-constraint',
    characteristicId: 'correctness',
    what: 'A plain test asserting that the constraint carrying your correctness rule still exists.',
    defends:
      'Three lines, no tooling decision, and it catches a migration that quietly dropped it. The cheapest useful one, which is why it is first.',
  },
  {
    id: 'append-only-grant',
    characteristicId: 'auditability',
    what: 'A test asserting the application’s database role still has no UPDATE or DELETE grant on the append-only table.',
    defends:
      'Auditability, in the schema rather than in a convention. Revoke the grants once; the day somebody adds a path that rewrites history, this fails instead of the history quietly changing.',
  },
  {
    id: 'cost-is-not-a-test',
    characteristicId: 'cheap-to-run',
    what: 'Not a test — a calendar reminder to look at the bill once a month.',
    defends:
      'Cheap to run, honestly. The number lives on a bill and not in your repository, so there is nothing to assert. A characteristic whose check is “look at it deliberately” is still checked; one whose check is an assertion that cannot fail is not, and inventing the second is worse than admitting the first.',
  },
  {
    id: 'import-boundary',
    characteristicId: 'evolvability',
    what: 'A test that fails when one feature imports another feature’s internals.',
    defends:
      'The boundary rule enforced instead of agreed. Boundaries decay by exception, and an exception nobody sees is the whole failure mode.',
  },
  {
    id: 'build-size',
    characteristicId: 'latency',
    what: 'A build-size budget.',
    defends:
      'A performance characteristic against the dependency somebody adds in eight months, which is a decision made by whoever is closest to it rather than by you.',
  },
  {
    id: 'query-count',
    characteristicId: 'latency',
    what: 'A query-count assertion on a page that matters.',
    defends:
      'It is how an N+1 gets caught before a user finds it. The query count is a property of the system; no unit test of a function returns it.',
  },
]
