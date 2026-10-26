# Development Playbook web reader

The static Next.js app turns the canonical stage documents into interactive pages.
Stage content is hand-ported; the app does not read those Markdown files at runtime.

Use the shared [project instructions](../AGENTS.md) for commands, the risk-based
development workflow, verification and Git safeguards. All app commands run here:
`pnpm dev` starts the development server on port 3200.

Before building a stage, read [PATTERNS.md](PATTERNS.md) for interaction/test
patterns and [DESIGN.md](DESIGN.md) for the visual system. [AGENTS.md](AGENTS.md)
explains when the installed Next.js guides are needed. For routine content/style
edits, reuse those established patterns and run the relevant focused checks.

Current milestones live in [docs/task.md](../docs/task.md). Existing build, CI and
accessibility standards remain in force; the workflow does not require a full app
gate for prose-only repository changes.
