# Stage 04 Doc Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `docs/04-project-setup.md` correct where a reader acts on it, closing TD-28 and the four defects it does not name, and prove the corrections by running them rather than re-reading them.

**Architecture:** Nine tasks on `fix/stage-04-doc-corrections`. Task 1 executes the doc as it stands, so the corrections are informed by ground truth rather than by assumption. Tasks 2–6 are the corrections themselves, each a self-contained edit to one section. Task 7 runs the cold-reader wave, Task 8 the fix wave it produces, Task 9 the records. No app code changes on this branch.

**Tech Stack:** Markdown. `pnpm`, `vitest` (for the one real test), `node`, `git`. A scratch directory for Task 1.

## Global Constraints

- **Branch:** `fix/stage-04-doc-corrections`, cut from `develop`. Never merge to `main`. Ask before any merge, including into `develop`.
- **Commit trailer**, every commit: `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
- **Conventional Commits**, `type(scope): subject`, lowercase after the colon. Scopes here: `docs`, `setup`, `tracker`, `stack`.
- **D-42:** cite doc sections by heading, never by line number.
- **D-47:** if a correction changes a concept that appears in `web/src/lib/terms.ts`, edit the term there and run `pnpm gen:glossary`. Never hand-edit `reference/glossary.md`.
- **D-50:** executable content in a document gets executed.
- **Prettier skips markdown by design.** `pnpm format:check` is not a check on these files.
- **The scratch directory** is `/private/tmp/claude-501/-Users-angelito-personal-Development-Playbook/2018305f-1624-40d5-843f-f6cec47a2997/scratchpad`. Nothing from it is committed.
- **`humanizer:humanizer`** runs over the corrected prose before Task 9 closes. Skip it for code blocks, tables, and terminal output.

---

### Task 1: Execute the doc as it stands, and record what is stale

**Files:**
- Create: `docs/verification/stage-04-doc-execution.md`
- Read only: `docs/04-project-setup.md`

**Interfaces:**
- Produces: `docs/verification/stage-04-doc-execution.md`, a findings list. Tasks 2–6 read it before editing, because a flag that no longer exists is a different correction from a claim that is merely wrong.

This task runs first on purpose. The rest of the plan assumes the doc is wrong in four specific ways and otherwise current. That assumption has not been checked, and `create-next-app`'s flags, `eslint-config-prettier`'s specifier and the Sentry wizard all move between versions.

- [ ] **Step 1: Scaffold from the doc's own command, verbatim**

Set the scratch path once; every later step in this task assumes it:

```bash
export SCRATCH=/private/tmp/claude-501/-Users-angelito-personal-Development-Playbook/2018305f-1624-40d5-843f-f6cec47a2997/scratchpad
```

Note that shell state does not persist between tool calls, so re-export it in each call rather than assuming it survived.

Use the exact flags the doc prints, not corrected ones:

```bash
cd "$SCRATCH" && rm -rf setup-check && \
pnpm create next-app@latest setup-check \
  --typescript --app --tailwind --eslint --src-dir --use-pnpm
```

Record: whether every flag was accepted, whether any prompted interactively despite being passed, and the Next version it installed.

- [ ] **Step 2: Apply the doc's `.nvmrc` and `engines` block**

```bash
cd "$SCRATCH/setup-check" && echo "22" > .nvmrc
```

Then add to `package.json` exactly what the doc's §1 JSON block shows, including `"engines": { "node": ">=22 <23" }`. Run `pnpm install` and record whether the engines constraint is satisfied by the machine's Node, or whether it errors. Note the actual local Node version.

- [ ] **Step 3: Apply §3 — Prettier and the ESLint bridge**

```bash
cd "$SCRATCH/setup-check" && pnpm add -D prettier eslint-config-prettier
```

Write the doc's `.prettierrc` verbatim. Append `eslint-config-prettier/flat` last in `eslint.config.mjs` as the doc instructs. Run `pnpm exec eslint .` and record whether the specifier resolves. **`eslint-config-prettier/flat` is the claim most likely to be stale** — the package moved its flat-config entry point once already.

- [ ] **Step 4: Apply §4 — the four `tsconfig` flags**

Add `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax` to `compilerOptions`. Run `pnpm exec tsc --noEmit` and record whether the generated scaffold compiles under them. `verbatimModuleSyntax` against a fresh scaffold is the likeliest to error.

- [ ] **Step 5: Apply §5 — the env module**

```bash
cd "$SCRATCH/setup-check" && pnpm add zod
```

Create `src/lib/env.ts` with the doc's exact source. Run `pnpm exec tsc --noEmit`. Record whether `z.string().url()` still exists in the installed Zod major — Zod 4 deprecated it in favour of `z.url()`, and the doc predates that. **This is a live suspicion, not a certainty; check it rather than assume it.**

- [ ] **Step 6: Apply §6 and §7 — hooks and CI**

```bash
cd "$SCRATCH/setup-check" && pnpm add -D lefthook && pnpm exec lefthook install
```

Write the doc's `lefthook.yml` verbatim; run `pnpm exec lefthook run pre-commit` and record the result. Write `.github/workflows/ci.yml` verbatim and parse it:

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/ci.yml','utf8');console.log(y.length>0?'read ok':'empty')"
```

Record whether `pnpm/action-setup@v4` and `actions/setup-node@v4` are still current majors. The doc's CI runs `pnpm vitest run` but the scaffold has no vitest — record that as a finding if it is real.

- [ ] **Step 7: Confirm the `prepare` claim independently**

Already run once during spec authoring; re-run it here so the evidence sits on this branch:

```bash
mkdir -p "$SCRATCH/nogit" && cd "$SCRATCH/nogit" && \
  "$SCRATCH/setup-check/node_modules/.bin/lefthook" install; echo "exit=$?"
CI=1 VERCEL=1 "$SCRATCH/setup-check/node_modules/.bin/lefthook" install; echo "exit=$?"
( "$SCRATCH/setup-check/node_modules/.bin/lefthook" install || true ); echo "exit=$?"
```

Expected: `exit=1`, `exit=1`, `exit=0`.

- [ ] **Step 8: Write the findings file**

`docs/verification/stage-04-doc-execution.md`, structured as one row per doc section: the command run, the raw output tail, and a verdict of `current` / `stale` / `wrong`. Paste real terminal output, not summaries. Where a claim is stale rather than wrong, say what it should say now.

- [ ] **Step 9: Commit**

```bash
git add docs/verification/stage-04-doc-execution.md
git commit -m "docs(setup): run stage 04's own instructions and record what is stale

D-50 says executable content gets executed. Stage 04 is a dozen executable
blocks claiming to produce a working project, and nothing had ever run them
end to end. Findings feed the corrections that follow rather than being
assumed by them.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Correct §1 Scaffold, and the Node row in `reference/stack.md`

**Files:**
- Modify: `docs/04-project-setup.md`, "### 1. Scaffold"
- Modify: `reference/stack.md`, the Runtime row of the **Core** table

**Interfaces:**
- Consumes: Task 1's findings on whether `engines: ">=22 <23"` installed cleanly.
- Produces: the corrected framing that Task 5's Definition of done checkbox refers back to.

The defect: "Pin the Node version so local, CI, and Vercel agree" is false. `.nvmrc` does not reach Vercel. `engines.node` is present but sold as a pnpm guard, which is its secondary effect.

- [ ] **Step 1: Replace the framing sentence and add the reach paragraph**

Find this text in `docs/04-project-setup.md`:

```
Pin the Node version so local, CI, and Vercel agree:

```bash
echo "22" > .nvmrc
```

Add the matching constraint to `package.json`, which makes pnpm refuse to install on the
wrong major rather than failing mysteriously later:
```

Replace with:

```
Pin the Node version in both places, because no single file reaches every environment:

```bash
echo "22" > .nvmrc
```

`.nvmrc` is what `nvm` and `fnm` read locally, and what GitHub Actions reads through
`node-version-file`. It stops there. Your host does not read it.

Add the constraint to `package.json` as well:
```

- [ ] **Step 2: Replace the paragraph after the JSON block**

Find:

```
Use the actual pnpm version from [reference/stack.md](../reference/stack.md) — `corepack
use pnpm@latest` writes it for you.
```

Replace with:

```
`engines.node` does two jobs. It makes pnpm refuse to install on the wrong major rather
than failing mysteriously later, and it is what Vercel reads, overriding the Node version
set in the project's own dashboard.

The general rule is worth more than either file: **for each environment that runs your
code, find the file that environment reads.** A version file being popular does not make
it universal, and the environment nothing pins is usually the one serving users.

Use the actual pnpm version from [reference/stack.md](../reference/stack.md) — `corepack
use pnpm@latest` writes it for you.
```

- [ ] **Step 3: Correct the "pnpm refuses to install" claim (Task 1 finding, WRONG)**

Task 1 tested this directly by setting `"node": ">=99 <100"` and running install:

```
 WARN  Unsupported engine: wanted: {"node":">=99 <100"} (current: {"node":"v22.19.0"})
Done in 416ms using pnpm v10.33.0
$ echo $?   →   0
```

pnpm does not refuse. `engines` is advisory unless `.npmrc` sets `engine-strict=true`, which the doc never instructs. Find:

```
Add the constraint to `package.json` as well:
```

and after the JSON block, fold this into the paragraph written in Step 2 so the claim is true:

```
`engines.node` does two jobs. It is what Vercel reads, overriding the Node version set in
the project's own dashboard — the job that matters in production. And it makes pnpm
complain on the wrong major, though only if you ask it to:

```bash
echo "engine-strict=true" >> .npmrc
```

Without that line pnpm prints `WARN Unsupported engine` and installs anyway, exit 0 — a
warning in CI log noise is not a gate. With it, the install fails on the wrong major,
which is what you wanted when you wrote the constraint.
```

Delete the "makes pnpm refuse to install on the wrong major rather than failing mysteriously later" clause wherever it survives from Step 1's edit. Add `.npmrc` to the Artifacts list in Task 5.

- [ ] **Step 4: Correct the Runtime row in `reference/stack.md`**

Find, in the **Core** table:

```
| Runtime | Node.js | 22 LTS | Match this in CI, in Docker, and in Vercel project settings. Version drift between the three is a recurring source of "works locally" bugs. |
```

Replace with:

```
| Runtime | Node.js | 22 LTS | Pin it in the file each environment reads: `.nvmrc` for local shells and CI, `engines.node` in `package.json` for Vercel, which reads neither `.nvmrc` nor your workflow. Drift between them is a recurring source of "works locally" bugs. |
```

- [ ] **Step 5: Verify nothing else in the repo repeats the old claim**

```bash
grep -rn "\.nvmrc" docs/ reference/ | grep -v "docs/verification\|docs/learnings\|docs/tracker\|docs/task"
```

Expected: hits only in `docs/04-project-setup.md` §1 and §7's CI snippet (where `node-version-file: '.nvmrc'` is correct) and `docs/11-ci-cd.md` (same, correct). Any other hit asserting `.nvmrc` reaches a host is a finding — record it, do not silently widen scope.

- [ ] **Step 6: Commit**

```bash
git add docs/04-project-setup.md reference/stack.md
git commit -m "docs(setup): name the file each environment reads, not the popular one

.nvmrc reaches local shells and CI and stops. engines.node is what the host
reads, and the doc had it on the page while selling it as a pnpm guard, which
is its secondary effect. stack.md had the same gap from the other side: it
named the Vercel project setting without naming the file that overrides it.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Make §5, §6 and §7 produce a project whose own gates run

**Files:**
- Modify: `docs/04-project-setup.md`, sections "### 4. TypeScript settings", "### 5. Environment variables, validated at boot", "### 6. Git hooks", "### 7. CI, on day one"

**Interfaces:**
- Consumes: Task 1 Step 7's exit codes, and Task 1's §5/§6/§7 findings.
- Produces: the `prepare` script and the `typecheck` / `test` scripts that Task 5's Definition of done adds checkboxes for.

**Scope widened after Task 1, on the user's call.** Task 1 found that §6's pre-push hook and §7's CI workflow both invoke commands stage 04 never creates, so a reader who follows the doc literally gets a hook and a pipeline that fail on their first run. Three sections share one defect: **the doc tells you to run something it never gave you.** They are fixed together because splitting them would leave the doc self-inconsistent between commits.

TD-28's own framing was also incomplete here. It says an unguarded `prepare` breaks the host; the doc has **no `prepare` script at all**, so it cannot warn about a trap it never walks the reader into, and it leaves hooks installed on exactly one machine.

- [ ] **Step 1: Insert after the `lefthook.yml` block, before "Format on commit, verify on push."**

```
Hooks installed by that command exist only on the machine that ran it. Add a `prepare`
script so a fresh clone gets them too:

```json
{
  "scripts": { "prepare": "lefthook install || true" }
}
```

The `|| true` is not defensive clutter. pnpm runs `prepare` on every install, `lefthook
install` exits 1 outside a git repository, and build hosts check out your source without a
`.git`. Unguarded, `pnpm install` fails on the host and the deploy dies at the install
step, before it reaches anything you configured. Neither `CI=1` nor `VERCEL=1` changes it.
Husky fails identically for the identical reason, so this is a property of `prepare`
rather than a lefthook footnote.
```

- [ ] **Step 2: Add the scripts §6 and §7 assume (Task 1 findings, WRONG)**

Task 1 ran the doc's own pre-push hook against a scaffold built only from the doc:

```
$ pnpm exec lefthook run pre-push
┃  test ❯      ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "vitest" not found
┃  typecheck ❯ ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command "typecheck" not found
$ echo $?  →  1
```

`create-next-app` ships `dev`, `build`, `start`, `lint` and nothing else. §7's CI runs `pnpm typecheck`, `pnpm vitest run` and `pnpm format:check` against the same gap.

**The call, made because the doc's own thesis requires it:** stage 04 adds the scripts and the test runner rather than trimming its gate. Its Traps block calls "adding CI later" the most expensive mistake on the page, and its Definition of done asks the reader to watch CI fail on a broken commit — which they cannot reach if CI fails for an unrelated reason first. Stage 06 owns what to *write* in tests; stage 04 owns the runner existing.

In "### 4. TypeScript settings", after the `noUncheckedIndexedAccess` paragraph, add:

```
Add the script CI and your hooks will call:

```json
{
  "scripts": { "typecheck": "tsc --noEmit" }
}
```

On a Next.js project make it `next typegen && tsc --noEmit` — route types are generated,
not written, so a bare `tsc` passes locally off a stale build and fails on a clean checkout.
```

At the end of "### 5. Environment variables, validated at boot", after the `.env.example` paragraph, add:

```
Install the test runner now, even with nothing to test yet:

```bash
pnpm add -D vitest
```

Add `"test": "vitest run"`. What to put in the tests is [06 — Testing](06-testing.md); the
point here is that the gate you are about to wire has something real to call. A pipeline
step naming a command nobody installed fails on its first run, and the failure looks like
a broken pipeline rather than a missing dependency.
```

Then correct §6's `lefthook.yml` and §7's `ci.yml` so both call `pnpm test` rather than `pnpm vitest run` — the script indirection is the point, since it is what lets the runner change without editing two gates.

- [ ] **Step 3: Correct §5's deprecated Zod call (Task 1 finding, STALE)**

Task 1 confirmed `z.string().url()` compiles and validates correctly, and that the installed Zod 4 marks it deprecated in its shipped types: `/** @deprecated Use `z.url()` instead. */`. In the `src/lib/env.ts` block, replace both occurrences:

```ts
  DATABASE_URL: z.url(),
  NEXT_PUBLIC_APP_URL: z.url(),
```

`z.string().min(32)` stays as it is — `.min()` carries no deprecation.

- [ ] **Step 4: Bump §7's action pins (Task 1 finding, STALE)**

Task 1 checked the GitHub releases API rather than assuming. All three `v4` tags still resolve, so nothing is broken; a reader copying them starts two majors behind for no reason.

```yaml
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
```

**Verify each tag resolves before writing it** — do not copy these from this plan on trust:

```bash
for r in actions/checkout pnpm/action-setup actions/setup-node; do
  echo -n "$r: "; curl -s "https://api.github.com/repos/$r/releases/latest" | grep -o '"tag_name": "[^"]*"'
done
```

Use the majors that command actually reports. If one disagrees with this plan, the command is right and the plan is stale.

- [ ] **Step 5: Add the matching trap**

In the "## Traps" block, after **"Not testing that CI actually fails."**, insert:

```
**Pinning the version your host does not read.** `.nvmrc` reaches your machine and your
CI and stops. If the environment that actually serves users is not pinned by a file that
environment reads, it is not pinned — and the failure is silent, because it builds.
```

- [ ] **Step 6: Verify every claim is stated as executed, not asserted**

Re-read everything this task inserted against `docs/verification/stage-04-doc-execution.md`. Each factual clause must correspond to a line of real output there: the `prepare` exit codes (1, 1 under `CI=1 VERCEL=1`, 0 guarded), the `WARN Unsupported engine` line, the two `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL` failures, the Zod `@deprecated` grep, and the action-tag versions from Step 4's own `curl`. If a clause has no output behind it, either run it or cut it.

- [ ] **Step 7: Re-run the doc's gates against the scratch scaffold**

The point of this task is that the doc now produces a project whose gates run. Prove it rather than asserting it — in the Task 1 scaffold, apply this task's edits and run:

```bash
pnpm exec lefthook run pre-push; echo "pre-push exit=$?"
```

Expected: exit 0, both `typecheck` and `test` resolving. **This is the teeth check for the whole task**: before the edits it exited 1 with two "not found" errors, and if it still does, the correction did not work. Paste both runs.

- [ ] **Step 8: Commit**

```bash
git add docs/04-project-setup.md
git commit -m "docs(setup): the doc told you to run three things it never gave you

The prepare script was absent entirely, so hooks existed only where someone
ran the install command — and an unguarded one exits 1 on every build host.
Pre-push and CI both called typecheck and vitest, neither of which stage 04
creates: lefthook run pre-push exited 1 with two 'not found' errors against a
scaffold built from nothing but this document.

Stage 04 now adds the scripts and the runner rather than trimming its gate.
Its own Traps block calls adding CI later the most expensive mistake on the
page, and its Definition of done asks the reader to watch CI fail on a broken
commit — unreachable if CI fails for an unrelated reason first. Stage 06 still
owns what to write in tests.

Also z.string().url() to z.url(), deprecated in the installed Zod 4, and the
action pins forward two majors. Both verified against the tool rather than
assumed.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Rewrite §8 Connect Vercel

**Files:**
- Modify: `docs/04-project-setup.md`, "### 8. Connect Vercel"

**Interfaces:**
- Consumes: `docs/learnings/deploying-101.md` as the corrected source.
- Produces: the three-settings table and the SHA check that Task 5's Definition of done references.

This is TD-28's headline. The section is ten lines, one of which is wrong and three of which are missing.

- [ ] **Step 1: Replace the whole section body, keeping the heading**

Everything between `### 8. Connect Vercel` and `### 9. Error tracking` becomes:

````
```bash
pnpm add -g vercel && vercel link
```

Three project settings decide whether this builds, and **none of them can live in your
repository**. That is the part worth internalising: everything else in this stage is a file
you commit and can diff. These live in a dashboard, and the only signal that one is wrong
is the error it produces.

| Setting | Set it to | What you see when it is wrong |
|---|---|---|
| **Root Directory** | the folder holding `package.json` | `No Next.js version detected` |
| **Framework Preset** | Next.js | `No Output Directory named "public" found after the Build completed` |
| **Node.js Version** | the major in `engines.node` | nothing at all. It builds, on the wrong runtime |

The Framework Preset error is the one that misleads. It reads as "you deleted something you
needed"; it means the preset is `Other`, whose default output directory is `public`. A
project created against an empty repository has nothing to detect, so Vercel guesses, and
it guesses `Other`. With the Next.js preset the output is `.next` and a `public/` directory
is optional.

**Then check what it built, not whether it built.** A deployment list tells you a build
succeeded. It does not tell you which repository it succeeded on, and a green build of the
wrong repo is indistinguishable from a green build of yours at a glance. Take the commit
SHA off the deployment and ask your own repository about it:

```bash
git cat-file -t 79ef7a7    # a commit you can see  → "commit"
                           # anything else         → "Not a valid object name"
```

Now push a branch and open a pull request. You should get a preview URL — load it, because
a green checkmark is not the check. Fetch one real page and confirm it renders. If you have
configured a canonical URL anywhere, fetch `/robots.txt` too: it prints the origin the build
actually used, so one request tells you whether the value you set is the value that shipped.

Verify all of this before writing any features. A broken deploy pipeline is far easier to
debug against a scaffold than against a half-built app.
````

- [ ] **Step 2: Check the cross-reference still holds**

```bash
grep -n "12-staging\|13-production" docs/04-project-setup.md
```

If §8 now claims something 12 or 13 owns, add a pointer rather than duplicating. Record the decision either way; do not edit 12 or 13 (spec non-goal).

- [ ] **Step 3: Commit**

```bash
git add docs/04-project-setup.md
git commit -m "docs(setup): the three settings the repository cannot express

TD-28's headline. The section told the reader to match the host's Node version
to .nvmrc, which Vercel does not read, and said nothing about Root Directory,
Framework Preset, or how to tell a green build of the wrong repository from a
real one. All three blocked this project's own first deploy on 2026-08-11
before any of the section's advice became relevant.

Each setting is listed with the error it actually produces, because the error
is what a stuck reader searches for, and the Framework Preset one names a
symptom two steps from its cause.

Source: docs/learnings/deploying-101.md.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Correct the Definition of done and Artifacts

**Files:**
- Modify: `docs/04-project-setup.md`, "## Definition of done" and "## Artifacts"

**Interfaces:**
- Consumes: Tasks 2, 3 and 4.

The Definition of done restates §8's wrong claim as a checkbox. Correcting §8 alone leaves the doc contradicting itself, which is the defect class the cold reader will find in Task 7 if this task does not.

- [ ] **Step 1: Replace the Node checkbox**

Find:

```
- [ ] Node version is identical in `.nvmrc`, CI, and Vercel settings
```

Replace with:

```
- [ ] Node version is pinned in the file each environment reads — `.nvmrc` for local
      shells and CI, `engines.node` for the host
- [ ] `pnpm install` succeeds in a checkout with no `.git`, because your build host has none
- [ ] The deployed commit SHA exists in your repository (`git cat-file -t <sha>`)
```

- [ ] **Step 2: Extend the Artifacts list**

Find:

```
- `.prettierrc`, `eslint.config.mjs`, `tsconfig.json`, `lefthook.yml`, `.nvmrc`, `.env.example`
```

Replace with:

```
- `.prettierrc`, `eslint.config.mjs`, `tsconfig.json`, `lefthook.yml`, `.nvmrc`, `.npmrc`, `.env.example`
- `package.json` pinning `engines.node`, a guarded `prepare` script, and the `typecheck`
  and `test` scripts the hooks and CI call
```

**Three artifacts arrive here from earlier tasks and are easy to miss**, because each was added by a task that edited a different section: `.npmrc` (Task 2 Step 3, carrying `engine-strict=true`), and the `typecheck` / `test` scripts plus vitest (Task 3 Step 2). Before writing this list, grep the doc for what it now tells the reader to create, rather than working from this plan's memory of it:

```bash
grep -nE '^\s*(echo|pnpm add|pnpm create)' docs/04-project-setup.md
```

Every file or dependency that command reveals should appear in Artifacts or be a deliberate omission you can name.

- [ ] **Step 3: Grep the whole doc for surviving instances of the corrected claim**

```bash
grep -nF -e 'matches `.nvmrc`' -e 'identical in' -e 'Vercel settings' docs/04-project-setup.md
```

Expected: no hits. Any hit is the same error in a third place.

Use `grep -nF -e ...`, not a double-quoted pattern: backticks inside `"…"` are command substitution in both bash and zsh, so `grep "matches \`.nvmrc\`"` runs `.nvmrc` as a command and searches for the wrong string. It would report "no hits" while never having looked.

- [ ] **Step 4: Commit**

```bash
git add docs/04-project-setup.md
git commit -m "docs(setup): the definition of done carried the same wrong claim

Not named in TD-28. The checkbox restated the Vercel section's .nvmrc error,
so correcting one and not the other would have left the doc contradicting
itself — which is exactly what the cold reader finds and what a reader
following the checklist would have trusted.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Add `### AI in project setup`

**Files:**
- Modify: `web/src/lib/stage-metadata.test.ts:40-44`
- Modify: `docs/04-project-setup.md`, inside "## The work"

**Interfaces:**
- Consumes: nothing.
- Produces: the doc section the port's `ai` step will carry, and the passing test that unblocks `ready: true` later.

This is the task with a real RED. `stage-metadata.test.ts:37-39` says its list "grows by one slug per stage built … so the section lands with the doc amendment at the start of a stage round rather than at the end when `ready` flips." Add the slug first and watch it fail.

- [ ] **Step 1: Write the failing test**

In `web/src/lib/stage-metadata.test.ts`, add `'04-project-setup'` to `AI_SECTION_STAGES`:

```ts
const AI_SECTION_STAGES = [
  '01-product-discovery',
  '02-planning',
  '03-architecture',
  '04-project-setup',
]
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

```bash
cd web && pnpm vitest run src/lib/stage-metadata.test.ts
```

Expected: FAIL on `04-project-setup: the doc carries an AI plays section`, with the message `04-project-setup has no "### AI in ..." subsection`. **Paste the raw output into the task report.** A failure on the *title* test instead would mean something else is wrong; stop and investigate rather than proceeding.

- [ ] **Step 3: Write the section**

Insert into `docs/04-project-setup.md` after "### 10. Write the README before the code" and before the `---` that closes "## The work":

```
### AI in project setup

Setup is the stage where an agent is most useful and most confidently wrong, and the split
is clean: it is good at files you commit and blind to everything else. Every config here is
text it can write, read back, and check. The settings that most often break a first deploy
are not text, are not in your repository, and nothing you run locally can see them.

Where it earns its place:

- **Generate the config, then make it prove itself** (a skill). Scaffolds, `tsconfig`
  flags, a `lefthook.yml`, a CI workflow — all text, all conventional, all fast. Have it
  run each one rather than describe it. A workflow file that has never been pushed is a
  guess with syntax highlighting.
- **Derive `.env.example` from the schema** (a saved command). `src/lib/env.ts` already
  lists every variable. Generating the example from it keeps your only configuration
  documentation honest, because two files cannot drift when one is produced from the other.
- **Port conventions from your last project** (memory). `claude-mem` answers "what did I
  set up last time, and why". Setup is the most repeated stage in a career and the one
  people most often rebuild from nothing.
- **Read the docs for the version you installed** (an MCP). context7 over training memory.
  Scaffolding tools change flags between minor versions, and an agent confidently passing a
  removed flag produces an error two steps from its cause.
- **Break the gate on purpose** (a saved command). Have it push a deliberately failing
  commit and confirm CI goes red. This is the check people skip because it feels like
  theatre, and it is the only thing separating a gate from a green badge.

Named tools: `context7` for version-accurate docs, `claude-mem` for prior setups, and
Superpowers' `verification-before-completion` for the "prove it" half of every item above.

What none of this replaces: the dashboard. Root Directory, Framework Preset and the
connected repository live in a web UI no agent reads, and this playbook's own first deploy
was blocked by all three while every local check stayed green. An agent will happily debug
the error message and cannot see the setting that caused it. Nor will it tell you that a
green build is the wrong repository — that takes one command and a decision to be
suspicious, and suspicion does not delegate.
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
cd web && pnpm vitest run src/lib/stage-metadata.test.ts
```

Expected: PASS, all stages. Paste the raw output.

- [ ] **Step 5: Teeth check**

Temporarily change the new heading to `### AI for project setup` and re-run. Expected: that one test fails again, and only that one. Revert. **Paste both runs.** This proves the regex is anchored on the real string rather than matching anything.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/stage-metadata.test.ts docs/04-project-setup.md
git commit -m "docs(setup): the AI plays section D-35 requires, test first

stage-metadata.test.ts keeps AI_SECTION_STAGES explicit rather than derived
from ready, precisely so the section lands with the doc amendment at the start
of a round. Adding the slug is the failing test; the section is what passes it.

Grounded rather than generic: the honest boundary is that an agent writes every
file in this stage well and cannot see a dashboard, which is where all three of
this project's own deploy blockers lived.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Cold-reader wave — completeness and consultability

**Files:**
- Create: `docs/verification/cold-reader-stage-04-run1.md`

**Interfaces:**
- Consumes: the corrected doc from Tasks 2–6.
- Produces: a gap list, each rated blocking / non-blocking / boundary, which Task 8 works from.

Method is `docs/learnings/cold-reader-testing.md`. Two dispatches, both read-only, neither able to see this plan.

- [ ] **Step 1: Dispatch the completeness run**

One subagent. Give it `docs/04-project-setup.md` and nothing else. The instruction that makes it work, verbatim:

> You may use your expertise to *judge* the document, but you may NOT quietly fill its gaps with your own knowledge and then call it complete. Every time the document does not give you something you need, STOP and log it as a gap, rated by how blocking it is.

The concrete task, deliberately not the doc's own example: **"Set up a new project called `ledger` — a small double-entry bookkeeping web app for one user. Produce the actual files: every config the document tells you to create, with real content, plus the exact commands in order. Where the document leaves you unable to produce a file, log a gap instead of inventing one."**

- [ ] **Step 2: Dispatch the consultability check separately**

A cold reader reads linearly and structurally cannot judge look-up-ability, so this is its own dispatch. Give it the doc's headings only, then three questions to answer from headings alone:

1. "My deploy fails with `No Output Directory named "public"`. Which section do I open?"
2. "Which file do I edit so my host runs the right Node version?"
3. "How do I know my CI gate actually works?"

Score out of 3 and record any misfiling.

- [ ] **Step 3: Retry any dispatch that stalls, once**

Three of five dispatches stalled on 2026-08-11 and every retry succeeded. Treat one stall as infrastructure, not as a prompt defect. A second stall on the same prompt is a real signal.

- [ ] **Step 4: Separate gaps from boundaries**

Write `docs/verification/cold-reader-stage-04-run1.md`. For each finding, classify:

- **Defect** — the doc contradicts itself, or a beginner cannot proceed within its own scope. Fix in Task 8.
- **Boundary** — another stage's job (11 CI/CD, 12 staging, 13 deployment, 15 observability) or outside the solo-developer scope. Record and do not patch; patching these blurs what the stage is.

The distinction is the whole value of the method. Do not fold boundaries into the fix list.

- [ ] **Step 5: Commit**

```bash
git add docs/verification/cold-reader-stage-04-run1.md
git commit -m "docs(setup): cold-reader run 1, before the port rather than after

stage-implementation-101.md records stage 03 running this last and ending with
a finished app on a doc with three blocking gaps. Findings split into defects
and boundaries; only the defects become work.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: The fix wave, and a re-skim of the fix wave

**Files:**
- Modify: `docs/04-project-setup.md` (per Task 7's defect list)
- Modify: `docs/verification/cold-reader-stage-04-run1.md` (close-out section)

**Interfaces:**
- Consumes: Task 7's defect list.

D-48: the fix wave lands after the pass that justified it, so by construction nothing checks it unless something is made to. Stage 03's fix wave shipped the document's only unrunnable SQL.

- [ ] **Step 1: Fix each defect, one commit per coherent group**

Work the list in blocking order. For each, state in the commit body which finding it closes.

- [ ] **Step 2: Re-skim the fix wave's own additions**

Read only the diff this task produced, as a stranger would. Two checks:
- Does any addition contradict something written in Tasks 2–6?
- Does any addition contain code? If so, **run it**, do not read it. D-50 applies to the fix wave, and this is the exact step stage 03 skipped.

- [ ] **Step 3: Run the full doc-facing test suite**

```bash
cd web && pnpm vitest run src/lib/stage-metadata.test.ts src/lib/glossary.test.ts
```

Expected: PASS. If a correction changed a concept in `terms.ts`, run `pnpm gen:glossary` and confirm `reference/glossary.md` regenerates rather than being hand-edited (D-47).

- [ ] **Step 4: Record close-out in the run file**

Append a section stating, per finding: closed / partially closed / deferred with reason. "All closed" without a per-finding line is not evidence.

- [ ] **Step 5: Commit**

```bash
git add docs/04-project-setup.md docs/verification/cold-reader-stage-04-run1.md
git commit -m "docs(setup): fix wave from cold-reader run 1, re-skimmed

D-48: the wave exists because the pass found something, so it lands after the
pass and nothing checks it by default. Re-skimmed as its own diff, and any code
in it was run rather than read.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Records, humanizer pass, and the branch review

**Files:**
- Modify: `docs/tracker.md` — Completed table, Technical debt (TD-28), Decisions
- Modify: `docs/task.md` — the stage 04 row
- Modify: `docs/04-project-setup.md` — humanizer fixes only

**Interfaces:**
- Consumes: every prior task's evidence.

- [ ] **Step 1: Run the humanizer over the corrected prose**

Apply `humanizer:humanizer` to the sections this branch touched. It is a review pass, not an autopilot: skip anything that would flatten the doc's voice, and skip code blocks, tables and terminal output entirely. Commit separately if it changes anything, scope `docs`.

- [ ] **Step 2: Close TD-28 in `docs/tracker.md`**

Rewrite the heading to `### ~~TD-28~~ — Stage 04's deploy section is wrong, and this repo proved it · **CLOSED 2026-08-12**` and append what closed it. **State that TD-28 named four of eight defects**, and name the four it did not: the Definition-of-done restatement, §1's framing, §6's absent `prepare` script, and the missing AI section. An entry that implies the debt was scoped correctly is a worse record than one that says it was not.

- [ ] **Step 3: Add the Completed row**

Evidence, not adjectives. Cite: commit range, the test count after Task 6, the cold-reader score, and the raw exit codes from Task 1 Step 7. Include a `Deferred:` list — at minimum TD-27, TD-12, the 12/13 audit, and anything Task 7 classified as a boundary.

- [ ] **Step 4: Record decisions from D-53**

Candidates, one entry each, appended not edited:
- The correction phase runs before the port, and the cold reader runs before the app.
- `reference/stack.md` names the file each environment reads rather than the environment.
- Any scope call made in Task 4 Step 2 or Task 7 Step 4.

- [ ] **Step 5: Update `docs/task.md`**

The stage 04 row moves from "next" to in-progress with the doc phase complete. Do not mark W-3 advanced; the port has not happened.

- [ ] **Step 6: Dispatch a whole-branch review**

Read-only, fresh context, cannot be this session. Brief it to check: every factual claim against the recorded evidence; the doc against itself for surviving contradictions; whether any correction introduced a new one; and whether the tracker entry's evidence matches what actually ran. Findings carry severity and provenance per `CLAUDE.md`.

- [ ] **Step 7: Fix blocking findings, then report branch state**

Report in the house form: commits off `develop`, test counts across files, suite status, tree status, and explicitly `NOT merged, NOT deployed`.

- [ ] **Step 8: Commit and stop**

```bash
git add docs/tracker.md docs/task.md
git commit -m "docs(tracker): stage 04's doc phase, and TD-28 closed as a subset

TD-28 named four of eight defects. The four it missed are recorded, because an
entry implying the debt was scoped right is a worse record than one saying it
was not.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

**Do not merge.** Ask.

---

## Verification (after all tasks)

- [ ] `cd web && pnpm vitest run` — full suite green, count recorded and compared against 331/33 baseline
- [ ] `cd web && pnpm lint && pnpm typecheck && pnpm format:check` — clean. `format:check` matters for exactly one file on this branch, `src/lib/stage-metadata.test.ts` from Task 6; **it says nothing about the markdown**, which `web/.prettierignore` excludes via `*.md`. Prettier reports success on an empty match set, so "format:check passed" is not evidence about any doc changed here
- [ ] `pnpm gen:glossary` re-run; `reference/glossary.md` byte-identical unless a term genuinely changed
- [ ] `grep -nF -e 'matches `.nvmrc`' docs/04-project-setup.md` returns nothing (single quotes: backticks in a double-quoted pattern are command substitution)
- [ ] Every factual claim added to §1, §6 and §8 traces to a line of real output in `docs/verification/stage-04-doc-execution.md`
- [ ] Cold-reader defects all closed or explicitly deferred with a reason, per finding
- [ ] Whole-branch review complete, blocking findings fixed
- [ ] Branch state reported; `NOT merged, NOT deployed`
