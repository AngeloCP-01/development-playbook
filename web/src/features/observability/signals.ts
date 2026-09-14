/**
 * Source: `docs/15-observability.md`, "### The four signals" — the table.
 * Each row states its category before it names a product, which is the
 * stage-transfer point the doc round was opened to fix (C5).
 */
export type Signal = {
  id: string
  name: string
  /** Where it comes from — the category, before any product. */
  source: string
  vercel: string
  aws: string
}

export const SIGNALS: Signal[] = [
  {
    id: 'latency',
    name: 'Latency',
    source:
      'The HTTP layer in front of your app, which already times every request',
    vercel: 'Vercel Observability, per route',
    aws: 'ALB or API Gateway CloudWatch metrics',
  },
  {
    id: 'traffic',
    name: 'Traffic',
    source:
      'The same layer — it counts every request, which is also your denominator',
    vercel: 'The same place',
    aws: 'The same CloudWatch metrics',
  },
  {
    id: 'errors',
    name: 'Errors',
    source:
      'Two questions, not one: what broke and how often. Sentry answers the first; the request-counting layer answers the second',
    vercel: 'Edge Requests by status code; Sentry for what broke',
    aws: 'ALB 5XX over request count; Sentry for what broke',
  },
  {
    id: 'saturation',
    name: 'Saturation',
    source: 'Whatever owns the resource with the ceiling',
    vercel: 'Your database dashboard, function concurrency',
    aws: 'CloudWatch per-service metrics, RDS connections',
  },
]
