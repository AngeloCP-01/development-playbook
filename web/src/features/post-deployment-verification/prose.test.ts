import { describe, expect, test } from 'vitest'
import { flat, section, h2 } from './doc-source'

describe('post-deployment verification prose pins', () => {
  test('ten-minute check — is it up', () => {
    const src = section('The ten-minute check')
    expect(flat(src)).toContain(flat('Load the production URL'))
  })

  test('ten-minute check — new issue type strongest signal', () => {
    const src = section('The ten-minute check')
    expect(flat(src)).toContain(flat('the strongest signal there is'))
  })

  test('verify with production data volumes', () => {
    const src = section('Verify with production data volumes')
    expect(flat(src)).toContain(
      flat('instant against 50 seeded rows and takes eight seconds'),
    )
  })

  test('vercel — Vercel Analytics', () => {
    const src = section('Vercel: where to look')
    expect(flat(src)).toContain(flat('Vercel Analytics'))
  })

  test('aws — wait services-stable', () => {
    const src = section('AWS: where to look')
    expect(flat(src)).toContain(flat('aws ecs wait services-stable'))
  })

  test('aws — describe-target-health', () => {
    const src = section('AWS: where to look')
    expect(flat(src)).toContain(flat('describe-target-health'))
  })

  test('recovery — roll back first', () => {
    const src = section('When something is wrong')
    expect(flat(src)).toContain(flat('Roll back first'))
  })

  test('recovery — env var misconfiguration', () => {
    const src = section('When something is wrong')
    expect(flat(src)).toContain(flat('Environment variable misconfiguration'))
  })

  test('half-hour follow-up', () => {
    const src = section('The half-hour follow-up')
    expect(flat(src)).toContain(
      flat('Check back once at around thirty minutes'),
    )
  })

  test('scaling — the deployer verifies', () => {
    const src = h2('Scaling to a team')
    expect(flat(src)).toContain(flat('The deployer verifies'))
  })
})
