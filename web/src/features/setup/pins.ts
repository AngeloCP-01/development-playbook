/**
 * §1's three environments and the file each one reads.
 *
 * This is the pairing TD-28 was opened for. The doc used to tell the reader to
 * confirm the host's Node version "matches `.nvmrc`", and the host reads
 * neither `.nvmrc` nor the CI workflow, so a reader who followed it pinned
 * local and CI, believed they had pinned production, and had not.
 *
 * The exercise is a pairing rather than a paragraph because the defect is a
 * mis-pairing. A reader who gets `host` wrong has made the exact mistake the
 * doc used to instruct.
 */

export type PinTarget = {
  id: string
  environment: string
  reads: string
  /** The wrong answer a reader most often gives. */
  mistake: string
  why: string
}

export const PIN_TARGETS: PinTarget[] = [
  {
    id: 'local',
    environment: 'Your shell, and anyone else who clones this',
    reads: '.nvmrc',
    mistake: 'package.json → engines.node',
    why: '`nvm` and `fnm` read `.nvmrc`, and switch to it on `cd` once the shell hook is enabled. `engines.node` is a constraint, not a switch: nothing in your shell changes version because you wrote it, and pnpm only complains about it if you asked for `engine-strict=true`.',
  },
  {
    id: 'ci',
    environment: 'GitHub Actions',
    reads: '.nvmrc, through node-version-file',
    mistake: 'Whatever the runner defaults to',
    why: '`actions/setup-node` reads the file you name in `node-version-file`, which is how CI ends up on the same major as your shell. Omit it and the runner picks its own default, which drifts under you without a commit.',
  },
  {
    id: 'host',
    environment: 'Vercel, the one serving your users',
    reads: 'package.json → engines.node',
    mistake: '.nvmrc',
    why: 'The host reads neither `.nvmrc` nor your workflow. Its Node version comes from a project setting, overridden by `engines.node`, which is the one field in that dashboard your repository can reach. Pinned in neither place, there is no error to read at all: the build succeeds on Vercel’s default major, which is not necessarily yours.',
  },
]

/**
 * Quoted, not paraphrased. A test holds it to the doc character-for-character,
 * because the generalisation is worth more than any of the three pairings and a
 * drifted copy would have the app teaching a second rule. The doc hard-wraps
 * the sentence mid-clause, so the test collapses whitespace before comparing —
 * that is the only difference it tolerates.
 */
export const PIN_RULE =
  'for each environment that runs your code, find the file that environment reads'
