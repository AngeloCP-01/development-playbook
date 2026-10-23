# Stage 10 port: held-out reader rerun

Status: both independent browser-only assessments are complete. Completeness found no teaching gaps for the case. Lookup returned **4 HIT / 1 MISFILED**, with one Minor navigation finding; final review will triage it.

The case and questions are byte-identical to the accepted [chapter rerun](2026-10-20-stage-10-correction-rerun.md). Workshop remains the authored example; Toolshare is held out of the port's teaching and tests. Readers receive the two input files and the public Stage 10 URL. Their reports distinguish missing project facts from missing teaching.

## Frozen scenario

```text
Toolshare is a neighborhood tool-lending web app. Members reserve tools and volunteers record pickup and return. One maintainer built it; a second volunteer should be able to run it locally, understand the system boundary, and support a release without private instructions. A change replaces direct reminder-email sending with a durable queue after provider timeouts caused uncertain delivery. The old architectural decision to send directly remains in the repository. The same change adds REMINDER_QUEUE_URL, changes a documented retry option from 3 attempts to 5, and adds a new reminder-status response field. Toolshare wants the smallest useful documentation set and must not publish member contact details or real credentials. No framework, actual commands, URL, credentials, tests, deployment platform or measured incident outcomes are supplied.
```

## Frozen questions

```text
1. A second maintainer cannot run the app from a fresh clone. Where do I find what the setup guide must include and how to verify it?
2. We replaced an earlier architecture decision. What should I write now, and how does a reader discover that the old decision no longer applies?
3. A user needs the exact allowed values and defaults for a retry option. Should that live in a tutorial, reference page or explanation?
4. This change adds configuration and a response field. Which documents need updates, who owns them, and what checks detect drift?
5. An AI assistant drafted documentation claiming a fix was validated. What evidence must I check before publishing it?
```

Input hashes (SHA256):

- Scenario: `7ef08a626ed7ef895139ec396ca1f242e9cc78d89ff3183e8273f37fce13061d`.
- Questions: `45481ff523e07c45917bf4ee8519b2ee6635f9e8e4d2bba2e2c9999a6da59e9b`.

## Method and access

The configured Playwright MCP is the manual browser surface. The in-app browser runtime returned no selectable browser after its documented troubleshooting; that failed discovery is retained. Readers run sequentially because the MCP connections share a browser profile. Each reader closes its owned pages, and the controller clears only any synthetic Stage 10 record left by the first visit before handing over to the second.

Readers may inspect visible panels and controls. Repository source, canonical chapter answers, plans, research notes, other reader reports, hidden application state and network response bodies are excluded. The lookup reader freezes five first-choice panels from rail labels/hints before opening panel bodies. An access failure cannot count as a clean assessment.

## Results and dispositions

The completeness reader (`gpt-6.1-sol/high`, fresh context) assessed all twelve panels and returned no findings. Its actual drafts include a README; replacement ADR with the old record's dated notice and index action; safe configuration/reference examples; a rationale comment; and a documentation/check plan. All five supplied questions are answered with observed panels and controls. Missing Toolshare facts remain explicit placeholders. No command, provider guarantee or recovery result was invented.

The reader exercised all eight planning fields, then cleared its synthetic record. The controller independently observed four empty change fields and a disabled whole-record clear control before closing the page. The lookup reader began afterward and froze all five choices from rail labels before reading any body. It started on 2026-10-22 and completed its report on 2026-10-23 after the interruption. All 567 application hashes remained unchanged; both visits used the same stable production build, `YDyl-9Cl-MRjn8rpkfEza`.

| Question | Frozen first choice | Raw score |
| --- | --- | --- |
| Fresh-clone setup and check | Verify the README | HIT |
| Replacement decision and old-record discovery | Replace a decision | HIT |
| Exact retry values: tutorial, reference or explanation | State exact facts | MISFILED |
| Configuration/response updates, owners and drift checks | Trace the change | HIT |
| Evidence behind AI validation claims | Check the evidence | HIT |

R-M1 (the lookup report's M1), Minor: the explicit document-type distinction is in Choose a document → Look up facts. State exact facts supplies named reference examples, allowed values, defaults, sources and review triggers; the reader still navigated back for the direct comparison. The controller rechecked the public panel and canonical chapter. The teaching exists in both chapter and chooser, so this is a port findability issue, not missing teaching or a missing Toolshare fact. The raw MISFILED score is preserved. Carry R-M1 to final whole-branch triage; no application change has been made for it at this checkpoint.

No Critical or Important reader findings remain. Neither reader had an access failure. Their tool-selector retries and the first reader's clear-confirmation retry are retained in their full reports; the controller independently verified the final empty record. No Toolshare commands or outcomes were invented, and the authored Workshop content and frozen instruments were unchanged.

Literal prompts, full outputs, artifacts, navigation and findings are retained in the [execution archive](evidence/2026-10-20-stage-10-port/README.md): `port-reader-completeness-brief.md`, `port-reader-completeness.md`, `port-reader-lookup-brief.md`, `port-reader-lookup-first-choices.md`, `port-reader-lookup.md` and `reader-between-reset.json`.
