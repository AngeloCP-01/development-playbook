export type Practice = {
  id: string
  title: string
  body: string
}

export const PRACTICES: Practice[] = [
  {
    id: 'distance',
    title: 'Review is now someone else’s job',
    body: 'Which is strictly better — they have the distance you have to manufacture.',
  },
  {
    id: 'severity',
    title: 'Comment with severity',
    body: 'Distinguish “blocking” from “suggestion” from “nit.” Without labels, every comment reads as a demand and reviews turn adversarial.',
  },
  {
    id: 'questions',
    title: 'Ask questions rather than issue instructions',
    body: '“What happens if this is empty?” gets a better outcome than “add a null check” — sometimes the answer is that it cannot be empty, and you have learned something.',
  },
  {
    id: 'turnaround',
    title: 'Review within a day',
    body: 'A PR waiting three days is a branch diverging for three days.',
  },
  {
    id: 'approve-with-nits',
    title: 'Approve with minor comments',
    body: 'Rather than blocking on nits. Trust people to address them.',
  },
  {
    id: 'receiving',
    title: 'On receiving review: verify, do not comply reflexively',
    body: 'A reviewer can be wrong, and agreeing with a wrong suggestion to be agreeable puts a bug in the codebase with two names on it. Check, then agree or explain.',
  },
]
