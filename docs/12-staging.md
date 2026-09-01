# 12. Staging

> A place to see the change running as a real build, at a real URL, before anyone who
> matters can reach it.

**When this actually happens:** Automatically, on every pull request. There is nothing to
schedule — Vercel creates a preview deployment per branch. The work in this stage is
deciding *what to check* on that URL, and understanding what a preview genuinely cannot
tell you.

---

## Entry criteria

- [ ] CI is green ([11 — CI/CD](11-ci-cd.md))
- [ ] The change is complete enough to exercise end to end
- [ ] Preview deploys are producing URLs ([04 — Project Setup](04-project-setup.md))

---

## The work

### Preview deployments are not staging

Worth being precise about, because conflating them causes real mistakes.

A **preview deployment** is per-branch, ephemeral, and automatic. Every pull request gets
one. This is where nearly all pre-production verification happens.

A **staging environment** is a single long-lived deployment tracking a shared branch. It
matters when you need one stable URL to point at — a third party integrating against you,
a stakeholder who cannot handle a new link each time, or a sandbox account with an
external provider.

**Solo, you usually do not need staging.** Preview deployments cover the need, and a
long-lived staging environment is a second production to maintain, with its own drift,
its own broken data, and its own confusing failures. Add it when something concrete
demands a stable URL. Not before.

### Databases for previews

The default question: does the preview point at production data?

**No.** Not once real users exist. A migration tested against production data is a
migration that can destroy production data, and preview environments get treated
casually by definition.

With Neon, branch the database per preview. The Neon–Vercel integration (install
through the Vercel Marketplace or connect an existing Neon account) does this
automatically: on every preview deployment, Neon creates an isolated branch named
`preview/<git-branch>` from your production database, and Vercel injects
`DATABASE_URL` pointing at it — no application code changes needed. When the Git
branch is deleted, the database branch cleans up with it.

Because the branch starts as a copy of production's schema, run migrations during
the build so the preview reflects the changes in that commit:

```bash
# In Vercel's Build Command (Settings → General → Build & Development)
npx prisma migrate deploy && npm run build
```

This is the single highest-value thing in this doc. A per-preview database branch means
you can run destructive migrations, seed weird data, and delete everything — with a
production-shaped dataset and no risk to production.

If branching is unavailable, use a seeded scratch database. A tiny seeded dataset is
worse for catching data-shaped bugs than a branch, but far better than pointing at
production.

### The preview checklist

CI already covered lint, types, tests, and build. Do not repeat machine work by hand.
Check what machines are bad at:

**Does it actually work?** Walk the primary flow the change touches, as a user, in a
browser. Not the code path — the flow.

**Does it work when you are not the happy path?**
- Signed out, then signed in
- A slow network (throttle in devtools — the loading state you never see locally shows up here)
- A narrow viewport, and one wide one
- Empty state: no data, first-run experience
- Error state: kill the network mid-action and watch what the user sees

**Did anything else break?** The change was in billing, but check that the dashboard
still renders. Preview deploys make this cheap; regressions are usually adjacent, not
distant.

**Does it look right?** Not "does it match the mockup" pixel for pixel, but: is text
readable, does nothing overlap, is the tab order sane, does the focus ring exist.

### Seed data that is not sterile

The strongest argument for database branching is that seeded data is always too clean.
Real data has names with apostrophes, empty descriptions, records from 2019, users with
no avatar, and one account with 400 line items that breaks your table layout.

If you must seed, seed hostile:

```ts
// src/db/seed.ts — deliberately awkward
const users = [
  { name: "O'Brien", email: 'test+tag@example.com' },
  { name: '李明', email: 'unicode@example.com' },
  { name: 'A'.repeat(200), email: 'long@example.com' },
  { name: '', email: 'empty-name@example.com' },
]
```

Every one of those has broken a layout or a query somewhere. Seeding `Alice`, `Bob`, and
`Carol` tests nothing.

### Environment variables for previews

Preview deploys often need different credentials from production — a sandbox Stripe
key, a test OAuth provider, a development webhook URL. Vercel scopes environment
variables by environment: **Production**, **Preview**, and **Development**. Set
preview-specific values under the Preview scope so they apply automatically to every
preview deployment without touching production.

The most common "works locally, broken in preview" cause is a missing or wrong
environment variable. Two habits that prevent it:

- When you add a new secret to production, add its preview equivalent in the same
  sitting. A variable that exists only in Production is invisible in every preview,
  and the failure looks like a code bug.
- When a third-party integration offers a sandbox or test mode, use it for previews.
  A preview that hits the live Stripe API is a preview that can charge a real card.

### Password-protect previews

If the product is not public yet, or previews touch anything sensitive, enable Vercel's
deployment protection. Preview URLs are unlisted, not secret — they end up in Slack, in
issue trackers, and occasionally in search indexes.

### AI in staging

An agent can walk a preview URL methodically — every viewport, every state, every
checklist item — without getting bored and without skipping the signed-out check because
it "probably still works." What it cannot do is notice that the empty state feels
confusing, that the loading skeleton implies a layout the page does not deliver, or that
the error message makes sense only to someone who has read the codebase. Mechanical
coverage is the strength; judgment about what a user actually experiences is the gap.

Where it earns its place:

- **Drive the preview checklist** (a browser tool). Open the preview URL, walk the
  primary flow, then walk it signed out, throttled, at 320px and at 2560px. A browser
  MCP does this faster and more consistently than a human, and it does not skip the
  narrow viewport because the feature "is not mobile."
- **Run the smoke suite against the preview URL** (a saved command). `BASE_URL=<url>
  pnpm test:e2e` — the same suite CI runs locally, pointed at the live preview. Catches
  regressions the preview checklist's manual walk would miss.
- **Generate hostile seed data** (a prompt). Describe the schema; ask for seed records
  that break layouts — long names, empty fields, Unicode, null avatars, extreme counts.
  Faster than inventing them by hand, and it produces combinations you would not think
  to try.
- **Diff environment variables across scopes** (a CLI command). `vercel env ls` shows
  what is set for Production, Preview, and Development. A missing Preview variable is
  invisible until the preview fails; listing them side by side surfaces the gap.

Named tools, so this is actionable: `claude-in-chrome` or `playwright` for driving the
preview, `pnpm test:e2e` with `BASE_URL` for the smoke run, `vercel env ls` for the
variable check.

None of this replaces opening the preview yourself and asking "does this feel right."
The two hardest checklist items — "does it actually work" and "did anything else break"
— require noticing what is absent, which is the one thing a mechanical pass cannot do.

---

## Artifacts

- A preview URL attached to every pull request
- An isolated database branch per preview
- A seed script with deliberately awkward data
- Deployment protection enabled where the product is not yet public

---

## Definition of done

- [ ] The preview URL loads and the changed flow works end to end
- [ ] Checked signed-out, empty, and error states
- [ ] Checked one narrow viewport and one wide one
- [ ] Checked one adjacent feature for regressions
- [ ] Any migration ran cleanly against a branched database, not production
- [ ] E2E passed against this preview URL — `BASE_URL=<preview-url> pnpm test:e2e`
      ([11](11-ci-cd.md)). In CI, wire the preview URL from Vercel's
      `repository_dispatch` event (`github.event.client_payload.url`); if deployment
      protection is on, set `x-vercel-protection-bypass` from a
      `VERCEL_AUTOMATION_BYPASS_SECRET` so Playwright can reach the page

---

## Scaling to a team

- **Previews become the review artifact.** "Looks good" on a diff means less than "I
  clicked through the preview." Link the URL in the PR description; make it the norm.
- **Now staging may earn its place** — for cross-team integration testing, or for a QA
  process that needs a stable target.
- **Establish preview data hygiene.** With several engineers, someone will paste real
  customer data into a preview to reproduce a bug. Decide the rule before it happens.
- **Automate visual regression** if UI churn gets high enough that eyeballing every
  preview stops scaling.

---

## Traps

**Treating a preview as proof it works in production.** Previews differ in data volume,
traffic, cache state, and often environment variables. They catch a great deal. They do
not catch "this query is fine on 50 rows and times out on 5 million." That is what
[14 — Post-Deployment Verification](14-post-deployment-verification.md) is for.

**Pointing previews at the production database.** It works, right up until the day it
deletes something. The convenience is not worth the tail risk.

**Sterile seed data.** Clean seeds produce clean-looking UIs that shatter on contact with
real records. Seed hostile.

**Maintaining staging out of habit.** A long-lived staging environment that nobody looks
at still costs money, still drifts from production, and still generates alerts. If it
has no clear purpose, delete it.

**Only checking the thing you changed.** The bug is usually next door.

**Skipping the preview when the change is "too small."** Small changes ship unreviewed
precisely because they seem safe, which is why they cause a disproportionate share of
incidents. Loading the URL takes fifteen seconds.
