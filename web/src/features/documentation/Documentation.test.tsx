import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { getStage } from '@/lib/stages'
import { getReferences } from '@/lib/references'
import { STAGE_CONTENT } from '../stage-content'
import { STEP_IDS_BY_SLUG } from '../step-ids'
import { Documentation } from './Documentation'
import { STEP_IDS } from './steps'
import { TRAPS } from './closing'
afterEach(() => {
  window.localStorage.clear()
  window.history.replaceState(null, '', '/')
})
test('documentation is a continuous registered stage whose declared rail includes every approved judgment', () => {
  const ids = [
    'choose',
    'readme',
    'decisions',
    'reference',
    'comments',
    'changes',
    'history',
    'ai',
    'your-change',
    'your-evidence',
    'checklist',
    'traps',
  ]
  expect([...STEP_IDS]).toEqual(ids)
  expect(STEP_IDS_BY_SLUG['10-documentation']).toEqual(ids)
  expect(getStage('10-documentation')).toMatchObject({
    ready: true,
    cadence: 'Continuous',
    timing: 'Continuously, a little with every change.',
    blurb:
      'Help the next person use the system, and preserve the reasons behind it.',
  })
  expect(STAGE_CONTENT['10-documentation']).toBe(Documentation)
  render(<Documentation />)
  const rail = screen.getByRole('tablist', { name: 'Stage steps' })
  expect([...rail.querySelectorAll('[role=tab]')].map((tab) => tab.id)).toEqual(
    ids.map((id) => `tab-${id}`),
  )
  for (const id of ids) {
    fireEvent.click(document.getElementById(`tab-${id}`)!)
    expect(document.getElementById(`panel-${id}`)).toBeTruthy()
    expect(
      document
        .getElementById(`panel-${id}`)!
        .querySelector('button,input,textarea,[role=tablist]'),
    ).toBeTruthy()
  }
})
test('all eight traps reveal corrective action and the references add five distinct sources', () => {
  render(<Documentation />)
  fireEvent.click(document.getElementById('tab-traps')!)
  expect(TRAPS.map((t) => t.id)).toEqual([
    'late',
    'why-only',
    'templates',
    'history',
    'generation',
    'claims',
    'privacy',
    'evidence',
  ])
  for (const trap of TRAPS) {
    fireEvent.click(screen.getByRole('button', { name: trap.title }))
    expect(screen.getByText(trap.detail)).toBeTruthy()
  }
  expect(getReferences('10-documentation').map((r) => r.url)).toEqual([
    'https://diataxis.fr/start-here/',
    'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
    'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
    'https://c4model.com/diagrams/checklist',
    'https://www.writethedocs.org/guide/docs-as-code/',
  ])
  for (const reference of getReferences('10-documentation'))
    expect(
      screen
        .getByRole('link', { name: new RegExp(reference.title) })
        .getAttribute('href'),
    ).toBe(reference.url)
})
