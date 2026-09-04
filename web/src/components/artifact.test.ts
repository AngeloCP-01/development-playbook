import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

const SOURCE = readFileSync(
  fileURLToPath(new URL('./artifact.ts', import.meta.url)),
  'utf8',
)

/**
 * Stage 05 quotes twelve `.tsx` and `.ts` blocks. Stage 04's union had no
 * `'tsx'`, so this fails before the move and is the reason the move is not
 * purely mechanical.
 */
test('the language union carries every language a stage actually quotes', () => {
  for (const lang of ['json', 'jsonc', 'yaml', 'ts', 'tsx', 'bash']) {
    expect(SOURCE, lang).toContain(`'${lang}'`)
  }
})
