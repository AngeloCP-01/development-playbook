# Stage 10 local integration evidence

The user selected local merge option 1 on 2026-10-23. Merge `7819457` has parents `79f9e31` and reviewed feature tip `81935a6`. The merge tree exactly matches the feature tree; merge-provenance.json records both tree hashes and the 567-input application identity.

merge.log is the full merge output. run-checks.py records the sequential format, lint, generated-route typecheck, complete one-worker test suite and production build commands. gate-results.json and the separate logs retain actual exit codes/output. Existing five-second test limits, snapshots, dependencies and runner configuration remain unchanged.

server-ownership-before-build.json records why only the worktree preview PID 42455 was stopped before `.next` operations. Parent port 3200 remains outside this integration. The merge provenance records the verified external-source copies preserved in the parent repository's ignored `.superpowers/sdd/2026-10-20-stage-10-interactive-port-external-sources/` directory. The earlier archive's historical absolute location is superseded by this preservation record; the captured bytes and SHA-256 are unchanged.

The integration report gives the completed disposition. This evidence concerns a local develop merge; no push or main promotion is included.
