import type { Section, SheetActivity } from '../types'

export const foundations: { sections: Section[]; activities: SheetActivity[] } =
  {
    sections: [
      {
        title: 'Foundations',
        study: {
          id: 'foundations',
          label: 'Foundations',
          hint: 'Trace the state, then defend the next step',
        },
        introduction: [
          {
            id: 'foundations-intro',
            kind: 'paragraph',
            text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
          },
        ],
        rows: [
          {
            term: 'Count work and room',
            what: 'Describe growth rather than guessing elapsed seconds.',
            study: {
              id: 'costs',
              summary:
                'Compare checking every pair of socks with checking each sock once.',
              activityIds: ['costs-practice'],
            },
            teaching: [
              {
                id: 'costs-story',
                kind: 'paragraph',
                text: 'Compare checking every pair of socks with checking each sock once. Describe growth rather than guessing elapsed seconds.',
              },
              {
                id: 'costs-baseline',
                kind: 'paragraph',
                text: 'For n items a scan makes n visits; all unordered pairs make n(n-1)/2 comparisons.',
              },
              {
                id: 'costs-trace',
                kind: 'table',
                label: 'Count work and room trace',
                columns: ['Moment', 'State', 'Meaning'],
                rows: [
                  ['n = 4', 'scan 4; pairs 6', 'Small inputs hide growth'],
                  ['n = 8', 'scan 8; pairs 28', 'Pair work grows faster'],
                ],
              },
              {
                id: 'costs-solution',
                kind: 'code',
                label: 'Count work and room — JavaScript',
                code: '// A single scan: n additions, one running total.\nfunction total(values) {\n  let sum = 0;\n  for (const x of values) sum += x;\n  return sum;\n}',
              },
              {
                id: 'costs-proof',
                kind: 'paragraph',
                text: 'O is an upper growth bound; Θ gives matching upper/lower growth. Expected cost averages over the stated randomness/model; amortized cost spreads work over a sequence. Neither promises a fast individual operation.',
              },
              {
                id: 'costs-cost',
                kind: 'paragraph',
                text: 'Use fixed-cost indexed access, comparison and arithmetic here. Numbers and intermediate sums/counts must remain finite safe integers. Hash claims assume expected constant-time operations; JavaScript Map does not guarantee that bound. Sorting claims use a comparison-sort model, not a language guarantee. Count copies, recursion and required output separately.',
              },
              {
                id: 'costs-interview',
                kind: 'interview',
                question: 'Does a nested loop always mean quadratic?',
                answer:
                  'No. Count total work; a moving boundary or stack may make only n removals across all iterations.',
                followUp:
                  'Which input assumption does your argument need? Give a counterexample when it is removed.',
              },
            ],
          },
          {
            term: 'Choose a container',
            what: 'Arrays index boxes; Maps associate keys with values; stacks take the newest; queues take the oldest.',
            study: {
              id: 'tools',
              summary:
                'Use a row of labelled boxes, a lookup notebook, a plate stack or a waiting line depending on what comes next.',
              activityIds: ['tools-practice'],
            },
            teaching: [
              {
                id: 'tools-story',
                kind: 'paragraph',
                text: 'Use a row of labelled boxes, a lookup notebook, a plate stack or a waiting line depending on what comes next. Arrays index boxes; Maps associate keys with values; stacks take the newest; queues take the oldest.',
              },
              {
                id: 'tools-baseline',
                kind: 'paragraph',
                text: 'Searching a notebook page by page repeats work; indexed and keyed access organize it.',
              },
              {
                id: 'tools-trace',
                kind: 'table',
                label: 'Choose a container trace',
                columns: ['Moment', 'State', 'Meaning'],
                rows: [
                  ['Array', 'values[0]', 'First indexed slot'],
                  ['Stack', 'push then pop', 'Last in, first out'],
                  ['Queue', 'append, advance head', 'First in, first out'],
                ],
              },
              {
                id: 'tools-solution',
                kind: 'code',
                label: 'Choose a container — JavaScript',
                code: 'const leaf = { value: 2, left: null, right: null };\nconst root = { value: 1, left: leaf, right: null };\nconst end = { value: 2, next: null };\nconst head = { value: 1, next: end };\nconst adj = [[1], [0], []];\nconst sorted = [3, 1, 2].slice().sort((a, b) => a - b);',
              },
              {
                id: 'tools-proof',
                kind: 'paragraph',
                text: 'Objects are connected by references: two variables can point at the same node. Recursion pauses one call while child calls run; each paused call consumes storage. Sorting changes positions, so carry original indices when they matter. The shown tree has no sharing or cycles.',
              },
              {
                id: 'tools-cost',
                kind: 'paragraph',
                text: 'A copied array costs O(n) storage. Stack/queue storage depends on how many pending items remain; a head-index queue retains its visited prefix until discarded. Sort workspace depends on the engine.',
              },
              {
                id: 'tools-interview',
                kind: 'interview',
                question: 'Why avoid shift for a BFS queue?',
                answer:
                  'A head index avoids repeated removal from the front and supports the linear traversal model.',
                followUp:
                  'Which input assumption does your argument need? Give a counterexample when it is removed.',
              },
            ],
          },
          {
            term: 'Explain a solution',
            what: 'Clarify, trace, justify, test.',
            study: {
              id: 'explain-a-solution',
              summary:
                'Walk an interviewer through a small example before writing loops.',
              activityIds: [],
            },
            teaching: [
              {
                id: 'explain-process',
                kind: 'paragraph',
                text: 'Restate the contract: valid input, returned output, mutation and endpoints. Give a simple baseline, choose a mechanism and name its state. Trace a tiny example, justify the safe step, derive work and room, then test empty input, duplicates and a boundary. Explain what breaks if an assumption changes. Local questions are original practice, not claims about employer question frequency.',
              },
            ],
          },
        ],
      },
    ],
    activities: [
      {
        id: 'costs-practice',
        title: 'Count work and room practice',
        prompt: 'Compare a scan and all unordered pairs for n = 10.',
        context:
          'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://usaco.guide/bronze/time-comp',
        answer: '10 visits versus 45 pairs.',
        explanation:
          'No. Count total work; a moving boundary or stack may make only n removals across all iterations. O is an upper growth bound; Θ gives matching upper/lower growth. Expected cost averages over the stated randomness/model; amortized cost spreads work over a sequence. Neither promises a fast individual operation.',
      },
      {
        id: 'tools-practice',
        title: 'Choose a container practice',
        prompt:
          'In adj [[1], [0], []], which vertex is isolated? Are two {value: 2} objects identical?',
        context:
          'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://usaco.guide/silver/intro-tree',
        answer:
          'Vertex 2 is isolated. Separately created objects have different identities.',
        explanation:
          'A head index avoids repeated removal from the front and supports the linear traversal model. Objects are connected by references: two variables can point at the same node. Recursion pauses one call while child calls run; each paused call consumes storage. Sorting changes positions, so carry original indices when they matter. The shown tree has no sharing or cycles.',
      },
    ],
  }
