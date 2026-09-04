# 07. Code Review

> A deliberate second look before code becomes permanent. Solo, that second look is
> yours — which makes it harder, not optional.

**When this actually happens:** Before every merge, on every pull request. Including the
ones you wrote yourself.

---

## Entry criteria

- [ ] CI is green ([11 — CI/CD](11-ci-cd.md))
- [ ] The branch is rebased and history is clean
- [ ] The PR description explains why, not just what
- [ ] You have stepped away from the code for at least a few minutes

---

## The work

### Reviewing your own code

Solo, "review" sounds like theater. It is not — but it only works if you deliberately
break the state that makes self-review useless: you are still holding the intent in your
head, so you read what you *meant* rather than what you *wrote*.

Three techniques that actually change what you see:

**Create distance.** Minimum ten minutes, ideally overnight. Bugs that are invisible
while you are inside the problem become obvious once you are not.

**Read the diff, not the code.** In the GitHub PR view, not your editor. Different
presentation, different context, different things noticed. This is the single most
effective self-review trick — the diff view strips the surrounding code you have been
staring at and shows only what changed.

**Explain it out loud.** Write the PR description as though someone else will read it. If
you cannot explain why a piece is necessary, that is a finding.

### What to actually look for

Automation handles formatting, types, and lint. Do not spend attention there. Look at
what machines cannot judge:

**Correctness at the edges.** What happens with zero items, a null, a duplicate submit, a
very large input, a concurrent request? The happy path was tested during development.

**Authorization.** For every data access: can a user reach someone else's record? Any
query filtered only by an ID from the client is a finding. See
[05](05-development.md#server-actions-need-validation-and-authorization).

**Error handling.** What does the user see when this fails? A caught error with an empty
block is a bug hidden on purpose. A raw error message reaching the UI may leak internals.

**Names.** Does the name say what the thing does? Renaming is cheap now and expensive
after it spreads across thirty call sites.

**Scope.** Does the diff do what the description says, and nothing else? An unrelated
refactor bundled into a feature PR makes both harder to review and harder to revert.

**Deletion.** Did the change leave anything behind — a now-unused function, a stale flag,
a commented-out block? Commented-out code is what version control is for. Delete it.

**Reversibility.** If this is wrong, how bad is it and how fast can you undo it? A
migration deserves more scrutiny than a copy change, and should get proportionally more.

### The checklist

Fast pass, in this order:

- [ ] Does the diff match the description?
- [ ] Edge cases: empty, null, zero, duplicate, very large
- [ ] Every data access authorized, not just authenticated
- [ ] Failures produce a sensible user-visible state
- [ ] No secrets, keys, or tokens in the diff
- [ ] No `console.log` left behind
- [ ] No commented-out code
- [ ] Tests exist and would actually fail without the change
- [ ] Names are accurate
- [ ] Nothing unrelated is bundled in
- [ ] Migrations are backward compatible ([13](13-production-deployment.md))

### Test the tests

The most commonly skipped review step: confirm the test would fail without the fix.
This is the **teeth check** ([06 — Testing](06-testing.md#the-teeth-check)): break the
implementation, run the test, watch it — and only it — fail, restore.

If it still passes broken, it is not testing what you think. This takes twenty seconds
and catches a surprising number of tests that assert nothing meaningful.

### PR descriptions

```markdown
## What
Adds a status filter to the invoice list.

## Why
Users with 100+ invoices could not find unpaid ones without scrolling.
Reported three times this month.

## How
New `status` query param, defaulting to `all`. Filtering happens in the
database query, not client-side, so it works past the pagination boundary.

## Verification
- Preview: <url>
- Checked: filter combinations, empty result state, browser back button
- Migration: none
```

Write this before the review, not after. Articulating "why" is often when you notice the
approach is wrong — and that is exactly the moment you want to notice.

### Size

**Under 400 lines.** Past that, review quality falls off a cliff — reviewers (including
you) start skimming and approving on vibes.

If a PR is genuinely large, split it: schema in one, backend in another, UI in a third.
Each merges independently behind a flag.

### Automated review has a place

Static analysis and AI review tools catch a real class of issue — missing null checks,
unhandled promise rejections, subtle logic inversions — and they never get tired or
assume they already know what the code does.

Use them as an *additional* pass, not a replacement. They are poor at judging whether the
change was worth making, whether the abstraction fits the domain, or whether the
authorization model is right. Those are the parts that matter most.

### AI in code review

AI review tools — GitHub Copilot, CodeRabbit, or a custom static-analysis pass — catch a
real class of issue: null-reference paths, missing error handling, unhandled promise
rejections, simple logic inversions. They do not get tired, and they do not assume they
already know what the code does.

What they miss is everything that requires judgment. Whether the authorization model is
right. Whether the abstraction fits the domain. Whether the change should have been made at
all. Whether a test is vacuous — passing for the wrong reason. AI-generated code produces
roughly 1.7× more issues per PR than human-written code, and the natural instinct is to
review it *less* carefully, because it looks clean.

Use AI review as a first pass: let it run before you request human review. Fix the
mechanical issues it surfaces — the leftover `console.log`, the missing null check — so the
human reviewer gets a cleaner diff and spends their attention on the parts machines cannot
judge. That split is the point: AI handles the checklist items, humans handle the judgment
calls.

Concrete tools: `/code-review` in Claude Code runs a local review before you push — five
effort levels from `low` to `ultra`, and `--fix` auto-applies findings. `/security-review`
is a dedicated security pass. On GitHub, CodeRabbit and Copilot review PRs automatically;
Greptile indexes the full repository and catches cross-file bugs other tools miss.

The anti-pattern is treating AI review as the review. Agent-authored PRs get reviewed less
often, merged faster, and discussed less — which is exactly the erosion that turns review
from a quality gate into ceremony.

---

## Artifacts

- PR descriptions explaining what, why, how, and how it was verified
- Review comments recorded on the PR, including your own self-review notes
- Merged commits with clean, linear history

---

## Definition of done

- [ ] Diff read in the PR view, not the editor, after a real break
- [ ] Checklist above completed
- [ ] Tests verified to fail without the change
- [ ] Description covers what, why, how, verification
- [ ] Under 400 lines, or deliberately split
- [ ] Preview URL checked ([12](12-staging.md))

---

## Scaling to a team

- **Review is now someone else's job**, which is strictly better — they have the distance
  you have to manufacture.
- **Comment with severity.** Distinguish "blocking" from "suggestion" from "nit." Without
  labels, every comment reads as a demand and reviews turn adversarial.
- **Ask questions rather than issue instructions.** "What happens if this is empty?" gets
  a better outcome than "add a null check" — sometimes the answer is that it cannot be
  empty, and you have learned something.
- **Review within a day.** A PR waiting three days is a branch diverging for three days.
- **Approve with minor comments** rather than blocking on nits. Trust people to address
  them.
- **On receiving review:** verify claims rather than complying reflexively. A reviewer can
  be wrong, and agreeing with a wrong suggestion to be agreeable puts a bug in the
  codebase with two names on it. Check, then agree or explain.

### Comment with severity

Label every review comment so the author knows what blocks the merge and what does not.
Without labels, every comment reads as a same-weight demand and reviews turn adversarial.

Three blocking tiers and one non-blocking:

- **Critical** — data loss, security breach, or production outage if merged. The migration
  that drops a column before backfilling the new one. The query filtered by a client-supplied
  ID with no ownership check.
- **Important** — a correctness or UX bug the user will hit. The empty catch block that
  leaves a loading spinner stuck. A test that passes without the change.
- **Minor** — a real issue, not blocking. Duplicated logic across three handlers. A name
  that is vague but not misleading.
- **Nit** — polish. A rename suggestion. A formatting preference the linter does not
  enforce.

Tag each finding with an ID (`C1`, `I1`, `M1`, `N1`) so follow-ups can reference it
without quoting the whole comment. Where provenance matters — and it does — mark whether the
finding is new in this PR, pre-existing (`PRE-EXISTING`), or introduced by the plan rather
than the implementer (`PLAN-AUTHORED ERROR`). The distinction changes who fixes it and
whether it blocks this merge.

A reviewer is expected to disprove as well as confirm. If you wrote "this is a security
issue" and then discover it is not, say so and retract the finding — a retracted finding is
more useful than a wrong one left standing.

---

## Traps

**Reviewing immediately after writing.** You will read your intent, not your code. The
break is what makes review work.

**Reviewing in your editor.** Same context that produced the bugs. The diff view is a
different lens.

**Spending review on formatting.** Prettier handles it. Every comment about spacing is
attention not spent on the authorization bug.

**Approving large PRs anyway.** If it is too big to review properly, saying so is the
review.

**Assuming tests pass for the right reason.** Verify they fail without the change.

**Bundling refactors with features.** Both become harder to review and harder to revert.

**Treating your own review as ceremony.** It is the only review the code will get. The
techniques above exist because self-review is genuinely harder than reviewing someone
else's work — not because it is less important.

**Performative agreement with reviewers.** "Good catch, fixed!" on a suggestion you have
not verified is how confident-sounding wrong advice enters a codebase.
