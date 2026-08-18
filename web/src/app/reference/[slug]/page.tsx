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
        <h1 className="t-display mt-3 text-3xl sm:text-4xl">{sheet.title}</h1>
        <p className="mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg sm:text-[1.375rem]">
          {sheet.blurb}
        </p>
        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>

      <CheatsheetView sheet={sheet} />
    </article>
  )
}
