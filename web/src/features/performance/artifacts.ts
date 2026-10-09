import type { Artifact } from '@/components/artifact'

export const INVENTORY_PLAN: Artifact = {
  id: 'inventory-plan',
  filename: 'inventory-plan.sql',
  language: 'sql',
  lines: [
    {
      text: 'EXPLAIN (ANALYZE, BUFFERS)',
      note: 'Runs this query and reports its actual plan and buffers. This is one diagnosis, not a field percentile.',
      pivot: true,
    },
    {
      text: "SELECT sku, available FROM inventory WHERE sku IN ('A', 'B');",
      note: 'Use representative data. Inspect estimates, actual rows, filtering and time before deciding on an index.',
    },
  ],
}
