/**
 * Source: `docs/04-project-setup.md`, §2 "Set the folder structure" — the
 * fenced `src/` block and the three paragraphs under it.
 *
 * Entries and their order are the doc's, and `tree.test.ts` reads the doc's own
 * code block to hold both. The notes are the port's job: the doc explains the
 * tree in prose after printing it, and a click-node inspector needs the
 * explanation attached to the node it explains.
 *
 * `conditional` is set on exactly one node. §2 says `src/db/` is the one folder
 * in the tree that is conditional, and the entry criteria is where that
 * condition is decided — "You have decided whether this needs a database *now*
 * (if unsure, it does not)".
 */

export type TreeNode = {
  path: string
  kind: 'dir' | 'file'
  note: string
  conditional?: boolean
  children?: TreeNode[]
}

export const SRC_TREE: TreeNode = {
  path: 'src/',
  kind: 'dir',
  note: '`--src-dir` puts application code here and leaves the repository root for configuration. Worth it about the time the root accumulates a dozen config files.',
  children: [
    {
      path: 'src/app/',
      kind: 'dir',
      note: 'Routes only, and thin. Routing, auth checks, composition. Business logic lives in `src/features/`, which is what keeps it testable without booting a framework.',
      children: [
        {
          path: 'src/app/(marketing)/',
          kind: 'dir',
          note: 'A route group. The parentheses keep it out of the URL, so public pages can share a layout without sharing a path segment.',
        },
        {
          path: 'src/app/(app)/',
          kind: 'dir',
          note: 'The other route group: everything behind a session. Same trick, different layout, and the auth check sits at the group boundary rather than in every page.',
        },
        {
          path: 'src/app/api/',
          kind: 'dir',
          note: 'Route handlers, for the things a server action cannot be — webhooks, health checks, anything a caller outside your app has to reach by URL.',
        },
      ],
    },
    {
      path: 'src/features/',
      kind: 'dir',
      note: 'The actual application, one folder per feature. This is the organizing principle the rest of the tree is arranged around.',
      children: [
        {
          path: 'src/features/billing/',
          kind: 'dir',
          note: 'The worked example. Everything billing needs is in here, which means deleting the feature is deleting one directory.',
          children: [
            {
              path: 'src/features/billing/components/',
              kind: 'dir',
              note: 'Components only billing uses. When a second feature wants one, that is the signal to move it to `components/ui/` — not before.',
            },
            {
              path: 'src/features/billing/queries.ts',
              kind: 'file',
              note: 'Reads. Splitting reads from writes by file is a convention that costs nothing and makes "what touches the database here" a one-file answer.',
            },
            {
              path: 'src/features/billing/actions.ts',
              kind: 'file',
              note: 'Writes, as server actions. The file every review of this feature opens first, because it is where the damage is.',
            },
            {
              path: 'src/features/billing/schema.ts',
              kind: 'file',
              note: 'Zod schemas for this feature’s inputs. Local to the feature, unlike `src/lib/env.ts`, which validates the environment once at boot.',
            },
            {
              path: 'src/features/billing/billing.test.ts',
              kind: 'file',
              note: 'Tests next to the code they test. A parallel `tests/` tree is one more place to forget, and it makes deleting the feature a two-directory job.',
            },
          ],
        },
      ],
    },
    {
      path: 'src/components/ui/',
      kind: 'dir',
      note: 'Generic, reusable, feature-agnostic. If a component knows what billing is, it does not live here.',
    },
    {
      path: 'src/lib/',
      kind: 'dir',
      note: 'Cross-cutting: auth, utils, env, and the database client if there is one. `src/lib/env.ts` from §5 is the file that makes configuration fail at boot rather than in a request handler three weeks later.',
    },
    {
      path: 'src/db/',
      kind: 'dir',
      conditional: true,
      note: 'The one conditional folder. If the entry criteria’s database answer was "unsure", it was "no", so do not create it. An empty `db/` holding a `schema.ts` that describes nothing is the structural version of a `DATABASE_URL` you have no value for: a placeholder that looks like a decision. It arrives in the commit that adds the client.',
      children: [
        {
          path: 'src/db/schema.ts',
          kind: 'file',
          note: 'The table definitions. Arrives with the client, alongside uncommenting `DATABASE_URL` in `src/lib/env.ts` — one commit, both halves.',
        },
        {
          path: 'src/db/migrations/',
          kind: 'dir',
          note: 'Generated migration files, committed. They are the record of how the schema got here, which is the part a fresh environment needs and the schema file cannot supply.',
        },
      ],
    },
  ],
}
