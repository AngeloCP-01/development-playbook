import { expect, test } from '@playwright/test'

/**
 * The committed version of the audits that caught eleven bugs while stage 01
 * was built (docs/tracker.md, "Bugs found and fixed"). Four checks: overflow,
 * touch targets, contrast, console. Runs against a production build.
 */

const PAGES = [
  '/',
  '/stages/01-product-discovery#frame',
  '/stages/01-product-discovery#research',
  '/stages/01-product-discovery#ai',
  '/stages/01-product-discovery#talk',
  '/stages/01-product-discovery#decide',
  '/stages/01-product-discovery#record',
  '/stages/02-planning#done',
  '/stages/02-planning#cut',
  '/stages/02-planning#sequence',
  '/stages/02-planning#size',
  '/stages/02-planning#ai',
  '/stages/02-planning#write',
  '/stages/02-planning#horizon',
  '/stages/03-architecture#reverse',
  '/stages/03-architecture#require',
  '/stages/03-architecture#trace',
  '/stages/03-architecture#model',
  '/stages/03-architecture#worksheet',
  '/stages/03-architecture#shape',
  '/stages/03-architecture#oneapp',
  '/stages/03-architecture#boundaries',
  '/stages/03-architecture#sketch',
  '/stages/03-architecture#flow',
  '/stages/03-architecture#resilience',
  '/stages/03-architecture#schema',
  '/stages/03-architecture#indexes',
  '/stages/03-architecture#tenancy',
  '/stages/03-architecture#concurrency',
  '/stages/03-architecture#races',
  '/stages/03-architecture#evolve',
  '/stages/03-architecture#contract',
  '/stages/03-architecture#access',
  '/stages/03-architecture#record',
  '/stages/03-architecture#ai',
  '/stages/03-architecture#traps',
]

const WIDTHS = [320, 768, 1024, 1440, 2560]

// ── helpers ────────────────────────────────────────────────────────────────

function luminance([r, g, b]: number[]) {
  const lin = (c: number) => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Open every expandable inside the current step panel, so the checks below see
 * revealed surfaces rather than the collapsed shell.
 *
 * This used to be one line — `button[aria-controls]`, clicked in a single
 * `forEach`. Two things were wrong with it. `Stepper` puts `aria-controls` on
 * all 22 rail tabs and the rail precedes the panel in DOM order, so the loop
 * walked the tabs first; each tab click unmounted the panel, and the accordion
 * buttons captured in the static NodeList were detached before the loop reached
 * them. Measured on `#trace`: 11 expandables before the loop, 0 opened, and the
 * page left sitting on `#traps`. Across the 36 entries the sweep opened five
 * expandables in total.
 *
 * So: scoped to `[role=tabpanel]`, which excludes the rail; re-queried between
 * passes, because a click that opens an accordion reveals more of them; and
 * marked, because clicking a closed button in a single-open group closes its
 * sibling and an unmarked re-query oscillates instead of terminating. The pass
 * cap is a backstop, not the exit condition.
 *
 * After: 108 expandables opened, and the contrast sweep collects 867 distinct
 * colour pairs against 717.
 */
async function openExpandables(page: import('@playwright/test').Page) {
  for (let pass = 0; pass < 6; pass++) {
    const opened = await page.evaluate(() => {
      const closed = [
        ...document.querySelectorAll<HTMLButtonElement>(
          '[role=tabpanel] button[aria-expanded="false"]:not([data-audit-opened])',
        ),
      ]
      for (const b of closed) {
        b.setAttribute('data-audit-opened', '')
        b.click()
      }
      return closed.length
    })
    if (!opened) return
    await page.waitForTimeout(60)
  }
}

// ── overflow ───────────────────────────────────────────────────────────────

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px, because a field manual must never scroll sideways`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      const overflow = await page.evaluate(() => {
        const de = document.documentElement
        return de.scrollWidth - de.clientWidth
      })
      expect(overflow, `${path} @ ${width}px`).toBe(0)
    }
  })
}

// ── touch targets ──────────────────────────────────────────────────────────

test('interactive elements are at least 44px tall below lg', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
    // A target that is only reachable behind an accordion is still a target.
    // This check never expanded anything either, which is how a sub-44px
    // <Term> inside a collapsed TeamNotes stayed unmeasured.
    await openExpandables(page)
    const small = await page.evaluate(() => {
      const inScroller = (el: Element) => {
        let e = el.parentElement
        while (e) {
          const o = getComputedStyle(e).overflowX
          if (o === 'auto' || o === 'scroll') return true
          e = e.parentElement
        }
        return false
      }
      return [
        ...document.querySelectorAll(
          'a,button,[role=tab],[role=radio],textarea',
        ),
      ]
        .filter((el) => {
          const b = el.getBoundingClientRect()
          return (
            b.width > 0 &&
            b.height > 0 &&
            b.height < 44 &&
            !String(el.className).includes('sr-only') &&
            !inScroller(el) &&
            // WCAG 2.5.8 exempts targets sitting inline in a sentence — their
            // size is constrained by the surrounding text's line-height. This
            // covers <Term> buttons inside prose. The earlier ad-hoc sweep
            // masked these by excluding aria-controls wholesale, which would
            // also have exempted accordions; this exemption is the honest one.
            // `li` as well as `p`: a sentence in a list is still a sentence,
            // and the check only started meeting those once it began expanding
            // the accordions that hold them.
            !el.closest('p, li')
          )
        })
        .map((el) =>
          (el.textContent || el.getAttribute('aria-label') || '?')
            .trim()
            .slice(0, 30),
        )
    })
    expect(small, `${path}: ${small.join(', ')}`).toEqual([])
  }
})

// ── contrast ───────────────────────────────────────────────────────────────

for (const scheme of ['light', 'dark'] as const) {
  test(`every text/background pair passes WCAG AA in ${scheme} mode`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: scheme })
    const page = await context.newPage()
    const failures: string[] = []

    for (const path of PAGES) {
      await page.goto(path, { waitUntil: 'networkidle' })
      // Term definition panels and accordion bodies are surfaces too.
      await openExpandables(page)
      await page.waitForTimeout(150)

      const rows = await page.evaluate(() => {
        // Resolve any CSS colour (incl. oklab) to rgb via the browser itself —
        // regex-parsing oklab() produced a false 1.34:1 once. See
        // docs/learnings/stage-implementation-101.md.
        const parse = (c: string) => {
          const m = (c.match(/-?[\d.]+/g) || []).map(Number)
          return m.length >= 3 && !/okl|lab|lch/.test(c)
            ? { rgb: m.slice(0, 3), a: m[3] ?? 1 }
            : null
        }
        const out: {
          fg: number[]
          bg: number[]
          size: number
          weight: number
          sample: string
        }[] = []
        const seen = new Set<string>()
        for (const el of document.querySelectorAll('*')) {
          const t = el.textContent?.trim()
          if (!t || t.length < 3 || el.children.length) continue
          const cs = getComputedStyle(el)
          if (
            cs.visibility === 'hidden' ||
            cs.display === 'none' ||
            +cs.opacity < 0.5
          )
            continue
          const fg = parse(cs.color)
          if (!fg) continue
          let e: Element | null = el
          let bg: number[] | null = null
          while (e) {
            const c = parse(getComputedStyle(e).backgroundColor)
            if (c && c.a > 0.5) {
              bg = c.rgb
              break
            }
            e = e.parentElement
          }
          if (!bg) continue
          const key = `${fg.rgb}|${bg}|${Math.round(parseFloat(cs.fontSize))}`
          if (seen.has(key)) continue
          seen.add(key)
          out.push({
            fg: fg.rgb,
            bg,
            size: parseFloat(cs.fontSize),
            weight: parseInt(cs.fontWeight) || 400,
            sample: t.slice(0, 24),
          })
        }
        return out
      })

      for (const r of rows) {
        const large = r.size >= 24 || (r.size >= 18.66 && r.weight >= 700)
        const need = large ? 3 : 4.5
        const got = ratio(r.fg, r.bg)
        if (got < need)
          failures.push(
            `${path} ${got.toFixed(2)}:1 (need ${need}) @${Math.round(r.size)}px "${r.sample}"`,
          )
      }
    }

    await context.close()
    expect(failures, failures.join('\n')).toEqual([])
  })
}

// ── console ────────────────────────────────────────────────────────────────

test('zero console errors across every page and step', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 120))
  })
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
  }
  await context.close()
  expect(errors, errors.join('\n')).toEqual([])
})

// ── stage 03: the reasoning survives a wrong answer ────────────────────────

/**
 * `judgeInterrogation` returns `why` on both correct and incorrect answers, and
 * `scoring.test.ts` holds it to that at the module level. Nothing held
 * `ModelInterrogation` to actually rendering it, so gating the paragraph on
 * `correct` would pass lint, typecheck, every unit test and the rest of this
 * suite — while quietly hiding the lesson from exactly the readers who needed
 * it. This is the assertion that notices.
 */
test('the interrogation still explains itself after a wrong answer, since the reasoning is the lesson and not the reward', async ({
  page,
}) => {
  await page.goto('/stages/03-architecture#model', { waitUntil: 'networkidle' })

  const row = page.locator('li').filter({
    has: page.getByRole('radiogroup', {
      name: /a status, or a computed value/,
    }),
  })

  await row
    .getByRole('radio', { name: 'A stored status, updated when it changes' })
    .click()

  await expect(row.getByText('Not quite')).toBeVisible()

  // Two paragraphs in the verdict block: the headline, then the reasoning.
  // Gating the reasoning on `correct` leaves one, which is the regression.
  const paragraphs = row.locator('[aria-live="polite"] p')
  await expect(paragraphs).toHaveCount(2)

  const why = paragraphs.last()
  await expect(why).toBeVisible()
  await expect(why).not.toContainText('Not quite')
  expect((await why.innerText()).trim().length).toBeGreaterThan(80)
})

/**
 * The same contract, on the exercise most likely to lose it. `#races` exists to
 * be answered wrong — a reader who has just met optimistic locking picks it for
 * the cross-row case — so a regression that shows the reasoning only on a
 * correct answer would remove the teaching from precisely the reader it was
 * written for. The check above covered `#model` alone, which is why this is a
 * second test rather than a wider selector: the two exercises are different
 * components and the shared rule is the thing being asserted.
 */
test('the locking exercise explains itself after a wrong answer too, since its wrong answer is the one the step was built for', async ({
  page,
}) => {
  await page.goto('/stages/03-architecture#races', { waitUntil: 'networkidle' })

  const row = page.locator('li').filter({
    has: page.getByRole('radiogroup', {
      name: /two different claims on the same shift/,
    }),
  })

  await row.getByRole('radio', { name: 'Optimistic locking' }).click()

  await expect(row.getByText('Not quite')).toBeVisible()

  const paragraphs = row.locator('[aria-live="polite"] p')
  await expect(paragraphs).toHaveCount(2)

  const why = paragraphs.last()
  await expect(why).toBeVisible()
  await expect(why).toContainText('constraint')
  expect((await why.innerText()).trim().length).toBeGreaterThan(80)
})

/**
 * `AuthzPatterns` keeps the multi-answer scenarios' uncommitted selection in a
 * second piece of state, so Reset has two things to clear and cleared one. The
 * visible result is a group that reports itself unanswered — no score line, the
 * Commit button back — with two boxes still `aria-checked="true"`, which is a
 * lie to a screen reader as well as a stale tick on the page.
 */
test('reset clears the uncommitted draft as well as the committed answers, since a group that presents itself as unanswered must not have boxes ticked', async ({
  page,
}) => {
  await page.goto('/stages/03-architecture#access', {
    waitUntil: 'networkidle',
  })

  const multi = page.locator('li').filter({
    has: page.getByRole('group', { name: /Select both patterns/ }),
  })
  const role = multi.getByRole('checkbox', { name: 'Role', exact: true })
  const membership = multi.getByRole('checkbox', {
    name: 'Membership',
    exact: true,
  })

  await role.click()
  await membership.click()
  await expect(role).toHaveAttribute('aria-checked', 'true')

  // A different scenario, committed, is what puts Reset on screen — the draft
  // above is deliberately still uncommitted when it is pressed.
  await page
    .locator('li')
    .filter({
      has: page.getByRole('radiogroup', { name: /own draft invoice/ }),
    })
    .getByRole('radio', { name: 'Ownership', exact: true })
    .click()

  await page.getByRole('button', { name: 'Reset' }).click()

  await expect(role).toHaveAttribute('aria-checked', 'false')
  await expect(membership).toHaveAttribute('aria-checked', 'false')
})

// ── the audit list audits what it claims to ────────────────────────────────

/**
 * `PAGES` is hand-written (TD-12), and its failure mode is silent: a hash that
 * names no step does not error, it falls back to the first panel. So the suite
 * stays green while auditing step one twice and never touching the steps that
 * were added. That is not hypothetical — the stage 03 entries listed
 * `#constrain` and `#decide` for weeks after both steps had been renamed away,
 * which meant five of its nine steps had never been audited at all.
 *
 * This does not close TD-12; the list is still hand-maintained and forgetting
 * to add a step still audits nothing. It closes the half that lies.
 */
test('every listed step hash lands on the step it names, since a dead hash falls back and audits step one twice', async ({
  page,
}) => {
  for (const path of PAGES.filter((p) => p.includes('#'))) {
    const id = path.split('#')[1]
    await page.goto(path, { waitUntil: 'networkidle' })
    await expect(
      page.locator(`#panel-${id}`),
      `${path} does not resolve to a step called "${id}"`,
    ).toBeVisible()
  }
})

// ── D-52: a step holds one judgment, and its panel is not a scroll ─────────

/**
 * D-38 capped a dense stage at five content steps. Its stated reason was that
 * "a stepper stops being navigable when a step is a scroll" — a claim about
 * how much one panel holds, enforced by counting a different noun. The two
 * pull opposite ways: fewer steps for the same content means heavier panels.
 * Measured, stage 03's median panel was 5.3 screens against 2.4 and 2.5 for
 * stages 01 and 02, while sitting inside a rule that only knew about counts.
 *
 * Four screens is taken from the measurements: 01 and 02 both have a
 * next-heaviest panel at 3.2, so the threshold clears everything either stage
 * has except one panel each.
 */
const PANEL_VIEWPORT = { width: 1024, height: 768 }
const PANEL_SCREENS_MAX = 4.0

/**
 * Baselined, not exempt. Every entry is a panel the rule would fail, recorded
 * with a reason so the exemption is a decision rather than an oversight.
 *
 * Stage 01 and 02's two are permanent for now: splitting them changes step
 * hashes and reopens two reviewed stages. The rule applies to them the moment
 * either is edited.
 *
 * Stage 03's are temporary debt, removed one at a time by the task that splits
 * each panel. When this list is down to two entries, the reshape is done.
 */
const PANEL_EXCEPTIONS: Record<string, number> = {
  '/stages/01-product-discovery#record': 6.7, // artifact gallery, one page by design
  '/stages/02-planning#horizon': 5.6, // three horizon bands, compared side by side

  // Temporary — D-52's reshape removes these.
  // See docs/superpowers/plans/2026-07-31-step-panel-weight.md
}

/** Tolerance on the re-baseline check: panel height moves slightly with font
 *  loading and scrollbar width, and a rule that fires on noise gets suppressed. */
const REBASELINE_SLACK = 0.5

test('no step panel exceeds four screens, because a step that is a scroll is two steps', async ({
  page,
}) => {
  await page.setViewportSize(PANEL_VIEWPORT)
  const failures: string[] = []

  for (const path of PAGES.filter((p) => p.includes('#'))) {
    const id = path.split('#')[1]
    await page.goto(path, { waitUntil: 'networkidle' })
    const height = await page
      .locator(`#panel-${id}`)
      .evaluate((el) => el.getBoundingClientRect().height)
    const screens = height / PANEL_VIEWPORT.height
    const baseline = PANEL_EXCEPTIONS[path]

    if (baseline === undefined) {
      if (screens > PANEL_SCREENS_MAX) {
        failures.push(
          `${path} is ${screens.toFixed(1)} screens, over the ${PANEL_SCREENS_MAX} limit. ` +
            `Split it at a seam where the panel holds two judgments, or move elaboration ` +
            `behind an expand-to-reveal (D-52).`,
        )
      }
      continue
    }

    // A baselined panel that got better must say so, or the allowlist rots
    // upward and becomes what D-38 was: a number nothing enforces.
    if (screens < baseline - REBASELINE_SLACK) {
      failures.push(
        `${path} is now ${screens.toFixed(1)} screens against a baseline of ${baseline}. ` +
          `Lower it in PANEL_EXCEPTIONS, or delete the entry if it is under ${PANEL_SCREENS_MAX}.`,
      )
    }

    // And a baselined panel that got worse must say so too. Without this the
    // exemption is unbounded: the over-threshold check above only runs for
    // panels with no entry, so a baselined panel could grow from 6 screens to
    // 12 and stay green. The first review of this test caught that the
    // mitigation was one-sided — an allowlist that cannot rot upward past its
    // own number still has to not rot upward past the number it records.
    if (screens > baseline + REBASELINE_SLACK) {
      failures.push(
        `${path} has grown to ${screens.toFixed(1)} screens against a baseline of ${baseline}. ` +
          `A baselined panel is exempt from the ${PANEL_SCREENS_MAX} limit, not from review — ` +
          `split it, or raise the baseline deliberately and say why.`,
      )
    }
  }

  expect(failures.join('\n')).toBe('')
})
