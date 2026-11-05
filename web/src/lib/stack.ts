/** Canonical starter-stack content. Generate reference/stack.md with pnpm gen:stack. */
export type StackSource = { label: string; href: string; reviewed?: string }
export type StackChoice = {
  id: string
  concern: string
  tool: string
  version?: string
  rationale: string
  note?: string
  see?: string
  sources?: readonly StackSource[]
}
export type StackGroup = {
  id: string
  title: string
  choices: readonly StackChoice[]
}
export type StackDocument = {
  title: string
  introduction: readonly string[]
  versionPolicy: readonly string[]
  reviewNote: string
  groups: readonly StackGroup[]
  deviationIntro: string
  deviationStage?: string
  deviations: readonly { id: string; title: string; detail: string }[]
  upkeep: readonly string[]
}

export const STACK = {
  title: 'The Default Stack',
  introduction: [
    'Tool choices for a new project, with the reason for each choice and the conditions that call for another one. Stage documents link here for shared defaults.',
    'These are starter defaults, not an inventory of this static site. At the 2026-11-04 review, this site used Next.js 16.2.10, React 19.2.4 and TypeScript 5.9.3; no database, Redis, Sentry or analytics installation is established by this reference.',
  ],
  versionPolicy: [
    'Version families below are reviewed starting points, not a promise that every later major is compatible. Choose a supported combination, pin the selected toolchain and read migration guidance before changing majors.',
    'Check the package registry for release availability, then verify framework, lint, test and host compatibility. A registry version lookup alone does not validate a stack.',
  ],
  reviewNote:
    'Source review: 2026-11-04, limited to the claims and links identified below. This is not a full dependency or provider audit. Review undated selections before adopting them.',
  groups: [
    {
      id: 'core',
      title: 'Core',
      choices: [
        {
          id: 'framework',
          concern: 'Framework',
          tool: 'Next.js (App Router)',
          rationale: 'Server Components reduce client/server data plumbing.',
          version: '16.x',
          note: 'Next 16 documents Node 20.9.0 and TypeScript 5.1.0 minima. Those minima do not establish support for every dependency in a project.',
          sources: [
            {
              label: 'Next.js 16 upgrade guide',
              href: 'https://nextjs.org/docs/app/guides/upgrading/version-16',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'ui-library',
          concern: 'UI library',
          tool: 'React',
          rationale:
            'Use the React and React DOM versions supported by the selected Next release, and keep the two aligned.',
          version: '19.2.x',
          note: 'The Next App Router also integrates React Canary features; do not treat all React 19 releases as interchangeable.',
        },
        {
          id: 'language',
          concern: 'Language',
          tool: 'TypeScript',
          rationale:
            'The Go-based native compiler is released as TypeScript 7.0.',
          version: '7.x',
          note: 'The 7.0 release does not include a programmatic API and documents using TypeScript 6 alongside it for API consumers such as typescript-eslint. Check the exact release and toolchain before adopting it. This site still uses TypeScript 5; no local TypeScript 7 benchmark or build is claimed.',
          sources: [
            {
              label: 'Microsoft: TypeScript 7.0',
              href: 'https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'runtime',
          concern: 'Runtime',
          tool: 'Node.js',
          rationale:
            'Select a supported patch in the file each environment reads: .nvmrc for local shells and CI, engines.node in package.json for Vercel.',
          version: '22 Maintenance LTS; at least 22.22.2 with jsdom 30',
          note: 'Node 22 reaches end of life on 2027-04-30. Vercel selects a major and manages its patches; check the actual build/runtime rather than assuming a local patch pin controls the host.',
          sources: [
            {
              label: 'Node.js release schedule',
              href: 'https://github.com/nodejs/Release',
              reviewed: '2026-11-04',
            },
            {
              label: 'Vercel Node.js versions',
              href: 'https://vercel.com/docs/functions/runtimes/node-js/node-js-versions',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'package-manager',
          concern: 'Package manager',
          tool: 'pnpm',
          rationale:
            'The default isolated layout helps application code avoid accidental undeclared dependencies.',
          version: '10.x',
          note: 'Hidden hoisting within node_modules and configured public hoisting are deliberate exceptions. Pin the chosen release in packageManager; a newer major needs compatibility review.',
          sources: [
            {
              label: 'pnpm 10 settings',
              href: 'https://pnpm.io/10.x/settings',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'hosting',
          concern: 'Hosting',
          tool: 'Vercel',
          rationale:
            'Chosen for its integration with Next.js. Check product limits and deployment requirements for the application you are building.',
        },
      ],
    },
    {
      id: 'data',
      title: 'Data',
      choices: [
        {
          id: 'database',
          concern: 'Database',
          tool: 'Postgres (Neon, via Vercel Marketplace)',
          rationale:
            'Relational storage with branching for isolated preview data.',
          note: 'Preview branching is an optional integration setting that must be enabled and verified. A Neon branch is copy-on-write; it is not a promise of dedicated hardware per deployment.',
          sources: [
            {
              label: 'Neon Vercel-managed integration',
              href: 'https://neon.com/docs/guides/vercel-managed-integration',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'migrations',
          concern: 'Schema & migrations',
          tool: 'Drizzle ORM',
          rationale:
            'Generate SQL migrations, read and commit them, then apply them deliberately. SQL remains available when diagnosing a production change.',
          version: '0.45.x baseline',
          sources: [
            {
              label: 'Drizzle migration workflows',
              href: 'https://orm.drizzle.team/docs/migrations',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'validation',
          concern: 'Validation',
          tool: 'Zod',
          rationale:
            'One schema validates input and supplies its inferred TypeScript type.',
          version: '4.x',
          sources: [
            {
              label: 'Zod introduction',
              href: 'https://zod.dev/',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'blob-storage',
          concern: 'Blob storage',
          tool: 'Vercel Blob',
          rationale:
            'Add object storage when files are part of the product; do not add it speculatively.',
          sources: [
            {
              label: 'Vercel Blob',
              href: 'https://vercel.com/docs/vercel-blob',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'key-value',
          concern: 'Key-value / cache',
          tool: 'Upstash Redis',
          rationale:
            'Use it for rate limiting, sessions or a measured cache need. Start with Postgres until evidence calls for another service.',
        },
      ],
    },
    {
      id: 'quality',
      title: 'Quality',
      choices: [
        {
          id: 'unit-tests',
          concern: 'Unit & integration tests',
          tool: 'Vitest',
          rationale:
            'Uses Vite transforms for TypeScript tests. Configure path aliases explicitly or use a tsconfig-paths plugin when needed.',
          version: '4.x',
          note: 'Keep unit tests in the node environment and component tests in a separate jsdom project. This site chooses that split; it is not an automatic Vitest default.',
          sources: [
            {
              label: 'Vitest v4 common errors',
              href: 'https://v4.vitest.dev/guide/common-errors',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'end-to-end',
          concern: 'End-to-end tests',
          tool: 'Playwright',
          rationale:
            'Run browser checks against a production build; use a separate development-console sweep for React development warnings.',
          version: '1.61+ within the reviewed major',
        },
        {
          id: 'linting',
          concern: 'Linting',
          tool: 'ESLint (eslint-config-next)',
          rationale:
            'Next maintains the config, and the react-hooks rules have caught real bugs here. Gate with --max-warnings 0 so warnings fail the check.',
          version: '9.x',
        },
        {
          id: 'formatting',
          concern: 'Formatting',
          tool: 'Prettier',
          rationale:
            'Pair with eslint-config-prettier to prevent formatting rules from competing.',
          version: '3.x',
        },
        {
          id: 'component-tests',
          see: '06-testing',
          concern: 'Component tests',
          tool: 'Testing Library + jsdom',
          rationale:
            'Use meaningful render tests for components whose data or conditions determine what the reader sees, including accessible names.',
          version: 'RTL 16.x / jsdom 30.x',
          note: 'jsdom 30 requires Node ^22.22.2, ^24.15.0 or >=26.0.0. A major-only Node 22 declaration is insufficient.',
          sources: [
            {
              label: 'jsdom 30 release',
              href: 'https://github.com/jsdom/jsdom/releases/tag/v30.0.0',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'git-hooks',
          concern: 'Git hooks',
          tool: 'Lefthook',
          rationale: 'A single binary with hooks configured in YAML.',
          version: '2.x',
        },
      ],
    },
    {
      id: 'operations',
      title: 'Operations',
      choices: [
        {
          id: 'error-tracking',
          concern: 'Error tracking',
          tool: 'Sentry',
          rationale:
            'Upload source maps during the build so minified stack traces can be resolved to readable source locations.',
          sources: [
            {
              label: 'Sentry: Next.js source maps',
              href: 'https://blog.sentry.io/setting-up-next-js-source-maps-sentry/',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'analytics',
          concern: 'Analytics',
          tool: 'Vercel Web Analytics + Speed Insights',
          rationale:
            'Web Analytics measures visitors, page views and usage. Speed Insights reports real-user performance.',
          note: 'Metric availability and retention depend on the product and plan; individual Core Web Vitals access can require Speed Insights Plus.',
          sources: [
            {
              label: 'Vercel Web Analytics',
              href: 'https://vercel.com/docs/analytics',
              reviewed: '2026-11-04',
            },
            {
              label: 'Vercel Speed Insights',
              href: 'https://vercel.com/docs/speed-insights',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'uptime',
          concern: 'Uptime',
          tool: 'Better Stack',
          rationale:
            'Choose an external check that exercises a real user path, beyond a health endpoint that can stay green while the product is broken.',
          sources: [
            {
              label: 'Better Stack monitoring',
              href: 'https://betterstack.com/docs/uptime/monitoring-start/',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'logs',
          concern: 'Logs',
          tool: 'Vercel log drain → Better Stack',
          rationale:
            'Use a drain when retention or export requirements justify it.',
          note: 'Vercel runtime-log retention varies by plan and observability options. Check live limits and delivery behavior before choosing a drain. No drain installation is claimed for this site.',
          sources: [
            {
              label: 'Vercel Runtime Logs',
              href: 'https://vercel.com/docs/logs/runtime',
              reviewed: '2026-11-04',
            },
          ],
        },
        {
          id: 'ci',
          concern: 'CI',
          tool: 'GitHub Actions',
          rationale:
            'Use Actions for the merge gate and Vercel for deployments.',
        },
      ],
    },
  ],
  deviations: [
    {
      id: 'long-running',
      title: 'Long-running or CPU-heavy work',
      detail:
        'Vercel Functions have execution limits. Choose a queue or a dedicated worker/container when the workload requires it, rather than treating a larger timeout as the whole solution.',
    },
    {
      id: 'not-web',
      title: 'The product is not a web app',
      detail:
        'A CLI, daemon or mobile backend should not be bent into Next.js solely because it is familiar.',
    },
    {
      id: 'python-only',
      title: 'A required dependency is Python-only',
      detail:
        'Run Python-only work, including relevant ML libraries, as a separate service with an HTTP boundary rather than contorting the Node application.',
    },
    {
      id: 'biome',
      title: 'Biome fits the linting needs',
      detail:
        'Biome can replace ESLint and Prettier for projects that do not depend on the ESLint plugin ecosystem. Assess the Next and react-hooks rules you would give up against the speed benefit for your project.',
    },
    {
      id: 'client-infrastructure',
      title: 'A client mandates their own infrastructure',
      detail:
        'Keep the playbook stages and adapt the deployment and observability guidance to the required infrastructure.',
    },
  ],
  deviationIntro:
    'Defaults are choices, not rules. Deviate deliberately and record the reason in an architecture decision record.',
  deviationStage: '03-architecture',
  upkeep: [
    'Recheck the stack when starting a project and whenever a dependency or provider changes a relevant support contract. Version advice ages faster than the stage concepts.',
    'Keep shared default version guidance in this reference. When a default changes, align affected operational examples in both the chapter and interactive stage.',
  ],
} satisfies StackDocument
