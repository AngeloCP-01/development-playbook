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

## Task 1 independent review and controller checks

Reviewer: `/root/reference_review_1`, GPT-6.1 Sol/high (repository mid-tier task-review role). Review range `d6abf9f..13f0cb6`.

# Task 1 review — complete supporting citations

## Spec Compliance

- ✅ Spec compliant for Task 1 at `13f0cb65c8678a8d195a6dd095e5db90212950cd`, against base `d6abf9f81b369cf8ab67771541eed81c6b24ecce`. All eight requested production/test files have corresponding hunks; the ninth changed file is the required canonical execution report. No sheets are registered in this task: `web/src/lib/cheatsheets/index.ts:31` adds only the type re-export.
- ⚠️ Cannot verify from this task diff: branch ancestry from develop, the approved spec/plan already carried by the branch, commit trailer, and current clean Git state. The package supplies the commit subject and SHAs, but not these facts. Controller should retain its existing Git evidence; this review ran no Git commands.
- ⚠️ Cannot verify from this task diff: full live-build contrast, responsive behavior, and production/development console checks in both themes. Those remain controller verification after the later content tasks. Existing style classes are retained at `web/src/components/Cheatsheet.tsx:171`, `:178`, and `:183`; that supports layout consistency but is not a browser audit.
- ⚠️ Cross-task milestone totals (W-3 15/18 and eventual W-6 22/27), generated companion content for the two later sheets, and their authored references are outside Task 1. This package makes no registry, chapter, language-sheet, dependency, lockfile, or Next.js configuration change.

## Strengths

- `web/src/lib/cheatsheets/sheet-sources.ts:4` has one responsibility and supplies both consumers with a fresh, ordered array. It preserves duplicate entries rather than hiding authoring mistakes. `sheet-sources.test.ts:37` exercises the order, duplicate retention, and array independence.
- `web/src/components/Cheatsheet.tsx:170` handles zero, one, and multiple credits in one place. React renders citation values as text; no citation HTML parsing is introduced. The DOM tests check the rendered interface, not a mocked renderer (`CheatsheetSources.test.tsx:15`, `:37`, `:70`, `:74`).
- The renderer tests replace registry input while exercising the real Markdown renderer (`render-citations.test.ts:5`, `:11`). Removing the undrawn early return allows attribution to survive without inventing sections or exporting an undrawn original diagram (`render.ts:54`, `:63`).
- The captured mutations fail precisely the intended guards: the additional-only DOM link and authored duplicate URL. Their restored runs pass, supporting the tests' usefulness rather than relying on a green-only report (`docs/superpowers/reports/2026-10-13-stage-09-reference.md:914`, `:1023`, `:1041`, `:1075`).

## Complete evidence checklist

| Criterion | Evidence | Result |
|---|---|---|
| Named text-only citation contract, optional URL | `types.ts:77` defines title, author, and optional URL without an image field; `types.ts:84` retains image ownership on `Source`; `types.ts:97` uses `SourceCitation[]`; `index.ts:31` re-exports it. | ✅ |
| Primary first, supporting credits in authored order | `sheet-sources.ts:5` spreads primary then supporting entries; `sheet-sources.test.ts:37` expects `[primary, supporting, primary]`. DOM order: `CheatsheetSources.test.tsx:37`; Markdown order and explicit credit strings: `render-citations.test.ts:31`. | ✅ |
| Copy the array, do not mutate or deduplicate | Fresh array in `sheet-sources.ts:5`; the test pops the result and verifies unchanged supporting input at `sheet-sources.test.ts:43`. Duplicate primary remains in the expected output at `:41`. | ✅ |
| No invented credit, no empty attribution block | `sheet-sources.test.ts:24` tests absent and empty supporting sources; `Cheatsheet.tsx:170` gates the footer on list length; `CheatsheetSources.test.tsx:70` checks no footer; `render-citations.test.ts:61` checks no singular/plural Markdown block. | ✅ |
| Legacy primary-only credit | `sheet-sources.test.ts:28` preserves the primary object. Existing DOM test `credits the source when a sheet has one` remains unchanged at `Cheatsheet.test.tsx:80`; existing Markdown sync guard remains at `render.test.ts:14`. | ✅ |
| Additional-only sheet, including undrawn placeholder | Helper test at `sheet-sources.test.ts:31`; DOM test at `CheatsheetSources.test.tsx:15` verifies the placeholder, singular label, href, and author; Markdown test at `render-citations.test.ts:21` verifies placeholder plus citation. | ✅ |
| URL-less work retains title and author without a link | `sheet-sources.test.ts:46`; DOM URL-less branch at `Cheatsheet.tsx:188` and test at `CheatsheetSources.test.tsx:37`; Markdown URL-less branch at `render.ts:68` and exact credit assertion at `render-citations.test.ts:50`. | ✅ |
| Singular/plural attribution | `Cheatsheet.tsx:173` chooses `Source`/`Sources`; DOM tests at `CheatsheetSources.test.tsx:15` and `:37`. Markdown adds plural heading only for multiple entries at `render.ts:64`, with tests at `render-citations.test.ts:21`, `:31`, and `:61`. | ✅ |
| DOM and Markdown use the same complete credit list | Both import and call `sheetSources` (`Cheatsheet.tsx:6`; `render.ts:2`, `:63`). Separate real-consumer tests cover additional-only, ordered combined, URL-less, and empty cases. | ✅ |
| Citation text remains React text | JSX values at `Cheatsheet.tsx:185`, `:188`, `:190`; `CheatsheetSources.test.tsx:74` verifies markup-looking title text and absence of `img`/`script` elements. | ✅ |
| Every authored credit names work and author; duplicate URL guard | `sheet-sources.test.ts:52` trims required fields, checks a per-sheet URL set, and rejects supporting images at `:65`. Registry teeth fails on the incident-management duplicate at canonical report `:1042`, with 1 failed/5 passed at `:1062`. | ✅ |
| Existing primary image remains intact with extra credits | Primary-only image condition and attributes remain at `Cheatsheet.tsx:124`, `:145`, `:153`, and `:163`. New DOM test at `CheatsheetSources.test.tsx:90` verifies security SVG path, decorative alt, 640×780 dimensions, original label, and supporting credit together. Markdown image still reads only `source.image` at `render.ts:54`. | ✅ |
| Existing image/Markdown/highlight tests retained | No deletion or modification of legacy test files in the package. Focused GREEN captures 33/33 across six files at canonical report `:896`; existing test names include drawn/undrawn alt behavior (`Cheatsheet.test.tsx:159`, `:170`), security diagram export (`render.test.ts:4`), and generated output sync (`render.test.ts:14`, `generate-highlighted.test.ts:7`). | ✅ |
| Behavioral RED before implementation | Canonical report `:61` contains raw missing-helper RED, 6 failed/18 passed at `:477`; independent consumer RED at `:483` isolates 6 missing-credit failures, 6 failed/2 passed at `:883`. Report `:59` explicitly distinguishes the helper collection error from behavioral evidence. | ✅ |
| Isolated DOM teeth and restored GREEN | Missing accessible `Supporting guide` link at canonical report `:915`; only 1 failed/4 passed at `:1010`; restored 5/5 at `:1024`. Mutation and failure rationale recorded at `:1120`. | ✅ |
| Isolated registry teeth and restored GREEN | Duplicate URL assertion at canonical report `:1042`; only 1 failed/5 passed at `:1062`; restored 6/6 at `:1076`. | ✅ |
| Lint and generated-route typecheck | Captured lint uses `eslint --max-warnings 0` at canonical report `:1087`; typecheck runs `next typegen && tsc --noEmit` and generates route types successfully at `:1096`. Both sections record exit 0. | ✅ |
| Full project tests, clean captured verification output | Canonical report `:1113` records 201 files and 1473 tests passed. GREEN, restored GREEN, lint, and typecheck output examined has no warnings or unexplained errors. Expected RED/teeth failures are identified. | ✅ |
| Formatting and scope | Format completion is recorded at canonical report `:1122`; the package contains only the task's eight requested implementation/test files and canonical report, with no unrelated formatting diff. Raw format output is not included, so the exit claim is report evidence rather than independently captured output. | ✅ within stated evidence limit |
| Generated content remains single-sourced | `render.ts:6` retains generation instructions; no hand-edited `reference/cheatsheets.md` hunk exists; the existing sync test is included in the captured focused guard run. Registry content is unchanged in this task. | ✅ |

Paths abbreviated in the table refer to `web/src/lib/cheatsheets/` except `Cheatsheet*.tsx`, which refer to `web/src/components/`. Canonical report references refer to `docs/superpowers/reports/2026-10-13-stage-09-reference.md`.

## Issues

### Critical

None found.

### Important

None found. No missing task requirement or plan-authored blocking defect identified.

### Minor

None found.

## Review boundaries and checks

- Read the supplied brief, verbatim constraints, implementer report, and review package. Read the diff once; initial tool output truncated the long execution-evidence addition, so retrieved the relevant raw evidence sections from the canonical report rather than regenerating tests.
- One changed-source exception: the diff's `Cheatsheet.tsx` image hunk starts at the tail of the image function region. To assess the explicitly requested primary-image preservation, read only `Cheatsheet.tsx:115` through `:170`, covering its image condition and attributes; no other changed source was reread separately.
- One focused unchanged-code check for the named image/export regression risk: inspected test declarations in the three existing renderer/image/highlight guard files to cite their retained behaviors. No broader codebase crawl.
- Ran no tests, Git commands, mutations, or agents. Only created this requested review artifact.

## Assessment

**Task quality: Approved.** The change is small, additive, and shared between the two renderers. The captured behavioral RED and isolated restored teeth evidence support the key additional-only and duplicate-URL guards; live-build and branch-level checks remain outside this task review.

**Verdict: review clean.** Task commit `13f0cb6`; captured verification is 1473/1473 tests across 201 files, lint and generated-route typecheck clean. Current tree and branch ancestry were not independently inspected. NOT merged, NOT deployed by this review.

Controller resolution: develop ancestry, required trailer and clean tracked head were verified directly. Both approved artifacts are present. Current totals remain15/18 and20/25 because no sheets were registered. Browser/combined-content verification belongs to Task4 and remains pending; that is outside this task's completed gate. The formatting-output limitation is closed by the following fresh controller run.

```text

> web@0.1.0 format:check /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> prettier --check .

Checking formatting...
All matched files use Prettier code style!
```

Exit:0. Task1 review clean, no findings.


## Task 2 execution: caching decision guide

Added the supplied caching lookup and its six data tests and two real-renderer tests. The sheet remains unregistered; runtime configuration and snapshots are unchanged.

RED failed for the expected reason: both suites could not import the missing caching implementation. This was the specified initial missing-implementation RED, not behavioral proof. After implementation, GREEN passed all eight tests. The isolated teeth mutation replaced only `Server Actions only:` with `Route Handlers allowed:` in the updateTag row. Exactly the read-your-own-write unit test failed on the caller restriction; the other five unit tests passed. Restoring the row passed all eight focused tests again.

Humanizer review: reviewed the authored descriptions, definitions, caveats and example labels. No wording changes were justified. The caller restrictions, provider boundaries, authorization and freshness caveats are concrete teaching limits; removing their negative phrasing would change the meaning. The final authored copy remains the brief's copy. All three source files match the supplied source after whitespace normalization.

Self-review: confirmed five sections, stage 09 ownership, all seven citations in authored order, literal example syntax, explicit CDN provider scope and authoritative business checks. No dependencies or runtime APIs were added to the app. The examples remain plain teaching strings.

Deferred: registration, generated reference Markdown, tracker/task/KICKOFF records, independent task review and live-browser/combined-content checks belong to the controller and later tasks. No merge, push or deployment was performed.

### Task 2 red

Command (from `web/`): `pnpm exec vitest run src/lib/cheatsheets/caching.test.ts src/components/CachingReference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/caching.test.ts (0 test)
 ❯ |dom| src/components/CachingReference.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/caching.test.ts [ src/lib/cheatsheets/caching.test.ts ]
Error: Cannot find module './caching' imported from /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/lib/cheatsheets/caching.test.ts
 ❯ src/lib/cheatsheets/caching.test.ts:2:1
      1| import { expect, test } from 'vitest'
      2| import { caching } from './caching'
       | ^
      3| import { sheetSources } from './sheet-sources'
      4| const rows = caching.sections.flatMap((section) => section.rows)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |dom| src/components/CachingReference.test.tsx [ src/components/CachingReference.test.tsx ]
Error: Failed to resolve import "@/lib/cheatsheets/caching" from "src/components/CachingReference.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/components/CachingReference.test.tsx:3:24
  1  |  import { render, screen, within } from "@testing-library/react";
  2  |  import { expect, test } from "vitest";
  3  |  import { caching } from "@/lib/cheatsheets/caching";
     |                           ^
  4  |  import { CheatsheetView } from "./Cheatsheet";
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/components/Ca...
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  no tests
   Start at  13:33:05
   Duration  1.74s (transform 51ms, setup 394ms, import 0ms, tests 0ms, environment 1.02s)


```

Exit: 1.

### Task 2 green

Command (from `web/`): `pnpm exec vitest run src/lib/cheatsheets/caching.test.ts src/components/CachingReference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  13:33:22
   Duration  2.53s (transform 211ms, setup 227ms, import 390ms, tests 612ms, environment 1.19s)


```

Exit: 0.

### Task 2 teeth

Command (from `web/`): `pnpm exec vitest run src/lib/cheatsheets/caching.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/caching.test.ts (6 tests | 1 failed) 9ms
   × read-your-own-write advice distinguishes caller boundaries from tolerated stale reads 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/caching.test.ts > read-your-own-write advice distinguishes caller boundaries from tolerated stale reads
AssertionError: expected 'Route Handlers allowed: expire matchi…' to match /Server Actions only/

- Expected:
/Server Actions only/

+ Received:
"Route Handlers allowed: expire matching entries immediately so the next matching read waits for fresh data."

 ❯ src/lib/cheatsheets/caching.test.ts:21:38
     19| })
     20| test('read-your-own-write advice distinguishes caller boundaries from …
     21|   expect(api('updateTag(tag)').what).toMatch(/Server Actions only/)
       |                                      ^
     22|   expect(api('updateTag(tag)').when).toMatch(/not available in Route H…
     23|   expect(api("revalidateTag(tag, 'max')").what).toMatch(

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  13:33:37
   Duration  260ms (transform 39ms, setup 0ms, import 54ms, tests 9ms, environment 0ms)


```

Exit: 1.

### Task 2 restored

Command (from `web/`): `pnpm exec vitest run src/lib/cheatsheets/caching.test.ts src/components/CachingReference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  13:33:40
   Duration  1.80s (transform 167ms, setup 141ms, import 289ms, tests 243ms, environment 1.04s)


```

Exit: 0.

### Task 2 format

Command (from `web/`): `pnpm format`

```text

> web@0.1.0 format /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> prettier --write .

.prettierrc 26ms (unchanged)
e2e/audit-pages.spec.ts 58ms (unchanged)
e2e/audit-pages.ts 14ms (unchanged)
e2e/audit.spec.ts 91ms (unchanged)
e2e/count-expandables.mjs 31ms (unchanged)
e2e/dev-console.spec.ts 12ms (unchanged)
e2e/global-setup.ts 4ms (unchanged)
e2e/panel-states.ts 12ms (unchanged)
e2e/performance.spec.ts 40ms (unchanged)
e2e/smoke.spec.ts 8ms (unchanged)
eslint.config.mjs 2ms (unchanged)
next.config.ts 2ms (unchanged)
package.json 2ms (unchanged)
playwright.config.ts 2ms (unchanged)
playwright.dev.ts 1ms (unchanged)
playwright.prod.ts 1ms (unchanged)
pnpm-workspace.yaml 4ms (unchanged)
postcss.config.mjs 1ms (unchanged)
skills-lock.json 3ms (unchanged)
src/app/deploy-config.test.ts 6ms (unchanged)
src/app/globals.css 50ms (unchanged)
src/app/layout.tsx 8ms (unchanged)
src/app/page.tsx 9ms (unchanged)
src/app/public-assets.test.ts 4ms (unchanged)
src/app/reference/[slug]/page.tsx 3ms (unchanged)
src/app/reference/page.tsx 7ms (unchanged)
src/app/robots.ts 2ms (unchanged)
src/app/seo.test.ts 10ms (unchanged)
src/app/sitemap.ts 4ms (unchanged)
src/app/stages/[slug]/page.tsx 9ms (unchanged)
src/components/AnnotatedArtifact.tsx 6ms (unchanged)
src/components/artifact.test.ts 2ms (unchanged)
src/components/artifact.ts 2ms (unchanged)
src/components/ArtifactControls.tsx 5ms (unchanged)
src/components/CachingReference.test.tsx 8ms (unchanged)
src/components/Cheatsheet.test.tsx 39ms (unchanged)
src/components/Cheatsheet.tsx 22ms (unchanged)
src/components/CheatsheetSources.test.tsx 9ms (unchanged)
src/components/Figure.tsx 2ms (unchanged)
src/components/InlineCode.test.tsx 4ms (unchanged)
src/components/InlineCode.tsx 2ms (unchanged)
src/components/References.test.tsx 7ms (unchanged)
src/components/References.tsx 4ms (unchanged)
src/components/RevealFacet.source.test.ts 3ms (unchanged)
src/components/RevealFacet.test.tsx 5ms (unchanged)
src/components/RevealFacet.tsx 3ms (unchanged)
src/components/RevealList.test.tsx 21ms (unchanged)
src/components/RevealList.tsx 7ms (unchanged)
src/components/Sidebar.test.tsx 4ms (unchanged)
src/components/Sidebar.tsx 15ms (unchanged)
src/components/stepper-numbering.test.ts 2ms (unchanged)
src/components/Stepper.test.tsx 5ms (unchanged)
src/components/Stepper.tsx 18ms (unchanged)
src/components/TeamNotes.tsx 3ms (unchanged)
src/components/term-visuals.tsx 7ms (unchanged)
src/components/Term.test.tsx 5ms (unchanged)
src/components/Term.tsx 5ms (unchanged)
src/components/ThemeToggle.tsx 3ms (unchanged)
src/components/TitleBlock.tsx 3ms (unchanged)
src/components/ui.tsx 7ms (unchanged)
src/features/architecture/ADRAnatomy.tsx 7ms (unchanged)
src/features/architecture/ai-plays.test.ts 8ms (unchanged)
src/features/architecture/ai-plays.ts 5ms (unchanged)
src/features/architecture/AIArchitecturePlays.tsx 6ms (unchanged)
src/features/architecture/ArchCarryForward.tsx 12ms (unchanged)
src/features/architecture/Architecture.tsx 58ms (unchanged)
src/features/architecture/AuthPaths.tsx 7ms (unchanged)
src/features/architecture/AuthzPatterns.tsx 13ms (unchanged)
src/features/architecture/BoundaryMap.tsx 8ms (unchanged)
src/features/architecture/CharacteristicPicker.tsx 8ms (unchanged)
src/features/architecture/characteristics-store.test.ts 5ms (unchanged)
src/features/architecture/characteristics-store.ts 2ms (unchanged)
src/features/architecture/characteristics.test.ts 12ms (unchanged)
src/features/architecture/characteristics.ts 6ms (unchanged)
src/features/architecture/concurrency.test.ts 10ms (unchanged)
src/features/architecture/concurrency.ts 5ms (unchanged)
src/features/architecture/ContractCost.tsx 2ms (unchanged)
src/features/architecture/contracts.test.ts 19ms (unchanged)
src/features/architecture/contracts.ts 7ms (unchanged)
src/features/architecture/DataFlow.tsx 5ms (unchanged)
src/features/architecture/ddl-sync.test.ts 7ms (unchanged)
src/features/architecture/defer.test.ts 5ms (unchanged)
src/features/architecture/defer.ts 2ms (unchanged)
src/features/architecture/DeferredList.tsx 3ms (unchanged)
src/features/architecture/DeleteBehaviour.tsx 2ms (unchanged)
src/features/architecture/DeploymentStyles.tsx 2ms (unchanged)
src/features/architecture/DomainSketch.tsx 3ms (unchanged)
src/features/architecture/DomainWorksheet.tsx 8ms (unchanged)
src/features/architecture/DriftDiagram.tsx 9ms (unchanged)
src/features/architecture/ERView.tsx 6ms (unchanged)
src/features/architecture/EvolutionNotes.tsx 2ms (unchanged)
src/features/architecture/evolve.test.ts 7ms (unchanged)
src/features/architecture/evolve.ts 4ms (unchanged)
src/features/architecture/ExpandContract.tsx 9ms (unchanged)
src/features/architecture/FitnessExamples.tsx 3ms (unchanged)
src/features/architecture/IdempotencyBlock.tsx 3ms (unchanged)
src/features/architecture/InternalOrganisation.tsx 4ms (unchanged)
src/features/architecture/IsolationLevels.tsx 3ms (unchanged)
src/features/architecture/LockingChoice.tsx 8ms (unchanged)
src/features/architecture/LockingStrategies.tsx 3ms (unchanged)
src/features/architecture/ModelInterrogation.test.tsx 4ms (unchanged)
src/features/architecture/ModelInterrogation.tsx 7ms (unchanged)
src/features/architecture/normal-forms.test.ts 5ms (unchanged)
src/features/architecture/normal-forms.ts 1ms (unchanged)
src/features/architecture/Normalisation.tsx 2ms (unchanged)
src/features/architecture/OneAppCosts.tsx 3ms (unchanged)
src/features/architecture/PartialUniqueIndex.tsx 1ms (unchanged)
src/features/architecture/ResiliencePatterns.tsx 3ms (unchanged)
src/features/architecture/ReversibilityAxis.tsx 5ms (unchanged)
src/features/architecture/ReversibilityTable.tsx 7ms (unchanged)
src/features/architecture/RouteShape.tsx 4ms (unchanged)
src/features/architecture/ScalingMoves.test.tsx 2ms (unchanged)
src/features/architecture/ScalingMoves.tsx 3ms (unchanged)
src/features/architecture/schema-blocks.test.ts 5ms (unchanged)
src/features/architecture/schema-blocks.ts 5ms (unchanged)
src/features/architecture/SchemaInspector.test.tsx 2ms (unchanged)
src/features/architecture/SchemaInspector.tsx 5ms (unchanged)
src/features/architecture/scoring.test.ts 83ms (unchanged)
src/features/architecture/scoring.ts 14ms (unchanged)
src/features/architecture/sketch.test.ts 26ms (unchanged)
src/features/architecture/sketch.ts 11ms (unchanged)
src/features/architecture/soft-delete.test.ts 6ms (unchanged)
src/features/architecture/soft-delete.ts 2ms (unchanged)
src/features/architecture/SoftDelete.tsx 3ms (unchanged)
src/features/architecture/SplitTrigger.tsx 6ms (unchanged)
src/features/architecture/steps.ts 2ms (unchanged)
src/features/architecture/styles.test.ts 7ms (unchanged)
src/features/architecture/styles.ts 4ms (unchanged)
src/features/architecture/SyncAsync.tsx 2ms (unchanged)
src/features/architecture/SystemSketch.tsx 5ms (unchanged)
src/features/architecture/TraceForward.tsx 4ms (unchanged)
src/features/architecture/YourCharacteristics.tsx 3ms (unchanged)
src/features/ci-cd/ai-plays.test.ts 4ms (unchanged)
src/features/ci-cd/ai-plays.ts 3ms (unchanged)
src/features/ci-cd/AIPlays.test.tsx 2ms (unchanged)
src/features/ci-cd/AIPlays.tsx 2ms (unchanged)
src/features/ci-cd/ci-artifact.test.ts 2ms (unchanged)
src/features/ci-cd/ci-artifact.ts 2ms (unchanged)
src/features/ci-cd/CiCd.test.tsx 3ms (unchanged)
src/features/ci-cd/CiCd.tsx 11ms (unchanged)
src/features/ci-cd/dependabot-artifact.test.ts 4ms (unchanged)
src/features/ci-cd/dependabot-artifact.ts 1ms (unchanged)
src/features/ci-cd/doc-source.ts 1ms (unchanged)
src/features/ci-cd/e2e-artifact.test.ts 3ms (unchanged)
src/features/ci-cd/e2e-artifact.ts 1ms (unchanged)
src/features/ci-cd/ordering-exercise.test.ts 5ms (unchanged)
src/features/ci-cd/ordering-exercise.ts 2ms (unchanged)
src/features/ci-cd/OrderingExercise.test.tsx 4ms (unchanged)
src/features/ci-cd/OrderingExercise.tsx 8ms (unchanged)
src/features/ci-cd/prose.test.ts 3ms (unchanged)
src/features/ci-cd/scaling.ts 1ms (unchanged)
src/features/ci-cd/steps.test.ts 1ms (unchanged)
src/features/ci-cd/steps.ts 2ms (unchanged)
src/features/ci-cd/traps.test.ts 3ms (unchanged)
src/features/ci-cd/traps.ts 1ms (unchanged)
src/features/code-review/ai-plays.test.ts 2ms (unchanged)
src/features/code-review/ai-plays.ts 2ms (unchanged)
src/features/code-review/AIPlays.test.tsx 3ms (unchanged)
src/features/code-review/AIPlays.tsx 3ms (unchanged)
src/features/code-review/checklist-items.test.ts 2ms (unchanged)
src/features/code-review/checklist-items.ts 1ms (unchanged)
src/features/code-review/CodeReview.tsx 14ms (unchanged)
src/features/code-review/CodeReviewChecklist.test.tsx 4ms (unchanged)
src/features/code-review/CodeReviewChecklist.tsx 9ms (unchanged)
src/features/code-review/doc-source.ts 2ms (unchanged)
src/features/code-review/done.test.ts 3ms (unchanged)
src/features/code-review/done.ts 2ms (unchanged)
src/features/code-review/pr-template.test.ts 2ms (unchanged)
src/features/code-review/pr-template.ts 1ms (unchanged)
src/features/code-review/prose.test.ts 8ms (unchanged)
src/features/code-review/review-areas.test.ts 3ms (unchanged)
src/features/code-review/review-areas.ts 1ms (unchanged)
src/features/code-review/review-drill.test.ts 3ms (unchanged)
src/features/code-review/review-drill.ts 3ms (unchanged)
src/features/code-review/ReviewDrill.test.tsx 6ms (unchanged)
src/features/code-review/ReviewDrill.tsx 4ms (unchanged)
src/features/code-review/self-review.test.ts 3ms (unchanged)
src/features/code-review/self-review.ts 1ms (unchanged)
src/features/code-review/SelfReviewMatch.test.tsx 5ms (unchanged)
src/features/code-review/SelfReviewMatch.tsx 4ms (unchanged)
src/features/code-review/severity-drill.test.ts 3ms (unchanged)
src/features/code-review/severity-drill.ts 2ms (unchanged)
src/features/code-review/SeverityDrill.test.tsx 5ms (unchanged)
src/features/code-review/SeverityDrill.tsx 4ms (unchanged)
src/features/code-review/steps.test.ts 1ms (unchanged)
src/features/code-review/steps.ts 1ms (unchanged)
src/features/code-review/team.test.ts 2ms (unchanged)
src/features/code-review/team.ts 1ms (unchanged)
src/features/code-review/traps.test.ts 3ms (unchanged)
src/features/code-review/traps.ts 1ms (unchanged)
src/features/development/ai-plays.test.ts 6ms (unchanged)
src/features/development/ai-plays.ts 2ms (unchanged)
src/features/development/AIPlays.test.tsx 2ms (unchanged)
src/features/development/AIPlays.tsx 2ms (unchanged)
src/features/development/artifacts.test.ts 6ms (unchanged)
src/features/development/artifacts.ts 11ms (unchanged)
src/features/development/AuthorizationDrill.test.tsx 8ms (unchanged)
src/features/development/AuthorizationDrill.tsx 5ms (unchanged)
src/features/development/checklist.test.ts 5ms (unchanged)
src/features/development/checklist.ts 6ms (unchanged)
src/features/development/ClientBoundary.test.tsx 6ms (unchanged)
src/features/development/ClientBoundary.tsx 15ms (unchanged)
src/features/development/DevChecklist.test.tsx 18ms (unchanged)
src/features/development/DevChecklist.tsx 8ms (unchanged)
src/features/development/Development.tsx 33ms (unchanged)
src/features/development/doc-source.ts 2ms (unchanged)
src/features/development/loop.test.ts 4ms (unchanged)
src/features/development/loop.ts 2ms (unchanged)
src/features/development/LoopFlow.test.tsx 6ms (unchanged)
src/features/development/LoopFlow.tsx 4ms (unchanged)
src/features/development/prose.test.ts 7ms (unchanged)
src/features/development/snippets.test.ts 3ms (unchanged)
src/features/development/snippets.ts 2ms (unchanged)
src/features/development/steps.test.ts 1ms (unchanged)
src/features/development/steps.ts 1ms (unchanged)
src/features/development/traps.test.ts 2ms (unchanged)
src/features/development/traps.ts 1ms (unchanged)
src/features/discovery/AIWorkflow.tsx 10ms (unchanged)
src/features/discovery/DiscoveryFlow.tsx 7ms (unchanged)
src/features/discovery/OpportunityTree.tsx 5ms (unchanged)
src/features/discovery/PipelineFit.tsx 5ms (unchanged)
src/features/discovery/ProductDiscovery.tsx 8ms (unchanged)
src/features/discovery/QuestionLab.tsx 6ms (unchanged)
src/features/discovery/SeverityScorer.tsx 4ms (unchanged)
src/features/discovery/steps.test.ts 1ms (unchanged)
src/features/discovery/steps.ts 2ms (unchanged)
src/features/discovery/Toolkit.tsx 7ms (unchanged)
src/features/discovery/ValidationLadder.tsx 3ms (unchanged)
src/features/discovery/WorkedExample.tsx 5ms (unchanged)
src/features/discovery/Worksheet.tsx 9ms (unchanged)
src/features/incident-management/IncidentChecklist.tsx 5ms (unchanged)
src/features/incident-management/IncidentManagement.tsx 1ms (unchanged)
src/features/incident-management/NudgeRehearsal.tsx 7ms (unchanged)
src/features/incident-management/panels-followup.tsx 10ms (unchanged)
src/features/incident-management/panels-response.tsx 19ms (unchanged)
src/features/incident-management/steps.ts 2ms (unchanged)
src/features/observability/ai-plays.test.ts 7ms (unchanged)
src/features/observability/ai-plays.ts 5ms (unchanged)
src/features/observability/AIPlays.test.tsx 3ms (unchanged)
src/features/observability/AIPlays.tsx 9ms (unchanged)
src/features/observability/alert-triage.test.ts 6ms (unchanged)
src/features/observability/alert-triage.ts 5ms (unchanged)
src/features/observability/artifacts.test.ts 7ms (unchanged)
src/features/observability/artifacts.ts 11ms (unchanged)
src/features/observability/checklist.test.ts 9ms (unchanged)
src/features/observability/checklist.ts 2ms (unchanged)
src/features/observability/doc-source.ts 1ms (unchanged)
src/features/observability/drill-types.ts 2ms (unchanged)
src/features/observability/Drill.test.tsx 6ms (unchanged)
src/features/observability/Drill.tsx 7ms (unchanged)
src/features/observability/log-levels.test.ts 5ms (unchanged)
src/features/observability/log-levels.ts 2ms (unchanged)
src/features/observability/Observability.test.tsx 6ms (unchanged)
src/features/observability/Observability.tsx 1ms (unchanged)
src/features/observability/ObservabilityChecklist.test.tsx 5ms (unchanged)
src/features/observability/ObservabilityChecklist.tsx 6ms (unchanged)
src/features/observability/panels-act.test.tsx 6ms (unchanged)
src/features/observability/panels-act.tsx 21ms (unchanged)
src/features/observability/panels-collect.test.tsx 14ms (unchanged)
src/features/observability/panels-collect.tsx 34ms (unchanged)
src/features/observability/prose.test.ts 3ms (unchanged)
src/features/observability/scrubber.test.ts 3ms (unchanged)
src/features/observability/scrubber.ts 2ms (unchanged)
src/features/observability/signals.test.ts 2ms (unchanged)
src/features/observability/signals.ts 3ms (unchanged)
src/features/observability/silence.test.ts 2ms (unchanged)
src/features/observability/silence.ts 2ms (unchanged)
src/features/observability/steps.test.ts 1ms (unchanged)
src/features/observability/steps.ts 1ms (unchanged)
src/features/observability/traps.test.ts 3ms (unchanged)
src/features/observability/traps.ts 2ms (unchanged)
src/features/performance/artifacts.ts 1ms (unchanged)
src/features/performance/baseline.ts 2ms (unchanged)
src/features/performance/BaselineLab.test.tsx 6ms (unchanged)
src/features/performance/BaselineLab.tsx 11ms (unchanged)
src/features/performance/checklist.test.ts 2ms (unchanged)
src/features/performance/checklist.ts 2ms (unchanged)
src/features/performance/content.test.ts 4ms (unchanged)
src/features/performance/content.ts 4ms (unchanged)
src/features/performance/CopyText.tsx 3ms (unchanged)
src/features/performance/DecisionDrill.test.tsx 9ms (unchanged)
src/features/performance/DecisionDrill.tsx 7ms (unchanged)
src/features/performance/decisions.test.ts 4ms (unchanged)
src/features/performance/decisions.ts 12ms (unchanged)
src/features/performance/journey.ts 3ms (unchanged)
src/features/performance/OrderJourney.test.tsx 3ms (unchanged)
src/features/performance/OrderJourney.tsx 4ms (unchanged)
src/features/performance/panels-close.tsx 3ms (unchanged)
src/features/performance/panels-diagnose.tsx 5ms (unchanged)
src/features/performance/panels-measure.tsx 5ms (unchanged)
src/features/performance/panels.test.tsx 9ms (unchanged)
src/features/performance/PerformanceChecklist.test.tsx 3ms (unchanged)
src/features/performance/PerformanceChecklist.tsx 4ms (unchanged)
src/features/performance/PerformanceOptimization.test.tsx 7ms (unchanged)
src/features/performance/PerformanceOptimization.tsx 1ms (unchanged)
src/features/performance/PerformanceWorksheet.test.tsx 10ms (unchanged)
src/features/performance/PerformanceWorksheet.tsx 10ms (unchanged)
src/features/performance/steps.ts 6ms (unchanged)
src/features/planning/AIPlanningPlays.tsx 10ms (unchanged)
src/features/planning/CarryForward.tsx 5ms (unchanged)
src/features/planning/CutFunnel.tsx 3ms (unchanged)
src/features/planning/CutTable.tsx 5ms (unchanged)
src/features/planning/DecompositionLadder.tsx 5ms (unchanged)
src/features/planning/DoneStatement.tsx 5ms (unchanged)
src/features/planning/HorizonBands.tsx 2ms (unchanged)
src/features/planning/HorizonBoard.tsx 1ms (unchanged)
src/features/planning/HorizonTriage.tsx 11ms (unchanged)
src/features/planning/PlanAnatomy.tsx 4ms (unchanged)
src/features/planning/Planning.tsx 17ms (unchanged)
src/features/planning/PlanningScope.tsx 3ms (unchanged)
src/features/planning/PlanWorksheet.tsx 9ms (unchanged)
src/features/planning/RiskOrder.tsx 4ms (unchanged)
src/features/planning/scoring.test.ts 14ms (unchanged)
src/features/planning/scoring.ts 8ms (unchanged)
src/features/planning/SizeScorer.tsx 6ms (unchanged)
src/features/planning/SliceAnatomy.tsx 2ms (unchanged)
src/features/planning/SliceSequencer.tsx 7ms (unchanged)
src/features/planning/SpikeCard.tsx 5ms (unchanged)
src/features/planning/steps.test.ts 1ms (unchanged)
src/features/planning/steps.ts 1ms (unchanged)
src/features/post-deployment-verification/ai-plays.test.ts 4ms (unchanged)
src/features/post-deployment-verification/ai-plays.ts 2ms (unchanged)
src/features/post-deployment-verification/AIPlays.test.tsx 2ms (unchanged)
src/features/post-deployment-verification/AIPlays.tsx 3ms (unchanged)
src/features/post-deployment-verification/aws-verification.test.ts 5ms (unchanged)
src/features/post-deployment-verification/aws-verification.ts 3ms (unchanged)
src/features/post-deployment-verification/checklist.test.ts 4ms (unchanged)
src/features/post-deployment-verification/checklist.ts 2ms (unchanged)
src/features/post-deployment-verification/doc-source.ts 2ms (unchanged)
src/features/post-deployment-verification/PostDeploymentVerification.test.tsx 4ms (unchanged)
src/features/post-deployment-verification/PostDeploymentVerification.tsx 18ms (unchanged)
src/features/post-deployment-verification/prose.test.ts 2ms (unchanged)
src/features/post-deployment-verification/steps.test.ts 1ms (unchanged)
src/features/post-deployment-verification/steps.ts 1ms (unchanged)
src/features/post-deployment-verification/traps.test.ts 7ms (unchanged)
src/features/post-deployment-verification/traps.ts 2ms (unchanged)
src/features/post-deployment-verification/VerificationChecklist.test.tsx 3ms (unchanged)
src/features/post-deployment-verification/VerificationChecklist.tsx 6ms (unchanged)
src/features/production-deployment/ai-plays.test.ts 4ms (unchanged)
src/features/production-deployment/ai-plays.ts 2ms (unchanged)
src/features/production-deployment/AIPlays.test.tsx 2ms (unchanged)
src/features/production-deployment/AIPlays.tsx 2ms (unchanged)
src/features/production-deployment/aws-data.test.ts 3ms (unchanged)
src/features/production-deployment/aws-data.ts 2ms (unchanged)
src/features/production-deployment/checklist.test.ts 3ms (unchanged)
src/features/production-deployment/checklist.ts 1ms (unchanged)
src/features/production-deployment/DeploymentChecklist.test.tsx 2ms (unchanged)
src/features/production-deployment/DeploymentChecklist.tsx 6ms (unchanged)
src/features/production-deployment/doc-source.ts 1ms (unchanged)
src/features/production-deployment/migration-artifact.test.ts 1ms (unchanged)
src/features/production-deployment/migration-artifact.ts 1ms (unchanged)
src/features/production-deployment/pipeline-artifact.test.ts 2ms (unchanged)
src/features/production-deployment/pipeline-artifact.ts 3ms (unchanged)
src/features/production-deployment/ProductionDeployment.test.tsx 3ms (unchanged)
src/features/production-deployment/ProductionDeployment.tsx 17ms (unchanged)
src/features/production-deployment/prose.test.ts 6ms (unchanged)
src/features/production-deployment/steps.test.ts 1ms (unchanged)
src/features/production-deployment/steps.ts 1ms (unchanged)
src/features/production-deployment/traps.test.ts 7ms (unchanged)
src/features/production-deployment/traps.ts 2ms (unchanged)
src/features/rails.test.tsx 3ms (unchanged)
src/features/security-audit/content.ts 3ms (unchanged)
src/features/security-audit/IdorProbe.tsx 5ms (unchanged)
src/features/security-audit/PolicyMatrix.tsx 3ms (unchanged)
src/features/security-audit/SecurityAudit.test.tsx 6ms (unchanged)
src/features/security-audit/SecurityAudit.tsx 10ms (unchanged)
src/features/setup/ai-plays.test.ts 4ms (unchanged)
src/features/setup/ai-plays.ts 1ms (unchanged)
src/features/setup/AIPlays.test.tsx 2ms (unchanged)
src/features/setup/AIPlays.tsx 2ms (unchanged)
src/features/setup/AnnotatedArtifact.test.tsx 3ms (unchanged)
src/features/setup/artifact-affordances.test.tsx 6ms (unchanged)
src/features/setup/artifacts.test.ts 3ms (unchanged)
src/features/setup/artifacts.ts 7ms (unchanged)
src/features/setup/blockers.test.ts 5ms (unchanged)
src/features/setup/blockers.ts 3ms (unchanged)
src/features/setup/checklist.test.ts 18ms (unchanged)
src/features/setup/checklist.ts 5ms (unchanged)
src/features/setup/client-trap.test.ts 3ms (unchanged)
src/features/setup/client-trap.ts 1ms (unchanged)
src/features/setup/ClientTrap.test.tsx 7ms (unchanged)
src/features/setup/ClientTrap.tsx 5ms (unchanged)
src/features/setup/DeployBlockers.test.tsx 6ms (unchanged)
src/features/setup/DeployBlockers.tsx 5ms (unchanged)
src/features/setup/doc-source.ts 1ms (unchanged)
src/features/setup/env-restart.test.ts 3ms (unchanged)
src/features/setup/PinExercise.test.tsx 5ms (unchanged)
src/features/setup/PinExercise.tsx 7ms (unchanged)
src/features/setup/pins.test.ts 2ms (unchanged)
src/features/setup/pins.ts 1ms (unchanged)
src/features/setup/Setup.test.tsx 3ms (unchanged)
src/features/setup/Setup.tsx 45ms (unchanged)
src/features/setup/SetupChecklist.test.tsx 5ms (unchanged)
src/features/setup/SetupChecklist.tsx 5ms (unchanged)
src/features/setup/steps.test.ts 2ms (unchanged)
src/features/setup/steps.ts 1ms (unchanged)
src/features/setup/traps.test.ts 3ms (unchanged)
src/features/setup/traps.ts 2ms (unchanged)
src/features/setup/tree.test.ts 14ms (unchanged)
src/features/setup/tree.ts 3ms (unchanged)
src/features/setup/TreeInspector.test.tsx 12ms (unchanged)
src/features/setup/TreeInspector.tsx 69ms (unchanged)
src/features/stage-08-port.test.tsx 93ms (unchanged)
src/features/stage-16-port.test.tsx 38ms (unchanged)
src/features/stage-content.ts 2ms (unchanged)
src/features/staging/ai-plays.test.ts 5ms (unchanged)
src/features/staging/ai-plays.ts 2ms (unchanged)
src/features/staging/AIPlays.test.tsx 2ms (unchanged)
src/features/staging/AIPlays.tsx 4ms (unchanged)
src/features/staging/checklist-items.test.ts 2ms (unchanged)
src/features/staging/checklist-items.tsx 2ms (unchanged)
src/features/staging/checklist.test.ts 3ms (unchanged)
src/features/staging/checklist.ts 3ms (unchanged)
src/features/staging/doc-source.ts 1ms (unchanged)
src/features/staging/PreviewOrStaging.test.tsx 9ms (unchanged)
src/features/staging/PreviewOrStaging.tsx 5ms (unchanged)
src/features/staging/prose.test.ts 4ms (unchanged)
src/features/staging/scenarios.test.ts 5ms (unchanged)
src/features/staging/scenarios.ts 2ms (unchanged)
src/features/staging/seed-data.test.ts 2ms (unchanged)
src/features/staging/seed-data.ts 1ms (unchanged)
src/features/staging/Staging.test.tsx 3ms (unchanged)
src/features/staging/Staging.tsx 21ms (unchanged)
src/features/staging/StagingChecklist.test.tsx 6ms (unchanged)
src/features/staging/StagingChecklist.tsx 7ms (unchanged)
src/features/staging/steps.test.ts 2ms (unchanged)
src/features/staging/steps.ts 1ms (unchanged)
src/features/staging/traps.test.ts 4ms (unchanged)
src/features/staging/traps.ts 1ms (unchanged)
src/features/step-ids.ts 3ms (unchanged)
src/features/testing/ai-plays.test.ts 10ms (unchanged)
src/features/testing/ai-plays.ts 5ms (unchanged)
src/features/testing/AIPlays.test.tsx 6ms (unchanged)
src/features/testing/AIPlays.tsx 5ms (unchanged)
src/features/testing/artifacts.test.ts 7ms (unchanged)
src/features/testing/artifacts.ts 4ms (unchanged)
src/features/testing/checklist.test.ts 8ms (unchanged)
src/features/testing/checklist.ts 2ms (unchanged)
src/features/testing/doc-source.ts 1ms (unchanged)
src/features/testing/layers.test.ts 2ms (unchanged)
src/features/testing/layers.ts 1ms (unchanged)
src/features/testing/LayerThread.test.tsx 3ms (unchanged)
src/features/testing/LayerThread.tsx 5ms (unchanged)
src/features/testing/probes.test.ts 6ms (unchanged)
src/features/testing/probes.ts 2ms (unchanged)
src/features/testing/prose.test.ts 6ms (unchanged)
src/features/testing/steps.test.ts 3ms (unchanged)
src/features/testing/steps.ts 8ms (unchanged)
src/features/testing/teeth.test.ts 16ms (unchanged)
src/features/testing/teeth.ts 3ms (unchanged)
src/features/testing/TeethCheck.test.tsx 7ms (unchanged)
src/features/testing/TeethCheck.tsx 7ms (unchanged)
src/features/testing/Testing.test.tsx 4ms (unchanged)
src/features/testing/Testing.tsx 17ms (unchanged)
src/features/testing/TestingChecklist.test.tsx 4ms (unchanged)
src/features/testing/TestingChecklist.tsx 9ms (unchanged)
src/features/testing/traps.test.ts 3ms (unchanged)
src/features/testing/traps.ts 1ms (unchanged)
src/features/testing/triage.test.ts 6ms (unchanged)
src/features/testing/triage.ts 2ms (unchanged)
src/features/testing/TriageDrill.test.tsx 6ms (unchanged)
src/features/testing/TriageDrill.tsx 6ms (unchanged)
src/lib/architecture-sheet.test.ts 3ms (unchanged)
src/lib/architecture-sheet.ts 2ms (unchanged)
src/lib/cheatsheets/api-design.ts 2ms (unchanged)
src/lib/cheatsheets/architecture-patterns.ts 4ms (unchanged)
src/lib/cheatsheets/aws-deployment.ts 2ms (unchanged)
src/lib/cheatsheets/caching.test.ts 4ms (unchanged)
src/lib/cheatsheets/caching.ts 2ms (unchanged)
src/lib/cheatsheets/ci-cd.ts 4ms (unchanged)
src/lib/cheatsheets/clean-code.ts 9ms (unchanged)
src/lib/cheatsheets/code-review.ts 15ms (unchanged)
src/lib/cheatsheets/coding-standards.ts 3ms (unchanged)
src/lib/cheatsheets/deployment-environments.ts 2ms (unchanged)
src/lib/cheatsheets/design-patterns.ts 2ms (unchanged)
src/lib/cheatsheets/generate-highlighted.test.ts 1ms (unchanged)
src/lib/cheatsheets/generate-highlighted.ts 2ms (unchanged)
src/lib/cheatsheets/git-branching.ts 2ms (unchanged)
src/lib/cheatsheets/git-cheatsheet.ts 4ms (unchanged)
src/lib/cheatsheets/git-commands.ts 5ms (unchanged)
src/lib/cheatsheets/github-actions.ts 6ms (unchanged)
src/lib/cheatsheets/incident-management.ts 2ms (unchanged)
src/lib/cheatsheets/index.test.ts 12ms (unchanged)
src/lib/cheatsheets/index.ts 3ms (unchanged)
src/lib/cheatsheets/planned.ts 1ms (unchanged)
src/lib/cheatsheets/playwright.ts 3ms (unchanged)
src/lib/cheatsheets/post-deploy-verification.ts 3ms (unchanged)
src/lib/cheatsheets/render-citations.test.ts 9ms (unchanged)
src/lib/cheatsheets/render.test.ts 1ms (unchanged)
src/lib/cheatsheets/render.ts 6ms (unchanged)
src/lib/cheatsheets/sdlc.ts 2ms (unchanged)
src/lib/cheatsheets/security.ts 2ms (unchanged)
src/lib/cheatsheets/sheet-sources.test.ts 4ms (unchanged)
src/lib/cheatsheets/sheet-sources.ts 1ms (unchanged)
src/lib/cheatsheets/solid-principles.ts 4ms (unchanged)
src/lib/cheatsheets/testing.ts 2ms (unchanged)
src/lib/cheatsheets/types.ts 2ms (unchanged)
src/lib/discovery-sheet.test.ts 2ms (unchanged)
src/lib/discovery-sheet.ts 2ms (unchanged)
src/lib/glossary.test.ts 1ms (unchanged)
src/lib/glossary.ts 2ms (unchanged)
src/lib/highlight.test.ts 2ms (unchanged)
src/lib/highlight.ts 6ms (unchanged)
src/lib/performance-sheet.test.ts 3ms (unchanged)
src/lib/performance-sheet.ts 4ms (unchanged)
src/lib/references.test.ts 2ms (unchanged)
src/lib/references.ts 40ms (unchanged)
src/lib/site.test.ts 2ms (unchanged)
src/lib/site.ts 1ms (unchanged)
src/lib/source-citations.test.ts 10ms (unchanged)
src/lib/stage-03-structure.test.ts 7ms (unchanged)
src/lib/stage-08-structure.test.ts 2ms (unchanged)
src/lib/stage-09-structure.test.ts 7ms (unchanged)
src/lib/stage-15-structure.test.ts 21ms (unchanged)
src/lib/stage-16-structure.test.ts 7ms (unchanged)
src/lib/stage-metadata.test.ts 7ms (unchanged)
src/lib/stages.test.ts 7ms (unchanged)
src/lib/stages.ts 7ms (unchanged)
src/lib/term-usage.test.ts 5ms (unchanged)
src/lib/terms.test.ts 8ms (unchanged)
src/lib/terms.ts 17ms (unchanged)
src/lib/tracker-ledger.test.ts 5ms (unchanged)
src/lib/typography.test.ts 4ms (unchanged)
src/lib/useLocalStorage.ts 4ms (unchanged)
src/test/build-freshness.test.ts 4ms (unchanged)
src/test/build-freshness.ts 4ms (unchanged)
src/test/doc-source.test.ts 2ms (unchanged)
src/test/doc-source.ts 3ms (unchanged)
src/test/harness.test.ts 2ms (unchanged)
src/test/localstorage-polyfill.ts 3ms (unchanged)
src/test/setup.ts 1ms (unchanged)
tsconfig.json 1ms (unchanged)
vitest.config.ts 1ms (unchanged)

```

Exit: 0.

### Task 2 lint

Command (from `web/`): `pnpm lint`

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> eslint --max-warnings 0


```

Exit: 0.

### Task 2 typecheck

Command (from `web/`): `pnpm typecheck`

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully

```

Exit: 0.

### Task 2 full suite

Command (from `web/`): `pnpm test`

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  203 passed (203)
      Tests  1481 passed (1481)
   Start at  13:34:08
   Duration  69.11s (transform 25.00s, setup 31.59s, import 62.37s, tests 128.35s, environment 189.80s)


```

Exit: 0. All 1481 tests passed across 203 files. Formatting, lint and generated-route typecheck also exited 0.

## Task 2 independent review

### Spec Compliance

- ✅ Spec compliant for the Task 2 slice. All three requested source/test files and the required execution-report update appear in the packaged diff. No missing, extra or misunderstood implementation was found.
- ✅ Task quality: Approved. Task verdict: review clean; no findings.
- Review bounds: BASE `78c137fc96eb24e32c186021a8cdf49f6efb6b23`, HEAD `f1bb218217647f1ed0a180c218db4328ed523617`; package `.superpowers/sdd/2026-10-13-stage-09-reference/review-78c137f..f1bb218.diff:1`. The package identifies one commit, four changed files, and 1,046 added lines; 749 lines are required execution evidence, not production complexity.

### Criterion and evidence checklist

| Requirement | Result and evidence |
| --- | --- |
| Create the caching data module and both named test files | ✅ Complete added-file hunks for `web/src/lib/cheatsheets/caching.ts:1`, `web/src/lib/cheatsheets/caching.test.ts:1`, and `web/src/components/CachingReference.test.tsx:1`. |
| Consume Task 1 interfaces | ✅ Type-only `Cheatsheet` import and typed export at `web/src/lib/cheatsheets/caching.ts:1`; unit tests use `sheetSources` at `web/src/lib/cheatsheets/caching.test.ts:3`; DOM tests import the actual `CheatsheetView` at `web/src/components/CachingReference.test.tsx:4`. Shared-interface implementation remains a Task 1 item. |
| Exact exported identity and ownership | ✅ `caching`, title `Caching`, slug `caching`, group `Architecture`, and stage `09-performance-optimization` at `web/src/lib/cheatsheets/caching.ts:3`. Stage is asserted at `web/src/lib/cheatsheets/caching.test.ts:10`; the real stage-link target is asserted at `web/src/components/CachingReference.test.tsx:20`. |
| Five agreed sections in authored order | ✅ Data at `web/src/lib/cheatsheets/caching.ts:48`, `:70`, `:103`, `:124`, and `:160`; exact ordered section-title assertion at `web/src/lib/cheatsheets/caching.test.ts:12`. |
| Choose reusable work using measured user-path evidence | ✅ Reusable public-description candidate and measured slow-path caveat at `web/src/lib/cheatsheets/caching.ts:53`. |
| Preserve authoritative stock, charge and authorization checks | ✅ Business-boundary caveat at `web/src/lib/cheatsheets/caching.ts:58`; data assertion at `web/src/lib/cheatsheets/caching.test.ts:31`. |
| Ownership-aware inputs do not grant tenant access; test multiple readers | ✅ Product/locale/tenant inputs, authorization boundary, and two-user/tenant check at `web/src/lib/cheatsheets/caching.ts:63`; assertions at `web/src/lib/cheatsheets/caching.test.ts:32`. |
| Define TTL and retention; do not promise persistence | ✅ Plain-language definitions at `web/src/lib/cheatsheets/caching.ts:71`; instance-local/ephemeral host caveat at `:96`, asserted at `web/src/lib/cheatsheets/caching.test.ts:73`. |
| Teach `cacheComponents` without enabling caching here | ✅ Teaching-only explanation at `web/src/lib/cheatsheets/caching.ts:74`; no `next.config.ts` hunk in the complete four-file package. |
| Explain eligible `use cache` scope and external request-specific inputs | ✅ Function/component/module directive scope and outside-scope cookies/headers advice at `web/src/lib/cheatsheets/caching.ts:79`. |
| Literal illustrative example, lifetime, tags, safe public read | ✅ Example label and string at `web/src/lib/cheatsheets/caching.ts:84`; literal string contains async function, directive, `cacheLife('minutes')`, product tag, encoded URL input, non-OK response error, and a restricted `{ id, description }` return. Syntax assertions at `web/src/lib/cheatsheets/caching.test.ts:69`; real rendered code assertions at `web/src/components/CachingReference.test.tsx:40`. |
| Tags and lifetime match tolerated staleness, not authorization | ✅ `web/src/lib/cheatsheets/caching.ts:91`. |
| Invalidate only after successful writes; do not promise all open browsers refresh | ✅ Invalidation note at `web/src/lib/cheatsheets/caching.ts:104`; successful-write condition also appears in the `updateTag` row at `:109`. |
| `updateTag` is Server Actions only; next matching read waits for fresh data | ✅ Exact caller/freshness limits at `web/src/lib/cheatsheets/caching.ts:107`; data assertions at `web/src/lib/cheatsheets/caching.test.ts:20`; actual rendered row assertions at `web/src/components/CachingReference.test.tsx:6`. |
| `revalidateTag(tag, 'max')` supports tolerated stale/background reads, without eager refresh | ✅ `web/src/lib/cheatsheets/caching.ts:112`; stale/background assertion at `web/src/lib/cheatsheets/caching.test.ts:23`. |
| Route Handler immediate expiry uses `{ expire: 0 }`; avoid deprecated single argument | ✅ `web/src/lib/cheatsheets/caching.ts:117`; unit assertion at `web/src/lib/cheatsheets/caching.test.ts:26`; real-renderer assertion at `web/src/components/CachingReference.test.tsx:16`. |
| Explain CDN abbreviation and distinguish Cloudflare responses from Next.js entries and this site's hosting | ✅ Section note at `web/src/lib/cheatsheets/caching.ts:125`; provider-boundary assertion at `web/src/lib/cheatsheets/caching.test.ts:35`. |
| HIT does not prove latest-write freshness; MISS can be normal | ✅ `web/src/lib/cheatsheets/caching.ts:128` and `:133`; unit assertions at `web/src/lib/cheatsheets/caching.test.ts:40`; HIT caveat rendered assertion at `web/src/components/CachingReference.test.tsx:19`. |
| BYPASS is response-time prevention; DYNAMIC is request-time ineligibility | ✅ Distinct rows at `web/src/lib/cheatsheets/caching.ts:138` and `:143`; assertions at `web/src/lib/cheatsheets/caching.test.ts:46`. |
| Separate freshness from retention and CDN control from application tags | ✅ `web/src/lib/cheatsheets/caching.ts:148`. |
| Header inspection uses illustrative safe-read URL and does not infer application behavior | ✅ Literal `curl` row and caveats at `web/src/lib/cheatsheets/caching.ts:153`. |
| Comparable retest includes observer/events, segment, workload, window and cold/warm cache | ✅ `web/src/lib/cheatsheets/caching.ts:164`; cold/warm assertion at `web/src/lib/cheatsheets/caching.test.ts:53`. |
| Explain p95 population; preserve sample, timeout/failures, errors, correctness and lab/field distinction | ✅ Definition and retest caveats at `web/src/lib/cheatsheets/caching.ts:165`; assertions at `web/src/lib/cheatsheets/caching.test.ts:55`. |
| Retest read-after-write freshness, isolation and authorization before keeping change | ✅ `web/src/lib/cheatsheets/caching.ts:169`; multi-reader assertion at `web/src/lib/cheatsheets/caching.test.ts:57`. |
| All seven exact citations in authored order, retaining primary role | ✅ `use cache`, `cacheLife`, `cacheTag`, `updateTag`, `revalidateTag`, Cloudflare cache responses, Retention vs Freshness, each with its brief-prescribed publisher and URL, at `web/src/lib/cheatsheets/caching.ts:10`. Additional entries have no image fields. Publisher-order assertion at `web/src/lib/cheatsheets/caching.test.ts:60`; real footer count and exact `updateTag`/Cloudflare response targets at `web/src/components/CachingReference.test.tsx:27`. |
| Real DOM consumes data and literal example rather than merely passing data invariants | ✅ Both DOM tests call `render(<CheatsheetView sheet={caching} />)` at `web/src/components/CachingReference.test.tsx:7` and `:28`, without renderer mocks. They inspect a real definition-list row, visible caveats, stage link, footer links, and `pre code`. |
| Keep syntax in `code`/`example` and plain-text explanations in `what`/`when` | ✅ API identifiers at `web/src/lib/cheatsheets/caching.ts:74`, `:79`, `:91`, `:107`, `:112`, `:117`, and `:153`; example is string data at `:86`. Explanations contain no JSX or executable imports. |
| Do not register, regenerate snapshots, widen runtime infrastructure or add dependencies | ✅ The complete package changes only the three owned files and execution report. No registry, generated reference, snapshot, configuration, dependency, chapter, stage port, diagram or image change appears. |
| Test first, expected missing-implementation RED, GREEN, isolated teeth, restored GREEN | ✅ Raw evidence reviewed below; implementation matches the tested final caller restriction at `web/src/lib/cheatsheets/caching.ts:108`. |
| Humanizer review preserves factual caveats and definitions | ✅ Recorded at `.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:8` and in the added execution-report hunk; final copy matches the supplied source apart from formatting. The concrete language does not justify dropping caller/provider/authorization limits. Skill invocation itself is outside the diff. |
| Format, lint, generated-route typecheck, commit, task review | ✅ Raw passing checks at `.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:150`, `:697`, `:711`; package identifies the requested conventional commit at `review-78c137f..f1bb218.diff:4`; this report provides the independent task review. Trailer and branch ancestry require controller verification. |
| Persist raw execution evidence and deferrals in the canonical report | ✅ Packaged added report hunk starts at `docs/superpowers/reports/2026-10-13-stage-09-reference.md:1214` and contains the RED/GREEN/teeth/restored/check output. Deferrals are explicit in `.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:12`. |

### TDD and verification evidence

- ✅ RED failed for the specified right reason: no caching implementation existed. Both suites report missing imports, not a broken assertion or unrelated runtime error (`.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:27` and `:38`); exit 1, two failed suites and no executed tests at `:59`. This establishes implementation absence, not behavioral sensitivity.
- ✅ GREEN executed six unit plus two real-renderer tests: 2 files / 8 tests passed, exit 0 (`.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:69`).
- ✅ Teeth supplies behavioral proof: changing the caller restriction to `Route Handlers allowed:` produces exactly the expected `/Server Actions only/` assertion failure at `web/src/lib/cheatsheets/caching.test.ts:21`, with 1 failed / 5 passed unit tests (`.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:96`, `:102`, and `:122`). This is isolated to the mandated unit command; it does not claim a separate DOM mutation experiment.
- ✅ Restored GREEN again passes both files / all 8 tests, exit 0 (`.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:131`).
- ✅ Format exit 0 at `.superpowers/sdd/2026-10-13-stage-09-reference/task-2-report.md:695`, lint exit 0 at `:709`, and `next typegen && tsc --noEmit` exit 0 at `:725`. Full-suite output records 203 files / 1,481 tests passed at `:740`. No unexpected warning or console-noise finding appears in the recorded output; missing-import errors and mutation assertion errors are the required RED evidence.
- ✅ No tests were rerun in review: the recorded runs answer the behavioral doubts raised by the code. No source, index or ref was mutated.

### Primary-source factual checks

- ✅ Named risk: the plan's supplied API teaching could encode an incorrect caller boundary, cache scope or persistence promise. The official [use cache documentation](https://nextjs.org/docs/app/api-reference/directives/use-cache) supports async cached scopes, Cache Components enablement, outside-scope request APIs and host-dependent memory behavior; [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) and [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag) support the literal function-scoped lifetime/tag example at `web/src/lib/cheatsheets/caching.ts:86`. No factual contradiction found.
- ✅ The official [updateTag documentation](https://nextjs.org/docs/app/api-reference/functions/updateTag) and [revalidateTag documentation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) confirm the caller and next-read distinctions at `web/src/lib/cheatsheets/caching.ts:107`, `:112`, and `:117`, including `{ expire: 0 }` and deprecated single-argument advice. No plan-authored error found.
- ✅ Named risk: provider status labels could confuse request-time eligibility with response-time storage and application freshness. [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/) confirms HIT/MISS/BYPASS/DYNAMIC distinctions at `web/src/lib/cheatsheets/caching.ts:128`; [Retention vs Freshness](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/) supports the separate retention/freshness explanation at `:148`, including policy-dependent stale serving. No factual contradiction found.

### Cannot verify from this diff

- ⚠️ Shared `Cheatsheet`/`sheetSources`/renderer internals, full DOM citation ordering and all seven rendered targets are Task 1 behavior. Authored ordering is directly visible here and the tests exercise real consumption, but this task's DOM assertions do not independently pin the complete footer sequence. Controller should retain Task 1's ordered-source/rendering evidence (`task-2-brief.md:8`; `web/src/components/CachingReference.test.tsx:27`). This is a verification boundary, not a missing Task 2 requirement.
- ⚠️ Registration, generated `reference/cheatsheets.md`, catalogue filtering, snapshot updates and W-6 22 drawn / 27 registered status belong to Task 4; W-3 15/18 and tracker/KICKOFF synchronization belong to later records work (`global-constraints.md:7`, `:8`; `task-2-report.md:12`).
- ⚠️ Actual browser contrast, 320–2560px overflow/touch targets, both themes and production/development console checks cannot be inferred from jsdom or the unchanged layout. Controller must perform the combined live-build verification after registration (`global-constraints.md:5`; `task-2-report.md:12`).
- ⚠️ Develop ancestry, approved spec/plan presence, required commit trailer and current clean tree are not proved by the package's abbreviated commit list. Controller should verify those independently without interpreting this task gate as merge approval (`global-constraints.md:13`, `:14`; `task-2-report.md:752`).

### Strengths

- ✅ Safety-relevant caching advice stays attached to concrete caller/read boundaries and authoritative business checks, rather than reducing the lookup to a hit-rate recipe (`web/src/lib/cheatsheets/caching.ts:58`, `:107`, `:164`).
- ✅ Static teaching content has one clear 176-line data-module responsibility; both test files remain small (74 and 47 lines). There is no new runtime API execution, state, abstraction or dependency (`web/src/lib/cheatsheets/caching.ts:1`; `web/src/lib/cheatsheets/caching.test.ts:1`; `web/src/components/CachingReference.test.tsx:1`).
- ✅ DOM tests check the actual renderer and stage/footer/example outputs; the isolated teeth run demonstrates a material factual regression is caught (`web/src/components/CachingReference.test.tsx:6`; `task-2-report.md:102`).
- ✅ The report explicitly distinguishes initial missing-import RED from behavioral proof and records later-task deferrals (`task-2-report.md:6`, `:12`).

### Issues

#### Critical (Must Fix)

- None found.

#### Important (Should Fix)

- None found, including plan-authored errors.

#### Minor (Nice to Have)

- None found. No pre-existing defect is asserted from unchanged code.

### Assessment

**Spec compliance:** ✅ Spec compliant for Task 2, with the cross-task verification boundaries above.

**Task quality:** Approved. The data matches the approved teaching content, tests exercise both invariants and the actual renderer, and recorded teeth evidence catches the specified caller-scope regression. No blocking or optional fix is required for this slice.

**Review checks:** Complete implementation/test hunks read from the packaged diff once. Tool-output truncation hid the package header and documentation prefix; only those missing package ranges and the separate report evidence were recovered. No changed implementation file was reread, no unchanged source was inspected, no Git command or test was run, and no subagent was spawned. External checks were limited to the seven authored primary citations for the two named factual risks.

**Branch boundary:** Task commit `f1bb218`; reported full suite 1,481/1,481 across 203 files, lint/typecheck/format exit 0. Build and live-browser checks are pending later-task verification. Clean tree, trailer and ancestry remain controller-owned checks. NOT merged, NOT deployed.

Controller resolution: Task 1 reviewed source ordering, helper freshness and real DOM/Markdown contracts remain in force; no shared renderer change in Task 2. Full live seven-link ordering/targets and catalogue counts are explicitly Task 4 checks, not missing Task 2 content. Approved spec/plan exist in this branch, develop ancestry check exited 0, exact coauthor trailer verified with git log, tracked tree and diff check clean. Registration, generated snapshots and combined browser/records evidence remain pending Task 4. Task 2: review clean.

## Task 3: infrastructure scaling lookup

Base: `8e2a5c03b8015dc5fc8e54e6ae7ee4195d005114`. Branch: `feat/stage-09-reference-companions`. Worktree: `.worktrees/stage-09-reference`.

Added the supplied static scaling data and tests before registration. The sheet distinguishes infrastructure from team practice, keeps ALB feature incompatibilities beside routing choices, explains fail-open health behavior and shared dependency limits, and retains bounded retries and reconciliation for uncertain writes or charges. Source order is AWS attributes, AWS health, Google SRE overload. The command is a literal read-only teaching example, not executed by the app.

RED failed for the expected missing implementation: both suites could not import `scaling.ts`. This is an import/setup failure, not behavioral proof. The later teeth run supplies that proof. Initial GREEN passed 8/8.

Teeth check: temporarily replaced `it fails open and can route to them regardless of health status` with `it blocks all traffic to unhealthy targets` and ran the whole unit file. Exactly `failed health checks are not a guarantee of zero traffic when ALB fails open` failed; the other five tests passed. The failure was for the right reason: the rendered data falsely promised blocked traffic instead of ALB fail-open routing. Restored the original prose and both files returned to 8/8 GREEN.

Humanizer review: draft and final retain the approved prose verbatim. No remaining filler, inflated claims, dramatic fragments or em/en dashes warrant rewriting. Provider-specific caveats, ALB abbreviation, percentile population, authorization/payment safety and timeout reconciliation are factual requirements. These were preserved; terminal evidence is exempt from the prose review. First-party provenance was rechecked by the controller in `controller-source-check.md` on 2026-10-13; this task makes no infrastructure experiment claim.

Self-review: checked all three authored files against the brief. No registry, shared renderer, generated markdown, configuration, stage content or dependency edits. The DOM tests exercise the real renderer, verify the stage link, all three credits, the read-only AWS command and the consequential safety text. Unit guards cover limits, algorithm compatibility, health, retries and outcome verification.

Concerns: no task-local concern identified. Independent task review remains controller-owned.

Deferred: Task 4 registration, generated snapshots/markdown, tracker/task/KICKOFF updates, combined live-build contrast, responsive/touch and production/development console verification. No merge, push or deployment.

### red

Command from `web/`: `pnpm exec vitest run src/lib/cheatsheets/scaling.test.ts src/components/ScalingReference.test.tsx`. Exit: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/scaling.test.ts (0 test)
 ❯ |dom| src/components/ScalingReference.test.tsx (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/scaling.test.ts [ src/lib/cheatsheets/scaling.test.ts ]
Error: Cannot find module './scaling' imported from /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/lib/cheatsheets/scaling.test.ts
 ❯ src/lib/cheatsheets/scaling.test.ts:2:1
      1| import { expect, test } from 'vitest'
      2| import { scaling } from './scaling'
       | ^
      3| import { sheetSources } from './sheet-sources'
      4| const rows = scaling.sections.flatMap((section) => section.rows)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |dom| src/components/ScalingReference.test.tsx [ src/components/ScalingReference.test.tsx ]
Error: Failed to resolve import "@/lib/cheatsheets/scaling" from "src/components/ScalingReference.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/components/ScalingReference.test.tsx:3:24
  1  |  import { render, screen, within } from "@testing-library/react";
  2  |  import { expect, test } from "vitest";
  3  |  import { scaling } from "@/lib/cheatsheets/scaling";
     |                           ^
  4  |  import { CheatsheetView } from "./Cheatsheet";
  5  |  var _jsxFileName = "/Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web/src/components/Sc...
 ❯ TransformPluginContext._formatLog node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30416:39
 ❯ TransformPluginContext.error node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30413:14
 ❯ normalizeUrl node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27438:18
 ❯ node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27506:30
 ❯ TransformPluginContext.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:27474:4
 ❯ EnvironmentPluginContainer.transform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:30201:14
 ❯ loadAndTransform node_modules/.pnpm/vite@8.1.5_@types+node@22.20.1_jiti@2.7.0/node_modules/vite/dist/node/chunks/node.js:20124:26

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed (2)
      Tests  no tests
   Start at  13:43:31
   Duration  1.07s (transform 40ms, setup 154ms, import 0ms, tests 0ms, environment 741ms)


```

### green

Command from `web/`: `pnpm exec vitest run src/lib/cheatsheets/scaling.test.ts src/components/ScalingReference.test.tsx`. Exit: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  13:43:46
   Duration  1.70s (transform 235ms, setup 151ms, import 394ms, tests 232ms, environment 815ms)


```

### teeth

Command from `web/`: `pnpm exec vitest run src/lib/cheatsheets/scaling.test.ts`. Exit: 1.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/scaling.test.ts (6 tests | 1 failed) 8ms
   × failed health checks are not a guarantee of zero traffic when ALB fails open 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/scaling.test.ts > failed health checks are not a guarantee of zero traffic when ALB fails open
AssertionError: expected 'ALB normally routes to healthy target…' to match /all registered targets are unhealthy.…/

- Expected:
/all registered targets are unhealthy.*fails open.*regardless of health/

+ Received:
"ALB normally routes to healthy targets. If all registered targets are unhealthy, it blocks all traffic to unhealthy targets."

 ❯ src/lib/cheatsheets/scaling.test.ts:38:52
     36| })
     37| test('failed health checks are not a guarantee of zero traffic when AL…
     38|   expect(find('Health checks and fail-open').what).toMatch(
       |                                                    ^
     39|     /all registered targets are unhealthy.*fails open.*regardless of h…
     40|   )

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 5 passed (6)
   Start at  13:44:05
   Duration  171ms (transform 29ms, setup 0ms, import 40ms, tests 8ms, environment 0ms)


```

### restored-green

Command from `web/`: `pnpm exec vitest run src/lib/cheatsheets/scaling.test.ts src/components/ScalingReference.test.tsx`. Exit: 0.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  13:44:09
   Duration  1.52s (transform 182ms, setup 122ms, import 319ms, tests 221ms, environment 773ms)


```

### Task 3 gate

Full suite: 1,489/1,489 tests across 205 files. Format, lint and typecheck exited 0. No failed tests, warnings or errors observed in the gate output. `git diff --check` exited 0; tracked changes are limited to the canonical evidence report and the three Task 3 files. Build and live-browser checks remain deferred until registration.

#### format

Command from `web/`: `pnpm format`. Exit: 0.

```text

> web@0.1.0 format /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> prettier --write .

.prettierrc 37ms (unchanged)
e2e/audit-pages.spec.ts 62ms (unchanged)
e2e/audit-pages.ts 22ms (unchanged)
e2e/audit.spec.ts 151ms (unchanged)
e2e/count-expandables.mjs 38ms (unchanged)
e2e/dev-console.spec.ts 15ms (unchanged)
e2e/global-setup.ts 5ms (unchanged)
e2e/panel-states.ts 27ms (unchanged)
e2e/performance.spec.ts 87ms (unchanged)
e2e/smoke.spec.ts 24ms (unchanged)
eslint.config.mjs 4ms (unchanged)
next.config.ts 3ms (unchanged)
package.json 3ms (unchanged)
playwright.config.ts 10ms (unchanged)
playwright.dev.ts 3ms (unchanged)
playwright.prod.ts 2ms (unchanged)
pnpm-workspace.yaml 8ms (unchanged)
postcss.config.mjs 3ms (unchanged)
skills-lock.json 3ms (unchanged)
src/app/deploy-config.test.ts 62ms (unchanged)
src/app/globals.css 134ms (unchanged)
src/app/layout.tsx 35ms (unchanged)
src/app/page.tsx 13ms (unchanged)
src/app/public-assets.test.ts 7ms (unchanged)
src/app/reference/[slug]/page.tsx 4ms (unchanged)
src/app/reference/page.tsx 13ms (unchanged)
src/app/robots.ts 3ms (unchanged)
src/app/seo.test.ts 12ms (unchanged)
src/app/sitemap.ts 3ms (unchanged)
src/app/stages/[slug]/page.tsx 14ms (unchanged)
src/components/AnnotatedArtifact.tsx 6ms (unchanged)
src/components/artifact.test.ts 2ms (unchanged)
src/components/artifact.ts 3ms (unchanged)
src/components/ArtifactControls.tsx 6ms (unchanged)
src/components/CachingReference.test.tsx 9ms (unchanged)
src/components/Cheatsheet.test.tsx 27ms (unchanged)
src/components/Cheatsheet.tsx 16ms (unchanged)
src/components/CheatsheetSources.test.tsx 12ms (unchanged)
src/components/Figure.tsx 3ms (unchanged)
src/components/InlineCode.test.tsx 13ms (unchanged)
src/components/InlineCode.tsx 6ms (unchanged)
src/components/References.test.tsx 3ms (unchanged)
src/components/References.tsx 9ms (unchanged)
src/components/RevealFacet.source.test.ts 7ms (unchanged)
src/components/RevealFacet.test.tsx 5ms (unchanged)
src/components/RevealFacet.tsx 5ms (unchanged)
src/components/RevealList.test.tsx 35ms (unchanged)
src/components/RevealList.tsx 8ms (unchanged)
src/components/ScalingReference.test.tsx 3ms (unchanged)
src/components/Sidebar.test.tsx 8ms (unchanged)
src/components/Sidebar.tsx 25ms (unchanged)
src/components/stepper-numbering.test.ts 2ms (unchanged)
src/components/Stepper.test.tsx 6ms (unchanged)
src/components/Stepper.tsx 21ms (unchanged)
src/components/TeamNotes.tsx 4ms (unchanged)
src/components/term-visuals.tsx 8ms (unchanged)
src/components/Term.test.tsx 11ms (unchanged)
src/components/Term.tsx 10ms (unchanged)
src/components/ThemeToggle.tsx 4ms (unchanged)
src/components/TitleBlock.tsx 5ms (unchanged)
src/components/ui.tsx 6ms (unchanged)
src/features/architecture/ADRAnatomy.tsx 7ms (unchanged)
src/features/architecture/ai-plays.test.ts 13ms (unchanged)
src/features/architecture/ai-plays.ts 4ms (unchanged)
src/features/architecture/AIArchitecturePlays.tsx 13ms (unchanged)
src/features/architecture/ArchCarryForward.tsx 9ms (unchanged)
src/features/architecture/Architecture.tsx 65ms (unchanged)
src/features/architecture/AuthPaths.tsx 8ms (unchanged)
src/features/architecture/AuthzPatterns.tsx 9ms (unchanged)
src/features/architecture/BoundaryMap.tsx 6ms (unchanged)
src/features/architecture/CharacteristicPicker.tsx 7ms (unchanged)
src/features/architecture/characteristics-store.test.ts 2ms (unchanged)
src/features/architecture/characteristics-store.ts 2ms (unchanged)
src/features/architecture/characteristics.test.ts 13ms (unchanged)
src/features/architecture/characteristics.ts 6ms (unchanged)
src/features/architecture/concurrency.test.ts 12ms (unchanged)
src/features/architecture/concurrency.ts 6ms (unchanged)
src/features/architecture/ContractCost.tsx 4ms (unchanged)
src/features/architecture/contracts.test.ts 33ms (unchanged)
src/features/architecture/contracts.ts 8ms (unchanged)
src/features/architecture/DataFlow.tsx 6ms (unchanged)
src/features/architecture/ddl-sync.test.ts 6ms (unchanged)
src/features/architecture/defer.test.ts 12ms (unchanged)
src/features/architecture/defer.ts 7ms (unchanged)
src/features/architecture/DeferredList.tsx 3ms (unchanged)
src/features/architecture/DeleteBehaviour.tsx 2ms (unchanged)
src/features/architecture/DeploymentStyles.tsx 2ms (unchanged)
src/features/architecture/DomainSketch.tsx 3ms (unchanged)
src/features/architecture/DomainWorksheet.tsx 8ms (unchanged)
src/features/architecture/DriftDiagram.tsx 4ms (unchanged)
src/features/architecture/ERView.tsx 3ms (unchanged)
src/features/architecture/EvolutionNotes.tsx 1ms (unchanged)
src/features/architecture/evolve.test.ts 6ms (unchanged)
src/features/architecture/evolve.ts 3ms (unchanged)
src/features/architecture/ExpandContract.tsx 11ms (unchanged)
src/features/architecture/FitnessExamples.tsx 2ms (unchanged)
src/features/architecture/IdempotencyBlock.tsx 3ms (unchanged)
src/features/architecture/InternalOrganisation.tsx 6ms (unchanged)
src/features/architecture/IsolationLevels.tsx 6ms (unchanged)
src/features/architecture/LockingChoice.tsx 5ms (unchanged)
src/features/architecture/LockingStrategies.tsx 2ms (unchanged)
src/features/architecture/ModelInterrogation.test.tsx 3ms (unchanged)
src/features/architecture/ModelInterrogation.tsx 6ms (unchanged)
src/features/architecture/normal-forms.test.ts 8ms (unchanged)
src/features/architecture/normal-forms.ts 2ms (unchanged)
src/features/architecture/Normalisation.tsx 2ms (unchanged)
src/features/architecture/OneAppCosts.tsx 2ms (unchanged)
src/features/architecture/PartialUniqueIndex.tsx 2ms (unchanged)
src/features/architecture/ResiliencePatterns.tsx 3ms (unchanged)
src/features/architecture/ReversibilityAxis.tsx 8ms (unchanged)
src/features/architecture/ReversibilityTable.tsx 12ms (unchanged)
src/features/architecture/RouteShape.tsx 4ms (unchanged)
src/features/architecture/ScalingMoves.test.tsx 2ms (unchanged)
src/features/architecture/ScalingMoves.tsx 5ms (unchanged)
src/features/architecture/schema-blocks.test.ts 13ms (unchanged)
src/features/architecture/schema-blocks.ts 5ms (unchanged)
src/features/architecture/SchemaInspector.test.tsx 2ms (unchanged)
src/features/architecture/SchemaInspector.tsx 5ms (unchanged)
src/features/architecture/scoring.test.ts 25ms (unchanged)
src/features/architecture/scoring.ts 20ms (unchanged)
src/features/architecture/sketch.test.ts 34ms (unchanged)
src/features/architecture/sketch.ts 12ms (unchanged)
src/features/architecture/soft-delete.test.ts 4ms (unchanged)
src/features/architecture/soft-delete.ts 4ms (unchanged)
src/features/architecture/SoftDelete.tsx 2ms (unchanged)
src/features/architecture/SplitTrigger.tsx 6ms (unchanged)
src/features/architecture/steps.ts 1ms (unchanged)
src/features/architecture/styles.test.ts 7ms (unchanged)
src/features/architecture/styles.ts 4ms (unchanged)
src/features/architecture/SyncAsync.tsx 3ms (unchanged)
src/features/architecture/SystemSketch.tsx 4ms (unchanged)
src/features/architecture/TraceForward.tsx 2ms (unchanged)
src/features/architecture/YourCharacteristics.tsx 4ms (unchanged)
src/features/ci-cd/ai-plays.test.ts 5ms (unchanged)
src/features/ci-cd/ai-plays.ts 2ms (unchanged)
src/features/ci-cd/AIPlays.test.tsx 2ms (unchanged)
src/features/ci-cd/AIPlays.tsx 3ms (unchanged)
src/features/ci-cd/ci-artifact.test.ts 2ms (unchanged)
src/features/ci-cd/ci-artifact.ts 3ms (unchanged)
src/features/ci-cd/CiCd.test.tsx 3ms (unchanged)
src/features/ci-cd/CiCd.tsx 17ms (unchanged)
src/features/ci-cd/dependabot-artifact.test.ts 3ms (unchanged)
src/features/ci-cd/dependabot-artifact.ts 2ms (unchanged)
src/features/ci-cd/doc-source.ts 1ms (unchanged)
src/features/ci-cd/e2e-artifact.test.ts 3ms (unchanged)
src/features/ci-cd/e2e-artifact.ts 2ms (unchanged)
src/features/ci-cd/ordering-exercise.test.ts 4ms (unchanged)
src/features/ci-cd/ordering-exercise.ts 3ms (unchanged)
src/features/ci-cd/OrderingExercise.test.tsx 5ms (unchanged)
src/features/ci-cd/OrderingExercise.tsx 7ms (unchanged)
src/features/ci-cd/prose.test.ts 6ms (unchanged)
src/features/ci-cd/scaling.ts 2ms (unchanged)
src/features/ci-cd/steps.test.ts 1ms (unchanged)
src/features/ci-cd/steps.ts 1ms (unchanged)
src/features/ci-cd/traps.test.ts 3ms (unchanged)
src/features/ci-cd/traps.ts 1ms (unchanged)
src/features/code-review/ai-plays.test.ts 2ms (unchanged)
src/features/code-review/ai-plays.ts 2ms (unchanged)
src/features/code-review/AIPlays.test.tsx 2ms (unchanged)
src/features/code-review/AIPlays.tsx 2ms (unchanged)
src/features/code-review/checklist-items.test.ts 2ms (unchanged)
src/features/code-review/checklist-items.ts 3ms (unchanged)
src/features/code-review/CodeReview.tsx 12ms (unchanged)
src/features/code-review/CodeReviewChecklist.test.tsx 2ms (unchanged)
src/features/code-review/CodeReviewChecklist.tsx 7ms (unchanged)
src/features/code-review/doc-source.ts 1ms (unchanged)
src/features/code-review/done.test.ts 2ms (unchanged)
src/features/code-review/done.ts 1ms (unchanged)
src/features/code-review/pr-template.test.ts 2ms (unchanged)
src/features/code-review/pr-template.ts 1ms (unchanged)
src/features/code-review/prose.test.ts 6ms (unchanged)
src/features/code-review/review-areas.test.ts 2ms (unchanged)
src/features/code-review/review-areas.ts 1ms (unchanged)
src/features/code-review/review-drill.test.ts 2ms (unchanged)
src/features/code-review/review-drill.ts 2ms (unchanged)
src/features/code-review/ReviewDrill.test.tsx 7ms (unchanged)
src/features/code-review/ReviewDrill.tsx 4ms (unchanged)
src/features/code-review/self-review.test.ts 3ms (unchanged)
src/features/code-review/self-review.ts 1ms (unchanged)
src/features/code-review/SelfReviewMatch.test.tsx 5ms (unchanged)
src/features/code-review/SelfReviewMatch.tsx 5ms (unchanged)
src/features/code-review/severity-drill.test.ts 3ms (unchanged)
src/features/code-review/severity-drill.ts 2ms (unchanged)
src/features/code-review/SeverityDrill.test.tsx 4ms (unchanged)
src/features/code-review/SeverityDrill.tsx 6ms (unchanged)
src/features/code-review/steps.test.ts 2ms (unchanged)
src/features/code-review/steps.ts 1ms (unchanged)
src/features/code-review/team.test.ts 2ms (unchanged)
src/features/code-review/team.ts 1ms (unchanged)
src/features/code-review/traps.test.ts 5ms (unchanged)
src/features/code-review/traps.ts 2ms (unchanged)
src/features/development/ai-plays.test.ts 4ms (unchanged)
src/features/development/ai-plays.ts 2ms (unchanged)
src/features/development/AIPlays.test.tsx 2ms (unchanged)
src/features/development/AIPlays.tsx 3ms (unchanged)
src/features/development/artifacts.test.ts 4ms (unchanged)
src/features/development/artifacts.ts 8ms (unchanged)
src/features/development/AuthorizationDrill.test.tsx 12ms (unchanged)
src/features/development/AuthorizationDrill.tsx 6ms (unchanged)
src/features/development/checklist.test.ts 8ms (unchanged)
src/features/development/checklist.ts 2ms (unchanged)
src/features/development/ClientBoundary.test.tsx 5ms (unchanged)
src/features/development/ClientBoundary.tsx 8ms (unchanged)
src/features/development/DevChecklist.test.tsx 8ms (unchanged)
src/features/development/DevChecklist.tsx 6ms (unchanged)
src/features/development/Development.tsx 31ms (unchanged)
src/features/development/doc-source.ts 1ms (unchanged)
src/features/development/loop.test.ts 4ms (unchanged)
src/features/development/loop.ts 2ms (unchanged)
src/features/development/LoopFlow.test.tsx 5ms (unchanged)
src/features/development/LoopFlow.tsx 4ms (unchanged)
src/features/development/prose.test.ts 6ms (unchanged)
src/features/development/snippets.test.ts 3ms (unchanged)
src/features/development/snippets.ts 2ms (unchanged)
src/features/development/steps.test.ts 1ms (unchanged)
src/features/development/steps.ts 1ms (unchanged)
src/features/development/traps.test.ts 2ms (unchanged)
src/features/development/traps.ts 1ms (unchanged)
src/features/discovery/AIWorkflow.tsx 5ms (unchanged)
src/features/discovery/DiscoveryFlow.tsx 6ms (unchanged)
src/features/discovery/OpportunityTree.tsx 7ms (unchanged)
src/features/discovery/PipelineFit.tsx 3ms (unchanged)
src/features/discovery/ProductDiscovery.tsx 15ms (unchanged)
src/features/discovery/QuestionLab.tsx 9ms (unchanged)
src/features/discovery/SeverityScorer.tsx 4ms (unchanged)
src/features/discovery/steps.test.ts 1ms (unchanged)
src/features/discovery/steps.ts 1ms (unchanged)
src/features/discovery/Toolkit.tsx 6ms (unchanged)
src/features/discovery/ValidationLadder.tsx 3ms (unchanged)
src/features/discovery/WorkedExample.tsx 6ms (unchanged)
src/features/discovery/Worksheet.tsx 9ms (unchanged)
src/features/incident-management/IncidentChecklist.tsx 9ms (unchanged)
src/features/incident-management/IncidentManagement.tsx 1ms (unchanged)
src/features/incident-management/NudgeRehearsal.tsx 10ms (unchanged)
src/features/incident-management/panels-followup.tsx 19ms (unchanged)
src/features/incident-management/panels-response.tsx 12ms (unchanged)
src/features/incident-management/steps.ts 1ms (unchanged)
src/features/observability/ai-plays.test.ts 3ms (unchanged)
src/features/observability/ai-plays.ts 2ms (unchanged)
src/features/observability/AIPlays.test.tsx 2ms (unchanged)
src/features/observability/AIPlays.tsx 2ms (unchanged)
src/features/observability/alert-triage.test.ts 3ms (unchanged)
src/features/observability/alert-triage.ts 2ms (unchanged)
src/features/observability/artifacts.test.ts 4ms (unchanged)
src/features/observability/artifacts.ts 4ms (unchanged)
src/features/observability/checklist.test.ts 3ms (unchanged)
src/features/observability/checklist.ts 6ms (unchanged)
src/features/observability/doc-source.ts 1ms (unchanged)
src/features/observability/drill-types.ts 2ms (unchanged)
src/features/observability/Drill.test.tsx 6ms (unchanged)
src/features/observability/Drill.tsx 14ms (unchanged)
src/features/observability/log-levels.test.ts 3ms (unchanged)
src/features/observability/log-levels.ts 2ms (unchanged)
src/features/observability/Observability.test.tsx 5ms (unchanged)
src/features/observability/Observability.tsx 1ms (unchanged)
src/features/observability/ObservabilityChecklist.test.tsx 4ms (unchanged)
src/features/observability/ObservabilityChecklist.tsx 5ms (unchanged)
src/features/observability/panels-act.test.tsx 4ms (unchanged)
src/features/observability/panels-act.tsx 43ms (unchanged)
src/features/observability/panels-collect.test.tsx 12ms (unchanged)
src/features/observability/panels-collect.tsx 27ms (unchanged)
src/features/observability/prose.test.ts 2ms (unchanged)
src/features/observability/scrubber.test.ts 4ms (unchanged)
src/features/observability/scrubber.ts 2ms (unchanged)
src/features/observability/signals.test.ts 3ms (unchanged)
src/features/observability/signals.ts 1ms (unchanged)
src/features/observability/silence.test.ts 3ms (unchanged)
src/features/observability/silence.ts 1ms (unchanged)
src/features/observability/steps.test.ts 1ms (unchanged)
src/features/observability/steps.ts 1ms (unchanged)
src/features/observability/traps.test.ts 3ms (unchanged)
src/features/observability/traps.ts 1ms (unchanged)
src/features/performance/artifacts.ts 1ms (unchanged)
src/features/performance/baseline.ts 2ms (unchanged)
src/features/performance/BaselineLab.test.tsx 4ms (unchanged)
src/features/performance/BaselineLab.tsx 6ms (unchanged)
src/features/performance/checklist.test.ts 2ms (unchanged)
src/features/performance/checklist.ts 1ms (unchanged)
src/features/performance/content.test.ts 2ms (unchanged)
src/features/performance/content.ts 3ms (unchanged)
src/features/performance/CopyText.tsx 2ms (unchanged)
src/features/performance/DecisionDrill.test.tsx 7ms (unchanged)
src/features/performance/DecisionDrill.tsx 7ms (unchanged)
src/features/performance/decisions.test.ts 6ms (unchanged)
src/features/performance/decisions.ts 8ms (unchanged)
src/features/performance/journey.ts 3ms (unchanged)
src/features/performance/OrderJourney.test.tsx 5ms (unchanged)
src/features/performance/OrderJourney.tsx 7ms (unchanged)
src/features/performance/panels-close.tsx 4ms (unchanged)
src/features/performance/panels-diagnose.tsx 6ms (unchanged)
src/features/performance/panels-measure.tsx 4ms (unchanged)
src/features/performance/panels.test.tsx 9ms (unchanged)
src/features/performance/PerformanceChecklist.test.tsx 5ms (unchanged)
src/features/performance/PerformanceChecklist.tsx 10ms (unchanged)
src/features/performance/PerformanceOptimization.test.tsx 11ms (unchanged)
src/features/performance/PerformanceOptimization.tsx 1ms (unchanged)
src/features/performance/PerformanceWorksheet.test.tsx 11ms (unchanged)
src/features/performance/PerformanceWorksheet.tsx 6ms (unchanged)
src/features/performance/steps.ts 4ms (unchanged)
src/features/planning/AIPlanningPlays.tsx 8ms (unchanged)
src/features/planning/CarryForward.tsx 4ms (unchanged)
src/features/planning/CutFunnel.tsx 4ms (unchanged)
src/features/planning/CutTable.tsx 5ms (unchanged)
src/features/planning/DecompositionLadder.tsx 7ms (unchanged)
src/features/planning/DoneStatement.tsx 21ms (unchanged)
src/features/planning/HorizonBands.tsx 13ms (unchanged)
src/features/planning/HorizonBoard.tsx 2ms (unchanged)
src/features/planning/HorizonTriage.tsx 14ms (unchanged)
src/features/planning/PlanAnatomy.tsx 6ms (unchanged)
src/features/planning/Planning.tsx 30ms (unchanged)
src/features/planning/PlanningScope.tsx 3ms (unchanged)
src/features/planning/PlanWorksheet.tsx 8ms (unchanged)
src/features/planning/RiskOrder.tsx 5ms (unchanged)
src/features/planning/scoring.test.ts 16ms (unchanged)
src/features/planning/scoring.ts 8ms (unchanged)
src/features/planning/SizeScorer.tsx 6ms (unchanged)
src/features/planning/SliceAnatomy.tsx 2ms (unchanged)
src/features/planning/SliceSequencer.tsx 9ms (unchanged)
src/features/planning/SpikeCard.tsx 10ms (unchanged)
src/features/planning/steps.test.ts 1ms (unchanged)
src/features/planning/steps.ts 1ms (unchanged)
src/features/post-deployment-verification/ai-plays.test.ts 4ms (unchanged)
src/features/post-deployment-verification/ai-plays.ts 1ms (unchanged)
src/features/post-deployment-verification/AIPlays.test.tsx 2ms (unchanged)
src/features/post-deployment-verification/AIPlays.tsx 2ms (unchanged)
src/features/post-deployment-verification/aws-verification.test.ts 5ms (unchanged)
src/features/post-deployment-verification/aws-verification.ts 2ms (unchanged)
src/features/post-deployment-verification/checklist.test.ts 3ms (unchanged)
src/features/post-deployment-verification/checklist.ts 2ms (unchanged)
src/features/post-deployment-verification/doc-source.ts 1ms (unchanged)
src/features/post-deployment-verification/PostDeploymentVerification.test.tsx 3ms (unchanged)
src/features/post-deployment-verification/PostDeploymentVerification.tsx 13ms (unchanged)
src/features/post-deployment-verification/prose.test.ts 2ms (unchanged)
src/features/post-deployment-verification/steps.test.ts 1ms (unchanged)
src/features/post-deployment-verification/steps.ts 1ms (unchanged)
src/features/post-deployment-verification/traps.test.ts 3ms (unchanged)
src/features/post-deployment-verification/traps.ts 1ms (unchanged)
src/features/post-deployment-verification/VerificationChecklist.test.tsx 5ms (unchanged)
src/features/post-deployment-verification/VerificationChecklist.tsx 9ms (unchanged)
src/features/production-deployment/ai-plays.test.ts 2ms (unchanged)
src/features/production-deployment/ai-plays.ts 2ms (unchanged)
src/features/production-deployment/AIPlays.test.tsx 2ms (unchanged)
src/features/production-deployment/AIPlays.tsx 2ms (unchanged)
src/features/production-deployment/aws-data.test.ts 2ms (unchanged)
src/features/production-deployment/aws-data.ts 2ms (unchanged)
src/features/production-deployment/checklist.test.ts 3ms (unchanged)
src/features/production-deployment/checklist.ts 2ms (unchanged)
src/features/production-deployment/DeploymentChecklist.test.tsx 2ms (unchanged)
src/features/production-deployment/DeploymentChecklist.tsx 4ms (unchanged)
src/features/production-deployment/doc-source.ts 1ms (unchanged)
src/features/production-deployment/migration-artifact.test.ts 1ms (unchanged)
src/features/production-deployment/migration-artifact.ts 1ms (unchanged)
src/features/production-deployment/pipeline-artifact.test.ts 2ms (unchanged)
src/features/production-deployment/pipeline-artifact.ts 1ms (unchanged)
src/features/production-deployment/ProductionDeployment.test.tsx 2ms (unchanged)
src/features/production-deployment/ProductionDeployment.tsx 17ms (unchanged)
src/features/production-deployment/prose.test.ts 2ms (unchanged)
src/features/production-deployment/steps.test.ts 1ms (unchanged)
src/features/production-deployment/steps.ts 1ms (unchanged)
src/features/production-deployment/traps.test.ts 3ms (unchanged)
src/features/production-deployment/traps.ts 4ms (unchanged)
src/features/rails.test.tsx 3ms (unchanged)
src/features/security-audit/content.ts 2ms (unchanged)
src/features/security-audit/IdorProbe.tsx 2ms (unchanged)
src/features/security-audit/PolicyMatrix.tsx 3ms (unchanged)
src/features/security-audit/SecurityAudit.test.tsx 6ms (unchanged)
src/features/security-audit/SecurityAudit.tsx 13ms (unchanged)
src/features/setup/ai-plays.test.ts 5ms (unchanged)
src/features/setup/ai-plays.ts 1ms (unchanged)
src/features/setup/AIPlays.test.tsx 2ms (unchanged)
src/features/setup/AIPlays.tsx 7ms (unchanged)
src/features/setup/AnnotatedArtifact.test.tsx 6ms (unchanged)
src/features/setup/artifact-affordances.test.tsx 6ms (unchanged)
src/features/setup/artifacts.test.ts 4ms (unchanged)
src/features/setup/artifacts.ts 7ms (unchanged)
src/features/setup/blockers.test.ts 3ms (unchanged)
src/features/setup/blockers.ts 2ms (unchanged)
src/features/setup/checklist.test.ts 5ms (unchanged)
src/features/setup/checklist.ts 2ms (unchanged)
src/features/setup/client-trap.test.ts 3ms (unchanged)
src/features/setup/client-trap.ts 1ms (unchanged)
src/features/setup/ClientTrap.test.tsx 6ms (unchanged)
src/features/setup/ClientTrap.tsx 11ms (unchanged)
src/features/setup/DeployBlockers.test.tsx 12ms (unchanged)
src/features/setup/DeployBlockers.tsx 5ms (unchanged)
src/features/setup/doc-source.ts 1ms (unchanged)
src/features/setup/env-restart.test.ts 2ms (unchanged)
src/features/setup/PinExercise.test.tsx 9ms (unchanged)
src/features/setup/PinExercise.tsx 7ms (unchanged)
src/features/setup/pins.test.ts 4ms (unchanged)
src/features/setup/pins.ts 1ms (unchanged)
src/features/setup/Setup.test.tsx 3ms (unchanged)
src/features/setup/Setup.tsx 36ms (unchanged)
src/features/setup/SetupChecklist.test.tsx 4ms (unchanged)
src/features/setup/SetupChecklist.tsx 5ms (unchanged)
src/features/setup/steps.test.ts 2ms (unchanged)
src/features/setup/steps.ts 1ms (unchanged)
src/features/setup/traps.test.ts 3ms (unchanged)
src/features/setup/traps.ts 1ms (unchanged)
src/features/setup/tree.test.ts 4ms (unchanged)
src/features/setup/tree.ts 3ms (unchanged)
src/features/setup/TreeInspector.test.tsx 7ms (unchanged)
src/features/setup/TreeInspector.tsx 5ms (unchanged)
src/features/stage-08-port.test.tsx 2ms (unchanged)
src/features/stage-16-port.test.tsx 18ms (unchanged)
src/features/stage-content.ts 2ms (unchanged)
src/features/staging/ai-plays.test.ts 3ms (unchanged)
src/features/staging/ai-plays.ts 4ms (unchanged)
src/features/staging/AIPlays.test.tsx 3ms (unchanged)
src/features/staging/AIPlays.tsx 8ms (unchanged)
src/features/staging/checklist-items.test.ts 3ms (unchanged)
src/features/staging/checklist-items.tsx 2ms (unchanged)
src/features/staging/checklist.test.ts 5ms (unchanged)
src/features/staging/checklist.ts 1ms (unchanged)
src/features/staging/doc-source.ts 1ms (unchanged)
src/features/staging/PreviewOrStaging.test.tsx 6ms (unchanged)
src/features/staging/PreviewOrStaging.tsx 4ms (unchanged)
src/features/staging/prose.test.ts 2ms (unchanged)
src/features/staging/scenarios.test.ts 2ms (unchanged)
src/features/staging/scenarios.ts 4ms (unchanged)
src/features/staging/seed-data.test.ts 2ms (unchanged)
src/features/staging/seed-data.ts 1ms (unchanged)
src/features/staging/Staging.test.tsx 2ms (unchanged)
src/features/staging/Staging.tsx 27ms (unchanged)
src/features/staging/StagingChecklist.test.tsx 31ms (unchanged)
src/features/staging/StagingChecklist.tsx 9ms (unchanged)
src/features/staging/steps.test.ts 3ms (unchanged)
src/features/staging/steps.ts 2ms (unchanged)
src/features/staging/traps.test.ts 3ms (unchanged)
src/features/staging/traps.ts 2ms (unchanged)
src/features/step-ids.ts 4ms (unchanged)
src/features/testing/ai-plays.test.ts 3ms (unchanged)
src/features/testing/ai-plays.ts 4ms (unchanged)
src/features/testing/AIPlays.test.tsx 2ms (unchanged)
src/features/testing/AIPlays.tsx 6ms (unchanged)
src/features/testing/artifacts.test.ts 4ms (unchanged)
src/features/testing/artifacts.ts 4ms (unchanged)
src/features/testing/checklist.test.ts 4ms (unchanged)
src/features/testing/checklist.ts 3ms (unchanged)
src/features/testing/doc-source.ts 1ms (unchanged)
src/features/testing/layers.test.ts 8ms (unchanged)
src/features/testing/layers.ts 2ms (unchanged)
src/features/testing/LayerThread.test.tsx 2ms (unchanged)
src/features/testing/LayerThread.tsx 5ms (unchanged)
src/features/testing/probes.test.ts 2ms (unchanged)
src/features/testing/probes.ts 1ms (unchanged)
src/features/testing/prose.test.ts 7ms (unchanged)
src/features/testing/steps.test.ts 1ms (unchanged)
src/features/testing/steps.ts 1ms (unchanged)
src/features/testing/teeth.test.ts 2ms (unchanged)
src/features/testing/teeth.ts 1ms (unchanged)
src/features/testing/TeethCheck.test.tsx 7ms (unchanged)
src/features/testing/TeethCheck.tsx 9ms (unchanged)
src/features/testing/Testing.test.tsx 3ms (unchanged)
src/features/testing/Testing.tsx 19ms (unchanged)
src/features/testing/TestingChecklist.test.tsx 3ms (unchanged)
src/features/testing/TestingChecklist.tsx 6ms (unchanged)
src/features/testing/traps.test.ts 2ms (unchanged)
src/features/testing/traps.ts 2ms (unchanged)
src/features/testing/triage.test.ts 5ms (unchanged)
src/features/testing/triage.ts 3ms (unchanged)
src/features/testing/TriageDrill.test.tsx 4ms (unchanged)
src/features/testing/TriageDrill.tsx 7ms (unchanged)
src/lib/architecture-sheet.test.ts 3ms (unchanged)
src/lib/architecture-sheet.ts 3ms (unchanged)
src/lib/cheatsheets/api-design.ts 2ms (unchanged)
src/lib/cheatsheets/architecture-patterns.ts 2ms (unchanged)
src/lib/cheatsheets/aws-deployment.ts 3ms (unchanged)
src/lib/cheatsheets/caching.test.ts 6ms (unchanged)
src/lib/cheatsheets/caching.ts 2ms (unchanged)
src/lib/cheatsheets/ci-cd.ts 4ms (unchanged)
src/lib/cheatsheets/clean-code.ts 4ms (unchanged)
src/lib/cheatsheets/code-review.ts 2ms (unchanged)
src/lib/cheatsheets/coding-standards.ts 1ms (unchanged)
src/lib/cheatsheets/deployment-environments.ts 1ms (unchanged)
src/lib/cheatsheets/design-patterns.ts 2ms (unchanged)
src/lib/cheatsheets/generate-highlighted.test.ts 1ms (unchanged)
src/lib/cheatsheets/generate-highlighted.ts 2ms (unchanged)
src/lib/cheatsheets/git-branching.ts 3ms (unchanged)
src/lib/cheatsheets/git-cheatsheet.ts 3ms (unchanged)
src/lib/cheatsheets/git-commands.ts 3ms (unchanged)
src/lib/cheatsheets/github-actions.ts 4ms (unchanged)
src/lib/cheatsheets/incident-management.ts 2ms (unchanged)
src/lib/cheatsheets/index.test.ts 18ms (unchanged)
src/lib/cheatsheets/index.ts 3ms (unchanged)
src/lib/cheatsheets/planned.ts 1ms (unchanged)
src/lib/cheatsheets/playwright.ts 3ms (unchanged)
src/lib/cheatsheets/post-deploy-verification.ts 9ms (unchanged)
src/lib/cheatsheets/render-citations.test.ts 3ms (unchanged)
src/lib/cheatsheets/render.test.ts 1ms (unchanged)
src/lib/cheatsheets/render.ts 5ms (unchanged)
src/lib/cheatsheets/scaling.test.ts 4ms (unchanged)
src/lib/cheatsheets/scaling.ts 2ms (unchanged)
src/lib/cheatsheets/sdlc.ts 2ms (unchanged)
src/lib/cheatsheets/security.ts 2ms (unchanged)
src/lib/cheatsheets/sheet-sources.test.ts 3ms (unchanged)
src/lib/cheatsheets/sheet-sources.ts 1ms (unchanged)
src/lib/cheatsheets/solid-principles.ts 2ms (unchanged)
src/lib/cheatsheets/testing.ts 2ms (unchanged)
src/lib/cheatsheets/types.ts 3ms (unchanged)
src/lib/discovery-sheet.test.ts 3ms (unchanged)
src/lib/discovery-sheet.ts 2ms (unchanged)
src/lib/glossary.test.ts 2ms (unchanged)
src/lib/glossary.ts 2ms (unchanged)
src/lib/highlight.test.ts 3ms (unchanged)
src/lib/highlight.ts 3ms (unchanged)
src/lib/performance-sheet.test.ts 2ms (unchanged)
src/lib/performance-sheet.ts 3ms (unchanged)
src/lib/references.test.ts 4ms (unchanged)
src/lib/references.ts 7ms (unchanged)
src/lib/site.test.ts 2ms (unchanged)
src/lib/site.ts 1ms (unchanged)
src/lib/source-citations.test.ts 6ms (unchanged)
src/lib/stage-03-structure.test.ts 8ms (unchanged)
src/lib/stage-08-structure.test.ts 2ms (unchanged)
src/lib/stage-09-structure.test.ts 27ms (unchanged)
src/lib/stage-15-structure.test.ts 20ms (unchanged)
src/lib/stage-16-structure.test.ts 7ms (unchanged)
src/lib/stage-metadata.test.ts 3ms (unchanged)
src/lib/stages.test.ts 5ms (unchanged)
src/lib/stages.ts 13ms (unchanged)
src/lib/term-usage.test.ts 7ms (unchanged)
src/lib/terms.test.ts 4ms (unchanged)
src/lib/terms.ts 27ms (unchanged)
src/lib/tracker-ledger.test.ts 5ms (unchanged)
src/lib/typography.test.ts 5ms (unchanged)
src/lib/useLocalStorage.ts 4ms (unchanged)
src/test/build-freshness.test.ts 3ms (unchanged)
src/test/build-freshness.ts 7ms (unchanged)
src/test/doc-source.test.ts 3ms (unchanged)
src/test/doc-source.ts 3ms (unchanged)
src/test/harness.test.ts 3ms (unchanged)
src/test/localstorage-polyfill.ts 3ms (unchanged)
src/test/setup.ts 1ms (unchanged)
tsconfig.json 1ms (unchanged)
vitest.config.ts 1ms (unchanged)

```

#### lint

Command from `web/`: `pnpm lint`. Exit: 0.

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> eslint --max-warnings 0


```

#### typecheck

Command from `web/`: `pnpm typecheck`. Exit: 0.

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully

```

#### full-suite

Command from `web/`: `pnpm test --run`. Exit: 0.

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run --run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  205 passed (205)
      Tests  1489 passed (1489)
   Start at  13:45:11
   Duration  73.51s (transform 29.36s, setup 38.05s, import 70.97s, tests 146.02s, environment 190.32s)


```

## Task 3 independent review

### Spec Compliance

- ✅ **Spec compliant for Task 3.** All three authored files and the canonical evidence-report update are present in the packaged `8e2a5c03b8015dc5fc8e54e6ae7ee4195d005114..b39d9e0ed05dc29a7c77a47809bb7b5ad264ff94` diff. No missing, extra or misunderstood task-local requirement was found.

| Requirement | Evidence and assessment |
| --- | --- |
| Export the static scaling lookup, without registration | `web/src/lib/cheatsheets/scaling.ts:3` exports `scaling: Cheatsheet`; lines 4–7 supply the required slug, title, group and stage. The complete package changes only this data module, its two tests and the evidence report; registry and generated content remain outside this task. |
| Four sections; distinguish infrastructure from team practice | `scaling.ts:28`, `:53`, `:78`, `:103` provide the four requested sections; `:29` preserves Stage 09's team-practice distinction. `web/src/lib/cheatsheets/scaling.test.ts:8` guards titles, stage and distinction; `web/src/components/ScalingReference.test.tsx:6` exercises the real renderer and stage href. |
| Locate the measured constraint; preserve shared-dependency limits | `scaling.ts:33` names workload and resource evidence; `:38`, `:43`, `:44`, `:48` qualify vertical/horizontal capacity and state/session/connection assumptions. The shared-database caveat has a unit assertion at `scaling.test.ts:19` and a DOM assertion at `ScalingReference.test.tsx:15`. |
| ALB routing conditions, workloads and feature compatibility | `scaling.ts:54` scopes the list to AWS ALB and explains stickiness; `:58`–`:69` preserve normal healthy-target routing, similarly costly requests/capable targets, varying cost/capability, least-outstanding/slow-start incompatibility, and weighted-random/stickiness/slow-start incompatibilities. ATW mitigation remains optional. `scaling.test.ts:27` guards the consequential compatibility prose, and `ScalingReference.test.tsx:12` guards rendered weighted-random limits. |
| Fail-open, draining and failure capacity | `scaling.ts:83` states the all-unhealthy fail-open condition; `:84` also directs readers to thresholds/reason codes and denies a zero-traffic guarantee. `:88`–`:89` preserve draining and remaining-capacity qualifications. Unit guard at `scaling.test.ts:37`, DOM guard at `ScalingReference.test.tsx:9`, and isolated teeth evidence cover fail-open. |
| Bounded overload and retries; reconciliation | `scaling.ts:93` bounds admitted work/queues; `:94` preserves payment/authorization safety; `:98`–`:99` require bounded retries and reconciliation before replaying uncertain writes/charges. `scaling.test.ts:45` guards the bounded-work/retry and delayed-work/correctness clauses. |
| Workload, percentile population and user-outcome caveats | `scaling.ts:104` rejects universal throughput/replica targets; `:108` preserves observer, segment, workload, window, failures and percentile population. `:109` denies that a faster server span proves a faster user operation. `:113`–`:119` retain oldest pending work, failure capacity, correctness, cost and keep/revert evidence. These are present verbatim; the oldest-work/correctness assertions are at `scaling.test.ts:52`. |
| Three sources with primary-image role preserved | `scaling.ts:10`–`:25` provide AWS attributes, AWS health and Google SRE in the requested order, with no images. `scaling.test.ts:56` asserts publisher order. `ScalingReference.test.tsx:27` asserts three footer links, `:29` pins Google's actual href, and `:33` checks both AWS credits. The focused unchanged-renderer check below verifies that AWS hrefs use the supplied citation URLs. |
| Literal read-only command; plain-text prose | `scaling.ts:72` keeps the quoted ARN command in `code`, with credentials/read-permission/test-group prerequisites at `:73`. No executable infrastructure logic or mutation command is added. Unit checks at `scaling.test.ts:62` and DOM checks at `ScalingReference.test.tsx:34` cover the displayed describe command and absent mutation command. All explanatory row prose stays in `what`/`when`. |
| RED, GREEN, isolated teeth and restored GREEN, recorded canonically | `docs/superpowers/reports/2026-10-13-stage-09-reference.md:2080`, `:2133`, `:2150`, `:2191` contain raw runs, commands and exit status. RED is honestly described as missing-import setup failure; teeth changes the fail-open fact and produces exactly one failed unit test with five passing. Restored runs pass both files, 8/8 tests. |
| Humanizer and required task gates | Canonical report `:2072` records the humanizer pass and retained factual constraints. Raw format/lint/generated-route typecheck gates appear at `:2212`, `:2760`, `:2772`; full-suite output at `:2786` records 205 files and 1,489 passing tests. No warning/error noise is present outside intended RED/teeth failures. |
| Scope and global constraints | The four-file package contains no dependencies, config, renderer, tokens, diagrams, images, runtime infrastructure, chapter/port changes or language sheets. It retains TypeScript as the source and postpones generated Markdown/snapshots to registration. Existing reference UI is reused by the DOM tests. Canonical report `:2078` explicitly records the deferred integration/browser/records work. |

- ⚠️ **Cannot verify from this diff:** live contrast in both themes, 320–2560px overflow/touch checks, production console and development React diagnostics. These require Task 4's registered production/development builds; DOM evidence is not a substitute.
- ⚠️ **Cannot verify from this diff:** eventual generated Markdown/snapshots, W-3 15/18 and combined W-6 22 drawn/27 registered, registry/routes, tracker/task/KICKOFF updates. They are expressly deferred to Task 4; the controller must check their combined result.
- ⚠️ **Cannot independently verify from this diff:** exact commit coauthor trailer, develop ancestry, approved spec/plan presence, current clean tree/index and no push/merge. The package names the task commit, but lacks those Git records. `task-3-report.md:750` claims controller checks; the controller retains ownership of validating them. No Git command was run during review.
- ⚠️ **Process visibility boundary:** terminal timestamps and narrative provide the requested RED-before-GREEN evidence; a final diff alone cannot independently reconstruct the historical write order or prove an invocation of the humanizer skill. The raw teeth run establishes the consequential assertion's ability to reject the named regression.

### Strengths

- `scaling.ts:43`–`:48`, `:93`–`:99`, `:108`–`:119` connect scaling choices to state, shared limits, bounded work and customer outcomes, avoiding a claim that replicas or healthy probes prove success.
- `ScalingReference.test.tsx:6` and `:24` render the actual sheet through the real shared component without mocks. These tests would reject a renderer that omitted the critical fail-open/shared-limit/compatibility prose, stage link, citations or command.
- Canonical report `:2150` preserves the incorrect mutated sentence and exact failing assertion. It disproves a vacuous fail-open guard rather than presenting GREEN alone as TDD evidence.
- `scaling.ts:3` is a small, single-purpose static module using the existing interface. The task introduces no new abstraction or runtime error-handling path; both test modules remain small and focused.

### Issues

#### Critical (Must Fix)

- None found.

#### Important (Should Fix)

- None found. No blocking implementer error or plan-authored error identified.

#### Minor (Nice to Have)

- None requiring a task-local change. Cross-task checks listed above are verification boundaries, not findings or silently deferred defects.

### Assessment

**Task quality:** Approved — review clean.

**Reasoning:** The complete data module matches the approved teaching content, the real DOM tests cover consequential output, and raw isolated teeth evidence rejects the named safety regression. Task 3 deliberately stops before registration and live verification; approval does not imply the whole branch is ready to merge.

**Focused check — rendered citation destination risk:** The DOM test directly pins only Google's URL, so I checked whether the unchanged renderer could alter or misroute the two AWS links. One focused `rg` check of `web/src/components/Cheatsheet.tsx:21` and `:180`–`:185` shows sources from `sheetSources(sheet)` and `href={citation.url}`. Together with the authored URLs at `scaling.ts:13` and `:19` and three rendered-link evidence, this disproves a task-local destination mismatch. No other unchanged code was inspected.

**Primary-source checks — provider-fact risks:** On 2026-10-13 I checked the authored [AWS target-group attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html), [AWS health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) and [Google SRE overload chapter](https://sre.google/sre-book/handling-overload/) for routing/compatibility/fail-open and bounded-retry claims. They support those authored qualifications. The attributes page also describes unhealthy-state thresholds, which the sheet asks readers to inspect; the sheet does not claim all-unhealthy is the only possible fail-open trigger. No factual correction found.

**Review checks:** The packaged diff was read once. Tool-output truncation hid part of the documentation's formatter listing; that evidence was recovered from the supplied task report. Complete implementation/test hunks were visible, so no changed source file was reread and no mid-function exception was needed. No duplicate test, Git command, source/index/ref mutation or subagent dispatch occurred. The only written artifact is this requested review report.

**Branch boundary:** Task commit `b39d9e0`; recorded full suite 1,489/1,489 across 205 files, format/lint/typecheck exit 0. Build/browser verification remains pending Task 4. Clean tree, trailer and ancestry remain controller-owned. NOT merged, NOT deployed.

Controller resolution on 2026-10-14: exact commit coauthor trailer verified, approved spec/plan present, develop ancestry check exited 0, and current tracked tree clean. Task 3 made no merge, push or deployment. Recorded RED/teeth evidence and invoked humanizer review satisfy the historical-process evidence boundary; final diff alone is not claimed to reconstruct write order. Registration, counts, generated artifacts and live/records checks belong to Task 4. Task 3: review clean.

Execution ruling: Task 4 implementation and records commits precede final whole-branch review, which requires the complete committed branch diff. Test/live/cold-lookup verification still precedes its implementation commit. If wrong, this costs review-triggered follow-up commits instead of one initial commit.
