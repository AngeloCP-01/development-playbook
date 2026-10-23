# Stage 10 chapter: initial cold-reader findings

Date: 2026-10-20. Status: baseline assessment, before chapter corrections.
The implementation has not started. This report informs the proposed
[chapter design](../specs/2026-10-20-stage-10-documentation-design.md).

## What the readers saw

Two fresh agents received separate, read-only tasks. The completeness reader
could read only a frozen chapter. The consultability reader first saw only its
navigation headings, froze five heading selections, then read the chapter.
Neither reader received research, specifications, earlier findings, other stage
documents or access to web sources. They could use expertise to judge an answer,
but could not supply missing teaching and call the chapter complete.

The frozen input is the teaching chapter at develop `79f9e31`, reconstructed with:

```bash
git show 79f9e31:docs/10-documentation.md
```

It has 230 lines and SHA-256
`691c6825a6b0e9d37181f84d4fbd20e64cde733e2fc1786a54df5008938c7ca0`.
The working chapter contains the same teaching body, apart from a research-status
notice and a blank line. Its appended research findings were deliberately
excluded: planned corrections must not answer a test of the existing teaching.

The 14 navigation headings exclude headings inside fenced ADR and README
examples. An initial heading extractor included those example headings; it was
corrected before dispatch. The reader received the corrected list.

## Completeness scenario, verbatim

> Toolshare is a neighborhood tool-lending web app. Members reserve tools and volunteers record pickup and return. One maintainer built it; a second volunteer should be able to run it locally, understand the system boundary, and support a release without private instructions. A change replaces direct reminder-email sending with a durable queue after provider timeouts caused uncertain delivery. The old architectural decision to send directly remains in the repository. The same change adds REMINDER_QUEUE_URL, changes a documented retry option from 3 attempts to 5, and adds a new reminder-status response field. Toolshare wants the smallest useful documentation set and must not publish member contact details or real credentials. No framework, actual commands, URL, credentials, tests, deployment platform or measured incident outcomes are supplied.

The reader attempted a README, replacement ADR, configuration example, rationale
comment and documentation-change checklist. Missing project facts were explicitly
separated from chapter gaps. In particular, the reader did not invent startup
commands, queue delivery guarantees, the response field's type or measured fixes.

### Artifact attempt and successful teaching

| Artifact | What the chapter enabled | What remained unknown |
| --- | --- | --- |
| README | Purpose plus running locally, architecture and deployment sections, including rollback/log/support entry points | Toolshare's real commands, prerequisites, boundaries and release procedure are absent scenario facts. |
| Replacement ADR | Context, choice, reasoning, consequences, alternatives, sequential location and preservation of the earlier record | Actual guarantees and evaluated alternatives are absent facts. How readers discover supersession from the old record is not taught. |
| Configuration | An empty `REMINDER_QUEUE_URL` entry in `.env.example` | Actual validation, accepted format and local provisioning are absent facts. The chapter incorrectly presents startup enforcement as inherent. |
| Rationale comment | Explain why uncertain direct delivery prompted the change | No queue guarantee or claim of incident resolution can be inferred. |
| Change checklist | Update setup/deployment material, record decisions, review comments, use a fresh-clone setup attempt | Changed option/response reference, generation checks and safe publication need clearer teaching. |

The report correctly recognized existing ADR format, naming and location as
present. Stage 03's earlier G9 finding concerns that stage's deliberate boundary;
it is not proof that Stage 10 lacks an ADR example.

### Completeness findings and controller disposition

All findings below predate this correction round; the research appendix was not
part of the reader input.

| Reader ID | Severity | Finding and evidence by chapter heading | Disposition |
| --- | --- | --- | --- |
| C1 | Important (blocking) | **Documentation that maintains itself** says `.env.example` makes the app stop booting when it drifts, without identifying validation. | Confirmed. Distinguish documentation from the validator; Stage 04 owns implementation. |
| C2 | Important (blocking) | **What not to write** says to generate or skip exhaustive API documentation; **Definition of done** covers setup changes but provides no complete response-field/option update path. | Confirmed. Teach a small contract reference and explicit generation/review checks, without requiring exhaustive hand-written API docs. |
| C3 | Minor | **Artifacts** protects empty environment values, but gives no publication check for credentials or member data in other examples. | Accept a concise safe-example check within the documentation review. Security audit implementation remains Stage 08's job. |
| C4 | Minor / boundary | **Commit messages are documentation** requires a useful commit body without its own worked specimen. | Do not expand into a second commit-writing lesson. The explicit Stage 05 cross-reference is valid. Clarify conditional use of a body alongside the chapter's other completion checks. |
| X1 | Important (blocking) | **Document decisions, not descriptions** preserves accepted ADRs; **Definition of done** bans documentation about things that no longer exist; **Traps** says to delete aggressively. | Confirmed contradiction. Historical records must be distinguished from current instructions. |
| X2 | Minor | **The rule** limits documentation to why, while **The README** requires exact operational instructions. | Confirmed; the separate source research also establishes the wider reader needs. |

## Consultability questions, verbatim

1. A second maintainer cannot run the app from a fresh clone. Where do I find what the setup guide must include and how to verify it?
2. We replaced an earlier architecture decision. What should I write now, and how does a reader discover that the old decision no longer applies?
3. A user needs the exact allowed values and defaults for a retry option. Should that live in a tutorial, reference page or explanation?
4. This change adds configuration and a response field. Which documents need updates, who owns them, and what checks detect drift?
5. An AI assistant drafted documentation claiming a fix was validated. What evidence must I check before publishing it?

| ID | Frozen heading selection | Baseline result | Observed answer |
| --- | --- | --- | --- |
| S1 | The README | PARTIAL | Setup requirements are here; verification is split between Definition of done and Scaling to a team. |
| S2 | Document decisions, not descriptions | PARTIAL | A new ADR and preserved predecessor are taught; discoverable supersession is incomplete. |
| S3 | No discoverable heading | MISS | No document-type selection or exact-value reference guidance. |
| S4 | Documentation that maintains itself | PARTIAL | Types, tests and configuration are named, but no complete change/owner/check mapping is provided. |
| S5 | Definition of done | MISS | No standard for checking an AI-drafted validation claim. |

Counts: **HIT 0; PARTIAL 3; MISFILED 0; MISS 2**. S1 is Minor; S2–S5
are Important within the agreed chapter-review scope. This is a baseline of
these five questions, not a general numerical quality score for the chapter.

## Reconciliation with the independent source research

The [source research](../../../reference/stage-10-source-research.md) independently
identified the why-only framing, incomplete supersession, drift guarantees and
unsupported Stripe claims. Those source findings remain valid even where the
Toolshare reader could not check vendor behavior without external knowledge.

The Prisma example needs version/configuration context, not a declaration that
the team's preference is factually wrong. A Rust-free option does not eliminate
client generation. It is safer to use a documentation decision in the new worked
case than to turn this chapter into a current ORM comparison.

The ADR definition in `web/src/lib/terms.ts:226` repeats the absolute
never-edit wording. D-47 requires checking the single-sourced glossary when
correcting a concept. Plan that correction and regenerate the glossary; do not
hand-edit the generated Markdown or reroute the term to a placeholder stage.

## Recheck contract

After implementation, dispatch fresh readers with **this exact Toolshare scenario
and these five exact questions**. Give them only the corrected teaching chapter;
withhold this report, the spec, implementation plan and source notes. The new
worked example must use a different scenario so the reader cannot copy it.

The rerun must produce the same artifact attempt and heading selections, record
new findings separately, and check the fix wave after any substantive additions.
Missing project facts remain missing facts. A prose test does not prove an
application can run or that a queue resolves a delivery problem.

Deferred: chapter correction, regression tests, fix-wave reruns, whole-branch
implementation review, interactive port, W-6 publication and integration.
