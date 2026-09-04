/**
 * Source: `docs/12-staging.md`, "### AI in staging".
 *
 * `AI_PREMISE` is the section's opening two sentences, verbatim: what an
 * agent can do walking a preview (methodical, tireless coverage) and what it
 * cannot (judgment about what a user actually experiences). `AI_LIMIT` is the
 * closing paragraph, verbatim: opening the preview yourself is not
 * replaceable, because the two hardest checklist items require noticing what
 * is absent. Both are pinned against the doc in `ai-plays.test.ts`.
 *
 * `PLAYS` covers the section's bulleted list — one play per bullet, four in
 * total — each named tool matching the "Named tools" sentence that follows
 * the list: `claude-in-chrome`/`playwright` for the preview walk, `pnpm
 * test:e2e` with `BASE_URL` for the smoke run, `vercel env ls` for the
 * variable diff.
 */
export const AI_PREMISE =
  'An agent can walk a preview URL methodically — every viewport, every state, every checklist item — without getting bored and without skipping the signed-out check because it "probably still works." What it cannot do is notice that the empty state feels confusing, that the loading skeleton implies a layout the page does not deliver, or that the error message makes sense only to someone who has read the codebase. Mechanical coverage is the strength; judgment about what a user actually experiences is the gap.'

export const AI_LIMIT =
  'None of this replaces opening the preview yourself and asking "does this feel right." The two hardest checklist items — "does it actually work" and "did anything else break" — require noticing what is absent, which is the one thing a mechanical pass cannot do.'

export type Play = {
  id: string
  title: string
  kind: 'mcp' | 'command' | 'prompt' | 'cli'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'preview-walk',
    title: 'Drive the preview checklist',
    kind: 'mcp',
    body: 'Open the preview URL, walk the primary flow, then walk it signed out, throttled, at 320px and at 2560px. A browser MCP does this faster and more consistently than a human, and it does not skip the narrow viewport because the feature "is not mobile."',
  },
  {
    id: 'smoke-suite',
    title: 'Run the smoke suite against the preview URL',
    kind: 'command',
    body: '`BASE_URL=<url> pnpm test:e2e` — the same suite CI runs locally, pointed at the live preview. Catches regressions the preview checklist’s manual walk would miss.',
  },
  {
    id: 'hostile-seeds',
    title: 'Generate hostile seed data',
    kind: 'prompt',
    body: 'Describe the schema; ask for seed records that break layouts — long names, empty fields, Unicode, null avatars, extreme counts. Faster than inventing them by hand, and it produces combinations you would not think to try.',
  },
  {
    id: 'env-diff',
    title: 'Diff environment variables across scopes',
    kind: 'cli',
    body: '`vercel env ls` shows what is set for Production, Preview, and Development. A missing Preview variable is invisible until the preview fails; listing them side by side surfaces the gap.',
  },
]
