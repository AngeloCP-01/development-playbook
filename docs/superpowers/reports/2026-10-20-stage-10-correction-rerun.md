# Stage 10 corrected-chapter cold-reader recheck

Date: 2026-10-20. Fresh readers reused the exact [baseline instruments](2026-10-20-stage-10-cold-reader.md), with no plan, spec, research or previous findings. The completeness reader read the scenario then the frozen chapter. The lookup reader read headings and questions only, sent its five selections, yielded, and received the body only after those choices were recorded. Readers had no browsing or write task.

## Frozen input

Chapter at `d2a5e4ff34cbea5a640d41bd88fc8659616524bc`, unchanged at Task 4 base `012f165`. SHA-256: `46fa547445dcc3bd94967a8bfa86ba0b0564f5e1bdde4726257750c8bc7eaac3`. Sixteen navigation headings exclude fenced README/ADR specimen headings. No research appendix remains. [Snapshot, headings, scenario, questions and phase-one selections](evidence/2026-10-20-stage-10/cold-reader/) are retained.

## Lookup result

| ID | Frozen first heading | Result | Answer found there |
| --- | --- | --- | --- |
| S1 | Keep the README usable | HIT | Required setup facts, expected result and fresh-clone check are colocated. |
| S2 | Record decisions and supersede them visibly | HIT | ADR anatomy/statuses, new record, dated old-record notice, reciprocal links and decision-index update. |
| S3 | Choose the document for the reader’s task | HIT | Exact type/default/allowed-value lookup belongs in reference. |
| S4 | Update and verify documentation with the change | HIT | Configuration/response rows map authoritative facts to documents, checks, owners and triggers. |
| S5 | AI in documentation | HIT | Named source review; read/compile/execute distinction; command, revision, environment, observed result and limits. |

Actual result: **5 HIT / 0 PARTIAL / 0 MISFILED / 0 MISS**, compared with baseline **0 HIT / 3 PARTIAL / 0 MISFILED / 2 MISS** for these same five questions. This measures these lookups, not a general chapter quality score. The reader preserved every frozen selection and reported no missing answer. Missing real setup commands, named project owners or validation records are project facts, not missing guidance.

## Completeness artifact attempt

The independent reader reported **no confirmed teaching defect**. The following retains its artifact attempt in compact form; placeholders mark absent Toolshare facts, not facts supplied by the controller.

Smallest set: README with architecture and release/support routes; configuration/response reference; replacement ADR alongside the preserved predecessor; safe `.env.example`. Keep release/support inside the README if short. No separate tutorial, contributing guide, changelog or troubleshooting document is required yet.

### README draft

```markdown
# Toolshare
Toolshare is a neighborhood tool-lending web app. Members reserve tools;
volunteers record pickup and return.

## Run locally
Prerequisites/versions, repository/clone command, installation/startup commands:
[PROJECT FACTS MISSING]
Safe configuration source/access: [PROJECT FACTS MISSING]
REMINDER_QUEUE_URL: see configuration reference.
Local address, expected startup result, first useful check: [FACTS MISSING]

## Architecture
Members reserve tools; volunteers record pickup and return.
Reminder sending changes from direct provider calls to a durable queue after
provider timeouts left delivery uncertain.
Current queue components, storage and external dependencies: [FACTS MISSING]
Old and replacement ADR links: [ASSIGN ACTUAL PATHS]
Owner: change maintainer [NAME MISSING]. Review on boundary/dependency change.

## Release and support
Permissions, deployment/rollback commands, compatibility limits, logs,
health checks and support route: [PROJECT FACTS MISSING]

## Setup verification
NOT EXECUTED. A second volunteer must attempt a fresh-clone setup without
private instructions. Record revision, prerequisites, configuration source,
exact commands/environment, expected/observed results and first unresolved step.
```

The reader calls this a handover draft and missing-information list, not a runnable or verified guide.

### Replacement ADR and history draft

```markdown
# ADR NNN: route reminder sending through a durable queue
Date: [DECISION DATE MISSING]
Status: [ADOPTION STATUS REQUIRES CONFIRMATION]
Supersedes: [LINK TO EXISTING DIRECT-SEND ADR]

## Context
Direct reminder-email calls encountered provider timeouts that left delivery
uncertain. This change replaces direct sending with a durable queue.

## Decision
Route reminder sending through the durable queue; add REMINDER_QUEUE_URL.

## Reasoning
The supplied reason is uncertain delivery following provider timeouts.

## Consequences
Update setup, release, architecture and support documentation.
Queue guarantees, timeout/duplicate handling, visibility and operational
procedures: [IMPLEMENTATION FACTS MISSING]
No delivery improvement or failure reduction has been measured in supplied facts.

## Alternatives
Continue direct sending: previous choice.
Other evaluated alternatives and rejection reasons: [DECISION FACTS MISSING]
```

Preserve the old text/date/reasoning. Append a dated “Current status: Superseded” notice with the actual replacement link, put the backlink in the new record and update an existing decision index. The record number, actual paths, adoption status and date remain unknown; historical acceptance is not rewritten.

### Reference and comment draft

| Item | Supplied fact | Still required |
| --- | --- | --- |
| REMINDER_QUEUE_URL | Added | Type/format, requiredness, default/absence, empty/null behavior, source/revision |
| Retry option, exact name unknown | Documented count changes 3→5 attempts | Exact option, meaning of attempt, whether default/configured value, allowed values, implementation/test |
| Reminder-status response field, exact name unknown | Added | Endpoint, type/values, presence/null/omission, serializer/schema, version |

The reader explicitly rejects inferring “five retries” or guaranteed delivery from five attempts.

```dotenv
# Documentation template only; usable safe value/requiredness are unknown.
# Blank is not asserted to be valid.
REMINDER_QUEUE_URL=
```

```ts
// Provider timeouts left reminder delivery uncertain; this queue boundary
// implements the replacement for the earlier direct-send decision.
```

This is the reader’s illustrative rationale comment, subject to placement review. It makes no queue guarantee or invented explanation for five attempts. Both blocks above are reader artifacts, not runnable Toolshare implementation.

### Change/release checklist attempt

Every check is pending. Owner names remain missing project facts.

| Artifact | Owner / trigger | Pending check |
| --- | --- | --- |
| Configuration reference / .env.example | Maintainer / config change | Compare actual handling; test missing/invalid behavior if claimed |
| Retry reference and affected instructions | Maintainer / option change | Find old option values; confirm five against implementation and behavioral evidence |
| Response reference and examples | Contract owner / response change | Check name, shape, absence against schema/serializer; inspect generation if it exists |
| Architecture / ADR | Maintainer / boundary change | Trace current relationships; verify reciprocal links/history |
| README | Second volunteer / setup change | Fresh clone; record revision, commands, environment, observations |
| Release/support | Release maintainer / operational change | Supply and safely exercise release, rollback, logs and health checks |
| Publication | Named reviewer / publication | Compare source-backed claims; remove contacts, credentials/private payloads; inspect generated examples |

Release procedure draft: identify revision and authorized operator; follow the actual configuration/release procedure (missing); run real health/support checks (missing); record commands/environment/results; use the verified rollback procedure and limits if required (missing). Supported release facts are the architecture change, added configuration, count change and response-field addition. Improved delivery and incident recovery are **not established**.

The reader identified no missing chapter teaching. It named successful transfer under all seven relevant teaching headings. Missing commands, exact contracts/validation, decision metadata, owner names and observed results remain facts to obtain from Toolshare.

## Finding disposition

| Baseline finding | Corrected teaching and evidence |
| --- | --- |
| C1: configuration mistaken for enforcement | **Update and verify documentation with the change** explicitly requires an invoked validator; scoped guard and false-enforcement mutation. |
| C2: missing option/response update path | **Keep architecture and contract references current** gives exact-value/absence specimens; update matrix names facts/documents/checks/owner. Contract guard and S4 HIT. |
| C3: private examples | **AI in documentation**, **Artifacts**, **Definition of done** and **Traps** require synthetic data and publication review. AI guard and completeness artifact attempt. |
| X1: preserve history versus delete old docs | **Record decisions and supersede them visibly**, **Choose what to omit or archive** and closing checks distinguish history from misleading current instructions. Lifecycle/history guards and old→new link mutation. |
| X2: why-only documentation | Reader-task table allows instruction, factual reference and explanation; why heuristic is scoped to implementation comments. Selection guard and S1/S3 HIT. |
| S1–S5: incomplete or undiscoverable answers | Frozen headings and observed results above directly answer all five. |
| C4: full commit-writing specimen | Retained boundary: **Commit messages preserve change context** links Stage 05 and explains when a body is useful. A second commit-writing lesson remains deferred. |

The controller checked these claims against the actual chapter, rather than inferring completeness from test strings. Toolshare does not provide real commands, URLs, validator behavior, field types, delivery guarantees, actual test results or measured recovery. Demanding those facts would require invention, not chapter correction.

No substantive correction wave was needed after this rerun. The independently read corrected chapter is the same source proven by Task 3; no new executable example was introduced.

Deferred: interactive-port design and implementation, W-6 companion publication, integration and deployment.

Independent Task 4 evidence review: **review clean**, no Critical, Important or Minor finding. Exact instruments, frozen choices, all 16 headings and snapshot hash match; each reported HIT is directly supported; artifact attempts retain missing facts, pending checks and unknown metadata; no source/guard/glossary change occurred from Task 4 base.
