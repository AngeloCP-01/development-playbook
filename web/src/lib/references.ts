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
  '04-project-setup': [
    {
      title: 'Configuring Node.js Version',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/deployments/configure-a-build#node.js-version',
      adds: 'The authority for the one dashboard field your repository can reach. This stage says `engines.node` overrides the project setting and that `22.x` is the form to write; this is where both come from, along with what happens when a major reaches end of life while your project is still on it.',
    },
    {
      title: 'Project Settings: Root Directory and Framework Preset',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/project-configuration',
      adds: 'The two settings behind the deploy exercise, described from the platform side. Worth reading for the settings this stage does not cover — build and install command overrides, ignored build steps — which become relevant the moment the repository is not a single app at the root.',
    },
    {
      title: 'About protected branches',
      source: 'GitHub Docs',
      url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches',
      adds: 'What branch protection can enforce beyond a required check — linear history, required reviews, who may bypass. It also states the plan limits this stage warns about, which is the detail worth confirming for yourself rather than taking from a playbook.',
    },
    {
      title: 'Source Maps in Next.js',
      source: 'Sentry Docs',
      url: 'https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/',
      adds: 'The upload mechanism this stage only sketches: where the auth token is read from, what the build logs when it is missing, and how to verify an upload landed. Go here when the smoke-test route produces a hashed chunk instead of a filename.',
    },
    {
      title: 'Total TypeScript: tsconfig Cheat Sheet',
      source: 'Matt Pocock',
      url: 'https://www.totaltypescript.com/tsconfig-cheat-sheet',
      adds: 'A per-flag argument for the compiler options this stage turns on without much justification, and for several it leaves out. The clearest short case for `noUncheckedIndexedAccess` being worth its first week of friction.',
    },
  ],
  '05-development': [
    {
      title: 'Server and Client Components',
      source: 'Next.js Docs',
      url: 'https://nextjs.org/docs/app/getting-started/server-and-client-components',
      adds: "The source for a claim this stage makes but does not walk through: a Server Component passed as `children` (or any other prop) to a Client Component is never pulled into that component's client module graph — it renders on the server and arrives as already-rendered output. Also the fuller decision list — state, browser APIs, secrets, bundle size — behind the one example shown here.",
    },
    {
      title: 'How to think about data security in Next.js',
      source: 'Next.js Docs',
      url: 'https://nextjs.org/docs/app/guides/data-security',
      adds: 'The framework’s own reasoning for authenticate-validate-authorize, not just this stage’s restatement of it: a Server Action is reachable by direct POST whether or not anything imports it, secured only by non-deterministic action IDs, which is why re-checking auth inside the action is load-bearing rather than defensive. Covers the IDOR framing by name and the case for returning only what the UI needs, both of which this stage’s `updateInvoice` follows without citing.',
    },
    {
      title: 'Basic usage',
      source: 'Zod Docs',
      url: 'https://zod.dev/basics',
      adds: 'The mechanics behind the one call this stage shows: `.parse` throws a `ZodError`, `.safeParse` returns a discriminated union instead, and `z.infer<>` is how the compiler-side type gets derived from the same schema rather than written twice. Worth reading before reaching for a refinement or a transform, neither of which this stage touches.',
    },
    {
      title: 'Short-Lived Feature Branches',
      source: 'trunkbaseddevelopment.com',
      url: 'https://trunkbaseddevelopment.com/short-lived-feature-branches/',
      adds: 'The origin of the two-day number this stage states as a rule, plus what it implies once a team exists: the branch-length limit holds regardless of team size, but trunk-based development itself stops meaning direct commits somewhere around fifteen people. Also lays out the rebase-vs-stash choice for catching a branch up before merging, which this stage names as “rebase before you open the pull request” without showing the alternative.',
    },
  ],
  '06-testing': [
    {
      title: 'Write tests. Not too many. Mostly integration.',
      source: 'Kent C. Dodds',
      url: 'https://kentcdodds.com/blog/write-tests',
      adds: 'The origin of weighting toward integration tests, argued against the classic pyramid rather than alongside it. Useful tension against this stage’s “many unit, some integration” distribution — read it for the case that a unit-heavy suite buys less confidence per test than this stage assumes.',
    },
    {
      title: 'Locators',
      source: 'Playwright Docs',
      url: 'https://playwright.dev/docs/locators',
      adds: 'The mechanics behind `getByRole` and accessible-name matching that this stage’s checkout test uses without explaining: how Playwright resolves a role and a name to one element, and the built-in auto-waiting that is the actual reason `waitForTimeout` is never necessary.',
    },
    {
      title: 'Accessible name',
      source: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Glossary/Accessible_name',
      adds: 'How the browser actually computes the string a role selector matches against — visible text, then a label, then `aria-label` — which is the computation this stage’s “role and accessible name, never a class” line assumes the reader already knows.',
    },
    {
      title: 'Mocks Aren’t Stubs',
      source: 'Martin Fowler',
      url: 'https://martinfowler.com/articles/mocksArentStubs.html',
      adds: 'The classic breakdown this stage’s one line — “mocking the database tests your mock” — compresses into a sentence: the difference between a stub and a mock, state verification against behavior verification, and the classicist-versus-mockist split over how much of a system a test should replace.',
    },
  ],
  '07-code-review': [
    {
      title: 'Best Practices for Code Review',
      source: 'SmartBear / Cisco Systems',
      url: 'https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/',
      adds: 'The canonical study: 2,500 reviews across 50 developers over 10 months. Source for the 200–400 LOC ceiling and the 60-minute session limit.',
    },
    {
      title: 'How to do a code review',
      source: 'Google Engineering Practices',
      url: 'https://google.github.io/eng-practices/review/',
      adds: 'Google’s minimalist severity system (Nit / Optional / FYI / unmarked) and the principle that every CL should leave the codebase better than it found it.',
    },
    {
      title: 'Conventional Comments',
      source: 'conventionalcomments.org',
      url: 'https://conventionalcomments.org/',
      adds: 'The label-decorated review comment format adopted by GitLab. Nine labels with blocking/non-blocking decorations.',
    },
    {
      title: 'Expectations, Outcomes, and Challenges of Modern Code Review',
      source: 'Bacchelli & Bird, ICSE 2013',
      url: 'https://dl.acm.org/doi/10.5555/2486788.2486882',
      adds: 'The Microsoft study showing knowledge transfer — not defect detection — is the primary actual outcome of review.',
    },
  ],
  '12-staging': [
    {
      title: 'Preview Deployments',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/deployments/environments#preview-environment-pre-production',
      adds: 'The mechanics this stage teaches: how preview URLs are generated, what environment variables they inherit, and the deployment lifecycle.',
    },
    {
      title: 'Database Branching',
      source: 'Neon Docs',
      url: 'https://neon.com/docs/introduction/branching',
      adds: 'The highest-value technique in this stage. Goes deeper on copy-on-write semantics, parent-child relationships, and the cost model.',
    },
    {
      title: 'Deployment Protection',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/deployment-protection',
      adds: 'Authentication options for preview URLs, including the automation bypass secret that lets Playwright reach protected pages in CI.',
    },
  ],
  '13-production-deployment': [
    {
      title: 'Instant Rollback',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/instant-rollback',
      adds: 'The rollback mechanics this stage teaches — UI and CLI flows, eligible deployments, the auto-assignment caveat, and the undo flow.',
    },
    {
      title: 'Skew Protection',
      source: 'Vercel Docs',
      url: 'https://vercel.com/docs/skew-protection',
      adds: 'The version-skew problem in depth: how deployment-ID-based cookie pinning works, maximum age, monitoring, and why mid-session users break without it.',
    },
    {
      title: 'Expand and Contract Pattern',
      source: 'Prisma Data Guide',
      url: 'https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern',
      adds: "The seven-step breakdown with diagrams and a worked example — stack-agnostic despite the Prisma framing, and deeper than this stage's three-deploy summary.",
    },
    {
      title: 'Amazon ECS Deployment Strategies',
      source: 'AWS Docs',
      url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html',
      adds: 'The rolling-update mechanics in full — minimumHealthyPercent/maximumPercent arithmetic, deployment circuit breaker thresholds, and unhealthy-task handling during deployments.',
    },
    {
      title: 'Deployment Strategies',
      source: 'AWS Whitepapers',
      url: 'https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/deployment-strategies.html',
      adds: 'The broader strategic landscape — in-place, immutable, and traffic-shifting categories — for a reader comparing AWS approaches beyond what ECS offers natively.',
    },
  ],
}

export function getReferences(slug: string): Reference[] {
  return REFERENCES[slug] ?? []
}
