export type ArtifactLine = {
  text: string
  /** Present only on lines that are a decision. Boilerplate carries no note. */
  note?: string
  /** The line the step's judgment turns on. At most one per artifact. */
  pivot?: boolean
}

export type Artifact = {
  id: string
  filename: string
  language: 'json' | 'jsonc' | 'yaml' | 'ts' | 'bash'
  lines: ArtifactLine[]
}

/**
 * The nine config blocks the five artifact steps render, line by line, from
 * `docs/04-project-setup.md` §3–§7.
 *
 * Nine, not every block in those sections. The doc also fences the
 * `format`/`format:check` scripts, `.prettierignore` and the `test` script,
 * and those are not carried because no panel renders them. `artifacts.test.ts`
 * pins the nine keys, so a tenth block appearing in the doc will not surface
 * here on its own — that is a curation, and this paragraph is where it is
 * recorded rather than left to read as exhaustive.
 *
 * Every `text` is copied out of the doc rather than retyped, and
 * `artifacts.test.ts` holds each block against the doc character-for-character.
 * The reader is meant to paste these, so a block that drifts is worse than a
 * diagram that drifts.
 */
export const ARTIFACTS: Record<string, Artifact> = {
  scaffoldCmd: {
    id: 'scaffoldCmd',
    filename: 'Terminal',
    language: 'bash',
    lines: [
      {
        text: 'pnpm create next-app@latest my-app \\',
        note: 'One command produces the app. Every flag after it is a decision you would otherwise make later and retrofit.',
      },
      {
        text: '  --typescript --app --tailwind --eslint --src-dir --use-pnpm',
        note: '`--src-dir` keeps application code in `src/` and leaves the root for configuration — worth it once the root accumulates a dozen config files.',
        pivot: true,
      },
      { text: 'cd my-app' },
    ],
  },
  repoCmd: {
    id: 'repoCmd',
    filename: 'Terminal',
    language: 'bash',
    lines: [
      {
        text: 'git add -A && git commit -m "chore: pin node and pnpm"',
        note: 'The scaffold already made a commit, and it predates every pin you just wrote. Skip this and the repository you create holds the scaffold and none of them.',
        pivot: true,
      },
      {
        text: 'gh repo create my-app --private --source=. --remote=origin --push',
        note: 'Private or public decides more than privacy: on GitHub Free, branch protection is only enforced on public repositories. §7 is where that bites.',
      },
    ],
  },
  prettierrc: {
    id: 'prettierrc',
    filename: '.prettierrc',
    language: 'json',
    lines: [
      { text: '{' },
      {
        text: '  "singleQuote": true,',
        note: 'The scaffold disagrees with this file the moment you write it — `create-next-app` emits double quotes and semicolons. Run `pnpm format` once over the scaffold before wiring CI, or the first pipeline run goes red on six files you never opened.',
      },
      { text: '  "semi": false' },
      { text: '}' },
    ],
  },

  lint: {
    id: 'lint',
    filename: 'package.json',
    language: 'json',
    lines: [
      { text: '{' },
      {
        text: '  "scripts": { "lint": "eslint --max-warnings 0" }',
        note: 'ESLint exits 0 on warnings, so without the flag an unused variable sails through both the hooks and CI — this playbook\'s own gate let one through on its first teeth check. `create-next-app` ships `"lint": "eslint"`, and CI calls the script rather than passing the flag itself, so the flag has to live here for CI to inherit it.',
        pivot: true,
      },
      { text: '}' },
    ],
  },

  tsconfig: {
    id: 'tsconfig',
    filename: 'tsconfig.json',
    language: 'jsonc',
    lines: [
      { text: '{' },
      { text: '  "compilerOptions": {' },
      {
        text: '    "strict": true,                          // non-negotiable',
      },
      {
        text: '    "noUncheckedIndexedAccess": true,        // arr[0] is T | undefined, which is the truth',
        note: 'The highest-value flag here and the most irritating for the first week. It forces you to handle a missing array index or record key, which is the actual runtime behaviour rather than a pedantic hypothetical.',
        pivot: true,
      },
      { text: '    "noImplicitOverride": true,' },
      { text: '    "verbatimModuleSyntax": true' },
      { text: '  }' },
      { text: '}' },
    ],
  },

  typecheck: {
    id: 'typecheck',
    filename: 'package.json',
    language: 'json',
    lines: [
      { text: '{' },
      {
        text: '  "scripts": { "typecheck": "next typegen && tsc --noEmit" }',
        note: 'Route types are generated, not written, so a bare `tsc --noEmit` passes locally off a stale build and fails on a clean checkout. Off Next.js, drop `next typegen &&`.',
      },
      { text: '}' },
    ],
  },

  env: {
    id: 'env',
    filename: 'src/lib/env.ts',
    language: 'ts',
    lines: [
      { text: '// src/lib/env.ts' },
      { text: "import { z } from 'zod'" },
      { text: '' },
      { text: 'const schema = z.object({' },
      { text: '  // Always required, whatever you are building.' },
      {
        text: '  SESSION_SECRET: z.string().min(32),',
        note: 'This schema is a gate, not a wishlist. Every key in it needs a value before anything boots, so it lists only keys you can supply today — a key for a database you have not chosen yet locks you out of your own dev server.',
        pivot: true,
      },
      { text: '  NEXT_PUBLIC_APP_URL: z.url(),' },
      {
        text: "  NODE_ENV: z.enum(['development', 'test', 'production']),",
        note: 'Validated here, but deliberately absent from `.env.example` and `.env.local`. Next sets it — `development` for `pnpm dev`, `production` for `pnpm build` — and pinning it yourself is how you end up with a dev server that believes it is in production.',
      },
      {
        text: '  // Depends on the database decision in the entry criteria. If the answer was "no",',
        note: 'The commented-out key is the whole idiom. `.optional()` works too, but it invites `env.DATABASE_URL` to be typed `string | undefined` in code that will one day require it.',
      },
      {
        text: '  // leave this commented out and uncomment it in the same commit that adds the client.',
      },
      { text: '  // DATABASE_URL: z.url(),' },
      { text: '})' },
      { text: '' },
      {
        text: 'export const env = schema.parse(process.env)',
        note: "Import `env` everywhere instead of `process.env` — in server modules only, never in a `'use client'` file. `schema.parse(process.env)` is not a static read, so the browser gets an empty object and every key fails at once, on hydration, after a green build.",
      },
    ],
  },

  envExample: {
    id: 'envExample',
    filename: '.env.example',
    language: 'bash',
    lines: [
      { text: '# .env.example — copy to .env.local and fill in the blanks' },
      { text: 'NEXT_PUBLIC_APP_URL=http://localhost:3000' },
      {
        text: 'SESSION_SECRET=              # openssl rand -base64 32',
        note: 'Committed, and holding no secrets: the blank is filled in `.env.local`, which `.gitignore` already excludes. This file is the only documentation of required configuration that does not rot, because the app stops booting when it drifts.',
      },
    ],
  },

  lefthook: {
    id: 'lefthook',
    filename: 'lefthook.yml',
    language: 'yaml',
    lines: [
      { text: '# lefthook.yml' },
      { text: 'pre-commit:' },
      { text: '  parallel: true' },
      { text: '  commands:' },
      { text: '    format:' },
      {
        text: "      glob: '*.{ts,tsx,js,jsx,mjs,cjs,css,json,md,yml,yaml}'",
        note: "Wider than it first looks like it needs to be, and matching what CI's `prettier --check .` covers on purpose. The shorter list is the one most people write, and it produces a hook that reports success on a commit CI then rejects: a file outside the glob is neither checked nor fixed, and lefthook prints `format (skip) no files for inspection` and exits green. `README.md` is the likeliest to slip through, and it is this stage's own required artifact.",
        pivot: true,
      },
      { text: '      run: pnpm exec prettier --write {staged_files}' },
      { text: '      stage_fixed: true' },
      { text: '    lint:' },
      {
        text: "      glob: '*.{ts,tsx,js,jsx,mjs,cjs}'",
        note: 'The lint glob stays narrower, since ESLint has nothing to say about Markdown or YAML.',
      },
      { text: '      run: pnpm exec eslint --max-warnings 0 {staged_files}' },
      { text: '' },
      {
        text: 'pre-push:',
        note: 'Format on commit, verify on push. Keep the full test suite out of `pre-commit` — a hook slow enough to be annoying is a hook people bypass with `--no-verify`, and then you have no hook.',
      },
      { text: '  commands:' },
      { text: '    typecheck:' },
      { text: '      run: pnpm typecheck' },
      { text: '    test:' },
      { text: '      run: pnpm test' },
    ],
  },

  prepare: {
    id: 'prepare',
    filename: 'package.json',
    language: 'json',
    lines: [
      { text: '{' },
      {
        text: '  "scripts": { "prepare": "lefthook install || true" }',
        note: 'Hooks installed by hand exist only on the machine that ran the command, so a fresh clone needs this. The `|| true` is not defensive clutter: pnpm runs `prepare` on every install, `lefthook install` exits 1 outside a git repository, and build hosts check out your source without a `.git`. Unguarded, the deploy dies at the install step. Husky fails identically, so it is a property of `prepare`.',
        pivot: true,
      },
      { text: '}' },
    ],
  },

  ci: {
    id: 'ci',
    filename: '.github/workflows/ci.yml',
    language: 'yaml',
    lines: [
      { text: '# .github/workflows/ci.yml' },
      {
        text: 'name: CI',
        note: 'This names the *workflow*, not the check. It is the name most people reach for when they turn on branch protection, and it is the wrong one.',
      },
      { text: 'on:' },
      { text: '  pull_request:' },
      { text: '  push: { branches: [main] }' },
      { text: '' },
      { text: 'jobs:' },
      {
        text: '  verify:',
        note: "The job id, and the name to require in branch protection: GitHub reports a check under the job's own `name:` when it has one and under the job id otherwise. Note that on GitHub Free, branch protection is only enforced on public repos — on a private one it saves and silently never fires.",
      },
      { text: '    runs-on: ubuntu-latest' },
      { text: '    steps:' },
      { text: '      - uses: actions/checkout@v7' },
      { text: '      - uses: pnpm/action-setup@v6' },
      { text: '      - uses: actions/setup-node@v7' },
      { text: "        with: { node-version-file: '.nvmrc', cache: 'pnpm' }" },
      { text: '      - run: pnpm install --frozen-lockfile' },
      {
        text: '      - run: pnpm format:check',
        note: 'The run steps go cheapest first — formatting, then lint, then types, then tests, then the build. A missing semicolon comes back in seconds instead of after a full compile.',
      },
      { text: '      - run: pnpm lint' },
      { text: '      - run: pnpm typecheck' },
      { text: '      - run: pnpm test' },
      {
        text: '      - run: pnpm build',
        note: "This step runs your own modules, so §5's schema parses inside the build. The moment anything imports `env`, the workflow needs a value for every required key — add `SESSION_SECRET` and `NEXT_PUBLIC_APP_URL` as repository secrets and pass them to this step's `env:`. Until that first import the workflow is green whether or not you did, so the gate breaks on a commit that has nothing to do with it.",
        pivot: true,
      },
    ],
  },
}
