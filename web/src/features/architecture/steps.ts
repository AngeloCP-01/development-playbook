/**
 * The rail order for stage 03, in one place.
 *
 * `Architecture.tsx` holds the panels; this holds the ids, because something
 * else resolves against them — `TRACE_ROWS[].stepId`, which renders as a link
 * in `TraceForward`. It used to compare against a copy of this list, which is
 * why a copy stopped being acceptable when D-52 made splitting steps routine.
 *
 * This paragraph named a second consumer, the hand-written `PAGES` list in the
 * audit suite, until TD-12 deleted that list on 2026-08-14. The sweep now
 * derives from the rendered rail and imports nothing from here — corrected
 * during stage 04's port, where the same sentence had been copied forward.
 *
 * Note what this does and does not buy. It makes a step id that exists nowhere
 * a compile error, and it makes the audit and the trace agree on the set. It
 * cannot tell that a trace row pointing at `schema` should now point at a step
 * split out of it — that is intent, not a string — so the split tasks carry
 * re-pointing as an explicit step.
 */
export const STEP_IDS = [
  'reverse',
  'require',
  'trace',
  'model',
  'worksheet',
  'shape',
  'oneapp',
  'boundaries',
  'sketch',
  'flow',
  'resilience',
  'schema',
  'indexes',
  'tenancy',
  'concurrency',
  'races',
  'evolve',
  'contract',
  'access',
  'record',
  'ai',
  'traps',
] as const

export type StepId = (typeof STEP_IDS)[number]
