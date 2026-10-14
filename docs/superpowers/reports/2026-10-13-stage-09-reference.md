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

## Task 4: registration, generated artifacts and source ledger

Execution date: 2026-10-14. The approved design and plan remain dated 2026-10-13. Task 4 began at `e2aa15fbb2577e4f9d5cbef87decb214267bbe08` on `feat/stage-09-reference-companions`.

Added the two integrated tests before changing the registry. The integration RED failed for the right reason: Stage 09 returned no registered companions, the Markdown omitted Caching, and both render cases received undefined sheet data. Registering caching and scaling made all four cases pass. Existing registry values and all five language placeholders remain present. The branch has 22 drawn of 27 registered; local develop remains 20 of 25 and W-3 remains 15/18.

The generator guards then failed on both genuinely stale file snapshots. Both repository generators ran only with the correct registry in place. The focused suite passed 29/29 across five files. Changing only the scaling registry stage to 03-architecture made exactly the companion/tether test fail in the full two-test integration file; generated-Markdown content still passed. The registry was restored and the same five-file suite passed 29/29. Snapshots were never regenerated under mutation.

The first attempt to launch the RED capture helper used the repository root instead of web and exited 2 because the helper path was wrong. No test ran in that attempt; it is not RED evidence. Every test and app gate below ran from web.

### Task 4 integration-red

Command: `pnpm exec vitest run src/lib/cheatsheets/stage09-reference.test.ts src/components/Stage09Reference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/stage09-reference.test.ts (2 tests | 2 failed) 7ms
   × stage 09 exposes both drawn companion sheets without consuming the five language placeholders 4ms
   × generated Markdown includes each companion, its load-bearing caveats and every supporting source 2ms
 ❯ |dom| src/components/Stage09Reference.test.tsx (2 tests | 2 failed) 4ms
   × the registered caching route data renders drawn content and its stage tether 3ms
   × the registered scaling route data renders drawn content and its stage tether 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/stage09-reference.test.ts > stage 09 exposes both drawn companion sheets without consuming the five language placeholders
AssertionError: expected [] to deeply equal [ 'caching', 'scaling' ]

- Expected
+ Received

- [
-   "caching",
-   "scaling",
- ]
+ []

 ❯ src/lib/cheatsheets/stage09-reference.test.ts:8:52
      6| test('stage 09 exposes both drawn companion sheets without consuming t…
      7|   const sheets = cheatsheetsForStage('09-performance-optimization')
      8|   expect(sheets.map((sheet) => sheet.slug).sort()).toEqual([
       |                                                    ^
      9|     'caching',
     10|     'scaling',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  |unit| src/lib/cheatsheets/stage09-reference.test.ts > generated Markdown includes each companion, its load-bearing caveats and every supporting source
AssertionError: expected '# Cheatsheets\n\n<!-- Generated from …' to contain '## Caching'

- Expected
+ Received

- ## Caching
+ # Cheatsheets
+
+ <!-- Generated from web/src/lib/cheatsheets/. Do not edit by hand.
+      Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->
+
+ Lookup material rather than reading material. A stage teaches a decision; a
+ sheet answers what that command was.
+
+ Drawn: 20 of 25. A sheet listed as not drawn is
+ registered on purpose — the gap is the point, so it can be seen and filled.
+
+ | Sheet | Group | Stage | Status |
+ |---|---|---|---|
+ | Software Architecture Patterns | Architecture | 03 | Drawn |
+ | Design Patterns | Architecture | 03 | Drawn |
+ | API Design | Architecture | 03 | Drawn |
+ | SOLID Principles | Design Principles | 03 | Drawn |
+ | Clean Code | Design Principles | 05 | Drawn |
+ | Git Cheat Sheet | Git | 04 | Drawn |
+ | Git Commands | Git | 04 | Drawn |
+ | Git Branching & Conventions | Git | 04 | Drawn |
+ | Coding Standards | Standards | 05 | Drawn |
+ | Software Development Life Cycle | Standards | — | Drawn |
+ | Testing | Standards | 06 | Drawn |
+ | Playwright | Standards | 06 | Drawn |
+ | Code Review | Standards | 07 | Drawn |
+ | Deployment Environments | Standards | 12 | Drawn |
+ | AWS Deployment | Standards | 13 | Drawn |
+ | Post-Deploy Verification | Standards | 14 | Drawn |
+ | CI/CD Pipeline | Standards | 11 | Drawn |
+ | GitHub Actions | Standards | 11 | Drawn |
+ | Incident Management | Standards | 16 | Drawn |
+ | Security Audit | Standards | 08 | Drawn |
+ | JavaScript | Languages | — | Not drawn |
+ | Python | Languages | — | Not drawn |
+ | Java | Languages | — | Not drawn |
+ | Spring Boot | Languages | — | Not drawn |
+ | Express & Node | Languages | — | Not drawn |
+
+ ---
+
+ ## Software Architecture Patterns
+
+ Six ways to arrange a system, and what each one costs you.
+
+ Belongs to [03 — Architecture](../docs/03-architecture.md).
+
+ ### Event-driven
+
+ Components communicate through events.
+
+ - **Event producer** — Emits events without knowing who consumes them. — The producer must not care how many consumers exist.
+ - **Event broker** — Holds the ordered stream — event 1 through event N. — Consumers read at their own pace, or replay from the start.
+ - **Event consumers** — Independent subscribers, each reacting to what it cares about. — Adding a consumer should not require touching the producer.
+
+ ### Layered
+
+ Organize system into layers with separation of concerns.
+
+ - **Presentation layer** — What the user touches. — Depends downward only.
+ - **Business / application layer** — The rules that make this system this system. — The layer worth protecting from the other three.
+ - **Data access layer** — How persistence is reached, not where it lives. — Swapping the store should stop here.
+ - **Persistence layer** — The store itself. — The bottom of the stack.
+ - **Infrastructure** — Cross-cutting concerns every layer talks to. — Logging, config, auth — the things that refuse to layer.
+
+ ### Monolithic
+
+ All components built and deployed as a single unit.
+
+ - **One deployable** — Posts, comments, groups, media and live streaming ship together. — One team, one release cadence, no distributed-systems tax.
+ - **One database** — Every feature reads and writes the same store. — Transactions across features stay trivial.
+ - **The cost** — Any change redeploys everything. — It bites when teams outgrow one release train.
+
+ ### Microservices
+
+ Application is composed of small, independent services.
+
+ - **API gateway** — One entry point in front of many services. — Clients should not know the service topology.
+ - **Service per capability** — Catalog, cart, discount and order each deploy alone. — Teams need independent release cadence.
+ - **Database per service** — Each service owns its own store — four services, four databases. — Shared tables reintroduce the coupling the split was meant to remove.
+
+ ### MVC
+
+ Separate application into Model, View and Controller.
+
+ - **View** — Renders state and forwards user actions to the controller. — Holds no rules of its own.
+ - **Controller** — Receives the action, requests data, renders the view. — The traffic director, not the brain.
+ - **Model** — Fetches and returns data, and updates the controller. — Where the rules and the persistence live.
+
+ ### Master-slave
+
+ Distribute read/write workload between master and slaves.
+
+ - **Master (primary)** — Takes every write. — One writer keeps ordering simple.
+ - **Slave (replica)** — Serves reads, fed by replication from the master. — Read volume is the bottleneck, not write volume.
+ - **Replication lag** — A replica can answer with data the master already changed. — The trade this pattern asks you to accept.
+
+ Source: Software Architecture Patterns — Sathish Kumar Subramani.
+
+ ## Design Patterns
+
+ The Gang of Four set, grouped by what each one is for.
+
+ Belongs to [03 — Architecture](../docs/03-architecture.md).
+
+ ### Creational — how objects are created
+
+ - **Singleton** — Ensures a class has exactly one instance and one global access point. — Config managers, loggers, caches — cases where a second instance would be a bug, not a feature.
+ - **Factory Method** — Defines an interface for creating an object, letting subclasses choose the concrete class. — Object creation logic is complex enough that the caller should not have to know it.
+ - **Abstract Factory** — Creates families of related objects without naming their concrete classes. — A whole family needs to swap together — a UI theme, a database driver set.
+ - **Builder** — Builds a complex object step by step, separating construction from representation. — Many optional parameters would otherwise mean a constructor nobody can read.
+ - **Prototype** — Creates new objects by cloning an existing one rather than building from scratch. — A template instance already exists and copying it is cheaper than reconstructing it.
+
+ ### Structural — how objects are composed
+
+ - **Adapter** — Converts the interface of a class into another interface clients expect. — Integrating third-party libraries or legacy systems whose interface you cannot change.
+ - **Bridge** — Decouples an abstraction from its implementation so both can vary independently. — An abstraction and its implementation would otherwise multiply combinations through subclassing.
+ - **Composite** — Composes objects into tree structures and treats a single object and a group of them the same way. — Part-whole hierarchies where the caller should not have to check which one it has.
+ - **Decorator** — Adds behavior to an object dynamically, without touching its class. — Layering concerns like logging, authorization or caching without subclassing for every combination.
+ - **Facade** — Provides one simplified interface to a complex subsystem. — Simplifying usage for callers who need the common path, not the whole subsystem’s surface.
+ - **Flyweight** — Shares objects to support large numbers of fine-grained instances efficiently. — Object count is high enough that per-instance memory is the actual bottleneck.
+ - **Proxy** — Controls access to an object through a surrogate that stands in for it. — Access control, lazy loading, or logging need to sit in front of the real object.
+
+ ### Behavioral — how objects communicate
+
+ - **Chain of Responsibility** — Passes a request along a chain of handlers until one of them handles it. — The sender should not need to know which handler, if any, will act.
+ - **Command** — Encapsulates a request as an object, decoupling the invoker from the thing that executes it. — Queuing, logging or undoing actions requires treating a request as data.
+ - **Interpreter** — Defines a grammar and a way to interpret sentences written in it. — A small language recurs often enough to justify its own grammar rather than ad hoc parsing.
+ - **Iterator** — Traverses a collection’s elements without exposing how the collection is stored. — Callers need to walk a collection without depending on its internal structure.
+ - **Mediator** — Centralizes communication between objects so they reference the mediator instead of each other. — A group of objects’ interactions have become a tangle of direct references.
+ - **Memento** — Captures and restores an object’s internal state without exposing that state directly. — Undo functionality needs a snapshot that does not break encapsulation to take.
+ - **Observer** — Notifies multiple dependents automatically when an object’s state changes. — Event handling, UI updates, notifications — anywhere one change fans out to many reactions.
+ - **State** — Lets an object alter its behavior when its internal state changes, as if it changed class. — A single object’s behavior branches heavily on a status field that keeps growing.
+ - **Strategy** — Defines a family of algorithms, encapsulates each one, and makes them interchangeable. — Payment methods, sorting, compression — the algorithm varies but the caller’s shape does not.
+ - **Template Method** — Defines the skeleton of an algorithm in a base class, letting subclasses override specific steps. — Several variants share most of a process and differ only in a few well-defined steps.
+ - **Visitor** — Adds new operations to an object structure without modifying the classes it operates on. — New operations arrive more often than new element types do.
+
+ Source: Software Design Patterns — Unrecorded — see reference/cheatsheet-sources.md.
+
+ ## API Design
+
+ From HTTP fundamentals through versioning, auth and rate limits.
+
+ Belongs to [03 — Architecture](../docs/03-architecture.md).
+
+ ### Fundamentals and protocol
+
+ - **API types** — REST, GraphQL, gRPC, SOAP — different answers to the same question of how a client asks a server for something.
+ - **Request-response lifecycle** — Client sends a request, server processes it, server returns a response — the shape every API type still fits inside.
+ - **HTTP methods and status codes** — GET, POST, PUT, PATCH, DELETE map to intent; status codes and headers carry the outcome.
+ - **Payload basics** — JSON, XML and form data as wire formats; URLs, HTTPS and TLS as the transport underneath them.
+
+ ### Designing the resource
+
+ - **REST principles** — Resource-based URLs, CRUD operations mapped onto HTTP methods, consistent naming.
+ - **Versioning and idempotency** — A breaking change ships as a new version rather than breaking every client already live; idempotent methods are safe to retry.
+ - **Request and response shape** — A consistent JSON structure, pagination for large result sets, filtering and sorting as query parameters.
+ - **Error responses** — A standardized error shape, so a client can branch on it instead of parsing prose.
+
+ ### Auth and validation
+
+ - **API keys and JWT** — A key identifies the caller; a JWT carries claims about who they are without a database round trip to check.
+ - **OAuth 2.0 and OpenID Connect** — Delegated authorization and identity on top of it — a client acts on a user’s behalf without holding their password.
+ - **RBAC and session vs token** — Role-based access control decides what an authenticated caller may do; sessions and tokens are two different ways to carry "who is this" between requests.
+ - **Input validation** — Validate and sanitize at the boundary, with error codes and exceptions that say what failed rather than that something did.
+
+ ### Data and performance
+
+ - **SQL vs NoSQL** — Relational structure and transactions against flexible schema and horizontal scale — the trade the data model makes.
+ - **Caching** — Redis or similar in front of a slow read path, with rate limiting and compression protecting what caching does not.
+ - **Async processing and load balancing** — Work too slow for a request-response cycle moves off it; load balancing spreads traffic once one server is not enough.
+
+ ### Docs, testing and security
+
+ - **OpenAPI and Swagger** — A machine-readable API specification that also generates interactive documentation and client SDKs.
+ - **Testing** — Unit and integration tests, automated mocks, and manual exploration with a tool like Postman.
+ - **Transport and injection defenses** — HTTPS and CORS at the edge; defenses against XSS, CSRF and SQL injection in the application.
+ - **Secrets** — Credentials and keys live outside the codebase, with logging and monitoring watching for misuse.
+
+ ### Deployment and advanced patterns
+
+ - **Gateways and containers** — An API gateway as the single entry point in front of many services; Docker and Kubernetes as how those services run.
+ - **CI/CD** — Pipelines that build, test and deploy on every change rather than on a manual release day.
+ - **Beyond REST** — GraphQL and gRPC as alternatives to REST; WebSockets and webhooks for the cases a request-response cycle does not fit.
+ - **Microservices communication** — Services talk to each other the same way clients talk to the API — the design principles above apply internally too.
+
+ Source: Master Plan for API Design — Shalini Goyal.
+
+ ## SOLID Principles
+
+ Five rules for code that stays easy to change, test and extend.
+
+ Belongs to [03 — Architecture](../docs/03-architecture.md).
+
+ ### The five principles
+
+ - **Single Responsibility** — A class should have only one reason to change. — A class handling users, email and reports together is three responsibilities pretending to be one.
+
+   *Violation*
+
+   ```
+   class UserManager {
+     saveUser(u: User) { /* … */ }
+     sendWelcomeEmail(u: User) { /* … */ }
+     generateReport(u: User) { /* … */ }
+   }
+   ```
+
+   *Correct*
+
+   ```
+   class UserRepository {
+     save(u: User) { /* … */ }
+   }
+   class WelcomeEmailer {
+     send(u: User) { /* … */ }
+   }
+   class UserReport {
+     generate(u: User) { /* … */ }
+   }
+   ```
+
+ - **Open/Closed** — Open for extension, closed for modification — add behavior without editing what already works. — A new type keeps requiring an `if`/`else if` added to existing code instead of a new class.
+
+   *Violation*
+
+   ```
+   function area(shape: Shape) {
+     if (shape.kind === "circle") return Math.PI * shape.r ** 2
+     if (shape.kind === "rect") return shape.w * shape.h
+     // every new shape edits this function
+   }
+   ```
+
+   *Correct*
+
+   ```
+   interface Shape { area(): number }
+   class Circle implements Shape {
+     area() { return Math.PI * this.r ** 2 }
+   }
+   // a new shape adds a class, this function never changes
+   ```
+
+ - **Liskov Substitution** — A subclass must be usable anywhere its superclass is, without breaking the caller’s expectations. — A subclass throws on a method its parent’s contract promises will work — Ostrich extending Bird and refusing to fly.
+
+   *Violation*
+
+   ```
+   class Bird { fly() { /* … */ } }
+   class Ostrich extends Bird {
+     fly() { throw new Error("Ostriches can’t fly") }
+   }
+   ```
+
+   *Correct*
+
+   ```
+   class Bird {}
+   class FlyingBird extends Bird { fly() { /* … */ } }
+   class Ostrich extends Bird {} // never promises flight
+   ```
+
+ - **Interface Segregation** — Clients should not be forced to depend on methods they do not use. — One fat interface makes every implementer stub out methods that do not apply to it.
+
+   *Violation*
+
+   ```
+   interface Worker {
+     work(): void
+     eat(): void
+   }
+   class Robot implements Worker {
+     work() { /* … */ }
+     eat() { throw new Error("Robots don’t eat") }
+   }
+   ```
+
+   *Correct*
+
+   ```
+   interface Workable { work(): void }
+   interface Eatable { eat(): void }
+   class Robot implements Workable {
+     work() { /* … */ }
+   }
+   ```
+
+ - **Dependency Inversion** — High-level modules depend on abstractions, not on concrete low-level modules. — Swapping an implementation — a database, a payment provider — should not require editing the code that uses it.
+
+   *Violation*
+
+   ```
+   class UserService {
+     private db = new MySqlDatabase()
+   }
+   ```
+
+   *Correct*
+
+   ```
+   interface Database { connect(): void }
+   class UserService {
+     constructor(private db: Database) {}
+   }
+   ```
+
+
+ Source: SOLID Principles — Cheat Sheet — Raja Kumar.
+
+ ## Clean Code
+
+ Five habits that separate code that works from code that lasts.
+
+ Belongs to [05 — Development](../docs/05-development.md).
+
+ ### Five habits
+
+ - **Write for humans** — Code is read far more often than it is written — optimise for the next reader, not the interpreter.
+
+   *Before*
+
+   ```
+   const d = (a: number, b: number) => a * b * 0.1
+   ```
+
+   *After*
+
+   ```
+   const calculateDiscount = (price: number, quantity: number) =>
+     price * quantity * DISCOUNT_RATE
+   ```
+
+ - **Keep it simple** — The straightforward solution beats the clever one once someone else has to maintain it.
+
+   *Before*
+
+   ```
+   const isEven = (n: number) => !(n & 1) === !0
+   ```
+
+   *After*
+
+   ```
+   const isEven = (n: number) => n % 2 === 0
+   ```
+
+ - **Avoid duplicates** — The same logic in two places is one bug waiting to be fixed in only one of them.
+
+   *Before*
+
+   ```
+   function total(items) {
+     return items.reduce((s, i) => s + i.price * i.qty, 0)
+   }
+   function subtotal(cart) {
+     return cart.reduce((s, i) => s + i.price * i.qty, 0)
+   }
+   ```
+
+   *After*
+
+   ```
+   function lineTotal(item: LineItem) { return item.price * item.qty }
+   function total(items: LineItem[]) {
+     return items.reduce((s, i) => s + lineTotal(i), 0)
+   }
+   ```
+
+ - **Be consistent** — One naming style, one structure, one way of doing a repeated thing — consistency is what makes code skimmable.
+
+   *Before*
+
+   ```
+   function get_user(id) { /* … */ }
+   function fetchOrder(id) { /* … */ }
+   function Load_Invoice(id) { /* … */ }
+   ```
+
+   *After*
+
+   ```
+   function getUser(id: string) { /* … */ }
+   function getOrder(id: string) { /* … */ }
+   function getInvoice(id: string) { /* … */ }
+   ```
+
+ - **Refactor regularly** — Clean code is a habit applied continuously, not a one-time pass before a release. — The Boy Scout Rule: leave the code a little cleaner than you found it, every time you touch it.
+
+ ### Four more, named as acronyms
+
+ From a second gathered source — "6 Golden Rules to Write Clean Code" by Neo Kim. Its other two rules, DRY and KISS, are the same ideas as "Avoid duplicates" and "Keep it simple" above.
+
+ - **SOC — Separation of concerns** — Keep distinct responsibilities in distinct places, so a change to one does not ripple into the other. — The class-level version of this is SOLID’s Single Responsibility Principle — see `solid-principles`.
+ - **DYC — Document your code** — Comments and docs explain *why* a decision was made — the code itself already says what it does.
+ - **TDD — Test-driven development** — Write the failing test before the code that makes it pass. — This repo’s own iron law: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST" (`CLAUDE.md`) — see `testing`.
+ - **YAGNI — You ain’t gonna need it** — Do not build for a requirement that does not exist yet — speculative flexibility is a cost paid today for a maybe.
+
+ Source: Clean Code Principles Every Junior Developer Should Know — Unrecorded — see reference/cheatsheet-sources.md.
+
+ ## Git Cheat Sheet
+
+ Essential commands from init to push, plus the four-area mental model.
+
+ Belongs to [04 — Project Setup](../docs/04-project-setup.md).
+
+ ### Start a repository
+
+ - `git init` — Create a new Git repository in the current directory. — Starting a brand-new project. Run once, at the beginning.
+ - `git clone <repo-url>` — Clone an existing repository into a new directory. — Joining a project that already exists on GitHub, GitLab, or another remote.
+
+ ### Check your changes
+
+ - `git status` — See modified, staged, and untracked files. — Before staging, before committing, before switching branches. The single most-typed git command.
+ - `git diff` — See changes that have not been staged yet. — Reviewing what you changed before deciding what to stage.
+
+ ### Stage and commit
+
+ - `git add <file>` — Stage a specific file for the next commit. — When you want to commit some changes but not all of them.
+ - `git add .` — Stage all changes in the current directory. — When every change belongs in the same commit. Check git status first.
+ - `git commit -m "message"` — Save staged changes with a meaningful message. — After staging. The message describes what changed, not what you did to the diff.
+ - `git log --oneline` — View a compact commit history (one line per commit). — Finding a recent commit, checking what landed, verifying branch state.
+
+ ### Branches
+
+ - `git branch` — List local branches. The current branch is marked with an asterisk. — Checking which branch you are on, or seeing what branches exist.
+ - `git branch <branch-name>` — Create a new branch at the current commit. — Starting a feature or fix. Does not switch to the new branch.
+ - `git switch <branch-name>` — Switch to another branch. — Moving between branches. Replaces the older git checkout for branch switching.
+ - `git switch -c <branch-name>` — Create and switch to a new branch in one step. — The common case: you want a new branch and you want to be on it immediately.
+ - `git branch -d <branch-name>` — Delete a branch that has been merged. — After merging. Use -D (capital) to force-delete an unmerged branch.
+
+ ### Sync with remote
+
+ - `git fetch` — Download remote changes without merging them. — When you want to see what changed on the remote before integrating.
+ - `git pull` — Fetch and integrate changes from remote into your current branch. — Getting the latest changes. Equivalent to git fetch + git merge.
+ - `git push` — Upload your local commits to the remote. — After committing locally and wanting others to see the work.
+ - `git push -u origin <branch>` — Push a new branch to the remote and set it as the upstream. — The first push of a new branch. After this, plain git push works.
+
+ ### Merge and rebase
+
+ Use merge to preserve history. Use rebase for a cleaner, linear history (it rewrites commits). This project uses merge (--no-ff) and never rebases.
+
+ - `git merge <branch-name>` — Merge another branch into your current branch. Creates a merge commit. — Integrating finished work. The merge commit records when and what was integrated.
+ - `git rebase <branch-name>` — Reapply your commits on top of another branch. Rewrites commit history. — Cleaning up a feature branch before merging, when a linear history matters more than preserving the original commit sequence.
+
+ ### Undo changes
+
+ Be careful with git reset --hard. It permanently discards local changes.
+
+ - `git restore <file>` — Discard unstaged changes in a file, reverting it to the last committed state. — When you edited a file and want to throw those changes away.
+ - `git restore --staged <file>` — Unstage a file without deleting the changes. — When you staged something by mistake but still want to keep the edits.
+ - `git revert <commit-id>` — Create a new commit that undoes an earlier commit. — Safely undoing a change that has already been pushed. Preserves history.
+ - `git reset --soft HEAD~1` — Undo the last commit while keeping the changes staged. — When you committed too early and want to amend or re-split the work.
+
+ ### Tags
+
+ - `git tag` — List all tags. — Checking which versions have been tagged.
+ - `git tag v1.0.0` — Create a lightweight tag at the current commit. — Marking a release or milestone.
+ - `git push origin v1.0.0` — Push a specific tag to the remote. — Tags are not pushed by default. Push them explicitly after creating.
+
+ ### The Git model
+
+ The four areas: Working Directory (your local files) → Staging Area (changes ready to commit) → Local Repository (your Git history) → Remote Repository (e.g. GitHub). The workflow is: modify files, git add, git commit, git push.
+
+ - **Working Directory** — Your local files. Every edit starts here.
+ - **Staging Area** — Changes you have selected for the next commit with git add.
+ - **Local Repository** — Your commit history, stored in the .git directory.
+ - **Remote Repository** — The shared history on GitHub, GitLab, or another host.
+
+ Source: Git Cheat Sheet — Essential Commands Every Developer Should Know — Unrecorded.
+
+ ## Git Commands
+
+ The ones worth memorising, and the ones worth looking up.
+
+ Belongs to [04 — Project Setup](../docs/04-project-setup.md).
+
+ ### Basics
+
+ The work → stage → commit → push loop, and the commands each step names.
+
+ - `git init` — Creates a new repository in the current directory. — Starting a project from nothing.
+ - `git clone <url>` — Copies an existing repository, history included. — Starting from someone else’s history instead of your own.
+ - `git status` — Lists modified, staged and untracked files. — Before every commit, so nothing surprising goes in.
+ - `git diff` — Shows changes that have not been staged yet. — Checking exactly what changed before you stage it.
+ - `git add <file> / git add .` — Stages a specific file, or every change. — The line between "changed" and "about to be committed".
+ - `git commit -m "message"` — Saves the staged changes with a message. — One logical change per commit, not one commit per save.
+ - `git log --oneline` — A compact, one-line-per-commit history. — Scanning recent history without the full commit body noise.
+ - `git branch <name> / git switch <name> / git switch -c <name>` — Create a branch, switch to one, or do both in one step. — `-c` is the one you reach for starting new work.
+ - `git fetch / git pull / git push` — Download remote changes without merging, download and merge, or upload local commits. — `fetch` first if you want to see what changed before merging it in.
+ - `git merge <branch> / git rebase <branch>` — Combine another branch into yours — merge keeps both histories, rebase replays yours on top. — Merge to preserve what happened; rebase for a clean, linear log.
+ - `git restore <file> / git revert <commit> / git reset --soft HEAD~1` — Three different undos: discard an unstaged edit, add a new commit that undoes an old one, or uncommit while keeping the changes staged. — Restore for a typo, revert once history is shared, reset only on a branch nobody else has pulled.
+
+ ### Beyond commit and push
+
+ The commands that stop being optional once a project outlives its first week.
+
+ - `git stash` — Saves uncommitted changes without creating a commit. — Switching context mid-task without a half-finished commit to clean up later.
+ - `git cherry-pick <commit-id>` — Copies one specific commit onto the current branch. — You need that one fix, not the whole branch it shipped on.
+ - `git rebase main` — Replays your branch’s commits on top of main, keeping history linear. — Tidying a feature branch’s log before it merges.
+ - `git reflog` — Recovers commits that look lost — nothing is gone until it is garbage-collected. — After a reset or a branch delete you immediately regret.
+ - `git bisect start / bad / good <commit-id>` — Binary-searches history for the exact commit that introduced a bug. — A regression exists somewhere in fifty commits and reading them one at a time is not an option.
+ - `git reset --hard <commit-id> vs git revert <commit-id>` — Reset rewrites history to a point; revert adds a new commit undoing an old one. — Reset only on history nobody else has pulled — revert is the safe default once it is shared.
+
+ Source: Git Commands — Unrecorded — see reference/cheatsheet-sources.md.
+
+ ## Git Branching & Conventions
+
+ Trunk-based against GitFlow, and the commit format this repo uses.
+
+ Belongs to [04 — Project Setup](../docs/04-project-setup.md).
+
+ ### Branching strategies
+
+ What each one adds over "just branch off main", and what it costs.
+
+ - **Feature branching** — Each feature gets its own branch, deleted once merged. — The default almost everyone starts from — no process beyond it is assumed.
+ - **Gitflow** — Dedicated branches for features, releases, hotfixes, plus a permanent development branch alongside main. — Scheduled releases with real time between them — the ceremony pays for itself on a slow cadence, not a fast one.
+ - **GitLab Flow** — Adds environment branches — staging, production — so main stays release-ready and environments are named, not inferred. — Multiple deploy targets that do not all track main directly.
+ - **GitHub Flow** — Branch, open a PR, merge to main. Main is the only deployable branch and stays production-ready. — Continuous deployment with no separate release branch to keep in sync.
+ - **Trunk-based** — Branches are short-lived, merged within a day; large work ships incrementally behind feature flags. — Fast-moving teams where a long-lived branch would drift from main faster than it could be reviewed.
+
+ ### This repo’s convention
+
+ From CLAUDE.md, not the gathered graphic — closest to GitHub Flow with an extra promotion step.
+
+ - **Branch naming** — `feat/<kebab-topic>` or `fix/<kebab-topic>`, no ticket numbers; `docs/<date>-<topic>` carries a date, `feat`/`fix` do not.
+ - **Commit format** — Conventional Commits — `type(scope): subject`, subject lowercase, describing the change rather than the diff.
+ - **The flow** — Work branches merge to `develop`, never to `main` — `main` is production and deploys on push. `develop` promotes to `main` by pull request, which the user merges. — Not a fast-forward: `main` can sit ahead of `develop` by its own promotion-merge commits.
+ - **Merging** — `--no-ff` always, never squash or rebase, with a hand-written merge subject and a bullet-summary body. — History should show what shipped as one unit, not lose the branch shape a rebase or squash would erase.
+
+ Source: Git Branching Strategies — Nikki Siapno.
+
+ ## Coding Standards
+
+ The smells worth refactoring on sight.
+
+ Belongs to [05 — Development](../docs/05-development.md).
+
+ ### Code smells
+
+ From Refactoring.Guru’s taxonomy, condensed to five categories. Not bugs — signs the code is getting harder to change, read or extend.
+
+ - **Bloaters** — Methods, classes or parameter lists that have grown too large to reason about. — A long method, a large class, or a parameter list nobody can call without checking the signature.
+ - **Object-orientation abusers** — Cases where OOP exists in the codebase but is not doing its job — switch statements standing in for polymorphism. — A type check or a chain of `if`/`else` decides behavior that a class hierarchy should decide instead.
+ - **Change preventers** — Structures that make one change ripple into many files that should not need to move together. — Divergent change (one class changed for many reasons) or shotgun surgery (one change touches many classes).
+ - **Dispensables** — Code that provides little or no value — duplicate code, dead code, unnecessary abstraction. — Deleting it would not be missed, and keeping it costs a reader’s attention every time they pass it.
+ - **Couplers** — Classes or modules that depend on each other more than their job requires. — Feature envy (a method more interested in another class than its own) or a message chain three calls deep.
+
+ Source: [Code Smell](https://refactoring.guru/refactoring/smells) — AIAI LAB, citing Refactoring.Guru.
+
+ ## Software Development Life Cycle
+
+ The seven phases every stage in this playbook is a close-up of.
+
+ ### The seven phases
+
+ Followed through one running example — adding password reset to a small app — so each phase shows what it actually produces, and what the next phase does with it, rather than naming its output in the abstract.
+
+ - **1. Planning** — Define the problem, objectives, scope, resources and risks. — Password reset: the problem is support tickets from locked-out users, not a feature anyone asked for by name. The objective is cutting those tickets to zero. The scope decision — email links only, no SMS — is made here, and so is the risk that matters most: the reset flow itself could let an attacker learn which emails have an account.
+ - **2. Requirements analysis** — Gather and analyze functional and non-functional requirements. — The functional requirement: a user who forgets their password can request a reset link by email and set a new one. The non-functional requirement is what Planning’s risk turns into something checkable: the link must expire in 30 minutes, and requesting one must say “check your email” whether or not that address has an account — so the flow itself can’t be used to test which emails are registered.
+ - **3. Design** — System architecture, database design, UI/UX and component detail. — The non-functional requirement forces a real decision here, not just a nice one: a `password_reset_tokens` table storing a hashed token and an expiry, never the token itself — because a token readable in the database is a token a database leak hands out. One endpoint to request a reset, one to redeem it, and a single “check your email” screen that never says whether the address existed.
+ - **4. Development** — Write clean, efficient code and build the application. — Four small pull requests rather than one large one: the request endpoint, token generation and hashing, the redeem endpoint, the email template. Small enough that a reviewer can actually check the hashing decision from Design landed in the code, not just that something got built.
+ - **5. Testing** — Test for functionality, performance, security and bugs. — Does a valid token reset the password? Does an expired one get rejected? Requesting five reset emails in a minute — does the sixth get rate-limited? And the one Design exists to prevent: does requesting a reset for an email that isn’t registered look identical to requesting one that is?
+ - **6. Deployment** — Release the application to the production environment. — Shipped behind a feature flag to 5% of traffic first, watching the error rate and how many reset emails actually arrive, before widening to everyone. A flag exists so a bad rollout is a flip, not a revert.
+ - **7. Maintenance** — Monitor, fix issues, improve performance, and add new features. — Three months on, support tickets show reset emails landing in spam. The fix is an SPF/DKIM record, not a code change — the kind of fix this phase exists for, and the reason “maintenance” outlasts every other phase rather than closing when they do.
+
+ ### How different methodologies run the loop
+
+ Same seven phases every time — what changes is whether they run once, in a short repeating slice, or continuously.
+
+ - **Waterfall** — Runs the seven phases once, in strict sequence — each phase finishes and is signed off before the next starts. — Requirements that are genuinely fixed and unlikely to change: regulated or safety-critical builds, fixed-price contracts.
+ - **Agile / Scrum** — Runs a thin slice of all seven phases every sprint (one to four weeks), re-planning and re-prioritising each time. — Requirements that will keep changing as the product is used — most product work, this playbook’s own stage 02 included.
+ - **DevOps / Continuous** — Collapses development, testing and deployment into one automated pipeline; a change can go from commit to production the same day. — A team with the automation to make releasing safe often — this playbook’s own default, see stage 11 (CI/CD).
+
+ Source: Software Development Life Cycle (SDLC) — Unrecorded — see reference/cheatsheet-sources.md.
+
+ ## Testing
+
+ The five types, why the pyramid is shaped that way, and what this repo runs.
+
+ Belongs to [06 — Testing](../docs/06-testing.md).
+
+ ### Five types
+
+ - **Unit testing** — Tests individual functions, components or classes in isolation, before they interact with anything else. — Common tools: Jest, Vitest, Mocha.
+
+   *Vitest*
+
+   ```
+   import { expect, test } from 'vitest'
+
+   test('adds numbers correctly', () => {
+     expect(add(2, 3)).toBe(5)
+   })
+   ```
+
+ - **Integration testing** — Tests how multiple components or services interact — an API with a database, service-to-service, queue-to-worker. — Catches bugs in the contract between systems, not inside either one. Common tools: Supertest, Postman, Jest with mocks.
+ - **End-to-end (E2E) testing** — Simulates a complete user workflow, start to finish, through the real interface. — Validates the system the way a user actually experiences it. Common tools: Playwright, Cypress, Selenium.
+ - **Performance testing** — Tests system behaviour under load, to find bottlenecks before users hit them. — Common tools: k6, Apache JMeter, Lighthouse.
+ - **Security testing** — Proactively searches for vulnerabilities — SQL injection, XSS, broken authentication — before an attacker does. — Common tools: Snyk, OWASP ZAP, SonarQube.
+
+ ### The pyramid — why the proportions matter
+
+ Same five types, arranged by how many of each you should actually write. The shape is the point: broad and cheap at the bottom, narrow and expensive at the top.
+
+ - **Unit tests — the base** — The most numerous by far. Fast, isolated, cheap to write and to run. — This repo's own split: the `unit` and `dom` Vitest projects, run on every push — by far the largest of the three suites, and fast enough to run that often without slowing anyone down.
+ - **Integration tests — the middle** — Fewer than unit tests. Slower, because real collaborators are involved instead of mocks. — This repo leans light here by design — most of what would be an integration test is instead an E2E check against a real build.
+ - **E2E tests — the top** — The fewest, and the slowest and most brittle by nature — a real browser, a real build, every layer in between. — This repo's own audit suite — the smallest of the three by test count, run against a production build before every merge rather than on every commit.
+
+ Source: [The 5 Pillars of Testing](https://dev.to/prateekbka/the-5-pillars-of-testing-a-senior-developers-cheat-sheet-1ckj) — Prateek Agrawal.
+
+ ## Playwright
+
+ Locators, assertions, fixtures and debugging — the API this repo's own e2e suite runs on.
+
+ Belongs to [06 — Testing](../docs/06-testing.md).
+
+ ### Locators & assertions
+
+ - `getByRole()` — Finds an element by its ARIA role — the most resilient locator, since it survives markup changes that would break a CSS selector.
+ - `getByText() / getByLabel() / getByTestId()` — Find by visible text, by label, or by a `data-testid` attribute — reach for these before a raw CSS or XPath selector.
+ - `page.getByRole('listitem').filter({ hasText: 'Product' }).getByRole('button')` — Locator chaining narrows down which of several matching elements you mean.
+ - `toBeVisible() / toHaveText() / toContainText()` — Web-first assertions — visibility, exact text, and substring match.
+ - `toHaveURL() / toHaveTitle() / toHaveCount()` — Assert page URL, page title, or the number of matched elements.
+
+ ### Actions & waiting
+
+ - `click() / fill() / type() / press(key)` — Click an element, set an input's value, type with real keyboard events, or press a single key.
+ - `check() / uncheck() / selectOption() / hover()` — Toggle a checkbox, choose a dropdown option, or hover an element.
+ - **Auto-waiting** — Every action waits for its element to become actionable before running — no manual wait needed for the common case.
+ - `waitForURL() / waitForResponse() / waitForLoadState()` — Wait for a URL change, a matching network response, or a load state (`domcontentloaded`, `networkidle`).
+ - **Avoid waitForTimeout()** — A fixed wait is a guess about timing. It is the single most common cause of a flaky test in this API.
+
+ ### Test structure, fixtures & core concepts
+
+ - `test() / test.describe() / test.beforeEach() / test.afterEach()` — Define a test, group related tests, and run setup or teardown around each one.
+ - `test.use() / test.extend()` — Reusable setup shared across tests via fixtures, rather than repeated in every test body.
+ - **Browser → Context → Page** — The three-level model: one browser, many isolated contexts (like incognito sessions), each context holding one or more pages. — Every test gets a fresh context by default, which is what makes tests independent of each other without extra setup.
+ - **This repo's own convention** — A test name states the property being checked *and* the reason it matters, so a failure reads as an explanation rather than a label.
+
+   *e2e/audit.spec.ts*
+
+   ```
+   test('the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass', async ({ page }) => {
+     // ...
+   })
+   ```
+
+
+ ### Debugging & CI
+
+ - `npx playwright test --ui` — UI mode — an interactive view of every test, step by step, as it runs.
+ - `npx playwright test --debug` — Step-by-step debugging with the Inspector.
+ - `npx playwright show-trace trace.zip` — Opens the trace viewer — a full recording of a run, worth more than a screenshot when a test fails only in CI.
+ - **CI/CD integration** — Run headless, fail fast on the first failure, and collect a trace only on failure rather than on every run. — This repo's own audit runs a fresh production build via `webServer`, on a port that stays clear of the dev server (TD-27).
+
+ Source: Playwright Quick Revision Cheat Sheet — Unrecorded — see reference/cheatsheet-sources.md.
+
+ ## Code Review
+
+ Five review axes, the severity system, and how large a PR should be.
+
+ Belongs to [07 — Code Review](../docs/07-code-review.md).
+
+ ### Review process
+
+ - **1. Understand the context** — Read the PR description and linked ticket before touching the diff. Know what the change is trying to do.
+ - **2. Read the tests first** — Tests show what the author thinks the code should do. Mismatches between intent and test are the highest-signal findings.
+ - **3. Walk the implementation** — Read the diff file by file. The implementation is where the edge cases, authorization gaps, and naming issues live.
+ - **4. Label every finding** — Every comment carries a severity — Critical, Required, Consider, Nit, or FYI — so the author knows what blocks the merge.
+ - **5. Check the verification** — Confirm the author tested what they claim. A preview URL, a screenshot, a test run — not just "it works on my machine."
+
+ ### Five review axes
+
+ - **Correctness** — Does it do what it claims? Edge cases and error paths, not just the happy path. Do the tests test the right thing, or the implementation?
+ - **Readability** — Could another engineer follow it without you? 1000 lines where 100 suffice is a failure. Abstractions have to earn their complexity.
+ - **Architecture** — Does it fit the system? Does the refactor reduce complexity, or relocate it? Is feature logic leaking into a shared module?
+ - **Security** — Input validated at the boundary. Secrets out of code, logs and version control. External data is untrusted until proven otherwise.
+ - **Performance** — N+1 query patterns. Unbounded loops and unconstrained fetching. Missing pagination. Large objects in hot paths.
+
+ ### Severity labels
+
+ Lead with leverage. If you have one structural problem and ten nits, the structural problem is the review.
+
+ - **Critical** — Blocks the merge. Data loss, security breach, production outage.
+ - **Required** — No prefix — must fix. A correctness or UX bug the user will hit.
+ - **Consider** — Worth thinking about. A real alternative the author may not have seen.
+ - **Nit** — The author may ignore. Polish, naming preferences, style the linter does not enforce.
+ - **FYI** — No action needed. Context for the author — a related decision, a known limitation, a pointer to prior art.
+
+ ### Change sizing
+
+ - **~100 lines** — Good. Reviewable in one pass, easy to revert, high comment density.
+ - **~300 lines** — Acceptable if it is one logical change. Past this, reviewers start skimming.
+ - **~1000 lines** — Split it. Schema in one PR, backend in another, UI in a third. Each merges independently behind a flag.
+
+ Source: [Code Review and Quality](https://github.com/nicepkg/agent-skills) — Addy Osmani.
+
+ ## Deployment Environments
+
+ Six environments from local to production — what each catches and what it cannot.
+
+ Belongs to [12 — Staging](../docs/12-staging.md).
+
+ ### Six environments
+
+ Not every project uses all six. Solo, you typically run local, preview and production. The middle three earn their place when a team, a compliance process, or a third-party integration demands them.
+
+ - **Local / Dev** — Your machine. Fast iteration, expected errors, no shared state. The only environment where a broken build costs nobody else. — Always. Every change starts here.
+ - **Preview** — A per-branch deploy at its own URL, created automatically on every pull request and torn down on merge. Fully isolated from other branches. — Every pull request. The default pre-production check for solo and small-team work.
+ - **QA** — A structured testing hub owned by a QA function. A release candidate is deployed here, tested against production-shaped data, and signed off before promotion. — When a dedicated QA role owns regression sign-off and needs a stable target that is not production.
+ - **Test / Integration** — Validates that components talk to each other. Runs integration and contract tests against real (or realistic) dependencies rather than mocks. — When integration tests need infrastructure CI cannot provide — a real database, a message queue, an external API sandbox.
+ - **Staging** — A long-lived deploy mirroring production as closely as possible. Tracks a shared branch, runs production-equivalent infrastructure, connects to production-shaped data. — When something demands a stable URL: a third-party callback, a client demo, a compliance sign-off, or a QA process that compares one release to the last.
+ - **Production** — Live, serving real users. The only environment whose failures have real consequences. — After every other environment has done its job. Changes arrive here via the deployment pipeline, never directly.
+
+ ### Preview vs staging
+
+ The choice stage 12 teaches. Most solo developers need preview and not staging. Add staging when something concrete demands a stable URL.
+
+ - **Isolation** — Preview: one per PR, fully isolated — your work cannot break another branch. Staging: shared, all in-flight work deploys to the same environment.
+ - **Lifecycle** — Preview: spins up on PR open, torn down on merge. Staging: long-lived, maintained continuously whether or not anyone is using it.
+ - **Who tests** — Preview: the author and their reviewers. Staging: QA engineers, stakeholders, third-party integrators who need a stable URL.
+ - **Feedback speed** — Preview: minutes from push to a live URL. Staging: hours to days, because deploys are queued and shared state must be coordinated.
+ - **Cost model** — Preview: pay per use, scales to zero when no PRs are open. Staging: fixed cost, runs idle, still drifts and still generates alerts.
+ - **Confidence** — Preview: high confidence that one change works. Staging: lower for any single change, higher for the release as a whole.
+ - **What breaks when it fails** — Preview: one PR's review is blocked. Staging: the whole team's deployment queue backs up, and isolating the cause is forensic work.
+
+ Source: [Dev, QA, preview, test, staging, and production environments](https://northflank.com/blog/what-are-dev-qa-preview-test-staging-and-production-environments) — Northflank.
+
+ ## AWS Deployment
+
+ ECS strategies, the GitHub Actions pipeline, and the costs Vercel hides.
+
+ Belongs to [13 — Production Deployment](../docs/13-production-deployment.md).
+
+ ### ECS deployment strategies
+
+ Predefined configurations for traffic shifting. Canary and linear require an Application Load Balancer. NLB supports only AllAtOnce.
+
+ - `ECSCanary10Percent5Minutes` — 10% of traffic shifts first, remaining 90% after 5 minutes. — Quick validation with a short bake window. The default starting point for most services.
+ - `ECSCanary10Percent15Minutes` — 10% first, remaining 90% after 15 minutes. — Higher-risk changes where you want more time to watch metrics before committing.
+ - `ECSLinear10PercentEvery1Minutes` — 10% every 1 minute until 100%. About 10 minutes total. — Gradual rollout with ten data points instead of one. Catches regressions that only appear under load.
+ - `ECSLinear10PercentEvery3Minutes` — 10% every 3 minutes until 100%. About 30 minutes total. — Slow, cautious rollout. Services where a rollback during business hours is expensive.
+ - `ECSAllAtOnce` — All traffic shifts immediately to the new task set. — When speed matters more than caution, or when the service is behind a separate traffic gate.
+
+ ### GitHub Actions → ECS pipeline
+
+ The six steps from push to stable deployment. OIDC means no long-lived AWS credentials stored in GitHub.
+
+ - `actions/checkout@v4` — Clone the repository. — Every workflow. Nothing else has access to the code without it.
+ - `aws-actions/configure-aws-credentials@v4` — Exchange a GitHub OIDC token for temporary AWS credentials via STS. Set role-to-assume and aws-region. — Every AWS workflow. Requires id-token: write permission and an IAM role with a trust policy for token.actions.githubusercontent.com.
+ - `aws-actions/amazon-ecr-login@v2` — Authenticate Docker to your Elastic Container Registry. Outputs the registry URL. — Before docker push. mask-password defaults to true since v2.
+ - `docker build + push` — Build the image and push it tagged with the commit SHA. Every image traceable to a commit. — After ECR login. Use ${{ github.sha }} as the tag, not latest.
+ - `aws-actions/amazon-ecs-render-task-definition@v1` — Take a task definition JSON file and swap the image field to the new tag. Outputs an updated file path. — After push. Keep the task definition JSON in the repo (.aws/task-definition.json).
+ - `aws-actions/amazon-ecs-deploy-task-definition@v2` — Register the new task definition revision and call UpdateService. Set wait-for-service-stability: true and wait-max-delay-seconds: 30. — The final step. Without wait-for-service-stability, the workflow reports success while the circuit breaker silently rolls back.
+
+ ### Costs Vercel hides
+
+ Monthly cost for a small ECS Fargate service in US East. Vercel Pro ($20/seat) includes all of these. Ranges are order-of-magnitude, designed to stay useful across pricing updates.
+
+ - **Application Load Balancer** — $22–27/month. Routing, TLS termination, load balancing. Charged hourly ($0.0225/hr) plus per LCU. — Every ECS service that receives HTTP traffic. There is no free tier for ALB.
+ - **NAT Gateway** — $35–100/month. Outbound internet from private subnets. $0.045/hr to exist, $0.045/GB processed. — Every private subnet that needs to reach the internet. The classic bill shock. VPC endpoints ($7/mo each) cut the traffic that flows through it.
+ - **Fargate (one task)** — $18–40/month. Per-second billing: $0.04048/vCPU-hour, $0.004445/GB-hour. — Every running container. Blue/green doubles the cost briefly during deployment (both task sets running).
+ - **Data transfer** — $5–20/month. Inter-AZ ($0.01/GB each direction), internet egress ($0.09/GB after 100 GB free), NAT processing. — Scales with traffic. Multi-AZ architectures multiply inter-AZ charges across every request-response pair.
+ - **CloudWatch** — $5–15/month. Log ingestion ($0.50/GB), metrics ($0.30/metric), alarms ($0.10 each), dashboards ($3 each after the first three). — Every service that logs or monitors. Set retention policies or archived logs grow indefinitely at $0.03/GB/month.
+ - **ECR** — $1–2/month. Storage at $0.10/GB. Transfer free within the same region. — Every container image. The storage cost is trivial; the real cost is NAT Gateway traffic from pulling images in private subnets.
+
+ ## Post-Deploy Verification
+
+ The ten-minute checklist, Vercel verification, and the six-command AWS ECS sequence.
+
+ Belongs to [14 — Post-Deployment Verification](../docs/14-post-deployment-verification.md).
+
+ ### The ten-minute checklist
+
+ Platform-agnostic. Run after every production deploy, in order. The specific tools differ between Vercel and AWS; the sequence does not.
+
+ - **0–1 min** — Is it up? Load the production URL in a real browser. Hard refresh to bypass your cache. — Every deploy, no exceptions. A private window is safer than a hard refresh.
+ - **1–3 min** — Walk the critical path. Sign up, log in, checkout, create the core object. Run the smoke suite if you have one. — Every deploy. The smoke suite automates what you would walk manually.
+ - **3–5 min** — Check error rates. Any new issue type first seen after this deploy is your change until proven otherwise. — Every deploy. A rise in error volume against your baseline, or errors mentioning files you just changed.
+ - **5–7 min** — Check latency and traffic. Did p75 change? Is traffic still flowing? Any spike in 4xx or 5xx? — Every deploy. A sudden drop to zero means something is broken upstream of your error tracking.
+ - **7–10 min** — Check the specific thing you shipped. Verify the actual change with production data, not just general health. — Every deploy. The earlier checks are general health; this one confirms the feature works as intended.
+
+ ### Vercel verification
+
+ Vercel-specific tools for the ten-minute check. Each maps to a time block above.
+
+ - `pnpm test:prod` — Run the @smoke suite against the live production URL. The same critical path you would walk manually, automated. — Minutes 1–3. After every promotion to main.
+ - **Vercel Analytics** — p75 latency and traffic volume, filterable by route. A deploy that doubles p75 on one route is a bad deploy even with zero errors. — Minutes 5–7. Check the routes you changed plus the top-traffic routes.
+ - `VERCEL_DEPLOYMENT_ID` — Tag Sentry releases with the deployment ID (available at build time). Filter errors by release to isolate this deploy from background noise. — Minutes 3–5. Sentry filtered by release is the fastest way to find new error types.
+ - **Deployment URL** — Load the immutable URL directly: https://<project>-<hash>.vercel.app. Confirms the right build is live, not a cached older version. — Minute 0–1. The deployment URL bypasses CDN caching and DNS.
+
+ ### AWS ECS verification
+
+ Six commands, in order. The pivot is describe-target-health: the check that services-stable does not do.
+
+ - `aws ecs wait services-stable` — Block until runningCount matches desiredCount. Polls every 15 seconds, times out after ~10 minutes. — First. A timeout means tasks are failing to start or failing health checks.
+ - `aws ecs describe-services --query deployments` — Verify one PRIMARY deployment with rolloutState COMPLETED, runningCount matching desiredCount, failedTasks 0. — After services-stable passes. Two PRIMARY entries means an older deployment is still draining.
+ - `aws elbv2 describe-target-health` — Every registered target should report State: healthy. This is the check services-stable does not do reliably. — Always run separately from services-stable. A service can be "stable" with all tasks failing health checks.
+ - `aws ecs describe-services --query events` — Look for "has reached a steady state." Repeated task-stop-and-restart events mean something is crashing on startup. — After target health passes. The events tell you what happened, not just the current state.
+ - `aws ecs describe-tasks --query containers` — healthStatus HEALTHY on every container. This is the Docker-level health check, distinct from ALB target health. — Both must pass: ALB target health (routing) and container health (process-level).
+ - `aws logs tail /ecs/<log-group> --since 15m` — Inspect logs for error bursts. Use filter-log-events with --filter-pattern "ERROR" for targeted search. — Last. Even if everything above is green, an error burst in the logs means something is wrong.
+
+ Source: [Smoke Testing vs Sanity Testing vs Regression Testing](https://www.altexsoft.com/blog/smoke-testing/) — AltexSoft.
+
+ ## CI/CD Pipeline
+
+ The stages every pipeline runs, what fails at each one, and which tool plays which role.
+
+ Belongs to [11 — CI/CD](../docs/11-ci-cd.md).
+
+ ### Integration, delivery, deployment
+
+ CD stands for two different things. Which one you have is settled by a single question: does a human still press a button?
+
+ - **Continuous integration** — Every push is merged into the shared branch and built and tested automatically, on a clean machine. — The floor everything else stands on. Without it the two below have nothing trustworthy to ship.
+ - **Continuous delivery** — Every passing build is packaged and proven deployable. Releasing it stays a human decision. — Coordinated launches, regulated work, anything where *when* to ship is a business call rather than an engineering one.
+ - **Continuous deployment** — Every passing build goes to production with no human gate at all. — Only once the verification of stage 14 and the rollback of stage 13 are already in place. Teams arrive here after those exist, not before.
+ - **Why automate any of it** — A defect found minutes after the push that caused it costs a fraction of the same defect found three days later in someone else’s branch. — Compressing that interval is the whole return. Every other benefit follows from it.
+ - **What it does not buy** — A pipeline does not improve code. It tells you sooner what the code already is. — Teams that add CI without changing review or test habits get faster news about the same defects, and are surprised.
+ - **The feedback loop** — Each stage reports back to whoever pushed, by the route they actually read. — A failure nobody sees is a failure that ships, and this is the half of the pipeline most often left unfinished.
+
+ ### The pipeline stages
+
+ Ordered cheapest failure first. Each stage costs more to run than the one above it, so the cheap ones go first and spare you the expensive ones entirely.
+
+ - **Build from source** — Compiles or bundles from a clean checkout — never from a machine that already has the answer cached. — Catches the uncommitted file and the undeclared dependency: the “works on my laptop” class, found in seconds.
+ - **Code analysis** — Lint, type check, static analysis. Nothing is executed. — Seconds, not minutes, because no test runner boots. Put it before the tests and most bad pushes never reach them.
+ - **Unit tests** — Functions and modules in isolation, with no network, database or filesystem in play. — The bulk of the suite. Fast enough that a developer runs them before pushing, not only in CI.
+ - **Integration tests** — Modules against their real collaborators: a database, an HTTP API, a queue. — Where wiring errors surface. Slower and flakier than unit tests, which is exactly why they sit below them.
+ - **Security scanning** — Dependency CVEs, committed secrets, known-vulnerable code patterns. — Dependabot and secret scanning are the cheap always-on version; SAST is the thorough one that earns a slower job.
+ - **Package the artifact** — The deployable thing — a container image, a bundle, a signed binary — tagged with the commit SHA. — What ships must be the exact bytes that passed. Rebuilding at deploy time breaks that guarantee.
+ - **Deploy** — Push the tagged artifact to a registry, then let the orchestrator or platform roll it out. — The strategy for *how* it rolls out — blue/green, canary, rolling — belongs to stage 13, not here.
+
+ ### Who plays each role
+
+ The stages above are the same everywhere; the tools filling them swap freely. This playbook runs GitHub Actions onto Vercel — the plate above shows the identical shape with Jenkins and Kubernetes.
+
+ - **Runner** — GitHub Actions, GitLab CI, Jenkins, CircleCI. — Executes the stages. See `github-actions` for the syntax this playbook actually writes.
+ - **Build tool** — Maven or Gradle on the JVM, pnpm or npm on Node, Cargo, the Go toolchain. — Invoked *by* the runner. Keep the command identical to the one you run locally.
+ - **Quality gate** — SonarQube, CodeQL, ESLint with `tsc`. — A gate has a threshold and fails the build when it is crossed. Without a threshold you have a report, and reports stop nothing.
+ - **Artifact registry** — GitHub Container Registry, Docker Hub, Amazon ECR, Nexus. — Where the packaged artifact waits between build and deploy. Retention policy matters — rollback reads from here.
+ - **Runtime target** — Kubernetes, ECS or Fargate, Vercel, Cloud Run. — What pulls the artifact and runs it. Covered by stage 13; `aws-deployment` has the AWS specifics.
+ - **Provisioning** — Terraform, CloudFormation, Pulumi. — Creates the infrastructure the artifact lands on. Runs in its own pipeline on its own cadence — not on every application push.
+ - **Configuration management** — Ansible, Chef, Puppet. — Shapes long-lived servers after provisioning. Largely displaced by immutable images wherever containers are used.
+
+ ### Commands worth knowing
+
+ The pipeline runs these; you run the same ones locally when it goes red. Tool-agnostic on purpose — swap the build and deploy lines for your stack, the shape does not move.
+
+ - `pnpm install --frozen-lockfile` — Installs exactly what the lockfile pins, and fails if it has drifted. — Every CI install. Plain `pnpm install` may quietly update the lockfile on a runner, so the build tests something the repo does not contain.
+ - `mvn clean install` — Cleans, compiles, runs tests, packages, installs to the local repo. — The JVM equivalent. `mvn clean package` when nothing downstream needs the local install.
+ - `mvn sonar:sonar` — Publishes analysis to SonarQube and applies the configured quality gate. — A threshold is what makes it a gate. Analysis published without one changes nothing about whether the build passes.
+ - `docker build -t app:$GIT_SHA .` — Builds the image and tags it with the commit it came from. — Always tag with the SHA. See the Docker section for why `latest` cannot serve here.
+ - `docker push registry/app:$GIT_SHA` — Uploads the tagged image to the registry the deploy target pulls from. — After the gate passes, before the deploy step. The registry is the handoff between CI and CD.
+ - `kubectl apply -f deployment.yml` — Applies the manifest, creating or updating what it describes. — Declarative deploys. It returns as soon as the API accepts the change, not when the rollout finishes.
+ - `kubectl rollout status deploy/app` — Blocks until the rollout completes or times out, exiting non-zero on failure. — The line that makes a deploy step actually fail when the deploy fails. Without it `apply` exits 0 and a crash-looping pod ships green.
+ - `kubectl rollout undo deploy/app` — Reverts to the previous ReplicaSet. — The fastest rollback Kubernetes offers. Works only while the previous ReplicaSet is still retained.
+ - `terraform plan -out=tfplan` — Computes the change set and writes it to a file. — In CI, always to a file. Applying a freshly recomputed plan can apply something the reviewer never saw.
+ - `terraform apply tfplan` — Applies exactly the saved plan, with no recomputation. — The half that changes infrastructure, and the half worth putting behind a manual approval.
+ - `ansible-playbook -i inventory deploy.yml` — Runs the playbook against the hosts in the inventory. — Long-lived servers. Add `--check` for a dry run before the real one.
+
+ ### Docker in the pipeline
+
+ The artifact most pipelines actually produce. What is worth knowing here is what makes an image reproducible and rollback-able, not the Dockerfile syntax.
+
+ - **Tag with the commit, never `latest`** — Every image carries the SHA it was built from. — `latest` is a moving pointer, so it cannot name a rollback target and cannot tell you what is running.
+ - **Multi-stage build** — Build in one stage with the full toolchain, then copy only the artifact into a slim runtime stage. — Cuts image size sharply and keeps compilers, build secrets and dev dependencies out of what ships.
+ - **Layer order is cache strategy** — Copy the lockfile and install dependencies *before* copying source. — A source-only change then reuses the dependency layer. Copying everything first invalidates the install on every commit.
+ - **`.dockerignore`** — Keeps `.git`, `node_modules` and local env files out of the build context. — Both a speed and a safety measure — anything in the context can end up in a layer.
+ - **Scan the image, not only the source** — Dependency scanning reads your lockfile; image scanning also reads the base image’s OS packages. — A clean lockfile on a stale base image is a common and invisible gap.
+ - **Registry retention is part of rollback** — Rollback pulls from the registry, so retention decides how far back you can actually go. — A policy shorter than your rollback window silently deletes the thing you would roll back to. Check it against stage 13, do not assume.
+
+ ### Traps
+
+ The failures that make a pipeline stop being trusted. Most are not pipeline bugs — they are ways a green run can mean less than it appears to.
+
+ - **Green because nothing ran** — A path filter, an early exit or a misconfigured matrix reports success without executing the tests. — Assert that the tests *ran*, not only that the step exited 0. This repo hit the same shape twice — see TD-26 and TD-45 in `docs/tracker.md`.
+ - **Passes locally, fails on the runner** — Almost always an undeclared dependency, a file never committed, or a test that depended on execution order. — The runner’s clean checkout is the honest environment. Your machine is the one with the state.
+ - **Secrets echoed into logs** — A `set -x`, a debug print or a failing command that dumps its environment puts the token into a retained log. — Not recoverable by re-running. Rotate the credential; the log may already be read.
+ - **A pipeline nobody can run locally** — If the only way to reproduce a failure is to push again, every debug cycle costs a full run. — Keep the steps as scripts the developer can invoke directly, with the workflow file calling them.
+ - **Flaky tests retried into green** — A blanket retry that turns red into green teaches the team that red means "try again". — Quarantine the flake and fix it. A blanket retry defers the decision without ever making it.
+ - **Bypassing the gate under deadline** — The gate gets skipped exactly when the pressure that causes mistakes is highest. — If it is bypassable it will be bypassed; branch protection is the mechanism, not team discipline.
+
+ ### Practices that keep it useful
+
+ A pipeline nobody trusts gets worked around, and a worked-around pipeline is worse than none: the branch looks guarded when it is not.
+
+ - **Keep the gate under ten minutes** — Past roughly ten minutes people stop waiting for the result and start merging on optimism. — Three levers, in order of payoff: cheapest-failure-first ordering, dependency caching, parallel jobs.
+ - **Build once, promote the same artifact** — One build feeds staging and production. The artifact is promoted, never rebuilt per environment. — Rebuilding per environment tests one set of bytes and ships another. Environment differences belong in config, not in the build.
+ - **Version every artifact** — Tag with the commit SHA. Never deploy `latest`. — Rollback needs a specific thing to roll back *to*, and `latest` moves, so it cannot name the build you want back.
+ - **Test at every stage** — Each stage catches a class of failure the others cannot see. — Consolidating everything into one “run the tests” step trades the whole cheapest-first ordering for one slow verdict.
+ - **Keep the pipeline in the repo** — Workflow files are reviewed, versioned and rolled back exactly like the code they gate. — A pipeline configured only through a web UI has no history, no review, and no way to explain when it changed.
+ - **Fail loudly, to the person who pushed** — Route the failure to where that developer already looks, and make the message say which stage and why. — A red build that only the dashboard knows about may as well be green.
+
+ Source: [CI/CD Workflow — Simplified Visual Guide](https://blog.bytebytego.com) — ByteByteGo.
+
+ ## GitHub Actions
+
+ Workflow syntax, common patterns, and secrets handling for the CI gate this playbook teaches.
+
+ Belongs to [11 — CI/CD](../docs/11-ci-cd.md).
+
+ ### Workflow syntax
+
+ The skeleton every workflow starts from — the seven triggers this playbook actually uses.
+
+ - **`on: push`** — Runs on every push to matched branches. — The CI gate — `push: { branches: [main] }` plus `pull_request`.
+ - **`on: pull_request`** — Runs when a PR is opened, updated, or reopened. — Every PR gets a gate run. Pairs with `push` on the main branch.
+ - **`on: deployment_status`** — Fires when an external deploy (Vercel) reports success or failure. — E2E tests against the real preview URL, not a dev server.
+ - **`on: schedule`** — Cron-syntax trigger — `schedule: [{ cron: "0 6 * * 1" }]`. — Weekly tasks: dependency audits, stale-branch cleanup.
+ - **`on: workflow_dispatch`** — Manual trigger with optional input parameters. — One-off tasks: database migrations, manual deploys, cache clears.
+ - **`jobs:` → `steps:`** — A job runs on one runner. Steps run sequentially inside it. — One job for a pipeline under five minutes. Split to parallel jobs past that. For what the steps should *be*, see `ci-cd`.
+ - **`uses:` vs `run:`** — `uses` calls a published action. `run` executes a shell command. — `uses` for checkout, setup, and artifact upload. `run` for your own scripts.
+
+ ### Common patterns
+
+ Patterns that keep a pipeline fast, cheap, and maintainable.
+
+ - **Concurrency + cancel-in-progress** — `concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }` — one run per branch. — Every CI workflow. Three pushes cost one run, not three.
+ - **Matrix strategy** — `strategy: { matrix: { node: [18, 20] } }` — runs the job once per combination. — Testing across Node versions or OS variants. Not needed for a single-target pipeline.
+ - **Conditional steps** — `if: failure()` or `if: github.event_name == 'pull_request'` — run a step only when a condition holds. — Upload artifacts on failure. Skip expensive steps on draft PRs.
+ - **Artifact upload/download** — `actions/upload-artifact` saves files between jobs or for download. `download-artifact` retrieves them. — Playwright traces on failure. Build output passed to a deploy job.
+ - **Cache** — `actions/setup-node` with `cache: pnpm` caches the package store across runs. — Every Node.js workflow. Cuts install from ~25s to ~5s on a warm cache.
+ - **Reusable workflows** — `on: workflow_call` turns a workflow into a callable subroutine with inputs and secrets. — Monorepos or multiple services sharing the same CI shape.
+
+ ### Secrets and permissions
+
+ Credential handling — the part where mistakes are not recoverable by re-running.
+
+ - **`secrets.*` context** — Repository or environment secrets, never echoed to logs. — API tokens, deploy keys, any credential. Never in the workflow file itself.
+ - **OIDC token exchange** — `permissions: { id-token: write }` lets the runner mint a short-lived JWT. The cloud provider exchanges it for temporary credentials. — AWS, GCP, Azure deployments. Replaces long-lived access keys with per-run tokens that cannot leak.
+ - **`permissions:` block** — Scopes the `GITHUB_TOKEN` to only what the workflow needs. — Every workflow. Principle of least privilege — `contents: read` unless you need to push.
+ - **Environment protection rules** — Require manual approval, restrict to specific branches, add wait timers. — Production deploy workflows. A human gate before the automated one ships.
+
+ ## Incident Management
+
+ First response, safe mitigation, updates, recovery proof, and follow-up in one lookup.
+
+ Belongs to [16 — Incident Management](../docs/16-incident-management.md).
+
+ ### Declare and coordinate
+
+ Use local severity policy. These labels are examples, not universal response deadlines.
+
+ - **Confirm impact** — Check the affected customer operation, including background completion and oldest pending work. Record observed impact, start time, unknowns, and responder. — At the first credible signal. A healthy homepage does not clear a stalled worker.
+ - **Declare** — Open one incident record and timeline when impact or credible risk needs coordinated attention. Name the owner and a provisional severity. — Before the exact cause or user count is known. Reassess severity as evidence changes.
+ - **Critical / Major / Minor** — Critical: widespread outage, credible compromise, data loss, or blocked payments. Major: important customer work blocked or degraded. Minor: limited impact with a safe workaround. — Apply your service’s agreed policy; a small user count does not make data loss minor.
+ - **Own the response** — One incident commander owns decisions, timeline, and updates; a solo responder may hold all roles. Set an update reminder. — At declaration and whenever responders change.
+ - **Escalate / hand off** — Send impact, severity, incident link, actions and results, unknowns, and the help needed. Keep ownership until the receiver explicitly accepts it and the next action. — Use the agreed acknowledgment deadline and fallback; escalate immediately if harm grows.
+
+ ### Limit harm and keep people informed
+
+ Investigate enough to choose a safe action; keep communicating while diagnosis continues.
+
+ - **Choose a mitigation** — Check evidence, prerequisites, possible harm, stop condition, and the customer operation that will prove the action helped. Record operator, time, and observed result. — Before rollback, disabling a feature, adding capacity, degrading service, or fixing forward.
+ - **Rollback** — Confirm a relevant change, a known-good target, and schema compatibility. Application rollback does not undo a database migration. — Only when the change plausibly caused impact and the old version can safely run.
+ - **Uncertain outcomes** — Hold retries or replay until an authoritative result or reliable record establishes what already happened. Keep unresolved items for reviewed reconciliation. — A timeout may have happened after a send, charge, or write succeeded.
+ - **Possible compromise** — Use the security response route to contain access and protect evidence. Keep credentials and customer data out of public incident channels. — Availability returning does not establish that access is safe.
+ - **Customer update** — State observed impact, current action, unknowns, and the next update time through a channel that remains reachable. Update at that time even without a change. — Throughout mitigation and investigation. The next update is not a recovery estimate.
+
+ ### Prove recovery
+
+ Service recovery and follow-up closure are separate states.
+
+ - **Affected operation** — Verify that the customer operation meets its agreed criteria. Compare errors, latency, and actual outcomes with the baseline. — Before calling the incident resolved; a green provider status or homepage is insufficient.
+ - **Delayed work** — Account for the affected set: oldest pending age, completion, failures, confirmed side effects, eligible replay, expired work, and limitations disclosed to customers. — Before resuming uncertain work or announcing full recovery.
+ - **Observation window** — Observe normal work long enough for this service’s operation to complete; record why the window fits. — After mitigation and reconciliation, before the resolved update.
+ - **Recovery update** — Report verified customer impact and remaining limitations through the agreed channel. Keep unresolved investigation and prevention work open with owners. — After recovery checks pass, not merely after a mitigation command succeeds.
+
+ ### Close the learning loop
+
+ - **Postmortem** — Record impact, an evidence-backed timeline, contributing conditions, detection and response gaps, and explicit unknowns. Describe system conditions without blaming the responder. — For major or critical incidents, while evidence is fresh.
+ - **Actions** — Give each corrective action an owner, due date, and completion evidence. Review overdue work; a ticket alone is not risk reduction. — Until the correction is verified or remaining risk has an explicit decision.
+ - **Runbook** — Update the safe action, stop conditions, escalation route, recovery checks, and rehearsal from what the incident taught. — After follow-up identifies a changed procedure or missing check.
+
+ Source: [Incident Response](https://sre.google/workbook/incident-response/) — Google SRE Workbook.
+
+ ## Security Audit
+
+ Map the boundary, run the same invoice ID as two users, and leave a finding someone else can retest.
+
+ Belongs to [08 — Security Audit](../docs/08-security-audit.md).
+
+ ### Name the boundary and policy
+
+ The invoice ID is untrusted even after sign-in. The browser crosses a trust boundary at every Server Action and route handler.
+
+ - **Protected asset** — Invoice body, billing address, PDF bytes, and the ability to change or delete the record. — Inventory what disclosure or modification would harm the customer.
+ - **Entry points** — List the read page, update and delete actions, and PDF export handler. Test the endpoint directly even if its button is hidden. — Before checking code or running a scanner.
+ - **Policy** — Only the invoice owner may read, update, delete, or export. A support admin needs an explicit grant; a known UUID is not permission. — Write the expected result before sending test requests.
+
+ ### Probe with two users
+
+ Create User A and User B with separate invoices. Use B’s trusted session with A’s known invoice ID. A should still succeed on A’s own record.
+
+ - **Read** — As User B, open User A’s invoice URL. Deny the body and any useful existence detail. — Check page reads and direct data endpoints.
+ - **Update** — As User B, submit User A’s ID and a changed amount. Deny the action; confirm A’s amount is unchanged. — Check every mutation path, including direct action calls.
+ - **Delete** — As User B, submit User A’s ID to delete. Deny the action; confirm A’s invoice still exists unchanged. — Check destructive operations separately from reads.
+ - **Export** — As User B, request User A’s PDF by ID. Deny the request and return no PDF bytes. — A protected page does not protect a separate export handler.
+ - **Anonymous** — Repeat with no session. Deny all four operations, even with a valid invoice ID.
+ - **Admin without grant** — Try the same invoice as a support admin without a recorded grant. Deny access to the invoice body and PDF.
+ - **Positive control** — As User A, confirm each permitted operation succeeds on A’s own invoice. Denial alone does not prove the policy works.
+
+ ### Inspect the enforcement path
+
+ - **Session-derived owner** — Derive the user on the server and scope the invoice lookup by both ID and owner. Never accept ownerId from the request as authority. — At every data access path, not only the page that links to it.
+ - **Direct entry points** — Recheck authorization inside each reachable Server Action and route handler. A hidden control or page-level guard is insufficient.
+ - **Related controls** — Trace raw SQL insertion, untrusted HTML, reset tokens, abusable endpoints, sensitive logs, secrets, dependencies, and deployed headers. — Record the applicable checks; do not mark an absent feature as tested.
+
+ ### Leave a retestable finding
+
+ - **Evidence and impact** — Record the tested endpoint, actor, invoice ID, redacted request and response, date, and customer harm. Keep real invoice bytes out of the report.
+ - **Fix** — Scope the lookup to the caller’s permitted invoices before returning a body or producing PDF bytes.
+ - **Retest** — Repeat the same User B request: no PDF or record change. Repeat as User A: the permitted path still works.
+ - **Risk owner** — If risk remains, name the owner, reason, compensating control, and review date. Do not accept a cross-user leak because the ID is hard to guess.
+
+ ![User B is denied access to User A’s invoice after the server checks ownership.](../web/public/reference/security-invoice-audit.svg)
+
+ Original diagram for this playbook.
+
+ Source: [Insecure Direct Object References testing](https://wstg.owasp.org/latest/4-Web_Application_Security_Testing/05-Authorization/04-Insecure_Direct_Object_References/) — OWASP Web Security Testing Guide.
+
+ ## JavaScript
+
+ Array methods, async semantics, and the event loop.
+
+ *Not drawn yet.*
+
+ ## Python
+
+ Data structures, comprehensions, and the standard library worth knowing.
+
+ *Not drawn yet.*
+
+ ## Java
+
+ Collections, streams, and how the JVM spends memory.
+
+ *Not drawn yet.*
+
+ ## Spring Boot
+
+ Annotations, bean lifecycle, and where configuration comes from.
+
+ *Not drawn yet.*
+
+ ## Express & Node
+
+ Middleware order, routing, and what blocks the event loop.
+
+ *Not drawn yet.*
+

 ❯ src/lib/cheatsheets/stage09-reference.test.ts:23:20
     21| test('generated Markdown includes each companion, its load-bearing cav…
     22|   const markdown = renderCheatsheets()
     23|   expect(markdown).toContain('## Caching')
       |                    ^
     24|   expect(markdown).toContain('## Infrastructure Scaling')
     25|   expect(markdown).toContain('Server Actions only')

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  |dom| src/components/Stage09Reference.test.tsx > the registered caching route data renders drawn content and its stage tether
 FAIL  |dom| src/components/Stage09Reference.test.tsx > the registered scaling route data renders drawn content and its stage tether
AssertionError: expected undefined to be defined
 ❯ src/components/Stage09Reference.test.tsx:12:19
     10|       (sheet) => sheet.slug === slug,
     11|     )
     12|     expect(sheet).toBeDefined()
       |                   ^
     13|     render(<CheatsheetView sheet={sheet!} />)
     14|     expect(screen.queryByText('Sheet not drawn')).toBeNull()

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯


 Test Files  2 failed (2)
      Tests  4 failed (4)
   Start at  08:02:52
   Duration  1.23s (transform 189ms, setup 307ms, import 308ms, tests 11ms, environment 613ms)


```

Exit: 1.

### Task 4 integration-green

Command: `pnpm exec vitest run src/lib/cheatsheets/stage09-reference.test.ts src/components/Stage09Reference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  08:03:05
   Duration  1.26s (transform 206ms, setup 101ms, import 315ms, tests 242ms, environment 626ms)


```

Exit: 0.

### Task 4 stale-generated-red

Command: `pnpm exec vitest run src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/generate-highlighted.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/render.test.ts (2 tests | 1 failed) 7ms
   × reference/cheatsheets.md is in sync with the registry 5ms
 ❯ |unit| src/lib/cheatsheets/generate-highlighted.test.ts (1 test | 1 failed) 273ms
   × highlighted.generated.ts is in sync with the registry 273ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/generate-highlighted.test.ts > highlighted.generated.ts is in sync with the registry
Error: Snapshot `highlighted.generated.ts is in sync with the registry 1` mismatched

- Expected
+ Received

@@ -14,10 +14,11 @@
    "function area(shape: Shape) {\n  if (shape.kind === \"circle\") return Math.PI * shape.r ** 2\n  if (shape.kind === \"rect\") return shape.w * shape.h\n  // every new shape edits this function\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> area(shape</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Shape</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  if</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> (shape.kind </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">===</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\"> \"circle\"</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> Math.PI </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">*</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> shape.r </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">**</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> 2</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  if</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> (shape.kind </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">===</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\"> \"rect\"</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> shape.w </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">*</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> shape.h</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">  // every new shape edits this function</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",
    "function getUser(id: string) { /* … */ }\nfunction getOrder(id: string) { /* … */ }\nfunction getInvoice(id: string) { /* … */ }": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> getUser(id</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> string</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> getOrder(id</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> string</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> getInvoice(id</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> string</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span></code></pre>",
    "function get_user(id) { /* … */ }\nfunction fetchOrder(id) { /* … */ }\nfunction Load_Invoice(id) { /* … */ }": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> get_user(id) { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> fetchOrder(id) { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> Load_Invoice(id) { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span></code></pre>",
    "function lineTotal(item: LineItem) { return item.price * item.qty }\nfunction total(items: LineItem[]) {\n  return items.reduce((s, i) => s + lineTotal(i), 0)\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> lineTotal(item</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> LineItem</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) { </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> item.price </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">*</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> item.qty }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> total(items</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> LineItem</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">[]) {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> items.reduce((s, i) </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">=></span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> s </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">+</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> lineTotal(i), 0)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",
    "function total(items) {\n  return items.reduce((s, i) => s + i.price * i.qty, 0)\n}\nfunction subtotal(cart) {\n  return cart.reduce((s, i) => s + i.price * i.qty, 0)\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> total(items) {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> items.reduce((s, i) </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">=></span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> s </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">+</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> i.price </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">*</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> i.qty, 0)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> subtotal(cart) {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> cart.reduce((s, i) </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">=></span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> s </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">+</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> i.price </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">*</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> i.qty, 0)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",
+   "import { cacheLife, cacheTag } from 'next/cache'\n\nexport async function readDescription(productId: string) {\n  'use cache'\n  cacheLife('minutes')\n  cacheTag(`catalog:${productId}`)\n  const response = await fetch(\n    `https://catalog.example/products/${encodeURIComponent(productId)}`,\n  )\n  if (!response.ok) throw new Error('Catalog read failed')\n  const { id, description } = await response.json()\n  return { id, description }\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">import</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { cacheLife, cacheTag } </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">from</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\"> 'next/cache'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">export</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> async</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> function</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> readDescription(productId</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> string</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">  'use cache'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  cacheLife(</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">'minutes'</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  cacheTag(</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">`catalog:${</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">productId</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">}`</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  const</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> response </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">=</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> await</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> fetch(</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">    `https://catalog.example/products/${</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">encodeURIComponent(productId)</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">}`</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">,</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  )</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  if</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> (</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">!</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">response.ok) </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">throw</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> new</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> Error(</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">'Catalog read failed'</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  const</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { id, description } </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">=</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> await</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> response.json()</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { id, description }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",
    "import { expect, test } from 'vitest'\n\ntest('adds numbers correctly', () => {\n  expect(add(2, 3)).toBe(5)\n})": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">import</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { expect, test } </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">from</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\"> 'vitest'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">test(</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">'adds numbers correctly'</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">, () </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">=></span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  expect(add(2, 3)).toBe(5)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">})</span></span></code></pre>",
    "interface Database { connect(): void }\nclass UserService {\n  constructor(private db: Database) {}\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">interface</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Database</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { connect()</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> void</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">class</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> UserService</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">  constructor</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">(</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">private</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> db</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Database</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) {}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",
    "interface Shape { area(): number }\nclass Circle implements Shape {\n  area() { return Math.PI * this.r ** 2 }\n}\n// a new shape adds a class, this function never changes": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">interface</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Shape</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { area()</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> number</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">class</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Circle</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> implements</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Shape</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  area() { </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">return</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> Math.PI </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">*</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> this.r </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">**</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> 2 }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">// a new shape adds a class, this function never changes</span></span></code></pre>",
    "interface Workable { work(): void }\ninterface Eatable { eat(): void }\nclass Robot implements Workable {\n  work() { /* … */ }\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">interface</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Workable</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { work()</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> void</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">interface</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Eatable</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> { eat()</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> void</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">class</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Robot</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> implements</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Workable</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  work() { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",
    "interface Worker {\n  work(): void\n  eat(): void\n}\nclass Robot implements Worker {\n  work() { /* … */ }\n  eat() { throw new Error(\"Robots don’t eat\") }\n}": "<pre class=\"shiki shiki-themes playbook-light playbook-dark\" style=\"--shiki-light:#10243e;--shiki-dark:#e9eff6;--shiki-light-bg:#fffffe;--shiki-dark-bg:#1e1e1e\" tabindex=\"0\"><code><span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">interface</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Worker</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  work()</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> void</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  eat()</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">:</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> void</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">class</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Robot</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> implements</span><span style=\"--shiki-light:#10243E;--shiki-light-font-weight:bold;--shiki-dark:#E9EFF6;--shiki-dark-font-weight:bold\"> Worker</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  work() { </span><span style=\"--shiki-light:#556377;--shiki-light-font-style:italic;--shiki-dark:#98ABC0;--shiki-dark-font-style:italic\">/* … */</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">  eat() { </span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\">throw</span><span style=\"--shiki-light:#23508F;--shiki-dark:#86B4EE\"> new</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\"> Error(</span><span style=\"--shiki-light:#5D5A14;--shiki-dark:#BEB937\">\"Robots don’t eat\"</span><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">) }</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#10243E;--shiki-dark:#E9EFF6\">}</span></span></code></pre>",

 ❯ src/lib/cheatsheets/generate-highlighted.test.ts:9:3
      7| test('highlighted.generated.ts is in sync with the registry', async ()…
      8|   const content = await renderHighlighted()
      9|   await expect(content).toMatchFileSnapshot('./highlighted.generated.t…
       |   ^
     10| })
     11|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  |unit| src/lib/cheatsheets/render.test.ts > reference/cheatsheets.md is in sync with the registry
Error: Snapshot `reference/cheatsheets.md is in sync with the registry 1` mismatched

- Expected
+ Received

@@ -4,11 +4,11 @@
       Edit the sheet there and run `pnpm gen:cheatsheets` (from web/) to regenerate. -->

  Lookup material rather than reading material. A stage teaches a decision; a
  sheet answers what that command was.

- Drawn: 20 of 25. A sheet listed as not drawn is
+ Drawn: 22 of 27. A sheet listed as not drawn is
  registered on purpose — the gap is the point, so it can be seen and filled.

  | Sheet | Group | Stage | Status |
  |---|---|---|---|
  | Software Architecture Patterns | Architecture | 03 | Drawn |
@@ -29,10 +29,12 @@
  | Post-Deploy Verification | Standards | 14 | Drawn |
  | CI/CD Pipeline | Standards | 11 | Drawn |
  | GitHub Actions | Standards | 11 | Drawn |
  | Incident Management | Standards | 16 | Drawn |
  | Security Audit | Standards | 08 | Drawn |
+ | Caching | Architecture | 09 | Drawn |
+ | Infrastructure Scaling | Architecture | 09 | Drawn |
  | JavaScript | Languages | — | Not drawn |
  | Python | Languages | — | Not drawn |
  | Java | Languages | — | Not drawn |
  | Spring Boot | Languages | — | Not drawn |
  | Express & Node | Languages | — | Not drawn |
@@ -183,10 +185,143 @@
  - **CI/CD** — Pipelines that build, test and deploy on every change rather than on a manual release day.
  - **Beyond REST** — GraphQL and gRPC as alternatives to REST; WebSockets and webhooks for the cases a request-response cycle does not fit.
  - **Microservices communication** — Services talk to each other the same way clients talk to the API — the design principles above apply internally too.

  Source: Master Plan for API Design — Shalini Goyal.
+
+ ## Caching
+
+ Choose reusable work, set a freshness rule, invalidate after writes, and verify the same user outcome.
+
+ Belongs to [09 — Performance Optimization](../docs/09-performance-optimization.md).
+
+ ### Choose the boundary
+
+ Cache a result only when its ownership scope and tolerated staleness are defined. These are application decisions, not a command to add a cache everywhere.
+
+ - **Reusable result** — A public catalog description can be a candidate for reuse. A faster response is useful only if it still answers the intended user operation. — Use evidence that the repeated work contributes to the measured slow path.
+ - **Current business decision** — Validate stock, charge status and authorization against the appropriate authoritative state. A cached description is not permission to sell, charge or disclose. — Before accepting an order, confirming payment or returning protected data.
+ - **Key and ownership** — Include every input that changes the result, such as product, locale or tenant. A tenant-specific cache key does not grant access; authorization still belongs at the data boundary. — Test the same identifier as two users or tenants before sharing a cached result.
+
+ ### Set lifetime and tags
+
+ TTL means time to live: a freshness or expiry interval under the chosen cache policy. Retention is how long an entry remains stored; neither term promises persistence on every host.
+
+ - `cacheComponents: true` — Enable Cache Components in the example application before using the Next.js use cache directive. This playbook is teaching the API; it does not enable runtime caching here. — Check the installed framework version and hosting behavior.
+ - `'use cache'` — Mark an async function, component or module scope for caching. Read cookies, headers and other request-specific values outside that scope, then pass the needed inputs. — Reuse an eligible result, with its input and ownership boundaries already defined.
+
+   *Illustrative public-description read; example domain, not this app*
+
+   ```
+   import { cacheLife, cacheTag } from 'next/cache'
+
+   export async function readDescription(productId: string) {
+     'use cache'
+     cacheLife('minutes')
+     cacheTag(`catalog:${productId}`)
+     const response = await fetch(
+       `https://catalog.example/products/${encodeURIComponent(productId)}`,
+     )
+     if (!response.ok) throw new Error('Catalog read failed')
+     const { id, description } = await response.json()
+     return { id, description }
+   }
+   ```
+
+ - `cacheLife / cacheTag` — Choose a lifetime consistent with tolerated staleness and tag the reads a successful write will invalidate. Tags label entries; they are not authorization checks. — Describe the expected read after a write, not only how long the entry might be retained.
+ - **Hosting and retention** — Default runtime memory can be instance-local and ephemeral, especially on serverless hosts. Check the configured cache handler before assuming reuse across requests or deployments. — A published lifetime is not evidence that a particular instance still holds the entry.
+
+ ### Invalidate after a write
+
+ The write must succeed before invalidating affected reads. Invalidation changes the next matching data read; it does not automatically refresh every open browser view.
+
+ - `updateTag(tag)` — Server Actions only: expire matching entries immediately so the next matching read waits for fresh data. — Use after a successful write when the actor must read their own change. It is not available in Route Handlers.
+ - `revalidateTag(tag, 'max')` — Server Actions or Route Handlers: mark tagged data stale; the next visit can receive stale data while revalidation runs in the background. — Use when stale-while-revalidate behavior is acceptable. The call itself does not eagerly refresh every tagged page.
+ - `revalidateTag(tag, { expire: 0 })` — From a Route Handler that requires immediate expiry, make the next matching read block for fresh data. — Use when stale content is unacceptable and updateTag is unavailable. Avoid the deprecated single-argument revalidateTag form.
+
+ ### Read CDN evidence
+
+ CDN means content delivery network. CF-Cache-Status describes Cloudflare response caching, not Next.js application-cache entries. These examples do not imply this site uses Cloudflare.
+
+ - **HIT** — Cloudflare found the response in its cache. — A hit does not prove the application data reflects the latest write.
+ - **MISS** — The request was eligible for Cloudflare caching but the response was absent, so the origin served it. — A first or cold request can miss without a fault.
+ - **BYPASS** — Cloudflare considered the request eligible, but the response or policy prevented storing the response. — Inspect the relevant response headers and cache rules before changing the policy.
+ - **DYNAMIC** — Cloudflare considered the request ineligible for cache at request time. — Check eligibility rules; do not treat this as a missing Next.js tag.
+ - **Freshness and retention** — A freshness interval controls when origin validation is required. An expired entry may still be retained; stale serving depends on the applicable revalidation policy. — Keep CDN headers and application-cache tags as separate controls.
+ - `curl -sS -D - -o /dev/null https://catalog.example/products/demo` — Read response headers for an explicitly illustrative URL. Inspect CF-Cache-Status and the applicable Cache-Control headers on a real test endpoint. — Use a safe read endpoint; do not infer application-cache behavior from a CDN header.
+
+ ### Verify the change
+
+ A cache hit is diagnostic evidence, not proof of a better or correct user outcome.
+
+ - **Comparable outcome** — Compare the same observer, start/end events, segment, workload, observation window and cold/warm cache state. A p95 is the duration at the 95th percentile of the stated population. — Record the sample, timeout/failure rule, errors and correctness as well as latency; a single lab run is not a field p95.
+ - **Freshness and isolation** — After the write, confirm the intended reader sees the expected state. Repeat as another user or tenant and confirm protected data is not disclosed. — Keep the cache change only when the freshness rule, authorization and user target still hold.
+
+ Sources:
+
+ Source: [use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache) — Next.js.
+
+ Source: [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) — Next.js.
+
+ Source: [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag) — Next.js.
+
+ Source: [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) — Next.js.
+
+ Source: [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — Next.js.
+
+ Source: [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/) — Cloudflare.
+
+ Source: [Retention vs Freshness (TTL)](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/) — Cloudflare.
+
+ ## Infrastructure Scaling
+
+ Find the constrained resource, compare routing choices, plan for overload, and prove the user outcome.
+
+ Belongs to [09 — Performance Optimization](../docs/09-performance-optimization.md).
+
+ ### Locate the limit
+
+ This is infrastructure scaling. Stage 09's Scaling to a team section describes team practice. Routing and added capacity are candidates to justify with evidence, not routine fixes for every slow request.
+
+ - **Constrained resource** — Name the user outcome, workload and limiting resource using measurements. CPU, memory, connections, storage or a shared dependency can constrain different operations. — A utilization chart alone does not define the observer, duration or customer harm.
+ - **Vertical capacity** — Increase resources on one instance when evidence shows its resource limit is the constraint. — Check the remaining limit, failure exposure and cost rather than assuming a larger instance is faster.
+ - **Horizontal capacity** — Add replicas when the work can be safely distributed and the shared dependencies can support it. — Check state, session and connection assumptions before adding targets.
+ - **Routing and dependencies** — A load balancer distributes requests. More application replicas do not establish more capacity in a shared database; reducing expensive work is a different candidate. — Check the dependency that remains shared and identify what the proposed change actually relieves.
+
+ ### Choose routing
+
+ The following are AWS Application Load Balancer (ALB) target-group algorithms. A provider-specific setting is not a universal algorithm list. Sticky sessions can bypass subsequent routing choices.
+
+ - **Round robin** — Distribute requests across healthy targets in sequential order under normal routing conditions. — An ALB default suited to similarly costly requests and similarly capable targets; stickiness affects subsequent target selection.
+ - **Least outstanding requests** — Choose the target with the fewest in-flight requests. — An ALB option for varying request cost or target capability. It does not support slow start; sticky sessions affect subsequent selection.
+ - **Weighted random** — Randomly distribute requests across healthy targets; optional Automatic Target Weights anomaly mitigation can adjust distribution. — ALB weighted random does not support sticky sessions or slow start. Check the intended workload and feature compatibility.
+ - `aws elbv2 describe-target-group-attributes --target-group-arn "$TARGET_GROUP_ARN"` — Read target-group attributes without changing routing. TARGET_GROUP_ARN must name your permitted test group; AWS credentials and read permission are required. — Inspect routing, stickiness and health settings before proposing a mutation.
+
+ ### Check health and overload
+
+ Health checks and routing do not create unlimited capacity. Define the operation the probe represents and the behavior when capacity or targets fail.
+
+ - **Health checks and fail-open** — ALB normally routes to healthy targets. If all registered targets are unhealthy, it fails open and can route to them regardless of health status. — A failed probe is not proof that all traffic to that target has stopped; inspect health/routing thresholds as well as the reason code.
+ - **Draining and failure capacity** — Deregistration allows in-flight work time to finish. Check remaining target and dependency capacity while a target or zone is unavailable. — A connection terminated before draining completes can fail a request; do not equate a removed target with completed customer work.
+ - **Admission and degradation** — Keep admitted work and queues bounded. Under overload, use a defined safe degraded response or reject excess work instead of letting backlog grow without a limit. — Degrade only when the user contract permits it; stale payment or authorization state is not a safe shortcut.
+ - **Retries and uncertain outcomes** — Retries add work to an overloaded service. Use a bounded retry policy and establish whether a timed-out side effect already succeeded before replay. — A charge or write may have completed before the timeout. Reconcile uncertain outcomes rather than assuming retry means recovery.
+
+ ### Prove the outcome
+
+ There is no universal requests-per-second target or replica count. Example workloads are illustrative; measure the same operation before and after.
+
+ - **User latency and errors** — Compare the same start/end observer, segment, workload and collection window. Define the percentile population and keep failures visible. A p95 is the duration at the 95th percentile of that population. — A faster routing or server span does not prove the user operation improved.
+ - **Resource and delayed work** — Check the limiting resource, shared dependencies and oldest pending work where applicable. Verify capacity during failure as well as normal traffic. — A healthy homepage or an empty request queue does not prove that downstream work completed.
+ - **Correctness and cost** — Retest state/session assumptions and actual customer outcomes. Compare resource cost, record unresolved limits, and keep or revert the change from that evidence. — Adding replicas is not a win if the outcome still misses its target or correctness regresses.
+
+ Sources:
+
+ Source: [Application Load Balancer target-group attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html) — AWS.
+
+ Source: [Application Load Balancer target-group health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) — AWS.
+
+ Source: [Handling Overload](https://sre.google/sre-book/handling-overload/) — Google SRE.

  ## SOLID Principles

  Five rules for code that stays easy to change, test and extend.


 ❯ src/lib/cheatsheets/render.test.ts:15:3
     13| // lives at the repo root, four levels up from here.
     14| test('reference/cheatsheets.md is in sync with the registry', async ()…
     15|   await expect(renderCheatsheets()).toMatchFileSnapshot(
       |   ^
     16|     '../../../../reference/cheatsheets.md',
     17|   )

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


  Snapshots  2 failed
 Test Files  2 failed (2)
      Tests  2 failed | 1 passed (3)
   Start at  08:03:08
   Duration  510ms (transform 170ms, setup 0ms, import 293ms, tests 281ms, environment 0ms)


```

Exit: 1.

### Task 4 gen-cheatsheets

Command: `pnpm gen:cheatsheets`

```text

> web@0.1.0 gen:cheatsheets /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run src/lib/cheatsheets/render.test.ts --update


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


  Snapshots  1 updated
 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  08:03:17
   Duration  193ms (transform 80ms, setup 0ms, import 110ms, tests 4ms, environment 0ms)


```

Exit: 0.

### Task 4 gen-highlighted

Command: `pnpm gen:highlighted`

```text

> web@0.1.0 gen:highlighted /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run src/lib/cheatsheets/generate-highlighted.test.ts --update


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


  Snapshots  1 updated
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  08:03:19
   Duration  446ms (transform 79ms, setup 0ms, import 132ms, tests 231ms, environment 0ms)


```

Exit: 0.

### Task 4 generated-green

Command: `pnpm exec vitest run src/lib/cheatsheets/index.test.ts src/lib/cheatsheets/stage09-reference.test.ts src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/generate-highlighted.test.ts src/components/Stage09Reference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  5 passed (5)
      Tests  29 passed (29)
   Start at  08:03:21
   Duration  4.36s (transform 1.40s, setup 177ms, import 2.28s, tests 2.80s, environment 1.23s)


```

Exit: 0.

### Task 4 tether-teeth

Command: `pnpm exec vitest run src/lib/cheatsheets/stage09-reference.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/stage09-reference.test.ts (2 tests | 1 failed) 5ms
   × stage 09 exposes both drawn companion sheets without consuming the five language placeholders 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/stage09-reference.test.ts > stage 09 exposes both drawn companion sheets without consuming the five language placeholders
AssertionError: expected [ 'caching' ] to deeply equal [ 'caching', 'scaling' ]

- Expected
+ Received

  [
    "caching",
-   "scaling",
  ]

 ❯ src/lib/cheatsheets/stage09-reference.test.ts:8:52
      6| test('stage 09 exposes both drawn companion sheets without consuming t…
      7|   const sheets = cheatsheetsForStage('09-performance-optimization')
      8|   expect(sheets.map((sheet) => sheet.slug).sort()).toEqual([
       |                                                    ^
      9|     'caching',
     10|     'scaling',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  08:03:40
   Duration  239ms (transform 124ms, setup 0ms, import 149ms, tests 5ms, environment 0ms)


```

Exit: 1.

### Task 4 restored-green

Command: `pnpm exec vitest run src/lib/cheatsheets/index.test.ts src/lib/cheatsheets/stage09-reference.test.ts src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/generate-highlighted.test.ts src/components/Stage09Reference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  5 passed (5)
      Tests  29 passed (29)
   Start at  08:03:43
   Duration  1.05s (transform 448ms, setup 78ms, import 781ms, tests 392ms, environment 571ms)


```

Exit: 0.

### Source recheck against final rows, 2026-10-14

The controller's 2026-10-13 source check supplied the initial provenance. On 2026-10-14 the Task 4 implementer reopened every first-party document below and compared the final caching and scaling modules with the approved design. No factual mismatch or source correction was found. These are documentation checks; no cache, backend or ALB was measured or configured.

- [Next.js use cache](https://nextjs.org/docs/app/api-reference/directives/use-cache), [cacheLife](https://nextjs.org/docs/app/api-reference/functions/cacheLife) and [cacheTag](https://nextjs.org/docs/app/api-reference/functions/cacheTag) confirm the Cache Components prerequisite, async cached functions/components, request values resolved outside cached scopes, hosting-dependent retention, lifetime profiles and tags inside cached scopes. The example remains teaching content and next.config.ts is unchanged.
- [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) confirms Server Actions only, immediate expiry and a next read waiting for fresh data. [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) confirms max permits stale-while-revalidate; expire: 0 blocks the next matching read for fresh data; the single-argument form is deprecated. Revalidation happens when requested rather than eagerly rebuilding every tagged page.
- [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/) confirms HIT finds a cached response, MISS is eligible but absent, BYPASS is a response-time non-cacheability decision, and DYNAMIC is request-time ineligibility. [Retention versus freshness](https://developers.cloudflare.com/cache/concepts/retention-vs-freshness/) distinguishes residence until eviction from the interval before origin validation. A CDN HIT cannot establish current application data; that final-row caveat is the playbook's application inference, not a provider quotation.
- [AWS ALB attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html) confirms round robin as default, least outstanding requests for differing request/target work, its incompatibility with slow start, weighted random's ATW support and incompatibility with slow start or sticky sessions, and subsequent sticky-session routing bypass. Draining gives in-flight work time, with connection-failure caveats. [ALB health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) confirms fail-open when all registered targets are unhealthy across enabled Availability Zones. The final sheet does not claim failed probes stop all traffic.
- [Google SRE Handling Overload](https://sre.google/sre-book/handling-overload/) supports workload-dependent limits, bounded admission/degradation and retry amplification limits. Authorization, comparable customer outcomes and reconciling uncertain side effects remain playbook discipline carried from the reviewed chapter and incident guidance. No universal throughput or replica target is asserted.

The source-ledger append maps these documents to the two sheets. The chapter audit's original 2026-10-08 findings are retained, with a lookup follow-up linking the ledger and this report. No image was copied, converted or published.

### Fresh blind lookup

Controller dispatched a fresh reader blind to the plan/spec. The reader saw only a blind brief and the exact generated Markdown extracted after registration and restored GREEN. Its report follows verbatim; 4 passes/0 misses. The need to consult Prove the outcome alongside Choose routing is a lookup observation, not a defect.

# Blind reference lookup report

Read only `cold-reader-brief.md` and `cold-sheets.md`. No outside research, source inspection, tests or other reports were used.

Result: **4 passes, 0 misses**. The sheet wording was sufficient to answer all four questions. No lookup ambiguity was found within the questions' scope.

## 1. Webhook invalidation after a successful description update

**Recommendation:** Its Route Handler can call `revalidateTag(tag, 'max')` when stale-while-revalidate is acceptable, or `revalidateTag(tag, { expire: 0 })` when stale content is unacceptable. The first marks tagged data stale and allows the next visit to receive stale data while background revalidation runs. The second expires immediately so the next matching read blocks for fresh data.

**Location:** Caching → Invalidate after a write → `revalidateTag(tag, 'max')` and `revalidateTag(tag, { expire: 0 })` rows. The adjacent `updateTag(tag)` row establishes that `updateTag` is Server Actions only and unavailable in Route Handlers.

**Conditions/caveats:** The write must succeed before affected reads are invalidated. Invalidation changes the next matching data read and does not automatically refresh every open browser view. Avoid the deprecated single-argument `revalidateTag` form. Tags must identify the affected reads, as explained in Caching → Set lifetime and tags → `cacheLife / cacheTag`.

**Lookup verdict:** Pass. Both callable options and the freshness distinction are explicit; external research was unnecessary.

## 2. Does `CF-Cache-Status: HIT` establish latest-write application data?

**Answer:** No. It establishes that Cloudflare found the response in its cache, not that application data reflects the latest write.

**Location:** Caching → Read CDN evidence → HIT row. The section introduction identifies `CF-Cache-Status` as Cloudflare response-cache evidence rather than Next.js application-cache evidence.

**Conditions/caveats:** CDN headers and application-cache tags are separate controls (Freshness and retention row). To establish the expected freshness, check that the intended reader sees the expected state after the write (Caching → Verify the change → Freshness and isolation). A hit by itself cannot answer that question.

**Lookup verdict:** Pass. The exact limitation is stated in the HIT row; external research was unnecessary.

## 3. Uneven in-flight work across ALB targets

**Recommendation:** Investigate **least outstanding requests**, which chooses the target with the fewest in-flight requests and is described as an ALB option for varying request cost or target capability.

**Location:** Infrastructure Scaling → Choose routing → Least outstanding requests row.

**Conditions/caveats:** It does not support slow start, and sticky sessions affect subsequent target selection. The sheet does not promise that the count of outstanding requests measures the actual amount of work in each request or guarantees improvement. Infrastructure Scaling → Prove the outcome → User latency and errors requires comparison using the same observer, segment, workload and collection window, with failures visible; a faster routing or server span does not prove the user operation improved. Correctness and cost also requires retesting state/session assumptions and actual customer outcomes.

**Lookup verdict:** Pass. The algorithm and compatibility limits are explicit, and the outcome-measurement caveat is available in the same sheet. External research was unnecessary. The recommendation is to investigate, not an assertion of guaranteed load balance.

## 4. All registered targets fail health probes

**Answer:** No. The ALB fails open when all registered targets are unhealthy and can route to them regardless of health status.

**Location:** Infrastructure Scaling → Check health and overload → Health checks and fail-open row.

**Conditions/caveats:** Normal routing uses healthy targets, but the all-unhealthy condition changes that behavior. A failed probe does not prove traffic to that target has stopped. Inspect health/routing thresholds and the reason code. The wording says it *can* route to unhealthy targets; it does not promise every request succeeds or define an exact traffic distribution.

**Lookup verdict:** Pass. The all-unhealthy exception and its caveat are directly stated; external research was unnecessary.

## Findings

- All four answers could be located by the sheet section names and named rows.
- No lookup misses or blocking ambiguities were found.
- The routing answer requires combining Choose routing with Prove the outcome to cover measurement; the compatibility caveat is alongside the algorithm itself.

### Task 4 full gate, cheapest first

Each command ran sequentially from web. The sandbox-only build could not fetch the three configured Google Fonts. The same real build was retried with scoped network access and passed, generating 52 pages. No mock fonts, dependencies or configuration were substituted. Production browser evidence and development validation are reported separately below.


#### Task 4 gate format

Command: `pnpm format:check`

```text

> web@0.1.0 format:check /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> prettier --check .

Checking formatting...
All matched files use Prettier code style!

```

Exit: 0.

#### Task 4 gate lint

Command: `pnpm lint`

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> eslint --max-warnings 0


```

Exit: 0.

#### Task 4 gate typecheck

Command: `pnpm typecheck`

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully

```

Exit: 0.

#### Task 4 gate test

Command: `pnpm test`

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  207 passed (207)
      Tests  1493 passed (1493)
   Start at  08:04:36
   Duration  33.15s (transform 19.50s, setup 16.51s, import 41.91s, tests 44.28s, environment 87.38s)


```

Exit: 0.

#### Task 4 gate build

Command: `pnpm build (sandbox only)`

```text

> web@0.1.0 build /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next build

▲ Next.js 16.2.10 (Turbopack)

  Creating an optimized production build ...
Turbopack build encountered 3 warnings:
[next]/internal/font/google/archivo_d462d458.module.css
Error while requesting resource
There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap


[next]/internal/font/google/jetbrains_mono_f8290d5a.module.css
Error while requesting resource
There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap


[next]/internal/font/google/newsreader_8524af2f.module.css
Error while requesting resource
There was an issue establishing a connection while requesting https://fonts.googleapis.com/css2?family=Newsreader:wght@200..800&display=swap



> Build error occurred
Error: Turbopack build failed with 3 errors:
[next]/internal/font/google/archivo_d462d458.module.css
next/font: error:
Failed to fetch `Archivo` from Google Fonts.


[next]/internal/font/google/jetbrains_mono_f8290d5a.module.css
next/font: error:
Failed to fetch `JetBrains Mono` from Google Fonts.


[next]/internal/font/google/newsreader_8524af2f.module.css
next/font: error:
Failed to fetch `Newsreader` from Google Fonts.


    at ignore-listed frames
 ELIFECYCLE  Command failed with exit code 1.

```

Exit: 1.

#### Task 4 gate build-network

Command: `pnpm build (scoped real-font network access)`

```text

> web@0.1.0 build /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next build

▲ Next.js 16.2.10 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 2.6s
  Running TypeScript ...
  Finished TypeScript in 5.5s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/52) ...
  Generating static pages using 7 workers (13/52)
  Generating static pages using 7 workers (26/52)
  Generating static pages using 7 workers (39/52)
✓ Generating static pages using 7 workers (52/52) in 369ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /reference
├ ● /reference/[slug]
│ ├ /reference/architecture-patterns
│ ├ /reference/design-patterns
│ ├ /reference/api-design
│ └ [+24 more paths]
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ● /stages/[slug]
  ├ /stages/01-product-discovery
  ├ /stages/02-planning
  ├ /stages/03-architecture
  └ [+15 more paths]


○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)


```

Exit: 0.

### Follow-up: generated snippet blank lines

PRE-EXISTING GENERATOR behavior newly exposed: the existing Markdown renderer indented every snippet line, including empty lines. The approved caching example contains a blank line, causing git diff --check to flag generated reference/cheatsheets.md:216. PLAN-AUTHORED missed condition: the plan expected a clean whitespace check but did not cover this generator case. The controller approved a narrow test-first repair on 2026-10-14 and recorded the ruling in the local progress ledger. The approved example was retained.

Hypothesis: render.ts unconditionally adds two spaces to empty snippet lines. A real rendered fixture with first(), an empty line and second() reproduced the spaces-only output. Its regression asserts empty lines stay empty and nonempty code lines keep the Markdown indentation. RED failed for the right reason (received a two-space line); the minimum conditional prefix made GREEN pass. Restoring the original unconditional prefix made only that regression fail in the full four-test fixture file; after restore all four passed. Markdown was regenerated only with the correct implementation. The six-file affected suite passed 33/33, including Markdown and highlight snapshot guards. This justified a fresh full gate and browser runs below.

Displayed terminal fences in Task 4 normalize trailing padding only, to keep the report itself free of whitespace diagnostics. Commands, counts, assertion text and exits are unchanged. Exact raw stdout/stderr remain in the plan-scoped task4-*.log files; SHA-256 hashes are recorded at handoff. Earlier task evidence is untouched.

#### Task 4 blank-line-red

Command: `pnpm exec vitest run src/lib/cheatsheets/render-citations.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/render-citations.test.ts (4 tests | 1 failed) 6ms
   × blank snippet lines stay empty so generated Markdown passes whitespace checks without losing code indentation 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/render-citations.test.ts > blank snippet lines stay empty so generated Markdown passes whitespace checks without losing code indentation
AssertionError: expected [ '  ' ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "  ",
+ ]

 ❯ src/lib/cheatsheets/render-citations.test.ts:84:64
     82|   })
     83|   const text = renderCheatsheets()
     84|   expect(text.split('\n').filter((line) => /^ +$/.test(line))).toEqual…
       |                                                                ^
     85|   expect(text).toContain('  ```\n  first()\n\n  second()\n  ```')
     86| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  08:10:52
   Duration  148ms (transform 36ms, setup 0ms, import 47ms, tests 6ms, environment 0ms)


```

Exit: 1.

#### Task 4 blank-line-green

Command: `pnpm exec vitest run src/lib/cheatsheets/render-citations.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  08:11:19
   Duration  474ms (transform 255ms, setup 0ms, import 324ms, tests 18ms, environment 0ms)


```

Exit: 0.

#### Task 4 blank-line-teeth

Command: `pnpm exec vitest run src/lib/cheatsheets/render-citations.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web

 ❯ |unit| src/lib/cheatsheets/render-citations.test.ts (4 tests | 1 failed) 6ms
   × blank snippet lines stay empty so generated Markdown passes whitespace checks without losing code indentation 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  |unit| src/lib/cheatsheets/render-citations.test.ts > blank snippet lines stay empty so generated Markdown passes whitespace checks without losing code indentation
AssertionError: expected [ '  ' ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "  ",
+ ]

 ❯ src/lib/cheatsheets/render-citations.test.ts:84:64
     82|   })
     83|   const text = renderCheatsheets()
     84|   expect(text.split('\n').filter((line) => /^ +$/.test(line))).toEqual…
       |                                                                ^
     85|   expect(text).toContain('  ```\n  first()\n\n  second()\n  ```')
     86| })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  08:11:24
   Duration  384ms (transform 96ms, setup 0ms, import 132ms, tests 6ms, environment 0ms)


```

Exit: 1.

#### Task 4 blank-line-restored

Command: `pnpm exec vitest run src/lib/cheatsheets/render-citations.test.ts`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  08:11:29
   Duration  148ms (transform 38ms, setup 0ms, import 57ms, tests 3ms, environment 0ms)


```

Exit: 0.

#### Task 4 regen-markdown

Command: `pnpm gen:cheatsheets`

```text

> web@0.1.0 gen:cheatsheets /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run src/lib/cheatsheets/render.test.ts --update


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


  Snapshots  1 updated
 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  08:11:31
   Duration  280ms (transform 96ms, setup 0ms, import 120ms, tests 6ms, environment 0ms)


```

Exit: 0.

#### Task 4 final-focused

Command: `pnpm exec vitest run src/lib/cheatsheets/index.test.ts src/lib/cheatsheets/stage09-reference.test.ts src/lib/cheatsheets/render.test.ts src/lib/cheatsheets/render-citations.test.ts src/lib/cheatsheets/generate-highlighted.test.ts src/components/Stage09Reference.test.tsx`

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  6 passed (6)
      Tests  33 passed (33)
   Start at  08:11:33
   Duration  1.75s (transform 780ms, setup 109ms, import 1.32s, tests 508ms, environment 652ms)


```

Exit: 0.

### Final verification boundary after generator repair

The controller revised the verification ruling after checking consumers: renderCheatsheets has no app runtime consumer and is imported only by Markdown tests/generation. A repository search confirmed that boundary. The running production UI audit therefore covers the unchanged DOM renderer and authored UI data. Its full output is retained as valid UI evidence. After the repair, affected generator guards, the full suite, format/lint/typecheck and a fresh production build run again. Development-console and manual matrix evidence use the rebuilt application. No second full production UI audit is required unless a runtime/UI dependency change emerges. Cost if this boundary is wrong: an undocumented runtime dependency could require repeating that audit.


#### Task 4 gate final-format

Command: `pnpm format:check`

```text

> web@0.1.0 format:check /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> prettier --check .

Checking formatting...
All matched files use Prettier code style!

```

Exit: 0.

#### Task 4 gate final-lint

Command: `pnpm lint`

```text

> web@0.1.0 lint /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> eslint --max-warnings 0


```

Exit: 0.

#### Task 4 gate final-typecheck

Command: `pnpm typecheck`

```text

> web@0.1.0 typecheck /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next typegen && tsc --noEmit

Generating route types...
✓ Types generated successfully

```

Exit: 0.

#### Task 4 gate final-test

Command: `pnpm test`

```text

> web@0.1.0 test /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> vitest run


 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  207 passed (207)
      Tests  1494 passed (1494)
   Start at  08:12:36
   Duration  28.92s (transform 13.47s, setup 12.35s, import 34.64s, tests 44.13s, environment 71.79s)


```

Exit: 0.

#### Production browser audit

Command: `pnpm test:e2e`. Production build/server on :3100; 24/24 checks passed in 8.5 minutes, exit 0. This run began before the Markdown-only blank-line repair and completed afterward. Its built UI surface is unchanged by that generator repair, as confirmed by the consumer check and controller ruling above. The registry-derived discovery guard included all 27 registered sheets, including caching and scaling. React development validation is not present in this production build and is checked separately. Node emitted inherited NO_COLOR/FORCE_COLOR warnings; the browser console-error assertion passed.

```text

> web@0.1.0 test:e2e /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> playwright test

[WebServer] (node:75335) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:75349) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:75349) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:75506) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:75507) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76801) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76799) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76805) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76802) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76803) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76800) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76831) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:76925) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 24 tests using 3 workers

(node:77991) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77992) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:77990) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ✓   1 e2e/performance.spec.ts:6:5 › performance choices use native radio keys and keep the first committed answer (1.8s)
  ✓   4 e2e/performance.spec.ts:29:5 › performance worksheets support direct links, Back and reload with long literal input in both themes (4.6s)
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"light","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(138, 90, 6)","bgs":["rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(70, 88, 110)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(16, 36, 62)","bgs":["rgb(230, 228, 220)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(250, 249, 245)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(239, 238, 232)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"save-denied","height":1787.59375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"save-denied","height":1631.09375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"save-denied","height":1463.890625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"draft-outcome","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved observer and outcome"},{"id":"draft-scope","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"15px","fontWeight":"400","sample":"Unsaved scope"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":320,"id":"panel-record","state":"copy-denied","height":2053.84375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":390,"id":"panel-record","state":"copy-denied","height":1877.34375,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":768,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1024,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1440,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":1920,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
PERFORMANCE_PERMISSION_STATE {"theme":"dark","width":2560,"id":"panel-record","state":"copy-denied","height":1690.140625,"overflow":false,"pairs":[{"id":"save-warning","fg":"rgb(227, 171, 77)","bgs":["rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Saving is unavailable. This draft remains editable here; export it before leaving or reloading."},{"id":"copy-status","fg":"rgb(173, 192, 212)","bgs":["rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"Copy is unavailable. Select the Markdown below and copy it manually."},{"id":"manual-markdown","fg":"rgb(233, 239, 246)","bgs":["rgb(7, 19, 34)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(16, 38, 64)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgba(0, 0, 0, 0)","rgb(10, 26, 44)","rgba(0, 0, 0, 0)"],"fontSize":"14px","fontWeight":"400","sample":"# Performance measurement record\n\n## Outcome and observer\n\nUnsaved observer and outcome\n\n## Metric and population\n\nnot recorded\n\n## Scope\n\nUnsaved scope\n\n## Win"}],"smallTargets":[]}
  ✓   5 e2e/performance.spec.ts:80:5 › permission failures retain the worksheet and offer manual export with zero page errors (2.8s)
  ✓   6 e2e/performance.spec.ts:235:5 › an internal improvement requires more observation rather than a production win (888ms)
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"light","width":1920,"left":1357,"right":1709,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":2560,"left":1677,"right":2029,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":768,"left":399.65625,"right":751.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1024,"left":655.328125,"right":1007.328125,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":320,"left":32,"right":304,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":390,"left":32,"right":374,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1440,"left":1071.65625,"right":1423.65625,"overflow":0}
PERFORMANCE_GLOSSARY_RESIZE {"theme":"dark","width":1920,"left":1357,"right":1709,"overflow":0}
  ✓   7 e2e/performance.spec.ts:255:5 › an open glossary definition stays inside every viewport after resizing in both themes (2.9s)
  ✓   3 e2e/audit-pages.spec.ts:47:5 › the sweep reaches every step every built stage declares, since a selector that returned half a rail would shrink it in silence (13.3s)
  ✓   9 e2e/audit-pages.spec.ts:62:5 › appends the reference index and every registered sheet, so a sheet added later cannot slip out of the sweep (63ms)
  ✓  10 e2e/audit-pages.spec.ts:74:5 › refuses to sweep a stage that is ready but renders no steps, since silence there is the failure TD-12 describes (656ms)
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"light","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-bottleneck","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"return-from-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"query","from":"completed-comparison","prompt":"A small inventory table uses a sequential scan. Its measured query and user outcome meet their targets. What does the scan imply?","results":[],"selected":0,"commitDisabled":true}
PERFORMANCE_DRILL_RESET {"theme":"dark","id":"bottleneck","from":"completed-comparison-via-query","prompt":"A controlled 20-item cart shows 21 inventory queries. Repeated round trips dominate server time. Which hypothesis is supported?","results":[],"selected":0,"commitDisabled":true}
  ✓   8 e2e/performance.spec.ts:308:5 › each performance judgment starts fresh after switching from completed drills in both themes (4.2s)
  ✓   2 e2e/audit.spec.ts:46:7 › no horizontal overflow at 320px, because a field manual must never scroll sideways (43.3s)
  ✓  11 e2e/audit.spec.ts:46:7 › no horizontal overflow at 768px, because a field manual must never scroll sideways (28.1s)
  ✓  12 e2e/audit.spec.ts:46:7 › no horizontal overflow at 1024px, because a field manual must never scroll sideways (29.7s)
  ✓  13 e2e/audit.spec.ts:46:7 › no horizontal overflow at 1440px, because a field manual must never scroll sideways (28.2s)
  ✓  14 e2e/audit.spec.ts:46:7 › no horizontal overflow at 2560px, because a field manual must never scroll sideways (28.1s)
  ✓  15 e2e/audit.spec.ts:65:5 › interactive elements are at least 44px tall below lg (1.2m)
  ✓  16 e2e/audit.spec.ts:158:7 › every text/background pair passes WCAG AA in light mode (1.2m)
  ✓  17 e2e/audit.spec.ts:158:7 › every text/background pair passes WCAG AA in dark mode (1.2m)
  ✓  18 e2e/audit.spec.ts:337:5 › the sweep observes every disclosure open at least once, since a sweep that quietly stops opening things is indistinguishable from a clean pass (1.2m)
  ✓  19 e2e/audit.spec.ts:401:5 › zero console errors across every page and step (27.0s)
  ✓  20 e2e/audit.spec.ts:426:5 › the interrogation still explains itself after a wrong answer, since the reasoning is the lesson and not the reward (832ms)
  ✓  21 e2e/audit.spec.ts:463:5 › the locking exercise explains itself after a wrong answer too, since its wrong answer is the one the step was built for (696ms)
  ✓  22 e2e/audit.spec.ts:494:5 › reset clears the uncommitted draft as well as the committed answers, since a group that presents itself as unanswered must not have boxes ticked (829ms)
  ✓  23 e2e/audit.spec.ts:546:5 › every listed step hash lands on the step it names, since a dead hash falls back and audits step one twice (9.7s)
  ✓  24 e2e/audit.spec.ts:599:5 › no step panel exceeds four screens, because a step that is a scroll is two steps (10.3s)

  Slow test file: e2e/audit.spec.ts (8.2m)
  Consider running tests from slow files in parallel. See: https://playwright.dev/docs/test-parallel
  24 passed (8.5m)

```

Exit: 0.

#### Fresh production build after generator repair

Command: `pnpm build` (scoped real-font network access). Generated 52 pages; no configuration or dependency change.

```text

> web@0.1.0 build /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> next build

▲ Next.js 16.2.10 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 2.5s
  Running TypeScript ...
  Finished TypeScript in 6.7s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/52) ...
  Generating static pages using 7 workers (13/52)
  Generating static pages using 7 workers (26/52)
  Generating static pages using 7 workers (39/52)
✓ Generating static pages using 7 workers (52/52) in 488ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /reference
├ ● /reference/[slug]
│ ├ /reference/architecture-patterns
│ ├ /reference/design-patterns
│ ├ /reference/api-design
│ └ [+24 more paths]
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ● /stages/[slug]
  ├ /stages/01-product-discovery
  ├ /stages/02-planning
  ├ /stages/03-architecture
  └ [+15 more paths]


○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)


```

Exit: 0.

#### Development-console audit

Command: `pnpm test:dev-console`. Separate fresh dev server on :3101 after the final production rebuild. React development validation passed 1/1 in 1.9 minutes, exit 0. The runner emitted inherited NO_COLOR/FORCE_COLOR warnings; these are Node server warnings, not React or browser-console failures. The controller requested an ephemeral env -u NO_COLOR retry to remove that runner noise, preserving both results. No configuration change.

```text

> web@0.1.0 test:dev-console /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> playwright test --config=playwright.dev.ts

[WebServer] (node:29286) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:29295) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:29358) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:29794) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)

Running 1 test using 1 worker

(node:30012) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:30079) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:30207) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:30884) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:31593) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:31690) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:31775) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:31778) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:31845) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32082) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32221) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32256) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32346) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32388) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32695) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:32792) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:33025) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:33540) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:33997) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:34847) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:36195) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:36521) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:36961) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:37034) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:37158) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:37622) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:37720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:37783) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:38244) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:38333) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:38480) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39288) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39363) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39448) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39452) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39515) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39598) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39686) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:39951) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40038) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40040) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40103) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40106) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40482) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40570) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40580) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40643) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40645) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40706) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:40793) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41170) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41171) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41453) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41613) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41694) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41757) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41759) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:41822) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
  ✓  1 e2e/dev-console.spec.ts:29:5 › @dev no React development warnings on any audited page, which the production audit cannot see at all (1.8m)

  1 passed (1.9m)

```

Exit: 0.

### Controller live matrix and visual inspection

The controller supplied the following final handoff after inspecting snippets, literal commands, footers and wide layouts. It follows verbatim. Paths below are relative to `.superpowers/sdd/2026-10-13-stage-09-reference/` in the preserved worktree; all screenshots, JSON, scripts and raw logs remain retained locally.

# Live verification · 2026-10-14

Production server localhost:3102 started from the fresh post-generator-fix 52-page build. Initial sandbox listen failed EPERM; scoped local-server escalation succeeded. Dedicated isolated Chromium contexts measured both themes. All 28 observations passed, including 378 distinct foreground/background/size/weight pairs (deduplicated within each observation). Normal-text minimum 5.2555:1; all source-link heights >=44px. Both theme console logs are empty. Internal snippet scroll retained pageX0 and page overflow0.

| Sheet | Theme | Width | Overflow px | AA pairs | Failures | Minimum source height |
| --- | --- | --- | --- | --- | --- | --- |
| caching | light | 320 | 0 | 14 | 0 | 44 |
| caching | light | 375 | 0 | 14 | 0 | 44 |
| caching | light | 768 | 0 | 14 | 0 | 44 |
| caching | light | 1024 | 0 | 14 | 0 | 44 |
| caching | light | 1440 | 0 | 14 | 0 | 44 |
| caching | light | 1920 | 0 | 14 | 0 | 44 |
| caching | light | 2560 | 0 | 14 | 0 | 44 |
| scaling | light | 320 | 0 | 13 | 0 | 44 |
| scaling | light | 375 | 0 | 13 | 0 | 44 |
| scaling | light | 768 | 0 | 13 | 0 | 44 |
| scaling | light | 1024 | 0 | 13 | 0 | 44 |
| scaling | light | 1440 | 0 | 13 | 0 | 44 |
| scaling | light | 1920 | 0 | 13 | 0 | 44 |
| scaling | light | 2560 | 0 | 13 | 0 | 44 |
| caching | dark | 320 | 0 | 14 | 0 | 44 |
| caching | dark | 375 | 0 | 14 | 0 | 44 |
| caching | dark | 768 | 0 | 14 | 0 | 44 |
| caching | dark | 1024 | 0 | 14 | 0 | 44 |
| caching | dark | 1440 | 0 | 14 | 0 | 44 |
| caching | dark | 1920 | 0 | 14 | 0 | 44 |
| caching | dark | 2560 | 0 | 14 | 0 | 44 |
| scaling | dark | 320 | 0 | 13 | 0 | 44 |
| scaling | dark | 375 | 0 | 13 | 0 | 44 |
| scaling | dark | 768 | 0 | 13 | 0 | 44 |
| scaling | dark | 1024 | 0 | 13 | 0 | 44 |
| scaling | dark | 1440 | 0 | 13 | 0 | 44 |
| scaling | dark | 1920 | 0 | 13 | 0 | 44 |
| scaling | dark | 2560 | 0 | 13 | 0 | 44 |

Source title/href ordering remains identical for every observation (7 caching,3 scaling); dimensions vary with responsive wrapping as expected. Reference index link clicks, direct loads, stage-tether clicks and sitemap entries passed in both themes.

Visual inspection: 320px infrastructure title wraps within page; read-only AWS command wraps legibly, including quoted caller ARN; caching snippet scrolls internally (255px container,595px content), literal full text verified from DOM; seven-credit caching footer and three-credit scaling footer remain readable in both themes. Full-page snapshots cover all 28 combinations; additional narrow viewport/footer images inspect the high-risk details. Wide caching2560dark/scaling1440light screenshots inspected for layout and readable prose measure. No defect found.

Methods: measure-live.cjs rasterizes computed colors onto composed ancestor backgrounds using browser canvas, resolving modern color syntax instead of skipping it. Measurements and source/nav/console details: live/measurements.json, live/navigation-*.json, live/console-*.json; screenshots live/*.png. Exact stdout/exit: controller-live.log/.exit.

Auxiliary audit-route-check attempted pnpm exec tsx and failed because tsx is not installed; no dependency added. Existing production e2e audit registry-discovery guard passed, and inspected audit-pages.ts derives /reference/caching and /reference/scaling from CHEATSHEETS. Thus no route is manually injected or omitted.

#### Controller matrix raw output

```text
{"slug":"caching","width":320,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":375,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":768,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":1024,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":1440,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":1920,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":2560,"theme":"light","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"scaling","width":320,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":375,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":768,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":1024,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":1440,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":1920,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":2560,"theme":"light","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"caching","width":320,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":375,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":768,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":1024,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":1440,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":1920,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"caching","width":2560,"theme":"dark","overflow":0,"pairs":14,"contrastFailures":0,"minSourceHeight":44,"snippets":1}
{"slug":"scaling","width":320,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":375,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":768,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":1024,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":1440,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":1920,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"slug":"scaling","width":2560,"theme":"dark","overflow":0,"pairs":13,"contrastFailures":0,"minSourceHeight":44,"snippets":0}
{"observations":28,"distinctPairs":378,"failures":[]}

```

Exit: 0.

### Controller execution rulings

The following ledger rulings are retained verbatim to preserve their evidence and cost-if-wrong boundaries.

> Ruling: Task 4 implementation and records commits precede the final whole-branch review — that review requires the complete committed branch diff, while test/live/cold-lookup verification still precedes the implementation commit — cost if wrong: review-triggered follow-up commits instead of one initial commit.

> Ruling: Fix empty snippet-line indentation in the Markdown generator test-first, and remove trailing whitespace only from displayed report excerpts while retaining exact raw logs — diff --check reproduced one spaces-only generated line from the generator's unconditional two-space prefix, plus terminal progress padding in the report; the spec requires generated evidence and a clean diff — cost if wrong: changed blank-line formatting in Markdown, or needing the preserved raw logs for byte-exact terminal comparison.

> Ruling: Retain the production UI audit already in progress, rerun generator/unit checks and rebuild after the Markdown-only fix, then run development and manual checks against that rebuilt app — a focused import search confirms renderCheatsheets is consumed only by Markdown generation/tests, with no app runtime import; authored UI data and shared DOM renderer are unchanged — cost if wrong: missing an undocumented runtime dependency would require repeating the production audit.


### Task 4 humanizer pass and scope

Reviewed the newly authored report and handoff prose with humanizer:humanizer. The final copy names actual counts, command exits, dates and pending reviews. Raw terminal output, earlier historical prose, controller/reader handoffs and brief-prescribed source/hub text are retained. Provider and image-ownership caveats remain explicit because removing them would change the approved requirements.

Deferred: diagrams/image republication; runtime cache/ALB/backend configuration; Stage 09 chapter/port edits; W-6.4; five language sheets; actual order benchmarks; shared-drill/storage repairs; merge, push and production promotion. The narrow generator repair above is the only added production scope, authorized by the controller's evidence-backed ruling. Tasks 1–3 are independently review clean; Task 4 and final whole-branch review remain pending. This report does not claim merge readiness.

#### Clean development-console runner retry

Command: `env -u NO_COLOR pnpm test:dev-console`. A new :3101 dev server; 1/1 passed in 1.7 minutes, with no inherited Node color warnings and no React development warnings. The ephemeral setting changes only the runner environment.

```text

> web@0.1.0 test:dev-console /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web
> playwright test --config=playwright.dev.ts


Running 1 test using 1 worker

  ✓  1 e2e/dev-console.spec.ts:29:5 › @dev no React development warnings on any audited page, which the production audit cannot see at all (1.6m)

  1 passed (1.7m)

```

Exit: 0.

### Task 4 raw-log integrity

Exact logs are retained under `.superpowers/sdd/2026-10-13-stage-09-reference/` in the worktree. The terminal fences above remove trailing padding only. SHA-256 hashes of the untouched logs:

| Raw log | SHA-256 |
|---|---|
| `controller-live.log` | `dc0451ce526f13efc34cdc4cc42d73818e11ff53aa8f17fd960aac8cd5e26b36` |
| `task4-blank-line-green.log` | `d26b88f821f7c219f666d442dddfd3e2e909c2d5cefde4b458300f8f2dd73664` |
| `task4-blank-line-red.log` | `cd3de5ae7e2bc54eb6f489c2e3dbc56d638b8c8323232336135511f7eebb6b55` |
| `task4-blank-line-restored.log` | `593bc957925bd57189031a668b6fa9894cf9d9925d0e1f3d399b99562c6f1dfd` |
| `task4-blank-line-teeth.log` | `25f6771c0c5a9313c5e01494fd4f28768c582e63163dbad14df71bd2b5139563` |
| `task4-build-network.log` | `dc4b6d43f517f68d624fa9a012e8a5cbbdb3b32e6cb84f60df42ba8e9a57b442` |
| `task4-build.log` | `eab1a656e2bb3ea34ad334f384d15bb4fcbe38e3c67272bc0bb42942cfaaee7e` |
| `task4-dev-console-clean.log` | `f42202df0c276cf83bf08ab89561054c1781321d729a3fff00c522cbd1396517` |
| `task4-dev-console.log` | `3eeb3f09f7346990edbe9c51228286deb51ef998b6f4b2e8094e2347b1425182` |
| `task4-e2e.log` | `6d98ecad227fa92972b78706f86485141711046624c3a2fd66a080a29f6ed95e` |
| `task4-final-build.log` | `1847f16af255dbf88c37057c367cc45a04cec1050273956d6c711a1e7a96e767` |
| `task4-final-focused.log` | `9681ade704b46440cc8b89bef317726a25cef18c54046df2dcb9d3cb57ce7986` |
| `task4-final-format.log` | `cedae0229f110824fcf39f6747b6625b27b937427e4429027e6d1358718008cb` |
| `task4-final-lint.log` | `fdcf227c3ff9d699d40026dfaca8e48e862438b776630e0f9a8af9766d2ebbb3` |
| `task4-final-test.log` | `e21206340f19c5a2a6eca9e81117a687a38f4881cf6bfcfaa1b7470458389496` |
| `task4-final-typecheck.log` | `abea0a4a3c61878df1dd9d35c76c87a17a15953fc1988b379cdc7ba004beeeb8` |
| `task4-format.log` | `cedae0229f110824fcf39f6747b6625b27b937427e4429027e6d1358718008cb` |
| `task4-gen-cheatsheets.log` | `9a407761127969f348e8f7ed321dd1e7cb1cb22f1857cb5776e476794461e910` |
| `task4-gen-highlighted.log` | `91607f8d264d078078f10095a14ec28ddcac9e84af58ca09b3e6364ae0c5de9d` |
| `task4-generated-green.log` | `2c65ae5e926af036c1a5341eedc4201a2392cc87169fb9323e5b7cc2e43b35e4` |
| `task4-integration-green.log` | `d2f7f39b5a8d86ef616c506346eaa8f29e1545ed9ee0360688441ce6b9d572c7` |
| `task4-integration-red.log` | `81d4d46bbe945989fd633aafa0344f9284d5b27afdb5a13c63a7e3e3adc9f407` |
| `task4-lint.log` | `fdcf227c3ff9d699d40026dfaca8e48e862438b776630e0f9a8af9766d2ebbb3` |
| `task4-records-tests.log` | `9f1b76338b929bcf1ca613065a64c0daddeaa971feccff63bc4809dab10ecc99` |
| `task4-regen-markdown.log` | `6152c7b480d7acab9e8e4c8819905d6f04d419c736b659bab4574655a5b83a83` |
| `task4-restored-green.log` | `42e219a6927db9a639890ac062ed96505375d4f7eebb04b08fccb25c8e344059` |
| `task4-stale-generated-red.log` | `d828edb94dd1a4925797eecdbae918f32c708a02a2711b20eebaa9ee2220026c` |
| `task4-test.log` | `ec2f511e85a061b76a8aaf90651f9199fa3be1c2d5bd957955dd565f437a0102` |
| `task4-tether-teeth.log` | `dde4c85a04b243887bb4819abe6f288fd9ff306456983b76b4cbaf889fc55791` |
| `task4-typecheck.log` | `abea0a4a3c61878df1dd9d35c76c87a17a15953fc1988b379cdc7ba004beeeb8` |

### Pre-commit refs and records checks

- HEAD: `e2aa15fbb2577e4f9d5cbef87decb214267bbe08`.
- develop: `597fe0bb4e748e62c380fcd5f16a3e5dd20cd671`.
- main: `d659d32f0c81254e65903be73b88daa726f76c8a`.
- origin/develop: `377c734a99012e6fc75731e3af3177563b233fe4`.

No fresh fetch was performed. Highest decision row across local branch trackers was D-97; this records handoff adds D-98 for the approved supporting-citation contract. The tracker ledger guards passed 2/2. Five added local link destinations resolved, and tracked reference file kinds remain expected. Stage 09 registry/drawn/placeholder counts are guarded by the passing integration suite. Integration checkboxes remain pending. Task 4 and final whole-branch reviews are pending; not merged, not pushed, not deployed. The next commit contains implementation/generated/source evidence; task/tracker/KICKOFF and hub-spec follow-up remain a separate records commit.

Final pre-commit command: `git diff --check`.

```text

```

Exit: 0. Raw `task4-precommit-diff.log` SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### Task 4 commit and records handoff

Application/generated/source evidence committed as `fa9bb402bcfe2ac9623141a018063ddb767c9d42` (`feat(reference): register stage 09 lookup companions`), with the required Codex co-author trailer. Lefthook's staged format and lint checks passed without modifying staged source. The separate records update carries task/tracker/KICKOFF, D-98 and the dated reference-hub supporting-citation follow-up, while preserving historical decisions.

Task 4 and final independent whole-branch reviews remain pending. Branch count is 22/27, develop 20/25, W-3 15/18. Develop/main/remote refs are unchanged from the pre-commit snapshot above. No merge, push or deployment has occurred. Integration checkboxes remain pending.

Final records-only guard: `pnpm exec vitest run src/lib/tracker-ledger.test.ts`.

```text

 RUN  v4.1.10 /Users/angelito/personal/Development-Playbook/.worktrees/stage-09-reference/web


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  08:22:39
   Duration  120ms (transform 16ms, setup 0ms, import 23ms, tests 4ms, environment 0ms)


```

Exit: 0. Exact raw-log SHA-256: `7087268e95bff8859a397aa3398a4f6efc1309df43ccf6ab236fd731353118cb`.

## Task 4 independent review

### Spec Compliance

- ✅ **Spec compliant.** Task 4 matches the brief and the controller-authorized refinements. No missing requirement, unapproved feature or blocking finding was identified in `e2aa15f..f1de391`.
- **Registration and retention:** `web/src/lib/cheatsheets/index.ts:3` adds the two imports and `index.ts:59` adds both values before the unchanged `...PLANNED`. The package removes no old registry value. `index.test.ts:105` retains every old drawn slug and adds only caching/scaling. `stage09-reference.test.ts:6` independently pins both Stage 09 companions, drawn status, 22/27 counts and the exact five language placeholders.
- **Real registered rendering:** `web/src/components/Stage09Reference.test.tsx:6` renders both sheets obtained from the registry, checks headings and the Sources footer, excludes the placeholder and checks the actual Stage 09 link destination at line 22. These are DOM assertions against the real renderer, not a mocked rendering outcome.
- **Genuine integration RED/GREEN:** `docs/superpowers/reports/2026-10-13-stage-09-reference.md:2882` records four failures: Stage 09 returns `[]`, Markdown lacks Caching, and both DOM cases receive undefined registry data. These fail for the expected missing-registration reason. Line 4017 records 4/4 GREEN. The separately disclosed helper-path failure ran no test and is correctly excluded from RED evidence at line 2880.
- **Generated artifacts and snapshot RED:** report line 4036 records both real stale-file mismatches, including 20/25 changing to 22/27 and the new highlight entry. Lines 4279/4303 record the repository generators; line 4327 records 29/29 focused GREEN. `reference/cheatsheets.md:9`, `:191`, `:275` add counts and both complete companions. `web/src/lib/cheatsheets/highlighted.generated.ts:19` adds the generated public-description snippet; no old highlight entry is removed. `stage09-reference.test.ts:21` checks caveats and every source returned by the shared helper.
- **Isolated registration teeth:** report line 4346 records the full two-test integration file with exactly the companion/tether test failing after scaling is moved to Stage 03; generated-Markdown content still passes. Line 4391 records restored 29/29 GREEN. The report explicitly excludes regeneration under the mutation at line 2878.
- **All-source ledger and factual limits:** `reference/cheatsheet-sources.md:474` maps all seven caching and three scaling references, distinguishes provider facts from playbook application discipline, and discloses illustrative commands/no measured infrastructure. `reference/stage-09-performance-sources.md:86` appends a follow-up while retaining the chapter audit. Generated Markdown retains caller scope/expiry versus stale serving at `reference/cheatsheets.md:237`, Cloudflare/application-cache distinctions at `:243`, ALB compatibility at `:294`, all-unhealthy fail-open at `:303`, and measurement/correctness limits at `:310`. Source recheck is dated **2026-10-14** at report line 4410, with the approved design/plan date preserved separately.
- **Authorized Markdown repair:** `web/src/lib/cheatsheets/render.ts:44` conditionally indents nonempty snippet lines only. The real fixture regression at `render-citations.test.ts:67` checks both an empty line and preserved nonempty indentation. Report lines 4662/4707/4726/4771 show expected RED, GREEN, isolated teeth (1 failed/3 passed), then restored GREEN; lines 4790/4814 show regeneration and 33/33 affected guards. The exposed behavior is correctly labelled PRE-EXISTING GENERATOR / PLAN-AUTHORED missed condition at line 4654. This is a narrow, justified refinement, not unrelated scope.
- **Full gate and build modes:** report lines 4838/4854/4868/4884 record final format/lint/typegen+tsc/full tests with exit 0, including **1494/1494 across 207 files**. Line 5036 records the fresh post-repair **52-page build**. The unsuccessful sandbox font fetch is retained at line 4552 and the real-font retry at line 4605. Production audit line 4907 records **24/24 on :3100**; development evidence at lines 5085/5330 records **1/1 on :3101**, including a clean environment retry. No deployed-site smoke run is claimed as a working-tree check.
- **Retained production audit boundary:** report line 4833 and the ledger ruling describe the unchanged DOM/data surface across the Markdown-only repair. My focused consumer search corroborated that `renderCheatsheets` is consumed only by the three Markdown test/generation files, with no application runtime import. `web/e2e/audit-pages.ts:107` appends URLs directly from `CHEATSHEETS`; the captured production discovery guard passes. Retaining this production run while rebuilding and running fresh dev/manual checks is technically justified. The failed auxiliary tsx command is disclosed, not counted as passing verification (report line 5274).
- **Actual UI measurements and navigation:** report line 5229 retains the controller handoff and the full 28-row matrix. I checked `live/measurements.json`: both sheets × both themes × all seven required widths, **378 pair measurements**, minimum ratio **5.255518433120439**, zero contrast failures/page overflow/code-scroll page escape, seven/three source credits and all source heights ≥44px. `measure-live.cjs:14` composes computed colors through ancestor backgrounds using canvas, rather than skipping modern color syntax. Retained `live/navigation-light.json` / `navigation-dark.json` confirm reference-index clicks, both tethers and sitemap entries; both retained console files are empty. Controller visual inspection at report line 5268 explicitly covers literals, internal snippet scroll, narrow footers and wide layouts; this is fresh production :3102 evidence after the repair.
- **Blind lookup:** report line 4422 retains the fresh reader's four answers with section, caller/compatibility/freshness/health caveats and 4 passes/0 misses. The supplied `cold-reader-brief.md:3` restricts the reader to the extracted sheet text and prohibits plan/spec/source/report inspection. I verified the reader and controller reports are copied verbatim into the implementer report. The answers agree with the generated content.
- **Truthful separate records:** `docs/task.md:543`, `docs/tracker.md:7`, `KICKOFF.md:3` distinguish branch 22/27 from develop 20/25, preserve W-3 15/18, and leave Task 4/final reviews and integration pending. Compound checkboxes remain open until all named work completes. `docs/tracker.md:142` adds D-98 without rewriting the prior decisions. `docs/superpowers/specs/2026-08-14-reference-hub-design.md:173` appends the dated supporting-citation contract. The report's handoff at line 5404 names deferrals and avoids predicting a merge SHA or deployment.
- **Commit/process boundary resolved by controller evidence:** `branch-state.json` captures HEAD `f1de391`, develop/merge-base `597fe0b`, unchanged main `d659d32`, 14 commits off develop, clean tracked status, whitespace-check exit 0 and the exact required trailers. The controller additionally checked per-commit file partitions: `fa9bb40` carries application/generated/source/report files; `f1de391` carries task/tracker/KICKOFF/hub-spec and 23 report handoff lines. No app/generated file entered the records commit and no task/tracker/KICKOFF/hub-spec entered the application commit.

### Strengths

- The integration tests cover independent failure directions: registry/count/placeholder invariants, actual DOM tether rendering, generated content and generated-file sync. The full-file mutation evidence shows the Stage 09 guard has teeth without relying on a test-name filter (`stage09-reference.test.ts:6`; report line 4346).
- The extra generator fix has a small implementation surface, a meaningful fixture assertion and isolated failure evidence. It keeps TypeScript as the content source and repairs generated whitespace without altering teaching content (`render.ts:44`, `render-citations.test.ts:67`).
- Evidence boundaries are unusually clear: environmental build failure versus successful real build, production versus React development validation, documentation research versus actual application measurements, and implementation versus integration (report lines 4410, 4552, 4833, 5229, 5404).
- I checked all **30** recorded raw-log SHA-256 rows against retained files; every hash matched (report line 5350). Declared trailing-padding normalization preserves exact local raw provenance. Earlier Tasks 1–3 RED/GREEN/teeth sections remain present at report lines 61/483/889/903/1030, 1226/1281/1300/1343 and 2080/2133/2150/2191. The large expected/received Markdown dumps are captured test evidence, not additional authored production content.

### Issues

#### Critical (Must Fix)

- None.

#### Important (Should Fix)

- None.

#### Minor (Nice to Have)

- **M1 — PRE-EXISTING ENVIRONMENT, not introduced production code:** `docs/superpowers/reports/2026-10-13-stage-09-reference.md:4909` and `:5087` retain repeated Node `NO_COLOR`/`FORCE_COLOR` warnings. The original browser runner output is noisy even though browser/React assertions pass. Keep using the ephemeral `env -u NO_COLOR` setup for future browser captures; the clean development retry at line 5330 already demonstrates the remedy. This does not invalidate the retained production audit or justify another unchanged-code suite run.

### Verification Boundaries

- ⚠️ **Final independent whole-branch review is still due**, as required by the brief and openly recorded at report line 5408. This task review does not re-review unchanged Task 1–3 implementation or certify merge readiness; the final reviewer must inspect the complete branch, including the shared citation/image contract and actual authored data modules.
- ⚠️ Captured logs and controller/reader artifacts substantiate the historical runs; the final diff cannot independently reconstruct the exact edit order, reader cognition, source-opening history or every screenshot inspection. I corroborated raw integrity, retained measurement/navigation data, blind-input restrictions and current primary factual caveats. I did not rerun tests or independently repeat all 28 visual inspections.
- **Focused checks performed:** runtime-consumer search and unchanged audit-page derivation for the retained-production risk; raw hash checks for normalized-evidence provenance; retained measurement script/JSON/navigation/console inspection for authentic UI evidence; blind brief and verbatim-report checks for lookup provenance. No broader codebase crawl or Git command was run, and no source/index/ref mutation occurred.
- **Primary factual corroboration, 2026-10-14:** the generated invalidation rows agree with [Next.js updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) and [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag); status distinctions agree with [Cloudflare cache responses](https://developers.cloudflare.com/cache/concepts/cache-responses/); algorithm incompatibilities and all-unhealthy routing agree with [AWS ALB attributes](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html) and [health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html). These corroborate current facts, not a forensic reconstruction of the implementer's earlier browsing.
- **Review read boundary:** production/test/generated/records hunks were evaluated from the supplied package. Bounded output truncated some large raw dumps and generated-highlight display; report evidence was recovered through the supplied report and structured artifact checks. No changed source file was separately read; no mid-function source-read exception was needed. The focused symbol search inspected consumer references only. Only this requested review artifact was written.

### Assessment

**Task quality: Approved.** Review clean with one nonblocking environmental-output finding. The implementation is small and cohesive, the regression tests assert observable behavior, and the captured failures/passes/mutations substantiate both registration and the authorized generator repair.

**Branch state:** HEAD `f1de391`; 14 commits off develop; recorded 1494/1494 across 207 files, build 52 pages, production audit 24/24, clean development audit 1/1; controller-verified tracked tree and whitespace check clean. Final whole-branch review pending. NOT merged, NOT pushed, NOT deployed.

Controller completion: both verdicts affirmative, no blocking finding. M1 is PRE-EXISTING ENVIRONMENT color-variable noise in retained Node runner output; final whole-branch reviewer will triage it. Clean dev retry has no such noise; browser/React checks and source measurements pass. Git partitions, ancestry, required trailers and clean whole-branch diff checked by controller. Historical write/reader/visual/source process limitations are stated honestly alongside retained raw hashes and artifacts. Final independent whole-branch review is the next gate, not a missing Task 4 implementation step. Current handoff records are being refreshed after this review; no merge, push or deployment.
