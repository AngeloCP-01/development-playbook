import type { Cheatsheet } from './types'

/**
 * AWS deployment strategies, pipeline steps, and infrastructure costs.
 * Tethered to stage 13 (Production Deployment), which teaches ECS
 * deployment mechanics in depth alongside Vercel. This sheet is the
 * lookup companion: a reader who finished the stage and needs the
 * strategy name, the action version, or the monthly cost range reaches
 * for this rather than scrolling eight panels.
 *
 * No source plate — the content is original to this playbook's stage 13
 * AWS expansion, drawn from verified AWS documentation (2026-09-02).
 */
export const awsDeployment: Cheatsheet = {
  slug: 'aws-deployment',
  title: 'AWS Deployment',
  group: 'Standards',
  stage: '13-production-deployment',
  blurb:
    'ECS strategies, the GitHub Actions pipeline, and the costs Vercel hides.',
  sections: [
    {
      title: 'ECS deployment strategies',
      note: 'Predefined configurations for traffic shifting. Canary and linear require an Application Load Balancer. NLB supports only AllAtOnce.',
      rows: [
        {
          code: 'ECSCanary10Percent5Minutes',
          what: '10% of traffic shifts first, remaining 90% after 5 minutes.',
          when: 'Quick validation with a short bake window. The default starting point for most services.',
        },
        {
          code: 'ECSCanary10Percent15Minutes',
          what: '10% first, remaining 90% after 15 minutes.',
          when: 'Higher-risk changes where you want more time to watch metrics before committing.',
        },
        {
          code: 'ECSLinear10PercentEvery1Minutes',
          what: '10% every 1 minute until 100%. About 10 minutes total.',
          when: 'Gradual rollout with ten data points instead of one. Catches regressions that only appear under load.',
        },
        {
          code: 'ECSLinear10PercentEvery3Minutes',
          what: '10% every 3 minutes until 100%. About 30 minutes total.',
          when: 'Slow, cautious rollout. Services where a rollback during business hours is expensive.',
        },
        {
          code: 'ECSAllAtOnce',
          what: 'All traffic shifts immediately to the new task set.',
          when: 'When speed matters more than caution, or when the service is behind a separate traffic gate.',
        },
      ],
    },
    {
      title: 'GitHub Actions → ECS pipeline',
      note: 'The six steps from push to stable deployment. OIDC means no long-lived AWS credentials stored in GitHub.',
      rows: [
        {
          code: 'actions/checkout@v4',
          what: 'Clone the repository.',
          when: 'Every workflow. Nothing else has access to the code without it.',
        },
        {
          code: 'aws-actions/configure-aws-credentials@v4',
          what: 'Exchange a GitHub OIDC token for temporary AWS credentials via STS. Set role-to-assume and aws-region.',
          when: 'Every AWS workflow. Requires id-token: write permission and an IAM role with a trust policy for token.actions.githubusercontent.com.',
        },
        {
          code: 'aws-actions/amazon-ecr-login@v2',
          what: 'Authenticate Docker to your Elastic Container Registry. Outputs the registry URL.',
          when: 'Before docker push. mask-password defaults to true since v2.',
        },
        {
          code: 'docker build + push',
          what: 'Build the image and push it tagged with the commit SHA. Every image traceable to a commit.',
          when: 'After ECR login. Use ${{ github.sha }} as the tag, not latest.',
        },
        {
          code: 'aws-actions/amazon-ecs-render-task-definition@v1',
          what: 'Take a task definition JSON file and swap the image field to the new tag. Outputs an updated file path.',
          when: 'After push. Keep the task definition JSON in the repo (.aws/task-definition.json).',
        },
        {
          code: 'aws-actions/amazon-ecs-deploy-task-definition@v2',
          what: 'Register the new task definition revision and call UpdateService. Set wait-for-service-stability: true and wait-max-delay-seconds: 30.',
          when: 'The final step. Without wait-for-service-stability, the workflow reports success while the circuit breaker silently rolls back.',
        },
      ],
    },
    {
      title: 'Costs Vercel hides',
      note: 'Monthly cost for a small ECS Fargate service in US East. Vercel Pro ($20/seat) includes all of these. Ranges are order-of-magnitude, designed to stay useful across pricing updates.',
      rows: [
        {
          term: 'Application Load Balancer',
          what: '$22–27/month. Routing, TLS termination, load balancing. Charged hourly ($0.0225/hr) plus per LCU.',
          when: 'Every ECS service that receives HTTP traffic. There is no free tier for ALB.',
        },
        {
          term: 'NAT Gateway',
          what: '$35–100/month. Outbound internet from private subnets. $0.045/hr to exist, $0.045/GB processed.',
          when: 'Every private subnet that needs to reach the internet. The classic bill shock. VPC endpoints ($7/mo each) cut the traffic that flows through it.',
        },
        {
          term: 'Fargate (one task)',
          what: '$18–40/month. Per-second billing: $0.04048/vCPU-hour, $0.004445/GB-hour.',
          when: 'Every running container. Blue/green doubles the cost briefly during deployment (both task sets running).',
        },
        {
          term: 'Data transfer',
          what: '$5–20/month. Inter-AZ ($0.01/GB each direction), internet egress ($0.09/GB after 100 GB free), NAT processing.',
          when: 'Scales with traffic. Multi-AZ architectures multiply inter-AZ charges across every request-response pair.',
        },
        {
          term: 'CloudWatch',
          what: '$5–15/month. Log ingestion ($0.50/GB), metrics ($0.30/metric), alarms ($0.10 each), dashboards ($3 each after the first three).',
          when: 'Every service that logs or monitors. Set retention policies or archived logs grow indefinitely at $0.03/GB/month.',
        },
        {
          term: 'ECR',
          what: '$1–2/month. Storage at $0.10/GB. Transfer free within the same region.',
          when: 'Every container image. The storage cost is trivial; the real cost is NAT Gateway traffic from pulling images in private subnets.',
        },
      ],
    },
  ],
}
