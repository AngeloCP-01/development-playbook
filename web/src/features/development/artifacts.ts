import { type Artifact } from '@/components/artifact'

/**
 * Twelve of the fourteen fenced blocks in `docs/05-development.md`, quoted
 * verbatim and annotated.
 *
 * `artifacts.test.ts` asserts each block **equals** one of the doc's fences
 * rather than being contained by one (D-66). The reader is meant to paste
 * these, so a block that drifts is worse than a diagram that drifts.
 *
 * Not carried: the loop pseudo-block, which is a flow rather than code and
 * becomes `loop.ts`; and the commit-message block, quoted inline in the
 * `commits` panel because it is three lines and needs no annotation.
 */
export const ARTIFACTS: Record<string, Artifact> = {
  invoicesPage: {
    id: 'invoices-page',
    filename: 'src/app/(app)/invoices/page.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/app/(app)/invoices/page.tsx — a Server Component' },
      {
        text: "import { requireUser } from '@/lib/auth'",
        note: 'Set up outside this stage. Stage 03 is where the session strategy — rolling your own, a library, or a managed provider — actually gets decided.',
      },
      { text: "import { getInvoices } from '@/features/billing/queries'" },
      {
        text: "import { InvoiceTable } from '@/features/billing/invoice-table'",
      },
      { text: '' },
      {
        text: 'export default async function InvoicesPage() {',
        note: '`async` in a component body at all is the thing to notice. This is a Server Component, so the data access happens where the data lives — no `useEffect`, no client-side fetch.',
      },
      { text: '  const user = await requireUser()' },
      {
        text: '  const invoices = await getInvoices(user.id)',
        note: 'Scoped by owner in the query, not filtered after it. The same discipline the detail route needs, applied here to a list instead of a single row.',
        pivot: true,
      },
      { text: '  return <InvoiceTable invoices={invoices} />' },
      { text: '}' },
    ],
  },

  billingPage: {
    id: 'billing-page',
    filename: 'src/app/(app)/billing/page.tsx',
    language: 'tsx',
    lines: [
      {
        text: '// src/app/(app)/billing/page.tsx — routing, auth, composition. Nothing else.',
      },
      { text: "import { requireUser } from '@/lib/auth'" },
      { text: "import { getInvoices } from '@/features/billing/queries'" },
      {
        text: "import { InvoiceTable } from '@/features/billing/invoice-table'",
      },
      { text: '' },
      {
        text: 'export default async function BillingPage() {',
        note: 'Every symbol this file uses is imported above it. A block you cannot paste and run is a block you cannot check — the doc holds itself to that here on purpose.',
      },
      { text: '  const user = await requireUser()' },
      { text: '  const invoices = await getInvoices(user.id)' },
      { text: '  return <InvoiceTable invoices={invoices} />' },
      { text: '}' },
    ],
  },

  getInvoices: {
    id: 'get-invoices',
    filename: 'src/features/billing/queries.ts',
    language: 'ts',
    lines: [
      { text: '// src/features/billing/queries.ts' },
      { text: "import { eq } from 'drizzle-orm'" },
      { text: "import { db } from '@/db'" },
      { text: "import { invoices } from '@/db/schema'" },
      { text: '' },
      {
        text: 'export async function getInvoices(ownerId: string) {',
        note: 'An ordinary function, not a route handler. No framework, no request, no mocking — a test calls it with an id and checks what comes back.',
      },
      {
        text: '  return db.select().from(invoices).where(eq(invoices.ownerId, ownerId))',
      },
      { text: '}' },
    ],
  },

  invoiceTable: {
    id: 'invoice-table',
    filename: 'src/features/billing/invoice-table.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/features/billing/invoice-table.tsx' },
      {
        text: 'export function InvoiceTable({',
        note: 'Lives beside `queries.ts` under `src/features/billing/`, not in `src/components/`, because the two change together. `src/components/` is reserved for what more than one feature uses.',
      },
      { text: '  invoices,' },
      { text: '}: {' },
      { text: '  invoices: { id: string; amount: number }[]' },
      { text: '}) {' },
      { text: '  return (' },
      { text: '    <table>' },
      { text: '      <tbody>' },
      { text: '        {invoices.map((invoice) => (' },
      { text: '          <tr key={invoice.id}>' },
      { text: '            <td>{invoice.id}</td>' },
      { text: '            <td>{invoice.amount}</td>' },
      { text: '          </tr>' },
      { text: '        ))}' },
      { text: '      </tbody>' },
      { text: '    </table>' },
      { text: '  )' },
      { text: '}' },
    ],
  },

  updateInvoice: {
    id: 'update-invoice',
    filename: 'src/features/billing/actions.ts',
    language: 'ts',
    lines: [
      { text: '// src/features/billing/actions.ts' },
      {
        text: "'use server'",
        note: 'A Server Action is a public HTTP endpoint. It looks like a function call, and that resemblance is exactly what invites trusting the input.',
      },
      { text: '' },
      { text: "import { revalidatePath } from 'next/cache'" },
      { text: "import { and, eq } from 'drizzle-orm'" },
      { text: "import { z } from 'zod'" },
      { text: "import { db } from '@/db'" },
      { text: "import { invoices } from '@/db/schema'" },
      { text: "import { requireUser } from '@/lib/auth'" },
      { text: '' },
      { text: 'const schema = z.object({' },
      { text: '  invoiceId: z.string().uuid(),' },
      { text: '  amount: z.number().int().positive(),' },
      { text: '})' },
      { text: '' },
      { text: 'export async function updateInvoice(input: unknown) {' },
      {
        text: '  const user = await requireUser()                       // 1. authenticate',
      },
      { text: '' },
      {
        text: '  const parsed = schema.safeParse(input)                 // 2. validate',
        note: 'The input is typed `unknown`, not the schema’s output type — a Server Action receives whatever the network sends, and only `safeParse` gets to decide it matches.',
      },
      {
        text: "  if (!parsed.success) return { ok: false, error: 'Invalid amount' } as const",
      },
      { text: '' },
      {
        text: '  const updated = await db                               // 3. authorize',
      },
      { text: '    .update(invoices)' },
      { text: '    .set({ amount: parsed.data.amount })' },
      { text: '    .where(' },
      { text: '      and(' },
      { text: '        eq(invoices.id, parsed.data.invoiceId),' },
      {
        text: '        eq(invoices.ownerId, user.id),',
        note: 'The owner belongs in the `where`, not in a separate check before it. Fetching the row, comparing its owner, and updating by id alone leaves a gap between the check and the write — this line closes it by making the authorization and the update the same statement.',
        pivot: true,
      },
      { text: '      ),' },
      { text: '    )' },
      { text: '    .returning({ id: invoices.id })' },
      { text: '' },
      {
        text: "  if (updated.length === 0) return { ok: false, error: 'Not found' } as const",
        note: 'Zero rows means either the invoice does not exist or it is not this caller’s, and the caller cannot tell which. "Not found" is the honest answer and the safe one — "Forbidden" would confirm the record exists.',
      },
      { text: '' },
      {
        text: "  revalidatePath('/billing')",
        note: 'Without this the mutation succeeds, the database is correct, and the list on screen keeps showing the old amount until something else forces a refresh — a bug that gets reported as "it didn’t save".',
      },
      { text: '  return { ok: true } as const' },
      { text: '}' },
    ],
  },

  amountForm: {
    id: 'amount-form',
    filename: 'src/features/billing/invoice-amount-form.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/features/billing/invoice-amount-form.tsx' },
      {
        text: "'use client'",
        note: "This is where `'use client'` earns itself: the form needs a pending state and an error to display. It stays a leaf — the page holding it is still a Server Component.",
      },
      { text: '' },
      { text: "import { useActionState } from 'react'" },
      { text: "import { updateInvoice } from './actions'" },
      { text: '' },
      {
        text: 'export function InvoiceAmountForm({ invoiceId }: { invoiceId: string }) {',
      },
      { text: '  const [state, formAction, pending] = useActionState(' },
      { text: '    async (_prev: unknown, formData: FormData) =>' },
      { text: '      updateInvoice({' },
      { text: '        invoiceId,' },
      { text: "        amount: Number(formData.get('amount'))," },
      { text: '      }),' },
      { text: '    null,' },
      { text: '  )' },
      { text: '' },
      { text: '  return (' },
      { text: '    <form action={formAction}>' },
      { text: '      <label htmlFor="amount">Amount</label>' },
      {
        text: '      <input id="amount" name="amount" type="number" min="1" required />',
      },
      {
        text: "      <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>",
      },
      {
        text: '      {state?.ok === false && <p role="alert">{state.error}</p>}',
        note: '`updateInvoice` returns its failures instead of throwing them, so an invalid amount renders here rather than tripping an error boundary the user cannot act on.',
      },
      { text: '    </form>' },
      { text: '  )' },
      { text: '}' },
    ],
  },

  retryButton: {
    id: 'retry-button',
    filename: 'src/features/billing/retry-button.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/features/billing/retry-button.tsx' },
      {
        text: '// resubmits the same amount after a save that failed to reach the server',
      },
      { text: "'use client'" },
      { text: '' },
      { text: "import { useTransition } from 'react'" },
      { text: "import { updateInvoice } from './actions'" },
      { text: '' },
      {
        text: 'export function RetryButton({ invoice }: { invoice: { id: string; amount: number } }) {',
        note: 'Not every action needs a form. A button that already has an id and an amount on screen can call `updateInvoice` directly — but the action still owes it the full authenticate/validate/authorize sequence, because it has no way to know the call came from a button rather than a form.',
      },
      { text: '  const [pending, start] = useTransition()' },
      { text: '  return (' },
      { text: '    <button' },
      { text: '      disabled={pending}' },
      { text: '      onClick={() =>' },
      { text: '        start(async () => {' },
      {
        text: '          await updateInvoice({ invoiceId: invoice.id, amount: invoice.amount })',
        note: '`invoice.id` is still an id from the client. Step 3 of `updateInvoice` — the owner in the `where` — has to check it before trusting it, exactly as it does for the form.',
      },
      { text: '        })' },
      { text: '      }' },
      { text: '    >' },
      { text: "      {pending ? 'Retrying…' : 'Retry'}" },
      { text: '    </button>' },
      { text: '  )' },
      { text: '}' },
    ],
  },

  getInvoice: {
    id: 'get-invoice',
    filename: 'src/features/billing/queries.ts',
    language: 'ts',
    lines: [
      {
        text: '// src/features/billing/queries.ts — alongside getInvoices; the import gains `and`',
      },
      { text: "import { and, eq } from 'drizzle-orm'" },
      { text: '' },
      {
        text: 'export async function getInvoice(id: string, ownerId: string) {',
      },
      { text: '  return db.query.invoices.findFirst({' },
      {
        text: '    where: and(eq(invoices.id, id), eq(invoices.ownerId, ownerId)),',
        note: 'The owner is a parameter of the query, not a check run after it — the detail-route version of the same rule the action follows: scope the query, do not filter the result.',
        pivot: true,
      },
      { text: '  })' },
      { text: '}' },
    ],
  },

  invoiceDetailPage: {
    id: 'invoice-detail-page',
    filename: 'src/app/(app)/billing/[id]/page.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/app/(app)/billing/[id]/page.tsx' },
      { text: "import { notFound } from 'next/navigation'" },
      { text: "import { requireUser } from '@/lib/auth'" },
      { text: "import { getInvoice } from '@/features/billing/queries'" },
      {
        text: "import { InvoiceDetail } from '@/features/billing/invoice-detail'",
      },
      { text: '' },
      {
        text: "export default async function InvoicePage({ params }: PageProps<'/billing/[id]'>) {",
        note: '`PageProps` is generated from the route, not hand-written — `params` is a Promise in this Next.js version, which is why the body immediately awaits it.',
      },
      { text: '  const { id } = await params' },
      { text: '  const user = await requireUser()' },
      {
        text: '  const invoice = await getInvoice(id, user.id)   // not getInvoice(id)',
        note: 'The comment names the bug this line avoids: calling `getInvoice(id)` alone would trust the route param without checking it belongs to the caller — the same mistake step 3 of `updateInvoice` closes for writes.',
      },
      { text: '  if (!invoice) notFound()' },
      { text: '  return <InvoiceDetail invoice={invoice} />' },
      { text: '}' },
    ],
  },

  loadingFile: {
    id: 'loading-file',
    filename: 'src/app/(app)/billing/loading.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/app/(app)/billing/loading.tsx' },
      {
        text: 'export default function Loading() {',
        note: 'Found by filename, not imported anywhere — the App Router renders this automatically while the segment’s data resolves. "No loading state" earlier only meant no client-side `isLoading` flag; the waiting moved here.',
      },
      { text: '  return (' },
      { text: '    <div aria-busy="true" aria-label="Loading invoices">' },
      { text: '      {Array.from({ length: 5 }, (_, i) => (' },
      {
        text: '        <div key={i} className="h-10 animate-pulse rounded bg-neutral-200" />',
      },
      { text: '      ))}' },
      { text: '    </div>' },
      { text: '  )' },
      { text: '}' },
    ],
  },

  errorFile: {
    id: 'error-file',
    filename: 'src/app/(app)/billing/error.tsx',
    language: 'tsx',
    lines: [
      { text: '// src/app/(app)/billing/error.tsx' },
      {
        text: "'use client'",
        note: 'Error boundaries are always Client Components — one of the few places the directive is not a choice.',
      },
      { text: '' },
      { text: 'export default function Error({' },
      {
        text: '  unstable_retry,',
        note: 'This Next.js version prefixes the retry prop `unstable_`, not the bare `reset` an older release used. The framework still passes `reset` too, but it only clears the boundary’s error state without re-fetching — it cannot recover a Server Component error, so code that still calls it compiles and runs while quietly not trying again.',
        pivot: true,
      },
      { text: '}: {' },
      { text: '  error: Error' },
      { text: '  unstable_retry: () => void' },
      { text: '}) {' },
      { text: '  return (' },
      { text: '    <div role="alert">' },
      { text: '      <p>Could not load invoices.</p>' },
      {
        text: '      <button onClick={() => unstable_retry()}>Try again</button>',
      },
      { text: '    </div>' },
      { text: '  )' },
      { text: '}' },
    ],
  },

  feedbackLoop: {
    id: 'feedback-loop',
    filename: 'Terminal',
    language: 'bash',
    lines: [
      {
        text: 'pnpm dev                    # Next.js dev server',
      },
      {
        text: 'pnpm drizzle-kit push       # apply a schema change locally',
        note: 'Pushes the schema straight to the local database with no migration file — fine for the loop while a table is still taking shape, not the tool for a change headed to a shared environment.',
      },
      { text: 'pnpm drizzle-kit studio     # inspect the database' },
      { text: 'pnpm vitest --watch         # tests re-running as you type' },
    ],
  },
}
