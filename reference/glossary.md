# Glossary

<!-- Generated from web/src/lib/terms.ts. Do not edit by hand.
     Edit the term there and run `pnpm gen:glossary` (from web/) to regenerate. -->

Terms used across the stage docs, defined once. Authored in `terms.ts` and
generated here, so the inline definitions in the app and this reference cannot
drift apart.

---

**ADR (Architecture Decision Record)** — A short record of a single architecture decision — the context, the choice, and the consequences — written when the decision is made and never edited afterward. Superseded by a new ADR rather than revised. See [03 — Architecture](../docs/03-architecture.md).

**Appetite** — A fixed budget of time you are willing to spend, which the solution is then shaped to fit. An estimate starts with a design and ends with a number; an appetite starts with a number and ends with a design. See [02 — Product Planning](../docs/02-planning.md).

**Architecture characteristic (non-functional requirement)** — Availability, correctness, auditability, latency, security, cost to run — the qualities a design has to satisfy, separate from the features it delivers. Richards and Ford call them architecture characteristics; most job descriptions and specifications call the same thing non-functional requirements. One idea, two vocabularies. See [03 — Architecture](../docs/03-architecture.md).

**Authorization** — Distinct from authentication, which establishes who the caller is: authentication gets you a user id, authorization decides whether that user id may read invoice 42. Three patterns: ownership — the row carries the caller’s id and you compare them; role — the caller holds a role that grants the action, whoever owns the row; membership — the caller and the row belong to the same group. They combine, and one entity often needs two of them joined by *and*: a manager may approve a claim only if they hold the manager role *and* the shift belongs to a team they belong to. See [03 — Architecture](../docs/03-architecture.md).

**Blast radius** — The reach of a change or a failure: how much of the system is affected when this one piece goes wrong. See [03 — Architecture](../docs/03-architecture.md).

**Bounded context** — From domain-driven design: a section of the system with its own model, where the terms have a single agreed meaning. "Invoice" in billing and "invoice" in a customer-support view are often not the same object, and a bounded context is the admission that forcing them together costs more than keeping them apart. See [03 — Architecture](../docs/03-architecture.md).

**C4 model** — Simon Brown’s convention for architecture diagrams. Context shows your system and the outside world it talks to. Container shows the deployable things inside it — the application, the database, the worker. Component shows the pieces inside one container. Code is classes and functions. See [03 — Architecture](../docs/03-architecture.md).

**Canary** — Releasing a change to a small slice of traffic first, watching it, then widening. On Vercel it is approximated with skew protection and staged rollouts rather than true traffic splitting. See [13 — Production Deployment](../docs/13-production-deployment.md).

**CAP theorem** — For a system spread across nodes: during a network partition you may either refuse requests to stay consistent, or serve them and let copies disagree. Consistency and availability are only jointly achievable when nothing is partitioned. See [03 — Architecture](../docs/03-architecture.md).

**Circuit breaker** — A wrapper that counts consecutive failures, and once past a threshold stops attempting the call at all for a cooldown period, failing fast instead. After the cooldown it lets one request through to test whether the dependency recovered. See [03 — Architecture](../docs/03-architecture.md).

**Concierge test** — You do the work manually for a handful of real users — spreadsheets, emails, your own labour — while they experience the result as if it were a product.

**Connection pooling** — A pooler sits between the application and the database, holding a limited number of real connections and multiplexing client requests onto them, instead of each caller opening its own. See [03 — Architecture](../docs/03-architecture.md).

**CQRS (Command Query Responsibility Segregation)** — Splitting the write path and the read path so each can be shaped for its own job — writes validated against one model, reads served from another built for the queries the screens make. Often paired with event sourcing, though neither requires the other. See [03 — Architecture](../docs/03-architecture.md).

**Database constraint** — NOT NULL, UNIQUE, CHECK, and foreign keys with their delete behaviour. Declared in the schema, so the database refuses to store a row that breaks them. See [03 — Architecture](../docs/03-architecture.md).

**Definition of done** — A specific, checkable statement of what "done" means for a piece of work — a state you can hold the running product up against and confirm, yes or no. Every stage doc has one.

**Derived state** — Anything you could work out on demand — whether an invoice is overdue, how many items are in a cart, a running total — that is written into a column instead. Storing it means something has to keep it up to date. See [03 — Architecture](../docs/03-architecture.md).

**Domain model** — A description of the system in entities and relationships — a user has many clients, a client has many invoices — written in the language of the problem rather than the language of the database. Tables come after, as one way of storing it. See [03 — Architecture](../docs/03-architecture.md).

**Error budget** — The failure you have decided is acceptable over a window. A 99.9% uptime target is roughly a 43-minute monthly budget. Spending it is allowed — that is what a budget is for; exceeding it means stop shipping features and fix reliability. See [15 — Observability](../docs/15-observability.md).

**Event sourcing** — Instead of a row holding the current value, you store every change that ever happened and derive the current value by replaying them. The log is the database; the table you query is a projection built from it. See [03 — Architecture](../docs/03-architecture.md).

**Event-driven architecture** — A style where a component announces that something happened and others respond, instead of one calling the next directly. It is a communication choice rather than a deployment shape — a single application can be event-driven inside. See [03 — Architecture](../docs/03-architecture.md).

**Eventual consistency** — A guarantee that replicas converge on the same data given time, without saying when. A read from a replica may return a value the primary has already changed. See [03 — Architecture](../docs/03-architecture.md).

**Expand-contract (parallel change)** — A sequence for altering a schema without downtime: add the new shape, write to both, backfill the old rows, move reads across, stop writing the old shape, then remove it. Six deploys rather than one. See [03 — Architecture](../docs/03-architecture.md).

**Exponential backoff (with jitter)** — Retry after 1s, then 2s, then 4s, rather than immediately and repeatedly. Jitter adds a random amount to each delay so that many clients retrying the same failed service do not do it in unison. See [03 — Architecture](../docs/03-architecture.md).

**Fake-door test** — A page describing the product with a real signup or purchase button. Clicking it reaches a "coming soon" message. You measure how many people click.

**Feasibility risk** — One of the standard product risks, alongside whether people want it and whether it makes business sense. It asks whether the technology, data, budget and time actually permit the solution. See [02 — Product Planning](../docs/02-planning.md).

**Fitness function** — From evolutionary architecture: a test asserting a property of the system rather than a behaviour of a function. A rule that no module imports across a feature boundary, a build-size budget that fails the pipeline, an assertion that a page issues one query rather than forty. See [03 — Architecture](../docs/03-architecture.md).

**Golden signals** — The four measurements to instrument before any others: latency, traffic, errors, and saturation. If you watch only four things, watch these. See [15 — Observability](../docs/15-observability.md).

**Graceful degradation** — Designing so that the loss of one component removes one capability rather than the whole system. Search goes down and browsing still works; the PDF renderer goes down and the invoice still sends. See [03 — Architecture](../docs/03-architecture.md).

**Hexagonal architecture (ports and adapters)** — An organising principle where the core logic defines interfaces — ports — and the database, HTTP layer and third-party services are adapters plugged into them. The core depends on nothing outside itself. See [03 — Architecture](../docs/03-architecture.md).

**Horizontal scaling** — Adding instances behind a load balancer so work spreads across them. The alternative, vertical scaling, is moving to a larger machine: simpler, requiring no statelessness, and eventually running out of machine. See [03 — Architecture](../docs/03-architecture.md).

**Idempotency** — A property of an operation: running it repeatedly with the same input leaves the system in the same state as running it once. Usually achieved by having the caller supply a key, and recording which keys have already been processed. See [03 — Architecture](../docs/03-architecture.md).

**Isolation level** — A per-transaction setting trading strictness against concurrency. Postgres defaults to read committed: you never see uncommitted rows, but you do see rows others commit while you are still running. Serializable behaves as though transactions ran one at a time, and aborts one when it cannot guarantee that. See [03 — Architecture](../docs/03-architecture.md).

**Jobs to be done (JTBD)** — A framing that describes users by the job they are "hiring" a product to do — "help me look organised to my clients" — rather than by who they are. Two people with nothing demographically in common can share a job.

**Join table** — When a client can belong to several users and a user to several clients, neither table can hold the relationship in a column. A third table holds pairs of ids instead — one row per connection. See [03 — Architecture](../docs/03-architecture.md).

**Leading question** — "Would this save you time?" contains its own answer. The polite response is yes, it costs the respondent nothing, and you learn only that they are agreeable.

**Merge gate** — The set of automated checks that must pass before code merges to the main branch. Distinct from deployment: the gate protects the branch, the deploy ships it. See [11 — CI/CD](../docs/11-ci-cd.md).

**Microservices** — An architecture where services are deployed and scaled independently and communicate over the network. Each owns its own storage; sharing a database between services undoes most of what the split was for. See [03 — Architecture](../docs/03-architecture.md).

**Modular monolith** — A monolith whose features own their data and talk to each other through published functions rather than by reaching into each other’s tables. One process and one deploy, but the seams are real and maintained. See [03 — Architecture](../docs/03-architecture.md).

**Monolith** — A system where all the code runs together rather than being split across services that talk over a network. Internal structure can still be strict; the distinction is about deployment and process boundaries, not tidiness. See [03 — Architecture](../docs/03-architecture.md).

**MVP (Minimum Viable Product)** — Minimum viable product: the least you can build that still achieves the result you wrote down, so that real usage can tell you what to build next. It is defined by the outcome, not by a feature count. See [02 — Product Planning](../docs/02-planning.md).

**Normalisation** — A series of increasingly strict forms — first, second and third normal form are the ones that matter in practice — describing how far a schema has removed duplicated facts. Third normal form roughly means every column depends on the key, the whole key, and nothing but the key. See [03 — Architecture](../docs/03-architecture.md).

**npm** — Reads your package.json, downloads every package it names (and everything those packages need) from the npm registry, and copies the whole tree into the project’s node_modules folder. Every project gets its own full copy, hoisted into one flat pile. See [04 — Project Setup](../docs/04-project-setup.md).

**Opportunity solution tree** — A diagram by Teresa Torres with four levels: the outcome you want to move, the customer opportunities (problems, needs, desires) that could move it, the solutions that address each opportunity, and the experiments that test each solution. See [01 — Product Discovery](../docs/01-product-discovery.md).

**Optimistic locking** — Keep a version number on the row. Read it, and include it in the update: `WHERE id = $1 AND version = $2`. Zero rows updated means somebody committed between your read and your write, so you retry or tell the user. See [03 — Architecture](../docs/03-architecture.md).

**Partial unique index** — A unique index with a WHERE clause, so the constraint applies to a subset of the table. `CREATE UNIQUE INDEX ... ON claims (shift_id) WHERE status = 'approved'` permits many rejected claims per shift and exactly one approved one. See [03 — Architecture](../docs/03-architecture.md).

**Pessimistic locking** — `SELECT … FOR UPDATE` inside a transaction takes a row lock, and any other transaction wanting that row blocks until yours commits or rolls back. See [03 — Architecture](../docs/03-architecture.md).

**Phantom dependency** — A package your code imports but never listed in package.json. It resolves only because some other dependency happened to pull it into a flat node_modules, and it breaks mysteriously when that package updates or drops it. See [04 — Project Setup](../docs/04-project-setup.md).

**pnpm** — Same registry and same package.json as npm, but packages live in one content-addressable store on your machine and get hard-linked into each project. Its node_modules layout is strict: only dependencies you actually declared are importable. See [04 — Project Setup](../docs/04-project-setup.md).

**Preview deployment** — A complete, isolated deployment of a single branch at its own URL — automatic per pull request on Vercel. Not the same as staging. See [12 — Staging](../docs/12-staging.md).

**Problem interview** — A short interview — 20 to 30 minutes — focused entirely on past behaviour around a problem. No pitch, no product, no hypotheticals. See [01 — Product Discovery](../docs/01-product-discovery.md).

**Product discovery** — The work of testing whether a problem is real, whose it is, and how badly it hurts — before any code exists. It is deliberately cheap, because its main output is often the decision not to build. See [01 — Product Discovery](../docs/01-product-discovery.md).

**Product roadmap** — An ordered statement of intent — usually now, next and later — saying what is being built and what is waiting. The good ones name what has to be true before an item moves up, rather than naming a month. See [02 — Product Planning](../docs/02-planning.md).

**Product vision** — A short description of what the product becomes if it works — not a feature list, and not a slogan. One paragraph is the right length. See [02 — Product Planning](../docs/02-planning.md).

**Production-grade** — The state where someone other than you depends on the software working. It is about consequences, not scale: ten paying users make software production-grade; ten thousand on a toy do not.

**Read replica** — A secondary instance kept up to date from the primary, used to spread read load. Writes still go to one place, so replicas scale reads and do nothing for write throughput. See [03 — Architecture](../docs/03-architecture.md).

**Rollback** — Returning production to the last known-good state. On Vercel it is promoting a prior deployment, which takes seconds — but it is not automatic for database migrations, which is why migrations get careful, separate treatment. See [13 — Production Deployment](../docs/13-production-deployment.md).

**Serverless** — Code deployed as individual functions the platform starts when a request arrives and stops afterwards, billed per invocation rather than per hour. Vercel’s deployment model for a Next.js application is this. See [03 — Architecture](../docs/03-architecture.md).

**Skew protection** — Ensuring a browser still running the previous client JavaScript can talk to the server after a new deploy. Without it, users mid-session hit errors every time you ship. See [13 — Production Deployment](../docs/13-production-deployment.md).

**SLO (Service Level Objective)** — The reliability target you commit to — for example, "99.9% of requests succeed." Meaningful only if you have decided in advance what happens when you miss it. See [15 — Observability](../docs/15-observability.md).

**Smoke test** — A small set of checks confirming the critical paths still work after a deploy. Not comprehensive by design; it answers "is this catastrophically broken?" in under a minute. See [14 — Post-Deployment Verification](../docs/14-post-deployment-verification.md).

**Soft delete** — A deleted_at timestamp or a boolean flag, set instead of issuing a DELETE. The row stays; every query that should not see it has to filter it out. See [03 — Architecture](../docs/03-architecture.md).

**Spike** — A short, deliberately bounded piece of exploration answering one specific question — can this integration do what we need, is this approach fast enough — with a hard stop and a written answer. See [02 — Product Planning](../docs/02-planning.md).

**Statelessness** — Every request carries or looks up whatever it needs, and anything that must persist between requests lives in a cookie, a database or a shared store rather than a local variable. Any instance can serve any request. See [03 — Architecture](../docs/03-architecture.md).

**Strangler fig** — Put something in front of the existing system, route one path at a time to the replacement, and delete the old code once nothing reaches it. Named after the vine that grows around a tree and eventually stands without it. See [03 — Architecture](../docs/03-architecture.md).

**Survivorship bias** — Drawing conclusions from the visible survivors of a process while the failures are silent. In discovery: interviewing current users tells you why people stay, never why the larger group left or never arrived.

**Switching cost** — Learning a new tool, migrating data, changing habits, and the risk that the new thing is worse. It is paid by the user, not by you, and it is usually larger than builders estimate.

**System design** — The activity between knowing what a product must do and writing the code that does it: choose the qualities the system has to have, model the data, pick a deployment shape, draw what depends on what, and settle the interfaces and access rules. The phrase is most often heard as the name of an interview format, which follows roughly that sequence. See [03 — Architecture](../docs/03-architecture.md).

**TAM (Total Addressable Market)** — Total Addressable Market — every person or business who could conceivably buy this, if you had no competitors and perfect reach. Usually paired with SAM (the slice you could realistically serve) and SOM (the slice you could realistically win).

**Timeout** — An explicit limit on how long you will wait for a network call before treating it as failed. Most HTTP clients and database drivers default to waiting indefinitely. See [03 — Architecture](../docs/03-architecture.md).

**Traps** — The closing section of every stage doc — the failure modes worth naming. They accumulate from real experience and become the most valuable part of the playbook over time.

**Ubiquitous language** — The practice of using the domain’s own words in the code — the table is called `claims` because the people who use the system say "claim". Not a translation layer between business terms and technical ones, but the deliberate absence of one. See [03 — Architecture](../docs/03-architecture.md).

**Vertical slice** — Work sequenced so each step goes through storage, logic and interface at once, rather than building each layer across the whole product before starting the next. See [02 — Product Planning](../docs/02-planning.md).

**YAGNI (You Aren’t Gonna Need It)** — You Aren’t Gonna Need It: do not build for requirements you have imagined rather than met. The most common cause of accidental complexity.
