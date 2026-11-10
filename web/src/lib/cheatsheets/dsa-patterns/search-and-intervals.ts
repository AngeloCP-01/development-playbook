import type { Section, SheetActivity } from '../types'

export const searchAndIntervals: {
  sections: Section[]
  activities: SheetActivity[]
} = {
  sections: [
    {
      title: 'Search and intervals',
      study: {
        id: 'search-and-intervals',
        label: 'Search and intervals',
        hint: 'Trace the state, then defend the next step',
      },
      introduction: [
        {
          id: 'search-and-intervals-intro',
          kind: 'paragraph',
          text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
        },
      ],
      rows: [
        {
          term: 'Binary search',
          what: 'Return the first index whose value is at least target, or array length; input is ascending.',
          study: {
            id: 'binary-search',
            summary:
              'Find the first shelf label at least your number by repeatedly checking the middle.',
            activityIds: ['binary-search-practice'],
          },
          teaching: [
            {
              id: 'binary-search-story',
              kind: 'paragraph',
              text: 'Find the first shelf label at least your number by repeatedly checking the middle. Return the first index whose value is at least target, or array length; input is ascending.',
            },
            {
              id: 'binary-search-baseline',
              kind: 'paragraph',
              text: 'A linear scan works, but sorted comparisons can discard half the remaining region.',
            },
            {
              id: 'binary-search-trace',
              kind: 'table',
              label: 'Binary search trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['[2, 4, 4, 9], target 4', '[0, 4), mid 2', 'Keep [0, 2)'],
                ['mid 1', '4 is large enough', 'Keep [0, 1)'],
                ['mid 0', '2 is too small', 'Return 1'],
              ],
            },
            {
              id: 'binary-search-solution',
              kind: 'code',
              label: 'Binary search — JavaScript',
              code: 'function lowerBound(sorted, target) {\n  let low = 0, high = sorted.length;\n  while (low < high) {\n    const mid = low + Math.floor((high - low) / 2);\n    if (sorted[mid] < target) low = mid + 1;\n    else high = mid;\n  }\n  return low;\n}',
            },
            {
              id: 'binary-search-proof',
              kind: 'paragraph',
              text: 'Indices before low are too small; indices at or beyond high are large enough. Each comparison preserves these claims and shrinks [low, high). Nonmonotone predicates break elimination. Answer search transfers this to first feasible production time; Factory Machines bounds may need BigInt.',
            },
            {
              id: 'binary-search-cost',
              kind: 'paragraph',
              text: 'O(log(n + 1)) time, O(1) extra space. Sorting first is additional work.',
            },
            {
              id: 'binary-search-interview',
              kind: 'interview',
              question: 'Why keep mid on equality?',
              answer:
                'An earlier equal value may exist. Setting high to mid keeps that candidate boundary.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Interval sweep',
          what: 'Return peak guests for visits [start, end), start < end.',
          study: {
            id: 'interval-sweep',
            summary:
              'Count people at a party by sorting door events rather than inspecting every minute.',
            activityIds: ['interval-sweep-practice'],
          },
          teaching: [
            {
              id: 'interval-sweep-story',
              kind: 'paragraph',
              text: 'Count people at a party by sorting door events rather than inspecting every minute. Return peak guests for visits [start, end), start < end.',
            },
            {
              id: 'interval-sweep-baseline',
              kind: 'paragraph',
              text: 'Testing every pair of times repeats occupancy work; process changes only.',
            },
            {
              id: 'interval-sweep-trace',
              kind: 'table',
              label: 'Interval sweep trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['Visits [1, 3), [3, 5)', '+1 at 1', 'active 1'],
                ['Time 3', '-1 then +1', 'peak remains 1'],
              ],
            },
            {
              id: 'interval-sweep-solution',
              kind: 'code',
              label: 'Interval sweep — JavaScript',
              code: 'function peakGuests(visits) {\n  const events = [];\n  for (const [start, end] of visits) {\n    events.push([start, 1], [end, -1]);\n  }\n  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);\n  let active = 0, best = 0;\n  for (const [, delta] of events) {\n    active += delta;\n    best = Math.max(best, active);\n  }\n  return best;\n}',
            },
            {
              id: 'interval-sweep-proof',
              kind: 'paragraph',
              text: 'Between events occupancy is unchanged. Departures precede arrivals on ties because the ending guest is absent at end. Closed endpoints need a different tie rule. Merging computes union; selection chooses compatible visits; neither gives peak occupancy.',
            },
            {
              id: 'interval-sweep-cost',
              kind: 'paragraph',
              text: 'O(n log n) comparison-sort time, O(n) event storage plus implementation-dependent sort workspace; visits are untouched.',
            },
            {
              id: 'interval-sweep-interview',
              kind: 'interview',
              question: 'Why do departures win ties?',
              answer:
                'Half-open visits do not overlap solely by touching endpoints.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
      ],
    },
  ],
  activities: [
    {
      id: 'binary-search-practice',
      title: 'Binary search practice',
      prompt: 'Evaluate lowerBound([2, 4, 4, 9], 4) and lowerBound([], 4).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1620',
      answer: '1 and 0.',
      explanation:
        'An earlier equal value may exist. Setting high to mid keeps that candidate boundary. Indices before low are too small; indices at or beyond high are large enough. Each comparison preserves these claims and shrinks [low, high). Nonmonotone predicates break elimination. Answer search transfers this to first feasible production time; Factory Machines bounds may need BigInt.',
    },
    {
      id: 'interval-sweep-practice',
      title: 'Interval sweep practice',
      prompt: 'Evaluate peakGuests([[1, 4], [2, 3], [4, 5]]).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1619',
      answer: '2. At time 4 the first guest has left.',
      explanation:
        'Half-open visits do not overlap solely by touching endpoints. Between events occupancy is unchanged. Departures precede arrivals on ties because the ending guest is absent at end. Closed endpoints need a different tie rule. Merging computes union; selection chooses compatible visits; neither gives peak occupancy.',
    },
  ],
}
