import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/12-staging.md`, "### Seed data that is not sterile".
 *
 * `lines[*].text` is pinned character-for-character against the doc's fenced
 * block via `seed-data.test.ts`'s use of `fences()` — the whole block
 * compared with `toEqual`, not a substring check, so a dropped or reworded
 * line fails loudly instead of passing on a `toContain`.
 */
export const SEED_ARTIFACT: Artifact = {
  id: 'hostile-seed',
  filename: 'src/db/seed.ts',
  language: 'ts',
  lines: [
    { text: '// src/db/seed.ts — deliberately awkward' },
    { text: 'const users = [' },
    {
      text: "  { name: \"O'Brien\", email: 'test+tag@example.com' },",
      note: 'An apostrophe in the name breaks unescaped SQL and naive string splitting.',
    },
    {
      text: "  { name: '李明', email: 'unicode@example.com' },",
      note: 'Non-Latin characters expose encoding assumptions and truncation bugs.',
    },
    {
      text: "  { name: 'A'.repeat(200), email: 'long@example.com' },",
      note: 'A 200-character name overflows fixed-width table columns and PDF exports.',
      pivot: true,
    },
    {
      text: "  { name: '', email: 'empty-name@example.com' },",
      note: 'An empty name tests fallback displays and greeting templates.',
    },
    { text: ']' },
  ],
}
