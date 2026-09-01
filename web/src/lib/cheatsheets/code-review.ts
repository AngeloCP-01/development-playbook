import type { Cheatsheet } from './types'

/**
 * Two gathered sources (D-89): the primary plate is Addy Osmani's "Code
 * Review and Quality" from agent-skills — five axes, a five-step process,
 * severity labels, and change sizing in one graphic. The second source is
 * an unattributed code-review checklist whose six categories corroborate
 * the axes; see reference/cheatsheet-sources.md for both.
 */
export const codeReview: Cheatsheet = {
  slug: 'code-review',
  title: 'Code Review',
  group: 'Standards',
  stage: '07-code-review',
  blurb: 'Five review axes, the severity system, and how large a PR should be.',
  source: {
    title: 'Code Review and Quality',
    author: 'Addy Osmani',
    url: 'https://github.com/nicepkg/agent-skills',
    image: {
      src: '/reference/agentic-code-review-and-quality.jpeg',
      width: 2048,
      height: 1152,
      alt: 'Code review and quality: five review axes (correctness, readability, architecture, security, performance), a five-step process, severity labels from Critical to FYI, and change sizing guidance.',
    },
  },
  sections: [
    {
      title: 'Review process',
      rows: [
        {
          term: '1. Understand the context',
          what: 'Read the PR description and linked ticket before touching the diff. Know what the change is trying to do.',
        },
        {
          term: '2. Read the tests first',
          what: 'Tests show what the author thinks the code should do. Mismatches between intent and test are the highest-signal findings.',
        },
        {
          term: '3. Walk the implementation',
          what: 'Read the diff file by file. The implementation is where the edge cases, authorization gaps, and naming issues live.',
        },
        {
          term: '4. Label every finding',
          what: 'Every comment carries a severity — Critical, Required, Consider, Nit, or FYI — so the author knows what blocks the merge.',
        },
        {
          term: '5. Check the verification',
          what: 'Confirm the author tested what they claim. A preview URL, a screenshot, a test run — not just "it works on my machine."',
        },
      ],
    },
    {
      title: 'Five review axes',
      rows: [
        {
          term: 'Correctness',
          what: 'Does it do what it claims? Edge cases and error paths, not just the happy path. Do the tests test the right thing, or the implementation?',
        },
        {
          term: 'Readability',
          what: 'Could another engineer follow it without you? 1000 lines where 100 suffice is a failure. Abstractions have to earn their complexity.',
        },
        {
          term: 'Architecture',
          what: 'Does it fit the system? Does the refactor reduce complexity, or relocate it? Is feature logic leaking into a shared module?',
        },
        {
          term: 'Security',
          what: 'Input validated at the boundary. Secrets out of code, logs and version control. External data is untrusted until proven otherwise.',
        },
        {
          term: 'Performance',
          what: 'N+1 query patterns. Unbounded loops and unconstrained fetching. Missing pagination. Large objects in hot paths.',
        },
      ],
    },
    {
      title: 'Severity labels',
      note: 'Lead with leverage. If you have one structural problem and ten nits, the structural problem is the review.',
      rows: [
        {
          term: 'Critical',
          what: 'Blocks the merge. Data loss, security breach, production outage.',
        },
        {
          term: 'Required',
          what: 'No prefix — must fix. A correctness or UX bug the user will hit.',
        },
        {
          term: 'Consider',
          what: 'Worth thinking about. A real alternative the author may not have seen.',
        },
        {
          term: 'Nit',
          what: 'The author may ignore. Polish, naming preferences, style the linter does not enforce.',
        },
        {
          term: 'FYI',
          what: 'No action needed. Context for the author — a related decision, a known limitation, a pointer to prior art.',
        },
      ],
    },
    {
      title: 'Change sizing',
      rows: [
        {
          term: '~100 lines',
          what: 'Good. Reviewable in one pass, easy to revert, high comment density.',
        },
        {
          term: '~300 lines',
          what: 'Acceptable if it is one logical change. Past this, reviewers start skimming.',
        },
        {
          term: '~1000 lines',
          what: 'Split it. Schema in one PR, backend in another, UI in a third. Each merges independently behind a flag.',
        },
      ],
    },
  ],
}
