import { family } from './lesson'
export const stdlib = family(
  'standard-library',
  'Standard library',
  'Prerequisites: Collections (#collections) and Iteration and generators (#iteration-and-generators). Pick structures by observable state and operations. These examples use APIs present in Python 3.12, including the min-heap API rather than newer max-heap additions.',
  [
    {
      id: 'counting-and-grouping',
      title: 'Count and group with an explicit missing-key policy',
      summary:
        'Counter reads missing counts as zero; defaultdict indexing creates missing groups.',
      model:
        'Counter is a dict subclass for counts: accessing a missing key yields zero without inserting it. defaultdict calls a supplied factory when indexing a missing key, then inserts that result. get does not invoke that factory. Grouping retains values and can require memory proportional to all input records; counting retains only one entry per distinct key. This example preserves the first-seen order of groups and makes zero-count retention visible.',
      code: 'from collections import Counter, defaultdict\n\nlabels = ["River", "Hill", "River"]\ncounts = Counter(labels)\ngroups = defaultdict(list)\nfor index, label in enumerate(labels):\n    groups[label].append(index)\nprint(dict(counts), dict(groups))\nprint(counts["Lake"], "Lake" in counts)\nprint(groups.get("Lake"), "Lake" in groups)\nprint(groups["Lake"], "Lake" in groups)\ncounts["River"] -= 2\nprint(counts["River"], "River" in counts)',
      trace: {
        label: 'Missing reads can mutate or leave state alone',
        columns: ['Operation', 'State transition', 'Result'],
        rows: [
          ['Counter labels', 'River:1 → River:2; Hill:1', '{River:2, Hill:1}'],
          ['counts[Lake]', 'No insertion', '0 and membership False.'],
          ['groups.get(Lake)', 'No factory call', 'None and membership False.'],
          ['groups[Lake]', 'list() then insertion', '[] and membership True.'],
          ['Subtract to zero', 'Entry retained', 'River:0 still present.'],
        ],
      },
      contrast:
        'Using groups[key] just to inspect can create empty groups. Choose get for a nonmutating optional read. Removing zero counts is a separate normalization policy, not automatic subtraction behavior. For a streaming report with many distinct titles, even Counter can grow with distinct-key count; “streaming” does not mean constant memory for arbitrary grouping.',
      question: 'When should I store groups instead of counts?',
      answer:
        'Store groups when later work needs each original member; store counts when only frequencies are needed. A defaultdict simplifies append-to-group initialization but changes missing-key indexing into a write. State the retained-data and missing-read contracts before choosing the convenience API.',
      practice: {
        title: 'Count normalized labels without retaining rows',
        prompt:
          'Implement frequencies(labels): strip/casefold, ignore blanks, count duplicates and return a plain dict. Test empty input and repeated variants.',
        starter:
          'def frequencies(labels):\n    # TODO: count without grouping original rows\n    pass',
        solution:
          'from collections import Counter\n\ndef frequencies(labels):\n    counts = Counter()\n    for raw in labels:\n        label = raw.strip().casefold()\n        if label:\n            counts[label] += 1\n    return dict(counts)\n\nassert frequencies([" River ", "river", "HILL", " "]) == {"river": 2, "hill": 1}\nassert frequencies([]) == {}',
        answer:
          'Increment a Counter by normalized key and return dict(counts).',
        explanation:
          'Only aggregate counts survive; duplicate source rows are not retained. Memory still grows with distinct normalized labels.',
      },
    },
    {
      id: 'queues-and-heaps',
      title: 'Separate FIFO order from priority order',
      summary:
        'deque serves endpoints; a heap keeps the smallest item at its root, not a fully sorted array.',
      model:
        'A deque supports appends and pops at either end with approximately constant-time endpoint operations. Removing index zero from a CPython list shifts later references and costs linear work. A min-heap maintains parent ≤ child so heap[0] is the smallest; other positions need not be sorted. Heap insertion/removal is logarithmic in element count under bounded comparison costs. Add a monotonically increasing tie breaker before an unorderable payload to define equal-priority order.',
      code: 'from collections import deque\nfrom heapq import heappush, heappop\nfrom itertools import count\n\nqueue = deque(["River", "Hill"])\nqueue.append("Lake")\nprint(queue.popleft(), list(queue))\nheap = []\nserial = count()\nfor priority, title in [(2, "Hill"), (1, "River"), (1, "Lake")]:\n    heappush(heap, (priority, next(serial), {"title": title}))\nprint(heap[0][2]["title"])\nprint([heappop(heap)[2]["title"] for _ in range(len(heap))])',
      trace: {
        label: 'Queue and priority states',
        columns: ['Operation', 'Intermediate structure', 'Promise'],
        rows: [
          [
            'deque append Lake',
            '[River,Hill,Lake]',
            'popleft returns River; Hill,Lake remain.',
          ],
          [
            'push priority 2 then 1',
            'Root becomes River priority 1',
            'Root smallest; array not globally sorted.',
          ],
          [
            'push Lake priority 1',
            'Serial distinguishes equal priorities',
            'No comparison of dict payloads needed.',
          ],
          [
            'Repeated pop',
            'River, Lake, Hill',
            'Ascending priority; stable tie policy from serial.',
          ],
        ],
      },
      contrast:
        'Without the serial, equal priorities can force tuple comparison of dict payloads and raise TypeError. Sorting heap’s backing list for display is separate from maintaining the heap; never assume iteration emits priority order. For top-k largest values under 3.12, retain a min-heap of at most k and replace the root when a larger candidate arrives. Validate k and account for O(k) storage.',
      question: 'Why did adding a second equal-priority job raise TypeError?',
      answer:
        'Tuple comparison moved past equal priorities to compare payloads that have no ordering. A distinct serial field resolves ties before reaching the payload. That also states which equal-priority job should run first, instead of relying on incidental object ordering.',
      practice: {
        title: 'Choose a recent-history and priority structure',
        prompt:
          'Choose structures for the last 50 events, FIFO job dispatch and repeatedly selecting the highest-scoring ten items from a stream. What extra policy do equal priorities require?',
        answer:
          'deque(maxlen=50), deque with append/popleft, and a size-ten min-heap for top scores. Use a tie breaker and define equal-priority order.',
        explanation:
          'The operation pattern determines the invariant. A heap supports repeated selection without retaining every stream value; it is not a sorted-view replacement.',
      },
    },
    {
      id: 'ordering-and-search',
      title: 'Preserve ties and separate search from insertion',
      summary:
        'Stable sort retains equal-key order; bisect finds a position without moving any items.',
      model:
        'sorted returns a new list; list.sort mutates in place and returns None. Both are stable: items whose keys compare equal retain their original relative order. key computes the comparison key once per element for sorting. bisect_left/right find insertion positions in an already sorted sequence using comparisons; they do not establish that precondition or prove equality. Binary search uses logarithmic comparisons, while inserting into a CPython list still shifts references and is linear.',
      code: 'from bisect import bisect_left, bisect_right, insort_right\n\nrows = [("River", 2), ("Hill", 1), ("Lake", 2)]\nordered = sorted(rows, key=lambda row: row[1])\nprint(ordered)\nprint(rows)\nvalues = [1, 2, 2, 4]\nprint(bisect_left(values, 2), bisect_right(values, 2))\nprint(bisect_left(values, 0), bisect_right(values, 9))\ninsort_right(values, 2)\nprint(values)',
      trace: {
        label: 'Equal keys and insertion boundaries',
        columns: ['Operation', 'State', 'Reason'],
        rows: [
          [
            'sort by count',
            'Hill, River, Lake',
            'River remains before Lake at equal count 2.',
          ],
          [
            'original rows',
            'River,Hill,Lake unchanged',
            'sorted allocated another outer list.',
          ],
          [
            'bisect 2',
            'left=1, right=3',
            'Positions before/after the equal run.',
          ],
          [
            'outside bounds',
            '0 and 4',
            'Valid insertion positions, not matching indices.',
          ],
          [
            'insort_right 2',
            '[1,2,2,2,4]',
            'Search plus actual list insertion.',
          ],
        ],
      },
      contrast:
        'For membership after bisect_left, first test index < len(values), then values[index] == target. The insertion index may be len(values) or point at a different value. Sorting an index while source data changes needs an update policy. Cost includes comparison/key work; a more complex ordered index may be justified for frequent insertions at large scale.',
      question: 'Does binary search make sorted-list insertion O(log n)?',
      answer:
        'It reduces the search comparisons to logarithmic work, but insertion into a list can shift a linear number of elements. State both phases and the operation mix. Stability also gives a useful correctness contract for equal sort keys, independent of the final key values.',
      practice: {
        title: 'Find exact membership at the boundary',
        prompt:
          'Use bisect_left to search [], [1,2,2,4] for 2, 3 and 9. Explain the bounds/equality checks and which equal element is selected.',
        answer:
          'Reject index == len(values); otherwise compare values[index] to target. For 2 choose the first equal index 1; 3 points at 4 but is absent; 9 points after the end.',
        explanation:
          'An insertion point is not proof of presence. Empty and after-end cases catch unchecked indexing.',
      },
    },
  ],
)
