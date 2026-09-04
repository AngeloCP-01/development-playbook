# Stage 05 doc execution — run 2

**D-50**: executable content in a document gets executed, not read. **D-68**: the same
extracted blocks are compiled twice, and the two passes answer different questions — the
literal pass measures completeness (could a reader paste this and have it resolve), the
charitable pass measures whether the logic is right once every symbol the block leaves
out is supplied as a stub. Both numbers are recorded; neither substitutes for the other.

This is run 2, executed after this branch's corrections to `docs/05-development.md`
(commits through `3599b10`, twelve tasks against the twenty defects the spec catalogued).
Nothing in `docs/05-development.md` changed while producing this file — this is a
measurement, run against the doc as this branch left it, not a fix.

## What was cleared before starting

The harness at `scratchpad/doc-exec-05/` survived from the previous session and earlier
tasks on this branch had compiled their own blocks in it. Before extracting anything:

- Deleted the six stale root-level block files from run 1 (`block-1.txt` … `block-6.bash`)
  — run 1's extraction, now stale since the doc has changed substantially.
- Deleted `literal/` entirely (`actions.ts`, `billing-page.tsx`, `invoices-page.tsx` — 3
  files, run 1's count) and recreated it empty.
- Inside `charitable/`, deleted everything **except** the three files the task brief names
  as the persistent stub layer: `charitable/src/lib/auth.ts` (`requireUser()`),
  `charitable/src/db/schema.ts` (the `invoices` pgTable), `charitable/src/db/index.ts`
  (`db`). Removed: a stray top-level `charitable/actions.ts`, all of
  `charitable/src/app/`, all of `charitable/src/features/`, and a leftover
  `charitable/src/features/billing/queries.ts.bak` — all artifacts of an earlier task
  compiling its own slice of the doc, exactly the class of leftover the brief warned would
  mask or fabricate a result.

`git status --porcelain` on the harness before re-extracting: only the three named stubs
present under `charitable/src/`; `literal/` and everything else under `charitable/`
verified empty by `find literal charitable -type f`.

## The harness

Same scratch project, same installed versions — unchanged since run 1 and unchanged in
`reference/stack.md` on this branch:

| Prescribed by `reference/stack.md` | Installed and used |
|---|---|
| TypeScript 7.x | 7.0.2 |
| Zod 4.x | 4.4.3 |
| Drizzle ORM 0.45+ | 0.45.2 |
| React 19.x | 19 (`@types/react` 19.2.18) |
| — | `next` 16.3.1 (so `revalidatePath`, `useActionState` resolve for real) |

## Block count

The document now has **twelve fenced blocks total**, up from run 1's six. Counted from
every ```` ``` ```` opening marker in `docs/05-development.md`:

- **9 executable** — 6 `tsx`, 3 `ts` (run 1 had 3: 2 `tsx`, 1 `ts`)
- 3 non-executable — the loop diagram (`### The loop`), a commit-message example
  (`### Commits and branches`), and a `bash` block of four shell commands
  (`### Keep the feedback loop running`)

The nine executable blocks, by heading (D-42 — cited by heading, not line number):

| # | Heading | File (as the doc names it) |
|---|---|---|
| 1 | Server Components by default | `src/app/(app)/invoices/page.tsx` |
| 2 | Keep route files thin | `src/app/(app)/billing/page.tsx` |
| 3 | Keep route files thin | `src/features/billing/queries.ts` (`getInvoices`) |
| 4 | Server Actions need validation and authorization | `src/features/billing/actions.ts` |
| 5 | Server Actions need validation and authorization | `src/features/billing/invoice-amount-form.tsx` |
| 6 | Authorize reads, not just writes | `src/features/billing/queries.ts` (`getInvoice` fragment) |
| 7 | Authorize reads, not just writes | `src/app/(app)/billing/[id]/page.tsx` |
| 8 | Loading and error states | `src/app/(app)/billing/loading.tsx` |
| 9 | Loading and error states | `src/app/(app)/billing/error.tsx` |

Extracted with `sed -n '<start>,<end>p'` against the exact fence line numbers, then
spot-diffed against the source doc by eye for the trickiest blocks (the Server Action, the
`[id]` route, `error.tsx`) — all verbatim.

**Corpus non-emptiness, proven, not assumed:**

```
$ find literal -type f | wc -l
       9
$ wc -l literal/*.ts literal/*.tsx | tail -1
     136 total
$ tsc -p tsconfig.literal.json --listFilesOnly | grep -v node_modules
literal/actions.ts
literal/billing-id-page.tsx
literal/billing-page.tsx
literal/error.tsx
literal/invoice-amount-form.tsx
literal/invoices-page.tsx
literal/loading.tsx
literal/queries-getinvoice-fragment.ts
literal/queries.ts
$ tsc -p tsconfig.charitable.json --listFilesOnly | grep -v node_modules
  (14 files: the 9 blocks — queries.ts merges blocks 3 and 6 per the doc's own
  "alongside getInvoices" instruction, so 8 files there — plus the 6 support files:
  3 persistent stubs, 2 never-defined components, 1 ambient PageProps stub)
```

Both `tsc` invocations below read exactly these files — the run is not a green result
from an empty include.

## Literal pass

Compiled each block exactly as printed, in one invocation against `tsconfig.literal.json`
(`paths: { "@/*": ["./src/*"] }`, `src/` deliberately empty — the reader's own project
files are outward pointers, not something a doc snippet can ship).

```
$ tsc -p tsconfig.literal.json; echo "exit=$?"
literal/actions.ts(7,20): error TS2307: Cannot find module '@/db' or its corresponding type declarations.
literal/actions.ts(8,26): error TS2307: Cannot find module '@/db/schema' or its corresponding type declarations.
literal/actions.ts(9,29): error TS2307: Cannot find module '@/lib/auth' or its corresponding type declarations.
literal/billing-id-page.tsx(3,29): error TS2307: Cannot find module '@/lib/auth' or its corresponding type declarations.
literal/billing-id-page.tsx(4,28): error TS2307: Cannot find module '@/features/billing/queries' or its corresponding type declarations.
literal/billing-id-page.tsx(5,31): error TS2307: Cannot find module '@/features/billing/invoice-detail' or its corresponding type declarations.
literal/billing-id-page.tsx(7,55): error TS2304: Cannot find name 'PageProps'.
literal/billing-page.tsx(2,29): error TS2307: Cannot find module '@/lib/auth' or its corresponding type declarations.
literal/billing-page.tsx(3,29): error TS2307: Cannot find module '@/features/billing/queries' or its corresponding type declarations.
literal/billing-page.tsx(4,30): error TS2307: Cannot find module '@/features/billing/invoice-table' or its corresponding type declarations.
literal/invoices-page.tsx(2,29): error TS2307: Cannot find module '@/lib/auth' or its corresponding type declarations.
literal/invoices-page.tsx(3,29): error TS2307: Cannot find module '@/features/billing/queries' or its corresponding type declarations.
literal/invoices-page.tsx(4,30): error TS2307: Cannot find module '@/features/billing/invoice-table' or its corresponding type declarations.
literal/queries-getinvoice-fragment.ts(5,10): error TS2304: Cannot find name 'db'.
literal/queries-getinvoice-fragment.ts(6,19): error TS2304: Cannot find name 'invoices'.
literal/queries-getinvoice-fragment.ts(6,40): error TS2304: Cannot find name 'invoices'.
literal/queries.ts(3,20): error TS2307: Cannot find module '@/db' or its corresponding type declarations.
literal/queries.ts(4,26): error TS2307: Cannot find module '@/db/schema' or its corresponding type declarations.
exit=1
```

**18 errors, reclassified:**

- **14 are the `@/…` boundary**, unchanged in kind from run 1's treatment of
  `@/lib/auth` — every one resolves to a path inside the reader's own project
  (`@/db`, `@/db/schema`, `@/lib/auth`, `@/features/billing/queries`,
  `@/features/billing/invoice-table`, `@/features/billing/invoice-detail`). A snippet
  cannot ship the reader's own files. Not counted as defects.
- **The Server Action block (`literal/actions.ts`) now has zero bare-identifier
  errors** — only the three boundary `@/` imports. Run 1's E1 (`db`, `eq`, `invoices`
  used with no import) is **fixed**: `db`, `eq`, `invoices` are all imported now, along
  with `and`, `z`, `revalidatePath`, `requireUser`.
- **`literal/billing-page.tsx` and `literal/invoices-page.tsx` are now symmetric** —
  both show the identical three-import shape. Run 1's E2 (adjacent blocks disagreeing on
  whether imports are shown) is **fixed**.
- **1 is a harness limitation, not a doc defect**: `PageProps` is a Next-generated global
  that exists only after `next build`/`next typegen` populate `.next/types/`. This bare
  literal-pass invocation runs neither, so `Cannot find name 'PageProps'` is what the
  instrument reports for any block using this type outside a built app — not a
  claim about the document. See "PageProps: which claim which pass proves" below.
- **3 are the `queries-getinvoice-fragment.ts` block** (`### Authorize reads, not just
  writes`), using `db` and `invoices` with no import. Structurally this is the same class
  of gap as the old E1, but the doc's own comment on this block reads `// … alongside
  getInvoices; the import gains \`and\`` — it explicitly frames itself as a delta to the
  established `queries.ts` file, not a standalone paste target. Recorded as a residual
  completeness gap distinct in kind from E1: E1 claimed nothing about being partial and
  still failed; this block says up front that it is partial. Worth a decision on whether
  "signposted incomplete" clears the "a reader could paste this and have it resolve"
  bar the pass is measuring — it does not, literally, but the signposting is real.

## PageProps: which claim which pass proves

Per the task brief, `PageProps<'/route'>` is a Next-generated global, not something
either `tsc` invocation in this harness can produce on its own — this branch's Task 5
hit the identical wall and split the proof in two. Same split here:

**Claim 1 — the block's own logic (params destructure, `getInvoice(id, user.id)`,
`notFound()`, component usage) compiles.** Proven in the charitable pass via an ambient
ad-hoc stub, `charitable/src/types/next-page-props.d.ts`:

```ts
type PageProps<Route extends string = string> = {
  params: Promise<Record<string, string>>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}
```

This differs from Task 5's method (which substituted the type inline in its own copy of
the block) by leaving the document's own printed line —
`{ params }: PageProps<'/billing/[id]'>` — untouched and instead supplying the missing
global as a stub, matching how every other charitable symbol (`db`, `requireUser`, …) is
handled. Both approaches prove the same thing; this one keeps the charitable pass's rule
("the document's own lines are never edited") uniform across all nine blocks.

**Claim 2 — the literal string `'/billing/[id]'` is a route that actually exists in this
app's generated route union.** The ambient stub above accepts any string, so it cannot
prove this; only a real `next typegen` run against a real route can. Reproduced Task 5's
Run 2 exactly:

```
$ mkdir -p "web/src/app/billing/[id]"
$ cat > "web/src/app/billing/[id]/page.tsx"
export default async function ScratchBillingPage({ params }: PageProps<'/billing/[id]'>) {
  const { id } = await params
  return <div>{id}</div>
}
$ cd web && pnpm typecheck
> next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
```

Exit 0 (typecheck script exits nonzero and prints diagnostics on failure; none printed).
Cleaned up:

```
$ rm -rf "web/src/app/billing"
$ cd web && pnpm typecheck        # regenerates .next/types/routes.d.ts
$ grep -n "billing" .next/types/routes.d.ts   # no output — route gone
$ git status --porcelain                      # clean except the pre-existing,
                                               #   untracked, zero-byte, unrelated
                                               #   reference/rest-api-best-practices.md
```

So: the literal pass's `Cannot find name 'PageProps'` is the instrument's own ceiling,
not a doc defect — and the block's logic (Claim 1) and its exact route spelling
(Claim 2) are both independently proven true, by two different compiles that prove two
different things. Neither compile alone would have proven both.

## Charitable pass

Every symbol left out is supplied as a stub or an ambient type; the document's own lines
are untouched. `tsconfig.charitable.json`, `paths: { "@/*": ["./charitable/src/*"] }`.

```
$ tsc -p tsconfig.charitable.json; echo "exit=$?"
exit=0
```

Clean. No errors of any kind, including for the `queries-getinvoice-fragment.ts` block —
merged into the same `charitable/src/features/billing/queries.ts` as the earlier
`getInvoices` block, exactly as its own comment instructs ("alongside getInvoices; the
import gains `and`"), producing one file with both functions and the combined
`import { and, eq } from 'drizzle-orm'` line the second block prints. This is not
supplying an omitted symbol silently (the E1 pattern) — it is following the doc's own
explicit instruction for where the fragment belongs.

## Teeth checks

Two mutations, of different kinds, each reverted and confirmed restored; then the exact
"authorization gap" mutation from this branch's own Task 4, run separately to prove the
opposite point (see next section).

```
--- MUTATION 1: assign a string (uuid) into the integer amount column — a type-level bug ---
charitable/src/features/billing/actions.ts(24,12): error TS2322: Type 'string' is not
  assignable to type 'number | PgColumn<ColumnBaseConfig<ColumnDataType, string>, {}, {}>
  | SQL<unknown> | undefined'.
exit=1 (expect NON-zero)
--- restored, diff against pre-mutation copy: no output (identical) ---

--- MUTATION 2: reference a column that does not exist (`invoices.nope`) — a name-level bug ---
charitable/src/features/billing/queries.ts(7,55): error TS2339: Property 'nope' does not
  exist on type 'PgTableWithColumns<{ name: "invoices"; … }>'.
charitable/src/features/billing/queries.ts(12,49): error TS2339: Property 'nope' does not
  exist on type 'PgTableWithColumns<{ name: "invoices"; … }>'.
exit=1 (expect NON-zero)
--- restored, diff against pre-mutation copy: no output (identical) ---

--- RE-CONFIRM GREEN AFTER BOTH RESTORES ---
exit=0 (expect 0)
```

Both mutations were caught, both restores verified byte-identical to the pre-mutation
file by `diff`, and the pass returned to green — the exit 0 above is evidence, not
decoration.

## The limit of the instrument, plainly

**The compiler proves a block is complete. It never proves a block is secure.** This
branch's own Task 4 demonstrated exactly this by removing the owner predicate from the
authorization `where` clause and showing the result still compiles. Reproduced here,
separately from the teeth checks above (this mutation is expected to pass, not fail — it
demonstrates the ceiling, not the floor):

```
--- DEMONSTRATION (not a teeth check): drop `eq(invoices.ownerId, user.id)` from the
    Server Action's `where`, leaving only `eq(invoices.id, parsed.data.invoiceId)` ---
exit=0
```

Any caller who can guess or enumerate an invoice id can now update someone else's
invoice — the exact "authenticates but does not authorize" bug the doc's own prose
names as "the most common serious security bug in App Router applications." `tsc` has
nothing to say about it, because nothing about it is a type error: `and(...)` and a bare
`eq(...)` return the same `SQL` type. Restored, verified identical, re-confirmed green.
A green compile is evidence the code will run. It is not evidence the code is safe to
run.

## Comparison against run 1

| | Run 1 | Run 2 |
|---|---|---|
| Fenced blocks, total | 6 | 12 |
| Executable (`ts`/`tsx`) | 3 (2 tsx, 1 ts) | 9 (6 tsx, 3 ts) |
| Literal-pass errors | 7, all in one block (Server Action) | 18, spread across 5 blocks |
| … of which boundary (`@/…`, reader's own files) | not separated in run 1's tally (all 7 were the defect) | 14 |
| … of which harness ceiling (`PageProps`) | n/a (block did not exist) | 1 |
| … of which residual/signposted gap | n/a | 3 (`getInvoice` fragment) |
| … of which silent, undisclosed defect (E1-class) | 7 | **0** |
| Charitable-pass result | exit 0 | exit 0 |
| Teeth checks | 2 mutations, both caught, restored | 2 mutations, both caught, restored, plus a third (Task 4's) shown to NOT be caught, on purpose |

**E1 (Server Action imports 2 of 5 symbols) — fixed.** `literal/actions.ts` now imports
`db`, `eq`, `invoices`, `and`, `z`, `revalidatePath`, `requireUser` — the only residual
errors are the `@/…` boundary, present in every block that references the reader's own
project and not counted against the doc.

**E2 (adjacent blocks disagree about showing imports) — fixed.** `billing-page.tsx` and
`invoices-page.tsx` are now import-symmetric; both show all three imports.

**E3 (`InvoiceTable` named three times, never produced) — still open, unaddressed this
round.** `InvoiceTable` (`### Server Components by default`, `### Keep route files
thin`) and `InvoiceDetail` (`### Authorize reads, not just writes`) are still imported
and rendered, never defined, in the current doc:

```
$ grep -n "InvoiceTable\|InvoiceDetail" docs/05-development.md
(6 matches, all import or JSX-usage lines; zero `function InvoiceTable`/`function
InvoiceDetail` definitions)
```

Recorded, not fixed, per the task's separation of pass from fix wave.

**E4 (bare `tsc --noEmit` contradicts stage 04) — fixed.** `## Definition of done` now
reads: "`pnpm typecheck` clean — the script from [04](04-project-setup.md), not a bare
`tsc --noEmit`, which passes off a stale build and fails on a clean checkout."

**E5 (logic sound once missing pieces are supplied) — reconfirmed.** Charitable exit 0,
teeth-checked twice above.

**E6 (`tsc` binary exists on TS 7) — still holds.** `tsc --version` → `Version 7.0.2`,
same as run 1.

**E7 (`z.string().uuid()` current in Zod 4) — still holds**, not independently
re-verified this run beyond the charitable pass compiling it cleanly (the schema in
`actions.ts` is byte-identical to run 1's).

**New this run — the `queries-getinvoice-fragment.ts` literal-pass gap.** See "Literal
pass" above. Recorded as distinct in kind from E1: signposted as a delta rather than
silent, but a reader who pastes only this block still gets a file that does not compile.

## Counts

| | Finding | Class |
|---|---|---|
| E1 | Server Action import gap | **fixed** |
| E2 | import asymmetry between adjacent blocks | **fixed** |
| E3 | `InvoiceTable`/`InvoiceDetail` never defined | **still open** |
| E4 | bare `tsc --noEmit` vs. stage 04 | **fixed** |
| E5 | logic typechecks and matches its prose | reconfirmed sound |
| E6 | `tsc` binary exists on TS 7 | still holds |
| E7 | `z.string().uuid()` current in Zod 4 | still holds |
| new | `getInvoice` fragment doesn't compile standalone (signposted) | recorded, not a defect of E1's silent kind |
| new | `PageProps` ceiling in a non-built harness | instrument limit, not a doc defect — split-proven both ways |

**Three of run 1's four defects are fixed. One (E3) is not.** The literal pass's raw
error count rose from 7 to 18 only because the corpus tripled — the *rate* of silent,
undisclosed import gaps went from 7-in-3-blocks to 0-in-9-blocks. The charitable pass
stayed green under a corpus three times the size, teeth-checked with three mutations
this round (two that must fail and did; one that must not, and did not — which is the
point of it). What no compile of any kind will ever show: the authorization predicate
that is missing rather than merely mistyped. That gap is unclosable by this instrument
by construction, which is why it is stated here rather than left implicit.

Harness kept at `scratchpad/doc-exec-05/` for the round, scratch and not committed, per
the same convention run 1 used; `reference/stack.md` is the reproducible part.
