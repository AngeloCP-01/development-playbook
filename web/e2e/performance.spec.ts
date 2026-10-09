import { expect, test } from '@playwright/test'
import { PERFORMANCE_KEY } from '../src/lib/performance-sheet'

const STAGE = '/stages/09-performance-optimization'

test('performance choices use native radio keys and keep the first committed answer', async ({
  page,
}) => {
  await page.goto(`${STAGE}#baseline`, { waitUntil: 'networkidle' })
  const panel = page.locator('#panel-baseline')
  const radios = panel.getByRole('radio')
  await expect(radios).toHaveCount(2)
  await radios.nth(0).focus()
  await radios.nth(0).press('Space')
  await expect(radios.nth(0)).toBeChecked()
  await radios.nth(0).press('ArrowDown')
  await expect(radios.nth(1)).toBeChecked()
  const box = await radios.nth(1).boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(44)
  await panel.getByRole('button', { name: 'Commit measurement' }).click()
  await expect(radios.nth(0)).toBeDisabled()
  await expect(radios.nth(1)).toBeDisabled()
  await expect(
    panel.getByText(/Server route duration is diagnostic/),
  ).toBeVisible()
  await expect(panel.getByText('0 of 1 choices correct')).toBeVisible()
})

test('performance worksheets support direct links, Back and reload with long literal input in both themes', async ({
  page,
}) => {
  const literal =
    '<script>window.__performanceExecuted = true</script>' + 'x'.repeat(600)
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`${STAGE}#record`, { waitUntil: 'networkidle' })
    await page.evaluate(
      ({ key, themeName }) => {
        localStorage.removeItem(key)
        localStorage.setItem('playbook:theme', JSON.stringify(themeName))
      },
      { key: PERFORMANCE_KEY, themeName: theme },
    )
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await page.getByLabel('Outcome and observer', { exact: true }).fill(literal)
    await page.locator('#tab-followup').click()
    await expect(page.locator('#panel-followup')).toBeVisible()
    await page
      .getByLabel('Verdict and open gap', { exact: true })
      .fill('More field evidence required')
    await page.goBack({ waitUntil: 'networkidle' })
    await expect(page.locator('#panel-record')).toBeVisible()
    await expect(
      page.getByLabel('Outcome and observer', { exact: true }),
    ).toHaveValue(literal)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(
      page.getByLabel('Outcome and observer', { exact: true }),
    ).toHaveValue(literal)
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 900 })
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true)
    }
    expect(
      await page.evaluate(() => Reflect.get(window, '__performanceExecuted')),
    ).toBeUndefined()
    const saved = await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!),
      PERFORMANCE_KEY,
    )
    expect(saved.outcome).toBe(literal)
    expect(saved.verdict).toBe('More field evidence required')
  }
})

test('permission failures retain the worksheet and offer manual export with zero page errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript((key) => {
    const originalRead = Storage.prototype.getItem
    const originalWrite = Storage.prototype.setItem
    Storage.prototype.getItem = function (name) {
      if (name === key)
        throw new DOMException('Storage denied', 'SecurityError')
      return originalRead.call(this, name)
    }
    Storage.prototype.setItem = function (name, value) {
      if (name === key)
        throw new DOMException('Storage denied', 'QuotaExceededError')
      return originalWrite.call(this, name, value)
    }
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          Promise.reject(
            new DOMException('Clipboard denied', 'NotAllowedError'),
          ),
      },
    })
  }, PERFORMANCE_KEY)
  const measureState = async (
    id: 'save-denied' | 'copy-denied',
    theme: 'light' | 'dark',
  ) => {
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 768 })
      const measurement = await page.evaluate(
        ({ state, theme, width }) => {
          const panel = document.getElementById('panel-record')
          if (!panel)
            throw new Error('The denied-state worksheet panel is missing')
          const warning = [...panel.querySelectorAll('p')].find((element) =>
            element.textContent?.includes('Saving is unavailable'),
          )
          const status = panel.querySelector(
            '[role="status"][aria-label="Copy status"]',
          )
          const manual = panel.querySelector('textarea[readonly]')
          const labels = [...panel.querySelectorAll('label')]
          const outcome = labels.find(
            (label) => label.textContent?.trim() === 'Outcome and observer',
          )?.control
          const scope = labels.find(
            (label) => label.textContent?.trim() === 'Scope',
          )?.control
          const observed =
            state === 'copy-denied'
              ? ([
                  ['save-warning', warning],
                  ['copy-status', status],
                  ['manual-markdown', manual],
                ] as const)
              : ([
                  ['save-warning', warning],
                  ['draft-outcome', outcome],
                  ['draft-scope', scope],
                ] as const)
          const pairs = observed.map(([pairId, element]) => {
            if (!element)
              throw new Error(`Missing denied-state contrast target: ${pairId}`)
            const sample =
              element instanceof HTMLTextAreaElement
                ? element.value
                : (element.textContent?.trim() ?? '')
            if (!sample)
              throw new Error(`Empty denied-state contrast target: ${pairId}`)
            const style = getComputedStyle(element)
            const bgs: string[] = []
            let ancestor: Element | null = element
            while (ancestor) {
              bgs.push(getComputedStyle(ancestor).backgroundColor)
              ancestor = ancestor.parentElement
            }
            return {
              id: pairId,
              fg: style.color,
              bgs,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              sample: sample.slice(0, 160),
            }
          })
          const smallTargets = [
            ...panel.querySelectorAll('button, textarea, input, select'),
          ]
            .map((element) => ({
              id: element.id || element.textContent?.trim() || element.tagName,
              width: element.getBoundingClientRect().width,
              height: element.getBoundingClientRect().height,
            }))
            .filter(
              (target) =>
                target.width > 0 &&
                target.height > 0 &&
                (target.width < 44 || target.height < 44),
            )
          return {
            theme,
            width,
            id: panel.id,
            state,
            height: panel.getBoundingClientRect().height,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            pairs,
            smallTargets,
          }
        },
        { state: id, theme, width },
      )
      console.log('PERFORMANCE_PERMISSION_STATE ' + JSON.stringify(measurement))
      expect(measurement.overflow, `${theme}/${width}/${id} overflow`).toBe(
        false,
      )
      expect(measurement.pairs).toHaveLength(3)
      if (width < 1024) expect(measurement.smallTargets).toEqual([])
      if (width === 1024)
        expect(measurement.height).toBeLessThanOrEqual(4 * 768)
    }
  }
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`${STAGE}#record`, { waitUntil: 'networkidle' })
    await page.evaluate((themeName) => {
      localStorage.setItem('playbook:theme', JSON.stringify(themeName))
    }, theme)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await page
      .getByLabel('Outcome and observer', { exact: true })
      .fill('Unsaved observer and outcome')
    await page.getByLabel('Scope', { exact: true }).fill('Unsaved scope')
    await expect(
      page.getByLabel('Outcome and observer', { exact: true }),
    ).toHaveValue('Unsaved observer and outcome')
    await expect(page.getByText(/Saving is unavailable/)).toBeVisible()
    await measureState('save-denied', theme)
    await page.getByRole('button', { name: 'Copy as Markdown' }).click()
    await expect(
      page.getByLabel('Markdown record', { exact: true }),
    ).toHaveValue(/Unsaved observer and outcome[\s\S]*Unsaved scope/)
    await expect(
      page.getByRole('status', { name: 'Copy status' }),
    ).toContainText('Copy is unavailable')
    await measureState('copy-denied', theme)
  }
  expect(errors).toEqual([])
})

test('an internal improvement requires more observation rather than a production win', async ({
  page,
}) => {
  await page.goto(`${STAGE}#compare`, { waitUntil: 'networkidle' })
  const panel = page.locator('#panel-compare')
  await expect(
    panel.getByRole('table', { name: 'Before and after evidence' }),
  ).toContainText('Browser p95 and its sample are not recorded')
  await panel
    .getByRole('radio', {
      name: 'Stop this optimization pass and observe the outcome',
    })
    .check()
  await panel.getByRole('button', { name: 'Commit decision' }).click()
  await expect(panel.getByText('Needs correction')).toBeVisible()
  await expect(
    panel.getByText(/before claiming a production win/),
  ).toBeVisible()
})

test('an open glossary definition stays inside every viewport after resizing in both themes', async ({
  page,
}) => {
  const failures: string[] = []
  for (const theme of ['light', 'dark'] as const) {
    await page.setViewportSize({ width: 2560, height: 768 })
    await page.goto(`${STAGE}#target`, { waitUntil: 'networkidle' })
    await page.evaluate((themeName) => {
      localStorage.setItem('playbook:theme', JSON.stringify(themeName))
    }, theme)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await page
      .getByRole('button', { name: 'Cumulative Layout Shift', exact: true })
      .click()
    const note = page.locator('#panel-target').getByRole('note')
    await expect(note).toBeVisible()
    for (const width of [2560, 768, 1024, 320, 390, 1440, 1920]) {
      await page.setViewportSize({ width, height: 768 })
      const geometry = await note.evaluate(async (element) => {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        )
        const rect = element.getBoundingClientRect()
        return {
          left: rect.left,
          right: rect.right,
          overflow: document.documentElement.scrollWidth - innerWidth,
        }
      })
      console.log(
        'PERFORMANCE_GLOSSARY_RESIZE ' +
          JSON.stringify({ theme, width, ...geometry }),
      )
      if (
        geometry.left < -1 ||
        geometry.right > width + 1 ||
        geometry.overflow > 1
      ) {
        failures.push(`${theme}/${width}: ${JSON.stringify(geometry)}`)
      }
      await expect(note).toBeVisible()
      await expect(
        page.getByRole('button', {
          name: 'Cumulative Layout Shift',
          exact: true,
        }),
      ).toHaveAttribute('aria-expanded', 'true')
    }
  }
  expect(failures, failures.join('\n')).toEqual([])
})

test('each performance judgment starts fresh after switching from completed drills in both themes', async ({
  page,
}) => {
  const failures: string[] = []
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(`${STAGE}#bottleneck`, { waitUntil: 'networkidle' })
    await page.evaluate((themeName) => {
      localStorage.setItem('playbook:theme', JSON.stringify(themeName))
    }, theme)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    const bottleneck = page.locator('#panel-bottleneck')
    await bottleneck
      .getByRole('radio', {
        name: 'Batch the availability lookup and preserve the stock decision',
        exact: true,
      })
      .check()
    await bottleneck
      .getByRole('button', { name: 'Commit decision', exact: true })
      .click()
    await bottleneck
      .getByRole('button', { name: 'Next case', exact: true })
      .click()
    await bottleneck
      .getByRole('radio', {
        name: 'Define the user clock and collect baseline and diagnostic evidence',
        exact: true,
      })
      .check()
    await bottleneck
      .getByRole('button', { name: 'Commit decision', exact: true })
      .click()
    await expect(
      bottleneck.getByText('2 of 2 decisions correct', { exact: true }),
    ).toBeVisible()

    const fresh = async (id: 'query' | 'bottleneck', from: string) => {
      await page.locator(`#tab-${id}`).click()
      const panel = page.locator(`#panel-${id}`)
      await expect(panel).toBeVisible()
      const state = await panel.evaluate((element) => {
        const commit = [...element.querySelectorAll('button')].find(
          (button) => button.textContent?.trim() === 'Commit decision',
        )
        return {
          prompt: element.querySelector('legend')?.textContent?.trim() ?? '',
          results: [...element.querySelectorAll('p[aria-live="polite"]')]
            .map((result) => result.textContent?.trim() ?? '')
            .filter(Boolean),
          selected: element.querySelectorAll('input[type="radio"]:checked')
            .length,
          commitDisabled: commit?.disabled ?? null,
        }
      })
      console.log(
        'PERFORMANCE_DRILL_RESET ' +
          JSON.stringify({ theme, id, from, ...state }),
      )
      const first =
        id === 'query'
          ? 'A small inventory table uses a sequential scan.'
          : 'A controlled 20-item cart shows 21 inventory queries.'
      if (
        !state.prompt.startsWith(first) ||
        state.results.length !== 0 ||
        state.selected !== 0 ||
        state.commitDisabled !== true
      ) {
        failures.push(`${theme}/${id}/${from}: ${JSON.stringify(state)}`)
      }
    }
    await fresh('query', 'completed-bottleneck')
    await fresh('bottleneck', 'return-from-query')
    await page.locator('#tab-compare').click()
    const compare = page.locator('#panel-compare')
    await compare
      .getByRole('button', { name: 'Reset decisions', exact: true })
      .click()
    const answers = [
      'Collect the missing user-outcome evidence',
      'Repeat with a comparable scope and population',
      'Stop this optimization pass and observe the outcome',
      'Investigate or revert the harmful change',
    ]
    for (const [index, answer] of answers.entries()) {
      await compare.getByRole('radio', { name: answer, exact: true }).check()
      await compare
        .getByRole('button', { name: 'Commit decision', exact: true })
        .click()
      if (index < answers.length - 1)
        await compare
          .getByRole('button', { name: 'Next case', exact: true })
          .click()
    }
    await expect(
      compare.getByText('4 of 4 decisions correct', { exact: true }),
    ).toBeVisible()
    await fresh('query', 'completed-comparison')
    await fresh('bottleneck', 'completed-comparison-via-query')
  }
  expect(failures, failures.join('\n')).toEqual([])
})
