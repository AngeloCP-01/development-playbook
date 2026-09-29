# Stage 16 — incident management document repair

Date: 2026-09-29. Status: approved in conversation; the user's “continue” followed
the written-spec review request. Implementation plan awaits its own review.
Scope approved in conversation: repair the document before building the interactive
port, for solo developers and small teams. This spec covers that repair. The port
gets its own design after the corrected document passes the repeatable assessment.

## Problem

The current stage gives a reader useful starting advice, but the initial cold-reader
assessment could not turn it into a complete response to a stalled background job.
Both readers found missing recovery criteria and an escalation contact list without
an escalation procedure. The document also includes security breaches while saying
restoration always comes first.

Evidence and exact rerun instruments are in
[the initial findings](2026-09-29-stage-16-cold-reader-findings.md). Findings I1–I6
and M1–M3 are the acceptance queue. Relevant document sections are **The order that
matters**, **First five minutes**, **Diagnosing**, **The runbook**, **Writing it down**,
**Artifacts**, and **Definition of done**.

The visible stage summary repeats the restoration-first instruction at
`web/src/lib/stages.ts:180`. Its correction belongs with the document repair, even
though the interactive port is later. This is a deliberate content correction, not
a new rule synchronizing summaries with markdown subtitles; D-36 still applies.

## Goals

- Give a responder a usable first-response path when the homepage is healthy but a
  customer workflow is failing, including background jobs and unknown impact.
- Separate the investigation needed to choose mitigation from deeper causal analysis.
- Explain when rollback is relevant, compatible and safe, and what to do when it is not.
- Cover suspected compromise as a containment and escalation exception.
- Teach escalation when a teammate is unavailable and communication when cause or
  recovery time is unknown.
- Distinguish recovery of customer service from permanent correction and completed
  follow-up. Outstanding queued work must receive an explicit disposition.
- Provide a consistent worked incident, usable runbook and postmortem, with named
  owners and dated actions in the fictional example.
- Add the required AI section and close the assessment findings with evidence.

## Non-goals

- The interactive port: designing panels against unsettled prose would repeat work.
  `ready` stays false at `web/src/lib/stages.ts:183`; no component or step registration.
- W-6 publication: source selection and transcription follow the completed stage.
  No image conversion, new sheet registration or displayed plate in this round.
- An enterprise incident-command manual: the target reader may be the only responder.
  Team roles extend that starting point rather than becoming prerequisites.
- A forensic or legal-response handbook: teach the handoff and containment boundary;
  specialized investigation and notification obligations need their own expertise.
- A generic queue replay command: retry safety depends on the service's side effects
  and provider semantics, so an invented universal command would be misleading.
- New persistence, worksheet UI, infrastructure or dependencies: this round repairs
  teaching and the tests that guard it.

## Constraints

Keep the house top-level sections, stage title and cadence. Stage numbers remain
filing codes. Keep platform details tied to the existing Vercel/AWS coverage in
stages 13–15; read their relevant sections before drafting cross-references.

Source severity labels and response times vary. Retain the stage's Critical/Major/
Minor vocabulary, explain it as a local policy example, and teach reassessment when
impact is uncertain. Do not present a vendor's SEV numbering or a 15-minute target
as a universal standard.

The external sources inform the teaching; they do not override contradictory local
evidence. The NovelVista image delays communication and omits recovery validation
from its top row. Those choices will not define the stage's process.

Use TDD for the document's regression guards, metadata change and glossary changes.
Read installed Next.js guidance before any framework code; no framework changes are
expected here. Do not run mutating operational examples against real infrastructure.

## Architecture

### Document structure and response model

Preserve `## The work` and organize it into the following lookup sections. These are
document headings, not a promised number of future interactive steps:

1. **The order that matters** — limit harm, investigate enough to choose an action,
   mitigate, validate recovery, then continue causal analysis and prevention.
   Communication and the incident record run throughout.
2. **First response: confirm impact and severity** — verify the affected customer
   operation, not only the homepage; start an incident record and use provisional
   severity when scope is unknown. Investigating does not require waiting for certainty.
3. **Choose a mitigation** — decision table for rollback, feature disablement, capacity
   changes, dependency degradation and fix-forward. Each row states preconditions,
   possible harm, stop conditions and how to check its effect.
4. **When access may be compromised** — limit ongoing unauthorized access, preserve
   available evidence without delaying urgent containment, use trusted recovery access,
   and involve appropriate security/provider support. Restoring availability alone
   does not establish that a system is safe.
5. **Escalate when help is unavailable** — primary and backup contacts, agreed
   acknowledgment deadline, next contact/provider route, and what context to send.
   A solo responder keeps one incident log and schedules brief updates while working.
   Handoffs need an explicit receiving owner, current state and next action.
6. **Communicate while the incident is open** — short initial, progress, monitoring
   and resolved examples. Separate known impact, hypotheses and unknowns; commit to
   the next update rather than inventing a recovery estimate. An accessible existing
   channel satisfies the minimum; building a status site is not required mid-incident.
7. **Diagnose with evidence** — hypothesis, supporting/refuting observation and next
   check; inspect dependency status early without treating it as proof. Avoid claiming
   the first observed error is necessarily the cause.
8. **Verify recovery and account for delayed work** — check the affected operation,
   errors and latency, plus backlog progress and side effects. A provider green status
   is supporting evidence only. Uncertain outcomes must be reconciled before replay;
   do not repeat irreversible operations to test whether they succeeded.
9. **Write the postmortem and track follow-up** — impact interval, evidence-based
   timeline, contributing factors, detection gaps, unresolved questions, owners,
   dates and completion evidence. Follow-up can remain open after service recovers;
   unknown provider internals must not be replaced with a fabricated root cause.
10. **Prepare and rehearse the runbook** — owner, last validation, required access,
    dashboards, symptom checks, safe action conditions, escalation, recovery checks
    and an out-of-application location. Include a completed example and a reusable
    skeleton with visibly service-specific fields.
11. **AI in incident management** — use the available systematic-debugging skill for
    hypotheses and read-only evidence organization; draft timelines and updates from
    cited facts. Require human review of operational changes, protect secrets and
    customer data, and label inference. Do not imply an AI tool has live access merely
    because the document names it. Verify any named integration before prescribing it.

The Artifacts, Definition of done and Traps sections must agree with this model.
Group done criteria into service recovery and follow-up closure. A known mitigation
can restore service while investigation continues. If work is still delayed, say so;
do not label the whole incident resolved merely because new requests succeed.

### Worked example and held-out assessment

Use a fictional appointment-reminder service whose messaging provider degrades.
Carry the same timestamps, evidence and customer impact through its updates, runbook
and postmortem. Define the example's retry/idempotency behavior explicitly; do not
assume that a timeout means a reminder was not sent. Its completed action table has
fictional owners, due dates and checks showing what completion means.

Keep Parcel, the assessment's carrier-label scenario, out of the teaching example.
Reusing Parcel as the example would let the rerun copy instead of testing transfer.
The security exception gets a short separate counterexample because a provider
outage cannot demonstrate compromised access honestly.

### Files and interfaces

| File | Responsibility |
|---|---|
| `docs/16-incident-management.md` | Canonical teaching and worked artifacts |
| `web/src/lib/stage-16-structure.test.ts` (new) | Section-scoped guards for the repaired teaching and example invariants |
| `web/src/lib/stage-metadata.test.ts:50` | Add stage 16 to the explicit AI-section guard before adding its prose |
| `web/src/lib/stages.ts:180` and its tests | Replace the unsafe unconditional summary, preserving title/cadence/readiness |
| `web/src/lib/terms.ts` and term tests | Define introduced jargon only where readers need it |
| `reference/glossary.md` | Regenerate through `pnpm gen:glossary` if terms change |
| `reference/cheatsheet-sources.md` | Preserve provenance, intended use and image caveats |

`web/src/lib/stage-15-structure.test.ts:1` is a local precedent for markdown tests,
not a parser to copy blindly: fenced template headings must not terminate outer
sections. Prefer checking relationships within the relevant example to matching
incidental words anywhere in the file. No public component interface changes.

### Sources and rejected alternatives

The six gathered pages remain in the source ledger. Rootly and Atlassian inform
coordination; Runframe supplies communication patterns; PKWARE identifies the
security boundary; NovelVista supplies a workflow and service example to critique.
SlideTeam remains a supplied attribution with an inaccessible page and a placeholder
slide, so it cannot substantiate an operational procedure.

Two primary references checked during specification add independent grounding:
[Google SRE incident response](https://sre.google/workbook/incident-response/)
for coordination and a working incident record, and
[Google SRE postmortem practice](https://sre.google/workbook/postmortem-culture/)
for learning and follow-up. Paraphrase only what supports this audience; the source
ledger records these alongside the user-gathered material.

A wording-only patch was rejected because it would leave the recovery and escalation
artifacts unusable. A full enterprise manual was rejected because its staffing
assumptions would exclude the primary reader. A faithful graphic transcription was
rejected because the source images contain omissions and contradictions.

## Testing

Write the failure first and retain raw RED and GREEN output. Guard I1–I6 and M1–M3
with section-scoped assertions and example consistency checks where mechanically
testable. Do not pretend keyword presence proves incident-response correctness.
Cold-reader reruns and independent review test that larger claim.

Test that the worked action items each have an owner, due date and completion check;
that communication examples distinguish unknown cause/ETA from a next-update time;
and that recovery and follow-up criteria remain separate. Verify fenced templates
are actually inspected rather than skipped or mistaken for outer document sections.

Add stage 16 to the AI-section test before its section exists. Test the changed
summary against its intended harm-limiting message while leaving the D-36 separation
between metadata and prose intact. Any glossary changes use existing generation and
usage tests. Perform teeth checks per fix; revert each mutation immediately and
confirm only its targeted regression guard fails.

## Verification

1. Rerun both cold-reader instruments verbatim with fresh readers restricted to the
   revised stage. Report each original finding closed, partial, open or a justified
   boundary, and list new findings separately. A new scenario is not a valid rerun.
2. Reserve a fix wave and repeat assessment on the wave's changes. Run an independent
   whole-branch review after corrections, including the examples and test assertions.
3. Verify every retained operational command against current official documentation.
   If executable snippets are introduced, execute them in an isolated local fixture
   where possible. Static CLI shape checks are not evidence of real rollback behavior;
   report any unexecuted operational paths explicitly.
4. From `web/`, run format:check, lint, typecheck, test, build and the production audit.
   Run test:dev-console once for the stage round. The visible summary changes, so
   inspect its wrapping at narrow width and both themes; exercise changed glossary
   content if terms are added. Record fresh evidence rather than prior stage counts.
5. Apply the humanizer pass to the revised document and plan. Verify local links,
   regeneration results, and the final diff. Do not claim the unbuilt port is complete.

## Documentation updates

Update the initial findings with dated rerun results without erasing the baseline.
Record scope, evidence and Deferred items in task/tracker, and refresh KICKOFF to the
actual branch state. Source additions stay attributed even if a source contributes
no final text. Commit specs/plans separately from implementation. Merge requires the
user's approval, targets `develop`, and does not promote production.

## Risks

The document can grow into a process manual that is hard to consult. The headings-only
rerun tests lookup; avoid adding policy detail that does not change a reader's action.
The port's eventual panel budget is measured during that separate round, not inferred
from these eleven document headings.

Prescriptive examples can create false confidence. Explicit preconditions, evidence
and unknowns matter more than a universal timer or severity code. The appointment
example must not imply all providers offer identical idempotency guarantees.

Markdown tests can pass on accidental words or examples they never parse. Scope them,
mutate the relevant content for teeth checks, and let independent readers challenge
the actual decisions. A passing structural suite alone cannot close the findings.
