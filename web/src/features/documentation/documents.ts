export type DocExample = {
  id: string
  filename: string
  title: string
  meta: readonly string[]
  blocks: readonly { heading: string; paragraphs: readonly string[] }[]
  related?: {
    prefix: string
    label: string
    filename: string
    target: 'old' | 'replacement'
  }
}
export const README: DocExample = {
  id: 'readme',
  filename: 'README.md outline',
  title: 'Project name',
  meta: ['What this does, who uses it, and the smallest useful outcome.'],
  blocks: [
    {
      heading: 'Running locally',
      paragraphs: [
        'Supported prerequisites and tool versions: [actual prerequisites].',
        'Access and safe configuration source: [how a maintainer obtains them].',
        'Clone, install and startup commands: [commands tested for this revision].',
        'Expected result and first useful check: [observable result].',
      ],
    },
    {
      heading: 'Architecture',
      paragraphs: [
        'Scope, main boundaries and external dependencies: [current view].',
        'Decision records: [link to the decision log or relevant ADRs].',
      ],
    },
    {
      heading: 'Deploying',
      paragraphs: [
        'Release and rollback procedures: [links, permissions and compatibility limits].',
        'Logs and health checks: [where to look].',
        'Help or responsible maintainer: [contact role or support route].',
      ],
    },
  ],
}
export const ADRS: Record<'old' | 'replacement' | 'template', DocExample> = {
  old: {
    id: '004',
    filename: 'docs/adr/004-manual-field-reference.md',
    title: 'ADR 004: maintain the initial field reference by hand',
    meta: ['Date: 2026-09-01', 'Status: Accepted'],
    related: {
      prefix: 'Replacement',
      label: 'ADR 005',
      filename: '005-generated-contract-reference.md',
      target: 'replacement',
    },
    blocks: [
      {
        heading: 'Context',
        paragraphs: [
          'The initial contract is small. The team has no reference generator.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Maintain the initial field reference beside the contract.',
        ],
      },
      {
        heading: 'Consequences',
        paragraphs: [
          'Every contract change requires a separate reference edit and review.',
        ],
      },
      {
        heading: 'Supersession notice (appended)',
        paragraphs: [
          '2026-10-20 — Current status: Superseded.',
          'The original context, date and reasoning above are preserved.',
        ],
      },
    ],
  },
  replacement: {
    id: '005',
    filename: 'docs/adr/005-generated-contract-reference.md',
    title: 'ADR 005: generate the factual contract reference',
    meta: ['Date: 2026-10-20', 'Status: Accepted'],
    related: {
      prefix: 'Supersedes',
      label: 'ADR 004',
      filename: '004-manual-field-reference.md',
      target: 'old',
    },
    blocks: [
      {
        heading: 'Context',
        paragraphs: [
          'New settings and response fields make two edited field lists easy to disagree.',
        ],
      },
      {
        heading: 'Decision',
        paragraphs: [
          'Generate the factual reference from the versioned contract.',
        ],
      },
      {
        heading: 'Reasoning',
        paragraphs: ['Keep names, types and defaults tied to one source.'],
      },
      {
        heading: 'Consequences',
        paragraphs: [
          'We must run generation and inspect its result when the contract changes.',
          'Explanations and examples still need human review.',
        ],
      },
      {
        heading: 'Alternatives',
        paragraphs: [
          'Keep editing the field list by hand, accepting the duplicate review work.',
        ],
      },
    ],
  },
  template: {
    id: 'template',
    filename: 'docs/adr/NNN-title.md template',
    title: 'ADR NNN: [significant choice]',
    meta: [
      'Date: [actual date]',
      'Status: [Proposed, Rejected, Accepted or Superseded]',
    ],
    blocks: [
      {
        heading: 'Context',
        paragraphs: ['[Situation, constraints and revision in scope.]'],
      },
      {
        heading: 'Decision',
        paragraphs: ['[The choice under consideration or adopted.]'],
      },
      {
        heading: 'Reasoning',
        paragraphs: ['[Why this choice fits those constraints.]'],
      },
      {
        heading: 'Consequences',
        paragraphs: ['[Costs, obligations and follow-up checks.]'],
      },
      {
        heading: 'Alternatives',
        paragraphs: ['[Options considered and reasons not chosen.]'],
      },
    ],
  },
}
export function documentMarkdown(example: DocExample): string {
  return [
    `# ${example.title}`,
    ...example.meta,
    ...(example.related
      ? [
          `${example.related.prefix}: [${example.related.label}](${example.related.filename})`,
        ]
      : []),
    '',
    ...example.blocks.flatMap((block) => [
      `## ${block.heading}`,
      ...block.paragraphs,
      '',
    ]),
  ].join('\n')
}
