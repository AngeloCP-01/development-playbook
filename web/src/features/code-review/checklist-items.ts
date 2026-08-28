export type CheckItem = {
  id: string
  label: string
}

export const CHECKLIST: CheckItem[] = [
  { id: 'match', label: 'Does the diff match the description?' },
  {
    id: 'edges',
    label: 'Edge cases: empty, null, zero, duplicate, very large',
  },
  {
    id: 'authz',
    label: 'Every data access authorized, not just authenticated',
  },
  { id: 'failures', label: 'Failures produce a sensible user-visible state' },
  { id: 'secrets', label: 'No secrets, keys, or tokens in the diff' },
  { id: 'console', label: 'No `console.log` left behind' },
  { id: 'commented', label: 'No commented-out code' },
  {
    id: 'tests',
    label: 'Tests exist and would actually fail without the change',
  },
  { id: 'names', label: 'Names are accurate' },
  { id: 'scope', label: 'Nothing unrelated is bundled in' },
  { id: 'migrations', label: 'Migrations are backward compatible (`13`)' },
]
