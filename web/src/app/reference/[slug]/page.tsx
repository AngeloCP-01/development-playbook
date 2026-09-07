import { notFound } from 'next/navigation'
import { CHEATSHEETS, cheatsheetBySlug } from '@/lib/cheatsheets'
import { CheatsheetView } from '@/components/Cheatsheet'

export function generateStaticParams() {
  return CHEATSHEETS.map((sheet) => ({ slug: sheet.slug }))
}

export async function generateMetadata(props: PageProps<'/reference/[slug]'>) {
  const { slug } = await props.params
  const sheet = cheatsheetBySlug(slug)
  if (!sheet) return {}
  return { title: sheet.title, description: sheet.blurb }
}

export default async function CheatsheetPage(
  props: PageProps<'/reference/[slug]'>,
) {
  const { slug } = await props.params
  const sheet = cheatsheetBySlug(slug)
  if (!sheet) notFound()

  return (
    <article className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
      <header className="pb-12">
        <p className="t-label text-subtle">{sheet.group}</p>
        {/* `hyphens-auto break-words` because this title is data, not a
            literal: `t-display` sets Archivo at `wdth` 118, so a single long
            word can be wider than the 272px available inside `px-6` at 320px
            and push the whole page sideways. "Deployment Environments" did —
            ENVIRONMENTS alone measured 298px, and the 26px it could not fit
            was the page's entire 2px overflow once the padding is counted.
            Hyphenation (the document is `lang="en"`) breaks it at a syllable
            rather than mid-word; `break-words` is the fallback for a word no
            dictionary can split. Neither fires unless a word genuinely does
            not fit, so every title short enough is untouched. The index page's
            h1 needs neither — its title is the literal "Cheatsheets". */}
        <h1 className="t-display mt-3 text-3xl hyphens-auto break-words sm:text-4xl">
          {sheet.title}
        </h1>
        <p className="mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg sm:text-[1.375rem]">
          {sheet.blurb}
        </p>
        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>

      <CheatsheetView sheet={sheet} />
    </article>
  )
}
