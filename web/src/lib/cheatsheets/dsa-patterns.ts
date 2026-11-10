import type { Cheatsheet } from './types'
import { foundations } from './dsa-patterns/foundations'
import { scans } from './dsa-patterns/scans'
import { searchAndIntervals } from './dsa-patterns/search-and-intervals'
import { candidates } from './dsa-patterns/candidates'
import { nodes } from './dsa-patterns/nodes'
import { graphs } from './dsa-patterns/graphs'
import { choices } from './dsa-patterns/choices'
import { greedy } from './dsa-patterns/greedy'

const families = [
  foundations,
  scans,
  searchAndIntervals,
  candidates,
  nodes,
  graphs,
  choices,
  greedy,
]
export const dsaPatterns: Cheatsheet = {
  slug: 'dsa-patterns',
  title: 'DSA Patterns',
  group: 'Algorithms',
  blurb:
    'Learn fifteen problem-solving patterns through everyday stories, tiny traces, JavaScript and attempt-first practice.',
  additionalSources: [
    {
      title: 'Sum of Two Values',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1640',
    },
    {
      title: 'Apartments',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1084',
    },
    {
      title: 'Playlist',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1141',
    },
    {
      title: 'Static Range Sum Queries',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1646',
    },
    {
      title: 'Factory Machines',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1620',
    },
    {
      title: 'Restaurant Customers',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1619',
    },
    {
      title: 'Nearest Smaller Values',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1645',
    },
    {
      title: 'Kth Largest Element in an Array',
      author: 'LeetCode',
      url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    },
    {
      title: 'Linked List Cycle',
      author: 'LeetCode',
      url: 'https://leetcode.com/problems/linked-list-cycle/',
    },
    {
      title: 'Subordinates (adapt binary children to a general hierarchy)',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1674',
    },
    {
      title: 'Message Route',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1667',
    },
    {
      title: 'Course Schedule',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1679',
    },
    {
      title: 'Creating Strings',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1622',
    },
    {
      title: 'Minimizing Coins',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1634',
    },
    {
      title: 'Movie Festival',
      author: 'CSES problem set',
      url: 'https://cses.fi/problemset/task/1629',
    },
    {
      title: 'Time complexity',
      author: 'Competitive Programming Initiative',
      url: 'https://usaco.guide/bronze/time-comp',
    },
    {
      title: 'Tree introduction',
      author: 'Competitive Programming Initiative',
      url: 'https://usaco.guide/silver/intro-tree',
    },
  ],
  sections: families.flatMap((f) => f.sections),
  activities: families
    .flatMap((f) => f.activities)
    .map((activity) => {
      const row = families
        .flatMap((f) => f.sections)
        .flatMap((s) => s.rows)
        .find((r) => r.study?.activityIds.includes(activity.id))
      const code = row?.teaching?.find(
        (b) =>
          b.kind === 'code' &&
          b.id === row.study!.id + '-solution' &&
          !['costs', 'tools'].includes(row.study!.id),
      )
      return {
        ...activity,
        prompt:
          code?.kind === 'code'
            ? activity.prompt +
              ' Then close the worked example and implement the function from its contract. Compare your code and reasoning with the solution.'
            : activity.prompt,
        ...(code?.kind === 'code'
          ? { solution: { label: 'Reference implementation', code: code.code } }
          : {}),
      }
    }),
}
