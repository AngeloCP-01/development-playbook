# DSA Patterns study reference

Selected 2026-11-09 after the user accepted the fifteen-pattern recommendation,
JavaScript examples and simple everyday analogies with "okay lets proceed with
that". D-106/D-107 hold the original direction; D-108 records this scope selection.
The decisions below resolve the delivery details using the existing study-page
patterns. They do not authorize a merge or change D-100's session policy.

## Reader outcome and teaching contract

The reader can recognize a suitable technique from a problem's constraints,
explain why its next step is safe, write or repair JavaScript, test the result,
and explain time and space. Use familiar objects and short sentences before
technical terms. The initial story should be understandable without knowing
what an array, pointer, invariant or recurrence is.

Every core lesson has an everyday story, an original tiny problem, a simple
baseline, a state trace, an explained JavaScript solution, correctness reasoning,
derived time/space, an interview question with a model answer/follow-up, a local
attempt-first activity, and a linked external practice problem. Explain the
analogy's mapping and one condition where the approach stops fitting. A story
must lead to the mechanism; it cannot substitute for the algorithm.

Use the [source research](../../../reference/dsa-patterns-source-research.md)
for mechanisms, analogy seeds, constraints, original problem links and claims.
Interview prompts and local problems are original illustrative exercises.
Describe preparation relevance without company-frequency or pass-rate claims.

## Product boundary

- Add `/reference/dsa-patterns`, title **DSA Patterns**, in a sixth group,
  **Algorithms**, after Languages. It is a reference without a stage tether.
- Deliver all fifteen core patterns in this branch. Authoring in families is a
  work sequence, not permission to deliver only an initial four-pattern pilot.
- Reuse `StudySheet`, `TeachingBlock` and `SheetActivity`; no new component,
  block kind, chart library, animation, code runner, grading or persistence.
- Keep the eighteen lifecycle stages and thirty existing sheet bodies intact.
  Finished totals become **27/31** drawn/registered references and **18/18** stages.
  Four language placeholders remain. The native glossary/stack stay resources.
- Existing tokens, both themes, heading structure, hash/history, keyboard code/
  table scrolling and solution reset/re-collapse behavior apply unchanged.
- This design's eight sections are the starting structure. Keep default panels
  and a single open topic with solutions closed within four screens at 1024×768.
  Split at a teaching seam when measured; preserve all fifteen mechanisms and
  existing IDs. Do not shorten explanations merely to preserve eight sections.

## Content structure and stable IDs

Use subsection metadata on every row and no section-level activity assignments.
Give each panel a short visible orientation before collapsed lessons. Story and
goal also appear in the topic summary so the first view gives the reader a task.

| Section hash | Core topic IDs and scope |
| --- | --- |
| `foundations` | Supporting topics `costs`, `tools`, `explain-a-solution`: growth, extra storage, arrays/maps/stacks/queues, references, recursion, sorting and the interview process. |
| `scan-and-remember` | `hash-complements`, `two-pointers`, `sliding-window`, `prefix-sums`. |
| `search-and-intervals` | `binary-search`, `interval-sweep`. |
| `useful-candidates` | `monotonic-stack`, `top-k-heap`. |
| `follow-nodes` | `fast-slow`, `tree-dfs`. |
| `connections` | `graph-traversal`, `topological-order`. |
| `choices-and-memory` | `backtracking`, `dynamic-programming`. |
| `defend-a-choice` | `greedy`, plus supporting topic `mixed-choice` with the technique initially unnamed in its practice prompt. |

Recommend eighteen local activities: one for each core pattern, two foundations
activities and one mixed-choice exercise. This is a design budget, not a user
quota. IDs are respectively `<topic-id>-practice`, `costs-practice`,
`tools-practice` and `mixed-choice-practice`. A selected activity has exactly one
owner. Add a second small practice task only when it teaches distinct reasoning.
Keep explanations and worked solutions available within the reference itself.

### Published JavaScript contracts

The following names identify the main worked snippets for executable checks.
They are ordinary JavaScript in teaching blocks, not product APIs or TypeScript
required of the learner. Put helpers before their consumers and show all needed
fixtures/structures. Use stable code block IDs `<topic-id>-solution`; additional
code blocks get explicit unique IDs and are included in validation.
Arrays contain finite safe-integer numbers within the stated arithmetic bounds.
Intervals/visits are arrays of `[start, end]` pairs. Linked nodes have `.value`
and `.next`; binary tree nodes have `.value`, `.left` and `.right`, with `null`
for absent children. Adjacency lists are `number[][]`. These are documented
input contracts; this teaching task does not add general-purpose input validation.

| Topic | Worked function contract and boundary |
| --- | --- |
| Hash complements | `findPair(values, target)` returns two different original indices or `null`; signed safe integers and duplicate values allowed. Query before insertion. |
| Two pointers | `findSortedPair(values, target)` returns two indices in an already ascending array or `null`. Explain sorting and original-index costs when adapting an unsorted task. |
| Sliding window | `longestDistinct(values)` returns longest contiguous length, including 0 for an empty array. Delete zero counts if claiming storage proportional to active distinct values. Contrast fixed windows and sum windows; use the research's signed-sum counterexample. |
| Prefix sums | `buildPrefix(values)` and `rangeSum(prefix, start, end)` use zero-based half-open ranges. Also show `countTargetRanges(values, target)` for signed exact-sum counting, with an initial zero frequency and query-before-insert. |
| Binary search | `lowerBound(sorted, target)` returns the first index at least the target or `sorted.length`. Use half-open bounds and duplicates. Explain monotone answer search as a transfer problem; the original Factory Machines bounds can require BigInt. |
| Interval sweep | `peakGuests(visits)` returns maximum simultaneous guests, 0 for no visits. Visits have `start < end` and use half-open endpoints: departures before arrivals at a tie. Explain differences from closed intervals, merging and selection. |
| Monotonic stack | `previousSmaller(values)` returns the nearest strictly smaller earlier index, or -1. Explain why equal values are removed; source problems with one-based output need a labelled adaptation. |
| Top-k heap | `kthLargest(values, k)` counts duplicate occurrences and returns `null` for k outside 1..n. Include a fully shown min-heap helper in a labelled teaching block, counted in time/space; no unexplained platform helper. |
| Fast/slow | `hasCycle(head)` follows nodes with `.next` ending in `null`; compare node identity, including a self-cycle. Empty input is `null`. |
| Tree DFS | `treeSize(root)` counts a binary tree with `.left`/`.right` null children. Introduce recursive child summaries on small trees and show `treeSizeIterative(root)` for deep trees. No shared children or cycles. Derive stack/pending-node storage from the chosen traversal rather than assuming balance. |
| Graph traversal | `shortestPath(adj, start, goal)` uses BFS and returns a path or `null`; `countComponents(adj)` uses DFS on an undirected graph, including isolated vertices. Vertex IDs are 0..V-1. Use head-index queues and iterative DFS for deep inputs. |
| Topological order | `topologicalOrder(adj)` uses indegree removal (Kahn), returns any complete order or `null` for a cycle, including a self-loop. Queue order need not be lexicographically smallest. S16 in the research supplies the selected variant. |
| Backtracking | `uniquePermutations(text)` uses frequency choices for at most eight lowercase ASCII letters and returns every distinct string once. Include the empty string's one empty arrangement. State enumeration/output costs and why a chosen branch must be undone. |
| Dynamic programming | `minCoins(coins, amount)` uses positive integer denominations, unlimited reuse and a nonnegative integer amount; returns -1 when unreachable and 0 for amount 0. Introduce reuse with the stairs analogy before deriving this different state and recurrence. Label O(cX) pseudo-polynomial time. |
| Greedy | `maxCompatible(intervals)` returns the maximum count of half-open, positive-duration, unweighted intervals. Sort by finish time; allow the next start to equal the previous finish. Explain the exchange step and show why rewards or arbitrary coin change need other reasoning. |

Primary worked functions preserve caller arrays. If sorting is needed, show and
count a copy. State finite safe-integer/intermediate assumptions for Number
examples; comparisons and map operations use the declared analysis model.
Do not present JavaScript sort's storage/time or Map's O(1) lookup as language
guarantees. Describe strings in the chosen alphabet and count any conversions.
Actual verification runtimes belong in records, not introductory learner setup.

### Complexity and practice

First ask "how many checks?" and "how much extra room?" with tiny object counts.
Then introduce n, V/E, h, k, c/X, O/Θ, expected and amortized cost. Explain
preprocessing, output, copies and call stacks. Distinguish a moving boundary
from a restarted nested scan. One complexity label cannot describe an entire
pattern family.

Use the verified problems in the research as transfer links. Teach original
small examples and pure function interfaces instead of making contest input
parsing a prerequisite. Describe adaptations of indices/endpoints/number bounds.
Keep problem names in the relevant lesson and real credited links in the existing
Sources area; `TeachingBlock` prose does not interpret Markdown links. At least
one original problem per core pattern must be reachable through those citations.
Union-find and the other advanced follow-on topics remain deferred.

## Data and verification design

One canonical `Cheatsheet` is composed from content-family modules. Both web and
generated Markdown consume it. No second maintained lesson document or executable
algorithm module owns a duplicate solution. Code checks import the actual data
through Vitest's existing transform, then evaluate the published JavaScript in
isolated test contexts. This avoids Node's extensionless TypeScript import
resolution becoming a learner or build requirement.

Meaningful render coverage opens the registered DSA page, observes visible
orientation, reads actual trace cells/code/interview answers, and exercises local
solution reveal, re-collapse and reset on section change. Data guards establish
the fifteen selected topic IDs, assignment uniqueness and credited practice links;
literal-copy/class/count-only assertions cannot substitute for render coverage.

Published-code checks compare results to independent brute-force/reference
oracles on bounded exhaustive or deterministic small cases. Check every main
solution, helper and local coding solution. Cover duplicate indices, signed
sums, half-open boundaries, monotone plateaus, equal heights, duplicate ranks,
node identity, deep iterative traversals, isolated/cyclic graphs, alternate
topological orders, repeated letters, unreachable DP and greedy counterexamples.
For BFS/topological output, verify validity/optimal length rather than one
arbitrary order. For pair output, accept any two distinct valid indices with the
target sum; accept `null` only when the oracle finds none. Empirical timing does
not prove the complexity claim.

Production browser checks cover every declared hash and every nested activity,
direct links/history, keyboard access, code/table scrolling, both themes and
320/768/1440px. Verify representative published code in a real browser. Run the
full final web gate once and development-console sweep once. Extend the existing
JavaScript-only nested-state condition in `dev-console.spec.ts` to include DSA;
record observed DSA topic/solution IDs so merely loading its base page cannot pass.

Use one independent final content/page/branch review with **GPT-6 Astra / Low**,
including analogy accuracy, teaching depth, actual diff and the delivered page.
No per-task or separate design review is required by D-99. Resolve blockers
before handoff; user preview/feedback remains useful without claiming a learner
study.

## Implementation handoff

Use the [compact plan](../plans/2026-11-09-dsa-patterns.md). D-100 requires a fresh
user-selected **GPT-6.1 Sol / High** session. Start from this documentation
branch's exact committed tip and create `feat/dsa-patterns-reference`. Return
branch/commit, checks, unresolved issues and session reference to coordinator
**01a1bedf-bdad-7b72-ba40-9b5406807d43**, recommended **GPT-6 Astra / Low**.
All source/design/plan changes stay visible to that coordinator. Integration is
a separate user decision; main promotion belongs to the user.
