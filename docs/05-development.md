# 05. Development

> The loop you run dozens of times a day. Small improvements here compound harder than
> anywhere else in the playbook.

**When this actually happens:** Continuously, once [04 — Project Setup](04-project-setup.md)
is done. This is where most of your hours go.

---

## Entry criteria

- [ ] Project scaffolded, CI green, preview deploys working ([04](04-project-setup.md))
- [ ] The next piece of work is scoped small enough to merge within two days
      ([02 — Planning](02-planning.md))

---

## The work

### The loop

```
Pick the smallest shippable slice
  → Write the test that proves it works ([06](06-testing.md))
  → Make it work
  → Make it clean
  → Open the pull request ([07](07-code-review.md))
  → Verify on the preview ([12](12-staging.md))
  → Ship ([13](13-production-deployment.md))
```

The discipline is in "smallest shippable slice." Anything that cannot merge within two
days should be decomposed or hidden behind a flag. A flag here is the boring kind: a
boolean your code reads, defaulting to off, that lets half-built work merge without being
reachable. An environment variable is enough to start; reach for a flag service when you
need to change one without a deploy. Long-lived branches diverge, conflict, and stop being
reviewable — and a branch you cannot review is a branch you cannot trust.

"Make it work, then make it clean" is an ordering, not permission to skip the second
part. Cleanup happens before the PR, not in a follow-up ticket that never gets picked up.

### Vertical slices

Build through every layer for one narrow case rather than one layer completely across all
cases.

Building "user profiles": do not build the whole schema, then all the queries, then all
the UI. Build *view your own display name* end to end — column, query, component, test.
Ship it. Then add editing. Then avatars.

The column comes first and it is not this stage's to teach. The table it belongs to was
designed in [03 — Architecture](03-architecture.md); the tooling that applies the change
was installed in [04 — Project Setup](04-project-setup.md). What belongs here is the
habit: change the schema for the one case you are shipping, not for the three you expect
to ship next.

Each slice is demonstrable, independently valuable, and independently revertible. You
also learn about the design from the first slice, before that design is baked into
thirty files.

### Server Components by default

Next.js 16's App Router makes server the default. Keep it that way.

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

`requireUser` comes from [04 — Project Setup](04-project-setup.md) — that's where the
session mechanism lives, along with what the function returns and what happens when
nobody is signed in.

No `useEffect`, no loading state, no client-side fetch, no API route in between. The data
access happens where the data lives.

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
Client Component — Next's own docs are explicit that it is rendered on the server and
handed to the Client Component as already-rendered output, never pulled into its module
graph. The boundary does not have to swallow a subtree to cross it.

### Keep route files thin

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

```tsx
// src/features/billing/invoice-table.tsx
export function InvoiceTable({
  invoices,
}: {
  invoices: { id: string; amount: number }[]
}) {
  return (
    <table>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>{invoice.id}</td>
            <td>{invoice.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Column, query, component — the same order named as the unit of work earlier on this
page, closed out for this one slice. The test is [06](06-testing.md)'s.

### Server Actions need validation and authorization

A Server Action is a public HTTP endpoint. It looks like a function call, and that is
exactly what makes it dangerous — the resemblance invites you to trust the input.

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

Authenticate, validate, authorize — every action, every time. Never trust an ID from the
client to belong to the caller. Step 3 is the one people omit, and in this playbook's
experience it is the most common serious security bug in App Router applications.

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

Not every action needs a form. A button that already has what it needs — an id, an amount
already on screen — calls the action directly; there is no user-typed text, so step 2 has
nothing to catch:

```tsx
// no typed input — invoice.id and invoice.amount are already known, not user-typed
'use client'

import { useTransition } from 'react'
import { updateInvoice } from './actions'

export function RetryButton({ invoice }: { invoice: { id: string; amount: number } }) {
  const [pending, start] = useTransition()
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await updateInvoice({ invoiceId: invoice.id, amount: invoice.amount })
        })
      }
    >
      {pending ? 'Retrying…' : 'Retry'}
    </button>
  )
}
```

Step 2 (validate) still runs inside `updateInvoice` — there is just nothing for the
caller to have gotten wrong.

### Authorize reads, not just writes

The rule above is written for actions because that is where the damage is loudest, but
"never trust an ID from the client" says nothing about the verb. A detail route is the same
bug with a quieter symptom:

```ts
// src/features/billing/queries.ts — alongside getInvoices; the import gains `and`
import { and, eq } from 'drizzle-orm'

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

### Types at the boundaries

Parse untrusted input into typed values at the edge; keep the inside of the application
fully typed.

- **HTTP request bodies** — Zod
- **Environment variables** — Zod, at boot ([04](04-project-setup.md))
- **Third-party API responses** — Zod. Their contract can change without warning.

Database rows are the exception, and it is worth being exact about why. Drizzle types them
from your schema, so the compiler knows their shape without a parse step. That is inference,
not validation: nothing checks at runtime that the row matches, so if the table drifts from
the schema the types will keep insisting everything is fine. It is a boundary you are
choosing to trust, rather than one you have closed.

Inside those boundaries, no `any`, no unchecked casts. Every `as` cast is a place you told
the compiler to stop helping, so each one carries a comment saying what you know that it
does not. If you cannot write that comment, the cast is covering a bug.

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

export default function Error({
  unstable_retry,
}: {
  error: Error
  unstable_retry: () => void
}) {
  return (
    <div role="alert">
      <p>Could not load invoices.</p>
      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  )
}
```

`loading.tsx` shows while that segment's data resolves. `error.tsx` catches what throws
below it, and it has to be a Client Component because error boundaries always are — one of
the few places the directive is not a choice. The retry prop carries an `unstable_` prefix
in this Next version (`unstable_retry`, not the `reset` you may remember from older
releases), so a copy that still calls `reset` gets `undefined` and a Try-again button that
throws.

Those two cover the unexpected. Expected failures are different and do not belong here: an
invalid amount or a record that is not yours is the Server Action's return value, which is
why `updateInvoice` hands back `{ ok: false, error }` for the form to render rather than
throwing into an error boundary the user cannot act on.

### Commits and branches

Small and focused. A commit that changes one thing can be reverted, cherry-picked, and
understood.

```
feat(billing): add invoice status filter

Users with many invoices could not find unpaid ones. Adds a status
query param, defaulting to all.
```

Subject in imperative mood, under ~70 characters. Body explains **why** — the diff already
shows what. Six months from now, `git log` is the only record of your reasoning, and "fix
bug" tells future-you nothing.

A branch that cannot merge within two days is too big. That is the same rule as "smallest
shippable slice" seen from the other end: if it has not merged, it is not shipped, and a
branch nobody has reviewed is work nobody has checked. Decompose it, or put the unfinished
part behind a flag and merge what works.

Rebase before you open the pull request so history reads in order.

### When you get stuck

A timebox prevents the two-hour hole. After roughly thirty minutes without progress:

1. **Say the problem out loud.** Rubber-ducking works because articulation forces
   precision.
2. **Check assumptions with real output.** Log the value. It is very often not what you
   assumed, and everything downstream was reasoning from a false premise.
3. **Reduce it.** Smallest possible reproduction. Half the time the reduction reveals the
   bug.
4. **Walk away.** Genuinely effective and consistently undervalued.

For anything gnarlier than a typo, use the systematic-debugging discipline: form a
hypothesis, design the smallest test that would disprove it, run it, repeat. Randomly
changing code until it works produces code that works for reasons you do not know.

### Keep the feedback loop running

```bash
pnpm dev                    # Next.js dev server
pnpm drizzle-kit push       # apply a schema change locally
pnpm drizzle-kit studio     # inspect the database
pnpm vitest --watch         # tests re-running as you type
```

Vitest in watch mode in a spare terminal is the highest-leverage habit on this page. The
gap between writing a bug and seeing it fail shrinks to seconds.

### AI in development

The loop here runs fast enough that reading a suggestion and accepting it take about the
same half second, and that speed is what makes this the risky stage: the mistakes that
survive are the ones that read as correct on the way past. An authorization predicate, a
migration's backfill, a cache key, a regular expression over data you have not sampled —
none of those fail loudly. They fail the day someone finds the gap.

Where it earns its place:

- **Write the failing test from a description of the behaviour, before any code** (a
  skill). `test-driven-development` enforces the order rather than hoping for it — no
  implementation until a test exists and has failed for the right reason.
- **Fill in a Zod schema from a sample payload** (a saved command). The boundary types on
  this page are a mechanical translation once the payload is in front of you, which is
  exactly the kind of task a model does not get subtly wrong.
- **Translate a query you can already describe in words** (a saved command). "Invoices
  where the owner is me and the amount is over $500" into the `where` clause is fast when
  you already know the answer and are only saving typing.
- **Check a framework prop against the version actually installed** (an MCP). This page's
  own `error.tsx` takes `unstable_retry` in this Next version; the `reset` an older
  training set remembers gets `undefined` and a Try-again button that throws. `context7`
  reads the installed version's docs instead of guessing from memory.
- **Check what broke last time** (memory). `claude-mem` answers "did I already hit this,
  and how did I actually fix it" — most useful exactly when a stack trace looks familiar.
- **Reduce a bug to the smallest reproduction, then test one hypothesis at a time** (a
  skill). `systematic-debugging`, already named on this page, is what keeps either of you
  from mutating code at random until something works.

Named tools, so this is actionable: `test-driven-development` and `systematic-debugging`
from the Superpowers plugin, `context7` for version-accurate docs, and `claude-mem` for
what broke before.

What none of this replaces: reading the diff before you keep it. A green test only proves
the case you remembered to write. The authorization gap already covered on this page
passes every test that never scopes a query by owner, and a model has no more reason than
you did to notice the one that is missing.

---

## Artifacts

- Small, focused commits with explanatory bodies
- Feature code in `src/features/<feature>/`, components included, route files thin
- Server Actions that authenticate, validate, and authorize
- Zod schemas at every external boundary

---

## Definition of done

For each slice, before you open the pull request:

- [ ] Tests written and passing ([06](06-testing.md))
- [ ] `pnpm typecheck` clean — the script from [04](04-project-setup.md), not a bare
      `tsc --noEmit`, which passes off a stale build and fails on a clean checkout
- [ ] `pnpm lint` (at `--max-warnings 0`) and `pnpm format:check` clean
- [ ] No `any`. Every `as` cast has a comment saying what the compiler could not know
- [ ] Server Actions authorize, not just authenticate — and so do reads
- [ ] `loading.tsx` and `error.tsx` exist for any segment that fetches
- [ ] Expected failures are returned and rendered, not thrown
- [ ] Branch is under two days old, or the rest is behind a flag
- [ ] Rebased, so history reads in order
- [ ] Self-reviewed the diff ([07](07-code-review.md))

Then open it, and after the preview builds:

- [ ] Verified on the preview URL ([12](12-staging.md))

---

## Scaling to a team

- **Branch naming conventions** start to matter once branches are not all yours.
- **Draft PRs early** so others see direction before you have built two days in the wrong
  one.
- **Communicate about shared files.** Two people refactoring the same module produces a
  merge conflict neither can resolve confidently.
- **Write down conventions you have been holding in your head.** Solo, consistency is
  automatic. With others, it needs to be explicit — a short `CONVENTIONS.md` beats
  re-litigating the same review comments.

---

## Traps

**Long-lived branches.** Two days is the rule; two weeks is what it looks like when nobody
enforces it. By then it conflicts, nobody can hold 3,000 lines in their head, and it gets
merged with a rubber stamp because reviewing it properly would take a day. Slice smaller,
or hide the unfinished half behind a flag.

**`'use client'` at the top of a page.** Everything below it ships to the browser and
gives up server-only data access. It is still prerendered, so the symptom is a heavy
bundle and a slow hydration rather than a blank page — which is why this one is easy to
miss. Push it to the leaves.

**Server Actions without authorization.** Authentication proves who they are. It does not
prove the record is theirs, and neither does a check you forgot to put in the `where`.

**Business logic in route files.** Untestable without booting a framework, so it goes
untested.

**`as` to silence the compiler.** The compiler was right. It is usually a real bug you
have postponed.

**"I'll clean it up later."** Later has an empty calendar. Clean before the PR.

**Debugging by random mutation.** Change one thing, predict the result, verify. If you
cannot predict it, you do not understand the system yet, and the fix will be
coincidental.

**Commit messages that describe the diff.** `git log` should tell you why, because the
diff already tells you what.
