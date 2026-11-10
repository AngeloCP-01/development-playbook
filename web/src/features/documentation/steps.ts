import { createElement } from 'react'
import type { Step } from '@/components/Stepper'
import { ReadmePanel, DecisionsPanel } from './DocumentPanels'
import {
  ChoosePanel,
  ReferencePanel,
  ChangesPanel,
  HistoryPanel,
} from './LookupPanels'
import { AIPanel, CommentsPanel } from './PracticePanels'
import { RecordPanel, ChecklistPanel } from './RecordPanels'
import { TrapsPanel } from './closing'
export const STEP_IDS = [
  'choose',
  'readme',
  'decisions',
  'reference',
  'comments',
  'changes',
  'history',
  'ai',
  'your-change',
  'your-evidence',
  'checklist',
  'traps',
] as const
export type StepId = (typeof STEP_IDS)[number]
export const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'choose',
    label: 'Choose a document',
    hint: 'Start from a reader and a task',
    content: createElement(ChoosePanel),
  },
  {
    id: 'readme',
    label: 'Verify the README',
    hint: 'Check setup from a fresh clone',
    content: createElement(ReadmePanel),
  },
  {
    id: 'decisions',
    label: 'Replace a decision',
    hint: 'Preserve history and expose current status',
    content: createElement(DecisionsPanel),
  },
  {
    id: 'reference',
    label: 'State exact facts',
    hint: 'Name sources, versions and absence behavior',
    content: createElement(ReferencePanel),
  },
  {
    id: 'comments',
    label: 'Explain the exception',
    hint: 'Practise the four useful comment patterns',
    content: createElement(CommentsPanel),
  },
  {
    id: 'changes',
    label: 'Trace the change',
    hint: 'Connect facts to documents and checks',
    content: createElement(ChangesPanel),
  },
  {
    id: 'history',
    label: 'Keep history usable',
    hint: 'Preserve records and repair current instructions',
    content: createElement(HistoryPanel),
  },
  {
    id: 'ai',
    label: 'Check the evidence',
    hint: 'Ground AI drafts and qualify validation',
    content: createElement(AIPanel),
  },
  {
    id: 'your-change',
    label: 'Plan your change',
    hint: 'Record your reader, documents and source',
    content: createElement(RecordPanel, { view: 'change' }),
  },
  {
    id: 'your-evidence',
    label: 'Plan the check',
    hint: 'Record checks, evidence, ownership and triggers',
    content: createElement(RecordPanel, { view: 'evidence' }),
  },
  {
    id: 'checklist',
    label: 'Review this change',
    hint: 'Separate per-change and periodic checks',
    content: createElement(ChecklistPanel),
  },
  {
    id: 'traps',
    label: 'Spot the trap',
    hint: 'Recognize assumptions that need correction',
    content: createElement(TrapsPanel),
  },
]

export const COVERAGE: Record<string, readonly StepId[]> = {
  'Entry criteria': ['choose'],
  'Choose the document for the reader’s task': ['choose'],
  'Keep the README usable': ['readme'],
  'Record decisions and supersede them visibly': ['decisions'],
  'Keep architecture and contract references current': ['reference'],
  'Write comments for non-obvious reasons': ['comments'],
  'Update and verify documentation with the change': [
    'changes',
    'your-change',
    'your-evidence',
  ],
  'Choose what to omit or archive': ['history'],
  'Commit messages preserve change context': ['history'],
  'AI in documentation': ['ai'],
  Artifacts: ['choose', 'readme', 'decisions', 'reference', 'comments'],
  'Definition of done': ['checklist'],
  'Scaling to a team': ['checklist'],
  Traps: ['traps'],
}
