import { docSource } from '@/test/doc-source'

/** `docs/05-development.md`. Tests only — it reads the filesystem at load. */
export const { DOC, section, h2, flat, fences } = docSource(
  'docs/05-development.md',
)
