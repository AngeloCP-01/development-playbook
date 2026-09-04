import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * A stage doc, and the helpers that cut sections out of it.
 *
 * **Tests only.** It reads the filesystem at module load, so importing it from
 * a component would break the build. Living under `src/test/` rather than in a
 * feature folder is part of saying so.
 *
 * Extracted when stage 05 would have been the third copy. Stage 04's first
 * pass is why that matters: four implementers working from their own task
 * slices each wrote `section()`, and the copies *diverged* — only the `h2`
 * pair carried the line-anchoring fix, so three modules were still cutting
 * sections with an unbounded `indexOf`, the exact bug the traps module had
 * already found and fixed.
 *
 * @param relPath  Relative to the repository root, e.g. `docs/05-development.md`.
 */
export function docSource(relPath: string) {
  const DOC = readFileSync(
    fileURLToPath(new URL(`../../../${relPath}`, import.meta.url)),
    'utf8',
  )

  /**
   * Anchored to a heading on its own line, and bounded at the next heading of
   * the same level or higher.
   *
   * Both halves are load-bearing and both were learned the hard way.
   * `indexOf('## Traps')` matches stage 04 §7's prose, which mentions the
   * section while telling you what to put in a README, and lands 215 lines
   * early — the plan's version did exactly that and counted nine traps where
   * the doc has seven. Leaving the slice unbounded is the same failure one step
   * later: it runs to end of file and picks up the next section.
   */
  function slice(heading: string, level: 2 | 3): string {
    const anchor = new RegExp(`^#{${level}} ${escapeRe(heading)}\\s*$`, 'm')
    const start = DOC.search(anchor)
    if (start === -1) throw new Error(`no level-${level} section "${heading}"`)

    const rest = DOC.slice(start).replace(anchor, '')

    // Never `^#{1,…}`. A single hash and a space is a shell comment, and these
    // documents are full of fenced bash blocks that open with one. Bounding at
    // one hash cut stage 04 §5 off at its own code sample, several paragraphs
    // before the sentence the test was reading for, and the test failed
    // pointing at the data rather than at this.
    const end = rest.search(new RegExp(`^#{2,${level}} `, 'm'))
    return end === -1 ? rest : rest.slice(0, end)
  }

  function escapeRe(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /** The body of one `### ` section. */
  const section = (heading: string) => slice(heading, 3)

  /** The body of one `## ` section. */
  const h2 = (heading: string) => slice(heading, 2)

  /**
   * Collapses runs of whitespace, for comparing a one-line string against a doc
   * that hard-wraps at about ninety columns.
   *
   * A quoted sentence the app renders on one line does not exist on one line in
   * the doc, so `DOC.includes(quote)` is false for a reason that has nothing to
   * do with the words. Use it on both sides. It tolerates a re-wrap and nothing
   * else: a changed word, a changed capital and a dropped clause all still fail.
   */
  const flat = (text: string) => text.replace(/\s+/g, ' ').trim()

  /**
   * Every fenced code block, markers stripped, in document order.
   *
   * Exists so an artifact can be compared to a *whole* block with `toBe` rather
   * than asked whether the doc contains it. `toContain` cannot see truncation —
   * a substring of a block is still contained — and an artifact dropping its
   * last line is precisely the defect that matters.
   */
  function fences(): string[] {
    const out: string[] = []
    let open: string[] | null = null

    for (const line of DOC.split('\n')) {
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

  return { DOC, section, h2, flat, fences }
}
