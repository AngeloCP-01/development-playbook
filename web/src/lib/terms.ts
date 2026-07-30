/**
 * Jargon defined once, at the point of use.
 *
 * The playbook doubles as a primer, so a term you have never met should never
 * be a dead end. Definitions are written for someone encountering the idea for
 * the first time — plain language, no forward references, and a note on why it
 * matters rather than only what it is.
 */
export type Term = {
  /** Display heading for the generated glossary, e.g. 'ADR (Architecture Decision Record)'. */
  name: string
  short: string
  full: string
  /** Why a practitioner should care — the part a dictionary would omit. */
  soWhat?: string
  /** A stage slug this term is most associated with, for the glossary's "See" link. */
  see?: string
}

export const TERMS: Record<string, Term> = {
  'product-discovery': {
    name: 'Product discovery',
    see: '01-product-discovery',
    short:
      'Finding out whether something is worth building before you build it.',
    full: 'The work of testing whether a problem is real, whose it is, and how badly it hurts — before any code exists. It is deliberately cheap, because its main output is often the decision not to build.',
    soWhat:
      'Skipping it is the most expensive mistake available to a developer: months spent building something correct that nobody needed.',
  },
  'opportunity-solution-tree': {
    name: 'Opportunity solution tree',
    see: '01-product-discovery',
    short:
      'A map linking one outcome to problems, then to candidate solutions.',
    full: 'A diagram by Teresa Torres with four levels: the outcome you want to move, the customer opportunities (problems, needs, desires) that could move it, the solutions that address each opportunity, and the experiments that test each solution.',
    soWhat:
      'It enforces one rule that is hard to keep otherwise: no solution may exist without an opportunity above it, and no opportunity without evidence someone actually said it.',
  },
  'jobs-to-be-done': {
    name: 'Jobs to be done (JTBD)',
    short: 'The progress a person is trying to make, not their demographics.',
    full: 'A framing that describes users by the job they are "hiring" a product to do — "help me look organised to my clients" — rather than by who they are. Two people with nothing demographically in common can share a job.',
    soWhat:
      'It stops you designing for a persona and starts you designing for a situation, which is what actually predicts whether someone switches tools.',
  },
  'concierge-test': {
    name: 'Concierge test',
    short: 'Deliver the outcome by hand before building anything.',
    full: 'You do the work manually for a handful of real users — spreadsheets, emails, your own labour — while they experience the result as if it were a product.',
    soWhat:
      'It reveals where the genuine difficulty sits, which is almost never where you assumed. Many products are worth running by hand for a month first.',
  },
  'fake-door-test': {
    name: 'Fake-door test',
    short: 'A landing page for a product that does not exist yet.',
    full: 'A page describing the product with a real signup or purchase button. Clicking it reaches a "coming soon" message. You measure how many people click.',
    soWhat:
      'It measures behaviour rather than politeness. Saying "that sounds useful" is free; handing over an email address is not.',
  },
  'survivorship-bias': {
    name: 'Survivorship bias',
    short: 'Only hearing from the people who stayed.',
    full: 'Drawing conclusions from the visible survivors of a process while the failures are silent. In discovery: interviewing current users tells you why people stay, never why the larger group left or never arrived.',
    soWhat:
      'Your happiest users are the worst guide to why nobody else is signing up.',
  },
  'leading-question': {
    name: 'Leading question',
    short: 'A question whose wording suggests the answer you want.',
    full: '"Would this save you time?" contains its own answer. The polite response is yes, it costs the respondent nothing, and you learn only that they are agreeable.',
    soWhat:
      'It is the single most common way interviews produce confident, false evidence — and the same failure appears when you ask an AI whether your idea is good.',
  },
  tam: {
    name: 'TAM (Total Addressable Market)',
    short: 'The total size of a market, before any competition.',
    full: 'Total Addressable Market — every person or business who could conceivably buy this, if you had no competitors and perfect reach. Usually paired with SAM (the slice you could realistically serve) and SOM (the slice you could realistically win).',
    soWhat:
      'On its own it is close to meaningless and easy to inflate. It is useful only for telling a hobby apart from a business.',
  },
  npm: {
    name: 'npm',
    see: '04-project-setup',
    short: 'The package manager that ships with Node.js.',
    full: 'Reads your package.json, downloads every package it names (and everything those packages need) from the npm registry, and copies the whole tree into the project\u2019s node_modules folder. Every project gets its own full copy, hoisted into one flat pile.',
    soWhat:
      'The flat pile means your code can import packages you never declared \u2014 phantom dependencies \u2014 which work until the package that dragged them in stops doing so. Zero setup is why it remains the default everywhere.',
  },
  pnpm: {
    name: 'pnpm',
    see: '04-project-setup',
    short:
      'A faster npm replacement that stores each package once per machine.',
    full: 'Same registry and same package.json as npm, but packages live in one content-addressable store on your machine and get hard-linked into each project. Its node_modules layout is strict: only dependencies you actually declared are importable.',
    soWhat:
      'Repeat installs take seconds and undeclared imports fail on your machine today rather than in production later. The trade: it does not ship with Node, so it is one corepack step away from a fresh machine.',
  },
  'problem-interview': {
    name: 'Problem interview',
    see: '01-product-discovery',
    short:
      'A conversation about what someone actually did, not what they would do.',
    full: 'A short interview — 20 to 30 minutes — focused entirely on past behaviour around a problem. No pitch, no product, no hypotheticals.',
    soWhat:
      'Predictions about future behaviour are unreliable. What someone did last Tuesday is evidence.',
  },
  'switching-cost': {
    name: 'Switching cost',
    short: 'Everything it costs someone to move off what they use now.',
    full: 'Learning a new tool, migrating data, changing habits, and the risk that the new thing is worse. It is paid by the user, not by you, and it is usually larger than builders estimate.',
    soWhat:
      'This is why "annoying" problems never convert. The pain you remove has to exceed the cost of moving.',
  },
  mvp: {
    name: 'MVP (Minimum Viable Product)',
    see: '02-planning',
    short:
      'The smallest version that delivers the outcome you defined as done.',
    full: 'Minimum viable product: the least you can build that still achieves the result you wrote down, so that real usage can tell you what to build next. It is defined by the outcome, not by a feature count.',
    soWhat:
      'The phrase is usually misused to mean "v1 with the hard parts removed", which produces something nobody can use and teaches you nothing. If your MVP cannot deliver the outcome, it is not minimum — it is unfinished.',
  },
  'product-roadmap': {
    name: 'Product roadmap',
    see: '02-planning',
    short: 'What you plan to build, in order, without dates.',
    full: 'An ordered statement of intent — usually now, next and later — saying what is being built and what is waiting. The good ones name what has to be true before an item moves up, rather than naming a month.',
    soWhat:
      'The moment a roadmap carries dates it becomes a promise, and replanning turns political. Horizons give you the sequence without the commitment.',
  },
  'product-vision': {
    name: 'Product vision',
    see: '02-planning',
    short: 'Where the product is going, written as a state of the world.',
    full: 'A short description of what the product becomes if it works — not a feature list, and not a slogan. One paragraph is the right length.',
    soWhat:
      'Without one, an MVP reads as a list of things you cut. With one, it reads as a first step, and every "not now" decision has something to be judged against.',
  },
  appetite: {
    name: 'Appetite',
    see: '02-planning',
    short: 'How much time something is worth, decided before the design.',
    full: 'A fixed budget of time you are willing to spend, which the solution is then shaped to fit. An estimate starts with a design and ends with a number; an appetite starts with a number and ends with a design.',
    soWhat:
      'It reverses who is in charge. An estimate lets the design dictate the schedule; an appetite lets the schedule dictate the design — which, solo, is almost always the trade you want.',
  },
  'vertical-slice': {
    name: 'Vertical slice',
    see: '02-planning',
    short:
      'A piece of work that touches every layer and produces something usable.',
    full: 'Work sequenced so each step goes through storage, logic and interface at once, rather than building each layer across the whole product before starting the next.',
    soWhat:
      'Layer-first work means nothing functions until everything does, and you learn nothing until the end. A vertical slice is demonstrable the day it lands, which is also what makes it possible to change your mind cheaply.',
  },
  spike: {
    name: 'Spike',
    see: '02-planning',
    short: 'A timeboxed investigation whose output is a decision, not code.',
    full: 'A short, deliberately bounded piece of exploration answering one specific question — can this integration do what we need, is this approach fast enough — with a hard stop and a written answer.',
    soWhat:
      'The discipline is throwing the code away. If you keep it, you have not run a spike; you have merged untested, unreviewed work through the side door.',
  },
  'feasibility-risk': {
    name: 'Feasibility risk',
    see: '02-planning',
    short: 'The risk that the thing cannot be built as imagined.',
    full: 'One of the standard product risks, alongside whether people want it and whether it makes business sense. It asks whether the technology, data, budget and time actually permit the solution.',
    soWhat:
      'Discovery tests whether anyone wants it; this tests whether you can make it. They fail differently and at different costs, so finding feasibility problems late is the more expensive of the two.',
  },
  adr: {
    name: 'ADR (Architecture Decision Record)',
    short:
      'A short document capturing one decision: context, choice, consequences.',
    full: 'A short record of a single architecture decision — the context, the choice, and the consequences — written when the decision is made and never edited afterward. Superseded by a new ADR rather than revised.',
    soWhat:
      'The value is the record of what was believed at the time. Months later, "why did we do it this way?" has an answer instead of a reconstruction.',
    see: '03-architecture',
  },
  'blast-radius': {
    name: 'Blast radius',
    short: 'How much breaks when this breaks.',
    full: 'The reach of a change or a failure: how much of the system is affected when this one piece goes wrong.',
    soWhat:
      'It sets how carefully you ship. A small blast radius can go out casually; a large one needs a gate, a canary, and a rollback plan.',
    see: '03-architecture',
  },
  canary: {
    name: 'Canary',
    short: 'Releasing to a small fraction of traffic before everyone.',
    full: 'Releasing a change to a small slice of traffic first, watching it, then widening. On Vercel it is approximated with skew protection and staged rollouts rather than true traffic splitting.',
    soWhat:
      'It turns a deploy into an experiment with an escape hatch: a failure shows up on 1% of users, not 100%.',
    see: '13-production-deployment',
  },
  'definition-of-done': {
    name: 'Definition of done',
    short:
      'The checkable state that separates "works on my machine" from "this stage is complete."',
    full: 'A specific, checkable statement of what "done" means for a piece of work — a state you can hold the running product up against and confirm, yes or no. Every stage doc has one.',
    soWhat:
      'Without it, "done" is an opinion and scope stays arguable forever. With it, a feature request has a boundary to be judged against.',
  },
  'error-budget': {
    name: 'Error budget',
    short: 'The amount of failure you have decided is acceptable in a period.',
    full: 'The failure you have decided is acceptable over a window. A 99.9% uptime target is roughly a 43-minute monthly budget. Spending it is allowed — that is what a budget is for; exceeding it means stop shipping features and fix reliability.',
    soWhat:
      'It turns "is it reliable enough?" from an argument into arithmetic, and gives the feature-versus-reliability call a rule instead of a mood.',
    see: '15-observability',
  },
  'golden-signals': {
    name: 'Golden signals',
    short:
      'Latency, traffic, errors, saturation — the four things to instrument first.',
    full: 'The four measurements to instrument before any others: latency, traffic, errors, and saturation. If you watch only four things, watch these.',
    soWhat:
      'They cover most of what actually pages you, so you get the bulk of observability value for a small, fixed amount of instrumentation.',
    see: '15-observability',
  },
  'merge-gate': {
    name: 'Merge gate',
    short: 'The automated checks that must pass before code reaches main.',
    full: 'The set of automated checks that must pass before code merges to the main branch. Distinct from deployment: the gate protects the branch, the deploy ships it.',
    soWhat:
      'It is where "works on my machine" stops being anyone’s problem. Added late it is a fight; wired on day one it is invisible.',
    see: '11-ci-cd',
  },
  'phantom-dependency': {
    name: 'Phantom dependency',
    short: 'A package you import but never declared, working only by accident.',
    full: 'A package your code imports but never listed in package.json. It resolves only because some other dependency happened to pull it into a flat node_modules, and it breaks mysteriously when that package updates or drops it.',
    soWhat:
      'It is why this playbook picks pnpm: the strict layout makes a phantom import fail on your machine today instead of in CI next month.',
    see: '04-project-setup',
  },
  'preview-deployment': {
    name: 'Preview deployment',
    short: 'A full, isolated deployment of a branch, with its own URL.',
    full: 'A complete, isolated deployment of a single branch at its own URL — automatic per pull request on Vercel. Not the same as staging.',
    soWhat:
      'It lets anyone see the change running as a real build before it merges, which catches what a local dev server cannot.',
    see: '12-staging',
  },
  'production-grade': {
    name: 'Production-grade',
    short: 'Someone other than you depends on it working.',
    full: 'The state where someone other than you depends on the software working. It is about consequences, not scale: ten paying users make software production-grade; ten thousand on a toy do not.',
    soWhat:
      'It is the baseline assumption of the whole playbook — solo, but with something real depending on the result — and it is what separates rigor from ceremony.',
  },
  rollback: {
    name: 'Rollback',
    short: 'Returning production to the previous known-good state.',
    full: 'Returning production to the last known-good state. On Vercel it is promoting a prior deployment, which takes seconds — but it is not automatic for database migrations, which is why migrations get careful, separate treatment.',
    soWhat:
      'A deploy you can undo in seconds is a deploy you can make casually. The asymmetry with database changes is the whole reason migrations are handled apart.',
    see: '13-production-deployment',
  },
  'skew-protection': {
    name: 'Skew protection',
    short:
      'Letting a browser on old client JS still talk to the server after a deploy.',
    full: 'Ensuring a browser still running the previous client JavaScript can talk to the server after a new deploy. Without it, users mid-session hit errors every time you ship.',
    soWhat:
      'It is the difference between deploying whenever you like and only deploying when nobody is using the app.',
    see: '13-production-deployment',
  },
  'smoke-test': {
    name: 'Smoke test',
    short:
      'A small set of checks confirming the critical paths work after a deploy.',
    full: 'A small set of checks confirming the critical paths still work after a deploy. Not comprehensive by design; it answers "is this catastrophically broken?" in under a minute.',
    soWhat:
      'It is the cheapest insurance in shipping: a minute of checks between "deployed" and "walked away" catches the failures that otherwise page you at night.',
    see: '14-post-deployment-verification',
  },
  slo: {
    name: 'SLO (Service Level Objective)',
    short:
      'The reliability target you commit to, e.g. "99.9% of requests succeed."',
    full: 'The reliability target you commit to — for example, "99.9% of requests succeed." Meaningful only if you have decided in advance what happens when you miss it.',
    soWhat:
      'An SLO without a consequence is a wish. Paired with an error budget, it becomes the rule that governs when you ship and when you stop.',
    see: '15-observability',
  },
  traps: {
    name: 'Traps',
    short: 'The last section of every stage doc: failure modes worth naming.',
    full: 'The closing section of every stage doc — the failure modes worth naming. They accumulate from real experience and become the most valuable part of the playbook over time.',
    soWhat:
      'Generic advice ages; the specific traps you actually hit do not. Adding to them is what turns a borrowed playbook into your own.',
  },
  yagni: {
    name: 'YAGNI (You Aren’t Gonna Need It)',
    short:
      'Do not build for requirements you have imagined rather than encountered.',
    full: 'You Aren’t Gonna Need It: do not build for requirements you have imagined rather than met. The most common cause of accidental complexity.',
    soWhat:
      'Half the advice in this playbook is a specific application of it — the "not now" list, the MVP cut, deferring architecture. When in doubt, do less.',
  },
  'domain-model': {
    name: 'Domain model',
    see: '03-architecture',
    short:
      'The nouns your system holds and how they relate, before any table exists.',
    full: 'A description of the system in entities and relationships — a user has many clients, a client has many invoices — written in the language of the problem rather than the language of the database. Tables come after, as one way of storing it.',
    soWhat:
      'It is the decision that outlives every framework choice, because migrating code is easy and migrating data is not. Getting it wrong is the most expensive kind of wrong available before you have users.',
  },
  'derived-state': {
    name: 'Derived state',
    see: '03-architecture',
    short:
      'A value that could be calculated from others, but is stored anyway.',
    full: 'Anything you could work out on demand — whether an invoice is overdue, how many items are in a cart, a running total — that is written into a column instead. Storing it means something has to keep it up to date.',
    soWhat:
      'Stored derived state drifts. The job that updates it misses a run, or a script writes around it, and now two fields in your database disagree about the same fact with no way to tell which is right.',
  },
  'soft-delete': {
    name: 'Soft delete',
    see: '03-architecture',
    short: 'Marking a row deleted instead of removing it.',
    full: 'A deleted_at timestamp or a boolean flag, set instead of issuing a DELETE. The row stays; every query that should not see it has to filter it out.',
    soWhat:
      'It is the trade the stage asks you to make deliberately: a permanently more complex query set, in exchange for being able to answer “where did that invoice go”. For financial or audited records, the complexity is usually worth it, and the decision cannot be revisited after the rows are gone.',
  },
  'join-table': {
    name: 'Join table',
    see: '03-architecture',
    short: 'A table whose job is to connect two other tables.',
    full: 'When a client can belong to several users and a user to several clients, neither table can hold the relationship in a column. A third table holds pairs of ids instead — one row per connection.',
    soWhat:
      'Starting with a foreign key and discovering later that you needed a join table is a migration plus a rewrite of every query that touched the relationship. The asymmetry is the reason to think about it now rather than when it bites.',
  },
  monolith: {
    name: 'Monolith',
    see: '03-architecture',
    short: 'One application, one deployment, one process.',
    full: 'A system where all the code runs together rather than being split across services that talk over a network. Internal structure can still be strict; the distinction is about deployment and process boundaries, not tidiness.',
    soWhat:
      'For one developer it is the correct default rather than a compromise. The benefits of splitting — independent deploys, independent team scaling — are organisational, and you cannot collect them alone, but you pay every cost from day one.',
  },
  authorization: {
    name: 'Authorization',
    see: '03-architecture',
    short: 'Deciding what a known user is allowed to do.',
    full: 'Distinct from authentication, which establishes who the caller is: authentication gets you a user id, authorization decides whether that user id may read invoice 42. It comes in three patterns, and most products need more than one. Ownership — the row carries the caller’s id and you compare them. Role — the caller holds a role that grants the action, whoever owns the row. Membership — the caller and the row belong to the same group, which is what shared workspaces actually need.',
    soWhat:
      'Authentication is the part people buy or borrow and mostly get right. Authorization is written by hand in every route, and it is where other people’s data leaks when one route forgets. Ownership is the dangerous default: it is right often enough to feel general, then fails silently on the first product where one person acts on another person’s record.',
  },
  'database-constraint': {
    name: 'Database constraint',
    see: '03-architecture',
    short:
      'A rule the database enforces itself, regardless of what the code does.',
    full: 'NOT NULL, UNIQUE, CHECK, and foreign keys with their delete behaviour. Declared in the schema, so the database refuses to store a row that breaks them.',
    soWhat:
      'Application code has bugs, gets bypassed by migration scripts and one-off fixes, and races with itself under concurrency. The database does not get bypassed, which makes it the only place a rule genuinely holds.',
  },
  'event-sourcing': {
    name: 'Event sourcing',
    see: '03-architecture',
    short:
      'Storing the sequence of changes as the source of truth, not the current state.',
    full: 'Instead of a row holding the current value, you store every change that ever happened and derive the current value by replaying them. The log is the database; the table you query is a projection built from it.',
    soWhat:
      'The distinction people get wrong: keeping an audit table alongside normal rows is not event sourcing. It is event sourcing only when the log is the truth and the current state is derived. That is a much larger commitment, and it is why the answer here is almost always no.',
  },
  cqrs: {
    name: 'CQRS (Command Query Responsibility Segregation)',
    see: '03-architecture',
    short: 'Separate models for writing data and for reading it.',
    full: 'Splitting the write path and the read path so each can be shaped for its own job — writes validated against one model, reads served from another built for the queries the screens make. Often paired with event sourcing, though neither requires the other.',
    soWhat:
      'It buys read performance and independent evolution of the two paths, at the cost of two models to keep aligned and reads that lag writes. For a system where one Postgres query answers the screen, it is complexity with nothing on the other side.',
  },
  normalisation: {
    name: 'Normalisation',
    see: '03-architecture',
    short: 'Arranging tables so each fact is stored in exactly one place.',
    full: 'A series of increasingly strict forms — first, second and third normal form are the ones that matter in practice — describing how far a schema has removed duplicated facts. Third normal form roughly means every column depends on the key, the whole key, and nothing but the key.',
    soWhat:
      'The practical test is shorter than the theory: if changing one fact means updating two rows, the model is wrong and will eventually disagree with itself. Denormalising on purpose to make a slow query fast is fine; denormalising by accident is how data rots.',
  },
  'partial-unique-index': {
    name: 'Partial unique index',
    see: '03-architecture',
    short: 'Uniqueness enforced over only the rows that match a condition.',
    full: "A unique index with a WHERE clause, so the constraint applies to a subset of the table. `CREATE UNIQUE INDEX ... ON claims (shift_id) WHERE status = 'approved'` permits many rejected claims per shift and exactly one approved one.",
    soWhat:
      'It is the tool for rules of the form "at most one active X per Y", which plain UNIQUE cannot express and application code cannot enforce against a race. Without it, the usual workaround is a check-then-insert that two concurrent requests both pass.',
  },
  'c4-model': {
    name: 'C4 model',
    see: '03-architecture',
    short:
      'Four zoom levels for diagramming a system: context, container, component, code.',
    full: 'Simon Brown’s convention for architecture diagrams. Context shows your system and the outside world it talks to. Container shows the deployable things inside it — the application, the database, the worker. Component shows the pieces inside one container. Code is classes and functions.',
    soWhat:
      'It answers the question that stops most people drawing anything: what goes in the diagram, and at what altitude. For one person the first two levels do nearly all the work, and the code level is what an editor already draws for free.',
  },
  idempotency: {
    name: 'Idempotency',
    see: '03-architecture',
    short: 'Doing it twice has the same effect as doing it once.',
    full: 'A property of an operation: running it repeatedly with the same input leaves the system in the same state as running it once. Usually achieved by having the caller supply a key, and recording which keys have already been processed.',
    soWhat:
      'Anything that can be retried will eventually be retried, and anything delivered over a network will eventually arrive twice. Without it, a payment webhook that fires twice charges twice — and the second delivery is not a bug you can fix on your side.',
  },
  'bounded-context': {
    name: 'Bounded context',
    see: '03-architecture',
    short: 'A boundary inside which one word means exactly one thing.',
    full: 'From domain-driven design: a section of the system with its own model, where the terms have a single agreed meaning. "Invoice" in billing and "invoice" in a customer-support view are often not the same object, and a bounded context is the admission that forcing them together costs more than keeping them apart.',
    soWhat:
      'It gives you a reason to put a boundary somewhere specific rather than wherever the folders ended up. Fowler’s argument is that unifying the model across a whole large system is not cost-effective, so boundaries should follow the lines where people already use words differently.',
  },
  'ubiquitous-language': {
    name: 'Ubiquitous language',
    see: '03-architecture',
    short:
      'One vocabulary shared by the code and the people describing the problem.',
    full: 'The practice of using the domain’s own words in the code — the table is called `claims` because the people who use the system say "claim". Not a translation layer between business terms and technical ones, but the deliberate absence of one.',
    soWhat:
      'Where the words diverge, bugs live in the gap: someone says "cancelled" meaning withdrawn-by-the-user and the code means rejected-by-a-manager. It also tells you where a bounded context boundary belongs — the point where the same word starts meaning something else.',
  },
  'modular-monolith': {
    name: 'Modular monolith',
    see: '03-architecture',
    short:
      'One deployable, with internal boundaries strict enough to split later.',
    full: 'A monolith whose features own their data and talk to each other through published functions rather than by reaching into each other’s tables. One process and one deploy, but the seams are real and maintained.',
    soWhat:
      'It is what most solo and small-team projects should be, and it is frequently built without anyone using the name. Its cost is honest: the boundaries are held by discipline, because nothing in a single codebase enforces them for you.',
  },
  microservices: {
    name: 'Microservices',
    see: '03-architecture',
    short:
      'Separate deployables, each owning its data, talking over a network.',
    full: 'An architecture where services are deployed and scaled independently and communicate over the network. Each owns its own storage; sharing a database between services undoes most of what the split was for.',
    soWhat:
      'What it buys is organisational — teams shipping without coordinating. What it costs is technical and arrives immediately: network failure modes, distributed debugging, and consistency problems that a single database solved for free. One person collects none of the benefit and all of the cost.',
  },
  'event-driven-architecture': {
    name: 'Event-driven architecture',
    see: '03-architecture',
    short: 'Components react to events rather than calling each other.',
    full: 'A style where a component announces that something happened and others respond, instead of one calling the next directly. It is a communication choice rather than a deployment shape — a single application can be event-driven inside.',
    soWhat:
      'It decouples the sender from who listens, which is exactly what makes it hard to follow: no call stack shows you the consequences of an event. Worth it where the consequences genuinely are open-ended, expensive where they are three known steps.',
  },
  serverless: {
    name: 'Serverless',
    see: '03-architecture',
    short: 'Functions that run on demand, with no server you keep alive.',
    full: 'Code deployed as individual functions the platform starts when a request arrives and stops afterwards, billed per invocation rather than per hour. Vercel’s deployment model for a Next.js application is this.',
    soWhat:
      'Scaling to zero is real and useful when load is spiky or near nothing. The costs are cold starts, execution time limits, and work that does not fit the request-response shape — which is why the stage’s split triggers name execution limits first.',
  },
  'hexagonal-architecture': {
    name: 'Hexagonal architecture (ports and adapters)',
    see: '03-architecture',
    short:
      'Domain logic in the middle, with everything external behind an interface.',
    full: 'An organising principle where the core logic defines interfaces — ports — and the database, HTTP layer and third-party services are adapters plugged into them. The core depends on nothing outside itself.',
    soWhat:
      'It describes how a codebase is arranged inside, not how it deploys, so a hexagonal monolith is an ordinary thing. Confusing the two axes is what makes "monolith or microservices" sound like one question when it is two.',
  },
  timeout: {
    name: 'Timeout',
    see: '03-architecture',
    short: 'A deadline on a call, after which you stop waiting and decide.',
    full: 'An explicit limit on how long you will wait for a network call before treating it as failed. Most HTTP clients and database drivers default to waiting indefinitely.',
    soWhat:
      'Without one, somebody else’s slow afternoon becomes your outage: requests pile up holding connections and memory until nothing works. The specific number matters far less than having one at all.',
  },
  'exponential-backoff': {
    name: 'Exponential backoff (with jitter)',
    see: '03-architecture',
    short: 'Waiting longer between each retry, plus a random offset.',
    full: 'Retry after 1s, then 2s, then 4s, rather than immediately and repeatedly. Jitter adds a random amount to each delay so that many clients retrying the same failed service do not do it in unison.',
    soWhat:
      'A service that just failed is usually recovering, and retrying hard prevents that — you become the reason it stays down. Without jitter, every client that failed at the same moment retries at the same moment, which is a thundering herd rebuilt out of your own retry logic.',
  },
  'circuit-breaker': {
    name: 'Circuit breaker',
    see: '03-architecture',
    short:
      'After repeated failures, stop calling for a while and fail immediately.',
    full: 'A wrapper that counts consecutive failures, and once past a threshold stops attempting the call at all for a cooldown period, failing fast instead. After the cooldown it lets one request through to test whether the dependency recovered.',
    soWhat:
      'It is the pattern you reach for once your retries have made you part of the outage rather than a victim of it. Failing fast is also kinder to the caller than a timeout: an instant error can be handled, a thirty-second hang cannot.',
  },
  'graceful-degradation': {
    name: 'Graceful degradation',
    see: '03-architecture',
    short: 'Deciding, per feature, what still works when a dependency is down.',
    full: 'Designing so that the loss of one component removes one capability rather than the whole system. Search goes down and browsing still works; the PDF renderer goes down and the invoice still sends.',
    soWhat:
      'It is a design decision, not a fallback you add later, because it determines what the system needs to be able to do without each of its dependencies. Answering it per dependency is what makes an architecture diagram worth drawing.',
  },
  'expand-contract': {
    name: 'Expand-contract (parallel change)',
    see: '03-architecture',
    short:
      'Changing stored data in steps, each of which is safe to deploy alone.',
    full: 'A sequence for altering a schema without downtime: add the new shape, write to both, backfill the old rows, move reads across, stop writing the old shape, then remove it. Six deploys rather than one.',
    soWhat:
      'It is what makes "stored data is expensive to change" a cost rather than a wall. The property that matters is that every step is independently deployable, so a failure at any point rolls back as a code rollback — and a dropped column does not roll back.',
  },
  'strangler-fig': {
    name: 'Strangler fig',
    see: '03-architecture',
    short: 'Replacing a system incrementally while it keeps serving traffic.',
    full: 'Put something in front of the existing system, route one path at a time to the replacement, and delete the old code once nothing reaches it. Named after the vine that grows around a tree and eventually stands without it.',
    soWhat:
      'It is why "we will split that out later" can be a plan instead of a hope. The alternative — a rewrite that has to reach parity before anyone can use it — is the failure mode it exists to avoid.',
  },
  'architecture-characteristic': {
    name: 'Architecture characteristic (non-functional requirement)',
    see: '03-architecture',
    short: 'What a system has to be good at, as opposed to what it does.',
    full: 'Availability, correctness, auditability, latency, security, cost to run — the qualities a design has to satisfy, separate from the features it delivers. Richards and Ford call them architecture characteristics; most job descriptions and specifications call the same thing non-functional requirements. One idea, two vocabularies.',
    soWhat:
      'They trade against each other, so a list of twenty is a list of none — high availability costs money, strong auditability costs write throughput, and cheap-to-run costs both. Three or four chosen deliberately are what turn a structural decision into something you can defend; without them, picking an architecture is picking a preference.',
  },
}

export function getTerm(key: string): Term | undefined {
  return TERMS[key]
}
