import Link from 'next/link'
import { Callout, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { Term } from '@/components/Term'
import { Stepper, type Step } from '@/components/Stepper'
import { References } from '@/components/References'
import { ReversibilityAxis } from './ReversibilityAxis'
import { ReversibilityTable } from './ReversibilityTable'
import { DomainSketch } from './DomainSketch'
import { ModelInterrogation } from './ModelInterrogation'
import { DriftDiagram } from './DriftDiagram'
import { DomainWorksheet } from './DomainWorksheet'
import { SchemaInspector } from './SchemaInspector'
import { DeleteBehaviour } from './DeleteBehaviour'
import { OneAppCosts } from './OneAppCosts'
import { SplitTrigger } from './SplitTrigger'
import { BoundaryMap } from './BoundaryMap'
import { TeamNotes } from './TeamNotes'
import { AuthPaths } from './AuthPaths'
import { ADRAnatomy } from './ADRAnatomy'
import { DeferredList } from './DeferredList'
import { AIArchitecturePlays } from './AIArchitecturePlays'

const STEPS: Step[] = [
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
              Working in nouns first is not a formality. A relationship you can
              say out loud is a relationship you can argue with; the same
              relationship expressed as a foreign key is already a decision
              nobody will revisit.
            </p>
          </Prose>
          <Figure
            n={2}
            caption="The nouns come before the tables, and the tables come from the nouns. Each edge carries the verb — &ldquo;has many&rdquo; — because a bare arrow says two things are related without saying how."
          >
            <DomainSketch />
          </Figure>
        </Section>

        <Section eyebrow="Your turn" title="Interrogate the model">
          <Prose>
            <p>
              A sketch like the one above looks finished long before it is. Four
              questions put to it now will surface the errors that are otherwise
              found by a migration eighteen months in. Answer each before the
              reasoning shows.
            </p>
            <p>
              The reasoning appears whichever way you answered, because the
              defensible answer is worth less than the argument for it — and one
              of these four genuinely depends on a product you have not
              described.
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
            n={3}
            caption="A stored flag and the date it was derived from, one week apart. Nothing wrote to the row and it is now wrong. The computed version cannot reach that state at all, which is the whole argument."
          >
            <DriftDiagram />
          </Figure>
        </Section>

        <Section eyebrow="The artifact" title="Write down your own domain">
          <Prose>
            <p>
              The same four questions, turned on the thing you are actually
              building. What are the nouns; what should be computed rather than
              stored; what happens on delete, entity by entity — a{' '}
              <Term id="soft-delete">soft delete</Term> keeps the row and taxes
              every query afterwards, so it is a trade to make deliberately
              rather than a default. Last, what must be unique and in what
              scope.
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
    id: 'constrain',
    label: 'Constrain',
    hint: 'Rules the database holds, not the application',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Where the rule lives"
          title="Constraints belong in the database"
        >
          <Prose>
            <p>
              Every answer from the last step is a rule, and a rule is only
              worth what enforces it. Application code has bugs, gets bypassed
              by migration scripts and one-off fixes, and races with itself
              under concurrent writes. A{' '}
              <Term id="database-constraint">database constraint</Term> does not
              get bypassed, which makes the schema the only place a rule
              genuinely holds.
            </p>
            <p>
              The schema below is the invoice table those four answers produce.
              Most of its load is carried by a few words that read as
              boilerplate.
            </p>
          </Prose>
          <Figure
            n={4}
            caption="Each annotated line is a rule the database will hold even when the application forgets. Click one to see what it buys — the load-bearing words are the ones easiest to skim past."
          >
            <SchemaInspector />
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
            n={5}
            caption="The same DELETE under two foreign-key policies. One quietly takes the invoices with it; the other refuses the statement outright. On financial records that is the difference between an error message and a loss you cannot reverse."
          >
            <DeleteBehaviour />
          </Figure>
        </Section>
      </div>
    ),
  },
  {
    id: 'shape',
    label: 'Shape',
    hint: 'One application, with honest boundaries inside',
    content: (
      <div className="space-y-16">
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
              That single rule is the difference between extracting a service
              later as a mechanical job and doing it as archaeology.
            </p>
          </Prose>
          <Figure
            n={7}
            caption="Three calls between three modules, where only the shape of the call decides whether it is allowed. Reaching straight into another module&rsquo;s table works, is shorter, and is the move that turns a monolith into a ball of mud."
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
    id: 'decide',
    label: 'Decide',
    hint: 'The expensive choice, and the record of why',
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
            n={8}
            caption="Three paths compared on the same three questions rather than each arguing its own case. None is marked correct, because the trade genuinely differs by project — and the line under them is the part most projects get wrong."
          >
            <AuthPaths />
          </Figure>
        </Section>

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
            n={9}
            caption="Five headings, and what each is holding. The reasoning is the part that decays: the decision survives on its own, so in eight months only the record can say why it was made."
          >
            <ADRAnatomy />
          </Figure>
        </Section>

        <Section
          eyebrow="The other half"
          title="Deciding also means deciding not to"
        >
          <Prose>
            <p>
              Everything below solves a real problem. None of them solves a
              problem you have yet, and each one makes every subsequent change
              more expensive — <Term id="yagni">YAGNI</Term> applied to
              infrastructure rather than to features. Deferring is only a
              decision if it is written down, which is why the list is here
              rather than implied.
            </p>
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

        <Section eyebrow="Traps" title="Failure modes worth naming">
          <div className="space-y-3">
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
