import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { isDrawn, type Cheatsheet } from '@/lib/cheatsheets'
import { getStage } from '@/lib/stages'

/**
 * One renderer for every sheet, so sheet number twelve costs no new UI.
 *
 * Rows are a grid rather than a table on purpose: a table sets its own minimum
 * width from its content and pushes the page into horizontal scroll at 320px,
 * which the audit suite fails on. The grid collapses to stacked rows instead.
 *
 * No copy button yet. Nothing in the registry has code rows today, and a control
 * with no content to act on is untestable — it arrives with the first sheet that
 * needs it.
 */
export function CheatsheetView({ sheet }: { sheet: Cheatsheet }) {
  const stage = sheet.stage ? getStage(sheet.stage) : undefined

  return (
    <div>
      {stage && (
        <p className="mb-10">
          <Link
            href={`/stages/${stage.slug}`}
            className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-150 hover:text-fg"
          >
            <span className="t-data text-[11px] text-subtle transition-colors duration-150 group-hover:text-brand">
              {stage.num}
            </span>
            <span className="t-label text-subtle">Belongs to</span>
            <span className="t-ui">{stage.title}</span>
            <ArrowUpRight
              className="size-4 text-subtle transition-colors duration-150 group-hover:text-brand"
              aria-hidden
            />
          </Link>
        </p>
      )}

      {isDrawn(sheet) ? (
        <div className="space-y-12">
          {sheet.sections.map((section) => (
            <section key={section.title}>
              <h2 className="t-head text-lg">{section.title}</h2>
              {section.note && (
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  {section.note}
                </p>
              )}

              <dl className="mt-5 border-t border-line">
                {section.rows.map((row) => (
                  <div
                    key={row.code ?? row.term ?? row.what}
                    className="grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"
                  >
                    <dt className="min-w-0">
                      {row.code ? (
                        <code className="t-data block break-words text-[0.8125rem] text-fg">
                          {row.code}
                        </code>
                      ) : (
                        <span className="t-ui font-medium text-fg">
                          {row.term}
                        </span>
                      )}
                    </dt>
                    <dd className="min-w-0">
                      <p className="text-[0.9375rem] leading-relaxed text-fg">
                        {row.what}
                      </p>
                      {row.when && (
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {row.when}
                        </p>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-line-strong p-10 text-center">
          <p className="t-label text-subtle">Sheet not drawn</p>
          <p className="mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
            This sheet is registered so the gap is visible. The content has not
            been gathered yet.
          </p>
        </div>
      )}

      {sheet.source && (
        <footer className="mt-16 border-t border-line pt-6">
          <p className="t-label text-subtle">Source</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {sheet.source.url ? (
              <a
                href={sheet.source.url}
                className="underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-fg"
              >
                {sheet.source.title}
              </a>
            ) : (
              sheet.source.title
            )}
            <span> — {sheet.source.author}</span>
          </p>
        </footer>
      )}
    </div>
  )
}
