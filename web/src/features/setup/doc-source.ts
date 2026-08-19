import { docSource } from '@/test/doc-source'

/**
 * `docs/04-project-setup.md`. The helpers and the three bugs they encode now
 * live in `src/test/doc-source.ts`, extracted when stage 05 would have been the
 * third copy.
 */
export const { DOC, section, h2, flat, fences } = docSource(
  'docs/04-project-setup.md',
)
