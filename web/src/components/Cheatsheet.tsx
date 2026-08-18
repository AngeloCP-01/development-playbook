import Link from 'next/link'
import Image from 'next/image'
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

      {sheet.source?.image && (
        <figure className="mt-14">
          {/* A plate, because every one of these graphics has a light background
              and would punch a hole in the cyanotype unframed. The border and
              padding give it an edge to sit against in both themes.

              Not dimmed at rest: the obvious dark-mode trick is to drop opacity
              until hover, but the whole reason the graphic is here is to be
              read, and dimming content to make it blend is a worse trade than
              letting it be bright.

              next/image rather than a plain tag, despite these already being
              WebP: the win is not re-encoding, it is srcset. These are up to
              1536px tall and a phone has no use for the full file. */}
          <div className="border border-line-strong bg-sunken p-3 sm:p-4">
            <Image
              src={sheet.source.image.src}
              width={sheet.source.image.width}
              height={sheet.source.image.height}
              sizes="(min-width: 1024px) 55rem, 100vw"
              // The transcription below is a complete text equivalent, so on a
              // drawn sheet the graphic is decorative and announcing it would
              // make a screen reader read the page twice. On an undrawn sheet it
              // is the only content, so it has to describe itself.
              alt={isDrawn(sheet) ? '' : sheet.source.image.alt}
              aria-hidden={isDrawn(sheet) || undefined}
              className="h-auto w-full"
            />
          </div>
          <figcaption className="t-label mt-3 text-subtle">
            The gathered original
          </figcaption>
        </figure>
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
