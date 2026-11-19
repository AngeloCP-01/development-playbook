import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('animates from the button center while saving and applying the next theme', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }))
  const animate = vi.fn()
  Object.defineProperty(document.documentElement, 'animate', {
    configurable: true,
    value: animate,
  })
  const start = vi.fn((update: () => void) => {
    update()
    return { ready: Promise.resolve(), finished: Promise.resolve() }
  })
  Object.defineProperty(document, 'startViewTransition', {
    configurable: true,
    value: start,
  })
  render(<ThemeToggle />)
  const button = screen.getByRole('button')
  vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
    left: 20,
    top: 40,
    width: 44,
    height: 44,
  } as DOMRect)
  await act(async () => fireEvent.click(button))
  expect(start).toHaveBeenCalledOnce()
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem('playbook:theme')).toBe('"light"')
  expect(animate).toHaveBeenCalledWith(
    {
      clipPath: [
        'circle(0px at 42px 62px)',
        expect.stringMatching(/^circle\([\d.]+px at 42px 62px\)$/),
      ],
    },
    expect.objectContaining({
      duration: 560,
      pseudoElement: '::view-transition-new(root)',
    }),
  )
  expect(screen.getByRole('button').getAttribute('aria-label')).toContain(
    'Light theme',
  )
})

it.each([true, false])(
  'switches without animation with reduced motion or missing support (%s)',
  (reduced) => {
    vi.stubGlobal('matchMedia', () => ({ matches: reduced }))
    const start = vi.fn()
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: reduced ? start : undefined,
    })
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(start).not.toHaveBeenCalled()
    expect(document.documentElement.dataset.theme).toBe('light')
    fireEvent.click(button)
    expect(document.documentElement.dataset.theme).toBe('dark')
    fireEvent.click(button)
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  },
)
