export type StageGroup = 'Before code' | 'Building' | 'Shipping' | 'Running'

export type Stage = {
  num: string
  slug: string
  title: string
  /** One line: what this stage buys you. Shown in the sidebar tooltip and page header. */
  blurb: string
  group: StageGroup
  /** Real timing, which is often not the stage number. */
  timing: string
  /** Short cadence code for the title block. */
  cadence: string
  ready: boolean
}

export const STAGES: Stage[] = [
  {
    num: '01',
    cadence: 'Before any code · repeats per feature',
    slug: '01-product-discovery',
    title: 'Product Discovery',
    blurb:
      'Find out whether the thing is worth building, before you spend three months building it.',
    group: 'Before code',
    timing: 'Before any code — and again before any significant feature.',
    ready: true,
  },
  {
    num: '02',
    cadence: 'After discovery · re-run whenever scope shifts',
    slug: '02-planning',
    title: 'Product Planning',
    blurb:
      'Decide what to build first, what you are deliberately not building at all, and where it goes after that.',
    group: 'Before code',
    timing:
      'After discovery, before architecture — and again every time scope shifts.',
    ready: true,
  },
  {
    num: '03',
    cadence: 'Before setup · revisit on strain',
    slug: '03-architecture',
    title: 'Architecture',
    blurb:
      'Make the decisions that are expensive to reverse. Defer everything else.',
    group: 'Before code',
    timing: 'After planning, before project setup.',
    ready: true,
  },
  {
    num: '04',
    cadence: 'Once, day one',
    slug: '04-project-setup',
    title: 'Project Setup',
    blurb:
      'One afternoon that buys you every merge gate, preview deploy, and convention.',
    group: 'Building',
    timing: 'Once, on day one, before the first feature.',
    ready: true,
  },
  {
    num: '05',
    cadence: 'Continuous',
    slug: '05-development',
    title: 'Development',
    blurb: 'The loop you run dozens of times a day.',
    group: 'Building',
    timing: 'Continuously.',
    ready: true,
  },
  {
    num: '06',
    cadence: 'With the code, usually before it',
    slug: '06-testing',
    title: 'Testing',
    blurb: 'Enough confidence to change code without fear.',
    group: 'Building',
    timing: 'During development — usually before the code.',
    ready: true,
  },
  {
    num: '07',
    cadence: 'Every merge',
    slug: '07-code-review',
    title: 'Code Review',
    blurb: 'A deliberate second look before code becomes permanent.',
    group: 'Building',
    timing: 'Before every merge.',
    ready: true,
  },
  {
    num: '08',
    cadence: 'Pre-launch, then quarterly',
    slug: '08-security-audit',
    title: 'Security Audit',
    blurb:
      'Find the vulnerabilities that actually apply, before someone else does.',
    group: 'Building',
    timing: 'Before launch, then quarterly.',
    ready: false,
  },
  {
    num: '09',
    cadence: 'On measured slowness only',
    slug: '09-performance-optimization',
    title: 'Performance Optimization',
    blurb: 'Make it fast enough, using measurements rather than instinct.',
    group: 'Building',
    timing: 'When something is measurably slow. Never preemptively.',
    ready: false,
  },
  {
    num: '10',
    cadence: 'Continuous',
    slug: '10-documentation',
    title: 'Documentation',
    blurb: 'Write down what code cannot say: why.',
    group: 'Building',
    timing: 'Continuously, a little with every change.',
    ready: false,
  },
  {
    num: '11',
    cadence: 'Wired during stage 04',
    slug: '11-ci-cd',
    title: 'CI/CD',
    blurb: 'An automated gate that makes "works on my machine" irrelevant.',
    group: 'Shipping',
    timing: 'Wired during Project Setup, on day one.',
    ready: false,
  },
  {
    num: '12',
    cadence: 'Every pull request',
    slug: '12-staging',
    title: 'Staging',
    blurb:
      'See the change running as a real build before anyone who matters can reach it.',
    group: 'Shipping',
    timing: 'Automatically, on every pull request.',
    ready: false,
  },
  {
    num: '13',
    cadence: 'Every merge to main',
    slug: '13-production-deployment',
    title: 'Production Deployment',
    blurb: 'Shipping should be routine, reversible, and boring.',
    group: 'Shipping',
    timing: 'On every merge to main, several times a day.',
    ready: false,
  },
  {
    num: '14',
    cadence: 'Ten minutes after every deploy',
    slug: '14-post-deployment-verification',
    title: 'Post-Deployment Verification',
    blurb: 'The deploy is not finished when it succeeds.',
    group: 'Shipping',
    timing: 'The ten minutes after every production deploy.',
    ready: false,
  },
  {
    num: '15',
    cadence: 'Day one, then continuous',
    slug: '15-observability',
    title: 'Observability',
    blurb: 'Know something is wrong before your users tell you.',
    group: 'Running',
    timing: 'Errors on day one; the rest grows continuously.',
    ready: false,
  },
  {
    num: '16',
    cadence: 'On incident · read before',
    slug: '16-incident-management',
    title: 'Incident Management',
    blurb: 'Restore service first. Understand it second. Prevent it third.',
    group: 'Running',
    timing: 'When production breaks. Read it before that.',
    ready: false,
  },
  {
    num: '17',
    cadence: 'Weekly, small doses',
    slug: '17-maintenance',
    title: 'Maintenance',
    blurb: 'Keep the software healthy so that changing it stays cheap.',
    group: 'Running',
    timing: 'Continuously, in small amounts.',
    ready: false,
  },
  {
    num: '18',
    cadence: 'Every few weeks · loops to 01',
    slug: '18-continuous-improvement',
    title: 'Continuous Improvement',
    blurb: 'Decide what to build next using evidence rather than enthusiasm.',
    group: 'Running',
    timing: 'Continuously, with a deliberate look every few weeks.',
    ready: false,
  },
]

export const STAGE_GROUPS: StageGroup[] = [
  'Before code',
  'Building',
  'Shipping',
  'Running',
]

export function getStage(slug: string): Stage | undefined {
  return STAGES.find((s) => s.slug === slug)
}

export function stagesByGroup(group: StageGroup): Stage[] {
  return STAGES.filter((s) => s.group === group)
}
