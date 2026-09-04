import type { Cheatsheet } from './types'

/**
 * Post-deploy verification commands and the ten-minute checklist.
 * Tethered to stage 14 (Post-Deployment Verification), which teaches
 * what to check after a deploy lands in production. This sheet is the
 * lookup companion: a reader who finished the stage and needs the
 * command, the metric name, or the time block reaches for this rather
 * than scrolling six panels.
 *
 * Source plate: AltexSoft's smoke vs. sanity vs. regression testing
 * comparison table.
 */
export const postDeployVerification: Cheatsheet = {
  slug: 'post-deploy-verification',
  title: 'Post-Deploy Verification',
  group: 'Standards',
  stage: '14-post-deployment-verification',
  blurb:
    'The ten-minute checklist, Vercel verification, and the six-command AWS ECS sequence.',
  source: {
    title: 'Smoke Testing vs Sanity Testing vs Regression Testing',
    author: 'AltexSoft',
    url: 'https://www.altexsoft.com/blog/smoke-testing/',
    image: {
      src: '/reference/smoke-testing-101.png',
      width: 614,
      height: 325,
      alt: 'Comparison table: smoke testing (broad, shallow, early) vs sanity testing (focused, shallow, after fixes) vs regression testing (whole application, deep, after major changes).',
    },
  },
  sections: [
    {
      title: 'The ten-minute checklist',
      note: 'Platform-agnostic. Run after every production deploy, in order. The specific tools differ between Vercel and AWS; the sequence does not.',
      rows: [
        {
          term: '0–1 min',
          what: 'Is it up? Load the production URL in a real browser. Hard refresh to bypass your cache.',
          when: 'Every deploy, no exceptions. A private window is safer than a hard refresh.',
        },
        {
          term: '1–3 min',
          what: 'Walk the critical path. Sign up, log in, checkout, create the core object. Run the smoke suite if you have one.',
          when: 'Every deploy. The smoke suite automates what you would walk manually.',
        },
        {
          term: '3–5 min',
          what: 'Check error rates. Any new issue type first seen after this deploy is your change until proven otherwise.',
          when: 'Every deploy. A rise in error volume against your baseline, or errors mentioning files you just changed.',
        },
        {
          term: '5–7 min',
          what: 'Check latency and traffic. Did p75 change? Is traffic still flowing? Any spike in 4xx or 5xx?',
          when: 'Every deploy. A sudden drop to zero means something is broken upstream of your error tracking.',
        },
        {
          term: '7–10 min',
          what: 'Check the specific thing you shipped. Verify the actual change with production data, not just general health.',
          when: 'Every deploy. The earlier checks are general health; this one confirms the feature works as intended.',
        },
      ],
    },
    {
      title: 'Vercel verification',
      note: 'Vercel-specific tools for the ten-minute check. Each maps to a time block above.',
      rows: [
        {
          code: 'pnpm test:prod',
          what: 'Run the @smoke suite against the live production URL. The same critical path you would walk manually, automated.',
          when: 'Minutes 1–3. After every promotion to main.',
        },
        {
          term: 'Vercel Analytics',
          what: 'p75 latency and traffic volume, filterable by route. A deploy that doubles p75 on one route is a bad deploy even with zero errors.',
          when: 'Minutes 5–7. Check the routes you changed plus the top-traffic routes.',
        },
        {
          code: 'VERCEL_DEPLOYMENT_ID',
          what: 'Tag Sentry releases with the deployment ID (available at build time). Filter errors by release to isolate this deploy from background noise.',
          when: 'Minutes 3–5. Sentry filtered by release is the fastest way to find new error types.',
        },
        {
          term: 'Deployment URL',
          what: 'Load the immutable URL directly: https://<project>-<hash>.vercel.app. Confirms the right build is live, not a cached older version.',
          when: 'Minute 0–1. The deployment URL bypasses CDN caching and DNS.',
        },
      ],
    },
    {
      title: 'AWS ECS verification',
      note: 'Six commands, in order. The pivot is describe-target-health: the check that services-stable does not do.',
      rows: [
        {
          code: 'aws ecs wait services-stable',
          what: 'Block until runningCount matches desiredCount. Polls every 15 seconds, times out after ~10 minutes.',
          when: 'First. A timeout means tasks are failing to start or failing health checks.',
        },
        {
          code: 'aws ecs describe-services --query deployments',
          what: 'Verify one PRIMARY deployment with rolloutState COMPLETED, runningCount matching desiredCount, failedTasks 0.',
          when: 'After services-stable passes. Two PRIMARY entries means an older deployment is still draining.',
        },
        {
          code: 'aws elbv2 describe-target-health',
          what: 'Every registered target should report State: healthy. This is the check services-stable does not do reliably.',
          when: 'Always run separately from services-stable. A service can be "stable" with all tasks failing health checks.',
        },
        {
          code: 'aws ecs describe-services --query events',
          what: 'Look for "has reached a steady state." Repeated task-stop-and-restart events mean something is crashing on startup.',
          when: 'After target health passes. The events tell you what happened, not just the current state.',
        },
        {
          code: 'aws ecs describe-tasks --query containers',
          what: 'healthStatus HEALTHY on every container. This is the Docker-level health check, distinct from ALB target health.',
          when: 'Both must pass: ALB target health (routing) and container health (process-level).',
        },
        {
          code: 'aws logs tail /ecs/<log-group> --since 15m',
          what: 'Inspect logs for error bursts. Use filter-log-events with --filter-pattern "ERROR" for targeted search.',
          when: 'Last. Even if everything above is green, an error burst in the logs means something is wrong.',
        },
      ],
    },
  ],
}
