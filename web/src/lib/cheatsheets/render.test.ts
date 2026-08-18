import { expect, test } from 'vitest'
import { renderCheatsheets } from './render'

// reference/cheatsheets.md is a generated snapshot of the registry. This fails
// if a sheet changed without regenerating (`pnpm gen:cheatsheets`). The file
// lives at the repo root, four levels up from here.
test('reference/cheatsheets.md is in sync with the registry', async () => {
  await expect(renderCheatsheets()).toMatchFileSnapshot(
    '../../../../reference/cheatsheets.md',
  )
})
