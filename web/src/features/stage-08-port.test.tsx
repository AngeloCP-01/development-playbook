import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { STAGE_CONTENT } from './stage-content'
import { STEP_IDS_BY_SLUG } from './step-ids'
import { getStage } from '@/lib/stages'
import { STEP_IDS } from './security-audit/content'

test('Stage 08 is ready only with its full audit rail registered', () => {
  const slug = '08-security-audit'
  expect(getStage(slug)?.ready).toBe(true)
  expect(STEP_IDS_BY_SLUG[slug]).toEqual(STEP_IDS)
  const Stage = STAGE_CONTENT[slug]
  expect(Stage).toBeDefined()
  render(<Stage />)
  expect(screen.getAllByRole('tab')).toHaveLength(STEP_IDS.length)
})
