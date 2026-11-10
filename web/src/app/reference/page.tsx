import Link from 'next/link'
import { REFERENCE_RESOURCES } from '@/lib/reference-resources'
import {
  CHEATSHEET_GROUPS,
  CHEATSHEETS,
  cheatsheetsByGroup,
  isDrawn,
} from '@/lib/cheatsheets'

export const metadata = {
  title: 'Reference',
  description:
    'Glossary definitions, default stack choices and cheatsheets grouped by subject, with links to the stages that use them.',
}

export default function ReferencePage() {
  const drawn = CHEATSHEETS.filter(isDrawn).length

  return (
    <article className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
      <header className="pb-12">
        <p className="t-label text-subtle">Reference</p>
        <h1 className="t-display mt-3 text-3xl sm:text-4xl">Reference</h1>
        <p className="mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg sm:text-[1.375rem]">
          Look up a term, choose a tool or find a command. Full reference
          resources sit beside the stage-tethered cheatsheets.
        </p>
        <p className="mt-6 text-[0.9375rem] text-muted">
          <span className="t-label text-subtle">Sheets drawn · </span>
          <span className="t-data">
            {drawn} of {CHEATSHEETS.length}
          </span>
        </p>
        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>

      <section aria-labelledby="reference-resources" className="pb-12">
        <h2 id="reference-resources" className="t-head text-xl text-fg">
          Lookup resources
        </h2>
        <ul className="mt-4 border-t border-line">
          {REFERENCE_RESOURCES.map((resource) => (
            <li
              key={resource.slug}
              className="measure-full border-b border-line"
            >
              <Link
                href={resource.href}
                className="group flex min-h-11 flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
              >
                <span className="t-head text-base text-fg group-hover:text-brand">
                  {resource.title}
                </span>
                <span className="w-full text-[0.9375rem] leading-relaxed text-muted sm:w-auto sm:flex-1">
                  {resource.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <h2 className="t-head pb-6 text-xl text-fg">Cheatsheets</h2>
      <div className="space-y-14">
        {CHEATSHEET_GROUPS.map((group) => (
          <section key={group}>
            <h3 className="t-label text-subtle">{group}</h3>
            <ul className="mt-4 border-t border-line">
              {cheatsheetsByGroup(group).map((sheet) => (
                <li key={sheet.slug} className="border-b border-line">
                  <Link
                    href={`/reference/${sheet.slug}`}
                    className="group flex min-h-11 flex-wrap items-baseline gap-x-4 gap-y-1 py-4 transition-colors duration-150"
                  >
                    <span className="t-head text-base text-fg transition-colors duration-150 group-hover:text-brand">
                      {sheet.title}
                    </span>
                    {!isDrawn(sheet) && (
                      <span className="t-label text-[9px] text-subtle">
                        Not drawn
                      </span>
                    )}
                    <span className="w-full text-[0.9375rem] leading-relaxed text-muted sm:w-auto sm:flex-1">
                      {sheet.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  )
}
