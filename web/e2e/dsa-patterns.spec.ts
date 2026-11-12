import { expect, test } from '@playwright/test'
import { forEachPanelState } from './panel-states'
import { auditPages } from './audit-pages'

import { dsaPatterns } from '../src/lib/cheatsheets/dsa-patterns'

const sections = dsaPatterns.sections.map((section) => ({
  id: section.study!.id,
  title: section.title,
  rows: section.rows,
  activities: section.rows.flatMap((row) =>
    row.study!.activityIds.map((id) => {
      const activity = dsaPatterns.activities!.find((item) => item.id === id)!
      return [id, activity.title] as const
    }),
  ),
}))
const prefix = (section: string, row: string) =>
  `sheet-dsa-patterns-section-${section}-subsection-${row}`
async function openTopic(
  page: import('@playwright/test').Page,
  section: string,
  row: string,
) {
  const control = page.locator(
    `button[aria-controls="${prefix(section, row)}"]`,
  )
  if ((await control.getAttribute('aria-expanded')) === 'false') {
    await control.focus()
    await page.keyboard.press('Enter')
  }
}

test('the shared audit discovers every rendered study hash and observes every nested topic and all eighteen local solutions', async ({
  page,
}) => {
  const paths = await auditPages(page)
  for (const section of sections)
    expect(paths).toContain(`/reference/dsa-patterns#${section.id}`)
  const observedIds: string[] = []
  for (const section of sections) {
    await page.goto(`/reference/dsa-patterns#${section.id}`, {
      waitUntil: 'networkidle',
    })
    await expect(
      page.getByRole('heading', { name: section.title, exact: true }),
    ).toBeVisible()
    const { all, observed } = await forEachPanelState(page, async () => {})
    const expected = [
      ...section.rows.map((row) => prefix(section.id, row.study!.id)),
      ...section.activities.map(([id]) => `sheet-dsa-patterns-activity-${id}`),
    ]
    expect(all.sort()).toEqual([...expected].sort())
    expect(observed.sort()).toEqual([...expected].sort())
    observedIds.push(...observed)
  }
  expect(new Set(observedIds).size).toBe(observedIds.length)
})

test('DSA discovery, navigation, themes, width and panel budget', async ({
  page,
}) => {
  await page.goto('/reference')
  await expect(page.getByText('28 of 31', { exact: true })).toBeVisible()
  await page
    .locator('main')
    .getByRole('link', { name: /DSA Patterns/ })
    .click()
  const rail = page.getByRole('tablist', { name: 'DSA Patterns sections' })
  await expect(rail.getByRole('tab')).toHaveCount(sections.length)
  for (const theme of ['light', 'dark'])
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 768 })
      await page.evaluate((theme) => {
        localStorage.setItem('playbook:theme', JSON.stringify(theme))
        window.dispatchEvent(new Event('storage'))
      }, theme)
      for (const section of sections) {
        await page.goto(`/reference/dsa-patterns#${section.id}`)
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        await expect(
          page.getByRole('heading', { name: section.title, exact: true }),
        ).toBeVisible()
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true)
        if (width === 1024)
          expect(
            await page
              .locator('[role=tabpanel]')
              .evaluate((n) => n.getBoundingClientRect().height),
          ).toBeLessThan(3072)
        for (const row of section.rows) {
          await openTopic(page, section.id, row.study!.id)
          if (width === 1024)
            expect(
              await page
                .locator('[role=tabpanel]')
                .evaluate((n) => n.getBoundingClientRect().height),
            ).toBeLessThan(3072)
          await page
            .locator(
              `button[aria-controls="${prefix(section.id, row.study!.id)}"]`,
            )
            .click()
        }
      }
    }
  await page.goto('/reference/dsa-patterns#scan-and-remember')
  await openTopic(page, 'scan-and-remember', 'hash-complements')
  const solution = page.getByRole('button', {
    name: 'Solution: Hash complements practice',
    exact: true,
  })
  await solution.click()
  await rail.getByRole('tab', { name: /Foundations/ }).click()
  await page.goBack()
  await openTopic(page, 'scan-and-remember', 'hash-complements')
  await expect(solution).toHaveAttribute('aria-expanded', 'false')
  await page.goForward()
  await rail.getByRole('tab', { name: /Foundations/ }).focus()
  await page.keyboard.press('End')
  await expect(page).toHaveURL(/#defend-a-choice$/)
  await page.keyboard.press('Home')
  await expect(page).toHaveURL(/#foundations$/)
  const code = dsaPatterns.sections
    .flatMap((s) => s.rows.flatMap((r) => r.teaching ?? []))
    .filter((b) => b.kind === 'code')
    .map((b) => b.code)
    .join('\n')
  expect(
    await page.evaluate(
      (code) =>
        Function(
          code +
            ';return [findPair([3,6],9),longestDistinct([1,2,1]),countTargetRanges([0,0],0),kthLargest([5,2,5],2),shortestPath([[1],[]],0,1),topologicalOrder([[1],[]]),minCoins([1,3,4],6)]',
        )(),
      code,
    ),
  ).toEqual([[0, 1], 2, 3, 5, [0, 1], [0, 1], 2])
})
