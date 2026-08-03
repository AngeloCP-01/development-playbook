/**
 * Source: docs/03-architecture.md, "AI in architecture".
 *
 * Extracted from `AIArchitecturePlays.tsx` so the set can be checked without a
 * component harness, matching how `scoring.ts`, `styles.ts` and `sketch.ts`
 * already work in this feature.
 *
 * The count is the thing that goes stale here. The port carried seven plays and
 * five misleads; the doc has nine and six, one of which (ordering an
 * expand-contract sequence) only exists because the doc grew the section this
 * round ported as the `evolve` step. A test counts the doc's own bullets rather
 * than trusting either number.
 *
 * `youJudge` is optional. The doc names the judgment half for five of the nine
 * plays, and writing one for the other four would be authoring playbook content
 * under cover of porting it (D-51).
 */

export type AIEntry = {
  id: string
  claim: string
  body: string
  /** What the model does not do for you. Present where the doc says it. */
  youJudge?: string
}

export type AITool = { name: string; body: string }

export const AI_PLAYS: AIEntry[] = [
  {
    id: 'options',
    claim: 'Generate the option set, then throw most of it away',
    body: 'The expensive failure is choosing without knowing the alternatives existed. Over-generation is the one habit that helps here — ask for six ways to model this, then argue them down yourself.',
    youJudge:
      'Over-generation is the habit that helps; arguing them down is yours. The model has no stake in which one you keep.',
  },
  {
    id: 'reversibility',
    claim: 'Pressure-test a reversibility claim',
    body: '“This is cheap to undo” has a falsifiable answer, and the test is the one at the top of this stage. Hand it the decision and the test, and make it argue the expensive case. A model is good at enumerating consequences and bad at deciding they are acceptable.',
    youJudge:
      'It is good at enumerating consequences and bad at deciding they are acceptable. Make it argue the expensive case, then decide.',
  },
  {
    id: 'characteristics',
    claim: 'Argue down a characteristics list',
    body: 'Ask for the ten things this system could need to be, then make it defend cutting six. The generating half is where it helps. The cutting half is where you find out whether your three were actually chosen or merely listed.',
    youJudge:
      'The generating half is where it helps. The cutting half is where you find out whether your three were actually chosen or merely listed.',
  },
  {
    id: 'missing-box',
    claim: 'Find the box you left out of the sketch',
    body: 'Paste the container view and ask what a system like this usually talks to that is missing. It is good at this because it is pattern-matching against every similar system it has read, which is the one situation where that habit works for you rather than against you.',
  },
  {
    id: 'schema-index',
    claim: 'Read a schema for the index you need',
    body: 'Paste the DDL and the queries your screens actually make. Without the queries it will suggest indexes for imagined access patterns, which is worse than no suggestion at all, because an index you do not need still costs write time and disk.',
  },
  {
    id: 'failure-modes',
    claim: 'Enumerate the failure modes of a dependency',
    body: '“What are all the ways a payment provider call can fail?” is list generation, which is the shape of work it is reliably good at.',
    youJudge:
      'Which ones are worth handling. The list is cheap and the handling is not — and this stage has already said that for most calls the answer is a timeout and nothing else.',
  },
  {
    id: 'expand-contract-order',
    claim: 'Order an expand-contract sequence for a specific change',
    body: 'Give it the column and the current readers and have it produce the six steps.',
    youJudge:
      'Check the order yourself, because the step it tends to drop is the one that stops writing the old value — which is step 5, one of the two the sequence exercise is about.',
  },
  {
    id: 'schema-gaps',
    claim: 'Read a schema for what is missing',
    body: 'Uniqueness scope, delete behaviour, and nullability are mechanical to check and easy for a person to skim past. Paste the DDL — the CREATE TABLE statements themselves — and ask what a hostile script could write into it.',
  },
  {
    id: 'adr-draft',
    claim: "Draft the ADR's first pass",
    body: 'From your own notes, while the alternatives are still fresh. You supply the reasons; it supplies the structure.',
  },
]

export const AI_MISLEADS: AIEntry[] = [
  {
    id: 'distribution',
    claim: 'It reaches for distribution by default',
    body: 'Microservices, queues and caching layers turn up unprompted, because that is what the training material is about. Each one is a real solution to a problem you do not yet have.',
  },
  {
    id: 'style-by-popularity',
    claim:
      'Asked which style to use, it answers with the one it has read most about',
    body: 'Not the one your characteristics select. It will produce a comparison table that looks like the one in this stage and then recommend against your own constraints, with citations. Use it the other way round: give it your three characteristics and make it derive the answer, rather than asking it what to pick.',
  },
  {
    id: 'invented-scale',
    claim: 'It invents scale',
    body: 'Ask it to design for growth and it will design for growth you cannot describe, then justify the complexity with the number it made up.',
  },
  {
    id: 'resilience-layer',
    claim: 'Asked to make something resilient, it builds a resilience layer',
    body: 'Retries, a breaker, a dead-letter queue and a health-check dashboard, for three third-party calls. This is the reach-for-distribution failure in different clothes, and it is harder to spot because every individual pattern it names is real. Ask instead which single call is most likely to fail, and what a timeout alone would do.',
  },
  {
    id: 'schema-advice',
    claim: 'Schema advice arrives confident and context-free',
    body: 'It does not know your compliance boundary, your budget, or that this table is financial and legally has to survive a deletion.',
  },
  {
    id: 'unsupervised-adr',
    claim: 'An unsupervised ADR is worse than no ADR',
    body: 'It reads plausibly while recording reasons you never had. That is exactly the reconstruction this stage warns about, except it arrives eight months early, in writing, and you will believe it.',
  },
]

export const AI_TOOLS: AITool[] = [
  {
    name: 'context7',
    body: "The provider's own documentation rather than the model's memory of it — matters most for anything touching auth.",
  },
  {
    name: 'claude-mem',
    body: 'For "did I already decide this, and write it down."',
  },
  {
    name: 'A git worktree or sandbox',
    body: 'For the throwaway spike that answers a feasibility question without polluting the repo.',
  },
]
