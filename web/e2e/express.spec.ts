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
        await page.goto('/reference/express#' + id, {
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
    await page.goto('/reference/express#' + section.study!.id, {
      waitUntil: 'networkidle',
    })
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

for (const theme of ['light', 'dark']) {
  test(`Node foundations rail, code/table keyboard reading and repair reset in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 768 })
    await page.addInitScript(
      (t) => localStorage.setItem('playbook:theme', JSON.stringify(t)),
      theme,
    )
    await page.goto('/reference/express#event-loop')
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    const rail = page.getByRole('tablist', {
      name: 'Node.js & Express sections',
    })
    expect(
      await rail
        .getByRole('tab')
        .evaluateAll((nodes) => nodes.map((n) => n.id.replace(/^tab-/, ''))),
    ).toEqual(nodeExpress.sections.map((s) => s.study!.id))
    await rail.getByRole('tab').first().focus()
    await page.keyboard.press('End')
    await expect(page).toHaveURL(/#operate-and-explain$/)
    await page.keyboard.press('Home')
    await expect(page).toHaveURL(/#runtime-and-concurrency$/)
    await rail.getByRole('tab', { name: /Event loop/ }).click()
    await page
      .locator(
        'button[aria-controls="sheet-express-section-event-loop-subsection-event-loop-phases"]',
      )
      .click()
    for (const surface of [
      page.getByRole('region', { name: 'Phase purposes in Node 22' }),
      page.getByLabel(
        'walkthrough.cjs — save as an actual file and run node walkthrough.cjs',
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
    await rail.getByRole('tab', { name: /Work and workers/ }).click()
    const topic = page.locator(
      'button[aria-controls="sheet-express-section-work-and-workers-subsection-worker-threads"]',
    )
    await topic.focus()
    await page.keyboard.press('Enter')
    const solution = page.getByRole('button', {
      name: 'Solution: Send a bounded job to a Worker practice',
      exact: true,
    })
    await expect(solution).toHaveAttribute('aria-expanded', 'false')
    await solution.click()
    await expect(solution).toHaveAttribute('aria-expanded', 'true')
    await rail.getByRole('tab', { name: /Process and memory/ }).click()
    await page.goBack()
    await topic.click()
    await expect(solution).toHaveAttribute('aria-expanded', 'false')
  })
}
