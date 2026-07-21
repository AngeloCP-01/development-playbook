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
- **What would hurt if unavailable?** For most applications, less than you would think.

Then focus effort proportionally. An application holding invoices and email addresses has
a genuinely different threat model from one holding health records — and pretending
otherwise means spreading attention so thin that the real risks go unexamined.

### Authorization is the one that matters

For a typical Next.js application, **broken authorization is the most likely serious
vulnerability by a wide margin.** It is easy to introduce, invisible in testing, and
directly exposes user data.

Audit every data access path. For each one, ask: *is the record proven to belong to the
caller?*

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

Put ownership **in the query**, not in an `if` statement after fetching. A check that
follows the fetch can be forgotten, reordered, or skipped in a new code path. A `where`
clause travels with the query wherever it goes.

Enumerate every Server Action and route handler. Confirm each one. This is tedious and it
is the highest-value hour in this document.

Sequential integer IDs make this worse — they let an attacker walk your entire dataset by
incrementing a number. Use UUIDs. They are not a security control by themselves, but they
remove the trivial enumeration path.

### The checks that apply

**Injection.** Drizzle parameterizes queries, so you are largely covered — unless you use
raw SQL with interpolation. Search for it:

```bash
grep -rn "sql\`" src/ | grep -v "sql\`SELECT 1\`"
```

Any interpolated user input in a raw query is a finding.

**XSS.** React escapes by default. The exception is `dangerouslySetInnerHTML`:

```bash
grep -rn "dangerouslySetInnerHTML" src/
```

Every hit needs sanitization with a real library, not a regex. HTML sanitization by
regular expression has never worked and will not start now.

**Secrets in the repository.** Check history, not just the working tree — a key removed
in a later commit is still in the clone.

```bash
git log -p | grep -iE "(api[_-]?key|secret|password|token)\s*[=:]\s*['\"]"
```

If you find one: rotate it first, then clean history. Rotation is what actually fixes the
problem; history cleaning is tidying.

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

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
})

const { success } = await limiter.limit(`login:${ip}`)
if (!success) return new Response('Too many requests', { status: 429 })
```

Without it, a login endpoint is a credential-stuffing target and a password reset endpoint
is a way to make you send spam from your domain.

**Session handling.** Cookies must be `httpOnly`, `secure`, and `sameSite: 'lax'` at
minimum. Sessions must be invalidated on logout and rotated on privilege change — a
session ID that survives a password change means a stolen session survives the response
to it being stolen.

**Password reset.** A common source of real vulnerabilities: tokens must be single-use,
short-lived, cryptographically random, and compared in constant time. Never send a
password in an email, and never reveal whether an address is registered — "if an account
exists, we sent a link" is the correct response.

**File uploads.** Validate type by content rather than extension, cap size, store outside
the application's serving path, and never trust the client-supplied filename. Uploading
`shell.php` should be impossible on a Node stack, but path traversal through a filename
is not.

**Security headers.** Set them in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      ],
    }]
  },
}
```

A Content Security Policy is more work and worth it once the application is stable enough
that the policy will not need constant revision.

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

Automated tools find dependency issues and obvious patterns well. **They do not find
authorization bugs**, because a missing ownership check is indistinguishable from correct
code without knowing the intent. The manual pass above is not optional.

### Write down what you found

Even solo. A short record, per audit: date, what was checked, what was found, what was
fixed, what was accepted as a known risk.

Accepting a risk deliberately is a legitimate decision. Forgetting about it is not.

---

## Artifacts

- A written threat model: data, actions, consequences
- An audit record per pass, including accepted risks
- Rate limiting on abusable endpoints
- Security headers configured
- Fixed findings, with tests where a bug is testable

---

## Definition of done

- [ ] Every data access path verified for ownership, not just authentication
- [ ] Ownership enforced in queries, not post-fetch checks
- [ ] No raw SQL with interpolated user input
- [ ] Every `dangerouslySetInnerHTML` sanitized
- [ ] No secrets in git history; anything found is rotated
- [ ] High and critical dependency vulnerabilities resolved or documented
- [ ] Rate limiting on auth and expensive endpoints
- [ ] Session cookies `httpOnly`, `secure`, `sameSite`; rotated on privilege change
- [ ] Password reset tokens single-use and short-lived
- [ ] Security headers set
- [ ] No stack traces or existence leaks in user-facing errors
- [ ] No credentials in logs
- [ ] Findings recorded, including accepted risks

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

**Auditing the OWASP Top 10 generically instead of your actual application.** Half of it
does not apply to your stack, and the half that matters most — authorization — gets one
line of attention.

**Confusing authentication with authorization.** Knowing who someone is says nothing about
what is theirs. This is the vulnerability that matters most and is stated in the fewest
words.

**Post-fetch ownership checks.** Easy to skip in a new code path. Put it in the `where`.

**Trusting automated scanners.** They will not find your authorization bugs. A clean scan
is not a clean application.

**Removing a leaked secret without rotating it.** The commit is in every clone and every
fork. Rotate first.

**Sequential integer IDs on user-owned records.** Turns one authorization bug into a full
dataset extraction.

**No rate limiting on password reset.** An attacker cannot get in, but they can make your
domain send thousands of emails and get you blacklisted.

**Detailed error messages.** "User not found" versus "wrong password" tells an attacker
which addresses are registered.

**Auditing once.** The audit reflects the code as it was that day. New features introduce
new access paths, and access paths are where the bugs are.
