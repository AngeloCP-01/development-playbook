export type Trap = { id: string; title: string; body: string }

export const TRAPS: Trap[] = [
  {
    id: 'building-deploys',
    title: 'Building deploys in Actions.',
    body: "You will spend a weekend reimplementing what Vercel's Git integration gives you, and the result will be slower and have no preview URLs. Let each system do its job.",
  },
  {
    id: 'slow-pipeline',
    title: 'A pipeline slow enough to route around.',
    body: 'Past ten minutes, people stop waiting for green before merging, and the gate becomes advisory. Speed is a correctness feature.',
  },
  {
    id: 'flaky-tests',
    title: 'Tolerating flaky tests.',
    body: 'One test that fails 5% of the time trains you to re-run red builds without reading them. That habit is what lets a real failure through. Fix it or delete it — a test you do not trust has negative value.',
  },
  {
    id: 'generated-types',
    title: 'Typechecking generated types on a clean checkout.',
    body: "Frameworks generate types into build directories — Next.js writes PageProps and route types into .next/types/. On your machine those files linger from the last build, so tsc --noEmit passes. CI checks out clean, and if typecheck runs before build, it fails on types that do not exist yet. Run the generator first (next typegen) and put it inside the script both CI and your hooks call, so the two cannot drift. This playbook's own CI caught exactly this on its first real run.",
  },
  {
    id: 'dev-server-testing',
    title: 'Testing against the dev server.',
    body: 'The dev server has different bundling, different caching, and no edge network. Passing there and failing in production is a common and avoidable surprise.',
  },
  {
    id: 'npm-install',
    title: '`npm install` instead of `--frozen-lockfile`.',
    body: 'CI silently resolves different versions than you tested against, and you get a green build for code that will not run.',
  },
  {
    id: 'lint-ignores-warnings',
    title: 'A lint step that ignores warnings.',
    body: "ESLint exits 0 when there are only warnings, and most of eslint-config-next's rules are warnings — so a bare eslint step waves through unused variables, missing deps arrays, all of it. Gate at --max-warnings 0. This playbook's own gate let an unused variable through twice before the teeth check exposed it; the fix had to land in the hook and the script, because the hook called eslint directly.",
  },
  {
    id: 'unenforced-branch-protection',
    title: 'Unenforced branch protection.',
    body: 'Every pipeline problem eventually traces back to a gate that was never actually required.',
  },
  {
    id: 'ungrouped-dependabot',
    title: 'Ungrouped Dependabot.',
    body: 'Fifteen PRs a week becomes zero PRs read, which is worse than no automation because you believe you are covered.',
  },
]
