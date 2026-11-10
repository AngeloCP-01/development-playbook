# Kickoff: implement the Node.js & Express study reference

Updated 2026-11-10. Follow [AGENTS.md](AGENTS.md), especially D-99/D-100.

User selected W-6.3u.2: review/interview preparation, mandatory fundamentals,
many worked examples and subsections wherever needed. D-109 records the brief.

Start from the exact committed tip of `docs/2026-11-10-node-express-study`
(confirm with git). Source/design/plan commit: **c6f2383**. Documentation base: **e28401e** on develop. Create
`feat/node-express-study`. Application is unchanged by this handoff: **27/31**
references and **18/18** stages. DSA is complete, including both review corrections.

Read:

- [Primary-source research](reference/node-express-source-research.md)
- [Design](docs/superpowers/specs/2026-11-10-node-express-design.md)
- [Compact plan](docs/superpowers/plans/2026-11-10-node-express.md)
- [Study/render/test patterns](web/PATTERNS.md)
- [Task scope](docs/task.md), W-6.3u.2; [tracker](docs/tracker.md), D-109

Fill existing `/reference/express`, title **Node.js & Express**, Languages group.
Reuse StudySheet/TeachingBlock/SheetActivity and one canonical web/Markdown source.
Initial design: twelve panels/38 topics, an explained worked example/interview
answer/local activity per topic, a recurring small API and mixed interview
capstone. Split at teaching seams when measured; do not shrink fundamentals.
End at **28/31** drawn/registered references, **18/18** stages; other thirty
sheet bodies unchanged. No new renderer, app backend or reader code runner.

Verify actual displayed examples with Node **22.23.4**, explicit CJS/ESM context
and Express **5.3.0**, an exact devDependency only for tests. No Node/tooling
upgrade. Use isolated children/temporary files/loopback port 0 and guaranteed
cleanup. Test denied/malformed/failure paths, response lifetime and security
boundaries; no live credentials/services. Example coverage must fail when new
code is unclassified. No duplicate maintained backend implementation.

Use one implementer in a fresh user-selected **GPT-6.1 Sol / High** session.
No per-task agents/review rounds. Obtain one independent final
**GPT-6 Astra / Low** content/page/branch review, run final web gate and development
console coverage including every new nested topic/solution. Preserve user servers.
Use AGENTS instructions for new behavior versus prose; read Next/Context7 guides
only when framework APIs change. All new claims and executable snippets need
appropriate source/behavior checks before delivery.

Return branch/application/records SHAs, actual commands/counts/exits, unresolved
issues and implementation thread reference to coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6 Astra / Low**.
Read any referenced implementation/reviewer thread before relying on its evidence.
Integration into develop needs separate user approval; no merge/push/promotion.
Python, Java, Spring Boot and advanced Node/Express follow-ons stay separate.

Documentation-only verification: tracker-ledger **2/2**; **22 introduced/local
handoff links across 6 files**; **12 panels / 38 unique topic IDs**; whitespace
check, all exit 0. Source record and design received coordinator self-review and
one humanizer editing pass. Application/generated output remains unchanged from
**e28401e**; all proposed executable examples are still unexecuted. Prior app
checks are retained, not new evidence for the Node/Express page.
