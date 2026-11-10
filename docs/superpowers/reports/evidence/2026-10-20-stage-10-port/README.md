# Stage 10 port evidence

[Execution report](../../2026-10-20-stage-10-port-execution.md) gives the results and their limits. [Coverage](../../../../stage-10-status.md) maps the canonical chapter to the twelve public panels.

`execution-workspace.tar.gz` preserves the application and execution evidence from the plan-owned workspace, including raw terminal output, task briefs/reports/reviews, sensitivity mutations, source identities, browser snapshots, screenshots and the two frozen reader instruments. It includes failed attempts as well as successful runs. The [manifest](manifest.json) records every member's path, byte count and SHA256, plus the compressed archive's SHA256. Archiving verifies every member against its source bytes before any scratch cleanup.

Nine full third-party page snapshots have a separate local archive, verified before scratch cleanup. The manifest records its location and hashes. Their URL/title/date/navigation results and concise source checks remain in the portable archive; terminal output, application snapshots, reader artifacts, reviews and sensitivity evidence are all included.

The closing archive includes the Task 9 denied-console supplement, completed combined whole-branch review, the single final fix wave, targeted Q3 recheck and clean scoped re-review. The original blind 4 HIT / 1 MISFILED remains alongside the later targeted HIT. Pre-cue broad checks and final affected checks retain their own source identities. [Closure verification](closure-verification.json) records independent member/hash and source-preservation checks.

Paths inside the archive are relative to `.superpowers/sdd/2026-10-20-stage-10-interactive-port/`. Reports keep those original paths so command output and historical citations retain their meaning. Read a member without unpacking the workspace:

```bash
tar -xOf execution-workspace.tar.gz task-9-report.md
tar -xOf execution-workspace.tar.gz progress.md
```

Tasks 1 and 2 originally committed evidence under `.superpowers/`. Those commits remain in history; this archive carries their final bytes with the other tasks. The former scratch paths are retired only after the manifest check.

The completed chapter round has its own [evidence archive](../2026-10-20-stage-10/). Application checks here concern the feature tree, rather than the deployed site. Integration, deployment and W-6 publication remain deferred.

The user subsequently approved local integration as merge `7819457`; see the [integration report](../../2026-10-23-stage-10-integration.md). Its provenance records the external captures' new verified parent-repository location before temporary-worktree cleanup. The archived implementation checkpoint and manifest retain their historical bytes. Deployment and W-6 publication remain deferred.
