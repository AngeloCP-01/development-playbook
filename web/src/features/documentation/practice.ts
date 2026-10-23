export type DecisionCase = Readonly<{
  id: string
  prompt: string
  excerpt: string
  options: readonly Readonly<{ id: string; text: string }>[]
  answer: string
  rationale: string
}>
export const COMMENT_CASES: readonly DecisionCase[] = [
  {
    id: 'external',
    prompt: 'Which explanation is supported by the comment?',
    excerpt:
      '// Keep the larger record in our external store and put only its ID in\n// metadata, whose value limit is 500 characters.',
    options: [
      {
        id: 'constraint',
        text: 'The external ID avoids storing a larger value in metadata.',
      },
      {
        id: 'outage',
        text: 'A particular past outage proved that Stripe silently truncates values.',
      },
    ],
    answer: 'constraint',
    rationale:
      'Stripe documents a 500-character metadata value limit and recommends an external record ID for larger data. The comment explains that outside constraint. It supplies no evidence of silent truncation, an incident or a retry diagnosis.',
  },
  {
    id: 'deviation',
    prompt: 'Why preserve two forms of the title?',
    excerpt:
      '// Preserve the entered title for display. Apply normalization only\n// to the separate lookup key.',
    options: [
      {
        id: 'separate-key',
        text: 'The lookup key and displayed title serve different purposes.',
      },
      {
        id: 'restatement',
        text: 'The comment just repeats the variable assignment.',
      },
    ],
    answer: 'separate-key',
    rationale:
      'This explains a deliberate deviation: normalization serves lookup while the original input serves display. Rename unclear code when a good name carries the meaning; retain a comment for intent a name cannot capture.',
  },
  {
    id: 'logic',
    prompt: 'Which condition must a later change preserve?',
    excerpt:
      "// This example's date interval includes both endpoints; account for\n// that when converting it to a half-open range.",
    options: [
      { id: 'exclusive', text: 'The last day is already excluded.' },
      {
        id: 'inclusive',
        text: 'Both endpoints are included in this illustrative interval.',
      },
    ],
    answer: 'inclusive',
    rationale:
      'The comment explains tricky interval logic and its conversion constraint. It does not establish the date semantics of an unrelated application.',
  },
  {
    id: 'limit',
    prompt: 'What does the caller need to learn?',
    excerpt:
      '// This illustrative export handles at most 1000 rows. Expose that cap\n// to callers and revisit it before accepting larger exports.',
    options: [
      { id: 'unlimited', text: 'The export accepts arbitrary sizes.' },
      {
        id: 'cap',
        text: 'The example has a 1000-row cap that must be exposed and revisited.',
      },
    ],
    answer: 'cap',
    rationale:
      'A known limitation belongs where callers can discover it. This is an illustrative limit, not a measured property of the playbook.',
  },
]
const evidenceOptions = [
  { id: 'read', text: 'Read: compared with an identified source' },
  { id: 'compile', text: 'Compile: passed the stated compiler checks' },
  { id: 'execute', text: 'Execute: ran with an observed result' },
] as const
export const EVIDENCE_CASES: readonly DecisionCase[] = [
  {
    id: 'read',
    prompt: 'What does this hypothetical review establish?',
    excerpt:
      'The reviewer compared the draft with the identified contract revision. No example was compiled or command run.',
    options: evidenceOptions,
    answer: 'read',
    rationale:
      'Read evidence establishes comparison with an identified source. It does not establish compilation or execution.',
  },
  {
    id: 'compile',
    prompt: 'What does this hypothetical compiler report establish?',
    excerpt:
      'A named synthetic example passed tsc --noEmit at the recorded revision. No runtime behavior was exercised.',
    options: evidenceOptions,
    answer: 'compile',
    rationale:
      'Compile evidence establishes the stated compiler/type checks for that example. It does not establish a successful procedure or production behavior.',
  },
  {
    id: 'execute',
    prompt: 'What does this hypothetical isolated run establish?',
    excerpt:
      'Command: node check-example.mjs. Revision: illustrative-r1. Environment: isolated synthetic fixture. Observed result: expected sample output, exit 0.',
    options: evidenceOptions,
    answer: 'execute',
    rationale:
      'Execute evidence names a command, revision, environment and observed result. This isolated example does not establish production recovery; record its limits.',
  },
]
