export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'deploy-succeeded-as-done',
    title: 'Treating "deploy succeeded" as done',
    body: 'The build compiled. That is all you know.',
  },
  {
    id: 'cached-browser',
    title: 'Verifying with a cached browser',
    body: 'You load the page, it works, and you are looking at the old build from your own cache. Hard refresh, or use a private window.',
  },
  {
    id: 'checking-too-early',
    title: 'Checking too early',
    body: 'Vercel reports success before the CDN has fully propagated and before enough traffic exists to be meaningful. Give it a minute or two.',
  },
  {
    id: 'no-baseline',
    title: 'Having no baseline',
    body: 'Without knowing normal, every number is unreadable, and you will either panic at nothing or ignore something real.',
  },
  {
    id: 'destructive-smoke-tests',
    title: 'Destructive smoke tests',
    body: 'A production smoke test that creates and deletes records will eventually delete the wrong one. Read-mostly, idempotent, dedicated test account.',
  },
  {
    id: 'happy-path-only',
    title: 'Only checking the happy path',
    body: 'The deploy broke the signed-out view, and you have been logged in for six months.',
  },
  {
    id: 'skipping-trivial',
    title: 'Skipping it because the change was trivial',
    body: 'Trivial changes are the ones that ship unverified, which is precisely why they show up disproportionately in incident post-mortems.',
  },
  {
    id: 'checking-once',
    title: 'Checking once and walking away',
    body: 'Cache and cron bugs need the thirty-minute follow-up.',
  },
  {
    id: 'services-stable-alone',
    title: 'Trusting `services-stable` alone on AWS',
    body: '`aws ecs wait services-stable` checks that `runningCount` matches `desiredCount`. It does not verify that ALB targets are healthy — a service can be "stable" with all tasks running and all of them failing health checks. Always run `describe-target-health` separately.',
  },
  {
    id: 'no-deployment-alarms',
    title: 'No deployment alarms configured',
    body: 'ECS reports the deployment succeeded. Meanwhile, CloudWatch shows a 5XX spike that nobody is watching because no alarm was wired to the deployment. The deployment circuit breaker only fires if you give it alarms to check.',
  },
  {
    id: 'bake-time-too-short',
    title: 'Bake time too short',
    body: "The deployment alarm bake period ends before slow-onset problems surface — a memory leak that takes fifteen minutes, a cache that expires after ten. If the bake window is shorter than the problem's onset time, the alarm never fires and the deployment is marked `COMPLETED` with a live defect.",
  },
]
