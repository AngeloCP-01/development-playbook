import type { Section, SheetActivity } from '../types'

export const candidates: { sections: Section[]; activities: SheetActivity[] } =
  {
    sections: [
      {
        title: 'Useful candidates',
        study: {
          id: 'useful-candidates',
          label: 'Useful candidates',
          hint: 'Trace the state, then defend the next step',
        },
        introduction: [
          {
            id: 'useful-candidates-intro',
            kind: 'paragraph',
            text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
          },
        ],
        rows: [
          {
            term: 'Monotonic stack',
            what: 'Return the nearest strictly smaller earlier index, or -1.',
            study: {
              id: 'monotonic-stack',
              summary:
                'Keep possible shorter fences in a pile; a new short fence hides taller ones forever.',
              activityIds: ['monotonic-stack-practice'],
            },
            teaching: [
              {
                id: 'monotonic-stack-story',
                kind: 'paragraph',
                text: 'Keep possible shorter fences in a pile; a new short fence hides taller ones forever. Return the nearest strictly smaller earlier index, or -1.',
              },
              {
                id: 'monotonic-stack-baseline',
                kind: 'paragraph',
                text: 'Scanning backward from every item costs O(n²). Retain useful candidates in increasing height order.',
              },
              {
                id: 'monotonic-stack-trace',
                kind: 'table',
                label: 'Monotonic stack trace',
                columns: ['Moment', 'State', 'Meaning'],
                rows: [
                  ['[2, 2, 1] at index 0', 'stack [0]', 'answer -1'],
                  ['At index 1', 'pop equal 2; stack [1]', 'answer -1'],
                  ['At index 2', 'pop 2; stack [2]', 'answer -1'],
                ],
              },
              {
                id: 'monotonic-stack-solution',
                kind: 'code',
                label: 'Monotonic stack — JavaScript',
                code: 'function previousSmaller(values) {\n  const stack = [], answer = [];\n  for (let i = 0; i < values.length; i++) {\n    while (stack.length && values[stack[stack.length - 1]] >= values[i]) stack.pop();\n    answer.push(stack.length ? stack[stack.length - 1] : -1);\n    stack.push(i);\n  }\n  return answer;\n}',
              },
              {
                id: 'monotonic-stack-proof',
                kind: 'paragraph',
                text: 'A popped item is no smaller than this newer item, so it can never be the nearest smaller candidate for a future item. Equal heights must be removed for strict comparison. Changing the query changes the removal rule. CSES uses one-based positions and 0 for absent; this lesson uses zero-based and -1.',
              },
              {
                id: 'monotonic-stack-cost',
                kind: 'paragraph',
                text: 'O(n) amortized time because each index is pushed once and popped at most once. O(n) working stack and O(n) required output.',
              },
              {
                id: 'monotonic-stack-interview',
                kind: 'interview',
                question: 'How can a while loop per item be linear?',
                answer:
                  'Count pushes and pops over the whole run rather than charging n pops to every item.',
                followUp:
                  'Which input assumption does your argument need? Give a counterexample when it is removed.',
              },
            ],
          },
          {
            term: 'Top-k heap',
            what: 'Return the kth largest occurrence, counting duplicates; invalid k returns null.',
            study: {
              id: 'top-k-heap',
              summary:
                'Keep the k largest contest scores in a basket with its smallest score at the handle.',
              activityIds: ['top-k-heap-practice'],
            },
            teaching: [
              {
                id: 'top-k-heap-story',
                kind: 'paragraph',
                text: 'Keep the k largest contest scores in a basket with its smallest score at the handle. Return the kth largest occurrence, counting duplicates; invalid k returns null.',
              },
              {
                id: 'top-k-heap-baseline',
                kind: 'paragraph',
                text: 'Sorting a copy costs O(n log n); a min-heap retains only k candidates.',
              },
              {
                id: 'top-k-heap-trace',
                kind: 'table',
                label: 'Top-k heap trace',
                columns: ['Moment', 'State', 'Meaning'],
                rows: [
                  ['[5, 2, 5], k 2', 'retain 5, 2', 'root 2'],
                  ['Insert last 5', 'remove 2', 'root 5 is rank 2'],
                ],
              },
              {
                id: 'top-k-heap-solution',
                kind: 'code',
                label: 'Top-k heap — JavaScript',
                code: 'class MinHeap {\n  constructor() { this.items = []; }\n  push(x) {\n    const a = this.items;\n    a.push(x);\n    let i = a.length - 1;\n    while (i > 0) {\n      const p = Math.floor((i - 1) / 2);\n      if (a[p] <= a[i]) break;\n      [a[p], a[i]] = [a[i], a[p]];\n      i = p;\n    }\n  }\n  pop() {\n    const a = this.items, first = a[0], last = a.pop();\n    if (a.length) {\n      a[0] = last;\n      let i = 0;\n      while (2 * i + 1 < a.length) {\n        let child = 2 * i + 1;\n        if (child + 1 < a.length && a[child + 1] < a[child]) child++;\n        if (a[i] <= a[child]) break;\n        [a[i], a[child]] = [a[child], a[i]];\n        i = child;\n      }\n    }\n    return first;\n  }\n}\nfunction kthLargest(values, k) {\n  if (!Number.isInteger(k) || k < 1 || k > values.length) return null;\n  const heap = new MinHeap();\n  for (const x of values) {\n    heap.push(x);\n    if (heap.items.length > k) heap.pop();\n  }\n  return heap.items[0];\n}',
              },
              {
                id: 'top-k-heap-proof',
                kind: 'paragraph',
                text: 'The helper stores a binary tree in an array: children are 2i+1 and 2i+2. push bubbles upward; pop replaces the root and sinks it toward the smaller child. The root is always smallest. Removing it when capacity is exceeded leaves exactly the k largest occurrences seen. This does not retain original rank positions.',
              },
              {
                id: 'top-k-heap-cost',
                kind: 'paragraph',
                text: 'O(n log(k + 1)) time, O(k) extra storage, including the helper. Each update crosses at most the logarithmic heap height; caller input is preserved.',
              },
              {
                id: 'top-k-heap-interview',
                kind: 'interview',
                question: 'Why a min-heap for largest scores?',
                answer:
                  'Its minimum is the weakest retained candidate and the next one to discard.',
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
        id: 'monotonic-stack-practice',
        title: 'Monotonic stack practice',
        prompt: 'Evaluate previousSmaller([3, 1, 2, 2]).',
        context:
          'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1645',
        answer: '[-1, -1, 1, 1].',
        explanation:
          'Count pushes and pops over the whole run rather than charging n pops to every item. A popped item is no smaller than this newer item, so it can never be the nearest smaller candidate for a future item. Equal heights must be removed for strict comparison. Changing the query changes the removal rule. CSES uses one-based positions and 0 for absent; this lesson uses zero-based and -1.',
      },
      {
        id: 'top-k-heap-practice',
        title: 'Top-k heap practice',
        prompt: 'Evaluate kthLargest([5, 2, 5], 2) and kthLargest([5], 0).',
        context:
          'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://leetcode.com/problems/kth-largest-element-in-an-array/',
        answer: '5 and null.',
        explanation:
          'Its minimum is the weakest retained candidate and the next one to discard. The helper stores a binary tree in an array: children are 2i+1 and 2i+2. push bubbles upward; pop replaces the root and sinks it toward the smaller child. The root is always smallest. Removing it when capacity is exceeded leaves exactly the k largest occurrences seen. This does not retain original rank positions.',
      },
    ],
  }
