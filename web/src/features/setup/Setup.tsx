import { Stepper, type Step } from '@/components/Stepper'
import { Callout, Contrast, Prose, Section } from '@/components/ui'
import { Figure } from '@/components/Figure'
import { References } from '@/components/References'
import { AnnotatedArtifact } from './AnnotatedArtifact'
import { ClientTrap } from './ClientTrap'
import { PinExercise } from './PinExercise'
import { TreeInspector } from './TreeInspector'
import { ARTIFACTS } from './artifacts'
import { type StepId } from './steps'

/**
 * Stage 04's fifteen panels.
 *
 * Steps 1–8 carry their content; 9–15 are still the Wave 0 skeleton until
 * Task 13. The stage went `ready: true` before any of it existed, deliberately:
 * the exit condition of every content task is a panel measurement at 1024×768,
 * and there is nothing to measure until the route renders.
 *
 * Four of the fifteen are provisional — `structure`, `client`, `enforce` and
 * `verify` — and merge into the step above them if the combined panel measures
 * under 3.2 screens. They are authored split because a merge undoes with a
 * delete, while a split costs new ids and every reference to them. See
 * `steps.ts`.
 */
const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'scaffold',
    label: 'Scaffold',
    hint: 'Which file does each environment actually read',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Day one" title="Scaffold, and pin what runs it">
          <Prose>
            <p>
              One command produces the app.{' '}
              <code className="t-data break-words">--src-dir</code> keeps
              application code in{' '}
              <code className="t-data break-words">src/</code> and leaves the
              root for configuration, which is worth it the moment the root
              accumulates a dozen config files.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.scaffoldCmd} />
          </div>
        </Section>

        <Section
          eyebrow="The exercise"
          title="Pin the version in the file each environment reads"
        >
          <Prose>
            <p>
              Three environments run this code and no single file reaches all
              three. Pair each one with the file it actually reads, before the
              verdict shows. The middle one is the pairing this stage was
              corrected for.
            </p>
          </Prose>
          <div className="mt-5">
            <PinExercise />
          </div>
        </Section>

        <Section eyebrow="Then" title="Give it a remote before anything else">
          <Prose>
            <p>
              <code className="t-data break-words">create-next-app</code> has
              already run <code className="t-data break-words">git init</code>{' '}
              and made the first commit, on{' '}
              <code className="t-data break-words">main</code> — that branch
              name comes from the scaffold, not from your git config, which
              still defaults to{' '}
              <code className="t-data break-words">master</code>. What it cannot
              do is create the repository on GitHub, and everything downstream
              assumes one exists.
            </p>
            <p>
              Everything you have edited since is still uncommitted, and that
              first commit predates all of it. Commit before you push, or the
              repository you create holds the scaffold and none of your pins.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.repoCmd} />
          </div>
          <div className="mt-5">
            <Callout kind="info" title="Check the two logs match">
              <p>
                <code className="t-data break-words">git log --oneline</code> on
                GitHub and locally should now show the same first commit. That
                is the thing §8 later asks you to check about a{' '}
                <em>deployment</em>, and it is worth being in the habit before a
                dashboard is involved.
              </p>
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'structure',
    label: 'Structure',
    hint: 'Feature-first, or layer-first',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Day one" title="Where a new file goes">
          <Prose>
            <p>
              Decide this now. Retrofitting structure is a large, boring,
              error-prone refactor that never feels urgent enough to prioritize.
            </p>
            <p>
              The organizing principle is{' '}
              <strong className="text-fg">
                feature-first, not layer-first
              </strong>
              . A <code className="t-data break-words">components/</code>,{' '}
              <code className="t-data break-words">hooks/</code>,{' '}
              <code className="t-data break-words">utils/</code> split means
              every feature change touches four distant folders. A feature
              folder means the billing code lives in the billing folder, and
              deleting the feature is deleting one directory.
            </p>
          </Prose>
          <Figure
            n={1}
            caption="The tree, one node at a time. Every folder carries the reason it exists; one of them is conditional, and which one is the judgment this step asks for."
          >
            <TreeInspector />
          </Figure>
        </Section>

        <Section eyebrow="The rule" title="Route files stay thin">
          <Prose>
            <p>
              Files under <code className="t-data break-words">src/app/</code>{' '}
              handle routing, auth checks, and composition. Business logic lives
              in <code className="t-data break-words">src/features/</code>. This
              keeps logic testable without booting a framework.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'format',
    label: 'Format',
    hint: 'One tool lints, one formats — and where the flag lives',
    content: (
      <div className="space-y-16">
        <Section eyebrow="The toolchain" title="Lint and format are two jobs">
          <Prose>
            <p>
              <code className="t-data break-words">create-next-app</code>{' '}
              already wired ESLint with{' '}
              <code className="t-data break-words">eslint-config-next</code> —
              keep it. Its react-hooks rules are the ones that catch real bugs;
              a setState-in-effect rule found a cascading render in this
              playbook&rsquo;s own app. Add Prettier for formatting, and{' '}
              <code className="t-data break-words">
                eslint-config-prettier/flat
              </code>{' '}
              last in{' '}
              <code className="t-data break-words">eslint.config.mjs</code> to
              stop the two arguing. One tool lints, one formats, and neither
              owns the other&rsquo;s job.
            </p>
          </Prose>
          <div className="mt-5 space-y-5">
            <AnnotatedArtifact artifact={ARTIFACTS.prettierrc} />
            <AnnotatedArtifact artifact={ARTIFACTS.lint} />
          </div>
        </Section>

        <Section eyebrow="The trap" title="Run it once before wiring the gate">
          <Prose>
            <p>
              <code className="t-data break-words">create-next-app</code> writes
              double quotes and semicolons; the config above has just said
              otherwise. Skip{' '}
              <code className="t-data break-words">pnpm format</code> and your
              first CI run goes red on six files you never opened, which teaches
              exactly the wrong lesson about the gate on its first day.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'strict',
    label: 'Strict',
    hint: "Which flags earn the first week's friction",
    content: (
      <div className="space-y-16">
        <Section eyebrow="The toolchain" title="Strictness you turn on once">
          <Prose>
            <p>
              <code className="t-data break-words">create-next-app</code>{' '}
              produces a reasonable{' '}
              <code className="t-data break-words">tsconfig.json</code>. Four
              flags are worth adding on day one, because adding them later means
              fixing every violation at once.
            </p>
          </Prose>
          <div className="mt-5 space-y-5">
            <AnnotatedArtifact artifact={ARTIFACTS.tsconfig} />
            <AnnotatedArtifact artifact={ARTIFACTS.typecheck} />
          </div>
        </Section>

        <Section
          eyebrow="Why the script is not bare tsc"
          title="Route types are generated, not written"
        >
          <Prose>
            <p>
              A bare <code className="t-data break-words">tsc --noEmit</code>{' '}
              passes locally off a stale build and fails on a clean checkout —
              which is exactly how CI caught it here. Off Next.js, drop{' '}
              <code className="t-data break-words">
                next typegen &amp;&amp;
              </code>{' '}
              and use bare{' '}
              <code className="t-data break-words">tsc --noEmit</code>.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'env',
    label: 'Env',
    hint: 'Validate at boot, or read process.env',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Configuration" title="Fail at boot, not at 3am">
          <Prose>
            <p>
              Untyped <code className="t-data break-words">process.env</code>{' '}
              access is a runtime crash waiting for production. Validate once,
              at startup, and import{' '}
              <code className="t-data break-words">env</code> everywhere
              instead. A missing variable then fails at boot with a message
              naming the variable, rather than surfacing as{' '}
              <code className="t-data break-words">undefined</code> in a request
              handler three weeks later.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.env} />
          </div>
        </Section>

        <Section
          eyebrow="The judgment"
          title="The schema is a gate, not a wishlist"
        >
          <Prose>
            <p>
              Every key in it needs a value before anything boots, so a key for
              a database you have not chosen yet locks you out of your own dev
              server.
            </p>
          </Prose>
          <div className="mt-5">
            <Contrast
              badLabel="A key you cannot supply"
              goodLabel="A key you can supply today"
              bad={
                <p>
                  <code className="t-data break-words">
                    DATABASE_URL: z.url()
                  </code>
                  , with no database chosen.
                  <span className="mt-2 block text-subtle">
                    Nothing boots.{' '}
                    <code className="t-data break-words">.optional()</code>{' '}
                    works too, and invites{' '}
                    <code className="t-data break-words">env.DATABASE_URL</code>{' '}
                    to be typed{' '}
                    <code className="t-data break-words">
                      string | undefined
                    </code>{' '}
                    in code that will one day require it.
                  </span>
                </p>
              }
              good={
                <p>
                  The line commented out, uncommented in the same commit that
                  adds the client.
                  <span className="mt-2 block text-subtle">
                    The whole idiom. The schema stays a description of what this
                    app needs right now.
                  </span>
                </p>
              }
            />
          </div>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.envExample} />
          </div>
          <div className="mt-5">
            <Callout kind="info" title="NODE_ENV is deliberately absent">
              <p>
                Next sets it —{' '}
                <code className="t-data break-words">development</code> for{' '}
                <code className="t-data break-words">pnpm dev</code>,{' '}
                <code className="t-data break-words">production</code> for{' '}
                <code className="t-data break-words">pnpm build</code> — and
                pinning it yourself is how you end up with a dev server that
                believes it is in production.
              </p>
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'client',
    label: 'Client',
    hint: 'The failure every gate on this page stays green for',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="Configuration"
          title="One limit on &ldquo;import env everywhere&rdquo;"
        >
          <Prose>
            <p>
              Server modules only, never a{' '}
              <code className="t-data break-words">&apos;use client&apos;</code>{' '}
              file. The browser&rsquo;s{' '}
              <code className="t-data break-words">process.env</code> is a shim,
              not your environment: Next substitutes static{' '}
              <code className="t-data break-words">
                process.env.NEXT_PUBLIC_*
              </code>{' '}
              reads in client code and nothing else, and{' '}
              <code className="t-data break-words">
                schema.parse(process.env)
              </code>{' '}
              is not a static read. The client gets an empty object and every
              key fails at once — including{' '}
              <code className="t-data break-words">NEXT_PUBLIC_APP_URL</code>,
              which is usually why someone imported it there to begin with.
            </p>
            <p>Before the answer: which of these catches it?</p>
          </Prose>
          <div className="mt-5">
            <ClientTrap />
          </div>
        </Section>

        <Section
          eyebrow="What to do instead"
          title="Pass it down, or read the public key directly"
        >
          <Prose>
            <p>
              When a client component needs a configured value, pass it as a
              prop from a server component, or read{' '}
              <code className="t-data break-words">
                process.env.NEXT_PUBLIC_APP_URL
              </code>{' '}
              directly — which is the static read Next does substitute.
            </p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'hooks',
    label: 'Hooks',
    hint: 'What belongs on commit, and what belongs on push',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Enforcement" title="Two hooks, two budgets">
          <Prose>
            <p>
              Hooks catch mistakes before they reach CI, where the feedback loop
              is minutes instead of seconds. Format on commit, verify on push.
              Keep the full test suite out of{' '}
              <code className="t-data break-words">pre-commit</code> — a hook
              slow enough to be annoying is a hook people bypass with{' '}
              <code className="t-data break-words">--no-verify</code>, and then
              you have no hook.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.lefthook} />
          </div>
        </Section>

        <Section
          eyebrow="The one that bites"
          title="A fresh clone has no hooks at all"
        >
          <Prose>
            <p>
              Hooks installed by{' '}
              <code className="t-data break-words">lefthook install</code> exist
              only on the machine that ran it. A{' '}
              <code className="t-data break-words">prepare</code> script fixes
              that, and the <code className="t-data break-words">|| true</code>{' '}
              on it is not defensive clutter.
            </p>
          </Prose>
          <div className="mt-5">
            <AnnotatedArtifact artifact={ARTIFACTS.prepare} />
          </div>
          <div className="mt-5">
            <Callout
              kind="warn"
              title="It is a property of prepare, not of lefthook"
            >
              <p>
                pnpm runs <code className="t-data break-words">prepare</code> on
                every install,{' '}
                <code className="t-data break-words">lefthook install</code>{' '}
                exits 1 outside a git repository, and build hosts check out your
                source without a{' '}
                <code className="t-data break-words">.git</code>. Neither{' '}
                <code className="t-data break-words">CI=1</code> nor{' '}
                <code className="t-data break-words">VERCEL=1</code> changes it,
                and Husky fails identically for the identical reason.
              </p>
            </Callout>
          </div>
        </Section>
      </div>
    ),
  },
  {
    id: 'ci',
    label: 'CI',
    hint: 'The minimum pipeline, and which name to require',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Enforcement" title="The pipeline, cheapest first">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'enforce',
    label: 'Enforce',
    hint: 'Enforcement is not verification',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Enforcement" title="A green check is not a guarantee">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'deploy',
    label: 'Deploy',
    hint: 'Which failures your repository cannot express',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Deployment" title="Four ways the first deploy fails">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'verify',
    label: 'Verify',
    hint: 'Check what it built, not whether it built',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Deployment" title="Check the SHA, not the status">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'proof',
    label: 'Proof',
    hint: 'What counts as evidence that error tracking works',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Deployment" title="Prove the alarm is wired">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Where an agent reaches, and where it cannot',
    content: (
      <div className="space-y-16">
        <Section
          eyebrow="AI in the loop"
          title="Where an agent reaches, and where it cannot"
        >
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'checklist',
    label: 'Checklist',
    hint: 'Done, and what changes on a team',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Closing" title="What you should have, and when">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'The seven that cost the most',
    content: (
      <div className="space-y-16">
        <Section eyebrow="Closing" title="Seven traps">
          <Prose>
            <p>Content lands in Task 13.</p>
          </Prose>
        </Section>
      </div>
    ),
  },
]

export function Setup() {
  return (
    <>
      <Stepper steps={STEPS} />
      <References slug="04-project-setup" />
    </>
  )
}
