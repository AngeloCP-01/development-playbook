import { expect, test } from '@playwright/test'
import { nodeExpress } from '../src/lib/cheatsheets/express'
import { forEachPanelState } from './panel-states'
for (const theme of ['light', 'dark']) {
  test(`Node and Express topics, solutions and layouts in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (t) => localStorage.setItem('playbook:theme', JSON.stringify(t)),
      theme,
    )
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 768 })
      for (const section of nodeExpress.sections) {
        const id = section.study!.id
        await page.goto('/reference/express#' + id)
        await expect(
          page.getByRole('heading', { name: section.title, level: 2 }),
        ).toBeVisible()
        const { observed } = await forEachPanelState(page, async () => {
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true)
        })
        expect(observed.sort()).toEqual(
          section.rows
            .flatMap((r) => [
              `sheet-express-section-${id}-subsection-${r.study!.id}`,
              ...r.study!.activityIds.map((a) => `sheet-express-activity-${a}`),
            ])
            .sort(),
        )
      }
    }
  })
}
test('panel heights and keyboard history navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  for (const section of nodeExpress.sections) {
    await page.goto('/reference/express#' + section.study!.id)
    const panel = page.getByRole('tabpanel')
    expect((await panel.boundingBox())!.height).toBeLessThanOrEqual(3072)
    for (const row of section.rows) {
      const button = page.locator(
        `button[aria-controls="sheet-express-section-${section.study!.id}-subsection-${row.study!.id}"]`,
      )
      await button.focus()
      await page.keyboard.press('Enter')
      expect((await panel.boundingBox())!.height).toBeLessThanOrEqual(3072)
      await button.click()
    }
  }
  await page.goto('/reference/express#security')
  await page.getByRole('tab', { name: /Test and debug/ }).click()
  await expect(page).toHaveURL(/#test-and-debug/)
  await page.goBack()
  await expect(page).toHaveURL(/#security/)
  await page.goForward()
  await expect(page).toHaveURL(/#test-and-debug/)
})
