# Stage 08 Security Audit: chapter and interactive port

## Problem

The 270-line chapter at `docs/08-security-audit.md:1` puts object ownership at the
center of a security audit, but leaves its two required records mostly undescribed:
the threat model at `:197` and audit record at `:201`. A reader sees one safe
invoice query at `:54`, then a list of checks with no worked pass from scope to
finding to retest. The web registry still marks Stage 08 unready at
`web/src/lib/stages.ts:96`.

Some wording is too absolute. `docs/08-security-audit.md:82` calls any
interpolated value in raw SQL a finding, although Drizzle's `sql` template binds
values; `sql.raw()` inserts unescaped SQL. The claim at `:187` that tools do not
find authorization bugs overlooks policy-aware tests. The rate-limit snippet at
`:120` uses an undefined `redis` and `ip`. The HSTS example at `:157` applies
`includeSubDomains` without telling the reader to verify every subdomain's HTTPS.

## Goals

- Make the chapter usable for a solo developer auditing one Next.js application:
  record assets and trust boundaries, define permission policy, test two users
  across read and mutation paths, record a finding, fix it, and retest.
- Verify security claims and copyable examples against primary guidance and
  this repo's installed Next.js documentation. Preserve Stage 08's focus on
  object-level authorization, with other applicable controls as a scoped pass.
- Port the corrected chapter into a deep-linkable, interactive stage. A reader
  should commit to decisions before the explanation appears and leave with a
  threat model and finding-record shape they can reuse.
- Include the standard AI step, with concrete limits for generated audit output.

## Non-goals

- A full OWASP ASVS assessment: it needs application-specific evidence and would
  bury the first audit under a broad catalog. Link to ASVS for later depth.
- A live vulnerability scanner, database, or authentication service in this
  static site: Stage 08 teaches an audit, while real testing belongs in the
  reader's application.
- Publishing the three gathered OWASP images as the main plate: none shows
  Stage 08's two-user object-ownership test. Keep them as attributed source
  captures in `reference/` until a specific figure needs one.
- The W-6 `security` sheet and W-6.4 glossary/stack hub work: those are separate
  reference deliverables.

## Constraints

- Stage numbers are filing codes. Stage 08 has a cadence, not a predecessor or
  progress rank. Match `web/DESIGN.md` in both themes and the interaction rules
  in `web/PATTERNS.md`.
- Keep the two safe `getInvoice` signatures declared in D-72: Stage 05 passes
  `ownerId`; Stage 08 derives it from the session. Both bind the owner in the
  query. Do not silently harmonize the other chapter.
- Authorization policy can grant access through ownership, a role, or an
  explicit share. For the running invoice example, only the owner can read or
  mutate. The audit must distinguish policy from implementation.
- Server Actions and Route Handlers are entry points, even when the UI hides
  them. The installed Next.js guide at
  `web/node_modules/next/dist/docs/01-app/02-guides/data-security.md:279-291`
  requires checks inside reachable actions; its authentication guide recommends
  a data access layer for centralized checks.
- Use primary sources: [OWASP IDOR Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html),
  [OWASP Threat Modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html),
  [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html),
  [Drizzle SQL](https://orm.drizzle.team/docs/sql), and
  [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security).

## Architecture

### Chapter

Use one small invoice application throughout. The threat model names users,
records, actions, entry points, and the browser-to-server and server-to-database
trust boundaries. Its permission matrix covers owner, other user, anonymous,
and administrator across read, edit, delete, and export. The administrator row
states an explicit policy rather than assuming universal access. A two-user
test sends another user's invoice ID through a reachable action and checks both
the denial and the unchanged record. The finding record includes scope,
reproduction, evidence, impact, remediation, retest, and risk owner.

Correct the SQL, rate-limit, secret-search, HSTS, and scanner claims. Keep
non-applicable controls conditional: a product with no upload endpoint does not
need an upload implementation to finish its audit. Add an `AI in security audit`
subsection that allows assistance with inventory and test drafts but requires
human verification of policy, exploitability, and remediation.

### Interactive port

Register Stage 08 only when all panels are present. Use `Stepper` with short
panels divided by judgment, likely asset scope, trust boundaries, permission
policy, two-user probe, fix/retest, other controls, finding record, AI, done,
and traps. Use a decision exercise for the IDOR probe, an editable or selectable
matrix for permissions, expand-to-reveal controls, and a worked finding record.
Reuse shared components instead of copying disclosure behavior. A user's
choices are local exercise state, not evidence of a real application audit.

Porting the current chapter unchanged was rejected because it would reproduce
the missing artifacts and overbroad claims. A generic Top 10 walkthrough was
rejected because the reader needs a concrete audit procedure for their own
application.

## Testing

- Chapter guard tests pin the required sections, two-user case, permission
  policy, finding fields, and the repaired SQL distinction. Check copyable code
  snippets in a small harness where external services are not needed.
- Port tests render the data-derived matrix, all step IDs, the two-user denial,
  finding fields, and AI limits. For every new product behavior, run RED for
  the expected failure before implementation, then GREEN and a teeth check.
- Run the repo's lint, format, typecheck, unit/DOM tests, production build and
  browser audit. Run the development-console audit once for this stage round.

## Verification

Review every claim against the linked primary sources and installed framework
docs. Inspect every panel in both themes and at the audit suite's responsive
widths. A final whole-branch review checks whether the port teaches the
corrected chapter and whether any example can authorize the wrong user.

## Documentation updates

Record the chosen scope, RED/GREEN evidence, review findings, commit IDs, and
deliberate deferrals in `docs/task.md` and `docs/tracker.md`. Keep the source
ledger for any image actually selected; the current captures stay unregistered
unless a figure needs one.

## Risks

- A plausible-looking example can teach a security defect. Run the two-user
  probe against the same ownership rule that the chapter asks readers to use.
- A scanner result can be mistaken for an authorization verdict. The UI must
  label generated or simulated results and require the policy to be checked.
- The chapter and port duplicate content by design. Finish chapter corrections
  before porting and compare every port panel with its source section.
