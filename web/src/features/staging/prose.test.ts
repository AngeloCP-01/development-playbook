// web/src/features/staging/prose.test.ts
import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('staging prose pins', () => {
  test('preview vs staging distinction (first section)', () => {
    const src = section('Preview deployments are not staging')
    expect(flat(src)).toContain(flat('per-branch, ephemeral, and automatic'))
  })

  test('staging definition — second sentence', () => {
    const src = section('Preview deployments are not staging')
    expect(flat(src)).toContain(flat('a third party integrating against you'))
  })

  test('solo advice', () => {
    const src = section('Preview deployments are not staging')
    expect(flat(src)).toContain(flat('Solo, you usually do not need staging'))
  })

  test('database section — never production', () => {
    const src = section('Databases for previews')
    expect(flat(src)).toContain(
      flat(
        'A migration tested against production data is a migration that can destroy production data',
      ),
    )
  })

  test('neon branching — second sentence', () => {
    const src = section('Databases for previews')
    expect(flat(src)).toContain(flat('Neon creates an isolated branch'))
  })

  test('seed data — hostile advice', () => {
    const src = section('Seed data that is not sterile')
    expect(flat(src)).toContain(
      flat('Seeding `Alice`, `Bob`, and `Carol` tests nothing'),
    )
  })

  test('checklist — machines are bad at', () => {
    const src = section('The preview checklist')
    expect(flat(src)).toContain(flat('Check what machines are bad at'))
  })

  test('env vars — most common cause', () => {
    const src = section('Environment variables for previews')
    expect(flat(src)).toContain(flat('works locally, broken in preview'))
  })

  test('deployment protection — unlisted not secret', () => {
    const src = section('Password-protect previews')
    expect(flat(src)).toContain(flat('Preview URLs are unlisted, not secret'))
  })

  test('scaling — previews become the review artifact', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('Looks good'))
  })
})
