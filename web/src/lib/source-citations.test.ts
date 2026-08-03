import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// D-42: a source citation names a HEADING, not a line number.
//
// The reasoning, and why this test exists: line numbers are coordinates in a
// document that moves, and nothing in lint, typecheck, the unit suite or the
// audit suite can tell that one has drifted. An audit during the stage 03 round
// found 14 of 33 citations wrong, every one perfectly well-formed. The decision
// was recorded, two citations were converted by hand — and then the W-3.1 doc
// round took 03-architecture.md from 300 lines to 880 and staled all 18 that
// were left, including several that had just been repaired. The two that
// survived were the two citing by heading.
//
// D-42 closed with "a future check could assert that each cited heading exists".
// This is that check. It does two things:
//
//   1. Fails on any `docs/NN-name.md:123` citation at all — the form is banned,
//      not merely discouraged, because a stale one is invisible.
//   2. Resolves every `docs/NN-name.md, "Heading"` citation against the real
//      headings in that file, so a renamed section fails here instead of
//      drifting silently.
//
// A heading changes only when someone deliberately renames a section, which
// shows up in a diff. A line number changes when anyone inserts a paragraph
// anywhere above it.

const SRC = fileURLToPath(new URL('..', import.meta.url))
const DOCS = fileURLToPath(new URL('../../../docs', import.meta.url))

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(entry) ? [full] : []
  })
}

function headings(doc: string): Set<string> {
  const md = readFileSync(join(DOCS, doc), 'utf8')
  return new Set(
    [...md.matchAll(/^#{2,6}\s+(.+)$/gm)].map((m) =>
      m[1].trim().replace(/[`*]/g, ''),
    ),
  )
}

const files = sourceFiles(SRC).map((path) => ({
  path: path.slice(SRC.length),
  text: readFileSync(path, 'utf8'),
}))

// Two shapes, because only the first one was banned and the second one shipped.
// `AuthPaths.tsx` cited a heading and then added "plus the authorization line
// at" followed by a bare colon and a range — which the pattern above walks
// straight past, because the colon is not touching the filename. That range had
// drifted by roughly seven hundred lines by the time anyone read it, and a
// second one was sitting in scoring.test.ts. A detached colon-and-digits is a
// line citation whatever it is attached to, so both shapes are collected here.
//
// Written without an example of the banned form on purpose: this file is one of
// the files the sweep reads.
test('no source citation uses a line number, attached to the filename or not (D-42)', () => {
  const offenders = files.flatMap(({ path, text }) =>
    [
      ...text.matchAll(/docs\/\d{2}-[a-z-]+\.md:\d+(-\d+)?/g),
      ...text.matchAll(/\s:\d+(-\d+)?\b/g),
    ].map((m) => `${path} → ${m[0].trim()}`),
  )
  expect(offenders, 'cite the heading instead — see D-42').toEqual([])
})

test('every cited heading exists in the doc it names (D-42)', () => {
  const broken: string[] = []
  for (const { path, text } of files) {
    for (const m of text.matchAll(/docs\/(\d{2}-[a-z-]+\.md),\s*"([^"]+)"/g)) {
      const [, doc, heading] = m
      if (!headings(doc).has(heading))
        broken.push(`${path} → ${doc} "${heading}"`)
    }
  }
  expect(broken, 'heading renamed or citation mistyped').toEqual([])
})
