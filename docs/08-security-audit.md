# 08. Security Audit

> Find the vulnerabilities that actually apply to your application, before someone else
> does.

**When this actually happens:** Before the first public launch, before handling payments
or personal data, and periodically after — roughly quarterly, or after any significant
change to auth or data access.

---

## Entry criteria

- [ ] The application works and is close to being reachable by people who are not you
- [ ] You know what sensitive data you hold
- [ ] Auth is implemented ([03 — Architecture](03-architecture.md))

---

## The work

### Start by naming what you are protecting

An audit without a target becomes a checklist exercise. Write down, specifically:

- **What data would hurt if leaked?** Emails, payment details, private documents,
  messages.
- **What actions would hurt if performed by the wrong person?** Transferring money,
  deleting records, changing an email address, escalating a role.
- **What would hurt if unavailable?** Name the customer action that would stop,
  such as opening an invoice or completing a payment.

Then focus effort proportionally. An application holding invoices and email addresses has
a genuinely different threat model from one holding health records — and pretending
otherwise means spreading attention so thin that the real risks go unexamined.

### Draw the trust boundaries

Use one small invoice application as the audit target. Customers sign in, read and
edit their own invoices, and export a PDF. A support administrator can see invoice
metadata but cannot open the invoice body without an explicit support grant. The
browser crosses a trust boundary when it calls a Server Action or route handler;
the server crosses another when it reads the database or an object store. The
invoice ID in a URL, form, or action argument is untrusted even after sign-in.

| Element | In this application | What to check |
|---|---|---|
| Asset | Invoice body, PDF, billing address | Disclosure or modification hurts the customer |
| Actor | Owner, other customer, anonymous visitor, support admin | Each has a different permission policy |
| Entry point | Page read, update/delete action, PDF export handler | A hidden button does not close the entry point |
| Trust boundary | Browser → server → database/object store | Re-establish identity and permission on the server |

Keep this model beside the audit record. Add flows for payments, uploads, or
third-party services if the application actually has them. A data-flow diagram
can help when the boundaries are harder to see; the table is enough for this
small example.

### Define the permission policy

Broken access control is a leading web risk, but a category ranking cannot tell
you this application's policy. Write the allowed actor, operation, and resource
before inspecting code. For these invoices the owner alone may read, update,
delete, or export. Support access would require a separate, recorded grant.

| Operation | Owner | User B (other customer) | Anonymous | Admin without grant |
|---|---|---|---|---|
| read | allow | deny | deny | deny |
| update | allow | deny | deny | deny |
| delete | allow | deny | deny | deny |
| export | allow | deny | deny | deny |

Audit every data access path against this policy. Ownership is the rule for
user-owned invoices, not a universal rule for public, shared, or team-owned
resources. Those need their own explicit policies. A UUID is an identifier, not
permission: a customer may learn another customer's UUID in a link or a log.

### Test the policy with two users

Create User A and User B, each with an invoice. Sign in as User B and send User
A's invoice ID to the read page, update and delete actions, and PDF export
handler. Each attempt must be denied, and User A's invoice must remain
unchanged. Repeat without a session. A support administrator without a grant
must also be denied. Then confirm User A can perform the allowed operations on
their own invoice. Do this with a real database and a test harness that changes
the trusted session, not by passing `ownerId` from the browser.

| Operation | Probe as User B | Expected result |
|---|---|---|
| read | Open A's invoice URL | No invoice body or existence detail |
| update | Submit A's ID with a changed amount | Denied; amount unchanged |
| delete | Submit A's ID to the delete action | Denied; record unchanged |
| export | Request A's PDF by ID | Denied; no PDF bytes returned |

An authorization test can automate these probes once the policy is written.
It cannot decide whether the policy itself is right. Enumerate every Server
Action and route handler, including ones the UI does not currently show.
Next.js treats reachable actions as direct POST entry points, and a page-level
check does not authorize the action inside that page.

### Put the policy next to the data

```ts
// Vulnerable: authenticated, but not authorized.
export async function getInvoice(invoiceId: string) {
  await requireUser()
  return db.query.invoices.findFirst({ where: eq(invoices.id, invoiceId) })
}
// Any logged-in user can read any invoice by ID.

// Correct: ownership is part of the query.
export async function getInvoice(invoiceId: string) {
  const user = await requireUser()
  return db.query.invoices.findFirst({
    where: and(eq(invoices.id, invoiceId), eq(invoices.ownerId, user.id)),
  })
}
```

Prefer a query scoped to the caller for user-owned records. It prevents an
unauthorized row from being returned to a new caller who forgets a later `if`.
A post-fetch check can be correct when applied before any use, but it is easier
to omit or reorder. Keep the check in a trusted data access function and verify
that each action and handler calls it.

Sequential integer IDs make a missing check easier to exploit at scale. UUIDs
make guessing harder, but the two-user test must still deny a known UUID.

### The checks that apply

**Injection.** Drizzle's query builder and `sql` template turn interpolated
values into parameterized bindings. `sql.raw()` inserts text without escaping. Inspect every
raw insertion and hand-built query, especially when its value can come from a
request. Search for candidate sites:

```bash
rg -n 'sql\.raw\(|db\.execute\(|sql`' src/
```

This search is an inventory, not a verdict:

```ts
sql`select * from invoices where id = ${invoiceId}` // bound value
sql.raw(userSuppliedClause) // unescaped insertion; never use caller text
```

Drizzle parameterizes `invoiceId` in the first line. Do not turn a safe bound
value into a finding because it has `${...}` syntax.

**XSS.** React escapes text by default, but rendering untrusted HTML needs a
separate review. Find the explicit HTML sinks first:

```bash
rg -n 'dangerouslySetInnerHTML' src/
```

For each hit, trace where the HTML came from. Prefer rendering ordinary React
nodes. If untrusted HTML must be rendered, sanitize it with a maintained HTML
sanitizer. A regular expression is not an HTML sanitizer.

**Secrets in the repository.** Check history, not just the working tree — a key removed
in a later commit is still in the clone.

Use repository secret scanning and inspect its history findings. A text search
is only a supplement: names such as `token` produce false positives, while a
key without a recognizable name can be missed. If a live secret is found,
revoke or rotate it promptly, determine where it was used, and plan history
cleanup with the people who share the repository. Rewriting history alone does
not make a copied secret safe.

**Dependencies.**

```bash
pnpm audit --audit-level=high
```

Judge findings by whether the vulnerable path is one you use. A prototype pollution
vulnerability in a build-time-only dependency is not the same as an RCE in your request
path. Fix real ones promptly; do not panic at the noise.

**Rate limiting.** Anything expensive or abusable — login, signup, password reset, email
sending, file upload, search:

```ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
})

// ip must come from your platform's trusted request metadata, not a header
// the caller can supply. Call this inside the login handler before auth work.
export async function checkLoginRate(ip: string): Promise<Response | null> {
  const { success } = await limiter.limit(`login:${ip}`)
  return success ? null : new Response('Too many requests', { status: 429 })
}
```

Without it, a login endpoint is a credential-stuffing target and a password reset endpoint
is a way to make you send spam from your domain. Choose limits for the route's
traffic and abuse model; an IP-only key can punish users behind a shared
network and misses attacks spread across many addresses. Also limit by account
or another stable identifier where that is safe to do without leaking account
existence.

**Session handling.** For a cookie-backed session, use `httpOnly`, `secure` in
production, and an appropriate `sameSite` policy; `lax` is a practical default
for this example. Invalidate the server-side session on logout. Regenerate the
session ID on authentication and privilege change, and revoke existing sessions
when responding to a compromised account or a completed password recovery.

**Password reset.** Tokens must be single-use, short-lived, cryptographically
random, stored securely, and checked without leaking a match through timing.
Never send a password in an email or reveal whether an address is registered.
"If an account exists, we sent a link" is a suitable response. Invalidate
outstanding recovery links and existing sessions after a completed reset.

**File uploads, if the application accepts them.** Allow only needed types;
check extension, MIME type, and file content rather than trusting any one of
them. Cap size, assign a server-generated storage name, and store outside the
application's serving path. Do not use a client-supplied path or filename as a
storage path.

**Security headers.** Set them in `next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=300' },
      ],
    }]
  },
}

export default nextConfig
```

Roll out HSTS with a short lifetime, verify HTTPS on the whole domain, then
increase `max-age`. Before adding `includeSubDomains`, confirm that every
subdomain can serve HTTPS for the stated lifetime; the browser will refuse
HTTP on them. A
Content Security Policy is worth adding and testing against the application's
actual scripts and resources, ideally starting in report-only mode.

**Error messages.** Stack traces and database errors must not reach users. Sentry gets the
detail; the user gets "something went wrong."

Related: do not leak existence. "Not found" for a record the user does not own, never
"Forbidden."

**Logging.** Grep your logs for passwords, tokens, full card numbers, and session IDs.
Logs go to third parties, are retained for a long time, and are read by people who should
not see credentials.

### Tools, and their limits

```bash
pnpm audit --audit-level=high      # dependency vulnerabilities
pnpm dlx snyk test                 # deeper dependency analysis
```

Enable GitHub secret scanning and Dependabot alerts ([11](11-ci-cd.md)).

Automated scanners find dependency issues and some suspicious patterns. A
policy-aware authorization test can also find an object-level failure, as the
two-user probe does. A scanner without this application's permission policy
cannot prove that every access path is authorized. Review the inventory and
the policy as well as the tool output.

### Record and retest a finding

Keep one audit record per pass, even when working alone. Include the date,
scope, entry points checked, test identities, findings, fixes, retests, and
accepted risks. A finding needs enough detail that you can reproduce it after
the original tester is gone. For the invoice case:

| Field | Example |
|---|---|
| Finding | SEC-01: User B can export User A's invoice PDF |
| Scope | `GET /api/invoices/:id/pdf`, tested 2026-10-02 |
| Evidence | User B's session and User A's invoice ID returned PDF bytes; record the request and a redacted response, never a real customer's PDF |
| Impact | Another customer can read invoice and billing details when they learn an ID |
| Fix | Scope the export lookup to the caller's permitted invoices before producing bytes |
| Retest | Same User B request returns no PDF; User A succeeds; User A's stored invoice is unchanged |
| Risk owner | Product owner accepts no open risk; fix before launch |

If the finding is accepted instead of fixed, name the owner, reason, expiry or
review date, and compensating control. Do not mark a failed cross-user
authorization check as accepted just because the identifier is a UUID.

Accepting a risk deliberately is a legitimate decision. Record when it will
be reviewed again.

### AI in security audit

An assistant can draft the entry-point inventory, suggest missing actor rows,
and turn the written permission policy into test cases. Give it synthetic
invoices and redacted requests; keep customer data, secrets, and session
cookies out of prompts. A generated test is only a candidate until you watch
it deny User B and preserve User A's record. You must verify the permission policy,
the finding's impact, and the remediation against the application and its
owners. A convincing report without a reproduced request is not evidence.

The audit procedure above follows [OWASP's IDOR prevention guidance](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html),
[threat-modeling guide](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html),
and [authorization testing guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html).
Check [Next.js data-security guidance](https://nextjs.org/docs/app/guides/data-security)
for Server Actions, [Drizzle's SQL documentation](https://orm.drizzle.team/docs/sql)
for parameter binding, and [OWASP's header guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
before applying examples to a different stack.

---

## Artifacts

- A written threat model: actors, assets, entry points, trust boundaries, consequences
- An explicit permission policy and two-user test record for object operations
- An audit record per pass, including findings, retests, and accepted risks
- Rate limiting on abusable endpoints that exist in the application
- Security headers checked against the deployed domain and resources
- Fixed findings, with tests where a bug is testable

---

## Definition of done

- [ ] Every data access path checked against its resource permission policy
- [ ] User-owned invoice lookups scoped to the caller; other policies stated explicitly
- [ ] Owner, other user, anonymous, and any privileged actor tested across applicable operations
- [ ] Untrusted text never inserted through `sql.raw()` or hand-built SQL
- [ ] Every `dangerouslySetInnerHTML` use traced; untrusted HTML sanitized or removed
- [ ] History secret scanning reviewed; any exposed live secret revoked or rotated
- [ ] High and critical dependency vulnerabilities resolved or documented
- [ ] Rate limiting on existing auth and expensive endpoints, with a trusted key source
- [ ] Cookie-backed sessions use secure attributes and are revoked or renewed as required
- [ ] Password reset tokens single-use and short-lived
- [ ] Security headers verified on the deployed domain, including HSTS subdomains
- [ ] No stack traces or existence leaks in user-facing errors
- [ ] No credentials in logs
- [ ] Findings recorded with evidence, fixes, retests, and accepted-risk owners

---

## Scaling to a team

- **Add security review to the PR checklist** for anything touching auth, data access, or
  user input ([07](07-code-review.md)).
- **Automate the mechanical checks in CI** — secret scanning, dependency audit — so they
  do not depend on someone remembering.
- **Establish a disclosure path.** A `SECURITY.md` with a contact address means a
  researcher can reach you privately instead of publicly.
- **Consider a professional penetration test** once you hold genuinely sensitive data or
  have meaningful revenue. External testers find things you cannot, because you cannot
  un-know your own assumptions.
- **Write authorization tests as a standard**, not a preference ([06](06-testing.md)).

---

## Traps

**Auditing the OWASP Top 10 generically instead of your actual application.**
A category list does not identify this application's assets, entry points, or
permission policy. Use it to prompt a scoped review, not as evidence of one.

**Confusing authentication with authorization.** Knowing who someone is says
nothing about which invoice they may open or change.

**Post-fetch ownership checks.** Easy to skip in a new code path. For user-owned
rows, prefer a caller-scoped query and keep the authorization function central.

**Trusting a generic scan as an authorization audit.** Without the policy and
two-user probes, a clean scan says little about who can read whose records.

**Removing a leaked secret without rotating it.** The commit is in every clone and every
fork. Rotate first.

**Sequential integer IDs on user-owned records.** Turns one authorization bug into a full
dataset extraction.

**No rate limiting on password reset.** The endpoint can be used to send large
volumes of mail and exhaust the service, even when no account is compromised.

**Detailed error messages.** "User not found" versus "wrong password" tells an attacker
which addresses are registered.

**Auditing once.** The audit reflects the code as it was that day. New features introduce
new access paths, and access paths are where the bugs are.
