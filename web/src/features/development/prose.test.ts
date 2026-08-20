import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
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
 *
 * M3 (final whole-branch review): the walk above only ever reached data
 * modules — it never saw prose authored directly in a `.tsx` file, such as
 * `Development.tsx`'s `STUCK_MOVES` (a `RevealRow[]` written inline rather
 * than lifted to a sibling module) or the `title`/`summary` object literals
 * built inline inside several `<RevealList rows={[...]} />` calls. Those
 * strings reach the page exactly the same way — `RevealList` renders
 * `title`/`summary` as-is, no markdown handling — so a stray link there is
 * exactly as invisible to a reader as one in a `.ts` module, and was
 * invisible to this guard.
 *
 * `scanTsxProse` below covers that ground with the TypeScript compiler's own
 * parser rather than a second hand-rolled object walk, because a `.tsx` file
 * mixes two different kinds of "string" that a JSON-shaped walk can't tell
 * apart: a `StringLiteral` AST node (`title: 'Say the problem out loud'`,
 * assigned prose, in scope) and a `JsxText` AST node (the literal text
 * between `<p>` and `</p>` in hand-written JSX prose, e.g. the "Feature code
 * lives under..." paragraphs). The two render identically, but only the
 * first is the shape this bug class comes from — hand-authored `.ts`-module
 * prose duplicated inline instead of lifted out. `JsxText` is long-form
 * narrative prose interleaved with `{' '}` and inline `<Term>`/`<code>`
 * elements; parsing *that* for stray markdown reliably, without the parser
 * itself introducing false positives at every word-wrap seam, is a
 * meaningfully different (and, tried below, not obviously safely doable)
 * problem from checking a self-contained string literal — so `JsxText` nodes
 * are left out on purpose, same as the instructions asked, not by oversight.
 * `NoSubstitutionTemplateLiteral` (a plain backtick string) is checked the
 * same way a `StringLiteral` is; a `TemplateExpression` (one with `${...}`
 * interpolation, e.g. `ClientBoundary.tsx`'s readout sentences) is left out —
 * those are computed from enumerated component names, not typed by hand, so
 * they are not where this bug class comes from either. The same `text`/`code`
 * key exemption applies, keyed off the enclosing property or JSX attribute
 * name, so a `code` block written inline in a `.tsx` file is exempt on the
 * same grounds as `snippets.ts`'s `code` field.
 */
const dir = fileURLToPath(new URL('.', import.meta.url))

const MODULE_FILES = readdirSync(dir)
  .filter(
    (f) =>
      f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== 'doc-source.ts',
  )
  .map((f) => f.replace(/\.ts$/, ''))

const TSX_FILES = readdirSync(dir).filter(
  (f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'),
)

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

/**
 * The name of the property or JSX attribute a string-literal-like node is
 * the value of, e.g. `'title'` for `title: 'Say the problem out loud'` or
 * `'code'` for `<Foo code="...">`. `undefined` for a node that is neither —
 * a bare argument, a JSX expression child — which stays in scope rather than
 * being silently exempted for lack of a key.
 */
function enclosingKey(node: ts.Node): string | undefined {
  const parent = node.parent
  if (
    parent &&
    ts.isPropertyAssignment(parent) &&
    parent.initializer === node
  ) {
    if (ts.isIdentifier(parent.name)) return parent.name.text
    if (ts.isStringLiteral(parent.name)) return parent.name.text
  }
  if (parent && ts.isJsxAttribute(parent)) {
    return parent.name.getText()
  }
  return undefined
}

function scanTsxProse(fileName: string, hits: Hit[]) {
  const filePath = new URL(fileName, import.meta.url)
  const source = readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  )

  function visit(node: ts.Node) {
    // `isStringLiteralLike` covers `StringLiteral` and
    // `NoSubstitutionTemplateLiteral` — never `JsxText`, which is a distinct
    // SyntaxKind. That is the mechanism, not a separate check, behind
    // "JSX text is fine" above.
    if (ts.isStringLiteralLike(node)) {
      const key = enclosingKey(node)
      if (key !== 'text' && key !== 'code') {
        const value = node.text
        if (LINK_PATTERN.test(value)) {
          const { line } = sourceFile.getLineAndCharacterOfPosition(
            node.getStart(sourceFile),
          )
          hits.push({ module: fileName, path: `line ${line + 1}`, value })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
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
  for (const file of TSX_FILES) {
    scanTsxProse(file, hits)
  }
  expect(hits, JSON.stringify(hits, null, 2)).toEqual([])
})
