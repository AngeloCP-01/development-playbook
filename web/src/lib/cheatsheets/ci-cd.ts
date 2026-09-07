import type { Cheatsheet } from './types'

/**
 * The platform-agnostic half of stage 11. `github-actions` is the tool-specific
 * companion — the same split `git-commands`/`git-branching` and
 * `testing`/`playwright` already use.
 *
 * Built from three gathered graphics; one is displayed and two are consulted,
 * the convention D-89 recorded and D-90 kept on file for the next sheet drawing
 * on more than one source. This is that sheet.
 */
export const ciCd: Cheatsheet = {
  slug: 'ci-cd',
  title: 'CI/CD Pipeline',
  group: 'Standards',
  stage: '11-ci-cd',
  blurb:
    'The stages every pipeline runs, what fails at each one, and which tool plays which role.',
  source: {
    title: 'CI/CD Workflow — Simplified Visual Guide',
    author: 'ByteByteGo',
    url: 'https://blog.bytebytego.com',
    image: {
      src: '/reference/ci-cd.webp',
      width: 1344,
      height: 1846,
      alt: 'A feature branch runs alongside a main branch on the left. Code is pushed to Jenkins, which runs a continuous integration pass — application build, code quality check, unit tests — that fails on the tests and reports back to the developer. A second push passes. The branch is then reviewed, approved and merged to main, which triggers a second build running five checks in sequence: app build, code analysis, unit tests, integration tests, security scanning. All pass, an image is pushed to a Docker registry, and continuous deployment ships it to a Kubernetes cluster.',
    },
  },
  sections: [
    {
      title: 'Integration, delivery, deployment',
      note: 'CD stands for two different things. Which one you have is settled by a single question: does a human still press a button?',
      rows: [
        {
          term: 'Continuous integration',
          what: 'Every push is merged into the shared branch and built and tested automatically, on a clean machine.',
          when: 'The floor everything else stands on. Without it the two below have nothing trustworthy to ship.',
        },
        {
          term: 'Continuous delivery',
          what: 'Every passing build is packaged and proven deployable. Releasing it stays a human decision.',
          when: 'Coordinated launches, regulated work, anything where *when* to ship is a business call rather than an engineering one.',
        },
        {
          term: 'Continuous deployment',
          what: 'Every passing build goes to production with no human gate at all.',
          when: 'Only once the verification of stage 14 and the rollback of stage 13 are already in place. Teams arrive here after those exist, not before.',
        },
        {
          term: 'The feedback loop',
          what: 'Each stage reports back to whoever pushed, by the route they actually read.',
          when: 'A failure nobody sees is a failure that ships, and this is the half of the pipeline most often left unfinished.',
        },
      ],
    },
    {
      title: 'The pipeline stages',
      note: 'Ordered cheapest failure first. Each stage costs more to run than the one above it, so the cheap ones go first and spare you the expensive ones entirely.',
      rows: [
        {
          term: 'Build from source',
          what: 'Compiles or bundles from a clean checkout — never from a machine that already has the answer cached.',
          when: 'Catches the uncommitted file and the undeclared dependency: the “works on my laptop” class, found in seconds.',
        },
        {
          term: 'Code analysis',
          what: 'Lint, type check, static analysis. Nothing is executed.',
          when: 'Seconds, not minutes, because no test runner boots. Put it before the tests and most bad pushes never reach them.',
        },
        {
          term: 'Unit tests',
          what: 'Functions and modules in isolation, with no network, database or filesystem in play.',
          when: 'The bulk of the suite. Fast enough that a developer runs them before pushing, not only in CI.',
        },
        {
          term: 'Integration tests',
          what: 'Modules against their real collaborators: a database, an HTTP API, a queue.',
          when: 'Where wiring errors surface. Slower and flakier than unit tests, which is exactly why they sit below them.',
        },
        {
          term: 'Security scanning',
          what: 'Dependency CVEs, committed secrets, known-vulnerable code patterns.',
          when: 'Dependabot and secret scanning are the cheap always-on version; SAST is the thorough one that earns a slower job.',
        },
        {
          term: 'Package the artifact',
          what: 'The deployable thing — a container image, a bundle, a signed binary — tagged with the commit SHA.',
          when: 'What ships must be the exact bytes that passed. Rebuilding at deploy time breaks that guarantee.',
        },
        {
          term: 'Deploy',
          what: 'Push the tagged artifact to a registry, then let the orchestrator or platform roll it out.',
          when: 'The strategy for *how* it rolls out — blue/green, canary, rolling — belongs to stage 13, not here.',
        },
      ],
    },
    {
      title: 'Who plays each role',
      note: 'The stages above are the same everywhere; the tools filling them swap freely. This playbook runs GitHub Actions onto Vercel — the plate above shows the identical shape with Jenkins and Kubernetes.',
      rows: [
        {
          term: 'Runner',
          what: 'GitHub Actions, GitLab CI, Jenkins, CircleCI.',
          when: 'Executes the stages. See `github-actions` for the syntax this playbook actually writes.',
        },
        {
          term: 'Build tool',
          what: 'Maven or Gradle on the JVM, pnpm or npm on Node, Cargo, the Go toolchain.',
          when: 'Invoked *by* the runner. Keep the command identical to the one you run locally.',
        },
        {
          term: 'Quality gate',
          what: 'SonarQube, CodeQL, ESLint with `tsc`.',
          when: 'A gate has a threshold and fails the build when it is crossed. Without a threshold you have a report, and reports stop nothing.',
        },
        {
          term: 'Artifact registry',
          what: 'GitHub Container Registry, Docker Hub, Amazon ECR, Nexus.',
          when: 'Where the packaged artifact waits between build and deploy. Retention policy matters — rollback reads from here.',
        },
        {
          term: 'Runtime target',
          what: 'Kubernetes, ECS or Fargate, Vercel, Cloud Run.',
          when: 'What pulls the artifact and runs it. Covered by stage 13; `aws-deployment` has the AWS specifics.',
        },
        {
          term: 'Provisioning',
          what: 'Terraform, CloudFormation, Pulumi.',
          when: 'Creates the infrastructure the artifact lands on. Runs in its own pipeline on its own cadence — not on every application push.',
        },
        {
          term: 'Configuration management',
          what: 'Ansible, Chef, Puppet.',
          when: 'Shapes long-lived servers after provisioning. Largely displaced by immutable images wherever containers are used.',
        },
      ],
    },
    {
      title: 'Practices that keep it useful',
      note: 'A pipeline nobody trusts gets worked around, and a worked-around pipeline is worse than none: the branch looks guarded when it is not.',
      rows: [
        {
          term: 'Keep the gate under ten minutes',
          what: 'Past roughly ten minutes people stop waiting for the result and start merging on optimism.',
          when: 'Three levers, in order of payoff: cheapest-failure-first ordering, dependency caching, parallel jobs.',
        },
        {
          term: 'Build once, promote the same artifact',
          what: 'One build feeds staging and production. The artifact is promoted, never rebuilt per environment.',
          when: 'Rebuilding per environment tests one set of bytes and ships another. Environment differences belong in config, not in the build.',
        },
        {
          term: 'Version every artifact',
          what: 'Tag with the commit SHA. Never deploy `latest`.',
          when: 'Rollback needs a specific thing to roll back *to*, and `latest` moves, so it cannot name the build you want back.',
        },
        {
          term: 'Test at every stage',
          what: 'Each stage catches a class of failure the others cannot see.',
          when: 'Consolidating everything into one “run the tests” step trades the whole cheapest-first ordering for one slow verdict.',
        },
        {
          term: 'Keep the pipeline in the repo',
          what: 'Workflow files are reviewed, versioned and rolled back exactly like the code they gate.',
          when: 'A pipeline configured only through a web UI has no history, no review, and no way to explain when it changed.',
        },
        {
          term: 'Fail loudly, to the person who pushed',
          what: 'Route the failure to where that developer already looks, and make the message say which stage and why.',
          when: 'A red build that only the dashboard knows about may as well be green.',
        },
      ],
    },
  ],
}
