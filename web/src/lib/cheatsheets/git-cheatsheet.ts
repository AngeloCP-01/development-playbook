import type { Cheatsheet } from './types'

/**
 * The foundational git commands most developers use daily. Transcribed
 * from a gathered infographic covering nine categories from repository
 * setup through the four-area git model.
 *
 * Placed before `git-commands` (the "beyond basics" sheet) and
 * `git-branching` (strategy comparisons) so the Git group reads
 * foundations first.
 */
export const gitCheatsheet: Cheatsheet = {
  slug: 'git-cheatsheet',
  title: 'Git Cheat Sheet',
  group: 'Git',
  stage: '04-project-setup',
  blurb:
    'Essential commands from init to push, plus the four-area mental model.',
  source: {
    title: 'Git Cheat Sheet — Essential Commands Every Developer Should Know',
    author: 'Unrecorded',
    image: {
      src: '/reference/git-cheatsheet.webp',
      width: 1024,
      height: 1536,
      alt: 'Nine-section git cheat sheet covering repository setup, staging, branches, remotes, merging, undo, tags, and the four-area workflow model.',
    },
  },
  sections: [
    {
      title: 'Start a repository',
      rows: [
        {
          code: 'git init',
          what: 'Create a new Git repository in the current directory.',
          when: 'Starting a brand-new project. Run once, at the beginning.',
        },
        {
          code: 'git clone <repo-url>',
          what: 'Clone an existing repository into a new directory.',
          when: 'Joining a project that already exists on GitHub, GitLab, or another remote.',
        },
      ],
    },
    {
      title: 'Check your changes',
      rows: [
        {
          code: 'git status',
          what: 'See modified, staged, and untracked files.',
          when: 'Before staging, before committing, before switching branches. The single most-typed git command.',
        },
        {
          code: 'git diff',
          what: 'See changes that have not been staged yet.',
          when: 'Reviewing what you changed before deciding what to stage.',
        },
      ],
    },
    {
      title: 'Stage and commit',
      rows: [
        {
          code: 'git add <file>',
          what: 'Stage a specific file for the next commit.',
          when: 'When you want to commit some changes but not all of them.',
        },
        {
          code: 'git add .',
          what: 'Stage all changes in the current directory.',
          when: 'When every change belongs in the same commit. Check git status first.',
        },
        {
          code: 'git commit -m "message"',
          what: 'Save staged changes with a meaningful message.',
          when: 'After staging. The message describes what changed, not what you did to the diff.',
        },
        {
          code: 'git log --oneline',
          what: 'View a compact commit history (one line per commit).',
          when: 'Finding a recent commit, checking what landed, verifying branch state.',
        },
      ],
    },
    {
      title: 'Branches',
      rows: [
        {
          code: 'git branch',
          what: 'List local branches. The current branch is marked with an asterisk.',
          when: 'Checking which branch you are on, or seeing what branches exist.',
        },
        {
          code: 'git branch <branch-name>',
          what: 'Create a new branch at the current commit.',
          when: 'Starting a feature or fix. Does not switch to the new branch.',
        },
        {
          code: 'git switch <branch-name>',
          what: 'Switch to another branch.',
          when: 'Moving between branches. Replaces the older git checkout for branch switching.',
        },
        {
          code: 'git switch -c <branch-name>',
          what: 'Create and switch to a new branch in one step.',
          when: 'The common case: you want a new branch and you want to be on it immediately.',
        },
        {
          code: 'git branch -d <branch-name>',
          what: 'Delete a branch that has been merged.',
          when: 'After merging. Use -D (capital) to force-delete an unmerged branch.',
        },
      ],
    },
    {
      title: 'Sync with remote',
      rows: [
        {
          code: 'git fetch',
          what: 'Download remote changes without merging them.',
          when: 'When you want to see what changed on the remote before integrating.',
        },
        {
          code: 'git pull',
          what: 'Fetch and integrate changes from remote into your current branch.',
          when: 'Getting the latest changes. Equivalent to git fetch + git merge.',
        },
        {
          code: 'git push',
          what: 'Upload your local commits to the remote.',
          when: 'After committing locally and wanting others to see the work.',
        },
        {
          code: 'git push -u origin <branch>',
          what: 'Push a new branch to the remote and set it as the upstream.',
          when: 'The first push of a new branch. After this, plain git push works.',
        },
      ],
    },
    {
      title: 'Merge and rebase',
      note: 'Use merge to preserve history. Use rebase for a cleaner, linear history (it rewrites commits). This project uses merge (--no-ff) and never rebases.',
      rows: [
        {
          code: 'git merge <branch-name>',
          what: 'Merge another branch into your current branch. Creates a merge commit.',
          when: 'Integrating finished work. The merge commit records when and what was integrated.',
        },
        {
          code: 'git rebase <branch-name>',
          what: 'Reapply your commits on top of another branch. Rewrites commit history.',
          when: 'Cleaning up a feature branch before merging, when a linear history matters more than preserving the original commit sequence.',
        },
      ],
    },
    {
      title: 'Undo changes',
      note: 'Be careful with git reset --hard. It permanently discards local changes.',
      rows: [
        {
          code: 'git restore <file>',
          what: 'Discard unstaged changes in a file, reverting it to the last committed state.',
          when: 'When you edited a file and want to throw those changes away.',
        },
        {
          code: 'git restore --staged <file>',
          what: 'Unstage a file without deleting the changes.',
          when: 'When you staged something by mistake but still want to keep the edits.',
        },
        {
          code: 'git revert <commit-id>',
          what: 'Create a new commit that undoes an earlier commit.',
          when: 'Safely undoing a change that has already been pushed. Preserves history.',
        },
        {
          code: 'git reset --soft HEAD~1',
          what: 'Undo the last commit while keeping the changes staged.',
          when: 'When you committed too early and want to amend or re-split the work.',
        },
      ],
    },
    {
      title: 'Tags',
      rows: [
        {
          code: 'git tag',
          what: 'List all tags.',
          when: 'Checking which versions have been tagged.',
        },
        {
          code: 'git tag v1.0.0',
          what: 'Create a lightweight tag at the current commit.',
          when: 'Marking a release or milestone.',
        },
        {
          code: 'git push origin v1.0.0',
          what: 'Push a specific tag to the remote.',
          when: 'Tags are not pushed by default. Push them explicitly after creating.',
        },
      ],
    },
    {
      title: 'The Git model',
      note: 'The four areas: Working Directory (your local files) → Staging Area (changes ready to commit) → Local Repository (your Git history) → Remote Repository (e.g. GitHub). The workflow is: modify files, git add, git commit, git push.',
      rows: [
        {
          term: 'Working Directory',
          what: 'Your local files. Every edit starts here.',
        },
        {
          term: 'Staging Area',
          what: 'Changes you have selected for the next commit with git add.',
        },
        {
          term: 'Local Repository',
          what: 'Your commit history, stored in the .git directory.',
        },
        {
          term: 'Remote Repository',
          what: 'The shared history on GitHub, GitLab, or another host.',
        },
      ],
    },
  ],
}
