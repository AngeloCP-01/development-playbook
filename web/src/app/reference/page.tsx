import Link from 'next/link'
import {
  CHEATSHEET_GROUPS,
  CHEATSHEETS,
  cheatsheetsByGroup,
  isDrawn,
} from '@/lib/cheatsheets'

export const metadata = {
  title: 'Reference',
  description:
    'Lookup material: cheatsheets grouped by subject, each tethered to the stage it belongs to.',
}

export default function ReferencePage() {
  const drawn = CHEATSHEETS.filter(isDrawn).length

  return (
    <article className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
      <header className="pb-12">
        <p className="t-label text-subtle">Reference</p>
        <h1 className="t-display mt-3 text-3xl sm:text-4xl">Cheatsheets</h1>
        <p className="mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg sm:text-[1.375rem]">
          Lookup material rather than reading material. A stage teaches a
          decision; a sheet answers what that command was.
        </p>
        <p className="mt-6 text-[0.9375rem] text-muted">
          <span className="t-label text-subtle">Drawn · </span>
          <span className="t-data">
            {drawn} of {CHEATSHEETS.length}
          </span>
        </p>
        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>

      <div className="space-y-14">
        {CHEATSHEET_GROUPS.map((group) => (
          <section key={group}>
            <h2 className="t-label text-subtle">{group}</h2>
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
