# 04. Project Setup

> One afternoon of setup buys you every merge gate, every preview deploy, and every
> convention you would otherwise have to retrofit under pressure.

**When this actually happens:** Once, on day one, before the first feature. This stage
absorbs most of [11 — CI/CD](11-ci-cd.md) and the first pass of
[15 — Observability](15-observability.md). Doing those later means retrofitting them
into a codebase that has already grown around their absence.

---

## Entry criteria

- [ ] You know what you are building well enough to name the repo ([01](01-product-discovery.md))
- [ ] The architectural decisions that affect project structure are made ([03](03-architecture.md))
- [ ] You have accounts for: GitHub, Vercel, and your error tracker
- [ ] You have decided whether this needs a database *now* (if unsure, it does not)

You do **not** need finished designs, a complete feature list, or a name you love.

---

## The work

### 1. Scaffold

```bash
pnpm create next-app@latest my-app \
  --typescript --app --tailwind --eslint --src-dir --use-pnpm
cd my-app
```

`--src-dir` keeps application code
in `src/` and leaves the root for configuration — worth it once the root accumulates a
dozen config files.

Pin the Node version so local, CI, and Vercel agree:

```bash
echo "22" > .nvmrc
```

Add the matching constraint to `package.json`, which makes pnpm refuse to install on the
wrong major rather than failing mysteriously later:

```json
{
  "engines": { "node": ">=22 <23" },
  "packageManager": "pnpm@<current>"
}
```

Use the actual pnpm version from [reference/stack.md](../reference/stack.md) — `corepack
use pnpm@latest` writes it for you.

### 2. Set the folder structure

Decide this now. Retrofitting structure is a large, boring, error-prone refactor that
never feels urgent enough to prioritize.

```
src/
  app/                    # routes only — thin, mostly composition
    (marketing)/
    (app)/
    api/
  features/               # the actual application, one folder per feature
    billing/
      components/
      queries.ts          # reads
      actions.ts          # writes (server actions)
      schema.ts           # Zod schemas
      billing.test.ts
  components/ui/          # generic, reusable, feature-agnostic
  lib/                    # cross-cutting: db client, auth, utils
  db/
    schema.ts
    migrations/
```

The organizing principle is **feature-first, not layer-first**. A `components/`,
`hooks/`, `utils/` split means every feature change touches four distant folders. A
feature folder means the billing code lives in the billing folder, and deleting the
feature is deleting one directory.

The rule for `src/app/`: route files stay thin. They handle routing, auth checks, and
composition. Business logic lives in `src/features/`. This keeps logic testable without
booting a framework.

### 3. Linting and formatting

`create-next-app` already wired ESLint with `eslint-config-next` — keep it. Its
react-hooks rules are the ones that catch real bugs (a setState-in-effect rule found a
cascading render in this playbook's own app). Add Prettier for formatting, with the
config that stops the two arguing:

```bash
pnpm add -D prettier eslint-config-prettier
```

`.prettierrc`:

```json
{
  "singleQuote": true,
  "semi": false
}
```

Append `eslint-config-prettier/flat` last in `eslint.config.mjs`, and add `format` /
`format:check` scripts. One tool lints, one tool formats, and neither owns the other's
job.

Gate lint at **`--max-warnings 0`**. ESLint exits 0 on warnings, so without it an unused
variable sails through both hooks and CI — this playbook's own gate let one through on
its first teeth check.

### 4. TypeScript settings

`create-next-app` produces a reasonable `tsconfig.json`. Add these:

```jsonc
{
  "compilerOptions": {
    "strict": true,                          // non-negotiable
    "noUncheckedIndexedAccess": true,        // arr[0] is T | undefined, which is the truth
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true
  }
}
```

`noUncheckedIndexedAccess` is the highest-value flag here and the most irritating for the
first week. It forces you to handle the case where an array index or record key is
missing — which is the actual runtime behavior, not a pedantic hypothetical.

### 5. Environment variables, validated at boot

Untyped `process.env` access is a runtime crash waiting for production. Validate once, at
startup:

```ts
// src/lib/env.ts
import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = schema.parse(process.env)
```

Import `env` everywhere instead of `process.env`. A missing variable now fails the build
with a clear message naming the variable, rather than surfacing as `undefined` in a
request handler three weeks later.

Commit `.env.example` with every key and no values. It is the only documentation of
required configuration that stays current, because the app stops booting when it drifts.

### 6. Git hooks

Hooks catch mistakes before they reach CI, where the feedback loop is minutes instead of
seconds.

```bash
pnpm add -D lefthook && pnpm lefthook install
```

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    format:
      glob: '*.{ts,tsx,mjs,css,json}'
      run: pnpm exec prettier --write {staged_files}
      stage_fixed: true
    lint:
      glob: '*.{ts,tsx,mjs}'
      run: pnpm exec eslint --max-warnings 0 {staged_files}

pre-push:
  commands:
    typecheck:
      run: pnpm tsc --noEmit
    test:
      run: pnpm vitest run
```

Format on commit, verify on push. Keep the full test suite out of `pre-commit` — a hook
slow enough to be annoying is a hook people bypass with `--no-verify`, and then you have
no hook.

### 7. CI, on day one

Full detail in [11 — CI/CD](11-ci-cd.md). The minimum, right now:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push: { branches: [main] }

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: '.nvmrc', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm tsc --noEmit
      - run: pnpm vitest run
      - run: pnpm build
```

Then enable branch protection on `main` requiring this check. An unenforced gate is
decoration.

### 8. Connect Vercel

```bash
pnpm add -g vercel && vercel link
```

In project settings, confirm the Node version matches `.nvmrc`. Push a branch and open a
pull request — you should get a preview URL. Verify that before writing any features; a
broken deploy pipeline is far easier to debug against a scaffold than against a
half-built app.

### 9. Error tracking

```bash
pnpm add @sentry/nextjs && pnpm dlx @sentry/wizard@latest -i nextjs
```

Confirm source map upload is working by triggering a deliberate error in a preview deploy
and checking that the Sentry stack trace shows your TypeScript, not minified bundle
output. Untested error tracking generally turns out to be broken exactly when you need it.

### 10. Write the README before the code

Three sections, ten minutes:

- **What this is** — one paragraph, understandable by future you at 2am
- **Running locally** — clone, install, env vars, dev command
- **Deploying** — how it reaches production and how to roll back

That last line matters more than it looks. See [10 — Documentation](10-documentation.md).

---

## Artifacts

- Repository with the feature-first `src/` structure
- `.prettierrc`, `eslint.config.mjs`, `tsconfig.json`, `lefthook.yml`, `.nvmrc`, `.env.example`
- `src/lib/env.ts` validating configuration at boot
- `.github/workflows/ci.yml` with branch protection enforcing it
- A Vercel project producing preview URLs per pull request
- Sentry with verified source maps
- `README.md` covering what/run/deploy

---

## Definition of done

- [ ] `pnpm install && pnpm dev` works from a fresh clone with only `.env.example` as a guide
- [ ] A pull request produces a preview URL automatically
- [ ] CI fails on a deliberately broken commit (test it — do not assume it)
- [ ] Branch protection blocks merging when CI is red
- [ ] A deliberate error appears in Sentry with readable TypeScript stack traces
- [ ] `pnpm build` succeeds locally
- [ ] Node version is identical in `.nvmrc`, CI, and Vercel settings

---

## Scaling to a team

- **Enforce review.** Branch protection gains "require 1 approval." Solo, you self-review
  via [07](07-code-review.md); with a team, that becomes someone else's job.
- **Add CODEOWNERS** once people specialize, so reviews route automatically.
- **Document the setup you did not write down.** Solo, tribal knowledge lives in your
  head and works fine. The second engineer is when "just run the wizard" stops being
  sufficient. A `CONTRIBUTING.md` earns its keep here, not before.
- **Shared secrets need a real home** — a password manager or Vercel environment
  variables, never Slack or a `.env` sent over chat.

---

## Traps

**Adding CI later.** Cited in the README because it is the most expensive mistake on this
page. The first time you run linting on an existing codebase you get four hundred errors
and either spend two days fixing them or disable half the rules. Day one, you get zero
errors and the rules stay strict.

**Not testing that CI actually fails.** Green checkmarks on a workflow that silently
skips tests are worse than no CI, because you trust them. Push a broken commit once and
watch it go red.

**Structuring by layer.** `components/`, `hooks/`, `utils/` looks tidy in week one. By
month three, one feature change touches four folders and nobody can tell which utils are
still used. Feature folders keep related code together and make deletion possible.

**Deferring env validation.** It feels like ceremony until the day a production deploy
half-works because a variable was renamed in Vercel and not in code. Validation catches
that at build time.

**Believing the Sentry wizard.** Source map upload fails quietly and often — wrong auth
token, wrong org slug, build step ordering. The only proof is a real stack trace from a
real deploy.

**Perfecting the scaffold.** There is always another config file to tune. The setup above
is enough. Ship a feature; refine tooling when it demonstrably gets in your way.
