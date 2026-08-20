import { expect, test } from '@playwright/test'
import { auditPages } from './audit-pages'
import { forEachPanelState } from './panel-states'

/**
 * The committed version of the audits that caught eleven bugs while stage 01
 * was built (docs/tracker.md, "Bugs found and fixed"). Four checks: overflow,
 * touch targets, contrast, console. Runs against a production build.
 */

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

// ── overflow ───────────────────────────────────────────────────────────────

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px, because a field manual must never scroll sideways`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of await auditPages(page)) {
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
  for (const path of await auditPages(page)) {
    await page.goto(path, { waitUntil: 'networkidle' })
    // A target that is only reachable behind an accordion is still a target.
    // This check never expanded anything either, which is how a sub-44px
    // <Term> inside a collapsed TeamNotes stayed unmeasured.
    const small: string[] = []
    await forEachPanelState(page, async () => {
      small.push(
        ...(await page.evaluate(() => {
          /** Inline in a sentence: somewhere between the target and the `p` or
           *  `li` holding it, there is running text beside it. `Term` wraps itself
           *  in a span, so the text is a level or two up rather than a direct
           *  sibling — an accordion control never finds any, because its heading
           *  and its row hold nothing but the control. */
          const inlineInSentence = (el: Element) => {
            const sentence = el.closest('p, li')
            if (!sentence) return false
            let node: Element | null = el
            while (node && node !== sentence) {
              const beside = [...(node.parentElement?.childNodes ?? [])].some(
                (n) =>
                  n.nodeType === 3 && (n.textContent ?? '').trim().length > 0,
              )
              if (beside) return true
              node = node.parentElement
            }
            return false
          }

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
                // covers <Term> buttons inside prose, and `li` as well as `p`
                // because a sentence in a list is still a sentence.
                //
                // But "inside a sentence element" is not "inline in a sentence". A
                // bare `p, li` exempted 880 elements to excuse one — including 74
                // accordion controls and 67 exercise radios and checkboxes, which
                // are list-wrapped by construction. That is the same hole the
                // earlier aria-controls exemption had, which this comment used to
                // disown while reproducing it.
                //
                // Role does not separate them either: `Term` is itself a
                // disclosure, so excluding `aria-expanded` re-gates the very
                // buttons this exemption exists for. What actually distinguishes
                // them is whether the control sits *among text* — a `Term` has
                // sentence either side of it, while an accordion control is the
                // only thing its heading or row contains.
                !inlineInSentence(el)
              )
            })
            .map((el) =>
              (el.textContent || el.getAttribute('aria-label') || '?')
                .trim()
                .slice(0, 30),
            )
        })),
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

    for (const path of await auditPages(page)) {
      await page.goto(path, { waitUntil: 'networkidle' })
      // Term definition panels and accordion bodies are surfaces too.
      const rows: {
        fg: number[]
        bg: number[]
        size: number
        weight: number
        sample: string
      }[] = []
      await forEachPanelState(page, async () => {
        rows.push(
          ...(await page.evaluate(() => {
            // This comment used to claim the parser resolved oklab "via the browser
            // itself". It did not — it *rejected* oklab and returned null, so every
            // such colour was skipped rather than checked. Tailwind emits oklab for
            // any alpha colour, so the rule was: add an opacity and leave the audit.
            //
            // Rasterising is the honest version of what the comment promised. Paint
            // the background, paint the colour over it, read the pixel: the browser
            // resolves whatever colour space it likes and composites the alpha in
            // the same step, and what comes back is what the eye receives. It is
            // also the technique TD-16 was originally measured with by hand.
            const raster = (color: string, bg: number[]) => {
              const cv = document.createElement('canvas')
              cv.width = cv.height = 1
              const ctx = cv.getContext('2d', { willReadFrequently: true })!
              ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`
              ctx.fillRect(0, 0, 1, 1)
              const before = ctx.fillStyle
              ctx.fillStyle = color
              // On a colour the browser cannot parse, fillStyle keeps its previous
              // value — which would silently report the background as the
              // foreground and pass at 1:1. Refuse to guess instead.
              if (ctx.fillStyle === before && color !== `rgb(${bg.join(', ')}`)
                return null
              ctx.fillRect(0, 0, 1, 1)
              const d = ctx.getImageData(0, 0, 1, 1).data
              return [d[0], d[1], d[2]]
            }

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

            const bgUnder = (start: Element): number[] | null => {
              let e: Element | null = start
              while (e) {
                const c = parse(getComputedStyle(e).backgroundColor)
                if (c && c.a > 0.5) return c.rgb
                e = e.parentElement
              }
              return null
            }

            // Placeholders are text, and the loop below cannot see them: it keys
            // off `el.textContent`, and an empty field has none. They are also the
            // worst thing to lose, because in this app the placeholder carries the
            // worked example — it shows the reader what a good answer looks like.
            for (const el of document.querySelectorAll('input, textarea')) {
              const ph = (el as HTMLInputElement).placeholder
              if (!ph) continue
              const cs = getComputedStyle(el, '::placeholder')
              const bg = bgUnder(el)
              if (!bg) continue
              const rgb = raster(cs.color, bg)
              if (!rgb) continue
              const key = `ph|${rgb}|${bg}|${Math.round(parseFloat(cs.fontSize))}`
              if (seen.has(key)) continue
              seen.add(key)
              out.push({
                fg: rgb,
                bg,
                size: parseFloat(cs.fontSize),
                weight: parseInt(cs.fontWeight) || 400,
                sample: `placeholder: ${ph.slice(0, 20)}`,
              })
            }
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
              const bg = bgUnder(el)
              if (!bg) continue
              const rgb = raster(cs.color, bg)
              if (!rgb) continue
              const key = `${rgb}|${bg}|${Math.round(parseFloat(cs.fontSize))}`
              if (seen.has(key)) continue
              seen.add(key)
              out.push({
                fg: rgb,
                bg,
                size: parseFloat(cs.fontSize),
                weight: parseInt(cs.fontWeight) || 400,
                sample: t.slice(0, 24),
              })
            }
            return out
          })),
        )
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

// ── the test of the test ───────────────────────────────────────────────────

/**
 * TD-26.
 *
 * The contrast gate spent three stages measuring one surface per stage while
 * reporting a clean pass. It opened expandables by clicking every
 * `button[aria-controls]`, and `Stepper` puts that attribute on all the rail
 * tabs, so the loop walked the rail and unmounted the panel it was about to
 * measure. Nothing noticed, because a sweep that opens nothing produces exactly
 * the green a sweep that opens everything and finds no failures produces.
 *
 * TD-26's entry asks for a pinned count on a known page. That was rejected on
 * this repo's own evidence: `count-expandables.mjs` records 108 on 2026-08-03
 * and 140 on 2026-08-13 with no defect in between, and says in its header that
 * the number is not a constant to assert against. A pinned count stales the way
 * a step name in prose stales, and it stales silently.
 *
 * The property does not stale. Every disclosure the panel renders must be
 * observed open in at least one state, however many of them there are.
 */
test('the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass', async ({
  page,
}) => {
  const gaps: string[] = []
  let observedTotal = 0

  for (const path of await auditPages(page)) {
    await page.goto(path, { waitUntil: 'networkidle' })
    const { all, observed } = await forEachPanelState(page, async () => {})
    observedTotal += observed.length
    const missed = all.filter((key) => !observed.includes(key))
    if (missed.length) gaps.push(`${path}: ${missed.join(', ')}`)
  }

  // The gap check alone is vacuous under the failure it exists to catch. Null
  // the sweep's selector and `all` is empty on every page, so nothing is
  // missing and the test passes having observed nothing — the same shape as the
  // bug, reproduced inside its own regression test. This floor is what notices.
  //
  // A floor, deliberately, not a count. `count-expandables.mjs` measured 191
  // opens over 144 ids the day this landed and the entry it closes records the
  // figure moving 108 to 140 in ten days with no defect in between. Fifty is far
  // enough below to never stale upward and far enough above zero to fail the
  // moment the sweep stops seeing disclosures.
  expect(observedTotal).toBeGreaterThan(50)
  expect(gaps, gaps.join('\n')).toEqual([])
})

// ── console ────────────────────────────────────────────────────────────────

/**
 * **What this test cannot see, which is most of what you would want it to.**
 * It runs against a *production* build (`playwright.config.ts` builds and
 * serves rather than reusing `pnpm dev`, because the dev overlay pollutes the
 * console and the dev server renders differently). React strips its
 * development-mode validation from a production build, so this whole family is
 * invisible here: missing-key warnings, invalid DOM nesting, `act()` warnings,
 * hydration-mismatch detail, prop-type complaints. A green run says nothing
 * about any of them.
 *
 * Not hypothetical. `RevealList` logged *Each child in a list should have a
 * unique "key" prop* on every `pnpm dev` load of `#ai` from `1772555` to
 * `f1a23e7`, and then on `#tenancy`, `#trace` and `#indexes` for the rest of
 * the branch, while this test reported 14/14 throughout. Both times it was
 * found by someone opening the dev server for an unrelated reason.
 *
 * Two things a manual dev check needs to know. The warning is attributed to
 * the *rendering* component (`Card`), not the one holding the defect — which
 * is why grepping for the named component finds nothing. And the check has one
 * narrow blind spot: Fast Refresh patching an already-open tab does not fire
 * it, and a reload issued a second or two after saving can race the rebuild
 * and read clean. Reload once the rebuild has settled, or restart, and it
 * fires reliably. Measured across three cold-server runs while closing this:
 * no-reload patching stayed silent every time; a settled reload warned every
 * time.
 *
 * The real reason both instances survived is duller and worth more: every
 * manual check loaded one page. `#ai` exercises neither `header` nor `footer`,
 * so it passed while three other steps warned.
 *
 * Tracked as **TD-35**. Closing it means a second, narrow spec against
 * `pnpm dev` that filters for React's own warning prefixes; this comment is
 * the interim, and TD-35 asks for it by name.
 */
test('zero console errors across every page and step', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 120)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text().slice(0, 120))
  })
  for (const path of await auditPages(page)) {
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
 * A hash that names no step does not error — it falls back to the first panel.
 * So a suite sweeping stale hashes stays green while auditing step one twice
 * and never touching the steps that were added. Not hypothetical: the stage 03
 * entries listed `#constrain` and `#decide` for weeks after both steps had
 * been renamed away, which meant five of its nine steps had never been audited
 * at all.
 *
 * The list is now derived from the rendered rail (`audit-pages.ts`, TD-12), so
 * a hash cannot go stale in that direction any more — it comes from the step
 * that rendered it. This test stays because the fallback behaviour it names is
 * still real, and because a derivation is worth a check that its output lands
 * where it claims rather than being trusted for being generated.
 */
test('every listed step hash lands on the step it names, since a dead hash falls back and audits step one twice', async ({
  page,
}) => {
  for (const path of (await auditPages(page)).filter((p) => p.includes('#'))) {
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

  for (const path of (await auditPages(page)).filter((p) => p.includes('#'))) {
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
