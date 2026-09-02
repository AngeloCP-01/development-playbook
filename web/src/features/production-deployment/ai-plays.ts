/**
 * Source: `docs/13-production-deployment.md`, "### AI in production deployment".
 *
 * `AI_PREMISE` is the opening paragraph: what an agent handles well (migration
 * mechanics) and what it handles poorly (judgment calls). `AI_LIMIT` is the
 * closing paragraph: the tools available and the fundamental gap — data does
 * not roll back. Both are pinned against the doc in `ai-plays.test.ts`.
 *
 * `PLAYS` covers the four bulleted plays, each with a `kind` matching the
 * parenthetical in the doc: prompt, CLI command, saved command.
 */
export const AI_PREMISE =
  'An agent handles migration mechanics well — generating SQL, checking schema compatibility, verifying that expand/migrate/contract steps are in order — because the rules are explicit and the inputs are structured. It handles the judgment calls poorly: whether this change needs a feature flag, whether a backfill is large enough to batch, whether a deploy window matters. Those stay yours.'

export const AI_LIMIT =
  'The tools are the Vercel CLI, `curl`, and whichever editor the agent runs in. The gap is the same one the rest of this stage names: data does not roll back. An agent that runs a contract migration against production because the expand step passed is doing exactly what it was told, and the data is gone.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'generate-migrations',
    title: 'Generate expand/migrate/contract SQL from a schema diff',
    kind: 'prompt',
    body: 'Describe the change you want — "rename `users.name` to `users.full_name`" — and the agent writes the three migration files, each deployable alone. Review the SQL; do not run it unread.',
  },
  {
    id: 'dry-run-migration',
    title: 'Dry-run a migration against the preview database',
    kind: 'cli',
    body: 'Run the migration against a Neon branch database before touching production, so schema errors surface where they cost nothing.',
  },
  {
    id: 'verify-skew',
    title: 'Verify skew protection after a deploy',
    kind: 'cli',
    body: 'Check that the deployment-ID header is present on a production response — `curl -sI https://your-app.vercel.app | grep -i x-deployment-id` — confirming the deploy is pinned.',
  },
  {
    id: 'rehearse-rollback',
    title: 'Rehearse rollback on a preview deployment',
    kind: 'command',
    body: 'Run `vercel promote <previous-url>` against a non-production deployment to confirm the command works and you know the output before you need it under pressure.',
  },
]
