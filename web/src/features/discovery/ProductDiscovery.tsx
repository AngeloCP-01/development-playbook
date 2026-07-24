import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Stepper, type Step } from '@/components/Stepper'
import { DiscoveryFlow } from './DiscoveryFlow'
import { SeverityScorer } from './SeverityScorer'
import { QuestionLab } from './QuestionLab'
import { Toolkit } from './Toolkit'
import { AIWorkflow } from './AIWorkflow'
import { ValidationLadder } from './ValidationLadder'
import { OpportunityTree } from './OpportunityTree'
import { WorkedExample } from './WorkedExample'
import { PipelineFit } from './PipelineFit'
import { Worksheet } from './Worksheet'

const STEPS: Step[] = [
  {
    id: 'frame',
    label: 'Frame',
    hint: 'Turn the idea into a problem statement',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The shift"
          title="Start with the problem, not the solution"
        >
          <Prose>
            <p>
              Ideas arrive as solutions: &ldquo;an app that does X.&rdquo; That
              framing hides the problem underneath and quietly rules out cheaper
              answers before you have considered them.
            </p>
          </Prose>

          <div className="mt-5">
            <Contrast
              badLabel="Solution framing"
              goodLabel="Problem framing"
              bad={
                <p>
                  &ldquo;A dashboard showing project status.&rdquo;
                  <span className="mt-2 block text-subtle">
                    Locks you into building a dashboard. You will evaluate every
                    idea by how good a dashboard it makes.
                  </span>
                </p>
              }
              good={
                <p>
                  &ldquo;I spend twenty minutes every Monday asking four people
                  for updates.&rdquo;
                  <span className="mt-2 block text-subtle">
                    Admits other answers — a scheduled message, a shared doc, a
                    different meeting. Maybe no dashboard at all.
                  </span>
                </p>
              }
            />
          </div>

          <div className="mt-5">
            <Prose>
              <p>
                Ask &ldquo;why does that matter?&rdquo; until you reach
                something about time, money, or risk. If you cannot get there,
                the problem may not be real.
              </p>
            </Prose>
          </div>
        </Section>

        <Section eyebrow="The path" title="How a decision actually gets made">
          <Prose>
            <p>
              Two exits, weighted equally. Most versions of this diagram bury
              the stop path — which is the one people skip, and the one that
              saves the most time.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="The two exits from discovery. Everything above the gate is cheap; everything below it is a commitment. Note that stop is drawn the same size as build — it is an equally successful outcome, and the more common one."
          >
            <DiscoveryFlow />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'research',
    label: 'Research',
    hint: 'Gather evidence, cheapest sources first',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Activities"
          title="What you actually do, and with what"
        >
          <Prose>
            <p>
              Discovery is four kinds of work. Most of the value sits in the
              first category, which is free and which almost everyone skips in
              favour of building.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="The four kinds of discovery work, cheapest first. Desk research costs nothing and kills most ideas; interviews cost time; tests cost real effort. Climb only as far as the decision requires."
          >
            <Toolkit />
          </Figure>
        </Section>

        <Section eyebrow="Cheapest first" title="Validate before building">
          <Prose>
            <p>
              Every rung costs more than the one below it — from a search query
              up to a <Term id="fake-door-test">fake door test</Term> or a full{' '}
              <Term id="concierge-test">concierge test</Term>. Climb only as far
              as the decision requires.
            </p>
          </Prose>
          <Figure
            n={3}
            caption="Each rung buys stronger evidence at higher cost — and each one misleads in its own way, which is why the ladder matters more than any single rung."
          >
            <ValidationLadder />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where agents help, and where they lie to you',
    content: (
      <Section
        eyebrow="AI in the loop"
        title="Where agents help, and where they lie to you"
      >
        <Prose>
          <p>
            Agents are genuinely good at the desk-research rungs — breadth,
            speed, and no boredom. They are structurally bad at telling you to
            stop.
          </p>
        </Prose>
        <Figure
          n={4}
          caption="Where agents fit in discovery. They are strong on breadth and speed at the desk-research rungs, and structurally unable to tell you to stop."
        >
          <AIWorkflow />
        </Figure>
      </Section>
    ),
  },
  {
    id: 'talk',
    label: 'Talk',
    hint: 'Five conversations beat zero',
    content: (
      <Section eyebrow="Exercise" title="Talk to people, badly but at all">
        <Prose>
          <p>
            Five conversations dramatically outperform zero. The failure mode is
            asking <Term id="leading-question">leading questions</Term> that
            generate agreement rather than information — people say yes to be
            nice, and a yes costs them nothing.
          </p>
          <p>
            The rule: <strong className="text-fg">ask about the past</strong>.
            What someone says they will do is unreliable. What they did last
            Tuesday is data.
          </p>
        </Prose>
        <Figure
          n={5}
          caption="Six interview questions. Three gather evidence; three manufacture agreement. The difference is almost always whether the question asks about the past or the future."
        >
          <QuestionLab />
        </Figure>
      </Section>
    ),
  },
  {
    id: 'decide',
    label: 'Decide',
    hint: 'Severity, and the courage to stop',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Exercise" title="How much does it hurt?">
          <Prose>
            <p>
              Severity decides everything downstream. Most ideas are
              annoying-tier, because the{' '}
              <Term id="switching-cost">switching cost</Term> exceeds the pain
              removed — which is exactly why most ideas should not be built.
            </p>
          </Prose>
          <Figure
            n={6}
            caption="The severity scale that governs the build/stop decision. Most ideas sit in the first two bands, where switching costs exceed the pain removed."
          >
            <SeverityScorer />
          </Figure>
        </Section>

        <Section eyebrow="Worked examples" title="Two real decisions">
          <Prose>
            <p>
              The same four questions applied to two ideas — one that got built,
              one that got killed. The killed one is the more useful example,
              because stopping is the outcome people skip.
            </p>
          </Prose>
          <Figure
            n={7}
            caption="The same four questions applied to two real ideas — one built, one abandoned at question three. The abandoned one is the more instructive case."
          >
            <WorkedExample />
          </Figure>
        </Section>

        <Section
          eyebrow="The outcome people skip"
          title="Deciding not to build"
        >
          <Prose>
            <p>Legitimate reasons to stop right here:</p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>The problem is annoying-tier</li>
              <li>The existing solution is good enough</li>
              <li>You cannot reach the people who have the problem</li>
              <li>The effort massively exceeds the pain</li>
            </ul>
          </Prose>
          <div className="mt-5">
            <Callout kind="info" title="The arithmetic">
              Stopping at this stage costs a few days. Stopping after three
              months of building costs three months. Discovery is the cheapest
              place in the entire playbook to change your mind, and that is the
              whole reason it exists.
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'record',
    label: 'Record',
    hint: 'One page, then hand off to planning',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The artifact" title="Opportunity solution tree">
          <Prose>
            <p>
              An{' '}
              <Term id="opportunity-solution-tree">
                opportunity solution tree
              </Term>{' '}
              is Teresa Torres&rsquo; map of the problem space. It keeps
              solutions tied to evidence: every solution hangs off an
              opportunity, and every opportunity is something a real user
              actually said.
            </p>
            <p>
              Click any node. The value is less the picture than the rule it
              enforces.
            </p>
          </Prose>
          <Figure
            n={8}
            caption="An opportunity solution tree. Outcome at the root, problems heard from users in the middle, candidate solutions at the leaves. Nothing may be added at one level without a parent at the level above."
          >
            <OpportunityTree />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Write it down">
          <Prose>
            <p>
              One page, no more. The value is in the compression — if you cannot
              state the problem in three sentences, you do not understand it
              yet.
            </p>
          </Prose>
          <Figure
            n={9}
            caption="Where the discovery one-pager hands off. It is the missing first step in front of a spec-to-plan-to-build pipeline that already exists."
          >
            <PipelineFit />
          </Figure>
          <div className="mt-6">
            <Worksheet />
          </div>
        </Section>

        <Section eyebrow="Traps" title="Failure modes worth naming">
          <div className="space-y-3">
            <Callout kind="trap" title="Falling in love with the solution">
              The idea arrives fully formed and exciting, and discovery quietly
              becomes a search for justification rather than a search for truth.
              Stay attached to the problem instead — problems survive being
              wrong about solutions.
            </Callout>
            <Callout
              kind="trap"
              title="Asking an agent whether your idea is good"
            >
              It will say yes, with reasons, at length. Same failure as a
              leading interview question, but faster and more convincing. Point
              it at refutation instead.
            </Callout>
            <Callout kind="trap" title="Confusing interest with commitment">
              &ldquo;That sounds great&rdquo; costs nothing to say. A signup, a
              pre-order, or an existing hacked-together workaround costs
              something. Only the second kind is evidence.
            </Callout>
            <Callout
              kind="trap"
              title="Building for &ldquo;small businesses&rdquo;"
            >
              Too broad to design for. A product for everyone tends to fit
              nobody. Narrow until it feels uncomfortably specific, then narrow
              once more.
            </Callout>
            <Callout
              kind="trap"
              title="Starting the spec at &ldquo;Overview and Goals&rdquo;"
            >
              A spec that opens with the solution has skipped this stage
              entirely. The problem statement has to exist before the
              architecture does, or you are just documenting an assumption.
            </Callout>
            <Callout kind="trap" title="Treating discovery as a one-time gate">
              Every significant feature needs its own small version of this.
              Feature requests are solutions too, and deserve the same push back
              to the problem underneath.
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
]

export function ProductDiscovery() {
  return <Stepper steps={STEPS} />
}
