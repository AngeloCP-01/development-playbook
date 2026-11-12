import { expect, test } from 'vitest'
import { cheatsheetBySlug } from './index'
import { studySections } from './study-sections'
const originalTopics = [
  'node-runtime',
  'loop-and-pool',
  'parallel-work',
  'scheduling',
  'promise-control',
  'events-and-cleanup',
  'esm-and-commonjs',
  'package-contracts',
  'configuration',
  'buffers-and-encoding',
  'paths-and-files',
  'stream-backpressure',
  'raw-http',
  'methods-and-status',
  'deadlines-and-aborts',
  'app-and-router',
  'middleware-order',
  'routing-five',
  'parsing-and-validation',
  'response-contracts',
  'lists-and-pagination',
  'promise-errors',
  'callback-errors',
  'not-found-and-final-error',
  'service-boundaries',
  'process-state',
  'atomicity-and-retries',
  'identity-and-access',
  'cookies-and-tokens',
  'cors-and-csrf',
  'proxy-and-input-defense',
  'unit-and-http-tests',
  'failure-matrix',
  'diagnose-blocking-and-leaks',
  'startup-and-shutdown',
  'scale-and-dependencies',
  'resource-limits',
  'interview-capstone',
]
const addedTopics = [
  'event-loop-phases',
  'timers-and-immediates',
  'callbacks-to-await',
  'io-and-worker-pool',
  'worker-threads',
  'process-isolation',
  'incremental-decoding',
  'manual-backpressure',
  'handles-and-exit',
  'retained-references',
  'node-error-channels',
]
const codingTopics = [
  'parallel-work',
  'callbacks-to-await',
  'events-and-cleanup',
  'worker-threads',
  'incremental-decoding',
  'manual-backpressure',
]
test('Node depth preserves every original hash and topic, adding the complete foundations in declared order', () => {
  const sheet = cheatsheetBySlug('express')!
  expect(sheet.title).toBe('Node.js & Express')
  expect(studySections(sheet)!.map((s) => s.study!.id)).toEqual([
    'runtime-and-concurrency',
    'event-loop',
    'async-and-events',
    'work-and-workers',
    'modules-and-packages',
    'files-and-streams',
    'process-and-memory',
    'http-foundations',
    'express-flow',
    'input-and-responses',
    'errors-and-boundaries',
    'data-and-state',
    'security',
    'test-and-debug',
    'operate-and-explain',
  ])
  expect(
    sheet.sections.flatMap((s) => s.rows.map((r) => r.study!.id)).sort(),
  ).toEqual([...originalTopics, ...addedTopics].sort())
  expect(sheet.activities).toHaveLength(49)
  for (const id of codingTopics) {
    const activity = sheet.activities!.find((a) => a.id === id + '-practice')!
    expect(activity.starter?.code).toContain('TODO')
    expect(activity.solution?.code.length).toBeGreaterThan(100)
  }
  expect(
    sheet.sections
      .find((s) => s.study!.id === 'event-loop')!
      .rows.some((r) => r.study!.id === 'scheduling'),
  ).toBe(true)
  expect(
    sheet.sections
      .find((s) => s.study!.id === 'async-and-events')!
      .rows.some((r) => r.study!.id === 'scheduling'),
  ).toBe(false)
})
