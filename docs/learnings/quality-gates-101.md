# Quality gates 101

What the W-4 round taught while wiring tests, hooks, and CI into this repo. Written for
the next project's day one, when all of this gets set up again from scratch.

The round's headline: **a gate you have never watched fail is a decoration.** Every
useful discovery below came from deliberately trying to break the thing just built.

---

## ESLint waves warnings through, and most rules are warnings

`eslint` exits 0 when there are only warnings, and most of `eslint-config-next`'s rules —
unused variables included — are warnings. So a bare `eslint` step in a hook or CI is a
gate that passes almost everything.

It took three probes to get a bad commit rejected here:

1. First probe sailed through — the hook ran `eslint` bare.
2. Hardened the `lint` *script* with `--max-warnings 0`. Second probe **still** sailed
   through, because the hook called `eslint` directly and never used the script.
3. Hardened the hook's own command. Third probe rejected.

Two lessons in one: gate at `--max-warnings 0`, and when a check exists in two places,
fixing one of them proves nothing about the other.

## The teeth check is the method, not a nicety

Tests written after the code (regression tests, invariants over existing data) are green
from birth, which proves nothing. Every suite in this round was teeth-checked:

- Corrupting one stage slug failed exactly the four tests that depend on it — and
  nothing else. Precision matters: a break that fails half the suite tells you the tests
  overlap, not that they work.
- Regressing `--faint` to its old value failed the contrast test with named pairs.
- The bad-commit probe, above, three times.

Budget for the teeth check finding real problems. Here it found two.

## The committed suite was stricter than the throwaway scripts — good

First real run of the committed audit suite flagged inline `<Term>` buttons as sub-44px
touch targets. The ad-hoc sweeps had never flagged them, because one iteration had
excluded everything with `aria-controls` — an accidental, overbroad exemption that
silently masked a whole class of element.

The resolution was neither "inflate inline buttons to 44px" nor "restore the blanket
exclusion": WCAG 2.5.8 explicitly exempts targets that sit inline in a sentence, so the
suite now exempts `el.closest('p')` and documents why. When a stricter checker
contradicts an older looser one, the difference is information — chase it to a
principled rule rather than porting the old checker's blind spots.

## Hooks when the app is a subdirectory

Git hooks install at the git root; the app lives in `web/`. What works:

- `lefthook.yml` at the **repo root**, each command carrying `root: 'web/'` — staged
  files filter to the app and commands run there.
- `lefthook` as a devDependency of `web/`, with `"prepare": "lefthook install"` so
  hooks reinstall after every `pnpm install`, from `web/`, and lefthook finds the git
  dir by walking up.
- Staged-file work only in pre-commit (prettier + eslint); the full typecheck + unit
  suite in pre-push. A slow pre-commit is a hook people bypass with `--no-verify`.

## Browser audits run against a production build, on an offset port

`@playwright/test`'s `webServer` handles the whole lifecycle:

```ts
webServer: {
  command: 'pnpm build && pnpm start -p 3100',
  url: 'http://localhost:3100',
  reuseExistingServer: !process.env.CI,
}
```

Port 3100 keeps clear of the dev server; the production build keeps the dev overlay's
console noise out of the console-error check. Locally, `reuseExistingServer` skips the
rebuild when a server is already up.

## What was deliberately left out

- Component/behaviour tests for the stage exercises — deferred to W-3, where each stage
  brings its tests with it, so the gate did not freeze APIs mid-evolution.
- Visual regression — the audit checks properties (contrast, overflow, size), which do
  not rot the way screenshots do.
- The final proof, still owed after push: a deliberately broken commit pushed with
  `--no-verify` on a scratch branch, to watch CI itself go red once. Hooks were proven
  locally; CI is proven the same way or not at all.
