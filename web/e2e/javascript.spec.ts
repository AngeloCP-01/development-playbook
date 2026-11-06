import { expect, test } from '@playwright/test'
import { forEachPanelState } from './panel-states'
import { auditPages } from './audit-pages'

import { javascript } from '../src/lib/cheatsheets/javascript'

const sections = javascript.sections.map((section) => ({
  id: section.study!.id,
  title: section.title,
  rows: section.rows,
  activities: section.rows.flatMap((row) =>
    row.study!.activityIds.map((id) => {
      const activity = javascript.activities!.find((item) => item.id === id)!
      return [id, activity.title] as const
    }),
  ),
}))
const prefix = (section: string, row: string) =>
  `sheet-javascript-section-${section}-subsection-${row}`
async function openTopic(
  page: import('@playwright/test').Page,
  section: string,
  row: string,
) {
  const control = page.locator(
    `button[aria-controls="${prefix(section, row)}"]`,
  )
  if ((await control.getAttribute('aria-expanded')) === 'false')
    await control.click()
}

test('the shared audit discovers every rendered study hash and observes every nested topic and all fourteen local solutions', async ({
  page,
}) => {
  const paths = await auditPages(page)
  for (const section of sections)
    expect(paths).toContain(`/reference/javascript#${section.id}`)
  const observedIds: string[] = []
  for (const section of sections) {
    await page.goto(`/reference/javascript#${section.id}`, {
      waitUntil: 'networkidle',
    })
    await expect(
      page.getByRole('heading', { name: section.title, exact: true }),
    ).toBeVisible()
    const { all, observed } = await forEachPanelState(page, async () => {})
    const expected = [
      ...section.rows.map((row) => prefix(section.id, row.study!.id)),
      ...section.activities.map(([id]) => `sheet-javascript-activity-${id}`),
    ]
    expect(all.sort()).toEqual([...expected].sort())
    expect(observed.sort()).toEqual([...expected].sort())
    observedIds.push(...observed)
  }
  expect(new Set(observedIds).size).toBe(39)
})

test('study sections support later deep links, Back/Forward, keyboard navigation and fresh local answers', async ({
  page,
}) => {
  await page.goto('/reference/javascript#scope')
  const rail = page.getByRole('tablist', { name: 'JavaScript sections' })
  await expect(rail.getByRole('tab', { name: /Scope/ })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await openTopic(page, 'scope', 'closures')
  const counter = page.getByRole('button', {
    name: 'Solution: Closure factory',
    exact: true,
  })
  await counter.click()
  await rail.getByRole('tab', { name: /Collections/ }).click()
  await expect(page).toHaveURL(/#arrays$/)
  await expect(counter).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/#scope$/)
  await expect(counter).toHaveCount(0)
  await openTopic(page, 'scope', 'closures')
  await expect(counter).toHaveAttribute('aria-expanded', 'false')
  await page.goForward()
  await expect(page).toHaveURL(/#arrays$/)
  await page.reload()
  await expect(rail.getByRole('tab', { name: /Collections/ })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await rail.getByRole('tab', { name: /Collections/ }).focus()
  await page.keyboard.press('End')
  await expect(page).toHaveURL(/#modules$/)
  await expect(rail.getByRole('tab', { name: /Modules/ })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(page).toHaveURL(/#values$/)
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/#scope$/)
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(/#values$/)
})

test('ordinary lookup and native resources retain their routes and presentation', async ({
  page,
}) => {
  await page.goto('/reference')
  await expect(page.getByText('26 of 30', { exact: true })).toBeVisible()
  await page
    .getByRole('link', { name: /^JavaScript/ })
    .last()
    .click()
  await expect(
    page.getByRole('tablist', { name: 'JavaScript sections' }),
  ).toBeVisible()
  await page.goto('/reference/git-commands')
  await expect(page.locator('main dl')).not.toHaveCount(0)
  await expect(page.getByRole('tablist')).toHaveCount(0)
  await page.goto('/reference/glossary')
  await expect(
    page.getByRole('heading', { name: 'Glossary', exact: true }),
  ).toBeVisible()
  await page.goto('/reference/stack')
  await expect(
    page.getByRole('heading', { name: 'The Default Stack', exact: true }),
  ).toBeVisible()
})

for (const theme of ['light', 'dark'])
  for (const width of [320, 768, 1440]) {
    test(`study teaching and local practice work in ${theme} at ${width}px`, async ({
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
      for (const section of sections) {
        await page.goto(`/reference/javascript#${section.id}`, {
          waitUntil: 'networkidle',
        })
        await expect(
          page.getByRole('heading', { name: section.title, exact: true }),
        ).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        for (const row of section.rows) {
          await expect(
            page.getByText(row.study!.summary, { exact: true }),
          ).toBeVisible()
          await openTopic(page, section.id, row.study!.id)
        }
        for (const [id, title] of section.activities) {
          const control = page.getByRole('button', {
            name: `Solution: ${title}`,
            exact: true,
          })
          const panel = page.locator(`#sheet-javascript-activity-${id}`)
          await expect(control).toHaveAttribute('aria-expanded', 'false')
          await control.focus()
          const inspectFocus = () =>
            control.evaluate((el) => {
              const style = getComputedStyle(el),
                rect = el.getBoundingClientRect()
              const rail = document
                .querySelector(
                  '[role=tablist][aria-label="JavaScript sections"]',
                )!
                .getBoundingClientRect()
              return {
                visible: rect.top >= rail.bottom && rect.bottom <= innerHeight,
                outlined:
                  style.outlineStyle !== 'none' &&
                  parseFloat(style.outlineWidth) > 0,
                height: rect.height,
              }
            })
          await expect
            .poll(async () => {
              const focus = await inspectFocus()
              return focus.visible && focus.outlined
            })
            .toBe(true)
          const focus = await inspectFocus()
          if (width < 1024) expect(focus.height).toBeGreaterThanOrEqual(44)
          await page.keyboard.press('Enter')
          await expect(panel).toBeVisible()
          await expect(control).toBeFocused()
          await page.keyboard.press('Space')
          await expect(panel).toHaveCount(0)
          await expect(control).toBeFocused()
          await page.keyboard.press('Enter')
        }
        for (const [id] of section.activities)
          await expect(
            page.locator(`#sheet-javascript-activity-${id}`),
          ).toBeVisible()
        expect(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          ),
        ).toBe(0)
        expect(
          await page
            .locator('main pre')
            .evaluateAll((blocks) =>
              blocks.every((el) => getComputedStyle(el).overflowX === 'auto'),
            ),
        ).toBe(true)
      }
      expect(errors).toEqual([])
    })
  }

test('a solution focused near the top clears the sticky study rail', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/reference/javascript#async', {
    waitUntil: 'networkidle',
  })
  await expect(page.getByRole('tab', { name: /Promises/ })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await openTopic(page, 'async', 'joining')
  const control = page.getByRole('button', {
    name: 'Solution: Async iteration repair',
    exact: true,
  })
  await page.getByRole('tab', { name: /Promises/ }).focus()
  await control.evaluate((el) =>
    window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top),
  )
  await control.focus()
  await expect
    .poll(() =>
      control.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const rail = document
          .querySelector('[aria-label="JavaScript sections"]')!
          .getBoundingClientRect()
        return rect.top >= rail.bottom && rect.bottom <= innerHeight
      }),
    )
    .toBe(true)
})

for (const theme of ['light', 'dark']) {
  test(`overflowing study code supports visible keyboard focus and horizontal scrolling in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 })
    await page.addInitScript(
      (value) => localStorage.setItem('playbook:theme', JSON.stringify(value)),
      theme,
    )
    await page.goto('/reference/javascript#async', { waitUntil: 'networkidle' })
    await openTopic(page, 'async', 'awaiting')
    await openTopic(page, 'async', 'joining')
    const panel = page.getByRole('tabpanel')
    const solution = panel.getByRole('button', {
      name: 'Solution: Async iteration repair',
      exact: true,
    })
    await solution.focus()
    await page.keyboard.press('Enter')
    await expect(solution).toHaveAttribute('aria-expanded', 'true')

    const blocks = [
      panel.locator('pre').filter({ hasText: 'async function read()' }),
      panel.locator('pre').filter({ hasText: 'await items.forEach' }),
      panel.locator('pre').filter({ hasText: 'for (const item of items)' }),
    ]
    for (const block of blocks) {
      expect(
        await block.evaluate((el) => el.scrollWidth > el.clientWidth),
      ).toBe(true)
      await panel.focus()
      for (
        let attempt = 0;
        attempt < (await panel.locator('button, pre[tabindex]').count()) + 1;
        attempt++
      ) {
        await page.keyboard.press('Tab')
        if (await block.evaluate((el) => document.activeElement === el)) break
      }
      await expect(block).toBeFocused()
      await expect
        .poll(() =>
          block.evaluate((el) => {
            const style = getComputedStyle(el)
            const rect = el.getBoundingClientRect()
            const rail = document
              .querySelector('[aria-label="JavaScript sections"]')!
              .getBoundingClientRect()
            return (
              el.matches(':focus-visible') &&
              style.outlineStyle !== 'none' &&
              parseFloat(style.outlineWidth) > 0 &&
              rect.top >= rail.bottom &&
              rect.bottom <= innerHeight
            )
          }),
        )
        .toBe(true)
      const before = await block.evaluate((el) => el.scrollLeft)
      await page.keyboard.press('ArrowRight')
      await expect
        .poll(() => block.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(before)
    }
    await solution.focus()
    await page.keyboard.press('Space')
    await expect(solution).toHaveAttribute('aria-expanded', 'false')
    await expect(solution).toBeFocused()
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBe(0)
  })
}

test('default panels and each single open topic fit four screens without exposing answers', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  const measurements: Record<string, number> = {}
  for (const section of sections) {
    await page.goto(`/reference/javascript#${section.id}`, {
      waitUntil: 'networkidle',
    })
    const panel = page.getByRole('tabpanel')
    const measure = async (id: string) => {
      const height = await panel.evaluate(
        (el) => el.getBoundingClientRect().height,
      )
      measurements[id] = Number((height / 768).toFixed(2))
      expect(height, id).toBeLessThanOrEqual(4 * 768)
    }
    await measure(section.id)
    for (const row of section.rows) {
      await openTopic(page, section.id, row.study!.id)
      await measure(`${section.id}/${row.study!.id}`)
      await expect(panel.locator('button[aria-expanded="true"]')).toHaveCount(1)
      await page
        .locator(`button[aria-controls="${prefix(section.id, row.study!.id)}"]`)
        .click()
    }
  }
  console.log('[javascript-panel-screens]', JSON.stringify(measurements))
})
