/**
 * Outward links per stage — where to go when this playbook's treatment is not
 * enough. Deliberately capped at 3–5 per stage (enforced by a test): a curated
 * few that each add something specific beat a link dump nobody reads.
 *
 * Every entry says what it *adds beyond this stage*, so the reader can tell
 * whether the click is worth it before making it.
 */
export type Reference = {
  title: string
  source: string
  url: string
  /** What this gives you that the stage does not. The reason to click. */
  adds: string
}

export const REFERENCES: Record<string, Reference[]> = {
  '01-product-discovery': [
    {
      title: 'Opportunity Solution Trees',
      source: 'Teresa Torres · Product Talk',
      url: 'https://www.producttalk.org/opportunity-solution-trees/',
      adds: 'The origin of the tree used in this stage, from the person who invented it. Go here for how a tree evolves week to week, and for the interview-snapshot habit that keeps opportunities grounded in real conversations.',
    },
    {
      title: 'The Four Big Risks',
      source: 'Marty Cagan · Silicon Valley Product Group',
      url: 'https://www.svpg.com/four-big-risks/',
      adds: 'A second lens on the same decision. This stage asks whether the problem is real; Cagan asks what could sink the solution — value, usability, feasibility, and business viability. Useful once you have decided to build and want to know what to de-risk first.',
    },
    {
      title: 'What Is Product Discovery?',
      source: 'Scrum.org',
      url: 'https://www.scrum.org/resources/blog/what-product-discovery',
      adds: 'Frames discovery as three pillars — customer-centric approach, iterative testing, continuous learning. The clearest short answer to "why is this continuous rather than a phase", which is the claim this whole playbook rests on.',
    },
    {
      title: '8 Product Discovery Techniques',
      source: 'Maze',
      url: 'https://maze.co/guides/product-discovery/techniques/',
      adds: 'A wider menu than the four validation rungs here: five whys, product analytics, prioritisation frameworks, prototyping, usability testing. Reach for it when the cheap rungs came back ambiguous and you need another angle.',
    },
    {
      title: 'Product Discovery guide',
      source: 'Atlassian',
      url: 'https://www.atlassian.com/agile/product-management/discovery',
      adds: 'The team-shaped version of this stage: how discovery runs alongside delivery, and how findings move into a backlog. Most relevant when the "Scaling to a team" notes here start applying to you.',
    },
  ],
  '02-planning': [
    {
      title: 'The complete guide to product planning',
      source: 'Atlassian',
      url: 'https://www.atlassian.com/agile/product-management/product-planning',
      adds: 'The seven-step industry version of the phrase — ideate, research, vision, specification, roadmap, prototype, launch. Read it to see how much wider "product planning" is elsewhere than it is here, and which of this playbook\'s stages own the rest of it.',
    },
    {
      title: 'Mapping User Stories in Agile',
      source: 'Nielsen Norman Group',
      url: 'https://www.nngroup.com/articles/user-story-mapping/',
      adds: "How slicing actually gets done when the work is bigger than one person can hold. Story mapping lays the whole product out and then cuts release lines through it, hunting the smallest release someone would find genuinely useful — the team-shaped version of this stage's vertical slices.",
    },
    {
      title: 'Shape Up — The Betting Table',
      source: 'Ryan Singer · Basecamp',
      url: 'https://basecamp.com/shapeup/2.2-chapter-08',
      adds: 'The sharpest available argument for appetite over estimate, and for calling the decision a bet rather than a plan. Go here when "estimate for sequencing" feels like it is still smuggling a promise in.',
    },
    {
      title: 'Dual-Track Agile',
      source: 'Marty Cagan · Silicon Valley Product Group',
      url: 'https://www.svpg.com/dual-track-agile/',
      adds: 'Why there is no planning phase between deciding and building — discovery and delivery run in parallel, continuously. The clearest statement of why the number on this document is a filing code rather than a position in a queue.',
    },
    {
      title: 'Prioritization frameworks',
      source: 'Atlassian',
      url: 'https://www.atlassian.com/agile/product-management/prioritization-framework',
      adds: 'The next step up from the value-against-effort method this stage teaches: RICE, ICE, MoSCoW and the rest, with when each earns its extra ceremony. Reach for it once you have real usage data and more items than value-vs-effort can order by eye.',
    },
  ],
  '03-architecture': [
    {
      title: 'Documenting Architecture Decisions',
      source: 'Michael Nygard',
      url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
      adds: 'The origin of the artifact this stage tells you to write, from the person who named it. Go here for the status lifecycle — proposed, accepted, superseded — which is the part that makes a folder of ADRs a record of how thinking changed rather than a pile of decisions that may or may not still hold.',
    },
    {
      title: 'MonolithFirst',
      source: 'Martin Fowler',
      url: 'https://martinfowler.com/bliki/MonolithFirst.html',
      adds: 'Evidence where this stage asserts. Fowler reports what happened to teams who started with microservices rather than arguing from first principles, and names the reason it fails: you cannot draw good service boundaries before you understand the domain, and building the monolith is how you come to understand it.',
    },
    {
      title: 'Choose Boring Technology',
      source: 'Dan McKinley',
      url: 'https://mcfunley.com/choose-boring-technology',
      adds: 'The budget framing this stage implies but never states. You get roughly three innovation tokens; everything novel spends one, and the ones you spend on infrastructure are not available for the thing you are actually building. Useful for the decisions that feel too small to deliberate over.',
    },
    {
      title: 'Who Needs an Architect?',
      source: 'Martin Fowler · IEEE Software',
      url: 'https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf',
      adds: 'Where this stage’s opening claim comes from — architecture as the decisions that are hard to change — and, more usefully, its limits. Fowler’s argument is that the job is to make decisions reversible rather than to make them correctly, which reframes the whole reversibility sort.',
    },
  ],
}

export function getReferences(slug: string): Reference[] {
  return REFERENCES[slug] ?? []
}
