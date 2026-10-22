import { expect, test } from '@playwright/test'
import { CHECKS, RECORD_KEY } from '../src/features/documentation/record'
const STAGE = '/stages/10-documentation'

test('documentation retains a literal change record across hashes history and reload in both themes', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const literal =
    '<script>window.__documentationExecuted=true</script>' + 'x'.repeat(600)
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`${STAGE}#your-change`, { waitUntil: 'networkidle' })
    await page.evaluate(
      ({ key, theme }) => {
        localStorage.removeItem(key)
        localStorage.setItem('playbook:theme', JSON.stringify(theme))
      },
      { key: RECORD_KEY, theme },
    )
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await page.getByLabel('Change and scope', { exact: true }).fill(literal)
    await page.locator('#tab-your-evidence').click()
    await page
      .getByLabel('Observed evidence and limits', { exact: true })
      .fill('Not executed; source review only')
    await page.goBack()
    await expect(
      page.getByLabel('Change and scope', { exact: true }),
    ).toHaveValue(literal)
    await page.goForward()
    await expect(
      page.getByLabel('Observed evidence and limits', { exact: true }),
    ).toHaveValue('Not executed; source review only')
    await page.reload({ waitUntil: 'networkidle' })
    await expect(
      page.getByLabel('Observed evidence and limits', { exact: true }),
    ).toHaveValue('Not executed; source review only')
    await page.locator('#tab-checklist').click()
    await page.getByRole('checkbox', { name: CHECKS[9].text }).check()
    await page.reload({ waitUntil: 'networkidle' })
    await expect(
      page.getByRole('checkbox', { name: CHECKS[9].text }),
    ).toBeChecked()
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 900 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true)
    }
    expect(
      await page.evaluate(() => Reflect.get(window, '__documentationExecuted')),
    ).toBeUndefined()
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Clear whole record' }).click()
    expect(
      await page.evaluate((key) => localStorage.getItem(key), RECORD_KEY),
    ).toBeNull()
  }
  expect(errors).toEqual([])
})

test('documentation keeps an unsaved cross-panel draft and offers exact manual export when permissions fail', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript((key) => {
    const read = Storage.prototype.getItem
    const write = Storage.prototype.setItem
    Storage.prototype.getItem = function (name) {
      if (name === key) throw new DOMException('denied', 'SecurityError')
      return read.call(this, name)
    }
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('quota', 'QuotaExceededError')
      return write.call(this, name, value)
    }
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    })
  }, RECORD_KEY)
  await page.goto(`${STAGE}#your-change`, { waitUntil: 'networkidle' })
  await page
    .getByLabel('Change and scope', { exact: true })
    .fill('Unsaved change')
  await page.locator('#tab-your-evidence').click()
  await page.getByLabel('Owner and reviewer', { exact: true }).fill('Me')
  await page.getByRole('button', { name: 'Copy as Markdown' }).click()
  await expect(page.getByLabel('Markdown record', { exact: true })).toHaveValue(
    /Unsaved change/,
  )
  await expect(page.getByLabel('Markdown record', { exact: true })).toHaveValue(
    /Me/,
  )
  await expect(page.getByText(/Saving is unavailable/)).toBeVisible()
  await page.locator('#tab-your-change').click()
  await expect(
    page.getByLabel('Change and scope', { exact: true }),
  ).toHaveValue('Unsaved change')
  expect(errors).toEqual([])
})

test('documentation exposes replaced history and reasoning after a wrong keyboard answer', async ({
  page,
}) => {
  await page.goto(`${STAGE}#decisions`, { waitUntil: 'networkidle' })
  await expect(
    page.getByText('2026-10-20 — Current status: Superseded.'),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Read ADR 005' }).click()
  await expect(
    page.getByRole('region', {
      name: 'docs/adr/005-generated-contract-reference.md',
    }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Read ADR 004' }).click()
  await expect(
    page.getByText('2026-10-20 — Current status: Superseded.'),
  ).toBeVisible()
  await page.locator('#tab-comments').click()
  const radios = page.locator('#panel-comments').getByRole('radio')
  await radios.first().focus()
  await radios.first().press('Space')
  await radios.first().press('ArrowDown')
  await expect(radios.nth(1)).toBeChecked()
  expect((await radios.nth(1).boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByText('0 of 1 decisions correct')).toBeVisible()
  await expect(
    page.getByText(/It supplies no evidence of silent truncation/),
  ).toBeVisible()
  await page.locator('#tab-history').click()
  await page.locator('#tab-comments').click()
  await expect(page.getByText('0 of 1 decisions correct')).toBeVisible()
})
