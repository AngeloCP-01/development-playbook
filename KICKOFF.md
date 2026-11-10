# Kickoff: implement deeper Node fundamentals

Updated 2026-11-10. Follow [AGENTS.md](AGENTS.md), D-99/D-100/D-110/D-111/D-112.
User accepted the deeper Node-foundations direction with "okay proceed".
Integration remains on hold until the revised teaching is reviewed.

Keep branch **feat/node-express-study**. Start from this documentation handoff's
exact committed tip (confirm git); design/plan **2b33da2**, docs start **49a101b**,
application baseline
**e852170**. Earlier six corrections were accepted at **e3dac11** and stay closed.
The unrelated untracked `.pnpm-store/` stays untouched and out of commits.

Read:

- [Depth design and concrete event-loop specimen](docs/superpowers/specs/2026-11-10-node-fundamentals-depth-design.md)
- [Compact depth implementation plan](docs/superpowers/plans/2026-11-10-node-fundamentals-depth.md)
- [One source record](reference/node-express-source-research.md), including NF1–NF15
  and the coordinator's five executed design-probe contracts
- [Existing study/render/test patterns](web/PATTERNS.md)
- [Task](docs/task.md), W-6.3u.2; [tracker](docs/tracker.md), D-111/D-112

Reader outcome: explain where JavaScript/native work runs, walk the event loop,
reason about queues/timers, distinguish I/O/CPU/worker/process work, repair async/
stream failures and explain resource lifetime. Teach mechanisms before terminology.
The design's complete I/O walkthrough is the required depth, not an output-only
snippet. At least six activities require actual code/repair with executable,
explained solutions. Preserve the existing Express/security/lifecycle corrections.

Initial design: **15 panels / 49 topics**, with at least one owned activity per
topic. Preserve all twelve existing hashes and 38 topic IDs. Add event-loop,
work-and-workers and process-and-memory; scheduling moves from async-and-events
into event-loop (changed DOM prefix, existing section links retained). Rewrite/
deepen runtime, async/events and files/streams, and connect raw HTTP to the model.
Counts are not a ceiling; split at a measured teaching seam rather than cut depth.
Reference totals stay **28/31**, stages **18/18**; other thirty bodies unchanged.

Use Node **22.23.4**, existing exact dev-only Express **5.3.0**; no new dependency,
runtime upgrade, renderer, backend or reader runner. Every displayed file/helper/
solution belongs to the actual-code classification guard. Execute changed cases
and clean up workers/children/files/streams. Assert guaranteed relations, not
elapsed time, global FIFO, GC timing or both nondeterministic orders appearing.
Keep process-exit tests free of harness-owned active handles that alter the lesson.

Execute in one fresh user-selected **GPT-6.1 Sol / Medium** session. Use the
compact plan inline; no per-task agents/review rounds. Run focused checks while
editing, the final web gate once and development-console once. Preserve servers.
One independent final **GPT-6.1 Sol / High** content/page/branch review must assess
the design's six transfer tasks using actual page evidence. Green counts alone
cannot establish teaching depth. Leave a live event-loop lesson for reader feedback.

Return branch/application/records commits, old/new hashes, actual checks/exits,
limits/review results and root session reference to coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6.1 Sol / High**.
Read referenced implementation/reviewer threads before relying on their evidence.
Existing implementation thread: **01a1c38c-5adb-7540-b46d-9638153021bc**.
Prior preview: http://localhost:3200/reference/express; verify availability at start.

This handoff changes documentation only. Five design probes passed under Node22;
Worker/stream/lifetime expansion and the actual revised page are not implemented
or verified yet. Retain identified **e852170** evidence for unchanged inputs;
no new full app gate is claimed. No merge/push/promotion. Other language sheets
and deep engine/distributed-system internals remain separate.

Closing documentation checks: tracker-ledger **2/2**, local links/anchors and
15-panel/49-topic scope validation, whitespace, all exit 0. Coordinator self-review
and humanizer pass applied to the source/spec/plan/handoff. Proposed examples
not covered by the five probes remain unexecuted; preserve that distinction.
