import type { Cheatsheet } from './types'

/**
 * A guide to the whole, not lookup material for one stage — which is why it
 * carries no `stage` tether. Same shape the Languages group already uses for
 * sheets that do not belong to a single stage. Registered under Standards
 * rather than a new group: SDLC is a way this repo does things, same as
 * coding-standards is, just at a wider scope.
 *
 * The seven phases are taught through one running example — adding password
 * reset to a small app — rather than seven unrelated ones (2026-08-25, user
 * request: teach the phase, not just name what it produces). A single thread
 * carried end to end is what makes each phase's abstract definition land: the
 * reader sees the *same* feature's risk in Planning, its non-functional
 * requirement in Requirements, the schema decision that requirement forces in
 * Design, and so on — each phase's output is visibly the input the next one
 * needed, which a list of seven disconnected artifact types cannot show. No
 * code examples: SDLC is a process framework, and Shiki tokenising a plain
 * English sentence as TypeScript would be a mismatch between what a block
 * looks like and what it is.
 */
export const sdlc: Cheatsheet = {
  slug: 'sdlc',
  title: 'Software Development Life Cycle',
  group: 'Standards',
  blurb: 'The seven phases every stage in this playbook is a close-up of.',
  source: {
    title: 'Software Development Life Cycle (SDLC)',
    author: 'Unrecorded — see reference/cheatsheet-sources.md',
    image: {
      src: '/reference/sdlc.webp',
      width: 1280,
      height: 720,
      alt: 'The seven SDLC phases arranged in a wheel: planning, requirements analysis, design, development, testing, deployment, maintenance.',
    },
  },
  sections: [
    {
      title: 'The seven phases',
      note: 'Followed through one running example — adding password reset to a small app — so each phase shows what it actually produces, and what the next phase does with it, rather than naming its output in the abstract.',
      rows: [
        {
          term: '1. Planning',
          what: 'Define the problem, objectives, scope, resources and risks.',
          when: 'Password reset: the problem is support tickets from locked-out users, not a feature anyone asked for by name. The objective is cutting those tickets to zero. The scope decision — email links only, no SMS — is made here, and so is the risk that matters most: the reset flow itself could let an attacker learn which emails have an account.',
        },
        {
          term: '2. Requirements analysis',
          what: 'Gather and analyze functional and non-functional requirements.',
          when: 'The functional requirement: a user who forgets their password can request a reset link by email and set a new one. The non-functional requirement is what Planning’s risk turns into something checkable: the link must expire in 30 minutes, and requesting one must say “check your email” whether or not that address has an account — so the flow itself can’t be used to test which emails are registered.',
        },
        {
          term: '3. Design',
          what: 'System architecture, database design, UI/UX and component detail.',
          when: 'The non-functional requirement forces a real decision here, not just a nice one: a `password_reset_tokens` table storing a hashed token and an expiry, never the token itself — because a token readable in the database is a token a database leak hands out. One endpoint to request a reset, one to redeem it, and a single “check your email” screen that never says whether the address existed.',
        },
        {
          term: '4. Development',
          what: 'Write clean, efficient code and build the application.',
          when: 'Four small pull requests rather than one large one: the request endpoint, token generation and hashing, the redeem endpoint, the email template. Small enough that a reviewer can actually check the hashing decision from Design landed in the code, not just that something got built.',
        },
        {
          term: '5. Testing',
          what: 'Test for functionality, performance, security and bugs.',
          when: 'Does a valid token reset the password? Does an expired one get rejected? Requesting five reset emails in a minute — does the sixth get rate-limited? And the one Design exists to prevent: does requesting a reset for an email that isn’t registered look identical to requesting one that is?',
        },
        {
          term: '6. Deployment',
          what: 'Release the application to the production environment.',
          when: 'Shipped behind a feature flag to 5% of traffic first, watching the error rate and how many reset emails actually arrive, before widening to everyone. A flag exists so a bad rollout is a flip, not a revert.',
        },
        {
          term: '7. Maintenance',
          what: 'Monitor, fix issues, improve performance, and add new features.',
          when: 'Three months on, support tickets show reset emails landing in spam. The fix is an SPF/DKIM record, not a code change — the kind of fix this phase exists for, and the reason “maintenance” outlasts every other phase rather than closing when they do.',
        },
      ],
    },
    {
      title: 'How different methodologies run the loop',
      note: 'Same seven phases every time — what changes is whether they run once, in a short repeating slice, or continuously.',
      rows: [
        {
          term: 'Waterfall',
          what: 'Runs the seven phases once, in strict sequence — each phase finishes and is signed off before the next starts.',
          when: 'Requirements that are genuinely fixed and unlikely to change: regulated or safety-critical builds, fixed-price contracts.',
        },
        {
          term: 'Agile / Scrum',
          what: 'Runs a thin slice of all seven phases every sprint (one to four weeks), re-planning and re-prioritising each time.',
          when: 'Requirements that will keep changing as the product is used — most product work, this playbook’s own stage 02 included.',
        },
        {
          term: 'DevOps / Continuous',
          what: 'Collapses development, testing and deployment into one automated pipeline; a change can go from commit to production the same day.',
          when: 'A team with the automation to make releasing safe often — this playbook’s own default, see stage 11 (CI/CD).',
        },
      ],
    },
  ],
}
