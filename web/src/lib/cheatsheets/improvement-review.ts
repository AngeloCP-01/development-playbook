import type { Cheatsheet } from './types'

export const improvementReview: Cheatsheet = {
  slug: 'improvement-review',
  title: 'Improvement Review',
  group: 'Standards',
  stage: '18-continuous-improvement',
  blurb:
    'Record a prediction, compare the evidence, and decide what to keep, adapt, revert or investigate.',
  source: {
    title: 'PDSA Cycle',
    author: 'The W. Edwards Deming Institute',
    url: 'https://deming.org/explore/pdsa/',
  },
  additionalSources: [
    {
      title:
        'Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications',
      author: 'Kerry Rodden, Hilary Hutchinson and Xin Fu / Google; CHI 2010',
      url: 'https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/',
    },
    {
      title: 'Patterns of Trustworthy Experimentation: During-Experiment Stage',
      author: 'Widad Machmouchi, Somit Gupta and Ruhan Zhang / Microsoft; 2021',
      url: 'https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/',
    },
    {
      title: 'Analyse a research session',
      author: 'User research community / GOV.UK',
      url: 'https://www.gov.uk/service-manual/user-research/analyse-a-research-session',
    },
  ],
  sections: [
    {
      title: 'Frame the problem',
      note: 'These prompts adapt the sources for this playbook. Adjust the record to the change; the sources do not prescribe these fields or a fixed review cadence. Open Stage 18 for worked examples and exercises.',
      rows: [
        {
          term: 'Task and outcome type',
          what: 'Name the affected task and audience. Separate product outcomes, such as task success, from delivery/process signals, such as delivery time.',
          when: 'Faster delivery does not prove user benefit. Individual activity counts do not measure productivity.',
        },
        {
          term: 'Observations and sources',
          what: 'Record what people did or said, with source links or IDs. Keep interpretation separate and retain contrary cases and serious minority needs.',
          when: 'Check AI-assisted analysis against original sources. Synthetic feedback is not evidence from users.',
        },
        {
          term: 'Alternatives and unknowns',
          what: 'Compare a small repair, a new capability, further research and doing nothing. Record gaps, likely effort, maintenance cost and reversibility.',
        },
      ],
    },
    {
      title: 'Plan the change',
      note: 'Write the prediction and review method before acting. Fit the measure to the task; a delivery-time measure need not be a completion rate.',
      rows: [
        {
          term: 'Hypothesis and bounded action',
          what: 'State why a small change might help, who will encounter it and the effort or exposure limit.',
        },
        {
          term: 'Baseline and expected result',
          what: 'Record the population, date window, event meanings, numerator/denominator where applicable, comparison method and desired change.',
          when: 'Distinguish users, sessions and repeated attempts. A target is a decision aid, not a universal sample size or significance threshold.',
        },
        {
          term: 'Guardrails and recovery',
          what: 'Define what must remain acceptable, harm/stop conditions, how to detect them and how to contain harm or roll back.',
          when: 'Route active incidents and urgent security issues immediately; do not wait for the routine review.',
        },
        {
          term: 'Owner and review',
          what: 'Name the action owner and decision maker. Set an actual review date, measurement method and who monitors guardrails before then.',
        },
      ],
    },
    {
      title: 'Study the result',
      note: 'Record the evidence and its limits even when the action is complete. A better-looking rate or a before/after change alone does not establish useful or causal improvement.',
      rows: [
        {
          term: 'Actual outcome',
          what: 'Compare observed results with the prediction using the recorded population, window and measure. Link counts, observations and contrary cases; state what remains inconclusive.',
        },
        {
          term: 'Data quality and comparability',
          what: 'Check missing events, retries, changed definitions or audiences, seasonality and concurrent changes before interpreting movement.',
          when: 'For randomized experiments, check assignment and telemetry quality and account for repeated looks; a convenient early result cannot choose the winner.',
        },
        {
          term: 'Harm and tradeoffs',
          what: 'Inspect guardrails, affected groups and unintended costs. Record whether the benefit justifies the tradeoffs and contain harm when stop conditions are met.',
        },
      ],
    },
    {
      title: 'Decide and follow up',
      note: 'For any decision, record reasons, remaining uncertainty, an owner and the next check. Inconclusive is an evidence status: it may accompany a temporary keep or another action without implying success.',
      rows: [
        {
          term: 'Keep',
          what: 'Retain the change when the evidence and tradeoffs justify it. If keeping it temporarily with inconclusive evidence, explain why and what would trigger reconsideration.',
        },
        {
          term: 'Adapt',
          what: 'Revise the hypothesis or bounded action in light of the result. Write a new prediction and review method before trying the revision.',
        },
        {
          term: 'Revert',
          what: 'Reverse or disable the change when harm or unacceptable tradeoffs warrant it. Verify recovery and check for effects that rollback cannot undo.',
        },
        {
          term: 'Investigate further',
          what: 'Name the uncertainty and the observation or data-quality check that could resolve it. Limit further exposure and set the next review; do not force a positive conclusion.',
        },
      ],
    },
  ],
}
