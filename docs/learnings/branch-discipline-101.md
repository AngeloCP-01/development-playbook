# Branch discipline 101

What one session (2026-08-25) cost by getting this wrong twice, on the same day, after
fixing it the first time. Written down because "I already know this" is exactly what
made the second one possible.

## The mistake, stated plainly

A session merges a branch. `git checkout develop && git merge ... --no-ff` leaves the
working directory checked out on `develop`. Nothing about that state announces itself as
dangerous — the merge just finished, the tests just passed, the natural next move is to
keep working. **The next file edit and the next commit both land on `develop` unless a new
branch is checked out first**, and CLAUDE.md's rule ("work happens on `feat/`/`fix/`
branches, never directly on `develop` or `main`") does not enforce itself. Nothing in the
gate catches a commit on the wrong branch — lint, typecheck and the audit suite all pass
identically whichever branch HEAD points at.

## It happened twice in one session

First time: right after merging the TD-43 fix branch, the very next round of work (six
cheatsheets, W-6.3a) was implemented and committed straight onto `develop`. Caught
immediately — before a second commit compounded it — by checking `git branch --show-current`
on a hunch. Fixed by branching off the misplaced commit and resetting `develop` back with
`git reset --hard`, which needed the user's own `!`-prefixed command, since a sandboxed
session cannot authorise a hard reset for itself even when it caused the problem.

The fix was written up. The lesson was stated. **The very next round (the syntax-highlighting
work, D-91) started the identical way**: still checked out on `develop` from the previous
merge, first file edited there, first commit almost made there — caught only because
checking the branch had become a reflex from the first time, not because the earlier
write-up prevented it. Writing down "this happened" did not stop it happening again; only
checking, every time, before the first edit, did.

## The fix is mechanical, not a reminder

A reminder is a sentence a session reads once and a future session does not. The thing that
actually holds is a check run at the *start* of new work, before the first edit:

```bash
git branch --show-current
```

If the answer is `develop` or `main`, branch before touching anything:

```bash
git checkout -b feat/<topic>   # or fix/, docs/YYYY-MM-DD-<topic>
```

Do this **immediately after any merge**, not just at the start of a session — a merge is
exactly the moment that leaves you on the base branch with the strongest pull to keep
going. The safest habit is to make "just merged" and "check the branch" the same reflex,
since that is the one moment this mistake has now happened at twice.

## What made it recoverable both times

Nothing was pushed. `develop` was local-only ahead of `origin/develop` in both cases, so
the wrong-branch commits were fully fixable — branch off, reset, re-merge properly. The
same mistake with a pushed `develop`, or on a repo where `develop` deploys (as `main` does
here since 2026-08-11), would not have a clean undo. **Check the branch before the first
edit precisely because the cost of not catching it is not constant** — it is cheap when
nothing downstream has happened yet, and it stops being cheap the moment something has.
