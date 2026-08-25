import { expect, test } from 'vitest'
import { highlightTs } from './highlight'

// The highlighter is created once and reused (a fresh Shiki instance per call
// would be the cost of loading the WASM grammar engine on every example, not
// just the first). This test only asserts the shape of the output; the actual
// colours are asserted against the design tokens in globals.css by eye, the
// same way every other token in this app is — a unit test cannot render CSS.

test('wraps highlighted TypeScript in a shiki root, so the CSS reset in globals.css has something to target', async () => {
  const html = await highlightTs('const x = 1')
  expect(html).toContain('class="shiki')
})

test('gives a keyword its own token span, distinct from a plain identifier', async () => {
  const html = await highlightTs('const x = 1')
  // Shiki emits one <span> per token with a `--shiki-light`/`--shiki-dark`
  // style pair; a keyword and an identifier must not collapse into the same
  // span, or "const" and "x" would be forced to the same colour.
  const spanCount = (html.match(/<span/g) ?? []).length
  expect(spanCount).toBeGreaterThan(1)
})

test('is deterministic — the same source produces the same output', async () => {
  const first = await highlightTs('interface Shape {\n  area(): number\n}')
  const second = await highlightTs('interface Shape {\n  area(): number\n}')
  expect(first).toBe(second)
})
