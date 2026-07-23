# 11. CI/CD

> An automated gate that makes "it works on my machine" irrelevant, and a deploy path
> boring enough that you ship on a Friday without thinking about it.

**When this actually happens:** Wired during [04 — Project Setup](04-project-setup.md),
on day one. This doc is the full treatment; stage 04 has the minimum viable version. You
return here when the pipeline needs to grow, not when you are starting out.

---

## Entry criteria

- [ ] Repository exists with a `main` branch
- [ ] `pnpm build`, `pnpm vitest run`, and `pnpm tsc --noEmit` all pass locally
- [ ] Vercel project is linked ([04](04-project-setup.md))

---

## The work

### The division of labor

Two systems, two jobs, and keeping them separate is what keeps both understandable:

- **GitHub Actions is the gate.** It decides whether code is allowed into `main`.
- **Vercel is the deployer.** It builds and ships every push, with no configuration.

Do not build deployment in Actions. Vercel's Git integration already does it, does it
faster with warm caches, and gives you preview URLs for free. Actions exists to say
yes or no.

### The gate

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Format
        run: pnpm format:check

      - name: Lint
        run: pnpm lint   # eslint --max-warnings 0 — see the trap below

      - name: Typecheck
        run: pnpm tsc --noEmit

      - name: Unit and integration tests
        run: pnpm vitest run --coverage

      - name: Build
        run: pnpm build
```

Three details that are easy to miss:

**`concurrency` with `cancel-in-progress`.** Push three times to a branch and you get one
run, not three. This is free money on both minutes and queue time.

**`--frozen-lockfile`.** Fails if `pnpm-lock.yaml` disagrees with `package.json` instead
of silently resolving different versions than you tested with. Non-negotiable in CI.

**`timeout-minutes`.** Without it, a hung process burns the full six-hour default. Ten
minutes is generous for this pipeline; if you legitimately exceed it, the pipeline is the
problem.

### Ordering: cheapest failure first

Lint, typecheck, test, build — in that order, deliberately. Lint fails in seconds,
typecheck in a few more, tests in a minute, build last. Putting the build first means
waiting two minutes to learn about a formatting error.

Sequential steps in one job, not parallel jobs. Parallel jobs each pay the
checkout-and-install cost, which for a pipeline this size exceeds what parallelism saves.
Revisit that when the suite passes roughly five minutes.

### End-to-end tests

E2E is slow and flakier than unit tests, so it does not belong in the same job blocking
every push. Run it against the actual preview deployment:

```yaml
# .github/workflows/e2e.yml
name: E2E

on:
  deployment_status:

jobs:
  test:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm exec playwright test
        env:
          BASE_URL: ${{ github.event.deployment_status.environment_url }}

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

The `deployment_status` trigger means these run after Vercel finishes, against the real
preview URL — a real build, real edge network, real database. That is a meaningfully
better signal than testing a dev server.

Uploading the report on failure matters. A failed E2E run with no trace is a debugging
session that starts from nothing; Playwright's trace viewer starts you at the failing
step with a DOM snapshot.

### Branch protection

The pipeline is decoration until this is on. In repository settings, require:

- Status check `verify` to pass
- Branches to be up to date before merging
- Linear history (squash or rebase merges only)

Enable **auto-merge** too. Approve a PR, let it merge itself when checks go green,
stop babysitting.

### Dependency updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly }
    open-pull-requests-limit: 5
    groups:
      dev-dependencies:
        dependency-type: development
      production-minor:
        dependency-type: production
        update-types: [minor, patch]
```

Grouping is what makes this survivable. Ungrouped, you get fifteen pull requests a week,
stop reading them, and the automation becomes noise you route around. Grouped, you get
two: one for dev dependencies (merge if CI is green) and one for production minors
(skim the changelogs). Majors arrive individually, which is correct — they deserve
attention.

### Secrets

Secrets live in GitHub Actions secrets and Vercel environment variables. Never in the
repository, never in workflow files, never echoed to logs.

Prefer OIDC over long-lived tokens where the provider supports it — short-lived
credentials minted per run cannot leak from a config file that no longer holds them.

---

## Artifacts

- `.github/workflows/ci.yml` — the merge gate
- `.github/workflows/e2e.yml` — post-deploy verification against preview URLs
- `.github/dependabot.yml` — grouped weekly updates
- Branch protection enforcing `verify`, with auto-merge enabled
- Uploaded Playwright reports on E2E failures

---

## Definition of done

- [ ] A pull request runs the gate automatically
- [ ] A deliberately broken commit turns CI red (verify this by doing it)
- [ ] Merging is blocked while checks are red
- [ ] E2E runs against the preview URL after Vercel deploys
- [ ] A failing E2E run produces a downloadable trace
- [ ] Full pipeline finishes in under five minutes
- [ ] Dependabot pull requests arrive grouped, not individually

---

## Scaling to a team

- **Require approvals.** One reviewer minimum; branch protection enforces it.
- **Split jobs when the suite grows.** Past five minutes, parallel jobs start paying off
  despite the duplicated install cost. Matrix the test job by directory.
- **Add a merge queue** once concurrent merges start conflicting — typically around four
  or five active engineers. It tests each PR against the actual post-merge state rather
  than a stale branch point.
- **Cache aggressively.** Shared Turborepo remote cache stops every engineer rebuilding
  identical artifacts.
- **Publish flakiness data.** Flaky tests get tolerated on a team because everyone assumes
  someone else will fix them. A visible retry rate makes the cost legible.

---

## Traps

**Building deploys in Actions.** You will spend a weekend reimplementing what Vercel's
Git integration gives you, and the result will be slower and have no preview URLs. Let
each system do its job.

**A pipeline slow enough to route around.** Past ten minutes, people stop waiting for
green before merging, and the gate becomes advisory. Speed is a correctness feature.

**Tolerating flaky tests.** One test that fails 5% of the time trains you to re-run red
builds without reading them. That habit is what lets a real failure through. Fix it or
delete it — a test you do not trust has negative value.

**Testing against the dev server.** The dev server has different bundling, different
caching, and no edge network. Passing there and failing in production is a common and
avoidable surprise.

**`npm install` instead of `--frozen-lockfile`.** CI silently resolves different versions
than you tested against, and you get a green build for code that will not run.

**A lint step that ignores warnings.** ESLint exits 0 when there are only warnings, and
most of `eslint-config-next`'s rules are warnings — so a bare `eslint` step waves through
unused variables, missing deps arrays, all of it. Gate at `--max-warnings 0`. This
playbook's own gate let an unused variable through twice before the teeth check exposed
it; the fix had to land in the hook *and* the script, because the hook called eslint
directly.

**Unenforced branch protection.** Every pipeline problem eventually traces back to a gate
that was never actually required.

**Ungrouped Dependabot.** Fifteen PRs a week becomes zero PRs read, which is worse than
no automation because you believe you are covered.
