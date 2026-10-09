export type BaselineField = {
  id: string
  label: string
  prompt: string
  options: readonly { id: string; label: string }[]
  answer: string
  why: string
}

export const BASELINE_PRACTICE: readonly BaselineField[] = [
  {
    id: 'outcome',
    label: 'Outcome',
    prompt:
      'The customer waits after clicking Place order. Which clock belongs in the baseline?',
    options: [
      {
        id: 'browser',
        label: 'Place order click to response receipt in the browser',
      },
      { id: 'server', label: 'Server handler entry to server response' },
    ],
    answer: 'browser',
    why: 'The browser observes the selected user outcome. Server route duration is diagnostic and excludes part of the user wait.',
  },
  {
    id: 'metric',
    label: 'Metric and population',
    prompt:
      'Some attempts time out. How should the duration percentile be defined?',
    options: [
      {
        id: 'completed',
        label:
          'Duration p95 from completed outcomes; report total attempts, completed samples, failures and timeouts separately',
      },
      {
        id: 'success',
        label: 'Duration p95 from successes only; omit failures and timeouts',
      },
    ],
    answer: 'completed',
    why: 'State the completed-outcome denominator and keep the same rule after the change. Failure counts can overlap completed outcomes; they are not a partition to sum.',
  },
  {
    id: 'scope',
    label: 'Scope',
    prompt: 'Which scope lets a later observation be compared with this one?',
    options: [
      {
        id: 'specified',
        label:
          'POST /orders; version order-before; mobile Chrome; network profile mobile-4g-v1; 20-item cart; hypothetical inventory of 10000 SKUs; warm cache',
      },
      {
        id: 'mixed',
        label:
          'All orders from every device; cache state and cart size unknown',
      },
    ],
    answer: 'specified',
    why: 'Name the route, deployment, segment, cart/data shape and cache state. Change the version deliberately and keep the workload comparable.',
  },
  {
    id: 'window',
    label: 'Window and sample',
    prompt:
      'Field observations have not been gathered yet. What belongs in the example record?',
    options: [
      {
        id: 'unknown',
        label:
          'Planned field window 2026-10-01 to 2026-10-07; completed sample and attempt counts not yet recorded; p95 not yet recorded',
      },
      {
        id: 'guess',
        label: 'Call one controlled 20-item cart run the production p95',
      },
    ],
    answer: 'unknown',
    why: 'Leave unknown field values unfilled. Record sparse samples as insufficient, retain a controlled baseline and name the next observation window.',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    prompt:
      'What can establish the user baseline and explain a possible cause?',
    options: [
      {
        id: 'separate',
        label:
          'Browser outcome record when collected; route trace and controlled cart reproduction as separate diagnostic evidence',
      },
      {
        id: 'substitute',
        label: 'A database query plan proves the entire browser p95',
      },
    ],
    answer: 'separate',
    why: 'A trace explains instrumented work. A controlled run or one query plan cannot fill the user-outcome field percentile.',
  },
]
