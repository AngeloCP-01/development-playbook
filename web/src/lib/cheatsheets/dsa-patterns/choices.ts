import type { Section, SheetActivity } from '../types'

export const choices: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Choices and memory',
      study: {
        id: 'choices-and-memory',
        label: 'Choices and memory',
        hint: 'Trace the state, then defend the next step',
      },
      introduction: [
        {
          id: 'choices-and-memory-intro',
          kind: 'paragraph',
          text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
        },
      ],
      rows: [
        {
          term: 'Backtracking',
          what: 'Return distinct permutations of at most eight lowercase ASCII letters, including one empty arrangement for empty text.',
          study: {
            id: 'backtracking',
            summary:
              'Arrange letter tiles by choosing one, arranging the rest, then putting it back for the next choice.',
            activityIds: ['backtracking-practice'],
          },
          teaching: [
            {
              id: 'backtracking-story',
              kind: 'paragraph',
              text: 'Arrange letter tiles by choosing one, arranging the rest, then putting it back for the next choice. Return distinct permutations of at most eight lowercase ASCII letters, including one empty arrangement for empty text.',
            },
            {
              id: 'backtracking-baseline',
              kind: 'paragraph',
              text: 'Permuting indexed tiles then removing duplicates wastes work for repeated letters. Choose letter frequencies instead.',
            },
            {
              id: 'backtracking-trace',
              kind: 'table',
              label: 'Backtracking trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['aab', 'choose a, remaining a:1 b:1', 'prefix a'],
                ['choose a then b', 'emit aab', 'undo b then a'],
                [
                  'Other branches',
                  'aba, baa',
                  'No duplicate branches for equal tiles',
                ],
              ],
            },
            {
              id: 'backtracking-solution',
              kind: 'code',
              label: 'Backtracking — JavaScript',
              code: "function uniquePermutations(text) {\n  const counts = new Map();\n  for (const ch of text) counts.set(ch, (counts.get(ch) ?? 0) + 1);\n  const path = [], output = [];\n  function visit() {\n    if (path.length === text.length) { output.push(path.join('')); return; }\n    for (const [ch, count] of counts) {\n      if (count === 0) continue;\n      counts.set(ch, count - 1);\n      path.push(ch);\n      visit();\n      path.pop();\n      counts.set(ch, count);\n    }\n  }\n  visit();\n  return output;\n}",
            },
            {
              id: 'backtracking-proof',
              kind: 'paragraph',
              text: 'Each distinct output has exactly one sequence of letter choices. Undo restores the state expected by sibling branches. This enumerates all arrangements; it is excessive when only a count is needed. ASCII makes text.length agree with letter iteration.',
            },
            {
              id: 'backtracking-cost',
              kind: 'paragraph',
              text: 'For n letters and U distinct outputs, O(n·U + 1) time with fixed alphabet, O(n + 26) working storage including recursion/path and O(n·U + 1) output storage. Enumeration can be factorial.',
            },
            {
              id: 'backtracking-interview',
              kind: 'interview',
              question: 'Why undo after recursion?',
              answer:
                'The next branch must start with the same remaining tiles and prefix as the previous branch did.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Dynamic programming',
          what: 'For coin change, save a different fact: the fewest coins making each amount. Coins are positive integers, reusable; amount is nonnegative.',
          study: {
            id: 'dynamic-programming',
            summary:
              'When climbing stairs, save the answer for each landing rather than recounting every route to it.',
            activityIds: ['dynamic-programming-practice'],
          },
          teaching: [
            {
              id: 'dynamic-programming-story',
              kind: 'paragraph',
              text: 'When climbing stairs, save the answer for each landing rather than recounting every route to it. For coin change, save a different fact: the fewest coins making each amount. Coins are positive integers, reusable; amount is nonnegative.',
            },
            {
              id: 'dynamic-programming-baseline',
              kind: 'paragraph',
              text: 'Recursive coin choices recompute the same remainder. Largest-coin-first is not always optimal.',
            },
            {
              id: 'dynamic-programming-trace',
              kind: 'table',
              label: 'Dynamic programming trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['coins [1, 3, 4]', 'dp[0] = 0', 'Empty amount needs no coins'],
                ['Amounts 1..4', '1, 2, 1, 1', 'Reuse smaller states'],
                ['Amount 6', 'min via 5, 3, 2', '2 using 3 + 3'],
              ],
            },
            {
              id: 'dynamic-programming-solution',
              kind: 'code',
              label: 'Dynamic programming — JavaScript',
              code: 'function minCoins(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let x = 1; x <= amount; x++) {\n    for (const coin of coins) if (coin <= x) dp[x] = Math.min(dp[x], dp[x - coin] + 1);\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
            },
            {
              id: 'dynamic-programming-proof',
              kind: 'paragraph',
              text: 'In any solution remove its last coin: what remains is a smaller amount. Trying every allowed last coin covers an optimum; induction gives correct smaller answers. Positive denominations make bottom-up dependencies smaller. Stairs often counts ways; this state minimizes count, so the recurrence uses min instead of addition.',
            },
            {
              id: 'dynamic-programming-cost',
              kind: 'paragraph',
              text: 'O(cX) time for c denominations and amount X; O(X) storage. This is pseudo-polynomial in numeric X, not polynomial in its digit count. Input coins are preserved.',
            },
            {
              id: 'dynamic-programming-interview',
              kind: 'interview',
              question: 'Why does greedy fail for [1, 3, 4] and 6?',
              answer:
                'Greedy takes 4 + 1 + 1, three coins. The optimum 3 + 3 uses two.',
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
      id: 'backtracking-practice',
      title: 'Backtracking practice',
      prompt: 'List uniquePermutations("aab") and uniquePermutations("").',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1622',
      answer: 'aab, aba, baa; and [""]. Order is immaterial.',
      explanation:
        'The next branch must start with the same remaining tiles and prefix as the previous branch did. Each distinct output has exactly one sequence of letter choices. Undo restores the state expected by sibling branches. This enumerates all arrangements; it is excessive when only a count is needed. ASCII makes text.length agree with letter iteration.',
    },
    {
      id: 'dynamic-programming-practice',
      title: 'Dynamic programming practice',
      prompt: 'Evaluate minCoins([2], 3) and minCoins([2], 0).',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1634',
      answer: '-1 and 0.',
      explanation:
        'Greedy takes 4 + 1 + 1, three coins. The optimum 3 + 3 uses two. In any solution remove its last coin: what remains is a smaller amount. Trying every allowed last coin covers an optimum; induction gives correct smaller answers. Positive denominations make bottom-up dependencies smaller. Stairs often counts ways; this state minimizes count, so the recurrence uses min instead of addition.',
    },
  ],
}
