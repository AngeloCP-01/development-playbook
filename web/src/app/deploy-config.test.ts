import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { SITE_URL } from '@/lib/site'

const read = (file: string) =>
  readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8')

const pkg = JSON.parse(read('../../package.json')) as {
  scripts: Record<string, string>
  engines?: Record<string, string>
}

// The whole-branch review's C1, and the defect this round existed to prevent:
// pnpm runs `prepare` on every install, `lefthook install` exits 1 outside a
// git repository, and Vercel's build environment has no `.git`. So the deploy
// died at the install step — before Root Directory, which every record in this
// repo named as the only blocker.
//
// Verified rather than reasoned: `lefthook install` in a non-git directory
// exits 1, and neither CI=1 nor VERCEL=1 changes that.
test('the prepare hook survives a checkout with no .git, since Vercel installs without one and pnpm runs prepare on every install', () => {
  expect(pkg.scripts.prepare, 'no prepare script at all').toBeDefined()
  expect(
    pkg.scripts.prepare,
    'prepare can fail the install on a host with no .git',
  ).toMatch(/\|\|\s*(true|exit 0)/)
})

// Vercel reads neither .nvmrc nor the CI workflow: its Node version comes from
// the project setting, overridden by this field. Without it a new project now
// defaults to 24.x, so the local/CI/host agreement reference/stack.md asks for
// would be broken by default rather than by accident.
test('the Node version is pinned where Vercel reads it, which is engines rather than .nvmrc', () => {
  expect(pkg.engines?.node, 'engines.node is unset').toBe('22.x')

  const nvmrc = read('../../.nvmrc').trim()
  expect(
    pkg.engines?.node?.startsWith(nvmrc),
    `engines.node "${pkg.engines?.node}" disagrees with .nvmrc "${nvmrc}"`,
  ).toBe(true)
})

// The review found the recorded evidence for metadataBase was vacuous: "no
// build warning" cannot fail, because Next emits that warning only from
// resolveAndValidateImage, gated on a RELATIVE image URL needing resolution
// (next/dist/lib/metadata/resolvers/resolve-opengraph.js:86,95). Open Graph is
// a spec non-goal, so there are no images and the warning could never fire —
// before or after the change.
//
// This is the assertion that can actually fail. It reads the source rather than
// importing the layout, because importing it drags in next/font/google and the
// global stylesheet for no gain here.
test('the root layout sets metadataBase from SITE_URL rather than a literal, since a second copy of the origin is the drift this design prevents', () => {
  const layout = read('./layout.tsx')
  expect(layout, 'metadataBase is not set').toMatch(
    /metadataBase:\s*new URL\(SITE_URL\)/,
  )
  expect(layout, 'the origin was hard-coded instead of imported').not.toContain(
    SITE_URL,
  )
})
