import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import {
  checkBuildFreshness,
  hintServedBuildId,
  newestSourceMtime,
  servedCarriesBuildId,
} from './build-freshness'

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'freshness-'))
  mkdirSync(join(root, 'src'))
  mkdirSync(join(root, 'node_modules'))
  writeFileSync(join(root, 'src', 'a.ts'), 'a')
  writeFileSync(join(root, 'node_modules', 'huge.js'), 'x')
  return root
}

const setMtime = (path: string, seconds: number) =>
  utimesSync(path, seconds, seconds)

test('newestSourceMtime names the newest file, since the name is what makes the failure actionable', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  const newest = newestSourceMtime([join(root, 'src')])
  expect(newest?.path).toContain('a.ts')
  expect(newest?.mtimeMs).toBe(1000 * 1000)
})

test('newestSourceMtime ignores node_modules, whose mtimes say nothing about the working tree', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  setMtime(join(root, 'node_modules', 'huge.js'), 9000)
  expect(newestSourceMtime([root])?.path).toContain('a.ts')
})

test('servedCarriesBuildId is false for a page from a different build, which is the hand-started-server case', () => {
  expect(servedCarriesBuildId('...\\"b\\":\\"abc123\\"...', 'abc123')).toBe(
    true,
  )
  expect(servedCarriesBuildId('...\\"b\\":\\"abc123\\"...', 'zzz999')).toBe(
    false,
  )
})

test('hintServedBuildId reads the flight payload so the message can name what was actually served', () => {
  expect(hintServedBuildId('x\\"b\\":\\"g2-pemUBl9fqzpomy2WPn\\"y')).toBe(
    'g2-pemUBl9fqzpomy2WPn',
  )
  expect(hintServedBuildId('nothing here')).toBe(null)
})

test('checkBuildFreshness passes when the served build is the one on disk and newer than every source file', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  expect(
    checkBuildFreshness({
      html: 'x\\"b\\":\\"abc\\"y',
      buildId: 'abc',
      buildIdMtimeMs: 2000 * 1000,
      roots: [join(root, 'src')],
    }),
  ).toBe(null)
})

test('checkBuildFreshness fails when a source file is newer than the build, which is TD-27 exactly', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 3000)
  const msg = checkBuildFreshness({
    html: 'x\\"b\\":\\"abc\\"y',
    buildId: 'abc',
    buildIdMtimeMs: 2000 * 1000,
    roots: [join(root, 'src')],
  })
  expect(msg).toContain('a.ts')
  expect(msg).toMatch(/newer than/i)
})

test('checkBuildFreshness fails when the served page is from another build, and names both ids', () => {
  const root = fixture()
  setMtime(join(root, 'src', 'a.ts'), 1000)
  const msg = checkBuildFreshness({
    html: 'x\\"b\\":\\"served-one\\"y',
    buildId: 'on-disk-one',
    buildIdMtimeMs: 2000 * 1000,
    roots: [join(root, 'src')],
  })
  expect(msg).toContain('on-disk-one')
  expect(msg).toContain('served-one')
})
