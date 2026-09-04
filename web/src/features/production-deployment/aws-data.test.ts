import { describe, expect, test } from 'vitest'
import {
  AWS_COSTS,
  STRATEGIES,
  ROLLING_CONFIG,
  CIRCUIT_BREAKER_CONFIG,
} from './aws-data'
import { flat, section } from './doc-source'

describe('AWS deployment data', () => {
  const src = section('AWS deployment strategies')

  test('six cost rows', () => {
    expect(AWS_COSTS).toHaveLength(6)
  })

  test('unique cost IDs', () => {
    const ids = AWS_COSTS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every cost row has a range', () => {
    for (const row of AWS_COSTS) {
      expect(row.low, `${row.id} low`).toBeGreaterThan(0)
      expect(row.high, `${row.id} high`).toBeGreaterThan(row.low)
    }
  })

  test('costs pin: NAT Gateway in doc', () => {
    expect(flat(src)).toContain(flat('NAT Gateway'))
  })

  test('costs pin: $85 total in doc', () => {
    expect(flat(src)).toContain(flat('$85'))
  })

  test('five deployment strategies', () => {
    expect(STRATEGIES).toHaveLength(5)
  })

  test('unique strategy IDs', () => {
    const ids = STRATEGIES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('rolling config pins against doc', () => {
    expect(flat(src)).toContain(flat('minimumHealthyPercent'))
    expect(ROLLING_CONFIG.minimumHealthyPercent).toBe(100)
    expect(ROLLING_CONFIG.maximumPercent).toBe(200)
  })

  test('circuit breaker config', () => {
    expect(CIRCUIT_BREAKER_CONFIG.enable).toBe(true)
    expect(CIRCUIT_BREAKER_CONFIG.rollback).toBe(true)
  })

  test('strategies have sufficient text', () => {
    for (const s of STRATEGIES) {
      expect(s.name.length, `${s.id} name`).toBeGreaterThan(3)
      expect(s.pattern.length, `${s.id} pattern`).toBeGreaterThan(10)
    }
  })
})
