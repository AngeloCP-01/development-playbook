import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/13-production-deployment.md`, "#### The pipeline".
 *
 * A condensed GitHub Actions workflow for deploying to ECS via OIDC.
 * Six steps from the doc's workflow chain, each annotated where it
 * carries a decision. The pivot is `wait-for-service-stability` —
 * the line that separates "deploy" from "deploy and know it worked."
 */
export const PIPELINE_ARTIFACT: Artifact = {
  id: 'ecs-deploy-pipeline',
  filename: '.github/workflows/deploy.yml',
  language: 'yaml',
  lines: [
    { text: 'name: Deploy to ECS' },
    { text: 'on: { push: { branches: [main] } }' },
    { text: '' },
    { text: 'permissions:' },
    {
      text: '  id-token: write',
      note: 'Required — requests the OIDC token from GitHub. Without it, the token request fails silently.',
    },
    { text: '  contents: read' },
    { text: '' },
    { text: 'steps:' },
    { text: '  - uses: actions/checkout@v4' },
    { text: '' },
    {
      text: '  - uses: aws-actions/configure-aws-credentials@v4',
      note: 'No long-lived secrets. GitHub mints a short-lived JWT; AWS STS exchanges it for temporary credentials.',
    },
    { text: '    with: { role-to-assume: $ROLE_ARN, aws-region: us-east-1 }' },
    { text: '' },
    { text: '  - uses: aws-actions/amazon-ecr-login@v2' },
    { text: '' },
    {
      text: '  - run: docker build -t $REGISTRY/$REPO:${{ github.sha }} . && docker push ...',
    },
    { text: '' },
    {
      text: '  - uses: aws-actions/amazon-ecs-render-task-definition@v1',
      note: 'Swaps the image field in your task definition JSON to the new tag. Every image traceable to a commit.',
    },
    { text: '' },
    { text: '  - uses: aws-actions/amazon-ecs-deploy-task-definition@v2' },
    {
      text: '    with: { wait-for-service-stability: true, wait-max-delay-seconds: 30 }',
      note: 'Without this, the workflow reports success while the circuit breaker silently rolls back.',
      pivot: true,
    },
  ],
}
