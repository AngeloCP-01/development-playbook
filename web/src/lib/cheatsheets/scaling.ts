import type { Cheatsheet } from './types'

export const scaling: Cheatsheet = {
  slug: 'scaling',
  title: 'Infrastructure Scaling',
  group: 'Architecture',
  stage: '09-performance-optimization',
  blurb:
    'Find the constrained resource, compare routing choices, plan for overload, and prove the user outcome.',
  source: {
    title: 'Application Load Balancer target-group attributes',
    author: 'AWS',
    url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html',
  },
  additionalSources: [
    {
      title: 'Application Load Balancer target-group health checks',
      author: 'AWS',
      url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html',
    },
    {
      title: 'Handling Overload',
      author: 'Google SRE',
      url: 'https://sre.google/sre-book/handling-overload/',
    },
  ],
  sections: [
    {
      title: 'Locate the limit',
      note: "This is infrastructure scaling. Stage 09's Scaling to a team section describes team practice. Routing and added capacity are candidates to justify with evidence, not routine fixes for every slow request.",
      rows: [
        {
          term: 'Constrained resource',
          what: 'Name the user outcome, workload and limiting resource using measurements. CPU, memory, connections, storage or a shared dependency can constrain different operations.',
          when: 'A utilization chart alone does not define the observer, duration or customer harm.',
        },
        {
          term: 'Vertical capacity',
          what: 'Increase resources on one instance when evidence shows its resource limit is the constraint.',
          when: 'Check the remaining limit, failure exposure and cost rather than assuming a larger instance is faster.',
        },
        {
          term: 'Horizontal capacity',
          what: 'Add replicas when the work can be safely distributed and the shared dependencies can support it.',
          when: 'Check state, session and connection assumptions before adding targets.',
        },
        {
          term: 'Routing and dependencies',
          what: 'A load balancer distributes requests. More application replicas do not establish more capacity in a shared database; reducing expensive work is a different candidate.',
          when: 'Check the dependency that remains shared and identify what the proposed change actually relieves.',
        },
      ],
    },
    {
      title: 'Choose routing',
      note: 'The following are AWS Application Load Balancer (ALB) target-group algorithms. A provider-specific setting is not a universal algorithm list. Sticky sessions can bypass subsequent routing choices.',
      rows: [
        {
          term: 'Round robin',
          what: 'Distribute requests across healthy targets in sequential order under normal routing conditions.',
          when: 'An ALB default suited to similarly costly requests and similarly capable targets; stickiness affects subsequent target selection.',
        },
        {
          term: 'Least outstanding requests',
          what: 'Choose the target with the fewest in-flight requests.',
          when: 'An ALB option for varying request cost or target capability. It does not support slow start; sticky sessions affect subsequent selection.',
        },
        {
          term: 'Weighted random',
          what: 'Randomly distribute requests across healthy targets; optional Automatic Target Weights anomaly mitigation can adjust distribution.',
          when: 'ALB weighted random does not support sticky sessions or slow start. Check the intended workload and feature compatibility.',
        },
        {
          code: 'aws elbv2 describe-target-group-attributes --target-group-arn "$TARGET_GROUP_ARN"',
          what: 'Read target-group attributes without changing routing. TARGET_GROUP_ARN must name your permitted test group; AWS credentials and read permission are required.',
          when: 'Inspect routing, stickiness and health settings before proposing a mutation.',
        },
      ],
    },
    {
      title: 'Check health and overload',
      note: 'Health checks and routing do not create unlimited capacity. Define the operation the probe represents and the behavior when capacity or targets fail.',
      rows: [
        {
          term: 'Health checks and fail-open',
          what: 'ALB normally routes to healthy targets. If all registered targets are unhealthy, it fails open and can route to them regardless of health status.',
          when: 'A failed probe is not proof that all traffic to that target has stopped; inspect health/routing thresholds as well as the reason code.',
        },
        {
          term: 'Draining and failure capacity',
          what: 'Deregistration allows in-flight work time to finish. Check remaining target and dependency capacity while a target or zone is unavailable.',
          when: 'A connection terminated before draining completes can fail a request; do not equate a removed target with completed customer work.',
        },
        {
          term: 'Admission and degradation',
          what: 'Keep admitted work and queues bounded. Under overload, use a defined safe degraded response or reject excess work instead of letting backlog grow without a limit.',
          when: 'Degrade only when the user contract permits it; stale payment or authorization state is not a safe shortcut.',
        },
        {
          term: 'Retries and uncertain outcomes',
          what: 'Retries add work to an overloaded service. Use a bounded retry policy and establish whether a timed-out side effect already succeeded before replay.',
          when: 'A charge or write may have completed before the timeout. Reconcile uncertain outcomes rather than assuming retry means recovery.',
        },
      ],
    },
    {
      title: 'Prove the outcome',
      note: 'There is no universal requests-per-second target or replica count. Example workloads are illustrative; measure the same operation before and after.',
      rows: [
        {
          term: 'User latency and errors',
          what: 'Compare the same start/end observer, segment, workload and collection window. Define the percentile population and keep failures visible. A p95 is the duration at the 95th percentile of that population.',
          when: 'A faster routing or server span does not prove the user operation improved.',
        },
        {
          term: 'Resource and delayed work',
          what: 'Check the limiting resource, shared dependencies and oldest pending work where applicable. Verify capacity during failure as well as normal traffic.',
          when: 'A healthy homepage or an empty request queue does not prove that downstream work completed.',
        },
        {
          term: 'Correctness and cost',
          what: 'Retest state/session assumptions and actual customer outcomes. Compare resource cost, record unresolved limits, and keep or revert the change from that evidence.',
          when: 'Adding replicas is not a win if the outcome still misses its target or correctness regresses.',
        },
      ],
    },
  ],
}
