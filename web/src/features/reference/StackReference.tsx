import Link from 'next/link'
import { getStage } from '@/lib/stages'
import { STACK, type StackDocument } from '@/lib/stack'

export function StackReference({
  document = STACK,
}: {
  document?: StackDocument
}) {
  const deviationStage = document.deviationStage
    ? getStage(document.deviationStage)
    : undefined
  return (
    <article className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
      <header className="pb-10">
        <Link
          href="/reference"
          className="t-label inline-flex min-h-11 items-center text-muted underline underline-offset-4"
        >
          Reference index
        </Link>
        <h1 className="t-display mt-3 hyphens-auto break-words text-3xl sm:text-4xl">
          {document.title}
        </h1>
        {document.introduction.map((paragraph, index) => (
          <p
            key={paragraph}
            className={
              index === 0
                ? 'mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg'
                : 'mt-6 leading-relaxed text-muted'
            }
          >
            {paragraph}
          </p>
        ))}
        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>
      <section aria-labelledby="version-policy">
        <h2 id="version-policy" className="t-head text-xl text-fg">
          Version policy
        </h2>
        {document.versionPolicy.map((paragraph) => (
          <p key={paragraph} className="mt-4 leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
        <p className="mt-4 text-sm leading-relaxed text-subtle">
          {document.reviewNote}
        </p>
      </section>
      {document.groups.map((group) => (
        <section key={group.id} aria-labelledby={group.id} className="mt-12">
          <h2 id={group.id} className="t-label scroll-mt-24 pb-4 text-subtle">
            {group.title}
          </h2>
          <div className="border-b border-line">
            {group.choices.map((choice) => {
              const stage = choice.see ? getStage(choice.see) : undefined
              return (
                <section
                  key={choice.id}
                  id={choice.id}
                  tabIndex={-1}
                  className="scroll-mt-24 border-t border-line py-6 sm:grid sm:grid-cols-[minmax(8rem,0.3fr)_minmax(0,1fr)] sm:gap-6"
                >
                  <h3 className="t-ui text-sm font-semibold text-subtle">
                    {choice.concern}
                  </h3>
                  <div className="min-w-0">
                    <p className="t-head mt-3 break-words text-lg text-fg sm:mt-0">
                      {choice.tool}
                    </p>
                    {choice.version && (
                      <p className="t-data mt-2 text-sm text-subtle">
                        {choice.version}
                      </p>
                    )}
                    <p className="mt-4 leading-relaxed text-muted">
                      {choice.rationale}
                    </p>
                    {choice.note && (
                      <p className="mt-3 leading-relaxed text-muted">
                        {choice.note}
                      </p>
                    )}
                    {stage && (
                      <Link
                        href={`/stages/${stage.slug}`}
                        className="t-ui mt-3 inline-flex min-h-11 items-center text-sm text-blueprint underline underline-offset-4"
                      >
                        See {stage.num} · {stage.title}
                      </Link>
                    )}
                    {choice.sources && choice.sources.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {choice.sources.map((source) => (
                          <li key={source.href}>
                            <a
                              href={source.href}
                              className="t-ui inline-flex min-h-11 items-center text-sm text-blueprint underline underline-offset-4"
                            >
                              {source.label}
                            </a>
                            {source.reviewed && (
                              <span className="t-data block text-xs text-subtle">
                                Reviewed {source.reviewed}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        </section>
      ))}
      <section aria-labelledby="when-to-deviate" className="mt-12">
        <h2 id="when-to-deviate" className="t-head text-xl text-fg">
          When to deviate
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          {document.deviationIntro}
        </p>
        {deviationStage && (
          <Link
            href={`/stages/${deviationStage.slug}`}
            className="t-ui mt-3 inline-flex min-h-11 items-center text-sm text-blueprint underline underline-offset-4"
          >
            See {deviationStage.num} · {deviationStage.title}
          </Link>
        )}
        <div className="mt-4 space-y-6">
          {document.deviations.map((deviation) => (
            <section
              key={deviation.id}
              id={`deviation-${deviation.id}`}
              className="scroll-mt-24 border-l border-line-strong pl-5"
            >
              <h3 className="t-head text-base text-fg">{deviation.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">
                {deviation.detail}
              </p>
            </section>
          ))}
        </div>
      </section>
      <section
        aria-labelledby="keeping-current"
        className="mt-12 border-t border-line pt-6"
      >
        <h2 id="keeping-current" className="t-head text-xl text-fg">
          Keeping this file honest
        </h2>
        {document.upkeep.map((paragraph) => (
          <p key={paragraph} className="mt-4 leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </section>
    </article>
  )
}
