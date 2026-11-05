import type { Cheatsheet } from '@/lib/cheatsheets'
import { studySections } from '@/lib/cheatsheets/study-sections'
import { Stepper } from './Stepper'
import { SheetActivities } from './SheetActivities'

/** Server-built teaching follows the checked data traversal used by Markdown. */
export function StudySheet({ sheet }: { sheet: Cheatsheet }) {
  const sections = studySections(sheet)
  if (!sections) return null
  return (
    <Stepper
      ariaLabel={`${sheet.title} sections`}
      steps={sections.map((section) => ({
        id: section.study.id,
        label: section.study.label,
        hint: section.study.hint,
        content: (
          <section className="min-w-0 [&_button]:scroll-mt-36 [&_button]:scroll-mb-4">
            <h2 className="t-head text-xl">{section.title}</h2>
            {section.note && <p className="mt-3 text-muted">{section.note}</p>}
            <div className="mt-7 space-y-7">
              {section.rows.map((row) => (
                <section
                  key={row.term ?? row.code}
                  className="min-w-0 border-t border-line pt-5"
                >
                  <h3 className="t-head text-base">{row.term ?? row.code}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed">
                    {row.what}
                  </p>
                  {row.example?.map((example) => (
                    <div key={example.label} className="mt-3 min-w-0">
                      <p className="t-label mb-1.5 text-subtle">
                        {example.label}
                      </p>
                      <pre className="overflow-x-auto border border-line bg-sunken p-3 text-[0.8125rem]">
                        <code className="t-data whitespace-pre text-fg">
                          {example.code}
                        </code>
                      </pre>
                    </div>
                  ))}
                  {row.when && (
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {row.when}
                    </p>
                  )}
                </section>
              ))}
            </div>
            <SheetActivities
              slug={sheet.slug}
              activities={section.activities}
            />
          </section>
        ),
      }))}
    />
  )
}
