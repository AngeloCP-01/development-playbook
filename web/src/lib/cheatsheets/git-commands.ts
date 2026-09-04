import type { Cheatsheet } from './types'

/**
 * Two graphics, not one. The displayed plate is the one already gathered and
 * converted in W-6.2 — "Git Beyond commit and push", author unrecorded — which
 * is why the sheet's second section is the one that matches it. The first
 * section (the basics) was cross-checked against a second gathered graphic
 * ("Git Cheat Sheet — Essential Commands Every Developer Should Know",
 * also unattributed) that is not itself displayed: nothing here needs two
 * plates to make the same point twice, and the commands are standard enough
 * that the graphic served as a completeness check rather than a source of
 * wording. See reference/cheatsheet-sources.md for both.
 */
export const gitCommands: Cheatsheet = {
  slug: 'git-commands',
  title: 'Git Commands',
  group: 'Git',
  stage: '04-project-setup',
  blurb: 'The ones worth memorising, and the ones worth looking up.',
  source: {
    title: 'Git Commands',
    author: 'Unrecorded — see reference/cheatsheet-sources.md',
    image: {
      src: '/reference/git-commands.webp',
      width: 1024,
      height: 1536,
      alt: 'Six commands beyond commit and push: stash, cherry-pick, rebase, reflog, bisect, reset vs revert.',
    },
  },
  sections: [
    {
      title: 'Basics',
      note: 'The work → stage → commit → push loop, and the commands each step names.',
      rows: [
        {
          code: 'git init',
          what: 'Creates a new repository in the current directory.',
          when: 'Starting a project from nothing.',
        },
        {
          code: 'git clone <url>',
          what: 'Copies an existing repository, history included.',
          when: 'Starting from someone else’s history instead of your own.',
        },
        {
          code: 'git status',
          what: 'Lists modified, staged and untracked files.',
          when: 'Before every commit, so nothing surprising goes in.',
        },
        {
          code: 'git diff',
          what: 'Shows changes that have not been staged yet.',
          when: 'Checking exactly what changed before you stage it.',
        },
        {
          code: 'git add <file> / git add .',
          what: 'Stages a specific file, or every change.',
          when: 'The line between "changed" and "about to be committed".',
        },
        {
          code: 'git commit -m "message"',
          what: 'Saves the staged changes with a message.',
          when: 'One logical change per commit, not one commit per save.',
        },
        {
          code: 'git log --oneline',
          what: 'A compact, one-line-per-commit history.',
          when: 'Scanning recent history without the full commit body noise.',
        },
        {
          code: 'git branch <name> / git switch <name> / git switch -c <name>',
          what: 'Create a branch, switch to one, or do both in one step.',
          when: '`-c` is the one you reach for starting new work.',
        },
        {
          code: 'git fetch / git pull / git push',
          what: 'Download remote changes without merging, download and merge, or upload local commits.',
          when: '`fetch` first if you want to see what changed before merging it in.',
        },
        {
          code: 'git merge <branch> / git rebase <branch>',
          what: 'Combine another branch into yours — merge keeps both histories, rebase replays yours on top.',
          when: 'Merge to preserve what happened; rebase for a clean, linear log.',
        },
        {
          code: 'git restore <file> / git revert <commit> / git reset --soft HEAD~1',
          what: 'Three different undos: discard an unstaged edit, add a new commit that undoes an old one, or uncommit while keeping the changes staged.',
          when: 'Restore for a typo, revert once history is shared, reset only on a branch nobody else has pulled.',
        },
      ],
    },
    {
      title: 'Beyond commit and push',
      note: 'The commands that stop being optional once a project outlives its first week.',
      rows: [
        {
          code: 'git stash',
          what: 'Saves uncommitted changes without creating a commit.',
          when: 'Switching context mid-task without a half-finished commit to clean up later.',
        },
        {
          code: 'git cherry-pick <commit-id>',
          what: 'Copies one specific commit onto the current branch.',
          when: 'You need that one fix, not the whole branch it shipped on.',
        },
        {
          code: 'git rebase main',
          what: 'Replays your branch’s commits on top of main, keeping history linear.',
          when: 'Tidying a feature branch’s log before it merges.',
        },
        {
          code: 'git reflog',
          what: 'Recovers commits that look lost — nothing is gone until it is garbage-collected.',
          when: 'After a reset or a branch delete you immediately regret.',
        },
        {
          code: 'git bisect start / bad / good <commit-id>',
          what: 'Binary-searches history for the exact commit that introduced a bug.',
          when: 'A regression exists somewhere in fifty commits and reading them one at a time is not an option.',
        },
        {
          code: 'git reset --hard <commit-id> vs git revert <commit-id>',
          what: 'Reset rewrites history to a point; revert adds a new commit undoing an old one.',
          when: 'Reset only on history nobody else has pulled — revert is the safe default once it is shared.',
        },
      ],
    },
  ],
}
