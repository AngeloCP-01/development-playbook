/**
 * Source: `docs/06-testing.md`, "### AI in testing".
 *
 * Titles are the doc's bold bullet leads verbatim, and `ai-plays.test.ts`
 * counts the doc's own bullets rather than trusting a number written into a
 * plan.
 *
 * `kind` is the mechanism the doc names in parentheses after each title.
 *
 * `AI_PREMISE` is the doc's opening paragraph, all three sentences, verbatim.
 * A first pass here kept only the warning ("the output is green either way")
 * and the closing question ("has this test ever been red"), dropping the
 * middle sentence as "just a restatement." It is not: that sentence's first
 * clause restates the warning, but its second clause — "a suite grown that
 * way gets larger without anyone's confidence growing with it" — is a
 * distinct claim about compounding harm across a whole suite over time, not
 * about one test. It is also the antecedent of the section's closing line
 * ("assuming it happened is how a suite becomes ballast"), which
 * `ai-plays.test.ts` pins separately — cut the middle sentence and that
 * closing line loses the premise it depends on. Carry the whole paragraph.
 */
export const AI_PREMISE =
  'Generating tests is the most tempting thing to hand over on this page and the most dangerous, for one reason: the output is green either way. A test that cannot fail looks exactly like a test that passes, and a suite grown that way gets larger without anyone\'s confidence growing with it. The question to keep asking is not "did it write a test" but "has this test ever been red".'

/**
 * The doc's closing paragraph for this section — verbatim, all three
 * sentences. `AI_PREMISE` names the failure mode; this names the one move
 * that catches it, and the panel had never carried it (Task 14's coverage
 * walk, finding 5). Mirrors `AI_LIMIT` in stage 04 and 05's `ai-plays.ts`:
 * same name, same "the one thing generation does not replace" job, a
 * different specific claim.
 */
export const AI_LIMIT =
  'What none of this replaces: watching the test fail. A generated test that has never been red is a decoration, and the teeth check above is the only thing that tells the two apart. Asking for the failing run is cheap; assuming it happened is how a suite becomes ballast.'

export type Play = {
  id: string
  title: string
  kind: 'skill' | 'command' | 'mcp' | 'memory'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'edge-cases',
    title: 'Enumerate the edge cases for a function you describe',
    kind: 'command',
    body: 'Empty, zero, negative, very large, null, duplicates — producing the list is a different job from producing the assertions, and it is the half that gets skipped when you are tired.',
  },
  {
    id: 'bug-to-test',
    title: 'Turn a bug report into a failing test before anything is fixed',
    kind: 'skill',
    body: '`test-driven-development` enforces the order, and a bug report is already a description of behaviour, which is the input that method wants.',
  },
  {
    id: 'seed-helpers',
    title: 'Write the seeding and reset helpers',
    kind: 'command',
    body: '`src/test/helpers.ts` is mechanical once the schema exists, and mechanical translation is where models are reliable.',
  },
  {
    id: 'qa-to-spec',
    title: 'Turn a manual QA script into a Playwright spec',
    kind: 'command',
    body: 'Ask for role and accessible-name selectors explicitly; left alone, a model will reach for the CSS class it can see in the markup.',
  },
  {
    id: 'installed-version',
    title: 'Check a testing API against the version actually installed',
    kind: 'mcp',
    body: "This repository installs neither `@testing-library/jest-dom` nor `@testing-library/user-event`, and a model writing from memory reaches for `toBeInTheDocument` by default — about twenty tests in one stage's plan here were written that way and would have failed on `Invalid Chai property` rather than on anything real. `context7` reads the installed version instead of guessing.",
  },
  {
    id: 'what-flaked',
    title: 'Check what flaked before',
    kind: 'memory',
    body: '`claude-mem` answers "have I seen this test go red intermittently, and what was it", which is the question a retry-rate dashboard answers on a team and nothing answers alone.',
  },
]
