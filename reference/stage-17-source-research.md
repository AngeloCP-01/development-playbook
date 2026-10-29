# Stage 17 maintenance source research (2026-10-29)

Research for the canonical [Maintenance chapter](../docs/17-maintenance.md) and a
possible W-6 lookup companion. This record covers dependency changes, debt,
refactoring, deletion and cadence. It does not establish the application's
operational state, implement the interactive stage or register a reference sheet.
The operational supplement below records the provider-specific expiry, retention
and restore checks used by the chapter.

## Interactive adaptation (2026-10-29)

The Stage 17 page in `web/src/features/maintenance/` hand-ports this reviewed
chapter into six lookup panels using existing drills and disclosures. This is
the app's established content duplication; keep chapter and page guidance in
sync. The queue, retirement proposals and restore reports are fictional exercises,
not project operational evidence. The record repeats the chapter's fictional
build-plugin example. Provider claims retain the version and scope recorded below.

The page links Fowler's original quadrant and uses labelled prose paraphrases
of its four categories. It does not publish or modify the retained source image.
No new image, reference sheet or live maintenance operation is included. The
three further-reading entries reuse sources below: Fowler's refactoring workflows,
Google's deprecation chapter and Google SRE's data-integrity guidance.

## Scope and source method

- Read the current chapter and check its strongest maintenance claims.
- Use the following primary-source groups; distinguish documented behavior
  from this playbook's proposed operating rules.
- Verify command meanings against the package-manager version used here.
- Keep uncertain usage and project facts explicit.

All sources below were accessed **2026-10-29**. Product documentation is a moving
reference unless a version is named. No maintenance command that changes
dependencies was executed during this research.

## 1. SemVer describes a declared public API

**Source:** [Semantic Versioning 2.0.0](https://semver.org/).
**Author/organization:** Tom Preston-Werner and SemVer contributors.
**Version:** 2.0.0.

For releases after 1.0.0, compatible fixes increment patch, compatible additions
increment minor and incompatible public-API changes increment major. The
specification requires a declared public API. Version 0.x explicitly has an
unstable API. Its FAQ also discusses accidentally releasing incompatible changes
under the wrong version.

**Chapter correction:** Use the version number to choose review depth, rather
than treating a minor or patch label as proof of compatibility. A green test
suite only covers the behavior that the suite exercises. That last limitation is
an engineering inference, not an additional guarantee in the specification.

## 2. pnpm update and audit have different jobs

**Sources:** [pnpm 10 update](https://pnpm.io/10.x/cli/update) and
[pnpm 10 audit](https://pnpm.io/10.x/cli/audit).
**Author/organization:** pnpm contributors.
**Version:** 10.x documentation; this repository pins and locally reports
**10.33.0**.

`pnpm update` selects versions within declared ranges; `--latest` can cross major
versions. A package selector such as the documentation's `foo@2` example limits
the target major. The audit command checks known security issues. In pnpm 10,
`pnpm audit --fix` adds dependency overrides to force non-vulnerable versions; it
is not merely a report. The local 10.33.0 help confirms these meanings.

**Chapter correction:** Replace the broad framework `@latest` recipe with a
target-version migration procedure. State the selected release family, follow
its migration guide and inspect the resulting manifests and lockfile. Overrides
need compatibility review and a reason to remain. Do not substitute npm commands
into a pnpm checkout without considering its lockfile and tooling.

## 3. npm audit fix can perform an installation

**Source:** [npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit/).
**Author/organization:** npm CLI documentation, npm/GitHub.
**Version:** npm CLI 11 documentation, used to explain npm behavior rather than
the pnpm workflow in this repository.

`npm audit` asks the configured registry about known vulnerabilities. Some
findings need manual review. `npm audit fix` runs an installation internally;
`--force` permits changes outside declared ranges, including major upgrades, and
relaxes other protections. The documented `--dry-run --json` combination previews
the proposed operation. `--audit-level` changes the failure threshold, not the
contents of the report.

**Chapter use:** Explain why copying a forced audit fix into a terminal is a
dependency change requiring review and tests. The report's severity is a triage
input; it does not establish how this application exposes the vulnerable path.
Keep npm behavior separate from pnpm's override-based fix.

## 4. Dependabot proposals need configuration and acceptance checks

**Sources:** GitHub's [Dependabot pull requests](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-pull-requests)
and [options reference](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).
**Author/organization:** GitHub Docs, GitHub, Inc.
**Version:** GitHub.com documentation as accessed.

Grouping is configured; individual dependency PRs are the default. Rules can
select dependency type and update type. Security and version updates have
different triggers: security proposals follow advisories against the default
branch, while version updates follow the configured schedule. The version-update
cap defaults to five open PRs. Security PRs have a separate fixed cap of ten.
GitHub recommends automated tests and acceptance processes before merging.
For pnpm, the Dependabot ecosystem identifier is `npm`.

**Chapter correction:** Replace “Dependabot has grouped them” with a conditional
instruction to inspect or configure grouping. Separate security urgency from the
routine update slot. A bot PR is a proposal, and a PR cap limits review load;
neither establishes that the backlog is harmless or fully visible.

## 5. Renovate has its own queue and automerge controls

**Sources:** Renovate's [configuration options](https://docs.renovatebot.com/configuration-options/)
and [automerge guidance](https://docs.renovatebot.com/key-concepts/automerge/).
**Author/organization:** Renovate maintainers, Mend Renovate.
**Version:** Current documentation as accessed; defaults can change.

`prConcurrentLimit` controls how many PRs remain open; `prHourlyLimit` controls
creation rate. Their documented defaults are ten and two respectively. By
default, vulnerability-alert PRs bypass ordinary schedules and rate limits.
They can have a separate concurrent budget. Automerge guidance expects passing
checks and recommends keeping human review where maintainers want to inspect
the changelog or code.

**Chapter use:** Present Renovate as an alternative with tool-specific controls,
not as another name for Dependabot. A manageable queue needs ownership and a
review policy. Automatic merging is an optional repository decision; it must
respect required reviews and branch rules. This project's explicit permission
requirement for every merge continues to apply.

## 6. Technical debt can be inadvertent

**Source:** [Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html).
**Author:** Martin Fowler.
**Date:** 14 October 2009; reposted 19 November 2014.

Fowler distinguishes prudent from reckless choices and deliberate from
inadvertent debt. A capable team can learn enough while building to discover
that its earlier design imposes avoidable costs. The repayment decision still
depends on the cost of carrying that debt.

**Chapter correction:** Broaden the deliberate-shortcut definition. Record the
observed cost rather than assuming poor intent. Repeated defects, delayed
changes and coupled edits can justify investigation; a third bug does not by
itself prove a particular design is the cause.

**Proposed playbook application:** A debt entry names the affected behavior,
evidence of recurring cost or risk, owner, likely next touch, proposed smallest
improvement and review date. Rank it by consequences and expected return. This
is a practical template inferred from the debt metaphor, not Fowler's prescribed
scoring formula.

## 7. Refactoring includes planned and longer work

**Source:** [Workflows of Refactoring](https://martinfowler.com/articles/workflowsOfRefactoring/fallback.html).
**Author:** Martin Fowler.
**Date:** 8 January 2014.

Fowler describes opportunistic cleanup and preparatory refactoring, alongside
planned and long-term work. Planned effort can address a difficult area that
needs dedicated attention. Larger restructuring can proceed through small
refactorings while the system remains usable. His economic test is whether
later changes will repay the investment.

**Chapter correction:** Retain the preference for relevant cleanup, but remove
“nearly free” and the blanket rejection of standalone work. Establish tests for
the behavior at risk, make a small structural change and rerun them. Where
behavior is poorly understood, first investigate and capture representative
behavior. Avoid promising that tests can prove all behavior unchanged. A
deliberate feature removal changes behavior and belongs in the deletion process.

## 8. Deletion needs evidence about dependents

**Source:** [Software Engineering at Google, chapter 15: Deprecation](https://abseil.io/resources/swe-book/html/ch15.html).
**Author:** Hyrum Wright; edited by Tom Manshreck.
**Organization/date:** Google; book published 2020.

Google describes discovery through code search, dependency analysis, production
logging and runtime sampling. Hidden dependencies may remain even with strong
tooling. Removal needs an owner; migration and preventing new usage are distinct
parts of the work. The chapter also describes controlled, announced temporary
shutdowns to discover unknown dependents. Such exercises require suitable
operational safeguards, rather than casual production experimentation.

**Chapter correction:** Low analytics counts support investigation, not the
claim that the few users will not notice. Check whether instrumentation covers
the feature and relevant usage cycle, investigate integrations and consult
affected owners before choosing retirement. These are proposed small-app
applications of Google's discovery process. Git recovers source code; recovering
data, contracts or a disrupted workflow may need a separate plan.

## 9. Cadence and capacity need local evidence

**Source:** [The Site Reliability Workbook: Eliminating Toil](https://sre.google/workbook/eliminating-toil/).
**Authors:** David Challoner, Joanna Wijntjes, David Huska, Matthew Sartwell,
Chris Coykendall, Chris Schrier, John Looney and Vivek Rau, with contributors
listed in the chapter.
**Organization/date:** Google; workbook published 2018.

Google describes an upper bound of 50% for SRE operational work, while explicitly
warning that its target may not suit another organization. It recommends
identifying and measuring toil and weighing automation's expected savings
against development and maintenance costs.

**Chapter correction:** Treat the weekly half-hour as a starting review slot,
not a claim that it covers every application's needs. Remove the universal 20%
budget. Agree capacity using the queue's age, incident cost, support deadlines
and repeated manual work, then revisit it. These indicators and the weekly slot
are playbook recommendations, not Google requirements. Urgent security or
reliability work should not wait for the calendar slot.

## 10. Expiry, retention and recovery supplement

The parent researcher checked these primary sources on **2026-10-29**:

| Source and owner                                                                                                    | Version or scope                               | Finding supported                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Working with SSL certificates](https://vercel.com/docs/domains/working-with-ssl), Vercel                           | Live provider documentation                    | Vercel attempts renewal for certificates it issues; validation depends on domain configuration. Uploaded certificates have different responsibilities. TLS renewal and domain registration renewal are separate.                         |
| [Branching: restore and recover data](https://neon.com/docs/introduction/branching#restore-and-recover-data), Neon  | Live provider documentation                    | Recovery reaches back only within the project's configured history window, with plan-dependent limits. Verify the actual settings rather than claiming unlimited or uniform backups. A new restore branch can isolate a drill.           |
| [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html), PostgreSQL Global Development Group | PostgreSQL 18 documentation                    | DELETE leaves old row versions; routine vacuuming permits storage reuse. Standard vacuum generally does not return space to the operating system. VACUUM FULL requires an exclusive lock and is unsuitable as a routine cleanup default. |
| [Data Integrity: What You Read Is What You Wrote](https://sre.google/sre-book/data-integrity/), Google SRE          | Site Reliability Engineering, chapter 26, 2016 | Recovery capability needs testing, including restore validation. A backup's existence does not establish end-to-end recovery readiness.                                                                                                  |

**Playbook applications, not provider guarantees:** define retention eligibility
before removal, preview scope, use bounded batches and monitor load. The chapter
replaces its destructive ninety-day SQL recipe with a non-executable example;
no application's retention policy or data schema was established. An isolated
restore drill should restrict access, disable outbound side effects, validate
application access, and measure through reconnection. No production database,
credentials, billing settings or recovery resources were accessed.

## Image provenance and intended use

The original [Technical Debt Quadrant PNG](https://martinfowler.com/bliki/images/techDebtQuadrant.png)
is retained as [stage-17-tech-debt-quadrant.png](stage-17-tech-debt-quadrant.png).
The parent research task downloaded and visually inspected the 46,955-byte
original on 2026-10-29. Author: Martin Fowler. Original article:
[Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html).
Intended use: an attributed, unmodified illustration of deliberate/inadvertent
and prudent/reckless debt in the chapter.

Fowler's [FAQ](https://martinfowler.com/faq.html), accessed 2026-10-29, explicitly
permits illustration reuse with author credit, a link to the original article
and disclosure of changes. This is author permission, not a named standard
license. Keep the credit adjacent to the image and state that it is unchanged.

## Possible W-6 companion

A compact lookup could help the reader choose the next action without repeating
the chapter's explanations. Candidate sections are:

| Lookup need                | Proposed rows                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Triage an update           | Known security issue; supported-version deadline; routine compatible update; coupled migration                |
| Choose the tool operation  | Inspect; update within range; target a migration version; review an audit fix; avoid an unexamined force flag |
| Assess a debt item         | Observed cost; risk; owner; next likely touch; smallest useful change; review date                            |
| Retire a feature           | Evidence coverage; dependents; communication/migration; reversible disable; removal verification              |
| Run the maintenance review | Queue and owners; operational drift; upcoming deadlines; deeper work to schedule                              |

The rows are proposed editorial structure. Any future command examples need
versioned source checks, and any operational checklist needs to distinguish a
generic backend application from this static site. The operational supplement can
support expiry, retention and restore rows if they add enough lookup value. No
W-6 sheet is registered by this record. The quadrant image is a conceptual
teaching aid, not a risk-priority chart or a substitute for a maintenance checklist.

## Verification and limits

Read-only checks run from `web/`, each exit 0: `pnpm --version` returned
**10.33.0**; `pnpm update --help` confirmed range behavior and `--latest`;
`pnpm audit --help` confirmed the override-based `--fix`. The pnpm 10 sources,
rather than the unversioned documentation now describing later major versions,
support the command notes above. No package installation, audit scan, migration
or forced fix was attempted. This is documentation research and does not provide
application test evidence. A humanizer editing pass checked the prose for vague
claims and overstatement.
