import { createElement } from 'react'
import type { Step } from '@/components/Stepper'
import { MeasuresPanel, EvidencePanel, ActionPanel } from './EvidencePanels'
import { CyclePanel, DeliveryPanel, ReviewPanel } from './LearningPanels'
import { AIPlaysPanel } from './AIPlaysPanel'

export const STEP_IDS = [
  'measures',
  'evidence',
  'action',
  'cycle',
  'delivery',
  'ai',
  'review',
] as const
type StepId = (typeof STEP_IDS)[number]

export const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'measures',
    label: 'Measures',
    hint: 'Separate outcomes from delivery',
    content: createElement(MeasuresPanel),
  },
  {
    id: 'evidence',
    label: 'Evidence',
    hint: 'Investigate before explaining',
    content: createElement(EvidencePanel),
  },
  {
    id: 'action',
    label: 'Next action',
    hint: 'Compare repair, research and deferral',
    content: createElement(ActionPanel),
  },
  {
    id: 'cycle',
    label: 'Learning cycle',
    hint: 'Predict, try, study and adjust',
    content: createElement(CyclePanel),
  },
  {
    id: 'delivery',
    label: 'Delivery conditions',
    hint: 'Find waiting, risk and rework',
    content: createElement(DeliveryPanel),
  },
  {
    id: 'ai',
    label: 'AI Plays',
    hint: 'Check proposals against supplied evidence',
    content: createElement(AIPlaysPanel),
  },
  {
    id: 'review',
    label: 'Review and guidance',
    hint: 'Review results and keep advice current',
    content: createElement(ReviewPanel),
  },
]
