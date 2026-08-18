/**
 * The four failures that blocked this playbook's own first deploy, as data.
 *
 * Three of them live in `docs/04-project-setup.md` §8's table of dashboard
 * settings; the fourth, the `prepare` script, is §6's, and it bit first — the
 * install step dies before any dashboard setting gets a chance to matter.
 *
 * The set is worth guessing at because one symptom is a green build. A reader
 * who has only ever debugged an error message has no habit for that one.
 */
export type Blocker = {
  id: string
  /** What the reader sees. One of these is a green build. */
  symptom: string
  options: { id: string; label: string }[]
  answer: string
  /** Why the wrong readings are tempting. Shown after the guess, never before. */
  explanation: string
}

/**
 * Every blocker offers the same four causes, so a reader who has learned the
 * set still has to read the symptom rather than recognise the shape of the
 * option list.
 */
const CAUSES: Blocker['options'] = [
  { id: 'root-dir', label: 'Root Directory is unset' },
  { id: 'preset', label: 'Framework Preset is Other' },
  { id: 'prepare', label: 'A prepare script that needs a git repository' },
  { id: 'wrong-repo', label: 'Connected to the wrong repository' },
]

export const BLOCKERS: Blocker[] = [
  {
    id: 'prepare',
    symptom:
      '`pnpm install` exits 1 on the build host and the deploy dies at the install step, before the build starts.',
    options: CAUSES,
    answer: 'prepare',
    explanation:
      'Nothing you configured has run yet, so the settings are not the place to look. pnpm runs `prepare` on every install, `lefthook install` exits 1 outside a git repository, and a build host checks out your source without a `.git`. Neither `CI=1` nor `VERCEL=1` changes that. The guard is `"prepare": "lefthook install || true"`, which keeps hooks working everywhere that has a `.git` and stops the install failing where there is none. Husky fails identically for the identical reason, so this is a property of `prepare` rather than a lefthook footnote.',
  },
  {
    id: 'root-dir',
    symptom: 'No Next.js version detected',
    options: CAUSES,
    answer: 'root-dir',
    explanation:
      'The most legible of the four: the host looked where you told it to and found no Next.js. Root Directory has to name the folder holding `package.json`, which is not the repository root when the app lives in `web/` and the root holds `docs/`. The message tempts you into checking the dependency, and the dependency is fine.',
  },
  {
    id: 'preset',
    symptom:
      'No Output Directory named "public" found after the Build completed',
    options: CAUSES,
    answer: 'preset',
    explanation:
      'This is the one that misleads. It reads as "you deleted something you needed", and it means the Framework Preset is `Other`, whose default output directory is `public`. Restoring a `public/` directory would make the message go away without fixing anything. With the Next.js preset the output is `.next` and `public/` is optional. A project created against an empty repository has nothing to detect, so Vercel guesses, and it guesses `Other`.',
  },
  {
    id: 'wrong-repo',
    symptom:
      'Three green production builds in the Deployments tab, and no preview URL on the pull request.',
    options: CAUSES,
    answer: 'wrong-repo',
    explanation:
      'The only one with no error attached, which is why it is the one to check first. A deployment list tells you a build succeeded; it does not tell you which repository it succeeded on, and a green build of the wrong repo is indistinguishable from a green build of yours at a glance. Take the commit SHA off the deployment and ask your own repository about it: `git cat-file -t <sha>` answers `commit` for a commit you can see, and `Not a valid object name` for one you cannot — which is the answer `79ef7a7` gave in the incident. The missing preview URL is the same cause seen from the other side: your pull requests are on a repository this project is not watching, so there is nothing to build a preview of, and nothing anywhere says so.',
  },
]
