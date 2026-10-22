import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { CopyMarkdown } from './CopyMarkdown'
import { documentMarkdown, type DocExample } from './documents'
export function DocumentExample({
  example,
  relatedControl,
}: {
  example: DocExample
  relatedControl?: ReactNode
}) {
  return (
    <section aria-label={example.filename} className="min-w-0">
      <Card>
        <p className="t-data mb-3 break-words text-sm text-muted">
          {example.filename}
        </p>
        <h3 className="t-head mb-3 text-lg">{example.title}</h3>
        {example.meta.map((line) => (
          <p key={line} className="break-words text-sm text-muted">
            {line}
          </p>
        ))}
        {example.related && (
          <p className="mt-2 break-words text-sm text-muted">
            {example.related.prefix}: {example.related.label} (
            {example.related.filename})
          </p>
        )}
        {relatedControl}
        {example.blocks.map((block) => (
          <div key={block.heading} className="mt-4">
            <h4 className="t-ui mb-1 text-sm font-semibold">{block.heading}</h4>
            {block.paragraphs.map((line) => (
              <p
                key={line}
                className="break-words text-sm leading-relaxed text-muted"
              >
                {line}
              </p>
            ))}
          </div>
        ))}
        <CopyMarkdown
          text={documentMarkdown(example)}
          label={
            example.id === 'readme'
              ? 'Copy README outline'
              : `Copy ${example.id === 'template' ? 'ADR template' : `ADR ${example.id}`}`
          }
          manualLabel={`${example.filename} Markdown`}
        />
      </Card>
    </section>
  )
}
