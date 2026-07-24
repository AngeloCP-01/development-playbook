/**
 * Jargon defined once, at the point of use.
 *
 * The playbook doubles as a primer, so a term you have never met should never
 * be a dead end. Definitions are written for someone encountering the idea for
 * the first time — plain language, no forward references, and a note on why it
 * matters rather than only what it is.
 */
export type Term = {
  short: string
  full: string
  /** Why a practitioner should care — the part a dictionary would omit. */
  soWhat?: string
}

export const TERMS: Record<string, Term> = {
  'product-discovery': {
    short:
      'Finding out whether something is worth building before you build it.',
    full: 'The work of testing whether a problem is real, whose it is, and how badly it hurts — before any code exists. It is deliberately cheap, because its main output is often the decision not to build.',
    soWhat:
      'Skipping it is the most expensive mistake available to a developer: months spent building something correct that nobody needed.',
  },
  'opportunity-solution-tree': {
    short:
      'A map linking one outcome to problems, then to candidate solutions.',
    full: 'A diagram by Teresa Torres with four levels: the outcome you want to move, the customer opportunities (problems, needs, desires) that could move it, the solutions that address each opportunity, and the experiments that test each solution.',
    soWhat:
      'It enforces one rule that is hard to keep otherwise: no solution may exist without an opportunity above it, and no opportunity without evidence someone actually said it.',
  },
  'jobs-to-be-done': {
    short: 'The progress a person is trying to make, not their demographics.',
    full: 'A framing that describes users by the job they are "hiring" a product to do — "help me look organised to my clients" — rather than by who they are. Two people with nothing demographically in common can share a job.',
    soWhat:
      'It stops you designing for a persona and starts you designing for a situation, which is what actually predicts whether someone switches tools.',
  },
  'concierge-test': {
    short: 'Deliver the outcome by hand before building anything.',
    full: 'You do the work manually for a handful of real users — spreadsheets, emails, your own labour — while they experience the result as if it were a product.',
    soWhat:
      'It reveals where the genuine difficulty sits, which is almost never where you assumed. Many products are worth running by hand for a month first.',
  },
  'fake-door-test': {
    short: 'A landing page for a product that does not exist yet.',
    full: 'A page describing the product with a real signup or purchase button. Clicking it reaches a "coming soon" message. You measure how many people click.',
    soWhat:
      'It measures behaviour rather than politeness. Saying "that sounds useful" is free; handing over an email address is not.',
  },
  'survivorship-bias': {
    short: 'Only hearing from the people who stayed.',
    full: 'Drawing conclusions from the visible survivors of a process while the failures are silent. In discovery: interviewing current users tells you why people stay, never why the larger group left or never arrived.',
    soWhat:
      'Your happiest users are the worst guide to why nobody else is signing up.',
  },
  'leading-question': {
    short: 'A question whose wording suggests the answer you want.',
    full: '"Would this save you time?" contains its own answer. The polite response is yes, it costs the respondent nothing, and you learn only that they are agreeable.',
    soWhat:
      'It is the single most common way interviews produce confident, false evidence — and the same failure appears when you ask an AI whether your idea is good.',
  },
  tam: {
    short: 'The total size of a market, before any competition.',
    full: 'Total Addressable Market — every person or business who could conceivably buy this, if you had no competitors and perfect reach. Usually paired with SAM (the slice you could realistically serve) and SOM (the slice you could realistically win).',
    soWhat:
      'On its own it is close to meaningless and easy to inflate. It is useful only for telling a hobby apart from a business.',
  },
  npm: {
    short: 'The package manager that ships with Node.js.',
    full: 'Reads your package.json, downloads every package it names (and everything those packages need) from the npm registry, and copies the whole tree into the project\u2019s node_modules folder. Every project gets its own full copy, hoisted into one flat pile.',
    soWhat:
      'The flat pile means your code can import packages you never declared \u2014 phantom dependencies \u2014 which work until the package that dragged them in stops doing so. Zero setup is why it remains the default everywhere.',
  },
  pnpm: {
    short:
      'A faster npm replacement that stores each package once per machine.',
    full: 'Same registry and same package.json as npm, but packages live in one content-addressable store on your machine and get hard-linked into each project. Its node_modules layout is strict: only dependencies you actually declared are importable.',
    soWhat:
      'Repeat installs take seconds and undeclared imports fail on your machine today rather than in production later. The trade: it does not ship with Node, so it is one corepack step away from a fresh machine.',
  },
  'problem-interview': {
    short:
      'A conversation about what someone actually did, not what they would do.',
    full: 'A short interview — 20 to 30 minutes — focused entirely on past behaviour around a problem. No pitch, no product, no hypotheticals.',
    soWhat:
      'Predictions about future behaviour are unreliable. What someone did last Tuesday is evidence.',
  },
  'switching-cost': {
    short: 'Everything it costs someone to move off what they use now.',
    full: 'Learning a new tool, migrating data, changing habits, and the risk that the new thing is worse. It is paid by the user, not by you, and it is usually larger than builders estimate.',
    soWhat:
      'This is why "annoying" problems never convert. The pain you remove has to exceed the cost of moving.',
  },
}

export function getTerm(key: string): Term | undefined {
  return TERMS[key]
}
