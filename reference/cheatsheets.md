# Cheatsheets

<!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.
     Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->

Lookup material rather than reading material. A stage teaches a decision; a
sheet answers what that command was.

Drawn: 1 of 11. A sheet listed as not drawn is
registered on purpose — the gap is the point, so it can be seen and filled.

| Sheet | Group | Stage | Status |
|---|---|---|---|
| Software Architecture Patterns | Architecture | 03 | Drawn |
| Design Patterns | Architecture | 03 | Not drawn |
| API Design | Architecture | 03 | Not drawn |
| Git Commands | Git | 04 | Not drawn |
| Git Branching & Conventions | Git | 04 | Not drawn |
| Coding Standards | Standards | 05 | Not drawn |
| JavaScript | Languages | — | Not drawn |
| Python | Languages | — | Not drawn |
| Java | Languages | — | Not drawn |
| Spring Boot | Languages | — | Not drawn |
| Express & Node | Languages | — | Not drawn |

---

## Software Architecture Patterns

Six ways to arrange a system, and what each one costs you.

Belongs to [03 — Architecture](../docs/03-architecture.md).

### Event-driven

Components communicate through events.

- **Event producer** — Emits events without knowing who consumes them. — The producer must not care how many consumers exist.
- **Event broker** — Holds the ordered stream — event 1 through event N. — Consumers read at their own pace, or replay from the start.
- **Event consumers** — Independent subscribers, each reacting to what it cares about. — Adding a consumer should not require touching the producer.

### Layered

Organize system into layers with separation of concerns.

- **Presentation layer** — What the user touches. — Depends downward only.
- **Business / application layer** — The rules that make this system this system. — The layer worth protecting from the other three.
- **Data access layer** — How persistence is reached, not where it lives. — Swapping the store should stop here.
- **Persistence layer** — The store itself. — The bottom of the stack.
- **Infrastructure** — Cross-cutting concerns every layer talks to. — Logging, config, auth — the things that refuse to layer.

### Monolithic

All components built and deployed as a single unit.

- **One deployable** — Posts, comments, groups, media and live streaming ship together. — One team, one release cadence, no distributed-systems tax.
- **One database** — Every feature reads and writes the same store. — Transactions across features stay trivial.
- **The cost** — Any change redeploys everything. — It bites when teams outgrow one release train.

### Microservices

Application is composed of small, independent services.

- **API gateway** — One entry point in front of many services. — Clients should not know the service topology.
- **Service per capability** — Catalog, cart, discount and order each deploy alone. — Teams need independent release cadence.
- **Database per service** — Each service owns its own store — four services, four databases. — Shared tables reintroduce the coupling the split was meant to remove.

### MVC

Separate application into Model, View and Controller.

- **View** — Renders state and forwards user actions to the controller. — Holds no rules of its own.
- **Controller** — Receives the action, requests data, renders the view. — The traffic director, not the brain.
- **Model** — Fetches and returns data, and updates the controller. — Where the rules and the persistence live.

### Master-slave

Distribute read/write workload between master and slaves.

- **Master (primary)** — Takes every write. — One writer keeps ordering simple.
- **Slave (replica)** — Serves reads, fed by replication from the master. — Read volume is the bottleneck, not write volume.
- **Replication lag** — A replica can answer with data the master already changed. — The trade this pattern asks you to accept.

Source: Software Architecture Patterns — Sathish Kumar Subramani.

## Design Patterns

The Gang of Four set, grouped by what each one is for.

Belongs to [03 — Architecture](../docs/03-architecture.md).

*Not drawn yet.*

## API Design

From HTTP fundamentals through versioning, auth and rate limits.

Belongs to [03 — Architecture](../docs/03-architecture.md).

*Not drawn yet.*

## Git Commands

The ones worth memorising, and the ones worth looking up.

Belongs to [04 — Project Setup](../docs/04-project-setup.md).

*Not drawn yet.*

## Git Branching & Conventions

Trunk-based against GitFlow, and the commit format this repo uses.

Belongs to [04 — Project Setup](../docs/04-project-setup.md).

*Not drawn yet.*

## Coding Standards

Naming, structure and the smells worth refactoring on sight.

Belongs to [05 — Development](../docs/05-development.md).

*Not drawn yet.*

## JavaScript

Array methods, async semantics, and the event loop.

*Not drawn yet.*

## Python

Data structures, comprehensions, and the standard library worth knowing.

*Not drawn yet.*

## Java

Collections, streams, and how the JVM spends memory.

*Not drawn yet.*

## Spring Boot

Annotations, bean lifecycle, and where configuration comes from.

*Not drawn yet.*

## Express & Node

Middleware order, routing, and what blocks the event loop.

*Not drawn yet.*
