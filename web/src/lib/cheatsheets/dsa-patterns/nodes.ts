import type { Section, SheetActivity } from '../types'

export const nodes: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Follow nodes',
      study: {
        id: 'follow-nodes',
        label: 'Follow nodes',
        hint: 'Trace the state, then defend the next step',
      },
      introduction: [
        {
          id: 'follow-nodes-intro',
          kind: 'paragraph',
          text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
        },
      ],
      rows: [
        {
          term: 'Fast and slow',
          what: 'Detect a cycle in nodes with value and next fields; null ends the chain.',
          study: {
            id: 'fast-slow',
            summary:
              'Two walkers follow the same signposts, one taking twice as many steps.',
            activityIds: ['fast-slow-practice'],
          },
          teaching: [
            {
              id: 'fast-slow-story',
              kind: 'paragraph',
              text: 'Two walkers follow the same signposts, one taking twice as many steps. Detect a cycle in nodes with value and next fields; null ends the chain.',
            },
            {
              id: 'fast-slow-baseline',
              kind: 'paragraph',
              text: 'Remembering all visited nodes works with O(n) storage. Relative speed can detect repetition without that set.',
            },
            {
              id: 'fast-slow-trace',
              kind: 'table',
              label: 'Fast and slow trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['a → b → c → b', 'slow b, fast c', 'Different identities'],
                ['Next round', 'slow c, fast c', 'Cycle detected'],
              ],
            },
            {
              id: 'fast-slow-solution',
              kind: 'code',
              label: 'Fast and slow — JavaScript',
              code: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
            },
            {
              id: 'fast-slow-proof',
              kind: 'paragraph',
              text: 'Inside a cycle the faster walker gains one position per round modulo cycle length, so they meet. On an acyclic chain fast reaches null. Compare node identity, not value: repeated labels do not imply a loop. This requires one successor per node, not arbitrary graph branching.',
            },
            {
              id: 'fast-slow-cost',
              kind: 'paragraph',
              text: 'O(n) time for n distinct reachable nodes and O(1) auxiliary space.',
            },
            {
              id: 'fast-slow-interview',
              kind: 'interview',
              question: 'Do two equal values prove a cycle?',
              answer:
                'No. Distinct nodes can carry equal values. The walkers must reach the same object.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Tree DFS',
          what: 'Count binary-tree nodes with value, left and right; absent children are null. No cycles or shared children.',
          study: {
            id: 'tree-dfs',
            summary:
              'Count everyone in a family branch by counting each child branch and adding yourself.',
            activityIds: ['tree-dfs-practice'],
          },
          teaching: [
            {
              id: 'tree-dfs-story',
              kind: 'paragraph',
              text: 'Count everyone in a family branch by counting each child branch and adding yourself. Count binary-tree nodes with value, left and right; absent children are null. No cycles or shared children.',
            },
            {
              id: 'tree-dfs-baseline',
              kind: 'paragraph',
              text: 'A tree already divides into disjoint child subtrees; their counts combine without overlap.',
            },
            {
              id: 'tree-dfs-trace',
              kind: 'table',
              label: 'Tree DFS trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['Root with two leaves', 'left 1, right 1', '1 + 1 + 1 = 3'],
                ['Absent child', 'null', 'Contributes 0'],
              ],
            },
            {
              id: 'tree-dfs-solution',
              kind: 'code',
              label: 'Tree DFS — JavaScript',
              code: 'function treeSize(root) {\n  if (root === null) return 0;\n  return 1 + treeSize(root.left) + treeSize(root.right);\n}\nfunction treeSizeIterative(root) {\n  const pending = root === null ? [] : [root];\n  let count = 0;\n  while (pending.length) {\n    const node = pending.pop();\n    count++;\n    if (node.right !== null) pending.push(node.right);\n    if (node.left !== null) pending.push(node.left);\n  }\n  return count;\n}',
            },
            {
              id: 'tree-dfs-proof',
              kind: 'paragraph',
              text: 'The recursive base counts an empty branch as zero; induction combines two correct child counts and the root. The iterative stack holds unvisited subtree roots; every node is removed once. Deep recursion can overflow JavaScript call stacks, so use the iterative version for deep inputs. Shared children would be counted twice.',
            },
            {
              id: 'tree-dfs-cost',
              kind: 'paragraph',
              text: 'O(n) time. Recursion uses O(h) call frames. Iterative DFS uses O(h) pending roots as an upper bound for binary trees, O(n) worst case; on a single chain it keeps only one pending node. Balance must not be assumed.',
            },
            {
              id: 'tree-dfs-interview',
              kind: 'interview',
              question: 'Why count null as zero?',
              answer:
                'An absent branch has no node to add; this makes leaves evaluate to one without a special leaf case.',
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
      id: 'fast-slow-practice',
      title: 'Fast and slow practice',
      prompt: 'Predict hasCycle(null), and a node whose next points to itself.',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://leetcode.com/problems/linked-list-cycle/',
      answer: 'false and true.',
      explanation:
        'No. Distinct nodes can carry equal values. The walkers must reach the same object. Inside a cycle the faster walker gains one position per round modulo cycle length, so they meet. On an acyclic chain fast reaches null. Compare node identity, not value: repeated labels do not imply a loop. This requires one successor per node, not arbitrary graph branching.',
    },
    {
      id: 'tree-dfs-practice',
      title: 'Tree DFS practice',
      prompt: 'Count a root with only one leaf child.',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1674',
      answer: '2 in both versions.',
      explanation:
        'An absent branch has no node to add; this makes leaves evaluate to one without a special leaf case. The recursive base counts an empty branch as zero; induction combines two correct child counts and the root. The iterative stack holds unvisited subtree roots; every node is removed once. Deep recursion can overflow JavaScript call stacks, so use the iterative version for deep inputs. Shared children would be counted twice.',
    },
  ],
}
