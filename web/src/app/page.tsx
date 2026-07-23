import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { STAGE_GROUPS, stagesByGroup } from '@/lib/stages'

const SITUATIONS = [
  { when: 'An idea, and no code yet', slug: '01-product-discovery' },
  { when: 'Empty repo, ready to start', slug: '04-project-setup' },
  { when: 'About to deploy the first time', slug: '12-staging' },
  { when: 'Production is broken right now', slug: '16-incident-management' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
      {/* Hero stays full width — the expanded caps need the room. */}
      <header>
        <p className="t-label text-brand">Field manual · 18 sheets</p>
        <h1 className="t-display mt-4 text-[clamp(1.75rem,8vw,4rem)]">
          Development Playbook
        </h1>
        <div className="rule-draw mt-6 h-px bg-line-strong" aria-hidden />
        <p className="mt-6 max-w-[42ch] text-xl leading-snug sm:text-2xl">
          Eighteen stages, from &ldquo;I have an idea&rdquo; to &ldquo;this has
          run in production for two years and still works.&rdquo;
        </p>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted">
          A reference, not a curriculum. Open the sheet you are standing on.
        </p>
      </header>

      {/* The claim and the shortcuts, side by side once there is room. */}
      <div className="mt-14 grid gap-x-12 gap-y-10 lg:grid-cols-2 lg:items-start">
        <section className="ticked border border-line bg-raised p-5 sm:p-6">
          <p className="t-label text-brand">Read this once</p>
          <h2 className="t-head mt-2 text-xl sm:text-2xl">
            The numbering is for lookup, not sequence
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            Sheets are numbered so you can find them, not so you can execute them
            in order. CI/CD (11) gets wired during Project Setup (04), on day
            one. Documentation (10) and Observability (15) never stop. Sheets 13
            through 18 form a loop, not a line.
          </p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
            Every sheet states its real cadence in the title block. Trust that
            over the number.
          </p>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="t-label text-brand">Start where you are</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
          </div>
          <ul className="border-t border-line">
            {SITUATIONS.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link
                  href={`/stages/${s.slug}`}
                  className="group flex min-h-11 items-center gap-4 py-3 transition-colors duration-150 hover:text-brand"
                >
                  <span className="flex-1 text-[1.0625rem]">{s.when}</span>
                  <ArrowRight
                    className="size-4 shrink-0 text-subtle transition-transform duration-150 group-hover:translate-x-1 group-hover:text-brand"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* The full index, two columns of groups on wide screens. */}
      <section className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="t-label text-subtle">All 18 sheets</span>
          <span className="h-px flex-1 bg-line" aria-hidden />
        </div>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {STAGE_GROUPS.map((group) => (
            <section key={group}>
              <p className="t-label mb-3 text-brand">{group}</p>
              <ul>
                {stagesByGroup(group).map((stage) => (
                  <li
                    key={stage.slug}
                    className="measure-full border-b border-line first:border-t"
                  >
                    <Link
                      href={`/stages/${stage.slug}`}
                      className="group grid grid-cols-[1.75rem_1fr] items-baseline gap-x-3 py-3"
                    >
                      <span
                        className={[
                          't-data text-xs',
                          stage.ready ? 'text-brand' : 'text-subtle',
                        ].join(' ')}
                      >
                        {stage.num}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="t-head text-[1.0625rem] transition-colors duration-150 group-hover:text-brand">
                            {stage.title}
                          </span>
                          <span className="t-label hidden shrink-0 text-subtle xl:block">
                            {stage.cadence}
                          </span>
                        </span>
                        <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">
                          {stage.blurb}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}
