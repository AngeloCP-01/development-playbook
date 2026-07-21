# The Default Stack

This is the one place tool choices live. Every stage doc assumes this stack and links
back here rather than restating versions. When a choice changes, it changes here — once.

Versions below were current as of 2026-07-21. They are **floors, not pins**: the
playbook assumes "this major version or later." Check `npm view <pkg> version` before
starting a new project rather than trusting this file blindly.

---

## Core

| Concern | Choice | Version | Why this one |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.x | Server Components remove most of the client/server data plumbing that used to dominate a codebase. |
| UI library | React | 19.x | Comes with Next 16. |
| Language | TypeScript | 7.x | The Go-based compiler. Typecheck on a large codebase went from tens of seconds to low single digits, which is what makes typecheck-on-every-commit practical. |
| Runtime | Node.js | 22 LTS | Match this in CI, in Docker, and in Vercel project settings. Version drift between the three is a recurring source of "works locally" bugs. |
| Package manager | pnpm | 10.x | Strict `node_modules` layout means undeclared dependencies fail locally instead of in CI. |
| Hosting | Vercel | — | The framework and the platform are built by the same people; the integration is the point. |

## Data

| Concern | Choice | Why |
|---|---|---|
| Database | Postgres (Neon, via Vercel Marketplace) | Boring, relational, well understood. Neon's branching gives a real database per preview deploy. |
| Schema & migrations | Drizzle ORM 0.45+ | Migrations are generated SQL files you read and commit. When something breaks in production you are debugging SQL, not an ORM's intentions. |
| Validation | Zod 4.x | One schema validates the input and produces the TypeScript type. No drift between the two. |
| Blob storage | Vercel Blob | Only when files are actually part of the product. Do not add it speculatively. |
| Key-value / cache | Upstash Redis | Only for rate limiting, sessions, or a measured cache need. Postgres handles more load than people expect. |

## Quality

| Concern | Choice | Version | Notes |
|---|---|---|---|
| Unit & integration tests | Vitest | 4.x | Shares Vite's transform pipeline, so TS and path aliases work with no extra config. |
| End-to-end tests | Playwright | 1.61+ | Run against a real build, not the dev server. |
| Linting & formatting | Biome | 2.x | One tool, one config, one pass. Replaces the ESLint + Prettier pair and their disagreements. |
| Git hooks | Lefthook | 1.x | Fast, single binary, config in one YAML file. |

## Operations

| Concern | Choice | Notes |
|---|---|---|
| Error tracking | Sentry | Source maps uploaded at build time, or the stack traces are useless. |
| Analytics | Vercel Analytics + Speed Insights | Real-user Core Web Vitals, not lab numbers. |
| Uptime | Better Stack | External check against a real user path, not just `/api/health`. |
| Logs | Vercel log drain → Better Stack | Vercel retains logs for a short window. If you want history, drain them. |
| CI | GitHub Actions | Vercel handles deploys; Actions handles the merge gate. |

---

## When to deviate

The stack above is the default, not a rule. Deviate deliberately, and write down why
in an ADR (see [03 — Architecture](../docs/03-architecture.md)).

- **Long-running or CPU-heavy work** — Vercel Functions have execution limits.
  Move the work to a queue or a dedicated container. Reaching for a bigger function
  timeout is usually the wrong fix.
- **The product is not a web app** — a CLI, a daemon, or a mobile backend should not
  be bent into Next.js just because it is the familiar tool.
- **A required dependency is Python-only** (most ML work) — run it as a separate
  service with an HTTP boundary rather than contorting the Node app.
- **A client mandates their own infrastructure** — the stage docs still apply; only
  the deployment and observability chapters change.

## Keeping this file honest

This file rots faster than the rest of the playbook, because it names versions and the
others name ideas. Re-check it whenever you start a new project. If a stage doc contains
a version number, that is a bug in the stage doc — the number belongs here.
