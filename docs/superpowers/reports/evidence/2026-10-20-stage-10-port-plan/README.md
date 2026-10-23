# Stage 10 port plan: static validation evidence

This archive belongs to the written implementation plan, not an executed port.
The manifest hashes the final plan and 33 extracted virtual source files,
including registry overlays. Compiler and lint results are in
[validation-output.txt](validation-output.txt). Proposed tests were not run.

The three helper scripts are stored as .txt files. To reproduce, copy them to
`/private/tmp/stage10-port-plan-2026-10-20/` without the .txt suffix and run the
extractor, then the Node helpers from this worktree's `web/` directory. Their
absolute workspace paths reflect this session; adjust those paths if relocating
the archive. They read the plan and use an in-memory compiler map or lintText;
they do not write application source or execute the proposed tests.

The first lint pass and the wrong-working-directory compiler output are retained
as draft/harness diagnostics. Their line numbers describe that draft, not the
corrected final plan. They are not failures of an implemented application.
