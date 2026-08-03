import Link from 'next/link'
import { Callout, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Stepper, type Step } from '@/components/Stepper'
import { type StepId } from './steps'
import { References } from '@/components/References'
import { SCHEMA_LINES } from './scoring'
import { FITNESS_FUNCTION_CLAIM } from './characteristics'
import {
  INDEX_LINES,
  INVOICE_SENDS_LINES,
  TENANCY_LINES,
} from './schema-blocks'
import { ReversibilityAxis } from './ReversibilityAxis'
import { ReversibilityTable } from './ReversibilityTable'
import { CharacteristicPicker } from './CharacteristicPicker'
import { TraceForward } from './TraceForward'
import { FitnessExamples } from './FitnessExamples'
import { DomainSketch } from './DomainSketch'
import { ModelInterrogation } from './ModelInterrogation'
import { DriftDiagram } from './DriftDiagram'
import { DomainWorksheet } from './DomainWorksheet'
import { DeploymentStyles } from './DeploymentStyles'
import { ScalingMoves } from './ScalingMoves'
import { InternalOrganisation } from './InternalOrganisation'
import { YourCharacteristics } from './YourCharacteristics'
import { OneAppCosts } from './OneAppCosts'
import { SplitTrigger } from './SplitTrigger'
import { BoundaryMap } from './BoundaryMap'
import { TeamNotes } from './TeamNotes'
import { SystemSketch } from './SystemSketch'
import { DataFlow } from './DataFlow'
import { SyncAsync } from './SyncAsync'
import { IdempotencyBlock } from './IdempotencyBlock'
import { ResiliencePatterns } from './ResiliencePatterns'
import { ERView } from './ERView'
import { SchemaInspector } from './SchemaInspector'
import { PartialUniqueIndex } from './PartialUniqueIndex'
import { IsolationLevels } from './IsolationLevels'
import { LockingStrategies } from './LockingStrategies'
import { LockingChoice } from './LockingChoice'
import { ExpandContract } from './ExpandContract'
import { EvolutionNotes } from './EvolutionNotes'
import { BACKFILL_SQL, PRE_LAUNCH_EXEMPTION } from './evolve'
import { DeleteBehaviour } from './DeleteBehaviour'
import { ContractCost } from './ContractCost'
import { RouteShape } from './RouteShape'
import { AuthPaths } from './AuthPaths'
import { AuthzPatterns } from './AuthzPatterns'
import { ADRAnatomy } from './ADRAnatomy'
import { DeferredList } from './DeferredList'
import { AIArchitecturePlays } from './AIArchitecturePlays'

/**
 * Typed against `STEP_IDS` so a step whose id is not in that list is a compile
 * error. The trace-forward links and the audit's `PAGES` both resolve against
 * the same list, and they used to compare against private copies of it.
 */
const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'reverse',
    label: 'Reverse',
    hint: 'Sort decisions by how expensive they are to undo',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Where this sits"
          title="One question, asked of everything"
        >
          <Prose>
            <p>
              At this size architecture is not a diagram. It is a short list of
              decisions you will be living inside for years, separated from a
              much longer list you can change on a Tuesday afternoon. One
              question does the separating:{' '}
              <em>how expensive is this to undo?</em>
            </p>
            <p>
              This stage assumes a plan with scope and slices, which is what{' '}
              <Link href="/stages/02-planning" className="text-brand">
                02 — Planning
              </Link>{' '}
              produces. It also assumes you know roughly what data the system
              holds and what the non-negotiable constraints are, because both
              are inputs to the decisions below rather than outputs of them.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="The right-hand list will still be shaping the codebase in three years. The left is an afternoon&rsquo;s work whenever you want it, which is what makes deliberating over it such a comfortable way to avoid the right."
          >
            <ReversibilityAxis />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Sort six decisions">
          <Prose>
            <p>
              Six decisions from an invoice tracker. Judge each one before the
              verdict shows. Two of them are arguable for good reasons, and you
              will not be told which two until you have committed — knowing
              where the hard cases are is most of the skill this exercise is
              testing.
            </p>
            <p>
              The axis is reversal cost, not importance. A decision can matter
              enormously and still be cheap to change your mind about.
            </p>
          </Prose>
          <div className="mt-5">
            <ReversibilityTable />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'require',
    label: 'Require',
    hint: 'What the system has to be — three or four, not ten',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The other half" title="What this system has to be">
          <Prose>
            <p>
              The stage has been sorting decisions by what they cost. This asks
              what they are <em>for</em>. Stage 02 settled what the system{' '}
              <em>does</em> — the outcome, the cut, the vertical slices — and{' '}
              <Link href="/stages/02-planning" className="text-brand">
                02 — Planning
              </Link>{' '}
              owns all of it. What this stage needs is the other half: what the
              system has to <em>be</em> while doing those things. Those are its{' '}
              <Term id="architecture-characteristic">
                architecture characteristics
              </Term>
              , which is the same thing most job descriptions call
              non-functional requirements.
            </p>
            <p>
              Pick three or four, not because a longer list is hard to write but
              because they trade against each other. A system that is meant to
              be everything has been told nothing.
            </p>
          </Prose>
          <div className="mt-5">
            <CharacteristicPicker />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'trace',
    label: 'Trace',
    hint: 'Each one has to force a decision — and you have to be able to check it',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The test"
          title="A characteristic has to force something"
        >
          <Prose>
            <p>
              Every row below is a decision this stage makes anyway. Choosing
              the characteristic first is what turns that decision from a
              preference into something with a reason attached — and it is the
              only thing separating this section from a vocabulary exercise.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="All ten candidates and the decision each one forces, with the step where that decision actually gets made. The link is the argument: a characteristic is not a label, it is the reason a later step goes the way it does — and a row you cannot fill is a characteristic you listed rather than chose."
          >
            <TraceForward />
          </Figure>
        </Section>

        <Section
          eyebrow="One step further"
          title="A trace is a claim, and claims rot"
        >
          <Prose>
            <p>
              {FITNESS_FUNCTION_CLAIM.lead}{' '}
              <Term id="fitness-function">{FITNESS_FUNCTION_CLAIM.term}</Term>
              {FITNESS_FUNCTION_CLAIM.rest}
            </p>
          </Prose>
          <div className="mt-5">
            <FitnessExamples />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'model',
    label: 'Model',
    hint: 'The data model outlives every framework choice',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The highest stakes"
          title="Model the domain first, in nouns"
        >
          <Prose>
            <p>
              The <Term id="domain-model">domain model</Term> is the most
              expensive thing on the list to get wrong, because migrating code
              is easy and migrating data is not. Write it in the language of the
              problem — a user has many clients, a client has many invoices —
              before anything becomes a table.
            </p>
            <p>
              Getting to the nouns is mechanical, and worth doing rather than
              guessing at. Take the vertical slices from{' '}
              <Link href="/stages/02-planning" className="text-brand">
                02 — Planning
              </Link>{' '}
              and underline every noun in them. Strike the ones that are a
              property of another noun — an invoice&rsquo;s <em>total</em> is
              not an entity, it is a column, and possibly not even that. What
              survives is the candidate list, and it will be wrong on the first
              pass. The interrogation below is what corrects it, which is why
              the questions matter more than the sketch.
            </p>
            <p>
              Working in nouns first is not a formality. A relationship you can
              say out loud is a relationship you can argue with; the same
              relationship expressed as a foreign key is already a decision
              nobody will revisit.
            </p>
          </Prose>
          <Figure
            n={3}
            caption="The nouns come before the tables, and the tables come from the nouns. Each edge carries the verb — &ldquo;has many&rdquo; — because a bare arrow says two things are related without saying how."
          >
            <DomainSketch />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Interrogate the model">
          <Prose>
            <p>
              A sketch like the one above looks finished long before it is. Six
              questions put to it now will surface the errors that are otherwise
              found by a migration eighteen months in. Answer each before the
              reasoning shows.
            </p>
            <p>
              The reasoning appears whichever way you answered, because the
              defensible answer is worth less than the argument for it — and one
              of them genuinely depends on a product you have not described.
            </p>
          </Prose>
          <div className="mt-5">
            <ModelInterrogation />
          </div>
        </Section>

        <Section
          eyebrow="The recurring failure"
          title="Anything stored can disagree with itself"
        >
          <Prose>
            <p>
              The first question was really about{' '}
              <Term id="derived-state">derived state</Term>, and the pattern
              repeats far past invoices: a cart total, an unread count, a status
              that depends on today&rsquo;s date. Store it and something has to
              keep it current. Miss one run of that something and two fields
              disagree about the same fact, with nothing in the row to say which
              one is lying.
            </p>
          </Prose>
          <Figure
            n={4}
            caption="A stored flag and the date it was derived from, one week apart. Nothing wrote to the row and it is now wrong. The computed version cannot reach that state at all, which is the whole argument."
          >
            <DriftDiagram />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'worksheet',
    label: 'Worksheet',
    hint: 'The same questions, asked about your own product',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The artifact" title="Write down your own domain">
          <Prose>
            <p>
              All but one of those questions turn on the thing you are actually
              building. What are the nouns; what should be computed rather than
              stored; what happens on delete, entity by entity — a{' '}
              <Term id="soft-delete">soft delete</Term> keeps the row and taxes
              every query afterwards, so it is a trade to make deliberately
              rather than a default. What must be unique, and in what scope. And
              which of your verbs are really things: an approval you will later
              want an actor and a timestamp for is a row, not a status flip. The
              remaining one, whether every actor has the same rights, is
              answered in <em>Access</em>, where the authorization pattern gets
              chosen.
            </p>
            <p>
              If a relationship might run both ways later, say so here. Yes now
              or plausibly yes later means a{' '}
              <Term id="join-table">join table</Term> rather than a foreign key,
              and the cost of finding that out afterwards is a migration plus
              every query that touched it.
            </p>
          </Prose>
          <div className="mt-5">
            <DomainWorksheet />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'shape',
    label: 'Shape',
    hint: 'The shapes on offer, and the one property that decides which are yours',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The landscape" title="The shapes a system can take">
          <Prose>
            <p>
              Before choosing, know what you are choosing between, or the next
              section is advice you take on faith. Start by separating two
              questions that usually get collapsed into one. How does it{' '}
              <em>deploy</em> — one unit or many? And how is it{' '}
              <em>organised inside</em> — what depends on what? A{' '}
              <Term id="hexagonal-architecture">hexagonal</Term>{' '}
              <Term id="monolith">monolith</Term> is an ordinary, sensible
              thing, which is why &ldquo;monolith or{' '}
              <Term id="microservices">microservices</Term>&rdquo; is a bad
              question: it treats one answer as covering both.
            </p>
          </Prose>
          <Figure
            n={5}
            caption="Four deployment shapes, each with what it buys, what it costs, and what would have to be true for it to be right. The microservices row is the one people adopt for the wrong reason — what it buys is organisational, and what it costs arrives on day one."
          >
            <DeploymentStyles />
          </Figure>
          <div className="mt-6">
            <InternalOrganisation />
          </div>
          <Prose>
            <p>
              A third axis:{' '}
              <Term id="event-driven-architecture">event-driven</Term> means
              components announce that something happened rather than calling
              the next step directly. It is not a deployment shape — a single
              application can be event-driven inside. The decision that leads
              there is posed in <em>Flow</em>, where it is concrete.
            </p>
            <p>
              What this stage teaches is a{' '}
              <Term id="modular-monolith">modular monolith</Term>, and it is
              worth having the name: a reader who has been building one for
              years without the term cannot look up whether they are doing it
              well. <Term id="serverless">Serverless</Term> is a deployment
              detail underneath it rather than a rival to it.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The property that decides"
          title="One thing makes the table above available to you"
        >
          <Prose>
            <p>
              An application is <Term id="statelessness">stateless</Term> when
              it keeps no request state in its own memory. Any instance can then
              serve any request, which is what lets you run several copies — and
              what makes the serverless row possible at all, since the platform
              starts and stops instances whenever it likes. It is also what the
              table means by scaling independently, so it is worth saying how:{' '}
              <Term id="horizontal-scaling">vertical and horizontal</Term>{' '}
              scaling are not two settings of one dial.
            </p>
            <p>
              Vertical first is almost always right. The reason to know the
              difference now rather than later is in the first row below.
            </p>
          </Prose>
          <div className="mt-5">
            <ScalingMoves />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'oneapp',
    label: 'One app',
    hint: 'Derive the default for yourself, then the four reasons to leave it',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Your turn"
          title="Run the trace against your own three"
        >
          <Prose>
            <p>
              Teaching a modular monolith follows from the characteristics
              rather than from taste. Run the same trace against yours. If it
              produces a different answer than the next section, the next
              section is wrong for your system, and you should be able to say
              why.
            </p>
          </Prose>
          <div className="mt-5">
            <YourCharacteristics />
          </div>
        </Section>
        <Section eyebrow="The default" title="Start with one application">
          <Prose>
            <p>
              For a solo project the default shape is one application and one
              database. Not microservices, not a separate API, not a queue, not
              an event bus. A <Term id="monolith">monolith</Term> here is the
              correct choice rather than a compromise you are admitting to.
            </p>
            <p>
              The reason is an accounting one. Distribution charges you network
              failure modes and distributed debugging from the first deploy, and
              pays you back in independent team scaling and independent deploy
              cadence. One person cannot collect either.
            </p>
          </Prose>
          <Figure
            n={6}
            caption="The costs of distribution are paid on day one; the benefits are organisational and need a team to collect. Alone you pay the full price for none of the return."
          >
            <OneAppCosts />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Is this a reason to split?">
          <Prose>
            <p>
              Splitting something out is right when there is a concrete reason,
              and the concrete reasons are narrower than they sound. Six
              candidates below, four of which hold. Commit to each before the
              verdict.
            </p>
          </Prose>
          <div className="mt-5">
            <SplitTrigger />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'boundaries',
    label: 'Boundaries',
    hint: 'Seams that make a later split mechanical rather than archaeological',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Inside one application"
          title="Boundaries you keep honest"
        >
          <Prose>
            <p>
              Structure inside the application is what makes splitting possible
              later, cheaply. Draw boundaries between features and enforce one
              rule: features talk through exported functions and never reach
              into each other&rsquo;s internals. If clients needs invoice data
              it calls billing; it does not query the invoices table.
            </p>
            <p>
              Each of those folders is a{' '}
              <Term id="bounded-context">bounded context</Term> — a boundary
              inside which a word means exactly one thing. The line belongs
              where the vocabulary changes: if &ldquo;invoice&rdquo; means an
              unpaid obligation to billing and a ticket attachment to somebody
              else, those are two contexts, and forcing one model across both
              costs more than keeping them apart. That is also what{' '}
              <Term id="ubiquitous-language">ubiquitous language</Term> buys —
              the table is called <code className="t-data">claims</code> because
              the people who use the system say &ldquo;claim&rdquo;. Where the
              words in the code and the words in the room drift apart, bugs live
              in the gap.
            </p>
            <p>
              Choosing a boundary and enforcing one are different problems, and
              the second is useless without the first. The test for choosing: a
              feature owns the tables it alone writes. If two features both
              write a table, they are one feature that has not admitted it yet.
            </p>
            <p>
              That single rule is the difference between extracting a service
              later as a mechanical job and doing it as archaeology.
            </p>
          </Prose>
          <Figure
            n={7}
            caption="Four calls between three modules, where only the shape of the call decides whether it is allowed. Reaching straight into another module&rsquo;s table works, is shorter, and is the move that turns a monolith into a ball of mud &mdash; on the way out as much as on the way in."
          >
            <BoundaryMap />
          </Figure>
          <div className="mt-6">
            <TeamNotes>
              <ul className="space-y-2.5">
                <li>
                  <strong className="font-medium text-fg">
                    Boundaries become social.
                  </strong>{' '}
                  Team ownership tends to follow module boundaries, so drawing
                  them badly creates coordination overhead that outlives the
                  code.
                </li>
                <li>
                  <strong className="font-medium text-fg">
                    ADRs stop being optional.
                  </strong>{' '}
                  They are how a decision survives the person who made it.
                </li>
                <li>
                  <strong className="font-medium text-fg">
                    Splitting services can now be justified
                  </strong>{' '}
                  by independent deploy cadence and team autonomy — real
                  benefits that simply do not exist solo.
                </li>
                <li>
                  <strong className="font-medium text-fg">
                    Review architectural changes more heavily
                  </strong>{' '}
                  than feature changes. The{' '}
                  <Term id="blast-radius">blast radius</Term> is larger and the
                  reversal cost is higher.
                </li>
                <li>
                  <strong className="font-medium text-fg">
                    Watch for Conway&rsquo;s law.
                  </strong>{' '}
                  Your architecture will come to mirror your communication
                  structure whether you intend it or not.
                </li>
              </ul>
            </TeamNotes>
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'sketch',
    label: 'Sketch',
    hint: 'Your app is one box; your system is not',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The objection" title="Sketch the system">
          <Prose>
            <p>
              There is an obvious objection to drawing anything at this point:
              if the answer is one application and one database, the diagram is
              two boxes and a line, and drawing it teaches nobody anything.
            </p>
            <p>
              The objection is right about the application and wrong about the
              system.{' '}
              <strong className="font-medium text-fg">
                Your application is one box. Your system is not.
              </strong>{' '}
              The invoicing example takes payments, sends email, renders and
              stores PDFs, and needs something to notice when an invoice has
              gone past its due date. None of those is code you wrote, all of
              them fail on their own schedule, and every one is a decision you
              have already made without writing it down.
            </p>
            <p>
              <Term id="c4-model">C4</Term> is the usual answer to &ldquo;what
              kind of diagram&rdquo;. Four levels — context, container,
              component, code. For one person, context and container earn their
              keep; component is worth drawing for the one subsystem complicated
              enough that you keep re-deriving how it fits together; code is
              what your editor already draws. Draw two diagrams, not four.
            </p>
          </Prose>
          <Figure
            n={8}
            caption="The container view. Four of the six boxes are not yours, which is the whole argument for drawing it — select an external one to see what it does and what happens when it is down."
          >
            <SystemSketch />
          </Figure>
          <div className="mt-6">
            <Callout kind="info" title="What is deliberately not here">
              Full high-level design practice comes with a system specification
              document, a review board, and a sign-off before implementation
              starts. None of that is in this stage, on purpose. The thinking
              survives — what the pieces are, how they talk, what happens when
              one fails — and the paperwork does not, because its actual purpose
              is coordinating people you do not have.
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'flow',
    label: 'Flow',
    hint: 'One flow end to end, and the fork it turns out to pose',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="One flow, end to end"
          title="Pick the flow that crosses the most boundaries"
        >
          <Prose>
            <p>
              That is where the design decisions hide. Two of the five steps
              below are different in kind from the rest, and that difference is
              the decision the rest of this step is about.
            </p>
          </Prose>
          <Figure
            n={9}
            caption="Sending an invoice and being paid for it, drawn end to end. Step 2 is a call you make; step 4 is a call somebody makes to you, days later, possibly twice."
          >
            <DataFlow />
          </Figure>
        </Section>

        <Section eyebrow="The fork" title="Synchronous or asynchronous">
          <Prose>
            <p>
              This is the fork that leads to{' '}
              <Term id="event-driven-architecture">
                event-driven architecture
              </Term>
              , and it has real consequences on each branch. The rule that
              catches people: for anything you <em>receive</em>, you do not get
              to choose.
            </p>
          </Prose>
          <Figure
            n={10}
            caption="The same four questions asked of both branches. The last row is the one that turns into work: asynchronous needs idempotency, and somewhere to put what failed."
          >
            <SyncAsync />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'resilience',
    label: 'Resilience',
    hint: 'What happens when something you depend on is slow, or down',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The consequence"
          title="Anything received has to be safe twice"
        >
          <Prose>
            <p>
              A payment webhook will be delivered twice eventually, and the
              write it triggers has to survive that. That is{' '}
              <Term id="idempotency">idempotency</Term>, and it is a schema
              decision, which is why it belongs in this stage rather than in
              implementation. Two mechanisms cover almost everything.
            </p>
          </Prose>
          <Figure
            n={11}
            caption="The general mechanism and the cheaper one. Insert the row first and do the work second, in one transaction — and then answer the sender success, because a duplicate is the system working."
          >
            <IdempotencyBlock />
          </Figure>
        </Section>

        <Section
          eyebrow="The vocabulary"
          title="Timeouts, retries and failing well"
        >
          <Prose>
            <p>
              The three answers you clicked through in the container view have a
              name: <Term id="graceful-degradation">graceful degradation</Term>,
              deciding per feature what still works when a dependency does not.
              There is a small standard vocabulary for producing them, and it is
              worth having because these cover almost everything — but the
              closing line matters more than the list.{' '}
              <strong className="font-medium text-fg">
                For most calls the right answer is a timeout and nothing else.
              </strong>
            </p>
          </Prose>
          <div className="mt-5">
            <ResiliencePatterns />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'schema',
    label: 'Schema',
    hint: 'The model becomes tables, and the rules become constraints',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The shape" title="Design the database">
          <Prose>
            <p>
              Now the model becomes a schema. If your product has organisations
              or teams, read the tenant question in <em>Record</em> before you
              write the first table: the tenant key is the one item on the
              deferral list that cannot be deferred, and it belongs on the
              tables you are about to create.
            </p>
            <p>
              <Term id="normalisation">Normalisation</Term> is the vocabulary
              for how far you have gone in removing duplicated facts. The theory
              is longer than the working rule, which is: if changing one fact
              means updating two rows, the model is wrong. A client&rsquo;s
              address stored on every invoice is not a shortcut, it is four
              hundred rows that will disagree the first time somebody moves.
            </p>
          </Prose>
          <Figure
            n={12}
            caption="The nouns with their cardinality made explicit. Three of the four relationships are obvious; the fourth is a decision, and it is the reason this view is worth drawing at all."
          >
            <ERView />
          </Figure>
        </Section>

        <Section
          eyebrow="Where the rule lives"
          title="Constraints belong in the database"
        >
          <Prose>
            <p>
              Every answer from the interrogation is a rule, and a rule is only
              worth what enforces it. Application code has bugs, gets bypassed
              by migration scripts and one-off fixes, and races with itself
              under concurrent writes. A{' '}
              <Term id="database-constraint">database constraint</Term> does not
              get bypassed, which makes the schema the only place a rule
              genuinely holds.
            </p>
            <p>
              The schema below is the invoice table those answers produce. Most
              of its load is carried by a few words that read as boilerplate.
            </p>
          </Prose>
          <Figure
            n={13}
            caption="Each annotated line is a rule the database will hold even when the application forgets. Click one to see what it buys — the load-bearing words are the ones easiest to skim past."
          >
            <SchemaInspector lines={SCHEMA_LINES} title="the invoices table" />
          </Figure>
          <Prose>
            <p>
              Two of those columns are there because the characteristics chose
              them, and it is worth naming which.{' '}
              <code className="t-data">deleted_at</code> is auditability — the
              soft delete this stage argued for, where a null means live and a
              timestamp means gone-but-answerable.{' '}
              <code className="t-data">version</code> is correctness — the
              optimistic-locking column. Neither is a default; both trace back
              to <em>Trace</em>, and a schema that skipped them would be one
              that agreed with the trace table in prose and disagreed with it in
              SQL.
            </p>
            <p>
              Auditability wants one more thing, and it is the other half of
              that trace row. A status of <code className="t-data">sent</code>{' '}
              records that an invoice was sent; it does not record <em>when</em>
              , to <em>which address</em>, or that it was sent twice. Those are
              facts about moments, which the interrogation says to store — so
              they belong in a table of their own.
            </p>
          </Prose>
          <Figure
            n={14}
            caption="Appended to and never updated, which is what makes it answer the question. The send address is stored rather than joined, because a join reports where the invoice would go today and the question was where it actually went."
          >
            <SchemaInspector
              lines={INVOICE_SENDS_LINES}
              title="the invoice_sends table"
            />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'indexes',
    label: 'Indexes',
    hint: 'Two things you write as an index: an access path, and a rule',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Answering real queries"
          title="Indexes come from the sketch, not from intuition"
        >
          <Prose>
            <p>
              Write the queries first and add the index the query needs. Both of
              these come from the system sketch you drew earlier: one from a
              screen, one from the scheduled job. Indexes cost write time and
              disk, which is why &ldquo;index everything&rdquo; is not the
              answer and &ldquo;index nothing until it hurts&rdquo; is not
              either.
            </p>
          </Prose>
          <Figure
            n={15}
            caption="Two indexes, each traced to the thing that asks for it. The second is partial, because the job never asks about drafts or paid invoices and a smaller index is a faster one."
          >
            <SchemaInspector lines={INDEX_LINES} title="the two indexes" />
          </Figure>
        </Section>

        <Section
          eyebrow="The rule UNIQUE cannot express"
          title="Some constraints have a condition on them"
        >
          <Prose>
            <p>
              The stage names races as the reason constraints belong in the
              database, then supplies only primary keys, foreign keys,{' '}
              <code className="t-data">CHECK</code> and{' '}
              <code className="t-data">UNIQUE</code> — none of which can say
              &ldquo;at most one <em>approved</em> claim per shift&rdquo;. The
              tool is a{' '}
              <Term id="partial-unique-index">partial unique index</Term>.
            </p>
          </Prose>
          <Figure
            n={16}
            caption="The race first, the index second. A plain UNIQUE (shift_id) would also forbid the second rejected claim, which is wrong — the condition is what makes the rule expressible at all."
          >
            <PartialUniqueIndex />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'tenancy',
    label: 'Tenancy',
    hint: 'Who owns the row, and what happens when the owner goes',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The two left implicit"
          title="Actors and tenancy are stored data too"
        >
          <Prose>
            <p>
              The invoicing schema has neither, because one freelancer owning
              their own rows needs neither. Most products are not that. If your
              answer to &ldquo;does every actor have the same rights?&rdquo; was
              no, or your tenant is an organisation rather than a person, this
              is the shape.
            </p>
            <p>
              And when the axis is not one level: a company that contains teams
              gives you two candidate keys, and picking wrong costs a migration.
              The rule is that the tenant key is the level at which data stops
              being shared. If a worker moving between teams should keep their
              history, the company is the tenant and the team is an ordinary
              foreign key. If teams are genuinely separate customers who must
              never see each other&rsquo;s rows, the team is the tenant.
            </p>
          </Prose>
          <Figure
            n={17}
            caption="The answer to the actor-rights interrogation question, written down. Roles live on the membership rather than on the user, because a person can manage one team and be an ordinary member of another."
          >
            <SchemaInspector lines={TENANCY_LINES} title="the tenancy tables" />
          </Figure>
        </Section>

        <Section
          eyebrow="The one that cannot be undone"
          title="Delete behaviour, decided per entity"
        >
          <Prose>
            <p>
              A foreign key is not only a pointer; it carries an instruction for
              what happens when the thing it points at goes away. That
              instruction is set once, usually while thinking about something
              else, and its consequences arrive years later in a single
              statement typed at three in the afternoon.
            </p>
          </Prose>
          <Figure
            n={18}
            caption="The same DELETE under two foreign-key policies. One quietly takes the invoices with it; the other refuses the statement outright. On financial records that is the difference between an error message and a loss you cannot reverse."
          >
            <DeleteBehaviour />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'concurrency',
    label: 'Concurrency',
    hint: 'What two writers, arriving at once, do to one row',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Beyond one row"
          title="Some invariants no constraint can express"
        >
          <Prose>
            <p>
              Moving an amount from one row to another, or writing a record and
              marking its source consumed, has to happen as one unit or not at
              all. That is a{' '}
              <strong className="font-medium text-fg">transaction</strong>: the
              work commits together or none of it does. This is the point where
              a rule stops being the database&rsquo;s job to guarantee and
              starts being yours to demarcate. The database will hold the line,
              but only around the boundary you draw.
            </p>
            <p>
              How much one transaction sees of another is its{' '}
              <Term id="isolation-level">isolation level</Term>, and the default
              is not the strictest.
            </p>
          </Prose>
          <Figure
            n={19}
            caption="The two levels worth knowing, answering the same three questions. The middle row is the section: both answer it identically, because the limit is not something read committed has and serializable fixes."
          >
            <IsolationLevels />
          </Figure>
        </Section>

        <Section
          eyebrow="The lost update"
          title="Two approvals, and one of them disappears"
        >
          <Prose>
            <p>
              Two managers open the same claim. Both read it as pending. Both
              approve. The second write silently overwrites the first, no
              constraint was violated, and nothing anywhere records that a
              decision was discarded. Two standard fixes, and both work by
              carrying something <em>across</em> the two transactions rather
              than tightening either one.
            </p>
          </Prose>
          <Figure
            n={20}
            caption="Optimistic and pessimistic locking, with the statement each one turns on. The rule: optimistic when conflict is rare, pessimistic when it is expected — and with a person deciding in the middle, it is almost always the first."
          >
            <LockingStrategies />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'races',
    label: 'Races',
    hint: 'Which mechanism stops which, and which one is never the reach',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Your turn" title="Which mechanism stops which race?">
          <Prose>
            <p>
              Three races, four mechanisms, and one of the four is never the
              tool you reach for: in one of these it cannot help at all, and in
              the other two it would work while costing you a retry path and
              seeing nothing a writer does outside the transaction. Commit
              before each verdict shows; the third is the one worth getting
              wrong.
            </p>
          </Prose>
          <div className="mt-5">
            <LockingChoice />
          </div>
        </Section>

        <Section
          eyebrow="Two terms, not oversold"
          title="What arrives with the second copy"
        >
          <Prose>
            <p>
              <Term id="cap-theorem">CAP</Term> says that when the network
              between your nodes splits, you choose between refusing requests to
              stay consistent and serving them while copies disagree. With one
              database there is no partition to survive, so it is theory. It
              becomes a real decision the moment you add a replica or a second
              service that owns data.
            </p>
            <p>
              <Term id="eventual-consistency">Eventual consistency</Term> is
              what you get at that moment: copies agree in the end, not
              immediately. Its everyday face is the read-after-write anomaly,
              where a user saves, gets redirected, reads from a replica and does
              not see their own change. That is why a read which must reflect a
              just-finished write goes to the primary — a design decision rather
              than a bug to fix later.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'evolve',
    label: 'Evolve',
    hint: 'Changing stored data once there is traffic on it',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The one it never taught"
          title="Evolve the schema safely"
        >
          <Prose>
            <p>
              This stage has said four times that stored data is the expensive
              kind. What it has not said is what you do when you have to change
              it anyway, which you will, because the schema you designed was
              designed with the understanding you had on the first day. That is
              not an argument for getting it right first time. It is an argument
              for knowing the technique, because the technique turns an
              expensive change into a tedious one.
            </p>
          </Prose>
          <div className="mt-5">
            <Callout
              kind="info"
              title="First, when you do not need any of this"
            >
              {PRE_LAUNCH_EXEMPTION}
            </Callout>
          </div>
        </Section>

        <Section eyebrow="Your turn" title="Six deploys to rename one column">
          <Prose>
            <p>
              <Term id="expand-contract">Expand-contract</Term>, also called
              parallel change. Once there is traffic, renaming a column looks
              like one statement and is actually six deploys, each of which is
              safe on its own. Two of the six feel redundant and are the two
              that get skipped — decide which before you find out.
            </p>
          </Prose>
          <div className="mt-5">
            <ExpandContract />
          </div>
        </Section>

        <Section
          eyebrow="The statement itself"
          title="A backfill has to be safe to run twice"
        >
          <Prose>
            <p>
              Idempotency, arriving where it bites hardest. Step 2&rsquo;s code
              is already writing the new columns for anyone who saves, and some
              of those people have since corrected a name the split would have
              got wrong — so the backfill must skip rows that already have a
              value, and run in batches so it never holds a long lock.
            </p>
          </Prose>
          <Figure
            n={21}
            caption="Splitting users.name into first_name and last_name. Both guards in the inner select are there because the naive version is broken, and neither failure announces itself — one corrupts every single-word name, the other means &ldquo;repeat until zero rows&rdquo; never terminates."
          >
            <pre
              tabIndex={0}
              className="overflow-x-auto border border-line bg-sunken px-4 py-4 font-mono text-[12px] leading-6 text-fg"
            >
              {BACKFILL_SQL}
            </pre>
          </Figure>
          <div className="mt-6">
            <EvolutionNotes />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'contract',
    label: 'Contract',
    hint: 'What the API promises, and what a promise costs to change',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The axis again" title="Design the API contracts">
          <Prose>
            <p>
              A contract is a promise about shape, and its real cost is{' '}
              <em>who you can force to move when you break it</em>. That is the
              same reversibility axis this stage opened on, which is why the
              decision belongs here rather than in implementation.
            </p>
            <p>
              A contract means one callable surface with a shape somebody
              depends on — a route, or an exported function another feature
              calls. Not every internal helper. If it crosses a feature boundary
              or leaves your process, it is a contract; if it is private to one
              module, it is code.
            </p>
          </Prose>
          <Figure
            n={22}
            caption="Three kinds of contract, sorted by who you can make move. Most solo projects live almost entirely in the first row, which is the argument for not building a public API until something needs one."
          >
            <ContractCost />
          </Figure>
          <div className="mt-6">
            <RouteShape />
          </div>
          <Prose>
            <p>
              How these are implemented — where validation physically goes, how
              errors are shaped, what a route file should contain — belongs to{' '}
              <Link href="/stages/05-development" className="text-brand">
                05 — Development
              </Link>
              . As with authentication, this stage decides and 05 carries it
              out.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'access',
    label: 'Access',
    hint: 'Who the caller is, and what they may do',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="The expensive one"
          title="Decide auth early, deliberately"
        >
          <Prose>
            <p>
              Auth touches the data model, every route and every query, which
              puts it at the far end of the axis this stage opened on. Changing
              it later is a migration of user records plus a rewrite of every
              access check.
            </p>
            <p>
              Three paths, none of which this playbook ranks for you. Compare
              them on the questions that will still matter in a year rather than
              on how quickly each gets you a login form.
            </p>
          </Prose>
          <Figure
            n={23}
            caption="Three paths compared on the same three questions rather than each arguing its own case. None is marked correct, because the trade genuinely differs by project — and the line under them is the part most projects get wrong."
          >
            <AuthPaths />
          </Figure>
        </Section>

        <Section
          eyebrow="Your turn"
          title="Which pattern applies to which entity?"
        >
          <Prose>
            <p>
              The part people get wrong is not authentication but{' '}
              <Term id="authorization">authorization</Term>: deciding whether
              this caller may do this thing to this record. It comes in three
              patterns, and the mistake is assuming there is only one.
            </p>
            <p>
              Ownership is the one everybody reaches for, and it is the one that
              fails quietly. It is correct for a product where each person works
              on their own things, which makes it feel general — until the first
              feature where somebody acts on a record they do not own.
            </p>
          </Prose>
          <div className="mt-5">
            <AuthzPatterns />
          </div>
          <Prose>
            <p>
              Enforcement — where the check physically goes, and what happens
              when a route forgets — is stage 05&rsquo;s.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'record',
    label: 'Record',
    hint: 'Why you chose it, and what you chose not to build',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The record" title="Write it down now, not later">
          <Prose>
            <p>
              Write the record while the alternatives are still fresh.
              Reconstructing why you chose something eight months later produces
              a plausible story rather than the actual reasons, and you will not
              be able to tell the difference from inside it.
            </p>
          </Prose>
          <Figure
            n={24}
            caption="Five headings, and what each is holding. The reasoning is the part that decays: the decision survives on its own, so in eight months only the record can say why it was made."
          >
            <ADRAnatomy />
          </Figure>
          <Prose>
            <p>
              &ldquo;Every expensive decision has an <Term id="adr">ADR</Term>
              &rdquo; is uncheckable until you say what counts as one decision.
              The rule: one ADR per thing that could be reversed independently.
              &ldquo;Next.js, Postgres and Vercel&rdquo; is three, because you
              could move the database without touching the framework.
              &ldquo;Auth.js with a Postgres adapter&rdquo; is one, because
              unpicking either half means redoing both.
            </p>
          </Prose>
        </Section>

        <Section
          eyebrow="The other half"
          title="Deciding also means deciding not to"
        >
          <Prose>
            <p>
              &ldquo;Aggressively&rdquo; needs a test, or it is just a mood.
              Here is the one, and it is this stage&rsquo;s own axis pointed at
              infrastructure:{' '}
              <strong className="font-medium text-fg">
                defer anything whose reversal does not require migrating stored
                data.
              </strong>{' '}
              Adding a cache later touches code. Adding a queue later touches
              code. Those are afternoons, and you will make the decision with
              information you do not have today — <Term id="yagni">YAGNI</Term>{' '}
              applied to infrastructure rather than to features.
            </p>
            <p>
              Two of the items below are worth knowing the boundary of rather
              than only the verdict, because people talk themselves into
              thinking they are already doing them:{' '}
              <Term id="event-sourcing">Event sourcing</Term> and{' '}
              <Term id="cqrs">CQRS</Term>. Open those two.
            </p>
            <p>One item fails the test, and the list says which.</p>
          </Prose>
          <div className="mt-5">
            <DeferredList />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where agents help, and where they design for scale you do not have',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Leverage" title="AI in architecture">
          <Prose>
            <p>
              Ask an agent to design a system and it will give you one:
              services, a queue, a cache, an event bus, a diagram with twelve
              boxes. Every one of those is on the list you just deferred. The
              model is not being careless — most architecture writing on the
              internet is about systems at a scale you do not have, and that is
              what it learned from.
            </p>
            <p>
              So point it at options and at checking, never at &ldquo;design my
              system&rdquo;. The second list below is the half worth reading
              twice.
            </p>
          </Prose>
          <div className="mt-5">
            <AIArchitecturePlays />
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The ways this stage goes wrong, and where to read further',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Traps" title="Failure modes worth naming">
          <div className="space-y-3">
            <Callout
              kind="trap"
              title="Choosing a style before choosing characteristics"
            >
              The answer sounds identical either way — &ldquo;a modular
              monolith&rdquo; — and only one of them is a decision. The other is
              a preference you will not be able to defend the first time it is
              questioned, including by yourself.
            </Callout>
            <Callout kind="trap" title="Designing for imagined scale">
              Building for a million users you do not have costs complexity
              today for benefits that will probably never arrive. If they do
              arrive, you will know enough by then to design it properly.
            </Callout>
            <Callout kind="trap" title="Microservices for a solo project">
              Every cost, no benefits. The benefits are organisational, and you
              are one person.
            </Callout>
            <Callout kind="trap" title="Storing derived state">
              An <code className="t-data">is_overdue</code> column will
              eventually disagree with the due date it came from. Compute it.
            </Callout>
            <Callout kind="trap" title="Constraints only in application code">
              Scripts, migrations and concurrent writes all go around
              application logic. The database does not get bypassed.
            </Callout>
            <Callout kind="trap" title="Deferring the auth decision">
              It touches everything, so retrofitting it means touching
              everything.
            </Callout>
            <Callout kind="trap" title="Cascading deletes on financial data">
              <code className="t-data">ON DELETE CASCADE</code> on an invoice
              foreign key is one careless statement away from silently deleting
              records you are legally required to keep.
            </Callout>
            <Callout kind="trap" title="Agonising over reversible decisions">
              Folder structure and component libraries are afternoon-sized
              changes. Spend the thinking on the data model.
            </Callout>
            <Callout kind="trap" title="No ADRs">
              The decision survives and the reasoning does not, so in eight
              months you relitigate it from scratch with worse information.
            </Callout>
          </div>
        </Section>

        <References slug="03-architecture" />
      </div>
    ),
  },
]

export function Architecture() {
  return <Stepper steps={STEPS} />
}
