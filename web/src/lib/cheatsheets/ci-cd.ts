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
          term: 'Why automate any of it',
          what: 'A defect found minutes after the push that caused it costs a fraction of the same defect found three days later in someone else’s branch.',
          when: 'Compressing that interval is the whole return. Every other benefit follows from it.',
        },
        {
          term: 'What it does not buy',
          what: 'A pipeline does not improve code. It tells you sooner what the code already is.',
          when: 'Teams that add CI without changing review or test habits get faster news about the same defects, and are surprised.',
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
      title: 'Commands worth knowing',
      note: 'The pipeline runs these; you run the same ones locally when it goes red. Tool-agnostic on purpose — swap the build and deploy lines for your stack, the shape does not move.',
      rows: [
        {
          code: 'pnpm install --frozen-lockfile',
          what: 'Installs exactly what the lockfile pins, and fails if it has drifted.',
          when: 'Every CI install. Plain `pnpm install` may quietly update the lockfile on a runner, so the build tests something the repo does not contain.',
        },
        {
          code: 'mvn clean install',
          what: 'Cleans, compiles, runs tests, packages, installs to the local repo.',
          when: 'The JVM equivalent. `mvn clean package` when nothing downstream needs the local install.',
        },
        {
          code: 'mvn sonar:sonar',
          what: 'Publishes analysis to SonarQube and applies the configured quality gate.',
          when: 'A threshold is what makes it a gate. Analysis published without one changes nothing about whether the build passes.',
        },
        {
          code: 'docker build -t app:$GIT_SHA .',
          what: 'Builds the image and tags it with the commit it came from.',
          when: 'Always tag with the SHA. See the Docker section for why `latest` cannot serve here.',
        },
        {
          code: 'docker push registry/app:$GIT_SHA',
          what: 'Uploads the tagged image to the registry the deploy target pulls from.',
          when: 'After the gate passes, before the deploy step. The registry is the handoff between CI and CD.',
        },
        {
          code: 'kubectl apply -f deployment.yml',
          what: 'Applies the manifest, creating or updating what it describes.',
          when: 'Declarative deploys. It returns as soon as the API accepts the change, not when the rollout finishes.',
        },
        {
          code: 'kubectl rollout status deploy/app',
          what: 'Blocks until the rollout completes or times out, exiting non-zero on failure.',
          when: 'The line that makes a deploy step actually fail when the deploy fails. Without it `apply` exits 0 and a crash-looping pod ships green.',
        },
        {
          code: 'kubectl rollout undo deploy/app',
          what: 'Reverts to the previous ReplicaSet.',
          when: 'The fastest rollback Kubernetes offers. Works only while the previous ReplicaSet is still retained.',
        },
        {
          code: 'terraform plan -out=tfplan',
          what: 'Computes the change set and writes it to a file.',
          when: 'In CI, always to a file. Applying a freshly recomputed plan can apply something the reviewer never saw.',
        },
        {
          code: 'terraform apply tfplan',
          what: 'Applies exactly the saved plan, with no recomputation.',
          when: 'The half that changes infrastructure, and the half worth putting behind a manual approval.',
        },
        {
          code: 'ansible-playbook -i inventory deploy.yml',
          what: 'Runs the playbook against the hosts in the inventory.',
          when: 'Long-lived servers. Add `--check` for a dry run before the real one.',
        },
      ],
    },
    {
      title: 'Docker in the pipeline',
      note: 'The artifact most pipelines actually produce. What is worth knowing here is what makes an image reproducible and rollback-able, not the Dockerfile syntax.',
      rows: [
        {
          term: 'Tag with the commit, never `latest`',
          what: 'Every image carries the SHA it was built from.',
          when: '`latest` is a moving pointer, so it cannot name a rollback target and cannot tell you what is running.',
        },
        {
          term: 'Multi-stage build',
          what: 'Build in one stage with the full toolchain, then copy only the artifact into a slim runtime stage.',
          when: 'Cuts image size sharply and keeps compilers, build secrets and dev dependencies out of what ships.',
        },
        {
          term: 'Layer order is cache strategy',
          what: 'Copy the lockfile and install dependencies *before* copying source.',
          when: 'A source-only change then reuses the dependency layer. Copying everything first invalidates the install on every commit.',
        },
        {
          term: '`.dockerignore`',
          what: 'Keeps `.git`, `node_modules` and local env files out of the build context.',
          when: 'Both a speed and a safety measure — anything in the context can end up in a layer.',
        },
        {
          term: 'Scan the image, not only the source',
          what: 'Dependency scanning reads your lockfile; image scanning also reads the base image’s OS packages.',
          when: 'A clean lockfile on a stale base image is a common and invisible gap.',
        },
        {
          term: 'Registry retention is part of rollback',
          what: 'Rollback pulls from the registry, so retention decides how far back you can actually go.',
          when: 'A policy shorter than your rollback window silently deletes the thing you would roll back to. Check it against stage 13, do not assume.',
        },
      ],
    },
    {
      title: 'Traps',
      note: 'The failures that make a pipeline stop being trusted. Most are not pipeline bugs — they are ways a green run can mean less than it appears to.',
      rows: [
        {
          term: 'Green because nothing ran',
          what: 'A path filter, an early exit or a misconfigured matrix reports success without executing the tests.',
          when: 'Assert that the tests *ran*, not only that the step exited 0. This repo hit the same shape twice — see TD-26 and TD-45 in `docs/tracker.md`.',
        },
        {
          term: 'Passes locally, fails on the runner',
          what: 'Almost always an undeclared dependency, a file never committed, or a test that depended on execution order.',
          when: 'The runner’s clean checkout is the honest environment. Your machine is the one with the state.',
        },
        {
          term: 'Secrets echoed into logs',
          what: 'A `set -x`, a debug print or a failing command that dumps its environment puts the token into a retained log.',
          when: 'Not recoverable by re-running. Rotate the credential; the log may already be read.',
        },
        {
          term: 'A pipeline nobody can run locally',
          what: 'If the only way to reproduce a failure is to push again, every debug cycle costs a full run.',
          when: 'Keep the steps as scripts the developer can invoke directly, with the workflow file calling them.',
        },
        {
          term: 'Flaky tests retried into green',
          what: 'A blanket retry that turns red into green teaches the team that red means "try again".',
          when: 'Quarantine the flake and fix it. A blanket retry defers the decision without ever making it.',
        },
        {
          term: 'Bypassing the gate under deadline',
          what: 'The gate gets skipped exactly when the pressure that causes mistakes is highest.',
          when: 'If it is bypassable it will be bypassed; branch protection is the mechanism, not team discipline.',
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
