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
 */

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)
