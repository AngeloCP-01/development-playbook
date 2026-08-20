/**
 * The six snippets of the safe/unsafe drill.
 *
 * **Authored, not quoted, and the only module in this stage without a doc
 * anchor.** Four of the six are wrong on purpose and appear nowhere in
 * `docs/05-development.md`, so no sync test can hold them — their correctness
 * rests on review. `snippets.test.ts` pins the two sentences in the doc that
 * the unsafe verdicts argue from, which is as close to an anchor as this gets.
 *
 * Two are safe and they are the scoped-query pair. That is asserted as a
 * literal rather than read off `safe`, so flipping a row cannot move its own
 * expectation.
 *
 * The set covers both verbs deliberately: the doc's point in `### Authorize
 * reads, not just writes` is that "never trust an ID from the client" says
 * nothing about whether you are reading or writing.
 */
export type Snippet = {
  id: string
  /** What the reader is looking at, so the code is not the only orientation. */
  label: string
  code: string
  safe: boolean
  /** Why — shown only after the answer is locked. */
  verdict: string
}

export const SNIPPETS: Snippet[] = [
  {
    id: 'list-scoped',
    label: 'A list query',
    code: `export async function getInvoices(ownerId: string) {
  return db.select().from(invoices).where(eq(invoices.ownerId, ownerId))
}`,
    safe: true,
    verdict:
      'Safe. The owner is a parameter of the query, so there is no row to leak: the database never returns one that is not yours. This is the shape the other five are measured against.',
  },
  {
    id: 'detail-scoped',
    label: 'A detail query',
    code: `export async function getInvoice(id: string, ownerId: string) {
  return db.query.invoices.findFirst({
    where: and(eq(invoices.id, id), eq(invoices.ownerId, ownerId)),
  })
}`,
    safe: true,
    verdict:
      'Safe, and it gets the disclosure right for free. Zero rows means either the invoice does not exist or it is not yours, and the caller cannot tell which — so "Not found" is the honest answer as well as the safe one.',
  },
  {
    id: 'detail-unscoped',
    label: 'A detail query, checked afterwards',
    code: `const invoice = await getInvoice(id)
if (invoice.ownerId !== user.id) notFound()
return <InvoiceDetail invoice={invoice} />`,
    safe: false,
    verdict:
      'Unsafe, and this is the version that looks right. The row was already loaded before the check ran, so a logging line, an error message, or a console.log left in during debugging can still put it somewhere it does not belong. Scope the query; do not filter the result.',
  },
  {
    id: 'action-no-owner',
    label: 'A Server Action that authenticates and validates',
    code: `const user = await requireUser()
const parsed = schema.safeParse(input)
if (!parsed.success) return { ok: false, error: 'Invalid amount' } as const

await db.update(invoices)
  .set({ amount: parsed.data.amount })
  .where(eq(invoices.id, parsed.data.invoiceId))`,
    safe: false,
    verdict:
      'Unsafe. Authentication proves who they are; it does not prove the record is theirs. The invoice id came from the client and nothing checked it, so any authenticated caller can edit any invoice. This is step 3, and it is the one people omit.',
  },
  {
    id: 'action-check-then-write',
    label: 'A Server Action that checks first, then writes',
    code: `const existing = await db.query.invoices.findFirst({
  where: eq(invoices.id, parsed.data.invoiceId),
})
if (existing?.ownerId !== user.id) return { ok: false, error: 'Not found' } as const

await db.update(invoices)
  .set({ amount: parsed.data.amount })
  .where(eq(invoices.id, parsed.data.invoiceId))`,
    safe: false,
    verdict:
      'Unsafe, and the hardest of the six to see straight through. The check above is correct at the moment it runs — the real problem is that authorization and the write are two separate statements, and nothing keeps them agreeing with each other. Delete the guard clause, or route a second caller through the same update, and this quietly turns into the action above with no compiler error and no test catching it. There is also a gap between the check and the write, which matters wherever ownership can change mid-request, but that gap is the secondary problem. Folding the owner into the where closes both at once, and returning() tells you whether it actually matched.',
  },
  {
    id: 'button-caller',
    label: 'A button, and the action it calls',
    code: `// src/features/billing/actions.ts
'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { invoices } from '@/db/schema'
import { requireUser } from '@/lib/auth'

const schema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().int().positive(),
})

export async function retryInvoice(invoiceId: string, amount: number) {
  await requireUser()
  const parsed = schema.safeParse({ invoiceId, amount })
  if (!parsed.success) return { ok: false, error: 'Invalid amount' } as const

  // this id came off a row we already rendered for this user, so it must be theirs
  await db.update(invoices)
    .set({ amount: parsed.data.amount })
    .where(eq(invoices.id, parsed.data.invoiceId))
  return { ok: true } as const
}

// src/features/billing/retry-button.tsx
'use client'

import { useTransition } from 'react'
import { retryInvoice } from './actions'

export function RetryButton({ invoice }: { invoice: { id: string; amount: number } }) {
  const [pending, start] = useTransition()
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await retryInvoice(invoice.id, invoice.amount)
        })
      }
    >
      {pending ? 'Retrying…' : 'Retry'}
    </button>
  )
}`,
    safe: false,
    verdict:
      'Unsafe, and not for the reason the Server Action above is. That one simply omits the owner check; this one talks itself out of adding it. The comment’s assumption — that an id lifted from a row already on screen must belong to whoever clicked — is not something retryInvoice can verify from inside the function. Nothing about being called from a button with nothing to type rather than a form with everything to type tells the endpoint who is asking; any caller who can invoke retryInvoice with a different id gets the same update.',
  },
]
