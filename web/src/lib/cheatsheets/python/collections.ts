import { family } from './lesson'
export const collections = family(
  'collections',
  'Collections',
  'Prerequisites: Runtime and syntax (#runtime-and-syntax), Names and objects (#names-and-objects). Choose sequences, mappings and sets by the operations you need. Trace slots and keys before reasoning about cost.',
  [
    {
      id: 'sequences-and-slicing',
      title: 'Read slices and unpacking as new bindings',
      summary:
        'Slices exclude their stop and copy the outer sequence; unpacking binds positions.',
      model:
        'A list is an ordered mutable sequence. A tuple is an ordered sequence with fixed slots. Indices start at zero; negative indices count from the end. a[start:stop:step] selects positions and excludes stop; omitted bounds span the sequence. A list slice is a new outer list and still shares its element objects. Unpacking assigns items to names; a starred target collects remaining items into a list.',
      code: 'rows = [["River"], ["Hill"], ["Lake"]]\npart = rows[1:]\npart[0].append("read")\nfirst, *rest = rows\nprint(rows)\nprint(first, len(rest))\nprint([0, 1, 2, 3, 4][::-2])\nvalues = [3, 1, 2]\nresult = values.sort()\nprint(values, result)',
      trace: {
        label: 'Positions, slices and children',
        columns: ['Expression', 'Result', 'Ownership'],
        rows: [
          [
            'rows[1:]',
            'Outer list containing Hill and Lake lists',
            'Children still shared with rows.',
          ],
          [
            'part[0].append',
            'rows[1] becomes ["Hill", "read"]',
            'Mutation reaches the shared child.',
          ],
          [
            'first, *rest',
            'first reaches River; rest has two items',
            'Bindings do not recursively copy.',
          ],
          ['[::-2]', '[4, 2, 0]', 'Starts at the end, steps backwards by two.'],
          [
            'values.sort()',
            'values is [1, 2, 3]; result is None',
            'sort mutates and does not return the list.',
          ],
        ],
      },
      contrast:
        'Use sorted(values) when you need a new outer list and want to preserve the input order. values = values.sort() accidentally replaces the caller’s binding with None. A zero slice step raises ValueError; an out-of-range slice clips, while a single out-of-range index raises IndexError. Do not infer identical failure rules from similar bracket syntax.',
      question: 'Does rows[:] create independent rows?',
      answer:
        'It copies the sequence slots, not the mutable rows they refer to. A later element append affects both views, while replacing a slot affects only its owning list. Decide whether you need another sequence, independent row records or an immutable representation.',
      practice: {
        title: 'Repair a sorted report',
        prompt:
          'report = rows.sort() leaves report unusable. Preserve rows for another display and return only the last two items in sorted order.',
        answer:
          'Use sorted(rows)[-2:]. The new outer list is sorted and sliced; nested objects remain shared.',
        explanation:
          'Choosing a copying operation fixes the return contract but does not imply nested isolation. Empty and one-element inputs are safe slices.',
      },
    },
    {
      id: 'mappings-and-sets',
      title: 'Deduplicate while retaining first appearance',
      summary: 'Keep a set for membership and a list for the output order.',
      model:
        'A dict maps unique hashable keys to values and preserves insertion order. A set records unique hashable values, without an ordering promise. Membership in a dictionary tests keys, not values. get(key, fallback) supplies a value without inserting it; indexing a missing key raises KeyError. A keys view is live, so changing dictionary size during its iteration is unsafe. If a traversal must remove entries, snapshot the keys deliberately.',
      code: 'labels = ["river", "hill", "river"]\nseen = set()\nordered = []\nfor label in labels:\n    if label not in seen:\n        seen.add(label)\n        ordered.append(label)\nprint(ordered)\ncounts = {"river": 1, "hill": 2}\nkeys = counts.keys()\ncounts["river"] = 3\ncounts["lake"] = 1\nprint(list(keys), counts.get("missing", 0), "missing" in counts)\nfor key in list(counts):\n    if counts[key] == 1:\n        del counts[key]\nprint(counts)',
      trace: {
        label: 'Membership and output order have separate jobs',
        columns: ['Input / update', 'Membership state', 'Ordered state'],
        rows: [
          ['river', 'river added to seen', '["river"]'],
          ['hill', 'hill added to seen', '["river", "hill"]'],
          ['river again', 'Already seen', 'No append.'],
          [
            'replace river then insert lake',
            'Same river key; new lake key',
            'river, hill, lake; replacement keeps position.',
          ],
          [
            'delete via key snapshot',
            'Original key list remains iterable',
            'Only river and hill remain in counts.',
          ],
        ],
      },
      contrast:
        'list(set(labels)) gives uniqueness but cannot promise first-seen order. dict.fromkeys(labels) can combine those requirements, but learn the membership/output trace before compressing it. Iterating counts directly while deleting entries can raise RuntimeError; iterating a deliberate list(counts) snapshot separates traversal state from mutation.',
      question: 'Why use both seen and ordered?',
      answer:
        'The set answers whether an item already appeared; the list records the order of accepted first appearances. Their responsibilities differ. Dictionary insertion order can also express this contract, while set iteration order is unsuitable for deterministic display or tests.',
      practice: {
        title: 'Normalize before deduplication',
        prompt:
          'Input is [" River ", "river", "HILL"]. Keep first appearance after strip and casefold. Explain whether normalization belongs before or after membership.',
        starter:
          'def unique_labels(labels):\n    # TODO: normalize, skip blanks, preserve first appearance\n    pass',
        solution:
          'def unique_labels(labels):\n    seen = set()\n    result = []\n    for raw in labels:\n        label = raw.strip().casefold()\n        if label and label not in seen:\n            seen.add(label)\n            result.append(label)\n    return result\n\nassert unique_labels([" River ", "river", "HILL", " "]) == ["river", "hill"]\nassert unique_labels([]) == []',
        answer:
          'Normalize before checking membership, so equivalent labels share a key.',
        explanation:
          'The result remains ordered by first normalized appearance. If original spelling must be displayed, retain it separately from the normalized membership key.',
      },
    },
    {
      id: 'hash-and-equality',
      title: 'Choose a stable identity key',
      summary:
        'Equal keys need equal hashes, and a key’s hash must stay stable while stored.',
      model:
        'A hash narrows candidate positions for a hash table; equality distinguishes colliding candidates. Hashable objects must keep a stable hash through their lifetime, and objects that compare equal must have equal hashes. Lists and dicts are unhashable. A tuple is hashable only if its elements are hashable. Mutability alone is not a complete rule: a custom object can be mutable and use identity equality/hash, but a mutable value-based key is dangerous.',
      code: 'print(1 == True, hash(1) == hash(True))\nlookup = {1: "integer", True: "boolean"}\nprint(len(lookup), lookup[1])\nkey = ("river", 2026)\nprint({key: 2}[key])\ntry:\n    invalid = {("river", []): 1}\nexcept TypeError:\n    print("unhashable child")',
      trace: {
        label: 'Hash and equality decide key identity',
        columns: ['Key', 'Decision', 'Result'],
        rows: [
          [
            '1 then True',
            'Equal values and equal hashes',
            'One entry; boolean replaces its value.',
          ],
          [
            '("river", 2026)',
            'Both tuple members hashable',
            'Can address the count 2.',
          ],
          [
            '("river", [])',
            'List member is unhashable',
            'TypeError, even though the outer tuple is immutable.',
          ],
        ],
      },
      contrast:
        'A hash collision does not mean two objects are equal. Never persist Python’s hash as a stable cross-process identifier; string hashes can vary across runs. For records, define an explicit immutable key such as (title, year), and explain whether case normalization or omitting other fields intentionally merges records. Custom equality should return NotImplemented for unsupported types; classes-and-protocols develops that contract.',
      question: 'Why can a tuple fail as a dictionary key?',
      answer:
        'Tuple hashing needs hashes of all its members. A tuple containing a list cannot supply one. Convert the relevant data into a deliberately immutable key, rather than assuming that wrapping a mutable record in parentheses freezes it.',
      practice: {
        title: 'Choose the deduplication identity',
        prompt:
          'Two books have the same title and different editions. Is title a sufficient key? Propose a key and explain which duplicates it will merge.',
        answer:
          'Use (normalized_title, edition) if editions are distinct domain identities. Use a stable external ID when available and appropriate.',
        explanation:
          'Hashability makes storage possible; only the domain decides whether the equality rule is correct. A lossy key can silently merge different books.',
      },
    },
    {
      id: 'collection-costs',
      title: 'State the work hidden by an operation',
      summary:
        'Compare scans, hash lookups and copies with size and key-cost assumptions.',
      model:
        'Cost depends on the representation and the operation performed. In conventional CPython a list stores indexed references: indexing is constant-time with respect to list length, scanning membership may inspect every element, and slicing k items copies k references. Dict/set hash tables usually provide expected constant-time lookup under suitable hashing and bounded key costs; collisions and expensive equality can change that. These are qualified implementation expectations, not universal language complexity guarantees.',
      code: 'titles = ["River", "Hill", "Lake"]\nindex = {title: position for position, title in enumerate(titles)}\nchecks = 0\nfor title in titles:\n    checks += 1\n    if title == "Lake":\n        break\nprint(checks, index["Lake"])\ncopy = titles[:2]\ncopy.append("Sea")\nprint(titles, copy)',
      trace: {
        label: 'Where work and storage are spent',
        columns: ['Operation', 'Work / extra storage', 'Observed value'],
        rows: [
          [
            'Build index',
            'Visits n items; stores up to n keys',
            'River:0, Hill:1, Lake:2',
          ],
          [
            'Scan for Lake',
            'Three comparisons here; up to n generally',
            'checks = 3',
          ],
          [
            'index["Lake"]',
            'Hash and candidate equality checks',
            'position = 2; hash costs still count.',
          ],
          [
            'titles[:2]',
            'Copies two references',
            'Appending to copy does not append to titles.',
          ],
        ],
      },
      contrast:
        'For one lookup, building a complete index may cost more total work and memory than scanning. For repeated lookups over stable data it can be useful. Growing integer/string keys can make hashing or comparison costs significant. Measure realistic input and include index construction when that is part of the workload; a tiny timing is not proof of asymptotic behavior.',
      question: 'Is dictionary lookup always O(1)?',
      answer:
        'Expected constant time is a useful CPython hash-table model under assumptions about distribution and bounded hashing/equality costs. It is not a guaranteed worst-case statement or a Python-language promise. State input size, key costs and whether construction is included before comparing designs.',
      practice: {
        title: 'Pay for a one-off lookup',
        prompt:
          'A report scans ten records once; another checks a million IDs repeatedly. Compare the value and cost of a dictionary index.',
        answer:
          'A short one-off scan avoids index allocation. Repeated checks can amortize index construction and use expected fast membership, at the cost of extra memory and invalidation policy.',
        explanation:
          'The operation mix and lifecycle determine the choice. Neither an index nor a list is globally fastest.',
      },
    },
  ],
)
