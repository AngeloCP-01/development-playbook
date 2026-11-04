import type {
  DrillOption,
  DrillRow,
} from '@/features/observability/drill-types'

export const MEASURE_OPTIONS: DrillOption[] = [
  { id: 'product', label: 'Product outcome' },
  { id: 'delivery', label: 'Delivery signal' },
  { id: 'experience', label: 'People’s experience' },
]

export const MEASURES: DrillRow[] = [
  {
    id: 'completion',
    prompt:
      '18 of 30 eligible first-time invoice attempts reached a saved draft.',
    answer: 'product',
    why: 'This measures task completion for a defined population. It cannot explain why the other attempts stopped or establish that the draft was useful afterward.',
  },
  {
    id: 'release',
    prompt: 'Changes reach production sooner, with fewer failed deployments.',
    answer: 'delivery',
    why: 'This describes the delivery system. It does not establish whether those changes solved a useful user problem.',
  },
  {
    id: 'work',
    prompt:
      'Maintainers report frequent interruptions and uncertainty about release permissions.',
    answer: 'experience',
    why: 'People’s experience helps explain sustainability and friction. Inspect waiting and rework alongside it; commit counts cannot measure individual performance.',
  },
]

export const SIGNALS = [
  {
    id: 'export',
    title: 'Few recorded uses of an export',
    possible: 'Low demand, seasonal use, poor discovery or missing events.',
    check:
      'Check who needs it, when, and whether successful uses are recorded. Inspect critical workflows, accessibility, commitments and migration options before retirement.',
  },
  {
    id: 'validation',
    title: 'Repeated validation errors',
    possible:
      'Unclear instructions, a defect, incompatible input or automated traffic.',
    check:
      'Inspect affected tasks and input rules, then reproduce the failure. Retries and duplicate events can exaggerate its frequency.',
  },
  {
    id: 'support',
    title: 'Several support questions about one step',
    possible:
      'Confusing design, missing guidance or a policy users need explained.',
    check:
      'Read the original conversations and observe a task attempt. A support queue represents people who contacted you, not a survey of all users.',
  },
  {
    id: 'funnel',
    title: 'A sharp funnel drop after a release',
    possible: 'A regression, a changed audience or broken instrumentation.',
    check:
      'Check event definitions, release timing and comparable cohorts. A cohort is a group sharing a relevant characteristic or starting period; changing its composition weakens the comparison.',
  },
]

export const ACTION_OPTIONS: DrillOption[] = [
  { id: 'act', label: 'Take a bounded action' },
  { id: 'research', label: 'Investigate first' },
  { id: 'defer', label: 'Defer deliberately' },
]

export const ACTIONS: DrillRow[] = [
  {
    id: 'access',
    prompt:
      'One keyboard user cannot save a draft. You reproduce the focus trap; a small repair and keyboard regression check fit today’s capacity.',
    answer: 'act',
    why: 'One serious access barrier can outweigh many convenience requests. Repair the reproduced failure with an owner and verification; low report frequency is not a reason to leave someone excluded.',
  },
  {
    id: 'templates',
    prompt:
      'A user asks for invoice templates and says they copy last month’s invoice. You have not observed which details change or who approves sending.',
    answer: 'research',
    why: 'The request suggests a task to investigate; it does not prove recurring invoices are the answer. Templates may still fit varying items, recipients or amounts. Observe the workflow and check whether automatic sending would be safe.',
  },
  {
    id: 'audience',
    prompt:
      'A convenience feature serves an audience outside the current product goal. No harm or commitment is identified; the team is repairing an evidenced task failure.',
    answer: 'defer',
    why: 'Record why this can wait and what evidence or review date would reopen it. Fixing friction is a useful default, not a universal rule above new capabilities or research.',
  },
]

export const RECORD = [
  {
    id: 'problem',
    title: 'Problem and evidence',
    summary: 'First-time invoice attempts stall before saving.',
    detail:
      'Over two weeks, 18 of 30 eligible first-time invoice attempts reached a saved draft. Three observed participants overlooked a required date field. These observations suggest a hypothesis; they do not explain every failed attempt.',
  },
  {
    id: 'hypothesis',
    title: 'Hypothesis',
    summary: 'Clearer date guidance may help people save a draft.',
    detail:
      'Predict a task improvement before trying the copy change. Compare the prediction with the result, rather than choosing a success story afterward.',
  },
  {
    id: 'baseline',
    title: 'Baseline and outcome',
    summary: '18/30 before; an illustrative target of 24/30.',
    detail:
      'Baseline: 18 of 30 eligible first-time attempts over two weeks. Review after another two-week window, aiming for 24 of 30. Keep the population and event definitions comparable. This target is a decision aid, not a statistical significance threshold.',
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    summary: 'Valid dates and keyboard completion must remain acceptable.',
    detail:
      'Stop and investigate if a saved draft accepts an invalid date. Check keyboard completion before release. A better completion count does not excuse broken validation or lost access.',
  },
  {
    id: 'owner',
    title: 'Action and owner',
    summary: 'Jo owns a small copy change.',
    detail:
      'Bound the change to date guidance and set an effort limit before work. In your own record, name the responsible person and the actual limit; this fictional example does not establish your team’s capacity.',
  },
  {
    id: 'review',
    title: 'Review',
    summary:
      'Another two-week window; Jo records evidence and the next decision.',
    detail:
      'Set an actual review date, measurement method and decision owner before your own change. Record counts, population changes, event quality and contrary cases. Choose keep, adapt, revert or investigate further, with the limits of the evidence.',
  },
]

export const RESULT_OPTIONS: DrillOption[] = [
  { id: 'causal', label: 'The copy caused the improvement' },
  { id: 'inconclusive', label: 'Inconclusive; investigate further' },
]

export const RESULT: DrillRow[] = [
  {
    id: 'review',
    prompt:
      'At review, 20 of 28 attempts reach a draft. A campaign brought a different audience. What can Jo conclude?',
    answer: 'inconclusive',
    why: 'The campaign changed the audience, weakening the planned comparison. The target was not met, and the higher completion proportion does not prove the copy caused it. Jo records the result as inconclusive, checks event quality and observes more task attempts before deciding whether to keep or revise the guidance.',
  },
]

export const AI_PLAYS = [
  {
    id: 'feedback',
    title: 'Group feedback',
    summary: 'Propose themes without losing exceptions.',
    input:
      'De-identified observations with stable IDs, using only material permitted for the selected tool.',
    request:
      'Group themes, retain exceptions and link each claim to supplied items.',
    verify:
      'Compare themes with originals. Keep minority needs visible and separate distinct users from repeat messages. Check contradictory records, not just the most convenient examples.',
  },
  {
    id: 'measure',
    title: 'Critique a measure',
    summary: 'Find missing denominators and competing explanations.',
    input: 'The goal, event definitions, population, date window and counts.',
    request:
      'Find measurement gaps, missing denominators and alternative explanations.',
    verify:
      'Check instrumentation and calculations; reject invented baselines or claims of causality. Generated analysis does not establish product success.',
  },
  {
    id: 'experiment',
    title: 'Draft a small experiment',
    summary: 'Propose an action with guardrails and a review.',
    input: 'Evidence, hypothesis, capacity and constraints.',
    request:
      'Draft a bounded action, harm checks, stopping conditions and a review method.',
    verify:
      'A person approves exposure, stopping conditions and the decision. Do not let the model choose a winner or manufacture confidence from small counts.',
  },
  {
    id: 'process',
    title: 'Review process friction',
    summary: 'Suggest testable changes from cited events.',
    input: 'Redacted delivery records and previous improvement actions.',
    request:
      'Identify recurring waits and propose testable changes, citing supplied events.',
    verify:
      'Confirm the cited events and seek team context. Assess AI assistance by useful outcomes and rework, not output volume.',
  },
]

export const DONE = [
  {
    id: 'separate',
    title: 'Separate product outcomes and delivery signals',
    detail:
      'Record what changed for users separately from delivery speed, safety and people’s experience. Faster shipping alone does not establish product value.',
  },
  {
    id: 'evidence',
    title: 'Check the evidence',
    detail:
      'Keep the population, window, numerator, denominator and event meanings. Inspect gaps and contrary cases, trace requests to tasks and include serious minority needs.',
  },
  {
    id: 'decision',
    title: 'Record the choice and alternatives',
    detail:
      'Choose an action or deliberate deferral. Compare a small repair, a new capability, further research and doing nothing; explain why alternatives can wait.',
  },
  {
    id: 'owner',
    title: 'Make the next review possible',
    detail:
      'For selected work, name an owner, effort limit, baseline, expected outcome, guardrails, stop or rollback condition, review date, method and decision owner.',
  },
  {
    id: 'previous',
    title: 'Review the previous action',
    detail:
      'Write the actual result and its limits, including an inconclusive outcome where appropriate. Completing an action closes a task; studying its result closes the learning cycle.',
  },
  {
    id: 'guidance',
    title: 'Keep guidance consistent',
    detail:
      'When evidence supports changed advice, update the relevant chapter and interactive page together. Keep conditions and a recurrence check with the lesson; preserve decision history.',
  },
]

export const TRAPS = [
  {
    id: 'diagnosis',
    title: 'Treating a signal as a diagnosis',
    detail:
      'A failed search needs investigation; it does not prove missing content. Check intent, behavior and instrumentation before choosing a fix.',
  },
  {
    id: 'loud',
    title: 'Counting only the loudest requests',
    detail:
      'Frequency can hide serious harm affecting a few users. Count independent users and affected tasks, and keep contradictory evidence.',
  },
  {
    id: 'delete',
    title: 'Deleting from usage counts alone',
    detail:
      'Verify instrumentation and rare but important workflows. Check accessibility, commitments, migration and recovery before retirement.',
  },
  {
    id: 'causal',
    title: 'Calling before/after causal',
    detail:
      'Keep competing explanations beside the result. Audience changes, seasonality and other releases can explain an apparent improvement.',
  },
  {
    id: 'metric',
    title: 'Optimizing the metric',
    detail:
      'More deployments or clicks can coexist with worse user outcomes. Check task results, quality and guardrails.',
  },
  {
    id: 'result',
    title: 'Closing the action without its result',
    detail:
      'Record what changed and what you learned, including uncertainty. A shipped change still needs outcome review.',
  },
  {
    id: 'blame',
    title: 'Assigning blame',
    detail:
      'Inspect system conditions, waiting and rework. Agree on an owned change rather than ranking people.',
  },
  {
    id: 'ai',
    title: 'Letting AI summaries become evidence',
    detail:
      'Check the source observations and counts. Keep unsupported conclusions out of the decision record.',
  },
  {
    id: 'safeguard',
    title: 'Pruning a skipped safeguard',
    detail:
      'Inspect its risk, cost and explanation before changing the advice. Skipping a protection does not establish that its risk disappeared.',
  },
]
