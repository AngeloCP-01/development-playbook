import type { Artifact } from '@/components/artifact'

/**
 * Source: `docs/14-post-deployment-verification.md`, "### AWS: where to look".
 *
 * The six-command sequence for checking an ECS/Fargate deploy across its
 * three layers — the ECS service, the load balancer, and the application
 * logs. The pivot is `describe-target-health` — the check
 * `services-stable` does not do, called out in the doc's own trap entry
 * ("Trusting `services-stable` alone on AWS").
 */
export const AWS_VERIFICATION: Artifact = {
  id: 'aws-ecs-verification',
  filename: 'verify-ecs-deploy.sh',
  language: 'bash',
  lines: [
    {
      text: '# 1. Wait for the service to stabilize',
      note: 'Polls every 15s, times out after ~10 minutes. A timeout means tasks are failing to start or failing health checks.',
    },
    { text: 'aws ecs wait services-stable \\' },
    { text: '  --cluster <cluster> --services <service>' },
    { text: '' },
    {
      text: '# 2. Verify the deployment completed',
      note: 'One PRIMARY deployment, rolloutState COMPLETED, runningCount matches desiredCount, failedTasks 0.',
    },
    { text: 'aws ecs describe-services --cluster <cluster> \\' },
    { text: "  --services <service> --query 'services[0].deployments[*].\\" },
    { text: "  [status,rolloutState,runningCount,desiredCount,failedTasks]'" },
    { text: '' },
    { text: '# 3. Check ALB target health' },
    {
      text: 'aws elbv2 describe-target-health \\',
      note: 'The check services-stable does not do reliably for new service creations — always run it separately.',
      pivot: true,
    },
    { text: '  --target-group-arn <tg-arn>' },
    { text: '' },
    {
      text: '# 4. Read the recent service events',
      note: 'Look for "has reached a steady state." Repeated stop-and-restart events mean something is crashing on startup.',
    },
    { text: 'aws ecs describe-services --cluster <cluster> \\' },
    { text: "  --services <service> --query 'services[0].events[0:5].\\" },
    { text: "  [createdAt,message]' --output table" },
    { text: '' },
    {
      text: '# 5. Check container health',
      note: 'healthStatus: HEALTHY on every container — the Docker-level check, distinct from ALB target health. Both must pass.',
    },
    { text: 'aws ecs describe-tasks --cluster <cluster> \\' },
    { text: "  --tasks <task-id> --query 'tasks[0].containers[*].\\" },
    { text: "  [name,lastStatus,healthStatus,reason]'" },
    { text: '' },
    {
      text: '# 6. Inspect logs for error bursts',
      note: 'If deployment alarms are configured, a 5XX spike during the bake period marks the deployment FAILED and can auto-rollback.',
    },
    { text: 'aws logs tail /ecs/<log-group> --since 15m --follow' },
    {
      text: 'aws logs filter-log-events --log-group-name /ecs/<log-group> \\',
    },
    { text: "  --filter-pattern 'ERROR'" },
  ],
}
