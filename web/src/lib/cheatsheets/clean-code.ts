import { highlightedHtml } from './highlighted.generated'
import type { Cheatsheet, RowExample } from './types'

/**
 * Split out of `coding-standards` into Design Principles, beside
 * `solid-principles` (D-90). The gathered graphic states five habits without
 * code; the before/after examples below are original, written to show each
 * habit rather than transcribed from anywhere.
 *
 * A second section (2026-08-28) draws on a second gathered graphic — "6
 * Golden Rules to Write Clean Code" by Neo Kim — named and credited in that
 * section's own note rather than displayed as a second plate (D-89). Two of
 * its six rules, DRY and KISS, are already covered above as "Avoid
 * duplicates" and "Keep it simple"; only the four not already here are
 * transcribed.
 *
 * `html` is looked up from the generated table — see the fuller comment in
 * `solid-principles.ts`, which this mirrors.
 */
function withHtml(examples: { label: string; code: string }[]): RowExample[] {
  return examples.map((ex) => ({ ...ex, html: highlightedHtml[ex.code] }))
}

export const cleanCode: Cheatsheet = {
  slug: 'clean-code',
  title: 'Clean Code',
  group: 'Design Principles',
  stage: '05-development',
  blurb: 'Five habits that separate code that works from code that lasts.',
  source: {
    title: 'Clean Code Principles Every Junior Developer Should Know',
    author: 'Unrecorded — see reference/cheatsheet-sources.md',
    image: {
      src: '/reference/clean-code.webp',
      width: 1400,
      height: 933,
      alt: 'Five clean code habits: write for humans, keep it simple, avoid duplicates, be consistent, refactor regularly.',
    },
  },
  sections: [
    {
      title: 'Five habits',
      rows: [
        {
          term: 'Write for humans',
          what: 'Code is read far more often than it is written — optimise for the next reader, not the interpreter.',
          example: withHtml([
            {
              label: 'Before',
              code: 'const d = (a: number, b: number) => a * b * 0.1',
            },
            {
              label: 'After',
              code: 'const calculateDiscount = (price: number, quantity: number) =>\n  price * quantity * DISCOUNT_RATE',
            },
          ]),
        },
        {
          term: 'Keep it simple',
          what: 'The straightforward solution beats the clever one once someone else has to maintain it.',
          example: withHtml([
            {
              label: 'Before',
              code: 'const isEven = (n: number) => !(n & 1) === !0',
            },
            {
              label: 'After',
              code: 'const isEven = (n: number) => n % 2 === 0',
            },
          ]),
        },
        {
          term: 'Avoid duplicates',
          what: 'The same logic in two places is one bug waiting to be fixed in only one of them.',
          example: withHtml([
            {
              label: 'Before',
              code: 'function total(items) {\n  return items.reduce((s, i) => s + i.price * i.qty, 0)\n}\nfunction subtotal(cart) {\n  return cart.reduce((s, i) => s + i.price * i.qty, 0)\n}',
            },
            {
              label: 'After',
              code: 'function lineTotal(item: LineItem) { return item.price * item.qty }\nfunction total(items: LineItem[]) {\n  return items.reduce((s, i) => s + lineTotal(i), 0)\n}',
            },
          ]),
        },
        {
          term: 'Be consistent',
          what: 'One naming style, one structure, one way of doing a repeated thing — consistency is what makes code skimmable.',
          example: withHtml([
            {
              label: 'Before',
              code: 'function get_user(id) { /* … */ }\nfunction fetchOrder(id) { /* … */ }\nfunction Load_Invoice(id) { /* … */ }',
            },
            {
              label: 'After',
              code: 'function getUser(id: string) { /* … */ }\nfunction getOrder(id: string) { /* … */ }\nfunction getInvoice(id: string) { /* … */ }',
            },
          ]),
        },
        {
          term: 'Refactor regularly',
          what: 'Clean code is a habit applied continuously, not a one-time pass before a release.',
          when: 'The Boy Scout Rule: leave the code a little cleaner than you found it, every time you touch it.',
        },
      ],
    },
    {
      title: 'Four more, named as acronyms',
      note: 'From a second gathered source — "6 Golden Rules to Write Clean Code" by Neo Kim. Its other two rules, DRY and KISS, are the same ideas as "Avoid duplicates" and "Keep it simple" above.',
      rows: [
        {
          term: 'SOC — Separation of concerns',
          what: 'Keep distinct responsibilities in distinct places, so a change to one does not ripple into the other.',
          when: 'The class-level version of this is SOLID’s Single Responsibility Principle — see `solid-principles`.',
        },
        {
          term: 'DYC — Document your code',
          what: 'Comments and docs explain *why* a decision was made — the code itself already says what it does.',
        },
        {
          term: 'TDD — Test-driven development',
          what: 'Write the failing test before the code that makes it pass.',
          when: 'This repo’s own iron law: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST" (`CLAUDE.md`) — see `testing`.',
        },
        {
          term: 'YAGNI — You ain’t gonna need it',
          what: 'Do not build for a requirement that does not exist yet — speculative flexibility is a cost paid today for a maybe.',
        },
      ],
    },
  ],
}
