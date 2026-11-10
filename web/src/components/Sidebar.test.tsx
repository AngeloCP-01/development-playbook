import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { STAGES } from '@/lib/stages'
import { CHEATSHEETS } from '@/lib/cheatsheets'
import { Sidebar } from './Sidebar'

const location = vi.hoisted(() => ({
  pathname: '/reference/architecture-patterns',
}))
vi.mock('next/navigation', () => ({ usePathname: () => location.pathname }))
beforeEach(() => {
  location.pathname = '/reference/architecture-patterns'
})

test('keeps the stage index intact, since this change edits a file nothing was guarding', () => {
  render(<Sidebar />)
  const stageNav = screen.getByRole('navigation', { name: 'Stage index' })
  for (const stage of STAGES) {
    expect(
      within(stageNav).getAllByRole('link', { name: new RegExp(stage.title) })
        .length,
      stage.title,
    ).toBeGreaterThan(0)
  }
})

test('renders a second navigation landmark for the reference section', () => {
  render(<Sidebar />)
  const refNav = screen.getByRole('navigation', { name: 'Reference index' })
  for (const sheet of CHEATSHEETS) {
    expect(
      within(refNav).getAllByRole('link', { name: new RegExp(sheet.title) })
        .length,
      sheet.title,
    ).toBeGreaterThan(0)
  }
})

// The mocked pathname is a sheet route. If the sheet link does not carry
// aria-current, the rail stops telling you where you are.
test('marks the current sheet, so the rail still answers "you are here" off the stage routes', () => {
  render(<Sidebar />)
  const refNav = screen.getByRole('navigation', { name: 'Reference index' })
  const current = within(refNav).getByRole('link', { current: 'page' })
  expect(current.getAttribute('href')).toBe('/reference/architecture-patterns')
})

test('flags a not-drawn sheet in the rail, which is how the gap stays visible without opening it', () => {
  render(<Sidebar />)
  const refNav = screen.getByRole('navigation', { name: 'Reference index' })
  const link = within(refNav).getByRole('link', { name: /Python/ })
  expect(within(link).getByText('WIP')).toBeTruthy()
})

test.each([
  ['Glossary', '/reference/glossary'],
  ['Default Stack', '/reference/stack'],
])(
  'marks %s current and closes the mobile drawer when its link is chosen',
  (name, href) => {
    location.pathname = href
    render(<Sidebar />)
    const refNav = screen.getByRole('navigation', { name: 'Reference index' })
    const link = within(refNav).getByRole('link', { name })
    expect(link.getAttribute('href')).toBe(href)
    expect(link.getAttribute('aria-current')).toBe('page')
    expect(within(refNav).getAllByRole('link', { current: 'page' })).toEqual([
      link,
    ])
    const open = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(open)
    expect(open.getAttribute('aria-expanded')).toBe('true')
    expect(document.body.style.overflow).toBe('hidden')
    // jsdom cannot navigate; retain the real click handler and test the drawer.
    link.addEventListener('click', (event) => event.preventDefault())
    fireEvent.click(link)
    expect(open.getAttribute('aria-expanded')).toBe('false')
    expect(document.body.style.overflow).not.toBe('hidden')
  },
)
