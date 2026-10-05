# Stage 08 chapter and port: execution evidence

**Branch:** `feat/stage-08-security-audit`, cut from `develop` at `1bb0879`.
The chapter and port are complete on this branch. No merge, push, or deployment
has occurred.

## Chapter guard

RED was for the expected missing chapter material. The first run reported:

```text
FAIL  |unit| src/lib/stage-08-structure.test.ts > a second user tests the same invoice across every object operation
AssertionError: expected ... to contain '### Test the policy with two users'
FAIL  |unit| src/lib/stage-08-structure.test.ts > the audit has a threat model and a finding that can be retested
AssertionError: expected ... to contain '### Draw the trust boundaries'
FAIL  |unit| src/lib/stage-08-structure.test.ts > SQL guidance distinguishes bound parameters from raw insertion
AssertionError: expected ... to contain 'sql.raw()'
FAIL  |unit| src/lib/stage-08-structure.test.ts > operational caveats and AI limits accompany the examples
AssertionError: expected ... to contain 'every subdomain'
Test Files  1 failed (1)
Tests  4 failed (4)
```

GREEN after the chapter correction:

```text
Test Files  1 passed (1)
Tests  4 passed (4)
```

## Interactive port

The first render-test run failed because `SecurityAudit.tsx` did not exist.
The registration test then failed for the intended reason:

```text
FAIL  |dom| src/features/stage-08-port.test.tsx > Stage 08 is ready only with its full audit rail registered
- true
+ false
❯ src/features/stage-08-port.test.tsx:10:33
Test Files  1 failed (1)
Tests  1 failed (1)
```

After the ten panels and registries landed, the focused run was green:

```text
Test Files  5 passed (5)
Tests  66 passed (66)
```

Teeth check: temporarily changing `User B: deny` to `User B: allow` in
`PolicyMatrix.tsx` made only the policy render test fail. The observed output:

```text
FAIL  |dom| src/features/security-audit/SecurityAudit.test.tsx > every policy operation renders the other user and anonymous as denied
AssertionError: expected ... to match /User B: deny/
"Open User A's invoice URLOwner: allowUser B: allowAnonymous: denyAdmin without grant: deny..."
Test Files  1 failed (1)
Tests  1 failed | 3 passed (4)
```

Restoring the denial returned **4/4**. The first whole-branch review found an
Important omission: reset-token properties, non-revealing errors, and sensitive
logs were in the chapter but absent from the port. The new render test failed
on the missing reset-token detail before those rows were added:

```text
FAIL  |dom| src/features/security-audit/SecurityAudit.test.tsx > the control pass includes reset tokens, existence leaks, and sensitive logs
AssertionError: expected ... to match /single.use.*short.lived.*random/i
Test Files  1 failed (1)
Tests  1 failed | 5 passed (6)
```

The source-link test also failed for the expected missing OWASP IDOR link, then
for the missing threat-model link. After the fix, the focused suite passed
**7/7**. The reviewer verified that the new controls and links are reachable
in the rendered panels and that these tests click the disclosures; its final
verdict was **Ready to merge**.

## Branch verification

| Check | Result |
|---|---|
| Fresh `pnpm test` after review fixes and records | **1403/1403**, 184 files |
| `pnpm lint` | exit 0, zero warnings |
| `pnpm typecheck` | typegen and `tsc --noEmit` exit 0 |
| Fresh `pnpm format:check` | exit 0; all matched files formatted |
| Production build | 49 static pages generated |
| `pnpm test:e2e` after review fixes | **18/18**, both-theme contrast, 320–2560px overflow, touch targets, console, hashes, panel height |
| `pnpm test:dev-console` | **1/1**, no React development warnings, run once for this stage round |

The initial sandboxed build and browser audit stopped while fetching the
project's Google Fonts. With network access, the build and audit ran. The
first browser audit then found one test fixture that still named Stage 08 as
the unready placeholder. It was moved to Stage 09, where the focused browser
suite passed **3/3**, and the final full browser audit passed **18/18**.

The chapter's shell searches and TypeScript samples were reviewed against the
installed framework docs and the cited library documentation. The samples
depend on an invoice store or external rate limiter, so they were not run as a
standalone application. `git diff --check` passed for the records update.

## Deferred

- The W-6 `security` reference sheet and any published image plate.
- Running these sample controls against a real authenticated application; the
  site teaches a simulated invoice case and has no backend or auth service.
- A full ASVS assessment. The stage gives a scoped first audit and links to
  primary guidance for deeper control review.
- Merge into `develop`, push, and production promotion. Each is a separate
  integration decision under the repository's branch rules.
