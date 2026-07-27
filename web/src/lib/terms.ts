/**
 * Jargon defined once, at the point of use.
 *
 * The playbook doubles as a primer, so a term you have never met should never
 * be a dead end. Definitions are written for someone encountering the idea for
 * the first time — plain language, no forward references, and a note on why it
 * matters rather than only what it is.
 */
export type Term = {
  /** Display heading for the generated glossary, e.g. 'ADR (Architecture Decision Record)'. */
  name: string
  short: string
  full: string
  /** Why a practitioner should care — the part a dictionary would omit. */
  soWhat?: string
  /** A stage slug this term is most associated with, for the glossary's "See" link. */
  see?: string
}

export const TERMS: Record<string, Term> = {
  'product-discovery': {
    name: 'Product discovery',
    see: '01-product-discovery',
    short:
      'Finding out whether something is worth building before you build it.',
    full: 'The work of testing whether a problem is real, whose it is, and how badly it hurts — before any code exists. It is deliberately cheap, because its main output is often the decision not to build.',
    soWhat:
      'Skipping it is the most expensive mistake available to a developer: months spent building something correct that nobody needed.',
  },
  'opportunity-solution-tree': {
    name: 'Opportunity solution tree',
    see: '01-product-discovery',
    short:
      'A map linking one outcome to problems, then to candidate solutions.',
    full: 'A diagram by Teresa Torres with four levels: the outcome you want to move, the customer opportunities (problems, needs, desires) that could move it, the solutions that address each opportunity, and the experiments that test each solution.',
    soWhat:
      'It enforces one rule that is hard to keep otherwise: no solution may exist without an opportunity above it, and no opportunity without evidence someone actually said it.',
  },
  'jobs-to-be-done': {
    name: 'Jobs to be done (JTBD)',
    short: 'The progress a person is trying to make, not their demographics.',
    full: 'A framing that describes users by the job they are "hiring" a product to do — "help me look organised to my clients" — rather than by who they are. Two people with nothing demographically in common can share a job.',
    soWhat:
      'It stops you designing for a persona and starts you designing for a situation, which is what actually predicts whether someone switches tools.',
  },
  'concierge-test': {
    name: 'Concierge test',
    short: 'Deliver the outcome by hand before building anything.',
    full: 'You do the work manually for a handful of real users — spreadsheets, emails, your own labour — while they experience the result as if it were a product.',
    soWhat:
      'It reveals where the genuine difficulty sits, which is almost never where you assumed. Many products are worth running by hand for a month first.',
  },
  'fake-door-test': {
    name: 'Fake-door test',
    short: 'A landing page for a product that does not exist yet.',
    full: 'A page describing the product with a real signup or purchase button. Clicking it reaches a "coming soon" message. You measure how many people click.',
    soWhat:
      'It measures behaviour rather than politeness. Saying "that sounds useful" is free; handing over an email address is not.',
  },
  'survivorship-bias': {
    name: 'Survivorship bias',
    short: 'Only hearing from the people who stayed.',
    full: 'Drawing conclusions from the visible survivors of a process while the failures are silent. In discovery: interviewing current users tells you why people stay, never why the larger group left or never arrived.',
    soWhat:
      'Your happiest users are the worst guide to why nobody else is signing up.',
  },
  'leading-question': {
    name: 'Leading question',
    short: 'A question whose wording suggests the answer you want.',
    full: '"Would this save you time?" contains its own answer. The polite response is yes, it costs the respondent nothing, and you learn only that they are agreeable.',
    soWhat:
      'It is the single most common way interviews produce confident, false evidence — and the same failure appears when you ask an AI whether your idea is good.',
  },
  tam: {
    name: 'TAM (Total Addressable Market)',
    short: 'The total size of a market, before any competition.',
    full: 'Total Addressable Market — every person or business who could conceivably buy this, if you had no competitors and perfect reach. Usually paired with SAM (the slice you could realistically serve) and SOM (the slice you could realistically win).',
    soWhat:
      'On its own it is close to meaningless and easy to inflate. It is useful only for telling a hobby apart from a business.',
  },
  npm: {
    name: 'npm',
    see: '04-project-setup',
    short: 'The package manager that ships with Node.js.',
    full: 'Reads your package.json, downloads every package it names (and everything those packages need) from the npm registry, and copies the whole tree into the project\u2019s node_modules folder. Every project gets its own full copy, hoisted into one flat pile.',
    soWhat:
      'The flat pile means your code can import packages you never declared \u2014 phantom dependencies \u2014 which work until the package that dragged them in stops doing so. Zero setup is why it remains the default everywhere.',
  },
  pnpm: {
    name: 'pnpm',
    see: '04-project-setup',
    short:
      'A faster npm replacement that stores each package once per machine.',
    full: 'Same registry and same package.json as npm, but packages live in one content-addressable store on your machine and get hard-linked into each project. Its node_modules layout is strict: only dependencies you actually declared are importable.',
    soWhat:
      'Repeat installs take seconds and undeclared imports fail on your machine today rather than in production later. The trade: it does not ship with Node, so it is one corepack step away from a fresh machine.',
  },
  'problem-interview': {
    name: 'Problem interview',
    see: '01-product-discovery',
    short:
      'A conversation about what someone actually did, not what they would do.',
    full: 'A short interview — 20 to 30 minutes — focused entirely on past behaviour around a problem. No pitch, no product, no hypotheticals.',
    soWhat:
      'Predictions about future behaviour are unreliable. What someone did last Tuesday is evidence.',
  },
  'switching-cost': {
    name: 'Switching cost',
    short: 'Everything it costs someone to move off what they use now.',
    full: 'Learning a new tool, migrating data, changing habits, and the risk that the new thing is worse. It is paid by the user, not by you, and it is usually larger than builders estimate.',
    soWhat:
      'This is why "annoying" problems never convert. The pain you remove has to exceed the cost of moving.',
  },
  mvp: {
    name: 'MVP (Minimum Viable Product)',
    see: '02-planning',
    short:
      'The smallest version that delivers the outcome you defined as done.',
    full: 'Minimum viable product: the least you can build that still achieves the result you wrote down, so that real usage can tell you what to build next. It is defined by the outcome, not by a feature count.',
    soWhat:
      'The phrase is usually misused to mean "v1 with the hard parts removed", which produces something nobody can use and teaches you nothing. If your MVP cannot deliver the outcome, it is not minimum — it is unfinished.',
  },
  'product-roadmap': {
    name: 'Product roadmap',
    see: '02-planning',
    short: 'What you plan to build, in order, without dates.',
    full: 'An ordered statement of intent — usually now, next and later — saying what is being built and what is waiting. The good ones name what has to be true before an item moves up, rather than naming a month.',
    soWhat:
      'The moment a roadmap carries dates it becomes a promise, and replanning turns political. Horizons give you the sequence without the commitment.',
  },
  'product-vision': {
    name: 'Product vision',
    see: '02-planning',
    short: 'Where the product is going, written as a state of the world.',
    full: 'A short description of what the product becomes if it works — not a feature list, and not a slogan. One paragraph is the right length.',
    soWhat:
      'Without one, an MVP reads as a list of things you cut. With one, it reads as a first step, and every "not now" decision has something to be judged against.',
  },
  appetite: {
    name: 'Appetite',
    see: '02-planning',
    short: 'How much time something is worth, decided before the design.',
    full: 'A fixed budget of time you are willing to spend, which the solution is then shaped to fit. An estimate starts with a design and ends with a number; an appetite starts with a number and ends with a design.',
    soWhat:
      'It reverses who is in charge. An estimate lets the design dictate the schedule; an appetite lets the schedule dictate the design — which, solo, is almost always the trade you want.',
  },
  'vertical-slice': {
    name: 'Vertical slice',
    see: '02-planning',
    short:
      'A piece of work that touches every layer and produces something usable.',
    full: 'Work sequenced so each step goes through storage, logic and interface at once, rather than building each layer across the whole product before starting the next.',
    soWhat:
      'Layer-first work means nothing functions until everything does, and you learn nothing until the end. A vertical slice is demonstrable the day it lands, which is also what makes it possible to change your mind cheaply.',
  },
  spike: {
    name: 'Spike',
    see: '02-planning',
    short: 'A timeboxed investigation whose output is a decision, not code.',
    full: 'A short, deliberately bounded piece of exploration answering one specific question — can this integration do what we need, is this approach fast enough — with a hard stop and a written answer.',
    soWhat:
      'The discipline is throwing the code away. If you keep it, you have not run a spike; you have merged untested, unreviewed work through the side door.',
  },
  'feasibility-risk': {
    name: 'Feasibility risk',
    see: '02-planning',
    short: 'The risk that the thing cannot be built as imagined.',
    full: 'One of the standard product risks, alongside whether people want it and whether it makes business sense. It asks whether the technology, data, budget and time actually permit the solution.',
    soWhat:
      'Discovery tests whether anyone wants it; this tests whether you can make it. They fail differently and at different costs, so finding feasibility problems late is the more expensive of the two.',
  },
}

export function getTerm(key: string): Term | undefined {
  return TERMS[key]
}
