// web/src/features/observability/traps.ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'alerting-on-everything',
    title: 'Alerting on everything',
    body: 'Guarantees you will ignore alerts, including the important one. Fewer, sharper alerts beat comprehensive coverage.',
  },
  {
    id: 'causes-not-symptoms',
    title: 'Alerting on causes, not symptoms',
    body: 'High CPU is not a problem. Users unable to check out is.',
  },
  {
    id: 'health-checks-that-check-nothing',
    title: 'Health checks that check nothing',
    body: 'A hardcoded `200 OK` tells you the process is running.',
  },
  {
    id: 'only-monitoring-from-inside',
    title: 'Only monitoring from inside',
    body: 'You will not detect DNS failures, regional outages, or certificate expiry.',
  },
  {
    id: 'unstructured-logs',
    title: 'Unstructured logs',
    body: 'Fine at ten lines a day, useless at ten thousand.',
  },
  {
    id: 'logging-secrets',
    title: 'Logging secrets',
    body: 'Retained for a long time, visible to everyone with account access, and shipped to a third party.',
  },
  {
    id: 'averages-instead-of-percentiles',
    title: 'Averages instead of percentiles',
    body: 'The average is always fine.',
  },
  {
    id: 'no-baseline',
    title: 'No baseline',
    body: 'Without knowing normal, every number is unreadable during an incident, which is exactly when you need to read it fastest.',
  },
  {
    id: 'dashboards-nobody-looks-at',
    title: 'Dashboards nobody looks at',
    body: 'If it is not glanceable in one screen, it will not be glanced at.',
  },
  {
    id: 'email-alerts',
    title: 'Email alerts for urgent problems',
    body: 'Read tomorrow morning. The outage was tonight.',
  },
  {
    id: 'only-fires-on-events',
    title: 'Monitoring that only fires on events',
    body: 'The job that stopped running, the orders that stopped arriving, and the alert that stopped being delivered all produce silence. Check for missing expected events as well as failures.',
  },
  {
    id: 'heartbeat-in-finally',
    title: 'A heartbeat in a `finally` block',
    body: 'It reports success for a run that threw, so your monitor tells you the job worked when it did not.',
  },
  {
    id: 'no-retention-policy',
    title: 'Logs with no retention policy',
    body: 'CloudWatch Logs retains them indefinitely by default. On a container platform, stdout may disappear before you need it. Choose how long the destination keeps the data.',
  },
  {
    id: 'alert-never-seen-arrive',
    title: 'An alert nobody has ever seen arrive',
    body: 'A configured alert can still route to a dead phone number. Fire it deliberately and confirm delivery.',
  },
  {
    id: 'health-checks-wired-to-restart',
    title: 'Health checks wired to the thing that restarts you',
    body: "Point a platform's liveness probe at a check that fails when the database blinks and the platform can restart healthy instances during a database outage.",
  },
]
