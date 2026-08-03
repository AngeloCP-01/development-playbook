/**
 * Source: docs/03-architecture.md, "Design the API contracts" and
 * "Authentication and authorization".
 *
 * A contract is a promise about shape, and its real cost is who you can force
 * to move when you break it — which is the same reversibility axis the stage
 * opens on, and why the decision belongs in this stage rather than in
 * implementation.
 */

export type ContractRow = {
  id: string
  contract: string
  cost: 'cheap' | 'expensive' | 'not-yours'
  why: string
}

export const CONTRACT_ROWS: ContractRow[] = [
  {
    id: 'internal',
    contract: 'An internal server action or function',
    cost: 'cheap',
    why: 'One codebase, and the compiler finds every caller. Most solo projects live almost entirely in this row, which is the argument for not building a public API until something needs one.',
  },
  {
    id: 'public',
    contract: 'A public API somebody else calls',
    cost: 'expensive',
    why: 'You do not know who depends on it and you cannot make them move. The mistake is not noticing the moment you have arrived here — a mobile client, a partner integration, an endpoint somebody found — because from then on the shape is a commitment.',
  },
  {
    id: 'webhook',
    contract: 'A webhook you receive',
    cost: 'not-yours',
    why: 'Somebody else owns the shape and you adapt. You inherit its delivery behaviour along with it: it will arrive twice eventually, and handling it has to be safe when it does. That is idempotency, worked through in the resilience step where the payment flow makes it concrete.',
  },
  {
    id: 'pull',
    contract: 'Data you pull or import',
    cost: 'not-yours',
    why: 'A nightly pull from somebody’s system, a CSV somebody uploads, an export you read on a schedule. They own the shape; you own the cadence — which is the opposite half of the webhook. Nobody will deliver it twice, so idempotency is not forced on you, but nobody will tell you when it changed either, so staleness is yours. Decide what happens when the source is late or malformed, because unlike a webhook there is no retry coming.',
  },
]

export type RouteAnswer = {
  id: string
  name: string
  example: string
  body: string
}

/**
 * The verb problem. Two workable answers, and picking either consistently
 * beats agonising — so this is a reveal rather than a scored exercise.
 */
export const ROUTE_ANSWERS: RouteAnswer[] = [
  {
    id: 'sub-resource',
    name: 'Treat the verb as a sub-resource',
    example: 'POST /claims/:id/approve',
    body: 'Keeps the noun in the path and reads naturally. The default answer, and the one that needs no argument.',
  },
  {
    id: 'verb-as-noun',
    name: 'Make the verb a noun',
    example: 'POST /approvals',
    body: 'An approval is a thing that happened, with an actor and a timestamp, and this may be closer to your real model than a status flip. Worth a moment’s thought rather than a reflex: if you would want to know later who approved what and when, the verb was an entity all along — and the interrogation in Model should have caught it.',
  },
]

export type ContractDecision = {
  id: string
  name: string
  body: string
}

export const CONTRACT_DECISIONS: ContractDecision[] = [
  {
    id: 'route-shape',
    name: 'Route shape',
    body: 'Resource-oriented (/invoices/:id) is the default, because it is predictable, and predictable is most of what a contract is worth. It stops being obvious the moment your operations are verbs rather than documents.',
  },
  {
    id: 'request-response',
    name: 'Request and response shape',
    body: 'Validate at the boundary: anything crossing into your system is untrusted, including data from your own frontend. What you return is a promise — adding a field is safe, removing or renaming one is not.',
  },
  {
    id: 'versioning',
    name: 'Versioning',
    body: 'Needed only for the expensive row, and the cheapest strategy is to avoid needing it: add fields, never remove them, never change the meaning of one that exists. When that stops being enough, version the route rather than the payload.',
  },
]

export type AuthzPattern = {
  id: string
  name: string
  question: string
  holdsFor: string
}

/**
 * The part people get wrong is not authentication but authorization, and the
 * mistake is assuming there is only one pattern.
 */
export const AUTHZ_PATTERNS: AuthzPattern[] = [
  {
    id: 'ownership',
    name: 'Ownership',
    question: 'Does this row carry the caller’s id?',
    holdsFor: 'A user’s own invoices, drafts, notes.',
  },
  {
    id: 'role',
    name: 'Role',
    question: 'Does this caller hold a role that grants the action?',
    holdsFor: 'A manager approving somebody else’s request.',
  },
  {
    id: 'membership',
    name: 'Membership',
    question: 'Do the caller and the row belong to the same group?',
    holdsFor: 'Anything with a shared workspace or team.',
  },
]

export type AuthzScenario = {
  id: string
  scenario: string
  /**
   * The pattern ids that must ALL hold. Usually one; two where the rule is a
   * conjunction, which the doc's authorization section teaches because the
   * partial rule does not error — it grants.
   */
  answer: string[]
  why: string
}

export const AUTHZ_SCENARIOS: AuthzScenario[] = [
  {
    id: 'own-draft',
    scenario: 'A freelancer edits their own draft invoice',
    answer: ['ownership'],
    why: 'The row carries their id, and nobody else has any business in it. This is the case that makes ownership feel general, because for a product where each person works on their own things it genuinely is.',
  },
  {
    id: 'approve-swap',
    scenario:
      'A manager approves a shift swap between two other people on a team they manage',
    answer: ['role', 'membership'],
    why: 'Two patterns, and this is the one scenario that needs both. The manager owns none of the three rows, so ownership is out and the grant has to come from their role — but role alone is true of every manager in the company, including one who manages a different team. Role without membership does not error, it approves: a Kitchen manager signing off a Front-of-House shift is a working feature and a privilege escalation at the same time.',
  },
  {
    id: 'shared-doc',
    scenario: 'Anyone on a team opens a document in their shared workspace',
    answer: ['membership'],
    why: 'No individual owns it and no special role is needed. The question is whether the caller and the row belong to the same group, which is a different query from both of the others — and the reason the memberships table exists.',
  },
  {
    id: 'own-feed',
    scenario: 'A user reads their own notification feed',
    answer: ['ownership'],
    why: 'Ownership again, and deliberately: it is the answer for two of these four because that is the honest ratio in most products. The lesson is not that ownership is wrong, it is that it is not the only one — and that a rule is written per entity, sometimes with two patterns joined by an “and”.',
  },
]

const SCENARIO_BY_ID = new Map(AUTHZ_SCENARIOS.map((s) => [s.id, s]))

/**
 * `answers[id]` is the set of pattern ids the reader chose. Unknown ids are
 * ignored, so stale storage cannot inflate a score.
 *
 * A conjunction is scored as a set, not a sequence: picking membership then role
 * is the same answer as role then membership. A subset is wrong, because the
 * whole point of the conjunction scenario is that the partial rule grants.
 */
export function scoreAuthz(answers: Record<string, string[]>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, choice] of Object.entries(answers)) {
    const scenario = SCENARIO_BY_ID.get(id)
    if (!scenario) continue
    answered += 1
    const chosen = new Set(choice)
    if (
      chosen.size === scenario.answer.length &&
      scenario.answer.every((a) => chosen.has(a))
    ) {
      correct += 1
    }
  }
  return { answered, correct }
}
