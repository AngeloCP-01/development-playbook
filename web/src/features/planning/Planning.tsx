import Link from 'next/link'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Stepper, type Step } from '@/components/Stepper'
import { References } from '@/components/References'
import { PlanningScope } from './PlanningScope'
import { DoneStatement } from './DoneStatement'
import { CutTable } from './CutTable'
import { CutFunnel } from './CutFunnel'
import { SliceAnatomy } from './SliceAnatomy'
import { SliceSequencer } from './SliceSequencer'
import { SizeScorer } from './SizeScorer'
import { DecompositionLadder } from './DecompositionLadder'
import { SpikeCard } from './SpikeCard'
import { PlanAnatomy } from './PlanAnatomy'
import { PlanWorksheet } from './PlanWorksheet'
import { HorizonBands } from './HorizonBands'
import { HorizonBoard } from './HorizonBoard'

const STEPS: Step[] = [
  {
    id: 'done',
    label: 'Done',
    hint: 'Define done before defining work',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Where this sits" title={'What “planning” means here'}>
          <Prose>
            <p>
              &ldquo;Product planning&rdquo; is a wide phrase. The industry uses
              it for everything from the first idea to sunsetting a product
              years later. This stage is the middle band of that: you have
              already decided to build, and now you decide what
              &ldquo;built&rdquo; means, what is in v1, in what order, and where
              it goes next.
            </p>
            <p>
              It assumes you know the thing is worth building, which is the job
              of{' '}
              <Link href="/stages/01-product-discovery" className="text-brand">
                01 — Product Discovery
              </Link>
              . If you have not been through discovery, do that first: planning
              what to build before you know whether it should be built is
              planning in the dark.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="The seven steps the phrase covers, and the three this stage owns. The rest are other stages — the number is a filing code for who owns a piece of work, not a place in a queue."
          >
            <PlanningScope />
          </Figure>
        </Section>

        <Section eyebrow="The hinge" title="Define done before defining work">
          <Prose>
            <p>
              Not &ldquo;the app is finished&rdquo; but a specific, checkable
              state you can hold a feature request against. Everything that does
              not serve it is version two, and saying so now is far easier than
              saying it in six weeks under enthusiasm.
            </p>
            <p>
              Three candidates below. Only one is a definition you could
              actually tick. Decide before you reveal.
            </p>
          </Prose>
          <div className="mt-5">
            <DoneStatement />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'cut',
    label: 'Cut',
    hint: 'The default answer to a feature is no',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The exercise" title="Cut to the core">
          <Prose>
            <p>
              List every feature you can imagine, then ask of each one:{' '}
              <em>does the outcome fail without this?</em> Most features fail
              that test. What survives is your{' '}
              <Term id="mvp">minimum viable product</Term> — the smallest thing
              that delivers the outcome, not version one with the hard parts
              removed.
            </p>
            <p>
              Read the test as the <em>outcome</em>, not the sentence. Plenty of
              necessary features are not spelled out in a one-line
              &ldquo;done&rdquo; — &ldquo;edit an invoice&rdquo; is not, but an
              invoice you cannot correct makes &ldquo;see which are
              overdue&rdquo; wrong the moment a detail changes, so it fails the
              outcome even though it fails no word of the sentence. Ask whether
              a real user could get the result they came for without it.
            </p>
            <p>
              Judge each feature before the verdict shows. Guessing is the
              lesson.
            </p>
          </Prose>
          <div className="mt-5">
            <CutTable />
          </div>
          <Figure
            n={2}
            caption="Everything imagined passes through the definition of done. A few features survive as the MVP; the rest are not deleted, they drop onto the roadmap in priority order."
          >
            <CutFunnel />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'sequence',
    label: 'Sequence',
    hint: 'Vertical slices, riskiest early',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The shape" title="Sequence in vertical slices">
          <Prose>
            <p>
              Order work so each step produces something demonstrable. The wrong
              way builds each layer across the whole product before the next;
              nothing works, and you learn nothing, until the end. A{' '}
              <Term id="vertical-slice">vertical slice</Term> goes through
              storage, logic, and interface at once, so it is usable the day it
              lands.
            </p>
          </Prose>
          <Figure
            n={3}
            caption="The same work, sequenced two ways. Layer-first defers all learning to the end; vertical slices put a working, shippable increment first and teach you something before you commit to the next."
          >
            <Contrast
              badLabel="Layer-first"
              goodLabel="Vertical slices"
              bad={
                <p>
                  Design the full schema, then build all the queries, then build
                  all the UI.
                  <span className="mt-2 block text-subtle">
                    Nothing works until the last step, and the schema was frozen
                    before anyone understood the problem.
                  </span>
                </p>
              }
              good={
                <p>
                  Create and view one invoice, end to end. Then mark it paid.
                  Then the overdue list.
                  <span className="mt-2 block text-subtle">
                    Each slice ships on its own and teaches you something before
                    the next is committed to.
                  </span>
                </p>
              }
            />
          </Figure>
          <Figure
            n={4}
            caption="One slice, cut through all three layers, beside a layer-first build that fills one layer at a time. Only the slice on the left is demonstrable before the whole thing is done."
          >
            <SliceAnatomy />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Order the slices">
          <Prose>
            <p>
              Put these in the order you would build them, then lock it in. Two
              rules decide it: something has to work end to end first, and the
              slice carrying outside risk — here, a third-party integration —
              goes early, before four other slices are built on the assumption
              that it works.
            </p>
          </Prose>
          <div className="mt-5">
            <SliceSequencer />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'size',
    label: 'Size',
    hint: 'S/M/L, and timeboxing the unknowns',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Rough sizing"
          title="Estimate for sequencing, not for promises"
        >
          <Prose>
            <p>
              Sizes are for ordering work, not for reporting to anyone. Small,
              Medium, Large — and anything Large is a signal, not a schedule.
              (The sharper move is to fix an <Term id="appetite">appetite</Term>{' '}
              instead: decide how much time the thing is worth, then design to
              fit.)
            </p>
          </Prose>
          <div className="mt-5">
            <SizeScorer />
          </div>
          <Figure
            n={6}
            caption="A Large task is one you have not decomposed yet. Split it until nothing Large remains — a task you cannot break down is one you do not understand well enough to start."
          >
            <DecompositionLadder />
          </Figure>
        </Section>

        <Section eyebrow="The unknowns" title="Timebox feasibility risk">
          <Prose>
            <p>
              Some unknowns are not scope questions but{' '}
              <Term id="feasibility-risk">feasibility</Term> questions: can this
              be built at all? Answer them with a <Term id="spike">spike</Term>{' '}
              — a timeboxed investigation whose output is a written decision,
              not code. That decision is what stage 03 consumes.
            </p>
          </Prose>
          <Figure
            n={7}
            caption="A spike, filled in: one hard question, a hard stop, and a decision written down. The loop beneath it is the discipline — the output is the decision, and the code is discarded."
          >
            <SpikeCard />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'write',
    label: 'Write',
    hint: 'The one-page plan',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The artifact" title="Write the plan">
          <Prose>
            <p>
              Short. A plan longer than a page will not be read, including by
              you. Done, slices, what is <em>not</em> in v1, risks, open
              questions. If stage 01 left you a discovery sheet, the worksheet
              can seed the first boxes from it.
            </p>
          </Prose>
          <Figure
            n={8}
            caption="The one-page plan, annotated with what each section is for. The 'Not in v1' list is the part that does the real work over the following weeks."
          >
            <PlanAnatomy />
          </Figure>
          <div className="mt-6">
            <PlanWorksheet />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'horizon',
    label: 'Horizon',
    hint: 'Now, next, later — and replanning',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The direction" title="Set the horizon">
          <Prose>
            <p>
              The plan covers v1. It does not say where the product is going —
              and without that, the MVP reads as a list of things you cut rather
              than a first step. A <Term id="product-roadmap">roadmap</Term> in
              three horizons, no dates: Now is the MVP, Next is what earns its
              way in on evidence, Later is the{' '}
              <Term id="product-vision">product vision</Term> you are building
              toward.
            </p>
            <p>
              &ldquo;Priority order&rdquo; for the Next list needs a method, or
              it becomes whatever you feel like building. The lightweight one,
              right for a small product, is{' '}
              <strong>value against effort</strong>: value is how much pain an
              item removes times how often that pain is felt — count the hurt,
              not the votes — and effort is the S/M/L you already assigned.
              Cheap and high-value goes first; expensive and low-value may never
              get built. RICE, ICE and MoSCoW are the heavier, named versions of
              the same idea, for once you have real usage data and more items
              than you can hold in your head.
            </p>
          </Prose>
          <Figure
            n={9}
            caption="Three horizons and no dates. Now is the MVP, Next waits on evidence rather than a calendar, Later is the product you are building toward. Dates would turn the roadmap into a promise; horizons carry the sequence without the commitment."
          >
            <HorizonBands />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Triage what you cut">
          <Prose>
            <p>
              The worked items below are joined by whatever you wrote in the
              plan&rsquo;s &ldquo;Not in v1&rdquo; box a step back. Place each
              into Now, Next, or Later. The worked ones carry a verdict; your
              own are yours to judge — some belong in more than one horizon, and
              that is the point.
            </p>
          </Prose>
          <div className="mt-5">
            <HorizonBoard />
          </div>
        </Section>

        <Section eyebrow="If you are not solo" title="What changes on a team">
          <details className="group border border-line bg-sunken px-5 py-4">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-fg">
              <span>
                Five things that change once others depend on the plan
              </span>
              <span className="t-label text-subtle group-open:hidden">
                Show
              </span>
              <span className="t-label hidden text-subtle group-open:inline">
                Hide
              </span>
            </summary>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem] leading-relaxed text-muted">
              <li>
                <strong className="font-medium text-fg">
                  The plan becomes a coordination tool,
                </strong>{' '}
                not just a memory aid, so it has to be discoverable and current.
              </li>
              <li>
                <strong className="font-medium text-fg">
                  Slices must be genuinely independent
                </strong>{' '}
                or people block each other — a dependency between parallel work
                is a planning bug.
              </li>
              <li>
                <strong className="font-medium text-fg">
                  Make the &ldquo;not now&rdquo; list visible
                </strong>{' '}
                so it is not relitigated in every conversation.
              </li>
              <li>
                <strong className="font-medium text-fg">
                  Beware plan-as-contract.
                </strong>{' '}
                Once a plan is a promise to stakeholders, replanning turns
                politically expensive and people follow plans they know are
                wrong.
              </li>
              <li>
                <strong className="font-medium text-fg">Do estimate now</strong>{' '}
                — others coordinate around your work — but in ranges, and revise
                openly.
              </li>
            </ul>
          </details>
        </Section>

        <Section eyebrow="Traps" title="Failure modes worth naming">
          <div className="space-y-3">
            <Callout kind="trap" title="Planning the whole product">
              Detail beyond a few weeks is fiction. Plan v1 properly and sketch
              the rest — the sketch is for direction, not for building from.
            </Callout>
            <Callout kind="trap" title="Layer-first sequencing">
              Nothing works until everything works, and you learn nothing until
              the end. Slice vertically so each step ships and teaches.
            </Callout>
            <Callout kind="trap" title="No explicit exclusions">
              Without a written &ldquo;not in v1,&rdquo; every good idea gets
              absorbed and v1 never ships. The exclusion list is the part that
              does the work.
            </Callout>
            <Callout kind="trap" title="Estimating in hours">
              False precision. The number becomes a commitment, and the
              commitment produces shortcuts. Size for order, not for the clock.
            </Callout>
            <Callout kind="trap" title="Leaving Large tasks undecomposed">
              Large means &ldquo;not understood.&rdquo; Decompose until the work
              is visible, then size the pieces.
            </Callout>
            <Callout kind="trap" title="Spikes that become production code">
              Untested, unreviewed exploration entering the codebase because it
              happened to work. The output of a spike is a decision; the code is
              discarded.
            </Callout>
            <Callout kind="trap" title="Treating the plan as immutable">
              The plan serves the work, not the other way round. Building slice
              one will teach you that slice three was wrong — update it without
              guilt.
            </Callout>
            <Callout kind="trap" title="Planning to avoid starting">
              Past a point, planning is procrastination in a respectable outfit.
              One page, then build slice one.
            </Callout>
          </div>
        </Section>

        <References slug="02-planning" />
      </div>
    ),
  },
]

export function Planning() {
  return <Stepper steps={STEPS} />
}
