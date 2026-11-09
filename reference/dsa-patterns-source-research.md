# DSA patterns reference: source research

Research date: 2026-11-09. Status: proposed teaching scope; no page or application implementation. Intended language: JavaScript. This record supplies source findings and candidate content for the coordinator's scope recommendation.

User direction: teach DSA patterns, interview-style questions, problems where the
pattern fits, and an overview of time and space complexity. The user selected
JavaScript examples during this research. The proposed fifteen-pattern budget,
lesson structure and delivery order below are recommendations, not approved scope.
The user then required very simple explanations with familiar real-life analogies
(D-107). Start from an intuitive story and introduce technical language gradually.

Repository checkpoint: `docs/2026-11-09-dsa-patterns-research`, from local develop
`c996177d8e4fbc4c6f9b3659c10197dc7eb8fbc9`. Application totals remain 26/30
references and 18/18 stages. Research coordinator session:
`01a1bedf-bdad-7b72-ba40-9b5406807d43`; bounded source researcher:
`/root/dsa_primary_research`, explicitly dispatched as GPT-6 Astra / Low.

## Scope and evidence rules

Recommend fifteen core entries, with disjoint-set union as an optional sixteenth. These are teaching selections, not a ranking of interview frequency or a claim that every problem fits a template. A pattern should help the reader form and defend an algorithm: identify the maintained fact, explain why a step is safe, and account for its cost. A hash table, heap, stack, queue and adjacency list are data structures; complement lookup, bounded top-k retention, monotonic candidates and frontier traversal are techniques that use them. Pseudocode is an implementation aid after the argument, not the argument itself.

Prerequisites: array/string indexing, references and linked nodes, sets/maps, stack/queue operations, sorting with a comparator, recursion and its stack, tree/graph representation, Big-O and basic invariants. Explain these briefly or link prerequisites; do not turn each pattern into an entire data-structures chapter. Sorting algorithms, balanced trees, tries, weighted shortest paths, advanced range structures and string matching can remain explicit follow-on topics.

The candidate mechanisms, counterexamples and interview prompts below are our teaching synthesis. Teaching sources support the named algorithms; original problem pages establish the task and constraints, not an official endorsement of our chosen solution. Every linked problem and teaching page was opened during this research. No problem statement, editorial or source image is reproduced. No image assets are proposed.

## Source register

All sources were accessed 2026-11-09. MIT material is the Fall 2011 version of 6.006, taught by Erik Demaine and Srini Devadas. USACO Guide is community-authored teaching published by the Competitive Programming Initiative; it is not the official USACO contest syllabus. Its own instructional explanations are used here, rather than unvisited resources in its link lists. CSES is the original CSES Problem Set publisher; LeetCode is the original publisher of the two linked list/selection exercises.

| ID | Primary teaching source | Finding supported |
| --- | --- | --- |
| S1 | [MIT 6.006, lecture 8: hashing with chaining](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/d3e4d64266d481c74c9e7c15e09999fe_MIT6_006F11_lec08.pdf) | Collisions matter; chained lookup has a linear worst case, with expected behavior dependent on hashing and load assumptions. |
| S2 | [USACO Guide: two pointers](https://usaco.guide/silver/two-pointers) | Opposing pointers and same-direction windows maintain information while indices advance; sorting enables ordered elimination. |
| S3 | [USACO Guide: prefix sums](https://usaco.guide/silver/prefix-sums) | Linear preprocessing supports constant-time static range sums by subtracting prefixes. |
| S4 | [USACO Guide: binary search](https://usaco.guide/silver/binary-search) | A monotone decision function permits boundary search; bounds, off-by-one choices and overflow require care. |
| S5 | [USACO Guide: sweep line](https://usaco.guide/plat/sweep-line) | The introductory Restaurant Customers example sorts arrival/departure events and accumulates active counts. Only that completed subsection is used; the broader page labels some material incomplete. |
| S6 | [USACO Guide: stacks](https://usaco.guide/gold/stacks) | Nearest-smaller queries can retain candidate value/index pairs on a monotonic stack. |
| S7 | [MIT 6.006, lecture 4: heaps](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/8ebfeb1c645b10b3709919603e7d51be_MIT6_006F11_lec04.pdf) | Binary heaps implement priority queues; heap height explains logarithmic updates. |
| S8 | [USACO Guide: functional graphs](https://usaco.guide/silver/func-graphs) | Floyd's cycle algorithm follows a single successor per node with linear time and constant auxiliary memory. |
| S9 | [MIT 6.006, lecture 13: BFS](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/1208e162775f6f5cedfbb9f2b694ede0_MIT6_006F11_lec13.pdf) | BFS visits distance layers measured in edge counts, recording parents and avoiding revisits. |
| S10 | [MIT 6.006, lecture 14: DFS/topological sort](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/e59f8a55929028498953691891229a17_MIT6_006F11_lec14.pdf) | DFS runs in O(V + E) on adjacency lists; finishing order supports dependency ordering on a DAG, and active ancestors reveal directed cycles. |
| S11 | [USACO Guide: complete search with recursion](https://usaco.guide/bronze/complete-rec) | Recursive choices enumerate subsets/permutations; backtracking abandons invalid partial candidates. |
| S12 | [MIT 6.006, lecture 19: dynamic programming](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/b6d4083131dd16e7d97f56d04b6e858f_MIT6_006F11_lec19.pdf) | Memoization reuses subproblems; state count times transition work explains runtime; bottom-up evaluation follows dependencies. |
| S13 | [USACO Guide: greedy algorithms with sorting](https://usaco.guide/silver/greedy-sorting) | Earliest finish works for unweighted interval selection; superficially plausible choices and general coin-change greedy can fail. |
| S14 | [USACO Guide: disjoint-set union](https://usaco.guide/gold/dsu) | Union/find with compression and size balancing supports amortized inverse-Ackermann operations. |
| S15 | [Microsoft Careers: technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) | Microsoft's guidance stresses clarifying ambiguity, planning, executable code in a strong language and testing. This supports a reasoning-and-practice format, not universal employer requirements or frequency estimates. |

Princeton's Algorithms cheatsheet returned HTTP 403 during research. It is not evidence for this record.

## Complexity contract

Costs below belong to the stated algorithm, not to the pattern name. Let `n` be items, `m` a second input length, `V/E` vertices/edges, `h` tree height, `q` queries, `k` retained items, `U` an integer search upper bound and `X` a target sum. Fixed-width arithmetic/comparison and direct indexed access are treated as constant cost. String hashing, arbitrary-precision arithmetic or expensive comparisons need additional accounting.

Space means auxiliary working storage, excluding existing input and separately identifying required output. If adjacency lists are built from edges, add O(V + E) construction time and storage. Recursive stack space counts. Sorting uses O(n log n) comparison time here; its auxiliary memory depends on implementation and whether input may be mutated or must be copied. Hash-based linear bounds assume expected constant-time operations with controlled load; they are not a claim that ECMAScript guarantees O(1) Map/Set operations. Amortized analysis bounds a sequence of operations, not each isolated operation.

## Candidate pattern matrix

The questions are original interview-style prompts for explaining the linked exercise or a nearby variation. They are not attributed interview questions.

| Pattern and mechanism | Fit; boundary or anti-fit | Cost for the specified approach | Verified original practice problem; question and answer sketch |
| --- | --- | --- | --- |
| **1. Hash counting / complement lookup.** Scan once; store what has already been seen, keyed by value. Before inserting `x`, seek `target - x`. S1. | Membership, frequency, pairs with exact equality. Ordered range queries need a different structure; returning all matching pairs can require quadratic output. | Two-sum: expected O(n) time, O(n) map, O(1) returned pair. A collision-heavy hash implementation can degrade. | [CSES Sum of Two Values](https://cses.fi/problemset/task/1640). **Why query before insertion?** It prevents reusing the current position; two equal values still work when the earlier occurrence is already stored. |
| **2. Two pointers on ordered inputs.** Sort and advance the side whose current item cannot match; each advance permanently rules out that item. S2. | Pairing or matching where order proves elimination safe. Arbitrary compatibility relations do not provide this proof. | Apartments: O(n log n + m log m) sorting, O(n + m) scan; O(1) scan workspace plus sort/copy memory. Scalar output. | [CSES Apartments](https://cses.fi/problemset/task/1084). **Why discard an apartment that is too small?** Later applicants want sizes at least as large, so it cannot serve them either. |
| **3. Sliding window.** Maintain a contiguous range and repair its invariant by moving the left boundary after extending right. S2. | Longest distinct segment or other constraints with safe one-direction repair. Sum-based shrinking needs suitable monotonicity; negative values break the usual positive-sum rule. | Playlist with a frequency map: expected O(n) time, O(d) space for at most `d` distinct active values when zero counts are deleted, O(1) output. Each index enters/leaves once. | [CSES Playlist](https://cses.fi/problemset/task/1141). **Why can a nested shrink loop still be linear?** Across the entire scan the left pointer advances at most n times; it does not restart per right endpoint. |
| **4. Prefix accumulation.** Store the sum before each position; a range is the difference between two prefixes. S3. | Many static contiguous sum queries, including signed values. Frequent updates invalidate later prefixes; subtraction does not recover range minimum. | O(n) preprocessing, O(1) each query, O(n + q) total; O(n) prefix storage. O(q) output if retained, O(1) extra if streamed. | [CSES Static Range Sum Queries](https://cses.fi/problemset/task/1646). **Why store an initial zero?** A range starting at the first item uses the same subtraction rule as every other range. |
| **5. Binary search / answer boundary.** Maintain a proven feasible boundary and an infeasible region; eliminate half using a monotone predicate. S4. | Sorted lookup or minimum feasible integer answer. A predicate that alternates true/false cannot justify discarding a half. | Sorted lookup O(log n), O(1) iterative space; sorting beforehand adds O(n log n). Factory Machines checks n machines per midpoint: O(n log(U + 1)), O(1) workspace, U = fastest-machine time × target. | [CSES Factory Machines](https://cses.fi/problemset/task/1620). **Why is feasibility monotone?** Extra time never reduces production. Cap the production sum at the target to avoid unnecessary accumulation. |
| **6. Interval event sweep.** Convert starts/ends to changes, sort events, accumulate active count. S5. | Maximum concurrency and coverage. Merge, select and allocate intervals are different objectives; a single sweep counter does not solve all three. | n intervals: O(n log n) time, O(n) event storage plus sort workspace, O(1) answer. | [CSES Restaurant Customers](https://cses.fi/problemset/task/1619). **What if events share a timestamp?** Define endpoint semantics before tie ordering. This exact statement guarantees all times distinct; [Room Allocation](https://cses.fi/problemset/task/1164) instead permits reuse only when departure is strictly earlier than arrival. |
| **7. Monotonic stack.** Remove candidates that the current value makes permanently unhelpful; the surviving top answers the nearest query. S6. | Nearest smaller/greater neighbors in a scan. Arbitrary range minima with updates are a different problem. | O(n) total time: each index pushed once and popped at most once; O(n) stack. O(n) answer storage if retained, or stream answers. | [CSES Nearest Smaller Values](https://cses.fi/problemset/task/1645). **Why pop equal values too?** The requested relation is strictly smaller. A nearer value no greater than an older candidate makes the older one unnecessary for later queries. |
| **8. Heap for bounded top-k.** Keep a min-heap of the k largest values seen; its root is the weakest retained candidate. S7. | Streaming selection and repeated best-candidate access. A heap is not fully sorted; ordered output costs extra. | n values: O(n log(k + 1)) time, O(k) heap, O(1) kth-value output. Sorted top-k output adds O(k log k) time and O(k) output. | [LeetCode 215: Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/). **Are duplicates discarded?** No: rank counts occurrences. A set would change the problem. |
| **9. Fast/slow successors.** Follow the same successor relation at speeds one and two; inside a cycle their relative positions eventually coincide. S8. | Linked-list cycle detection or deterministic successor chains. A branching graph requires a traversal/cycle algorithm, not arbitrary fast/slow choices. | O(n) time, O(1) space for n reachable nodes; more precisely O(μ + λ) for tail length μ and cycle length λ. | [LeetCode 141: Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/). **Compare values or nodes?** Node identity; repeated values do not imply a cycle. Guard null before following the fast pointer twice. |
| **10. Tree DFS with child summaries.** Process children before combining their results at the parent. S10; the subtree recurrence is our derivation. | Subtree counts, heights and aggregates on a tree. Shared children or cycles need different visitation/aggregation reasoning. | Subordinates: O(n) time; O(h) recursive frames plus O(n) result array, and O(n) adjacency if constructed. An iterative implementation may use O(n) workspace. | [CSES Subordinates](https://cses.fi/problemset/task/1674). **What does a leaf return?** Subtree size one; each parent sums child sizes and adds itself, then reports size minus one. A chain has h = n, not log n. |
| **11. Graph BFS / DFS.** Mark a vertex when discovered; expand its neighbors once. BFS uses distance layers; DFS explores one branch deeply. S9 and S10. | Reachability/components: either. Minimum edges in an unweighted graph: BFS. Ordinary BFS does not minimize arbitrary weighted cost. | Adjacency lists: O(V + E) time, O(V) visited/frontier/parent workspace; reconstructed path O(V) output worst case. Grid flood fill O(RC) time and O(RC) workspace worst case. | [CSES Message Route](https://cses.fi/problemset/task/1667), [Counting Rooms](https://cses.fi/problemset/task/1192). **Why mark on enqueue?** It prevents duplicate frontier entries and fixes a first shortest-edge parent. For components, restart from every still-unvisited vertex. |
| **12. Topological order.** DFS finishing order reversed gives a dependency order when no directed cycle exists; an active-node revisit detects the obstruction. S10. | Directed prerequisite ordering. A cyclic graph has no complete topological order; an undirected graph is not a prerequisite DAG. | O(V + E) time, O(V) visitation and stack space, O(V) output, excluding adjacency storage. | [CSES Course Schedule](https://cses.fi/problemset/task/1679). **Is a visited neighbor always a cycle?** No: a completed node may be shared by two dependencies. A directed back edge reaches a node still active in the current DFS. |
| **13. Backtracking.** Choose, update state, recurse, restore; prune only when no extension can be valid. S11. | Enumerating small candidate spaces with constraints. Large unconstrained output remains expensive even with clever pruning. | Distinct permutations of n characters: conservative O(n × n!) time; O(n) path/stack plus fixed-alphabet counts when streamed. For P unique outputs, retaining them costs O(nP); writing them already costs Ω(nP). | [CSES Creating Strings](https://cses.fi/problemset/task/1622). **How avoid duplicate branches?** Choose a character with positive remaining frequency, not a separate branch for each indistinguishable copy; visit characters in alphabet order. |
| **14. Dynamic programming.** Define what each state means, enumerate legal predecessor choices, and reuse their answers. S12. | Repeated subproblems with sufficient state. Missing state information invalidates reuse; no single complexity belongs to all DP. | Unlimited coin minimum: c denominations, target X; O(cX) time and O(X) table with bottom-up evaluation. This is pseudo-polynomial in numeric X. Returned count O(1); reconstructing coins needs additional output. | [CSES Minimizing Coins](https://cses.fi/problemset/task/1634). **Why is dp[0] = 0?** Empty selection makes zero; impossible states start at infinity. dp[s] takes the minimum dp[s − coin] + 1 over usable coins. |
| **15. Greedy with an exchange argument.** Select the compatible interval that finishes earliest, then repeat on what remains. S13. | Maximizing the number of unweighted compatible intervals. Different rewards turn this into weighted scheduling; arbitrary coin denominations defeat largest-first change. | O(n log n) sorting then O(n) scan; O(1) scan state plus sort memory. Counting output O(1); selected list O(n). | [CSES Movie Festival](https://cses.fi/problemset/task/1629). **Why earliest finish?** Replace an optimal schedule's first event with the earliest-finishing one; it leaves at least as much room for the rest, preserving achievable count. |
| **Optional 16. Union-find for incremental connectivity.** Store component representatives; merge roots and maintain component sizes. S14. | Undirected connections added over time. Basic DSU does not support deletion, recover paths or establish directed reachability. | V singleton initialization O(V); m operations O(m α(V)) amortized with path compression and union by size/rank; O(V) arrays. Streaming answers use O(1) extra output buffer. | [CSES Road Construction](https://cses.fi/problemset/task/1676). **When does the component count decrease?** Only when endpoints have different representatives; a redundant connection changes neither count nor largest size. |

## Content and implementation cautions

Use small original worked examples with state snapshots and a failed alternative, then a linked practice task. A useful recall check asks the reader to predict the next state or defend an invariant before showing the explanation. Label variations explicitly: a signed-sum window counterexample is not a defect in a distinct-value window; endpoint rules belong to the problem; a tree traversal's height can be linear.

For DP, one coin exercise introduces the method but does not teach its full scope. A future second example can contrast two-dimensional sequence state with amount state, with its own derivation and cost. Likewise, the topological entry can later show indegree removal as an alternative without conflating that algorithm with ordinary BFS shortest paths.

JavaScript needs a separate implementation note for queue indexing, recursion limits, numeric safety, comparators and the chosen heap implementation. This research does not approve a runtime/library API or assert that interview pseudocode alone is sufficient; the selected language should ultimately provide executable practice. The coordinator owns that follow-up evidence and delivery scope.

## Interview and JavaScript source findings

These additional sources were opened by the coordinator on 2026-11-09. MDN
entries are living JavaScript documentation by MDN contributors; no particular
Node version is a prerequisite for the proposed teaching. They establish language
behavior, not benchmark results or universal engine complexity guarantees.

| ID | Source and owner/version | Finding and teaching consequence |
| --- | --- | --- |
| J1 | [Software development interview topics](https://www.amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics), Amazon Jobs | Amazon emphasizes applying fundamentals to solve problems efficiently rather than memorizing topic details. Use explanation, code and follow-up changes in the reference; this does not establish a universal interview syllabus. |
| J2 | [Technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html), Microsoft Careers; same guidance as S15 | Microsoft asks for complexity explanations, data-structure tradeoffs and testing. Its language advice supports JavaScript solutions the reader can execute. Treat company guidance as evidence of assessed skills, not a list of questions that every employer asks. |
| J3 | [Lecture 1: Introduction](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/477c78e0af2df61fa205bcc6cb613ceb_MIT6_006S20_lec1.pdf), MIT 6.006 Spring 2020; Erik Demaine, Jason Ku, Justin Solomon | Separates a problem, an algorithm, correctness and efficiency; defines input-size analysis and O/Ω/Θ under an explicit computation model. Use this as the complexity primer's basis. |
| J4 | [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), MDN | ECMAScript requires average sublinear access, not a specific hash-table implementation or guaranteed O(1). Label expected constant-time map operations as the analysis model. |
| J5 | [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), MDN | Default ordering converts values to strings; numeric examples need a comparator. Sorting mutates its array and implementation determines time/space. Show sorting and any defensive copy as separate costs. |
| J6 | [Array.prototype.shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift), MDN | Removing the first entry shifts the remaining indexed values. Recommend an array with a head index for a finite BFS queue so the proof need not assume repeated front-removal is constant time. Retained queue entries still count toward storage. |
| J7 | [Array.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice), MDN | Slice creates a new shallow array. In the ordinary dense-array model, copying a length-k segment adds O(k) work/storage; repeated slices or spreads belong in the algorithm's analysis. This cost statement is our derivation from copying semantics. |
| J8 | [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER), MDN | Exact safe integers extend through 2^53 - 1. Check intermediates as well as outputs. Factory Machines can require a search bound beyond this range; use BigInt or an explicitly bounded adaptation and account for arbitrary-precision arithmetic. |
| J9 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), MDN | Indexing/length use UTF-16 code units, while iteration yields code points. Declare a simple alphabet for initial string exercises; a Unicode extension needs a defined unit and any conversion storage counted. |
| J10 | [Too much recursion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion), MDN | Deep recursion can exhaust the call stack. Keep recursive traces small, teach stack cost, and use an explicit stack for deep graph/tree inputs. Do not prescribe a portable maximum recursion depth. |

For the heap lesson, supply and explain a small binary-heap helper or explicitly
name the interview platform's provided helper. Do not present an unexplained
`PriorityQueue` call as a JavaScript built-in. That implementation choice remains
open until the lesson scope is selected.

## Recommended teaching structure

### Relevance to coding assessments and interviews

The fifteen techniques form a useful preparation set in our assessment. They
exercise the structures and reasoning represented in employer guidance J1/J2
and the platform curriculum J11 below. Those sources do not establish that each
technique appears often, that the fifteen have equal priority, or that this
reference covers every kind of technical interview. Our pattern names are an
editorial grouping, not a published employer syllabus.

| ID | Additional primary source, accessed 2026-11-09 | Finding supported |
| --- | --- | --- |
| J11 | [Interview Preparation Kit](https://www.hackerrank.com/interview/interview-preparation-kit), HackerRank | Its curriculum includes arrays, hash maps, sorting, strings, search, greedy, DP, stacks/queues, graphs, trees, linked lists and recursion/backtracking. This supports preparation relevance at the topic level. The page's company percentages are not used: the visible page does not supply the sampling date or methodology needed for this research's frequency claims. |

The separate one-week kit URL could not be retrieved; it is not evidence here.
Amazon and Microsoft guidance was reopened on 2026-11-09 for this follow-up.
We are assessing suitability, not estimating a pass probability or question rate.

For learning order, recommend simple scans/maps, sorting, two pointers, windows,
prefix sums and basic binary search before graph/tree traversal. Then introduce
backtracking, DP and greedy reasoning. Teach specialized candidate maintenance,
successor cycles, event sweeps and dependency ordering after their prerequisites.
This order reflects conceptual dependencies and teaching judgment, not measured
interview frequency. Sorting and basic stack/queue operations must receive
explicit introductory practice even though they are not separate entries in
the fifteen-pattern count.

### Everyday explanations before formal terms

The user's "even a five-year-old" direction is a request for accessible entry
points. Write in simple adult language: short sentences, familiar objects,
tiny inputs and no unexplained jargon. Keep the reasoning accurate as the lesson
builds toward an interview-ready explanation and JavaScript implementation.

Use this teaching order for each pattern:

1. Tell a short everyday story with a concrete goal.
2. Work through three to six items, showing each decision and what is remembered.
3. Map the story's objects and actions to arrays, positions, maps, queues or states.
4. Name the pattern and explain the fact that stays true. Introduce "invariant"
   only after the reader understands that fact.
5. Walk through the JavaScript solution, linking each variable to the story.
6. Explain work and extra storage in plain words, then derive Big-O.
7. Ask an interview question and give a complete model explanation.
8. Offer an attempt-first activity and a changed condition that tests transfer.

These analogy seeds are original teaching proposals. Each needs a small trace
and an explicit mapping when authored; a story alone is not a complete lesson.

| Pattern | Everyday starting story | Mapping and boundary to explain |
| --- | --- | --- |
| Hash lookup/counting | Put toy-color counts in labelled cubbies so you do not count the whole toy box again. | A label is a key; the stored count or earlier position is a value. A cubby is an illustration of lookup, not proof that every language map has constant-time access. |
| Ordered two pointers | Two helpers stand at opposite ends of a row of numbered cards, looking for a pair with a chosen total. | Sorted numbers make a too-small or too-large total tell us which end to move. Unsorted cards lose that guarantee. |
| Sliding window | Find the longest unbroken row of toy cars containing no repeated color. Add on the right; remove on the left until every color is different again. | The row must stay contiguous. This explains distinctness; a sum-based window needs a separate argument about the allowed numbers. |
| Prefix sums | A sticker notebook records the total collected by each evening. Subtract Monday's total from Thursday's to find what was added Tuesday through Thursday. | Store cumulative totals, including zero before the first day. Later edits to an old day make later totals stale. |
| Binary search | Guess a number while a friend answers "higher" or "lower," ruling out half the remaining guesses. | Each answer must safely eliminate a region. Searching a minimum feasible answer needs its own monotone yes/no rule. |
| Interval event sweep | At a party, add one to the guest counter when someone enters and subtract one when someone leaves. Remember the biggest count. | Sort events by time first. Decide what simultaneous arrival/departure means; counting guests does not itself assign seats or merge visits. |
| Monotonic stack | Keep height cards for children in a line to answer "who is the nearest shorter child to my left?" Retire older cards when a nearer child is no taller. | Cards are candidate reminders; actual children remain in the original line. Explain why a retired card can never beat the nearer replacement, including equal heights. |
| Bounded top-k heap | Keep only the three biggest apples seen so far. When a new apple arrives, compare it with the smallest apple in the basket. | The basket holds the best candidates; the heap makes its weakest retained candidate easy to inspect. The basket is not a fully sorted list. |
| Fast/slow successors | Two toy cars follow the same track, one moving one step and the other two. On a loop, the faster one eventually catches the slower one. | Each position has one next position; matching means the same position, not two cars with the same color. Branching roads need another method. |
| Tree DFS | Each child counts their own little family branch and passes the total to their parent. Parents combine the returned totals. | Each subtree is counted once; the leaf/base case starts the calculation. A long thin family tree still needs a long stack. |
| Graph BFS/DFS | Explore connected rooms. BFS visits all rooms one door away before those two doors away; DFS follows one corridor deeply before returning. | Keep visited marks. BFS minimizes door count when every move counts equally, not arbitrary travel cost. |
| Topological order | Breakfast has prerequisites: put bread in the toaster before taking out toast, then spread the jam. | Any order satisfying all arrows is acceptable. Circular requirements mean there is no complete valid order. |
| Backtracking | Pick a shirt and trousers for a doll, check the rules, then undo a choice to try the next outfit. | A partial outfit is a search state. Prune only if no remaining choice can repair it; many possible outfits can still require much work. |
| Dynamic programming | A game asks how many routes reach each stair using one-step or two-step moves. Write each stair's answer on a card and reuse it. | Define exactly what the card means; combine earlier answers and give the first cards explicit values. The number of cards and work per card determine the cost. |
| Greedy | Choose story-time sessions that end early enough to leave room for more sessions. | Show why replacing the first choice with the earliest-finishing one cannot reduce the count. Different session rewards can change the best choice. |

For complexity, begin with "How many things do we check as the input grows?"
and "How much extra room do we need?" With n toys, one pass takes O(n) checks;
trying every pair takes O(n²) checks; repeatedly halving a search range takes
O(log n) guesses under the stated model. Extra storage includes reminder cards,
waiting rooms/queues and unfinished recursive calls. These are growth models,
not stopwatch predictions. Make the first derivation concrete before using
symbols; later lessons still identify preprocessing, expected costs and output.

Future content acceptance: a reader should be able to retell the story, map it
to a tiny input, explain the safe step in their own words, and identify one case
where the analogy does not transfer. Check explanatory steps and actual code in
final review; no readability score or age-level learning study is claimed.

Recommend a standalone **DSA Patterns** reference at proposed slug `dsa-patterns`,
with an **Algorithms** group. These are editorial recommendations: the current
registry has five other groups and no DSA entry. A numbered lifecycle stage would
change the project's eighteen-stage model; this material fits the reference hub.
Leave the stage tether absent unless a later design identifies a useful one.

Eight study sections would keep the proposed fifteen techniques navigable:

| Section | Teaching scope |
| --- | --- |
| Foundations and complexity | Input/output contracts; arrays, maps, stacks, queues and adjacency lists; invariants; cost model; how to explain an approach. |
| Scan and remember | Hash complements/counting, ordered two pointers, fixed/variable windows, prefix sums and prefix-frequency maps. |
| Search and intervals | Sorted/boundary binary search and monotone answer search; event sweeps and endpoint semantics. |
| Keep useful candidates | Monotonic stack and bounded top-k heap; explain why a candidate can be discarded. |
| Follow nodes | Fast/slow linked successors and tree DFS with child summaries. |
| Explore connections | Graph DFS/BFS, components, unweighted shortest paths and topological dependencies. |
| Explore choices and reuse answers | Backtracking and introductory DP; state meaning, base cases and search/output size. |
| Make and defend a choice | Greedy exchange argument; mixed problems with the pattern label initially hidden. |

This is a proposed outline, not eight equally sized panels. The existing
four-screen default-panel budget still applies; authoring may require splitting
sections. Selection exercises should occasionally offer more than one valid
approach and compare their costs under the given constraints.

### What each pattern should teach

Each lesson should start from an original problem and its brute-force baseline,
then show the information that repeated work wastes. Derive the maintained
invariant or recurrence before showing a reusable code shape. Trace one small
input in a semantic table, including a boundary case. The JavaScript solution
must connect its variables to that trace.

Follow the solution with a correctness explanation, a time/space derivation and
a concrete changed condition that breaks the approach. Include an original
interview question with an answer and a follow-up, then one local predict/debug/
implement exercise with its solution initially hidden. Link two external
transfer problems when they add distinct reasoning. Those links supplement the
lesson; the reader should not need an external editorial to understand it.

The matrix verifies a minimum of one original exercise per pattern. Two transfer
links per lesson and fully authored JavaScript solutions are a proposed future
content budget, not completed research deliverables or user-selected quotas.
All interview questions here are illustrative originals, not reported company
questions.

### Complexity overview

Start with what grows: n items, two input lengths, vertices/edges, tree height,
window size, output count or a numeric target. Big-O is an upper bound; it does
not mean worst-case by definition. State whether an analysis is worst-case,
expected or amortized and use a tight bound when justified. J3 supports these
notation and input-model distinctions.

Show the familiar growth rates from O(1), O(log n), O(n) and O(n log n) through
O(n²), O(2^n) and O(n!). Derive them from work: successive loops add, independent
nested ranges multiply, repeated halving gives logarithms, and a moving boundary
may amortize a nested loop. These are calculations to defend, not rules based
only on how many loops appear in the code.

Account for preprocessing, lookup/comparison costs, recursive frames, copies,
visited state and output. Explain that O(h) is O(n) on a chain, retaining all
permutations costs more than the recursion path, and an O(cX) DP is not linear
in the bit-length of X. The matrix supplies the supporting algorithm-specific
sources and assumptions.

### Example of the intended teaching depth

Use a variable-window lesson to make the decision visible. For a longest segment
of distinct values, extend right and remove from the left until the range is
distinct again. Both boundaries move only forward; moving left cannot create a
duplicate. This invariant is the reason the approach works. S2 supports the
technique; the following inputs and reasoning are original illustrations.

For the separate task "longest segment with sum at most 4" on nonnegative
values `[2, 1, 3, 2]`, the trace is:

| Right index | Value added | Repair | Valid window afterwards | Sum | Best length |
| --- | --- | --- | --- | --- | --- |
| 0 | 2 | None | `[2]` | 2 | 1 |
| 1 | 1 | None | `[2, 1]` | 3 | 2 |
| 2 | 3 | Remove leading 2 | `[1, 3]` | 4 | 2 |
| 3 | 2 | Remove 1, then 3 | `[2]` | 2 | 2 |

Adding a negative value changes that argument. For `[4, -3, 2]` and limit 3,
discarding the first 4 immediately misses the valid length-three range, whose
sum is 3. This does not invalidate a distinct-value window; it invalidates that
sum-shrinking rule for signed values. There is no blanket statement that
"negative numbers forbid sliding windows."

Then change the objective to counting signed-value subarrays with exact sum K.
If current prefix is P, count earlier prefixes equal to P - K. Seed the empty
prefix count, query before inserting the current prefix, and keep counts rather
than a set. This is a different algorithm; its expected linear cost assumes
the map model in J4. It is not a general replacement for the earlier longest-
sum-at-most objective. S3 supplies prefix subtraction; the frequency-map
extension is our derivation.

The interview prompt is "Why does the inner shrink loop not make this
quadratic, and what assumption would break the proof?" The model answer counts
total pointer advances and identifies the sum constraint's monotonicity. A
follow-up asks the reader to explain why exact-sum counting needs frequencies.
No executable implementation is claimed by this trace.

### Additional verified interview practice links

The coordinator opened these original LeetCode statements on 2026-11-09. The
following fit explanations are our synthesis, not copied editorials or evidence
that an employer asks the problems.

| Original problem | Why it is a useful comparison |
| --- | --- |
| [Two Sum](https://leetcode.com/problems/two-sum/) | Compare a complement map with sorting plus two pointers while preserving original indices. The task forbids reusing one position. |
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Apply distinct-window reasoning to a string; the statement's character constraints should be carried into the implementation. |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Signed elements and exact-sum counting motivate prefix frequencies; one boundary pair does not represent every matching range. |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Contrast interval union with the matrix's maximum-concurrency sweep and unweighted scheduling. This problem treats touching endpoints as overlap. |

## Delivery recommendation and acceptance

Recommend authoring the foundations plus scan/remember lessons first, then
continuing the remaining selected pattern families. This is a delivery sequence
within a study reference, not a sequence of lifecycle stages. The full proposed
coverage remains visible in this record. Select that scope before implementation;
do not silently publish a thin fifteen-row lookup and call it pattern teaching.

The current `StudySheet`, ordered `TeachingBlock` and `SheetActivity` data can
represent explanations, code, state tables, model answers and local practice.
Keep content in one canonical module and generated Markdown. Review
[PATTERNS](../web/PATTERNS.md#focused-study-references--studysheet) before designing
the delivered page. A new category affects shared discovery and coverage guards;
use D-99's consequential path if that category or shared behavior is selected.
No visual mockup, new control or renderer extension is selected by this research.

Acceptance for the future authored reference should establish that a reader can
choose an approach from constraints, explain its safe step, trace state, write or
repair a solution, and derive both costs. Verify the actual published JavaScript
against brute-force oracles on bounded small cases and adversarial examples,
including duplicates, empty/single cases where allowed, boundary timestamps,
signed sums, disconnected/cyclic graphs and deep chains. These are meaningful
future checks, not tests run in this research. Validate generated parity and the
finished page's keyboard/history/reveal behavior and layout with the existing
app gate and one independent final review.

Next task recommendation: scope selection and compact design/plan with
**GPT-6 Astra / Low**, returning to coordinator
`01a1bedf-bdad-7b72-ba40-9b5406807d43`. Implementation then uses a fresh
user-selected **GPT-6.1 Sol / High** session under D-100, starting from the exact
approved documentation commit and returning branch/commit/checks/session to that
coordinator. A plan is not merge approval. Other language sheets, broader
JavaScript teaching, additional advanced algorithms, runner/scoring/persistence,
push and promotion remain separate.

## Research validation and limits

Opened all 16 core-practice URLs plus the optional DSU task, the interval-boundary
comparison and four additional LeetCode statements; confirmed task titles and
constraints relevant to fit. Source URLs above resolved through the research
browser except the explicitly excluded Princeton page. Checked source/problem
distinctions, expected versus worst-case hashing, amortized stack/DSU costs,
sorting overhead, stack/output storage, unweighted BFS, monotone answer search
and DP dimensions by inspection. No algorithm solution or app implementation
was executed. No interview-frequency dataset was consulted, so none is claimed.
The humanizer editing pass was applied to new prose; the intended voice is plain
technical guidance. Closing content/link/ledger checks are recorded in the
tracker completion entry, separately from future implementation checks.
