import { expect, test } from '@playwright/test'
import { python } from '../src/lib/cheatsheets/python'
import { forEachPanelState } from './panel-states'
for (const theme of ['light', 'dark']) {
  test(`Python topics, solutions and layouts in ${theme}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type()))
        errors.push(message.text())
    })
    await page.addInitScript(
      (t) => localStorage.setItem('playbook:theme', JSON.stringify(t)),
      theme,
    )
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 768 })
      for (const section of python.sections) {
        const id = section.study!.id
        await page.goto('/reference/python#' + id, {
          waitUntil: 'networkidle',
        })
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
              `sheet-python-section-${id}-subsection-${r.study!.id}`,
              ...r.study!.activityIds.map((a) => `sheet-python-activity-${a}`),
            ])
            .sort(),
        )
      }
    }
    expect(errors).toEqual([])
  })
}
test('panel heights and keyboard history navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  for (const section of python.sections) {
    await page.goto('/reference/python#' + section.study!.id, {
      waitUntil: 'networkidle',
    })
    const panel = page.getByRole('tabpanel')
    expect((await panel.boundingBox())!.height).toBeLessThanOrEqual(3072)
    for (const row of section.rows) {
      const button = page.locator(
        `button[aria-controls="sheet-python-section-${section.study!.id}-subsection-${row.study!.id}"]`,
      )
      await button.focus()
      await page.keyboard.press('Enter')
      expect((await panel.boundingBox())!.height).toBeLessThanOrEqual(3072)
      await button.click()
    }
  }
  await page.goto('/reference/python#names-and-objects')
  await page.getByRole('tab', { name: /Runtime and syntax/ }).click()
  await expect(page).toHaveURL(/#runtime-and-syntax/)
  await page.goBack()
  await expect(page).toHaveURL(/#names-and-objects/)
  await page.goForward()
  await expect(page).toHaveURL(/#runtime-and-syntax/)
})

for (const theme of ['light', 'dark']) {
  test(`Python keyboard reading, rail and local repair reset in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 768 })
    await page.addInitScript(
      (t) => localStorage.setItem('playbook:theme', JSON.stringify(t)),
      theme,
    )
    await page.goto('/reference/python#names-and-objects')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    const rail = page.getByRole('tablist', { name: 'Python sections' })
    expect(
      await rail
        .getByRole('tab')
        .evaluateAll((nodes) => nodes.map((n) => n.id.replace(/^tab-/, ''))),
    ).toEqual(python.sections.map((s) => s.study!.id))
    await rail.getByRole('tab').first().focus()
    await page.keyboard.press('End')
    await expect(page).toHaveURL(/#report-capstone$/)
    await page.keyboard.press('Home')
    await expect(page).toHaveURL(/#runtime-and-syntax$/)
    await rail.getByRole('tab', { name: /Names and objects/ }).click()
    const topic = page.locator(
      'button[aria-controls="sheet-python-section-names-and-objects-subsection-mutation-and-copying"]',
    )
    await topic.focus()
    await page.keyboard.press('Enter')
    for (const surface of [
      page.getByRole('region', { name: 'Two dictionaries, one child list' }),
      page.getByLabel(
        'mutation-and-copying.py — run with python3 (CPython 3.12+)',
        { exact: true },
      ),
    ]) {
      await surface.focus()
      await expect(surface).toBeFocused()
      expect(await surface.evaluate((n) => n.scrollWidth > n.clientWidth)).toBe(
        true,
      )
      await page.keyboard.press('ArrowRight')
      await expect
        .poll(() => surface.evaluate((n) => n.scrollLeft))
        .toBeGreaterThan(0)
      expect(
        await surface.evaluate((n) => getComputedStyle(n).outlineStyle),
      ).not.toBe('none')
    }
    const solution = page.getByRole('button', {
      name: 'Solution: Independent report requests',
      exact: true,
    })
    await solution.focus()
    await page.keyboard.press('Enter')
    await expect(solution).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Enter')
    await expect(solution).toHaveAttribute('aria-expanded', 'false')
    await solution.click()
    await rail.getByRole('tab', { name: /Asyncio/ }).click()
    await page.goBack()
    await topic.click()
    await expect(solution).toHaveAttribute('aria-expanded', 'false')
  })
}
