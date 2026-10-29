import type {
  DrillOption,
  DrillRow,
} from '@/features/observability/drill-types'

export const TRIAGE_OPTIONS: DrillOption[] = [
  { id: 'act', label: 'Act before the routine review' },
  { id: 'investigate', label: 'Investigate exposure or impact' },
  { id: 'schedule', label: 'Schedule with an owner and date' },
]

export const TRIAGE: DrillRow[] = [
  {
    id: 'expiry',
    prompt:
      'A production API credential expires tomorrow. Renewal has not been verified.',
    answer: 'act',
    why: 'The deadline arrives before the next weekly slot. Assign an owner now, rotate through the provider’s supported procedure and verify every consumer before the old credential stops working.',
  },
  {
    id: 'advisory',
    prompt:
      'An advisory names an installed build dependency. You do not yet know whether the vulnerable path is used.',
    answer: 'investigate',
    why: 'Unknown exposure is an investigation, not an accepted risk. Check affected versions, build and CI usage, available mitigation and urgency. Escalate immediately if the evidence requires it; development dependencies can execute code too.',
  },
  {
    id: 'duplication',
    prompt:
      'Three changes repeated the same validation edit in two files. No current incident or expiry is involved.',
    answer: 'schedule',
    why: 'Record the repeated cost and the smallest useful refactor, with an owner and a review date. Add coverage for current inputs before consolidating the rule. A reachable vulnerability or imminent deadline takes priority.',
  },
]

export const RECOVERY_OPTIONS: DrillOption[] = [
  { id: 'ready', label: 'Evidence supports the drill result' },
  { id: 'gap', label: 'Recovery evidence is incomplete' },
]

export const RECOVERY: DrillRow[] = [
  {
    id: 'provider',
    prompt:
      'The provider reports “restore complete”. Nobody has checked application access or expected records.',
    answer: 'gap',
    why: 'Measure through validation and reconnection. A completed provider operation does not establish that the application can use the restored data or that the chosen recovery targets were met.',
  },
  {
    id: 'window',
    prompt:
      'The chosen recovery point is older than the project’s configured history window. No separate recovery copy is known.',
    answer: 'gap',
    why: 'Check the actual recovery window before selecting a point. A plan or product capability cannot establish that these particular records remain recoverable. Assign this gap; do not claim the drill passed.',
  },
  {
    id: 'validated',
    prompt:
      'An isolated drill kept outbound side effects disabled, checked records and application access, and measured data loss and elapsed recovery against agreed targets.',
    answer: 'ready',
    why: 'This is evidence for the tested scope. Record the recovery point, observed data gap, elapsed time through reconnection, access restrictions, result and cleanup. Assign remaining gaps, including other stores and configuration.',
  },
]

export const RETIREMENT_OPTIONS: DrillOption[] = [
  { id: 'proceed', label: 'Proceed with the bounded plan' },
  { id: 'check', label: 'Gather evidence or reduce risk first' },
]

export const RETIREMENT: DrillRow[] = [
  {
    id: 'quiet',
    prompt:
      'An admin feature has no analytics events. The proposal is to delete it today.',
    answer: 'check',
    why: 'Missing telemetry leaves usage unknown. Check instrumentation coverage, rare administrative and recovery paths, callers, scheduled jobs, integrations and support knowledge before removing a workflow.',
  },
  {
    id: 'git',
    prompt:
      'The retirement deletes customer data and notifies an integration. Its recovery plan says “revert the commit”.',
    answer: 'check',
    why: 'Version control restores tracked code. It cannot undo data deletion, a sent notification or a broken external contract. Separate irreversible effects and use a reversible disable step where practical.',
  },
  {
    id: 'bounded',
    prompt:
      'Consumers are identified, a migration route is communicated, a reversible disable is monitored, and related flags, billing, data and documentation have owners.',
    answer: 'proceed',
    why: 'Proceed within the reviewed scope and watch the agreed signals. Keep tests for behavior that remains. Removing code does not automatically cancel a provider subscription or resolve stored-data obligations.',
  },
]

export const RECORD = [
  {
    id: 'signal',
    title: 'Signal and impact',
    summary: 'A build plugin approaches end of support; releases depend on it.',
    detail:
      'Name the affected system and workflow. For your own item, record what is observed and what is still unknown. A general wish to “clean up” does not establish impact.',
  },
  {
    id: 'evidence',
    title: 'Evidence',
    summary: 'Vendor notice and installed-version check, linked in the ticket.',
    detail:
      'Keep the source, affected version and relevant deadline. The fictional example does not supply a real notice or prove anything about this repository.',
  },
  {
    id: 'owner',
    title: 'Owner and action',
    summary:
      'The release owner evaluates the supported replacement in a branch.',
    detail:
      'Assign a person who can act and name the next bounded change. Give urgent work a backup and an escalation route rather than relying on whoever opens the queue next.',
  },
  {
    id: 'verification',
    title: 'Verification',
    summary: 'Build plus representative deployment-preview checks.',
    detail:
      'Choose checks for the package’s actual role. Record commands, results and important limits after running them. Proposed checks are not completed checks.',
  },
  {
    id: 'recovery',
    title: 'Recovery',
    summary:
      'Retain the current deploy and check compatibility before promotion.',
    detail:
      'Identify what a code rollback can recover and which data or external effects need separate handling. Confirm the recovery approach before release.',
  },
  {
    id: 'followup',
    title: 'Follow-up',
    summary: 'Record the actual result and review again before support ends.',
    detail:
      'Choose an actual review date in your queue. This example has no real vendor deadline. A deferred item still needs a reason, an owner and a date before its accepted risk expires.',
  },
] as const

export const TRAPS = [
  {
    id: 'ci',
    title: 'Green CI becomes automatic approval',
    detail:
      'Review the package’s role, changed behavior and supply-chain exposure. Checks establish only what they exercise.',
  },
  {
    id: 'cleanup',
    title: 'An unlimited cleanup job',
    detail:
      'Approve retention and exclusions, preview candidates and bound the batch. A successful delete can overload storage or leave physical size unchanged.',
  },
  {
    id: 'budget',
    title: 'A universal maintenance percentage',
    detail:
      'Set capacity from deadlines, obligations, recurring work and user harm. Review whether it is enough; 20% is not a universal standard.',
  },
  {
    id: 'preference',
    title: 'Refactoring by preference',
    detail:
      'Tie a structural change to repeated cost or an upcoming change. Establish meaningful behavior coverage and check the result.',
  },
  {
    id: 'analytics',
    title: 'Deleting on missing analytics',
    detail:
      'Check telemetry coverage, rare workflows and external consumers. No events may mean no measurement.',
  },
  {
    id: 'restore',
    title: 'Recovery measured only by the provider',
    detail:
      'Check data, configuration and application access. Measure through validation and reconnection against the application’s recovery targets.',
  },
  {
    id: 'queue',
    title: 'A queue without follow-up',
    detail:
      'Deferral needs a reason, an owner and a review date. Unknown exposure remains unknown until someone investigates it.',
  },
] as const
