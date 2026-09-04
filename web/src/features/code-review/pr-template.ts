import { type Artifact } from '@/components/artifact'

export const PR_TEMPLATE: Artifact = {
  id: 'pr-template',
  filename: 'pull_request.md',
  language: 'yaml',
  lines: [
    { text: '## What' },
    { text: 'Adds a status filter to the invoice list.' },
    { text: '' },
    {
      text: '## Why',
      pivot: true,
      note: 'This is where you notice the approach is wrong.',
    },
    {
      text: 'Users with 100+ invoices could not find unpaid ones without scrolling.',
    },
    { text: 'Reported three times this month.' },
    { text: '' },
    { text: '## How' },
    {
      text: 'New `status` query param, defaulting to `all`. Filtering happens in the',
    },
    {
      text: 'database query, not client-side, so it works past the pagination boundary.',
    },
    { text: '' },
    { text: '## Verification' },
    { text: '- Preview: <url>' },
    {
      text: '- Checked: filter combinations, empty result state, browser back button',
    },
    { text: '- Migration: none' },
  ],
}
