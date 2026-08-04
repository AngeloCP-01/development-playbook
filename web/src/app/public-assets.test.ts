import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const WEB = fileURLToPath(new URL('../..', import.meta.url))

function filesUnder(dir: string): string[] {
  // git does not track empty directories, so `public/` stops existing entirely
  // once its last file is removed. Guarding here rather than at the call site
  // because a missing directory is the expected end state, not an error.
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? filesUnder(full) : [full]
  })
}

// `public/` shipped five create-next-app SVGs from W-0 to W-5 because nothing
// looked. Anything served to a user should be something the app asks for; a
// file nobody references is either dead weight or a missing reference, and
// both are worth failing over.
//
// favicon.ico lives in `app/`, not `public/`, so it is outside this check
// entirely — mentioning it is documentation, not an exemption mechanism.
//
// The review found two ways this passed when it should not have. This file is
// itself under `src/`, so naming an asset in a comment here satisfied the
// search — dropping a `favicon.ico` into `public/` went green purely because
// the word appears above. And a bare substring matched a filename mentioned in
// any prose at all. So: this file is excluded from the corpus, and the match
// requires a path separator, which is how an asset is actually referenced.
test('every file in public/ is referenced by the app, since an asset nobody asks for is either dead weight or a missing reference', () => {
  const publicDir = join(WEB, 'public')
  const assets = filesUnder(publicDir).map((f) => f.slice(publicDir.length + 1))
  if (assets.length === 0) return

  const self = fileURLToPath(import.meta.url)
  const source = [
    ...filesUnder(join(WEB, 'src')),
    ...filesUnder(join(WEB, 'e2e')),
  ]
    .filter((f) => f !== self && /\.(ts|tsx|css|mjs)$/.test(f))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')

  for (const asset of assets) {
    expect(source, `public/${asset} is referenced nowhere`).toContain(
      `/${asset}`,
    )
  }
})
