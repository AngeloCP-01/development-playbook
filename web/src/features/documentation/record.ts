export const RECORD_KEY = 'playbook:documentation-change:v1'
export const FIELDS = [
  {
    id: 'change',
    label: 'Change and scope',
    hint: 'What changes, in which application and revision?',
    view: 'change',
  },
  {
    id: 'reader',
    label: 'Reader and task',
    hint: 'Who needs this, and what must they be able to do or look up?',
    view: 'change',
  },
  {
    id: 'documents',
    label: 'Affected documents and action',
    hint: 'Name paths and whether to create, update, link, redirect or retire them.',
    view: 'change',
  },
  {
    id: 'source',
    label: 'Authoritative source and revision',
    hint: 'Identify the implementation, contract, verified procedure or decision in scope.',
    view: 'change',
  },
  {
    id: 'check',
    label: 'Check and expected result',
    hint: 'Name the check or command, its safe environment and the result you expect.',
    view: 'evidence',
  },
  {
    id: 'evidence',
    label: 'Observed evidence and limits',
    hint: 'Record what actually ran or was reviewed, revision, environment and observed result. Leave missing evidence explicit.',
    view: 'evidence',
  },
  {
    id: 'owner',
    label: 'Owner and reviewer',
    hint: 'Who changes and reviews this? When working alone, name yourself.',
    view: 'evidence',
  },
  {
    id: 'trigger',
    label: 'Review trigger and follow-up',
    hint: 'Which change or periodic check brings the document back for review?',
    view: 'evidence',
  },
] as const
export type FieldId = (typeof FIELDS)[number]['id']
export const CHECKS = [
  {
    id: 'affected',
    text: 'Affected documentation is identified from the authoritative facts, including changed options and response contracts.',
    periodic: false,
  },
  {
    id: 'decisions',
    text: 'Significant decisions have a record; historical decisions retain their reasoning and link to replacements.',
    periodic: false,
  },
  {
    id: 'current',
    text: 'Current instructions, references and generated outputs match the intended revision and reviewed behavior.',
    periodic: false,
  },
  {
    id: 'configuration',
    text: 'Required configuration is documented; any claimed enforcement is verified against actual validation.',
    periodic: false,
  },
  {
    id: 'privacy',
    text: 'Examples use safe synthetic data and contain no real credentials or private customer details.',
    periodic: false,
  },
  {
    id: 'validation',
    text: 'Claimed validation names its command/check, revision, environment and observed result.',
    periodic: false,
  },
  {
    id: 'reviewed',
    text: 'The change owner reviewed the material; commit context explains a reason when one needs preserving.',
    periodic: false,
  },
  {
    id: 'fresh-clone',
    text: 'A fresh maintainer reaches the expected result from a fresh clone using the README.',
    periodic: true,
  },
  {
    id: 'owners',
    text: 'Each current document has an owner and a review trigger.',
    periodic: true,
  },
  {
    id: 'history',
    text: 'Historical records are labeled and linked; obsolete current procedures are corrected, redirected or retired.',
    periodic: true,
  },
] as const
export type CheckId = (typeof CHECKS)[number]['id']
export type DocumentationRecord = Record<FieldId, string> & {
  checked: CheckId[]
}
export const EMPTY_RECORD: DocumentationRecord = {
  change: '',
  reader: '',
  documents: '',
  source: '',
  check: '',
  evidence: '',
  owner: '',
  trigger: '',
  checked: [],
}
export const TEAM_NOTES = [
  'Let a new maintainer try setup without coaching; their first unresolved step becomes the fix list.',
  'Give each area an owner and a review trigger; review docs in the change that affects them.',
  'Add contributor conventions when contributors need them, including exceptions and review expectations.',
  'Keep decisions accessible to people who did not attend the discussion.',
  'Link operational runbooks and handover routes; Stage 16 owns incident response.',
] as const

export function normalizeRecord(value: unknown): DocumentationRecord {
  const result: DocumentationRecord = { ...EMPTY_RECORD, checked: [] }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result
  const input = value as Record<string, unknown>
  for (const { id } of FIELDS)
    if (typeof input[id] === 'string') result[id] = input[id]
  if (Array.isArray(input.checked)) {
    result.checked = CHECKS.filter(
      (c) => input.checked instanceof Array && input.checked.includes(c.id),
    ).map((c) => c.id)
  }
  return result
}
export function hasRecord(record: DocumentationRecord): boolean {
  return (
    FIELDS.some((f) => record[f.id].trim().length > 0) ||
    record.checked.length > 0
  )
}
export function recordMarkdown(record: DocumentationRecord): string {
  return [
    '# Documentation change plan',
    '',
    'Reader-entered claims and selections; recording them does not verify documentation.',
    '',
    ...FIELDS.map(
      (f) => `## ${f.label}\n\n${record[f.id].trim() || 'not recorded'}\n`,
    ),
    ...[false, true].flatMap((periodic) => [
      `## ${periodic ? 'Periodic' : 'Per-change'} checks`,
      '',
      ...CHECKS.filter((c) => c.periodic === periodic).map(
        (c) => `- [${record.checked.includes(c.id) ? 'x' : ' '}] ${c.text}`,
      ),
      '',
    ]),
  ].join('\n')
}
