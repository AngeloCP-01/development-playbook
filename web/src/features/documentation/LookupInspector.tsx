import { Card } from '@/components/ui'
import { InlineCode } from '@/components/InlineCode'
import { SelectionTabs } from './SelectionTabs'
import type { LookupEntry } from './lookups'
export function LookupInspector({
  title,
  entries,
}: {
  title: string
  entries: readonly LookupEntry[]
}) {
  return (
    <Card>
      <h3 className="t-head mb-4 text-lg">{title}</h3>
      <SelectionTabs
        label={title}
        items={entries.map((entry) => ({
          id: entry.id,
          label: entry.label,
          content: (
            <div>
              <p className="mb-4 text-sm text-muted">{entry.summary}</p>
              <dl className="space-y-3">
                {entry.details.map((fact) => (
                  <div key={fact.label} className="min-w-0">
                    <dt className="t-label mb-1 text-subtle">{fact.label}</dt>
                    <dd className="break-words text-sm leading-relaxed text-muted">
                      <InlineCode text={fact.text} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ),
        }))}
      />
    </Card>
  )
}
