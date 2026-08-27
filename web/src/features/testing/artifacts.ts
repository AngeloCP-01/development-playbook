import { type Artifact } from '@/components/artifact'

/**
 * The three fenced blocks in `docs/06-testing.md`, quoted verbatim and
 * annotated.
 *
 * They are one feature at three altitudes — a discounted checkout, tested
 * underneath as a pure function, across the seam as a Server Action against a
 * real database, and end to end as the money path. The doc never says so out
 * loud; the panels do, because three snippets that happen to share a domain
 * teach less than one feature shown at three heights.
 *
 * `artifacts.test.ts` asserts each block **equals** one of the doc's fences
 * rather than being contained by one (D-66). The reader is meant to paste
 * these, so a block that drifts is worse than a diagram that drifts.
 */
export const ARTIFACTS: Record<string, Artifact> = {
  pricing: {
    id: 'pricing',
    filename: 'src/features/billing/pricing.test.ts',
    language: 'ts',
    lines: [
      { text: '// src/features/billing/pricing.test.ts' },
      { text: "import { describe, expect, it } from 'vitest'" },
      { text: "import { calculateTotal } from './pricing'" },
      { text: '' },
      { text: "describe('calculateTotal', () => {" },
      { text: "  it('applies percentage discounts before tax', () => {" },
      { text: '    const result = calculateTotal({' },
      { text: '      items: [{ price: 10_000, quantity: 2 }],' },
      { text: '      discountPercent: 10,' },
      { text: '      taxPercent: 8,' },
      { text: '    })' },
      {
        text: '    expect(result).toBe(19_440)   // 20000 - 10% = 18000, +8% = 19440',
        note: 'The arithmetic is in the doc’s own trailing comment: 20000 less 10% is 18000, plus 8% is 19440. Money is in integer cents throughout, never floats — `0.1 + 0.2 !== 0.3` is a real bug that reaches real invoices.',
      },
      { text: '  })' },
      { text: '' },
      {
        text: "  it('never returns a negative total', () => {",
        note: 'The more valuable of the two. Happy paths tend to work; edge cases are where bugs live. A 200% discount is not a realistic input, which is exactly why nobody wrote the branch that handles it.',
        pivot: true,
      },
      { text: '    const result = calculateTotal({' },
      { text: '      items: [{ price: 100, quantity: 1 }],' },
      { text: '      discountPercent: 200,' },
      { text: '      taxPercent: 0,' },
      { text: '    })' },
      { text: '    expect(result).toBe(0)' },
      { text: '  })' },
      { text: '})' },
    ],
  },

  actions: {
    id: 'actions',
    filename: 'src/features/billing/actions.test.ts',
    language: 'ts',
    lines: [
      { text: '// src/features/billing/actions.test.ts' },
      { text: "import { beforeEach, describe, expect, it } from 'vitest'" },
      { text: "import { updateInvoice } from './actions'" },
      {
        text: "import { resetDb, seedUser, seedInvoice } from '@/test/helpers'",
      },
      { text: '' },
      { text: "describe('updateInvoice', () => {" },
      {
        text: '  beforeEach(async () => { await resetDb() })',
        note: 'A real Postgres instance, not a mock. Mocking the database tests your mock — it cannot see a constraint violation, a transaction bug, or a malformed query. Docker locally, a service container in CI.',
      },
      { text: '' },
      { text: "  it('updates an invoice the caller owns', async () => {" },
      { text: '    const user = await seedUser()' },
      {
        text: '    const invoice = await seedInvoice({ ownerId: user.id, amount: 100 })',
      },
      { text: '' },
      {
        text: '    await asUser(user, () => updateInvoice({ invoiceId: invoice.id, amount: 250 }))',
        note: '`asUser` and `getInvoice` are helpers the reader supplies — neither is imported or defined anywhere in this fence, unlike `resetDb`, `seedUser` and `seedInvoice` above, which are imported and just need that helpers file written. Copying this block without `asUser`/`getInvoice` fails on `ReferenceError` regardless, not on anything the test is about.',
      },
      { text: '' },
      { text: '    const updated = await getInvoice(invoice.id, user.id)' },
      { text: '    expect(updated.amount).toBe(250)' },
      { text: '  })' },
      { text: '' },
      {
        text: "  it('refuses to update an invoice owned by someone else', async () => {",
        note: 'Write this second test for every action that touches user-owned data. Authorization bugs are the most damaging class in this kind of application and the easiest to introduce during a refactor, and a test proving an attacker is refused is worth more than a hundred tests of the happy path.',
        pivot: true,
      },
      { text: '    const owner = await seedUser()' },
      { text: '    const attacker = await seedUser()' },
      {
        text: '    const invoice = await seedInvoice({ ownerId: owner.id, amount: 100 })',
      },
      { text: '' },
      { text: '    const result = await asUser(attacker, () =>' },
      { text: '      updateInvoice({ invoiceId: invoice.id, amount: 1 }),' },
      { text: '    )' },
      { text: "    expect(result).toEqual({ ok: false, error: 'Not found' })" },
      { text: '' },
      {
        text: '    expect((await getInvoice(invoice.id, owner.id)).amount).toBe(100)',
        note: 'The refusal is only half the assertion. This line proves nothing was written — an action that returns an error and mutates anyway would pass without it.',
      },
      { text: '  })' },
      { text: '})' },
    ],
  },

  checkout: {
    id: 'checkout',
    filename: 'e2e/checkout.spec.ts',
    language: 'ts',
    lines: [
      { text: '// e2e/checkout.spec.ts' },
      { text: "import { expect, test } from '@playwright/test'" },
      { text: '' },
      {
        text: "test('a user can complete a purchase @smoke', async ({ page }) => {",
        note: 'The tag is what lets the critical few run against production after a deploy (stage 14). Five good E2E tests beat fifty mediocre ones; this is one of the five.',
      },
      { text: "  await page.goto('/products/starter-plan')" },
      {
        text: "  await page.getByRole('button', { name: 'Buy now' }).click()",
        note: 'Role and accessible name, never a CSS class. This survives restyling and breaks only when the user-visible thing actually changes, which is when you want it to break. It also means an inaccessible UI produces failing tests, which is a useful accident.',
        pivot: true,
      },
      { text: '' },
      { text: "  await page.getByLabel('Email').fill('test@example.com')" },
      {
        text: "  await page.getByLabel('Card number').fill('4242424242424242')",
      },
      {
        text: "  await page.getByRole('button', { name: 'Complete purchase' }).click()",
      },
      { text: '' },
      {
        text: "  await expect(page.getByText('Thank you for your order')).toBeVisible()",
      },
      { text: '})' },
    ],
  },
}
