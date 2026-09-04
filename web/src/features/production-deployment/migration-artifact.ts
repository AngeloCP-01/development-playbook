import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/13-production-deployment.md`, "### Migrations: expand, migrate, contract".
 *
 * The three SQL statements are pinned character-for-character against the doc's
 * fenced blocks via `fences()` in `migration-artifact.test.ts`. The pivot marks
 * the contract step — the only irreversible one.
 */
export const MIGRATION_ARTIFACT: Artifact = {
  id: 'expand-migrate-contract',
  filename: 'migrations/rename-name-to-full-name.sql',
  language: 'sql',
  lines: [
    { text: '-- Deploy 1 — Expand' },
    {
      text: 'ALTER TABLE users ADD COLUMN full_name text;',
      note: 'Add the new column. Write to both, read from `name`. Safe to roll back.',
    },
    { text: '' },
    { text: '-- Deploy 2 — Migrate' },
    {
      text: 'UPDATE users SET full_name = name WHERE full_name IS NULL;',
      note: 'Backfill. Switch reads to `full_name`, still write both. Still safe to roll back.',
    },
    { text: '' },
    { text: '-- Deploy 3 — Contract' },
    {
      text: 'ALTER TABLE users DROP COLUMN name;',
      note: 'Irreversible — the column and its data are gone.',
      pivot: true,
    },
  ],
}
