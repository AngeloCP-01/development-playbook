export type LookupEntry = {
  id: string
  label: string
  summary: string
  details: readonly { label: string; text: string }[]
}
export const NEEDS: readonly LookupEntry[] = [
  {
    id: 'tutorial',
    label: 'Learn a skill',
    summary: 'Tutorial: learn through a guided exercise.',
    details: [
      {
        label: 'Workshop example',
        text: 'Make a first booking in a safe sample environment.',
      },
    ],
  },
  {
    id: 'how-to',
    label: 'Complete a task',
    summary: 'How-to guide: complete a known task.',
    details: [
      {
        label: 'Example',
        text: 'Roll back a deployment using the applicable procedure.',
      },
    ],
  },
  {
    id: 'reference',
    label: 'Look up facts',
    summary:
      'Reference: find exact names, types, allowed values and absence behavior.',
    details: [
      {
        label: 'Workshop example',
        text: 'Look up a setting default or an optional response field.',
      },
    ],
  },
  {
    id: 'explanation',
    label: 'Understand a choice',
    summary: 'Explanation: understand a concept or reason.',
    details: [
      {
        label: 'Workshop example',
        text: 'Understand why the factual contract reference is generated.',
      },
    ],
  },
]
export const ARTIFACTS = [
  {
    id: 'readme',
    label: 'README / getting started',
    summary: 'A first working setup and a route to more detail.',
  },
  {
    id: 'architecture',
    label: 'Architecture overview',
    summary: 'Boundaries, responsibilities and relationships a reader needs.',
  },
  {
    id: 'adr',
    label: 'Decision record',
    summary:
      'A significant choice and its alternatives need a lasting explanation.',
  },
  {
    id: 'conventions',
    label: 'Conventions / contributing',
    summary:
      'Contributors need consistent rules, exceptions and review expectations.',
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    summary:
      'A known symptom needs checks, likely causes and a safe next action.',
  },
  {
    id: 'changelog',
    label: 'Changelog',
    summary: 'Notable changes curated by version, not a raw commit dump.',
  },
  {
    id: 'release-notes',
    label: 'Release notes',
    summary: 'A particular audience needs release impact and required actions.',
  },
] as const
export const FACTS: readonly LookupEntry[] = [
  {
    id: 'setting',
    label: 'BOOKING_WINDOW_DAYS',
    summary: 'Illustrative Workshop configuration reference.',
    details: [
      { label: 'Shape', text: 'integer 1–365' },
      { label: 'Default or absence', text: '30 when unset' },
      { label: 'Source', text: 'Versioned startup configuration validator' },
      { label: 'Owner / trigger', text: 'Maintainer / validator change' },
    ],
  },
  {
    id: 'response',
    label: 'waitlistPosition',
    summary: 'Illustrative Workshop response reference.',
    details: [
      { label: 'Shape', text: 'positive integer' },
      { label: 'Default or absence', text: 'omitted when not waitlisted' },
      { label: 'Source', text: 'Versioned response contract and serializer' },
      { label: 'Owner / trigger', text: 'Contract owner / response change' },
    ],
  },
]
export const CHANGES: readonly LookupEntry[] = [
  {
    id: 'configuration',
    label: 'Configuration',
    summary: 'Workshop adds BOOKING_WINDOW_DAYS.',
    details: [
      {
        label: 'Source',
        text: 'Startup validator and its unset/invalid behavior',
      },
      {
        label: 'Documents',
        text: 'Configuration reference, .env.example and setup guide',
      },
      {
        label: 'Check',
        text: 'Compare integer 1–365 and default 30 with validation; test missing/invalid values.',
      },
      { label: 'Owner / trigger', text: 'Maintainer / validator change' },
    ],
  },
  {
    id: 'response',
    label: 'Response contract',
    summary: 'Workshop adds a response field.',
    details: [
      { label: 'Source', text: 'Response schema and serializer behavior' },
      { label: 'Documents', text: 'Generated reference and example response' },
      {
        label: 'Check',
        text: 'Run generation, inspect the expected diff and verify optional-field omission.',
      },
      { label: 'Owner / trigger', text: 'Contract owner / response change' },
    ],
  },
  {
    id: 'values',
    label: 'Default or allowed value',
    summary: 'An option changes its default or range.',
    details: [
      { label: 'Source', text: 'Implementation and behavioral test' },
      { label: 'Documents', text: 'Existing reference and relevant how-to' },
      {
        label: 'Check',
        text: 'Find old values and check new behavior, not only matching strings.',
      },
      { label: 'Owner / trigger', text: 'Maintainer / option change' },
    ],
  },
  {
    id: 'boundary',
    label: 'Boundary or dependency',
    summary: 'A relationship in the system changes.',
    details: [
      { label: 'Source', text: 'Current system and decision record' },
      {
        label: 'Documents',
        text: 'Architecture view, ADR and affected runbook',
      },
      {
        label: 'Check',
        text: 'Trace affected relationships and replacement links.',
      },
      { label: 'Owner / trigger', text: 'Area owner / boundary change' },
    ],
  },
  {
    id: 'procedure',
    label: 'Setup or release procedure',
    summary: 'Commands, access or environment change.',
    details: [
      { label: 'Source', text: 'Actual commands, access and environment' },
      { label: 'Documents', text: 'README and linked procedures' },
      {
        label: 'Check',
        text: 'Follow the documented path safely and record the result.',
      },
      { label: 'Owner / trigger', text: 'Maintainer / procedure change' },
    ],
  },
  {
    id: 'failure',
    label: 'Known failure or release',
    summary: 'A confirmed fix or release needs useful documentation.',
    details: [
      { label: 'Source', text: 'Diagnosed behavior and release record' },
      {
        label: 'Documents',
        text: 'Troubleshooting, changelog or release notes as needed',
      },
      {
        label: 'Check',
        text: 'Verify the check/workaround and publish only supported impact claims.',
      },
      {
        label: 'Owner / trigger',
        text: 'Maintainer / confirmed fix or release',
      },
    ],
  },
]
export const HISTORY: readonly LookupEntry[] = [
  {
    id: 'historical',
    label: 'Historical record',
    summary: 'Preserve historical ADRs and release records.',
    details: [
      {
        label: 'Action',
        text: 'Keep the original reasons with discoverable replacement or version context.',
      },
    ],
  },
  {
    id: 'current',
    label: 'Current instructions',
    summary: 'Correct, redirect or retire obsolete current procedures.',
    details: [
      {
        label: 'Action',
        text: 'Do not leave a stale setup guide looking current. Link the replacement where readers expect it.',
      },
    ],
  },
]
