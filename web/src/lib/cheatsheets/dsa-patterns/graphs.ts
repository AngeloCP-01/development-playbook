import type { Section, SheetActivity } from '../types'

export const graphs: { sections: Section[]; activities: SheetActivity[] } = {
  sections: [
    {
      title: 'Connections',
      study: {
        id: 'connections',
        label: 'Connections',
        hint: 'Trace the state, then defend the next step',
      },
      introduction: [
        {
          id: 'connections-intro',
          kind: 'paragraph',
          text: 'Choose a topic, follow its small example, then try the local problem before opening the solution.',
        },
      ],
      rows: [
        {
          term: 'Graph traversal',
          what: 'Use BFS for an unweighted shortest path and DFS to count undirected components. Vertex IDs are 0..V-1 in number[][] adjacency lists.',
          study: {
            id: 'graph-traversal',
            summary:
              'Explore nearby bus stops before stops farther away; mark stops so a loop does not trap you.',
            activityIds: ['graph-traversal-practice'],
          },
          teaching: [
            {
              id: 'graph-traversal-story',
              kind: 'paragraph',
              text: 'Explore nearby bus stops before stops farther away; mark stops so a loop does not trap you. Use BFS for an unweighted shortest path and DFS to count undirected components. Vertex IDs are 0..V-1 in number[][] adjacency lists.',
            },
            {
              id: 'graph-traversal-baseline',
              kind: 'paragraph',
              text: 'Enumerating every route repeats vertices and can loop forever. A discovered marker prevents revisits.',
            },
            {
              id: 'graph-traversal-trace',
              kind: 'table',
              label: 'Graph traversal trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                [
                  'adj [[1], [0, 2], [1]], start 0',
                  'queue [0]',
                  'parent[0] = 0',
                ],
                ['Visit 0 then 1', 'queue [0, 1, 2]', 'parent[2] = 1'],
                ['Reach 2', 'reverse parent chain', '[0, 1, 2]'],
              ],
            },
            {
              id: 'graph-traversal-solution',
              kind: 'code',
              label: 'Graph traversal — JavaScript',
              code: 'function shortestPath(adj, start, goal) {\n  const parent = Array(adj.length).fill(-1), queue = [start];\n  parent[start] = start;\n  for (let head = 0; head < queue.length; head++) {\n    const v = queue[head];\n    if (v === goal) {\n      const path = [v];\n      while (path[path.length - 1] !== start) path.push(parent[path[path.length - 1]]);\n      return path.reverse();\n    }\n    for (const w of adj[v]) if (parent[w] === -1) {\n      parent[w] = v;\n      queue.push(w);\n    }\n  }\n  return null;\n}\nfunction countComponents(adj) {\n  const seen = new Set();\n  let count = 0;\n  for (let start = 0; start < adj.length; start++) {\n    if (seen.has(start)) continue;\n    count++;\n    const stack = [start];\n    seen.add(start);\n    while (stack.length) {\n      const v = stack.pop();\n      for (const w of adj[v]) if (!seen.has(w)) {\n        seen.add(w);\n        stack.push(w);\n      }\n    }\n  }\n  return count;\n}',
            },
            {
              id: 'graph-traversal-proof',
              kind: 'paragraph',
              text: 'BFS discovers vertices in nondecreasing edge distance; the first parent gives a shortest route. The queue uses a head index rather than shifting. DFS exhausts each reachable undirected region before starting another, including isolated vertices. Weighted shortest paths need a different proof.',
            },
            {
              id: 'graph-traversal-cost',
              kind: 'paragraph',
              text: 'O(V + E) time and O(V) extra storage for adjacency-list inputs; returned path adds O(V) output. Constructing adjacency from edges would add O(V + E) storage. Iterative traversal avoids deep recursive stacks.',
            },
            {
              id: 'graph-traversal-interview',
              kind: 'interview',
              question: 'Why mark when adding to the queue?',
              answer:
                'It prevents multiple predecessors from enqueuing the same vertex and preserves the first shortest parent.',
              followUp:
                'Which input assumption does your argument need? Give a counterexample when it is removed.',
            },
          ],
        },
        {
          term: 'Topological order',
          what: 'Return any valid order for directed prerequisites, or null if a cycle prevents one.',
          study: {
            id: 'topological-order',
            summary:
              'Start cooking tasks whose ingredients are ready, then unlock dependent tasks.',
            activityIds: ['topological-order-practice'],
          },
          teaching: [
            {
              id: 'topological-order-story',
              kind: 'paragraph',
              text: 'Start cooking tasks whose ingredients are ready, then unlock dependent tasks. Return any valid order for directed prerequisites, or null if a cycle prevents one.',
            },
            {
              id: 'topological-order-baseline',
              kind: 'paragraph',
              text: 'Trying all permutations can work on tiny graphs, but indegrees expose ready tasks directly.',
            },
            {
              id: 'topological-order-trace',
              kind: 'table',
              label: 'Topological order trace',
              columns: ['Moment', 'State', 'Meaning'],
              rows: [
                ['Edges 0 → 2, 1 → 2', 'indegree [0, 0, 2]', 'ready [0, 1]'],
                ['Remove 0 then 1', 'indegree[2] becomes 0', 'append 2'],
                [
                  'Order',
                  '[0, 1, 2]',
                  'Every prerequisite precedes its dependent',
                ],
              ],
            },
            {
              id: 'topological-order-solution',
              kind: 'code',
              label: 'Topological order — JavaScript',
              code: 'function topologicalOrder(adj) {\n  const indegree = Array(adj.length).fill(0), ready = [];\n  for (const edges of adj) for (const w of edges) indegree[w]++;\n  for (let v = 0; v < adj.length; v++) if (indegree[v] === 0) ready.push(v);\n  for (let head = 0; head < ready.length; head++) {\n    for (const w of adj[ready[head]]) if (--indegree[w] === 0) ready.push(w);\n  }\n  return ready.length === adj.length ? ready : null;\n}',
            },
            {
              id: 'topological-order-proof',
              kind: 'paragraph',
              text: 'Indegree counts remaining prerequisites. Removing a ready vertex cannot violate an edge. If vertices remain but none is ready, following remaining incoming edges eventually repeats a vertex, exposing a cycle. A self-loop is a cycle. The selected Kahn queue is not a lexicographic priority queue.',
            },
            {
              id: 'topological-order-cost',
              kind: 'paragraph',
              text: 'O(V + E) time and O(V) extra storage; every vertex enters once and each edge is removed once.',
            },
            {
              id: 'topological-order-interview',
              kind: 'interview',
              question: 'Why is an incomplete order evidence of a cycle?',
              answer:
                'Every remaining vertex has a remaining predecessor. A finite predecessor chain must repeat.',
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
      id: 'graph-traversal-practice',
      title: 'Graph traversal practice',
      prompt: 'Use adj [[1], [0], []]. Find path 0 to 2 and count components.',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1667',
      answer: 'null and 2.',
      explanation:
        'It prevents multiple predecessors from enqueuing the same vertex and preserves the first shortest parent. BFS discovers vertices in nondecreasing edge distance; the first parent gives a shortest route. The queue uses a head index rather than shifting. DFS exhausts each reachable undirected region before starting another, including isolated vertices. Weighted shortest paths need a different proof.',
    },
    {
      id: 'topological-order-practice',
      title: 'Topological order practice',
      prompt: 'Evaluate [[2], [2], []] and [[0]].',
      context:
        'Original local exercise. Use the published function and input contract; predict the result and explain it before revealing. External transfer practice: https://cses.fi/problemset/task/1679',
      answer: '[0, 1, 2] and null. Other valid orders are acceptable.',
      explanation:
        'Every remaining vertex has a remaining predecessor. A finite predecessor chain must repeat. Indegree counts remaining prerequisites. Removing a ready vertex cannot violate an edge. If vertices remain but none is ready, following remaining incoming edges eventually repeats a vertex, exposing a cycle. A self-loop is a cycle. The selected Kahn queue is not a lexicographic priority queue.',
    },
  ],
}
