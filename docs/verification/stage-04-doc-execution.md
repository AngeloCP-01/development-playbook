# Stage 04 doc execution — running the setup end to end

Method: cold-executed every runnable block in `docs/04-project-setup.md`, verbatim, in a
scratch directory outside the repo. Environment: macOS, Node v22.19.0, pnpm 10.33.0,
network reachable (npm registry and GitHub both resolved). Nothing in this run assumes
the four corrections the rest of this branch makes — it only records what actually
happened when the doc's own commands ran.

**Score: 6 CURRENT · 2 STALE · 3 WRONG · 4 not executed (require interactive auth or are
not runnable claims).**

Derived by extracting the verdict cell of every data row in the table below, not
hand-counted. Every data row starts with `| §`, so the extraction doesn't depend on line
numbers and stays re-runnable even if this file is edited again — re-run it to check the
score line above still agrees with the table:

```
$ grep '^| §' docs/verification/stage-04-doc-execution.md \
  | awk -F'|' '{n=NF-1; v=$n; gsub(/^ +| +$/,"",v); print v}' \
  | sort | uniq -c
   6 CURRENT
   2 STALE
   2 WRONG
   1 WRONG (same root cause as §6 pre-push)
   2 not executable, no verdict
   1 not executed — interactive login
   1 package half CURRENT, wizard not executed — interactive org login
$ grep -c '^| §' docs/verification/stage-04-doc-execution.md
15
```

`uniq -c` groups by exact text, so the §7 CI row's longer WRONG cell ("WRONG (same root
cause as §6 pre-push)") counts separately from the other two WRONG cells — all three are
WRONG (2 + 1 = 3). The last four lines are the §2/§8/§9/§10 rows, none of which is
CURRENT/STALE/WRONG: two are non-executable prose, and two are Vercel/Sentry rows this
doc treats as one not-executed bucket even though the Sentry row's package half is
CURRENT (package half CURRENT, wizard not executed — interactive org login). That's
4 rows in that bucket. 6 + 2 + 3 + 4 = 15, matching the 15 rows in the table.

## Summary

| Doc section | Claim | Verdict |
|---|---|---|
| §1 scaffold flags | `pnpm create next-app@latest ... --typescript --app --tailwind --eslint --src-dir --use-pnpm` | CURRENT |
| §1 engines block | "makes pnpm refuse to install on the wrong major" | WRONG |
| §3 ESLint/Prettier bridge | `eslint-config-prettier/flat` resolves | CURRENT |
| §4 tsconfig flags | four strict flags compile cleanly on a fresh scaffold | CURRENT |
| §5 env module | `z.string().url()` | STALE |
| §6 hooks install | `pnpm add -D lefthook && pnpm lefthook install` | CURRENT |
| §6 pre-commit | format + lint commands | CURRENT |
| §6 pre-push | `pnpm typecheck` / `pnpm vitest run` | WRONG |
| §7 CI action pins | `pnpm/action-setup@v4`, `actions/setup-node@v4` | STALE |
| §7 CI test/typecheck steps | `pnpm typecheck`, `pnpm vitest run` | WRONG (same root cause as §6 pre-push) |
| §7 `prepare` claim (independent re-run) | lefthook install exits 1 outside git, 1 under CI/VERCEL env, 0 in a subshell | CURRENT |
| §8 Vercel connect | `pnpm add -g vercel && vercel link` | not executed — interactive login |
| §9 Sentry | `pnpm add @sentry/nextjs && pnpm dlx @sentry/wizard@latest -i nextjs` | package half CURRENT, wizard not executed — interactive org login |
| §2 folder structure | prose/diagram, not a command | not executable, no verdict |
| §10 README | prose instruction, not a command | not executable, no verdict |

---

## §1 — Scaffold

Doc's exact command, unmodified:

```
$ pnpm create next-app@latest setup-check \
  --typescript --app --tailwind --eslint --src-dir --use-pnpm
```

Tail of output:

```
Using defaults for unprovided options:

  --ts                    TypeScript (use --js for JavaScript)
  --no-react-compiler     No React Compiler (use --react-compiler for React Compiler)
  --agents-md             AGENTS.md (use --no-agents-md for No AGENTS.md)
  --import-alias          "@/*"

Creating a new Next.js app in .../setup-check.
Using pnpm.
Initializing project with template: app-tw

dependencies:
+ next 16.3.0
+ react 19.2.8
+ react-dom 19.2.8

devDependencies:
+ eslint-config-next 16.3.0
+ tailwindcss 4.3.3
+ typescript 5.9.3

Done in 31s using pnpm v10.33.0
Success! Created setup-check at .../setup-check
```

Every flag the doc names was accepted with no interactive prompt. `src/` was created (the
`--src-dir` claim holds). **Verdict: CURRENT.** Aside, not a correction: this
`create-next-app` version also defaults three flags the doc doesn't mention
(`--react-compiler`, `--agents-md`, `--import-alias`), which silently drops an `AGENTS.md`
and `CLAUDE.md` into the scaffold. Harmless, but worth a maintainer's note since a reader
following the doc verbatim gets two files it never told them to expect.

## §1 — `.nvmrc` and the engines block

Doc's claim: adding `"engines": { "node": ">=22 <23" }` to `package.json` "makes pnpm
refuse to install on the wrong major rather than failing mysteriously later." Tested
directly by setting an impossible range and running install with no other change:

```
$ node -e "...set engines to {node: '>=99 <100'}..."
$ pnpm install
 WARN  Unsupported engine: wanted: {"node":">=99 <100"} (current: {"node":"v22.19.0","pnpm":"10.33.0"})
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 416ms using pnpm v10.33.0
$ echo $?
0
```

pnpm does not refuse. It prints a `WARN` line and installs anyway, exit 0. In this
installed pnpm (10.33.0), `engines` is advisory unless `engine-strict=true` is set in
`.npmrc` — and stage 04's own instructions never add that setting. **Verdict: WRONG**,
not stale: the call rests on the doc's own text, not on any claim about what pnpm used to
do. As documented — `engines` block with no `engine-strict`, nothing else — the "refuse to
install" behavior was never going to happen, on any pnpm version, because the doc never
turns strict mode on. To make the claim true, it needs either `engine-strict=true` in
`.npmrc` or to drop the "refuse to install" framing and say what actually happens (a
warning, easy to miss in CI log noise).

The Node-version pin itself is fine: `.nvmrc` writes cleanly, and the local Node
(v22.19.0) satisfies `>=22 <23` once the range is realistic.

## §3 — Prettier and the ESLint bridge

```
$ pnpm add -D prettier eslint-config-prettier
+ eslint-config-prettier 10.1.8
+ prettier 3.9.6
```

`eslint-config-prettier`'s own `package.json` still exports `./flat`:

```
"exports": {
  ".": { "types": "./index.d.ts", "default": "./index.js" },
  "./flat": { "types": "./flat.d.ts", "default": "./flat.js" },
  ...
}
```

Appended `eslintConfigPrettier` (imported from `eslint-config-prettier/flat`) as the last
entry in the `defineConfig([...])` array in `eslint.config.mjs`, then:

```
$ pnpm exec eslint .
$ echo $?
0
```

Clean exit, no output — the specifier resolves and lint passes on the untouched scaffold.
**Verdict: CURRENT.** The brief flagged this as the claim most likely to be stale, on the
theory that the package moved its flat-config entry point once already — true historically,
but at the currently-installed major (10.1.8) `./flat` is back to being the correct,
documented path. Worth re-checking again if a future major moves it a second time, but as
written today the doc is right.

## §4 — The four `tsconfig` flags

Added `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax` to the
scaffold's `tsconfig.json` (`strict` was already `true` from `create-next-app`):

```
$ pnpm exec tsc --noEmit
$ echo $?
0
```

Empty output, clean exit. **Verdict: CURRENT** — contrary to the brief's suspicion,
`verbatimModuleSyntax` does not break the fresh scaffold; `create-next-app`'s generated
files already satisfy it (no type-only imports written as value imports). Caveat worth
recording, per this repo's own `CLAUDE.md`: this pass benefited from `.next/types` already
existing from the scaffold step, which is exactly the trap `CLAUDE.md` warns about for the
`web/` app itself (`tsc --noEmit` passing only because a prior build left `.next` behind).
On an absolutely clean checkout with no prior `next build`/`next dev` run, `pnpm exec tsc
--noEmit` may behave differently for route-type-dependent files. Not tested here because
the scaffold step always produces `.next/types` as a side effect.

## §5 — The env module

```
$ pnpm add zod
+ zod 4.4.3
```

Wrote `src/lib/env.ts` verbatim from the doc, including `z.string().url()` twice. Typecheck:

```
$ pnpm exec tsc --noEmit
$ echo $?
0
```

No compile error. But the installed Zod's own type definitions mark the method deprecated:

```
$ grep -n "deprecated" node_modules/zod/v4/classic/schemas.d.ts
112:    /** @deprecated Use `z.url()` instead. */
144:    /** @deprecated Use `z.base64url()` instead. */
```

And it still works at runtime — checked directly, not inferred from the type passing:

```
$ node zodcheck.mjs
valid url parse: https://example.com
invalid url rejected as expected
```

**Verdict: STALE.** The brief's suspicion was correct in kind, wrong in severity: nothing
is broken, `z.string().url()` still validates a URL correctly and the code compiles clean.
But it is marked `@deprecated` in the shipped types (any editor will show it struck
through) and Zod's own guidance is `z.url()` instead. The doc should say `z.url()` and
`z.string().min(32)` stays as-is (no deprecation on `.min()`).

## §6 — Git hooks

Install, run exactly as the doc prints it (`pnpm lefthook install`, not `pnpm exec
lefthook install` — tested the literal form):

```
$ pnpm add -D lefthook
+ lefthook 2.1.10

╭ Warning ─────────────────────────────────────────────╮
│ Ignored build scripts: lefthook@2.1.10.               │
│ Run "pnpm approve-builds" to pick which dependencies  │
│ should be allowed to run scripts.                     │
╰────────────────────────────────────────────────────────╯

$ pnpm lefthook install
Config not found, creating...
Added config:.../setup-check/lefthook.yml
sync hooks: ✔️
```

pnpm's build-script sandboxing (the "Ignored build scripts" warning) did not stop lefthook
from working — `node_modules/.bin/lefthook` is a plain POSIX shell shim, not a package
needing a native postinstall step, so it runs regardless. Noting this because the warning
reads alarming and isn't, for this specific package.

Wrote the doc's `lefthook.yml` verbatim, staged the modified files, ran pre-commit:

```
$ pnpm exec lefthook run pre-commit
┃  format ❯
eslint.config.mjs 24ms
package.json 2ms (unchanged)
...
┃  lint ❯

summary: (done in 2.38 seconds)
✔️ format (0.98 seconds)
✔️ lint (2.37 seconds)
$ echo $?
0
```

**Verdict for install + pre-commit: CURRENT.**

Pre-push is a different story. The doc's own block runs `pnpm typecheck` and `pnpm vitest
run`, but nothing in stage 04 — §1 through §7 — ever adds a `typecheck` script to
`package.json` or installs vitest. `create-next-app`'s scaffold only ships `dev`, `build`,
`start`, `lint`.

```
$ pnpm exec lefthook run pre-push
┃  test ❯
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "vitest" not found
exit status 254
┃  typecheck ❯
undefined
 ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "typecheck" not found
exit status 254

summary: (done in 0.48 seconds)
🥊 test (0.26 seconds)
🥊 typecheck (0.22 seconds)
$ echo $?
1
```

**Verdict: WRONG.** Not a version drift — this was never going to work on a scaffold
built only from stage 04's own instructions. The doc needs either a step that adds
`"typecheck": "tsc --noEmit"` (or the two-step `next typegen && tsc --noEmit` this repo's
own `web/` app uses) and a testing framework, or it needs to say plainly that `lefthook.yml`
as printed assumes scripts the reader has to add themselves and name them.

## §7 — CI workflow

Wrote `.github/workflows/ci.yml` verbatim and parsed it:

```
$ node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8');console.log(y.length>0?'read ok':'empty')"
read ok
```

File is well-formed and non-empty — not much of a test, but it's the one the brief
specifies, and confirms nothing corrupted writing the heredoc-shaped block.

The two steps the brief flagged as suspect ran into the exact same missing-script gap as
§6's pre-push:

```
$ grep -A5 '"scripts"' package.json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
```

No `typecheck`, no `format:check`, and vitest is never installed anywhere in stage 04. The
CI job as printed (`pnpm typecheck`, `pnpm vitest run`, `pnpm format:check`) would fail on
its first run against a scaffold built from nothing but this document. **Verdict: WRONG**
for the same reason as §6 — this is a doc gap, not a tool that moved.

Action pins — checked against the GitHub API rather than assumed:

```
$ curl -s https://api.github.com/repos/pnpm/action-setup/releases/latest | grep tag_name
  "tag_name": "v6.0.10",
$ curl -s https://api.github.com/repos/actions/setup-node/releases/latest | grep tag_name
  "tag_name": "v7.0.0",
$ curl -s https://api.github.com/repos/actions/checkout/releases/latest | grep tag_name
  "tag_name": "v7.0.1",
```

All three `v4` tags the doc pins still exist and still resolve (checked
`git/refs/tags/v4` on each repo — all `200`), so the workflow as written would not fail to
resolve an action. But each has moved two majors past what the doc pins (`pnpm/action-setup`
is at v6, `actions/setup-node` and `actions/checkout` — the latter not called out by name
in the brief but pinned in the same file — are at v7). **Verdict: STALE.** The pins were
right when written and still function; a reader copying them today starts two majors
behind on day one for no reason.

## §7 (independent) — the `prepare` claim

Re-run standalone, outside git, matching the exact three-line sequence from the brief:

```
$ mkdir -p "$SCRATCH/nogit" && cd "$SCRATCH/nogit" && \
  "$SCRATCH/setup-check/node_modules/.bin/lefthook" install; echo "exit=$?"
fatal: not a git repository (or any of the parent directories): .git
exit=1

$ CI=1 VERCEL=1 "$SCRATCH/setup-check/node_modules/.bin/lefthook" install; echo "exit=$?"
fatal: not a git repository (or any of the parent directories): .git
exit=1

$ ( "$SCRATCH/setup-check/node_modules/.bin/lefthook" install || true ); echo "exit=$?"
fatal: not a git repository (or any of the parent directories): .git
exit=0
```

Matches the brief's expected `exit=1`, `exit=1`, `exit=0` exactly. **Verdict: CURRENT.**

## §8 — Vercel connect (not executed)

`vercel link` is interactive (device/browser OAuth) and there is no scratch Vercel account
to link against, so the command was not run end to end. Checked only that the package
itself resolves and is not abandoned:

```
$ curl -s https://registry.npmjs.org/vercel/latest | node -e "...print name/version..."
name: vercel
version: 58.9.4
```

**Not executed — flag for a human with a real Vercel login**, not a doc defect. No
verdict assigned.

## §9 — Sentry (partially executed)

The wizard (`pnpm dlx @sentry/wizard@latest -i nextjs`) requires an interactive Sentry org
login and was not run for the same reason as §8. The first half of the command — the
package install — was run for real:

```
$ pnpm add @sentry/nextjs
+ @sentry/nextjs 10.70.0
```

Registry check on the wizard package itself:

```
$ curl -s https://registry.npmjs.org/@sentry/wizard/latest | node -e "...print name/version..."
name: @sentry/wizard
version: 7.0.2
```

Both packages exist, resolve, and install cleanly at current majors. **The install half:
CURRENT.** The wizard's actual behavior (source-map upload config, instrumentation file
placement) was not verified — same interactive-login gap as §8, and the doc itself already
carries a trap for this ("Believing the Sentry wizard" — source maps fail quietly).

## §2 and §10 — not executable claims

§2 (folder structure) is a directory diagram and an organizing argument, not a command;
§10 (README) is a three-bullet content instruction, not a command. Neither has a pass/fail
outcome to record. No verdict assigned to either.

## What ran clean end to end

Steps 1 through 5 of the task brief (scaffold → engines → Prettier/ESLint → tsconfig →
env module) all executed without any tooling failure — the two WRONG verdicts inside
that range (`engines` "refuse to install" framing, and the missing `typecheck`/vitest
scripts feeding §6/§7) are doc-authoring gaps, not compatibility drift. The `prepare`
independent re-run (step 7) reproduced its expected exit codes exactly.
