import { docSource } from '@/test/doc-source'

/** `docs/06-testing.md`. Tests only — it reads the filesystem at load. */
export const { DOC, section, h2, flat, fences } =
  docSource('docs/06-testing.md')
