export type BiasId = 'confirmation' | 'tunnel-vision' | 'curse-of-knowledge'

export type Bias = {
  id: BiasId
  label: string
}

export const BIASES: Bias[] = [
  { id: 'confirmation', label: 'Confirmation bias' },
  { id: 'tunnel-vision', label: 'Tunnel vision' },
  { id: 'curse-of-knowledge', label: 'Curse of knowledge' },
]

export type Technique = {
  id: string
  title: string
  detail: string
  bias: BiasId
  explanation: string
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'distance',
    title: 'Create distance',
    detail:
      'Minimum ten minutes, ideally overnight. Bugs that are invisible while you are inside the problem become obvious once you are not.',
    bias: 'confirmation',
    explanation:
      'You are still holding the intent in your head, so you read what you meant rather than what you wrote. Time breaks the mental model so you see what is actually there.',
  },
  {
    id: 'diff',
    title: 'Read the diff, not the code',
    detail:
      'In the GitHub PR view, not your editor. Different presentation, different context, different things noticed. The diff view strips the surrounding code you have been staring at and shows only what changed.',
    bias: 'tunnel-vision',
    explanation:
      'The same context that produced the bugs hides them. A different presentation — the PR diff instead of the editor — breaks the visual familiarity and surfaces what you stopped seeing.',
  },
  {
    id: 'explain',
    title: 'Explain it out loud',
    detail:
      'Write the PR description as though someone else will read it. If you cannot explain why a piece is necessary, that is a finding.',
    bias: 'curse-of-knowledge',
    explanation:
      'You cannot unknow what you know about the code’s intent. Explaining forces you to make the implicit explicit, which reveals assumptions and gaps a reader without your context would hit.',
  },
]
