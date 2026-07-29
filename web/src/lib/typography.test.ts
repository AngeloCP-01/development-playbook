import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// Curly double quotes alternate open, close — a mechanical rule, checked here
// because inspection cannot check it.
//
// Three tasks in one stage 03 round shipped a closing quote used to open a
// quotation. Every one was caught by a person reading a diff, not by any
// gate, and one implementer's report admitted its own edit tooling had
// silently mangled a quote character mid-session and caught only one of the
// instances itself. The opening quote (Unicode U+201C, LEFT DOUBLE QUOTATION
// MARK) and the closing quote (U+201D, RIGHT DOUBLE QUOTATION MARK) are
// near-identical in most fonts — the defect is real and invisible on
// inspection, which is exactly the case a test earns its keep.
//
// The rule this test enforces is narrow on purpose: within a file, the curly
// double quotes in reading order must alternate starting with an opener. It
// does not touch straight quotes, apostrophes, or dashes — those appear
// legitimately throughout JSX attributes, import paths and string delimiters,
// and a broader check would produce false positives, which is how a gate
// gets switched off.
//
// This file refers to the two codepoints only by \u escape, never by the
// literal glyph, anywhere — including in this comment. It lives inside the
// tree it walks, so a literal glyph here would make the test check itself,
// and pass or fail on some coincidental detail of its own source (a
// character-class member order, a variable declaration order, or any other
// semantically-null edit) rather than on anything about the content it
// guards. `source-citations.test.ts` avoids the equivalent trap by
// construction, since its own patterns cannot match its own regex literals;
// this file avoids it by containing zero instances of the actual glyphs.

const OPEN = '\u201C'
const CLOSE = '\u201D'
const CURLY_QUOTE = new RegExp(`[${OPEN}${CLOSE}]`, 'g')

const SRC = fileURLToPath(new URL('..', import.meta.url))

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(entry) ? [full] : []
  })
}

const files = sourceFiles(SRC).map((path) => ({
  path: path.slice(SRC.length),
  text: readFileSync(path, 'utf8'),
}))

// Returns the character index of the first curly quote that breaks the
// open/close alternation, or null if the file's curly quotes are consistent.
function firstBrokenQuote(text: string): number | null {
  let expectOpen = true
  for (const m of text.matchAll(CURLY_QUOTE)) {
    const isOpen = m[0] === OPEN
    if (isOpen !== expectOpen) return m.index
    expectOpen = !expectOpen
  }
  return null
}

test('curly double quotes alternate open, close in every source file', () => {
  const offenders = files.flatMap(({ path, text }) => {
    const index = firstBrokenQuote(text)
    if (index === null) return []
    const before = text.slice(0, index)
    const line = before.split('\n').length
    const lineStart = before.lastIndexOf('\n') + 1
    const lineEndIndex = text.indexOf('\n', index)
    const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex
    const context = text.slice(lineStart, lineEnd).trim()
    return [`${path}:${line} → ${context}`]
  })
  expect(
    offenders,
    'a curly quote is facing the wrong way — see the comment at the top of this file',
  ).toEqual([])
})
