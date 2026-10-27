import type { Cheatsheet } from './types'

/** One all-visible change-check card; Stage 10 owns worked examples and practice. */
export const documentation: Cheatsheet = {
  slug: 'documentation',
  title: 'Documentation Change Check',
  group: 'Standards',
  stage: '10-documentation',
  blurb:
    'Choose the document, record the facts, and check what a change makes stale.',
  source: {
    title: 'Diátaxis primer',
    author: 'Daniele Procida',
    url: 'https://diataxis.fr/start-here/',
  },
  additionalSources: [
    {
      title: 'Documenting Architecture Decisions',
      author: 'Michael Nygard / Cognitect',
      url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions',
    },
    {
      title: 'MADR 4.0.0 template',
      author: 'MADR contributors',
      url: 'https://github.com/adr/madr/blob/4.0.0/template/adr-template.md',
    },
    {
      title: 'About READMEs',
      author: 'GitHub',
      url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
    },
    {
      title: 'What to look for in a code review: Documentation',
      author: 'Google Engineering Practices',
      url: 'https://google.github.io/eng-practices/review/reviewer/looking-for.html#documentation',
    },
  ],
  sections: [
    {
      title: 'Choose a form for the reader',
      note: 'Choose for the task; four reader needs do not require four files. Open Stage 10 for worked examples and practice.',
      rows: [
        {
          term: 'Tutorial',
          what: 'A guided learning exercise with a safe starting point and an achievable result.',
          when: 'The reader needs to learn a skill by doing it.',
        },
        {
          term: 'How-to guide',
          what: 'Steps for a known task, with prerequisites and an observable completion condition.',
          when: 'The reader needs to get work done.',
        },
        {
          term: 'Reference',
          what: 'Exact names, types, allowed values, defaults and absence behavior for the applicable version.',
          when: 'The reader needs a fact, such as a retry option or response field.',
        },
        {
          term: 'Explanation',
          what: 'Concepts, reasons and tradeoffs that help the reader understand a choice.',
          when: 'The reader needs context rather than a procedure.',
        },
      ],
    },
    {
      title: 'Adapt the record prompts',
      note: 'These are playbook prompts, not a mandatory document inventory or fixed template. MADR metadata and confirmation are optional; use the detail the decision needs.',
      rows: [
        {
          term: 'README entry point',
          what: 'Purpose and reader; actual prerequisites, safe configuration/access, tested setup commands, expected result and a help route.',
          when: 'Follow the setup from a fresh clone without private instructions; record the first gap.',
        },
        {
          term: 'Decision record',
          what: 'Significant choice, context, decision, reasons, alternatives, consequences and current status/date.',
          when: 'Include costs and obligations, not only benefits. Link the source or revision the choice applies to.',
        },
        {
          term: 'Factual reference',
          what: 'Name/type, allowed values, default or absence, applicable version, authoritative source and review trigger.',
          when: 'Distinguish missing, null and empty according to the actual contract.',
        },
        {
          term: 'Change/check record',
          what: 'Reader/task, changed fact, affected documents, source/revision, check, expected/observed result, owner and review trigger.',
          when: 'Keep this in the change or review record; a separate document is optional.',
        },
      ],
    },
    {
      title: 'Trace the changed fact',
      note: 'Checks and owner/review prompts are this playbook’s application guidance. Generation or a checked box does not establish that a source is correct.',
      rows: [
        {
          term: 'Configuration',
          what: 'Update the configuration reference, safe example and affected setup instructions. Compare missing/invalid/default behavior with the actual validator.',
          when: 'Name the maintainer and validator-change trigger.',
        },
        {
          term: 'Response contract',
          what: 'Update reference and example responses. Run the applicable generator, inspect the expected diff and verify serializer behavior, including optional-field omission.',
          when: 'Name the contract owner and response-change trigger.',
        },
        {
          term: 'Replaced decision',
          what: 'Write the replacement ADR. Preserve the old reasoning, expose its current superseded status and date, and link old and new records in both directions.',
          when: 'Follow the old entry point and confirm the replacement is discoverable.',
        },
        {
          term: 'Setup or release procedure',
          what: 'Update the README and linked procedure when commands, access or environment change. Follow the documented path safely and record its result and limits.',
          when: 'Name the responsible maintainer and procedure-change trigger.',
        },
      ],
    },
    {
      title: 'Publish only supported claims',
      rows: [
        {
          term: 'Label the evidence',
          what: 'Record revision, check, expected and observed result, and limits. Reading is not execution; compiling does not establish runtime behavior or recovery.',
        },
        {
          term: 'Review an AI draft',
          what: 'Ground it in supplied sources and have a reviewer check facts, versions, examples and privacy. Claim validation only when the corresponding evidence exists.',
        },
        {
          term: 'Use safe examples',
          what: 'Use synthetic data and safe placeholders. Keep real credentials and private records out; do not invent project commands, provider guarantees or incident outcomes.',
        },
      ],
    },
  ],
}
