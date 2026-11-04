import type { Page } from '@playwright/test'
import { expect, test, vi } from 'vitest'
import { auditPages } from '../../e2e/audit-pages'

test('the production sweep includes both native resources as well as existing reference sheets', async () => {
  // The browser boundary supplies one step for each stage; auditPages itself
  // decides which reference URLs join the sweep. Built-page checks in
  // audit-pages.spec.ts verify these URLs against the actual application.
  const page = {
    goto: vi.fn().mockResolvedValue(null),
    $$eval: vi.fn().mockResolvedValue(['fixture-step']),
  } as unknown as Page
  const paths = await auditPages(page)
  expect(paths).toContain('/reference/glossary')
  expect(paths).toContain('/reference/stack')
  expect(paths).toContain('/reference/architecture-patterns')
  expect(paths).toContain('/reference/python')
  expect(new Set(paths).size).toBe(paths.length)
})
