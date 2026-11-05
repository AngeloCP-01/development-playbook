import { expect, test } from '@playwright/test'
import { forEachPanelState } from './panel-states'
import { auditPages } from './audit-pages'

const activities = [
  ['closure-counter', 'Closure factory'],
  ['nested-copy', 'Nested-copy repair'],
  ['async-iteration', 'Async iteration repair'],
  ['scheduling-trace', 'Scheduling trace'],
] as const

test('the shared audit visits JavaScript and observes all four solutions open', async ({
  page,
}) => {
  expect(await auditPages(page)).toContain('/reference/javascript')
  await page.goto('/reference/javascript')
  const { all, observed } = await forEachPanelState(page, async () => {})
  const expected = activities.map(([id]) => `sheet-javascript-activity-${id}`)
  expect(all.sort()).toEqual([...expected].sort())
  expect(observed.sort()).toEqual([...expected].sort())
  for (const id of expected) await expect(page.locator(`#${id}`)).toBeVisible()
})

test('JavaScript preserves native resource navigation and browser Back without persisting practice state', async ({
  page,
}) => {
  await page.goto('/reference')
  await expect(page.getByText('26 of 30', { exact: true })).toBeVisible()
  await page
    .getByRole('link', { name: /^JavaScript/ })
    .last()
    .click()
  await expect(page).toHaveURL(/\/reference\/javascript$/)
  const solution = page.getByRole('button', {
    name: 'Solution: Closure factory',
    exact: true,
  })
  await solution.click()
  await expect(solution).toHaveAttribute('aria-expanded', 'true')
  await page.goto('/reference/git-commands')
  await expect(
    page.getByRole('heading', { name: 'Practice', exact: true }),
  ).toHaveCount(0)
  await expect(page.locator('main dl')).not.toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/\/reference\/javascript$/)
  await expect(solution).toHaveAttribute('aria-expanded', 'false')
  await page.goto('/reference/glossary')
  await expect(
    page.getByRole('heading', { name: 'Glossary', exact: true }),
  ).toBeVisible()
  await page.goto('/reference/stack')
  await expect(
    page.getByRole('heading', { name: 'The Default Stack', exact: true }),
  ).toBeVisible()
})

for (const theme of ['light', 'dark']) {
  for (const width of [390, 768, 1440]) {
    test(`JavaScript practice can be attempted and compared by keyboard in ${theme} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript(
        (value) =>
          localStorage.setItem('playbook:theme', JSON.stringify(value)),
        theme,
      )
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      await page.goto('/reference/javascript')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      const assertOverflow = async () => {
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          ),
        ).toBe(0)
      }
      await assertOverflow()
      for (const [id, title] of activities) {
        const control = page.getByRole('button', {
          name: `Solution: ${title}`,
          exact: true,
        })
        const panel = page.locator(`#sheet-javascript-activity-${id}`)
        await expect(control).toHaveAttribute('aria-expanded', 'false')
        await expect(panel).toHaveCount(0)
        await control.focus()
        await expect(control).toBeFocused()
        expect(
          await control.evaluate((el) => {
            const style = getComputedStyle(el)
            const rect = el.getBoundingClientRect()
            return (
              style.outlineStyle !== 'none' &&
              parseFloat(style.outlineWidth) > 0 &&
              rect.top >= 0 &&
              rect.bottom <= innerHeight
            )
          }),
        ).toBe(true)
        if (width < 1024)
          expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(
            44,
          )
        await page.keyboard.press('Enter')
        await expect(control).toHaveAttribute('aria-expanded', 'true')
        await expect(panel).toBeVisible()
        await expect(control).toBeFocused()
        await assertOverflow()
        await page.keyboard.press('Space')
        await expect(panel).toHaveCount(0)
        await expect(control).toBeFocused()
        await page.keyboard.press('Enter')
      }
      // Each earlier solution remains open while later solutions are compared.
      for (const [id] of activities)
        await expect(
          page.locator(`#sheet-javascript-activity-${id}`),
        ).toBeVisible()
      await assertOverflow()
      // Long code scrolls inside its block and remains readable without page overflow.
      expect(
        await page
          .locator('main pre')
          .evaluateAll((blocks) =>
            blocks.every((el) => getComputedStyle(el).overflowX === 'auto'),
          ),
      ).toBe(true)
      await page.reload()
      for (const [, title] of activities)
        await expect(
          page.getByRole('button', { name: `Solution: ${title}`, exact: true }),
        ).toHaveAttribute('aria-expanded', 'false')
      expect(errors).toEqual([])
    })
  }
}
