# The Default Stack

<!-- Generated from web/src/lib/stack.ts. Do not edit by hand.
     Edit that source and run `pnpm gen:stack` from web/ to regenerate. -->

Tool choices for a new project, with the reason for each choice and the conditions that call for another one. Stage documents link here for shared defaults.

These are starter defaults, not an inventory of this static site. At the 2026-11-04 review, this site used Next.js 16.2.10, React 19.2.4 and TypeScript 5.9.3; no database, Redis, Sentry or analytics installation is established by this reference.

## Version policy

Version families below are reviewed starting points, not a promise that every later major is compatible. Choose a supported combination, pin the selected toolchain and read migration guidance before changing majors.

Check the package registry for release availability, then verify framework, lint, test and host compatibility. A registry version lookup alone does not validate a stack.

Source review: 2026-11-04, limited to the claims and links identified below. This is not a full dependency or provider audit. Review undated selections before adopting them.

## Core

| Concern | Choice | Version / support | Rationale and caveats |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.x | Server Components reduce client/server data plumbing. Next 16 documents Node 20.9.0 and TypeScript 5.1.0 minima. Those minima do not establish support for every dependency in a project. [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) (reviewed 2026-11-04). |
| UI library | React | 19.2.x | Use the React and React DOM versions supported by the selected Next release, and keep the two aligned. The Next App Router also integrates React Canary features; do not treat all React 19 releases as interchangeable. |
| Language | TypeScript | 7.x | The Go-based native compiler is released as TypeScript 7.0. The 7.0 release does not include a programmatic API and documents using TypeScript 6 alongside it for API consumers such as typescript-eslint. Check the exact release and toolchain before adopting it. This site still uses TypeScript 5; no local TypeScript 7 benchmark or build is claimed. [Microsoft: TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) (reviewed 2026-11-04). |
| Runtime | Node.js | 22 Maintenance LTS; at least 22.22.2 with jsdom 30 | Select a supported patch in the file each environment reads: .nvmrc for local shells and CI, engines.node in package.json for Vercel. Node 22 reaches end of life on 2027-04-30. Vercel selects a major and manages its patches; check the actual build/runtime rather than assuming a local patch pin controls the host. [Node.js release schedule](https://github.com/nodejs/Release) (reviewed 2026-11-04). [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) (reviewed 2026-11-04). |
| Package manager | pnpm | 10.x | The default isolated layout helps application code avoid accidental undeclared dependencies. Hidden hoisting within node\_modules and configured public hoisting are deliberate exceptions. Pin the chosen release in packageManager; a newer major needs compatibility review. [pnpm 10 settings](https://pnpm.io/10.x/settings) (reviewed 2026-11-04). |
| Hosting | Vercel | — | Chosen for its integration with Next.js. Check product limits and deployment requirements for the application you are building. |

## Data

| Concern | Choice | Version / support | Rationale and caveats |
|---|---|---|---|
| Database | Postgres (Neon, via Vercel Marketplace) | — | Relational storage with branching for isolated preview data. Preview branching is an optional integration setting that must be enabled and verified. A Neon branch is copy-on-write; it is not a promise of dedicated hardware per deployment. [Neon Vercel-managed integration](https://neon.com/docs/guides/vercel-managed-integration) (reviewed 2026-11-04). |
| Schema &amp; migrations | Drizzle ORM | 0.45.x baseline | Generate SQL migrations, read and commit them, then apply them deliberately. SQL remains available when diagnosing a production change. [Drizzle migration workflows](https://orm.drizzle.team/docs/migrations) (reviewed 2026-11-04). |
| Validation | Zod | 4.x | One schema validates input and supplies its inferred TypeScript type. [Zod introduction](https://zod.dev/) (reviewed 2026-11-04). |
| Blob storage | Vercel Blob | — | Add object storage when files are part of the product; do not add it speculatively. [Vercel Blob](https://vercel.com/docs/vercel-blob) (reviewed 2026-11-04). |
| Key-value / cache | Upstash Redis | — | Use it for rate limiting, sessions or a measured cache need. Start with Postgres until evidence calls for another service. |

## Quality

| Concern | Choice | Version / support | Rationale and caveats |
|---|---|---|---|
| Unit &amp; integration tests | Vitest | 4.x | Uses Vite transforms for TypeScript tests. Configure path aliases explicitly or use a tsconfig-paths plugin when needed. Keep unit tests in the node environment and component tests in a separate jsdom project. This site chooses that split; it is not an automatic Vitest default. [Vitest v4 common errors](https://v4.vitest.dev/guide/common-errors) (reviewed 2026-11-04). |
| End-to-end tests | Playwright | 1.61+ within the reviewed major | Run browser checks against a production build; use a separate development-console sweep for React development warnings. |
| Linting | ESLint (eslint-config-next) | 9.x | Next maintains the config, and the react-hooks rules have caught real bugs here. Gate with --max-warnings 0 so warnings fail the check. |
| Formatting | Prettier | 3.x | Pair with eslint-config-prettier to prevent formatting rules from competing. |
| Component tests | Testing Library + jsdom | RTL 16.x / jsdom 30.x | Use meaningful render tests for components whose data or conditions determine what the reader sees, including accessible names. jsdom 30 requires Node ^22.22.2, ^24.15.0 or &gt;=26.0.0. A major-only Node 22 declaration is insufficient. See [06 — Testing](../docs/06-testing.md). [jsdom 30 release](https://github.com/jsdom/jsdom/releases/tag/v30.0.0) (reviewed 2026-11-04). |
| Git hooks | Lefthook | 2.x | A single binary with hooks configured in YAML. |

## Operations

| Concern | Choice | Version / support | Rationale and caveats |
|---|---|---|---|
| Error tracking | Sentry | — | Upload source maps during the build so minified stack traces can be resolved to readable source locations. [Sentry: Next.js source maps](https://blog.sentry.io/setting-up-next-js-source-maps-sentry/) (reviewed 2026-11-04). |
| Analytics | Vercel Web Analytics + Speed Insights | — | Web Analytics measures visitors, page views and usage. Speed Insights reports real-user performance. Metric availability and retention depend on the product and plan; individual Core Web Vitals access can require Speed Insights Plus. [Vercel Web Analytics](https://vercel.com/docs/analytics) (reviewed 2026-11-04). [Vercel Speed Insights](https://vercel.com/docs/speed-insights) (reviewed 2026-11-04). |
| Uptime | Better Stack | — | Choose an external check that exercises a real user path, beyond a health endpoint that can stay green while the product is broken. [Better Stack monitoring](https://betterstack.com/docs/uptime/monitoring-start/) (reviewed 2026-11-04). |
| Logs | Vercel log drain → Better Stack | — | Use a drain when retention or export requirements justify it. Vercel runtime-log retention varies by plan and observability options. Check live limits and delivery behavior before choosing a drain. No drain installation is claimed for this site. [Vercel Runtime Logs](https://vercel.com/docs/logs/runtime) (reviewed 2026-11-04). |
| CI | GitHub Actions | — | Use Actions for the merge gate and Vercel for deployments. |

## When to deviate

Defaults are choices, not rules. Deviate deliberately and record the reason in an architecture decision record.

See [03 — Architecture](../docs/03-architecture.md).

- **Long-running or CPU-heavy work**: Vercel Functions have execution limits. Choose a queue or a dedicated worker/container when the workload requires it, rather than treating a larger timeout as the whole solution.
- **The product is not a web app**: A CLI, daemon or mobile backend should not be bent into Next.js solely because it is familiar.
- **A required dependency is Python-only**: Run Python-only work, including relevant ML libraries, as a separate service with an HTTP boundary rather than contorting the Node application.
- **Biome fits the linting needs**: Biome can replace ESLint and Prettier for projects that do not depend on the ESLint plugin ecosystem. Assess the Next and react-hooks rules you would give up against the speed benefit for your project.
- **A client mandates their own infrastructure**: Keep the playbook stages and adapt the deployment and observability guidance to the required infrastructure.

## Keeping this file honest

Recheck the stack when starting a project and whenever a dependency or provider changes a relevant support contract. Version advice ages faster than the stage concepts.

Keep shared default version guidance in this reference. When a default changes, align affected operational examples in both the chapter and interactive stage.
