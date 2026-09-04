import { expect, test } from 'vitest'
import { renderHighlighted } from './generate-highlighted'

// highlighted.generated.ts is a committed snapshot, the same arrangement
// render.test.ts holds reference/cheatsheets.md to. This fails if an
// example's code changed without regenerating (`pnpm gen:highlighted`).
test('highlighted.generated.ts is in sync with the registry', async () => {
  const content = await renderHighlighted()
  await expect(content).toMatchFileSnapshot('./highlighted.generated.ts')
})
