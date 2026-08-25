import type { Cheatsheet } from './types'

/**
 * A guide to the whole, not lookup material for one stage — which is why it
 * carries no `stage` tether. Same shape the Languages group already uses for
 * sheets that do not belong to a single stage. Registered under Standards
 * rather than a new group: SDLC is a way this repo does things, same as
 * coding-standards is, just at a wider scope.
 *
 * Two sections rather than one (2026-08-25): the seven phases now carry a
 * concrete deliverable per phase, not just a definition, and a second section
 * covers how three real methodologies run the identical seven phases
 * differently — sequential, iterative, or continuous. No code examples here
 * on purpose; SDLC is a process framework, and forcing a snippet into it
 * would be answering a question nobody asked, the same restraint
 * `coding-standards`'s naming-conventions gap is waiting on a real source
 * for rather than filling with a wrong-domain one.
 */
export const sdlc: Cheatsheet = {
  slug: 'sdlc',
  title: 'Software Development Life Cycle',
  group: 'Standards',
  blurb: 'The seven phases every stage in this playbook is a close-up of.',
  source: {
    title: 'Software Development Life Cycle (SDLC)',
    author: 'Unrecorded — see reference/cheatsheet-sources.md',
    image: {
      src: '/reference/sdlc.webp',
      width: 1280,
      height: 720,
      alt: 'The seven SDLC phases arranged in a wheel: planning, requirements analysis, design, development, testing, deployment, maintenance.',
    },
  },
  sections: [
    {
      title: 'The seven phases',
      note: 'A structured process to build software that solves the right problem — not this playbook’s eighteen stages, which are filing codes for the same underlying loop, not a nineteenth sequence to memorise on top of it.',
      rows: [
        {
          term: '1. Planning',
          what: 'Define the problem, objectives, scope, resources and risks.',
          when: 'Typical output: a one-pager or project charter, a rough budget and timeline, a go/no-go decision.',
        },
        {
          term: '2. Requirements analysis',
          what: 'Gather and analyze functional and non-functional requirements.',
          when: 'Typical output: user stories, acceptance criteria, a requirements specification.',
        },
        {
          term: '3. Design',
          what: 'System architecture, database design, UI/UX and component detail.',
          when: 'Typical output: an architecture diagram, an ER diagram, wireframes or mockups.',
        },
        {
          term: '4. Development',
          what: 'Write clean, efficient code and build the application.',
          when: 'Typical output: working code, commits and pull requests, a build artifact.',
        },
        {
          term: '5. Testing',
          what: 'Test for functionality, performance, security and bugs.',
          when: 'Typical output: a test plan, a bug list, a coverage report.',
        },
        {
          term: '6. Deployment',
          what: 'Release the application to the production environment.',
          when: 'Typical output: a release, a deploy runbook, rollback steps.',
        },
        {
          term: '7. Maintenance',
          what: 'Monitor, fix issues, improve performance, and add new features.',
          when: 'Typical output: monitoring dashboards, incident postmortems, a patch or point release.',
        },
      ],
    },
    {
      title: 'How different methodologies run the loop',
      note: 'Same seven phases every time — what changes is whether they run once, in a short repeating slice, or continuously.',
      rows: [
        {
          term: 'Waterfall',
          what: 'Runs the seven phases once, in strict sequence — each phase finishes and is signed off before the next starts.',
          when: 'Requirements that are genuinely fixed and unlikely to change: regulated or safety-critical builds, fixed-price contracts.',
        },
        {
          term: 'Agile / Scrum',
          what: 'Runs a thin slice of all seven phases every sprint (one to four weeks), re-planning and re-prioritising each time.',
          when: 'Requirements that will keep changing as the product is used — most product work, this playbook’s own stage 02 included.',
        },
        {
          term: 'DevOps / Continuous',
          what: 'Collapses development, testing and deployment into one automated pipeline; a change can go from commit to production the same day.',
          when: 'A team with the automation to make releasing safe often — this playbook’s own default, see stage 11 (CI/CD).',
        },
      ],
    },
  ],
}
