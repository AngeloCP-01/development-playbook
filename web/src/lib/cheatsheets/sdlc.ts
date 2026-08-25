import type { Cheatsheet } from './types'

/**
 * A guide to the whole, not lookup material for one stage — which is why it
 * carries no `stage` tether. Same shape the Languages group already uses for
 * sheets that do not belong to a single stage. Registered under Standards
 * rather than a new group: SDLC is a way this repo does things, same as
 * coding-standards is, just at a wider scope.
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
        },
        {
          term: '2. Requirements analysis',
          what: 'Gather and analyze functional and non-functional requirements.',
        },
        {
          term: '3. Design',
          what: 'System architecture, database design, UI/UX and component detail.',
        },
        {
          term: '4. Development',
          what: 'Write clean, efficient code and build the application.',
        },
        {
          term: '5. Testing',
          what: 'Test for functionality, performance, security and bugs.',
        },
        {
          term: '6. Deployment',
          what: 'Release the application to the production environment.',
        },
        {
          term: '7. Maintenance',
          what: 'Monitor, fix issues, improve performance, and add new features.',
        },
      ],
    },
  ],
}
