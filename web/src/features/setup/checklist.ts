/**
 * Source: `docs/04-project-setup.md`, "## Definition of done" and
 * "## Scaling to a team".
 *
 * `checklist.test.ts` counts both lists out of the doc. The done items are the
 * doc's checkboxes verbatim, because the worksheet is a checklist a reader
 * works through against their own repository, and a paraphrase there is a
 * different bar than the one the stage set.
 *
 * Ids are slugs rather than positions: `SetupChecklist` persists progress
 * against them, so reordering the list must not reset a reader's ticks.
 */

export type DoneItem = { id: string; label: string }
export type TeamMove = { id: string; title: string; body: string }

export const DONE: DoneItem[] = [
  {
    id: 'fresh-clone',
    label:
      'A fresh clone reaches a running app with `.env.example` as the only guide: `pnpm install`, `cp .env.example .env.local`, fill in the blanks it names, `pnpm dev`',
  },
  {
    id: 'preview-url',
    label:
      'A pull request produces a preview URL automatically — which also proves §6’s guarded `prepare`, because the build host *is* the `.git`-less environment, and an unguarded `lefthook install` would have failed the install step before any build began',
  },
  {
    id: 'ci-fails',
    label:
      'CI fails on a deliberately broken commit (test it — do not assume it)',
  },
  {
    id: 'branch-protection',
    label: 'Branch protection blocks merging when CI is red',
  },
  {
    id: 'sentry-trace',
    label:
      'A deliberate error appears in Sentry with readable TypeScript stack traces',
  },
  { id: 'build-local', label: '`pnpm build` succeeds locally' },
  {
    id: 'node-pinned',
    label:
      'Node version is pinned in the file each environment reads — `.nvmrc` for local shells and CI, `engines.node` for the host',
  },
  {
    id: 'deployed-sha',
    label:
      'The deployed commit SHA exists in your repository (`git cat-file -t <sha>`)',
  },
]

export const TEAM_MOVES: TeamMove[] = [
  {
    id: 'review',
    title: 'Enforce review.',
    body: 'Branch protection gains "require 1 approval". Solo, you self-review via stage 07; with a team, that becomes someone else’s job.',
  },
  {
    id: 'codeowners',
    title: 'Add CODEOWNERS',
    body: 'Once people specialize, so reviews route automatically instead of landing on whoever is watching the repository that week.',
  },
  {
    id: 'contributing',
    title: 'Document the setup you did not write down.',
    body: 'Solo, tribal knowledge lives in your head and works fine. The second engineer is when "just run the wizard" stops being sufficient. A `CONTRIBUTING.md` earns its keep here, not before.',
  },
  {
    id: 'secrets',
    title: 'Shared secrets need a real home',
    body: 'A password manager or Vercel environment variables, never Slack and never a `.env` sent over chat.',
  },
]

export type ArtifactItem = { id: string; text: string }

/**
 * §Artifacts — what this stage leaves behind, as an inventory.
 *
 * Kept as one flat list rather than folded into `DONE`, because the two answer
 * different questions: this one is *what exists*, and the definition of done is
 * *what you can check*. The doc keeps them apart for the same reason.
 *
 * Ported after a review found it dropped with no note. The argument for
 * dropping it was that the panels already render nineteen of these files with
 * annotations, so a flat list restates them — true of the files, and not true
 * of the last four entries, which are not files at all.
 */
export const ARTIFACT_ITEMS: ArtifactItem[] = [
  { id: 'repo', text: 'Repository with the feature-first `src/` structure' },
  {
    id: 'configs',
    text: '`.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `tsconfig.json`, `lefthook.yml`, `.nvmrc`, `.npmrc`, `.env.example`',
  },
  {
    id: 'package-json',
    text: '`package.json` pinning `engines.node` and `packageManager`, a guarded `prepare` script, and the `typecheck`, `test`, `lint`, `format`, and `format:check` scripts',
  },
  {
    id: 'env-module',
    text: '`src/lib/env.ts` validating configuration at boot',
  },
  {
    id: 'workflow',
    text: '`.github/workflows/ci.yml` with branch protection enforcing it',
  },
  {
    id: 'vercel',
    text: 'A Vercel project producing preview URLs per pull request',
  },
  { id: 'sentry', text: 'Sentry with verified source maps' },
  { id: 'readme', text: '`README.md` covering what/run/deploy' },
]
