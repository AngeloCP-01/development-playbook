import { type Artifact, type ArtifactLine } from '@/components/artifact'

export type { Artifact, ArtifactLine }

/**
 * The nineteen config blocks stage 04's panels render, line by line, from
 * `docs/04-project-setup.md` §1 and §3–§9.
 *
 * Every `text` is copied out of the doc rather than retyped, and
 * `artifacts.test.ts` asserts each block **equals** one of the doc's fenced
 * blocks rather than being contained by one (D-66) — a substring of a block is
 * still contained, so containment cannot see an artifact that has lost its last
 * line. The reader is meant to paste these, so a block that drifts is worse
 * than a diagram that drifts.
 *
 * **This paragraph said nine until the whole-branch review, and it said the
 * wrong thing in the most expensive direction.** It named the
 * `format`/`format:check` scripts, `.prettierignore` and the `test` script as
 * deliberately not carried "because no panel renders them" — and by then a
 * coverage review had found the opposite, that the app was telling readers to
 * run scripts it never showed them how to write, and all three had been added.
 * A reader following the stale text would have deleted three of that fix as an
 * uncurated mistake. The commit that made this header false is the same commit
 * that wrote "nineteen now" into its own message.
 *
 * `artifacts.test.ts` pins the full key list, so a twentieth block appearing in
 * the doc does not surface here on its own. That is still a curation; this is
 * still where it is recorded.
 */
export const ARTIFACTS: Record<string, Artifact> = {
  nvmrc: {
    id: 'nvmrc',
    filename: '.nvmrc',
    language: 'bash',
    lines: [
      {
        text: 'echo "22" > .nvmrc',
        note: 'What `nvm` and `fnm` read locally, and what GitHub Actions reads through `node-version-file`. It stops there — your host does not read it.',
        pivot: true,
      },
    ],
  },
  enginesJson: {
    id: 'enginesJson',
    filename: 'package.json',
    language: 'json',
    lines: [
      { text: '{' },
      {
        text: '  "engines": { "node": "22.x" },',
        note: 'A major, not a range. `22.x` is the form Vercel\u2019s own docs show and the form this project uses; a range is not documented as supported, and this field is the one thing the host actually reads, so it is not the place to improvise a format.',
        pivot: true,
      },
      {
        text: '  "packageManager": "pnpm@<current>"',
        note: '`corepack use pnpm@latest` resolves the current release and writes it here with a hash, which is the pin you want. `reference/stack.md` names a floor, not a pin — if `latest` hands you a newer major than that file lists, you are where you should be. Do not pin backwards to match it.',
      },
      { text: '}' },
    ],
  },
  npmrc: {
    id: 'npmrc',
    filename: '.npmrc',
    language: 'bash',
    lines: [
      {
        text: 'echo "engine-strict=true" >> .npmrc',
        note: 'Without this line pnpm prints `WARN Unsupported engine` and installs anyway, exit 0 — a warning in CI log noise is not a gate. With it, the install fails on the wrong major, which is what you wanted when you wrote the constraint.',
        pivot: true,
      },
    ],
  },
  formatScripts: {
    id: 'formatScripts',
    filename: 'package.json',
    language: 'json',
    lines: [
      { text: '{' },
      { text: '  "scripts": {' },
      { text: '    "format": "prettier --write .",' },
      {
        text: '    "format:check": "prettier --check ."',
        note: 'CI calls this one by name, so it has to exist, and it has to check the same files the one you run yourself writes. That `.` is the whole repository, which is why `.prettierignore` matters.',
        pivot: true,
      },
      { text: '  }' },
      { text: '}' },
    ],
  },
  prettierignore: {
    id: 'prettierignore',
    filename: '.prettierignore',
    language: 'bash',
    lines: [
      {
        text: 'pnpm-lock.yaml',
        note: 'Shorter than you expect, because Prettier reads `.gitignore` too — `.next/` and `node_modules/` are already excluded. What is left is the case `.gitignore` cannot cover: a file that is generated *and* committed. The lockfile is the one every project has, and reformatting it changes a file you do not own.',
        pivot: true,
      },
    ],
  },
  testScript: {
    id: 'testScript',
    filename: 'package.json',
    language: 'json',
    lines: [
      { text: '{' },
      {
        text: '  "scripts": { "test": "vitest run --passWithNoTests" }',
        note: 'The gate you are about to wire has to have something real to call; a pipeline step naming a command nobody installed fails on its first run, and the failure looks like a broken pipeline rather than a missing dependency.',
        pivot: true,
      },
      { text: '}' },
    ],
  },
  catFile: {
    id: 'catFile',
    filename: 'Terminal',
    language: 'bash',
    lines: [
      {
        text: 'git cat-file -t <sha>      # a commit you can see  \u2192 "commit"',
        note: 'Take the SHA off the deployment and ask your own repository about it. A deployment list tells you a build succeeded; it does not tell you which repository it succeeded on.',
        pivot: true,
      },
      {
        text: '                           # anything else         \u2192 "Not a valid object name", which is',
      },
      {
        text: '                           #                         the answer 79ef7a7 gave in the',
      },
      {
        text: '                           #                         incident deploying-101.md records',
      },
    ],
  },
  boomRoute: {
    id: 'boomRoute',
    filename: 'src/app/api/debug/boom/route.ts',
    language: 'ts',
    lines: [
      {
        text: '// src/app/api/debug/boom/route.ts \u2014 temporary, delete after',
      },
      {
        text: 'export function GET() {',
        note: 'Push it on a branch, open it on the preview URL, then read the issue in Sentry. The frame should name `route.ts` and the line you wrote; a hashed chunk under `.next/` means the upload did not happen.',
        pivot: true,
      },
      { text: "  throw new Error('Sentry smoke test')" },
      { text: '}' },
    ],
  },
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
