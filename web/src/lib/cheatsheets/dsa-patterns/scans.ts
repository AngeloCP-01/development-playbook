import type { Section, SheetActivity } from '../types'

export const scans: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Scan and remember',
      study: {
        id: 'scan-and-remember',
        label: 'Scan and remember',
        hint: 'Trace the state, then defend the next step',
      },
      introduction: [
        {
          id: 'scan-and-remember-intro',
          kind: 'paragraph',
          text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
        },
      ],
      rows: [
        {
          term: 'Hash complements',
          what: 'Return distinct original positions adding to a target; signed integers and duplicates are allowed.',
          study: {
            id: 'hash-complements',
            summary:
              'Match two grocery prices to a budget by remembering prices already checked.',
            activityIds: ['hash-complements-practice'],
          },
          teaching: [
            {
              id: 'hash-complements-story',
              kind: 'paragraph',
              text: 'Match two grocery prices to a budget by remembering prices already checked. Return distinct original positions adding to a target; signed integers and duplicates are allowed.',
            },
            {
              id: 'hash-complements-baseline',
              kind: 'paragraph',
              text: 'Trying every pair costs O(n²). A Map holds one earlier position for each price.',
            },
            {
              id: 'hash-complements-trace',
              kind: 'table',
              label: 'Hash complements trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['Read 3', '{ }', 'Need 6 for target 9'],
                ['Read 6', '3 → 0', 'Return [0, 1]'],
              ],
            },
            {
              id: 'hash-complements-solution',
              kind: 'code',
              label: 'Hash complements — JavaScript',
              code: 'function findPair(values, target) {\n  const seen = new Map();\n  for (let i = 0; i < values.length; i++) {\n    const need = target - values[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(values[i], i);\n  }\n  return null;\n}',
            },
            {
              id: 'hash-complements-proof',
              kind: 'paragraph',
              text: 'The map contains only earlier positions, so a match uses two different items. If no earlier complement exists, storing this item makes it available to later ones. Ordered range queries need another structure.',
            },
            {
              id: 'hash-complements-cost',
              kind: 'paragraph',
              text: 'Expected O(n) time and O(n) extra map storage under the hash model; the returned pair uses O(1).',
            },
            {
              id: 'hash-complements-interview',
              kind: 'interview',
              question: 'Why query before insertion?',
              answer:
                'Inserting first could let one item match itself. Two equal prices still work when the earlier occurrence is stored.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Two pointers',
          what: 'Find a pair in an already ascending array. Return positions or null.',
          study: {
            id: 'two-pointers',
            summary:
              'Two shoppers stand at opposite ends of an ordered price shelf.',
            activityIds: ['two-pointers-practice'],
          },
          teaching: [
            {
              id: 'two-pointers-story',
              kind: 'paragraph',
              text: 'Two shoppers stand at opposite ends of an ordered price shelf. Find a pair in an already ascending array. Return positions or null.',
            },
            {
              id: 'two-pointers-baseline',
              kind: 'paragraph',
              text: 'Trying every pair repeats work; ordering lets a failed comparison eliminate an entire end.',
            },
            {
              id: 'two-pointers-trace',
              kind: 'table',
              label: 'Two pointers trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['[1, 3, 6], target 7', 'left 0, right 2', '1 + 6 = 7'],
                ['[1, 3, 6], target 8', 'left 0 → 1', '7 is too small'],
                ['Next comparison', '3 + 6 = 9', 'Move right; boundaries meet'],
              ],
            },
            {
              id: 'two-pointers-solution',
              kind: 'code',
              label: 'Two pointers — JavaScript',
              code: 'function findSortedPair(values, target) {\n  let left = 0, right = values.length - 1;\n  while (left < right) {\n    const sum = values[left] + values[right];\n    if (sum === target) return [left, right];\n    if (sum < target) left++;\n    else right--;\n  }\n  return null;\n}',
            },
            {
              id: 'two-pointers-proof',
              kind: 'paragraph',
              text: 'If the largest partner is too small with the left item, every other partner is too small too. The symmetric argument removes the right item when the sum is too large. Unsorted input breaks this proof.',
            },
            {
              id: 'two-pointers-cost',
              kind: 'paragraph',
              text: 'O(n) scan time, O(1) auxiliary storage. Sorting unsorted input adds comparison-sort work O(n log n); copy value/index pairs in O(n) space to preserve original positions. Sort workspace is implementation-dependent.',
            },
            {
              id: 'two-pointers-interview',
              kind: 'interview',
              question: 'Why is advancing left safe?',
              answer:
                'Every remaining partner is no larger than the right item, so none can rescue the current left item when their sum is too small.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Sliding window',
          what: 'Return the longest contiguous segment of distinct values, including 0 for empty input.',
          study: {
            id: 'sliding-window',
            summary:
              'Keep a row of songs on a tray, removing from the front until no song repeats.',
            activityIds: ['sliding-window-practice'],
          },
          teaching: [
            {
              id: 'sliding-window-story',
              kind: 'paragraph',
              text: 'Keep a row of songs on a tray, removing from the front until no song repeats. Return the longest contiguous segment of distinct values, including 0 for empty input.',
            },
            {
              id: 'sliding-window-baseline',
              kind: 'paragraph',
              text: 'Restarting a set at each start can cost O(n²). Maintain the current tray instead.',
            },
            {
              id: 'sliding-window-trace',
              kind: 'table',
              label: 'Sliding window trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['Add A', '[A]', 'best 1'],
                ['Add B', '[A, B]', 'best 2'],
                ['Add A', '[B, A]', 'Remove first A; best 2'],
              ],
            },
            {
              id: 'sliding-window-solution',
              kind: 'code',
              label: 'Sliding window — JavaScript',
              code: 'function longestDistinct(values) {\n  const counts = new Map();\n  let left = 0, best = 0;\n  for (let right = 0; right < values.length; right++) {\n    const x = values[right];\n    counts.set(x, (counts.get(x) ?? 0) + 1);\n    while (counts.get(x) > 1) {\n      const y = values[left++];\n      const count = counts.get(y) - 1;\n      if (count === 0) counts.delete(y);\n      else counts.set(y, count);\n    }\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
            },
            {
              id: 'sliding-window-proof',
              kind: 'paragraph',
              text: 'Only the newly added value can repeat; removing from the left repairs that duplicate and preserves contiguity. Fixed windows remove exactly one item per shift. Sum-based shrinking needs a separate proof: [4, -3, 2] with sum limit 3 loses the valid whole range if 4 is discarded immediately.',
            },
            {
              id: 'sliding-window-cost',
              kind: 'paragraph',
              text: 'Expected O(n) time: each item enters and leaves at most once, despite nested loops. O(d) active distinct values; deleting zero counts matters.',
            },
            {
              id: 'sliding-window-interview',
              kind: 'interview',
              question: 'Why is the shrink loop not quadratic?',
              answer:
                'The left boundary never restarts. Its total movement across the entire run is at most n.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Prefix sums',
          what: 'Build totals before each position and query zero-based half-open ranges [start, end). Also count exact-sum ranges with signed values.',
          study: {
            id: 'prefix-sums',
            summary:
              'Keep a running receipt total; subtract two totals to price the items between them.',
            activityIds: ['prefix-sums-practice'],
          },
          teaching: [
            {
              id: 'prefix-sums-story',
              kind: 'paragraph',
              text: 'Keep a running receipt total; subtract two totals to price the items between them. Build totals before each position and query zero-based half-open ranges [start, end). Also count exact-sum ranges with signed values.',
            },
            {
              id: 'prefix-sums-baseline',
              kind: 'paragraph',
              text: 'Adding each queried range costs its length; saved totals reuse that work.',
            },
            {
              id: 'prefix-sums-trace',
              kind: 'table',
              label: 'Prefix sums trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                [
                  'Input [2, -1, 3]',
                  'prefix [0, 2, 1, 4]',
                  'Initial zero represents no items',
                ],
                ['Query [1, 3)', '4 - 2 = 2', 'Includes -1 and 3'],
                [
                  'Count target 0 in [0, 0]',
                  '1 + 2 matches',
                  'Three nonempty ranges',
                ],
              ],
            },
            {
              id: 'prefix-sums-solution',
              kind: 'code',
              label: 'Prefix sums — JavaScript',
              code: 'function buildPrefix(values) {\n  const prefix = [0];\n  for (const x of values) prefix.push(prefix[prefix.length - 1] + x);\n  return prefix;\n}\nfunction rangeSum(prefix, start, end) {\n  return prefix[end] - prefix[start];\n}\nfunction countTargetRanges(values, target) {\n  const counts = new Map([[0, 1]]);\n  let sum = 0, answer = 0;\n  for (const x of values) {\n    sum += x;\n    answer += counts.get(sum - target) ?? 0;\n    counts.set(sum, (counts.get(sum) ?? 0) + 1);\n  }\n  return answer;\n}',
            },
            {
              id: 'prefix-sums-proof',
              kind: 'paragraph',
              text: 'Subtracting removes exactly the earlier items. A range sums to target when its earlier prefix equals current minus target. Query before inserting to exclude an empty range; frequencies count different starts. Updates invalidate later totals, and subtraction cannot recover range minima.',
            },
            {
              id: 'prefix-sums-cost',
              kind: 'paragraph',
              text: 'O(n) build time/space and O(1) per range query. Exact-sum counting takes expected O(n) time and O(n) space with hashing. Assume all totals, differences and counts stay safe integers.',
            },
            {
              id: 'prefix-sums-interview',
              kind: 'interview',
              question: 'Why seed the frequency of zero?',
              answer:
                'It counts ranges starting at index zero, using the same difference rule as all other ranges.',
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
      id: 'hash-complements-practice',
      title: 'Hash complements practice',
      prompt: 'Evaluate findPair([4, 4], 8) and findPair([4], 8).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1640',
      answer: '[0, 1] and null.',
      explanation:
        'Inserting first could let one item match itself. Two equal prices still work when the earlier occurrence is stored. The map contains only earlier positions, so a match uses two different items. If no earlier complement exists, storing this item makes it available to later ones. Ordered range queries need another structure.',
    },
    {
      id: 'two-pointers-practice',
      title: 'Two pointers practice',
      prompt: 'Evaluate findSortedPair([-2, 0, 3, 5], 3).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1084',
      answer: '[0, 3] is returned; [1, 2] would also be a valid pair.',
      explanation:
        'Every remaining partner is no larger than the right item, so none can rescue the current left item when their sum is too small. If the largest partner is too small with the left item, every other partner is too small too. The symmetric argument removes the right item when the sum is too large. Unsorted input breaks this proof.',
    },
    {
      id: 'sliding-window-practice',
      title: 'Sliding window practice',
      prompt: 'Evaluate longestDistinct([1, 2, 1, 3]) and longestDistinct([]).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1141',
      answer: '3 and 0. The best segment is [2, 1, 3].',
      explanation:
        'The left boundary never restarts. Its total movement across the entire run is at most n. Only the newly added value can repeat; removing from the left repairs that duplicate and preserves contiguity. Fixed windows remove exactly one item per shift. Sum-based shrinking needs a separate proof: [4, -3, 2] with sum limit 3 loses the valid whole range if 4 is discarded immediately.',
    },
    {
      id: 'prefix-sums-practice',
      title: 'Prefix sums practice',
      prompt: 'Count target-zero ranges in [1, -1, 0].',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1646',
      answer: '3: [1, -1], [0], and [1, -1, 0].',
      explanation:
        'It counts ranges starting at index zero, using the same difference rule as all other ranges. Subtracting removes exactly the earlier items. A range sums to target when its earlier prefix equals current minus target. Query before inserting to exclude an empty range; frequencies count different starts. Updates invalidate later totals, and subtraction cannot recover range minima.',
    },
  ],
}
