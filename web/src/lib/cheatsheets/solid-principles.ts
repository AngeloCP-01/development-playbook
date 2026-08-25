import type { Cheatsheet } from './types'

/**
 * Split out of `coding-standards` into its own sheet under a new group
 * (D-90) — SOLID is a design principle, not a style rule, and sits closer to
 * `design-patterns` than to naming conventions or code smells. Examples are
 * adapted from the gathered graphic's Java into this repo's own stack (TS)
 * rather than transcribed verbatim — the shape of each violation is kept,
 * the syntax is not.
 */
export const solidPrinciples: Cheatsheet = {
  slug: 'solid-principles',
  title: 'SOLID Principles',
  group: 'Design Principles',
  stage: '03-architecture',
  blurb: 'Five rules for code that stays easy to change, test and extend.',
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
      title: 'The five principles',
      rows: [
        {
          term: 'Single Responsibility',
          what: 'A class should have only one reason to change.',
          when: 'A class handling users, email and reports together is three responsibilities pretending to be one.',
          example: [
            {
              label: 'Violation',
              code: 'class UserManager {\n  saveUser(u: User) { /* … */ }\n  sendWelcomeEmail(u: User) { /* … */ }\n  generateReport(u: User) { /* … */ }\n}',
            },
            {
              label: 'Correct',
              code: 'class UserRepository {\n  save(u: User) { /* … */ }\n}\nclass WelcomeEmailer {\n  send(u: User) { /* … */ }\n}\nclass UserReport {\n  generate(u: User) { /* … */ }\n}',
            },
          ],
        },
        {
          term: 'Open/Closed',
          what: 'Open for extension, closed for modification — add behavior without editing what already works.',
          when: 'A new type keeps requiring an `if`/`else if` added to existing code instead of a new class.',
          example: [
            {
              label: 'Violation',
              code: 'function area(shape: Shape) {\n  if (shape.kind === "circle") return Math.PI * shape.r ** 2\n  if (shape.kind === "rect") return shape.w * shape.h\n  // every new shape edits this function\n}',
            },
            {
              label: 'Correct',
              code: 'interface Shape { area(): number }\nclass Circle implements Shape {\n  area() { return Math.PI * this.r ** 2 }\n}\n// a new shape adds a class, this function never changes',
            },
          ],
        },
        {
          term: 'Liskov Substitution',
          what: 'A subclass must be usable anywhere its superclass is, without breaking the caller’s expectations.',
          when: 'A subclass throws on a method its parent’s contract promises will work — Ostrich extending Bird and refusing to fly.',
          example: [
            {
              label: 'Violation',
              code: 'class Bird { fly() { /* … */ } }\nclass Ostrich extends Bird {\n  fly() { throw new Error("Ostriches can’t fly") }\n}',
            },
            {
              label: 'Correct',
              code: 'class Bird {}\nclass FlyingBird extends Bird { fly() { /* … */ } }\nclass Ostrich extends Bird {} // never promises flight',
            },
          ],
        },
        {
          term: 'Interface Segregation',
          what: 'Clients should not be forced to depend on methods they do not use.',
          when: 'One fat interface makes every implementer stub out methods that do not apply to it.',
          example: [
            {
              label: 'Violation',
              code: 'interface Worker {\n  work(): void\n  eat(): void\n}\nclass Robot implements Worker {\n  work() { /* … */ }\n  eat() { throw new Error("Robots don’t eat") }\n}',
            },
            {
              label: 'Correct',
              code: 'interface Workable { work(): void }\ninterface Eatable { eat(): void }\nclass Robot implements Workable {\n  work() { /* … */ }\n}',
            },
          ],
        },
        {
          term: 'Dependency Inversion',
          what: 'High-level modules depend on abstractions, not on concrete low-level modules.',
          when: 'Swapping an implementation — a database, a payment provider — should not require editing the code that uses it.',
          example: [
            {
              label: 'Violation',
              code: 'class UserService {\n  private db = new MySqlDatabase()\n}',
            },
            {
              label: 'Correct',
              code: 'interface Database { connect(): void }\nclass UserService {\n  constructor(private db: Database) {}\n}',
            },
          ],
        },
      ],
    },
  ],
}
