import Link from 'next/link'
import { getStage } from '@/lib/stages'
import { TERMS, type Term } from '@/lib/terms'

export function GlossaryReference({
  terms = TERMS,
}: {
  terms?: Record<string, Term>
}) {
  const entries = Object.entries(terms).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name),
  )

  return (
    <article className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
      <header className="pb-10">
        <Link
          href="/reference"
          className="t-label inline-flex min-h-11 items-center text-muted underline underline-offset-4"
        >
          Reference index
        </Link>
        <h1 className="t-display mt-3 break-words text-3xl sm:text-4xl">
          Glossary
        </h1>
        <p className="mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg">
          Find a term, read its full definition, then follow the stage that puts
          it to work.
        </p>
        <p className="mt-6 text-muted">
          Entries are alphabetical. Use your browser’s Find command to look for
          a word; each term has a link you can save or share.
        </p>
        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>
      <dl className="max-w-[68ch] divide-y divide-line border-y border-line">
        {entries.map(([id, term]) => {
          const stage = term.see ? getStage(term.see) : undefined
          return (
            <div key={id} id={id} tabIndex={-1} className="scroll-mt-24 py-6">
              <dt className="t-head break-words text-lg text-fg">
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 hover:text-brand"
                >
                  {term.name}
                </a>
              </dt>
              <dd className="mt-2">
                <p className="leading-relaxed text-muted">{term.full}</p>
                {stage && (
                  <Link
                    href={`/stages/${stage.slug}`}
                    className="t-ui mt-3 inline-flex min-h-11 items-center text-sm text-blueprint underline underline-offset-4"
                  >
                    See {stage.num} · {stage.title}
                  </Link>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </article>
  )
}
