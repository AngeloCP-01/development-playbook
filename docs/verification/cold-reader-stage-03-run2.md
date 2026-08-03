# Cold-reader re-run — stage 03, after W-3.1

Method: D-32. One agent, allowed to read only `docs/03-architecture.md`, forbidden its own
architecture knowledge and the web, forbidden from following links to other stages. Same
shift-swap product as the original pass, so the result is comparable to TD-18's baseline.

**Score: 9 CLOSED · 3 PARTIAL · 1 correctly deferred (G9) · 1 closed-but-thin (G5).**
Verdict: PARTIALLY — 13 of 17 Definition-of-done boxes tickable on the first read.

## Per-gap, against TD-18's original 14

| Gap | Verdict | Note |
|---|---|---|
| G1 entity derivation | PARTIAL | Procedure exists; the strike test is one example with no rule, and the input is stage 02's slices rather than a product description |
| G2 role-bearing actors | PARTIAL → **fixed** | Question posed and never answered; no schema anywhere showed a role. Closed by the `memberships` DDL |
| G3 authorization | CLOSED | Three-pattern table; the doc's own example is the reader's product. Open edge: a per-entity answer may need Role **and** Membership together |
| G4 indexes | CLOSED | Rule plus two worked examples plus the cost note |
| G5 conditional uniqueness | CLOSED (thin) | Names the exact rule and the tool. No isolation level, nothing on what to lock |
| G6 deletion | CLOSED | All three of the reader's cases named. Mechanic (`deleted_at` vs status) still unspecified |
| G7 store vs compute | CLOSED | Worked on the reader's hard case. DoD line contradicted the prose — **fixed** |
| G8 date vs timestamptz | CLOSED for the question asked | Breaks on shift scheduling: a 07:00 shift is wall-clock and survives DST. No third case |
| G9 ADR format | OPEN, correctly deferred | Explicit deferral with a stated reason, not an omission |
| G10 one decision | CLOSED | Both directions worked; reader split its list into six ADRs |
| G11 choosing a boundary | CLOSED | Vocabulary rule + owns-what-it-writes + the write half. Letter-vs-spirit ambiguity on "both write" |
| G12 deferral criterion | CLOSED | Stated as a test, then used to kick multi-tenancy off its own list |
| G13 primary key type | CLOSED | Reason and rejected alternative with its cost |
| G14 reversibility test | CLOSED | Promoted to section 1; the two lists are labelled as the test applied |

**Contradictions: resolved.** C1/C2 closed explicitly, and the reader noted the tie-breaker
generalises (stored data beats deferral). A second, smaller one was found and fixed: the DoD's
flat "Derived values computed, not stored" against the prose's store-a-fact-about-a-moment.

## New gaps the round introduced

Fixed in the wave immediately following this report:

- **Roles and tenancy had no DDL anywhere.** The headline finding. The stage raises both, cites
  the shift-swap product three times, and every schema in 871 lines was a single-user invoicing
  app. Both are stored data on every table, the stage's own definition of the most expensive
  thing to get wrong.
- **Idempotency was gated by the DoD and taught nowhere.** The one checkbox the reader flatly
  could not tick.
- **Layered vs hexagonal had no selection criterion** while the DoD required a style be named.
- **API contracts: verb-shaped operations unaddressed** (the reader's product is all verbs), and
  contract granularity undefined, so the reader could not tell whether it had satisfied the
  checkbox or trivially satisfied it.
- **Multi-tenancy filed under "Defer aggressively"** — scanning for tenancy guidance, the reader
  would have found nothing and shipped `user_id`.
- **ER notation had no legend.**

## Still open — recorded, not fixed

- G1's strike test needs a rule rather than one example.
- G8 has no wall-clock / DST case, which is exactly where shift scheduling lives.
- G5 says use a transaction and nothing about isolation or what to lock.
- G6 does not give the soft-delete mechanic, nor its interaction with `ON DELETE RESTRICT`.
- G3: no way to express that one entity needs two patterns in conjunction.
- G11: by the letter of "if two features both write a table, they are one feature", the reader's
  approvals and shifts features collapse; the enforcement paragraph implies "directly".
- Characteristics trace table has 3 rows against a 10-item candidate list, so a reader choosing
  availability, security or evolvability gets the test without material to pass it.
- `text` + `CHECK` versus a native enum is used but never named as a choice.
- No `updated_at` in a stage that argues for auditability.
- "Sketch the system" has no category for a dependency whose failure is total; all three worked
  examples are degradations.
- No table of contents on an 871-line file.

## Consultability

**4 / 5.** Headings are verb phrases in working order and the DoD reads as an index into the
body. Skim-to-answer worked first try for indexes, partial unique indexes, deletion,
store-vs-compute and ADR counting. Misfilings named: multi-tenancy (fixed with a
cross-reference), idempotency, and the characteristics-to-style trace sitting under a different
heading from the conclusion it produces.
