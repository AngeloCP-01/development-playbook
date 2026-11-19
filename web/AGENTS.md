<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before using or changing Next.js APIs. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Routine content, data and style edits using established patterns follow the scoped
workflow in the root `AGENTS.md`; they do not require another framework-guide read.

## Python example checks

`pnpm test` executes the published Python examples. Provision conventional,
GIL-enabled CPython 3.12+ before running tests; select its executable with
`PLAYBOOK_PYTHON=/absolute/path/to/python3.12`. The fallback is `python3`.
Missing/incompatible interpreters fail with setup guidance; tests never install
packages or download runtimes. Release verification uses maintained 3.12 and 3.15
patches. CI provisions them with setup-python; the focused matrix runs only
`python-published.test.ts` and `python-published-checks.test.ts`.

The test-only checker supports macOS/Linux POSIX process groups. It gives each
case a temporary directory, an 8-second deadline and a 1 MiB output budget, then
cleans descendants (TERM, 1-second grace, KILL) and files. Its runtime tests have
a 15-second outer limit. Displayed spawn programs use explicit portable spawn;
this does not claim a Windows checker. Record the exact executable, patch,
implementation, build, platform and GIL state from `probePython()` with results.
