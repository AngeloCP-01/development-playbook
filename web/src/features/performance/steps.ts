import type { Step } from '@/components/Stepper'
import { BaselinePanel, ClockPanel, TargetsPanel } from './panels-measure'
import {
  BottleneckPanel,
  ComparePanel,
  FixesPanel,
  QueryPanel,
} from './panels-diagnose'
import {
  AIPanel,
  DonePanel,
  FollowupPanel,
  RecordPanel,
  TrapsPanel,
} from './panels-close'
import { createElement } from 'react'

export const STEP_IDS = [
  'clock',
  'baseline',
  'target',
  'bottleneck',
  'query',
  'fixes',
  'compare',
  'record',
  'followup',
  'ai',
  'done',
  'traps',
] as const
export type StepId = (typeof STEP_IDS)[number]

export const STEPS: (Step & { id: StepId })[] = [
  {
    id: 'clock',
    label: 'Choose a clock',
    hint: 'Name the observer and start/stop events',
    content: createElement(ClockPanel),
  },
  {
    id: 'baseline',
    label: 'First baseline',
    hint: 'Record a comparable measurement before considering a fix',
    content: createElement(BaselinePanel),
  },
  {
    id: 'target',
    label: 'User target',
    hint: 'Choose a target with a reason',
    content: createElement(TargetsPanel),
  },
  {
    id: 'bottleneck',
    label: 'Find the bottleneck',
    hint: 'Read the controlled evidence without inventing a field result',
    content: createElement(BottleneckPanel),
  },
  {
    id: 'query',
    label: 'Read the plan',
    hint: 'Investigate the query and workload before adding an index',
    content: createElement(QueryPanel),
  },
  {
    id: 'fixes',
    label: 'Candidate fixes',
    hint: 'Open the evidence, cost and retest for a candidate',
    content: createElement(FixesPanel),
  },
  {
    id: 'compare',
    label: 'Compare outcomes',
    hint: 'Retest the same user clock and correctness',
    content: createElement(ComparePanel),
  },
  {
    id: 'record',
    label: 'Your baseline',
    hint: 'Save your own measurement definition and evidence',
    content: createElement(RecordPanel),
  },
  {
    id: 'followup',
    label: 'Your follow-up',
    hint: 'Record the change, comparison and remaining gap',
    content: createElement(FollowupPanel),
  },
  {
    id: 'ai',
    label: 'AI plays',
    hint: 'Draft hypotheses and verify them against raw evidence',
    content: createElement(AIPanel),
  },
  {
    id: 'done',
    label: 'Done',
    hint: 'Close with evidence or record the unresolved gap',
    content: createElement(DonePanel),
  },
  {
    id: 'traps',
    label: 'Traps',
    hint: 'Recognize claims the measurements cannot support',
    content: createElement(TrapsPanel),
  },
]
