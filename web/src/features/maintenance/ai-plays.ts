/** Hand-ported from docs/17-maintenance.md, "AI in maintenance". */
export const AI_PLAYS = [
  {
    id: 'migration',
    title: 'Compare versioned migration guidance',
    summary:
      'Start from the official guide for the installed and target versions.',
    input:
      'Supply the official versioned migration guide and relevant package configuration. Name installed and target versions; leave unavailable guidance marked missing.',
    request:
      'Quote the supplied guide for each required change, separate observations from inference and list unanswered compatibility questions. Do not invent a target-version instruction.',
    review:
      'Review the official guidance and every proposed diff before changing dependencies. Check the compatible package family and affected behavior; the assistant’s comparison is a draft.',
  },
  {
    id: 'dependency-diff',
    title: 'Summarize dependency and lockfile changes',
    summary:
      'Connect the actual diff to release notes, advisories and affected checks.',
    input:
      'Supply the manifest and lockfile diff, release notes and applicable advisory details. Include known build, CI and runtime usage without credentials.',
    request:
      'Summarize what changed, cite the supplied evidence and propose checks for the package’s role. Keep unknown exposure and unverified compatibility explicit.',
    review:
      'A summary does not establish vulnerability exposure, package trustworthiness or compatibility. Verify actual usage and the relevant sources before deciding urgency or accepting the change.',
  },
  {
    id: 'findings',
    title: 'Organize evidenced maintenance findings',
    summary:
      'Group repeated costs and deadlines without inventing priority or ownership.',
    input:
      'Supply redacted queue items, evidence links, repeated edits, deadlines and known consumers. Distinguish measured usage from gaps in telemetry.',
    request:
      'Group related findings, retain evidence links, identify missing facts and propose bounded next actions. Preserve unknown usage as unknown; do not infer that quiet analytics proves a feature is unused.',
    review:
      'A human confirms priorities, owners and review dates. An incomplete record cannot establish that a feature is unused or authorize a retention policy. Verify consumers and approved exclusions separately.',
  },
  {
    id: 'checks-record',
    title: 'Draft checks and review records',
    summary:
      'Keep suggested checks distinct from results that actually happened.',
    input:
      'Supply the bounded change, agreed acceptance criteria and actual check results with their revision and environment. Identify recovery arrangements and unresolved gaps.',
    request:
      'Separate proposed checks from observed results, suggest missing checks and draft the maintenance record with evidence links. Mark unavailable results unknown; do not turn a planned drill into a completed one.',
    review:
      'Verify the evidence, recovery arrangements and follow-up date. Review suggested commands before any authorized execution. A drafted restore procedure does not establish successful recovery.',
  },
] as const
