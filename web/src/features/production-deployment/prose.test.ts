import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('production deployment prose pins', () => {
  test('small and frequent — one suspect', () => {
    const src = section('Small and frequent beats large and scheduled')
    expect(flat(src)).toContain(
      flat(
        'A deploy containing one change has one suspect when something breaks',
      ),
    )
  })

  test('asymmetry — code vs data', () => {
    const src = section('The asymmetry that governs everything')
    expect(flat(src)).toContain(
      flat('Code rolls back in seconds. Data does not roll back at all'),
    )
  })

  test('expand migrate contract — never in one deploy', () => {
    const src = section('Migrations: expand, migrate, contract')
    expect(flat(src)).toContain(
      flat('Never change schema and code in one deploy'),
    )
  })

  test('expand migrate contract — three deploys', () => {
    const src = section('Migrations: expand, migrate, contract')
    expect(flat(src)).toContain(flat('Three deploys instead of one'))
  })

  test('migrations separately — not in build step', () => {
    const src = section('Migrations run separately from the build')
    expect(flat(src)).toContain(
      flat('Builds run multiple times, in parallel, and get retried'),
    )
  })

  test('skew protection — invisible to you', () => {
    const src = section('Skew protection')
    expect(flat(src)).toContain(flat('invisible to you'))
  })

  test('feature flags — ship disabled', () => {
    const src = section('Feature flags decouple deploy from release')
    expect(flat(src)).toContain(
      flat('ship the code disabled and turn it on separately'),
    )
  })

  test('rollback — diagnose second', () => {
    const src = section('Rollback')
    expect(flat(src)).toContain(flat('Roll back first, diagnose second'))
  })

  test('scaling — deploy your own changes', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('Deploy your own changes'))
  })
})
