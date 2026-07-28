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

export type InterrogationOption = {
  id: string
  label: string
}

export type Interrogation = {
  id: string
  /** The question, phrased as the doc phrases it. */
  question: string
  options: InterrogationOption[]
  /** The id of the defensible answer. */
  answer: string
  /** Shown whichever way the reader answered. The reasoning is the lesson. */
  why: string
}

/** Source: docs/03-architecture.md:58-76. */
export const INTERROGATIONS: Interrogation[] = [
  {
    id: 'overdue-status',
    question: 'Is “overdue” a status, or a computed value?',
    options: [
      { id: 'stored', label: 'A stored status, updated when it changes' },
      { id: 'computed', label: 'Computed from due_date and status' },
    ],
    answer: 'computed',
    why: 'Computed. If it is stored, something has to update it — a cron job, a trigger, a write on read — and the day that something misses a run, the column disagrees with the date it was derived from. Computed from due_date < now() AND status = ‘sent’, it is always correct and cannot drift. Storing derived state is one of the most common sources of data that disagrees with itself.',
  },
  {
    id: 'invoice-delete',
    question: 'What happens when an invoice is deleted?',
    options: [
      { id: 'hard', label: 'Remove the row' },
      { id: 'soft', label: 'Mark it deleted and keep the row' },
    ],
    answer: 'soft',
    why: 'Soft delete, or an immutable ledger. A hard delete loses history you may be legally required to keep; a soft delete keeps it at the cost of every query remembering to filter. For financial records that trade is worth making, because “where did that invoice go” is a much worse conversation than a slightly more complex query.',
  },
  {
    id: 'client-owners',
    question: 'Can a client belong to two users?',
    options: [
      { id: 'fk', label: 'No — a foreign key on the client' },
      { id: 'join', label: 'Yes, or plausibly later — a join table' },
    ],
    answer: 'join',
    why: 'If the answer is yes now, or plausibly yes later, the relationship is a join table rather than a foreign key. Retrofitting many-to-many onto a one-to-many is a migration plus every query that touched it. This is the one question here where the honest answer depends on your product — but the cost is asymmetric, and that asymmetry is the lesson.',
  },
  {
    id: 'number-uniqueness',
    question: 'Invoice numbers must be unique — in what scope?',
    options: [
      { id: 'global', label: 'Globally, across the whole table' },
      { id: 'per-owner', label: 'Per user' },
    ],
    answer: 'per-owner',
    why: 'Per user. Two freelancers both issuing invoice 001 is normal and correct; a global constraint makes the second one fail for no reason a user could understand. Getting uniqueness scope wrong surfaces months later as a confusing constraint violation, which is why it belongs in the schema as UNIQUE (owner_id, number) rather than in a validation function.',
  },
]

const INTERROGATION_BY_ID = new Map(INTERROGATIONS.map((q) => [q.id, q]))

export function judgeInterrogation(
  id: string,
  choice: string,
): { correct: boolean; why: string } {
  const question = INTERROGATION_BY_ID.get(id)
  if (!question) {
    return { correct: false, why: 'That question is no longer on the sheet.' }
  }
  return { correct: choice === question.answer, why: question.why }
}

export type SplitCandidate = {
  id: string
  label: string
  /** True when this is a concrete reason to split something out. */
  valid: boolean
  why: string
}

/**
 * Source: docs/03-architecture.md:116-123 for the four triggers, and :233-235
 * for the second non-reason.
 *
 * Six rather than the four-plus-one the spec proposed. A set where five of six
 * answers are yes can be scored without reading it; four and two cannot.
 */
export const SPLIT_CANDIDATES: SplitCandidate[] = [
  {
    id: 'execution-limit',
    label: 'A job routinely runs longer than the function execution limit',
    valid: true,
    why: 'A concrete limit you have hit, not one you expect to. This is what a queue and a worker are for, and the split is forced by the platform rather than chosen.',
  },
  {
    id: 'different-runtime',
    label: 'One piece genuinely needs a different runtime — Python for a model',
    valid: true,
    why: 'You cannot run two runtimes in one process, so the boundary already exists. Putting it behind HTTP acknowledges a split that reality made for you.',
  },
  {
    id: 'load-profile',
    label:
      'One component’s load profile is wildly different and provably expensive',
    valid: true,
    why: 'Note both halves: wildly different *and* provably expensive. Measured, not predicted. Without the measurement this is the imagined-scale trap wearing a costume.',
  },
  {
    id: 'compliance-boundary',
    label: 'A real compliance boundary requires isolation',
    valid: true,
    why: 'An external requirement with someone else’s signature on it. The cost of distribution is not optional here, which makes it one of the few cases where paying it early is correct.',
  },
  {
    id: 'will-scale-better',
    label: 'It will scale better',
    valid: false,
    why: 'The row this exercise exists for. It is a prediction, and usually a wrong one. Distribution solves problems you do not have — independent team scaling, independent deploy cadence — while charging you network failure modes and distributed debugging today.',
  },
  {
    id: 'codebase-tidier',
    label: 'The codebase is getting large and a service would be tidier',
    valid: false,
    why: 'Tidiness inside one application is what module boundaries are for, and they cost nothing at runtime. Reaching for a network call to enforce a boundary you could enforce with an import rule is every cost of distribution bought for an organisational benefit you cannot collect solo.',
  },
]

const SPLIT_BY_ID = new Map(SPLIT_CANDIDATES.map((c) => [c.id, c]))

/** `answers[id] === true` means the reader judged it a real reason to split. */
export function scoreSplit(answers: Record<string, boolean>): {
  answered: number
  correct: number
} {
  let answered = 0
  let correct = 0
  for (const [id, guess] of Object.entries(answers)) {
    const candidate = SPLIT_BY_ID.get(id)
    if (!candidate) continue
    answered += 1
    if (candidate.valid === guess) correct += 1
  }
  return { answered, correct }
}

export type SchemaLine = {
  id: string
  /** The line exactly as it appears in the DDL. */
  sql: string
  /** Indentation depth, so the component does not parse whitespace. */
  indent: 0 | 1
  /** What this line buys. Absent on structural lines with nothing to teach. */
  note?: string
}

/** Source: docs/03-architecture.md:81-97. */
export const SCHEMA_LINES: SchemaLine[] = [
  { id: 'open', sql: 'CREATE TABLE invoices (', indent: 0 },
  {
    id: 'pk',
    sql: 'id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
    note: 'A generated uuid rather than a sequence. Nothing about an invoice’s identity is guessable from it, and two databases can generate ids without coordinating.',
  },
  {
    id: 'owner-fk',
    sql: 'owner_id     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'ON DELETE RESTRICT is the load-bearing half. Deleting a user who has invoices fails loudly instead of quietly cascading financial history away. CASCADE here is one careless statement from destroying records you are legally required to keep.',
  },
  {
    id: 'client-fk',
    sql: 'client_id    uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'Same rule, same reason. Note that this is a foreign key, not a join table — which is the cardinality decision from the interrogation, written down where the database will hold you to it.',
  },
  {
    id: 'number',
    sql: 'number       text NOT NULL,',
    indent: 1,
    note: 'Text, not an integer. Invoice numbers acquire prefixes, years and dashes the moment a real person uses them, and none of that arithmetic is ever performed.',
  },
  {
    id: 'amount-cents',
    sql: 'amount_cents integer NOT NULL CHECK (amount_cents >= 0),',
    indent: 1,
    note: 'Money as integer cents. A float cannot represent 0.10 exactly, so totals drift by a cent in ways nobody can reproduce. The CHECK stops a negative amount at the door rather than in a validation function a script can bypass.',
  },
  { id: 'due-date', sql: 'due_date     date NOT NULL,', indent: 1 },
  {
    id: 'status-check',
    sql: "status       text NOT NULL CHECK (status IN ('draft','sent','paid')),",
    indent: 1,
    note: 'A fixed set of values, enforced where it cannot be bypassed. Note what is absent: “overdue”. It is computed from due_date and status, so it cannot drift out of agreement with the date it derives from.',
  },
  {
    id: 'created-at',
    sql: 'created_at   timestamptz NOT NULL DEFAULT now(),',
    indent: 1,
    note: 'timestamptz, not timestamp. The version without a time zone silently means “whatever the server thought local time was”, which stops being funny the first time you deploy to a different region.',
  },
  {
    id: 'unique-number',
    sql: 'UNIQUE (owner_id, number)',
    indent: 1,
    note: 'Uniqueness scoped per user, not globally. Two freelancers both issuing invoice 001 is normal; a global constraint would fail the second for no reason a user could understand.',
  },
  { id: 'close', sql: ');', indent: 0 },
]

export type BoundaryEdge = {
  id: string
  from: string
  to: string
  /** The call this edge represents, written the way the codebase would write it. */
  call: string
  legal: boolean
  why: string
}

/** Source: docs/03-architecture.md:130-142. */
export const BOUNDARY_MODULES = ['billing', 'clients', 'auth']

export const BOUNDARY_EDGES: BoundaryEdge[] = [
  {
    id: 'clients-calls-billing',
    from: 'clients',
    to: 'billing',
    call: 'billing.getInvoicesForClient(clientId)',
    legal: true,
    why: 'The rule, working. Clients needs invoice data and asks the module that owns it, through a function that module chose to export. Billing can change how invoices are stored tomorrow without clients noticing.',
  },
  {
    id: 'billing-calls-auth',
    from: 'billing',
    to: 'auth',
    call: 'auth.currentUser()',
    legal: true,
    why: 'Every module needs to know who is calling, and exactly one module owns that answer. A second place that decodes a session is a second place to get authorization wrong.',
  },
  {
    id: 'clients-queries-invoices',
    from: 'clients',
    to: 'billing',
    call: 'db.select().from(invoices).where(eq(invoices.clientId, id))',
    legal: false,
    why: 'The one move that turns a monolith into a ball of mud. It works, it is shorter, and it silently makes billing’s table part of clients’ public interface — so the next change to the invoice schema breaks a module that never mentioned invoices. Keeping this rule is what makes extracting a service later a mechanical job rather than an archaeology project.',
  },
]
