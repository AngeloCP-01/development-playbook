import type { Section, SheetActivity } from '../types'

export const greedy: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Defend a choice',
      study: {
        id: 'defend-a-choice',
        label: 'Defend a choice',
        hint: 'Trace the state, then defend the next step',
      },
      introduction: [
        {
          id: 'defend-a-choice-intro',
          kind: 'paragraph',
          text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
        },
      ],
      rows: [
        {
          term: 'Greedy selection',
          what: 'Maximize the count of positive-duration, half-open, unweighted intervals.',
          study: {
            id: 'greedy',
            summary:
              'Pick a meeting that finishes soonest so the room is free for later meetings.',
            activityIds: ['greedy-practice'],
          },
          teaching: [
            {
              id: 'greedy-story',
              kind: 'paragraph',
              text: 'Pick a meeting that finishes soonest so the room is free for later meetings. Maximize the count of positive-duration, half-open, unweighted intervals.',
            },
            {
              id: 'greedy-baseline',
              kind: 'paragraph',
              text: 'Trying every subset is exponential. A safe exchange allows one permanent choice at a time.',
            },
            {
              id: 'greedy-trace',
              kind: 'table',
              label: 'Greedy selection trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['[0, 3), [1, 2), [2, 4)', 'choose [1, 2)', 'Earliest finish'],
                ['Next compatible', 'choose [2, 4)', 'Count 2'],
              ],
            },
            {
              id: 'greedy-solution',
              kind: 'code',
              label: 'Greedy selection — JavaScript',
              code: 'function maxCompatible(intervals) {\n  const sorted = intervals.map(pair => [...pair]).sort((a, b) => a[1] - b[1]);\n  let finish = -Infinity, count = 0;\n  for (const [start, end] of sorted) if (start >= finish) {\n    count++;\n    finish = end;\n  }\n  return count;\n}',
            },
            {
              id: 'greedy-proof',
              kind: 'paragraph',
              text: 'Exchange the first meeting in an optimum for the earliest-finishing meeting. It ends no later, so every later meeting still fits. Repeat on the remaining compatible meetings. Rewards break this proof: [0, 2) worth 1 and [0, 3) worth 100 favor the longer meeting. Arbitrary coin change also lacks this exchange.',
            },
            {
              id: 'greedy-cost',
              kind: 'paragraph',
              text: 'O(n log n) comparison-sort time and O(n) explicit copy storage plus implementation-dependent sort workspace; the scan is O(n). Equal endpoints are compatible.',
            },
            {
              id: 'greedy-interview',
              kind: 'interview',
              question: 'Why earliest finish instead of earliest start?',
              answer:
                'An early start can occupy the room for a long time. Finishing early leaves at least as much room as the first choice in any optimum.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Mixed choice',
          what: 'Choose a mechanism from constraints.',
          study: {
            id: 'mixed-choice',
            summary:
              'A receipt includes refunds. Count contiguous groups with a specified total.',
            activityIds: ['mixed-choice-practice'],
          },
          teaching: [
            {
              id: 'mixed-reason',
              kind: 'paragraph',
              text: 'Choose from the task, not from a familiar loop. Ask whether order, a contiguous range, or repeated subproblems matter. State what information you would keep and why a discarded candidate could never help later.',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'greedy-practice',
      title: 'Greedy selection practice',
      prompt: 'Evaluate maxCompatible([[0, 3], [1, 2], [2, 4]]).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1629',
      answer: '2, choosing [1, 2) and [2, 4).',
      explanation:
        'An early start can occupy the room for a long time. Finishing early leaves at least as much room as the first choice in any optimum. Exchange the first meeting in an optimum for the earliest-finishing meeting. It ends no later, so every later meeting still fits. Repeat on the remaining compatible meetings. Rewards break this proof: [0, 2) worth 1 and [0, 3) worth 100 favor the longer meeting. Arbitrary coin change also lacks this exchange.',
    },
    {
      id: 'mixed-choice-practice',
      title: 'Mixed choice practice',
      prompt:
        'Receipts [4, -3, 2] include refunds. Count contiguous groups totaling 3. Choose a mechanism and explain why discarding 4 immediately is unsafe.',
      context: 'Original exercise; decide before revealing.',
      answer:
        'One group: the whole array. Use prefix frequencies for exact signed-sum counting.',
      explanation:
        'The later refund makes the initial 4 part of a valid total. Positive-sum shrinking would lose it. Seed zero and query earlier prefixes before adding the current one.',
    },
  ],
}
