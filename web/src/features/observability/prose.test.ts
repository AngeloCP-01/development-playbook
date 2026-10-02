import { describe, expect, test } from 'vitest'
import { flat, section } from './doc-source'

describe('observability prose pins', () => {
  test('three — traces: you will know when you need them', () => {
    expect(flat(section('Three things, in order of value'))).toContain(
      flat('You will know when you need them'),
    )
  })

  test('errors — an opaque id resolves to a person in your own database', () => {
    expect(flat(section('Errors that are actually useful'))).toContain(
      flat('resolves to a person in your own database'),
    )
  })

  test('errors — addContext is a separate door', () => {
    expect(flat(section('Errors that are actually useful'))).toContain(
      flat('`addContext` is a separate door'),
    )
  })

  test('logs — levels are a filter, not a mood', () => {
    expect(flat(section('Structured logs'))).toContain(
      flat('Levels are a filter, not a mood'),
    )
  })

  test('where — stdout is a stream, not storage', () => {
    expect(flat(section('Where logs go, and what they cost'))).toContain(
      flat('stdout is a stream, not storage'),
    )
  })

  test('signals — error rate does not come from your error tracker', () => {
    expect(flat(section('The four signals'))).toContain(
      flat('Error *rate* does not come from your error tracker'),
    )
  })

  test('health — a restart cannot fix a database', () => {
    expect(flat(section('Health checks'))).toContain(
      flat('a restart cannot fix a database'),
    )
  })

  test('alerts — every alert must be actionable', () => {
    expect(flat(section('Alerts you will not learn to ignore'))).toContain(
      flat('every alert must be actionable'),
    )
  })

  test('silence — absence of a signal is not evidence of health', () => {
    expect(flat(section('When nothing is reporting'))).toContain(
      flat('Absence of a signal is not evidence of health'),
    )
  })

  test('jobs — withhold a ping on purpose', () => {
    expect(flat(section('Jobs that nobody watches'))).toContain(
      flat('Withhold a ping on purpose and confirm the page arrives'),
    )
  })

  test('dashboards — a deploy marker is an event with a timestamp', () => {
    expect(flat(section('Dashboards'))).toContain(
      flat('It is an **event with a timestamp**'),
    )
  })
})
