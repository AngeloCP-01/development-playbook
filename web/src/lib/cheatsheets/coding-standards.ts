import type { Cheatsheet } from './types'

/**
 * SOLID and Clean Code moved out to their own sheets under Design Principles
 * (D-90) — both are principles you carry across a codebase, not standards
 * specific to how this one is styled. What's left here is narrower: the
 * smells worth noticing in code you're already looking at.
 *
 * A second section — naming conventions — is deliberately not here. The
 * gathered graphic for it turned out to be Godot-specific (GDScript's own
 * conventions), which is the wrong domain for this repo's stack, and was
 * dropped rather than transcribed anyway. The section stays out until a
 * language-agnostic source is found, the same "registered gap" pattern the
 * section itself already uses elsewhere (D-62).
 */
export const codingStandards: Cheatsheet = {
  slug: 'coding-standards',
  title: 'Coding Standards',
  group: 'Standards',
  stage: '05-development',
  blurb: 'The smells worth refactoring on sight.',
  source: {
    title: 'Code Smell',
    author: 'AIAI LAB, citing Refactoring.Guru',
    url: 'https://refactoring.guru/refactoring/smells',
  },
  sections: [
    {
      title: 'Code smells',
      note: 'From Refactoring.Guru’s taxonomy, condensed to five categories. Not bugs — signs the code is getting harder to change, read or extend.',
      rows: [
        {
          term: 'Bloaters',
          what: 'Methods, classes or parameter lists that have grown too large to reason about.',
          when: 'A long method, a large class, or a parameter list nobody can call without checking the signature.',
        },
        {
          term: 'Object-orientation abusers',
          what: 'Cases where OOP exists in the codebase but is not doing its job — switch statements standing in for polymorphism.',
          when: 'A type check or a chain of `if`/`else` decides behavior that a class hierarchy should decide instead.',
        },
        {
          term: 'Change preventers',
          what: 'Structures that make one change ripple into many files that should not need to move together.',
          when: 'Divergent change (one class changed for many reasons) or shotgun surgery (one change touches many classes).',
        },
        {
          term: 'Dispensables',
          what: 'Code that provides little or no value — duplicate code, dead code, unnecessary abstraction.',
          when: 'Deleting it would not be missed, and keeping it costs a reader’s attention every time they pass it.',
        },
        {
          term: 'Couplers',
          what: 'Classes or modules that depend on each other more than their job requires.',
          when: 'Feature envy (a method more interested in another class than its own) or a message chain three calls deep.',
        },
      ],
    },
  ],
}
