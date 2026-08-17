/**
 * Source: `docs/04-project-setup.md`, "### AI in project setup".
 *
 * Titles are the doc's bold bullet leads verbatim, and `ai-plays.test.ts`
 * counts the doc's own bullets rather than trusting a number written into a
 * plan. Stage 03 shipped a brief claiming eleven plays where the doc had nine.
 *
 * `kind` is the mechanism the doc names in parentheses after each title — two
 * of the five are saved commands, which is why the count and the kind tally are
 * different questions.
 */

export type Play = {
  id: string
  title: string
  kind: 'skill' | 'command' | 'memory' | 'mcp'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'prove-it',
    title: 'Generate the config, then make it prove itself',
    kind: 'skill',
    body: 'Scaffolds, `tsconfig` flags, a `lefthook.yml`, a CI workflow — all text, all conventional, all fast. Have it run each one rather than describe it. A workflow file that has never been pushed is a guess with syntax highlighting.',
  },
  {
    id: 'env-example',
    title: 'Derive `.env.example` from the schema',
    kind: 'command',
    body: '`src/lib/env.ts` already lists every variable. Generating the example from it keeps your only configuration documentation honest, because two files cannot drift when one is produced from the other.',
  },
  {
    id: 'port-conventions',
    title: 'Port conventions from your last project',
    kind: 'memory',
    body: '`claude-mem` answers "what did I set up last time, and why". Setup is the most repeated stage in a career and the one people most often rebuild from nothing.',
  },
  {
    id: 'read-the-docs',
    title: 'Read the docs for the version you installed',
    kind: 'mcp',
    body: 'context7 over training memory. Scaffolding tools change flags between minor versions, and an agent confidently passing a removed flag produces an error two steps from its cause.',
  },
  {
    id: 'break-the-gate',
    title: 'Break the gate on purpose',
    kind: 'command',
    body: 'Have it push a deliberately failing commit and confirm CI goes red. This is the check people skip because it feels like theatre, and it is the only thing separating a gate from a green badge.',
  },
]

/**
 * The section's closing point, and the reason this panel is not a list of wins.
 * Kept as the doc words it: the settings that break a first deploy are not
 * text, are not in the repository, and nothing you run locally can see them.
 */
export const AI_LIMIT =
  'What none of this replaces: the dashboard. Root Directory, Framework Preset and the connected repository live in a web UI no agent reads, and this playbook’s own first deploy was blocked by all three while every local check stayed green. An agent will happily debug the error message and cannot see the setting that caused it. Nor will it tell you that a green build is the wrong repository — that takes one command and a decision to be suspicious, and suspicion does not delegate.'
