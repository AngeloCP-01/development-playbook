import { highlightedHtml } from './highlighted.generated'
import type { Cheatsheet, RowExample } from './types'

function withHtml(examples: { label: string; code: string }[]): RowExample[] {
  return examples.map((ex) => ({ ...ex, html: highlightedHtml[ex.code] }))
}

/**
 * Two gathered sources, one displayed (D-89's convention): "5 Types of
 * Testing" and the matching dev.to article are both by Prateek Agrawal and
 * corroborate each other, so that pair is the displayed plate and the
 * source of the five rows below. The pyramid graphic is unattributed and
 * its concept — not its image — is what the second section transcribes;
 * see reference/cheatsheet-sources.md for both.
 */
export const testing: Cheatsheet = {
  slug: 'testing',
  title: 'Testing',
  group: 'Standards',
  stage: '06-testing',
  blurb:
    'The five types, why the pyramid is shaped that way, and what this repo runs.',
  source: {
    title: 'The 5 Pillars of Testing',
    author: 'Prateek Agrawal',
    url: 'https://dev.to/prateekbka/the-5-pillars-of-testing-a-senior-developers-cheat-sheet-1ckj',
    image: {
      src: '/reference/testing-types.webp',
      width: 800,
      height: 957,
      alt: 'Five types of testing: unit, integration, end-to-end, performance and security, each with a one-line definition.',
    },
  },
  sections: [
    {
      title: 'Five types',
      rows: [
        {
          term: 'Unit testing',
          what: 'Tests individual functions, components or classes in isolation, before they interact with anything else.',
          when: 'Common tools: Jest, Vitest, Mocha.',
          example: withHtml([
            {
              label: 'Vitest',
              code: "import { expect, test } from 'vitest'\n\ntest('adds numbers correctly', () => {\n  expect(add(2, 3)).toBe(5)\n})",
            },
          ]),
        },
        {
          term: 'Integration testing',
          what: 'Tests how multiple components or services interact — an API with a database, service-to-service, queue-to-worker.',
          when: 'Catches bugs in the contract between systems, not inside either one. Common tools: Supertest, Postman, Jest with mocks.',
        },
        {
          term: 'End-to-end (E2E) testing',
          what: 'Simulates a complete user workflow, start to finish, through the real interface.',
          when: 'Validates the system the way a user actually experiences it. Common tools: Playwright, Cypress, Selenium.',
        },
        {
          term: 'Performance testing',
          what: 'Tests system behaviour under load, to find bottlenecks before users hit them.',
          when: 'Common tools: k6, Apache JMeter, Lighthouse.',
        },
        {
          term: 'Security testing',
          what: 'Proactively searches for vulnerabilities — SQL injection, XSS, broken authentication — before an attacker does.',
          when: 'Common tools: Snyk, OWASP ZAP, SonarQube.',
        },
      ],
    },
    {
      title: 'The pyramid — why the proportions matter',
      note: 'Same five types, arranged by how many of each you should actually write. The shape is the point: broad and cheap at the bottom, narrow and expensive at the top.',
      rows: [
        {
          term: 'Unit tests — the base',
          what: 'The most numerous by far. Fast, isolated, cheap to write and to run.',
          when: "This repo's own split: the `unit` and `dom` Vitest projects, run on every push — by far the largest of the three suites, and fast enough to run that often without slowing anyone down.",
        },
        {
          term: 'Integration tests — the middle',
          what: 'Fewer than unit tests. Slower, because real collaborators are involved instead of mocks.',
          when: 'This repo leans light here by design — most of what would be an integration test is instead an E2E check against a real build.',
        },
        {
          term: 'E2E tests — the top',
          what: 'The fewest, and the slowest and most brittle by nature — a real browser, a real build, every layer in between.',
          when: "This repo's own audit suite — the smallest of the three by test count, run against a production build before every merge rather than on every commit.",
        },
      ],
    },
  ],
}
