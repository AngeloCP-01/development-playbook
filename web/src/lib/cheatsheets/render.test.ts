import { expect, test } from 'vitest'
import { renderCheatsheets } from './render'

test('generated reference markdown includes the original security diagram with its text equivalent', () => {
  const markdown = renderCheatsheets()
  expect(markdown).toContain(
    '![User B is denied access to User A’s invoice after the server checks ownership.](../web/public/reference/security-invoice-audit.svg)',
  )
})

// reference/cheatsheets.md is a generated snapshot of the registry. This fails
// if a sheet changed without regenerating (`pnpm gen:cheatsheets`). The file
// lives at the repo root, four levels up from here.
test('reference/cheatsheets.md is in sync with the registry', async () => {
  await expect(renderCheatsheets()).toMatchFileSnapshot(
    '../../../../reference/cheatsheets.md',
  )
})
