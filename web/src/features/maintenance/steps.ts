import { createElement } from 'react'
import type { Step } from '@/components/Stepper'
import { TriagePanel, UpdatesPanel, ExpiryPanel } from './UpkeepPanels'
import { DataPanel, DebtPanel } from './ChangePanels'
import { ReviewPanel } from './ReviewPanel'

export const STEP_IDS = [
  'triage',
  'updates',
  'expiry',
  'data-recovery',
  'debt-retirement',
  'review-record',
] as const

export type StepId = (typeof STEP_IDS)[number]

export const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'triage',
    label: 'Triage',
    hint: 'Choose what needs attention',
    content: createElement(TriagePanel),
  },
  {
    id: 'updates',
    label: 'Updates',
    hint: 'Review before upgrading',
    content: createElement(UpdatesPanel),
  },
  {
    id: 'expiry',
    label: 'Expiry',
    hint: 'Verify renewal and rotation',
    content: createElement(ExpiryPanel),
  },
  {
    id: 'data-recovery',
    label: 'Data and recovery',
    hint: 'Approve retention; test restoration',
    content: createElement(DataPanel),
  },
  {
    id: 'debt-retirement',
    label: 'Debt and retirement',
    hint: 'Find the cost and the consumers',
    content: createElement(DebtPanel),
  },
  {
    id: 'review-record',
    label: 'Review record',
    hint: 'Keep evidence and follow-up',
    content: createElement(ReviewPanel),
  },
]
