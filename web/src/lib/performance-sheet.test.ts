import { expect, test } from 'vitest'
import {
  BASELINE_FIELDS,
  EMPTY_PERFORMANCE_SHEET,
  FOLLOWUP_FIELDS,
  normalizePerformanceSheet,
  performanceMarkdown,
  SHEET_FIELDS,
} from './performance-sheet'

test('partial or malformed records keep known strings and supply empty fields, since browser JSON is untrusted', () => {
  for (const input of [null, undefined, [], 42, 'record']) {
    expect(normalizePerformanceSheet(input)).toEqual(EMPTY_PERFORMANCE_SHEET)
  }
  expect(
    normalizePerformanceSheet({
      outcome: 'click to browser response',
      metric: 95,
      scope: null,
      window: ['week'],
      unknown: 'discard',
      verdict: 'observe longer',
    }),
  ).toEqual({
    ...EMPTY_PERFORMANCE_SHEET,
    outcome: 'click to browser response',
    verdict: 'observe longer',
  })
})

test('Markdown exports the entire record with explicit blanks, so either view can hand over the same artifact', () => {
  const sheet = {
    ...EMPTY_PERFORMANCE_SHEET,
    outcome: 'Click → response',
    verdict: 'No field comparison yet',
  }
  const output = performanceMarkdown(sheet)
  expect(output).toBe(
    '# Performance measurement record\n\n## Outcome and observer\n\nClick → response\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nnot recorded\n\n## Window and sample\n\nnot recorded\n\n## Baseline evidence\n\nnot recorded\n\n## Target and rationale\n\nnot recorded\n\n## Hypothesis and alternative\n\nnot recorded\n\n## Change and version\n\nnot recorded\n\n## After evidence\n\nnot recorded\n\n## Correctness and rollback\n\nnot recorded\n\n## Verdict and open gap\n\nNo field comparison yet\n',
  )
  expect(output).toContain('No field comparison yet')
  expect(output).toContain('not recorded')
  expect(output).not.toContain('Hypothetical exercise')
})

test('the baseline and follow-up views partition the record without losing a field', () => {
  expect(BASELINE_FIELDS.map((f) => f.key)).toEqual([
    'outcome',
    'metric',
    'scope',
    'window',
    'evidence',
    'target',
  ])
  expect(FOLLOWUP_FIELDS.map((f) => f.key)).toEqual([
    'hypothesis',
    'change',
    'after',
    'correctness',
    'verdict',
  ])
  expect(new Set(SHEET_FIELDS.map((f) => f.key)).size).toBe(11)
})
