/**
 * Source: `docs/13-production-deployment.md`, "### AWS deployment strategies".
 *
 * Cost ranges are order-of-magnitude, US East. They match the doc's table
 * and are designed to stay useful across pricing updates.
 */

export type CostRow = {
  id: string
  service: string
  low: number
  high: number
  vercelIncludes: string
}

export const AWS_COSTS: CostRow[] = [
  {
    id: 'alb',
    service: 'Application Load Balancer',
    low: 22,
    high: 27,
    vercelIncludes: 'Routing, TLS, load balancing',
  },
  {
    id: 'nat',
    service: 'NAT Gateway',
    low: 35,
    high: 100,
    vercelIncludes: 'Outbound internet from private subnets',
  },
  {
    id: 'fargate',
    service: 'Fargate (one task)',
    low: 18,
    high: 40,
    vercelIncludes: 'Compute',
  },
  {
    id: 'data-transfer',
    service: 'Data transfer',
    low: 5,
    high: 20,
    vercelIncludes: 'Inter-AZ, egress, NAT processing',
  },
  {
    id: 'cloudwatch',
    service: 'CloudWatch',
    low: 5,
    high: 15,
    vercelIncludes: 'Logs, metrics, alarms',
  },
  {
    id: 'ecr',
    service: 'ECR',
    low: 1,
    high: 2,
    vercelIncludes: 'Container registry',
  },
]

export type Strategy = {
  id: string
  name: string
  pattern: string
}

export const STRATEGIES: Strategy[] = [
  {
    id: 'canary-5',
    name: 'ECSCanary10Percent5Minutes',
    pattern: '10% first, rest after 5 min',
  },
  {
    id: 'canary-15',
    name: 'ECSCanary10Percent15Minutes',
    pattern: '10% first, rest after 15 min',
  },
  {
    id: 'linear-1',
    name: 'ECSLinear10PercentEvery1Minutes',
    pattern: '10% every 1 min (~10 min total)',
  },
  {
    id: 'linear-3',
    name: 'ECSLinear10PercentEvery3Minutes',
    pattern: '10% every 3 min (~30 min total)',
  },
  {
    id: 'all-at-once',
    name: 'ECSAllAtOnce',
    pattern: 'Immediate full cutover',
  },
]

export const ROLLING_CONFIG = {
  minimumHealthyPercent: 100,
  maximumPercent: 200,
} as const

export const CIRCUIT_BREAKER_CONFIG = {
  enable: true,
  rollback: true,
} as const
