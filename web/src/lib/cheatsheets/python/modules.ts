import { family } from './lesson'
export const modules = family(
  'modules-and-environments',
  'Modules and environments',
  'Prerequisites: Runtime and syntax (#runtime-and-syntax), Functions and scope (#functions-and-scope). Save every labelled file in the shown layout. Run from its root. Imports execute module code and bind names; environment setup selects which interpreter and dependencies that program can see.',
  [
    {
      id: 'imports-and-main',
      title: 'Observe import execution and caching',
      summary:
        'A module is a namespace; first import executes it and later imports normally reuse the cached object.',
      filename: 'main.py — beside catalog.py; run python3 main.py',
      model:
        'A module is a Python namespace usually loaded from a file. import catalog finds/loads the module, executes top-level statements on first load and binds its object. sys.modules normally caches it within this interpreter, so a later import reuses it. A name imported with from catalog import title binds that current object; later rebinding catalog.title does not update the separate local name. __name__ is "__main__" for an entry module, which lets a guard keep script work out of imports.',
      code: 'import catalog\nfrom catalog import title\nimport catalog as again\n\ncatalog.title = "Hill"\nprint(catalog is again, title, catalog.title)\nif __name__ == "__main__":\n    print("entry")',
      extra: [
        {
          id: 'imports-and-main-catalog',
          kind: 'code',
          label: 'catalog.py — sibling module',
          code: 'print("catalog loaded")\ntitle = "River"\n\ndef name():\n    return title\n\nif __name__ == "__main__":\n    print("catalog entry")',
        },
      ],
      trace: {
        label: 'First load versus cached import',
        columns: ['Statement', 'Namespace / cache', 'Output'],
        rows: [
          [
            'import catalog',
            'Module executes and is cached',
            'catalog loaded once',
          ],
          [
            'from import / alias import',
            'Separate title binding / same cached module',
            'No second load print.',
          ],
          [
            'catalog.title = Hill',
            'Module binding changes; local title stays River',
            'True River Hill',
          ],
          ['main guard', 'main.py is entry', 'entry; no catalog entry.'],
        ],
      },
      contrast:
        'Import side effects such as file writes or starting threads happen during loading and can surprise tests or spawn children. Keep reusable definitions importable and entry actions guarded. reload is an explicit different operation and does not refresh every existing reference. Never name your own file json.py or asyncio.py when you intend to import the standard library: search-path shadowing can load your file instead.',
      question: 'Why did from-import retain the old title?',
      answer:
        'It created a local binding to the string object present at import time. Rebinding catalog.title changes the module’s binding, not every imported name. A shared mutable object would expose its mutations through both references, which is the same binding-versus-mutation distinction taught in Names and objects.',
      practice: {
        title: 'Move work behind an entry boundary',
        prompt:
          'A reusable module starts a process every time it is imported. Choose what belongs at top level and what belongs in a guarded main function. What happens under spawn?',
        answer:
          'Keep definitions/import-safe constants at top level; put process startup in main and call it under if __name__ == "__main__". Spawn imports the module, so unguarded startup can recursively create processes.',
        explanation:
          'The guard defines entry ownership. Caching is per interpreter and does not prevent a new child interpreter from importing the module.',
      },
    },
    {
      id: 'package-layout',
      title: 'Run a package with its import context',
      summary:
        '-m supplies package context for relative imports; a cycle can observe partially initialized names.',
      filename:
        'books/main.py — root contains books/__init__.py and books/model.py; run python3 -m books.main',
      model:
        'A package groups modules under an import namespace. In this regular package, __init__.py marks the directory and is intentionally minimal. A relative import such as from .model imports within that package. Running python3 -m books.main from the root establishes package context; python3 books/main.py runs a file without that context, so the relative import fails. Import cycles are not always errors, but a module can be cached before its top-level execution has created every name.',
      code: 'from .model import title\n\ndef main():\n    print(title)\n\nif __name__ == "__main__":\n    main()',
      extra: [
        {
          id: 'package-layout-init',
          kind: 'code',
          label: 'books/__init__.py — complete file',
          code: '"""Local book-report package."""',
        },
        {
          id: 'package-layout-model-file',
          kind: 'code',
          label: 'books/model.py — complete file',
          code: 'title = "River"',
        },
        {
          id: 'package-layout-cycle-a',
          kind: 'code',
          label:
            'cycle_a.py — intentional broken sibling cycle; run python3 cycle_a.py',
          code: 'from cycle_b import label\nname = "River"\nprint(label)',
        },
        {
          id: 'package-layout-cycle-b',
          kind: 'code',
          label: 'cycle_b.py — broken cycle partner',
          code: 'from cycle_a import name\nlabel = name.upper()',
        },
      ],
      trace: {
        label: 'Package execution and an incomplete module',
        columns: ['Invocation / import', 'Context / state', 'Outcome'],
        rows: [
          [
            '-m books.main',
            'books package context exists',
            'Relative model import succeeds; River.',
          ],
          [
            'books/main.py directly',
            'No known parent package',
            'ImportError before main.',
          ],
          [
            'cycle_a → cycle_b → cycle_a',
            'First module has not finished assigning names',
            'ImportError for a partially initialized module.',
          ],
          [
            'Repair direction',
            'Move shared definition to a third leaf module',
            'Both depend on it; no back edge.',
          ],
        ],
      },
      contrast:
        'Changing a relative import to an accidental working-directory import can hide the context defect and fail elsewhere. Design a clear package entry and dependency direction. A local import inside a function can defer a dependency, but it does not cure every cycle or make startup side effects safe. The repair activity removes the back edge by placing the shared data in a leaf module.',
      question: 'Why is an import cycle sometimes visible only at startup?',
      answer:
        'A first import executes modules in dependency order and may expose a cached but partially initialized module. A later import after successful initialization can find all names. Keep definitions in a dependency direction that does not require reading unfinished peer state; a successful warm import is not evidence that fresh startup works.',
      practice: {
        title: 'Remove the cycle’s back edge',
        prompt:
          'Repair cycle_a/cycle_b by making the shared name a leaf dependency. Provide common.py, formatter.py and entry.py with no hidden helper.',
        answer:
          'Place name in common.py, import it from formatter.py, and let entry.py import the formatter result.',
        explanation:
          'The dependency graph becomes entry → formatter → common. The actual multi-file check runs fresh startup, so cached state cannot conceal the cycle.',
        solution:
          'from formatter import label\n\nif __name__ == "__main__":\n    print(label)',
        followUp:
          'Use the two companion files below with this entry; why is moving only the print insufficient?',
      },
    },
    {
      id: 'environments-and-dependencies',
      title: 'Select the interpreter before installing dependencies',
      summary:
        'venv isolates installed packages; declared ranges and resolved environments serve different purposes.',
      model:
        'A virtual environment is a directory containing interpreter entry points and an isolated package installation context. It reuses a base Python runtime and is disposable rather than portable across arbitrary machines. python -m pip runs pip associated with that selected interpreter. Activation mainly changes shell PATH; an explicit .venv/bin/python works without activation on POSIX, while Windows uses .venv\\Scripts\\python.exe. Dependency declarations express permitted requirements; a reproducible resolution also records selected versions and installation artifacts/tool policies.',
      code: 'import sys\nimport platform\n\nprint(platform.python_implementation())\nprint("supported", sys.version_info >= (3, 12))\nprint("venv", sys.prefix != sys.base_prefix)\nprint("executable", sys.executable)',
      extra: [
        {
          id: 'environments-and-dependencies-commands',
          kind: 'code',
          label:
            'POSIX setup commands — provision separately, never run by example tests',
          code: 'python3.12 -m venv .venv\n.venv/bin/python -m pip --version\n.venv/bin/python -m pip install -e .',
        },
        {
          id: 'package-layout-common',
          kind: 'code',
          label: 'common.py — cycle repair companion',
          code: 'name = "River"',
        },
        {
          id: 'package-layout-formatter',
          kind: 'code',
          label: 'formatter.py — cycle repair companion',
          code: 'from common import name\nlabel = name.upper()',
        },
      ],
      trace: {
        label: 'Interpreter and installation identities',
        columns: ['Action', 'What it chooses', 'Limit'],
        rows: [
          [
            'python -m venv',
            'Base runtime for a new environment',
            'Does not itself choose all application dependencies.',
          ],
          [
            'Explicit environment Python',
            'Runtime and its package paths',
            'No activation required.',
          ],
          [
            'python -m pip',
            'pip for this interpreter',
            'Distribution names need not match import names.',
          ],
          [
            'Version range / resolution',
            'Allowed versions / chosen artifacts',
            'A range alone is not a reproducible lock.',
          ],
        ],
      },
      contrast:
        'A bare pip command can refer to a different interpreter on PATH. A project-local json.py can shadow the standard library even in a venv; isolation is not a sandbox or a cure for module names. These lessons use only the standard library and install nothing during verification. Check compatibility against the actual Python implementation, patch and build.',
      question: 'What would you record to reproduce a Python example failure?',
      answer:
        'The exact interpreter path, version/build/platform, invocation and working directory, input fixture, dependency resolution and full exception. A venv identifies installation context but is not a portable deployment artifact. Recreate it from declared and resolved requirements with the supported interpreter.',
      practice: {
        title: 'Diagnose the wrong pip',
        prompt:
          'A dependency is installed but import fails in .venv/bin/python. What do you inspect before installing it again, and what does a dependency range leave unresolved?',
        answer:
          'Inspect the interpreter path and run .venv/bin/python -m pip to inspect its installation context. Check distribution versus import names and local shadowing. A range leaves exact versions/artifacts and resolution choices open.',
        explanation:
          'Repeated installation into the wrong interpreter repeats the defect. Reproducibility starts by identifying the process that actually runs the program.',
      },
    },
  ],
)
