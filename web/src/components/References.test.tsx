import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { References } from './References'
import { getReferences } from '@/lib/references'

// I1 from the whole-branch review. Stage 04's reference cards quote
// `engines.node`, `22.x` and `noUncheckedIndexedAccess`, and `adds` rendered
// raw, so three literal backticks shipped on the live page. The branch had
// already fixed this class twice — D-67 — and `PATTERNS.md` says in writing
// that grepping the built HTML is the only method that finds it. Nobody re-ran
// the grep after the commit that added the references, ten commits later.
//
// This is what makes the grep unnecessary for this component.
test('renders a reference’s backticked spans as code rather than printing the backticks', () => {
  const { container } = render(<References slug="04-project-setup" />)

  expect(container.textContent).not.toContain('`')
  expect(container.querySelectorAll('code').length).toBeGreaterThan(0)
})

test('renders one card per reference the stage declares', () => {
  const { container } = render(<References slug="04-project-setup" />)
  expect(container.querySelectorAll('a[href^="http"]')).toHaveLength(
    getReferences('04-project-setup').length,
  )
})

// The component is dropped into every stage, including the twelve with no
// entries, so rendering nothing has to stay a supported state rather than an
// empty heading with a rule under it.
test('renders nothing for a stage with no references, since it ships in all eighteen', () => {
  const { container } = render(<References slug="08-refactoring" />)
  expect(container.innerHTML).toBe('')
})
