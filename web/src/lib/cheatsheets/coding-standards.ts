import type { Cheatsheet } from './types'

/**
 * Three sub-topics, three gathered graphics, one displayed. SOLID is the
 * plate because it is the one with a named author; the code smell taxonomy
 * and clean-code habits are credited in their own section notes instead of a
 * second and third plate (see reference/cheatsheet-sources.md).
 *
 * A fourth section — naming conventions — is deliberately not here. The
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
  blurb: 'Naming, structure and the smells worth refactoring on sight.',
  source: {
    title: 'SOLID Principles — Cheat Sheet',
    author: 'Raja Kumar',
    image: {
      src: '/reference/solid-principles.webp',
      width: 1024,
      height: 1536,
      alt: 'The five SOLID principles, each with a violation and a corrected approach in code.',
    },
  },
  sections: [
    {
      title: 'SOLID principles',
      note: 'Five principles for code that stays easy to change, test and extend.',
      rows: [
        {
          term: 'Single Responsibility',
          what: 'A class should have only one reason to change.',
          when: 'A class handling users, email and reports together is three responsibilities pretending to be one.',
        },
        {
          term: 'Open/Closed',
          what: 'Open for extension, closed for modification — add behavior without editing what already works.',
          when: 'A new type keeps requiring an `if`/`else if` added to existing code instead of a new class.',
        },
        {
          term: 'Liskov Substitution',
          what: 'A subclass must be usable anywhere its superclass is, without breaking the caller’s expectations.',
          when: 'A subclass throws on a method its parent’s contract promises will work — Ostrich extending Bird and refusing to fly.',
        },
        {
          term: 'Interface Segregation',
          what: 'Clients should not be forced to depend on methods they do not use.',
          when: 'One fat interface makes every implementer stub out methods that do not apply to it.',
        },
        {
          term: 'Dependency Inversion',
          what: 'High-level modules depend on abstractions, not on concrete low-level modules.',
          when: 'Swapping an implementation — a database, a payment provider — should not require editing the code that uses it.',
        },
      ],
    },
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
    {
      title: 'Writing clean code',
      rows: [
        {
          term: 'Write for humans',
          what: 'Code is read far more often than it is written — optimise for the next reader, not the interpreter.',
        },
        {
          term: 'Keep it simple',
          what: 'The straightforward solution beats the clever one once someone else has to maintain it.',
        },
        {
          term: 'Avoid duplicates',
          what: 'The same logic in two places is one bug waiting to be fixed in only one of them.',
        },
        {
          term: 'Be consistent',
          what: 'One naming style, one structure, one way of doing a repeated thing — consistency is what makes code skimmable.',
        },
        {
          term: 'Refactor regularly',
          what: 'Clean code is a habit applied continuously, not a one-time pass before a release.',
        },
      ],
    },
  ],
}
