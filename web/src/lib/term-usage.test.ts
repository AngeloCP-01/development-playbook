import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'
import { TERMS } from './terms'

/**
 * `Term` (src/components/Term.tsx) degrades an unknown `id` to plain text on
 * purpose — no error, no failing render test, just a definition that
 * silently never appears. That makes a typo'd id invisible short of reading
 * every panel by eye, which is exactly what task-13's term sweep did once by
 * hand for stage 05. This closes the hole permanently: it walks every
 * `.tsx` file under `src/` and checks every `<Term id="...">` against
 * `TERMS`, so a stage that wraps a term that does not exist fails a test
 * instead of shipping a silently-missing definition — for stages 06–18 as
 * much as for 05.
 */
const SRC_DIR = fileURLToPath(new URL('..', import.meta.url))
const DOCS_DIR = fileURLToPath(new URL('../../../docs/', import.meta.url))

const KNOWN_ORPHANS = [
  'opportunity-solution-tree -> 01-product-discovery (never says "Opportunity solution tree")',
  'problem-interview -> 01-product-discovery (never says "Problem interview")',
  'mvp -> 02-planning (never says "MVP (Minimum Viable Product)")',
  'product-roadmap -> 02-planning (never says "Product roadmap")',
  'product-vision -> 02-planning (never says "Product vision")',
  'feasibility-risk -> 02-planning (never says "Feasibility risk")',
  'adr -> 03-architecture (never says "ADR (Architecture Decision Record)")',
  'phantom-dependency -> 04-project-setup (never says "Phantom dependency")',
  'join-table -> 03-architecture (never says "Join table")',
  'cqrs -> 03-architecture (never says "CQRS (Command Query Responsibility Segregation)")',
  'c4-model -> 03-architecture (never says "C4 model")',
  'hexagonal-architecture -> 03-architecture (never says "Hexagonal architecture (ports and adapters)")',
  'connection-pooling -> 03-architecture (never says "Connection pooling")',
  'cap-theorem -> 03-architecture (never says "CAP theorem")',
  'exponential-backoff -> 03-architecture (never says "Exponential backoff (with jitter)")',
  'expand-contract -> 03-architecture (never says "Expand-contract (parallel change)")',
  'architecture-characteristic -> 03-architecture (never says "Architecture characteristic (non-functional requirement)")',
  'feature-flag -> 05-development (never says "Feature flag")',
  'test-fixture -> 06-testing (never says "Test fixture")',
  'code-coverage -> 06-testing (never says "Code coverage")',
  'rubber-stamping -> 07-code-review (never says "Rubber-stamping")',
  'provenance -> 07-code-review (never says "Provenance (review)")',
  'finding-severity -> 07-code-review (never says "Finding severity")',
  'concurrency-group -> 11-ci-cd (never says "Concurrency group")',
  'deployment-status -> 11-ci-cd (never says "Deployment status event")',
  'frozen-lockfile -> 11-ci-cd (never says "Frozen lockfile")',
]

function findTsxFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      findTsxFiles(full, files)
    } else if (
      extname(entry.name) === '.tsx' &&
      !entry.name.endsWith('.test.tsx')
    ) {
      files.push(full)
    }
  }
  return files
}

const TERM_USAGE_PATTERN = /<Term\s+id="([^"]+)"/g

test('every <Term id="..."> resolves against TERMS, since an unknown id degrades silently', () => {
  const misses: { file: string; id: string }[] = []
  for (const file of findTsxFiles(SRC_DIR)) {
    const contents = readFileSync(file, 'utf8')
    for (const match of contents.matchAll(TERM_USAGE_PATTERN)) {
      const id = match[1]
      if (id !== undefined && !(id in TERMS)) {
        misses.push({ file: file.replace(SRC_DIR, 'src/'), id })
      }
    }
  }
  expect(misses, JSON.stringify(misses, null, 2)).toEqual([])
})

// A `see` link promises that the linked stage explains the term in context.
// P2 exposed the missing reverse check: `error-budget` pointed to stage 15,
// while stage 15 never used the phrase.
test('a term pointing at a stage names something that stage actually says', () => {
  const offenders: string[] = []

  for (const [slug, term] of Object.entries(TERMS)) {
    if (!term.see) continue
    const md = readFileSync(join(DOCS_DIR, `${term.see}.md`), 'utf8')
    if (!md.toLowerCase().includes(term.name.toLowerCase())) {
      offenders.push(`${slug} -> ${term.see} (never says "${term.name}")`)
    }
  }

  expect(offenders).toEqual(KNOWN_ORPHANS)
})
