import type { Cheatsheet } from './types'

/**
 * The strategies are transcribed from the gathered graphic. This repo's own
 * convention is not — it is read straight out of CLAUDE.md's Git conventions
 * section, which is the point the gathering list made: "largely a restatement
 * of decisions already made... gather comparisons of the alternatives, not
 * the convention itself."
 */
export const gitBranching: Cheatsheet = {
  slug: 'git-branching',
  title: 'Git Branching & Conventions',
  group: 'Git',
  stage: '04-project-setup',
  blurb: 'Trunk-based against GitFlow, and the commit format this repo uses.',
  source: {
    title: 'Git Branching Strategies',
    author: 'Nikki Siapno',
    image: {
      src: '/reference/git-branching.webp',
      width: 1228,
      height: 1536,
      alt: 'Five branching strategies compared: feature branching, Gitflow, GitLab Flow, GitHub Flow and trunk-based.',
    },
  },
  sections: [
    {
      title: 'Branching strategies',
      note: 'What each one adds over "just branch off main", and what it costs.',
      rows: [
        {
          term: 'Feature branching',
          what: 'Each feature gets its own branch, deleted once merged.',
          when: 'The default almost everyone starts from — no process beyond it is assumed.',
        },
        {
          term: 'Gitflow',
          what: 'Dedicated branches for features, releases, hotfixes, plus a permanent development branch alongside main.',
          when: 'Scheduled releases with real time between them — the ceremony pays for itself on a slow cadence, not a fast one.',
        },
        {
          term: 'GitLab Flow',
          what: 'Adds environment branches — staging, production — so main stays release-ready and environments are named, not inferred.',
          when: 'Multiple deploy targets that do not all track main directly.',
        },
        {
          term: 'GitHub Flow',
          what: 'Branch, open a PR, merge to main. Main is the only deployable branch and stays production-ready.',
          when: 'Continuous deployment with no separate release branch to keep in sync.',
        },
        {
          term: 'Trunk-based',
          what: 'Branches are short-lived, merged within a day; large work ships incrementally behind feature flags.',
          when: 'Fast-moving teams where a long-lived branch would drift from main faster than it could be reviewed.',
        },
      ],
    },
    {
      title: 'This repo’s convention',
      note: 'From CLAUDE.md, not the gathered graphic — closest to GitHub Flow with an extra promotion step.',
      rows: [
        {
          term: 'Branch naming',
          what: '`feat/<kebab-topic>` or `fix/<kebab-topic>`, no ticket numbers; `docs/<date>-<topic>` carries a date, `feat`/`fix` do not.',
        },
        {
          term: 'Commit format',
          what: 'Conventional Commits — `type(scope): subject`, subject lowercase, describing the change rather than the diff.',
        },
        {
          term: 'The flow',
          what: 'Work branches merge to `develop`, never to `main` — `main` is production and deploys on push. `develop` promotes to `main` by pull request, which the user merges.',
          when: 'Not a fast-forward: `main` can sit ahead of `develop` by its own promotion-merge commits.',
        },
        {
          term: 'Merging',
          what: '`--no-ff` always, never squash or rebase, with a hand-written merge subject and a bullet-summary body.',
          when: 'History should show what shipped as one unit, not lose the branch shape a rebase or squash would erase.',
        },
      ],
    },
  ],
}
