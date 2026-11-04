# W-6.4 source research

Assessment date: 2026-11-04. All external sources below were accessed on that date.
Scope: high-impact claims in [stack.md](stack.md), checked against primary sources.
This is a publishing assessment, not a dependency upgrade or infrastructure audit.

## Defaults and this repository

The playbook chooses a stack for new projects. The static site's
[manifest](../web/package.json) records a different, narrower implementation:
Next 16.2.10, React/React DOM 19.2.4, TypeScript `^5`, pnpm 10.33.0,
Node `22.x`, Vitest `^4.1.10`, and jsdom `^30.0.1`. These are manifest declarations,
not a claim about resolved lockfile versions. No database, Redis, Sentry, or Vercel
analytics package appears there. Provider defaults must not imply deployed services
or a backend for this site.

Replace the blanket "this major version or later" policy before publishing the
stack in the hub. A minimum version does not establish compatibility with every
future major. Give defaults a review date, distinguish framework minima from the
chosen supported combination, and check migrations and tool compatibility before
changing majors. `npm view` can identify a release; it cannot validate a stack.
The associated setup example in
[artifacts.ts](../web/src/features/setup/artifacts.ts) repeats the permissive
`@latest`/newer-major guidance and needs a coordinated correction.

## Findings that affect publication

### TypeScript: released, with integration limits

**Source:** Microsoft, Daniel Rosenwasser,
[Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/),
2026-07-08, version 7.0.

TypeScript 7.0 is a released Go-based native compiler, distributed through
`typescript`; calling it merely a preview would be wrong. The release also says
7.0 does not ship a programmatic API and documents running TypeScript 6 alongside
it for consumers such as typescript-eslint. The old native-preview distribution
is not evidence that stable 7.0 remains experimental.

**Publication judgment:** retain the release fact, but do not imply a drop-in
upgrade of this repository or universal build-tool compatibility. The current
manifest still uses TypeScript 5. The unqualified "tens of seconds to low single
digits" claim has no identified project, hardware, or measurement here; remove it
or replace it with a clearly attributed, bounded result. No local benchmark or
Next build using TypeScript 7 was performed. The 7.0 release's discussion of a
future API is not proof of the current status of every later minor release.

### Next and Node: separate minima from support choices

**Sources:** Vercel/Next.js,
[version 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16);
Node.js Release Working Group,
[release schedule](https://github.com/nodejs/Release).

Next 16 documents Node 20.9.0 and TypeScript 5.1.0 minima. Its App Router uses
React Canary features including React 19.2; "React 19 comes with Next" is too
imprecise to explain installed package choices. Keep React and React DOM aligned
and describe the selected combination rather than treating all 19.x releases as
interchangeable.

Node 22 is Maintenance LTS, scheduled to reach end of life on 2027-04-30.
It remains a supportable dated choice, but "22 LTS" hides its remaining lifespan.
The minimum Node version in an older framework guide is not a recommendation to
deploy an otherwise unsupported runtime. These sources establish requirements
and lifecycle dates, not compatibility of every package in this repository.

### pnpm: isolation has deliberate exceptions

**Source:** pnpm maintainers,
[pnpm 10 settings](https://pnpm.io/10.x/settings), dependency hoisting and linker sections.

The default linker is `isolated`, but default hidden hoisting makes undeclared
dependencies accessible to packages inside `node_modules`. Public hoisting can
also expose them to application code. **Revise** the categorical "undeclared
dependencies fail locally" claim: pnpm's default layout helps application code
avoid accidental dependencies, subject to linker and hoisting configuration.
Do not turn this rationale into a universal correctness guarantee.

### Vitest and jsdom: configuration and patch versions matter

**Sources:** Vitest contributors,
[v4 getting started](https://v4.vitest.dev/guide/),
[v4 common errors](https://v4.vitest.dev/guide/common-errors), and
[v4 environments](https://v4.vitest.dev/guide/environment);
jsdom maintainers, Domenic Denicola,
[jsdom 30.0.0 release](https://github.com/jsdom/jsdom/releases/tag/v30.0.0), 2026-07-27.

Vitest 4 documents Node 20+ and Vite 6+; jsdom 30 raises its own Node requirement
to `^22.22.2 || ^24.15.0 || >=26.0.0`. Thus "Node 22" alone does not establish
compatibility with the chosen DOM environment. Vitest supports jsdom, but that
support is not a tested guarantee for every version combination.

**Revise** "TS and path aliases work with no extra config": Vitest's own guide
documents explicit aliases or a tsconfig-paths plugin where needed. Keeping node
and DOM tests in separate projects is a reasonable chosen configuration. This
assessment did not execute tests or propose a runtime upgrade.

### Observability: distinguish products and plan limits

**Sources:** Vercel,
[Web Analytics](https://vercel.com/docs/analytics),
[Speed Insights](https://vercel.com/docs/speed-insights), and
[Runtime Logs](https://vercel.com/docs/logs/runtime).

Web Analytics reports visitors, page views, referrers, and usage; Speed Insights
reports real-user performance. **Split their descriptions.** Current Speed
Insights documentation also makes individual Core Web Vitals access dependent
on Speed Insights Plus, so avoid promising every metric on every plan.

Runtime retention is plan-dependent: the accessed table lists one hour on Hobby,
one day on Pro, three days on Enterprise, and thirty days with Observability Plus.
**Qualify** the short-window claim and link live limits. Choose a drain when
retention/export requirements justify one; don't imply all history requires an
external drain or that a particular provider is already configured here.

## Limits

This pass does not certify every provider, price, library version, or operational
example in the stack. Database preview behavior, hosting guarantees, and other
unreviewed claims need their own primary-source check before substantive new
teaching relies on them. The original 2026-07-21 freshness label also predates
the cited jsdom 30 release; replace it with an honest review date and scope.

## Local runtime observation: TD-47

Read-only checks on **2026-11-04**, in this assessment shell:

- `node --version` reports **v22.19.0**.
- Installed `web/node_modules/jsdom/package.json` reports **30.0.1**, with engines
  **`^22.22.2 || ^24.15.0 || >=26.0.0`**.
- `web/.nvmrc` contains **`22`**; `web/package.json` declares **`22.x`**.
  CI uses `node-version-file: web/.nvmrc`. The current configuration allows a
  Node 22 patch below the installed DOM dependency's declared support floor.
- Installed packages report Next **16.2.10**, TypeScript **5.9.3** and Vitest
  **4.1.10**. Those are local resolutions, distinct from manifest ranges and
  the playbook's starter defaults.

This establishes an engine-support mismatch for this shell, not a reproduced
application failure or proof that CI uses an unsupported patch. Previously
passing checks remain historical evidence; passing does not expand a dependency's
support range. Track remediation as **TD-47**. Before implementation checks,
use a supported runtime and make the Node 22 patch contract explicit across local,
CI and package metadata. Do not silently change the runtime major or upgrade
application packages during this assessment.

## W-6.4 assessment and proposed compact design

**Branch:** `docs/2026-11-04-reference-hub-assessment`, from local develop
**097fdd0f6aea2c4f18ffb7dcd712607915c64590**. Research/coordination recommendation:
**GPT-6 Astra / Low**. The user authorized assessment here. The proposed source
migration and implementation boundary below still need scope approval.

### Current gap and reader tasks

Inspection confirms the original gap remains. The index at
`web/src/app/reference/page.tsx` lists only `CHEATSHEETS`; the dynamic
`reference/[slug]` route resolves only that registry. Sidebar links, sitemap and
production-audit paths are likewise sheet-oriented. No native glossary or stack
page exists. `Term.tsx` provides inline definitions, but does not provide a whole
glossary lookup or link to one.

Two reader tasks justify the addition:

1. Find a named term, read its full definition and follow its associated stage
   when one exists, without having to find an inline use first.
2. Find the playbook's default tool for a concern, its rationale, applicable
   version/support caveats and when to deviate. Recognize that defaults for a
   new project are not an inventory of this static site's deployed services.

Keep these resources beside cheatsheets. They are not stages or sheet placeholders;
adding them must not change the **25/30** sheet count or the eighteen-stage model.

### Alternatives and recommendation

| Approach | Benefit and cost | Recommendation |
| --- | --- | --- |
| Hub links to repository Markdown | Minimal app work and no content duplication, but sends the reader out of the native lookup surface envisioned by W-6.4 | Defer as a fallback; it only partly closes the app-reader gap |
| Native glossary plus separately hand-ported stack | Straightforward rendering, but creates another editable copy of tool choices and version advice | Reject the additional manual stack authority |
| Build-time Markdown/MDX rendering for stack | Keeps stack.md authoritative, but needs a new parsing/rendering/link contract and reverses the original hub's structured-data choice | Do not introduce this pipeline for this bounded task |
| Native pages with structured sources and generated Markdown | Glossary already has this arrangement; stack can follow it while retaining its existing Markdown entry path | Recommend, with explicit approval of the stack source migration |

The [2026-08-14 hub design](../docs/superpowers/specs/2026-08-14-reference-hub-design.md#decisions-taken)
chose structured TypeScript plus generated Markdown (D3), and D-36 makes
`terms.ts` canonical for the glossary. This recommendation
extends that established arrangement to the stack; it does not claim that a prior
decision already approved moving `reference/stack.md`'s authority.

### Routes and discovery

- Add **`/reference/glossary`** and **`/reference/stack`** as ordinary static
  server-rendered pages with metadata and the existing article/type/color tokens.
  Keep `/reference/[slug]` and all current sheet URLs intact.
- Update the hub title/description to cover reference material. Add two clearly
  named resource links before the existing grouped sheet listing. Label the
  existing count as sheets; preserve registered-but-empty language entries.
- Add the same two resources to the existing Reference index in Sidebar. Preserve
  the current mobile drawer close behavior, desktop collapse, labels and
  `aria-current`; do not redesign or extract unrelated navigation behavior.
- Use one tiny client-safe descriptor list, proposed
  `web/src/lib/reference-resources.ts`, for these two titles/paths/descriptions.
  Use it for discovery, sitemap and audit inclusion. Keep stack content and any
  filesystem logic out of the Sidebar's client imports. Do not build a universal
  resource/CMS abstraction.
- Reserve `glossary` and `stack` against cheatsheet slug collisions. Check that
  real built routes, resource declarations, sitemap and audit coverage agree.
  Current SEO/audit tests assume every `/reference/...` URL is a sheet; extend
  that contract rather than dropping or weakening those checks.

The existing Next **16.2.10** installed guides for `page` and `sitemap` were read
for this assessment. They support server-component pages and generated sitemap
entries. No Next API, route or component was changed. The implementer must read
the relevant installed routing/link guides before using or changing those APIs.

### Glossary boundary

Consume the existing `TERMS` data directly. Display entries in the same
name-based alphabetical order as the generated glossary, with full definitions
and the optional `see` stage link. Use stable term keys as unique fragment IDs;
keep the label from `name`. Terms without `see` remain readable without invented
links. Plain definition text should stay plain; do not interpret HTML/Markdown.

Keep every entry available in the static page for browser Find and direct fragment
links. No live search, filtering, pagination, alphabet-picker state, new term
visuals or changes to the inline `Term` popover are needed. A broader search task
remains deferred. `terms.ts` stays canonical and `reference/glossary.md` stays
generated; avoid changing either's content or generator merely to add this page.

### Stack source and publication boundary

Proposed canonical source: **`web/src/lib/stack.ts`**. The server page and a pure
Markdown renderer consume it; **`reference/stack.md`** becomes a generated,
snapshot-guarded document at its existing path. Add an explicit generated-file
notice and update the source-editing instructions. This authority change needs
user approval before implementation.

Model the existing four groups, their **22 choices**, introductory version policy,
five deviation cases and upkeep guidance. Each choice needs a stable ID, concern,
tool, optional version/support note, rationale and applicable source/review details.
Use plain text and explicit stage/source links rather than inline markup strings.
Keep source dates scoped to what was actually reviewed; no bulk "current" label
for unverified providers. This is a bounded stack model, not a generic rich-text
engine. Exact type names are an implementation choice.

The two outputs must preserve the source meaning and links. Carry the entire
existing document through the migration, subject to the specific factual
corrections above: future-major compatibility, TypeScript toolchain/benchmark
limits, Node/jsdom support, pnpm hoisting, Vitest aliases, analytics and log-plan
qualification. Recheck primary sources for any remaining provider promise before
calling it validated guidance. Mark unknown project deployment facts; do not
invent a database, drain or analytics installation for this app.

Retain the existing chosen product families unless the user separately selects a
stack change. Do not upgrade packages or replace Node 22 with another major as a
side effect. Before publication, correct the matching permissive newer-major
note in `web/src/features/setup/artifacts.ts` and search its canonical Stage 04
counterpart. Keep chapter and page guidance consistent, preserve existing command
block invariants and validate any changed operational advice. Do not turn that
alignment into a Stage 04 rewrite or broad dependency cleanup.

No image, command execution widget, live package registry lookup, server fetch,
provider dashboard integration or automatic version updater is proposed. The
site remains a static reader. No exact build-page forecast is used as an
acceptance test; new routes must appear in actual build/audit evidence.

### Risk classification and compact implementation plan

This crosses shared navigation, routing, SEO/audit coverage and a content generator.
Use D-99's consequential-change path: approve this compact design, implement from
a compact plan, use TDD for changed behavior, and review the actual final diff
independently. Static copy/data still uses the established TDD exception.

| Step | Files/interfaces | Acceptance and evidence |
| --- | --- | --- |
| 1. Establish the supported runtime | TD-47: local runtime selection, `web/.nvmrc`, `web/package.json`, CI linkage and `web/src/app/deploy-config.test.ts` | Use a supported Node 22 patch and make the floor explicit. Observe a meaningful failing support/alignment guard, then pass it. Preserve deploy-hook and local/CI/host checks. Record actual runtime and commands; do not claim CI execution from local tests. |
| 2. Single-source the stack | `web/src/lib/stack.ts`, proposed `stack-markdown.ts`/test, `web/package.json` generator script, generated `reference/stack.md`, narrow Stage 04 prose alignment | Establish the intended generator/link/optional-field behavior with failing tests before writing the generator. Both outputs consume one source; keep all existing content except documented source corrections. Snapshot sync, meaningful generated-output/link checks, and current source findings must pass. |
| 3. Add the two resource pages | `web/src/app/reference/glossary/page.tsx`, `stack/page.tsx`, bounded presentational components with render tests | Render actual glossary entries and stack data, optional stage/source links, stable unique fragment IDs, lexical order and complete rationale/caveats. Exercise meaningful absence and safe plain-text behavior with data fixtures; counts alone are insufficient. New pages stay static. |
| 4. Wire discovery and coverage | `reference-resources.ts`, hub `page.tsx`, `Sidebar.tsx` and tests, `sitemap.ts`, `seo.test.ts`, `web/e2e/audit-pages.ts` and spec | Red-to-green tests cover both resources, active navigation, drawer access, preserved stage/sheet links and WIP, slug collisions, sitemap and actual production audit inclusion. New routes cannot silently disappear from audit. No sheet-count inflation. |
| 5. Verify and hand back | Complete branch, source/generator instructions, task/tracker/KICKOFF | Run format, lint, generated-route typecheck, unit/DOM tests, production build and audit once on final inputs. Run dev-console once for shared React/navigation changes. Manually check hub, both pages and representative existing stage/sheet navigation in both themes at narrow/middle/wide widths; keyboard, fragment/Back/reload, overflow, contrast, 44px non-inline targets, console. Obtain one independent final content/page/branch review. |

Avoid tests that simply repeat literal copy or file counts. Retain the glossary
snapshot, current sheets and eighteen-stage guards. Add a source collision guard
and actual-page coverage, not an expectation generated by the same function it
claims to test. If later edits invalidate a check, rerun the affected scope.

### Proposed handoff and limits

**Recommended implementation model:** **GPT-6.1 Sol / High**, fresh user-selected
session under D-100 after scope approval. Start from this assessment branch's
committed tip; record the exact SHA and create `feat/reference-glossary-stack`.
Use the approved compact plan above; no blanket per-task reviews or second full
plan are proposed. TD-47 can be a labelled first commit in this branch so its
runtime prerequisite and W-6.4 scope remain visible.

Return to coordinator **01a18acc-3b54-7202-92f3-404cc94fd0ad** with branch/commit,
actual checks, remaining issues and implementation session ID. Coordinator reads
the thread and actual diff. Ask separately before a no-ff merge into develop;
main promotion remains the user's.

Current counts stay **25 drawn / 30 registered** sheets and **18/18** stages.
No app code, runtime/configuration, stack guidance, glossary data or generated
output is changed by this assessment. No reader study, layout validation, runtime
compatibility test or complete provider audit is claimed. Scope excludes the five
language sheets, search, stage-to-sheet backlinks, term-popover changes, dependency
upgrades and actual infrastructure work. Source findings and the observed engine
mismatch inform the proposed work; they are not implementation results.

Self-review and the humanizer prose pass checked the assessment against the
existing sources, local observations and D-99 boundaries. The glossary and stack
source migrations, runtime repair and routing behavior have not been implemented.

## Scope selected: 2026-11-04

Following assessment **8f722f7** and handoff **a0f40f5**, the user approved the
recommended scope with "proceed": both native reference pages, canonical
`web/src/lib/stack.ts` with generated `reference/stack.md`, and TD-47's Node 22
support-contract repair first. This selection supersedes the pending-approval
statements in the assessment above. The five-step compact plan, acceptance
checks and exclusions are approved unchanged.

Implement in a fresh user-selected **GPT-6.1 Sol / High** session under D-100.
Start from the committed handoff tip of `docs/2026-11-04-reference-hub-assessment`,
record its exact SHA and create `feat/reference-glossary-stack`. KICKOFF carries
the return instructions. Runtime repair, implementation and verification remain
pending; integration needs separate approval.

## Execution notes: 2026-11-04

The user selected "Implement here; override D-100 for this task". Implementation
continues inline from **131c303** on `feat/reference-glossary-stack`; the active
model/effort is unconfirmed. This exception does not change the standing policy.

**Runtime source:** Vercel, [supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions),
accessed 2026-11-04. Vercel documents valid semver ranges and selects a supported
major; minor/patch releases are managed by the host and can differ between build
and function runtime. Use `^22.22.2` for the dependency-compatible Node 22 contract
and `.nvmrc` **22.23.4** for the installed local/CI selection. This does not establish
the hosted patch version or prove a CI/deployment execution.
