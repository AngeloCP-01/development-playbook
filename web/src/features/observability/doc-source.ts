// web/src/features/observability/doc-source.ts
import { docSource } from '@/test/doc-source'

export const { DOC, section, h2, flat, fences } = docSource(
  'docs/15-observability.md',
)
