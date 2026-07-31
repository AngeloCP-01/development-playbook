/**
 * Source: docs/03-architecture.md, "Evolve the schema safely".
 *
 * The section the stage was missing entirely. Its argument: this is not about
 * getting the schema right first time, it is that knowing the technique turns
 * an expensive change into a tedious one.
 *
 * `BACKFILL_SQL` is held to the doc character for character by a test, because
 * that statement was wrong twice and both defects were found by running it
 * rather than by reading it (D-50).
 */

export type ExpandContractStep = {
  n: number
  title: string
  what: string
  /** What goes wrong if this step is skipped. */
  ifSkipped: string
  /** Marks the steps a solo developer skips because nothing visibly breaks. */
  commonlySkipped?: boolean
}

export const EXPAND_CONTRACT_STEPS: ExpandContractStep[] = [
  {
    n: 1,
    title: 'Expand',
    what: 'Add the new column, nullable. Nothing reads it yet.',
    ifSkipped:
      'There is nowhere for the next step to write. This is also the step that costs least: adding a nullable column is one of the operations that is instant rather than a table scan under a lock, which is not true of every change you might make here.',
  },
  {
    n: 2,
    title: 'Write',
    what: 'Write both the old and the new. Deploy. Every new row is now correct.',
    ifSkipped:
      'The new column is never populated for anything happening right now, so the backfill fills history and then falls behind live traffic. This is one of the two steps that looks redundant: it exists because a deploy is a rollover, and until it finishes there are instances still writing only the old column.',
    commonlySkipped: true,
  },
  {
    n: 3,
    title: 'Backfill',
    what: 'Fill the old rows, in batches, skipping any the new code already wrote.',
    ifSkipped:
      'Every row that existed before step 2 keeps a null in the new column, so the switch in step 4 makes those users look like they have no name at all.',
  },
  {
    n: 4,
    title: 'Move',
    what: 'Switch reads to the new column. Deploy. Watch it.',
    ifSkipped:
      'Nothing reads what you have been maintaining, so the work has bought nothing yet — and the longer both columns are live, the more chances there are for them to disagree.',
  },
  {
    n: 5,
    title: 'Stop',
    what: 'Stop writing the old one. Deploy.',
    ifSkipped:
      'You reach step 6 with code still writing a column you are about to drop. This is the other step that looks redundant, and for the mirror-image reason: during step 4’s rollover there are still instances reading the old column, which is why writing to it stops in a later deploy rather than the same one.',
    commonlySkipped: true,
  },
  {
    n: 6,
    title: 'Contract',
    what: 'Drop it.',
    ifSkipped:
      'Nothing breaks, which is why this one does get left — and why it is not one of the two. You keep a column that nothing reads and nothing writes, and the next person to read the schema cannot tell it from one that matters. That is a tidiness cost rather than an outage, which is the whole difference between this step and 2 and 5.',
  },
]

/**
 * The doc's opening move, and the reason the section is not hypocritical: this
 * stage spends a whole section refusing imagined scale, so the technique that
 * protects against traffic has to say when it is not needed.
 */
export const PRE_LAUNCH_EXEMPTION =
  'If nobody is using the system yet — pre-launch, four test users, one instance — renaming a column is one statement. Write the migration, run it, move on. Everything below is protection against traffic, and you cannot lose data that nobody has entered. Adopt it the day you have users whose data you would be sorry to lose, which is a real threshold and usually arrives before people notice.'

/** Verbatim from the doc. Held character-for-character by evolve.test.ts. */
export const BACKFILL_SQL = `-- Repeat until it reports zero rows. Safe to re-run at any point.
UPDATE users
   SET first_name = split_part(name, ' ', 1),
       last_name  = CASE WHEN strpos(name, ' ') = 0 THEN NULL
                         ELSE substr(name, strpos(name, ' ') + 1) END
 WHERE id IN (
   SELECT id FROM users
    WHERE first_name IS NULL          -- never overwrite what step 2 wrote
      AND name IS NOT NULL            -- or the loop never reaches zero rows
    LIMIT 1000                        -- one batch
 );`

export type EvolutionNote = {
  id: string
  title: string
  summary: string
  body: string
}

/**
 * The four things the six-step list does not carry on its own. Behind an
 * expand-to-reveal in the panel: each is a paragraph, and a reader who already
 * knows what a rolling deploy is should not have to scroll past one.
 */
export const EVOLUTION_NOTES: EvolutionNote[] = [
  {
    id: 'rollover',
    title: 'A deploy is a rollover, not a moment',
    summary: 'Which is the entire reason steps 2 and 5 exist.',
    body: 'For a while the old code and the new code are both serving traffic. During step 2’s rollover, instances that have not updated yet are still writing only the old column, so the new one cannot be trusted until the rollover finishes. During step 4’s, instances still reading the old column need it to still be correct, which is why you stop writing it in a later deploy rather than the same one. A reader who takes “Deploy.” as atomic will follow all six steps without knowing why, and will skip 2 and 5 on the next change.',
  },
  {
    id: 'backfill-guards',
    title: 'Both guards in the backfill are load-bearing',
    summary:
      'The naive version is broken, and neither failure announces itself.',
    body: 'Without "name IS NOT NULL", a row with a null name matches the guard forever — split_part(NULL, …) is null, so first_name stays null, the row re-matches, and the statement keeps reporting one row updated. “Repeat until zero” never terminates. Without the CASE, a mononym breaks: strpos returns 0 for a name with no space, substr(name, 1) returns the whole string, and every single-word name ends up with last_name equal to first_name. The lesson rather than the footnote: the data you are migrating contains cases your splitting rule was not written for. Run the SELECT half first and look at what comes back. The batch size is a judgement rather than a constant — large enough to finish, small enough that one statement is not holding rows for long; a thousand is a reasonable place to start, and the number only matters on tables big enough that you would notice. An unguarded backfill does not error when re-run — it reverts corrections, which is the worst class of migration bug: silent, plausible, and invisible until somebody notices their edit did not stick.',
  },
  {
    id: 'alter-lock',
    title: 'Some ALTER TABLE statements are an outage',
    summary: 'Adding a nullable column is instant. A bare SET NOT NULL is not.',
    body: 'Some ALTER TABLE statements take a lock that blocks reads and writes for as long as they run, and on a large table that is an outage rather than a migration. A bare SET NOT NULL scans the whole table under that lock. The safe route is a NOT VALID check constraint, then VALIDATE CONSTRAINT, which does not block writes, then SET NOT NULL. Check your database’s documentation for which operations are instant before running one against a table with rows in it: the answer changes between versions, and it is the difference between a deploy and an incident.',
  },
  {
    id: 'same-shape',
    title: 'The same shape covers more than renames',
    summary:
      'And it stops at the point where this becomes another stage’s job.',
    body: 'Splitting one column into two, tightening a nullable column to NOT NULL, changing a type, extracting a table: all of them are expand, migrate, contract, with reads moving in the middle. Where it stops being this stage’s job is worth being exact about, because the two halves have different rules — deciding the shape of a safe change is architecture and belongs here; running it, where migrations live, how they are ordered against a deploy, and what happens when one fails halfway, belongs to 13 — Production Deployment. The same split this stage already uses for authentication and for contracts.',
  },
  {
    id: 'strangler-fig',
    title: 'Strangler fig, for the other kind of evolution',
    summary: 'What makes “split it out later” a plan rather than a hope.',
    body: 'The stage told you to split something out only when a concrete trigger fires, which is only credible advice if splitting later is actually possible. This is how: put something in front of the existing code, route one path at a time to the replacement, run both until nothing reaches the old one, then delete it. The system is never rewritten and never off. Naming it matters because the alternative people reach for is a rewrite that has to reach feature parity before anyone can use it, and that project has a well-documented ending.',
  },
]
