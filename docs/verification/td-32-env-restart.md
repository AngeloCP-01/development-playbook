# TD-32 — re-running the env-validation check instead of quoting it

Method: a throwaway Next app in a scratch directory outside the repo, carrying
`docs/04-project-setup.md` §5's `env.ts` verbatim and a page that imports `env` at module
scope. Nothing here reads the playbook's own `web/`, which has no `env.ts` and no required
variables to blank.

Environment: macOS, pnpm 10.34.5, zod 4.4.3, Turbopack. Run on **Next 16.2.10**, the
version `web/package.json` pins, and repeated on **16.3.1** with identical results.

**Verdict: TD-32's finding stands and its diagnosis does not.**

## What the tracker says

> **Turbopack does not re-evaluate `env.ts` when `.env.local` changes.** The fix wave on
> `fix/stage-04-doc-corrections` watched it log `Reload env: .env.local` and go on serving
> **200** off the cached module.

## What actually happens

| Scenario | Result |
|---|---|
| Valid value, server running | `200` |
| Blanked, server still running, **first** request after the save | **`200`** |
| Blanked, server still running, every request after that | `500`, `too_small` |
| Blanked, server restarted, first request onward | `500`, `too_small` |

The 500 carries, in the server log:

```
Error [ZodError]: [ { "code": "too_small", "minimum": 32, "path": [ "SESSION_SECRET" ],
  "message": "Too small: expected string to have >=32 characters" } ]
    at module evaluation (lib/env.ts:7:27)
    at module evaluation (app/page.tsx:1:1)
```

The server logs `Reload env: .env.local` once per change and **does not restart** (one
`Ready in` across the whole session), so the re-evaluation happens inside the running
process.

## The correction

Turbopack does re-evaluate the module. What exists is a window one request wide: the
request that arrives before the reload lands is served from the module already evaluated,
and it returns `200`. Every request after it fails.

Reproduced four times, deterministic each time:

```
trial 1 | healthy=200 | after blanking: 200 500 500 500 500 500
trial 2 | healthy=200 | after blanking: 200 500 500 500 500 500
trial 3 | healthy=200 | after blanking: 200 500 500 500 500 500
```

So the reader's obvious check really can report success while proving nothing, which is
what TD-32 was opened for and why it was rated High. But the cause is a race, not a cache
that never clears, and the consequence for §5 is different in a way that matters:
**reloading a second time is enough.** Restarting is the version that cannot race, which is
why it is what §5 should say, but a §5 that explains it as "Turbopack never re-evaluates"
would be teaching a mechanism that is not real.

## Why this needed running rather than reading

The tracker entry flagged its own exposure: *"Observed there and not re-run for this entry,
which is why the restart is stated as the fix rather than as the only fix."* Reading it
again would have reproduced the wrong mechanism into the document the entry exists to fix.
Same class as **D-50**, and the same shape as TD-35's own correction, where an entry
claiming a warning fires only on a cold server was disproved across three cold-server runs.

One request is a small window on localhost with `curl`. In a browser, with a human hand on
Cmd-R, it is exactly the window a person lands in.
