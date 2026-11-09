import type { RowExample, SheetActivity } from '@/lib/cheatsheets'
import { RevealList } from './RevealList'

function ActivityCode({
  example,
}: {
  example: Pick<RowExample, 'label' | 'code'>
}) {
  return (
    <div className="min-w-0">
      <p className="t-label mb-1.5 text-subtle">{example.label}</p>
      <pre
        tabIndex={0}
        className="overflow-x-auto border border-line bg-sunken p-3 text-[0.8125rem]"
      >
        <code className="t-data whitespace-pre text-fg">{example.code}</code>
      </pre>
    </div>
  )
}

/** Prompts remain visible so opening a solution never removes its question. */
export function SheetActivities({
  slug,
  activities,
  headingLevel = 2,
}: {
  slug: string
  activities: SheetActivity[]
  headingLevel?: 2 | 4
}) {
  const Heading = headingLevel === 4 ? 'h4' : 'h2'
  if (!activities.length) return null
  return (
    <section className="mt-12">
      <Heading className="t-head text-lg">Practice</Heading>
      <div className="mt-5 space-y-6 [&_li]:max-w-none!">
        {activities.map((activity) => (
          <RevealList
            key={activity.id}
            headingLevel={headingLevel === 4 ? 5 : 3}
            idPrefix={`sheet-${slug}-activity`}
            header={
              <div className="space-y-3 p-5">
                <p className="t-head">{activity.title}</p>
                <p className="text-[0.9375rem] leading-relaxed">
                  {activity.prompt}
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  {activity.context}
                </p>
                {activity.starter && (
                  <ActivityCode example={activity.starter} />
                )}
              </div>
            }
            rows={[
              {
                id: activity.id,
                title: `Solution: ${activity.title}`,
                body: (
                  <div className="min-w-0 space-y-3 text-[0.9375rem] leading-relaxed">
                    <p>{activity.answer}</p>
                    {activity.solution && (
                      <ActivityCode example={activity.solution} />
                    )}
                    <p className="t-label text-subtle">Why it works</p>
                    <p>{activity.explanation}</p>
                    {activity.followUp && (
                      <div className="space-y-2">
                        <p className="t-label text-subtle">Follow-up</p>
                        <p>{activity.followUp}</p>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        ))}
      </div>
    </section>
  )
}
