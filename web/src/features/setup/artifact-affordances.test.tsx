import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { AnnotatedArtifact } from '@/components/AnnotatedArtifact'
import { ARTIFACTS } from './artifacts'

/**
 * TD-39's copy button and TD-40's conditional tab stop, tested together because
 * they landed together — both wanted the same client boundary in a component
 * that is otherwise server-rendered.
 */

afterEach(() => {
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth')
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
})

/** jsdom reports 0 for both, so overflow has to be simulated. */
function stubWidths(scroll: number, client: number) {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() {
      return this.hasAttribute('data-artifact-scroller') ? scroll : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return this.hasAttribute('data-artifact-scroller') ? client : 0
    },
  })
}

// TD-40. Every line was focusable, so `ci.yml` alone put twenty tab stops in a
// panel and most of them reached nothing — a focus ring on something that is
// not a control and does not scroll. The mechanism is right where a line does
// overflow (WCAG 2.1.1 wants a scrollable region keyboard-reachable), so the
// fix is to apply it only where it is true.
test('a line that fits is not a tab stop, since a focus ring on nothing is noise', () => {
  stubWidths(200, 200)
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)

  const cells = [...container.querySelectorAll('[data-artifact-scroller]')]
  expect(cells.length).toBeGreaterThan(0)
  for (const cell of cells) {
    expect(cell.getAttribute('tabindex'), cell.textContent?.slice(0, 24)).toBe(
      '-1',
    )
  }
})

test('a line that overflows stays reachable, because scrolling it is the only way to read it', () => {
  stubWidths(900, 300)
  const { container } = render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)

  const cells = [...container.querySelectorAll('[data-artifact-scroller]')]
  expect(cells.length).toBeGreaterThan(0)
  for (const cell of cells) {
    expect(cell.getAttribute('tabindex')).toBe('0')
  }
})

// TD-39, the half `select-none` cannot do. Excluding the notes from a selection
// makes a manual copy return only config; it does not tell the reader that
// copying is the intended move, and it still asks them to drag-select twenty
// lines in a scrolling container.
test('copies the artifact’s lines and nothing else, since the notes are not part of the file', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })

  render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)
  fireEvent.click(screen.getByRole('button', { name: /copy .*package\.json/i }))

  expect(writeText).toHaveBeenCalledWith(
    ARTIFACTS.lint.lines.map((l) => l.text).join('\n'),
  )
})

test('names the file in the button, because five panels render one of these', () => {
  render(<AnnotatedArtifact artifact={ARTIFACTS.tsconfig} />)
  expect(
    screen.getByRole('button', { name: /copy tsconfig\.json/i }),
  ).toBeDefined()
})

// The confirmation is the whole point of a copy button: a click that silently
// succeeds is indistinguishable from one that silently failed.
test('confirms the copy, since a silent success reads the same as a silent failure', async () => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })

  render(<AnnotatedArtifact artifact={ARTIFACTS.lint} />)
  const button = screen.getByRole('button', { name: /copy/i })
  expect(button.textContent).toMatch(/copy/i)

  fireEvent.click(button)
  await vi.waitFor(() => expect(button.textContent).toMatch(/copied/i))
})
