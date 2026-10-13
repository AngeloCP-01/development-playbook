# Stage 09 reference companions execution

Date: 2026-10-13. Milestone: W-6.3q.

The user continued after the written four-task plan was presented. Execute the recommended Subagent-Driven method with the previously declared isolated-worktree preference. Plan review/execution authorization is recorded here; no merge, push or production promotion is authorized.

Worktree: `.worktrees/stage-09-reference`.
Branch: `feat/stage-09-reference-companions`, rooted at design head `60f3227`, descended from local `develop` `597fe0b`. The parent planning checkout is preserved.

Plan: [four task implementation](../plans/2026-10-13-stage-09-reference.md).
Spec: [approved reference design](../specs/2026-10-13-stage-09-reference-design.md).
Canonical report: this file. Plan-scoped raw logs, briefs, review packages and recovery ledger live in `.superpowers/sdd/2026-10-13-stage-09-reference/` inside the worktree.

## Baseline setup

Offline install lacked a cached Next.js tarball. The parent checkout's installed dependencies were copied into the worktree with symlinks preserved. The existing links produced copy warnings; a structural comparison confirmed all 1504 symlinks match, with no missing entries. Package versions match the locked baseline; no package or lockfile changed.

### Baseline route typegen and TypeScript

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

Exit: 0.

### Baseline full unit and DOM suite

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  198 passed (198)
      Tests  1459 passed (1459)
   Start at  13:14:34
   Duration  30.34s (transform 12.10s, setup 13.75s, import 34.45s, tests 45.09s, environment 75.76s)

```

Exit: 0. Passed 1459/1459 tests across 198 files.

## Task evidence

Implementation tasks append raw RED/GREEN/teeth output and named failure reasons below. Missing-module collection output is identified as missing implementation; behavioral consumer RED and subsequent isolated teeth establish the relevant guards.

## Task 1 — supporting citations

Implemented the approved additive citation contract and shared ordered helper. Both consumers now render additional-only and combined credits, including URL-less works. The primary source still owns the image plate. No sheets were registered and existing generated Markdown/highlight guards passed unchanged.

The RED failed for the right reason: the helper did not exist, and the unchanged consumers omitted supporting credits. The separate consumer run confirms six behavioral failures: missing additional-only Markdown credit, missing plural Markdown block, missing singular/plural DOM attribution, missing markup-looking plain citation text, and missing supporting policy alongside the existing diagram. The helper collection error alone is not behavioral proof.

### Focused RED — expected exit 1

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/render-citations.test.ts (3 tests | 2 failed) 15ms
   × undrawn additional-only sheets retain the placeholder and their credit in Markdown 12ms
   × Markdown retains every citation in authored order, including URL-less work 2ms
 ❯ |unit| src/lib/cheatsheets/sheet-sources.test.ts (0 test)
 ❯ |dom| src/components/CheatsheetSources.test.tsx (5 tests | 4 failed) 162ms
   × an additional-only undrawn sheet credits its source alongside the placeholder 24ms
   × multiple citations retain their order, URL-less credit, and plural label 39ms
   × markup-looking citation text is displayed as text rather than an image element 4ms
   × supporting citations do not replace the existing primary security diagram 87ms

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/sheet-sources.test.ts [ src/lib/cheatsheets/sheet-sources.test.ts ]
Error: Cannot find module './sheet-sources' imported from /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/lib/cheatsheets/sheet-sources.test.ts
 ❯ src/lib/cheatsheets/sheet-sources.test.ts:3:1
      1| import { expect, test } from 'vitest'
      2| import { CHEATSHEETS } from './index'
      3| import { sheetSources } from './sheet-sources'
       | ^
      4| import type { Cheatsheet, SourceCitation } from './types'
      5|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯


⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/render-citations.test.ts > undrawn additional-only sheets retain the placeholder and their credit in Markdown
AssertionError: expected '# Cheatsheets\n\n<!-- Generated from …' to contain 'Source: Printed guide — Editor.'

- Expected
+ Received

- Source: Printed guide — Editor.
+ # Cheatsheets
+
+ <!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.
+      Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->
+
+ Lookup material rather than reading material. A stage teaches a decision; a
+ sheet answers what that command was.
+
+ Drawn: 0 of 1. A sheet listed as not drawn is
+ registered on purpose — the gap is the point, so it can be seen and filled.
+
+ | Sheet | Group | Stage | Status |
+ |---|---|---|---|
+ | Fixture Credits | Architecture | — | Not drawn |
+
+ ---
+
+ ## Fixture Credits
+
+ Fixture.
+
+ *Not drawn yet.*
+

 ❯ src/lib/cheatsheets/render-citations.test.ts:29:16
     27|   const text = renderCheatsheets()
     28|   expect(text).toContain('*Not drawn yet.*')
     29|   expect(text).toContain('Source: Printed guide — Editor.')
       |                ^
     30| })
     31| test('Markdown retains every citation in authored order, including URL…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  |unit| src/lib/cheatsheets/render-citations.test.ts > Markdown retains every citation in authored order, including URL-less work
AssertionError: expected '# Cheatsheets\n\n<!-- Generated from …' to contain 'Sources:'

- Expected
+ Received

- Sources:
+ # Cheatsheets
+
+ <!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.
+      Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->
+
+ Lookup material rather than reading material. A stage teaches a decision; a
+ sheet answers what that command was.
+
+ Drawn: 1 of 1. A sheet listed as not drawn is
+ registered on purpose — the gap is the point, so it can be seen and filled.
+
+ | Sheet | Group | Stage | Status |
+ |---|---|---|---|
+ | Fixture Credits | Architecture | — | Drawn |
+
+ ---
+
+ ## Fixture Credits
+
+ Fixture.
+
+ ### Section
+
+ - **Decision** — Check it.
+
+ Source: [Primary](https://example.com/one) — One.
+

 ❯ src/lib/cheatsheets/render-citations.test.ts:48:16
     46|   })
     47|   const text = renderCheatsheets()
     48|   expect(text).toContain('Sources:')
       |                ^
     49|   expect(text).toContain('Source: [Primary](https://example.com/one) —…
     50|   expect(text).toContain('Source: Printed guide — Two.')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > an additional-only undrawn sheet credits its source alongside the placeholder
TestingLibraryElementError: Unable to find an element with the text: Source. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"border border-dashed border-line-strong p-10 text-center"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"t-label text-subtle"[39m
        [36m>[39m
          [0mSheet not drawn[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted"[39m
        [36m>[39m
          [0mThis sheet is registered so the gap is visible. The content has not been gathered yet.[0m
        [36m</p>[39m
      [36m</div>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:31:17
     29|   )
     30|   expect(screen.getByText('Sheet not drawn')).toBeTruthy()
     31|   expect(screen.getByText('Source', { exact: true })).toBeTruthy()
       |                 ^
     32|   expect(
     33|     screen.getByRole('link', { name: 'Supporting guide' }).getAttribut…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > multiple citations retain their order, URL-less credit, and plural label
TestingLibraryElementError: Unable to find an element with the text: Sources. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<footer[39m
  [33mclass[39m=[32m"mt-16 border-t border-line pt-6"[39m
[36m>[39m
  [36m<p[39m
    [33mclass[39m=[32m"t-label text-subtle"[39m
  [36m>[39m
    [0mSource[0m
  [36m</p>[39m
  [36m<p[39m
    [33mclass[39m=[32m"mt-2 text-sm leading-relaxed text-muted"[39m
  [36m>[39m
    [36m<a[39m
      [33mclass[39m=[32m"inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-fg"[39m
      [33mhref[39m=[32m"https://example.com/one"[39m
    [36m>[39m
      [0mPrimary[0m
    [36m</a>[39m
    [36m<span>[39m
      [0m — [0m
      [0mOne[0m
    [36m</span>[39m
  [36m</p>[39m
[36m</footer>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:59:25
     57|   )
     58|   const footer = document.querySelector('footer')!
     59|   expect(within(footer).getByText('Sources', { exact: true })).toBeTru…
       |                         ^
     60|   const text = footer.textContent ?? ''
     61|   expect(text.indexOf('Primary')).toBeLessThan(text.indexOf('Printed g…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > markup-looking citation text is displayed as text rather than an image element
TestingLibraryElementError: Unable to find an element with the text: <img src=x onerror=alert(1)>. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"border border-dashed border-line-strong p-10 text-center"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"t-label text-subtle"[39m
        [36m>[39m
          [0mSheet not drawn[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted"[39m
        [36m>[39m
          [0mThis sheet is registered so the gap is visible. The content has not been gathered yet.[0m
        [36m</p>[39m
      [36m</div>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:87:17
     85|     />,
     86|   )
     87|   expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
       |                 ^
     88|   expect(document.querySelector('img, script')).toBeNull()
     89| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > supporting citations do not replace the existing primary security diagram
TestingLibraryElementError: Unable to find an element with the text: Supporting policy. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<p[39m
        [33mclass[39m=[32m"mb-10"[39m
      [36m>[39m
        [36m<a[39m
          [33mclass[39m=[32m"group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-150 hover:text-fg"[39m
          [33mhref[39m=[32m"/stages/08-security-audit"[39m
        [36m>[39m
          [36m<span[39m
            [33mclass[39m=[32m"t-data text-[11px] text-subtle transition-colors duration-150 group-hover:text-brand"[39m
          [36m>[39m
            [0m08[0m
          [36m</span>[39m
          [36m<span[39m
            [33mclass[39m=[32m"t-label text-subtle"[39m
          [36m>[39m
            [0mBelongs to[0m
          [36m</span>[39m
          [36m<span[39m
            [33mclass[39m=[32m"t-ui"[39m
          [36m>[39m
            [0mSecurity Audit[0m
          [36m</span>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-arrow-up-right size-4 text-subtle transition-colors duration-150 group-hover:text-brand"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"M7 7h10v10"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M7 17 17 7"[39m
            [36m/>[39m
          [36m</svg>[39m
        [36m</a>[39m
      [36m</p>[39m
      [36m<div[39m
        [33mclass[39m=[32m"space-y-12"[39m
      [36m>[39m
        [36m<section>[39m
          [36m<h2[39m
            [33mclass[39m=[32m"t-head text-lg"[39m
          [36m>[39m
            [0mName the boundary and policy[0m
          [36m</h2>[39m
          [36m<p[39m
            [33mclass[39m=[32m"mt-2 text-[0.9375rem] leading-relaxed text-muted"[39m
          [36m>[39m
            [0mThe invoice ID is untrusted even after sign-in. The browser crosses a trust boundary at every Server Action and route handler.[0m
          [36m</p>[39m
          [36m<dl[39m
            [33mclass[39m=[32m"mt-5 border-t border-line"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"[39m
            [36m>[39m
              [36m<dt[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"t-ui font-medium text-fg"[39m
                [36m>[39m
                  [0mProtected asset[0m
                [36m</span>[39m
              [36m</dt>[39m
              [36m<dd[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"text-[0.9375rem] leading-relaxed text-fg"[39m
                [36m>[39m
                  [0mInvoice body, billing address, PDF bytes, and the ability to change or delete the record.[0m
                [36m</p>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm leading-relaxed text-muted"[39m
                [36m>[39m
                  [0mInventory what disclosure or modification would harm the customer.[0m
                [36m</p>[39m
              [36m</dd>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"[39m
            [36m>[39m
              [36m<dt[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"t-ui font-medium text-fg"[39m
                [36m>[39m
                  [0mEntry points[0m
                [36m</span>[39m
              [36m</dt>[39m
              [36m<dd[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"text-[0.9375rem] leading-relaxed text-fg"[39m
                [36m>[39m
                  [0mList the read page, update and delete actions, and PDF export handler. Test the endpoint directly even if its button is hidden.[0m
                [36m</p>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm leading-relaxed text-muted"[39m
                [36m>[39m
                  [0mBefore checking code or running a scanner.[0m
                [36m</p>[39m
              [36m</dd>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"[39m
            [36m>[39m
              [36m<dt[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"t-ui font-medium text-fg"[39m
                [36m>[39m
                  [0mPolicy[0m
                [36m</span>[39m
              [36m</dt>[39m
              [36m<dd[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"text-[0.9375rem] leading-relaxed text-fg"[39m
                [36m>[39m
                  [0mOnly the invoice owner may read, update, delete, or export. A support admin needs an explicit grant; a known UUID is not permission.[0m
                [36m</p>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm leading-relaxed text-muted"[39m
                [36m>[39m
                  [0mWrite the expected result before sending test requests.[0m
                [36m</p>[39m
              [36m</dd>[39m
            [36m</div>[39m
          [36m</dl>[39m
        [36m</section>[39m
        [36m<section>[39m
          [36m<h2[39m
            [33mclass[39m=[32m"t-head text-lg"[39m
          [36m>[39m
            [0mProbe with two users[0m
          [36m</h2>[39m
          [36m<p[39m
            [33mclass[39m=[32m"mt-2 text-[0.9375rem] leading-relaxed text-muted"[39m
          [36m>[39m
            [0mCreate User A and User B with separate invoices. Use B’s trusted session with A’s known invoice ID. A should still succeed on A’s own record.[0m
          [36m</p>[39m
          [36m<dl[39m
            [33mc...
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:107:17
    105|   expect(img.getAttribute('height')).toBe('780')
    106|   expect(screen.getByText('Original diagram')).toBeTruthy()
    107|   expect(screen.getByText('Supporting policy')).toBeTruthy()
       |                 ^
    108| })
    109|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯


 Test Files  3 failed | 1 passed (4)
      Tests  6 failed | 18 passed (24)
   Start at  13:17:58
   Duration  1.61s (transform 441ms, setup 281ms, import 591ms, tests 449ms, environment 1.53s)

```

### Separate consumer RED — expected exit 1

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/render-citations.test.ts (3 tests | 2 failed) 15ms
   × undrawn additional-only sheets retain the placeholder and their credit in Markdown 10ms
   × Markdown retains every citation in authored order, including URL-less work 2ms
 ❯ |dom| src/components/CheatsheetSources.test.tsx (5 tests | 4 failed) 174ms
   × an additional-only undrawn sheet credits its source alongside the placeholder 133ms
   × multiple citations retain their order, URL-less credit, and plural label 9ms
   × markup-looking citation text is displayed as text rather than an image element 2ms
   × supporting citations do not replace the existing primary security diagram 27ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/render-citations.test.ts > undrawn additional-only sheets retain the placeholder and their credit in Markdown
AssertionError: expected '# Cheatsheets\n\n<!-- Generated from …' to contain 'Source: Printed guide — Editor.'

- Expected
+ Received

- Source: Printed guide — Editor.
+ # Cheatsheets
+
+ <!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.
+      Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->
+
+ Lookup material rather than reading material. A stage teaches a decision; a
+ sheet answers what that command was.
+
+ Drawn: 0 of 1. A sheet listed as not drawn is
+ registered on purpose — the gap is the point, so it can be seen and filled.
+
+ | Sheet | Group | Stage | Status |
+ |---|---|---|---|
+ | Fixture Credits | Architecture | — | Not drawn |
+
+ ---
+
+ ## Fixture Credits
+
+ Fixture.
+
+ *Not drawn yet.*
+

 ❯ src/lib/cheatsheets/render-citations.test.ts:29:16
     27|   const text = renderCheatsheets()
     28|   expect(text).toContain('*Not drawn yet.*')
     29|   expect(text).toContain('Source: Printed guide — Editor.')
       |                ^
     30| })
     31| test('Markdown retains every citation in authored order, including URL…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  |unit| src/lib/cheatsheets/render-citations.test.ts > Markdown retains every citation in authored order, including URL-less work
AssertionError: expected '# Cheatsheets\n\n<!-- Generated from …' to contain 'Sources:'

- Expected
+ Received

- Sources:
+ # Cheatsheets
+
+ <!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.
+      Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->
+
+ Lookup material rather than reading material. A stage teaches a decision; a
+ sheet answers what that command was.
+
+ Drawn: 1 of 1. A sheet listed as not drawn is
+ registered on purpose — the gap is the point, so it can be seen and filled.
+
+ | Sheet | Group | Stage | Status |
+ |---|---|---|---|
+ | Fixture Credits | Architecture | — | Drawn |
+
+ ---
+
+ ## Fixture Credits
+
+ Fixture.
+
+ ### Section
+
+ - **Decision** — Check it.
+
+ Source: [Primary](https://example.com/one) — One.
+

 ❯ src/lib/cheatsheets/render-citations.test.ts:48:16
     46|   })
     47|   const text = renderCheatsheets()
     48|   expect(text).toContain('Sources:')
       |                ^
     49|   expect(text).toContain('Source: [Primary](https://example.com/one) —…
     50|   expect(text).toContain('Source: Printed guide — Two.')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > an additional-only undrawn sheet credits its source alongside the placeholder
TestingLibraryElementError: Unable to find an element with the text: Source. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"border border-dashed border-line-strong p-10 text-center"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"t-label text-subtle"[39m
        [36m>[39m
          [0mSheet not drawn[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted"[39m
        [36m>[39m
          [0mThis sheet is registered so the gap is visible. The content has not been gathered yet.[0m
        [36m</p>[39m
      [36m</div>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:31:17
     29|   )
     30|   expect(screen.getByText('Sheet not drawn')).toBeTruthy()
     31|   expect(screen.getByText('Source', { exact: true })).toBeTruthy()
       |                 ^
     32|   expect(
     33|     screen.getByRole('link', { name: 'Supporting guide' }).getAttribut…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > multiple citations retain their order, URL-less credit, and plural label
TestingLibraryElementError: Unable to find an element with the text: Sources. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<footer[39m
  [33mclass[39m=[32m"mt-16 border-t border-line pt-6"[39m
[36m>[39m
  [36m<p[39m
    [33mclass[39m=[32m"t-label text-subtle"[39m
  [36m>[39m
    [0mSource[0m
  [36m</p>[39m
  [36m<p[39m
    [33mclass[39m=[32m"mt-2 text-sm leading-relaxed text-muted"[39m
  [36m>[39m
    [36m<a[39m
      [33mclass[39m=[32m"inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-fg"[39m
      [33mhref[39m=[32m"https://example.com/one"[39m
    [36m>[39m
      [0mPrimary[0m
    [36m</a>[39m
    [36m<span>[39m
      [0m — [0m
      [0mOne[0m
    [36m</span>[39m
  [36m</p>[39m
[36m</footer>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:59:25
     57|   )
     58|   const footer = document.querySelector('footer')!
     59|   expect(within(footer).getByText('Sources', { exact: true })).toBeTru…
       |                         ^
     60|   const text = footer.textContent ?? ''
     61|   expect(text.indexOf('Primary')).toBeLessThan(text.indexOf('Printed g…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > markup-looking citation text is displayed as text rather than an image element
TestingLibraryElementError: Unable to find an element with the text: <img src=x onerror=alert(1)>. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"border border-dashed border-line-strong p-10 text-center"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"t-label text-subtle"[39m
        [36m>[39m
          [0mSheet not drawn[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted"[39m
        [36m>[39m
          [0mThis sheet is registered so the gap is visible. The content has not been gathered yet.[0m
        [36m</p>[39m
      [36m</div>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:87:17
     85|     />,
     86|   )
     87|   expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeTruthy()
       |                 ^
     88|   expect(document.querySelector('img, script')).toBeNull()
     89| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > supporting citations do not replace the existing primary security diagram
TestingLibraryElementError: Unable to find an element with the text: Supporting policy. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<p[39m
        [33mclass[39m=[32m"mb-10"[39m
      [36m>[39m
        [36m<a[39m
          [33mclass[39m=[32m"group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-muted transition-colors duration-150 hover:text-fg"[39m
          [33mhref[39m=[32m"/stages/08-security-audit"[39m
        [36m>[39m
          [36m<span[39m
            [33mclass[39m=[32m"t-data text-[11px] text-subtle transition-colors duration-150 group-hover:text-brand"[39m
          [36m>[39m
            [0m08[0m
          [36m</span>[39m
          [36m<span[39m
            [33mclass[39m=[32m"t-label text-subtle"[39m
          [36m>[39m
            [0mBelongs to[0m
          [36m</span>[39m
          [36m<span[39m
            [33mclass[39m=[32m"t-ui"[39m
          [36m>[39m
            [0mSecurity Audit[0m
          [36m</span>[39m
          [36m<svg[39m
            [33maria-hidden[39m=[32m"true"[39m
            [33mclass[39m=[32m"lucide lucide-arrow-up-right size-4 text-subtle transition-colors duration-150 group-hover:text-brand"[39m
            [33mfill[39m=[32m"none"[39m
            [33mheight[39m=[32m"24"[39m
            [33mstroke[39m=[32m"currentColor"[39m
            [33mstroke-linecap[39m=[32m"round"[39m
            [33mstroke-linejoin[39m=[32m"round"[39m
            [33mstroke-width[39m=[32m"2"[39m
            [33mviewBox[39m=[32m"0 0 24 24"[39m
            [33mwidth[39m=[32m"24"[39m
            [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
          [36m>[39m
            [36m<path[39m
              [33md[39m=[32m"M7 7h10v10"[39m
            [36m/>[39m
            [36m<path[39m
              [33md[39m=[32m"M7 17 17 7"[39m
            [36m/>[39m
          [36m</svg>[39m
        [36m</a>[39m
      [36m</p>[39m
      [36m<div[39m
        [33mclass[39m=[32m"space-y-12"[39m
      [36m>[39m
        [36m<section>[39m
          [36m<h2[39m
            [33mclass[39m=[32m"t-head text-lg"[39m
          [36m>[39m
            [0mName the boundary and policy[0m
          [36m</h2>[39m
          [36m<p[39m
            [33mclass[39m=[32m"mt-2 text-[0.9375rem] leading-relaxed text-muted"[39m
          [36m>[39m
            [0mThe invoice ID is untrusted even after sign-in. The browser crosses a trust boundary at every Server Action and route handler.[0m
          [36m</p>[39m
          [36m<dl[39m
            [33mclass[39m=[32m"mt-5 border-t border-line"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"[39m
            [36m>[39m
              [36m<dt[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"t-ui font-medium text-fg"[39m
                [36m>[39m
                  [0mProtected asset[0m
                [36m</span>[39m
              [36m</dt>[39m
              [36m<dd[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"text-[0.9375rem] leading-relaxed text-fg"[39m
                [36m>[39m
                  [0mInvoice body, billing address, PDF bytes, and the ability to change or delete the record.[0m
                [36m</p>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm leading-relaxed text-muted"[39m
                [36m>[39m
                  [0mInventory what disclosure or modification would harm the customer.[0m
                [36m</p>[39m
              [36m</dd>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"[39m
            [36m>[39m
              [36m<dt[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"t-ui font-medium text-fg"[39m
                [36m>[39m
                  [0mEntry points[0m
                [36m</span>[39m
              [36m</dt>[39m
              [36m<dd[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"text-[0.9375rem] leading-relaxed text-fg"[39m
                [36m>[39m
                  [0mList the read page, update and delete actions, and PDF export handler. Test the endpoint directly even if its button is hidden.[0m
                [36m</p>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm leading-relaxed text-muted"[39m
                [36m>[39m
                  [0mBefore checking code or running a scanner.[0m
                [36m</p>[39m
              [36m</dd>[39m
            [36m</div>[39m
            [36m<div[39m
              [33mclass[39m=[32m"grid gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,18rem)_1fr]"[39m
            [36m>[39m
              [36m<dt[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"t-ui font-medium text-fg"[39m
                [36m>[39m
                  [0mPolicy[0m
                [36m</span>[39m
              [36m</dt>[39m
              [36m<dd[39m
                [33mclass[39m=[32m"min-w-0"[39m
              [36m>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"text-[0.9375rem] leading-relaxed text-fg"[39m
                [36m>[39m
                  [0mOnly the invoice owner may read, update, delete, or export. A support admin needs an explicit grant; a known UUID is not permission.[0m
                [36m</p>[39m
                [36m<p[39m
                  [33mclass[39m=[32m"mt-1 text-sm leading-relaxed text-muted"[39m
                [36m>[39m
                  [0mWrite the expected result before sending test requests.[0m
                [36m</p>[39m
              [36m</dd>[39m
            [36m</div>[39m
          [36m</dl>[39m
        [36m</section>[39m
        [36m<section>[39m
          [36m<h2[39m
            [33mclass[39m=[32m"t-head text-lg"[39m
          [36m>[39m
            [0mProbe with two users[0m
          [36m</h2>[39m
          [36m<p[39m
            [33mclass[39m=[32m"mt-2 text-[0.9375rem] leading-relaxed text-muted"[39m
          [36m>[39m
            [0mCreate User A and User B with separate invoices. Use B’s trusted session with A’s known invoice ID. A should still succeed on A’s own record.[0m
          [36m</p>[39m
          [36m<dl[39m
            [33mc...
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:107:17
    105|   expect(img.getAttribute('height')).toBe('780')
    106|   expect(screen.getByText('Original diagram')).toBeTruthy()
    107|   expect(screen.getByText('Supporting policy')).toBeTruthy()
       |                 ^
    108| })
    109|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  2 failed (2)
      Tests  6 failed | 2 passed (8)
   Start at  13:18:00
   Duration  1.00s (transform 152ms, setup 71ms, import 258ms, tests 189ms, environment 464ms)

```

### Focused GREEN and existing renderer/highlight guards — exit 0

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  6 passed (6)
      Tests  33 passed (33)
   Start at  13:18:18
   Duration  1.77s (transform 724ms, setup 274ms, import 1.38s, tests 887ms, environment 1.78s)

```

### DOM teeth — expected exit 1, only additional-only credit test fails

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |dom| src/components/CheatsheetSources.test.tsx (5 tests | 1 failed) 118ms
   × an additional-only undrawn sheet credits its source alongside the placeholder 86ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |dom| src/components/CheatsheetSources.test.tsx > an additional-only undrawn sheet credits its source alongside the placeholder
TestingLibraryElementError: Unable to find an accessible element with the role "link" and name "Supporting guide"

Here are the accessible roles:

  paragraph:

  Name "":
  [36m<p[39m
    [33mclass[39m=[32m"t-label text-subtle"[39m
  [36m/>[39m

  Name "":
  [36m<p[39m
    [33mclass[39m=[32m"mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted"[39m
  [36m/>[39m

  Name "":
  [36m<p[39m
    [33mclass[39m=[32m"t-label text-subtle"[39m
  [36m/>[39m

  Name "":
  [36m<p[39m
    [33mclass[39m=[32m"mt-2 text-sm leading-relaxed text-muted"[39m
  [36m/>[39m

  --------------------------------------------------
  contentinfo:

  Name "":
  [36m<footer[39m
    [33mclass[39m=[32m"mt-16 border-t border-line pt-6"[39m
  [36m/>[39m

  --------------------------------------------------

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"border border-dashed border-line-strong p-10 text-center"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"t-label text-subtle"[39m
        [36m>[39m
          [0mSheet not drawn[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mx-auto mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted"[39m
        [36m>[39m
          [0mThis sheet is registered so the gap is visible. The content has not been gathered yet.[0m
        [36m</p>[39m
      [36m</div>[39m
      [36m<footer[39m
        [33mclass[39m=[32m"mt-16 border-t border-line pt-6"[39m
      [36m>[39m
        [36m<p[39m
          [33mclass[39m=[32m"t-label text-subtle"[39m
        [36m>[39m
          [0mSource[0m
        [36m</p>[39m
        [36m<p[39m
          [33mclass[39m=[32m"mt-2 text-sm leading-relaxed text-muted"[39m
        [36m>[39m
          [36m<a[39m
            [33mclass[39m=[32m"inline-flex min-h-11 items-center underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-fg"[39m
          [36m>[39m
            [0mSupporting guide[0m
          [36m</a>[39m
          [36m<span>[39m
            [0m — [0m
            [0mEditor[0m
          [36m</span>[39m
        [36m</p>[39m
      [36m</footer>[39m
    [36m</div>[39m
  [36m</div>[39m
[36m</body>[39m
 ❯ Object.getElementError node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:76:38
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:52:17
 ❯ node_modules/.pnpm/@testing-library+dom@10.4.1/node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ src/components/CheatsheetSources.test.tsx:33:12
     31|   expect(screen.getByText('Source', { exact: true })).toBeTruthy()
     32|   expect(
     33|     screen.getByRole('link', { name: 'Supporting guide' }).getAttribut…
       |            ^
     34|   ).toBe('https://example.com/guide')
     35|   expect(screen.getByText(/Editor/)).toBeTruthy()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Start at  13:18:38
   Duration  1.03s (transform 119ms, setup 121ms, import 183ms, tests 118ms, environment 525ms)

```

### DOM restored GREEN — exit 0

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  13:18:39
   Duration  868ms (transform 108ms, setup 69ms, import 173ms, tests 156ms, environment 370ms)

```

### Registry teeth — expected exit 1, only duplicate-URL guard fails

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/sheet-sources.test.ts (6 tests | 1 failed) 6ms
   × every authored citation names its work and author, with no duplicate URL or supporting image 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/sheet-sources.test.ts > every authored citation names its work and author, with no duplicate URL or supporting image
AssertionError: incident-management: duplicate https://sre.google/workbook/incident-response/: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/lib/cheatsheets/sheet-sources.test.ts:60:11
     58|           urls.has(citation.url),
     59|           `${sheet.slug}: duplicate ${citation.url}`,
     60|         ).toBe(false)
       |           ^
     61|         urls.add(citation.url)
     62|       }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  13:18:40
   Duration  192ms (transform 79ms, setup 0ms, import 100ms, tests 6ms, environment 0ms)

```

### Registry restored GREEN — exit 0

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  13:18:41
   Duration  390ms (transform 106ms, setup 0ms, import 137ms, tests 3ms, environment 0ms)

```

### Lint — exit 0

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> eslint --max-warnings 0

```

### Route typegen and TypeScript — exit 0

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully
```

### Full project suite — exit 0

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  201 passed (201)
      Tests  1473 passed (1473)
   Start at  13:19:10
   Duration  32.35s (transform 20.15s, setup 15.11s, import 41.71s, tests 54.66s, environment 76.56s)

```

The DOM mutation removed the link target only when the primary source was absent. It failed for the expected reason: no accessible link named "Supporting guide"; the other four tests passed. The duplicate supporting URL mutation failed for the expected reason: `incident-management: duplicate https://sre.google/workbook/incident-response/: expected true to be false`; the other five tests passed. Both mutations were restored before lint, typecheck, and the full suite.

Formatting completed with exit 0; no unrelated tracked file changed. Self-review compared all production edits against the task brief and checked ordered credits, plain React text, optional URLs, singular/plural labels, no empty footer, primary image ownership, and unchanged legacy generated output. No implementation concern found. Independent task review remains controller-owned.

Deferred: new sheet data/registration, generated companion content, live build audits, whole-branch review, merge, push, and deployment belong to later tasks or controller verification.
