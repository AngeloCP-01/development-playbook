import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * `docs/04-project-setup.md`, and the helpers that cut sections out of it.
 *
 * **Tests only.** It reads the filesystem at module load, so importing it from
 * a component would break the build. Nothing under `features/setup/*.tsx` may
 * touch it.
 *
 * The plan asked for one shared helper at the head of Wave 1 and said so; four
 * implementers working from their own task slices each wrote their own, which
 * is how the wave ended with `section()` byte-identical in three files and
 * `h2()` in two. That would be tidying and not worth a commit, except that the
 * copies had *diverged*: only the `h2` pair carried the line-anchoring fix, so
 * three modules were still cutting sections with an unbounded `indexOf` — the
 * exact bug the traps module had already found and fixed.
 */
const DOC_PATH = fileURLToPath(
  new URL('../../../../docs/04-project-setup.md', import.meta.url),
)

export const DOC = readFileSync(DOC_PATH, 'utf8')

/**
 * Anchored to a heading on its own line, and bounded at the next heading of
 * the same level or higher.
 *
 * Both halves are load-bearing and both were learned here. `indexOf('## Traps')`
 * matches §7's prose, which mentions `## Traps` while telling you what to put
 * in a README, and lands 215 lines early; the plan's version did exactly that
 * and counted nine traps where the doc has seven. Leaving the slice unbounded
 * is the same failure one step later — it runs to end of file and picks up
 * whatever the next section happens to contain.
 */
function slice(heading: string, level: 2 | 3): string {
  const anchor = new RegExp(`^#{${level}} ${escapeRe(heading)}\\s*$`, 'm')
  const start = DOC.search(anchor)
  if (start === -1) throw new Error(`no level-${level} section "${heading}"`)

  const rest = DOC.slice(start).replace(anchor, '')

  // Never `^#{1,…}`. A single hash and a space is a shell comment, and this
  // document is full of fenced bash and dotenv blocks that open with one —
  // `# .env.example`, `# src/lib/env.ts`. Bounding at one hash cut §5 off at
  // its own code sample, several paragraphs before the sentence the test was
  // reading for, and the test failed pointing at the data rather than at this.
  // Found by running it; the shape reads fine.
  const end = rest.search(new RegExp(`^#{2,${level}} `, 'm'))
  return end === -1 ? rest : rest.slice(0, end)
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** The body of one `### ` section. */
export function section(heading: string): string {
  return slice(heading, 3)
}

/** The body of one `## ` section. */
export function h2(heading: string): string {
  return slice(heading, 2)
}

/**
 * Collapses runs of whitespace, for comparing a one-line string against a doc
 * that hard-wraps at about ninety columns.
 *
 * A quoted sentence the app renders on one line does not exist on one line in
 * the doc, so `DOC.includes(quote)` is false for a reason that has nothing to
 * do with the words. The plan's `PIN_RULE` test failed exactly this way and
 * could never have passed. The other three modules pinned their quotes against
 * the raw text instead, which passes today and reddens on any re-wrap — and
 * `4cca648` already re-wrapped this document once, running a humanizer pass
 * over the whole thing.
 *
 * Use it on both sides. It tolerates a re-wrap and nothing else: a changed
 * word, a changed capital and a dropped clause all still fail.
 */
export function flat(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Every fenced code block in the doc, fence markers stripped, in document
 * order.
 *
 * Exists so an artifact can be compared to a *whole* block with `toBe` rather
 * than asked whether the doc contains it. `toContain` cannot see truncation —
 * a substring of a block is still contained — and the artifact module dropping
 * its last line is precisely the defect that matters, since the last line of
 * the `env` artifact is the one §5 exists for. `ddl-sync.test.ts` had this
 * right for stage 03 and the plan quoted it while specifying the weaker form.
 */
export function fences(): string[] {
  const out: string[] = []
  const lines = DOC.split('\n')
  let open: string[] | null = null

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (open === null) open = []
      else {
        out.push(open.join('\n'))
        open = null
      }
      continue
    }
    open?.push(line)
  }
  return out
}
