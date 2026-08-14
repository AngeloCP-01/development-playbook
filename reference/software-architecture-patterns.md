# Software Architecture Patterns

Credited on the source graphic to **Sathish Kumar Subramani**.

Transcribed from `reference/Software-Architecture-Patterns.gif`. Every label in the
graphic appears below; the diagrams are Mermaid redraws of the same six panels.

---

## 01 · Event-Driven

Components communicate through events.

```mermaid
flowchart LR
    EP["Event Producer"]

    subgraph BROKER["Event Broker"]
        direction TB
        E1["Event 1"]
        E2["Event 2"]
        EDOTS["..."]
        EN["Event N"]
    end

    subgraph CONSUMERS["Event Consumers"]
        direction TB
        CA["Consumer A"]
        CB["Consumer B"]
        CC["Consumer C"]
    end

    EP -.-> BROKER
    BROKER -.-> CA
    BROKER -.-> CB
    BROKER -.-> CC
```

---

## 02 · Layered

Organize system into layers with separation of concerns.

```mermaid
flowchart TB
    PRES["Presentation Layer"]
    BUS["Business / Application Layer"]
    DATA["Data Access Layer"]
    PERS["Persistence Layer"]
    INFRA["Infrastructure"]

    PRES --> BUS
    BUS --> DATA
    DATA --> PERS

    PRES <-.-> INFRA
    BUS <-.-> INFRA
    DATA <-.-> INFRA
    PERS <-.-> INFRA
```

Each layer hands down to the one below it, and every layer talks bidirectionally to
Infrastructure, which spans the full stack.

---

## 03 · Monolithic

All components built and deployed as a single unit.

```mermaid
flowchart LR
    USER(["User"])

    subgraph MONO["Monolithic Application"]
        direction LR
        POSTS["Posts"]
        COMMENTS["Comments"]
        GROUPS["Groups"]
        MEDIA["Media"]
        LIVE["Live Streaming"]
    end

    DB[("Database")]

    USER -.-> MONO
    MONO -.-> DB
```

---

## 04 · Microservices

Application is composed of small, independent services.

```mermaid
flowchart LR
    U1(["User"])
    U2(["User"])
    GW["API GATEWAY"]

    CATALOG["Catalog Service"]
    CART["Cart Service"]
    DISCOUNT["Discount Service"]
    ORDER["Order Service"]

    CATDB[("DB")]
    CARTDB[("DB")]
    DISCDB[("DB")]
    ORDDB[("DB")]

    U1 -.-> GW
    U2 -.-> GW

    GW -.-> CATALOG -.-> CATDB
    GW -.-> CART -.-> CARTDB
    GW -.-> DISCOUNT -.-> DISCDB
    GW -.-> ORDER -.-> ORDDB
```

Each service owns its own database — four services, four separate `DB` cylinders.

---

## 05 · MVC

Separate application into Model, View and Controller.

```mermaid
flowchart TB
    USER(["User"])
    VIEW["View"]
    CONTROLLER["Controller"]
    MODEL["Model"]
    DB[("Database")]

    USER -.-> CONTROLLER
    VIEW -. "User Action" .-> CONTROLLER
    CONTROLLER -. "Renders View" .-> VIEW
    CONTROLLER -. "Requests Data" .-> MODEL
    MODEL -. "Updates Model" .-> CONTROLLER
    MODEL -. "Fetch Data" .-> DB
    DB -. "Return Data" .-> MODEL
```

---

## 06 · Master-Slave

Distribute read/write workload between master and slaves.

```mermaid
flowchart LR
    CLIENTS["Clients /<br/>Applications"]
    MASTER[("Master<br/>(Primary)")]
    SLAVE1[("Slave 1<br/>(Replica)")]
    SLAVE2[("Slave 2<br/>(Replica)")]

    CLIENTS -. "Read" .-> SLAVE1
    CLIENTS -. "Write" .-> MASTER
    CLIENTS -. "Read" .-> SLAVE2

    MASTER -. "Replicate" .-> SLAVE1
    MASTER -. "Replicate" .-> SLAVE2
```

Writes go to the master only. Reads are served by the replicas. Replication flows
master → slave in one direction.

---

## Closing panel

| | |
|---|---|
| 💡 | Understand the patterns. Build better software. |
| ✅ | Choose the right architecture for the right problem. |
| 📊 | Better structure. Scalable solutions. |
