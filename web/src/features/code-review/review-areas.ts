export type Area = {
  id: string
  title: string
  body: string
}

export const AREAS: Area[] = [
  {
    id: 'correctness',
    title: 'Correctness at the edges',
    body: 'What happens with zero items, a null, a duplicate submit, a very large input, a concurrent request? The happy path was tested during development.',
  },
  {
    id: 'authorization',
    title: 'Authorization',
    body: 'For every data access: can a user reach someone else’s record? Any query filtered only by an ID from the client is a finding. See `05 — Development`.',
  },
  {
    id: 'error-handling',
    title: 'Error handling',
    body: 'What does the user see when this fails? A caught error with an empty block is a bug hidden on purpose. A raw error message reaching the UI may leak internals.',
  },
  {
    id: 'names',
    title: 'Names',
    body: 'Does the name say what the thing does? Renaming is cheap now and expensive after it spreads across thirty call sites.',
  },
  {
    id: 'scope',
    title: 'Scope',
    body: 'Does the diff do what the description says, and nothing else? An unrelated refactor bundled into a feature PR makes both harder to review and harder to revert.',
  },
  {
    id: 'deletion',
    title: 'Deletion',
    body: 'Did the change leave anything behind — a now-unused function, a stale flag, a commented-out block? Commented-out code is what version control is for. Delete it.',
  },
  {
    id: 'reversibility',
    title: 'Reversibility',
    body: 'If this is wrong, how bad is it and how fast can you undo it? A migration deserves more scrutiny than a copy change, and should get proportionally more.',
  },
]
