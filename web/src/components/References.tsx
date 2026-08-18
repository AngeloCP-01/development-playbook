import { ArrowUpRight } from 'lucide-react'
import { getReferences } from '@/lib/references'
import { InlineCode } from './InlineCode'

/**
 * Outward links, closing a stage. Each entry leads with what it adds rather
 * than its title alone, so the reader can judge the click before making it.
 *
 * Renders nothing when a stage has no references, so it is safe to drop into
 * every stage as they are built.
 */
export function References({ slug }: { slug: string }) {
  const refs = getReferences(slug)
  if (refs.length === 0) return null

  return (
    <section className="scroll-mt-24">
      <div className="mb-4 flex items-center gap-3">
        <span className="t-label text-brand">Going deeper</span>
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>

      <p className="measure mb-5 text-[0.9375rem] leading-relaxed text-muted">
        This sheet is opinionated and deliberately narrow. These are the sources
        worth reading when it is not enough — each one noted with what it adds.
      </p>

      <ul className="border-t border-line">
        {refs.map((r) => (
          <li key={r.url} className="measure-full border-b border-line">
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex min-h-11 gap-4 py-4"
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="t-head text-[1.0625rem] transition-colors duration-150 group-hover:text-brand">
                    {r.title}
                  </span>
                  <span className="t-label text-subtle">{r.source}</span>
                </span>
                <span className="mt-1.5 block max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted">
                  <InlineCode text={r.adds} />
                </span>
              </span>
              <ArrowUpRight
                className="mt-0.5 size-4 shrink-0 text-subtle transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                aria-hidden
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
