/**
 * Source: `docs/04-project-setup.md`, §5 "Environment variables, validated at
 * boot" — the subsection beginning "One limit on 'everywhere': server modules
 * only, never a `'use client'` file."
 *
 * The panel is a guess-then-reveal, and the guess only works because the answer
 * is counter-intuitive: the stage has just spent an afternoon wiring five gates
 * and four of them are silent on this. Every `why` below is the reason that
 * particular gate cannot see it, not a restatement of the verdict.
 */

export type Gate = {
  id: string
  label: string
  catchesIt: boolean
  why: string
}

export const GATES: Gate[] = [
  {
    id: 'build',
    label: 'pnpm build',
    catchesIt: false,
    why: 'The build succeeds. Next substitutes static `process.env.NEXT_PUBLIC_*` reads in client code and nothing else, and `schema.parse(process.env)` is not a static read — it is a valid function call over an object the bundler is happy to leave alone. Nothing in the build evaluates it.',
  },
  {
    id: 'checks',
    label: 'format, lint and typecheck',
    catchesIt: false,
    why: 'Nothing here is malformed. The import resolves, the module exports what it says it does, and `env` is typed identically whether the file that imports it runs on the server or in the browser. The mistake is about where the code runs, and none of these three know that.',
  },
  {
    id: 'tests',
    label: 'the test suite',
    catchesIt: false,
    why: 'Vitest runs in Node, where `process.env` is the real environment and the schema parses cleanly. At this point in the stage the suite is `vitest run --passWithNoTests` anyway, so it has nothing to say either way.',
  },
  {
    id: 'ci',
    label: 'CI',
    catchesIt: false,
    why: 'CI calls the same commands you just ran, on a clean machine. That is its whole value and also its ceiling: a pipeline can only be as observant as the checks it invokes, and none of them look at hydration.',
  },
  {
    id: 'browser',
    label: 'loading the page in a browser',
    catchesIt: true,
    why: 'The browser hands the shim to `schema.parse`, which sees an empty object and fails every key at once — including `NEXT_PUBLIC_APP_URL`, which is usually why someone imported `env` there to begin with. A `ZodError` naming `SESSION_SECRET` appears in the console and the page dies on hydration.',
  },
]

/**
 * The failure shape, which is the part worth knowing. Stated as three claims
 * because the reveal is about which of them are true, not whether it breaks.
 */
export const CLIENT_FAILURE =
  '`pnpm build` succeeds, the server-rendered HTML is correct, and the page dies on hydration with a `ZodError` in the browser console naming `SESSION_SECRET`. The secret itself does not leak — Next never hands a non-public variable to the client — but the key names and the whole of Zod ship in the bundle.'
