/**
 * Source: `docs/05-development.md`, "### AI in development".
 *
 * Titles are the doc's bold bullet leads verbatim, and `ai-plays.test.ts`
 * counts the doc's own bullets rather than trusting a number written into a
 * plan.
 *
 * `kind` is the mechanism the doc names in parentheses after each title — two
 * of the six are saved commands, which is why the count and the kind tally
 * are different questions.
 */

/**
 * The section's opening paragraph — why the panel exists and why setup speed
 * makes it risky. Lifted verbatim, both sentences: a first pass paraphrased
 * this into `AIPlays.tsx` directly and silently dropped the second sentence,
 * the concrete list of things that fail silently (an authorization
 * predicate, a migration's backfill, a cache key, an unsampled regular
 * expression) — the half that makes the paragraph actionable rather than a
 * general warning. `ai-plays.test.ts` pins a phrase from that sentence
 * specifically so the same loss cannot recur unseen (F2).
 */
export const AI_PREMISE =
  "The loop here runs fast enough that reading a suggestion and accepting it take about the same half second, and that speed is what makes this the risky stage: the mistakes that survive are the ones that read as correct on the way past. An authorization predicate, a migration's backfill, a cache key, a regular expression over data you have not sampled — none of those fail loudly. They fail the day someone finds the gap."

export type Play = {
  id: string
  title: string
  kind: 'skill' | 'command' | 'memory' | 'mcp'
  body: string
}

export const PLAYS: Play[] = [
  {
    id: 'test-first',
    title:
      'Write the failing test from a description of the behaviour, before any code',
    kind: 'skill',
    body: '`test-driven-development` enforces the order rather than hoping for it — no implementation until a test exists and has failed for the right reason.',
  },
  {
    id: 'schema-from-payload',
    title: 'Fill in a Zod schema from a sample payload',
    kind: 'command',
    body: 'The boundary types on this page are a mechanical translation once the payload is in front of you, which is exactly the kind of task a model does not get subtly wrong.',
  },
  {
    id: 'translate-query',
    title: 'Translate a query you can already describe in words',
    kind: 'command',
    body: 'Invoices where the owner is me and the amount is over five hundred dollars, into the where clause, is fast when you already know the answer and are only saving typing.',
  },
  {
    id: 'check-installed-version',
    title: 'Check a framework prop against the version actually installed',
    kind: 'mcp',
    body: "This page's own error.tsx takes unstable_retry in this Next version, and it is not a rename of the reset an older training set remembers — reset still exists, it just clears state without re-fetching, so a copy that keeps calling it compiles but does not recover. `context7` reads the installed version's docs instead of guessing from memory.",
  },
  {
    id: 'check-prior-break',
    title: 'Check what broke last time',
    kind: 'memory',
    body: '`claude-mem` answers "did I already hit this, and how did I actually fix it" — most useful exactly when a stack trace looks familiar.',
  },
  {
    id: 'reduce-and-test',
    title:
      'Reduce a bug to the smallest reproduction, then test one hypothesis at a time',
    kind: 'skill',
    body: '`systematic-debugging`, already named on this page, is what keeps either of you from mutating code at random until something works.',
  },
]

/**
 * The section's closing point, and the reason this panel is not a list of
 * wins. Kept as the doc words it: a green test only proves the case you
 * remembered to write, and the authorization gap this stage already covers
 * is exactly the kind of miss a model has no more reason than you did to
 * notice.
 *
 * Stage 04's `ai-plays.ts` exports the same shape (`AI_LIMIT`). This one was
 * missing from the original Task 10 brief and was hand-authored inline in
 * `AIPlays.tsx` for one commit; a review caught the gap and this is that fix.
 */
export const AI_LIMIT =
  'What none of this replaces: reading the diff before you keep it. A green test only proves the case you remembered to write. The authorization gap already covered on this page passes every test that never scopes a query by owner, and a model has no more reason than you did to notice the one that is missing.'
