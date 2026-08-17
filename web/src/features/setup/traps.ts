/**
 * Source: `docs/04-project-setup.md`, "## Traps".
 *
 * Titles carry the doc's trailing full stop because the doc bolds the whole
 * sentence, and `traps.test.ts` compares against exactly that. The test also
 * pins why it slices the section with an anchored `^## Traps$` rather than
 * `indexOf`: §7 names the section in running prose, so `indexOf` starts the
 * slice two hundred lines early and counts nine.
 */

export type Trap = { id: string; title: string; body: string }

export const TRAPS: Trap[] = [
  {
    id: 'ci-later',
    title: 'Adding CI later.',
    body: 'The most expensive mistake on the page. The first time you run linting on an existing codebase you get four hundred errors, and you either spend two days fixing them or disable half the rules. Day one, you get zero errors and the rules stay strict.',
  },
  {
    id: 'untested-gate',
    title: 'Not testing that CI actually fails.',
    body: 'Green checkmarks on a workflow that silently skips tests are worse than no CI, because you trust them. Push a broken commit once and watch it go red.',
  },
  {
    id: 'wrong-pin',
    title: 'Pinning the version your host does not read.',
    body: '`.nvmrc` reaches your machine and your CI and stops. If the environment that actually serves users is not pinned by a file that environment reads, it is not pinned — and the failure is silent, because it builds.',
  },
  {
    id: 'layer-first',
    title: 'Structuring by layer.',
    body: '`components/`, `hooks/`, `utils/` looks tidy in week one. By month three, one feature change touches four folders and nobody can tell which utils are still used. Feature folders keep related code together and make deletion possible.',
  },
  {
    id: 'deferred-env',
    title: 'Deferring env validation.',
    body: 'It feels like ceremony until the day a production deploy half-works because a variable was renamed in Vercel and not in code. Validation catches that at build time.',
  },
  {
    id: 'sentry-wizard',
    title: 'Believing the Sentry wizard.',
    body: 'Source map upload fails quietly and often — wrong auth token, wrong org slug, build step ordering. The only proof is a real stack trace from a real deploy.',
  },
  {
    id: 'perfect-scaffold',
    title: 'Perfecting the scaffold.',
    body: 'There is always another config file to tune. The setup above is enough. Ship a feature; refine tooling when it demonstrably gets in your way.',
  },
]
