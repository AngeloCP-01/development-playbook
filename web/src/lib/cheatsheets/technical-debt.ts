import type { Cheatsheet } from './types'

export const technicalDebt: Cheatsheet = {
  slug: 'technical-debt',
  title: 'Technical Debt Review',
  group: 'Standards',
  stage: '17-maintenance',
  blurb:
    'Recognize a design cost, choose a response from evidence, and check what retirement affects.',
  source: {
    title: 'Technical Debt Quadrant',
    author: 'Martin Fowler (2009); unchanged illustration',
    url: 'https://martinfowler.com/bliki/TechnicalDebtQuadrant.html',
    image: {
      src: '/reference/stage-17-tech-debt-quadrant.png',
      width: 512,
      height: 384,
      alt: 'Technical debt quadrant: reckless or prudent decisions can each create deliberate or inadvertent debt. All four cases are explained in Recognize the debt.',
    },
  },
  additionalSources: [
    {
      title: 'Workflows of Refactoring',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/articles/workflowsOfRefactoring/fallback.html',
    },
    {
      title: 'Software Engineering at Google: Deprecation',
      author: 'Hyrum Wright / Google; edited by Tom Manshreck',
      url: 'https://abseil.io/resources/swe-book/html/ch15.html',
    },
    {
      title: 'Illustration reuse policy',
      author: 'Martin Fowler',
      url: 'https://martinfowler.com/faq.html',
    },
  ],
  sections: [
    {
      title: 'Recognize the debt',
      note: 'Fowler’s two axes describe care in the decision (reckless or prudent) and awareness of taking on debt (deliberate or inadvertent). The four cases below paraphrase the gathered illustration. A category does not determine repayment urgency, blame or whether a change is worthwhile.',
      rows: [
        {
          term: 'Reckless / deliberate',
          what: 'The team knowingly skips design work without weighing the future cost.',
        },
        {
          term: 'Prudent / deliberate',
          what: 'The team weighs the consequences and accepts a design compromise to gain an earlier release.',
        },
        {
          term: 'Reckless / inadvertent',
          what: 'The team lacks design knowledge and creates a costly structure without recognizing the debt.',
        },
        {
          term: 'Prudent / inadvertent',
          what: 'A capable team learns through building and later sees a better design than it could see at the start.',
        },
      ],
    },
    {
      title: 'Decide from evidence',
      note: 'These review prompts are the playbook’s application guidance, not a scoring system prescribed by Fowler. Open Stage 17 for exercises and fuller operational context.',
      rows: [
        {
          term: 'Observed recurring cost',
          what: 'Link repeated edits, defects or delayed changes to the affected behavior and investigate the cause.',
          when: 'Repeated bugs alone do not establish that the design needs replacing.',
        },
        {
          term: 'Impact and deadline',
          what: 'Record who is affected, the cost or risk of waiting, and any real deadline. Keep unknown exposure explicit.',
        },
        {
          term: 'Smallest useful change',
          what: 'Identify a bounded improvement, its likely next touch and the future work it could make cheaper. Compare the expected benefit with the effort.',
        },
        {
          term: 'Owner and review date',
          what: 'Name an owner, link the evidence, and set a review date and a trigger for reconsidering the decision.',
        },
      ],
    },
    {
      title: 'Choose a response',
      note: 'Establish checks for current behavior before restructuring fragile code, then rerun them after each small change. Keep feature changes separate enough to review; tests provide evidence within their coverage.',
      rows: [
        {
          term: 'Nearby refactor',
          what: 'Improve the area you are already changing when the cleanup helps that task. Keep the structural change small and check affected callers.',
        },
        {
          term: 'Planned incremental change',
          what: 'Give a larger restructuring an owner, compatibility steps and checkpoints. Make small changes while keeping the system usable.',
        },
        {
          term: 'Deliberate deferral',
          what: 'Record why carrying the cost is acceptable for now, the owner and the review trigger. A rarely touched area may not repay the effort to change it.',
        },
      ],
    },
    {
      title: 'Retire with evidence',
      note: 'Retirement changes behavior. These playbook checks apply the deprecation guidance to a removal decision.',
      rows: [
        {
          term: 'Discover consumers',
          what: 'Check callers, jobs, integrations, runtime usage and support knowledge. Check telemetry coverage and the relevant usage cycle before treating low counts as evidence of disuse.',
          when: 'Missing telemetry leaves usage unknown; rare recovery or administrative paths may still matter.',
        },
        {
          term: 'Migration and communication',
          what: 'Identify affected owners, communicate the change and provide a migration route where needed. Prefer a reversible disable step where practical, with a way to detect trouble and recover.',
        },
        {
          term: 'Verify removal and effects',
          what: 'Check remaining behavior and remove stale flags, configuration, dependencies, tests and docs. Account separately for stored data, subscriptions and external effects.',
          when: 'Version control can restore tracked code; it cannot restore deleted production data or undo notifications, billing or broken external contracts.',
        },
      ],
    },
  ],
}
