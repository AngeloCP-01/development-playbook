import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { STAGES, getStage } from '@/lib/stages'
import { STAGE_CONTENT } from '@/features/stage-content'
import { TitleBlock } from '@/components/TitleBlock'

export function generateStaticParams() {
  return STAGES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(props: PageProps<'/stages/[slug]'>) {
  const { slug } = await props.params
  const stage = getStage(slug)
  if (!stage) return {}
  return { title: `${stage.num}. ${stage.title}`, description: stage.blurb }
}

export default async function StagePage(props: PageProps<'/stages/[slug]'>) {
  const { slug } = await props.params
  const stage = getStage(slug)
  if (!stage) notFound()

  const Content = STAGE_CONTENT[stage.slug]
  const index = STAGES.findIndex((s) => s.slug === stage.slug)
  const next = STAGES[index + 1]

  return (
    <article className="mx-auto max-w-[1400px] px-6 py-8 sm:px-10 sm:py-12 lg:py-16">
      <header className="pb-12">
        <TitleBlock stage={stage} />

        {/* The thesis, set as an annotation on the drawing. */}
        <p className="mt-8 max-w-[54ch] border-l-2 border-brand pl-5 text-xl leading-relaxed text-fg sm:text-[1.375rem]">
          {stage.blurb}
        </p>

        <p className="mt-6 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">
          <span className="t-label text-subtle">When · </span>
          {stage.timing}
        </p>

        <div className="rule-draw mt-10 h-px bg-line-strong" aria-hidden />
      </header>

      {Content ? (
        <Content />
      ) : (
        <div className="border border-dashed border-line-strong p-10 text-center">
          <p className="t-label text-subtle">Sheet not drawn</p>
          <p className="mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
            The markdown for this stage exists in the repo. The interactive
            version is still to come.
          </p>
        </div>
      )}

      {next && (
        <nav className="mt-20 border-t border-line pt-6">
          <Link
            href={`/stages/${next.slug}`}
            className="group flex min-h-11 items-center gap-4 py-1"
          >
            <span className="t-data text-sm text-subtle transition-colors duration-150 group-hover:text-brand">
              {next.num}
            </span>
            <span className="min-w-0 flex-1">
              <span className="t-label block text-subtle">Next sheet</span>
              <span className="t-head mt-1 block truncate text-lg">
                {next.title}
              </span>
            </span>
            <ArrowRight
              className="size-5 shrink-0 text-subtle transition-transform duration-150 group-hover:translate-x-1 group-hover:text-brand"
              aria-hidden
            />
          </Link>
        </nav>
      )}
    </article>
  )
}
