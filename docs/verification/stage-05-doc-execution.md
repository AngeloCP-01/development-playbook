# Stage 05 doc execution — running the code rather than reading it

**D-50**: executable content in a document gets executed. Stage 03's round proved reading
the SQL and running the SQL are different instructions, and only the second found the
`strpos` backfill that turned every mononym into `last_name = first_name`.

Stage 05's executable content is TypeScript, so the equivalent of `docker run` is making
it typecheck against the stack the playbook itself prescribes.

**Ran before the port, and before any correction.** Nothing in `docs/05-development.md`
changed while producing this file. This is a measurement, not a fix.

## The harness

A scratch project outside the repo, because `web/` installs neither Zod nor Drizzle —
correctly, since `web/` is the playbook site and not an app built from the playbook.
Assuming those deps were present is the same trap the stage 04 round hit when a whole wave
of tests was written against `jest-dom` and `user-event`, neither of which this project
installs.

Versions were taken from `reference/stack.md`, not chosen:

| Prescribed by `reference/stack.md` | Installed and used |
|---|---|
| TypeScript 7.x | 7.0.2 |
| Zod 4.x | 4.4.3 |
| Drizzle ORM 0.45+ | 0.45.2 |
| React 19.x | 19.2.8 |

The doc has **six fenced blocks**; three are executable (two `tsx`, one `ts`). The other
three are the loop diagram, a commit message, and three shell commands.

Two passes were run. The **literal** pass compiles each block exactly as the document
prints it. The **charitable** pass supplies every symbol the document references but never
shows, leaving the document's own lines untouched, and asks a different question: given
everything it left out, is what it *did* write correct?

### The harness has teeth

The charitable pass exits 0, and a check that passes proves nothing until it has been shown
capable of failing. Two mutations to the document's own logic, each reverted:

```
--- MUTATION 1: feed the uuid string into the integer amount column ---
charitable/actions.ts(24,36): error TS2322: Type 'string' is not assignable to type
  'number | PgColumn<...> | SQL<unknown> | undefined'.
exit=1 (expect NON-zero)

--- MUTATION 2: compare the owner check against a non-existent field ---
charitable/actions.ts(22,33): error TS2339: Property 'nope' does not exist on type '{ id: string; }'.
exit=1 (expect NON-zero)

--- RESTORED: doc code verbatim again ---
exit=0 (expect 0)
```

Both mutations were caught and the restore returned to green, so the exit 0 below is
evidence rather than decoration.

---

## E1 — the Server Action imports two of its five external symbols

**Defect.** `### Server Actions need validation and authorization` is the most consequential
block on the page — the doc says of its step 3, "it is the one that becomes a data breach."
It imports `z` and `requireUser`, then uses `db`, `eq` and `invoices` with no import for any
of them. The literal pass:

```
literal/actions.ts(5,29): error TS2307: Cannot find module '@/lib/auth' or its corresponding type declarations.
literal/actions.ts(16,25): error TS2304: Cannot find name 'db'.
literal/actions.ts(17,12): error TS2304: Cannot find name 'eq'.
literal/actions.ts(17,15): error TS2552: Cannot find name 'invoices'. Did you mean 'invoice'?
literal/actions.ts(21,10): error TS2304: Cannot find name 'db'.
literal/actions.ts(21,20): error TS2552: Cannot find name 'invoices'. Did you mean 'invoice'?
literal/actions.ts(22,12): error TS2304: Cannot find name 'eq'.
```

The unresolved `@/lib/auth` module is **not** part of this finding — a snippet cannot ship
the reader's own project files, and that path is the document correctly pointing outward.
The three bare identifiers are different: they are not pointing anywhere. A reader
copying this block gets a file that does not compile, having been shown the import
discipline for exactly the two symbols that needed it least.

## E2 — two adjacent blocks contradict each other about whether imports are shown

**Defect, and the sharper half of E1.** `### Server Components by default` prints its import:

```tsx
import { getInvoices } from '@/features/billing/queries'
```

`### Keep route files thin`, eighteen lines later, uses `requireUser`, `getInvoices` and
`InvoiceTable` with no import line at all — while its own first line claims the block is
complete:

```tsx
// Route file: routing, auth, composition. Nothing else.
```

"Nothing else" reads as a statement about what a route file should contain. A beginner
reads it as a statement about what this block contains, and concludes route files do not
import. The two blocks teach the same pattern and disagree about the convention, which is
the document arguing with itself inside one section boundary.

## E3 — `InvoiceTable` is named three times and never produced

**Defect, and it lands on the doc's own central claim.** `### Vertical slices` defines the
unit of work as "column, query, component, test" and tells the reader to build "*view your
own display name* end to end." `InvoiceTable` is the component link of that chain. It is
rendered in both TSX blocks and never shown, never imported, never described.

The document supplies the column's home, the query's home (`src/features/billing/queries.ts`,
named twice) and the test's home (deferred to [06](../06-testing.md)). The one link it
teaches the reader to care about most is the one it never draws.

## E4 — stage 05 prescribes the bare `tsc --noEmit` that stage 04 warns against

**Defect, cross-stage, and the highest-value finding here.** `## Definition of done` says:

```
- [ ] `pnpm tsc --noEmit` clean
```

`docs/04-project-setup.md` defines the script and explains at length why the bare form is
wrong:

```json
"scripts": { "typecheck": "next typegen && tsc --noEmit" }
```

> Route types are generated, not written, so a bare `tsc --noEmit` passes locally off a
> [previous build] […] Off Next.js, drop `next typegen &&` and use bare `tsc --noEmit`.

Stage 05's `## Entry criteria` links directly to 04, so this is the reader's very next
stage. They set up the corrected script in 04, and 05 then tells them to invoke the raw
binary — which both reintroduces the failure 04 documented *and* bypasses the script they
just wrote, so it never runs.

This is not inferred from the docs alone. It is this project's own recorded incident:
`CLAUDE.md` says a bare `tsc --noEmit` "passes locally only because a previous build left
`.next` behind, and fails on a clean checkout — which is exactly how CI caught it."

Worth stating precisely rather than overstating: the failure is **latent**, not immediate.
A reader working the loop has run `pnpm dev`, so `.next/types/` is populated and the bare
command will pass for them. It fails on a clean checkout and in CI — which is the worst
shape for a Definition-of-done box, because the box is green exactly when it is checked and
red only later.

The checklist is also internally inconsistent about this: its neighbouring boxes invoke
scripts (`pnpm lint`, `pnpm format:check`) while this one invokes a binary.

## E5 — the logic is correct once the missing pieces are supplied

**Confirmed sound, and worth recording as a positive.** With stubs for `db`, `invoices`,
`eq`, `requireUser`, `getInvoices` and `InvoiceTable`, and the document's own lines
untouched, the charitable pass exits 0.

The authorize step behaves as the prose claims. `invoice?.ownerId !== user.id` throws on a
missing row as well as a foreign one, because `undefined !== user.id`, so the doc's advice
to return "Not found" rather than "Forbidden" is actually implemented by the code it prints
and not merely asserted beside it.

## E6 — DISPROVED: `pnpm tsc --noEmit` is not invalid on TypeScript 7

Suspected, then checked, then dropped. `reference/stack.md` prescribes TypeScript 7.x (the
Go compiler), which raised the question of whether the `tsc` binary still exists under that
name. It does:

```
$ ls node_modules/.bin/   → tsc
$ tsc --version           → Version 7.0.2
```

E4 stands on the missing `next typegen`, not on the binary name. Recording the disproof
because the reasoning that produced the suspicion was sound and someone will have it again.

## E7 — DISPROVED: `z.string().uuid()` is not stale in Zod 4

Suspected on the same grounds — Zod 4 introduced top-level `z.uuid()`, which raised the
possibility the document teaches a deprecated form. Both forms exist, no deprecation marker
appears in the shipped types, and the document's exact schema behaves correctly:

```
valid input parses: {"invoiceId":"57ef738d-…","amount":500}
rejected: {"invoiceId":"not-a-uuid", …}  -> invalid_format  Invalid UUID
rejected: {…,"amount":-5}                -> too_small       Too small: expected number to be >0
rejected: {…,"amount":1.5}               -> invalid_type    Invalid input: expected int, received number
z.uuid exists (zod4 top-level form): function
```

`z.number().int().positive()` rejects a negative *and* a non-integer, so all three
constraints the schema advertises are real. No change needed.

---

## Boundary, not a defect

**TypeScript 7 removed `baseUrl`.** The harness hit `error TS5102: Option 'baseUrl' has been
removed` and needed `paths` alone. That is `tsconfig` territory and belongs to stage 04 if
anywhere; stage 05 never mentions either option. Recorded so the next person configuring a
project against the prescribed 7.x does not lose the same ten minutes.

## Counts

| | Finding | Class |
|---|---|---|
| E1 | Server Action imports 2 of 5 symbols | defect |
| E2 | adjacent blocks disagree on showing imports | defect |
| E3 | `InvoiceTable` named three times, never produced | defect |
| E4 | bare `tsc --noEmit` contradicts stage 04 | defect |
| E5 | logic typechecks and matches its prose | sound |
| E6 | `tsc` binary exists on TS 7 | disproved |
| E7 | `z.string().uuid()` current in Zod 4 | disproved |

**Four defects, one confirmation, two disproofs, one boundary.** Three of the four defects
were invisible to reading and appeared only under a compiler; E4 came from cross-reading
stage 04 and this repo's own `CLAUDE.md`, which no compiler would have found.

Harness kept at
`scratchpad/doc-exec-05/` for the round; it is scratch, not a path a later reader can
follow, and `reference/stack.md` is the reproducible part.
