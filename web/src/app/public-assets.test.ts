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
// favicon.ico is exempt: it lives in `app/`, not `public/`, and is claimed by
// filename convention rather than by an import. Anything genuinely referenced
// only by convention belongs in this list with a reason, not silently.
test('every file in public/ is referenced by the app, since an asset nobody asks for is either dead weight or a missing reference', () => {
  const publicDir = join(WEB, 'public')
  const assets = filesUnder(publicDir).map((f) => f.slice(publicDir.length + 1))
  if (assets.length === 0) return

  const source = [
    ...filesUnder(join(WEB, 'src')),
    ...filesUnder(join(WEB, 'e2e')),
  ]
    .filter((f) => /\.(ts|tsx|css|mjs)$/.test(f))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')

  for (const asset of assets) {
    expect(source, `public/${asset} is referenced nowhere`).toContain(asset)
  }
})
