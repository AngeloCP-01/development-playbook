# 05. Development

> The loop you run dozens of times a day. Small improvements here compound harder than
> anywhere else in the playbook.

**When this actually happens:** Continuously, once [04 — Project Setup](04-project-setup.md)
is done. This is where most of your hours go.

---

## Entry criteria

- [ ] Project scaffolded, CI green, preview deploys working ([04](04-project-setup.md))
- [ ] The next piece of work is scoped small enough to finish in a day or two
      ([02 — Planning](02-planning.md))

---

## The work

### The loop

```
Pick the smallest shippable slice
  → Write the test that proves it works ([06](06-testing.md))
  → Make it work
  → Make it clean
  → Verify on the preview ([12](12-staging.md))
  → Ship ([13](13-production-deployment.md))
```

The discipline is in "smallest shippable slice." Anything that cannot merge within two
days should be decomposed or hidden behind a flag. Long-lived branches diverge, conflict,
and stop being reviewable — and a branch you cannot review is a branch you cannot trust.

"Make it work, then make it clean" is an ordering, not permission to skip the second
part. Cleanup happens before the PR, not in a follow-up ticket that never gets picked up.

### Vertical slices

Build through every layer for one narrow case rather than one layer completely across all
cases.

Building "user profiles": do not build the whole schema, then all the queries, then all
the UI. Build *view your own display name* end to end — column, query, component, test.
Ship it. Then add editing. Then avatars.

Each slice is demonstrable, independently valuable, and independently revertible. You
also learn about the design from the first slice, before that design is baked into
thirty files.

### Server Components by default

Next.js 16's App Router makes server the default. Keep it that way.

```tsx
// src/app/(app)/invoices/page.tsx — a Server Component
import { getInvoices } from '@/features/billing/queries'

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  return <InvoiceTable invoices={invoices} />
}
```

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
Client Component, so the boundary does not have to swallow a subtree to cross it.

### Keep route files thin

```tsx
// Route file: routing, auth, composition. Nothing else.
export default async function BillingPage() {
  const user = await requireUser()
  const invoices = await getInvoices(user.id)
  return <InvoiceTable invoices={invoices} />
}
```

The logic lives in `src/features/billing/queries.ts`, which is a plain function that can
be tested without a framework. When business logic is inside a route file, testing it
means booting Next.js — which is why that logic tends to go untested.

### Server Actions need validation and authorization

A Server Action is a public HTTP endpoint. It looks like a function call, and that is
exactly what makes it dangerous — the resemblance invites you to trust the input.

```ts
// src/features/billing/actions.ts
'use server'

import { z } from 'zod'
import { requireUser } from '@/lib/auth'

const schema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().int().positive(),
})

export async function updateInvoice(input: unknown) {
  const user = await requireUser()                    // 1. authenticate
  const data = schema.parse(input)                    // 2. validate

  const invoice = await db.query.invoices.findFirst({
    where: eq(invoices.id, data.invoiceId),
  })
  if (invoice?.ownerId !== user.id) throw new Error('Not found')   // 3. authorize

  return db.update(invoices).set({ amount: data.amount })
    .where(eq(invoices.id, data.invoiceId))
}
```

Authenticate, validate, authorize — every action, every time. Never trust an ID from the
client to belong to the caller. Step 3 is the one people omit, and it is the one that
becomes a data breach.

Return "Not found" rather than "Forbidden" for records the user does not own. "Forbidden"
confirms the record exists, which leaks information.

### Types at the boundaries

Parse untrusted input into typed values at the edge; keep the inside of the application
fully typed.

- **HTTP request bodies** — Zod
- **Environment variables** — Zod, at boot ([04](04-project-setup.md))
- **Third-party API responses** — Zod. Their contract can change without warning.
- **Database rows** — Drizzle already types these from your schema

Inside those boundaries, no `any`, no unchecked casts. Every `as` is a place you told the
compiler to stop helping.

### Commits

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

Rebase your branch before opening a PR so history stays linear and reviewable.

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

### Local environment

```bash
pnpm dev              # Next.js dev server
pnpm drizzle-kit studio  # inspect the database
pnpm vitest --watch      # tests re-running as you type
```

Vitest in watch mode in a spare terminal is the highest-leverage habit on this page. The
gap between writing a bug and seeing it fail shrinks to seconds.

---

## Artifacts

- Small, focused commits with explanatory bodies
- Feature code in `src/features/`, route files thin
- Server Actions that authenticate, validate, and authorize
- Zod schemas at every external boundary

---

## Definition of done

For each slice, before opening a PR:

- [ ] Tests written and passing ([06](06-testing.md))
- [ ] `pnpm tsc --noEmit` clean
- [ ] `pnpm lint` (at `--max-warnings 0`) and `pnpm format:check` clean
- [ ] No `any`, no unexplained `as`
- [ ] Server Actions authorize, not just authenticate
- [ ] Loading and error states exist for anything async
- [ ] Self-reviewed the diff ([07](07-code-review.md))
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

**Long-lived branches.** A branch open for two weeks will conflict, will be unreviewable,
and will be merged with a rubber stamp because nobody can hold 3,000 lines in their head.
Slice smaller; use flags.

**`'use client'` at the top of a page.** Everything below it ships to the browser and
gives up server-only data access. It is still prerendered, so the symptom is a heavy
bundle and a slow hydration rather than a blank page — which is why this one is easy to
miss. Push it to the leaves.

**Server Actions without authorization.** Authentication proves who they are. It does not
prove the record is theirs. This omission is the most common serious security bug in
App Router applications.

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
