// web/src/features/staging/traps.ts
export type Trap = {
  id: string
  title: string
  body: string
}

export const TRAPS: Trap[] = [
  {
    id: 'preview-as-proof',
    title: 'Treating a preview as proof it works in production.',
    body: 'Previews differ in data volume, traffic, cache state, and often environment variables. They catch a great deal. They do not catch "this query is fine on 50 rows and times out on 5 million." That is what Post-Deployment Verification is for.',
  },
  {
    id: 'production-database',
    title: 'Pointing previews at the production database.',
    body: 'It works, right up until the day it deletes something. The convenience is not worth the tail risk.',
  },
  {
    id: 'sterile-seeds',
    title: 'Sterile seed data.',
    body: 'Clean seeds produce clean-looking UIs that shatter on contact with real records. Seed hostile.',
  },
  {
    id: 'staging-habit',
    title: 'Maintaining staging out of habit.',
    body: 'A long-lived staging environment that nobody looks at still costs money, still drifts from production, and still generates alerts. If it has no clear purpose, delete it.',
  },
  {
    id: 'only-changed',
    title: 'Only checking the thing you changed.',
    body: 'The bug is usually next door.',
  },
  {
    id: 'too-small',
    title: 'Skipping the preview when the change is "too small."',
    body: 'Small changes ship unreviewed precisely because they seem safe, which is why they cause a disproportionate share of incidents. Loading the URL takes fifteen seconds.',
  },
]
