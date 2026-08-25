import { createHighlighter, type ThemeRegistrationRaw } from 'shiki'

/**
 * Server-only. Every caller is a top-level `await` inside a cheatsheet data
 * module (`solid-principles.ts`, `clean-code.ts`), which runs once at module
 * evaluation and bakes the HTML into `RowExample.html` — the highlighter never
 * runs in the render path, and nothing here ships to the client.
 *
 * Four roles, not a full TextMate scope list — this app's own restraint rule
 * (`accent means attention, semantic colours carry meaning and nothing else`,
 * `web/DESIGN.md`) ruled out reusing `signal`/`go`/`stop`/`warn` for plain
 * syntax colour, so only one token is new (`--syntax-string`); the rest reuse
 * `ink`, `blueprint` and `faint`, verified ≥4.5:1 against `--sunk` in both
 * themes — the actual background these blocks render on, not the
 * general-purpose surface DESIGN.md's other tokens were checked against.
 */

const KEYWORD = [
  'keyword',
  'keyword.control',
  'keyword.operator.new',
  'storage.type',
  'storage.modifier',
]
const STRING = ['string', 'string.quoted']
const COMMENT = ['comment']
const TYPE = [
  'entity.name.type',
  'entity.name.class',
  'entity.other.inherited-class',
  'support.type',
  'support.class',
]

// One `settings` list per theme, both pointed at the same four roles — the
// pattern DESIGN.md's own token pairs use (same hue, different lightness),
// not a separately-designed dark theme.
const playbookLight: ThemeRegistrationRaw = {
  name: 'playbook-light',
  type: 'light',
  settings: [
    { settings: { foreground: '#10243e' } }, // default: --ink
    { scope: KEYWORD, settings: { foreground: '#23508f' } }, // --blueprint
    { scope: STRING, settings: { foreground: '#5d5a14' } }, // --syntax-string
    {
      scope: COMMENT,
      settings: { foreground: '#556377', fontStyle: 'italic' },
    }, // --faint
    { scope: TYPE, settings: { foreground: '#10243e', fontStyle: 'bold' } }, // --ink, weight only
  ],
}

const playbookDark: ThemeRegistrationRaw = {
  name: 'playbook-dark',
  type: 'dark',
  settings: [
    { settings: { foreground: '#e9eff6' } }, // --ink
    { scope: KEYWORD, settings: { foreground: '#86b4ee' } }, // --blueprint
    { scope: STRING, settings: { foreground: '#beb937' } }, // --syntax-string
    {
      scope: COMMENT,
      settings: { foreground: '#98abc0', fontStyle: 'italic' },
    }, // --faint
    { scope: TYPE, settings: { foreground: '#e9eff6', fontStyle: 'bold' } }, // --ink
  ],
}

let highlighterPromise: ReturnType<typeof createHighlighter> | undefined

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    langs: ['typescript'],
    themes: [playbookLight, playbookDark],
  })
  return highlighterPromise
}

/**
 * `defaultColor: false` leaves every token bearing only the
 * `--shiki-light`/`--shiki-dark` custom properties Shiki's dual-theme mode
 * emits, with no inline `color`. `globals.css`'s `.shiki` rules pick between
 * them the same way it already picks every other token — off `data-theme`
 * and `prefers-color-scheme` — so a token that looked right in one theme and
 * wrong in the other, the exact failure a hardcoded inline colour cannot
 * self-correct from, is a CSS change here rather than a re-run of this file.
 */
export async function highlightTs(code: string): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang: 'typescript',
    themes: { light: 'playbook-light', dark: 'playbook-dark' },
    defaultColor: false,
  })
}
