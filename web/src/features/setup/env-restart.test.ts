import { expect, test } from 'vitest'
import { ARTIFACTS } from './artifacts'
import { flat, section } from './doc-source'

const S5 = flat(section('5. Environment variables, validated at boot'))

/**
 * TD-32. §5's promise is that a missing variable stops the app, and the check a
 * reader will reach for — blank the value with `pnpm dev` still running, reload
 * — reports success while proving nothing. The first request after the save is
 * answered by the evaluation Turbopack already had, and returns 200.
 *
 * Measured rather than quoted: `docs/verification/td-32-env-restart.md`.
 */
test('§5 tells the reader to restart before re-testing the validation', () => {
  expect(S5).toMatch(/restart/i)
})

/**
 * The reason is the transferable half, and TD-32 insists on it: the cheap
 * phrasing ("restart after editing `.env.local`") teaches a ritual that dies
 * with Turbopack. Assert the mechanism, not the word.
 */
test('§5 gives the reason, not just the ritual, since a ritual does not survive a change of bundler', () => {
  expect(S5).toMatch(/module evaluation/i)
})

/**
 * Both observed outcomes, so a reader knows which result means what. Without
 * the 200 the paragraph reads as a tip; with it, it names the false pass.
 */
test('§5 names both outcomes, because the passing one is the misleading one', () => {
  expect(S5).toMatch(/\b200\b/)
  expect(S5).toMatch(/\b500\b/)
})

/**
 * The correction this round measured, pinned so it cannot be simplified back.
 *
 * TD-32 was recorded as "Turbopack does not re-evaluate `env.ts` when
 * `.env.local` changes". Running it disproved that: the module is re-evaluated
 * inside the running process, with no restart, and what misleads the reader is a
 * window one request wide. A future editor tightening this paragraph is likely
 * to reach for the simpler, wrong mechanism, because the tracker carried it for
 * a week. This is the assertion that notices.
 */
test('§5 says the module is re-evaluated, since "Turbopack never re-evaluates" is the wrong mechanism and was the recorded one', () => {
  expect(S5).toMatch(/re-evaluat/i)
})

/**
 * The app is hand-ported from the doc, and a correction that lands in one and
 * not the other is how the two drift. `env`'s last line is where module
 * evaluation happens, so the note belongs on it rather than in a new panel.
 */
test('the env artifact carries the same reason on the line that evaluates the module', () => {
  const parseLine = ARTIFACTS.env.lines.find((l) =>
    l.text.includes('schema.parse(process.env)'),
  )
  expect(parseLine?.note).toMatch(/restart/i)
  expect(parseLine?.note).toMatch(/module evaluation/i)
})
