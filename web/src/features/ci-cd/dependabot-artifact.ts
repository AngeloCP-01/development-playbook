import type { Artifact } from '@/components/artifact'

export const DEPENDABOT_ARTIFACT: Artifact = {
  id: 'dependabot-config',
  filename: '.github/dependabot.yml',
  language: 'yaml',
  lines: [
    { text: 'version: 2' },
    { text: 'updates:' },
    { text: '  - package-ecosystem: npm' },
    { text: '    directory: /' },
    {
      text: '    schedule: { interval: weekly }',
      note: 'Once a week, not on every push to a dependency’s own repo. A cadence you can actually keep up with.',
    },
    {
      text: '    open-pull-requests-limit: 5',
      note: 'Caps the queue. Without it, a backlog of updates buries your real PRs.',
    },
    {
      text: '    groups:',
      note: 'Ungrouped, you get fifteen pull requests a week, stop reading them, and the automation becomes noise you route around.',
      pivot: true,
    },
    { text: '      dev-dependencies:' },
    { text: '        dependency-type: development' },
    { text: '      production-minor:' },
    { text: '        dependency-type: production' },
    { text: '        update-types: [minor, patch]' },
  ],
}
