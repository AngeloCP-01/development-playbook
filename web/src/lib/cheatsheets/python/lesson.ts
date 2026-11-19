import type { Row, Section, SheetActivity, TeachingBlock } from '../types'

// Authored data composition only; code remains literal in each family.
export type Lesson = {
  id: string
  title: string
  summary: string
  model: string
  code: string
  filename?: string
  trace: { label: string; columns: string[]; rows: string[][] }
  contrast: string
  question: string
  answer: string
  practice: {
    title: string
    prompt: string
    answer: string
    explanation: string
    starter?: string
    solution?: string
    followUp?: string
  }
  extra?: TeachingBlock[]
}
export function family(
  id: string,
  title: string,
  orientation: string,
  lessons: Lesson[],
): { sections: Section[]; activities: SheetActivity[] } {
  return {
    sections: [
      {
        title,
        study: {
          id,
          label: title,
          hint: 'Trace the program, change one condition, then explain or repair it.',
        },
        introduction: [
          { id: id + '-orientation', kind: 'paragraph', text: orientation },
        ],
        rows: lessons.map((l): Row => ({
          term: l.title,
          what: l.summary,
          study: {
            id: l.id,
            summary: l.summary,
            activityIds: [l.id + '-practice'],
          },
          teaching: [
            { id: l.id + '-model', kind: 'paragraph', text: l.model },
            {
              id: l.id + '-example',
              kind: 'code',
              label:
                l.filename ?? l.id + '.py — run with python3 (CPython 3.12+)',
              code: l.code,
            },
            { id: l.id + '-trace', kind: 'table', ...l.trace },
            ...(l.extra ?? []),
            { id: l.id + '-contrast', kind: 'paragraph', text: l.contrast },
            {
              id: l.id + '-interview',
              kind: 'interview',
              question: l.question,
              answer: l.answer,
            },
          ],
        })),
      },
    ],
    activities: lessons.map((l) => ({
      id: l.id + '-practice',
      title: l.practice.title,
      prompt: l.practice.prompt,
      context:
        'Use the displayed Python files and stated input. Make your attempt before revealing the reference answer.',
      answer: l.practice.answer,
      explanation: l.practice.explanation,
      ...(l.practice.starter
        ? {
            starter: {
              label: 'Incomplete interface — implement the TODO',
              code: l.practice.starter,
            },
          }
        : {}),
      ...(l.practice.solution
        ? {
            solution: {
              label: l.id + '-repair.py — executable reference solution',
              code: l.practice.solution,
            },
          }
        : {}),
      followUp: l.practice.followUp,
    })),
  }
}
