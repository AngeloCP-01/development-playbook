/**
 * Source: docs/03-architecture.md, "Design the database" — its "Transactions,
 * isolation and locking" subsection.
 *
 * The section's shape, which this file preserves: a transaction is a boundary
 * you draw, an isolation level only relates a read and a write inside one, and
 * the two standard fixes for the lost update both work by carrying something
 * *across* two transactions rather than tightening either one. Then the trap —
 * neither lock protects a rule that spans rows.
 */

export type LockingStrategy = {
  id: 'optimistic' | 'pessimistic'
  name: string
  how: string
  useWhen: string
  /** The case where this choice is actively wrong. */
  wrongWhen: string
  note?: string
  /** The statement that carries it, quoted rather than described. */
  sql: string
}

export const LOCKING_STRATEGIES: LockingStrategy[] = [
  {
    id: 'optimistic',
    name: 'Optimistic locking',
    how: 'Put a version on the row and carry it into the write. Zero rows updated means somebody got there first, so you tell the user instead of losing their work — as does an update against a row somebody deleted, which is worth distinguishing if the message differs.',
    useWhen:
      'Conflict is rare. For anything with a human deciding in the middle, that is almost always the case.',
    wrongWhen:
      'Conflict is expected rather than rare. Then every writer but one does their work and is told to start again, and you have built a queue out of retries.',
    note: 'Note what this is: version is stored data, so by the test at the top of this stage it is decide-now. Adding it later is an expand-contract sequence rather than an afternoon.',
    sql: "UPDATE claims SET status = 'approved', version = version + 1\n WHERE id = $1 AND version = $2;",
  },
  {
    id: 'pessimistic',
    name: 'Pessimistic locking',
    how: 'Take the lock as you read, inside the transaction, and the second reader waits until you commit.',
    useWhen:
      'Conflict is likely and the work between the read and the write is short.',
    wrongWhen:
      'The work waits on a person. You are holding a lock while somebody reads their email — and two transactions taking rows in different orders will deadlock.',
    sql: 'SELECT * FROM claims WHERE id = $1 FOR UPDATE;',
  },
]

export type IsolationLevel = {
  id: 'read-committed' | 'serializable'
  name: string
  sees: string
  /** What it cannot relate, which is the limit that matters here. */
  cannot: string
  costs: string
  isDefault?: boolean
}

export const ISOLATION_LEVELS: IsolationLevel[] = [
  {
    id: 'read-committed',
    name: 'Read committed',
    sees: 'Never an uncommitted row, and yes to rows other transactions commit while yours is still running.',
    cannot:
      'Relate anything to a read that happened in an earlier transaction — which is every read a person looked at before clicking.',
    costs: 'Nothing. It is what you are already running.',
    isDefault: true,
  },
  {
    id: 'serializable',
    name: 'Serializable',
    sees: 'The same result as if the transactions had run one at a time, and an abort when the database cannot guarantee that.',
    cannot:
      'See a relationship between two separate transactions with a human in the gap, because there is nothing in either one to relate.',
    costs:
      'A retry path your code did not previously need, on every transaction that can abort.',
  },
]

export type MechanismId =
  'optimistic' | 'pessimistic' | 'serializable' | 'constraint'

export type Mechanism = {
  id: MechanismId
  label: string
}

/**
 * The four things a reader could reach for. `serializable` is on the list and
 * is never what a case answers with, which is a narrower claim than "it would
 * not work": Postgres's SSI really would abort one of the two writers in the
 * hot-row case, and in the cross-row case too where the transaction performs
 * the check the doc describes. What it does not do is any of it for free, or at
 * all against a writer that never performs the read.
 *
 * It is offered because the doc calls believing it handles the next problem "a
 * specific and comfortable way to ship it anyway", and an exercise that does
 * not offer the comfortable answer cannot catch anyone holding it. Each case
 * says why it is not the tool rather than leaving the reader marked wrong and
 * told nothing.
 */
export const MECHANISMS: Mechanism[] = [
  { id: 'optimistic', label: 'Optimistic locking' },
  { id: 'pessimistic', label: 'SELECT … FOR UPDATE' },
  { id: 'serializable', label: 'SERIALIZABLE isolation' },
  { id: 'constraint', label: 'A partial unique index' },
]

export type ConcurrencyCase = {
  id: string
  scenario: string
  answer: MechanismId
  /** Shown whichever way the reader answered. The reasoning is the lesson. */
  why: string
}

export const CONCURRENCY_CASES: ConcurrencyCase[] = [
  {
    id: 'human-gap',
    scenario:
      'Two managers open the same claim. Both see it as pending. One approves; a minute later, after reading it properly, so does the other.',
    answer: 'optimistic',
    why: 'The lost update: the second write silently overwrites the first, no constraint was violated, and nothing records that a decision was discarded. No isolation level catches this, serializable included — page load and click are two separate transactions with a person in the gap, and an isolation level can only relate a read and a write inside the same one. A version carried across both is what notices.',
  },
  {
    id: 'hot-row',
    scenario:
      'Two checkout requests reach the same inventory row in the same moment. Each reads the count, subtracts one, and writes it back, a few milliseconds apart, with nobody deciding anything in between.',
    answer: 'pessimistic',
    why: 'Conflict is likely rather than rare, the gap between the read and the write is short, and there is no person in it — the shape pessimistic locking is for. SELECT … FOR UPDATE makes the second request wait for the first to commit and then re-read that row, so it subtracts from the count that is actually there. Optimistic locking is also correct here and would turn most of those collisions into a rejected write the caller has to retry, which is the whole of the rule: optimistic when conflict is rare, pessimistic when it is expected. A stricter isolation level would also abort one of the two, and you would still be writing the retry path a lock has just saved you.',
  },
  {
    id: 'cross-row',
    scenario:
      'Two managers approve two different claims on the same shift. The shift is only allowed one approved claim.',
    answer: 'constraint',
    why: 'Neither lock helps: they are different rows, both versions match, both writes succeed, and the version column is silent because nothing about either row changed underneath it. A rule that spans rows needs a constraint, not a lock — here the partial unique index the stage has already built. A stricter isolation level is not the answer either, for a reason worth keeping: it can only relate transactions that actually perform the read, so a script or an endpoint that inserts without checking first walks straight past it. A constraint holds no matter who writes. Then handle its failure: a violation arrives as a database error rather than as zero rows updated, so catch it by constraint name and turn it into the message the optimistic path would have produced. Left uncaught it is a 500 served to a manager who did nothing wrong.',
  },
]

export function scoreConcurrency(answers: Record<string, string>): {
  answered: number
  correct: number
} {
  const entries = Object.entries(answers)
  return {
    answered: entries.length,
    correct: entries.filter(
      ([id, guess]) =>
        CONCURRENCY_CASES.find((c) => c.id === id)?.answer === guess,
    ).length,
  }
}
