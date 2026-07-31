/**
 * The rail order for stage 03, in one place.
 *
 * `Architecture.tsx` holds the panels; this holds the ids, because two other
 * things resolve against them — `TRACE_ROWS[].stepId`, which renders as a link
 * in `TraceForward`, and the hand-written `PAGES` list in the audit suite.
 * Both used to compare against a copy of this list, which is why a copy stopped
 * being acceptable when D-52 made splitting steps routine.
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
  'model',
  'worksheet',
  'shape',
  'sketch',
  'schema',
  'contract',
  'record',
  'ai',
] as const

export type StepId = (typeof STEP_IDS)[number]
