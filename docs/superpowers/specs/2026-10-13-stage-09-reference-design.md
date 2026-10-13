# Stage 09 reference companions

Date: 2026-10-13. Milestone: W-6.3q.

Status: approved 2026-10-13. After the written spec was presented, the user
replied "proceed", approving implementation planning. The practical-guide
scope, content contract, citation support and verification details below are
the planning baseline. Implementation waits for review of the written plan
and selection of its execution method.

## Problem

Stage 09's twelve-panel port is complete on local `develop`, merged as
`7a5576a`. The reader can practice measuring an outcome and choosing a fix,
but cannot consult a related caching or infrastructure-scaling sheet.
`web/src/lib/cheatsheets/index.ts:35` registers twenty drawn sheets and five
language placeholders; neither proposed slug is registered.

The audience is the playbook reader applying that lesson to an application.
Success means the reader can find the applicable cache or routing choice,
its preconditions, its failure mode and the check that would justify keeping
it. The sheets must work as lookups rather than repeat the chapter.

The gathered [source audit](../../../reference/stage-09-performance-sources.md)
supplies first-party references. Its scaling candidates concern infrastructure;
the chapter's "Scaling to a team" section concerns team practice
(`docs/09-performance-optimization.md:231`). The sheet must make that difference
explicit.

## Goals

- Add drawn `caching` and `scaling` sheets through the existing reference hub,
  both tethered to `09-performance-optimization`.
- Make cache eligibility, lifetime and invalidation easy to look up, with
  application-cache and CDN guidance visibly separated.
- Give scaling choices evidence requirements: identify the constrained resource,
  choose a suitable routing policy, and account for overload and failure.
- Include short literal examples where syntax matters; label provider-specific
  behavior and avoid promises of a universal speedup.
- Credit every first-party document used in the web sheets and their generated
  Markdown, rather than keeping supporting citations only in a repo ledger.

## Non-goals

- A broad caching/scaling course is excluded because it would compete with the
  chapter and make common decisions harder to find.
- Stack-only recipes were rejected because a reader also needs to recognize
  whether a recipe fits their workload. Concrete provider examples remain.
- Runtime caching, load balancing, telemetry collection and infrastructure
  configuration are excluded: this site teaches those choices and has no order
  backend to exercise them.
- New interaction components, worksheets, search, copy controls and new hub
  groups are excluded because the current row renderer already fits the lookup.
- Diagrams and image republication are deferred. The initial deliverable is
  structured rows; a diagram would need a separate content and publication case.
- W-6.4, the five language sheets, stage-to-sheet backlinks and older shared
  drill/storage repairs stay separate because they do not deliver these lookups.
- Editing Stage 09's chapter or port is outside this round. A factual issue
  discovered during implementation must be reported rather than silently fixed
  in only one deliverable.
- Merge, push and production promotion are separate decisions, as required by
  the repository's Git conventions.

## Constraints

Use the installed framework docs before writing framework code. Next.js cache
APIs in examples remain teaching content; `web/next.config.ts` is unchanged.
The installed guides for `use cache`, `updateTag` and `revalidateTag` were read
while preparing this spec, alongside current first-party documentation.

Match `web/DESIGN.md`, both themes and the existing reference layout. Stage
interaction rules in `web/PATTERNS.md` do not turn a reference sheet into another
stepper. Explain abbreviations where first used: CDN, TTL, and the meaning of a
latency percentile should not depend on an unavailable glossary page.

TypeScript sheet data remains the content source. Generate
`reference/cheatsheets.md` using `pnpm gen:cheatsheets`; never hand-edit it
(`web/src/lib/cheatsheets/render.ts:5`). Row prose is plain text because
`web/src/components/Cheatsheet.tsx:72` renders it directly. Put API literals in
`code` and snippets in `example`, rather than embedding Markdown syntax in prose.

W-3 stays 15/18. If both new sheets are drawn and registered, W-6 becomes
22 drawn / 27 registered, not 22/25. Actual counts must be rederived after
implementation and integration. No new dependencies are required.

## Architecture

### Sheet structure

Reuse `CheatsheetView`, the registry and existing routes. Add `caching.ts` and
`scaling.ts` beside `web/src/lib/cheatsheets/security.ts`; register both in
`index.ts`. Both use the existing Architecture group. Titles are "Caching"
and "Infrastructure Scaling" so the second sheet cannot be mistaken for the
chapter's team-scaling section.

Use five sections for caching and four for scaling. Each row names a decision
or API, gives its behavior, and states when it applies. Most rows should fit
one or two sentences per field. The implementation plan will carry the full
authored data and tests; this spec fixes the required coverage.

| Caching section | Required lookup content |
|---|---|
| Choose the boundary | Identify reusable work, ownership/tenant scope, key inputs and freshness needs. Shared catalog descriptions are an illustrative candidate; authoritative stock, payment and authorization decisions still require the appropriate current checks. A cache key does not grant access. |
| Set lifetime and tags | Show `cacheComponents: true` as an example prerequisite, async `'use cache'` scope, `cacheLife` and `cacheTag`. Read request-specific values outside that scope. Explain that retention does not guarantee freshness or runtime persistence across hosting environments. |
| Invalidate after a write | Contrast Server Action `updateTag(tag)` with `revalidateTag(tag, 'max')` for tolerated stale reads. Cover the caller boundary and the immediate-expiry alternative for a Route Handler. A write must succeed before invalidation; invalidate the affected tagged reads. |
| Read CDN evidence | Define `CF-Cache-Status` as Cloudflare-specific. Contrast HIT, MISS, BYPASS and DYNAMIC; a miss alone is not a fault. Explain freshness, revalidation and retention separately from Next.js tags. Include a read-only response-header inspection example using an explicitly illustrative URL. |
| Verify the change | Repeat the same user outcome with comparable cold/warm state, workload and sample. Test read-after-write behavior and two-user/tenant isolation. Record correctness, errors and latency, not only the hit rate. |

The invalidation distinctions follow
[updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) and
[revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).
Use the two-argument revalidation API; do not teach its deprecated single-argument
form. For a Route Handler requiring immediate expiry, the documented
`revalidateTag(tag, { expire: 0 })` causes the next matching read to block for
fresh data. None of these examples promises an automatic refresh of every open
browser view.

CDN rows follow [cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/)
and [retention versus freshness](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/).
The example must not imply this playbook is hosted behind Cloudflare or that
`CF-Cache-Status` describes Next.js application-cache entries.

| Scaling section | Required lookup content |
|---|---|
| Locate the limit | Name the affected user outcome, segment, resource and representative workload. Distinguish increasing one instance's capacity, adding replicas, distributing requests and reducing expensive work. More application replicas do not establish more capacity in a shared database. |
| Choose routing | Compare AWS ALB round robin for similar requests/targets, least outstanding requests for differing in-flight work, and weighted random with its optional anomaly mitigation. State that these are ALB choices, not a universal provider algorithm list. Include a read-only target-group attribute inspection example; defer mutation commands. |
| Check health and overload | Explain health-check evidence and ALB fail-open behavior when all registered targets are unhealthy. Include draining/in-flight work, capacity during failure, bounded admission/queues and safe degraded or rejected responses. Account for retry pressure and uncertain side effects before replay. |
| Prove the outcome | Compare the same workload before/after: user latency and errors, limiting-resource utilization, oldest pending work where applicable, failure behavior and cost. Verify the shared dependency and state assumptions before keeping the change. |

ALB conditions follow [target-group attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html)
and [health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html).
Keep the salient caveats close to their algorithm: sticky sessions affect
selection, weighted random does not support sticky sessions, and least
outstanding requests/weighted random do not support slow start. The fail-open
row must avoid promising that unhealthy targets never receive traffic.

Overload guidance follows [Google SRE, Handling Overload](https://sre.google/sre-book/handling-overload/).
There is no universal requests-per-second target or replica count. Any example
numbers are explicitly hypothetical. Routing distributes work; it does not
remove a capacity limit or prove that the user outcome improved.

### Supporting citations

The current `Source` and `Cheatsheet` contracts support one citation
(`web/src/lib/cheatsheets/types.ts:77`), and the web/Markdown footers use only
that entry (`web/src/components/Cheatsheet.tsx:172`,
`web/src/lib/cheatsheets/render.ts:63`). Caching needs both Next.js and Cloudflare;
scaling needs AWS and Google SRE. Crediting one publisher for the combined
sheet or leaving the other sources off the web page would misrepresent it.

Propose one additive extension: `SourceCitation` contains title, author and
optional URL; `Cheatsheet.additionalSources?: SourceCitation[]` lists supporting
text sources. The existing `source` remains the primary citation and the sole
owner of an optional image plate. Additional citations cannot carry images.

A shared `sheetSources(sheet)` helper returns the primary citation followed by
additional citations, or an empty list. It does not invent a source or silently
deduplicate authored entries. Registry guards reject duplicate citation URLs
within a sheet. The web and Markdown renderers consume that same ordered list.
No footer appears for zero citations; one uses "Source", more use "Sources".
Every entry retains its title, author and optional link. Existing single-source
sheets keep their current credit and image behavior.

Caching's primary citation is [Next.js `use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache);
supporting citations are [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife),
[cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag),
`updateTag`, `revalidateTag`, and the two Cloudflare
documents above. Scaling's primary citation is ALB target-group attributes;
supporting citations are ALB health checks and Google SRE Handling Overload.
Record exact URLs and which sections they support in the source ledger.

## Testing

Use TDD for every production change, including the citation helper and renderer.
Preserve raw RED/GREEN output, confirm the failure reason, and perform isolated
teeth checks for the new regression guards. Snapshot regeneration alone is not
proof that the right content or citation rendered.

- Registry/data tests require both Stage 09 tethers, drawn sections, the intended
  cache caller/freshness distinctions, ALB provider labels and fail-open caveat.
  Guard source title/author, URL uniqueness and text-only additional citations.
- Helper tests cover zero, primary-only, additional-only and combined citations
  with stable authored order. Additional-only sheets must still render credits.
- DOM tests render the actual new sheets and check the critical caller caveats,
  source titles/authors/link targets and stage links. Cover absent sources,
  URL-less citations, singular/plural labels and existing primary image behavior.
- Markdown tests prove both sheets, caller caveats and all source credits are
  generated. Keep the committed snapshot in sync and preserve the security
  diagram/text-equivalent test.
- Existing routes, sitemap and audit-route derivation must expose the two new
  URLs through the registry; `web/e2e/audit-pages.ts` already derives them.

## Verification

Run format, lint, `pnpm typecheck`, unit/DOM tests and a fresh production build.
Then run `pnpm test:e2e` against that build and `pnpm test:dev-console` against
its separate development server. Never use `pnpm test:prod` as a local gate.

Inspect both sheets in both themes at 320, 375, 768, 1024, 1440, 1920 and 2560px.
Check every distinct text/background pair for AA contrast, no page overflow,
and at least 44px source-link targets below `lg`. Inspect long API literals,
source titles and examples; any code scrolling stays within its own container.
There is no four-screen stage-panel limit on these lookup sheets.

A cold lookup pass uses concrete questions: "Which invalidation can this
webhook call?", "Does this cache status prove fresh application data?", "Which
ALB algorithm fits uneven in-flight work?", and "Do failed health checks stop
all traffic?" The reader must locate the answer and its caveat from the sheet.
Record misses and repair them before the final whole-branch review.

## Documentation updates

Implementation will update the source audit/ledger with checked references and
the section-to-source mapping. Generate `reference/cheatsheets.md` from the
data. Record tests, review findings, deferrals and actual counts in task/tracker;
refresh KICKOFF at handoff. Document the optional citation field in its type
comments and the existing reference architecture record without rewriting
historical decisions.

This design slice records the approved breadth and written-spec review status
in task/tracker. It leaves both slugs unregistered and W-6 at 20/25.

## Risks

- Similar cache terminology can suggest interchangeable behavior. Separate
  Next.js and CDN sections and test the rendered caller/freshness caveats.
- More citations can expose missing-key or narrow-width defects. Cover the
  shared renderer in DOM tests and both browser build modes.
- Health/routing summaries can hide failure behavior. Keep ALB fail-open and
  algorithm limitations in the lookup rather than only in its source ledger.
- A useful lookup can grow into a second course. Keep each section focused on
  a named choice, its conditions and a verification check; defer taxonomy.
- Provider documentation evolves. Recheck the exact APIs against installed and
  first-party docs before implementation and record the checked date.
