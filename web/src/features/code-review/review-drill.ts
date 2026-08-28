export type Category =
  | 'authorization'
  | 'edge-case'
  | 'cleanup'
  | 'naming'
  | 'scope'
  | 'test-quality'
  | 'error-handling'

export type CategoryOption = {
  id: Category
  label: string
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'authorization', label: 'Authorization' },
  { id: 'edge-case', label: 'Edge case' },
  { id: 'cleanup', label: 'Cleanup' },
  { id: 'naming', label: 'Naming' },
  { id: 'scope', label: 'Scope' },
  { id: 'test-quality', label: 'Test quality' },
  { id: 'error-handling', label: 'Error handling' },
]

export type Snippet = {
  id: string
  label: string
  code: string
  language: 'ts' | 'tsx'
  answer: Category
  explanation: string
}

export const SNIPPETS: Snippet[] = [
  {
    id: 'invoice-fetch',
    label: 'Server action: fetch invoice',
    code: `export async function getInvoice(id: string) {
  const invoice = await db.invoice.findUnique({
    where: { id },
  })
  return invoice
}`,
    language: 'ts',
    answer: 'authorization',
    explanation:
      'The query is filtered only by the client-supplied ID. Any authenticated user can fetch any invoice. The fix is to add `userId: session.userId` to the `where` clause — authorization, not just authentication.',
  },
  {
    id: 'order-list',
    label: 'Component: order list',
    code: `export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="divide-y">
      {orders.map((o) => (
        <li key={o.id}>{o.name} — \${o.total}</li>
      ))}
    </ul>
  )
}`,
    language: 'tsx',
    answer: 'edge-case',
    explanation:
      'Zero orders renders an empty `<ul>` with nothing visible. The user sees a blank area with no indication that there are no orders. Add an empty-state message when `orders.length === 0`.',
  },
  {
    id: 'form-submit',
    label: 'Server action: contact form',
    code: `export async function submitContact(formData: FormData) {
  console.log(formData)
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  await db.contact.create({ data: { name, email } })
  redirect('/contacts')
}`,
    language: 'ts',
    answer: 'cleanup',
    explanation:
      'A `console.log(formData)` is left in production code. It logs every form submission to the server console — including the user’s email. Debug logging does not belong in production.',
  },
  {
    id: 'process-data',
    label: 'Utility: order processing',
    code: `export async function processData(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
  })
  if (!order) throw new Error('Order not found')
  await sendEmail({
    to: order.customerEmail,
    subject: \`Order \${order.id} confirmed\`,
    body: renderConfirmation(order),
  })
}`,
    language: 'ts',
    answer: 'naming',
    explanation:
      'The function is called `processData` but it sends a confirmation email. The name hides the side effect. A reader calling `processData` does not expect an email to go out. Name it `sendOrderConfirmation`.',
  },
  {
    id: 'bundled-rename',
    label: 'PR: add currency selector',
    code: `// PriceTag.tsx — adds currency selector (the stated PR goal)
export function PriceTag({ amount, currency = 'USD' }: Props) {
  return <span>{formatCurrency(amount, currency)}</span>
}

// Also in this PR: renamed helpers.ts → format.ts,
// reformatted all imports in 12 files to use the new path.`,
    language: 'tsx',
    answer: 'scope',
    explanation:
      'The PR bundles a feature (currency selector) with an unrelated rename and a 12-file import reformat. The feature is one review; the rename is another. Split them so each can be reviewed and reverted independently.',
  },
  {
    id: 'vacuous-test',
    label: 'Test: create user',
    code: `test('createUser returns the new user', async () => {
  const user = await createUser({
    name: 'Ada',
    email: 'ada@test.com',
  })
  expect(user).not.toBeNull()
})`,
    language: 'ts',
    answer: 'test-quality',
    explanation:
      'The function’s return type is `User`, never `null`. This test passes with or without the change — it would pass even if `createUser` threw, as long as the thrown error is caught elsewhere. Assert something the change actually affects.',
  },
]
