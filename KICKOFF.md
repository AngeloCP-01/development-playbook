# Kickoff: implement the selected DSA Patterns reference

Updated 2026-11-09. Follow [AGENTS.md](AGENTS.md), especially D-99/D-100.

## Selected outcome

The user accepted all fifteen core DSA patterns, JavaScript examples and simple
real-life analogies with "okay lets proceed with that". D-106/D-107 record the
brief and teaching style; D-108 records selection. Implementation is authorized
within this scope. Integration remains a separate decision.

Deliver a standalone DSA Patterns study reference under Algorithms. Each core
lesson connects a familiar story, tiny trace, JavaScript solution, correctness,
time/space reasoning, model interview answer and local attempt-first practice.
The design starts with eight panels and eighteen activities; all fifteen core
patterns ship together. These exact layout/activity choices are coordinator
implementation decisions. Use existing study components and preserve all stages
and thirty current reference bodies. Finished totals should be 27/31 sheets and
18/18 stages; current application remains 26/30 and 18/18.

## Read before implementing

- [Design and acceptance](docs/superpowers/specs/2026-11-09-dsa-patterns-design.md).
- [Compact implementation plan](docs/superpowers/plans/2026-11-09-dsa-patterns.md).
- [Primary sources, problems and analogy seeds](reference/dsa-patterns-source-research.md).
- [Existing study/render/test patterns](web/PATTERNS.md#focused-study-references--studysheet).

The design fixes stable topic hashes, published function contracts, interval/index
conventions, source linking and selected Kahn ordering. The plan names content
modules, actual-sheet render/example checks, discovery/count updates and the
DSA addition to development-console's nested-disclosure sweep. No new renderer,
runner/scoring/persistence, dependencies or numbered stage.

## Starting point and session settings

Documentation branch: `docs/2026-11-09-dsa-patterns-research`.
Local develop base: **c996177d8e4fbc4c6f9b3659c10197dc7eb8fbc9**.
Research **dbeafbf**, records **3919821**, teaching clarification **45ca5f8**.
Planning starts from **45ca5f8**; use the documentation branch's final committed
HEAD including this handoff, record its exact SHA, then create
`feat/dsa-patterns-reference`. Do not start from develop without these records.

Next task/model: implement W-6.3v in a fresh user-selected
**GPT-6.1 Sol / High** session. Use one implementer and the scoped executing-plans
workflow, then one independent final **GPT-6 Astra / Low** content/page/branch
review. D-99 does not require task agents or per-task/design review rounds.

Return branch/commit, actual checks, unresolved issues, preview URL and the
implementation session reference to coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6 Astra / Low**.
The coordinator reads the actual diff and session before relying on the evidence.

## Recovery and evidence

Planning changed documentation only. The tracker completion entry holds current
link/ledger/whitespace checks; the research record owns factual source findings.
No new app/algorithm execution is claimed. Prior identified app evidence is
retained for unchanged application **7975be9** / develop **c996177**.

At each implementation handoff name completed families, remaining topics,
actual published-code checks and changed section hashes. Complete the final gate
once, the dev-console sweep once, affected theme/width/keyboard checks and one
independent final review. Preserve a running preview for the user. Obtain
separate approval before any no-ff develop merge; main belongs to the user.

Other language sheets, broader JavaScript teaching, union-find/advanced DSA,
push and production promotion remain separate. The old JavaScript production
preview may still be at http://localhost:3100/reference/javascript#async;
preserve the user's existing servers when choosing verification ports.
