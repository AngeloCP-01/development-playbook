import { family } from './lesson'
export const classes = family(
  'classes-and-protocols',
  'Classes and protocols',
  'Prerequisites: Names and objects (#names-and-objects), Functions and scope (#functions-and-scope), Iteration and generators (#iteration-and-generators). Follow class lookup and protocol calls before using dataclasses to represent validated records.',
  [
    {
      id: 'instances-and-methods',
      title: 'Give each instance its own mutable fields',
      summary:
        'Class attributes are shared; bound methods supply self to instance operations.',
      model:
        'A class is an object used to construct instances. __init__ initializes a new instance; self is the instance parameter by convention. A method accessed through an instance is bound: calling batch.add("River") supplies batch as self. Attribute lookup can find class attributes when the instance has no override, so a class-level mutable collection can be accidentally shared. A property exposes controlled attribute access; classmethod receives the class, while staticmethod receives no implicit instance or class.',
      code: 'class Batch:\n    category = "books"\n    def __init__(self, titles=None):\n        self.titles = [] if titles is None else list(titles)\n    def add(self, title):\n        self.titles.append(title)\n    @property\n    def size(self):\n        return len(self.titles)\n    @classmethod\n    def empty(cls):\n        return cls()\n    @staticmethod\n    def clean(title):\n        return title.strip()\n\na = Batch.empty()\nb = Batch.empty()\na.add(Batch.clean(" River "))\nBatch.add(a, "Hill")\nprint(a.titles, b.titles, a.size, a.category)',
      trace: {
        label: 'Class lookup and instance state',
        columns: ['Operation', 'Owner', 'Result'],
        rows: [
          [
            'Batch.empty()',
            'cls is Batch; __init__ creates titles',
            'Two independent instance lists.',
          ],
          [
            'a.add',
            'Bound method supplies a',
            'River appended only to a.titles.',
          ],
          [
            'Batch.add(a, ...)',
            'Explicit self supplied',
            'Hill appended to the same a list.',
          ],
          [
            'a.size / a.category',
            'Property computes / class lookup finds',
            '2 / books',
          ],
        ],
      },
      contrast:
        'Moving titles=[] to the class and removing per-instance assignment makes a.add affect b’s view too. Rebinding a.category creates an instance attribute that shadows the class value; mutating a shared class list changes the shared object. A property can enforce a field rule but should avoid surprising hidden I/O. Initialization is still a runtime boundary: a class annotation alone validates nothing.',
      question: 'Why did two instances share a list?',
      answer:
        'They looked up the same class-level mutable object because neither instance owned a replacement. Allocate mutable fields during initialization or with a dataclass default_factory. A bound method chooses the receiver; it does not copy class attributes for it.',
      practice: {
        title: 'Repair shared batch state',
        prompt:
          'A Batch class stores titles=[] on the class. Move ownership to instances, accept optional initial titles and prevent later input-list appends from changing the batch.',
        answer:
          'Initialize self.titles = [] if titles is None else list(titles). This copies the outer sequence; nested records would still require an ownership choice.',
        explanation:
          'A separate list per instance prevents cross-instance appends, while copying supplied titles separates the input container. It does not freeze mutable title objects.',
      },
    },
    {
      id: 'inheritance-and-composition',
      title: 'Follow super along the method resolution order',
      summary:
        'super delegates to the next class in the MRO, while composition delegates to an owned object.',
      model:
        'Inheritance supports substituting a specialized object where the base contract is expected. Python computes a method resolution order (MRO) for lookup, including multiple inheritance. super() continues lookup after the current class in that order; it does not mean “call my textual parent” in every hierarchy. Cooperative methods agree on signatures and delegate once. Composition instead stores another object and calls its methods, often making a configurable dependency clearer.',
      code: 'class Base:\n    def describe(self):\n        return ["Base"]\nclass Left(Base):\n    def describe(self):\n        return ["Left"] + super().describe()\nclass Right(Base):\n    def describe(self):\n        return ["Right"] + super().describe()\nclass Report(Left, Right):\n    pass\n\nprint(Report().describe())\nprint([cls.__name__ for cls in Report.__mro__])\n\nclass Display:\n    def __init__(self, formatter):\n        self.formatter = formatter\n    def render(self, title):\n        return self.formatter(title)\nprint(Display(str.upper).render("River"))',
      trace: {
        label: 'One cooperative lookup chain',
        columns: ['Call', 'Next lookup', 'Accumulated result'],
        rows: [
          ['Report.describe', 'Find Left.describe', '[Left] + remaining chain'],
          [
            'Left super',
            'Next is Right in Report MRO',
            '[Right] + Base result',
          ],
          ['Right super', 'Next is Base', '[Left, Right, Base]'],
          [
            'Display.render',
            'Stored formatter callable',
            'RIVER; no inheritance chain needed.',
          ],
        ],
      },
      contrast:
        'Calling Base.describe(self) directly from Left bypasses Right in this hierarchy. That may be intentional in a noncooperative design, but mixing direct-base and cooperative calls can skip or repeat work. When only formatting policy varies, passing a formatter makes the dependency explicit without imposing an inheritance relationship.',
      question: 'Does super always call the direct parent?',
      answer:
        'It follows the receiver’s MRO after the class where the method was defined. In a diamond hierarchy that can reach a sibling branch before the common base. Use cooperative signatures consistently, and prefer composition when the relationship is “uses a policy” rather than a stable subtype contract.',
      practice: {
        title: 'Change formatting without a subclass',
        prompt:
          'A report needs upper-case output today and JSON tomorrow. Choose composition or inheritance and identify what the caller must be able to assume about the formatter.',
        answer:
          'Inject a formatter callable with an explicit input/result contract. The report owns when to call it; the policy owns formatting.',
        explanation:
          'Composition exposes a replaceable dependency. Tests should assert the resulting display and errors rather than a private inheritance shape.',
      },
    },
    {
      id: 'protocols-and-special-methods',
      title: 'Implement the protocol the consumer actually uses',
      summary:
        'Special methods connect syntax to type-level behavior; duck typing needs a behavioral contract.',
      model:
        'A protocol is a set of operations a consumer relies on. Duck typing uses those operations without requiring a specific base class. Python special methods connect syntax to operations: iter(x) uses __iter__, len(x) uses __len__, repr(x) uses __repr__, and == negotiates equality. Return NotImplemented for an unsupported equality partner so Python can try the other operand’s comparison; False would prematurely assert inequality. Implicit special-method lookup is generally on the type, not an arbitrary instance attribute.',
      code: 'class Titles:\n    def __init__(self, values):\n        self.values = tuple(values)\n    def __iter__(self):\n        return iter(self.values)\n    def __len__(self):\n        return len(self.values)\n    def __repr__(self):\n        return f"Titles({self.values!r})"\n    def __eq__(self, other):\n        if not isinstance(other, Titles):\n            return NotImplemented\n        return self.values == other.values\n    def __hash__(self):\n        return hash(self.values)\n\na = Titles(["River", "Hill"])\nb = Titles(["River", "Hill"])\nprint(list(a), list(a), len(a))\nprint(a == b, hash(a) == hash(b), len({a, b}))\nprint(repr(a), a.__eq__(42) is NotImplemented)',
      trace: {
        label: 'Syntax delegates to protocols',
        columns: ['Consumer', 'Method / state', 'Result'],
        rows: [
          [
            'list(a) twice',
            '__iter__ creates a fresh tuple iterator',
            'Two complete traversals.',
          ],
          ['len(a)', '__len__ returns element count', '2'],
          [
            'a == b / set',
            'Equal tuple values, matching hash',
            'True; one set entry.',
          ],
          [
            'comparison with int',
            'Unsupported type',
            'NotImplemented lets comparison negotiation continue.',
          ],
        ],
      },
      contrast:
        'Returning one stored exhausted iterator would make a reusable Titles object fail on its second traversal. Hashing by tuple contents is safe here only because the stored strings and tuple remain stable; exposing mutable hash-participating state would break key lookup assumptions. A method name alone does not establish compatible behavior or a meaningful result.',
      question: 'How do duck typing, inheritance and Protocol differ?',
      answer:
        'Duck typing is runtime use of required operations. Inheritance declares a nominal relationship and can share implementation. typing.Protocol describes structural capabilities for static checking; it does not validate values at runtime. Every approach still needs a clear behavioral contract and tests at the consumer boundary.',
      practice: {
        title: 'Repair an exhausted custom iterable',
        prompt:
          'A container stores self.cursor = iter(values) and returns it in __iter__. Repair it to allow two traversals, then explain how concurrent mutation changes the contract.',
        answer:
          'Store a stable sequence and return a fresh iterator for each traversal. If mutation is supported, define whether traversals see a snapshot or live changes.',
        explanation:
          'An iterable supplies traversal state; it should not accidentally force every consumer to share one cursor. Two list(container) calls expose the defect.',
      },
    },
    {
      id: 'dataclasses-and-typing',
      title: 'Separate generated structure from validated data',
      summary:
        'default_factory isolates fields; frozen and annotations have narrower guarantees.',
      model:
        'dataclass generates methods such as __init__, __repr__ and equality from annotated fields. field(default_factory=list) calls list for each omitted field during instance creation. frozen=True blocks ordinary field reassignment, not mutation of referenced children. Type annotations guide tools but do not enforce field or function argument types at runtime. Protocol describes a static structural interface; even runtime_checkable only checks attribute presence rather than full signature/value behavior.',
      code: 'from dataclasses import dataclass, field, FrozenInstanceError\nfrom typing import Protocol\n\nclass Sized(Protocol):\n    def __len__(self) -> int: ...\n\n@dataclass(frozen=True)\nclass Batch:\n    title: str\n    tags: list[str] = field(default_factory=list)\n\na = Batch("River")\nb = Batch("River")\nprint(a == b, a.tags is b.tags)\na.tags.append("read")\nprint(a.tags, b.tags)\ntry:\n    a.title = "Hill"\nexcept FrozenInstanceError:\n    print("field frozen")\nwrong = Batch(42)\nprint(wrong.title)',
      trace: {
        label: 'Generated methods have specific limits',
        columns: ['Action', 'Guarantee', 'Limit'],
        rows: [
          [
            'Batch twice',
            'Fresh tags lists; initial equality',
            'True False; equality does not imply identity.',
          ],
          [
            'a.tags.append',
            'Field binding is unchanged',
            'Child changes despite frozen.',
          ],
          [
            'a.title assignment',
            'FrozenInstanceError',
            'Ordinary field assignment blocked.',
          ],
          [
            'Batch(42)',
            'Constructor accepts 42',
            'Annotation did not validate a title.',
          ],
        ],
      },
      contrast:
        'A frozen dataclass with a list field is not automatically a useful hashable key; hashing the list can fail. Use immutable fields when immutable value semantics are required. For JSON input, validate shape, exact types and domain before constructing the dataclass. bool is an int subclass, so type(value) is int can express a domain that excludes booleans.',
      question: 'Can a dataclass replace input validation?',
      answer:
        'No. It generates structure from annotations but accepts runtime values without enforcing those hints. Validate decoded input at the boundary, then build the record. default_factory solves mutable default ownership; frozen limits reassignment; neither establishes domain correctness.',
      practice: {
        title: 'Create isolated typed batches',
        prompt:
          'Implement Batch with independent tags for omitted fields, then prove frozen does not freeze the tags child and an integer can still enter a str-annotated field.',
        starter:
          '# TODO: dataclass Batch(title, tags) with default_factory and frozen fields',
        solution:
          'from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Batch:\n    title: str\n    tags: list[str] = field(default_factory=list)\n\na, b = Batch("River"), Batch("Hill")\na.tags.append("read")\nassert b.tags == [] and a.tags == ["read"]\nassert Batch(42).title == 42',
        answer:
          'Use field(default_factory=list), then validate separately at an input boundary.',
        explanation:
          'Independent list state and runtime type acceptance are different claims. The tests demonstrate both instead of trusting the annotations.',
      },
    },
  ],
)
