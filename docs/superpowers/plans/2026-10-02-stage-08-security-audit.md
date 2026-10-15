# Stage 08 Security Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the Stage 08 chapter and port its audit workflow into an interactive, deep-linkable stage.

**Architecture:** Finish the chapter first, then build the web panels from its corrected invoice example. Keep security examples and interaction data in small units with render tests for the decisions they produce.

**Tech Stack:** Markdown, Next.js 16 App Router, React 19, TypeScript, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-02-stage-08-security-audit-design.md`

## Global Constraints

- Stage numbers are filing codes; keep Stage 08's cadence.
- The invoice owner is the only permitted reader/editor in the worked example. Other policies must be stated explicitly.
- Actions and handlers verify authorization at their entry point or in a trusted data access layer.
- Use the installed Next.js docs and primary OWASP/Drizzle guidance in the spec.
- Keep the gathered OWASP images unregistered until a specific figure warrants publication.
- Write RED first for every production-code change; keep raw RED and GREEN output in the task report.

## Review Focus

- Other user's invoice ID: denied on read, update, delete, and export; the record remains unchanged.
- Anonymous caller: denied even with a valid invoice ID.
- Administrator: no implicit access to customer invoices without a stated policy.
- UUID: the wrong user's known UUID is denied; ID complexity never substitutes for policy.
- Safe `sql` interpolation and unsafe `sql.raw()` are distinguished in the chapter and port.

---

### Task 1: Correct and complete the chapter

**Files:** Modify `docs/08-security-audit.md`; create `web/src/lib/stage-08-structure.test.ts`.

**Interfaces:** The chapter is the source for Task 2's panel copy. The test reads the Markdown file and asserts its critical headings, scenario, and guidance.

- [ ] Write a failing structure test with assertions for `### AI in security audit`, a permission matrix, a two-user invoice probe, a finding record containing `Evidence`, `Impact`, `Fix`, and `Retest`, `sql.raw()`, and a caveat for `includeSubDomains`.
- [ ] Run `pnpm exec vitest run src/lib/stage-08-structure.test.ts` and preserve the expected missing-content failure.
- [ ] Repair the authorization section. Define the policy first, enumerate entry points, and test owner/other/anonymous/admin over read, update, delete, and export. Keep D-72's session-derived `getInvoice(invoiceId)` signature.
- [ ] Add a compact threat model and one finding record for the same invoice case. Show the failed cross-user request, unchanged record, scoped fix, and successful retest.
- [ ] Repair the SQL, rate-limit, HSTS, secrets, scanner, and conditional-control wording using the primary sources in the spec. Add `### AI in security audit` with verification limits.
- [ ] Run the structure test GREEN; check executable snippets with a small TypeScript or shell harness where no external service is needed. Run a prose humanizer pass without flattening the chapter's voice. Commit the chapter and test.

### Task 2: Port the core audit decisions

**Files:** Create `web/src/features/security-audit/` for `SecurityAudit.tsx`, step data, and focused interaction components; add matching `*.test.tsx` files.

**Interfaces:** Export `function SecurityAudit()` for Task 3's registry. Use shared `Stepper`, `Figure`, `Term`, `RevealList`, and `Card` as appropriate. Step IDs are stable URL hashes.

- [ ] Write failing render tests for the step labels, owner/other/anonymous permission outcomes, a committed two-user IDOR decision, the safe-query explanation, the threat-boundary labels, and the finding-record fields. Include wrong UUID and unchanged-record cases.
- [ ] Run the focused tests RED and preserve the raw output.
- [ ] Build the smallest working components. Keep one judgment per panel, reveal explanations after a committed answer, and make the matrix readable in both themes and at narrow widths.
- [ ] Run focused tests GREEN, deliberately break the ownership outcome, confirm only the regression test fails, restore it, and commit.

### Task 3: Port controls, AI limits, and register the stage

**Files:** Extend `web/src/features/security-audit/`; modify `web/src/lib/stages.ts` and `web/src/features/stage-content.ts`; add focused render tests.

**Interfaces:** The new component is registered at `08-security-audit`; `ready` becomes `true` only with all content, AI, done, and trap panels present.

- [ ] Write failing tests for conditional checks, unsafe SQL identification, rate-limit/HSTS caveats, finding disposition, AI verification limits, all step IDs, and registry readiness.
- [ ] Run them RED and preserve output.
- [ ] Add the remaining panels, then register the stage. Keep source links beside security claims and distinguish the simulated exercise from a real audit result.
- [ ] Run focused tests GREEN, perform a teeth check on one data-derived assertion, and commit.

### Task 4: Whole-stage verification and records

**Files:** Modify `docs/task.md` and `docs/tracker.md`; record review findings in the tracker or a focused review note.

**Interfaces:** No new product API.

- [ ] Compare each web panel with the corrected chapter; resolve omissions and contradictions.
- [ ] Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`, and `pnpm test:dev-console` from `web/`. Distinguish production and development console results.
- [ ] Run a final whole-branch review. Fix Important findings, rerun affected checks, and record what was deferred.
- [ ] Update task/tracker with evidence, current W-3 count, and unmerged branch state; commit separately from the implementation.

## Verification (after all tasks)

The branch is ready for a merge decision only after the chapter's examples and every port panel agree, the repo gate passes, the browser audit covers both themes and responsive widths, the development console is clean, and the final review has no blocking finding. Merge into `develop` only with separate user approval.
