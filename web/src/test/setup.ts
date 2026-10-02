/**
 * The `dom` vitest project's only setup: React Testing Library's cleanup
 * between tests, which unmounts anything a test rendered. Without it a second
 * `render()` in the same file finds two copies of every element and `getByText`
 * throws on the ambiguity rather than on the thing under test.
 *
 * One responsibility on purpose. If this file grows a second, that is a signal
 * about the tests rather than a convenience to accept — the one exception
 * anticipated in the spec is a `matchMedia` stub, which jsdom does not
 * implement, for the first component that needs one.
 *
 * `ResizeObserver` is that exception arriving under a different name. jsdom
 * implements no layout, so it has no `ResizeObserver`, and `OverflowFocus`
 * needs one to keep a code line's tab stop true across a resize (TD-40). It
 * lived in the one test that exercised it directly until a second file needed
 * it for a component it merely renders, which is the point the spec's rule
 * describes: a stub every panel test would otherwise repeat belongs here.
 *
 * A no-op is the right shape. Nothing in jsdom resizes, so the callback would
 * never fire anyway; what the tests need is for construction not to throw.
 * A test that actually cares about the measured result stubs the widths itself.
 *
 * `Element.prototype.scrollIntoView` is the third arrival, on the same rule and
 * for the same reason: jsdom implements no layout and therefore no scrolling.
 * `Stepper` calls it on every step change to bring the new panel to the top, so
 * *any* test that activates a step throws `scrollIntoView is not a function`
 * from inside an effect — the component is fine and the environment is not.
 * Stubbing it here rather than per-file is what makes a panel other than the
 * first one testable at all; stage 14's coverage-walk fixes were the first
 * tests to need that, and they will not be the last.
 */

import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(cleanup)

class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', NoopResizeObserver)

Element.prototype.scrollIntoView = () => {}
