import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('ci-cd prose pins', () => {
  test('division of labor — Actions is the gate', () => {
    const src = section('The division of labor')
    expect(flat(src)).toContain(flat('GitHub Actions is the gate'))
  })

  test('division of labor — Vercel is the deployer', () => {
    const src = section('The division of labor')
    expect(flat(src)).toContain(flat('Vercel is the deployer'))
  })

  test('division of labor — do not build deployment in Actions', () => {
    const src = section('The division of labor')
    expect(flat(src)).toContain(flat('Do not build deployment in Actions'))
  })

  test('ordering — cheapest failure first', () => {
    const src = section('Ordering: cheapest failure first')
    expect(flat(src)).toContain(flat('Lint, typecheck, test, build'))
  })

  test('ordering — formatting error', () => {
    const src = section('Ordering: cheapest failure first')
    expect(flat(src)).toContain(
      flat('waiting two minutes to learn about a formatting error'),
    )
  })

  test('e2e — deployment_status trigger', () => {
    const src = section('End-to-end tests')
    expect(flat(src)).toContain(flat('deployment_status'))
  })

  test('e2e — real preview URL', () => {
    const src = section('End-to-end tests')
    expect(flat(src)).toContain(flat('real preview URL'))
  })

  test('branch protection — GitHub Free caveat', () => {
    const src = section('Branch protection')
    expect(flat(src)).toContain(
      flat('On GitHub Free this only works on public repositories'),
    )
  })

  test('branch protection — setting looks identical', () => {
    const src = section('Branch protection')
    expect(flat(src)).toContain(flat('the setting looks identical either way'))
  })

  test('dependency updates — grouping', () => {
    const src = section('Dependency updates')
    expect(flat(src)).toContain(flat('Grouping is what makes this survivable'))
  })

  test('secrets — OIDC over long-lived tokens', () => {
    const src = section('Secrets')
    expect(flat(src)).toContain(flat('Prefer OIDC over long-lived tokens'))
  })

  test('AI section — trigger conditions', () => {
    const src = section('AI in CI/CD')
    expect(flat(src)).toContain(flat('Trigger conditions'))
  })

  test('AI section — secrets boundaries', () => {
    const src = section('AI in CI/CD')
    expect(flat(src)).toContain(flat('Secrets boundaries'))
  })

  test('AI section — Claude Code in CI', () => {
    const src = section('AI in CI/CD')
    expect(flat(src)).toContain(flat('claude-code-action'))
  })

  test('AI section — build failure diagnosis', () => {
    const src = section('AI in CI/CD')
    expect(flat(src)).toContain(flat('Build failure diagnosis'))
  })

  test('scaling — merge queue', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('merge queue'))
  })
})
