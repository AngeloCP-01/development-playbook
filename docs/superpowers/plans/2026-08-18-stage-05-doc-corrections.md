# Stage 05 Doc Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all twenty defects in `docs/05-development.md` so the W-3.5 port works from a document that does not argue with itself, and prove each code block by compiling it rather than reading it.

**Architecture:** Twelve tasks on `fix/stage-05-doc-corrections`. Task 1 builds the anchor guard first, because Task 7 renames a heading four citations depend on and the guard is what turns that from a silent break into a caught one. Tasks 2–9 are the corrections, each scoped to one section cluster so a reviewer can reject one and approve its neighbour. Task 10 re-runs all three verification instruments, Task 11 is the fix wave they produce, Task 12 closes the records. No app content code changes on this branch; `ready` stays `false`.

**Tech Stack:** Markdown. `pnpm`, `vitest`, `node`, `git`, and a scratch TypeScript project matching `reference/stack.md` for the execution passes.

**Spec:** `docs/superpowers/specs/2026-08-18-stage-05-doc-corrections-design.md`

## Global Constraints

- **Branch:** `fix/stage-05-doc-corrections`, cut from `develop`. Never merge to `main`. **Ask before any merge, including into `develop`.**
- **Commit trailer**, every commit: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` — verified against the last 30 commits, and it is what `CLAUDE.md` specifies.
- **Conventional Commits**, `type(scope): subject`, lowercase after the colon. Scopes here: `docs`, `dev`, `a11y`, `tracker`, `test`.
- **D-42:** cite doc sections by heading, never by line number.
- **D-47:** if a correction changes a concept in `web/src/lib/terms.ts`, edit it there and run `pnpm gen:glossary`. Never hand-edit `reference/glossary.md`.
- **D-50:** executable content gets executed. Every code block this plan writes is compiled before its task commits.
- **`web/AGENTS.md`:** this Next.js version postdates training data. Every framework claim is checked against `node_modules/next/dist/docs/` and cited in the task report.
- **Prettier skips markdown by design.** `pnpm format:check` is not a check on `docs/*.md`.
- **The scratch directory** is `/private/tmp/claude-501/-Users-angelito-personal-Development-Playbook/41f26a02-62d1-42c0-accc-36bba505670f/scratchpad`. The TypeScript harness at `scratchpad/doc-exec-05/` already exists with `zod@4.4.3`, `drizzle-orm@0.45.2`, `typescript@7.0.2`, `@types/node`, and a working `tsconfig.charitable.json`. Nothing in scratch is committed.
- **`ready` stays `false`** for `05-development` in `web/src/lib/stages.ts`. This branch does not port.
- **THE FILE WINS.** Where this plan's quoted "current text" and the actual document disagree, **the document is right**. Say so in the task report rather than forcing the plan's version. Five of six tasks on the last two rounds found a brief that did not match the tree.
- **Which symbols a block must produce, and which it may merely import.** This round exists partly because `InvoiceTable` was rendered twice and defined nowhere, so the temptation is to over-correct and produce every symbol, which would bury each lesson in scenery. The line: **a block produces the symbol its section is teaching, and may import anything that is only scenery** from a path the doc has already established. `InvoiceTable` had to be produced because `### Vertical slices` names "component" as a step of the unit of work. `InvoiceDetail` in Task 5 is scenery in a section about scoping a query, and stays an import. If you cannot tell which a symbol is, produce it.
- **`humanizer:humanizer`** runs over the corrected prose in Task 12. Skip it for code blocks, tables, and terminal output. Em dashes are house voice here and are **not** stripped: fifteen existing specs run a median of 0.13 per line.

---

### Task 1: The anchor guard, written test-first

**Files:**
- Modify: `web/src/lib/source-citations.test.ts`
- Read only: `docs/*.md`

**Interfaces:**
- Produces: a test that resolves every `](NN-name.md#anchor)` link across `docs/` against the target document's real headings. Task 7 depends on this: renaming `### Commits` makes this test fail for a real reason, which is Task 7's RED.

This task comes first and its RED is deliberately **fabricated**, because every anchor in `docs/` resolves correctly today. A test written now against the real tree would pass on its first run, which proves nothing. The fabricated break proves the guard has teeth; Task 7 then supplies a real one.

`source-citations.test.ts` currently scans `web/src/` for citations of the form `docs/NN-name.md, "Heading"`. It cannot see markdown-to-markdown links. Read it before editing — its existing helpers (`docTitle`, the `DOCS` constant) are reused here.

- [ ] **Step 1: Read the existing test to reuse its helpers**

Run: `cat web/src/lib/source-citations.test.ts`

Note the `DOCS` path constant and how it reads doc files. Do not duplicate them.

- [ ] **Step 2: Write the failing test**

Append to `web/src/lib/source-citations.test.ts`:

```ts
// The guard above resolves citations written in app source. It cannot see
// markdown-to-markdown links, and `docs/` is full of them: four point into
// stage 05 alone. A heading rename breaks them silently, because nothing in
// lint, typecheck, the unit suite or the audit suite reads a markdown link.
//
// TD-5 is the reason this matters more than it looks: the "124/124 links
// resolve" figure quoted in the tracker came from a P-4 script that no longer
// exists. Nothing has re-run it since.

/** GitHub's heading-slug rules, which is what a `#anchor` in a .md file resolves against. */
function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function headingSlugs(md: string): Set<string> {
  const slugs = new Set<string>()
  for (const line of md.split('\n')) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*$/)
    if (m) slugs.add(slugify(m[1]))
  }
  return slugs
}

/** Every `](target.md#anchor)` link in every doc, with its source file. */
function anchorLinks(): {
  from: string
  target: string
  anchor: string
}[] {
  const out: { from: string; target: string; anchor: string }[] = []
  for (const entry of readdirSync(DOCS)) {
    if (!/^\d\d-.+\.md$/.test(entry)) continue
    const md = readFileSync(join(DOCS, entry), 'utf8')
    for (const m of md.matchAll(/\]\((\d\d-[a-z-]+\.md)#([a-z0-9-]+)\)/g)) {
      out.push({ from: entry, target: m[1], anchor: m[2] })
    }
  }
  return out
}

test('every cross-document anchor link resolves to a real heading', () => {
  const links = anchorLinks()

  // A guard that resolves nothing is green and worthless. This repo has shipped
  // seven of those. Assert the corpus is non-empty before asserting it is clean.
  expect(links.length, 'no anchor links found — the matcher is broken').
    toBeGreaterThan(3)

  const broken = links.filter((link) => {
    const md = readFileSync(join(DOCS, link.target), 'utf8')
    return !headingSlugs(md).has(link.anchor)
  })

  expect(
    broken.map((b) => `${b.from} -> ${b.target}#${b.anchor}`),
    'anchor links pointing at headings that do not exist',
  ).toEqual([])
})
```

Ensure `readdirSync` and `join` are imported at the top of the file. The existing imports are `readdirSync, readFileSync, statSync` from `node:fs` and `join` from `node:path`, so only check rather than add.

- [ ] **Step 3: Run it and confirm it passes against the current tree**

Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts`
Expected: PASS. Every anchor in `docs/` resolves today. **This is not yet evidence.**

- [ ] **Step 4: Teeth check — fabricate a break and confirm the guard catches it**

Temporarily corrupt one anchor:

```bash
cd /Users/angelito/personal/Development-Playbook
cp docs/10-documentation.md /tmp/10-doc.bak
perl -0pi -e 's/05-development\.md#commits/05-development.md#no-such-heading/g' docs/10-documentation.md
grep -n "05-development.md#" docs/10-documentation.md
```

Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts`
Expected: **FAIL**, naming `10-documentation.md -> 05-development.md#no-such-heading`.

Paste the raw failure into the task report. If it passes, the matcher regex is wrong — fix the guard, not the fixture.

- [ ] **Step 5: Restore, and confirm green again**

```bash
cp /tmp/10-doc.bak docs/10-documentation.md
grep -n "05-development.md#" docs/10-documentation.md   # must read #commits again
cd web && pnpm vitest run src/lib/source-citations.test.ts
```
Expected: PASS.

Verify the restore actually landed. A `perl -0p` without `/g` and an edit script that aborts before writing have both faked a mutation on this project before, recorded in `docs/learnings/quality-gates-101.md`.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/source-citations.test.ts
git commit -m "$(cat <<'EOF'
test(docs): resolve cross-document anchor links against real headings

D-42 guards citations written in app source. It cannot see a markdown
link, so `](05-development.md#commits)` in 10-documentation.md is
unguarded — and the next task renames that heading.

The corpus assertion is deliberate. A guard that resolves zero links
passes while checking nothing, which is this repo's most common defect
and is now past seven instances.

Teeth-checked against a fabricated bad anchor before committing; the
real break arrives with the rename.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: The `'use client'` factual error, in both places it appears

**Files:**
- Modify: `docs/05-development.md`, sections `### Server Components by default` and `## Traps`

**Interfaces:**
- Consumes: nothing.
- Produces: corrected `'use client'` prose. Task 6 refers to it when distinguishing the two senses of "loading state".

This closes **D3**. The two passages are fixed in one task on purpose: they state the same wrong reason, and fixing one leaves the other contradicting it.

The claim is verified, not argued. `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` says under "On the server": "**Client Components** and the RSC Payload are used to [prerender](/docs/app/glossary#prerendering) HTML." Under "Subsequent Navigations": "**Client Components** are rendered entirely on the client, without the server-rendered HTML."

- [ ] **Step 1: Re-read both passages in the doc**

Run: `grep -n "use client" docs/05-development.md`

Confirm the current text matches what this task quotes. If it does not, the file wins.

- [ ] **Step 2: Replace the closing paragraph of `### Server Components by default`**

Current:

```markdown
Add `'use client'` only when you need interactivity — event handlers, state, effects,
browser APIs. When you do, push it to the leaves. A `'use client'` at the top of a page
makes the whole tree client-rendered; on the specific interactive component, it does not.
```

Replace with:

```markdown
Add `'use client'` only when you need interactivity — event handlers, state, effects,
browser APIs. When you do, push it to the leaves.

`'use client'` does not mean "not rendered on the server". Client Components are still
prerendered to HTML on the first load, which is why a page using them is not blank before
its JavaScript arrives. What the directive marks is a boundary: everything below it ships
to the browser, gives up direct access to server-only data, and on later navigations
renders entirely on the client.

A `'use client'` at the top of a page puts the whole tree on the far side of that
boundary. On the one component that needs a click handler, it does not. And a Server
Component passed through as `children` stays a Server Component even when its parent is a
Client Component, so the boundary does not have to swallow a subtree to cross it.
```

- [ ] **Step 3: Replace the `## Traps` entry**

Current:

```markdown
**`'use client'` at the top of a page.** Opts the entire tree out of server rendering.
Push it to the leaves.
```

Replace with:

```markdown
**`'use client'` at the top of a page.** Everything below it ships to the browser and
gives up server-only data access. It is still prerendered, so the symptom is a heavy
bundle and a slow hydration rather than a blank page — which is why this one is easy to
miss. Push it to the leaves.
```

- [ ] **Step 4: Confirm no third occurrence survives**

Run: `grep -n "client-rendered\|out of server rendering\|entire tree" docs/05-development.md`
Expected: no matches.

- [ ] **Step 5: Confirm the doc tests still pass**

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts src/lib/source-citations.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/05-development.md
git commit -m "$(cat <<'EOF'
docs(dev): correct what 'use client' actually costs

The doc said a 'use client' at the top of a page makes the whole tree
client-rendered, and Traps said it opts the tree out of server
rendering. Next's own docs say Client Components and the RSC payload
are used to prerender HTML, and that they render entirely on the
client only on subsequent navigations.

The advice to push it to the leaves was right and the reason given was
wrong, which is the shape that misleads: a reader debugging a slow page
goes looking for HTML that is already there. The real cost is the
bundle and the loss of server-only data access.

Also records that a Server Component passed as `children` stays on the
server, so the boundary need not swallow a subtree.

Verified against node_modules/next/dist/docs/01-app/01-getting-started/
05-server-and-client-components.md per web/AGENTS.md.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: The route, the query, the component, and where UI lives

**Files:**
- Modify: `docs/05-development.md`, sections `### Vertical slices`, `### Server Components by default`, `### Keep route files thin`, `## Artifacts`

**Interfaces:**
- Consumes: Task 2's corrected `### Server Components by default` prose. Do not revert it.
- Produces: `getInvoices(ownerId: string)` as the single signature, and `src/features/billing/invoice-table.tsx` as the component's stated home. Tasks 4 and 6 both reference these.

This closes **D5** (adjacent blocks disagreeing about imports), **D6** (two `getInvoices` signatures), **D14** (`queries.ts` asserted but never shown), **D15** (the column has no pointer), **D17** (UI has no home), and the **C2** convergence (`InvoiceTable` never produced).

- [ ] **Step 1: Add the schema pointer to `### Vertical slices`**

After the paragraph ending "Then add editing. Then avatars.", insert:

```markdown
The column comes first and it is not this stage's to teach. The table it belongs to was
designed in [03 — Architecture](03-architecture.md); the tooling that applies the change
was installed in [04 — Project Setup](04-project-setup.md). What belongs here is the
habit: change the schema for the one case you are shipping, not for the three you expect
to ship next.
```

- [ ] **Step 2: Fix the first route example so both examples agree**

In `### Server Components by default`, replace the code block:

```tsx
// src/app/(app)/invoices/page.tsx — a Server Component
import { getInvoices } from '@/features/billing/queries'

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  return <InvoiceTable invoices={invoices} />
}
```

with:

```tsx
// src/app/(app)/invoices/page.tsx — a Server Component
import { requireUser } from '@/lib/auth'
import { getInvoices } from '@/features/billing/queries'
import { InvoiceTable } from '@/features/billing/invoice-table'

export default async function InvoicesPage() {
  const user = await requireUser()
  const invoices = await getInvoices(user.id)
  return <InvoiceTable invoices={invoices} />
}
```

- [ ] **Step 3: Rewrite `### Keep route files thin` so its block is complete and its prose shows the query**

Replace the whole section body (keep the `### Keep route files thin` heading) with:

```markdown
```tsx
// src/app/(app)/billing/page.tsx — routing, auth, composition. Nothing else.
import { requireUser } from '@/lib/auth'
import { getInvoices } from '@/features/billing/queries'
import { InvoiceTable } from '@/features/billing/invoice-table'

export default async function BillingPage() {
  const user = await requireUser()
  const invoices = await getInvoices(user.id)
  return <InvoiceTable invoices={invoices} />
}
```

Every symbol a file uses is imported in that file. The examples on this page show their
imports for the same reason your editor does: a block you cannot paste and run is a block
you cannot check.

The logic lives one directory away, and it is an ordinary function:

```ts
// src/features/billing/queries.ts
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { invoices } from '@/db/schema'

export async function getInvoices(ownerId: string) {
  return db.select().from(invoices).where(eq(invoices.ownerId, ownerId))
}
```

No framework, no request, no mocking. A test calls it with an id and checks what comes
back ([06](06-testing.md)). When business logic is inside a route file, testing it means
booting Next.js — which is why that logic tends to go untested.

Feature code lives under `src/features/<feature>/`, and that includes its components.
`invoice-table.tsx` sits beside `queries.ts` because they change together. `src/components/`
is for what more than one feature uses.
```

- [ ] **Step 4: Update `## Artifacts` to say where UI goes**

Replace:

```markdown
- Feature code in `src/features/`, route files thin
```

with:

```markdown
- Feature code in `src/features/<feature>/`, components included, route files thin
```

- [ ] **Step 5: Verify every block in the section compiles**

The harness at `scratchpad/doc-exec-05/` already has the stubs. Extract the three blocks this task wrote into `charitable/`, add the `invoice-table.tsx` and `queries.ts` bodies as real files rather than stubs, and run:

```bash
cd /private/tmp/claude-501/-Users-angelito-personal-Development-Playbook/41f26a02-62d1-42c0-accc-36bba505670f/scratchpad/doc-exec-05
./node_modules/.bin/tsc -p tsconfig.charitable.json; echo "exit=$?"
```
Expected: `exit=0`.

Then teeth-check it: change `getInvoices(user.id)` to `getInvoices(user)` in one copied block, confirm a type error, revert. Paste both runs into the report.

- [ ] **Step 6: Commit**

```bash
git add docs/05-development.md
git commit -m "$(cat <<'EOF'
docs(dev): show the query, the component, and every import

Three defects with one cause: the code blocks were excerpts with their
imports and their callers removed. The cold reader could not produce a
single compiling file for its first slice.

- both route examples now import every symbol they use, and they no
  longer disagree about it: one showed an import line, the next showed
  none while claiming to be a complete route file
- getInvoices had two signatures eighteen lines apart, one taking an
  owner id and one taking nothing, with no note that either superseded
  the other. It takes an owner id.
- queries.ts was named twice and characterised as "a plain function
  that can be tested without a framework" without ever being shown
- InvoiceTable was rendered in two blocks and defined in neither, while
  Vertical slices teaches "column, query, component, test" as the unit
  of work. It was the one link the page never drew.

Artifacts now says components live with their feature. The column gets
a pointer to 03 and 04 rather than a schema tutorial, since the
mechanism is theirs and only the habit is this stage's.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: The Server Action — imports, return, and one atomic authorize

**Files:**
- Modify: `docs/05-development.md`, section `### Server Actions need validation and authorization`

**Interfaces:**
- Consumes: `getInvoices(ownerId)` and the `src/features/billing/` layout from Task 3.
- Produces: `updateInvoice(input: unknown)` returning `{ ok: true } | { ok: false, error: string }`. Task 6's `### Loading and error states` cites this return type by name.

This is the round's largest single edit and closes **C1** (two of five imports), **D2** (prose says Return, code throws), **D4** (check-then-act), **D11** (raw Drizzle result crosses the RPC boundary), **D12** (no caller), **D13** (no revalidation).

**Do not rename this heading.** Three anchor citations depend on it: `docs/03-architecture.md` twice and `docs/07-code-review.md` once. Task 1's guard will catch it if you do.

The throw-to-return change is grounded in Next's own guidance, `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`: expected errors "should be handled explicitly and returned to the client", and "avoid using `try`/`catch` blocks and throw errors. Instead, model expected errors as return values." **Do not** justify it by claiming Next masks Server Action messages with a digest in production; that mechanism is not in the shipped docs and the completeness reader's assertion of it was dropped for that reason.

- [ ] **Step 1: Replace the section's code block**

```ts
// src/features/billing/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { invoices } from '@/db/schema'
import { requireUser } from '@/lib/auth'

const schema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().int().positive(),
})

export async function updateInvoice(input: unknown) {
  const user = await requireUser()                       // 1. authenticate

  const parsed = schema.safeParse(input)                 // 2. validate
  if (!parsed.success) return { ok: false, error: 'Invalid amount' } as const

  const updated = await db                               // 3. authorize
    .update(invoices)
    .set({ amount: parsed.data.amount })
    .where(
      and(
        eq(invoices.id, parsed.data.invoiceId),
        eq(invoices.ownerId, user.id),
      ),
    )
    .returning({ id: invoices.id })

  if (updated.length === 0) return { ok: false, error: 'Not found' } as const

  revalidatePath('/billing')
  return { ok: true } as const
}
```

- [ ] **Step 2: Replace the paragraphs that follow it**

Current:

```markdown
Authenticate, validate, authorize — every action, every time. Never trust an ID from the
client to belong to the caller. Step 3 is the one people omit, and it is the one that
becomes a data breach.

Return "Not found" rather than "Forbidden" for records the user does not own. "Forbidden"
confirms the record exists, which leaks information.
```

Replace with:

```markdown
Authenticate, validate, authorize — every action, every time. Never trust an ID from the
client to belong to the caller. Step 3 is the one people omit, and it is the most common
serious security bug in App Router applications.

Notice that step 3 is not a separate read. Fetching the row, comparing its owner, and then
updating by id alone leaves a gap between the check and the write, and it is easy to write
the check correctly and still forget it in the `where`. Putting the owner in the `where`
makes the authorization and the update the same statement, and `returning()` tells you
whether it matched.

That also gets the disclosure right for free. Zero rows means either the invoice does not
exist or it is not yours, and the caller cannot tell which — so "Not found" is the honest
answer as well as the safe one. Answering "Forbidden" would confirm the record exists.

The action returns its failures instead of throwing them. A record that is not yours is a
normal outcome, not a bug, and Next's error handling draws exactly that line: throw for the
unexpected and let an error boundary catch it, return the expected. The caller needs the
message to put it on screen, which a thrown error does not give it.

Return the narrowest thing that works — `{ ok: true }`, an id, a count. Whatever an action
returns crosses the network to the client, so returning the raw database result makes your
table's shape part of a public contract.
```

- [ ] **Step 3: Add the caller, so the endpoint has one**

Append to the section:

```markdown
And the other half, because an action nothing calls is half an endpoint:

```tsx
// src/features/billing/invoice-amount-form.tsx
'use client'

import { useActionState } from 'react'
import { updateInvoice } from './actions'

export function InvoiceAmountForm({ invoiceId }: { invoiceId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) =>
      updateInvoice({
        invoiceId,
        amount: Number(formData.get('amount')),
      }),
    null,
  )

  return (
    <form action={formAction}>
      <input name="amount" type="number" min="1" required />
      <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
      {state?.ok === false && <p role="alert">{state.error}</p>}
    </form>
  )
}
```

This is where `'use client'` earns itself: the form needs a pending state and an error to
display. It is a leaf, and the page holding it stays a Server Component.

`revalidatePath` in the action is what makes the change appear. Without it the mutation
succeeds, the database is correct, and the list on screen still shows the old amount until
something else forces a refresh — which is a bug reported as "it didn't save".
```

- [ ] **Step 4: Compile all three blocks**

Copy them into the harness, supplying `revalidatePath` and `useActionState` from the real `next` and `react` packages already installed in `web/`. If the scratch project lacks `next`, install it at the version `reference/stack.md` names rather than stubbing the import — a stub would hide a wrong signature.

```bash
cd /private/tmp/claude-501/-Users-angelito-personal-Development-Playbook/41f26a02-62d1-42c0-accc-36bba505670f/scratchpad/doc-exec-05
pnpm add -s next@16 react@19
./node_modules/.bin/tsc -p tsconfig.charitable.json; echo "exit=$?"
```
Expected: `exit=0`.

- [ ] **Step 5: Teeth check the compile**

Break the authorize clause by removing the owner predicate, confirm the block still compiles (it will — this is a logic defect, not a type defect), and **say so in the report**. Then break it in a way the compiler does catch: change `parsed.data.amount` to `parsed.data.invoiceId`. Confirm the error, revert both.

This distinction matters and belongs in the report: the compiler proves the block is complete, not that it is secure. The security claim rests on reading, and it is the reason a reviewer sees this task.

- [ ] **Step 6: Confirm no citation broke**

Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts`
Expected: PASS. If it fails naming `#server-actions-need-validation-and-authorization`, the heading was renamed. Put it back.

- [ ] **Step 7: Commit**

```bash
git add docs/05-development.md
git commit -m "$(cat <<'EOF'
docs(dev): make the Server Action compile, return, and authorize atomically

The page's security exemplar imported two of the five symbols it used,
and the cold reader and the compiler found that independently.

Three changes beyond completeness:

- it returns instead of throwing. The prose said "Return 'Not found'"
  four lines under code that threw it, and Next's error-handling guide
  names the throw as the anti-pattern: expected errors are modelled as
  return values. A caller that has to render the message cannot get it
  from a thrown error.
- the owner moves into the update's where clause. It read the row,
  compared ownerId, then updated by id alone — check-then-act, in the
  block whose omission the doc says becomes a data breach. One
  statement now does both, and returning() reports whether it matched.
- the return value stops being the raw Drizzle result, which crosses
  the network and made the table's shape a public contract.

Adds the caller, since an action nothing calls is half an endpoint, and
revalidatePath, without which the mutation succeeds and the screen
still shows the old value — a bug that gets reported as "it didn't
save".

Heading deliberately unchanged: three anchor citations in
03-architecture.md and 07-code-review.md resolve against it.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: `### Authorize reads, not just writes`

**Files:**
- Modify: `docs/05-development.md` — new section after `### Server Actions need validation and authorization`

**Interfaces:**
- Consumes: `getInvoices(ownerId)` and the `src/features/billing/queries.ts` file from Task 3.
- Produces: `getInvoice(id: string, ownerId: string)`, a second exported query in that same file. It is introduced here rather than in Task 3 because it exists to make this section's point.

This closes **D20**, the finding the classification record deliberately left unclassified and which the user assigned to stage 05. The authorize rule appears three times in the doc and is scoped to writes every time.

- [ ] **Step 1: Insert the new section**

Note that this section shows `getInvoice` in full rather than referring to it. Naming a function the page never produces is the defect Task 3 exists to fix, and repeating it here would be worse than leaving the section out.

```markdown
### Authorize reads, not just writes

The rule above is written for actions because that is where the damage is loudest, but
"never trust an ID from the client" says nothing about the verb. A detail route is the same
bug with a quieter symptom:

```ts
// src/features/billing/queries.ts — alongside getInvoices
export async function getInvoice(id: string, ownerId: string) {
  return db.query.invoices.findFirst({
    where: and(eq(invoices.id, id), eq(invoices.ownerId, ownerId)),
  })
}
```

```tsx
// src/app/(app)/billing/[id]/page.tsx
import { notFound } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getInvoice } from '@/features/billing/queries'
import { InvoiceDetail } from '@/features/billing/invoice-detail'

export default async function InvoicePage({ params }: PageProps<'/billing/[id]'>) {
  const { id } = await params
  const user = await requireUser()
  const invoice = await getInvoice(id, user.id)   // not getInvoice(id)
  if (!invoice) notFound()
  return <InvoiceDetail invoice={invoice} />
}
```

The owner is a parameter of the query, not a check after it. `getInvoices(user.id)` in the
earlier example is the same discipline applied to a list: scope the query, do not filter
the result.

Filtering after the fact is the version that looks right and is not. The row was already
loaded, so a logging line, an error message or a `console.log` left in during debugging can
still put it somewhere it does not belong.
```

- [ ] **Step 2: Verify `PageProps` is the right generated type to cite**

`CLAUDE.md` says route types are generated and `PageProps<'/route'>` comes from `.next/types/`. Confirm the shape against the app rather than memory:

Run: `grep -rn "PageProps<" web/src/app/ | head -5`

If the app's usage differs, match the app. The file wins.

- [ ] **Step 3: Compile both blocks (D-50)**

`PageProps` is generated per-route and does not exist in the scratch harness, so compile this pair inside `web/` instead — create them under a scratch route the build will not keep, run `pnpm typecheck`, then delete them. If that proves awkward, substitute the explicit `{ params: Promise<{ id: string }> }` shape in the harness and **say in the report which form you compiled**, because they are not the same claim.

- [ ] **Step 4: Confirm the heading count and the tests**

Run: `grep -c '^### ' docs/05-development.md` — expect one more than before this task.
Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts src/lib/stage-metadata.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/05-development.md
git commit -m "$(cat <<'EOF'
docs(dev): authorize reads, not only writes

The authorize rule appeared three times and was scoped to a write every
time, so an unscoped list or detail route is shippable under a literal
reading of the page — and the page's own example route had the hole.

Scope the query by owner rather than filtering the result. Filtering
after the fact is the version that looks right: the row is already
loaded, so anything that logs or errors can still leak it.

Classified as this stage's job rather than 03's, since the doc already
says "never trust an ID from the client to belong to the caller" and
that sentence says nothing about the verb.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: `### Loading and error states`, and the checklist that required them

**Files:**
- Modify: `docs/05-development.md` — new section after `### Types at the boundaries`, plus `## Definition of done`

**Interfaces:**
- Consumes: Task 2's corrected `'use client'` prose and Task 4's `{ ok: false, error }` return shape. Both are cited by name here.
- Produces: the corrected `## Definition of done`.

This closes **D1** (the highest-value defect: the checklist requires what the body forbids), **C3** (bare `tsc --noEmit`), **D7** (loop and checklist describe different workflows), **D9** (the `as` standard differs between body and checklist).

- [ ] **Step 1: Insert the new section**

```markdown
### Loading and error states

"No loading state" earlier on this page is about client-side fetching: there is no
`useEffect`, so there is no `isLoading` flag for you to manage. The waiting did not
disappear. It moved to the route, where the framework handles it.

Two files, neither of which you import anywhere — the App Router finds them by name:

```tsx
// src/app/(app)/billing/loading.tsx
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading invoices">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-neutral-200" />
      ))}
    </div>
  )
}
```

```tsx
// src/app/(app)/billing/error.tsx
'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <p>Could not load invoices.</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

`loading.tsx` shows while that segment's data resolves. `error.tsx` catches what throws
below it, and it has to be a Client Component because it takes an `onClick` — one of the
few places the directive is not a choice.

Those two cover the unexpected. Expected failures are different and do not belong here: an
invalid amount or a record that is not yours is the Server Action's return value, which is
why `updateInvoice` hands back `{ ok: false, error }` for the form to render rather than
throwing into an error boundary the user cannot act on.
```

- [ ] **Step 2: Rewrite `## Definition of done`**

Replace the whole list:

```markdown
For each slice, before you open the pull request:

- [ ] Tests written and passing ([06](06-testing.md))
- [ ] `pnpm typecheck` clean — the script from [04](04-project-setup.md), not a bare
      `tsc --noEmit`, which passes off a stale build and fails on a clean checkout
- [ ] `pnpm lint` (at `--max-warnings 0`) and `pnpm format:check` clean
- [ ] No `any`. Every `as` has a comment saying what the compiler could not know
- [ ] Server Actions authorize, not just authenticate — and so do reads
- [ ] `loading.tsx` and `error.tsx` exist for any segment that fetches
- [ ] Expected failures are returned and rendered, not thrown
- [ ] Branch is under two days old, or the rest is behind a flag
- [ ] Rebased, so history reads in order
- [ ] Self-reviewed the diff ([07](07-code-review.md))

Then open it, and after the preview builds:

- [ ] Verified on the preview URL ([12](12-staging.md))
```

- [ ] **Step 3: Confirm the checklist no longer contradicts the body**

Run: `grep -n "no loading state\|Loading and error" docs/05-development.md`

Both must now appear, and the new section must be what reconciles them. Read them together and say in the report that you did.

- [ ] **Step 4: Compile the two new blocks**

Same harness. `error.tsx`'s props must match what Next passes. Check the shape against `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md` rather than memory — the shipped docs show `error` and `unstable_retry` in this version, so **verify whether `reset` is still the prop name and correct the block if it is not.**

This is the highest-risk claim in the task. Cite what you found either way.

- [ ] **Step 5: Commit**

```bash
git add docs/05-development.md
git commit -m "$(cat <<'EOF'
docs(dev): reconcile the loading-state contradiction, and fix the checklist

The Definition of done required "loading and error states exist for
anything async" while the body taught "no loading state", and neither
loading.tsx, error.tsx nor Suspense appeared anywhere on the page. A
checkbox gating on a concept the body teaches the negation of, which is
the pattern cold-reader-testing.md names from stage 03.

The two senses are now distinguished: no client-managed isLoading flag,
because the waiting moved to the route. Expected failures stay the
action's return value, so the two halves point at each other instead of
past each other.

The checklist also stops prescribing a bare `tsc --noEmit`. Stage 04
defines a typecheck script precisely to avoid that form and explains
why, one stage earlier, and this repo's CLAUDE.md records CI catching
it. It passed for the reader ticking the box and failed on a clean
checkout, which is the wrong way round for a Definition of done.

Two smaller drifts closed: the checklist opened "before opening a PR"
and ended by requiring a preview the PR is what produces, and it
allowed an "unexplained" as while the body condemned every as.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: The two renames, the branch number, and the citation they break

**Files:**
- Modify: `docs/05-development.md` — `### Commits` → `### Commits and branches`, `### Local environment` → `### Keep the feedback loop running`, `### The loop`, `## Entry criteria`, `## Traps`
- Modify: `docs/10-documentation.md` — one anchor

**Interfaces:**
- Consumes: Task 1's anchor guard. **This task's RED is that guard failing for real.**
- Produces: `#commits-and-branches` as the anchor `docs/10-documentation.md` points at.

This closes **D8** (three numbers for branch lifetime), **D16** (no migration command), **D19** (flags prescribed twice, explained never), and the consultability pass's only miss.

- [ ] **Step 1: Rename `### Commits` and confirm the guard catches the break**

Rename the heading to `### Commits and branches`, then:

Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts`
Expected: **FAIL**, naming `10-documentation.md -> 05-development.md#commits`.

**This is the real teeth check for Task 1.** Paste the raw failure into the report. If it passes, Task 1's guard is broken and this is the moment to find out.

- [ ] **Step 2: Fix the citation**

In `docs/10-documentation.md`, change `05-development.md#commits` to `05-development.md#commits-and-branches`.

Run: `cd web && pnpm vitest run src/lib/source-citations.test.ts`
Expected: PASS.

- [ ] **Step 3: Add the branch rule to the renamed section**

Append to `### Commits and branches`:

```markdown
A branch that cannot merge within two days is too big. That is the same rule as "smallest
shippable slice" seen from the other end: if it has not merged, it is not shipped, and a
branch nobody has reviewed is work nobody has checked. Decompose it, or put the unfinished
part behind a flag and merge what works.

Rebase before you open the pull request so history reads in order.
```

- [ ] **Step 4: Align the other two statements of the number**

In `## Entry criteria`, replace "scoped small enough to finish in a day or two" with "scoped small enough to merge within two days".

In `## Traps`, replace the long-lived branches entry with:

```markdown
**Long-lived branches.** Two days is the rule; two weeks is what it looks like when nobody
enforces it. By then it conflicts, nobody can hold 3,000 lines in their head, and it gets
merged with a rubber stamp because reviewing it properly would take a day. Slice smaller,
or hide the unfinished half behind a flag.
```

- [ ] **Step 5: Explain the flag, once**

In `### The loop`, after "should be decomposed or hidden behind a flag", add:

```markdown
A flag here is the boring kind: a boolean your code reads, defaulting to off, that lets
half-built work merge without being reachable. An environment variable is enough to start;
reach for a flag service when you need to change one without a deploy.
```

- [ ] **Step 6: Rename `### Local environment` and add the missing command**

Rename to `### Keep the feedback loop running`. Replace its code block with:

```bash
pnpm dev                    # Next.js dev server
pnpm db:push                # apply a schema change locally ([04](04-project-setup.md))
pnpm drizzle-kit studio     # inspect the database
pnpm vitest --watch         # tests re-running as you type
```

Confirm the script name against stage 04 rather than inventing it:

Run: `grep -n "db:push\|drizzle-kit" docs/04-project-setup.md`

If 04 names it differently, **use 04's name**. If 04 defines no such script, say so in the report and cite `drizzle-kit push` directly instead.

- [ ] **Step 7: Full test run and commit**

Run: `cd web && pnpm test`
Expected: all green.

```bash
git add docs/05-development.md docs/10-documentation.md
git commit -m "$(cat <<'EOF'
docs(dev): one branch rule, two headings that say what they hold

Branch lifetime was stated three times in three numbers — two days in
The loop, two weeks in Traps, a day or two in Entry criteria — and only
the first was a rule. Two days is the rule. Traps keeps the two-week
story, reframed as what happens when nobody enforces it.

The consultability pass scored 4/5 and missed exactly this question,
because "branch" appeared in no heading: a reader clicks Commits, finds
only the rebase line, and concludes the page has no branch policy.
Commits and branches now holds it.

Local environment read like env-var setup, which is 04's territory,
while holding the page's strongest claim about watch mode. Renamed for
what it contains, and it gains the command that applies a schema change
— it previously listed three commands, none of which gave slice one any
data to render.

Feature flags were prescribed twice and explained never, so the escape
hatch for the page's central discipline had no mechanism.

The rename broke 10-documentation.md's #commits anchor. The guard added
in the first commit on this branch caught it, which is what it was for.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Types at the boundaries, and the two claims stranded in Traps

**Files:**
- Modify: `docs/05-development.md`, sections `### Types at the boundaries` and `## Traps`

**Interfaces:**
- Consumes: Task 6's `as` standard ("every `as` has a comment saying what the compiler could not know"). Match it exactly.
- Produces: nothing later tasks depend on.

This closes **D10** (Drizzle listed among runtime parsers) and the consultability pass's finding that `## Traps` is the sole home of two claims belonging with the rules they support.

- [ ] **Step 1: Split the Drizzle bullet out of the parsing list**

Replace:

```markdown
- **HTTP request bodies** — Zod
- **Environment variables** — Zod, at boot ([04](04-project-setup.md))
- **Third-party API responses** — Zod. Their contract can change without warning.
- **Database rows** — Drizzle already types these from your schema
```

with:

```markdown
- **HTTP request bodies** — Zod
- **Environment variables** — Zod, at boot ([04](04-project-setup.md))
- **Third-party API responses** — Zod. Their contract can change without warning.

Database rows are the exception, and it is worth being exact about why. Drizzle types them
from your schema, so the compiler knows their shape without a parse step. That is inference,
not validation: nothing checks at runtime that the row matches, so if the table drifts from
the schema the types will keep insisting everything is fine. It is a boundary you are
choosing to trust, rather than one you have closed.
```

- [ ] **Step 2: Align the `as` sentence with the checklist**

Replace "Every `as` is a place you told the compiler to stop helping." with:

```markdown
Every `as` is a place you told the compiler to stop helping, so each one carries a comment
saying what you know that it does not. If you cannot write that comment, the cast is
covering a bug.
```

- [ ] **Step 3: Move the two stranded claims to the rules they support**

The strongest argument for the authorization rule lives only in `## Traps`. Task 4 already moved "the most common serious security bug in App Router applications" into the rule's own section. Confirm it is now in both places or, better, that `## Traps` points rather than repeats:

```markdown
**Server Actions without authorization.** Authentication proves who they are. It does not
prove the record is theirs, and neither does a check you forgot to put in the `where`.
```

- [ ] **Step 4: Confirm Traps still indexes the whole page**

The consultability pass found `## Traps` works as a symptom-side index into a rule-side body, and called that a strength worth keeping. Count its entries before and after and confirm nothing was lost:

Run: `awk '/^## Traps/,0' docs/05-development.md | grep -c '^\*\*'`

Report the count. It should not have gone down.

- [ ] **Step 5: Commit**

```bash
git add docs/05-development.md
git commit -m "$(cat <<'EOF'
docs(dev): separate Drizzle's inference from Zod's validation

"Database rows — Drizzle already types these from your schema" sat as
the fourth bullet in a list about parsing untrusted input, whose other
three entries are Zod. The bullet is true and its placement taught the
opposite: a reader can conclude rows are validated at runtime. They are
not. It is inference, and a table that drifts from the schema keeps
typechecking.

The `as` rule now matches the checklist rather than contradicting it —
the body condemned every cast while the Definition of done allowed an
explained one, and neither said what an explanation looks like.

Traps stops being the only home of the argument for authorizing actions,
which Task 4 moved beside the rule it supports.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: `### AI in development`

**Files:**
- Modify: `web/src/lib/stage-metadata.test.ts` (one slug)
- Modify: `docs/05-development.md` (new final `###` under `## The work`)

**Interfaces:**
- Consumes: nothing.
- Produces: the `### AI in development` heading that `stage-metadata.test.ts` will require from here on.

This closes **D18** and is deliberately test-first. `AI_SECTION_STAGES` is an explicit list rather than derived from `ready` precisely so the section lands at the start of a stage round.

Placement is verified: in all four built stages the `### AI in <stage>` section is the last `###` under `## The work`, immediately before `## Artifacts`.

- [ ] **Step 1: Add the slug and watch the test fail**

In `web/src/lib/stage-metadata.test.ts`, add `'05-development',` to `AI_SECTION_STAGES`.

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts`
Expected: **FAIL** — `05-development has no "### AI in ..." subsection`.

Paste the raw failure. This is the RED and it is a real one.

- [ ] **Step 2: Read a built stage's AI section for register and length**

Run: `sed -n '/^### AI in project setup/,/^## Artifacts/p' docs/04-project-setup.md`

Match its register and rough length. Do not copy its content.

- [ ] **Step 3: Write the section**

Insert immediately before `## Artifacts`:

```markdown
### AI in development

This is the stage where AI is most useful and most expensive to trust, because the loop is
fast enough that a wrong suggestion costs you the same thirty seconds as a right one and
you stop checking.

**Where it earns its place.** Writing the test first from a description of the behaviour.
Filling in a Zod schema from a sample payload. Translating a query you can already describe
in words. Explaining an error you have not seen before. Producing the fourth variation of
something you have already written three times.

**Where it does not.** Anything where being subtly wrong looks identical to being right:
an authorization predicate, a migration's backfill, a cache key, a regular expression over
data you have not sampled. The failure mode is not a syntax error, it is a plausible answer.

**The rule that makes it safe here is the one already on this page.** Small slices and a
test that failed first mean a wrong suggestion is caught in seconds by something other than
your reading of it. Reviewing generated code you did not ask to be tested is how the same
thirty seconds becomes an afternoon.

Ask it to explain code it wrote before you keep the code. If the explanation is vague, the
code is usually wrong, and that check costs less than the debugging does.
```

- [ ] **Step 4: Watch it pass**

Run: `cd web && pnpm vitest run src/lib/stage-metadata.test.ts`
Expected: PASS.

- [ ] **Step 5: Teeth check**

Temporarily change the heading to `### AI during development`, confirm the test fails again (the regex is `/^### AI in .+$/m`), then restore.

- [ ] **Step 6: Commit**

```bash
git add docs/05-development.md web/src/lib/stage-metadata.test.ts
git commit -m "$(cat <<'EOF'
docs(dev): add the AI plays section, test-first

D-35 makes an "AI plays" section mandatory for every stage.
AI_SECTION_STAGES is an explicit four-slug list rather than derived from
`ready`, and its own comment says why: so the section lands with the doc
amendment at the start of a stage round rather than at the end when
`ready` flips. This is that ordering being used.

The slug went in first and the test failed naming the missing heading
before a word of the section was written.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Re-run all three instruments

**Files:**
- Create: `docs/verification/stage-05-doc-execution-run2.md`
- Create: `docs/verification/cold-reader-stage-05-run2.md`

**Interfaces:**
- Consumes: the corrected doc from Tasks 2–9.
- Produces: the findings list Task 11 works from.

**Use the same `sprout` scenario and the same five consultability questions as run 1.** The method is explicit that a different scenario produces a fresh unrelated list and tells you nothing about whether anything was fixed.

- [ ] **Step 1: Re-run the execution pass over every block in the corrected doc**

Extract all fenced `ts`/`tsx` blocks fresh, compile them, and teeth-check with one reverted mutation. Record raw output.

- [ ] **Step 2: Dispatch the completeness reader**

Same constraints as run 1: `docs/05-development.md` and nothing else, forbidden from filling gaps, same `sprout` two-slice task. Ask it explicitly whether each of the twenty defects is closed, and to report anything the corrections introduced.

- [ ] **Step 3: Dispatch the consultability reader**

Same five questions, regenerated headings-only file. Q3 (branch lifetime) is the one that missed; confirm it now hits, and confirm the two renames did not break a question that previously hit.

- [ ] **Step 4: Write both records and commit**

Classify as run 1 did: defect or boundary, with the disagreements recorded. If a reader's finding conflicts with the execution result, the execution result wins.

```bash
git add docs/verification/
git commit -m "docs(verification): stage 05 run 2 — [N closed, M new] ..."
```

---

### Task 11: The fix wave

**Files:**
- Modify: whatever run 2 returns.

**D-48.** The wave exists because the pass found something, so by construction it lands after the pass ran and nothing checks it. Stage 03's fix wave shipped that round's only unrunnable SQL and a later whole-branch review caught it.

- [ ] **Step 1: Triage run 2's findings** into defect and boundary, as run 1 was triaged.
- [ ] **Step 2: Fix the defects**, one commit per cluster.
- [ ] **Step 3: Re-skim the wave's own additions.** Read anything containing code as code, and compile it. This step is the one that exists because skipping it cost stage 03.
- [ ] **Step 4: Commit.**

---

### Task 12: Records, humanizer, and the branch review

**Files:**
- Modify: `docs/tracker.md`, `docs/task.md`, `KICKOFF.md`
- Modify: `docs/05-development.md` (humanizer fixes only)

- [ ] **Step 1: Humanizer pass over the round's prose**

Run `humanizer:humanizer` over the corrected sections of `docs/05-development.md`. Skip code blocks, tables and terminal output. **Do not strip em dashes** — measured house voice, 15 specs at a median of 0.13 per line.

- [ ] **Step 2: Tracker row**

A W-3.5-doc row with evidence (commit SHAs, defect counts, what each review caught), a `Deferred:` list, and new decisions numbered from the current highest. Record at minimum:

- the anchor guard as a decision, since it changes what the gate covers
- the throw-to-return change, since it is a teaching change rather than a correction
- read-path authorization as a scope call, with the reasoning

- [ ] **Step 3: `docs/task.md`** — stage 05 doc phase complete, port not started.

- [ ] **Step 4: `KICKOFF.md`** — refresh Project state for the port round. Correct "four `##` sections and nine `###` ones": the doc had **six** `##` before this round.

- [ ] **Step 5: Whole-branch review**

Dispatch a reviewer that has not seen this session. It reviews the full diff against `develop`, not per task. Per-task reviews found fourteen blocking defects on the stage 04 round and the whole-branch review then found seven more, so the rate does not fall off.

- [ ] **Step 6: Full gate**

```bash
cd web && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

- [ ] **Step 7: Commit, and stop.**

Report the branch state in the house form: `N commits off develop, X/X tests across Y files, build clean, tree clean. NOT merged, NOT deployed.`

**Do not merge.** Ask.

---

## Verification (after all tasks)

- [ ] `cd web && pnpm lint` — clean at `--max-warnings 0`
- [ ] `cd web && pnpm typecheck` — clean (runs `next typegen` first)
- [ ] `cd web && pnpm test` — all green, count recorded
- [ ] `cd web && pnpm build` — prerenders every page
- [ ] `pnpm vitest run src/lib/source-citations.test.ts` — the anchor guard passes, and its corpus assertion proves it resolved more than three links
- [ ] Every fenced `ts`/`tsx` block in `docs/05-development.md` compiles against the prescribed stack, with a teeth-checked mutation recorded
- [ ] Cold-reader run 2 returns no BLOCKING findings, or each surviving one is recorded as a deliberate boundary with reasoning
- [ ] Consultability run 2 scores 5/5, or the miss is recorded with a decision
- [ ] `grep -c '^### ' docs/05-development.md` returns 12
- [ ] `### AI in development` is the last `###` before `## Artifacts`
- [ ] No `docs/NN-name.md:123` line-number citations introduced (D-42)
- [ ] `reference/glossary.md` untouched by hand; if terms changed, `pnpm gen:glossary` was run
- [ ] `ready` is still `false` for `05-development` in `web/src/lib/stages.ts`
- [ ] Branch state reported. **Not merged.**
