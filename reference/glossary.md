# Glossary

<!-- Generated from web/src/lib/terms.ts. Do not edit by hand.
     Edit the term there and run `pnpm gen:glossary` (from web/) to regenerate. -->

Terms used across the stage docs, defined once. Authored in `terms.ts` and
generated here, so the inline definitions in the app and this reference cannot
drift apart.

---

**ADR (Architecture Decision Record)** — A short record of a single architecture decision — the context, the choice, and the consequences — written when the decision is made and never edited afterward. Superseded by a new ADR rather than revised. See [03 — Architecture](../docs/03-architecture.md).

**Appetite** — A fixed budget of time you are willing to spend, which the solution is then shaped to fit. An estimate starts with a design and ends with a number; an appetite starts with a number and ends with a design. See [02 — Product Planning](../docs/02-planning.md).

**Blast radius** — The reach of a change or a failure: how much of the system is affected when this one piece goes wrong. See [03 — Architecture](../docs/03-architecture.md).

**Canary** — Releasing a change to a small slice of traffic first, watching it, then widening. On Vercel it is approximated with skew protection and staged rollouts rather than true traffic splitting. See [13 — Production Deployment](../docs/13-production-deployment.md).

**Concierge test** — You do the work manually for a handful of real users — spreadsheets, emails, your own labour — while they experience the result as if it were a product.

**Definition of done** — A specific, checkable statement of what "done" means for a piece of work — a state you can hold the running product up against and confirm, yes or no. Every stage doc has one.

**Error budget** — The failure you have decided is acceptable over a window. A 99.9% uptime target is roughly a 43-minute monthly budget. Spending it is allowed — that is what a budget is for; exceeding it means stop shipping features and fix reliability. See [15 — Observability](../docs/15-observability.md).

**Fake-door test** — A page describing the product with a real signup or purchase button. Clicking it reaches a "coming soon" message. You measure how many people click.

**Feasibility risk** — One of the standard product risks, alongside whether people want it and whether it makes business sense. It asks whether the technology, data, budget and time actually permit the solution. See [02 — Product Planning](../docs/02-planning.md).

**Golden signals** — The four measurements to instrument before any others: latency, traffic, errors, and saturation. If you watch only four things, watch these. See [15 — Observability](../docs/15-observability.md).

**Jobs to be done (JTBD)** — A framing that describes users by the job they are "hiring" a product to do — "help me look organised to my clients" — rather than by who they are. Two people with nothing demographically in common can share a job.

**Leading question** — "Would this save you time?" contains its own answer. The polite response is yes, it costs the respondent nothing, and you learn only that they are agreeable.

**Merge gate** — The set of automated checks that must pass before code merges to the main branch. Distinct from deployment: the gate protects the branch, the deploy ships it. See [11 — CI/CD](../docs/11-ci-cd.md).

**MVP (Minimum Viable Product)** — Minimum viable product: the least you can build that still achieves the result you wrote down, so that real usage can tell you what to build next. It is defined by the outcome, not by a feature count. See [02 — Product Planning](../docs/02-planning.md).

**npm** — Reads your package.json, downloads every package it names (and everything those packages need) from the npm registry, and copies the whole tree into the project’s node_modules folder. Every project gets its own full copy, hoisted into one flat pile. See [04 — Project Setup](../docs/04-project-setup.md).

**Opportunity solution tree** — A diagram by Teresa Torres with four levels: the outcome you want to move, the customer opportunities (problems, needs, desires) that could move it, the solutions that address each opportunity, and the experiments that test each solution. See [01 — Product Discovery](../docs/01-product-discovery.md).

**Phantom dependency** — A package your code imports but never listed in package.json. It resolves only because some other dependency happened to pull it into a flat node_modules, and it breaks mysteriously when that package updates or drops it. See [04 — Project Setup](../docs/04-project-setup.md).

**pnpm** — Same registry and same package.json as npm, but packages live in one content-addressable store on your machine and get hard-linked into each project. Its node_modules layout is strict: only dependencies you actually declared are importable. See [04 — Project Setup](../docs/04-project-setup.md).

**Preview deployment** — A complete, isolated deployment of a single branch at its own URL — automatic per pull request on Vercel. Not the same as staging. See [12 — Staging](../docs/12-staging.md).

**Problem interview** — A short interview — 20 to 30 minutes — focused entirely on past behaviour around a problem. No pitch, no product, no hypotheticals. See [01 — Product Discovery](../docs/01-product-discovery.md).

**Product discovery** — The work of testing whether a problem is real, whose it is, and how badly it hurts — before any code exists. It is deliberately cheap, because its main output is often the decision not to build. See [01 — Product Discovery](../docs/01-product-discovery.md).

**Product roadmap** — An ordered statement of intent — usually now, next and later — saying what is being built and what is waiting. The good ones name what has to be true before an item moves up, rather than naming a month. See [02 — Product Planning](../docs/02-planning.md).

**Product vision** — A short description of what the product becomes if it works — not a feature list, and not a slogan. One paragraph is the right length. See [02 — Product Planning](../docs/02-planning.md).

**Production-grade** — The state where someone other than you depends on the software working. It is about consequences, not scale: ten paying users make software production-grade; ten thousand on a toy do not.

**Rollback** — Returning production to the last known-good state. On Vercel it is promoting a prior deployment, which takes seconds — but it is not automatic for database migrations, which is why migrations get careful, separate treatment. See [13 — Production Deployment](../docs/13-production-deployment.md).

**Skew protection** — Ensuring a browser still running the previous client JavaScript can talk to the server after a new deploy. Without it, users mid-session hit errors every time you ship. See [13 — Production Deployment](../docs/13-production-deployment.md).

**SLO (Service Level Objective)** — The reliability target you commit to — for example, "99.9% of requests succeed." Meaningful only if you have decided in advance what happens when you miss it. See [15 — Observability](../docs/15-observability.md).

**Smoke test** — A small set of checks confirming the critical paths still work after a deploy. Not comprehensive by design; it answers "is this catastrophically broken?" in under a minute. See [14 — Post-Deployment Verification](../docs/14-post-deployment-verification.md).

**Spike** — A short, deliberately bounded piece of exploration answering one specific question — can this integration do what we need, is this approach fast enough — with a hard stop and a written answer. See [02 — Product Planning](../docs/02-planning.md).

**Survivorship bias** — Drawing conclusions from the visible survivors of a process while the failures are silent. In discovery: interviewing current users tells you why people stay, never why the larger group left or never arrived.

**Switching cost** — Learning a new tool, migrating data, changing habits, and the risk that the new thing is worse. It is paid by the user, not by you, and it is usually larger than builders estimate.

**TAM (Total Addressable Market)** — Total Addressable Market — every person or business who could conceivably buy this, if you had no competitors and perfect reach. Usually paired with SAM (the slice you could realistically serve) and SOM (the slice you could realistically win).

**Traps** — The closing section of every stage doc — the failure modes worth naming. They accumulate from real experience and become the most valuable part of the playbook over time.

**Vertical slice** — Work sequenced so each step goes through storage, logic and interface at once, rather than building each layer across the whole product before starting the next. See [02 — Product Planning](../docs/02-planning.md).

**YAGNI (You Aren’t Gonna Need It)** — You Aren’t Gonna Need It: do not build for requirements you have imagined rather than met. The most common cause of accidental complexity.
