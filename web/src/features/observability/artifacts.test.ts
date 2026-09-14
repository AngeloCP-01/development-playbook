// web/src/features/observability/artifacts.test.ts
import { describe, expect, test } from 'vitest'
import type { Artifact } from '@/components/artifact'
import { CANARY, HEALTH, HEARTBEAT, LOGGER, SCRUBBER } from './artifacts'
import { fences } from './doc-source'

const text = (a: Artifact) => a.lines.map((l) => l.text).join('\n')

// Indexes measured against the doc on 2026-09-11. A fence added above one
// of these shifts the index and fails the whole-block comparison, which is
// the point: `toBe` against the whole fence, never `toContain`, so a dropped
// last line fails too.
const CASES: [string, Artifact, number, RegExp][] = [
  ['scrubber', SCRUBBER, 2, /value\.value = redact\(value\.value\)/],
  ['logger', LOGGER, 3, /error: \(err: Error\) => \(\{/],
  ['health', HEALTH, 6, /await Promise\.race\(\[/],
  ['canary', CANARY, 8, /\{ ok: false \}, \{ status: 503 \}/],
  ['heartbeat', HEARTBEAT, 9, /await fetch\(process\.env\.HEARTBEAT_URL!/],
]

describe('observability artifacts', () => {
  const all = fences()

  for (const [name, artifact, index, pivotRe] of CASES) {
    describe(name, () => {
      test('quotes its fence line for line', () => {
        expect(text(artifact)).toBe(all[index])
      })

      test('is TypeScript', () => {
        expect(artifact.language).toBe('ts')
      })

      test('has exactly one pivot, on the decision line', () => {
        const pivots = artifact.lines.filter((l) => l.pivot)
        expect(pivots).toHaveLength(1)
        expect(pivots[0].text).toMatch(pivotRe)
      })

      test('every note is non-empty and sits on a non-blank line', () => {
        for (const l of artifact.lines) {
          if (l.note !== undefined) {
            expect(l.note.length, l.text).toBeGreaterThan(20)
            expect(
              l.text.trim().length,
              'note on a blank line',
            ).toBeGreaterThan(0)
          }
        }
      })

      test('at least three annotated lines', () => {
        expect(
          artifact.lines.filter((l) => l.note).length,
        ).toBeGreaterThanOrEqual(3)
      })
    })
  }

  // The health check's `finally` is resource cleanup; the heartbeat's rule is
  // "not in a finally". The note on that line has to draw the distinction or
  // a reader reads one against the other two steps later.
  test("health's clearTimeout note distinguishes it from the heartbeat rule", () => {
    const line = HEALTH.lines.find((l) => l.text.includes('clearTimeout'))
    expect(line?.note).toMatch(/heartbeat/i)
  })
})
