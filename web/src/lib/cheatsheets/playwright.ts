import { highlightedHtml } from './highlighted.generated'
import type { Cheatsheet, RowExample } from './types'

function withHtml(examples: { label: string; code: string }[]): RowExample[] {
  return examples.map((ex) => ({ ...ex, html: highlightedHtml[ex.code] }))
}

/**
 * A tool-specific companion to `testing`, the same way `git-commands` sits
 * beside `git-branching` rather than folded into one sheet. The gathered
 * source is a three-page series; only page one is displayed (D-89's
 * convention — one plate, the rest consulted and logged in
 * reference/cheatsheet-sources.md), and twelve of its thirteen numbered
 * blocks are condensed into four sections here. "Interview Questions" is
 * left out on purpose — a study-guide format, not lookup material, the same
 * call api-design made on its own doc's exercise-shaped steps.
 */
export const playwright: Cheatsheet = {
  slug: 'playwright',
  title: 'Playwright',
  group: 'Standards',
  stage: '06-testing',
  blurb:
    "Locators, assertions, fixtures and debugging — the API this repo's own e2e suite runs on.",
  source: {
    title: 'Playwright Quick Revision Cheat Sheet',
    author: 'Unrecorded — see reference/cheatsheet-sources.md',
    image: {
      src: '/reference/playwright-1.webp',
      width: 800,
      height: 1200,
      alt: 'A Playwright quick-reference cheat sheet covering locators, assertions, waiting and actions.',
    },
  },
  sections: [
    {
      title: 'Locators & assertions',
      rows: [
        {
          code: 'getByRole()',
          what: 'Finds an element by its ARIA role — the most resilient locator, since it survives markup changes that would break a CSS selector.',
        },
        {
          code: 'getByText() / getByLabel() / getByTestId()',
          what: 'Find by visible text, by label, or by a `data-testid` attribute — reach for these before a raw CSS or XPath selector.',
        },
        {
          code: "page.getByRole('listitem').filter({ hasText: 'Product' }).getByRole('button')",
          what: 'Locator chaining narrows down which of several matching elements you mean.',
        },
        {
          code: 'toBeVisible() / toHaveText() / toContainText()',
          what: 'Web-first assertions — visibility, exact text, and substring match.',
        },
        {
          code: 'toHaveURL() / toHaveTitle() / toHaveCount()',
          what: 'Assert page URL, page title, or the number of matched elements.',
        },
      ],
    },
    {
      title: 'Actions & waiting',
      rows: [
        {
          code: 'click() / fill() / type() / press(key)',
          what: "Click an element, set an input's value, type with real keyboard events, or press a single key.",
        },
        {
          code: 'check() / uncheck() / selectOption() / hover()',
          what: 'Toggle a checkbox, choose a dropdown option, or hover an element.',
        },
        {
          term: 'Auto-waiting',
          what: 'Every action waits for its element to become actionable before running — no manual wait needed for the common case.',
        },
        {
          code: 'waitForURL() / waitForResponse() / waitForLoadState()',
          what: 'Wait for a URL change, a matching network response, or a load state (`domcontentloaded`, `networkidle`).',
        },
        {
          term: 'Avoid waitForTimeout()',
          what: 'A fixed wait is a guess about timing. It is the single most common cause of a flaky test in this API.',
        },
      ],
    },
    {
      title: 'Test structure, fixtures & core concepts',
      rows: [
        {
          code: 'test() / test.describe() / test.beforeEach() / test.afterEach()',
          what: 'Define a test, group related tests, and run setup or teardown around each one.',
        },
        {
          code: 'test.use() / test.extend()',
          what: 'Reusable setup shared across tests via fixtures, rather than repeated in every test body.',
        },
        {
          term: 'Browser → Context → Page',
          what: 'The three-level model: one browser, many isolated contexts (like incognito sessions), each context holding one or more pages.',
          when: 'Every test gets a fresh context by default, which is what makes tests independent of each other without extra setup.',
        },
        {
          term: "This repo's own convention",
          what: 'A test name states the property being checked *and* the reason it matters, so a failure reads as an explanation rather than a label.',
          example: withHtml([
            {
              label: 'e2e/audit.spec.ts',
              code: "test('the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass', async ({ page }) => {\n  // ...\n})",
            },
          ]),
        },
      ],
    },
    {
      title: 'Debugging & CI',
      rows: [
        {
          code: 'npx playwright test --ui',
          what: 'UI mode — an interactive view of every test, step by step, as it runs.',
        },
        {
          code: 'npx playwright test --debug',
          what: 'Step-by-step debugging with the Inspector.',
        },
        {
          code: 'npx playwright show-trace trace.zip',
          what: 'Opens the trace viewer — a full recording of a run, worth more than a screenshot when a test fails only in CI.',
        },
        {
          term: 'CI/CD integration',
          what: 'Run headless, fail fast on the first failure, and collect a trace only on failure rather than on every run.',
          when: "This repo's own audit runs a fresh production build via `webServer`, on a port that stays clear of the dev server (TD-27).",
        },
      ],
    },
  ],
}
