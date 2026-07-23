import type { Stage } from '@/lib/stages'

/**
 * The signature element: a drawing title block.
 *
 * Real technical drawings carry one in the corner — sheet number, revision,
 * scale, drawn-by. Here it carries what the playbook actually wants you to
 * read before anything else: the stage's real cadence, which is frequently not
 * what its number implies. The number is a filing code, and this says so.
 */
export function TitleBlock({ stage }: { stage: Stage }) {
  const cells = [
    { label: 'Sheet', value: stage.num, mono: true },
    { label: 'Section', value: stage.group },
    { label: 'Cadence', value: stage.cadence, wide: true },
  ]

  return (
    <div className="border border-fg">
      <div className="grid grid-cols-2 sm:grid-cols-[auto_1fr_2fr]">
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={[
              'border-fg px-3 py-2.5',
              i > 0 ? 'border-l' : '',
              c.wide ? 'col-span-2 border-t sm:col-span-1 sm:border-t-0' : '',
              c.wide && i > 0 ? 'border-l-0 sm:border-l' : '',
            ].join(' ')}
          >
            <div className="t-label text-subtle">{c.label}</div>
            <div
              className={[
                'mt-0.5 truncate',
                c.mono ? 't-data text-lg leading-tight' : 't-ui text-sm',
              ].join(' ')}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-fg bg-fg px-3 py-1.5">
        <h1 className="t-display text-pretty text-[clamp(1.125rem,4.4vw,3.5rem)] text-bg">
          {stage.title}
        </h1>
      </div>
    </div>
  )
}
