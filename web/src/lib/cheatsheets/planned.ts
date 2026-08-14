import type { Cheatsheet } from './types'

/**
 * Registered, not yet written. These render a placeholder and are marked on the
 * index, so the section doubles as a worklist of what still needs gathering
 * (D5). When one gains content, move it to its own module beside
 * architecture-patterns.ts and drop it from this list.
 */
export const PLANNED: Cheatsheet[] = [
  {
    slug: 'design-patterns',
    title: 'Design Patterns',
    group: 'Architecture',
    stage: '03-architecture',
    blurb: 'The Gang of Four set, grouped by what each one is for.',
    source: {
      title: 'Software Design Patterns',
      author: 'Unrecorded — see reference/cheatsheet-sources.md',
      image: {
        src: '/reference/software-design-patterns.webp',
        width: 1536,
        height: 1024,
        alt: 'Software design patterns grouped by category. Not yet transcribed.',
      },
    },
    sections: [],
  },
  {
    slug: 'api-design',
    title: 'API Design',
    group: 'Architecture',
    stage: '03-architecture',
    blurb: 'From HTTP fundamentals through versioning, auth and rate limits.',
    source: {
      title: 'Master Plan for API Design',
      author: 'Shalini Goyal',
      image: {
        src: '/reference/masterplan-api-design.webp',
        width: 1080,
        height: 1350,
        alt: 'A fifteen-step API design roadmap, from HTTP fundamentals to production skills, each step listing four topics. Not yet transcribed.',
      },
    },
    sections: [],
  },
  {
    slug: 'git-commands',
    title: 'Git Commands',
    group: 'Git',
    stage: '04-project-setup',
    blurb: 'The ones worth memorising, and the ones worth looking up.',
    source: {
      title: 'Git Commands',
      author: 'Unrecorded — see reference/cheatsheet-sources.md',
      image: {
        src: '/reference/git-commands.webp',
        width: 1024,
        height: 1536,
        alt: 'A git command reference grouped by task. Not yet transcribed.',
      },
    },
    sections: [],
  },
  {
    slug: 'git-branching',
    title: 'Git Branching & Conventions',
    group: 'Git',
    stage: '04-project-setup',
    blurb: 'Trunk-based against GitFlow, and the commit format this repo uses.',
    sections: [],
  },
  {
    slug: 'coding-standards',
    title: 'Coding Standards',
    group: 'Standards',
    stage: '05-development',
    blurb: 'Naming, structure and the smells worth refactoring on sight.',
    sections: [],
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    group: 'Languages',
    blurb: 'Array methods, async semantics, and the event loop.',
    sections: [],
  },
  {
    slug: 'python',
    title: 'Python',
    group: 'Languages',
    blurb:
      'Data structures, comprehensions, and the standard library worth knowing.',
    sections: [],
  },
  {
    slug: 'java',
    title: 'Java',
    group: 'Languages',
    blurb: 'Collections, streams, and how the JVM spends memory.',
    sections: [],
  },
  {
    slug: 'spring-boot',
    title: 'Spring Boot',
    group: 'Languages',
    blurb: 'Annotations, bean lifecycle, and where configuration comes from.',
    sections: [],
  },
  {
    slug: 'express',
    title: 'Express & Node',
    group: 'Languages',
    blurb: 'Middleware order, routing, and what blocks the event loop.',
    sections: [],
  },
]
