/**
 * Source: docs/03-architecture.md, "Defer aggressively".
 *
 * Extracted from `DeferredList.tsx` so the set can be checked without a
 * component harness, matching `scoring.ts`, `styles.ts` and `ai-plays.ts`.
 *
 * Seven entries, which is the doc's list. The port had six: CQRS was the one
 * missing, and it is a row here rather than a separate "named but not taught"
 * set, because that is what the doc makes it — an item that passes the deferral
 * test, deferred for a reason of its own.
 *
 * The closing claim — "each of these solves a real problem, none of them solves
 * a problem you have yet" — stays as the list's footer prose rather than
 * joining it as a row with nothing to expand.
 */

export type DeferredItem = {
  id: string
  name: string
  summary: string
  problem: string
  notYet: string
  costsToday: string
  /** Marks the item that fails the deferral test and therefore is not deferred. */
  failsTest?: boolean
}

export const DEFERRED_ITEMS: DeferredItem[] = [
  {
    id: 'caching',
    name: 'A caching layer',
    summary: 'Postgres is fast. Add it when you have a measured problem.',
    problem:
      'Serves reads without hitting the database every time, protecting a query path that has become slow or overloaded.',
    notYet:
      'At the load a new product actually sees, a plain query answers well inside any reasonable latency budget. There is no measured problem yet for a cache to solve.',
    costsToday:
      'An invalidation strategy to design and get wrong, a second place data can disagree with itself, and a new class of bug — “why is this showing the old value” — for a problem you have not measured.',
  },
  {
    id: 'queue',
    name: 'A queue',
    summary: 'Until something genuinely exceeds request time.',
    problem:
      'Runs work that would otherwise block a request past its execution limit, or separates a slow step from the caller waiting on it.',
    notYet:
      'Until a job actually exceeds request time, synchronous is simpler to write, trace, and debug end to end — there is nothing here yet for a queue to unblock.',
    costsToday:
      'A worker to deploy and monitor, retry and idempotency logic to get right, and a second system that can fail for reasons request/response never could.',
  },

  {
    id: 'multi-tenancy',
    name: 'Multi-tenancy: the axis, not the machinery',
    summary: 'The one item here that fails the test. Decide the axis now.',
    failsTest: true,
    problem:
      'Isolates each customer’s data and access so tenants never see or affect one another’s rows.',
    notYet:
      'Everything built on top of the axis can wait: invitations, per-tenant settings, roles, billing. None of it is stored data on every table, so none of it fails the test.',
    costsToday:
      'The axis itself cannot wait, and it is a single question — is the tenant a person or an organisation? Where data is genuinely shared across a team, user_id is not a lighter version of the right answer, it is the wrong axis: the rows belong to the organisation and the person is merely who touched them. Retrofitting org_id in place of user_id is a migration of every table plus every query that ever touched one.',
  },

  {
    id: 'event-sourcing',
    name: 'Event sourcing',
    summary: 'Almost certainly not — and an audit table is not it.',
    problem:
      'Stores every change as the source of truth and derives current state by replaying it, rather than storing the current state directly. Worth knowing the boundary, because people talk themselves into thinking they are already doing it: an audit table alongside normal rows is not event sourcing. It is event sourcing only when the log is the truth and the tables you query are derived from it. A history of who approved what is an ordinary table, and you should keep it.',
    notYet:
      'Almost no early product has an audit or replay requirement severe enough to justify the model before it has any state worth auditing.',
    costsToday:
      'Every read now replays or projects from a log instead of running a plain query — a complexity tax paid on day one, for an audit requirement that may never arrive.',
  },
  {
    id: 'cqrs',
    name: 'CQRS',
    summary: 'Separate models for writing and for reading.',
    problem:
      'Separates the model you write through from the model you read through, so each can be shaped for its own job instead of compromising between them.',
    notYet:
      'It travels with event sourcing and gets deferred for the same reason. One query against one model is almost always enough for a long time, and you will know when it stops being enough because a specific page will be slow.',
    costsToday:
      'Two models to keep aligned, and a second place the answer can be wrong — in exchange for read performance you have not yet been unable to get from a single query.',
  },
  {
    id: 'design-system',
    name: 'A design system',
    summary: 'A component library plus consistency is enough for a long time.',
    problem:
      'Gives a growing product and a growing team one visual language, enforced in code rather than kept in one person’s memory.',
    notYet:
      'A component library and a little discipline covers a solo product, or a small team, for a long time — there is no second designer’s opinion yet to reconcile.',
    costsToday:
      'Tokens, documentation, and a governance process, maintained for variations you are not yet building and a team that is not yet arguing about them.',
  },
  {
    id: 'feature-flags',
    name: 'Feature-flag infrastructure',
    summary: 'A config object is fine until it is not.',
    problem:
      'Ships code dark, rolls a change out gradually, and turns a bad release off without a redeploy.',
    notYet:
      'A config object with a boolean does the same job until you are shipping often enough, or to enough people, that a redeploy becomes the expensive part.',
    costsToday:
      'A flag service to run, flags someone has to remember to delete, and a second source of truth for what the running code is actually doing — paid before it has prevented a single incident.',
  },
]
