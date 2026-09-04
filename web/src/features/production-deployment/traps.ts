export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'schema-code-together',
    title: 'Changing schema and code in one deploy.',
    body: 'The single most common way to make a rollback impossible. Expand, migrate, contract — every time, even when it feels excessive for a small change.',
  },
  {
    id: 'migration-in-build',
    title: 'Running migrations in the build step.',
    body: 'Builds retry and run concurrently. Migrations must not.',
  },
  {
    id: 'diagnose-before-rollback',
    title: 'Diagnosing before rolling back.',
    body: 'Reverse the order. Users first, curiosity second.',
  },
  {
    id: 'skip-skew',
    title: 'Skipping skew protection.',
    body: 'The bug you cannot reproduce and users keep reporting.',
  },
  {
    id: 'batch-to-reduce-risk',
    title: 'Batching changes to reduce deploy risk.',
    body: 'Backwards: larger deploys are riskier and harder to diagnose. Frequency is what makes deploys safe.',
  },
  {
    id: 'untested-rollback',
    title: 'Untested rollback.',
    body: 'A procedure you have never run is a hypothesis. Run it once deliberately, on a quiet afternoon, before you need it at 3am.',
  },
  {
    id: 'unbatched-backfills',
    title: 'Unbatched backfills.',
    body: 'A long `UPDATE` holding a lock will take the site down as effectively as any bug.',
  },
  {
    id: 'stale-flags',
    title: 'Flags that never get deleted.',
    body: 'Every stale flag doubles the state space of your application. Removing them is part of finishing a feature.',
  },
  {
    id: 'health-check-grace',
    title: 'Health check grace period too short.',
    body: 'ECS kills tasks before they finish starting. The default grace period is zero seconds — a container that takes thirty seconds to boot fails its first health check and restarts in a loop. Set `healthCheckGracePeriodSeconds` to longer than your startup time.',
  },
  {
    id: 'nat-without-endpoints',
    title: 'NAT Gateway without VPC endpoints.',
    body: 'Every AWS API call from a private subnet goes through the NAT Gateway at $0.045/GB. ECR image pulls, CloudWatch log writes, SSM parameter reads — all NAT traffic unless you create VPC endpoints for those services.',
  },
  {
    id: 'min-max-deadlock',
    title: 'minimumHealthyPercent and maximumPercent deadlock.',
    body: 'Both at 100% with `desiredCount: 1`. The scheduler cannot start the new task (exceeds max) or stop the old one (violates min). The deployment hangs with no error.',
  },
  {
    id: 'no-wait-for-stability',
    title: 'Deploying without `wait-for-service-stability`.',
    body: 'The GitHub Actions workflow reports success after calling `UpdateService`. Meanwhile, the deployment circuit breaker detects failing health checks and rolls back. Your pipeline is green; your production is on the old version.',
  },
]
