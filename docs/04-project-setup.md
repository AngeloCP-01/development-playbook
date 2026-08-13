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

Pin the Node version in both places, because no single file reaches every environment:

```bash
echo "22" > .nvmrc
```

`.nvmrc` is what `nvm` and `fnm` read locally, and what GitHub Actions reads through
`node-version-file`. It stops there. Your host does not read it.

Add the constraint to `package.json` as well:

```json
{
  "engines": { "node": "22.x" },
  "packageManager": "pnpm@<current>"
}
```

Write it as a major, `"22.x"`, not a range. `22.x` is the form Vercel's own docs show and
the form this project's own `web/package.json` uses; a range is not documented as
supported, and this field is the one thing the host actually reads, so it is not the place
to improvise a format.

`engines.node` does two jobs. It is what Vercel reads, overriding the Node version set in
the project's own dashboard — the job that matters in production. And it makes pnpm
complain on the wrong major, though only if you ask it to:

```bash
echo "engine-strict=true" >> .npmrc
```

Without that line pnpm prints `WARN Unsupported engine` and installs anyway, exit 0 — a
warning in CI log noise is not a gate. With it, the install fails on the wrong major,
which is what you wanted when you wrote the constraint.

The general rule is worth more than either file: **for each environment that runs your
code, find the file that environment reads.** A version file being popular does not make
it universal, and the environment nothing pins is usually the one serving users.

Use the actual pnpm version from [reference/stack.md](../reference/stack.md) — `corepack
use pnpm@latest` writes it for you.

**Then give it a remote.** `create-next-app` has already run `git init` and made the first
commit, on `main` — that branch name comes from the scaffold, not from your git config,
which still defaults to `master`. What it cannot do is create the repository on GitHub, and
everything downstream assumes one exists: §7 enables branch protection on `main`, §8
opens a pull request to get a preview URL.

```bash
gh repo create my-app --private --source=. --remote=origin --push
```

Private or public is your call, and it decides more than privacy. See §7 for what branch
protection can and cannot enforce on a private repo under GitHub Free.

Without the `gh` CLI, create an **empty** repository in GitHub's web UI — no README, no
`.gitignore`, no license, since anything it adds is a commit you now have to merge — then:

```bash
git remote add origin git@github.com:<you>/my-app.git
git push -u origin main
```

Either way, `git log --oneline` on GitHub and locally should now show the same first commit.
That is the thing §8 later asks you to check about a *deployment*, and it is worth being in
the habit before a dashboard is involved.

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
  lib/                    # cross-cutting: auth, utils, env, the db client if there is one
  db/                     # only if the entry criteria's database answer was yes
    schema.ts
    migrations/
```

`src/db/` is the one folder in that tree that is conditional. The entry criteria said that
if you were unsure, you do not need a database yet. If that was your answer, do not create
it. An empty `db/` holding a `schema.ts` that describes nothing is the structural version
of §5's required `DATABASE_URL`: a placeholder that looks like a decision and is not one.
It arrives in the commit that adds the client, alongside uncommenting `DATABASE_URL` in
the schema.

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

Append `eslint-config-prettier/flat` last in `eslint.config.mjs`. One tool lints, one tool
formats, and neither owns the other's job. Then add the two scripts. CI calls
`format:check` by name in §7, so it has to exist, and it has to check the same files that
the one you run yourself writes:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

That `.` is the whole repository, which is why the next file matters.

`.prettierignore`:

```
pnpm-lock.yaml
```

Shorter than you expect, because Prettier reads `.gitignore` as well as `.prettierignore`.
`.next/` and `node_modules/` are already excluded by the `.gitignore` `create-next-app`
wrote. What is left is the case `.gitignore` cannot cover: a file that is generated *and*
committed. The lockfile is the one every project has. Reformatting it changes a file you
do not own and is never what you meant.

Now run it once over the scaffold, before wiring CI in §7:

```bash
pnpm format
```

`create-next-app` writes double quotes and semicolons; the `.prettierrc` above has just
said otherwise. Skip this and your first CI run goes red on six files you never opened,
which teaches exactly the wrong lesson about the gate on its first day.

Gate lint at **`--max-warnings 0`**, in the script itself rather than only where it gets
called:

```json
{
  "scripts": { "lint": "eslint --max-warnings 0" }
}
```

ESLint exits 0 on warnings, so without it an unused variable sails through both hooks and
CI — this playbook's own gate let one through on its first teeth check. `create-next-app`
ships `"lint": "eslint"` with no such flag, and CI's `pnpm lint` step calls that script
directly rather than passing the flag itself, so the flag has to live in the script for
CI to inherit it.

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

Add the script CI and your hooks will call:

```json
{
  "scripts": { "typecheck": "next typegen && tsc --noEmit" }
}
```

Route types are generated, not written, so a bare `tsc --noEmit` passes locally off a
stale build and fails on a clean checkout — every reader of this page is on Next.js, since
§1 scaffolds with `create-next-app`. Off Next.js, drop `next typegen &&` and use bare
`tsc --noEmit`.

### 5. Environment variables, validated at boot

Untyped `process.env` access is a runtime crash waiting for production. Validate once, at
startup:

```bash
pnpm add zod
```

```ts
// src/lib/env.ts
import { z } from 'zod'

const schema = z.object({
  // Always required, whatever you are building.
  SESSION_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  // Depends on the database decision in the entry criteria. If the answer was "no",
  // leave this commented out and uncomment it in the same commit that adds the client.
  // DATABASE_URL: z.url(),
})

export const env = schema.parse(process.env)
```

Import `env` everywhere instead of `process.env`. A missing variable now fails at boot
with a clear message naming the variable, rather than surfacing as `undefined` in a
request handler three weeks later.

**Everywhere means every server module, not a `'use client'` file.** The browser has no
`process.env`. Next substitutes static `process.env.NEXT_PUBLIC_*` reads in client code and
nothing else, and `schema.parse(process.env)` is not a static read, so the client gets an
empty object and every key fails at once — including `NEXT_PUBLIC_APP_URL`, which is
usually why someone imported `env` there to begin with.

The failure shape is the part worth knowing. `pnpm build` succeeds, the server-rendered
HTML is correct, and the page dies on hydration with a `ZodError` in the browser console
naming `SESSION_SECRET`. Every gate this stage wires stays green; only loading the page in
a browser shows it. The secret does not leak, because Next never hands a non-public
variable to the client, but the key names and the whole of Zod ship in the bundle. When a
client component needs a configured value, pass it down as a prop from a server component,
or read `process.env.NEXT_PUBLIC_APP_URL` directly, which is the static read Next does
substitute.

Which is exactly why the schema only lists keys you can supply *today*. It is a gate, not
a wishlist: every key in it has to have a value before anything boots, so a key for a
database you have not chosen yet locks you out of your own dev server. If the entry
criteria's database answer was "no", the commented-out line above is the whole idiom —
`.optional()` works too, but it invites `env.DATABASE_URL` to be typed `string | undefined`
in code that will one day require it.

Then give the keys values. `.env.example` is committed and holds no secrets; `.env.local`
is the one the app reads and `.gitignore` already excludes it:

```
# .env.example — copy to .env.local and fill in the blanks
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=              # openssl rand -base64 32
```

```bash
cp .env.example .env.local
openssl rand -base64 32      # paste after SESSION_SECRET= in .env.local
```

`NODE_ENV` is deliberately absent from both files: Next sets it (`development` for `pnpm
dev`, `production` for `pnpm build`), and pinning it yourself is how you end up with a dev
server that believes it is in production.

That pair, a schema of keys you can actually set and an example file someone can copy, is
what makes the first Definition of done reachable. A fresh clone, `pnpm install`,
`cp`, one `openssl rand`, `pnpm dev`, and a page renders, with no database anywhere.
`.env.example` stays the only documentation of required configuration that does not rot,
because the app stops booting when it drifts.

Install the test runner now, even with nothing to test yet:

```bash
pnpm add -D vitest
```

Add:

```json
{
  "scripts": { "test": "vitest run --passWithNoTests" }
}
```

What to put in the tests is [06 — Testing](06-testing.md); the point here is that the gate
you are about to wire has something real to call. A pipeline step naming a command nobody
installed fails on its first run, and the failure looks like a broken pipeline rather than
a missing dependency.

`--passWithNoTests` is there because you have no tests yet and will not until
[06 — Testing](06-testing.md). Without it `vitest run` exits 1 on an empty suite, so your
first push fails on a hook that is working correctly — which teaches the reader to bypass
the hook, the one habit this section exists to prevent. Drop the flag once 06 gives you
real tests. Left in place after that, a test file quietly excluded by a broken glob passes
green forever — the exact failure the Traps entry below warns about.

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
      run: pnpm typecheck
    test:
      run: pnpm test
```

Hooks installed by that command exist only on the machine that ran it. Add a `prepare`
script so a fresh clone gets them too:

```json
{
  "scripts": { "prepare": "lefthook install || true" }
}
```

The `|| true` is not defensive clutter. pnpm runs `prepare` on every install, `lefthook
install` exits 1 outside a git repository, and build hosts check out your source without a
`.git`. Unguarded, `pnpm install` fails on the host and the deploy dies at the install
step, before it reaches anything you configured. Neither `CI=1` nor `VERCEL=1` changes it.
Husky fails identically for the identical reason, so this is a property of `prepare`
rather than a lefthook footnote.

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
      - uses: actions/checkout@v7
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v7
        with: { node-version-file: '.nvmrc', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

Then enable branch protection on `main` requiring this check. An unenforced gate is
decoration — and on GitHub Free, branch protection is only enforced on *public* repos.
On a private one it saves and silently never fires. Confirm your plan enforces it.

### 8. Connect Vercel

```bash
pnpm add -g vercel && vercel link
```

That maps this directory to a Vercel project, and that is all it does. It does not
connect the project to the repository you pushed in §1. The Git connection is a separate
setting, and it is the one that builds every push and comments a preview URL on your pull
requests. Set it in the project's **Settings → Git**.

Three project settings decide whether this builds, and what it builds, and **none of them
can live in your repository**. That is the part worth internalising: everything else in
this stage is a file you commit and can diff. These live in a dashboard, and the only
signal that one is wrong is the error it produces, where there is one.

| Setting | Set it to | What you see when it is wrong |
|---|---|---|
| **Connected Repository** | the repo you pushed in §1, under Settings → Git | no preview URL on your pull request — or green production builds of a repository that is not yours |
| **Root Directory** | the folder holding `package.json` | `No Next.js version detected` |
| **Framework Preset** | Next.js | `No Output Directory named "public" found after the Build completed` |

Those three are the ones that blocked this playbook's own first deploy, and the connected
repository is the one with no error message attached, which is why it is listed first.

**Node.js Version** is a fourth field in the same dashboard and the exception worth naming:
it is the only one your repository can reach. `engines.node`, set in `### 1. Scaffold`,
overrides whatever the dashboard holds, so you set it in `package.json` and leave the
dashboard alone. Pinned in neither, there is no error to read:
it builds, on Vercel's default major, which is not necessarily yours.

The Framework Preset error is the one that misleads. It reads as "you deleted something you
needed"; it means the preset is `Other`, whose default output directory is `public`. A
project created against an empty repository has nothing to detect, so Vercel guesses, and
it guesses `Other`. With the Next.js preset the output is `.next` and a `public/` directory
is optional.

**Then check what it built, not whether it built.** A deployment list tells you a build
succeeded. It does not tell you which repository it succeeded on, and a green build of the
wrong repo is indistinguishable from a green build of yours at a glance. Take the commit
SHA off the deployment and ask your own repository about it:

```bash
git cat-file -t 79ef7a7    # a commit you can see  → "commit"
                           # anything else         → "Not a valid object name"
```

Now push a branch and open a pull request. You should get a preview URL — and if none
appears at all, the Git connection is the first thing to look at, not the build, because a
project with no repository attached has nothing to build and says so nowhere. Load the
URL, because a green checkmark is not the check. Fetch one real page and confirm it
renders. If you have configured a canonical URL anywhere, fetch `/robots.txt` too: it
prints the origin the build actually used, so one request tells you whether the value you
set is the value that shipped.

Verify all of this before writing any features. A broken deploy pipeline is far easier to
debug against a scaffold than against a half-built app.

### 9. Error tracking

```bash
pnpm add @sentry/nextjs && pnpm dlx @sentry/wizard@latest -i nextjs
```

**The auth token is the half the wizard cannot finish for you.** Source maps are uploaded
during the build by Sentry's bundler plugin, which takes the token from `SENTRY_AUTH_TOKEN`
in the *build's* environment, falling back to a `.env.sentry-build-plugin` file in the
working directory, which is where the wizard writes it and which must stay uncommitted.
So the one environment that builds what your users run has no token. Add
`SENTRY_AUTH_TOKEN` to the Vercel project's environment variables for Preview and
Production, or install Sentry's Vercel integration, which sets it for you.

Get this wrong and nothing goes red. The plugin logs `No auth token provided. Will not
upload source maps.` and the build succeeds, exactly like §8's green build of the wrong
repository, and you find out months later reading a minified stack trace at 2am.

So prove it the way §7 proves the CI gate, by breaking something on purpose:

```ts
// src/app/api/debug/boom/route.ts — temporary, delete after
export function GET() {
  throw new Error('Sentry smoke test')
}
```

Push it on a branch, open `/api/debug/boom` on the preview URL, then read the issue in
Sentry. The frame should name `route.ts` and the line you wrote. If it names a hashed
chunk under `.next/`, the upload did not happen and the token is the first thing to check.
Delete the route once you have your answer, and label the commit so it cannot quietly
become permanent: `chore(TEMP): route that throws, to verify Sentry source maps (revert
after)`.

Untested error tracking generally turns out to be broken exactly when you need it.

### 10. Write the README before the code

Three sections, ten minutes:

- **What this is** — one paragraph, understandable by future you at 2am
- **Running locally** — clone, install, env vars, dev command
- **Deploying** — how it reaches production and how to roll back

That last line matters more than it looks. See [10 — Documentation](10-documentation.md).

### AI in project setup

Setup is the stage where an agent is most useful and most confidently wrong, and the split
is clean: it is good at files you commit and blind to everything else. Every config here is
text it can write, read back, and check. The settings that most often break a first deploy
are not text, are not in your repository, and nothing you run locally can see them.

Where it earns its place:

- **Generate the config, then make it prove itself** (a skill). Scaffolds, `tsconfig`
  flags, a `lefthook.yml`, a CI workflow — all text, all conventional, all fast. Have it
  run each one rather than describe it. A workflow file that has never been pushed is a
  guess with syntax highlighting.
- **Derive `.env.example` from the schema** (a saved command). `src/lib/env.ts` already
  lists every variable. Generating the example from it keeps your only configuration
  documentation honest, because two files cannot drift when one is produced from the other.
- **Port conventions from your last project** (memory). `claude-mem` answers "what did I
  set up last time, and why". Setup is the most repeated stage in a career and the one
  people most often rebuild from nothing.
- **Read the docs for the version you installed** (an MCP). context7 over training memory.
  Scaffolding tools change flags between minor versions, and an agent confidently passing a
  removed flag produces an error two steps from its cause.
- **Break the gate on purpose** (a saved command). Have it push a deliberately failing
  commit and confirm CI goes red. This is the check people skip because it feels like
  theatre, and it is the only thing separating a gate from a green badge.

Named tools: `context7` for version-accurate docs, `claude-mem` for prior setups, and
Superpowers' `verification-before-completion` for the "prove it" half of every item above.

What none of this replaces: the dashboard. Root Directory, Framework Preset and the
connected repository live in a web UI no agent reads, and this playbook's own first deploy
was blocked by all three while every local check stayed green. An agent will happily debug
the error message and cannot see the setting that caused it. Nor will it tell you that a
green build is the wrong repository — that takes one command and a decision to be
suspicious, and suspicion does not delegate.

---

## Artifacts

- Repository with the feature-first `src/` structure
- `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `tsconfig.json`, `lefthook.yml`,
  `.nvmrc`, `.npmrc`, `.env.example`
- `package.json` pinning `engines.node` and `packageManager`, a guarded `prepare` script,
  and the `typecheck`, `test`, `lint`, `format`, and `format:check` scripts the hooks and
  CI call
- `src/lib/env.ts` validating configuration at boot
- `.github/workflows/ci.yml` with branch protection enforcing it
- A Vercel project producing preview URLs per pull request
- Sentry with verified source maps
- `README.md` covering what/run/deploy

---

## Definition of done

- [ ] A fresh clone reaches a running app with `.env.example` as the only guide: `pnpm
      install`, `cp .env.example .env.local`, fill in the blanks it names, `pnpm dev`
- [ ] A pull request produces a preview URL automatically
- [ ] CI fails on a deliberately broken commit (test it — do not assume it)
- [ ] Branch protection blocks merging when CI is red
- [ ] A deliberate error appears in Sentry with readable TypeScript stack traces
- [ ] `pnpm build` succeeds locally
- [ ] Node version is pinned in the file each environment reads — `.nvmrc` for local
      shells and CI, `engines.node` for the host
- [ ] The deployed commit SHA exists in your repository (`git cat-file -t <sha>`)

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

**Pinning the version your host does not read.** `.nvmrc` reaches your machine and your
CI and stops. If the environment that actually serves users is not pinned by a file that
environment reads, it is not pinned — and the failure is silent, because it builds.

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
