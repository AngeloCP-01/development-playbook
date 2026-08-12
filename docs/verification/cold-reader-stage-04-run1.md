# Cold-reader run 1 — stage 04, before the port rather than after

Method: `docs/learnings/cold-reader-testing.md`. Two dispatches, both read-only, neither
able to see this branch or its plan — both ran against the doc as corrected by Tasks 2–6
of `fix/stage-04-doc-corrections`.

- **Completeness.** One agent, `docs/04-project-setup.md` and nothing else, forbidden from
  filling gaps with its own knowledge. Task: build `ledger`, a single-user double-entry
  bookkeeping app — deliberately not the doc's own example — and produce every file and
  command the document licenses, stopping to log a gap wherever it does not. Raw output:
  `.superpowers/sdd/2026-08-12-stage-04-doc-corrections/cold-reader-completeness-raw.md`.
  Ran clean first try; no retry needed.
- **Consultability.** A second agent, given only the headings list
  (`stage-04-headings-only.txt`), predicted which section answers three questions before
  reading the body, then checked itself against the body. Raw output:
  `cold-reader-consultability-raw.md`. Ran clean first try; no retry needed.

**This is a classification record, not a fix.** Nothing in `docs/04-project-setup.md`
changed while writing this. Task 8 works from the prioritised list at the end.

A third input shaped several calls below: `docs/verification/stage-04-doc-execution.md`,
which actually ran the doc's commands in a scratch directory before this branch existed.
Where a cold-reader suspicion and an execution result disagree, the execution result wins —
it is evidence, the cold read is inference.

---

## Completeness: 3 BLOCKING · 20 NON-BLOCKING · 8 BOUNDARY (the cold reader's counts)

The cold reader rates *how blocking a gap is*. That is not the same question as *whether it
is this stage's job to close it*, so the counts above are not reused as-is below. Each
finding is reclassified **defect** (the doc contradicts itself, or a beginner cannot
proceed within its own scope — Task 8's job) or **boundary** (deliberately another stage's
job, or a decision the doc correctly leaves to the reader — not touched).

### BLOCKING → all three are defects, one is a disagreement with an earlier reviewer

**B1 — §5's environment schema cannot be run, built, or deployed as written.** Confirmed
defect, agreeing with BLOCKING. `## Entry criteria` says "you have decided whether this
needs a database *now* (if unsure, it does not)"; `### 5. Environment variables, validated
at boot` then requires `DATABASE_URL: z.url()` unconditionally, with no `.optional()`, no
staged schema, and no "delete the keys you don't have" escape hatch. `.env.example` is
specified with every key and no values, and no step ever gives those keys values — which
directly contradicts the first `## Definition of done` box, `pnpm install && pnpm dev`
works from a fresh clone with only `.env.example` as a guide. This is the doc arguing with
itself on the same page, within its own stated scope. Defect.

**B2 — no step creates the GitHub repository, the remote, or the first push.** Confirmed
defect, agreeing with BLOCKING. `## Entry criteria` lists "accounts for GitHub", which is
not a repository for *this* project. `### 7. CI, on day one` ends with "enable branch
protection on `main`" and `### 8. Connect Vercel` opens a pull request, both presupposing a
remote no instruction creates. `## Artifacts` lists "Repository with the feature-first
`src/` structure" as this stage's own output, so producing the repository is squarely in
scope — the doc just never says how. Three of eight `## Definition of done` boxes are
unreachable without it. Defect.

**B3 — the Vercel Git connection is missing from §8's table, and this reverses an earlier
reviewer's call.** Confirmed defect, agreeing with BLOCKING, and this one needs its
disagreement on record. Task 4's review (per its report and the `2da6eea` commit) left the
connected repository out of `### 8. Connect Vercel`'s settings table on the reasoning that
it "is not a setting you set, it is a check you run." The cold reader shows that reasoning
does not hold: `vercel link` links a local directory to a Vercel *project* — it is not the
Git integration that produces a preview URL per pull request. A reader who runs `vercel
link`, follows the three-row table exactly, and opens a pull request gets no preview URL
and nothing on the page telling them why, even though the second `## Definition of done`
box requires exactly that outcome.

The doc also contradicts itself on this, which the reviewer's framing missed: `### 8.
Connect Vercel`'s table names three settings — Root Directory, Framework Preset, Node.js
Version — while `### AI in project setup`, added in the same commit, names a different
three: "Root Directory, Framework Preset and *the connected repository* live in a web UI no
agent reads, and this playbook's own first deploy was blocked by all three." Two lists of
three, on one page, agreeing on two items and disagreeing on the one that actually produces
the preview URL the Definition of done requires. Defect.

### NON-BLOCKING → reclassified, not just re-counted

Twenty items is too many to fix and too many to discard; the point of separating them is
lost either way. Below is the full reclassification. Ten are dropped from the fix list
entirely — three because they are this doc correctly deferring a decision (boundary), seven
because this branch's own execution evidence disproves them, they cause no functional harm,
or they are self-correcting to the point of not changing what a reader does. The remaining
ten carry forward, folded into fewer, larger fix items where they share one root cause.

| # | Finding | Verdict | Why |
|---|---|---|---|
| N1 | `create-next-app` still prompts; the doc lists no answers | **Disproven** | `stage-04-doc-execution.md` §1 ran the exact command: "Using defaults for unprovided options... every flag the doc names was accepted with no interactive prompt." The cold reader's assumption, checked against a real run, does not hold. |
| N2 | `packageManager` version deferred to `reference/stack.md` | **Boundary** | By design. `reference/stack.md` states its own reason to exist: "If a stage doc contains a version number, that is a bug in the stage doc — the number belongs here." Duplicating the pnpm version in 04 is exactly what the project decided not to do. |
| N3 | `format` / `format:check` script bodies never shown, though CI calls `format:check` by name | **Defect** | Kept — folded into fix item 4 below. |
| N4 | No `.prettierignore`, absent from `## Artifacts` | **Defect** | Kept — same root cause as N3/N5. |
| N5 | `.prettierrc` disagrees with what `create-next-app` just wrote, and no step reformats the scaffold | **Defect** | Kept — same root cause as N3/N4; together they mean the reader's first CI run goes red on files they never touched. |
| N6 | `eslint-config-prettier/flat` append instruction shown without the surrounding file | **Dropped — non-actionable at this size** | `stage-04-doc-execution.md` §3 appended it and ran `eslint .` clean (exit 0). It works once done; the doc's terseness is real but does not block a reader who tries it, so it does not clear the "changes behaviour" bar. |
| N7 | Lefthook's `pre-commit` glob and CI's `format:check` cover different file sets (`.md`, `.yml` excluded from the hook) | **Defect** | Kept. |
| N8 | `pnpm lefthook install` runs before `lefthook.yml` is shown; bare `pnpm <binary>` resolution unconfirmed | **Dropped — disproven / no functional harm** | `stage-04-doc-execution.md` §6 ran the literal sequence: `pnpm lefthook install` resolves and works ("Config not found, creating... sync hooks: ✔️"). The ordering is real but harmless — the auto-generated default config is immediately overwritten by the file the reader writes next. |
| N9 | Zod major unstated; `z.url()` is version-specific | **Boundary** | Same reasoning as N2 — `reference/stack.md` names "Zod 4.x" so the doc does not have to. `pnpm add zod` with no version always resolves current, so the risk the cold reader describes needs an artificially old lockfile to occur. |
| N10 | §1 says `engines.node` always overrides the dashboard; §8's table row reads as if an unset dashboard has its own failure mode | **Dropped — does not change behaviour** | On a close re-read this is ambiguous wording, not a contradiction: "nothing at all" describes the case where nothing is pinned anywhere, not a wrong-but-overridden dashboard value. Either way the reader's correct action is unchanged — set `engines.node` per §1 — so resolving the ambiguity would not change what anyone does. |
| N11 | GitHub Action pins (`checkout@v7`, `action-setup@v6`, `setup-node@v7`) asserted without a way to check | **Dropped — disproven, verified current** | `stage-04-doc-execution.md` §7 checked all three against the GitHub API directly and found them current as pinned. The trust concern was real before that verification existed; it is now closed evidence, not a gap. |
| N12 | Required status-check name (`verify`, the job id) never stated in `### 7. CI, on day one`'s prose | **Defect** | Kept. |
| N13 | GitHub Free's public/private branch-protection trade-off, sharpened for one person's real financial data | **Boundary** | The doc already states the constraint plainly ("on a private [repo, branch protection] saves and silently never fires. Confirm your plan enforces it.") and hands the decision to the reader, the same pattern as the entry-criteria database question. A reader-specific risk tolerance is not this stage's job to resolve for them. |
| N14 | Sentry auth-token location for a *Vercel* build never stated | **Defect** | Kept — folded into fix item 5 below. |
| N15 | No method given for "trigger a deliberate error", unlike the CI section's explicit "push a broken commit" | **Defect** | Kept — same fix item as N14, for symmetry with the CI teeth-check the doc already models well. |
| N16 | `### 2. Set the folder structure`'s tree includes `src/db/` unconditionally, though the entry criteria says "if unsure, [a database] does not [exist]" | **Defect** | Kept — a real self-contradiction within the doc's own scope, structurally the same shape as B1 at smaller stakes. |
| N17 | "Import `env` everywhere instead of `process.env`" has no server/client boundary note | **Defect** | Kept — `SESSION_SECRET` and `DATABASE_URL` reaching a client bundle is a real, not hypothetical, failure mode in this framework. |
| N18 | `next typegen` asserted as a real subcommand, unverified | **Dropped — disproven, verified in-repo** | This repository's own `CLAUDE.md` documents `pnpm typecheck` as `next typegen && tsc --noEmit` for `web/`, and that command is this project's actual, running command, not a claim about a hypothetical reader's project. |
| N19 | `### 10. Write the README before the code` requires "how to roll back", and no section in the doc teaches a rollback mechanism | **Defect** | Kept. |
| N20 | `echo "engine-strict=true" >> .npmrc` is written before confirming local Node matches the pin, so a subsequent `pnpm add` can fail | **Dropped — self-correcting** | The cold reader's own assessment: "The error is legible, so this is mild." A wrong-major `pnpm add` failure names the mismatch directly; reordering one line does not change what the reader does next. |

**Ten dropped, ten kept.** Of the ten dropped: three are boundary (N2, N9, N13 — version
pinning and a reader's own risk decision, both already handled correctly elsewhere), and
seven are non-actionable at this stage's grain — four of those seven (N1, N8, N11, N18)
are dropped because this branch's own execution-run evidence already disproves them, not
because they were never real.

### BOUNDARY — the cold reader's own list, confirmed

The completeness run's own boundary section (8 items: what belongs in the tests → 06,
`--passWithNoTests` removal → 06, full CI/CD → 11, documentation depth → 10, observability
beyond first-pass error tracking → 15, repo naming → 01 and structural decisions → 03,
the database decision itself → the entry criteria's own procedure, and CODEOWNERS /
`CONTRIBUTING.md` → "Scaling to a team") is not reproduced item-by-item here — the cold
reader already stated each with its destination and reasoning, and restating a coherent
list is not the point of this record. None of the eight is folded into Task 8's work.
Confirmed correct on inspection; nothing here is padding.

---

## Consultability: 3/5, and one of the two misses is this branch's own doing

Method: `stage-04-headings-only.txt`, three questions answered from headings alone before
reading the body, then checked against it.

| Q | Question | Predicted | Actual | Verdict |
|---|---|---|---|---|
| 1 | Deploy fails with `No Output Directory named "public"` — which section? | `### 8. Connect Vercel` | `### 8. Connect Vercel` | **HIT** |
| 2 | Which file controls the host's Node version? | `### 8. Connect Vercel` | `### 1. Scaffold` | **MISS** |
| 3 | How do you know the CI gate actually fires, not just shows green? | `### 7. CI, on day one` | Split across `## Traps` and `## Definition of done` | **NEAR** |
| 4 | Teammate's git hooks aren't running — where? | `### 6. Git hooks` | `### 6. Git hooks` | **HIT** |
| 5 | What must be finished before this stage starts? | `## Entry criteria` | `## Entry criteria` | **HIT** |

**Q2's MISS was caused by this round, not inherited.** Checked against the pre-branch text
(`git show develop:docs/04-project-setup.md`): `### 8. Connect Vercel` used to say "confirm
the Node version matches `.nvmrc`" — wrong (the host does not read `.nvmrc`), but sitting
exactly where a reader with a hosting problem would look, so it was findable even though it
was false. Task 3's correction (`79460eb`, "name the file each environment reads, not the
popular one") moved the true answer to `### 1. Scaffold` and left only a terse
cross-reference in `### 8`'s table ("the major in `engines.node`, which overrides it") — no
instruction to act on. The fact got fixed and the findability got worse in the same edit.
This is not a pre-existing flaw surfacing under a new test; it is a direct, traceable side
effect of correcting B1's sibling gap, and the record should say so rather than filing it
as inherited.

**Q3's NEAR is pre-existing, not introduced by this branch.** Checked the same way: `##
Traps`' "Not testing that CI actually fails... push a broken commit once and watch it go
red" already existed in `develop` before this branch touched the file. This round added one
new trap (`### Traps` → "Pinning the version your host does not read") but did not touch
the CI-verification trap or move it. The structural issue — the concrete verification
technique living under `## Traps` and `## Definition of done` rather than under `### 7. CI,
on day one` itself — predates this round and is not this branch's doing.

---

## Prioritised defect list for Task 8

Ordered by how much a reader loses by hitting each unresolved. Each entry names the
section by heading (D-42) and what would close it.

1. **`### 5. Environment variables, validated at boot`, plus `## Entry criteria` and the
   first `## Definition of done` box (B1).** `DATABASE_URL: z.url()` is required
   unconditionally while the entry criteria says a database is optional and `.env.example`
   is specified with no values and no step ever fills them. Close it with an explicit
   branch: name the keys that are always required (`SESSION_SECRET`,
   `NEXT_PUBLIC_APP_URL`) versus the ones that depend on the entry-criteria decision
   (`DATABASE_URL`), and say what to do with the schema when the answer is "no database yet"
   — `.optional()` or delete the key.

2. **Between `## Entry criteria` and `### 7. CI, on day one` (B2).** No step creates the
   GitHub repository or pushes the first commit, though `### 7` assumes branch protection
   on an existing `main` and `### 8` assumes an existing remote to open a pull request
   against. Close it with the two or three commands (`git init` / `gh repo create --push` or
   equivalent) placed before `### 7`.

3. **`### 8. Connect Vercel`'s settings table, and `### AI in project setup` (B3).** Add the
   connected-repository row to the table — it is the setting the Definition of done's
   preview-URL box actually depends on — and make the two "three settings" lists agree.
   State plainly that `vercel link` sets the directory-to-project mapping only and does not
   perform the Git connection.

4. **`### 3. Linting and formatting` (N3, N4, N5).** Give the `format` / `format:check`
   script bodies explicitly (a path, not just a name), add or point to a
   `.prettierignore` covering `.next/` and the lockfile, and add one command
   (`pnpm format`) run over the freshly scaffolded files before the first commit — otherwise
   the reader's first CI run fails on code they never touched.

5. **`### 9. Error tracking` (N14, N15).** State where the Sentry auth token has to live for
   a *Vercel* build to use it, and give the same one-line verification method the CI section
   already models well: add a route that throws, deploy, visit it, confirm a readable stack
   trace.

6. **`### 2. Set the folder structure` (N16).** The tree includes `src/db/` unconditionally,
   contradicting the entry criteria's "if unsure, it does not [need a database]." One line —
   skip `src/db/` if the entry-criteria answer was no — closes it.

7. **`### 5. Environment variables, validated at boot` (N17).** "Import `env` everywhere" has
   no server/client boundary. One sentence — server modules only — prevents a real
   secret-leak failure mode in this framework.

8. **`### 7. CI, on day one` (N12).** State that the required status check's name is `verify`
   — the workflow's job id — rather than leaving a reader to infer it from the YAML.

9. **`### 6. Git hooks` (N7).** Widen the `pre-commit` globs (or note the gap deliberately)
   so `.md`, `.yml`, and `.js`/`.jsx` — including `README.md`, this stage's own required
   artifact — are caught by the hook the same way CI's `format:check` catches them.

10. **`### 8. Connect Vercel`'s table, findability only (Q2).** Not a factual error — the
    engines.node cross-reference is correct. Add one clause pointing back to `### 1.
    Scaffold` by name ("set in `### 1. Scaffold`") so a reader who opens `### 8` first for a
    Node-version problem is redirected in one sentence instead of backtracking unguided.
    Lowest priority: this is a navigation cost, not an incorrect instruction.
