import { family } from './lesson'
export const objects = family(
  'names-and-objects',
  'Names and objects',
  'Prerequisite: Runtime and syntax (#runtime-and-syntax). Draw names and container slots as references to objects. Use this panel to explain what a function may change, isolate a report’s children and assign explicit cleanup ownership.',
  [
    {
      id: 'binding-and-identity',
      title: 'Trace binding before choosing is or ==',
      summary:
        'A parameter gets a reference; mutation and rebinding have different reach.',
      model:
        'A name refers to an object with identity, type and value. Assignment makes a binding, not an independent object. A list is a mutable ordered container; its slots refer to objects too. When calling a function, the parameter is a new local binding to the supplied object. == asks for equality according to the type’s contract; is asks whether both references name the same object. Test the None singleton with is None; avoid identity puzzles involving literal caching.',
      code: 'def revise(items):\n    items.append("reviewed")\n    items = ["local"]\n    return items\n\noriginal = ["draft"]\nalias = original\nreturned = revise(original)\nequal = ["draft", "reviewed"]\nprint(original, returned)\nprint(alias is original, equal == original, equal is original)\nbox = (original,)\nbox[0].append("approved")\nprint(original)',
      trace: {
        label: 'Parameter binding and caller state',
        columns: ['Step', 'Local binding', 'Caller sees'],
        rows: [
          [
            'revise(original)',
            'items and original reach one list',
            '["draft"]',
          ],
          ['append', 'Same list changes', '["draft", "reviewed"]'],
          [
            'items = ["local"]',
            'items now reaches a second list',
            'original still reaches the first list.',
          ],
          [
            'tuple child append',
            'Tuple slot is unchanged',
            'The list reached through it gains approved.',
          ],
        ],
      },
      contrast:
        'Changing items = ["local"] to items[:] = ["local"] would replace the contents of the shared list and affect the caller. A tuple prevents changing its slots; it does not freeze objects stored in those slots. Equality of separate lists can be true while identity is false. Use the distinction to describe the object graph instead of an ambiguous pass-by-reference label.',
      question:
        'Why can a function append to my list but cannot rebind my variable?',
      answer:
        'Its parameter initially refers to the caller’s list, so mutation reaches the shared object. Reassigning that parameter changes only the function’s local binding. To replace the caller’s binding deliberately, return a result and assign it in the caller. Neither call nor assignment implies copying.',
      practice: {
        title: 'Change a tuple’s contents indirectly',
        prompt:
          'A tuple holds a list of tags. Can a function append through the tuple? Can it replace the tuple’s slot? Explain both without running an identity-address experiment.',
        answer:
          'Appending mutates the child list and succeeds. Assigning to the tuple slot raises TypeError.',
        explanation:
          'Immutability describes the tuple’s references; the child object has its own mutation rules. Test observable state, not CPython address or interning details.',
      },
    },
    {
      id: 'mutation-and-copying',
      title: 'Copy the child you intend to own',
      summary:
        'A shallow copy makes another outer container while retaining child references.',
      model:
        'Prerequisite: binding-and-identity above. A dictionary maps keys to value objects. A shallow copy creates a new dictionary whose entries initially refer to the same values. In this report, the title is an immutable string and tags is a mutable list. Replacing an entry differs from mutating its child: replacing copied["title"] changes that dictionary slot; append changes the list reached through either dictionary.',
      code: 'original = {"title": "River", "tags": ["draft"]}\nalias = original\ncopied = original.copy()\ncopied["title"] = "Hill"\ncopied["tags"].append("reviewed")\nprint(original["title"], original["tags"])\nprint(alias is original, copied is original)\n\noriginal = {"tags": ["draft"]}\ncopied = original.copy()\ncopied["tags"] = ["reviewed"]\nprint(original["tags"], copied["tags"])',
      trace: {
        label: 'Two dictionaries, one child list',
        columns: ['Operation', 'Outer dictionary', 'Child / cause'],
        rows: [
          [
            'alias = original',
            'One dictionary, two bindings',
            'No copy occurred.',
          ],
          [
            'original.copy()',
            'A second dictionary exists',
            'Both dictionaries still refer to the tags list.',
          ],
          [
            'replace copied title',
            'Only copied changes its title slot',
            'The shared list has not changed yet.',
          ],
          [
            'append through copied',
            'Dictionaries remain distinct',
            'original reaches ["draft", "reviewed"] too.',
          ],
          [
            'replace copied tags',
            'Only copied gets a new list reference',
            'The original list remains ["draft"].',
          ],
        ],
      },
      contrast:
        'To isolate a list of strings, copy the dictionary and the tags list. If tags contains dictionaries with child lists, that selective shallow repair still shares deeper state. deepcopy recursively copies supported objects and uses a memo to preserve sharing and cycles inside the copied graph. It may copy more than the contract needs; it cannot generally clone external resources such as open files. Decide which relationships should remain shared first.',
      question: 'What does dict.copy guarantee for a nested report?',
      answer:
        'A separate outer mapping, with the same initial key/value references. An independent title assignment is safe, but a nested append can still affect the source. Selectively copy the mutable children the new owner may change, or choose a deep-copy contract with suitable inputs. Copying depth is an ownership decision.',
      practice: {
        title: 'Independent report requests',
        prompt:
          'Implement independent(report) for tags shaped as [{"labels": ["draft"]}]. Two requests must change their own nested labels without changing each other or the source. Then explain a cheaper repair when tags is only a list of strings.',
        starter:
          'def independent(report):\n    # TODO: isolate nested tag records\n    pass',
        solution:
          'from copy import deepcopy\n\ndef independent(report):\n    return deepcopy(report)\n\nsource = {"tags": [{"labels": ["draft"]}]}\na = independent(source)\nb = independent(source)\na["tags"][0]["labels"].append("reviewed")\nassert source["tags"][0]["labels"] == ["draft"]\nassert b["tags"][0]["labels"] == ["draft"]\nassert a["tags"][0]["labels"] == ["draft", "reviewed"]',
        answer:
          'Use a recursive copy for this plain nested data. With string-only tags, a fresh dictionary plus tags.copy() isolates the only mutable child.',
        explanation:
          'deepcopy preserves internal sharing within each copied graph via its memo. The test needs two independent calls and a nested mutation; different outer identities alone would miss the bug.',
        followUp:
          'If two source fields intentionally share one tag record, should the copy retain that sharing? What if a field is a live file handle?',
      },
    },
    {
      id: 'lifetime-and-resources',
      title: 'Separate reachability from resource ownership',
      summary:
        'Removing a name does not establish when an external handle closes.',
      model:
        'Objects remain reachable while references lead to them, including container slots and closures. del removes a binding or container entry; it is not a portable command to destroy an object now. CPython often reclaims unreferenced objects promptly through reference counting, but cycles and implementation details make that unsuitable as a file-cleanup contract. A context manager gives a lexical owner a defined exit boundary.',
      code: 'from tempfile import TemporaryFile\n\nwith TemporaryFile(mode="w+", encoding="utf-8") as handle:\n    alias = handle\n    handle.write("River\\n")\n    handle.seek(0)\n    print(alias.readline().strip(), handle.closed)\nprint(alias.closed)\n\nitems = ["draft"]\nkeepers = [items]\ndel items\nprint(keepers[0])',
      trace: {
        label: 'Reference lifetime versus file lifetime',
        columns: ['Point', 'Reference', 'Resource'],
        rows: [
          [
            'Inside with',
            'handle and alias name the same file',
            'Open; prints River False.',
          ],
          [
            'After with',
            'alias still names the file object',
            'Closed; prints True.',
          ],
          [
            'del items',
            'keepers still holds the list',
            'The list remains reachable; no file involved.',
          ],
        ],
      },
      contrast:
        'Keeping alias does not keep a with-owned file open after exit; closing a resource and destroying its object are separate events. Forgetting with and relying on del handle is fragile if another reference survives. Files and data later shows how generators can retain open files while suspended and why early exit needs an explicit owner.',
      question: 'Does a garbage collector replace with?',
      answer:
        'No. Garbage collection concerns object memory and reachability. with invokes a resource’s exit protocol at a specific scope boundary, including exceptional exits. Keep resource use inside its owner’s lifetime and test closed state after success and failure instead of depending on collection timing.',
      practice: {
        title: 'Retained reference, closed handle',
        prompt:
          'A callback captures a file alias, then runs after the with block. Will the alias keep the file usable? Choose where to move the callback or ownership boundary.',
        answer:
          'The alias survives but the file is closed. Run the callback inside with or let the callback open and close its own file.',
        explanation:
          'A reference retains the Python object; it does not extend the context manager’s resource lifetime. Reopening also requires an explicit policy about changes to the file between calls.',
      },
    },
  ],
)
