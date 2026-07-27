import { expect, test } from 'vitest'
import { renderGlossary } from './glossary'

// reference/glossary.md is a generated snapshot of terms.ts. This fails if a term
// changed without regenerating (`pnpm test -u` from web/). The file lives at the
// repo root, three levels up from here.
test('reference/glossary.md is in sync with terms.ts', async () => {
  await expect(renderGlossary()).toMatchFileSnapshot(
    '../../../reference/glossary.md',
  )
})
