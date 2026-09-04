export type Severity = 'critical' | 'important' | 'minor' | 'nit'

export type SeverityOption = {
  id: Severity
  label: string
}

export const SEVERITIES: SeverityOption[] = [
  { id: 'critical', label: 'Critical' },
  { id: 'important', label: 'Important' },
  { id: 'minor', label: 'Minor' },
  { id: 'nit', label: 'Nit' },
]

export type SeverityComment = {
  id: string
  comment: string
  severity: Severity
  explanation: string
}

export const COMMENTS: SeverityComment[] = [
  {
    id: 'authz-bypass',
    comment:
      'This query is filtered by `userId` from the request body, not the session. Any user can read any other user’s invoices.',
    severity: 'critical',
    explanation:
      'Authorization bypass — this is a data leak, not a styling issue. Any authenticated user can enumerate every invoice in the system by changing the request body. This blocks the merge.',
  },
  {
    id: 'data-loss',
    comment:
      'The migration drops the column before backfilling the new one. Existing rows lose their data and there is no rollback path.',
    severity: 'critical',
    explanation:
      'Irreversible data loss. Once the column is dropped, the data is gone. The fix is to add the new column first, backfill, then drop the old one in a separate migration.',
  },
  {
    id: 'silent-failure',
    comment:
      'The catch block is empty — the user sees nothing when this fails. The loading spinner just keeps spinning.',
    severity: 'important',
    explanation:
      'Silent failure the user will hit. It is not a security breach or data loss, but the user experience is broken — a stuck spinner with no recovery path. Show an error state.',
  },
  {
    id: 'duplication',
    comment:
      'This validation logic is duplicated in three handlers. Consider extracting a shared helper.',
    severity: 'minor',
    explanation:
      'A real issue — the duplication means a bug fix must land in three places — but it is not blocking. The feature works correctly as-is. File a follow-up or fix it in the next PR.',
  },
  {
    id: 'rename',
    comment: '`getData` is vague. `fetchInvoices` says what it actually does.',
    severity: 'nit',
    explanation:
      'Naming polish. The current name is not wrong, just less specific than it could be. This is a suggestion, not a demand — approve the PR and trust the author to take it or leave it.',
  },
]
