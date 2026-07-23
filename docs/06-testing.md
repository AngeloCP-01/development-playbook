# 06. Testing

> Enough confidence to change code without fear, bought at the lowest maintenance cost
> you can manage.

**When this actually happens:** During [05 — Development](05-development.md), usually
before the code. Numbered after Development because that is where people look for it, not
because it comes after.

---

## Entry criteria

- [ ] Vitest and Playwright installed ([04 — Project Setup](04-project-setup.md))
- [ ] You can state what the code should do, specifically enough to assert on

That second criterion is the real one. If you cannot write the assertion, you do not yet
know what you are building — and writing the test first is how you find that out cheaply.

---

## The work

### The one question worth asking

Not "what is my coverage?" but: **if this breaks, how will I find out?**

If the answer is "a user emails me," write a test. If the answer is "the typechecker
catches it," do not — you already have that coverage for free.

This question sorts tests better than any percentage target.

### The distribution

Roughly, for a Next.js application:

**Many unit tests** — pure functions, business logic, Zod schemas, calculations. Fast
(milliseconds), stable, precise about what broke. Push logic into pure functions
specifically so it can be tested this way.

**Some integration tests** — a Server Action end to end against a real test database. The
best value-per-test in the whole suite, because most real bugs live between the layers
rather than inside them.

**Few E2E tests** — the critical paths only: sign up, log in, the money path. Slow and
inherently flakier. Five good ones beat fifty mediocre ones.

**Almost no component tests** — most React components are presentational. Testing that a
component renders a prop tests React, not your application. Test components with real
logic; let the rest be covered by E2E.

### Unit tests

```ts
// src/features/billing/pricing.test.ts
import { describe, expect, it } from 'vitest'
import { calculateTotal } from './pricing'

describe('calculateTotal', () => {
  it('applies percentage discounts before tax', () => {
    const result = calculateTotal({
      items: [{ price: 10_000, quantity: 2 }],
      discountPercent: 10,
      taxPercent: 8,
    })
    expect(result).toBe(19_440)   // 20000 - 10% = 18000, +8% = 19440
  })

  it('never returns a negative total', () => {
    const result = calculateTotal({
      items: [{ price: 100, quantity: 1 }],
      discountPercent: 200,
      taxPercent: 0,
    })
    expect(result).toBe(0)
  })
})
```

Money in integer cents, never floats. `0.1 + 0.2 !== 0.3` is a real bug that reaches real
invoices.

The second test is the more valuable one. Happy paths tend to work; edge cases are where
bugs live. For each function ask: empty input, zero, negative, very large, null,
duplicates.

### Integration tests

```ts
// src/features/billing/actions.test.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { updateInvoice } from './actions'
import { resetDb, seedUser, seedInvoice } from '@/test/helpers'

describe('updateInvoice', () => {
  beforeEach(async () => { await resetDb() })

  it('updates an invoice the caller owns', async () => {
    const user = await seedUser()
    const invoice = await seedInvoice({ ownerId: user.id, amount: 100 })

    await asUser(user, () => updateInvoice({ invoiceId: invoice.id, amount: 250 }))

    const updated = await getInvoice(invoice.id)
    expect(updated.amount).toBe(250)
  })

  it('refuses to update an invoice owned by someone else', async () => {
    const owner = await seedUser()
    const attacker = await seedUser()
    const invoice = await seedInvoice({ ownerId: owner.id, amount: 100 })

    await expect(
      asUser(attacker, () => updateInvoice({ invoiceId: invoice.id, amount: 1 })),
    ).rejects.toThrow()

    expect((await getInvoice(invoice.id)).amount).toBe(100)
  })
})
```

**Write the second test for every action that touches user-owned data.** Authorization
bugs are the most damaging class of bug in this kind of application and the easiest to
introduce during a refactor. A test that proves an attacker is refused is worth more than
a hundred tests of the happy path.

Use a real Postgres instance, not mocks. Mocking the database tests your mock. Docker
locally, a service container in CI.

### E2E tests

```ts
// e2e/checkout.spec.ts
import { expect, test } from '@playwright/test'

test('a user can complete a purchase @smoke', async ({ page }) => {
  await page.goto('/products/starter-plan')
  await page.getByRole('button', { name: 'Buy now' }).click()

  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Card number').fill('4242424242424242')
  await page.getByRole('button', { name: 'Complete purchase' }).click()

  await expect(page.getByText('Thank you for your order')).toBeVisible()
})
```

Select by **role and accessible name**, never by CSS class. `getByRole('button', { name:
'Buy now' })` survives restyling and breaks only when the user-visible thing actually
changes — which is when you want it to break. It also means an inaccessible UI produces
failing tests, which is a useful accident.

Tag the critical few with `@smoke` so they can run against production
([14](14-post-deployment-verification.md)).

Never use `waitForTimeout`. Playwright's assertions auto-retry; an arbitrary sleep is
either too short (flaky) or too long (slow), and usually manages both across different
machines.

### Test-first, mostly

Writing the test first works because it forces you to define "done" before you can be
influenced by what you happened to build. Test-after tends to test the code you wrote
rather than the behavior you wanted.

Where it genuinely earns its keep:
- **Bug fixes.** Always. Reproduce with a failing test first, then fix. Otherwise you
  cannot prove you fixed it, and nothing stops it regressing.
- **Business logic** with clear inputs and outputs.
- **Anything you are unsure how to structure.** Writing the call site first is design
  work.

Where it is less useful: exploratory UI work where you are discovering the shape as you
go. Spike it, then write tests before it merges.

### The teeth check

When a test is written *after* the code it covers — a regression test, or tests added to
an existing module — green proves nothing, because the test never failed. Prove it bites:
deliberately break the implementation, confirm the new test — and only that test — fails,
then restore. Both outputs go in the task report.

This is not ceremony. This playbook's own gate passed a deliberately bad commit twice
before a teeth check exposed that eslint exits 0 on warnings; the check is what
separates a safety net from a decoration.

### Invariant tests over hand-edited data

Content-heavy projects have a class of bug no behaviour test catches: a config or data
file edited by hand, wrongly. Duplicate keys, an ID that stopped matching its slug, an
entry registered nowhere. Write tests that assert the *shape* of the data — counts,
uniqueness, cross-references between files — not its values.

Thirteen such tests guard this playbook's stage registry, and a corrupted slug fails
exactly four of them with messages naming the slug. They cost minutes to write and run
in milliseconds, and they fire precisely when a human is editing data by hand — the
moment reviews are at their weakest.

### What not to test

Deleting a bad test is as valuable as writing a good one. Do not test:

- **Framework behavior.** Next.js routing works. That is not your responsibility.
- **Type-level guarantees.** If TypeScript proves it, a test is redundant.
- **Implementation details.** Tests asserting internal state break on every refactor while
  catching nothing. Test behavior through the public interface.
- **Trivial presentational components.** Covered incidentally by E2E.
- **Third-party libraries.** Test your usage, not their correctness.

### Coverage

Useful as a diagnostic, useless as a target. A blanket 80% threshold gets satisfied by
testing whatever is easiest, which is rarely whatever is riskiest.

Read the report and ask: **is anything important uncovered?** Payment logic at 40% is a
problem. A settings page at 40% probably is not.

If you enforce a threshold in CI, scope it to the modules that matter.

---

## Artifacts

- `*.test.ts` alongside source in `src/features/`
- `e2e/*.spec.ts` for critical paths, with `@smoke` tags
- `src/test/helpers.ts` — seeding and reset utilities
- Test database configuration for local and CI

---

## Definition of done

- [ ] New business logic has unit tests, including edge cases
- [ ] Every Server Action touching user data has an authorization-refusal test
- [ ] Bug fixes have a regression test that failed before the fix
- [ ] Critical paths have E2E coverage
- [ ] Full unit suite runs in under 30 seconds
- [ ] No `waitForTimeout` anywhere
- [ ] No skipped tests without a comment explaining why

---

## Scaling to a team

- **Tests become documentation.** They are how a new engineer learns intended behavior.
  Name them as sentences describing the behavior, not `test1`.
- **Agree on the boundary** of what gets tested, or you get one person testing getters and
  another testing nothing.
- **Track flakiness visibly.** On a team, flaky tests get tolerated because everyone
  assumes someone else owns them. A retry-rate dashboard fixes that.
- **Require tests in review.** "Where's the test for this?" is the highest-value review
  comment ([07](07-code-review.md)).

---

## Traps

**Mocking the database.** You end up testing that your mock returns what you told it to.
Integration tests against real Postgres catch constraint violations, transaction bugs, and
query errors that mocks cannot.

**No authorization tests.** The most damaging omission in this doc.

**Testing implementation details.** Tests that break on every refactor get deleted or
ignored, and then you have neither tests nor confidence.

**CSS selectors in E2E.** `.btn-primary-2` breaks on restyle and tells you nothing about
user-visible behavior.

**`waitForTimeout`.** The single largest source of E2E flakiness.

**Coverage as a target.** Optimizes for the easy code, not the risky code.

**Skipping the regression test on a bug fix.** Without it you cannot prove the fix works,
and nothing prevents it coming back.

**A slow unit suite.** Past thirty seconds, watch mode stops being usable, and the tight
feedback loop that makes tests valuable disappears.
