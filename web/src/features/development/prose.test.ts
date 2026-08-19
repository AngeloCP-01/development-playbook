import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

/**
 * Walks every authored-data module in this feature folder and fails if a
 * prose string carries markdown link syntax — `[06](06-testing.md)`, the
 * form `docs/05-development.md` uses throughout. `InlineCode`
 * (`src/components/InlineCode.tsx`) is deliberately not a markdown renderer:
 * it knows one construct, backticks, and "asterisks, links, underscores pass
 * through as written" by its own docblock. A note that carries a link renders
 * the literal `[06](06-testing.md)` characters on the page.
 *
 * D-67 already named this failure class for backticks: "Nothing tests that
 * no backtick reaches the page — the eleven that shipped raw were found by
 * grepping the built HTML, and the same method is what would find the next."
 * This is that test, for links, written before a second instance ships
 * rather than after.
 *
 * Discovery is structural, not a list of filenames. Every sibling `*.ts` file
 * in this directory is read and imported at test-run time, so a data module
 * added in a later task is covered without editing this file — nothing here
 * needs to change when it lands. Two files are excluded by name rather than
 * by pattern: this test file itself, and `doc-source.ts`, whose `DOC` export
 * is the raw markdown file and is full of real, correct links — the thing
 * every other module here must not reproduce.
 *
 * The walk is generic over field names for the same reason. Rather than
 * enumerating `note` today and guessing at `body`/`verdict`/`summary`/`label`
 * for modules not yet written, every string value reachable from an exported
 * object or array is checked. Two field names this test knows are `text` and
 * `code`, both excluded because they hold code rather than authored prose —
 * `text` is lifted verbatim from the doc's fenced blocks (`artifacts.ts`),
 * `code` is the authored-but-not-prose drill snippets (`snippets.ts`) — and a
 * code line can legitimately contain `](` (a destructured array pattern, a
 * call passed a computed member). Everything that is not `text` or `code` is
 * prose and is in scope.
 */
const dir = fileURLToPath(new URL('.', import.meta.url))

const MODULE_FILES = readdirSync(dir)
  .filter(
    (f) =>
      f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'doc-source.ts',
  )
  .map((f) => f.replace(/\.ts$/, ''))

const LINK_PATTERN = /\[[^\]]*\]\([^)]*\)/

type Hit = { module: string; path: string; value: string }

function walk(
  value: unknown,
  key: string | undefined,
  path: string,
  moduleName: string,
  hits: Hit[],
) {
  if (typeof value === 'string') {
    if (key === 'text' || key === 'code') return
    if (LINK_PATTERN.test(value)) hits.push({ module: moduleName, path, value })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, key, `${path}[${i}]`, moduleName, hits))
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      walk(v, k, `${path}.${k}`, moduleName, hits)
    }
  }
}

test('no authored prose string carries markdown link syntax, since InlineCode does not render it', async () => {
  const hits: Hit[] = []
  for (const base of MODULE_FILES) {
    const exports: Record<string, unknown> = await import(
      new URL(`./${base}.ts`, import.meta.url).href
    )
    for (const [exportName, exportValue] of Object.entries(exports)) {
      walk(exportValue, exportName, exportName, `${base}.ts`, hits)
    }
  }
  expect(hits, JSON.stringify(hits, null, 2)).toEqual([])
})
